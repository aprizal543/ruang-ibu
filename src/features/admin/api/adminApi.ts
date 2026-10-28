import type { AdminQuestion, AdminQuestionPage, AdminSummary, ModerationStatus } from '../types/admin'

export class AdminApiError extends Error {
  constructor(readonly status: number, readonly code: string, message: string) {
    super(message)
    this.name = 'AdminApiError'
  }
}

const questionStatuses = new Set(['pending', 'approved', 'answered', 'rejected', 'hidden'])
function isRecord(value: unknown): value is Record<string, unknown> { return typeof value === 'object' && value !== null && !Array.isArray(value) }
function invalidResponse(): AdminApiError { return new AdminApiError(502, 'invalid_response', 'Respons layanan pengelola tidak sesuai format.') }

async function request<T>(path: string, init: RequestInit = {}, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, {
      ...init,
      credentials: 'same-origin',
      cache: 'no-store',
      signal,
      headers: { Accept: 'application/json', ...(init.body ? { 'Content-Type': 'application/json' } : {}), ...init.headers },
    })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') throw error
    throw new AdminApiError(0, 'network_error', 'Sambungan ke layanan pengelola terputus. Coba lagi.')
  }

  let body: unknown
  try { body = await response.json() } catch { body = null }
  if (!response.ok) {
    if (response.status === 401 && typeof window !== 'undefined') window.dispatchEvent(new Event('ruang-ibu:admin-session-ended'))
    const error = (body as { error?: { code?: unknown; message?: unknown } } | null)?.error
    const code = typeof error?.code === 'string' ? error.code : 'request_failed'
    const message = typeof error?.message === 'string' ? error.message : 'Permintaan belum dapat diproses.'
    throw new AdminApiError(response.status, code, message)
  }
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('ruang-ibu:admin-session-activity'))
  const data = (body as { data?: unknown } | null)?.data
  if (data === undefined || data === null) throw new AdminApiError(502, 'invalid_response', 'Respons layanan pengelola tidak sesuai format.')
  return data as T
}

export function getSummary(signal?: AbortSignal): Promise<AdminSummary> {
  return request<unknown>('/api/admin/summary', {}, signal).then((value) => {
    const keys = ['total', 'pending', 'approved', 'answered', 'rejected', 'hidden']
    if (!isRecord(value) || keys.some((key) => typeof value[key] !== 'number' || !Number.isFinite(value[key]))) throw invalidResponse()
    return value as unknown as AdminSummary
  })
}

export function getQuestions(options: { status?: ModerationStatus | readonly ModerationStatus[]; articleSlug?: string; cursor?: string | null; limit?: number }, signal?: AbortSignal): Promise<AdminQuestionPage> {
  const params = new URLSearchParams()
  if (options.status) params.set('status', Array.isArray(options.status) ? options.status.join(',') : options.status as string)
  if (options.articleSlug) params.set('articleSlug', options.articleSlug)
  if (options.limit) params.set('limit', String(options.limit))
  if (options.cursor) params.set('cursor', options.cursor)
  return request<unknown>(`/api/admin/questions?${params}`, {}, signal).then((value) => {
    if (!isRecord(value) || !Array.isArray(value.questions) || !(value.nextCursor === null || typeof value.nextCursor === 'string')) throw invalidResponse()
    if (value.questions.some((question) => !isRecord(question) || typeof question.id !== 'string' || typeof question.articleSlug !== 'string' || typeof question.displayName !== 'string' || typeof question.question !== 'string' || typeof question.createdAt !== 'string' || typeof question.status !== 'string' || !questionStatuses.has(question.status))) throw invalidResponse()
    return value as unknown as AdminQuestionPage
  })
}

export function getQuestion(id: string, signal?: AbortSignal): Promise<AdminQuestion> {
  return request<unknown>(`/api/admin/questions/${encodeURIComponent(id)}`, {}, signal).then((value) => {
    if (!isRecord(value) || typeof value.id !== 'string' || typeof value.articleSlug !== 'string' || typeof value.displayName !== 'string' || typeof value.question !== 'string' || typeof value.createdAt !== 'string' || typeof value.status !== 'string' || !questionStatuses.has(value.status)) throw invalidResponse()
    return value as unknown as AdminQuestion
  })
}

export function moderateQuestion(id: string, payload: { action: 'approve'; publicDisplayName: string; publicQuestionText: string } | { action: 'reject' | 'hide' }): Promise<{ id: string; status: ModerationStatus }> {
  return request(`/api/admin/questions/${encodeURIComponent(id)}/moderation`, { method: 'POST', body: JSON.stringify(payload) })
}

export function saveAnswer(id: string, answer: string, legacyPublicText?: { publicDisplayName: string; publicQuestionText: string }): Promise<{ id: string; status: 'answered'; answerUpdatedAt: string }> {
  return request(`/api/admin/questions/${encodeURIComponent(id)}/answer`, {
    method: 'PUT',
    body: JSON.stringify({ answer, ...legacyPublicText }),
  })
}

export function deleteQuestion(id: string): Promise<{ id: string; deleted: true }> {
  return request(`/api/admin/questions/${encodeURIComponent(id)}`, { method: 'DELETE' })
}
