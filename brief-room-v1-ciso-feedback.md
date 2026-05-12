# Brief Room V1 — Feedback from a CISO's Desk


## What's working (don't lose this in V2)

The **source attribution discipline is excellent**. Every card carries the vendor brand chip, the source text, and an "Open original" link. The detail page surfaces *Published* AND *Indexed* timestamps separately — that distinction matters when I'm citing a stat that was indexed yesterday but generated from data eight months stale. Most aggregators collapse those into one date and pretend it's fresh.

The **Methodology page is the strongest trust signal on the site**. "We never synthesise numbers. If a finding isn't in a real report, it isn't here." That line, plus the explicit "What's still in progress" section listing PNG export and Custom Builder as not-done — that's the kind of candour CISOs reward. Keep that page visible from the top nav forever, even after V2 ships.

**Filter behaviour is clean**: typeahead inside the dropdown, a clear "2 of 42 reports / 46 findings extracted" counter, sticky "Clear all filters" / "Reset filters →" affordances. Selecting Sophos and seeing the count narrow immediately felt good.

**Category and Threat Type filters seems overlapping**. you may consider connecting these both in front and back end. If possible otherwise consider a front end fix. 

**Global typeahead search** grouped by Popular Charts / Custom Builder / Global Reports is the right model — even though two of three sections are WIP, it tells me upfront how the catalog is organised. The fact that ransomware turned up matches in all three sections without breaking the layout is a quiet win.

The **VERIFIED stat tiles** on the report detail (85% takedown, 5.0 days, etc.) are exactly what I want for a quote-block in a deck. The "Curated extraction — top ~10 findings per report into the searchable library, full 20–35 on the drill-down page" rule is correctly restrained.

---

## P0 — fix before you call this V1 production

**1. "Instant export" is in the hero and there is no export anywhere.**
I searched every chart, every VERIFIED tile, every report header — no PNG, no CSV, no copy-to-clipboard, no "add to pack." Methodology admits PNG export is WIP. That's a contradiction the average CISO catches on minute two and never comes back from. Either ship a minimum-viable PNG-with-watermark-and-citation before launch, or remove "Instant export" from the hero until you can deliver it. The current state is the worst of both worlds.

-- We had a hovering card (modal) look for each report's card bring that back considering the new changes, it should be used in new report screen so workflow is /reports, you click smth you see the report page you click again and see the hovering screen with the PNG export also. 

**2. No "copy stat with citation" on the VERIFIED tiles.**
If PNG is a heavier lift, the cheapest win on the entire site is a copy icon on each verified tile that puts `"85% takedown — Censys, 2025 State of the Internet Report, indexed 2026-05-11"` on the clipboard. I'd use that ten times a week. Today I'm retyping by hand.

**3. The home-page marketing stats look invented.**
"2,400+ CISOs using Brief Room", "47 countries covered", "180+ ready-made charts", "12s avg. time to first chart" — for a V1 free prototype where Popular Charts is literally marked SOON, these numbers cannot all be real. A CISO's job is sniffing out unverifiable numbers. If your hero contains some, it undermines the entire "trusted source" pitch you're working so hard to build elsewhere. Either show me the real or pull them.

---

## P1 

**4. Industry / region filters scope *reports*, not *findings*.**
I selected Healthcare and got 22 of 42 reports — but the top cards still led with generic ransomware-Top-10 and OSSRA package-poisoning stats. None of that is healthcare-scoped on the card. As a CISO prepping a healthcare-board update, I expected the filter to surface *findings within reports that apply to healthcare*, not "reports that mention healthcare somewhere." Re-scope the filter to the finding level, or be explicit that you're filtering reports and surface healthcare-tagged findings inside each card preview.

**5. Charts shipped without legends or axis labels.**
The PolarEdge donut on the Censys page shows five slices and a subtitle saying it concentrates "in South Korea and the US" — but the donut itself has no country labels and no legend. If I screenshot that, my board cannot read it. Same with the "Bitdefender Threat Debrief" card chart on the list view — red bars labelled `Oct 20`/`Nov 20`, no y-axis title, no units. Every chart needs: title, subtitle, x-axis label, y-axis label with units, and either inline labels or a legend. This is the baseline for "ready to present."

**6. No cross-vendor comparability view.**
Half my catalog is duplicate-coverage: DBIR, M-Trends, X-Force, CrowdStrike all measure dwell time / breach causes / top sectors. When two of them disagree (and they always do), where is the side-by-side? Today I have to open four tabs. A "compare KPI across vendors" surface is the single biggest reason a CISO would pay for this when V2 ships. 

-- we must solve this on /reports page and the modal that help exports may be we may put a similar examples there directly letting people to switch other vendors similar data having like a gallery view on the side (small data show with labels) 

**7. Per-report methodology caveats are missing.**
Mandiant M-Trends is biased toward IR engagements (i.e. organisations that already got breached). Verizon DBIR is voluntarily-reported. Coveware skews toward ransomware victims who paid. These are not apples-to-apples, and Brief Room doesn't flag the difference. A one-line "vendor methodology bias" note on each card — even just `Sampling: IR engagements` vs `Sampling: voluntary contributions` — would prevent CISOs from miscomparing.

---

## P2 — polish backlog

**8. Date precision.** List cards show year only (2025 / 2026) except where the title includes a month ("December 2025"). For quarterly trackers, month precision is needed at a glance.

**9. Source badges are cryptic.** `BDF` `BDK` `SPH` `CNS` `CP` `TAL` `CISA` — only CISA is decodable cold. Add a tooltip on hover with the full vendor name. Or just print the vendor name on the chip.

- may use the logo if we have or full name

**10. "External Source" tag is noise.** 100% of V1 is external — the tag doesn't disambiguate anything. Either drop it or replace it with something informative (`Government source`, `Peer-reviewed`, `Vendor self-report`, `IR-based`).

**11. CTA inconsistency.** Featured cards have `View findings →` + `Open original ↗`. Regular cards have only `Open ↗` — ambiguous whether that opens Brief Room's drill-down or the source PDF. Standardise.

**12. Constellation background lowers text contrast** in places — the connecting lines drift behind H1 titles on the report list and detail. Quick WCAG AA pass needed on title contrast.

**13. No bookmarks, saved searches, or email digest.** "Ping me when DBIR 2026 publishes" is a fair request for every CISO in your target market.

-- add this to backlog  do not it it's a long process we may do it after this try. remind me that.

**14. No multi-select / pack-building.** A CISO's workflow is `pull 4–6 stats → ship to a board pack.` No "add to clipboard," no "build a one-pager." Adjacent products (Statista, IDC) all have this. Tie this to the PNG-export work.

-- add this to backlog  do not it it's a long process we may do it after this try. remind me that.

**15. Breadcrumbs.** "Back to Home" vs "Back to Global Reports" appear inconsistently. Add a breadcrumb on the report detail.

**16. Stale-stat flag.** A 2024 stat sitting on a 2026 page should be visually flagged. Today nothing tells me "this number is 18 months old."

**17. Layered citation handling.** When Vendor A cites Vendor B in their report, your card surfaces it as Vendor A's number. That's wrong attribution. Decide a rule and make it visible.

---

## What I'd want from V2 (not feedback on V1, just a roadmap signal)



A **freshness watchlist**: tell me when a vendor I follow publishes their next quarterly. Coveware drops a Q-report every 90 days; Cloudflare DDoS quarterly the same. Don't make me check.

A **disagreement digest**: monthly email — "These three KPIs had >20% spread across reporting vendors this quarter. Here's why." That's the comparability surface, repackaged as a habit.
-- add this to backlog  do not it it's a long process we may do it after this try. remind me that.


