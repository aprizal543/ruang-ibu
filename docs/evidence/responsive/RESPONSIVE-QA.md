# Responsive Development QA

Branch: `feat/ruang-ibu-fully-responsive`

Base: editorial checkpoint `680882728e54f709195adf57e9cb6ee4a70e6f7e`

## Scope

- Desktop/tablet CSS is isolated in `src/styles/responsive-desktop.css` and all layout rules are inside `min-width: 768px` media queries.
- Mobile uses the existing page layout and six-tab navigation without changes to component markup, content, images, or behavior.
- The desktop presentation uses a horizontal six-item primary navigation, wider editorial containers, tablet two-column therapy cards, desktop three-column therapy cards, longer-form reading widths, and wider guide, relaxation, information, and evaluation layouts.
- Admin CMS behavior and data contracts are unchanged. Existing dashboard browser QA uses synthetic fixtures only.

## Browser verification

`npm.cmd run test:browser:responsive` passed against local Chromium/CDP:

- 23 routes checked at 14 viewports each: 320×844, 375×812, 390×844, 430×932, 767×844, 768×1024, 820×1180, 912×1368, 1023×768, 1024×768, 1280×800, 1366×768, 1440×900, and 1920×1080.
- All 11 article routes retained their photo and public Q&A region.
- No horizontal overflow or JavaScript runtime errors were detected.
- The runner also asserts that mobile keeps the grid bottom navigation, while the 768px+ navigation is horizontal and pinned to the top.

`npm.cmd run test:browser:m2` passed for catalog/detail navigation, scroll restoration, filter/search state, all 11 article photos, source S8 deep link, relaxation route/audio asset, ephemeral evaluation, six mobile tabs, reduced motion, and runtime errors.

`npm.cmd run test:browser:admin` passed using synthetic fixtures for overview, inbox, filtering/pagination, detail, moderation, answers, history, settings, drawer keyboard behavior, and auth/error states. This was not a live Owner/Moderator session.

## Mobile visual comparison

Baseline screenshots are in `baseline/`; corresponding final home screenshots are in `final/`. The requested CSS viewport widths were configured in the same Chromium/CDP browser with the same route and height. PNG capture excludes the browser's vertical scrollbar, so the screenshot bitmap width can be narrower than the configured CSS viewport.

Pixel comparison of home screenshots:

| CSS viewport | Changed pixels | Result |
|---:|---:|---|
| 320×844 | 0 | Pixel-identical |
| 375×812 | 27,008, with maximum channel delta 2/255 | No layout or content shift; minor rasterization-level difference |
| 390×844 | 12 | Effectively unchanged; isolated capture-level pixels |
| 430×932 | 0 | Pixel-identical |
| 767×844 | 0 | Pixel-identical |

The 375px diff is low-amplitude antialiasing noise. It does not show a changed layout, text flow, component position, crop, or color treatment. The responsive test separately verifies the mobile nav presentation at every sub-768 viewport.

## Evidence

- `baseline/`: mobile baseline homepage plus public route baselines at 390 CSS px.
- `final/`: current mobile and wide-screen public screenshots, plus synthetic Admin overview, inbox, answer, and settings screenshots.
- Authenticated screenshots are fixture-based; no real account or private question data appears in evidence.

## Not exercised on physical devices

- Real iPad/iPhone/Android touch hardware and browser zoom were not available in this local Chromium run.
- Audio asset routing passed the public regression, but actual sound playback was not started by the CDP runner.
- The Admin browser test uses a synthetic API fixture; it does not verify a live Cloudflare Access/OIDC session or remote D1.
