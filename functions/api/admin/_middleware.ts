import { createRemoteJWKSet, jwtVerify, type JWTVerifyGetKey } from 'jose'
import { apiError, hasSameOrigin } from '../../_shared/http'
import type { AdminIdentity, Env, PagesContext, PagesFunction } from '../../_shared/types'

type JwksResolver = (issuer: string) => JWTVerifyGetKey

const remoteKeys = new Map<string, JWTVerifyGetKey>()

function getRemoteKeys(issuer: string): JWTVerifyGetKey {
  let keySet = remoteKeys.get(issuer)
  if (!keySet) {
    keySet = createRemoteJWKSet(new URL(`${issuer}/cdn-cgi/access/certs`), { timeoutDuration: 5000 })
    remoteKeys.set(issuer, keySet)
  }
  return keySet
}

function getAccessConfig(env: Env): { issuer: string; audience: string; admins: Set<string> } | null {
  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.ADMIN_EMAILS) return null
  const issuer = env.ACCESS_TEAM_DOMAIN.trim()
  let issuerUrl: URL
  try {
    issuerUrl = new URL(issuer)
  } catch {
    return null
  }
  if (issuerUrl.protocol !== 'https:' || issuerUrl.origin !== issuer || issuerUrl.pathname !== '/') return null
  const audience = env.ACCESS_AUD.trim()
  if (!audience || /\s/u.test(audience)) return null
  const admins = new Set(env.ADMIN_EMAILS.split(',').map((email) => email.trim().toLowerCase()).filter((email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email)))
  return admins.size > 0 ? { issuer, audience, admins } : null
}

function noStore(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'no-store')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'no-referrer')
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

export function createAdminAccessMiddleware(resolveKeys: JwksResolver = getRemoteKeys): PagesFunction {
  return async (context: PagesContext) => {
    const config = getAccessConfig(context.env)
    if (!config) return apiError(503, 'admin_auth_not_configured', 'Akses pengelola belum dikonfigurasi.')

    if (!['GET', 'HEAD', 'OPTIONS'].includes(context.request.method) && !hasSameOrigin(context.request)) {
      return apiError(403, 'origin_not_allowed', 'Permintaan tidak diizinkan.')
    }

    const token = context.request.headers.get('Cf-Access-Jwt-Assertion')
    if (!token || token.length > 16384) return apiError(401, 'unauthorized', 'Autentikasi pengelola diperlukan.')

    let identity: AdminIdentity
    try {
      const { payload } = await jwtVerify(token, resolveKeys(config.issuer), {
        issuer: config.issuer,
        audience: config.audience,
        algorithms: ['RS256'],
        requiredClaims: ['exp', 'iat', 'iss', 'aud'],
        clockTolerance: 5,
      })
      if (typeof payload.email !== 'string') return apiError(401, 'unauthorized', 'Autentikasi pengelola diperlukan.')
      const email = payload.email.trim().toLowerCase()
      if (!config.admins.has(email)) return apiError(403, 'forbidden', 'Identitas ini tidak memiliki akses pengelola.')
      identity = { email }
    } catch {
      return apiError(401, 'unauthorized', 'Autentikasi pengelola tidak valid.')
    }

    context.data.admin = identity
    return noStore(await context.next())
  }
}

export const onRequest = createAdminAccessMiddleware()
