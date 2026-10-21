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
