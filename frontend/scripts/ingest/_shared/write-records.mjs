// Atomic JSON writer for ingested records + manifest updates.
//
// Each ingestor calls writeRecords(category, records, source) once per run.
// Output:  frontend/src/data/generated/<category>_records.json
// Manifest: frontend/src/data/generated/_manifest.json (shared across ingestors)

import { writeFileSync, readFileSync, existsSync, mkdirSync, renameSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
// Path: scripts/ingest/_shared → up 3 → frontend, then src/data/generated
export const GENERATED_DIR = join(__dirname, '..', '..', '..', 'src', 'data', 'generated')

export function ensureGeneratedDir() {
  if (!existsSync(GENERATED_DIR)) mkdirSync(GENERATED_DIR, { recursive: true })
}

/**
 * Write a category's records as JSON. Sorted by date desc for deterministic
 * git diffs. Atomic: writes to .tmp then renames.
 *
 * @param {string} categoryId
 * @param {object[]} records
 * @param {string} source           display attribution, e.g. 'SOCRadar ThreatVision'
 * @param {object} [options]
 * @param {string} [options.dateField]   field to sort by (auto-detected from first *_at field)
 * @returns {{ path: string, count: number }}
 */
export function writeRecords(categoryId, records, source, { dateField } = {}) {
  ensureGeneratedDir()
  const field = dateField || pickDateField(records)
  const sorted = field
    ? [...records].sort((a, b) => String(b[field] ?? '').localeCompare(String(a[field] ?? '')))
    : records

  const payload = {
    category: categoryId,
    source,
    generated_at: new Date().toISOString(),
    count: sorted.length,
    records: sorted,
  }
  const finalPath = join(GENERATED_DIR, `${categoryId}_records.json`)
  const tmpPath = `${finalPath}.tmp`
  writeFileSync(tmpPath, JSON.stringify(payload, null, 2) + '\n')
  renameSync(tmpPath, finalPath)
  return { path: finalPath, count: sorted.length }
}

/**
 * Replace the run manifest atomically. Caller passes the full set of source
 * entries for this run (don't merge with previous — orchestrator is the
 * single writer per run).
 *
 * @param {Array<{ category: string, source: string, count: number, ok: boolean, error?: string }>} sources
 */
export function writeManifest(sources) {
  ensureGeneratedDir()
  const manifestPath = join(GENERATED_DIR, '_manifest.json')
  const payload = {
    last_run_at: new Date().toISOString(),
    sources,
  }
  const tmpPath = `${manifestPath}.tmp`
  writeFileSync(tmpPath, JSON.stringify(payload, null, 2) + '\n')
  renameSync(tmpPath, manifestPath)
  return manifestPath
}

export function readManifest() {
  const manifestPath = join(GENERATED_DIR, '_manifest.json')
  if (!existsSync(manifestPath)) return null
  try {
    return JSON.parse(readFileSync(manifestPath, 'utf8'))
  } catch {
    return null
  }
}

function pickDateField(records) {
  if (!records.length) return null
  for (const k of Object.keys(records[0])) {
    if (k.endsWith('_at') && typeof records[0][k] === 'string') return k
  }
  return null
}
