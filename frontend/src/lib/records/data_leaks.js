// Record-level data breaches / leaks.
//
// Schema:
// /**
//  * @typedef {Object} DataLeak
//  * @property {string} id
//  * @property {string} breach_date                when the breach actually happened
//  * @property {string} disclosed_at               when it became public
//  * @property {string} [detected_at]              when the victim detected it
//  * @property {string} victim_name
//  * @property {string} [victim_domain]
//  * @property {string} victim_industry
//  * @property {string} victim_region
//  * @property {string} victim_country
//  * @property {number} records_exposed
//  * @property {Array<'pii'|'financial'|'credentials'|'health'|'ip'|'source_code'>} data_types
//  * @property {'stolen_creds'|'phishing'|'misconfig'|'vulnerability'|'insider'|'physical'|'unknown'} root_cause
//  * @property {string} [cve_exploited]
//  * @property {number} detection_days             disclosed_at - breach_date
//  * @property {number} [cost_usd]
//  * @property {'dark_web_forum'|'paste_site'|'telegram'|'ransomware_site'|'github'|'social_media'} leak_channel
//  * @property {string} [leak_url]
//  * @property {Array<'GDPR'|'HIPAA'|'CCPA'|'SEC-8K'>} [regulatory_notifications]
//  * @property {string} source
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const DATA_LEAKS_RECORDS = []
