import { adminContextError, databaseError, isApiResponse, readAdminBody } from '../../../_shared/admin'
import { apiError, jsonResponse } from '../../../_shared/http'
import type { PagesContext } from '../../../_shared/types'

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const authError = adminContextError(context) ?? databaseError(context)
  if (authError) return authError
  if (context.request.body) {
    const body = await readAdminBody(context)
    if (isApiResponse(body)) return body
    if (Object.keys(body).length) return apiError(400, 'unexpected_fields', 'Permintaan tidak boleh memuat data tambahan.')
  }
  const actor = (context.data.admin as { email: string }).email
  const now = new Date().toISOString()
  const batchId = crypto.randomUUID()
  try {
    const results = await context.env.DB!.batch([
      context.env.DB!.prepare(`UPDATE questions SET purge_batch_id = ? WHERE id IN (
        SELECT id FROM questions WHERE expires_at <= ? ORDER BY expires_at ASC LIMIT 500
      )`).bind(batchId, now),
      context.env.DB!.prepare(`INSERT INTO moderation_events (event_id, question_id, action, actor, created_at, metadata_json)
        SELECT ?, NULL, 'retention_purge', ?, ?, json_object('deletedCount', COUNT(*), 'batchId', ?)
        FROM questions WHERE purge_batch_id = ? HAVING COUNT(*) > 0`)
        .bind(batchId, actor, now, batchId, batchId),
      context.env.DB!.prepare('DELETE FROM questions WHERE purge_batch_id = ?').bind(batchId),
    ])
    return jsonResponse({ data: { deleted: results[0]?.meta.changes ?? 0 } })
  } catch {
    return apiError(500, 'request_failed', 'Penghapusan data kedaluwarsa belum dapat dijalankan.')
  }
}
