// Validates every JSON file under Global-reports-inputs/.
//
// This is the FIRST gate in the pipeline — runs before transform. If inputs
// drift from the agreed schema, this fails the CI build with a pointer to
// AGENT-FEEDBACK.md so the upstream agent (and humans editing the folder)
// can fix at source.
//
// Exits 0 on pass, 1 on any error. If the inputs folder is missing (fresh
// clone with no upstream drop yet), exits 0 with a skip message.
//
// Run from frontend/: `node scripts/validate-global-reports-inputs.mjs`

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import {
  INPUT_THREAT_TYPE_VOCAB,
  INPUT_REGION_VOCAB,
  INPUT_INDUSTRY_VOCAB,
  INPUT_CATEGORY_VOCAB,
} from './ingest/_shared/canonical-tags.mjs'
import { sourceBrand } from '../src/lib/sourceBrandsData.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
// frontend/scripts → up 2 → repo root → Global-reports-inputs
const INPUTS_DIR = join(__dirname, '..', '..', 'Global-reports-inputs')

const errors = []
const warnings = []
const fail = (msg) => { console.error('✗ ' + msg); errors.push(msg) }
const warn = (msg) => { console.warn('! ' + msg); warnings.push(msg) }

console.log('=== Brief Room — Global Reports Inputs Validation ===\n')

if (!existsSync(INPUTS_DIR)) {
  console.log(`No ${INPUTS_DIR} yet — skipped (fresh environment is OK).`)
  process.exit(0)
}

const allFiles = readdirSync(INPUTS_DIR)
  .filter(f => f.endsWith('.json') && !f.startsWith('_'))

if (!allFiles.length) {
  console.log('No vendor JSON files in Global-reports-inputs/ — skipped.')
  process.exit(0)
}

const HEX_RE = /^#[0-9A-Fa-f]{6}$/
const ISO_DATE_RE = /^\d{4}-\d{2}-\d{2}$/
const VALID_CARD_STYLES = new Set(['number', 'chart', 'quote', 'sparkline', 'bar', 'text'])
const VALID_PREFERRED_CHART = new Set(['bar', 'line', 'area', 'pie', null, undefined])
const VALID_TREND = new Set(['increasing', 'decreasing', 'flat', 'unknown', 'stable', 'mixed', null, undefined])

const currentYear = new Date().getUTCFullYear()
const todayIso = new Date().toISOString().slice(0, 10)

const seenCardIds = new Map()  // id → filename
let totalCards = 0

for (const filename of allFiles) {
  const filePath = join(INPUTS_DIR, filename)
  let payload
  try {
    payload = JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (err) {
    fail(`${filename}: not valid JSON (${err.message})`)
    continue
  }

  validateReport(payload, filename)

  const cards = Array.isArray(payload?.cards) ? payload.cards : []
  totalCards += cards.length
  for (const [i, card] of cards.entries()) {
    validateCard(card, `${filename}#cards[${i}]`, payload)
  }
}

console.log(`\nFiles: ${allFiles.length}  Cards: ${totalCards}`)
if (warnings.length) console.log(`Warnings: ${warnings.length}`)
if (errors.length) {
  console.error(`\n✗ ${errors.length} error(s). See Global-reports-inputs/AGENT-FEEDBACK.md for canonical taxonomy.`)
  process.exit(1)
}
console.log('\n✓ All input files valid')
process.exit(0)

// ---------------------------------------------------------------------------

function validateReport(payload, filename) {
  if (!payload || typeof payload !== 'object') {
    fail(`${filename}: not an object`)
    return
  }

  // Required top-level fields.
  const required = ['reportId', 'title', 'source', 'sourceShort', 'year', 'sourceUrl', 'color']
  for (const k of required) {
    if (payload[k] == null || payload[k] === '') {
      fail(`${filename}: missing required field "${k}"`)
    }
  }

  // reportId matches filename stem.
  const stem = basename(filename, '.json')
  if (payload.reportId && payload.reportId !== stem) {
    fail(`${filename}: reportId "${payload.reportId}" does not match filename stem "${stem}"`)
  }

  // year sanity.
  if (typeof payload.year === 'number' && (payload.year < 2020 || payload.year > currentYear + 1)) {
    fail(`${filename}: year ${payload.year} outside [2020, ${currentYear + 1}]`)
  }

  // color hex.
  if (payload.color && !HEX_RE.test(payload.color)) {
    fail(`${filename}: color "${payload.color}" not #RRGGBB hex`)
  }

  // sourceUrl well-formed.
  if (payload.sourceUrl) {
    try {
      const u = new URL(payload.sourceUrl)
      if (u.protocol !== 'https:' && u.protocol !== 'http:') {
        fail(`${filename}: sourceUrl has unsupported protocol "${u.protocol}"`)
      }
    } catch {
      fail(`${filename}: sourceUrl "${payload.sourceUrl}" is not a valid URL`)
    }
  }

  // Dates.
  if (payload.extractedOn && !ISO_DATE_RE.test(payload.extractedOn)) {
    fail(`${filename}: extractedOn "${payload.extractedOn}" not ISO 8601 (YYYY-MM-DD)`)
  }
  if (payload.extractedOn && payload.extractedOn > todayIso) {
    warn(`${filename}: extractedOn "${payload.extractedOn}" is in the future`)
  }
  if (payload.publicationDate != null && !ISO_DATE_RE.test(payload.publicationDate)) {
    fail(`${filename}: publicationDate "${payload.publicationDate}" not ISO 8601 (or null)`)
  }

  // Brand resolves.
  if (payload.source && !sourceBrand(payload.source)) {
    fail(`${filename}: source "${payload.source}" has no entry in sourceBrandsData.mjs — add one before ingesting`)
  }
}

function validateCard(card, ctx, payload) {
  if (!card || typeof card !== 'object') {
    fail(`${ctx}: not an object`)
    return
  }

  // Required fields.
  const required = ['id', 'type', 'cardStyle', 'title', 'description', 'source', 'sourceShort',
                    'color', 'year', 'category', 'industry', 'region', 'threatType', 'tags']
  for (const k of required) {
    if (card[k] == null) fail(`${ctx}: missing "${k}"`)
  }

  // id uniqueness.
  if (card.id) {
    const prev = seenCardIds.get(card.id)
    if (prev) fail(`${ctx}: duplicate card id "${card.id}" — also in ${prev}`)
    else seenCardIds.set(card.id, ctx)
  }

  // type/cardStyle. Upstream uses `type` to mirror cardStyle for non-stat cards;
  // we accept either pattern (transformer routes by cardStyle, not type).
  const VALID_INPUT_TYPES = new Set(['stat', 'chart', 'sparkline', 'quote', 'bar', 'number'])
  if (card.type && !VALID_INPUT_TYPES.has(card.type)) {
    fail(`${ctx}: bad type "${card.type}"`)
  }
  if (card.cardStyle && !VALID_CARD_STYLES.has(card.cardStyle)) {
    fail(`${ctx}: bad cardStyle "${card.cardStyle}"`)
  }
  if (card.cardStyle === 'text') {
    warn(`${ctx}: cardStyle "text" — please convert to "quote" or "number" (see AGENT-FEEDBACK §6)`)
  }

  // Per-style constraints.
  if (card.cardStyle === 'number' && (card.value == null || card.value === '')) {
    fail(`${ctx}: number card missing "value"`)
  }
  if (card.cardStyle === 'quote' && (!card.quote || typeof card.quote !== 'string')) {
    // Some inputs use `value` or fall back to description — accept gracefully.
    if (!card.value && !card.description) {
      fail(`${ctx}: quote card missing "quote" string (and no value/description fallback)`)
    } else {
      warn(`${ctx}: quote card missing "quote" — transformer will fall back to value/description`)
    }
  }
  if (card.cardStyle === 'sparkline' || card.cardStyle === 'bar') {
    if (!Array.isArray(card.spark)) {
      // Transformer demotes these to 'number' if a `value` exists, drops otherwise.
      warn(`${ctx}: ${card.cardStyle} card missing "spark" array — transformer will demote to "number"`)
    } else {
      const n = card.spark.length
      if (n < 2 || n > 24) fail(`${ctx}: spark length ${n} outside [2, 24]`)
      else if (n < 4 || n > 12) warn(`${ctx}: spark length ${n} outside preferred [4, 12] (see AGENT-FEEDBACK §7)`)
    }
  }
  if (card.cardStyle === 'chart') {
    if (!card.dataset || typeof card.dataset !== 'object') {
      fail(`${ctx}: chart card missing "dataset"`)
    } else {
      if (!Array.isArray(card.dataset.labels) || card.dataset.labels.length < 1) {
        fail(`${ctx}: chart dataset.labels missing or empty`)
      }
      if (!Array.isArray(card.dataset.series) || card.dataset.series.length < 1) {
        fail(`${ctx}: chart dataset.series missing or empty`)
      } else {
        for (const [i, s] of card.dataset.series.entries()) {
          if (!Array.isArray(s.values)) {
            fail(`${ctx}: dataset.series[${i}].values not an array`)
          } else if (s.values.length !== card.dataset.labels.length) {
            fail(`${ctx}: dataset.series[${i}].values length ${s.values.length} ≠ labels length ${card.dataset.labels.length}`)
          }
        }
      }
    }
  }
  if (card.preferredChart != null && !VALID_PREFERRED_CHART.has(card.preferredChart)) {
    fail(`${ctx}: bad preferredChart "${card.preferredChart}"`)
  }
  if (card.trend != null && !VALID_TREND.has(card.trend)) {
    fail(`${ctx}: bad trend "${card.trend}"`)
  }
  if (card.featured != null && typeof card.featured !== 'boolean') {
    fail(`${ctx}: featured must be boolean, got ${typeof card.featured}`)
  }

  // Tag vocabularies.
  validateInputTags(card.threatType, INPUT_THREAT_TYPE_VOCAB, 'threatType', ctx)
  validateInputTags(card.region,     INPUT_REGION_VOCAB,      'region',     ctx)
  validateInputTags(card.industry,   INPUT_INDUSTRY_VOCAB,    'industry',   ctx)
  if (card.category && !INPUT_CATEGORY_VOCAB.has(card.category)) {
    warn(`${ctx}: category "${card.category}" not in canonical vocab — will fall back to "Threat Landscape"`)
  }

  // Brand resolves on the card too (some cards' source differs from report's).
  if (card.source && !sourceBrand(card.source)) {
    fail(`${ctx}: card source "${card.source}" has no brand entry`)
  }

  // Dates.
  if (card.updatedAt && !ISO_DATE_RE.test(card.updatedAt)) {
    fail(`${ctx}: updatedAt "${card.updatedAt}" not ISO 8601`)
  }
  if (card.updatedAt && card.updatedAt > todayIso) {
    warn(`${ctx}: updatedAt "${card.updatedAt}" is in the future`)
  }
}

function validateInputTags(arr, vocab, name, ctx) {
  if (arr == null) return  // required-field check above handles missing
  if (!Array.isArray(arr)) {
    fail(`${ctx}: "${name}" must be an array`)
    return
  }
  for (const tag of arr) {
    if (!vocab.has(tag)) {
      fail(`${ctx}: ${name} "${tag}" not in input vocab — add to canonical-tags.mjs or fix upstream`)
    }
  }
}
