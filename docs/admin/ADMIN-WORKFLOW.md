# Alur Kerja Tanya Jawab Pengelola

## Pemeriksaan pertanyaan

Pertanyaan baru yang lolos validasi, pemeriksaan risiko, pembatasan pengiriman, dan Turnstile langsung tersimpan serta tampil pada artikel sebagai pertanyaan yang belum dijawab. Pengunjung harus menyetujui bahwa pertanyaan dapat dibaca publik. Formulir tidak meminta email. Backend menolak pola informasi kontak/identitas, tautan, dan spam berulang sebelum penyimpanan. Pengelola tidak perlu menyetujui pertanyaan baru; alur utamanya adalah membaca lalu menulis jawaban. Pengelola tetap dapat menyembunyikan atau menghapus pertanyaan.

Status D1 `approved` dipakai untuk pertanyaan publik yang belum dijawab demi kompatibilitas skema yang ada. Ini tidak berarti ada tindakan persetujuan admin. Setelah jawaban disimpan, status menjadi `answered` dan jawaban tampil di bawah pertanyaan. Data lama berstatus `pending` tidak diubah atau dipublikasikan otomatis. Jika pengelola menangani kiriman lama tersebut, nama/teks publik yang telah diperiksa dan jawaban harus disimpan bersama dalam satu tindakan.

Transisi yang tersedia mengikuti M3:

| Status/kondisi | Tindakan | Hasil |
|---|---|---|
| Pertanyaan baru | Validasi + Turnstile + simpan | `approved`, langsung tampil sebagai belum dijawab |
| `approved` | Tulis/publikasikan jawaban | `answered`, jawaban tampil publik |
| `answered` | Perbarui jawaban | `answered`, jawaban diperbarui |
| `approved` / `answered` | Sembunyikan (dengan konfirmasi) | `hidden`, tidak tampil publik |
| `pending` lama | Simpan teks publik yang diperiksa bersama jawaban | `answered`, tampil bersama jawaban |

Jika API menjawab 409, layar menjelaskan bahwa pertanyaan mungkin berubah dan menyediakan pemuatan ulang. Status `rejected` dan `hidden` tidak menyediakan tindakan jawab/publikasi ulang.

## Jawaban

Jawaban diketik dan disunting oleh pengelola, 10–2.000 karakter, melalui `PUT /api/admin/questions/:id/answer`. Pengingat UI meminta jawaban edukatif tanpa diagnosis atau penggantian pemeriksaan bidan/dokter. Tidak ada AI, template jawaban otomatis, atau klaim review klinis.

## Penghapusan dan retensi

Penghapusan satu pertanyaan memerlukan konfirmasi bahwa pertanyaan beserta jawaban akan dihapus. Hanya role `owner` yang dapat menjalankan penghapusan; API tetap menegakkan role meskipun tombol disembunyikan untuk moderator. Dashboard tidak menampilkan atau memanggil endpoint purge massal.

Default M3 berikut hanya informasi sementara dan **belum disetujui customer**: pending 90 hari dari `created_at`; rejected/hidden 30 hari sejak tindakan moderasi; approved/answered 365 hari sejak persetujuan atau pembuatan/pembaruan jawaban. Untuk kiriman publik baru pada revisi ini, `expires_at` awal tetap 90 hari dari alur lama; ketika jawaban disimpan, API mengubahnya ke default 365 hari. Ini detail implementasi sementara, bukan kebijakan retensi baru yang disetujui. M3 menyediakan `expiresAt` untuk ditinjau pengelola, tetapi M4 tidak membuat purge terjadwal. Tidak ada penghapusan otomatis. Kebijakan, retensi audit, serta prosedur pemulihan perlu disepakati sebelum operasi retensi dijalankan.

## Riwayat yang terlihat

Halaman riwayat meminta empat status tertangani sekaligus melalui filter status comma-separated yang divalidasi oleh Pages Function, kemudian menampilkan `moderatedAt`, `moderatedBy`, `updatedAt`, dan waktu jawaban yang disediakan API. M3 tidak menyediakan endpoint audit-event inbox, jadi UI ini bukan rekonstruksi penuh setiap perubahan moderasi. Riwayat audit internal tetap berada di backend dan tidak diekspos sebagai UI M4.

## Akses akun (M4.6C — lokal)

Admin masuk melalui tombol resmi Google Identity Services di `/admin/login`. Hanya Google `sub` yang sebelumnya ditautkan secara privat ke baris `admin_users` aktif dapat membuat sesi; login Google tidak membuat akun otomatis dan peran tidak berasal dari token/request. Tidak ada password login, pendaftaran publik, atau reset password. ID token hanya berada sementara di memori dan dikirim ke API same-origin untuk verifikasi signature, issuer, audience, expiry, nonce, dan email terverifikasi. Cookie sesi tetap HttpOnly/Secure/SameSite=Strict; batas idle 30 menit dan absolut 8 jam; logout mencabut sesi. Moderator dapat melakukan moderasi/jawaban, sedangkan hapus individual dan purge hanya untuk pemilik. Data pertanyaan, email, ID token, dan sesi tidak disimpan di Web Storage. Identitas owner/moderator disediakan melalui proses operator privat. Integrasi Google, migration 0002, dan akun belum terhubung/diterapkan di Preview atau Production.
# Public Q&A handoff (M5A)

> Historical baseline only. Its pending/approval flow is superseded by the M5 UX direct-publication revision below; do not use it as the current behavior.

Pengunjung dari halaman detail materi dapat membaca pertanyaan yang telah disetujui dan mengirim pertanyaan edukasi tanpa akun. Nama tampilan opsional; jika kosong, backend memakai label netral `Ibu` untuk kolom wajib D1. Form tidak meminta email. Pengunjung wajib menyetujui peninjauan moderator sebelum publikasi dan menyelesaikan Turnstile.

Kiriman baru tetap `pending`, terikat pada slug materi yang tercantum di registry, dan hanya terlihat di inbox Admin CMS. Owner/moderator meninjau teks asli, menyunting nama/teks publik bila aman, lalu menyetujui atau menolak. Pertanyaan tampil publik hanya setelah `approved`; jawaban yang disimpan melalui editor dashboard mengubahnya menjadi `answered` dan jawaban turut tersedia pada GET publik. `hidden`/`rejected`/`pending` tidak ditampilkan. Semua data pengunjung pada UI diperlakukan sebagai teks, bukan HTML.

Pengujian lokal M5A mengalirkan data sintetis melalui public submit, filter publik, moderator approval, answer endpoint, dan public GET menggunakan SQLite in-memory. Browser form memakai fixture sintetis. QA/D1/Turnstile end-to-end perlu deployment M5A terpisah yang diotorisasi dan konfigurasi Turnstile khusus hostname QA; deployment belum dilakukan.

## M5 UX direct publication

Revisi lokal saat ini menempatkan Tanya Jawab sebelum disclosure `Sumber Informasi` paling bawah. Formulir tertutup saat halaman dibuka; kunci publik Turnstile diminta ketika formulir dibuka, sedangkan challenge baru dijalankan saat pengiriman. Managed Turnstile memakai `appearance: interaction-only`; Siteverify tetap dilakukan di server. Pertanyaan yang lolos pemeriksaan langsung tampil dengan label “Belum dijawab.” Admin dapat membaca dan menjawab tanpa tindakan persetujuan terpisah; jawaban baru tampil setelah API jawaban berhasil. Sembunyikan dan hapus oleh Owner menjadi tindakan sekunder. Baris D1 lama berstatus `pending` tidak diubah; jika ditangani, teks publik yang ditinjau harus disimpan bersama jawaban dalam satu tindakan. Tidak diperlukan migrasi D1.

Pengujian otomatis lokal menggunakan fixture SQLite/API/widget sintetis. Revisi belum dideploy; belum ada klaim pengiriman QA nyata atau hasil Cloudflare Siteverify.
