# Custom Builder — Data Reality Check

> **Purpose.** Give you full visibility into exactly what data powers the Custom Builder today (100% synthetic / seeded RNG), what a real dataset would need to look like per category, and where you can get it. Covers the Builder + the way its data would feed Popular Charts. **Does not cover Global Reports** (those are external vendor reports — separate concern).

---

## TL;DR

The Builder has **five data layers**. Four are real / correct / stable (taxonomies, filter lists, time scaffold). **One is entirely fake** (the actual numbers on the charts — every value you see is `Math.sin()`-based seeded noise from `generateData()`).

- **Four are fine to keep.** They're reference data, not live data — you don't need to "connect" them to anything.
- **One needs real data.** This doc focuses on that one — the numbers behind the charts — per category, with a record schema, sourcing advice, and what you can safely skip.

Where to start if you want to make any of this real:
1. **Vulnerability** (easiest — NVD + CISA KEV are free public JSON feeds).
2. **Supply chain** (easy — npm/PyPI advisories + Socket.dev are free).
3. **Ransomware** (medium — SOCRadar ThreatVision likely already has leak-site data).
4. Everything else is progressively harder.

---

## 1. How Builder renders data today — the flow

```
User opens /builder/ransomware
       │
       ▼
Builder.jsx reads the URL → categoryId = 'ransomware'
       │
       ├──► CATEGORIES (data.js)      ← label, icon, description
       │
       ├──► DATA_POINTS_BY_CATEGORY['ransomware']
       │          └─ 5 data points, each with 6–8 elements
       │
       ├──► ControlPanel.jsx
       │     ├─ INDUSTRIES (10)        — Industry dropdown
       │     ├─ ALL_COUNTRIES (31) +
       │     │   ALL_REGIONS (6)       — Country/Region dropdown
       │     ├─ THREAT_GROUPS (13)     — Actor dropdown
       │     ├─ ALL_MONTHS (36)        — Date range sliders
       │     └─ DATE_PRESETS (5)       — Quick-range buttons
       │
       └──► generateData('ransomware/attack_volume', 'country:industry:threatGroup')
                  │
                  ▼
           ╔══════════════════════════════════════════╗
           ║  Phase C prefer-records path (NEW):      ║
           ║  getRecords('ransomware') → []           ║
           ║  (empty → falls through)                 ║
           ╠══════════════════════════════════════════╣
           ║  Seeded RNG path:                        ║
           ║  seed = sum of char codes of the key     ║
           ║  rng(i) = |sin(seed*9301 + i*49297) *    ║
           ║           233280| % 1                    ║
           ║  For each of 8 elements × 12 months:     ║
           ║    value = round(rng * 600 + 100)        ║
           ║  Returns: [{ name:'Healthcare',          ║
           ║   Jan:456, Feb:789, ..., color:'hsl' },  ║
           ║   ...]                                   ║
           ╚══════════════════════════════════════════╝
                  │
                  ▼
       Recharts renders a bar/line/area/pie chart
```

**The key realization:** every number you see in the Builder is produced by that `sin()` call. The elements are real labels ("Healthcare", "LockBit 4.0") but the numbers attached to them are fake in a deterministic way — the same URL will always show the same chart because the seed is the same.

---

## 2. The five data layers — what's real, what's fake

| Layer | Where it lives | Current state | Needs real data? |
|---|---|---|---|
| **1. Taxonomies** (categories, industries, regions, countries, threat groups) | `data.js` | Real, curated lists | ❌ No — these are reference data |
| **2. Data points** (the 5 chart options per category) | `data.js → DATA_POINTS_BY_CATEGORY` | Real labels + element buckets | ❌ No — it's the schema, not the values |
| **3. Time scaffold** (2024–2026 months + preset ranges) | `data.js → ALL_MONTHS`, `DATE_PRESETS` | Real structure | ❌ No — just the calendar |
| **4. Data availability** (the sparkline under the date picker showing "how many sources covered this month") | `data.js → DATA_AVAILABILITY` | Fake — seeded RNG per month | ⚠️ Could be real if you have it, but low priority |
| **5. Chart values** (the actual bars/lines/pies) | `generateData()` in `data.js` | **100% fake — seeded RNG** | ✅ **Yes — this is the thing** |

Everything below focuses on **Layer 5** — the values.

---

## 3. Per-category deep dive

For each of the 10 threat categories, you'll see:

- **Data points offered** — what the Builder currently lets the user chart
- **Sample dummy output** — what the Builder actually draws today (the numbers are synthetic)
- **Minimum real record** — if you wanted to replace the synthetic data with real data, this is the minimum schema per incident/sighting
- **Source options** — where real data exists in the world
- **Can you skip it?** — realistic honest advice

### 3.1 🩸 Ransomware — `ransomware`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets (chart x-axis) |
|---|---|---|
| Attack Volume | Monthly count of ransomware attacks | Healthcare / Finance / Manufacturing / Government / Education / Energy / Retail / Technology |
| Ransom Demands ($) | Distribution of demand sizes | < $100K / $100K–$500K / $500K–$1M / $1M–$5M / $5M–$10M / > $10M |
| Recovery Time (days) | How long victims took to recover | Healthcare / Finance / Manufacturing / Government / Education / Energy |
| Payment Rate (%) | Victims who paid, by bracket | 0-10% / 10-25% / 25-50% / 50-75% / 75-100% / Undisclosed |
| Targeted Sectors | Attack share per sector | Healthcare / Financial Services / Manufacturing / Government / Technology / Education / Energy / Retail |

**Sample dummy output today.** Open `/builder/ransomware` — Attack Volume bar chart shows Healthcare Jan=456, Feb=789, Mar=312, etc. Those numbers are `Math.sin(seed * 9301 + 0 * 49297) * 233280 % 1 * 600 + 100`. **They mean nothing.**

**Real record schema** (one row per incident):
```js
{
  id: 'rw-2026-0342',                // unique
  occurred_at: '2026-04-15',          // date attack detected
  disclosed_at: '2026-04-18',         // date victim/leaker disclosed
  victim_name: 'Acme Health Systems', // often redacted/"Confidential"
  victim_domain: 'acmehealth.com',
  victim_industry: 'Healthcare',      // must match INDUSTRIES in data.js
  victim_region: 'North America',     // must match ALL_REGIONS
  victim_country: 'United States',    // must match ALL_COUNTRIES
  victim_size_employees: 2400,        // optional
  victim_revenue_range: '$100M-$500M',// optional
  threat_group: 'LockBit 4.0',        // must match THREAT_GROUPS
  initial_access_vector: 'vulnerability', // phishing / rdp / vulnerability / supply_chain / unknown
  cve_exploited: ['CVE-2026-12345'],  // optional array
  encryption_confirmed: true,
  data_exfiltration_confirmed: true,
  leak_site_posted: true,
  leak_site_url: 'http://lockbitxxxxx.onion/post/0342',
  ransom_demand_usd: 2_500_000,       // optional
  ransom_paid_usd: null,              // null if refused / unknown
  recovery_days: 42,
  payment_status: 'refused',          // paid / refused / negotiating / undisclosed
  source: 'SOCRadar ThreatVision 2026',
  confidence: 'high',                 // high / medium / low
}
```

**Source options:**
- 🟢 **Easy:** SOCRadar ThreatVision should already have leak-site scraping → this is the single biggest source. Ask the team for a CSV/JSON export.
- 🟡 **Medium:** RansomwareLive.com (publishes scraped leak-site data for free).
- 🟡 **Medium:** CL0P/LockBit/etc. leak sites directly (scraping, legally gray in some jurisdictions).
- 🔴 **Harder:** Coveware's quarterly reports (paid) for payment-rate / ransom-demand distributions.

**Can you skip fields?** Yes — you only strictly need `id`, `occurred_at`, `victim_industry`, `victim_region`, `victim_country`, `threat_group`, and **one of**: `ransom_demand_usd`, `recovery_days`, or just existence (for Attack Volume). Fields like `cve_exploited`, `leak_site_url`, `victim_size_employees` are gravy.

**Volume needed for Builder to feel real:** **~500 incidents minimum** over the 2024–2026 range would give you per-month / per-sector resolution. SOCRadar likely has 5,000+.

---

### 3.2 🎣 Phishing — `phishing`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| Campaign Volume | Campaigns detected/month | Email / SMS/Smishing / QR Code / Social Media / Spear Phishing / Voice/Vishing |
| Click-Through Rate (%) | User click rates by sector | Healthcare / Finance / Education / Government / Retail / Technology |
| BEC Losses ($) | Financial losses by vector | Wire Transfer / Gift Cards / Payroll Diversion / Invoice Fraud / Real Estate / Vendor Impersonation |
| Delivery Vectors | How the phish arrived | Email Link / Attachment / QR Code / SMS / Voice / Social Media |
| Impersonation Targets | Who attackers impersonated | Microsoft / Google / Okta / Salesforce / DHL / DocuSign / LinkedIn / Apple |

**Real record schema** (one row per campaign):
```js
{
  id: 'ph-2026-9102',
  first_seen: '2026-04-10',
  last_seen: '2026-04-14',
  vector: 'email',                    // email / sms / qr / voice / social / spear
  impersonated_brand: 'Microsoft',
  landing_domain: 'microsoft-login.xyz',
  target_industry: ['Financial Services', 'Healthcare'],
  target_region: ['North America'],
  target_country: ['United States'],
  target_type: 'corporate',           // consumer / corporate / exec
  emails_sent: 12000,                 // optional
  emails_clicked: 840,                // optional
  emails_credential_submitted: 127,   // optional
  bec_loss_usd: 450_000,              // only for BEC
  bec_type: 'wire',                   // wire / gift_card / payroll / invoice / real_estate / vendor_impersonation
  payload: 'credential',              // credential / malware / bec / qr
  detection_source: 'SOCRadar Awareness 2026',
  takedown_status: 'taken_down',      // reported / taken_down / active
  source: '...',
  confidence: 'medium',
}
```

**Source options:**
- 🟡 **Medium:** SOCRadar's phishing-monitoring product — internal data.
- 🟢 **Free:** PhishTank (verified phishing URLs, basic metadata).
- 🟢 **Free:** OpenPhish (paid feed but free sample).
- 🔴 **Hard:** Click-through rate data is vendor-private (KnowBe4, Proofpoint, etc.). You may have to either skip that data point or present benchmark averages rather than per-campaign CTR.
- 🔴 **Hard:** BEC loss numbers mostly come from FBI IC3 aggregate reports, not per-incident data.

**Honest recommendation:** Phishing is one of the **harder categories** to source real data for at record level. CTR and BEC losses almost always live behind vendor paywalls or IC3's annual summary. Consider either:
- Keeping phishing's Click-Through Rate and BEC Losses data points synthetic with a clear "benchmark" label, OR
- Replacing those with data points you *can* source: "Campaigns detected", "Impersonated brands top 10", "Takedown success rate" — all SOCRadar-provided.

**Can you skip?** Yes — drop Click-Through Rate and BEC Losses if sourcing is painful. The remaining 3 data points (Campaign Volume, Delivery Vectors, Impersonation Targets) are adequate and sourceable.

---

### 3.3 🔑 Infostealer Logs — `infostealer`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| Malware Families | Share by stealer family | RedLine / Raccoon / Vidar / Lumma / StealC / Risepro / Meta / Rhadamanthys |
| Victim Volumes | Victims by industry | Healthcare / Financial Services / Manufacturing / Government / Retail / Technology |
| Credential Types | What kind of creds were in logs | Email/Pass / Session Cookies / Saved Passwords / Crypto Wallets / VPN Creds / Cloud Accounts |
| Log Freshness (days) | Age distribution of logs | < 7 / 7-30 / 30-90 / 90-180 / 180+ |
| Price Tiers ($) | Listing price distribution | < $10 / $10-$50 / $50-$200 / $200-$1K / $1K+ |

**Real record schema:**
```js
{
  id: 'is-2026-22910',
  harvested_at: '2026-04-01',         // when the log was grabbed from the victim
  listed_at: '2026-04-03',            // when posted for sale
  malware_family: 'RedLine',
  marketplace: 'Russian Market',      // or 'Genesis' / 'Telegram:ChannelName'
  listing_id_on_market: '77421',
  price_usd: 15,
  victim_device_os: 'Windows 11',
  victim_country: 'Germany',
  victim_region: 'Europe',
  victim_industry: 'Technology',      // INFERRED from corporate_domains
  corporate_domains: ['acme.com', 'acme.eu'],
  credential_count: 142,
  cookies_count: 38,
  crypto_wallet_count: 2,
  vpn_credentials_count: 1,
  saved_payment_card_count: 3,
  source: 'SOCRadar Infostealer Monitor 2026',
  confidence: 'high',
}
```

**Source options:**
- 🟢 **Easy:** SOCRadar Infostealer Monitor — this is literally a SOCRadar product. Ask the team for export.
- 🟡 **Medium:** Flare, Kela, IntelX (paid, but established vendors).
- 🔴 **Hard:** Direct scraping of Russian Market / Genesis is legally risky and operationally non-trivial.

**Can you skip?** The category is valuable — don't skip if SOCRadar has the data. Without it, keep synthetic with a clear "sample data" badge.

**Volume needed:** Infostealer logs are high-volume (~millions/year globally). Even 10,000 records would give great resolution.

---

### 3.4 💰 Logs on Sale — `logs_on_sale`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| Listings Volume | Access listings by asset type | Corporate VPN / RDP / Citrix / Cloud Admin / Domain Admin / Database / Email Server |
| Price Tiers ($) | Price distribution | < $100 / $100-$500 / $500-$2K / $2K-$10K / $10K+ |
| Access Types | Share by access method | RDP / VPN / Citrix / SSH / Cloud Console / Web Shell |
| Seller Reputation | Seller tier distribution | Verified / Established / New / Unverified |
| Buyer Sectors | Who bought listings | Ransomware Affiliates / Initial Access Brokers / Data Brokers / Nation-State / Researchers |

**Real record schema:**
```js
{
  id: 'al-2026-4491',
  listed_at: '2026-04-12',
  last_seen_at: '2026-04-18',
  sold_at: null,
  marketplace: 'XSS',                 // or 'Exploit' / 'RAMP' / 'Telegram:...'
  access_type: 'VPN',                 // RDP / VPN / Citrix / SSH / Cloud / WebShell
  privilege_level: 'admin',           // user / admin / domain-admin / root
  victim_industry: 'Manufacturing',
  victim_region: 'Europe',
  victim_country: 'Germany',
  victim_revenue_range: '$100M-$500M',
  victim_size_employees: 1200,
  price_usd: 3500,
  price_currency: 'USD',              // USD / BTC / XMR
  seller_handle: 'Mr.Sneaker',
  seller_reputation: 'established',   // verified / established / new / unverified
  seller_rating: 4.7,
  buyer_sector: null,                 // only known for resold listings
  exclusivity: 'exclusive',           // exclusive / shared
  status: 'listed',                   // listed / sold / pulled
  source: 'SOCRadar Dark Web Monitor 2026',
  confidence: 'high',
}
```

**Source options:**
- 🟢 **Easy:** SOCRadar Dark Web Monitor.
- 🟡 **Medium:** Flashpoint, DarkOwl, KELA (all paid).
- 🔴 **Hard:** Direct forum scraping of XSS/Exploit/RAMP (requires vetted accounts, legally gray).

**Buyer Sectors data point is inherently weak** — even scrapers rarely know who bought a listing. Honest option: drop this data point, or label it as "Inferred" with low confidence.

---

### 3.5 💧 Data Leaks — `data_leaks`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| Records Exposed | Exposure volume by data type | PII Records / Financial Data / Credentials / Health Records / Intellectual Property / Source Code |
| Breach Cost ($M) | Industry breach cost | Healthcare / Financial / Pharma / Technology / Energy / Education / Government / Retail |
| Root Causes | Why breaches happened | Stolen Creds / Phishing / Misconfiguration / Vulnerability / Insider Threat / Physical / Unknown |
| Time to Detect (days) | Detection delay by sector | Healthcare / Finance / Government / Technology / Retail / Energy |
| Leak Sources | Where leaked data appeared | Dark Web Forums / Paste Sites / Telegram / Ransomware Sites / Public Repos / Social Media |

**Real record schema:**
```js
{
  id: 'dl-2026-0821',
  breach_date: '2026-02-15',          // when it actually happened
  disclosed_at: '2026-03-22',         // when made public
  detected_at: '2026-03-10',          // when victim detected (if known)
  victim_name: 'Acme Financial',
  victim_domain: 'acme-financial.com',
  victim_industry: 'Financial Services',
  victim_region: 'North America',
  victim_country: 'United States',
  records_exposed: 2_400_000,
  data_types: ['pii', 'financial', 'credentials'],
  root_cause: 'stolen_creds',         // stolen_creds / phishing / misconfig / vulnerability / insider / physical / unknown
  cve_exploited: null,                // if root_cause == 'vulnerability'
  detection_days: 23,                 // disclosed_at - breach_date (or detected_at - breach_date)
  cost_usd: 5_200_000,
  leak_channel: 'dark_web_forum',     // dark_web_forum / paste_site / telegram / ransomware_site / github / social_media
  leak_url: 'http://breachforums.xxx/thread/0821',
  regulatory_notifications: ['SEC-8K', 'GDPR'],
  source: '...',
  confidence: 'high',
}
```

**Source options:**
- 🟢 **Easy:** SOCRadar breach monitoring.
- 🟢 **Free:** HIBP (Have I Been Pwned — API free for breach list, richer endpoints paid).
- 🟢 **Free:** State Attorneys General breach notification filings (many US states publish these publicly).
- 🟡 **Medium:** IBM X-Force Cost of a Data Breach — aggregate only, not per-incident.

**Breach Cost data point is the tricky one** — per-incident cost is rarely disclosed. Realistic options: use IBM's industry averages to ESTIMATE per-incident cost based on industry + records_exposed, and label it "modeled." Or drop Breach Cost and replace with "Records Exposed by Industry" which is directly sourceable.

---

### 3.6 👔 Employee Data Exposure — `employee_exposure`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| PII Types | Share by PII field type | Email / Phone / Home Address / SSN / National ID / Salary / Medical |
| Role Exposure | Exposure by seniority | C-Suite / VP / Director / Board Members / General Staff |
| Credential Leak Source | Where creds leaked from | Corporate Email / VPN / SSO / Okta / Cloud SaaS / Internal Apps |
| Leak Origins | Upstream leak origin | Third-Party Breach / Infostealer Log / Data Broker Leak / Social Engineering / Insider |
| Time Since Leak | Age distribution | < 30 days / 30-90 / 90-180 / 180-365 / 1-2 years / 2+ years |

**Real record schema:**
```js
{
  id: 'ee-2026-7701',
  leaked_at: '2025-11-02',            // when original leak happened
  observed_at: '2026-04-12',          // when SOCRadar saw it
  employee_role: 'c-suite',
  employee_department: 'Finance',
  company_name: 'Acme Corp',
  company_domain: 'acme.com',
  company_industry: 'Manufacturing',
  company_region: 'Europe',
  pii_types: ['email', 'phone', 'address'],
  leaked_credentials_count: 1,
  leak_origin: 'infostealer_log',     // third_party_breach / infostealer_log / data_broker / social_eng / insider
  origin_breach_id: 'dl-2026-0821',   // foreign key, optional
  dark_web_url: '...',
  exposure_severity: 'high',          // critical / high / medium / low
  source: 'SOCRadar Exec Protection 2026',
  confidence: 'high',
}
```

**Source options:**
- 🟢 **Easy:** SOCRadar Exec Protection — another SOCRadar product.
- 🟡 **Medium:** Derived from `data_leaks` + `infostealer_log` records via a correlator (can be done client-side).

**Honest note:** Most of these rows will be *derived* from the Data Leaks + Infostealer categories, not collected independently. If you source those two, you get Employee Exposure almost for free by running an aggregation.

---

### 3.7 🌑 Dark Web Mentions — `dark_web_mentions`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| Credential Listings | Listings by credential type | Corporate Email / VPN Credentials / Cloud Accounts / Database Access / Admin Panels / API Keys |
| Access Broker Pricing ($) | Price by access type | Corporate VPN / RDP / Citrix / Cloud Admin / Domain Admin / Database / Email Server |
| Market Activity | Activity by channel | Forums / Telegram / Marketplaces / Paste Sites / IRC/Discord / Private Channels |
| Forum Posts | Posts by mention topic | Brand Name / Executives / Products / Domains / Code Repos / Partners |
| Data Types Listed | Data types offered for sale | Credentials / PII / Credit Cards / Health Records / Corporate Docs / Source Code |

**Real record schema:**
```js
{
  id: 'dw-2026-41287',
  observed_at: '2026-04-18',
  channel_type: 'forum',              // forum / telegram / marketplace / paste / irc / private
  channel_name: 'Breach Forums',
  channel_url: 'http://breachforums.xxx/thread/...',
  post_type: 'sale',                  // sale / doxx / recruitment / chatter / leak
  brand_mentioned: 'Acme Corp',
  mention_topic: 'brand',              // brand / exec / product / domain / repo / partner
  data_types_offered: ['credentials', 'pii'],
  price_usd: 2500,
  sample_included: true,
  actor_handle: 'sn4k3r',
  sentiment: 'sale',                  // threat / discussion / sale
  source: 'SOCRadar Dark Web Monitor 2026',
  confidence: 'medium',
}
```

**Source options:**
- 🟢 **Easy:** SOCRadar Dark Web Monitor.
- 🟡 **Medium:** Flashpoint, Intel471, Recorded Future.
- 🔴 **Hard:** Direct scraping — same caveats as logs_on_sale.

---

### 3.8 🛡 Vulnerability Exploits — `vulnerability` ⭐ **EASIEST TO MAKE REAL**

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| CVE Volume | CVEs published by class | RCE / Privilege Escalation / SQLi / XSS / Auth Bypass / SSRF / DoS / Info Disclosure |
| Time to Exploit (days) | Distribution of TTE | 0-1 / 1-7 / 7-30 / 30-90 / 90+ |
| Patch Rate (%) | Patching speed by severity | Critical / High / Medium / Low |
| Exploit Availability | Exploit maturity | PoC Published / Weaponized / In-the-Wild / Kit Available / No Known Exploit |
| Severity Distribution | CVSS severity buckets | Critical / High / Medium / Low / Informational |

**Real record schema:**
```js
{
  cve_id: 'CVE-2026-12345',
  disclosed_at: '2026-03-15',
  patched_at: '2026-03-22',
  vendor: 'Microsoft',
  product: 'Exchange Server',
  affected_versions: ['2019 CU12', '2019 CU13'],
  cvss_v3_score: 9.8,
  cvss_v3_vector: 'CVSS:3.1/AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H',
  cwe: ['CWE-502'],
  vulnerability_class: 'rce',         // rce / privesc / sqli / xss / auth-bypass / ssrf / dos / info-disclosure
  severity: 'critical',
  exploit_availability: 'weaponized', // none / poc / weaponized / in-the-wild / kit
  in_cisa_kev: true,
  kev_due_date: '2026-04-05',
  time_to_exploit_days: 3,
  patch_rate_at_30d: 67,              // % patched within 30 days
  references: ['https://msrc.microsoft.com/...'],
  source: 'NVD + CISA KEV',
}
```

**Source options:**
- 🟢🟢 **Trivial:** **NVD JSON feeds — https://nvd.nist.gov/vuln/data-feeds** (free public JSON, updated multiple times daily, ~250,000 CVEs covering 1999–present).
- 🟢🟢 **Trivial:** **CISA KEV catalog — https://www.cisa.gov/known-exploited-vulnerabilities-catalog** (free JSON, ~1,200 actively-exploited CVEs with due dates).
- 🟡 **Medium:** Vendor advisories (MSRC, Adobe PSIRT, etc.) for patch dates + severity.

**Why start here.** All the data is free, public, well-structured JSON. One ingestion script → Builder's vulnerability charts become **real** with ~250k CVEs behind them. CISA KEV gives you the "Exploit Availability" data point directly. Patch rates at 30/60/90 days can be computed if you capture `disclosed_at` + `patched_at`. Time-to-exploit is harder (not all CVEs are exploited — requires CISA KEV + threat intel enrichment).

**Fields you can skip:** `references`, `cvss_v3_vector` (unless you want to filter on attack vector), `patch_rate_at_30d` (compute on the fly from disclosed_at + patched_at across many records).

---

### 3.9 💣 DDoS Attacks — `ddos`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| Attack Vectors | Share by protocol vector | UDP Flood / SYN Flood / HTTP Flood / DNS Amplification / NTP Reflection / QUIC Flood |
| Peak Bandwidth | Attack size distribution | < 10 Gbps / 10-100 / 100-500 / 500 Gbps-1 Tbps / 1-3 Tbps / 3+ Tbps |
| Attack Duration | Duration distribution | < 5 min / 5-15 / 15-60 / 1-6 hours / 6+ hours |
| Target Sectors | Share by industry | Financial Services / Technology / Telecommunications / Government / Gaming / Healthcare |
| Booter Tier | Share by booter category | Low-end / Mid-tier / Premium / Custom / Nation-state-linked |

**Real record schema:**
```js
{
  id: 'dd-2026-8812',
  started_at: '2026-04-18T14:22:18Z',
  ended_at: '2026-04-18T14:29:44Z',
  target_name: null,                  // often anonymized
  target_domain: 'some-bank.com',
  target_industry: 'Financial Services',
  target_region: 'Europe',
  target_country: 'Germany',
  vector: 'http',                     // udp / syn / http / dns_amp / ntp_refl / quic
  protocol_layer: 'l7',               // l3 / l4 / l7
  peak_bandwidth_gbps: 42,
  peak_pps: 1_200_000,
  duration_seconds: 446,
  source_ips_count: 8400,
  source_countries: ['CN', 'RU', 'BR'],
  booter_tier: 'mid',                 // low / mid / premium / custom / nation-state
  booter_service: null,
  attribution: null,
  source: '...',
  confidence: 'medium',
}
```

**Source options:**
- 🔴 **Hard for record-level:** Cloudflare, Akamai, Radware, Imperva publish **aggregate** quarterly DDoS reports but **never per-incident data**. The data is inside their customer-facing dashboards only.
- 🟡 **Medium for partial:** Booter service advertising data (what they claim their network can do) can be scraped from darknet forums — but that's "capability" not "observed attacks".
- 🟢 **Free for aggregates:** Cloudflare Radar, Google Project Shield dashboards — aggregate-level only.

**Honest recommendation:** DDoS is one of the **hardest categories** to make real at per-incident resolution. Realistic plan:
- Replace "Peak Bandwidth / Duration / Vector" with Cloudflare Radar aggregates (quarterly snapshots).
- Or drop DDoS as a Custom Builder category for MVP — tell users "coming soon, waiting for data partner".
- Or keep it synthetic with a clear "illustrative" label.

---

### 3.10 🔗 Supply Chain Threats — `supply_chain`

**Data points the Builder offers:**

| Data Point | What it shows | Element buckets |
|---|---|---|
| Incident Count | Incidents by ecosystem | npm / PyPI / Maven / Docker Hub / GitHub Actions / NuGet / RubyGems / Go Modules |
| Malicious Packages | Share by attack pattern | Typosquatting / Dependency Confusion / Account Takeover / Build Injection / Backdoor / Data Exfil |
| Third-Party Breach Rate | Breach rate by vendor type | SaaS Vendors / Cloud Providers / Managed Services / Hardware Supply / Open Source Deps / Contractors |
| Impact by Sector | Victim sector distribution | Technology / Financial / Healthcare / Government / Manufacturing / Retail |
| Attack Vectors | Share by attack vector | Open Source / CI/CD Pipeline / Cloud Provider / SaaS Vendor / Managed Services / CDN/Infrastructure |

**Real record schema:**
```js
{
  id: 'sc-2026-0319',
  first_seen: '2026-04-05',
  disclosed_at: '2026-04-08',
  removed_at: '2026-04-09',
  ecosystem: 'npm',                   // npm / pypi / maven / docker / gh-actions / nuget / rubygems / go
  package_name: 'ui-lib-helper',
  package_version: '1.0.4',
  package_url: 'https://www.npmjs.com/package/ui-lib-helper',
  maintainer_handle: 'new_user_2026',
  maintainer_compromised: false,
  attack_pattern: 'typosquat',        // typosquat / dep_confusion / ato / build_injection / backdoor / exfil
  downloads_before_removal: 1840,
  payload_type: 'stealer',            // stealer / backdoor / data_exfil / miner / unknown
  victim_sectors: ['Technology'],
  related_cves: [],
  source: 'SOCRadar Supply Chain 2026',
  confidence: 'high',
}
```

**Source options:**
- 🟢 **Free:** **npm audit advisories — https://registry.npmjs.org/-/npm/v1/security/advisories** (free public JSON).
- 🟢 **Free:** **PyPI advisories via OSV — https://osv.dev/** (aggregates npm/pypi/maven/etc. — JSON API, free).
- 🟢 **Free:** **Socket.dev research blog** (regular discoveries — RSS + their free API tier).
- 🟢 **Free:** **GitHub Security Advisories — https://github.com/advisories** (JSON download available).
- 🟡 **Medium:** Phylum, Sonatype, Snyk commercial feeds.

**Why start here (together with Vulnerability).** OSV.dev alone gives you ~30,000 advisories across all ecosystems, free, well-structured. Run one script, get real supply-chain records. "Third-Party Breach Rate" is harder (requires breach correlator) so start with the first 2 and skip the others.

---

## 4. How Builder data connects to Popular Charts

**Today:**
- Popular Charts (`/popular`) reads **featured items** from the Intelligence Library (`intelligenceLibrary.js → popularCharts()`).
- These featured items are hand-crafted chart summaries ("Ransomware Attacks by Sector", "MTTD", etc.). They each have a `dataset` (12 monthly values) baked in.
- **They are NOT computed from the Builder's `generateData()`.** Popular and Builder are currently two parallel universes.

**When real records exist (via Phase B/C):**
- Builder pulls from Records per category.
- Library featured charts could be upgraded in the same way — each featured chart becomes a pre-defined aggregation spec against the same records:
  - Featured chart "Ransomware Attacks by Sector" = `aggregateRecords(RANSOMWARE_RECORDS, {dimension: 'victim_industry', by: 'month'})`.
  - Same data, same number source → consistency between what a user sees on `/popular` and what they build in `/builder`.

**This is the payoff of the unified data layer.** When records are populated, everything in the app — Builder charts, Popular cards, Explore slices, the stat cards on `/explore` — all draw from the same source of truth. No more "the number on Popular says 12.4k but the Builder says 4,200" divergence.

---

## 5. Three paths for real data

### Path A — Stay synthetic (status quo)
- Keep using `generateData()` for everything.
- Add a clear "Sample Data — Demo Build" ribbon to the Builder so testers know numbers aren't real.
- Good for: showing UX, getting product feedback, signing pilot customers.
- Bad for: convincing CISOs that numbers are trustworthy.

### Path B — Hybrid (recommended for MVP)
- Populate **Vulnerability** and **Supply Chain** records with real public feeds (NVD, CISA KEV, OSV.dev).
- Leave other categories synthetic but clearly labeled.
- Ransomware → populate if SOCRadar ThreatVision export is available; otherwise keep synthetic.
- Time investment: **~1–2 days of ingestion scripting**.
- Result: 2–3 categories feel real, 7 feel like templated samples. CISOs can probe Vulnerability and come away impressed; they'll nod at the others.

### Path C — Fully real
- Build ingestion pipelines for all 10 categories.
- Requires partnerships / SOCRadar product exports / scraping infrastructure.
- Time investment: **~2–4 weeks**, category-by-category.
- Result: a real competitive product.

---

## 6. Priority matrix — where to invest effort

| Category | Importance | Sourcing difficulty | Do it? |
|---|---|---|---|
| Vulnerability | High (every CISO cares about CVEs) | 🟢🟢 Trivial (NVD + CISA KEV are free) | **Start here** |
| Supply Chain | High (hot topic) | 🟢 Easy (OSV.dev + npm advisories free) | **Do second** |
| Ransomware | Highest (flagship story) | 🟡 Medium (SOCRadar internal; else scrape) | **Do third if internal** |
| Infostealer | High | 🟡 Medium (SOCRadar internal) | Do if internal |
| Logs on Sale | High | 🟡 Medium (SOCRadar internal) | Do if internal |
| Dark Web Mentions | Medium | 🟡 Medium (SOCRadar internal) | Do if internal |
| Data Leaks | Medium | 🟡 Medium (HIBP + State AG filings free; SOCRadar internal) | Defer |
| Employee Exposure | Low-as-standalone | 🟡 Medium (derive from the above) | Defer; derive |
| Phishing | Medium (but weak per-incident data market) | 🟡 Medium for some metrics, 🔴 Hard for CTR/BEC | Partial — drop CTR+BEC data points |
| DDoS | Medium (industry aggregates only) | 🔴 Hard at record level | Keep synthetic + label |

---

## 7. Field-level cheat sheet — what's universal

Across every category's record schema, **these fields appear almost everywhere**:

| Field | Type | Required | Notes |
|---|---|---|---|
| `id` | string | ✓ | Unique, stable, URL-safe |
| `*_at` date | ISO date string 'YYYY-MM-DD' | ✓ | `occurred_at` / `disclosed_at` / `observed_at` etc. |
| `*_industry` | string | ✓ | Must match entries in `INDUSTRIES` (data.js) |
| `*_region` | string | ✓ | Must match entries in `ALL_REGIONS` |
| `*_country` | string | optional | Must match entries in `ALL_COUNTRIES[].name` |
| `source` | string | ✓ | Vendor+year attribution, drives the Brand Chip |
| `confidence` | 'high'\|'medium'\|'low' | optional | For future UX (dim low-confidence items) |

**If your real data has these universal fields, Builder filters will Just Work.** Filters today are: country, industry, threat_group, date range. As long as records expose the matching field names (`victim_industry`, `target_industry`, `company_industry`, etc. — the aggregator checks all three), they're filterable.

---

## 8. What's next if you pull the trigger

### If you want to light up Vulnerability end-to-end (easiest win)

1. Write `scripts/ingest-nvd.mjs` — pulls latest NVD feed, parses JSON into the record schema in `src/lib/records/vulnerability.js`.
2. Write `scripts/ingest-cisa-kev.mjs` — merges CISA KEV flags onto existing records (`in_cisa_kev: true`, `kev_due_date: ...`, `exploit_availability: 'in-the-wild'`).
3. Add the aggregation spec in `data.js → aggregateRecords()`:
   ```js
   if (catId === 'vulnerability' && dpId === 'cve_volume') {
     return groupByElementPerMonth(filtered, {
       groupBy: r => r.vulnerability_class,
       elements: DATA_POINTS_BY_CATEGORY.vulnerability
         .find(d => d.id === 'cve_volume').elements,
       dateField: 'disclosed_at',
       agg: 'count',
     })
   }
   ```
4. Repeat for `severity_dist`, `exploit_availability`, `patch_rate`, `time_to_exploit`.
5. Hit `/builder/vulnerability` — real CVE charts render.

**Estimate: ~1 afternoon** of my time to sketch the ingestion + the 5 aggregation specs. Say the word.

### If you want to keep Vulnerability synthetic but unlock supply chain

Same pattern with OSV.dev's JSON API → `src/lib/records/supply_chain.js`.

### If you want to just leave everything synthetic for now

Nothing to do. The scaffold in Phase A+B+C stays dormant. When you want to flip any single category, just populate its records file and add an aggregation spec.

---

## Final recommendation

For a v1 public test targeting CISOs:
- **Do Path B** (Vulnerability + Supply Chain real via free public feeds).
- Add a small "Real Data" vs "Sample" indicator on each category tile in Builder — something subtle like the green "Verified" chip that already exists for library items.
- Keep DDoS and Phishing-CTR synthetic with clear sample labels.
- Defer Ransomware / Infostealer / Logs / Dark Web / Employee Exposure until SOCRadar's internal feeds can be wired in.

That gives testers a credible product with real data in the two most-scrutinized categories, and honest labeling on the rest. Roughly 1–2 days of work total for the ingestion + specs.
