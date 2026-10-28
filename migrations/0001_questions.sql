PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY NOT NULL,
  article_slug TEXT NOT NULL CHECK (article_slug IN (
    'nyeri-punggung-kehamilan', 'terapi-musik', 'teknik-pernapasan',
    'kompres-hangat-kehamilan', 'pijat-kehamilan', 'kecemasan-menjelang-persalinan',
    'nyeri-persalinan', 'kompres-hangat-persalinan', 'kecemasan-persalinan',
    'pijat-pendamping', 'relaksasi-otot-ringan'
  )),
  display_name TEXT NOT NULL CHECK (length(display_name) BETWEEN 2 AND 50),
  question_text TEXT NOT NULL CHECK (length(question_text) BETWEEN 10 AND 1000),
  optional_email TEXT CHECK (optional_email IS NULL OR length(optional_email) <= 254),
  consent_at TEXT NOT NULL,
  moderation_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (moderation_status IN ('pending', 'approved', 'answered', 'rejected', 'hidden')),
  public_display_name TEXT,
  public_question_text TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  moderated_at TEXT,
  moderated_by TEXT,
  expires_at TEXT NOT NULL,
  purge_batch_id TEXT,
  last_moderation_event_id TEXT,
  CHECK (
    moderation_status NOT IN ('approved', 'answered')
    OR (
      public_display_name IS NOT NULL
      AND length(public_display_name) BETWEEN 2 AND 50
      AND public_question_text IS NOT NULL
      AND length(public_question_text) BETWEEN 10 AND 1000
    )
  )
);

CREATE TABLE IF NOT EXISTS answers (
  id TEXT PRIMARY KEY NOT NULL,
  question_id TEXT NOT NULL UNIQUE REFERENCES questions(id) ON DELETE CASCADE,
  answer_text TEXT NOT NULL CHECK (length(answer_text) BETWEEN 10 AND 2000),
  answered_by TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS moderation_events (
  event_id TEXT PRIMARY KEY NOT NULL,
  question_id TEXT REFERENCES questions(id) ON DELETE SET NULL,
  action TEXT NOT NULL CHECK (action IN (
    'approve', 'reject', 'hide', 'answer', 'edit_answer', 'delete', 'retention_purge'
  )),
  actor TEXT NOT NULL,
  created_at TEXT NOT NULL,
  metadata_json TEXT NOT NULL DEFAULT '{}' CHECK (json_valid(metadata_json))
);

CREATE TABLE IF NOT EXISTS question_rate_limits (
  key_hash TEXT PRIMARY KEY NOT NULL CHECK (length(key_hash) = 64),
  window_start INTEGER NOT NULL,
  request_count INTEGER NOT NULL CHECK (request_count >= 1),
  expires_at INTEGER NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_questions_article_status_created
  ON questions(article_slug, moderation_status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_questions_status_created
  ON questions(moderation_status, created_at DESC, id DESC);
CREATE INDEX IF NOT EXISTS idx_questions_expires_at
  ON questions(expires_at);
CREATE INDEX IF NOT EXISTS idx_moderation_events_question_created
  ON moderation_events(question_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_question_rate_limits_expires_at
  ON question_rate_limits(expires_at);
