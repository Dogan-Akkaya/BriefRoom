import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { GLOBAL_REPORTS } from '../lib/data'
import ReportCard from '../components/ReportCard'
import ChartPreviewModal from '../components/ChartPreviewModal'
import Reveal from '../components/Reveal'

const SOURCES = ['All', 'IBM', 'CrowdStrike', 'Verizon DBIR', 'Mandiant', 'Unit 42', 'ENISA']
const CATEGORIES = ['All', 'Data Breaches', 'Threat Actors', 'Ransomware', 'Detection', 'Breaches', 'eCrime', 'Intrusion', 'Threat Landscape']
const YEARS = ['All', '2025', '2024']
const REGION_OPTIONS = ['Global', 'North America', 'Europe', 'Asia Pacific', 'Middle East', 'Latin America', 'Africa']

const sourceMatch = (report, filter) => {
  if (filter === 'All') return true
  if (filter === 'IBM') return report.sourceShort === 'IBM'
  if (filter === 'CrowdStrike') return report.sourceShort === 'CS'
  if (filter === 'Verizon DBIR') return report.sourceShort === 'DBIR'
  if (filter === 'Mandiant') return report.sourceShort === 'Mandiant'
  if (filter === 'Unit 42') return report.sourceShort === 'Unit 42'
  if (filter === 'ENISA') return report.sourceShort === 'ENISA'
  return true
}

const glass = {
  background: 'rgba(59,130,246,0.03)',
  backdropFilter: 'blur(16px)',
  WebkitBackdropFilter: 'blur(16px)',
  border: '1px solid rgba(59,130,246,0.08)',
  borderRadius: 16,
}

export default function Reports() {
  const navigate = useNavigate()
  const [previewReport, setPreviewReport] = useState(null)
  const [sourceFilter, setSourceFilter] = useState('All')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [yearFilter, setYearFilter] = useState('All')
  const [regionFilter, setRegionFilter] = useState('Global')

  useEffect(() => { document.title = 'Global Threat Reports — IBM, CrowdStrike, Verizon DBIR | Brief Room' }, [])

  const filtered = useMemo(() => {
    return GLOBAL_REPORTS.filter((r) => {
      if (!sourceMatch(r, sourceFilter)) return false
      if (categoryFilter !== 'All' && r.category !== categoryFilter) return false
      if (yearFilter !== 'All' && String(r.year) !== yearFilter) return false
      return true
    })
  }, [sourceFilter, categoryFilter, yearFilter])

  const chipStyle = (active) => ({
    display: 'inline-block',
    padding: '5px 11px',
    fontSize: 11,
    fontFamily: "'Satoshi', sans-serif",
    fontWeight: 500,
    borderRadius: 8,
    cursor: 'pointer',
    border: active ? '1px solid rgba(59,130,246,0.35)' : '1px solid rgba(255,255,255,0.06)',
    background: active ? 'rgba(59,130,246,0.12)' : 'rgba(255,255,255,0.03)',
    color: active ? 'rgba(96,165,250,0.95)' : 'rgba(232,236,241,0.35)',
    transition: 'all 0.2s',
    whiteSpace: 'nowrap',
  })

  const sectionLabel = {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 10,
    fontWeight: 600,
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(232,236,241,0.3)',
    marginBottom: 10,
    display: 'block',
  }

  return (
    <div style={{ paddingTop: 80, paddingBottom: 80, maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left Sidebar */}
        <div style={{
          width: 220,
          minWidth: 180,
          position: 'sticky',
          top: 100,
          ...glass,
          padding: '20px 16px',
        }}>
          {/* Clear all */}
          {(sourceFilter !== 'All' || categoryFilter !== 'All' || yearFilter !== 'All' || regionFilter !== 'Global') && (
            <button
              onClick={() => { setSourceFilter('All'); setCategoryFilter('All'); setYearFilter('All'); setRegionFilter('Global') }}
              style={{ background: 'rgba(255,69,98,0.06)', border: '1px solid rgba(255,69,98,0.15)', borderRadius: 8, padding: '7px 0', width: '100%', color: '#FF4562', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', transition: 'all 0.2s', marginBottom: 16 }}
            >
              Clear all filters
            </button>
          )}
          {/* Source */}
          <span style={sectionLabel}>Source</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
            {SOURCES.map((s) => (
              <span key={s} style={chipStyle(sourceFilter === s)} onClick={() => setSourceFilter(s)}>
                {s}
              </span>
            ))}
          </div>

          {/* Category */}
          <span style={sectionLabel}>Category</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 22 }}>
            {CATEGORIES.map((c) => (
              <span key={c} style={chipStyle(categoryFilter === c)} onClick={() => setCategoryFilter(c)}>
                {c}
              </span>
            ))}
          </div>

          {/* Year */}
          <span style={sectionLabel}>Year</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {YEARS.map((y) => (
              <span key={y} style={chipStyle(yearFilter === y)} onClick={() => setYearFilter(y)}>
                {y}
              </span>
            ))}
          </div>

          {/* Country / Region */}
          <span style={sectionLabel}>Country / Region</span>
          <select
            value={regionFilter}
            onChange={e => setRegionFilter(e.target.value)}
            style={{
              width: '100%',
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              padding: '8px 10px',
              borderRadius: 10,
              border: '1px solid rgba(59,130,246,0.08)',
              background: 'rgba(59,130,246,0.03)',
              backdropFilter: 'blur(12px)',
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

        {/* Main Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Reveal>
            <span style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'rgba(59,130,246,0.85)',
              marginBottom: 12,
              display: 'block',
            }}>&#9679; GLOBAL REPORTS</span>
            <h1 style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 40,
              fontWeight: 700,
              color: '#E8ECF1',
              lineHeight: 1.15,
              marginBottom: 14,
            }}>From the reports CISOs trust most</h1>
            <p style={{
              fontSize: 15,
              color: 'rgba(232,236,241,0.4)',
              lineHeight: 1.7,
              maxWidth: 640,
              marginBottom: 28,
            }}>
              Key findings from industry-leading cybersecurity reports. Fixed charts
              from trusted external sources — ready to download and present.
            </p>
            <button
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                padding: '7px 16px',
                fontSize: 12,
                fontWeight: 500,
                borderRadius: 8,
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(232,236,241,0.55)',
                border: '1px solid rgba(255,255,255,0.08)',
                cursor: 'pointer',
                fontFamily: "'Satoshi', sans-serif",
                transition: 'all 0.2s',
                marginBottom: 48,
              }}
              onClick={() => navigate('/')}
            >
              &#8592; Back to home
            </button>
          </Reveal>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 18,
          }}>
            {filtered.map((report, i) => {
              const isFeatured = i % 3 === 2

              if (isFeatured) {
                return (
                  <Reveal key={report.id} delay={i * 60} style={{ gridColumn: 'span 2' }}>
                    <FeaturedCard report={report} onClick={() => setPreviewReport(report)} />
                  </Reveal>
                )
              }

              return (
                <Reveal key={report.id} delay={i * 60}>
                  <ReportCard report={report} onClick={() => setPreviewReport(report)} />
                </Reveal>
              )
            })}

            {filtered.length === 0 && (
              <div style={{
                gridColumn: 'span 2',
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(232,236,241,0.25)',
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
              }}>
                No reports match the current filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {previewReport && (
        <ChartPreviewModal
          chart={previewReport}
          type="report"
          onClose={() => setPreviewReport(null)}
        />
      )}
    </div>
  )
}

/* ── Featured wide card ── */
function FeaturedMiniChart({ data, labels, color, type }) {
  const w = 480, h = 200
  const max = Math.max(...data), min = Math.min(...data)
  const range = max - min || 1
  const toX = (i) => 24 + (i / (data.length - 1)) * (w - 48)
  const toY = (v) => h - 24 - ((v - min) / range) * (h - 48)

  if (type === 'line') {
    const pts = data.map((v, i) => `${toX(i)},${toY(v)}`).join(' ')
    const fillPts = `${toX(0)},${h - 24} ${pts} ${toX(data.length - 1)},${h - 24}`
    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
        <polygon points={fillPts} fill={color} fillOpacity="0.08" />
        <polyline points={pts} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {data.map((v, i) => <circle key={i} cx={toX(i)} cy={toY(v)} r="3" fill={color} opacity="0.6" />)}
        {labels.map((l, i) => <text key={i} x={toX(i)} y={h - 4} textAnchor="middle" fill="rgba(232,236,241,0.25)" fontSize="9" fontFamily="'JetBrains Mono',monospace">{l}</text>)}
      </svg>
    )
  }

  const barW = Math.min(30, (w - 48) / data.length - 6)
  const barGap = (w - 48) / data.length
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
      {data.map((v, i) => {
        const barH = ((v - min) / range) * (h - 52) + 10
        const x = 24 + i * barGap + (barGap - barW) / 2
        const y = h - 24 - barH
        return <rect key={i} x={x} y={y} width={barW} height={barH} rx={4} fill={color} fillOpacity="0.7" />
      })}
      {labels.map((l, i) => <text key={i} x={24 + i * barGap + barGap / 2} y={h - 4} textAnchor="middle" fill="rgba(232,236,241,0.25)" fontSize="8" fontFamily="'JetBrains Mono',monospace">{l.length > 8 ? l.slice(0, 8) : l}</text>)}
    </svg>
  )
}

function FeaturedCard({ report, onClick }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      style={{
        background: 'rgba(59,130,246,0.04)',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.18)' : 'rgba(59,130,246,0.1)'}`,
        borderRadius: 20,
        padding: 28,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.35)' : '0 4px 20px rgba(0,0,0,0.1)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      {/* Featured badge */}
      <span style={{
        position: 'absolute',
        top: 16,
        right: 16,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        fontWeight: 600,
        letterSpacing: '0.1em',
        textTransform: 'uppercase',
        background: 'rgba(59,130,246,0.12)',
        color: 'rgba(96,165,250,0.8)',
        padding: '4px 10px',
        borderRadius: 6,
        border: '1px solid rgba(59,130,246,0.15)',
      }}>Featured</span>

      <span style={{
        position: 'absolute',
        top: 16,
        right: 90,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: 9,
        background: 'rgba(255,255,255,0.04)',
        color: 'rgba(232,236,241,0.2)',
        padding: '3px 8px',
        borderRadius: 4,
        letterSpacing: '0.04em',
      }}>External Source</span>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          fontWeight: 600,
          background: 'rgba(59,130,246,0.08)',
          color: 'rgba(232,236,241,0.6)',
          padding: '3px 9px',
          borderRadius: 6,
        }}>{report.sourceShort}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: 'rgba(232,236,241,0.25)',
        }}>{report.year}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          color: 'rgba(232,236,241,0.3)',
          background: 'rgba(255,255,255,0.03)',
          padding: '3px 8px',
          borderRadius: 5,
        }}>{report.category}</span>
      </div>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>
        {/* Larger chart area */}
        <div style={{
          flex: '0 0 auto',
          width: '55%',
          minHeight: 240,
          borderRadius: 12,
          overflow: 'hidden',
          background: 'rgba(0,0,0,0.18)',
          padding: '12px 6px 0',
          display: 'flex',
          alignItems: 'center',
        }}>
          <FeaturedMiniChart
            data={report.dummyData}
            labels={report.dummyLabels}
            color={report.color}
            type={report.chartType}
          />
        </div>

        {/* Text content */}
        <div style={{ flex: 1 }}>
          <h4 style={{
            fontSize: 18,
            fontWeight: 600,
            color: '#E8ECF1',
            lineHeight: 1.35,
            marginBottom: 8,
          }}>{report.title}</h4>
          <p style={{
            fontSize: 12,
            color: 'rgba(232,236,241,0.4)',
            lineHeight: 1.7,
            marginBottom: 16,
          }}>{report.description}</p>

          <div style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(232,236,241,0.2)',
            marginBottom: 6,
          }}>Published: {report.year}</div>
          <div style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(232,236,241,0.18)',
            marginBottom: 20,
          }}>Source: {report.source}</div>

          <button
            onClick={(e) => e.stopPropagation()}
            style={{
              padding: '8px 20px',
              fontSize: 12,
              fontWeight: 600,
              borderRadius: 9,
              background: 'rgba(59,130,246,0.14)',
              color: '#60A5FA',
              border: '1px solid rgba(59,130,246,0.2)',
              cursor: 'pointer',
              fontFamily: "'Satoshi', sans-serif",
              transition: 'all 0.2s',
            }}
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  )
}
