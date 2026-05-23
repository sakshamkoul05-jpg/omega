import { useEffect } from 'react'
import useUIStore from '../store/uiStore'

export function useProducts() {
  const products = useUIStore((s) => s.products)
  const productsLoaded = useUIStore((s) => s.productsLoaded)
  const loadProducts = useUIStore((s) => s.loadProducts)
  const setDataUpdatedAt = useUIStore((s) => s.setDataUpdatedAt)

  useEffect(() => {
    if (!productsLoaded) {
      loadProducts()
    }
  }, [productsLoaded, loadProducts])

  useEffect(() => {
    const interval = setInterval(() => {
      setDataUpdatedAt(Date.now())
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
    isLoading: !product && products.length > 0 ? false : !product,
    isError: !product && products.length > 0,
    error: !product && products.length > 0 ? new Error('Product not found') : null,
  }
}
