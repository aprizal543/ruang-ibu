import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { DatabaseSync } from 'node:sqlite'

const migration = readFileSync(new URL('../../migrations/0001_questions.sql', import.meta.url), 'utf8')

test('D1 migration is idempotent and defines constraints and required indexes', () => {
  const database = new DatabaseSync(':memory:')
  database.exec(migration)
  database.exec(migration)
  const tables = database.prepare("SELECT name FROM sqlite_master WHERE type = 'table'").all().map((row: any) => row.name)
  assert.ok(tables.includes('questions'))
  assert.ok(tables.includes('answers'))
  assert.ok(tables.includes('moderation_events'))
  assert.ok(tables.includes('question_rate_limits'))
  const indexes = database.prepare("SELECT name FROM sqlite_master WHERE type = 'index'").all().map((row: any) => row.name)
  for (const name of ['idx_questions_article_status_created', 'idx_questions_status_created', 'idx_questions_expires_at', 'idx_moderation_events_question_created']) assert.ok(indexes.includes(name), `${name} exists`)

  assert.throws(() => database.prepare(`INSERT INTO questions
    (id, article_slug, display_name, question_text, consent_at, moderation_status, created_at, updated_at, expires_at)
    VALUES ('bad', 'unknown', 'Nama', 'pertanyaan cukup panjang', 'now', 'pending', 'now', 'now', 'later')`).run())
  database.close()
})

test('answer foreign key and one-answer constraint are enforced', () => {
  const database = new DatabaseSync(':memory:')
  database.exec(migration)
  assert.throws(() => database.prepare(`INSERT INTO answers (id, question_id, answer_text, answered_by, created_at, updated_at)
    VALUES ('orphan', 'missing', 'Jawaban cukup panjang untuk validasi', 'admin', 'now', 'now')`).run())
  database.prepare(`INSERT INTO questions (id, article_slug, display_name, question_text, consent_at, moderation_status,
    public_display_name, public_question_text, created_at, updated_at, expires_at)
    VALUES ('q1', 'nyeri-punggung-kehamilan', 'Nama', 'Pertanyaan yang cukup panjang', 'now', 'approved', 'Publik', 'Pertanyaan publik yang disunting moderator', 'now', 'now', 'later')`).run()
  database.prepare(`INSERT INTO answers (id, question_id, answer_text, answered_by, created_at, updated_at)
    VALUES ('a1', 'q1', 'Jawaban cukup panjang untuk validasi', 'admin', 'now', 'now')`).run()
  assert.throws(() => database.prepare(`INSERT INTO answers (id, question_id, answer_text, answered_by, created_at, updated_at)
    VALUES ('a2', 'q1', 'Jawaban lain cukup panjang untuk validasi', 'admin', 'now', 'now')`).run())
  database.close()
})
