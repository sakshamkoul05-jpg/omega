import { memo } from 'react'

const Badge = memo(function Badge({ children, variant = 'default', style, className = '' }) {
  const base = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'

  const variants = {
    default: 'bg-[var(--bg-elevated)] text-[var(--text-muted)]',
    primary: 'bg-[var(--accent-primary)] text-[#080B14] font-semibold',
    success: 'bg-[rgba(0,214,143,0.1)] text-[var(--success)]',
    warning: 'bg-[rgba(255,179,71,0.1)] text-[var(--warning)]',
    danger: 'bg-[rgba(255,71,87,0.1)] text-[var(--danger)]',
  }

  return (
    <span className={`${base} ${variants[variant] || variants.default} ${className}`} style={style}>
      {children}
    </span>
  )
})

export default Badge
