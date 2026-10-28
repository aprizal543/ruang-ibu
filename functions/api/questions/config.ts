import { apiError, jsonResponse } from '../../_shared/http'
import type { PagesContext } from '../../_shared/types'

export function onRequestGet({ env }: PagesContext): Response {
  const siteKey = env.TURNSTILE_SITE_KEY?.trim()
  if (!siteKey || siteKey.length > 256) {
    return apiError(503, 'service_not_configured', 'Formulir Tanya Jawab sementara belum tersedia.')
  }
  return jsonResponse({ data: { turnstileSiteKey: siteKey } })
}
