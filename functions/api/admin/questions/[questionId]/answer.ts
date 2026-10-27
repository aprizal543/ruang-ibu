import { DAY_MS, adminContextError, databaseError, isApiResponse, readAdminBody, validId } from '../../../../_shared/admin'
import { apiError, jsonResponse } from '../../../../_shared/http'
import type { PagesContext } from '../../../../_shared/types'
import { validatePublicText } from '../../../../_shared/question-validation'

export async function onRequestPut(context: PagesContext): Promise<Response> {
  const authError = adminContextError(context) ?? databaseError(context)
  if (authError) return authError
  const id = context.params.questionId
  if (!validId(id)) return apiError(400, 'invalid_question_id', 'Identitas pertanyaan tidak valid.')
  const body = await readAdminBody(context)
  if (isApiResponse(body)) return body
  if (Object.keys(body).some((key) => key !== 'answer')) return apiError(400, 'unexpected_fields', 'Format jawaban tidak valid.')
  const answer = validatePublicText(body.answer, 10, 2000)
  if (!answer) return apiError(400, 'invalid_answer', 'Jawaban harus berisi 10 sampai 2.000 karakter.')
  const actor = (context.data.admin as { email: string }).email
  const now = new Date()
  const nowText = now.toISOString()
  const eventId = crypto.randomUUID()
  const answerId = crypto.randomUUID()
  const expiry = new Date(now.getTime() + 365 * DAY_MS).toISOString()
  try {
    const current = await context.env.DB!.prepare('SELECT moderation_status FROM questions WHERE id = ?').bind(id).first<{ moderation_status: string }>()
    if (!current) return apiError(404, 'not_found', 'Pertanyaan tidak ditemukan.')
    if (!['approved', 'answered'].includes(current.moderation_status)) return apiError(409, 'invalid_transition', 'Pertanyaan harus disetujui sebelum dijawab.')
    const results = await context.env.DB!.batch([
      context.env.DB!.prepare(`INSERT INTO answers (id, question_id, answer_text, answered_by, created_at, updated_at)
        SELECT ?, id, ?, ?, ?, ? FROM questions WHERE id = ? AND moderation_status IN ('approved', 'answered')
        ON CONFLICT(question_id) DO UPDATE SET answer_text = excluded.answer_text, answered_by = excluded.answered_by, updated_at = excluded.updated_at`)
        .bind(answerId, answer, actor, nowText, nowText, id),
      context.env.DB!.prepare(`UPDATE questions SET moderation_status = 'answered', updated_at = ?, moderated_at = ?, moderated_by = ?, expires_at = ?
        WHERE id = ? AND moderation_status IN ('approved', 'answered')`).bind(nowText, nowText, actor, expiry, id),
      context.env.DB!.prepare(`INSERT INTO moderation_events (event_id, question_id, action, actor, created_at, metadata_json)
        SELECT ?, id, CASE WHEN EXISTS (SELECT 1 FROM moderation_events WHERE question_id = ? AND action IN ('answer', 'edit_answer'))
          THEN 'edit_answer' ELSE 'answer' END, ?, ?, json_object('answerUpdated', 1)
        FROM questions WHERE id = ? AND moderation_status = 'answered'`)
        .bind(eventId, id, actor, nowText, id),
    ])
    if (!results[0]?.meta.changes) return apiError(409, 'invalid_transition', 'Pertanyaan harus disetujui sebelum dijawab.')
    return jsonResponse({ data: { id, status: 'answered', answerUpdatedAt: nowText } })
  } catch {
    return apiError(500, 'request_failed', 'Jawaban belum dapat disimpan.')
  }
}
