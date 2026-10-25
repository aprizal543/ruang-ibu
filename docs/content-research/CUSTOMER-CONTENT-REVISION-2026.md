# Revisi Materi Customer 2026

**Status isi:** seluruh 12 topik tersedia melalui Panduan Hamil, Panduan Bersalin, dan katalog Jenis Terapi. **Status klinis:** draf; belum ada persetujuan bidan/dokter yang tercatat. Pemeriksaan ini memeriksa metadata dan batas pemakaian bukti, bukan menggantikan review klinis.

## Pemetaan 12 topik

| ID | Topik | Panduan / artikel | Referensi utama |
|---|---|---|---|
| A01 | Nyeri punggung saat kehamilan | `/hamil` → `/terapi/nyeri-punggung-kehamilan` | C01–C04, S26 |
| A02 | Musik untuk relaksasi kehamilan | `/hamil` → `/terapi/terapi-musik` | C04–C06 |
| A03 | Relaksasi pernapasan kehamilan | `/hamil` → `/terapi/teknik-pernapasan` | S2, S5, S6 |
| A04 | Kompres hangat saat hamil | `/hamil` → `/terapi/kompres-hangat-kehamilan` | C01–C03, S26, S30 |
| A05 | Pijat untuk ibu hamil | `/hamil` → `/terapi/pijat-kehamilan` | S27, S28 |
| A06 | Kekhawatiran menjelang persalinan | `/hamil` → `/terapi/kecemasan-menjelang-persalinan` | C05, C06, S5, S17 |
| B01 | Nyeri persalinan | `/bersalin` → `/terapi/nyeri-persalinan` | C07, S2, S8 |
| B02 | Musik selama persalinan | `/bersalin` → `/terapi/terapi-musik` | C07, C08 |
| B03 | Relaksasi pernapasan selama persalinan | `/bersalin` → `/terapi/teknik-pernapasan` | S2, S3, S6 |
| B04 | Pijat pendamping | `/bersalin` → `/terapi/pijat-pendamping` | S1, S2, S4 |
| B05 | Kompres hangat dalam perawatan persalinan | `/bersalin` → `/terapi/kompres-hangat-persalinan` | S2; C01–C03 hanya dipakai untuk membedakan konteks kehamilan |
| B06 | Kekhawatiran selama persalinan | `/bersalin` → `/terapi/kecemasan-persalinan` | C07, C08, S2, S22 |

Koleksi audio ditautkan dari panduan, tidak diklaim memberi efek yang sama dengan intervensi uji klinis. Artikel musik menjelaskan perbedaan playlist biasa dan terapi musik klinis. Artikel T03 Relaksasi Tubuh dan batas grounding yang telah ada tetap dipertahankan.

## Delapan jurnal customer wajib

Semua jurnal tercatat pada `src/content/therapyReferences.ts` dengan ID C01–C08, DOI/URL penerbit, penulis, tahun, desain, populasi, keterbatasan, dan pemetaan topik.

| ID | Metadata bibliografis ringkas | Batas pemakaian pada materi |
|---|---|---|
| C01 | Mindiani & Rena Afri Ningsih (2025), *Jurnal Pendidikan Tambusai* 9(2), 28921–28927. Quasi-eksperimen satu kelompok; 16 ibu trimester III di Payung Sekaki. DOI 10.31004/jptam.v9i2.31581. | Tanpa kelompok pembanding; satu wilayah dan sampel kecil. Bukan protokol aman universal. |
| C02 | Sarifah & Riza Febrianti (terbit daring 2023; edisi 2(2) bertahun 2022), *Jurnal Kebidanan Terkini*, 288–293. DOI 10.25311/jkt/Vol2.Iss2.1032. | Satu studi kasus; kegiatan/tema artikel tahun 2022 berbeda dari tahun terbit daring. |
| C03 | Tessalonika Hasda Sinaga, Widya Juliarti & Ani Triana (2024), *Jurnal Kebidanan Terkini* 1(1). DOI penerbit 10.25311/jkt/Vol1.Iss1.1117. Studi kasus satu ibu. | Satu kasus; halaman penerbit mencatat kegiatan Maret 2022 meski judul menyebut 2023. Tidak menjadi prosedur umum. |
| C04 | Suyue Wang, Haijie Zhang, Guangjian Zhang & Lihua Jin (2025), *Medicine* 104(34), e43969. Network meta-analysis uji acak pada nyeri punggung terkait kehamilan. DOI 10.1097/MD.0000000000043969. | Variasi intervensi dan mutu pelaporan studi; hasil gabungan musik-relaksasi tidak sama dengan playlist mandiri. |
| C05 | Yasemin E. Aksoy, Sema D. Yilmaz & Süreyya Kiliç (2024), *International Journal of Nursing Practice* 30(6), e13281. RCT; 116 pasien berisiko tinggi saat NST. DOI 10.1111/ijn.13281. | Rumah sakit, populasi risiko tinggi, dan musik ney terstruktur; tidak digeneralisasi ke semua kehamilan. |
| C06 | Meena Konsam dkk. (7 penulis) (online pertama 2024), *Psychology of Music* 54(5), 680–697; edisi September 2026. RCT terbuka empat kelompok, 128 ibu hamil pertama kali berisiko rendah. DOI 10.1177/03057356241258958. | CHARM menggabungkan pendidikan kesehatan dan musik selama empat minggu; tidak membuktikan efek playlist Ruang Ibu. |
| C07 | Rayyan Vaid dkk. (7 penulis) (2025), *Reproductive Health* 22, 67. Review sistematis/meta-analisis 9 RCT pada ibu yang pertama kali melahirkan pervaginam. DOI 10.1186/s12978-025-02023-z. | Bukti mutu rendah secara umum; hasil nyeri dibedakan dari kecemasan yang tidak menunjukkan perbedaan bermakna. |
| C08 | Chao Ji, Juan Li, Qiaole Nie & Shuo Wang (2024), *Frontiers in Psychiatry* 15, 1429999. Penelitian eksperimental terkontrol pada 217 perempuan hamil cukup bulan. DOI 10.3389/fpsyt.2024.1429999. | Satu fasilitas dan protokol penelitian tertentu; bukan jaminan hasil tiap orang atau efek playlist. |

### Koreksi metadata transparan

- C02 dicatat sebagai terbit daring **2023-01-26** di laman jurnal, pada edisi 2022; tahun kegiatan/asuhan pada judul adalah 2022.
- C03 dipautkan ke laman penerbit artikel Sinaga dkk. yang menampilkan DOI **10.25311/jkt/Vol1.Iss1.1117**. Halaman itu menampilkan terbit **2024-02-04**, sedangkan judul memuat 2023 dan abstrak menyebut kegiatan 2022. DOI yang sempat muncul pada hasil pencarian untuk artikel tersebut tidak dipakai.
- C06 sitasi membedakan tanggal online pertama **27 Juli 2024** dari edisi cetak *Psychology of Music* 54(5) yang terbit **September 2026**.
- C08 menggunakan judul lengkap penerbit: *Effect of Music Therapy on Anxiety in Full-Term Pregnant Women*.

## Sumber tambahan

- S26 NHS, *Back pain in pregnancy*: kemungkinan penyebab umum, pilihan pengelolaan umum, serta gejala untuk meminta bantuan.
- S27 ACOG, *Can I get a massage while pregnant?*: pijat khusus kehamilan dan terapis dengan pelatihan terkait.
- S28 Mueller & Grunwald (2021), tinjauan sistematis RCT pijat prenatal. Dipakai karena relevan langsung; lebih lama dan keterbatasan/komplikasi sampel ditampilkan.
- S29 University Hospitals Coventry and Warwickshire NHS Trust, *Heat and cold therapy*: risiko panas dan luka bakar. Tidak dipakai untuk menciptakan suhu/durasi kompres kehamilan.
- S30 ACOG, *Back Pain During Pregnancy*: sumber hangat untuk otot punggung pegal; setelan bantalan pemanas terendah; lapisi bantalan/botol dengan handuk; batasi lama penggunaan; dan hubungi penyedia layanan untuk nyeri berat atau menetap. Materi tidak mencantumkan angka suhu atau menit.
- S2 NICE NG235 (termasuk pembaruan 2026), S5 NHS kecemasan kehamilan, S6 HDFT menghadapi persalinan, S8 NHS pilihan pereda nyeri, S17 rencana persalinan, dan S22 dukungan pendamping dipakai untuk komunikasi, preferensi, dan opsi yang berlaku.

## Status editorial dan keselamatan

- Semua artikel baru dan artikel lama yang diperluas tetap `clinicalReview: draft`.
- Artikel kompres hangat kehamilan dan persalinan serta pijat kehamilan tidak mengajarkan suhu, durasi, teknik, tekanan, posisi, atau titik tubuh. Kompres perineum saat persalinan dijelaskan sebagai perawatan oleh tenaga kesehatan, bukan tindakan mandiri.
- **Pembaruan copy 25 Oktober 2026:** artikel kompres kehamilan menggunakan panduan keselamatan S30 ACOG untuk setelan terendah, handuk pelapis, pembatasan lama pemakaian, dan menghentikan bila tidak nyaman. Tidak ada jumlah menit atau angka suhu yang ditambahkan. Clinical review tetap `draft`.
- Musik untuk persalinan membedakan hasil nyeri C07 dari hasil kecemasan C07; temuan C08 dijelaskan sebagai hasil satu studi, bukan kepastian.
- Nyeri punggung tidak dianggap selalu keluhan biasa. Informasi tanda bahaya dari panduan yang telah disetujui tidak diubah.
- Tidak ada nama ibu, skor medis, atau data Evaluasi yang ditambahkan ke penyimpanan maupun transmisi.
