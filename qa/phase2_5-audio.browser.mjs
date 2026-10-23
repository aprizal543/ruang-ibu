import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'

const origin = process.env.RUANG_IBU_TEST_ORIGIN ?? 'http://127.0.0.1:5173'
function browser(...args) {
  return execFileSync('agent-browser.cmd', args, {
    encoding: 'utf8',
    maxBuffer: 2 * 1024 * 1024,
    shell: true,
    windowsHide: true,
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
for (const [path, title, guideLabel] of [
  ['/terapi/teknik-pernapasan', 'Teknik Pernapasan', 'Saat hamil'],
  ['/terapi/terapi-musik', 'Musik untuk Relaksasi', 'Pilih musik yang Ibu sukai'],
  ['/terapi/relaksasi-otot-ringan', 'Relaksasi Tubuh', 'Jika terasa nyaman'],
  ['/terapi/pijat-pendamping', 'Pijat Pendamping', 'Sampaikan kepada pendamping'],
]) {
  browser('set', 'viewport', '390', '844')
  browser('open', origin + path)
  browser('wait', '--fn', "document.querySelector('h1')?.textContent === '" + title + "'")
  assert.equal(browser('get', 'text', 'h1'), title)
  assert.equal(browser('get', 'count', '[data-source-reviewed]'), path.includes('relaksasi-otot') ? '0' : '1')
  assert.equal(browser('get', 'count', '[data-locked-guide]'), '0')
  assert.ok(browser('get', 'text', '.therapy-detail__source-guide').includes(guideLabel), title + ' has the source-based practical-guide copy')
  assert.equal(browser('get', 'attr', 'a.bottom-tabs__item:nth-child(2)', 'aria-current'), 'page')
  assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)
  if (path.includes('teknik-pernapasan') || path.includes('terapi-musik')) {
    assert.equal(browser('get', 'count', '[data-audio-player]'), '1', title + ' has its linked audio')
  }
}

browser('open', origin + '/terapi/teknik-pernapasan')
browser('focus', 'summary')
browser('press', 'Space')
assert.equal(evaluate("document.querySelector('[data-source-details]')?.open"), true, 'source disclosure opens with keyboard')
browser('click', '[data-source-guide] a')
assert.equal(evaluate("document.querySelector('[data-source-details]')?.open"), true, 'guide source link opens the source disclosure')

browser('open', origin + '/relaksasi')
assert.equal(browser('get', 'text', 'h1'), 'Ruang Tenang untuk Ibu')
assert.equal(browser('get', 'count', '[data-audio-track]'), '3')
assert.equal(browser('get', 'attr', 'a.bottom-tabs__item:nth-child(5)', 'aria-current'), 'page')
for (const [trackId, sourceLabel] of [['rain', 'hujan'], ['waves', 'air'], ['ambient', 'musik']]) {
  browser('click', `[data-audio-track="${trackId}"]`)
  assert.equal(browser('get', 'count', '[data-audio-player]'), '1')
  assert.equal(evaluate("document.querySelector('audio')?.autoplay"), false)
  browser('focus', '[data-audio-play]')
  browser('press', 'Space')
  browser('wait', '--fn', "document.querySelector('audio')?.readyState >= 2")
  assert.equal(evaluate("document.querySelector('audio')?.paused"), false, `${sourceLabel} audio starts on explicit keyboard action`)
  assert.ok(evaluate("document.querySelector('audio')?.duration > 0"), `${sourceLabel} audio has duration metadata`)
  if (trackId === 'ambient') {
    browser('fill', '[data-audio-seek]', '50')
    assert.ok(evaluate("document.querySelector('audio')?.currentTime > 0"), 'seek control changes playback position')
    browser('focus', '[data-audio-volume]')
    browser('press', 'Home')
    assert.equal(evaluate("document.querySelector('audio')?.volume"), 0, 'keyboard volume slider reaches mute')
    browser('press', 'End')
    assert.equal(evaluate("document.querySelector('audio')?.volume"), 1, 'keyboard volume slider reaches full volume')
  }
  browser('focus', '[data-audio-play]')
  browser('press', 'Space')
  assert.equal(evaluate("document.querySelector('audio')?.paused"), true, `${sourceLabel} audio pauses on keyboard action`)
}
browser('click', '[data-audio-track="rain"]')
browser('click', '[data-audio-play]')
browser('wait', '--fn', "document.querySelector('audio')?.readyState >= 2")
assert.equal(evaluate("(() => { window.__previousAudio = document.querySelector('audio'); return true })()"), true)
browser('click', '[data-audio-track="waves"]')
assert.equal(evaluate('window.__previousAudio.paused'), true, 'choosing another track pauses the previous track')
assert.equal(evaluate('document.documentElement.scrollWidth === document.documentElement.clientWidth'), true)

browser('click', '[data-audio-track="ambient"]')
evaluate("(() => { const audio = document.querySelector('audio'); audio.src = '/audio/__qa-missing-track__.mp3'; audio.load(); return true })()")
browser('wait', '--text', 'Audio tidak dapat dimuat')
assert.ok(evaluate("document.querySelector('audio')?.error !== null"), 'missing audio source raises a media error')
assert.ok(browser('get', 'text', '.audio-player__error').includes('sedang offline'), 'audio failure explains offline recovery')
browser('screenshot', 'docs/evidence/phase-2.5-review/audio-error-390x844.png')

browser('open', origin + '/')
assert.equal(String(evaluate("document.querySelector('.hero__actions a:nth-child(2)')?.getAttribute('href')")).replaceAll('"', ''), '/relaksasi', 'homepage CTA points to the relaxation page')
browser('open', origin + '/relaksasi')
assert.equal(browser('get', 'text', 'h1'), 'Ruang Tenang untuk Ibu', 'relaxation page route opens directly')

console.log('Phase 2.5 content and audio browser checks passed.')
