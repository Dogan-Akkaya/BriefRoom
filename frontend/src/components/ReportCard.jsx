import { useState } from 'react'
import { BrandChip } from '../lib/sourceBrands'
import { threatTypeLabel } from '../lib/intelligenceLibrary'

// Lightweight SVG chart placeholder — no Recharts dependency
function MiniChart({ data, labels, color, type }) {
  const w = 280, h = 140
  const safeData = (Array.isArray(data) && data.length) ? data : [0]
  const safeLabels = (Array.isArray(labels) && labels.length) ? labels : safeData.map(() => '')
  const max = Math.max(...safeData), min = Math.min(...safeData)
  const range = max - min || 1
  const toX = (i) => 20 + (i / Math.max(1, safeData.length - 1)) * (w - 40)
  const toY = (v) => h - 20 - ((v - min) / range) * (h - 40)

  if (type === 'line' || type === 'area') {
    const pts = safeData.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
    const fillPts = `${toX(0)},${h - 20} ${pts} ${toX(safeData.length - 1)},${h - 20}`
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
        <polygon points={fillPts} fill={color} fillOpacity="0.08" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        {safeData.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="2.5" fill={color} opacity="0.6" />)}
        {safeLabels.map((l, i) => <text key={i} x={toX(i)} y={h - 4} textAnchor="middle" fill="rgba(232,236,241,0.2)" fontSize="8" fontFamily="'JetBrains Mono',monospace">{l}</text>)}
      </svg>
    )
  }

  // Bar chart
  const barW = Math.min(24, (w - 40) / safeData.length - 4)
  const barGap = (w - 40) / safeData.length
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
      {safeData.map((v, i) => {
        const barH = ((v - min) / range) * (h - 44) + 8
        const x = 20 + i * barGap + (barGap - barW) / 2
        const y = h - 20 - barH
        return <rect key={i} x={x} y={y} width={barW} height={barH} rx={3} fill={color} fillOpacity="0.7" />
      })}
      {safeLabels.map((l, i) => <text key={i} x={20 + i * barGap + barGap / 2} y={h - 4} textAnchor="middle" fill="rgba(232,236,241,0.2)" fontSize="7" fontFamily="'JetBrains Mono',monospace">{String(l).length > 6 ? String(l).slice(0, 6) : l}</text>)}
    </svg>
  )
}

// Stat-style hero used when no chart card is available among the curated top.
function StatHero({ report }) {
  const value = report.value || (report.report_meta?.card_count_total
    ? `${report.report_meta.card_count_total} findings`
    : '—')
  return (
    <div style={{
      height: 140,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      color: report.color || '#60A5FA',
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }}>
      <div style={{ fontSize: 36, fontWeight: 700, letterSpacing: '-0.02em', lineHeight: 1 }}>{value}</div>
      <div style={{
        marginTop: 8,
        fontSize: 10,
        fontFamily: "'JetBrains Mono', monospace",
        color: 'rgba(232,236,241,0.45)',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
      }}>headline metric</div>
    </div>
  )
}

export default function ReportCard({ report, onClick }) {
  const [hovered, setHovered] = useState(false)

  const dataset = report.dataset
  const chartType = report.preferred_chart || report.chartType || 'bar'
  const hasChart = dataset?.series?.[0]?.values?.length > 0
  const series = hasChart ? dataset.series[0] : null
  const externalUrl = report.external_url
  const findingsCount = report.report_meta?.card_count_total
  const topThreatTypes = (report.threat_type || []).slice(0, 3)

  return (
    <div
      style={{
        background: 'rgba(12,16,28,0.72)',
        backdropFilter: 'blur(18px) saturate(120%)',
        WebkitBackdropFilter: 'blur(18px) saturate(120%)',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.28)' : 'rgba(59,130,246,0.14)'}`,
        borderRadius: 18,
        padding: 22,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.45)' : '0 4px 18px rgba(0,0,0,0.25)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={{ position: 'absolute', top: 14, right: 14, fontFamily: "'JetBrains Mono'", fontSize: 9, background: 'rgba(255,255,255,0.04)', color: 'rgba(232,236,241,0.5)', padding: '2px 7px', borderRadius: 4, letterSpacing: '0.04em' }}>External Source</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <BrandChip source={report.source} size="lg" />
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.55)' }}>{report.year}</span>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(232,236,241,0.6)', background: 'rgba(255,255,255,0.03)', padding: '3px 8px', borderRadius: 5 }}>{report.category}</span>
        {findingsCount != null && (
          <span style={{
            fontFamily: "'JetBrains Mono'",
            fontSize: 9,
            color: 'rgba(96,165,250,0.85)',
            background: 'rgba(59,130,246,0.10)',
            border: '1px solid rgba(59,130,246,0.18)',
            padding: '2px 7px',
            borderRadius: 5,
            letterSpacing: '0.06em',
          }}>{findingsCount} findings</span>
        )}
      </div>

      {topThreatTypes.length > 0 && (
        <div style={{ display: 'flex', gap: 5, marginBottom: 12, flexWrap: 'wrap' }}>
          {topThreatTypes.map((t) => (
            <span key={t} style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: 8.5,
              color: 'rgba(232,236,241,0.55)',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '2px 6px',
              borderRadius: 4,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>{threatTypeLabel(t)}</span>
          ))}
        </div>
      )}

      <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', background: 'rgba(0,0,0,0.15)', padding: '8px 4px 0' }}>
        {hasChart
          ? <MiniChart data={series.values} labels={dataset.labels} color={series.color || report.color} type={chartType} />
          : <StatHero report={report} />}
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 600, color: '#E8ECF1', lineHeight: 1.35, marginBottom: 5 }}>{report.title}</h4>
      <p style={{ fontSize: 11, color: 'rgba(232,236,241,0.6)', lineHeight: 1.55, marginBottom: 14 }}>{report.description}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(59,130,246,0.06)', gap: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          Source: {report.source}
        </span>
        {externalUrl ? (
          <a
            href={externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={{
              fontFamily: "'JetBrains Mono'",
              fontSize: 10,
              color: 'rgba(96,165,250,0.85)',
              textDecoration: 'none',
              whiteSpace: 'nowrap',
              padding: '3px 8px',
              borderRadius: 6,
              border: '1px solid rgba(59,130,246,0.18)',
              background: 'rgba(59,130,246,0.08)',
            }}
          >
            Open ↗
          </a>
        ) : (
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(59,130,246,0.4)' }}>Click to preview</span>
        )}
      </div>
    </div>
  )
}
