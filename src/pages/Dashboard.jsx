import { useEffect, useMemo } from 'react'
import { Package, Star, DollarSign, Tag } from 'lucide-react'
import { useProducts } from '../hooks/useProducts'
import StatCard from '../components/analytics/StatCard'
import CategoryChart from '../components/analytics/CategoryChart'
import RatingChart from '../components/analytics/RatingChart'
import TopValueChart from '../components/analytics/TopValueChart'
import Skeleton from '../components/ui/Skeleton'
import { formatCurrency } from '../utils/formatters'

export default function Dashboard() {
  const { products, isLoading } = useProducts()

  useEffect(() => {
    document.title = 'Dashboard — Omega'
  }, [])

  const stats = useMemo(() => {
    if (!products.length) return null

    const totalProducts = products.length
    const avgRating = (products.reduce((s, p) => s + p.rating, 0) / totalProducts)
    const totalValue = products.reduce((s, p) => s + p.price * p.stock, 0)
    const categories = [...new Set(products.map((p) => p.category))]

    const categoryDistribution = categories
      .map((name) => ({
        name,
        count: products.filter((p) => p.category === name).length,
      }))
      .sort((a, b) => b.count - a.count)

    const ratingBuckets = [
      { name: '1–2★', count: products.filter((p) => p.rating >= 1 && p.rating < 2).length },
      { name: '2–3★', count: products.filter((p) => p.rating >= 2 && p.rating < 3).length },
      { name: '3–4★', count: products.filter((p) => p.rating >= 3 && p.rating < 4).length },
      { name: '4–5★', count: products.filter((p) => p.rating >= 4 && p.rating <= 5).length },
    ]

    const topFiveByValue = products
      .map((p) => ({ name: p.title, value: p.price * p.stock }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5)

    return {
      totalProducts,
      avgRating: avgRating.toFixed(1),
      totalValue,
      categoryCount: categories.length,
      categoryDistribution,
      ratingBuckets,
      topFiveByValue,
    }
  }, [products])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} variant="stat" />
          ))}
        </div>
        <Skeleton variant="card" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton variant="card" />
          <Skeleton variant="card" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Total Products"
          value={stats.totalProducts}
          icon={Package}
          iconBg="#7C3AED"
          trend="↑ +5 this week"
          trendPositive
        />
        <StatCard
          label="Avg Rating"
          value={parseFloat(stats.avgRating)}
          icon={Star}
          iconBg="#FFB347"
          trend="↑ +0.2 vs last month"
          trendPositive
          format={(v) => v.toFixed(1)}
        />
        <StatCard
          label="Inventory Value"
          value={stats.totalValue}
          icon={DollarSign}
          iconBg="#E8FF47"
          trend="↑ +12% growth"
          trendPositive
          format={(v) => formatCurrency(Math.round(v))}
        />
        <StatCard
          label="Categories"
          value={stats.categoryCount}
          icon={Tag}
          iconBg="#FF6B35"
          trend="→ Stable"
          trendPositive
        />
      </div>

      <CategoryChart data={stats.categoryDistribution} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <RatingChart data={stats.ratingBuckets} />
        <TopValueChart data={stats.topFiveByValue} />
      </div>
    </div>
  )
}
