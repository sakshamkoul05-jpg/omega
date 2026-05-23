import { lazy, Suspense, Component } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Layout from './components/layout/Layout'

const Dashboard = lazy(() => import('./pages/Dashboard'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-24">
      <div className="flex flex-col items-center gap-3">
        <div
          className="w-8 h-8 rounded-full border-2 animate-spin"
          style={{
            borderColor: 'var(--accent-primary)',
            borderTopColor: 'transparent',
          }}
        />
        <span className="text-sm" style={{ color: 'var(--text-muted)' }}>
          Loading...
        </span>
      </div>
    </div>
  )
}

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-4 px-4" style={{ backgroundColor: 'var(--bg-base)' }}>
          <span className="text-4xl" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--accent-primary)' }}>
            Ω
          </span>
          <h2 className="text-xl font-semibold" style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-primary)' }}>
            Something went wrong
          </h2>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            An unexpected error occurred.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-5 py-2.5 rounded-xl font-medium text-sm transition-all"
            style={{
              backgroundColor: 'var(--accent-primary)',
              color: '#080B14',
            }}
          >
            Retry
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

export default function App() {
  const location = useLocation()

  return (
    <ErrorBoundary>
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingFallback />}>
          <Routes location={location} key={location.pathname}>
            <Route element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="products" element={<Products />} />
              <Route path="products/:id" element={<ProductDetail />} />
            </Route>
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  )
}
