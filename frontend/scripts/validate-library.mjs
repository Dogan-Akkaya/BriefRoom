// Validates Brief Room's Intelligence Library schema + coverage.
// Run from the `frontend/` directory: `node scripts/validate-library.mjs`
// Exits 0 on success, 1 on failure.
// Mirrors DATA_GUIDE.md Section F.

import { readFileSync } from 'fs'

const INDUSTRIES = [
  'Financial Services', 'Healthcare', 'Technology', 'Government',
  'Manufacturing', 'Energy & Utilities', 'Retail & E-Commerce',
  'Telecommunications', 'Education', 'Transportation',
]
const ALL_REGIONS = ['North America', 'Europe', 'Middle East', 'Asia Pacific', 'Latin America', 'Africa']
const CATEGORIES = [
  { id: 'ransomware', label: 'Ransomware', hasData: true },
  { id: 'phishing', label: 'Phishing', hasData: true },
  { id: 'infostealer', label: 'Infostealer', hasData: true },
  { id: 'logs_on_sale', label: 'Logs on Sale', hasData: true },
  { id: 'data_leaks', label: 'Data Leaks', hasData: true },
  { id: 'employee_exposure', label: 'Employee Exposure', hasData: true },
  { id: 'dark_web_mentions', label: 'Dark Web', hasData: true },
  { id: 'vulnerability', label: 'Vulnerability', hasData: true },
  { id: 'ddos', label: 'DDoS', hasData: true },
  { id: 'supply_chain', label: 'Supply Chain', hasData: true },
]
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

let src = readFileSync(new URL('../src/lib/intelligenceLibrary.js', import.meta.url), 'utf8')
// Strip every relative-path import (./data, ./manualData, …). The eval injects
// the symbols those modules export as function arguments below — Vite-only
// constructs (import.meta.glob in manualData.js) never get evaluated here, so
// MANUAL_* arrives as empty arrays. validate-manual.mjs covers the manual data
// separately.
src = src.replace(/^import\s*\{[^}]+\}\s*from\s*['"]\.\/[^'"]+['"]\s*;?\s*$/gm, '')

const fn = eval(
  `(function(INDUSTRIES, ALL_REGIONS, CATEGORIES, MONTHS, MANUAL_LIBRARY_ITEMS, MANUAL_REPORT_ITEMS, MANUAL_REPORT_RAW_BY_ID) {
    ${src.replace(/export const /g, 'var ').replace(/export /g, '')}
    return { INTELLIGENCE_LIBRARY, popularCharts, reports, globalReports, reportById, sliceItems, crossSliceItems, crossSliceCounts }
  })`
)
const lib = fn(INDUSTRIES, ALL_REGIONS, CATEGORIES, MONTHS, [], [], {})

let errors = 0
const fail = (msg) => { console.error('\u2717 ' + msg); errors++ }

console.log('=== Brief Room — Intelligence Library Validation ===\n')

console.log('--- Coverage (target: \u226512 per dimension value) ---')
for (const i of INDUSTRIES) {
  const n = lib.sliceItems('industry', i).length
  console.log(`  industry:${i.padEnd(24)} ${n}`)
  if (n < 12) fail(`industry "${i}" has only ${n} items (expected \u226512)`)
}
for (const r of ALL_REGIONS) {
  const n = lib.sliceItems('region', r).length
  console.log(`  region:${r.padEnd(26)} ${n}`)
  if (n < 12) fail(`region "${r}" has only ${n} items (expected \u226512)`)
}
for (const t of CATEGORIES.map(c => c.id)) {
  const n = lib.sliceItems('threat_type', t).length
  console.log(`  threat_type:${t.padEnd(20)} ${n}`)
  if (n < 12) fail(`threat_type "${t}" has only ${n} items (expected \u226512)`)
}

const featured = lib.popularCharts()
console.log(`\nFeatured charts: ${featured.length}`)
if (featured.length !== 12) fail(`Expected 12 featured charts, got ${featured.length}`)

if (typeof lib.reports === 'function') {
  console.log(`Report items:    ${lib.reports().length}`)
}

console.log('\n--- Schema checks ---')
const ids = new Set()
for (const item of lib.INTELLIGENCE_LIBRARY) {
  if (!item.id) { fail(`item missing id: ${JSON.stringify(item).slice(0, 80)}`); continue }
  if (ids.has(item.id)) fail(`duplicate id: ${item.id}`)
  ids.add(item.id)
  if (!['stat', 'chart', 'report'].includes(item.type)) fail(`${item.id}: bad type ${item.type}`)
  if (!item.source) fail(`${item.id}: missing source`)
  if (!item.title) fail(`${item.id}: missing title`)
  // Dimension arrays are required for stat + chart items. Reports may have
  // empty dimensions because GLOBAL_REPORTS aren't sector/region-scoped today.
  if (item.type !== 'report') {
    if (!Array.isArray(item.industry) || !item.industry.length) fail(`${item.id}: empty industry[]`)
    if (!Array.isArray(item.region) || !item.region.length) fail(`${item.id}: empty region[]`)
    if (!Array.isArray(item.threat_type) || !item.threat_type.length) fail(`${item.id}: empty threat_type[]`)
  } else {
    // Reports: at minimum a threat_type tag so slice queries can reach them.
    if (!Array.isArray(item.threat_type)) fail(`${item.id}: report missing threat_type[]`)
  }
  if (item.type === 'chart' || item.type === 'report') {
    if (!item.dataset) fail(`${item.id}: ${item.type} missing dataset`)
    if (item.dataset && (!item.dataset.labels || !item.dataset.series)) fail(`${item.id}: dataset missing labels/series`)
  }
  if (item.type === 'stat') {
    const cs = item.card_style || 'number'
    if (!['number', 'sparkline', 'bar', 'quote'].includes(cs)) fail(`${item.id}: bad card_style ${cs}`)
    if (cs === 'quote' && !item.quote && !item.value) fail(`${item.id}: quote card needs quote or value`)
    if ((cs === 'sparkline' || cs === 'bar') && !item.spark) fail(`${item.id}: ${cs} card missing spark`)
    if (cs === 'number' && !item.value) fail(`${item.id}: number card missing value`)
  }
  if (item.title && item.title.includes('%IND%')) fail(`${item.id}: unexpanded %IND% in title`)
  if (item.title && item.title.includes('%REG%')) fail(`${item.id}: unexpanded %REG% in title`)

  for (const tag of item.industry || []) {
    if (!INDUSTRIES.includes(tag)) fail(`${item.id}: industry "${tag}" not in INDUSTRIES`)
  }
  for (const tag of item.region || []) {
    if (!ALL_REGIONS.includes(tag)) fail(`${item.id}: region "${tag}" not in ALL_REGIONS`)
  }
  for (const tag of item.threat_type || []) {
    if (!CATEGORIES.some(c => c.id === tag)) fail(`${item.id}: threat_type "${tag}" not in CATEGORIES`)
  }
}

console.log(`\nTotal items: ${lib.INTELLIGENCE_LIBRARY.length}`)
console.log(errors ? `\n\u2717 ${errors} error(s)` : '\n\u2713 All checks passed')
process.exit(errors ? 1 : 0)
