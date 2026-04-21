// Record-level infostealer log sightings.
//
// Schema:
// /**
//  * @typedef {Object} InfostealerLog
//  * @property {string} id
//  * @property {string} harvested_at               'YYYY-MM-DD'
//  * @property {string} listed_at                  when the log was posted for sale
//  * @property {'RedLine'|'Raccoon'|'Vidar'|'Lumma'|'StealC'|'Risepro'|'Meta'|'Rhadamanthys'} malware_family
//  * @property {string} marketplace                'Russian Market' / 'Genesis' / 'Telegram:ChannelName'
//  * @property {string} [listing_id_on_market]
//  * @property {number} [price_usd]
//  * @property {string} [victim_device_os]         'Windows 10' / 'macOS 14' / etc.
//  * @property {string} victim_country
//  * @property {string} victim_region
//  * @property {string} victim_industry            inferred from corporate_domains
//  * @property {string[]} corporate_domains        e.g. ['acme.com', 'acme.co.uk']
//  * @property {number} credential_count
//  * @property {number} cookies_count
//  * @property {number} [crypto_wallet_count]
//  * @property {number} [vpn_credentials_count]
//  * @property {number} [saved_payment_card_count]
//  * @property {string} source
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const INFOSTEALER_RECORDS = []
