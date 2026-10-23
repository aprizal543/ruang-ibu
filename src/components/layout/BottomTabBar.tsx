import { ClipboardTextIcon, HandHeartIcon, HeadphonesIcon, HouseIcon, UsersThreeIcon } from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import PregnancyIcon from '../ui/PregnancyIcon'

const tabs = [
  { label: 'Beranda', to: '/', Icon: HouseIcon },
  { label: 'Terapi', to: '/terapi', Icon: HandHeartIcon },
  { label: 'Hamil', to: '/hamil', Icon: PregnancyIcon },
  { label: 'Bersalin', to: '/bersalin', Icon: UsersThreeIcon },
  { label: 'Relaksasi', to: '/relaksasi', Icon: HeadphonesIcon },
  { label: 'Evaluasi', to: '/evaluasi', Icon: ClipboardTextIcon },
]

export default function BottomTabBar() {
  return (
    <nav className="bottom-tabs" aria-label="Navigasi utama">
      {tabs.map(({ label, to, Icon }) => (
        <NavLink
          className={({ isActive }) => `bottom-tabs__item${isActive ? ' is-active' : ''}`}
          end={to === '/'}
          key={to}
          to={to}
        >
          {({ isActive }) => (
            <>
              <Icon size={23} weight={isActive ? 'fill' : 'light'} aria-hidden={true} />
              <span>{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
