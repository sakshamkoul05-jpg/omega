import { memo } from 'react'
import ProductCard from './ProductCard'

const ProductGrid = memo(function ProductGrid({ products }) {
  return (
    <div
      className="grid gap-4"
      style={{
        gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))',
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
})

export default ProductGrid
