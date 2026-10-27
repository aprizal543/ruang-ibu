import assert from 'node:assert/strict'
import { access, readFile } from 'node:fs/promises'

const [references, articles, guides, routes, therapyPage, therapyDetails, therapyContent, informationPages, therapyStyles, sourceDisclosure] = await Promise.all([
  readFile(new URL('../src/content/therapyReferences.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/content/customerRevisionArticles.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/content/maternityGuides.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/App.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/pages/TherapyPage.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/therapy/TherapyDetailPage.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/content/therapyArticles.ts', import.meta.url), 'utf8'),
  readFile(new URL('../src/pages/InformationPages.tsx', import.meta.url), 'utf8'),
  readFile(new URL('../src/styles/therapy-detail.css', import.meta.url), 'utf8'),
  readFile(new URL('../src/components/ui/SourceDisclosure.tsx', import.meta.url), 'utf8'),
])

const requiredReferenceIds = Array.from({ length: 8 }, (_, index) => `C0${index + 1}`)
const requiredTopicIds = [
  'A01', 'A02', 'A03', 'A04', 'A05', 'A06',
  'B01', 'B02', 'B03', 'B04', 'B05', 'B06',
]

for (const id of requiredReferenceIds) {
  assert.match(references, new RegExp(`\\b${id}:`), `Missing required customer reference ${id}`)
}

const customerReferenceLinks = {
  C01: { url: 'https://jptam.org/index.php/jptam/article/view/31581', domain: 'jptam.org', doi: '10.31004/jptam.v9i2.31581' },
  C02: { url: 'https://jom.htp.ac.id/index.php/jkt/article/view/1032', domain: 'jom.htp.ac.id', doi: '10.25311/jkt/Vol2.Iss2.1032' },
  C03: { url: 'https://jom.htp.ac.id/index.php/jkt/article/view/1117', domain: 'jom.htp.ac.id', doi: '10.25311/jkt/Vol1.Iss1.1117' },
  C04: { url: 'https://pubmed.ncbi.nlm.nih.gov/40859559/', domain: 'pubmed.ncbi.nlm.nih.gov', doi: '10.1097/MD.0000000000043969' },
  C05: { url: 'https://pubmed.ncbi.nlm.nih.gov/39031663/', domain: 'pubmed.ncbi.nlm.nih.gov', doi: '10.1111/ijn.13281' },
  C06: { url: 'https://journals.sagepub.com/doi/10.1177/03057356241258958', domain: 'journals.sagepub.com', doi: '10.1177/03057356241258958' },
  C07: { url: 'https://link.springer.com/article/10.1186/s12978-025-02023-z', domain: 'link.springer.com', doi: '10.1186/s12978-025-02023-z' },
  C08: { url: 'https://www.frontiersin.org/journals/psychiatry/articles/10.3389/fpsyt.2024.1429999/full', domain: 'www.frontiersin.org', doi: '10.3389/fpsyt.2024.1429999' },
}

for (const [id, expected] of Object.entries(customerReferenceLinks)) {
  const block = references.match(new RegExp(`\\b${id}:\\s*\\{([^}]+)\\}`))?.[1]
  assert.ok(block, `Customer reference ${id} must be present`)
  const url = block.match(/\burl:\s*'([^']+)'/)?.[1]
  const doi = block.match(/\bdoi:\s*'([^']+)'/)?.[1]
  assert.equal(url, expected.url, `${id} must use the requested direct source URL`)
  assert.equal(doi, expected.doi, `${id} DOI must remain unchanged`)
  assert.ok(url, `${id} source URL must not be empty`)
  const parsedUrl = new URL(url)
  assert.equal(parsedUrl.protocol, 'https:', `${id} source must use HTTPS`)
  assert.equal(parsedUrl.hostname, expected.domain, `${id} source domain is unexpected`)
  assert.equal(parsedUrl.search, '', `${id} source URL must not include tracking parameters`)
  assert.doesNotMatch(url, /placeholder|localhost|127\.0\.0\.1/i, `${id} source URL must be a real public source`)
}

assert.match(sourceDisclosure, /<a href={source\.url} target="_blank" rel="noreferrer">/, 'Article and guide source links must use the centralized URL and open accessibly')
assert.match(informationPages, /<a href={source\.url} target="_blank" rel="noreferrer">[\s\S]*?Buka sumber asli/, 'Sources page must offer an explicit link to each original source')

for (const id of requiredTopicIds) {
  assert.match(guides, new RegExp(`topicId: '${id}'`), `Topic ${id} is not linked from its audience guide`)
}

const guideTopicIds = [...guides.matchAll(/topicId: '([^']+)'/g)].map(([, id]) => id)
assert.equal(new Set(guideTopicIds).size, 12, 'Audience guides must expose exactly 12 unique customer topics')
assert.match(routes, /path="\/terapi\/:slug"/, 'Generic article route is missing')
assert.match(articles, /customerRevisionArticles/, 'Customer article data is not integrated into therapy content')
assert.doesNotMatch(therapyDetails, /contentImage|therapy-article__image/, 'Catalog thumbnails must not be promoted to article figures')
assert.match(therapyDetails, /TherapyArticleFigure/, 'Therapy detail pages must render the reusable article figure')
assert.ok(
  therapyDetails.indexOf('className="therapy-article__summary"') < therapyDetails.indexOf('<TherapyArticleFigure')
    && therapyDetails.indexOf('<TherapyArticleFigure') < therapyDetails.indexOf('className="therapy-article__contents"'),
  'The article figure must follow the introduction and precede anchor navigation',
)
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
  'labor-touch-thumb.webp', 'relaxation.webp',
]
for (const file of requiredCatalogImages) {
  assert.ok(therapyPage.includes(`'${file}'`), `Catalog image mapping is missing: ${file}`)
  await access(new URL(`../public/images/therapy/${file}`, import.meta.url))
}

for (const customerReference of requiredReferenceIds) {
  assert.match(articles + guides, new RegExp(`'${customerReference}'`), `Customer reference ${customerReference} is not mapped to content`)
}

console.log('Customer content coverage: 12 topics and C01–C08 are present and mapped.')
