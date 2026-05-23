import { useEffect, useMemo, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useProducts } from '../hooks/useProducts'
import { useURLState } from '../hooks/useURLState'
import { useDebounce } from '../hooks/useDebounce'
import ProductFilters from '../components/products/ProductFilters'
import ProductTable from '../components/products/ProductTable'
import ProductGrid from '../components/products/ProductGrid'
import ColumnCustomizer from '../components/products/ColumnCustomizer'
import Skeleton from '../components/ui/Skeleton'
import EmptyState from '../components/ui/EmptyState'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Products() {
  const { products, isLoading } = useProducts()
  const urlState = useURLState()

  const search = urlState.get('search', '')
  const category = urlState.get('category', '')
  const sort = urlState.get('sort', 'name-asc')
  const page = parseInt(urlState.get('page', '1'), 10)
  const view = urlState.get('view', 'table')

  const debouncedSearch = useDebounce(search, 350)

  useEffect(() => {
    document.title = 'Products — Omega'
  }, [])

  const handleSearch = useCallback((val) => {
    urlState.set({ search: val, page: '1' })
  }, [urlState])

  const handleCategoryChange = useCallback((cat) => {
    urlState.set({ category: cat, page: '1' })
  }, [urlState])

  const handleSortChange = useCallback((s) => {
    urlState.set({ sort: s, page: '1' })
  }, [urlState])

  const handlePageChange = useCallback((p) => {
    urlState.set({ page: String(p) })
  }, [urlState])

  const handleViewChange = useCallback((v) => {
    urlState.set({ view: v, page: '1' })
  }, [urlState])

  const filteredProducts = useMemo(() => {
    let result = [...products]

    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      )
    }

    if (category) {
      result = result.filter((p) => p.category === category)
    }

    const [sortField, sortDir] = sort.split('-')
    result.sort((a, b) => {
      const aVal = a[sortField] ?? ''
      const bVal = b[sortField] ?? ''
      if (typeof aVal === 'string') {
        return sortDir === 'asc'
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })

    return result
  }, [products, debouncedSearch, category, sort])

  const perPage = view === 'table' ? 10 : 12
  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage))
  const safePage = Math.min(page, totalPages)
  const paginatedProducts = useMemo(() => {
    const start = (safePage - 1) * perPage
    return filteredProducts.slice(start, start + perPage)
  }, [filteredProducts, safePage, perPage])

  const paginationRange = useMemo(() => {
    const range = []
    const maxVisible = 5
    let start = Math.max(1, safePage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }
    for (let i = start; i <= end; i++) range.push(i)
    return range
  }, [safePage, totalPages])

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <ProductFilters
        search={search}
        onSearchChange={handleSearch}
        category={category}
        onCategoryChange={handleCategoryChange}
        sort={sort}
        onSortChange={handleSortChange}
        view={view}
        onViewChange={handleViewChange}
        products={products}
      />

      <div className="flex items-center justify-between">
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
          {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
        </span>
        {view === 'table' && <ColumnCustomizer />}
      </div>

      {isLoading ? (
        view === 'table' ? (
          <Skeleton variant="table" count={10} />
        ) : (
          <div className="grid gap-4" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))' }}>
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} variant="card" />
            ))}
          </div>
        )
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          title="No products found"
          description="Try adjusting your search or filters."
        />
      ) : (
        <>
          <AnimatePresence mode="wait">
            {view === 'table' ? (
              <ProductTable key="table" products={paginatedProducts} />
            ) : (
              <ProductGrid key="grid" products={paginatedProducts} />
            )}
          </AnimatePresence>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-1.5 pt-4">
              <button
                disabled={safePage <= 1}
                onClick={() => handlePageChange(safePage - 1)}
                className="p-2 rounded-lg transition-colors disabled:opacity-30"
                style={{ color: 'var(--text-muted)' }}
              >
                <ChevronLeft size={18} />
              </button>
              {!paginationRange.includes(1) && (
                <>
                  <button
                    onClick={() => handlePageChange(1)}
                    className="w-8 h-8 text-sm rounded-lg"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    1
                  </button>
                  <span style={{ color: 'var(--text-dim)' }}>...</span>
                </>
              )}
              {paginationRange.map((p) => (
                <button
                  key={p}
                  onClick={() => handlePageChange(p)}
                  className="w-8 h-8 text-sm font-medium rounded-lg transition-all"
                  style={{
                    backgroundColor: p === safePage ? 'var(--accent-primary)' : 'transparent',
                    color: p === safePage ? '#080B14' : 'var(--text-muted)',
                  }}
                >
                  {p}
                </button>
              ))}
              {!paginationRange.includes(totalPages) && (
                <>
                  <span style={{ color: 'var(--text-dim)' }}>...</span>
                  <button
                    onClick={() => handlePageChange(totalPages)}
                    className="w-8 h-8 text-sm rounded-lg"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    {totalPages}
                  </button>
                </>
              )}
              <button
                disabled={safePage >= totalPages}
                onClick={() => handlePageChange(safePage + 1)}
                className="p-2 rounded-lg transition-colors disabled:opacity-30"
                style={{ color: 'var(--text-muted)' }}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  )
}
