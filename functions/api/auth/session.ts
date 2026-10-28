import { apiError, jsonResponse } from '../../_shared/http'
import type { Env, PagesContext } from '../../_shared/types'
import { authKeyIsConfigured, getSessionToken, resolveAdminSession } from './_shared'

export async function onRequestGet({ request, env }: PagesContext<Env>): Promise<Response> {
  if (!env.DB || !authKeyIsConfigured(env)) return apiError(503, 'auth_not_configured', 'Layanan pengelola belum tersedia.')
  const token = getSessionToken(request)
  if (!token) return apiError(401, 'unauthorized', 'Autentikasi pengelola diperlukan.')
  try {
    const session = await resolveAdminSession(env.DB, token)
    if (!session) return apiError(401, 'unauthorized', 'Autentikasi pengelola diperlukan.')
    return jsonResponse({ data: { authenticated: true, user: { id: session.id, email: session.email, role: session.role }, expiresAt: session.absoluteExpiresAt } })
  } catch {
    return apiError(503, 'auth_unavailable', 'Layanan pengelola belum tersedia.')
  }
}
