import { useState, useEffect, useRef } from 'react'
import SearchBar from '../components/SearchBar'
import TopicCard from '../components/TopicCard'
import TrendingCard from '../components/TrendingCard'
import InsightBanner from '../components/InsightBanner'
import { attackTypes, trendingCharts } from '../lib/data'

function AnimatedCounter({ target, color }) {
  const [val, setVal] = useState(0)
  const ref = useRef()

  useEffect(() => {
    const start = performance.now()
    const duration = 1200
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(target * eased))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [target])

  return <div className="text-base font-bold font-mono" style={{ color }}>{val}</div>
}

export default function Home() {
  const [query, setQuery] = useState('')

  const filteredTopics = attackTypes.filter((t) => {
    if (!query) return true
    const searchText = `${t.name} ${t.description} ${t.slug}`.toLowerCase()
    return query.toLowerCase().split(/\s+/).some((w) => searchText.includes(w))
  })

  const filteredTrending = trendingCharts.filter((c) => {
    if (!query) return true
    const searchText = `${c.title} ${c.tag} ${c.sub} ${c.topic}`.toLowerCase()
    return query.toLowerCase().split(/\s+/).some((w) => searchText.includes(w))
  })

  const noResults = filteredTopics.length === 0 && filteredTrending.length === 0

  return (
    <div>
      {/* Hero */}
      <div className="bg-gradient-to-b from-[#0E1528] to-[var(--color-bg)] px-8 pt-10 pb-9 text-center border-b border-[var(--color-border)] relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(232,70,58,0.06)_0%,transparent_70%)] pointer-events-none" />
        <div className="inline-flex items-center gap-1.5 text-[10px] font-mono text-[var(--color-brand)] bg-[var(--color-brand-dim)] border border-[rgba(232,70,58,0.12)] rounded-full px-3 py-1 mb-3.5 uppercase tracking-wider">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--color-brand)] animate-pulse" />
          Brief Room · Threat Intelligence
        </div>
        <h1 className="text-2xl font-bold tracking-tight mb-1.5 leading-[1.3]">
          Cyber Threat Visuals for <span className="text-[var(--color-brand)]">Your Next Briefing</span>
        </h1>
        <p className="text-[13px] text-[var(--color-text-2)] mb-6">
          Search or browse presentation-ready charts. Export as image or PowerPoint slide.
        </p>
        <SearchBar onSearch={setQuery} />
      </div>

      {/* Stats bar */}
      <div className="flex justify-center gap-8 py-3.5 px-8 border-b border-[var(--color-border)] bg-white/[0.01]">
        <div className="text-center">
          <AnimatedCounter target={72} color="var(--color-brand)" />
          <div className="text-[9px] text-[var(--color-text-3)] uppercase tracking-wider mt-[1px]">Charts</div>
        </div>
        <div className="text-center">
          <AnimatedCounter target={6} />
          <div className="text-[9px] text-[var(--color-text-3)] uppercase tracking-wider mt-[1px]">Topics</div>
        </div>
        <div className="text-center">
          <AnimatedCounter target={14} />
          <div className="text-[9px] text-[var(--color-text-3)] uppercase tracking-wider mt-[1px]">Regions</div>
        </div>
        <div className="text-center">
          <AnimatedCounter target={8} />
          <div className="text-[9px] text-[var(--color-text-3)] uppercase tracking-wider mt-[1px]">Industries</div>
        </div>
        <div className="text-center">
          <div className="text-base font-bold font-mono text-[var(--color-accent-teal)]">Mar '26</div>
          <div className="text-[9px] text-[var(--color-text-3)] uppercase tracking-wider mt-[1px]">Last Update</div>
        </div>
      </div>

      {/* Freshness badge */}
      <div className="flex justify-center py-2 px-8 border-b border-[var(--color-border)]">
        <span className="inline-flex items-center gap-1.5 text-[9px] font-mono text-[var(--color-accent-teal)]">
          <span className="w-[5px] h-[5px] rounded-full bg-[var(--color-accent-teal)] animate-pulse" />
          Live · Last refreshed: Mar 24, 2026 09:41 UTC
        </span>
      </div>

      {/* Insight banner */}
      <InsightBanner />

      {/* Browse by topic */}
      <div className="p-7 pb-0">
        <div className="flex items-center justify-between mb-4">
          <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-2)] flex items-center gap-2">
            <span className="w-[3px] h-3.5 bg-[var(--color-brand)] rounded-sm" />
            Browse by topic
          </div>
          <div className="text-[10px] text-[var(--color-text-3)] font-mono">6 topics · Updated monthly</div>
        </div>
        {noResults ? (
          <div className="text-center py-10 text-[var(--color-text-3)] text-[13px]">No charts match your search. Try a different keyword.</div>
        ) : (
          <div className="grid grid-cols-3 gap-2.5 mb-6">
            {filteredTopics.map((t) => <TopicCard key={t.slug} topic={t} />)}
          </div>
        )}
      </div>

      {/* Trending */}
      {filteredTrending.length > 0 && (
        <div className="px-7 pb-7" id="trending-section">
          <div className="flex items-center justify-between mb-4">
            <div className="text-[13px] font-semibold uppercase tracking-wide text-[var(--color-text-2)] flex items-center gap-2">
              <span className="w-[3px] h-3.5 bg-[var(--color-brand)] rounded-sm" />
              Trending this month
            </div>
            <div className="text-[10px] text-[var(--color-text-3)] font-mono">Most downloaded charts · March 2026</div>
          </div>
          <div className="grid grid-cols-2 gap-2.5">
            {filteredTrending.map((c) => <TrendingCard key={c.id} chart={c} />)}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="px-7 py-4 border-t border-[var(--color-border)] flex items-center justify-between text-[10px] text-[var(--color-text-3)]">
        <span>Data from Brief Room Intelligence, MITRE, CISA, FBI IC3, Verizon DBIR, and open sources.</span>
        <span className="font-mono">Brief Room · MITRE · CISA · IC3 · DBIR</span>
      </div>
    </div>
  )
}
