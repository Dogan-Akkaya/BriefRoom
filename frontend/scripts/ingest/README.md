# Ingest scripts

Daily ingestion from the SOCRadar ThreatVision API into Brief Room's record layer.
Designed to run in CI (`.github/workflows/ingest-data.yml`) but also runnable locally for debugging or backfills.

## TL;DR

```bash
cd frontend
cp .env.example .env                  # one-time
# fill in THREATVISION_BASE_URL + the per-product keys you have access to
npm ci
npm run ingest                        # all ingestors → JSON in src/data/generated/
npm run ingest:ransomware             # one ingestor only (uses THREATVISION_RANSOMWARE_KEY)
npm run ingest:darkweb                # one ingestor only (uses THREATVISION_DARKWEB_KEY)
npm run validate                      # records + library schema gate
```

ThreatVision uses **per-product API keys** — different products (ransomware, darkweb, threat-actors) each have their own key (confirmed by the 2026-05-08 Postman export). Each ingestor reads its own key. **Missing per-product keys cause that single ingestor to skip cleanly**; other ingestors with their keys present still run. The orchestrator writes `_manifest.json` regardless and exits 0 unless something actively errored. Useful for staged rollout: drop in keys product-by-product as access is provisioned.

## What lives where

```
scripts/ingest/
├── README.md                                  ← you are here
├── run-all.mjs                                ← orchestrator (npm run ingest)
├── ingest-threatvision-ransomware.mjs         ← one ingestor per TV module
└── _shared/
    ├── threatvision-client.mjs                ← auth / pagination / rate-limit (one file)
    ├── fetch-with-retry.mjs                   ← native fetch + backoff
    ├── tag-vocabulary.mjs                     ← INDUSTRIES, ALL_REGIONS, … (mirrors data.js)
    ├── normalize.mjs                          ← raw TV record → record-schema shape
    └── write-records.mjs                      ← atomic JSON writer + manifest

src/data/generated/                            ← write target (committed)
├── _manifest.json                             ← last_run_at + per-source counts
└── <category>_records.json                    ← e.g. ransomware_records.json
```

`src/lib/records/<category>.js` re-exports from the corresponding generated JSON once a category is wired in. Today the records files still hold empty arrays — they get the JSON-import shim when the first ingestor produces real data.

## Adding a new ThreatVision module

The plumbing is the same for every TV module — the per-module work is the endpoint path + the field mapping. Five steps:

1. **Confirm the schema** for the target category. Schemas live in JSDoc atop each `src/lib/records/<category>.js`. Edit if reality differs from the doc.
2. **Add a normalizer** in `_shared/normalize.mjs`. Copy `normalizeRansomwareRecord` and rewrite the field mapping. Run output through `validateRecordTags()` before returning.
3. **Add the ingestor** in `scripts/ingest/ingest-threatvision-<category>.mjs`. Copy `ingest-threatvision-ransomware.mjs` and replace `ENDPOINT`, the normalizer import, the `dateField`, and the source label.
4. **Register in `run-all.mjs`** by appending the new ingestor to the `INGESTORS` array.
5. **Add an `ingest:<category>` script** to `package.json` so the new module can be run in isolation.

`npm run validate` then enforces tag vocab + required fields against `REQUIRED_FIELDS[<category>]` in `scripts/validate-records.mjs` (add a row there if your category is new).

## Tuning the TV client

`_shared/threatvision-client.mjs` is the **only** file that knows about TV's auth, pagination, and error format. If TV ever changes auth (e.g. query-key → OAuth), only this file changes — every ingestor inherits.

What's resolved (from the 2026-05-08 Postman export):
- Auth: `?key=<api_key>` query parameter on every request (not a header).
- Pagination: page-based (`?page=N`, 1-indexed). Optional `?limit=N` where supported (e.g. `/ransomware/victims`).

What's still discovery-mode (closes on first live response):
- **Records-array path** — client tries `data` → `results` → `records` → `items` on the first page; the matched key is reused for subsequent pages and surfaced in `_manifest.json` per source as `items_path`. Once a path is observed, hard-pin it via `getPaginated(path, query, { itemsPath: 'data' })` to skip the probe.
- **Per-record field names** in `_shared/normalize.mjs` — the existing mappings are placeholders. Update them when you see a real response and the validator will catch any drift.

## Failure modes

| Scenario | Behavior |
|---|---|
| `THREATVISION_BASE_URL` not set | Every ingestor skips with `reason: 'THREATVISION_BASE_URL not set'`. Orchestrator exits 0. |
| `THREATVISION_<PRODUCT>_KEY` not set | Just that ingestor skips; others continue. Orchestrator exits 0 if all ran or skipped cleanly. |
| API responds 401/403 (key set but rejected) | `fetch-with-retry` throws after 3 retries. Orchestrator catches for that ingestor only, records the error in `_manifest.json`. Exit 1. |
| API responds 429 / 5xx | `fetch-with-retry` backs off exponentially (1s → 2s → 4s) and honors `Retry-After` if present. After 3 retries it throws. |
| Records-array path can't be auto-discovered | Client throws with the top-level keys observed in the response, so you can pin `itemsPath` explicitly. |
| Single record fails normalization (out-of-vocab industry, bad date) | Record is skipped, counted in `failures` per source. Other records still get written. |
| All records in a window fail normalization | Ingestor still writes a JSON file with `count: 0`. CI's `npm run validate` surfaces tag-vocab drift. |

## Local debugging

```bash
# verbose-ish: just dump the manifest result
node scripts/ingest/run-all.mjs

# isolate one ingestor + see its full result
node scripts/ingest/ingest-threatvision-ransomware.mjs

# narrower window for a fast iteration
INGEST_WINDOW_DAYS=3 npm run ingest:ransomware

# check what the orchestrator wrote
cat src/data/generated/_manifest.json
```

`src/data/generated/*.json` is committed — `git diff` after a run shows exactly which records are entering or leaving the window.
