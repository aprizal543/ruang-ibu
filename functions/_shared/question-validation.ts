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
  consent: true
  turnstileToken: string
}

export type PublicQuestionRisk = 'personal_information' | 'links_not_allowed' | 'spam'

export function classifyPublicQuestionRisk(displayName: string, question: string): PublicQuestionRisk | null {
  const text = `${displayName}\n${question}`
  const lowerText = text.toLocaleLowerCase('id-ID')
  const hasEmail = /\b[^\s@]+@[^\s@]+\.[^\s@]+\b/u.test(text)
  const hasPhone = /(?:\+?62|0)(?:[\s().-]*\d){8,13}(?!\d)/u.test(text)
  const hasIdentityNumber = /(?<!\d)\d{16}(?!\d)/u.test(text)
  const namesPrivateContact = /\b(?:alamat saya|rumah saya di|nomor (?:hp|telepon|wa) saya|no\.?\s*(?:hp|telepon|wa) saya|email saya|nik saya|ktp saya)\b/u.test(lowerText)
  if (hasEmail || hasPhone || hasIdentityNumber || namesPrivateContact) return 'personal_information'

  const hasLink = /(?:https?:\/\/|www\.)|\b[\w-]+\.(?:com|net|org|id|co|io|gov)\b/iu.test(text)
  if (hasLink) return 'links_not_allowed'

  const hasRepeatedCharacter = /(.)\1{8,}/u.test(lowerText)
  const hasRepeatedWord = /\b([\p{L}\p{N}]{2,})(?:\s+\1){4,}\b/iu.test(lowerText)
  if (hasRepeatedCharacter || hasRepeatedWord) return 'spam'
  return null
}

export function validateQuestionSubmission(body: Record<string, unknown>): ValidQuestionSubmission | null {
  const allowedKeys = new Set(['articleSlug', 'displayName', 'question', 'consentToPublicDisplay', 'turnstileToken'])
  if (Object.keys(body).some((key) => !allowedKeys.has(key))) return null
  if (typeof body.articleSlug !== 'string' || !resolveQuestionArticleSlug(body.articleSlug)) return null
  if (body.displayName !== undefined && typeof body.displayName !== 'string') return null
  if (typeof body.question !== 'string') return null
  if (body.consentToPublicDisplay !== true || typeof body.turnstileToken !== 'string') return null

  const article = resolveQuestionArticleSlug(body.articleSlug)
  const displayName = typeof body.displayName === 'string'
    ? normalizePlainText(body.displayName).replace(/\s+/g, ' ')
    : ''
  const question = normalizePlainText(body.question)
  if (!article || (displayName !== '' && (characterLength(displayName) < 2 || characterLength(displayName) > 50))) return null
  if (characterLength(question) < 10 || characterLength(question) > 1000) return null
  if (body.turnstileToken.length < 1 || body.turnstileToken.length > 2048) return null
  if (classifyPublicQuestionRisk(displayName, question)) return null

  return {
    articleSlug: article.slug,
    displayName: displayName || 'Ibu',
    question,
    consent: true,
    turnstileToken: body.turnstileToken,
  }
}

export function validatePublicText(value: unknown, minLength: number, maxLength: number): string | null {
  if (typeof value !== 'string') return null
  const normalized = normalizePlainText(value)
  return characterLength(normalized) >= minLength && characterLength(normalized) <= maxLength ? normalized : null
}
