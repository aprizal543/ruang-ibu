import assert from 'node:assert/strict'
import { test } from 'node:test'
import { createLocalJWKSet, exportJWK, generateKeyPair, SignJWT, type JWTPayload, type JWTVerifyGetKey } from 'jose'

const accessModule = await import('../../functions/api/admin/_middleware.ts').catch(() => null)
const issuer = 'https://ruang-ibu-test.cloudflareaccess.com'
const audience = 'test-application-audience'
const now = Math.floor(Date.now() / 1000)
const { privateKey, publicKey } = await generateKeyPair('RS256', { modulusLength: 2048 })
const publicJwk = await exportJWK(publicKey)
publicJwk.kid = 'ruang-ibu-test-key'
publicJwk.alg = 'RS256'
publicJwk.use = 'sig'
const jwks = createLocalJWKSet({ keys: [publicJwk] }) as JWTVerifyGetKey

async function token(claims: JWTPayload = {}, settings: { issuer?: string; audience?: string | string[]; expiration?: number } = {}) {
  return new SignJWT({ email: 'admin@example.test', ...claims })
    .setProtectedHeader({ alg: 'RS256', kid: 'ruang-ibu-test-key' })
    .setIssuer(settings.issuer ?? issuer)
    .setAudience(settings.audience ?? audience)
    .setIssuedAt(now)
    .setExpirationTime(settings.expiration ?? now + 120)
    .sign(privateKey)
}

function env(overrides: Record<string, unknown> = {}) {
  return {
    ACCESS_TEAM_DOMAIN: issuer,
    ACCESS_AUD: audience,
    ADMIN_EMAILS: 'admin@example.test',
    ...overrides,
  }
}

function context(request: Request, environment: Record<string, unknown>, next: () => Promise<Response> = async () => Response.json({ ok: true })) {
  return { request, env: environment, params: {}, data: {}, next }
}

test('admin middleware fails closed when Access config or the JWT header is missing', async () => {
  assert.ok(accessModule, 'Access middleware exists')
  const middleware = accessModule.createAdminAccessMiddleware(() => jwks)
  const missingConfig = await middleware(context(new Request('https://ruang-ibu.test/api/admin/summary'), {}))
  const missingToken = await middleware(context(new Request('https://ruang-ibu.test/api/admin/summary'), env()))

  assert.equal(missingConfig.status, 503)
  assert.equal(missingToken.status, 401)
  assert.equal(missingConfig.headers.get('Cache-Control'), 'no-store')
})

test('forged token, wrong issuer, wrong audience, expired token, and unapproved email are denied', async () => {
  assert.ok(accessModule, 'Access middleware exists')
  const middleware = accessModule.createAdminAccessMiddleware(() => jwks)
  const valid = await token()
  const cases = [
    { value: 'not-a-jwt', environment: env(), status: 401 },
    { value: await token({}, { issuer: 'https://other.cloudflareaccess.com' }), environment: env(), status: 401 },
    { value: await token({}, { audience: 'different-audience' }), environment: env(), status: 401 },
    { value: await token({}, { expiration: now - 20 }), environment: env(), status: 401 },
    { value: await token({ email: 'stranger@example.test' }), environment: env(), status: 403 },
  ]
  assert.ok(valid.length > 0)
  for (const item of cases) {
    const response = await middleware(context(new Request('https://ruang-ibu.test/api/admin/summary', { headers: { 'Cf-Access-Jwt-Assertion': item.value } }), item.environment))
    assert.equal(response.status, item.status)
  }
})

test('a valid signed authorized identity reaches admin API context without trusting request roles', async () => {
  assert.ok(accessModule, 'Access middleware exists')
  const middleware = accessModule.createAdminAccessMiddleware(() => jwks)
  const signedToken = await token({ role: 'owner' })
  let observedIdentity: unknown
  const middlewareContext = context(new Request('https://ruang-ibu.test/api/admin/summary', {
    headers: { 'Cf-Access-Jwt-Assertion': signedToken, 'X-Admin-Role': 'root' },
  }), env())
  middlewareContext.next = async () => {
    observedIdentity = middlewareContext.data.admin
    return Response.json({ ok: true })
  }
  const response = await middleware(middlewareContext)

  assert.equal(response.status, 200)
  assert.deepEqual(observedIdentity, { email: 'admin@example.test' })
})

test('cross-origin admin mutation is denied even with a valid Access token', async () => {
  assert.ok(accessModule, 'Access middleware exists')
  const middleware = accessModule.createAdminAccessMiddleware(() => jwks)
  const response = await middleware(context(new Request('https://ruang-ibu.test/api/admin/questions/q1/answer', {
    method: 'PUT',
    headers: { 'Cf-Access-Jwt-Assertion': await token(), Origin: 'https://attacker.example' },
  }), env()))
  assert.equal(response.status, 403)
})
