import { memo } from 'react'

const Skeleton = memo(function Skeleton({ variant = 'text', count = 1, className = '' }) {
  if (variant === 'card') {
    return (
      <div className={`skeleton ${className}`} style={{ height: 280, width: '100%' }} />
    )
  }

  if (variant === 'table') {
    return (
      <div className="space-y-3" style={{ width: '100%' }}>
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: 48, width: '100%' }} />
        ))}
      </div>
    )
  }

  if (variant === 'stat') {
    return (
      <div className="space-y-3" style={{ padding: 20 }}>
        <div className="skeleton" style={{ height: 16, width: 120 }} />
        <div className="skeleton" style={{ height: 36, width: 180, marginTop: 12 }} />
        <div className="skeleton" style={{ height: 14, width: 80, marginTop: 8 }} />
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={`skeleton ${className}`}
          style={{ height: 16, width: `${60 + Math.random() * 40}%` }}
        />
      ))}
    </div>
  )
})

export default Skeleton
