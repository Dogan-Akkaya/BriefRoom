# Manual data drop zone

Every JSON file in this folder is auto-loaded by the frontend at build time. Drop a file, run `npm run validate`, push — your stats are live on the next deploy.

This is the **manual** path. Not to be confused with `src/data/generated/`, which is written by the daily ingestion script. The two paths are completely independent.

## File schema

One JSON file per source / vendor report. File-level fields cascade onto every item; per-item overrides win when set.

```jsonc
{
  "source": "Verizon DBIR 2026",        // required (file or per-item)
  "source_short": "DBIR",                // optional, used for brand chip
  "year": 2026,                          // optional
  "real": true,                          // default true; sets real:true on every item
  "notes": "Free text — never read by code, just for human context.",
  "items": [
    /* stat / chart / report objects — see below */
  ]
}
```

Files starting with `_` (like this README) are skipped by the loader.

## Item shapes

### Stat (single fact card)

```jsonc
{
  "type": "stat",
  "id": "dbir-2026-stolen-creds",        // kebab, globally unique across all manual files
  "title": "Use of stolen credentials",
  "value": "31%",                        // required for card_style: 'number'
  "card_style": "number",                // 'number' | 'sparkline' | 'bar' | 'quote'
  // "spark": [n,n,n,n,n,n],             // required if card_style is 'sparkline' or 'bar'
  // "quote": "...",                     // required if card_style is 'quote'
  "industry": ["Financial Services"],    // any subset of INDUSTRIES
  "region": ["North America"],           // any subset of ALL_REGIONS
  "threat_type": ["data_leaks"],         // CATEGORIES ids, lowercase
  "tags": [],                            // free-form, optional
  "updated_at": "2026-04-30"
}
```

### Chart (multi-series, surfaces on `/popular` if `featured: true`)

```jsonc
{
  "type": "chart",
  "id": "dbir-2026-attack-patterns",
  "title": "Attack Patterns by Industry",
  "dataset": {
    "labels": ["Healthcare", "Financial Services", "Technology", "Retail & E-Commerce"],
    "series": [
      { "name": "2025", "values": [38, 27, 18, 9],  "color": "#8B5CF688" },
      { "name": "2026", "values": [42, 31, 22, 11], "color": "#8B5CF6" }
    ]
  },
  "preferred_chart": "bar",              // 'bar' | 'line' | 'area' | 'pie'
  "industry": ["Healthcare", "Financial Services", "Technology", "Retail & E-Commerce"],
  "region": ["North America", "Europe", "Asia Pacific", "Latin America", "Middle East", "Africa"],
  "threat_type": ["data_leaks"],
  "featured": false,                     // true → surfaces on /popular (max 12 featured globally — validator gates this)
  "tags": ["by-industry", "yearly"],
  "updated_at": "2026-04-30"
}
```

### Report (vendor report mirror — currently surfaces on `/explore` and library, not on `/reports`)

```jsonc
{
  "type": "report",
  "id": "dbir-2026-overview",
  "title": "Verizon DBIR 2026 — Overview",
  "year": 2026,
  "category": "Data Breaches",
  "color": "#8B5CF6",
  "description": "...",
  "preferred_chart": "bar",
  "dataset": {
    "labels": ["..."],
    "series": [{ "name": "...", "values": [], "color": "#8B5CF6" }]
  },
  "industry": [],                        // reports allowed empty
  "region": [],
  "threat_type": ["data_leaks"]          // at minimum tag a threat type so slice queries reach it
}
```

> **Note:** `/reports` page now reads `globalReports()` from `intelligenceLibrary.js`, which surfaces every `type: 'report'` item from this folder. Adding a vendor report = dropping a JSON file here (or letting `npm run ingest:global-reports` write one). The legacy `GLOBAL_REPORTS` array in `data.js` has been retired.

## Tag vocabulary cheat-sheet

Tag values are exact-match. Drift is caught by `npm run validate`.

| Field | Valid values |
|---|---|
| `industry[]` | `Financial Services`, `Healthcare`, `Technology`, `Government`, `Manufacturing`, `Energy & Utilities`, `Retail & E-Commerce`, `Telecommunications`, `Education`, `Transportation` |
| `region[]` | `North America`, `Europe`, `Middle East`, `Asia Pacific`, `Latin America`, `Africa` |
| `threat_type[]` | `ransomware`, `phishing`, `infostealer`, `logs_on_sale`, `data_leaks`, `employee_exposure`, `dark_web_mentions`, `vulnerability`, `ddos`, `supply_chain` |
| `updated_at` | ISO 8601 — `'YYYY-MM-DD'` |

## How it surfaces in the UI

| Item type | Where it appears |
|---|---|
| `stat` | `/explore/<dim>/<value>` slice grids; library `sliceItems()` queries |
| `chart` | `/explore/<dim>/<value>` "Featured in this slice" if `featured: true`; `/popular` grid if `featured: true` |
| `report` | `/reports` grid (via `globalReports()`), `/reports/:reportId` drill-down, `/explore` slice queries |

`real: true` items rank above synthetic backfill in slice views — manual data wins over the auto-generated coverage filler.

## Workflow

1. Create / edit a JSON file in this folder, or open an existing one.
2. `cd frontend && npm run validate` — gate fails on tag drift, missing required fields, ISO date format issues, duplicate IDs.
3. `npm run dev` — verify the new item appears at the relevant route.
4. Push the PR. CI runs the same `npm run validate` gate.

## Adding a new vendor

Drop a new JSON file. Convention: `<vendor-or-source>-<year>.json` (e.g. `crowdstrike-overwatch-2026.json`, `mandiant-mtrends-2026.json`). New file → next build picks it up. No imports to update.

## Edit cadence

This folder grows as you ingest more vendor reports. Per-vendor splitting keeps file sizes manageable and PR diffs surgical — no merge conflicts when multiple people add stats from different sources.

If a single vendor's file exceeds ~200 items, split by year (`dbir-2025.json`, `dbir-2026.json`) or by section.
