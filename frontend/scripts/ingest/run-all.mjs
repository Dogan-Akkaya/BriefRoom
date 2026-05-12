// Orchestrator — runs every registered ingestor with isolated try/catch
// (one failing source doesn't kill the others), then writes a single manifest
// summarizing the run.
//
// Run: `npm run ingest` (from frontend/)
//
// Exit codes:
//   0 — every ingestor either succeeded or cleanly skipped (e.g. missing creds)
//   1 — at least one ingestor threw a real error
//   2 — orchestrator itself crashed

import { ingestRansomware } from './ingest-threatvision-ransomware.mjs'
import { ingestDarkWeb } from './ingest-threatvision-darkweb.mjs'
import { writeManifest } from './_shared/write-records.mjs'

const INGESTORS = [
  { name: 'threatvision-ransomware', run: ingestRansomware },
  { name: 'threatvision-darkweb',    run: ingestDarkWeb },
  // Add new ingestors here as TV modules come online:
  //   { name: 'threatvision-threat-actors', run: ingestThreatActors },
]

async function main() {
  const results = []
  let hardFailures = 0

  for (const { name, run } of INGESTORS) {
    const t0 = Date.now()
    process.stdout.write(`[${name}] starting…\n`)
    try {
      const r = await run()
      const duration_ms = Date.now() - t0
      results.push({ ...r, name, duration_ms })
      if (r.skipped) {
        process.stdout.write(`[${name}] skipped (${r.reason}) — ${duration_ms}ms\n`)
      } else {
        const pathNote = r.items_path ? ` [items_path=${r.items_path}]` : ''
        process.stdout.write(
          `[${name}] wrote ${r.count} records (${r.failures ?? 0} failures) in ${duration_ms}ms${pathNote}\n`
        )
      }
    } catch (err) {
      hardFailures++
      const duration_ms = Date.now() - t0
      const message = err?.stack ?? err?.message ?? String(err)
      results.push({
        name,
        ok: false,
        error: String(err?.message ?? err).slice(0, 500),
        duration_ms,
      })
      process.stderr.write(`[${name}] FAILED in ${duration_ms}ms\n${message}\n`)
    }
  }

  writeManifest(results)
  process.stdout.write(
    `\nManifest written. ${results.length} sources, ${hardFailures} hard failure(s).\n`
  )
  process.exit(hardFailures ? 1 : 0)
}

main().catch((err) => {
  process.stderr.write(`Orchestrator crashed: ${err?.stack ?? err?.message ?? err}\n`)
  process.exit(2)
})
