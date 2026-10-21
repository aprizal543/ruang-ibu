import type { ReactNode } from 'react'

interface EditorialSectionProps {
  id: string
  title: string
  eyebrow?: string
  className?: string
  children: ReactNode
}

export default function EditorialSection({ id, title, eyebrow, className = '', children }: EditorialSectionProps) {
  return (
    <section className={`editorial-section ${className}`} id={id} aria-labelledby={`${id}-title`}>
      <div className="editorial-section__heading">
        {eyebrow && <p className="editorial-section__eyebrow">{eyebrow}</p>}
        <h2 id={`${id}-title`}>{title}</h2>
      </div>
      <div className="editorial-section__body">{children}</div>
    </section>
  )
}
