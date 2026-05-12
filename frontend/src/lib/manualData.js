// Manual data loader — auto-discovers every JSON file under src/data/manual/
// (recursively) at build time (Vite's import.meta.glob) and produces three
// flat data structures for the rest of the data layer to consume:
//
//   MANUAL_LIBRARY_ITEMS    — type: 'stat' | 'chart' with library_include !== false
//                             (feed into INTELLIGENCE_LIBRARY)
//   MANUAL_REPORT_ITEMS     — type: 'report' (mirror into REPORT_ITEMS)
//   MANUAL_REPORT_RAW_BY_ID — map of report_meta.report_id → { meta, source, year, cards }
//                             used by the /reports/:reportId drill-down route to
//                             render all extracted cards (not just the ones in
//                             the library).
//
// Adding new manual data is a single-PR action: drop a JSON file in
// src/data/manual/ (or any subfolder) following the schema in _README.md,
// run `npm run validate`, push. No manual import list to maintain.
//
// Files prefixed with `_` (e.g. _README.md, _index.json) are ignored.

const FILES = import.meta.glob('../data/manual/**/*.json', { eager: true })

const libraryItems = []
const reportItems = []
const reportRawById = {}

for (const [path, mod] of Object.entries(FILES)) {
  const filename = path.split('/').pop() || ''
  if (filename.startsWith('_')) continue

  const file = mod?.default ?? mod
  if (!file || typeof file !== 'object') continue

  const fileSource = file.source
  const fileSourceShort = file.source_short
  const fileYear = file.year
  const fileReal = file.real !== false  // default true at file level

  const items = Array.isArray(file.items) ? file.items : []

  // Find the type:'report' entity in this file (if any) to anchor the
  // drill-down payload. Transformer always emits it first; tolerate any order.
  const reportEntity = items.find((it) => it?.type === 'report' && it?.report_meta?.report_id)

  for (const raw of items) {
    if (!raw?.id || !raw?.type) continue  // defensive — validator catches these in CI

    // Cascade file-level fields onto items where the item doesn't override.
    const item = {
      ...raw,
      source: raw.source ?? fileSource,
      sourceShort: raw.sourceShort ?? raw.source_short ?? fileSourceShort,
      year: raw.year ?? fileYear,
      real: raw.real !== undefined ? raw.real : fileReal,
    }

    if (item.type === 'report') {
      reportItems.push(item)
    } else if (item.library_include !== false) {
      libraryItems.push(item)
    }
    // Items with library_include === false are intentionally NOT pushed to the
    // library — they remain available via reportRawById for the drill-down.
  }

  // Build the drill-down payload: all non-report items in this file (curated +
  // retained), keyed by report_id for O(1) lookup.
  if (reportEntity) {
    const id = reportEntity.report_meta.report_id
    reportRawById[id] = {
      meta: reportEntity,
      source: fileSource,
      source_short: fileSourceShort,
      year: fileYear,
      cards: items.filter((it) => it?.type !== 'report'),
    }
  }
}

export const MANUAL_LIBRARY_ITEMS = libraryItems
export const MANUAL_REPORT_ITEMS = reportItems
export const MANUAL_REPORT_RAW_BY_ID = reportRawById

/** Total counts — handy for the Methodology page or a debug readout. */
export const manualDataStats = () => ({
  files: Object.keys(FILES).filter(p => !(p.split('/').pop() || '').startsWith('_')).length,
  libraryItems: libraryItems.length,
  reportItems: reportItems.length,
  reportRaw: Object.keys(reportRawById).length,
  total: libraryItems.length + reportItems.length,
})
