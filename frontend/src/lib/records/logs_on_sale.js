// Record-level access-broker listings (initial-access-as-a-service on darknet markets).
//
// Schema:
// /**
//  * @typedef {Object} AccessListing
//  * @property {string} id
//  * @property {string} listed_at
//  * @property {string} last_seen_at
//  * @property {string} [sold_at]
//  * @property {string} marketplace                'XSS' / 'Exploit' / 'RAMP' / 'Telegram:...'
//  * @property {'RDP'|'VPN'|'Citrix'|'SSH'|'Cloud'|'WebShell'} access_type
//  * @property {'user'|'admin'|'domain-admin'|'root'} privilege_level
//  * @property {string} victim_industry
//  * @property {string} victim_region
//  * @property {string} victim_country
//  * @property {string} [victim_revenue_range]     '$10M-$50M' style
//  * @property {number} [victim_size_employees]
//  * @property {number} [price_usd]
//  * @property {'USD'|'BTC'|'XMR'} [price_currency]
//  * @property {string} seller_handle
//  * @property {'verified'|'established'|'new'|'unverified'} seller_reputation
//  * @property {number} [seller_rating]
//  * @property {'ransomware_affiliate'|'initial_access_broker'|'data_broker'|'nation_state'|'researcher'} [buyer_sector]
//  * @property {'exclusive'|'shared'} exclusivity
//  * @property {'listed'|'sold'|'pulled'} status
//  * @property {string} source
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const LOGS_ON_SALE_RECORDS = []
