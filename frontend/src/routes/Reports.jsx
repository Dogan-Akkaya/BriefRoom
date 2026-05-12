import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { INTELLIGENCE_LIBRARY, globalReports, threatTypeLabel, primaryThreatLabel } from '../lib/intelligenceLibrary'
import { MANUAL_REPORT_RAW_BY_ID } from '../lib/manualData'
import { CATEGORIES, INDUSTRIES } from '../lib/data'
import ReportCard from '../components/ReportCard'
import ChartPreviewModal from '../components/ChartPreviewModal'
import Reveal from '../components/Reveal'
import KnowledgeGraphBG from '../components/KnowledgeGraphBG'
import SliceStatCard from '../components/explore/SliceStatCard'
import SearchableSelect from '../components/SearchableSelect'
import { BrandChip, sourceBrand } from '../lib/sourceBrands'
import { sourceType } from '../lib/methodologyBias'

// Canonical ordering for the Source Type filter — Government first to surface
// authoritative sources, Survey last because it's the smallest sample-method
// category. Anything new appears alphabetically at the end of the seen-set.
const SOURCE_TYPE_ORDER = ['Government', 'Vendor', 'IR-based', 'Consortium', 'Consulting', 'Insurance', 'Survey']

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
function formatReportDate(report) {
  const pub = report.report_meta?.publication_date
  if (pub && /^\d{4}-\d{2}/.test(pub)) {
    const [y, m] = pub.split('-')
    const mi = parseInt(m, 10) - 1
    if (mi >= 0 && mi < 12) return `${MONTH_NAMES[mi]} ${y}`
  }
  return report.year ? String(report.year) : ''
}

// Sentinel values shown as the first option in each SearchableSelect.
const ALL_SOURCES = 'All sources'
const ALL_SOURCE_TYPES = 'All source types'
const ALL_THREAT_TYPES = 'All threat types'
const ALL_INDUSTRIES = 'All industries'
const ALL_REGIONS = 'All regions'

// Label ↔ id maps for threat_type (canonical taxonomy lives as ids on items
// but the dropdown shows human labels).
const THREAT_TYPE_LABEL_TO_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.label, c.id])
)

// Source filter operates on the brand's short label so vendors with multiple
// reports (e.g. Sophos × 2) collapse to a single chip.
const sourceMatch = (report, filter) => {
  if (filter === ALL_SOURCES) return true
  const brand = sourceBrand(report.source)
  return brand?.name === filter || brand?.short === filter
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
  const [sourceFilter, setSourceFilter] = useState(ALL_SOURCES)
  const [sourceTypeFilter, setSourceTypeFilter] = useState(ALL_SOURCE_TYPES)
  const [threatTypeFilter, setThreatTypeFilter] = useState(ALL_THREAT_TYPES)
  const [industryFilter, setIndustryFilter] = useState(ALL_INDUSTRIES)
  const [yearFilter, setYearFilter] = useState('All')
  const [regionFilter, setRegionFilter] = useState(ALL_REGIONS)

  useEffect(() => { document.title = 'Global Threat Reports — IBM, CrowdStrike, Verizon DBIR | Brief Room' }, [])

  // Verified Intelligence — library items with real:true (vendor-attributed stats + charts)
  const verifiedStats = useMemo(
    () => INTELLIGENCE_LIBRARY.filter(i => i.real && i.type === 'stat').slice(0, 18),
    []
  )

  // All reports + option lists derived from the data we actually have.
  const allReports = useMemo(() => globalReports(), [])

  const SOURCE_OPTIONS = useMemo(() => {
    const counts = new Map()
    for (const r of allReports) {
      const brand = sourceBrand(r.source)
      const label = brand?.name || r.source
      counts.set(label, (counts.get(label) || 0) + 1)
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k)
    return [ALL_SOURCES, ...sorted]
  }, [allReports])

  // Source Type filter — derived from sourceType() so the dropdown only
  // surfaces categories at least one report actually has. Replaces the
  // old free-text Category filter, which overlapped Threat Type.
  const SOURCE_TYPE_OPTIONS = useMemo(() => {
    const seen = new Set()
    for (const r of allReports) {
      const t = sourceType(r.source)
      if (t) seen.add(t)
    }
    const ordered = SOURCE_TYPE_ORDER.filter((t) => seen.has(t))
    // Anything seen but not in our canonical order list — append at end.
    for (const t of seen) if (!SOURCE_TYPE_ORDER.includes(t)) ordered.push(t)
    return [ALL_SOURCE_TYPES, ...ordered]
  }, [allReports])

  // Only surface threat-type / industry / region values that real reports
  // actually carry — keeps the dropdowns honest as the library grows.
  const THREAT_TYPE_OPTIONS = useMemo(() => {
    const counts = new Map()
    for (const r of allReports) {
      for (const t of r.threat_type || []) {
        const label = threatTypeLabel(t)
        if (label) counts.set(label, (counts.get(label) || 0) + 1)
      }
    }
    const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]).map(([k]) => k)
    return [ALL_THREAT_TYPES, ...sorted]
  }, [allReports])

  const INDUSTRY_OPTIONS = useMemo(() => {
    const counts = new Map()
    for (const r of allReports) {
      for (const ind of r.industry || []) counts.set(ind, (counts.get(ind) || 0) + 1)
    }
    // Keep the canonical INDUSTRIES order so the dropdown is consistent run-to-run,
    // but only include ones at least one report touches.
    const present = INDUSTRIES.filter((i) => counts.has(i))
    return [ALL_INDUSTRIES, ...present]
  }, [allReports])

  const REGION_OPTIONS = useMemo(() => {
    const order = ['North America', 'Europe', 'Asia Pacific', 'Middle East', 'Latin America', 'Africa']
    const seen = new Set()
    for (const r of allReports) {
      for (const reg of r.region || []) seen.add(reg)
    }
    return [ALL_REGIONS, ...order.filter((r) => seen.has(r))]
  }, [allReports])

  const YEAR_OPTIONS = useMemo(() => {
    const set = new Set()
    for (const r of allReports) if (r.year) set.add(String(r.year))
    return ['All', ...[...set].sort().reverse()]
  }, [allReports])

  const filtered = useMemo(() => {
    const threatTypeId = threatTypeFilter !== ALL_THREAT_TYPES
      ? THREAT_TYPE_LABEL_TO_ID[threatTypeFilter]
      : null
    return allReports.filter((r) => {
      if (!sourceMatch(r, sourceFilter)) return false
      if (sourceTypeFilter !== ALL_SOURCE_TYPES && sourceType(r.source) !== sourceTypeFilter) return false
      if (yearFilter !== 'All' && String(r.year) !== yearFilter) return false
      if (regionFilter !== ALL_REGIONS) {
        if (!Array.isArray(r.region) || !r.region.includes(regionFilter)) return false
      }
      if (threatTypeId) {
        if (!Array.isArray(r.threat_type) || !r.threat_type.includes(threatTypeId)) return false
      }
      if (industryFilter !== ALL_INDUSTRIES) {
        if (!Array.isArray(r.industry) || !r.industry.includes(industryFilter)) return false
      }
      return true
    })
  }, [allReports, sourceFilter, sourceTypeFilter, threatTypeFilter, industryFilter, yearFilter, regionFilter])

  // Findings count summary — sum across the filtered subset.
  const findingsCount = useMemo(
    () => filtered.reduce((n, r) => n + (r.report_meta?.card_count_total || 0), 0),
    [filtered]
  )
  const totalReports = allReports.length

  const isFiltered =
    sourceFilter !== ALL_SOURCES ||
    sourceTypeFilter !== ALL_SOURCE_TYPES ||
    threatTypeFilter !== ALL_THREAT_TYPES ||
    industryFilter !== ALL_INDUSTRIES ||
    yearFilter !== 'All' ||
    regionFilter !== ALL_REGIONS

  // Count findings within a report that match the active finding-level
  // filters (industry / region / threat type). Returns null when no
  // finding-level filter is active (so the chip stays hidden when the
  // user is browsing unfiltered or only narrowing on report-level dims
  // like Source / Year / Category).
  const findingMatchFor = (report) => {
    const indActive = industryFilter !== ALL_INDUSTRIES
    const regActive = regionFilter !== ALL_REGIONS
    const ttActive = threatTypeFilter !== ALL_THREAT_TYPES
    if (!indActive && !regActive && !ttActive) return null

    const reportId = report.report_meta?.report_id
    const cards = reportId ? MANUAL_REPORT_RAW_BY_ID[reportId]?.cards : null
    if (!Array.isArray(cards) || cards.length === 0) return null

    const ttId = ttActive ? THREAT_TYPE_LABEL_TO_ID[threatTypeFilter] : null
    const matched = cards.filter((c) => {
      if (indActive && !(Array.isArray(c.industry) && c.industry.includes(industryFilter))) return false
      if (regActive && !(Array.isArray(c.region) && c.region.includes(regionFilter))) return false
      if (ttId && !(Array.isArray(c.threat_type) && c.threat_type.includes(ttId))) return false
      return true
    }).length

    // Pick the active dimension label — when more than one is active,
    // surface the most specific (threat type > industry > region).
    let dimensionLabel = null
    if (ttActive) dimensionLabel = threatTypeFilter
    else if (indActive) dimensionLabel = industryFilter
    else if (regActive) dimensionLabel = regionFilter

    return { matched, total: cards.length, dimensionLabel }
  }

  const clearAll = () => {
    setSourceFilter(ALL_SOURCES)
    setSourceTypeFilter(ALL_SOURCE_TYPES)
    setThreatTypeFilter(ALL_THREAT_TYPES)
    setIndustryFilter(ALL_INDUSTRIES)
    setYearFilter('All')
    setRegionFilter(ALL_REGIONS)
  }

  const openReport = (report) => {
    const id = report.report_meta?.report_id
    if (id) navigate(`/reports/${id}`)
    else setPreviewReport(report)
  }

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
    color: 'rgba(232,236,241,0.6)',
    marginBottom: 10,
    display: 'block',
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      <KnowledgeGraphBG />
      {/* Scrim — vertical gradient under the hero area to lift WCAG AA
          contrast on the H1 sitting over the constellation. The canvas is
          now capped at 35% opacity (KnowledgeGraphBG.jsx); this scrim
          finishes the job under the hero where text density is highest. */}
      <div aria-hidden="true" style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 520, zIndex: 1,
        background: 'linear-gradient(180deg, rgba(10,14,26,0.88) 0%, rgba(10,14,26,0.6) 40%, rgba(10,14,26,0.25) 75%, rgba(10,14,26,0) 100%)',
        pointerEvents: 'none',
      }} />
      <div style={{ position: 'relative', zIndex: 2, paddingTop: 80, paddingBottom: 80, maxWidth: 1280, margin: '0 auto', paddingLeft: 24, paddingRight: 24 }}>
      <div style={{ display: 'flex', gap: 28, alignItems: 'flex-start', flexWrap: 'wrap' }}>
        {/* Left Sidebar */}
        <div style={{
          width: 240,
          minWidth: 200,
          position: 'sticky',
          top: 100,
          ...glass,
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
        }}>
          {/* Clear all */}
          {isFiltered && (
            <button
              onClick={clearAll}
              style={{ background: 'rgba(255,69,98,0.06)', border: '1px solid rgba(255,69,98,0.15)', borderRadius: 8, padding: '7px 0', width: '100%', color: '#FF4562', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Clear all filters
            </button>
          )}

          <SearchableSelect
            label="Source"
            value={sourceFilter}
            options={SOURCE_OPTIONS}
            onChange={setSourceFilter}
            placeholder={ALL_SOURCES}
          />

          <SearchableSelect
            label="Threat Type"
            value={threatTypeFilter}
            options={THREAT_TYPE_OPTIONS}
            onChange={setThreatTypeFilter}
            placeholder={ALL_THREAT_TYPES}
          />

          <SearchableSelect
            label="Source Type"
            value={sourceTypeFilter}
            options={SOURCE_TYPE_OPTIONS}
            onChange={setSourceTypeFilter}
            placeholder={ALL_SOURCE_TYPES}
          />

          <SearchableSelect
            label="Industry"
            value={industryFilter}
            options={INDUSTRY_OPTIONS}
            onChange={setIndustryFilter}
            placeholder={ALL_INDUSTRIES}
          />

          <SearchableSelect
            label="Region"
            value={regionFilter}
            options={REGION_OPTIONS}
            onChange={setRegionFilter}
            placeholder={ALL_REGIONS}
          />

          {/* Year stays as chips — small fixed set, faster than a dropdown */}
          <div>
            <span style={sectionLabel}>Year</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {YEAR_OPTIONS.map((y) => (
                <span key={y} style={chipStyle(yearFilter === y)} onClick={() => setYearFilter(y)}>
                  {y}
                </span>
              ))}
            </div>
          </div>
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
                marginBottom: 28,
              }}
              onClick={() => navigate('/')}
            >
              &#8592; Back to home
            </button>
          </Reveal>

          {/* Inventory summary — what's actually in the library, filtered or not */}
          <div style={{
            display: 'flex',
            alignItems: 'baseline',
            gap: 18,
            flexWrap: 'wrap',
            marginBottom: 24,
            paddingBottom: 16,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}>
            <div style={{
              fontFamily: "'Plus Jakarta Sans', sans-serif",
              fontSize: 22,
              fontWeight: 700,
              color: '#E8ECF1',
              letterSpacing: '-0.01em',
            }}>
              {filtered.length}
              <span style={{
                fontSize: 14,
                fontWeight: 500,
                color: 'rgba(232,236,241,0.45)',
                marginLeft: 6,
              }}>
                {isFiltered ? `of ${totalReports} reports` : `reports`}
              </span>
            </div>
            <div style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(232,236,241,0.5)',
            }}>
              {findingsCount.toLocaleString()} findings extracted
            </div>
            <div style={{ flex: 1 }} />
            {isFiltered && (
              <button
                onClick={clearAll}
                style={{
                  fontSize: 11,
                  fontFamily: "'JetBrains Mono', monospace",
                  color: '#FF4562',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  letterSpacing: '0.04em',
                }}
              >
                Reset filters →
              </button>
            )}
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 18,
          }}>
            {filtered.map((report, i) => {
              const isFeatured = i % 3 === 2
              const match = findingMatchFor(report)

              if (isFeatured) {
                return (
                  <Reveal key={report.id} delay={i * 60} style={{ gridColumn: 'span 2' }}>
                    <FeaturedCard report={report} onClick={() => openReport(report)} match={match} />
                  </Reveal>
                )
              }

              return (
                <Reveal key={report.id} delay={i * 60}>
                  <ReportCard report={report} onClick={() => openReport(report)} match={match} />
                </Reveal>
              )
            })}

            {filtered.length === 0 && (
              <div style={{
                gridColumn: 'span 2',
                textAlign: 'center',
                padding: '60px 20px',
                color: 'rgba(232,236,241,0.55)',
                fontFamily: "'Satoshi', sans-serif",
                fontSize: 14,
              }}>
                No reports match the current filters.
              </div>
            )}
          </div>

          {/* Verified Intelligence — vendor-sourced library stats mixed number/sparkline/bar/quote */}
          {verifiedStats.length > 0 && (
            <section style={{ marginTop: 72 }}>
              <style>{`
                .reports-slice-grid {
                  display: grid;
                  grid-template-columns: repeat(3, minmax(0, 1fr));
                  grid-auto-flow: dense;
                  gap: 14px;
                }
                @media (max-width: 900px) {
                  .reports-slice-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
                }
                @media (max-width: 560px) {
                  .reports-slice-grid { grid-template-columns: 1fr; }
                  .reports-slice-grid > * { grid-column: span 1 !important; }
                }
              `}</style>
              <Reveal>
                <div style={{ marginBottom: 22 }}>
                  <div style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase',
                    color: 'rgba(59,130,246,0.75)', marginBottom: 12,
                  }}>
                    <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>
                    &nbsp;&nbsp;Verified Intelligence
                  </div>
                  <h2 style={{
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontSize: 'clamp(24px,3vw,32px)', fontWeight: 700,
                    color: '#E8ECF1', letterSpacing: '-0.02em', marginBottom: 10,
                  }}>
                    Statistics from the same sources
                  </h2>
                  <p style={{
                    fontSize: 14, color: 'rgba(232,236,241,0.45)',
                    maxWidth: 640, lineHeight: 1.65,
                  }}>
                    Pulled from IBM X-Force, Verizon DBIR, Mandiant, CrowdStrike, ENISA, SOCRadar and others — mixed numbers, mini-charts, and analyst quotes. Every card here carries a verified vendor attribution.
                  </p>
                </div>
              </Reveal>
              <div className="reports-slice-grid">
                {verifiedStats.map(s => <SliceStatCard key={s.id} item={s} />)}
              </div>
            </section>
          )}
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

function FeaturedCard({ report, onClick, match }) {
  const [hovered, setHovered] = useState(false)

  const dataset = report.dataset
  const chartType = report.preferred_chart || report.chartType || 'bar'
  const hasChart = dataset?.series?.[0]?.values?.length > 0
  const series = hasChart ? dataset.series[0] : null
  const externalUrl = report.external_url

  const matchChip = match && match.total > 0 ? (
    <span style={{
      display: 'inline-flex', alignItems: 'center',
      padding: '3px 8px',
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 9, letterSpacing: '0.04em', textTransform: 'uppercase',
      borderRadius: 5,
      background: match.matched > 0 ? 'rgba(245,158,11,0.10)' : 'rgba(255,255,255,0.04)',
      border: match.matched > 0 ? '1px solid rgba(245,158,11,0.28)' : '1px solid rgba(255,255,255,0.08)',
      color: match.matched > 0 ? 'rgba(252,211,77,0.95)' : 'rgba(232,236,241,0.45)',
    }}>
      {match.matched} of {match.total} findings match{match.dimensionLabel ? ` ${match.dimensionLabel}` : ''}
    </span>
  ) : null

  return (
    <div
      style={{
        background: 'rgba(12,16,28,0.74)',
        backdropFilter: 'blur(20px) saturate(120%)',
        WebkitBackdropFilter: 'blur(20px) saturate(120%)',
        border: `1px solid ${hovered ? 'rgba(59,130,246,0.3)' : 'rgba(59,130,246,0.14)'}`,
        borderRadius: 20,
        padding: 28,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        boxShadow: hovered ? '0 20px 50px rgba(0,0,0,0.45)' : '0 6px 22px rgba(0,0,0,0.28)',
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

      {(() => {
        const t = sourceType(report.source)
        if (!t) return null
        return (
          <span style={{
            position: 'absolute',
            top: 16,
            right: 90,
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            background: 'rgba(255,255,255,0.04)',
            color: 'rgba(232,236,241,0.5)',
            padding: '3px 8px',
            borderRadius: 4,
            letterSpacing: '0.04em',
          }}>{t}</span>
        )
      })()}

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <BrandChip source={report.source} size="lg" />
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 10,
          color: 'rgba(232,236,241,0.55)',
        }}>{formatReportDate(report)}</span>
        <span style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 9,
          color: 'rgba(232,236,241,0.6)',
          background: 'rgba(255,255,255,0.03)',
          padding: '3px 8px',
          borderRadius: 5,
        }}>{primaryThreatLabel(report)}</span>
        {report.report_meta?.card_count_total != null && (
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: 'rgba(96,165,250,0.85)',
            background: 'rgba(59,130,246,0.10)',
            border: '1px solid rgba(59,130,246,0.18)',
            padding: '2px 7px',
            borderRadius: 5,
            letterSpacing: '0.06em',
          }}>{report.report_meta.card_count_total} findings</span>
        )}
        {matchChip}
      </div>

      {(report.threat_type || []).length > 0 && (
        <div style={{ display: 'flex', gap: 5, marginBottom: 16, flexWrap: 'wrap' }}>
          {(report.threat_type || []).slice(0, 4).map((t) => (
            <span key={t} style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: 'rgba(232,236,241,0.55)',
              background: 'rgba(255,255,255,0.025)',
              border: '1px solid rgba(255,255,255,0.05)',
              padding: '2px 7px',
              borderRadius: 5,
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
            }}>{threatTypeLabel(t)}</span>
          ))}
        </div>
      )}

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
          {hasChart ? (
            <FeaturedMiniChart
              data={series.values}
              labels={dataset.labels}
              color={series.color || report.color}
              type={chartType}
            />
          ) : (
            <div style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              color: report.color || '#60A5FA',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}>
              <div style={{ fontSize: 48, fontWeight: 700, letterSpacing: '-0.02em' }}>
                {report.report_meta?.card_count_total
                  ? `${report.report_meta.card_count_total}`
                  : '—'}
              </div>
              <div style={{
                marginTop: 8,
                fontSize: 10,
                fontFamily: "'JetBrains Mono', monospace",
                color: 'rgba(232,236,241,0.45)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
              }}>findings extracted</div>
            </div>
          )}
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
            color: 'rgba(232,236,241,0.5)',
            marginBottom: 6,
          }}>Published: {report.year}</div>
          <div style={{
            fontSize: 11,
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(232,236,241,0.45)',
            marginBottom: 20,
          }}>Source: {report.source}</div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <span
              style={{
                padding: '8px 20px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 9,
                background: 'rgba(59,130,246,0.14)',
                color: '#60A5FA',
                border: '1px solid rgba(59,130,246,0.2)',
                fontFamily: "'Satoshi', sans-serif",
              }}
            >
              View findings →
            </span>
            {externalUrl && (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                style={{
                  padding: '8px 18px',
                  fontSize: 12,
                  fontWeight: 600,
                  borderRadius: 9,
                  background: 'rgba(255,255,255,0.04)',
                  color: 'rgba(232,236,241,0.75)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  textDecoration: 'none',
                  fontFamily: "'Satoshi', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                Open original ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
