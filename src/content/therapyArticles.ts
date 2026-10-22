import type { TherapyArticle } from './therapyContent.types'

export const therapyArticles: Record<string, TherapyArticle> = {
  'teknik-pernapasan': {
    id: 'T01',
    slug: 'teknik-pernapasan',
    title: 'Teknik Pernapasan',
    categories: ['Kehamilan trimester III', 'Saat persalinan'],
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Teknik pernapasan dapat menjadi salah satu pilihan relaksasi saat persalinan. Manfaatnya belum dapat dipastikan dan bisa berbeda pada setiap Ibu. Pilihan ini belum tentu sesuai untuk semua kondisi.',
      referenceIds: ['S1', 'S2', 'S3'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu teknik pernapasan?',
        paragraphs: [
          {
            text: 'Dalam relaksasi, teknik pernapasan berarti memperhatikan napas yang terasa nyaman. Penjelasan ini mengenalkan konsep saja, bukan panduan latihan.',
            referenceIds: ['S1', 'S2'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Teknik ini dibahas sebagai salah satu pilihan untuk membantu Ibu merasa lebih rileks saat persalinan. Tujuannya memberi pilihan sesuai keinginan Ibu; hasil tertentu tidak dapat dijanjikan.',
            referenceIds: ['S1', 'S2', 'S3'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan teknik ini dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Selama kehamilan, latihan pernapasan dan meditasi disebut sebagai pilihan perawatan diri untuk membantu rileks. Informasi ini bersifat umum dan bukan penilaian terhadap kondisi Ibu. Jika rasa cemas terasa terus-menerus atau mengganggu aktivitas, bicarakan dengan bidan atau dokter.',
            referenceIds: ['S5'],
          },
          {
            text: 'Bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri saat persalinan, teknik pernapasan dapat menjadi salah satu pilihan relaksasi. Ibu dapat membicarakan pilihan ini dengan bidan yang mendampingi agar sesuai dengan kondisi dan kebutuhan Ibu.',
            referenceIds: ['S1', 'S2', 'S3'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Penjelasan ini bukan latihan mengejan atau menahan kontraksi. Website ini tidak dapat menilai kondisi pribadi Ibu atau memastikan suatu kegiatan cocok untuk Ibu. Informasi ini tidak menggantikan pemeriksaan atau arahan bidan dan dokter.',
      referenceIds: [],
    },
    practiceGuide: {
      status: 'locked_pending_review',
      message:
        'Panduan praktik belum tersedia. Materi masih menunggu peninjauan dari dosen kebidanan atau tenaga kesehatan yang kompeten.',
    },
    audio: {
      status: 'unavailable',
      message: 'Audio pendamping belum tersedia.',
    },
    referenceIds: ['S1', 'S2', 'S3', 'S5'],
    internalEvidenceNotes: [
      {
        id: 'T01-E01',
        topic: 'Teknik relaksasi saat persalinan',
        certainty: 'low_to_very_low',
        note: 'Cochrane melaporkan kualitas bukti manfaat teknik relaksasi beragam, berkisar rendah hingga sangat rendah; cara yang diteliti juga bervariasi.',
        referenceIds: ['S3'],
      },
      {
        id: 'T01-E02',
        topic: 'Pilihan relaksasi saat persalinan',
        certainty: 'not_rated',
        note: 'WHO dan NICE mencantumkan teknik pernapasan/relaksasi sebagai pilihan sesuai preferensi ibu dalam konteks persalinan yang dinyatakan pedoman.',
        referenceIds: ['S1', 'S2'],
      },
    ],
    updatedAt: '2026-10-22',
    revisionHistory: [
      {
        revision: '0.6',
        date: '2026-10-22',
        note: 'Kalimat tentang pembicaraan pilihan relaksasi dengan bidan disederhanakan. Editorial wording only; menunggu telaah klinis.',
      },
      {
        revision: '0.5',
        date: '2026-10-22',
        note: 'Pengantar memperjelas ketidakpastian manfaat; konteks pilihan relaksasi saat persalinan ditulis ulang untuk pembaca umum. Menunggu telaah klinis.',
      },
      {
        revision: '0.4',
        date: '2026-10-22',
        note: 'Alur baca disusun untuk ibu; pemetaan sumber dan tingkat kepastian bukti dipertahankan sebagai data internal. Menunggu telaah klinis.',
      },
      {
        revision: '0.3',
        date: '2026-10-21',
        note: 'Redaksi disederhanakan untuk pembaca umum; seluruh perubahan klinis menunggu telaah ahli.',
      },
      {
        revision: '0.2',
        date: '2026-10-21',
        note: 'Diringkas dari draf T01; instruksi praktik dikecualikan dari tampilan dan tetap dikunci.',
      },
    ],
    editorialSource: 'reference/MATERI-DRAF-v0.2.md — Artikel T01 (draf, belum divalidasi klinis)',
  },
}
