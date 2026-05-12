// Transformer: Global-reports-inputs/*.json → src/data/manual/global-reports/<reportId>.json
//
// Reads each upstream agent drop file, canonicalizes tags via canonical-tags.mjs,
// scores cards and keeps the top 10 in the library (rest stay in the file for
// the /reports/:reportId drill-down route), renames camelCase → snake_case,
// writes one snake_case JSON per report. Atomic writes via .tmp + rename.
// Reconciles by deleting any output file whose input no longer exists.
//
// Run from frontend/: `node scripts/ingest/ingest-global-reports.mjs`

import { readFileSync, readdirSync, writeFileSync, existsSync, mkdirSync, renameSync, unlinkSync } from 'fs'
import { join, dirname, basename } from 'path'
import { fileURLToPath } from 'url'
import {
  mapThreatTypes,
  mapRegions,
  mapIndustries,
  mapCategory,
} from './_shared/canonical-tags.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
// frontend/scripts/ingest → up 3 → repo root → Global-reports-inputs
const INPUTS_DIR = join(__dirname, '..', '..', '..', 'Global-reports-inputs')
// frontend/scripts/ingest → up 2 → frontend → src/data/manual/global-reports
const OUTPUT_DIR = join(__dirname, '..', '..', 'src', 'data', 'manual', 'global-reports')

const TOP_N = 10
const SPARK_TARGET_LENGTH = 6

console.log('=== Brief Room — Global Reports Transformer ===\n')

if (!existsSync(INPUTS_DIR)) {
  console.log(`No ${INPUTS_DIR} — nothing to ingest.`)
  process.exit(0)
}

if (!existsSync(OUTPUT_DIR)) {
  mkdirSync(OUTPUT_DIR, { recursive: true })
  console.log(`Created ${OUTPUT_DIR}`)
}

const inputFiles = readdirSync(INPUTS_DIR)
  .filter(f => f.endsWith('.json') && !f.startsWith('_'))

let totalReports = 0
let totalLibraryItems = 0
let totalRetainedCards = 0
const producedFiles = new Set()

for (const filename of inputFiles) {
  const payload = JSON.parse(readFileSync(join(INPUTS_DIR, filename), 'utf8'))
  const out = transformReport(payload)
  if (!out) continue

  const outFile = `${payload.reportId}.json`
  const outPath = join(OUTPUT_DIR, outFile)
  writeAtomic(outPath, JSON.stringify(out, null, 2) + '\n')
  producedFiles.add(outFile)
  totalReports += 1
  totalLibraryItems += out.items.filter(it => it.type !== 'report' && it.library_include !== false).length
  totalRetainedCards += out.items.filter(it => it.type !== 'report' && it.library_include === false).length

  const libCount = out.items.filter(it => it.type !== 'report' && it.library_include !== false).length
  const retCount = out.items.filter(it => it.type !== 'report' && it.library_include === false).length
  console.log(`✓ ${payload.reportId.padEnd(48)} library=${libCount} retained=${retCount}`)
}

// Reconcile: delete stale outputs whose input is gone.
const existingOutputs = readdirSync(OUTPUT_DIR).filter(f => f.endsWith('.json') && !f.startsWith('_'))
let deleted = 0
for (const f of existingOutputs) {
  if (!producedFiles.has(f)) {
    unlinkSync(join(OUTPUT_DIR, f))
    deleted += 1
    console.log(`- ${f} (stale, removed)`)
  }
}

console.log(`\nTransformed ${totalReports} reports → ${OUTPUT_DIR}`)
console.log(`  Library items: ${totalLibraryItems} (top ${TOP_N} per report)`)
console.log(`  Retained-only cards (drill-down): ${totalRetainedCards}`)
if (deleted) console.log(`  Stale outputs deleted: ${deleted}`)

// ---------------------------------------------------------------------------

function transformReport(payload) {
  const reportId = payload.reportId
  if (!reportId) {
    console.error(`! skipping file without reportId`)
    return null
  }

  const reportColor = payload.color
  const reportExtractedOn = payload.extractedOn
  const reportPubDate = payload.publicationDate

  // Score and split cards.
  const cards = Array.isArray(payload.cards) ? payload.cards : []
  const scored = cards.map((card, idx) => ({ card, idx, score: scoreCard(card) }))
  scored.sort((a, b) => (b.score - a.score) || (a.idx - b.idx))
  const topIds = new Set(scored.slice(0, TOP_N).map(s => s.card.id))

  // Compute report-level canonical tags (union of curated cards').
  let reportRegions = new Set()
  let reportIndustries = new Set()
  let reportThreats = new Set()
  const reportExtraTags = new Set()

  // Build per-card library items, finding hero chart candidate as we go.
  const libraryItems = []
  let heroChartCard = null  // { card, scoreEntry } — top-scoring chart in top-N
  for (const { card, score } of scored) {
    const inLibrary = topIds.has(card.id)
    const item = transformCard(card, { library_include: inLibrary })
    libraryItems.push(item)

    if (inLibrary) {
      for (const r of item.region || []) reportRegions.add(r)
      for (const i of item.industry || []) reportIndustries.add(i)
      for (const t of item.threat_type || []) reportThreats.add(t)
      for (const tg of item.tags || []) reportExtraTags.add(tg)
      if (!heroChartCard && card.cardStyle === 'chart' && card.dataset?.series?.length) {
        heroChartCard = { card, score }
      }
    }
  }

  // Build report entity.
  const reportCategoryRaw = inferReportCategory(cards) || 'Threat Landscape'
  const { display_category, threat_types: catThreats } = mapCategory(reportCategoryRaw)
  for (const t of catThreats) reportThreats.add(t)

  // If no top-N card carries regions, fall back to ALL_REGIONS via 'Global' semantics.
  if (reportRegions.size === 0) {
    const { regions } = mapRegions(['Global'])
    for (const r of regions) reportRegions.add(r)
  }

  // Hero dataset (copied from top-scoring chart card if one in top-N).
  let heroDataset = null
  let heroPreferredChart = null
  let heroKind = 'stat'
  if (heroChartCard) {
    heroDataset = heroChartCard.card.dataset
    heroPreferredChart = heroChartCard.card.preferredChart || 'bar'
    heroKind = 'chart'
  }

  const description = synthesizeDescription(payload, cards, topIds)

  const reportEntity = {
    type: 'report',
    id: `gr-${reportId}`,
    title: payload.title,
    year: payload.year,
    category: display_category,
    color: reportColor,
    description,
    external_url: payload.sourceUrl,
    preferred_chart: heroPreferredChart,
    dataset: heroDataset,
    industry: [...reportIndustries],
    region: [...reportRegions],
    threat_type: [...reportThreats],
    tags: ['external-report', ...reportExtraTags],
    featured: false,
    real: true,
    updated_at: reportPubDate || reportExtractedOn,
    report_meta: {
      report_id: reportId,
      organization_id: payload.organizationId,
      publication_date: reportPubDate,
      extracted_on: reportExtractedOn,
      source_url: payload.sourceUrl,
      card_count_total: cards.length,
      card_count_in_library: topIds.size,
      hero_kind: heroKind,
      hero_card_id: heroChartCard?.card.id || null,
    },
  }

  // Final file payload — file-level fields cascade onto items via manualData.js.
  return {
    source: payload.source,
    source_short: payload.sourceShort,
    year: payload.year,
    real: true,
    notes: `Transformed from Global-reports-inputs/${payload.reportId}.json by ingest-global-reports.mjs at ${new Date().toISOString()}. Curated top ${topIds.size} of ${cards.length} cards into library.`,
    items: [reportEntity, ...libraryItems],
  }
}

function scoreCard(card) {
  if (!card || typeof card !== 'object') return -1000
  let s = 0
  if (card.featured === true) s += 100
  if (card.cardStyle === 'chart' && card.dataset?.series?.length > 0) s += 60
  if (card.cardStyle === 'sparkline' && Array.isArray(card.spark) && card.spark.length >= 4) s += 40
  if (card.cardStyle === 'number') s += 30
  if (card.cardStyle === 'quote' && typeof card.quote === 'string' && card.quote.length > 0) s += 20
  if (card.comparison) s += 10
  if (card.value && (card.valueUnit === 'percent' || card.valueUnit === 'usd')) s += 5
  const dlen = card.description?.length || 0
  if (dlen >= 120 && dlen <= 400) s += 1
  if (card.cardStyle === 'text') s -= 50
  const mappedThreats = mapThreatTypes(card.threatType, card.category).threat_types
  if (mappedThreats.length === 0) s -= 30
  return s
}

function transformCard(card, { library_include }) {
  const { threat_types, extra_tags: threatExtraTags } =
    mapThreatTypes(card.threatType, card.category)
  const { regions, extra_tags: regionExtraTags } = mapRegions(card.region)
  const { industries, extra_tags: industryExtraTags } = mapIndustries(card.industry)

  // Card style → top-level type.
  let cardStyle = card.cardStyle
  let topType = 'stat'
  if (cardStyle === 'chart') topType = 'chart'
  // 'text' becomes a quote variant if there's nothing else
  if (cardStyle === 'text') cardStyle = card.value ? 'number' : 'quote'

  // Spark downsampling.
  let spark = card.spark
  const sparkOriginalLength = Array.isArray(card.spark) ? card.spark.length : null
  if (cardStyle === 'sparkline' || cardStyle === 'bar') {
    spark = downsampleSpark(card.spark, SPARK_TARGET_LENGTH)
    // If spark ended up too short, demote to a 'number' card if a value exists.
    if (!spark || spark.length < 4) {
      if (card.value != null) {
        cardStyle = 'number'
        spark = undefined
      }
    }
  }

  const tags = new Set([
    ...(Array.isArray(card.tags) ? card.tags : []),
    ...threatExtraTags,
    ...regionExtraTags,
    ...industryExtraTags,
  ])
  if (sparkOriginalLength && sparkOriginalLength !== SPARK_TARGET_LENGTH && (cardStyle === 'sparkline' || cardStyle === 'bar')) {
    tags.add(`spark-from-${sparkOriginalLength}`)
  }

  const item = {
    type: topType,
    id: card.id,
    title: card.title,
    description: card.description,
    source: card.source,
    source_short: card.sourceShort,
    color: card.color,
    year: card.year,
    category: card.category,
    industry: industries,
    region: regions,
    threat_type: threat_types,
    tags: [...tags],
    featured: false,           // never auto-feature into Popular grid
    real: true,
    library_include,
    updated_at: card.updatedAt,
    page_or_section: card.pageOrSection,
    comparison: card.comparison ?? null,
    trend: card.trend ?? null,
    value_unit: card.valueUnit ?? null,
  }

  if (topType === 'chart') {
    item.dataset = card.dataset
    item.preferred_chart = card.preferredChart || 'bar'
  } else {
    item.card_style = cardStyle
    if (cardStyle === 'number' || cardStyle === 'sparkline' || cardStyle === 'bar') {
      if (card.value != null) item.value = card.value
    }
    if (cardStyle === 'quote') {
      // Fall back: value > description-truncated when upstream is missing the quote string.
      const q = card.quote
        || card.value
        || (typeof card.description === 'string'
          ? card.description.split('. ')[0].slice(0, 200)
          : null)
      if (q) item.quote = q
      else if (card.value) item.value = card.value  // last-resort signal so validator passes
    }
    if ((cardStyle === 'sparkline' || cardStyle === 'bar') && spark) {
      item.spark = spark
    }
  }

  return item
}

function downsampleSpark(spark, target) {
  if (!Array.isArray(spark) || spark.length === 0) return null
  const n = spark.length
  if (n === target) return [...spark]
  if (n < target) {
    // Pad with edge repeats — caller may demote to 'number' if too sparse.
    if (n < 4) return spark.slice()
    const out = new Array(target)
    for (let i = 0; i < target; i++) out[i] = spark[Math.round(i * (n - 1) / (target - 1))]
    return out
  }
  // n > target: evenly-spaced indices.
  const out = new Array(target)
  for (let i = 0; i < target; i++) out[i] = spark[Math.round(i * (n - 1) / (target - 1))]
  return out
}

function inferReportCategory(cards) {
  const counts = {}
  for (const c of cards) {
    if (!c.category) continue
    counts[c.category] = (counts[c.category] || 0) + 1
  }
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return sorted.length ? sorted[0][0] : null
}

function synthesizeDescription(payload, cards, topIds) {
  // Prefer a card-derived description if the report itself has no abstract.
  // Pick the highest-scoring 'number' or 'quote' card's description if short enough.
  const candidates = cards.filter(c => topIds.has(c.id) && typeof c.description === 'string' && c.description.length > 60 && c.description.length < 280)
  if (candidates.length) return candidates[0].description.replace(/\s+/g, ' ').trim()
  return `${payload.title} — ${cards.length} extracted findings.`
}

function writeAtomic(finalPath, content) {
  const tmp = finalPath + '.tmp'
  writeFileSync(tmp, content)
  renameSync(tmp, finalPath)
}
