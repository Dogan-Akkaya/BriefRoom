# Brief Room

## What is this?
Brief Room is a CISO-facing cyber threat intelligence visualization tool by SOCRadar. It provides presentation-ready charts that security leaders can search, customize, and export as PNG/CSV for board briefings.

**Target users:** CISOs, Cybersecurity Managers, Threat Intel analysts.
**Production target:** socradar.io/labs

## Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS v4 + inline styles (glassmorphism)
- **Routing:** React Router v6 (client-side SPA)
- **Charts:** Recharts (Bar, Line, Area, Pie)
- **State:** Zustand (toast, builder, briefing stores)
- **Animations:** SmokeHero (canvas particles), FlickerText, Reveal, AnimNum (IntersectionObserver)
- **Backend (planned):** FastAPI + SQLAlchemy + PostgreSQL 15 + Redis + Docker Compose
- **Export:** PNG (email-gated via PNGExportModal), Share Link (clipboard)
- **Fonts:** Plus Jakarta Sans, Space Grotesk, JetBrains Mono, Satoshi, DM Sans

## Data Model
Two verticals slice every data point:
1. **Attack Type:** 10 categories (6 active with data, 4 coming soon)
2. **Context:** Industry + Country/Region + Threat Group

Each category has multiple **Data Points**, each with its own set of **Elements** (flexible, user-selectable).

Core tables: `attack_types`, `industries`, `regions`, `countries`, `metrics`, `data_points`, `insights`, `briefing_items`

See `backend/migrations/001_schema.sql` for full schema.

## Commands
```bash
cd frontend
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

## Project Structure
```
brief-room/
├── CLAUDE.md
├── backend/
│   └── migrations/
│       ├── 001_schema.sql     # PostgreSQL schema
│       └── 002_seed.sql       # Seed data
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── main.jsx
│       ├── App.jsx            # Router: /, /builder, /popular, /reports, /methodology, /page/:slug
│       ├── routes/
│       │   ├── Landing.jsx    # Hero + search + popular charts + stats + categories
│       │   ├── Builder.jsx    # Chart builder with category selection + controls
│       │   ├── Popular.jsx    # Popular charts with sidebar filters + featured cards
│       │   ├── Reports.jsx    # Global Threat Reports with sidebar filters
│       │   ├── Methodology.jsx # Data sources & methodology
│       │   └── StaticPage.jsx # Privacy, Terms, API, Contact placeholders
│       ├── components/
│       │   ├── Navbar.jsx          # Fixed top nav (Home icon + centered links)
│       │   ├── ReportCard.jsx     # Global report card (blue/gray, external source)
│       │   ├── SmokeHero.jsx       # Canvas particle system (landing hero)
│       │   ├── GridBackground.jsx  # Animated dot grid (builder category screen)
│       │   ├── SearchableSelect.jsx # Type-to-filter dropdown
│       │   ├── FlickerText.jsx     # Flicker entrance animation
│       │   ├── Reveal.jsx          # Scroll reveal animation
│       │   ├── AnimNum.jsx         # Animated number counter
│       │   ├── Spark.jsx           # Inline SVG sparkline
│       │   ├── BriefingIllustration.jsx
│       │   ├── PopularChartCard.jsx # Chart card with sparkline + metrics
│       │   ├── CategoryPicker.jsx   # 10 category grid
│       │   ├── ControlPanel.jsx     # Right sidebar: chart type, filters
│       │   │                        #   (country/industry/threat group),
│       │   │                        #   operators (data point, operation mode),
│       │   │                        #   date range + sparkline, elements
│       │   ├── ExportBar.jsx        # Export PNG (primary) + Share Link (secondary)
│       │   ├── PNGExportModal.jsx   # PLG email gate for PNG export (3 benefit promises)
│       │   ├── ShareLinkModal.jsx   # Share link copy-to-clipboard modal
│       │   ├── ChartPreviewModal.jsx # Preview modal for popular/report charts
│       │   ├── SearchPanel.jsx      # Professional search with grouped suggestions + filter chips
│       │   ├── ChartPreview.jsx     # Recharts wrapper (bar/line/area/pie)
│       │   └── Toast.jsx
│       ├── stores/
│       │   ├── useBuilderStore.js
│       │   ├── useBriefingStore.js
│       │   └── useToastStore.js
│       ├── lib/
│       │   ├── data.js         # CATEGORIES, DATA_POINTS_BY_CATEGORY,
│       │   │                   # THREAT_GROUPS, POPULAR, generateData(),
│       │   │                   # ALL_MONTHS, DATA_AVAILABILITY, DATE_PRESETS,
│       │   │                   # ALL_COUNTRIES, ALL_REGIONS
│       │   └── export.js       # PNG, clipboard helpers
│       └── styles/
│           └── tokens.css      # Tailwind theme + CSS animations
└── Labs Complience/            # Reference docs (not deployed)
```

## Conventions
- Components: PascalCase files, one component per file
- Stores: `use[Name]Store.js` pattern with Zustand
- Styling: Inline styles for glassmorphism + Tailwind CSS variables in tokens.css
- Data: Local dummy data in `lib/data.js` (Phase 1). Will migrate to PostgreSQL API.
- Commits: Conventional commits (`feat:`, `fix:`, `chore:`)
- Labs compliance: Follow `Labs Complience/complience-CLAUDE.md` conventions (English-only, security headers, parameterized queries, Docker non-root)

## Data Notes
- `ALL_MONTHS` items are **objects** `{ month, year, label }`, NOT strings. Always access `.month`, `.year`, `.label`.
- `DATA_AVAILABILITY` items are objects `{ month, year, label, index, sources }`.
- `DATE_PRESETS` items have `.start` and `.end` (indices into ALL_MONTHS), not functions.
- `generateData(compositeKey)` uses `/` separator: `"ransomware/attack_volume"`.

## Current Phase
**Phase 2.95 (completed):** PLG export flow (PNGExportModal with email gate + 3 benefit promises, ShareLinkModal), professional SearchPanel with grouped suggestions + filter chips, ChartPreviewModal for popular/report cards, "Powered by SOCRadar" watermark on builder charts, Global Threat Reports feature, sidebar filters on Popular/Reports pages.

## Phases Overview
1. ~~Scaffold + React port~~ (done)
2. ~~UI overhaul from brief-room1.jsx~~ (done)
3. ~~UI polish + flexible elements~~ (done)
4. ~~Labs integration UI + builder UX~~ (done)
5. Backend: FastAPI + PostgreSQL + Docker (next)
6. Wire frontend to backend API
7. Admin API endpoints + CSV import
8. Celery tasks for automated data ingestion
9. Polish: PPTX, briefing persistence, labs deploy
