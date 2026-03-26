import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SmokeHero from '../components/SmokeHero'
import FlickerText from '../components/FlickerText'
import Reveal from '../components/Reveal'
import AnimNum from '../components/AnimNum'
import Spark from '../components/Spark'
import PopularChartCard from '../components/PopularChartCard'
import CategoryPicker from '../components/CategoryPicker'
import { POPULAR, SEARCH_SUGGESTIONS } from '../lib/data'

export default function Landing() {
  const navigate = useNavigate()
  const [loaded, setLoaded] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [searchFocused, setSearchFocused] = useState(false)
  const [hoveredChart, setHoveredChart] = useState(null)

  useEffect(() => { setTimeout(() => setLoaded(true), 150) }, [])

  const filtered = SEARCH_SUGGESTIONS.filter(s => !searchVal || s.text.toLowerCase().includes(searchVal.toLowerCase()))

  return (
    <div>
      {/* HERO */}
      <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '120px 24px 80px', textAlign: 'center', overflow: 'hidden' }}>
        <SmokeHero />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 'min(800px,90vw)', height: 420, background: 'radial-gradient(ellipse at center,rgba(10,14,26,0.7) 0%,rgba(10,14,26,0.3) 50%,transparent 75%)', filter: 'blur(40px)', zIndex: 1, pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 2, width: '100%' }}>
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(14px)', transition: 'all 0.6s cubic-bezier(0.16,1,0.3,1) 0.2s' }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.14em', color: '#FF4562', marginBottom: 28, textTransform: 'uppercase', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, textShadow: '0 0 20px rgba(255,69,98,0.4)' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF4562', display: 'inline-block', animation: 'gentlePulse 2.5s ease-in-out infinite', boxShadow: '0 0 8px rgba(255,69,98,0.6)' }} />
              Cybersecurity Intelligence for Leadership
            </div>
          </div>
          <h1 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(38px,6.5vw,74px)', fontWeight: 800, lineHeight: 1.05, maxWidth: 740, margin: '0 auto 28px', letterSpacing: '-0.035em', color: '#FFFFFF', textShadow: '0 2px 30px rgba(10,14,26,0.8)', opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(28px)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.35s' }}>
            <FlickerText delay={600}>
              <span style={{ color: '#FFFFFF' }}>The charts your</span><br />
              <span style={{ background: 'linear-gradient(135deg,#FF4562 0%,#F97316 50%,#FF4562 100%)', backgroundSize: '200% auto', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>board needs to see</span>
            </FlickerText>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.7, color: 'rgba(232,236,241,0.6)', maxWidth: 480, margin: '0 auto 44px', fontWeight: 400, opacity: loaded ? 1 : 0, transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.5s', textShadow: '0 2px 20px rgba(10,14,26,0.9)' }}>
            Browse popular charts or create custom visualizations for your exact threat landscape. Completely free.
          </p>

          {/* Search */}
          <div style={{ opacity: loaded ? 1 : 0, transform: loaded ? 'none' : 'translateY(14px) scale(0.99)', transition: 'all 0.8s cubic-bezier(0.16,1,0.3,1) 0.65s', width: '100%' }}>
            <div style={{ position: 'relative', maxWidth: 600, width: '100%', margin: '0 auto' }}>
              <svg style={{ position: 'absolute', left: 18, top: 19, zIndex: 2, opacity: searchFocused ? 0.75 : 0.25, transition: 'opacity 0.3s' }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={searchFocused ? '#FF4562' : '#E8ECF1'} strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <input
                style={{ width: '100%', padding: '18px 22px 18px 50px', fontSize: 15, fontFamily: "'Satoshi','DM Sans',sans-serif", fontWeight: 400, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, color: '#E8ECF1', outline: 'none', transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)', backdropFilter: 'blur(12px)', ...(searchFocused ? { background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,69,98,0.35)', boxShadow: '0 0 0 3px rgba(255,69,98,0.06),0 16px 48px rgba(0,0,0,0.3)' } : {}) }}
                placeholder="Search charts — 'ransomware healthcare', 'MTTD finance'..."
                value={searchVal}
                onChange={e => setSearchVal(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
              />
              {searchFocused && (
                <div style={{ position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0, background: 'rgba(14,18,32,0.97)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', backdropFilter: 'blur(24px)', zIndex: 50, boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }}>
                  <div style={{ padding: '10px 18px 6px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(232,236,241,0.18)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Popular searches</span>
                  </div>
                  {filtered.map((s, i) => (
                    <div key={i} style={{ padding: '13px 18px', fontSize: 14, color: 'rgba(232,236,241,0.5)', cursor: 'pointer', transition: 'all 0.2s', borderBottom: '1px solid rgba(255,255,255,0.03)', display: 'flex', justifyContent: 'space-between', animation: `slideIn 0.25s cubic-bezier(0.16,1,0.3,1) ${i * 35}ms both` }} onMouseDown={() => setSearchVal(s.text)}>
                      <span>{s.text}</span>
                      <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, color: 'rgba(255,69,98,0.3)' }}>{s.cat}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div style={{ marginTop: 24, display: 'flex', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              <button onClick={() => document.getElementById('popular-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 13, fontWeight: 600, border: 'none', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s', background: '#FF4562', color: '#fff' }}>
                Popular Charts
              </button>
              <button onClick={() => navigate('/builder')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 28px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 13, fontWeight: 600, border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, cursor: 'pointer', transition: 'all 0.3s', background: 'rgba(59,130,246,0.12)', color: '#60A5FA' }}>
                Create Custom Chart
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR CHARTS */}
      <section id="popular-section" style={{ position: 'relative', zIndex: 1, padding: '80px 24px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: 16, marginBottom: 44 }}>
            <div>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,69,98,0.55)', marginBottom: 14 }}>
                <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>&nbsp;&nbsp;Popular Charts
              </div>
              <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, lineHeight: 1.15, color: '#E8ECF1', marginBottom: 14, letterSpacing: '-0.02em' }}>What CISOs are looking at</h2>
              <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(232,236,241,0.38)', fontWeight: 300, maxWidth: 500 }}>Ready-made, board-ready. Click any chart to explore, export, or embed.</p>
            </div>
            <button style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 18px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 12, fontWeight: 600, background: 'transparent', color: 'rgba(232,236,241,0.55)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, cursor: 'pointer' }}>
              Browse All 180+ →
            </button>
          </div>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 18 }}>
          {POPULAR.map((c, i) => (
            <Reveal key={i} delay={i * 70}>
              <PopularChartCard
                chart={c}
                isHovered={hoveredChart === i}
                onHover={() => setHoveredChart(i)}
                onLeave={() => setHoveredChart(null)}
                onClick={() => navigate('/builder/ransomware')}
              />
            </Reveal>
          ))}
        </div>
      </section>

      {/* MID CTA */}
      <section style={{ position: 'relative', zIndex: 1, padding: '48px 24px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.06) 0%,rgba(255,69,98,0.04) 100%)', border: '1px solid rgba(59,130,246,0.12)', borderRadius: 20, padding: '40px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 24 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.12em', color: 'rgba(59,130,246,0.6)', textTransform: 'uppercase', marginBottom: 10 }}>Create Your Own</div>
              <h3 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 26, fontWeight: 600, lineHeight: 1.15, color: '#E8ECF1', marginBottom: 14, letterSpacing: '-0.02em' }}>Build the chart <span style={{ color: '#60A5FA' }}>your board</span> is asking for</h3>
              <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.4)', lineHeight: 1.6 }}>Choose your threat category, customize every element, and export board-ready visuals in seconds.</p>
            </div>
            <button onClick={() => navigate('/builder')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '14px 28px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 14, fontWeight: 600, border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, cursor: 'pointer', background: 'rgba(59,130,246,0.12)', color: '#60A5FA' }}>
              Start Building →
            </button>
          </div>
        </Reveal>
      </section>

      {/* STATS */}
      <section style={{ position: 'relative', zIndex: 1, padding: '60px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,69,98,0.1),transparent)', marginBottom: 56 }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: 12, textAlign: 'center' }}>
          {[{ n: 2400, s: '+', l: 'CISOs using Brief Room' }, { n: 47, s: '', l: 'Countries covered' }, { n: 180, s: '+', l: 'Ready-made charts' }, { n: 12, s: 's', l: 'Avg. time to first chart' }].map((s, i) => (
            <Reveal key={i} delay={i * 70}>
              <div style={{ padding: '28px 8px' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 42, fontWeight: 700, color: '#FF4562', lineHeight: 1, marginBottom: 6, letterSpacing: '-0.02em' }}>
                  <AnimNum end={s.n} />{s.s}
                </div>
                <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 10, letterSpacing: '0.1em', color: 'rgba(232,236,241,0.25)', textTransform: 'uppercase' }}>{s.l}</div>
              </div>
            </Reveal>
          ))}
        </div>
        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,rgba(255,69,98,0.1),transparent)', marginTop: 56 }} />
      </section>

      {/* CATEGORY PICKER */}
      <section style={{ position: 'relative', zIndex: 1, padding: '40px 24px 60px', maxWidth: 1100, margin: '0 auto' }}>
        <Reveal>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.12em', color: 'rgba(255,69,98,0.55)', textTransform: 'uppercase', marginBottom: 14 }}>
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
          <div style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'rgba(255,69,98,0.55)', marginBottom: 14 }}>Completely free</div>
          <h2 style={{ fontFamily: "'Plus Jakarta Sans'", fontSize: 'clamp(26px,3.5vw,40px)', fontWeight: 600, lineHeight: 1.15, color: '#E8ECF1', marginBottom: 14, letterSpacing: '-0.02em' }}>
            Stop Googling for stats.<br /><span style={{ color: '#FF4562' }}>Start presenting them.</span>
          </h2>
          <p style={{ fontSize: 15, lineHeight: 1.7, color: 'rgba(232,236,241,0.38)', fontWeight: 300, maxWidth: 500, margin: '0 auto 36px', textAlign: 'center' }}>Browse popular charts or create custom visualizations tailored to your threat landscape.</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => document.getElementById('popular-section')?.scrollIntoView({ behavior: 'smooth' })} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 14, fontWeight: 600, border: 'none', borderRadius: 12, cursor: 'pointer', background: '#FF4562', color: '#fff' }}>Browse Popular Charts</button>
            <button onClick={() => navigate('/builder')} style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '13px 26px', fontFamily: "'Satoshi','DM Sans',sans-serif", fontSize: 14, fontWeight: 600, border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12, cursor: 'pointer', background: 'rgba(59,130,246,0.12)', color: '#60A5FA' }}>Create Custom Chart</button>
          </div>
        </Reveal>
      </section>

      {/* FOOTER */}
      <footer style={{ position: 'relative', zIndex: 1, padding: '20px 28px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.03)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 28 28"><circle cx="14" cy="14" r="12" fill="none" stroke="#FF4562" strokeWidth="1.2" opacity="0.3" /><circle cx="14" cy="14" r="4.5" fill="#FF4562" opacity="0.4" /></svg>
          <span style={{ fontFamily: "'JetBrains Mono'", fontSize: 11, color: 'rgba(232,236,241,0.18)' }}>© 2026 SOCRadar Brief Room</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['Privacy', 'Terms', 'API', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: 11, color: 'rgba(232,236,241,0.38)', cursor: 'pointer', fontWeight: 500 }}>{l}</span>
          ))}
        </div>
      </footer>
    </div>
  )
}
