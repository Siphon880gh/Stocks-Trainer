# Progress log: Beginner Academy

Append-only. The loop writes one entry per story attempt outcome (PASS, FIX round, PENDING SIGN-OFF, or STOP). Newest at the bottom. Times are America/Los_Angeles.

**Current pointer**
- `current_story`: BA8.M1.S1
- `status`: in progress — BA0–BA7 and BA10.M2 done; BA1.M4, BA3.M4, BA5.M4, BA7.M5 PENDING WENG SIGN-OFF
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

### 2026-10-21 22:20 PT · BA1–BA4, BA6.M1–M3, BA7.M1–M4, BA10.M2 · PASS (one local commit)
- Changed (all new unless noted): src/lib/academy/content/ (levels, unitsL0L3, unitsL4L7, quizBuilder, quizzesL0L3, quizzesL4L7, unitQuizzes, banned, estimate + tests), mastery.ts, progress.ts, placement.ts, testOut.ts, terms.ts, copy.ts, challenges.ts, paper/ (account, validate, engine, stats, tapes, session, counters, fixtures + tests), rewards/ (ledger, streak, levels, badges, award, refresh, retro + tests), components/academy/ (UnitPlayer, PlacementCard, SimulatedBanner), pages/academy/ (AcademyHub, AcademyUnit, AcademyTestOut); edited App.tsx (3 routes), refs.ts APP_ROUTES (+3), literacyTerms.ts (spreads ACADEMY_TERMS), Dashboard.tsx (optional PlacementCard after the GoalPicker), index.css (`--color-sim` tokens), types.ts (`PlacementItem.unitId`, `Order.initialStop`).
- Verify: lint 0 · test:coaching 24/24 · test:lib 161/161 · test:financials 333/333 · test:macro 72/72 · test:academy 98/98 · check:build ok (temp outDir deleted) · dist/ untouched.
- Milestone-specific: 43 units / 129 unit-quiz items (≤ 35% per letter per level); placement exhaustive 2^12 monotone with 5 distinct starts; validation 42 table cases; engine fill table 29 rows covering every type × side × TIF plus no-OCO, BP release, gap-past-buffer reject, cash conservation and determinism on all 8 tapes; reference play passes and reckless play breaches on all 10 challenges; 24 badges (fresh learner none, scripted learner all); retro credit makes zero writes to the progress, Read-the-Print and Macro keys.
- Decisions taken under the brief (flag if you disagree):
  - BA10.M2 glossary terms pulled forward (31 terms) because units and challenges cite them.
  - Tapes come from a seeded generator, not copied from scenarioCharts; fictional `.S` symbols are checked against a real-ticker blocklist (PRNT, GRND and similar real tickers were avoided).
  - Placement credit marks lower levels complete; every unit of an unlocked level is open (no unit-by-unit lock).
  - 3-item units need 3/3 for mastery (80% rounds up).
  - Paper sessions persist as an action log that replays through the engine.
  - Sell orders need the shares when placed (long-only, no shorting), so a protective stop goes in once the entry fills.
  - Two exits on one position are not OCO: the later one is cancelled with "position already closed" (OCO is BA11).
  - A stop-limit fills on its trigger bar only if the trigger price is inside the limit; after that it works as a plain limit.
  - No nav item: the Academy is reached by a Training card and a Home tip (BA10.M4), like Macro Desk and financials.
- Next: BA5.M1.S1 (describeOrder + OrderTicket), then the /paper page.

### 2026-10-21 22:20 PT · BA1.M4 · PENDING WENG SIGN-OFF (loop continued)
- Screenshots (checkpoints/): ba1-hub-fresh.png (full map, fresh learner), ba1-hub-progress.png (one unit mastered), ba2-unit-card.png, ba2-unit-quiz.png, ba2-unit-mobile.png.
- Curriculum outline (level · prerequisites · course — units with reading minutes):
- **L0 Orientation** (needs nothing): Start here — What a market is (2m), How this app teaches (2m), Risk comes first (2m), Simulated vs real money (2m), Build a learning routine (2m)
- **L1 Stock basics** (needs L0): Stocks and quotes — What a share is (1m), Reading a quote (1m), Why prices move (2m), Long, short and selling (1m), Investing vs trading (2m), Don't put it all in one stock (1m)
- **L2 Charts & candles** (needs L1): Reading charts — Reading one candle (2m), Wicks and bodies (2m), Trend or range? (1m), Support and resistance (1m), Volume confirms (1m), Patterns need context (1m)
- **L3 Orders, sizing & risk** (needs L2): Order types — Market vs limit orders (2m), Stop orders (2m), Stop-limit orders (2m), Trailing stops (2m), How long an order lasts (1m); Sizing and planning — How many shares? (1m), Plan before you enter (1m)
- **L4 Company fundamentals & earnings** (needs L1): Reading statements — The three statements (1m), Profit is not cash (1m), Margins and P/E (1m); Earnings season — Earnings vs expectations (1m), How stocks react to earnings (1m), Debt and balance-sheet risk (1m)
- **L5 Macro & rates** (needs L1): Macro and rates — Jobs and inflation reports (1m), What the Fed does (1m), Yields and the curve (1m), Reading a macro reaction (1m), Rates, housing and sectors (1m)
- **L6 Options education** (needs L3): Options basics — What an option is (1m), Payoff at expiration (1m), Covered calls and cash-secured puts (2m), Why options are risky (1m)
- **L7 Other markets** (needs L1): Beyond single stocks — ETFs (1m), Futures (1m), Currencies (forex) (1m), Crypto (1m)
- What to look at: (1) whether L4, L5 and L7 should open after L1 (now) or after L3; (2) whether any unit is missing for a true beginner; (3) unit reading lengths (1–2 min each plus a 3-question check).

### 2026-10-21 22:20 PT · BA3.M4 · PENDING WENG SIGN-OFF (loop continued)
- Screenshots (checkpoints/): ba3-placement-question.png, ba3-test-out.png, ba3-home-fresh.png (Home before the goal picker: the card stays hidden until the path is confirmed).
- Routing table: 12 items (L0 2, L1 2, L2 3, L3 3, L4 2). A level passes with at least 2/3 of its items right (2 of 2, 2 of 3). Start = the first of L0–L3 that is not passed; all four passed → L4. Placement never routes into L5–L7.

| Result | Start level |
|--------|-------------|
| Misses either L0 item | L0 Orientation |
| L0 passed, misses either L1 item | L1 Stock basics |
| L0–L1 passed, 2+ L2 items wrong | L2 Charts & candles |
| L0–L2 passed, 2+ L3 items wrong | L3 Orders, sizing & risk |
| L0–L3 passed | L4 (the L4 items show the score but cannot route higher) |
| "I'm brand new" | L0 (skipped) |

- Credited levels with a missed item list that unit under "Worth a quick review".
- What to look at: (1) the 2/3 pass bar, (2) whether the 2-item levels are too strict at 2/2, (3) the 85% test-out bar (6 of 7).

### 2026-10-21 22:55 PT · BA5.M1–M3, BA6.M4, BA7.M5.S1 · PASS (one local commit)
- Changed: src/lib/academy/paper/describe.ts (new, `describeOrder` / `orderLabel` / money), components/academy/paper/ (OrderTicket, PaperPanels, EquityCurve, PaperSession; new), components/academy/RewardsPanel.tsx (new), pages/academy/Paper.tsx and PaperChallenges.tsx (new), AcademyHub.tsx (paper + challenges cards, RewardsPanel), AcademyUnit.tsx (reward toast), App.tsx + refs.ts APP_ROUTES (`/paper`, `/paper/challenges`, `/paper/challenges/:challengeId`), unitsL0L3.ts (`route:/paper` chips back on the four order-type units), validate.ts / engine.ts (money in messages now has thousands separators), challenges.ts (clearer stop-on-entry-bar breach text); tests describeOrder.test.ts and paperPage.render.test.tsx (new).
- Verify: lint 0 · test:coaching 24/24 · test:lib 161/161 · test:financials 333/333 · test:macro 72/72 · test:academy 108/108 · check:build ok · dist/ untouched.
- Milestone-specific: chart axis labels never pass the current bar and the highest future high is never printed; a stored session restores on load; panels print exactly the `stats.ts` numbers; an invalid ticket disables "Place simulated order" and shows the coded error; challenge list shows all 10 plus the ISO-week pick; locked badges show the hint and never predicate code; points disclaimer on the panel.
- Decisions: challenge attempts are scored and saved when the window ends, but an unfinished challenge run is not persisted (a reload starts it over); the free paper session is persisted. Chart price-line labels come from the shared CandlestickChart, which rounds labels to whole dollars; exact levels are in Open orders. Left as is so the shared chart stays byte-identical.
- Next: BA8.M1.S1 (options ladder + payoff math).

### 2026-10-21 22:55 PT · BA5.M4 · PENDING WENG SIGN-OFF (loop continued)
- Screenshots (checkpoints/): ba5-paper-setup.png, ba5-paper-session.png, ba5-ticket-market.png, ba5-ticket-limit.png, ba5-ticket-stop.png, ba5-ticket-stop-limit-sell.png, ba5-ticket-trailing-stop-sell.png, ba5-ticket-invalid.png, ba5-trailing-step0..3.png + ba5-trailing-step0..3-orders.png (3% trail ratcheting up over three bars), ba5-stoplimit-before-gap.png and ba5-stoplimit-gap-nofill.png (11% gap: the stop-limit triggers, does not fill, the shares are still held), ba5-history-rejection.png, ba5-paper-mobile.png.
- What to look at: (1) the order-preview wording for each type (ticket shots); (2) whether the 5% market-order buffer for buying power is clear enough; (3) whether whole-dollar chart labels are fine.

### 2026-10-21 22:55 PT · BA7.M5 · PENDING WENG SIGN-OFF (loop continued)
- Screenshots (checkpoints/): ba7-rewards-panel.png (seeded learner), ba7-rewards-fresh.png, ba7-hub-mobile.png, ba6-challenges-list.png, ba6-challenge-play.png, ba6-challenge-result-breach.png (no stop on the entry bar: 60/100, ranked against the fictional benchmarks).
- Point values: unit mastered up to 30 (scaled by best score) · level test-out 50 · challenge passed 40 · first paper order 10 · Today review 5 · options level 60 · one-time catch-up for earlier progress up to 150. Ranks: Newcomer 0 · Learner 100 · Reader 250 · Planner 450 · Practitioner 700 · Disciplined 1000 · Steady hand 1400 · Mentor-ready 1900 · Veteran 2500 · Academy graduate 3200.
- Badges (24): First Step, Warming Up, Study Habit, Oriented, Share Savvy, Candle Reader, Order Desk, Statement Sleuth, Already Knew It, Know Your Start, Ticket Writer, Price Setter, Trend Follower, Seatbelt On, Gap Lesson, Challenger, Rule Keeper, Well Rounded, Options Curious, Ladder Climbed, Three in a Row, Full Week, Point Collector, Review Regular.
- What to look at: (1) the point values and rank names; (2) the badge list; (3) challenge scoring at 60 discipline / 40 result.

