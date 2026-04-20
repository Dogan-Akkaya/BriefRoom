import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, INDUSTRIES, ALL_REGIONS } from '../../lib/data'
import { labelToSlug, threatTypeLabel, INTELLIGENCE_LIBRARY } from '../../lib/intelligenceLibrary'
import SliceStatCard from './SliceStatCard'

const DIM_TABS = [
  { key: 'industry', label: 'Industry' },
  { key: 'region', label: 'Region' },
  { key: 'threat_type', label: 'Threat Type' },
]

const DESCS = {
  industry: 'Slice the intelligence library by the sector your business sits in.',
  region: 'Pick a geography to see how threats land there.',
  threat_type: 'Start from a threat — then cross by industry or region.',
}

export default function WizardScreen1() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('industry')

  const valuesFor = (tab) => {
    if (tab === 'industry') return INDUSTRIES.map(v => ({ slug: labelToSlug(v), label: v }))
    if (tab === 'region') return ALL_REGIONS.map(v => ({ slug: labelToSlug(v), label: v }))
    if (tab === 'threat_type') {
      return CATEGORIES.filter(c => c.hasData).map(c => ({ slug: c.id, label: c.label }))
    }
    return []
  }

  const go = (slug) => navigate(`/explore/${activeTab}/${slug}`)

  const values = valuesFor(activeTab)

  const allStats = useMemo(
    () => INTELLIGENCE_LIBRARY.filter(i => i.type === 'stat'),
    []
  )

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '56px 24px 80px' }}>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.14em',
          color: 'rgba(255,69,98,0.65)', textTransform: 'uppercase',
          marginBottom: 14, display: 'flex', alignItems: 'center',
          justifyContent: 'center', gap: 8,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4562', boxShadow: '0 0 8px rgba(255,69,98,0.5)' }} />
          Custom Builder — Step 1 of 2
        </div>
        <h1 style={{
          fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(28px,4.2vw,44px)',
          fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 14,
          lineHeight: 1.1, color: '#fff', textShadow: '0 2px 30px rgba(10,14,26,0.8)',
        }}>
          Start with a <span style={{ background: 'linear-gradient(135deg,#FF4562,#F97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>dimension</span>
        </h1>
        <p style={{ fontSize: 15, color: 'rgba(232,236,241,0.5)', fontWeight: 300, maxWidth: 540, margin: '0 auto', lineHeight: 1.7 }}>
          {DESCS[activeTab]}
        </p>
      </div>

      {/* Tabs */}
      <div role="tablist" aria-label="Dimension" style={{
        display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 28,
        padding: 4, borderRadius: 14,
        background: 'rgba(255,255,255,0.03)',
        border: '1px solid rgba(255,255,255,0.06)',
        width: 'fit-content', margin: '0 auto 28px',
      }}>
        {DIM_TABS.map(tab => {
          const active = tab.key === activeTab
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '10px 22px', borderRadius: 10, cursor: 'pointer',
                border: 'none',
                background: active ? 'rgba(255,69,98,0.12)' : 'transparent',
                color: active ? '#FF4562' : 'rgba(232,236,241,0.55)',
                fontFamily: "'Plus Jakarta Sans'",
                fontSize: 13, fontWeight: 600, letterSpacing: '0.01em',
                transition: 'all 0.2s',
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Value grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 12,
      }}>
        {values.map(v => (
          <button
            key={v.slug}
            onClick={() => go(v.slug)}
            style={{
              textAlign: 'left',
              padding: '18px 18px',
              borderRadius: 14,
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(16px)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: '#fff',
              fontFamily: "'Plus Jakarta Sans'",
              fontSize: 15, fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = 'rgba(255,69,98,0.08)'
              e.currentTarget.style.borderColor = 'rgba(255,69,98,0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = 'rgba(255,255,255,0.03)'
              e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            <span>{activeTab === 'threat_type' ? threatTypeLabel(v.slug) : v.label}</span>
            <span style={{ color: 'rgba(232,236,241,0.6)', fontSize: 18 }}>→</span>
          </button>
        ))}
      </div>

      <p style={{
        marginTop: 40, textAlign: 'center',
        fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em',
        color: 'rgba(232,236,241,0.55)', textTransform: 'uppercase',
      }}>
        Step 2 adds a crossing dimension and the slice view
      </p>

      {/* Stats across the whole library — narrows as the user slices */}
      <section style={{ marginTop: 64 }}>
        <div style={{
          display: 'flex', alignItems: 'baseline', justifyContent: 'space-between',
          marginBottom: 14, gap: 16, flexWrap: 'wrap',
        }}>
          <div>
            <div style={{
              fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em',
              color: 'rgba(232,236,241,0.4)', textTransform: 'uppercase', marginBottom: 6,
            }}>
              Across the library
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans'", fontSize: 22, fontWeight: 700,
              letterSpacing: '-0.02em', color: '#fff',
            }}>
              Intelligence at a glance
            </h2>
          </div>
          <div style={{
            fontFamily: "'JetBrains Mono'", fontSize: 11,
            color: 'rgba(232,236,241,0.4)',
          }}>
            {allStats.length} stats · unsliced
          </div>
        </div>
        <div className="slice-grid">
          {allStats.map(s => <SliceStatCard key={s.id} item={s} />)}
        </div>
      </section>
    </div>
  )
}
