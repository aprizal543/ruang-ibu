import { apiError, jsonResponse } from '../../_shared/http'
import type { Env, PagesContext } from '../../_shared/types'
import { appendCookie, expiredSessionCookie, getSessionToken, hasSameOriginBrowserRequest, recordLogout } from './_shared'

export async function onRequestPost({ request, env }: PagesContext<Env>): Promise<Response> {
  if (!hasSameOriginBrowserRequest(request)) return apiError(403, 'origin_not_allowed', 'Permintaan tidak diizinkan.')
  if (!env.DB) return apiError(503, 'auth_unavailable', 'Sesi belum dapat ditutup. Coba lagi.')
  try {
    await recordLogout(env.DB, getSessionToken(request))
    return appendCookie(jsonResponse({ data: { loggedOut: true } }), expiredSessionCookie())
  } catch {
    return apiError(503, 'auth_unavailable', 'Sesi belum dapat ditutup. Coba lagi.')
  }
}
