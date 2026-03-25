# Brief Room

## What is this?
Brief Room is a CISO-facing cyber threat intelligence visualization tool. It provides presentation-ready charts that security leaders can search, customize, and export as PNG/PPTX/CSV for board briefings.

**Target users:** CISOs, Cybersecurity Managers, Threat Intel analysts.
**Production target:** socradar.io/labs

## Tech Stack
- **Frontend:** React 18 + Vite + Tailwind CSS v4
- **Routing:** React Router v6 (client-side SPA)
- **Charts:** Recharts (React-native, declarative)
- **State:** Zustand (lightweight stores)
- **Backend:** Supabase (Postgres + auto REST API + Auth)
- **Automation:** n8n (data ingestion pipelines)
- **Export:** html-to-image (PNG/clipboard), native CSV, PptxGenJS (future)

## Data Model
Two verticals slice every data point:
1. **Attack Type:** Ransomware, Phishing, Data Breach, Vulnerability, Supply Chain, Dark Web
2. **Context:** Industry + Country/Region

Core tables: `attack_types`, `industries`, `regions`, `countries`, `metrics`, `data_points`, `insights`, `briefing_items`

See `supabase/migrations/001_schema.sql` for full schema.

## Commands
```bash
npm run dev      # Start dev server (localhost:5173)
npm run build    # Production build
npm run preview  # Preview production build
```

## Environment Variables
Create `.env.local`:
```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Project Structure
```
src/
├── main.jsx              # Entry point
├── App.jsx               # Router + layout shell
├── routes/
│   ├── Home.jsx          # Hero, search, topic cards, trending
│   ├── Builder.jsx       # Chart builder with config panel
│   └── Admin.jsx         # Data management (future)
├── components/
│   ├── Sidebar.jsx       # Left icon nav
│   ├── TopicCard.jsx     # Topic browse card
│   ├── TrendingCard.jsx  # Trending chart card
│   ├── ChartPreview.jsx  # Recharts wrapper, type switching
│   ├── ExportBar.jsx     # PNG/CSV/PPTX/Briefing buttons
│   ├── InsightBanner.jsx # Rotating exec insight
│   ├── SearchBar.jsx     # Search with hint tags
│   ├── Toast.jsx         # Toast notification system
│   └── EmailGate.jsx     # Email unlock gate
├── stores/
│   ├── useFilterStore.js # Search, region, industry filters
│   ├── useBuilderStore.js# Chart config, metric selection
│   └── useBriefingStore.js
├── lib/
│   ├── supabase.js       # Supabase client init
│   ├── queries.js        # Data fetching functions
│   └── export.js         # PNG, CSV, clipboard helpers
└── styles/
    └── tokens.css        # CSS custom properties (theme)
```

## Conventions
- Components: PascalCase files, one component per file
- Stores: `use[Name]Store.js` pattern with Zustand
- CSS: Tailwind utility classes + CSS variables in tokens.css for brand colors
- Data: All dummy data lives in seed SQL; frontend fetches from Supabase (or falls back to local data during Phase 1)
- Commits: Conventional commits (`feat:`, `fix:`, `chore:`)

## Current Phase
**Phase 1:** Scaffold + port prototype into React components (visual parity with briefradar_v2.html)

## Phases Overview
1. Scaffold + React port (current)
2. Supabase schema + live data
3. Wire builder to DB queries
4. Admin panel
5. n8n automation pipelines
6. Polish (PPTX, briefing persistence, auth)
