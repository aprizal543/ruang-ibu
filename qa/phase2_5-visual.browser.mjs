import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const evidenceDir = 'docs/evidence/phase-2.5-review'
mkdirSync(evidenceDir, { recursive: true })
function browser(...args) {
  return execFileSync('agent-browser.cmd', args, {
    encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, shell: true, windowsHide: true,
  }).trim()
}
function evaluate(expression) {
  const encoded = Buffer.from('JSON.stringify(' + expression + ')', 'utf8').toString('base64')
  let value = JSON.parse(browser('eval', '-b', encoded))
  while (typeof value === 'string' && /^[\[{\"]/.test(value)) {
    try { value = JSON.parse(value) } catch { break }
  }
  if (value === 'true') return true
  if (value === 'false') return false
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  return value
}

browser('connect', '9339')
const articles = [
  ['/terapi/teknik-pernapasan', 't01-breathing'],
  ['/terapi/terapi-musik', 't02-music'],
  ['/terapi/relaksasi-otot-ringan', 't03-body-relaxation'],
  ['/terapi/pijat-pendamping', 't04-companion-massage'],
]

for (const width of [375, 390, 430]) {
  browser('set', 'viewport', String(width), width === 375 ? '812' : width === 390 ? '844' : '932')
  for (const [route] of articles) {
    browser('open', origin + route)
    browser('wait', '--load', 'networkidle')
    assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${route} no overflow at ${width}`)
    assert.equal(browser('get', 'count', 'nav.bottom-tabs'), '1')
    const sourceCount = evaluate("document.querySelectorAll('.therapy-detail__sources li').length")
    assert.ok(sourceCount >= (route.endsWith('relaksasi-otot-ringan') ? 1 : 2), `${route} has its mapped sources`)
    assert.equal(browser('get', 'count', '[data-source-guide]'), '1', `${route} has a source-based patient guide`)
    const clearance = evaluate("(() => { window.scrollTo(0, document.documentElement.scrollHeight); const end = document.querySelector('.therapy-detail__catalog-link').getBoundingClientRect(); const nav = document.querySelector('.bottom-tabs').getBoundingClientRect(); return Math.round(nav.top - end.bottom) })()")
    assert.ok(clearance >= 16, `${route} footer clears the fixed navigation at ${width}px; clearance=${clearance}`)
  }
  browser('open', origin + '/relaksasi')
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `relaxation page no overflow at ${width}`)
  const audioClearance = evaluate("(() => { window.scrollTo(0, document.documentElement.scrollHeight); const end = document.querySelector('.relaxation-page__credit').getBoundingClientRect(); const nav = document.querySelector('.bottom-tabs').getBoundingClientRect(); return Math.round(nav.top - end.bottom) })()")
  assert.ok(audioClearance >= 16, `relaxation page credits clear the fixed navigation at ${width}px`)
}

browser('set', 'viewport', '390', '844')
for (const [route, name] of articles) {
  browser('open', origin + route)
  browser('wait', '--load', 'networkidle')
  browser('screenshot', '--full', `${evidenceDir}/${name}-full-390x844.png`)
}

browser('open', origin + '/relaksasi')
browser('wait', '--load', 'networkidle')
assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)
browser('screenshot', '--full', `${evidenceDir}/relaxation-full-390x844.png`)
browser('click', '[data-audio-track="ambient"]')
browser('screenshot', `${evidenceDir}/relaxation-selected-390x844.png`)
browser('click', '[data-audio-play]')
browser('wait', '500')
assert.equal(evaluate("document.querySelector('audio')?.paused"), false)
browser('screenshot', `${evidenceDir}/audio-playing-390x844.png`)
browser('click', '[data-audio-play]')
assert.equal(evaluate("document.querySelector('audio')?.paused"), true)

for (const [route, name] of [['/', 'homepage'], ['/terapi', 'therapy-catalog']]) {
  browser('open', origin + route)
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)
  if (route === '/') {
    assert.deepEqual(evaluate("[...document.querySelectorAll('.therapy-list a')].map((link) => [link.textContent.trim(), link.getAttribute('href')])"), [
      ['Teknik PernapasanMengenal pilihan napas untuk persiapan dan persalinan.', '/terapi/teknik-pernapasan'],
      ['Musik untuk RelaksasiMengenal musik pilihan Ibu sebagai teman suasana.', '/terapi/terapi-musik'],
      ['Relaksasi TubuhMengenal perhatian lembut pada rasa nyaman tubuh.', '/terapi/relaksasi-otot-ringan'],
      ['Pijat PendampingMengenal sentuhan dengan persetujuan dan kenyamanan Ibu.', '/terapi/pijat-pendamping'],
    ], 'homepage topic links match implemented routes and display titles')
    assert.ok(browser('get', 'text', 'body').includes('Pilihan audio tersedia'))
  }
  if (route === '/terapi') {
    assert.ok(browser('get', 'text', 'body').includes('Musik untuk Relaksasi'))
    assert.ok(browser('get', 'text', 'body').includes('Relaksasi Tubuh'))
  }
  browser('screenshot', `${evidenceDir}/${route === '/' ? 'homepage' : 'therapy-catalog'}-first-regression-390x844.png`)
  browser('screenshot', '--full', `${evidenceDir}/${name}-regression-390x844.png`)
}

console.log('Phase 2.5 visual/browser QA passed at 375, 390 and 430 px; screenshots saved to ' + evidenceDir)
