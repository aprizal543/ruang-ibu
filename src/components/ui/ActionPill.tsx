import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface ActionPillProps {
  href: string
  variant: 'primary' | 'secondary'
  icon: ReactNode
  children: ReactNode
}

export default function ActionPill({ href, variant, icon, children }: ActionPillProps) {
  return (
    <Link className={`action-pill action-pill--${variant}`} to={href}>
      <span>{children}</span>
      <span className="action-pill__icon" aria-hidden="true">{icon}</span>
    </Link>
  )
}
