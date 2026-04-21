// Record-level DDoS attack observations.
//
// Schema:
// /**
//  * @typedef {Object} DDoSAttack
//  * @property {string} id
//  * @property {string} started_at                 ISO datetime
//  * @property {string} ended_at                   ISO datetime
//  * @property {string} [target_name]
//  * @property {string} target_domain
//  * @property {string} target_industry
//  * @property {string} target_region
//  * @property {string} target_country
//  * @property {'udp'|'syn'|'http'|'dns_amp'|'ntp_refl'|'quic'} vector
//  * @property {'l3'|'l4'|'l7'} protocol_layer
//  * @property {number} [peak_bandwidth_gbps]
//  * @property {number} [peak_pps]                 packets per second
//  * @property {number} duration_seconds
//  * @property {number} [source_ips_count]
//  * @property {string[]} [source_countries]
//  * @property {'low'|'mid'|'premium'|'custom'|'nation-state'} [booter_tier]
//  * @property {string} [booter_service]
//  * @property {string} [attribution]              known actor if any
//  * @property {string} source
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const DDOS_RECORDS = []
