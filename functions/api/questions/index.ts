import { resolveQuestionArticleSlug } from '../../../src/content/questionArticleRegistry'
import { apiError, hasSameOrigin, isResponse, jsonResponse, readJsonObject } from '../../_shared/http'
import { consumeQuestionRateLimit } from '../../_shared/rate-limit'
import { validateQuestionSubmission } from '../../_shared/question-validation'
import type { PagesContext } from '../../_shared/types'
import { verifyTurnstileToken, type TurnstileVerifier } from '../../_shared/turnstile'

const MAX_BODY_BYTES = 8192
const DEFAULT_PAGE_SIZE = 10
const MAX_PAGE_SIZE = 20
const PENDING_RETENTION_DAYS = 90

interface PublicCursor {
  createdAt: string
  id: string
}

function encodeCursor(cursor: PublicCursor): string {
  const bytes = new TextEncoder().encode(JSON.stringify(cursor))
  let binary = ''
  for (const byte of bytes) binary += String.fromCharCode(byte)
  return btoa(binary).replaceAll('+', '-').replaceAll('/', '_').replace(/=+$/u, '')
}

function decodeCursor(value: string): PublicCursor | null {
  if (value.length > 256 || !/^[A-Za-z0-9_-]+$/u.test(value)) return null
  try {
    const base64 = value.replaceAll('-', '+').replaceAll('_', '/')
    const binary = atob(base64.padEnd(Math.ceil(base64.length / 4) * 4, '='))
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0))
    const cursor = JSON.parse(new TextDecoder().decode(bytes)) as Record<string, unknown>
    if (typeof cursor.createdAt !== 'string' || !Number.isFinite(Date.parse(cursor.createdAt))) return null
    if (typeof cursor.id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/u.test(cursor.id)) return null
    return { createdAt: cursor.createdAt, id: cursor.id }
  } catch {
    return null
  }
}

function getSingleQueryValue(params: URLSearchParams, key: string): string | null | undefined {
  const values = params.getAll(key)
  return values.length > 1 ? undefined : values[0] ?? null
}

export async function onRequestGet({ request, env }: PagesContext): Promise<Response> {
  if (!env.DB) return apiError(503, 'service_not_configured', 'Layanan pertanyaan belum tersedia.')
  const params = new URL(request.url).searchParams
  const requestedSlug = getSingleQueryValue(params, 'articleSlug')
  if (!requestedSlug) return apiError(400, 'invalid_article', 'Materi tidak dikenal.')
  const article = resolveQuestionArticleSlug(requestedSlug)
  if (!article) return apiError(400, 'invalid_article', 'Materi tidak dikenal.')

  const rawLimit = getSingleQueryValue(params, 'limit')
  if (rawLimit === undefined) return apiError(400, 'invalid_pagination', 'Parameter halaman tidak valid.')
  const limit = rawLimit === null ? DEFAULT_PAGE_SIZE : Number(rawLimit)
  if (!Number.isInteger(limit) || limit < 1 || limit > MAX_PAGE_SIZE) return apiError(400, 'invalid_pagination', 'Jumlah hasil harus antara 1 dan 20.')
  const rawCursor = getSingleQueryValue(params, 'cursor')
  if (rawCursor === undefined) return apiError(400, 'invalid_pagination', 'Parameter halaman tidak valid.')
  const cursor = rawCursor ? decodeCursor(rawCursor) : null
  if (rawCursor && !cursor) return apiError(400, 'invalid_pagination', 'Penanda halaman tidak valid.')

  try {
    const cursorFilter = cursor ? 'AND (q.created_at < ? OR (q.created_at = ? AND q.id < ?))' : ''
    const values = cursor
      ? [article.slug, cursor.createdAt, cursor.createdAt, cursor.id, limit + 1]
      : [article.slug, limit + 1]
    const { results = [] } = await env.DB.prepare(`
      SELECT q.id, q.article_slug AS articleSlug,
        q.public_display_name AS displayName,
        q.public_question_text AS question,
        q.moderation_status AS status,
        q.created_at AS createdAt,
        a.answer_text AS answerText,
        a.updated_at AS answerUpdatedAt
      FROM questions q
      LEFT JOIN answers a ON a.question_id = q.id
      WHERE q.article_slug = ?
        AND q.moderation_status IN ('approved', 'answered')
        AND q.public_display_name IS NOT NULL
        AND q.public_question_text IS NOT NULL
        AND (q.moderation_status != 'answered' OR a.id IS NOT NULL)
        ${cursorFilter}
      ORDER BY q.created_at DESC, q.id DESC
      LIMIT ?
    `).bind(...values).all<{
      id: string
      articleSlug: string
      displayName: string
      question: string
      status: 'approved' | 'answered'
      createdAt: string
      answerText: string | null
      answerUpdatedAt: string | null
    }>()
    const hasMore = results.length > limit
    const rows = results.slice(0, limit)
    const questions = rows.map((row) => ({
      id: row.id,
      articleSlug: row.articleSlug,
      displayName: row.displayName,
      question: row.question,
      status: row.status,
      createdAt: row.createdAt,
      answer: row.answerText ? { text: row.answerText, updatedAt: row.answerUpdatedAt } : null,
    }))
    const last = rows.at(-1)
    return jsonResponse({
      data: {
        questions,
        nextCursor: hasMore && last ? encodeCursor({ createdAt: last.createdAt, id: last.id }) : null,
      },
    })
  } catch {
    return apiError(500, 'request_failed', 'Pertanyaan belum dapat dimuat.')
  }
}

export async function handleQuestionPost(
  context: Pick<PagesContext, 'request' | 'env'>,
  verifyTurnstile: TurnstileVerifier = verifyTurnstileToken,
): Promise<Response> {
  const { request, env } = context
  if (!hasSameOrigin(request)) return apiError(403, 'origin_not_allowed', 'Permintaan tidak diizinkan.')
  if (!env.DB || !env.TURNSTILE_SECRET_KEY || !env.TURNSTILE_ALLOWED_HOSTNAMES?.trim() || !env.RATE_LIMIT_HMAC_KEY || env.RATE_LIMIT_HMAC_KEY.length < 32) {
    return apiError(503, 'service_not_configured', 'Layanan pertanyaan belum tersedia.')
  }

  const body = await readJsonObject(request, MAX_BODY_BYTES)
  if (isResponse(body)) return body
  const submission = validateQuestionSubmission(body)
  if (!submission) return apiError(400, 'invalid_submission', 'Periksa kembali nama, pertanyaan, persetujuan, dan materi yang dipilih.')

  const clientIp = request.headers.get('CF-Connecting-IP')
  if (!clientIp || clientIp.length > 128) return apiError(503, 'request_not_available', 'Permintaan belum dapat diproses.')

  try {
    const rate = await consumeQuestionRateLimit(env.DB, clientIp, env.RATE_LIMIT_HMAC_KEY, Date.now())
    if (!rate.allowed) return jsonResponse({ error: { code: 'rate_limited', message: 'Batas pengiriman tercapai. Silakan coba lagi nanti.' } }, 429, { 'Retry-After': '3600' })

    let verification
    try {
      verification = await verifyTurnstile(submission.turnstileToken, env)
    } catch (error) {
      if (error instanceof Error && error.message === 'turnstile_not_configured') return apiError(503, 'service_not_configured', 'Layanan pertanyaan belum tersedia.')
      return apiError(503, 'verification_unavailable', 'Verifikasi sementara tidak tersedia. Silakan coba lagi.')
    }
    if (!verification.success || verification.action !== 'ask_question') return apiError(403, 'verification_failed', 'Verifikasi tidak berhasil. Silakan coba lagi.')
    const allowedHostnames = env.TURNSTILE_ALLOWED_HOSTNAMES.split(',').map((host) => host.trim().toLowerCase()).filter(Boolean)
    if (!verification.hostname || !allowedHostnames.includes(verification.hostname.toLowerCase())) return apiError(403, 'verification_failed', 'Verifikasi tidak berhasil. Silakan coba lagi.')

    const now = new Date()
    const createdAt = now.toISOString()
    const expiresAt = new Date(now.getTime() + PENDING_RETENTION_DAYS * 24 * 60 * 60 * 1000).toISOString()
    const id = crypto.randomUUID()
    await env.DB.prepare(`
      INSERT INTO questions (
        id, article_slug, display_name, question_text, optional_email, consent_at,
        moderation_status, created_at, updated_at, expires_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'pending', ?, ?, ?)
    `).bind(
      id,
      submission.articleSlug,
      submission.displayName,
      submission.question,
      submission.email,
      createdAt,
      createdAt,
      createdAt,
      expiresAt,
    ).run()

    return jsonResponse({ data: { id, status: 'pending', message: 'Pertanyaan diterima dan menunggu moderasi.' } }, 201)
  } catch {
    return apiError(500, 'request_failed', 'Pertanyaan belum dapat dikirim. Silakan coba lagi.')
  }
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  return handleQuestionPost(context)
}
