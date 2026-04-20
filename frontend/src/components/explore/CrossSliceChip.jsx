import { Link } from 'react-router-dom'

export default function CrossSliceChip({ to, label, count }) {
  return (
    <Link
      to={to}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 14px',
        borderRadius: 999,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        color: 'rgba(232,236,241,0.85)',
        fontFamily: "'Plus Jakarta Sans'",
        fontSize: 13, fontWeight: 500,
        textDecoration: 'none',
        transition: 'all 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = 'rgba(255,69,98,0.1)'
        e.currentTarget.style.borderColor = 'rgba(255,69,98,0.35)'
        e.currentTarget.style.color = '#fff'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'
        e.currentTarget.style.color = 'rgba(232,236,241,0.85)'
      }}
    >
      <span>{label}</span>
      <span style={{
        fontFamily: "'JetBrains Mono'", fontSize: 11,
        color: 'rgba(232,236,241,0.45)',
        padding: '1px 7px', borderRadius: 10,
        background: 'rgba(255,255,255,0.04)',
      }}>
        {count}
      </span>
    </Link>
  )
}
