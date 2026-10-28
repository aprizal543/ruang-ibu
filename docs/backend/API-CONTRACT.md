# API Contract — Q&A and Google OIDC Admin Authentication

Base path: same-origin `/api`. JSON uses `{ data: ... }` or `{ error: { code, message } }`. Admin, auth, and error responses are `Cache-Control: no-store`. Session credentials are never returned in JSON.

The Google OIDC routes below describe the local M4.6C implementation only. They have not been configured or tested against a Google Web Client or Cloudflare Preview deployment.

## Admin authentication

| Method and route | Request | Success | Main errors | Access |
|---|---|---|---|---|
| `POST /api/auth/google/challenge` | `{}`; max 1 KiB | `200 {data:{clientId,nonce,expiresAt}}` | `400 invalid_json/invalid_challenge_request`, `403 origin_not_allowed`, `429 login_limited`, `413 payload_too_large`, `503 auth_not_configured/auth_unavailable` | Exact `Origin`, `Sec-Fetch-Site: same-origin`; nonce is random, short-lived and persisted only as a digest. `clientId` is public configuration. |
| `POST /api/auth/google` | `{credential,nonce}`; exact keys, max 12 KiB | `200 {data:{authenticated:true,user:{id,email,role},expiresAt}}` plus session cookie | `400`, generic `401 google_login_denied`, `403 origin_not_allowed`, `413`, `429 login_limited`, `503 auth_not_configured/auth_unavailable` | Exact Origin and Fetch Metadata. Google JWT signature/JWKS, RS256, issuer, audience, expiry, age, nonce and `email_verified` are verified server-side. Only an active, privately provisioned `google_sub` match can create a session. |
| `GET /api/auth/session` | Session cookie | `200 {data:{authenticated:true,user:{id,email,role},expiresAt}}` | `401 unauthorized`, `503 auth_not_configured/auth_unavailable` | Cookie required; no-store. |
| `POST /api/auth/logout` | `{}` and session cookie | `200 {data:{loggedOut:true}}`; revokes D1 session and expires cookie | `400`, `403 origin_not_allowed`, `503 auth_unavailable` | Exact Origin and `Sec-Fetch-Site: same-origin`. |

Cookie: `__Host-ruang_ibu_session`, opaque random 256-bit value, `Secure; HttpOnly; SameSite=Strict; Path=/; Max-Age=28800`. Only a SHA-256 digest is stored in D1. Session validity ends at the earlier of 30 minutes idle or 8 hours absolute. There are no password, public registration, password recovery, bearer-token, or login-bypass endpoints.

Identity and role are bound to the pre-provisioned `google_sub` and role in D1. A successful Google sign-in never creates an admin account. Owner/moderator provisioning is a private operator process; it requires independent verification of the Google subject and email. Google ID tokens remain in memory only long enough to POST to the same-origin verifier and are never stored in Web Storage, URL, D1, or audit events. Do not log request bodies.

## Public Q&A

| Method and route | Request | Success | Main errors | Access |
|---|---|---|---|---|
| `GET /api/questions?articleSlug=...&limit=10&cursor=...` | Exact allowlisted article slug; limit 1–20 | `200 {data:{questions,nextCursor}}` with approved/answered rows and sanitized public fields only | `400 invalid_article/invalid_pagination`, `503 service_not_configured`, `500 request_failed` | Public; no email, original text, IP, moderator, or audit metadata. |
| `POST /api/questions` | `{articleSlug,displayName,question,email?,consentToPublicModeration,turnstileToken}` | `201 {data:{id,status:"pending",message}}` | `400`, `403`, `413`, `429`, `503`, `500` | Exact same-origin, server-side Turnstile, validation, HMAC rate limit. Unknown fields rejected. |

Visitor limits: display name 2–50 characters; question 10–1,000; optional email max 254 and validated; request max 8 KiB. New questions are always pending. The M5 public submission UI is not implemented. Proposed consent copy remains for future review; it is not an active form.

## Admin API

Every `/api/admin/*` request uses the D1 session middleware. Owner and moderator identities/roles are resolved server-side from the active user row. Both may read, moderate, and answer. Only `owner` may delete a question or call retention purge. Missing D1 or `ADMIN_AUTH_HMAC_KEY` fails closed. Mutations require exact Origin and `Sec-Fetch-Site: same-origin`. All responses are no-store.

| Method and route | Request | Success | Notes |
|---|---|---|---|
| `GET /api/admin/summary` | none | Counts by status | D1-backed. |
| `GET /api/admin/questions?status=&articleSlug=&expiresBefore=&limit=20&cursor=` | allowlisted filters; limit 1–50 | Bounded page + cursor | Private fields are admin-only. |
| `GET /api/admin/questions/:id` | none | Question and optional answer | 404 if absent. |
| `POST /api/admin/questions/:id/moderation` | approve with public fields, or reject/hide action | New status | Enforces transitions; approve stores moderator-edited public fields only. |
| `PUT /api/admin/questions/:id/answer` | `{answer}` (10–2,000 characters) | Answer and answered status | Single official answer row; update in place. |
| `DELETE /api/admin/questions/:id` | empty body | `{id,deleted:true}` | Owner only; confirmation is frontend behavior, authorization is server-side. |
| `POST /api/admin/retention/purge` | empty body or `{}` | `{deleted}` | Owner only, manual only; never schedule/execute until customer retention approval. |

Auth errors: `401 unauthorized`, `403 forbidden/origin_not_allowed`, `409` state conflict, `503 admin_auth_not_configured/admin_auth_unavailable`; responses contain no stack traces or secrets.

## Status transitions

| Current | Action | Next |
|---|---|---|
| pending | approve with moderator-edited public name/question | approved |
| pending | reject | rejected |
| approved or answered | hide | hidden |
| approved | write answer | answered |
| answered | update answer | answered |

Audit events store actor, action, time and minimal metadata. They never store Google ID tokens, session tokens, HMAC keys, IPs or visitor email. Retention defaults remain customer-unapproved; purge must remain disabled operationally.
