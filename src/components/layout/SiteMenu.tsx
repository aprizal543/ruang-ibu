import { useEffect, useRef, type RefObject } from 'react'
import {
  BookOpenTextIcon,
  ClipboardTextIcon,
  HeadphonesIcon,
  HouseIcon,
  InfoIcon,
  QuestionIcon,
  UsersThreeIcon,
  WarningCircleIcon,
  XIcon,
  HandHeartIcon,
} from '@phosphor-icons/react'
import { Flower2 } from 'lucide-react'
import { Link, NavLink } from 'react-router-dom'
import PregnancyIcon from '../ui/PregnancyIcon'

interface SiteMenuProps {
  open: boolean
  onClose: () => void
  onNavigate: () => void
  triggerRef: RefObject<HTMLElement | null>
}

const primaryLinks = [
  { label: 'Beranda', to: '/', Icon: HouseIcon },
  { label: 'Jenis Terapi', to: '/terapi', Icon: HandHeartIcon },
  { label: 'Panduan Ibu Hamil', to: '/hamil', Icon: PregnancyIcon },
  { label: 'Panduan Bersalin', to: '/bersalin', Icon: UsersThreeIcon },
  { label: 'Relaksasi', to: '/relaksasi', Icon: HeadphonesIcon },
  { label: 'Evaluasi', to: '/evaluasi', Icon: ClipboardTextIcon },
]

const secondaryLinks = [
  { label: 'Tentang Ruang Ibu', to: '/tentang', Icon: InfoIcon },
  { label: 'Sumber Informasi', to: '/sumber', Icon: BookOpenTextIcon },
  { label: 'Tanya Jawab', to: '/faq', Icon: QuestionIcon },
]

export default function SiteMenu({ open, onClose, onNavigate, triggerRef }: SiteMenuProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const dialogRef = useRef<HTMLElement>(null)
  const navigatedRef = useRef(false)

  useEffect(() => {
    if (!open) return

    const previousOverflow = document.body.style.overflow
    const root = document.getElementById('root')
    const backgroundElements = root
      ? [...root.children].filter((element): element is HTMLElement => element instanceof HTMLElement && !element.matches('.site-menu'))
      : []
    const previousInertStates = backgroundElements.map((element) => element.inert)
    backgroundElements.forEach((element) => { element.inert = true })
    navigatedRef.current = false
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }
      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = [...dialogRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
      )].filter((element) => element.getAttribute('aria-hidden') !== 'true')
      if (focusable.length === 0) {
        event.preventDefault()
        dialogRef.current.focus()
        return
      }

      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && (document.activeElement === first || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && (document.activeElement === last || !dialogRef.current.contains(document.activeElement))) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      backgroundElements.forEach((element, index) => { element.inert = previousInertStates[index] })
      if (!navigatedRef.current) triggerRef.current?.focus({ preventScroll: true })
    }
  }, [open, onClose, triggerRef])

  const handleNavigate = () => {
    navigatedRef.current = true
    onNavigate()
  }

  if (!open) return null

  return (
    <div className="site-menu" data-site-menu>
      <section
        id="site-menu-dialog"
        className="site-menu__panel"
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Menu Ruang Ibu"
        tabIndex={-1}
      >
        <header className="site-menu__header">
          <Link className="brand-lockup" to="/" aria-label="Ruang Ibu, Beranda" onClick={handleNavigate}>
            <span className="brand-lockup__mark" aria-hidden="true"><Flower2 size={20} strokeWidth={1.6} /></span>
            <span>Ruang Ibu</span>
          </Link>
          <button className="site-menu__close" ref={closeButtonRef} type="button" onClick={onClose} aria-label="Tutup menu">
            <XIcon size={23} weight="regular" aria-hidden="true" />
          </button>
        </header>

        <nav className="site-menu__primary" aria-label="Navigasi utama">
          {primaryLinks.map(({ label, to, Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={handleNavigate}
              className={({ isActive }) => `site-menu__link${isActive ? ' is-active' : ''}`}
            >
              <Icon size={22} weight="regular" aria-hidden={true} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <nav className="site-menu__secondary" aria-label="Informasi Ruang Ibu">
          {secondaryLinks.map(({ label, to, Icon }) => (
            <NavLink key={to} to={to} onClick={handleNavigate} className={({ isActive }) => `site-menu__link${isActive ? ' is-active' : ''}`}>
              <Icon size={21} weight="regular" aria-hidden="true" />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <Link className="site-menu__safety" to="/tanda-bahaya" onClick={handleNavigate}>
          <WarningCircleIcon size={22} weight="fill" aria-hidden="true" />
          <span className="site-menu__safety-copy">
            <strong>Tanda Bahaya</strong>
            <span>Kenali tanda bahaya kehamilan dan persalinan yang perlu ditangani tenaga kesehatan.</span>
          </span>
          <span className="site-menu__safety-arrow" aria-hidden="true">›</span>
        </Link>
      </section>
    </div>
  )
}
