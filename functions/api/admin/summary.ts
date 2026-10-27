import { adminContextError, databaseError } from '../../_shared/admin'
import { apiError, jsonResponse } from '../../_shared/http'
import type { PagesContext } from '../../_shared/types'

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const authError = adminContextError(context) ?? databaseError(context)
  if (authError) return authError
  try {
    const row = await context.env.DB!.prepare(`
      SELECT COUNT(*) AS total,
        SUM(CASE WHEN moderation_status = 'pending' THEN 1 ELSE 0 END) AS pending,
        SUM(CASE WHEN moderation_status = 'approved' THEN 1 ELSE 0 END) AS approved,
        SUM(CASE WHEN moderation_status = 'answered' THEN 1 ELSE 0 END) AS answered,
        SUM(CASE WHEN moderation_status = 'rejected' THEN 1 ELSE 0 END) AS rejected,
        SUM(CASE WHEN moderation_status = 'hidden' THEN 1 ELSE 0 END) AS hidden
      FROM questions
    `).first<Record<string, number>>()
    const data = Object.fromEntries(['total', 'pending', 'approved', 'answered', 'rejected', 'hidden'].map((key) => [key, Number(row?.[key] ?? 0)]))
    return jsonResponse({ data })
  } catch {
    return apiError(500, 'request_failed', 'Ringkasan belum dapat dimuat.')
  }
}
