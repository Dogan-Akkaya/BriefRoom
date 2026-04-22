# Brief Room

## What is this?
Brief Room is a CISO-facing cyber threat intelligence visualization tool by SOCRadar. It provides presentation-ready charts that security leaders can search, customize, and export as PNG for board briefings.

**Target users:** CISOs, Cybersecurity Managers, Threat Intel analysts.
**Production target:** socradar.io/labs.

## Commands
```bash
cd frontend
npm run dev                        # Start dev server (localhost:5173)
npm run build                      # Production build (must pass before pushing)
npm run preview                    # Preview production build
node scripts/validate-library.mjs  # Validate Intelligence Library schema + coverage
```

## Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS v4 + inline styles (glassmorphism)
- **Routing:** React Router v6 (client-side SPA)
- **Charts:** Recharts (Bar, Line, Area, Pie)
- **State:** Zustand (`useToastStore` only — other stores were removed as unused)
- **Animations:** SmokeHero (hero canvas particles), AmbientSmoke (parameterised reusable smoke behind Popular / Explore wizard), KnowledgeGraphBG (constellation behind Reports), FlickerText / Reveal / AnimNum (IntersectionObserver)
- **Deploy:** Netlify (auto-deploys `main` on `Dogan-Akkaya/BriefRoom`). `netlify.toml` pins base=`frontend`, publish=`dist`, SPA redirect `/* → /index.html 200`.
- **Backend (planned, not built):** FastAPI + SQLAlchemy + PostgreSQL 15 + Redis + Docker Compose
- **Export:** PNG (email-gated via PNGExportModal), Share Link (clipboard)
- **Fonts:** Plus Jakarta Sans, Space Grotesk, JetBrains Mono, Satoshi, DM Sans

## Data Model (current)

Data is split into **aggregate-level** (charts, stats, reports — ready for display) and **record-level** (per-incident ground truth, feeds aggregates when populated).

### Aggregate layer — the Intelligence Library (`src/lib/intelligenceLibrary.js`)
Unified store with 3 item `type`s:
- `chart` — dataset (labels + series)
- `stat` — single-fact card with `card_style: 'number' | 'sparkline' | 'bar' | 'quote'`
- `report` — external vendor reports (IBM / DBIR / Mandiant / etc.) merged in via `globalReportToItem()`

Every item carries dimension tags: `industry[]`, `region[]`, `threat_type[]`. Vendor-sourced items flag `real: true`; generator backfill does not. Selectors: `popularCharts()`, `reports()`, `sliceItems(dim, val)`, `crossSliceItems(d1,v1,d2,v2)`, `crossSliceCounts(pivotDim, pivotVal, otherDim)`. Real-first ordering throughout.

### Record layer — per-incident ground truth (`src/lib/records/`)
One file per threat category with empty arrays today. Schema documented in JSDoc per file. When populated, `Builder → generateData()` aggregates these records instead of seeding; empty → falls back to seeded RNG. Fully additive, zero regression.

### Canonical taxonomy (`src/lib/data.js`)
Reference lists — `CATEGORIES` (10), `INDUSTRIES` (10), `ALL_COUNTRIES` (31) + `ALL_REGIONS` (6 derived), `THREAT_GROUPS` (13), `DATA_POINTS_BY_CATEGORY` (Builder's per-category data points + elements), `ALL_MONTHS` / `DATA_AVAILABILITY` / `DATE_PRESETS` (time scaffold), `generateData(key, filterSuffix)` (seeded RNG fallback). `GLOBAL_REPORTS` + `POPULAR` are legacy — Reports page still reads `GLOBAL_REPORTS` directly, Landing migrated off `POPULAR` to library, SearchPanel still uses `POPULAR` (pending migration).

### Filters that apply everywhere
Industry × Region × Threat Type (tag-based) + Threat Group (record-level). Popular + Explore slices operate on library tags; Builder layers in country / date range on top.

## Data philosophy (the rules)

These come from our design conversations. Apply them when editing data-related code.

### 🌍 Global Reports (`/reports`)
- **Curated external vendor mirror.** IBM X-Force, Verizon DBIR, Mandiant, CrowdStrike, Palo Alto Unit 42, ENISA, etc.
- Don't try to force our `industry[]` / `region[]` dimension tags onto them — these reports are global aggregates.
- `Reports.jsx` still reads `GLOBAL_REPORTS` directly for the top grid. The Verified Intelligence section below pulls from library `reports()` + real stats.
- Brand chips (`<BrandChip>`) are first-class here — vendor identity matters.
- Cards need `backdropFilter: blur(...)` over the `KnowledgeGraphBG` canvas so text stays legible.
- **Don't** expand this category with our own content. Add real vendor reports only.

### ⭐ Popular Charts (`/popular`)
- **Derived view**, not a parallel store. Reads `popularCharts()` which filters library items where `featured && type === 'chart'`.
- Exactly 12 featured charts. Hand-crafted, every one `real: true` with vendor attribution.
- SearchPanel still reads the legacy `POPULAR` array — separate pending migration, not urgent.
- Never hardcode a new chart into `POPULAR`; add it to `HAND_CRAFTED` in `intelligenceLibrary.js` with `featured: true`.
- Sidebar filters (Category / Industry / Region / Trend) work on tagged dimensions — new items auto-join the filter options once tagged.

### 🔧 Custom Builder (`/builder/:categoryId` via `/explore` wizard)
- **Record-first architecture.** `generateData()` tries `getRecords(catId)` first and aggregates matching records; falls back to seeded RNG when empty. See Phase C in `frontend/DATA_GUIDE.md`.
- **Sustainability-driven data points.** Only expose data points we can sustainably source — see `frontend/BUILDER_PRUNE_DECISIONS.md` for the 37-data-point keeper list (13 cuts across 7 categories from the original 50).
- Every UI filter (country / industry / threat group) must have a real sourcing path per category — if we can't filter by it, we shouldn't offer it.
- **Priority for real data ingestion:** Vulnerability (NVD + CISA KEV, free public) → Supply Chain (OSV.dev, free) → Ransomware (SOCRadar ThreatVision) → the rest.
- `CATEGORIES.hasData: false` flag is currently unused (all 10 categories are `true`). If a category's data becomes unsourceable long-term, flip it back to `false` rather than keeping synthetic charts.

## Project Structure
```
brief-room/
├── CLAUDE.md                           # This file
├── netlify.toml                        # SPA redirect + build config
├── Labs Compliance/                    # Reference docs (gitignored / not deployed)
├── archive/                            # gitignored; old prototypes live here
├── backend/
│   └── migrations/                     # Planned — PostgreSQL schema (not wired)
└── frontend/
    ├── DATA_GUIDE.md                   # Reference: how to READ / ADD data per store
    ├── BUILDER_DATA.md                 # Audit: what Builder promises vs. reality, per category
    ├── BUILDER_PRUNE_DECISIONS.md      # Decisions: which data points to cut from Builder
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── scripts/
    │   └── validate-library.mjs        # Node validator for Intelligence Library
    └── src/
        ├── main.jsx
        ├── App.jsx                     # Routes: /, /explore (+/:dim/:value[/:dim2/:value2]),
        │                               #   /builder/:categoryId, /popular, /reports,
        │                               #   /methodology, /page/:slug
        ├── routes/
        │   ├── Landing.jsx             # Hero + search + popular (library) + reports preview
        │   ├── Explore.jsx             # Wizard layout; AmbientSmoke + Outlet
        │   ├── Builder.jsx             # Chart builder w/ ControlPanel; useSearchParams pre-anchor
        │   ├── Popular.jsx             # Library-backed charts with sidebar filters + AmbientSmoke
        │   ├── Reports.jsx             # Global Reports grid + Verified Intelligence + KnowledgeGraphBG
        │   ├── Methodology.jsx         # Data sources + coverage (real counts)
        │   └── StaticPage.jsx          # Privacy / Terms / API / Contact with Beta chip
        ├── components/
        │   ├── Navbar.jsx              # Fixed top nav, "Custom Builder" → /explore
        │   ├── SmokeHero.jsx           # Untouched — Landing hero canvas
        │   ├── AmbientSmoke.jsx        # Parameterised smoke (focus lerp, intensity, timeRate)
        │   ├── KnowledgeGraphBG.jsx    # Node constellation with pulses (Reports bg)
        │   ├── SearchableSelect.jsx
        │   ├── FlickerText.jsx
        │   ├── Reveal.jsx
        │   ├── AnimNum.jsx
        │   ├── Spark.jsx
        │   ├── PopularChartCard.jsx
        │   ├── ReportCard.jsx          # BrandChip badge; backdrop-blur for readability
        │   ├── CategoryPicker.jsx      # Kept for Landing only (Builder's old entry removed)
        │   ├── ControlPanel.jsx        # imports INDUSTRIES from data.js (single source of truth)
        │   ├── ExportBar.jsx
        │   ├── PNGExportModal.jsx
        │   ├── ShareLinkModal.jsx
        │   ├── ChartPreviewModal.jsx
        │   ├── SearchPanel.jsx         # Still reads legacy POPULAR — pending migration
        │   ├── ChartPreview.jsx
        │   ├── Toast.jsx
        │   └── explore/
        │       ├── WizardScreen1.jsx   # Step 1: pick dimension + value
        │       ├── WizardScreen2.jsx   # Step 2: choose crossing + slice view
        │       ├── SliceStatCard.jsx   # Variable-span (number=1, chart=2, quote=3); Verified badge
        │       └── CrossSliceChip.jsx
        ├── stores/
        │   └── useToastStore.js        # (the only store that survived pruning)
        ├── lib/
        │   ├── data.js                 # Taxonomies + generateData() + legacy POPULAR/GLOBAL_REPORTS
        │   ├── intelligenceLibrary.js  # INTELLIGENCE_LIBRARY + selectors + HAND_CRAFTED + generator
        │   ├── noise.js                # Shared sine/cosine noise util (SmokeHero keeps inline copy)
        │   ├── sourceBrands.jsx        # sourceBrand() + <BrandChip> (17 vendors + hover tooltip)
        │   ├── enriched_data.js        # Unused legacy duplicate of data.js — safe to delete
        │   ├── records/                # Phase B: per-incident ground truth
        │   │   ├── index.js            # getRecords(catId), RECORDS_BY_CATEGORY, recordStats()
        │   │   ├── ransomware.js       # Empty array + JSDoc schema
        │   │   ├── phishing.js
        │   │   ├── infostealer.js
        │   │   ├── logs_on_sale.js
        │   │   ├── data_leaks.js
        │   │   ├── employee_exposure.js
        │   │   ├── dark_web_mentions.js
        │   │   ├── vulnerability.js    # ← easiest to populate first (NVD + CISA KEV)
        │   │   ├── ddos.js
        │   │   └── supply_chain.js
        │   └── export.js               # PNG, clipboard helpers
        └── styles/
            └── tokens.css              # Tailwind theme + CSS keyframes (gridPulse, floatBlob*, etc.)
```

## Conventions
- Components: PascalCase files, one component per file. JSX components go in `.jsx` files (oxc parser requires this — see earlier `.js`-with-JSX bug).
- Stores: `use[Name]Store.js` with Zustand.
- Styling: inline styles for glassmorphism + Tailwind utility classes + `tokens.css` for keyframes.
- Data: local module files in `lib/` (Phase 1). Will migrate to API.
- Commits: Conventional commits (`feat:`, `fix:`, `chore:`, `docs:`). Descriptive body.
- Branching: PRs against `main`, no direct main pushes.
- Labs compliance: follow `Labs Compliance/complience-CLAUDE.md` conventions (English-only copy, security headers, parameterised queries, Docker non-root).

## Data Notes
- `ALL_MONTHS` items are **objects** `{ month, year, label }`. Always access `.month`, `.year`, `.label`.
- `DATA_AVAILABILITY` items are `{ month, year, label, index, sources }`.
- `DATE_PRESETS` items have `.start` / `.end` (indices into `ALL_MONTHS`), not functions.
- `generateData(compositeKey)` uses `/` separator: `"ransomware/attack_volume"`. `filterSuffix` uses `:` separator: `"country:industry:threatGroup"`.
- Intelligence Library items: `real: true` on hand-crafted (32 items today) + GLOBAL_REPORTS-derived (12 items). Generator backfill is unflagged (~75 items). Total ≈107–119.
- Every dimension (industry / region / threat_type) has ≥12 library items. Enforced by the generator; validated by `scripts/validate-library.mjs`.
- Brand matching in `<BrandChip>` is substring-based against the `source` string — 17 known vendors mapped to monogram + color + full name.
- Records schemas in `lib/records/*.js` share 5 universal fields across categories: `id`, `*_at` date, `*_industry`, `*_region`, `source`. Keep these required when adding new record types.

## Key docs to read before working on data
- **`frontend/DATA_GUIDE.md`** — how to read/check/add data per source; section E = step-by-step for filling a `hasData: false` category.
- **`frontend/BUILDER_DATA.md`** — full audit of what Builder currently promises vs. what backs it + per-category record schemas + source options (🟢🟡🔴).
- **`frontend/BUILDER_PRUNE_DECISIONS.md`** — the 37 data points we keep, the 13 we cut, with rationale.

## Deploy + git state
- **Canonical repo:** `https://github.com/socradar-growth/BriefRoom` (team).
- **Personal mirror:** `https://github.com/Dogan-Akkaya/BriefRoom` (Netlify auto-deploys this).
- **Active feature branch:** `feature/unified-data-layer` (A+B+C unified data layer — not yet merged).
- Netlify project is under Dogan-Akkaya's personal Vercel/Netlify account; the GitHub App installation is on Dogan-Akkaya, not `socradar-growth` — that's why earlier Vercel auto-deploy broke after the repo was moved.

## Current Phase
**Phase 3 (in progress):** Data standardization.
- ✅ Intelligence Library as unified aggregate store (107+ items, dimension tags, real:true flag)
- ✅ Explore wizard (2-step: dimension → slice view), AmbientSmoke + KnowledgeGraphBG animations
- ✅ Reports: brand chips, card blur for readability, Verified Intelligence section below grid
- ✅ Record layer scaffold (`lib/records/`) + Builder record-first path (falls back to seeded)
- ✅ `DATA_GUIDE.md`, `BUILDER_DATA.md`, `BUILDER_PRUNE_DECISIONS.md` — documentation trilogy
- 🔄 Prune non-sustainable Builder data points (13 cuts per `BUILDER_PRUNE_DECISIONS.md`)
- ⏳ Populate `records/vulnerability.js` from NVD + CISA KEV (first real-data category)

## Phases Overview
1. ~~Scaffold + React port~~ (done)
2. ~~UI overhaul from brief-room1.jsx~~ (done)
3. ~~UI polish + flexible elements~~ (done)
4. ~~Labs integration UI + builder UX~~ (done)
5. ~~PLG export + search panel + chart preview modals + global reports feature~~ (done — Phase 2.95 from old plan)
6. ~~Intelligence Library + Explore wizard + animation expansion + reports overhaul~~ (done)
7. ~~Data diagnostic + record-layer scaffold + pruning plan~~ (done; pruning pending)
8. Populate vulnerability records from NVD/KEV → first real-data Builder category (next)
9. Backend: FastAPI + PostgreSQL + Docker (after first real-data proves the pattern)
10. Wire frontend to backend API
11. Admin API + CSV import + Celery ingestion tasks
12. Polish: PPTX export, briefing persistence, labs deploy
