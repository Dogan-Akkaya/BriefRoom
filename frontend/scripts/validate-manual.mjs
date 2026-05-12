// Validates every JSON file under src/data/manual/. Schema (required fields
// per item type), tag vocabulary, ID uniqueness across all files, ISO 8601
// dates. Same gate semantics as validate-records.mjs — exits 0 on pass, 1 on
// any error.
//
// Run from frontend/: `node scripts/validate-manual.mjs`

import { readFileSync, readdirSync, existsSync, statSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'
import {
  INDUSTRIES,
  ALL_REGIONS,
  CATEGORIES_IDS,
  isIsoDate,
} from './ingest/_shared/tag-vocabulary.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const MANUAL_DIR = join(__dirname, '..', 'src', 'data', 'manual')

const errors = []
const fail = (msg) => { console.error('✗ ' + msg); errors.push(msg) }

console.log('=== Brief Room — Manual Data Validation ===\n')

if (!existsSync(MANUAL_DIR)) {
  console.log(`No ${MANUAL_DIR} yet — pass.`)
  process.exit(0)
}

// Recurse subdirectories (e.g. src/data/manual/global-reports/*.json).
function* walkJson(dir) {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('_')) continue
    const full = join(dir, name)
    const stat = statSync(full)
    if (stat.isDirectory()) yield* walkJson(full)
    else if (stat.isFile() && name.endsWith('.json')) yield full
  }
}

const files = [...walkJson(MANUAL_DIR)]

if (!files.length) {
  console.log('No JSON files in src/data/manual/ — pass.')
  process.exit(0)
}

const seenIds = new Map()  // id → file (for cross-file dup detection)

for (const filePath of files) {
  const filename = relative(MANUAL_DIR, filePath)
  let payload
  try {
    payload = JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (err) {
    fail(`${filename}: not valid JSON (${err.message})`)
    continue
  }

  const fileSource = payload?.source
  const items = Array.isArray(payload?.items) ? payload.items : []
  console.log(`-- ${filename}: ${items.length} items (source: ${fileSource ?? '<missing>'})`)

  if (!fileSource) {
    fail(`${filename}: missing top-level "source" field`)
  }

  for (const [i, item] of items.entries()) {
    const ctx = `${filename}#${i}`
    validateItem(item, ctx, fileSource, seenIds)
  }
}

console.log(errors.length ? `\n✗ ${errors.length} error(s)` : '\n✓ All manual items valid')
process.exit(errors.length ? 1 : 0)

// ---------------------------------------------------------------------------

function validateItem(item, ctx, fileSource, seenIds) {
  if (!item || typeof item !== 'object') {
    fail(`${ctx}: not an object`)
    return
  }

  // Required base fields.
  if (!item.id) fail(`${ctx}: missing "id"`)
  if (!item.type) fail(`${ctx}: missing "type"`)
  if (!item.title) fail(`${ctx}: missing "title"`)
  if (!item.source && !fileSource) fail(`${ctx}: missing "source" (and no file-level source)`)

  // Type-specific checks.
  if (!['stat', 'chart', 'report'].includes(item.type)) {
    fail(`${ctx}: bad type "${item.type}" — must be stat | chart | report`)
  }
  if (item.type === 'chart') validateChart(item, ctx)
  if (item.type === 'stat') validateStat(item, ctx)

  // Cross-file ID uniqueness.
  if (item.id) {
    const prev = seenIds.get(item.id)
    if (prev) fail(`${ctx}: duplicate id "${item.id}" — also in ${prev}`)
    else seenIds.set(item.id, ctx)
  }

  // Tag vocabularies. industry/region may be empty (cards may be global or
  // sector-agnostic). threat_type[] must be non-empty so the item surfaces
  // in at least one slice grid.
  validateTagsArray(item.industry, INDUSTRIES, 'industry', ctx, false)
  validateTagsArray(item.region, ALL_REGIONS, 'region', ctx, false)
  validateTagsArray(item.threat_type, CATEGORIES_IDS, 'threat_type', ctx, item.type !== 'report')

  // ISO 8601 date format on every *_at field.
  for (const k of Object.keys(item)) {
    if (k.endsWith('_at') && item[k] != null && !isIsoDate(item[k])) {
      fail(`${ctx}: ${k} "${item[k]}" is not ISO 8601 (YYYY-MM-DD)`)
    }
  }
}

function validateChart(item, ctx) {
  if (!item.dataset) {
    fail(`${ctx}: chart missing "dataset"`)
    return
  }
  if (!Array.isArray(item.dataset.labels) || item.dataset.labels.length === 0) {
    fail(`${ctx}: chart dataset.labels missing or empty`)
  }
  if (!Array.isArray(item.dataset.series) || item.dataset.series.length === 0) {
    fail(`${ctx}: chart dataset.series missing or empty`)
    return
  }
  for (const [i, s] of item.dataset.series.entries()) {
    if (!s.name) fail(`${ctx}: series[${i}] missing name`)
    if (!Array.isArray(s.values)) {
      fail(`${ctx}: series[${i}] values must be array`)
    } else if (s.values.length !== item.dataset.labels.length) {
      fail(`${ctx}: series[${i}] values length ${s.values.length} ≠ labels length ${item.dataset.labels.length}`)
    }
  }
  if (item.preferred_chart && !['bar', 'line', 'area', 'pie'].includes(item.preferred_chart)) {
    fail(`${ctx}: bad preferred_chart "${item.preferred_chart}"`)
  }
}

function validateStat(item, ctx) {
  const cs = item.card_style ?? 'number'
  if (!['number', 'sparkline', 'bar', 'quote'].includes(cs)) {
    fail(`${ctx}: bad card_style "${cs}"`)
    return
  }
  if (cs === 'number' && !item.value) fail(`${ctx}: number stat missing "value"`)
  if (cs === 'quote' && !item.quote && !item.value) fail(`${ctx}: quote stat needs "quote" or "value"`)
  if ((cs === 'sparkline' || cs === 'bar') && !Array.isArray(item.spark)) {
    fail(`${ctx}: ${cs} stat missing "spark" array`)
  }
}

function validateTagsArray(arr, vocab, name, ctx, requireNonEmpty) {
  if (arr == null) {
    if (requireNonEmpty) fail(`${ctx}: missing "${name}" array`)
    return
  }
  if (!Array.isArray(arr)) {
    fail(`${ctx}: "${name}" must be an array`)
    return
  }
  if (requireNonEmpty && arr.length === 0) {
    fail(`${ctx}: "${name}" is empty`)
  }
  for (const tag of arr) {
    if (!vocab.includes(tag)) {
      fail(`${ctx}: ${name} "${tag}" not in vocabulary`)
    }
  }
}
