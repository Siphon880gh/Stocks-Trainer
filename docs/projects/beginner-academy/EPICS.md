# Epics & Milestones: Beginner Academy

Charter: [`CHARTER.md`](./CHARTER.md) · Research: [`RESEARCH.md`](./RESEARCH.md) · Stories: [`STORIES.md`](./STORIES.md) · Progress: [`PROGRESS.md`](./PROGRESS.md) · Loop: [`LOOP-Beginner-Academy.md`](./LOOP-Beginner-Academy.md)

**Status key:** `[ ]` todo · `[~]` in progress · `[x]` done · `[!]` blocked (see PROGRESS.md). The loop flips the box on the milestone heading line and appends a PROGRESS.md entry.

**Every milestone's verification includes the base gate** (abbreviated **BASE** below):
`npm run lint` · `npm run test:coaching` · `npm run test:lib` (= `src/lib/*.test.{ts,tsx}`) · `npm run test:financials` · `npm run test:macro` · `npm run test:academy` (after BA0.M1 adds it) · `npx vite build --outDir /tmp/st-build-check-academy --emptyOutDir` then `rm -rf /tmp/st-build-check-academy` · `git status --short dist/` empty.

Tests named per milestone live in `src/lib/academy/**/*.test.{ts,tsx}` (node:test via tsx; render tests use `react-dom/server`) and stay in the repo.

**Audit** of what already exists and the broker-pattern mapping: [`RESEARCH.md` → Mapping](./RESEARCH.md#mapping-broker-pattern--existing-app-feature--gap--epic).

---

## BA0 — Foundations (types, storage, refs, test harness)

### [x] BA0.M1 — Types + `test:academy` script
- **Build:** `src/lib/academy/types.ts` (`Level`, `Course`, `Unit`, `LessonCard`, `UnitQuizItem`, `ContentRef`, `PlacementItem`, `Badge`, `PointsEvent`); `package.json` script `"test:academy": "tsx --test \"src/lib/academy/**/*.test.{ts,tsx}\""`.
- **Accept:** types compile; `ContentRef` is a discriminated union (`quiz` / `glossary` / `coach` / `practice` / `case` / `macro` / `route`).
- **Verify:** BASE + a deliberately failing dummy test proves the glob picks files up, then is deleted (logged in PROGRESS.md).

### [x] BA0.M2 — Content-ref resolver
- **Build:** `src/lib/academy/refs.ts`: `resolveRef(ref)` → `{ ok, href, label }` using the real registries (`QUIZ_GROUPS`, `LITERACY_TERMS`, `listSessions()`, `MISC_PRACTICE_ITEMS` + practice routes, case ids, macro lesson ids, `App.tsx` route list mirrored in a constant).
- **Accept:** unknown ids return `ok: false` with a reason; known ids return the same href the app uses today.
- **Verify:** BASE + `refs.test.ts` (one good + one broken ref per kind; route constant ⊇ every `<Route path>` in `App.tsx`, parsed from source).

### [x] BA0.M3 — Storage + migrations
- **Build:** `src/lib/academy/storage.ts` with the three keys (`analysis_core_academy_v1`, `analysis_core_academy_paper_v1`, `analysis_core_academy_rewards_v1`), injectable `KVStorage` (pattern from `macro/macroProgress.ts`), `schemaVersion`, `migrate(raw)`, corruption recovery to empty state with a message.
- **Accept:** never reads or writes `analysis_core_progress_v1`; v0 (missing fields) → v1 migration is lossless; corrupted JSON → empty state, `recovered: true`.
- **Verify:** BASE + `storage.test.ts` (round-trip, migration fixtures, corruption, a spy storage proving no foreign keys are touched).

---

## BA1 — Course map (levels → courses → units)

### [x] BA1.M1 — Level + course skeleton
- **Build:** `src/lib/academy/content/levels.ts`: L0 Orientation (how markets / the app work, risk, simulated vs real) · L1 Stock basics · L2 Charts & candles · L3 Orders, sizing & risk · L4 Company fundamentals & earnings · L5 Macro & rates · L6 Options education · L7 Other markets (ETFs, crypto, futures, forex). Each level ≥ 1 course; each course has an ordered unit list (ids only at this point).
- **Accept:** 8 levels; ids unique, kebab-case; order is a DAG (prerequisites point backwards only).
- **Verify:** BASE + `levels.test.ts` (uniqueness, DAG/no cycles, every level reachable from L0).

### [x] BA1.M2 — Units L0–L3 (orientation → orders & risk)
- **Build:** ≥ 22 units, each 3–6 original lesson cards (title, ≤ 120-word body, optional chart key or glossary chip), `estMinutes ≤ 5`, ≥ 1 `ContentRef` into existing content (e.g. L2 units → `quiz:candle-reading`, `practice:/practice/hunt`; L3 → `glossary:market-order-vs-limit`, sibling trade-management terms when present, `practice:/practice/plan`).
- **Accept:** card word limits hold; every ref resolves; every unit names its learning objective in one sentence.
- **Verify:** BASE + `units.test.ts` (counts, word limits, `estMinutes` computed from words at 200 wpm ≤ 5, refs resolve, no duplicate card text across units, banned-phrase list: broker names / "guaranteed" / "risk-free profit").

### [x] BA1.M3 — Units L4–L7 (fundamentals → other markets)
- **Build:** ≥ 18 units linking to Statements Lab, Read the Print, Mark the Band, earnings cases, Macro Desk lessons, yield-curve explorer, options-literacy, crypto/futures/forex literacy groups and coach sessions.
- **Accept / Verify:** as BA1.M2; plus every existing major surface (Learn group families, Coach, Cases, Practice labs, Macro Desk, financials routes, Buy or Sell) is referenced by ≥ 1 unit (coverage test lists any orphan surface).

### [x] BA1.M4 — 🔍 HUMAN CHECKPOINT: curriculum map review
- **Build:** loop renders the course map + 3 sample units (static HTML / screenshots into `checkpoints/`), writes the level → unit outline into PROGRESS.md.
- **Accept:** Weng signs off order, naming and level boundaries (CHECKPOINT_MODE=continue: log PENDING and keep going).
- **Verify:** artefacts exist; outline count equals data count.

---

## BA2 — Unit player + unit quiz

### [x] BA2.M1 — Unit quiz bank
- **Build:** `src/lib/academy/content/unitQuizzes.ts`: 3–5 original items per unit (ids `BA-<unit>-NN`), options A–D/E, `explanation`, per-wrong-option `feedback`, optional `glossaryTermId`.
- **Accept:** ids unique across **all** banks (quizData, financials, macro, academy); answers exist in options; no answer letter > 35% per level; each explanation cites a fact present in the unit's cards.
- **Verify:** BASE + `unitQuizzes.test.ts` (cross-bank uniqueness by importing the existing banks, letter balance, citation check via keyword overlap list per item).

### [x] BA2.M2 — Unit player component
- **Build:** `components/academy/UnitPlayer.tsx`: card stepper (prev/next, progress dots), "open in app" chips from resolved refs, then the unit quiz (reuse `QuizModal` rendering conventions; correct answer + explanation shown after submit), mastery result (≥ 80% = mastered; retry shuffles option order deterministically).
- **Accept:** pre-submit markup never contains the explanation or the correct-answer marker; mastery math is pure (`scoreUnit`).
- **Verify:** BASE + `unitPlayer.render.test.tsx` (leak test, chips link to resolved hrefs) + `mastery.test.ts`.

### [x] BA2.M3 — Course progress model
- **Build:** `src/lib/academy/progress.ts`: unit status (`locked` / `available` / `in_progress` / `mastered`), course % , level %, `nextUnit()`, test-out marking, persisted via BA0.M3.
- **Accept:** unlock = prerequisites mastered or tested-out; progress never decreases on a worse retry (best score kept).
- **Verify:** BASE + `progress.test.ts` (scripted learner walks L0→L1; retry-worse keeps best; test-out unlocks the level's units).

---

## BA3 — Placement check + test-out

### [x] BA3.M1 — Placement bank + routing
- **Build:** `src/lib/academy/placement.ts`: 10–12 original items tagged by level; `routePlacement(answers)` → start level + "review" suggestions; "I'm brand new" skip → L0.
- **Accept:** routing is monotone (more correct never routes lower); ≥ 4 distinct start levels reachable; all-wrong → L0; all-right → L4 (not past fundamentals — options/other markets always need their own test-out).
- **Verify:** BASE + `placement.test.ts` (exhaustive score-vector table, monotonicity property over all 2^n vectors for n ≤ 12, reachability).

### [x] BA3.M2 — Per-level test-out quizzes
- **Build:** each level L1–L7 has a 6–8 item test-out drawn from its units' items (deterministic sample); pass ≥ 85% marks the level's units `tested-out`.
- **Accept:** test-out never awards unit mastery points (only a single test-out award); failing shows the weakest units.
- **Verify:** BASE + `testOut.test.ts`.

### [x] BA3.M3 — Placement UI + first-run hook
- **Build:** `components/academy/PlacementCard.tsx`, shown on `/academy` and as an optional card after GoalPicker confirmation (decision D2). Minimal additive edit in `Dashboard.tsx`.
- **Accept:** existing first-run flow unchanged when the card is dismissed; `pathConfirmed` untouched.
- **Verify:** BASE + render test + a test asserting `confirmPathSelection` behaviour is unchanged (import + call on a fake storage).

### [x] BA3.M4 — 🔍 HUMAN CHECKPOINT: placement routing review
- **Build:** screenshots of the card + a routing table (score bands → level) in PROGRESS.md.
- **Accept:** Weng signs off the bands (logged PENDING under CHECKPOINT_MODE=continue).

---

## BA4 — Paper-trading engine (pure, no UI)

Fill rules (test-locked, documented in `paper/README` doc comment):
- Orders placed after bar *t* closes are evaluated from bar *t+1*.
- **Market:** fills at bar open.
- **Buy limit L:** fills at `min(open, L)` if `low ≤ L`. **Sell limit L:** fills at `max(open, L)` if `high ≥ L`.
- **Buy stop S:** triggers if `high ≥ S`; fills at `max(open, S)` (gap-through fills at the open). **Sell stop S:** triggers if `low ≤ S`; fills at `min(open, S)`.
- **Stop-limit (S, L):** triggers like a stop, then becomes a limit at L from the trigger bar onward; if the trigger bar gaps past L it may not fill (teach this).
- **Trailing stop (sell, amount `a` or percent `p`):** stop = `peakHigh − a` (or `peakHigh × (1 − p)`), ratchets up only, evaluated with the stop rule; buy-side mirror for covering in stretch.
- **TIF:** Day = cancel at the end of the bar it was placed for (one bar = one session in v1); GTC = until filled or cancelled.
- Money in integer cents, shares integer; fees 0 (D4).

### [x] BA4.M1 — Account + ledger model
- **Build:** `src/lib/academy/paper/account.ts`: `createAccount(startingCash)`, presets, `reset()`, cash, positions (qty, avg cost), realised P&L, history.
- **Accept:** invariants: `equity = cash + Σ qty × mark`; `cash + reserved ≥ 0`; avg cost updates only on buys; realised P&L on sells = (fill − avg) × qty.
- **Verify:** BASE + `account.test.ts` (hand-computed sequences; property test over seeded random fill sequences preserving the invariants).

### [x] BA4.M2 — Order validation
- **Build:** `paper/validate.ts`: rejects qty ≤ 0 / non-integer, unknown symbol, sell > position (no shorting in v1), buy cost > buying power (market uses last close × qty × 1.0 + buffer rule documented), limit/stop ≤ 0, stop-limit with L on the wrong side, trailing amount/percent out of range; warns (not rejects) for marketable limits and buy stops below market.
- **Accept:** each rule has a stable error code + plain-language message.
- **Verify:** BASE + `validate.test.ts` (≥ 30 table cases, one per code + boundary values).

### [x] BA4.M3 — Matching engine for all order types
- **Build:** `paper/engine.ts`: `stepBar(state, bar)` applies the fill rules above; buying-power reservation for open buy orders; cancel / replace.
- **Accept:** every order type × side × TIF combination has a hand-built tape test incl. gap-up/gap-down cases; trailing-stop ratchet never moves down; stop-limit gap-through-no-fill case exists.
- **Verify:** BASE + `engine.test.ts` + invariant property test (cash conservation: Σ fills reconcile cash; no negative position; reserved BP released on cancel/fill/expire).

### [x] BA4.M4 — P&L + performance stats
- **Build:** `paper/stats.ts`: unrealised / realised / total P&L, symbol vs account P&L, equity curve per bar, max drawdown, win rate, average R (when a stop existed at entry), exposure %.
- **Accept:** every stat has a doc-comment formula; empty account returns zeros / `null` where undefined.
- **Verify:** BASE + `stats.test.ts` (hand-computed fixtures, drawdown on a known curve, R computation).

### [x] BA4.M5 — Tapes + symbol catalogue
- **Build:** `paper/tapes.ts`: ≥ 8 SAMPLE symbols (`.S` suffix) reusing/deriving from `samplePacks.ts` / `scenarioCharts.ts` series (trend up, trend down, range, gap up, gap down, earnings-style jump, choppy, slow grind) with metadata for lessons.
- **Accept:** valid OHLC (low ≤ open/close ≤ high), no flat bars, each tape ≥ 60 bars, names pass the real-ticker blocklist used by the financials project.
- **Verify:** BASE + `tapes.test.ts`.

---

## BA5 — Paper-trading UI

### [x] BA5.M1 — Order ticket
- **Build:** `components/academy/paper/OrderTicket.tsx`: side, qty, type, price fields per type, TIF, live validation messages, and a **plain-language preview** ("If price trades at or below $X, buy up to N shares at $X or better…"), estimated cost vs buying power. SIMULATED banner + simulated accent.
- **Accept:** preview text is generated from the order object (pure `describeOrder`), not hand-written per type.
- **Verify:** BASE + `describeOrder.test.ts` (every type/side) + render test (banner present, invalid order disables submit).

### [x] BA5.M2 — Positions, orders, history, equity curve
- **Build:** `PositionsTable`, `OpenOrders` (cancel), `OrderHistory` (filled / cancelled / expired / rejected with reason), `EquityCurve` (existing chart components), account summary (cash, buying power, equity, day + total P&L).
- **Verify:** BASE + render tests asserting numbers equal `stats.ts` outputs for a fixture session.

### [x] BA5.M3 — Paper page with bar-replay stepping
- **Build:** route `/paper` (`pages/academy/Paper.tsx`): pick tape + starting cash, step / auto-step bars, chart with order lines (entry, stop, limit, trailing level that moves), reset; persisted session via `analysis_core_academy_paper_v1`.
- **Accept:** future bars never render before stepping (no-leak test); reload restores the session.
- **Verify:** BASE + `paperPage.render.test.tsx` (leak test, restore from fake storage).

### [x] BA5.M4 — 🔍 HUMAN CHECKPOINT: paper UI visual + order-preview wording
- **Build:** screenshots (desktop + mobile) of ticket for each type, a trailing stop ratcheting over 3 steps, a stop-limit gap no-fill, history with a rejection.
- **Accept:** Weng signs off (PENDING logged; loop continues).

---

## BA6 — Paper-trading challenges

### [x] BA6.M1 — Challenge model + scoring
- **Build:** `src/lib/academy/challenges.ts`: `Challenge { id, tapeId, startingCash, allowedOrderTypes, rules[], goals[], bars }`, rule checks (max position %, stop required within N bars of entry, max drawdown, no averaging down, min trades), `scoreChallenge(session)` = discipline points + return points (discipline ≥ 50% of max).
- **Accept:** scoring is pure and documented; a rule breach is reported with the bar index.
- **Verify:** BASE + `challenges.test.ts` (scripted sessions per rule: pass, breach, edge).

### [x] BA6.M2 — ≥ 10 challenges across ≥ 4 themes
- **Build:** themes: order mechanics (fill a limit below market; protect with a stop), trailing stops (ride a trend), risk (keep drawdown < X), patience (wait-for-signal on a range tape), earnings gap (stop gapped through). Each with an intro card + debrief.
- **Accept:** every challenge is solvable — a scripted "reference play" passes all rules and achieves ≥ 1 goal; a scripted "reckless play" breaches ≥ 1 rule.
- **Verify:** BASE + `challengeSolvability.test.ts`.

### [x] BA6.M3 — Local leaderboard + benchmarks
- **Build:** fictional benchmark entries per challenge (generated from scripted plays, names obviously fictional, labelled "benchmark"), learner's best attempts, rank.
- **Accept:** no network; rank math correct incl. ties; learner data stays on the paper key.
- **Verify:** BASE + `leaderboard.test.ts`.

### [x] BA6.M4 — Challenges UI + weekly rotation
- **Build:** `/paper/challenges` list + play view (reuses BA5 components), "challenge of the week" chosen by ISO week (deterministic).
- **Verify:** BASE + render test + rotation test (same week → same id, all challenges appear within N weeks).

---

## BA7 — Rewards: points, badges, levels, daily streak (virtual only)

### [x] BA7.M1 — Points ledger
- **Build:** `src/lib/academy/rewards/ledger.ts`: append-only events (`unit-mastered`, `test-out`, `challenge-passed`, `first-order`, `daily-goal`, `options-level`), idempotency key per event, point table constants, total + by-source.
- **Accept:** awarding the same key twice is a no-op; retrying a unit with a better score awards only the delta up to the cap; no API to spend or redeem.
- **Verify:** BASE + `ledger.test.ts`.

### [x] BA7.M2 — Daily streak + levels
- **Build:** `rewards/streak.ts` (local calendar day, injectable clock, one "freeze" per 7 days earned by activity), `rewards/levels.ts` (XP → level thresholds).
- **Accept:** DST / midnight boundaries correct for America/Los_Angeles and UTC test clocks; a missed day resets unless a freeze is available.
- **Verify:** BASE + `streak.test.ts` (fixed clocks across DST changes) + `levels.test.ts`.

### [x] BA7.M3 — ≥ 20 badges
- **Build:** `rewards/badges.ts`: predicate per badge over academy + paper + rewards state (e.g. first unit, a level mastered, first limit fill, first trailing-stop exit, used a stop on 5 trades, 7-day streak, all options L1 checks…). Original names and icons (Material Symbols).
- **Accept:** every badge is reachable by a scripted test learner; badges are never revoked.
- **Verify:** BASE + `badges.test.ts` (scripted learner earns all; a fresh learner earns none).

### [x] BA7.M4 — Retro-credit from existing progress (read-only)
- **Build:** `rewards/retro.ts` reads `analysis_core_progress_v1` (milestones, coachingCompleted, drillFlags) and the macro / Read-the-Print keys to award one-time catch-up points.
- **Accept:** never writes those keys; idempotent; missing/corrupt foreign keys → no award, no crash.
- **Verify:** BASE + `retro.test.ts` (spy storage asserts zero writes to foreign keys).

### [x] BA7.M5 — Rewards UI + 🔍 HUMAN CHECKPOINT: rewards feel
- **Build:** `components/academy/RewardsPanel.tsx` (points, level bar, streak, badge grid with locked hints), toast on award. Screenshots into `checkpoints/`.
- **Accept:** copy says points are virtual and not redeemable; Weng signs off point values / badge list (PENDING logged; loop continues).
- **Verify:** BASE + render test (disclaimer present, locked badges show hint not predicate code).

---

## BA8 — Options knowledge ladder (education gating)

### [x] BA8.M1 — Ladder + payoff math
- **Build:** `src/lib/academy/options/ladder.ts`: L1 covered call, buy-write, cash-secured put · L2 long call, long put, protective put, collar · L3 vertical debit / credit spreads, iron condor, butterfly · L4 naked call / put (concept-only, "highest risk"). `options/payoff.ts`: payoff at expiry, max gain, max loss (incl. `Infinity` for naked call), breakevens, given strike(s) + premium(s) (decision D1).
- **Accept:** formulas documented; per-share and per-contract (×100) both exposed.
- **Verify:** BASE + `payoff.test.ts` (hand-computed table per strategy; property: payoff(S) piecewise linear with kinks only at strikes; max loss/gain equal the min/max over a dense price grid within tolerance 0).

### [x] BA8.M2 — Knowledge checks + gating
- **Build:** ≥ 8 original items per level (ids `BA-OPT-L<n>-NN`), pass ≥ 80%, **max 3 attempts per rolling 24 h** (injectable clock), risk acknowledgement checkbox required before each level's check; L(n) requires L(n−1) passed.
- **Accept:** gating is pure (`canAttempt`, `isLevelUnlocked`); numeric answers are recomputed from `payoff.ts`.
- **Verify:** BASE + `optionsGate.test.ts` (attempt window edges, ordering, numeric recompute).

### [x] BA8.M3 — Ladder UI + payoff chart
- **Build:** `components/academy/options/OptionsLadder.tsx` + `PayoffChart.tsx` (SVG, not a chain), lesson cards per level linking to existing `options-literacy` / options coach sessions.
- **Accept:** every surface shows the options risk statement; no chain, no Greeks wording.
- **Verify:** BASE + render tests (risk statement, locked state, chart points equal `payoff.ts` samples) + grep test that academy options files contain none of `delta|gamma|theta|vega|implied volatility surface|option chain`.

### [x] BA8.M4 — 🔍 HUMAN CHECKPOINT: options accuracy + gating feel
- **Build:** screenshots + the strategy table with max gain / loss / breakeven per strategy in PROGRESS.md.
- **Accept:** Weng signs off (PENDING logged; loop continues). Any doubt on a formula = STOP (a), not a guess.

---

## BA9 — "Today" daily-habit card

### [x] BA9.M1 — Daily picker
- **Build:** `src/lib/academy/today.ts`: from the local date pick (deterministic hash) the next unit, one review question from mastered units (spaced: oldest-mastered first), one glossary term, one challenge-of-the-week link.
- **Accept:** same date → same picks; no repeat of the review question within 7 days when the pool allows.
- **Verify:** BASE + `today.test.ts` (fixed clocks).

### [x] BA9.M2 — Today card on Home + Academy
- **Build:** `components/academy/TodayCard.tsx`; minimal additive edit in `Dashboard.tsx`; completing the daily question counts as the streak's daily activity.
- **Verify:** BASE + render test + streak integration test.

---

## BA10 — Integration, glossary, Learn groups, coach, docs

### [x] BA10.M1 — Academy hub route
- **Build:** `/academy` (`pages/academy/AcademyHub.tsx`): level map, continue button (`nextUnit`), placement card, rewards panel, links to `/paper` and `/paper/challenges`; `/academy/:unitId` unit route. Additive edits: `App.tsx` routes, `AppChrome` nav item (if the nav pattern allows; else a Training card — check convention first).
- **Verify:** BASE + route test (BA0.M2 route constant updated; every academy href resolves).

### [x] BA10.M2 — Glossary terms (≥ 25)
- **Build:** `src/lib/academy/terms.ts` (`ACADEMY_TERMS`, spread into `LITERACY_TERMS` like `FINANCIAL_TERMS`): market / limit / stop / stop-limit / trailing stop / time in force / day order / GTC / buying power / cost basis / realised vs unrealised P&L / equity / drawdown / position sizing / paper trading / slippage / gap risk / covered call / cash-secured put / protective put / collar / vertical spread / iron condor / assignment / exercise / breakeven. Reuse (link, don't duplicate) any term the sibling trade-management work already added.
- **Accept:** no id collides with existing terms; duplicates of sibling terms are refs, not copies.
- **Verify:** BASE + `terms.test.ts` (uniqueness across `LITERACY_TERMS`, every academy card glossary chip resolves).

### [x] BA10.M3 — Learn quiz groups (≥ 60 new questions total)
- **Build:** groups `orders-and-fills` (`BA-OF-`), `paper-pnl` (`BA-PL-`), `options-ladder` (`BA-OL-`) spread into `QUIZ_GROUPS` after the macro groups (type-only import pattern, `isAcademyQuizGroup` short-circuit). Numeric answers computed by the engine / payoff math.
- **Verify:** BASE + `academyQuiz.test.ts` (recompute numeric answers, ids unique across all banks, letter balance).

### [x] BA10.M4 — Coach session + Training card + Home tip
- **Build:** coach session `first-paper-trade` (deterministic decision graph per `coaching/types.ts`), `AcademyTrainingCard` on Training, a Home tip line.
- **Verify:** BASE (`test:coaching` must include the new session via the existing validator) + render tests.

### [x] BA10.M5 — Docs + final audit
- **Build:** update `AGENTS_CODE_REFERENCE-training.md` (academy section), `AGENTS_CODE_REFERENCE.md` (routes), `QA_User_Flows.md` (academy + paper flows), apply the `LOOPS/README.md` project row, and a charter-floor audit table in PROGRESS.md.
- **Accept:** every charter floor met with counts produced by a test (`floors.test.ts`).
- **Verify:** BASE + `floors.test.ts`.

---

## BA11 — Stretch (only after Weng approves in PROGRESS.md)
- **BA11.M1** Bracket / OCO / OTO orders (engine + ticket).
- **BA11.M2** Short selling + margin explainer (borrow, buy-to-cover, unlimited-risk warnings).
- **BA11.M3** Fractional shares + dollar-amount orders.
- **BA11.M4** Fees / slippage toggle and a "cost of trading" lesson.
- **BA11.M5** Trade journal (notes per fill, export CSV) — a gap reviewers flag in the broker.
- **BA11.M6** Multiple paper portfolios (e.g. separate futures-style practice account).

Each stretch milestone uses the same Build / Accept / Verify discipline; the loop does not start BA11 without a PROGRESS.md approval line.
