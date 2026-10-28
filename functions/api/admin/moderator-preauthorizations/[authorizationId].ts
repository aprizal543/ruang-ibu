import { adminContextError, databaseError } from '../../../_shared/admin'
import { apiError, jsonResponse } from '../../../_shared/http'
import type { AdminIdentity, PagesContext } from '../../../_shared/types'

export async function onRequestDelete(context: PagesContext): Promise<Response> {
  const authError = adminContextError(context) ?? databaseError(context)
  if (authError) return authError
  if ((context.data.admin as AdminIdentity).role !== 'owner') {
    return apiError(403, 'owner_required', 'Hanya pemilik Ruang Ibu yang dapat mengatur akses Moderator.')
  }
  const id = context.params.authorizationId
  if (typeof id !== 'string' || !/^[A-Za-z0-9_-]{1,80}$/u.test(id)) return apiError(400, 'invalid_preauthorization_id', 'Praotorisasi tidak valid.')
  const now = Date.now()
  const eventId = crypto.randomUUID()
  const actor = (context.data.admin as AdminIdentity).id
  try {
    const results = await context.env.DB!.batch([
      context.env.DB!.prepare(`UPDATE admin_moderator_pre_authorizations
        SET status = 'revoked' WHERE id = ? AND status = 'active'`)
        .bind(id),
      context.env.DB!.prepare(`INSERT INTO admin_moderator_pre_authorization_events
        (event_id, authorization_id, actor_admin_user_id, action, created_at, metadata_json)
        SELECT ?, id, ?, 'revoked', ?, '{}' FROM admin_moderator_pre_authorizations
        WHERE id = ? AND status = 'revoked'`)
        .bind(eventId, actor, now, id),
    ])
    if (results[0]?.meta.changes !== 1 || results[1]?.meta.changes !== 1) {
      return apiError(409, 'preauthorization_not_active', 'Praotorisasi ini tidak lagi aktif.')
    }
    return jsonResponse({ data: { id, status: 'revoked' } })
  } catch {
    return apiError(503, 'preauthorization_unavailable', 'Praotorisasi Moderator belum dapat diperbarui.')
  }
}
