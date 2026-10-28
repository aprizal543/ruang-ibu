-- M6.5: owner-controlled, one-time Google email preauthorization for a Moderator.
-- Apply only after a separate environment-specific review; never edit 0001/0002.
CREATE TABLE IF NOT EXISTS admin_moderator_pre_authorizations (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE CHECK (length(email) BETWEEN 6 AND 254),
  role TEXT NOT NULL DEFAULT 'moderator' CHECK (role = 'moderator'),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'consumed', 'revoked', 'expired')),
  created_by TEXT NOT NULL REFERENCES admin_users(id) ON DELETE RESTRICT,
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  activated_admin_user_id TEXT UNIQUE REFERENCES admin_users(id) ON DELETE RESTRICT,
  CHECK (expires_at > created_at),
  CHECK (
    (status = 'consumed' AND consumed_at IS NOT NULL AND activated_admin_user_id IS NOT NULL)
    OR (status <> 'consumed' AND consumed_at IS NULL AND activated_admin_user_id IS NULL)
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_admin_moderator_preauthorizations_active_email
  ON admin_moderator_pre_authorizations(email COLLATE NOCASE)
  WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_admin_moderator_preauthorizations_expiry
  ON admin_moderator_pre_authorizations(status, expires_at, created_at DESC);

CREATE TABLE IF NOT EXISTS admin_moderator_pre_authorization_events (
  event_id TEXT PRIMARY KEY NOT NULL,
  authorization_id TEXT NOT NULL REFERENCES admin_moderator_pre_authorizations(id) ON DELETE RESTRICT,
  actor_admin_user_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN ('created', 'revoked', 'activated')),
  created_at INTEGER NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata_json))
);

CREATE INDEX IF NOT EXISTS idx_admin_moderator_preauthorization_events_authorization
  ON admin_moderator_pre_authorization_events(authorization_id, created_at DESC, event_id DESC);
