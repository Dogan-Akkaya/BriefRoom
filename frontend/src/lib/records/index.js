// Record layer — per-category ground-truth incident / sighting arrays.
//
// Populate these as real data becomes available. Builder's generateData()
// prefers records (when any exist for the category) and falls back to the
// seeded RNG otherwise, so empty arrays are a safe no-op.
//
// See each per-category file for the record schema.

import { RANSOMWARE_RECORDS } from './ransomware'
import { PHISHING_RECORDS } from './phishing'
import { INFOSTEALER_RECORDS } from './infostealer'
import { LOGS_ON_SALE_RECORDS } from './logs_on_sale'
import { DATA_LEAKS_RECORDS } from './data_leaks'
import { EMPLOYEE_EXPOSURE_RECORDS } from './employee_exposure'
import { DARK_WEB_MENTIONS_RECORDS } from './dark_web_mentions'
import { VULNERABILITY_RECORDS } from './vulnerability'
import { DDOS_RECORDS } from './ddos'
import { SUPPLY_CHAIN_RECORDS } from './supply_chain'

export const RECORDS_BY_CATEGORY = {
  ransomware:        RANSOMWARE_RECORDS,
  phishing:          PHISHING_RECORDS,
  infostealer:       INFOSTEALER_RECORDS,
  logs_on_sale:      LOGS_ON_SALE_RECORDS,
  data_leaks:        DATA_LEAKS_RECORDS,
  employee_exposure: EMPLOYEE_EXPOSURE_RECORDS,
  dark_web_mentions: DARK_WEB_MENTIONS_RECORDS,
  vulnerability:     VULNERABILITY_RECORDS,
  ddos:              DDOS_RECORDS,
  supply_chain:      SUPPLY_CHAIN_RECORDS,
}

/**
 * Returns the raw record array for a category id.
 * @param {string} catId — one of CATEGORIES[].id
 * @returns {Array<object>} empty array if category unknown or not yet populated
 */
export function getRecords(catId) {
  return RECORDS_BY_CATEGORY[catId] || []
}

/**
 * Counts records across all categories. Useful for a "how much real data?" readout.
 * @returns {{ total: number, byCategory: Record<string, number> }}
 */
export function recordStats() {
  const byCategory = {}
  let total = 0
  for (const [cat, arr] of Object.entries(RECORDS_BY_CATEGORY)) {
    byCategory[cat] = arr.length
    total += arr.length
  }
  return { total, byCategory }
}
