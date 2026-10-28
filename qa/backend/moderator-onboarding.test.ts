import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { SqliteD1Database } from './sqlite-d1.ts'

const migrationUrl = new URL('../../migrations/0003_moderator_pre_authorization.sql', import.meta.url)
const identity = { id: 'owner-1', email: 'owner@example.test', role: 'owner' as const }
const moderatorIdentity = { id: 'moderator-1', email: 'mod@example.test', role: 'moderator' as const }

function databaseWithPreauthorizationSchema() {
  const db = new SqliteD1Database()
  db.database.exec(readFileSync(migrationUrl, 'utf8'))
  return db
}

test('moderator preauthorization migration creates constrained, indexed server-side records', async () => {
  const database = databaseWithPreauthorizationSchema()
  try {
    const tables = database.database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{ name: string }>
    assert.ok(tables.some((row) => row.name === 'admin_moderator_pre_authorizations'))
    assert.ok(tables.some((row) => row.name === 'admin_moderator_pre_authorization_events'))
    const columns = database.database.prepare('PRAGMA table_info(admin_moderator_pre_authorizations)').all() as Array<{ name: string }>
    assert.ok(columns.some((column) => column.name === 'email'))
    assert.ok(columns.some((column) => column.name === 'created_by'))
    assert.equal(columns.some((column) => /google_sub/i.test(column.name)), false)
    const indexes = database.database.prepare("SELECT name FROM sqlite_master WHERE type='index'").all() as Array<{ name: string }>
    assert.ok(indexes.some((row) => row.name === 'idx_admin_moderator_preauthorizations_active_email'))
    const eventsForeignKey = database.database.prepare('PRAGMA foreign_key_list(admin_moderator_pre_authorization_events)').all() as Array<{ from: string; on_delete: string }>
    assert.equal(eventsForeignKey.find((key) => key.from === 'authorization_id')?.on_delete, 'RESTRICT')
    await seedOwner(database)
    assert.throws(() => database.database.prepare(`INSERT INTO admin_moderator_pre_authorizations
      (id,email,role,status,created_by,created_at,expires_at) VALUES ('bad-role','a@gmail.com','owner','active','owner-1',1,2)`).run())
  } finally { database.close() }
})

test('owner can preauthorize only a Gmail as a fixed moderator and the event is recorded', async () => {
  const database = databaseWithPreauthorizationSchema()
  const { onRequestPost } = await import('../../functions/api/admin/moderator-preauthorizations/index.ts')
  try {
    await database.prepare(`INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at)
      VALUES (?,?,?,?,1,?,?)`).bind(identity.id, identity.email, 'owner-sub', identity.role, Date.now(), Date.now()).run()
    const response = await onRequestPost(context(database, identity, { email: 'Customer@gmail.com' }))
    assert.equal(response.status, 201)
    const row = await database.prepare(`SELECT email, role, status, created_by
      FROM admin_moderator_pre_authorizations`).first<Record<string, unknown>>()
    assert.equal(row?.email, 'customer@gmail.com')
    assert.equal(row?.role, 'moderator')
    assert.equal(row?.status, 'active')
    assert.equal(row?.created_by, identity.id)
    const columns = database.database.prepare('PRAGMA table_info(admin_moderator_pre_authorizations)').all() as Array<{ name: string }>
    assert.equal(columns.some((column) => column.name === 'google_sub'), false)
    assert.equal((await database.prepare('SELECT COUNT(*) AS count FROM admin_moderator_pre_authorization_events WHERE action = ?').bind('created').first<{ count: number }>())?.count, 1)
    assert.throws(() => database.database.prepare('DELETE FROM admin_moderator_pre_authorizations WHERE email = ?').run('customer@gmail.com'))
  } finally { database.close() }
})

test('moderators, role selection, invalid Gmail, and duplicate preauthorization cannot create access', async () => {
  const database = databaseWithPreauthorizationSchema()
  const { onRequestPost } = await import('../../functions/api/admin/moderator-preauthorizations/index.ts')
  try {
    await database.prepare(`INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at)
      VALUES (?,?,?,?,1,?,?)`).bind(identity.id, identity.email, 'owner-sub', identity.role, Date.now(), Date.now()).run()
    assert.equal((await onRequestPost(context(database, moderatorIdentity, { email: 'customer@gmail.com' }))).status, 403)
    assert.equal((await onRequestPost(context(database, identity, { email: 'customer@gmail.com', role: 'owner' }))).status, 400)
    assert.equal((await onRequestPost(context(database, identity, { email: 'customer@example.test' }))).status, 400)
    assert.equal((await onRequestPost(context(database, identity, { email: 'customer@gmail.com' }))).status, 201)
    assert.equal((await onRequestPost(context(database, identity, { email: 'customer@gmail.com' }))).status, 409)
    assert.equal((await database.prepare('SELECT COUNT(*) AS count FROM admin_users').first<{ count: number }>())?.count, 1)
    assert.equal((await database.prepare('SELECT COUNT(*) AS count FROM admin_moderator_pre_authorizations').first<{ count: number }>())?.count, 1)
  } finally { database.close() }
})

test('owner can inspect and revoke a preauthorization, while Moderator cannot access that workflow', async () => {
  const database = databaseWithPreauthorizationSchema()
  const routes = await import('../../functions/api/admin/moderator-preauthorizations/index.ts')
  const { onRequestDelete } = await import('../../functions/api/admin/moderator-preauthorizations/[authorizationId].ts')
  try {
    await seedOwner(database)
    const create = await routes.onRequestPost(context(database, identity, { email: 'customer@gmail.com' }))
    const created = await create.json()
    const listed = await routes.onRequestGet(context(database, identity, {}))
    assert.equal(listed.status, 200)
    const listBody = await listed.json()
    assert.equal(listBody.data.authorizations[0].email, 'customer@gmail.com')
    assert.equal('googleSub' in listBody.data.authorizations[0], false)
    assert.equal((await routes.onRequestGet(context(database, moderatorIdentity, {}))).status, 403)

    const revoked = await onRequestDelete({ ...context(database, identity, {}), params: { authorizationId: created.data.id } })
    assert.equal(revoked.status, 200)
    assert.equal((await database.prepare("SELECT status FROM admin_moderator_pre_authorizations WHERE id = ?").bind(created.data.id).first<{ status: string }>())?.status, 'revoked')
    assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM admin_moderator_pre_authorization_events WHERE action = 'revoked'").first<{ count: number }>())?.count, 1)
  } finally { database.close() }
})

test('preauthorization activation binds the verified subject once and atomically writes user plus audit events', async () => {
  const database = databaseWithPreauthorizationSchema()
  const { activatePreauthorizedModerator } = await import('../../functions/api/auth/moderator-activation.ts')
  try {
    await seedOwner(database)
    await createAuthorization(database)
    const activated = await activatePreauthorizedModerator(database, 'customer@gmail.com', 'customer-google-sub', 1_800_000_000_000, () => 'new-moderator-id')
    assert.equal(activated?.id, 'new-moderator-id')
    assert.equal(activated?.email, 'customer@gmail.com')
    assert.equal(activated?.role, 'moderator')
    assert.equal((await activatePreauthorizedModerator(database, 'customer@gmail.com', 'other-google-sub', 1_800_000_000_001)), null)
    assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM admin_users WHERE role='moderator'").first<{ count: number }>())?.count, 1)
    assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM admin_auth_events WHERE action='user_created'").first<{ count: number }>())?.count, 1)
    assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM admin_moderator_pre_authorization_events WHERE action='activated'").first<{ count: number }>())?.count, 1)
    assert.equal((await database.prepare('SELECT status FROM admin_moderator_pre_authorizations').first<{ status: string }>())?.status, 'consumed')
  } finally { database.close() }
})

test('concurrent first-login attempts consume one authorization and create at most one Moderator', async () => {
  const database = databaseWithPreauthorizationSchema()
  const { activatePreauthorizedModerator } = await import('../../functions/api/auth/moderator-activation.ts')
  try {
    await seedOwner(database)
    await createAuthorization(database)
    const outcomes = await Promise.all([
      activatePreauthorizedModerator(database, 'customer@gmail.com', 'customer-google-sub', 1_800_000_000_000, () => 'concurrent-mod-1'),
      activatePreauthorizedModerator(database, 'customer@gmail.com', 'customer-google-sub', 1_800_000_000_000, () => 'concurrent-mod-2'),
    ])
    assert.equal(outcomes.filter(Boolean).length, 1)
    assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM admin_users WHERE role = 'moderator'").first<{ count: number }>())?.count, 1)
    assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM admin_auth_events WHERE action = 'user_created'").first<{ count: number }>())?.count, 1)
    assert.equal((await database.prepare("SELECT COUNT(*) AS count FROM admin_moderator_pre_authorization_events WHERE action = 'activated'").first<{ count: number }>())?.count, 1)
  } finally { database.close() }
})

test('expired authorization, email mismatch, and existing account cannot bind or elevate a Google subject', async () => {
  const database = databaseWithPreauthorizationSchema()
  const { activatePreauthorizedModerator } = await import('../../functions/api/auth/moderator-activation.ts')
  try {
    await seedOwner(database)
    await createAuthorization(database, { expiresAt: 1_799_999_999_999 })
    assert.equal(await activatePreauthorizedModerator(database, 'customer@gmail.com', 'customer-google-sub', 1_800_000_000_000), null)
    assert.equal(await activatePreauthorizedModerator(database, 'other@gmail.com', 'customer-google-sub', 1_800_000_000_000), null)
    await createAuthorization(database, { id: 'auth-2', email: 'existing@gmail.com' })
    await database.prepare(`INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at)
      VALUES (?,?,?,?,1,?,?)`).bind('existing-mod', 'existing@gmail.com', 'other-sub', 'moderator', Date.now(), Date.now()).run()
    assert.equal(await activatePreauthorizedModerator(database, 'existing@gmail.com', 'new-sub', 1_800_000_000_000), null)
    assert.equal((await database.prepare("SELECT google_sub FROM admin_users WHERE email='existing@gmail.com'").first<{ google_sub: string }>())?.google_sub, 'other-sub')
  } finally { database.close() }
})

test('activation batch rolls back account and preauthorization state if audit insertion fails', async () => {
  const database = databaseWithPreauthorizationSchema()
  const { activatePreauthorizedModerator } = await import('../../functions/api/auth/moderator-activation.ts')
  try {
    await seedOwner(database)
    await createAuthorization(database)
    database.database.exec(`CREATE TRIGGER fail_moderator_user_created BEFORE INSERT ON admin_auth_events
      WHEN NEW.action = 'user_created' BEGIN SELECT RAISE(ABORT, 'synthetic audit failure'); END`)
    await assert.rejects(() => activatePreauthorizedModerator(database, 'customer@gmail.com', 'customer-google-sub', 1_800_000_000_000))
    assert.equal((await database.prepare('SELECT COUNT(*) AS count FROM admin_users').first<{ count: number }>())?.count, 1)
    assert.equal((await database.prepare("SELECT status FROM admin_moderator_pre_authorizations").first<{ status: string }>())?.status, 'active')
  } finally { database.close() }
})

function context(database: SqliteD1Database, admin: typeof identity | typeof moderatorIdentity, body: unknown) {
  return {
    request: new Request('https://ruang-ibu.test/api/admin/moderator-preauthorizations', {
      method: 'POST', headers: { Origin: 'https://ruang-ibu.test', 'Sec-Fetch-Site': 'same-origin', 'Content-Type': 'application/json' }, body: JSON.stringify(body),
    }),
    env: { DB: database }, params: {}, data: { admin }, next: async () => new Response(),
  }
}

async function seedOwner(database: SqliteD1Database) {
  await database.prepare(`INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at)
    VALUES (?,?,?,?,1,?,?)`).bind(identity.id, identity.email, 'owner-sub', 'owner', Date.now(), Date.now()).run()
}

async function createAuthorization(database: SqliteD1Database, options: { id?: string; email?: string; expiresAt?: number } = {}) {
  await database.prepare(`INSERT INTO admin_moderator_pre_authorizations
    (id,email,role,status,created_by,created_at,expires_at)
    VALUES (?,?,'moderator','active',?,?,?)`)
    .bind(options.id ?? 'auth-1', options.email ?? 'customer@gmail.com', identity.id, 1_799_000_000_000, options.expiresAt ?? 1_900_000_000_000).run()
}
