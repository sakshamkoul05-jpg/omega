import { memo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import { getCategoryColor, getStockInfo, renderStars, formatPrice } from '../../utils/formatters'
import useUIStore from '../../store/uiStore'

const ProductRow = memo(function ProductRow({ product, index }) {
  const navigate = useNavigate()
  const catColor = getCategoryColor(product.category)
  const stock = getStockInfo(product.stock)
  const columns = useUIStore((s) => s.columns)

  const visibleColumns = columns.filter((c) => c.visible).sort((a, b) => a.order - b.order)

  return (
    <motion.tr
      initial={{ opacity: 0, x: -4 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2, delay: index * 0.025 }}
      className="cursor-pointer transition-colors duration-150"
      style={{ backgroundColor: 'var(--bg-surface)' }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-elevated)')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-surface)')}
      onClick={() => navigate(`/products/${product.id}`)}
    >
      <td className="px-3 py-3">
        <input
          type="checkbox"
          className="rounded"
          style={{ accentColor: 'var(--accent-primary)' }}
          onClick={(e) => e.stopPropagation()}
        />
      </td>
      {visibleColumns.map((col) => {
        switch (col.id) {
          case 'image':
            return (
              <td key={col.id} className="px-3 py-3">
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: 'var(--bg-elevated)' }}
                >
                  <img
                    src={product.thumbnail}
                    alt=""
                    className="w-full h-full rounded-lg"
                    style={{ objectFit: 'contain' }}
                  />
                </div>
              </td>
            )
          case 'name':
            return (
              <td key={col.id} className="px-3 py-3">
                <span
                  className="text-sm font-medium block truncate"
                  style={{ maxWidth: 200, color: 'var(--text-primary)' }}
                >
                  {product.title}
                </span>
              </td>
            )
          case 'category':
            return (
              <td key={col.id} className="px-3 py-3">
                <span
                  className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: catColor.bg, color: catColor.text }}
                >
                  {product.category}
                </span>
              </td>
            )
          case 'price':
            return (
              <td key={col.id} className="px-3 py-3">
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--accent-primary)',
                    fontSize: 14,
                  }}
                >
                  {formatPrice(product.price)}
                </span>
              </td>
            )
          case 'stock':
            return (
              <td key={col.id} className="px-3 py-3">
                <span
                  className="inline-block text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ backgroundColor: stock.bg, color: stock.color }}
                >
                  {stock.label}
                </span>
              </td>
            )
          case 'rating':
            return (
              <td key={col.id} className="px-3 py-3">
                <div className="flex items-center gap-1.5">
                  <span style={{ color: '#FFB347', fontSize: 13 }}>{renderStars(product.rating)}</span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 12,
                      color: 'var(--text-muted)',
                    }}
                  >
                    {product.rating.toFixed(1)}
                  </span>
                </div>
              </td>
            )
          case 'actions':
            return (
              <td key={col.id} className="px-3 py-3">
                <button
                  className="p-1.5 rounded-lg transition-colors"
                  style={{ color: 'var(--text-muted)' }}
                  onClick={(e) => {
                    e.stopPropagation()
                    navigate(`/products/${product.id}`)
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <Eye size={16} />
                </button>
              </td>
            )
          default:
            return null
        }
      })}
    </motion.tr>
  )
})

const ProductTable = memo(function ProductTable({ products }) {
  const columns = useUIStore((s) => s.columns)
  const visibleColumns = columns.filter((c) => c.visible).sort((a, b) => a.order - b.order)

  return (
    <div className="overflow-x-auto">
      <table
        style={{
          width: '100%',
          borderCollapse: 'separate',
          borderSpacing: 0,
        }}
      >
        <thead>
          <tr
            style={{
              backgroundColor: 'var(--bg-base)',
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--text-dim)',
            }}
          >
            <th className="px-3 py-3 text-left font-medium">
              <input
                type="checkbox"
                className="rounded"
                style={{ accentColor: 'var(--accent-primary)' }}
              />
            </th>
            {visibleColumns.map((col) => (
              <th key={col.id} className="px-3 py-3 text-left font-medium">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <ProductRow key={product.id} product={product} index={index} />
          ))}
        </tbody>
      </table>
    </div>
  )
})

export default ProductTable
