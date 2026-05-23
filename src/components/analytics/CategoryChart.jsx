import { memo } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { truncate } from '../../utils/formatters'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const data = payload[0].payload
  return (
    <div
      className="p-3 rounded-lg text-sm"
      style={{
        backgroundColor: 'var(--bg-elevated)',
        border: '1px solid var(--bg-border)',
        fontFamily: "'Outfit', sans-serif",
      }}
    >
      <p style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{data.name}</p>
      <p style={{ color: 'var(--accent-primary)', fontFamily: "'JetBrains Mono', monospace" }}>
        {data.count} products
      </p>
    </div>
  )
}

const CategoryChart = memo(function CategoryChart({ data }) {
  return (
    <div
      className="rounded-xl p-5"
      style={{
        backgroundColor: 'var(--bg-surface)',
        border: '1px solid var(--bg-border)',
      }}
    >
      <h3
        className="text-base font-semibold mb-4"
        style={{ fontFamily: "'Syne', sans-serif", color: 'var(--text-primary)' }}
      >
        Products by Category
      </h3>
      <div style={{ width: '100%', height: 320 }}>
        <ResponsiveContainer>
          <BarChart data={data} layout="vertical" margin={{ left: 80, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--bg-border)" />
            <XAxis
              type="number"
              tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}
              axisLine={{ stroke: 'var(--bg-border)' }}
              tickLine={false}
            />
            <YAxis
              dataKey="name"
              type="category"
              tick={{ fill: 'var(--text-muted)', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => truncate(val, 14)}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="count"
              fill="var(--accent-primary)"
              radius={[0, 4, 4, 0]}
              animationDuration={800}
              animationEasing="ease-out"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
})

export default CategoryChart
