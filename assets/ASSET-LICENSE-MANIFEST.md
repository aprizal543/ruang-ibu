# Ruang Ibu — Asset/license manifest

Status: **PARTIALLY POPULATED — the user-selected hero asset and its Pexels license record are documented. The individual model release has not been verified.**

The file `reference/MASTER-mobile-approved.png` is an approved *visual specification*, not permission to extract media from the mockup for use as standalone photos. The reference image must not be served as webpage UI.

For each new image/audio add a row:

| Asset ID | Type | Used in screen(s) | File path | Author/owner | Exact original URL | License/version | Attribution wording | Proof checked on | Clinical narration approved? |
|---|---|---|---|---|---|---|---|---|---|
| RI-HERO-01 | image (original JPG) | 01 Beranda | `assets/images/hero/pexels-hero.jpg` | ANH DO | https://www.pexels.com/photo/serene-pregnant-woman-in-soft-light-setting-28731162/ | Pexels License (checked 2026-10-21) | Attribution not required; courtesy credit: “Photo by ANH DO via Pexels” | 2026-10-21 — source page, photographer, photo ID and visual match checked; individual model release not verified | n/a |
| RI-HERO-01-WEBP | image (optimized derivative of RI-HERO-01) | 01 Beranda | `assets/images/hero/pexels-hero-mobile.webp` | ANH DO / derived by Ruang Ibu from RI-HERO-01 | https://www.pexels.com/photo/serene-pregnant-woman-in-soft-light-setting-28731162/ | Pexels License (same source asset; checked 2026-10-21) | Attribution not required; courtesy credit: “Photo by ANH DO via Pexels” | 2026-10-21 — derivative provenance recorded; individual model release not verified | n/a |
| RI-THERAPY-BOTANICAL-01 | original vector illustration (hand-authored) | 02 Jenis Terapi | `public/therapy-botanical.svg` | Ruang Ibu project implementation | n/a — created in this repository; no external source | Original project artwork; authored for this project, no third-party asset or dependency | No attribution required | 2026-10-21 — source SVG reviewed in repository | n/a |

## Phase 2B — selected therapy thumbnails

**Checked:** 2026-10-21. The source pages identify each uploader, show the Pexels License / “Free to use” status, and describe the pictured subject. Pexels states its photos may be used on websites/apps without required attribution. The downloaded JPEG files contain only dimensions, orientation, and 72 dpi resolution EXIF fields; no camera make/model, capture timestamp, or creator field was present. Source pages did not declare an AI-generation status. Visual inspection found no obvious synthetic-image artifacts, but that does not establish photographic provenance. **Non-AI origin and individual model-release evidence remain UNVERIFIED for all four assets.** The user approved the Screen 02 layout and selected thumbnail appearance; this does not constitute independent provenance, release, or clinical verification.

| Asset ID | Therapy / Type | Original and derivative files | Author / source | License and attribution | Metadata checked | Status |
|---|---|---|---|---|---|---|
| RI-THERAPY-01 | Teknik Pernapasan / JPEG + WebP thumbnail | `assets/images/therapy/pexels-7055703-pavel-danilyuk.jpg` → `public/images/therapy/breathing.webp` | Pavel Danilyuk · [Pexels photo 7055703](https://www.pexels.com/photo/a-pregnant-woman-meditating-7055703/) | Pexels License; attribution not required | Downloaded JPEG 3934 × 5893, RGB, EXIF orientation 1 / resolution only. No camera/capture metadata. | Source and web-use license checked 2026-10-21. Visual appearance approved by user for Screen 02. AI origin and model-release evidence **UNVERIFIED**. |
| RI-THERAPY-02 | Terapi Musik / JPEG + WebP thumbnail | `assets/images/therapy/pexels-26836541-aljona-ovtsinnikova.jpg` → `public/images/therapy/music.webp` | Aljona Ovtšinnikova · [Pexels photo 26836541](https://www.pexels.com/photo/steel-luxury-headphones-lying-on-bed-26836541/) | Pexels License; attribution not required | Downloaded JPEG 3024 × 4032, RGB, EXIF orientation 1 / resolution only. No camera/capture metadata. | Source and web-use license checked 2026-10-21. Visual appearance approved by user for Screen 02. AI origin and model-release evidence **UNVERIFIED**. |
| RI-THERAPY-03 | Relaksasi Otot Ringan / JPEG + WebP thumbnail; general illustration, not a technique demonstration | `assets/images/therapy/pexels-34318004-dave-garcia.jpg` → `public/images/therapy/relaxation.webp` | DΛVΞ GΛRCIΛ · [Pexels photo 34318004](https://www.pexels.com/photo/pregnant-woman-relaxing-peacefully-indoors-34318004/) | Pexels License; photographer requests courtesy credit when published: “Photo by DΛVΞ GΛRCIΛ on Pexels.” | Downloaded JPEG 4000 × 6000, RGB, EXIF orientation 1 / resolution only. No camera/capture metadata. | Source and web-use license checked 2026-10-21. Visual appearance approved by user for Screen 02. AI origin and model-release evidence **UNVERIFIED**. |
| RI-THERAPY-04 | Pijat Pendamping / JPEG + WebP thumbnail; general illustration, not a technique demonstration | `assets/images/therapy/pexels-35711736-catherine-chechun.jpg` → `public/images/therapy/partner-massage.webp` | Catherine Chechun · [Pexels photo 35711736](https://www.pexels.com/photo/close-up-of-hands-on-pregnant-belly-35711736/) | Pexels License; attribution not required | Downloaded JPEG 2105 × 3157, RGB, EXIF orientation 1 / resolution only. No camera/capture metadata. | Source and web-use license checked 2026-10-21. Visual appearance approved by user for Screen 02. AI origin and model-release evidence **UNVERIFIED**. |

Derivative method: centered 360 × 340 px WebP crop, quality 84, Lanczos resampling. The relaxation crop is biased upward to include the subject’s face with the abdomen; the music crop is biased down toward the headphones. Crops are presentation derivatives; the original downloaded JPEGs are retained unchanged.

The thumbnails are illustrative catalog imagery only. They do not validate the safety, effectiveness, or clinical approval of any therapy. No clinical instruction is conveyed by the images.

Rules:
- `License/version` cannot be "free from Google" or "found online". Specify license or documented permission.
- Avoid unsourced audio ripped from social/video platforms.
- For guided audio, the transcript/words need clinical review independently of copyright.
- Therapy thumbnails have user visual approval for the Screen 02 catalog. AI provenance and individual model-release status have not been independently verified; retain **UNVERIFIED** until those checks are resolved.
- Before production deploy, ALL images/audio loaded by the public build must appear above.
- User selection status for RI-HERO-01: **approved by user as the chosen candidate**. This records asset selection only; it is not a claim that the pictured model's individual release was verified, nor that the final homepage composition was approved.
- Pexels' license page, checked 2026-10-21, states that photos may be used on websites/apps, attribution is not required, and identifiable people may not be shown in a bad/offensive light or in a way that implies their endorsement. The page does not establish whether an individual model release exists for this photo.
