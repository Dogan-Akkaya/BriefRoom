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
            Every chart in Brief Room is backed by verifiable intelligence. Here is how we collect, validate, and present cybersecurity data.
          </p>
        </div>

        {/* Data Collection */}
        <div style={cardStyle}>
          <span style={labelStyle}>01</span>
          <h2 style={sectionTitle}>Data Collection</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            We aggregate intelligence from multiple authoritative sources to ensure breadth and accuracy:
          </p>
          <ul style={listStyle}>
            <li><strong style={{ color: '#FF4562' }}>SOCRadar Intel</strong> -- Proprietary threat intelligence from SOCRadar's global sensor network</li>
            <li><strong style={{ color: '#FF4562' }}>MITRE ATT&CK</strong> -- Adversary tactics, techniques, and procedures mapping</li>
            <li><strong style={{ color: '#FF4562' }}>CISA KEV</strong> -- Known Exploited Vulnerabilities catalog</li>
            <li><strong style={{ color: '#FF4562' }}>NVD</strong> -- National Vulnerability Database for CVE scoring and metadata</li>
            <li><strong style={{ color: '#FF4562' }}>PhishStats</strong> -- Real-time phishing URL and campaign data</li>
            <li><strong style={{ color: '#FF4562' }}>Verizon DBIR</strong> -- Data Breach Investigations Report annual findings</li>
            <li><strong style={{ color: '#FF4562' }}>FBI IC3</strong> -- Internet Crime Complaint Center annual reports and alerts</li>
          </ul>
        </div>

        {/* Update Cadence */}
        <div style={cardStyle}>
          <span style={labelStyle}>02</span>
          <h2 style={sectionTitle}>Update Cadence</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            Data freshness varies by source type and collection method:
          </p>
          <ul style={listStyle}>
            <li><strong style={{ color: '#3B82F6' }}>Daily</strong> -- CVE feeds, exploit availability checks, phishing URL ingestion</li>
            <li><strong style={{ color: '#3B82F6' }}>Weekly</strong> -- Dark web monitoring, credential listing scans, marketplace tracking</li>
            <li><strong style={{ color: '#3B82F6' }}>Monthly</strong> -- Manual curation, analyst review, trend recalculation</li>
            <li><strong style={{ color: '#3B82F6' }}>Quarterly</strong> -- Major report ingestion (DBIR, IC3), benchmark recalibration</li>
          </ul>
        </div>

        {/* Data Quality */}
        <div style={cardStyle}>
          <span style={labelStyle}>03</span>
          <h2 style={sectionTitle}>Data Quality</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            Every data point undergoes a multi-stage validation pipeline:
          </p>
          <ul style={listStyle}>
            <li><strong style={{ color: '#10B981' }}>Confidence Scoring</strong> -- Each metric carries a confidence level (high / medium / low) based on source reliability and corroboration</li>
            <li><strong style={{ color: '#10B981' }}>Source Attribution</strong> -- All charts display their underlying sources so you can verify independently</li>
            <li><strong style={{ color: '#10B981' }}>Peer Review</strong> -- SOCRadar analysts review aggregated datasets before publication to catch anomalies and bias</li>
          </ul>
        </div>

        {/* Coverage */}
        <div style={cardStyle}>
          <span style={labelStyle}>04</span>
          <h2 style={sectionTitle}>Coverage</h2>
          <p style={{ fontSize: 14, color: 'rgba(232,236,241,0.45)', lineHeight: 1.7, marginBottom: 14 }}>
            Brief Room intelligence spans a broad global footprint:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16, marginTop: 18 }}>
            {[
              { value: '47', label: 'Countries', desc: 'Global threat telemetry coverage' },
              { value: '10', label: 'Industries', desc: 'Sector-specific benchmarks' },
              { value: '6', label: 'Threat Categories', desc: 'From ransomware to supply chain' },
              { value: '180+', label: 'Charts', desc: 'Board-ready visualizations' },
            ].map((item, i) => (
              <div key={i} style={{ padding: '16px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.04)' }}>
                <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: 28, fontWeight: 700, color: '#FF4562', marginBottom: 4 }}>{item.value}</div>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(232,236,241,0.35)', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 12, color: 'rgba(232,236,241,0.3)' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}
