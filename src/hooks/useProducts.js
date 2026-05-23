import { useQuery } from '@tanstack/react-query'
import useUIStore from '../store/uiStore'
import { useEffect } from 'react'

const API = 'https://dummyjson.com/products?limit=100'

async function fetchProducts() {
  const res = await fetch(API)
  if (!res.ok) throw new Error('Failed to fetch products')
  const data = await res.json()
  return data.products
}

export function useProducts() {
  const setDataUpdatedAt = useUIStore((s) => s.setDataUpdatedAt)

  const query = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
    refetchInterval: 30000,
  })

  useEffect(() => {
    if (query.dataUpdatedAt) {
      setDataUpdatedAt(query.dataUpdatedAt)
    }
  }, [query.dataUpdatedAt, setDataUpdatedAt])

  return {
    products: query.data || [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  }
}

export function useProduct(id) {
  return useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const res = await fetch(`https://dummyjson.com/products/${id}`)
      if (!res.ok) {
        if (res.status === 404) throw new Error('Product not found')
        throw new Error('Failed to fetch product')
      }
      return res.json()
    },
    enabled: !!id,
  })
}
