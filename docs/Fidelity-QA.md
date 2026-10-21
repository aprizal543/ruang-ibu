# Ruang Ibu — Fidelity QA

**Date:** 21 October 2026  
**Scope:** Screen 01 — Beranda, Phase 1.3 content expansion and Phase 1.4 editorial polish  
**Status:** **APPROVED VISUAL BASELINE v1.0** — Beranda Phase 1.4 approved by the user.

## Visual references

- `reference/MASTER-mobile-approved.png`
- `reference/screens/01-beranda.png`
- Phase 1.1 captures in `tmp/fidelity/`

The approved mobile images remain the visual source of truth. Comparisons exclude the iPhone frame and operating-system chrome. The hero continues to use `assets/images/hero/pexels-hero-mobile.webp`; the reference photo is not used as a production asset.

## Before and after captures

| Viewport | Before (Phase 1.1) | After (Phase 1.2) |
|---|---|---|
| 390 × 844 | [`home-phase1.1-390x844.png`](../tmp/fidelity/home-phase1.1-390x844.png) | [`home-phase1.2-390x844.png`](../tmp/fidelity/home-phase1.2-390x844.png) |
| 375 × 812 | [`home-phase1.1-375x812.png`](../tmp/fidelity/home-phase1.1-375x812.png) | [`home-phase1.2-375x812.png`](../tmp/fidelity/home-phase1.2-375x812.png) |
| 430 × 932 | [`home-phase1.1-430x932.png`](../tmp/fidelity/home-phase1.1-430x932.png) | [`home-phase1.2-430x932.png`](../tmp/fidelity/home-phase1.2-430x932.png) |

The captures are webpage viewports without mock-device chrome. `tmp/` is excluded from Git by `.gitignore`.

## Phase 1.2 baseline changes and comparison

| Area | Result |
|---|---|
| Bottom navigation | Replaced only the Relaksasi leaf glyph with `HeadphonesIcon` from `@phosphor-icons/react` 2.1.10. The installed package declaration exports `HeadphonesIcon` from `dist/csr/Headphones.d.ts`. Its rendered size is 23 px; inactive tabs use `light` weight and secondary gray, while the active tab uses `fill`, forest green, and the existing emphasized label. The label remains “Relaksasi”. |
| Other navigation icons | Preserved Phosphor `HouseIcon`, `HandHeartIcon`, `UsersThreeIcon`, and `ClipboardTextIcon`. Hamil retains its custom pregnancy silhouette because a clear maternity glyph is not available in the selected library; Bersalin retains `UsersThreeIcon`. The custom SVG uses a 1.7 px light stroke at the 23 px tab size and remains visually aligned with the Phosphor glyphs. No emoji or new brand mark was added. |
| Header and hero | Kept one Ruang Ibu wordmark in the header and the original disabled menu control. Kept the approved Pexels WebP unchanged. `object-position: 35% 41%` places the face and abdomen on the right while preserving negative space for the headline. Four explicit headline lines remain stable at all target widths. |
| Body copy | Updated exactly to: “Kenali berbagai terapi komplementer untuk mendukung kenyamanan ibu selama kehamilan trimester III dan persalinan.” At 375, 390, and 430 px it wraps to four readable lines without horizontal overflow. |
| CTAs | Kept “Jelajahi Terapi” and “Dengarkan Relaksasi”, their established green/peach styling, order, and Phosphor arrow/play glyphs. Both remain 46 px high and vertically stacked. |
| Benefit strip | Kept one shared rounded surface and all three existing labels. Added subtle internal separators between the three segments; icons, circles, color, and typographic hierarchy are unchanged. The panel remains 148 px high in all target captures. |
| Vertical composition | Changed the main region to a flexible grid with a minimum hero height and the benefit panel in the second row. This uses normal flow, keeps the benefit-to-navigation gap to 16 px across all three target viewports, and avoids absolute-positioning the content. At 430 px the taller hero uses the photo/fade area to occupy the extra height. |
| Navigation geometry | Six labels remain visible at 375 px. Each tab keeps a minimum 58 px control height; the six-column grid fits the target widths. Active state remains indicated by icon fill, forest color, and label weight. |

## Visual QA evidence

- Agent Browser captured the final page at **390 × 844**, **375 × 812**, and **430 × 932**.
- At all three sizes `documentElement.scrollWidth` equals the viewport width; no horizontal overflow was observed.
- The headline exposes four lines; the exact updated body copy and all three benefit labels are present; the accessibility snapshot exposes one named header link, two named CTA links, and six named navigation links.
- Benefit panel bottom / fixed navigation top measured **720 / 736 px** at 375 × 812 and **840 / 856 px** at 430 × 932. At 390 × 844 the visual capture shows the same 16 px gap.
- At a deliberately short **375 × 600** viewport the document height becomes 748 px and Agent Browser scrolled to `scrollY: 148`; content remains reachable by scrolling.
- The Relaksasi navigation SVG renders at 23 × 23 px with the Phosphor headphones silhouette. Package declaration confirms the named export.
- The six navigation touch targets retain at least 58 px height. Header control is 44 × 44 px; the two CTA links are 46 px high.

## Remaining differences and limits

- The official Pexels photo differs from the woman/photo used in the approved mockup, as expected. The required source image remains unchanged; its right-side flowers/table are visible, with the face and abdomen readable.
- The longer Phase 1.2 body copy now occupies four lines and pushes the CTA stack lower than the Phase 1.1 copy. This is the requested text and remains legible at 375 px.
- On 430 × 932, the expanded hero leaves a larger visual interval between the CTA stack and benefit panel than on the shorter viewports; it is occupied by the continuation/fade of the hero photograph and preserves the 16 px benefit-to-nav gap.
- The menu control is still disabled and non-home destinations remain outside this refinement scope. No other pages, backend, PWA architecture, or medical content were changed.
- The asset manifest still notes that the individual model release has not been verified. No efficacy or clinical-validation claims were added.
- Small-screen zoom/text-scaling and assistive-technology review were not part of this visual screenshot pass.

## Verification

- `npm.cmd run typecheck` — passed (`tsc -b --pretty`, exit code 0).
- `npm.cmd run build` — passed (`tsc -b && vite build`, exit code 0); Vite produced the production assets and PWA injectManifest service worker with 11 precache entries (481.74 KiB).
- Agent Browser — completed captures and responsive checks listed above.

Only Screen 01 was refined. User approval is still required before any other screen work.

## Phase 1.3 — Homepage content expansion

### Captures

| Viewport | Phase 1.2 first viewport (before) | Phase 1.3 first viewport (after) | Phase 1.3 full page |
|---|---|---|---|
| 390 × 844 | [`home-phase1.2-390x844.png`](../tmp/fidelity/home-phase1.2-390x844.png) | [`home-phase1.3-first-390x844.png`](../tmp/fidelity/home-phase1.3-first-390x844.png) | [`home-phase1.3-full-390x844.png`](../tmp/fidelity/home-phase1.3-full-390x844.png) |
| 375 × 812 | [`home-phase1.2-375x812.png`](../tmp/fidelity/home-phase1.2-375x812.png) | [`home-phase1.3-first-375x812.png`](../tmp/fidelity/home-phase1.3-first-375x812.png) | [`home-phase1.3-full-375x812.png`](../tmp/fidelity/home-phase1.3-full-375x812.png) |
| 430 × 932 | [`home-phase1.2-430x932.png`](../tmp/fidelity/home-phase1.2-430x932.png) | [`home-phase1.3-first-430x932.png`](../tmp/fidelity/home-phase1.3-first-430x932.png) | [`home-phase1.3-full-430x932.png`](../tmp/fidelity/home-phase1.3-full-430x932.png) |

The six screenshots were taken with Agent Browser. Chromium's classic scrollbar is hidden only in the browser session (`scrollbar-width: none`) so its viewport matches mobile overlay-scrollbar width; no scrollbar rule was added to the product CSS. Full-page capture shows the fixed navigation at its actual viewport position; the page was also scrolled in-browser to verify footer clearance.

### Implementation and visual comparison

- Added the six Phase 1.3 sections after the complete Phase 1.2 first screen: About, two journey guide entries, numbered therapy topics, the audio preparation band, evaluation reflection, and safety/source footer.
- Reused a semantic `EditorialSection` component and React Router links. Existing unknown routes continue to use the honest “Halaman ini sedang disiapkan” fallback.
- Kept the hero, benefits strip, wordmark/header, photo, copy, CTA, iconography, palette, typography and bottom navigation unchanged. First-viewport screenshots at 390 × 844, 375 × 812 and 430 × 932 were compared against their Phase 1.2 screenshots; hero crop, heading lines, CTA positions, benefits and navigation remain visually unchanged.
- New sections use the existing Fraunces / DM Sans and token palette, generous section spacing, understated rules, two offset text-led guide entries, a fine-ruled numbered topic list, and one pale audio band. No image or non-Phosphor UI icon was added.
- The fixed six-tab navigation remained visible during scrolling. At 390 × 844, after scrolling to the document end, the footer brand label ended at 711.5 px and the navigation began at 768 px, leaving 56.5 px of visible clearance.

### Scope, content safety, and Anti UI Slop review

- Therapy material is explicitly labeled **“Materi dalam peninjauan”**; the footer also says clinical guides are under review. No clinical efficacy/validation claims, testimonials, statistics, practice instructions, or invented reviewer details were added.
- The relaxation band says the collection is being prepared and contains no fake playback control, track, or audio element. No new photo was added, so the asset manifest did not require new entries.
- Anti UI Slop review: no KPI/dashboard patterns, generic feature-card grid, decorative imagery, extra palette, or repeated floating cards. The content uses a typographic hierarchy, numbered editorial list, and restrained dividers tied to the reading flow.

### Browser and technical QA

- Agent Browser verified all target widths. `scrollWidth` matched each viewport: **360**, **375**, **390**, and **430** px. The full-page documents measured 4291 px at 360 × 800, 4229 px at 375 × 812, 4250 px at 390 × 844, and 4187 px at 430 × 932.
- At 360 × 800, the page has no horizontal overflow and contains no `<audio>` or `<video>` element.
- The keyboard Tab order begins with the visible-on-focus “Lewati ke konten” skip link. The accessibility snapshot reports one H1, ordered H2/H3 section headings, named links, the secondary safety/source navigation, and the unchanged six-tab navigation.
- Direct navigation to `/terapi/pernapasan-dan-relaksasi` displays the existing not-built fallback. All other Phase 1.3 hrefs match their documented destinations.
- `npm.cmd run typecheck` — passed.
- `npm.cmd run build` — passed; Vite and the existing PWA `injectManifest` build completed without changing PWA configuration or service-worker behavior.

### Remaining differences

- The approved Phase 1.2 hero photo remains the selected Pexels asset and differs from the photo embedded in the reference mockup. It was not changed or reused elsewhere.
- Phase 1.3 sections are specified by the written editorial brief rather than a separate approved section-by-section screenshot. Their final spacing and typography still need user review.
- Clinical review log remains unfilled; the section copy is an educational prototype only and does not grant approval to publish directive clinical content.

Phase 1.3 did not change screens 02–08, backend, database, authentication, evaluation behavior, or PWA architecture. Phase 1.4 only refined homepage editorial sections; the approved hero and other screens remain untouched.

## Phase 1.4 — Homepage editorial polish

### Captures

| Viewport | First viewport | Mid-page (390 only) | Footer (390 only) | Full page |
|---|---|---|---|---|
| 390 × 844 | [First viewport](evidence/approved-homepage-v1.0/home-phase1.4-first-390x844.png) | [Mid-page](evidence/approved-homepage-v1.0/home-phase1.4-middle-390x844.png) | [Footer](evidence/approved-homepage-v1.0/home-phase1.4-footer-390x844.png) | [Full page](evidence/approved-homepage-v1.0/home-phase1.4-full-390x844.png) |
| 375 × 812 | [First viewport](evidence/approved-homepage-v1.0/home-phase1.4-first-375x812.png) | — | — | [Full page](evidence/approved-homepage-v1.0/home-phase1.4-full-375x812.png) |
| 430 × 932 | [First viewport](evidence/approved-homepage-v1.0/home-phase1.4-first-430x932.png) | — | — | [Full page](evidence/approved-homepage-v1.0/home-phase1.4-full-430x932.png) |

Agent Browser screenshots use the listed viewport sizes. The browser-only scrollbar setting hides Chromium's classic scrollbar to preserve the emulated mobile content width; no scrollbar styling was added to the application. Full-page capture places the fixed bottom navigation at its viewport position during capture, so the separately scrolled footer screenshot shows its true end-of-page position.

### Section refinements

- **Kenali Ruang Ibu:** slightly shorter entry spacing opens the new content flow after the approved first screen; existing note and link remain unchanged.
- **Panduan Ibu Hamil dan Bersalin:** the phase labels have clearer typographic treatment. A restrained inset line and smaller offset on the second entry distinguish the birth context without cards or copy/route changes.
- **Pilihan Terapi Komplementer:** kept the fine-ruled numbered list; refined the status/list spacing and kept each row link target at least 44 px high.
- **Ruang Tenang:** changed the rounded inset panel into a full-width warm ivory editorial band with top/bottom rules and a quiet wave mark. The preparing status and link remain; there is no player or audio element.
- **Evaluasi Kenyamanan:** promoted “Mulai Evaluasi” to a forest-green pill while retaining the subjective-reflection copy and existing fallback route.
- **Keselamatan and footer:** adjusted caution panel heading scale, reading padding, and left accent; separated review status and improved link affordance. Copy and clinical-review status are unchanged.

### First-screen invariance

Compared Phase 1.4 first-viewport captures against Phase 1.2 at all three target sizes. Header and wordmark, photo/crop, four-line headline, body copy, CTA stack, benefit strip, and six-tab navigation show no material visual change. Phase 1.4 CSS additions are scoped to editorial content below `.home-first-screen`; hero source asset is unchanged.

### Browser and technical QA

- Agent Browser confirmed `scrollWidth` equals viewport width at **375**, **390**, and **430 px**. No horizontal overflow was observed.
- At document end, the copyright line bottom / fixed-navigation top measured **679.8 / 736 px** at 375 × 812, **711.5 / 768 px** at 390 × 844, and **800.4 / 856 px** at 430 × 932. The footer remains readable with about 56 px clearance above navigation.
- Keyboard sequence begins with visible-on-focus **“Lewati ke konten”**, then the Ruang Ibu home link. The accessibility snapshot retains the heading hierarchy, descriptive section links, safety/source navigation, and all six bottom tabs.
- Navigation hrefs match the existing route map. Direct navigation to `/evaluasi` displays the existing **“Halaman ini sedang disiapkan”** fallback and return-to-home link.
- **Typecheck:** `npm.cmd run typecheck` — passed.
- **Production build:** `npm.cmd run build` — passed; Vite and the existing PWA `injectManifest` build completed.

### Anti UI Slop review and remaining differences

- The new rhythm uses a two-entry editorial guide, numbered text list, one full-width audio information band, one clear evaluation CTA, and one safety notice. No dashboard cards, fake statistics/testimonials, decorative imagery, new colors/fonts, or fake playback were added.
- The approved reference's model/photo still differs from the required Pexels hero asset, which remains unchanged and does not exactly reproduce the reference photograph.
- Phase 1.4 visual review has been approved; this record and the screenshots in `docs/evidence/approved-homepage-v1.0/` freeze the homepage visual baseline. No automated contrast-scanner run was performed; keyboard focus order, semantic snapshot, mobile overflow, and nav clearance were checked in Agent Browser.
- Full-page screenshots cannot represent fixed navigation as if it were attached to the document end. Use the dedicated footer screenshot for the actual scrolled state.
- Clinical material remains in review. This polish adds no therapeutic instruction or efficacy/clinical-validation claim.

No screens 02–08, design tokens, hero, photo, PWA architecture, backend, or medical copy were changed. **Status: APPROVED VISUAL BASELINE v1.0.**

## Phase 2 — Jenis Terapi (Screen 02 only)

**Date:** 21 October 2026

**Scope:** New `/terapi` route only; the Phase 1.4 homepage baseline remains frozen.
**Status at Phase 2 initial implementation:** placeholders remained a visual-fidelity blocker; see Phase 2B below for integration and updated QA.

### Browser captures

Initial implementation captures were stored in ignored `tmp/` and are not part of the approved archive. Final Phase 2B screenshots and interaction evidence are archived below.

### Implementation and reference comparison

- Added `/terapi` with a centered-title header, 44 x 44 px back/search controls, editorial introduction, four keyboard-operable category filters, four compact therapy rows, empty state, and the unchanged shared six-tab navigation. `Terapi` is active on this route.
- Reused Phosphor icons verified from the installed package exports: `ArrowLeftIcon`, `MagnifyingGlassIcon`, `XIcon`, `WindIcon`, `MusicNotesIcon`, `FlowerIcon`, `HandHeartIcon`, and `CaretRightIcon`. The shared bottom navigation remains untouched.
- The search filters both title and description and composes with the selected category. Pressing Escape clears and closes search. The back control navigates to history when available and falls back to Beranda for a direct URL.
- `/terapi` links to each detail route; the four not-yet-built detail routes still show the honest existing fallback. The homepage CTA route was exercised and opens `/terapi`.
- The approved homepage screenshot at 390 x 844 was compared to [`home-phase1.4-first-390x844.png`](evidence/approved-homepage-v1.0/home-phase1.4-first-390x844.png). No material homepage difference was found; homepage source, tokens, shared navigation styles, and hero assets were not changed.
- The heading, palette, list density, row geometry, and bottom navigation follow Screen 02's approved visual. Copy in the intro deliberately avoids the reference mockup's unreviewed efficacy/safety wording and states that materials remain in clinical review. Category metadata is accompanied by a note that categories are not safety recommendations.

### Asset and clinical status at initial implementation

- Asset audit found no licensed therapy thumbnails. No screenshot crop or homepage hero image was reused. All four rows therefore use conspicuous temporary tiles marked "Foto disiapkan"; real thumbnails are still required before visual approval.
- Added `public/therapy-botanical.svg`, an original hand-authored vector used only as a restrained botanical accent. Its provenance is recorded in `assets/ASSET-LICENSE-MANIFEST.md`. It is a simpler illustration than the botanical artwork in the reference.
- All four topics and descriptions remain educational prototypes in **peninjauan klinis**. No procedural instructions, efficacy claims, safety guarantees, invented sources, or clinical approval status were added.

### Interaction, accessibility, and technical QA

- Agent Browser verified category behavior: `Hamil` returns 3 topics and `Bersalin` returns 4 based on editorial metadata. The `Hamil` + "musik" combination returns one result; an unmatched query returns the empty state. The visible six-tab bar keeps `Terapi` active.
- The `/terapi` search input is keyboard-operable and has a programmatic label; Escape dismisses it. The first keyboard Tab reaches the visible-on-focus "Lewati ke konten" link. Search clear uses Phosphor `XIcon`; category controls have 44 px minimum height and header controls are 44 x 44 px.
- At 375, 390, and 430 px, document and body scroll widths matched the viewport; no horizontal overflow was found. At 375 x 812 the last row bottom is 732 px and fixed navigation begins at 736 px. At 390 x 844 they are 751.6 and 768 px; at 430 x 932 they are 751.6 and 856 px. The footer status can be reached by scrolling and remains above the fixed navigation at document end.
- Direct navigation to a detail route shows "Halaman ini sedang disiapkan". Opening `/terapi` directly and activating Back safely returns to Beranda. The Beranda "Jelajahi Terapi" link opens the new route.
- `npm.cmd run typecheck` — passed.
- `npm.cmd run build` — passed, including the existing Vite PWA `injectManifest` build.

### Anti UI Slop review and remaining differences at initial implementation

- The page follows the reference's editorial intro, category pills, and compact vertical list. It adds no dashboard/bento patterns, e-commerce controls, statistics, testimonials, fake playback, or decorative external assets.
- The largest remaining difference is the absence of four real, separately licensed therapy photographs. Their placeholders are intentionally explicit and block final visual-fidelity approval.
- The hand-authored botanical accent is vector-flat and does not match the reference's finer botanical illustration. The approved photos embedded in the mockup were not extracted.
- Intro copy and wrapping differ from the screenshot by design because the reference wording contains unreviewed clinical promises. All therapy material remains pending clinical review.

No screens 03–08, PWA architecture, backend, design tokens, homepage source, or homepage design were changed.

## Phase 2B — Therapy asset integration and visual QA

**Date:** 21 October 2026
**Scope:** Selected Pexels photos integrated into the four existing `/terapi` rows; no other screen implemented.
**Status:** **APPROVED VISUAL BASELINE v1.0** for the Screen 02 layout and selected thumbnail appearance. AI provenance and individual model-release evidence remain **UNVERIFIED**; this approval does not change clinical review status.

### Captures

| Viewport | Approved initial list |
|---|---|
| 375 × 812 | [`therapy-375x812.png`](evidence/approved-therapy-v1.0/therapy-375x812.png) |
| 390 × 844 | [`therapy-390x844.png`](evidence/approved-therapy-v1.0/therapy-390x844.png) |
| 430 × 932 | [`therapy-430x932.png`](evidence/approved-therapy-v1.0/therapy-430x932.png) |

Interaction evidence: [Hamil filter](evidence/approved-therapy-v1.0/therapy-filter-hamil-390x844.png), [music search](evidence/approved-therapy-v1.0/therapy-search-music-390x844.png), [combined filter and search](evidence/approved-therapy-v1.0/therapy-filter-search-hamil-music-390x844.png), and [empty search](evidence/approved-therapy-v1.0/therapy-empty-390x844.png). Homepage regression screenshot: [390 × 844](evidence/approved-therapy-v1.0/homepage-regression-390x844.png).

### Asset provenance and visual review

- The four official Pexels source pages and license were checked on 21 October 2026. Original JPEGs are retained under `assets/images/therapy/`; 360 × 340 WebP derivatives are served from `public/images/therapy/`. Source URLs, named photographers, license, available metadata, access date, and review status are recorded in `assets/ASSET-LICENSE-MANIFEST.md`.
- The Pexels license permits website use, subject to its terms. Individual pages identify the photographers and show the selected photos as free to use: [Pavel Danilyuk](https://www.pexels.com/photo/a-pregnant-woman-meditating-7055703/), [Aljona Ovtšinnikova](https://www.pexels.com/photo/steel-luxury-headphones-lying-on-bed-26836541/), [DΛVΞ GΛRCIΛ](https://www.pexels.com/photo/pregnant-woman-relaxing-peacefully-indoors-34318004/), and [Catherine Chechun](https://www.pexels.com/photo/close-up-of-hands-on-pregnant-belly-35711736/). See the [Pexels license](https://www.pexels.com/license/). No page or available metadata establishes AI provenance or individual model-release status; both remain **UNVERIFIED**. These photos are not considered finally approved solely based on license.
- The four images correspond to their topics and work as small mobile crops. **Relaksasi Otot Ringan and Pijat Pendamping photos are general illustrative imagery, not demonstrations of therapy techniques.** Remaining source-to-master differences: breathing photo does not show the subject's face; music photo is cooler and brighter than the warm reference; relaxation is a close-up rather than the reference pose; massage includes a green garment and visible watch. The botanical accent was shifted and reduced so it no longer competes with intro copy.
- The duplicate review-status line below the list was removed to keep the final row clear of fixed navigation; review status remains in the intro. No clinical claims or instructions were added. All therapy materials remain pending clinical review.

### Browser and technical QA

- Agent Browser captured the three listed viewport sizes and verified the initial list, Hamil filter, music search, combined filter/search, empty state, Escape behavior, keyboard entry through the skip link, and active Terapi navigation.
- At 375, 390, and 430 px, document width equals viewport width. The last list row ends at 725.45, 742.63, and 745.67 px respectively; fixed navigation begins at 736, 768, and 856 px. The 375 px page remains scrollable.
- Homepage first viewport was pixel-compared with the approved 390 × 844 baseline: exact match (mean RGB difference 0; no differing pixels).
- `npm.cmd run typecheck` — passed (`tsc -b --pretty`).
- `npm.cmd run build` — passed; Vite and the existing PWA `injectManifest` build completed.

### Approved baseline freeze

- The user approved the Screen 02 visual layout and selected thumbnail appearance. These three screenshots are the permanent v1.0 baseline; the equivalent working captures remain under ignored `tmp/`.
- The selected photos remain marked **UNVERIFIED** for non-AI origin and individual model-release evidence. Pexels source/license records are preserved in the asset manifest. All therapy content remains pending clinical review.
- Screen 02 implementation and evidence are ready for the requested Git checkpoint. No other screen is included in this baseline.
