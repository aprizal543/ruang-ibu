import type { TherapyArticle, TherapyArticleDefinition } from './therapyContent.types'

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
): TherapyArticleDefinition {
  return {
    id,
    slug,
    title,
    categories,
    sourceReview: { status: 'source_reviewed', reviewedAt: '2026-10-29' },
    clinicalReview: { status: 'draft' },
    introduction: { text: introduction, referenceIds: introductionRefs },
    sections,
    safetyNotice: { text: safety, referenceIds: safetyRefs },
    practiceGuide,
    audio: { status: 'not_applicable' },
    referenceIds,
    updatedAt: '2026-10-29',
  }
}

export const customerRevisionArticles: Record<string, TherapyArticleDefinition> = {
  'nyeri-punggung-kehamilan': customerArticle(
    'A01', 'nyeri-punggung-kehamilan', 'Nyeri Punggung saat Kehamilan', ['Hamil'],
    'Punggung yang terasa pegal dapat membuat kegiatan sehari-hari lebih melelahkan, terutama ketika tubuh berubah selama kehamilan. Keluhan ini cukup sering dibicarakan oleh ibu hamil, tetapi penyebab dan tingkat rasa tidak nyaman setiap orang tidak selalu sama. Tenaga kesehatan dapat membantu menilai keluhan Ibu.',
    ['S26', 'S42', 'C01', 'C02', 'C03', 'C04'],
    [
      { id: 'pengertian', heading: 'Apa itu nyeri punggung saat kehamilan?', paragraphs: [
        { text: 'Rasa pegal dapat terasa di punggung bawah dan mengganggu saat duduk lama, berdiri, tidur, atau berpindah posisi. Perubahan tubuh selama hamil dapat ikut berperan, tetapi artikel ini tidak dapat memastikan penyebab nyeri yang dialami Ibu.', referenceIds: ['S26', 'S42'] },
        { text: 'Bagi sebagian orang, pegal terasa lebih mengganggu setelah banyak berdiri atau menjelang akhir hari. Keluhan yang berubah atau semakin berat tetap perlu dibicarakan, bukan ditebak sendiri penyebabnya.', referenceIds: ['S30', 'S26'] },
        { text: 'Penelitian tentang kompres hangat yang tercatat di Indonesia melibatkan kelompok terbatas dan satu laporan kasus. Temuan tersebut memberi gambaran awal, tetapi belum cukup untuk memastikan seberapa besar manfaatnya atau apakah hasilnya sama bagi semua Ibu.', referenceIds: ['C01', 'C02', 'C03'] },
      ] },
      { id: 'tujuan', heading: 'Pilihan untuk merasa lebih nyaman', paragraphs: [
        { text: 'Ibu bisa mencatat kapan keluhan muncul, posisi atau kegiatan yang membuatnya terasa berbeda, dan hal yang membantu Ibu beristirahat. Catatan sederhana ini dapat dibawa saat kontrol untuk dibicarakan bersama bidan atau dokter.', referenceIds: ['S26', 'S30'] },
        { text: 'Tinjauan pada nyeri punggung atau panggul saat hamil menilai program latihan dan edukasi yang beragam. Hasilnya tidak menetapkan satu latihan atau terapi yang cocok untuk semua orang, sehingga pilihan sebaiknya dibicarakan dengan tenaga kesehatan yang mengenal kondisi Ibu.', referenceIds: ['S42', 'C04'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan meminta bantuan?', paragraphs: [
        { text: 'Hubungi bidan atau dokter bila rasa sakit berat, tidak membaik, terasa berbeda dari biasanya, atau membuat Ibu khawatir. Nyeri punggung pada trimester kedua atau ketiga kadang perlu dinilai karena dapat berkaitan dengan persalinan lebih awal.', referenceIds: ['S26'] },
        { text: 'Segera minta arahan tenaga kesehatan jika nyeri disertai demam, perdarahan, nyeri saat buang air kecil, nyeri di sisi tubuh, atau kebas pada tungkai maupun area sekitar bokong dan kemaluan. Jangan menunggu hanya karena mengira semua nyeri punggung adalah keluhan kehamilan biasa.', referenceIds: ['S26'] },
      ] },
    ],
    'Jangan menganggap semua nyeri punggung sebagai keluhan biasa. Halaman ini tidak dapat menentukan penyebab nyeri atau menggantikan pemeriksaan.',
    ['S26', 'S42', 'C01', 'C02', 'C03', 'C04'],
    ['S26', 'S42', 'C01', 'C02', 'C03', 'C04'],
    { status: 'source_based', note: 'Pilihan ini merupakan pengenalan umum; tenaga kesehatan dapat membantu menilai keluhan dan pilihan yang sesuai.', instructions: [
      { text: 'Ceritakan lokasi, kapan nyeri muncul, dan apakah ada keluhan lain kepada bidan atau dokter.', referenceIds: ['S26'] },
      { text: 'Tanyakan pilihan untuk membantu kenyamanan sebelum mencoba terapi atau sumber panas.', referenceIds: ['S26', 'S30'] },
      { text: 'Minta bantuan segera bila nyeri berat atau disertai tanda yang disebutkan pada bagian keselamatan.', referenceIds: ['S26'] },
    ] },
  ),

  'kompres-hangat-kehamilan': {
    ...customerArticle(
      'A04', 'kompres-hangat-kehamilan', 'Kompres Hangat Saat Hamil', ['Hamil'],
      'Sebagian Ibu mempertimbangkan rasa hangat saat punggung terasa pegal. Penelitian kompres hangat pada ibu hamil masih terbatas, jadi belum dapat memastikan manfaatnya bagi setiap orang. Sebelum mencoba, Ibu dapat menanyakan pilihan yang sesuai kepada bidan atau dokter.',
      ['C01', 'C02', 'C03', 'S30'],
      [
        { id: 'pengertian', heading: 'Apa itu kompres hangat?', paragraphs: [
        { text: 'Kompres hangat berarti menggunakan sumber hangat pada area tubuh yang terasa tidak nyaman. Artikel ini tidak menentukan suhu, lama pemakaian, atau cara penggunaan untuk kondisi Ibu; tanyakan pilihan yang aman kepada tenaga kesehatan.', referenceIds: ['S30'] },
        ] },
        { id: 'tujuan', heading: 'Apa tujuannya?', paragraphs: [
          { text: 'Satu penelitian lokal dan dua laporan dengan cakupan terbatas meneliti kompres pada nyeri punggung saat hamil. Hasil awalnya tidak cukup untuk menyimpulkan bahwa kompres pasti mengurangi nyeri atau aman dengan cara yang sama pada semua keadaan kehamilan.', referenceIds: ['C01', 'C02', 'C03'] },
          { text: 'Tinjauan yang membandingkan berbagai pilihan non-obat untuk nyeri punggung terkait kehamilan menemukan bukti yang beragam. Tinjauan tersebut tidak menguji satu aturan penggunaan kompres yang dapat diterapkan kepada semua orang.', referenceIds: ['C04'] },
        ] },
        { id: 'kapan-dipertimbangkan', heading: 'Kapan dapat dipertimbangkan?', paragraphs: [
          { text: 'Bila Ibu ingin mencoba rasa hangat, tanyakan terlebih dahulu apakah pilihan itu sesuai untuk keluhan dan keadaan kehamilan Ibu. Jangan gunakan kompres untuk menunda pemeriksaan bila nyeri berat atau ada keluhan lain.', referenceIds: ['S26', 'S30'] },
          { text: 'Panas berlebih dapat melukai kulit. ACOG menyarankan pengaturan terendah untuk bantalan pemanas, lapisan handuk antara kulit dan sumber panas, serta membatasi lama pemakaian. Hentikan bila terasa terlalu panas, nyeri, atau tidak nyaman; jangan menganggap satu cara cocok untuk semua keadaan.', referenceIds: ['S30'] },
        ] },
      ],
      'Jangan menempelkan sumber panas langsung pada kulit. Jika nyeri punggung terasa berat, berlangsung lama, atau membuat Ibu khawatir, hubungi bidan atau dokter.',
      ['S26', 'S30'],
      ['C01', 'C02', 'C03', 'C04', 'S26', 'S30'],
      { status: 'source_based', note: 'Jika Ibu mempertimbangkan sumber hangat, bicarakan kecocokan dengan tenaga kesehatan dan ikuti batas keamanan yang tercantum di halaman ini.', instructions: [
        { text: 'Bicarakan lebih dahulu dengan bidan atau dokter apakah rasa hangat sesuai untuk keluhan dan keadaan kehamilan Ibu.', referenceIds: ['S30'] },
        { text: 'Jangan gunakan kompres sebagai pengganti pemeriksaan bila nyeri terasa berat, menetap, atau disertai gejala lain.', referenceIds: ['S26', 'S30'] },
        { text: 'Jika memakai bantalan pemanas, pilih pengaturan terendah dan gunakan lapisan kain di antara alat dan kulit; batasi lama pemakaian sesuai arahan ACOG.', referenceIds: ['S30'] },
        { text: 'Hentikan bila kulit terasa panas berlebihan, nyeri, atau tidak nyaman. Jangan gunakan kompres untuk menunda pemeriksaan bila ada keluhan yang mengkhawatirkan.', referenceIds: ['S26', 'S30'] },
      ] },
    ),
    summaryHeading: 'Mengenal Kompres Hangat',
  },

  'pijat-kehamilan': customerArticle(
    'A05', 'pijat-kehamilan', 'Pijat untuk Ibu Hamil', ['Hamil', 'Relaksasi'],
    'Pijat saat hamil sering ditanyakan sebagai pilihan untuk merasa nyaman. Penelitian yang tersedia tidak cukup untuk menjanjikan manfaat pijat umum atau menentukan bahwa semua jenis pijat sesuai untuk setiap kehamilan. Jika Ibu mempertimbangkannya, bicarakan dahulu dengan bidan atau dokter.',
    ['S31', 'S2'],
    [
      { id: 'pengertian', heading: 'Apa itu pijat kehamilan?', paragraphs: [
        { text: 'Istilah pijat kehamilan dapat mencakup layanan dan teknik yang berbeda. Penelitian tentang satu jenis pijat tidak otomatis berlaku untuk teknik lain, sehingga artikel ini tidak mengajarkan posisi, tekanan, atau gerakan pijat.', referenceIds: ['S31'] },
      ] },
      { id: 'tujuan', heading: 'Apa tujuannya?', paragraphs: [
        { text: 'Satu studi kecil tahun 2023 menguji apakah penelitian pijat remedial untuk nyeri gelang panggul dapat dilaksanakan. Tujuan utamanya adalah menilai kelayakan penelitian, bukan memastikan pijat mengurangi keluhan atau memberi manfaat relaksasi secara umum.', referenceIds: ['S31'] },
        { text: 'Jika tujuan Ibu adalah membantu nyeri atau rasa tegang, tanyakan pilihan dukungan yang tersedia sebelum memilih layanan. Studi kelayakan tersebut tidak memberi dasar untuk memperkirakan hasil pada pijat lain atau pada semua kehamilan.', referenceIds: ['S2', 'S31'] },
        { text: 'Karena bukti langsung terbatas, Ibu dapat meminta penjelasan tentang layanan, pengalaman terapis, dan cara menghormati batas kenyamanan. Ibu berhak menolak sentuhan atau meminta sesi dihentikan.', referenceIds: ['S2', 'S31'] },
        { text: 'Pijat bukan kewajiban dan bukan pengganti pemeriksaan bila ada keluhan.', referenceIds: ['S2', 'S31'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan berkonsultasi lebih dahulu?', paragraphs: [
        { text: 'Bicarakan rencana pijat dengan bidan atau dokter, terutama bila Ibu memiliki pertanyaan tentang kondisi kehamilan atau sedang menjalani perawatan tertentu. Artikel ini tidak dapat menentukan kecocokan layanan secara pribadi.', referenceIds: ['S2'] },
        { text: 'Jika Ibu memilih layanan, pastikan penyedia mengetahui bahwa Ibu sedang hamil dan tanyakan pelatihan serta pendekatan yang digunakan. Hentikan bila sentuhan terasa tidak nyaman.', referenceIds: ['S2'] },
      ] },
    ],
    'Jangan menerima pijat yang tidak diinginkan atau terasa menyakitkan. Jika Ibu ragu tentang kondisi kehamilan, mintalah saran bidan atau dokter terlebih dahulu.',
    ['S2', 'S31'],
    ['S2', 'S31'],
    { status: 'source_based', note: 'Bukti langsung untuk pijat umum saat hamil terbatas. Panduan ini berfokus pada komunikasi dan pemilihan layanan, bukan teknik pijat.', instructions: [
      { text: 'Tanyakan kepada bidan atau dokter pertanyaan Ibu tentang pilihan pijat dan kondisi kehamilan.', referenceIds: ['S2'] },
      { text: 'Bila memilih layanan, tanyakan pengalaman dan pendekatan terapis dalam menangani klien hamil.', referenceIds: ['S2'] },
      { text: 'Sampaikan bahwa Ibu sedang hamil dan jelaskan batas kenyamanan yang ingin dihormati.', referenceIds: ['S2'] },
      { text: 'Ibu boleh menolak sentuhan, mengubah pilihan, atau meminta sesi dihentikan kapan saja.', referenceIds: ['S2'] },
      { text: 'Studi pijat untuk nyeri gelang panggul adalah studi kelayakan kecil dan bukan bukti manfaat pijat umum; tanyakan tenaga kesehatan jika masih ragu.', referenceIds: ['S31'] },
    ] },
  ),

  'kecemasan-menjelang-persalinan': customerArticle(
    'A06', 'kecemasan-menjelang-persalinan', 'Kekhawatiran Menjelang Persalinan', ['Hamil', 'Relaksasi'],
    'Mendekati persalinan, wajar bila muncul banyak pertanyaan tentang rasa sakit, kesehatan Ibu atau bayi, dan perubahan setelah kelahiran. Setiap orang punya pengalaman berbeda. Rasa khawatir saja bukan diagnosis, dan Ibu boleh meminta dukungan tanpa harus menunggu sampai keadaan terasa berat.',
    ['S5', 'S43', 'C05', 'C06', 'S41'],
    [
      { id: 'pengertian', heading: 'Mengenal rasa khawatir', paragraphs: [
        { text: 'Pikiran tentang proses persalinan, pengalaman sebelumnya, nyeri, kondisi bayi, atau kehidupan setelah lahir dapat memunculkan pertanyaan dan rasa cemas. Tidak ada satu cara merasa yang berlaku untuk semua Ibu; membicarakan kekhawatiran adalah hal yang boleh dilakukan.', referenceIds: ['S5', 'S17'] },
      ] },
      { id: 'tujuan', heading: 'Dukungan yang dapat dipilih', paragraphs: [
        { text: 'Ibu dapat meminta seseorang yang dipercaya untuk mendengarkan, menuliskan pertanyaan, atau meminta bidan menjelaskan hal yang belum jelas. Tinjauan pada ibu hamil menemukan hubungan antara dukungan sosial yang dirasakan dan rasa takut menghadapi persalinan, tetapi hubungan ini tidak membuktikan bahwa satu bentuk dukungan akan mengurangi rasa cemas setiap orang.', referenceIds: ['S43', 'S5', 'S17'] },
        { text: 'Meminta dukungan tidak berarti Ibu harus menceritakan semuanya sekaligus. Ibu dapat memilih siapa yang dipercaya dan menyampaikan jenis bantuan yang diinginkan, misalnya didengarkan atau ditemani saat konsultasi.', referenceIds: ['S17', 'S22'] },
        { text: 'Penelitian musik selama kehamilan menggunakan sesi atau program yang dirancang khusus, termasuk pada pemeriksaan tertentu atau bersama edukasi kesehatan. Hasil penelitian tersebut tidak dapat dianggap sebagai bukti bahwa playlist biasa memberi hasil yang sama.', referenceIds: ['S41', 'C05', 'C06'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan mencari dukungan profesional?', paragraphs: [
        { text: 'Hubungi bidan, dokter, atau tenaga kesehatan bila kekhawatiran terus mengganggu tidur, kegiatan sehari-hari, atau membuat Ibu merasa kewalahan. Mereka dapat membantu membicarakan pilihan dukungan yang tersedia.', referenceIds: ['S5'] },
        { text: 'Jika Ibu merasa tidak aman atau terpikir untuk menyakiti diri, sampaikan segera kepada tenaga kesehatan dan orang tepercaya di dekat Ibu agar bantuan langsung dapat dicari.', referenceIds: ['S5'] },
      ] },
    ],
    'Khawatir bukan berarti Ibu gagal mempersiapkan diri. Jangan menghentikan perawatan atau menunda bantuan karena mencoba musik atau relaksasi.',
    ['S5', 'S17', 'S43', 'S41', 'C05', 'C06'],
    ['S5', 'S17', 'S43', 'S41', 'C05', 'C06'],
    { status: 'source_based', note: 'Pilihan ini berfokus pada dukungan dan komunikasi, bukan latihan terapi atau diagnosis.', instructions: [
      { text: 'Ceritakan kepada pendamping hal yang paling membuat Ibu khawatir dan dukungan yang Ibu inginkan.', referenceIds: ['S17'] },
      { text: 'Tuliskan pertanyaan untuk dibahas dengan bidan atau dokter saat kunjungan.', referenceIds: ['S5', 'S17'] },
      { text: 'Jika musik terasa menyenangkan, Ibu boleh mendengarkannya; ganti atau hentikan bila tidak nyaman. Penelitian program musik tidak menjamin hasil yang sama dari playlist biasa.', referenceIds: ['S41', 'C05', 'C06'] },
    ] },
  ),

  'nyeri-persalinan': customerArticle(
    'B01', 'nyeri-persalinan', 'Nyeri Persalinan', ['Bersalin'],
    'Persalinan dapat disertai rasa mengencang, tekanan, atau nyeri yang berubah selama prosesnya. Ada banyak pilihan dukungan dan pereda nyeri, dan kebutuhan setiap Ibu berbeda. Tim yang mendampingi dapat membantu menjelaskan pilihan menurut keadaan Ibu saat itu.',
    ['S2', 'S8', 'S44', 'C07'],
    [
      { id: 'pengertian', heading: 'Mengapa nyeri dapat dirasakan?', paragraphs: [
        { text: 'Kontraksi merupakan bagian dari proses persalinan. Rasa yang dialami dapat berubah dari waktu ke waktu dan mungkin terasa di perut, panggul, atau punggung. Tiap Ibu dapat menggambarkan nyeri dengan cara berbeda, jadi sampaikan pengalaman Ibu kepada tenaga kesehatan.', referenceIds: ['S2', 'S8'] },
      ] },
      { id: 'tujuan', heading: 'Pilihan dukungan dan pereda nyeri', paragraphs: [
        { text: 'Pilihan dapat mencakup dukungan pendamping, musik yang Ibu pilih, cara bernapas atau relaksasi yang Ibu inginkan, dan pilihan pereda nyeri lain. Pedoman NICE menyebut beberapa cara tanpa obat sebagai pilihan pada tahap awal persalinan, tetapi hal ini bukan jaminan bahwa nyeri akan hilang atau berkurang untuk setiap Ibu.', referenceIds: ['S2', 'S8', 'S22'] },
        { text: 'Ibu dapat meminta penjelasan tentang manfaat, keterbatasan, dan hal yang perlu dipertimbangkan sebelum memilih. Keputusan dapat dibicarakan bersama tim persalinan dan dapat berubah sesuai keadaan serta keinginan Ibu.', referenceIds: ['S2', 'S8'] },
        { text: 'Tinjauan musik tahun 2023 menemukan penurunan intensitas nyeri pada studi yang dirangkum, tetapi hasil tersebut berasal dari berbagai program dan cara mendengarkan. Tinjauan lain yang berfokus pada ibu pertama kali melahirkan menemukan hasil nyeri yang terbatas dan hasil kecemasan yang belum jelas. Musik pilihan Ibu dapat didukung sebagai pilihan, bukan pengganti bantuan klinis.', referenceIds: ['S44', 'C07'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Peran tim kesehatan', paragraphs: [
        { text: 'Bidan atau dokter mendampingi proses persalinan dan membantu membahas pilihan menurut kebutuhan serta keadaan Ibu. Sampaikan bila nyeri berubah, pilihan tidak nyaman, atau Ibu ingin bertanya tentang pereda nyeri lain.', referenceIds: ['S2', 'S8'] },
      ] },
    ],
    'Jangan menunda menghubungi tenaga kesehatan untuk mencoba cara kenyamanan. Halaman ini tidak dapat menilai kondisi persalinan Ibu; tetap ikuti arahan bidan atau dokter.',
    ['S2', 'S8', 'S22', 'S44', 'C07'],
    ['S2', 'S8', 'S22', 'S44', 'C07'],
    { status: 'source_based', note: 'Pilihan dukungan bergantung pada keadaan persalinan dan keinginan Ibu. Diskusikan pilihan dengan tim yang mendampingi.', instructions: [
      { text: 'Sampaikan kepada bidan atau dokter bagaimana nyeri terasa dan dukungan apa yang Ibu inginkan.', referenceIds: ['S2', 'S8'] },
      { text: 'Tanyakan pilihan pereda nyeri yang tersedia, termasuk manfaat dan hal yang perlu dipertimbangkan.', referenceIds: ['S2', 'S8'] },
      { text: 'Pilih dukungan nonmedis hanya jika terasa nyaman; Ibu boleh mengubah pilihan atau meminta berhenti.', referenceIds: ['S2', 'S22'] },
      { text: 'Beri tahu tim kesehatan bila nyeri berubah, Ibu merasa tidak nyaman, atau ingin bantuan lain.', referenceIds: ['S2', 'S8'] },
    ] },
  ),

  'kompres-hangat-persalinan': customerArticle(
    'B05', 'kompres-hangat-persalinan', 'Kompres Hangat Saat Persalinan', ['Bersalin'],
    'Kompres hangat saat persalinan berbeda dari kompres untuk punggung pegal saat hamil. Pada tahap tertentu, tenaga kesehatan dapat menawarkan kompres hangat pada area perineum sebagai salah satu pilihan perawatan. Ibu dapat meminta penjelasan dan menyampaikan apakah terasa nyaman.',
    ['S2', 'S35', 'S36'],
    [
      { id: 'pengertian', heading: 'Apa itu kompres hangat saat persalinan?', paragraphs: [
        { text: 'Perineum adalah area di antara vagina dan anus. Pedoman NICE menyebut tenaga kesehatan menawarkan kompres hangat yang lembap pada area tersebut ketika bagian bayi mulai menekan perineum pada tahap kedua persalinan, lalu memeriksa apakah suhunya terasa nyaman bagi Ibu.', referenceIds: ['S2'] },
        { text: 'Ini merupakan perawatan oleh tim yang mendampingi persalinan, bukan cara yang perlu dilakukan sendiri atau panduan untuk mengompres punggung saat hamil.', referenceIds: ['S2', 'S36'] },
      ] },
      { id: 'tujuan', heading: 'Apa tujuannya?', paragraphs: [
        { text: 'Tinjauan sistematis dan Cochrane menelaah kompres perineum pada kala II. Hasil sejumlah luaran tidak sama tingkat kepastiannya; karena itu artikel ini tidak menjanjikan hasil tertentu atau menyamakan tindakan ini dengan kompres hangat untuk nyeri punggung.', referenceIds: ['S35', 'S36'] },
        { text: 'Pedoman NICE menyebut pilihan ini tidak berlaku untuk persalinan di dalam air. Tim yang merawat Ibu akan mempertimbangkan situasi persalinan dan memastikan suhu kompres terasa nyaman bila tindakan ditawarkan.', referenceIds: ['S2'] },
        { text: 'Bila kompres ditawarkan, Ibu dapat meminta penjelasan tentang tujuan dan pilihan lain yang tersedia. Perawatan perlu mengikuti kondisi saat itu dan keputusan yang dibicarakan bersama tim.', referenceIds: ['S2', 'S36'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan dipertimbangkan?', paragraphs: [
        { text: 'Kompres perineum merupakan pilihan perawatan pada tahap kedua persalinan yang ditangani oleh tenaga kesehatan. Pastikan bidan mengetahui apakah suhunya terasa nyaman bagi Ibu.', referenceIds: ['S2'] },
        { text: 'Mintalah tenaga kesehatan menjelaskan apakah kompres sesuai untuk keadaan Ibu saat itu. Ibu dapat menolak, meminta penjelasan, atau meminta tindakan dihentikan.', referenceIds: ['S2'] },
      ] },
    ],
    'Jangan melakukan kompres perineum atau tindakan kompres persalinan secara mandiri dari petunjuk website. Ikuti penjelasan dan arahan tenaga kesehatan yang sedang merawat Ibu.',
    ['S2', 'S35', 'S36'],
    ['S2', 'S35', 'S36'],
    { status: 'source_based', note: 'Kompres hangat pada tahap kedua persalinan merupakan pilihan perawatan yang dilakukan oleh tenaga kesehatan, bukan tindakan mandiri.', instructions: [
      { text: 'Tanyakan kepada bidan apakah kompres hangat termasuk pilihan perawatan yang sesuai bagi Ibu.', referenceIds: ['S2'] },
      { text: 'Jika tim kesehatan menawarkan kompres perineum pada kala II, sampaikan apakah terasa nyaman. Ibu boleh meminta penjelasan atau meminta tindakan dihentikan.', referenceIds: ['S2', 'S36'] },
      { text: 'Jangan melakukan kompres perineum sendiri berdasarkan petunjuk website. Ikuti arahan tim yang merawat Ibu.', referenceIds: ['S2', 'S36'] },
    ] },
  ),

  'kecemasan-persalinan': customerArticle(
    'B06', 'kecemasan-persalinan', 'Kekhawatiran Selama Persalinan', ['Bersalin', 'Relaksasi'],
    'Rasa takut atau khawatir saat persalinan dapat muncul karena nyeri, perubahan keadaan, atau hal yang belum sempat dijelaskan. Perasaan tersebut tidak otomatis berarti Ibu mengalami gangguan kesehatan mental. Ibu berhak meminta dukungan dan penjelasan dengan cara yang terasa nyaman.',
    ['S2', 'S22', 'S43', 'C07', 'C08'],
    [
      { id: 'pengertian', heading: 'Mengapa kekhawatiran dapat muncul?', paragraphs: [
        { text: 'Kekhawatiran bisa berkaitan dengan nyeri, kondisi bayi, pengalaman sebelumnya, atau belum memahami apa yang sedang dilakukan. Pengalaman setiap orang berbeda. Bila ada pertanyaan, Ibu boleh meminta penjelasan secara langsung kepada tim yang merawat.', referenceIds: ['S2', 'S22'] },
      ] },
      { id: 'tujuan', heading: 'Dukungan dan pilihan kenyamanan', paragraphs: [
        { text: 'Pendamping dapat mendengarkan, membantu menyampaikan kebutuhan yang Ibu pilih, atau mendampingi tanpa sentuhan. Ibu dapat meminta tim kesehatan menjelaskan tindakan dan memberi tahu apa yang membuat Ibu lebih nyaman. Dukungan tidak harus berupa nasihat atau sentuhan.', referenceIds: ['S2', 'S22'] },
        { text: 'Tinjauan musik saat persalinan melaporkan hasil nyeri dan kecemasan yang tidak sama: hasil kecemasan gabungan belum menunjukkan perbedaan yang jelas. Hasil ini tidak membuktikan bahwa musik dapat mengatasi rasa khawatir saat persalinan.', referenceIds: ['C07', 'S44'] },
        { text: 'Satu tinjauan dukungan sosial meneliti rasa takut menghadapi persalinan selama kehamilan, bukan kecemasan klinis ketika persalinan berlangsung. Untuk kondisi Ibu saat ini, tim kesehatan tetap menjadi tempat meminta bantuan dan penjelasan.', referenceIds: ['S43', 'S2'] },
        { text: 'Satu studi di rumah sakit pada ibu hamil cukup bulan melaporkan perubahan kecemasan setelah musik, tetapi konteks dan cara pemberiannya tertentu. Temuan dari satu tempat tidak menjamin hasil yang sama bagi Ibu atau playlist biasa.', referenceIds: ['C08', 'S41'] },
      ] },
      { id: 'kapan-dipertimbangkan', heading: 'Kapan meminta bantuan?', paragraphs: [
        { text: 'Beri tahu bidan atau dokter bila rasa takut terasa berat, Ibu tidak memahami tindakan yang dijelaskan, ingin mengubah pilihan, atau membutuhkan bantuan. Ibu boleh meminta penjelasan dan waktu untuk menyampaikan preferensi bila keadaan memungkinkan.', referenceIds: ['S2', 'S22'] },
      ] },
    ],
    'Jangan memaksakan musik, sentuhan, atau latihan relaksasi. Arahan perawatan dan komunikasi dengan tim kesehatan tetap menjadi prioritas.',
    ['S2', 'S22', 'S43', 'S44', 'C07', 'C08', 'S41'],
    ['S2', 'S22', 'S43', 'S44', 'C07', 'C08', 'S41'],
    { status: 'source_based', note: 'Panduan ini hanya menyarankan komunikasi dan pilihan Ibu; bukan teknik untuk mengatasi kondisi klinis.', instructions: [
      { text: 'Sampaikan kepada pendamping atau bidan bila Ibu merasa khawatir atau membutuhkan penjelasan.', referenceIds: ['S2', 'S22'] },
      { text: 'Gunakan musik hanya jika Ibu menginginkannya dan tetap dapat berkomunikasi dengan tim; hentikan bila mengganggu atau terasa tidak nyaman.', referenceIds: ['S2', 'S44'] },
      { text: 'Minta dukungan langsung bila rasa takut atau keadaan terasa sulit dihadapi.', referenceIds: ['S2', 'S22'] },
    ] },
  ),
}
