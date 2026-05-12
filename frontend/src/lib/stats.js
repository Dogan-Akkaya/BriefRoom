// Computed-at-module-load stats for the Landing hero.
//
// Replaces the previous hardcoded marketing numbers (`2,400+ CISOs`,
// `47 countries`, `180+ charts`, `12s avg.`) with verifiable counts pulled
// from the actual data layer. If the data grows, these numbers grow.

import { MANUAL_REPORT_RAW_BY_ID, manualDataStats } from './manualData'
import logoProgress from '../data/progress_logo.json'

// Total findings extracted across every indexed report (the drill-down
// payload — these are the granular cards a CISO actually quotes).
const totalFindings = Object.values(MANUAL_REPORT_RAW_BY_ID).reduce(
  (sum, r) => sum + (Array.isArray(r.cards) ? r.cards.length : 0),
  0
)

// Vendors with a real logo on file (excludes the one missing entry — NVD).
const vendorsWithLogo = logoProgress.logos.filter((l) => !!l.file).length

const m = manualDataStats()

// Three real, countable stats. We pulled the "100% sourced / 0 synthesised"
// tile because it read as over-justification — the Methodology page makes
// that promise once, the hero shouldn't repeat it.
export const heroStats = [
  { n: m.reportRaw, s: '', l: 'Vendor reports indexed' },
  { n: vendorsWithLogo, s: '', l: 'Vendors covered' },
  { n: totalFindings, s: '+', l: 'Verified findings' },
]

// Used in the "Browse All N+" button label.
export const totalFindingsLabel = `${totalFindings}+`
