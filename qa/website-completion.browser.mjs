import assert from 'node:assert/strict'
import { mkdirSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://localhost:5175'
const cdpPort = process.env.RUANG_IBU_CDP ?? '9222'
const evidenceDir = 'docs/evidence/website-completion'
mkdirSync(evidenceDir, { recursive: true })

function browser(...args) {
  return execFileSync('agent-browser.cmd', ['--cdp', cdpPort, ...args], { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, shell: true, windowsHide: true }).trim()
}

function evaluate(expression) {
  const encoded = Buffer.from(`JSON.stringify(${expression})`, 'utf8').toString('base64')
  let value = JSON.parse(browser('eval', '-b', encoded))
  while (typeof value === 'string' && /^[\[{\"]/.test(value)) {
    try { value = JSON.parse(value) } catch { break }
  }
  if (value === 'true') return true
  if (value === 'false') return false
  return value
}

const failures = []
function check(name, assertion) {
  try { assertion() } catch (error) { failures.push(`${name}: ${error.message}`) }
}

browser('open', `${origin}/`)
browser('wait', '--load', 'networkidle')
browser('set', 'viewport', '390', '844')
check('home exposes an enabled menu button', () => assert.equal(evaluate('(() => { const b=document.querySelector(".menu-button"); return Boolean(b && !b.disabled && b.getAttribute("aria-label") === "Buka menu") })()'), true))

const menuButtonCount = Number(browser('get', 'count', '.menu-button:not(:disabled)'))
if (menuButtonCount === 1) {
  browser('click', '.menu-button')
  browser('wait', '--text', 'Tentang Ruang Ibu')
  check('menu opens as a modal navigation', () => assert.equal(evaluate('Boolean(document.querySelector("[role=dialog][aria-modal=true]"))'), true))
  check('menu receives focus and locks background scroll', () => assert.equal(evaluate('document.activeElement.getAttribute("aria-label") === "Tutup menu" && document.body.style.overflow === "hidden"'), true))
  check('menu exposes all primary and secondary destinations', () => {
    const hrefs = evaluate('[...document.querySelectorAll(".site-menu a")].map(a => new URL(a.href).pathname)')
    for (const path of ['/', '/terapi', '/hamil', '/bersalin', '/relaksasi', '/evaluasi', '/tentang', '/sumber', '/faq', '/tanda-bahaya']) assert.ok(hrefs.includes(path), `missing menu destination ${path}`)
  })
  browser('press', 'Shift+Tab')
  browser('press', 'Shift+Tab')
  check('keyboard focus wraps from the first menu control to the last', () => assert.equal(evaluate('document.activeElement.getAttribute("href") === "/tanda-bahaya"'), true))
  browser('press', 'Tab')
  check('keyboard focus wraps from the last menu control to the first', () => assert.equal(evaluate('document.activeElement.matches(".site-menu__header .brand-lockup")'), true))
  browser('press', 'Escape')
  check('Escape closes the menu and restores focus', () => assert.equal(evaluate('!document.querySelector("[role=dialog]") && document.activeElement.matches(".menu-button")'), true))
}

for (const [path, headerTitle] of [
  ['/tentang', 'Tentang Ruang Ibu'],
  ['/sumber', 'Sumber Informasi'],
  ['/faq', 'Tanya Jawab'],
  ['/tanda-bahaya', 'Tanda Bahaya'],
]) {
  browser('open', `${origin}${path}`)
  browser('wait', '--load', 'networkidle')
  check(`${path} direct route is implemented`, () => {
    assert.equal(browser('get', 'text', '.information-page__header'), headerTitle)
    assert.notEqual(browser('get', 'text', 'h1'), 'Halaman ini sedang disiapkan')
  })
  check(`${path} has the six-destination tab navigation`, () => assert.equal(Number(evaluate('document.querySelectorAll(".bottom-tabs__item").length')), 6))
  if (path === '/tentang') browser('screenshot', `${evidenceDir}/tentang-390x844.png`)
}

browser('open', `${origin}/`)
browser('wait', '--load', 'networkidle')
check('home footer links to safety, sources, about, and FAQ', () => {
  const hrefs = evaluate('[...document.querySelectorAll(".home-safety-footer__links a")].map(a => new URL(a.href).pathname)')
  for (const path of ['/tanda-bahaya', '/sumber', '/tentang', '/faq']) assert.ok(hrefs.includes(path), `missing footer destination ${path}`)
})

const appRoutes = [
  '/', '/terapi', '/terapi/teknik-pernapasan', '/terapi/terapi-musik',
  '/terapi/relaksasi-otot-ringan', '/terapi/pijat-pendamping', '/hamil', '/bersalin',
  '/relaksasi', '/relaksasi/rain', '/relaksasi/waves', '/relaksasi/ambient',
  '/relaksasi/gymnopedie', '/relaksasi/years-grow-quiet', '/relaksasi/wholesome',
  '/relaksasi/avec-soin', '/relaksasi/friday-morning', '/evaluasi',
]
for (const path of appRoutes) {
  browser('open', `${origin}${path}`)
  browser('wait', '--load', 'networkidle')
  check(`${path} direct route renders its page`, () => {
    assert.equal(evaluate('document.querySelectorAll("h1").length > 0'), true)
    assert.equal(evaluate('document.body.innerText.includes("Halaman ini tidak tersedia")'), false)
  })
  if (!path.startsWith('/relaksasi/')) {
    check(`${path} retains six-tab navigation`, () => assert.equal(Number(evaluate('document.querySelectorAll(".bottom-tabs__item").length')), 6))
  }
}

if (menuButtonCount === 1) {
  browser('open', `${origin}/`)
  browser('wait', '--load', 'networkidle')
  browser('set', 'viewport', '390', '844')
  browser('click', '.menu-button')
  browser('wait', '--text', 'Tentang Ruang Ibu')
  browser('screenshot', `${evidenceDir}/menu-390x844.png`)
  const menuSnapshot = browser('snapshot', '-i', '-u')
  const aboutRefs = [...menuSnapshot.matchAll(/\[ref=(e\d+),[^\]]*url=[^\]]*\/tentang/g)]
  const aboutMenuRef = aboutRefs.at(-1)?.[1]
  assert.ok(aboutMenuRef, 'about link in menu should be exposed to browser accessibility tree')
  browser('click', `@${aboutMenuRef}`)
  check('menu link navigates internally and closes', () => {
    assert.equal(browser('get', 'url'), `${origin}/tentang`)
    assert.equal(evaluate('!document.querySelector("[role=dialog]")'), true)
  })
}

for (const [width, height] of [[375, 812], [390, 844], [430, 932], [1280, 720], [1440, 900]]) {
  browser('open', `${origin}/`)
  browser('wait', '--load', 'networkidle')
  browser('set', 'viewport', String(width), String(height))
  check(`home and primary navigation fit ${width}x${height}`, () => assert.equal(evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true))
  if (menuButtonCount === 1) {
    browser('click', '.menu-button')
    check(`menu opens at ${width}x${height}`, () => assert.equal(evaluate('Boolean(document.querySelector("[role=dialog]"))'), true))
    check(`menu has no horizontal overflow at ${width}x${height}`, () => assert.equal(evaluate('document.documentElement.scrollWidth <= window.innerWidth'), true))
    check(`menu safety destination is reachable at ${width}x${height}`, () => {
      const reachability = evaluate('(() => { const menu=document.querySelector(".site-menu"); const safety=document.querySelector(".site-menu__safety"); menu.scrollTop=menu.scrollHeight; const rect=safety.getBoundingClientRect(); return {overflowY:getComputedStyle(menu).overflowY, href:safety.getAttribute("href"), visible:rect.top>=0 && rect.bottom<=innerHeight+1} })()')
      assert.equal(reachability.overflowY, 'auto')
      assert.equal(reachability.href, '/tanda-bahaya')
      assert.equal(reachability.visible, true)
    })
    if (width === 1440) browser('screenshot', `${evidenceDir}/menu-desktop-1440x900.png`)
    browser('press', 'Escape')
  }
}

if (failures.length) {
  for (const failure of failures) process.stderr.write(`FAIL ${failure}\n`)
  process.exitCode = 1
} else {
  process.stdout.write(`Website completion browser QA passed; evidence saved to ${evidenceDir}\n`)
}
