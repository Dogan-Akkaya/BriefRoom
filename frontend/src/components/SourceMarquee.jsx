import { useEffect, useState } from 'react'
import logoProgress from '../data/progress_logo.json'

// Auto-scrolling horizontal strip of every vendor logo we have on file.
// Lives on the home page directly below the hero — communicates "we
// indexed open data from 46 vendors" through identity rather than copy.
//
// Honours per-logo bg from progress_logo.json: dark wordmarks
// (Bitdefender, PwC, Mandiant, …) get a white card so they stay legible
// on our dark theme; light/colored marks render on transparent.
//
// Pauses on hover. Falls back to a static wrapping grid when the user
// has prefers-reduced-motion enabled.

const LOGOS = logoProgress.logos.filter((l) => !!l.file)
// Duplicated once so the marquee loops seamlessly — the translateX hits
// -50% at the keyframe end, which lands exactly at the start of the
// duplicate, and CSS animation snaps back to 0% imperceptibly.
const TRACK = [...LOGOS, ...LOGOS]

export default function SourceMarquee() {
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const onChange = (e) => setReducedMotion(e.matches)
    mq.addEventListener?.('change', onChange)
    return () => mq.removeEventListener?.('change', onChange)
  }, [])

  if (reducedMotion) {
    return (
      <div style={{
        display: 'flex', flexWrap: 'wrap', gap: 14,
        justifyContent: 'center', padding: '4px 0',
      }}>
        {LOGOS.map((l) => <LogoTile key={l.slug} logo={l} />)}
      </div>
    )
  }

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0, black 6%, black 94%, transparent 100%)',
      }}
    >
      <style>{`
        @keyframes briefroom-marquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        .briefroom-marquee-track {
          display: flex;
          gap: 14px;
          width: max-content;
          animation: briefroom-marquee 60s linear infinite;
        }
        .briefroom-marquee-track:hover { animation-play-state: paused; }
      `}</style>
      <div className="briefroom-marquee-track">
        {TRACK.map((l, i) => (
          <LogoTile key={`${l.slug}-${i}`} logo={l} />
        ))}
      </div>
    </div>
  )
}

function LogoTile({ logo }) {
  const whiteCard = logo.bg === 'white'
  return (
    <span
      title={logo.name}
      aria-label={logo.name}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: 44,
        width: 132,
        flexShrink: 0,
        padding: whiteCard ? '6px 14px' : '4px 10px',
        borderRadius: 10,
        background: whiteCard ? '#FFFFFF' : 'rgba(255,255,255,0.03)',
        border: whiteCard
          ? '1px solid rgba(255,255,255,0.16)'
          : '1px solid rgba(255,255,255,0.06)',
      }}
    >
      <img
        src={logo.file}
        alt={logo.name}
        loading="lazy"
        style={{
          maxHeight: '100%',
          maxWidth: '100%',
          objectFit: 'contain',
          display: 'block',
        }}
      />
    </span>
  )
}
