export type TherapyClinicalReview =
  | {
      status: 'draft' | 'in_review'
      reviewerName?: never
      reviewerRole?: never
      reviewedAt?: never
      approvedAt?: never
    }
  | {
      status: 'approved'
      reviewerName: string
      reviewerRole: string
      reviewedAt: string
      approvedAt: string
    }

export interface TherapyReference {
  id: string
  title: string
  displayTitle?: string
  publisher: string
  publicationYear?: number
  sourceDateLabel?: string
  url: string
  accessedAt: string
}

export interface TherapyParagraph {
  text: string
  referenceIds?: string[]
}

export interface TherapyArticleSection {
  id: string
  heading: string
  paragraphs: TherapyParagraph[]
}

export type TherapyAudioAvailability =
  | { status: 'unavailable'; message: string }
  | { status: 'available'; src: string; title: string }

export type TherapyGuideAvailability =
  | { status: 'locked_pending_review'; message: string }
  | { status: 'approved'; instructions: string[]; approvedAt: string }

export interface TherapyArticle {
  id: string
  slug: string
  title: string
  categories: string[]
  clinicalReview: TherapyClinicalReview
  introduction: TherapyParagraph
  sections: TherapyArticleSection[]
  safetyNotice: TherapyParagraph
  practiceGuide: TherapyGuideAvailability
  audio: TherapyAudioAvailability
  referenceIds: string[]
  internalEvidenceNotes?: Array<{
    id: string
    topic: string
    certainty: 'high' | 'moderate' | 'low' | 'very_low' | 'low_to_very_low' | 'not_rated'
    note: string
    referenceIds: string[]
  }>
  updatedAt: string
  approvalDate?: string
  revisionHistory: Array<{
    revision: string
    date: string
    note: string
  }>
  editorialSource: string
}
