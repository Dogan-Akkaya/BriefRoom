import { useMemo } from 'react'

const GRID_ID = 'grid-bg-dots'

const keyframes = `
@keyframes gridPulse {
  0%, 100% { opacity: 0.03; r: 1; }
  50% { opacity: 0.12; r: 1.8; }
}
@keyframes lineShift1 {
  0% { transform: rotate(0deg) translateX(-5%); opacity: 0.04; }
  50% { transform: rotate(2deg) translateX(5%); opacity: 0.08; }
  100% { transform: rotate(0deg) translateX(-5%); opacity: 0.04; }
}
@keyframes lineShift2 {
  0% { transform: rotate(0deg) translateY(5%); opacity: 0.03; }
  50% { transform: rotate(-1.5deg) translateY(-5%); opacity: 0.07; }
  100% { transform: rotate(0deg) translateY(5%); opacity: 0.03; }
}
@keyframes lineShift3 {
  0% { transform: rotate(1deg) translate(3%, -3%); opacity: 0.035; }
  50% { transform: rotate(-1deg) translate(-3%, 3%); opacity: 0.065; }
  100% { transform: rotate(1deg) translate(3%, -3%); opacity: 0.035; }
}
`

const hash = (x, y) => Math.abs(Math.sin(x * 127.1 + y * 311.7) * 43758.5453) % 1

export default function GridBackground() {
  const pulsingDots = useMemo(() => {
    const dots = []
    const cols = Math.ceil(1920 / 40) + 1
    const rows = Math.ceil(1080 / 40) + 1
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        if (hash(col, row) > 0.87) {
          const delay = ((col + row * 1.7) % 12).toFixed(1)
          dots.push(
            <circle
              key={`${col}-${row}`}
              cx={col * 40}
              cy={row * 40}
              r="1"
              fill="rgba(255,255,255,0.03)"
              style={{ animation: `gridPulse ${6 + (hash(col, row) * 4).toFixed(1)}s ease-in-out ${delay}s infinite` }}
            />
          )
        }
      }
    }
    return dots
  }, [])

  return (
    <div style={{ position: 'absolute', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }} aria-hidden="true">
      <style>{keyframes}</style>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <pattern id={GRID_ID} x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="20" cy="20" r="1" fill="rgba(255,255,255,0.03)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill={`url(#${GRID_ID})`} />
        {pulsingDots}
      </svg>
      <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="gridLine1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(255,69,98,0)" />
            <stop offset="50%" stopColor="rgba(255,69,98,0.06)" />
            <stop offset="100%" stopColor="rgba(255,69,98,0)" />
          </linearGradient>
          <linearGradient id="gridLine2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(59,130,246,0)" />
            <stop offset="50%" stopColor="rgba(59,130,246,0.05)" />
            <stop offset="100%" stopColor="rgba(59,130,246,0)" />
          </linearGradient>
          <linearGradient id="gridLine3" x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="rgba(168,85,247,0)" />
            <stop offset="40%" stopColor="rgba(168,85,247,0.04)" />
            <stop offset="100%" stopColor="rgba(168,85,247,0)" />
          </linearGradient>
        </defs>
        <line x1="0" y1="30%" x2="100%" y2="70%" stroke="url(#gridLine1)" strokeWidth="1" style={{ animation: 'lineShift1 18s ease-in-out infinite', transformOrigin: 'center' }} />
        <line x1="20%" y1="0" x2="80%" y2="100%" stroke="url(#gridLine2)" strokeWidth="1" style={{ animation: 'lineShift2 22s ease-in-out infinite', transformOrigin: 'center' }} />
        <line x1="0" y1="60%" x2="100%" y2="40%" stroke="url(#gridLine3)" strokeWidth="1" style={{ animation: 'lineShift3 26s ease-in-out infinite', transformOrigin: 'center' }} />
      </svg>
    </div>
  )
}
