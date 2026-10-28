import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey, type JWTPayload } from 'jose'
import { apiError, isResponse, jsonResponse, readJsonObject } from '../../_shared/http'
import type { AdminIdentity, Env, PagesContext } from '../../_shared/types'
import {
  ABSOLUTE_SESSION_MS,
  appendCookie,
  authKeyIsConfigured,
  consumeLoginNonce,
  googleClientIdIsConfigured,
  hasSameOriginBrowserRequest,
  isAuthThrottled,
  makeAuthThrottleKey,
  recordGoogleLoginFailure,
  recordSuccessfulGoogleLogin,
  sessionCookie,
  validAdminEmail,
} from './_shared'

const GOOGLE_JWKS_URL = new URL('https://www.googleapis.com/oauth2/v3/certs')
const googleJwks = createRemoteJWKSet(GOOGLE_JWKS_URL, { timeoutDuration: 3000, cooldownDuration: 30_000, cacheMaxAge: 10 * 60_000 })
const MAX_BODY_BYTES = 12 * 1024
const MAX_CREDENTIAL_CHARS = 10_000
const NONCE_PATTERN = /^[A-Za-z0-9_-]{43}$/u
const GENERIC_LOGIN_ERROR = { code: 'google_login_denied', message: 'Akun Google ini belum memiliki akses pengelola atau sesi masuk tidak dapat diverifikasi.' }

export interface GoogleIdentityClaims extends JWTPayload {
  sub: string
  email: string
  email_verified: true
  nonce: string
}

export async function verifyGoogleCredential(
  credential: string,
  expectedNonce: string,
  clientId: string,
  keySet: JWTVerifyGetKey = googleJwks,
): Promise<GoogleIdentityClaims> {
  const { payload, protectedHeader } = await jwtVerify(credential, keySet, {
    algorithms: ['RS256'],
    issuer: ['https://accounts.google.com', 'accounts.google.com'],
    audience: clientId,
    maxTokenAge: '5m',
    clockTolerance: 5,
  })
  if (protectedHeader.alg !== 'RS256'
    || typeof payload.sub !== 'string' || payload.sub.length < 1 || payload.sub.length > 255
    || typeof payload.email !== 'string' || !validAdminEmail(payload.email)
    || payload.email_verified !== true
    || typeof payload.nonce !== 'string' || payload.nonce !== expectedNonce
    || typeof payload.exp !== 'number' || typeof payload.iat !== 'number') {
    throw new Error('Google identity claims are invalid.')
  }
  if (payload.azp !== undefined && payload.azp !== clientId) throw new Error('Google authorized party is invalid.')
  if (Array.isArray(payload.aud) && payload.aud.length > 1 && payload.azp !== clientId) throw new Error('Google authorized party is required.')
  return payload as GoogleIdentityClaims
}

function validBody(body: Record<string, unknown>): body is Record<'credential' | 'nonce', string> {
  return Object.keys(body).length === 2
    && typeof body.credential === 'string'
    && body.credential.length > 0
    && body.credential.length <= MAX_CREDENTIAL_CHARS
    && typeof body.nonce === 'string'
    && NONCE_PATTERN.test(body.nonce)
}

function failedLogin(): Response { return jsonResponse({ error: GENERIC_LOGIN_ERROR }, 401) }

export function createGoogleLoginHandler(keySetFactory: () => JWTVerifyGetKey = () => googleJwks) {
  return async ({ request, env }: PagesContext<Env>): Promise<Response> => {
    if (!hasSameOriginBrowserRequest(request)) return apiError(403, 'origin_not_allowed', 'Permintaan tidak diizinkan.')
    if (!env.DB || !authKeyIsConfigured(env) || !googleClientIdIsConfigured(env)) {
      return apiError(503, 'auth_not_configured', 'Akses pengelola belum tersedia.')
    }
    const body = await readJsonObject(request, MAX_BODY_BYTES)
    if (isResponse(body)) return body
    if (!validBody(body)) return apiError(400, 'invalid_google_login', 'Respons masuk Google tidak dapat diproses.')
    const ip = request.headers.get('CF-Connecting-IP')
    if (!ip || ip.length > 128) return apiError(503, 'auth_unavailable', 'Layanan pengelola belum tersedia.')

    const now = Date.now()
    try {
      const loginBucket = await makeAuthThrottleKey(env.ADMIN_AUTH_HMAC_KEY!, 'login', ip)
      if (await isAuthThrottled(env.DB, loginBucket, now)) {
        return jsonResponse({ error: { code: 'login_limited', message: 'Percobaan masuk dibatasi sementara. Coba lagi nanti.' } }, 429, { 'Retry-After': '900' })
      }

      let claims: GoogleIdentityClaims
      try {
        claims = await verifyGoogleCredential(body.credential, body.nonce, env.GOOGLE_OAUTH_CLIENT_ID!, keySetFactory())
      } catch {
        await recordGoogleLoginFailure(env.DB, loginBucket, now)
        return failedLogin()
      }

      if (!await consumeLoginNonce(env.DB, claims.nonce, now)) {
        await recordGoogleLoginFailure(env.DB, loginBucket, now)
        return failedLogin()
      }

      const user = await env.DB.prepare(`SELECT id, email, role FROM admin_users
        WHERE google_sub = ? AND is_active = 1 LIMIT 1`)
        .bind(claims.sub).first<AdminIdentity>()
      if (!user) {
        await recordGoogleLoginFailure(env.DB, loginBucket, now)
        return failedLogin()
      }

      const challengeBucket = await makeAuthThrottleKey(env.ADMIN_AUTH_HMAC_KEY!, 'challenge', ip)
      const token = await recordSuccessfulGoogleLogin(env.DB, [loginBucket, challengeBucket], user, now)
      if (!token) {
        await recordGoogleLoginFailure(env.DB, loginBucket, now)
        return failedLogin()
      }
      return appendCookie(jsonResponse({ data: { authenticated: true, user, expiresAt: now + ABSOLUTE_SESSION_MS } }), sessionCookie(token))
    } catch {
      return apiError(503, 'auth_unavailable', 'Layanan pengelola belum tersedia.')
    }
  }
}

export const onRequestPost = createGoogleLoginHandler()
