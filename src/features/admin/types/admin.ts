export type ModerationStatus = 'pending' | 'approved' | 'answered' | 'rejected' | 'hidden'

export interface AdminSummary {
  total: number
  pending: number
  approved: number
  answered: number
  rejected: number
  hidden: number
}

export interface AdminQuestion {
  id: string
  articleSlug: string
  displayName: string
  question: string
  email: string | null
  status: ModerationStatus
  publicDisplayName: string | null
  publicQuestion: string | null
  createdAt: string
  updatedAt: string
  moderatedAt: string | null
  moderatedBy: string | null
  expiresAt: string
  answer: string | null
  answeredBy?: string | null
  answerCreatedAt?: string | null
  answerUpdatedAt?: string | null
}

export interface AdminQuestionPage {
  questions: AdminQuestion[]
  nextCursor: string | null
}

export type ModeratorPreauthorizationStatus = 'active' | 'expired' | 'consumed' | 'revoked'

export interface ModeratorPreauthorization {
  id: string
  email: string
  role: 'moderator'
  status: ModeratorPreauthorizationStatus
  createdAt: number
  expiresAt: number
  consumedAt: number | null
}

export interface ApiErrorState {
  status: number
  code: string
  message: string
}
