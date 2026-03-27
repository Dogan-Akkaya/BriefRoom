import React from 'react'
import { useNavigate } from 'react-router-dom'
import { GLOBAL_REPORTS } from '../lib/data'
import ReportCard from '../components/ReportCard'
import Reveal from '../components/Reveal'

const styles = {
  page: {
    paddingTop: 80,
    paddingBottom: 80,
    maxWidth: 1100,
    margin: '0 auto',
    paddingLeft: 24,
    paddingRight: 24,
  },
  label: {
    fontFamily: "'JetBrains Mono', monospace",
    fontSize: 11,
    letterSpacing: '0.12em',
    color: 'rgba(59,130,246,0.6)',
    marginBottom: 12,
    display: 'block',
  },
  heading: {
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    fontSize: 40,
    fontWeight: 700,
    color: '#E8ECF1',
    lineHeight: 1.15,
    marginBottom: 14,
  },
  subtitle: {
    fontSize: 15,
    color: 'rgba(232,236,241,0.4)',
    lineHeight: 1.7,
    maxWidth: 640,
    marginBottom: 28,
  },
  backBtn: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '7px 16px',
    fontSize: 12,
    fontWeight: 500,
    borderRadius: 8,
    background: 'rgba(255,255,255,0.04)',
    color: 'rgba(232,236,241,0.45)',
    border: '1px solid rgba(255,255,255,0.06)',
    cursor: 'pointer',
    fontFamily: "'Satoshi', sans-serif",
    transition: 'all 0.2s',
    marginBottom: 48,
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 18,
  },
}

export default function Reports() {
  const navigate = useNavigate()

  return (
    <div style={styles.page}>
      <Reveal>
        <span style={styles.label}>&#9679; GLOBAL REPORTS</span>
        <h1 style={styles.heading}>From the reports CISOs trust most</h1>
        <p style={styles.subtitle}>
          Key findings from industry-leading cybersecurity reports. Fixed charts
          from trusted external sources — ready to download and present.
        </p>
        <button style={styles.backBtn} onClick={() => navigate('/')}>
          &#8592; Back to home
        </button>
      </Reveal>

      <div style={styles.grid}>
        {GLOBAL_REPORTS.map((report, i) => (
          <Reveal key={report.id} delay={i * 60}>
            <ReportCard report={report} onClick={() => {}} />
          </Reveal>
        ))}
      </div>
    </div>
  )
}
