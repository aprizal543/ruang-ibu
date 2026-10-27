import { resolveQuestionArticleSlug } from '../../../../src/content/questionArticleRegistry'
import { adminContextError, databaseError } from '../../../_shared/admin'
import { apiError, jsonResponse } from '../../../_shared/http'
import type { PagesContext } from '../../../_shared/types'

const PAGE_MAX = 50
const PAGE_DEFAULT = 20
const STATUSES = new Set(['pending', 'approved', 'answered', 'rejected', 'hidden'])

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const authError = adminContextError(context) ?? databaseError(context)
  if (authError) return authError
  const params = new URL(context.request.url).searchParams
  for (const key of ['status', 'articleSlug', 'expiresBefore', 'limit', 'cursor']) if (params.getAll(key).length > 1) return apiError(400, 'invalid_filter', 'Filter tidak valid.')
  const status = params.get('status')
  const statusValues = status ? status.split(',') : []
  if (statusValues.some((value) => !STATUSES.has(value)) || new Set(statusValues).size !== statusValues.length) return apiError(400, 'invalid_filter', 'Status tidak dikenal.')
  const articleParam = params.get('articleSlug')
  const article = articleParam ? resolveQuestionArticleSlug(articleParam) : null
  if (articleParam && !article) return apiError(400, 'invalid_filter', 'Materi tidak dikenal.')
  const expiresBeforeParam = params.get('expiresBefore')
  const expiresBeforeMs = expiresBeforeParam === null ? null : Date.parse(expiresBeforeParam)
  if (expiresBeforeParam !== null && !Number.isFinite(expiresBeforeMs)) return apiError(400, 'invalid_filter', 'Batas tanggal retensi tidak valid.')
  const limitRaw = params.get('limit')
  const limit = limitRaw === null ? PAGE_DEFAULT : Number(limitRaw)
  if (!Number.isInteger(limit) || limit < 1 || limit > PAGE_MAX) return apiError(400, 'invalid_pagination', 'Jumlah hasil harus antara 1 dan 50.')
  const cursorRaw = params.get('cursor')
  let cursor: { createdAt: string; id: string } | null = null
  if (cursorRaw) {
    try {
      const decoded = JSON.parse(atob(cursorRaw.replaceAll('-', '+').replaceAll('_', '/').padEnd(Math.ceil(cursorRaw.length / 4) * 4, '='))) as Record<string, unknown>
      if (typeof decoded.createdAt !== 'string' || !Number.isFinite(Date.parse(decoded.createdAt)) || typeof decoded.id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/u.test(decoded.id)) throw new Error('invalid cursor')
      cursor = { createdAt: decoded.createdAt, id: decoded.id }
    } catch {
      return apiError(400, 'invalid_pagination', 'Penanda halaman tidak valid.')
    }
  }
  const clauses: string[] = []
  const values: (string | number)[] = []
  if (statusValues.length === 1) { clauses.push('q.moderation_status = ?'); values.push(statusValues[0]) }
  else if (statusValues.length > 1) { clauses.push(`q.moderation_status IN (${statusValues.map(() => '?').join(', ')})`); values.push(...statusValues) }
  if (article) { clauses.push('q.article_slug = ?'); values.push(article.slug) }
  if (expiresBeforeMs !== null) { clauses.push('q.expires_at <= ?'); values.push(new Date(expiresBeforeMs).toISOString()) }
  if (cursor) { clauses.push('(q.created_at < ? OR (q.created_at = ? AND q.id < ?))'); values.push(cursor.createdAt, cursor.createdAt, cursor.id) }
  try {
    const result = await context.env.DB!.prepare(`
      SELECT q.id, q.article_slug AS articleSlug, q.display_name AS displayName,
        q.question_text AS question, q.optional_email AS email, q.consent_at AS consentAt,
        q.moderation_status AS status, q.public_display_name AS publicDisplayName,
        q.public_question_text AS publicQuestion, q.created_at AS createdAt,
        q.updated_at AS updatedAt, q.moderated_at AS moderatedAt, q.moderated_by AS moderatedBy,
        q.expires_at AS expiresAt, a.answer_text AS answer, a.answered_by AS answeredBy,
        a.updated_at AS answerUpdatedAt
      FROM questions q LEFT JOIN answers a ON a.question_id = q.id
      ${clauses.length ? `WHERE ${clauses.join(' AND ')}` : ''}
      ORDER BY q.created_at DESC, q.id DESC LIMIT ?
    `).bind(...values, limit + 1).all<Record<string, unknown>>()
    const rows = result.results ?? []
    const page = rows.slice(0, limit)
    const last = page.at(-1)
    let nextCursor: string | null = null
    if (rows.length > limit && last) {
      const bytes = new TextEncoder().encode(JSON.stringify({ createdAt: last.createdAt, id: last.id }))
      let binary = ''; for (const byte of bytes) binary += String.fromCharCode(byte)
      nextCursor = btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
    }
    return jsonResponse({ data: { questions: page, nextCursor } })
  } catch {
    return apiError(500, 'request_failed', 'Daftar pertanyaan belum dapat dimuat.')
  }
}
