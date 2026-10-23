import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const evidenceDir = 'docs/evidence/phase-3-guides'
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
const guides = [
  { path: '/hamil', title: 'Panduan Ibu Hamil', navLabel: 'Hamil', navIndex: 3, file: 'hamil' },
  { path: '/bersalin', title: 'Panduan Bersalin', navLabel: 'Bersalin', navIndex: 4, file: 'bersalin' },
]
const sizes = [[375, 812], [390, 844], [430, 932]]

for (const [width, height] of sizes) {
  browser('set', 'viewport', String(width), String(height))
  for (const guide of guides) {
    browser('open', origin + guide.path)
    browser('wait', '--load', 'networkidle')
    assert.equal(browser('get', 'text', 'h1'), guide.file === 'hamil' ? 'Mempersiapkan Diri dengan Lebih Tenang' : 'Mendampingi Setiap Langkah Persalinan')
    assert.equal(browser('get', 'text', `.bottom-tabs__item:nth-child(${guide.navIndex}) span`), guide.navLabel)
    assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${guide.path} has no horizontal overflow at ${width}`)
    assert.equal(evaluate('document.querySelector(".maternity-guide__hero img")?.complete && document.querySelector(".maternity-guide__hero img")?.naturalWidth > 0'), true, `${guide.path} hero loaded at ${width}`)
    assert.equal(evaluate('document.querySelector(".maternity-guide__safety")?.getAttribute("aria-labelledby") === document.querySelector(".maternity-guide__safety h2")?.id'), true, `${guide.path} safety heading is labelled`)
    assert.ok(evaluate('document.querySelectorAll(".maternity-guide__sources a[href^=http]").length') >= 5, `${guide.path} has linked sources`)
    assert.equal(browser('get', 'count', `.bottom-tabs__item:nth-child(${guide.navIndex}).is-active`), '1', `${guide.path} marks correct navigation tab active`)

    if (guide.path === '/hamil') {
      assert.equal(evaluate('document.querySelectorAll("a[href=\\"/terapi/teknik-pernapasan\\"]").length'), 1)
      assert.equal(evaluate('document.querySelectorAll("a[href=\\"/terapi/terapi-musik\\"]").length'), 1)
      assert.equal(evaluate('document.querySelectorAll("a[href=\\"/terapi/relaksasi-otot-ringan\\"]").length'), 1)
    } else {
      assert.equal(evaluate('document.querySelectorAll("a[href=\\"/terapi/pijat-pendamping\\"]").length'), 1)
      assert.ok(browser('get', 'text', 'body').includes('air ketuban pecah'))
    }
    assert.equal(evaluate('document.querySelectorAll(".maternity-guide__audio-callout[href=\\"/relaksasi\\"]").length'), 1)

    browser('eval', '-b', Buffer.from('window.scrollTo(0, document.documentElement.scrollHeight); "ok"', 'utf8').toString('base64'))
    const clearance = evaluate('(() => { const end = document.querySelector(".maternity-guide__sources li:last-child")?.getBoundingClientRect(); const nav = document.querySelector(".bottom-tabs")?.getBoundingClientRect(); return end && nav ? Math.round(nav.top - end.bottom) : -999 })()')
    assert.ok(clearance >= 16, `${guide.path} footer clears fixed navigation at ${width}; clearance=${clearance}`)
  }
}

browser('set', 'viewport', '390', '844')
for (const guide of guides) {
  browser('open', origin + guide.path)
  browser('wait', '--load', 'networkidle')
  browser('screenshot', `${evidenceDir}/${guide.file}-first-390x844.png`)
  browser('screenshot', '--full', `${evidenceDir}/${guide.file}-full-390x844.png`)
}

// Check the new bottom-tab destinations and browser history without changing the shared layout.
browser('open', origin + '/')
browser('wait', '--load', 'networkidle')
browser('eval', '-b', Buffer.from('document.querySelector(".bottom-tabs a:nth-child(3)").click(); "ok"', 'utf8').toString('base64'))
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'url'), origin + '/hamil')
browser('back')
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'url'), origin + '/')

browser('open', origin + '/hamil')
browser('wait', '--load', 'networkidle')
browser('press', 'Tab')
assert.equal(evaluate('document.activeElement.classList.contains("maternity-guide__skip")'), true, 'skip link is first keyboard stop')
browser('press', 'Tab')
assert.equal(evaluate('document.activeElement.closest(".maternity-guide__header") !== null'), true, 'header back control is keyboard reachable')

// Approved-page regression smoke: routes still render and have no horizontal overflow.
for (const route of ['/', '/terapi', '/terapi/teknik-pernapasan', '/relaksasi']) {
  browser('open', origin + route)
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${route} has no horizontal overflow`)
  const name = route === '/' ? 'homepage' : route.slice(1).replaceAll('/', '-')
  browser('screenshot', `${evidenceDir}/regression-${name}-390x844.png`)
}

// Check the user-requested direct routes and legacy aliases.
for (const [route, heading] of [['/hamil', 'Mempersiapkan Diri dengan Lebih Tenang'], ['/panduan/hamil', 'Mempersiapkan Diri dengan Lebih Tenang'], ['/bersalin', 'Mendampingi Setiap Langkah Persalinan'], ['/panduan/bersalin', 'Mendampingi Setiap Langkah Persalinan']]) {
  browser('open', origin + route)
  browser('wait', '--load', 'networkidle')
  assert.equal(browser('get', 'text', 'h1'), heading, `${route} resolves directly`)
}

console.log(`Phase 3 browser QA passed: 375x812, 390x844, 430x932; evidence saved to ${evidenceDir}`)
