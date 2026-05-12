import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LabelList } from 'recharts'
import { reportById, primaryThreatLabel } from '../lib/intelligenceLibrary'
import { BrandChip, sourceBrand } from '../lib/sourceBrands'
import KnowledgeGraphBG from '../components/KnowledgeGraphBG'
import SliceStatCard from '../components/explore/SliceStatCard'
import Reveal from '../components/Reveal'
import ChartPreviewModal from '../components/ChartPreviewModal'
import { methodologyBias } from '../lib/methodologyBias'
import { MANUAL_REPORT_RAW_BY_ID } from '../lib/manualData'

const axisColor = '#5C6478'
const gridColor = 'rgba(255,255,255,0.04)'
const tooltipStyle = { backgroundColor: '#151C2F', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, fontSize: 11 }

function ChartCard({ item, onClick }) {
  const [hovered, setHovered] = useState(false)
  const dataset = item.dataset
  const labels = dataset?.labels || []
  const series = Array.isArray(dataset?.series) ? dataset.series : []
  const chartType = item.preferred_chart || 'bar'

  const data = useMemo(() =>
    labels.map((label, i) => {
      const row = { name: label }
      for (const s of series) row[s.name || 'value'] = s.values?.[i] ?? null
      return row
    }), [labels, series])

  const primary = series[0]?.color || item.color || '#60A5FA'

  // Y-axis unit caption: prefer explicit y_label, fall back to value_unit
  // ("days", "%", "count"). Pies don't show a Y-axis so skip.
  const yUnitLabel = chartType === 'pie' ? null : (item.y_label || item.value_unit || null)
  const yAxisLabelProps = yUnitLabel
    ? { value: yUnitLabel, angle: -90, position: 'insideLeft', offset: 8, style: { fill: axisColor, fontSize: 10, fontFamily: "'JetBrains Mono', monospace", textAnchor: 'middle' } }
    : undefined

  // Show legend when there are 2+ series or the chart is a pie/donut (slices
  // need labels). Single-series bar/line charts already make the y-unit
  // explicit; a legend would be redundant.
  const showLegend = series.length > 1

  const legendStyle = {
    fontSize: 10,
    fontFamily: "'JetBrains Mono', monospace",
    color: 'rgba(232,236,241,0.7)',
    paddingTop: 6,
  }

  // Pie slice labels — show category name when it fits, else suppress.
  const renderPieLabel = ({ name, percent }) => {
    if (!name || percent < 0.06) return ''
    const pct = Math.round(percent * 100)
    return `${name} ${pct}%`
  }

  // Tooltip formatter — append unit when known (e.g. "5.3 days").
  const unitForTooltip = item.value_unit || ''
  const tooltipFormatter = unitForTooltip
    ? (val, name) => [`${val} ${unitForTooltip}`, name]
    : undefined

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 22,
        borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(16px)',
        border: `1px solid ${hovered ? 'rgba(96,165,250,0.32)' : 'rgba(255,255,255,0.07)'}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? '0 14px 36px rgba(0,0,0,0.4)' : 'none',
        position: 'relative',
      }}
    >
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: 14, gap: 12,
      }}>
        <div style={{
          fontFamily: "'Plus Jakarta Sans'", fontSize: 14,
          color: 'rgba(232,236,241,0.85)', flex: 1, minWidth: 0,
        }}>{item.title}</div>
        {onClick && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
            color: hovered ? 'rgba(96,165,250,0.85)' : 'rgba(232,236,241,0.32)',
            transition: 'color 0.2s',
            whiteSpace: 'nowrap',
          }}>Preview & Export ↗</span>
        )}
      </div>
      <div style={{ width: '100%', height: chartType === 'pie' ? 290 : 280 }}>
        <ResponsiveContainer minWidth={0} minHeight={0}>
          {chartType === 'line' ? (
            <LineChart data={data} margin={{ top: 6, right: 12, left: yUnitLabel ? 8 : 0, bottom: 18 }}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} label={yAxisLabelProps} />
              <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
              {showLegend && <Legend wrapperStyle={legendStyle} iconSize={9} />}
              {series.map((s, i) => (
                <Line key={i} type="monotone" dataKey={s.name || 'value'} stroke={s.color || primary} strokeWidth={2} dot={{ r: 2, fill: s.color || primary }} />
              ))}
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart data={data} margin={{ top: 6, right: 12, left: yUnitLabel ? 8 : 0, bottom: 18 }}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} label={yAxisLabelProps} />
              <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
              {showLegend && <Legend wrapperStyle={legendStyle} iconSize={9} />}
              {series.map((s, i) => (
                <Area key={i} type="monotone" dataKey={s.name || 'value'} stroke={s.color || primary} fill={(s.color || primary) + '33'} />
              ))}
            </AreaChart>
          ) : chartType === 'pie' ? (
            <PieChart margin={{ top: 0, right: 0, bottom: 24, left: 0 }}>
              <Pie data={data} dataKey={series[0]?.name || 'value'} nameKey="name" innerRadius="42%" outerRadius="78%" paddingAngle={2} label={renderPieLabel}>
                {data.map((_, i) => <Cell key={i} fill={series[0]?.color || primary} fillOpacity={0.3 + 0.7 * (i / Math.max(1, data.length - 1))} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
              <Legend wrapperStyle={legendStyle} iconSize={9} layout="horizontal" verticalAlign="bottom" />
            </PieChart>
          ) : (
            <BarChart data={data} margin={{ top: 6, right: 12, left: yUnitLabel ? 8 : 0, bottom: 18 }}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} label={yAxisLabelProps} />
              <Tooltip contentStyle={tooltipStyle} formatter={tooltipFormatter} />
              {showLegend && <Legend wrapperStyle={legendStyle} iconSize={9} />}
              {series.map((s, i) => (
                <Bar key={i} dataKey={s.name || 'value'} fill={s.color || primary} fillOpacity={0.8} radius={[4, 4, 0, 0]} />
              ))}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      <CardCaption item={item} />
    </div>
  )
}

// 12 months ago, evaluated once at module load. "Today" per the project
// clock is 2026-05-12 — a JS Date will use the system clock, which is fine
// because stale-checking only cares about >365-day deltas.
const STALE_MS = 365 * 24 * 60 * 60 * 1000
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function staleFlagFor(item) {
  const raw = item.updated_at || item.data_period || null
  if (!raw || typeof raw !== 'string') return null
  // Accept YYYY-MM-DD or YYYY-MM.
  const m = raw.match(/^(\d{4})-(\d{2})/)
  if (!m) return null
  const y = parseInt(m[1], 10)
  const mo = parseInt(m[2], 10)
  if (!y || !mo) return null
  const d = new Date(Date.UTC(y, mo - 1, 1))
  if (isNaN(d.getTime())) return null
  if (Date.now() - d.getTime() < STALE_MS) return null
  return `As of ${MONTH_NAMES[mo - 1]} ${y}`
}

function CardCaption({ item }) {
  const bits = []
  if (item.comparison) bits.push(item.comparison)
  if (item.page_or_section) bits.push(item.page_or_section)
  const stale = staleFlagFor(item)
  // Layered citation — when an item carries a `cited_source` field (set
  // on the manual JSON when Vendor A cites Vendor B's number), surface
  // the chain so the original attribution isn't obscured.
  const cited = item.cited_source
  if (!bits.length && !stale && !cited) return null
  return (
    <div style={{
      marginTop: 10,
      fontFamily: "'JetBrains Mono'",
      fontSize: 10,
      color: 'rgba(232,236,241,0.45)',
      letterSpacing: '0.04em',
      display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center',
    }}>
      {stale && (
        <span style={{
          padding: '2px 7px', borderRadius: 4,
          background: 'rgba(245,158,11,0.08)',
          border: '1px solid rgba(245,158,11,0.22)',
          color: 'rgba(252,211,77,0.9)',
          letterSpacing: '0.05em',
        }}>{stale}</span>
      )}
      {cited && (
        <span
          title={`Original source: ${cited}. Surfaced by the report's vendor.`}
          style={{
            padding: '2px 7px', borderRadius: 4,
            background: 'rgba(59,130,246,0.08)',
            border: '1px solid rgba(59,130,246,0.22)',
            color: 'rgba(96,165,250,0.85)',
            letterSpacing: '0.04em',
            cursor: 'help',
          }}
        >Cites: {cited}</span>
      )}
      {bits.map((b, i) => <span key={i}>{b}</span>)}
    </div>
  )
}

function StatCardWithCaption({ item }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <SliceStatCard item={item} />
      <CardCaption item={item} />
    </div>
  )
}

function spanForItem(item) {
  if (item.type === 'chart') return 3
  const cs = item.card_style
  if (cs === 'quote') return 3
  if (cs === 'sparkline' || cs === 'bar') return 2
  return 1
}

// Adapter — turn a manual-store chart item into the shape ChartPreviewModal
// expects in `type='report'` mode. The modal's MiniChart only handles
// 'line' and 'bar'; pie/area fall back to bar (lossy but functional).
// `fallbackSource` covers the case where the report entity inherits its
// source from the file-level field rather than carrying its own.
function toModalChart(item, meta, fallbackSource = '') {
  const series = item.dataset?.series?.[0]
  const labels = item.dataset?.labels || []
  const values = series?.values || []
  const color = series?.color || item.color || meta.color || '#60A5FA'
  const sourceStr = item.source || meta.source || meta.report_meta?.source || fallbackSource || ''
  const brand = sourceBrand(sourceStr)
  const rawType = item.preferred_chart || 'bar'
  const modalChartType = rawType === 'line' ? 'line' : 'bar'

  return {
    id: item.id,
    title: item.title,
    description: item.description || meta.description || '',
    year: meta.year,
    // Modal's "category" chip now reflects the canonical Threat Type (unified
    // taxonomy). Falls back to the legacy free-text field only if no
    // threat_type is set.
    category: primaryThreatLabel(meta) || meta.category || '',
    source: sourceStr,
    sourceShort: brand?.short || (sourceStr ? sourceStr.split(/\s+/)[0] : 'Source'),
    dummyData: values,
    dummyLabels: labels,
    color,
    chartType: modalChartType,
    categoryId: item.id,
    // Carry the original item + report context so the modal's comparability
    // rail can look up similar findings across other vendors.
    _originalItem: {
      ...item,
      _report_id: meta.report_meta?.report_id,
      _report_title: meta.title,
      _report_source: sourceStr,
      _report_year: meta.year,
    },
  }
}

export default function ReportDetail() {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const data = reportById(reportId)
  const [previewChart, setPreviewChart] = useState(null)

  useEffect(() => {
    document.title = data ? `${data.meta.title} — Brief Room` : 'Report not found — Brief Room'
  }, [data])

  if (!data) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
        <KnowledgeGraphBG />
        <div style={{ position: 'relative', zIndex: 2, maxWidth: 720, margin: '0 auto', padding: '120px 24px' }}>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 28, color: '#E8ECF1', marginBottom: 16 }}>Report not found</h1>
          <p style={{ color: 'rgba(232,236,241,0.55)', marginBottom: 24, fontSize: 14, lineHeight: 1.6 }}>
            No report matches the id <code style={{ background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: 4 }}>{reportId}</code>.
          </p>
          <Link to="/reports" style={{ color: '#60A5FA', textDecoration: 'none', fontSize: 13, fontFamily: "'JetBrains Mono'" }}>← Back to Global Reports</Link>
        </div>
      </div>
    )
  }

  const meta = data.meta
  const cards = data.cards

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KnowledgeGraphBG />
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 560, zIndex: 1,
        background: 'linear-gradient(180deg, rgba(10,14,26,0.92) 0%, rgba(10,14,26,0.65) 40%, rgba(10,14,26,0.28) 75%, rgba(10,14,26,0) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 2, paddingTop: 80, paddingBottom: 80, maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
        <Reveal>
          {/* Breadcrumb — Home / Global Reports / <current title>. */}
          <nav aria-label="Breadcrumb" style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap',
            gap: 6, marginBottom: 18,
            fontFamily: "'JetBrains Mono', monospace", fontSize: 11,
            color: 'rgba(232,236,241,0.42)',
          }}>
            <Link to="/" style={{ color: 'rgba(232,236,241,0.55)', textDecoration: 'none' }}>Home</Link>
            <span aria-hidden="true">/</span>
            <Link to="/reports" style={{ color: 'rgba(232,236,241,0.55)', textDecoration: 'none' }}>Global Reports</Link>
            <span aria-hidden="true">/</span>
            <span aria-current="page" style={{
              color: 'rgba(232,236,241,0.75)',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
              maxWidth: 480,
            }}>{data.meta.title}</span>
          </nav>
          <button
            onClick={() => navigate('/reports')}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '7px 14px', fontSize: 12, fontWeight: 500,
              borderRadius: 8, background: 'rgba(255,255,255,0.04)',
              color: 'rgba(232,236,241,0.55)', border: '1px solid rgba(255,255,255,0.08)',
              cursor: 'pointer', fontFamily: "'Satoshi', sans-serif",
              transition: 'all 0.2s', marginBottom: 28,
            }}
          >← Back to Global Reports</button>

          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 18, flexWrap: 'wrap', marginBottom: 30 }}>
            <div style={{ flex: '1 1 600px', minWidth: 280 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
                <BrandChip source={meta.source || data.source} size="lg" />
                <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'rgba(232,236,241,0.6)' }}>{meta.year}</span>
                {(() => {
                  const label = primaryThreatLabel(meta)
                  if (!label) return null
                  return (
                    <span style={{
                      fontFamily: "'JetBrains Mono'", fontSize: 10,
                      color: 'rgba(232,236,241,0.7)',
                      background: 'rgba(255,255,255,0.04)',
                      padding: '4px 9px', borderRadius: 6,
                    }}>{label}</span>
                  )
                })()}
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontSize: 9,
                  color: 'rgba(96,165,250,0.85)',
                  background: 'rgba(59,130,246,0.1)',
                  padding: '4px 9px', borderRadius: 6,
                  border: '1px solid rgba(59,130,246,0.18)',
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                }}>{cards.length} findings</span>
              </div>
              <h1 style={{
                fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(28px,3.4vw,42px)',
                fontWeight: 700, color: '#E8ECF1', lineHeight: 1.15, marginBottom: 14,
                letterSpacing: '-0.01em',
              }}>{meta.title}</h1>
              {meta.description && (
                <p style={{
                  fontSize: 14, color: 'rgba(232,236,241,0.55)',
                  lineHeight: 1.7, maxWidth: 760, marginBottom: 16,
                }}>{meta.description}</p>
              )}
              <div style={{
                display: 'flex', gap: 18, flexWrap: 'wrap',
                fontFamily: "'JetBrains Mono'", fontSize: 11,
                color: 'rgba(232,236,241,0.5)',
              }}>
                <span>Source: {meta.source || data.source}</span>
                {meta.report_meta?.publication_date && <span>Published: {meta.report_meta.publication_date}</span>}
                {meta.report_meta?.extracted_on && <span>Indexed: {meta.report_meta.extracted_on}</span>}
              </div>
              {(() => {
                const bias = methodologyBias(meta.source || data.source)
                if (!bias) return null
                return (
                  <div
                    title={bias.note}
                    style={{
                      marginTop: 12,
                      padding: '8px 12px',
                      borderRadius: 8,
                      background: 'rgba(245,158,11,0.06)',
                      border: '1px solid rgba(245,158,11,0.18)',
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 11,
                      color: 'rgba(252,211,77,0.85)',
                      cursor: 'help',
                      display: 'inline-flex', alignItems: 'center', gap: 8,
                      maxWidth: 760,
                    }}
                  >
                    <span style={{ opacity: 0.75 }}>Sampling:</span>
                    <span>{bias.sampling}</span>
                    <span style={{ color: 'rgba(232,236,241,0.45)', fontSize: 10 }} title={bias.note}>ⓘ</span>
                  </div>
                )
              })()}
            </div>
            {meta.external_url && (
              <a
                href={meta.external_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '10px 18px', fontSize: 12, fontWeight: 600,
                  borderRadius: 10, background: 'rgba(59,130,246,0.14)',
                  color: '#60A5FA', border: '1px solid rgba(59,130,246,0.22)',
                  textDecoration: 'none', fontFamily: "'Satoshi', sans-serif",
                  whiteSpace: 'nowrap', transition: 'all 0.2s',
                }}
              >Open original report ↗</a>
            )}
          </div>
        </Reveal>

        <style>{`
          .report-detail-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            grid-auto-flow: dense;
            gap: 16px;
          }
          @media (max-width: 900px) {
            .report-detail-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
            .report-detail-grid > * { grid-column: span 1 !important; }
          }
          @media (max-width: 560px) {
            .report-detail-grid { grid-template-columns: 1fr; }
          }
        `}</style>
        <div className="report-detail-grid">
          {cards.map((item, i) => (
            <Reveal
              key={item.id}
              delay={Math.min(i * 30, 600)}
              style={{ gridColumn: `span ${spanForItem(item)}` }}
            >
              {item.type === 'chart'
                ? <ChartCard item={item} onClick={() => setPreviewChart(toModalChart(item, meta, data.source))} />
                : <StatCardWithCaption item={item} />}
            </Reveal>
          ))}
        </div>
      </div>
      {previewChart && (
        <ChartPreviewModal
          chart={previewChart}
          type="report"
          onClose={() => setPreviewChart(null)}
          onSwapToFinding={(it) => {
            // Build a modal-shape chart from the swapped-in finding. Pull
            // the other report's meta from MANUAL_REPORT_RAW_BY_ID so the
            // year / category / source attribution updates correctly.
            const payload = it?._report_id ? MANUAL_REPORT_RAW_BY_ID[it._report_id] : null
            if (!payload?.meta) return
            setPreviewChart(toModalChart(it, payload.meta, payload.source))
          }}
        />
      )}
    </div>
  )
}
