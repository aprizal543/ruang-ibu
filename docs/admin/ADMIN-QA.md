# QA Dashboard Pengelola M4

## Runner browser

`npm.cmd run test:browser:admin` menjalankan Chromium melalui CDP. Runner memasang fetch fixture sintetis sebelum aplikasi dimuat; tidak ada flag bypass autentikasi atau fixture dalam kode runtime. Runner memeriksa angka ringkasan dari API, keberadaan pilihan status dan materi, cursor pagination, pertanyaan baru yang langsung dapat dijawab tanpa tombol Setujui, publikasi data legacy `pending` bersama jawaban, 409 dan refresh, hide/delete dengan konfirmasi, error 401/403/503/network, drawer keyboard, fokus kembali, penyimpanan privat, dan pengecualian route admin pada offline SPA fallback. Perubahan filter pada elemen select tidak disimulasikan oleh runner karena event sintetis tidak konsisten dengan pembaruan URL/React Router; filter query tetap didukung API/UI, tetapi interaksi select tersebut memerlukan pemeriksaan manual atau runner input-native yang lebih stabil.

Pengecekan overflow menjalankan viewport 360×800, 375×812, 390×844, 430×932, 768×1024, 1024×768, dan 1440×900. Regression M2 menguji navigasi publik, konten, audio, evaluasi dan route scroll secara terpisah.

## Evidence

- `docs/evidence/m4-admin/overview-desktop-1440x900.png`
- `docs/evidence/m4-admin/overview-mobile-390x844.png`
- `docs/evidence/m4-admin/questions-inbox-desktop-1440x900.png`
- `docs/evidence/m4-admin/questions-inbox-mobile-390x844.png`
- `docs/evidence/m4-admin/unanswered-detail-390x844.png`
- `docs/evidence/m4-admin/answer-editor-desktop-1440x900.png`
- `docs/evidence/m4-admin/history-mobile-390x844.png`
- `docs/evidence/m4-admin/empty-state-mobile-390x844.png`
- `docs/evidence/m4-admin/auth-unavailable-mobile-390x844.png`
- `docs/evidence/m4-admin/settings-desktop-1440x900.png`
- `docs/evidence/m4-admin/review-gallery.html` (galeri seluruh screenshot)

Semua screenshot menggunakan record uji fiktif, bukan data pengunjung.

## Batas validasi

Browser UI Admin menggunakan fixture jaringan sintetis. Ini bukan bukti integrasi D1/Google OIDC/Turnstile Cloudflare. QA Admin terpisah saat ini menggunakan Google OIDC dan staging D1; pengujian autentikasi Owner dilakukan pada deployment yang sudah ada. Browser form Q&A menggunakan fixture sintetis dan tidak menulis ke staging. Pengujian offline browser memeriksa denylist source service worker, bukan sesi perangkat offline end-to-end.

Agent Browser CLI gagal membuka kanal CDP di environment ini. Runner dashboard dan regression publik menggunakan Chromium DevTools Protocol secara langsung. `test:browser:m2` dan `test:browser:route-scroll` sekarang menjalankan coverage CDP stabil yang sama; implementasi lama tetap tersedia sebagai `test:browser:m2:legacy` dan `test:browser:route-scroll:legacy`, tetapi berhenti tanpa progress dalam sesi ini. Playback audio tidak diuji oleh fallback; fallback memverifikasi route pemutar, kontrol, dan respons file audio lokal.
