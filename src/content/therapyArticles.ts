import type { TherapyArticle } from './therapyContent.types'

export const therapyArticles: Record<string, TherapyArticle> = {
  'musik-relaksasi': {
    id: 'T02',
    slug: 'musik-relaksasi',
    title: 'Musik untuk Relaksasi',
    categories: ['Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-23' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Musik pilihan Ibu dapat menemani suasana saat persalinan. Musik tidak menjamin nyeri atau rasa cemas berkurang, dan belum tentu terasa nyaman bagi setiap Ibu.',
      referenceIds: ['S1', 'S2', 'S3'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu musik untuk relaksasi?',
        paragraphs: [
          {
            text: 'Di halaman ini, musik untuk relaksasi berarti mendengarkan musik yang Ibu pilih sendiri. Ini berbeda dari terapi musik klinis yang diberikan oleh tenaga profesional dengan tujuan dan pendekatan tertentu.',
            referenceIds: ['S13'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Musik dapat menjadi pilihan untuk menemani suasana yang Ibu inginkan. Mendengarkannya tidak menjamin nyeri atau kecemasan berkurang.',
            referenceIds: ['S1', 'S2', 'S3'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Pilihan ini dapat dibicarakan saat merencanakan persalinan. Ibu bebas memilih musik, tidak mendengarkannya, atau mengubah pilihan kapan saja.',
            referenceIds: ['S1', 'S2', 'S3'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Hentikan musik jika terasa tidak nyaman atau mengganggu komunikasi dengan pendamping maupun tenaga kesehatan. Ibu bebas memilih untuk tidak mendengarkan. Informasi ini tidak menggantikan pemeriksaan maupun arahan bidan dan dokter.',
      referenceIds: ['S1', 'S2'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Ini panduan penggunaan audio di Ruang Ibu, bukan terapi musik klinis atau saran medis.',
      instructions: [
        { text: 'Pilih musik yang Ibu sukai, atau lewati jika tidak ingin mendengarkan.', referenceIds: ['S2'] },
        { text: 'Atur volume hingga terasa nyaman dan tetap memungkinkan Ibu mendengar orang di sekitar.', referenceIds: [] },
        { text: 'Tekan putar untuk memulai. Ibu dapat menjeda atau menghentikan audio kapan saja.', referenceIds: [] },
        { text: 'Beri tahu pendamping atau bidan jika musik mengganggu atau Ibu ingin mengganti pilihan.', referenceIds: ['S2'] },
      ],
    },
    audio: {
      status: 'available',
      trackId: 'ambient',
    },
    referenceIds: ['S1', 'S2', 'S3', 'S13'],
    updatedAt: '2026-10-23',
  },
  'relaksasi-otot-ringan': {
    id: 'T03',
    slug: 'relaksasi-otot-ringan',
    title: 'Relaksasi Tubuh',
    categories: ['Relaksasi'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-23' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Satu sumber untuk pasien membahas grounding saat pengalaman terkait kehamilan atau persalinan terasa berat. Sumber tersebut berfokus pada situasi distress atau trauma, bukan pada metode relaksasi tubuh umum yang sesuai untuk semua Ibu.',
      referenceIds: ['S14'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu relaksasi tubuh?',
        paragraphs: [
          {
            text: 'Grounding berarti mengarahkan perhatian kembali ke keadaan saat ini. Healthier Together menyebutnya sebagai salah satu pilihan ketika seseorang merasa kewalahan, panik, atau terputus dari keadaan sekitar.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Sumber tersebut memuat beberapa pilihan grounding untuk menghadapi situasi emosional yang terasa berat. Pengalaman dan respons tiap orang dapat berbeda; halaman ini tidak menjanjikan hasil tertentu.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Informasi ini terbatas pada konteks distress atau trauma terkait kehamilan dan persalinan yang dibahas oleh sumber. Ini bukan rekomendasi relaksasi umum untuk semua Ibu.',
            referenceIds: ['S14'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Ibu tidak harus mencoba pilihan grounding apa pun. Bila topik atau pilihan yang dibahas terasa tidak nyaman, hentikan dan sampaikan kepada bidan atau tenaga kesehatan yang mendampingi. Informasi ini tidak menggantikan pemeriksaan atau arahan mereka.',
      referenceIds: ['S14'],
    },
    practiceGuide: {
      status: 'locked_pending_review',
      message: 'Bagian ini tidak memberikan langkah praktik. Sumber yang tersedia membahas grounding dalam konteks tertentu; bicarakan kecocokannya dengan tenaga kesehatan yang mendampingi.',
    },
    audio: {
      status: 'not_applicable',
    },
    referenceIds: ['S14'],
    updatedAt: '2026-10-23',
  },
  'pijat-pendamping-persalinan': {
    id: 'T04',
    slug: 'pijat-pendamping-persalinan',
    title: 'Pijat Pendamping',
    categories: ['Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-23' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Pijat pendamping dapat menjadi salah satu pilihan sentuhan saat persalinan, jika Ibu menginginkannya. Manfaatnya belum dapat dipastikan dan bisa berbeda pada setiap Ibu.',
      referenceIds: ['S1', 'S2', 'S4', 'S8'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu pijat pendamping?',
        paragraphs: [
          {
            text: 'Pijat pendamping adalah pijat yang diberikan oleh pendamping saat persalinan jika Ibu menginginkannya. Ibu berhak menolak atau meminta sentuhan dihentikan kapan saja.',
            referenceIds: ['S1', 'S2'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Pijat dibahas sebagai salah satu pilihan pendamping kenyamanan saat persalinan. Pijat tidak menggantikan pemeriksaan bidan atau dokter maupun pilihan pereda nyeri lainnya.',
            referenceIds: ['S1', 'S2', 'S4', 'S8'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Saat persalinan, pijat dapat menjadi salah satu pilihan bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri. Jika Ibu memilihnya, pendamping perlu lebih dahulu diajari teknik yang akan digunakan. Bicarakan pilihan ini dengan bidan yang mendampingi.',
            referenceIds: ['S1', 'S2', 'S4'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Persetujuan dan kenyamanan Ibu harus dihormati. Ibu dapat memilih tidak dipijat atau meminta sentuhan dihentikan kapan saja. Halaman ini tidak memberi arahan tentang lokasi, tekanan, durasi, atau teknik pijat, dan tidak dapat memastikan bentuk pijat yang sesuai untuk kondisi Ibu. Informasi ini tidak menggantikan arahan bidan atau dokter.',
      referenceIds: ['S1', 'S2', 'S4'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Panduan ini hanya tentang komunikasi dan pilihan Ibu. Tidak berisi teknik pijat.',
      instructions: [
        { text: 'Sampaikan kepada pendamping bila Ibu ingin atau tidak ingin sentuhan saat persalinan.', referenceIds: ['S1', 'S2'] },
        { text: 'Pastikan Ibu setuju sebelum sentuhan diberikan. Ibu boleh menolak atau meminta sentuhan dihentikan kapan saja.', referenceIds: ['S1', 'S2'] },
        { text: 'Beri tahu pendamping apa yang terasa nyaman atau tidak nyaman.', referenceIds: ['S1', 'S2'] },
        { text: 'Jika Ibu memilih pijat, pastikan pendamping hanya menggunakan teknik yang sudah diajarkan kepadanya.', referenceIds: ['S2'] },
        { text: 'Bicarakan pilihan ini dengan bidan. Minta bantuan bila ada hal yang membuat Ibu ragu atau tidak nyaman.', referenceIds: ['S1', 'S2'] },
      ],
    },
    audio: {
      status: 'not_applicable',
    },
    referenceIds: ['S1', 'S2', 'S4', 'S8'],
    updatedAt: '2026-10-23',
  },
  'teknik-pernapasan': {
    id: 'T01',
    slug: 'teknik-pernapasan',
    title: 'Teknik Pernapasan',
    categories: ['Kehamilan', 'Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-23' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Saat hamil, Ibu dapat mencari tahu pilihan pernapasan untuk persiapan persalinan bersama bidan. Saat persalinan, napas perlahan dan berirama dapat dicoba jika terasa nyaman. Cara ini tidak selalu membantu semua Ibu.',
      referenceIds: ['S1', 'S2', 'S3', 'S5', 'S6', 'S15'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu teknik pernapasan?',
        paragraphs: [
          {
            text: 'Teknik pernapasan berarti menggunakan napas dengan cara yang terasa nyaman sebagai salah satu pilihan untuk menghadapi persalinan. Bidan dapat membantu Ibu mengenal pilihan yang tersedia.',
            referenceIds: ['S1', 'S2', 'S6'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Sebagian Ibu memilih memperhatikan napas untuk membantu menghadapi persalinan. Pengalaman setiap Ibu berbeda, dan cara ini tidak menjamin nyeri berkurang.',
            referenceIds: ['S1', 'S2', 'S3'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan teknik ini dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Selama kehamilan, Ibu dapat membicarakan persiapan pernapasan dengan bidan. Informasi ini tidak menentukan latihan yang sesuai untuk kondisi Ibu.',
            referenceIds: ['S5'],
          },
          {
            text: 'Saat persalinan, sumber pasien menjelaskan napas perlahan dan berirama ketika kontraksi terasa meningkat. Ibu dapat memilih cara bernapas yang terasa lebih nyaman dan meminta dukungan bidan kapan saja.',
            referenceIds: ['S1', 'S2', 'S3', 'S6', 'S15'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Penjelasan ini bukan latihan mengejan atau menahan napas. Jangan memaksakan cara bernapas yang terasa tidak nyaman. Website ini tidak dapat menilai kondisi pribadi Ibu dan tidak menggantikan arahan bidan atau dokter.',
      referenceIds: ['S1', 'S2', 'S6', 'S15'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Langkah berikut merangkum pilihan dalam panduan pasien. Gunakan hanya jika terasa nyaman; bidan dapat memberi dukungan.',
      instructions: [
        { text: 'Saat hamil, bicarakan pilihan latihan pernapasan untuk persiapan persalinan dengan bidan. Panduan pasien menyarankan mencari cara yang terasa sesuai bagi Ibu.', referenceIds: ['S6'] },
        { text: 'Saat persalinan, ketika kontraksi mulai terasa meningkat, hembuskan napas. Lanjutkan bernapas perlahan dan berirama selama kontraksi.', referenceIds: ['S6'] },
        { text: 'Usahakan bahu tetap rileks. Ibu dapat bernapas melalui hidung atau mulut, pilih yang terasa lebih nyaman.', referenceIds: ['S6'] },
        { text: 'Ibu dapat meminta saran dan dukungan bidan kapan saja, serta mengubah pilihan bila diperlukan.', referenceIds: ['S6', 'S15'] },
      ],
    },
    audio: {
      status: 'available',
      trackId: 'rain',
    },
    referenceIds: ['S1', 'S2', 'S3', 'S5', 'S6', 'S15'],
    updatedAt: '2026-10-23',
  },
}
