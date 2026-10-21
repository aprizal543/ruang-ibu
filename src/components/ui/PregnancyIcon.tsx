interface PregnancyIconProps {
  size?: number
  weight?: 'light' | 'regular' | 'fill'
  className?: string
  'aria-hidden'?: boolean
}

export default function PregnancyIcon({ size = 24, weight = 'light', className, 'aria-hidden': ariaHidden = true }: PregnancyIconProps) {
  const strokeWidth = weight === 'light' ? 1.7 : 1.9

  return (
    <svg
      aria-hidden={ariaHidden}
      className={className}
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12.8" cy="6.5" r="3.2" />
      <path d="M10.8 10.3c-1.7 1.3-2.6 3.2-2.5 5.7l.3 6.1c.1 1.8 1.4 3.1 3.2 3.1h8.5c2.5 0 3.7-2.8 2-4.6-1.5-1.5-2-3.3-2-5.1 0-2.5-1.8-4.7-4.2-5.2" />
      <path d="M12 16c2 .1 3.1 1.1 4.6 2.1 1.4 1 3 1.2 4.8.4" />
      <path d="m12 25.2-.7 3.1m7.1-3.1.8 3.1" />
      {weight === 'fill' && <path d="M16.6 17.8c1.4 1.1 3 1.2 4.8.6-.1 1.4.6 2.6 1.6 3.7 1.4 1.5.4 3.5-1.7 3.5h-7.4c1.9-1.3 2.9-3.9 2.7-7.8Z" fill="currentColor" stroke="none" />}
    </svg>
  )
}
