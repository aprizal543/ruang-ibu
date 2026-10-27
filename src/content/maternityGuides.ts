import heroPregnancyImage from '../../assets/images/hero/pexels-hero-mobile.webp'

export interface GuideParagraph {
  text: string
  sourceIds: string[]
}

export interface GuideLinkItem {
  topicId: string
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
  backComfort: '/images/therapy/back-comfort-thumb.webp',
  warmCompressPregnancy: '/images/therapy/warm-compress-pregnancy-thumb.webp',
  prenatalMassage: '/images/therapy/prenatal-massage-thumb.webp',
  pregnancySupport: '/images/therapy/pregnancy-support-thumb.webp',
  laborSupport: '/images/therapy/labor-support-thumb.webp',
  warmCompressLabor: '/images/therapy/warm-compress-labor-thumb.webp',
  laborCompanion: '/images/therapy/labor-companion-thumb.webp',
  laborTouch: '/images/therapy/labor-touch-thumb.svg',
}

export const maternityGuides: Record<'pregnancy' | 'birth', MaternityGuideContent> = {
  pregnancy: {
    id: 'pregnancy',
    headerTitle: 'Panduan Ibu Hamil',
    heroEyebrow: 'Trimester III',
    heroTitle: 'Mempersiapkan Diri dengan Lebih Tenang',
    heroDescription: 'Selama trimester III, Ibu mungkin merasakan nyeri punggung atau khawatir menjelang persalinan. Kenali berbagai pilihan untuk menjaga kenyamanan, seperti pilihan pernapasan, musik, kompres hangat, dan pijat kehamilan.',
    heroImage: heroPregnancyImage,
    heroImageAlt: 'Ibu hamil duduk dengan tenang sambil memegang perutnya',
    clinicalReview: 'draft',
    sourceReviewedAt: '2026-10-23',
    sourceIds: ['S17', 'S18', 'S19', 'S20', 'S23', 'S24', 'S25', 'S2', 'S6', 'S14', 'S26', 'S27', 'S29', 'S30', 'S31', 'C01', 'C02', 'C03', 'C04', 'C05', 'C06'],
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
        heading: 'Pilih topik yang Ibu butuhkan',
        paragraphs: [
          {
            text: 'Baca tentang nyeri punggung trimester III, kekhawatiran menjelang persalinan, pernapasan, musik, kompres hangat, dan pijat kehamilan. Pilih bacaan yang sesuai dengan pertanyaan Ibu.',
            sourceIds: ['S2', 'S26', 'S30', 'C01', 'C02', 'C03', 'C04', 'C05', 'C06'],
          },
        ],
        relatedItems: [
          {
            topicId: 'A01',
            title: 'Nyeri Punggung saat Kehamilan',
            description: 'Pilihan nyaman saat punggung terasa pegal.',
            href: '/terapi/nyeri-punggung-kehamilan',
            image: therapyImages.backComfort,
            imageAlt: 'Ibu hamil beristirahat miring di tempat tidur',
            sourceIds: ['S26', 'S30', 'C01', 'C02', 'C03', 'C04'],
          },
          {
            topicId: 'A06',
            title: 'Kekhawatiran Menjelang Persalinan',
            description: 'Dukungan saat Ibu merasa khawatir.',
            href: '/terapi/kecemasan-menjelang-persalinan',
            image: therapyImages.pregnancySupport,
            imageAlt: 'Seorang perempuan menemani ibu hamil di rumah',
            sourceIds: ['S5', 'S17', 'C05', 'C06'],
          },
          {
            topicId: 'A03',
            title: 'Teknik Pernapasan',
            description: 'Pilihan napas untuk persiapan persalinan.',
            href: '/terapi/teknik-pernapasan',
            image: therapyImages.breathing,
            imageAlt: 'Ilustrasi ibu hamil sedang menenangkan diri',
            sourceIds: ['S6'],
          },
          {
            topicId: 'A02',
            title: 'Musik untuk Relaksasi',
            description: 'Musik pilihan Ibu untuk menemani kehamilan.',
            href: '/terapi/terapi-musik',
            image: therapyImages.music,
            imageAlt: 'Headphone sebagai ilustrasi pilihan musik',
            sourceIds: ['S2', 'C04', 'C05', 'C06'],
          },
          {
            topicId: 'A04',
            title: 'Kompres Hangat Saat Hamil',
            description: 'Pilihan hangat untuk otot punggung yang pegal.',
            href: '/terapi/kompres-hangat-kehamilan',
            image: therapyImages.warmCompressPregnancy,
            imageAlt: 'Bantalan hangat berlapis kain di atas handuk; bukan petunjuk penggunaan',
            sourceIds: ['C01', 'C02', 'C03', 'S30'],
          },
          {
            topicId: 'A05',
            title: 'Pijat untuk Ibu Hamil',
            description: 'Pijat kehamilan bersama tenaga terlatih.',
            href: '/terapi/pijat-kehamilan',
            image: therapyImages.prenatalMassage,
            imageAlt: 'Suasana pijat profesional untuk ibu hamil; bukan demonstrasi teknik',
            sourceIds: ['S27', 'S31'],
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
    heroDescription: 'Kenali nyeri dan rasa khawatir saat persalinan, serta pilihan pernapasan, musik, dan dukungan pendamping. Pelajari juga pijat pendamping dan kompres hangat yang dibicarakan bersama tim kesehatan.',
    heroImage: therapyImages.massage,
    heroImageAlt: 'Foto ilustrasi sentuhan pada perut ibu, bukan demonstrasi teknik pemijatan',
    clinicalReview: 'draft',
    sourceReviewedAt: '2026-10-23',
    sourceIds: ['S1', 'S2', 'S17', 'S21', 'S22', 'S6', 'S15', 'S20', 'S23', 'S8', 'S29', 'C04', 'C05', 'C06', 'C07', 'C08'],
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
        heading: 'Pilihan dukungan selama persalinan',
        paragraphs: [
          {
            text: 'Materi berikut membahas nyeri dan kekhawatiran selama persalinan, pernapasan, musik, pijat pendamping, serta kompres hangat dalam perawatan. Ibu dapat menyampaikan pilihan kepada tim kesehatan.',
            sourceIds: ['S1', 'S2', 'S8', 'S22', 'C07', 'C08'],
          },
        ],
        relatedItems: [
          {
            topicId: 'B01',
            title: 'Nyeri Persalinan',
            description: 'Pilihan dukungan dan pereda nyeri persalinan.',
            href: '/terapi/nyeri-persalinan',
            image: therapyImages.laborSupport,
            imageAlt: 'Pendamping berada di sisi ibu di ruang perawatan persalinan',
            sourceIds: ['S2', 'S8', 'C07'],
          },
          {
            topicId: 'B06',
            title: 'Kekhawatiran Selama Persalinan',
            description: 'Dukungan dan komunikasi selama persalinan.',
            href: '/terapi/kecemasan-persalinan',
            image: therapyImages.laborCompanion,
            imageAlt: 'Pendamping menggenggam tangan ibu di ruang perawatan kebidanan',
            sourceIds: ['S2', 'S22', 'C07', 'C08'],
          },
          {
            topicId: 'B03',
            title: 'Teknik Pernapasan',
            description: 'Pilihan napas saat menghadapi kontraksi.',
            href: '/terapi/teknik-pernapasan',
            image: therapyImages.breathing,
            imageAlt: 'Ilustrasi ibu hamil sedang menenangkan diri',
            sourceIds: ['S1', 'S2', 'S6'],
          },
          {
            topicId: 'B02',
            title: 'Musik untuk Relaksasi',
            description: 'Musik pilihan Ibu untuk menemani persalinan.',
            href: '/terapi/terapi-musik',
            image: therapyImages.music,
            imageAlt: 'Headphone sebagai ilustrasi pilihan musik',
            sourceIds: ['S2', 'C07', 'C08'],
          },
          {
            topicId: 'B04',
            title: 'Pijat Pendamping',
            description: 'Sentuhan yang dipilih Ibu selama persalinan.',
            href: '/terapi/pijat-pendamping',
            image: therapyImages.laborTouch,
            imageAlt: 'Ilustrasi dua tangan saling menggenggam sebagai dukungan pendamping',
            sourceIds: ['S1', 'S2'],
          },
          {
            topicId: 'B05',
            title: 'Kompres Hangat Saat Persalinan',
            description: 'Perawatan kompres bersama tenaga kesehatan.',
            href: '/terapi/kompres-hangat-persalinan',
            image: therapyImages.warmCompressLabor,
            imageAlt: 'Kain hangat terlipat; bukan petunjuk tindakan persalinan',
            sourceIds: ['S2'],
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
