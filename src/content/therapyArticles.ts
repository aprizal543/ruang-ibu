import type { TherapyArticle, TherapyArticleDefinition } from './therapyContent.types'
import { customerRevisionArticles } from './customerRevisionArticles'
import { therapyArticleFigures } from './therapyArticleFigures'

const articleDefinitions: Record<string, TherapyArticleDefinition> = {
  ...customerRevisionArticles,
  'musik-relaksasi': {
    id: 'T02',
    slug: 'musik-relaksasi',
    title: 'Musik untuk Relaksasi',
    categories: ['Hamil', 'Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-23' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Musik yang Ibu sukai dapat menjadi teman saat ingin beristirahat atau merasa lebih tenang selama hamil dan persalinan. Jika terasa mengganggu, Ibu dapat mengganti pilihan atau berhenti mendengarkan.',
      referenceIds: ['S1', 'S2', 'S40', 'C04', 'C05', 'C06', 'C07', 'C08'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu musik untuk relaksasi?',
        paragraphs: [
          {
            text: 'Musik yang Ibu pilih sendiri dapat menjadi teman saat beristirahat. Dalam beberapa penelitian, terapi musik merupakan bagian dari program yang dirancang khusus. Hasil program tersebut belum tentu sama dengan mendengarkan playlist biasa.',
            referenceIds: ['S13', 'C05', 'C06', 'C07', 'C08'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Dalam rangkuman pilihan tanpa obat untuk nyeri punggung saat hamil, musik dibahas bersama relaksasi. Hasilnya tidak menilai playlist Ruang Ibu secara khusus.',
            referenceIds: ['C04'],
          },
          {
            text: 'Satu studi menggunakan musik saat pemeriksaan denyut jantung bayi pada kehamilan berisiko tinggi. Studi lain menggabungkan musik dan edukasi kesehatan untuk ibu yang baru pertama kali hamil. Keduanya merupakan program khusus, bukan playlist biasa.',
            referenceIds: ['C05', 'C06'],
          },
          {
            text: 'Rangkuman bukti musik saat persalinan menunjukkan nyeri mungkin lebih ringan pada sebagian tahap, tetapi perubahan rasa cemas belum terlihat jelas. Satu studi pada ibu hamil cukup bulan melaporkan rasa cemas yang lebih rendah setelah mendengarkan musik. Hasil tersebut belum tentu sama bagi setiap Ibu atau berlaku pada playlist biasa.',
            referenceIds: ['C07', 'C08'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Ibu dapat mencoba audio pilihan sendiri pada masa hamil atau persalinan, mengubah pilihan, atau tidak mendengarkan. Pada persalinan, pastikan musik tidak menghalangi komunikasi dengan pendamping dan tenaga kesehatan.',
            referenceIds: ['S1', 'S2'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Hentikan musik jika terasa tidak nyaman atau mengganggu komunikasi dengan pendamping maupun tenaga kesehatan. Ibu bebas memilih untuk tidak mendengarkan. Delapan audio Ruang Ibu adalah pilihan dengar, bukan program terapi musik seperti yang digunakan dalam penelitian.',
      referenceIds: ['S1', 'S2', 'C04', 'C05', 'C06', 'C07', 'C08'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Audio ini dapat menemani suasana, tetapi tidak menjanjikan perubahan nyeri atau rasa cemas.',
      instructions: [
        { text: 'Pilih audio yang Ibu sukai selama hamil atau bersalin, atau lewati jika tidak ingin mendengarkan.', referenceIds: ['S2'] },
        { text: 'Atur volume pada tingkat yang nyaman dan tetap memungkinkan Ibu mendengar orang di sekitar.', referenceIds: ['S1', 'S2'] },
        { text: 'Ibu dapat menjeda atau menghentikan audio kapan saja bila tidak nyaman atau ingin berkomunikasi.', referenceIds: ['S1', 'S2'] },
        { text: 'Beri tahu pendamping atau bidan jika musik mengganggu atau Ibu ingin mengganti pilihan.', referenceIds: ['S2'] },
      ],
    },
    audio: {
      status: 'available',
      trackId: 'ambient',
    },
    referenceIds: ['S1', 'S2', 'S13', 'S40', 'C04', 'C05', 'C06', 'C07', 'C08'],
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
      text: 'Satu panduan kesehatan membahas grounding—mengalihkan perhatian kembali ke keadaan sekitar saat ini—ketika pengalaman kehamilan atau persalinan terasa berat. Panduan tersebut berfokus pada rasa kewalahan atau panik, bukan latihan relaksasi umum untuk semua Ibu.',
      referenceIds: ['S14'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu relaksasi tubuh?',
        paragraphs: [
          {
            text: 'Grounding berarti mengarahkan perhatian pada keadaan saat ini. Panduan Healthier Together menyebutnya sebagai salah satu pilihan saat seseorang merasa kewalahan, panik, atau seolah terputus dari keadaan sekitar.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Panduan tersebut memuat pilihan grounding untuk situasi emosional yang terasa berat. Pengalaman setiap orang berbeda, dan cara ini tidak menjanjikan hasil tertentu.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Informasi ini hanya membahas grounding dalam situasi berat yang dijelaskan sumber. Materi ini bukan panduan relaksasi tubuh umum untuk semua Ibu.',
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
      status: 'source_based',
      note: 'Pilihan berikut berfokus pada meminta dukungan dan menjaga kendali Ibu; materi ini tidak mengajarkan latihan grounding atau menjanjikan efek tertentu.',
      instructions: [
        { text: 'Jika merasa kewalahan, beri tahu pendamping atau tenaga kesehatan bahwa Ibu membutuhkan dukungan.', referenceIds: ['S14', 'S22'] },
        { text: 'Minta penjelasan atau jeda bila ada hal yang belum dipahami atau terasa tidak nyaman.', referenceIds: ['S22'] },
        { text: 'Ibu tidak perlu mencoba latihan atau pilihan apa pun yang tidak diinginkan.', referenceIds: ['S14', 'S22'] },
        { text: 'Bicarakan dengan bidan atau dokter bila rasa kewalahan berlanjut atau mengganggu kegiatan sehari-hari.', referenceIds: ['S14'] },
      ],
    },
    audio: {
      status: 'not_applicable',
    },
    referenceIds: ['S14', 'S22'],
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
      referenceIds: ['S1', 'S2', 'S8', 'S33', 'S34'],
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
            text: 'Tinjauan pijat sakral dan uji shiatsu oleh bidan terlatih meneliti teknik tertentu saat persalinan. Temuan itu tidak membuktikan manfaat pijat umum oleh pendamping; persetujuan Ibu dan komunikasi dengan bidan tetap utama.',
            referenceIds: ['S33', 'S34'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Saat persalinan, pijat dapat menjadi salah satu pilihan bagi Ibu yang ingin mendapat dukungan saat nyeri. Jika Ibu memilihnya, pendamping perlu lebih dahulu mempelajari teknik yang akan digunakan dan membicarakannya dengan bidan.',
            referenceIds: ['S1', 'S2', 'S33', 'S34'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Persetujuan dan kenyamanan Ibu harus dihormati. Ibu dapat memilih tidak dipijat atau meminta sentuhan dihentikan kapan saja. Halaman ini tidak memberi arahan tentang lokasi, tekanan, durasi, atau teknik pijat, dan tidak dapat memastikan bentuk pijat yang sesuai untuk kondisi Ibu. Informasi ini tidak menggantikan arahan bidan atau dokter.',
      referenceIds: ['S1', 'S2', 'S33', 'S34'],
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
    referenceIds: ['S1', 'S2', 'S8', 'S33', 'S34'],
    updatedAt: '2026-10-23',
  },
  'teknik-pernapasan': {
    id: 'T01',
    slug: 'teknik-pernapasan',
    title: 'Teknik Pernapasan',
    categories: ['Hamil', 'Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-23' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Saat hamil, Ibu dapat membicarakan pilihan pernapasan untuk persiapan persalinan dengan bidan. Saat persalinan, Ibu boleh mencoba bernapas perlahan dan berirama jika terasa nyaman. Pengalaman setiap Ibu berbeda.',
      referenceIds: ['S1', 'S2', 'S5', 'S6', 'S15', 'S32', 'S39'],
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
            referenceIds: ['S1', 'S2', 'S32'],
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
            referenceIds: ['S1', 'S2', 'S6', 'S15', 'S32'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Pilihan bernapas ini bukan latihan mengejan atau menahan napas. Jangan memaksakan cara yang terasa tidak nyaman. Tanyakan kepada bidan atau dokter bila Ibu memiliki pertanyaan atau membutuhkan bantuan.',
    referenceIds: ['S1', 'S2', 'S6', 'S15', 'S32', 'S39'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Pilihan ini dapat dicoba jika terasa nyaman. Bidan dapat membantu Ibu membicarakan cara yang sesuai.',
      instructions: [
        { text: 'Saat hamil, bicarakan dengan bidan cara bernapas yang terasa sesuai untuk persiapan persalinan.', referenceIds: ['S6'] },
        { text: 'Saat persalinan, ketika kontraksi mulai terasa meningkat, hembuskan napas. Lanjutkan bernapas perlahan dan berirama selama kontraksi.', referenceIds: ['S6'] },
        { text: 'Usahakan bahu tetap rileks. Ibu dapat bernapas melalui hidung atau mulut, pilih yang terasa lebih nyaman.', referenceIds: ['S6'] },
        { text: 'Ibu dapat meminta saran dan dukungan bidan kapan saja, serta mengubah pilihan bila diperlukan.', referenceIds: ['S6', 'S15'] },
      ],
    },
    audio: {
      status: 'available',
      trackId: 'rain',
    },
    referenceIds: ['S1', 'S2', 'S5', 'S6', 'S15', 'S32', 'S39'],
    updatedAt: '2026-10-23',
  },
}

export const therapyArticles: Record<string, TherapyArticle> = Object.fromEntries(
  Object.entries(articleDefinitions).map(([slug, article]) => {
    const figure = therapyArticleFigures[article.id]
    if (!figure) throw new Error(`Missing article figure for ${article.id}`)
    return [slug, { ...article, figure }]
  }),
)
