# Progress log: Beginner Academy

Append-only. The loop writes one entry per story attempt outcome (PASS, FIX round, PENDING SIGN-OFF, or STOP). Newest at the bottom. Times are America/Los_Angeles.

**Current pointer**
- `current_story`: BA1.M1.S1
- `status`: in progress — BA0 done
- `consecutive_failed_attempts`: 0
- `commit_mode`: local (Weng 2026-10-21: "Then make commits" — one local commit per coherent chunk with verify green; never push)
- `checkpoint_mode`: continue

**Baseline before BA0 (2026-10-21, from the financials + macro runs):** lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 241/241 · test:macro 72/72. The loop re-measures on its first tick and records the real numbers here before changing anything.

**Baseline update (2026-10-21, after the content-graph gap audit):** lint 0 · test:coaching 24/24 · test:lib 161/161 (the old 68 `src/lib` tests + 93 `contentGraph.test.ts` checks) · test:financials 241/241 · test:macro 72/72 · check:build ok. `npm run verify` runs the whole list.

## Human sign-offs
| Checkpoint | Signed by | Date | Notes |
|------------|-----------|------|-------|
| BA1.M4 curriculum map | — | — | |
| BA3.M4 placement routing bands | — | — | |
| BA5.M4 paper UI + order-preview wording | — | — | |
| BA7.M5 rewards point values + badge list | — | — | |
| BA8.M4 options accuracy + gating feel | — | — | |
| Decision D1 options payoff math allowed (CHARTER §8) | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | allowed, arithmetic only, no Greeks |
| Decision D2 placement card placement | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | optional, never blocks first run |
| Decision D3 default virtual cash $10k | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | $10k, presets $1k / $10k / $100k / $1M |
| Decision D4 fees off | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | |
| Decision D5 Academy unlocks nothing existing | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | links and recommends only |
| Stretch BA11 approval | — | — | loop must not start BA11 without a line here |

## Entries

<!-- Template:
### 2026-10-21 10:00 PT · BA4.M3.S2 · PASS
- Changed: src/lib/academy/paper/engine.ts (+140/−12), src/lib/academy/paper/engine.test.ts (+180/−0)
- Verify: lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 241/241 · test:macro 72/72 · test:academy 88/88 · temp build ok (deleted) · dist/ clean
- Milestone-specific: buy stop gap-up fills at open 10450 not stop 10200; stop-limit gap past limit → no fill, order stays working; BP reservation released on cancel
- Next: BA4.M3.S3

### 2026-10-21 11:00 PT · BA5.M4 · PENDING WENG SIGN-OFF (loop continued)
- Screenshots (checkpoints/): ba5-ticket-<type>.png …
- What to look at: (1) … (2) …

### 2026-10-21 12:00 PT · BA8.M2.S1 · FAIL attempt 1/3 (round 3/3)
- Error: <last command + excerpt>
- Approach tried: …
- Files touched / reverted: …
- Next attempt plan: …

### <time> · <story> · STOP (a) Blocker Report | STOP (b) Failure Report
- Milestone/story, what's decided, exact question(s), options + recommendation, review package paths
-->

### 2026-10-21 21:24 PT · Loop start · baseline + config
- Baseline (untouched tree at a9cb6c5, financials FE7.M2 / FE8.M1 committed): lint 0 · test:coaching 24/24 · test:lib 161/161 · test:financials 333/333 · test:macro 72/72 · check:build ok. Green, so the loop proceeds.
- Config for this run (from Weng's drain brief, 2026-10-21): COMMIT_MODE local (one commit per coherent chunk, verify green, never push) · CHECKPOINT_MODE continue · defaults D1–D5 confirmed · BA11 not started (no approval line).
- Storage keys renamed by the brief to sit under the academy prefix: `analysis_core_academy_v1`, `analysis_core_academy_paper_v1`, `analysis_core_academy_rewards_v1` (CHARTER / EPICS / STORIES updated to match).

### 2026-10-21 21:24 PT · BA0.M1.S1–S2, BA0.M2.S1, BA0.M3.S1 · PASS
- Changed: src/lib/academy/types.ts (new), src/lib/academy/paper/types.ts (new: order / fill / account / session-log types used by storage), src/lib/academy/refs.ts (new), src/lib/academy/refs.test.ts (new), src/lib/academy/storage.ts (new), src/lib/academy/storage.test.ts (new), package.json (+2/−1: `test:academy`, added to `verify`)
- Glob proof: a deliberately failing top-level `.ts` and a nested `paper/*.tsx` test both ran and failed (2/2 not ok), then were deleted.
- Verify: lint 0 · test:coaching 24/24 · test:lib 161/161 · test:financials 333/333 · test:macro 72/72 · test:academy 9/9 · build ok (temp dir)
- Milestone-specific: ContentRef union = 7 kinds; one good + one broken ref per kind with the app's own hrefs; `APP_ROUTES` equals the `<Route path>` list parsed from App.tsx; storage round-trip, v0 → v1 lossless (idempotent re-migration), corrupt / non-object / newer-schema JSON → empty + `recovered: true`; spy storage proves only the three academy keys are read or written.
- Next: BA1.M1.S1

