# AGENTS_CODE_REFERENCE-training.md

AI feature map: Training quizzes, scoring, Archive reference library.

**Approximate location cues are intentional.** Do not rely on exact line numbers.

**Parent:** [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md)  
**Related:** [`AGENTS_CODE_REFERENCE-charts.md`](./AGENTS_CODE_REFERENCE-charts.md) · [`AGENTS_CODE_REFERENCE-data.md`](./AGENTS_CODE_REFERENCE-data.md)

---

## Scope

| File | ~Lines | Role |
|------|--------|------|
| `src/lib/quizData.ts` | ~279 | Questions, groups, points constants |
| `src/pages/Training.tsx` | ~198 | Quiz launcher + session stats UI |
| `src/components/QuizModal.tsx` | ~320 | Question loop, submit/next, chart preview |
| `src/components/AnswerSheetModal.tsx` | ~162 | Review / jump into questions |
| `src/pages/Archive.tsx` | ~276 | Pattern + indicator library |
| `src/components/PatternDetailModal.tsx` | ~92 | Pattern detail |
| `src/components/IndicatorDetailModal.tsx` | ~93 | Indicator detail |

---

## Quiz data model (`quizData.ts`)

Near the top:
- `PatternId`, `QuizOption`, `QuizQuestion` (`correctAnswer` A–E; optional `patternKey`, `overlayId`, `highlightIndex`).
- Shared option banks: `OPTIONS_3`, `OPTIONS_5`, `INDICATOR_OPTIONS`.

Middle of file:
- `QUIZ_QUESTIONS` — candlestick recognition (uses `patternKey` + often `highlightIndex`).
- `INDICATOR_QUIZ_QUESTIONS` — identify which overlay is shown (`overlayId`).

Near the end:
- `POINTS_PER_CORRECT = 50`, `STREAK_BONUS = 10`. A mapped group completes its milestone only at `QUIZ_PASS_PCT` (70%) or better (progressStore); cases pay `CASE_POINTS` (10 / 5 / 1) once per case.
- `QuizGroupId` / `QUIZ_GROUPS` — path groups (`equity-literacy`, `financial-literacy`, `indicators`, `news-literacy`, `financial-drills`) plus pattern families.
- `CANDLE_READING_QUESTIONS` (`candle-reading`, ids `OC-`) — one-candle reads (price rejected, stability, indecision, strong move). Series are `PATTERN_OHLC["candle-rejected-high"|"candle-rejected-low"|"candle-stable-*"|"candle-indecision-*"|"candle-bulls-win"|"candle-bears-win"]`, marked candle at index 3; glossary ids `wick-rejection`, `full-body-candle`, `indecision-candle`, `strong-move-candle`. Optional `priceMarkers` on a question draws labeled lines (e.g. Open / Close) on the hero chart.
- `PATTERN_BOOK_QUESTIONS` (`candle-pattern-book`, ids `PB-NN`) — reading rules from the candlestick pattern-book lessons (origin, real body, hollow/filled, prior trend, confirmation/invalidation, 50% rules, reversal vs continuation). Family drills for the book's extra patterns live in `QUIZ_QUESTIONS` (ids `PB-MARU-`, `PB-ST-`, `PB-BH-`, `PB-TIO-`, `PB-CA-`, `PB-CONT-`) and are grouped by `patternKeysForGroup`: `doji` (+`spinning-top`), `harami` (+`bearish-harami`), `marubozu`, `three-inside-outside`, `counterattack-on-neck`, `continuation-methods`.
- `src/lib/quizCandleExtras.ts` (type-only import of quiz types, no runtime cycle) — `EXTRA_FAMILY_QUESTIONS` is spread into the end of `QUIZ_QUESTIONS` (ids `PB-DJ-` doji types, `PB-MB-` opening/closing marubozu, `PB-GR-` kickers/abandoned babies/tri-stars, `PB-CS-` crows/three-line strike/breakaway, `PB-GC-` separating & side-by-side lines/gap three methods/bearish mat hold, `PB-NK-` in-neck/thrusting/meeting lines, `PB-IHS-` inverse H&S); `LONG_SHORT_CANDLE_QUESTIONS` (`OC-18`…`OC-22`) is spread into `CANDLE_READING_QUESTIONS`; `PRICE_ACTION_QUESTIONS` (`price-action`, ids `PA-`) and `SUPPLY_DEMAND_QUESTIONS` (`supply-demand`, ids `SD-`) are their own banks. Families added to `patternKeysForGroup`: `doji` (+5 doji types), `marubozu` (+4 opening/closing), `head-shoulders` (+`inverse-head-shoulders`), `counterattack-on-neck` (+`in-neck`, `thrusting`), `continuation-methods` (+7), new `gap-reversals`, `crows-and-strikes`.
- `src/lib/buySellDrill.ts` — `BUY_SELL_QUESTIONS` (`buy-or-sell`, ids `BS-P-<key>` confirmed patterns, `BS-W-` wait cases, `BS-SC-NN` scenario charts). Options are always A Buy / B Sell / C Wait; each wrong option carries `feedback` (shown as "Why not X" after a wrong pick); every explanation starts with the answer and ends with `BUY_SELL_DISCLAIMER`. Charts come from `DRILL_CHART_SPECS` in `ohlcData.ts` (`bs-<key>` = pattern + one confirming candle; `bs-<key>-open` = unconfirmed) and from `scenarioCharts.ts` (`sc-*`, 40–55 bars, seeded generator + pinned structure, `reveal` annotations and `plan` entry/stop/target at 1:2). Training has its own "Buy or Sell?" card below the quiz launcher.
- `src/lib/advancedPatterns.ts` (type-only imports, no runtime cycle) — one `ADVANCED_PATTERNS` table (harami crosses, morning / evening doji star, high-wave, rickshaw man, and the advanced / rare textbook patterns: stick sandwich, homing pigeon, ladder bottom, concealing baby swallow, unique three river bottom, advance block, deliberation, matching low, three stars in the south, identical three crows, takuri line, last engulfing bottom / top, above / below the stomach, bullish / bearish hikkake). It feeds `PATTERNS` (`ADVANCED_PATTERN_DEFS`, incl. triple top / bottom; `rare: true` shows the "Advanced / rare" tag in Archive and the pattern modal), `LITERACY_TERMS` (`ADVANCED_TERMS`, plus `triple-top`, `triple-bottom`, `wedge`, `belt-hold`, `harami-cross`, `doji-star`, `high-wave`, `advanced-rare-patterns`), `PATTERN_OHLC` / `DRILL_CHART_SPECS` (`ADVANCED_OHLC`, `ADVANCED_DRILL_SPECS`), the drill `INFO` table (`ADVANCED_DRILL_INFO`; rare rows say "advanced / rare" in the explanation) and `QUIZ_QUESTIONS` (`ADVANCED_QUESTIONS`: per pattern `-PICK` chart pick, `-NAME`, `-READ`; ids `AR-` rare, `PB-HC-` harami cross, `PB-DS-` doji stars, `PB-HW-` high-wave / rickshaw; plus `AR-CONCEPT-`, and `PB-BELT-` belt hold cross-linked to the opening marubozu). Group `advanced-rare` = `ADVANCED_RARE_KEYS`; the other entries join `harami`, `morning-star`, `evening-star`, `doji` via `familyKeys()`. To add a rare pattern, add one table row (and a rule in the validation script).
- Triple top / bottom and wedges: `scenarioCharts.ts` `sc-triple-top`, `sc-triple-bottom`, `sc-rising-wedge`, `sc-falling-wedge` (wedges carry both lines in `lines`); `PATTERN_OHLC` aliases `triple-top` / `triple-bottom`. Learn questions `PB-TT-`, `PB-TB-`, `PB-WG-R-`, `PB-WG-F-` (in `quizCandleExtras.ts`) join the `double-top`, `double-bottom` (now "Double & Triple Top / Bottom"), `rising-wedge`, `falling-wedge` groups; drill scenarios `BS-SC-14`…`17`.
- Trade management (price-action framework: wait through uncertainty → entry from a defined edge → stop at invalidation → trailing stop → profit target): `PA-18`…`PA-30` in `PRICE_ACTION_QUESTIONS` (`tradeManagementQuestions()`, numbers from scenario `facts`; checked in `src/lib/tradeManagement.test.ts`). Charts: `sc-pullback-entry` (pullback entry; also drill `BS-SC-18`) and `sc-trailing-stop` (Learn only: breakout long, stop raised under HL1–HL3 as a red stair-step, "Reward left" vs "Risk to trailed stop" boxes at the old-high target). Glossary: `no-trade-zone`, `entry-types`, `trailing-stop`, `taking-profit` (after `risk-reward`).
- Price action trading framework (`src/lib/tradeFramework.ts`, type-only import of quiz types): `FRAMEWORK_UNCERTAINTY` (chop `sc-range-middle` vs signal `sc-breakout-retest`), `FRAMEWORK_STEPS` (1 entry `sc-breakout-retest`, 2 stop `sc-stop-hit`, 3 trail `sc-trailing-stop`, 4 target `sc-target-reversal` + lesson-only `TARGET_AFTERMATH`), `FRAMEWORK_DRILLS` and `TRADE_FRAMEWORK_LINKS` feed `/practice/trade-framework` (Misc Practices id `trade-framework`). Learn group `trade-framework` = `TF_QUESTIONS` (`TF-01`…`TF-15`, numbers from scenario `facts`) + the same `PA-18`…`PA-30` objects (floor 24). Cases pack `price-action` (`src/lib/priceActionCases.ts`, thinking mode `price_action_plan`, `contextType: "chart"`, no `milestoneId`), Coach `honor-the-stop`, glossary `price-action-framework`, `stop-loss-invalidation`. Checked in `src/lib/tradeFramework.test.ts`.
- Opening range breakout (`src/lib/openingRange.ts`; runtime import only of the Black-Scholes helpers in `gammaSqueeze.ts`): `ORB_SESSIONS` (five SAMPLE SPY.S 15-minute sessions: wick only, long, short, wide range, failed breakout), `orbPlan()` (range = first `ORB_RANGE_BARS` = 2 candles, entry on the first close outside, stop at the other end, 1:1 target), `ORB_CAVEATS`, `ORB_OPTION_EXAMPLE` (0DTE vs one-month 583 call), `ORB_TERMS`, `ORB_LINKS` feed `/practice/opening-range` (Misc Practices id `opening-range`). `ORB_OHLC` (`orb-*` full and `orb-*-pre` up to the decision candle) is spread into `PATTERN_OHLC`. Learn group `opening-range` = `ORB_QUESTIONS` (`ORB-01`…`ORB-14`, floor 14). `ORB_CASES` (mode `opening_range`) live in `priceActionCases.ts`, pack `price-action`. Coach `opening-range-breakout`. Checked in `openingRange.test.ts` and `openingRangePage.test.tsx`.
- Four pillars (`src/lib/fourPillars.ts`, type-only imports): `FOUR_PILLARS`, `FP_SETUPS`, `FP_MISTAKES`, `FP_TERMS`, `FP_OHLC` (`fp-touches`, `fp-wick-close`), `FP_RELATED` (rendered by the optional `Playbook.related` field). Learn group `four-pillars` = `FP_QUESTIONS` (`FP-01`…`FP-17`, floor 16). `PILLAR_CASES` (mode `four_pillars`) in `priceActionCases.ts`. Playbook `price-action-four-pillars`, Coach `four-pillars`. Checked in `fourPillars.test.ts`.
- Breakout, pullback and fair value gap (`src/lib/fairValueGap.ts`, type-only imports): pure helpers `detectFairValueGaps` (bullish: candle 3 low > candle 1 high; bearish mirror; any overlap = no gap), `breakoutGap`, `firstPullbackInto`, `fvgPlan` (entry at the gap top, stop `FVG_STOP_BUFFER` below the lower of gap bottom and level, 2R example target), `FVG_SESSIONS` (five SAMPLE 5-minute tapes: signal, pullback, no gap, runaway, fail), `FVG_STEPS`, `FVG_CAVEATS`, `FVG_TERMS` (`imbalance`, `fair-value-gap`, `breakout-signal-vs-entry`), Learn `fair-value-gap` (13 `FVG-`), `FVG_LINKS`, Playbook data `FVG_RELATED`, `FVG_CREDIBILITY`, `FVG_PLAYBOOK_SOURCE`. Page `/practice/fair-value-gap`; cases `FVG_CASES` in `priceActionCases.ts` (mode `fair_value_gap`); Coach `breakout-pullback-fvg`. Checked by `fairValueGap.test.ts` + `fairValueGapPage.test.tsx`.
- Question extras: `annotations` (always drawn), `revealAnnotations` (drawn only after submit; use for anything that gives the answer away), `chartSize: "large"` (380px hero + `SCENARIO_PAD_BARS` empty slots on the right). `QuizOption.feedback` is the why-wrong text. After submit, `QuizModal` always shows the correct answer line.
- Financials & earnings groups (`src/lib/financials/quizBanks.ts`, type-only import of quiz types): `statements-reading` (`FIN-ST-`), `cash-forecast-13wk` (`FIN-CF-`), `earnings-preview` (`FIN-EP-`), `earnings-reaction` (`FIN-ER-`). `FINANCIALS_QUIZ_GROUPS` is spread into `QUIZ_GROUPS` right after `financial-drills`; `isFinancialsQuizGroup` short-circuits `getQuestionsForGroup` / `questionsArrayForGroup`. Questions carry an optional `financialsExhibit` (`statement` / `forecast` / `preview` / `reaction`, type in `quizExhibit.ts`) that `QuizModal` renders with `components/financials/FinancialsQuizExhibit.tsx` before the snapshot branch; forecast breach tint / headroom and reaction teaching marks appear only after submit. All numbers are computed from the fixtures; `financialsQuiz.test.ts` recomputes every numeric answer. Training shows `FinancialsTrainingCard` (Read the Print, Statements lab, forecast, group links) above Misc Practices; routes `/practice/read-the-print` and `/practice/statements`.
- Macro forces groups (`src/lib/macro/quiz/banks.ts`, ids in `quiz/groups.ts`): `macro-releases` (`MR-`), `rates-curve` (`RC-`), `fed-policy` (`FP-`), `housing-mortgage` (`HM-`), `macro-reactions` (`MX-`, chart-based). `MACRO_QUIZ_GROUPS` is spread into `QUIZ_GROUPS` after the financials groups; `isMacroQuizGroup` short-circuits `getQuestionsForGroup` / `questionsArrayForGroup`. Questions carry an optional `macroExhibit` (`release` / `reaction` / `curve` / `pmms` / `pricing` / `dots`, type in `quiz/exhibit.ts`) rendered by `components/macro/MacroQuizExhibit.tsx` before the snapshot branch; the "Market read" verdict and reaction-chart outcome / annotations appear only after submit. `MACRO_NUMERIC` lists numeric answers; `macroQuiz.test.ts` recomputes them from raw `WORLD` fields. Training shows `MacroTrainingCard` (Macro Desk, reaction game, group links) under the financials card; `CasePlayer` shows `CaseMacroLink` ("Read the real release" + lesson) for cases in `MACRO_CASE_LESSON_LINKS`.
- Beginner Academy groups (`src/lib/academy/quiz/banks.ts`, ids in `quiz/groups.ts`, type-only import of quiz types): `orders-and-fills` (`BA-OF-`, 22), `paper-pnl` (`BA-PL-`, 20), `options-ladder` (`BA-OL-`, 21). `ACADEMY_QUIZ_GROUPS` is spread into `QUIZ_GROUPS` after the macro groups; `isAcademyQuizGroup` short-circuits `getQuestionsForGroup` / `questionsArrayForGroup`, highlights the groups in the Training picker and gives `QuizModal` an Academy line in the no-chart Literacy box. Fill answers come from running the order through `paper/engine.ts` (`runFill`), P&L answers from `paper/account.ts` / `stats.ts`, options answers from `options/payoff.ts`; `ACADEMY_NUMERIC` lists them and `src/lib/academy/academyQuiz.test.ts` recomputes each by hand. Training shows `components/academy/AcademyTrainingCard.tsx` (Academy, Paper trading, Challenges, Options ladder, coach `first-paper-trade`, group links) under the Macro card.
- `getQuestionsForGroup(groupId)` — dedicated banks for literacy/drills/indicators; `"all"` → full pattern bank; else filter `patternKey === groupId`.
- Index helpers: `getQuestionIndexInGroup`, `getGlobalIndexFromGroup`.

---

## Training page flow

Near the top of `Training.tsx`:
- Reads `?group=` and `?start=1` from search params.
- State: selected group, quiz open; points/streak/accuracy seed from `progressStore`. UI calls the quiz streak "Answer streak" and the Academy one "Day streak" (`src/lib/streakLabels.ts`).
- `start=1` effect opens `QuizModal`.

UI (middle): group picker from `QUIZ_GROUPS`, launch quiz, answer sheet, links to Archive.

Deep link example: `/training?group=indicators&start=1`.

---

## QuizModal flow

Near the top: loads `questions = getQuestionsForGroup(groupId)`.

Submit handler (roughly first third): compare option to `correctAnswer`; update points/streak/accuracy; call `onPointsUpdate`.

Chart preview (middle/lower):
- If question has `overlayId` → `MarketChart` with that overlay enabled, on `overlayQuizBars(question)` (`src/lib/quizChartData.ts`): the tagged `samplePackId` pack's own bars, else `SAMPLE_OHLC`. The caption names the pack. `AnswerSheetModal` uses the same helper.
- Else → `CandlestickChart` with `PATTERN_OHLC[patternKey]` (fallback `SAMPLE_OHLC`) and `highlightIndex`.

Close on last “Next”; reset index when modal opens (`useEffect` near middle).

**Persistence:** `completeMilestoneFromQuiz` writes scores + milestone status to `analysis_core_progress_v1` (E3.M2). Parent `Training` also mirrors PTS in the header.

---

## AnswerSheetModal

Lists questions for the active group; used to review or jump. Ties into Training’s answer-sheet open state.

---

## Archive

Near the top of `Archive.tsx`:
- Tabs: `patterns` | `indicators` | `literacy` (URL `?tab=literacy`).
- Deep-open: `?open=<overlayId>` or a literacy term id.
- Filters: pattern sentiment (bullish/bearish/neutral) or overlay category.

Renders cards from `PATTERNS` / `OVERLAYS`; opens `PatternDetailModal` or `IndicatorDetailModal`.

SVG art under `public/patterns/` referenced by some `PatternDef.image` paths.

---

## Code flow

```
Training (?group,&start)
  → getQuestionsForGroup
  → QuizModal
       → patternKey → PATTERN_OHLC → CandlestickChart
       → overlayId  → overlayQuizBars → MarketChart (single overlay, tagged pack's bars)
  → onPointsUpdate → Training header PTS / accuracy

Archive (?tab,&open) → PATTERNS / OVERLAYS → detail modals
```

---

## Safe-edit notes

- New pattern quiz: add OHLC pack in `ohlcData.PATTERN_OHLC`, optional `PATTERNS` entry, questions in `QUIZ_QUESTIONS`, and a `QUIZ_GROUPS` id if it needs its own family filter.
- New indicator quiz: ensure overlay id exists in `overlays.ts` + `MarketChart` can show it; add to `INDICATOR_QUIZ_QUESTIONS`.
- Quiz and case scores write to `analysis_core_progress_v1`. Do not rename that key without a migration.
- Keep `QuizGroupId` and `patternKey` strings aligned with `PATTERN_OHLC` keys.
- An `equity-patterns` question with `overlayId` must be true for its tagged pack's tape (it is charted). Every equity pack needs at least one `equity-patterns` question.
- Floors, id uniqueness and reference integrity for every group are checked by `src/lib/contentGraph.test.ts` (`npm run test:content`).

---

> Refer to AGENTS_CODE_REFERENCE.md for high-level context; details are in feature context files.

---

## Beginner Academy (`src/lib/academy/`, project `docs/projects/beginner-academy/`)

| Area | Files | Notes |
|------|-------|-------|
| Course map | `content/levels.ts`, `content/units*.ts`, `content/quizzes*.ts`, `progress.ts`, `mastery.ts` | 8 levels, 43 units, 3-item unit checks (mastery 80%); typed refs resolved by `refs.ts` (`APP_ROUTES` must equal App.tsx routes) |
| Placement / test-out | `placement.ts`, `testOut.ts`, `components/academy/PlacementCard.tsx`, `pages/academy/AcademyTestOut.tsx` | 12 items, 2/3 per level; test-out 85% |
| Paper trading | `paper/` (account, validate, engine, stats, session, tapes, describe) + `components/academy/paper/*`, `pages/academy/Paper.tsx` | SIMULATED money, SAMPLE tapes, integer cents; fill rules documented at the top of `engine.ts` |
| Paper stretch (BA11) | `paper/linked.ts` (bracket / OCO), `paper/journal.ts` (notes + RFC 4180 CSV), `paper/portfolios.ts` (≤5 named portfolios); session `options` (`allowShort`, `fractional`, `feeCents`, `slippageBps`) in `types.ts`; `MarginPanel`, `CostPanel`, `JournalPanel`, `PortfolioBar` | every option is off by default; a session without `options` replays exactly as the core rules; tests `linked` / `short` / `fractional` / `costs` / `journal` / `portfolios` `.test.ts` |
| Challenges | `challenges.ts`, `pages/academy/PaperChallenges.tsx` | 10 challenges, discipline 60 + result 40, fictional benchmark leaderboard |
| Rewards | `rewards/` (ledger, streak, levels, badges, award, refresh, retro), `components/academy/RewardsPanel.tsx` | virtual points only; 24 badges; retro credit reads older progress keys and writes none of them |
| Options ladder | `options/` (payoff, ladder, checks, gate), `components/academy/options/*`, `pages/academy/OptionsLadder.tsx` | payoff at expiration only (no chain or Greeks); 4 levels, 8 checks each, 3 attempts per 24 h |
| Today card | `today.ts`, `components/academy/TodayCard.tsx` | deterministic daily picks; the review answer (right +5, wrong +1) counts as the Day streak day |
| Home / Learn / Coach | `homeTip.ts`, `AcademyHomeTip.tsx`, `AcademyTrainingCard.tsx`, `coaching/sessions/first-paper-trade.ts` | additive lines in Dashboard.tsx and Training.tsx; no header nav item |
| Storage | `storage.ts` | `analysis_core_academy_v1`, `analysis_core_academy_paper_v1`, `analysis_core_academy_rewards_v1`, each with schemaVersion + migrate (paper is v2 since 2026-10-22: `challengeProgress` for half-played challenges, `challengeProgress.ts`; the others v1) |
| Tests | `npm run test:academy` (`src/lib/academy/**/*.test.{ts,tsx}`), incl. `floors.test.ts` (charter floors) and `academyRoutes.render.test.tsx` (every academy href resolves) | |

