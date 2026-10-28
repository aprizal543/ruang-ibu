import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SqliteD1Database } from './sqlite-d1.ts'

const questionsApi = await import('../../functions/api/questions/index.ts')
const answerApi = await import('../../functions/api/admin/questions/[questionId]/answer.ts')

const articleSlug = 'nyeri-punggung-kehamilan'
const publicQuestion = 'Apa yang dapat saya diskusikan dengan bidan tentang keluhan ini?'

function createEnv() {
  return {
    DB: new SqliteD1Database(),
    TURNSTILE_SECRET_KEY: 'synthetic-turnstile-secret',
    TURNSTILE_ALLOWED_HOSTNAMES: 'ruang-ibu.test',
    RATE_LIMIT_HMAC_KEY: 'synthetic-rate-limit-hmac-key-for-local-tests',
  }
}

function publicRequest(overrides: Record<string, unknown> = {}) {
  return new Request('https://ruang-ibu.test/api/questions', {
    method: 'POST',
    headers: {
      Origin: 'https://ruang-ibu.test',
      'Content-Type': 'application/json',
      'CF-Connecting-IP': '203.0.113.121',
    },
    body: JSON.stringify({
      articleSlug,
      question: publicQuestion,
      consentToPublicDisplay: true,
      turnstileToken: 'synthetic-turnstile-token',
      ...overrides,
    }),
  })
}

test('valid visitor question is atomically public as unanswered and returned in its article thread', async () => {
  const env = createEnv()
  const response = await questionsApi.handleQuestionPost({ request: publicRequest(), env }, async () => ({
    success: true,
    action: 'ask_question',
    hostname: 'ruang-ibu.test',
  }))
  const receipt = await response.json()
  const stored = await env.DB.prepare('SELECT * FROM questions').first<Record<string, unknown>>()
  const listResponse = await questionsApi.onRequestGet({
    request: new Request(`https://ruang-ibu.test/api/questions?articleSlug=${articleSlug}`), env,
  })
  const list = await listResponse.json()

  assert.equal(response.status, 201)
  assert.equal(receipt.data.status, 'approved')
  assert.equal(receipt.data.question.question, publicQuestion)
  assert.equal(receipt.data.question.answer, null)
  assert.equal(stored?.moderation_status, 'approved')
  assert.equal(stored?.public_display_name, 'Ibu')
  assert.equal(stored?.public_question_text, publicQuestion)
  assert.equal(stored?.optional_email, null)
  assert.equal(list.data.questions.length, 1)
  assert.equal(list.data.questions[0].id, receipt.data.id)
  assert.equal(list.data.questions[0].status, 'approved')
  assert.equal(list.data.questions[0].answer, null)
  assert.equal(response.headers.get('Cache-Control'), 'no-store')
  env.DB.close()
})

test('personal data, links, and obvious repeated spam are rejected before Turnstile or publication', async () => {
  const riskyQuestions = [
    'Email saya ibu@example.test, boleh saya bertanya soal ini?',
    'Nomor HP saya 0812-3456-7890, bagaimana dengan keluhan ini?',
    'NIK saya 1234567890123456 perlu diperiksa untuk apa?',
    'Mohon lihat https://example.test untuk pertanyaan lengkap saya.',
    'tolong tolong tolong tolong tolong tolong jawab ya',
  ]

  for (const [index, question] of riskyQuestions.entries()) {
    const env = createEnv()
    let verificationCalls = 0
    const response = await questionsApi.handleQuestionPost({
      request: publicRequest({ question }), env,
    }, async () => {
      verificationCalls += 1
      return { success: true, action: 'ask_question', hostname: 'ruang-ibu.test' }
    })
    const count = await env.DB.prepare('SELECT count(*) AS total FROM questions').first<{ total: number }>()

    assert.equal(response.status, 400, `risky sample ${index + 1} is rejected`)
    assert.equal(verificationCalls, 0, `risky sample ${index + 1} is blocked before challenge verification`)
    assert.equal(count?.total, 0, `risky sample ${index + 1} is not stored`)
    const payload = await response.json()
    assert.equal(typeof payload.error.message, 'string')
    assert.ok(payload.error.message.length > 10)
    env.DB.close()
  }
})

test('failed or expired Turnstile verification never stores or publishes a question', async () => {
  const env = createEnv()
  const response = await questionsApi.handleQuestionPost({ request: publicRequest(), env }, async () => ({
    success: false,
    action: 'ask_question',
    hostname: 'ruang-ibu.test',
  }))
  const count = await env.DB.prepare('SELECT count(*) AS total FROM questions').first<{ total: number }>()

  assert.equal(response.status, 403)
  assert.equal(count?.total, 0)
  assert.equal((await response.json()).error.message, 'Verifikasi tidak berhasil. Silakan coba lagi.')
  env.DB.close()
})

test('question storage failure returns an error and produces no public receipt or list item', async () => {
  const env = createEnv()
  const database = env.DB
  const prepare = database.prepare.bind(database)
  database.prepare = (sql: string) => {
    if (/INSERT INTO questions/iu.test(sql)) throw new Error('synthetic storage failure')
    return prepare(sql)
  }
  const response = await questionsApi.handleQuestionPost({ request: publicRequest(), env }, async () => ({
    success: true,
    action: 'ask_question',
    hostname: 'ruang-ibu.test',
  }))
  const payload = await response.json()
  const listResponse = await questionsApi.onRequestGet({
    request: new Request(`https://ruang-ibu.test/api/questions?articleSlug=${articleSlug}`), env,
  })
  const list = await listResponse.json()

  assert.equal(response.status, 500)
  assert.equal(payload.data, undefined)
  assert.equal(payload.error.message, 'Pertanyaan belum dapat dikirim. Silakan coba lagi.')
  assert.equal(list.data.questions.length, 0)
  database.close()
})

test('legacy pending question can be published with its answer in one owner action without a separate approval', async () => {
  const env = createEnv()
  await env.DB.prepare(`INSERT INTO questions
    (id, article_slug, display_name, question_text, consent_at, moderation_status, created_at, updated_at, expires_at)
    VALUES (?, ?, ?, ?, ?, 'pending', ?, ?, ?)`)
    .bind('legacy-pending', articleSlug, 'Ibu Lama', 'Pertanyaan lama menunggu pemeriksaan pengelola.', '2026-10-01T00:00:00.000Z', '2026-10-01T00:00:00.000Z', '2026-10-01T00:00:00.000Z', '2026-12-30T00:00:00.000Z').run()
  const response = await answerApi.onRequestPut({
    request: new Request('https://ruang-ibu.test/api/admin/questions/legacy-pending/answer', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        answer: 'Sampaikan pertanyaan ini kepada bidan atau dokter yang mendampingi.',
        publicDisplayName: 'Ibu',
        publicQuestionText: 'Apa yang dapat saya tanyakan kepada bidan tentang keluhan ini?',
      }),
    }),
    env,
    params: { questionId: 'legacy-pending' },
    data: { admin: { id: 'owner-1', email: 'owner@example.test', role: 'owner' } },
    next: async () => new Response(),
  })

  assert.equal(response.status, 200)
  const stored = await env.DB.prepare('SELECT moderation_status, public_display_name, public_question_text FROM questions WHERE id = ?').bind('legacy-pending').first<Record<string, unknown>>()
  assert.equal(stored?.moderation_status, 'answered')
  assert.equal(stored?.public_display_name, 'Ibu')
  assert.equal((await env.DB.prepare('SELECT count(*) AS total FROM answers WHERE question_id = ?').bind('legacy-pending').first<{ total: number }>())?.total, 1)
  assert.equal((await env.DB.prepare('SELECT action FROM moderation_events WHERE question_id = ?').bind('legacy-pending').first<{ action: string }>())?.action, 'answer')
  env.DB.close()
})
