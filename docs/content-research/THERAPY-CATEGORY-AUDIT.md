# Therapy Category Audit

**Audit date:** 23 October 2026. Production categories and approved catalogue baseline have not been changed.

The catalog uses filters `Hamil`, `Bersalin`, `Relaksasi`. Detail metadata currently narrows the articles as follows: T01 has “Kehamilan trimester III” and “Saat persalinan”; T02, T03, and T04 have “Saat persalinan”. The catalog currently assigns Hamil/Bersalin/Relaksasi to T01, T02, and T03, and Bersalin to T04. This creates a mismatch between catalogue filter eligibility and the article metadata for T02 and T03.

## Evidence coverage

| Article | Supported for Trimester III | Supported for labour | General education only | Unsupported / pending verification |
|---|---|---|---|---|
| T01 — Teknik Pernapasan | **PARTIAL.** NHS S5 mentions breathing exercises as pregnancy anxiety self-care, but does not establish the current topic for all trimester-III users or define this article’s exact approach. | **SUPPORTED, bounded.** WHO S1/NICE S2 support preference-led options during labour; NICE's possible pain statement is specific to latent first stage. | Yes: explain that breathing/relaxation is a choice, not a promised result. | Exact web-created technique/procedure; universal individual suitability; an asserted trimester-III clinical benefit. |
| T02 — Terapi Musik | **NOT SUPPORTED for current page claim.** S7 covers varied music-therapy interventions across pregnancy contexts, not casual listening for every third-trimester mother. | **SUPPORTED, choice only.** NICE S2 explicitly supports playing music chosen by the woman in labour. Outcome effects remain uncertain under S3 and cannot be promised. | Yes: explain the difference between personal listening and professional music therapy (NCCIH S13). | T3-specific efficacy, a playlist/dose, use as a clinical service, audio rights and any safety/volume threshold. |
| T03 — Relaksasi Otot Ringan | **UNSUPPORTED.** No source verified for the named light/body-awareness adaptation in trimester III. | **PARTIAL for a different technique only.** WHO S1 names PMR for a defined labour population; this does not support the T03 adaptation. | Yes: explain the terminology gap without implying equivalence. | Definition, efficacy, suitability, or practice of the “light” adaptation; all trimester/labour category claims for this exact label. **Content-definition blocker.** |
| T04 — Pijat Pendamping | **UNSUPPORTED by the sources checked.** The reviewed guidance is about labour. | **SUPPORTED, bounded.** WHO S1 manual techniques for healthy pregnant women requesting labour pain relief; NICE S2 supports choice if companion technique has been taught. S4 evidence is uncertain/heterogeneous. | Yes: autonomy, preference, consent, and no guarantee. | Pregnancy trimester use, universal massage safety, named locations/pressure/duration/techniques, individual contraindication assessment. |

`SUPPORTED` above describes source coverage, not proof of clinical appropriateness for a particular user and not clinical approval.

## Category recommendations (proposals only)

1. **T01:** Keep `Bersalin`. Treat `Hamil` as a general anxiety/self-care educational association only, not as a trimester-III protocol; consider whether the current `Relaksasi` tag is merely descriptive taxonomy. Do not use the filter to imply suitability.
2. **T02:** Current detail article is specifically labour-choice content, so catalogue `Bersalin` is source-aligned. Remove or defer `Hamil` and `Relaksasi` tags unless the label/category is explicitly editorial and the pregnancy content is expanded from a source-supported scope. A future “Musik untuk Relaksasi” name would still not be a professional music-therapy service.
3. **T03:** Do not imply `Hamil` or `Bersalin` coverage for the custom light/body-scan variation. The production detail says labour context only while the catalogue tags include broader Hamil and Relaksasi; treat the mismatch as a blocker to any filter recommendation until terminology is resolved. If later retitled PMR, category would need a specific source-backed patient scope.
4. **T04:** `Bersalin` matches the inspected source scope. Do not add `Hamil` or general `Relaksasi` based on the current research.

## Filter semantics recommendation

Keep existing approved filters untouched during this phase. For a later phase, document whether filter labels mean (a) source context discussed in the article, or (b) suggestion of personal suitability. Use the former only. The existing catalogue note that categories are editorial context, not clinical recommendation, is useful but does not resolve inaccurate tagging.

## Phase 2.4 implementation outcome (23 October 2026)

The authorized, unambiguous metadata corrections have been applied without changing the catalog layout or filter labels:

| Article | Catalog categories now applied | Detail category labels | Decision |
|---|---|---|---|
| T01 Teknik Pernapasan | Hamil, Bersalin, Relaksasi | Kehamilan; Saat persalinan | `Hamil` remains broad editorial association for the NHS pregnancy-anxiety context, not a trimester III protocol. |
| T02 Terapi Musik | Bersalin, Relaksasi | Saat persalinan | Removed `Hamil`; kept `Relaksasi` as a descriptive catalog tag pending a separate decision on category semantics. |
| T03 Relaksasi Otot Ringan | Relaksasi | Relaksasi | Removed `Hamil` and `Bersalin`; the precise topic remains a content-definition blocker. |
| T04 Pijat Pendamping | Bersalin | Saat persalinan | No change; these labels match the bounded labor source scope. |

These tags describe article context only and must not be presented as individualized suitability or safety advice. The proposed T02 `Relaksasi` tag remains semantically ambiguous and is not source evidence for efficacy.

See the [`claim-source matrix`](THERAPY-CLAIM-SOURCE-MATRIX.md) for per-claim mapping.
