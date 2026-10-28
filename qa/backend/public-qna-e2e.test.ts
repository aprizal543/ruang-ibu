import assert from 'node:assert/strict'
import { test } from 'node:test'
import { SqliteD1Database } from './sqlite-d1.ts'

const publicQuestions = await import('../../functions/api/questions/index.ts')
const answer = await import('../../functions/api/admin/questions/[questionId]/answer.ts')

test('synthetic visitor question is immediately public as unanswered and then shows the Admin answer', async () => {
  const DB = new SqliteD1Database()
  const env = {
    DB,
    TURNSTILE_SECRET_KEY: 'synthetic-turnstile-secret',
    TURNSTILE_ALLOWED_HOSTNAMES: 'ruang-ibu.test',
    RATE_LIMIT_HMAC_KEY: 'synthetic-rate-limit-hmac-key-for-tests',
  }
  const slug = 'nyeri-punggung-kehamilan'
  const submit = await publicQuestions.handleQuestionPost({
    request: new Request('https://ruang-ibu.test/api/questions', {
      method: 'POST',
      headers: { Origin: 'https://ruang-ibu.test', 'Content-Type': 'application/json', 'CF-Connecting-IP': '203.0.113.88' },
      body: JSON.stringify({
        articleSlug: slug,
        question: 'Apa yang dapat saya tanyakan kepada bidan tentang keluhan ini?',
        consentToPublicDisplay: true,
        turnstileToken: 'synthetic-token',
      }),
    }),
    env,
  }, async () => ({ success: true, action: 'ask_question', hostname: 'ruang-ibu.test' }))
  const receipt = await submit.json()
  const questionId = receipt.data.id as string

  assert.equal(submit.status, 201)
  assert.equal(receipt.data.status, 'approved')
  assert.equal(receipt.data.message, 'Pertanyaan berhasil dikirim dan langsung tampil.')
  const beforeAnswer = await publicQuestions.onRequestGet({
    request: new Request(`https://ruang-ibu.test/api/questions?articleSlug=${slug}`), env,
  })
  const unanswered = await beforeAnswer.json()
  assert.equal(unanswered.data.questions.length, 1)
  assert.equal(unanswered.data.questions[0].status, 'approved')
  assert.equal(unanswered.data.questions[0].answer, null)

  const answerText = 'Sampaikan keluhan dan pertanyaan kepada bidan atau dokter yang mendampingi.'
  const answered = await answer.onRequestPut({
    request: new Request(`https://ruang-ibu.test/api/admin/questions/${questionId}/answer`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ answer: answerText }),
    }),
    env,
    params: { questionId },
    data: { admin: { id: 'synthetic-owner', email: 'owner@example.test', role: 'owner' } },
    next: async () => new Response(),
  })
  assert.equal(answered.status, 200)

  const afterAnswer = await publicQuestions.onRequestGet({
    request: new Request(`https://ruang-ibu.test/api/questions?articleSlug=${slug}`), env,
  })
  const published = await afterAnswer.json()
  assert.equal(published.data.questions[0].status, 'answered')
  assert.equal(published.data.questions[0].answer.text, answerText)
  for (const response of [submit, beforeAnswer, answered, afterAnswer]) assert.equal(response.headers.get('Cache-Control'), 'no-store')
  DB.close()
})
