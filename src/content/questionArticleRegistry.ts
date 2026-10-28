export interface QuestionArticleMetadata {
  id: string
  slug: string
  contentSlug: string
  title: string
  aliases: readonly string[]
}

// Public catalog slugs are canonical for Q&A. The content slugs used by older
// React routes remain accepted aliases and normalize to the same article row.
export const questionArticleRegistry: readonly QuestionArticleMetadata[] = [
  { id: 'A01', slug: 'nyeri-punggung-kehamilan', contentSlug: 'nyeri-punggung-kehamilan', title: 'Nyeri Punggung saat Kehamilan', aliases: [] },
  { id: 'T02', slug: 'terapi-musik', contentSlug: 'musik-relaksasi', title: 'Musik untuk Relaksasi', aliases: ['musik-relaksasi'] },
  { id: 'T01', slug: 'teknik-pernapasan', contentSlug: 'teknik-pernapasan', title: 'Teknik Pernapasan', aliases: [] },
  { id: 'A04', slug: 'kompres-hangat-kehamilan', contentSlug: 'kompres-hangat-kehamilan', title: 'Kompres Hangat Saat Hamil', aliases: [] },
  { id: 'A05', slug: 'pijat-kehamilan', contentSlug: 'pijat-kehamilan', title: 'Pijat untuk Ibu Hamil', aliases: [] },
  { id: 'A06', slug: 'kecemasan-menjelang-persalinan', contentSlug: 'kecemasan-menjelang-persalinan', title: 'Kekhawatiran Menjelang Persalinan', aliases: [] },
  { id: 'B01', slug: 'nyeri-persalinan', contentSlug: 'nyeri-persalinan', title: 'Nyeri Persalinan', aliases: [] },
  { id: 'B05', slug: 'kompres-hangat-persalinan', contentSlug: 'kompres-hangat-persalinan', title: 'Kompres Hangat Saat Persalinan', aliases: [] },
  { id: 'B06', slug: 'kecemasan-persalinan', contentSlug: 'kecemasan-persalinan', title: 'Kekhawatiran Selama Persalinan', aliases: [] },
  { id: 'T04', slug: 'pijat-pendamping', contentSlug: 'pijat-pendamping-persalinan', title: 'Pijat Pendamping', aliases: ['pijat-pendamping-persalinan'] },
  { id: 'T03', slug: 'relaksasi-otot-ringan', contentSlug: 'relaksasi-otot-ringan', title: 'Relaksasi Tubuh', aliases: [] },
]

const articlesBySlug = new Map<string, QuestionArticleMetadata>()
for (const article of questionArticleRegistry) {
  articlesBySlug.set(article.slug, article)
  for (const alias of article.aliases) articlesBySlug.set(alias, article)
}

export function resolveQuestionArticleSlug(slug: string): QuestionArticleMetadata | undefined {
  return articlesBySlug.get(slug)
}
