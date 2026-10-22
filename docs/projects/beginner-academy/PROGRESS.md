# Progress log: Beginner Academy

Append-only. The loop writes one entry per story attempt outcome (PASS, FIX round, PENDING SIGN-OFF, or STOP). Newest at the bottom. Times are America/Los_Angeles.

**Current pointer**
- `current_story`: none (BA0–BA11 done)
- `status`: core BA0–BA10 done and signed off (2026-10-21); BA11 stretch (M1–M6) done 2026-10-21
- `consecutive_failed_attempts`: 0
- `commit_mode`: local (Weng 2026-10-21: "Then make commits" — one local commit per coherent chunk with verify green; never push)
- `checkpoint_mode`: continue

**Baseline before BA0 (2026-10-21, from the financials + macro runs):** lint 0 · test:coaching 24/24 · src/lib tests 63/63 · test:financials 241/241 · test:macro 72/72. The loop re-measures on its first tick and records the real numbers here before changing anything.

**Baseline update (2026-10-21, after the content-graph gap audit):** lint 0 · test:coaching 24/24 · test:lib 161/161 (the old 68 `src/lib` tests + 93 `contentGraph.test.ts` checks) · test:financials 241/241 · test:macro 72/72 · check:build ok. `npm run verify` runs the whole list.

## Human sign-offs
| Checkpoint | Signed by | Date | Notes |
|------------|-----------|------|-------|
| BA1.M4 curriculum map | Weng — "I'll just sign off on everything" (relayed) | 2026-10-21 | signed off as shown in the checkpoint entries |
| BA3.M4 placement routing bands | Weng — "I'll just sign off on everything" (relayed) | 2026-10-21 | signed off as shown in the checkpoint entries |
| BA5.M4 paper UI + order-preview wording | Weng — "I'll just sign off on everything" (relayed) | 2026-10-21 | signed off as shown in the checkpoint entries |
| BA7.M5 rewards point values + badge list | Weng — "I'll just sign off on everything" (relayed) | 2026-10-21 | signed off as shown in the checkpoint entries |
| BA8.M4 options accuracy + gating feel | Weng — "I'll just sign off on everything" (relayed) | 2026-10-21 | signed off as shown in the checkpoint entries |
| Decision D1 options payoff math allowed (CHARTER §8) | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | allowed, arithmetic only, no Greeks |
| Decision D2 placement card placement | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | optional, never blocks first run |
| Decision D3 default virtual cash $10k | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | $10k, presets $1k / $10k / $100k / $1M |
| Decision D4 fees off | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | |
| Decision D5 Academy unlocks nothing existing | DEFAULT CONFIRMED — Weng (via drain brief) | 2026-10-21 | links and recommends only |
| Stretch BA11 approval | APPROVED — Weng ("Continue if there is", relayed with the sign-off) | 2026-10-21 | drain BA11.M1–M6 with the same Build / Accept / Verify discipline |

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

### 2026-10-21 22:20 PT · BA1.M4 · SIGNED OFF by Weng 2026-10-21 (was PENDING)
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

### 2026-10-21 22:20 PT · BA3.M4 · SIGNED OFF by Weng 2026-10-21 (was PENDING)
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

### 2026-10-21 22:55 PT · BA5.M4 · SIGNED OFF by Weng 2026-10-21 (was PENDING)
- Screenshots (checkpoints/): ba5-paper-setup.png, ba5-paper-session.png, ba5-ticket-market.png, ba5-ticket-limit.png, ba5-ticket-stop.png, ba5-ticket-stop-limit-sell.png, ba5-ticket-trailing-stop-sell.png, ba5-ticket-invalid.png, ba5-trailing-step0..3.png + ba5-trailing-step0..3-orders.png (3% trail ratcheting up over three bars), ba5-stoplimit-before-gap.png and ba5-stoplimit-gap-nofill.png (11% gap: the stop-limit triggers, does not fill, the shares are still held), ba5-history-rejection.png, ba5-paper-mobile.png.
- What to look at: (1) the order-preview wording for each type (ticket shots); (2) whether the 5% market-order buffer for buying power is clear enough; (3) whether whole-dollar chart labels are fine.

### 2026-10-21 22:55 PT · BA7.M5 · SIGNED OFF by Weng 2026-10-21 (was PENDING)
- Screenshots (checkpoints/): ba7-rewards-panel.png (seeded learner), ba7-rewards-fresh.png, ba7-hub-mobile.png, ba6-challenges-list.png, ba6-challenge-play.png, ba6-challenge-result-breach.png (no stop on the entry bar: 60/100, ranked against the fictional benchmarks).
- Point values: unit mastered up to 30 (scaled by best score) · level test-out 50 · challenge passed 40 · first paper order 10 · Today review 5 · options level 60 · one-time catch-up for earlier progress up to 150. Ranks: Newcomer 0 · Learner 100 · Reader 250 · Planner 450 · Practitioner 700 · Disciplined 1000 · Steady hand 1400 · Mentor-ready 1900 · Veteran 2500 · Academy graduate 3200.
- Badges (24): First Step, Warming Up, Study Habit, Oriented, Share Savvy, Candle Reader, Order Desk, Statement Sleuth, Already Knew It, Know Your Start, Ticket Writer, Price Setter, Trend Follower, Seatbelt On, Gap Lesson, Challenger, Rule Keeper, Well Rounded, Options Curious, Ladder Climbed, Three in a Row, Full Week, Point Collector, Review Regular.
- What to look at: (1) the point values and rank names; (2) the badge list; (3) challenge scoring at 60 discipline / 40 result.

### 2026-10-21 23:40 PT · BA8.M2.S1 · FIX (attempt 2/3, resolved)
- Error: optionsGate.test "no banned wording" flagged BA-OPT-L3-01 (distractor "Spreads cannot lose money" contains the banned phrase "cannot lose").
- Fix: reworded the distractor to "Both options always expire worthless". Test unchanged.

### 2026-10-21 23:40 PT · BA8.M1–M3 · PASS (one local commit)
- Changed: src/lib/academy/options/ (payoff.ts, ladder.ts, checks.ts, gate.ts + payoff.test.ts, optionsGate.test.ts; new), components/academy/options/ (OptionsLadder.tsx, PayoffChart.tsx; new), pages/academy/OptionsLadder.tsx (new), App.tsx + refs.ts (`/academy/options` route, label), AcademyHub.tsx (options card), unitsL4L7.ts (`route:/academy/options` chip on l6-payoff-at-expiration and l6-options-risk), optionsLadder.render.test.tsx (new).
- Verify: see the commit entry below for the full list; test:academy green.
- Milestone-specific: per-share and per-contract (×100) values from `summarize`; max gain / loss match the dense-grid min / max; kinks only at strikes; 8 checks per level, 4 of them numeric and recomputed from payoff.ts; pass at 80%; 3 attempts per rolling 24 h; acknowledgement required per level; L(n) needs L(n−1). Risk statement at the top and bottom of the ladder; chart path points equal `samplePayoff`; no chain or Greeks wording (grep test).
- Next: BA9.M1.S1 (Today card logic).

### 2026-10-21 23:40 PT · BA8.M4 · SIGNED OFF by Weng 2026-10-21 (was PENDING)
- Screenshots (checkpoints/): ba8-options-fresh.png, ba8-options-l1-card.png, ba8-options-check-open.png, ba8-options-l2-unlocked.png (level 1 passed + acknowledged), ba8-hub-options-card.png.
- Strategy table (all premiums are SAMPLE numbers on a $50 stock, payoff at expiration):

| Level | Strategy | Legs (SAMPLE, $50 stock) | Max gain / share | Max loss / share | Breakeven(s) | Per contract gain / loss |
|---|---|---|---|---|---|---|
| L1 | Covered call | own shares @ 50; short 55 call @ 1.50 | $6.50 | $48.50 | $48.50 | $650.00 / $4,850.00 |
| L1 | Buy-write | own shares @ 50; short 52 call @ 2.20 | $4.20 | $47.80 | $47.80 | $420.00 / $4,780.00 |
| L1 | Cash-secured put | short 45 put @ 1.20 | $1.20 | $43.80 | $43.80 | $120.00 / $4,380.00 |
| L2 | Long call | long 50 call @ 2.50 | Unlimited | $2.50 | $52.50 | Unlimited / $250.00 |
| L2 | Long put | long 50 put @ 2.30 | $47.70 | $2.30 | $47.70 | $4,770.00 / $230.00 |
| L2 | Protective put | own shares @ 50; long 47 put @ 1.10 | Unlimited | $4.10 | $51.10 | Unlimited / $410.00 |
| L2 | Collar | own shares @ 50; long 47 put @ 1.10; short 55 call @ 1.00 | $4.90 | $3.10 | $50.10 | $490.00 / $310.00 |
| L3 | Bull call spread (debit) | long 50 call @ 2.50; short 55 call @ 0.90 | $3.40 | $1.60 | $51.60 | $340.00 / $160.00 |
| L3 | Bull put spread (credit) | short 50 put @ 2.20; long 45 put @ 0.70 | $1.50 | $3.50 | $48.50 | $150.00 / $350.00 |
| L3 | Iron condor | long 40 put @ 0.40; short 45 put @ 1.00; short 55 call @ 1.10; long 60 call @ 0.45 | $1.25 | $3.75 | $43.75, $56.25 | $125.00 / $375.00 |
| L3 | Call butterfly | long 45 call @ 6.00; short 2× 50 call @ 2.50; long 55 call @ 0.80 | $3.20 | $1.80 | $46.80, $53.20 | $320.00 / $180.00 |
| L4 | Naked (uncovered) call (concept only) | short 55 call @ 1.50 | $1.50 | Unlimited | $56.50 | $150.00 / Unlimited |
| L4 | Naked (uncovered) put (concept only) | short 45 put @ 1.20 | $1.20 | $43.80 | $43.80 | $120.00 / $4,380.00 |

- What to look at: (1) every row above against a textbook; (2) whether 3 attempts per 24 h and the 80% bar feel right; (3) whether L4 naked options should stay concept-only with a check.

### 2026-10-22 00:10 PT · BA9.M1–M2 · PASS (one local commit)
- Changed: src/lib/academy/today.ts (new: `todayPicks`, `pickReview`, `reviewOrder`, `recentQuestionIds`, `pickTerm`, `recordDaily`), components/academy/TodayCard.tsx (new), pages/Dashboard.tsx (+3 lines: TodayCard after the placement card, only once the goal picker is confirmed), pages/academy/AcademyHub.tsx (TodayCard above the rewards panel); tests today.test.ts and today.render.test.tsx (new).
- Verify: lint 0 · test:coaching 24/24 · test:lib 161/161 · test:financials 333/333 · test:macro 72/72 · test:academy 135/135 · check:build ok · dist/ untouched.
- Milestone-specific: picks depend only on the local date key and stored state (hash32, no Math.random); review questions come from mastered units, least recently reviewed (then earliest mastered) first; 30 simulated days with 15 questions never repeat within 7 days; a 3-question pool still returns a question; an answered day keeps its question and ignores a second answer; answering calls `awardDaily` (5 points once per day) and marks the streak day active. Rendering the card writes nothing.
- Screenshots (checkpoints/): ba9-home-today.png, ba9-today-card.png, ba9-today-answered.png, ba9-today-fresh-mobile.png.
- Next: BA10.M1.S1 (hub route test: every academy href resolves).

### 2026-10-22 00:45 PT · BA10.M1 + BA10.M3 · PASS (one local commit)
- Changed: src/lib/academy/academyRoutes.render.test.tsx (new: renders the hub, all 43 unit pages, all test-out pages, paper, the challenge list and all 10 challenge pages, the options ladder and the Today card, and checks every href is an App route and that unit / level / challenge / glossary params name real items); src/lib/academy/quiz/groups.ts and quiz/banks.ts (new: orders-and-fills 22 · paper-pnl 20 · options-ladder 21 = 63 questions); src/lib/quizData.ts (+5 lines: import, `AcademyQuizGroupId` in the union, `...ACADEMY_QUIZ_GROUPS` after the macro groups, `isAcademyQuizGroup` short-circuit in both lookup functions); academyQuiz.test.ts (new).
- Verify: lint 0 · test:coaching 24/24 · test:lib 164/164 (content graph picks up the three new groups) · test:financials 333/333 · test:macro 72/72 · test:academy 143/143 · check:build ok · dist/ untouched.
- Milestone-specific: every fill answer is produced by running the order through `placeOrder` + `stepBar`; P&L answers by `applyFill` / `unrealizedPnl` / `realizedPnl` / `equity` / `maxDrawdown`; options answers by `summarize` / `payoffPerContract`. The test recomputes all 50 numeric answers with plain arithmetic. Ids unique across every Learn bank, unit quiz and options check; letters A 17 · B 16 · C 16 · D 14; glossary chips resolve; no banned or Greeks wording.
- Decision: no AppChrome nav item. The header nav is a fixed six-item set (Home, Learn, Charts, Cases, Coach, Playbooks); the Academy is reached from the Home placement and Today cards, the Training card (BA10.M4) and unit chips, per the BA10.M1 "else a Training card" rule.
- Next: BA10.M4.S1 (coach session first-paper-trade, Training card, Home tip).

### 2026-10-22 01:15 PT · BA10.M4 · PASS (one local commit)
- Changed: src/lib/coaching/sessions/first-paper-trade.ts (new: dip entry → buy limit, size from the stop, stop placed with the entry, gap through the stop fills at the open; every wrong turn rewinds) + sessions/index.ts (registered); coaching.test.ts (+1 case: validator accepts it and `listSessions` lists it); src/lib/academy/homeTip.ts + components/academy/AcademyHomeTip.tsx (new; Dashboard line under the Macro tip); components/academy/AcademyTrainingCard.tsx (new; Training page after the Macro card; the three Academy quiz groups also highlighted in the group picker); components/QuizModal.tsx (+3 lines: an Academy-specific line in the no-chart "Literacy" box instead of "Equities vocabulary drill"); integration.render.test.tsx (new).
- Verify: lint 0 · test:coaching 25/25 · test:lib 164/164 · test:financials 333/333 · test:macro 72/72 · test:academy 146/146 · check:build ok · dist/ untouched.
- Screenshots (checkpoints/): ba10-training-card.png, ba10-coach-first-paper-trade.png, ba10-home-tip.png, ba10-learn-orders-fills.png.
- Next: BA10.M5.S1 (docs + floors audit).


### 2026-10-21 22:40 PT · BA10.M5.S1 (part 1: floors) · PASS (one local commit)
- Changed: src/lib/academy/floors.test.ts (new). It counts every charter §7.3 floor from live data and the engine, and prints a `FLOORS` line.
- Verify: lint 0 · test:coaching 25/25 · test:lib 164/164 · test:financials 333/333 · test:macro 72/72 · test:academy 154/154 · check:build ok · dist/ untouched.

**Charter floor audit (from the floors.test.ts FLOORS line)**

| Floor (CHARTER §7.3) | Required | Counted | Met |
|---|---|---|---|
| Levels / courses / units | ≥ 8 levels, ≥ 40 units; 3–6 cards, 3–5 quiz items, ≥ 1 resolved link per unit | 8 levels · 10 courses · 43 units, every unit within bounds | yes |
| Placement | 10–12 items, ≥ 4 start levels | 12 items · 5 start levels (L0–L4) | yes |
| Paper engine | 5 types × buy/sell × Day/GTC; ≥ 30 validation cases | 20/20 combinations tested; 42 validation cases | yes, with one note: a buy trailing stop is rejected (`TRAIL_BUY_NOT_SUPPORTED`), because EPICS BA4 makes trailing stops sell-only in v1 and leaves the buy-side mirror to stretch |
| Challenges | ≥ 10 across ≥ 4 themes | 10 · 5 themes | yes |
| Badges | ≥ 20, all reachable | 24 · 24 reached by the scripted learner | yes |
| Options ladder | 4 levels, ≥ 8 checks per level, payoff math per strategy | 4 levels · 8/8/8/8 · 13 strategies | yes |
| Glossary + Learn | ≥ 25 terms, ≥ 60 questions | 30 terms · 63 questions | yes |

- Next: BA10.M5.S1 part 2 (AGENTS_CODE_REFERENCE*, QA_User_Flows, LOOPS/README row).

### 2026-10-21 22:50 PT · BA10.M5.S1 (part 2: docs) · PASS (one local commit)
- Changed: AGENTS_CODE_REFERENCE.md (project status, `/academy` + `/paper` routes, `academy/` in the file tree, `test:academy` in scripts), AGENTS_CODE_REFERENCE-training.md (Academy quiz groups bullet + a Beginner Academy section), QA_User_Flows.md (UF-21 placement → unit → Today, UF-22 paper / challenges / options ladder, matrix row G18), LOOPS/README.md (project row status).
- Next: none in the core. Charter §7 item 4 (human sign-offs) is open: BA1.M4, BA3.M4, BA5.M4, BA7.M5, BA8.M4. BA11 is not started because the "Stretch BA11 approval" row above has no line.

### 2026-10-21 23:05 PT · Sign-offs recorded · DONE
- Weng signed off all five checkpoints (BA1.M4, BA3.M4, BA5.M4, BA7.M5, BA8.M4) and approved BA11 on 2026-10-21. The table above, EPICS boxes and STORIES rows are synced; the checkpoint entries' headings now read SIGNED OFF.
- Next: BA11.M1.S1 (bracket / OCO / OTO orders).


### 2026-10-21 23:10 PT · BA11 plan · decisions (approved stretch; EPICS gives one line per milestone, so the textbook default is used and written down here)
- M1 bracket / OCO / OTO: `linked.ts` places an OTO bracket (buy entry → sell stop and / or sell limit target, the two exits an OCO pair) and an OCO pair of sells on held shares. Exits wait until the entry fills and start working on the next bar; if the entry expires / is cancelled / rejected, the exits are cancelled. When one OCO order fills the other is cancelled. If one bar touches both the stop and the target, the stop is assumed to fill first (the conservative bar-data convention, because the bar does not show which came first).
- M2 short selling: off unless the session turns it on. Short sale proceeds go to cash, Reg T style 50% initial margin is held back as a reservation, buy-to-cover closes it, realised P&L = (short price − cover price) × shares. Loss has no ceiling: warnings on the ticket and in the explainer. No borrow fees and no forced buy-ins in the simulator (named in the explainer).
- M3 fractional + dollar orders: off unless the session turns it on; shares to 4 decimals, market buys by dollar amount (shares = amount ÷ fill price, rounded down to 4 decimals), money still in whole cents.
- M4 fees / slippage: off by default (D4 unchanged); optional per-order fee and slippage in basis points, applied at the fill (buys pay more, sells receive less, rounded to the cent), plus a "cost of trading" explainer computed from the same function.
- M5 trade journal: one note per fill, saved with the paper store, CSV export (RFC 4180 quoting).
- M6 multiple portfolios: up to 5 named paper portfolios, each with its own session; the existing single session migrates into "Main".

### 2026-10-21 · BA11.M1 Bracket / OCO / OTO · done
- Engine: `paper/linked.ts` (`validateBracket`, `placeBracket`, `validateOco`, `placeOco`); `engine.ts` skips waiting children and orders activated on the current bar, wakes a filled entry's exits for the next bar, cancels OCO partners on a fill and cancels waiting exits when the entry expires / is cancelled / is rejected. Session actions `bracket` and `oco` replay deterministically.
- Ticket: buys on the free paper page (`allowBracket`) get "Attach a stop and / or target"; exits are validated (stop below / target above the entry reference) and the preview explains OTO + OCO in plain words. Open orders tag "waits for its entry to fill" / "OCO". Challenges do not offer brackets (their rules are unchanged).
- Tests: `paper/linked.test.ts` (8: target fill cancels stop, stop fill cancels target, same-bar stop-first, expiry and cancel cascade, OTO with one exit counts as stop-protected, validation codes, OCO pair + OCO_NOT_SELLS, session replay) and one render test in `paperPage.render.test.tsx`.
- Screenshots: checkpoints/ba11-bracket-ticket.png, ba11-bracket-invalid.png, ba11-bracket-oco-working.png, ba11-bracket-target-filled.png.
- Next: BA11.M2.S1 (short selling + margin explainer).

### 2026-10-21 · BA11.M2 Short selling + margin explainer · done
- Session option `allowShort` (setup step 3, off by default; core sessions carry no `options` key and behave exactly as before).
- Account: shorts are negative positions with costBasis −proceeds; buying power = cash − reservations − (short value × 1.5); `marginCall` when equity < 30% of the short value (warning only). `applyFill` never flips long ↔ short.
- Validation: short sale reserves ceil(qty × ref × 1.05 × 50%); codes SHORT_TRAIL_NOT_SUPPORTED, COVER_EXCEEDS_SHORT; warning SHORT_SALE_RISK (unlimited loss, gap past a buy stop). Engine: short fills need a flat / short position and margin at the fill; any buy that fills against a short covers it (positions net, never flip); a long exit after the long closed is still cancelled, never turned into a short.
- Stats: round trips carry `direction`; a short's protective stop is a buy stop; R uses stop − entry. Exposure is gross (|short value|).
- UI: ticket labels "Sell short" / "Buy to cover" and a short-sale sentence; positions show "−40 (short)"; MarginPanel explains borrow, unlimited risk, Reg T 50% / 30% maintenance with live numbers, and states the simplifications (no borrow fee, no buy-in).
- Tests: `paper/short.test.ts` (7) + one render test. Screenshots: ba11-short-setup-option.png, ba11-short-ticket.png, ba11-short-session-margin.png.
- Next: BA11.M3.S1 (fractional shares + dollar-amount orders).

### 2026-10-21 · BA11.M3 Fractional shares + dollar-amount orders · done
- Session option `fractional` (setup step 3, off by default). Quantities to 4 decimals (`q4`, `isQ4`); money stays integer cents with `notionalOf = round(qty × price)`; whole-share sessions are unchanged (exact integers).
- Dollar-amount orders: `OrderSpec.amount` (cents) on market buys only; reservation = the amount; at the fill qty = floor(amount ÷ open) to 4 decimals, so it never spends more than the amount. Bracket exits take the entry's actual filled quantity.
- Codes: QTY_TOO_PRECISE, FRACTIONAL_SHORT (fractional shares cannot be sold short), DOLLAR_NEEDS_FRACTIONAL, DOLLAR_BUY_MARKET_ONLY, DOLLAR_AMOUNT_RANGE (min $1.00).
- Ticket: Shares / Dollars toggle on market buys in fractional sessions; preview explains the rounding and the share estimate. Labels read "Buy $500.00 of TRWL.S".
- Tests: `paper/fractional.test.ts` (5) + one render test. Screenshots: ba11-fractional-dollar-ticket.png, ba11-fractional-session.png.
- Next: BA11.M4.S1 (fees / slippage toggle + cost-of-trading explainer).

### 2026-10-21 · BA11.M4 Fees / slippage toggle + cost of trading · done
- Session options `feeCents` (none / $0.50 / $1 / $5 per fill) and `slippageBps` (none / 5 / 10 / 25) on setup step 3; 0 = off and no `options` key.
- Engine: `slipped()` moves market, stop and trailing-stop fills against you (buys ceil, sells floor); limit and stop-limit fills never slip past the limit. Each fill records `fee`, `slippage` (cents) and `rawPrice`. Buy reservations and the fill-time cash check include the fee; a dollar-amount buy spends at most its amount, fee included.
- Accounting (textbook cost basis): the fee is added to a buy's cost basis and taken from a sale's proceeds, so realised P&L is net of costs and realised + unrealised = total P&L still holds.
- UI: CostPanel (fixed fee vs trade size, slippage, round-trip break-even on a $1,000 trade, net P&L note, totals paid); ticket's estimate shows the fee; the session footnote says costs are on.
- Tests: `paper/costs.test.ts` (5) + one render test. Screenshots: ba11-costs-setup.png, ba11-costs-session.png.
- Next: BA11.M5.S1 (trade journal + CSV export).

### 2026-10-21 · BA11.M5 Trade journal + CSV export · done
- `paper/journal.ts`: `journalRows` (one row per fill: bar, action incl. Sell short / Buy to cover, order type + TIF, shares, price, fee, realised P&L, note), `journalCsv` (RFC 4180: CRLF lines, fields with comma / quote / CR / LF quoted, quotes doubled; every row labelled "SIMULATED (SAMPLE tape)"), `sessionNote` (trimmed, max 500 chars, empty clears), `journalFileName`.
- Notes live in `PaperSessionLog.notes` keyed by order id; they are not actions, so the replay is unchanged (tested).
- UI: JournalPanel on the free paper page (not in challenges) with a note box per fill (saved on blur) and Export CSV (Blob download).
- Tests: `paper/journal.test.ts` (3, including a parse-back of the export) + one render test. Screenshot: ba11-journal.png; sample export: checkpoints/ba11-journal-export.csv.
- Next: BA11.M6.S1 (multiple paper portfolios).

### 2026-10-21 · BA11.M6 Multiple paper portfolios · done
- `PaperStore` gains `portfolio` (the active one; its session stays in `session`, so every existing reader is unchanged) and `otherPortfolios` (inactive ones with their own sessions). Additive migration, schemaVersion unchanged: a store from before M6 becomes the single portfolio "Main" with its session, attempts and stats intact (tested).
- `paper/portfolios.ts`: list / create (becomes active, starts empty) / switch / rename / delete (inactive only); names trimmed, 1–24 chars, unique case-insensitive; at most 5. Badge counters (`totalCounters`) now add every portfolio's session.
- UI: PortfolioBar on /paper (chips with equity or "not started", Add, × with a confirm on inactive ones, inline errors).
- Tests: `paper/portfolios.test.ts` (4) + one render test. Screenshots: ba11-portfolios-bar.png, ba11-portfolios-switched.png, ba11-portfolios-create.png (duplicate-name error).
- BA11 complete (M1–M6). Next: none in the Beginner Academy plan.
