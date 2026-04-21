// Record-level employee / executive PII exposures.
//
// Schema:
// /**
//  * @typedef {Object} EmployeeExposure
//  * @property {string} id
//  * @property {string} leaked_at                  when the original leak happened
//  * @property {string} observed_at                when we noticed the exposure
//  * @property {'c-suite'|'vp'|'director'|'board'|'general-staff'} employee_role
//  * @property {string} [employee_department]
//  * @property {string} company_name
//  * @property {string} company_domain
//  * @property {string} company_industry
//  * @property {string} company_region
//  * @property {Array<'email'|'phone'|'address'|'ssn'|'salary'|'medical'>} pii_types
//  * @property {number} [leaked_credentials_count]
//  * @property {'third_party_breach'|'infostealer_log'|'data_broker'|'social_eng'|'insider'} leak_origin
//  * @property {string} [origin_breach_id]         points to a DataLeak or InfostealerLog record id
//  * @property {string} [dark_web_url]
//  * @property {'critical'|'high'|'medium'|'low'} exposure_severity
//  * @property {string} source
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const EMPLOYEE_EXPOSURE_RECORDS = []
