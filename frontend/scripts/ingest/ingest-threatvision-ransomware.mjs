// Ingest SOCRadar ThreatVision /ransomware/victims → ransomware records.
//
// Auth:        ?key=<THREATVISION_RANSOMWARE_KEY> query param
// Endpoint:    /ransomware/victims (Postman export, 2026-05-08)
// Pagination:  page (1-indexed) + limit
// Date format: YYYY-MM-DD (input) → ISO (output)
//
// Behavior:
//   - Without THREATVISION_BASE_URL or THREATVISION_RANSOMWARE_KEY → clean
//     skip { skipped: true }. Lets CI run end-to-end before secrets exist.
//   - With creds → pages /ransomware/victims, normalizes, writes JSON to
//     src/data/generated/ransomware_records.json.
//
// Per-record field mappings in normalize.mjs are still TODO until first live
// response — when that happens, fill them in. The plumbing here is final.

import { createThreatVisionClient } from './_shared/threatvision-client.mjs'
import {
  normalizeRansomwareRecord,
  NormalizationError,
} from './_shared/normalize.mjs'
import { writeRecords } from './_shared/write-records.mjs'

const CATEGORY = 'ransomware'
const SOURCE = 'SOCRadar ThreatVision'
const ENDPOINT = '/ransomware/victims'

const WINDOW_DAYS = Number(process.env.INGEST_WINDOW_DAYS ?? 30)
const PAGE_SIZE = Number(process.env.INGEST_PAGE_SIZE ?? 100)
const MAX_PAGES = Number(process.env.INGEST_MAX_PAGES ?? 1000)
const DEBUG_DUMP = process.env.INGEST_DEBUG_DUMP === '1'

export async function ingestRansomware() {
  const apiKey = process.env.THREATVISION_RANSOMWARE_KEY
  const baseUrl = process.env.THREATVISION_BASE_URL

  if (!apiKey || !baseUrl) {
    return {
      category: CATEGORY,
      source: SOURCE,
      count: 0,
      ok: true,
      skipped: true,
      reason: !apiKey
        ? 'THREATVISION_RANSOMWARE_KEY not set'
        : 'THREATVISION_BASE_URL not set',
    }
  }

  const client = createThreatVisionClient({ apiKey, baseUrl })

  const since = new Date(Date.now() - WINDOW_DAYS * 86_400_000)
    .toISOString()
    .slice(0, 10)

  // Per Postman: /ransomware/victims accepts start_date (YYYY-MM-DD), page, limit.
  const query = { start_date: since }

  const normalized = []
  const failures = []
  let pages = 0
  let itemsPath = null

  for await (const page of client.getPaginated(ENDPOINT, query, { pageSize: PAGE_SIZE, maxPages: MAX_PAGES })) {
    pages++
    if (!itemsPath) itemsPath = page.itemsPath
    if (DEBUG_DUMP && pages === 1) {
      // Save the first response for shape inspection. Gitignored via convention.
      const { writeFileSync, mkdirSync } = await import('fs')
      const { join, dirname } = await import('path')
      const { fileURLToPath } = await import('url')
      const dir = join(dirname(fileURLToPath(import.meta.url)), '_debug')
      mkdirSync(dir, { recursive: true })
      writeFileSync(join(dir, 'ransomware-page1.json'), JSON.stringify(page.response, null, 2))
    }
    for (const raw of page.items) {
      try {
        normalized.push(normalizeRansomwareRecord(raw))
      } catch (err) {
        failures.push({
          id: raw?.id ?? raw?.victim_name ?? '<unknown>',
          reason: err instanceof NormalizationError ? err.message : String(err),
        })
      }
    }
  }

  const { path, count } = writeRecords(CATEGORY, normalized, SOURCE, {
    dateField: 'disclosed_at',
  })
  return {
    category: CATEGORY,
    source: SOURCE,
    count,
    ok: true,
    pages,
    items_path: itemsPath,
    failures: failures.length,
    failure_examples: failures.slice(0, 5),
    path,
  }
}

// Direct invocation: `node scripts/ingest/ingest-threatvision-ransomware.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestRansomware().then(
    (result) => {
      console.log(JSON.stringify(result, null, 2))
      process.exit(0)
    },
    (err) => {
      console.error(err.stack || err.message)
      process.exit(1)
    },
  )
}
