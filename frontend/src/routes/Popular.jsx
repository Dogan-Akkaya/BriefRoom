import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, INDUSTRIES, ALL_REGIONS } from '../lib/data'
import { popularCharts, threatTypeLabel } from '../lib/intelligenceLibrary'
import PopularChartCard from '../components/PopularChartCard'
import ChartPreviewModal from '../components/ChartPreviewModal'
import Reveal from '../components/Reveal'
import AmbientSmoke from '../components/AmbientSmoke'

// Filters derived from Intelligence Library dimensions (tag-based, no fuzzy match)
const CATEGORY_FILTERS = ['All', ...CATEGORIES.filter(c => c.hasData).map(c => c.id)]
const INDUSTRY_OPTIONS = ['All Industries', ...INDUSTRIES]
const REGION_OPTIONS = ['Global', ...ALL_REGIONS]
const TREND_FILTERS = ['All', 'Rising', 'Declining']

function categoryLabel(id) {
  if (id === 'All') return 'All'
  return threatTypeLabel(id)
}

function matchesCategory(item, cat) {
  if (cat === 'All') return true
  return (item._threatTypes || []).includes(cat)
}

function matchesIndustry(item, ind) {
  if (ind === 'All Industries') return true
  return (item._industries || []).includes(ind)
}

function matchesRegion(item, reg) {
  if (reg === 'Global') return true
  return (item._regions || []).includes(reg)
}

function matchesTrend(item, trend) {
  if (trend === 'All') return true
  if (trend === 'Rising') return item.up === true
  return item.up === false
}

// Adapter: Intelligence Library item → PopularChartCard props
function toCardProps(item) {
  const series = item.dataset?.series || []
  const first = series[0] || {}
  const tt = item.threat_type?.[0]
  const d = item.display || {}
  return {
    _id: item.id,
    title: item.title,
    views: d.views || '—',
    tag: (threatTypeLabel(tt) || 'INTEL').toUpperCase(),
    trend: d.trend || '',
    up: d.up !== undefined ? d.up : null,
    color: first.color || '#FF4562',
    data: first.values || [],
    sources: item.source,
    updated: item.updated_at ? item.updated_at.slice(0, 7) : '',
    detail: d.detail || '',
    metrics: d.metrics || [],
    categoryId: tt,
    _industries: item.industry || [],
    _regions: item.region || [],
    _threatTypes: item.threat_type || [],
  }
}

/* Shared style tokens */
const mono = "'JetBrains Mono', monospace"
const sans = "'Plus Jakarta Sans', sans-serif"
const glass = {
  background: 'rgba(255,255,255,0.025)',
  border: '1px solid rgba(255,255,255,0.06)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  borderRadius: 16,
}

export default function Popular() {
  const navigate = useNavigate()
  const [hoveredChart, setHoveredChart] = useState(null)
  const [previewChart, setPreviewChart] = useState(null)
  const [category, setCategory] = useState('All')
  const [industry, setIndustry] = useState('All Industries')
  const [region, setRegion] = useState('Global')
  const [trend, setTrend] = useState('All')

  useEffect(() => { document.title = 'Popular Security Charts — Cybersecurity Visualizations | Brief Room' }, [])

  const cards = useMemo(() => popularCharts().map(toCardProps), [])

  const filtered = useMemo(
    () => cards.filter(c =>
      matchesCategory(c, category)
      && matchesIndustry(c, industry)
      && matchesRegion(c, region)
      && matchesTrend(c, trend)
    ),
    [cards, category, industry, region, trend],
  )

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#E8ECF1', position: 'relative', overflow: 'hidden' }}>
      <AmbientSmoke targetFocus={0} intensity={0.4} timeRate={0.5} particleCap={160} />
      <div style={{ position: 'relative', zIndex: 2 }}>
      <div style={{
        paddingTop: 80,
        maxWidth: 1260,
        margin: '0 auto',
        padding: '80px 24px 80px',
        display: 'flex',
        gap: 32,
        alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}>

        {/* ── Left Sidebar ── */}
        <aside style={{
          width: 220,
          minWidth: 180,
          position: 'sticky',
          top: 96,
          ...glass,
          padding: '24px 18px',
          display: 'flex',
          flexDirection: 'column',
          gap: 28,
        }}>

          {/* Clear all */}
          {(category !== 'All' || industry !== 'All Industries' || region !== 'Global' || trend !== 'All') && (
            <button
              onClick={() => { setCategory('All'); setIndustry('All Industries'); setRegion('Global'); setTrend('All') }}
              style={{ background: 'rgba(255,69,98,0.06)', border: '1px solid rgba(255,69,98,0.15)', borderRadius: 8, padding: '7px 0', color: '#FF4562', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Clear all filters
            </button>
          )}

          {/* Category */}
          <div>
            <div style={{
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(232,236,241,0.6)',
              marginBottom: 12,
            }}>
              Category
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {CATEGORY_FILTERS.map(c => {
                const active = category === c
                return (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: '5px 10px',
                      borderRadius: 8,
                      border: active ? '1px solid rgba(255,69,98,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      background: active ? 'rgba(255,69,98,0.12)' : 'rgba(255,255,255,0.03)',
                      color: active ? '#FF4562' : 'rgba(232,236,241,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {categoryLabel(c)}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Industry */}
          <div>
            <div style={{
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(232,236,241,0.6)',
              marginBottom: 12,
            }}>
              Industry
            </div>
            <select
              value={industry}
              onChange={e => setIndustry(e.target.value)}
              style={{
                width: '100%',
                fontFamily: mono,
                fontSize: 11,
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: 'rgba(232,236,241,0.55)',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(232,236,241,0.3)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              {INDUSTRY_OPTIONS.map(o => (
                <option key={o} value={o} style={{ background: '#12162A', color: '#E8ECF1' }}>{o}</option>
              ))}
            </select>
          </div>

          {/* Country / Region */}
          <div>
            <div style={{
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(232,236,241,0.6)',
              marginBottom: 12,
            }}>
              Country / Region
            </div>
            <select
              value={region}
              onChange={e => setRegion(e.target.value)}
              style={{
                width: '100%',
                fontFamily: mono,
                fontSize: 11,
                padding: '8px 10px',
                borderRadius: 10,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                color: 'rgba(232,236,241,0.55)',
                outline: 'none',
                cursor: 'pointer',
                appearance: 'none',
                WebkitAppearance: 'none',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='rgba(232,236,241,0.3)'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 10px center',
              }}
            >
              {REGION_OPTIONS.map(o => (
                <option key={o} value={o} style={{ background: '#12162A', color: '#E8ECF1' }}>{o}</option>
              ))}
            </select>
          </div>

          {/* Trend */}
          <div>
            <div style={{
              fontFamily: mono,
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(232,236,241,0.6)',
              marginBottom: 12,
            }}>
              Trend
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {TREND_FILTERS.map(t => {
                const active = trend === t
                return (
                  <button
                    key={t}
                    onClick={() => setTrend(t)}
                    style={{
                      fontFamily: mono,
                      fontSize: 10,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                      padding: '5px 10px',
                      borderRadius: 8,
                      border: active ? '1px solid rgba(255,69,98,0.4)' : '1px solid rgba(255,255,255,0.06)',
                      background: active ? 'rgba(255,69,98,0.12)' : 'rgba(255,255,255,0.03)',
                      color: active ? '#FF4562' : 'rgba(232,236,241,0.4)',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                    }}
                  >
                    {t}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Result count */}
          <div style={{
            fontFamily: mono,
            fontSize: 10,
            color: 'rgba(232,236,241,0.5)',
            borderTop: '1px solid rgba(255,255,255,0.05)',
            paddingTop: 16,
          }}>
            {filtered.length} chart{filtered.length !== 1 ? 's' : ''} found
          </div>
        </aside>

        {/* ── Main Content ── */}
        <main style={{ flex: 1, minWidth: 0 }}>

          {/* Back button */}
          <Reveal>
            <div
              onClick={() => navigate('/')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                cursor: 'pointer',
                fontFamily: mono,
                fontSize: 12,
                color: 'rgba(232,236,241,0.55)',
                marginBottom: 40,
                transition: 'all 0.2s',
                padding: '6px 14px',
                borderRadius: 8,
                border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
              }}
              onMouseEnter={e => { e.currentTarget.style.color = '#FF4562'; e.currentTarget.style.borderColor = 'rgba(255,69,98,0.2)' }}
              onMouseLeave={e => { e.currentTarget.style.color = 'rgba(232,236,241,0.55)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)' }}
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
                fontFamily: mono,
                fontSize: 11,
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'rgba(255,69,98,0.85)',
                marginBottom: 14,
              }}>
                <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>
                &nbsp;&nbsp;Popular Charts
              </div>
              <h1 style={{
                fontFamily: sans,
                fontSize: 'clamp(32px,5vw,52px)',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#FFFFFF',
                letterSpacing: '-0.03em',
                marginBottom: 16,
              }}>
                What other CISOs are looking at
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
            {filtered.map((c, i) => {
              const isFeatured = i % 3 === 2
              return (
                <Reveal
                  key={`${c.title}-${i}`}
                  delay={i * 70}
                  style={isFeatured ? { gridColumn: 'span 2' } : undefined}
                >
                  <div style={{ position: 'relative' }}>
                    {/* Featured badge */}
                    {isFeatured && (
                      <div style={{
                        position: 'absolute',
                        top: 16,
                        left: 16,
                        zIndex: 2,
                        fontFamily: mono,
                        fontSize: 9,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        padding: '4px 10px',
                        borderRadius: 6,
                        background: 'rgba(255,69,98,0.12)',
                        border: '1px solid rgba(255,69,98,0.25)',
                        color: '#FF4562',
                      }}>
                        Featured
                      </div>
                    )}
                    <PopularChartCard
                      {...c}
                      isHovered={hoveredChart === i}
                      onHover={() => setHoveredChart(i)}
                      onLeave={() => setHoveredChart(null)}
                      onClick={() => setPreviewChart(c)}
                      /* Pass featured flag for wide-card styling */
                      style={isFeatured ? {
                        paddingTop: 44,
                      } : undefined}
                      featured={isFeatured}
                    />
                  </div>
                </Reveal>
              )
            })}

            {filtered.length === 0 && (
              <div style={{
                gridColumn: 'span 2',
                textAlign: 'center',
                padding: '60px 0',
                fontFamily: mono,
                fontSize: 13,
                color: 'rgba(232,236,241,0.55)',
              }}>
                No charts match the current filters.
              </div>
            )}
          </div>
        </main>
      </div>

      {previewChart && (
        <ChartPreviewModal
          chart={previewChart}
          type="popular"
          onClose={() => setPreviewChart(null)}
          onCustomize={() => { setPreviewChart(null); navigate(`/builder/${previewChart.categoryId}`) }}
        />
      )}
      </div>
    </div>
  )
}
