# Dashboard Pengelola Ruang Ibu (M4)

Status: implementasi lokal M4; belum dikonfigurasi atau diterbitkan ke Cloudflare.

## Struktur

- `/admin`: ringkasan angka dari `GET /api/admin/summary`, daftar singkat pertanyaan menunggu dan terbaru.
- `/admin/questions`: inbox, filter status dan materi melalui URL search parameters, halaman API berukuran 20 dengan cursor.
- `/admin/questions/:id`: kiriman privat, penyuntingan versi publik sebelum persetujuan, keputusan moderasi, jawaban, dan penghapusan individual.
- `/admin/history`: pertanyaan yang telah ditangani beserta filter status/materi dan pagination.
- `/admin/settings`: petunjuk proteksi Cloudflare Access dan nilai retensi M3 yang masih menunggu persetujuan.

## Visual dan responsivitas

Dashboard menggunakan `design-system/tokens.css`, Fraunces untuk heading, DM Sans untuk kontrol dan isi, warm ivory, terracotta, forest green, sage, serta peach. Layout desktop memakai rail kiri 252 px dan area konten lebar. Pada lebar 820 px ke bawah, rail diganti drawer modal dengan focus trap, Escape, dan pengembalian fokus. Tidak ada bottom navigation publik pada dashboard.

Inbox menggunakan baris yang berubah menjadi susunan kartu pada layar kecil. Detail beralih dari dua kolom menjadi satu kolom. Kontrol berukuran minimal 44 px, fokus terlihat, dan animasi loading mengikuti `prefers-reduced-motion`.

## State dan API

`src/features/admin/api/adminApi.ts` memakai fetch same-origin dengan `credentials: 'same-origin'`, `cache: 'no-store'`, parsing envelope API M3, AbortSignal untuk GET, dan pesan error ter-normalisasi. Data selalu dimuat dari API; tidak ada data contoh operasional dan tidak ada penyimpanan pertanyaan/jawaban/token di Web Storage.

UI admin bukan mekanisme autentikasi. Cloudflare Access harus melindungi `/admin`, `/admin/*`, dan `/api/admin/*`. API tetap fail closed ketika konfigurasi Access/D1 belum ada. M4 tidak menyediakan login buatan sendiri, tidak memanggil D1 dari browser, dan tidak menyediakan kontrol purge.

Screenshot sintetis tersedia pada `docs/evidence/m4-admin/`. Fixture hanya berada di runner browser QA dan tidak masuk bundle aplikasi.
