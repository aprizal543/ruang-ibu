import type { TherapyReference } from './therapyContent.types'

const labels: Record<NonNullable<TherapyReference['sourceType']>, string> = {
  original_research: 'Penelitian asli',
  systematic_review: 'Tinjauan sistematis',
  overview_of_reviews: 'Tinjauan atas tinjauan',
  clinical_guideline: 'Pedoman kesehatan resmi',
  official_health_information: 'Informasi kesehatan resmi',
  historical_source: 'Sumber historis',
}

export function getTherapySourceTypeLabel(sourceType: TherapyReference['sourceType']): string {
  return sourceType ? labels[sourceType] : 'Sumber informasi'
}
