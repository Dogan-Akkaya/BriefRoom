import { useEffect, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBuilderStore } from '../stores/useBuilderStore'
import ChartPreview from '../components/ChartPreview'
import ExportBar from '../components/ExportBar'
import EmailGate from '../components/EmailGate'
import { builderData, metricsByTopic, topicNameBySlug, regionMultipliers, industryMultipliers } from '../lib/data'

const chartTypeOptions = [
  { type: 'bar', icon: '▮', label: 'Bar' },
  { type: 'line', icon: '⌇', label: 'Line' },
  { type: 'doughnut', icon: '◔', label: 'Donut' },
  { type: 'horizontal', icon: '▦', label: 'H-Bar' },
]

const regions = ['Global', 'North America', 'Europe', 'Latin America', 'Asia-Pacific', 'Middle East & Africa']
const industries = ['All industries', 'Healthcare', 'Financial services', 'Manufacturing & OT', 'Government', 'Technology']

export default function Builder() {
  const { topicSlug } = useParams()
  const navigate = useNavigate()
  const store = useBuilderStore()

  useEffect(() => {
    if (topicSlug && topicNameBySlug[topicSlug]) {
      store.setTopic(topicNameBySlug[topicSlug])
    }
  }, [topicSlug])

  const metrics = metricsByTopic[store.topic] || []
  useEffect(() => {
    if (metrics.length && !metrics.includes(store.metric)) {
      store.setMetric(metrics[0])
    }
  }, [store.topic])

  const topicData = builderData[store.topic]
  const raw = topicData?.[store.metric] || (topicData ? Object.values(topicData)[0] : null)

  const { labels, q1, q0 } = useMemo(() => {
    if (!raw) return { labels: [], q1: [], q0: null }
    const rm = regionMultipliers[store.region] || 1
    const im = industryMultipliers[store.industry] || 1
    return {
      labels: raw.labels,
      q1: raw.q1.map((v) => Math.round(v * rm * im * 100) / 100),
      q0: raw.q0 ? raw.q0.map((v) => Math.round(v * rm * im * 100) / 100) : null,
    }
  }, [raw, store.region, store.industry])

  const isDark = store.theme === 'dark'

  const selectClass = "w-full bg-[var(--color-bg-input)] border border-[var(--color-border)] text-[var(--color-text-1)] text-xs font-[var(--font-sans)] py-2 px-2.5 pr-7 rounded-[6px] appearance-none cursor-pointer focus:outline-none focus:border-[rgba(232,70,58,0.4)] bg-[length:8px_5px] bg-[right_10px_center] bg-no-repeat"
  const selectBg = `url("data:image/svg+xml,%3Csvg width='8' height='5' viewBox='0 0 8 5' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1l3 3 3-3' stroke='%236B7280' stroke-width='1.2' stroke-linecap='round'/%3E%3C/svg%3E")`

  return (
    <div>
      <div className="text-[11px] text-[var(--color-text-3)] font-mono mb-4 pt-5 px-6">
        <a onClick={() => navigate('/')} className="text-[var(--color-text-2)] cursor-pointer hover:text-[var(--color-text-1)]">Threat Visuals</a> / Custom builder
      </div>
      <div className="mb-5 px-6">
        <h1 className="text-lg font-bold tracking-tight mb-1">Custom chart builder</h1>
        <p className="text-xs text-[var(--color-text-2)]">Pick your parameters and generate a chart from our threat intelligence dataset.</p>
      </div>

      <div className="grid grid-cols-[230px_1fr] gap-3.5 px-6 pb-7">
        {/* Config panel */}
        <div className="bg-[var(--color-bg-card)] border border-[var(--color-border)] rounded-[10px] p-4">
          <div className="mb-3.5">
            <label className="text-[9px] uppercase tracking-wider text-[var(--color-text-3)] font-mono mb-1.5 block">Topic</label>
            <select value={store.topic} onChange={(e) => store.setTopic(e.target.value)} className={selectClass} style={{ backgroundImage: selectBg }}>
              {Object.keys(metricsByTopic).map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="mb-3.5">
            <label className="text-[9px] uppercase tracking-wider text-[var(--color-text-3)] font-mono mb-1.5 block">Metric</label>
            <select value={store.metric} onChange={(e) => store.setMetric(e.target.value)} className={selectClass} style={{ backgroundImage: selectBg }}>
              {metrics.map((m) => <option key={m}>{m}</option>)}
            </select>
          </div>
          <div className="mb-3.5">
            <label className="text-[9px] uppercase tracking-wider text-[var(--color-text-3)] font-mono mb-1.5 block">Region</label>
            <select value={store.region} onChange={(e) => store.setRegion(e.target.value)} className={selectClass} style={{ backgroundImage: selectBg }}>
              {regions.map((r) => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="mb-3.5">
            <label className="text-[9px] uppercase tracking-wider text-[var(--color-text-3)] font-mono mb-1.5 block">Industry</label>
            <select value={store.industry} onChange={(e) => store.setIndustry(e.target.value)} className={selectClass} style={{ backgroundImage: selectBg }}>
              {industries.map((i) => <option key={i}>{i}</option>)}
            </select>
          </div>

          <div className="h-px bg-[var(--color-border)] my-3.5" />

          <div className="mb-3.5">
            <label className="text-[9px] uppercase tracking-wider text-[var(--color-text-3)] font-mono mb-1.5 block">Chart type</label>
            <div className="grid grid-cols-2 gap-[5px]">
              {chartTypeOptions.map((ct) => (
                <div
                  key={ct.type}
                  onClick={() => store.setChartType(ct.type)}
                  className={`bg-[var(--color-bg-input)] border rounded-[6px] py-2 px-1.5 text-center cursor-pointer transition-all text-[10px] font-[var(--font-sans)]
                    ${store.chartType === ct.type
                      ? 'border-[var(--color-brand)] text-[var(--color-brand)] bg-[var(--color-brand-dim)]'
                      : 'border-[var(--color-border)] text-[var(--color-text-3)] hover:border-[var(--color-border-hover)] hover:text-[var(--color-text-2)]'
                    }`}
                >
                  <span className="text-[15px] block mb-0.5">{ct.icon}</span>
                  {ct.label}
                </div>
              ))}
            </div>
          </div>

          <div className="pt-3.5 mt-3.5 border-t border-[var(--color-border)]">
            <div className="flex items-center justify-between">
              <span className="text-[11px] text-[var(--color-text-2)]">Export theme</span>
              <div className="flex gap-1">
                {['dark', 'light'].map((t) => (
                  <div
                    key={t}
                    onClick={() => store.setTheme(t)}
                    className={`w-6 h-6 rounded-[5px] cursor-pointer border flex items-center justify-center text-[10px] transition-all
                      ${t === 'dark' ? 'bg-[var(--color-bg-card)] text-[var(--color-text-2)]' : 'bg-[#E5E7EB] text-[#374151]'}
                      ${store.theme === t ? 'border-[var(--color-brand)] shadow-[0_0_0_1px_var(--color-brand)]' : 'border-[var(--color-border)]'}`}
                  >
                    {t === 'dark' ? '◐' : '◑'}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="h-px bg-[var(--color-border)] my-3.5" />
          <button className="w-full bg-[var(--color-brand)] text-white text-[13px] font-semibold py-2.5 rounded-[7px] border-none cursor-pointer hover:opacity-90 transition-opacity">
            Generate chart
          </button>
        </div>

        {/* Preview panel */}
        <div className={`border rounded-[10px] p-5 flex flex-col transition-all duration-300
          ${isDark ? 'bg-[var(--color-bg-card)] border-[var(--color-border)]' : 'bg-white border-[#E5E7EB]'}`}>
          <div className="flex items-center justify-between mb-[3px]">
            <span className={`text-sm font-semibold ${isDark ? '' : 'text-[#111827]'}`}>{store.metric}</span>
            <span className="text-[9px] font-mono text-[var(--color-accent-teal)] bg-[rgba(45,212,168,0.08)] px-[7px] py-0.5 rounded-[3px]">Preview</span>
          </div>
          <div className={`text-[11px] mb-3.5 ${isDark ? 'text-[var(--color-text-3)]' : 'text-[#6B7280]'}`}>
            {store.region} · {store.industry} · Q1 2026
          </div>
          <div className={`flex gap-3 mb-2.5 text-[10px] ${isDark ? 'text-[var(--color-text-2)]' : 'text-[#374151]'}`}>
            <span className="flex items-center gap-1">
              <span className="w-[7px] h-[7px] rounded-sm bg-[#E8463A]" /> Q1 2026
            </span>
            {q0 && store.chartType !== 'doughnut' && (
              <span className="flex items-center gap-1">
                <span className="w-[7px] h-[7px] rounded-sm bg-[rgba(232,70,58,0.25)]" /> Q4 2025
              </span>
            )}
          </div>

          <div className="flex-1 min-h-[280px] mb-3.5">
            <ChartPreview labels={labels} q1={q1} q0={q0} chartType={store.chartType} isDark={isDark} />
          </div>

          <ExportBar labels={labels} datasets={[q1, ...(q0 ? [q0] : [])]} metricSlug={store.metric.toLowerCase().replace(/\s+/g, '-')} />
          <EmailGate />
        </div>
      </div>
    </div>
  )
}
