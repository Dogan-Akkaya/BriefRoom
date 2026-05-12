// Normalizers — pure functions that map raw ThreatVision records to the
// record-schema shape `frontend/src/lib/records/<category>.js` documents.
//
// PHASE 1 SCAFFOLD. Per-category mappings below are placeholders against
// invented TV field names. Once a sample TV response is on hand, finish the
// field-by-field mapping and add an industry/country translation table if
// TV's vocabulary differs from ours (it usually does — e.g. "FinTech" vs.
// "Financial Services"). Output is validated against tag-vocabulary on the
// way out so drift surfaces immediately.

import { validateRecordTags, ALL_COUNTRIES } from './tag-vocabulary.mjs'

export class NormalizationError extends Error {
  constructor(message, raw) {
    super(message)
    this.name = 'NormalizationError'
    this.raw = raw
  }
}

/**
 * Map a raw ThreatVision ransomware record to RansomwareIncident shape (see
 * src/lib/records/ransomware.js JSDoc for the target schema).
 *
 * TODO(tv-spec): finalize once real payload is known. Likely needs:
 *   - industry mapping table (TV vocab → INDUSTRIES)
 *   - country normalization (e.g. "USA" → "United States")
 *   - threat_group canonicalization (case + alias matching)
 *
 * @param {object} raw
 * @returns {object} record matching RansomwareIncident shape
 */
export function normalizeRansomwareRecord(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new NormalizationError('expected raw record to be an object', raw)
  }

  const country = mapCountry(raw.victim_country ?? raw.country)
  const region = country ? regionFromCountry(country) : undefined

  const record = {
    id: raw.id ?? raw.incident_id ?? raw.uuid,
    occurred_at: toIsoDate(raw.occurred_at ?? raw.attack_date ?? raw.detected_at),
    disclosed_at: toIsoDate(raw.disclosed_at ?? raw.publication_date ?? raw.leak_posted_at),
    victim_name: raw.victim_name ?? raw.victim,
    victim_domain: raw.victim_domain ?? raw.domain,
    victim_industry: mapIndustry(raw.victim_industry ?? raw.industry),
    victim_region: region,
    victim_country: country,
    threat_group: raw.threat_group ?? raw.actor ?? raw.group_name,
    initial_access_vector: raw.initial_access_vector,
    cve_exploited: raw.cve_exploited,
    encryption_confirmed: Boolean(raw.encryption_confirmed),
    data_exfiltration_confirmed: Boolean(raw.data_exfiltration_confirmed),
    leak_site_posted: Boolean(raw.leak_site_posted ?? raw.leak_site_url),
    leak_site_url: raw.leak_site_url,
    ransom_demand_usd: numericOrUndef(raw.ransom_demand_usd ?? raw.ransom_demand),
    ransom_paid_usd: numericOrUndef(raw.ransom_paid_usd ?? raw.ransom_paid),
    payment_status: raw.payment_status ?? 'undisclosed',
    source: raw.source ?? 'SOCRadar ThreatVision',
    confidence: raw.confidence ?? 'medium',
  }

  const errs = validateRecordTags(record, { categoryId: 'ransomware' })
  if (errs.length) {
    throw new NormalizationError(`tag validation failed: ${errs.join('; ')}`, raw)
  }
  return record
}

/**
 * Map a raw ThreatVision `/darkweb/news` record to DarkWebMention shape (see
 * src/lib/records/dark_web_mentions.js JSDoc).
 *
 * TODO(tv-spec): finalize once a real /darkweb/news response body is on hand.
 * The Postman export reveals filters (news_countries, news_regions,
 * news_categories, news_tags, news_post_owners) but not the response field
 * names. This mapping speculates on plausible field names; the validator
 * surfaces drift loudly.
 *
 * Date format: DD-MM-YYYY in the API, normalized to ISO on output.
 *
 * @param {object} raw
 * @returns {object} record matching DarkWebMention shape
 */
export function normalizeDarkWebRecord(raw) {
  if (!raw || typeof raw !== 'object') {
    throw new NormalizationError('expected raw record to be an object', raw)
  }

  const record = {
    id: raw.id ?? raw.news_id ?? raw.uuid,
    observed_at: toIsoDate(raw.published_date ?? raw.date ?? raw.observed_at, { format: 'DD-MM-YYYY' }),
    channel_type: raw.channel_type ?? mapChannelType(raw.source_type ?? raw.platform),
    channel_name: raw.channel_name ?? raw.source_name ?? raw.platform ?? 'unknown',
    channel_url: raw.channel_url ?? raw.url ?? raw.source_url,
    post_type: raw.post_type ?? mapPostType(raw.news_categories?.[0] ?? raw.category),
    brand_mentioned: raw.brand_mentioned ?? raw.target ?? raw.victim ?? raw.title ?? '<unknown>',
    mention_topic: raw.mention_topic ?? 'brand',
    data_types_offered: Array.isArray(raw.data_types_offered) ? raw.data_types_offered : undefined,
    price_usd: numericOrUndef(raw.price_usd ?? raw.price),
    sample_included: Boolean(raw.sample_included),
    actor_handle: raw.actor_handle ?? raw.post_owner ?? raw.threat_actor ?? '<unknown>',
    sentiment: raw.sentiment ?? 'discussion',
    source: raw.source ?? 'SOCRadar ThreatVision (darkweb)',
    confidence: raw.confidence ?? 'medium',
  }

  const errs = validateRecordTags(record, { categoryId: 'dark_web_mentions' })
  if (errs.length) {
    throw new NormalizationError(`tag validation failed: ${errs.join('; ')}`, raw)
  }
  return record
}

// --- helpers ---

// TODO(tv-spec): replace with a real translation table once TV's industry
// vocabulary is known. Until then, pass-through and let validateRecordTags
// flag any out-of-vocabulary value loudly.
function mapIndustry(value) {
  return value
}

// TODO(tv-spec): same — country aliasing (e.g. "USA"/"US" → "United States",
// "UK" → "United Kingdom") goes here.
function mapCountry(value) {
  return value
}

// TODO(tv-spec): refine with real channel taxonomy.
function mapChannelType(value) {
  if (!value) return 'forum'
  const v = String(value).toLowerCase()
  if (v.includes('telegram')) return 'telegram'
  if (v.includes('market')) return 'marketplace'
  if (v.includes('paste')) return 'paste'
  if (v.includes('irc') || v.includes('discord')) return 'irc'
  if (v.includes('private')) return 'private'
  return 'forum'
}

// TODO(tv-spec): refine with real category-to-post_type mapping.
function mapPostType(category) {
  if (!category) return 'chatter'
  const v = String(category).toLowerCase()
  if (v.includes('sale') || v.includes('sell')) return 'sale'
  if (v.includes('leak') || v.includes('breach')) return 'leak'
  if (v.includes('doxx')) return 'doxx'
  if (v.includes('recruit')) return 'recruitment'
  return 'chatter'
}

function regionFromCountry(name) {
  const c = ALL_COUNTRIES.find(c => c.name === name)
  return c ? c.region : undefined
}

/**
 * Normalize a date value to ISO 8601 (`YYYY-MM-DD`).
 * Handles:
 *   - Already-ISO strings (`'2025-01-01'`, `'2025-01-01T10:30:00Z'`)
 *   - Day-first European format (`'01-01-2025'`) — used by ThreatVision
 *     `/darkweb/news`. Caller can force this with `format: 'DD-MM-YYYY'`,
 *     or it's auto-detected from the `\d{2}-\d{2}-\d{4}` pattern.
 *   - JS Date objects
 *
 * Returns undefined for falsy / unparseable inputs.
 *
 * @param {unknown} value
 * @param {{ format?: 'DD-MM-YYYY' | 'YYYY-MM-DD' }} [options]
 */
export function toIsoDate(value, { format } = {}) {
  if (!value) return undefined
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value.toISOString().slice(0, 10)
  }
  if (typeof value !== 'string') return undefined

  // Already ISO (date or full timestamp).
  if (/^\d{4}-\d{2}-\d{2}/.test(value)) return value.slice(0, 10)

  // DD-MM-YYYY → YYYY-MM-DD.
  const eu = value.match(/^(\d{2})-(\d{2})-(\d{4})$/)
  if (eu && (format === 'DD-MM-YYYY' || !format)) {
    return `${eu[3]}-${eu[2]}-${eu[1]}`
  }

  // Last resort: native parser (handles RFC 2822 etc.). Locale-dependent for
  // ambiguous inputs — caller should pass `format` if they know.
  const d = new Date(value)
  return Number.isNaN(d.getTime()) ? undefined : d.toISOString().slice(0, 10)
}

function numericOrUndef(v) {
  if (v == null) return undefined
  const n = Number(v)
  return Number.isFinite(n) ? n : undefined
}
