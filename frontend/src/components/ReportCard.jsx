import { useState, useCallback } from 'react'

// Lightweight SVG chart placeholder — no Recharts dependency
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

  // Bar chart
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

export default function ReportCard({ report, onClick }) {
  const [hovered, setHovered] = useState(false)

  const handleDownload = useCallback((e) => {
    e.stopPropagation()
  }, [])

  return (
    <div
      style={{
        background: 'rgba(59,130,246,0.03)',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.15)' : 'rgba(59,130,246,0.08)'}`,
        borderRadius: 18,
        padding: 22,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.3)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <span style={{ position: 'absolute', top: 14, right: 14, fontFamily: "'JetBrains Mono'", fontSize: 9, background: 'rgba(255,255,255,0.04)', color: 'rgba(232,236,241,0.2)', padding: '2px 7px', borderRadius: 4, letterSpacing: '0.04em' }}>External Source</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, fontWeight: 600, background: 'rgba(59,130,246,0.08)', color: 'rgba(232,236,241,0.6)', padding: '3px 9px', borderRadius: 6 }}>{report.sourceShort}</span>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.25)' }}>{report.year}</span>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, color: 'rgba(232,236,241,0.3)', background: 'rgba(255,255,255,0.03)', padding: '3px 8px', borderRadius: 5 }}>{report.category}</span>
      </div>

      <div style={{ marginBottom: 14, borderRadius: 10, overflow: 'hidden', background: 'rgba(0,0,0,0.15)', padding: '8px 4px 0' }}>
        <MiniChart data={report.dummyData} labels={report.dummyLabels} color={report.color} type={report.chartType} />
      </div>

      <h4 style={{ fontSize: 15, fontWeight: 600, color: '#E8ECF1', lineHeight: 1.35, marginBottom: 5 }}>{report.title}</h4>
      <p style={{ fontSize: 11, color: 'rgba(232,236,241,0.32)', lineHeight: 1.55, marginBottom: 14 }}>{report.description}</p>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 10, borderTop: '1px solid rgba(59,130,246,0.06)' }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.18)' }}>Source: {report.source}</span>
        <button onClick={handleDownload} style={{ padding: '5px 12px', fontSize: 11, fontWeight: 500, borderRadius: 7, background: 'rgba(59,130,246,0.08)', color: '#60A5FA', border: 'none', cursor: 'pointer', fontFamily: "'Satoshi'", transition: 'all 0.2s' }}>
          Download PNG
        </button>
      </div>
    </div>
  )
}
