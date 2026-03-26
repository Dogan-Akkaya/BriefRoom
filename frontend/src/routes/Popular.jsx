import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { POPULAR } from '../lib/data'
import PopularChartCard from '../components/PopularChartCard'
import Reveal from '../components/Reveal'
import Navbar from '../components/Navbar'

export default function Popular() {
  const navigate = useNavigate()
  const [hoveredChart, setHoveredChart] = useState(null)

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#E8ECF1' }}>
      <div style={{ paddingTop: 80, maxWidth: 1100, margin: '0 auto', padding: '80px 24px 80px' }}>

        {/* Back button */}
        <Reveal>
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12,
              color: 'rgba(232,236,241,0.4)',
              marginBottom: 40,
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#FF4562')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,236,241,0.4)')}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Home
          </div>
        </Reveal>

        {/* Header */}
        <Reveal>
          <div style={{ marginBottom: 48 }}>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(255,69,98,0.55)',
              marginBottom: 14,
            }}>
              <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>
              &nbsp;&nbsp;Popular Charts
            </div>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 'clamp(32px,5vw,52px)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#FFFFFF',
              letterSpacing: '-0.03em',
              marginBottom: 16,
            }}>
              All Popular Charts
            </h1>
            <p style={{
              fontSize: 16,
              lineHeight: 1.7,
              color: 'rgba(232,236,241,0.45)',
              fontWeight: 400,
              maxWidth: 520,
            }}>
              180+ board-ready visualizations. Click any chart to customize.
            </p>
          </div>
        </Reveal>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 18,
        }}>
          {POPULAR.map((c, i) => (
            <Reveal key={i} delay={i * 70}>
              <PopularChartCard
                {...c}
                isHovered={hoveredChart === i}
                onHover={() => setHoveredChart(i)}
                onLeave={() => setHoveredChart(null)}
                onClick={() => navigate(`/builder/${c.categoryId}`)}
              />
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
