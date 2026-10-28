import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { test } from 'node:test'
import {
  assertProductionD1Target,
  inspectFirstProductionOwner,
  provisionFirstProductionOwner,
  verifyProductionOwnerIdentity,
} from '../../scripts/admin/production-owner-provisioning.mjs'
import { readQaGoogleClientId } from '../../scripts/admin/verify-production-owner-identity.mjs'

const migrationFiles = [
  new URL('../../migrations/0001_questions.sql', import.meta.url),
  new URL('../../migrations/0002_admin_auth.sql', import.meta.url),
]

function createLocalD1({ failOnAudit = false } = {}) {
  const db = new DatabaseSync(':memory:')
  for (const migration of migrationFiles) db.exec(readFileSync(migration, 'utf8'))

  return {
    db,
    prepare(sql) {
      return {
        bind(...values) {
          return {
            first() {
              return db.prepare(sql).get(...values)
            },
            run() {
              return db.prepare(sql).run(...values)
            },
            sql,
            values,
          }
        },
      }
    },
    batch(statements) {
      db.exec('BEGIN')
      try {
        const results = statements.map((statement) => {
          if (failOnAudit && statement.sql.includes('INSERT INTO admin_auth_events')) {
            throw new Error('synthetic audit insert failure')
          }
          const result = db.prepare(statement.sql).run(...statement.values)
          return { meta: { changes: Number(result.changes) } }
        })
        db.exec('COMMIT')
        return results
      } catch (error) {
        db.exec('ROLLBACK')
        throw error
      }
    },
  }
}

const validInput = {
  email: 'owner@gmail.com',
  googleSub: 'verified-google-sub-123',
  confirmation: 'CREATE FIRST PRODUCTION OWNER',
}

const verifiedClaims = {
  sub: 'verified-google-sub-123',
  email: 'owner@gmail.com',
  email_verified: true,
  iss: 'https://accounts.google.com',
  aud: 'qa-client.apps.googleusercontent.com',
  nonce: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
  exp: 1_798_000_100,
  iat: 1_798_000_000,
}

test('Owner identity verifier selects only the local-authorized Preview OAuth client', () => {
  const config = `[env.production.vars]\nGOOGLE_OAUTH_CLIENT_ID = "production.apps.googleusercontent.com"\n\n[env.preview.vars]\nGOOGLE_OAUTH_CLIENT_ID = "qa.apps.googleusercontent.com"\n`
  assert.equal(readQaGoogleClientId(config), 'qa.apps.googleusercontent.com')
  assert.throws(() => readQaGoogleClientId('[env.production.vars]\nGOOGLE_OAUTH_CLIENT_ID = "prod.apps.googleusercontent.com"'), /Preview OAuth client is unavailable/u)
})

test('Owner identity is accepted only when verified Google claims match the privately confirmed email', async () => {
  const identity = await verifyProductionOwnerIdentity({
    credential: 'synthetic-token',
    nonce: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
    clientId: 'qa-client.apps.googleusercontent.com',
    expectedEmail: 'OWNER@gmail.com',
    now: () => 1_798_000_000_000,
    verifyCredential: async (credential, nonce, audience) => {
      assert.equal(credential, 'synthetic-token')
      assert.equal(nonce, 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA')
      assert.equal(audience, 'qa-client.apps.googleusercontent.com')
      return verifiedClaims
    },
  })
  assert.deepEqual(identity, { email: 'owner@gmail.com', googleSub: 'verified-google-sub-123' })
})

test('Owner identity verification rejects mismatched email, audience, issuer, nonce, expiry, and unverified email', async () => {
  for (const changes of [
    { email: 'other@gmail.com' },
    { email: 'owner@example.test' },
    { aud: 'production-client.apps.googleusercontent.com' },
    { iss: 'https://accounts.example.invalid' },
    { nonce: 'wrong-nonce' },
    { exp: 1_797_999_999 },
    { email_verified: false },
  ]) {
    await assert.rejects(verifyProductionOwnerIdentity({
      credential: 'synthetic-token',
      nonce: 'AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA',
      clientId: 'qa-client.apps.googleusercontent.com',
      expectedEmail: 'owner@gmail.com',
      now: () => 1_798_000_000_000,
      verifyCredential: async () => ({ ...verifiedClaims, ...changes }),
    }), /identity verification failed/u)
  }
})

test('Production database target guard refuses wrong account, database name, or UUID', () => {
  const expected = {
    accountId: '32a9a8d36173f8af3e9f404956e7b7d7',
    databaseName: 'ruang-ibu-production',
    databaseId: '2b9c3de9-eafb-4842-a613-27eab7ae7174',
  }
  assert.equal(assertProductionD1Target(expected), true)
  for (const changed of [
    { ...expected, accountId: 'wrong-account' },
    { ...expected, databaseName: 'ruang-ibu-staging' },
    { ...expected, databaseId: '125bcaa1-014f-43ad-8600-05e1c4341c76' },
  ]) assert.throws(() => assertProductionD1Target(changed), /Production D1 target mismatch/u)
})

test('Production owner bootstrap creates one owner and its audit event in a D1 batch', async () => {
  const d1 = createLocalD1()
  try {
    const result = await provisionFirstProductionOwner(d1, validInput, {
      idFactory: () => 'owner-id-1',
      now: () => 1_798_000_000_000,
    })
    assert.deepEqual(result, { created: true })
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM admin_users').get().count, 1)
    assert.equal(d1.db.prepare("SELECT COUNT(*) AS count FROM admin_users WHERE role='owner' AND is_active=1").get().count, 1)
    assert.equal(d1.db.prepare("SELECT COUNT(*) AS count FROM admin_auth_events WHERE action='user_created'").get().count, 1)
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM questions').get().count, 0)
    assert.deepEqual(await inspectFirstProductionOwner(d1), {
      adminCount: 1,
      ownerCount: 1,
      moderatorCount: 0,
      userCreatedEventCount: 1,
      ownerCreationEventCount: 1,
      canCreateFirstOwner: false,
    })
  } finally {
    d1.db.close()
  }
})

test('Production owner dry-run returns only aggregate readiness and performs no writes', async () => {
  const d1 = createLocalD1()
  try {
    assert.deepEqual(await inspectFirstProductionOwner(d1), {
      adminCount: 0,
      ownerCount: 0,
      moderatorCount: 0,
      userCreatedEventCount: 0,
      ownerCreationEventCount: 0,
      canCreateFirstOwner: true,
    })
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM admin_users').get().count, 0)
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM admin_auth_events').get().count, 0)
  } finally {
    d1.db.close()
  }
})

test('Production owner bootstrap refuses an orphaned prior user-created audit event', async () => {
  const d1 = createLocalD1()
  try {
    d1.db.prepare("INSERT INTO admin_auth_events (event_id, admin_user_id, action, created_at, metadata_json) VALUES ('prior-event', NULL, 'user_created', 1, '{}')").run()
    const state = await inspectFirstProductionOwner(d1)
    assert.equal(state.userCreatedEventCount, 1)
    assert.equal(state.canCreateFirstOwner, false)
    await assert.rejects(provisionFirstProductionOwner(d1, validInput), /database is not empty/u)
  } finally {
    d1.db.close()
  }
})

test('Production owner bootstrap refuses an existing account without changing it', async () => {
  const d1 = createLocalD1()
  try {
    d1.db.prepare("INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at) VALUES ('existing','existing@example.test','existing-sub','owner',1,1,1)").run()
    await assert.rejects(provisionFirstProductionOwner(d1, validInput), /database is not empty/u)
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM admin_users').get().count, 1)
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM admin_auth_events').get().count, 0)
  } finally {
    d1.db.close()
  }
})

test('Production owner bootstrap rolls back user creation if audit insertion fails', async () => {
  const d1 = createLocalD1({ failOnAudit: true })
  try {
    await assert.rejects(provisionFirstProductionOwner(d1, validInput, {
      idFactory: () => 'owner-id-rollback',
      now: () => 1_798_000_000_000,
    }), /stopped safely/u)
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM admin_users').get().count, 0)
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM admin_auth_events').get().count, 0)
  } finally {
    d1.db.close()
  }
})

test('Production owner bootstrap requires exact confirmation and valid private identity fields', async () => {
  const d1 = createLocalD1()
  try {
    for (const input of [
      { ...validInput, confirmation: 'CREATE OWNER' },
      { ...validInput, email: 'not-an-email' },
      { ...validInput, googleSub: 'bad sub' },
    ]) {
      await assert.rejects(provisionFirstProductionOwner(d1, input), /invalid provisioning input/u)
    }
    assert.equal(d1.db.prepare('SELECT COUNT(*) AS count FROM admin_users').get().count, 0)
  } finally {
    d1.db.close()
  }
})
