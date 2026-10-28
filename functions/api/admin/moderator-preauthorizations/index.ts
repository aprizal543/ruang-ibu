import { DAY_MS, adminContextError, databaseError, isApiResponse, readAdminBody } from '../../../_shared/admin'
import { apiError, jsonResponse } from '../../../_shared/http'
import type { AdminIdentity, PagesContext } from '../../../_shared/types'

const GMAIL_PATTERN = /^[^\s@]+@gmail\.com$/iu
const PREAUTHORIZATION_TTL_MS = 30 * DAY_MS

function ownerError(context: PagesContext): Response | undefined {
  const error = adminContextError(context)
  if (error) return error
  return (context.data.admin as AdminIdentity).role === 'owner'
    ? undefined
    : apiError(403, 'owner_required', 'Hanya pemilik Ruang Ibu yang dapat mengatur akses Moderator.')
}

export async function onRequestGet(context: PagesContext): Promise<Response> {
  const authError = ownerError(context) ?? databaseError(context)
  if (authError) return authError
  try {
    const now = Date.now()
    const result = await context.env.DB!.prepare(`SELECT id, email, role,
        CASE WHEN status = 'active' AND expires_at <= ? THEN 'expired' ELSE status END AS status,
        created_at AS createdAt, expires_at AS expiresAt, consumed_at AS consumedAt
      FROM admin_moderator_pre_authorizations
      ORDER BY created_at DESC, id DESC LIMIT 50`).bind(now).all<Record<string, unknown>>()
    return jsonResponse({ data: { authorizations: result.results ?? [] } })
  } catch {
    return apiError(503, 'preauthorization_unavailable', 'Praotorisasi Moderator belum dapat dimuat.')
  }
}

export async function onRequestPost(context: PagesContext): Promise<Response> {
  const authError = ownerError(context) ?? databaseError(context)
  if (authError) return authError
  const body = await readAdminBody(context)
  if (isApiResponse(body)) return body
  if (Object.keys(body).length !== 1 || typeof body.email !== 'string') {
    return apiError(400, 'invalid_preauthorization', 'Masukkan hanya alamat Gmail untuk akses Moderator.')
  }
  const email = body.email.trim().toLowerCase()
  if (email.length > 254 || !GMAIL_PATTERN.test(email)) {
    return apiError(400, 'invalid_gmail', 'Gunakan alamat Gmail yang valid.')
  }

  const owner = context.data.admin as AdminIdentity
  const now = Date.now()
  const expiresAt = now + PREAUTHORIZATION_TTL_MS
  const authorizationId = crypto.randomUUID()
  const createdEventId = crypto.randomUUID()
  try {
    const existingUser = await context.env.DB!.prepare('SELECT id FROM admin_users WHERE email = ? COLLATE NOCASE LIMIT 1')
      .bind(email).first<{ id: string }>()
    const activeAuthorization = await context.env.DB!.prepare(`SELECT id FROM admin_moderator_pre_authorizations
      WHERE email = ? COLLATE NOCASE AND status = 'active' AND expires_at > ? LIMIT 1`)
      .bind(email, now).first<{ id: string }>()
    if (existingUser || activeAuthorization) return apiError(409, 'access_already_exists', 'Alamat ini sudah memiliki akun atau praotorisasi aktif.')

    const results = await context.env.DB!.batch([
      context.env.DB!.prepare(`UPDATE admin_moderator_pre_authorizations SET status = 'expired'
        WHERE email = ? COLLATE NOCASE AND status = 'active' AND expires_at <= ?
          AND NOT EXISTS (SELECT 1 FROM admin_users WHERE email = ? COLLATE NOCASE)`)
        .bind(email, now, email),
      context.env.DB!.prepare(`INSERT INTO admin_moderator_pre_authorizations
        (id, email, role, status, created_by, created_at, expires_at)
        SELECT ?, lower(?), 'moderator', 'active', owner.id, ?, ?
        FROM admin_users owner
        WHERE owner.id = ? AND owner.role = 'owner' AND owner.is_active = 1
          AND NOT EXISTS (SELECT 1 FROM admin_users u WHERE u.email = lower(?) COLLATE NOCASE)
          AND NOT EXISTS (SELECT 1 FROM admin_moderator_pre_authorizations p
            WHERE p.email = lower(?) COLLATE NOCASE AND p.status = 'active' AND p.expires_at > ?)`)
        .bind(authorizationId, email, now, expiresAt, owner.id, email, email, now),
      context.env.DB!.prepare(`INSERT INTO admin_moderator_pre_authorization_events
        (event_id, authorization_id, actor_admin_user_id, action, created_at, metadata_json)
        SELECT ?, id, created_by, 'created', ?, json_object('role', 'moderator', 'expiresAt', expires_at)
        FROM admin_moderator_pre_authorizations WHERE id = ? AND status = 'active'`)
        .bind(createdEventId, now, authorizationId),
    ])
    if (results[1]?.meta.changes !== 1 || results[2]?.meta.changes !== 1) {
      return apiError(409, 'preauthorization_conflict', 'Praotorisasi tidak dibuat. Periksa kembali akses akun ini.')
    }
    return jsonResponse({ data: { id: authorizationId, email, role: 'moderator', status: 'active', expiresAt } }, 201)
  } catch {
    try {
      const conflict = await context.env.DB!.prepare(`SELECT 1 AS found FROM admin_users WHERE email = ? COLLATE NOCASE
        UNION ALL SELECT 1 FROM admin_moderator_pre_authorizations WHERE email = ? COLLATE NOCASE AND status = 'active' AND expires_at > ? LIMIT 1`)
        .bind(email, email, now).first<{ found: number }>()
      if (conflict) return apiError(409, 'preauthorization_conflict', 'Praotorisasi tidak dibuat. Periksa kembali akses akun ini.')
    } catch { /* Return a generic service error if the conflict check also fails. */ }
    return apiError(503, 'preauthorization_unavailable', 'Praotorisasi Moderator belum dapat disimpan.')
  }
}
