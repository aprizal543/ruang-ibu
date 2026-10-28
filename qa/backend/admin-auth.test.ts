import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT } from 'jose'
import { SqliteD1Database } from './sqlite-d1.ts'

const authModule = await import('../../functions/api/auth/_shared.ts').catch(() => null)
const challengeModule = await import('../../functions/api/auth/google/challenge.ts').catch(() => null)
const googleModule = await import('../../functions/api/auth/google.ts').catch(() => null)
const sessionModule = await import('../../functions/api/auth/session.ts').catch(() => null)
const logoutModule = await import('../../functions/api/auth/logout.ts').catch(() => null)
const adminMiddleware = await import('../../functions/api/admin/_middleware.ts').catch(() => null)

const authKey = 'local-only-test-auth-throttle-key-0123456789'
const clientId = '123456789-test.apps.googleusercontent.com'
const email = 'owner@example.test'
const sub = 'google-sub-owner-123456789'
const nowSeconds = () => Math.floor(Date.now() / 1000)
const { privateKey, publicKey } = await generateKeyPair('RS256', { modulusLength: 2048 })
const publicJwk = await exportJWK(publicKey)
publicJwk.kid = 'synthetic-test-key'
publicJwk.alg = 'RS256'
publicJwk.use = 'sig'
const localKeySet = createLocalJWKSet({ keys: [publicJwk] })

function request(path: string, method = 'GET', body?: unknown, cookie?: string, origin = 'https://ruang-ibu.test', fetchSite = 'same-origin') {
  return new Request(`https://ruang-ibu.test${path}`, {
    method,
    headers: {
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(cookie ? { Cookie: cookie } : {}),
      ...(method === 'GET' ? {} : { Origin: origin, 'Sec-Fetch-Site': fetchSite }),
      'CF-Connecting-IP': '192.0.2.10',
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })
}

function env(database: SqliteD1Database, overrides: Record<string, unknown> = {}) {
  return { DB: database, ADMIN_AUTH_HMAC_KEY: authKey, GOOGLE_OAUTH_CLIENT_ID: clientId, ...overrides }
}

function context(req: Request, environment: Record<string, unknown>, next: () => Promise<Response> = async () => Response.json({ ok: true })) {
  return { request: req, env: environment, params: {}, data: {}, next }
}

async function seedUser(database: SqliteD1Database, options: { id?: string; email?: string; sub?: string; role?: 'owner' | 'moderator'; active?: number } = {}) {
  const now = Date.now()
  await database.prepare(`INSERT INTO admin_users (id, email, google_sub, role, is_active, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?)`)
    .bind(options.id ?? 'admin-owner-1', options.email ?? email, options.sub ?? sub, options.role ?? 'owner', options.active ?? 1, now, now).run()
}

async function makeToken(nonce: string, claims: Record<string, unknown> = {}, opts: { issuer?: string; audience?: string | string[]; expires?: number; algorithm?: string; subject?: string } = {}) {
  const token = new SignJWT({ email, email_verified: true, nonce, ...claims })
    .setProtectedHeader({ alg: opts.algorithm ?? 'RS256', kid: 'synthetic-test-key' })
    .setIssuer(opts.issuer ?? 'https://accounts.google.com')
    .setAudience(opts.audience ?? clientId)
    .setSubject(opts.subject ?? sub)
    .setIssuedAt(nowSeconds())
    .setExpirationTime(opts.expires ?? nowSeconds() + 120)
  return token.sign(privateKey)
}

async function issueChallenge(database: SqliteD1Database, environment = env(database)) {
  return challengeModule.onRequestPost(context(request('/api/auth/google/challenge', 'POST', {}), environment))
}

async function googleLogin(database: SqliteD1Database, nonce: string, credential: string, environment = env(database), origin?: string, fetchSite = 'same-origin') {
  const req = request('/api/auth/google', 'POST', { credential, nonce }, undefined, origin ?? 'https://ruang-ibu.test', fetchSite)
  return googleModule.createGoogleLoginHandler(() => localKeySet)(context(req, environment))
}

function cookieFrom(response: Response): string {
  const value = response.headers.get('Set-Cookie')
  assert.ok(value, 'response sets a session cookie')
  return value.split(';', 1)[0]
}

test('Google OIDC modules, D1 migration and session middleware are present', () => {
  assert.ok(authModule)
  assert.ok(challengeModule)
  assert.ok(googleModule)
  assert.ok(sessionModule)
  assert.ok(logoutModule)
  assert.ok(adminMiddleware)
})
test('OIDC schema is idempotent, binds unique Google subjects, and retains session, role and audit constraints', async () => {
  const sql = await readFile(new URL('../../migrations/0002_admin_auth.sql', import.meta.url), 'utf8')
  const database = new SqliteD1Database()
  const columns = database.database.prepare('PRAGMA table_info(admin_users)').all() as Array<{ name: string }>
  assert.ok(columns.some((column) => column.name === 'google_sub'))
  assert.equal(columns.some((column) => /password/i.test(column.name)), false)
  assert.ok(!/password_hash|password_changed_at/u.test(sql))
  await seedUser(database)
  await assert.rejects(() => seedUser(database, { id: 'duplicate-sub-user', email: 'other@example.test', sub }))
  await assert.rejects(() => database.prepare(`INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at)
    VALUES ('bad-role-user','bad@example.test','different-google-sub','administrator',1,1,1)`).run())
  const tables = database.database.prepare("SELECT name FROM sqlite_master WHERE type='table'").all() as Array<{ name: string }>
  for (const name of ['admin_sessions', 'admin_login_throttles', 'admin_login_nonces', 'admin_auth_events']) assert.ok(tables.some((table) => table.name === name))
  database.close()
})

test('private provisioning uses a verified Google subject and offers no password or public registration flow', async () => {
  const script = await readFile(new URL('../../scripts/admin/provision-user.mjs', import.meta.url), 'utf8')
  assert.match(script, /--execute-preview/u)
  assert.match(script, /ruang-ibu-staging/u)
  assert.match(script, /google_sub/u)
  assert.match(script, /CREATE ADMIN IN PREVIEW STAGING/u)
  assert.match(script, /--command/u)
  assert.match(script, /WHERE NOT EXISTS \(SELECT 1 FROM admin_users\)/u)
  assert.doesNotMatch(script, /writeFile|provision\.sql|--file/u)
  assert.doesNotMatch(script, /console\.(?:log|error|warn)\([^\n]*(?:email|googleSub)/iu)
  assert.doesNotMatch(script, /password_hash|pbkdf2|hiddenInput|--password|default password/iu)
  await assert.rejects(readFile(new URL('../../functions/api/auth/login.ts', import.meta.url)))
  await assert.rejects(readFile(new URL('../../functions/api/auth/change-password.ts', import.meta.url)))
  await assert.rejects(readFile(new URL('../../functions/api/auth/register.ts', import.meta.url)))
})

test('public service-worker precache excludes admin chunks and CSP permits only the required Google GIS and Turnstile sources', async () => {
  const vite = await readFile(new URL('../../vite.config.ts', import.meta.url), 'utf8')
  const headers = await readFile(new URL('../../public/_headers', import.meta.url), 'utf8')
  for (const chunk of ['AdminLayout', 'AdminPages', 'AdminLoginPage', 'authApi', 'auth-context']) assert.match(vite, new RegExp(`\\*\\*\\/${chunk}-\\*\\.js`))
  assert.match(headers, /accounts\.google\.com\/gsi\/client/u)
  assert.match(headers, /accounts\.google\.com\/gsi\//u)
  assert.match(headers, /script-src[^\n]*https:\/\/challenges\.cloudflare\.com/u)
  assert.match(headers, /connect-src[^\n]*https:\/\/challenges\.cloudflare\.com/u)
  assert.match(headers, /frame-src[^\n]*https:\/\/challenges\.cloudflare\.com/u)
  assert.match(headers, /frame-ancestors 'none'/u)
})

test('a valid Google token bound to an unconsumed nonce creates only an opaque D1-backed session', async () => {
  const database = new SqliteD1Database()
  await seedUser(database)
  const challenge = await issueChallenge(database)
  const challengeData = await challenge.json()
  assert.equal(challenge.status, 200)
  assert.equal(challenge.headers.get('Cache-Control'), 'no-store')
  assert.equal(challengeData.data.clientId, clientId)
  const credential = await makeToken(challengeData.data.nonce)
  const response = await googleLogin(database, challengeData.data.nonce, credential)
  const cookie = cookieFrom(response)
  const sessionToken = cookie.split('=', 2)[1]
  const session = await database.prepare('SELECT session_hash FROM admin_sessions').first<{ session_hash: string }>()
  const body = await response.json()
  assert.equal(response.status, 200)
  assert.match(response.headers.get('Set-Cookie') ?? '', /^__Host-ruang_ibu_session=[A-Za-z0-9_-]{43}; Path=\/; HttpOnly; Secure; SameSite=Strict; Max-Age=28800$/u)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.equal(session?.session_hash, await authModule.hashSessionToken(sessionToken))
  assert.equal(JSON.stringify(body).includes(credential), false)
  assert.deepEqual(body.data.user, { id: 'admin-owner-1', email, role: 'owner' })
  const nonce = await database.prepare('SELECT consumed_at FROM admin_login_nonces').first<{ consumed_at: number | null }>()
  assert.ok(nonce?.consumed_at)
  database.close()
})

test('invalid signature, forged compact token, wrong audience, wrong issuer and expired credentials are rejected', async () => {
  const variants: Array<{ label: string; token: (nonce: string) => Promise<string> }> = [
    { label: 'forged token', token: async () => 'eyJhbGciOiJub25lIn0.eyJzdWIiOiJhdHRhY2tlciJ9.' },
    { label: 'wrong audience', token: (nonce) => makeToken(nonce, {}, { audience: 'attacker.apps.googleusercontent.com' }) },
    { label: 'wrong issuer', token: (nonce) => makeToken(nonce, {}, { issuer: 'https://accounts.attacker.test' }) },
    { label: 'expired token', token: (nonce) => makeToken(nonce, {}, { expires: nowSeconds() - 30 }) },
  ]
  for (const variant of variants) {
    const database = new SqliteD1Database()
    await seedUser(database)
    const challenge = await (await issueChallenge(database)).json()
    const response = await googleLogin(database, challenge.data.nonce, await variant.token(challenge.data.nonce))
    assert.equal(response.status, 401, variant.label)
    assert.equal(response.headers.get('Set-Cookie'), null, variant.label)
    assert.equal(response.headers.get('Cache-Control'), 'no-store', variant.label)
    database.close()
  }
  const database = new SqliteD1Database()
  await seedUser(database)
  const challenge = await (await issueChallenge(database)).json()
  const { privateKey: unrelatedPrivateKey } = await generateKeyPair('RS256', { modulusLength: 2048 })
  const signedByUnrelatedKey = await new SignJWT({ email, email_verified: true, nonce: challenge.data.nonce })
    .setProtectedHeader({ alg: 'RS256', kid: 'synthetic-test-key' })
    .setIssuer('https://accounts.google.com').setAudience(clientId).setSubject(sub)
    .setIssuedAt(nowSeconds()).setExpirationTime(nowSeconds() + 120).sign(unrelatedPrivateKey)
  assert.equal((await googleLogin(database, challenge.data.nonce, signedByUnrelatedKey)).status, 401)
  database.close()
})

test('email_verified and a matching OIDC nonce are required; nonce replay is rejected once consumed', async () => {
  const database = new SqliteD1Database()
  await seedUser(database)
  const challenge = await (await issueChallenge(database)).json()
  const unverified = await googleLogin(database, challenge.data.nonce, await makeToken(challenge.data.nonce, { email_verified: false }))
  assert.equal(unverified.status, 401)

  const freshChallenge = await (await issueChallenge(database)).json()
  const mismatchedNonceToken = await makeToken('different-signed-nonce')
  assert.equal((await googleLogin(database, freshChallenge.data.nonce, mismatchedNonceToken)).status, 401)

  const replayChallenge = await (await issueChallenge(database)).json()
  const replayToken = await makeToken(replayChallenge.data.nonce)
  assert.equal((await googleLogin(database, replayChallenge.data.nonce, replayToken)).status, 200)
  const replay = await googleLogin(database, replayChallenge.data.nonce, replayToken)
  assert.equal(replay.status, 401)
  assert.equal((await database.prepare('SELECT COUNT(*) AS count FROM admin_sessions').first<{ count: number }>())?.count, 1)
  database.close()
})

test('unknown Google sub and disabled account receive the same generic response and never create sessions', async () => {
  const database = new SqliteD1Database()
  await seedUser(database)
  const unknownChallenge = await (await issueChallenge(database)).json()
  const unknown = await googleLogin(database, unknownChallenge.data.nonce, await makeToken(unknownChallenge.data.nonce, {}, { subject: 'not-provisioned-sub' }))
  await database.prepare('UPDATE admin_users SET is_active = 0 WHERE id = ?').bind('admin-owner-1').run()
  const disabledChallenge = await (await issueChallenge(database)).json()
  const disabled = await googleLogin(database, disabledChallenge.data.nonce, await makeToken(disabledChallenge.data.nonce))
  assert.equal(unknown.status, 401)
  assert.equal(disabled.status, 401)
  assert.deepEqual(await unknown.json(), await disabled.json())
  assert.equal(unknown.headers.get('Set-Cookie'), null)
  assert.equal((await database.prepare('SELECT COUNT(*) AS count FROM admin_sessions').first<{ count: number }>())?.count, 0)
  database.close()
})

test('Google identity role comes from D1; body and signed optional role claims cannot elevate a moderator', async () => {
  const database = new SqliteD1Database()
  await seedUser(database, { id: 'admin-moderator-1', email: 'moderator@example.test', sub: 'google-sub-moderator', role: 'moderator' })
  const challenge = await (await issueChallenge(database)).json()
  const credential = await makeToken(challenge.data.nonce, { role: 'owner' }, { subject: 'google-sub-moderator' })
  const response = await googleLogin(database, challenge.data.nonce, credential)
  assert.equal(response.status, 200)
  assert.equal((await response.json()).data.user.role, 'moderator')
  const middleware = adminMiddleware.createAdminSessionMiddleware()
  const forbiddenDelete = await middleware(context(request('/api/admin/questions/q1', 'DELETE', undefined, cookieFrom(response)), env(database)))
  assert.equal(forbiddenDelete.status, 403)
  assert.equal(forbiddenDelete.headers.get('Cache-Control'), 'no-store')
  database.close()
})

test('Google challenge and login require exact Origin and same-origin Fetch Metadata', async () => {
  const database = new SqliteD1Database()
  const crossOrigin = await challengeModule.onRequestPost(context(request('/api/auth/google/challenge', 'POST', undefined, undefined, 'https://attacker.test'), env(database)))
  const noFetchMetadata = await challengeModule.onRequestPost(context(new Request('https://ruang-ibu.test/api/auth/google/challenge', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://ruang-ibu.test', 'CF-Connecting-IP': '192.0.2.10' }, body: '{}' }), env(database)))
  assert.equal(crossOrigin.status, 403)
  assert.equal(noFetchMetadata.status, 403)
  assert.equal((await database.prepare('SELECT COUNT(*) AS count FROM admin_login_nonces').first<{ count: number }>())?.count, 0)
  const logoutWithoutMetadata = await logoutModule.onRequestPost(context(new Request('https://ruang-ibu.test/api/auth/logout', {
    method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://ruang-ibu.test' }, body: '{}',
  }), env(database)))
  assert.equal(logoutWithoutMetadata.status, 403)
  database.close()
})

test('unknown body fields, oversized credentials and missing auth configuration fail closed', async () => {
  const database = new SqliteD1Database()
  const unknownFields = await googleModule.createGoogleLoginHandler(() => localKeySet)(context(request('/api/auth/google', 'POST', { credential: 'x', nonce: 'x', role: 'owner' }), env(database)))
  const missingConfig = await googleModule.createGoogleLoginHandler(() => localKeySet)(context(request('/api/auth/google', 'POST', { credential: 'x', nonce: 'x' }), { DB: database, ADMIN_AUTH_HMAC_KEY: authKey }))
  const oversized = await googleModule.createGoogleLoginHandler(() => localKeySet)(context(new Request('https://ruang-ibu.test/api/auth/google', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://ruang-ibu.test', 'Sec-Fetch-Site': 'same-origin', 'Content-Length': '20000' }, body: JSON.stringify({ credential: 'x', nonce: 'x' }) }), env(database)))
  assert.equal(unknownFields.status, 400)
  assert.equal(missingConfig.status, 503)
  assert.equal(oversized.status, 413)
  for (const response of [unknownFields, missingConfig, oversized]) assert.equal(response.headers.get('Cache-Control'), 'no-store')
  database.close()
})

test('IP throttling limits OIDC challenge/login attempts without storing raw IP, email, subject or credentials', async () => {
  const database = new SqliteD1Database()
  for (let attempt = 0; attempt < 20; attempt++) assert.equal((await issueChallenge(database)).status, 200)
  assert.equal((await issueChallenge(database)).status, 429)
  const buckets = await database.prepare('SELECT bucket_hash FROM admin_login_throttles').all<{ bucket_hash: string }>()
  assert.ok(buckets.results?.length)
  assert.equal(buckets.results?.some((row) => row.bucket_hash.includes('192.0.2.10') || row.bucket_hash.includes(email) || row.bucket_hash.includes(sub)), false)
  database.close()
})

test('session endpoint enforces absolute and idle expiry, logout revokes, and disabled admins lose existing sessions', async () => {
  const database = new SqliteD1Database()
  await seedUser(database)
  const challenge = await (await issueChallenge(database)).json()
  const login = await googleLogin(database, challenge.data.nonce, await makeToken(challenge.data.nonce))
  const cookie = cookieFrom(login)
  const session = await sessionModule.onRequestGet(context(request('/api/auth/session', 'GET', undefined, cookie), env(database)))
  assert.equal(session.status, 200)
  const forged = await sessionModule.onRequestGet(context(request('/api/auth/session', 'GET', undefined, '__Host-ruang_ibu_session=forged'), env(database)))
  assert.equal(forged.status, 401)

  const expiredAt = Date.now() - 31 * 60_000
  await database.prepare('UPDATE admin_sessions SET created_at = ?, last_seen_at = ?, absolute_expires_at = ? WHERE session_hash = ?')
    .bind(expiredAt - 1, expiredAt, Date.now() + 60_000, await authModule.hashSessionToken(cookie.split('=', 2)[1])).run()
  assert.equal((await sessionModule.onRequestGet(context(request('/api/auth/session', 'GET', undefined, cookie), env(database)))).status, 401)

  const nextChallenge = await (await issueChallenge(database)).json()
  const nextLogin = await googleLogin(database, nextChallenge.data.nonce, await makeToken(nextChallenge.data.nonce))
  const nextCookie = cookieFrom(nextLogin)
  const logout = await logoutModule.onRequestPost(context(request('/api/auth/logout', 'POST', {}, nextCookie), env(database)))
  assert.equal(logout.status, 200)
  assert.match(logout.headers.get('Set-Cookie') ?? '', /Max-Age=0/u)
  assert.equal((await sessionModule.onRequestGet(context(request('/api/auth/session', 'GET', undefined, nextCookie), env(database)))).status, 401)

  const finalChallenge = await (await issueChallenge(database)).json()
  const finalLogin = await googleLogin(database, finalChallenge.data.nonce, await makeToken(finalChallenge.data.nonce))
  await database.prepare('UPDATE admin_users SET is_active = 0 WHERE id = ?').bind('admin-owner-1').run()
  assert.equal((await sessionModule.onRequestGet(context(request('/api/auth/session', 'GET', undefined, cookieFrom(finalLogin)), env(database)))).status, 401)
  database.close()
})

test('session middleware keeps the D1 role, fail-closed configuration, owner-only actions and no-store errors', async () => {
  const database = new SqliteD1Database()
  await seedUser(database)
  const challenge = await (await issueChallenge(database)).json()
  const login = await googleLogin(database, challenge.data.nonce, await makeToken(challenge.data.nonce))
  const cookie = cookieFrom(login)
  const middleware = adminMiddleware.createAdminSessionMiddleware()
  const validContext = context(request('/api/admin/summary', 'GET', undefined, cookie), env(database))
  validContext.next = async () => {
    assert.deepEqual(validContext.data.admin, { id: 'admin-owner-1', email, role: 'owner' })
    return Response.json({ ok: true })
  }
  assert.equal((await middleware(validContext)).status, 200)
  assert.equal((await middleware(context(request('/api/admin/summary'), env(database)))).status, 401)
  assert.equal((await middleware(context(request('/api/admin/summary'), { DB: database }))).status, 503)
  for (const [path, method] of [['/api/admin/summary', 'GET'], ['/api/admin/questions/q1/moderation', 'POST'], ['/api/admin/questions/q1/answer', 'PUT'], ['/api/admin/questions/q1', 'DELETE']] as const) {
    const response = await middleware(context(request(path, method, method === 'GET' || method === 'DELETE' ? undefined : {}, '__Host-ruang_ibu_session=forged'), env(database)))
    assert.equal(response.status, 401)
    assert.equal(response.headers.get('Cache-Control'), 'no-store')
  }
  const legacyAccess = await middleware(context(new Request('https://ruang-ibu.test/api/admin/summary', { headers: { 'Cf-Access-Jwt-Assertion': 'forged' } }), env(database)))
  assert.equal(legacyAccess.status, 401)
  database.close()
})

test('admin mutating requests reject cross-origin submissions while preserving moderation event access', async () => {
  const database = new SqliteD1Database()
  await seedUser(database)
  const challenge = await (await issueChallenge(database)).json()
  const login = await googleLogin(database, challenge.data.nonce, await makeToken(challenge.data.nonce))
  const response = await adminMiddleware.createAdminSessionMiddleware()(context(
    request('/api/admin/questions/q1', 'DELETE', undefined, cookieFrom(login), 'https://attacker.test'), env(database),
  ))
  assert.equal(response.status, 403)
  const noFetchMetadata = new Request('https://ruang-ibu.test/api/admin/questions/q1', {
    method: 'DELETE', headers: { Origin: 'https://ruang-ibu.test', Cookie: cookieFrom(login) },
  })
  assert.equal((await adminMiddleware.createAdminSessionMiddleware()(context(noFetchMetadata, env(database)))).status, 403)
  database.close()
})

test('Google auth failures and success audit only minimal events and never persist token or identity claims', async () => {
  const database = new SqliteD1Database()
  await seedUser(database)
  const challenge = await (await issueChallenge(database)).json()
  const response = await googleLogin(database, challenge.data.nonce, 'forged.google.id.token')
  assert.equal(response.status, 401)
  const events = await database.prepare('SELECT action, metadata_json FROM admin_auth_events').all<{ action: string; metadata_json: string }>()
  assert.ok(events.results?.some((event) => event.action === 'google_login_failure'))
  assert.equal(JSON.stringify(events.results).includes(email), false)
  assert.equal(JSON.stringify(events.results).includes(sub), false)
  assert.equal(JSON.stringify(events.results).includes('forged.google.id.token'), false)
  database.close()
})

test('Google ID token and password material are never persisted in browser storage or service-worker cache', async () => {
  const serviceWorker = await readFile(new URL('../../src/pwa/service-worker.ts', import.meta.url), 'utf8')
  const vite = await readFile(new URL('../../vite.config.ts', import.meta.url), 'utf8')
  const frontendFiles = await Promise.all([
    readFile(new URL('../../src/features/admin/api/authApi.ts', import.meta.url), 'utf8'),
    readFile(new URL('../../src/features/admin/pages/AdminLoginPage.tsx', import.meta.url), 'utf8'),
    readFile(new URL('../../src/features/admin/pages/AdminPages.tsx', import.meta.url), 'utf8'),
  ])
  assert.match(serviceWorker, /denylist:[\s\S]*\^\\\/admin/u)
  assert.match(serviceWorker, /denylist:[\s\S]*\^\\\/api\\\//u)
  assert.match(vite, /AdminLoginPage-\*\.js/u)
  assert.equal(frontendFiles.some((source) => /localStorage|sessionStorage|change-password|password_hash|currentPassword/u.test(source)), false)
  assert.equal(frontendFiles.some((source) => /localStorage\.(?:setItem|clear)|sessionStorage\.(?:setItem|clear)|URLSearchParams\([^)]*credential/u.test(source)), false, 'ID token is never persisted or placed in a URL')
})
