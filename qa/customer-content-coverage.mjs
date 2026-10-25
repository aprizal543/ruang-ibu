import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

const [references, articles, guides, routes, therapyPage, therapyDetails, therapyContent, informationPages, therapyStyles] = await Promise.all([
  readFile(new URL('../src/content/therapyReferences.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/content/customerRevisionArticles.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/content/maternityGuides.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/pages/TherapyPage.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/therapy/TherapyDetailPage.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/content/therapyArticles.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/pages/InformationPages.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles/therapy-detail.css', import.meta.url), 'utf8'),
])

const requiredReferenceIds = Array.from({ length: 8 }, (_, index) => `C0${index + 1}`)
const requiredTopicIds = [
  'A01', 'A02', 'A03', 'A04', 'A05', 'A06',
  'B01', 'B02', 'B03', 'B04', 'B05', 'B06',
]

for (const id of requiredReferenceIds) {
  assert.match(references, new RegExp(`\\b${id}:`), `Missing required customer reference ${id}`)
}

for (const id of requiredTopicIds) {
  assert.match(guides, new RegExp(`topicId: '${id}'`), `Topic ${id} is not linked from its audience guide`)
}

const guideTopicIds = [...guides.matchAll(/topicId: '([^']+)'/g)].map(([, id]) => id)
assert.equal(new Set(guideTopicIds).size, 12, 'Audience guides must expose exactly 12 unique customer topics')
assert.match(routes, /path="\/terapi\/:slug"/, 'Generic article route is missing')
assert.match(articles, /customerRevisionArticles/, 'Customer article data is not integrated into therapy content')
assert.doesNotMatch(therapyDetails, /contentImage|therapy-article__image/, 'Therapy detail pages must remain text-first')
assert.doesNotMatch(therapyDetails, /<figure/, 'Therapy detail pages must not render editorial figures')
assert.ok(therapyDetails.indexOf('className="therapy-article__contents"') < therapyDetails.indexOf('article.sections.map'), 'Article sections must follow the anchor navigation directly')
assert.doesNotMatch(therapyPage, /contentImage/, 'Catalog thumbnails must remain separate from article content images')

const productionCopy = [articles, guides, therapyPage, therapyDetails, therapyContent, informationPages, references].join('\n')
const internalPhrases = [
  'penelitian customer',
  'jurnal customer',
  'materi revisi customer',
  'belum mendapat persetujuan klinis',
  'status draft',
  'source reviewed',
  'clinical review',
  'content blocker',
  'bukti belum memadai untuk mempublikasikan panduan',
  'kategori menandai konteks informasi',
  'penilaian keamanan',
  'panduan praktik ditahan',
  'materi ditelaah dan disetujui secara klinis',
]
for (const phrase of internalPhrases) {
  assert.doesNotMatch(productionCopy, new RegExp(phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'), `Internal wording must not appear in production copy: ${phrase}`)
}

assert.match(references, /S30:\s*\{[\s\S]*?Back Pain During Pregnancy[\s\S]*?acog\.org\/womens-health\/faqs\/back-pain-during-pregnancy/, 'ACOG pregnancy back-pain guidance is missing from the source list')
assert.match(articles, /'kompres-hangat-kehamilan'[\s\S]*?S30/, 'Pregnancy warm-compress content must cite ACOG safety guidance')
assert.match(articles, /clinicalReview: \{ status: 'draft' \}/, 'Customer article clinical review must remain in draft status')
assert.match(articles, /Kompres Hangat Saat Hamil[\s\S]*?Mengenal Kompres Hangat/, 'Pregnancy warm-compress article title and subheading are missing')
for (const step of [
  'Berikut beberapa hal yang dapat Ibu perhatikan saat menggunakan sumber hangat untuk membantu meredakan pegal pada otot punggung.',
  'Gunakan sumber hangat pada otot punggung yang terasa pegal.',
  'pilih pengaturan panas paling rendah',
  'dengan handuk agar tidak langsung menyentuh kulit',
  'Batasi lama pemakaian. Jangan gunakan terlalu lama.',
  'nyeri berat, tidak membaik, atau disertai keluhan yang mengkhawatirkan',
]) {
  assert.ok(articles.includes(step), `Patient-facing warm-compress guidance is missing: ${step}`)
}
assert.match(therapyDetails, /<ol className="therapy-detail__source-guide-list">/, 'Source-based guide must render as a numbered list')
assert.match(therapyStyles, /\.therapy-detail__source-guide-list\s*\{[^}]*list-style:\s*decimal/s, 'Numbered guide markers must be explicitly visible')

const requiredCatalogImages = [
  'back-comfort-thumb.webp', 'music.webp', 'breathing.webp',
  'warm-compress-pregnancy-thumb.webp', 'prenatal-massage-thumb.webp',
  'pregnancy-support-thumb.webp', 'labor-support-thumb.webp',
  'warm-compress-labor-thumb.webp', 'labor-companion-thumb.webp',
  'labor-touch-thumb.svg', 'relaxation.webp',
]
for (const file of requiredCatalogImages) {
  assert.ok(therapyPage.includes(`'${file}'`), `Catalog image mapping is missing: ${file}`)
  await access(new URL(`../public/images/therapy/${file}`, import.meta.url))
}

for (const customerReference of requiredReferenceIds) {
  assert.match(articles + guides, new RegExp(`'${customerReference}'`), `Customer reference ${customerReference} is not mapped to content`)
}

console.log('Customer content coverage: 12 topics and C01–C08 are present and mapped.')
