// Record-level ransomware incidents.
// Intended to be fed by leak-site scraping / SOCRadar ThreatVision / vendor disclosures.
// When this array is non-empty, the Builder aggregates these records instead of
// calling the seeded RNG fallback.
//
// Schema:
// /**
//  * @typedef {Object} RansomwareIncident
//  * @property {string} id                         unique, stable
//  * @property {string} occurred_at                'YYYY-MM-DD'
//  * @property {string} disclosed_at               'YYYY-MM-DD'
//  * @property {string} [victim_name]              often redacted
//  * @property {string} [victim_domain]
//  * @property {string} victim_industry            must be in INDUSTRIES (data.js)
//  * @property {string} victim_region              must be in ALL_REGIONS
//  * @property {string} victim_country             must be in ALL_COUNTRIES[].name
//  * @property {number} [victim_size_employees]
//  * @property {string} [victim_revenue_range]     '$10M-$50M' style bucket
//  * @property {string} threat_group               must be in THREAT_GROUPS
//  * @property {'phishing'|'rdp'|'vulnerability'|'supply_chain'|'unknown'} [initial_access_vector]
//  * @property {string[]} [cve_exploited]          e.g. ['CVE-2024-12345']
//  * @property {boolean} encryption_confirmed
//  * @property {boolean} data_exfiltration_confirmed
//  * @property {boolean} leak_site_posted
//  * @property {string} [leak_site_url]
//  * @property {number} [ransom_demand_usd]
//  * @property {number} [ransom_paid_usd]
//  * @property {number} [recovery_days]
//  * @property {'paid'|'refused'|'negotiating'|'undisclosed'} payment_status
//  * @property {string} source                     e.g. 'SOCRadar ThreatVision 2026'
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const RANSOMWARE_RECORDS = []
