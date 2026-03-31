import { useState, useMemo, useCallback, useRef } from 'react'
import { BarChart, Bar, LineChart, Line, AreaChart, Area, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import SearchableSelect from './SearchableSelect'
import { ALL_COUNTRIES, ALL_REGIONS, CATEGORIES } from '../lib/data'
import { downloadPNG } from '../lib/export'

const INDUSTRIES = [
  'All Industries', 'Financial Services', 'Healthcare', 'Technology', 'Government',
  'Manufacturing', 'Energy & Utilities', 'Retail & E-Commerce', 'Telecommunications',
  'Education', 'Transportation',
]

const COLOR_PALETTES = [
  { name: 'Default', colors: ['#E8463A', '#4B83EE', '#F5A623', '#8B7CF6', '#2DD4A8'] },
  { name: 'Corporate', colors: ['#1E3A5F', '#2563EB', '#60A5FA', '#93C5FD', '#BFDBFE'] },
  { name: 'Warm', colors: ['#FF4562', '#F97316', '#FBBF24', '#FB923C', '#EF4444'] },
  { name: 'Monochrome', colors: ['#E8ECF1', '#9CA3AF', '#6B7280', '#4B5563', '#374151'] },
]

const COLOR_LABELS = ['Primary', 'Secondary', 'Tertiary', 'Quaternary', 'Quinary']

const TIME_RANGES = ['Last 3 months', 'Last 6 months', 'Last year', 'YTD 2026', 'All time']

const BG_OPTIONS = { dark: '#0E1220', navy: '#1A2332', white: '#FFFFFF' }

const ctrlLabel = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.08em',
  color: 'rgba(232,236,241,0.3)',
  textTransform: 'uppercase',
  marginBottom: 8,
}

const segBtn = (active) => ({
  flex: 1,
  padding: '7px 0',
  fontSize: 11,
  fontWeight: 500,
  fontFamily: "'Satoshi', sans-serif",
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.25s',
  background: active ? '#FF4562' : 'rgba(255,255,255,0.04)',
  color: active ? '#fff' : 'rgba(232,236,241,0.5)',
})

const chipBtn = (active) => ({
  fontSize: 11,
  padding: '6px 12px',
  borderRadius: 8,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.25s',
  border: active ? '1px solid rgba(255,69,98,0.35)' : '1px solid rgba(255,255,255,0.07)',
  background: active ? 'rgba(255,69,98,0.08)' : 'rgba(255,255,255,0.02)',
  color: active ? '#FF4562' : 'rgba(232,236,241,0.5)',
  fontFamily: "'Satoshi', sans-serif",
  whiteSpace: 'nowrap',
})

const colorOptBtn = (active) => ({
  padding: '8px 14px',
  fontSize: 11,
  fontWeight: 500,
  fontFamily: "'Satoshi', sans-serif",
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.25s',
  border: active ? '1px solid rgba(255,69,98,0.3)' : '1px solid rgba(255,255,255,0.06)',
  background: active ? 'rgba(255,69,98,0.06)' : 'rgba(255,255,255,0.02)',
  color: active ? '#FF4562' : 'rgba(232,236,241,0.45)',
})

/* ─── Seed-based dummy data generator ─── */
function generatePreviewData(threatType, industry, country, timeRange) {
  const seed = (threatType + industry + country + timeRange).split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const rng = (i) => ((seed * 9301 + i * 49297) % 233280) / 233280

  const monthCounts = { 'Last 3 months': 3, 'Last 6 months': 6, 'Last year': 12, 'YTD 2026': 3, 'All time': 12 }
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  const count = monthCounts[timeRange] || 6

  return months.slice(0, count).map((m, i) => ({
    name: m,
    value: Math.floor(rng(i) * 400 + 100),
    filtered: Math.floor(rng(i + 100) * 200 + 30),
  }))
}

/* ─── Inline Preview Chart ─── */
function PreviewChart({ data, colors, bgColor, gridLines, chartType, headline, showFiltered, builderData, operation }) {
  const bg = BG_OPTIONS[bgColor] || BG_OPTIONS.dark
  const isLight = bgColor === 'white'
  const gridColor = gridLines === 'none' ? 'transparent' : gridLines === 'visible' ? (isLight ? 'rgba(0,0,0,0.12)' : 'rgba(255,255,255,0.08)') : (isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.03)')
  const axisColor = isLight ? '#4B5563' : '#5C6478'
  const textColor = isLight ? '#1A2332' : '#E8ECF1'
  const mutedColor = isLight ? 'rgba(0,0,0,0.35)' : 'rgba(232,236,241,0.35)'
  const tooltipBg = isLight ? '#fff' : '#151C2F'
  const tooltipBorder = isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.05)'
  const tooltipStyle = { backgroundColor: tooltipBg, border: `1px solid ${tooltipBorder}`, borderRadius: 5, fontSize: 11 }

  const hasBuilder = builderData && builderData.chartData && builderData.chartData.length > 0
  const isBreakDown = operation === 'Break Down'
  const catColor = builderData?.catColor || colors[0]

  const renderContent = () => {
    // Builder's real data — matches what's on the Builder screen
    if (hasBuilder) {
      const bd = builderData
      const cData = bd.chartData
      const xKey = 'month'

      // Pie chart
      if (chartType === 'pie' && bd.pieData) {
        return (
          <PieChart>
            <Pie data={bd.pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={65} innerRadius={30} paddingAngle={2} strokeWidth={0} cornerRadius={3}>
              {bd.pieData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={0.85} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        )
      }

      // Break Down — multiple series from visibleData
      if (isBreakDown && bd.visibleData) {
        if (chartType === 'line') {
          return (
            <LineChart data={cData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey={xKey} tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              {bd.visibleData.map(d => <Line key={d.name} type="monotone" dataKey={d.name} stroke={d.color} strokeWidth={1.5} dot={false} />)}
            </LineChart>
          )
        }
        if (chartType === 'area') {
          return (
            <AreaChart data={cData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
              <XAxis dataKey={xKey} tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={tooltipStyle} />
              {bd.visibleData.map(d => <Area key={d.name} type="monotone" dataKey={d.name} stroke={d.color} fill={d.color} fillOpacity={0.12} strokeWidth={1.5} dot={false} />)}
            </AreaChart>
          )
        }
        // bar (default for break down)
        return (
          <BarChart data={cData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }} barCategoryGap="20%" barGap={2}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xKey} tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            {bd.visibleData.map(d => <Bar key={d.name} dataKey={d.name} fill={d.color} fillOpacity={0.8} radius={[3, 3, 0, 0]} maxBarSize={16} />)}
          </BarChart>
        )
      }

      // Sum/Avg/Min/Max — single "value" series
      if (chartType === 'line') {
        return (
          <LineChart data={cData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xKey} tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Line type="monotone" dataKey="value" stroke={catColor} strokeWidth={2} dot={{ r: 2, fill: catColor }} />
          </LineChart>
        )
      }
      if (chartType === 'area') {
        return (
          <AreaChart data={cData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
            <XAxis dataKey={xKey} tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={tooltipStyle} />
            <Area type="monotone" dataKey="value" stroke={catColor} fill={catColor} fillOpacity={0.12} strokeWidth={1.5} />
          </AreaChart>
        )
      }
      // bar default
      return (
        <BarChart data={cData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey={xKey} tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 9 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Bar dataKey="value" fill={catColor} fillOpacity={0.8} radius={[4, 4, 0, 0]} maxBarSize={20} />
        </BarChart>
      )
    }

    // Fallback: generic preview data (for Popular/Report flows without builder context)
    const commonProps = { data, margin: { top: 10, right: 10, left: -10, bottom: 0 } }
    if (chartType === 'line') {
      return (
        <LineChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Line type="monotone" dataKey="value" stroke={colors[0]} strokeWidth={2} dot={{ r: 3, fill: colors[0] }} />
          {showFiltered && <Line type="monotone" dataKey="filtered" stroke={colors[1]} strokeWidth={2} dot={{ r: 3, fill: colors[1] }} strokeDasharray="4 3" />}
        </LineChart>
      )
    }
    if (chartType === 'area') {
      return (
        <AreaChart {...commonProps}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
          <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="value" stroke={colors[0]} fill={colors[0]} fillOpacity={0.15} />
          {showFiltered && <Area type="monotone" dataKey="filtered" stroke={colors[1]} fill={colors[1]} fillOpacity={0.1} strokeDasharray="4 3" />}
        </AreaChart>
      )
    }
    return (
      <BarChart {...commonProps}>
        <CartesianGrid strokeDasharray="3 3" stroke={gridColor} />
        <XAxis dataKey="name" tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: axisColor, fontSize: 10 }} axisLine={false} tickLine={false} />
        <Tooltip contentStyle={tooltipStyle} />
        <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} barSize={18} />
        {showFiltered && <Bar dataKey="filtered" fill={colors[1]} radius={[4, 4, 0, 0]} barSize={18} opacity={0.6} />}
      </BarChart>
    )
  }

  // Legend items
  const legendItems = []
  if (hasBuilder && isBreakDown && builderData.visibleData) {
    builderData.visibleData.forEach(d => legendItems.push({ color: d.color, label: d.name }))
  } else if (hasBuilder && chartType === 'pie' && builderData.pieData) {
    builderData.pieData.forEach(d => legendItems.push({ color: d.color, label: d.name }))
  } else {
    legendItems.push({ color: hasBuilder ? catColor : colors[0], label: 'All data' })
    if (showFiltered) legendItems.push({ color: colors[1], label: 'Filtered', opacity: 0.6 })
  }

  return (
    <div style={{
      background: bg,
      borderRadius: 14,
      border: `1px solid ${isLight ? 'rgba(0,0,0,0.08)' : 'rgba(255,255,255,0.06)'}`,
      padding: '16px 18px 12px',
      transition: 'all 0.3s',
    }}>
      <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 13, fontWeight: 700, color: textColor, lineHeight: 1.3, marginBottom: 10 }}>
        {headline}
      </div>

      <ResponsiveContainer width="100%" height={chartType === 'pie' ? 180 : 160}>
        {renderContent()}
      </ResponsiveContainer>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: '0 2px' }}>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {legendItems.slice(0, 6).map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 8, height: 3, borderRadius: 2, background: item.color, opacity: item.opacity || 1 }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: mutedColor }}>{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, opacity: 0.3, flexShrink: 0 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: textColor, letterSpacing: '0.04em' }}>Powered by</span>
          <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 9, fontWeight: 700, color: textColor }}>SOCRadar</span>
        </div>
      </div>
    </div>
  )
}

/* ─── Custom Color Picker Row ─── */
function ColorPickerRow({ colors, onChange }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {colors.map((color, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'rgba(232,236,241,0.3)', width: 62, flexShrink: 0 }}>
            {COLOR_LABELS[idx]}
          </span>
          <div style={{ position: 'relative', width: 24, height: 24, flexShrink: 0 }}>
            <div style={{ width: 24, height: 24, borderRadius: 6, background: color, border: '1px solid rgba(255,255,255,0.15)', cursor: 'pointer' }} />
            <input
              type="color"
              value={color}
              onChange={(e) => {
                const next = [...colors]
                next[idx] = e.target.value
                onChange(next)
              }}
              style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer', width: '100%', height: '100%' }}
            />
          </div>
          <input
            type="text"
            value={color}
            onChange={(e) => {
              const v = e.target.value
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) {
                const next = [...colors]
                next[idx] = v
                onChange(next)
              }
            }}
            style={{
              flex: 1,
              padding: '4px 8px',
              fontSize: 11,
              fontFamily: "'JetBrains Mono', monospace",
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 6,
              color: '#E8ECF1',
              outline: 'none',
              boxSizing: 'border-box',
              minWidth: 0,
            }}
          />
        </div>
      ))}
    </div>
  )
}

const OPERATIONS = ['Sum', 'Break Down', 'Average', 'Min', 'Max']

const DUMMY_ELEMENTS = [
  { name: 'LockBit 4.0', color: '#E8463A' },
  { name: 'BlackCat/ALPHV', color: '#4B83EE' },
  { name: 'Cl0p', color: '#F5A623' },
  { name: 'Play', color: '#8B7CF6' },
  { name: 'Akira', color: '#2DD4A8' },
]

/* ─── Premium Builder Modal (after email / ungated for reports) ─── */
function PremiumBuilderModal({ onClose, initialState = {}, builderData }) {
  const init = initialState || {}
  const [country, setCountry] = useState(init.country || '')
  const [regionMode, setRegionMode] = useState(init.regionMode || false)
  const [industry, setIndustry] = useState(init.industry || 'All Industries')
  const [threatType, setThreatType] = useState(init.threatType || 'Ransomware')
  const [timeRange, setTimeRange] = useState('Last 6 months')
  const [palette, setPalette] = useState(0)
  const [customColors, setCustomColors] = useState(['#E8463A', '#4B83EE', '#F5A623', '#8B7CF6', '#2DD4A8'])
  const [bgColor, setBgColor] = useState('dark')
  const [gridLines, setGridLines] = useState('subtle')
  const [chartType, setChartType] = useState(init.chartType || 'bar')
  const [showFiltered, setShowFiltered] = useState(false)
  const [operation, setOperation] = useState(init.operation || 'Sum')
  const [hiddenElements, setHiddenElements] = useState(new Set())
  const previewRef = useRef(null)

  const activeCategories = useMemo(() => CATEGORIES.filter(c => c.hasData), [])
  const countryList = regionMode ? ALL_REGIONS : ALL_COUNTRIES.map(c => c.name)

  const isCustomPalette = palette === COLOR_PALETTES.length
  const activeColors = isCustomPalette ? customColors : COLOR_PALETTES[palette]?.colors || COLOR_PALETTES[0].colors

  const showElements = operation === 'Break Down'

  const toggleElement = useCallback((name) => {
    setHiddenElements(prev => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }, [])

  // Dynamic headline
  const headline = useMemo(() => {
    const parts = [threatType]
    if (industry && industry !== 'All Industries') parts.push(`in ${industry}`)
    if (country) parts.push(regionMode ? `across ${country}` : `in ${country}`)
    parts.push(`\u2014 ${timeRange}`)
    return parts.join(' ')
  }, [threatType, industry, country, regionMode, timeRange])

  // Use builder's real data when available, otherwise generate preview data
  const hasBuilderData = builderData && builderData.chartData && builderData.chartData.length > 0
  const previewData = useMemo(
    () => hasBuilderData ? builderData.chartData : generatePreviewData(threatType, industry, country, timeRange),
    [hasBuilderData, builderData, threatType, industry, country, timeRange]
  )

  // Ratio data from preview
  const ratioData = useMemo(() => {
    if (hasBuilderData) {
      const total = builderData.pieData?.reduce((s, d) => s + d.value, 0) || 0
      const filtered = Math.round(total * 0.35)
      return { total, filtered, pct: total > 0 ? ((filtered / total) * 100).toFixed(1) : '0.0' }
    }
    const total = previewData.reduce((s, d) => s + (d.value || 0), 0)
    const filtered = previewData.reduce((s, d) => s + (d.filtered || 0), 0)
    return { total, filtered, pct: total > 0 ? ((filtered / total) * 100).toFixed(1) : '0.0' }
  }, [hasBuilderData, builderData, previewData])

  const handlePaletteSelect = useCallback((idx) => {
    setPalette(idx)
    if (idx < COLOR_PALETTES.length) {
      setCustomColors([...COLOR_PALETTES[idx].colors])
    }
  }, [])

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,14,26,0.88)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '94%',
          maxWidth: 920,
          maxHeight: '92vh',
          overflowY: 'auto',
          background: 'rgba(16,20,34,0.96)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 24,
          padding: '28px 32px 24px',
          boxShadow: '0 32px 100px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent */}
        <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 2, background: 'linear-gradient(90deg, transparent, #FF4562, transparent)', borderRadius: '0 0 2px 2px' }} />

        {/* Close */}
        <button onClick={onClose} style={{ position: 'absolute', top: 14, right: 14, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(232,236,241,0.5)', fontSize: 16, cursor: 'pointer', lineHeight: 1, zIndex: 2 }}>
          &times;
        </button>

        {/* Header */}
        <div style={{ marginBottom: 4 }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,69,98,0.6)', marginBottom: 6 }}>
            Premium Features Unlocked
          </div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 19, fontWeight: 700, color: '#E8ECF1', margin: '0 0 4px' }}>
            Customize your export
          </h2>
        </div>

        {/* Preview Chart Block */}
        <div style={{ marginBottom: 18 }}>
          {/* Chart type switcher */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
            <div style={{ display: 'flex', gap: 4 }}>
              {['bar', 'line', 'area'].map(t => (
                <button key={t} style={{
                  fontSize: 10, padding: '3px 10px', borderRadius: 6, fontFamily: "'Satoshi', sans-serif",
                  border: chartType === t ? '1px solid rgba(255,69,98,0.3)' : '1px solid rgba(255,255,255,0.06)',
                  background: chartType === t ? 'rgba(255,69,98,0.08)' : 'rgba(255,255,255,0.02)',
                  color: chartType === t ? '#FF4562' : 'rgba(232,236,241,0.4)',
                  cursor: 'pointer', transition: 'all 0.2s', textTransform: 'capitalize',
                }} onClick={() => setChartType(t)}>
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div ref={previewRef}>
            <PreviewChart
              data={previewData}
              colors={activeColors}
              bgColor={bgColor}
              gridLines={gridLines}
              chartType={chartType}
              headline={headline}
              showFiltered={showFiltered}
              builderData={builderData}
              operation={operation}
            />
          </div>
        </div>

        {/* Two-column layout */}
        <div style={{ display: 'flex', gap: 16 }}>

          {/* LEFT — Filters + Operators */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Filters */}
            <div style={{
              background: 'rgba(59,130,246,0.08)',
              borderLeft: '3px solid rgba(59,130,246,0.4)',
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: 'rgba(59,130,246,0.5)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(232,236,241,0.3)', textTransform: 'uppercase' }}>Filters</span>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={ctrlLabel}>Threat Type</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {activeCategories.map(cat => (
                    <button key={cat.id} style={chipBtn(threatType === cat.label)} onClick={() => setThreatType(cat.label)}>
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ ...ctrlLabel, marginBottom: 5 }}>{regionMode ? 'Region' : 'Country'}</div>
                <div style={{ display: 'flex', gap: 0, marginBottom: 6, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
                  <button style={segBtn(!regionMode)} onClick={() => { setRegionMode(false); setCountry('') }}>Country</button>
                  <button style={segBtn(regionMode)} onClick={() => { setRegionMode(true); setCountry('') }}>Region</button>
                </div>
                <SearchableSelect value={country} onChange={setCountry} options={['', ...countryList]} placeholder={`All ${regionMode ? 'Regions' : 'Countries'}`} />
              </div>

              <div style={{ marginBottom: 10 }}>
                <div style={{ ...ctrlLabel, marginBottom: 5 }}>Industry</div>
                <SearchableSelect value={industry} onChange={setIndustry} options={INDUSTRIES} placeholder="All Industries" />
              </div>

              <div>
                <div style={ctrlLabel}>Time Range</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {TIME_RANGES.map(t => (
                    <button key={t} style={chipBtn(timeRange === t)} onClick={() => setTimeRange(t)}>{t}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Operators */}
            <div style={{
              background: 'rgba(255,69,98,0.05)',
              borderLeft: '3px solid rgba(255,69,98,0.35)',
              borderRadius: 12,
              padding: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: 'rgba(255,69,98,0.4)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(232,236,241,0.3)', textTransform: 'uppercase' }}>Operators</span>
              </div>

              <div style={{ marginBottom: showElements ? 10 : 0 }}>
                <div style={ctrlLabel}>Operation</div>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {OPERATIONS.map(op => (
                    <button key={op} style={chipBtn(operation === op)} onClick={() => setOperation(op)}>{op}</button>
                  ))}
                </div>
              </div>

              {/* Show Filtered toggle */}
              <div style={{ marginTop: 10 }}>
                <div
                  onClick={() => setShowFiltered(!showFiltered)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8, padding: '7px 10px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                    border: showFiltered ? '1px solid rgba(59,130,246,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    background: showFiltered ? 'rgba(59,130,246,0.06)' : 'rgba(255,255,255,0.02)',
                  }}
                >
                  <div style={{
                    width: 28, height: 16, borderRadius: 8, position: 'relative', transition: 'all 0.2s',
                    background: showFiltered ? '#3B82F6' : 'rgba(255,255,255,0.1)',
                  }}>
                    <div style={{
                      width: 12, height: 12, borderRadius: '50%', background: '#fff', position: 'absolute', top: 2, transition: 'all 0.2s',
                      left: showFiltered ? 14 : 2,
                    }} />
                  </div>
                  <span style={{ fontSize: 11, fontFamily: "'Satoshi', sans-serif", color: showFiltered ? '#60A5FA' : 'rgba(232,236,241,0.4)' }}>
                    Show All vs Filtered
                  </span>
                </div>
              </div>

              {/* Elements (only for Break Down) */}
              {showElements && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ ...ctrlLabel, display: 'flex', justifyContent: 'space-between' }}>
                    <span>Elements</span>
                    {hiddenElements.size > 0 && (
                      <button onClick={() => setHiddenElements(new Set())} style={{ background: 'none', border: 'none', color: '#FF4562', cursor: 'pointer', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", opacity: 0.7 }}>Reset</button>
                    )}
                  </div>
                  {DUMMY_ELEMENTS.map((el, i) => {
                    const hidden = hiddenElements.has(el.name)
                    const elColor = activeColors[i] || el.color
                    return (
                      <div key={el.name} style={{
                        display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8,
                        border: '1px solid rgba(255,255,255,0.04)', background: 'rgba(255,255,255,0.02)',
                        marginBottom: 4, opacity: hidden ? 0.35 : 1, transition: 'all 0.2s',
                      }}>
                        <div style={{ width: 8, height: 8, borderRadius: 3, background: elColor, flexShrink: 0 }} />
                        <span style={{ flex: 1, fontSize: 11, color: '#E8ECF1', fontFamily: "'Satoshi', sans-serif", whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{el.name}</span>
                        <button onClick={() => toggleElement(el.name)} style={{
                          width: 22, height: 22, borderRadius: 6, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, transition: 'all 0.2s',
                          background: hidden ? 'rgba(255,69,98,0.06)' : 'rgba(255,255,255,0.03)',
                          color: hidden ? '#FF4562' : 'rgba(232,236,241,0.3)',
                        }}>
                          {hidden ? '\u2715' : '\uD83D\uDC41'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — Colors & Ratios */}
          <div style={{ width: 280, flexShrink: 0 }}>

            {/* Color Palette */}
            <div style={{
              background: 'rgba(255,69,98,0.05)',
              borderLeft: '3px solid rgba(255,69,98,0.35)',
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                <div style={{ width: 3, height: 14, borderRadius: 2, background: 'rgba(255,69,98,0.4)' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(232,236,241,0.3)', textTransform: 'uppercase' }}>Color Scale</span>
              </div>

              {COLOR_PALETTES.map((p, idx) => (
                <div key={p.name} onClick={() => handlePaletteSelect(idx)} style={{
                  display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: 4, transition: 'all 0.2s',
                  border: palette === idx ? '1px solid rgba(255,69,98,0.3)' : '1px solid rgba(255,255,255,0.04)',
                  background: palette === idx ? 'rgba(255,69,98,0.06)' : 'rgba(255,255,255,0.02)',
                }}>
                  <div style={{ display: 'flex', gap: 3 }}>
                    {p.colors.map((c, ci) => (
                      <div key={ci} style={{ width: 14, height: 14, borderRadius: 3, background: c }} />
                    ))}
                  </div>
                  <span style={{ fontSize: 10, fontFamily: "'Satoshi', sans-serif", color: palette === idx ? '#FF4562' : 'rgba(232,236,241,0.4)' }}>{p.name}</span>
                </div>
              ))}

              <div onClick={() => setPalette(COLOR_PALETTES.length)} style={{
                display: 'flex', alignItems: 'center', gap: 8, padding: '6px 10px', borderRadius: 8, cursor: 'pointer', marginBottom: isCustomPalette ? 8 : 0, transition: 'all 0.2s',
                border: isCustomPalette ? '1px solid rgba(255,69,98,0.3)' : '1px solid rgba(255,255,255,0.04)',
                background: isCustomPalette ? 'rgba(255,69,98,0.06)' : 'rgba(255,255,255,0.02)',
              }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  {customColors.map((c, ci) => (
                    <div key={ci} style={{ width: 14, height: 14, borderRadius: 3, background: c, border: '1px dashed rgba(255,255,255,0.15)' }} />
                  ))}
                </div>
                <span style={{ fontSize: 10, fontFamily: "'Satoshi', sans-serif", color: isCustomPalette ? '#FF4562' : 'rgba(232,236,241,0.4)' }}>Custom</span>
              </div>

              {isCustomPalette && <ColorPickerRow colors={customColors} onChange={setCustomColors} />}
            </div>

            {/* Background & Lines */}
            <div style={{
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: 12,
              padding: 12,
              marginBottom: 12,
            }}>
              <div style={{ ...ctrlLabel, marginBottom: 8 }}>Background</div>
              <div style={{ display: 'flex', gap: 5, marginBottom: 10 }}>
                {[
                  { key: 'dark', label: 'Dark', color: '#0E1220' },
                  { key: 'navy', label: 'Navy', color: '#1A2332' },
                  { key: 'white', label: 'White', color: '#FFFFFF' },
                ].map(bg => (
                  <div key={bg.key} onClick={() => setBgColor(bg.key)} style={{
                    flex: 1, display: 'flex', alignItems: 'center', gap: 5, padding: '6px 8px', borderRadius: 8, cursor: 'pointer', transition: 'all 0.2s',
                    border: bgColor === bg.key ? '1px solid rgba(255,69,98,0.3)' : '1px solid rgba(255,255,255,0.06)',
                    background: bgColor === bg.key ? 'rgba(255,69,98,0.06)' : 'transparent',
                  }}>
                    <div style={{ width: 14, height: 14, borderRadius: 4, background: bg.color, border: '1px solid rgba(255,255,255,0.15)' }} />
                    <span style={{ fontSize: 10, color: bgColor === bg.key ? '#FF4562' : 'rgba(232,236,241,0.4)', fontFamily: "'Satoshi', sans-serif" }}>{bg.label}</span>
                  </div>
                ))}
              </div>
              <div style={{ ...ctrlLabel, marginBottom: 8 }}>Grid Lines</div>
              <div style={{ display: 'flex', gap: 5 }}>
                {['none', 'subtle', 'visible'].map(g => (
                  <button key={g} style={colorOptBtn(gridLines === g)} onClick={() => setGridLines(g)}>{g.charAt(0).toUpperCase() + g.slice(1)}</button>
                ))}
              </div>
            </div>

            {/* All vs Filtered Ratio */}
            {showFiltered && (
              <div style={{
                background: 'rgba(59,130,246,0.06)',
                border: '1px solid rgba(59,130,246,0.15)',
                borderRadius: 12,
                padding: 12,
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(59,130,246,0.5)', textTransform: 'uppercase', marginBottom: 10 }}>
                  All vs Filtered
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: 'rgba(232,236,241,0.5)', fontFamily: "'Satoshi', sans-serif" }}>Global Total</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#E8ECF1', fontFamily: "'JetBrains Mono', monospace" }}>{ratioData.total.toLocaleString()}</span>
                  </div>
                  <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ width: '100%', height: '100%', borderRadius: 3, background: 'rgba(59,130,246,0.3)' }} />
                  </div>
                </div>
                <div style={{ marginBottom: 8 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 11, color: 'rgba(232,236,241,0.5)', fontFamily: "'Satoshi', sans-serif" }}>Your Filter</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: '#FF4562', fontFamily: "'JetBrains Mono', monospace" }}>{ratioData.filtered.toLocaleString()}</span>
                  </div>
                  <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                    <div style={{ width: `${ratioData.pct}%`, height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #FF4562, #FF456280)' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'center', padding: '6px 0 0', borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 6 }}>
                  <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 20, fontWeight: 700, color: '#FF4562' }}>{ratioData.pct}%</span>
                  <span style={{ fontSize: 11, color: 'rgba(232,236,241,0.3)', marginLeft: 6 }}>of global</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Big CTA */}
        <button
          onClick={async () => {
            if (previewRef.current) {
              await downloadPNG(previewRef.current, 'briefroom-export')
            }
            onClose()
          }}
          style={{
            width: '100%',
            marginTop: 20,
            padding: '15px 0',
            fontSize: 15,
            fontWeight: 700,
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            border: 'none',
            borderRadius: 14,
            cursor: 'pointer',
            background: 'linear-gradient(135deg, #FF4562, #FF4562CC)',
            color: '#fff',
            boxShadow: '0 6px 28px rgba(255,69,98,0.3)',
            transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
          }}
          onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 36px rgba(255,69,98,0.4)' }}
          onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(255,69,98,0.3)' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2"><path d="M8 3v7m-3-3l3 3 3-3M3 12h10" /></svg>
          Export Your Chart
        </button>
      </div>
    </div>
  )
}

/* ─── Email Gate Modal (first step) — skipped for reports ─── */
// mode: 'customize' = show premium builder after email, 'export' = download via onExport callback
export default function PNGExportModal({ onClose, onExport, chartType: sourceType, mode = 'customize', initialState, builderData }) {
  const [email, setEmail] = useState('')
  const [showPremium, setShowPremium] = useState(false)

  // Reports are ungated — go straight to premium builder
  const isReport = sourceType === 'report'
  if (isReport || (showPremium && mode === 'customize')) {
    return <PremiumBuilderModal onClose={onClose} initialState={initialState} builderData={builderData} />
  }

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!isValid) return
    sessionStorage.setItem('briefroom_email', email)
    if (mode === 'export') {
      // Direct export after email — download and close
      if (onExport) onExport()
      onClose()
      return
    }
    setShowPremium(true)
  }

  const benefits = [
    { icon: '\u2726', text: 'Full chart with headline, infographics & key findings' },
    { icon: '\uD83C\uDFA8', text: 'Brand the chart in your company colors' },
    { icon: '\uD83D\uDCCA', text: 'Us vs. Average industry comparison' },
  ]

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(10,14,26,0.85)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '90%',
          maxWidth: 440,
          background: 'rgba(16,20,34,0.95)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 24,
          padding: 40,
          boxShadow: '0 32px 100px rgba(0,0,0,0.5)',
        }}
      >
        {/* Top accent line */}
        <div style={{ position: 'absolute', top: 0, left: '15%', right: '15%', height: 2, background: 'linear-gradient(90deg, transparent, #FF4562, transparent)', borderRadius: '0 0 2px 2px' }} />

        {/* Close button */}
        <button onClick={onClose} style={{ position: 'absolute', top: 16, right: 16, width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, color: 'rgba(232,236,241,0.5)', fontSize: 16, cursor: 'pointer', lineHeight: 1 }}>
          &times;
        </button>

        {/* Icon */}
        <div style={{ textAlign: 'center', fontSize: 36, marginBottom: 16 }}>{'\uD83D\uDCCA'}</div>

        {/* Headline */}
        <h2 style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 22, fontWeight: 700, color: '#E8ECF1', textAlign: 'center', margin: '0 0 8px' }}>
          Get your chart &mdash; and more
        </h2>

        {/* Subtitle */}
        <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.5)', textAlign: 'center', margin: '0 0 24px', lineHeight: 1.5 }}>
          Enter your work email to receive a presentation-ready chart.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            style={{
              width: '100%', fontSize: 15, padding: '14px 16px',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 12, color: '#E8ECF1', outline: 'none', boxSizing: 'border-box',
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, margin: '20px 0 24px' }}>
            {benefits.map((b, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 24, height: 24, minWidth: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,69,98,0.08)', borderRadius: '50%', fontSize: 12 }}>
                  {b.icon}
                </div>
                <span style={{ fontSize: 13, color: 'rgba(232,236,241,0.5)', lineHeight: 1.4 }}>{b.text}</span>
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={!isValid}
            style={{
              width: '100%', padding: '14px 0', fontSize: 15, fontWeight: 700,
              fontFamily: "'Plus Jakarta Sans', sans-serif", border: 'none', borderRadius: 12,
              cursor: isValid ? 'pointer' : 'default', transition: 'all 0.2s ease',
              ...(isValid
                ? { background: 'linear-gradient(135deg, #FF4562, #FF4562CC)', color: '#fff', boxShadow: '0 4px 24px rgba(255,69,98,0.25)' }
                : { background: 'rgba(255,255,255,0.04)', color: 'rgba(232,236,241,0.3)' }),
            }}
          >
            Send me the chart
          </button>
        </form>

        <p style={{ fontSize: 11, color: 'rgba(232,236,241,0.25)', textAlign: 'center', margin: '14px 0 0' }}>
          We'll email your chart instantly. No spam.
        </p>
      </div>
    </div>
  )
}
