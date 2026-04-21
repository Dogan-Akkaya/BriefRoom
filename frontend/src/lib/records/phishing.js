// Record-level phishing campaigns.
//
// Schema:
// /**
//  * @typedef {Object} PhishingCampaign
//  * @property {string} id
//  * @property {string} first_seen                 'YYYY-MM-DD'
//  * @property {string} last_seen                  'YYYY-MM-DD'
//  * @property {'email'|'sms'|'qr'|'voice'|'social'|'spear'} vector
//  * @property {string} impersonated_brand         'Microsoft' / 'DocuSign' / bank name
//  * @property {string} [landing_domain]
//  * @property {string[]} target_industry          INDUSTRIES entries
//  * @property {string[]} target_region            ALL_REGIONS entries
//  * @property {string[]} [target_country]
//  * @property {'consumer'|'corporate'|'exec'} target_type
//  * @property {number} [emails_sent]
//  * @property {number} [emails_clicked]
//  * @property {number} [emails_credential_submitted]
//  * @property {number} [bec_loss_usd]
//  * @property {'wire'|'gift_card'|'payroll'|'invoice'|'real_estate'|'vendor_impersonation'} [bec_type]
//  * @property {'credential'|'malware'|'bec'|'qr'} payload
//  * @property {string} detection_source
//  * @property {'reported'|'taken_down'|'active'} takedown_status
//  * @property {string} source
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const PHISHING_RECORDS = []
