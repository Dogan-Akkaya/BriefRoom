import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'

const PLACEHOLDERS = {
  privacy: {
    title: 'Privacy Policy',
    body: 'Brief Room is committed to protecting the privacy and security of your information. We collect minimal usage data to improve chart generation and do not sell or share your data with third parties. All threat intelligence displayed is aggregated and anonymized. Session data is encrypted in transit and at rest using AES-256. For detailed information about data retention periods and your rights under GDPR and CCPA, please contact our data protection officer.',
  },
  terms: {
    title: 'Terms of Service',
    body: 'By using Brief Room, you agree to use the platform and its generated charts for legitimate cybersecurity reporting and awareness purposes only. Charts and data are provided "as-is" without warranty. You may export and embed charts in internal reports and board presentations. Redistribution of raw data feeds or reverse engineering of our intelligence APIs is prohibited. We reserve the right to modify these terms with 30 days notice.',
  },
  api: {
    title: 'API Documentation',
    body: 'The Brief Room API provides programmatic access to chart generation, threat data queries, and export capabilities. Authentication is handled via API keys issued through your account dashboard. Endpoints support JSON and SVG responses. Rate limits are set at 1,000 requests per hour for free-tier users. Enterprise plans include webhook support, batch chart generation, and custom data source integration.',
  },
  contact: {
    title: 'Contact Us',
    body: 'For support inquiries, data correction requests, or partnership opportunities, reach out to the Brief Room team. Enterprise customers have access to dedicated support channels with 4-hour SLA response times. For vulnerability disclosures related to the Brief Room platform, please use our responsible disclosure program.',
  },
}

export default function StaticPage() {
  const { slug } = useParams()
  const navigate = useNavigate()

  const page = PLACEHOLDERS[slug] || {
    title: slug ? slug.charAt(0).toUpperCase() + slug.slice(1) : 'Page',
    body: 'This content is currently being prepared. Please check back soon for updates on this topic.',
  }

  useEffect(() => { document.title = `${page.title} | Brief Room` }, [page.title])

  return (
    <div style={{ minHeight: '100vh', background: '#0A0E1A', color: '#E8ECF1' }}>
      <div style={{ paddingTop: 80, maxWidth: 700, margin: '0 auto', padding: '80px 24px 80px' }}>

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

        {/* Content */}
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
            &nbsp;&nbsp;{slug || 'page'}
          </div>
          <h1 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 'clamp(32px,5vw,48px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: '#FFFFFF',
            letterSpacing: '-0.03em',
            marginBottom: 24,
          }}>
            {page.title}
          </h1>
        </div>

        <div style={{
          background: 'rgba(255,255,255,0.03)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 16,
          padding: '32px 28px',
          backdropFilter: 'blur(12px)',
          marginBottom: 32,
        }}>
          <p style={{
            fontSize: 15,
            lineHeight: 1.8,
            color: 'rgba(232,236,241,0.55)',
          }}>
            {page.body}
          </p>
        </div>

        <div style={{
          background: 'rgba(59,130,246,0.06)',
          border: '1px solid rgba(59,130,246,0.18)',
          borderRadius: 12,
          padding: '14px 18px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <span style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            fontWeight: 600,
            background: 'rgba(59,130,246,0.18)',
            color: '#60A5FA',
            padding: '3px 8px',
            borderRadius: 4,
          }}>
            Beta
          </span>
          <span style={{
            fontFamily: "'Satoshi', 'DM Sans', sans-serif",
            fontSize: 13,
            color: 'rgba(232,236,241,0.6)',
          }}>
            Beta preview — not final legal copy.
          </span>
        </div>

      </div>
    </div>
  )
}
