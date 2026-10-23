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

const articles = [
  {
    route: '/terapi/teknik-pernapasan',
    title: 'Teknik Pernapasan',
    categories: ['Kehamilan', 'Saat persalinan'],
    sources: [
      'https://www.who.int/publications/i/item/9789241550215',
      'https://www.nice.org.uk/guidance/ng235/chapter/Recommendations',
      'https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour',
      'https://www.nhs.uk/pregnancy/mental-health-in-pregnancy-and-after-the-birth/anxiety-in-pregnancy/',
    ],
    requiredCopy: [
      'Saat hamil, latihan pernapasan dan meditasi dapat menjadi pilihan perawatan diri ketika Ibu merasa cemas.',
      'tidak menentukan latihan yang sesuai untuk kondisi Ibu',
      'Bagi ibu hamil sehat yang menginginkan dukungan untuk menghadapi nyeri saat persalinan',
    ],
  },
  {
    route: '/terapi/terapi-musik',
    title: 'Terapi Musik',
    categories: ['Saat persalinan'],
    sources: [
      'https://www.who.int/publications/i/item/9789241550215',
      'https://www.nice.org.uk/guidance/ng235/chapter/Recommendations',
      'https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour',
      'https://www.nccih.nih.gov/health/music-and-health-what-you-need-to-know',
    ],
    requiredCopy: [
      'bukan layanan terapi musik klinis',
      'Mendengarkan musik tidak menjamin nyeri berkurang.',
      'Manfaatnya belum dapat dipastikan',
    ],
  },
  {
    route: '/terapi/relaksasi-otot-ringan',
    title: 'Relaksasi Otot Ringan',
    categories: ['Relaksasi'],
    sources: [
      'https://www.who.int/publications/i/item/9789241550215',
      'https://www.cochrane.org/evidence/CD009514_relaxation-techniques-pain-management-labour',
    ],
    requiredCopy: [
      'sumber yang tersedia belum cukup untuk memastikan manfaat atau kesesuaiannya bagi setiap Ibu',
      'belum menjelaskan pendekatan ini dengan cukup jelas',
      'berbeda dari teknik relaksasi otot progresif',
      'belum memastikan manfaat atau kesesuaiannya',
    ],
  },
  {
    route: '/terapi/pijat-pendamping',
    title: 'Pijat Pendamping',
    categories: ['Saat persalinan'],
    sources: [
      'https://www.who.int/publications/i/item/9789241550215',
      'https://www.nice.org.uk/guidance/ng235/chapter/Recommendations',
      'https://pubmed.ncbi.nlm.nih.gov/29589380/',
      'https://www.nhs.uk/pregnancy/labour-and-birth/pain-relief-in-labour/',
    ],
    requiredCopy: [
      'Ibu berhak menolak atau meminta sentuhan dihentikan kapan saja.',
      'pendamping perlu lebih dahulu diajari teknik yang akan digunakan',
      'tidak memberi arahan tentang lokasi, tekanan, durasi, atau teknik pijat',
    ],
  },
]

for (const article of articles) {
  browser('open', `${origin}${article.route}`)
  assert.equal(browser('get', 'text', 'h1'), article.title)
  assert.deepEqual(evaluate("[...document.querySelectorAll('.therapy-article__categories li')].map((node) => node.textContent.trim())"), article.categories)

  const body = browser('get', 'text', 'body')
  for (const copy of ['Materi masih berupa draf', 'Belum ditinjau oleh tenaga kesehatan', ...article.requiredCopy]) {
    assert.ok(body.includes(copy), `${article.title} includes ${copy}`)
  }
  assert.equal(browser('get', 'count', '[data-locked-guide]'), '1', `${article.title} practice remains locked`)
  assert.equal(browser('get', 'count', '.therapy-detail__practice-steps'), '0', `${article.title} has no published steps`)
  assert.deepEqual(evaluate("[...document.querySelectorAll('.therapy-detail__source a')].map((link) => link.href)"), article.sources, `${article.title} source links match claim mapping`)
  assert.equal(browser('get', 'count', 'details[data-source-details]'), '1', `${article.title} keeps the source disclosure`)
  assert.equal(evaluate("document.querySelector('summary')?.tabIndex"), 0, `${article.title} source disclosure is keyboard-focusable`)
  browser('focus', 'summary')
  browser('press', 'Space')
  assert.equal(evaluate("document.querySelector('details[data-source-details]').open"), true, `${article.title} source disclosure opens`)
  assert.equal(browser('get', 'count', 'nav.bottom-tabs'), '1', `${article.title} keeps bottom navigation`)
  assert.equal(browser('get', 'attr', 'a.bottom-tabs__item:nth-child(2)', 'aria-current'), 'page')
  assert.equal(evaluate("document.querySelectorAll('.therapy-article__contents a').length"), 5)
}

browser('open', `${origin}/terapi`)
for (const [filterIndex, filter, expected] of [
  [1, 'Hamil', ['/terapi/teknik-pernapasan']],
  [2, 'Bersalin', ['/terapi/teknik-pernapasan', '/terapi/terapi-musik', '/terapi/pijat-pendamping']],
  [3, 'Relaksasi', ['/terapi/teknik-pernapasan', '/terapi/terapi-musik', '/terapi/relaksasi-otot-ringan']],
]) {
  browser('click', `.therapy-filter:nth-child(${filterIndex + 1})`)
  assert.deepEqual(evaluate("[...document.querySelectorAll('.therapy-row')].map((row) => row.getAttribute('href'))"), expected, `${filter} filter has source-aligned therapy rows`)
}

for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  browser('set', 'viewport', String(width), String(height))
  for (const article of articles) {
    browser('open', `${origin}${article.route}`)
    assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${article.title} has no horizontal overflow at ${width}px`)
    const clearance = evaluate("(() => { window.scrollTo(0, document.documentElement.scrollHeight); const c = document.querySelector('.therapy-detail__catalog-link').getBoundingClientRect(); const n = document.querySelector('.bottom-tabs').getBoundingClientRect(); return Math.round(n.top - c.bottom) })()")
    assert.ok(clearance >= 24, `${article.title} footer clears bottom nav at ${width}px`)
  }
}

console.log('Phase 2.4 content/browser checks passed: source scope, article copy, categories, locked practice, navigation, responsive overflow, and footer clearance.')
