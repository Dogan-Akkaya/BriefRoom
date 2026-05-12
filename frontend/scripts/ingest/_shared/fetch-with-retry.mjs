// Wraps native fetch with exponential backoff, timeout, and Retry-After awareness.
// Generic — both the ThreatVision client and any future public-API ingestor
// depend on it. Node 20+ ships fetch + AbortController natively, so no deps.

const DEFAULT_RETRIES = 3
const DEFAULT_TIMEOUT_MS = 30_000
const BASE_BACKOFF_MS = 1000

/**
 * @param {string} url
 * @param {RequestInit & { retries?: number, timeoutMs?: number, label?: string }} [options]
 * @returns {Promise<Response>}
 */
export async function fetchWithRetry(url, options = {}) {
  const {
    retries = DEFAULT_RETRIES,
    timeoutMs = DEFAULT_TIMEOUT_MS,
    label = url,
    ...fetchOptions
  } = options

  let lastError = null

  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), timeoutMs)
    try {
      const res = await fetch(url, { ...fetchOptions, signal: controller.signal })
      clearTimeout(timer)

      if (res.ok) return res

      const retryAfterHeader = res.headers.get('retry-after')
      const retryable = res.status === 429 || res.status >= 500
      if (retryable && attempt < retries) {
        const wait = retryAfterHeader
          ? parseRetryAfter(retryAfterHeader)
          : BASE_BACKOFF_MS * 2 ** attempt
        await sleep(wait)
        continue
      }

      const body = await safeText(res)
      throw new Error(
        `[${label}] HTTP ${res.status} ${res.statusText}\n${body.slice(0, 500)}`
      )
    } catch (err) {
      clearTimeout(timer)
      lastError = err
      const isAbort = err && (err.name === 'AbortError' || /aborted/i.test(err.message || ''))
      const transient = isAbort || /fetch failed|ECONNRESET|ETIMEDOUT|ENOTFOUND/.test(err.message || '')
      if (transient && attempt < retries) {
        await sleep(BASE_BACKOFF_MS * 2 ** attempt)
        continue
      }
      // Surface undici's hidden `cause` so debugging doesn't require a stack dive.
      if (err?.cause) {
        const causeBits = [err.cause.code, err.cause.errno, err.cause.message].filter(Boolean).join(' ')
        const wrapped = new Error(`[${label}] ${err.message} — cause: ${causeBits}`)
        wrapped.cause = err.cause
        throw wrapped
      }
      throw err
    }
  }
  throw lastError ?? new Error(`fetchWithRetry exhausted retries for ${url}`)
}

function parseRetryAfter(value) {
  const n = Number(value)
  if (!Number.isNaN(n)) return Math.max(0, n * 1000)
  const date = Date.parse(value)
  if (!Number.isNaN(date)) return Math.max(0, date - Date.now())
  return BASE_BACKOFF_MS
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms))

async function safeText(res) {
  try { return await res.text() } catch { return '' }
}
