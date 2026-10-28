import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { DatabaseSync } from 'node:sqlite'
import { test } from 'node:test'

const migrations = (name: string) => readFileSync(new URL(`../../migrations/${name}`, import.meta.url), 'utf8')

test('migration 0003 is additive and preserves synthetic M3/M4 questions, answers, sessions and audit data', () => {
  const db = new DatabaseSync(':memory:')
  try {
    db.exec(migrations('0001_questions.sql'))
    db.exec(migrations('0002_admin_auth.sql'))
    db.prepare(`INSERT INTO admin_users (id,email,google_sub,role,is_active,created_at,updated_at)
      VALUES ('owner-fixture','owner@example.test','owner-sub-fixture','owner',1,100,100)`).run()
    db.prepare(`INSERT INTO questions
      (id,article_slug,display_name,question_text,consent_at,moderation_status,public_display_name,public_question_text,created_at,updated_at,expires_at)
      VALUES ('question-fixture','nyeri-persalinan','Ibu','Pertanyaan sintetis yang aman.','200','answered','Ibu','Pertanyaan sintetis yang aman.','200','201','999999')`).run()
    db.prepare(`INSERT INTO answers (id,question_id,answer_text,answered_by,created_at,updated_at)
      VALUES ('answer-fixture','question-fixture','Jawaban edukatif sintetis.','owner-fixture','201','201')`).run()
    db.prepare(`INSERT INTO moderation_events (event_id,question_id,action,actor,created_at)
      VALUES ('moderation-fixture','question-fixture','answer','owner-fixture','201')`).run()
    db.prepare(`INSERT INTO admin_sessions (session_hash,admin_user_id,created_at,last_seen_at,absolute_expires_at)
      VALUES ('${'a'.repeat(64)}','owner-fixture',100,100,1000)`).run()
    db.prepare(`INSERT INTO admin_auth_events (event_id,admin_user_id,action,created_at)
      VALUES ('auth-fixture','owner-fixture','user_created',100)`).run()

    const before = readBaselineCounts(db)
    db.exec(migrations('0003_moderator_pre_authorization.sql'))
    const after = readBaselineCounts(db)
    assert.deepEqual(after, before)
    assert.equal(db.prepare("SELECT moderation_status FROM questions WHERE id='question-fixture'").get().moderation_status, 'answered')
    assert.equal(db.prepare("SELECT question_id FROM answers WHERE id='answer-fixture'").get().question_id, 'question-fixture')
    assert.equal(db.prepare("SELECT revoked_at FROM admin_sessions WHERE session_hash=?").get('a'.repeat(64)).revoked_at, null)

    // Existing code only addresses these old tables; new auth-preauthorization tables start empty.
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM admin_moderator_pre_authorizations').get().count, 0)
    assert.equal(db.prepare('SELECT COUNT(*) AS count FROM admin_moderator_pre_authorization_events').get().count, 0)
    db.exec(migrations('0003_moderator_pre_authorization.sql'))
    assert.deepEqual(readBaselineCounts(db), before)
  } finally { db.close() }
})

function readBaselineCounts(db: DatabaseSync) {
  const count = (table: string) => Number((db.prepare(`SELECT COUNT(*) AS count FROM ${table}`).get() as { count: number }).count)
  return {
    adminUsers: count('admin_users'),
    sessions: count('admin_sessions'),
    questions: count('questions'),
    answers: count('answers'),
    moderationEvents: count('moderation_events'),
    authEvents: count('admin_auth_events'),
  }
}
