# Custom Builder — Prune Decisions

> **Goal.** Keep only data points that SOCRadar can sustainably source with real live data. Anything that's vendor-private (Cloudflare DDoS rows, Proofpoint click-rates) or one-shot survey data (IBM Cost of a Data Breach) gets cut — quoting them once in a report is fine, promising them as a live chart is not.

Decisions below follow `BUILDER_DATA.md`'s sourceability analysis.

---

## Master table — all 50 data points, keep/cut

| # | Category | Data point ID | Label | Decision | Why |
|---|---|---|---|---|---|
| 1 | Ransomware | `attack_volume` | Attack Volume | ✅ keep | Leak-site scraping → counts per sector |
| 2 | Ransomware | `ransom_demands` | Ransom Demands ($) | ✅ keep | Often in leak-site posts |
| 3 | Ransomware | `recovery_time` | Recovery Time (days) | ❌ cut | Rarely disclosed publicly |
| 4 | Ransomware | `payment_rate` | Payment Rate (%) | ❌ cut | Victims don't disclose; Coveware-proprietary |
| 5 | Ransomware | `targeted_sectors` | Targeted Sectors | ✅ keep | Derivable from `victim_industry` |
| 6 | Phishing | `campaign_volume` | Campaign Volume | ✅ keep | SOCRadar phishing monitor |
| 7 | Phishing | `click_rate` | Click-Through Rate (%) | ❌ cut | Vendor-private (Proofpoint/KnowBe4) |
| 8 | Phishing | `bec_losses` | BEC Losses ($) | ❌ cut | FBI IC3 yearly aggregate only |
| 9 | Phishing | `delivery_vectors` | Delivery Vectors | ✅ keep | Observable per campaign |
| 10 | Phishing | `impersonation` | Impersonation Targets | ✅ keep | Observable per campaign |
| 11 | Infostealer | `malware_families` | Malware Families | ✅ keep | SOCRadar Infostealer Monitor |
| 12 | Infostealer | `victim_volumes` | Victim Volumes | ✅ keep | Same |
| 13 | Infostealer | `credential_types` | Credential Types | ✅ keep | Same |
| 14 | Infostealer | `log_freshness` | Log Freshness (days) | ✅ keep | Same |
| 15 | Infostealer | `price_tiers` | Price Tiers ($) | ✅ keep | Observable on listings |
| 16 | Logs on Sale | `listings_volume` | Listings Volume | ✅ keep | SOCRadar Dark Web Monitor |
| 17 | Logs on Sale | `price_tiers` | Price Tiers ($) | ✅ keep | Observable |
| 18 | Logs on Sale | `access_types` | Access Types | ✅ keep | Observable |
| 19 | Logs on Sale | `seller_rep` | Seller Reputation | ❌ cut | Marketplace-internal, thin observability |
| 20 | Logs on Sale | `buyer_sectors` | Buyer Sectors | ❌ cut | Buyers don't self-identify |
| 21 | Data Leaks | `records_exposed` | Records Exposed | ✅ keep | Often in breach notifications |
| 22 | Data Leaks | `breach_cost` | Breach Cost ($M) | ❌ cut | Rarely disclosed per-incident; IBM aggregate-only |
| 23 | Data Leaks | `root_causes` | Root Causes | ✅ keep | Often disclosed or inferable |
| 24 | Data Leaks | `time_to_detect` | Time to Detect (days) | ❌ cut | Survey data (IBM/Mandiant annual) |
| 25 | Data Leaks | `leak_sources` | Leak Sources | ✅ keep | Observable |
| 26 | Employee Exposure | `pii_types` | PII Types | ✅ keep | Derivable from leaks + infostealer |
| 27 | Employee Exposure | `exec_exposure` | Role Exposure | ✅ keep | SOCRadar Exec Protection |
| 28 | Employee Exposure | `credential_leaks` | Credential Leak Source | ✅ keep | Derivable |
| 29 | Employee Exposure | `breach_sources` | Leak Origins | ✅ keep | Derivable |
| 30 | Employee Exposure | `time_since_leak` | Time Since Leak | ✅ keep | Derivable |
| 31 | Dark Web Mentions | `credential_listings` | Credential Listings | ✅ keep | Observable |
| 32 | Dark Web Mentions | `access_pricing` | Access Broker Pricing ($) | ❌ cut | Duplicates `logs_on_sale/price_tiers` |
| 33 | Dark Web Mentions | `market_activity` | Market Activity | ✅ keep | Channel-level observable |
| 34 | Dark Web Mentions | `forum_posts` | Forum Posts | ✅ keep | Observable |
| 35 | Dark Web Mentions | `data_types` | Data Types Listed | ✅ keep | Observable |
| 36 | Vulnerability | `cve_volume` | CVE Volume | ✅ keep | NVD JSON feeds |
| 37 | Vulnerability | `time_to_exploit` | Time to Exploit (days) | ✅ keep | NVD + CISA KEV |
| 38 | Vulnerability | `patch_rate` | Patch Rate (%) | ✅ keep | Computable from `disclosed_at` + `patched_at` |
| 39 | Vulnerability | `exploit_availability` | Exploit Availability | ✅ keep | CISA KEV |
| 40 | Vulnerability | `severity_dist` | Severity Distribution | ✅ keep | CVSS in NVD |
| 41 | DDoS | `attack_vectors` | Attack Vectors | ✅ keep | Observable at vector layer |
| 42 | DDoS | `peak_bandwidth` | Peak Bandwidth | ❌ cut | Cloudflare/Akamai aggregate-only |
| 43 | DDoS | `duration` | Attack Duration | ❌ cut | Vendor-internal |
| 44 | DDoS | `target_sectors` | Target Sectors | ✅ keep | Derivable from `target_industry` |
| 45 | DDoS | `booter_services` | Booter Tier | ❌ cut | Classification needs vetted scraping |
| 46 | Supply Chain | `incident_count` | Incident Count | ✅ keep | OSV.dev + npm advisories |
| 47 | Supply Chain | `malicious_packages` | Malicious Packages | ✅ keep | OSV.dev |
| 48 | Supply Chain | `third_party_rate` | Third-Party Breach Rate | ❌ cut | Needs breach correlator; no single source |
| 49 | Supply Chain | `impact_sector` | Impact by Sector | ✅ keep | Inferable from victims |
| 50 | Supply Chain | `attack_vectors` | Attack Vectors | ✅ keep | Observable |

---

## Summary by category

| Category | Before | After | Cut | Net |
|---|---:|---:|---:|---|
| 🩸 Ransomware | 5 | 3 | 2 | `recovery_time`, `payment_rate` |
| 🎣 Phishing | 5 | 3 | 2 | `click_rate`, `bec_losses` |
| 🔑 Infostealer | 5 | 5 | 0 | (SOCRadar sources all) |
| 💰 Logs on Sale | 5 | 3 | 2 | `seller_rep`, `buyer_sectors` |
| 💧 Data Leaks | 5 | 3 | 2 | `breach_cost`, `time_to_detect` |
| 👔 Employee Exposure | 5 | 5 | 0 | (all derivable from leaks + infostealer) |
| 🌑 Dark Web Mentions | 5 | 4 | 1 | `access_pricing` |
| 🛡 Vulnerability | 5 | 5 | 0 | (NVD + CISA KEV trivial) |
| 💣 DDoS | 5 | 2 | 3 | `peak_bandwidth`, `duration`, `booter_services` |
| 🔗 Supply Chain | 5 | 4 | 1 | `third_party_rate` |
| **Total** | **50** | **37** | **13** | |

> Note: I counted 13 cuts here vs. 12 earlier — the plan file said 12 because I missed `dark_web_mentions/access_pricing` on one pass. Authoritative number is **13 cuts**.

---

## DDoS flag

Post-cut DDoS has **only 2 data points** (`attack_vectors`, `target_sectors`). That's thin. Options:

- **Accept thin (recommended):** keep category, 2 data points is enough to show something. Re-evaluate after pilot feedback.
- **Drop category entirely:** set `hasData: false` on DDoS in `CATEGORIES` until a vendor partner feed lands. Trade-off: users searching "DDoS" see "coming soon" instead of an underwhelming chart.

Leave the call for when you're executing.

---

## What happens in the UI after the cut

- `/builder/:cat` Data Point dropdown shortens per category (3–5 entries per `CATEGORIES.hasData=true` category).
- Default data point on category load = first entry after the cut (still works — `Builder.jsx` picks index 0 via `setDataPoint(DATA_POINTS_BY_CATEGORY[selectedCat.id][0].id)`).
- Previously-saved shareable URLs pointing at a cut data point (e.g. `/builder/ransomware?dataPoint=recovery_time`) — **no such URL format exists today**, the Builder's `dataPoint` state isn't in the URL — so no deep-link breakage risk.
- No cascade to Intelligence Library, Records layer, validator, or any UI outside the Builder dropdown.

---

## To execute

One file edit — remove the 13 marked entries from `DATA_POINTS_BY_CATEGORY` in `frontend/src/lib/data.js`. Optionally mirror in `frontend/src/lib/enriched_data.js` or delete that file entirely (it's an unused duplicate).

Then:

```
cd frontend && npm run build           # must pass
node scripts/validate-library.mjs      # must exit 0
# Eyeball /builder/ransomware, /builder/ddos, etc. → dropdowns match "After" column above
git commit -m "chore(data): prune 13 non-sustainable Builder data points"
git push personal feature/unified-data-layer
```
