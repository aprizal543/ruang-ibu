import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SqliteD1Database } from './sqlite-d1.ts'

const apiModule = await import('../../functions/api/questions/index.ts').catch(() => null)

function createEnv(database = new SqliteD1Database()) {
  return {
    DB: database,
    TURNSTILE_SECRET_KEY: 'test-secret-not-a-deployment-secret',
    TURNSTILE_ALLOWED_HOSTNAMES: 'ruang-ibu.test',
    RATE_LIMIT_HMAC_KEY: 'test-rate-limit-hmac-key-not-for-deployment',
  }
}

function request(path: string, init: RequestInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('Origin', 'https://ruang-ibu.test')
  headers.set('Content-Type', 'application/json')
  headers.set('CF-Connecting-IP', '203.0.113.24')
  return new Request(`https://ruang-ibu.test${path}`, { ...init, headers })
}

function submitBody(overrides: Record<string, unknown> = {}) {
  return {
    articleSlug: 'nyeri-punggung-kehamilan',
    displayName: 'Ibu Rani',
    question: 'Apa yang dapat saya tanyakan kepada bidan tentang nyeri punggung?',
    email: 'rani@example.test',
    consentToPublicModeration: true,
    turnstileToken: 'test-token',
    ...overrides,
  }
}

test('valid submission is private, saved as pending, and returns no visitor data', async () => {
  assert.ok(apiModule, 'public question API module exists')
  const env = createEnv()
  const response = await apiModule.handleQuestionPost({
    request: request('/api/questions', { method: 'POST', body: JSON.stringify(submitBody()) }),
    env,
  }, async () => ({ success: true, action: 'ask_question', hostname: 'ruang-ibu.test' }))
  const payload = await response.json()
  const stored = await env.DB.prepare('SELECT * FROM questions').first()

  assert.equal(response.status, 201)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.deepEqual(payload, { data: { id: stored.id, status: 'pending', message: 'Pertanyaan diterima dan menunggu moderasi.' } })
  assert.equal(stored.moderation_status, 'pending')
  assert.equal(stored.optional_email, 'rani@example.test')
  assert.equal(stored.public_question_text, null)
  assert.equal(JSON.stringify(payload).includes('rani@example.test'), false)
  env.DB.close()
})

test('public reads return only approved questions and never private columns', async () => {
  assert.ok(apiModule, 'public question API module exists')
  const env = createEnv()
  await env.DB.prepare(`INSERT INTO questions
    (id, article_slug, display_name, question_text, optional_email, consent_at, moderation_status,
     public_display_name, public_question_text, created_at, updated_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind('pending-1', 'nyeri-punggung-kehamilan', 'Private Name', 'A pending question with enough text', 'private@example.test', '2026-10-27T00:00:00.000Z', 'pending', null, null, '2026-10-27T00:00:00.000Z', '2026-10-27T00:00:00.000Z', '2027-01-25T00:00:00.000Z').run()
  await env.DB.prepare(`INSERT INTO questions
    (id, article_slug, display_name, question_text, optional_email, consent_at, moderation_status,
     public_display_name, public_question_text, created_at, updated_at, expires_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`)
    .bind('approved-1', 'nyeri-punggung-kehamilan', 'Private Name', 'Original private question with enough text', 'private@example.test', '2026-10-27T00:00:00.000Z', 'answered', 'Nama Samaran', 'Pertanyaan publik yang sudah disunting moderator.', '2026-10-27T00:01:00.000Z', '2026-10-27T00:02:00.000Z', '2027-10-27T00:00:00.000Z').run()
  await env.DB.prepare(`INSERT INTO answers (id, question_id, answer_text, answered_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?)`)
    .bind('answer-1', 'approved-1', 'Silakan diskusikan keluhan dan pilihan yang sesuai dengan bidan atau dokter.', 'admin@example.test', '2026-10-27T00:02:00.000Z', '2026-10-27T00:02:00.000Z').run()

  const response = await apiModule.onRequestGet({ request: new Request('https://ruang-ibu.test/api/questions?articleSlug=nyeri-punggung-kehamilan'), env })
  const payload = await response.json()
  const serialized = JSON.stringify(payload)

  assert.equal(response.status, 200)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  assert.equal(payload.data.questions.length, 1)
  assert.equal(payload.data.questions[0].id, 'approved-1')
  assert.equal(payload.data.questions[0].displayName, 'Nama Samaran')
  assert.equal(payload.data.questions[0].question, 'Pertanyaan publik yang sudah disunting moderator.')
  assert.equal(payload.data.questions[0].status, 'answered')
  assert.equal(payload.data.questions[0].answer.text, 'Silakan diskusikan keluhan dan pilihan yang sesuai dengan bidan atau dokter.')
  for (const privateValue of ['private@example.test', 'Private Name', 'Original private question', 'admin@example.test', 'moderated_by']) {
    assert.equal(serialized.includes(privateValue), false, `public response omits ${privateValue}`)
  }
  env.DB.close()
})

test('public question pagination is bounded and advances without duplicate rows', async () => {
  assert.ok(apiModule, 'public question API module exists')
  const env = createEnv()
  for (const [id, createdAt] of [['q1', '2026-10-27T03:00:00.000Z'], ['q2', '2026-10-27T02:00:00.000Z'], ['q3', '2026-10-27T01:00:00.000Z']]) {
    await env.DB.prepare(`INSERT INTO questions
      (id, article_slug, display_name, question_text, consent_at, moderation_status, public_display_name,
       public_question_text, created_at, updated_at, expires_at)
      VALUES (?, ?, ?, ?, ?, 'approved', ?, ?, ?, ?, ?)`)
      .bind(id, 'terapi-musik', 'Private', 'Original question that is private', '2026-10-27T00:00:00.000Z', 'Nama', `Pertanyaan publik ${id} sudah disunting.`, createdAt, createdAt, '2027-10-27T00:00:00.000Z').run()
  }
  const first = await apiModule.onRequestGet({ request: new Request('https://ruang-ibu.test/api/questions?articleSlug=musik-relaksasi&limit=2'), env })
  const firstPayload = await first.json()
  const nextCursor = firstPayload.data.nextCursor
  const second = await apiModule.onRequestGet({ request: new Request(`https://ruang-ibu.test/api/questions?articleSlug=terapi-musik&limit=2&cursor=${encodeURIComponent(nextCursor)}`), env })
  const secondPayload = await second.json()

  assert.equal(firstPayload.data.questions.length, 2)
  assert.ok(nextCursor)
  assert.equal(secondPayload.data.questions.length, 1)
  assert.deepEqual([...firstPayload.data.questions, ...secondPayload.data.questions].map((item: { id: string }) => item.id), ['q1', 'q2', 'q3'])
  env.DB.close()
})

test('POST rejects invalid origin, extra keys, bad email, unknown slug, oversized payload, and bad Turnstile', async () => {
  assert.ok(apiModule, 'public question API module exists')
  const cases = [
    { body: submitBody({ articleSlug: 'made-up-article' }), status: 400 },
    { body: submitBody({ email: 'not-an-email' }), status: 400 },
    { body: submitBody({ extra: true }), status: 400 },
    { body: submitBody({ consentToPublicModeration: false }), status: 400 },
    { body: submitBody({ question: 'short' }), status: 400 },
  ]
  for (const scenario of cases) {
    const env = createEnv()
    const response = await apiModule.handleQuestionPost({ request: request('/api/questions', { method: 'POST', body: JSON.stringify(scenario.body) }), env }, async () => ({ success: true, action: 'ask_question', hostname: 'ruang-ibu.test' }))
    assert.equal(response.status, scenario.status)
    env.DB.close()
  }

  const env = createEnv()
  const invalidOrigin = request('/api/questions', { method: 'POST', body: JSON.stringify(submitBody()) })
  invalidOrigin.headers.set('Origin', 'https://attacker.example')
  assert.equal((await apiModule.handleQuestionPost({ request: invalidOrigin, env }, async () => ({ success: true, action: 'ask_question', hostname: 'ruang-ibu.test' }))).status, 403)
  const invalidTurnstile = await apiModule.handleQuestionPost({ request: request('/api/questions', { method: 'POST', body: JSON.stringify(submitBody()) }), env }, async () => ({ success: false }))
  assert.equal(invalidTurnstile.status, 403)
  const oversized = request('/api/questions', { method: 'POST', body: JSON.stringify(submitBody({ question: 'x'.repeat(9000) })) })
  assert.equal((await apiModule.handleQuestionPost({ request: oversized, env }, async () => ({ success: true }))).status, 413)
  env.DB.close()
})

test('missing Turnstile or HMAC configuration fails closed without database writes', async () => {
  assert.ok(apiModule, 'public question API module exists')
  for (const missing of ['TURNSTILE_SECRET_KEY', 'RATE_LIMIT_HMAC_KEY']) {
    const env = createEnv()
    delete env[missing]
    const response = await apiModule.handleQuestionPost({ request: request('/api/questions', { method: 'POST', body: JSON.stringify(submitBody()) }), env }, async () => ({ success: true, action: 'ask_question', hostname: 'ruang-ibu.test' }))
    assert.equal(response.status, 503)
    assert.equal(await env.DB.prepare('SELECT COUNT(*) AS count FROM questions').first('count'), 0)
    env.DB.close()
  }
})

test('hashed-IP rate limit allows three attempts per hour and never stores the raw address', async () => {
  assert.ok(apiModule, 'public question API module exists')
  const env = createEnv()
  const verify = async () => ({ success: true, action: 'ask_question', hostname: 'ruang-ibu.test' })
  const responses = []
  for (let index = 0; index < 4; index += 1) {
    responses.push(await apiModule.handleQuestionPost({ request: request('/api/questions', { method: 'POST', body: JSON.stringify(submitBody({ question: `Pertanyaan yang valid nomor ${index} dengan konteks umum.` })) }), env }, verify))
  }
  const rateRecord = await env.DB.prepare('SELECT key_hash, request_count FROM question_rate_limits').first()

  assert.deepEqual(responses.map((response: Response) => response.status), [201, 201, 201, 429])
  assert.equal(rateRecord.request_count, 4)
  assert.equal(rateRecord.key_hash.includes('203.0.113.24'), false)
  assert.equal(await env.DB.prepare('SELECT COUNT(*) AS count FROM questions').first('count'), 3)
  env.DB.close()
})
