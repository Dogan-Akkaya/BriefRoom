import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useToastStore } from '../stores/useToastStore'
import { downloadPNG } from '../lib/export'
import Spark from './Spark'
import PNGExportModal from './PNGExportModal'
import ShareLinkModal from './ShareLinkModal'
import { similarFindings } from '../lib/similarFindings'
import { BrandChip } from '../lib/sourceBrands'
import { sourceType } from '../lib/methodologyBias'

function MiniChart({ data, labels, color, type }) {
  const w = 280, h = 140
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const toX = (i) => 20 + (i / (data.length - 1)) * (w - 40)
  const toY = (v) => h - 20 - ((v - min) / range) * (h - 40)

  if (type === 'line') {
    const pts = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
    const fillPts = `${toX(0)},${h - 20} ${pts} ${toX(data.length - 1)},${h - 20}`
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
        <polygon points={fillPts} fill={color} fillOpacity="0.08" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill={color} opacity="0.6" />)}
        {labels.map((l, i) => <text key={i} x={toX(i)} y={h - 4} textAnchor="middle" fill="rgba(232,236,241,0.2)" fontSize="8" fontFamily="'JetBrains Mono',monospace">{l}</text>)}
      </svg>
    )
  }

  const barW = Math.min(24, (w - 40) / data.length - 4)
  const barGap = (w - 40) / data.length
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
      {data.map((v, i) => {
        const barH = ((v - min) / range) * (h - 44) + 8
        const x = 20 + i * barGap + (barGap - barW) / 2
        const y = h - 20 - barH
        return <rect key={i} x={x} y={y} width={barW} height={barH} rx={3} fill={color} fillOpacity="0.7" />
      })}
      {labels.map((l, i) => <text key={i} x={20 + i * barGap + barGap / 2} y={h - 4} textAnchor="middle" fill="rgba(232,236,241,0.2)" fontSize="7" fontFamily="'JetBrains Mono',monospace">{l.length > 6 ? l.slice(0, 6) : l}</text>)}
    </svg>
  )
}

const exportBtn = {
  display: 'inline-flex', alignItems: 'center', gap: 6,
  padding: '8px 16px', fontSize: 11, fontWeight: 500,
  fontFamily: "'Satoshi','DM Sans',sans-serif",
  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
  borderRadius: 10, color: 'rgba(232,236,241,0.5)', cursor: 'pointer',
  transition: 'all 0.25s', backdropFilter: 'blur(8px)',
}

export default function ChartPreviewModal({ chart, type, onClose, onCustomize, onSwapToFinding }) {
  const navigate = useNavigate()
  const toast = useToastStore((s) => s.show)
  const [showPNGModal, setShowPNGModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [pngMode, setPngMode] = useState('export') // 'export' or 'customize'
  const chartAreaRef = useRef(null)

  if (!chart) return null

  const isPopular = type === 'popular'

  // Cross-vendor comparability — only computed for report-mode previews
  // that ship through the original-item carrier.
  const similar = useMemo(
    () => (!isPopular && chart._originalItem ? similarFindings(chart._originalItem, 6) : []),
    [chart, isPopular]
  )
  const hasSimilar = similar.length > 0

  const handleDirectExport = async () => {
    if (chartAreaRef.current) {
      const ok = await downloadPNG(chartAreaRef.current, `briefroom-${chart.id || 'chart'}`)
      if (ok) toast('Chart exported!')
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: hasSimilar ? 960 : 560, width: '92%',
          background: 'rgba(16,20,34,0.95)',
          backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24, padding: hasSimilar ? '36px 24px 36px 36px' : 36,
          boxShadow: '0 32px 100px rgba(0,0,0,0.5)',
          position: 'relative',
          maxHeight: '92vh', overflowY: 'auto',
          display: hasSimilar ? 'grid' : 'block',
          gridTemplateColumns: hasSimilar ? 'minmax(0, 1fr) 280px' : undefined,
          gap: hasSimilar ? 24 : 0,
        }}
      >
        <div style={{ minWidth: 0 }}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 40, height: 40, borderRadius: 10,
            background: 'rgba(255,255,255,0.04)', border: 'none',
            color: 'rgba(232,236,241,0.4)', fontSize: 16,
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
        >
          ×
        </button>

        {isPopular ? (
          /* ── Popular Mode ── */
          <>
            <div ref={chartAreaRef}>
            {/* Tag pill */}
            <span style={{
              display: 'inline-block',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9, fontWeight: 600,
              letterSpacing: '0.1em', textTransform: 'uppercase',
              padding: '4px 10px', borderRadius: 6,
              background: `${chart.color}18`, color: chart.color,
              border: `1px solid ${chart.color}30`,
              marginBottom: 14,
            }}>
              {chart.tag}
            </span>

            {/* Title */}
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 22, fontWeight: 700, color: '#E8ECF1',
              lineHeight: 1.25, marginBottom: 10,
            }}>
              {chart.title}
            </h3>

            {/* Trend indicator */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 12, fontWeight: 600,
              color: chart.up ? '#10B981' : '#EF4444',
              marginBottom: 14,
              display: 'flex', alignItems: 'center', gap: 4,
            }}>
              {chart.up ? '▲' : '▼'} {chart.trend}
            </div>

            {/* Description */}
            <p style={{
              fontSize: 13, lineHeight: 1.65,
              color: 'rgba(232,236,241,0.45)',
              marginBottom: 20,
            }}>
              {chart.detail}
            </p>

            {/* Sparkline chart */}
            <div style={{
              borderRadius: 12, overflow: 'hidden',
              background: 'rgba(0,0,0,0.15)', padding: '12px 8px 4px',
              marginBottom: 18,
            }}>
              <Spark data={chart.data} color={chart.color} />
            </div>

            {/* Metric boxes */}
            {chart.metrics && (
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                {chart.metrics.map((m, i) => (
                  <div key={i} style={{
                    flex: 1, padding: '14px 16px', borderRadius: 12,
                    background: 'rgba(255,255,255,0.025)',
                    border: '1px solid rgba(255,255,255,0.05)',
                  }}>
                    <div style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'rgba(232,236,241,0.6)', marginBottom: 6,
                    }}>
                      {m.label}
                    </div>
                    <div style={{
                      fontFamily: "'Plus Jakarta Sans', sans-serif",
                      fontSize: 18, fontWeight: 700, color: '#E8ECF1',
                    }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            </div>{/* end chartAreaRef */}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

            {/* Export row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
              <button onClick={() => { setPngMode('export'); setShowPNGModal(true) }} style={{
                flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px', fontSize: 13, fontWeight: 600,
                background: 'rgba(255,69,98,0.1)', border: '1px solid rgba(255,69,98,0.25)',
                borderRadius: 10, color: '#FF4562', cursor: 'pointer',
              }}>
                Export PNG
              </button>
              <button onClick={() => setShowShareModal(true)} style={{
                flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px', fontSize: 13, fontWeight: 500,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, color: 'rgba(232,236,241,0.5)', cursor: 'pointer',
              }}>
                Share Link
              </button>
            </div>

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

            {/* Customize CTA */}
            <div
              onClick={() => { setPngMode('customize'); setShowPNGModal(true) }}
              style={{
                background: 'rgba(255,69,98,0.1)',
                border: '1px solid rgba(255,69,98,0.25)',
                color: '#FF4562',
                borderRadius: 12, padding: '12px 24px',
                width: '100%', textAlign: 'center',
                fontSize: 14, fontWeight: 600,
                cursor: 'pointer', marginTop: 12,
                fontFamily: "'Satoshi','DM Sans',sans-serif",
                transition: 'all 0.2s',
              }}
            >
              Customize & Export →
            </div>
          </>
        ) : (
          /* ── Report Mode ── */
          <>
            <div ref={chartAreaRef}>
            {/* Source brand + source-type badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, flexWrap: 'wrap' }}>
              <BrandChip source={chart.source} size="lg" />
              {(() => {
                const t = sourceType(chart.source)
                if (!t) return null
                return (
                  <span style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 9,
                    background: 'rgba(255,255,255,0.04)',
                    color: 'rgba(232,236,241,0.5)',
                    padding: '3px 8px', borderRadius: 4,
                    letterSpacing: '0.04em',
                  }}>{t}</span>
                )
              })()}
            </div>

            {/* Title */}
            <h3 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 22, fontWeight: 700, color: '#E8ECF1',
              lineHeight: 1.25, marginBottom: 10,
            }}>
              {chart.title}
            </h3>

            {/* Year + Category */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 10,
              marginBottom: 14,
            }}>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 11, color: 'rgba(232,236,241,0.6)',
              }}>
                {chart.year}
              </span>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9, color: 'rgba(232,236,241,0.6)',
                background: 'rgba(255,255,255,0.03)',
                padding: '3px 8px', borderRadius: 5,
              }}>
                {chart.category}
              </span>
            </div>

            {/* Description */}
            <p style={{
              fontSize: 13, lineHeight: 1.65,
              color: 'rgba(232,236,241,0.45)',
              marginBottom: 20,
            }}>
              {chart.description}
            </p>

            {/* Chart area */}
            <div style={{
              borderRadius: 12, overflow: 'hidden',
              background: 'rgba(0,0,0,0.15)', padding: '12px 6px 0',
              marginBottom: 18,
            }}>
              <MiniChart
                data={chart.dummyData}
                labels={chart.dummyLabels}
                color={chart.color}
                type={chart.chartType}
              />
            </div>

            {/* Source attribution */}
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: 'rgba(232,236,241,0.45)',
              marginBottom: 18,
            }}>
              Source: {chart.source}
            </div>

            </div>{/* end chartAreaRef */}

            {/* Divider */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', marginBottom: 16 }} />

            {/* Export buttons */}
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={handleDirectExport} style={{
                flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px', fontSize: 13, fontWeight: 600,
                background: 'rgba(255,69,98,0.1)', border: '1px solid rgba(255,69,98,0.25)',
                borderRadius: 10, color: '#FF4562', cursor: 'pointer',
              }}>
                Export PNG
              </button>
              <button onClick={() => setShowShareModal(true)} style={{
                flex: 1, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px', fontSize: 13, fontWeight: 500,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 10, color: 'rgba(232,236,241,0.5)', cursor: 'pointer',
              }}>
                Share Link
              </button>
            </div>

            {/* Customize CTA */}
            <div style={{ height: 1, background: 'rgba(255,255,255,0.06)', margin: '12px 0' }} />
            <div
              onClick={() => { setPngMode('customize'); setShowPNGModal(true) }}
              style={{
                background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)',
                color: '#60A5FA', borderRadius: 12, padding: '12px 24px', width: '100%', textAlign: 'center',
                fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: "'Satoshi','DM Sans',sans-serif", transition: 'all 0.2s',
              }}
            >
              Customize & Export →
            </div>
          </>
        )}
        </div>{/* end primary panel */}
        {hasSimilar && (
          <SimilarFindingsRail
            items={similar}
            onPick={(it) => {
              if (onSwapToFinding) onSwapToFinding(it)
            }}
          />
        )}
      </div>
      {showPNGModal && <PNGExportModal onClose={() => setShowPNGModal(false)} chartType={type} mode={pngMode} onExport={handleDirectExport} />}
      {showShareModal && <ShareLinkModal onClose={() => setShowShareModal(false)} categoryId={chart.categoryId || chart.id} />}
    </div>
  )
}

// Right rail: small thumbnails for findings that measure the same KPI
// across other vendors. Click swaps the modal's primary view.
function SimilarFindingsRail({ items, onPick }) {
  return (
    <aside
      style={{
        borderLeft: '1px solid rgba(255,255,255,0.06)',
        paddingLeft: 18,
        minWidth: 0,
        maxHeight: 'calc(92vh - 72px)',
        overflowY: 'auto',
      }}
    >
      <div style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9.5, letterSpacing: '0.14em', textTransform: 'uppercase',
        color: 'rgba(232,236,241,0.6)', marginBottom: 6,
      }}>
        Compare across vendors
      </div>
      <div style={{
        fontSize: 11, color: 'rgba(232,236,241,0.45)', lineHeight: 1.5, marginBottom: 14,
      }}>
        Same KPI surfaced in {items.length} other vendor report{items.length === 1 ? '' : 's'}. Click to swap the primary view.
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {items.map((it) => {
          const value = it.value || (Array.isArray(it.dataset?.series?.[0]?.values)
            ? `${it.dataset.series[0].values[0]} ${it.value_unit || ''}`.trim()
            : '—')
          return (
            <button
              key={it.id}
              onClick={() => onPick && onPick(it)}
              style={{
                textAlign: 'left',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 10,
                padding: '10px 12px',
                cursor: 'pointer',
                color: 'inherit',
                display: 'flex', flexDirection: 'column', gap: 6,
                transition: 'all 0.18s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(96,165,250,0.32)'
                e.currentTarget.style.background = 'rgba(59,130,246,0.06)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)'
                e.currentTarget.style.background = 'rgba(255,255,255,0.025)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <BrandChip source={it._report_source} size="sm" />
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 9, color: 'rgba(232,236,241,0.5)',
                }}>{it._report_year}</span>
              </div>
              <div style={{
                fontFamily: "'Plus Jakarta Sans', sans-serif",
                fontSize: 18, fontWeight: 700, color: '#E8ECF1',
                lineHeight: 1.1,
              }}>{value}</div>
              <div style={{
                fontSize: 11, color: 'rgba(232,236,241,0.6)',
                lineHeight: 1.35,
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>{it.title}</div>
            </button>
          )
        })}
      </div>
    </aside>
  )
}
