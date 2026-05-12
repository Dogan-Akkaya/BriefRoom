// Canonical taxonomy mapping for Global-reports-inputs/*.json.
//
// The upstream extraction agent produces tags that don't always match our
// canonical vocabularies in `tag-vocabulary.mjs` (which mirror `data.js`).
// This module is the single source of truth for taxonomy drift — every
// `mapXxx` lowers an input value into our canonical world and preserves the
// original (where useful) in `extra_tags` so search/context isn't lost.
//
// When this file's maps reach near-zero (i.e. upstream has aligned with the
// AGENT-FEEDBACK.md taxonomy), the transformer becomes pure rename.

import { INDUSTRIES, ALL_REGIONS, CATEGORIES_IDS } from './tag-vocabulary.mjs'

// ---------- threat_type ----------

// Off-vocab inputs → canonical CATEGORIES_IDS values. Extra tag preserved.
const THREAT_TYPE_REWRITE = {
  bec:                  { to: ['phishing'],              tag: 'bec' },
  'crypto-crime':       { to: ['data_leaks'],            tag: 'crypto-crime' },
  bots:                 { to: ['ddos'],                  tag: 'bots' },
  credential_stuffing:  { to: ['infostealer', 'phishing'], tag: 'credential-stuffing' },
  api_attacks:          { to: ['vulnerability'],         tag: 'api-attacks' },
  quishing:             { to: ['phishing'],              tag: 'quishing' },
  vishing:              { to: ['phishing'],              tag: 'vishing' },
  smishing:             { to: ['phishing'],              tag: 'smishing' },
}

/**
 * Lower a raw threatType[] array to canonical threat_type[] + extra tags.
 * If after mapping the array is empty, falls back to threat_types derived
 * from `fallbackCategory` so the item never becomes un-sliceable.
 *
 * @param {string[]} rawArray
 * @param {string} [fallbackCategory]   raw category to derive fallback threat_type from
 * @returns {{ threat_types: string[], extra_tags: string[] }}
 */
export function mapThreatTypes(rawArray, fallbackCategory) {
  const canonical = new Set()
  const extras = new Set()
  for (const raw of rawArray || []) {
    if (CATEGORIES_IDS.includes(raw)) {
      canonical.add(raw)
      continue
    }
    const rule = THREAT_TYPE_REWRITE[raw]
    if (rule) {
      for (const t of rule.to) canonical.add(t)
      if (rule.tag) extras.add(rule.tag)
    }
    // Unknown values are silently dropped (validator catches them upstream).
  }
  if (canonical.size === 0 && fallbackCategory) {
    const fb = mapCategory(fallbackCategory).threat_types
    for (const t of fb) canonical.add(t)
  }
  return { threat_types: [...canonical], extra_tags: [...extras] }
}

// ---------- region ----------

const REGION_REWRITE = {
  Global:          { to: [...ALL_REGIONS],     tag: 'global' },
  MENA:            { to: ['Middle East'],      tag: 'mena' },
  LATAM:           { to: ['Latin America'],    tag: 'latam' },
}

/**
 * Lower raw region[] to canonical 6. `Global` expands to all 6 (so the item
 * surfaces in every regional slice). MENA/LATAM are aliases.
 *
 * @param {string[]} rawArray
 * @returns {{ regions: string[], extra_tags: string[] }}
 */
export function mapRegions(rawArray) {
  const canonical = new Set()
  const extras = new Set()
  for (const raw of rawArray || []) {
    if (ALL_REGIONS.includes(raw)) {
      canonical.add(raw)
      continue
    }
    const rule = REGION_REWRITE[raw]
    if (rule) {
      for (const r of rule.to) canonical.add(r)
      if (rule.tag) extras.add(rule.tag)
    }
  }
  return { regions: [...canonical], extra_tags: [...extras] }
}

// ---------- industry ----------

const INDUSTRY_REWRITE = {
  Insurance:      { to: 'Financial Services',  tag: 'industry:insurance' },
  Defense:        { to: 'Government',          tag: 'industry:defense' },
  Hospitality:    { to: 'Retail & E-Commerce', tag: 'industry:hospitality' },
  Pharma:         { to: 'Healthcare',          tag: 'industry:pharma' },
  Pharmaceutical: { to: 'Healthcare',          tag: 'industry:pharma' },
  Entertainment:  { to: null,                  tag: 'industry:entertainment' },
  Gaming:         { to: null,                  tag: 'industry:gaming' },
  Construction:   { to: null,                  tag: 'industry:construction' },
  Agriculture:    { to: null,                  tag: 'industry:agriculture' },
  'Public Sector':{ to: 'Government',          tag: 'industry:public-sector' },
  Legal:          { to: null,                  tag: 'industry:legal' },
  Media:          { to: null,                  tag: 'industry:media' },
  'Non-Profit':   { to: null,                  tag: 'industry:non-profit' },
}

/**
 * Lower raw industry[] to canonical 10. Unknowns drop their original into
 * tags as `industry:<slug>` so search keeps working.
 *
 * @param {string[]} rawArray
 * @returns {{ industries: string[], extra_tags: string[] }}
 */
export function mapIndustries(rawArray) {
  const canonical = new Set()
  const extras = new Set()
  for (const raw of rawArray || []) {
    if (INDUSTRIES.includes(raw)) {
      canonical.add(raw)
      continue
    }
    const rule = INDUSTRY_REWRITE[raw]
    if (rule) {
      if (rule.to) canonical.add(rule.to)
      if (rule.tag) extras.add(rule.tag)
    } else if (raw) {
      // Unknown — preserve in tags as a slug.
      extras.add('industry:' + String(raw).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''))
    }
  }
  return { industries: [...canonical], extra_tags: [...extras] }
}

// ---------- category ----------

/**
 * Display chip list used by Reports.jsx. Derived dynamically at runtime
 * (so adding a new chip = adding a CATEGORY_REWRITE entry, no UI edit).
 */
export const DISPLAY_CATEGORIES = [
  'Ransomware', 'Phishing', 'Vulnerabilities', 'Threat Landscape',
  'Threat Actors', 'Identity', 'AI Security', 'Supply Chain', 'DDoS',
  'Detection', 'Data Breaches', 'eCrime', 'Dark Web', 'Compliance', 'Insurance',
]

const CATEGORY_REWRITE = {
  // Direct passthroughs (already canonical).
  'Ransomware':                  { display: 'Ransomware',       threat_types: ['ransomware'] },
  'Threat Landscape':            { display: 'Threat Landscape', threat_types: ['ransomware', 'phishing', 'vulnerability'] },
  'Threat Actors':               { display: 'Threat Actors',    threat_types: ['ransomware', 'dark_web_mentions'] },
  'Supply Chain':                { display: 'Supply Chain',     threat_types: ['supply_chain'] },
  'Detection':                   { display: 'Detection',        threat_types: ['data_leaks'] },
  'Data Breaches':               { display: 'Data Breaches',    threat_types: ['data_leaks'] },
  'eCrime':                      { display: 'eCrime',           threat_types: ['ransomware', 'phishing'] },
  'Dark Web':                    { display: 'Dark Web',         threat_types: ['dark_web_mentions', 'logs_on_sale'] },
  'AI Security':                 { display: 'AI Security',      threat_types: ['vulnerability'] },

  // Consolidations.
  'Phishing & BEC':              { display: 'Phishing',         threat_types: ['phishing'] },
  'Phishing':                    { display: 'Phishing',         threat_types: ['phishing'] },
  'Vulnerabilities & Zero-Days': { display: 'Vulnerabilities',  threat_types: ['vulnerability'] },
  'Vulnerabilities':             { display: 'Vulnerabilities',  threat_types: ['vulnerability'] },
  'Identity & Access':           { display: 'Identity',         threat_types: ['employee_exposure', 'infostealer'] },
  'Identity':                    { display: 'Identity',         threat_types: ['employee_exposure', 'infostealer'] },
  'DDoS & Network':              { display: 'DDoS',             threat_types: ['ddos'] },
  'DDoS':                        { display: 'DDoS',             threat_types: ['ddos'] },
  'Bots & Automation':           { display: 'DDoS',             threat_types: ['ddos'] },
  'Regulatory & Compliance':     { display: 'Compliance',       threat_types: ['data_leaks'] },
  'Compliance':                  { display: 'Compliance',       threat_types: ['data_leaks'] },
  'Cyber Insurance':             { display: 'Insurance',        threat_types: ['data_leaks'] },
  'Insurance':                   { display: 'Insurance',        threat_types: ['data_leaks'] },
  'Cryptocurrency Crime':        { display: 'eCrime',           threat_types: ['data_leaks'] },
  'Security Awareness':          { display: 'Phishing',         threat_types: ['phishing'] },
  'IoT & Mobile':                { display: 'Vulnerabilities',  threat_types: ['vulnerability'] },
  'OT / ICS':                    { display: 'Vulnerabilities',  threat_types: ['vulnerability', 'ransomware'] },
  'Insider Threats':             { display: 'Data Breaches',    threat_types: ['employee_exposure', 'data_leaks'] },
  'Cloud Security':              { display: 'Vulnerabilities',  threat_types: ['vulnerability'] },
  'Geopolitics':                 { display: 'Threat Actors',    threat_types: ['dark_web_mentions'] },
  'Incident Response':           { display: 'Detection',        threat_types: ['data_leaks'] },
  'Other':                       { display: 'Threat Landscape', threat_types: ['data_leaks'] },
  'Intrusion':                   { display: 'Threat Landscape', threat_types: ['vulnerability', 'ransomware'] },
}

/**
 * Map a free-text input category to a display chip + threat_type[] derivation.
 *
 * @param {string} raw
 * @returns {{ display_category: string, threat_types: string[] }}
 */
export function mapCategory(raw) {
  const rule = CATEGORY_REWRITE[raw]
  if (rule) {
    return { display_category: rule.display, threat_types: rule.threat_types }
  }
  // Unknown category — surface to the validator but keep the item alive.
  return { display_category: 'Threat Landscape', threat_types: ['data_leaks'] }
}

// ---------- input-vocab whitelist (for the inputs validator) ----------

/** All raw values we accept on input. Anything else surfaces as an error. */
export const INPUT_THREAT_TYPE_VOCAB = new Set([
  ...CATEGORIES_IDS,
  ...Object.keys(THREAT_TYPE_REWRITE),
])

export const INPUT_REGION_VOCAB = new Set([
  ...ALL_REGIONS,
  ...Object.keys(REGION_REWRITE),
])

export const INPUT_INDUSTRY_VOCAB = new Set([
  ...INDUSTRIES,
  ...Object.keys(INDUSTRY_REWRITE),
])

export const INPUT_CATEGORY_VOCAB = new Set(Object.keys(CATEGORY_REWRITE))
