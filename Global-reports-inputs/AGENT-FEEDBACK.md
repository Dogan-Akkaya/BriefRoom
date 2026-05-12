# Feedback for the Global Reports Extraction Agent

This file is your spec sheet. Brief Room's transformer (`frontend/scripts/ingest/ingest-global-reports.mjs`) maps your JSON drops in this folder into our canonical schema. Every item in the table below is a place where your output drifts from what we'd ingest "as-is" — fixing them shrinks the transformer's mapping table and reduces silent edge cases.

**Last reviewed:** 2026-05-11 by the Brief Room team.
**Current score:** 42 reports, 1,101 cards, ✓ ingestible — with **17 warnings** from the inputs validator that you can fix at source.

When this file's tables reach near-zero, the transformer becomes a pure rename (camelCase → snake_case) and our `canonical-tags.mjs` map empties out. That's the goal state.

---

## What you're doing well (please keep doing)

1. **One JSON per report**, filename = `<reportId>.json` matching the `reportId` field exactly. Zero violations.
2. **Card IDs** in the form `<reportId>-<slug>`. **Zero duplicates** across all 1,101 cards. Don't change this convention.
3. **Brand color (`color` at top level)** — vendor's official hex. We use it for the brand chip background. Don't change once set.
4. **`sourceUrl`** — real, resolvable PDF or landing-page URLs. We render these as "Open original report ↗" buttons.
5. **`comparison` / `trend` / `valueUnit` / `pageOrSection`** — rich captions we render as a footer on each card in the drill-down view. Keep these populated.
6. **Per-card `industry` / `region` / `threatType` / `category` / `tags`** — tagging at the card level is much better than at the report level. Don't move this back up.
7. **`cardStyle`** field separates visual style from semantic type. We respect both.

---

## 1. `threatType[]` — conform to canonical 10

Use **only** these values:

```
ransomware  phishing  infostealer  logs_on_sale  data_leaks
employee_exposure  dark_web_mentions  vulnerability  ddos  supply_chain
```

If a card's substance matches none, leave the array empty (`[]`) — we'll route it via `category` instead.

### Stop emitting these — translate yourself before output

| Drop | Use instead | Push the original into `tags[]` as |
|---|---|---|
| `bec` (90 hits) | `phishing` | `bec` |
| `crypto-crime` (32) | `data_leaks` | `crypto-crime` |
| `bots` (18) | `ddos` | `bots` |
| `credential_stuffing` (6) | `infostealer` + `phishing` | `credential-stuffing` |
| `api_attacks` (6) | `vulnerability` | `api-attacks` |
| `quishing` (6) | `phishing` | `quishing` |
| `vishing` (3) | `phishing` | `vishing` |
| `smishing` (1) | `phishing` | `smishing` |

Today our transformer does this rewrite for you. The result is correct — but a fresh canonical input avoids the lossy step.

---

## 2. `region[]` — conform to canonical 6, expand `Global` yourself

Use only these 6 strings, exact match:

```
North America  Europe  Middle East  Asia Pacific  Latin America  Africa
```

### Today's misfits

| Drop | Use instead | Notes |
|---|---|---|
| `Global` (69 cards) | all 6 regions | If a card is genuinely region-agnostic, expand to all 6. Also add `'global'` to `tags[]` for searchability. |
| `MENA` (51 cards) | `Middle East` | Add `'mena'` to `tags[]`. Don't double-count into Africa. |
| `LATAM` (24 cards) | `Latin America` | Alias only. |

---

## 3. `industry[]` — conform to canonical 10

```
Financial Services  Healthcare  Technology  Government  Manufacturing
Energy & Utilities  Retail & E-Commerce  Telecommunications  Education  Transportation
```

### Today's misfits

| Drop | Use instead | Push original into `tags[]` |
|---|---|---|
| `Insurance` (34) | `Financial Services` | `industry:insurance` |
| `Defense` (20) | `Government` | `industry:defense` |
| `Hospitality` (6) | `Retail & E-Commerce` | `industry:hospitality` |
| `Pharma` / `Pharmaceutical` (4) | `Healthcare` | `industry:pharma` |
| `Public Sector` | `Government` | `industry:public-sector` |
| `Entertainment`, `Gaming`, `Construction`, `Agriculture`, `Legal`, `Media`, `Non-Profit` | `[]` (empty industry) | `industry:<slug>` |

**Empty `industry: []` is perfectly fine** — many reports are sector-agnostic. Don't fabricate industries to fill the array.

---

## 4. `category` — conform to our 14-value display vocab

```
Ransomware  Phishing  Vulnerabilities  Threat Landscape  Threat Actors
Identity  AI Security  Supply Chain  DDoS  Detection
Data Breaches  eCrime  Dark Web  Compliance  Insurance
```

### Current drift to fix

| Stop emitting | Use instead |
|---|---|
| `Phishing & BEC` | `Phishing` |
| `Vulnerabilities & Zero-Days` | `Vulnerabilities` |
| `Identity & Access` | `Identity` |
| `DDoS & Network` | `DDoS` |
| `Bots & Automation` | `DDoS` |
| `Regulatory & Compliance` | `Compliance` |
| `Cyber Insurance` | `Insurance` |
| `Cryptocurrency Crime` | `eCrime` |
| `Security Awareness` | `Phishing` |
| `IoT & Mobile` | `Vulnerabilities` |
| `OT / ICS` | `Vulnerabilities` |
| `Insider Threats` | `Data Breaches` |
| `Cloud Security` | `Vulnerabilities` |
| `Geopolitics` | `Threat Actors` |
| `Incident Response` | `Detection` |
| `Other` / `Intrusion` | pick from list above; don't ship as-is |

---

## 5. `cardStyle: "text"` — don't emit

One card today (`proofpoint-state-of-the-phish-2024.json#cards[8]`). We can't render plain text well. Convert to:
- `quote` with the body as the `quote` string, **OR**
- `number` if a headline fact can be extracted, **OR**
- drop it.

---

## 6. Sparkline `spark[]` — exactly 6 values

Our default sparkline assumes 6 ticks. Today the range is 2–20.

| If you have... | Do this |
|---|---|
| 2–3 values | Don't emit `cardStyle: "sparkline"`. Use `cardStyle: "number"` and put the trend in `comparison`. |
| 6 values | Perfect. |
| 12 values (monthly) | Downsample to 6 (every 2nd, or quarter midpoints). |
| 20 values | Downsample to 6 evenly. |
| Genuinely a long time series | Use `cardStyle: "chart"` with full labels + dataset. |

Cards that don't follow this today get downsampled or demoted in our transformer; they survive but lose some signal.

---

## 7. `featured: true` — be consistent

Today only `crowdstrike-global-threat-report-2025.json` (9 featured) and `sophos-state-of-ransomware-2025.json` (11 featured) mark anything `featured: true`. Everyone else: 0.

Pick one rule and apply it uniformly:
- **A.** Mark 5–8 of the headline cards in every report `featured: true`. We use this as a curation hint.
- **B.** Leave `featured: false` everywhere. We'll score and curate downstream.

The "5 reports do it, 37 don't" state is worst-of-both: not enough featured cards to be reliable signal, but not absent enough to ignore.

---

## 8. `publicationDate` — populate when you can

Today 7 reports have `publicationDate: null`. We fall back to `extractedOn` (today's date), which makes those reports look fresher than they are.

When discoverable from PDF metadata, the report's cover page, or the vendor's announcement blog, populate `publicationDate` (ISO `YYYY-MM-DD`). If genuinely unknown, leaving `null` is acceptable.

---

## 9. `trend` vocab — extend ours or align yours

Inputs today use `'stable'` and `'mixed'` in addition to our canonical `increasing / decreasing / flat / unknown`. We've **accepted** these into the input validator. If you can express the same with our 4-value set:

| Yours | Ours |
|---|---|
| `stable` | `flat` |
| `mixed` | `unknown` (or emit two cards instead of one) |

…that's preferred. If not, keep `stable` / `mixed` — we render them sensibly.

---

## 10. `quote` card without a `quote` string

`zscaler-threatlabz-ransomware-report-2025.json#cards[14]` has `cardStyle: "quote"` but `quote: null`. We fall back to `value` or `description`. Always populate `quote` (it can quote the report itself, not necessarily a named person).

---

## 11. Field renames — STAY in camelCase

Don't switch to snake_case. The transformer renames at write time. Today's drift table is empty here. ✓

---

## 12. Don't emit `_chart_cards.json` (or, document its purpose)

It's a 1.4 MB aggregated rollup of every card across every report. We **don't consume it** (we read per-report files). If it's intended as a fallback for tools that can't iterate the per-report files, fine — but it's currently a duplicate that doubles the folder size with no downstream consumer. Either drop it, or add a comment in this file explaining when it should be used.

---

## How to verify your output

```bash
cd /Users/dogan/Desktop/brief-room/frontend
node scripts/validate-global-reports-inputs.mjs
```

Expected on a clean drop:

```
Files: 42  Cards: 1101
Warnings: 0
✓ All input files valid
```

Today: 17 warnings (sparkline lengths, 1 quote missing, 1 text card). Each warning points to the section above.

---

## Where the transformer pulls each field from

| Your field | Our destination | Notes |
|---|---|---|
| `reportId` | `report_meta.report_id` and `id = "gr-<reportId>"` | Stable across runs |
| `title` | `title` | Verbatim |
| `source` | `source` | Used by `sourceBrand()` to pick the brand chip |
| `sourceShort` | `source_short` | Cascaded onto every card in the file |
| `year` | `year` | Cascaded |
| `sourceUrl` | `external_url` | Outbound button on every card |
| `color` | `color` | Brand color, used in chip + hero chart |
| `publicationDate` | `updated_at` (preferred) | Falls back to `extractedOn` if null |
| `extractedOn` | `report_meta.extracted_on` | "Indexed: …" caption |
| `organizationId` | `report_meta.organization_id` | Reserved for future drill-down filters |
| `cards[*]` | one library item each; top 10 ranked into `INTELLIGENCE_LIBRARY`, rest stay for the drill-down | See `ingest-global-reports.mjs:scoreCard` |
| `cards[*].cardStyle` | `card_style` for stats; `type: "chart"` for charts | Type promotion happens at the transformer |
| `cards[*].threatType[]` | `threat_type[]` (canonicalized) | See §1 |
| `cards[*].region[]` | `region[]` (canonicalized) | See §2 |
| `cards[*].industry[]` | `industry[]` (canonicalized) | See §3 |
| `cards[*].category` | preserved on the card + drives `report.category` chip | See §4 |
| `cards[*].tags[]` | `tags[]` (augmented with our extras) | Free-form |
| `cards[*].comparison` | `comparison` | Rendered as caption |
| `cards[*].trend` | `trend` | Rendered as caption |
| `cards[*].valueUnit` | `value_unit` | Rendered as caption |
| `cards[*].pageOrSection` | `page_or_section` | Rendered as caption |
| `cards[*].featured` | scoring weight only; we always emit `featured: false` to avoid polluting the 12-chart Popular grid | See `CLAUDE.md` Popular Charts rule |

That's the whole contract. Drop new files when ready and the next ingest run picks them up.
