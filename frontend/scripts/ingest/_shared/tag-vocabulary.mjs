// Tag vocabularies — single source of truth for ingestion + record validation.
//
// Mirrors values exported from `frontend/src/lib/data.js`. Hardcoded here so
// Node ESM tools can import without resolving the full React/Vite module
// graph (the same constraint that `validate-library.mjs` works around with
// readFileSync + eval). If a vocabulary changes in data.js, mirror it here —
// `validate-records.mjs` flags drift loudly: any record carrying an
// out-of-vocabulary tag fails CI.

export const INDUSTRIES = [
  'Financial Services',
  'Healthcare',
  'Technology',
  'Government',
  'Manufacturing',
  'Energy & Utilities',
  'Retail & E-Commerce',
  'Telecommunications',
  'Education',
  'Transportation',
]

export const ALL_REGIONS = [
  'North America',
  'Europe',
  'Middle East',
  'Asia Pacific',
  'Latin America',
  'Africa',
]

export const ALL_COUNTRIES = [
  { name: 'United States',    region: 'North America' },
  { name: 'Canada',           region: 'North America' },
  { name: 'United Kingdom',   region: 'Europe' },
  { name: 'Germany',          region: 'Europe' },
  { name: 'France',           region: 'Europe' },
  { name: 'Netherlands',      region: 'Europe' },
  { name: 'Spain',            region: 'Europe' },
  { name: 'Italy',            region: 'Europe' },
  { name: 'Sweden',           region: 'Europe' },
  { name: 'Norway',           region: 'Europe' },
  { name: 'Finland',          region: 'Europe' },
  { name: 'Poland',           region: 'Europe' },
  { name: 'Switzerland',      region: 'Europe' },
  { name: 'Turkey',           region: 'Middle East' },
  { name: 'UAE',              region: 'Middle East' },
  { name: 'Saudi Arabia',     region: 'Middle East' },
  { name: 'Israel',           region: 'Middle East' },
  { name: 'Qatar',            region: 'Middle East' },
  { name: 'Japan',            region: 'Asia Pacific' },
  { name: 'Australia',        region: 'Asia Pacific' },
  { name: 'Singapore',        region: 'Asia Pacific' },
  { name: 'India',            region: 'Asia Pacific' },
  { name: 'South Korea',      region: 'Asia Pacific' },
  { name: 'Indonesia',        region: 'Asia Pacific' },
  { name: 'Brazil',           region: 'Latin America' },
  { name: 'Mexico',           region: 'Latin America' },
  { name: 'Colombia',         region: 'Latin America' },
  { name: 'Argentina',        region: 'Latin America' },
  { name: 'South Africa',     region: 'Africa' },
  { name: 'Nigeria',          region: 'Africa' },
  { name: 'Kenya',            region: 'Africa' },
]

export const ALL_COUNTRY_NAMES = ALL_COUNTRIES.map(c => c.name)

export const CATEGORIES_IDS = [
  'ransomware', 'phishing', 'infostealer', 'logs_on_sale', 'data_leaks',
  'employee_exposure', 'dark_web_mentions', 'vulnerability', 'ddos', 'supply_chain',
]

export const THREAT_GROUPS = [
  'All Groups', 'LockBit 4.0', 'BlackCat/ALPHV', 'Cl0p', 'Play', 'Akira',
  'Royal', 'Medusa', 'NoEscape', 'Black Basta', 'RansomHub', 'Rhysida', 'BianLian',
]

// Per-category enums mirrored from JSDoc schemas in `src/lib/records/*.js`.
export const VULNERABILITY_CLASS_ENUM = [
  'rce', 'privesc', 'sqli', 'xss', 'auth-bypass', 'ssrf', 'dos', 'info-disclosure',
]
export const SEVERITY_ENUM = ['critical', 'high', 'medium', 'low', 'informational']
export const EXPLOIT_AVAILABILITY_ENUM = ['none', 'poc', 'weaponized', 'in-the-wild', 'kit']
export const INITIAL_ACCESS_VECTOR_ENUM = ['phishing', 'rdp', 'vulnerability', 'supply_chain', 'unknown']
export const PAYMENT_STATUS_ENUM = ['paid', 'refused', 'negotiating', 'undisclosed']
export const CONFIDENCE_ENUM = ['high', 'medium', 'low']

const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/

export function regionForCountry(name) {
  const c = ALL_COUNTRIES.find(c => c.name === name)
  if (!c) throw new Error(`Unknown country: "${name}". Add it to data.js ALL_COUNTRIES and mirror here.`)
  return c.region
}

export function isIsoDate(s) {
  return typeof s === 'string' && ISO_DATE_RE.test(s) && !Number.isNaN(Date.parse(s))
}

/**
 * Returns an array of error strings for a record's tag fields. Empty = valid.
 * Universal across categories: validates the 5 shared fields (industry, region,
 * country, threat_group, dates). Per-category enums layered on top.
 */
export function validateRecordTags(record, { categoryId } = {}) {
  const errors = []

  const ind = record.victim_industry ?? record.target_industry ?? record.company_industry
  if (ind != null && !INDUSTRIES.includes(ind)) {
    errors.push(`industry "${ind}" not in INDUSTRIES`)
  }

  const reg = record.victim_region ?? record.target_region ?? record.company_region
  if (reg != null && !ALL_REGIONS.includes(reg)) {
    errors.push(`region "${reg}" not in ALL_REGIONS`)
  }

  const cty = record.victim_country ?? record.target_country ?? record.company_country
  if (cty != null && !ALL_COUNTRY_NAMES.includes(cty)) {
    errors.push(`country "${cty}" not in ALL_COUNTRIES`)
  }

  if (record.threat_group != null && !THREAT_GROUPS.includes(record.threat_group)) {
    errors.push(`threat_group "${record.threat_group}" not in THREAT_GROUPS`)
  }

  for (const k of Object.keys(record)) {
    if (k.endsWith('_at') && record[k] != null && !isIsoDate(record[k])) {
      errors.push(`${k} "${record[k]}" is not ISO 8601 (YYYY-MM-DD)`)
    }
  }

  if (categoryId === 'vulnerability') {
    if (record.vulnerability_class != null && !VULNERABILITY_CLASS_ENUM.includes(record.vulnerability_class)) {
      errors.push(`vulnerability_class "${record.vulnerability_class}" not in enum`)
    }
    if (record.severity != null && !SEVERITY_ENUM.includes(record.severity)) {
      errors.push(`severity "${record.severity}" not in enum`)
    }
    if (record.exploit_availability != null && !EXPLOIT_AVAILABILITY_ENUM.includes(record.exploit_availability)) {
      errors.push(`exploit_availability "${record.exploit_availability}" not in enum`)
    }
    if (typeof record.cvss_v3_score === 'number' && (record.cvss_v3_score < 0 || record.cvss_v3_score > 10)) {
      errors.push(`cvss_v3_score ${record.cvss_v3_score} out of range 0..10`)
    }
  }

  if (categoryId === 'ransomware') {
    if (record.initial_access_vector != null && !INITIAL_ACCESS_VECTOR_ENUM.includes(record.initial_access_vector)) {
      errors.push(`initial_access_vector "${record.initial_access_vector}" not in enum`)
    }
    if (record.payment_status != null && !PAYMENT_STATUS_ENUM.includes(record.payment_status)) {
      errors.push(`payment_status "${record.payment_status}" not in enum`)
    }
    if (record.confidence != null && !CONFIDENCE_ENUM.includes(record.confidence)) {
      errors.push(`confidence "${record.confidence}" not in enum`)
    }
  }

  return errors
}
