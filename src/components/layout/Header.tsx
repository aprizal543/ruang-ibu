import { ListIcon } from '@phosphor-icons/react'
import { Flower2 } from 'lucide-react'
import { Link } from 'react-router-dom'

interface HeaderProps {
  menuOpen: boolean
  onOpenMenu: () => void
}

export default function Header({ menuOpen, onOpenMenu }: HeaderProps) {
  return (
    <header className="site-header">
      <Link className="brand-lockup" to="/" aria-label="Ruang Ibu, Beranda">
        <span className="brand-lockup__mark" aria-hidden="true"><Flower2 size={20} strokeWidth={1.6} /></span>
        <span>Ruang Ibu</span>
      </Link>
      <button
        className="menu-button"
        type="button"
        aria-label={menuOpen ? 'Tutup menu' : 'Buka menu'}
        aria-expanded={menuOpen}
        aria-controls="site-menu-dialog"
        onClick={onOpenMenu}
      >
        <ListIcon size={23} weight="light" aria-hidden="true" />
      </button>
    </header>
  )
}
