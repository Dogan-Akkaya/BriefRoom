// Brand chip metadata for known vendor sources.
//
// The data + lookup function live in `sourceBrandsData.mjs` (Node-importable)
// so the Node ingestion validators can use the same lookup without a separate
// mirror. This file adds the React BrandChip component and re-exports the
// lookup for existing consumers.
//
// BrandChip prefers a real vendor logo when one is catalogued in
// `src/data/progress_logo.json`. Brands without a logo (e.g. NVD) and any
// `source` strings that don't match a known vendor fall back to the 3-letter
// monogram chip. Dark wordmarks (PwC, Bitdefender, etc.) are wrapped in a
// white card so they stay legible on the dark theme.

import { useState } from 'react'
import { sourceBrand } from './sourceBrandsData.mjs'
import logoProgress from '../data/progress_logo.json'
export { sourceBrand }

// slug → { file, bg, confidence } for fast lookup at render time.
const LOGO_BY_SLUG = Object.fromEntries(
  logoProgress.logos
    .filter((l) => l.file)
    .map((l) => [l.slug, { file: l.file, bg: l.bg, confidence: l.confidence }])
)

function Tooltip({ name, color }) {
  return (
    <span
      role="tooltip"
      style={{
        position: 'absolute',
        bottom: 'calc(100% + 6px)',
        left: '50%',
        transform: 'translateX(-50%)',
        whiteSpace: 'nowrap',
        padding: '5px 10px',
        borderRadius: 6,
        background: 'rgba(10,14,26,0.96)',
        border: `1px solid ${color}55`,
        color: '#E8ECF1',
        fontFamily: "'Satoshi', 'DM Sans', sans-serif",
        fontSize: 11,
        fontWeight: 500,
        letterSpacing: '0.01em',
        lineHeight: 1.2,
        boxShadow: '0 6px 22px rgba(0,0,0,0.5)',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      {name}
      <span
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 0, height: 0,
          borderLeft: '5px solid transparent',
          borderRight: '5px solid transparent',
          borderTop: `5px solid ${color}55`,
        }}
      />
    </span>
  )
}

export function BrandChip({ source, size = 'sm', style = {} }) {
  const [hovered, setHovered] = useState(false)
  const [imgFailed, setImgFailed] = useState(false)
  const brand = sourceBrand(source)
  if (!brand) return null

  const logo = brand.slug ? LOGO_BY_SLUG[brand.slug] : null
  const useLogo = !!logo && !imgFailed
  const lg = size === 'lg'

  // Logo chip: image inside a slim container. White card when the logo is
  // dark-on-transparent (would otherwise be invisible on our dark UI).
  if (useLogo) {
    const isWhiteBg = logo.bg === 'white'
    const height = lg ? 24 : 18
    return (
      <span
        aria-label={brand.name}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          height,
          padding: isWhiteBg ? (lg ? '3px 8px' : '2px 6px') : (lg ? '2px 4px' : '1px 3px'),
          borderRadius: lg ? 6 : 5,
          background: isWhiteBg ? '#FFFFFF' : 'transparent',
          border: isWhiteBg
            ? '1px solid rgba(255,255,255,0.18)'
            : `1px solid ${brand.color}33`,
          lineHeight: 1,
          position: 'relative',
          cursor: 'default',
          ...style,
        }}
      >
        <img
          src={logo.file}
          alt={brand.name}
          onError={() => setImgFailed(true)}
          style={{
            height: '100%',
            width: 'auto',
            maxWidth: lg ? 110 : 80,
            objectFit: 'contain',
            display: 'block',
          }}
        />
        {hovered && <Tooltip name={brand.name} color={brand.color} />}
      </span>
    )
  }

  // Fallback: monogram chip (used for NVD and any vendor without a logo file,
  // or if the image fails to load).
  const dims = lg
    ? { padX: 10, padY: 5, fontSize: 11, borderRadius: 6 }
    : { padX: 7, padY: 3, fontSize: 9, borderRadius: 5 }
  return (
    <span
      aria-label={brand.name}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        padding: `${dims.padY}px ${dims.padX}px`,
        borderRadius: dims.borderRadius,
        background: `${brand.color}22`,
        border: `1px solid ${brand.color}55`,
        color: brand.color,
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: dims.fontSize,
        fontWeight: 700,
        letterSpacing: '0.05em',
        lineHeight: 1,
        whiteSpace: 'nowrap',
        position: 'relative',
        cursor: 'default',
        ...style,
      }}
    >
      {brand.short}
      {hovered && <Tooltip name={brand.name} color={brand.color} />}
    </span>
  )
}
