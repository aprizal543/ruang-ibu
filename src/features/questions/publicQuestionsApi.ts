export interface PublicQuestion {
  id: string
  articleSlug: string
  displayName: string
  question: string
  status: 'approved' | 'answered'
  createdAt: string
  answer: { text: string; updatedAt: string | null } | null
}

export interface PublicQuestionPage {
  questions: PublicQuestion[]
  nextCursor: string | null
}

export class PublicQuestionApiError extends Error {
  constructor(message: string, readonly status: number, readonly code?: string) {
    super(message)
    this.name = 'PublicQuestionApiError'
  }
}

function invalidResponse(): PublicQuestionApiError {
  return new PublicQuestionApiError('Respons layanan tidak dapat dibaca.', 502, 'invalid_response')
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

async function request<T>(path: string, init: RequestInit = {}, signal?: AbortSignal): Promise<T> {
  let response: Response
  try {
    response = await fetch(path, { ...init, signal, credentials: 'same-origin', cache: 'no-store' })
  } catch {
    throw new PublicQuestionApiError('Koneksi belum tersedia. Coba lagi saat tersambung ke internet.', 0)
  }
  const payload: unknown = await response.json().catch(() => null)
  if (!response.ok) {
    const error = typeof payload === 'object' && payload !== null && 'error' in payload
      ? (payload as { error?: { code?: unknown; message?: unknown } }).error
      : undefined
    throw new PublicQuestionApiError(
      typeof error?.message === 'string' ? error.message : 'Permintaan belum dapat diproses. Coba lagi.',
      response.status,
      typeof error?.code === 'string' ? error.code : undefined,
    )
  }
  if (typeof payload !== 'object' || payload === null || !('data' in payload)) {
    throw new PublicQuestionApiError('Respons layanan tidak dapat dibaca.', response.status)
  }
  return (payload as { data: T }).data
}

export function getTurnstileSiteKey(signal?: AbortSignal): Promise<{ turnstileSiteKey: string }> {
  return request<unknown>('/api/questions/config', {}, signal).then((value) => {
    if (!isRecord(value) || typeof value.turnstileSiteKey !== 'string' || !value.turnstileSiteKey.trim()) throw invalidResponse()
    return { turnstileSiteKey: value.turnstileSiteKey }
  })
}

export function getPublicQuestions(articleSlug: string, cursor?: string | null, signal?: AbortSignal): Promise<PublicQuestionPage> {
  const params = new URLSearchParams({ articleSlug, limit: '10' })
  if (cursor) params.set('cursor', cursor)
  return request<unknown>(`/api/questions?${params}`, {}, signal).then((value) => {
    if (!isRecord(value) || !Array.isArray(value.questions) || !(value.nextCursor === null || typeof value.nextCursor === 'string')) throw invalidResponse()
    if (value.questions.some((item) => !isRecord(item)
      || typeof item.id !== 'string'
      || item.articleSlug !== articleSlug
      || typeof item.displayName !== 'string'
      || typeof item.question !== 'string'
      || !['approved', 'answered'].includes(String(item.status))
      || typeof item.createdAt !== 'string'
      || !(item.answer === null || (isRecord(item.answer) && typeof item.answer.text === 'string')))) throw invalidResponse()
    return value as unknown as PublicQuestionPage
  })
}

export function submitPublicQuestion(input: {
  articleSlug: string
  displayName?: string
  question: string
  consentToPublicDisplay: true
  turnstileToken: string
}, signal?: AbortSignal): Promise<{ id: string; status: 'approved'; message: string; question: PublicQuestion }> {
  return request<unknown>('/api/questions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  }, signal).then((value) => {
    if (!isRecord(value) || value.status !== 'approved' || typeof value.id !== 'string' || typeof value.message !== 'string' || !isRecord(value.question)) throw invalidResponse()
    const question = value.question
    if (typeof question.id !== 'string' || question.id !== value.id || question.articleSlug !== input.articleSlug
      || typeof question.displayName !== 'string' || typeof question.question !== 'string'
      || question.status !== 'approved' || typeof question.createdAt !== 'string' || question.answer !== null) throw invalidResponse()
    return { id: value.id, status: 'approved', message: value.message, question: question as unknown as PublicQuestion }
  })
}
