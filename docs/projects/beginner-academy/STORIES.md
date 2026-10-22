# Stories: Beginner Academy

Parent: [`EPICS.md`](./EPICS.md) · Charter: [`CHARTER.md`](./CHARTER.md) · Progress: [`PROGRESS.md`](./PROGRESS.md)

Same shape as the root `IMPLEMENTATION_STORIES.md` and the financials / macro projects. **Status key:** `todo` · `in_progress` · `done` · `blocked`. One story `in_progress` at a time. The loop advances stories in order and flips the milestone box in EPICS.md when its last story is `done`.

## Conventions
- New code: `src/lib/academy/` (data + pure logic + tests, subfolders `content/`, `paper/`, `rewards/`, `options/`), `src/components/academy/` (UI), `src/pages/academy/` (routes). Type-only imports into `quizData.ts` / `literacyTerms.ts` (no runtime cycles; same rule as `buySellDrill.ts`, financials and macro).
- Money is integer cents, shares are integers; formatting only in components.
- Every paper surface carries `SIMULATED — virtual money, SAMPLE prices, not a brokerage, not trading advice.`; every rewards surface says points are virtual and not redeemable; every options surface carries the options risk statement.
- New localStorage keys only (`analysis_core_academy_v1`, `analysis_core_academy_paper_v1`, `analysis_core_academy_rewards_v1`). Do not modify `analysis_core_progress_v1`, Beginner unlocks, case grading, or the financials / macro projects' files beyond the additive integration edits named in EPICS.md.
- All lesson and quiz text is original. No broker names, logos, colours, course titles or quiz wording.

## Build order

| # | Story | Milestone | Acceptance (short) | Status |
|---|-------|-----------|--------------------|--------|
| 1 | BA0.M1.S1 Types | BA0.M1 | Types compile; ContentRef union covers 7 kinds | done |
| 2 | BA0.M1.S2 `test:academy` script | BA0.M1 | Dummy failing test proves the glob, then removed | done |
| 3 | BA0.M2.S1 Ref resolver + route constant | BA0.M2 | Good/broken ref per kind; route constant ⊇ App.tsx routes | done |
| 4 | BA0.M3.S1 Storage keys + migrate + recovery | BA0.M3 | Round-trip, v0→v1, corruption recovery; no foreign-key writes | done |
| 5 | BA1.M1.S1 Levels L0–L7 + course skeleton | BA1.M1 | 8 levels, unique ids, DAG, all reachable | done |
| 6 | BA1.M2.S1 Units L0–L1 | BA1.M2 | ≥ 10 units; card limits; refs resolve | done |
| 7 | BA1.M2.S2 Units L2–L3 | BA1.M2 | ≥ 12 more units; refs into candles / plan / order terms | done |
| 8 | BA1.M3.S1 Units L4–L5 | BA1.M3 | ≥ 9 units linking financials + macro surfaces | done |
| 9 | BA1.M3.S2 Units L6–L7 + orphan-surface coverage test | BA1.M3 | ≥ 9 units; every major surface referenced | done |
| 10 | BA1.M4.S1 🔍 Curriculum map review package | BA1.M4 | Screenshots + outline logged PENDING | done |
| 11 | BA2.M1.S1 Unit quiz items L0–L3 | BA2.M1 | 3–5 per unit; cross-bank unique; letter balance | done |
| 12 | BA2.M1.S2 Unit quiz items L4–L7 | BA2.M1 | Same checks; citation check passes | done |
| 13 | BA2.M2.S1 `scoreUnit` mastery math | BA2.M2 | 80% threshold; deterministic retry shuffle | done |
| 14 | BA2.M2.S2 UnitPlayer component | BA2.M2 | No pre-submit leak; chips link to resolved hrefs | done |
| 15 | BA2.M3.S1 Course progress model | BA2.M3 | Scripted learner; best score kept; test-out unlock | done |
| 16 | BA3.M1.S1 Placement bank + router | BA3.M1 | Monotone; ≥ 4 start levels; extremes route L0 / L4 | done |
| 17 | BA3.M2.S1 Per-level test-outs | BA3.M2 | ≥ 85% pass marks tested-out; single award | done |
| 18 | BA3.M3.S1 PlacementCard + optional first-run hook | BA3.M3 | GoalPicker flow + pathConfirmed unchanged | done |
| 19 | BA3.M4.S1 🔍 Placement routing review package | BA3.M4 | Score-band table + screenshots logged PENDING | done |
| 20 | BA4.M1.S1 Account + ledger | BA4.M1 | Equity / cash / avg-cost invariants; property test | done |
| 21 | BA4.M2.S1 Order validation | BA4.M2 | ≥ 30 table cases; stable error codes | done |
| 22 | BA4.M3.S1 Market + limit fills | BA4.M3 | Gap cases; BP reservation/release | done |
| 23 | BA4.M3.S2 Stop + stop-limit fills | BA4.M3 | Gap-through fills at open; stop-limit no-fill case | done |
| 24 | BA4.M3.S3 Trailing stop ($ and %) + TIF | BA4.M3 | Ratchet never down; Day expires, GTC persists | done |
| 25 | BA4.M4.S1 P&L + performance stats | BA4.M4 | Hand-computed P&L, drawdown, R, exposure | done |
| 26 | BA4.M5.S1 SAMPLE tapes + symbol catalogue | BA4.M5 | ≥ 8 tapes ≥ 60 bars; valid OHLC; blocklist | done |
| 27 | BA5.M1.S1 `describeOrder` preview | BA5.M1 | Every type/side described from the order object | done |
| 28 | BA5.M1.S2 OrderTicket component | BA5.M1 | SIMULATED banner; invalid disables submit | done |
| 29 | BA5.M2.S1 Positions / orders / history / equity curve | BA5.M2 | Rendered numbers = stats.ts | done |
| 30 | BA5.M3.S1 `/paper` page + replay stepping + persistence | BA5.M3 | No future-bar leak; reload restores | done |
| 31 | BA5.M4.S1 🔍 Paper UI review package | BA5.M4 | Desktop + mobile screenshots logged PENDING | done |
| 32 | BA6.M1.S1 Challenge model + rule checks + scoring | BA6.M1 | Pass / breach / edge per rule; discipline ≥ 50% | done |
| 33 | BA6.M2.S1 Challenges: order mechanics + trailing stops | BA6.M2 | Reference play passes; reckless play breaches | done |
| 34 | BA6.M2.S2 Challenges: risk + patience + earnings gap | BA6.M2 | ≥ 10 total across ≥ 4 themes | done |
| 35 | BA6.M3.S1 Benchmarks + local leaderboard | BA6.M3 | Rank math incl. ties; no network | done |
| 36 | BA6.M4.S1 Challenges UI + weekly rotation | BA6.M4 | Deterministic week pick; all appear within N weeks | done |
| 37 | BA7.M1.S1 Points ledger | BA7.M1 | Idempotent; delta-only retries; no redeem API | done |
| 38 | BA7.M2.S1 Daily streak + freezes | BA7.M2 | DST / midnight clocks; freeze rule | done |
| 39 | BA7.M2.S2 XP levels | BA7.M2 | Threshold table; monotone | done |
| 40 | BA7.M3.S1 ≥ 20 badges | BA7.M3 | Scripted learner earns all; fresh learner none | done |
| 41 | BA7.M4.S1 Retro-credit (read-only) | BA7.M4 | Zero writes to foreign keys; idempotent | done |
| 42 | BA7.M5.S1 RewardsPanel + toast | BA7.M5 | Virtual-only disclaimer; locked hints | done |
| 43 | BA7.M5.S2 🔍 Rewards review package | BA7.M5 | Point table + screenshots logged PENDING | done |
| 44 | BA8.M1.S1 Ladder data L1–L4 | BA8.M1 | Strategy lists per level | done |
| 45 | BA8.M1.S2 Payoff math | BA8.M1 | Hand table + dense-grid property | done |
| 46 | BA8.M2.S1 Knowledge checks + gating | BA8.M2 | ≥ 8 items/level; 3 attempts / 24 h; ordering | done |
| 47 | BA8.M3.S1 OptionsLadder + PayoffChart | BA8.M3 | Risk statement; no Greeks/chain wording | done |
| 48 | BA8.M4.S1 🔍 Options accuracy review package | BA8.M4 | Strategy table logged PENDING | done |
| 49 | BA9.M1.S1 Daily picker | BA9.M1 | Same date → same picks; 7-day no-repeat | done |
| 50 | BA9.M2.S1 TodayCard on Home + Academy | BA9.M2 | Daily question counts toward streak | done |
| 51 | BA10.M1.S1 `/academy` hub + unit route + nav | BA10.M1 | Every academy href resolves | done |
| 52 | BA10.M2.S1 ≥ 25 glossary terms | BA10.M2 | No collisions; sibling terms linked not copied | done |
| 53 | BA10.M3.S1 Learn groups orders-and-fills / paper-pnl / options-ladder | BA10.M3 | ≥ 60 new questions overall; numeric recompute | done |
| 54 | BA10.M4.S1 Coach `first-paper-trade` + Training card + Home tip | BA10.M4 | Coaching validator passes | done |
| 55 | BA10.M5.S1 Docs + LOOPS README row + floors audit | BA10.M5 | floors.test.ts green | done |

## Stretch (BA11, needs a PROGRESS.md approval line first)

| # | Story | Milestone | Status |
|---|-------|-----------|--------|
| S1 | BA11.M1.S1 Bracket / OCO / OTO | BA11.M1 | done |
| S2 | BA11.M2.S1 Short selling + margin explainer | BA11.M2 | todo |
| S3 | BA11.M3.S1 Fractional + dollar orders | BA11.M3 | todo |
| S4 | BA11.M4.S1 Fees / slippage toggle | BA11.M4 | todo |
| S5 | BA11.M5.S1 Trade journal + CSV export | BA11.M5 | todo |
| S6 | BA11.M6.S1 Multiple paper portfolios | BA11.M6 | todo |
