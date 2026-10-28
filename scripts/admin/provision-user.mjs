#!/usr/bin/env node
import { randomUUID } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFile } from 'node:fs/promises'
import { join, resolve } from 'node:path'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const root = resolve(import.meta.dirname, '../..')
const configPath = join(root, 'wrangler.toml')
const databaseName = 'ruang-ibu-staging'
const databaseId = '125bcaa1-014f-43ad-8600-05e1c4341c76'
const role = process.argv[2]
const executeFlag = process.argv[3]
const expectedConfirmation = 'CREATE ADMIN IN PREVIEW STAGING'

if (process.argv.length !== 4 || !['owner', 'moderator'].includes(role) || executeFlag !== '--execute-preview') {
  console.error('Usage: node scripts/admin/provision-user.mjs <owner|moderator> --execute-preview')
  process.exit(2)
}

function assertPreviewDatabaseBinding(config) {
  let currentTable = ''
  let previewBinding = ''
  let nonPreviewHasD1 = false
  for (const line of config.split(/\r?\n/u)) {
    const table = line.match(/^\[\[?([^\]]+)\]\]?$/u)
    if (table) {
      currentTable = table[1]
      if ((currentTable === 'd1_databases' || currentTable.endsWith('.d1_databases'))
        && currentTable !== 'env.preview.d1_databases') nonPreviewHasD1 = true
    } else if (currentTable === 'env.preview.d1_databases') previewBinding += `${line}\n`
  }
  if (!previewBinding.includes(`database_name = "${databaseName}"`)
    || !previewBinding.includes(`database_id = "${databaseId}"`)
    || !previewBinding.includes('binding = "DB"')
    || nonPreviewHasD1) {
    throw new Error('Preview D1 configuration does not match the reviewed staging database; no command was run.')
  }
}

function runWranglerSql(sql) {
  try {
    const output = execFileSync(process.execPath, [
      join(root, 'node_modules', 'wrangler', 'bin', 'wrangler.js'),
      'd1', 'execute', databaseName,
      '--remote', '--env', 'preview', '--config', configPath,
      '--command', sql, '--json',
    ], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      timeout: 120_000,
      maxBuffer: 2 * 1024 * 1024,
    })
    return JSON.parse(output)
  } catch {
    // Wrangler output is deliberately withheld: it can contain SQL diagnostics.
    throw new Error('Preview D1 operation failed. No query text or identity input was written to the terminal.')
  }
}

function firstResultValue(result, key) {
  const value = result?.[0]?.results?.[0]?.[key]
  return Number.isSafeInteger(value) && value >= 0 ? value : null
}

function quoteSql(value) { return `'${value.replaceAll("'", "''")}'` }

function buildProvisionSql({ id, eventId, email, googleSub, now, assignedRole }) {
  const userInsert = assignedRole === 'owner'
    ? `INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at)
SELECT ${quoteSql(id)},${quoteSql(email)},${quoteSql(googleSub)},'owner',1,${now},${now}
WHERE NOT EXISTS (SELECT 1 FROM admin_users);`
    : `INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at,created_by)
SELECT ${quoteSql(id)},${quoteSql(email)},${quoteSql(googleSub)},'moderator',1,${now},${now},id
FROM admin_users WHERE role='owner' AND is_active=1 ORDER BY created_at LIMIT 1;`
  const auditInsert = `INSERT INTO admin_auth_events (event_id,admin_user_id,action,created_at,metadata_json)
SELECT ${quoteSql(eventId)},id,'user_created',${now},${quoteSql(JSON.stringify({ role: assignedRole }))}
FROM admin_users WHERE id=${quoteSql(id)};`
  return `${userInsert}\n${auditInsert}`
}

async function run() {
  const config = await readFile(configPath, 'utf8')
  assertPreviewDatabaseBinding(config)

  const preflight = runWranglerSql(`
    SELECT
      (SELECT COUNT(*) FROM admin_users) AS admin_count,
      (SELECT COUNT(*) FROM admin_users WHERE role='owner') AS owner_count,
      (SELECT COUNT(*) FROM admin_users WHERE role='owner' AND is_active=1) AS active_owner_count;
  `)
  const adminCount = firstResultValue(preflight, 'admin_count')
  const ownerCount = firstResultValue(preflight, 'owner_count')
  const activeOwnerCount = firstResultValue(preflight, 'active_owner_count')
  if (adminCount === null || ownerCount === null || activeOwnerCount === null) {
    throw new Error('Read-only preflight result was invalid; no account was created.')
  }
  if (role === 'owner' && adminCount !== 0) {
    throw new Error('Owner bootstrap stopped: admin_users is not empty. Existing accounts were not changed.')
  }
  if (role === 'moderator' && activeOwnerCount !== 1) {
    throw new Error('Moderator provisioning stopped: exactly one active owner is required.')
  }

  const readline = createInterface({ input: stdin, output: stdout })
  try {
    const email = (await readline.question('Email Google yang telah diverifikasi: ')).trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email) || email.length > 254) throw new Error('Email format is invalid.')
    const googleSub = (await readline.question('Google OIDC sub hasil verifikasi privat: ')).trim()
    if (!/^[A-Za-z0-9_-]{1,255}$/u.test(googleSub)) throw new Error('Google subject format is invalid.')
    console.log(`Target is Preview D1 ${databaseName} (${databaseId}); role will be ${role}.`)
    console.log('Input is kept in process memory; do not paste values into a command, issue, chat, or log.')
    const confirmation = await readline.question(`Ketik tepat ${expectedConfirmation}: `)
    if (confirmation !== expectedConfirmation) throw new Error('Confirmation did not match; no command was run.')

    const now = Date.now()
    const id = randomUUID()
    const sql = buildProvisionSql({ id, eventId: randomUUID(), email, googleSub, now, assignedRole: role })
    const results = runWranglerSql(sql)
    const inserted = results?.[0]?.meta?.changes
    const auditRecorded = results?.[1]?.meta?.changes
    if (inserted !== 1) throw new Error('Provisioning did not create a new account; no existing account was modified.')
    if (auditRecorded !== 1) throw new Error('Account creation occurred but audit confirmation failed. Stop and contact the database operator; do not retry.')
    console.log('Provisioning succeeded and its authentication audit event was recorded. No identity values were echoed.')
  } finally {
    readline.close()
  }
}

run().catch((error) => {
  console.error(error instanceof Error ? error.message : 'Provisioning stopped safely.')
  process.exitCode = 1
})
