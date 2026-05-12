// Intelligence Library
// -----------------------------------------------------------------------------
// Single swappable source of truth for Brief Room's slice-aware data (stats +
// charts). Replaces the legacy POPULAR array.
//
// - Popular Charts   = items where (featured && type === 'chart')
// - Slice view       = items tagged with a given dimension value
// - Cross-slice view = items tagged with two dimension values
//
// Dimensions: industry (see INDUSTRIES), region (see ALL_REGIONS), threat_type
// (CATEGORIES[].id — lowercase, e.g. 'ransomware').
//
// Adding / editing entries: see the guide at the bottom of this file.
// Swapping to a real backend: replace INTELLIGENCE_LIBRARY + the selectors
// with async fetchers. Schema is wire-compatible.
// -----------------------------------------------------------------------------

import { INDUSTRIES, ALL_REGIONS, CATEGORIES, MONTHS } from './data'
import { MANUAL_LIBRARY_ITEMS, MANUAL_REPORT_ITEMS, MANUAL_REPORT_RAW_BY_ID } from './manualData'

// ---------- Slug helpers (URL <-> label) -----------------------------------

const THREAT_TYPE_IDS = CATEGORIES.map(c => c.id)
const THREAT_TYPE_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.id, c.label]))

export const labelToSlug = (s) =>
  String(s).toLowerCase()
    .replace(/\s*&\s*/g, '-')
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')

export const slugToLabel = (dim, slug) => {
  if (dim === 'industry') return INDUSTRIES.find(i => labelToSlug(i) === slug) || null
  if (dim === 'region') return ALL_REGIONS.find(r => labelToSlug(r) === slug) || null
  if (dim === 'threat_type') return THREAT_TYPE_IDS.includes(slug) ? slug : null
  return null
}

export const threatTypeLabel = (id) => THREAT_TYPE_LABEL[id] || id

// Single source of truth for the "primary topic" chip on a report card or
// detail header. Returns the canonical Threat Type label for the first
// entry in `threat_type[]` — falling back to the legacy free-text
// `category` field only if no threat type is set. This unifies the
// taxonomy: there is now one dimension (threat_type), not two.
export function primaryThreatLabel(report) {
  if (!report) return ''
  const first = Array.isArray(report.threat_type) ? report.threat_type[0] : null
  if (first) return threatTypeLabel(first)
  return report.category || ''
}

// Canonical list of available dimension values (for wizard tabs)
export const DIMENSION_VALUES = {
  industry: INDUSTRIES,
  region: ALL_REGIONS,
  threat_type: CATEGORIES.filter(c => c.hasData).map(c => c.id)
    .concat(CATEGORIES.filter(c => !c.hasData).map(c => c.id)),
}

// ---------- Color palette per threat type (for generated charts) ----------

const THREAT_COLOR = {
  ransomware: '#FF4562',
  phishing: '#F59E0B',
  infostealer: '#14B8A6',
  logs_on_sale: '#7B61FF',
  data_leaks: '#3B82F6',
  employee_exposure: '#EC4899',
  dark_web_mentions: '#14B8A6',
  vulnerability: '#A855F7',
  ddos: '#F97316',
  supply_chain: '#10B981',
}

// ---------- Hand-crafted entries -------------------------------------------
// 12 featured charts (drive the Popular grid) + high-quality anchor stats.

const HAND_CRAFTED = [
  // ---- 12 featured charts (Popular Charts grid) -------------------------
  {
    id: 'pop-ransomware-by-sector',
    type: 'chart',
    title: 'Ransomware Attacks by Sector',
    dataset: {
      labels: MONTHS,
      series: [
        { name: 'Healthcare', values: [12, 19, 15, 25, 22, 30, 28, 35, 40, 38, 45, 52], color: '#FF4562' },
        { name: 'Manufacturing', values: [9, 14, 18, 22, 24, 28, 30, 34, 36, 40, 42, 48], color: '#7B61FF' },
      ],
    },
    preferred_chart: 'bar',
    source: 'SOCRadar ThreatVision 2026',
    industry: ['Healthcare', 'Manufacturing'],
    region: ['North America', 'Europe'],
    threat_type: ['ransomware'],
    featured: true,
    tags: ['by-sector'],
    updated_at: '2026-03-15',
    display: {
      views: '12.4k', trend: '+23% YoY', up: true,
      detail: 'Healthcare and manufacturing remain the most targeted sectors. Median ransom demand increased 40% to $1.2M.',
      metrics: [{ label: 'Avg. Ransom', value: '$1.2M' }, { label: 'Top Sector', value: 'Healthcare' }],
    },
  },
  {
    id: 'pop-mttd',
    type: 'chart',
    title: 'Mean Time to Detect (MTTD)',
    dataset: {
      labels: MONTHS,
      series: [{ name: 'Global MTTD (days)', values: [200, 195, 180, 175, 160, 155, 140, 130, 125, 110, 105, 98], color: '#3B82F6' }],
    },
    preferred_chart: 'line',
    source: 'SOCRadar SOC Benchmark 2026',
    industry: ['Technology', 'Financial Services', 'Healthcare'],
    region: ['North America', 'Europe'],
    threat_type: ['data_leaks'],
    featured: true,
    tags: ['mttd', 'operations'],
    updated_at: '2026-03-10',
    display: {
      views: '9.8k', trend: '-18% YoY', up: false,
      detail: 'Organizations with XDR reduced detection time by 34%. Average MTTD now at 98 days, down from 120 in 2024.',
      metrics: [{ label: 'Current Avg.', value: '98 days' }, { label: 'Best-in-class', value: '12 days' }],
    },
  },
  {
    id: 'pop-cloud-misconfig',
    type: 'chart',
    title: 'Cloud Misconfiguration Trends',
    dataset: {
      labels: MONTHS,
      series: [{ name: 'Incidents', values: [45, 42, 48, 40, 38, 35, 33, 36, 30, 28, 25, 22], color: '#10B981' }],
    },
    preferred_chart: 'area',
    source: 'SOCRadar CSPM 2026',
    industry: ['Technology', 'Financial Services', 'Retail & E-Commerce'],
    region: ['North America', 'Europe', 'Asia Pacific'],
    threat_type: ['vulnerability'],
    featured: true,
    tags: ['cloud'],
    updated_at: '2026-02-28',
    display: {
      views: '8.2k', trend: '-12% YoY', up: false,
      detail: 'Public S3 buckets down 62%. IAM over-provisioning remains the #1 misconfiguration across AWS and Azure.',
      metrics: [{ label: '#1 Misconfig', value: 'IAM Excess' }, { label: 'Public Buckets', value: '-62%' }],
    },
  },
  {
    id: 'pop-phishing-ctr',
    type: 'chart',
    title: 'Phishing Click-Through Rates',
    dataset: {
      labels: MONTHS,
      series: [{ name: 'CTR (%)', values: [18, 16, 19, 15, 14, 12, 13, 11, 10, 9, 8, 7], color: '#F59E0B' }],
    },
    preferred_chart: 'line',
    source: 'SOCRadar Awareness 2026',
    industry: ['Government', 'Financial Services', 'Healthcare', 'Education'],
    region: ['North America', 'Europe', 'Asia Pacific'],
    threat_type: ['phishing'],
    featured: true,
    tags: ['awareness'],
    updated_at: '2026-03-12',
    display: {
      views: '7.5k', trend: '-31% YoY', up: false,
      detail: 'QR-code phishing (quishing) saw 400% growth. Traditional email click rates dropping but lateral vectors evolve.',
      metrics: [{ label: 'Click Rate', value: '7.1%' }, { label: 'Quishing', value: '+400%' }],
    },
  },
  {
    id: 'pop-vuln-exploits',
    type: 'chart',
    title: 'Vulnerability Exploits in the Wild',
    dataset: {
      labels: MONTHS,
      series: [{ name: 'Exploited CVEs', values: [28, 32, 30, 38, 42, 45, 50, 55, 48, 52, 58, 64], color: '#A855F7' }],
    },
    preferred_chart: 'bar',
    source: 'NVD + CISA KEV catalog',
    industry: ['Technology', 'Government', 'Manufacturing'],
    region: ['North America', 'Europe'],
    threat_type: ['vulnerability'],
    featured: true,
    tags: ['cve'],
    updated_at: '2026-03-08',
    display: {
      views: '6.9k', trend: '+34% YoY', up: true,
      detail: 'Time-to-exploit for critical CVEs dropped to 5 days. Zero-day exploitation up 40% compared to 2024.',
      metrics: [{ label: 'Avg. TTE', value: '5 days' }, { label: 'Zero-Days', value: '+40%' }],
    },
  },
  {
    id: 'pop-supply-chain-eco',
    type: 'chart',
    title: 'Supply Chain Incidents by Ecosystem',
    dataset: {
      labels: MONTHS,
      series: [{ name: 'Malicious packages', values: [8, 10, 12, 15, 18, 22, 28, 35, 42, 48, 55, 62], color: '#EC4899' }],
    },
    preferred_chart: 'line',
    source: 'SOCRadar supply chain monitoring',
    industry: ['Technology', 'Financial Services'],
    region: ['North America', 'Europe', 'Asia Pacific'],
    threat_type: ['supply_chain'],
    featured: true,
    tags: ['ecosystem', 'npm'],
    updated_at: '2026-03-14',
    display: {
      views: '5.6k', trend: '+245% YoY', up: true,
      detail: 'npm and PyPI account for 65% of malicious package incidents. Typosquatting remains the dominant attack vector.',
      metrics: [{ label: '#1 Ecosystem', value: 'npm' }, { label: 'Packages', value: '745+' }],
    },
  },
  {
    id: 'pop-darkweb-creds',
    type: 'chart',
    title: 'Dark Web Credential Listings',
    dataset: {
      labels: MONTHS,
      series: [{ name: 'Listings (millions)', values: [180, 195, 210, 200, 225, 240, 255, 270, 260, 280, 295, 310], color: '#14B8A6' }],
    },
    preferred_chart: 'area',
    source: 'SOCRadar dark web monitoring',
    industry: ['Financial Services', 'Healthcare', 'Government', 'Technology'],
    region: ['North America', 'Europe', 'Middle East', 'Asia Pacific'],
    threat_type: ['dark_web_mentions', 'infostealer'],
    featured: true,
    tags: ['darkweb'],
    updated_at: '2026-03-11',
    display: {
      views: '4.8k', trend: '+31% YoY', up: true,
      detail: 'Corporate VPN credentials sell for $4,500 average. Domain admin access prices jumped 20% to $12,000.',
      metrics: [{ label: 'VPN Price', value: '$4,500' }, { label: 'Total Listed', value: '24B+' }],
    },
  },
  {
    id: 'pop-ddos-bandwidth',
    type: 'chart',
    title: 'DDoS Attack Bandwidth Trends',
    dataset: {
      labels: MONTHS,
      series: [{ name: 'Peak (Gbps)', values: [120, 135, 128, 145, 160, 175, 190, 210, 225, 240, 255, 280], color: '#F97316' }],
    },
    preferred_chart: 'line',
    source: 'Global DDoS monitoring network',
    industry: ['Telecommunications', 'Technology', 'Financial Services'],
    region: ['North America', 'Europe', 'Asia Pacific'],
    threat_type: ['ddos'],
    featured: true,
    tags: ['infrastructure'],
    updated_at: '2026-02-20',
    display: {
      views: '3.9k', trend: '+67% YoY', up: true,
      detail: 'Peak attack bandwidth exceeded 3.5 Tbps in Q1 2026. QUIC flood attacks emerged as the fastest-growing vector.',
      metrics: [{ label: 'Peak BW', value: '3.5 Tbps' }, { label: '#1 Vector', value: 'QUIC Flood' }],
    },
  },
  {
    id: 'pop-infostealer-regions',
    type: 'chart',
    title: 'Infostealer Victims by Region',
    dataset: {
      labels: MONTHS,
      series: [
        { name: 'North America', values: [55, 62, 68, 72, 78, 82, 88, 94, 98, 105, 112, 120], color: '#14B8A6' },
        { name: 'Latin America', values: [30, 35, 42, 48, 55, 62, 68, 74, 80, 85, 92, 100], color: '#EC4899' },
      ],
    },
    preferred_chart: 'line',
    source: 'Infostealer log aggregation',
    industry: ['Financial Services', 'Retail & E-Commerce'],
    region: ['North America', 'Latin America', 'Europe'],
    threat_type: ['infostealer'],
    featured: true,
    tags: ['victims'],
    updated_at: '2026-03-03',
    display: {
      views: '4.2k', trend: '+52% YoY', up: true,
      detail: 'LATAM saw the steepest rise. RedLine and Raccoon remain the dominant stealer families globally.',
      metrics: [{ label: '#1 Malware', value: 'RedLine' }, { label: 'Victims', value: '2.1M' }],
    },
  },
  {
    id: 'pop-breach-cost-industry',
    type: 'chart',
    title: 'Data Breach Cost by Industry',
    dataset: {
      labels: ['Healthcare', 'Financial', 'Pharma', 'Tech', 'Energy', 'Gov', 'Edu'],
      series: [{ name: 'Avg. cost ($M)', values: [10.9, 5.9, 4.8, 4.7, 4.6, 3.7, 2.6], color: '#3B82F6' }],
    },
    preferred_chart: 'bar',
    source: 'IBM X-Force 2025',
    industry: ['Healthcare', 'Financial Services', 'Technology', 'Government', 'Education', 'Energy & Utilities'],
    region: ['North America', 'Europe'],
    threat_type: ['data_leaks'],
    featured: true,
    tags: ['breach-cost'],
    updated_at: '2026-02-15',
    display: {
      views: '11.1k', trend: '+9% YoY', up: true,
      detail: 'Healthcare leads at $10.9M average. Overall global average reached $4.88M.',
      metrics: [{ label: '#1 Cost', value: '$10.9M' }, { label: 'Global Avg.', value: '$4.88M' }],
    },
  },
  {
    id: 'pop-nation-state',
    type: 'chart',
    title: 'Nation-State Activity by Region',
    dataset: {
      labels: ['NA', 'EU', 'ME', 'APAC', 'LATAM', 'AF'],
      series: [{ name: 'Campaigns detected', values: [142, 98, 76, 88, 22, 14], color: '#EF4444' }],
    },
    preferred_chart: 'bar',
    source: 'CrowdStrike OverWatch 2025',
    industry: ['Government', 'Energy & Utilities', 'Technology'],
    region: ['North America', 'Europe', 'Middle East', 'Asia Pacific'],
    threat_type: ['dark_web_mentions', 'vulnerability'],
    featured: true,
    tags: ['nation-state'],
    updated_at: '2026-03-05',
    display: {
      views: '6.3k', trend: '+18% YoY', up: true,
      detail: 'Chinese, Russian, and Iranian actors remain most prolific. Middle East grid sector saw 3x growth.',
      metrics: [{ label: 'Top Actor', value: 'Mustang Panda' }, { label: 'EU Targets', value: '+28%' }],
    },
  },
  {
    id: 'pop-vuln-disclosure',
    type: 'chart',
    title: 'Vulnerability Disclosure Volume',
    dataset: {
      labels: MONTHS,
      series: [{ name: 'Published CVEs', values: [2400, 2550, 2420, 2780, 2910, 3050, 3200, 3380, 3220, 3400, 3580, 3720], color: '#A855F7' }],
    },
    preferred_chart: 'area',
    source: 'NVD',
    industry: ['Technology', 'Education'],
    region: ['North America', 'Europe', 'Asia Pacific'],
    threat_type: ['vulnerability'],
    featured: true,
    tags: ['disclosure'],
    updated_at: '2026-03-18',
    display: {
      views: '5.1k', trend: '+22% YoY', up: true,
      detail: 'CVE publication rate on pace to exceed 40,000 in 2026 — a record year. Web apps, cloud, and IoT dominate.',
      metrics: [{ label: '2026 Pace', value: '40k+' }, { label: '#1 Class', value: 'Web App' }],
    },
  },

  // ---- Hand-crafted stats: one high-quality anchor per industry ----------
  {
    id: 'stat-fs-breach-one-in-three',
    type: 'stat', card_style: 'number',
    title: 'Financial services institutions breached',
    value: '1 in 3', source: 'Verizon DBIR 2025',
    industry: ['Financial Services'], region: ['North America', 'Europe'],
    threat_type: ['phishing', 'data_leaks'],
    featured: false, tags: ['breach-rate'], updated_at: '2026-02-10',
  },
  {
    id: 'stat-healthcare-top-target',
    type: 'stat', card_style: 'quote',
    title: 'Healthcare targeting',
    quote: '"Healthcare became the #1 ransomware target for the third consecutive year — with the highest average breach cost across all industries."',
    source: 'IBM X-Force 2025',
    industry: ['Healthcare'], region: ['North America', 'Europe'],
    threat_type: ['ransomware', 'data_leaks'],
    featured: false, tags: ['targeting'], updated_at: '2026-02-12',
  },
  {
    id: 'stat-tech-npm-vector',
    type: 'stat', card_style: 'number',
    title: 'Malicious npm packages detected',
    value: '745+', source: 'SOCRadar Supply Chain',
    industry: ['Technology'], region: ['North America', 'Europe'],
    threat_type: ['supply_chain'],
    featured: false, tags: ['npm'], updated_at: '2026-03-14',
  },
  {
    id: 'stat-gov-eu-top-sector',
    type: 'stat', card_style: 'quote',
    title: 'EU public administration',
    quote: '"Public administration remains the most targeted sector in the EU, accounting for 22% of all cyber incidents reported to ENISA."',
    source: 'ENISA Threat Landscape 2025',
    industry: ['Government'], region: ['Europe'],
    threat_type: ['phishing', 'ransomware'],
    featured: false, tags: ['eu-sector'], updated_at: '2026-01-28',
  },
  {
    id: 'stat-mfg-ransomware-yoy',
    type: 'stat', card_style: 'sparkline',
    title: 'Manufacturing ransomware incidents',
    value: '+34% YoY', spark: [18, 22, 26, 31, 38, 45],
    source: 'SOCRadar ThreatVision',
    industry: ['Manufacturing'], region: ['North America', 'Europe', 'Asia Pacific'],
    threat_type: ['ransomware'],
    featured: false, tags: ['yoy'], updated_at: '2026-03-01',
  },
  {
    id: 'stat-energy-ics-growth',
    type: 'stat', card_style: 'bar',
    title: 'ICS / OT attacks on energy grid',
    value: '+120% YoY', spark: [22, 30, 38, 52, 66, 78],
    source: 'Dragos 2025',
    industry: ['Energy & Utilities'], region: ['North America', 'Europe', 'Middle East'],
    threat_type: ['vulnerability', 'ransomware'],
    featured: false, tags: ['ics'], updated_at: '2026-02-05',
  },
  {
    id: 'stat-retail-card-skim',
    type: 'stat', card_style: 'number',
    title: 'Retail card-skimming incidents',
    value: '+45%', source: 'PCI SSC 2025',
    industry: ['Retail & E-Commerce'], region: ['North America', 'Latin America'],
    threat_type: ['data_leaks', 'infostealer'],
    featured: false, tags: ['card-skim'], updated_at: '2026-02-18',
  },
  {
    id: 'stat-telco-ddos-peak',
    type: 'stat', card_style: 'number',
    title: 'Peak DDoS bandwidth (Q1)',
    value: '3.5 Tbps', source: 'Cloudflare 2026',
    industry: ['Telecommunications'], region: ['North America', 'Europe', 'Asia Pacific'],
    threat_type: ['ddos'],
    featured: false, tags: ['peak'], updated_at: '2026-02-28',
  },
  {
    id: 'stat-edu-ransom-spike',
    type: 'stat', card_style: 'number',
    title: 'Education sector ransom demands',
    value: '+67% YoY', source: 'Unit 42 2025',
    industry: ['Education'], region: ['North America', 'Europe'],
    threat_type: ['ransomware'],
    featured: false, tags: ['yoy'], updated_at: '2026-02-25',
  },
  {
    id: 'stat-transport-logistics',
    type: 'stat', card_style: 'quote',
    title: 'Shipping & logistics targeting',
    quote: '"Global shipping lines and air-cargo operators saw a 48% rise in cyber incidents, with lateral movement from port OT to corporate IT becoming a concern."',
    source: 'ENISA Transport 2025',
    industry: ['Transportation'], region: ['Europe', 'Asia Pacific'],
    threat_type: ['ransomware', 'supply_chain'],
    featured: false, tags: ['logistics'], updated_at: '2026-01-20',
  },

  // ---- Region anchors ---------------------------------------------------
  {
    id: 'stat-na-breach-cost',
    type: 'stat', card_style: 'number',
    title: 'North America avg. breach cost',
    value: '$9.4M', source: 'IBM X-Force 2025',
    industry: ['Healthcare', 'Financial Services'], region: ['North America'],
    threat_type: ['data_leaks'],
    featured: false, tags: ['cost'], updated_at: '2026-02-15',
  },
  {
    id: 'stat-eu-enisa-top',
    type: 'stat', card_style: 'bar',
    title: 'EU top-5 threats (incident share)',
    value: 'Ransomware #1', spark: [32, 27, 18, 12, 11],
    source: 'ENISA Threat Landscape 2025',
    industry: ['Government', 'Healthcare', 'Financial Services'], region: ['Europe'],
    threat_type: ['ransomware', 'phishing', 'ddos'],
    featured: false, tags: ['eu-top5'], updated_at: '2026-01-28',
  },
  {
    id: 'stat-me-nation-state',
    type: 'stat', card_style: 'number',
    title: 'Middle East nation-state campaigns',
    value: '+45% YoY', source: 'CrowdStrike OverWatch',
    industry: ['Energy & Utilities', 'Government'], region: ['Middle East'],
    threat_type: ['dark_web_mentions', 'vulnerability'],
    featured: false, tags: ['nation-state'], updated_at: '2026-03-05',
  },
  {
    id: 'stat-apac-ransomware-growth',
    type: 'stat', card_style: 'sparkline',
    title: 'APAC ransomware growth',
    value: '+89% YoY', spark: [40, 55, 72, 90, 115, 140],
    source: 'SOCRadar APAC Intel',
    industry: ['Manufacturing', 'Financial Services'], region: ['Asia Pacific'],
    threat_type: ['ransomware'],
    featured: false, tags: ['yoy'], updated_at: '2026-03-02',
  },
  {
    id: 'stat-latam-infostealer',
    type: 'stat', card_style: 'quote',
    title: 'LATAM infostealer hotspot',
    quote: '"Brazil, Mexico, and Colombia together account for 41% of global infostealer log volume — with banking trojans leading the mix."',
    source: 'SOCRadar Infostealer Monitor',
    industry: ['Financial Services', 'Retail & E-Commerce'], region: ['Latin America'],
    threat_type: ['infostealer', 'logs_on_sale'],
    featured: false, tags: ['hotspot'], updated_at: '2026-02-22',
  },
  {
    id: 'stat-africa-telco',
    type: 'stat', card_style: 'number',
    title: 'Africa telco targeting',
    value: '+62% YoY', source: 'SOCRadar Africa Intel',
    industry: ['Telecommunications', 'Financial Services'], region: ['Africa'],
    threat_type: ['ddos', 'phishing'],
    featured: false, tags: ['growth'], updated_at: '2026-02-14',
  },

  // ---- Threat-type-only anchors (less covered) --------------------------
  {
    id: 'stat-infostealer-creds',
    type: 'stat', card_style: 'number',
    title: 'Stolen credentials indexed',
    value: '24B+', source: 'SOCRadar dark web monitoring',
    industry: ['Financial Services', 'Technology', 'Healthcare'],
    region: ['North America', 'Europe', 'Latin America'],
    threat_type: ['infostealer'],
    featured: false, tags: ['volume'], updated_at: '2026-03-11',
  },
  {
    id: 'stat-logs-price',
    type: 'stat', card_style: 'bar',
    title: 'Dark web log listing price range',
    value: '$100–$500', spark: [120, 180, 240, 320, 420, 500],
    source: 'Russian Market observation',
    industry: ['Financial Services', 'Retail & E-Commerce'],
    region: ['Europe', 'Latin America'],
    threat_type: ['logs_on_sale'],
    featured: false, tags: ['price'], updated_at: '2026-02-08',
  },
  {
    id: 'stat-employee-exec-exposure',
    type: 'stat', card_style: 'number',
    title: 'Executive data exposure rate',
    value: '31%', source: 'SOCRadar Exec Protection',
    industry: ['Financial Services', 'Technology', 'Government'],
    region: ['North America', 'Europe'],
    threat_type: ['employee_exposure'],
    featured: false, tags: ['c-suite'], updated_at: '2026-02-19',
  },
  {
    id: 'stat-ddos-quic-emerging',
    type: 'stat', card_style: 'quote',
    title: 'QUIC flood emergence',
    quote: '"QUIC-based flood attacks grew 340% YoY and now bypass most volumetric scrubbing appliances at the edge."',
    source: 'Akamai SOTI 2026',
    industry: ['Telecommunications', 'Technology'],
    region: ['North America', 'Europe', 'Asia Pacific'],
    threat_type: ['ddos'],
    featured: false, tags: ['vector'], updated_at: '2026-02-28',
  },
]

// ---------- Generator (fills gaps to guarantee ≥12 per dimension value) -----

const GEN_TARGET = 12

// Deterministic PRNG (mulberry32)
function makeRng(seed) {
  let t = seed >>> 0
  return () => {
    t = (t + 0x6D2B79F5) >>> 0
    let x = t
    x = Math.imul(x ^ (x >>> 15), x | 1)
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61)
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296
  }
}

const pick = (r, arr) => arr[Math.floor(r() * arr.length) % arr.length]

// Stat title patterns per threat type. %IND% / %REG% substituted.
const STAT_PATTERNS = {
  ransomware: [
    { t: '%IND% ransomware incidents', v: (r) => `+${Math.floor(r() * 55 + 15)}% YoY`, s: 'number' },
    { t: 'Avg. ransom demand in %IND%', v: (r) => `$${(r() * 2.6 + 0.5).toFixed(1)}M`, s: 'number' },
    { t: '%IND% recovery time', v: (r) => `${Math.floor(r() * 70 + 14)} days avg`, s: 'sparkline' },
    { t: '%IND% payment rate', v: (r) => `${Math.floor(r() * 25 + 10)}%`, s: 'bar' },
    { t: '%REG% ransomware index', v: (r) => `${Math.floor(r() * 350 + 120)} events`, s: 'number' },
  ],
  phishing: [
    { t: '%IND% click-through rate', v: (r) => `${(r() * 7 + 1.5).toFixed(1)}%`, s: 'number' },
    { t: '%IND% BEC losses', v: (r) => `$${(r() * 8 + 1.5).toFixed(1)}M`, s: 'number' },
    { t: '%REG% campaign volume', v: (r) => `${Math.floor(r() * 8000 + 2000)}/day`, s: 'sparkline' },
    { t: '%IND% quishing growth', v: (r) => `+${Math.floor(r() * 380 + 80)}%`, s: 'bar' },
  ],
  infostealer: [
    { t: '%IND% credential leaks', v: (r) => `${Math.floor(r() * 400 + 80)}k`, s: 'number' },
    { t: '%REG% stealer victims', v: (r) => `${Math.floor(r() * 900 + 200)}k`, s: 'sparkline' },
    { t: '%IND% RedLine share', v: (r) => `${Math.floor(r() * 25 + 30)}%`, s: 'bar' },
  ],
  logs_on_sale: [
    { t: '%IND% logs listed / day', v: (r) => `${Math.floor(r() * 4000 + 500)}`, s: 'number' },
    { t: '%REG% avg. log price', v: (r) => `$${Math.floor(r() * 400 + 80)}`, s: 'number' },
    { t: '%IND% corp-tagged logs', v: (r) => `${Math.floor(r() * 40 + 10)}%`, s: 'bar' },
  ],
  data_leaks: [
    { t: '%IND% avg. breach cost', v: (r) => `$${(r() * 8 + 2).toFixed(1)}M`, s: 'number' },
    { t: '%IND% records exposed', v: (r) => `${Math.floor(r() * 40 + 5)}M`, s: 'sparkline' },
    { t: '%REG% detection time', v: (r) => `${Math.floor(r() * 180 + 40)} days`, s: 'bar' },
    { t: '%IND% root cause: stolen creds', v: (r) => `${Math.floor(r() * 30 + 20)}%`, s: 'number' },
  ],
  employee_exposure: [
    { t: '%IND% exec data leaked', v: (r) => `${Math.floor(r() * 28 + 8)}%`, s: 'number' },
    { t: '%REG% corporate PII exposure', v: (r) => `${Math.floor(r() * 800 + 120)}k`, s: 'sparkline' },
    { t: '%IND% deepfake impersonation cases', v: (r) => `${Math.floor(r() * 450 + 50)}`, s: 'bar' },
  ],
  dark_web_mentions: [
    { t: '%IND% brand mentions', v: (r) => `+${Math.floor(r() * 45 + 10)}%`, s: 'number' },
    { t: '%REG% Telegram channels tracked', v: (r) => `${Math.floor(r() * 900 + 200)}`, s: 'sparkline' },
    { t: '%IND% access broker listings', v: (r) => `${Math.floor(r() * 120 + 30)}`, s: 'bar' },
  ],
  vulnerability: [
    { t: '%IND% exploited CVEs', v: (r) => `${Math.floor(r() * 55 + 15)}`, s: 'number' },
    { t: '%IND% avg. time to exploit', v: (r) => `${Math.floor(r() * 28 + 3)} days`, s: 'sparkline' },
    { t: '%REG% zero-day share', v: (r) => `${Math.floor(r() * 18 + 3)}%`, s: 'bar' },
    { t: '%IND% patch window', v: (r) => `${Math.floor(r() * 40 + 8)} days`, s: 'number' },
  ],
  ddos: [
    { t: '%IND% avg. peak bandwidth', v: (r) => `${Math.floor(r() * 800 + 100)} Gbps`, s: 'number' },
    { t: '%REG% attack duration', v: (r) => `${Math.floor(r() * 40 + 5)} min median`, s: 'sparkline' },
    { t: '%IND% QUIC flood share', v: (r) => `${Math.floor(r() * 25 + 4)}%`, s: 'bar' },
  ],
  supply_chain: [
    { t: '%IND% compromised packages', v: (r) => `${Math.floor(r() * 380 + 50)}`, s: 'number' },
    { t: '%REG% npm incidents', v: (r) => `+${Math.floor(r() * 180 + 40)}%`, s: 'sparkline' },
    { t: '%IND% vendor breach share', v: (r) => `${Math.floor(r() * 22 + 5)}%`, s: 'bar' },
  ],
}

const CHART_PATTERNS = {
  ransomware: [
    { t: '%IND% ransomware incidents (monthly)', series: 'growing' },
    { t: '%REG% ransom demand distribution', series: 'distribution' },
  ],
  phishing: [
    { t: '%IND% phishing campaigns detected', series: 'growing' },
    { t: '%REG% click-through rate trend', series: 'declining' },
  ],
  infostealer: [{ t: '%IND% infostealer log volume', series: 'growing' }],
  logs_on_sale: [{ t: '%REG% log listing price trend', series: 'stable' }],
  data_leaks: [
    { t: '%IND% records exposed by quarter', series: 'growing' },
    { t: '%REG% avg. breach cost trend', series: 'growing' },
  ],
  employee_exposure: [{ t: '%IND% executive exposure incidents', series: 'growing' }],
  dark_web_mentions: [{ t: '%IND% brand mention volume', series: 'growing' }],
  vulnerability: [
    { t: '%IND% exploited CVE volume', series: 'growing' },
    { t: '%REG% time-to-exploit trend', series: 'declining' },
  ],
  ddos: [{ t: '%REG% DDoS attack volume', series: 'growing' }],
  supply_chain: [{ t: '%IND% malicious package detections', series: 'growing' }],
}

const SOURCES = [
  'SOCRadar ThreatVision', 'IBM X-Force', 'CrowdStrike OverWatch', 'Verizon DBIR',
  'Mandiant M-Trends', 'Palo Alto Unit 42', 'ENISA', 'Cloudflare SOTI',
  'Akamai SOTI', 'Kaspersky Securelist', 'Check Point Research',
]

function genSeries(r, pattern, n = 12) {
  const base = Math.floor(r() * 80 + 20)
  const noise = () => r() * 0.25 - 0.125
  const out = []
  for (let i = 0; i < n; i++) {
    let v = base
    if (pattern === 'growing') v = base * (1 + i * 0.08) * (1 + noise())
    else if (pattern === 'declining') v = base * (1 - i * 0.04) * (1 + noise())
    else if (pattern === 'distribution') v = base * (1 + Math.sin(i) * 0.5 + noise())
    else v = base * (1 + noise())
    out.push(Math.max(1, Math.round(v)))
  }
  return out
}

function genSpark(r) {
  const base = Math.floor(r() * 40 + 10)
  return Array.from({ length: 6 }, (_, i) => Math.round(base * (1 + i * 0.15 + r() * 0.2)))
}

function fillTitle(template, indLabel, regLabel) {
  return template.replace('%IND%', indLabel).replace('%REG%', regLabel)
}

function generateCoverage(existing) {
  const r = makeRng(20260418)
  const out = []
  const coverage = {
    industry: Object.fromEntries(INDUSTRIES.map(i => [i, 0])),
    region: Object.fromEntries(ALL_REGIONS.map(g => [g, 0])),
    threat_type: Object.fromEntries(THREAT_TYPE_IDS.map(t => [t, 0])),
  }
  const tally = (arr, dim) => { (arr || []).forEach(v => { if (v in coverage[dim]) coverage[dim][v]++ }) }
  existing.forEach(it => { tally(it.industry, 'industry'); tally(it.region, 'region'); tally(it.threat_type, 'threat_type') })

  let genId = 0
  const MAX = 260 // safety cap
  while (genId < MAX) {
    // find under-served value across any dimension
    const deficits = []
    for (const dim of ['industry', 'region', 'threat_type']) {
      for (const v of Object.keys(coverage[dim])) {
        const def = GEN_TARGET - coverage[dim][v]
        if (def > 0) deficits.push({ dim, v, def })
      }
    }
    if (!deficits.length) break
    // pick the largest deficit (ties broken randomly)
    deficits.sort((a, b) => b.def - a.def || (r() - 0.5))
    const target = deficits[0]

    // assemble an item anchored on target + random cross-tags
    let industry, region, threat_type
    if (target.dim === 'industry') industry = [target.v]
    else industry = [pick(r, INDUSTRIES)]
    if (target.dim === 'region') region = [target.v]
    else region = [pick(r, ALL_REGIONS)]
    if (target.dim === 'threat_type') threat_type = [target.v]
    else threat_type = [pick(r, THREAT_TYPE_IDS)]

    const tt = threat_type[0]
    const makeChart = r() < 0.35
    const asStat = !makeChart && STAT_PATTERNS[tt]
    const id = `gen-${tt}-${labelToSlug(industry[0])}-${labelToSlug(region[0])}-${genId}`

    let item
    if (asStat) {
      const pat = pick(r, STAT_PATTERNS[tt])
      item = {
        id,
        type: 'stat',
        title: fillTitle(pat.t, industry[0], region[0]),
        value: pat.v(r),
        card_style: pat.s,
        source: pick(r, SOURCES),
        industry, region, threat_type,
        featured: false,
        tags: [tt],
        updated_at: '2026-03-18',
      }
      if (pat.s === 'sparkline' || pat.s === 'bar') item.spark = genSpark(r)
    } else if (CHART_PATTERNS[tt]) {
      const pat = pick(r, CHART_PATTERNS[tt])
      const values = genSeries(r, pat.series)
      item = {
        id,
        type: 'chart',
        title: fillTitle(pat.t, industry[0], region[0]),
        dataset: {
          labels: MONTHS,
          series: [{ name: threatTypeLabel(tt), values, color: THREAT_COLOR[tt] || '#3B82F6' }],
        },
        preferred_chart: pick(r, ['bar', 'line', 'area']),
        source: pick(r, SOURCES),
        industry, region, threat_type,
        featured: false,
        tags: [tt, 'trend'],
        updated_at: '2026-03-18',
      }
    } else {
      // Fallback stat if no patterns
      item = {
        id,
        type: 'stat', card_style: 'number',
        title: `${industry[0]} ${threatTypeLabel(tt)} indicator`,
        value: `${Math.floor(r() * 80 + 15)}`,
        source: pick(r, SOURCES),
        industry, region, threat_type,
        featured: false, tags: [tt], updated_at: '2026-03-18',
      }
    }
    out.push(item)
    coverage.industry[industry[0]]++
    coverage.region[region[0]]++
    coverage.threat_type[tt]++
    genId++
  }
  return out
}

// ---------- Assemble library + selectors ------------------------------------

// Every hand-crafted item is flagged `real: true` — they carry vendor/publication
// attribution (IBM, Verizon DBIR, Mandiant, CrowdStrike, ENISA, SOCRadar, etc.).
// Generator output stays unflagged (synthetic backfill).
const HAND_CRAFTED_REAL = HAND_CRAFTED.map(item => ({ ...item, real: true }))

// Manual items contributed via src/data/manual/**/*.json (including the
// auto-ingested global-reports/ subfolder). Default real:true unless the JSON
// explicitly sets real:false. They feed the generator alongside
// HAND_CRAFTED_REAL, so coverage backfill shrinks proportionally.
const MANUAL_LIBRARY_REAL = MANUAL_LIBRARY_ITEMS.map(item => ({ ...item, real: item.real !== false }))
const MANUAL_REPORT_REAL = MANUAL_REPORT_ITEMS.map(item => ({ ...item, real: item.real !== false }))

const REAL_SEED = [...HAND_CRAFTED_REAL, ...MANUAL_LIBRARY_REAL]

export const INTELLIGENCE_LIBRARY = [
  ...REAL_SEED,
  ...MANUAL_REPORT_REAL,
  ...generateCoverage(REAL_SEED),
]

export const popularCharts = () =>
  INTELLIGENCE_LIBRARY.filter(i => i.featured && i.type === 'chart')

/** External-report items (vendor mirror). */
export const reports = () =>
  INTELLIGENCE_LIBRARY.filter(i => i.type === 'report')

/** Alias for clarity — used by Reports.jsx and Landing.jsx. */
export const globalReports = reports

/**
 * Raw drill-down payload for `/reports/:reportId`. Returns the report's full
 * card array (curated + retained), un-filtered by library_include. Returns null
 * if no manual file produced this report_id.
 */
export const reportById = (reportId) => MANUAL_REPORT_RAW_BY_ID[reportId] || null

const resolveValue = (dim, valueOrSlug) => {
  if (dim === 'threat_type') return valueOrSlug
  return slugToLabel(dim, valueOrSlug) || valueOrSlug
}

// Real-first ordering: items flagged `real: true` surface before synthetic
// backfill, preserving original relative order within each group.
const realFirst = (items) => {
  const real = []
  const rest = []
  for (const it of items) (it.real ? real : rest).push(it)
  return [...real, ...rest]
}

export const sliceItems = (dim, valueOrSlug) => {
  const v = resolveValue(dim, valueOrSlug)
  return realFirst(INTELLIGENCE_LIBRARY.filter(i => (i[dim] || []).includes(v)))
}

export const crossSliceItems = (d1, v1, d2, v2) =>
  realFirst(sliceItems(d1, v1).filter(i => (i[d2] || []).includes(resolveValue(d2, v2))))

export const crossSliceCounts = (pivotDim, pivotVal, otherDim) => {
  const pivotItems = sliceItems(pivotDim, pivotVal)
  const counts = {}
  pivotItems.forEach(item => {
    (item[otherDim] || []).forEach(v => { counts[v] = (counts[v] || 0) + 1 })
  })
  return counts
}

// Friendly dim value list for the wizard (ordered)
export const valuesForDim = (dim) => {
  if (dim === 'industry') return [...INDUSTRIES]
  if (dim === 'region') return [...ALL_REGIONS]
  if (dim === 'threat_type') return THREAT_TYPE_IDS.slice()
  return []
}

// -----------------------------------------------------------------------------
// Swap guide — how to add entries or replace the backend
// -----------------------------------------------------------------------------
// Add a new stat:
//   {
//     id: 'unique-kebab-id',
//     type: 'stat',
//     title: 'Short title',
//     value: '42%',                     // headline fact
//     card_style: 'number',             // 'number' | 'sparkline' | 'bar' | 'quote'
//     // spark: [n,n,n,...]             // if 'sparkline' | 'bar' (6 values)
//     // quote: '"..."'                  // if 'quote'
//     source: 'Attribution',
//     industry:    ['Healthcare'],      // exact strings from INDUSTRIES (data.js)
//     region:      ['North America'],   // exact from ALL_REGIONS
//     threat_type: ['ransomware'],      // CATEGORIES ids (lowercase)
//     featured: false,
//     tags: [],
//     updated_at: '2026-04-18',
//   }
//
// Add a new chart:
//   {
//     id: 'unique-kebab-id',
//     type: 'chart',
//     title: 'Chart title',
//     dataset: {
//       labels: ['Jan','Feb','Mar','Apr','May','Jun'],
//       series: [{ name: 'Series A', values: [10,14,18,22,19,24], color: '#FF4562' }],
//     },
//     preferred_chart: 'bar',           // 'bar' | 'line' | 'area' | 'pie'
//     source: 'Attribution',
//     industry:    ['Manufacturing'],
//     region:      ['Europe'],
//     threat_type: ['phishing'],
//     featured: true,                   // true + chart → shows in Popular
//     tags: [],
//     updated_at: '2026-04-18',
//     display: { views:'8.2k', trend:'+12% YoY', up:true },  // optional, for Popular
//   }
//
// Rules:
//   - Use exact tag strings. Typos silently exclude from slices.
//   - Empty dim arrays mean the item won't appear under that dimension's slices.
//   - featured: true only surfaces in Popular when type === 'chart'.
//   - id must be unique.
//
// Swap to a real backend:
//   Replace `INTELLIGENCE_LIBRARY` + `HAND_CRAFTED` + `generateCoverage` with an
//   async loader returning items in the same shape. Selectors become async;
//   callers await or wrap with a fetch hook. @supabase/supabase-js is already in
//   package.json — create `src/lib/supabase.js` and query a single
//   `intelligence_library` table whose columns mirror the schema above.
// -----------------------------------------------------------------------------
