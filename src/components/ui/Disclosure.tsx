import { useEffect, useRef, type ReactNode } from 'react'
import { CaretDownIcon } from '@phosphor-icons/react'
import '../../styles/disclosure.css'

interface DisclosureProps {
  id: string
  title: string
  children: ReactNode
  className?: string
}

export default function Disclosure({ id, title, children, className = '' }: DisclosureProps) {
  const detailsRef = useRef<HTMLDetailsElement>(null)

  useEffect(() => {
    const syncHash = () => {
      if (window.location.hash === `#${id}` && detailsRef.current) {
        detailsRef.current.open = true
      }
    }
    syncHash()
    window.addEventListener('hashchange', syncHash)
    return () => window.removeEventListener('hashchange', syncHash)
  }, [id])

  return (
    <section id={id} className={`content-disclosure ${className}`} aria-label={title}>
      <details className="content-disclosure__details" ref={detailsRef} data-disclosure>
        <summary>
          <span>{title}</span>
          <CaretDownIcon size={19} weight="regular" aria-hidden="true" />
        </summary>
        <div className="content-disclosure__body">{children}</div>
      </details>
    </section>
  )
}
