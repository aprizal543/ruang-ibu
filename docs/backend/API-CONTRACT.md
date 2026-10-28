# API Contract - Q&A and Google OIDC Admin Authentication

Base path: same-origin `/api`. JSON uses `{ data: ... }` or `{ error: { code, message } }`. Admin, auth, and error responses are `Cache-Control: no-store`. Session credentials are never returned in JSON.

## Admin authentication

| Method and route | Request | Success | Main errors | Access |
|---|---|---|---|---|
| `POST /api/auth/google/challenge` | `{}`; max 1 KiB | `200 {data:{clientId,nonce,expiresAt}}` | `400`, `403`, `429`, `413`, `503` | Exact `Origin`, `Sec-Fetch-Site: same-origin`; nonce is random, short-lived and persisted only as a digest. Client ID is public configuration. |
| `POST /api/auth/google` | `{credential,nonce}`; exact keys, max 12 KiB | `200 {data:{authenticated:true,user:{id,email,role},expiresAt}}` plus session cookie | `400`, generic `401`, `403`, `413`, `429`, `503` | Google JWT signature/JWKS, RS256, issuer, audience, expiry, nonce and `email_verified` are verified server-side. Only an active, privately provisioned `google_sub` match can create a session. |
| `GET /api/auth/session` | Session cookie | `200 {data:{authenticated:true,user:{id,email,role},expiresAt}}` | `401`, `503` | Cookie required; no-store. |
| `POST /api/auth/logout` | `{}` and session cookie | `200 {data:{loggedOut:true}}`; revokes D1 session and expires cookie | `400`, `403`, `503` | Exact Origin and `Sec-Fetch-Site: same-origin`. |

Cookie: `__Host-ruang_ibu_session`, opaque random 256-bit value, `Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`. Only a SHA-256 digest is stored in D1. Session validity ends at the earlier of 30 minutes idle or 8 hours absolute. There are no password, public registration, password recovery, bearer-token, or login-bypass endpoints.

Identity and role are bound to the pre-provisioned `google_sub` and role in D1. A successful Google sign-in never creates an admin account. Owner/moderator provisioning is a private operator process; it requires independent verification of the Google subject and email. Google ID tokens remain in memory only long enough to POST to the same-origin verifier and are never stored in Web Storage, URL, D1, or audit events. Do not log request bodies.

## Public Q&A

| Method and route | Request | Success | Main errors | Access |
|---|---|---|---|---|
| `GET /api/questions/config` | none | `200 {data:{turnstileSiteKey}}` | `503 service_not_configured` | Returns only the public widget site key from `TURNSTILE_SITE_KEY`; no-store. The secret is never returned. |
| `GET /api/questions?articleSlug=...&limit=10&cursor=...` | Exact allowlisted article slug; limit 1-20 | `200 {data:{questions,nextCursor}}` with approved/answered rows and sanitized public fields only | `400 invalid_article/invalid_pagination`, `503 service_not_configured`, `500 request_failed` | Public; no email, original text, IP, moderator, or audit metadata. Historical pending, rejected, and hidden rows are omitted. Approved rows without an answer have `answer:null`. |
| `POST /api/questions` | `{articleSlug,displayName?,question,consentToPublicDisplay:true,turnstileToken}` | `201 {data:{id,status:"approved",message,question}}`; safe question receipt is immediately public and unanswered | `400` invalid/risky input, `403` Origin/Turnstile, `413`, `429`, `503`, `500` | Exact same-origin, server-side Turnstile, PII/link/spam checks, and HMAC rate limit. Unknown fields rejected. Response contains no email or private submission fields. |

Visitor limits: display name is optional; if supplied it must contain 2-50 characters. If omitted, the server stores neutral label `Ibu` to satisfy the existing D1 constraint. Question length is 10-1,000 characters; email is not accepted or collected by the public form; request max 8 KiB. Public consent is required. Only after Origin, input/risk, rate-limit, and server-side Turnstile checks pass does the backend insert the question directly with the existing `approved` status and public fields in one SQL statement. This status means “Belum dijawab” in the public UI; it does not mean a moderator approved the question. Personal contact/identity patterns, links, and obvious repeated spam receive a user-facing validation error and are not stored. Visitor text is rendered as text rather than HTML. The existing provisional initial `expires_at` remains 90 days from the earlier submission flow; writing an answer resets it to the existing 365-day answered default. Retention remains customer-unapproved, and no automatic purge runs.

Existing `pending`, `rejected`, and `hidden` records are preserved and are never silently exposed or rewritten. For a historical `pending` record, an administrator can publish it only by saving manually reviewed public name/text together with an answer in one D1 batch. Otherwise it remains private. No migration is required for this UX revision.

## Admin API

Every `/api/admin/*` request uses the D1 session middleware. Owner and moderator identities/roles are resolved server-side from the active user row. Both may read, hide, and answer. Only `owner` may delete a question or call retention purge. Missing D1 or `ADMIN_AUTH_HMAC_KEY` fails closed. Mutations require exact Origin and `Sec-Fetch-Site: same-origin`. All responses are no-store.

| Method and route | Request | Success | Notes |
|---|---|---|---|
| `GET /api/admin/summary` | none | Counts by status | D1-backed. |
| `GET /api/admin/questions?status=&articleSlug=&expiresBefore=&limit=20&cursor=` | allowlisted filters; limit 1-50 | Bounded page + cursor | Private fields are admin-only. `status=unanswered` maps to legacy `pending` plus public `approved` rows in the dashboard client. |
| `GET /api/admin/questions/:id` | none | Question and optional answer | 404 if absent. |
| `POST /api/admin/questions/:id/moderation` | `{action:"hide"}` for public questions; legacy transitions remain available to preserve existing records | New status | Hiding removes a question from public results. Dashboard has no separate approval requirement. |
| `PUT /api/admin/questions/:id/answer` | `{answer}` (10-2,000 characters); legacy `pending` additionally requires `{publicDisplayName,publicQuestionText}` | Answer and `answered` status | Current public questions can be answered or updated. A legacy pending row is published only with the reviewed public fields and answer in one D1 batch. |
| `DELETE /api/admin/questions/:id` | empty body | `{id,deleted:true}` | Owner only; confirmation is frontend behavior, authorization is server-side. |
| `POST /api/admin/retention/purge` | empty body or `{}` | `{deleted}` | Owner only, manual only; never schedule/execute until customer retention approval. |

Auth errors: `401 unauthorized`, `403 forbidden/origin_not_allowed`, `409` state conflict, `503 admin_auth_not_configured/admin_auth_unavailable`; responses contain no stack traces or secrets.

## Status transitions

| Current | Action | Next |
|---|---|---|
| new visitor submission | validated insert after Turnstile | approved (public, unanswered) |
| approved | write answer | answered |
| answered | update answer | answered |
| approved or answered | hide | hidden |
| pending (historical only) | answer with manually reviewed public fields | answered |
| pending (historical only) | hide | hidden |

The legacy moderation endpoint may still support explicit approve/reject transitions for compatibility, but the public submission flow and dashboard do not require or invoke a separate approval action. Audit events store actor, action, time and minimal metadata. They never store Google ID tokens, session tokens, HMAC keys, IPs or visitor email. Retention defaults remain customer-unapproved; purge must remain disabled operationally.
