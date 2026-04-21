// Record-level dark web mentions / chatter.
//
// Schema:
// /**
//  * @typedef {Object} DarkWebMention
//  * @property {string} id
//  * @property {string} observed_at
//  * @property {'forum'|'telegram'|'marketplace'|'paste'|'irc'|'private'} channel_type
//  * @property {string} channel_name               'Breach Forums' / 'XSS' / 'cybernet'
//  * @property {string} [channel_url]
//  * @property {'sale'|'doxx'|'recruitment'|'chatter'|'leak'} post_type
//  * @property {string} brand_mentioned            company / product name
//  * @property {'brand'|'exec'|'product'|'domain'|'repo'|'partner'} mention_topic
//  * @property {Array<'credentials'|'pii'|'ccs'|'health'|'docs'|'code'>} [data_types_offered]
//  * @property {number} [price_usd]
//  * @property {boolean} sample_included
//  * @property {string} actor_handle
//  * @property {'threat'|'discussion'|'sale'} sentiment
//  * @property {string} source
//  * @property {'high'|'medium'|'low'} confidence
//  */

export const DARK_WEB_MENTIONS_RECORDS = []
