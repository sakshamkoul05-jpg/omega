import { useEffect, useState, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, ShoppingCart, ArrowLeft } from 'lucide-react'
import { useProduct } from '../hooks/useProducts'
import useUIStore from '../store/uiStore'
import { getCategoryColor, getStockInfo, renderStars, formatPrice } from '../utils/formatters'
import Skeleton from '../components/ui/Skeleton'
import Badge from '../components/ui/Badge'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, isLoading, isError, error } = useProduct(id)
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    document.title = product ? `${product.title} — Omega` : 'Omega'
  }, [product])

  const images = product?.images?.length ? product.images : product?.thumbnail ? [product.thumbnail] : []

  const handleCartClick = useCallback((e, product) => {
    e.currentTarget.style.transform = 'scale(0.95)'
    setTimeout(() => { e.currentTarget.style.transform = 'scale(1)' }, 150)
    useUIStore.getState().handleWsEvent({
      type: 'cart_add',
      productId: product.id,
      productTitle: product.title,
      message: `${product.title} added to cart`,
    })
  }, [])

  const handlePrev = useCallback(() => {
    setActiveIndex((i) => (i === 0 ? images.length - 1 : i - 1))
  }, [images.length])

  const handleNext = useCallback(() => {
    setActiveIndex((i) => (i === images.length - 1 ? 0 : i + 1))
  }, [images.length])

  useEffect(() => {
    function handleKey(e) {
      if (e.key === 'ArrowLeft') handlePrev()
      if (e.key === 'ArrowRight') handleNext()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handlePrev, handleNext])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="skeleton" style={{ height: 20, width: 200 }} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton variant="card" />
          <div className="space-y-4">
            <Skeleton count={4} />
          </div>
        </div>
      </div>
    )
  }

  if (isError || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <p className="text-lg font-semibold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-primary)' }}>
          {error?.message === 'Product not found' ? 'Product not found' : 'Something went wrong'}
        </p>
        <button
          onClick={() => navigate('/products')}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            color: 'var(--text-primary)',
          }}
        >
          <ArrowLeft size={16} />
          Back to Products
        </button>
      </div>
    )
  }

  const stock = getStockInfo(product.stock)
  const catColor = getCategoryColor(product.category)
  const discount = product.discountPercentage > 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-1.5 text-sm mb-4 transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <ArrowLeft size={16} />
        Back to Products
      </button>

      <nav className="flex items-center gap-2 text-xs mb-8" style={{ color: 'var(--text-dim)' }}>
        <button onClick={() => navigate('/')} style={{ color: 'var(--text-muted)' }}>
          Dashboard
        </button>
        <span>/</span>
        <button onClick={() => navigate('/products')} style={{ color: 'var(--text-muted)' }}>
          Products
        </button>
        <span>/</span>
        <span style={{ color: 'var(--text-primary)' }}>{product.title}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div>
          <div className="relative">
            <div
              className="w-full flex items-center justify-center overflow-hidden"
              style={{
                height: 400,
                backgroundColor: 'var(--bg-elevated)',
                borderRadius: 16,
                border: '1px solid var(--bg-border)',
              }}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeIndex}
                  src={images[activeIndex]}
                  alt={product.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{ maxWidth: '80%', maxHeight: '80%', objectFit: 'contain' }}
                />
              </AnimatePresence>
            </div>

            {images.length > 1 && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: 'rgba(13,17,23,0.8)',
                    border: '1px solid var(--bg-border)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={handleNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors"
                  style={{
                    backgroundColor: 'rgba(13,17,23,0.8)',
                    border: '1px solid var(--bg-border)',
                    color: 'var(--text-muted)',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--text-primary)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-2 mt-3 overflow-x-auto" style={{ paddingBottom: 4 }}>
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveIndex(i)}
                  className="flex-shrink-0 rounded-lg overflow-hidden transition-all"
                  style={{
                    width: 64,
                    height: 64,
                    backgroundColor: 'var(--bg-elevated)',
                    border: i === activeIndex ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  }}
                >
                  <img
                    src={img}
                    alt=""
                    className="w-full h-full"
                    style={{ objectFit: 'contain' }}
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p
            className="text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: 'var(--text-muted)' }}
          >
            {product.brand || 'Unknown Brand'}
          </p>

          <h1
            className="text-[28px] font-bold leading-tight mb-2"
            style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-primary)' }}
          >
            {product.title}
          </h1>

          <div className="flex items-center gap-2 mb-4">
            <span
              className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ backgroundColor: catColor.bg, color: catColor.text }}
            >
              {product.category}
            </span>
            <Badge variant="default">{product.tags?.[0] || 'General'}</Badge>
          </div>

          <div className="flex items-center gap-2 mb-4">
            <span style={{ color: '#FFB347', fontSize: 16 }}>{renderStars(product.rating)}</span>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: 'var(--text-muted)' }}>
              ({product.reviews?.length || 0} reviews)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4">
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 32,
                fontWeight: 600,
                color: 'var(--accent-primary)',
              }}
            >
              {formatPrice(product.price * (1 - (product.discountPercentage || 0) / 100))}
            </div>
            {discount && (
              <>
                <span
                  className="text-lg"
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: 'var(--text-dim)',
                    textDecoration: 'line-through',
                  }}
                >
                  {formatPrice(product.price)}
                </span>
                <span
                  className="text-xs font-semibold px-2 py-0.5 rounded"
                  style={{
                    backgroundColor: 'rgba(255,107,53,0.15)',
                    color: 'var(--accent-secondary)',
                  }}
                >
                  -{Math.round(product.discountPercentage)}% OFF
                </span>
              </>
            )}
          </div>

          <span
            className="inline-block text-xs px-3 py-1 rounded-full font-medium mb-4"
            style={{ backgroundColor: stock.bg, color: stock.color }}
          >
            {stock.label} ({product.stock} units)
          </span>

          <p className="text-sm mt-4 leading-relaxed" style={{ color: 'var(--text-muted)', lineHeight: 1.7 }}>
            {product.description}
          </p>

          <div
            className="mt-6 rounded-xl p-4"
            style={{ backgroundColor: 'var(--bg-elevated)' }}
          >
            <div className="grid grid-cols-2 gap-3 text-sm">
              <Spec label="SKU" value={product.sku} />
              <Spec label="Brand" value={product.brand || '—'} />
              <Spec label="Weight" value={product.weight ? `${product.weight}g` : '—'} isNum />
              <Spec label="Dimensions" value={product.dimensions ? `${product.dimensions.width}×${product.dimensions.height}×${product.dimensions.depth}cm` : '—'} />
              <Spec label="Warranty" value={product.warrantyInformation || '—'} />
              <Spec label="Min Order" value={product.minimumOrderQuantity ? String(product.minimumOrderQuantity) : '—'} isNum />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mt-4">
            {product.tags?.map((tag) => (
              <Badge key={tag}>{tag}</Badge>
            ))}
          </div>

          <button
            onClick={(e) => handleCartClick(e, product)}
            className="w-full mt-6 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold transition-all duration-150"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#080B14',
            }}
            onMouseEnter={(e) => { if (!e.currentTarget.style.transform || e.currentTarget.style.transform === 'none' || e.currentTarget.style.transform === 'matrix(1, 0, 0, 1, 0, 0)') e.currentTarget.style.transform = 'scale(1.02)' }}
            onMouseLeave={(e) => { e.currentTarget.style.transform = 'scale(1)' }}
          >
            <ShoppingCart size={18} />
            Add to Cart — {formatPrice(product.price)}
          </button>
        </div>
      </div>
    </motion.div>
  )
}

function Spec({ label, value, isNum }) {
  return (
    <div>
      <span className="text-xs" style={{ color: 'var(--text-dim)' }}>
        {label}
      </span>
      <p
        className="text-sm"
        style={{
          color: 'var(--text-primary)',
          fontFamily: isNum ? "'JetBrains Mono', monospace" : "'Outfit', sans-serif",
        }}
      >
        {value}
      </p>
    </div>
  )
}
