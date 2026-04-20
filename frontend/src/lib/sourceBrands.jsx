// Brand chip metadata for known vendor sources.
// Returns { short, color, name } when the source string matches a known vendor,
// null otherwise. Lookup is substring-based (case-insensitive) so variants like
// "SOCRadar ThreatVision 2026", "SOCRadar Dark Web Monitoring", "Verizon DBIR"
// all match the same entry.
//
// When renaming sources in data.js / intelligenceLibrary.js, keep one of the
// keywords below in the string so the brand chip keeps resolving.

const BRANDS = [
  // keyword (lowercase substring), short label, brand color, full name
  { k: 'socradar',          short: 'SR',    color: '#FF4562', name: 'SOCRadar' },
  { k: 'ibm',               short: 'IBM',   color: '#1F70C1', name: 'IBM X-Force' },
  { k: 'x-force',           short: 'IBM',   color: '#1F70C1', name: 'IBM X-Force' },
  { k: 'crowdstrike',       short: 'CS',    color: '#EC1A2B', name: 'CrowdStrike' },
  { k: 'overwatch',         short: 'CS',    color: '#EC1A2B', name: 'CrowdStrike OverWatch' },
  { k: 'verizon',           short: 'DBIR',  color: '#CD040B', name: 'Verizon DBIR' },
  { k: 'dbir',              short: 'DBIR',  color: '#CD040B', name: 'Verizon DBIR' },
  { k: 'mandiant',          short: 'MND',   color: '#E91F26', name: 'Mandiant' },
  { k: 'm-trends',          short: 'MND',   color: '#E91F26', name: 'Mandiant M-Trends' },
  { k: 'unit 42',           short: 'U42',   color: '#FA582D', name: 'Unit 42' },
  { k: 'palo alto',         short: 'U42',   color: '#FA582D', name: 'Palo Alto Unit 42' },
  { k: 'enisa',             short: 'ENI',   color: '#003399', name: 'ENISA' },
  { k: 'cloudflare',        short: 'CF',    color: '#F38020', name: 'Cloudflare' },
  { k: 'akamai',            short: 'AK',    color: '#009CDA', name: 'Akamai' },
  { k: 'kaspersky',         short: 'KL',    color: '#12B26D', name: 'Kaspersky' },
  { k: 'check point',       short: 'CP',    color: '#DA291C', name: 'Check Point' },
  { k: 'dragos',            short: 'DG',    color: '#0099CC', name: 'Dragos' },
  { k: 'pci ssc',           short: 'PCI',   color: '#003B7A', name: 'PCI SSC' },
  { k: 'nvd',               short: 'NVD',   color: '#0B5EA8', name: 'NVD' },
  { k: 'cisa',              short: 'CISA',  color: '#0033A0', name: 'CISA KEV' },
  { k: 'fbi ic3',           short: 'IC3',   color: '#1B3E89', name: 'FBI IC3' },
]

export function sourceBrand(source) {
  if (!source) return null
  const s = String(source).toLowerCase()
  for (const b of BRANDS) if (s.includes(b.k)) return { short: b.short, color: b.color, name: b.name }
  return null
}

import { useState } from 'react'

// Small inline JSX chip renderer. Kept here so multiple components share the same visual.
// Hover reveals the full brand name as a tooltip above the chip.
export function BrandChip({ source, size = 'sm', style = {} }) {
  const [hovered, setHovered] = useState(false)
  const brand = sourceBrand(source)
  if (!brand) return null
  const dims = size === 'lg'
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
      {hovered && (
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
            border: `1px solid ${brand.color}55`,
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
          {brand.name}
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
              borderTop: `5px solid ${brand.color}55`,
            }}
          />
        </span>
      )}
    </span>
  )
}
