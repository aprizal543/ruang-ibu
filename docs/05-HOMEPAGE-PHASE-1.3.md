# RUANG IBU — PHASE 1.3: HOMEPAGE CONTENT EXPANSION

**Status:** implementation brief, **not** confirmation of implementation.  
**Approved foundation:** Phase 1.2 homepage first viewport.  
**Scope:** expand `/` with editorial sections below the existing hero; do not implement other screens.

## 1. Source of truth and hierarchy

1. `reference/MASTER-mobile-approved.png`, `reference/screens/01-beranda.png` — visual language of the approved *first viewport*.
2. Actual approved Phase 1.2 screenshots at `tmp/fidelity/home-phase1.2-{390x844,375x812,430x932}.png` — implementation baseline; keep first viewport unchanged.
3. `AGENTS.md`, `docs/01-DESIGN-SYSTEM.md`, `docs/02-PRD.md` (including v1.1 PWA amendments), `docs/03-ARCHITECTURE.md`, `docs/Fidelity-QA.md`.
4. `docs/Clinical-Review-Log.md`, `assets/ASSET-LICENSE-MANIFEST.md` — approval and asset provenance constraints.
5. `reference/MATERI-DRAF-v0.2.md` — editorial draft only; not a clinical authorization.

The approved hero, its photography, single brand lockup, four-line heading, copy, CTA positions, segmented benefit strip, Phosphor icon choices (including Headphones), and fixed six-tab bottom navigation are **frozen**. Only add new content **after** the approved benefit strip and before any footer. Do not modify the first viewport to fit more content.

## 2. Editorial content and structure

### Section 00 — Approved hero (DO NOT MODIFY)

Keep exactly as Phase 1.2. No extra announcement banner, chips, statistics, or additional hero CTA.

### Section 01 — Kenali Ruang Ibu

**Eyebrow:** `TENTANG RUANG IBU`  
**Heading:** `Tempat belajar, memahami, dan menemukan ketenangan.`  
**Body (approved for prototype as general product description):** `Ruang Ibu menghadirkan informasi seputar pilihan terapi komplementer, panduan edukasi untuk trimester III dan persalinan, serta koleksi audio relaksasi. Temukan topik yang sesuai kebutuhan Ibu, dengan bahasa yang sederhana dan sumber yang dapat ditelusuri.`  
**Small note:** `Informasi di Ruang Ibu bersifat edukasi dan tidak menggantikan pemeriksaan atau arahan bidan dan dokter.`  
**Link:** `Tentang Ruang Ibu` → `/tentang` (existing route fallback acceptable until that page is implemented).

**Layout:** generous warm-paper whitespace, editorial type and understated divider or typographic accent; no icon card row or dashboard stats.

### Section 02 — Panduan untuk setiap perjalanan Ibu

**Heading:** `Setiap tahap, punya cerita dan kebutuhan sendiri.`  
**Intro:** `Pilih informasi sesuai fase yang sedang Ibu jalani.`  
**Two editorial choices:**

- `Menjelang Persalinan` / `Panduan Ibu Hamil Trimester III` — `Mengenal pilihan relaksasi dan informasi pendukung kenyamanan menjelang persalinan.` → `/panduan/hamil`.
- `Saat Persalinan` / `Panduan Ibu Bersalin` — `Informasi dukungan kenyamanan yang tetap mengikuti arahan bidan dan tim kesehatan.` → `/panduan/bersalin`.

**Layout:** two alternating text-forward editorial blocks, minimal frames and clear links. May use photography **only if** a verified licensed asset already exists; otherwise typography, restrained botanical CSS or whitespace, never source an unlicensed image or use reference screenshot crops.

### Section 03 — Pilihan terapi komplementer

**Eyebrow:** `JELAJAHI TOPIK`  
**Heading:** `Kenali pilihan yang terasa sesuai untuk Ibu.`  
**Intro:** `Empat topik edukasi yang sedang disiapkan untuk membantu Ibu memahami berbagai pendekatan pendukung kenyamanan.`

**Rows (not assertive benefit cards):**

1. `Teknik Pernapasan` — `Mengenal perhatian pada napas dan relaksasi.` → `/terapi/pernapasan-dan-relaksasi`
2. `Terapi Musik` — `Mengenal musik dan suara yang terasa menenangkan.` → `/terapi/musik-relaksasi`
3. `Relaksasi Otot Ringan` — `Mengenal cara memperhatikan dan melepas ketegangan.` → `/terapi/relaksasi-otot-ringan`
4. `Pijat Pendamping` — `Mengenal dukungan sentuhan yang mengutamakan persetujuan dan kenyamanan ibu.` → `/terapi/pijat-pendamping-persalinan`

**Visible status:** `Materi dalam peninjauan` (one status for the section is fine; do not imply each topic was approved).  
**Link:** `Lihat semua terapi` → `/terapi`.

**Layout:** numbered compact editorial list with fine rules, not four identical floating pill cards. Avoid clinical how-to instructions in preview. If routes are not implemented, use existing honest fallback; don't expose draft article content as final guidance.

### Section 04 — Ruang tenang untuk Ibu

**Heading:** `Saat ingin berhenti sejenak.`  
**Body:** `Ruang Ibu dirancang untuk menghadirkan pilihan musik, suara alam, dan narasi relaksasi. Ibu dapat memilih suara yang disukai dan menghentikannya kapan saja.`  
**Label:** `Koleksi audio sedang disiapkan` until a specific track has completed license and content review.  
**Link:** `Jelajahi Relaksasi` → `/relaksasi`.

**Layout:** one atmospheric editorial band featuring type, pale warm contrast and restrained soundwave motif. **Do not fabricate a playback button or a real track.** No autoplay. Only use imagery if independently licensed. Icons should use the approved Phosphor icon language.

### Section 05 — Evaluasi kenyamanan

**Heading:** `Bagaimana perasaan Ibu saat ini?`  
**Body:** `Di halaman Evaluasi, Ibu dapat mencatat tingkat kenyamanan dan rasa cemas secara sederhana. Hasilnya untuk refleksi pribadi, bukan diagnosis atau pengukuran efektivitas terapi.`  
**Link:** `Mulai Evaluasi` → `/evaluasi`.

**Layout:** typographic section and one main button/link, no fake scores, gauges, charts, testimonials or aggregate user data. Existing route fallback is acceptable until Screen 07 is implemented.

### Section 06 — Keselamatan, sumber, dan footer

**Heading:** `Kenyamanan penting. Keselamatan tetap utama.`  
**Body:** `Terapi komplementer merupakan informasi pendamping dan tidak menggantikan pemeriksaan ataupun perawatan medis. Bila Ibu mengalami gejala yang mengkhawatirkan, segera hubungi bidan, dokter, atau fasilitas kesehatan terdekat.`  
**Links:** `Kenali tanda bahaya` → `/tanda-bahaya`, `Lihat sumber informasi` → `/sumber`, and optionally `Tentang` → `/tentang`.

**Footnote / label:** `Materi panduan klinis sedang melalui proses peninjauan.` Do not claim validation or invent reviewer names.

**Layout:** accessible warm coral caution accent, no excessive alarm imagery; finish with simple copyright/product label (do not invent an institution, reviewer, or year of establishment). Ensure footer content remains accessible above fixed navigation.

## 3. Visual implementation contract

- **Mobile-first editorial rhythm:** vary section compositions with whitespace, typographic hierarchy, subtle borders and at most two photography-led sections if licensed assets are present. Not a stack of rounded cards and icons.
- Maintain existing approved palette and Fraunces/DM Sans settings; reuse existing CSS tokens and components; do not create new decorative gradients or change base background globally.
- All added sections must naturally scroll beneath an unchanged header/hero. Fixed bottom nav remains visible; provide scroll padding/padding-bottom for nav and safe-area.
- Avoid presenting the approved Phase 1.2 screenshot as an image of the UI. The HTML/CSS must remain semantic and selectable.
- Navigation links use the documented routes and fallback behavior; no dead buttons or fabricated features.
- Responsive: 375×812, 390×844, 430×932; also test 360px width and 200% browser text zoom if possible.
- Accessibility: logical H1→H2→H3, 16px-ish body text as practicable, contrast and keyboard focus, accessible link labels, reduced motion. No horizontal overflow.
- PWA: do **not** introduce new caching, offline article behavior, or medical content caching in this phase. Retain v1.1 PWA constraints.
- New content must not change first-screen layout or create layout shift when scrolling. Prefer CSS details instead of requiring unapproved visual assets.

## 4. Implementation order

1. Read docs and all current homepage components/styles. Record Git status and current approved baseline screens.
2. Implement the six new sections below the current first viewport as composable sections; use existing token/component system, no unnecessary dependencies or backend.
3. Verify routes navigate to appropriate existing fallback; do not accidentally open drafts as approved articles.
4. Render and compare first viewport *before vs after* at all three approved sizes; first viewport must remain effectively visually unchanged (except antialiasing/platform-render differences).
5. Capture full-page screenshots at all three sizes and inspect complete reading flow, final footer visibility and fixed nav overlap.
6. Test keyboard focus, link destinations, 360px width, overflow, typecheck and build.
7. Update `docs/Fidelity-QA.md` documenting first-screen invariance, full-homepage evidence, issues, unapproved content and asset usage.
8. Stop. **No pages 02–08 and no official claims of clinical sign-off.** Await explicit user visual approval.

## 5. Release and review gate

Phase 1.3 is `READY FOR USER VISUAL REVIEW` only when:

- approved Phase 1.2 first viewport remains unchanged;
- all six new sections render with coherent editorial rhythm and live/fallback navigation;
- no placeholder audio playback or medical effectiveness promises;
- any new image has verified licensing in manifest;
- mobile screenshots, full-page evidence, typecheck/build and QA notes are produced;
- user explicitly reviews and approves the output. This file is an implementation specification, not approval.
