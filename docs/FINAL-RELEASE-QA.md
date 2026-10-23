# Ruang Ibu — Final Release QA

**Audit date:** 2026-10-23
**Audited baseline:** `f35bf73063f7761bb68de7a5bce874758286f165` (`main`)
**Deployment:** not performed

## Release decision

| Release target | Decision | Evidence and remaining boundary |
|---|---|---|
| Static website on Cloudflare Pages | **CONDITIONAL GO** | Production build and local production preview pass; root-relative assets and SPA deep links work. An actual Cloudflare Pages preview, deployed refresh behavior, and hosted MP3 seek/playback have not been tested. |
| Installable PWA | **CONDITIONAL GO** | Manifest has valid 192, 512, maskable 512, and Apple touch icons; Chromium serves the manifest and service worker. Installation was not verified on a physical Android device, Safari, or iOS. |
| Offline browsing | **PASS WITH LIMITATIONS** | Once the first online load has installed the worker and filled the shell cache, direct offline navigation to `/hamil`, a therapy article, `/tanda-bahaya`, and an unknown URL works. Audio and external source pages remain online-only; first use still requires a successful online load. Physical-device storage eviction and offline behavior are not tested. |
| Public health education | **CONDITIONAL GO** | Public copy is source-reviewed and bounded; T03 physical practice is locked. T01–T04 and maternity content remain `clinicalReview: draft`; no clinical approval is claimed. Indonesian clinician review of safety wording and local care pathways remains pending. |

This is not a single GO for all release surfaces. Do not describe all routes, media, or clinical material as fully offline or clinically approved.

## Remediation completed

### PWA identity and cache

- Added application icons derived from the existing Ruang Ibu botanical mark (the same `Flower2` symbol already used in the site's brand lockup); the website logo itself was not changed.
- Verified PNG dimensions from their headers: `ruang-ibu-192.png` **192×192**; `ruang-ibu-512.png` **512×512**; `ruang-ibu-maskable-512.png` **512×512**; `ruang-ibu-apple-touch.png` **180×180**. Manifest paths resolve under `/pwa-icons/`; `lang` is `id`, app name is Ruang Ibu, and theme/background colors are `#f8f4ee`.
- Added a Workbox `NavigationRoute` to the precached `/index.html` shell. It handles extensionless SPA navigations, including `/hamil`; it excludes `/audio/`, `/images/`, and `/pwa-icons/` paths so missing media is not silently replaced with HTML.
- `cleanupOutdatedCaches()` removes old Workbox precache generations when the new worker activates. Existing default waiting-worker lifecycle avoids forcing an active session to reload. No custom update prompt is present; users may continue on an old open tab until it closes/reloads. This is a PWA UX limitation, not a cache-integrity failure.
- Precache manifest contains the app shell, JS/CSS, fonts, and selected image assets; it contains **no MP3 files**. Audio still uses on-demand `preload="none"` and gives a reconnect message when offline.

### Publication boundary and T03

- Removed authoring-only evidence notes, editorial labels, and revision-history prose from article runtime objects. Historical decisions remain in `Clinical-Review-Log.md` and the research documents.
- Production output was searched for `T03-E01`, `CONTENT DEFINITION BLOCKER`, `Draf T01`, `editorialSource`, `revisionHistory`, and the withdrawn T03 physical-guide strings (“feet menapak”, “dukungan di bawah kaki”); none was found in `dist/assets`.
- T01/T02/T04 retain source-reviewed, bounded educational text. Their clinical states remain `draft`. Source-based directions are limited to patient-facing source material (breathing choices, audio controls, consent/communication), not new clinical procedures.
- T03 is limited to grounding information in the source's distress/trauma context. It is not equated with progressive muscle relaxation or presented as a universal method. Its physical practice section is locked. T03's clinical state remains `draft`.
- `clinicalReview` draft metadata remains in the app data to represent governance honestly. The public bundle includes only the bounded visible article text and locked-state message; authoring history and removed physical instructions are excluded. This release does not make a `CLINICALLY_REVIEWED` claim.

### Tanda Bahaya

The safety page draws from reviewed NHS pregnancy/labour pages, the Indonesian Ministry of Health's Buku KIA 2024 and its danger-sign page, and WHO pregnancy-service guidance. It directs the reader to their attending midwife/facility or local emergency help, does not give UK phone numbers, and does not diagnose. Pregnancy warnings include absent/reduced/changed fetal movement, bleeding, severe pain, seizure, severe headache/visual symptoms, sudden swelling, breathing difficulty, and high fever; labour wording includes ruptured waters, bleeding, changed fetal movement, and severe concerns between contractions. Sources are attached in the source disclosure and claim metadata. This is source consistency checking, **not** clinician review or Indonesian referral-pathway approval.

Sources checked:

- [NHS — Pregnancy symptoms you need to get help for](https://www.nhs.uk/pregnancy/common-symptoms/pregnancy-symptoms-you-need-to-get-help-for/)
- [NHS — Your baby's movements](https://www.nhs.uk/pregnancy/keeping-well/your-babys-movements/)
- [NHS — Signs that labour has begun](https://www.nhs.uk/pregnancy/labour-and-birth/signs-that-labour-has-begun/)
- [Kementerian Kesehatan RI — Buku Kesehatan Ibu dan Anak 2024](https://kesprimkom.kemkes.go.id/assets/uploads/contents/others/Buku_KIA_2024.pdf)
- [Kementerian Kesehatan RI — Tanda Bahaya Kehamilan](https://ayosehat.kemkes.go.id/tanda-bahaya-kehamilan-yang-harus-diketahui-oleh-ibu-hamil)
- [WHO — Getting the health services you need during pregnancy](https://www.who.int/tools/your-life-your-health/life-phase/pregnancy--birth-and-after-childbirth/getting-the-health-services-you-need-during-pregnancy)

The Healthier Together page for T03 returned 403 to direct browser access; its indexed text was checked, and only bounded general information was retained. No physical practice steps were kept. This access limitation is recorded in `Clinical-Review-Log.md`.

### Assets and licenses

- The asset manifest records the new icon derivation and its Lucide ISC source. Existing audio and image records were left intact.
- Eight active audio files remain in production. Retired Scott Buckley `Solace` and `Sleep` are absent from public assets/build; their not-cleared decision remains historical.
- Audio credits continue to expose source, creator, and license. Human listening remains pending for all eight tracks; the `Avec Soin` / `Friday Morning` loudness delta remains about **11.9 LUFS** (`−16.6` vs `−28.5 LUFS`). No gain was applied. Perform the checklist below before final media approval.
- Pexels photo source/license records are present. AI provenance and applicable model releases remain **UNVERIFIED**; imagery is illustrative and is not evidence of endorsement or clinical efficacy.

### Dependency security

- Updated `react-router-dom` / `react-router` to **7.18.4**. App usage is Declarative mode; installed package tree contains no nested old router. The successful `npm audit --omit=dev --json` after this update reported **0 runtime vulnerabilities**. A repeat request later in this turn could not reach the npm advisory endpoint; the full audit did complete and reported the three development-only findings below. This removes the previously reported moderate React Router advisories.
- Full `npm audit --json` reports **3 moderate development-only findings**: `tailwindcss@3.4.19` → `postcss-nested@6.2.0` → `postcss-selector-parser@6.1.5` (GHSA-rj75-hqrm-r3gf, quadratic parsing / CPU exhaustion; parser fix is 7.1.6). The listed automatic fix jumps to Tailwind 4.3.3, a major-version upgrade. The packages are build-time only; no affected package is shipped as browser runtime code. No forced major upgrade was applied. Keep dependency maintenance open and upgrade Tailwind only with a compatibility review of the approved CSS/build.

## PWA / Cloudflare validation

- Project root contains `package.json` and `index.html`; recommended Cloudflare Pages settings: production branch `main`, build command `npm run build`, output directory `dist`.
- Local production preview serves the SPA and its direct paths; no custom `_redirects`, `_headers`, or top-level `404.html` is present. Cloudflare Pages' default SPA fallback is therefore retained. No conflicting redirect rule was found.
- Production file inventory is below Cloudflare Pages' 25 MiB per-file limit; largest file is `dist/audio/wholesome.mp3` (8,732,673 bytes). MP3s are local root-relative assets and are not precached.
- No secret or Windows absolute path was found in the production output. A local production preview was tested; actual Cloudflare deployment/configuration remains untested.
- Browser offline emulation, after worker control and shell precache were ready, successfully opened `/hamil`, `/terapi/teknik-pernapasan`, `/tanda-bahaya`, and an unknown route. The unknown route rendered the app's Not Found page. The first immediate offline attempt raced worker/cache readiness and failed; after the app shell was installed, repeat deep-link requests passed. This demonstrates warm-cache offline SPA navigation, not first-use offline availability.
- The generic app JS bundle contains the available source-reviewed article data because these routes are client-rendered. No withdrawn or internal authoring-only T03 content was found in the bundle. Audio files remain outside the precache; remote source pages are unavailable offline.

## QA results

| Check | Status | Evidence |
|---|---|---|
| Typecheck | **PASS** | `pnpm.cmd typecheck` |
| Production build | **PASS** | `npm.cmd run build`; Vite + `injectManifest` complete successfully |
| Diff whitespace | **PASS** | `git diff --check` |
| Online route smoke | **PASS** | Agent Browser opened all implemented routes, audio details, and not-found route directly; H1 was present. Production-preview route checks included therapy, guides, relaxation, evaluation, About, Sources, FAQ, Safety, and fallback. |
| Warm-cache offline deep links | **PASS WITH LIMITATIONS** | Agent Browser offline emulation rendered `/hamil`, a therapy article, Tanda Bahaya, and unknown-route fallback after shell cache was ready. Physical device/storage eviction not tested. |
| PWA icons and manifest | **PASS** | Correct PNG dimensions and paths; generated manifest has `lang:id`, theme color, scope/start URL and three valid icons. Chromium installation flow on a real device not tested. |
| Audio lazy loading / PWA exclusion | **PASS WITH LIMITATIONS** | Existing audio browser QA covers on-demand loading/playback; generated precache manifest contains no `audio/*.mp3`. Safari/iOS and real Cloudflare MP3 range/seek behavior not tested. Offline audio is intentionally unavailable and reports reconnect guidance. |
| Tanda Bahaya sources and wording | **PASS WITH LIMITATIONS** | Claims map to NHS, Kemenkes RI, and WHO references; local care wording and source disclosure present. Local clinician review and referral-path review remain pending. |
| Dependency security | **PASS WITH LIMITATIONS** | Last successful runtime audit: 0 findings; repeat was unavailable because the npm advisory endpoint could not be reached. Full audit: 3 moderate build-tool findings in Tailwind/PostCSS selector parsing; no forced major upgrade. |
| Responsive and accessibility | **PASS WITH LIMITATIONS** | Agent Browser smoke at 375×812, 390×844, 430×932 and 1280×720 found no horizontal overflow on Tanda Bahaya. Existing completion/audio/evaluation suites cover route/menu/audio/evaluation behavior; complete every-route × every-viewport WCAG audit, physical keyboard/screen-reader pass, and Safari/iOS are not tested here. |
| Update UX | **PASS WITH LIMITATIONS** | Worker uses normal waiting-worker lifecycle and cleans old Workbox precache caches on activation. No visible in-app update prompt; an open tab may keep using the current worker until closed/reloaded. |
| Live Cloudflare Pages | **NOT TESTED** | No Cloudflare project/deployment was created. |
| Safari/iOS installation/playback | **NOT TESTED** | No physical iOS/Safari test available. |
| Human listening and loudness acceptability | **NOT TESTED / PENDING** | Loudness metrics are technical only; do not treat them as subjective listening approval. |

The existing screenshot evidence under `docs/evidence/` was retained/refreshed by the prior QA scripts; no new screenshot collection was generated for this remediation.

## Human listening checklist — eight active tracks

For Hujan Lembut, Air di Bebatuan, Musik Instrumental, Gymnopédie No. 1, The Years Grow Quiet, Wholesome, Avec Soin, and Friday Morning:

1. Listen to the opening, a middle passage, and the ending/fade.
2. At the same device and volume setting, check comfortable playback level; compare Avec Soin and Friday Morning side by side.
3. Note jumps in loudness, clicks, clipping, distortion, abrupt changes, or uncomfortable endings.
4. Confirm there are no lyrics/disruptive sounds and that the track works as optional background listening.
5. Record reviewer, date, listening device/headphones, track, and issue. This checks listening quality, not clinical effect.

Do not automatically normalize. If a later listening review recommends matching perceived level, test per-track static gain while preserving dynamics and true-peak headroom; keep originals and record the exact change before replacing derivatives.

## Remaining release checks

1. Test PWA installation, update behavior, and offline use on supported physical Android and iOS/Safari devices.
2. Have an Indonesian maternity clinician/local-care reviewer check safety wording and local referral guidance; keep clinical statuses `draft` until a real review record exists.
3. Complete the human listening checklist, especially the 11.9 LUFS Avec Soin / Friday Morning difference.
4. Obtain provenance/model-release evidence for people imagery if required for the intended publication context; do not claim it is verified meanwhile.
5. Test Cloudflare Pages preview for deep-route refresh, installed-worker update behavior, and hosted MP3 playback/seek. No deployment was performed in this sprint.
6. Review the moderate dev-tool dependency advisories before future Tailwind build-tool upgrades.

## References for platform findings

- [Cloudflare Pages — Serving Pages and SPA fallback](https://developers.cloudflare.com/pages/configuration/serving-pages/)
- [Cloudflare Pages — Limits](https://developers.cloudflare.com/pages/platform/limits/)
- [Cloudflare Pages — Build configuration](https://developers.cloudflare.com/pages/configuration/build-configuration/)
- [PostCSS selector parser advisory GHSA-rj75-hqrm-r3gf](https://github.com/advisories/GHSA-rj75-hqrm-r3gf)
- [npm audit documentation](https://docs.npmjs.com/cli/v11/commands/npm-audit)
