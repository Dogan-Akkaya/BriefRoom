// Record-level supply-chain compromises (malicious packages, vendor breaches, etc.).
// Natural public sources: npm advisories, Socket.dev, Snyk, OSS-Fuzz, Sonatype.
//
// Schema:
// /**
//  * @typedef {Object} SupplyChainIncident
//  * @property {string} id
//  * @property {string} first_seen
//  * @property {string} disclosed_at
//  * @property {string} [removed_at]
//  * @property {'npm'|'pypi'|'maven'|'docker'|'gh-actions'|'nuget'|'rubygems'|'go'} ecosystem
//  * @property {string} package_name
//  * @property {string} [package_version]
//  * @property {string} [package_url]
//  * @property {string} [maintainer_handle]
//  * @property {boolean} maintainer_compromised
//  * @property {'typosquat'|'dep_confusion'|'ato'|'build_injection'|'backdoor'|'exfil'} attack_pattern
//  * @property {number} [downloads_before_removal]
//  * @property {'stealer'|'backdoor'|'data_exfil'|'miner'|'unknown'} payload_type
//  * @property {string[]} [victim_sectors]
//  * @property {string[]} [related_cves]
//  * @property {string} source                     'SOCRadar' / 'Snyk' / 'Sonatype' / 'Socket.dev' / 'OSS-Fuzz'
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const SUPPLY_CHAIN_RECORDS = []
