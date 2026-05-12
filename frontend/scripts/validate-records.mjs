// Validates the JSON records produced by ingestion under src/data/generated/.
// Schema (required fields) + tag-vocabulary checks per category, plus ISO 8601
// date format and duplicate-id detection.
//
// Run from frontend/: `node scripts/validate-records.mjs`
// Exits 0 on success, 1 on any error.
//
// Empty src/data/generated/ → clean pass (no ingestion has run yet).

import { readFileSync, readdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { validateRecordTags } from './ingest/_shared/tag-vocabulary.mjs'

const __dirname = dirname(fileURLToPath(import.meta.url))
const GENERATED_DIR = join(__dirname, '..', 'src', 'data', 'generated')

// Per-category required fields. Mirrors the JSDoc schema atop each
// src/lib/records/<category>.js file. Add a category here when its first
// ingestor lands.
const REQUIRED_FIELDS = {
  ransomware: [
    'id', 'occurred_at', 'disclosed_at',
    'victim_industry', 'victim_region', 'victim_country',
    'threat_group', 'payment_status', 'source', 'confidence',
  ],
  vulnerability: [
    'cve_id', 'disclosed_at', 'vendor', 'product',
    'cvss_v3_score', 'vulnerability_class', 'severity',
    'exploit_availability', 'in_cisa_kev', 'source',
  ],
}

const errors = []
const fail = (msg) => { console.error('✗ ' + msg); errors.push(msg) }

console.log('=== Brief Room — Records Validation ===\n')

if (!existsSync(GENERATED_DIR)) {
  console.log(`No ${GENERATED_DIR} yet — pass (no ingestion has run).`)
  process.exit(0)
}

const files = readdirSync(GENERATED_DIR).filter(f => f.endsWith('_records.json'))
if (!files.length) {
  console.log('No *_records.json files yet — pass (no ingestion has run).')
  process.exit(0)
}

for (const file of files) {
  const filePath = join(GENERATED_DIR, file)
  let payload
  try {
    payload = JSON.parse(readFileSync(filePath, 'utf8'))
  } catch (err) {
    fail(`${file}: not valid JSON (${err.message})`)
    continue
  }

  const categoryId = payload?.category
  const records = payload?.records ?? []
  console.log(`-- ${file}: ${records.length} records (category: ${categoryId ?? '<missing>'})`)

  if (!categoryId) {
    fail(`${file}: missing top-level "category" field`)
    continue
  }

  const required = REQUIRED_FIELDS[categoryId]
  if (!required) {
    console.log(`   (no required-field schema for "${categoryId}" yet — only tag/date checks applied)`)
  }

  const ids = new Set()
  for (const [i, rec] of records.entries()) {
    const ctx = `${file}#${i}`
    if (required) {
      for (const f of required) {
        if (rec[f] == null) fail(`${ctx}: missing required field "${f}"`)
      }
    }

    const id = rec.id ?? rec.cve_id
    if (id != null) {
      if (ids.has(id)) fail(`${ctx}: duplicate id "${id}"`)
      ids.add(id)
    }

    for (const e of validateRecordTags(rec, { categoryId })) {
      fail(`${ctx}: ${e}`)
    }
  }
}

console.log(errors.length ? `\n✗ ${errors.length} error(s)` : '\n✓ All records valid')
process.exit(errors.length ? 1 : 0)
