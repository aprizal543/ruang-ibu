import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://localhost:5173'

function browser(...args) {
  return execFileSync('agent-browser.cmd', args, {
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    shell: true,
    windowsHide: true,
  }).trim()
}

function evaluate(expression) {
  const encoded = Buffer.from(`JSON.stringify(${expression})`, 'utf8').toString('base64')
  const value = JSON.parse(browser('eval', '-b', encoded))
  if (value === 'true') return true
  if (value === 'false') return false
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  if (typeof value === 'string' && /^[\[{]/.test(value)) return JSON.parse(value)
  return value
}

browser('connect', '9339')

const pages = [
  {
    title: 'Terapi Musik',
    route: '/terapi/terapi-musik',
    sources: [
      'https://www.who.int/publications/i/item/9789241550215',
      'https://www.nice.org.uk/guidance/ng235/chapter/Recommendations',
      'https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour',
    ],
    audioSectionCount: '1',
    requiredCopy: ['Topik ini membahas musik pilihan Ibu sebagai pendamping suasana saat persalinan.', 'bukan layanan terapi musik klinis', 'tidak menjamin nyeri berkurang', 'Manfaatnya belum dapat dipastikan', 'Audio pendamping belum tersedia'],
    forbiddenCopy: ['Terapi musik di halaman ini berarti mendengarkan musik', 'WHO menyebut', 'NICE menyebut'],
  },
  {
    title: 'Relaksasi Otot Ringan',
    route: '/terapi/relaksasi-otot-ringan',
    sources: [
      'https://www.who.int/publications/i/item/9789241550215',
      'https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour',
    ],
    audioSectionCount: '0',
    requiredCopy: ['Ini berbeda dari relaksasi otot progresif (PMR)', 'Relaksasi otot progresif disebut sebagai salah satu pilihan relaksasi', 'pendekatan ringan di halaman ini berbeda dari teknik tersebut', 'Manfaatnya belum dapat dipastikan'],
    forbiddenCopy: ['Relaksasi otot ringan adalah relaksasi otot progresif', 'panduan gerakan langkah demi langkah'],
  },
  {
    title: 'Pijat Pendamping',
    route: '/terapi/pijat-pendamping',
    sources: [
      'https://www.who.int/publications/i/item/9789241550215',
      'https://www.nice.org.uk/guidance/ng235/chapter/Recommendations',
      'https://pubmed.ncbi.nlm.nih.gov/29589380/',
      'https://www.nhs.uk/pregnancy/labour-and-birth/pain-relief-in-labour/',
    ],
    audioSectionCount: '0',
    requiredCopy: ['Persetujuan dan kenyamanan Ibu', 'pendamping perlu memahami teknik yang sesuai', 'Bicarakan pilihan ini dengan bidan', 'Manfaatnya belum dapat dipastikan'],
    forbiddenCopy: ['NICE menyebut pilihan pijat'],
  },
]

browser('open', `${origin}/terapi`)
const cardHrefs = evaluate("[...document.querySelectorAll('.therapy-row')].map((link) => link.getAttribute('href'))")
assert.deepEqual(cardHrefs, ['/terapi/teknik-pernapasan', ...pages.map((page) => page.route)], 'Catalog rows point to all four implemented therapy details')

for (const page of pages) {
  browser('open', `${origin}${page.route}`)
  assert.equal(browser('get', 'url'), `${origin}${page.route}`)
  assert.equal(browser('get', 'text', 'h1'), page.title)
  const body = browser('get', 'text', 'body')
  for (const copy of ['Materi masih berupa draf', 'Belum ditinjau oleh tenaga kesehatan', 'Mengenal ', 'Apa itu', 'Apa tujuannya?', 'Kapan', 'Hal yang perlu Ibu perhatikan', 'Panduan untuk Ibu', 'Sumber Informasi', ...page.requiredCopy]) {
    assert.ok(body.includes(copy), `${page.title} includes ${copy}`)
  }
  for (const copy of page.forbiddenCopy) {
    assert.ok(!body.includes(copy), `${page.title} does not expose conflated or institution-led wording: ${copy}`)
  }
  assert.equal(browser('get', 'count', '[data-locked-guide]'), '1', `${page.title} practice guide stays locked`)
  assert.equal(browser('get', 'count', '.therapy-detail__practice-steps'), '0', `${page.title} has no visible practice steps`)
  assert.equal(browser('get', 'count', 'audio'), '0', `${page.title} has no audio player`)
  assert.equal(browser('get', 'count', '.therapy-detail__audio'), page.audioSectionCount, `${page.title} only shows an audio section when relevant`)
  assert.equal(browser('get', 'count', 'h1'), '1', `${page.title} has one H1`)
  assert.equal(browser('get', 'count', 'nav.bottom-tabs'), '1', `${page.title} retains bottom navigation`)
  assert.equal(browser('get', 'attr', 'a.bottom-tabs__item:nth-child(2)', 'aria-current'), 'page', 'Terapi is active')
  assert.equal(browser('get', 'count', '[data-source-details]'), '1', `${page.title} has an accessible source disclosure`)
  assert.equal(evaluate(`document.querySelector('[data-source-details]').open === false`), true)
  assert.deepEqual(evaluate("[...document.querySelectorAll('.therapy-detail__source a')].map((link) => link.href)"), page.sources, `${page.title} sources match its mapped reference IDs`)
  assert.equal(evaluate("document.querySelectorAll('[data-locked-guide] ol').length"), 0)
  assert.equal(evaluate("document.querySelectorAll('ol').length"), 0, `${page.title} contains no invented instructional sequence`)
  assert.equal(browser('get', 'count', '.therapy-detail__source-id'), '0')
  assert.equal(browser('get', 'count', '.therapy-detail__reference-marks'), '0')

  for (const href of ['#section-pengertian', '#section-tujuan', '#section-kapan-dipertimbangkan', '#section-keselamatan', '#section-referensi']) {
    assert.equal(evaluate(`document.querySelector('.therapy-article__contents a[href="${href}"]') !== null`), true, `${page.title} has ${href} anchor`)
    assert.equal(evaluate(`document.querySelector('${href}') !== null`), true, `${page.title} has ${href} target`)
  }
  const focusedAnchor = evaluate(`(() => { const link = [...document.querySelectorAll('.therapy-article__contents a')].find((node) => node.getAttribute('href') === '#section-kapan-dipertimbangkan'); link.focus(); return document.activeElement === link })()`)
  assert.equal(focusedAnchor, true, `${page.title} anchor can receive keyboard focus`)
  browser('press', 'Enter')
  assert.equal(evaluate("location.hash === '#section-kapan-dipertimbangkan'"), true, `${page.title} anchor navigation works`)
  evaluate("(() => { document.querySelector('[data-source-details] summary').focus(); return true })()")
  browser('press', 'Space')
  assert.equal(evaluate("document.querySelector('[data-source-details]').open"), true, `${page.title} source disclosure opens`)
  browser('open', `${origin}${page.route}`)
  browser('click', 'a.therapy-detail-header__back')
  assert.equal(browser('get', 'url'), `${origin}/terapi`, `${page.title} back control returns to catalog`)
}

for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  for (const page of pages) {
    browser('set', 'viewport', String(width), String(height))
    browser('open', `${origin}${page.route}`)
    assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${page.title} has no horizontal overflow at ${width}px`)
    const clearance = evaluate(`(() => { window.scrollTo(0, document.documentElement.scrollHeight); const c = document.querySelector('.therapy-detail__catalog-link').getBoundingClientRect(); const n = document.querySelector('.bottom-tabs').getBoundingClientRect(); return Math.round(n.top - c.bottom) })()`)
    assert.ok(clearance >= 24, `${page.title} return link clears bottom navigation at ${width}px`)
  }
}

browser('open', `${origin}/terapi`)
evaluate(`(() => { const link = [...document.querySelectorAll('.therapy-row')].find((node) => node.getAttribute('href') === '/terapi/terapi-musik'); link.click(); return true })()`)
assert.equal(browser('get', 'url'), `${origin}/terapi/terapi-musik`, 'Catalog link opens music detail')
browser('back')
assert.equal(browser('get', 'url'), `${origin}/terapi`, 'Browser Back returns to catalog')

browser('open', `${origin}/terapi/unknown-therapy`)
assert.equal(browser('get', 'text', 'h1'), 'Halaman ini sedang disiapkan', 'Unknown therapy routes use the honest fallback')

console.log('Phase 2.2 Agent Browser checks passed: direct routes, catalog/browser Back navigation, article source mapping, draft and locked states, optional audio, anchors, disclosure, responsive overflow, and bottom-navigation clearance.')
