import { Bell } from 'lucide-react'
import LiveIndicator from '../ui/LiveIndicator'
import useUIStore from '../../store/uiStore'

export default function TopNav({ title }) {
  const setSidebarOpen = useUIStore((s) => s.setSidebarOpen)

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between h-16 px-6"
      style={{
        backgroundColor: 'rgba(8,11,20,0.85)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--bg-border)',
      }}
    >
      <div className="flex items-center gap-4">
        <button
          className="lg:hidden"
          style={{ color: 'var(--text-muted)' }}
          onClick={() => setSidebarOpen(true)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <h1
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: 22,
            fontWeight: 600,
            color: 'var(--text-primary)',
          }}
        >
          {title}
        </h1>
      </div>

      <div className="flex items-center gap-5">
        <LiveIndicator />

        <div className="relative">
          <Bell size={20} style={{ color: 'var(--text-muted)' }} />
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold"
            style={{ backgroundColor: 'var(--danger)', color: '#fff' }}
          >
            3
          </span>
        </div>

        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: 'rgba(124,58,237,0.2)', color: 'var(--accent-glow)' }}
        >
          AU
        </div>
      </div>
    </header>
  )
}
