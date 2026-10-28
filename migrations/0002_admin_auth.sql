-- M4.6C Google OIDC identity and D1-backed sessions.
-- This migration has not been applied remotely; 0001_questions.sql is unchanged.
CREATE TABLE IF NOT EXISTS admin_users (
  id TEXT PRIMARY KEY NOT NULL,
  email TEXT NOT NULL COLLATE NOCASE UNIQUE
    CHECK (length(email) BETWEEN 3 AND 254),
  google_sub TEXT NOT NULL UNIQUE
    CHECK (length(google_sub) BETWEEN 1 AND 255),
  role TEXT NOT NULL CHECK (role IN ('owner', 'moderator')),
  is_active INTEGER NOT NULL DEFAULT 1 CHECK (is_active IN (0, 1)),
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  last_login_at INTEGER,
  created_by TEXT REFERENCES admin_users(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_users_active_role
  ON admin_users(is_active, role, created_at);

CREATE TABLE IF NOT EXISTS admin_sessions (
  session_hash TEXT PRIMARY KEY NOT NULL CHECK (length(session_hash) = 64),
  admin_user_id TEXT NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
  created_at INTEGER NOT NULL,
  last_seen_at INTEGER NOT NULL,
  absolute_expires_at INTEGER NOT NULL,
  revoked_at INTEGER,
  CHECK (last_seen_at >= created_at),
  CHECK (absolute_expires_at > created_at)
);

CREATE INDEX IF NOT EXISTS idx_admin_sessions_user_active
  ON admin_sessions(admin_user_id, revoked_at, absolute_expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_sessions_expiry
  ON admin_sessions(absolute_expires_at, revoked_at);

CREATE TABLE IF NOT EXISTS admin_login_throttles (
  bucket_hash TEXT PRIMARY KEY NOT NULL CHECK (length(bucket_hash) = 64),
  scope TEXT NOT NULL CHECK (scope IN ('challenge', 'login')),
  window_started_at INTEGER NOT NULL,
  failure_count INTEGER NOT NULL CHECK (failure_count >= 1),
  blocked_until INTEGER,
  expires_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_admin_login_throttles_expiry
  ON admin_login_throttles(expires_at);

CREATE TABLE IF NOT EXISTS admin_login_nonces (
  nonce_hash TEXT PRIMARY KEY NOT NULL CHECK (length(nonce_hash) = 64),
  created_at INTEGER NOT NULL,
  expires_at INTEGER NOT NULL,
  consumed_at INTEGER,
  CHECK (expires_at > created_at),
  CHECK (consumed_at IS NULL OR consumed_at >= created_at)
);

CREATE INDEX IF NOT EXISTS idx_admin_login_nonces_expiry
  ON admin_login_nonces(expires_at, consumed_at);

CREATE TABLE IF NOT EXISTS admin_auth_events (
  event_id TEXT PRIMARY KEY NOT NULL,
  admin_user_id TEXT REFERENCES admin_users(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN (
    'google_login_success', 'google_login_failure', 'logout', 'session_revoked', 'user_disabled', 'user_created'
  )),
  created_at INTEGER NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata_json))
);

CREATE INDEX IF NOT EXISTS idx_admin_auth_events_user_created
  ON admin_auth_events(admin_user_id, created_at DESC, event_id DESC);
CREATE INDEX IF NOT EXISTS idx_admin_auth_events_created
  ON admin_auth_events(created_at DESC, event_id DESC);
