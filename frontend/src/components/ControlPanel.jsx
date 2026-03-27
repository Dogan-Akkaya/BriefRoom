import React from 'react'
import SearchableSelect from './SearchableSelect'
import { ALL_COUNTRIES, ALL_REGIONS, THREAT_GROUPS, ALL_MONTHS, DATA_AVAILABILITY, DATE_PRESETS } from '../lib/data'

const CHART_TYPES = ['bar', 'line', 'area', 'pie']

const INDUSTRIES = [
  'All Industries', 'Financial Services', 'Healthcare', 'Technology', 'Government',
  'Manufacturing', 'Energy & Utilities', 'Retail & E-Commerce', 'Telecommunications',
  'Education', 'Transportation',
]

const OPERATIONS = ['Sum', 'Break Down', 'Average', 'Min', 'Max']

const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
const YEARS = [...new Set(ALL_MONTHS.map(m => m.split(' ')[1]))]

const ctrlLabel = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.08em',
  color: 'rgba(232,236,241,0.3)',
  textTransform: 'uppercase',
  marginBottom: 8,
}

const chipBtn = (active, catColor) => ({
  flex: 1,
  textTransform: 'capitalize',
  fontSize: 11,
  padding: '7px 8px',
  borderRadius: 10,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.25s',
  border: active ? `1px solid ${catColor}45` : '1px solid rgba(255,255,255,0.07)',
  background: active ? `${catColor}0C` : 'rgba(255,255,255,0.02)',
  color: active ? catColor : 'rgba(232,236,241,0.5)',
  fontFamily: "'Satoshi', sans-serif",
  backdropFilter: 'blur(8px)',
  boxShadow: active ? `0 0 12px ${catColor}10` : 'none',
})

const selInput = {
  width: '100%',
  padding: '9px 12px',
  fontSize: 12,
  fontFamily: "'Satoshi', sans-serif",
  background: 'rgba(255,255,255,0.025)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 10,
  color: '#E8ECF1',
  outline: 'none',
  backdropFilter: 'blur(8px)',
  transition: 'all 0.3s',
  appearance: 'none',
  cursor: 'pointer',
  boxSizing: 'border-box',
}

const elRowBase = {
  display: 'flex',
  alignItems: 'center',
  gap: 10,
  padding: '9px 12px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,0.04)',
  background: 'rgba(255,255,255,0.02)',
  transition: 'all 0.2s',
  marginBottom: 5,
  backdropFilter: 'blur(8px)',
}

const smallBtn = (active, color, isBg) => ({
  width: 26,
  height: 26,
  borderRadius: 7,
  border: 'none',
  cursor: 'pointer',
  background: active
    ? isBg ? 'rgba(255,69,98,0.06)' : `${color}15`
    : 'rgba(255,255,255,0.03)',
  color: active
    ? isBg ? '#FF4562' : color
    : 'rgba(232,236,241,0.2)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: isBg ? 10 : 11,
  transition: 'all 0.2s',
  boxShadow: !isBg && active ? `0 0 8px ${color}12` : 'none',
})

const groupContainer = (tintColor, accentColor) => ({
  background: tintColor,
  borderLeft: `3px solid ${accentColor}`,
  borderRadius: 12,
  padding: 14,
  marginBottom: 22,
})

const groupHeader = (accentColor) => ({
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  marginBottom: 14,
})

const groupHeaderBar = (accentColor) => ({
  width: 3,
  height: 14,
  borderRadius: 2,
  background: accentColor,
  flexShrink: 0,
})

const groupHeaderLabel = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 10,
  letterSpacing: '0.08em',
  color: 'rgba(232,236,241,0.3)',
  textTransform: 'uppercase',
}

const segBtn = (active, catColor) => ({
  flex: 1,
  padding: '7px 0',
  fontSize: 11,
  fontWeight: 500,
  fontFamily: "'Satoshi', sans-serif",
  border: 'none',
  borderRadius: 8,
  cursor: 'pointer',
  transition: 'all 0.25s',
  background: active ? catColor : 'rgba(255,255,255,0.04)',
  color: active ? '#fff' : 'rgba(232,236,241,0.5)',
})

const presetChip = (active, catColor) => ({
  fontSize: 10,
  padding: '5px 9px',
  borderRadius: 8,
  fontWeight: 500,
  cursor: 'pointer',
  transition: 'all 0.25s',
  border: active ? `1px solid ${catColor}45` : '1px solid rgba(255,255,255,0.07)',
  background: active ? `${catColor}0C` : 'rgba(255,255,255,0.02)',
  color: active ? catColor : 'rgba(232,236,241,0.45)',
  fontFamily: "'Satoshi', sans-serif",
  whiteSpace: 'nowrap',
})

const SparkAvailability = ({ data, startIdx, endIdx, catColor }) => {
  const w = 280, h = 40
  const max = Math.max(...data.map(d => d.sources))
  const min = Math.min(...data.map(d => d.sources))
  const range = max - min || 1
  const toY = (v) => h - ((v - min) / range) * h * 0.7 - h * 0.15
  const toX = (i) => (i / (data.length - 1)) * w

  const allPts = data.map((d, i) => `${toX(i)},${toY(d.sources)}`).join(' ')
  const selStart = toX(startIdx)
  const selEnd = toX(endIdx)

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
      {/* Background line */}
      <polyline points={allPts} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.5" />
      {/* Selected range highlight */}
      <rect x={selStart} y={0} width={selEnd - selStart} height={h} fill={`${catColor}12`} rx={2} />
      {/* Selected range line */}
      <clipPath id="sel-clip"><rect x={selStart} y={0} width={selEnd - selStart} height={h} /></clipPath>
      <polyline points={allPts} fill="none" stroke={catColor} strokeWidth="1.5" clipPath="url(#sel-clip)" />
    </svg>
  )
}

function parseMonthIndex(idx) {
  if (idx < 0 || idx >= ALL_MONTHS.length) return { month: 'Jan', year: '2023' }
  const parts = ALL_MONTHS[idx].split(' ')
  return { month: parts[0], year: parts[1] }
}

function findMonthIndex(month, year) {
  const label = `${month} ${year}`
  const idx = ALL_MONTHS.indexOf(label)
  return idx >= 0 ? idx : 0
}

export default function ControlPanel({
  chartType, setChartType,
  dateStart, dateEnd, setDateStart, setDateEnd,
  country, setCountry,
  regionMode, setRegionMode,
  industry, setIndustry,
  dataPoint, setDataPoint, dataPoints,
  threatGroup, setThreatGroup,
  operation, setOperation,
  rawData, hiddenElements, toggleElement, highlightedElement, toggleHighlight,
  activeMonths, totalSum, catColor,
}) {
  const countryList = regionMode
    ? ALL_REGIONS
    : ALL_COUNTRIES.map(c => c.name)

  const startParsed = parseMonthIndex(dateStart)
  const endParsed = parseMonthIndex(dateEnd)

  const handlePreset = (preset) => {
    setDateStart(preset.start)
    setDateEnd(preset.end)
  }

  const activePreset = DATE_PRESETS.find(p => p.start === dateStart && p.end === dateEnd)

  const panelStyle = {
    width: 350,
    flexShrink: 0,
    overflowY: 'auto',
    background: 'rgba(255,255,255,0.012)',
    backdropFilter: 'blur(24px)',
    borderLeft: '1px solid rgba(255,255,255,0.05)',
    boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.02),-8px 0 40px rgba(0,0,0,0.12)',
    padding: '20px 18px',
    position: 'relative',
  }

  const accentLine = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: 1,
    height: '100%',
    background: `linear-gradient(180deg,transparent,${catColor}12,transparent)`,
  }

  return (
    <div style={panelStyle}>
      <div style={accentLine} />

      {/* Section 1: Chart Type */}
      <div style={{ marginBottom: 22 }}>
        <div style={ctrlLabel}>Chart Type</div>
        <div style={{ display: 'flex', gap: 5 }}>
          {CHART_TYPES.map(t => (
            <button key={t} style={chipBtn(chartType === t, catColor)} onClick={() => setChartType(t)}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Section 2: FILTERS group */}
      <div style={groupContainer('rgba(59,130,246,0.15)', 'rgba(59,130,246,0.5)')}>
        <div style={groupHeader('rgba(59,130,246,0.5)')}>
          <div style={groupHeaderBar('rgba(59,130,246,0.5)')} />
          <span style={groupHeaderLabel}>Filters</span>
        </div>

        {/* Country / Region */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...ctrlLabel, marginBottom: 6 }}>{regionMode ? 'Region' : 'Country'}</div>
          <div style={{ display: 'flex', gap: 0, marginBottom: 8, borderRadius: 10, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.07)' }}>
            <button
              style={segBtn(!regionMode, catColor)}
              onClick={() => { setRegionMode(false); setCountry('') }}
            >
              Country
            </button>
            <button
              style={segBtn(regionMode, catColor)}
              onClick={() => { setRegionMode(true); setCountry('') }}
            >
              Region
            </button>
          </div>
          <SearchableSelect
            value={country}
            onChange={setCountry}
            options={['', ...countryList]}
            placeholder={`All ${regionMode ? 'Regions' : 'Countries'}`}
          />
        </div>

        {/* Industry */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...ctrlLabel, marginBottom: 6 }}>Industry</div>
          <SearchableSelect
            value={industry}
            onChange={setIndustry}
            options={INDUSTRIES}
            placeholder="All Industries"
          />
        </div>

        {/* Threat Actor / Group */}
        <div>
          <div style={{ ...ctrlLabel, marginBottom: 6 }}>Threat Actor / Group</div>
          <SearchableSelect
            value={threatGroup}
            onChange={setThreatGroup}
            options={THREAT_GROUPS}
            placeholder="All Groups"
          />
        </div>
      </div>

      {/* Section 3: OPERATORS group */}
      <div style={groupContainer('rgba(255,69,98,0.08)', 'rgba(255,69,98,0.4)')}>
        <div style={groupHeader('rgba(255,69,98,0.4)')}>
          <div style={groupHeaderBar('rgba(255,69,98,0.4)')} />
          <span style={groupHeaderLabel}>Operators</span>
        </div>

        {/* Data Point */}
        <div style={{ marginBottom: 14 }}>
          <div style={{ ...ctrlLabel, marginBottom: 6 }}>Data Point</div>
          <select style={selInput} value={dataPoint} onChange={e => setDataPoint(e.target.value)}>
            {dataPoints.map(dp => (
              <option key={dp.id} value={dp.id} style={{ background: '#0E1220', color: '#E8ECF1' }}>
                {dp.label}
              </option>
            ))}
          </select>
        </div>

        {/* Operation */}
        <div>
          <div style={{ ...ctrlLabel, marginBottom: 6 }}>Operation</div>
          <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
            {OPERATIONS.map(op => (
              <button
                key={op}
                style={chipBtn(operation === op, catColor)}
                onClick={() => setOperation(op)}
              >
                {op}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Section 4: Date Range */}
      <div style={{ marginBottom: 22 }}>
        <div style={ctrlLabel}>Date Range</div>

        {/* Quick presets */}
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap', marginBottom: 12 }}>
          {DATE_PRESETS.map(p => (
            <button
              key={p.label}
              style={presetChip(activePreset && activePreset.label === p.label, catColor)}
              onClick={() => handlePreset(p)}
            >
              {p.label}
            </button>
          ))}
        </div>

        {/* Start date */}
        <div style={{ marginBottom: 8 }}>
          <label style={{ fontSize: 10, color: 'rgba(232,236,241,0.2)', display: 'block', marginBottom: 3 }}>
            Start
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <select
              style={{ ...selInput, flex: 1 }}
              value={startParsed.month}
              onChange={e => setDateStart(findMonthIndex(e.target.value, startParsed.year))}
            >
              {MONTH_NAMES.map(m => (
                <option key={m} value={m} style={{ background: '#0E1220', color: '#E8ECF1' }}>{m}</option>
              ))}
            </select>
            <select
              style={{ ...selInput, flex: 1 }}
              value={startParsed.year}
              onChange={e => setDateStart(findMonthIndex(startParsed.month, e.target.value))}
            >
              {YEARS.map(y => (
                <option key={y} value={y} style={{ background: '#0E1220', color: '#E8ECF1' }}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* End date */}
        <div style={{ marginBottom: 12 }}>
          <label style={{ fontSize: 10, color: 'rgba(232,236,241,0.2)', display: 'block', marginBottom: 3 }}>
            End
          </label>
          <div style={{ display: 'flex', gap: 6 }}>
            <select
              style={{ ...selInput, flex: 1 }}
              value={endParsed.month}
              onChange={e => setDateEnd(findMonthIndex(e.target.value, endParsed.year))}
            >
              {MONTH_NAMES.map(m => (
                <option key={m} value={m} style={{ background: '#0E1220', color: '#E8ECF1' }}>{m}</option>
              ))}
            </select>
            <select
              style={{ ...selInput, flex: 1 }}
              value={endParsed.year}
              onChange={e => setDateEnd(findMonthIndex(endParsed.month, e.target.value))}
            >
              {YEARS.map(y => (
                <option key={y} value={y} style={{ background: '#0E1220', color: '#E8ECF1' }}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Data Availability Sparkline */}
        <div>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 9,
            color: 'rgba(232,236,241,0.25)',
            marginBottom: 4,
          }}>
            Data availability
          </div>
          {DATA_AVAILABILITY.length > 0 && (
            <SparkAvailability
              data={DATA_AVAILABILITY}
              startIdx={dateStart}
              endIdx={dateEnd}
              catColor={catColor}
            />
          )}
        </div>
      </div>

      {/* Divider */}
      <div style={{
        height: 1,
        background: 'linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)',
        marginBottom: 18,
      }} />

      {/* Section 5: Elements */}
      <div>
        <div style={{ ...ctrlLabel, display: 'flex', justifyContent: 'space-between' }}>
          <span>Elements</span>
          <button
            onClick={() => {
              if (rawData) {
                rawData.forEach(d => {
                  if (hiddenElements.has(d.name)) toggleElement(d.name)
                })
                if (highlightedElement) toggleHighlight(highlightedElement)
              }
            }}
            style={{
              background: 'none',
              border: 'none',
              color: catColor,
              cursor: 'pointer',
              fontSize: 10,
              fontFamily: "'JetBrains Mono', monospace",
              opacity: 0.7,
            }}
          >
            Reset
          </button>
        </div>
        {rawData && rawData.map(d => {
          const hidden = hiddenElements.has(d.name)
          const hl = highlightedElement === d.name
          const elTotal = activeMonths.reduce((s, m) => s + (d[m] || 0), 0)
          const elPct = totalSum > 0 ? ((elTotal / totalSum) * 100).toFixed(1) : '0.0'

          const rowStyle = {
            ...elRowBase,
            opacity: hidden ? 0.3 : 1,
            ...(hl ? { borderColor: `${catColor}35`, background: `${catColor}06` } : {}),
          }

          return (
            <div key={d.name} style={rowStyle}>
              <div style={{
                width: 10, height: 10, borderRadius: 3,
                background: d.color, flexShrink: 0,
                opacity: hidden ? 0.3 : 1,
              }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 12, fontWeight: 500,
                  whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                  color: '#E8ECF1',
                }}>
                  {d.name}
                </div>
                <div style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10, color: 'rgba(232,236,241,0.22)',
                }}>
                  {elTotal.toLocaleString()} &middot; {elPct}%
                </div>
              </div>
              <button onClick={() => toggleHighlight(d.name)} style={smallBtn(hl, catColor, false)}>
                &#9673;
              </button>
              <button onClick={() => toggleElement(d.name)} style={smallBtn(hidden, catColor, true)}>
                {hidden ? '\u2715' : '\uD83D\uDC41'}
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}
