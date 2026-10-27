import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SqliteD1Database } from './sqlite-d1.ts'

const summaryModule = await import('../../functions/api/admin/summary.ts').catch(() => null)
const listModule = await import('../../functions/api/admin/questions/index.ts').catch(() => null)
const publicModule = await import('../../functions/api/questions/index.ts').catch(() => null)
const detailModule = await import('../../functions/api/admin/questions/[questionId].ts').catch(() => null)
const moderationModule = await import('../../functions/api/admin/questions/[questionId]/moderation.ts').catch(() => null)
const answerModule = await import('../../functions/api/admin/questions/[questionId]/answer.ts').catch(() => null)
const purgeModule = await import('../../functions/api/admin/retention/purge.ts').catch(() => null)

function adminContext(database: SqliteD1Database, path: string, method = 'GET', body?: unknown, questionId?: string) {
  return {
    request: new Request(`https://ruang-ibu.test${path}`, {
      method,
      headers: body ? { 'Content-Type': 'application/json' } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    }),
    env: { DB: database },
    params: questionId ? { questionId } : {},
    data: { admin: { email: 'moderator@example.test' } },
    next: async () => new Response(),
  }
}

async function insertQuestion(database: SqliteD1Database, values: {
  id: string
  status: string
  expiresAt?: string
  articleSlug?: string
}) {
  const publicName = ['approved', 'answered', 'hidden'].includes(values.status) ? 'Nama Publik' : null
  const publicText = publicName ? 'Pertanyaan publik yang disunting dan aman.' : null
  await database.prepare(`INSERT INTO questions
    (id, article_slug, display_name, question_text, optional_email, consent_at, moderation_status,
     public_display_name, public_question_text, created_at, updated_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind(values.id, values.articleSlug ?? 'nyeri-punggung-kehamilan', 'Nama Privat', 'Pertanyaan asli untuk moderasi dengan konteks umum.', 'private@example.test', '2026-10-27T00:00:00.000Z', values.status, publicName, publicText, '2026-10-27T00:00:00.000Z', '2026-10-27T00:00:00.000Z', values.expiresAt ?? '2027-10-27T00:00:00.000Z').run()
}

test('admin summary counts statuses from D1 and is private', async () => {
  assert.ok(summaryModule, 'admin summary endpoint exists')
  const database = new SqliteD1Database()
  for (const [id, status] of [['p', 'pending'], ['a', 'approved'], ['ans', 'answered'], ['r', 'rejected'], ['h', 'hidden']]) {
    await insertQuestion(database, { id, status })
  }
  const response = await summaryModule.onRequestGet(adminContext(database, '/api/admin/summary'))
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.deepEqual(payload.data, { total: 5, pending: 1, approved: 1, answered: 1, rejected: 1, hidden: 1 })
  database.close()
})

test('admin inbox filters by status and article and never returns an unbounded page', async () => {
  assert.ok(listModule, 'admin question inbox endpoint exists')
  const database = new SqliteD1Database()
  await insertQuestion(database, { id: 'p1', status: 'pending' })
  await insertQuestion(database, { id: 'p2', status: 'pending' })
  await insertQuestion(database, { id: 'a1', status: 'approved', articleSlug: 'terapi-musik' })
  const response = await listModule.onRequestGet(adminContext(database, '/api/admin/questions?status=pending&articleSlug=nyeri-punggung-kehamilan&limit=1'))
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.equal(payload.data.questions.length, 1)
  assert.equal(payload.data.questions[0].id, 'p2')
  assert.equal(payload.data.questions[0].email, 'private@example.test')
  assert.ok(payload.data.nextCursor)
  database.close()
})

test('admin inbox supports a validated group of handled statuses for history', async () => {
  assert.ok(listModule, 'admin question inbox endpoint exists')
  const database = new SqliteD1Database()
  for (const [id, status] of [['p', 'pending'], ['a', 'approved'], ['ans', 'answered'], ['r', 'rejected'], ['h', 'hidden']]) await insertQuestion(database, { id, status })
  const response = await listModule.onRequestGet(adminContext(database, '/api/admin/questions?status=approved%2Canswered%2Crejected%2Chidden&limit=20'))
  const payload = await response.json()
  const invalid = await listModule.onRequestGet(adminContext(database, '/api/admin/questions?status=approved%2Cunknown'))

  assert.equal(response.status, 200)
  assert.deepEqual(new Set(payload.data.questions.map((question: { status: string }) => question.status)), new Set(['approved', 'answered', 'rejected', 'hidden']))
  assert.equal(payload.data.questions.length, 4)
  assert.equal(invalid.status, 400)
  database.close()
})

test('admin inbox can list records whose retention deadline is due before manual purge', async () => {
  assert.ok(listModule, 'admin question inbox endpoint exists')
  const database = new SqliteD1Database()
  await insertQuestion(database, { id: 'due', status: 'rejected', expiresAt: '2026-10-01T00:00:00.000Z' })
  await insertQuestion(database, { id: 'later', status: 'approved', expiresAt: '2027-10-01T00:00:00.000Z' })
  const response = await listModule.onRequestGet(adminContext(database, '/api/admin/questions?expiresBefore=2026-10-27T00%3A00%3A00.000Z'))
  const payload = await response.json()

  assert.equal(response.status, 200)
  assert.deepEqual(payload.data.questions.map((question: { id: string }) => question.id), ['due'])
  assert.equal(payload.data.questions[0].expiresAt, '2026-10-01T00:00:00.000Z')
  const invalid = await listModule.onRequestGet(adminContext(database, '/api/admin/questions?expiresBefore=not-a-date'))
  assert.equal(invalid.status, 400)
  database.close()
})

test('moderation preserves original text while publishing only moderator-sanitized fields', async () => {
  assert.ok(moderationModule && detailModule, 'moderation and detail endpoints exist')
  const database = new SqliteD1Database()
  await insertQuestion(database, { id: 'q-approve', status: 'pending' })
  const body = { action: 'approve', publicDisplayName: 'Nama Samaran', publicQuestionText: 'Pertanyaan yang telah diperiksa dan disamarkan.' }
  const response = await moderationModule.onRequestPost(adminContext(database, '/api/admin/questions/q-approve/moderation', 'POST', body, 'q-approve'))
  const payload = await response.json()
  const original = await database.prepare('SELECT * FROM questions WHERE id = ?').bind('q-approve').first()
  const events = await database.prepare('SELECT action, actor FROM moderation_events WHERE question_id = ?').bind('q-approve').all()

  assert.equal(response.status, 200)
  assert.equal(payload.data.status, 'approved')
  assert.equal(original.question_text, 'Pertanyaan asli untuk moderasi dengan konteks umum.')
  assert.equal(original.display_name, 'Nama Privat')
  assert.equal(original.public_question_text, body.publicQuestionText)
  assert.deepEqual(events.results?.map((event: { action: string; actor: string }) => ({ action: event.action, actor: event.actor })), [{ action: 'approve', actor: 'moderator@example.test' }])
  const detail = await detailModule.onRequestGet(adminContext(database, '/api/admin/questions/q-approve', 'GET', undefined, 'q-approve'))
  assert.equal((await detail.json()).data.email, 'private@example.test')
  database.close()
})

test('invalid moderation transitions are rejected and do not create audit events', async () => {
  assert.ok(moderationModule, 'moderation endpoint exists')
  const database = new SqliteD1Database()
  await insertQuestion(database, { id: 'q-rejected', status: 'rejected' })
  const response = await moderationModule.onRequestPost(adminContext(database, '/api/admin/questions/q-rejected/moderation', 'POST', {
    action: 'approve', publicDisplayName: 'Nama', publicQuestionText: 'Pertanyaan publik yang telah disunting.'
  }, 'q-rejected'))
  const eventCount = await database.prepare('SELECT COUNT(*) AS count FROM moderation_events').first('count')
  assert.equal(response.status, 409)
  assert.equal(eventCount, 0)
  database.close()
})

test('one answer is created then updated without duplicate rows and publishes answered status', async () => {
  assert.ok(answerModule && listModule && publicModule, 'answer and public list endpoints exist')
  const database = new SqliteD1Database()
  await insertQuestion(database, { id: 'q-answer', status: 'approved' })
  const first = await answerModule.onRequestPut(adminContext(database, '/api/admin/questions/q-answer/answer', 'PUT', {
    answer: 'Silakan bicarakan keluhan dengan bidan atau dokter yang mendampingi.'
  }, 'q-answer'))
  assert.equal(first.status, 200)
  const second = await answerModule.onRequestPut(adminContext(database, '/api/admin/questions/q-answer/answer', 'PUT', {
    answer: 'Bidan atau dokter dapat membantu menilai pertanyaan dan pilihan yang sesuai.'
  }, 'q-answer'))
  const answers = await database.prepare('SELECT * FROM answers WHERE question_id = ?').bind('q-answer').all()
  const events = await database.prepare('SELECT action FROM moderation_events WHERE question_id = ? ORDER BY created_at').bind('q-answer').all()
  const publicResponse = await publicModule.onRequestGet(adminContext(database, '/api/questions?articleSlug=nyeri-punggung-kehamilan'))
  const publicPayload = await publicResponse.json()

  assert.equal(second.status, 200)
  assert.equal(answers.results?.length, 1)
  assert.equal(answers.results?.[0].answer_text, 'Bidan atau dokter dapat membantu menilai pertanyaan dan pilihan yang sesuai.')
  assert.deepEqual(new Set(events.results?.map((event: { action: string }) => event.action)), new Set(['answer', 'edit_answer']))
  assert.equal(publicPayload.data.questions[0].status, 'answered')
  assert.equal(publicPayload.data.questions[0].email, undefined)
  assert.equal(publicPayload.data.questions[0].displayName, 'Nama Publik')
  assert.equal(publicPayload.data.questions[0].question.includes('asli'), false)
  database.close()
})

test('moderators can reject, hide, and delete while retaining a minimal audit tombstone', async () => {
  assert.ok(moderationModule && detailModule, 'moderation and deletion endpoints exist')
  const database = new SqliteD1Database()
  await insertQuestion(database, { id: 'q-reject', status: 'pending' })
  await insertQuestion(database, { id: 'q-hide', status: 'approved' })
  const rejected = await moderationModule.onRequestPost(adminContext(database, '/api/admin/questions/q-reject/moderation', 'POST', { action: 'reject' }, 'q-reject'))
  const hidden = await moderationModule.onRequestPost(adminContext(database, '/api/admin/questions/q-hide/moderation', 'POST', { action: 'hide' }, 'q-hide'))
  assert.equal(rejected.status, 200)
  assert.equal(hidden.status, 200)
  const deleted = await detailModule.onRequestDelete(adminContext(database, '/api/admin/questions/q-hide', 'DELETE', undefined, 'q-hide'))
  const remainingQuestion = await database.prepare('SELECT id FROM questions WHERE id = ?').bind('q-hide').first()
  const tombstone = await database.prepare("SELECT question_id, action, metadata_json FROM moderation_events WHERE action = 'delete'").first()

  assert.equal(deleted.status, 200)
  assert.equal(remainingQuestion, null)
  assert.equal(tombstone.question_id, null)
  assert.equal(tombstone.action, 'delete')
  assert.ok(tombstone.metadata_json.includes('q-hide'))
  database.close()
})

test('retention purge deletes expired records and preserves only an audit tombstone', async () => {
  assert.ok(purgeModule, 'retention purge endpoint exists')
  const database = new SqliteD1Database()
  await insertQuestion(database, { id: 'q-expired', status: 'rejected', expiresAt: '2020-01-01T00:00:00.000Z' })
  await insertQuestion(database, { id: 'q-live', status: 'approved', expiresAt: '2099-01-01T00:00:00.000Z' })
  const response = await purgeModule.onRequestPost(adminContext(database, '/api/admin/retention/purge', 'POST'))
  const payload = await response.json()
  const records = await database.prepare('SELECT id FROM questions ORDER BY id').all()

  assert.equal(response.status, 200)
  assert.equal(payload.data.deleted, 1)
  assert.deepEqual(records.results?.map((record: { id: string }) => record.id), ['q-live'])
  assert.equal(await database.prepare("SELECT COUNT(*) AS count FROM moderation_events WHERE action = 'retention_purge' AND question_id IS NULL").first('count'), 1)
  const purgeEvent = await database.prepare("SELECT metadata_json FROM moderation_events WHERE action = 'retention_purge'").first<{ metadata_json: string }>()
  assert.equal(JSON.parse(purgeEvent!.metadata_json).deletedCount, 1)
  database.close()
})

test('retention purge rolls back candidate marking and deletion if its audit write fails', async () => {
  assert.ok(purgeModule, 'retention purge endpoint exists')
  const database = new SqliteD1Database()
  await insertQuestion(database, { id: 'q-expired', status: 'rejected', expiresAt: '2020-01-01T00:00:00.000Z' })
  database.database.exec(`CREATE TRIGGER fail_retention_audit BEFORE INSERT ON moderation_events
    WHEN NEW.action = 'retention_purge' BEGIN SELECT RAISE(ABORT, 'audit write failure'); END;`)
  const response = await purgeModule.onRequestPost(adminContext(database, '/api/admin/retention/purge', 'POST'))
  const row = await database.prepare('SELECT id, purge_batch_id FROM questions WHERE id = ?').bind('q-expired').first()
  const auditCount = await database.prepare("SELECT COUNT(*) AS count FROM moderation_events WHERE action = 'retention_purge'").first('count')

  assert.equal(response.status, 500)
  assert.equal(row.id, 'q-expired')
  assert.equal(row.purge_batch_id, null)
  assert.equal(auditCount, 0)
  database.close()
})
