import { memo } from 'react'
import { SearchX } from 'lucide-react'

const EmptyState = memo(function EmptyState({
  icon: Icon = SearchX,
  title = 'No results found',
  description = 'Try adjusting your search or filters.',
  action,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <Icon size={64} color="var(--text-dim)" />
      <h3
        className="mt-4 text-lg font-semibold"
        style={{ fontFamily: 'var(--font-syne)', color: 'var(--text-primary)' }}
      >
        {title}
      </h3>
      {description && (
        <p className="mt-2 text-sm" style={{ color: 'var(--text-muted)' }}>
          {description}
        </p>
      )}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
})

export default EmptyState
