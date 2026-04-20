import { useMemo, useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import { INDUSTRIES, ALL_REGIONS, CATEGORIES } from '../../lib/data'
import {
  labelToSlug, slugToLabel, threatTypeLabel,
  sliceItems, crossSliceItems, crossSliceCounts, popularCharts,
} from '../../lib/intelligenceLibrary'
import Spark from '../Spark'
import SliceStatCard from './SliceStatCard'
import CrossSliceChip from './CrossSliceChip'

const DIM_LABEL = { industry: 'Industry', region: 'Region', threat_type: 'Threat Type' }
const GEO_DIMS = new Set(['industry', 'region'])

// Which crossing tabs are valid given dim1
function crossingDims(dim) {
  if (dim === 'threat_type') return ['industry', 'region']
  return ['threat_type']
}

function displayValue(dim, slug) {
  if (dim === 'threat_type') return threatTypeLabel(slug)
  return slugToLabel(dim, slug) || slug
}

function valuesForDim(dim) {
  if (dim === 'industry') return INDUSTRIES.map(v => ({ slug: labelToSlug(v), label: v }))
  if (dim === 'region') return ALL_REGIONS.map(v => ({ slug: labelToSlug(v), label: v }))
  if (dim === 'threat_type') return CATEGORIES.filter(c => c.hasData).map(c => ({ slug: c.id, label: c.label }))
  return []
}

function buildCtaUrl(dim, value, dim2, value2) {
  // Threat type becomes the categoryId route param; industry/region become query.
  let ttSlug, geoDim, geoSlug
  if (dim === 'threat_type') { ttSlug = value; geoDim = dim2; geoSlug = value2 }
  else { ttSlug = value2; geoDim = dim; geoSlug = value }
  const params = new URLSearchParams()
  if (geoDim === 'industry') params.set('industry', geoSlug)
  if (geoDim === 'region') params.set('region', geoSlug)
  return `/builder/${ttSlug}?${params.toString()}`
}

function ErrorState({ message }) {
  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
      <div style={{
        fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.14em',
        color: 'rgba(255,69,98,0.65)', textTransform: 'uppercase', marginBottom: 12,
      }}>
        Unavailable Slice
      </div>
      <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 30, fontWeight: 700, marginBottom: 14 }}>
        {message}
      </h1>
      <Link to="/explore" style={{
        display: 'inline-block', marginTop: 20,
        padding: '12px 24px', borderRadius: 12,
        background: 'rgba(255,69,98,0.1)', border: '1px solid rgba(255,69,98,0.3)',
        color: '#FF4562', textDecoration: 'none',
        fontFamily: "'Plus Jakarta Sans'", fontSize: 14, fontWeight: 600,
      }}>
        ← Back to Step 1
      </Link>
    </div>
  )
}

function FeaturedMini({ item }) {
  const firstSeries = item.dataset?.series?.[0]
  const values = firstSeries?.values || []
  const color = firstSeries?.color || '#FF4562'
  const display = item.display || {}
  return (
    <div style={{
      flex: '1 1 220px', minWidth: 0,
      padding: 16, borderRadius: 14,
      background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.07)',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{
        fontFamily: "'JetBrains Mono'", fontSize: 10,
        letterSpacing: '0.1em', textTransform: 'uppercase',
        color: 'rgba(232,236,241,0.6)',
      }}>
        {item.source} · Featured
      </div>
      <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1.35 }}>
        {item.title}
      </div>
      {values.length > 0 && (
        <Spark data={values} color={color} w={240} h={40} />
      )}
      {display.trend && (
        <div style={{
          fontFamily: "'JetBrains Mono'", fontSize: 11,
          color: display.up ? '#10B981' : 'rgba(232,236,241,0.55)',
        }}>
          {display.trend}
        </div>
      )}
    </div>
  )
}

export default function WizardScreen2() {
  const { dim, value, dim2, value2 } = useParams()
  const navigate = useNavigate()
  const [crossingTab, setCrossingTab] = useState(() => crossingDims(dim)[0])

  const sameDim = !!dim2 && dim === dim2
  const geoCross = !!dim2 && GEO_DIMS.has(dim) && GEO_DIMS.has(dim2)

  const v1Valid = dim === 'threat_type'
    ? CATEGORIES.some(c => c.id === value)
    : !!slugToLabel(dim, value)
  const v2Valid = !dim2 || (
    dim2 === 'threat_type'
      ? CATEGORIES.some(c => c.id === value2)
      : !!slugToLabel(dim2, value2)
  )

  const v1Label = v1Valid ? displayValue(dim, value) : value
  const v2Label = dim2 && value2 && v2Valid ? displayValue(dim2, value2) : null
  const fullSlice = !!(dim2 && value2)

  const items = useMemo(() => {
    if (!v1Valid || !v2Valid || sameDim || geoCross) return []
    if (fullSlice) return crossSliceItems(dim, value, dim2, value2)
    return sliceItems(dim, value)
  }, [dim, value, dim2, value2, fullSlice, v1Valid, v2Valid, sameDim, geoCross])

  const featured = useMemo(() => {
    if (!fullSlice) return []
    return items.filter(i => i.featured && i.type === 'chart').slice(0, 3)
  }, [items, fullSlice])

  const stats = useMemo(() => items.filter(i => i.type === 'stat'), [items])
  const statCount = stats.length
  const chartCount = useMemo(() => items.filter(i => i.type === 'chart').length, [items])

  const chips = useMemo(() => {
    if (!fullSlice || !v1Valid || !v2Valid) return []
    const counts = crossSliceCounts(dim, value, dim2)
    const otherKey = dim2 === 'threat_type' ? value2 : (slugToLabel(dim2, value2) || '')
    const entries = Object.entries(counts).filter(([v]) => v !== otherKey)
    return entries.sort((a, b) => b[1] - a[1]).slice(0, 6).map(([v, n]) => {
      const slug2 = dim2 === 'threat_type' ? v : labelToSlug(v)
      const label2 = dim2 === 'threat_type' ? threatTypeLabel(v) : v
      return {
        to: `/explore/${dim}/${value}/${dim2}/${slug2}`,
        label: `${v1Label} × ${label2}`,
        count: n,
      }
    })
  }, [fullSlice, dim, value, dim2, value2, v1Label, v1Valid, v2Valid])

  // Guards after all hooks so rule-of-hooks stays clean
  if (sameDim) return <Navigate to={`/explore/${dim}/${value}`} replace />
  if (geoCross) return <ErrorState message="That slice combination isn't supported yet — pick Threat Type as one of the two dimensions." />
  if (!v1Valid || !v2Valid) return <ErrorState message={`We couldn't find "${!v1Valid ? value : value2}" in the library.`} />


  // ---------------- State A: "choose crossing" --------------------------
  if (!fullSlice) {
    const tabs = crossingDims(dim)
    const activeCross = tabs.includes(crossingTab) ? crossingTab : tabs[0]
    const crossValues = valuesForDim(activeCross)
    const sliceCounts = crossSliceCounts(dim, value, activeCross)

    return (
      <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 24px 80px' }}>
        <nav style={{ marginBottom: 24 }}>
          <Link to="/explore" style={{
            fontFamily: "'JetBrains Mono'", fontSize: 11,
            color: 'rgba(232,236,241,0.5)', textDecoration: 'none',
          }}>← Step 1</Link>
        </nav>

        <div style={{ textAlign: 'center', marginBottom: 38 }}>
          <div style={{
            fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.14em',
            color: 'rgba(255,69,98,0.65)', textTransform: 'uppercase', marginBottom: 14,
          }}>
            Step 2 of 2
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(26px,4vw,40px)',
            fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, color: '#fff',
          }}>
            <span style={{ color: 'rgba(232,236,241,0.5)' }}>{DIM_LABEL[dim]}:</span>{' '}
            <span style={{ background: 'linear-gradient(135deg,#FF4562,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v1Label}</span>
          </h1>
          <p style={{ fontSize: 15, color: 'rgba(232,236,241,0.5)', maxWidth: 560, margin: '0 auto', lineHeight: 1.7 }}>
            {statCount} stats · {chartCount} charts matched so far. Pick a crossing dimension to narrow the slice.
          </p>
        </div>

        {/* Crossing tabs (only if multiple available) */}
        {tabs.length > 1 && (
          <div role="tablist" style={{
            display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 28,
            padding: 4, borderRadius: 14,
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            width: 'fit-content', margin: '0 auto 28px',
          }}>
            {tabs.map(t => {
              const active = t === activeCross
              return (
                <button key={t} onClick={() => setCrossingTab(t)} role="tab" aria-selected={active} style={{
                  padding: '10px 22px', borderRadius: 10, cursor: 'pointer', border: 'none',
                  background: active ? 'rgba(255,69,98,0.12)' : 'transparent',
                  color: active ? '#FF4562' : 'rgba(232,236,241,0.55)',
                  fontFamily: "'Plus Jakarta Sans'",
                  fontSize: 13, fontWeight: 600,
                  transition: 'all 0.2s',
                }}>
                  {DIM_LABEL[t]}
                </button>
              )
            })}
          </div>
        )}
        {tabs.length === 1 && (
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <span style={{
              display: 'inline-block', padding: '7px 14px', borderRadius: 10,
              background: 'rgba(255,69,98,0.08)',
              border: '1px solid rgba(255,69,98,0.2)',
              color: '#FF4562',
              fontFamily: "'Plus Jakarta Sans'", fontSize: 13, fontWeight: 600,
            }}>
              Cross with {DIM_LABEL[tabs[0]]}
            </span>
          </div>
        )}

        {/* Value grid with counts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 12,
        }}>
          {crossValues.map(cv => {
            const labelKey = activeCross === 'threat_type' ? cv.slug : cv.label
            const count = sliceCounts[labelKey] || 0
            return (
              <button
                key={cv.slug}
                onClick={() => navigate(`/explore/${dim}/${value}/${activeCross}/${cv.slug}`)}
                style={{
                  textAlign: 'left', padding: '16px 18px', borderRadius: 14,
                  background: 'rgba(255,255,255,0.03)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(255,255,255,0.07)',
                  color: '#fff', cursor: 'pointer',
                  fontFamily: "'Plus Jakarta Sans'", fontSize: 14, fontWeight: 600,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  transition: 'all 0.2s',
                  opacity: count === 0 ? 0.45 : 1,
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,69,98,0.08)'
                  e.currentTarget.style.borderColor = 'rgba(255,69,98,0.3)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
                }}
              >
                <span>{cv.label}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontSize: 11,
                  color: 'rgba(232,236,241,0.45)',
                  padding: '1px 7px', borderRadius: 10,
                  background: 'rgba(255,255,255,0.04)',
                }}>{count}</span>
              </button>
            )
          })}
        </div>

        {/* Stats already matching just this 1D slice — narrows further in Step 2 */}
        {stats.length > 0 && (
          <section style={{ marginTop: 56 }}>
            <div style={{
              display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
              marginBottom: 14, gap: 16, flexWrap: 'wrap',
            }}>
              <div>
                <div style={{
                  fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em',
                  color: 'rgba(232,236,241,0.4)', textTransform: 'uppercase', marginBottom: 6,
                }}>
                  Already in this slice
                </div>
                <h2 style={{
                  fontFamily: "'Plus Jakarta Sans'", fontSize: 22, fontWeight: 700,
                  letterSpacing: '-0.02em', color: '#fff',
                }}>
                  {v1Label} · what the library says
                </h2>
              </div>
              <div style={{
                fontFamily: "'JetBrains Mono'", fontSize: 11,
                color: 'rgba(232,236,241,0.4)',
              }}>
                {stats.length} stats · 1D slice
              </div>
            </div>
            <div className="slice-grid">
              {stats.map(s => <SliceStatCard key={s.id} item={s} />)}
            </div>
          </section>
        )}
      </div>
    )
  }

  // ---------------- State B: full slice view ----------------------------
  const ctaHref = buildCtaUrl(dim, value, dim2, value2)
  return (
    <div style={{ maxWidth: 1140, margin: '0 auto', padding: '48px 24px 100px' }}>
      <nav style={{ marginBottom: 18, display: 'flex', alignItems: 'center', gap: 14 }}>
        <Link to="/explore" style={{
          fontFamily: "'JetBrains Mono'", fontSize: 11,
          color: 'rgba(232,236,241,0.5)', textDecoration: 'none',
        }}>Step 1</Link>
        <span style={{ color: 'rgba(232,236,241,0.5)' }}>·</span>
        <Link to={`/explore/${dim}/${value}`} style={{
          fontFamily: "'JetBrains Mono'", fontSize: 11,
          color: 'rgba(232,236,241,0.5)', textDecoration: 'none',
        }}>{v1Label}</Link>
      </nav>

      {/* Header */}
      <div style={{ marginBottom: 30 }}>
        <div style={{
          fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.14em',
          color: 'rgba(255,69,98,0.65)', textTransform: 'uppercase', marginBottom: 12,
        }}>
          Slice View
        </div>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(28px,4.2vw,44px)',
          fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10, color: '#fff',
        }}>
          <span style={{ background: 'linear-gradient(135deg,#FF4562,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{v1Label}</span>
          <span style={{ color: 'rgba(232,236,241,0.6)', margin: '0 14px' }}>×</span>
          <span style={{ color: '#fff' }}>{v2Label}</span>
        </h1>
        <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.5)' }}>
          {statCount} stats · {chartCount} charts in this slice
        </p>
      </div>

      {/* Featured row */}
      {featured.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{
            fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em',
            color: 'rgba(232,236,241,0.4)', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Featured in this slice
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {featured.map(f => <FeaturedMini key={f.id} item={f} />)}
          </div>
        </section>
      )}

      {/* Mixed stat cards */}
      {stats.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{
            fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em',
            color: 'rgba(232,236,241,0.4)', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            What the library says
          </div>
          <div className="slice-grid">
            {stats.map(s => <SliceStatCard key={s.id} item={s} />)}
          </div>
        </section>
      )}

      {/* Cross-slice chips */}
      {chips.length > 0 && (
        <section style={{ marginBottom: 36 }}>
          <div style={{
            fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em',
            color: 'rgba(232,236,241,0.4)', textTransform: 'uppercase',
            marginBottom: 12,
          }}>
            Related slices
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {chips.map(c => <CrossSliceChip key={c.to} {...c} />)}
          </div>
        </section>
      )}

      {/* Empty state */}
      {items.length === 0 && (
        <div style={{
          padding: 40, textAlign: 'center', borderRadius: 16,
          background: 'rgba(255,255,255,0.03)',
          border: '1px dashed rgba(255,255,255,0.08)',
          color: 'rgba(232,236,241,0.55)', marginBottom: 32,
        }}>
          Nothing in the library for this exact slice yet. You can still build a chart from scratch.
        </div>
      )}

      {/* CTA */}
      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <Link to={ctaHref} style={{
          display: 'inline-block',
          padding: '16px 36px',
          borderRadius: 14,
          background: 'linear-gradient(135deg,#FF4562,#F97316)',
          color: '#fff', textDecoration: 'none',
          fontFamily: "'Plus Jakarta Sans'",
          fontSize: 15, fontWeight: 700, letterSpacing: '-0.01em',
          boxShadow: '0 8px 28px rgba(255,69,98,0.35)',
          transition: 'transform 0.2s',
        }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)' }}>
          Build a Custom Chart →
        </Link>
      </div>
    </div>
  )
}
