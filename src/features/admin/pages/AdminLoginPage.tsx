import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from '@phosphor-icons/react'
import { AdminApiError } from '../api/adminApi'
import { getAdminSession, getGoogleLoginChallenge, loginWithGoogle } from '../api/authApi'
import type { GoogleLoginChallenge } from '../api/authApi'
import '../admin.css'

function safeDestination(value: unknown): string {
  if (typeof value !== 'string' || !value.startsWith('/admin') || value.startsWith('/admin/login') || value.startsWith('//')) return '/admin'
  return value
}

function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>('script[data-google-identity="true"]')
    const script = existing ?? document.createElement('script')
    const loaded = () => window.google?.accounts?.id ? resolve() : reject(new Error('Google Identity Services did not initialize.'))
    const failed = () => reject(new Error('Google Identity Services could not be loaded.'))
    script.addEventListener('load', loaded, { once: true })
    script.addEventListener('error', failed, { once: true })
    if (!existing) {
      script.src = 'https://accounts.google.com/gsi/client'
      script.async = true
      script.defer = true
      script.dataset.googleIdentity = 'true'
      document.head.append(script)
    }
  })
}

export default function AdminLoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const buttonRef = useRef<HTMLDivElement>(null)
  const challengeRef = useRef<GoogleLoginChallenge | null>(null)
  const busyRef = useRef(false)
  const [challenge, setChallenge] = useState<GoogleLoginChallenge | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [sessionCheck, setSessionCheck] = useState<'checking' | 'ready' | 'unknown'>('checking')
  const [challengeState, setChallengeState] = useState<'loading' | 'ready' | 'unavailable'>('loading')

  useEffect(() => {
    const controller = new AbortController()
    void getAdminSession(controller.signal).then(() => setSessionCheck('ready')).catch((reason: unknown) => {
      if (!(reason instanceof DOMException && reason.name === 'AbortError')) setSessionCheck('unknown')
    })
    return () => controller.abort()
  }, [])

  useEffect(() => {
    const controller = new AbortController()
    setChallengeState('loading')
    void getGoogleLoginChallenge(controller.signal).then((value) => {
      if (controller.signal.aborted) return
      challengeRef.current = value
      setChallenge(value)
      setChallengeState('ready')
    }).catch((reason: unknown) => {
      if (controller.signal.aborted) return
      setChallengeState('unavailable')
      const status = reason instanceof AdminApiError ? reason.status : 0
      setError(status === 503 ? 'Akses pengelola belum tersedia. Hubungi administrator website.' : status === 429 ? 'Permintaan masuk dibatasi sementara. Coba lagi nanti.' : status === 0 ? 'Layanan pengelola belum dapat dijangkau. Coba lagi nanti.' : 'Tombol masuk belum dapat dimuat. Coba lagi nanti.')
    })
    return () => { controller.abort(); challengeRef.current = null }
  }, [])

  useEffect(() => {
    if (!challenge || challenge.expiresAt <= Date.now() || !buttonRef.current) return
    let cancelled = false
    void loadGoogleIdentityScript().then(() => {
      if (cancelled || !buttonRef.current || !window.google?.accounts?.id) return
      const identity = window.google.accounts.id
      identity.initialize({
        client_id: challenge.clientId,
        nonce: challenge.nonce,
        callback: (response) => {
          const nonce = challengeRef.current?.nonce
          const credential = response.credential
          if (!nonce || !credential || busyRef.current) return
          challengeRef.current = null
          busyRef.current = true
          setBusy(true)
          setError('')
          void loginWithGoogle(credential, nonce).then(() => {
            navigate(safeDestination((location.state as { from?: unknown } | null)?.from), { replace: true })
          }).catch((reason: unknown) => {
            const apiError = reason instanceof AdminApiError ? reason : null
            setError(apiError?.status === 401 ? 'Akun Google ini belum memiliki akses pengelola atau sesi masuk tidak dapat diverifikasi.'
              : apiError?.status === 429 ? 'Percobaan masuk dibatasi sementara. Coba lagi nanti.'
                : apiError?.status === 503 ? 'Akses pengelola belum tersedia. Hubungi administrator website.'
                  : apiError?.status === 0 ? 'Sambungan ke layanan pengelola terputus. Coba lagi.'
                    : 'Masuk belum dapat diproses. Muat ulang halaman untuk mencoba lagi.')
            setChallenge(null)
            setChallengeState('unavailable')
            buttonRef.current?.replaceChildren()
          }).finally(() => { busyRef.current = false; setBusy(false) })
        },
      })
      identity.renderButton(buttonRef.current, { type: 'standard', theme: 'outline', size: 'large', shape: 'pill', text: 'signin_with', logo_alignment: 'left', width: Math.min(380, Math.max(240, buttonRef.current.clientWidth)) })
    }).catch(() => {
      if (!cancelled) {
        setChallengeState('unavailable')
        setError('Google Sign-In belum dapat dimuat. Periksa koneksi lalu muat ulang halaman.')
      }
    })
    return () => { cancelled = true }
  }, [challenge, location.state, navigate])

  if (sessionCheck === 'ready') return <Navigate to={safeDestination((location.state as { from?: unknown } | null)?.from)} replace />

  return <main className="admin-login" data-admin-login>
    <Link className="admin-login__back" to="/"><ArrowLeft size={18} aria-hidden="true" /> Kembali ke Ruang Ibu</Link>
    <section className="admin-login__card" aria-labelledby="admin-login-title">
      <div className="admin-login__brand"><span className="admin-brand__mark" aria-hidden="true">♡</span><span>Ruang Ibu</span><small>ruang pengelola</small></div>
      <p className="admin-eyebrow">AKSES TERBATAS</p>
      <h1 id="admin-login-title">Masuk ke ruang pengelola</h1>
      <p className="admin-login__intro">Gunakan akun Google yang telah diaktifkan secara privat oleh pemilik Ruang Ibu.</p>
      {error && <p className="admin-login__error" role="alert">{error}</p>}
      <div className="admin-google-signin" aria-label="Masuk menggunakan Google">
        <div ref={buttonRef} className="admin-google-signin__button" />
        {(challengeState === 'loading' || sessionCheck === 'checking' || busy) && <p className="admin-login__privacy" role="status">{busy ? 'Memeriksa akun Google…' : 'Menyiapkan akses pengelola…'}</p>}
        {challengeState === 'unavailable' && <button className="admin-button admin-button--secondary admin-login__retry" type="button" onClick={() => window.location.reload()}>Muat ulang halaman</button>}
      </div>
      <p className="admin-login__privacy">Sesi pengelola berakhir setelah 30 menit tidak aktif atau paling lama 8 jam. ID token hanya dikirim ke server untuk diverifikasi dan tidak disimpan di browser.</p>
    </section>
    <p className="admin-login__safety">Ruang pengelola digunakan untuk moderasi. Jangan membagikan akses akun kepada orang lain.</p>
  </main>
}
