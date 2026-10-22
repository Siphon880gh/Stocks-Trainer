# Gap audit — content graph + every loop prompt (2026-10-21)

Resume pointer for the "check for gaps in the Main Content Graph Prompt and the other prompts, then implement them" run. Weng asked for a full drain; commits are left to Weng (nothing committed, nothing pushed).

**Baseline before edits (HEAD 00e8a5e):** lint 0 · test:coaching 24/24 · src/lib tests 68/68 · test:financials 241/241 · test:macro 72/72.

## Current pointer
- `status`: done. The 2026-10-21 run left its changes uncommitted for review; Weng has since committed them, and later entries below are local commits.
- `next`: no open graph gap. `npm run test:content` is the live audit. Re-run it first, and a red check is the next gap. Remaining items need a human (see "Left for Weng").

## Checklist (implementation order)
- [x] C1 Duplicate literacy id `high-wave` (two Archive / flashcard rows) — give the combined entry its own id; rickshaw-man refs → `rickshaw-man`
- [x] C2 `samplePackId` drills chart the pack's own tape (QuizModal + AnswerSheetModal used `SAMPLE_OHLC`)
- [x] C3 Scaled-clone case tape `case-fx-eur-supply-energy` ≈ `case-fut-es-print` — new EUR tape
- [x] C4 `equity-patterns`: drills for the two equity packs with none (`eq-fail-rally`, `eq-div-cut`)
- [x] C5 Coach Phase D: price-action / trade-management / supply-demand / candle-context / RSI-vs-trend sessions
- [x] C6 Cases: Stage B packs (`*-tape`, `*-macro`) have 0 intermediate cases — every home mode at intermediate
- [x] C7 Home coachTips name shipped surfaces (Buy or Sell?, Price Action, Statements lab, Earnings Preview, Read the Print, Macro Desk)
- [x] C8 Auto-test: `src/lib/contentGraph.test.ts` enforces every section floor + reference integrity; `test:content` / `test:lib` scripts
- [x] D1 LOOP-Graph.md + CHARTER.md refreshed (config block, temp build, tests, new families, nodes, related projects)
- [x] D2 Section loops refreshed (Archive, Charts, Learn, Practice, Cases, Coach, Home, Asymmetry, README)
- [x] D3 Project loops consistency (financials CHECKPOINT_MODE line, Beginner Academy stale sibling note + baseline)
- [x] D4 AGENTS_CODE_REFERENCE*.md routes / tree / tests refreshed
- [x] V  Full verification + screenshots

**After (2026-10-21):** lint 0 · test:coaching 24/24 · test:lib 161/161 (68 + 93 content-graph checks) · test:financials 241/241 · test:macro 72/72 · check:build ok (temp outDir deleted; `dist/` untouched).

## Audit table

| # | Prompt | Gap found | Fix |
|---|--------|-----------|-----|
| 1 | LOOP-Archive | Literacy id `high-wave` defined twice → two Archive / flashcard rows, modal shows the later one | Combined row renamed `high-wave-and-rickshaw-man`; rickshaw-man pattern `glossaryLink` and `BS-W-rickshaw-man` term → `rickshaw-man`; duplicate-id test |
| 2 | LOOP-Learn Phase C | `samplePackId` overlay drills charted generic `SAMPLE_OHLC`, not the tagged pack | `src/lib/quizChartData.ts` (`overlayQuizBars`, `quizSamplePackName`); QuizModal + AnswerSheetModal use it; caption names the pack |
| 3 | LOOP-Learn Phase C | Equity packs `eq-fail-rally` and `eq-div-cut` had no drill | `EQ-PAT-09` (MACD on failed rally), `EQ-PAT-10` (RSI in a fresh downtrend can stay low); test: every equity pack has one |
| 4 | LOOP-Cases | `case-fx-eur-supply-energy` tape was a rescaled clone of `case-fut-es-print` | New `EUR_ENERGY_PRE` tape + aftermath; clone check across all 437 cases |
| 5 | LOOP-Cases / Asymmetry | Stage B packs (`*-tape`, `*-macro`) had 0 intermediate cases | 20 intermediate cases (5 per class), every home mode at both difficulties |
| 6 | LOOP-Coach | No Coach hop for price action, trade management, zones, candle context, RSI misuse | 5 sessions tagged `all-markets`: `trade-plan-before-entry`, `trailing-stop-exit`, `supply-demand-zone-retest`, `candle-needs-context`, `rsi-vs-trend`; `ALL_MARKETS_COACH_TAG` in marketNavigator (Asymmetry parity holds: 22 / 17 / 18 / 17 / 17 vs target 16) |
| 7 | LOOP-Home | A tip named Coach "Beat vs miss", which is not a title; shipped surfaces (Statements lab, Earnings Preview / Read the Print, Macro Desk, chart-skill sessions) unnamed | Tips fixed and extended in `learningPaths.ts`; test checks every `Coach →` / `Learn →` name |
| 8 | All prompts | Floors were prose only; nothing failed when a floor or reference broke | `src/lib/contentGraph.test.ts` (93 checks); scripts `test:lib`, `test:content`, `check:build`, `verify` |
| 9 | All section loops + Graph | 10-round budget vs the projects' 3 × 3; verify built into `dist/`; no config block | Shared config block (COMMIT_MODE none, 3 × 3, temp BUILD_CHECK, VERIFY, CHECKPOINT_MODE) in every LOOP file; test enforces it and bans a plain build |
| 10 | LOOP-Graph | No trade-management family; price-action / statements / macro / indicators / anatomy chains missed shipped hops; Academy and Playbooks unaccounted | Family 2c trade-management; hops to Practice labs, Coach sessions, `earnings-jargon`, `mark-the-band`, `MacroHomeTip`; family 14 academy parked until BA10.M3; Playbooks + project pages listed as not-nodes |
| 11 | CHARTER (graph) | Related projects stale ("when that ships (FE7.M3)"); macro-forces / beginner-academy missing; no stop rule | Related projects refreshed (FE7.M2 / FE8.M1 left open); stop rule + last-audit rows |
| 12 | LOOP-Learn | Phase B listed 8 of 31 families; dedicated banks had no floors / prefixes | Full family list; dedicated-bank table with real prefixes and floors; reference-integrity notes |
| 13 | LOOP-Practice | Lookalike / invalidation / levels labs and project pages missing; "Phase D: no routes" stale | Phase D = shipped labs, floor ≥8 each; project pages delegated; EMA / MACD regime follow-up parked with reason |
| 14 | LOOP-Cases | Stage B packs absent from the queue | Rows 9–10 with home modes; clone rule; FE7.M2 STOP note |
| 15 | LOOP-Coach | "Existing modules" listed 4 of 70; no Phase D | Inventory by family; Phase D table; `all-markets` rule |
| 16 | LOOP-Charts / Archive | Shape table and id lists read as if work remained | Done-state notes with counts; unique-id rule; PATTERN_OHLC + Buy-or-Sell follow-ups; OVERLAYS-equals-renderable rule |
| 17 | LOOP-Asymmetry | Snapshot table from before Stage B | Current table (Done) + `all-markets` and live-test notes |
| 18 | LOOPS/README | Plain build in verify text; no test:content / Playbooks note | Config-block explanation, VERIFY wording, unique-id rule, Playbooks note, project statuses |
| 19 | Financials loop | No CHECKPOINT_MODE line; shared build dir | `CHECKPOINT_MODE: continue` (product decisions still STOP); own temp dir |
| 20 | Beginner Academy loop | Trade management "being added by a sibling change" (shipped in 2c93114); baseline 63 lib tests; old lib-test command | Shipped ids listed; `test:lib` in verify lists (Academy, financials, macro loops, CHARTER, EPICS); baseline update in PROGRESS.md; coach count 70 |
| 21 | AGENTS_CODE_REFERENCE*.md | Routes missing `/macro`, `/playbooks`, project practice pages; tree from the first commit; no test scripts; old git history | Architecture, tree, scripts, safe-edit rules, history refreshed; training ref documents `overlayQuizBars` |
| 22 | patterns.ts (test infra) | Registry crashed under node (`import.meta.env`, `document`) | Safe fallbacks so node tests can import it |
| 23 | Archive (advanced) | Nothing checked that advanced `glossaryLink` / drill terms resolve | Test added (all resolve today) |

## Left for Weng
- ~~FE7.M2 / FE8.M1~~: decided by Weng and built 2026-10-21 (financials-earnings PROGRESS).
- ~~Beginner Academy~~: BA0–BA11 done and signed off 2026-10-21; graph family 14 filled (see the 2026-10-21 sweep below).
- ~~Playbooks~~: 8 kits added 2026-10-21 from public authoritative pages Weng asked for (OIC, FINRA, SEC Investor.gov, CME), each fetched and read the same day; see the Playbooks entry below. Future kits still need a real source; no loop invents one.
- ~~Parked: EMA / MACD regime follow-ups~~: done 2026-10-22 on separate 120-bar SIMULATED charts (`/practice/ema-macd`), not on the 6-bar Trend vs range windows, which stay unchanged. See the 2026-10-22 entry below.
- `all-markets` Coach sessions also show on a locked class's `/coach?class=` list (they map to Equities for the lock check). That is intended; flip it if you would rather hide them until peek.
- Root `AGENTS_LOOP-*.md` milestone queues (Done(global), outside this graph) still verify with a plain build into `dist/`; left as historical.
- Screenshots: `checkpoints/coach-forex-all-markets.png`, `coach-trade-plan.png`, `coach-rsi-vs-trend.png`, `learn-equity-patterns.png`. Case pages need a session peek click, so none were taken headless.

## 2026-10-21 sweep (after Weng signed off everything)
- Family 14 `academy` filled: Academy units now link the Learn groups `orders-and-fills` (l3-market-vs-limit, l3-stop-orders, l3-trailing-stop), `paper-pnl` (l0-simulated-vs-real, l3-position-sizing) and `options-ladder` (l6-payoff-at-expiration, l6-options-risk). New check in `contentGraph.test.ts`: every Academy group has questions and is linked from ≥1 unit. CHARTER, LOOP-Graph (family 14 row, stage 2, human-verification line, project statuses), LOOPS/README and LOOP-Cases (FE7.M2 note) refreshed.
- Chart price-marker labels: `CandlestickChart` gained an opt-in `markerDecimals`; only the paper account passes 2, so its markers read e.g. "Buy limit 52.15". Unset keeps whole-number labels, so every other page is unchanged (the FE4.M1 byte-identity snapshot passes unmodified).
- Left as intended: the 5 `all-markets` Coach sessions on a locked class's list (no test or plan says otherwise).
- Still for a human: root `AGENTS_LOOP-*.md` untouched (historical).

## 2026-10-21 Playbooks
- 4 → 12 kits. New: `covered-call`, `cash-secured-put`, `protective-put` (Options Industry Council strategy pages), `dollar-cost-averaging` (FINRA), `rebalance-to-target`, `stop-vs-stop-limit`, `short-with-buy-stop` (SEC Investor.gov), `futures-roll` (CME Group). Every URL was fetched and read on 2026-10-21; each Strategy panel only restates what its page says (figures such as $10,000 → $1,000/month, 60% → 80%, $3.00 stop / $2.50 limit, $60 → $40 / $80, third Friday are the sources' own examples). `source.verifiedOn` records the date.
- Each kit reuses an existing Coach session, Case and SAMPLE pack whose asset class matches (no new OHLC). Options kits stay underlying-only (no chain).
- Tests: `src/lib/playbooks.test.ts` (ids, source kind, no channel links, every panel resolves, asset classes match, webpage kits carry `verifiedOn`) and `src/lib/playbookPage.test.tsx` (resource link above the panels, Coach/Case links, list links every kit). Link check: `npm run check:playbook-sources` (network, not in verify; YouTube via oEmbed) — 12/12 ok.
- Playbook page: webpage kits now read "SAMPLE educational read of a public page — not advice" instead of "not their paid course".
- Not added (needs Weng): a kit built from his own trading rules or a target asset mix; `rebalance-to-target` teaches the mechanics and leaves the mix to him.

## 2026-10-22 Full-app QA sweep
- Headless Chrome on a temp dev server (port 3077), every route in `src/App.tsx` with every param value from the registries: 25 static routes + 437 cases, 71 coach sessions, 12 playbooks, 18 macro lessons, 43 Academy units, 8 test-out levels, 10 paper challenges = 625 routes. Pass 1 at 1280 and 390 (console errors, failed or 4xx requests, blank render, broken internal links, page overflow); pass 2 at 390 and 768 with every `<details>` opened (hidden-scrollbar overflow inside scroll containers, controls clipped by an `overflow-hidden` parent). 2,500 page loads.
- Fixed: (1) every first load logged a `/favicon.ico` 404 → inline SVG favicon (`indexHtml.test.ts`). (2) Header nav at <640px hid Coach and Playbooks behind a scrollbar-less scroll → links get their own full-width row below `sm` (`appChrome.test.tsx`). (3) `/market` at 390–1023px squeezed the Pair / Price / 24h / Volatility cards to ~24px columns beside the selects → own row below `lg`; the chart toolbar's explanations / feed / Videos group was clipped by the chart pane → wraps; the overlay row overflowed 3px at 768 → fixed (`marketLayout.test.tsx`).
- Clean otherwise: 0 broken internal links (9,518 checked), 0 console errors, 0 failed requests, no blank renders. `/academy/test-out/L0` shows "There is no test-out for that level" by design and nothing links to it. Horizontal scrollers left as intended: data tables (`overflow-x-auto`), the Learn path stepper and Archive filter chips (a partly visible next item shows there is more).
- Not covered: multi-step interactions (deciding a case, stepping a coach tree, placing paper orders) beyond first render; earlier milestone screenshot QA covered those flows.

## 2026-10-22 Interaction QA and EMA / MACD lab
- Interaction QA at 390 and 1280: flows, bugs and fixes are in `QA-LOG.md`. There were 5 fixes, each with a test: quiz points saved per answer, scroll reset on route and next round, the no-flip short message, options Try again / pass line, and test-out Try again. `npm run test:e2e` is a Playwright smoke run that is not in verify.
- MACD signal fix (`indicators.ts`): the signal EMA now starts from the first real MACD value rather than zero-filled warm-up bars.
- EMA / MACD lab (`src/lib/emaMacdLab.ts`, page `/practice/ema-macd`, misc practice `ema-macd`): three seeded 120-bar SIMULATED charts (trend then turn, range then breakout, rounded top) show SMA(20), EMA(20) and MACD(12, 26, 9) with signal and histogram. A short-window lesson explains, with numbers computed from the real "grind" window, why 6 bars cannot separate them: 0 MACD values, and a 3-bar SMA/EMA gap of at most 0.17 against a 1.80 average step. The lesson has 11 quiz items, and every key is computed from the chart. `emaMacdLab.test.ts` checks the values against independent SMA/EMA/MACD reference implementations, recomputes every key, and asserts that `REGIME_WINDOWS` is unchanged. `emaMacdPage.test.tsx` covers the page.
- Teaching note: on a steady straight trend, EMA(20) and SMA(20) lag by about the same amount and the MACD histogram is near 0, so the questions target turns, decisive crosses and the histogram lead on the rounded top, not "EMA is above SMA in a climb".

## 2026-10-22 Weng's delegation (six logged behaviours)
- Weng delegated the six design calls the interaction QA logged ("Make your own picks. Continue your work."). All six are built and tested; details are in `QA-LOG.md`, "2026-10-22 Weng's delegation".
- Decisions: quiz milestones need 70%; cases pay 10 / 5 / 1 once per case; Today pays +5 / +1 and either answer counts the day; "Answer streak" vs "Day streak"; half-played challenges resume (paper key schema v2, lossless migration); glossary ⓘ is a separate button beside choices everywhere.
- New invariants with tests: a lower quiz score never revokes a completion; case points are paid once per case; no `<JargonText>` without `plain` inside a button / link / label (source guard); the paper key loads v1 and v2 and refuses newer.
- Still for a human: nothing new. The point values (10 / 5 / 1, +5 / +1) and the 70% mark are my picks under the delegation; each is one constant (`CASE_POINTS`, `POINTS.dailyGoal` / `dailyAttempt`, `QUIZ_PASS_PCT`) if Weng wants them changed.

## 2026-10-22 Oscillators lab and Wilder RSI
- Oscillators & volatility stop lab (`/practice/oscillators`, misc practice `oscillators`): three seeded 120-bar SIMULATED charts (strong climb, choppy range, climb then gap) with RSI(14) + fast %K, fast vs slow stochastic, KDJ(9, 3, 3), and an ATR(20) × 2 volatility stop. 11 chart questions, each key computed from the chart (`oscillatorLab.test.ts`). Learn groups `oscillators` (24) and `trading-risk` (14), 11 glossary terms, 13 cited sources (`oscillatorSources.ts`). Content-graph floors: oscillators ≥ 18, trading-risk ≥ 12.
- RSI now uses Wilder's smoothing (`indicators.ts`): the first average is the simple mean of the first n gains / losses, then avg = (prev × (n − 1) + current) / n. `rsi.test.ts` matches all 19 values of the StockCharts ChartSchool worked example (cs-rsi.xls) to 1e-6 and an independent RMA reference for periods 2–21.
- Consumers rechecked: the MarketChart RSI pane (period 5 on the ~12-bar SAMPLE packs, now `MARKET_CHART_RSI_PERIOD`) and its scan notes, the Learn overlay drills, Indicators / Playbook charts, the Trend vs range RSI windows, the oscillator lab, and the `rsi-vs-trend` Coach session (text only, no computed values). One fix: `IN-08` ("RSI near 80 after a straight grind") charted `eq-cyclical`, whose RSI never went above 57; it now charts the `eq-mega-tech` grind. `IN-11` ("in a choppy range") charted `eq-index-proxy`, whose RSI(5) sat at 74–86 with no cross of 50; it now charts the `fx-gbpusd` range pack (tagged forex), where RSI crosses 50 four times inside 39–52. `rsiQuizClaims.test.ts` checks IN-08, IN-11 (≥ 3 crosses of 50, RSI inside 30–70, net move ≤ a quarter of the high–low range), EQ-PAT-03 and EQ-PAT-10 against the drawn chart. Lab answers that moved: longest RSI > 70 run 25 → 23 bars, first RSI > 70 at D25 → D37, RSI / %K agreement 86% → 92%; every teaching point still holds.

## 2026-10-22 Japanese candlesticks (core 14) and Heikin-Ashi
- Audit of the core 14 (Dragonfly Doji, Hammer, Bullish Engulfing, Piercing Line, Tweezer Bottom, Three White Soldiers, Morning Star; Gravestone Doji, Shooting Star, Bearish Engulfing, Dark Cloud Cover, Tweezer Top, Three Black Crows, Evening Star): all present in `PATTERNS` with `PATTERN_OHLC` charts. Gaps closed: no per-pattern recognise / psychology / trade structure (added `src/lib/patternTabs.ts`, three tabs in `PatternDetailModal` for every pattern); the shared `hammer` chart had no prior decline, so the lesson and quizzes use a new `core-hammer` pack (the old pack is unchanged for the snapshot); tweezer top had one question (now ≥ 2, `japaneseCandles.test.ts` checks every core pattern ≥ 2 and each illustration's shape against textbook rules and its prior trend).
- New: framing lesson `/practice/japanese-candles` (history, buyer–seller battle, body vs wicks; linked from `l2-reading-a-candle`), Bullish / Bearish core list on Archive → Patterns, Heikin-Ashi lab `/practice/heikin-ashi` (`heikinAshi.ts` tested against the StockCharts QQQ sheet and an independent implementation; 8 computed questions on a 60-bar SIMULATED chart). Learn groups `japanese-candles` (33, floor 30) and `heikin-ashi` (15, floor 12); glossary terms `japanese-candlesticks`, `heikin-ashi`.

## 2026-10-22 Chart, gap and volume patterns (screenshot import)
- Two pattern images inventoried against `PATTERNS` / `ADVANCED_PATTERNS`. Already present: doji family, hammer / inverted hammer, marubozu, spinning top, kickers, engulfing, piercing line, dark cloud cover, tweezers, harami, morning / evening star, abandoned babies, soldiers / crows, three-line strike, three inside / outside, double / triple top and bottom, head and shoulders (both), wedges, bull flag, triangle, hanging man.
- Added 31 in `src/lib/chartPatternBook.ts` (windows, four gap types, islands, flags / pennants / high and tight flag, ascending / descending triangles, rectangles, channels, rounding, cups, broadening, diamonds, V bottom, four volume patterns, three pushes). Learn group `chart-patterns` (155, floor 140); Buy-or-Sell 119 → 148; 32 glossary terms. Skipped (no published definition): tweezer star, trend stage bounce, parallelogram, three stage pattern, on-neckline chart pattern, low tight flag, square bottom, step top / bottom. Process recorded in `.agents/skills/candlestick-screenshot-import/SKILL.md`.

## 2026-10-22 Gamma squeeze case
- Audit: no existing content on short or gamma squeezes, short interest, days to cover, open interest, unusual options activity or survivorship bias; gamma and delta appeared only in options-context questions that say those packs have no chain or Greeks (OP-06 reworded to say so for those packs). The Academy options files stay free of Greek terms (`optionsGate.test.ts`), so the case links to the ladder but not the other way.
- Added `/practice/gamma-squeeze` (`src/lib/gammaSqueeze.ts`, SIMULATED bars, Black-Scholes option path recomputed in `gammaSqueeze.test.ts`, enter / size / exit grading, stall counterfactual, survivorship panel), Learn group `squeezes` (14, floor 12), Coach `chasing-a-squeeze`, 9 glossary terms, a Misc Practices entry and a Cases tip link.

## 2026-10-22 News, biases & short-term options
- Audit: no bias content or terms (recency, availability, confirmation, FOMO, loss aversion, anchoring), no LEAPS or information-overload terms; `news-literacy` covers headline reading, `no-trade-zone` and `short-dated-option` terms exist and are linked, paper brackets exist on `/paper`.
- Added `/practice/news-biases` (`src/lib/newsBiases.ts`), Learn group `news-biases` (17, floor 15), Coach `news-day-decision`, 9 glossary terms, and an optional bias check on the paper order ticket (off by default).

## 2026-10-22 Automated & algo trading, charting apps, PDT
- Audit: no content on broker APIs, backtesting, bots, webhooks, spoofing or wash trades; stop and stop-limit terms exist in the Academy (reused, not duplicated); no text referred to the pattern day trader rule or the $25,000 minimum, so nothing needed rewording; KDJ term exists (reused); no charting-app comparison, data-feed or log-scale content; no broker-education or PFOF content.
- Added `/practice/algo-trading` (`src/lib/algoTrading.ts`, `src/lib/pdtRule.ts`), Learn group `algo-trading` (17, floor 17), 5 PDT questions in `trading-risk`; `/practice/charting-apps` (`src/lib/chartingApps.ts`), Learn group `charting-apps` (14, floor 14); 20 glossary terms; two example Webull screenshots as webp in `public/screenshots/`.

## 2026-10-22 Candlesticks for crypto (#8)
- Audit: almost all cheat-sheet candles already in the registry (belt hold as glossary + opening marubozu; counterattack, three methods, mat hold, three-line strike, ladder, stick sandwich, advance block, three stars in the south present). Added `double-doji`. No crypto fitness tags existed.
- Added `/practice/crypto-candles` (`src/lib/cryptoCandles.ts`): works / adapted / rare tags on every candlestick pattern, harami takeaway verbatim, Learn group `crypto-candles` (12), Archive crypto filter chips, pattern-card and modal tags.

## 2026-10-22 Reversal chart patterns (#9)
- Audit: H&S, inverse H&S, double/triple top/bottom, rising/falling wedge already in PATTERNS with thin descriptions; rounding, cup, rectangles already deep in CHART_BOOK. Complex H&S deferred from #4.
- Deepened via `/practice/reversal-charts` (`src/lib/reversalCharts.ts`): neckline, volume, measured move, retest, invalidation; custom Archive tabs; rectangle ≠ triple bottom panel; Learn group `reversal-charts` (12); 3 new glossary terms (measured-move, pattern-retest, pattern-invalidation; neckline already existed).

## 2026-10-22 Reading 1-minute charts (#10)
- Audit: no dedicated 1m grouping / MES tick / bar-count lesson; fib tool names verified on TradingView (Reverse, Extend Lines Left/Right); MES 0.25 = $1.25 from CME FAQ/rulebook.
- Added `/practice/one-minute-charts` (`src/lib/oneMinuteCharts.ts`): grouping, open hour, legs drill + SIMULATED 1m chart, MES calculator, fib + bar count, Learn `one-minute-charts` (12), 7 glossary terms.

## 2026-10-22 Fibonacci as a decision map (#11)
- Audit: #10 taught Reverse / Extend Lines; no dedicated zone→confirm→stop→target→R:R map. Sources: TradingView 43000518158, Fidelity fib guide, FINRA 2270.
- Added `/practice/fib-decision-map` (`src/lib/fibDecisionMap.ts`): SIMULATED 5m decline with fib annotations, level table, R:R calculator, plan drill, confluence/VWAP/invalidation; Learn `fib-decision-map` (12); 5 glossary terms.
