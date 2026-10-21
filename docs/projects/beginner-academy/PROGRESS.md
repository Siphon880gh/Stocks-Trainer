# Progress log: Beginner Academy

Append-only. The loop writes one entry per story attempt outcome (PASS, FIX round, PENDING SIGN-OFF, or STOP). Newest at the bottom. Times are America/Los_Angeles.

**Current pointer**
- `current_story`: BA0.M1.S1 (not started)
- `status`: chartered — waiting for the first loop run
- `consecutive_failed_attempts`: 0
- `commit_mode`: none
- `checkpoint_mode`: continue

**Baseline before BA0 (2026-10-21, from the financials + macro runs):** lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 241/241 · test:macro 72/72. The loop re-measures on its first tick and records the real numbers here before changing anything.

## Human sign-offs
| Checkpoint | Signed by | Date | Notes |
|------------|-----------|------|-------|
| BA1.M4 curriculum map | — | — | |
| BA3.M4 placement routing bands | — | — | |
| BA5.M4 paper UI + order-preview wording | — | — | |
| BA7.M5 rewards point values + badge list | — | — | |
| BA8.M4 options accuracy + gating feel | — | — | |
| Decision D1 options payoff math allowed (CHARTER §8) | — | — | default: allowed, arithmetic only |
| Decision D2 placement card placement | — | — | default: optional, never blocks first run |
| Decision D3 default virtual cash $10k | — | — | |
| Decision D4 fees off | — | — | |
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
