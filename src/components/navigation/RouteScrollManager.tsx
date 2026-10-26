import { useLayoutEffect, useRef } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

type ScrollPosition = { x: number; y: number }
type ScrollPositions = Record<string, ScrollPosition>

const STORAGE_KEY = 'ruang-ibu:route-scroll:v1'
const MAX_STORED_POSITIONS = 40

function readPositions(): ScrollPositions {
  try {
    const value: unknown = JSON.parse(window.sessionStorage.getItem(STORAGE_KEY) ?? '{}')
    return value && typeof value === 'object' ? value as ScrollPositions : {}
  } catch {
    return {}
  }
}

function savePosition(key: string, position: ScrollPosition) {
  try {
    const positions = readPositions()
    positions[key] = position
    const recentPositions = Object.entries(positions).slice(-MAX_STORED_POSITIONS)
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(Object.fromEntries(recentPositions)))
  } catch {
    // Scroll restoration remains best effort when storage is unavailable.
  }
}

function getPosition(key: string): ScrollPosition | undefined {
  const position = readPositions()[key]
  if (!position || !Number.isFinite(position.x) || !Number.isFinite(position.y)) return undefined
  return position
}

function scrollToAnchor(hash: string): boolean {
  if (!hash) return false

  let id = hash.slice(1)
  try {
    id = decodeURIComponent(id)
  } catch {
    // Keep the literal hash when it is not valid URI encoding.
  }

  const target = document.getElementById(id)
  if (!target) return false

  target.querySelector<HTMLDetailsElement>('details')?.setAttribute('open', '')
  target.scrollIntoView({ block: 'start', behavior: 'auto' })
  return true
}

function restorePosition(position: ScrollPosition | undefined) {
  if (position) window.scrollTo(position.x, position.y)
  else window.scrollTo(0, 0)
}

export default function RouteScrollManager() {
  const location = useLocation()
  const navigationType = useNavigationType()
  const previousLocation = useRef<typeof location | null>(null)

  useLayoutEffect(() => {
    const previousRestoration = window.history.scrollRestoration
    window.history.scrollRestoration = 'manual'
    return () => {
      window.history.scrollRestoration = previousRestoration
    }
  }, [])

  useLayoutEffect(() => {
    const previous = previousLocation.current

    if (!previous) {
      previousLocation.current = location
      if (!scrollToAnchor(location.hash)) window.scrollTo(0, 0)
      return
    }

    if (previous.key === location.key) {
      previousLocation.current = location
      return
    }

    savePosition(previous.key, { x: window.scrollX, y: window.scrollY })
    previousLocation.current = location

    if (previous.pathname !== location.pathname) {
      if (navigationType === 'POP') {
        restorePosition(getPosition(location.key))
      } else if (!scrollToAnchor(location.hash)) {
        window.scrollTo(0, 0)
      }
      return
    }

    if (previous.hash !== location.hash && location.hash) {
      scrollToAnchor(location.hash)
    } else if (navigationType === 'POP') {
      restorePosition(getPosition(location.key))
    }
  }, [location, navigationType])

  return null
}
