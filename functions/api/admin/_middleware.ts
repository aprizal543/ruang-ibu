import { apiError } from '../../_shared/http'
import type { Env, PagesContext, PagesFunction } from '../../_shared/types'
import { authKeyIsConfigured, getSessionToken, hasSameOriginBrowserRequest, resolveAdminSession } from '../auth/_shared'

function noStore(response: Response): Response {
  const headers = new Headers(response.headers)
  headers.set('Cache-Control', 'no-store')
  headers.set('X-Content-Type-Options', 'nosniff')
  headers.set('Referrer-Policy', 'no-referrer')
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers })
}

function requiresOwner(request: Request): boolean {
  const path = new URL(request.url).pathname
  return (request.method === 'DELETE' && /^\/api\/admin\/questions\/[^/]+$/u.test(path))
    || (request.method === 'POST' && path === '/api/admin/retention/purge')
}

export function createAdminSessionMiddleware(): PagesFunction<Env> {
  return async (context: PagesContext<Env>) => {
    if (!context.env.DB || !authKeyIsConfigured(context.env)) {
      return noStore(apiError(503, 'admin_auth_not_configured', 'Akses pengelola belum tersedia.'))
    }

    if (!['GET', 'HEAD'].includes(context.request.method) && !hasSameOriginBrowserRequest(context.request)) {
      return noStore(apiError(403, 'origin_not_allowed', 'Permintaan tidak diizinkan.'))
    }

    const token = getSessionToken(context.request)
    if (!token) return noStore(apiError(401, 'unauthorized', 'Autentikasi pengelola diperlukan.'))

    try {
      const identity = await resolveAdminSession(context.env.DB, token)
      if (!identity) return noStore(apiError(401, 'unauthorized', 'Autentikasi pengelola diperlukan.'))
      if (requiresOwner(context.request) && identity.role !== 'owner') {
        return noStore(apiError(403, 'forbidden', 'Tindakan ini memerlukan izin pemilik.'))
      }

      context.data.admin = { id: identity.id, email: identity.email, role: identity.role }
      return noStore(await context.next())
    } catch {
      return noStore(apiError(503, 'admin_auth_unavailable', 'Layanan pengelola belum tersedia.'))
    }
  }
}

export const onRequest = createAdminSessionMiddleware()
