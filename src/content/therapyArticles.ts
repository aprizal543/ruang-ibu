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
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-28' },
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
            text: 'Penelitian musik saat persalinan dan kehamilan menggunakan program, populasi, serta ukuran hasil yang berbeda. Temuan tersebut tidak memastikan bahwa mendengarkan playlist biasa akan mengurangi nyeri atau kecemasan, dan tidak menilai audio Ruang Ibu secara khusus.',
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
    updatedAt: '2026-10-28',
  },
  'relaksasi-otot-ringan': {
    id: 'T03',
    slug: 'relaksasi-otot-ringan',
    title: 'Relaksasi Tubuh',
    categories: ['Relaksasi'],
    sourceReview: { status: 'draft' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Grounding disebut dalam satu panduan untuk menghadapi kenangan persalinan yang terasa mengganggu. Cakupan itu khusus dan tidak membuktikan bahwa grounding merupakan terapi relaksasi umum atau memberi manfaat klinis bagi semua Ibu.',
      referenceIds: ['S14'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu relaksasi tubuh?',
        paragraphs: [
          {
            text: 'Panduan Healthier Together mencantumkan grounding atau pernapasan sebagai salah satu pilihan ketika kenangan persalinan terasa mengganggu. Materi ini tidak mengajarkan langkah grounding atau menyamakan panduan dukungan trauma tersebut dengan relaksasi tubuh umum.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Belum ada sumber yang dipetakan di halaman ini yang memastikan manfaat grounding sebagai latihan relaksasi umum untuk ibu hamil atau ibu bersalin. Karena itu, materi ini tidak menjanjikan efek tertentu.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Jika Ibu ingin membicarakan pengalaman persalinan yang terasa berat atau kenangan yang mengganggu, sampaikan kepada bidan, dokter, atau tenaga kesehatan yang mendampingi. Pilihan dukungan perlu disesuaikan dengan kebutuhan Ibu.',
            referenceIds: ['S14'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Ibu tidak harus mencoba latihan apa pun. Bila topik ini terasa tidak nyaman, berhenti membaca atau meminta dukungan. Informasi ini tidak menilai kondisi kesehatan mental dan tidak menggantikan pemeriksaan atau arahan tenaga kesehatan.',
      referenceIds: ['S14'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Bagian ini hanya memuat pilihan komunikasi dan dukungan. Materi ini tidak memberikan latihan grounding atau klaim efektivitas klinis.',
      instructions: [
        { text: 'Beri tahu pendamping atau tenaga kesehatan jika Ibu membutuhkan dukungan.', referenceIds: ['S14', 'S22'] },
        { text: 'Minta penjelasan atau jeda bila ada hal yang belum dipahami atau terasa tidak nyaman.', referenceIds: ['S22'] },
        { text: 'Ibu tidak perlu mencoba latihan atau pilihan apa pun yang tidak diinginkan.', referenceIds: ['S14', 'S22'] },
        { text: 'Bicarakan dengan bidan atau dokter bila rasa kewalahan berlanjut atau mengganggu kegiatan sehari-hari.', referenceIds: ['S14'] },
      ],
    },
    audio: {
      status: 'not_applicable',
    },
    referenceIds: ['S14', 'S22'],
    updatedAt: '2026-10-28',
  },
  'pijat-pendamping-persalinan': {
    id: 'T04',
    slug: 'pijat-pendamping-persalinan',
    title: 'Pijat Pendamping',
    categories: ['Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-28' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Sentuhan pendamping saat persalinan hanya menjadi pilihan bila Ibu menginginkannya. Penelitian yang tersedia menilai teknik dan pemberi pijat tertentu; hasilnya tidak memastikan manfaat pijat umum oleh pendamping.',
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
    updatedAt: '2026-10-28',
  },
  'teknik-pernapasan': {
    id: 'T01',
    slug: 'teknik-pernapasan',
    title: 'Teknik Pernapasan',
    categories: ['Hamil', 'Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-28' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Pilihan bernapas saat persalinan berbeda bagi setiap orang. Selama hamil, Ibu dapat menanyakan pilihan dukungan kepada bidan; saat persalinan, sampaikan bila ingin bantuan atau cara yang sedang dicoba terasa tidak nyaman.',
      referenceIds: ['S1', 'S2', 'S5', 'S6', 'S15', 'S32', 'S39'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu teknik pernapasan?',
        paragraphs: [
          {
            text: 'Sebagian panduan dan penelitian membahas pernapasan dalam konteks persalinan. Cara dan hasil yang diteliti tidak sama, sehingga tidak ada satu pola yang perlu diikuti semua Ibu.',
            referenceIds: ['S1', 'S2', 'S6'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Tinjauan penelitian pada kala pertama melaporkan hasil yang beragam dan kepastian bukti yang sangat rendah untuk nyeri. Temuan itu tidak menjamin pengurangan nyeri bagi individu.',
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
            text: 'Jika Ibu ingin membicarakan pilihan bernapas, mintalah bidan menjelaskan pilihan yang tersedia untuk keadaan persalinan saat itu. Panduan ini tidak menetapkan pola atau latihan khusus.',
            referenceIds: ['S1', 'S2', 'S6', 'S15', 'S32'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Jangan memaksakan latihan atau pola napas yang terasa tidak nyaman. Tanyakan kepada bidan atau dokter bila Ibu memiliki pertanyaan atau membutuhkan bantuan. Informasi ini tidak menggantikan arahan tim yang merawat.',
      referenceIds: ['S1', 'S2', 'S6', 'S15', 'S32', 'S39'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Panduan ini berfokus pada komunikasi dengan tenaga kesehatan, bukan resep pola napas atau latihan klinis.',
      instructions: [
        { text: 'Tanyakan kepada bidan pilihan dukungan pernapasan yang tersedia dan sesuai untuk keadaan Ibu.', referenceIds: ['S1', 'S2', 'S5'] },
        { text: 'Saat persalinan, sampaikan bila Ibu ingin bantuan atau penjelasan tentang pilihan yang sedang dibahas.', referenceIds: ['S2', 'S6', 'S15'] },
        { text: 'Jangan merasa harus mengikuti satu pola napas tertentu; sampaikan jika pilihan terasa tidak nyaman.', referenceIds: ['S1', 'S2'] },
      ],
    },
    audio: {
      status: 'available',
      trackId: 'rain',
    },
    referenceIds: ['S1', 'S2', 'S5', 'S6', 'S15', 'S32', 'S39'],
    updatedAt: '2026-10-28',
  },
}

export const therapyArticles: Record<string, TherapyArticle> = Object.fromEntries(
  Object.entries(articleDefinitions).map(([slug, article]) => {
    const figure = therapyArticleFigures[article.id]
    if (!figure) throw new Error(`Missing article figure for ${article.id}`)
    return [slug, { ...article, figure }]
  }),
)
