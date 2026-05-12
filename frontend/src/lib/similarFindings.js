// Cross-vendor comparability — given a "current" finding (or report), find
// other findings across other reports that measure the same kind of thing.
//
// Match heuristic (in priority order):
//   1. Same primary `threat_type[0]` (must overlap)
//   2. Same `value_unit` when both have one — compatible units only
//      (% with %, days with days, count with count); otherwise penalised
//   3. Same "card_style" / chart-type family (numbers vs charts) — soft bonus
//   4. Different `source` from the current item (the whole point is
//      vendor disagreement; same-vendor items just confirm themselves)
//
// We do *not* try to detect "same KPI semantically" — that requires a
// labelled taxonomy we don't have yet. The current heuristic surfaces
// findings on the same topic; the user reads titles to compare.

import { MANUAL_REPORT_RAW_BY_ID } from './manualData'

// Build a flat index of every chart/stat card across all manual reports
// once at module load. Each entry carries enough context (title, source,
// report_id) to render a thumbnail and route the click.
const ALL_FINDINGS = []
for (const [reportId, payload] of Object.entries(MANUAL_REPORT_RAW_BY_ID)) {
  const meta = payload.meta || {}
  const source = payload.source || meta.source
  const year = payload.year || meta.year
  const reportTitle = meta.title
  for (const card of payload.cards || []) {
    if (!card || (card.type !== 'chart' && card.type !== 'stat')) continue
    ALL_FINDINGS.push({
      ...card,
      _report_id: reportId,
      _report_title: reportTitle,
      _report_source: source,
      _report_year: year,
    })
  }
}

const sameUnit = (a, b) => {
  if (!a || !b) return false
  const na = String(a).toLowerCase().trim()
  const nb = String(b).toLowerCase().trim()
  if (na === nb) return true
  // Loose synonyms.
  const groups = [
    ['%', 'percent', 'percentage'],
    ['days', 'day'],
    ['hours', 'hour'],
    ['count', 'incidents', 'cases', 'breaches'],
    ['usd', '$', 'dollars'],
  ]
  for (const g of groups) if (g.includes(na) && g.includes(nb)) return true
  return false
}

// `current` should look like an item from MANUAL_REPORT_RAW_BY_ID[*].cards,
// optionally enriched with `_report_source` so we can dedupe same-vendor.
export function similarFindings(current, limit = 6) {
  if (!current) return []
  const currentThreat = Array.isArray(current.threat_type) ? current.threat_type[0] : null
  if (!currentThreat) return []  // without a primary tag we can't match meaningfully
  const currentSource = current._report_source || current.source
  const currentId = current.id

  const scored = []
  for (const f of ALL_FINDINGS) {
    if (f.id === currentId) continue
    if (currentSource && f._report_source === currentSource) continue
    const threats = Array.isArray(f.threat_type) ? f.threat_type : []
    if (!threats.includes(currentThreat)) continue

    let score = 1  // base — same threat_type match
    // Secondary threat overlap.
    if (Array.isArray(current.threat_type)) {
      for (let i = 1; i < current.threat_type.length; i++) {
        if (threats.includes(current.threat_type[i])) score += 0.5
      }
    }
    // Unit compatibility.
    if (current.value_unit && f.value_unit) {
      if (sameUnit(current.value_unit, f.value_unit)) score += 2
      else score -= 0.5
    }
    // Same kind of card (chart vs stat).
    if (f.type === current.type) score += 0.4
    // Prefer real/verified.
    if (f.real) score += 0.3
    // Recency bonus — newer years rank higher.
    const yr = parseInt(f._report_year, 10)
    if (!isNaN(yr)) score += Math.max(0, (yr - 2020) * 0.05)

    scored.push({ item: f, score })
  }

  scored.sort((a, b) => b.score - a.score)
  return scored.slice(0, limit).map((s) => s.item)
}
