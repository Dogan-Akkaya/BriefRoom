import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const cardStyle = {
  background: 'rgba(255,255,255,0.03)',
  border: '1px solid rgba(255,255,255,0.06)',
  borderRadius: 16,
  padding: '28px 24px',
  backdropFilter: 'blur(12px)',
  marginBottom: 20,
}

const sectionTitle = {
  fontFamily: "'Plus Jakarta Sans', sans-serif",
  fontSize: 20,
  fontWeight: 700,
  color: '#E8ECF1',
  marginBottom: 14,
  letterSpacing: '-0.02em',
}

const listStyle = {
  margin: 0,
  padding: '0 0 0 20px',
  lineHeight: 2,
  fontSize: 14,
  color: 'rgba(232,236,241,0.55)',
}

const labelStyle = {
  fontFamily: "'JetBrains Mono', monospace",
  fontSize: 11,
  letterSpacing: '0.08em',
  color: 'rgba(255,69,98,0.5)',
  textTransform: 'uppercase',
  marginBottom: 10,
  display: 'block',
}

export default function Methodology() {
  const navigate = useNavigate()
  useEffect(() => { document.title = 'Data Sources & Methodology — Threat Intelligence | Brief Room' }, [])

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#E8ECF1' }}>
      <div style={{ paddingTop: 80, maxWidth: 780, margin: '0 auto', padding: '80px 24px 80px' }}>

        {/* Back */}
        <div
          onClick={() => navigate('/')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            cursor: 'pointer',
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 12,
            color: 'rgba(232,236,241,0.4)',
            marginBottom: 40,
            transition: 'color 0.2s',
          }}
          onMouseEnter={e => (e.currentTarget.style.color = '#FF4562')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(232,236,241,0.4)')}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back to Home
        </div>

        {/* Title */}
        <div style={{ marginBottom: 48 }}>
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            color: 'rgba(255,69,98,0.55)',
            marginBottom: 14,
          }}>
            <span style={{ animation: 'gentlePulse 2.5s ease-in-out infinite', display: 'inline-block' }}>●</span>
            &nbsp;&nbsp;Transparency
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(32px,5vw,48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            marginBottom: 16,
          }}>
            Methodology & Data Sources
          </h1>
          <p style={{
            fontSize: 16,
            lineHeight: 1.7,
            color: 'rgba(232,236,241,0.45)',
            maxWidth: 560,
          }}>
            Brief Room v1 mirrors authoritative cybersecurity reports from 42 vendors and agencies. Every card on Global Reports is traceable to the original PDF — here's how we collect, curate, and present that intelligence.
          </p>
        </div>

        {/* Data Collection */}
        <div style={cardStyle}>
          <span style={labelStyle}>01</span>
          <h2 style={sectionTitle}>Data Collection</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            v1 mirrors <strong style={{ color: '#E8ECF1' }}>42 vendor reports</strong> across the cybersecurity industry, with <strong style={{ color: '#E8ECF1' }}>1,100+ extracted findings</strong> — headline stats, charts, and analyst quotes. Each finding is tagged with industry, region, and threat type, and links back to the source PDF or landing page. Reports are pulled in as their publishers release them; we don't synthesize numbers.
          </p>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            Current report sources include:
          </p>
          <ul style={listStyle}>
            <li><strong style={{ color: '#FF4562' }}>Annual flagships</strong> -- Verizon DBIR, Mandiant M-Trends, IBM X-Force, CrowdStrike Global Threat Report, Microsoft Digital Defense Report</li>
            <li><strong style={{ color: '#FF4562' }}>Ransomware-focused</strong> -- Sophos State of Ransomware, Coveware Quarterly, Zscaler ThreatLabz, Huntress, Rapid7</li>
            <li><strong style={{ color: '#FF4562' }}>Identity &amp; phishing</strong> -- Proofpoint, KnowBe4, Hoxhunt, Okta, Constella Intelligence</li>
            <li><strong style={{ color: '#FF4562' }}>Supply chain &amp; OSS</strong> -- Sonatype, Black Duck, SecurityScorecard, Cisco Talos</li>
            <li><strong style={{ color: '#FF4562' }}>Government &amp; standards</strong> -- CISA, FBI IC3, NCSC (UK), ENISA, World Economic Forum</li>
            <li><strong style={{ color: '#FF4562' }}>SOCRadar Annual Dark Web Report</strong> -- dark-web exposure + leak-site activity</li>
          </ul>
          <p style={{ fontSize: 12, color: 'rgba(232,236,241,0.4)', lineHeight: 1.7, marginTop: 14, fontStyle: 'italic' }}>
            Plus 16 more from Bitdefender, Censys, Check Point, Cloudflare, Coalition, CYFIRMA, ESET, F5 Labs, Fortinet, FS-ISAC, KELA, PwC, Red Canary, Trellix, Palo Alto Unit 42, and others.
          </p>
        </div>

        {/* Update Cadence */}
        <div style={cardStyle}>
          <span style={labelStyle}>02</span>
          <h2 style={sectionTitle}>Update Cadence</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            Vendor reports drop on their own clocks. We add new editions as they publish:
          </p>
          <ul style={listStyle}>
            <li><strong style={{ color: '#3B82F6' }}>Annual flagships</strong> -- DBIR, M-Trends, X-Force land once per year; we re-ingest within ~2 weeks of public release</li>
            <li><strong style={{ color: '#3B82F6' }}>Quarterly trackers</strong> -- Coveware Q-reports, Cloudflare DDoS quarterly, Trellix monthly — same release-week cadence</li>
            <li><strong style={{ color: '#3B82F6' }}>Ad-hoc</strong> -- one-off APT profiles, breach reports, and government year-in-review pieces as they appear</li>
            <li><strong style={{ color: '#3B82F6' }}>Re-extraction</strong> -- existing reports get re-extracted when we improve the ingestion pipeline (rare, transparent in the cards)</li>
          </ul>
        </div>

        {/* Data Quality */}
        <div style={cardStyle}>
          <span style={labelStyle}>03</span>
          <h2 style={sectionTitle}>Data Quality</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            We optimise for trust over volume:
          </p>
          <ul style={listStyle}>
            <li><strong style={{ color: '#10B981' }}>Source attribution</strong> -- every card carries the vendor's brand chip and a direct link to the original report</li>
            <li><strong style={{ color: '#10B981' }}>Curated extraction</strong> -- we pull the top ~10 findings per report into the searchable library; the full set (20–35 per report) lives on the report's drill-down page</li>
            <li><strong style={{ color: '#10B981' }}>Page references</strong> -- where the vendor labels a chart by section or page, that label travels with the card so you can validate against the source</li>
            <li><strong style={{ color: '#10B981' }}>No synthesis</strong> -- v1 never generates numbers. If a finding isn't in a real report, it isn't here.</li>
          </ul>
        </div>

        {/* Coverage */}
        <div style={cardStyle}>
          <span style={labelStyle}>04</span>
          <h2 style={sectionTitle}>Coverage (v1)</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            The numbers, with no rounding:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 18 }}>
            {[
              { value: '42', label: 'Vendor Reports', desc: 'Curated from 2024–2026 publications' },
              { value: '1,100+', label: 'Findings', desc: 'Stats, charts, and quotes extracted' },
              { value: '14', label: 'Categories', desc: 'Ransomware, Phishing, Supply Chain, ...' },
              { value: '6', label: 'Regions', desc: 'NA, Europe, APAC, MEA, LATAM, Africa' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#FF4562', marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,236,241,0.6)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(232,236,241,0.6)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* What's in beta */}
        <div style={cardStyle}>
          <span style={{ ...labelStyle, color: 'rgba(96,165,250,0.55)' }}>05</span>
          <h2 style={sectionTitle}>What's still in progress</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            v1 ships with Global Reports as the working surface. These are next:
          </p>
          <ul style={listStyle}>
            <li><strong style={{ color: '#60A5FA' }}>Popular Charts</strong> -- a curated wall of the most-presented charts across the library</li>
            <li><strong style={{ color: '#60A5FA' }}>Custom Builder</strong> -- pick a threat category and slice by industry, region, and time window</li>
            <li><strong style={{ color: '#60A5FA' }}>Threat-type slice views</strong> -- the wizard at <code style={{ background: 'rgba(255,255,255,0.05)', padding: '1px 6px', borderRadius: 4 }}>/explore</code> drilled by dimension</li>
            <li><strong style={{ color: '#60A5FA' }}>PNG export</strong> -- one-click chart downloads with vendor attribution baked in</li>
          </ul>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginTop: 14 }}>
            All four surfaces are reachable today — they just show a friendly under-construction wall on top. The data foundation is being expanded behind the scenes; we'll lift the wall on each one as it stabilises.
          </p>
        </div>

      </div>
    </div>
  )
}
