export function formatCurrency(value) {
  return '$' + value.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })
}

export function formatPrice(value) {
  return '$' + value.toFixed(2)
}

export function truncate(str, len = 20) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '...' : str
}

export function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3)
}

export function animateValue(from, to, duration, onFrame, onDone) {
  const start = performance.now()

  function tick(now) {
    const elapsed = now - start
    const progress = Math.min(elapsed / duration, 1)
    const eased = easeOutCubic(progress)
    const current = from + (to - from) * eased

    onFrame(current)

    if (progress < 1) {
      requestAnimationFrame(tick)
    } else if (onDone) {
      onDone()
    }
  }

  requestAnimationFrame(tick)
}

export function getCategoryColor(category) {
  const colors = [
    { bg: 'rgba(124,58,237,0.15)', text: '#7C3AED' },
    { bg: 'rgba(0,214,143,0.15)', text: '#00D68F' },
    { bg: 'rgba(255,107,53,0.15)', text: '#FF6B35' },
    { bg: 'rgba(232,75,133,0.15)', text: '#E84B85' },
    { bg: 'rgba(59,130,246,0.15)', text: '#3B82F6' },
    { bg: 'rgba(16,185,129,0.15)', text: '#10B981' },
  ]
  let hash = 0
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}

export function getStockInfo(stock) {
  if (stock === 0) return { label: 'Out of Stock', color: 'var(--text-dim)', bg: 'rgba(58,69,88,0.2)' }
  if (stock < 10) return { label: 'Critical', color: 'var(--danger)', bg: 'rgba(255,71,87,0.1)' }
  if (stock < 50) return { label: 'Low Stock', color: 'var(--warning)', bg: 'rgba(255,179,71,0.1)' }
  return { label: 'In Stock', color: 'var(--success)', bg: 'rgba(0,214,143,0.1)' }
}

export function renderStars(rating) {
  const full = Math.floor(rating)
  const half = rating % 1 >= 0.5 ? 1 : 0
  const empty = 5 - full - half
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(empty)
}
