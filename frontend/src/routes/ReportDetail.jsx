import React, { useEffect, useMemo } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { ResponsiveContainer, BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts'
import { reportById } from '../lib/intelligenceLibrary'
import { BrandChip } from '../lib/sourceBrands'
import KnowledgeGraphBG from '../components/KnowledgeGraphBG'
import SliceStatCard from '../components/explore/SliceStatCard'
import Reveal from '../components/Reveal'

const axisColor = '#5C6478'
const gridColor = 'rgba(255,255,255,0.04)'
const tooltipStyle = { backgroundColor: '#151C2F', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 6, fontSize: 11 }

function ChartCard({ item }) {
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

  return (
    <div style={{
      padding: 22,
      borderRadius: 14,
      background: 'rgba(255,255,255,0.03)',
      backdropFilter: 'blur(16px)',
      border: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        fontFamily: "'Plus Jakarta Sans'", fontSize: 14,
        color: 'rgba(232,236,241,0.85)', marginBottom: 14,
      }}>{item.title}</div>
      <div style={{ width: '100%', height: 260 }}>
        <ResponsiveContainer minWidth={0} minHeight={0}>
          {chartType === 'line' ? (
            <LineChart data={data}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              {series.map((s, i) => (
                <Line key={i} type="monotone" dataKey={s.name || 'value'} stroke={s.color || primary} strokeWidth={2} dot={{ r: 2, fill: s.color || primary }} />
              ))}
            </LineChart>
          ) : chartType === 'area' ? (
            <AreaChart data={data}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              {series.map((s, i) => (
                <Area key={i} type="monotone" dataKey={s.name || 'value'} stroke={s.color || primary} fill={(s.color || primary) + '33'} />
              ))}
            </AreaChart>
          ) : chartType === 'pie' ? (
            <PieChart>
              <Pie data={data} dataKey={series[0]?.name || 'value'} nameKey="name" innerRadius="40%" outerRadius="80%" paddingAngle={2}>
                {data.map((_, i) => <Cell key={i} fill={series[0]?.color || primary} fillOpacity={0.3 + 0.7 * (i / Math.max(1, data.length - 1))} />)}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid stroke={gridColor} />
              <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
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

function CardCaption({ item }) {
  const bits = []
  if (item.comparison) bits.push(item.comparison)
  if (item.page_or_section) bits.push(item.page_or_section)
  if (!bits.length) return null
  return (
    <div style={{
      marginTop: 10,
      fontFamily: "'JetBrains Mono'",
      fontSize: 10,
      color: 'rgba(232,236,241,0.45)',
      letterSpacing: '0.04em',
      display: 'flex', gap: 12, flexWrap: 'wrap',
    }}>
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

export default function ReportDetail() {
  const { reportId } = useParams()
  const navigate = useNavigate()
  const data = reportById(reportId)

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
      <div style={{ position: 'relative', zIndex: 2, paddingTop: 80, paddingBottom: 80, maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
        <Reveal>
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
                {meta.category && (
                  <span style={{
                    fontFamily: "'JetBrains Mono'", fontSize: 10,
                    color: 'rgba(232,236,241,0.7)',
                    background: 'rgba(255,255,255,0.04)',
                    padding: '4px 9px', borderRadius: 6,
                  }}>{meta.category}</span>
                )}
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
                ? <ChartCard item={item} />
                : <StatCardWithCaption item={item} />}
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  )
}
