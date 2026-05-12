// Ingest SOCRadar ThreatVision /darkweb/news → dark_web_mentions records.
//
// Auth:        ?key=<THREATVISION_DARKWEB_KEY> query param
// Endpoint:    /darkweb/news (Postman export, 2026-05-08)
// Pagination:  page (1-indexed); no `limit` parameter documented
// Date format: DD-MM-YYYY (input) → ISO (output, handled in normalize.mjs)
//
// Behavior:
//   - Without THREATVISION_BASE_URL or THREATVISION_DARKWEB_KEY → clean skip.
//   - With creds → pages /darkweb/news, normalizes, writes JSON to
//     src/data/generated/dark_web_mentions_records.json.

import { createThreatVisionClient } from './_shared/threatvision-client.mjs'
import {
  normalizeDarkWebRecord,
  NormalizationError,
} from './_shared/normalize.mjs'
import { writeRecords } from './_shared/write-records.mjs'

const CATEGORY = 'dark_web_mentions'
const SOURCE = 'SOCRadar ThreatVision (darkweb)'
const ENDPOINT = '/darkweb/news'

const WINDOW_DAYS = Number(process.env.INGEST_WINDOW_DAYS ?? 30)

export async function ingestDarkWeb() {
  const apiKey = process.env.THREATVISION_DARKWEB_KEY
  const baseUrl = process.env.THREATVISION_BASE_URL

  if (!apiKey || !baseUrl) {
    return {
      category: CATEGORY,
      source: SOURCE,
      count: 0,
      ok: true,
      skipped: true,
      reason: !apiKey
        ? 'THREATVISION_DARKWEB_KEY not set'
        : 'THREATVISION_BASE_URL not set',
    }
  }

  const client = createThreatVisionClient({ apiKey, baseUrl })

  // Per Postman: /darkweb/news uses DD-MM-YYYY for start_date / end_date.
  const sinceISO = new Date(Date.now() - WINDOW_DAYS * 86_400_000)
    .toISOString()
    .slice(0, 10)
  const [y, m, d] = sinceISO.split('-')
  const sinceDDMMYYYY = `${d}-${m}-${y}`

  const query = { start_date: sinceDDMMYYYY }

  const normalized = []
  const failures = []
  let pages = 0
  let itemsPath = null

  // No `limit` advertised in the Postman export → don't pass pageSize, let the
  // soft-termination heuristic (empty page) stop us.
  for await (const page of client.getPaginated(ENDPOINT, query)) {
    pages++
    if (!itemsPath) itemsPath = page.itemsPath
    for (const raw of page.items) {
      try {
        normalized.push(normalizeDarkWebRecord(raw))
      } catch (err) {
        failures.push({
          id: raw?.id ?? raw?.title ?? '<unknown>',
          reason: err instanceof NormalizationError ? err.message : String(err),
        })
      }
    }
  }

  const { path, count } = writeRecords(CATEGORY, normalized, SOURCE, {
    dateField: 'observed_at',
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

// Direct invocation: `node scripts/ingest/ingest-threatvision-darkweb.mjs`
if (import.meta.url === `file://${process.argv[1]}`) {
  ingestDarkWeb().then(
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
