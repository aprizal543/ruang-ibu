# RUANG IBU — Design System v1.0

**Status:** APPROVED VISUAL DIRECTION / implementation specification, 21 Oktober 2026  
**Source of truth:** `../reference/MASTER-mobile-approved.png` (gambar milik pengguna).  
**Product:** mobile-first maternal education website (bukan dashboard medis).  
**Design intent:** warm editorial maternity wellness; soft, calm, human, sophisticated, functional.  
**Authority:** when a numerical specification conflicts with the approved reference, prioritize the *reference's visual composition* while maintaining accessibility, semantic web behavior, and medical safety. Record and seek approval for visible deviations.

## 0. Fidelity lock (non-negotiable)

1. Preserve composition, visual hierarchy, hero photography scale/placement, palette, headline line breaks where feasible, shape of CTAs, list density, album-player treatment, and bottom navigation.
2. No dashboard stats/KPIs, card grids for the homepage, glassmorphism, excessive gradient, emoji icons, random illustrations, dashboard sidebars, or generic AI landing blocks.
3. The reference is an **8-screen collage**; each screen has its own crop in `../reference/screens/` and may be directly compared against a matching browser screenshot.
4. UI must be built from semantic HTML/CSS/React components, **not** by using the reference screenshot as a background or slicing screenshot text/buttons into interactive parts.
5. Mobile-first viewport QA: 375×812, **390×844 (primary)**, 430×932; additional 360×800 edge-case; tablet/desktop are later phases. Pixel geometry from the generated collage is illustrative, so allow small optically justified adjustments.
6. Real website MUST NOT draw a fake iOS status bar, notch, or Dynamic Island; those are mockup framing only.
7. Only two deliberate content changes may override matching screenshot wording before clinical approval: replace unsubstantiated blanket statements (e.g., 'Alami dan Aman', 'Edukasi Tervalidasi') with truthful copy (`Pilihan edukasi`, `Berdasarkan referensi`, `Materi dalam peninjauan`). Preserve placement and style.

## 1. Visual anatomy by screen

| Screen | Route | Required visual anchors |
|---|---|---|
| 01 Beranda | `/` | Cream/peach split-like hero, dominant photo of pregnant woman to right, multiline large dark-terra serif headline aligned left, 2 pill CTAs green and blush, quiet small three-feature strip, fixed bottom tab bar. |
| 02 Jenis Terapi | `/terapi` | Header back/center title/search; botanical header artwork; 4 filter pills; stacked compact list with thumbnail left, title/subtitle, chevron right. |
| 03 Panduan Ibu Hamil | `/panduan/hamil` | Large warm maternity photo at top/right; trimester chip; editorial serif heading; short explanatory text; slim section heading + 'Lihat semua'; stacked 4 guide rows. |
| 04 Panduan Bersalin | `/panduan/bersalin` | Warm photo of hands and support at top; peach chip; headline serif warm terra; 4 guidance rows with mini photos. |
| 05 Relaksasi | `/relaksasi` | Cream botanical illustrated intro; title 'Ruang Tenang untuk Ibu'; description; 4 category filters; compact audio rows with cover and play button; bottom tabs. |
| 06 Audio Player | `/relaksasi/:slug` | Immersive full-height ocean/sunset photo gradient overlay; top back/favorite/more; white title/short description at lower half; progress bar, native-like previous/play/next icons, 15/30/60-minute time chips. No bottom tabs in immersive view. |
| 07 Evaluasi | `/evaluasi` | Small header; calm botanical top; serif 'Bagaimana Kondisi Anda Sekarang?'; two vertical 0–10 range items in pale surface blocks; one full-width dark green CTA; tabs. |
| 08 Menu | overlay / drawer | Editorial wordmark top left + close; airy vertical nav (6 items); divider; About, Sources, FAQ; warm coral danger notice at bottom. |

For a small device, visually prioritize the same elements and sequence, but avoid squeezing text under a fixed bottom tab bar. Each page includes enough padding and scroll clearance.

## 2. Color palette — initial calibrated tokens

The tokens below are **approximate engineering samples**, not objectively recoverable exact brand colors from a raster collage; tune against screenshots during QA and document approved changes.

| Token | Hex | Usage |
|---|---|---|
| `--ri-forest` | `#124D3D` | primary buttons, active state, primary affordance |
| `--ri-forest-pressed` | `#0B3A2F` | pressed/hover, not random gradient |
| `--ri-ink` | `#202B28` | main body/icons |
| `--ri-terra` | `#7B4030` | editorial headings on cream |
| `--ri-paper` | `#F8F4EE` | global background |
| `--ri-ivory` | `#FFFBF7` | content surfaces |
| `--ri-peach` | `#F3D9CE` | subtle secondary CTA, warm highlights |
| `--ri-sage` | `#AEBCA7` | muted botanic accents |
| `--ri-moss` | `#586F5B` | secondary icon/leaf accent |
| `--ri-muted` | `#686A65` | secondary body text |
| `--ri-border` | `#EBE5DD` | separators |
| `--ri-danger` | `#B83E32` | safety notice text/icons |
| `--ri-danger-bg` | `#FCE8E3` | safety notice surface |

Primary foreground/text color pairs must pass WCAG 2.2 AA; colors that pass on the collage do not automatically pass in code. Contrast check required on final actual values.

## 3. Typography

- **Display / editorial:** `Fraunces`, serif fallback `Georgia`. Chosen as a *working typographic approximation*, **not** a verified identification of the reference's original font. Check alternatives optically against hero (tracking, counter shape, stroke contrast) before locking.
- **UI / body:** `DM Sans`, fallback `system-ui, sans-serif`. Text is Indonesian throughout.
- Mobile scale at 390px viewport: logo 20px; hero heading 39–45px / line-height 0.99–1.10; section display 32–36px; article H1 32–38px; list title 14–16px; body **16px** minimum for editorial running copy (reference visually smaller; prioritize readability); secondary 13–14px only when not essential; micro-label 12px sparingly.
- Use true text nodes; avoid text baked into photos. Support 200% zoom and text resize without clipping. Serif headings may break naturally on 360px widths rather than scale below readable sizes.
- Prose line length on mobile: 30–42 characters where feasible; consistent left alignment; avoid full justification.

## 4. Sizing, spacing, geometry

- CSS content viewport mobile width `100%`, ideal 390px; max webpage readable container `600px` on mobile; page gutters 20–24px; 8-point baseline (4/8/12/16/20/24/32/40/48px).
- Hero 1: image occupies right ~52–60% of width while text anchors left, blended with controlled warm overlay, **not** separate card.
- Header min-height 60px; page titles centered except home; bottom tab bar height ~70–80px + `env(safe-area-inset-bottom)`; sticky only on top-level pages.
- Tap targets ideally ≥44×44 CSS px; 6 tabs on narrow widths require labels that remain legible, sensible gaps, and screen-reader names. Under 360px if 6 columns fail, use a carefully documented accessible layout alternative; never silently drop a user-approved menu.
- Primary CTA: forest pill 46–52px tall, white text, optional white circular arrow inset. Secondary CTA: peach pill ~46–50px tall, dark text, restrained trailing play indicator.
- List: off-white minimal elevated surface, small thumb ~60–72px, 12–16px internal gap, optional soft corner 12–16px; avoid strong drop-shadow and heavy borders.
- Filters: forest active pill, muted-light inactive pills, horizontal overflow scroll with visible focus indicators.
- Rounded radii: 999px buttons/chips; 12–16px images/lists; 20–24px notice; avoid uniform inflated 24px on all content.
- Shadows: very subtle where needed; use contrast and whitespace first.

## 5. Component inventory and states

| Component | Variants | Required states |
|---|---|---|
| `BrandLockup` | icon+name, compact | neutral |
| `HeroMaternity` | homepage | loading image / responsive crop |
| `ActionPill` | primary green, secondary blush | default, hover, focus-visible, pressed, disabled |
| `PageHeader` | default, search, transparent-player | default, focus |
| `BottomTabBar` | 6 navigation destinations | active, inactive, focus |
| `TherapyRow` | therapy, guideline | skeleton, ready, disabled-content |
| `FilterChips` | segmented category | selected, unselected, keyboard scroll |
| `EditorialHeader` | pregnancy, birth, relaxation, assessment | image loaded/fallback |
| `AudioRow` | nature, music, narrated | loading, playing, paused, unavailable, error |
| `ImmersivePlayer` | background photo | stopped, playing, paused, ended, failed |
| `RangeQuestion` | comfort 0–10, anxiety 0–10 | default, changed, focus |
| `SafetyNotice` | compact, full page | always visibly distinctive |
| `MobileMenu` | overlay/drawer | open, closed, focus trapped, Escape close |
| `ContentReviewTag` | draft, clinical-approved | never fake clinical approval |

## 6. Imagery and licensing

- Priority: warm *realistic* human-centered pregnancy/partner/midwife photography matching the reference subject, direction of light, and crop. Photograph selections must respect dignity, diversity, and non-stereotypical maternal portrayals.
- Image set includes: hero mother seated, expectant mother relaxed, birth support hands, breathing, calm touch/massage, prenatal yoga **illustrative only if approved clinically**, headphone/music, ocean sunset for immersive player, delicate botanicals for section headers.
- **Reference screenshots are not production assets.** Do not crop and reuse the generated pregnant-person photo or other embedded artwork from the collage as a content asset without obtaining separately licensed replacements or independently generated replacement images.
- Store per-file credit, creator, source URL, license, proof, and any modification notice in `assets/ASSET-LICENSE-MANIFEST.md`. No unverified hotlinks.
- Always write informative alt text for meaningful photos; decorative botanical elements have `alt=""` and `aria-hidden` as appropriate.

## 7. Accessibility and inclusive UX

- Target WCAG 2.2 AA; keyboard-visible focus; readable contrast; meaningful labels; headings in logical order; page title changes; reduced motion preference honored.
- No autoplay. All audio playback requires a user gesture and includes pause, scrub controls, and non-audio transcript for guided voice.
- Sliders must have linked `<label>`, current number announcement, consistent left/right endpoint descriptions, and accessible keyboard adjustment. Explain scale direction.
- Audio must not block care-team communication. Safety content accessible in menu AND in relevant therapy guide, never hidden behind only decorative icon.
- No flashing or persistent motion; no misleading progress measurements.

## 8. Safety-led content hierarchy

- Tone: inviting, non-judgmental, precise. Say 'dapat menjadi pilihan untuk membantu sebagian ibu merasa lebih nyaman', not 'terbukti menyembuhkan / pasti menghilangkan nyeri'.
- Separate maternal third-trimester content from intrapartum content, with appropriate instructions: *not all guides are home self-care tasks*.
- `Tanda Bahaya` must be easy to locate and directs users to contact their bidan / nearest emergency care. No diagnosis or treatment decision support.
- Publish gate: article/audioguided narration must have source citations + reviewer name/role + review date + documented approval. Before then, mark **Draf / Dalam peninjauan** and do not expose high-risk stepwise instructions publicly.

## 9. Fidelity QA / acceptance workflow

- Build **Screen 01 only first**. Screenshot the coded page at 390×844; compare visually to `reference/screens/01-beranda.png` considering that device shell is absent. Inspect: hero focal point, line wrapping, CTA dimensions/spacing, photo color and crop, footer geometry, and content order.
- Repeat comparison for screens 02–08. Review real browser at 375/390/430 widths.
- **No 'looks similar' subjective acceptance without screenshots.** Maintain `Fidelity-QA.md`: reference, output capture, approved differences, pending issues, reviewer decision. Pixel diff can assist but does not replace visual reading because replacement photography/fonts are expected to differ.
- No screen is final before functional state, responsive state, accessibility, and medical-copy checks pass.

## 10. Anti-slop checklist

- [ ] Hero is editorial and photographic, not a KPI/card dashboard.
- [ ] No ornamental floating stats / generic claims.
- [ ] Brand signature not replaced by default icon library mark.
- [ ] No massive all-caps headings or endless pill-shaped feature cards.
- [ ] CTA words match intent; playback only works when audio is available.
- [ ] No fake mobile OS chrome in real web UI.
- [ ] Safety statements truthful and cited.
- [ ] Typography deliberately aligned to approved screenshots.
- [ ] All page artwork comes from audited assets; not a screenshot.
- [ ] No page accepted without screenshot comparison.

## 11. Open-source skill methodology

Workflow aligns with the public `nextlevelbuilder/ui-ux-pro-max-skill` documented design-system → domain-specific UX → implementation QA structure: https://github.com/nextlevelbuilder/ui-ux-pro-max-skill. Its **CLI was not executed here**, because code-host download access was unavailable. If installed on the developer machine, use its outputs as *advisory*, never overwrite this approved visual baseline. The user's screenshot is the higher priority source of truth.
