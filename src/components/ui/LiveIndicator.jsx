import { memo } from 'react'

const LiveIndicator = memo(function LiveIndicator() {
  return (
    <div className="flex items-center gap-2">
      <div className="relative flex items-center justify-center">
        <div
          className="live-dot relative"
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'var(--success)',
          }}
        />
      </div>
      <span
        className="text-xs font-medium"
        style={{ color: 'var(--success)', fontFamily: 'var(--font-outfit)' }}
      >
        Live
      </span>
    </div>
  )
})

export default LiveIndicator
