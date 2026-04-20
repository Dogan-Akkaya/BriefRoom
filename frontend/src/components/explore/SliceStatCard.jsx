import Spark from '../Spark'
import { BrandChip } from '../../lib/sourceBrands'

// Renders one Intelligence Library stat item in one of four visual styles:
// number | sparkline | bar | quote.
// Grid spans: number=1, chart-like (sparkline|bar)=2, quote=3 — so the
// "Intelligence at a glance" grid reads dynamically instead of uniform.

const SPAN_BY_STYLE = { number: 1, sparkline: 2, bar: 2, quote: 3 }

function TinyBars({ values, color = '#FF4562' }) {
  const max = Math.max(...values, 1)
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 48, marginTop: 8 }}>
      {values.map((v, i) => (
        <div key={i} style={{
          flex: 1,
          height: `${(v / max) * 100}%`,
          minHeight: 2,
          borderRadius: 2,
          background: color,
          opacity: 0.3 + 0.6 * (i / values.length),
        }} />
      ))}
    </div>
  )
}

export default function SliceStatCard({ item }) {
  const style = item.card_style || 'number'
  const span = SPAN_BY_STYLE[style] || 1

  const containerBase = {
    padding: 18,
    borderRadius: 14,
    background: 'rgba(255,255,255,0.03)',
    backdropFilter: 'blur(16px)',
    border: '1px solid rgba(255,255,255,0.07)',
    transition: 'all 0.2s',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    gridColumn: `span ${span}`,
    position: 'relative',
  }
  // Green "Verified" chip shown only when the item came from a vendor source.
  const verifiedBadge = item.real ? (
    <span
      title="Verified vendor source"
      aria-label="Verified vendor source"
      style={{
        position: 'absolute', top: 10, right: 10,
        display: 'inline-flex', alignItems: 'center', gap: 4,
        padding: '3px 7px', borderRadius: 999,
        background: 'rgba(16,185,129,0.12)',
        border: '1px solid rgba(16,185,129,0.3)',
        color: '#10B981',
        fontFamily: "'JetBrains Mono'",
        fontSize: 9, letterSpacing: '0.08em', textTransform: 'uppercase',
        fontWeight: 600, lineHeight: 1,
      }}
    >
      <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
      </svg>
      Verified
    </span>
  ) : null
  // When Verified chip is rendered, reserve right-side space so title/quote
  // never runs under the badge (badge is ~86px wide at top:10 / right:10).
  const contentInsetRight = item.real ? 92 : 0
  const sourceLine = (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8,
      marginTop: 'auto', flexWrap: 'wrap',
    }}>
      <BrandChip source={item.source} size="sm" />
      <span style={{
        fontFamily: "'JetBrains Mono'", fontSize: 10,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: 'rgba(232,236,241,0.6)',
      }}>
        {item.source}
      </span>
    </div>
  )
  const titleLine = (
    <div style={{
      fontSize: 13, color: 'rgba(232,236,241,0.6)',
      lineHeight: 1.4, fontFamily: "'Plus Jakarta Sans'",
      paddingRight: contentInsetRight,
    }}>
      {item.title}
    </div>
  )

  if (style === 'quote') {
    // 1×3 — full row. Quote can breathe horizontally.
    return (
      <div style={{ ...containerBase, minHeight: 140, padding: '26px 32px' }}>
        {verifiedBadge}
        <div style={{
          fontFamily: "'Plus Jakarta Sans'", fontSize: 20,
          fontWeight: 500, lineHeight: 1.5, color: 'rgba(232,236,241,0.92)',
          fontStyle: 'italic', letterSpacing: '-0.01em', maxWidth: 880,
          paddingRight: contentInsetRight,
        }}>
          {item.quote || item.value}
        </div>
        {sourceLine}
      </div>
    )
  }

  if (style === 'sparkline' || style === 'bar') {
    // 1×2 — wider card so the chart has room. Title + big number + visual in a row.
    return (
      <div style={{ ...containerBase, minHeight: 160 }}>
        {verifiedBadge}
        {titleLine}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 16, flex: 1 }}>
          <div style={{
            fontFamily: "'Plus Jakarta Sans'", fontSize: 30, fontWeight: 700,
            letterSpacing: '-0.02em', color: '#fff', flexShrink: 0,
          }}>
            {item.value}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            {style === 'sparkline'
              ? <Spark data={item.spark || [2, 4, 3, 5, 7, 9]} color="#FF4562" w={320} h={48} />
              : <TinyBars values={item.spark || [3, 5, 6, 8, 10]} />}
          </div>
        </div>
        {sourceLine}
      </div>
    )
  }

  // number (default) — 1×1
  return (
    <div style={{ ...containerBase, minHeight: 140 }}>
      {verifiedBadge}
      {titleLine}
      <div style={{
        fontFamily: "'Plus Jakarta Sans'",
        fontSize: 34, fontWeight: 800, letterSpacing: '-0.03em',
        color: '#fff', lineHeight: 1,
      }}>
        {item.value}
      </div>
      {sourceLine}
    </div>
  )
}
