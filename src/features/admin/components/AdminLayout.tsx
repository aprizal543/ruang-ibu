import { useCallback, useEffect, useRef, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { ChatCircleText, ClockCounterClockwise, GearSix, House, List, X } from '@phosphor-icons/react'
import '../admin.css'

const items = [
  { to: '/admin', label: 'Ringkasan', Icon: House, end: true },
  { to: '/admin/questions', label: 'Tanya Jawab', Icon: ChatCircleText, end: false },
  { to: '/admin/history', label: 'Riwayat', Icon: ClockCounterClockwise, end: false },
  { to: '/admin/settings', label: 'Pengaturan', Icon: GearSix, end: false },
]

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const closeDrawer = useCallback(() => {
    triggerRef.current?.focus()
    setDrawerOpen(false)
    window.setTimeout(() => triggerRef.current?.focus(), 80)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return
    closeDrawer()
  }, [location.pathname, location.search, closeDrawer])
  useEffect(() => {
    if (!drawerOpen) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeDrawer()
      if (event.key !== 'Tab') return
      const focusable = [...(document.querySelector('.admin-drawer')?.querySelectorAll<HTMLElement>('a,button') ?? [])]
      if (!focusable.length) return
      if (event.shiftKey && document.activeElement === focusable[0]) { event.preventDefault(); focusable.at(-1)?.focus() }
      else if (!event.shiftKey && document.activeElement === focusable.at(-1)) { event.preventDefault(); focusable[0]?.focus() }
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [drawerOpen, closeDrawer])

  return (
    <div className="admin-app" data-admin-app>
      <a className="admin-skip-link" href="#admin-main">Lewati ke konten utama</a>
      <aside className="admin-sidebar" aria-label="Navigasi pengelola">
        <Brand />
        <nav className="admin-nav">
          <p className="admin-nav__eyebrow">RUANG PENGELOLA</p>
          {items.map(({ to, label, Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav__link${isActive ? ' is-active' : ''}`}>
            <Icon aria-hidden="true" size={20} weight="regular" /> <span>{label}</span>
          </NavLink>)}
        </nav>
        <div className="admin-sidebar__footer"><span className="admin-dot" /> Data tersedia melalui API pengelola</div>
      </aside>

      <div className="admin-workspace">
        <header className="admin-topbar">
          <button ref={triggerRef} className="admin-icon-button admin-menu-trigger" type="button" aria-label="Buka navigasi pengelola" aria-expanded={drawerOpen} onClick={() => setDrawerOpen(true)}>
            <List size={22} aria-hidden="true" />
          </button>
          <div className="admin-topbar__title"><span>Ruang Ibu</span><span aria-hidden="true">/</span><strong>Pengelola</strong></div>
          <div className="admin-topbar__badge">Untuk pengelola</div>
        </header>
        <main id="admin-main" className="admin-main" tabIndex={-1}><Outlet /></main>
      </div>

      {drawerOpen && <div className="admin-drawer-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) closeDrawer() }}>
        <aside className="admin-drawer" role="dialog" aria-modal="true" aria-label="Navigasi pengelola">
          <div className="admin-drawer__head"><Brand /><button ref={closeRef} className="admin-icon-button" type="button" aria-label="Tutup navigasi" onClick={closeDrawer}><X size={20} aria-hidden="true" /></button></div>
          <nav className="admin-nav">
            <p className="admin-nav__eyebrow">RUANG PENGELOLA</p>
            {items.map(({ to, label, Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `admin-nav__link${isActive ? ' is-active' : ''}`}>
              <Icon aria-hidden="true" size={20} /> <span>{label}</span>
            </NavLink>)}
          </nav>
        </aside>
      </div>}
    </div>
  )
}

function Brand() {
  return <div className="admin-brand"><span className="admin-brand__mark" aria-hidden="true">♡</span><span>Ruang Ibu</span><small>pengelola</small></div>
}
