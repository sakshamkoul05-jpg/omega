import { memo, useEffect, useRef, useState } from 'react'
import { animateValue } from '../../utils/formatters'
import useUIStore from '../../store/uiStore'

const StatCard = memo(function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  trend,
  trendPositive,
  format,
}) {
  const [displayValue, setDisplayValue] = useState(0)
  const rawRef = useRef(0)
  const animatedRef = useRef(false)
  const dataUpdatedAt = useUIStore((s) => s.dataUpdatedAt)
  const [flash, setFlash] = useState(false)

  const rawValue = typeof value === 'number' ? value : parseFloat(String(value).replace(/[^0-9.-]/g, '')) || 0

  useEffect(() => {
    if (!animatedRef.current) {
      animatedRef.current = true
      const from = 0
      animateValue(from, rawValue, 1200, (val) => {
        rawRef.current = val
        setDisplayValue(val)
      })
    }
  }, [rawValue])

  useEffect(() => {
    if (dataUpdatedAt) {
      setFlash(true)
      const timer = setTimeout(() => setFlash(false), 600)
      return () => clearTimeout(timer)
    }
  }, [dataUpdatedAt])

  const formatted = format
    ? format(displayValue)
    : typeof value === 'number'
      ? Math.round(displayValue).toLocaleString()
      : value

  return (
    <div
      className={`stat-card p-5 rounded-2xl transition-all duration-200 ${flash ? 'flash' : ''}`}
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-2px)'
        e.currentTarget.style.borderColor = 'rgba(232,255,71,0.3)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--bg-border)'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${iconBg}26` }}
        >
          <Icon size={18} color={iconBg} />
        </div>
        <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>
          {label}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 36,
          fontWeight: 600,
          color: 'var(--text-primary)',
          lineHeight: 1.1,
        }}
      >
        {formatted}
      </div>
      {trend && (
        <div className="flex items-center gap-1.5 mt-2">
          <span
            className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{
              backgroundColor: trendPositive
                ? 'rgba(0,214,143,0.1)'
                : 'rgba(255,71,87,0.1)',
              color: trendPositive ? 'var(--success)' : 'var(--danger)',
            }}
          >
            {trend}
          </span>
        </div>
      )}
    </div>
  )
})

export default StatCard
