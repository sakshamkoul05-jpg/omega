import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Package, BarChart3, ChevronLeft, ChevronRight, X } from 'lucide-react'
import useUIStore from '../../store/uiStore'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/products', icon: Package, label: 'Products' },
  { to: '/products', icon: BarChart3, label: 'Analytics' },
]

function SidebarContent({ collapsed, onClose }) {
  const location = useLocation()

  return (
    <div
      className="flex flex-col h-full"
      style={{ backgroundColor: 'var(--bg-base)', borderRight: '1px solid var(--bg-border)' }}
    >
      <div className="flex items-center px-5 h-16 border-b" style={{ borderColor: 'var(--bg-border)' }}>
        <span
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: collapsed ? 24 : 28,
            fontWeight: 700,
            color: 'var(--accent-primary)',
            textShadow: '0 0 20px rgba(232,255,71,0.3)',
          }}
        >
          {collapsed ? 'Ω' : 'Omega'}
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.to && (item.to !== '/' || location.pathname === '/')
          return (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className="relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors"
              style={{
                backgroundColor: isActive ? 'var(--bg-elevated)' : 'transparent',
                borderLeft: isActive ? '3px solid var(--accent-primary)' : '3px solid transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-muted)',
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="activeNav"
                  className="absolute inset-0 rounded-lg"
                  style={{ backgroundColor: 'var(--bg-elevated)' }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon size={20} className="relative z-10" />
              {!collapsed && (
                <span className="relative z-10 text-sm font-medium">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      <div
        className="flex items-center gap-3 px-4 py-4 border-t"
        style={{ borderColor: 'var(--bg-border)' }}
      >
        <div
          className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold"
          style={{ backgroundColor: 'rgba(124,58,237,0.2)', color: 'var(--accent-glow)' }}
        >
          AU
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
              Admin User
            </p>
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(232,255,71,0.1)',
                color: 'var(--accent-primary)',
              }}
            >
              Admin
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, sidebarOpen, setSidebarOpen } = useUIStore()

  return (
    <>
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
            style={{ backdropFilter: 'blur(12px)', backgroundColor: 'rgba(8,11,20,0.85)' }}
            onClick={() => setSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              className="w-[240px] h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <SidebarContent collapsed={false} onClose={() => setSidebarOpen(false)} />
            </motion.div>
            <button
              className="absolute top-4 right-4 lg:hidden"
              style={{ color: 'var(--text-muted)' }}
              onClick={() => setSidebarOpen(false)}
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <aside
        className="hidden lg:flex flex-col h-screen sticky top-0 flex-shrink-0 transition-all duration-300"
        style={{ width: sidebarCollapsed ? 56 : 240 }}
      >
        <SidebarContent collapsed={sidebarCollapsed} />
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-1/2 w-6 h-6 rounded-full flex items-center justify-center"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            color: 'var(--text-muted)',
          }}
        >
          {sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
        </button>
      </aside>
    </>
  )
}
