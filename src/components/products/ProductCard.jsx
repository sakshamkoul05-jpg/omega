import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCategoryColor, getStockInfo, renderStars } from '../../utils/formatters'

const ProductCard = memo(function ProductCard({ product }) {
  const navigate = useNavigate()
  const catColor = getCategoryColor(product.category)
  const stock = getStockInfo(product.stock)
  const discount = product.discountPercentage > 0

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-3px)'
        e.currentTarget.style.borderColor = 'var(--accent-primary)'
        e.currentTarget.style.boxShadow = '0 0 24px rgba(232,255,71,0.07)'
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)'
        e.currentTarget.style.borderColor = 'var(--bg-border)'
        e.currentTarget.style.boxShadow = 'none'
      }}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <div
        className="flex items-center justify-center"
        style={{ height: 180, backgroundColor: 'var(--bg-elevated)' }}
      >
        <img
          src={product.thumbnail}
          alt={product.title}
          style={{ maxHeight: 140, objectFit: 'contain' }}
          loading="lazy"
        />
      </div>
      <div className="p-4 space-y-2">
        <p
          className="text-sm font-medium truncate"
          style={{ color: 'var(--text-primary)' }}
        >
          {product.title}
        </p>
        <div className="flex items-center gap-2">
          <span
            className="text-xs px-2 py-0.5 rounded-full font-medium"
            style={{ backgroundColor: catColor.bg, color: catColor.text }}
          >
            {product.category}
          </span>
          {discount && (
            <span
              className="text-xs px-1.5 py-0.5 rounded"
              style={{
                backgroundColor: 'rgba(255,107,53,0.15)',
                color: 'var(--accent-secondary)',
              }}
            >
              -{Math.round(product.discountPercentage)}%
            </span>
          )}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 18,
            fontWeight: 600,
            color: 'var(--accent-primary)',
          }}
        >
          ${product.price.toFixed(2)}
        </div>
        <div className="flex items-center gap-2">
          <span style={{ color: '#FFB347', fontSize: 13 }}>{renderStars(product.rating)}</span>
          <span
            className="text-xs"
            style={{ fontFamily: "'JetBrains Mono', monospace", color: 'var(--text-muted)' }}
          >
            {product.rating.toFixed(1)}
          </span>
        </div>
        <span
          className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
          style={{ backgroundColor: stock.bg, color: stock.color }}
        >
          {stock.label}
        </span>
      </div>
    </div>
  )
})

export default ProductCard
