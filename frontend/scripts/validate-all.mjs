// Composite validator — runs validate-library.mjs and validate-records.mjs
// as subprocesses (each is a standalone script with its own process.exit).
// CI gate: exits 0 only if both pass.
//
// Run from frontend/: `node scripts/validate-all.mjs`

import { spawnSync } from 'child_process'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

const checks = [
  { name: 'global-reports-inputs', file: 'validate-global-reports-inputs.mjs' },
  { name: 'library', file: 'validate-library.mjs' },
  { name: 'records', file: 'validate-records.mjs' },
  { name: 'manual',  file: 'validate-manual.mjs' },
]

let failures = 0
for (const { name, file } of checks) {
  console.log(`\n>>> ${name} validator (${file})`)
  const r = spawnSync(process.execPath, [join(__dirname, file)], { stdio: 'inherit' })
  if (r.status !== 0) failures++
}

if (failures) {
  console.error(`\n✗ ${failures} validator(s) failed`)
  process.exit(1)
}
console.log('\n✓ All validators passed')
process.exit(0)
