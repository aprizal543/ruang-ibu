import assert from 'node:assert/strict'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://localhost:5174'
const cdpPort = Number(process.env.RUANG_IBU_CDP ?? 9339)
const evidenceDir = 'docs/evidence/relaxation-music-collection'
mkdirSync(evidenceDir, { recursive: true })
let activeViewport = { width: 390, height: 844 }

function browser(...args) {
  return execFileSync('agent-browser.cmd', args, { encoding: 'utf8', maxBuffer: 2 * 1024 * 1024, shell: true, windowsHide: true }).trim()
}

function evaluate(expression) {
  const encoded = Buffer.from(`JSON.stringify(${expression})`, 'utf8').toString('base64')
  let value = JSON.parse(browser('eval', '-b', encoded))
  while (typeof value === 'string' && /^[\[{\"]/.test(value)) {
    try { value = JSON.parse(value) } catch { break }
  }
  if (value === 'true') return true
  if (value === 'false') return false
  if (typeof value === 'string' && /^-?\d+(\.\d+)?$/.test(value)) return Number(value)
  return value
}

function click(selector) {
  // Navigation can restore Chrome's default window metrics, so sync before each physical click.
  browser('set', 'viewport', String(activeViewport.width), String(activeViewport.height))
  browser('click', selector)
  browser('wait', '100')
}
function wait(ms) { return new Promise((resolve) => setTimeout(resolve, ms)) }

async function withCdp({ width = 390, height = 844, expression, screenshotPath, reducedMotion } = {}) {
  // Keep Agent Browser's mouse-coordinate viewport in sync with CDP emulation.
  activeViewport = { width, height }
  browser('set', 'viewport', String(width), String(height))
  const targets = await fetch(`http://127.0.0.1:${cdpPort}/json/list`).then((response) => response.json())
  const target = targets.find((item) => item.type === 'page' && item.url.startsWith(origin))
  assert.ok(target, 'Agent Browser has the Ruang Ibu page attached')
  const socket = new WebSocket(target.webSocketDebuggerUrl)
  await new Promise((resolve, reject) => {
    socket.addEventListener('open', resolve, { once: true })
    socket.addEventListener('error', reject, { once: true })
  })
  let nextId = 0
  const pending = new Map()
  socket.addEventListener('message', (event) => {
    const message = JSON.parse(event.data)
    const waiter = pending.get(message.id)
    if (!waiter) return
    pending.delete(message.id)
    message.error ? waiter.reject(new Error(message.error.message)) : waiter.resolve(message.result)
  })
  const send = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++nextId
    pending.set(id, { resolve, reject })
    socket.send(JSON.stringify({ id, method, params }))
  })
  try {
    await send('Emulation.setDeviceMetricsOverride', { width, height, deviceScaleFactor: 1, mobile: true })
    if (reducedMotion !== undefined) {
      await send('Emulation.setEmulatedMedia', { features: [{ name: 'prefers-reduced-motion', value: reducedMotion ? 'reduce' : 'no-preference' }] })
    }
    const viewport = await send('Runtime.evaluate', { expression: 'JSON.stringify({ innerWidth, innerHeight })', returnByValue: true })
    assert.deepEqual(JSON.parse(viewport.result.value), { innerWidth: width, innerHeight: height })
    let value
    if (expression) {
      const result = await send('Runtime.evaluate', { expression: `JSON.stringify(${expression})`, returnByValue: true })
      value = JSON.parse(result.result.value)
    }
    if (screenshotPath) {
      const screenshot = await send('Page.captureScreenshot', { format: 'png', fromSurface: true, captureBeyondViewport: false })
      writeFileSync(screenshotPath, Buffer.from(screenshot.data, 'base64'))
    }
    return value
  } finally {
    socket.close()
  }
}

browser('connect', String(cdpPort))
browser('open', `${origin}/relaksasi`)
browser('wait', '--load', 'networkidle')
assert.deepEqual(evaluate('performance.getEntriesByType("resource").map(entry => new URL(entry.name).pathname).filter(path => path.startsWith("/audio/"))'), [], 'catalog does not request any audio before track selection')
const serviceWorker = readFileSync('dist/service-worker.js', 'utf8')
assert.equal(/\/audio\/[^"\s]+\.mp3/.test(serviceWorker), false, 'production PWA precache does not list MP3 audio')
await withCdp({ width: 390, height: 844, screenshotPath: `${evidenceDir}/catalog-390x844.png` })
assert.equal(browser('get', 'text', 'h1'), 'Ruang Tenang\nuntuk Ibu')
assert.equal(evaluate('document.querySelectorAll(".relaxation-track").length'), 8, 'three existing tracks and five music tracks are listed')
assert.equal(evaluate('document.body.innerText.includes("Pernapasan")'), false, 'no unsupported breathing category is shown')
assert.equal(evaluate('document.querySelectorAll("audio").length'), 1, 'catalog owns one persistent audio element')
assert.equal(evaluate('document.querySelector("audio").paused'), true, 'audio does not autoplay')
assert.equal(evaluate('document.querySelector(".bottom-tabs .is-active span").textContent.trim()'), 'Relaksasi')
assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)
assert.equal(evaluate('document.querySelectorAll(".relaxation-track img").length'), 8, 'each audio has catalog artwork')

click('.filter-music')
assert.equal(evaluate('document.querySelectorAll(".relaxation-track").length'), 6, 'music filter includes all six music tracks')
assert.equal(evaluate('document.querySelector(".relaxation-track__copy strong").textContent'), 'Musik Instrumental')
click('.filter-nature')
assert.equal(evaluate('document.querySelectorAll(".relaxation-track").length'), 2, 'nature filter works')
click('.filter-all')
click('.relaxation-catalog__search-toggle')
browser('fill', '#relaxation-search-input', 'Gymnopédie')
assert.equal(evaluate('document.querySelectorAll(".relaxation-track").length'), 1, 'search finds Gymnopédie')
assert.equal(evaluate('document.querySelector(".relaxation-track__copy strong").textContent'), 'Gymnopédie No. 1')
browser('fill', '#relaxation-search-input', 'Kevin MacLeod')
assert.equal(evaluate('document.querySelectorAll(".relaxation-track").length'), 4, 'search also matches creator')
assert.equal(evaluate('[...document.querySelectorAll(".relaxation-track__copy strong")].some(node => node.textContent === "Avec Soin")'), true)
assert.equal(evaluate('[...document.querySelectorAll(".relaxation-track__copy strong")].some(node => node.textContent === "Friday Morning")'), true)
browser('fill', '#relaxation-search-input', 'bebatuan')
assert.equal(evaluate('document.querySelectorAll(".relaxation-track").length'), 1, 'catalog search combines with active all filter')
assert.equal(evaluate('document.querySelector(".relaxation-track__copy strong").textContent'), 'Air di Bebatuan')
browser('fill', '#relaxation-search-input', 'tidak ada')
assert.equal(evaluate('document.querySelector(".relaxation-catalog__empty").textContent.includes("Belum ada audio" )'), true, 'search empty state is shown')
click('.relaxation-catalog__search-toggle')
assert.equal(evaluate('document.querySelectorAll(".relaxation-track").length'), 8)

click('.relaxation-track__open')
browser('wait', '300')
assert.equal(browser('get', 'url'), `${origin}/relaksasi/rain`)
assert.deepEqual(evaluate('performance.getEntriesByType("resource").map(entry => new URL(entry.name).pathname).filter(path => path.startsWith("/audio/"))'), ['/audio/soft-rain.mp3'], 'only the selected track is fetched on demand')
assert.equal(browser('get', 'text', 'h1'), 'Hujan Lembut')
assert.equal(evaluate('document.querySelectorAll("audio").length'), 1, 'immersive view reuses the same audio element')
assert.equal(evaluate('document.querySelector("audio").paused'), true, 'opening a track stays paused')
assert.equal(evaluate('document.querySelector(".bottom-tabs") === null'), true, 'immersive player hides bottom navigation')
assert.equal(evaluate('document.querySelector(".immersive-player__photo img").naturalWidth === 1080'), true, 'background image is loaded')
assert.equal(evaluate('getComputedStyle(document.querySelector(".immersive-player__photo img")).animationName'), 'none', 'paused player does not animate the background')

click('.immersive-player__play')
await wait(1000)
const playingState = await withCdp({ width: 390, height: 844, expression: `(() => { const a=document.querySelector('audio'); const image=document.querySelector('.immersive-player__photo img'); return {paused:a.paused,time:a.currentTime,duration:a.duration,animation:getComputedStyle(image).animationName} })()` })
assert.equal(playingState.paused, false, 'play button starts real audio')
assert.ok(playingState.time > 0.35, `audio time advances while playing, got ${playingState.time}`)
assert.ok(playingState.duration > 50, 'duration comes from media metadata')
assert.equal(playingState.animation, 'immersive-drift', 'background motion is tied to playback')

const beforeSeek = evaluate('document.querySelector("audio").currentTime')
evaluate('(() => { const input=document.querySelector("#immersive-seek"); const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set; set.call(input,String(document.querySelector("audio").duration*0.55)); input.dispatchEvent(new Event("input",{bubbles:true})); input.dispatchEvent(new Event("change",{bubbles:true})); return true })()')
await wait(150)
assert.ok(evaluate('document.querySelector("audio").currentTime') > beforeSeek + 10, 'seek changes actual playback position')
evaluate('(() => { const input=document.querySelector("#immersive-volume"); const set=Object.getOwnPropertyDescriptor(HTMLInputElement.prototype,"value").set; set.call(input,"0.31"); input.dispatchEvent(new Event("input",{bubbles:true})); input.dispatchEvent(new Event("change",{bubbles:true})); return true })()')
assert.ok(Math.abs(evaluate('document.querySelector("audio").volume') - 0.31) < 0.02, 'volume control changes actual media volume')

// Returning to the catalog keeps the same source and current position without a second element.
const timeBeforeBack = evaluate('document.querySelector("audio").currentTime')
click('.immersive-player__back')
assert.equal(browser('get', 'url'), `${origin}/relaksasi`)
assert.equal(evaluate('document.querySelectorAll("audio").length'), 1)
assert.equal(evaluate('document.querySelector("audio").paused'), false, 'playback can continue in catalog')
assert.equal(evaluate('document.querySelector(".relaxation-track.is-playing .relaxation-track__status").textContent.trim().includes("Sedang diputar" )'), true)
assert.ok(evaluate('document.querySelector("audio").currentTime') >= timeBeforeBack, 'the current position persists across the route transition')
// Next/previous use the same playback element; browser Back returns to the prior track route.
click('.relaxation-track__open')
await wait(150)
assert.equal(browser('get', 'url'), `${origin}/relaksasi/rain`)
const playerTimeBeforeReopen = evaluate('document.querySelector("audio").currentTime')
assert.ok(playerTimeBeforeReopen >= timeBeforeBack, 'reopening the current track does not reset its position')
click('.immersive-player__next')
await wait(1000)
assert.equal(browser('get', 'url'), `${origin}/relaksasi/waves`)
assert.equal(browser('get', 'text', 'h1'), 'Air di Bebatuan')
assert.equal(evaluate('document.querySelectorAll("audio").length'), 1)
assert.equal(evaluate('new URL(document.querySelector("audio").src).pathname'), '/audio/water-on-rocks.mp3')
assert.equal(evaluate('document.querySelector("audio").paused'), false, 'user-initiated next keeps playback active')
browser('back')
await wait(250)
assert.equal(browser('get', 'url'), `${origin}/relaksasi/rain`)
assert.equal(browser('get', 'text', 'h1'), 'Hujan Lembut')
assert.equal(evaluate('document.querySelector("audio").paused'), true, 'browser Back to another track does not autoplay it')
click('.immersive-player__play')
await wait(500)
assert.equal(evaluate('document.querySelector("audio").paused'), false, 'play resumes after browser Back')
click('.immersive-player__play')
assert.equal(evaluate('document.querySelector("audio").paused'), true, 'pause stops the media element')
const pausedAt = evaluate('document.querySelector("audio").currentTime')
await wait(500)
assert.ok(Math.abs(evaluate('document.querySelector("audio").currentTime') - pausedAt) < 0.08, 'time stops when paused')

// The slider remains keyboard operable and reduced motion disables decorative animation.
browser('focus', '#immersive-seek')
browser('press', 'ArrowRight')
await wait(80)
assert.ok(evaluate('document.querySelector("audio").currentTime') >= pausedAt, 'seek slider accepts keyboard input')
click('.immersive-player__play')
await wait(250)
const reducedMotion = await withCdp({ width: 390, height: 844, reducedMotion: true, expression: `(() => getComputedStyle(document.querySelector('.immersive-player__photo img')).animationName)()` })
assert.equal(reducedMotion, 'none', 'reduced motion disables the immersive animation')
browser('back')
await wait(250)

// Accessibility disclosure credits are available without being open by default.
assert.equal(evaluate('document.querySelector("#audio-credits") !== null'), true)
assert.equal(evaluate('document.querySelector("#audio-credits details").open'), false)
evaluate('document.querySelector("#audio-credits details>summary").click()')
assert.equal(evaluate('document.querySelector("#audio-credits").innerText.includes("Scott Buckley")'), false, 'retired records are absent from active credits')
assert.equal(evaluate('document.querySelector("#audio-credits").innerText.includes("CC BY 4.0")'), true)
assert.equal(evaluate('document.querySelector("#audio-credits").innerText.includes("incompetech.com")'), true)
assert.equal(evaluate('document.querySelector("#audio-credits details").open'), true)
assert.equal(evaluate('document.querySelectorAll("#audio-credits a[href^=https]").length'), 16, 'source and license links are present for all eight tracks')
assert.equal(evaluate('document.querySelectorAll("#audio-credits .content-disclosure__body li").length'), 8, 'credit disclosure includes every track')
evaluate('document.querySelector("#audio-credits details>summary").click()')

// Direct URL works, then all required viewports are checked for overflow and nav clearance.
browser('open', `${origin}/relaksasi/ambient`)
browser('wait', '--load', 'networkidle')
assert.equal(browser('get', 'text', 'h1'), 'Musik Instrumental')
assert.equal(evaluate('document.querySelector("audio").paused'), true, 'direct detail route does not autoplay')
assert.equal(evaluate('document.querySelector(".immersive-player__next").disabled'), false, 'the previous third track can advance into the expanded collection')
click('.immersive-player__next')
await wait(250)
assert.equal(browser('get', 'url'), `${origin}/relaksasi/gymnopedie`)
assert.equal(browser('get', 'text', 'h1'), 'Gymnopédie No. 1')
assert.equal(evaluate('document.querySelector("audio").paused'), true, 'switching tracks while paused does not autoplay')
const newTracks = [
  ['gymnopedie', '/audio/gymnopedie-no-1.mp3', 'Gymnopédie No. 1'],
  ['years-grow-quiet', '/audio/the-years-grow-quiet.mp3', 'The Years Grow Quiet'],
  ['wholesome', '/audio/wholesome.mp3', 'Wholesome'],
  ['avec-soin', '/audio/avec-soin.mp3', 'Avec Soin'],
  ['friday-morning', '/audio/friday-morning.mp3', 'Friday Morning'],
]
for (const [trackId, audioPath, title] of newTracks) {
  browser('open', `${origin}/relaksasi/${trackId}`)
  browser('wait', '--load', 'networkidle')
  assert.equal(browser('get', 'text', 'h1'), title, `${trackId} direct route opens the correct track`)
  assert.equal(evaluate('document.querySelector("audio").paused'), true, `${trackId} does not autoplay`)
  assert.equal(evaluate('new URL(document.querySelector("audio").src).pathname'), audioPath, `${trackId} uses the correct local file`)
  await wait(300)
  assert.ok(evaluate('Number.isFinite(document.querySelector("audio").duration) && document.querySelector("audio").duration > 0'), `${trackId} media metadata loads with a valid duration`)
  if (trackId === 'avec-soin') await withCdp({ width: 390, height: 844, screenshotPath: `${evidenceDir}/player-avec-soin-390x844.png` })
  const beforeNewTrackPlay = evaluate('document.querySelector("audio").currentTime')
  click('.immersive-player__play')
  await wait(450)
  assert.equal(evaluate('document.querySelector("audio").paused'), false, `${trackId} plays after an explicit user action`)
  assert.ok(evaluate('document.querySelector("audio").currentTime') > beforeNewTrackPlay, `${trackId} playback advances`)
  click('.immersive-player__play')
  assert.equal(evaluate('document.querySelector("audio").paused'), true, `${trackId} pauses using the shared player`)
}
for (const retiredTrackId of ['solace', 'sleep-piano-only']) {
  browser('open', `${origin}/relaksasi/${retiredTrackId}`)
  browser('wait', '--load', 'networkidle')
  browser('wait', '--text', 'Audio tidak ditemukan')
  assert.equal(browser('get', 'text', 'h1'), 'Audio tidak ditemukan', `${retiredTrackId} old route falls back cleanly`)
  assert.equal(evaluate('document.querySelector("audio").paused'), true, `${retiredTrackId} cannot play`)
  assert.equal(evaluate('document.querySelector(".immersive-player__back").getAttribute("href")'), '/relaksasi')
}
for (const [width, height] of [[375, 812], [390, 844], [430, 932]]) {
  browser('open', `${origin}/relaksasi`)
  browser('wait', '--load', 'networkidle')
  const catalogLayout = await withCdp({ width, height, expression: `(() => {
    const body = document.documentElement;
    window.scrollTo(0, body.scrollHeight);
    const nav = document.querySelector('.bottom-tabs')?.getBoundingClientRect();
    const lastItem = document.querySelector('.relaxation-catalog__credit').getBoundingClientRect();
    return { noOverflow: body.scrollWidth === body.clientWidth, navBottom: nav ? Math.round(nav.bottom - innerHeight) : null,
      navClearance: nav ? Math.round(nav.top - lastItem.bottom) : null, tracks: document.querySelectorAll('.relaxation-track').length };
  })()` })
  assert.equal(catalogLayout.noOverflow, true, `catalog has no horizontal overflow at ${width}x${height}`)
  assert.equal(catalogLayout.navBottom, 0, 'catalog bottom navigation stays at the viewport bottom')
  assert.ok(catalogLayout.navClearance >= 16, `catalog credit disclosure clears nav at ${width}x${height}`)
  assert.equal(catalogLayout.tracks, 8)
  browser('open', `${origin}/relaksasi/ambient`)
  browser('wait', '--load', 'networkidle')
  const layout = await withCdp({ width, height, expression: `(() => {
    const immersive = location.pathname !== '/relaksasi';
    const nav = document.querySelector('.bottom-tabs')?.getBoundingClientRect();
    const body = document.documentElement;
    const artwork = document.querySelector('.immersive-player__photo img');
    return { width: innerWidth, height: innerHeight, noOverflow: body.scrollWidth === body.clientWidth, immersive,
      navHidden: immersive ? !nav : Boolean(nav), navBottom: nav ? Math.round(nav.bottom - innerHeight) : null,
      playerImageCoversViewport: immersive ? Math.abs(artwork.getBoundingClientRect().width - innerWidth) < 1 : true };
  })()` })
  assert.equal(layout.noOverflow, true, `no horizontal overflow at ${width}x${height}`)
  assert.equal(layout.navHidden, true, 'catalog/player navigation visibility matches the screen')
  if (layout.navBottom !== null) assert.equal(layout.navBottom, 0, 'catalog bottom navigation stays at the viewport bottom')
}

// Exercise explicit loading and network failure states without altering production assets.
browser('open', `${origin}/relaksasi/rain`)
browser('wait', '--load', 'networkidle')
evaluate('document.querySelector("audio").dispatchEvent(new Event("waiting"))')
await wait(100)
assert.equal(evaluate('document.querySelector(".immersive-player__status").textContent'), 'Memuat audio…', 'loading state is announced')
evaluate('(() => { const a=document.querySelector("audio"); a.src="/audio/__qa_missing__.mp3"; a.load(); return true })()')
await wait(1000)
assert.ok(evaluate('document.querySelector(".immersive-player__error")?.textContent.includes("tidak dapat dimuat")'), 'media load failure explains how to recover')
click('.immersive-player__back')
assert.ok(evaluate('document.querySelector(".relaxation-track__error")?.textContent.includes("tidak dapat dimuat")'), 'catalog also announces the active track error')
browser('open', `${origin}/relaksasi/ambient`)
browser('wait', '--load', 'networkidle')
assert.equal(evaluate('document.querySelector("audio").paused'), true)

for (const [route, activeLabel] of [['/', 'Beranda'], ['/terapi', 'Terapi'], ['/terapi/teknik-pernapasan', 'Terapi'], ['/hamil', 'Hamil'], ['/bersalin', 'Bersalin'], ['/evaluasi', 'Evaluasi']]) {
  browser('open', `${origin}${route}`)
  browser('wait', '--load', 'networkidle')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true, `${route} has no horizontal overflow`)
  assert.equal(evaluate('document.querySelector(".bottom-tabs") !== null'), true, `${route} retains the approved tab bar`)
  assert.equal(evaluate('document.querySelector(".bottom-tabs .is-active span").textContent.trim()'), activeLabel, `${route} retains the approved active tab`)
}

console.log(`Relaxation browser QA passed at 375x812, 390x844 and 430x932; evidence saved to ${evidenceDir}`)
