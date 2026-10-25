import type { TherapyArticle } from './therapyContent.types'

function customerArticle(
  id: string,
  slug: string,
  title: string,
  categories: string[],
  introduction: string,
  introductionRefs: string[],
  sections: TherapyArticle['sections'],
  safety: string,
  safetyRefs: string[],
  referenceIds: string[],
  practiceGuide: TherapyArticle['practiceGuide'] = {
    status: 'locked_pending_review',
    message: 'Untuk keamanan Ibu, bicarakan pilihan ini dengan bidan atau dokter yang mendampingi. Ibu tidak perlu mencoba bila ragu atau merasa tidak nyaman.',
  },
): TherapyArticle {
  return {
    id,
    slug,
    title,
    categories,
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-25' },
    clinicalReview: { status: 'draft' },
    introduction: { text: introduction, referenceIds: introductionRefs },
    sections,
    safetyNotice: { text: safety, referenceIds: safetyRefs },
    practiceGuide,
    audio: { status: 'not_applicable' },
    referenceIds,
    updatedAt: '2026-10-25',
  }
}

export const customerRevisionArticles: Record<string, TherapyArticle> = {
  'nyeri-punggung-kehamilan': customerArticle(
    'A01', 'nyeri-punggung-kehamilan', 'Nyeri Punggung saat Kehamilan', ['Hamil'],
    'Nyeri punggung dapat muncul selama kehamilan, termasuk trimester III. Keluhan ini tidak selalu memiliki penyebab yang sama, jadi nyeri yang berat atau disertai gejala lain perlu dibicarakan dengan tenaga kesehatan.',
    ['S26', 'C01', 'C02', 'C03', 'C04'],
    [
      { id: 'pengertian', heading: 'Apa itu nyeri punggung saat kehamilan?', paragraphs: [
        { text: 'Ini adalah rasa pegal atau nyeri di punggung yang dialami saat hamil. Keluhan otot dan sendi dapat berhubungan dengan perubahan postur serta beban tubuh yang bertambah, tetapi nyeri punggung juga dapat memiliki penyebab lain.', referenceIds: ['S26', 'C02'] },
        { text: 'Kompres hangat pernah dipelajari pada ibu hamil dengan nyeri punggung trimester III di Pekanbaru. Pesertanya terbatas, sehingga hasilnya belum tentu sama pada setiap Ibu dan tidak menjelaskan semua penyebab nyeri punggung.', referenceIds: ['C01', 'C02', 'C03'] },
      ] },
      { id: 'tujuan', heading: 'Pilihan untuk merasa lebih nyaman', paragraphs: [
        { text: 'Ibu dapat bertanya tentang pilihan untuk membantu kenyamanan, seperti dukungan postur, istirahat, atau sumber hangat pada otot punggung yang pegal. Tinjauan beberapa pilihan tanpa obat menemukan hasil yang beragam; tidak ada satu cara yang cocok untuk semua Ibu.', referenceIds: ['S26', 'S30', 'C04'] },
        { text: 'Kompres hangat dan kompres air jahe pernah dibahas dalam kelompok kecil atau satu kasus. Hasil awal ini belum memastikan manfaat yang sama bagi setiap Ibu.', referenceIds: ['C01', 'C02', 'C03'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan meminta bantuan?', paragraphs: [
        { text: 'Hubungi bidan atau dokter bila nyeri terasa sangat berat, menetap, membuat Ibu khawatir, atau Ibu ingin mengetahui pilihan penanganan yang sesuai. Nyeri punggung pada trimester kedua atau ketiga dapat berkaitan dengan persalinan lebih awal.', referenceIds: ['S26'] },
        { text: 'Segera cari arahan kesehatan jika nyeri disertai demam, perdarahan, nyeri saat buang air kecil, nyeri di sisi tubuh, atau kebas pada tungkai maupun area sekitar bokong dan kemaluan.', referenceIds: ['S26'] },
      ] },
    ],
    'Jangan menganggap semua nyeri punggung sebagai keluhan biasa. Halaman ini tidak dapat menentukan penyebab nyeri atau menggantikan pemeriksaan.',
    ['S26', 'S30', 'C01', 'C02', 'C03', 'C04'],
    ['S26', 'C01', 'C02', 'C03', 'C04'],
    { status: 'source_based', note: 'Pilihan ini merupakan pengenalan umum; tenaga kesehatan dapat membantu menilai keluhan dan pilihan yang sesuai.', instructions: [
      { text: 'Ceritakan lokasi, kapan nyeri muncul, dan apakah ada keluhan lain kepada bidan atau dokter.', referenceIds: ['S26'] },
      { text: 'Tanyakan pilihan untuk membantu kenyamanan sebelum mencoba terapi atau alat panas.', referenceIds: ['S26', 'C01'] },
      { text: 'Minta bantuan segera bila nyeri berat atau disertai tanda yang disebutkan pada bagian keselamatan.', referenceIds: ['S26'] },
    ] },
  ),

  'kompres-hangat-kehamilan': {
    ...customerArticle(
      'A04', 'kompres-hangat-kehamilan', 'Kompres Hangat Saat Hamil', ['Hamil'],
      'Kompres hangat merupakan salah satu cara yang dapat dipertimbangkan untuk membantu meredakan rasa tidak nyaman pada punggung selama kehamilan. Beberapa penelitian melaporkan penurunan nyeri setelah penggunaan kompres hangat, tetapi hasilnya dapat berbeda pada setiap Ibu. Penggunaannya perlu dilakukan dengan aman.',
      ['C01', 'C02', 'C03', 'S30'],
      [
        { id: 'pengertian', heading: 'Apa itu kompres hangat?', paragraphs: [
        { text: 'Kompres hangat menggunakan bantalan pemanas atau botol berisi air hangat untuk membantu menenangkan otot punggung yang pegal. Ibu dapat menanyakan pilihan ini kepada bidan atau dokter yang mengetahui kondisi kehamilan Ibu.', referenceIds: ['S30'] },
        ] },
        { id: 'tujuan', heading: 'Apa tujuannya?', paragraphs: [
          { text: 'Beberapa kajian melaporkan nyeri punggung terasa berkurang setelah kompres hangat digunakan. Namun, jumlah peserta terbatas dan sebagian tulisan hanya membahas satu kasus. Hasilnya dapat berbeda pada setiap Ibu.', referenceIds: ['C01', 'C02', 'C03'] },
        ] },
        { id: 'kapan-dipertimbangkan', heading: 'Kapan dapat dipertimbangkan?', paragraphs: [
          { text: 'Jika punggung terasa pegal, Ibu dapat bertanya kepada bidan atau dokter apakah kompres hangat sesuai untuk kondisi Ibu. Jangan gunakan kompres untuk menunda pemeriksaan bila nyeri terasa berat atau membuat Ibu khawatir.', referenceIds: ['S26', 'S30'] },
          { text: 'Panas berlebih dapat melukai kulit. Atur bantalan pemanas pada setelan terendah dan lapisi bantalan atau botol air hangat dengan handuk. Batasi lama penggunaan dan hentikan bila terasa terlalu panas atau tidak nyaman.', referenceIds: ['S30'] },
        ] },
      ],
      'Jangan menempelkan sumber panas langsung pada kulit. Jika nyeri punggung terasa berat, berlangsung lama, atau membuat Ibu khawatir, hubungi bidan atau dokter.',
      ['S26', 'S30'],
      ['C01', 'C02', 'C03', 'S26', 'S30'],
      { status: 'source_based', note: 'Berikut beberapa hal yang dapat Ibu perhatikan saat menggunakan sumber hangat untuk membantu meredakan pegal pada otot punggung.', instructions: [
        { text: 'Gunakan sumber hangat pada otot punggung yang terasa pegal.', referenceIds: ['S30'] },
        { text: 'Jika memakai bantalan pemanas, pilih pengaturan panas paling rendah.', referenceIds: ['S30'] },
        { text: 'Lapisi bantalan pemanas atau botol air hangat dengan handuk agar tidak langsung menyentuh kulit.', referenceIds: ['S30'] },
        { text: 'Batasi lama pemakaian. Jangan gunakan terlalu lama.', referenceIds: ['S30'] },
        { text: 'Hentikan jika terasa terlalu panas atau tidak nyaman. Hubungi bidan atau dokter bila nyeri berat, tidak membaik, atau disertai keluhan yang mengkhawatirkan.', referenceIds: ['S26', 'S30'] },
      ] },
    ),
    summaryHeading: 'Mengenal Kompres Hangat',
  },

  'pijat-kehamilan': customerArticle(
    'A05', 'pijat-kehamilan', 'Pijat untuk Ibu Hamil', ['Hamil', 'Relaksasi'],
    'Pijat kehamilan adalah pijat yang disesuaikan untuk seseorang yang sedang hamil. Pijat dapat dipertimbangkan sebagai pilihan kenyamanan, tetapi jenis pijat dan kecocokannya perlu dibicarakan dengan tenaga yang memahami kebutuhan kehamilan.',
    ['S27', 'S28'],
    [
      { id: 'pengertian', heading: 'Apa itu pijat kehamilan?', paragraphs: [
        { text: 'Pijat kehamilan dilakukan oleh terapis yang memiliki pelatihan untuk bekerja dengan ibu hamil. Ini berbeda dari pijat pendamping selama persalinan, yang membahas sentuhan pilihan Ibu pada saat kontraksi.', referenceIds: ['S27', 'S28'] },
      ] },
      { id: 'tujuan', heading: 'Apa tujuannya?', paragraphs: [
        { text: 'Sebagian orang memilih pijat agar merasa lebih rileks atau nyaman. Bukti tentang manfaat pijat saat hamil masih beragam, sehingga hasilnya belum dapat dipastikan untuk setiap Ibu.', referenceIds: ['S28'] },
        { text: 'Pilih penyedia yang terlatih menangani pijat kehamilan dan sampaikan bahwa Ibu sedang hamil. Ibu berhak menyetujui, menolak, atau meminta pijat dihentikan kapan saja.', referenceIds: ['S27', 'S28'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan berkonsultasi lebih dahulu?', paragraphs: [
        { text: 'Jika kehamilan Ibu memiliki komplikasi atau dinilai berisiko tinggi, tanyakan kepada bidan atau dokter apakah pijat sesuai untuk kondisi Ibu. Sampaikan riwayat kehamilan sebelum membuat janji.', referenceIds: ['S27', 'S28'] },
        { text: 'Bicarakan pilihan pijat dengan terapis yang terlatih menangani kehamilan. Hentikan dan beri tahu terapis bila sentuhan terasa nyeri atau tidak nyaman.', referenceIds: ['S27', 'S28'] },
      ] },
    ],
    'Jangan menerima pijat yang tidak diinginkan atau terasa menyakitkan. Jika Ibu ragu tentang kondisi kehamilan, mintalah saran bidan atau dokter terlebih dahulu.',
    ['S27', 'S28'],
    ['S27', 'S28'],
  ),

  'kecemasan-menjelang-persalinan': customerArticle(
    'A06', 'kecemasan-menjelang-persalinan', 'Kekhawatiran Menjelang Persalinan', ['Hamil', 'Relaksasi'],
    'Rasa khawatir menjelang persalinan bisa dialami siapa saja. Merasa khawatir saja tidak berarti Ibu mengalami gangguan kesehatan mental. Ibu boleh meminta dukungan kapan pun membutuhkannya.',
    ['S5', 'C05', 'C06'],
    [
      { id: 'pengertian', heading: 'Mengenal rasa khawatir', paragraphs: [
        { text: 'Ibu mungkin memikirkan proses persalinan, kesehatan diri atau bayi, pengalaman sebelumnya, rasa nyeri, atau perubahan setelah bayi lahir. Setiap orang dapat memiliki kekhawatiran yang berbeda.', referenceIds: ['S5', 'S17'] },
      ] },
      { id: 'tujuan', heading: 'Dukungan yang dapat dipilih', paragraphs: [
        { text: 'Ibu dapat berbagi dengan orang yang dipercaya, meminta pendamping mendengarkan, dan membawa pertanyaan saat bertemu bidan atau dokter. Musik atau kegiatan relaksasi boleh dicoba jika terasa nyaman, tetapi tidak menggantikan dukungan profesional.', referenceIds: ['S5', 'S17', 'C05', 'C06'] },
        { text: 'Satu studi menggunakan musik saat pemeriksaan denyut jantung bayi pada kehamilan berisiko tinggi. Studi lain menggabungkan musik dengan edukasi kesehatan untuk ibu yang baru pertama kali hamil. Keduanya merupakan program khusus, berbeda dari mendengarkan playlist biasa seperti audio Ruang Ibu.', referenceIds: ['C05', 'C06'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan mencari dukungan profesional?', paragraphs: [
        { text: 'Hubungi bidan, dokter, atau tenaga kesehatan bila kekhawatiran terus mengganggu tidur, kegiatan sehari-hari, atau membuat Ibu merasa kewalahan. Mereka dapat membantu membicarakan pilihan dukungan yang tersedia.', referenceIds: ['S5'] },
        { text: 'Jika Ibu merasa tidak aman atau terpikir untuk menyakiti diri, sampaikan segera kepada tenaga kesehatan dan orang tepercaya di dekat Ibu agar bantuan langsung dapat dicari.', referenceIds: ['S5'] },
      ] },
    ],
    'Khawatir bukan berarti Ibu gagal mempersiapkan diri. Jangan menghentikan perawatan atau menunda bantuan karena mencoba musik atau relaksasi.',
    ['S5', 'C05', 'C06'],
    ['S5', 'S17', 'C05', 'C06'],
    { status: 'source_based', note: 'Pilihan ini berfokus pada dukungan dan komunikasi, bukan latihan terapi atau diagnosis.', instructions: [
      { text: 'Ceritakan kepada pendamping hal yang paling membuat Ibu khawatir dan dukungan yang Ibu inginkan.', referenceIds: ['S17'] },
      { text: 'Tuliskan pertanyaan untuk dibahas dengan bidan atau dokter saat kunjungan.', referenceIds: ['S5', 'S17'] },
      { text: 'Pilih musik hanya jika terasa nyaman; Ibu dapat mengganti atau menghentikannya kapan saja.', referenceIds: ['C05', 'C06'] },
    ] },
  ),

  'nyeri-persalinan': customerArticle(
    'B01', 'nyeri-persalinan', 'Nyeri Persalinan', ['Bersalin'],
    'Nyeri persalinan sering berkaitan dengan kontraksi rahim dan perubahan selama proses kelahiran. Pengalaman, kebutuhan dukungan, dan pilihan pereda nyeri dapat berbeda pada setiap Ibu.',
    ['S2', 'S8', 'C07'],
    [
      { id: 'pengertian', heading: 'Mengapa nyeri dapat dirasakan?', paragraphs: [
        { text: 'Kontraksi membantu proses persalinan berlangsung. Sensasi dapat terasa di perut, panggul, atau punggung, dan berubah sepanjang proses. Tidak ada satu pola pengalaman yang berlaku untuk semua Ibu.', referenceIds: ['S2', 'S8'] },
      ] },
      { id: 'tujuan', heading: 'Pilihan dukungan dan pereda nyeri', paragraphs: [
        { text: 'Pilihan tanpa obat dapat mencakup dukungan pendamping, suasana yang nyaman, musik, napas yang terasa nyaman, atau pijat jika Ibu setuju. Pilihan dengan obat atau tindakan medis dapat dibicarakan bersama tenaga kesehatan.', referenceIds: ['S2', 'S8', 'S22'] },
        { text: 'Tanyakan kepada tim persalinan pilihan apa yang tersedia dan sesuai dengan kondisi Ibu. Ibu dapat menyampaikan pilihan atau meminta penjelasan lebih lanjut.', referenceIds: ['S2', 'S8'] },
        { text: 'Rangkuman bukti menunjukkan musik mungkin membantu mengurangi nyeri pada sebagian tahap persalinan. Hasilnya belum tentu sama bagi setiap Ibu.', referenceIds: ['C07'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Peran tim kesehatan', paragraphs: [
        { text: 'Bidan atau dokter mendampingi proses persalinan dan membantu membahas pilihan menurut kebutuhan serta keadaan Ibu. Sampaikan bila nyeri berubah, pilihan tidak nyaman, atau Ibu ingin bertanya tentang pereda nyeri lain.', referenceIds: ['S2', 'S8'] },
      ] },
    ],
    'Jangan menunda menghubungi tenaga kesehatan untuk mencoba cara kenyamanan. Halaman ini tidak dapat menilai kondisi persalinan Ibu; tetap ikuti arahan bidan atau dokter.',
    ['S2', 'S8', 'C07'],
    ['S2', 'S8', 'S22', 'C07'],
  ),

  'kompres-hangat-persalinan': customerArticle(
    'B05', 'kompres-hangat-persalinan', 'Kompres Hangat Saat Persalinan', ['Bersalin'],
    'Kompres hangat saat persalinan merupakan bagian dari perawatan yang berbeda dari kompres pada punggung saat hamil. Pilihan dan waktu penggunaannya perlu dibicarakan dengan tenaga kesehatan yang mendampingi.',
    ['S2', 'S29', 'C01', 'C02', 'C03'],
    [
      { id: 'pengertian', heading: 'Apa itu kompres hangat saat persalinan?', paragraphs: [
        { text: 'Kompres hangat dapat menjadi salah satu pilihan perawatan selama persalinan. Pada tahap kedua, bidan dapat menawarkan kompres pada area perineum, yaitu bagian di antara vagina dan anus, sesuai kondisi dan pilihan Ibu.', referenceIds: ['S2'] },
        { text: 'Laporan kompres pada nyeri punggung membahas masa kehamilan, bukan perawatan saat proses persalinan. Karena itu, temuan tersebut tidak menjadi petunjuk untuk tindakan kompres selama persalinan.', referenceIds: ['C01', 'C02', 'C03'] },
      ] },
      { id: 'tujuan', heading: 'Apa tujuannya?', paragraphs: [
        { text: 'Pada tahap kedua persalinan, bidan dapat menawarkan kompres hangat pada area perineum sebagai bagian dari perawatan. Tindakan ini dilakukan oleh tim kesehatan sesuai kondisi dan pilihan Ibu.', referenceIds: ['S2'] },
        { text: 'Kompres saat persalinan bukan cara yang sama dengan kompres pada punggung saat hamil. Tanyakan kepada bidan bila Ibu ingin memahami pilihan perawatan yang tersedia.', referenceIds: ['S2', 'C01', 'C02', 'C03'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan dipertimbangkan?', paragraphs: [
        { text: 'Kompres perineum merupakan pilihan perawatan pada tahap kedua persalinan yang ditangani oleh tenaga kesehatan. Pastikan bidan mengetahui apakah suhunya terasa nyaman bagi Ibu.', referenceIds: ['S2'] },
        { text: 'Mintalah tenaga kesehatan menjelaskan apakah kompres sesuai untuk keadaan Ibu saat itu. Ibu dapat menolak, meminta penjelasan, atau meminta tindakan dihentikan.', referenceIds: ['S2'] },
      ] },
    ],
    'Jangan melakukan kompres perineum atau tindakan kompres persalinan secara mandiri dari petunjuk website. Ikuti penjelasan dan arahan tenaga kesehatan yang sedang merawat Ibu.',
    ['S2'],
    ['S2', 'C01', 'C02', 'C03'],
    { status: 'source_based', note: 'Kompres hangat pada tahap kedua persalinan merupakan pilihan perawatan yang dilakukan oleh tenaga kesehatan, bukan tindakan mandiri.', instructions: [
      { text: 'Tanyakan kepada bidan apakah kompres hangat termasuk pilihan perawatan yang sesuai bagi Ibu.', referenceIds: ['S2'] },
      { text: 'Jika tim kesehatan menawarkan kompres, sampaikan apakah suhunya terasa nyaman. Ibu boleh meminta penjelasan atau meminta tindakan dihentikan.', referenceIds: ['S2'] },
      { text: 'Jangan melakukan kompres perineum sendiri berdasarkan petunjuk website. Ikuti arahan tim yang merawat Ibu.', referenceIds: ['S2'] },
    ] },
  ),

  'kecemasan-persalinan': customerArticle(
    'B06', 'kecemasan-persalinan', 'Kekhawatiran Selama Persalinan', ['Bersalin', 'Relaksasi'],
    'Rasa takut, khawatir, atau tegang dapat muncul saat persalinan. Perasaan ini dapat berubah dari waktu ke waktu. Merasa takut tidak berarti Ibu mengalami gangguan mental.',
    ['S2', 'S22', 'C07', 'C08'],
    [
      { id: 'pengertian', heading: 'Mengapa kekhawatiran dapat muncul?', paragraphs: [
        { text: 'Ibu mungkin merasa khawatir tentang nyeri, perubahan yang terjadi, kondisi bayi, atau hal yang belum jelas. Pengalaman persalinan berbeda; Ibu tidak harus menghadapi kekhawatiran sendirian.', referenceIds: ['S2', 'S22'] },
      ] },
      { id: 'tujuan', heading: 'Dukungan dan pilihan kenyamanan', paragraphs: [
        { text: 'Pendamping dapat mendengarkan, membantu menyampaikan kebutuhan yang Ibu pilih, dan memberi dukungan tanpa memaksa sentuhan. Tim kesehatan dapat menjelaskan apa yang sedang dilakukan dan menjawab pertanyaan.', referenceIds: ['S2', 'S22'] },
        { text: 'Musik atau napas yang terasa nyaman dapat dipilih sebagai teman. Rangkuman bukti musik saat persalinan menunjukkan nyeri mungkin lebih ringan pada sebagian tahap, tetapi perubahan rasa cemas belum terlihat jelas. Hasil untuk nyeri dan kecemasan berbeda.', referenceIds: ['C07'] },
        { text: 'Dalam satu studi di sebuah rumah sakit, ibu hamil cukup bulan yang mendengarkan musik melaporkan rasa cemas yang lebih rendah. Temuan ini belum tentu sama bagi setiap Ibu.', referenceIds: ['C08'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan meminta bantuan?', paragraphs: [
        { text: 'Beri tahu bidan atau dokter bila rasa takut terasa berat, Ibu tidak memahami tindakan yang dijelaskan, ingin mengubah pilihan, atau membutuhkan bantuan. Ibu boleh meminta penjelasan dan waktu untuk menyampaikan preferensi bila keadaan memungkinkan.', referenceIds: ['S2', 'S22'] },
      ] },
    ],
    'Jangan memaksakan musik, sentuhan, atau latihan relaksasi. Arahan perawatan dan komunikasi dengan tim kesehatan tetap menjadi prioritas.',
    ['S2', 'S22', 'C07', 'C08'],
    ['S2', 'S22', 'C07', 'C08'],
    { status: 'source_based', note: 'Panduan ini hanya menyarankan komunikasi dan pilihan Ibu; bukan teknik untuk mengatasi kondisi klinis.', instructions: [
      { text: 'Sampaikan kepada pendamping atau bidan bila Ibu merasa khawatir atau membutuhkan penjelasan.', referenceIds: ['S2', 'S22'] },
      { text: 'Pilih atau hentikan musik sesuai kenyamanan dan kebutuhan komunikasi dengan tim persalinan.', referenceIds: ['S2', 'C07', 'C08'] },
      { text: 'Minta dukungan langsung bila rasa takut atau keadaan terasa sulit dihadapi.', referenceIds: ['S2', 'S22'] },
    ] },
  ),
}
