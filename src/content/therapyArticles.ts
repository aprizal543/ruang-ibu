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
    internalEvidenceNotes: [
      {
        id: 'T02-E01',
        topic: 'Mendengarkan musik pilihan saat persalinan',
        certainty: 'low_to_very_low',
        note: 'NICE menyebut musik pilihan ibu saat persalinan; Cochrane melaporkan bukti musik untuk nyeri persalinan berkepastian rendah atau sangat rendah dan tidak jelas pada fase aktif. Materi ini membahas mendengarkan musik, bukan terapi musik klinis. Tidak ada hasil individual yang dijanjikan.',
        referenceIds: ['S2', 'S3'],
      },
    ],
    updatedAt: '2026-10-23',
    revisionHistory: [
      { revision: '0.5', date: '2026-10-23', note: 'Judul tampilan diselaraskan menjadi Musik untuk Relaksasi; panduan penggunaan audio bersumber ditambahkan dan audio instrumental lokal dihubungkan. Status klinis tetap draft.' },
      {
        revision: '0.4',
        date: '2026-10-23',
        note: 'Pengantar diperjelas sebagai kesenjangan sumber tentang manfaat dan kesesuaian, bukan klaim bahwa pendekatan tidak sesuai bagi sebagian ibu. Tetap draft dan tanpa panduan praktik.',
      },
      {
        revision: '0.3',
        date: '2026-10-23',
        note: 'Menambahkan rujukan NCCIH untuk membedakan mendengarkan musik dari layanan terapi musik profesional. Tidak menambah klaim kehamilan atau audio; tetap draft.',
      },
      {
        revision: '0.2',
        date: '2026-10-23',
        note: 'Copy membedakan mendengarkan musik pilihan dari layanan terapi musik klinis; manfaat tetap tidak dijanjikan. Semua perubahan menunggu telaah klinis.',
      },
      {
        revision: '0.1',
        date: '2026-10-22',
        note: 'Artikel edukasi diringkas dari T02 draf v0.2. Arahan penggunaan audio tidak ditampilkan; menunggu telaah klinis.',
      },
    ],
    editorialSource: 'reference/MATERI-DRAF-v0.2.md — Artikel T02 (draf, belum divalidasi klinis)',
  },
  'relaksasi-otot-ringan': {
    id: 'T03',
    slug: 'relaksasi-otot-ringan',
    title: 'Relaksasi Tubuh',
    categories: ['Relaksasi'],
    sourceReview: { status: 'draft' },
    clinicalReview: { status: 'draft' },
    introduction: {
      text: 'Sumber ini membahas perhatian pada tubuh sebagai salah satu pilihan ketika pengalaman kehamilan atau persalinan terasa berat secara emosional. Cara ini tidak selalu sesuai atau terasa nyaman bagi setiap Ibu.',
      referenceIds: ['S14'],
    },
    sections: [
      {
        id: 'pengertian',
        heading: 'Apa itu relaksasi tubuh?',
        paragraphs: [
          {
            text: 'Relaksasi tubuh di sini berarti memperhatikan rasa nyaman dan ketegangan tubuh dengan lembut. Ini bukan teknik relaksasi otot progresif dan bukan pengganti bantuan profesional.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'tujuan',
        heading: 'Apa tujuannya?',
        paragraphs: [
          {
            text: 'Tujuannya memberi ruang bagi Ibu untuk mengenali apa yang terasa nyaman atau tidak nyaman pada tubuh. Pengalaman setiap orang berbeda; hasil tertentu tidak dapat dijanjikan.',
            referenceIds: ['S14'],
          },
        ],
      },
      {
        id: 'kapan-dipertimbangkan',
        heading: 'Kapan dapat dipertimbangkan?',
        paragraphs: [
          {
            text: 'Sumber yang digunakan membahas kesadaran tubuh dan rasa nyaman dalam konteks pengalaman kehamilan atau persalinan yang terasa berat. Informasi tersebut tidak berarti cara yang sama sesuai bagi semua Ibu.',
            referenceIds: ['S14'],
          },
        ],
      },
    ],
    safetyNotice: {
      text: 'Jangan memaksakan hal yang terasa tidak nyaman. Jika memperhatikan tubuh menimbulkan rasa tidak nyaman atau perasaan berat, berhenti dan bicarakan dengan bidan atau tenaga kesehatan yang mendampingi. Informasi ini tidak menggantikan pemeriksaan atau arahan mereka.',
      referenceIds: ['S14'],
    },
    practiceGuide: {
      status: 'source_based',
      note: 'Pilihan ini bersifat sukarela. Tidak perlu melakukan gerakan atau melanjutkan jika terasa tidak nyaman.',
      instructions: [
        { text: 'Jika terasa nyaman, Ibu dapat duduk atau berdiri dengan kedua kaki menapak di lantai. Ibu tidak perlu memaksakan posisi tertentu.', referenceIds: ['S14'] },
        { text: 'Ibu dapat merasakan dukungan di bawah kaki. Meletakkan tangan di dada atau perut hanya pilihan jika terasa menenangkan.', referenceIds: ['S14'] },
        { text: 'Berhenti jika perhatian pada tubuh membuat Ibu merasa tidak nyaman. Sampaikan kepada bidan atau tenaga kesehatan yang mendampingi bila Ibu membutuhkan dukungan.', referenceIds: ['S14'] },
      ],
    },
    audio: {
      status: 'not_applicable',
    },
    referenceIds: ['S14'],
    internalEvidenceNotes: [
      {
        id: 'T03-E01',
        topic: 'Relaksasi otot progresif saat persalinan',
        certainty: 'low_to_very_low',
        note: 'WHO menyebut PMR sebagai pilihan relaksasi bagi ibu hamil sehat yang meminta dukungan nyeri saat persalinan. Draf membedakan pendekatan ringan/body scan dari protokol PMR; sumber tersebut tidak memastikan manfaat atau kesesuaian varian ringan ini. Cochrane menilai bukti kelompok relaksasi rendah hingga sangat rendah.',
        referenceIds: ['S1', 'S3'],
      },
      {
        id: 'T03-E02',
        topic: 'Kesadaran tubuh dan grounding dalam pengalaman kehamilan/persalinan yang berat secara emosional',
        certainty: 'not_rated',
        note: 'Healthier Together menjelaskan beberapa pilihan grounding dan perhatian pada kenyamanan tubuh dalam konteks pengalaman trauma/tekanan terkait kehamilan atau persalinan. Ini tidak menetapkan terapi relaksasi universal, tidak membuktikan manfaat untuk semua kondisi, dan tidak menyamakannya dengan PMR. Direct page fetch returned 403; indexed page text was reviewed. Scope remains draft pending content/clinical review.',
        referenceIds: ['S14'],
      },
    ],
    updatedAt: '2026-10-23',
    revisionHistory: [
      { revision: '0.4', date: '2026-10-23', note: 'Judul tampilan diperjelas menjadi Relaksasi Tubuh. Ditambahkan informasi dan pilihan grounding tubuh sukarela yang dibatasi pada konteks Healthier Together; tidak disamakan dengan PMR. Tetap draft.' },
      {
        revision: '0.3',
        date: '2026-10-23',
        note: 'Memperjelas bahwa definisi pendekatan ringan belum cukup didukung sumber dan menambahkan CONTENT DEFINITION BLOCKER dalam evidence notes. Tidak ada instruksi praktik; status tetap draft.',
      },
      {
        revision: '0.2',
        date: '2026-10-23',
        note: 'Copy membedakan pendekatan pelepasan ketegangan ringan/body scan dari PMR dan menyatakan batas penerapan sumber. Tidak ada instruksi praktik; redaksi menunggu telaah klinis.',
      },
      {
        revision: '0.1',
        date: '2026-10-22',
        note: 'Artikel konseptual diringkas dari T03 draf v0.2. Semua instruksi gerakan, posisi, durasi, dan intensitas dikecualikan; menunggu telaah klinis.',
      },
    ],
    editorialSource: 'reference/MATERI-DRAF-v0.2.md — Artikel T03 (draf, belum divalidasi klinis)',
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
    internalEvidenceNotes: [
      {
        id: 'T04-E01',
        topic: 'Pijat saat persalinan',
        certainty: 'low_to_very_low',
        note: 'Tinjauan Cochrane melaporkan kepastian bukti manfaat pijat beragam dari rendah hingga sangat rendah; sedikit uji melaporkan keselamatan. Tidak ada klaim manfaat atau keamanan individual yang dipublikasikan.',
        referenceIds: ['S4'],
      },
      {
        id: 'T04-E02',
        topic: 'Pilihan dan persetujuan',
        certainty: 'not_rated',
        note: 'WHO dan NICE menempatkan pilihan ibu sebagai konteks penting. Instruksi pijat tidak ditampilkan; rincian kecocokan dan kontraindikasi menunggu telaah klinis.',
        referenceIds: ['S1', 'S2'],
      },
    ],
    updatedAt: '2026-10-23',
    revisionHistory: [
      { revision: '0.4', date: '2026-10-23', note: 'Panduan komunikasi ditambahkan: preferensi, persetujuan, kenyamanan, teknik yang telah diajarkan, bidan, dan hak menghentikan sentuhan. Tidak menambah prosedur pijat. Tetap draft klinis.' },
      {
        revision: '0.3',
        date: '2026-10-23',
        note: 'Memperjelas syarat bahwa pendamping terlebih dahulu diajari teknik yang akan digunakan; tidak menambahkan langkah pijat. Tetap draft.',
      },
      {
        revision: '0.2',
        date: '2026-10-23',
        note: 'Copy menyederhanakan penjelasan pilihan pijat, persetujuan, pendamping yang memahami teknik, dan konsultasi bidan tanpa menyebut institusi di narasi. Semua redaksi menunggu telaah klinis.',
      },
      {
        revision: '0.1',
        date: '2026-10-22',
        note: 'Artikel edukasi diringkas dari T04 draf v0.2. Semua lokasi, tekanan, durasi, dan teknik pijat dikecualikan; menunggu telaah klinis.',
      },
    ],
    editorialSource: 'reference/MATERI-DRAF-v0.2.md — Artikel T04 (draf, belum divalidasi klinis)',
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
    updatedAt: '2026-10-23',
    revisionHistory: [
      { revision: '0.8', date: '2026-10-23', note: 'Panduan ringkas dipetakan ke HDFT/NHS; konteks persiapan kehamilan dan persalinan dipisahkan. Safety notice dilengkapi sumber; audio hujan ditambahkan sebagai audio suasana non-klinis. Status klinis tetap draft.' },
      {
        revision: '0.7',
        date: '2026-10-23',
        note: 'Konteks kehamilan dipisahkan dari persalinan dan redaksinya dibatasi pada sumber NHS tentang kecemasan saat hamil; kategori detail tidak lagi menyebut trimester III.',
      },
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
