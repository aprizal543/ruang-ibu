# RUANG IBU — Product Requirements Document (PRD) v1.1

**Product:** Ruang Ibu (working title)  
**Client:** mahasiswa kebidanan; mata kuliah Inovasi dalam Pelayanan Kebidanan  
**Date:** 21 Oktober 2026  
**Stage:** discovery complete / approved mobile visual / pre-implementation  
**Inputs:** `01-DESIGN-SYSTEM.md`, `../reference/MASTER-mobile-approved.png`, `../reference/MATERI-DRAF-v0.2.md`.

## 1. Product statement

Ruang Ibu adalah website edukasi mobile-first untuk membantu ibu hamil trimester III, ibu yang sedang menjalani persalinan, dan pendampingnya **mengenal** pendekatan nonfarmakologis pendukung kenyamanan, mengakses materi dengan bahasa Indonesia yang mudah dipahami, memilih audio relaksasi, dan melakukan refleksi kondisi nyaman/cemas secara sederhana. Ini **bukan** perangkat medis, aplikasi konsultasi klinis, pengganti bidan, atau sistem pengambil keputusan medis. Website juga harus dapat dipasang sebagai Progressive Web App (PWA) dan memberi akses offline terbatas ke application shell, artikel yang sudah disetujui, dan audio yang dipilih pengguna.

The visual design is fixed: the supplied collage is the master reference. The product experience follows that reference closely while preserving accessibility and safety.

## 2. Outcomes and hypotheses

- **User outcome 1:** Ibu menemukan informasi yang relevan dengan status hamil trimester III vs persalinan tanpa kebingungan.
- **User outcome 2:** Ibu dapat mendengarkan pilihan audio tanpa autoplay dan berhenti kapan saja.
- **User outcome 3:** Ibu bisa memahami kenyamanan dan kecemasannya *secara subjektif* tanpa diberi diagnosis atau klaim hasil klinis.
- **Academic outcome:** Mahasiswa mendemonstrasikan inovasi edukasi, navigasi, audio, asesmen subjektif sederhana, dan transparansi sumber.
- **Research caveat:** Tanpa desain studi dan instrumen tervalidasi, perubahan skala pre/post **bukan bukti efikasi klinis**.

## 3. Audiences and situations

| Audience | Primary need | Context / guardrail |
|---|---|---|
| Ibu hamil trimester III | Panduan edukasi yang tenang & jelas | Tidak mengasumsikan semua aktivitas aman untuk semua kondisi kehamilan |
| Ibu bersalin | Pendamping kenyamanan dan audio | Tidak mengganggu arahan petugas, tidak mengajarkan penanganan persalinan mandiri |
| Pendamping/keluarga | Mengenali opsi dukungan nonklinis | Pijat/kompres dibatasi dan dianjurkan mengikuti arahan tenaga kesehatan |
| Mahasiswa/pemilik konten | Menunjukkan isi tugas dan sumber | Persetujuan materi oleh dosen/bidan sebelum panduan klinis ditayangkan |

## 4. Information architecture

Top-level 6 menu yang disetujui: `Beranda` • `Jenis Terapi` • `Panduan Ibu Hamil` • `Panduan Bersalin` • `Relaksasi` • `Evaluasi`.

8 visual states dalam screenshot: 6 destination screens + Audio Player immersive + Menu overlay. `Tanda Bahaya`, `Sumber Referensi`, `Tentang`, `FAQ`, dan artikel detail adalah halaman/fitur tambahan di bawah IA, bukan 5 tab baru.

### Routes (stable URL)

```
/                         Beranda
/terapi                   Daftar jenis terapi
/terapi/:slug             Detail terapi + sumber + batasan
/panduan/hamil            Panduan ibu hamil trimester III
/panduan/bersalin         Panduan ibu bersalin
/relaksasi                Katalog audio relaksasi
/relaksasi/:slug          Audio player immersive
/evaluasi                 Evaluasi kenyamanan (demo)
/tanda-bahaya             Informasi kapan mencari pertolongan
/sumber                   Daftar referensi akademik/medis
/tentang                  Tentang website
/faq                      Pertanyaan umum
```

## 5. Scope and prioritized requirements

**Priorities:** P0 = MVP wajib; P1 = setelah baseline stabil; P2 = opsional masa depan.

| ID | Pri | Requirement | Acceptance criteria |
|---|---|---|---|
| UI-01 | P0 | Homepage matches approved mobile ref | At 390px visual QA approved; photo, serif hero, two CTA, three-value row, 6-tab nav appear in correct order |
| UI-02 | P0 | Faithful 8-screen UI | Screens 01–08 each compared to its cropped reference and deviations documented |
| NAV-01 | P0 | Bottom nav with six destinations | active indicator, correct routes, keyboard labels, no clipped labels at 375px |
| NAV-02 | P0 | Full-screen editorial menu | overlay opens/closes, focus managed, six entries plus sources/about/FAQ and emergency link |
| TH-01 | P0 | Therapy catalog with filters | four evidence-screened priority therapies, categories accessible; no misleading clinical promise |
| TH-02 | P0 | Therapy detail page | target group, what it is, benefit wording, limitations, contraindication/stop note, sources, review status |
| GUIDE-01 | P0 | Pregnancy and birth guides | distinct pages, distinct context warnings; list rows navigate to detail articles |
| AUDIO-01 | P0 | Relaksasi library | music, nature, narrated candidates displayed; play only when licensed audio file is present |
| AUDIO-02 | P0 | Immersive media player | play/pause/seek/volume, end state, error state; no autoplay; track name matches real source |
| AUDIO-03 | P0 | Timed experience | 15/30/60 min controls only for compatible ambient loops; for shorter guided tracks use actual duration |
| EVAL-01 | P0 | Two labeled 0–10 scales | scores 0–10, distinguish comfort from anxiety; clear anchors; no implied diagnosis |
| EVAL-02 | P0 | Optional pre/post reflection in same session | returns descriptive nonclinical comparison; nothing transmitted or stored persistently |
| SAF-01 | P0 | Tanda Bahaya content and CTA | accessible from menu and relevant therapy articles; clear referral for concerning symptoms |
| CONT-01 | P0 | Provenance / clinical sign-off | medically directive content hidden/restricted until reviewer recorded; cited sources visible |
| PRIV-01 | P0 | Data minimization | no names, phone, medical identifiers, account or cloud storage; in-memory only in MVP |
| RESP-01 | P0 | Mobile / desktop functional responsive | passes 360, 375, 390, 430 widths; desktop does not impersonate a stretched phone |
| A11Y-01 | P0 | WCAG-oriented accessibility | semantic headings/links/buttons, keyboard use, adequate contrast, labels, reduced motion |
| PWA-01 | P0 | Installable Progressive Web App | HTTPS, valid Web App Manifest and service worker; Android install flow where supported; iOS Add to Home Screen guidance; normal website remains usable without installation |
| PWA-02 | P0 | Offline application shell and approved articles | Workbox serves the cached shell and only published, clinically approved article versions offline; visible cached/last-checked status and stale-content behavior |
| PWA-03 | P0 | User-selected offline audio | Only explicitly downloaded, licensed tracks are cached; per-file and total-cache limits, expiry, removal controls, and offline seek behavior are defined |
| PWA-04 | P0 | Safe application/content updates | service-worker updates do not unexpectedly interrupt a session; content version/revocation checks invalidate superseded clinical material when online |
| PWA-05 | P0 | Bounded, best-effort storage | enforce application cache budgets, handle quota errors and browser eviction, and provide storage management; do not promise permanent offline storage |
| SEO-01 | P1 | Article metadata, Open Graph, sitemap | index only approved public content; drafts nonindexable |
| ADMIN-01 | P2 | Content CMS / admin | not needed for coursework MVP; do not introduce auth + db without explicit scope |
| STUDY-01 | P2 | Research-grade evaluation/data export | requires ethics, privacy, validated instruments, consent, clinical review, explicit new PRD |

## 6. Core journeys

**Journey A — pregnant user:** Open Beranda → Jelajahi Terapi → filter `Hamil` → choose article → read safety note and sources → optionally open Relaksasi → play nature audio → optional subjective evaluation.

**Journey B — in labor:** Open Beranda → `Panduan Bersalin` → read support guide → use approved low-risk audio if desired, staying available to care team → stop at any time. If concerning symptom → Tanda Bahaya/contact health professional.

**Journey C — audio:** `Relaksasi` → filter `Suara Alam` → choose track → immersive player → playback controls → return while preserving navigation. If file missing, show 'Audio belum tersedia', not a fake play interaction.

**Journey D — evaluation:** Open `Evaluasi` → choose comfort and anxiety 0–10 with explanatory labels → optional repeat after an audio session → show nonclinical descriptive reflection. No retention across site reload unless user explicitly asks later.

## 7. Content plan (source draft ≠ approved clinical copy)

| Article ID | Editorial topic | Initial state |
|---|---|---|
| T01 | Bernapas Nyaman, Mengurangi Ketegangan | Draft; needs clinical review |
| T02 | Pilih Musik yang Membuat Ibu Nyaman | Draft; needs clinical review |
| T03 | Melepas Ketegangan dengan Relaksasi Otot Ringan | Draft; needs clinical review |
| T04 | Pijat Pendamping yang Mengutamakan Kenyamanan Ibu | Draft; needs clinical review |
| S01 | Kenali Tanda Bahaya Kehamilan dan Persalinan | Draft; needs clinical review |
| A01–A03 | Indonesian relaxation narration scripts | Draft; needs clinical review before recording |

Source of editorial draft: `../reference/MATERI-DRAF-v0.2.md`; **not an authoritative protocol**. Formal bibliography stored per article with URLs, accessed dates, key claim mapping, reviewer, approval state.

## 8. Audio product and licensing

- Desired groups: instrumental, rainfall, ocean, forest/nature, calming breathing narration, affirmations/meditation narration.
- Audio must be separately sourced/recorded, licensed and checked. Do not embed ripped Youtube streams or unverified assets.
- License manifest includes author, attribution, source, license/version, asset ID, and whether distribution in deployed website is permitted.
- Guided breathing narration requires review of exact spoken words; scripts must not include forced breath holds or directions that override midwife guidance.
- Provide transcript for narrated audio and understandable fallback when audio cannot play.

## 8.1 Progressive Web App and offline behavior

- Build the PWA with `vite-plugin-pwa`, a Web App Manifest, and Workbox. The manifest must provide a stable app identity, name/short name, `start_url`, root `scope`, `display: standalone`, theme/background metadata mapped from the existing design tokens, and correctly sized standard and maskable icons. iOS-specific home-screen icon metadata must also be supplied.
- The PWA is an installable delivery form of the existing website. Do not change the approved mobile composition, palette, six-tab information architecture, or any screen to resemble native operating-system chrome. Do not add a dashboard or a mandatory install interstitial. Android may use the browser's native install affordance when available; on iOS, provide concise instructions for the user's browser Share menu / Add to Home Screen flow when requested. Installation availability and presentation depend on browser and OS version.
- Offline support is progressive enhancement. Direct navigation and all core pages remain usable online if service workers, installation, or offline storage are unavailable.
- Precache only the versioned application shell and small essential assets. Do not precache audio libraries or every article. Draft, in-review, evaluation, and user-entered data must never enter Workbox caches.
- Cache only published, clinically approved article revisions. Online requests prefer fresh content and may fall back to the last cached approved revision offline. Show that the page is cached and when it was last checked. Cached clinical instructions older than **7 days since last successful verification** must be marked stale and withheld; show a short offline notice directing users to reconnect or contact their care team for current advice. This is not emergency triage.
- Maintain a same-origin content manifest containing content version, article revision, SHA-256 hash, approval status, publication/update time, and withdrawn/superseded article IDs. Check it when online at app start and when the app returns to the foreground. Verify the fetched revision against its manifest hash. On receiving a newer manifest, replace old revisions and delete withdrawn article entries before rendering their instructions. Offline clients cannot learn about a newly withdrawn item; show the last-check time and never imply that offline medical content is current.
- Audio is cached only after an explicit user action to download for offline use. Limit each file to **20 MiB**, at most **3 tracks**, and **50 MiB total audio cache**. Expire cached tracks after **30 days** and provide a remove action; an app-level download timestamp check must hide expired downloads even if browser cache cleanup is delayed. If adding a file would exceed a limit, explain the limit and let the user remove an existing download; do not silently evict a user-selected track. The service worker must cache the complete response before marking a track available offline and correctly handle byte-range playback/seek from that cached response.
- Browser storage is best-effort and quotas/eviction vary by platform. Check estimated usage when available, catch quota failures, and explain that downloads may be removed by the browser or the user. Offline availability is not guaranteed. Do not cache questionnaire values, evaluation results, names, or other personal data.
- New app-shell versions should use a user-visible update prompt with “Perbarui” and “Nanti” actions. Do not force a reload while a user is listening to audio or interacting with a form. A clinical-content correction is a separate content-manifest update and must not wait for a new visual redesign. An online client must apply withdrawal/replacement metadata before presenting affected instructions.

## 9. Privacy, safety and release governance

- **Health-related sliders are sensitive context** even without identity. MVP processes transiently in-browser, no server API or cookies for assessment, no individual analytics.
- No clinical diagnosis, triage algorithm, personalized therapeutic plan, or claim that therapy is safe for every pregnancy.
- Maternal clinical material must be reviewed and signed off by a qualified midwife/lecturer before public instruction; deploy may ship a visibly labeled *educational preview* with draft article instructions disabled, but not present drafts as final medical advice.
- Tanda Bahaya page emphasizes real medical assistance, not finishing the website experience.
- Avoid labels 'Tervalidasi', 'Aman bagi semua', 'Pasti mengurangi nyeri' until genuinely appropriate (often never for universal claims).

## 10. Non-functional requirements

- Mobile-first, intuitive load under ordinary 4G; images optimized and lazy-loaded except critical hero; robust on Android Chrome and iPhone Safari.
- WCAG 2.2 AA target and semantics; focus indicator, zoom, safe-area navigation, enough bottom padding, no autoplay.
- No broken links; no fake audio; fallback for missing images/failed streams.
- Content indexable only when clinically approved; no accidental public repository of unpublished reviewer materials.
- Public web should use HTTPS and security headers. No collection of medical personal data in MVP.

## 11. Scope boundaries / non-goals

Not included: booking midwife consultation, patient registration, medical records, telemedicine, online diagnosis, chatbots giving clinical advice, appointment scheduling, SMS/WhatsApp collection, accounts, staff dashboard, database, clinical decision support, effectiveness research claims, push notifications, or background synchronization.

## 12. Release gates

| Gate | Conditions |
|---|---|
| G0 Visual contract | reference asset + Design System frozen; user signed off |
| G1 Mobile UI | Screen 01 screenshot approval at 390×844; then 02–08 fidelity QA |
| G2 Functional MVP | routes, audio state, filters, slider, menu, mobile navigation tested |
| G3 Content safety | review sign-off for every public instruction/narration; references and safety copy pass |
| G4 Assets & privacy | license manifest clear; no personal tracking; a11y and mobile testing pass |
| G5 Deployment | production HTTPS and smoke tests; client accepts deliverables |
| G6 PWA | manifest and icons validated; installability checked on supported Android and iOS browser/device combinations; offline shell/article/audio behavior, cache limits, eviction/quota failures, update prompt, and clinical-content withdrawal tested |

## 13. Open questions for client (don't block UI scaffolding)

1. Deadline, presentation/demo setting, and expected live-site availability.
2. Exact brand name/logo approval (Ruang Ibu is working title).
3. Which articles and audios can the course lecturer review/approve and by when?
4. Are audio files recorded by the students, or can properly licensed external music be used?
5. Is evaluation a classroom demo only, or does the course request a formal instrument/study? If formal, P2 research scope is a separate project.

## 14. Definition of done

A mobile visitor can navigate all six main sections, access accurately sourced approved educational material, select and control genuine licensed audio without autoplay, optionally use an ephemeral simple reflection form, locate safety information, install the site where the browser supports PWA installation, and use bounded offline access to eligible shell/article/audio content. UI screenshots have been compared and accepted against the approved 8-screen reference. PWA cache, update, install, and failure states are tested; all scope and clinical exceptions are documented.
