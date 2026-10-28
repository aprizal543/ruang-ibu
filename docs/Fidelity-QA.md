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

## Phase 2.1 — Detail edukasi Teknik Pernapasan

**Date:** 21 October 2026
**Scope:** `/terapi/teknik-pernapasan` only, using a typed data-driven detail template.
**Status:** **READY FOR USER VISUAL REVIEW**. Clinical material remains a draft; practice instructions are locked and no clinical approval is recorded.

### Source audit and content governance

- The research material is present in `reference/MATERI-DRAF-v0.2.md`, Article T01, with the bibliography at the end of that document. `docs/Clinical-Review-Log.md` still lists T01 as awaiting review; no reviewer, qualification, review date, or approval was found.
- The screen uses a bounded summary adapted from the T01 draft. Source-linked context and evidence point to [WHO intrapartum recommendations](https://www.who.int/publications/i/item/9789241550215), [NICE NG235 recommendations 1.6.3–1.6.6](https://www.nice.org.uk/guidance/ng235/chapter/Recommendations), [Cochrane CD009514](https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour), and the [NHS anxiety-in-pregnancy guidance](https://www.nhs.uk/pregnancy/mental-health-in-pregnancy-and-after-the-birth/anxiety-in-pregnancy/). These references were opened and checked on 21 October 2026. The page summarizes scope and limitations; it does not promise outcomes.
- Metadata is typed and separate from presentation: ID, slug, title, categories, clinical-review state, references, update date, optional approval date, and revision history. T01 is `draft`, with no reviewer or approval date.
- Step-by-step practice content stays locked unless both the guide and the article's clinical-review state are approved. No steps are present in the current article data. Audio availability is represented separately; because no licensed/recorded audio is available, the page shows text only and renders no player.

### Browser screenshots

Agent Browser captured the initial viewport and full page at each requested size. Fixed navigation remains at its viewport position in a full-page capture; the separate footer captures below show the true scrolled state.

| Viewport | First viewport | Full page | Scrolled footer |
|---|---|---|---|
| 375 × 812 | [First](../tmp/fidelity/phase2_1/detail-first-375x812.png) | [Full](../tmp/fidelity/phase2_1/detail-full-375x812.png) | [Footer](../tmp/fidelity/phase2_1/detail-footer-375x812.png) |
| 390 × 844 | [First](../tmp/fidelity/phase2_1/detail-first-390x844.png) | [Full](../tmp/fidelity/phase2_1/detail-full-390x844.png) | [Footer](../tmp/fidelity/phase2_1/detail-footer-390x844.png) |
| 430 × 932 | [First](../tmp/fidelity/phase2_1/detail-first-430x932.png) | [Full](../tmp/fidelity/phase2_1/detail-full-430x932.png) | [Footer](../tmp/fidelity/phase2_1/detail-footer-430x932.png) |

Regression captures: [Homepage 390 × 844](../tmp/fidelity/phase2_1/home-regression-390x844.png) and [Jenis Terapi 390 × 844](../tmp/fidelity/phase2_1/catalog-regression-390x844.png). Both were pixel-compared with their approved baselines: dimensions match and mean RGB difference is 0, with no differing pixels. The browser-only scrollbar setting is not application CSS.

### QA results

- Phase 2.1C supersedes the detail-content assertions with a mother-facing section order and source disclosure; the current [Agent Browser content script](../qa/phase2_1c-content.browser.mjs) checks the revised version.
- The final catalog return link remains above the fixed navigation at all three viewport sizes; the separate footer screenshots show visible space beneath the link.
- Contrast ratios calculated from the rendered design tokens: body ink/paper **13.33:1**, muted/paper **4.99:1**, forest/paper **8.90:1**, safety red/danger background **4.72:1**, and white/forest button **9.75:1**. These meet WCAG AA text contrast; editorial terra/paper is **7.32:1**.
- `npm.cmd run typecheck` — passed. `npm.cmd run build` — passed, including the existing PWA `injectManifest` build.
- Anti UI Slop review: no dashboard cards, bento grid, fabricated metrics, new imagery, or audio controls without audio. The page uses a single-column editorial reading flow with restrained rules and one safety notice.

### Remaining review items

- There is no approved screen crop for a therapy-detail article, so the detail layout follows the approved Design System and Screen 02 header/navigation patterns. The screenshots are ready for visual review, not implied approval.
- T01's sources and summary are traceable, but the clinical wording—including the safety summary—still requires review by a qualified lecturer or health professional. No practice instruction is exposed; audio remains unavailable.
- Full-page capture shows the fixed bottom navigation over the captured viewport area by browser design. Use the dedicated footer capture to judge the actual document end and navigation clearance.

No homepage/catalog visual styling, PWA architecture, backend, other detail page, or clinical-review status was changed. No Git commit was created.

## Phase 2.1A — Editorial refinement: Detail Teknik Pernapasan

**Date:** 21 October 2026
**Scope:** Editorial presentation and citation display for `/terapi/teknik-pernapasan`; no changes to the approved Beranda or catalog.
**Status:** **READY FOR VISUAL REVIEW**. T01 remains a draft, and its practice guide remains locked.

### UX and copy changes

- The detail header now reads **Detail Terapi**. H1 and both audience categories are unchanged.
- Added a short, source-linked **Sekilas** summary and a compact two-column text navigation to Pengertian, Bukti ilmiah, Keselamatan, and Referensi. The links are normal anchors with 44 px minimum row height and visible keyboard focus.
- Removed internal development language (T01 in running copy, source-document version, and displayed revision history) from the reading flow. The article ID, source document, and revision history remain in typed content metadata.
- Split the evidence summary into shorter paragraphs and simplified the wording while retaining the same scope, evidence certainty, and limitations from the T01 draft and cited sources.
- Safety copy now uses the 16 px editorial body size for easier phone reading; its existing safety wording remains in review.
- All revised summary, context, evidence, definition, and safety wording remains **pending clinical review**. No practice steps are exposed, and no new safety or efficacy claim was added.

### Citation and source audit

- Visible citations now follow first-citation order **[1]–[4]**, mapped to original content IDs `S1`, `S2`, `S3`, and `S5`. The source IDs remain unchanged in data; no S4 was invented or inserted.
- **[1] S1:** WHO, *WHO recommendations: intrapartum care for a positive childbirth experience*, published 7 February 2018. Official page title, year, and URL checked: [WHO source](https://www.who.int/publications/i/item/9789241550215).
- **[2] S2:** NICE, *Intrapartum care* (NG235), published 29 September 2023 and last updated 9 June 2026. The article cites recommendations 1.6.3 and 1.6.5 only. The official recommendations page is linked; direct retrieval returned 403 in the browsing tool, while NICE's indexed page and official NG235 PDF expose the title, dates, and cited recommendations: [NICE recommendations](https://www.nice.org.uk/guidance/ng235/chapter/Recommendations), [official NG235 PDF](https://www.nice.org.uk/guidance/ng235/resources/intrapartum-care-pdf-%2066143897812933).
- **[3] S3:** Cochrane, *Relaxation techniques for pain management in labour*, published 28 March 2018. The linked evidence page identifies CD009514 and DOI 10.1002/14651858.CD009514.pub2; the article does not display or add a DOI: [Cochrane source](https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour).
- **[4] S5:** NHS, *Anxiety in pregnancy*, last reviewed 17 March 2026. The page title, review date, and URL checked: [NHS source](https://www.nhs.uk/pregnancy/mental-health-in-pregnancy-and-after-the-birth/anxiety-in-pregnancy/).
- Citation links resolve to the matching local source entries; source entries link to their official pages. Source publication/review dates are separate from the app's accessed date (**21 October 2026**).

### Browser evidence

Agent Browser captured the updated detail at all required viewport sizes. As before, fixed navigation is pinned to the viewport in full-page captures; use the footer capture to assess the actual document end.

| Viewport | First viewport | Full page | Scrolled footer |
|---|---|---|---|
| 375 × 812 | [First](../tmp/fidelity/phase2_1a/detail-first-375x812.png) | [Full](../tmp/fidelity/phase2_1a/detail-full-375x812.png) | [Footer](../tmp/fidelity/phase2_1a/detail-footer-375x812.png) |
| 390 × 844 | [First](../tmp/fidelity/phase2_1a/detail-first-390x844.png) | [Full](../tmp/fidelity/phase2_1a/detail-full-390x844.png) | [Footer](../tmp/fidelity/phase2_1a/detail-footer-390x844.png) |
| 430 × 932 | [First](../tmp/fidelity/phase2_1a/detail-first-430x932.png) | [Full](../tmp/fidelity/phase2_1a/detail-full-430x932.png) | [Footer](../tmp/fidelity/phase2_1a/detail-footer-430x932.png) |

Fresh regression captures: [Beranda](../tmp/fidelity/phase2_1a/home-regression-390x844.png) and [Jenis Terapi](../tmp/fidelity/phase2_1a/catalog-regression-390x844.png). Each matched its approved 390 × 844 baseline exactly (same dimensions, mean RGB difference 0, no differing pixels).

### QA and remaining review

- [Agent Browser acceptance](../qa/phase2_1a-visual.browser.mjs) captured all nine Phase 2.1A detail screenshots and both regression screenshots. The current interaction coverage is maintained in [Phase 2.1C content QA](../qa/phase2_1c-content.browser.mjs).
- Bottom navigation clearance at the final catalogue link is **40 px** at 375, 390, and 430 px. Scroll width equals the viewport; the article remains scrollable. Focus order reaches the article anchor navigation by keyboard.
- Contrast remains token-based and unchanged: forest/paper **8.90:1**, terra/paper **7.32:1**, body ink/paper **13.33:1**, muted/paper **4.99:1**, and safety text/background **4.72:1**.
- `npm.cmd run typecheck` and `npm.cmd run build` both passed after the final screenshot pass; the production build completed the existing PWA `injectManifest` step. The PWA configuration and shared navigation were not changed.
- No dedicated approved detail-page screenshot exists; the editorial layout is ready for user review, not approved by implication. Full-page fixed-navigation stitching remains a browser-capture limitation. All rewritten clinical wording and the existing safety text await qualified review; article status remains draft.

No homepage/catalog visual styles, design tokens, PWA architecture, other detail page, or clinical-review status were changed. No Git commit was created.

## Phase 2.1B — Patient-friendly content and UX refinement

**Date:** 21 October 2026
**Scope:** User-facing copy and progressive disclosure on `/terapi/teknik-pernapasan`; no other therapy page.
**Status:** **READY FOR CONTENT & VISUAL REVIEW.** Article T01 remains `draft` / pending clinical review. The practice guide remains locked. No commit was created.

### Copy and clinical traceability

The heading hierarchy is now question-led while preserving the Phase 2.1A H1 **Teknik Pernapasan**, Detail Terapi header, categories, and shared navigation. The introduction is headed **Mengenal Teknik Pernapasan** and gives a short summary. Evidence uncertainty remains visible in that summary and in the primary research paragraph. A native, keyboard-operable disclosure contains the supporting detail about variation between approaches; the reference list remains visible and numbered [1]–[4].

| Teks lama | Teks baru | Sumber pendukung | Alasan | Perlu review klinis? |
|---|---|---|---|---|
| “Untuk persalinan, pernapasan dapat menjadi salah satu pilihan relaksasi sesuai preferensi ibu. Penelitian menggunakan beragam teknik relaksasi dan kepastian buktinya rendah hingga sangat rendah. Karena itu, hasil bagi setiap ibu belum dapat dipastikan.” | “Saat persalinan, teknik pernapasan dapat menjadi salah satu pilihan relaksasi sesuai keinginan Ibu. Penelitian memakai cara yang beragam dan kepastian buktinya rendah hingga sangat rendah. Jadi, hasilnya belum tentu sama bagi setiap orang.” | WHO recommendation 21 [1]; NICE 1.6.3 and 1.6.5 [2]; Cochrane CD009514 [3] | Kalimat lebih langsung dan mempertahankan pilihan ibu, rendah–sangat rendah, serta ketidakpastian hasil. | Ya |
| Heading “Pengertian”; “Pernapasan untuk relaksasi berarti memperhatikan napas yang terasa nyaman sambil berupaya melepaskan ketegangan tubuh. Bagian ini mengenalkan konsep, bukan latihan yang harus diikuti.” | Heading “Apa itu teknik pernapasan?”; “Teknik pernapasan untuk relaksasi berarti memperhatikan napas yang terasa nyaman sambil berusaha melepas ketegangan tubuh. Penjelasan ini hanya mengenalkan konsep, bukan panduan latihan.” | Draf T01 v0.2, bagian “Apa itu teknik pernapasan untuk relaksasi?” | Mengganti istilah dan frasa formal tanpa menambah hasil atau instruksi praktik. | Ya |
| Heading “Tujuan dan konteks”; penjelasan formal WHO/NICE dan NHS menyebut “kecocokan untuk kondisi tiap orang”. | Heading “Kapan teknik ini dibahas?”; bagian persalinan kini berbunyi “Untuk persalinan, WHO mencantumkan pernapasan sebagai salah satu pilihan relaksasi bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri. NICE juga menyarankan agar pilihan Ibu menggunakan teknik pernapasan dan relaksasi didukung. Rekomendasi ini tidak menjamin hasil yang sama bagi setiap orang.” Bagian kehamilan memakai “Informasi ini bersifat umum dan tidak menilai kondisi pribadi Ibu.” | WHO [1]; NICE [2]; NHS *Anxiety in pregnancy* [4] | Memisahkan konteks persalinan dan kehamilan dengan kalimat pendek; mempertahankan cakupan populasi dan batas individualisasi. | Ya |
| Dua paragraf di “Bukti ilmiah” menerangkan cakupan Cochrane, variasi, kepastian rendah–sangat rendah, dan tidak adanya satu pola napas terbaik. | Primary: “Tinjauan Cochrane menilai kepastian bukti manfaat teknik relaksasi saat persalinan masih rendah hingga sangat rendah. Hasil penelitian belum cukup pasti untuk memastikan hasil yang sama bagi setiap Ibu.” Disclosure “Apa saja yang diteliti?”: “Tinjauan tersebut mencakup beberapa pendekatan, termasuk pernapasan, visualisasi, yoga, dan musik. Cara yang diteliti beragam, sehingga belum dapat ditentukan satu pola napas yang paling tepat.” | Cochrane CD009514 [3] | Menjaga kualitas dan keterbatasan bukti tetap terlihat; memindahkan rincian variasi metode ke disclosure native. | Ya |
| “Pengenalan ini bukan latihan mengejan atau menahan kontraksi dan tidak menggantikan penilaian maupun arahan tenaga kesehatan. Artikel ini tidak menilai kondisi pribadi atau menentukan kecocokan suatu kegiatan bagi seseorang.” | “Penjelasan ini bukan latihan mengejan atau menahan kontraksi. Informasi ini tidak menggantikan penilaian atau arahan tenaga kesehatan. Halaman ini tidak dapat menilai kondisi pribadi atau memastikan suatu kegiatan cocok untuk Ibu.” Heading menjadi “Hal yang perlu Ibu perhatikan”. | Draf T01 v0.2, batasan edukasi dan bagian “Hal yang harus diperhatikan” | Memecah larangan dan batas halaman menjadi kalimat lebih mudah dipindai. | Ya |
| “Panduan langkah demi langkah belum ditampilkan. Materi praktik akan tetap dikunci sampai ditinjau dan disetujui oleh dosen kebidanan atau tenaga kesehatan yang kompeten.” | “Panduan langkah demi langkah belum ditampilkan karena materi masih menunggu peninjauan klinis.” Heading “Panduan praktik — menunggu peninjauan”. | Status T01 pada Clinical Review Log; tidak ada panduan praktik yang disetujui | Menjelaskan status saat ini tanpa menjanjikan waktu atau hasil persetujuan. | Ya, sebelum membuka panduan |
| “Draf · menunggu telaah klinis” / “Belum ada persetujuan klinis yang tercatat.” | “Materi masih berupa draf” / “Belum ditinjau oleh tenaga kesehatan.” | Status draft T01 pada data artikel dan Clinical Review Log | Menjelaskan status review dengan istilah yang lebih umum, tanpa menaikkan status persetujuan. | Ya, status tetap harus diverifikasi |
| “Audio pendamping belum tersedia. Tidak ada pemutar audio pada halaman ini.” | Heading “Audio relaksasi — jika tersedia”; “Audio relaksasi belum tersedia.” | Status ketersediaan media pada data artikel; belum ada audio yang tersedia | Menghapus pengulangan sambil tetap jelas bahwa audio belum tersedia; tidak ada player palsu. | Ya, bila materi audio dikembangkan |

### Reference audit

- Local source IDs and display order are unchanged: `S1` WHO [1], `S2` NICE [2], `S3` Cochrane [3], and `S5` NHS [4]. No S4, source, author, result, or DOI was added. Reference titles, dates and URLs remain the values recorded in `src/content/therapyReferences.ts`.
- The WHO page confirms title and publication date (7 February 2018). Cochrane confirms title, date (28 March 2018), evidence certainty ranging from low to very low, varied approaches, and DOI CD009514.pub2. NHS confirms the title and page review date (17 March 2026), and suggests breathing exercises/meditation to help relax and contacting a GP or midwife when anxiety is persistent. These claims retain the conservative scope in the app.
- NICE direct page retrieval returned 403 in the web reader. NICE's indexed official recommendations page exposes 1.6.3 (breathing exercises may reduce pain during latent first stage) and 1.6.5 (support the choice to use breathing/relaxation techniques); the app cites these two recommendations without claiming guaranteed benefit. This URL remains clickable in browser QA.
- All edited clinical language is marked as requiring qualified review. `Clinical-Review-Log.md` remains awaiting review for T01; no reviewer, qualification, or approval date was invented. The article's status is still draft.

### Screenshots and QA

Agent Browser screenshots are in ignored `tmp/fidelity/phase2_1b/`. Full-page captures stitch the fixed navigation at a viewport position; use the separate footer capture to inspect the actual document end.

| Viewport | First viewport | Full page | Scrolled footer |
|---|---|---|---|
| 375 × 812 | [First](../tmp/fidelity/phase2_1b/detail-first-375x812.png) | [Full](../tmp/fidelity/phase2_1b/detail-full-375x812.png) | [Footer](../tmp/fidelity/phase2_1b/detail-footer-375x812.png) |
| 390 × 844 | [First](../tmp/fidelity/phase2_1b/detail-first-390x844.png) | [Full](../tmp/fidelity/phase2_1b/detail-full-390x844.png) | [Footer](../tmp/fidelity/phase2_1b/detail-footer-390x844.png) |
| 430 × 932 | [First](../tmp/fidelity/phase2_1b/detail-first-430x932.png) | [Full](../tmp/fidelity/phase2_1b/detail-full-430x932.png) | [Footer](../tmp/fidelity/phase2_1b/detail-footer-430x932.png) |

Regression screenshots: [Beranda](../tmp/fidelity/phase2_1b/home-regression-390x844.png) and [Jenis Terapi](../tmp/fidelity/phase2_1b/catalog-regression-390x844.png). Pixel comparison against the approved 390 × 844 baselines found Beranda identical (no differing pixels). Katalog dimensions match; only 2 pixels differ within a 1 × 3 px bounding box at x=20, y=730, with no visible layout or content change. The same small difference appears against the Phase 2.1A catalog capture, so it is treated as capture/rendering variation rather than a regression.

- Phase 2.1B's evidence disclosure is superseded in Phase 2.1C by the concise source disclosure; see the current QA results below.
- `npm.cmd run typecheck` — passed (`tsc -b --pretty`).
- `npm.cmd run build` — passed, including Vite production output and PWA `injectManifest`.
- The native `<details>/<summary>` disclosure is operable with keyboard; heading order and visible anchor navigation remain intact. No shared components, design tokens, homepage, catalog, PWA configuration, or other therapy page changed in this phase.

### Remaining review items

- All user-facing clinical rewrites and the existing safety paragraph still need a qualified clinical review. Plain-language editing is not clinical approval.
- The research disclosure is collapsed by default, but the low-to-very-low certainty and uncertainty of outcomes remain visible in the summary and primary evidence text. The source list stays open and reachable.
- The standard full-page screenshot still shows fixed navigation stitched into the captured page; dedicated footer views show the true scroll end and clearance. No material responsive overflow or footer obstruction was found.

No Git commit was created. No therapy other than Teknik Pernapasan was implemented.

## Phase 2.1C — Mother-friendly health education content

**Date:** 22 October 2026
**Scope:** Content hierarchy and source presentation on `/terapi/teknik-pernapasan`. Visual design direction, header, bottom navigation, typefaces, colors, icons, homepage, and therapy catalog remain unchanged.
**Status:** **READY FOR CONTENT & VISUAL REVIEW.** T01 remains `draft` / pending clinical review. Practice instructions are locked; there is no audio player. No Git commit was created.

### Final article structure

1. **Mengenal Teknik Pernapasan** — short introduction with a plain statement that individual experience can differ and the option may not fit every condition.
2. **Apa itu teknik pernapasan?** — simple concept explanation; explicitly not a practice guide.
3. **Apa tujuannya?** — distinguishes the purpose of offering a relaxation option from any promised outcome.
4. **Kapan teknik ini dapat dipertimbangkan?** — separates general pregnancy self-care information from labor context without assessing an individual mother.
5. **Hal yang perlu Ibu perhatikan** — visible safety boundary; not hidden in a disclosure.
6. **Panduan untuk Ibu** — clear pending-review notice; steps remain locked.
7. **Audio Pendamping** — states that audio is not available.
8. **Sumber Informasi** — short source list under a native disclosure, with four direct official links.

### Copy and source mapping

| Teks lama / yang dihapus | Teks final / penyajian baru | Sumber atau data pendukung | Alasan | Perlu review klinis? |
|---|---|---|---|---|
| Ringkasan Phase 2.1B menyebut “Penelitian memakai cara yang beragam dan kepastian buktinya rendah hingga sangat rendah.” | “Teknik pernapasan dapat menjadi salah satu pilihan relaksasi saat persalinan. Manfaat yang dirasakan bisa berbeda pada setiap Ibu. Pilihan ini belum tentu sesuai untuk semua kondisi.” | WHO S1, NICE S2, dan Cochrane S3; catatan kualitas bukti internal `T01-E01` | Menghapus istilah akademik dari alur baca, tetap menyampaikan variasi pengalaman dan tidak menjanjikan hasil. | Ya |
| “Pengertian”; “Teknik pernapasan untuk relaksasi berarti memperhatikan napas yang terasa nyaman sambil berusaha melepas ketegangan tubuh.” | “Apa itu teknik pernapasan?”; “Dalam relaksasi, teknik pernapasan berarti memperhatikan napas yang terasa nyaman. Penjelasan ini mengenalkan konsep saja, bukan panduan latihan.” | Materi draf T01 v0.2; pemetaan lokal `referenceIds: [S1, S2]` | Definisi singkat dan tidak menyatakan hasil terapeutik. | Ya |
| Tidak ada section tujuan yang berdiri sendiri. | “Teknik ini dibahas sebagai salah satu pilihan untuk membantu Ibu merasa lebih rileks saat persalinan. Tujuannya memberi pilihan sesuai keinginan Ibu; hasil tertentu tidak dapat dijanjikan.” | WHO S1, NICE S2, Cochrane S3; `referenceIds` disimpan pada paragraf | Menjelaskan tujuan pembahasan dan membedakannya dari manfaat yang dijamin. | Ya |
| “WHO mencantumkan…” / “NICE juga menyarankan…” dan penyebutan NHS dalam narasi. | Kehamilan: “Selama kehamilan, latihan pernapasan dan meditasi disebut sebagai pilihan perawatan diri untuk membantu rileks. Informasi ini bersifat umum dan bukan penilaian terhadap kondisi Ibu. Jika rasa cemas terasa terus-menerus atau mengganggu aktivitas, bicarakan dengan bidan atau dokter.” Persalinan: “Dalam pedoman persalinan, teknik pernapasan tercantum sebagai salah satu pilihan relaksasi bagi ibu hamil sehat yang menginginkan dukungan untuk nyeri. Pilihan dan manfaat yang dirasakan dapat berbeda pada setiap orang.” | NHS S5; WHO S1; NICE S2; Cochrane S3 | Memisahkan konteks, menghindari klaim penggunaan untuk semua kondisi, dan menghilangkan nada laporan sumber dari narasi. | Ya |
| Section “Apa yang diketahui dari penelitian?” menyebut Cochrane, variasi metode, dan tingkat kepastian rendah hingga sangat rendah. | Tidak ada section penelitian atau rincian metodologi pada halaman pengguna. Rincian dipindahkan ke `internalEvidenceNotes` dalam data artikel. Ketidakpastian disampaikan sederhana pada pengantar: “Manfaat yang dirasakan bisa berbeda pada setiap Ibu” dan “Pilihan ini belum tentu sesuai untuk semua kondisi.” | Cochrane S3; `internalEvidenceNotes` `T01-E01`, certainty `low_to_very_low`, `referenceIds: [S3]` | Mempertahankan kualitas bukti dan hubungan sumber di data internal tanpa membuat halaman terasa seperti jurnal. | Ya |
| “Penjelasan ini bukan latihan mengejan atau menahan kontraksi. Informasi ini tidak menggantikan penilaian atau arahan tenaga kesehatan. Halaman ini tidak dapat menilai kondisi pribadi…” | “Penjelasan ini bukan latihan mengejan atau menahan kontraksi. Website ini tidak dapat menilai kondisi pribadi Ibu atau memastikan suatu kegiatan cocok untuk Ibu. Informasi ini tidak menggantikan pemeriksaan atau arahan bidan dan dokter.” | Batasan draf T01 dan kebijakan keselamatan proyek | Mempertahankan batas keselamatan dalam bahasa langsung; tetap terlihat sebagai bagian utama. | Ya |
| “Panduan langkah demi langkah belum ditampilkan karena materi masih menunggu peninjauan klinis.” | Heading “Panduan untuk Ibu”; “Panduan praktik belum tersedia. Materi masih menunggu peninjauan dari dosen kebidanan atau tenaga kesehatan yang kompeten.” | Clinical Review Log; T01 tetap pending | Menyebut siapa yang perlu meninjau tanpa membuka langkah atau menjanjikan waktu persetujuan. | Ya, sebelum panduan dibuka |
| Sumber tampil dengan nomor sitasi, judul artikel lengkap, dan tanggal akses. | Section **Sumber Informasi** dengan tautan singkat di dalam disclosure “Lihat sumber yang digunakan”; tanpa nomor berulang di paragraf. | Data sumber S1, S2, S3, S5 dipertahankan dengan judul resmi, organisasi, URL, tanggal, dan ID asli. | Membuat sumber mudah dicapai tanpa mendominasi bacaan; klaim tetap terhubung dengan ID referensi pada data. | Ya, verifikasi akhir sebelum publikasi |

### Data and reference governance

- `TherapyParagraph.referenceIds` tetap menyimpan hubungan antara setiap isi dan sumbernya. `internalEvidenceNotes` menyimpan kualitas bukti Cochrane sebagai `low_to_very_low`, rincian cakupan, klaim terkait, dan ID referensi. Catatan ini tidak dirender dalam UI.
- Judul resmi, organisasi penerbit, tahun, tanggal tinjau, URL, tanggal akses, serta ID S1, S2, S3, dan S5 tetap ada pada data sumber. UI menampilkan label ringkas berbahasa Indonesia; DOI dan nomor sitasi tidak ditambahkan ke narasi.
- S1 WHO menjelaskan rekomendasi relaksasi untuk ibu hamil sehat yang menginginkan dukungan nyeri saat persalinan. S2 NICE 1.6.3 menyebut kemungkinan pengurangan nyeri kala laten dan 1.6.5 meminta dukungan terhadap pilihan penggunaan teknik napas/relaksasi. S3 Cochrane menyebut kepastian bukti rendah sampai sangat rendah dan variasi cara penggunaan. S5 NHS menyebut latihan napas/meditasi sebagai hal yang dapat dicoba untuk membantu rileks serta menyarankan berbicara dengan bidan atau dokter jika kecemasan menetap. Sumber dibuka kembali pada 22 Oktober 2026: [WHO](https://www.who.int/publications/i/item/9789241550215), [NICE](https://www.nice.org.uk/guidance/ng235/chapter/Recommendations), [Cochrane](https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour), [NHS](https://www.nhs.uk/pregnancy/mental-health-in-pregnancy-and-after-the-birth/anxiety-in-pregnancy/).
- `Clinical-Review-Log.md` mencatat revision 0.4 sebagai **Awaiting review**. Tidak ada reviewer, tanggal persetujuan, atau status Approved yang ditambahkan.

### Screenshots and QA

Agent Browser captures are in ignored `tmp/fidelity/phase2_1c/`. Fixed navigation appears at a stitched viewport position in full-page captures; the separate footer captures show the actual page end.

| Viewport | First viewport | Full page | Scrolled footer |
|---|---|---|---|
| 375 × 812 | [First](../tmp/fidelity/phase2_1c/detail-first-375x812.png) | [Full](../tmp/fidelity/phase2_1c/detail-full-375x812.png) | [Footer](../tmp/fidelity/phase2_1c/detail-footer-375x812.png) |
| 390 × 844 | [First](../tmp/fidelity/phase2_1c/detail-first-390x844.png) | [Full](../tmp/fidelity/phase2_1c/detail-full-390x844.png) | [Footer](../tmp/fidelity/phase2_1c/detail-footer-390x844.png) |
| 430 × 932 | [First](../tmp/fidelity/phase2_1c/detail-first-430x932.png) | [Full](../tmp/fidelity/phase2_1c/detail-full-430x932.png) | [Footer](../tmp/fidelity/phase2_1c/detail-footer-430x932.png) |

Regression captures: [Homepage](../tmp/fidelity/phase2_1c/home-regression-390x844.png) and [catalog](../tmp/fidelity/phase2_1c/catalog-regression-390x844.png). Pixel comparison found both images identical to their approved 390 × 844 baseline (no differing pixels). The expanded [source list](../tmp/fidelity/phase2_1c/detail-sources-open-390x844.png) was captured separately.

- `node qa/phase2_1c-content.browser.mjs` — passed: required section order, no academic research section or visible repeated citation numbers, preserved source links, native source disclosure by mouse and keyboard, safe locked practice/audio states, anchors, route/back/fallback behavior, one H1, responsive overflow, scrolling, and bottom navigation clearance (40 px at all three widths).
- `node qa/phase2_1c-visual.browser.mjs` — passed and captured first, full-page, footer, and Beranda/catalog regression screenshots at the required sizes.
- `npm.cmd run typecheck` — passed. `npm.cmd run build` — passed, including the existing PWA `injectManifest` build.
- Visual QA found no material composition change. The source disclosure adds no new palette, card, icon family, or design token.

### Clinical review still required

Every patient-facing clinical rewrite, including the summary, purpose, pregnancy and labor context, and safety paragraph, remains **DRAFT / PENDING CLINICAL REVIEW**. The mother-friendly wording has not been clinically validated. The page includes no breathing steps, frequency, duration, or audio playback. No other therapy detail page was implemented.

No Git commit was created.

### Phase 2.1C — Final copy adjustment (revision 0.5)

Minimal copy-only update to the Teknik Pernapasan article. No UI, layout, typography, token, navigation, or shared component changes were made.

| Area | Previous wording | Final wording | Support and rationale | Clinical review |
|---|---|---|---|---|
| Mengenal Teknik Pernapasan | “Manfaat yang dirasakan bisa berbeda pada setiap Ibu.” | “Manfaatnya belum dapat dipastikan dan bisa berbeda pada setiap Ibu.” | WHO notes very-low-certainty beneficial effects; Cochrane rates the evidence from low to very low and describes varied techniques. The sentence states uncertainty plainly without promising an outcome. [WHO](https://iris.who.int/bitstream/handle/10665/260178/9789241550215-eng.pdf), [Cochrane](https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour). | Required; remains DRAFT / PENDING CLINICAL REVIEW. |
| Kapan teknik ini dapat dipertimbangkan — persalinan | “Dalam pedoman persalinan, teknik pernapasan tercantum sebagai salah satu pilihan relaksasi bagi ibu hamil sehat yang menginginkan dukungan untuk nyeri. Pilihan dan manfaat yang dirasakan dapat berbeda pada setiap orang.” | “Bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri saat persalinan, teknik pernapasan dapat menjadi salah satu pilihan relaksasi. Pilihan ini mengikuti keinginan Ibu.” | Plain-language paraphrase retains WHO's healthy-pregnancy/request-for-pain-relief scope and preference condition; NICE supports the woman's choice of breathing and relaxation techniques. It does not present a guaranteed benefit. [WHO](https://www.who.int/publications/i/item/9789241550215), [NICE NG235 1.6.3 and 1.6.5](https://www.nice.org.uk/guidance/ng235/chapter/Recommendations). | Required; remains DRAFT / PENDING CLINICAL REVIEW. |

The article data retains reference IDs `S1`, `S2`, and `S3`; evidence notes are unchanged. Revision history is now 0.5, dated 22 October 2026. `Clinical-Review-Log.md` records this revision as **Awaiting review**; no approval is implied.

Fresh Agent Browser captures (the existing Phase 2.1C files were refreshed after the copy update):

| Viewport | First viewport | Full page | Footer |
|---|---|---|---|
| 375 × 812 | [First](../tmp/fidelity/phase2_1c/detail-first-375x812.png) | [Full](../tmp/fidelity/phase2_1c/detail-full-375x812.png) | [Footer](../tmp/fidelity/phase2_1c/detail-footer-375x812.png) |
| 390 × 844 | [First](../tmp/fidelity/phase2_1c/detail-first-390x844.png) | [Full](../tmp/fidelity/phase2_1c/detail-full-390x844.png) | [Footer](../tmp/fidelity/phase2_1c/detail-footer-390x844.png) |
| 430 × 932 | [First](../tmp/fidelity/phase2_1c/detail-first-430x932.png) | [Full](../tmp/fidelity/phase2_1c/detail-full-430x932.png) | [Footer](../tmp/fidelity/phase2_1c/detail-footer-430x932.png) |

- `node qa/phase2_1c-content.browser.mjs` — passed, including assertions for the revised benefit and labor wording, source mapping, responsive overflow, keyboard interactions, locked practice/audio, navigation, and 40 px bottom-navigation clearance at all three widths.
- `node qa/phase2_1c-visual.browser.mjs` — passed and refreshed the detail captures and 390 × 844 homepage/catalog regression captures.
- Pixel comparison of the refreshed homepage and catalog captures against their approved 390 × 844 baselines found no differing pixels.
- `npm.cmd run typecheck` — passed. `npm.cmd run build` — passed, including PWA `injectManifest`.
- No material visual differences were introduced. The revised copy remains subject to clinical review; wording is not clinically approved.

## Phase 2.1 — Final baseline freeze

**Status:** **APPROVED THERAPY DETAIL VISUAL & EDITORIAL BASELINE v1.0**. This approval covers the UI/UX, article structure, and editorial presentation only.

| Area | Frozen status |
|---|---|
| UI/UX and editorial presentation | **APPROVED** |
| Clinical content | **DRAFT / PENDING CLINICAL REVIEW**; revision 0.6 is recorded as Awaiting review in `Clinical-Review-Log.md`. |
| Practical instructions | **LOCKED** pending qualified clinical review. |
| Audio | **UNAVAILABLE**; no audio player is rendered. |

The baseline locks the detail header and six-tab bottom navigation, Fraunces and DM Sans typography, approved palette, eight-part article structure, anchor navigation, safety notice, source disclosure, spacing and responsive layout, reusable React template, and clinical-review state handling. Changes to these elements require user approval. The approved Beranda and Jenis Terapi baselines were not modified.

### Reusable template structure

- `TherapyDetailPage.tsx` provides the shared presentation template.
- `therapyArticles.ts` holds typed article content, clinical state, locked-guide/audio states, evidence notes, and revision history.
- `therapyReferences.ts` holds source metadata and URLs; paragraphs retain their reference IDs.
- `therapyContent.types.ts` defines the data contracts. No other therapy detail page is implemented.

### Final copy adjustment

In **Kapan teknik ini dapat dipertimbangkan?**, the labor paragraph ends: “Ibu dapat membicarakan pilihan ini dengan bidan yang mendampingi agar sesuai dengan kondisi dan kebutuhan Ibu.” This is preference-led editorial wording consistent with WHO recommendation 21 and NICE NG235 recommendations 1.1.3, 1.4.1–1.4.2, 1.4.8, and 1.6.5. It does not claim efficacy or replace individualized clinical assessment. The sentence and article remain pending clinical review. [WHO](https://www.who.int/publications/i/item/9789241550215), [NICE NG235](https://www.nice.org.uk/guidance/ng235/chapter/Recommendations).

### Permanent baseline evidence

Agent Browser captures are stored in `docs/evidence/approved-therapy-detail-v1.0/`:

| Viewport | First viewport | Full page | Scrolled footer |
|---|---|---|---|
| 375 × 812 | [First](evidence/approved-therapy-detail-v1.0/first-375x812.png) | [Full](evidence/approved-therapy-detail-v1.0/full-375x812.png) | [Footer](evidence/approved-therapy-detail-v1.0/footer-375x812.png) |
| 390 × 844 | [First](evidence/approved-therapy-detail-v1.0/first-390x844.png) | [Full](evidence/approved-therapy-detail-v1.0/full-390x844.png) | [Footer](evidence/approved-therapy-detail-v1.0/footer-390x844.png) |
| 430 × 932 | [First](evidence/approved-therapy-detail-v1.0/first-430x932.png) | [Full](evidence/approved-therapy-detail-v1.0/full-430x932.png) | [Footer](evidence/approved-therapy-detail-v1.0/footer-430x932.png) |

Regression captures: [Beranda 390 × 844](evidence/approved-therapy-detail-v1.0/home-regression-390x844.png) and [Jenis Terapi 390 × 844](evidence/approved-therapy-detail-v1.0/catalog-regression-390x844.png). At all article viewports, browser QA covers keyboard access to anchor links and source disclosure, route/back navigation, locked practice/audio, no horizontal overflow, and at least 40 px clearance from the fixed bottom navigation.

- `node qa/phase2_1c-content.browser.mjs` — passed, including final copy and source-linked context assertions.
- `node qa/phase2_1c-visual.browser.mjs` — passed; captured first, full-page, footer, and homepage/catalog regression states at the required viewport sizes.
- Homepage and catalog regression screenshots at 390 × 844 match the approved baselines pixel-for-pixel.
- `npm.cmd run typecheck`, `npm.cmd run build`, and `git diff --check` — passed. Build includes the existing PWA `injectManifest` step.

No clinical content was marked approved. No deployment was performed.

## Phase 2.2 — Three additional therapy detail routes

**Implementation status:** ready for user visual review. This phase adds only the detail routes for Terapi Musik, Relaksasi Otot Ringan, and Pijat Pendamping. The shared detail presentation and styling were not materially changed. All three articles are **DRAFT / PENDING CLINICAL REVIEW**; practice guides remain **LOCKED**. Music audio remains **UNAVAILABLE**; the other two articles omit the audio section as not applicable.

### Content audit and scope

| Article | Repository material and identity | Available, source-supported scope | Gaps and status |
|---|---|---|---|
| Terapi Musik (T02; source slug `musik-relaksasi`; route `/terapi/terapi-musik`) | Draft T02 in `reference/MATERI-DRAF-v0.2.md`, “Pilih Musik yang Membuat Ibu Nyaman”. Sources WHO S1, NICE S2, and Cochrane S3 are used in the article. | Describes music as an optional preference during labor. The page says the benefit is uncertain and may differ between mothers. | The draft's audio-use suggestions and specific playback guidance are excluded. No verified audio is available. Pregnancy-specific efficacy from the draft's S7 is not presented as a claim for this page. Article and practice guidance await clinical review; practice remains locked. |
| Relaksasi Otot Ringan (T03; route `/terapi/relaksasi-otot-ringan`) | Draft T03 in `reference/MATERI-DRAF-v0.2.md`, “Melepaskan Ketegangan Otot Secara Lembut”. WHO S1 and Cochrane S3 are mapped in the article. | Introduces progressive muscle relaxation only as a concept and its discussion as a labor relaxation option; it does not assert an individual outcome. The page retains uncertainty and says it cannot determine suitability for a mother's condition. | The draft's movement, body-position, timing, and intensity directions are excluded. No exercise or practice steps are published. Conceptual copy awaits clinical review; practice remains locked. |
| Pijat Pendamping (T04; source slug `pijat-pendamping-persalinan`; route `/terapi/pijat-pendamping`) | Draft T04 in `reference/MATERI-DRAF-v0.2.md`, “Pijat Pendamping Saat Persalinan…”. WHO S1, NICE S2, Cochrane S4, and NHS S8 are recorded in the article data. | Explains that touch is optional, foregrounds consent and comfort, and frames massage only as a preference-led labor support option. The page does not claim universal safety or a guaranteed effect. | Massage locations, pressure, duration, technique, contraindications, and practice steps are not specified. The page cannot determine which form of touch suits an individual. These details await clinical review; practice remains locked. |

No article is marked **BLOCKED FOR CONTENT** because each has enough traceable material for a limited, conceptual draft page. The omitted practical guidance is separately blocked pending qualified review. No draft is treated as validated.

### Claim-to-source mapping

| Article / content | Source IDs | Use in user-facing content and limits |
|---|---|---|
| T02: music as an optional labor preference; no promised reduction in pain or anxiety; benefits may vary | S1 WHO; S2 NICE; S3 Cochrane | S1/S2 support preference-led non-pharmacological options in labor, including music; S3 is retained for internal evidence context and uncertainty. No efficacy promise, individualized recommendation, or audio instruction is rendered. |
| T03: progressive muscle relaxation as a conceptual labor relaxation option; no claim that it reduces pain or tension for an individual | S1 WHO; S3 Cochrane | S1 provides labor context; S3 informs the uncertainty note internally. Movement instructions and universal suitability claims are omitted. |
| T04: optional touch/massage in labor; consent and comfort; no universal safety or benefit claim | S1 WHO; S2 NICE; S4 Cochrane; S8 NHS | S1/S2 provide preference-led labor context, including massage. S4 is retained for internal evidence uncertainty. S8 is a general labor pain-relief context link, not support for a specific massage technique. No location, pressure, duration, or technique is published. |

References are linked through the existing structured `referenceIds` metadata. Original source IDs are preserved. S7 from the draft is deliberately not linked to a specific patient-facing T02 efficacy statement because its scope does not justify that statement here. The copy, claims, and source mappings all require qualified clinical review.

### Browser QA evidence

Agent Browser captures are in ignored `tmp/fidelity/phase2_2/`. Each detail page has first viewport, full-page, and scrolled-footer captures for all required viewport sizes:

| Page | 375 × 812 | 390 × 844 | 430 × 932 |
|---|---|---|---|
| Terapi Musik | [First](../tmp/fidelity/phase2_2/music-first-375x812.png) · [Full](../tmp/fidelity/phase2_2/music-full-375x812.png) · [Footer](../tmp/fidelity/phase2_2/music-footer-375x812.png) | [First](../tmp/fidelity/phase2_2/music-first-390x844.png) · [Full](../tmp/fidelity/phase2_2/music-full-390x844.png) · [Footer](../tmp/fidelity/phase2_2/music-footer-390x844.png) | [First](../tmp/fidelity/phase2_2/music-first-430x932.png) · [Full](../tmp/fidelity/phase2_2/music-full-430x932.png) · [Footer](../tmp/fidelity/phase2_2/music-footer-430x932.png) |
| Relaksasi Otot Ringan | [First](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-first-375x812.png) · [Full](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-full-375x812.png) · [Footer](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-footer-375x812.png) | [First](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-first-390x844.png) · [Full](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-full-390x844.png) · [Footer](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-footer-390x844.png) | [First](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-first-430x932.png) · [Full](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-full-430x932.png) · [Footer](../tmp/fidelity/phase2_2/relaksasi-otot-ringan-footer-430x932.png) |
| Pijat Pendamping | [First](../tmp/fidelity/phase2_2/pijat-pendamping-first-375x812.png) · [Full](../tmp/fidelity/phase2_2/pijat-pendamping-full-375x812.png) · [Footer](../tmp/fidelity/phase2_2/pijat-pendamping-footer-375x812.png) | [First](../tmp/fidelity/phase2_2/pijat-pendamping-first-390x844.png) · [Full](../tmp/fidelity/phase2_2/pijat-pendamping-full-390x844.png) · [Footer](../tmp/fidelity/phase2_2/pijat-pendamping-footer-390x844.png) | [First](../tmp/fidelity/phase2_2/pijat-pendamping-first-430x932.png) · [Full](../tmp/fidelity/phase2_2/pijat-pendamping-full-430x932.png) · [Footer](../tmp/fidelity/phase2_2/pijat-pendamping-footer-430x932.png) |

Separate first/full/footer captures are used because a full-page browser capture can stitch a fixed bottom bar at a viewport coordinate. The footer captures show the real page end and confirm bottom-navigation clearance.

Regression screenshots: [Homepage 375](../tmp/fidelity/phase2_2/home-regression-375x812.png) · [390](../tmp/fidelity/phase2_2/home-regression-390x844.png) · [430](../tmp/fidelity/phase2_2/home-regression-430x932.png); [catalog 375](../tmp/fidelity/phase2_2/catalog-regression-375x812.png) · [390](../tmp/fidelity/phase2_2/catalog-regression-390x844.png) · [430](../tmp/fidelity/phase2_2/catalog-regression-430x932.png); [Technique detail 375](../tmp/fidelity/phase2_2/breathing-regression-375x812.png) · [390](../tmp/fidelity/phase2_2/breathing-regression-390x844.png) · [430](../tmp/fidelity/phase2_2/breathing-regression-430x932.png). All nine regression images matched their corresponding approved baselines pixel-for-pixel (same dimensions; no differing pixel bounding box).

- `node qa/phase2_2-content.browser.mjs` — passed: all three direct routes, catalog links, browser Back and safe back navigation, article-specific references, draft status, locked practice, unavailable music audio, omitted not-applicable audio, keyboard anchor navigation, keyboard source disclosure, unknown-route fallback, horizontal overflow, and bottom-navigation clearance.
- `node qa/phase2_2-visual.browser.mjs` — passed; captured 27 detail states and 9 baseline regressions at the required viewports.
- Visual review found no material change to the shared detail template. The three articles retain the approved editorial typography, palette, header, anchor navigation, and fixed six-tab navigation.
- `npm.cmd run typecheck` — passed.
- `npm.cmd run build` — passed, including the existing PWA `injectManifest` build.
- `git diff --check` — passed (Git emitted only its standard LF-to-CRLF working-copy warnings on Windows).

No changes were made to the homepage, catalog layout, existing Teknik Pernapasan content, PWA architecture, or design tokens. No commit or deployment was performed.

## Phase 2.4 — source-verified content integration

**Scope:** evidence-bounded article-data and category-metadata changes for T01–T04 only. Shared presentation, typography, spacing, colors, navigation, images, and PWA behavior were not changed. Existing approved visual baselines were preserved. All content remains DRAFT / PENDING CLINICAL REVIEW; practical guides remain LOCKED; audio remains UNAVAILABLE.

### Browser QA evidence

Screenshots are generated in the ignored working directory `tmp/fidelity/phase2_4/` by `node qa/phase2_4-visual.browser.mjs`:

| Page | 375 × 812 | 390 × 844 | 430 × 932 |
|---|---|---|---|
| T01 Teknik Pernapasan — first/full/footer | `teknik-pernapasan-{first,full,footer}-375x812.png` | `teknik-pernapasan-{first,full,footer}-390x844.png` | `teknik-pernapasan-{first,full,footer}-430x932.png` |
| T02 Terapi Musik — first/full/footer | `terapi-musik-{first,full,footer}-375x812.png` | `terapi-musik-{first,full,footer}-390x844.png` | `terapi-musik-{first,full,footer}-430x932.png` |
| T03 Relaksasi Otot Ringan — first/full/footer | `relaksasi-otot-ringan-{first,full,footer}-375x812.png` | `relaksasi-otot-ringan-{first,full,footer}-390x844.png` | `relaksasi-otot-ringan-{first,full,footer}-430x932.png` |
| T04 Pijat Pendamping — first/full/footer | `pijat-pendamping-{first,full,footer}-375x812.png` | `pijat-pendamping-{first,full,footer}-390x844.png` | `pijat-pendamping-{first,full,footer}-430x932.png` |
| Homepage/catalog regression | `homepage-regression-375x812.png`; `catalog-regression-375x812.png` | `homepage-regression-390x844.png`; `catalog-regression-390x844.png` | `homepage-regression-430x932.png`; `catalog-regression-430x932.png` |

### QA results

- `node qa/phase2_4-content.browser.mjs` — passed: article copy/source links, user-facing review state, locked practice, route navigation tab, anchor count, category metadata/filter results, horizontal overflow, and footer clearance at all three viewports.
- `node qa/phase2_4-visual.browser.mjs` — captures the first viewport, full page, footer, and homepage/catalog regressions at all required viewports; visual inspection and technical checks are recorded after capture.
- No article category/status change unlocks a practice guide or claims individual suitability. T03 remains a content-definition blocker.

## Phase 2.2A — final mother-friendly content review

**Scope:** Copy/data refinement for T02, T03, and T04 only. The detail-page layout, typography, colors, routes, category labels, shared components, Homepage, catalog, and Teknik Pernapasan were not changed. The terms and claim/source mappings are recorded in the [Phase 2.2A Clinical Review Log](Clinical-Review-Log.md#phase-22a--final-mother-friendly-copy-review-23-october-2026).

### Copy and source summary

- **T02 Terapi Musik:** clarified that this page covers listening to music chosen by the mother, not a professionally delivered clinical music-therapy service. It does not promise pain relief; benefit remains uncertain. The label `Musik untuk Relaksasi` is only a proposal and was not applied.
- **T03 Relaksasi Otot Ringan:** clarified that the gentle body-awareness/body-scan variation in the draft is different from progressive muscle relaxation (PMR). The labor evidence for PMR is not presented as evidence for this specific variation. No practice instruction was added.
- **T04 Pijat Pendamping:** removed institutional narration from the labor context while retaining the mother's choice, right to refuse or stop touch, the requirement that the companion understand a suitable taught technique, and discussion with a midwife.
- Source mapping remains in article data: S1 WHO, S2 NICE, S3 Cochrane relaxation, S4 Cochrane manual methods, and S8 NHS pain-relief context. The detailed mapping and review-required wording are in the Clinical Review Log. All claims remain draft.

### Screenshots

Agent Browser first viewport, full-page, and scrolled-footer captures are in ignored `tmp/fidelity/phase2_2a/`:

| Viewport | Terapi Musik | Relaksasi Otot Ringan | Pijat Pendamping |
|---|---|---|---|
| 375 × 812 | [First](../tmp/fidelity/phase2_2a/music-first-375x812.png) · [Full](../tmp/fidelity/phase2_2a/music-full-375x812.png) · [Footer](../tmp/fidelity/phase2_2a/music-footer-375x812.png) | [First](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-first-375x812.png) · [Full](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-full-375x812.png) · [Footer](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-footer-375x812.png) | [First](../tmp/fidelity/phase2_2a/pijat-pendamping-first-375x812.png) · [Full](../tmp/fidelity/phase2_2a/pijat-pendamping-full-375x812.png) · [Footer](../tmp/fidelity/phase2_2a/pijat-pendamping-footer-375x812.png) |
| 390 × 844 | [First](../tmp/fidelity/phase2_2a/music-first-390x844.png) · [Full](../tmp/fidelity/phase2_2a/music-full-390x844.png) · [Footer](../tmp/fidelity/phase2_2a/music-footer-390x844.png) | [First](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-first-390x844.png) · [Full](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-full-390x844.png) · [Footer](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-footer-390x844.png) | [First](../tmp/fidelity/phase2_2a/pijat-pendamping-first-390x844.png) · [Full](../tmp/fidelity/phase2_2a/pijat-pendamping-full-390x844.png) · [Footer](../tmp/fidelity/phase2_2a/pijat-pendamping-footer-390x844.png) |
| 430 × 932 | [First](../tmp/fidelity/phase2_2a/music-first-430x932.png) · [Full](../tmp/fidelity/phase2_2a/music-full-430x932.png) · [Footer](../tmp/fidelity/phase2_2a/music-footer-430x932.png) | [First](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-first-430x932.png) · [Full](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-full-430x932.png) · [Footer](../tmp/fidelity/phase2_2a/relaksasi-otot-ringan-footer-430x932.png) | [First](../tmp/fidelity/phase2_2a/pijat-pendamping-first-430x932.png) · [Full](../tmp/fidelity/phase2_2a/pijat-pendamping-full-430x932.png) · [Footer](../tmp/fidelity/phase2_2a/pijat-pendamping-footer-430x932.png) |

Requested 390 × 844 examples: [Terapi Musik first viewport](../tmp/fidelity/phase2_2a/music-first-390x844.png) and [Terapi Musik full page](../tmp/fidelity/phase2_2a/music-full-390x844.png).

### QA results

- `node qa/phase2_2-content.browser.mjs` — passed after updating assertions for term distinction and the revised copy. Direct routes, catalog links, Back navigation, source disclosure, keyboard anchors, draft/locked states, unavailable audio, responsive overflow, and bottom-navigation clearance passed.
- `node qa/phase2_2-visual.browser.mjs` — passed; 27 new article captures and 9 regression captures saved.
- Regression images for Homepage, catalog, and Teknik Pernapasan matched approved baseline captures pixel-for-pixel at 375 × 812, 390 × 844, and 430 × 932 (matching dimensions; no differing pixels).
- `npm.cmd run typecheck` — passed. `npm.cmd run build` — passed, including PWA `injectManifest`. `git diff --check` — passed; Git emitted only Windows LF-to-CRLF working-copy warnings.
- Visual review found readable copy and intact headings at 375 px; no overflow, anchor, disclosure, locked-guide, or footer-clearance regression was found. Full-page captures stitch the fixed bottom navigation at viewport coordinates, so the separate footer captures remain the source for end-of-page clearance.

### Pending review

All T02/T03/T04 patient-facing changes remain **DRAFT / PENDING CLINICAL REVIEW**. Practical guides stay **LOCKED** and T02 audio stays **UNAVAILABLE**. Category mismatches and recommended corrections are recorded in the Clinical Review Log; catalog labels were not changed. The suggested T02 label change also requires separate editorial approval. No commit was made.

## Phase 2.4 — final verification record (23 October 2026)

`node qa/phase2_4-visual.browser.mjs` completed successfully. It saved 36 article screenshots (first viewport, full page, and scrolled footer for T01–T04 at 375 × 812, 390 × 844, and 430 × 932) plus six homepage/catalog regression screenshots in ignored `tmp/fidelity/phase2_4/`. Visual inspection found no material layout change; homepage and catalog captures match the approved evidence at all three sizes. T01's detail category chip intentionally changes from “Kehamilan trimester III” to the broader “Kehamilan”; shared presentation is unchanged.

`npm.cmd run typecheck`, `npm.cmd run build`, `node qa/phase2_4-content.browser.mjs`, and `git diff --check` all passed. Production build completed the existing PWA `injectManifest` step. Git emitted only standard Windows line-ending warnings. Browser checks covered source links, the native source disclosure opening via keyboard Space, draft/locked states, anchor structure, catalog filters, horizontal overflow, and bottom-navigation footer clearance.

T03 remains a content-definition blocker. All four articles are still DRAFT / PENDING CLINICAL REVIEW, all practice guides remain LOCKED, T02 audio remains UNAVAILABLE, and no commit or deployment was made.

## Phase 2.5 — content, source-based guidance, and audio MVP (23 October 2026)

### Evidence captures

Agent Browser captures and baseline regressions are saved in [`docs/evidence/phase-2.5-review/`](evidence/phase-2.5-review/):

- Full-page T01–T04 at 390 × 844: `t01-breathing-full-390x844.png`, `t02-music-full-390x844.png`, `t03-body-relaxation-full-390x844.png`, `t04-companion-massage-full-390x844.png`.
- `/relaksasi`: `relaxation-full-390x844.png`; selected player: `relaxation-selected-390x844.png`; active playback: `audio-playing-390x844.png`.
- Homepage and catalog regression: first viewport `homepage-first-regression-390x844.png`, `therapy-catalog-first-regression-390x844.png`; full captures `homepage-regression-390x844.png`, `therapy-catalog-regression-390x844.png`.

The full-page capture may stitch the fixed bottom navigation at a viewport coordinate. Agent Browser separately scrolled each article/audio page to its end and measured content clearance from the fixed navigation at 375 × 812, 390 × 844, and 430 × 932.

### QA results

- `node qa/phase2_5-audio.browser.mjs` — passed: all four article routes and source-based guidance, source disclosure and guide-source links by keyboard, T01/T02 embedded audio, all three audio files load and play, keyboard play/pause, seek, no autoplay, selecting another track pauses the prior one, active navigation, and no horizontal overflow.
- `node qa/phase2_5-visual.browser.mjs` — passed: all four articles plus `/relaksasi` at 375, 390, and 430 px; mapped sources, source-based guide presence, horizontal overflow, fixed-navigation footer/credit clearance, and homepage/catalog regression captures.
- Visual comparison: approved Homepage hero and global navigation remain visually unchanged. Homepage topic names and stale therapy destinations were corrected to the implemented labels/routes; the audio band now correctly says choices are available. Catalog's title and descriptive copy changes are intentional; catalog composition and filters are retained.
- `npm.cmd run typecheck` — passed. `npm.cmd run build` — passed, including the existing PWA `injectManifest` build. The precache contains 15 entries (629.28 KiB); MP3 files are excluded from precache. No PWA configuration changed.
- `git diff --check` — passed; Git emitted only standard Windows LF-to-CRLF working-copy warnings.

### Content and media state

- T01, T02, and T04 have bounded `SOURCE_REVIEWED` metadata; T03 remains `DRAFT` because its source scope is limited to grounding/body comfort around emotionally difficult perinatal experiences. Healthier Together returned 403 to direct fetch, although its indexed patient-facing text was available and reviewed.
- All four `clinicalReview.status` values remain `draft`; none is `CLINICALLY_REVIEWED`. The source-based guides do not certify individual suitability. T03 only offers optional comfort awareness; T04 only offers communication/consent preparation and no massage procedure.
- Hujan, suara air/alam, and instrumental audio are local playable MP3s. Source originals, creator, duration, license, and derivative details are recorded in the Asset License Manifest. Audio has no guided clinical narration and does not autoplay.
- No commit or deployment was made.

### Phase 2.5 final MVP checkpoint QA — 23 October 2026

Final targeted changes: the Relaxation page now presents the source title, creator, original source link, license link, and MP3 conversion notice for each recording. The CC BY-SA 4.0 notice is scoped to the rain audio derivative and does not purport to license the whole app. Audio load errors now explain that playback may need an internet connection and tell the reader to reconnect and retry. No shared design tokens, homepage/catalog layout, article structure, or PWA configuration changed.

- `pnpm.cmd typecheck` — PASS; `pnpm.cmd build` — PASS. Production output contains all three MP3 files (5,746,166 bytes total); the generated service worker does not list any audio file for precache. Players use `preload="none"` and do not autoplay.
- `node qa/phase2_5-audio.browser.mjs` — PASS in Agent Browser/Chromium: three source files load and play; play/pause, keyboard seek and volume, track switching, no autoplay, and a missing-file error state passed. The failure copy includes offline recovery. Actual browser offline emulation and Safari/iOS playback were not available and remain untested.
- `node qa/phase2_5-visual.browser.mjs` — PASS at 375 × 812, 390 × 844, and 430 × 932 for T01–T04 and `/relaksasi`, including horizontal overflow, source presence, footer clearance, and homepage/catalog regression. Updated evidence captures are in `docs/evidence/phase-2.5-review/`.
- All audio is ambient/instrumental only. T01/T02/T04 retain `SOURCE_REVIEWED` source status and `DRAFT` clinical status; T03 remains `DRAFT`. No clinical review is claimed.

## Phase 3 — maternity guides (23 October 2026)

Implemented `/hamil` and `/bersalin` as source-linked editorial guides using the approved Fraunces/DM Sans, cream/ivory, terracotta, forest-green, and six-tab navigation system. Existing approved routes and shared visual components were not redesigned. `/panduan/hamil` and `/panduan/bersalin` remain working aliases.

### Evidence

Agent Browser captures at 390 × 844 are in [`docs/evidence/phase-3-guides/`](evidence/phase-3-guides/):

- `hamil-first-390x844.png` and `hamil-full-390x844.png`.
- `bersalin-first-390x844.png` and `bersalin-full-390x844.png`.
- Approved-route smoke captures: `regression-homepage-390x844.png`, `regression-terapi-390x844.png`, `regression-terapi-teknik-pernapasan-390x844.png`, and `regression-relaksasi-390x844.png`.

Visual inspection found the guide hierarchy readable and consistent with the approved editorial direction. The full-page capture stitches fixed navigation at viewport coordinates; browser QA separately scrolled to the final source entry and verified clearance from the fixed bottom navigation.

### QA

- `node qa/phase3-guides.browser.mjs` — passed at 375 × 812, 390 × 844, and 430 × 932: direct routes and aliases, active Hamil/Bersalin tab, loaded hero images, source links, therapy/audio links, safety-heading association, horizontal overflow, and footer clearance. Browser history and keyboard reachability of skip and back controls were also checked.
- Approved-page smoke regression — Homepage, catalog, T01 detail, and Relaxation routes render at 390 px without horizontal overflow. Their layout and shared navigation were not modified; bottom-tab destinations for Hamil and Bersalin now point to the implemented routes.
- `pnpm.cmd typecheck` — passed.
- `pnpm.cmd build` — passed, including the existing PWA build.
- `git diff --check` — run after final edits.

### Content status and boundaries

Birth-plan preparation is mapped to NHS S17/S18; labor signs to S21; fetal movement and pregnancy warning symptoms to S19/S20; companion support to S17/S22; labor comfort-choice links to existing WHO/NICE/HDFT sources. The NHS sources are from the UK; care pathways and contact details vary locally, so pages direct readers to their own midwife/facility and do not show UK emergency numbers. The pregnancy comfort section does not prescribe an individual action. T03 is linked with an explicit limitation and is not presented as a validated exercise.

Both new guides carry internal `DRAFT` clinical-review metadata. No content is marked clinically approved. No new practice procedure, diagnostic advice, or clinical efficacy claim was added.

## Phase 3 final presentation cleanup (23 October 2026)

Presentation-only cleanup retained all claim/source IDs, article text, safety information, audio files, player behavior, and internal review metadata. In Detail Terapi, inline practice-source links and the top review banner were removed; one reusable, closed-by-default “Sumber Informasi” disclosure now lists deduplicated article references at the end. The existing “Sumber” anchor opens that disclosure. Maternity guides now use the same disclosure, have no inline source labels or top disclaimer, add a small safety-section shortcut, and omit the visible birth-photo caption. One short educational disclaimer remains at the end beside the source list.

On Beranda, the outdated review status labels were removed, the four-topic copy was updated to describe the available material, and the existing audio CTA remains linked to /relaksasi. The two hero CTAs and hero layout were unchanged.

The Relaxation page now presents a closed-by-default “Kredit dan lisensi audio” disclosure. It includes each original file name, creator, source link, license link/type, and format conversion. The rain audio credit states that ShareAlike terms are recorded for that audio file only, not the whole application. Audio files, player controls, and PWA caching were unchanged.

Agent Browser QA at 375 × 812, 390 × 844, and 430 × 932 checked routes, fixed navigation, overflow, initial closed state, centralized deduplicated references, removed labels/captions, safety links, anchor navigation, keyboard disclosure operation, footer clearance with disclosures expanded, and existing audio play/pause. Seven key 390 × 844 captures are in docs/evidence/phase-3-final-cleanup/: Beranda, Detail Terapi, an open source disclosure, Hamil, Bersalin, Relaksasi, and an open audio credits disclosure. Regression captures include the Homepage, therapy catalog, detail therapy, and Relaxation page.

- Phase 3 final cleanup Agent Browser script — PASS at all three requested viewports; includes footer clearance with source and audio disclosures open.
- Typecheck — PASS. Production build — PASS, including the existing PWA build.
- git diff --check — PASS; Git emitted only the repository's Windows LF-to-CRLF working-copy warnings.

Internal content review statuses are unchanged: T01/T02/T04 SOURCE_REVIEWED, T03 DRAFT; no article is marked CLINICALLY_REVIEWED. Safety copy and T03 limitations remain in place.

## Phase 4 — Evaluasi Kenyamanan Ibu (23 October 2026)

Route `/evaluasi` is implemented as a mobile-first, in-memory reflection form. The user selects one of five activity-context options and rates current comfort on a clearly anchored 1–5 scale. A result summarizes the selected context and self-reported rating without interpreting it as a diagnosis, treatment success, or evidence that an activity caused a change. A second rating after an activity is optional and only compares the two self-reported notes descriptively. The page offers a reset action and a concise safety reminder.

Answers live only in React state. There is no request or analytics event for an answer and no localStorage/sessionStorage persistence. A short notice tells users that answers disappear when the page is refreshed or closed. Required native radio groups provide validation; the activity and rating labels have at least 44px touch targets, and keyboard users can select them using native radio controls. Results move focus to the summary heading. The six-tab navigation is unchanged and Evaluasi is active on this route.

Evidence: `docs/evidence/phase-4-evaluation/evaluation-first-390x844.png`, `evaluation-full-390x844.png`, and `evaluation-result-390x844.png`. The full-page browser capture places the fixed bottom navigation at its viewport coordinate; separate scroll-to-bottom checks verified that the final privacy notice remains above the navigation. The first viewport and result capture were inspected directly.

Agent Browser QA (`node qa/phase4-evaluation.browser.mjs`) passed at 375×812, 390×844, and 430×932. It covered direct route and active tab, required-field validation, activity/rating selection, keyboard activation, submission, optional second rating, reset, no answer-related fetch/XHR/beacon, unchanged local/session storage counts, horizontal overflow, bottom-navigation clearance, and browser Back. Approved route smoke regression passed for Beranda, catalog, T01 detail, Relaksasi, Hamil, and Bersalin. Typecheck and production build passed; `git diff --check` passed.

The approved Screen 07 reference depicts separate 0–10 comfort and anxiety sliders. This Phase 4 implementation follows the task's explicit 1–5 comfort scale and activity selection, and adds the PRD's optional same-session repeat for a subjective comfort note; it does not collect anxiety. This is a documented scope-specific difference for visual review, not a change to the PRD or approved Design System. No medical score interpretation, diagnostic behavior, persistence, or clinical claim was added.

## Phase 4A — Evaluation experience refinement (23 October 2026)

`/evaluasi` now uses three in-page React states: **Sebelum aktivitas**, **Setelah aktivitas**, and **Ringkasan**. The activity chooser is five compact selectable options. The initial and optional follow-up notes each use two native 0–10 sliders for comfort and anxiety; neither appears selected until the user interacts. Stage 2 supports opening `/relaksasi` for the music activity, completing an after note, or viewing the initial note only. The summary shows the chosen activity, each recorded value, and neutral numeric differences without inferring benefit, diagnosis, or causation. A new evaluation clears all in-memory answers.

The evaluation context is mounted above the route tree so answers survive SPA navigation to Relaxation and back. Answers remain only in React memory: no browser storage, answer-bearing URL, network submission, or analytics was added. Refreshing the page clears them. Shared navigation, design tokens, and other approved pages were not changed.

Agent Browser evidence at 390 × 844:

- [Step 1 — before activity](evidence/phase-4a-evaluation/step-1-before-390x844.png)
- [Step 1 — scales filled](evidence/phase-4a-evaluation/step-1-scales-filled-390x844.png)
- [Step 2 — after activity](evidence/phase-4a-evaluation/step-2-after-activity-390x844.png)
- [Step 3 — complete summary](evidence/phase-4a-evaluation/step-3-summary-390x844.png)

`node qa/phase4a-evaluation.browser.mjs` passed at 375 × 812, 390 × 844, and 430 × 932. Coverage includes activity selection, unselected state and gentle validation, native slider keyboard Home/End at 0 and 10, initial-only summary, optional follow-up, increasing/decreasing/unchanged comparisons, reset, SPA navigation to Relaxation and back, loss of answers after reload, no answer-related network/storage activity, horizontal overflow, and bottom-navigation clearance. Approved route smoke checks passed for Homepage, therapy catalog, T01 detail, Relaxation, Hamil, and Bersalin.

`pnpm.cmd typecheck`, `pnpm.cmd build` (including the existing PWA `injectManifest`), and `git diff --check` passed. Screenshot review confirmed the compact activity options and the beginning of the first scale are visible on the 390 × 844 initial view. Step 3 intentionally focuses the summary heading, so its capture begins at the summary section. This page is ready for user visual review; it is not marked approved, and no commit or deployment was made.

## Phase 4B — final evaluation input refinement (23 October 2026)

The `/evaluasi` three-stage flow and in-memory `EvaluationContext` remain in place. Step 1 now uses a single native activity selector and labels the scales “Seberapa nyaman Ibu sekarang?” and “Seberapa cemas Ibu sekarang?”. A reusable `EvaluationRatingControl` presents a large value, native 0–10 range input, 44px minus/plus controls, minimum/maximum labels, and an explicit unselected state. The score state remains `null` until an interaction; pressing minus from that state records 0, while plus records 1. Both endpoints are valid, and adjustment is clamped to the range.

Step 2 now shows the compact initial note and both after-activity controls immediately. It offers “Lihat ringkasan”, “Lewati penilaian setelah aktivitas”, and, for the music activity, a link to `/relaksasi`. No activity re-selection or extra “open form” action is required. The summary continues to show before/after values and neutral differences, or the initial note alone when after-scoring is skipped.

The Phase 4A privacy model is unchanged: answers live only in React memory, survive SPA navigation, and clear on reload or reset. Browser QA intercepted fetch, XHR, and beacon calls during the evaluation flow and confirmed no answer transmission or browser storage change. No shared component, approved page, design token, PWA behavior, or route outside Evaluasi was changed.

Agent Browser screenshots at 390 × 844:

- [Step 1 — empty](evidence/phase-4b-evaluation/step-1-empty-390x844.png)
- [Step 1 — values filled](evidence/phase-4b-evaluation/step-1-filled-390x844.png)
- [Step 2 — after-activity controls visible](evidence/phase-4b-evaluation/step-2-after-activity-390x844.png)
- [Step 3 — comparison summary](evidence/phase-4b-evaluation/step-3-summary-390x844.png)

`node qa/phase4b-evaluation.browser.mjs` passed at 375 × 812, 390 × 844, and 430 × 932. It covered empty and selected states, validation, native select keyboard operation, range pointer and keyboard operation, 0/10 boundaries, minus/plus behavior and clamping, immediate Step 2 form, skip and complete summaries, reset/reload, SPA navigation with state retention, no network/storage side effects, overflow, and bottom-navigation clearance. Smoke regression passed for Homepage, catalog, T01 detail, Relaxation, Hamil, and Bersalin. Typecheck, production build, and `git diff --check` passed. The revised Evaluasi screen is ready for user visual review; no approval, commit, or deployment is implied.

## Final Evaluation alignment — one current-state assessment (23 October 2026)

The user-directed final revision replaces the three-stage activity-related flow with a single general assessment at `/evaluasi`. The activity selector, progress indicator, before/after scores, comparison, deltas, and activity-specific audio link are removed. The hero now reads “Bagaimana Perasaan Ibu Hari Ini?” with the approved botanical treatment and the requested current-state description. Two 0–10 sliders record comfort and anxiety, followed by one “Lihat hasil penilaian” action. The result presents only the two chosen scores and a neutral note, with “Isi penilaian lagi” to reset.

Each range starts with a `null` React value; its hidden native position at zero is not treated as a response. The visible state says “Belum dinilai” and no thumb is shown until interaction. A selected score appears inside a forest-green thumb, matching Screen 07; the native input keeps the accessible label, current `aria-valuetext`, 44px interaction height, keyboard and pointer support, and clear 0/10 anchors. An untouched keyboard slider explicitly records 0 from Left/Home and 10 from End; all submissions validate both values without interpreting them clinically.

Evaluation state is now local to the page. Repository search showed no other consumer of the evaluation context, so the provider and context file were removed. Answers are not sent to a server or analytics and are not written to localStorage/sessionStorage; reload or reset clears them. No design tokens, shared navigation, PWA configuration, or other page styles were changed.

The final evidence directory contains only the three requested 390 × 844 screenshots:

- [Unevaluated state](evidence/phase-4-final-evaluation/evaluation-empty-390x844.png)
- [Two selected values](evidence/phase-4-final-evaluation/evaluation-filled-390x844.png)
- [Assessment result](evidence/phase-4-final-evaluation/evaluation-summary-390x844.png)

The captures were reviewed against the approved Screen 07 composition: centered compact header, botanical editorial hero, two pale stacked measurement surfaces, terracotta slider track with a forest-green value thumb, full-width green CTA, and six-tab navigation. The updated required title/description and the bottom safety note are intentional content differences. The result view moves focus to its heading and therefore captures scrolled to the result section.

Agent Browser QA (`node qa/phase4-final-evaluation.browser.mjs`) passed at 375 × 812, 390 × 844, and 430 × 932. It checked no initial rating, valid 0/10 values, pointer and keyboard selection, focus, validation, results and reset, absence of activity/pre-post UI, no answer network/storage side effects, horizontal overflow, and bottom-navigation clearance. Regression smoke checks passed for Homepage, therapy catalog, T01 detail, Relaxation, Hamil, and Bersalin, including fixed navigation and correct active tab. Typecheck, production build, and `git diff --check` passed. Visual review is ready; this is not an automatic approval, and no commit or deployment was made.

## Final Evaluation slider fix and baseline checkpoint (23 October 2026)

The score thumb was visually stuck at the left because `--evaluation-thumb-position` was set on the native range input, while the visible score thumb is a sibling `<span>`. CSS custom properties inherit to descendants, not siblings, so the sibling received no `left` value and stayed at its static position. Both slider position and progress variables now live on the shared slider wrapper. The existing native range, `null` initial state, keyboard and pointer behavior, and focus-visible outline remain in place.

Removed the user-facing sentence that answers disappear on reload. Evaluation values remain in React state only; no server request, analytics or persistent browser storage was added. The safety reminder remains in place.

Agent Browser QA checks rendered thumb geometry at 0, 5 and 10 for both sliders, within 1.5 CSS pixels of the expected center, and captures those states at 390 × 844 under ignored `tmp/fidelity/phase-4-slider-positions/`. The three main screenshots remain in `docs/evidence/phase-4-final-evaluation/`. QA also checks visible keyboard focus, pointer/keyboard changes, validation, result/reset, no network or storage, exact 375/390/430 CSS viewports, bottom-navigation clearance, and regression smoke routes. The answer-disappearance sentence has been removed from the UI; values remain only in React state.

Final Agent Browser QA passed at 375 × 812, 390 × 844 and 430 × 932. At 390 × 844, both thumb centers matched the 0/5/10 positions at the minimum, midpoint and maximum. Focus-visible outlines remained present and did not change thumb geometry. Validation, pointer and keyboard input, summary, reset, reload privacy, no answer transmission/storage, horizontal overflow, nav clearance, and approved-route smoke checks passed. The production build and typecheck passed, and `git diff --check` passed.

**Status: PHASE 4 — FINAL EVALUATION UI/UX APPROVED.** Evidence: [unevaluated](evidence/phase-4-final-evaluation/evaluation-empty-390x844.png), [values 0/10](evidence/phase-4-final-evaluation/evaluation-filled-390x844.png), and [summary](evidence/phase-4-final-evaluation/evaluation-summary-390x844.png). Intermediate 0/5/10 captures are ignored temporary QA evidence. No deployment was performed.

## Relaxation Experience redesign — 23 October 2026

Updated only `/relaksasi` and its nested immersive route `/relaksasi/:trackId`, using the approved Screen 05 and Screen 06 compositions. The catalog keeps the editorial botanical introduction, active/inactive filters (Semua, Musik, Suara Alam), three compact illustrated rows, the fixed six-tab navigation, and the existing closed-by-default audio credits disclosure. No breathing collection or new audio was added. The search control filters the current three tracks locally.

The immersive player uses one persistent `<audio>` element owned by the nested route parent. Catalog and player controls share playback state, so returning to the catalog preserves the current source and position; selecting another track uses the same element. Playback starts only after an explicit play action. The player hides the bottom tabs and provides a clear back link, actual media duration/progress, seek, volume, play/pause, and previous/next. Missing media reports an actionable error. Slow background drift and catalog playback bars follow playback state; `prefers-reduced-motion` disables decorative motion. No timer, shuffle, repeat, favorite, or false control was added.

Three Pexels scenery photographs are recorded with source pages, photographers, the Pexels License, file dimensions, derivation crops, and output sizes in `assets/ASSET-LICENSE-MANIFEST.md`. The source pages provide photographic/camera metadata, but AI provenance and individual release evidence are **UNVERIFIED**. They are atmospheric imagery and do not represent therapeutic techniques. Image choice and visual composition remain pending the user's visual review.

Agent Browser QA (`node qa/relaxation-experience.browser.mjs`) covers filters/search/empty state, one audio element, no autoplay, real playback and pause, seek, volume, next-track continuation, browser Back, same-track position retention across catalog/player navigation, media loading/error UI, keyboard seek, reduced motion, closed/open credit disclosure, direct track routes, and mobile layout at 375 × 812, 390 × 844, and 430 × 932. Evidence:

- [Catalog — 390 × 844](evidence/relaxation-redesign/catalog-390x844.png)
- [Immersive player paused — 390 × 844](evidence/relaxation-redesign/player-paused-390x844.png)
- [Immersive player playing — 390 × 844](evidence/relaxation-redesign/player-playing-390x844.png)
- [Catalog with audio playing — 390 × 844](evidence/relaxation-redesign/catalog-playing-390x844.png)

Typecheck, production build, browser QA, `git diff --check`, and route smoke regression for Homepage, Therapy Catalog, Therapy Detail, Pregnancy Guide, Birth Guide, and Evaluation **PASS**. Browser QA confirms real playback advances, pause stops it, seek and volume change the media element, only one audio element exists, the active track resumes across the catalog/player route transition, no autoplay occurs, and no audio files are listed in the generated PWA service-worker precache. The browser used Chromium via Agent Browser; Safari/iOS playback has not been tested. No baseline approval, Git commit, or deployment is implied.

**Status: READY FOR USER VISUAL REVIEW.** The catalog and immersive-player compositions and new Pexels image choices have not yet been approved as a visual baseline.

## Curated relaxation music collection — initial candidate set (historical, 23 October 2026)

Added five candidate instrumentals to the existing catalog/player: *Gymnopédie No. 1*, *The Years Grow Quiet*, *Wholesome*, *Solace*, and *Sleep (Piano Only Mix)*. They remain **candidates pending human listening and user selection**; no subjective listening pass is claimed. Metadata describes instrumental character only and makes no clinical or effectiveness claims. The existing catalog and immersive-player design, shared single audio element, playback controls, categories, search, and artwork system are retained. The music category now contains six tracks; Suara Alam still contains two. The same three already documented Pexels photos are reused as catalog thumbnails/player backgrounds; no new image has been added.

The five source pages and license terms were checked, and source files are retained under `assets/audio/source/`. Four tracks are MP3 derivatives at 192 kbps; *The Years Grow Quiet* uses Wikimedia Commons' MP3 transcode (170 kbps) from the listed CC BY 4.0 FLAC page, with no further re-encode. Tracks are not trimmed. *Gymnopédie No. 1* receives 1 dB gain reduction before encoding to leave additional headroom. FFprobe verified durations: 3:07.09, 4:13.75, 6:03.81, 5:56.36, and 3:04.36. FFmpeg `ebur128` measurements on delivered MP3s reported integrated loudness −21.2, −16.3, −16.7, −14.4, and −14.8 LUFS respectively; true peaks −1.3, −1.2, −2.8, −1.2, and −1.3 dBFS. These are technical checks only and do not verify that a person hears no lyrics, distortion, or abrupt transitions.

Agent Browser evidence for the updated collection is saved in `evidence/relaxation-music-collection/`. QA extends the approved Relaxation player checks to all eight tracks: direct routes, local media metadata and duration, no autoplay, explicit playback/pause for a new track, filters/search, source/license disclosure, one audio element, image loading, seek/volume/previous/next, reduced motion, error state, overflow, fixed navigation clearance at 375×812, 390×844 and 430×932, and smoke regression of approved routes. Safari/iOS playback has not been tested. Audio derivatives remain excluded from PWA precache. No commit or deployment was made.

**Status: READY FOR USER AUDIO AND VISUAL REVIEW.**

### Earlier licensing hold before track replacement (historical, 23 October 2026)

Rechecked Scott Buckley's official track, usage, and licensing pages. Although `Solace` and `Sleep (Piano Only Mix)` have CC BY 4.0 pages and are listed for some website/software uses, the same official terms require synchronization with other media and prohibit resale in isolation and redistribution/reupload to music streaming platforms. Ruang Ibu's standalone, on-demand catalog/player use is not clearly resolved by those terms. Both records now carry internal `NOT_CLEARED_FOR_PUBLIC_RELEASE` status. Their files remain only in this un-deployed candidate branch; do not publish them unless the rights holder clarifies this exact use or replacement music is selected.

Suggested replacements for user review only: Kevin MacLeod's `Avec Soin` and `Friday Morning`. Incompetech identifies both as CC BY 4.0 and its official FAQ explicitly allows streaming-site use with credit. They were not downloaded, integrated, or heard for this check; user choice and listening review remain pending.

Loading audit: catalog mounts one `<audio preload="none">` element without a source. The source is assigned only after an individual track selection; the build's PWA glob includes HTML/JS/CSS/WebP/WOFF2 and excludes MP3. Agent Browser checks verify zero audio resource requests on initial catalog load, exactly one request after selecting the first track, and no MP3 URL in the built service-worker precache. The existing credit disclosure continues to expose each track title, creator, source URL, license URL, original filename, and conversion note. No layout, imagery, player control, filter, or animation changed.

Listening checklist for each of the five new music candidates (Gymnopédie No. 1, The Years Grow Quiet, Wholesome, Solace, Sleep):

- Listen near the beginning, middle, and end.
- Check that playback volume feels comfortable and consistent; listen for sudden loudness jumps.
- Note any abrupt changes, distortion, unwanted sounds, or lyrics.
- Decide whether the overall character fits the intended quiet/restful collection.
- Record the track, timestamp, issue (if any), and keep/remove recommendation. This is a subjective user review, not a medical assessment.

Typecheck, production build, `git diff --check`, and targeted Agent Browser checks pass. No commit or deployment was made. **Waiting for user selection of the final music collection.**

### Final music replacement QA (23 October 2026)

Replaced only the two Scott Buckley candidates with *Avec Soin* and *Friday Morning* by Kevin MacLeod. Incompetech's exact track pages identify the matching ISRCs (USUAN1100860 and USUAN1100224), source lengths (2:25 and 3:30), creator, and CC BY 4.0 attribution. Its [FAQ](https://incompetech.com/music/royalty-free/faq.html) explicitly allows streaming-site use with credit; the app's closed-by-default but readily discoverable “Kredit dan lisensi audio” disclosure includes title, creator and incompetech.com, track-page link, CC BY 4.0 license link, original filename, and conversion note.

FFprobe confirms the delivered files are MP3 stereo 44.1 kHz / 192 kbps: Avec Soin 145.084 s, 3,483,746 bytes, −16.6 LUFS, LRA 12.6 LU, true peak −0.3 dBFS; Friday Morning 210.312 s, 5,049,251 bytes, −28.5 LUFS, LRA 7.2 LU, true peak −9.3 dBFS. Friday Morning's downloaded embedded cover art was not included in the audio-only derivative. No file was trimmed, remixed, or gain-adjusted. These technical measurements do not replace listening review; human listening for the start, middle, end, volume comfort, abrupt changes, distortion, and suitability remains **PENDING**.

The active collection still has eight tracks (six music, two nature), with total served audio size 32,902,090 bytes. Scott Buckley's Solace and Sleep files were removed from source assets, public assets, and the current build; the old direct routes now show the “Audio tidak ditemukan” fallback with a return link to `/relaksasi`. Their former NOT CLEARED status and rights decision remain documented as historical context only. The existing artwork and all catalog/player layout, controls, filters, backgrounds, and animation remain unchanged. Artist name was added to local search matching.

Updated Agent Browser evidence at 390 × 844:

- [Relaksasi catalog](evidence/relaxation-music-collection/catalog-390x844.png)
- [Avec Soin immersive player](evidence/relaxation-music-collection/player-avec-soin-390x844.png)

The focused browser QA verifies eight catalog rows, six Musik/two Suara Alam filter counts, title and creator search, credits and license links for all tracks, on-demand-only audio requests, explicit play/pause for each of the five expanded music tracks, valid media metadata, player navigation/seek/volume, no autoplay or duplicate audio element, graceful old Scott route fallback, no MP3 in PWA precache, and layout/nav clearance at 375 × 812, 390 × 844, and 430 × 932. Human listening remains unverified. No commit or deployment was made.

### Website completion sprint — 23 October 2026

Activated the approved homepage hamburger menu and added the About Ruang Ibu, source directory, FAQ, and safety-information routes. The menu follows the approved Screen 08 information hierarchy, keeps all six primary destinations, and closes on route navigation. It locks background scroll, makes the background inert while open, supports Escape and keyboard focus cycling, and restores focus to the menu trigger when dismissed without navigating. About and information pages use the existing editorial type and color tokens, retain the six-tab navigation, and link to relevant existing app routes.

Agent Browser QA passed using Chromium with CSS viewports confirmed at 375 × 812, 390 × 844, 430 × 932, and 1440 × 900. It verified the menu destinations, direct loading of `/tentang`, `/sumber`, `/faq`, and `/tanda-bahaya`, six-tab navigation, homepage footer destinations, keyboard focus behavior, scroll locking, focus restoration, and no horizontal overflow on the homepage or menu. Evidence: [About — 390 × 844](evidence/website-completion/tentang-390x844.png), [menu — 390 × 844](evidence/website-completion/menu-390x844.png), and [menu — 1440 × 900](evidence/website-completion/menu-desktop-1440x900.png). Typecheck, production build, and `git diff --check` pass.

The approved Relaxation catalog, player, and eight-track collection were left unchanged. Audio deep QA was not repeated in this sprint. Human listening remains pending for the collection; note the measured loudness difference between *Avec Soin* (−16.6 LUFS) and *Friday Morning* (−28.5 LUFS) for Final Release QA. No commit or deployment was made.

### Final frontend checkpoint verification — 23 October 2026

Final Agent Browser smoke QA passed for direct loading of all application routes, including the four utility pages and all eight active audio routes. The homepage menu and six-tab navigation passed at 375 × 812, 390 × 844, 430 × 932, 1280 × 720, and 1440 × 900. The menu's scroll container and Tanda Bahaya destination remain reachable at 1280 × 720. Evaluation QA passed for the current comfort/anxiety-only form, validation, summary/reset, and no answer network or persistent-storage use. Audio QA passed for eight listed tracks (six music, two nature), real play/pause, seek, volume, track navigation, no autoplay, single audio element, on-demand loading, credits, and exclusion from PWA precache. Typecheck, production build, and `git diff --check` passed. No deployment was performed.

Items still requiring separate Final Release QA: real Safari/iOS playback; offline PWA behavior on a device; human listening of all eight tracks, including the measured *Avec Soin* (−16.6 LUFS) versus *Friday Morning* (−28.5 LUFS) loudness difference; source/content verification for the Tanda Bahaya page; final license/provenance checks for photographic assets (AI origin and model releases remain unverified where recorded); and a Cloudflare Pages deployment test. These have not been treated as passed or as approval for public release.

### Customer content revision - 25 October 2026

Integrated the customer's six trimester III education topics and six labor topics into `/hamil`, `/bersalin`, the existing `/terapi` catalog, and reusable therapy detail pages. The guide pages keep the approved editorial layout and safety content; no homepage, design token, six-tab navigation, audio, evaluation, or PWA configuration was intentionally changed. New practice-sensitive content remains draft pending clinical review, and the articles avoid unsourced procedural details.

Automated content coverage passed for all 12 topic IDs and mandatory customer references C01-C08. `npm.cmd run typecheck`, `npm.cmd run build` (including PWA service-worker generation and 31 precache entries), and `git diff --check` passed. No lint script exists in `package.json`.

Agent Browser QA used CSS viewports 375 x 812, 390 x 844, 430 x 932, and 1440 x 900. The guide pages, catalog, and a new detail route had no horizontal overflow. Direct detail-route loading and browser Back navigation worked. The Hamil/Bersalin catalog filters returned 6 items each; search for "kompres" returned the separate pregnancy and labor entries. The references disclosure started closed and opened with keyboard focus plus Enter. The source directory displayed C01-C08 with DOI links. Homepage and the six primary tabs remained present. The evaluation route loaded with its two existing sliders. The relaxation page retained all eight tracks; the first track responded to play and pause. Browser error output contained no page errors; console output contained Vite/React development notices only.

390 x 844 evidence:

- [Panduan Hamil](evidence/customer-revision-2026/panduan-hamil-390x844.png)
- [Panduan Bersalin](evidence/customer-revision-2026/panduan-bersalin-390x844.png)
- [Katalog Jenis Terapi](evidence/customer-revision-2026/katalog-terapi-390x844.png)
- [Artikel kompres hangat saat hamil](evidence/customer-revision-2026/artikel-kompres-hamil-390x844.png)
- [Sumber informasi terbuka](evidence/customer-revision-2026/sumber-terbuka-390x844.png)

Bibliography metadata corrections and source limitations are recorded in [customer content revision notes](content-research/CUSTOMER-CONTENT-REVISION-2026.md). Revised education remains unapproved for clinical practice claims until appropriate clinical review. No commit, push, or deployment was made.

### Koreksi editorial customer — 25 Oktober 2026

Seluruh 12 pembahasan diperiksa, termasuk artikel yang digunakan ulang untuk dua konteks. Copy internal dihapus dari materi yang dirender; status clinical review dalam data tetap `draft`. Tabel sebelum/sesudah dan alasan tersedia di [audit editorial](content-research/CUSTOMER-CONTENT-EDITORIAL-AUDIT-2026.md).

Agent Browser memuat setiap route detail untuk A01-A06 dan B01-B06, serta artikel T03. Pada `/hamil`, `/bersalin`, `/terapi`, dan artikel kompres hamil, CSS viewport 375 × 812, 390 × 844, serta 430 × 932 tidak menunjukkan horizontal overflow. Masing-masing panduan menampilkan enam tautan topik. Katalog menampilkan 11 artikel; filter Hamil/Bersalin/Relaksasi menghasilkan 6/6/5 artikel, dan pencarian “kompres” menampilkan dua konteks yang terpisah. Disclosure sumber pada artikel mulai tertutup dan terbuka lewat fokus keyboard + Enter. `/sumber` menampilkan 33 sumber, termasuk delapan jurnal customer dengan tautan DOI.

Screenshot 390 × 844:

- [Katalog Terapi](evidence/customer-revision-2026/katalog-terapi-390x844.png)
- [Panduan Hamil](evidence/customer-revision-2026/panduan-hamil-390x844.png)
- [Panduan Bersalin](evidence/customer-revision-2026/panduan-bersalin-390x844.png)
- [Kompres Hangat — tampilan awal](evidence/customer-revision-2026/artikel-kompres-hamil-390x844.png)
- [Kompres Hangat — panduan praktik](evidence/customer-revision-2026/kompres-hamil-panduan-390x844.png)
- [Disclosure sumber terbuka](evidence/customer-revision-2026/sumber-terbuka-390x844.png)

`npm.cmd run test:content` memeriksa semua ID topik dan C01-C08, tautan ACOG, panduan kompres, status klinis internal, serta frasa internal yang dilarang pada copy production-facing. Typecheck, production build, `git diff --check`, dan pemeriksaan runtime browser dicatat setelah selesai. Tidak ada commit, push, atau deployment.

### Final editorial polish dan gambar konten (25 Oktober 2026)

Panduan kompres A04 kini memakai pengantar dan lima langkah bernomor sesuai redaksi customer; pemeriksaan mobile memastikan marker angka terlihat. Intro Panduan Hamil dan Bersalin serta deskripsi katalog dipersingkat, tanpa mengubah hero atau struktur visual. Deskripsi kartu tidak lagi dipotong dengan line clamp.

Tujuh artikel baru menampilkan gambar editorial setelah pengantar: A01, A04, A05, A06, B01, B05, dan B06. Gambar musik/pernapasan pada artikel existing tetap menggunakan komposisi yang disetujui. Thumbnail katalog membedakan punggung, pijat prenatal, dukungan selama kehamilan/persalinan, dan kompres; musik dan pernapasan tetap memakai gambar artikel bersama. Sumber/kreator, lisensi, derivatif WebP, dan hal yang belum terverifikasi dicatat dalam [manifest lisensi aset](../assets/ASSET-LICENSE-MANIFEST.md).

`npm.cmd run test:content`, `npm.cmd run typecheck`, `npm.cmd run build` (termasuk service worker PWA, 49 aset precache), dan `git diff --check` lulus. Agent Browser memeriksa katalog pada 375, 390, 430, dan 1440 px; tidak ditemukan horizontal overflow. Tujuh gambar konten dimuat pada route masing-masing. Filter katalog menghasilkan 6/6/5 untuk Hamil/Bersalin/Relaksasi; pencarian kompres menemukan dua artikel sesuai konteks. Direct route, browser Back, disclosure sumber dengan Enter, Beranda, Relaksasi (delapan audio), dan Evaluasi diperiksa; tidak ada runtime error browser.

Evidence akhir 390 x 844 (katalog desktop 1440 x 900): [folder screenshot](evidence/customer-revision-final-polish/). Status clinical review konten tetap draft. Tidak ada commit, push, atau deployment.

### Koreksi layout detail terapi (25 Oktober 2026)

Atas keputusan desain final, gambar editorial besar dan field `contentImage` dihapus dari artikel detail. Jalur detail kembali text-first: navigasi anchor langsung diikuti section “Apa itu?”. Tujuh WebP 1200 × 800 yang tidak lagi dipakai dihapus setelah pencarian repository; foto sumber, ilustrasi SVG sumber, dan seluruh thumbnail WebP katalog tetap tersedia. `npm.cmd run test:content`, typecheck, production build PWA, dan `git diff --check` lulus. Agent Browser memeriksa 375, 390, dan 430 px; detail A01/A04 tidak memiliki gambar, section pertama mengikuti blok pengantar/navigasi, katalog tetap menampilkan 11 thumbnail, filter Hamil/Bersalin/Relaksasi menghasilkan 6/6/5 item, dan pencarian “kompres” menampilkan dua konteks. Tidak ada horizontal overflow atau runtime error. Screenshot baru tersedia di folder `evidence/customer-revision-detail-text-first/`.

### Milestone 1 — UX foundation and navigation fix (26 October 2026)

**Baseline and branch:** fetched `origin`; latest `origin/main` was `814462bc0e68f947ee7ac95b6011af7cc0e89110`, which includes customer source-link commit `32ca033`. The M1 branch `feat/ruang-ibu-revision-2026-m1-ux` was created from that baseline. Working tree was clean before the branch change.

**Scroll root cause:** the app used `BrowserRouter` and ordinary `<Routes>` without route-level scroll management. A React Router PUSH left the prior global `window.scrollY` in place as the new detail route rendered, so a detail article could begin below its title. The article scroll-margin rule also targeted a wrapper for Sources while the fragment ID belongs to the nested disclosure section.

**Implementation:** a global route scroll manager uses React Router location, `location.key`, pathname, hash, and navigation type. New route PUSH/REPLACE navigation starts at the top; POP restores the outgoing history entry's saved x/y from bounded `sessionStorage`; initial direct visits start at the top unless a hash is present. The five article anchors use React Router Links so hash PUSH/POP/Forward navigation is managed with route state; hash targets are revealed and Sources disclosures open when appropriate. Position capture happens only on route transitions, with no persistent scroll listener. Catalog category and search state use replace-only URL parameters and do not reset scroll. Article links mark their catalog origin so the header Back control performs history Back and restores its prior catalog entry. Existing article names, content, source URLs, images, and category metadata were not edited.

`node qa/route-scroll.browser.mjs` (also available as `npm.cmd run test:browser:route-scroll`) passed in Agent Browser/Chromium. It covered:

| Case | Result | Evidence |
|---|---|---|
| TC01 — lower catalog card opens its article with the title visible from the top | PASS | Article 8 opened at `scrollY: 0`; title remained below the 68 px header. |
| TC02 — browser Back restores the previous catalog position | PASS | Restored within 3 px of the saved lower-list position. |
| TC03 — Hamil filter and search survive detail → Back | PASS | URL, selected filter, query value, and one matching article restored. |
| TC04 — direct article URL starts at the top | PASS | Verified all 11 card destinations and matching H1s. |
| TC05 — article anchors and Sources disclosure | PASS | All five fragments resolve; direct Sources hash also opens the disclosure. |
| TC06 — Forward after Back returns to the same detail and position | PASS | Article route and its saved top position restored. |
| TC07 — six primary tabs remain navigable | PASS | Beranda, Terapi, Hamil, Bersalin, Relaksasi, Evaluasi each loaded with one active tab. |
| TC08 — keyboard navigation | PASS | Skip link, article anchor, and article Back link activated by keyboard. |
| TC09 — reduced motion | PASS | Emulated `prefers-reduced-motion: reduce`; computed document scroll behavior was `auto`. |
| TC10 — responsive layout and fixed-tab clearance | PASS | No horizontal overflow at 360×800, 375×812, 390×844, 430×932, or 1440×900; last article link cleared the bottom tab. |

Additional checks passed: filter counts were 6/6/5/11 for Hamil/Bersalin/Relaksasi/Semua; changing a filter or typing a query preserved a 100 px scroll position; every article had unique IDs; source links remained intact; no browser page errors occurred. Direct route smoke also passed for `/panduan/hamil`, `/panduan/bersalin`, `/tentang`, `/sumber`, `/faq`, `/tanda-bahaya`, and `/relaksasi/rain`. A selected relaxation track continued playing and its time advanced across browser Back and Forward. Evaluation values stayed in transient React state: the privacy browser check found no `localStorage`/`sessionStorage` change and no fetch, XHR, or beacon request after rating and submission. The generated service worker contains no audio MP3 precache entry (42 precache entries total).

Contrast calculations on the existing token colors passed for the inspected pairs: terra article heading on paper **7.32:1**, muted text on paper **4.99:1**, catalog text on ivory **5.59:1**, white on forest **9.75:1**, and danger text on its pale surface **4.72:1**. The rendered catalog and article keep the approved botanical header, stacked cards, Fraunces/DM Sans, six-tab navigation, and text-first reading layout; no material visual deviation was found in the inspected 390×844 screenshots.

**Screenshots after the change (390×844):** [catalog top](evidence/m1-ux/catalog-top-390x844.png), [catalog restored at the lower list](evidence/m1-ux/catalog-return-390x844.png), [article first viewport](evidence/m1-ux/article-top-390x844.png), and [article Sources disclosure](evidence/m1-ux/article-source-anchor-390x844.png). A before screenshot was not captured. Browser viewport emulation was used; no physical iPhone or Android device was tested.

**Regression checks:** `npm.cmd run test:content` passed (12 topics and C01–C08); `npm.cmd run typecheck` passed; `npm.cmd run build` passed (including PWA injectManifest); `git diff --check` passed. `package.json` has no lint script. No Cloudflare/D1 configuration or content, references, or service-worker rules changed. The clinical review log remains pending; no clinical approval is claimed. No commit, push, merge, or deployment was made.
## M2 scientific content and article figures — 27 October 2026

- `npm.cmd run test:content` passed: 11 articles, 12 topics, customer sources C01–C08, reference ID checks, 10 new research records, source-mapped guidance, and 11 documented figure assets.
- Chromium DevTools Protocol fallback QA (`npm.cmd run test:browser:m2`) passed across 360×800, 375×812, 390×844, 430×932, and 1440×900 for all 11 article routes. It checked visible titles, successful SVG loads, captions, guide steps/source anchors, duplicate IDs, horizontal overflow, final-link clearance above the bottom navigation, source disclosure and exact source fragments (including practical-step links), catalog scroll restoration, the relaxation audio page, reduced-motion emulation, and uncaught JS exceptions.
- The Agent Browser CLI 0.27.0 could not establish its CDP response channel in this environment (`Auto-launch failed: CDP response channel closed`). The fallback controlled local headless Chrome over DevTools Protocol. This is browser viewport emulation, not physical-device testing.
- Screenshots (390×844) are in [`evidence/m2-content/`](evidence/m2-content/): A01 Nyeri Punggung and B05 Kompres Persalinan.
- Article figures are original abstract SVGs with 960×540 intrinsic dimensions and responsive 16:9 rendering. No external image sources or clinical/anatomical diagrams were added.
- Clinical review is still `draft`; the visible text says the material remains under clinical review. No clinical approval is claimed. Audio assets remain loaded on demand; production build output must be checked for MP3 precache exclusion.

### M2.1 visual semantics, source anchors, and public source QA — 27 October 2026

Reauthored all 11 article SVGs as distinct editorial scenes: A01 lower-back discomfort; A04 cloth-covered warm source beside a pregnant person; A05 prenatal massage consultation; A06 pregnancy concern conversation; B01 supported labor; B05 midwife offering a cloth-covered warm compress in care; B06 communication with a care team; T01 calm breathing without a named protocol; T02 headphones and music; T03 calm grounding context; T04 consent-led supportive touch. Each detail figure retains its stable article ID mapping and now has article-specific alt text and caption. The updated contact sheet and figure screenshots are in [`evidence/m2-content/`](evidence/m2-content/); no external image assets were introduced.

The source deep-link issue came from searching descendants of the `<li>` source target for a `<details>` element: the disclosure is its ancestor. Hash navigation could also be skipped when React Router retained the same history key. The manager now opens the closest disclosure ancestor and schedules the scroll after layout; hash changes are handled before the same-key early return. Disclosure hash matching accepts the section ID and individual source IDs. Browser regression confirms direct `/terapi/nyeri-persalinan#section-referensi-S8` opens the disclosure and places the exact source row in the viewport, the external link remains available, and keyboard Enter plus Back/Forward work.

S3/S4 (Cochrane 2018) and S28 (2021 review) are retained in the internal register as historical sources, removed from current public article/guide mappings, and excluded from `/sumber`. S1 WHO 2018 remains labeled as a guideline; S27 ACOG 2020 remains labeled as official health information. All source types display on article, guide, and public source pages. C01–C08 remain intact. The clinical review log is still unfilled; no clinical approval is claimed.

**Fresh checks:** `npm.cmd run test:content`, `npm.cmd run typecheck`, `npm.cmd run build`, `npm.cmd run test:browser:m2`, and `git diff --check` passed. The Chromium CDP suite covered 11 articles at 360×800, 375×812, 390×844, 430×932, and 1440×900, plus source anchors, title/reset and catalog Back restoration, captions, source-mapped practical steps, reduced motion, audio route, overflow, bottom-tab clearance, and page exceptions. Contact sheet screenshot: [`illustration-contact-sheet-1440.png`](evidence/m2-content/illustration-contact-sheet-1440.png). Example focused figures: [A01](evidence/m2-content/nyeri-punggung-kehamilan-figure-390x844.png), [B01](evidence/m2-content/nyeri-persalinan-figure-390x844.png), [B05](evidence/m2-content/kompres-hangat-persalinan-figure-390x844.png). The Agent Browser CLI failed to initialize (`CDP response channel closed`), so browser checks used headless Chrome over the DevTools Protocol; no physical device was tested. `npm.cmd run test:browser:route-scroll` therefore remains unavailable in this environment. The regression fallback exercised push/reset, catalog Back, direct hash, and hash Back/Forward. No commit, push, merge, or deployment was made.

### M2.3 — Foto nyata untuk seluruh materi (27 Oktober 2026)

Sebelas figure artikel memakai foto Pexels lokal berformat WebP. Foto katalog yang sebelumnya ilustrasi atau objek-only diganti dengan crop foto. Kredit courtesy ditampilkan pada caption dan tertaut ke halaman foto asli. Lisensi Pexels mengizinkan penggunaan web dan modifikasi; status model release individual serta asal-usul AI tidak tersedia secara publik dan tetap **UNVERIFIED**. A04 menggambarkan suasana istirahat dan B05 menggambarkan dukungan persalinan; kedua caption menyatakan kompres tidak terlihat. Clinical review tetap `draft`.

Chromium CDP memakai profil QA terpisah dan memeriksa 11 artikel pada 360 × 800, 375 × 812, 390 × 844, 430 × 932, serta 1440 × 900. Pemeriksaan meliputi pemuatan figure/caption/thumbnail, anchor dan disclosure sumber, detail dari posisi atas, Back/Forward dan pemulihan scroll katalog, reduced motion, audio, Evaluasi, halaman sumber, overflow, jarak bottom navigation, dan uncaught JavaScript exceptions. Semua assertion lulus. Link sumber diperiksa bisa menerima fokus keyboard; sesi ini tidak mengirim input Tab/Enter sintetis. Tidak ada perangkat fisik yang diuji.

Evidence: [contact sheet 11 foto](evidence/m2-content/m2.3/photo-contact-sheet-final-1440.png), [katalog mobile](evidence/m2-content/m2.3/catalog-mobile-390x844.png), [katalog desktop](evidence/m2-content/m2.3/catalog-desktop-1440x900.png), [figure A01](evidence/m2-content/m2.3/nyeri-punggung-kehamilan-figure-390x844.png), [figure B01](evidence/m2-content/m2.3/nyeri-persalinan-figure-390x844.png), dan [figure B05](evidence/m2-content/m2.3/kompres-hangat-persalinan-figure-390x844.png). Per foto, lisensi, batasan, dan ukuran dijabarkan di [audit M2.3](evidence/m2-content/M2.3-PHOTO-AUDIT.md) dan [manifest aset](../assets/ASSET-LICENSE-MANIFEST.md).

### M2.3 final photo polish — 27 Oktober 2026

- Foto A04, A05, A06, B01, B05, T01, dan T02 yang sudah diterima pengguna dipertahankan tanpa perubahan.
- A01 dipertahankan. Pemeriksaan crop menunjukkan bahwa wajah berada di luar frame sumber; crop tidak dapat memperbaiki komposisi dan justru menghilangkan konteks punggung bawah.
- B06 diganti dari foto dengan pintu rumah sakit dominan ke foto Hannah Barata tentang pendampingan ibu selama persalinan di rumah. Koreksi tonal ringan dipakai agar interaksi lebih mudah terlihat. T03 memakai foto Gisele Seidel yang menunjukkan ibu hamil beristirahat dengan mata terpejam. T04 mempertahankan foto genggaman tangan yang sama dengan koreksi tonal ringan. Caption dan alt text disesuaikan dengan adegan yang benar-benar tampak.
- Thumbnail B06, T03, dan T04 diselaraskan dengan foto masing-masing. Aset artikel tetap WebP responsif; thumbnail 360 × 340 WebP. Manifest mencatat sumber, lisensi, dan transformasi.
- `npm.cmd run test:browser:m2` lulus menggunakan Chromium headless dan CDP terisolasi (port 9340): 11 route × 5 viewport, loading figure dan caption, navigasi sumber, history/scroll restoration, audio, reduced motion, overflow, dan JavaScript exceptions. Screenshot serta contact sheet baru ada di folder evidence M2.3. Sesi menguji fokus tautan sumber, tetapi tidak mengirim input keyboard Tab/Enter sintetis.
- Lulus: `npm.cmd run test:content`, `npm.cmd run typecheck`, `npm.cmd run build` (PWA precache 71 aset), dan `git diff --check`. Tidak ada klaim pengujian perangkat fisik atau persetujuan klinis.

### M4 admin dashboard — 27 Oktober 2026

- Dashboard lokal `/admin` memakai endpoint API M3 dan token desain Ruang Ibu. Tidak ada autentikasi custom, data fallback, data admin di Web Storage, atau kontrol purge. Nilai retensi tetap diberi label belum disetujui customer.
- Browser Chromium menggunakan fixture jaringan sintetis yang dipasang oleh QA runner sebelum aplikasi memuat. `npm.cmd run test:browser:admin` lulus; overview, inbox, dan detail diuji pada 360×800, 375×812, 390×844, 430×932, 768×1024, 1024×768, dan 1440×900 tanpa horizontal overflow. Alur filter URL, cursor pagination, approve/reject/hide, jawaban/edit, 409 refresh, delete, error 401/403/503/network, keyboard drawer/dialog, penyimpanan privat, dan route offline denylist tercakup.
- Evidence sintetis terbaru: [overview desktop](evidence/m4-admin/overview-desktop-1440x900.png), [overview mobile](evidence/m4-admin/overview-mobile-390x844.png), [inbox desktop](evidence/m4-admin/questions-inbox-desktop-1440x900.png), [inbox mobile](evidence/m4-admin/questions-inbox-mobile-390x844.png), [detail pending](evidence/m4-admin/pending-detail-390x844.png), [form moderasi](evidence/m4-admin/moderation-form-390x844.png), [editor jawaban](evidence/m4-admin/answer-editor-desktop-1440x900.png), [riwayat](evidence/m4-admin/history-mobile-390x844.png), [pengaturan](evidence/m4-admin/settings-desktop-1440x900.png), [empty state](evidence/m4-admin/empty-state-mobile-390x844.png), dan [state Access belum tersedia](evidence/m4-admin/auth-unavailable-mobile-390x844.png). [Galeri review](evidence/m4-admin/review-gallery.html). Screenshot memakai data sintetis, bukan pertanyaan pengunjung.
- Analisis build sebelum code splitting mencatat entry chunk 529.73 KB (154.32 KB gzip). Setelah route admin memakai `React.lazy`, entry menjadi 478.66 KB (141.27 KB gzip), turun 51.07 KB / 13.05 KB gzip. Chunk admin terpisah: `AdminLayout` 14.78 KB JS + 17.63 KB CSS dan `AdminPages` 36.16 KB JS. Entry tidak memuat string UI admin.
- Service worker mengecualikan asset statis admin dari precache karena dashboard Access-only tidak tersedia offline; output build terbaru memuat 72 precache entries (3590.02 KiB), turun dari 75 (3656.98 KiB). Manifest hasil build tidak berisi chunk admin, URL `/api/admin`, atau MP3. API tetap no-store dan service worker menolak admin/API pada SPA fallback/cache.
- `npm.cmd run test:browser:m2` dan `npm.cmd run test:browser:route-scroll` kini menjalankan fallback Chromium CDP dengan timeout per command. Coverage lulus: katalog di lima lebar, detail dari posisi katalog bawah, Back/Forward dan pemulihan posisi, filter+pencarian, 11 foto artikel, hash individual S8 dan disclosure, route/player/audio asset lokal, evaluasi tanpa persistence/network, enam tab publik, reduced motion, overflow, serta exception runtime. Playback audio tidak diuji oleh fallback CDP.
- Agent Browser CLI lama melaporkan `CDP response channel closed`; script lama tetap ada di `test:browser:m2:legacy` dan `test:browser:route-scroll:legacy`, tetapi macet tanpa progress pada sesi ini. QA fallback dijalankan pada headless Chrome dengan `--user-data-dir` terpisah di direktori Temp dan port 9341; tidak ada proses Chrome pengguna yang dihentikan. Vite 5173 sedang terpakai, sehingga aplikasi QA dilayani pada 5174.
- Konfigurasi Cloudflare Access wajib melindungi `/admin`, `/admin/*`, serta `/api/admin/*`; M4 UI bukan batas autentikasi. D1/Access/Turnstile Preview belum diprovision atau diuji end-to-end. M4 belum dideploy; M5/M6 belum dimulai.
# M5A Public Q&A local QA (2026-10-28)

- Public form is appended after `Sumber Informasi` on all therapy article detail routes, preserving the existing article design and six-tab navigation.
- Inputs: optional display name, required 10–1,000 character question, explicit consent to moderation/public display, and official Turnstile widget. The UI does not collect email or persist form state.
- The existing question registry maps article IDs to canonical API slugs, including legacy route aliases. New rows remain pending; public GET only renders approved/answered data. User-provided strings render as normal React text.
- Browser fixture QA at 390×844 exercised the widget callback handoff, required consent, correct article slug, optional-name omission, pending receipt, disclaimer, and XSS-safe rendering. Browser API/widget responses were synthetic and did not write to D1.
- Backend end-to-end test used in-memory SQLite and a test-only Turnstile verifier to exercise submit → hidden pending → approve → public read → answer → answered public read.
- Real QA deployment, Cloudflare Turnstile Siteverify, staging D1 write, Owner UI workflow on a submitted row, and deployed CSP/header behavior are NOT TESTED. Deployment is awaiting separate authorization. Configure Preview-only `TURNSTILE_SITE_KEY`, encrypted `TURNSTILE_SECRET_KEY`, exact QA `TURNSTILE_ALLOWED_HOSTNAMES`, and `RATE_LIMIT_HMAC_KEY` before that test. No production change or remote staging write occurred.
- Final local regression on 2026-10-28: backend **45/45 PASS**; content regression, typecheck, build/PWA, public Q&A browser fixture, public M2/route-scroll browser suite, Admin CMS browser fixture, and `git diff --check` pass. Browser suites ran against local Vite using an isolated headless Edge CDP profile, not a physical phone or Cloudflare deployment. Coverage includes 11 article photos, the S8 hash target inside the opened Sources disclosure, catalog Back/Forward restoration, filter/search, audio asset availability (playback not exercised), ephemeral evaluation, six public tabs, reduced motion, and no overflow at configured widths.
- The S8 deep-link QA exposed a timing race between disclosure expansion and browser fragment handling. `RouteScrollManager` now performs one bounded, cancellable final alignment after a short delay. No repeated scroll listener or unbounded retry was added. Regression confirms the source row is visible after direct hash navigation.
- The Admin browser fixture now models a revoked session consistently: after an admin API 401, its follow-up session check also returns 401 and the UI remains on `/admin/login` without private dashboard content. This updates the fixture to match the existing fail-closed session behavior; dashboard business logic was not changed.

### M5 UX direct-publication revision (2026-10-28; supersedes M5A Q&A behavior above)

- Article detail now places Tanya Jawab before the `Sumber Informasi` disclosure. Source disclosure IDs and individual reference anchors are unchanged.
- The form starts closed. “+ Ajukan Pertanyaan” opens it, “Tutup” closes it and returns focus, and a successful send closes the form, announces success, and inserts the safe receipt into the visible list without reloading.
- A validated, low-risk submission is immediately public as unanswered only after Origin, consent, rate-limit, Turnstile Siteverify, and storage checks succeed. The existing D1 `approved` state is used for compatibility and is labeled “Belum dijawab” in the public UI. Admin answers move it to `answered`; separate approval is not required for new questions. Historical pending rows remain untouched and are never exposed automatically.
- Turnstile is Managed with `appearance: interaction-only` and `execution: execute`; token acquisition begins on submission. Local browser fixtures verify expired-token retry behavior and ensure an expired token is not POSTed. Backend SQLite tests verify direct public GET, personal-data/link/spam rejection, Turnstile failure with zero question writes, and Admin answer publication.
- `npm.cmd run test:browser:m5a` uses synthetic API and Turnstile fixtures; it does not write to staging. Live Siteverify, QA D1 writes, and deployed CSP behavior remain untested. No remote migration, deployment, or Production change occurred in this revision.
- Final local validation: backend **50/50 PASS**; `test:content`, typecheck, PWA build, `test:browser:m5a`, `test:browser:admin`, `test:browser:m2`, and `git diff --check` PASS. Browser tests used local Vite on port 5173 and isolated headless Edge CDP on port 9341 with synthetic API/Turnstile fixtures, not a physical phone or Cloudflare. M5 browser checks cover keyboard form open/close, Turnstile execution on submit, expiry/retry without POST, immediate list insertion, Sources ordering, and no overflow at 360/375/390/430 widths. Admin browser covers direct answer without approval, legacy pending publication with an answer, hide/delete confirmation, and desktop/mobile overflow. Admin filter-select interaction was not claimed as passed because the CDP event simulation did not reliably synchronize the UI query state.
- Public answered items now start with their answer collapsed behind an accessible per-question `Lihat jawaban` / `Sembunyikan jawaban` control. The latest synthetic browser regression used local Vite at 5175 and isolated headless Edge CDP at 9343; it verifies distinct `aria-controls` targets, independent state, Enter activation, unanswered status, and no horizontal overflow at 360, 375, 390, 430, and 1440px.

### M5 UX functional QA acceptance (2026-10-28)

- The answer-toggle revision was deployed to the separate Cloudflare Pages QA project `ruang-ibu-admin-qa`, Preview branch `admin-qa`, deployment `d67ab712-c8b9-4097-8e7f-e245de3ebe89` (`https://d67ab712.ruang-ibu-admin-qa.pages.dev`; stable QA alias `https://admin-qa.ruang-ibu-admin-qa.pages.dev`). The production project and Production environment were not changed.
- Owner-confirmed functional QA: valid visitor questions publish directly; Admin can publish an answer without a separate approval step; answered questions expose `Lihat jawaban` / `Sembunyikan jawaban`, and the answer can be shown and hidden. M5 UX functional QA status: **PASS**.
- Post-deployment read-only smoke checks returned article 200, public Q&A 200, Turnstile public configuration present, anonymous session 401, and anonymous Admin summary 401. The article API returned answered and unanswered examples. No question was submitted during deployment verification.
- Local browser regression covers independent per-question toggle state, collapsed-by-default rendering, keyboard activation, unanswered label, and responsive overflow. This status records functional QA for the approved M5 UX scope; it does not claim Production release, physical-device testing, or clinical review.
