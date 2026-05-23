import { Outlet, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Sidebar from './Sidebar'
import TopNav from './TopNav'
import Toast from '../ui/Toast'
import useUIStore from '../../store/uiStore'
import indianProducts from '../../data/indianProducts'

const pageTitles = {
  '/': 'Dashboard',
  '/products': 'Products',
}

const UPDATE_TYPES = ['price', 'stock', 'review', 'restock']

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateUpdate(products) {
  const type = pickRandom(UPDATE_TYPES)
  const product = pickRandom(products)
  if (!product) return null

  switch (type) {
    case 'price': {
      const change = (Math.random() * 0.15 - 0.05) * product.price
      const newPrice = Math.round((product.price + change) * 100) / 100
      return { type: 'price_update', productId: product.id, productTitle: product.title, oldValue: product.price, newValue: newPrice }
    }
    case 'stock': {
      const delta = Math.floor(Math.random() * 15) + 1
      const decrease = Math.random() > 0.4
      const newStock = Math.max(0, decrease ? product.stock - delta : product.stock + delta)
      return { type: 'stock_update', productId: product.id, productTitle: product.title, oldValue: product.stock, newValue: newStock }
    }
    case 'review': {
      const rating = Math.round((3 + Math.random() * 2) * 2) / 2
      return { type: 'new_review', productId: product.id, productTitle: product.title, oldValue: null, newValue: rating }
    }
    case 'restock': {
      const qty = Math.floor(Math.random() * 50) + 10
      return { type: 'restock', productId: product.id, productTitle: product.title, oldValue: product.stock, newValue: product.stock + qty }
    }
    default:
      return null
  }
}

function useLiveUpdates() {
  const products = useUIStore((s) => s.products)
  const productsLoaded = useUIStore((s) => s.productsLoaded)
  const handleWsEvent = useUIStore((s) => s.handleWsEvent)
  const intervalRef = useRef(null)

  useEffect(() => {
    if (!productsLoaded || !products.length) return

    const schedule = () => {
      const delay = 12000 + Math.random() * 10000
      intervalRef.current = setTimeout(() => {
        const event = generateUpdate(products)
        if (event) {
          handleWsEvent({
            ...event,
            message: getMessage(event),
            reviewer: event.type === 'new_review' ? pickRandom(['Ananya Gupta', 'Rohit Sharma', 'Priya Patel', 'Amit Singh', 'Neha Kapoor']) : undefined,
          })
        }
        schedule()
      }, delay)
    }

    schedule()
    return () => {
      if (intervalRef.current) clearTimeout(intervalRef.current)
    }
  }, [products, productsLoaded, handleWsEvent])
}

function getMessage(event) {
  switch (event.type) {
    case 'price_update': return `Price updated: ${event.productTitle}`
    case 'stock_update': return `Sale on ${event.productTitle}`
    case 'new_review': return `New ${event.newValue}★ review on ${event.productTitle}`
    case 'restock': return `${event.productTitle} restocked`
    default: return ''
  }
}

export default function Layout() {
  const location = useLocation()
  const title = pageTitles[location.pathname] || 'Omega'
  const toasts = useUIStore((s) => s.toasts)
  const dismissToast = useUIStore((s) => s.dismissToast)
  const productsLoaded = useUIStore((s) => s.productsLoaded)

  useLiveUpdates()

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col" style={{ minWidth: 0 }}>
        <TopNav title={title} />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
      {productsLoaded && <Toast events={toasts} onDismiss={dismissToast} />}
    </div>
  )
}
