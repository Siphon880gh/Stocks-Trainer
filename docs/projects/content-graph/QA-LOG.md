# Interaction QA log

Append-only. Playwright flows on a temp dev server (port 3078), headless Chrome at 1280 and 390. Newest at the bottom. Times are America/Los_Angeles.

## 2026-10-22 interaction QA

| Flow | Result | Fix |
|---|---|---|
| Case decide → reveal (`/cases/case-news-chase-fade`, peek, BUY / HOLD, lock in) | Reveal, grade, locked buttons and stored `caseResults` correct; persists across reload; no console errors at 1280 / 390. Cases do not award points (by design: points come from Training quizzes). | — |
| Buy or Sell? drill (right and wrong answers, reveal, next) | Reveal explains the correct answer and why not the pick; header points / streak right (50 per correct, +10 streak bonus). **Bug:** points, streak and accuracy were never saved for Buy or Sell? (or any group without a path milestone, or any quiz closed early) — Training showed them, a reload reset to 0. | `recordQuizScore` saves after every answer; `progressStore.test.ts` |
| Learn quiz start → finish + answer sheet (Equities Literacy, 12 Q) | Answer sheet lists every question, jump opens the right item, Finish closes the modal; E4.M1 completes and E4.M2 unlocks; score/streak right at 1280 / 390. Note (unchanged, design call): finishing with 50% still completes the milestone, as there is no pass threshold. | — |
| Read the Print, all 22 rounds (call + bonus, alternate right / wrong-and-skip) | Score after every round matches `roundPoints` (3 per right+bonus, 0 per wrong); summary "33 / 66"; `22 played · best session 33` after reload; no errors. **Bug:** "Next round →" left the new round scrolled ~830px down at 390, into the old statement. | `scrollToTopOf` on next round |
| Mark the Band, 23 rounds (wraps 22 → 1) | Lock / Reveal disabled until filled, inputs lock, points match `gradeBand` (3/3 exact, 2/3 with a wrong low); no errors / overflow. | — |
| Macro Desk play, all 29 rounds | "x / y calls right" matches `scoreRound`; wrong calls show "you said…" + why-not; round ticks persist after reload. **Bug:** "Next round" kept the old scroll (~750px), so the next round opened mid-page. | `scrollToTopOf` in MacroPlay (next + jump select) |
| Any in-app navigation | **Bug:** BrowserRouter kept the scroll offset across routes (/training at 3000px → /cases opened at 3000px). | `ScrollToTop` (layout effect, skips first render and #hash links so Cases/Market focus scrolls still win); `scrollReset.test.ts` |
| Academy: unit quiz to mastery (`l0-what-is-a-market`: 2/3 → retry shuffled → 3/3) | Submit disabled until all answered; "Not quite" explanations; retry reshuffles options and clears picks; mastered state, +30 points, 1-day streak and the Today review question persist after reload. | — |
| Academy: L1 test-out (5/7 fail, then 6/7 pass at the 85% bar) | Fail shows weakest units and saves nothing; pass marks all six L1 units "Tested out", +50 test-out points, revisit says "already tested out". **Bug (UX dead end):** a failed test-out had no retry, only "Back to the Academy". | "Try again" on a failed result clears the answers; `hub.render.test.tsx` |
| Paper: market + bracket, $500 dollar buy, limit, buy stop, sell stop-limit, sell trailing, +1/+5 bars, flatten, short 20, cover, cancel, $1 fee, journal note, CSV, second portfolio, switch back, New session (1280 / 390) | After every step the account summary (equity, cash, buying power, day / total P&L, realized / unrealized, drawdown) equals `replay()` + `performance()` on the stored log; CSV download is byte-identical to `journalCsv`; note survives reload; switching portfolios keeps Main's bar and fills; reset persists. **Bug:** with short selling ON, selling more than a long said "(no shorting in v1)". | Message now explains the no-flip rule (and drops "v1" when shorting is off); `short.test.ts` |
| Challenge to result (`ride-the-trend`: no stop, then Try again with a 5% trailing stop) | Result headline, discipline / result split, return and breach text equal `scoreChallenge(play(...))` for the same actions (60/100 with the "no protective stop" breach, then 80/100 passed); Try again restarts at bar 11; best 80/100 on the list card; +40 challenge points on the hub. Note: a half-played challenge is not saved across reloads (attempts are saved when they finish). | — |
| Options ladder L1: ack gate, 3 failed checks, 24 h block, pass | Start disabled until the risk box is ticked; attempts count down 3 → 0 and the block persists across reload. **Bug:** after a failed check the panel had no way to start the next attempt (only a reload), and a pass hid the result at once. | `afterCheck()` in gate.ts drives "Try again (n left)" / the block message with the next time / a "Level n passed · level n+1 is open" line; `optionsGate.test.ts` |
| Coach, all 71 sessions (wrong pick at the start → "Wrong · review" → Rewind → success path to "Success"), 1280 | 71 / 71 clean: wrong branch, rewind to the same choices, Continue nodes and the success end state; no console errors or overflow. Note: a tap on the centre of a choice can land on its 15 px glossary ⓘ (a focusable span inside the choice button), which opens the term instead of choosing; by design, but a nested interactive inside a button. | — |
| Home Today card + Dashboard points line | Today card hidden until the goal is confirmed; Dashboard "pts · streak · accuracy" equals the stored progress after Training answers; review question appears after a mastery, keeps its id after answering, wrong-answer feedback names the key, +5 daily points, options lock, persists on reload and shows the same on the Academy hub. Note: Home "streak" is the quiz answer streak, the Academy streak counts days; two meanings of one word. | — |
| Corrupt localStorage (all 10 keys set to `{not json`, `[]`, `null`, wrong shape) on 17 routes at 390 | Every route renders, no page errors. | — |
| `npm run test:e2e` (new, not in verify) | Own Vite server on a free port from 3190, 6 regression flows × 2 widths, 34 checks, server closed after. | `e2e/smoke.mjs` |
| Coach, all 71 sessions, 390 | 71 / 71 clean, same path as 1280; no console errors or overflow. | — |
| EMA / MACD lab `/practice/ema-macd`, 390 and 1280 | Three chart tabs, every question answered: feedback, D-mark line, score line, `ema-macd` saved in misc practices done; no console errors, no horizontal overflow. | New page; `emaMacdPage.test.tsx` |

## 2026-10-22 Weng's delegation: decisions on the six logged behaviours

Weng: "Make your own picks. Continue your work." Implemented as decided, one commit each, with regression tests. Below, "Before" is the behaviour the interaction QA above logged.

| # | Before | Decision, as built | Tests |
|---|---|---|---|
| 1 | A 50% Learn quiz still completed its milestone | `QUIZ_PASS_PCT = 70`. Below that, the attempt is recorded (`score`, `bestScore`, new `attempts`), the milestone and the next one stay as they were, and the last question shows "Score 70% to complete". Saved completions (even old ones under 70%) are never revoked. E10 drill flags use the same pass mark. | `progressStore.test.ts` (6 new); e2e quiz flow |
| 2 | Cases gave no points | `CASE_POINTS` correct 10 / partial 5 / incorrect 1, mapped onto the existing case grades and paid once per case into `scores.totalPoints` (`pointsAwarded` on the case record). Replays pay nothing; the reveal says "+n pts · paid once per case" or "Replay · no new points". A case saved before points existed pays once on its next play. | `progressStore.test.ts` (3), `casePoints.render.test.tsx`; e2e |
| 3 | Today gave +5 even for a wrong answer | +5 correct, +1 wrong (`POINTS.dailyAttempt`). Either answer counts toward the Day streak, and the flash names which award applied. | `today.render.test.tsx`; e2e |
| 4 | "Streak" meant two things | Labels only: "Answer streak" (quiz answers right in a row) on Home, Learn and the quiz header; "Day streak" in the Academy (rewards panel, Today card). Each has a tooltip. Constants are in `src/lib/streakLabels.ts`, and the docs are updated. The logic is unchanged. | `streakLabels.render.test.tsx`; e2e |
| 5 | A half-played challenge was not saved | Paper key schema v2: `challengeProgress[challengeId]` holds the run's session log after every move. The v1 → v2 migration is lossless (all v1 fields kept, empty `challengeProgress`), and the load guard is per key. On return, Resume / Restart; the list shows "in progress". Finishing or restarting clears it. A saved log that no longer fits its challenge (tape, cash, window, or can't replay) is ignored. | `challengeProgress.test.tsx` (4); e2e |
| 6 | Glossary ⓘ nested inside choice buttons | In buttons and links, `<JargonText plain>` shows the term with a dotted underline, and the ⓘ becomes its own labelled `<button>` beside the control (`WithGlossary` / `GlossaryButtons`), with stopPropagation. It is 44 × 44 px on mobile and comes right after the choice in Tab order; a tap pins the tip open. Applied in Learn quiz options, Coach choices, the answer sheet, Scan patterns, Archive terms and patterns, Flashcards, and the Cases / Coach / Playbooks list cards. | `glossaryButtons.test.tsx`, including a source guard that fails if any `<JargonText>` inside a button / link / label lacks `plain` (checked by reverting one site) |

Spot checks after the changes (dev server on 3078, stopped after):

| Flow | Result |
|---|---|
| Coach, all 71 sessions, **centre** tap on every choice, 390 and 1280 | 71 / 71 clean at both widths. The old script needed a click at the left edge because a centre tap hit the ⓘ; it no longer does. |
| Coach choice with a term (`chart-soft-gate`) | ⓘ 44 × 44 at 390 (32 × 28 at 1280). Tapping it opens the tip without choosing. Tab from the choice lands on "About The tape", and a centre tap picks the choice. |
| Quiz 12 × option A, case BUY, half-played challenge reload, Today wrong answer, Archive terms; 390 and 1280 | Pass line, case points, Resume / Restart, the +1 flash and the Day streak all show; no console errors, no overflow. |
| **Bug found and fixed:** the Academy hub's rewards panel was stale after the Today answer ("Day streak 0" under a card saying "Day streak 1") | `TodayCard onAward` refreshes the panel (9910291). Also fixed "1 practice points" (6aac9b6). |
| `npm run test:e2e` | 97 checks, 0 failed (6 new flows × 2 widths); its own server on 3190 closed after. |

Screenshots (box only, not committed): `/workspace/checkpoints/qa/weng-1022-dec{1..6}-*-{390,1280}.png`.

## 2026-10-22 Oscillators lab and Wilder RSI

| Flow | Result |
|---|---|
| Oscillators & volatility stop lab `/practice/oscillators`, 390 and 1280 (e2e) | SIMULATED label; the climb-then-gap tab draws the volatility stop; the computed `gap-flip` key grades "Right." and marks its bar; choices are ≥ 44 px tall at 390; Learn shows the Float, Short-Dated Options & Risk group; no console errors, no horizontal overflow. Run after the RSI switch. |
| `npm run test:e2e` | 112 checks, 0 failed; its own Vite server on a free port closed after. |

Screenshots (box only, not committed): `/workspace/checkpoints/qa/oscillators-wilder-{390,1280}.png`.


## 2026-10-22 Japanese candlesticks and Heikin-Ashi

| Flow | Result |
|---|---|
| `/practice/japanese-candles`, 390 and 1280 (e2e) | Bearish toggle shows 7 rows; Evening Star opens with a SIMULATED illustration ending on the confirmation candle; the Trade tab shows confirmation, entry, stop (invalidation), target and "Not a guarantee"; tabs ≥ 44 px at 390; no console errors, no horizontal overflow. |
| `/practice/heikin-ashi`, 390 and 1280 (e2e) | Regular / Heikin-Ashi / side-by-side toggle; the computed `ha-calc-close` key grades "Right."; no overflow. |
| `npm run test:e2e` | 133 checks, 0 failed; its own Vite server closed after. |

Screenshots (box only, not committed): `/workspace/checkpoints/qa/japanese-candles-{390,1280}.png`, `/workspace/checkpoints/qa/heikin-ashi-{390,1280}.png`.

## 2026-10-22 Chart, gap and volume patterns

| Flow | Result |
|---|---|
| `/archive?tab=patterns&open=cup-and-handle`, 390 and 1280 (e2e) | Deep link opens the detail; SIMULATED illustration with a volume pane; Trade tab shows the handle stop and target (not the general guide); no overflow, no console errors. |
| `/training?group=chart-patterns` (e2e) | Group listed. |
| `npm run test:e2e` | 147 checks, 0 failed; its own server closed after. |

Screenshots (box only): `/workspace/checkpoints/qa/chart-patterns-{390,1280}.png`.

## 2026-10-22 Gamma squeeze case

| Flow | Result |
|---|---|
| `/practice/gamma-squeeze`, 390 and 1280 (e2e) | TL;DR shown; no reveal before the decisions; plan / small / sell grades "Sound process", 30 / 30, +10 progress points; reveal shows 25 contracts and $5,075; stall panel shows the $200 lost; result saved under `gamma-squeeze`; no overflow, no console errors. |
| `/training?group=squeezes`, `/coach/chasing-a-squeeze` (e2e) | Group listed; session opens after the options-class peek. |
| `npm run test:e2e` | 169 checks, 0 failed; its own server closed after. |

Screenshots (box only): `/workspace/checkpoints/qa/gamma-squeeze-{390,1280}.png`.

## 2026-10-22 News, biases & short-term options

| Flow | Result |
|---|---|
| `/practice/news-biases`, 390 and 1280 (e2e) | Six bias cards, horizon table with LEAPS, three checkpoints graded 3 / 3; no overflow, no console errors. |
| `/paper` ticket (e2e) | Bias check off by default; when on, Place is disabled until all six boxes are ticked. |
| `/coach/news-day-decision` (e2e) | Opens after the options-class peek. |
| `npm run test:e2e` | 187 checks, 0 failed; its own server closed after. |

Screenshots (box only): `/workspace/checkpoints/qa/news-biases-{390,1280}.png`, `/workspace/checkpoints/qa/news-bias-ticket-{390,1280}.png`.

## 2026-10-22 Automated & algo trading, charting apps, PDT

| Flow | Result |
|---|---|
| `/practice/algo-trading`, 390 and 1280 (e2e) | 9 broker rows, PDT panel dates, ATR calculator 33 → 66 shares, playbook marks the practice done; tables scroll inside their panels, no page overflow, no console errors. |
| `/practice/charting-apps`, 390 and 1280 (e2e) | 11 app rows, spot-the-trap graded, both Webull screenshots load with alt text, lightbox opens and closes with Escape, 5 broker learning links. |
| Learn `algo-trading`, `charting-apps` (e2e) | Groups listed. |

Screenshots (box only): `/workspace/checkpoints/qa/algo-trading-{390,1280}.png`, `/workspace/checkpoints/qa/charting-apps-{390,1280}.png`, `/workspace/checkpoints/qa/charting-apps-webull-{390,1280}.png`.

## 2026-10-22 Candlesticks for crypto (#8)

| Flow | Result |
|---|---|
| `/practice/crypto-candles`, 390 and 1280 (e2e) | Why-lesson, harami takeaway verbatim, filter works/adapted/rare, list ≥80. |
| Archive `?crypto=works` + harami open (e2e) | Crypto chips, works tags, takeaway and "Works in crypto" on the modal. |
| Learn `crypto-candles` (e2e) | Group listed. |

Screenshots (box only): `/workspace/checkpoints/qa/crypto-candles-{390,1280}.png`, `/workspace/checkpoints/qa/crypto-harami-{390,1280}.png`.

## 2026-10-22 Reversal chart patterns (#9)

| Flow | Result |
|---|---|
| `/practice/reversal-charts`, 390 and 1280 (e2e) | 8-pattern gallery, rectangle panel, confirmation drills graded. |
| Archive double-bottom Trade tab (e2e) | Deepened neckline content. |
| Learn `reversal-charts` (e2e) | Group listed. |

Screenshots (box only): `/workspace/checkpoints/qa/reversal-charts-{390,1280}.png`.

## 2026-10-22 Reading 1-minute charts (#10)

| Flow | Result |
|---|---|
| `/practice/one-minute-charts`, 390 and 1280 (e2e) | Grouping + 78 bars, MES calc (1 tick loses, 3 ticks nets), Fib Reverse / Extend Lines, Bar Count Normal 2, legs mark done. |
| Learn `one-minute-charts` (e2e) | Group listed. |

Screenshots (box only): `/workspace/checkpoints/qa/one-minute-charts-{390,1280}.png`.

## 2026-10-22 Fibonacci as a decision map (#11)

| Flow | Result |
|---|---|
| `/practice/fib-decision-map`, 390 and 1280 (e2e) | Swing 5050→5000, 61.8% table, R:R≈2, coherent plan drill marks done. |
| Learn `fib-decision-map` (e2e) | Group listed. |

Screenshots (box only): `/workspace/checkpoints/qa/fib-decision-map-{390,1280}.png`.

## 2026-10-22 Futures vs options & beginner toolkit (#12)

| Flow | Result |
|---|---|
| `/practice/futures-vs-options`, 390 and 1280 (e2e) | Comparison table, MES 4 pts = $20, ES switch = $200, Sharpe 0.6, Apple EBITDA 144,748, practice marked done. |
| Learn `futures-vs-options` (e2e) | Group listed. |

Screenshots (box only): `/workspace/checkpoints/qa/futures-vs-options-{390,1280}.png`.
