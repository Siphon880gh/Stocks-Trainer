# Charter — Content Graph (exhaustive content across app sections)

Project folder: `docs/projects/content-graph/` · Loop: [`LOOP-Graph.md`](./LOOP-Graph.md) · Section loops: [`LOOPS/README.md`](../../../LOOPS/README.md)

| Field | Value |
|-------|-------|
| **Status** | Ongoing content drain (runtime E0–E11 is Done(global) per [`EPIC_MAP.md`](../../../EPIC_MAP.md)) |
| **Moved from** | `LOOPS/LOOP-Graph.md` (moved with `git mv` on 2026-10-21 so history follows) |
| **Commit policy** | Commits are left to Weng. Never push, never open a PR. |

## Goal
Fill every app section (Archive, Charts, Learn, Practice, Cases, Coach, Home) to its coverage floor, one verified content unit per tick. Echo each teaching idea across the surfaces that teach it (pattern → Learn → Buy-or-Sell drill → Practice; statements → Learn → Cases → Coach → Home; …).

## Scope
- **In:** picking the next section and unit (policies `FOUNDATION_THEN_ECHO` / `DRAIN` / `ECHO`), echo families, the stage machine, the per-tick rubric. All in [`LOOP-Graph.md`](./LOOP-Graph.md).
- **Not here:** the authoring rules for each unit. Those stay in the section loops in `LOOPS/` (`LOOP-Archive.md` … `LOOP-Home.md`), because each one is also run standalone, and `LOOPS/LOOP-Asymmetry.md` (class catch-up) is a separate run. Milestone delivery stays in the root `AGENTS_LOOP-*.md` files and the project loops under `docs/projects/*/`.

## Stages (the graph's "milestones")

| Stage | Exit criterion (from LOOP-Graph.md) |
|-------|-------------------------------------|
| 0 | Done(archive) per `LOOPS/LOOP-Archive.md` |
| 1 | Done(charts) per `LOOPS/LOOP-Charts.md` |
| 2 | Echo families 1 → 13 have no remaining legal hops |
| 3 | Leftover floors drained: Learn → Practice → Cases → Coach → Home |
| Done(graph) | Every section file's Done(section) is true |

## Verification
Every tick: `npm run lint` + `npm run build` (prefer a temp `--outDir` and leave `dist/` alone), plus `npm run test:coaching` for Coach ticks, plus the chosen section's rubric. The error budget and stop rules live in LOOP-Graph.md.

## Related projects
- [`../financials-earnings/`](../financials-earnings/CHARTER.md): builds the statement readers, the 13-week forecast, the earnings preview and the "Read the Print" game. When that ships (FE7.M3), echo family `statements` gains the new Learn groups.
