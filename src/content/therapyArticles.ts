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
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-29' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Musik yang Ibu sukai dapat menjadi teman saat ingin beristirahat atau merasa lebih tenang selama hamil dan persalinan. Jika terasa mengganggu, Ibu dapat mengganti pilihan atau berhenti mendengarkan.',
      referenceIds: ['S2', 'S40', 'S41', 'S44', 'C04', 'C05', 'C06', 'C07', 'C08'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu musik untuk relaksasi?',
        paragraphs: [
          {
            text: 'Ibu dapat memilih musik untuk menemani waktu istirahat atau perjalanan ke tempat bersalin. Mendengarkan rekaman yang disukai merupakan pilihan pribadi; ini berbeda dari terapi musik profesional yang melibatkan tenaga terlatih dan tujuan perawatan tertentu.',
            referenceIds: ['S13', 'S41', 'C05', 'C06', 'C07', 'C08'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Tinjauan musik selama kehamilan merangkum program penelitian yang berbeda-beda, sedangkan tinjauan nyeri punggung menggabungkan musik dengan relaksasi sebagai salah satu pilihan. Kedua tinjauan itu tidak menguji audio Ruang Ibu atau memastikan hasil yang sama untuk setiap Ibu.',
            referenceIds: ['S41', 'C04'],
          },
          {
            text: 'Beberapa penelitian menggunakan sesi musik terstruktur, misalnya saat pemeriksaan tertentu atau bersama edukasi kesehatan. Program tersebut memiliki peserta dan pengaturan khusus, sehingga hasilnya tidak dapat langsung dianggap berlaku untuk playlist biasa.',
            referenceIds: ['S41', 'C05', 'C06'],
          },
          {
            text: 'Tinjauan musik saat persalinan melaporkan kemungkinan perubahan intensitas nyeri, tetapi hasil penelitian berbeda-beda dan tidak menunjukkan perubahan durasi persalinan. Tinjauan lain pada ibu yang pertama kali melahirkan mendapatkan hasil kecemasan yang belum jelas. Temuan ini bukan janji manfaat dari playlist Ruang Ibu.',
            referenceIds: ['S44', 'C07'],
          },
          {
            text: 'Musik juga tidak harus menjadi pilihan Ibu. Sebagian orang lebih menyukai suasana tenang atau ingin mendengar percakapan di sekitarnya. Jika mendengarkan, Ibu dapat memilih sendiri dan mengubah keputusan kapan saja.',
            referenceIds: ['S2'],
          },
          {
            text: 'Pilihan musik tidak perlu mengikuti selera orang lain. Ibu dapat memilih lagu yang akrab, suara alam, atau tidak menggunakan audio sama sekali; yang penting, Ibu tetap dapat berkomunikasi dengan pendamping dan tenaga kesehatan.',
            referenceIds: ['S2'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Jika Ibu ingin mendengarkan musik, pilih lagu yang terasa nyaman, atau tidak mendengarkan sama sekali. Saat persalinan, musik sebaiknya tidak menghalangi Ibu mendengar penjelasan atau meminta bantuan dari tim yang mendampingi.',
            referenceIds: ['S2'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Hentikan atau ganti musik bila terasa tidak nyaman atau mengganggu komunikasi. Ibu bebas memilih untuk tidak mendengarkan. Audio Ruang Ibu adalah pilihan dengar, bukan program terapi musik penelitian atau pengganti dukungan dan perawatan tenaga kesehatan.',
      referenceIds: ['S2', 'S41', 'S44', 'C04', 'C05', 'C06', 'C07', 'C08'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Musik boleh menjadi teman suasana, tetapi audio ini tidak menjanjikan perubahan nyeri, kecemasan, atau hasil persalinan.',
      instructions: [
        { text: 'Pilih audio yang Ibu sukai selama hamil atau bersalin, atau lewati jika tidak ingin mendengarkan.', referenceIds: ['S2'] },
        { text: 'Atur suara agar Ibu tetap dapat mendengar orang di sekitar dan penjelasan tim kesehatan.', referenceIds: ['S2'] },
        { text: 'Jeda, ganti, atau hentikan audio kapan saja bila tidak nyaman atau ingin berbicara.', referenceIds: ['S2'] },
        { text: 'Beri tahu pendamping atau bidan jika musik mengganggu atau Ibu ingin mengganti pilihan.', referenceIds: ['S2'] },
      ],
    },
    audio: {
      status: 'available',
      trackId: 'ambient',
    },
    referenceIds: ['S2', 'S13', 'S40', 'S41', 'S44', 'C04', 'C05', 'C06', 'C07', 'C08'],
    updatedAt: '2026-10-29',
  },
  'relaksasi-otot-ringan': {
    id: 'T03',
    slug: 'relaksasi-otot-ringan',
    title: 'Relaksasi Tubuh',
    categories: ['Relaksasi'],
    sourceReview: { status: 'draft' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Bila pikiran terasa penuh, Ibu boleh mengambil jeda dan meminta dukungan dari orang yang dipercaya atau tenaga kesehatan. Halaman ini memberi informasi umum tentang dukungan; bukan latihan terapi atau cara yang terbukti mengatasi kecemasan.',
      referenceIds: ['S14', 'S22'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu relaksasi tubuh?',
        paragraphs: [
          {
            text: 'Relaksasi dapat berarti hal yang berbeda bagi setiap orang. Jika Ibu merasa kewalahan, Ibu tidak harus memaksakan latihan tertentu; meminta ditemani atau berbicara dengan bidan adalah pilihan yang dapat dibicarakan.',
            referenceIds: ['S14', 'S22'],
          },
          {
            text: 'Ibu dapat memilih untuk tidak melakukan latihan apa pun. Tidak ada satu pilihan sederhana yang perlu menggantikan bantuan profesional bila Ibu membutuhkan dukungan lebih lanjut.',
            referenceIds: ['S5', 'S14'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Sumber yang kami periksa tidak mendukung klaim bahwa grounding atau relaksasi singkat versi umum ini mengurangi kecemasan pada semua ibu hamil. Karena itu, Ruang Ibu tidak menjanjikan manfaat klinis dari pilihan tersebut.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Halaman ini tidak mengajarkan metode grounding, meditasi, atau latihan tubuh. Bila rasa khawatir menetap, mengganggu kegiatan sehari-hari, atau terasa tidak tertahankan, sampaikan kepada bidan atau dokter agar Ibu mendapat bantuan yang sesuai.',
            referenceIds: ['S5', 'S14'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Ibu tidak harus mencoba latihan relaksasi apa pun. Jika pembahasan ini terasa tidak nyaman, hentikan dan sampaikan kepada orang yang dipercaya atau tenaga kesehatan. Informasi ini tidak menggantikan pemeriksaan, konseling, atau arahan klinis.',
      referenceIds: ['S5', 'S14', 'S22'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Materi ini berfokus pada pilihan komunikasi dan dukungan; tidak ada teknik relaksasi atau manfaat klinis yang dijanjikan.',
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
    referenceIds: ['S5', 'S14', 'S22'],
    updatedAt: '2026-10-29',
  },
  'pijat-pendamping-persalinan': {
    id: 'T04',
    slug: 'pijat-pendamping-persalinan',
    title: 'Pijat Pendamping',
    categories: ['Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-29' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Pijat pendamping dapat menjadi salah satu pilihan sentuhan saat persalinan, jika Ibu menginginkannya. Manfaatnya belum dapat dipastikan dan bisa berbeda pada setiap Ibu.',
      referenceIds: ['S2', 'S8', 'S33', 'S34'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu pijat pendamping?',
        paragraphs: [
          {
            text: 'Pijat pendamping adalah pijat yang diberikan oleh pendamping saat persalinan jika Ibu menginginkannya. Ibu berhak menolak atau meminta sentuhan dihentikan kapan saja.',
            referenceIds: ['S2'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Penelitian terbaru menguji pijat sakral atau shiatsu dengan protokol tertentu, termasuk layanan oleh bidan terlatih. Hasilnya tidak otomatis berlaku untuk semua bentuk pijat atau untuk pendamping yang belum mendapat pelatihan. Persetujuan Ibu tetap menjadi dasar setiap sentuhan.',
            referenceIds: ['S33', 'S34'],
          },
          {
            text: 'Dukungan pendamping tidak harus berupa pijat. Kehadiran, mendengarkan, atau membantu menyampaikan kebutuhan kepada bidan juga dapat menjadi pilihan bila itu yang Ibu inginkan.',
            referenceIds: ['S2', 'S22'],
          },
          {
            text: 'Sebelum menyentuh, pendamping perlu bertanya dan menghormati jawaban Ibu. Persetujuan dapat berubah; Ibu boleh meminta sentuhan dihentikan tanpa harus menjelaskan alasannya.',
            referenceIds: ['S2', 'S22'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Pedoman menyebut bahwa pilihan pijat yang telah diajarkan kepada pendamping dapat didukung bila Ibu memilihnya. Sebelum menggunakan pilihan ini, bicarakan dengan tim persalinan dan ikuti pelatihan yang diberikan; artikel ini tidak mengajarkan tekniknya.',
            referenceIds: ['S2'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Persetujuan dan kenyamanan Ibu harus dihormati. Ibu dapat memilih tidak dipijat atau meminta sentuhan dihentikan kapan saja. Halaman ini tidak memberi arahan tentang lokasi, tekanan, durasi, atau teknik pijat, dan tidak dapat memastikan bentuk pijat yang sesuai untuk kondisi Ibu. Informasi ini tidak menggantikan arahan bidan atau dokter.',
      referenceIds: ['S2', 'S33', 'S34'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Panduan ini hanya tentang komunikasi dan pilihan Ibu. Tidak berisi teknik pijat.',
      instructions: [
        { text: 'Sampaikan kepada pendamping bila Ibu ingin atau tidak ingin sentuhan saat persalinan.', referenceIds: ['S2'] },
        { text: 'Pastikan Ibu setuju sebelum sentuhan diberikan. Ibu boleh menolak atau meminta sentuhan dihentikan kapan saja.', referenceIds: ['S2'] },
        { text: 'Beri tahu pendamping apa yang terasa nyaman atau tidak nyaman.', referenceIds: ['S2'] },
        { text: 'Jika Ibu memilih pijat, pastikan pendamping hanya menggunakan teknik yang sudah diajarkan kepadanya.', referenceIds: ['S2'] },
        { text: 'Bicarakan pilihan ini dengan bidan. Minta bantuan bila ada hal yang membuat Ibu ragu atau tidak nyaman.', referenceIds: ['S2'] },
      ],
    },
    audio: {
      status: 'not_applicable',
    },
    referenceIds: ['S2', 'S8', 'S33', 'S34'],
    updatedAt: '2026-10-29',
  },
  'teknik-pernapasan': {
    id: 'T01',
    slug: 'teknik-pernapasan',
    title: 'Teknik Pernapasan',
    categories: ['Hamil', 'Saat persalinan'],
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-29' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Saat hamil, Ibu dapat menyiapkan pertanyaan tentang pernapasan untuk dibicarakan dengan bidan. Saat persalinan, pilihan latihan napas bersifat sukarela dan tidak ada satu pola yang harus diikuti semua orang.',
      referenceIds: ['S2', 'S5', 'S15', 'S32', 'S39'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu teknik pernapasan?',
        paragraphs: [
          {
            text: 'Saat persalinan, ada Ibu yang memilih memperhatikan napas sebagai salah satu cara menghadapi kontraksi. Pedoman menyebut pilihan latihan napas dan relaksasi dapat didukung jika Ibu menginginkannya; tidak ada satu pola yang wajib diikuti semua orang.',
            referenceIds: ['S2', 'S32'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Tinjauan latihan napas saat kala pertama merangkum beberapa protokol penelitian yang berbeda. Kepastian hasil untuk nyeri sangat rendah dan studi memiliki perbedaan besar, sehingga temuan itu tidak membuktikan bahwa satu teknik tertentu pasti membantu setiap Ibu.',
            referenceIds: ['S32'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan teknik ini dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Satu uji kecil meneliti latihan kesadaran napas terstruktur yang dimulai pada trimester kedua dan diikuti selama beberapa minggu. Hasilnya tidak menguji latihan baru pada trimester ketiga atau menentukan latihan untuk kondisi Ibu, jadi bicarakan pertanyaan pribadi dengan bidan.',
            referenceIds: ['S39'],
          },
          {
            text: 'Saat persalinan, Ibu boleh meminta penjelasan atau dukungan untuk mencoba pilihan yang terasa nyaman. Bila suatu cara membuat pusing, sesak, atau tidak nyaman, hentikan dan beri tahu bidan; artikel ini tidak memberi pola napas atau latihan mengejan.',
            referenceIds: ['S2', 'S15', 'S32'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Pilihan bernapas ini bukan latihan mengejan atau menahan napas. Jangan memaksakan cara yang terasa tidak nyaman. Tanyakan kepada bidan atau dokter bila Ibu memiliki pertanyaan atau membutuhkan bantuan.',
      referenceIds: ['S2', 'S15', 'S32', 'S39'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Pilihan bernapas bersifat sukarela. Bukti tidak menetapkan satu pola yang pasti sesuai untuk semua orang.',
      instructions: [
        { text: 'Saat hamil, tuliskan pertanyaan tentang persiapan pernapasan untuk dibicarakan dengan bidan.', referenceIds: ['S39'] },
        { text: 'Saat persalinan, pilih cara bernapas hanya bila terasa nyaman dan sesuai dengan arahan tim yang mendampingi.', referenceIds: ['S2', 'S32'] },
        { text: 'Ibu tidak perlu mengikuti pola tertentu atau menahan napas berdasarkan panduan website.', referenceIds: ['S2', 'S32'] },
        { text: 'Hentikan pilihan yang terasa tidak nyaman dan minta bantuan bidan bila Ibu membutuhkan dukungan.', referenceIds: ['S2', 'S15'] },
      ],
    },
    audio: {
      status: 'available',
      trackId: 'rain',
    },
    referenceIds: ['S2', 'S5', 'S15', 'S32', 'S39'],
    updatedAt: '2026-10-29',
  },
}

export const therapyArticles: Record<string, TherapyArticle> = Object.fromEntries(
  Object.entries(articleDefinitions).map(([slug, article]) => {
    const figure = therapyArticleFigures[article.id]
    if (!figure) throw new Error(`Missing article figure for ${article.id}`)
    return [slug, { ...article, figure }]
  }),
)
