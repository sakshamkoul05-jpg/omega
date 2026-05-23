import { useState, useEffect, useCallback, useRef } from 'react'
import useUIStore from '../store/uiStore'
import indianProducts from '../data/indianProducts'

export function useProducts() {
  const [state, setState] = useState({
    products: [],
    isLoading: true,
    isError: false,
    error: null,
  })
  const setDataUpdatedAt = useUIStore((s) => s.setDataUpdatedAt)
  const intervalRef = useRef(null)

  const loadProducts = useCallback(() => {
    setState((prev) => ({
      ...prev,
      isLoading: !prev.products.length,
      isError: false,
      error: null,
    }))
    setTimeout(() => {
      setState({
        products: indianProducts,
        isLoading: false,
        isError: false,
        error: null,
      })
      setDataUpdatedAt(Date.now())
    }, 300)
  }, [setDataUpdatedAt])

  useEffect(() => {
    loadProducts()
    intervalRef.current = setInterval(() => {
      setDataUpdatedAt(Date.now())
    }, 30000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [loadProducts, setDataUpdatedAt])

  return state
}

export function useProduct(id) {
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isError, setIsError] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    setIsLoading(true)
    setIsError(false)
    setError(null)
    setTimeout(() => {
      const found = indianProducts.find((p) => p.id === Number(id))
      if (found) {
        setProduct(found)
        setIsLoading(false)
      } else {
        setError(new Error('Product not found'))
        setIsError(true)
        setIsLoading(false)
      }
    }, 200)
  }, [id])

  return { data: product, isLoading, isError, error }
}
