# Charter — Content Graph (exhaustive content across app sections)

Project folder: `docs/projects/content-graph/` · Loop: [`LOOP-Graph.md`](./LOOP-Graph.md) · Gap audit / resume pointer: [`GAP-AUDIT.md`](./GAP-AUDIT.md) · Floors as tests: [`src/lib/contentGraph.test.ts`](../../../src/lib/contentGraph.test.ts) · Section loops: [`LOOPS/README.md`](../../../LOOPS/README.md)

| Field | Value |
|-------|-------|
| **Status** | Ongoing content drain (runtime E0–E11 is Done(global) per [`EPIC_MAP.md`](../../../EPIC_MAP.md)) |
| **Moved from** | `LOOPS/LOOP-Graph.md` (moved with `git mv` on 2026-10-21 so history follows) |
| **Commit policy** | Commits are left to Weng (`COMMIT_MODE: none`). Never push, never open a PR. |
| **Stop rule** | Same as the project loops: STOP for a human judgment, or after 3 consecutive failed attempts (3 fix rounds each) on one unit. Never pass by weakening a test or lowering a floor. |
| **Last audit** | 2026-10-21: every section at or above its floor; gaps found and filled are listed in [`GAP-AUDIT.md`](./GAP-AUDIT.md) |

## Goal
Fill every app section (Archive, Charts, Learn, Practice, Cases, Coach, Home) to its coverage floor, one verified content unit per tick. Echo each teaching idea across the surfaces that teach it (pattern → Learn → Buy-or-Sell drill → Practice; price action / trade management → Learn → Buy-or-Sell scenario → Practice → Coach; statements → Learn → Cases → Coach → Home; macro → Learn → Cases → Coach → Home; …).

## Scope
- **In:** picking the next section and unit (policies `FOUNDATION_THEN_ECHO` / `DRAIN` / `ECHO`), echo families, the stage machine, the per-tick rubric. All in [`LOOP-Graph.md`](./LOOP-Graph.md).
- **Not here:** the authoring rules for each unit. Those stay in the section loops in `LOOPS/` (`LOOP-Archive.md` … `LOOP-Home.md`), because each one is also run standalone, and `LOOPS/LOOP-Asymmetry.md` (class catch-up) is a separate run. Milestone delivery stays in the root `AGENTS_LOOP-*.md` files and the project loops under `docs/projects/*/`.

## Stages (the graph's "milestones")

| Stage | Exit criterion (from LOOP-Graph.md) |
|-------|-------------------------------------|
| 0 | Done(archive) per `LOOPS/LOOP-Archive.md` |
| 1 | Done(charts) per `LOOPS/LOOP-Charts.md` |
| 2 | Echo families 1 → 13 (with 2b price-action and 2c trade-management) have no remaining legal hops; family 14 (Academy) is filled (BA10.M3 shipped; every Academy Learn group is linked from an Academy unit, test-enforced) |
| 3 | Leftover floors drained: Learn → Practice → Cases → Coach → Home |
| Done(graph) | Every section file's Done(section) is true and `npm run test:content` is green |

## Verification
Every tick runs the chosen section's VERIFY line: `npm run lint` + `npm run test:content` + BUILD_CHECK (a temp `--outDir`; `dist/` is never touched), plus `npm run test:coaching` for Coach ticks and `npm run test:lib` for Archive / Practice ticks, plus the section's rubric. `npm run verify` runs everything (lint, every test suite, temp build). The config block and stop rules live at the top of LOOP-Graph.md.

## Related projects
- [`../financials-earnings/`](../financials-earnings/CHARTER.md): **Done.** Statement readers, the 13-week forecast, the earnings preview, Read the Print and Mark the band. Echo family `statements` points at its Learn groups and practice routes. Weng decided FE7.M2 (yes: earnings cases link to matching Read the Print rounds via `src/lib/financials/caseLinks.ts`) and FE8.M1 (both: simulated bank and biotech) on 2026-10-21; both are built and signed off.
- [`../macro-forces/`](../macro-forces/CHARTER.md): **Done.** Macro Desk (`/macro`), lessons, the reaction game and five Learn groups. Echo family `macro` points at them.
- [`../beginner-academy/`](../beginner-academy/CHARTER.md): **Done** (BA0–BA11, signed off 2026-10-21). Echo family `academy` is filled: Learn `orders-and-fills` / `paper-pnl` / `options-ladder` are linked from Academy units, which link to graph content rather than copying it.
- Trade management (commit 2c93114): stops at invalidation, entry types, trailing stops and planned targets; echo family `trade-management` (2c).
