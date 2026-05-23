import { memo, useMemo } from 'react'
import { Search, LayoutList, LayoutGrid } from 'lucide-react'

const ProductFilters = memo(function ProductFilters({
  search,
  onSearchChange,
  category,
  onCategoryChange,
  sort,
  onSortChange,
  view,
  onViewChange,
  products,
}) {
  const categories = useMemo(() => {
    if (!products.length) return ['all']
    const cats = ['all', ...new Set(products.map((p) => p.category))]
    return cats.sort()
  }, [products])

  return (
    <div
      className="flex items-center gap-4 flex-wrap"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--bg-border)',
        borderRadius: 16,
        padding: '12px 20px',
      }}
    >
      <div className="relative flex items-center" style={{ minWidth: 0 }}>
        <Search
          size={16}
          className="absolute left-3 pointer-events-none"
          style={{ color: 'var(--text-dim)' }}
        />
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search products..."
          className="py-2 text-sm transition-all duration-200"
          style={{
            paddingLeft: 36,
            paddingRight: 12,
            width: 180,
            backgroundColor: 'transparent',
            border: 'none',
            color: 'var(--text-primary)',
            fontFamily: "'Outfit', sans-serif",
          }}
          onFocus={(e) => (e.target.style.width = '280px')}
          onBlur={(e) => !e.target.value && (e.target.style.width = '180px')}
        />
      </div>

      <div
        className="flex items-center gap-2 overflow-x-auto"
        style={{ flex: 1, minWidth: 0 }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => onCategoryChange(cat === 'all' ? '' : cat)}
            className="text-sm px-3 py-1.5 rounded-lg whitespace-nowrap transition-all duration-150 font-medium"
            style={{
              backgroundColor:
                (cat === 'all' && !category) || cat === category
                  ? 'var(--accent-primary)'
                  : 'var(--bg-elevated)',
              color:
                (cat === 'all' && !category) || cat === category
                  ? '#080B14'
                  : 'var(--text-muted)',
              border:
                (cat === 'all' && !category) || cat === category
                  ? '1px solid var(--accent-primary)'
                  : '1px solid transparent',
            }}
            onMouseEnter={(e) => {
              if (!((cat === 'all' && !category) || cat === category)) {
                e.currentTarget.style.borderColor = 'var(--accent-primary)'
              }
            }}
            onMouseLeave={(e) => {
              if (!((cat === 'all' && !category) || cat === category)) {
                e.currentTarget.style.borderColor = 'transparent'
              }
            }}
          >
            {cat === 'all' ? 'All' : cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value)}
          className="text-sm py-1.5 px-3 rounded-lg cursor-pointer"
          style={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--bg-border)',
            color: 'var(--text-primary)',
            fontFamily: "'Outfit', sans-serif",
          }}
        >
          <option value="name-asc">Name A-Z</option>
          <option value="name-desc">Name Z-A</option>
          <option value="price-asc">Price Low-High</option>
          <option value="price-desc">Price High-Low</option>
          <option value="rating-desc">Rating High-Low</option>
        </select>

        <div className="flex rounded-lg overflow-hidden" style={{ border: '1px solid var(--bg-border)' }}>
          <button
            onClick={() => onViewChange('table')}
            className="p-2 transition-colors"
            style={{
              backgroundColor: view === 'table' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
              color: view === 'table' ? '#080B14' : 'var(--text-muted)',
            }}
          >
            <LayoutList size={16} />
          </button>
          <button
            onClick={() => onViewChange('grid')}
            className="p-2 transition-colors"
            style={{
              backgroundColor: view === 'grid' ? 'var(--accent-primary)' : 'var(--bg-elevated)',
              color: view === 'grid' ? '#080B14' : 'var(--text-muted)',
            }}
          >
            <LayoutGrid size={16} />
          </button>
        </div>
      </div>
    </div>
  )
})

export default ProductFilters
