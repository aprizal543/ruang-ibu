import { useCallback, useEffect, useRef, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { ChatCircleText, ClockCounterClockwise, GearSix, House, List, SignOut, X } from '@phosphor-icons/react'
import { AdminApiError } from '../api/adminApi'
import { getAdminSession, logoutAdmin, type AdminSessionUser } from '../api/authApi'
import { AdminAuthContext } from '../auth-context'
import '../admin.css'

const items = [
  { to: '/admin', label: 'Ringkasan', Icon: House, end: true },
  { to: '/admin/questions', label: 'Tanya Jawab', Icon: ChatCircleText, end: false },
  { to: '/admin/history', label: 'Riwayat', Icon: ClockCounterClockwise, end: false },
  { to: '/admin/settings', label: 'Pengaturan', Icon: GearSix, end: false },
]

export default function AdminLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [session, setSession] = useState<AdminSessionUser | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [authError, setAuthError] = useState<AdminApiError | null>(null)
  const [logoutBusy, setLogoutBusy] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const triggerRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const controller = new AbortController()
    setAuthLoading(true)
    getAdminSession(controller.signal).then((user) => {
      setSession(user)
      setAuthError(null)
    }).catch((reason: unknown) => {
      if (reason instanceof DOMException && reason.name === 'AbortError') return
      const error = reason instanceof AdminApiError ? reason : new AdminApiError(500, 'auth_error', 'Sesi pengelola belum dapat diperiksa.')
      if (error.status === 401) {
        navigate('/admin/login', { replace: true, state: { from: `${location.pathname}${location.search}` } })
      } else {
        setAuthError(error)
      }
    }).finally(() => { if (!controller.signal.aborted) setAuthLoading(false) })
    return () => controller.abort()
  }, [location.pathname, location.search, navigate])

  useEffect(() => {
    const onSessionEnded = () => navigate('/admin/login', { replace: true, state: { from: `${location.pathname}${location.search}` } })
    window.addEventListener('ruang-ibu:admin-session-ended', onSessionEnded)
    return () => window.removeEventListener('ruang-ibu:admin-session-ended', onSessionEnded)
  }, [location.pathname, location.search, navigate])

  useEffect(() => {
    if (!session) return
    let idleTimer = 0
    const expire = () => {
      setSession(null)
      navigate('/admin/login', { replace: true, state: { from: `${location.pathname}${location.search}` } })
    }
    const scheduleIdleExpiry = () => {
      window.clearTimeout(idleTimer)
      idleTimer = window.setTimeout(expire, 30 * 60 * 1000)
    }
    const absoluteTimer = window.setTimeout(expire, Math.max(0, session.expiresAt - Date.now()))
    scheduleIdleExpiry()
    window.addEventListener('ruang-ibu:admin-session-activity', scheduleIdleExpiry)
    return () => {
      window.clearTimeout(idleTimer)
      window.clearTimeout(absoluteTimer)
      window.removeEventListener('ruang-ibu:admin-session-activity', scheduleIdleExpiry)
    }
  }, [session, location.pathname, location.search, navigate])

  const logout = async () => {
    setLogoutBusy(true)
    setLogoutError('')
    try {
      await logoutAdmin()
      setSession(null)
      navigate('/admin/login', { replace: true })
    } catch (reason) {
      setLogoutError(reason instanceof AdminApiError ? reason.message : 'Sesi belum dapat ditutup. Coba lagi.')
    } finally {
      setLogoutBusy(false)
    }
  }
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

  if (authLoading) return <main className="admin-auth-state" role="status" aria-live="polite"><span className="admin-spinner" aria-hidden="true" />Memeriksa sesi pengelola…</main>
  if (authError) return <main className="admin-auth-state" data-admin-auth-error><div className="admin-auth-state__card"><p className="admin-eyebrow">RUANG PENGELOLA</p><h1>Akses pengelola belum tersedia</h1><p>{authError.status === 403 ? 'Akun ini belum memiliki izin sebagai pengelola.' : authError.status === 503 ? 'Layanan pengelola belum dikonfigurasi. Hubungi administrator website.' : 'Sesi pengelola belum dapat diperiksa. Coba lagi.'}</p><button className="admin-button" type="button" onClick={() => { setAuthError(null); setAuthLoading(true); void getAdminSession().then(setSession).catch((reason: unknown) => setAuthError(reason instanceof AdminApiError ? reason : new AdminApiError(500, 'auth_error', 'Sesi pengelola belum dapat diperiksa.'))).finally(() => setAuthLoading(false)) }}>Coba lagi</button></div></main>
  if (!session) return <Navigate to="/admin/login" replace state={{ from: `${location.pathname}${location.search}` }} />

  return (
    <AdminAuthContext.Provider value={session}>
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
          <div className="admin-topbar__badge">{session.role === 'owner' ? 'Pemilik' : 'Moderator'} · {session.email}</div>
          <button className="admin-button admin-button--secondary admin-logout-button" type="button" onClick={() => void logout()} disabled={logoutBusy} aria-label="Keluar dari ruang pengelola"><SignOut size={18} aria-hidden="true" />{logoutBusy ? 'Keluar…' : 'Keluar'}</button>
        </header>
        {logoutError && <p className="admin-logout-error" role="alert">{logoutError}</p>}
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
    </AdminAuthContext.Provider>
  )
}

function Brand() {
  return <div className="admin-brand"><span className="admin-brand__mark" aria-hidden="true">♡</span><span>Ruang Ibu</span><small>pengelola</small></div>
}
