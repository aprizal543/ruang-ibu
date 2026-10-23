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
