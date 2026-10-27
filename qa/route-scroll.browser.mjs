import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
const cdpPort = process.env.AGENT_BROWSER_CDP_PORT ?? '9339'
browser('errors', '--clear')

function browser(...args) {
  return execFileSync('agent-browser.cmd', ['--cdp', cdpPort, ...args], {
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    shell: true,
    windowsHide: true,
  }).trim()
}

function evaluate(expression) {
  const encoded = Buffer.from(`JSON.stringify(${expression})`, 'utf8').toString('base64')
  const value = JSON.parse(browser('eval', '-b', encoded))
  return typeof value === 'string' ? JSON.parse(value) : value
}

function assertNoOverflow(width) {
  assert.equal(
    evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'),
    true,
    `No horizontal overflow at ${width}px`,
  )
}

function wait(milliseconds) {
  return new Promise((resolveWait) => setTimeout(resolveWait, milliseconds))
}

browser('set', 'viewport', '390', '844')
browser('open', `${origin}/terapi`)
const articles = evaluate(`[...document.querySelectorAll('a.therapy-row')].map((link) => ({
  title: link.querySelector('.therapy-row__title').textContent.trim(),
  href: link.getAttribute('href'),
}))`)
assert.equal(articles.length, 11, 'The therapy catalog still has all 11 articles')
assert.equal(new Set(articles.map((article) => article.href)).size, 11, 'Each therapy card has a distinct destination')

const catalogPosition = evaluate(`(() => {
  window.scrollTo(0, document.documentElement.scrollHeight)
  return window.scrollY
})()`)
assert.ok(catalogPosition > 400, 'The catalog can be scrolled to lower articles')

browser('click', 'a.therapy-row:nth-of-type(8)')
assert.equal(browser('get', 'url'), `${origin}/terapi/kompres-hangat-persalinan`)
const detailPosition = evaluate(`({
  scrollY: window.scrollY,
  titleTop: document.querySelector('#therapy-detail-title').getBoundingClientRect().top,
})`)
assert.ok(detailPosition.scrollY <= 1, `PUSH navigation should reset to the top, got ${detailPosition.scrollY}`)
assert.ok(detailPosition.titleTop >= 68 && detailPosition.titleTop < 180, `The article title should be visible below the header, got ${detailPosition.titleTop}px`)

browser('back')
assert.equal(browser('get', 'url'), `${origin}/terapi`)
const returnedPosition = evaluate('window.scrollY')
assert.ok(Math.abs(returnedPosition - catalogPosition) <= 3, `Back should restore the catalog position (${catalogPosition}), got ${returnedPosition}`)
mkdirSync(resolve('docs/evidence/m1-ux'), { recursive: true })
browser('screenshot', resolve('docs/evidence/m1-ux/catalog-return-390x844.png'))

for (const article of articles) {
  browser('open', `${origin}${article.href}`)
  assert.equal(browser('get', 'text', 'h1'), article.title, `${article.href} opens the matching article`)
  const articleState = evaluate(`(() => {
    const ids = [...document.querySelectorAll('[id]')].map((node) => node.id)
    return {
      scrollY: window.scrollY,
      titleTop: document.querySelector('#therapy-detail-title').getBoundingClientRect().top,
      duplicateIds: ids.filter((id, index) => ids.indexOf(id) !== index),
    }
  })()`)
  assert.ok(articleState.scrollY <= 1, `Direct visit to ${article.href} starts at the top`)
  assert.ok(articleState.titleTop >= 68 && articleState.titleTop < 180, `Direct visit to ${article.href} shows its heading`)
  assert.deepEqual(articleState.duplicateIds, [], `${article.href} has no duplicate section IDs`)
}

browser('open', `${origin}/terapi`)
for (const [index, count] of [[1, 6], [2, 6], [3, 5], [0, 11]]) {
  browser('click', `.therapy-filter:nth-child(${index + 1})`)
  assert.equal(browser('get', 'count', 'a.therapy-row'), String(count), `Filter ${index} returns ${count} articles`)
}
browser('open', `${origin}/terapi`)
evaluate('(() => { window.scrollTo(0, 100); return window.scrollY })()')
browser('click', '.therapy-filter:nth-child(2)')
assert.equal(evaluate('window.scrollY'), 100, 'Changing the filter does not reset the current scroll')
evaluate('(() => { window.scrollTo(0, 0); return true })()')
browser('click', '.therapy-header__control:nth-child(3)')
evaluate('(() => { window.scrollTo(0, 100); return true })()')
browser('fill', 'input', 'e')
assert.equal(evaluate('window.scrollY'), 100, 'Typing a search query does not reset the current scroll')

browser('open', `${origin}/terapi?kategori=hamil`)
browser('click', '.therapy-header__control:nth-child(3)')
browser('fill', 'input', 'kompres')
assert.equal(browser('get', 'url'), `${origin}/terapi?kategori=hamil&q=kompres`)
assert.equal(browser('get', 'count', 'a.therapy-row'), '1', 'Hamil and search filters combine')
browser('click', 'a.therapy-row')
assert.equal(browser('get', 'text', 'h1'), 'Kompres Hangat Saat Hamil')
browser('back')
assert.equal(browser('get', 'url'), `${origin}/terapi?kategori=hamil&q=kompres`)
assert.equal(browser('get', 'value', 'input'), 'kompres')
assert.equal(browser('get', 'attr', 'button.therapy-filter:nth-child(2)', 'aria-pressed'), 'true')

browser('forward')
assert.equal(browser('get', 'text', 'h1'), 'Kompres Hangat Saat Hamil', 'Forward returns to the same article')
assert.ok(evaluate('window.scrollY') <= 1, 'Forward restores the detail page at its saved top position')

browser('open', `${origin}/relaksasi`)
browser('click', '.relaxation-track__open')
assert.equal(browser('get', 'url'), `${origin}/relaksasi/rain`, 'Selecting a relaxation track opens its player')
browser('click', '.immersive-player__play')
await wait(650)
assert.equal(evaluate('document.querySelector("audio").paused'), false, 'Selected audio starts only after a user action')
const playbackPosition = evaluate('document.querySelector("audio").currentTime')
browser('back')
await wait(250)
assert.equal(browser('get', 'url'), `${origin}/relaksasi`, 'Back returns from the player to its catalog')
assert.equal(evaluate('document.querySelector("audio").paused'), false, 'Catalog navigation leaves active playback running')
assert.ok(evaluate('document.querySelector("audio").currentTime') > playbackPosition, 'Audio continues advancing after browser Back')
browser('forward')
assert.equal(browser('get', 'url'), `${origin}/relaksasi/rain`, 'Forward returns to the same player')
assert.equal(evaluate('document.querySelector("audio").paused'), false, 'Forward navigation preserves active playback')
browser('click', '.immersive-player__play')
browser('open', `${origin}/terapi/teknik-pernapasan`)

for (const hash of [
  '#section-pengertian',
  '#section-tujuan',
  '#section-kapan-dipertimbangkan',
  '#section-keselamatan',
  '#section-referensi',
]) {
  evaluate(`(() => {
    [...document.querySelectorAll('.therapy-article__contents a')]
      .find((link) => new URL(link.href).hash === ${JSON.stringify(hash)})
      .click()
    return true
  })()`)
  const targetState = evaluate(`(() => {
    const target = document.getElementById(${JSON.stringify(hash.slice(1))})
    return {
      hash: location.hash,
      top: target.getBoundingClientRect().top,
      sourceOpen: target.id === 'section-referensi' ? target.querySelector('details').open : null,
    }
  })()`)
  assert.equal(targetState.hash, hash, `${hash} sets the matching URL fragment`)
  assert.ok(targetState.top >= 0 && targetState.top < 744, `${hash} is visible and not clipped above the viewport`)
  if (hash === '#section-referensi') assert.equal(targetState.sourceOpen, true, 'The source disclosure opens with its anchor')
}
browser('screenshot', resolve('docs/evidence/m1-ux/article-source-anchor-390x844.png'))

browser('open', `${origin}/terapi/teknik-pernapasan#section-referensi`)
assert.equal(evaluate("document.querySelector('#section-referensi details').open"), true, 'A direct source hash opens its disclosure')
assert.ok(evaluate("document.querySelector('#section-referensi').getBoundingClientRect().top >= 0"), 'A direct source hash scrolls to the source section')

browser('open', `${origin}/terapi/teknik-pernapasan`)
evaluate("(() => { [...document.querySelectorAll('.therapy-article__contents a')].find(link => new URL(link.href).hash === '#section-tujuan').click(); return true })()")
browser('back')
assert.equal(browser('get', 'url'), `${origin}/terapi/teknik-pernapasan`, 'Back from an article anchor returns to the prior scroll state')
assert.ok(evaluate('window.scrollY') <= 1, 'Back from an anchor restores its top position')
browser('forward')
assert.equal(browser('get', 'url'), `${origin}/terapi/teknik-pernapasan#section-tujuan`, 'Forward restores the article anchor')
assert.equal(evaluate('location.hash'), '#section-tujuan')

browser('open', `${origin}/terapi/teknik-pernapasan`)
browser('press', 'Tab')
assert.ok(evaluate('document.activeElement.classList.contains("skip-link")'), 'Keyboard reaches the skip link first')
let firstArticleAnchorFocused = false
for (let tab = 0; tab < 6 && !firstArticleAnchorFocused; tab += 1) {
  browser('press', 'Tab')
  firstArticleAnchorFocused = evaluate('document.activeElement.matches(".therapy-article__contents a")')
}
assert.ok(firstArticleAnchorFocused, 'Keyboard reaches the first article anchor after preceding focusable links')
browser('press', 'Enter')
assert.equal(evaluate('location.hash'), '#section-pengertian', 'Keyboard activates an article anchor')
browser('open', `${origin}/terapi/teknik-pernapasan`)
browser('press', 'Tab')
browser('press', 'Tab')
browser('press', 'Enter')
assert.equal(browser('get', 'url'), `${origin}/terapi`, 'Keyboard activates the article back link')

for (const [width, height] of [[360, 800], [375, 812], [390, 844], [430, 932], [1440, 900]]) {
  browser('set', 'viewport', String(width), String(height))
  browser('open', `${origin}/terapi/teknik-pernapasan`)
  assertNoOverflow(width)
  const clearance = evaluate(`(() => {
    window.scrollTo(0, document.documentElement.scrollHeight)
    const link = document.querySelector('.therapy-detail__catalog-link').getBoundingClientRect()
    const nav = document.querySelector('.bottom-tabs').getBoundingClientRect()
    return { linkBottom: link.bottom, navTop: nav.top }
  })()`)
  assert.ok(clearance.linkBottom <= clearance.navTop, `The final article link clears bottom navigation at ${width}px`)
}

browser('set', 'media', 'light', 'reduced-motion')
assert.equal(evaluate("matchMedia('(prefers-reduced-motion: reduce)').matches"), true, 'Reduced motion is enabled in the browser')
assert.equal(evaluate("getComputedStyle(document.documentElement).scrollBehavior"), 'auto', 'Reduced motion avoids smooth document scrolling')

const mainTabs = [
  ['/', 'Beranda'],
  ['/terapi', 'Jenis Terapi'],
  ['/hamil', 'Panduan Ibu Hamil'],
  ['/bersalin', 'Panduan Bersalin'],
  ['/relaksasi', 'Relaksasi'],
  ['/evaluasi', 'Evaluasi'],
]
for (const [path, expectedHeading] of mainTabs) {
  browser('open', `${origin}/`)
  evaluate(`(() => {
    [...document.querySelectorAll('.bottom-tabs__item')]
      .find((link) => link.getAttribute('href') === ${JSON.stringify(path)})
      .click()
    return true
  })()`)
  assert.equal(browser('get', 'url'), `${origin}${path}`)
  assert.equal(browser('get', 'count', '.bottom-tabs__item[aria-current="page"]'), '1')
  if (path !== '/relaksasi') {
    assert.ok(browser('get', 'text', 'body').includes(expectedHeading), `${path} route renders ${expectedHeading}`)
  }
}

for (const path of [
  '/panduan/hamil',
  '/panduan/bersalin',
  '/tentang',
  '/sumber',
  '/faq',
  '/tanda-bahaya',
  '/relaksasi/rain',
]) {
  browser('open', `${origin}${path}`)
  assert.equal(browser('get', 'count', 'h1'), '1', `${path} renders one page heading`)
  assert.notEqual(browser('get', 'text', 'h1'), 'Halaman ini tidak tersedia.', `${path} remains a valid route`)
}

browser('set', 'viewport', '390', '844')
browser('open', `${origin}/evaluasi`)
const evaluationStorageBefore = evaluate(`({
  local: JSON.stringify(Object.entries(localStorage).sort()),
  session: JSON.stringify(Object.entries(sessionStorage).sort()),
})`)
evaluate(`(() => {
  window.__m1EvaluationTraffic = []
  const originalFetch = window.fetch.bind(window)
  window.fetch = (...args) => { window.__m1EvaluationTraffic.push(['fetch', String(args[0])]); return originalFetch(...args) }
  const originalXhrOpen = XMLHttpRequest.prototype.open
  XMLHttpRequest.prototype.open = function (method, url, ...args) {
    window.__m1EvaluationTraffic.push(['xhr', String(url)])
    return originalXhrOpen.call(this, method, url, ...args)
  }
  const originalBeacon = navigator.sendBeacon?.bind(navigator)
  Object.defineProperty(navigator, 'sendBeacon', {
    configurable: true,
    value: (...args) => { window.__m1EvaluationTraffic.push(['beacon', String(args[0])]); return originalBeacon?.(...args) ?? false },
  })
  const setValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set
  for (const [id, score] of [['comfort-score', '6'], ['anxiety-score', '4']]) {
    const input = document.getElementById(id)
    setValue.call(input, score)
    input.dispatchEvent(new Event('input', { bubbles: true }))
    input.dispatchEvent(new Event('change', { bubbles: true }))
  }
  return true
})()`)
browser('click', '#evaluation-submit')
assert.ok(browser('get', 'text', 'body').includes('6/10'))
assert.ok(browser('get', 'text', 'body').includes('4/10'))
const evaluationPrivacyAfter = evaluate(`({
  local: JSON.stringify(Object.entries(localStorage).sort()),
  session: JSON.stringify(Object.entries(sessionStorage).sort()),
  traffic: window.__m1EvaluationTraffic,
})`)
assert.equal(evaluationPrivacyAfter.local, evaluationStorageBefore.local, 'Evaluation does not write localStorage')
assert.equal(evaluationPrivacyAfter.session, evaluationStorageBefore.session, 'Evaluation scores do not enter sessionStorage')
assert.deepEqual(evaluationPrivacyAfter.traffic, [], 'Evaluation scores do not trigger fetch, XHR, or beacon requests')

browser('open', `${origin}/terapi`)
for (const width of [360, 375, 390, 430, 1440]) assertNoOverflow(width)
assert.equal(browser('errors'), '', 'No browser page errors occur during the route regression')

console.log('Route scroll browser regression passed: catalog routes, anchors, browser history, filters/search, keyboard, reduced motion, navigation, viewport overflow, and bottom-nav clearance.')
