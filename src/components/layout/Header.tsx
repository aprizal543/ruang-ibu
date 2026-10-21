import { ListIcon } from '@phosphor-icons/react'
import { Flower2 } from 'lucide-react'

export default function Header() {
  return (
    <header className="site-header">
      <a className="brand-lockup" href="/" aria-label="Ruang Ibu, Beranda">
        <span className="brand-lockup__mark" aria-hidden="true"><Flower2 size={20} strokeWidth={1.6} /></span>
        <span>Ruang Ibu</span>
      </a>
      <button className="menu-button" type="button" aria-label="Menu belum tersedia" disabled>
        <ListIcon size={23} weight="light" aria-hidden="true" />
      </button>
    </header>
  )
}
