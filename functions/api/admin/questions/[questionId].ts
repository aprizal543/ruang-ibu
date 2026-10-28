import { adminContextError, databaseError, validId } from '../../../_shared/admin'
import { apiError, jsonResponse } from '../../../_shared/http'
import type { PagesContext } from '../../../_shared/types'

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const authError = adminContextError(context) ?? databaseError(context)
  if (authError) return authError
  const id = context.params.questionId
  if (!validId(id)) return apiError(400, 'invalid_question_id', 'Identitas pertanyaan tidak valid.')
  try {
    const question = await context.env.DB!.prepare(`
      SELECT q.id, q.article_slug AS articleSlug, q.display_name AS displayName,
        q.question_text AS question, q.optional_email AS email, q.consent_at AS consentAt,
        q.moderation_status AS status, q.public_display_name AS publicDisplayName,
        q.public_question_text AS publicQuestion, q.created_at AS createdAt,
        q.updated_at AS updatedAt, q.moderated_at AS moderatedAt, q.moderated_by AS moderatedBy,
        q.expires_at AS expiresAt, a.answer_text AS answer, a.answered_by AS answeredBy,
        a.created_at AS answerCreatedAt, a.updated_at AS answerUpdatedAt
      FROM questions q LEFT JOIN answers a ON a.question_id = q.id WHERE q.id = ?
    `).bind(id).first<Record<string, unknown>>()
    return question ? jsonResponse({ data: question }) : apiError(404, 'not_found', 'Pertanyaan tidak ditemukan.')
  } catch {
    return apiError(500, 'request_failed', 'Pertanyaan belum dapat dimuat.')
  }
}

export async function onRequestDelete(context: PagesContext): Promise<Response> {
  const authError = adminContextError(context) ?? databaseError(context)
  if (authError) return authError
  const id = context.params.questionId
  if (!validId(id)) return apiError(400, 'invalid_question_id', 'Identitas pertanyaan tidak valid.')
  const actor = (context.data.admin as { email: string }).email
  const eventId = crypto.randomUUID()
  const now = new Date().toISOString()
  try {
    const results = await context.env.DB!.batch([
      context.env.DB!.prepare(`INSERT INTO moderation_events (event_id, question_id, action, actor, created_at, metadata_json)
        SELECT ?, id, 'delete', ?, ?, json_object('questionId', id) FROM questions WHERE id = ?`)
        .bind(eventId, actor, now, id),
      context.env.DB!.prepare('DELETE FROM questions WHERE id = ?').bind(id),
    ])
    if (!results[1]?.meta.changes) return apiError(404, 'not_found', 'Pertanyaan tidak ditemukan.')
    return jsonResponse({ data: { id, deleted: true } })
  } catch {
    return apiError(500, 'request_failed', 'Pertanyaan belum dapat dihapus.')
  }
}
