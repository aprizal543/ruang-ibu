import type { AdminIdentity, D1Database } from '../../_shared/types'

const GMAIL_PATTERN = /^[^\s@]+@gmail\.com$/iu

/**
 * Activate a Moderator only from an unexpired owner-created email authorization.
 * The verified Google email and immutable subject must be passed by the OIDC handler
 * after signature, audience, issuer, expiry, nonce and email_verified checks.
 */
export async function activatePreauthorizedModerator(
  db: D1Database,
  verifiedEmail: string,
  verifiedGoogleSub: string,
  now = Date.now(),
  idFactory: () => string = () => crypto.randomUUID(),
): Promise<AdminIdentity | null> {
  const email = typeof verifiedEmail === 'string' ? verifiedEmail.trim().toLowerCase() : ''
  if (!GMAIL_PATTERN.test(email) || email.length > 254
    || typeof verifiedGoogleSub !== 'string' || !/^[A-Za-z0-9_-]{1,255}$/u.test(verifiedGoogleSub)) return null

  const userId = idFactory()
  const authEventId = idFactory()
  const preauthorizationEventId = idFactory()
  const results = await db.batch([
    db.prepare(`INSERT INTO admin_users (id, email, google_sub, role, is_active, created_at, updated_at, created_by)
      SELECT ?, p.email, ?, 'moderator', 1, ?, ?, p.created_by
      FROM admin_moderator_pre_authorizations p
      WHERE p.email = ? COLLATE NOCASE AND p.role = 'moderator'
        AND p.status = 'active' AND p.expires_at > ?
        AND NOT EXISTS (
          SELECT 1 FROM admin_users u
          WHERE u.email = p.email COLLATE NOCASE OR u.google_sub = ?
        )`)
      .bind(userId, verifiedGoogleSub, now, now, email, now, verifiedGoogleSub),
    db.prepare(`UPDATE admin_moderator_pre_authorizations
      SET status = 'consumed', consumed_at = ?, activated_admin_user_id = ?
      WHERE email = ? COLLATE NOCASE AND role = 'moderator' AND status = 'active' AND expires_at > ?
        AND EXISTS (
          SELECT 1 FROM admin_users u WHERE u.id = ? AND u.email = admin_moderator_pre_authorizations.email COLLATE NOCASE
            AND u.google_sub = ? AND u.role = 'moderator' AND u.is_active = 1
        )`)
      .bind(now, userId, email, now, userId, verifiedGoogleSub),
    db.prepare(`INSERT INTO admin_auth_events (event_id, admin_user_id, action, created_at, metadata_json)
      SELECT ?, u.id, 'user_created', ?, json_object('role', 'moderator', 'activation', 'owner_pre_authorized_google_login')
      FROM admin_users u JOIN admin_moderator_pre_authorizations p ON p.activated_admin_user_id = u.id
      WHERE u.id = ? AND u.google_sub = ? AND p.status = 'consumed'`)
      .bind(authEventId, now, userId, verifiedGoogleSub),
    db.prepare(`INSERT INTO admin_moderator_pre_authorization_events
      (event_id, authorization_id, actor_admin_user_id, action, created_at, metadata_json)
      SELECT ?, p.id, p.created_by, 'activated', ?, json_object('role', 'moderator')
      FROM admin_moderator_pre_authorizations p
      JOIN admin_users u ON u.id = p.activated_admin_user_id
      WHERE p.activated_admin_user_id = ? AND p.status = 'consumed' AND u.google_sub = ?`)
      .bind(preauthorizationEventId, now, userId, verifiedGoogleSub),
  ])

  const changes = results.map((result) => result.meta.changes)
  if (changes.every((count) => count === 0)) return null
  if (!changes.every((count) => count === 1)) throw new Error('Moderator activation transaction did not complete consistently.')

  const user = await db.prepare(`SELECT id, email, role FROM admin_users
    WHERE id = ? AND google_sub = ? AND role = 'moderator' AND is_active = 1`)
    .bind(userId, verifiedGoogleSub).first<AdminIdentity>()
  if (!user) throw new Error('Activated Moderator could not be read back.')
  return user
}
