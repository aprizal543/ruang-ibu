import type { TherapyReference } from './therapyContent.types'

export const therapyReferences: Record<string, TherapyReference> = {
  S1: {
    id: 'S1',
    title: 'WHO recommendations: Intrapartum care for a positive childbirth experience',
    displayTitle: 'Pedoman WHO tentang perawatan saat persalinan',
    publisher: 'World Health Organization',
    publicationYear: 2018,
    url: 'https://www.who.int/publications/i/item/9789241550215',
    accessedAt: '2026-10-22',
  },
  S2: {
    id: 'S2',
    title: 'Intrapartum care (NG235), recommendations 1.6.3 and 1.6.5',
    displayTitle: 'Pedoman NICE untuk perawatan saat persalinan',
    publisher: 'National Institute for Health and Care Excellence',
    publicationYear: 2023,
    sourceDateLabel: 'Diperbarui 9 Juni 2026',
    url: 'https://www.nice.org.uk/guidance/ng235/chapter/Recommendations',
    accessedAt: '2026-10-22',
  },
  S3: {
    id: 'S3',
    title: 'Relaxation techniques for pain management in labour',
    displayTitle: 'Cochrane: Teknik relaksasi saat persalinan',
    publisher: 'Cochrane Pregnancy and Childbirth',
    publicationYear: 2018,
    url: 'https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour',
    accessedAt: '2026-10-22',
  },
  S5: {
    id: 'S5',
    title: 'Anxiety in pregnancy',
    displayTitle: 'NHS: Kecemasan saat kehamilan',
    publisher: 'NHS',
    sourceDateLabel: 'Ditinjau 17 Maret 2026',
    url: 'https://www.nhs.uk/pregnancy/mental-health-in-pregnancy-and-after-the-birth/anxiety-in-pregnancy/',
    accessedAt: '2026-10-22',
  },
}
