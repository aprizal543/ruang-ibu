import { resolveQuestionArticleSlug } from '../../src/content/questionArticleRegistry'

const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g

export function normalizePlainText(value: string): string {
  return value.normalize('NFC').replace(CONTROL_CHARACTERS, '').replace(/\r\n?/g, '\n').trim()
}

function characterLength(value: string): number {
  return Array.from(value).length
}

export interface ValidQuestionSubmission {
  articleSlug: string
  displayName: string
  question: string
  email: string | null
  consent: true
  turnstileToken: string
}

export function validateQuestionSubmission(body: Record<string, unknown>): ValidQuestionSubmission | null {
  const allowedKeys = new Set(['articleSlug', 'displayName', 'question', 'email', 'consentToPublicModeration', 'turnstileToken'])
  if (Object.keys(body).some((key) => !allowedKeys.has(key))) return null
  if (typeof body.articleSlug !== 'string' || !resolveQuestionArticleSlug(body.articleSlug)) return null
  if (typeof body.displayName !== 'string' || typeof body.question !== 'string') return null
  if (body.email !== undefined && typeof body.email !== 'string') return null
  if (body.consentToPublicModeration !== true || typeof body.turnstileToken !== 'string') return null

  const article = resolveQuestionArticleSlug(body.articleSlug)
  const displayName = normalizePlainText(body.displayName).replace(/\s+/g, ' ')
  const question = normalizePlainText(body.question)
  const email = body.email === undefined ? null : normalizePlainText(body.email)
  if (!article || characterLength(displayName) < 2 || characterLength(displayName) > 50) return null
  if (characterLength(question) < 10 || characterLength(question) > 1000) return null
  if (email !== null && (characterLength(email) > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(email))) return null
  if (body.turnstileToken.length < 1 || body.turnstileToken.length > 2048) return null

  return {
    articleSlug: article.slug,
    displayName,
    question,
    email,
    consent: true,
    turnstileToken: body.turnstileToken,
  }
}

export function validatePublicText(value: unknown, minLength: number, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const normalized = normalizePlainText(value)
  return characterLength(normalized) >= minLength && characterLength(normalized) <= maxLength ? normalized : null
}
