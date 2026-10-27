import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const registryModule = await import('../../src/content/questionArticleRegistry.ts').catch(() => null)

test('question article registry covers every catalog article exactly once', async () => {
  assert.ok(registryModule, 'a shared question article registry exists')
  const source = await readFile(new URL('../../src/pages/TherapyPage.tsx', import.meta.url), 'utf8')
  const catalogSlugs = [...source.matchAll(/href:\s*'\/terapi\/([^']+)'/g)].map(([, slug]) => slug)
  const entries = registryModule.questionArticleRegistry

  assert.equal(entries.length, 11)
  assert.equal(new Set(entries.map((entry: { id: string }) => entry.id)).size, 11)
  assert.deepEqual(entries.map((entry: { slug: string }) => entry.slug).sort(), catalogSlugs.sort())
})

test('legacy route slugs resolve to their existing article without creating aliases as articles', () => {
  assert.ok(registryModule, 'a shared question article registry exists')
  assert.equal(registryModule.resolveQuestionArticleSlug('musik-relaksasi')?.slug, 'terapi-musik')
  assert.equal(registryModule.resolveQuestionArticleSlug('pijat-pendamping-persalinan')?.slug, 'pijat-pendamping')
  assert.equal(registryModule.resolveQuestionArticleSlug('question-from-unknown-route'), undefined)
})
