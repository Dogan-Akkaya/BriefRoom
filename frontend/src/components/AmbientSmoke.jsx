import { useEffect, useRef } from 'react'
import { noise } from '../lib/noise'

// Reusable canvas-2D ambient smoke.
// Mirrors SmokeHero's technique: hand-rolled sine/cosine noise, low-alpha
// fillRect trail fade, radial gradient glow, no CSS filter/blur/shadow.
// SmokeHero is untouched; this is a separate implementation tuned for
// "ambient" use (lower particle cap, focus-lerp, no mouse interactivity).
//
// Props:
//   targetFocus  0..1  — 0 = wide edge-to-edge spawn, 1 = tight central spawn
//   lerpSpeed    number — how fast focus eases toward targetFocus (default 0.05)
//   intensity    0..1  — multiplier on spawn rate + base alpha (default 0.7)
//   timeRate     number — multiplier on noise time step (default 1.0)
//   particleCap  number — hard max (default 200)
//   palette      [[r,g,b], ...] — override color palette
//   style        inline style override for positioning

const DEFAULT_PALETTE = [
  [199, 44, 65],
  [160, 38, 58],
  [30, 58, 138],
  [25, 45, 110],
  [50, 35, 100],
  [140, 35, 60],
]

export default function AmbientSmoke({
  targetFocus = 0,
  lerpSpeed = 0.05,
  intensity = 0.7,
  timeRate = 1.0,
  particleCap = 200,
  palette = DEFAULT_PALETTE,
  style,
}) {
  const canvasRef = useRef(null)
  const animRef = useRef(null)
  const particlesRef = useRef([])
  const tRef = useRef(0)
  const focusRef = useRef(targetFocus)
  const targetRef = useRef(targetFocus)

  // Keep latest prop values available to the rAF loop without remounting
  targetRef.current = targetFocus

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')

    // Respect reduced-motion: draw a single static frame, no loop.
    const reduced = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w, h
    const resize = () => {
      w = c.width = window.innerWidth
      h = c.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const mkP = (x, y, cfg) => {
      const a = cfg.angle != null ? cfg.angle : Math.random() * Math.PI * 2
      const s = cfg.speed || 0.2 + Math.random() * 0.4
      return {
        x: x + (Math.random() - 0.5) * (cfg.spread || 40),
        y: y + (Math.random() - 0.5) * (cfg.spread || 40),
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s - (cfg.rise || 0.1),
        life: 1,
        decay: cfg.decay || 0.001 + Math.random() * 0.002,
        radius: (cfg.minR || 20) + Math.random() * ((cfg.maxR || 90) - (cfg.minR || 20)),
        growRate: cfg.grow || 0.05 + Math.random() * 0.15,
        color: cfg.color,
        opacity: cfg.opacity || 0.05,
        noiseOffX: Math.random() * 1000,
        noiseOffY: Math.random() * 1000,
        drag: 0.996 + Math.random() * 0.003,
      }
    }

    // Base emitter positions (normalized 0..1). These are "wide" positions.
    // At focus=1 they lerp toward canvas center.
    const baseEms = [
      { bx: 0.15, by: 0.55, rate: 0.12, maxR: 100 },
      { bx: 0.85, by: 0.5, rate: 0.12, maxR: 100 },
      { bx: 0.5, by: 0.65, rate: 0.10, maxR: 110 },
      { bx: 0.35, by: 0.3, rate: 0.08, maxR: 90 },
      { bx: 0.65, by: 0.35, rate: 0.08, maxR: 90 },
    ]

    const draw = () => {
      // Ease focus toward target
      focusRef.current += (targetRef.current - focusRef.current) * lerpSpeed
      const f = Math.max(0, Math.min(1, focusRef.current))

      tRef.current += timeRate
      const t = tRef.current

      // Trail fade — matches SmokeHero's values
      ctx.fillStyle = 'rgba(10,14,26,0.03)'
      ctx.fillRect(0, 0, w, h)
      if (Math.floor(t) % 90 === 0) {
        ctx.fillStyle = 'rgba(10,14,26,0.12)'
        ctx.fillRect(0, 0, w, h)
      }

      // Emit from each base point, lerped toward center by focus.
      const cx = w / 2
      const cy = h / 2
      baseEms.forEach((em, idx) => {
        // Lerp emitter position toward center
        const px = em.bx * w * (1 - f) + cx * f
        const py = em.by * h * (1 - f) + cy * f
        const wx = noise(idx * 100, 0, t) * 120
        const wy = noise(0, idx * 100, t) * 80
        const ex = px + wx
        const ey = py + wy
        if (Math.random() < em.rate * intensity) {
          const color = palette[idx % palette.length]
          particlesRef.current.push(
            mkP(ex, ey, {
              color,
              opacity: 0.05 + 0.04 * intensity,
              maxR: em.maxR,
              minR: 20,
              speed: 0.2 + Math.random() * 0.3,
              rise: 0.08 + Math.random() * 0.1,
              angle: noise(ex * 0.01, ey * 0.01, t * 0.5) * Math.PI
                + (Math.random() - 0.5) * 1.2,
              spread: 40 * (1 - 0.6 * f),
              decay: 0.001 + Math.random() * 0.002,
            })
          )
        }
      })

      // Occasional low-alpha volumetric blob (like SmokeHero's "body"), scaled by intensity.
      if (Math.random() < 0.012 * intensity) {
        const bx = cx + (Math.random() - 0.5) * w * (1 - 0.7 * f)
        const by = cy + (Math.random() - 0.5) * h * (1 - 0.7 * f)
        particlesRef.current.push(
          mkP(bx, by, {
            color: palette[Math.floor(Math.random() * palette.length)],
            opacity: 0.04 + 0.02 * intensity,
            maxR: 120 + Math.random() * 80,
            minR: 60,
            speed: 0.05,
            rise: 0,
            angle: Math.random() * Math.PI * 2,
            decay: 0.0004 + Math.random() * 0.0008,
            grow: 0.08 + Math.random() * 0.1,
            spread: 20,
          })
        )
      }

      // Per-particle update + draw (with focus-driven inward pull)
      const alive = []
      const pull = 0.02 * f  // at f=0 no pull; at f=1 gentle pull toward center
      particlesRef.current.forEach((p) => {
        p.life -= p.decay
        if (p.life <= 0) return
        const nf = noise(
          p.x * 0.008 + p.noiseOffX,
          p.y * 0.008 + p.noiseOffY,
          t * 0.4
        )
        p.vx += nf * 0.008
        p.vy += Math.cos(nf * 3) * 0.005
        if (pull > 0) {
          p.vx += ((cx - p.x) * 0.00015) * pull
          p.vy += ((cy - p.y) * 0.00015) * pull
        }
        p.x += p.vx
        p.y += p.vy
        p.radius += p.growRate
        p.vx *= p.drag
        p.vy *= p.drag
        const al = p.life * p.opacity * (p.life > 0.8 ? (1 - p.life) / 0.2 + 0.01 : 1)
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        g.addColorStop(0, `rgba(${p.color},${al * 1.4})`)
        g.addColorStop(0.35, `rgba(${p.color},${al * 0.6})`)
        g.addColorStop(0.7, `rgba(${p.color},${al * 0.15})`)
        g.addColorStop(1, `rgba(${p.color},0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
        alive.push(p)
      })

      particlesRef.current = alive.length > particleCap
        ? alive.slice(-particleCap)
        : alive

      // Vignette — slightly tighter at higher focus
      const vig = ctx.createRadialGradient(
        cx, cy, h * (0.15 - 0.05 * f),
        cx, cy, h * (0.85 - 0.1 * f)
      )
      vig.addColorStop(0, 'rgba(10,14,26,0)')
      vig.addColorStop(1, `rgba(10,14,26,${0.3 + 0.15 * f})`)
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, w, h)

      animRef.current = requestAnimationFrame(draw)
    }

    // Paint base once so no white flash before first frame
    ctx.fillStyle = '#0A0E1A'
    ctx.fillRect(0, 0, w, h)

    if (reduced) {
      // Static one-frame render: draw one pass so the background has atmosphere, then stop.
      draw()
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    } else {
      animRef.current = requestAnimationFrame(draw)
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
    // targetFocus is read through targetRef; the loop is built once.
    // intensity / timeRate / lerpSpeed / particleCap / palette are also closed over;
    // if they need to update live, the loop should remount. For now, these
    // are expected to be stable per-route configurations.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        ...style,
      }}
      aria-hidden="true"
    />
  )
}
