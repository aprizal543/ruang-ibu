import { DAY_MS, adminContextError, databaseError, isApiResponse, readAdminBody, validId } from '../../../../_shared/admin'
import { apiError, jsonResponse } from '../../../../_shared/http'
import type { PagesContext } from '../../../../_shared/types'
import { validatePublicText } from '../../../../_shared/question-validation'

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const authError = adminContextError(context) ?? databaseError(context)
  if (authError) return authError
  const id = context.params.questionId
  if (!validId(id)) return apiError(400, 'invalid_question_id', 'Identitas pertanyaan tidak valid.')
  const body = await readAdminBody(context)
  if (isApiResponse(body)) return body
  const action = body.action
  if (!['approve', 'reject', 'hide'].includes(String(action))) return apiError(400, 'invalid_action', 'Tindakan moderasi tidak dikenal.')
  let publicName: string | null = null
  let publicQuestion: string | null = null
  if (action === 'approve') {
    publicName = validatePublicText(body.publicDisplayName, 2, 50)
    publicQuestion = validatePublicText(body.publicQuestionText, 10, 1000)
    if (!publicName || !publicQuestion) return apiError(400, 'invalid_public_text', 'Nama dan pertanyaan publik yang telah diperiksa wajib diisi.')
  } else if (body.publicDisplayName !== undefined || body.publicQuestionText !== undefined) {
    return apiError(400, 'unexpected_fields', 'Data publik tidak diperlukan untuk tindakan ini.')
  }
  const actor = (context.data.admin as { email: string }).email
  const eventId = crypto.randomUUID()
  const now = new Date()
  const nowText = now.toISOString()
  const actionText = action as 'approve' | 'reject' | 'hide'
  const newStatus = actionText === 'approve' ? 'approved' : actionText === 'reject' ? 'rejected' : 'hidden'
  const retentionDays = newStatus === 'approved' ? 365 : 30
  const expires = new Date(now.getTime() + retentionDays * DAY_MS).toISOString()
  const allowedFrom = actionText === 'approve' || actionText === 'reject' ? "'pending'" : "'approved', 'answered'"
  try {
    const results = await context.env.DB!.batch([
      context.env.DB!.prepare(`UPDATE questions SET moderation_status = ?, public_display_name = ?, public_question_text = ?,
        updated_at = ?, moderated_at = ?, moderated_by = ?, expires_at = ?, last_moderation_event_id = ?
        WHERE id = ? AND moderation_status IN (${allowedFrom})`)
        .bind(newStatus, publicName, publicQuestion, nowText, nowText, actor, expires, eventId, id),
      context.env.DB!.prepare(`INSERT INTO moderation_events (event_id, question_id, action, actor, created_at, metadata_json)
        SELECT ?, id, ?, ?, ?, json_object('from', moderation_status, 'to', ?, 'publicTextEdited', ?)
        FROM questions WHERE id = ? AND last_moderation_event_id = ?`)
        .bind(eventId, actionText, actor, nowText, newStatus, actionText === 'approve' ? 1 : 0, id, eventId),
    ])
    if (!results[0]?.meta.changes) return apiError(409, 'invalid_transition', 'Status pertanyaan tidak dapat diubah dengan tindakan tersebut.')
    return jsonResponse({ data: { id, status: newStatus } })
  } catch {
    return apiError(500, 'request_failed', 'Moderasi belum dapat disimpan.')
  }
}
