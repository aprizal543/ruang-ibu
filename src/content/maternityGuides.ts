import heroPregnancyImage from '../../assets/images/hero/pexels-hero-mobile.webp'

export interface GuideParagraph {
  text: string
  sourceIds: string[]
}

export interface GuideLinkItem {
  title: string
  description: string
  href: string
  image?: string
  imageAlt?: string
  sourceIds: string[]
}

export interface MaternityGuideSection {
  id: string
  heading: string
  paragraphs: GuideParagraph[]
  relatedItems?: GuideLinkItem[]
  audioCta?: boolean
  safetyItems?: GuideParagraph[]
  safetyClosing?: GuideParagraph
}

export interface MaternityGuideContent {
  id: 'pregnancy' | 'birth'
  headerTitle: string
  heroEyebrow: string
  heroTitle: string
  heroDescription: string
  heroImage: string
  heroImageAlt: string
  sections: MaternityGuideSection[]
  sourceIds: string[]
  clinicalReview: 'draft'
  sourceReviewedAt: string
}

const therapyImages = {
  breathing: '/images/therapy/breathing.webp',
  music: '/images/therapy/music.webp',
  relaxation: '/images/therapy/relaxation.webp',
  massage: '/images/therapy/partner-massage.webp',
}

export const maternityGuides: Record<'pregnancy' | 'birth', MaternityGuideContent> = {
  pregnancy: {
    id: 'pregnancy',
    headerTitle: 'Panduan Ibu Hamil',
    heroEyebrow: 'Trimester III',
    heroTitle: 'Mempersiapkan Diri dengan Lebih Tenang',
    heroDescription: 'Sedikit persiapan dapat membantu Ibu menyampaikan pilihan dan pertanyaan kepada bidan. Rencana dapat berubah sesuai keadaan saat persalinan.',
    heroImage: heroPregnancyImage,
    heroImageAlt: 'Ibu hamil duduk dengan tenang sambil memegang perutnya',
    clinicalReview: 'draft',
    sourceReviewedAt: '2026-10-23',
    sourceIds: ['S17', 'S18', 'S19', 'S20', 'S23', 'S24', 'S25', 'S2', 'S6', 'S14'],
    sections: [
      {
        id: 'persiapan',
        heading: 'Persiapan menjelang persalinan',
        paragraphs: [
          {
            text: 'Ibu dapat mulai menuliskan hal yang ingin dibicarakan saat kontrol, seperti tempat bersalin yang direncanakan, siapa yang ingin mendampingi, dan pilihan yang penting bagi Ibu. Rencana ini membantu menyampaikan keinginan, tetapi dapat berubah mengikuti kondisi saat persalinan.',
            sourceIds: ['S17'],
          },
          {
            text: 'Menyiapkan catatan kehamilan dan barang penting lebih awal dapat membantu saat waktunya berangkat. Kebutuhan setiap keluarga dan aturan tempat bersalin dapat berbeda, jadi periksa kembali daftar dengan fasilitas yang Ibu pilih.',
            sourceIds: ['S18'],
          },
        ],
      },
      {
        id: 'kenyamanan',
        heading: 'Menjaga kenyamanan selama kehamilan',
        paragraphs: [
          {
            text: 'Kenyamanan dan kebutuhan setiap Ibu berbeda. Bila ada keluhan, kekhawatiran, atau pertanyaan tentang pilihan yang sesuai, ceritakan kepada bidan atau dokter yang memeriksa Ibu. Informasi di halaman ini tidak dapat menilai kondisi kehamilan secara pribadi.',
            sourceIds: ['S19'],
          },
        ],
      },
      {
        id: 'relaksasi',
        heading: 'Mengenal pilihan relaksasi',
        paragraphs: [
          {
            text: 'Pilihan pada artikel berikut memiliki konteks yang berbeda. Membacanya dapat membantu Ibu menyiapkan pertanyaan untuk bidan; tautan ini bukan rekomendasi bahwa semua pilihan sesuai untuk setiap kehamilan.',
            sourceIds: ['S6', 'S2'],
          },
        ],
        relatedItems: [
          {
            title: 'Teknik Pernapasan',
            description: 'Pilihan untuk dibicarakan saat persiapan dan persalinan; bukan latihan yang harus dilakukan semua Ibu.',
            href: '/terapi/teknik-pernapasan',
            image: therapyImages.breathing,
            imageAlt: 'Ilustrasi ibu hamil sedang menenangkan diri',
            sourceIds: ['S6'],
          },
          {
            title: 'Musik untuk Relaksasi',
            description: 'Materi membahas musik pilihan dalam konteks persalinan, bukan manfaat khusus pada trimester III.',
            href: '/terapi/terapi-musik',
            image: therapyImages.music,
            imageAlt: 'Headphone sebagai ilustrasi pilihan musik',
            sourceIds: ['S2'],
          },
          {
            title: 'Relaksasi Tubuh',
            description: 'Pengenalan terbatas tentang rasa nyaman tubuh; bukan latihan dengan langkah yang telah ditetapkan atau tervalidasi.',
            href: '/terapi/relaksasi-otot-ringan',
            image: therapyImages.relaxation,
            imageAlt: 'Ilustrasi umum ibu hamil beristirahat, bukan demonstrasi latihan',
            sourceIds: ['S14'],
          },
        ],
      },
      {
        id: 'audio',
        heading: 'Dengarkan relaksasi',
        paragraphs: [
          {
            text: 'Pilihan suara alam dan musik instrumental tersedia untuk didengarkan jika Ibu menginginkannya. Audio ini tidak berisi panduan kesehatan dan bukan pengganti pendampingan tenaga kesehatan.',
            sourceIds: [],
          },
        ],
        audioCta: true,
      },
      {
        id: 'bantuan',
        heading: 'Kapan perlu meminta bantuan?',
        paragraphs: [
          {
            text: 'Beberapa tanda selama kehamilan memerlukan bantuan kesehatan segera. Hubungi bidan atau fasilitas kesehatan yang merawat Ibu; jangan menunggu jadwal kontrol berikutnya.',
            sourceIds: ['S19', 'S20', 'S23', 'S24', 'S25'],
          },
        ],
        safetyItems: [
          {
            text: 'Gerakan bayi tidak ada, berkurang, atau berubah dari pola biasanya.',
            sourceIds: ['S20', 'S23'],
          },
          {
            text: 'Perdarahan, sakit perut hebat, kejang, sakit kepala berat, gangguan penglihatan yang muncul tiba-tiba, atau pembengkakan mendadak pada wajah maupun tangan.',
            sourceIds: ['S19', 'S23', 'S24', 'S25'],
          },
          {
            text: 'Sesak atau sulit bernapas, serta demam tinggi, perlu segera mendapat perhatian tenaga kesehatan.',
            sourceIds: ['S19', 'S23', 'S24'],
          },
        ],
        safetyClosing: {
          text: 'Kontak dan jalur layanan berbeda di setiap daerah. Simpan nomor bidan dan fasilitas yang merawat Ibu. Jika terasa seperti keadaan darurat yang mengancam nyawa, cari bantuan gawat darurat setempat.',
          sourceIds: ['S19', 'S23', 'S24', 'S25'],
        },
      },
    ],
  },
  birth: {
    id: 'birth',
    headerTitle: 'Panduan Bersalin',
    heroEyebrow: 'Selama persalinan',
    heroTitle: 'Mendampingi Setiap Langkah Persalinan',
    heroDescription: 'Pengalaman persalinan setiap Ibu berbeda. Kenali pilihan dukungan, sampaikan kebutuhan, dan ikuti arahan bidan yang mendampingi.',
    heroImage: therapyImages.massage,
    heroImageAlt: 'Foto ilustrasi sentuhan pada perut ibu, bukan demonstrasi teknik pemijatan',
    clinicalReview: 'draft',
    sourceReviewedAt: '2026-10-23',
    sourceIds: ['S1', 'S2', 'S17', 'S21', 'S22', 'S6', 'S15', 'S20', 'S23'],
    sections: [
      {
        id: 'mengenal-persalinan',
        heading: 'Mengenal persalinan',
        paragraphs: [
          {
            text: 'Persalinan dapat diawali dengan kontraksi atau rasa mengencang, nyeri punggung, keluarnya lendir, rasa ingin buang air besar, atau air ketuban pecah. Tanda yang dirasakan dapat berbeda; tidak semua tanda muncul pada setiap Ibu.',
            sourceIds: ['S21'],
          },
          {
            text: 'Jika Ibu merasa persalinan mulai, atau masih ragu, hubungi bidan atau fasilitas tempat Ibu berencana bersalin untuk mendapat arahan sesuai keadaan dan rencana perawatan Ibu.',
            sourceIds: ['S21'],
          },
        ],
      },
      {
        id: 'pilihan-kenyamanan',
        heading: 'Pilihan kenyamanan saat persalinan',
        paragraphs: [
          {
            text: 'Pernapasan, musik pilihan, dan dukungan sentuhan dapat dibicarakan sebagai pilihan selama persalinan. Ibu tidak harus memilih semuanya. Kesesuaiannya bergantung pada kebutuhan dan keadaan Ibu saat itu.',
            sourceIds: ['S1', 'S2'],
          },
        ],
        relatedItems: [
          {
            title: 'Teknik Pernapasan',
            description: 'Pilihan napas yang dibahas untuk menghadapi kontraksi; manfaatnya tidak dijanjikan.',
            href: '/terapi/teknik-pernapasan',
            image: therapyImages.breathing,
            imageAlt: 'Ilustrasi ibu hamil sedang menenangkan diri',
            sourceIds: ['S1', 'S2', 'S6'],
          },
          {
            title: 'Musik untuk Relaksasi',
            description: 'Ibu dapat mengenal pilihan mendengarkan musik saat persalinan; bukan terapi musik klinis.',
            href: '/terapi/terapi-musik',
            image: therapyImages.music,
            imageAlt: 'Headphone sebagai ilustrasi pilihan musik',
            sourceIds: ['S2'],
          },
          {
            title: 'Pijat Pendamping',
            description: 'Jika Ibu memilih sentuhan, pendamping perlu memahami teknik yang telah diajarkan dan mengikuti kenyamanan Ibu.',
            href: '/terapi/pijat-pendamping',
            image: therapyImages.massage,
            imageAlt: 'Ilustrasi umum sentuhan pendamping, bukan demonstrasi teknik',
            sourceIds: ['S1', 'S2'],
          },
        ],
      },
      {
        id: 'pendamping',
        heading: 'Peran pendamping',
        paragraphs: [
          {
            text: 'Pendamping dapat membantu mengingat pilihan yang sudah dibicarakan, mendengarkan kebutuhan Ibu, dan menyampaikannya kepada bidan bila Ibu menginginkan bantuan. Tanyakan sebelum memberi sentuhan, hormati jawaban Ibu, dan berhenti ketika Ibu meminta.',
            sourceIds: ['S17', 'S22'],
          },
          {
            text: 'Rencana dapat berubah. Pendamping dapat membantu Ibu berbicara dengan bidan atau dokter tentang pilihan yang tersedia saat itu.',
            sourceIds: ['S17', 'S22'],
          },
        ],
      },
      {
        id: 'musik',
        heading: 'Musik dan suasana tenang',
        paragraphs: [
          {
            text: 'Jika Ibu ingin mendengarkan audio, pilih suara atau musik yang disukai dan hentikan kapan saja. Pilihan ini hanya untuk suasana; audio Ruang Ibu tidak memberi instruksi klinis dan tidak menjamin hasil tertentu.',
            sourceIds: ['S2'],
          },
        ],
        audioCta: true,
      },
      {
        id: 'bantuan',
        heading: 'Kapan perlu meminta bantuan?',
        paragraphs: [
          {
            text: 'Jika Ibu merasa persalinan mulai, ada perubahan yang membuat khawatir, atau belum yakin apa yang perlu dilakukan, hubungi bidan atau ruang bersalin yang merawat Ibu untuk mendapat arahan.',
            sourceIds: ['S21'],
          },
        ],
        safetyItems: [
          {
            text: 'Hubungi bidan atau fasilitas bersalin segera jika air ketuban pecah, ada perdarahan, atau gerakan bayi berkurang maupun berubah.',
            sourceIds: ['S20', 'S21', 'S23'],
          },
          {
            text: 'Nyeri perut hebat di antara kontraksi atau sakit kepala berat juga perlu segera disampaikan kepada tenaga kesehatan.',
            sourceIds: ['S23'],
          },
          {
            text: 'Jika usia kehamilan belum 37 minggu dan Ibu merasa persalinan mungkin dimulai, hubungi tenaga kesehatan segera.',
            sourceIds: ['S21'],
          },
          {
            text: 'Jika Ibu merasa bayi akan lahir saat ini atau keadaan mengancam nyawa, minta pendamping mencari bantuan darurat setempat segera.',
            sourceIds: ['S21'],
          },
        ],
        safetyClosing: {
          text: 'Nomor dan alur layanan berbeda di setiap daerah. Gunakan kontak bidan atau fasilitas yang merawat Ibu; halaman ini tidak dapat menentukan apakah persalinan sudah dimulai.',
          sourceIds: ['S21'],
        },
      },
    ],
  },
}
