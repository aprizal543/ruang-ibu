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

export type TherapySourceReview =
  | { status: 'draft' }
  | { status: 'source_reviewed'; reviewedAt: string }

export interface TherapyReference {
  id: string
  title: string
  displayTitle?: string
  publisher: string
  publicationYear?: number
  sourceDateLabel?: string
  url: string
  accessedAt: string
  authors?: string[]
  doi?: string
  studyDesign?: string
  population?: string
  evidenceLimitations?: string[]
  mappedTopics?: string[]
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
  | { status: 'not_applicable' }
  | { status: 'available'; trackId: string }

export type TherapyGuideAvailability =
  | { status: 'locked_pending_review'; message: string }
  | { status: 'source_based'; note: string; instructions: Array<{ text: string; referenceIds: string[] }> }
  | { status: 'approved'; instructions: string[]; approvedAt: string }

export interface TherapyArticle {
  id: string
  slug: string
  title: string
  summaryHeading?: string
  categories: string[]
  sourceReview: TherapySourceReview
  clinicalReview: TherapyClinicalReview
  introduction: TherapyParagraph
  sections: TherapyArticleSection[]
  safetyNotice: TherapyParagraph
  practiceGuide: TherapyGuideAvailability
  audio: TherapyAudioAvailability
  referenceIds: string[]
  updatedAt: string
  approvalDate?: string
}
