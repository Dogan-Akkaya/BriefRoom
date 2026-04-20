import { useEffect, useRef } from 'react'
import { noise } from '../lib/noise'

// Canvas-2D knowledge graph constellation for Global Reports.
// Same technique baseline as SmokeHero / AmbientSmoke:
//   canvas 2D, rAF, hand-rolled noise, low-alpha fillRect trail fade,
//   no CSS filter/blur/shadow. Glow from overlapping low-alpha circles only.
//
// Distinct from smoke: sparse nodes + thin blue lines (edges), 12% active
// nodes with breathing double rings, periodic pulses traveling along edges
// that trigger double radar-ping arrivals (SOCRadar "S" double-arc motif).

const COLOR_BASE = [55, 138, 221]      // #378ADD
const COLOR_HI = [133, 183, 235]       // #85B7EB

const DRIFT_AMPLITUDE = 48           // was 22 — bumped so wander reads at a glance
const DRIFT_TIME_RATE = 2.2          // outer multiplier on noise time arg (slow but visible)
const EDGE_DISTANCE = 170
const MAX_EDGES_PER_NODE = 4
const ACTIVE_RATIO = 0.12
const PULSE_INTERVAL_MIN = 120        // frames (~2s)
const PULSE_INTERVAL_MAX = 180        // frames (~3s)
const PULSE_TRAVEL_FRAMES = 50        // ~800ms
const PULSE_RING_DELAY = 16           // ~260ms between the two arrival rings
const PULSE_RING_LIFE = 60            // frames

export default function KnowledgeGraphBG() {
  const canvasRef = useRef(null)
  const animRef = useRef(null)

  useEffect(() => {
    const c = canvasRef.current
    if (!c) return
    const ctx = c.getContext('2d')

    const reduced = typeof window !== 'undefined'
      && window.matchMedia
      && window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let w, h
    const nodes = []
    const edges = []     // { a, b }
    const pulses = []    // { edgeIdx, dir, startT, arrivedT, settled }

    const build = () => {
      // Scale node count roughly by area; target ~60 at 1440x900 = 1.3M px
      const area = w * h
      const targetCount = Math.max(36, Math.min(110, Math.round(area / 22000)))
      nodes.length = 0
      for (let i = 0; i < targetCount; i++) {
        nodes.push({
          baseX: Math.random() * w,
          baseY: Math.random() * h,
          x: 0, y: 0,
          noiseOffX: Math.random() * 1000,
          noiseOffY: Math.random() * 1000,
          isActive: Math.random() < ACTIVE_RATIO,
          phase: Math.random() * Math.PI * 2,
          baseR: 1.5 + Math.random() * 0.8,
        })
      }
      // Compute edges: nearest neighbors within EDGE_DISTANCE, capped per node.
      edges.length = 0
      const degree = new Array(nodes.length).fill(0)
      // Sort candidate pairs by distance
      const pairs = []
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].baseX - nodes[j].baseX
          const dy = nodes[i].baseY - nodes[j].baseY
          const d = Math.sqrt(dx * dx + dy * dy)
          if (d < EDGE_DISTANCE) pairs.push({ i, j, d })
        }
      }
      pairs.sort((a, b) => a.d - b.d)
      for (const p of pairs) {
        if (degree[p.i] < MAX_EDGES_PER_NODE && degree[p.j] < MAX_EDGES_PER_NODE) {
          edges.push({ a: p.i, b: p.j })
          degree[p.i]++
          degree[p.j]++
        }
      }
    }

    const resize = () => {
      w = c.width = window.innerWidth
      h = c.height = window.innerHeight
      build()
    }
    resize()
    window.addEventListener('resize', resize)

    let t = 0
    let nextPulseAt = 60 + Math.random() * (PULSE_INTERVAL_MAX - PULSE_INTERVAL_MIN)

    const schedulePulse = () => {
      // Pick a random active node with at least one edge
      const activeIdxs = []
      for (let i = 0; i < nodes.length; i++) if (nodes[i].isActive) activeIdxs.push(i)
      if (!activeIdxs.length) return
      for (let attempt = 0; attempt < 8; attempt++) {
        const n = activeIdxs[Math.floor(Math.random() * activeIdxs.length)]
        // Find an edge touching n
        const options = []
        for (let ei = 0; ei < edges.length; ei++) {
          if (edges[ei].a === n) options.push({ ei, dir: 1 })
          else if (edges[ei].b === n) options.push({ ei, dir: -1 })
        }
        if (options.length) {
          const pick = options[Math.floor(Math.random() * options.length)]
          pulses.push({ edgeIdx: pick.ei, dir: pick.dir, startT: t, arrivedT: null })
          return
        }
      }
    }

    const draw = () => {
      t += 1

      // Trail fade (slightly stronger than smoke because lines need clean look)
      ctx.fillStyle = 'rgba(10,14,26,0.14)'
      ctx.fillRect(0, 0, w, h)

      // Drift node positions — each node uses its own noise offsets so wanders
      // are uncorrelated; time component drives continuous slow wander.
      const driftT = t * DRIFT_TIME_RATE
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i]
        const nx = noise(n.noiseOffX, n.noiseOffY, driftT)
        const ny = noise(n.noiseOffY + 500, n.noiseOffX + 500, driftT + 1000)
        n.x = n.baseX + nx * DRIFT_AMPLITUDE
        n.y = n.baseY + ny * DRIFT_AMPLITUDE
      }

      // Edges
      ctx.lineWidth = 1
      for (const e of edges) {
        const a = nodes[e.a], b = nodes[e.b]
        ctx.strokeStyle = `rgba(${COLOR_BASE[0]},${COLOR_BASE[1]},${COLOR_BASE[2]},0.08)`
        ctx.beginPath()
        ctx.moveTo(a.x, a.y)
        ctx.lineTo(b.x, b.y)
        ctx.stroke()
      }

      // Nodes
      for (const n of nodes) {
        if (n.isActive) {
          // Core
          const coreG = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 8)
          coreG.addColorStop(0, `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},0.7)`)
          coreG.addColorStop(0.4, `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},0.25)`)
          coreG.addColorStop(1, `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},0)`)
          ctx.fillStyle = coreG
          ctx.beginPath()
          ctx.arc(n.x, n.y, 8, 0, Math.PI * 2)
          ctx.fill()

          // Breathing double ring (two concentric circles at offset phases)
          const ph = t * 0.0006
          const r1 = 10 + Math.sin(ph + n.phase) * 3
          const r2 = 14 + Math.sin(ph + n.phase + Math.PI) * 3
          ctx.lineWidth = 0.8
          ctx.strokeStyle = `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},0.35)`
          ctx.beginPath()
          ctx.arc(n.x, n.y, r1, 0, Math.PI * 2)
          ctx.stroke()
          ctx.strokeStyle = `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},0.2)`
          ctx.beginPath()
          ctx.arc(n.x, n.y, r2, 0, Math.PI * 2)
          ctx.stroke()
        } else {
          // Faint regular node
          ctx.fillStyle = `rgba(${COLOR_BASE[0]},${COLOR_BASE[1]},${COLOR_BASE[2]},0.45)`
          ctx.beginPath()
          ctx.arc(n.x, n.y, n.baseR, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // Pulses
      if (t >= nextPulseAt) {
        schedulePulse()
        nextPulseAt = t + PULSE_INTERVAL_MIN + Math.random() * (PULSE_INTERVAL_MAX - PULSE_INTERVAL_MIN)
      }

      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i]
        const edge = edges[p.edgeIdx]
        if (!edge) { pulses.splice(i, 1); continue }
        const from = p.dir === 1 ? nodes[edge.a] : nodes[edge.b]
        const to = p.dir === 1 ? nodes[edge.b] : nodes[edge.a]

        const progress = Math.min(1, (t - p.startT) / PULSE_TRAVEL_FRAMES)
        if (progress < 1) {
          const px = from.x + (to.x - from.x) * progress
          const py = from.y + (to.y - from.y) * progress
          // Dot
          const g = ctx.createRadialGradient(px, py, 0, px, py, 6)
          g.addColorStop(0, `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},0.95)`)
          g.addColorStop(0.5, `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},0.35)`)
          g.addColorStop(1, `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},0)`)
          ctx.fillStyle = g
          ctx.beginPath()
          ctx.arc(px, py, 6, 0, Math.PI * 2)
          ctx.fill()
        } else if (p.arrivedT == null) {
          p.arrivedT = t
        }

        // Arrival: double radar-ping (second ring delayed ~260ms)
        if (p.arrivedT != null) {
          const age1 = t - p.arrivedT
          const age2 = t - p.arrivedT - PULSE_RING_DELAY
          ctx.lineWidth = 1.2
          const drawRing = (age) => {
            if (age < 0 || age > PULSE_RING_LIFE) return
            const a = 1 - age / PULSE_RING_LIFE
            const r = 6 + age * 0.7
            ctx.strokeStyle = `rgba(${COLOR_HI[0]},${COLOR_HI[1]},${COLOR_HI[2]},${0.6 * a})`
            ctx.beginPath()
            ctx.arc(to.x, to.y, r, 0, Math.PI * 2)
            ctx.stroke()
          }
          drawRing(age1)
          drawRing(age2)
          if (age2 > PULSE_RING_LIFE) pulses.splice(i, 1)
        }
      }

      animRef.current = requestAnimationFrame(draw)
    }

    ctx.fillStyle = '#0A0E1A'
    ctx.fillRect(0, 0, w, h)

    if (reduced) {
      draw()  // one frame, no loop
      cancelAnimationFrame(animRef.current)
      animRef.current = null
    } else {
      animRef.current = requestAnimationFrame(draw)
    }

    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
