# Ruang Ibu — Clinical review / approval log

This template is intentionally unfilled. Research citations and student authorship do **not** constitute clinical validation.

| Content ID | Exact file/version/hash | Scope (trimester III / labor) | Reviewer's name and qualification | Checked for safety/contraindications? | Date | Decision (approved / revise / reject) | Reviewer notes |
|---|---|---|---|---|---|---|---|
| T01 | Draft v0.2 | both | Pending | Pending | — | Awaiting review | — |
| T01 | `src/content/therapyArticles.ts` revision 0.4 (derived from Draft v0.2) | trimester III and labor | Pending | Pending | — | Awaiting review | Mother-friendly rewrite and reordered sections; claim-to-source mapping and evidence certainty retained in structured data. No practice steps enabled. All revised clinical wording awaits review. |
| T01 | `src/content/therapyArticles.ts` revision 0.5 (derived from Draft v0.2) | trimester III and labor | Pending | Pending | — | Awaiting review | Intro clarifies that benefits are uncertain and may differ by mother; labor context is rewritten in plain language while retaining the WHO population scope and preference-based choice. Sources S1/S2/S3 retained. No practice steps enabled; revised clinical wording awaits qualified review. |
| T01 | `src/content/therapyArticles.ts` revision 0.6 (derived from Draft v0.2) | trimester III and labor | Pending | Pending | — | Awaiting review | Labor section adds a plain-language suggestion to discuss the mother's choice with her attending midwife, consistent with preference-led and individualized care (WHO S1; NICE S2). No efficacy or safety claim added. No practice steps enabled; all content remains pending qualified clinical review. |
| T02 | Draft v0.2 | both | Pending | Pending | — | Awaiting review | — |
| T03 | Draft v0.2 | both | Pending | Pending | — | Awaiting review | — |
| T04 | Draft v0.2 | labor primarily | Pending | Pending | — | Awaiting review | — |
| S01 | Draft v0.2 | both | Pending | Pending | — | Awaiting review | — |
| A01-A03 | Script Draft v0.2 | topic-dependent | Pending | Pending | — | Awaiting review | — |

Review must check intended audience, contraindications, instructions, red-flag response, claims and evidence, Indonesian terminology, and audio instructions exactly as spoken. Any approved instruction revision must be reviewed again before publication.

## Phase 2.2 — additional therapy detail drafts (22 October 2026)

No clinical reviewer or approval decision is recorded for these materials. The following entries document the currently published draft scope and claim-to-source links. All patient-facing copy remains **DRAFT / PENDING CLINICAL REVIEW**. Practical instructions remain **LOCKED**.

| Content ID / version | User-facing scope and source mapping | Excluded material / open review | Decision |
|---|---|---|---|
| T02, source draft v0.2; `src/content/therapyArticles.ts`, revision 0.1 | Terapi Musik is described as an optional music preference during labor. Paragraph reference IDs map to S1 WHO, S2 NICE, and S3 Cochrane. S1/S2 support the labor-choice context; S3 is retained internally for uncertainty. No outcome is promised. | Draft audio selection/use suggestions are excluded. Audio remains unavailable. S7's pregnancy-specific efficacy claim is not published because the scoped evidence does not support a T02 claim for a specific trimester. Clinical review must confirm the paraphrase, scope, and source mapping. | Awaiting review |
| T03, source draft v0.2; `src/content/therapyArticles.ts`, revision 0.1 | Relaksasi Otot Ringan introduces progressive muscle relaxation as a concept and a labor relaxation option, mapped to S1 WHO and S3 Cochrane. Uncertainty and individual suitability limits are stated in plain language. | All draft movement, position, timing, frequency, and intensity directions are excluded. The page does not state an individual benefit or universal suitability. Review is required before any practice content is written or enabled. | Awaiting review |
| T04, source draft v0.2; `src/content/therapyArticles.ts`, revision 0.1 | Pijat Pendamping describes optional touch and labor context. Paragraph-level mappings use S1 WHO, S2 NICE, S4 Cochrane, and S8 NHS. Consent and comfort are foregrounded; no effect or universal safety is promised. | No massage location, pressure, duration, technique, contraindication, or practice step is published. S8 is general labor pain-relief context, not evidence for a particular massage technique. Review must assess consent wording, individualized suitability, safety, and each source-to-claim link before publication. | Awaiting review |

The detail routes are `/terapi/terapi-musik`, `/terapi/relaksasi-otot-ringan`, and `/terapi/pijat-pendamping`; source slugs and article IDs remain traceable in structured article data. The shared presentation template is reused. T02 audio is unavailable; T03 and T04 have no audio section because audio is not applicable. This is an editorial implementation record, not a clinical approval.

## Phase 2.2A — final mother-friendly copy review (23 October 2026)

The changes below are copy-only refinements to T02, T03, and T04 data. Route names, catalog labels, filters, design, and shared React presentation are unchanged. Every revised health-related statement remains **DRAFT / PENDING CLINICAL REVIEW**. No audio was added and all practice guides remain locked.

| Article / field | Previous wording | Revised wording | Source mapping and editorial reason | Clinical review |
|---|---|---|---|---|
| T02 introduction | “Musik dapat menjadi salah satu pilihan suasana yang menemani persalinan jika Ibu menginginkannya. Manfaatnya belum dapat dipastikan dan bisa berbeda pada setiap Ibu.” | “Topik ini membahas musik pilihan Ibu sebagai pendamping suasana saat persalinan. Manfaatnya belum dapat dipastikan dan bisa berbeda pada setiap Ibu.” | S1 WHO Recommendation 21, S2 NICE NG235 1.6.9, S3 Cochrane CD009514. Defines the page's scope as listening to a preferred music choice and retains uncertainty. | Required |
| T02 definition | “Terapi musik di halaman ini berarti mendengarkan musik sebagai pilihan untuk menemani relaksasi. Ibu tetap bebas memilih musik atau tidak mendengarkannya.” | “Di Ruang Ibu, istilah ini merujuk pada mendengarkan musik pilihan Ibu, bukan layanan terapi musik klinis yang diberikan secara terarah oleh profesional.” | S1/S2 cover music as a labor option; the distinction from a clinical service is the product's editorial scope, not an efficacy claim. | Required |
| T02 purpose and context | “Musik dibahas sebagai pilihan suasana yang disukai Ibu, bukan janji bahwa nyeri atau kecemasan akan berkurang.” / “Saat persalinan, musik pilihan Ibu disebut sebagai salah satu pilihan pendamping. Manfaatnya belum dapat dipastikan dan bisa berbeda pada setiap Ibu.” | “Pembahasan ini mengenalkan musik pilihan Ibu sebagai salah satu pilihan pendamping suasana saat persalinan. Mendengarkan musik tidak menjamin nyeri berkurang.” / “Jika Ibu bersalin dan ingin mendengarkan musik, Ibu dapat memilih musik yang disukainya. Musik mungkin tidak terasa nyaman bagi setiap Ibu, dan manfaatnya belum dapat dipastikan.” | NICE S2 1.6.9 supports a woman's choice of music during labor; S3 records uncertain labor-pain evidence. The wording makes no treatment or individual-effect promise and does not claim an anxiety effect. | Required |
| T03 introduction, definition, purpose | The former copy called the topic a “relaksasi otot” approach and defined it as progressive muscle relaxation (PMR), without distinguishing the draft's adaptation. | “Topik ini membahas cara mengenali ketegangan tubuh secara lembut. Manfaatnya belum dapat dipastikan, dan pendekatan ini tidak selalu sesuai untuk setiap Ibu.” Definition: “Istilah relaksasi otot ringan di halaman ini merujuk pada pendekatan mengenali ketegangan dan memperhatikan bagian tubuh secara lembut. Ini berbeda dari relaksasi otot progresif (PMR), yaitu teknik relaksasi lain. Penjelasan ini bukan panduan latihan.” Purpose: “Pembahasan ini mengenalkan perhatian pada ketegangan tubuh sebagai salah satu pendekatan relaksasi. Tujuannya bukan memastikan bahwa ketegangan atau nyeri akan berkurang.” | Draft T03 explicitly distinguishes its gentle release/body-scan variation from a standard PMR protocol. The distinction is preserved instead of equating the two. S1 WHO names PMR for a scoped labor population; S3 concerns a varied group of labor relaxation techniques and cannot establish the effect of this specific adaptation. | Required; reviewer should decide whether title and topic adequately describe the adapted approach. |
| T03 labor context | “Saat persalinan, relaksasi otot progresif termasuk pilihan relaksasi yang dapat dipertimbangkan oleh ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri, sesuai preferensi masing-masing. Informasi ini tidak memastikan pendekatan tersebut cocok untuk setiap kondisi.” | “Relaksasi otot progresif disebut sebagai salah satu pilihan relaksasi saat persalinan bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri. Namun, pendekatan ringan di halaman ini berbeda dari teknik tersebut, sehingga informasi itu belum memastikan manfaat atau kesesuaiannya. Ibu dapat membicarakan pilihan ini dengan bidan.” | WHO S1 Recommendation 21 and Cochrane S3 support the scoped PMR/labor context, not the draft's distinct gentle variation. The copy explicitly marks that evidence boundary. | Required; the adaptation's clinical relevance remains unresolved. |
| T04 definition and purpose | “Pijat pendamping adalah sentuhan atau pijatan yang diberikan oleh pendamping bila Ibu memilihnya. Ibu tidak harus menerima sentuhan yang tidak diinginkan.” / “Pijat dibahas sebagai salah satu pilihan dukungan kenyamanan saat persalinan. Pijat bukan pengganti pemeriksaan tenaga kesehatan atau pilihan penanganan nyeri lainnya.” | “Pijat pendamping adalah pijat yang diberikan oleh pendamping saat persalinan jika Ibu menginginkannya. Ibu berhak menolak atau meminta sentuhan dihentikan kapan saja.” / “Pijat dibahas sebagai salah satu pilihan pendamping kenyamanan saat persalinan. Pijat tidak menggantikan pemeriksaan bidan atau dokter maupun pilihan pereda nyeri lainnya.” | WHO S1 Recommendation 22, NICE S2 on respecting choices, Cochrane S4 on manual methods, and NHS S8 as broader pain-relief context. Keeps consent, choice, and the boundary against replacing care. | Required |
| T04 labor context | “Saat persalinan, pijat termasuk pilihan dukungan nyeri yang dibahas bagi ibu hamil sehat yang menginginkannya, sesuai preferensi. NICE menyebut pilihan pijat oleh pendamping jika tekniknya telah diajarkan. Ibu dapat membicarakan pilihan ini dengan bidan yang mendampingi.” | “Saat persalinan, pijat dapat menjadi salah satu pilihan bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri. Jika Ibu memilihnya, pendamping perlu memahami teknik yang sesuai. Bicarakan pilihan ini dengan bidan yang mendampingi.” | WHO S1 Recommendation 22 and NICE S2 1.6.6 support the preference-based labor context and the condition that companion massage techniques are taught. Removes institutional narration while preserving that condition and the midwife discussion. | Required |

### Terminology and category audit

- **T02 terminology:** the page is about listening to music chosen by the mother, not a professionally delivered clinical music-therapy service. The title, catalog label, and route stay **Terapi Musik**, as requested. The suggested label **Musik untuk Relaksasi** is only an editorial proposal and needs separate user approval.
- **T03 terminology:** the source draft explicitly says its gentle release/body-scan variation is not the standard progressive muscle relaxation (PMR) protocol. User-facing copy now preserves that distinction. WHO's PMR labor recommendation and the Cochrane review of varied relaxation techniques do not by themselves establish benefit or individual suitability for the specific gentle variation; this remains a clinician-review question.
- **Catalog filter mismatch:** T02 and T03 catalog rows currently carry `Hamil`, `Bersalin`, and `Relaksasi`, while their detail metadata and text focus on labor. T02's pregnancy review S7 covers mixed pregnancy stages and the draft explicitly cautions against generalizing it to every third-trimester mother; S7 is not used for a T02 patient-facing claim here. Recommended future correction: remove `Hamil` from T02 unless pregnancy-specific scope is supported and reviewed; retain `Bersalin` and descriptive `Relaksasi`.
- **T03 catalog filter mismatch:** the gentle body-scan/release variation is not the PMR covered by the labor recommendation. Recommended future correction: retain descriptive `Relaksasi`; remove `Hamil` and `Bersalin` until qualified review establishes those contexts for the actual variation. The current catalog categories and approved baseline were not changed.
- **T04:** catalog `Bersalin` and detail `Saat persalinan` agree with the article's scope. No category change is recommended based on the current material.

Category filters are editorial navigation metadata, not a safety assessment or recommendation. No catalog category, route label, or approved visual baseline was modified in this phase.

## Phase 2.4 — source-verified content integration (23 October 2026)

This entry records bounded edits to article data and catalog filter metadata based on the Phase 2.3 claim-source and category audits. It does not constitute a new full-source audit, `SOURCE_REVIEWED` status, or clinical approval. All articles remain `DRAFT / PENDING CLINICAL REVIEW`; practice remains `LOCKED`; audio remains unavailable.

| Article / field | Integrated change | Source mapping and reason | Clinical state |
|---|---|---|---|
| T01 — pregnancy context | Reframed as general pregnancy self-care when the mother feels anxious; says this does not determine which exercise suits her condition and advises discussing persistent or disruptive anxiety with a midwife or doctor. Detail category is “Kehamilan”, not “Kehamilan trimester III”. | NHS S5 supports breathing exercises/meditation in a pregnancy-anxiety context and seeking help when anxiety affects daily life; it does not support a trimester-III protocol. Labor copy remains separately scoped to healthy pregnant women requesting labor pain support (WHO S1, NICE S2, Cochrane S3). | Pending review; no practice steps enabled. |
| T02 — definition and references | Retains the distinction between listening to mother-chosen music and professional music therapy. Added NCCIH S13 to the definition paragraph and article references; no trimester-III benefit statement or audio instruction added. | NCCIH S13 supports the professional music-therapy distinction, not a pregnancy-specific outcome. WHO S1/NICE S2 support music choice in labor; Cochrane S3 remains internal context for uncertainty. | Pending review; route/title unchanged; audio unavailable. |
| T03 — definition, purpose, labor context | Copy says the “light muscle relaxation” term is not sufficiently defined by checked sources and differs from progressive muscle relaxation (PMR). The introduction frames benefit/suitability as an evidence gap, rather than asserting the approach is unsuitable for some mothers. A `not_rated` evidence note records `CONTENT DEFINITION BLOCKER`; detail and catalog categories now only say “Relaksasi”. | WHO S1/Cochrane S3 discuss PMR or varied relaxation interventions, not the distinct light/body-awareness approach. No PMR result is attributed to this variation. | Draft informational content only; practice instructions absent; content definition remains blocked. |
| T04 — labor context | States that if the mother chooses massage, the companion must first be taught the technique to be used; retains choice, consent, and discussion with the attending midwife. | NICE S2 1.6.6 supports a taught companion technique; WHO S1 provides bounded labor context. No location, pressure, duration, or procedure added. | Pending review; practice remains locked. |
| Catalog category metadata | Removed unsupported `Hamil` from T02; removed `Hamil` and `Bersalin` from T03. T01 catalog filters remain broad editorial tags while detail labels are “Kehamilan” and “Saat persalinan”. T02 keeps `Relaksasi` as a descriptive filter pending taxonomy semantics review. | See Phase 2.4 category record in `docs/content-research/THERAPY-CATEGORY-AUDIT.md`. Filters are editorial context, not personal safety/suitability decisions. | No category implies clinical approval. |

No prior review history was removed. All revised health-related wording still requires qualified clinical review before it can be considered clinically approved.

## Phase 2.5 — source-based guidance and audio (23 October 2026)

This implementation adds patient-facing, source-mapped educational guidance where patient guidance could be verified. The `sourceReview` field is separate from `clinicalReview`. `SOURCE_REVIEWED` records the engineering/source audit only; it is not a clinician endorsement. All four `clinicalReview.status` values remain `draft`. No article is `CLINICALLY_REVIEWED`. Source-based guides do not authorize individualized practice and remain subordinate to the reader's comfort and maternity team's advice.

| Article | User-facing additions | Source mapping / boundary | Internal state |
|---|---|---|---|
| T01 — Teknik Pernapasan | Separates preparation during pregnancy from breathing choices during labour. Guide summarizes talking/practising with a midwife, exhaling as a contraction builds, then breathing slowly and rhythmically for its duration; relaxed shoulders and choosing nose or mouth by comfort. No counts, holds, timed exercise, or pushing advice added. Safety notice now maps to source IDs. | HDFT S6, lines on breathing and its advice/support for any time; NHS S15, self-help and the option to discuss/change preferences; WHO/NICE/Cochrane retained for context and uncertainty. Copy does not promise a result. | `SOURCE_REVIEWED`; clinical review `draft`; practice text is source-based, not clinically approved. |
| T02 — Musik untuk Relaksasi | Display title changed; old slug `/terapi/terapi-musik` preserved. Distinguishes user-selected listening from professional music therapy. Guide covers choice, comfortable volume, playback controls and stopping/changing choice. Ambient instrumental attached. | NICE S2 supports a mother's music choice during labour; NCCIH S13 supports the distinction between listening and music therapy. Volume/play controls are product-use instructions, not health recommendations. No trimester-specific benefit claim. | `SOURCE_REVIEWED`; clinical review `draft`; audio is ambient, not therapy narration. |
| T03 — Relaksasi Tubuh (superseded 28 Oct 2026) | The older version offered body-awareness/grounding context; the display title and route are retained. | The earlier entry relied on an indexed S14 result when direct retrieval returned 403. The fresh S14 page check and copy decision are recorded below: S14 is limited to birth-trauma support and does not validate general pregnancy/labor relaxation. This older practice copy has since been replaced by support/communication language without technique steps. | `DRAFT`; no equivalence to PMR or general efficacy claim. |
| T04 — Pijat Pendamping | Replaces locked placeholder with communication-only steps: express preference, consent, comfort, taught technique only, ask midwife, stop at any time. No massage actions or body locations are shown. | WHO S1 and NICE S2 support choice/comfort and a companion's technique having been taught; prior Cochrane S4 remains linked only to bounded evidence context. | `SOURCE_REVIEWED`; clinical review `draft`; no massage technique is published. |

Audio tracks contain no guided clinical speech. They are environmental/instrumental recordings only and do not imply therapeutic efficacy. The app gives the user control to start, pause, seek, change volume, or stop. None autoplays. Source/license evidence is recorded in `assets/ASSET-LICENSE-MANIFEST.md`.

### Phase 2.5 clinical status summary

- T01, T02 and T04: source-reviewed for the bounded wording and usage instructions recorded above; still not reviewed by a clinician.
- T03: remains `DRAFT` because the source's direct availability and scope do not resolve the broader content definition. Its optional grounding wording is limited to that source's context.
- All practical guidance carries a source basis where shown, but none carries `CLINICALLY_REVIEWED` approval. A qualified professional review is still required before treating this information as a clinically endorsed recommendation.

### Phase 2.5 final MVP QA — 23 October 2026

Audio playback QA covered explicit play/pause, keyboard operation, seek, volume range, changing tracks (the prior track pauses), no autoplay, load failure, and the offline recovery message. The browser test used a deliberately missing media URL to exercise the error state; a device-level offline transition was not simulated. The error tells readers to reconnect and retry. No guided health audio or new health claim was added. T01–T04 clinical review statuses are unchanged: T01/T02/T04 remain source-reviewed but clinically draft; T03 remains draft. All article content remains pending professional clinical review; none is presented as clinically approved.

### Phase 3 — maternity guides (23 October 2026)

Two new guides were added with internal clinical state `DRAFT`; this source mapping records bounded educational support and is not clinical approval.

| Guide statement/context | Source mapping | Boundary retained |
|---|---|---|
| Writing down birth preferences, discussing place/support choices, and preparing essential items | NHS S17, “What to include in your birth plan”; NHS S18, “Hospital bag checklist” | A birth plan is a discussion aid and may change. Local facility requirements differ. |
| Comfort during pregnancy and questions about individual circumstances | NHS S19, “Pregnancy symptoms you need to get help for” | No individualized treatment or physical exercise is prescribed. Readers are directed to their own midwife/doctor. |
| Fetal movement changes and pregnancy warning symptoms | NHS S20, “Your baby's movements”; NHS S19, “Pregnancy symptoms you need to get help for” | Readers are told to contact their maternity care team promptly; NHS contact pathways are not presented as Indonesian pathways. |
| General signs labor may have started and when to contact the maternity team | NHS S21, “Signs that labour has begun” | Signs vary; the page does not diagnose labor or estimate its timing. Local contact details differ. |
| Labor comfort choices and companion support | WHO S1, NICE S2, HDFT S6, NHS S17 and S22 | Choices are optional and may not suit every person or circumstance. Touch requires the mother's permission; no massage procedure is taught. |
| Optional audio link | Product behavior; links to existing ambient/instrumental recordings | No clinical effect is claimed; audio contains no health instructions. |
| Link to T03 Relaksasi Tubuh | Existing S14 source context | Clearly limited; not described as a validated exercise or universally suitable pregnancy practice. |

All warning content is general education based on UK NHS information. The pages note that local pathways differ and defer to the reader's own maternity team. No new diagnosis criteria, treatment instructions, or efficacy claims were added. Both guides remain `DRAFT / PENDING CLINICAL REVIEW`; practical guidance is limited to preparation and communication, not clinical procedures.

### Release blocker remediation — safety-source and T03 scope (23 October 2026)

This entry records a source-bounded copy update, not clinical approval.

| Published wording/topic | Source mapping | Decision/status |
|---|---|---|
| Pregnancy warning signs: absent/reduced/changed fetal movement | NHS S20; Ministry of Health KIA 2024 S23 | Promptly contact the reader's maternity provider/facility; no home diagnosis is implied. |
| Bleeding, severe abdominal pain, seizures, severe headache, sudden vision problems, sudden facial/hand swelling | NHS S19; WHO S24; Ministry of Health S23/S25 | These are described as signs requiring prompt health assessment. Emergency routes remain local; no UK telephone numbers are shown. |
| Difficult breathing and high fever | NHS S19; WHO S24; Ministry of Health S23 | Urgent assessment wording retained; no diagnosis is assigned. |
| Severe pain between contractions, bleeding, waters breaking, movement changes, labour before 37 weeks, or imminent birth | NHS S20/S21; Ministry of Health KIA 2024 S23 | Contact maternity team/facility promptly; seek local emergency assistance for imminent birth or life-threatening emergency. |
| T03 grounding information (superseded 28 Oct 2026) | Healthier Together S14 | The earlier source-review designation is superseded. A fresh page check found S14 concerns birth-related trauma and mentions grounding/breathing options when birth memories are distressing; it does not support a general relaxation method. The copy no longer offers grounding steps or efficacy claims, and T03 `sourceReview` and `clinicalReview` are both `draft`. |

Article runtime data no longer contains authoring-only evidence notes, editorial source labels, or revision-history prose. Historical review decisions remain in this log and the Phase 2.3 content research documents. T01/T02/T04 remain source-reviewed for their bounded educational copy; all four clinical review states remain `draft`. None is represented as clinically reviewed.

### Final content remediation — 28 October 2026

The targeted revisions are editorial corrections, not clinical approval. `VERIFIED` is reserved for a narrowly matched source fact; `LIMITED EVIDENCE` means the study supports only a bounded description; `CLINICAL REVIEW REQUIRED` means safety/suitability or practical wording remains draft for a qualified Indonesian midwife/obstetric clinician.

| Articles | Copy action | Review state |
|---|---|---|
| A01/A04 | Limited small compress studies to their studied population/intervention. A04 retains only ACOG's non-numeric heat-safety advice, with clinician discussion and no inferred dose. | LIMITED EVIDENCE; CLINICAL REVIEW REQUIRED |
| A05 | Retained older ACOG information as official guidance, not recent research; described S31 only as small remedial-massage feasibility work for pelvic-girdle pain. | LIMITED EVIDENCE; CLINICAL REVIEW REQUIRED |
| A06/B06 | Kept support and help-seeking; clarified structured music interventions and one-site results cannot establish outcomes for every reader or a casual playlist. | LIMITED EVIDENCE; CLINICAL REVIEW REQUIRED |
| B01/T02 | Removed generic music efficacy wording and separated labor research from the Ruang Ibu audio. | LIMITED EVIDENCE; CLINICAL REVIEW REQUIRED |
| B05 | Kept second-stage perineal heat as care-team context; stated varied outcomes and no use as a pregnancy back-compress instruction. | VERIFIED bounded guideline context; LIMITED EVIDENCE; CLINICAL REVIEW REQUIRED |
| T01 | Removed the specific breathing sequence and pregnancy-trimester inference; directs readers to discuss available choices with the midwife. | LIMITED EVIDENCE; CLINICAL REVIEW REQUIRED |
| T03 | Removed general grounding benefit claims and all self-guided technique steps. S14 is limited to its specific birth-trauma context; no efficacy conclusion is made. | INSUFFICIENT EVIDENCE for general relaxation; CLINICAL REVIEW REQUIRED |
| T04 | Retained consent, communication, and the taught-technique boundary; specific massage studies are not generalized to companion massage. | LIMITED EVIDENCE; CLINICAL REVIEW REQUIRED |

Pregnancy and labor warning signs remain linked to the already audited official sources, but their exact wording and escalation pathways still require review against Indonesian maternity-care practice before Production. No clinical approval was recorded.

Reviewer handoff form: [`CLINICAL-REVIEW-PACKET-2026-10-28.md`](content-research/CLINICAL-REVIEW-PACKET-2026-10-28.md). It is a blank decision record for a qualified human reviewer; no reviewer, date, or clinical approval has been entered.

### Customer content revision 2026 (25 October 2026)

This entry records source and copy work for the customer revision. It is not a clinical sign-off. Customer evidence was bibliographically checked against publisher pages and DOI records; source accuracy does not establish that each practical statement has been clinically approved.

| Content | Sources | Current status and boundaries |
|---|---|---|
| A01 pregnancy back pain | C01–C04, S26 | Draft. Common pregnancy-related musculoskeletal discomfort is distinguished from other possible causes. Prompt-care symptoms are linked to NHS S26; no diagnosis is made. |
| A02 pregnancy music; B02 labor music | C04–C08, S1/S2/S13 | Draft. Clinical protocols/populations are distinguished from Ruang Ibu playlists. C07 pain and anxiety findings are kept separate. |
| A03/B03 breathing | S2/S3/S5/S6/S15 | Existing article retained and associated with both contexts. No forced holding or hyperventilation pattern is added; practice guidance says to stop or ask for support if uncomfortable. |
| A04 pregnancy warm compress | C01–C03, S26/S29 | Draft. Case and one-group study results are not turned into a general procedure. No temperature, duration, or location instruction is published. Burn awareness and consultation are stated. |
| A05 pregnancy massage | S27/S28 | Draft. Prenatal massage is separated from labor companion massage; consent and trained provider are emphasized. No pressure, position, or technique instruction is published. |
| A06 pregnancy anxiety | C05/C06, S5/S17 | Draft. Feelings are not labeled as a diagnosis. C05's high-risk NST population and C06's combined literacy/music intervention are disclosed as limits. |
| B01 labor pain | C07, S2/S8/S22 | Draft. Individual experience and pharmacologic/nonpharmacologic choices are described generally; clinical choices remain with the maternity team. |
| B04 companion massage | S1/S2/S4 | Existing article retained. Consent, taught technique, and stop-on-request boundaries remain; no physical procedure is added. |
| B05 warm compress during labor | S2/S29; C01–C03 used only for contrast | Draft. Perineal compress is framed as care by the attending professional when appropriate, never as a self-directed website procedure. |
| B06 labor anxiety | C07/C08, S2/S22 | Draft. C07's nonsignificant pooled anxiety results are explicit; C08 is bounded to its single-site study. No guaranteed anxiety reduction is claimed. |

Bibliographic changes and exact records are in `docs/content-research/CUSTOMER-CONTENT-REVISION-2026.md`. C02 is dated 2023 online although its issue is 2022; C03 uses the publisher-listed DOI and notes the title/activity date discrepancy; C06 distinguishes 2024 online-first from the 2026 print issue. All new/expanded pages stay `clinicalReview: draft`. A qualified midwife/obstetric clinician must still review the exact published copy before clinical endorsement.

### Koreksi editorial customer - 25 Oktober 2026

Koreksi bahasa dan penyusunan ulang copy dilakukan untuk membantu pembaca memahami isi, bukan sebagai persetujuan klinis. Seluruh `clinicalReview` tetap `draft` dan tidak diubah menjadi approved.

| Materi | Sumber | Batas dan keputusan |
|---|---|---|
| Kompres hangat saat hamil | C01-C03, NHS S26, ACOG S30 | Copy dibatasi pada otot punggung yang pegal. Mengikuti ACOG: setelan bantalan pemanas terendah, handuk sebagai pelapis, batasi lama penggunaan, hentikan bila tidak nyaman, dan hubungi tenaga kesehatan untuk nyeri berat/menetap. Tidak ada suhu atau jumlah menit yang ditambahkan. Temuan studi kecil/kasus tetap dijelaskan sebagai bukti terbatas, bukan protokol universal. |
| Kompres hangat dalam persalinan | NICE S02 | Kompres perineum hanya dijelaskan sebagai tindakan perawatan oleh tenaga kesehatan pada tahap kedua persalinan. Artikel tidak mengajarkan tindakan mandiri. |
| Musik dan kecemasan/nyeri | C04-C08 | Copy disederhanakan. Hasil nyeri C07 tetap dipisahkan dari hasil kecemasan; program penelitian tidak disamakan dengan playlist Ruang Ibu. |
| Panduan Hamil dan Bersalin serta artikel lain | Sumber setiap materi tetap terpetakan | Enam topik tiap panduan ditampilkan dengan urutan lebih mudah ditemukan. T03 tetap terbatas pada grounding dalam konteks yang disebut sumbernya dan tidak disebut relaksasi fisik tervalidasi umum. |

ACOG S30: https://www.acog.org/womens-health/faqs/back-pain-during-pregnancy . Pemeriksaan copy tidak menggantikan pemeriksaan kebidanan. Penelaahan bidan/dokter atas naskah praktik tetap diperlukan sebelum endorsement klinis.

### Audit sumber seluruh situs — 28 Oktober 2026

Audit referensi 2022–2026 dicatat pada `docs/content-research/PHASE-2.3-SOURCE-AUDIT.md` dan `THERAPY-CLAIM-SOURCE-MATRIX.md`. Audit bibliografi dan pemetaan sumber bukan telaah klinis. Semua artikel, panduan Hamil/Bersalin, dan bagian praktik tetap `draft`; tidak ada materi yang disetujui secara klinis. Sebelum rilis, reviewer kebidanan Indonesia perlu memeriksa khusus batas penggunaan kompres hangat, klaim pijat kehamilan, pemisahan latihan napas kehamilan dari napas kala persalinan, definisi grounding T03, pijat pendamping, dan tanda bahaya terhadap jalur layanan lokal.
