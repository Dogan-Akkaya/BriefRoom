# Brief Room — Data Guide

_Phase 1 — everything in this app is local dummy / seeded synthetic data. No backend yet. This document tells you **where each data piece lives**, **how to check it**, **how to add more**, and **how to fill in the four threat categories currently marked `hasData: false`** with your own test data._

> Keep `npm run dev` running on **http://localhost:5173** while you work — HMR reloads every data change instantly, so you can visually verify each edit as you go.

---

## Section A — At-a-glance map

### A.1 Canonical taxonomy — `frontend/src/lib/data.js`

The master lists. Everything else references these.

| Export | Shape | Count | Used for |
|---|---|---|---|
| `CATEGORIES` | `{id, label, svgPath, desc, hasData}` | 10 | Threat-type taxonomy (Ransomware, Phishing, …). **4 entries have `hasData:false`** and will be filled by you — see Section E. |
| `INDUSTRIES` | `string[]` | 10 | Sector list (Financial Services, Healthcare, …) |
| `ALL_COUNTRIES` | `{name, region}` | 31 | Country + region mapping |
| `ALL_REGIONS` | `string[]` | 6 | Derived from `ALL_COUNTRIES` (North America, Europe, …) |
| `THREAT_GROUPS` | `string[]` | 13 | Ransomware gang names (LockBit, BlackCat, …) |
| `DATA_POINTS_BY_CATEGORY` | `{[catId]: {id, label, elements[]}[]}` | 6 keys | Per-category analysis dimensions for the Builder. **Only entries for `hasData:true` categories today.** |
| `MONTHS` | `string[]` (Jan-Dec) | 12 | Chart labels |
| `ALL_MONTHS` | `{month, year, label}[]` | 36 | Jan 2024 – Dec 2026 |
| `DATA_AVAILABILITY` | `{month, year, label, index, sources}[]` | 36 | Seeded "how many sources reported this month" count |
| `DATE_PRESETS` | `{label, start, end}[]` | 5 | Last 3 months / Last 6 months / YTD / etc. |
| `generateData(key, filter?)` | function | — | Seeded RNG generator. Returns `{name, Jan..Dec, color}[]`. Used by the Builder to render a chart for any category + data point + filter combo. Has a baked-in element fallback map for all 10 threat types (including the `hasData:false` ones). |

### A.2 Intelligence Library — `frontend/src/lib/intelligenceLibrary.js`

The unified slice-aware collection. Powers `/popular`, `/explore`, and search.

- **`HAND_CRAFTED`** — 22 manually-authored items (12 featured charts + 10 stats)
- **Generator** (`generateCoverage`) fills gaps so every dimension value has ≥12 items
- **Final `INTELLIGENCE_LIBRARY`** — ~107 items total
- Selectors: `popularCharts()`, `sliceItems(dim, val)`, `crossSliceItems(d1, v1, d2, v2)`, `crossSliceCounts(pivotDim, pivotVal, otherDim)`
- Slug helpers: `labelToSlug(str)`, `slugToLabel(dim, slug)`, `threatTypeLabel(id)`

### A.3 Legacy / surface-specific arrays

| Export / File | Count | Consumer |
|---|---|---|
| `POPULAR` (`data.js`) | 8 | SearchPanel autocomplete (Landing's Popular grid now pulls from `popularCharts()` instead). Kept around until SearchPanel is migrated. |
| `GLOBAL_REPORTS` (`data.js`) | 12 | `/reports` page + Landing's Global Reports preview |
| `SEARCH_SUGGESTIONS` (`data.js`) | 8 | SearchPanel placeholder suggestions |
| `insights` (`data.js`) | 5 HTML strings | Landing insights band |
| Component-local filter lists | varies | Inline arrays like `CATEGORY_FILTERS`, `SOURCES` inside `Popular.jsx`, `Reports.jsx`, `ControlPanel.jsx` |

---

## Section B — Schemas (every field documented)

### B.1 `CATEGORIES` item
```js
{
  id: 'ransomware',               // lowercase kebab; used in URLs and threat_type tags
  label: 'Ransomware',            // display name
  svgPath: 'M12 2a4 4 0 0 0-4 4...', // 24x24 icon path
  desc: 'Attack frequency, ransom demands, targeted sectors and recovery metrics',
  hasData: true,                   // false → surfaces as "coming soon" in the wizard's Threat Type tab
}
```

### B.2 `DATA_POINTS_BY_CATEGORY` entry
```js
// key is a CATEGORIES id
ransomware: [
  {
    id: 'attack_volume',
    label: 'Attack Volume',
    elements: ['Healthcare', 'Finance', 'Manufacturing', 'Government', 'Education', 'Energy', 'Retail', 'Technology'],
  },
  // 4 more data points...
],
```

### B.3 `POPULAR` item (legacy)
```js
{
  title: 'Ransomware Attacks by Sector',
  views: '12.4k',                // display-only, decorative
  tag: 'THREAT INTEL',           // uppercase badge
  trend: '+23% YoY',             // free text
  up: true,                      // arrow direction
  color: '#FF4562',
  data: [12, 19, 15, /* 12 numbers */],  // monthly
  sources: 'SOCRadar ThreatVision 2026',
  updated: 'Mar 2026',
  detail: 'Healthcare and manufacturing remain the most targeted sectors...',
  metrics: [{ label: 'Avg. Ransom', value: '$1.2M' }, /* 1-2 more */],
  categoryId: 'ransomware',      // links to CATEGORIES[i].id for "Customize"
}
```

### B.4 `GLOBAL_REPORTS` item
```js
{
  id: 'ibm-breach-cost',                   // unique
  source: 'IBM X-Force',                   // full source name
  sourceShort: 'IBM',                       // short badge form
  title: 'Cost of a Data Breach by Industry',
  year: 2025,
  category: 'Data Breaches',                // filter key; must match one in Reports.jsx CATEGORIES list
  color: '#3B82F6',
  description: 'Healthcare leads at $10.9M...',
  chartType: 'bar',                         // 'bar' | 'line'
  dummyData: [10.9, 5.9, 4.8, 4.7, 4.6, 3.7, 2.6],
  dummyLabels: ['Healthcare', 'Financial', 'Pharma', 'Tech', 'Energy', 'Education', 'Gov'],
}
```

### B.5 Intelligence Library item — stat

```js
{
  id: 'stat-mfg-ransomware-yoy',   // unique, kebab, stable
  type: 'stat',
  title: 'Manufacturing ransomware incidents',
  value: '+34% YoY',               // headline number/text
  card_style: 'sparkline',         // 'number' | 'sparkline' | 'bar' | 'quote'
  spark: [18, 22, 26, 31, 38, 45], // required for 'sparkline' | 'bar' (6 values)
  // quote: '"..."'                 // required for 'quote' instead of value
  source: 'SOCRadar ThreatVision',
  industry: ['Manufacturing'],     // exact strings from INDUSTRIES
  region: ['North America', 'Europe', 'Asia Pacific'], // exact from ALL_REGIONS
  threat_type: ['ransomware'],      // CATEGORIES ids (lowercase)
  featured: false,
  tags: ['yoy'],
  updated_at: '2026-03-01',
}
```

**Card-style visual rules (applied by `SliceStatCard.jsx`):**
- `number` → 1-column grid cell, big headline numeral
- `sparkline` → 2-column grid cell, number + SVG sparkline side-by-side
- `bar` → 2-column grid cell, number + tiny SVG bar chart side-by-side
- `quote` → 3-column grid cell (full row), italicized pull-quote

### B.6 Intelligence Library item — chart

```js
{
  id: 'pop-ransomware-by-sector',
  type: 'chart',
  title: 'Ransomware Attacks by Sector',
  dataset: {
    labels: MONTHS,                // or any string[]
    series: [
      { name: 'Healthcare', values: [12, 19, 15, /*...*/], color: '#FF4562' },
      { name: 'Manufacturing', values: [9, 14, 18, /*...*/], color: '#7B61FF' },
    ],
  },
  preferred_chart: 'bar',           // 'bar' | 'line' | 'area' | 'pie'
  source: '2,400+ incident reports',
  industry: ['Healthcare', 'Manufacturing'],
  region: ['North America', 'Europe'],
  threat_type: ['ransomware'],
  featured: true,                   // featured charts appear on /popular
  tags: ['by-sector'],
  updated_at: '2026-03-15',
  display: {                        // optional — preserves POPULAR's decorative extras
    views: '12.4k',
    trend: '+23% YoY',
    up: true,
    detail: 'Healthcare and manufacturing remain the most targeted sectors...',
    metrics: [{ label: 'Avg. Ransom', value: '$1.2M' }],
  },
}
```

---

## Section C — How to READ (check the data)

One workflow per data source. Assume `npm run dev` is running at http://localhost:5173.

### C.1 `CATEGORIES`
| Where it shows up | How to spot a problem |
|---|---|
| Wizard Step 1 at `/explore` → Threat Type tab | Missing label, broken icon, or `hasData:false` shows as greyed out / disabled |
| `/popular` sidebar → Category filter | A filter option renders but clicking it yields 0 cards = broken tag mapping |
| Builder breadcrumb + PNG export filename | Wrong label printed on the export PNG title |
| Navbar Custom Builder link → redirects to `/explore` | |

Grep: `CATEGORIES` across `src/` to trace every consumer.

### C.2 `INDUSTRIES`
| Where it shows up | How to spot a problem |
|---|---|
| `/explore` Step 1 → Industry tab | Missing industry (or wrong label) |
| `/popular` sidebar Industry dropdown | Shows "All Industries" + every entry |
| Builder → ControlPanel → Industry filter | **Watch out: ControlPanel has its own hardcoded copy** — update both if you ever rename |

### C.3 `ALL_COUNTRIES` / `ALL_REGIONS`
| Where it shows up | How to spot a problem |
|---|---|
| Builder → ControlPanel → Country/Region selector | Missing country or wrong region assignment |
| `/popular`, `/reports` sidebar → Country/Region filter | Typo makes a filter return 0 items |
| `/explore` Step 1 → Region tab | |

### C.4 `DATA_POINTS_BY_CATEGORY`
| Where it shows up | How to spot a problem |
|---|---|
| Builder right sidebar → Data Point dropdown | Dropdown empty for a `hasData:true` category = missing entry (see Section E) |
| Chart render (the elements shown as bars/lines) | `elements` array too short = chart looks sparse |

### C.5 Intelligence Library
| Where it shows up | Spot-check |
|---|---|
| `/popular` | **12 featured cards** render. Filters narrow correctly. |
| `/explore` | "Intelligence at a glance" section shows all stat-type items. Variable spans read dynamically (number=1, chart-style=2, quote=3 cells). |
| `/explore/industry/manufacturing` | ≥12 stat items in "Already in this slice". Cross-dim counts on each Threat Type value ≥1. |
| `/explore/industry/manufacturing/threat_type/ransomware` | Featured row has ≥1 chart. Stat grid has ≥2 items. Cross-slice chips (e.g. "Manufacturing × Phishing") show counts ≥1. |

**React DevTools trick:** install React DevTools extension → Components tab → click any `<SliceStatCard>` → verify `props.item.industry`, `.region`, `.threat_type` are all non-empty arrays.

### C.6 `POPULAR` / `GLOBAL_REPORTS`
| Where it shows up | Spot-check |
|---|---|
| Landing reports preview (`/`) | Top 3 `GLOBAL_REPORTS` render as mini-report cards |
| `/reports` | All 12 reports, filterable by Source / Category / Year |
| SearchPanel | Typing a title fragment returns matches from both arrays |

### C.7 Methodology / StaticPage prose
Manual read-through after any edit:
- `/methodology` — every claim should match reality (count of charts, source names, etc.)
- `/page/privacy`, `/terms`, `/api`, `/contact` — no "under development" text

---

## Section D — How to ADD (templates)

### D.1 Adding a new Intelligence Library stat
**File:** `frontend/src/lib/intelligenceLibrary.js`
**Append site:** end of the `HAND_CRAFTED` array (before the closing `]`)

```js
{
  id: 'unique-kebab-id',
  type: 'stat',
  title: 'Short descriptive title',
  value: '42%',                    // the headline number/text
  card_style: 'number',            // 'number' | 'sparkline' | 'bar' | 'quote'
  // spark: [n,n,n,n,n,n]          // REQUIRED if card_style is 'sparkline' or 'bar' (6 numbers)
  // quote: '"..."'                // REQUIRED if card_style is 'quote' (use `value` for a short label above the quote or leave out)
  source: 'Attribution 2026',
  industry:    ['Healthcare'],     // exact strings from INDUSTRIES
  region:      ['North America'],  // exact from ALL_REGIONS
  threat_type: ['ransomware'],     // CATEGORIES ids (lowercase)
  featured: false,                 // always false for stats (featured surfaces charts only)
  tags: [],
  updated_at: '2026-04-18',
},
```

**After saving:** Vite HMR reloads. Visit `/explore/industry/healthcare` — your new item should appear in the stat grid.

### D.2 Adding a new Intelligence Library chart
**File:** same — `intelligenceLibrary.js` → `HAND_CRAFTED` array.

```js
{
  id: 'unique-kebab-id',
  type: 'chart',
  title: 'Chart title',
  dataset: {
    labels: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
    series: [
      { name: 'Series 1', values: [10, 14, 18, 22, 19, 24, 28, 32, 29, 35, 40, 45], color: '#FF4562' },
    ],
  },
  preferred_chart: 'bar',          // 'bar' | 'line' | 'area' | 'pie'
  source: 'Attribution 2026',
  industry:    ['Manufacturing'],
  region:      ['Europe'],
  threat_type: ['phishing'],
  featured: true,                  // true → surfaces on /popular (only works for charts)
  tags: [],
  updated_at: '2026-04-18',
  display: {                       // optional — fills extra card fields on /popular
    views: '8.2k',
    trend: '+12% YoY',
    up: true,
    detail: '1-2 sentence elaboration',
    metrics: [{ label: 'Something', value: '42' }],
  },
},
```

**After saving:** if `featured: true`, visit `/popular` — new card appears. Visit `/explore/<dim>/<value>` matching a tag — shows in "Featured in this slice" row on Step 2 slice view.

### D.3 Adding a `POPULAR` item (Landing's legacy array)
**File:** `frontend/src/lib/data.js` → `POPULAR` array
**Use if:** you want it to appear in the Landing's hero grid specifically. Currently the Landing still reads from this (after the fix-5 migration it reads from `popularCharts()` instead; the legacy array survives for SearchPanel).

Copy the template from B.3 above. Append to the array. Save.

### D.4 Adding a `GLOBAL_REPORTS` item
**File:** `frontend/src/lib/data.js` → `GLOBAL_REPORTS` array.

Use the template from B.4. Important rules:
- `id` must be unique
- `category` must match one of the filter options in `Reports.jsx`'s `CATEGORIES` list (currently: Data Breaches, Threat Actors, Ransomware, Detection, Breaches, eCrime, Intrusion, Threat Landscape) — or add your value there too
- `sourceShort` is what appears on the card's badge; keep it short (e.g. "IBM", "CS", "DBIR")

### D.5 Extending `INDUSTRIES`
**File:** `frontend/src/lib/data.js`
```js
export const INDUSTRIES = [
  'Financial Services', 'Healthcare', /* ... */ 'Transportation',
  'Your New Industry',   // add at the end
]
```

**Cascade — also update:**
1. `frontend/src/components/ControlPanel.jsx` line ~8 — its local `INDUSTRIES` array (prefix `'All Industries'` stays) — **this file has an intentional duplicate; keep both in sync.**
2. If you want library items tagged with the new industry, add some to `HAND_CRAFTED` in `intelligenceLibrary.js` — the generator will backfill to ≥12.

### D.6 Extending `CATEGORIES`
**File:** `frontend/src/lib/data.js`
```js
{
  id: 'new_category',              // lowercase snake_case, URL-safe
  label: 'New Category',
  svgPath: 'M...',                 // 24x24 SVG path (use any icon editor)
  desc: '1-line description',
  hasData: true,                   // true from the start or you'll need Section E workflow
},
```

**Cascade:**
1. Add a `DATA_POINTS_BY_CATEGORY[new_category]` entry (Builder won't render a chart without this when `hasData:true`).
2. Add an element-fallback row in `generateData` (line ~90 in `data.js`) — provides default elements if a data point isn't selected yet.
3. Optionally, add library items tagged with `threat_type: ['new_category']` so `/explore/threat_type/new-category` has content.
4. `THREAT_COLOR` map in `intelligenceLibrary.js` — add a color so generated charts for this type have a brand.

### D.7 Extending `ALL_COUNTRIES`
**File:** `frontend/src/lib/data.js`
```js
{ name: 'Your Country', region: 'North America' /* or any value already in ALL_REGIONS */ },
```
- `ALL_REGIONS` is derived automatically — if you use an existing region, nothing else to update.
- If you introduce a new region, also verify the library's region tags include some items for it.

---

## Section E — Filling the 4 `hasData:false` threat categories

These four categories currently render as "Coming soon" (if wizard sees `hasData:false`) or show synthetic fallback data in the Builder. The walk-through below turns any of them into a first-class category with your test data.

**Categories to fill:** `infostealer`, `logs_on_sale`, `employee_exposure`, `ddos`.

### Step-by-step (example: `infostealer`)

**Step 1 — Flip the flag.**
**File:** `frontend/src/lib/data.js` (inside `CATEGORIES` array)
```diff
-  { id: 'infostealer', label: 'Infostealer Logs', svgPath: '…', desc: 'Stolen credential volumes, affected domains and malware families', hasData: false },
+  { id: 'infostealer', label: 'Infostealer Logs', svgPath: '…', desc: 'Stolen credential volumes, affected domains and malware families', hasData: true },
```
After: the wizard's Threat Type tab stops greying this one out; `/popular` sidebar gains it as a filter option.

**Step 2 — Add Builder data points.**
**File:** `frontend/src/lib/data.js` (inside `DATA_POINTS_BY_CATEGORY` object)
```js
infostealer: [
  { id: 'malware_families', label: 'Malware Families', elements: ['RedLine', 'Raccoon', 'Vidar', 'Lumma', 'StealC', 'Risepro', 'Meta', 'Rhadamanthys'] },
  { id: 'victim_volumes', label: 'Victim Volumes', elements: ['Healthcare', 'Finance', 'Manufacturing', 'Government', 'Retail', 'Technology'] },
  { id: 'credential_types', label: 'Credential Types', elements: ['Email/Pass', 'Session Cookies', 'Saved Passwords', 'Crypto Wallets', 'VPN Creds', 'Cloud Accounts'] },
  { id: 'log_freshness', label: 'Log Freshness (days)', elements: ['<7', '7-30', '30-90', '90-180', '180+'] },
  { id: 'price_tiers', label: 'Price Tiers ($)', elements: ['<$10', '$10-$50', '$50-$200', '$200-$1K', '$1K+'] },
],
```

**Step 3 — Verify `generateData` fallback.**
**File:** `frontend/src/lib/data.js` around line 90-102. The `elements` map already has an entry for `infostealer` — verify it looks reasonable. If not, adjust:
```js
infostealer: ['Redline', 'Raccoon', 'Vidar', 'Lumma', 'StealC', 'Risepro'],
```

**Step 4 — Add a few hand-crafted library items.**
**File:** `frontend/src/lib/intelligenceLibrary.js` → `HAND_CRAFTED` array.

Add **at least 1 featured chart** + **3 stats** tagged with `threat_type: ['infostealer']`. Example chart:
```js
{
  id: 'pop-infostealer-families',
  type: 'chart',
  title: 'Infostealer Malware Families by Share',
  dataset: {
    labels: ['RedLine', 'Raccoon', 'Vidar', 'Lumma', 'StealC', 'Risepro'],
    series: [{ name: 'Share (%)', values: [34, 22, 14, 12, 10, 8], color: '#14B8A6' }],
  },
  preferred_chart: 'bar',
  source: 'SOCRadar Infostealer Monitor 2026',
  industry: ['Financial Services', 'Technology'],
  region: ['North America', 'Europe', 'Latin America'],
  threat_type: ['infostealer'],
  featured: true,
  tags: ['families'],
  updated_at: '2026-04-18',
  display: { views: '5.4k', trend: '+19% YoY', up: true, detail: 'RedLine retains the top spot; Lumma rises fast after Redline source leak.' },
},
```

Plus 3 stats — use different `card_style` values so the grid looks varied:
```js
{ id: 'stat-infostealer-volume', type: 'stat', title: 'Stolen credentials indexed', value: '24B+', card_style: 'number', source: 'SOCRadar Dark Web 2026', industry: ['Financial Services', 'Technology', 'Healthcare'], region: ['North America', 'Europe', 'Latin America'], threat_type: ['infostealer'], featured: false, tags: [], updated_at: '2026-04-18' },
{ id: 'stat-infostealer-redline-share', type: 'stat', title: 'RedLine market share', value: '34%', card_style: 'bar', spark: [26, 28, 30, 32, 33, 34], source: 'SOCRadar Infostealer Monitor', industry: ['Financial Services', 'Technology'], region: ['North America', 'Europe'], threat_type: ['infostealer'], featured: false, tags: [], updated_at: '2026-04-18' },
{ id: 'stat-infostealer-quote', type: 'stat', title: 'Analyst note', quote: '"Session-cookie theft from infostealer logs is now the dominant vector for MFA bypass, overtaking credential stuffing in Q1 2026."', card_style: 'quote', source: 'SOCRadar CTI 2026', industry: ['Technology', 'Financial Services'], region: ['North America'], threat_type: ['infostealer'], featured: false, tags: [], updated_at: '2026-04-18' },
```

**Step 5 — Verify everything lights up.**
1. HMR reloads automatically. Visit `/explore/threat_type/infostealer` — slice view should render with your new items + generator-filled ≥12 items total.
2. Visit `/popular` — your featured chart shows up (among the 12 featured cards).
3. Visit `/builder/infostealer` — Builder renders, Data Point dropdown has your 5 entries, switching between them produces different chart shapes.
4. Run the validation snippet (Section F) and confirm no errors.

**Step 6 — Repeat for the other three categories.**
The categories and suggested data points:

- **`logs_on_sale`** — marketplace / broker pricing data. Data points: `listings_volume`, `price_tiers`, `access_types`, `seller_rep`, `buyer_sectors`.
- **`employee_exposure`** — corporate PII leaks. Data points: `pii_types`, `exec_exposure`, `credential_leaks`, `breach_sources`, `time_since_leak`.
- **`ddos`** — **already has a fallback in `generateData`**, and the Builder will render a chart even without `DATA_POINTS_BY_CATEGORY` entries. But if you want proper data points, add: `attack_vectors`, `peak_bandwidth`, `duration`, `target_sectors`, `booter_services`.

For each: repeat Steps 1-5 with category-appropriate content.

---

## Section F — Validation snippet

This Node script imports the Intelligence Library and checks that every item is schema-correct. Save it somewhere convenient and run `node scripts/validate-library.mjs`.

```js
// frontend/scripts/validate-library.mjs
import { readFileSync } from 'fs'

// Mock canonical lists so we can evaluate the module in Node
const INDUSTRIES = ['Financial Services','Healthcare','Technology','Government','Manufacturing','Energy & Utilities','Retail & E-Commerce','Telecommunications','Education','Transportation']
const ALL_REGIONS = ['North America','Europe','Middle East','Asia Pacific','Latin America','Africa']
const CATEGORIES = [
  { id: 'ransomware', label: 'Ransomware', hasData: true },
  { id: 'phishing', label: 'Phishing', hasData: true },
  { id: 'infostealer', label: 'Infostealer', hasData: false },
  { id: 'logs_on_sale', label: 'Logs', hasData: false },
  { id: 'data_leaks', label: 'Data Leaks', hasData: true },
  { id: 'employee_exposure', label: 'Exec', hasData: false },
  { id: 'dark_web_mentions', label: 'Dark Web', hasData: true },
  { id: 'vulnerability', label: 'Vuln', hasData: true },
  { id: 'ddos', label: 'DDoS', hasData: false },
  { id: 'supply_chain', label: 'Supply Chain', hasData: true },
]
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

let src = readFileSync(new URL('../src/lib/intelligenceLibrary.js', import.meta.url), 'utf8')
src = src.replace("import { INDUSTRIES, ALL_REGIONS, CATEGORIES, MONTHS } from './data'", '')
const fn = eval(`(function(INDUSTRIES, ALL_REGIONS, CATEGORIES, MONTHS) { ${src.replace(/export const /g, 'var ').replace(/export /g, '')} return { INTELLIGENCE_LIBRARY, popularCharts, sliceItems, crossSliceItems, crossSliceCounts } })`)
const lib = fn(INDUSTRIES, ALL_REGIONS, CATEGORIES, MONTHS)

let errors = 0
const fail = (msg) => { console.error('✗', msg); errors++ }

// 1. Count per dimension
console.log('--- Coverage ---')
for (const i of INDUSTRIES) {
  const n = lib.sliceItems('industry', i).length
  console.log(`  industry:${i.padEnd(22)} ${n}`)
  if (n < 12) fail(`industry "${i}" has only ${n} items (expected ≥12)`)
}
for (const r of ALL_REGIONS) {
  const n = lib.sliceItems('region', r).length
  console.log(`  region:${r.padEnd(24)}  ${n}`)
  if (n < 12) fail(`region "${r}" has only ${n} items (expected ≥12)`)
}
for (const t of CATEGORIES.map(c => c.id)) {
  const n = lib.sliceItems('threat_type', t).length
  console.log(`  threat_type:${t.padEnd(18)} ${n}`)
  if (n < 12) fail(`threat_type "${t}" has only ${n} items (expected ≥12)`)
}

// 2. Featured charts = 12
const featured = lib.popularCharts()
console.log(`\nFeatured charts: ${featured.length}`)
if (featured.length !== 12) fail(`Expected 12 featured charts, got ${featured.length}`)

// 3. Missing required fields
for (const item of lib.INTELLIGENCE_LIBRARY) {
  if (!item.id) fail(`item missing id: ${JSON.stringify(item).slice(0, 80)}`)
  if (!['stat', 'chart'].includes(item.type)) fail(`${item.id}: bad type ${item.type}`)
  if (!item.source) fail(`${item.id}: missing source`)
  if (!item.title) fail(`${item.id}: missing title`)
  if (!item.industry || !item.industry.length) fail(`${item.id}: empty industry[]`)
  if (!item.region || !item.region.length) fail(`${item.id}: empty region[]`)
  if (!item.threat_type || !item.threat_type.length) fail(`${item.id}: empty threat_type[]`)
  if (item.type === 'chart' && !item.dataset) fail(`${item.id}: chart missing dataset`)
  if (item.type === 'stat' && item.card_style && !['number', 'sparkline', 'bar', 'quote'].includes(item.card_style)) fail(`${item.id}: bad card_style ${item.card_style}`)
  if (item.card_style === 'quote' && !item.quote && !item.value) fail(`${item.id}: quote card needs quote or value`)
  if ((item.card_style === 'sparkline' || item.card_style === 'bar') && !item.spark) fail(`${item.id}: ${item.card_style} card missing spark`)
  if (item.title && item.title.includes('%IND%')) fail(`${item.id}: unexpanded %IND% in title`)
  if (item.title && item.title.includes('%REG%')) fail(`${item.id}: unexpanded %REG% in title`)
}

// 4. Unique ids
const ids = new Set()
for (const item of lib.INTELLIGENCE_LIBRARY) {
  if (ids.has(item.id)) fail(`duplicate id ${item.id}`)
  ids.add(item.id)
}

console.log(`\nTotal items: ${lib.INTELLIGENCE_LIBRARY.length}`)
console.log(errors ? `\n✗ ${errors} error(s)` : '\n✓ All checks passed')
process.exit(errors ? 1 : 0)
```

Run: `cd frontend && node scripts/validate-library.mjs`.

---

## Section G — Pre-release checklist

Walk through these before sending the link to public testers.

```
Content integrity
[ ] Every source string reads like vendor+year attribution (no vague "data")
[ ] /methodology claims match actual data / UI reality
[ ] Every footer link lands on a page that reads as intentional (no "under development")
[ ] /page/privacy, /terms, /api, /contact show a clear "Beta preview" label

Coverage
[ ] Every CATEGORIES.hasData=true entry has a DATA_POINTS_BY_CATEGORY entry
[ ] /builder/:id renders a non-empty chart for every hasData=true category
[ ] /explore/threat_type/:id has ≥12 items for every category id
[ ] /popular shows exactly 12 featured cards
[ ] /popular sidebar filters (Category, Industry, Region, Trend) all work
[ ] /reports sidebar filters (Source, Category, Year) all work
[ ] /explore Step 2 slice view populated for sample slices (e.g. industry/manufacturing × threat_type/ransomware)
[ ] Cross-slice chips on Step 2 all have counts ≥1

Automation
[ ] `node scripts/validate-library.mjs` exits 0
[ ] `npm run build` completes without errors
[ ] No console errors on any route in a fresh Chrome session
```

---

## Section H — Adding manual stats: TL;DR for PR contributors

You're sending a stat from a vendor report (e.g. "1 in 3 financial-services institutions breached"). Pick the right home, copy a Section D template, validate, push.

### H.1 Pick the right home

| Shape | Target | Template |
|---|---|---|
| Single fact card (number / sparkline / quote) | `intelligenceLibrary.js` → `HAND_CRAFTED`, `type: 'stat'` | D.1 |
| Featured chart (multi-series, surfaces on `/popular`) | `intelligenceLibrary.js` → `HAND_CRAFTED`, `type: 'chart'`, `featured: true` | D.2 |
| Vendor report mirror (full bar/pie chart on `/reports`) | `data.js` → `GLOBAL_REPORTS` | D.4 |

### H.2 Tag vocabulary cheat-sheet

These are the only valid values for tag fields. **Exact strings — case + spelling matter.** The records validator (`npm run validate`) flags drift loudly.

- `industry[]`: `Financial Services`, `Healthcare`, `Technology`, `Government`, `Manufacturing`, `Energy & Utilities`, `Retail & E-Commerce`, `Telecommunications`, `Education`, `Transportation`
- `region[]`: `North America`, `Europe`, `Middle East`, `Asia Pacific`, `Latin America`, `Africa`
- `threat_type[]` (lowercase ids): `ransomware`, `phishing`, `infostealer`, `logs_on_sale`, `data_leaks`, `employee_exposure`, `dark_web_mentions`, `vulnerability`, `ddos`, `supply_chain`
- `country` (records only): see `ALL_COUNTRIES` in `data.js` (31 names — exact spellings like `United States`, `United Kingdom`, `UAE`)
- `updated_at`: ISO 8601 date — `'YYYY-MM-DD'` (not timestamp, not Unix epoch)

### H.3 Always set on manual stats

- `id` — kebab-case, unique. Convention: `<source>-<topic>` e.g. `dbir-fs-breach-rate`.
- `source` — display string. Drives the Brand Chip on the card.
- `real: true` — manual stats are always real (this elevates them above generated backfill in slice views).
- `updated_at` — today's date or the report's publication date.

### H.4 Validate before pushing

```bash
cd frontend
npm run validate
```

Catches: unknown industry/region/threat_type tags, missing required fields, duplicate ids, ISO date format violations. CI runs the same gate on every PR.

---

## Appendix — File quick-reference

| To edit | Open |
|---|---|
| Taxonomy (categories, industries, countries, regions, data points) | `frontend/src/lib/data.js` |
| Intelligence Library items + generator | `frontend/src/lib/intelligenceLibrary.js` |
| Popular/Reports/ControlPanel filter chip lists | the respective component file under `src/components/` or `src/routes/` |
| Methodology page prose | `frontend/src/routes/Methodology.jsx` |
| Static legal/contact pages | `frontend/src/routes/StaticPage.jsx` |
| Builder chart engine + filters | `frontend/src/routes/Builder.jsx` + `frontend/src/components/ControlPanel.jsx` |

Each file is < 2000 lines and self-contained — you don't need to trace imports beyond these.
