import { memo, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { TrendingUp, ShoppingCart, Star, Package, X } from 'lucide-react'

const icons = {
  price_update: TrendingUp,
  stock_update: ShoppingCart,
  new_review: Star,
  restock: Package,
  cart_add: ShoppingCart,
}

const colors = {
  price_update: 'var(--accent-primary)',
  stock_update: 'var(--warning)',
  new_review: '#FFB347',
  restock: 'var(--success)',
  cart_add: 'var(--accent-primary)',
}

function ToastItem({ event, onDismiss }) {
  const Icon = icons[event.type] || Package
  const color = colors[event.type] || 'var(--text-muted)'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: 80, scale: 0.95 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      className="flex items-start gap-3 p-3 pr-10 rounded-xl shadow-lg relative overflow-hidden"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--bg-border)',
        minWidth: 280,
        maxWidth: 360,
      }}
    >
      <div
        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: `${color}1a` }}
      >
        <Icon size={16} color={color} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium truncate" style={{ color: 'var(--text-primary)' }}>
          {event.message}
        </p>
        {event.type === 'price_update' && (
          <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
            ${event.oldValue.toFixed(2)} → <span style={{ color: 'var(--accent-primary)' }}>${event.newValue.toFixed(2)}</span>
          </p>
        )}
        {(event.type === 'stock_update' || event.type === 'restock') && (
          <p className="text-xs mt-0.5" style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}>
            {event.oldValue} → <span style={{ color: 'var(--success)' }}>{event.newValue} units</span>
          </p>
        )}
        {event.type === 'new_review' && event.reviewer && (
          <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>
            {event.reviewer} · <span style={{ color: '#FFB347' }}>{'★'.repeat(Math.round(event.newValue))}</span>
          </p>
        )}
      </div>
      <button
        onClick={() => onDismiss(event.timestamp)}
        className="absolute top-2 right-2"
        style={{ color: 'var(--text-dim)' }}
      >
        <X size={14} />
      </button>
      <div
        className="absolute bottom-0 left-0 h-0.5"
        style={{
          backgroundColor: color,
          width: '100%',
          animation: 'shrink 4s linear forwards',
        }}
      />
    </motion.div>
  )
}

export default function Toast({ events, onDismiss }) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
      <AnimatePresence>
        {events.map((event) => (
          <ToastItem key={event.timestamp} event={event} onDismiss={onDismiss} />
        ))}
      </AnimatePresence>
    </div>
  )
}
