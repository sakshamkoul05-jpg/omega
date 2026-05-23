import { useEffect } from 'react'
import useUIStore from '../store/uiStore'

const API = 'https://dummyjson.com/products?limit=100'
const USD_TO_INR = 87

async function fetchProducts() {
  const res = await fetch(API)
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json()
  return data.products.map((p) => ({
    ...p,
    price: Math.round(p.price * USD_TO_INR * 100) / 100,
  }))
}

export function useProducts() {
  const products = useUIStore((s) => s.products)
  const productsLoaded = useUIStore((s) => s.productsLoaded)
  const loadProducts = useUIStore((s) => s.loadProducts)
  const setDataUpdatedAt = useUIStore((s) => s.setDataUpdatedAt)

  useEffect(() => {
    if (!productsLoaded) {
      fetchProducts()
        .then((data) => {
          useUIStore.getState().setProducts(data)
          useUIStore.getState().setProductsLoaded(true)
          setDataUpdatedAt(Date.now())
        })
        .catch(() => {
          useUIStore.getState().setProducts([])
          useUIStore.getState().setProductsLoaded(true)
        })
    }
  }, [productsLoaded, setDataUpdatedAt])

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const data = await fetchProducts()
        useUIStore.getState().setProducts(data)
        setDataUpdatedAt(Date.now())
      } catch {
        // silent
      }
    }, 30000)
    return () => clearInterval(interval)
  }, [setDataUpdatedAt])

  return {
    products,
    isLoading: !productsLoaded,
    isError: false,
    error: null,
    refetch: loadProducts,
  }
}

export function useProduct(id) {
  const products = useUIStore((s) => s.products)

  const product = products.find((p) => p.id === Number(id))

  return {
    data: product || null,
    isLoading: !product && products.length === 0,
    isError: !product && products.length > 0,
    error: !product && products.length > 0 ? new Error('Product not found') : null,
  }
}
