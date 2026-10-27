# Q&A Backend API Contract (M3)

Base path: same-origin `/api`. All responses use JSON `{ data }` or `{ error: { code, message } }`, `Cache-Control: no-store`, `X-Content-Type-Options: nosniff`, and `Referrer-Policy: no-referrer`. No endpoint returns an authentication token.

## Public

| Method and route | Request | Success response | Errors | Access |
|---|---|---|---|---|
| `GET /api/questions?articleSlug=...&limit=10&cursor=...` | Exact allowlisted article slug; limit 1–20, cursor opaque | `200 { data: { questions: [{id, articleSlug, displayName, question, status, createdAt, answer}], nextCursor } }` | `400 invalid_article/invalid_pagination`, `503 service_not_configured`, `500 request_failed` | Public; only approved/answered rows and sanitized public fields. No email, original text, IP, moderator or event metadata. |
| `POST /api/questions` | `{ articleSlug, displayName, question, email?, consentToPublicModeration, turnstileToken }` | `201 { data: { id, status: "pending", message } }` | `400 invalid_submission/invalid_json`, `403 origin_not_allowed/verification_failed`, `413 payload_too_large`, `429 rate_limited`, `503 service_not_configured/verification_unavailable`, `500 request_failed` | Same-origin; server Turnstile validation and HMAC IP rate limit. Unknown fields rejected. |

Limits: display name 2–50 characters, question 10–1,000, email at most 254 and valid if supplied, request body at most 8 KiB. Public page size is 10 by default and capped at 20. A new record is always pending; a successful response is a receipt and does not imply publication.

Proposed form copy for M5 (not yet rendered in the UI): “Saya menyetujui pertanyaan saya ditinjau moderator dan, jika disetujui, ditampilkan secara publik setelah disunting. Saya tidak menyertakan nama lengkap, alamat, nomor identitas, hasil pemeriksaan, atau riwayat kesehatan.” Add a nearby notice that the form is for general education, does not replace a midwife/doctor, and is not an emergency channel; urgent concerns should go to the user's care team or local emergency service. Do not promise email notifications.

## Admin

Every `/api/admin/*` request passes Pages Functions middleware that verifies the Cloudflare Access RS256 JWT, issuer, audience, expiry and email allowlist. Missing configuration fails closed (503). Mutations also require same-origin `Origin` and a same-origin/none Fetch Metadata value when present. Responses are no-store.

| Method and route | Request | Success response | Notes |
|---|---|---|---|
| `GET /api/admin/summary` | none | `200 { data: { total, pending, approved, answered, rejected, hidden } }` | Counts from D1. |
| `GET /api/admin/questions?status=&articleSlug=&expiresBefore=&limit=20&cursor=` | optional allowlisted filters; `expiresBefore` is an ISO timestamp; limit 1–50 | `200 { data: { questions, nextCursor } }` | Bounded, newest first; includes original fields and `expiresAt` needed for moderation/retention review; private. |
| `GET /api/admin/questions/:id` | none | `200 { data: question and optional answer }` | 404 if absent. |
| `DELETE /api/admin/questions/:id` | empty body | `200 { data: { id, deleted: true } }` | Deletes question/answer and adds an audit tombstone without question text or email. |
| `POST /api/admin/questions/:id/moderation` | `{ action: "approve", publicDisplayName, publicQuestionText }`, or `{ action: "reject" }` / `{ action: "hide" }` | `200 { data: { id, status } }` | Approve requires moderator-edited public fields. Reject applies only to pending; hide applies to approved/answered. Invalid transitions return 409. |
| `PUT /api/admin/questions/:id/answer` | `{ answer }` (10–2,000 characters) | `200 { data: { id, status: "answered", answerUpdatedAt } }` | Only approved/answered; one answer is inserted or updated. |
| `POST /api/admin/retention/purge` | empty body or `{}` | `200 { data: { deleted } }` | Manual action only; deletes up to 500 expired records per call, atomically with an audit event. No scheduled purge exists in M3. |

Admin errors include `401 unauthorized`, `403 forbidden/origin_not_allowed`, `404 not_found`, `409 invalid_transition`, `400` validation errors, `503 admin_auth_not_configured`, and a generic `500 request_failed`. Internal exception details are not returned.

## Status transitions

| Current | Action | Next |
|---|---|---|
| pending | approve (with sanitized public name and question) | approved |
| pending | reject | rejected |
| approved or answered | hide | hidden |
| approved | write answer | answered |
| answered | update answer | answered |

Rejected/hidden rows cannot be re-approved through the current API. A new moderation policy/version is required before adding a transition. Audit events record actor, action, timestamp and minimal status metadata, not credentials or visitor IP.

### Retention review before purge

An authorized moderator can inspect candidates through `GET /api/admin/questions?expiresBefore=<URL-encoded ISO timestamp>` and follow `nextCursor`; every row includes `status` and `expiresAt`. M3 provides no scheduled purge and no dashboard confirmation UI. The M4 dashboard should surface this candidate list and require an explicit operator action after the customer approves the retention policy. The manual purge is Access-protected and removes the question and its optional email, cascades the public answer, and removes the Q&A from public reads. Existing moderation audit rows remain with `question_id = NULL`; a minimal `retention_purge` event records count and batch ID, not the removed email or question text.
