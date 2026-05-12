// Brand metadata for known vendor sources. Single source of truth — both the
// React BrandChip component (`sourceBrands.jsx`) and the Node ingestion
// validators import from here, so adding a vendor in one place updates both.
//
// Lookup is substring-based (case-insensitive) so variants like
// "SOCRadar ThreatVision 2026", "Verizon (DBIR) 2025", "Microsoft Security"
// all match the same entry. First-match wins — place more specific keywords
// before generic ones.

// The `slug` field maps to a logo file under `frontend/public/logos/sources/`.
// See `src/data/progress_logo.json` for per-vendor logo metadata (file path,
// confidence, dark-theme background needed). Brands without a usable logo
// (currently only NVD) have `slug: null` and fall back to the monogram chip.
export const BRANDS = [
  // keyword (lowercase substring), short label, brand color, full name, slug
  { k: 'socradar',          short: 'SR',    color: '#FF4562', name: 'SOCRadar',               slug: 'socradar' },
  { k: 'ibm',               short: 'IBM',   color: '#1F70C1', name: 'IBM X-Force',            slug: 'ibm-xforce' },
  { k: 'x-force',           short: 'IBM',   color: '#1F70C1', name: 'IBM X-Force',            slug: 'ibm-xforce' },
  { k: 'crowdstrike',       short: 'CS',    color: '#EC1A2B', name: 'CrowdStrike',            slug: 'crowdstrike' },
  { k: 'overwatch',         short: 'CS',    color: '#EC1A2B', name: 'CrowdStrike OverWatch',  slug: 'crowdstrike' },
  { k: 'verizon',           short: 'DBIR',  color: '#CD040B', name: 'Verizon DBIR',           slug: 'verizon-dbir' },
  { k: 'dbir',              short: 'DBIR',  color: '#CD040B', name: 'Verizon DBIR',           slug: 'verizon-dbir' },
  { k: 'mandiant',          short: 'MND',   color: '#E91F26', name: 'Mandiant',               slug: 'mandiant' },
  { k: 'm-trends',          short: 'MND',   color: '#E91F26', name: 'Mandiant M-Trends',      slug: 'mandiant' },
  { k: 'unit 42',           short: 'U42',   color: '#FA582D', name: 'Unit 42',                slug: 'unit42' },
  { k: 'unit42',            short: 'U42',   color: '#FA582D', name: 'Unit 42',                slug: 'unit42' },
  { k: 'palo alto',         short: 'U42',   color: '#FA582D', name: 'Palo Alto Unit 42',     slug: 'unit42' },
  { k: 'enisa',             short: 'ENI',   color: '#003399', name: 'ENISA',                  slug: 'enisa' },
  { k: 'cloudflare',        short: 'CF',    color: '#F38020', name: 'Cloudflare',             slug: 'cloudflare' },
  { k: 'akamai',            short: 'AK',    color: '#009CDA', name: 'Akamai',                 slug: 'akamai' },
  { k: 'kaspersky',         short: 'KL',    color: '#12B26D', name: 'Kaspersky',              slug: 'kaspersky' },
  { k: 'check point',       short: 'CP',    color: '#DA291C', name: 'Check Point',            slug: 'checkpoint' },
  { k: 'checkpoint',        short: 'CP',    color: '#DA291C', name: 'Check Point',            slug: 'checkpoint' },
  { k: 'dragos',            short: 'DG',    color: '#0099CC', name: 'Dragos',                 slug: 'dragos' },
  { k: 'pci ssc',           short: 'PCI',   color: '#003B7A', name: 'PCI SSC',                slug: 'pci-ssc' },
  { k: 'nvd',               short: 'NVD',   color: '#0B5EA8', name: 'NVD',                    slug: null },
  { k: 'cisa',              short: 'CISA',  color: '#0033A0', name: 'CISA',                   slug: 'cisa' },
  { k: 'fbi ic3',           short: 'IC3',   color: '#1B3E89', name: 'FBI IC3',                slug: 'fbi-ic3' },
  { k: 'ic3',               short: 'IC3',   color: '#1B3E89', name: 'FBI IC3',                slug: 'fbi-ic3' },

  // Vendor expansion for Global-reports-inputs/ ingestion (42 vendors).
  // Place specific multi-word keywords before generic single-word ones.
  { k: 'cisco talos',       short: 'TAL',   color: '#1BA0D7', name: 'Cisco Talos',            slug: 'cisco-talos' },
  { k: 'talos',             short: 'TAL',   color: '#1BA0D7', name: 'Cisco Talos',            slug: 'cisco-talos' },
  { k: 'red canary',        short: 'RCY',   color: '#CC2A36', name: 'Red Canary',             slug: 'redcanary' },
  { k: 'black duck',        short: 'BDK',   color: '#FFB81C', name: 'Black Duck',             slug: 'black-duck' },
  { k: 'f5 labs',           short: 'F5L',   color: '#C8102E', name: 'F5 Labs',                slug: 'f5' },
  { k: 'f5',                short: 'F5L',   color: '#C8102E', name: 'F5 Labs',                slug: 'f5' },
  { k: 'fs-isac',           short: 'FSI',   color: '#003366', name: 'FS-ISAC',                slug: 'fs-isac' },
  { k: 'fs isac',           short: 'FSI',   color: '#003366', name: 'FS-ISAC',                slug: 'fs-isac' },
  { k: 'world economic forum', short: 'WEF', color: '#20418B', name: 'World Economic Forum', slug: 'wef' },
  { k: 'wef',               short: 'WEF',   color: '#20418B', name: 'World Economic Forum',   slug: 'wef' },
  { k: 'sophos',            short: 'SPH',   color: '#0E4F88', name: 'Sophos',                 slug: 'sophos' },
  { k: 'zscaler',           short: 'ZS',    color: '#00BCEB', name: 'Zscaler',                slug: 'zscaler' },
  { k: 'threatlabz',        short: 'ZS',    color: '#00BCEB', name: 'Zscaler ThreatLabz',     slug: 'zscaler' },
  { k: 'microsoft',         short: 'MSF',   color: '#0078D4', name: 'Microsoft Security',     slug: 'microsoft' },
  { k: 'rapid7',            short: 'R7',    color: '#F73B1C', name: 'Rapid7',                 slug: 'rapid7' },
  { k: 'fortinet',          short: 'FTI',   color: '#DA291C', name: 'Fortinet FortiGuard',    slug: 'fortinet' },
  { k: 'fortiguard',        short: 'FTI',   color: '#DA291C', name: 'Fortinet FortiGuard',    slug: 'fortinet' },
  { k: 'eset',              short: 'ESET',  color: '#0099CC', name: 'ESET',                   slug: 'eset' },
  { k: 'trellix',           short: 'TRX',   color: '#FF1F30', name: 'Trellix',                slug: 'trellix' },
  { k: 'bitdefender',       short: 'BDF',   color: '#ED1C24', name: 'Bitdefender',            slug: 'bitdefender' },
  { k: 'hoxhunt',           short: 'HXH',   color: '#5B43FF', name: 'Hoxhunt',                slug: 'hoxhunt' },
  { k: 'knowbe4',           short: 'KB4',   color: '#339933', name: 'KnowBe4',                slug: 'knowbe4' },
  { k: 'proofpoint',        short: 'PFP',   color: '#1E66FF', name: 'Proofpoint',             slug: 'proofpoint' },
  { k: 'coalition',         short: 'COA',   color: '#1A1A2E', name: 'Coalition',              slug: 'coalition' },
  { k: 'constella',         short: 'CST',   color: '#00BFA5', name: 'Constella',              slug: 'constella' },
  { k: 'kela',              short: 'KELA',  color: '#5B21B6', name: 'KELA',                   slug: 'kela' },
  { k: 'cyfirma',           short: 'CYF',   color: '#003F87', name: 'CYFIRMA',                slug: 'cyfirma' },
  { k: 'sonatype',          short: 'SON',   color: '#A6CE39', name: 'Sonatype',               slug: 'sonatype' },
  { k: 'coveware',          short: 'CVW',   color: '#003366', name: 'Coveware',               slug: 'coveware' },
  { k: 'huntress',          short: 'HNT',   color: '#1F8FFF', name: 'Huntress',               slug: 'huntress' },
  { k: 'ncsc',              short: 'NCSC',  color: '#1D70B8', name: 'NCSC (UK)',              slug: 'ncsc' },
  { k: 'pwc',               short: 'PWC',   color: '#DC6900', name: 'PwC',                    slug: 'pwc' },
  { k: 'censys',            short: 'CNS',   color: '#3E36DA', name: 'Censys',                 slug: 'censys' },
  { k: 'okta',              short: 'OKTA',  color: '#007DC1', name: 'Okta',                   slug: 'okta' },
  { k: 'securityscorecard', short: 'SSC',   color: '#006FB4', name: 'SecurityScorecard',      slug: 'securityscorecard' },
  { k: 'trend micro',       short: 'TRD',   color: '#D71920', name: 'Trend Micro',            slug: 'trendmicro' },
]

export function sourceBrand(source) {
  if (!source) return null
  const s = String(source).toLowerCase()
  for (const b of BRANDS) if (s.includes(b.k)) {
    return { short: b.short, color: b.color, name: b.name, slug: b.slug }
  }
  return null
}
