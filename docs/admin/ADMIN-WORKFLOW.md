# Alur Kerja Moderasi M4

## Pemeriksaan pertanyaan

Pertanyaan baru masuk sebagai `pending` dan tidak ditampilkan publik. Pengelola melihat teks asli dan email opsional sebagai data privat pada detail. Sebelum menyetujui, pengelola dapat menyunting nama dan teks publik. Pengiriman `approve` membutuhkan kedua field publik; tidak ada persetujuan otomatis atau penyamaran otomatis. Jika data pribadi tidak dapat disunting dengan aman, pengelola dapat menolak pertanyaan.

Transisi yang tersedia mengikuti M3:

| Status saat ini | Tindakan | Status berikutnya |
|---|---|---|
| pending | Setujui dengan versi publik | approved |
| pending | Tolak (dengan konfirmasi) | rejected |
| approved | Tulis/publikasikan jawaban | answered |
| answered | Perbarui jawaban | answered |
| approved / answered | Sembunyikan (dengan konfirmasi) | hidden |

Jika API menjawab 409, layar menjelaskan konflik dan menyediakan pemuatan ulang. Status `rejected` dan `hidden` tidak menyediakan tindakan persetujuan ulang.

## Jawaban

Jawaban diketik dan disunting oleh pengelola, 10–2.000 karakter, melalui `PUT /api/admin/questions/:id/answer`. Pengingat UI meminta jawaban edukatif tanpa diagnosis atau penggantian pemeriksaan bidan/dokter. Tidak ada AI, template jawaban otomatis, atau klaim review klinis.

## Penghapusan dan retensi

Penghapusan satu pertanyaan memerlukan konfirmasi bahwa pertanyaan beserta jawaban akan dihapus. Hanya role `owner` yang dapat menjalankan penghapusan; API tetap menegakkan role meskipun tombol disembunyikan untuk moderator. Dashboard tidak menampilkan atau memanggil endpoint purge massal.

Default M3 berikut hanya informasi sementara dan **belum disetujui customer**: pending 90 hari dari `created_at`; rejected/hidden 30 hari sejak tindakan moderasi; approved/answered 365 hari sejak persetujuan atau pembuatan/pembaruan jawaban. M3 menyediakan `expiresAt` untuk ditinjau moderator, tetapi M4 belum membuat daftar kandidat purge atau tombol purge. Tidak ada penghapusan otomatis. Kebijakan, retensi audit, serta prosedur pemulihan perlu disepakati sebelum operasi retensi dijalankan.

## Riwayat yang terlihat

Halaman riwayat meminta empat status tertangani sekaligus melalui filter status comma-separated yang divalidasi oleh Pages Function, kemudian menampilkan `moderatedAt`, `moderatedBy`, `updatedAt`, dan waktu jawaban yang disediakan API. M3 tidak menyediakan endpoint audit-event inbox, jadi UI ini bukan rekonstruksi penuh setiap perubahan moderasi. Riwayat audit internal tetap berada di backend dan tidak diekspos sebagai UI M4.

## Akses akun (M4.6C — lokal)

Admin masuk melalui tombol resmi Google Identity Services di `/admin/login`. Hanya Google `sub` yang sebelumnya ditautkan secara privat ke baris `admin_users` aktif dapat membuat sesi; login Google tidak membuat akun otomatis dan peran tidak berasal dari token/request. Tidak ada password login, pendaftaran publik, atau reset password. ID token hanya berada sementara di memori dan dikirim ke API same-origin untuk verifikasi signature, issuer, audience, expiry, nonce, dan email terverifikasi. Cookie sesi tetap HttpOnly/Secure/SameSite=Strict; batas idle 30 menit dan absolut 8 jam; logout mencabut sesi. Moderator dapat melakukan moderasi/jawaban, sedangkan hapus individual dan purge hanya untuk pemilik. Data pertanyaan, email, ID token, dan sesi tidak disimpan di Web Storage. Identitas owner/moderator disediakan melalui proses operator privat. Integrasi Google, migration 0002, dan akun belum terhubung/diterapkan di Preview atau Production.
