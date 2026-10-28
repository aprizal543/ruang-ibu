const OWNER_CONFIRMATION = 'CREATE FIRST PRODUCTION OWNER'
export const PRODUCTION_D1_TARGET = Object.freeze({
  accountId: '32a9a8d36173f8af3e9f404956e7b7d7',
  databaseName: 'ruang-ibu-production',
  databaseId: '2b9c3de9-eafb-4842-a613-27eab7ae7174',
})

export function assertProductionD1Target(target) {
  if (target?.accountId !== PRODUCTION_D1_TARGET.accountId
    || target?.databaseName !== PRODUCTION_D1_TARGET.databaseName
    || target?.databaseId !== PRODUCTION_D1_TARGET.databaseId) {
    throw new Error('Production D1 target mismatch. No database operation is allowed.')
  }
  return true
}

export async function verifyProductionOwnerIdentity({
  credential,
  nonce,
  clientId,
  expectedEmail,
  verifyCredential,
  now = () => Date.now(),
}) {
  const normalizeEmail = (email) => typeof email === 'string' ? email.trim().toLowerCase() : ''
  const confirmedEmail = normalizeEmail(expectedEmail)
  if (typeof credential !== 'string' || credential.length === 0 || credential.length > 10_000
    || typeof nonce !== 'string' || !/^[A-Za-z0-9_-]{43}$/u.test(nonce)
    || typeof clientId !== 'string' || !clientId.endsWith('.apps.googleusercontent.com')
    || !/^[^\s@]+@gmail\.com$/u.test(confirmedEmail)
    || typeof verifyCredential !== 'function') {
    throw new Error('Owner identity verification failed.')
  }

  try {
    const claims = await verifyCredential(credential, nonce, clientId)
    if (!claims || typeof claims !== 'object') throw new Error('claims missing')
    const audienceMatches = claims.aud === clientId
      || (Array.isArray(claims.aud) && claims.aud.includes(clientId))
    const issuedAt = now() / 1000
    if (!['https://accounts.google.com', 'accounts.google.com'].includes(claims.iss)
      || !audienceMatches
      || (claims.azp !== undefined && claims.azp !== clientId)
      || (Array.isArray(claims.aud) && claims.aud.length > 1 && claims.azp !== clientId)
      || typeof claims.exp !== 'number' || claims.exp <= issuedAt
      || typeof claims.iat !== 'number' || claims.iat > issuedAt + 5 || claims.iat < issuedAt - 300
      || claims.nonce !== nonce
      || claims.email_verified !== true
      || !/^[A-Za-z0-9_-]{1,255}$/u.test(claims.sub ?? '')
      || !/^[^\s@]+@gmail\.com$/u.test(normalizeEmail(claims.email))
      || normalizeEmail(claims.email) !== confirmedEmail) {
      throw new Error('claims mismatch')
    }
    return { email: normalizeEmail(claims.email), googleSub: claims.sub }
  } catch {
    throw new Error('Owner identity verification failed.')
  }
}

export async function inspectFirstProductionOwner(db) {
  const counts = await db.prepare(`
    SELECT COUNT(*) AS admin_count,
      SUM(CASE WHEN role = 'owner' THEN 1 ELSE 0 END) AS owner_count,
      SUM(CASE WHEN role = 'moderator' THEN 1 ELSE 0 END) AS moderator_count,
      (SELECT COUNT(*) FROM admin_auth_events e WHERE e.action = 'user_created'
      ) AS user_created_event_count,
      (SELECT COUNT(*) FROM admin_auth_events e
        JOIN admin_users u ON u.id = e.admin_user_id
        WHERE e.action = 'user_created' AND u.role = 'owner' AND u.is_active = 1
      ) AS owner_creation_event_count
    FROM admin_users
  `).bind().first()
  if (!counts || !Number.isSafeInteger(counts.admin_count)
    || (counts.owner_count !== null && !Number.isSafeInteger(counts.owner_count))
    || (counts.moderator_count !== null && !Number.isSafeInteger(counts.moderator_count))
    || !Number.isSafeInteger(counts.user_created_event_count)
    || !Number.isSafeInteger(counts.owner_creation_event_count)) {
    throw new Error('Owner bootstrap preflight failed closed.')
  }
  const adminCount = counts.admin_count
  const ownerCount = counts.owner_count ?? 0
  const moderatorCount = counts.moderator_count ?? 0
  return {
    adminCount,
    ownerCount,
    moderatorCount,
    userCreatedEventCount: counts.user_created_event_count,
    ownerCreationEventCount: counts.owner_creation_event_count,
    canCreateFirstOwner: adminCount === 0 && ownerCount === 0 && moderatorCount === 0
      && counts.user_created_event_count === 0,
  }
}

function validateInput(input) {
  return input
    && input.confirmation === OWNER_CONFIRMATION
    && typeof input.email === 'string'
    && input.email.length <= 254
    && /^[^\s@]+@[^\s@]+\.[^\s@]+$/u.test(input.email)
    && typeof input.googleSub === 'string'
    && input.googleSub.length <= 255
    && /^[A-Za-z0-9_-]+$/u.test(input.googleSub)
}

/**
 * Transactional core for first-owner provisioning. The caller must supply a
 * Google `sub` already verified against the explicitly approved OAuth audience
 * through a separately reviewed private operator flow. M6.4 uses the QA
 * audience for its loopback verifier because Production does not authorize
 * localhost; this proves account control through that QA client only. This module has no CLI or
 * remote side effects and never returns/logs the supplied identity.
 */
export async function provisionFirstProductionOwner(db, input, {
  idFactory = () => crypto.randomUUID(),
  now = () => Date.now(),
} = {}) {
  if (!validateInput(input)) throw new Error('invalid provisioning input')

  const state = await inspectFirstProductionOwner(db)
  if (!state.canCreateFirstOwner) {
    throw new Error('admin database is not empty')
  }

  const adminId = idFactory()
  const eventId = idFactory()
  const timestamp = now()
  const metadata = JSON.stringify({ role: 'owner', source: 'private_bootstrap' })
  const createUser = db.prepare(`
    INSERT INTO admin_users (
      id, email, google_sub, role, is_active, created_at, updated_at, created_by
    )
    SELECT ?, ?, ?, 'owner', 1, ?, ?, NULL
    WHERE NOT EXISTS (SELECT 1 FROM admin_users)
  `).bind(adminId, input.email.trim(), input.googleSub, timestamp, timestamp)
  const auditEvent = db.prepare(`
    INSERT INTO admin_auth_events (event_id, admin_user_id, action, created_at, metadata_json)
    SELECT ?, id, 'user_created', ?, ?
    FROM admin_users
    WHERE id = ? AND role = 'owner' AND is_active = 1
  `).bind(eventId, timestamp, metadata, adminId)

  let results
  try {
    results = await db.batch([createUser, auditEvent])
  } catch {
    throw new Error('Provisioning stopped safely. Reconcile database state with read-only checks before any retry.')
  }

  if (results?.length !== 2 || results[0]?.meta?.changes !== 1 || results[1]?.meta?.changes !== 1) {
    throw new Error('Provisioning outcome requires read-only reconciliation. Do not retry automatically.')
  }

  return { created: true }
}
