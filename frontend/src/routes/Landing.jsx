import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SmokeHero from '../components/SmokeHero'
import FlickerText from '../components/FlickerText'
import Reveal from '../components/Reveal'
import AnimNum from '../components/AnimNum'
import PopularChartCard from '../components/PopularChartCard'
import CategoryPicker from '../components/CategoryPicker'
import ReportCard from '../components/ReportCard'
import SearchPanel from '../components/SearchPanel'
import ChartPreviewModal from '../components/ChartPreviewModal'
import SourceMarquee from '../components/SourceMarquee'
import { popularCharts, globalReports, threatTypeLabel } from '../lib/intelligenceLibrary'
import { heroStats } from '../lib/stats'

// Adapter: Intelligence Library item → PopularChartCard props (mirrors /popular)
function toCardProps(item) {
  const series = item.dataset?.series || []
  const first = series[0] || {}
  const tt = item.threat_type?.[0]
  const d = item.display || {}
  return {
    title: item.title,
    views: d.views || '—',
    tag: (threatTypeLabel(tt) || 'INTEL').toUpperCase(),
    trend: d.trend || '',
    up: d.up !== undefined ? d.up : null,
    color: first.color || '#FF4562',
    data: first.values || [],
    sources: item.source,
    updated: item.updated_at ? item.updated_at.slice(0, 7) : '',
    detail: d.detail || '',
    metrics: d.metrics || [],
    categoryId: tt,
  }
}

export default function Landing() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [hoveredChart, setHoveredChart] = useState(null)
  const [previewChart, setPreviewChart] = useState(null)
  const [previewType, setPreviewType] = useState(null)

  useEffect(() => { document.title = 'Brief Room — Threat Intelligence Charts for CISOs | SOCRadar'; setTimeout(() => setLoaded(true), 150) }, [])

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <SmokeHero />
        {/* Frosted glass panel behind hero text */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(1000px,92vw)', height: 620, background: 'rgba(10,14,26,0.45)', backdropFilter: 'blur(40px)', WebkitBackdropFilter: 'blur(40px)', borderRadius: 36, border: '1px solid rgba(255,255,255,0.04)', zIndex: 1, pointerEvents: 'none', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(14px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.14em', color: '#FF4562', marginBottom: 28, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textShadow: '0 0 20px rgba(255,69,98,0.4)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4562', display: 'inline-block', animation: 'gentlePulse 2.5s ease-in-out infinite', boxShadow: '0 0 8px rgba(255,69,98,0.6)' }} />
              Cyber Intelligence for CISOs & Security Leaders
            </div>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(38px,6.5vw,74px)', fontWeight: 800, lineHeight: 1.05, maxWidth: 920, margin: '0 auto 28px', letterSpacing: '-0.035em', color: '#FFFFFF', textShadow: '0 2px 30px rgba(10,14,26,0.8)', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(28px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s' }}>
            <FlickerText delay={600}>
              <span style={{ color: '#FFFFFF' }}>Stop Googling for stats.</span><br />
              <span style={{ background: 'linear-gradient(135deg,#FF4562 0%,#F97316 50%,#FF4562 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Start presenting them.</span>
            </FlickerText>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(232,236,241,0.6)', maxWidth: 580, margin: '0 auto 16px', fontWeight: 400, opacity: loaded ? 1 : 0, transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s', textShadow: '0 2px 20px rgba(10,14,26,0.9)' }}>
            Explore ransomware, phishing, and dark web threat data through ready-made charts. Tailored for industry and region for security reporting.
          </p>
          <p style={{ fontSize: 12, color: 'rgba(232,236,241,0.5)', fontFamily: "'JetBrains Mono'", letterSpacing: '0.06em', margin: '0 auto 36px', opacity: loaded ? 1 : 0, transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.6s' }}>
            Free &bull; PNG export
          </p>

          {/* Search */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(14px) scale(0.99)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.65s', width: '100%' }}>
            <SearchPanel />
            <div style={{ marginTop: 28, display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap', maxWidth: 720, margin: '28px auto 0', paddingBottom: 40 }}>
              <div
                onClick={() => document.getElementById('popular-section')?.scrollIntoView({ behavior: 'smooth' })}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(255,69,98,0.3)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,69,98,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,69,98,0.18)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,69,98,0.08)' }}
                style={{ cursor: 'pointer', textAlign: 'center', flex: '1 1 180px', padding: '20px 16px', borderRadius: 14, border: '1px solid rgba(255,69,98,0.18)', background: 'rgba(255,69,98,0.06)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 20px rgba(255,69,98,0.08)' }}
              >
                <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 14, fontWeight: 600, color: '#E8ECF1', marginBottom: 4 }}>Popular Charts</div>
                <div style={{ fontSize: 12, color: 'rgba(232,236,241,0.45)', lineHeight: 1.5 }}>Recently created & suggested charts from SOCRadar</div>
              </div>
              <div
                onClick={() => navigate('/reports')}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.3)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(59,130,246,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(59,130,246,0.18)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(59,130,246,0.08)' }}
                style={{ cursor: 'pointer', textAlign: 'center', flex: '1 1 180px', padding: '20px 16px', borderRadius: 14, border: '1px solid rgba(59,130,246,0.18)', background: 'rgba(59,130,246,0.06)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 20px rgba(59,130,246,0.08)' }}
              >
                <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 14, fontWeight: 600, color: '#E8ECF1', marginBottom: 4 }}>Global Reports</div>
                <div style={{ fontSize: 12, color: 'rgba(232,236,241,0.45)', lineHeight: 1.5 }}>Charts from recently released trusted sources</div>
              </div>
              <div
                onClick={() => navigate('/builder')}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.borderColor = 'rgba(255,69,98,0.3)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(255,69,98,0.12)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.borderColor = 'rgba(255,69,98,0.18)'; e.currentTarget.style.boxShadow = '0 0 20px rgba(255,69,98,0.08)' }}
                style={{ cursor: 'pointer', textAlign: 'center', flex: '1 1 180px', padding: '20px 16px', borderRadius: 14, border: '1px solid rgba(255,69,98,0.18)', background: 'rgba(255,69,98,0.06)', transition: 'all 0.3s cubic-bezier(0.16,1,0.3,1)', boxShadow: '0 0 20px rgba(255,69,98,0.08)' }}
              >
                <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 14, fontWeight: 600, color: '#E8ECF1', marginBottom: 4 }}>Custom Builder</div>
                <div style={{ fontSize: 12, color: 'rgba(232,236,241,0.45)', lineHeight: 1.5 }}>Build your own charts with full control over data & filters</div>
              </div>
            </div>

            {/* STATS — moved up: lives directly below the 3-card row, inside the hero */}
            <div style={{ maxWidth: 900, margin: '32px auto 0', padding: '0 16px' }}>
              <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,69,98,0.1),transparent)', marginBottom: 20 }} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(130px,1fr))', gap: 8, textAlign: 'center' }}>
                {heroStats.map((s, i) => (
                  <Reveal key={i} delay={i * 70}>
                    <div style={{ padding: '10px 6px' }}>
                      <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 30, fontWeight: 700, color: '#FF4562', lineHeight: 1, marginBottom: 4, letterSpacing: '-0.02em' }}>
                        <AnimNum end={s.n} />{s.s}
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 9, letterSpacing: '0.1em', color: 'rgba(232,236,241,0.6)', textTransform: 'uppercase' }}>{s.l}</div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* OPEN DATA — INDEXED — sits directly below the hero so the first
          thing the user sees off the search bar is what we actually have:
          vendor identity + scale. Logos as social proof. */}
      <section id="sources-section" style={{ position: 'relative', zIndex: 1, padding: '72px 24px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 28, maxWidth: 760, marginLeft: 'auto', marginRight: 'auto' }}>
            <div style={{
              fontFamily: "'JetBrains Mono'", fontSize: 11,
              letterSpacing: '0.14em', textTransform: 'uppercase',
              color: 'rgba(96,165,250,0.85)', marginBottom: 14,
            }}>
              <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>&nbsp;&nbsp;Open data — indexed
            </div>
            <h2 style={{
              fontFamily: "'Plus Jakarta Sans'",
              fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600,
              lineHeight: 1.15, color: '#E8ECF1',
              marginBottom: 14, letterSpacing: '-0.02em',
            }}>Every public threat report. One catalog.</h2>
            <p style={{
              fontSize: 15, lineHeight: 1.7,
              color: 'rgba(232,236,241,0.62)', fontWeight: 300,
            }}>
              We pull open threat-intel from 46 vendors &mdash; government agencies, intel firms, IR teams, insurers &mdash; so you don&rsquo;t have to chase 43 PDFs. Every finding cited, every source attributed.
            </p>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <SourceMarquee />
        </Reveal>

        <Reveal delay={200}>
          <div style={{
            display: 'flex', flexWrap: 'wrap', gap: 24,
            justifyContent: 'center', alignItems: 'center',
            marginTop: 30, padding: '0 16px',
          }}>
            {heroStats.map((s, i) => (
              <div key={i} style={{
                display: 'inline-flex', alignItems: 'baseline', gap: 8,
                padding: '8px 16px',
                borderRadius: 10,
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
              }}>
                <span style={{
                  fontFamily: "'Plus Jakarta Sans'",
                  fontSize: 22, fontWeight: 700,
                  color: '#E8ECF1', lineHeight: 1, letterSpacing: '-0.02em',
                }}>{s.n.toLocaleString()}{s.s}</span>
                <span style={{
                  fontFamily: "'JetBrains Mono'", fontSize: 10,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  color: 'rgba(232,236,241,0.55)',
                }}>{s.l}</span>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={280}>
          <div style={{ textAlign: 'center', marginTop: 26 }}>
            <button
              onClick={() => navigate('/reports')}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.55)'
                e.currentTarget.style.background = 'rgba(59,130,246,0.16)'
                e.currentTarget.style.transform = 'translateY(-2px)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(59,130,246,0.32)'
                e.currentTarget.style.background = 'rgba(59,130,246,0.08)'
                e.currentTarget.style.transform = 'translateY(0)'
              }}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '11px 22px',
                fontFamily: "'Satoshi','DM Sans',sans-serif",
                fontSize: 13, fontWeight: 600,
                color: '#60A5FA',
                background: 'rgba(59,130,246,0.08)',
                border: '1px solid rgba(59,130,246,0.32)',
                borderRadius: 12, cursor: 'pointer',
                transition: 'all 0.25s cubic-bezier(0.16,1,0.3,1)',
              }}
            >
              Browse all reports &rarr;
            </button>
          </div>
        </Reveal>
      </section>

      {/* POPULAR CHARTS */}
      <section id="popular-section" style={{ position: 'relative', zIndex: 1, padding: '80px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 44 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,69,98,0.85)', marginBottom: 14 }}>
                <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>&nbsp;&nbsp;Popular Charts
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, lineHeight: 1.15, color: '#E8ECF1', marginBottom: 14, letterSpacing: '-0.02em' }}>What other CISOs are looking at</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(232,236,241,0.62)', fontWeight: 300, maxWidth: 600 }}>Explore ransomware, phishing, and dark web threat data through ready-made charts. Tailored for industry and region for security reporting.</p>
            </div>
            <button onClick={() => navigate('/popular')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: 'transparent', color: 'rgba(232,236,241,0.55)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, cursor: 'pointer' }}>
              Browse all featured →
            </button>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 18 }}>
          {popularCharts().slice(0, 6).map(toCardProps).map((c, i) => (
            <Reveal key={i} delay={i * 70}>
              <PopularChartCard
                {...c}
                isHovered={hoveredChart === i}
                onHover={() => setHoveredChart(i)}
                onLeave={() => setHoveredChart(null)}
                onClick={() => { setPreviewChart(c); setPreviewType('popular') }}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* MID CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '48px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div
            onClick={() => navigate('/builder')}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.25)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 16px 48px rgba(0,0,0,0.3), 0 0 30px rgba(59,130,246,0.06)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(59,130,246,0.12)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
            style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.06) 0%,rgba(255,69,98,0.04) 100%)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 20, padding: '40px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24, cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.16,1,0.3,1)' }}
          >
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em', color: 'rgba(59,130,246,0.6)', textTransform: 'uppercase', marginBottom: 10 }}>Create Your Own</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 26, fontWeight: 600, lineHeight: 1.15, color: '#E8ECF1', marginBottom: 14, letterSpacing: '-0.02em' }}>Know what matters? <span style={{ color: '#60A5FA' }}>Build your chart</span></h3>
              <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.4)', lineHeight: 1.6 }}>Choose your threat category, customize every element, and export board-ready visuals in seconds.</p>
            </div>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 14, fontWeight: 600, border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, background: 'rgba(59,130,246,0.12)', color: '#60A5FA' }}>
              Start Building →
            </span>
          </div>
        </Reveal>
      </section>

      {/* GLOBAL THREAT REPORTS PREVIEW */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 36 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(59,130,246,0.6)', marginBottom: 14 }}>
                <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>&nbsp;&nbsp;Global Reports
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, lineHeight: 1.15, color: '#E8ECF1', marginBottom: 14, letterSpacing: '-0.02em' }}>From the reports CISOs trust most</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(232,236,241,0.62)', fontWeight: 300, maxWidth: 500 }}>Key charts from IBM, CrowdStrike, Verizon DBIR, Mandiant and more. External sources, ready to present.</p>
            </div>
            <button onClick={() => navigate('/reports')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: 'transparent', color: 'rgba(232,236,241,0.55)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, cursor: 'pointer' }}>
              Browse All Reports →
            </button>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 16 }}>
          {globalReports().slice(0, 3).map((r, i) => (
            <Reveal key={r.id} delay={i * 70}>
              <ReportCard
                report={r}
                onClick={() => {
                  const rid = r.report_meta?.report_id
                  if (rid) navigate(`/reports/${rid}`)
                  else { setPreviewChart(r); setPreviewType('report') }
                }}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* CATEGORY PICKER */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 24px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,69,98,0.85)', textTransform: 'uppercase', marginBottom: 14 }}>
              <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>&nbsp;&nbsp;Custom Builder
            </div>
            <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, lineHeight: 1.15, color: '#E8ECF1', letterSpacing: '-0.02em' }}>Or pick a category to build your own</h2>
          </div>
        </Reveal>
        <CategoryPicker onSelect={(cat) => navigate(`/builder/${cat.id}`)} />
      </section>

      {/* FINAL CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px 120px', textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
        <Reveal>
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,69,98,0.85)', marginBottom: 14 }}>Completely free</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, lineHeight: 1.15, color: '#E8ECF1', marginBottom: 14, letterSpacing: '-0.02em' }}>
            Instant charts for<br /><span style={{ color: '#FF4562' }}>smarter security decisions</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(232,236,241,0.62)', fontWeight: 300, maxWidth: 500, margin: '0 auto 36px', textAlign: 'center' }}>Explore threat data through ready-made charts or build your own. Tailored for your industry and region.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => document.getElementById('popular-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 12, cursor: 'pointer', background: '#FF4562', color: '#fff' }}>Browse Popular Charts</button>
            <button onClick={() => navigate('/builder')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 14, fontWeight: 600, border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, cursor: 'pointer', background: 'rgba(59,130,246,0.12)', color: '#60A5FA' }}>Create Custom Chart</button>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '20px 28px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'rgba(232,236,241,0.45)' }}>© 2026 SOCRadar Brief Room</span>
      </footer>

      {previewChart && (
        <ChartPreviewModal
          chart={previewChart}
          type={previewType}
          onClose={() => setPreviewChart(null)}
          onCustomize={() => { setPreviewChart(null); navigate(`/builder/${previewChart.categoryId}`) }}
        />
      )}
    </div>
  )
}
