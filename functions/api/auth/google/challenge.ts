import { apiError, isResponse, jsonResponse, readJsonObject } from '../../../_shared/http'
import type { Env, PagesContext } from '../../../_shared/types'
import {
  authKeyIsConfigured,
  createLoginNonce,
  googleClientIdIsConfigured,
  hasSameOriginBrowserRequest,
  hashSessionToken,
  isAuthThrottled,
  LOGIN_NONCE_TTL_MS,
  makeAuthThrottleKey,
  recordAuthAttempt,
} from '../_shared'

export async function onRequestPost({ request, env }: PagesContext<Env>): Promise<Response> {
  if (!hasSameOriginBrowserRequest(request)) return apiError(403, 'origin_not_allowed', 'Permintaan tidak diizinkan.')
  const body = await readJsonObject(request, 1024)
  if (isResponse(body)) return body
  if (Object.keys(body).length !== 0) return apiError(400, 'invalid_challenge_request', 'Permintaan masuk tidak valid.')
  if (!env.DB || !authKeyIsConfigured(env) || !googleClientIdIsConfigured(env)) {
    return apiError(503, 'auth_not_configured', 'Akses pengelola belum tersedia.')
  }
  const ip = request.headers.get('CF-Connecting-IP')
  if (!ip || ip.length > 128) return apiError(503, 'auth_unavailable', 'Layanan pengelola belum tersedia.')

  const now = Date.now()
  try {
    const bucketHash = await makeAuthThrottleKey(env.ADMIN_AUTH_HMAC_KEY!, 'challenge', ip)
    if (await isAuthThrottled(env.DB, bucketHash, now)) {
      return jsonResponse({ error: { code: 'login_limited', message: 'Permintaan masuk dibatasi sementara. Coba lagi nanti.' } }, 429, { 'Retry-After': '900' })
    }
    await recordAuthAttempt(env.DB, bucketHash, 'challenge', now)
    const nonce = createLoginNonce()
    const expiresAt = now + LOGIN_NONCE_TTL_MS
    await env.DB.batch([
      env.DB.prepare('DELETE FROM admin_login_nonces WHERE expires_at <= ? OR consumed_at IS NOT NULL').bind(now),
      env.DB.prepare('INSERT INTO admin_login_nonces (nonce_hash, created_at, expires_at) VALUES (?, ?, ?)')
        .bind(await hashSessionToken(nonce), now, expiresAt),
    ])
    return jsonResponse({ data: { clientId: env.GOOGLE_OAUTH_CLIENT_ID, nonce, expiresAt } })
  } catch {
    return apiError(503, 'auth_unavailable', 'Layanan pengelola belum tersedia.')
  }
}
