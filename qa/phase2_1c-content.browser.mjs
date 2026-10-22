import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'

function browser(...args) {
  return execFileSync('agent-browser.cmd', ['--cdp', '9339', ...args], {
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    shell: true,
    windowsHide: true,
  }).trim()
}

function assertPageTitle(title) {
  assert.equal(browser('get', 'text', 'h1'), title)
}

function browserEval(expression) {
  const encoded = Buffer.from(`JSON.stringify(${expression})`, 'utf8').toString('base64')
  const value = JSON.parse(browser('eval', '-b', encoded))
  if (value === 'true') return true
  if (value === 'false') return false
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  return value
}

browser('open', `${origin}/terapi/teknik-pernapasan`)
assert.equal(browser('get', 'url'), `${origin}/terapi/teknik-pernapasan`)
assertPageTitle('Teknik Pernapasan')
assert.equal(browserEval("document.querySelector('.therapy-detail-header').innerText.trim() === 'Detail Terapi'"), true)

const detailText = browser('get', 'text', 'body')
for (const text of [
  'Materi masih berupa draf',
  'Mengenal Teknik Pernapasan',
  'Apa itu teknik pernapasan?',
  'Apa tujuannya?',
  'Kapan teknik ini dapat dipertimbangkan?',
  'Hal yang perlu Ibu perhatikan',
  'Panduan untuk Ibu',
  'Audio Pendamping',
  'Sumber Informasi',
  'Belum ditinjau oleh tenaga kesehatan',
  'Manfaatnya belum dapat dipastikan dan bisa berbeda pada setiap Ibu',
]) {
  assert.ok(detailText.includes(text), `Expected detail page to include: ${text}`)
}
assert.equal(detailText.includes('Dalam pedoman persalinan'), false, 'Labor copy uses mother-facing wording, not guideline exposition')
assert.ok(detailText.includes('Bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri saat persalinan, teknik pernapasan dapat menjadi salah satu pilihan relaksasi. Ibu dapat membicarakan pilihan ini dengan bidan yang mendampingi agar sesuai dengan kondisi dan kebutuhan Ibu.'), 'Labor copy preserves source scope and preference-led care in plain language')
for (const academicTerm of ['Cochrane', 'metodologi', 'penelitian', 'rendah hingga sangat rendah', 'T01', 'MATERI-DRAF']) {
  assert.equal(detailText.includes(academicTerm), false, `Academic/internal term must not appear in the visible reading flow: ${academicTerm}`)
}
assert.equal(browser('get', 'count', '[data-evidence-details]'), '0', 'There is no dedicated research section or disclosure')
assert.equal(browser('get', 'count', '[data-source-details]'), '1', 'Sources are disclosed from a simple source section')
assert.equal(browserEval("document.querySelector('[data-source-details]').open === false"), true, 'The source list starts collapsed')
assert.equal(browserEval("[...document.querySelectorAll('h2')].map((node) => node.innerText).join('|').includes('Mengenal Teknik Pernapasan|Apa itu teknik pernapasan?|Apa tujuannya?|Kapan teknik ini dapat dipertimbangkan?|Hal yang perlu Ibu perhatikan|Panduan untuk Ibu|Audio Pendamping|Sumber Informasi')"), true, 'Sections follow the requested mother-centered order')

for (const href of ['#section-pengertian', '#section-tujuan', '#section-kapan-dipertimbangkan', '#section-keselamatan', '#section-referensi']) {
  assert.equal(browserEval(`document.querySelector('.therapy-article__contents a[href="${href}"]') !== null`), true, `The reading navigation includes ${href}`)
  assert.equal(browserEval(`document.querySelector('${href}') !== null`), true, `The navigation target ${href} exists`)
}
assert.equal(
  browserEval("(() => { const link = document.querySelector('.therapy-article__contents a[href=\"#section-kapan-dipertimbangkan\"]'); link.click(); return location.hash === '#section-kapan-dipertimbangkan' })()"),
  true,
  'Anchor navigation reaches the intended section',
)
assert.equal(browser('get', 'count', 'audio'), '0', 'No audio player may be rendered without audio')
assert.equal(browser('get', 'count', '[data-locked-guide]'), '1', 'Practice guide remains locked')
assert.equal(browser('get', 'count', 'h1'), '1', 'The page has one primary heading')
assert.equal(browser('get', 'count', '.therapy-detail__source'), '4', 'All four sources remain available')
assert.equal(browser('get', 'count', '.therapy-detail__source-id'), '0', 'Academic source numbering is not displayed')
assert.equal(browser('get', 'count', '.therapy-detail__reference-marks'), '0', 'Repeated inline citation numbers are not displayed')
assert.equal(browserEval("getComputedStyle(document.querySelector('.therapy-detail__safety p')).fontSize === '16px'"), true, 'Safety copy uses readable editorial body size')
assert.equal(browserEval("(() => { document.querySelector('[data-source-details] summary').click(); return document.querySelector('[data-source-details]').open })()"), true, 'The source list is easy to open')
assert.equal(
  browserEval("[...document.querySelectorAll('.therapy-detail__source a')].map((node) => node.href).join('|') === 'https://www.who.int/publications/i/item/9789241550215|https://www.nice.org.uk/guidance/ng235/chapter/Recommendations|https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour|https://www.nhs.uk/pregnancy/mental-health-in-pregnancy-and-after-the-birth/anxiety-in-pregnancy/'"),
  true,
  'Source links point to the four recorded official URLs',
)
assert.equal(browser('get', 'count', 'nav.bottom-tabs'), '1', 'The six-tab navigation remains present')
assert.equal(browser('get', 'attr', 'a.bottom-tabs__item:nth-child(2)', 'aria-current'), 'page', 'Terapi stays active on the detail route')

const clearanceByWidth = []
for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  browser('set', 'viewport', String(width), String(height))
  assert.equal(browserEval('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `No horizontal overflow at ${width}px`)
  assert.equal(browserEval('document.documentElement.scrollHeight !== window.innerHeight'), true, `The article can scroll at ${width}px`)
  const clearance = browserEval(`(() => { window.scrollTo(0, document.documentElement.scrollHeight); const c = document.querySelector('.therapy-detail__catalog-link').getBoundingClientRect(); const n = document.querySelector('.bottom-tabs').getBoundingClientRect(); return Math.round(n.top - c.bottom) })()`)
  assert.ok(clearance >= 24, `Catalog return link clears bottom navigation by at least 24px at ${width}px`)
  clearanceByWidth.push(`${width}px: ${clearance}px`)
}

browser('open', `${origin}/terapi/teknik-pernapasan`)
browser('press', 'Tab')
assert.ok(browserEval('document.activeElement.outerHTML').includes('skip-link'), 'Keyboard starts at the skip link')
let contentsNavigationHasFocus = false
for (let attempt = 0; attempt < 8 && !contentsNavigationHasFocus; attempt += 1) {
  browser('press', 'Tab')
  contentsNavigationHasFocus = browserEval("document.activeElement.closest('.therapy-article__contents') !== null")
}
assert.equal(contentsNavigationHasFocus, true, 'Keyboard focus reaches article anchor navigation')
browser('press', 'Enter')
assert.equal(browserEval("location.hash === '#section-pengertian'"), true, 'Keyboard activates an article anchor')
assert.equal(browserEval("(() => { const summary = document.querySelector('[data-source-details] summary'); summary.focus(); return document.activeElement === summary })()"), true, 'Source disclosure can receive keyboard focus')
browser('press', 'Space')
assert.equal(browserEval("document.querySelector('[data-source-details]').open === true"), true, 'Keyboard opens the source list')
browser('press', 'Space')
assert.equal(browserEval("document.querySelector('[data-source-details]').open === false"), true, 'Keyboard closes the source list')

browser('open', `${origin}/terapi`)
browser('click', 'a.therapy-row')
assert.equal(browser('get', 'url'), `${origin}/terapi/teknik-pernapasan`)
assertPageTitle('Teknik Pernapasan')
browser('click', 'a.therapy-detail-header__back')
assert.equal(browser('get', 'url'), `${origin}/terapi`)
assertPageTitle('Jenis Terapi')

browser('open', `${origin}/terapi/musik-relaksasi`)
assert.equal(browser('get', 'url'), `${origin}/terapi/musik-relaksasi`)
assertPageTitle('Halaman ini sedang disiapkan')

console.log(`Phase 2.1C browser checks passed: patient-friendly section order, no inline academic citations, source disclosure, locked practice/audio, accessibility, routes, overflow, and bottom-nav clearance (${clearanceByWidth.join(', ')}).`)
