// ThreatVision client — sole owner of TV auth, pagination, and rate-limit handling.
//
// Auth: query-parameter `?key=<api_key>` on every request (confirmed by the
//   2026-05-08 Postman export — not a header).
// Pagination: page-based, 1-indexed, with optional `limit` (per endpoint).
// Termination: empty items, partial last page, or maxPages safety cap.
//
// One client instance per product API key (ransomware, darkweb, threat-actors
// each have their own key per the export).

import { fetchWithRetry } from './fetch-with-retry.mjs'

export class ThreatVisionAuthError extends Error {
  constructor(message) {
    super(message)
    this.name = 'ThreatVisionAuthError'
  }
}

// Auto-discovery candidates. Top-level first (e.g. `{ data: [...] }`), then
// nested (e.g. SOCRadar's `{ data: { news: [...] } }`). On match, the path is
// pinned for the rest of the run; subsequent ingestors hard-code via `itemsPath`.
const ITEMS_PATH_CANDIDATES = [
  'data',
  'results',
  'records',
  'items',
  'data.news',
  'data.victims',
  'data.items',
  'data.results',
  'data.records',
]

/**
 * Create a configured ThreatVision client.
 * Reads creds from env when not passed explicitly. Throws ThreatVisionAuthError
 * when either is missing so the orchestrator can decide between no-op (CI
 * without secrets) and crash.
 *
 * @param {object} config
 * @param {string} config.apiKey   product-specific key (RANSOMWARE / DARKWEB / etc.)
 * @param {string} [config.baseUrl] defaults to process.env.THREATVISION_BASE_URL
 */
export function createThreatVisionClient({ apiKey, baseUrl, minIntervalMs } = {}) {
  const _baseUrl = (baseUrl ?? process.env.THREATVISION_BASE_URL ?? '').replace(/\/+$/, '')
  if (!apiKey) throw new ThreatVisionAuthError('apiKey is required')
  if (!_baseUrl) throw new ThreatVisionAuthError('baseUrl is required (THREATVISION_BASE_URL)')

  // ThreatVision rate limit is 1 req/sec — default to 1100ms with a small
  // safety margin. Override via THREATVISION_MIN_INTERVAL_MS for tighter or
  // looser pacing. Set to 0 to disable.
  const _minInterval = minIntervalMs ?? Number(process.env.THREATVISION_MIN_INTERVAL_MS ?? 1100)
  let _lastRequestTs = 0

  async function pace() {
    if (_minInterval <= 0 || _lastRequestTs === 0) return
    const elapsed = Date.now() - _lastRequestTs
    const wait = _minInterval - elapsed
    if (wait > 0) await new Promise(r => setTimeout(r, wait))
  }

  /**
   * Single GET. Returns parsed JSON. Auth key is appended automatically.
   * Honors per-client rate limiting (`minIntervalMs`).
   * @param {string} path     e.g. '/ransomware/victims'
   * @param {object} [query]  serialised as URL search params (excluding `key`, which is added)
   */
  async function get(path, query) {
    await pace()
    _lastRequestTs = Date.now()
    const url = buildUrl(_baseUrl, path, { ...(query || {}), key: apiKey })
    const res = await fetchWithRetry(url, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      label: `ThreatVision ${path}`,
    })
    return await res.json()
  }

  /**
   * Iterate every page of a paginated endpoint. Yields `{ page, items, itemsPath, response }`
   * per page. Caller can break early; client stops automatically on empty
   * page, partial-last-page, or maxPages safety cap.
   *
   * Records-array auto-discovery: tries response keys 'data' → 'results' →
   * 'records' → 'items' on the first page until one matches; the matched key
   * is reused for subsequent pages and reported in the yielded `itemsPath`.
   *
   * @param {string} path
   * @param {object} [initialQuery]
   * @param {object} [options]
   * @param {string} [options.pageParam]   default 'page'
   * @param {number} [options.startPage]   default 1
   * @param {number} [options.pageSize]    if set, sent as `limit=<pageSize>`
   * @param {string} [options.itemsPath]   explicit envelope key; bypasses auto-discovery
   * @param {number} [options.maxPages]    safety cap, default 1000
   */
  async function* getPaginated(path, initialQuery = {}, options = {}) {
    const {
      pageParam = 'page',
      startPage = 1,
      pageSize,
      itemsPath: forcedPath,
      maxPages = 1000,
    } = options

    let page = startPage
    let knownPath = forcedPath || null
    let visited = 0

    while (true) {
      if (visited++ >= maxPages) {
        // Hit the page cap — stop cleanly. Caller decides whether this means
        // "all data consumed" (compare last page's item count to pageSize) or
        // "we deliberately capped for testing" (set maxPages explicitly).
        break
      }

      const query = { ...initialQuery, [pageParam]: page }
      if (pageSize != null) query.limit = pageSize

      const response = await get(path, query)
      const { items, path: usedPath } = extractItems(response, knownPath)
      if (!Array.isArray(items)) {
        const topKeys = Object.keys(response || {})
        const snippet = JSON.stringify(response, null, 2).slice(0, 1500)
        throw new Error(
          `Could not locate records array in ${path} response. ` +
          `Tried keys: ${ITEMS_PATH_CANDIDATES.join(', ')}. ` +
          `Top-level keys observed: ${topKeys.join(', ')}.\n` +
          `Response snippet:\n${snippet}`
        )
      }
      knownPath = usedPath

      yield { page, items, itemsPath: knownPath, response }

      if (items.length === 0) break
      if (pageSize != null && items.length < pageSize) break
      page++
    }
  }

  return { get, getPaginated, baseUrl: _baseUrl }
}

function buildUrl(base, path, query) {
  // Concatenate base + path rather than using URL relative-resolution. The
  // resolution rule (leading-slash means "from host root") would silently
  // strip a path component on the base URL — e.g. `new URL('/x', 'https://h/api/')`
  // resolves to `https://h/x`, not `https://h/api/x`. ThreatVision's base URL
  // includes `/api`, so we must preserve it.
  const cleanPath = path.startsWith('/') ? path.slice(1) : path
  const url = new URL(`${base}/${cleanPath}`)
  if (query) {
    for (const [k, v] of Object.entries(query)) {
      if (v == null) continue
      url.searchParams.set(k, String(v))
    }
  }
  return url.toString()
}

function extractItems(response, knownPath) {
  if (knownPath) {
    const arr = getByPath(response, knownPath)
    return { items: Array.isArray(arr) ? arr : null, path: knownPath }
  }
  for (const candidate of ITEMS_PATH_CANDIDATES) {
    const arr = getByPath(response, candidate)
    if (Array.isArray(arr)) return { items: arr, path: candidate }
  }
  return { items: null, path: null }
}

function getByPath(obj, path) {
  if (!path) return obj
  return path.split('.').reduce((acc, key) => (acc == null ? acc : acc[key]), obj)
}
