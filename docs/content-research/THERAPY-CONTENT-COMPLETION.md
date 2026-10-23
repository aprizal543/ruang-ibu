# Therapy Content Completion — Phase 2.3 Draft Package

**Audit date:** 23 October 2026. This file proposes source-bounded educational copy and decisions for later approval. It is not a production change, medical recommendation, or clinical review. All four articles remain DRAFT / PENDING CLINICAL REVIEW; practice remains LOCKED; audio remains unavailable.

## Readiness summary

| Article | Content readiness | What is sufficiently supported | What blocks completion |
|---|---|---|---|
| T01 Teknik Pernapasan | **Mostly complete for a short, non-instructional labour overview; partial for trimester III.** | Preference-based breathing/relaxation context in labour (WHO/NICE); a carefully bounded mention of pregnancy anxiety self-care (NHS). | Exact technique is not sourced as a Ruang Ibu protocol; S6 does not provide a complete warning set or local Indonesian service context; safety/source IDs need tightening; no practice instructions. |
| T02 Terapi Musik | **Complete for a concise labour listening-choice explanation; not as clinical music therapy.** | NICE supports playing music chosen by the woman during labour; Cochrane communicates uncertainty; NCCIH S13 distinguishes professional music therapy from recorded-music listening. | No basis for T3-specific claims; S13 absent from article reference data; no music track or rights-cleared audio. Suggested display name change requires separate approval. |
| T03 Relaksasi Otot Ringan | **BLOCKED FOR CONTENT — definition.** | PMR is a named WHO labour relaxation option; this does not validate the different product-defined “light” body-awareness approach. | Exact method lacks a source-defined identity, scope, safety, and evidence. Must resolve title/topic before drafting substantive content or practice. |
| T04 Pijat Pendamping | **Complete for a conceptual overview of choice/consent and bounded labour context; not a how-to guide.** | WHO manual methods and NICE taught-companion condition; Cochrane provides limited, variable labour evidence. | No uniform lay procedure or individual suitability assessment; no location/pressure/duration/technique content. Keep locked. |

## Source-supported draft additions (not production copy)

These short proposals intentionally avoid steps. Each remains `DRAFT / PENDING CLINICAL REVIEW` and should be rechecked against source revisions at the time of integration.

### T01 — Teknik Pernapasan

**Possible trimester III scope note:** “Saat hamil, latihan pernapasan kadang dibahas sebagai salah satu cara perawatan diri ketika Ibu merasa cemas. Informasi ini tidak menentukan apakah latihan tertentu sesuai untuk kondisi Ibu.”
Basis: NHS S5 (anxiety context). **Partially supported** for general pregnancy self-care, not trimester-specific efficacy. Keep only if the article explicitly identifies that limited context.

**Possible labour scope note:** “Saat persalinan, sebagian ibu memilih teknik pernapasan atau relaksasi sebagai pendamping. Pilihan dan kebutuhan tiap Ibu berbeda; manfaatnya tidak dapat dijanjikan.”
Basis: WHO S1 Recommendation 21, NICE S2 1.6.3/1.6.5, and Cochrane S3. This preserves choice and uncertainty; clinical review still needed.

Do not add a breathing count, inhale/exhale pattern, position, duration, pushing cue, or stop-condition list from the draft unless an appropriate patient guide and clinical reviewer support that exact wording.

### T02 — Terapi Musik

**Possible scope note:** “Halaman ini membahas mendengarkan musik yang Ibu pilih sendiri. Ini berbeda dari terapi musik yang diberikan oleh profesional terlatih. Saat persalinan, musik pilihan Ibu dapat menjadi bagian dari suasana yang diinginkan. Musik tidak menjamin nyeri atau kecemasan berkurang.”

Basis: NICE S2 1.6.9 (choice in labour); NCCIH S13 (definition distinction); Cochrane S3 (labour outcomes uncertain). The sentence about anxiety is deliberately a non-claim, not an efficacy statement. T3 pregnancy evidence from S7 is not sufficient for a general prenatal statement. The source currently listed as S11 is a different NCCIH page and does not substantiate the music-therapy definition.

**Editorial option requiring user approval:** display name “Musik untuk Relaksasi” better describes listening, while route/ID and catalogue label remain unchanged until separately approved. This is not an instruction to rename production now.

### T03 — Relaksasi Otot Ringan

No substantive content addition is proposed until the term is resolved. Two options for a future decision:

1. **Keep a distinct gentle body-awareness topic:** first locate a patient-facing authoritative source that explicitly defines this approach in pregnancy/labour and documents scope/safety. If not found, withdraw/defer the article topic. This is the preferred safe route for preserving the intended method without pretending it is PMR.
2. **Rename to “Relaksasi Otot Progresif”:** this matches WHO’s named technique, but the current sources alone still do not provide a complete patient-ready protocol or prove it is suitable for every mother. Obtain an appropriate patient guide and review the exact steps before considering any practice content.

Until a decision, retain only a transparent terminology note; do not imply the current label and PMR are interchangeable.

### T04 — Pijat Pendamping

**Possible non-procedural context:** “Saat persalinan, pijat dapat menjadi salah satu pilihan pendamping bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri. Pilihan ini bergantung pada keinginan Ibu. NICE menyebut pendamping perlu mempelajari teknik yang digunakan. Tidak ada teknik yang dijelaskan di halaman ini.”

Basis: WHO S1 Recommendation 22, NICE S2 1.6.6, Cochrane S4. This does not say massage is safe for everyone or provide a technique. Keep consent and the right to decline/stop clearly visible.

## Patient guides, media, and source completeness

- **T01:** NHS and NHS Foundation Trust patient information exists, including S6, a labour coping page with explicit breathing guidance and advice to ask a midwife. Its full date and reuse terms were not exposed, and its guidance does not supply a complete warning list. It is a candidate source, not clearance for publishing a Ruang Ibu practice sequence.
- **T02:** NICE supports music choice during labour; this is not a licensed audio asset or therapy program. No audio file is present or cleared. Music rights must cover recording/composition, streaming/download, territory, duration and intended commercial/non-commercial use. The sound asset must not be represented as clinically therapeutic without supporting evidence.
- **T03:** No patient-facing source identified in this pass for the exact “light muscle relaxation/body scan” product definition. Definition blocker stands. NHS perinatal relaxation page contains muscle tensing/relaxing instructions but is not pregnancy-specific; it includes a postnatal caution and is not a basis to transplant its steps to a pregnant population.
- **T04:** NICE provides a clear condition that companion massage techniques in labour have been taught. That is not itself a general step-by-step patient guide. Seek a local maternity-service training source and clinician review; no visual or video instructions should be copied from search results.
- No new image, audio, video, or diagram is proposed. Existing Pexels thumbnail license permits website use under its terms, but the asset manifest keeps AI-origin and model release status UNVERIFIED. The photos are illustrative, not demonstrations. A stock-photo license does not provide clinical validation or imply model endorsement.

## Source and claim data cleanup recommended for a later approved integration

1. Add source records for S5–S12 actually used in copy; preserve S1–S4 IDs and the current revision history.
2. Correct `TherapyArticle` paragraph reference IDs so each factual clause points to a directly supporting source. In particular T01's current safety notice has an empty `referenceIds` array; do not silently infer references from the article-level source list.
3. Record source title, publisher, publication/updated date as shown, access date, relevant section/recommendation, and source-page/license notes in article evidence records. “Last accessed” is not publication date.
4. Keep `approved` metadata absent. Current type requires reviewer identity, role, reviewed/approved dates; evidence of that review does not exist.

## Proposed content-state governance

These are governance proposals only. Do not change current code types, PWA behavior, caching, offline availability, or publication rules without user approval.

| Status | Meaning | Minimum evidence to enter | What the label must not imply |
|---|---|---|---|
| `DRAFT` | Copy is being assembled or changed. | Article owner, source IDs, revision/date, open questions, audience and scope recorded. | No source verification, clinical approval, or readiness for public use. |
| `SOURCE_REVIEWED` | Every factual claim in a specific immutable revision has been checked against accessible sources and scope. | Claim-source matrix complete; URLs and dates checked; exact sections/claims logged; evidence limits/conflicts noted; license/reuse approach documented; revision identifier/hash and reviewer/date recorded. Reviewer can be the source-audit editor, but this is not a health professional approval. | Must never be rendered as “clinically validated,” “safe,” or “approved by clinician.” |
| `CLINICALLY_REVIEWED` | A named, appropriately qualified health professional reviewed the exact revision within a stated scope. | Reviewer identity and credentials, role/scope, date, exact revision/hash, decision and comments, safety/contraindication review, and evidence mapping stored. | Does not imply universal safety or guarantee of effectiveness. Any clinical copy change returns to draft/re-review. |
| `WITHDRAWN` | A prior revision is no longer eligible for display. | Exact withdrawn revision/hash, date, reason, decision-maker, replacement or removal action, and link to issue/source update. | Do not erase history or silently leave cached/offline content available. Any cache invalidation policy requires separate approval. |

The development team's source audit can prepare general-education drafts without lecturer sign-off, as authorized by the user. It cannot set `CLINICALLY_REVIEWED`. The existing website publication gate and PWA policy remain unchanged pending a separate decision.

## Publication blockers

1. T03 definition blocker (highest content blocker).
2. All four articles remain DRAFT, and there is no clinical reviewer record; this source audit is not a clinical approval.
3. No practice content can be activated; exact source/clinical review needs remain above.
4. Source mapping is incomplete in the code data, and one source-linked safety notice is unreferenced at paragraph level.
5. NICE/Kemenkes/Cochrane rights are not blanket “free to copy”; use links and original summaries pending permission/license review.
6. There is no audio asset or audio license. Existing catalog photo origin and model release remain unverified.

## Recommended Phase 2.4

1. Ask the content owner to choose T03's definition path (defer the variant, locate a source defining it, or propose the correctly named PMR topic).
2. Resolve the three catalogue/detail category mismatches using the category audit; do not infer personal eligibility from filter tags.
3. Approve a source set per article, then update only structured source records and draft copy in a separately authorized integration phase. Re-audit every revised claim and keep clinical state `draft`.
4. Decide whether this project needs a qualified clinician review before informational copy can be displayed, separately from whether any practice steps require approval. No PWA/publication change is proposed here.
5. Conduct a separate media-rights audit for any selected audio/video; do not infer rights from public streaming availability.

## Related audit documents

- [`PHASE-2.3-SOURCE-AUDIT.md`](PHASE-2.3-SOURCE-AUDIT.md)
- [`THERAPY-CLAIM-SOURCE-MATRIX.md`](THERAPY-CLAIM-SOURCE-MATRIX.md)
- [`THERAPY-PRACTICE-RISK-MATRIX.md`](THERAPY-PRACTICE-RISK-MATRIX.md)
- [`THERAPY-CATEGORY-AUDIT.md`](THERAPY-CATEGORY-AUDIT.md)

## Phase 2.4 integration outcome (23 October 2026)

| Article | Integration result | Article status | Remaining blocker |
|---|---|---|---|
| T01 Teknik Pernapasan | Pregnancy wording limited to general anxiety/self-care context and separated from labor-specific source scope; detail label no longer says trimester III. | DRAFT / PENDING CLINICAL REVIEW | Copy needs clinical review; practice remains locked. |
| T02 Terapi Musik | Added NCCIH S13 for the distinction between personal listening and professional music therapy; removed unsupported pregnancy catalog category; kept route/title and no audio. | DRAFT / PENDING CLINICAL REVIEW | No trimester III efficacy claim; `Relaksasi` catalog label remains an editorial taxonomy question; audio rights/media unavailable. |
| T03 Relaksasi Otot Ringan | Definition now explicitly distinguishes the unnamed light/body-awareness approach from PMR; catalog scope reduced to Relaksasi only. | DRAFT; CONTENT DEFINITION BLOCKER | Topic cannot be completed as a defined therapy without a source-backed definition decision. No PMR equivalence; no practice steps. |
| T04 Pijat Pendamping | Labor copy retains consent and now states that a companion must first be taught the selected technique. | DRAFT / PENDING CLINICAL REVIEW | No technique/location/pressure/duration; no pregnancy scope; clinical review pending. |

No article was promoted to `SOURCE_REVIEWED` or `CLINICALLY_REVIEWED`. User-facing instructional practice remains locked for all four articles. T02 audio remains unavailable. No PWA, caching, publication, visual, or design-system policy changed.
