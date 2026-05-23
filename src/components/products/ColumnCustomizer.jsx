import { useState, memo, useCallback } from 'react'
import { Settings2, GripVertical } from 'lucide-react'
import useUIStore from '../../store/uiStore'

const ColumnCustomizer = memo(function ColumnCustomizer() {
  const [open, setOpen] = useState(false)
  const { columns, toggleColumn, reorderColumns } = useUIStore()
  const [dragIndex, setDragIndex] = useState(null)

  const handleDragStart = useCallback((e, index) => {
    setDragIndex(index)
    e.dataTransfer.effectAllowed = 'move'
  }, [])

  const handleDragOver = useCallback((e, index) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dragIndex !== null && dragIndex !== index) {
      reorderColumns(dragIndex, index)
      setDragIndex(index)
    }
  }, [dragIndex, reorderColumns])

  const handleDragEnd = useCallback(() => {
    setDragIndex(null)
  }, [])

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg transition-colors"
        style={{ color: 'var(--text-muted)' }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--accent-primary)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-muted)')}
      >
        <Settings2 size={18} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div
            className="absolute right-0 top-full mt-2 z-50 rounded-xl p-4 shadow-lg"
            style={{
              minWidth: 220,
              backgroundColor: 'var(--bg-elevated)',
              border: '1px solid var(--bg-border)',
            }}
          >
            <p
              className="text-xs font-semibold mb-3 uppercase tracking-wider"
              style={{ color: 'var(--text-dim)' }}
            >
              Columns
            </p>
            <div className="space-y-1">
              {columns
                .sort((a, b) => a.order - b.order)
                .map((col, index) => (
                  <div
                    key={col.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, index)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    className="flex items-center gap-2 px-2 py-1.5 rounded-lg cursor-grab"
                    style={{ backgroundColor: 'transparent' }}
                  >
                    <GripVertical size={14} style={{ color: 'var(--text-dim)', cursor: 'grab' }} />
                    <span className="text-sm flex-1" style={{ color: 'var(--text-primary)' }}>
                      {col.label}
                    </span>
                    <button
                      onClick={() => toggleColumn(col.id)}
                      className="relative w-9 h-5 rounded-full transition-colors"
                      style={{
                        backgroundColor: col.visible ? 'var(--accent-primary)' : 'var(--bg-border)',
                      }}
                    >
                      <div
                        className="absolute top-0.5 w-4 h-4 rounded-full transition-transform"
                        style={{
                          backgroundColor: '#fff',
                          transform: col.visible ? 'translateX(18px)' : 'translateX(2px)',
                        }}
                      />
                    </button>
                  </div>
                ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
})

export default ColumnCustomizer
