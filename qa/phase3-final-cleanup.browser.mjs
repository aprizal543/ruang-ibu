import assert from 'node:assert/strict'
import { mkdirSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const evidenceDir = 'docs/evidence/phase-3-final-cleanup'
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

function navigate(path) {
  browser('open', origin + path)
  browser('wait', '--load', 'networkidle')
}

browser('connect', '9339')
const viewports = [[375, 812], [390, 844], [430, 932]]
const therapyRoutes = [
  '/terapi/teknik-pernapasan',
  '/terapi/terapi-musik',
  '/terapi/relaksasi-otot-ringan',
  '/terapi/pijat-pendamping',
]

for (const [width, height] of viewports) {
  browser('set', 'viewport', String(width), String(height))
  for (const route of ['/', '/terapi', ...therapyRoutes, '/hamil', '/bersalin', '/relaksasi']) {
    navigate(route)
    assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${route} no horizontal overflow at ${width}`)
    assert.equal(browser('get', 'count', 'nav.bottom-tabs'), '1', `${route} keeps bottom navigation`)
    assert.equal(evaluate('getComputedStyle(document.querySelector(".bottom-tabs")).position === "fixed"'), true, `${route} bottom navigation remains fixed`)
    if (route === '/terapi' && width === 390) browser('screenshot', `${evidenceDir}/regression-catalog-390x844.png`)
  }
}

browser('set', 'viewport', '390', '844')
for (const route of therapyRoutes) {
  navigate(route)
  assert.equal(evaluate('document.querySelectorAll(".therapy-detail__sources details").length'), 1, `${route} has one source disclosure`)
  assert.equal(evaluate('document.querySelector(".therapy-detail__sources details").open'), false, `${route} source disclosure starts closed`)
  assert.equal(evaluate('document.querySelectorAll(".therapy-detail__guide-sources").length'), 0, `${route} has no inline practice citations`)
  assert.equal(evaluate('[...document.querySelectorAll(".therapy-detail__section, .therapy-detail__safety")].some((node) => /Sumber\\s*:/i.test(node.innerText))'), false, `${route} has no inline source labels`)
  const sourceCount = evaluate('document.querySelectorAll(".therapy-detail__sources .content-disclosure__sources a[href^=http]").length')
  assert.ok(sourceCount > 0, `${route} central source list is populated`)
  const duplicateIds = evaluate('[...document.querySelectorAll(".therapy-detail__sources .content-disclosure__sources li")].map((node) => node.id).filter((id, index, all) => all.indexOf(id) !== index).length')
  assert.equal(duplicateIds, 0, `${route} central references are not duplicated`)
}

for (const [route, target] of [['/hamil', '#guide-bantuan'], ['/bersalin', '#guide-bantuan']]) {
  navigate(route)
  assert.equal(evaluate('document.querySelectorAll(".maternity-guide__source-links").length'), 0, `${route} has no inline reference labels`)
  assert.equal(evaluate('document.querySelector(".maternity-guide__sources details").open'), false, `${route} source disclosure starts closed`)
  assert.equal(evaluate('document.querySelector(".maternity-guide__disclaimer") === null'), true, `${route} has no top disclaimer banner`)
  assert.equal(evaluate('document.querySelector(".maternity-guide__safety-shortcut")?.getAttribute("href")'), target, `${route} offers safety anchor near introduction`)
  assert.equal(evaluate('document.querySelector(".maternity-guide__image-note") === null'), true, `${route} has no visible image caption`)
  assert.ok(evaluate('document.querySelectorAll(".maternity-guide__sources .content-disclosure__sources a[href^=http]").length') >= 5, `${route} sources are centralized`)
}

for (const [width, height] of viewports) {
  browser('set', 'viewport', String(width), String(height))
  navigate('/terapi/teknik-pernapasan')
  browser('eval', '-b', Buffer.from('document.querySelector(".therapy-detail__sources details").open = true; window.scrollTo(0, document.documentElement.scrollHeight); "ok"', 'utf8').toString('base64'))
  const detailClearance = evaluate('Math.round(document.querySelector(".bottom-tabs").getBoundingClientRect().top - document.querySelector(".therapy-detail__catalog-link").getBoundingClientRect().bottom)')
  assert.ok(detailClearance >= 16, `detail footer clears bottom navigation at ${width}; gap=${detailClearance}`)

  navigate('/relaksasi')
  browser('eval', '-b', Buffer.from('document.querySelector("#audio-credits details").open = true; window.scrollTo(0, document.documentElement.scrollHeight); "ok"', 'utf8').toString('base64'))
  const creditClearance = evaluate('Math.round(document.querySelector(".bottom-tabs").getBoundingClientRect().top - document.querySelector("#audio-credits li:last-child").getBoundingClientRect().bottom)')
  assert.ok(creditClearance >= 16, `audio credits clear bottom navigation at ${width}; gap=${creditClearance}`)
}

// Home status cleanup; hero actions and their destinations stay the same.
browser('set', 'viewport', '390', '844')
navigate('/')
assert.equal(evaluate('/Materi dalam peninjauan|Pilihan audio tersedia|Empat topik edukasi yang sedang disiapkan|Materi panduan klinis sedang melalui proses peninjauan/.test(document.body.innerText)'), false)
assert.deepEqual(evaluate('[...document.querySelectorAll(".hero__actions a")].map((a) => [a.innerText.trim(), a.getAttribute("href")])'), [
  ['Jelajahi Terapi', '/terapi'],
  ['Dengarkan Relaksasi', '/relaksasi'],
])
assert.ok(evaluate('document.querySelector("#pilihan-terapi").innerText.includes("Jelajahi empat topik edukasi")'))
assert.ok(evaluate('[...document.querySelectorAll("a[href=\\"/relaksasi\\"]")].some((a) => /Jelajahi Relaksasi|Dengarkan Relaksasi|Jelajahi pilihan audio/.test(a.innerText))'))
browser('screenshot', `${evidenceDir}/homepage-390x844.png`)

// Central sources can be opened and closed by keyboard. The in-article anchor also opens them.
navigate('/terapi/teknik-pernapasan')
browser('screenshot', `${evidenceDir}/therapy-detail-390x844.png`)
browser('eval', '-b', Buffer.from('document.querySelector(".therapy-article__contents a[href=\\"#section-referensi\\"]").click(); "ok"', 'utf8').toString('base64'))
browser('wait', '300')
assert.equal(evaluate('document.querySelector(".therapy-detail__sources details").open'), true, 'source anchor opens the disclosure')
assert.equal(browser('get', 'url').endsWith('#section-referensi'), true, 'source anchor updates URL')
browser('screenshot', `${evidenceDir}/therapy-source-dropdown-390x844.png`)
browser('eval', '-b', Buffer.from('document.querySelector(".therapy-detail__sources summary").focus(); "ok"', 'utf8').toString('base64'))
browser('press', 'Enter')
assert.equal(evaluate('document.querySelector(".therapy-detail__sources details").open'), false, 'source disclosure toggles closed with keyboard')
browser('press', 'Enter')
assert.equal(evaluate('document.querySelector(".therapy-detail__sources details").open'), true, 'source disclosure toggles open with keyboard')

// Safety shortcuts navigate and retain the complete warning block.
for (const route of ['/hamil', '/bersalin']) {
  navigate(route)
  browser('eval', '-b', Buffer.from('document.querySelector(".maternity-guide__safety-shortcut").click(); "ok"', 'utf8').toString('base64'))
  browser('wait', '300')
  assert.equal(browser('get', 'url').endsWith('#guide-bantuan'), true, `${route} safety shortcut navigates to the section`)
  assert.ok(evaluate('document.querySelector("#guide-bantuan").innerText.length > 100'), `${route} safety information remains present`)
}
for (const [route, filename] of [['/hamil', 'hamil'], ['/bersalin', 'bersalin']]) {
  navigate(route)
  browser('screenshot', `${evidenceDir}/${filename}-390x844.png`)
}

// Audio credits remain complete, collapsed by default, and playback behavior is intact.
navigate('/relaksasi')
assert.equal(evaluate('document.querySelector("#audio-credits details").open'), false)
assert.equal(evaluate('document.querySelectorAll("#audio-credits .content-disclosure__body li").length'), 3)
browser('screenshot', `${evidenceDir}/relaxation-390x844.png`)
browser('click', '[data-audio-track="rain"]')
assert.equal(evaluate('document.querySelector("audio")?.paused'), true, 'audio does not autoplay on track selection')
browser('click', '[data-audio-play]')
browser('wait', '700')
assert.equal(evaluate('document.querySelector("audio")?.paused'), false, 'audio playback still works')
browser('click', '[data-audio-play]')
assert.equal(evaluate('document.querySelector("audio")?.paused'), true, 'audio can be paused')
browser('eval', '-b', Buffer.from('document.querySelector("#audio-credits details").open = true; document.querySelector("#audio-credits").scrollIntoView({ block: "start" }); "ok"', 'utf8').toString('base64'))
assert.equal(evaluate('document.querySelector("#audio-credits details").open'), true)
assert.ok(evaluate('document.querySelector("#audio-credits").innerText.includes("sound-of-light-rainfall.ogg")'))
assert.ok(evaluate('document.querySelector("#audio-credits").innerText.includes("water-on-rocks.ogg")'))
assert.ok(evaluate('document.querySelector("#audio-credits").innerText.includes("ambient-music-test-yamaha-ck61.flac")'))
assert.ok(evaluate('document.querySelector("#audio-credits").innerText.includes("CC BY-SA 4.0")'))
assert.ok(evaluate('document.querySelector("#audio-credits").innerText.includes("Ketentuan ShareAlike dicatat untuk audio ini saja, bukan seluruh aplikasi")'))
assert.equal(evaluate('document.querySelectorAll("#audio-credits a[href^=http]").length'), 6, 'each recording keeps source and license links')
browser('screenshot', `${evidenceDir}/audio-credits-dropdown-390x844.png`)

console.log(`Phase 3 final cleanup QA passed at 375x812, 390x844, and 430x932; evidence saved to ${evidenceDir}`)
