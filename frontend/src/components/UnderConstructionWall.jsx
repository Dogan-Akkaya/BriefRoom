import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

/**
 * Soft "coming soon" overlay shown on top of routes that are still being
 * built. Renders nothing for the first ~900ms so users get a peek at the
 * content behind, then fades in a semi-transparent wall with two ways out.
 *
 * Sits at zIndex 80 — below the Navbar (z 100) so global nav still works
 * (users can jump to Home or Global Reports without clicking the wall CTAs).
 *
 * Usage:
 *   <Route path="/popular" element={
 *     <UnderConstructionWall><Popular /></UnderConstructionWall>
 *   } />
 */
export default function UnderConstructionWall({
  children,
  title = 'Under construction',
  subtitle = "This surface needs more data behind it to ship. We're polishing it next — meanwhile, take a peek and head over to Global Reports for the v1 experience.",
  peekDelayMs = 900,
  fadeMs = 1100,
}) {
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), peekDelayMs)
    return () => clearTimeout(t)
  }, [peekDelayMs])

  return (
    <>
      {children}
      <div
        aria-hidden={!visible}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          opacity: visible ? 1 : 0,
          pointerEvents: visible ? 'auto' : 'none',
          transition: `opacity ${fadeMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          background: 'radial-gradient(ellipse at center, rgba(10,14,26,0.42) 0%, rgba(10,14,26,0.62) 70%, rgba(10,14,26,0.78) 100%)',
          backdropFilter: 'blur(6px) saturate(90%)',
          WebkitBackdropFilter: 'blur(6px) saturate(90%)',
        }}
      >
        <div
          style={{
            maxWidth: 520,
            width: '100%',
            padding: '34px 36px',
            borderRadius: 22,
            background: 'rgba(12,16,28,0.82)',
            backdropFilter: 'blur(28px) saturate(140%)',
            WebkitBackdropFilter: 'blur(28px) saturate(140%)',
            border: '1px solid rgba(255,255,255,0.08)',
            boxShadow: '0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(59,130,246,0.06) inset',
            textAlign: 'center',
            transform: visible ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
            transition: `transform ${fadeMs}ms cubic-bezier(0.16, 1, 0.3, 1)`,
          }}
        >
          <div style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 10,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: 'rgba(96,165,250,0.85)',
            marginBottom: 16,
          }}>
            <span style={{
              display: 'inline-block',
              animation: 'gentlePulse 2.5s ease-in-out infinite',
            }}>●</span>
            &nbsp;&nbsp;v1 — public beta
          </div>
          <h2 style={{
            fontFamily: "'Plus Jakarta Sans', sans-serif",
            fontSize: 28,
            fontWeight: 700,
            color: '#E8ECF1',
            margin: 0,
            marginBottom: 14,
            letterSpacing: '-0.02em',
            lineHeight: 1.15,
          }}>
            {title}
          </h2>
          <p style={{
            fontSize: 14,
            color: 'rgba(232,236,241,0.6)',
            lineHeight: 1.7,
            margin: 0,
            marginBottom: 26,
          }}>
            {subtitle}
          </p>
          <div style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
            flexWrap: 'wrap',
          }}>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 10,
                background: 'rgba(255,255,255,0.04)',
                color: 'rgba(232,236,241,0.75)',
                border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer',
                fontFamily: "'Satoshi', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
                e.currentTarget.style.color = '#E8ECF1'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
                e.currentTarget.style.color = 'rgba(232,236,241,0.75)'
              }}
            >
              ← Back to Home
            </button>
            <button
              onClick={() => navigate('/reports')}
              style={{
                padding: '10px 20px',
                fontSize: 12,
                fontWeight: 600,
                borderRadius: 10,
                background: 'rgba(59,130,246,0.18)',
                color: '#60A5FA',
                border: '1px solid rgba(59,130,246,0.28)',
                cursor: 'pointer',
                fontFamily: "'Satoshi', sans-serif",
                transition: 'all 0.2s',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(59,130,246,0.28)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(59,130,246,0.18)'
              }}
            >
              Browse Global Reports →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
