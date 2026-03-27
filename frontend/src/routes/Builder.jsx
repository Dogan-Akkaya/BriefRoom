import { useState, useMemo, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from 'recharts'
import SmokeHero from '../components/SmokeHero'
import GridBackground from '../components/GridBackground'
import CategoryPicker from '../components/CategoryPicker'
import ControlPanel from '../components/ControlPanel'
import ExportBar from '../components/ExportBar'
import EmailGate from '../components/EmailGate'
import { CATEGORIES, MONTHS, generateData, DATA_POINTS_BY_CATEGORY, ALL_MONTHS } from '../lib/data'

const tooltipStyle = {
  contentStyle: { background: 'rgba(12,16,28,0.96)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, fontSize: 12, fontFamily: "'JetBrains Mono',monospace", backdropFilter: 'blur(20px)', boxShadow: '0 12px 48px rgba(0,0,0,0.5)', padding: '12px 16px' },
  itemStyle: { color: '#E8ECF1', padding: '2px 0' },
  labelStyle: { color: 'rgba(232,236,241,0.5)', marginBottom: 6, fontWeight: 600 },
}

const CatIcon = ({ path, size = 14, color = '#FF4562' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d={path} /></svg>
)

const AmbientBG = ({ colors }) => (
  <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}>
    <div style={{ position: 'absolute', top: '-5%', left: '5%', width: 700, height: 700, borderRadius: '50%', background: `radial-gradient(circle,${colors[0]}20 0%,transparent 65%)`, filter: 'blur(60px)', animation: 'floatBlob1 25s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', top: '30%', right: '-5%', width: 650, height: 650, borderRadius: '50%', background: `radial-gradient(circle,${colors[1]}18 0%,transparent 65%)`, filter: 'blur(60px)', animation: 'floatBlob2 30s ease-in-out infinite' }} />
    <div style={{ position: 'absolute', bottom: '-5%', left: '25%', width: 600, height: 600, borderRadius: '50%', background: `radial-gradient(circle,${colors[2]}15 0%,transparent 65%)`, filter: 'blur(60px)', animation: 'floatBlob3 20s ease-in-out infinite' }} />
  </div>
)

export default function Builder() {
  const { categoryId } = useParams()
  const navigate = useNavigate()

  const selectedCat = categoryId ? CATEGORIES.find(c => c.id === categoryId) : null

  // Scroll to top when entering builder
  useEffect(() => { window.scrollTo(0, 0) }, [categoryId])

  const [chartType, setChartType] = useState('bar')
  const [operation, setOperation] = useState('Sum')
  const [dateStart, setDateStart] = useState(24) // Jan 2026
  const [dateEnd, setDateEnd] = useState(35) // Dec 2026
  const [hiddenElements, setHiddenElements] = useState(new Set())
  const [highlightedElement, setHighlightedElement] = useState(null)
  const [showEmailGate, setShowEmailGate] = useState(false)
  const [country, setCountry] = useState('')
  const [regionMode, setRegionMode] = useState(false)
  const [industry, setIndustry] = useState('')
  const [dataPoint, setDataPoint] = useState('')
  const [threatGroup, setThreatGroup] = useState('All Groups')

  const catColor = '#FF4562'

  const dataPoints = selectedCat ? (DATA_POINTS_BY_CATEGORY[selectedCat.id] || []) : []

  useEffect(() => {
    if (selectedCat && DATA_POINTS_BY_CATEGORY[selectedCat.id]) {
      setDataPoint(DATA_POINTS_BY_CATEGORY[selectedCat.id][0].id)
    }
  }, [selectedCat])

  const rawData = useMemo(() => {
    if (!selectedCat) return []
    const key = dataPoint ? `${selectedCat.id}/${dataPoint}` : selectedCat.id
    return generateData(key)
  }, [selectedCat, dataPoint])

  // Active months based on date range (map from ALL_MONTHS indices back to month names)
  const activeDateMonths = ALL_MONTHS.slice(dateStart, dateEnd + 1)
  const activeMonthNames = activeDateMonths.map(m => m.month)
  // For chart data, use unique keys to avoid duplicate month names
  const chartMonthLabels = activeDateMonths.map(m => `${m.month} ${String(m.year).slice(2)}`)

  const visibleData = rawData.filter(d => !hiddenElements.has(d.name))

  const chartData = useMemo(() => {
    if (operation === 'Break Down') {
      // Current multi-element behavior
      return chartMonthLabels.map((label, idx) => {
        const monthName = activeMonthNames[idx]
        const point = { month: label }
        visibleData.forEach(d => { point[d.name] = d[monthName] })
        return point
      })
    } else {
      // Aggregated: Sum, Average, Min, Max -> single series
      return chartMonthLabels.map((label, idx) => {
        const monthName = activeMonthNames[idx]
        const values = visibleData.map(d => d[monthName])
        let val = 0
        if (operation === 'Sum') val = values.reduce((s, v) => s + v, 0)
        else if (operation === 'Average') val = values.length ? Math.round(values.reduce((s, v) => s + v, 0) / values.length) : 0
        else if (operation === 'Min') val = values.length ? Math.min(...values) : 0
        else if (operation === 'Max') val = values.length ? Math.max(...values) : 0
        return { month: label, value: val }
      })
    }
  }, [chartMonthLabels, activeMonthNames, visibleData, operation])

  const activeMonths = activeMonthNames
  const pieData = useMemo(() => visibleData.map(d => ({ name: d.name, value: activeMonths.reduce((s, m) => s + d[m], 0), color: d.color })), [visibleData, activeMonths])
  const totalSum = pieData.reduce((s, d) => s + d.value, 0)
  const avgPerElement = visibleData.length > 0 ? Math.round(totalSum / visibleData.length) : 0
  const highlightedData = highlightedElement ? pieData.find(d => d.name === highlightedElement) : null
  const highlightPct = highlightedData ? ((highlightedData.value / totalSum) * 100).toFixed(1) : null

  const toggleElement = (name) => {
    const n = new Set(hiddenElements)
    n.has(name) ? n.delete(name) : n.add(name)
    setHiddenElements(n)
    if (highlightedElement === name) setHighlightedElement(null)
  }
  const toggleHighlight = (name) => setHighlightedElement(p => p === name ? null : name)

  const ctrlLabelStyle = { fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.08em', color: 'rgba(232,236,241,0.3)', textTransform: 'uppercase', marginBottom: 4 }
  const statValueStyle = { fontFamily: "'Plus Jakarta Sans'", fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }
  const statCardStyle = { padding: '14px 20px', borderRadius: 14, background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.05)', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }

  // Category selection screen
  if (!selectedCat) {
    return (
      <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', paddingTop: 80 }}>
        <GridBackground />
        <AmbientBG colors={['#FF4562', '#3B82F6', '#A855F7']} />
        <div style={{ maxWidth: 940, margin: '0 auto', padding: '60px 24px 40px', position: 'relative', zIndex: 2 }}>
          <div style={{ textAlign: 'center', marginBottom: 52 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,69,98,0.6)', textTransform: 'uppercase', marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4562', boxShadow: '0 0 8px rgba(255,69,98,0.5)' }} />Custom Chart Builder
            </div>
            <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(30px,4.5vw,46px)', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14, lineHeight: 1.1, color: '#FFFFFF', textShadow: '0 2px 30px rgba(10,14,26,0.8)' }}>
              What data do you want to <span style={{ background: 'linear-gradient(135deg,#FF4562,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>visualize</span>?
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(232,236,241,0.45)', fontWeight: 300, maxWidth: 480, margin: '0 auto', lineHeight: 1.7 }}>Select a threat category. You'll customize chart type, date range, and every data element.</p>
          </div>
          <CategoryPicker onSelect={(cat) => navigate(`/builder/${cat.id}`)} />
        </div>
      </div>
    )
  }

  // Chart builder view
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative', paddingTop: 60 }}>
      <SmokeHero />
      <AmbientBG colors={[catColor, '#3B82F6', '#A855F7']} />

      {/* Builder nav */}
      <nav style={{ padding: '12px 22px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'rgba(10,14,26,0.6)', backdropFilter: 'blur(20px)', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={() => navigate('/builder')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '7px 16px', color: 'rgba(232,236,241,0.5)', cursor: 'pointer', fontSize: 12, backdropFilter: 'blur(8px)' }}>← Categories</button>
          <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 8, background: 'rgba(255,69,98,0.08)', border: '1px solid rgba(255,69,98,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CatIcon path={selectedCat.svgPath} />
            </div>
            <span style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 15, fontWeight: 600 }}>{selectedCat.label}</span>
            {country && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.25)', padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>{country}</span>}
            {industry && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.25)', padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>{industry}</span>}
            {threatGroup && threatGroup !== 'All Groups' && <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.25)', padding: '2px 8px', borderRadius: 6, background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>{threatGroup}</span>}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <button onClick={() => navigate('/')} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 10, padding: '9px 16px', color: 'rgba(232,236,241,0.4)', cursor: 'pointer', fontSize: 12, backdropFilter: 'blur(8px)' }}>Home</button>
        </div>
      </nav>

      <div style={{ display: 'flex', flex: 1, overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* LEFT — Chart */}
        <div style={{ flex: 1, padding: 24, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
          {/* Stats */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
            {[{ l: 'Total', v: totalSum.toLocaleString(), c: catColor }, { l: 'Avg / Category', v: avgPerElement.toLocaleString(), c: 'rgba(232,236,241,0.7)' }].map((s, i) => (
              <div key={i} style={statCardStyle}>
                <div style={ctrlLabelStyle}>{s.l}</div>
                <div style={{ ...statValueStyle, color: s.c }}>{s.v}</div>
              </div>
            ))}
            {operation !== 'Break Down' && (
              <div style={statCardStyle}>
                <div style={ctrlLabelStyle}>Mode</div>
                <div style={{ ...statValueStyle, color: 'rgba(232,236,241,0.7)' }}>{operation}</div>
              </div>
            )}
            {highlightedElement && highlightedData && (
              <div style={{ padding: '14px 20px', borderRadius: 14, background: `${catColor}06`, backdropFilter: 'blur(16px)', border: `1px solid ${catColor}18`, boxShadow: `0 4px 24px ${catColor}06`, animation: 'catCardIn 0.3s cubic-bezier(0.16,1,0.3,1)' }}>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.08em', color: `${catColor}90`, textTransform: 'uppercase', marginBottom: 4 }}>◉ {highlightedElement}</div>
                <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 24, fontWeight: 700, color: catColor, letterSpacing: '-0.02em' }}>{highlightPct}%<span style={{ fontSize: 13, fontWeight: 400, color: 'rgba(232,236,241,0.3)', marginLeft: 8 }}>({highlightedData.value.toLocaleString()})</span></div>
              </div>
            )}
          </div>

          {/* Chart */}
          <div style={{ minHeight: 380, background: 'rgba(255,255,255,0.018)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: 20, padding: '24px 20px 14px', boxShadow: '0 8px 40px rgba(0,0,0,0.2),inset 0 1px 0 rgba(255,255,255,0.03)', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, left: '10%', right: '10%', height: 1, background: `linear-gradient(90deg,transparent,${catColor}25,transparent)` }} />
            <ResponsiveContainer width="100%" height={380}>
              {chartType === 'bar' ? (
                <BarChart data={chartData} barCategoryGap="20%" barGap={4}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.035)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(232,236,241,0.35)', fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} width={45} tick={{ fill: 'rgba(232,236,241,0.35)', fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
                  <Tooltip {...tooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.015)', radius: 4 }} />
                  {operation === 'Break Down'
                    ? visibleData.map(d => <Bar key={d.name} dataKey={d.name} fill={d.color} fillOpacity={highlightedElement && highlightedElement !== d.name ? 0.1 : 0.8} radius={[6, 6, 0, 0]} maxBarSize={28} />)
                    : <Bar dataKey="value" fill={catColor} fillOpacity={0.8} radius={[6, 6, 0, 0]} maxBarSize={28} />
                  }
                </BarChart>
              ) : chartType === 'line' ? (
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.035)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(232,236,241,0.35)', fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} width={45} tick={{ fill: 'rgba(232,236,241,0.35)', fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
                  <Tooltip {...tooltipStyle} />
                  {operation === 'Break Down'
                    ? visibleData.map(d => <Line key={d.name} type="monotone" dataKey={d.name} stroke={d.color} strokeWidth={highlightedElement === d.name ? 3 : 2} strokeOpacity={highlightedElement && highlightedElement !== d.name ? 0.12 : 0.9} dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: '#0A0E1A', stroke: d.color }} />)
                    : <Line type="monotone" dataKey="value" stroke={catColor} strokeWidth={2} strokeOpacity={0.9} dot={false} activeDot={{ r: 5, strokeWidth: 2, fill: '#0A0E1A', stroke: catColor }} />
                  }
                </LineChart>
              ) : chartType === 'area' ? (
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.035)" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: 'rgba(232,236,241,0.35)', fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
                  <YAxis axisLine={false} tickLine={false} width={45} tick={{ fill: 'rgba(232,236,241,0.35)', fontFamily: "'JetBrains Mono'", fontSize: 10 }} />
                  <Tooltip {...tooltipStyle} />
                  {operation === 'Break Down'
                    ? visibleData.map(d => <Area key={d.name} type="monotone" dataKey={d.name} stroke={d.color} fill={d.color} fillOpacity={highlightedElement && highlightedElement !== d.name ? 0.02 : 0.12} strokeWidth={highlightedElement === d.name ? 2.5 : 1.5} strokeOpacity={highlightedElement && highlightedElement !== d.name ? 0.15 : 0.8} dot={false} />)
                    : <Area type="monotone" dataKey="value" stroke={catColor} fill={catColor} fillOpacity={0.12} strokeWidth={1.5} strokeOpacity={0.8} dot={false} />
                  }
                </AreaChart>
              ) : (
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={140} innerRadius={65} paddingAngle={3} strokeWidth={0} cornerRadius={4}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} fillOpacity={highlightedElement && highlightedElement !== d.name ? 0.1 : 0.85} stroke={highlightedElement === d.name ? d.color : 'transparent'} strokeWidth={highlightedElement === d.name ? 2 : 0} />)}
                  </Pie>
                  <Tooltip {...tooltipStyle} formatter={(value, name) => [`${value.toLocaleString()} (${((value / totalSum) * 100).toFixed(1)}%)`, name]} />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
          <ExportBar chartRef={null} labels={activeMonths} datasets={visibleData} filename={selectedCat ? selectedCat.id : 'chart-data'} />
          <div style={{ marginTop: 12, fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.15)', display: 'flex', justifyContent: 'space-between' }}>
            <span>Data: SOCRadar Threat Intelligence • {chartMonthLabels[0]}–{chartMonthLabels[chartMonthLabels.length - 1]}{country ? ` • ${country}` : ''}{industry ? ` • ${industry}` : ''}</span>
            <span>{visibleData.length} of {rawData.length} shown</span>
          </div>
        </div>

        {/* RIGHT — Controls */}
        <ControlPanel
          chartType={chartType} setChartType={setChartType}
          operation={operation} setOperation={setOperation}
          dateStart={dateStart} dateEnd={dateEnd}
          setDateStart={setDateStart} setDateEnd={setDateEnd}
          country={country} setCountry={setCountry}
          regionMode={regionMode} setRegionMode={setRegionMode}
          industry={industry} setIndustry={setIndustry}
          dataPoint={dataPoint} setDataPoint={setDataPoint}
          dataPoints={dataPoints}
          threatGroup={threatGroup} setThreatGroup={setThreatGroup}
          rawData={rawData} hiddenElements={hiddenElements}
          toggleElement={toggleElement}
          highlightedElement={highlightedElement}
          toggleHighlight={toggleHighlight}
          activeMonths={activeMonths} totalSum={totalSum}
          catColor={catColor}
        />
      </div>

      {/* Email gate modal */}
      {showEmailGate && <EmailGate onClose={() => setShowEmailGate(false)} catColor={catColor} />}
    </div>
  )
}
