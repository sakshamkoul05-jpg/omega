import { useSearchParams } from 'react-router-dom'
import { useCallback } from 'react'

export function useURLState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const get = useCallback((key, fallback = '') => {
    return searchParams.get(key) || fallback
  }, [searchParams])

  const set = useCallback((updates) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev)
      Object.entries(updates).forEach(([key, value]) => {
        if (!value || value === 'all') {
          next.delete(key)
        } else {
          next.set(key, value)
        }
      })
      return next
    })
  }, [setSearchParams])

  return { get, set, searchParams }
}
