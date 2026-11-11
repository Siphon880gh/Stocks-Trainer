# Paper desk: content grade

Scale: each area scored 0–10 against what a learner needs to practise the topic on `/paper/desk`. Overall = sum out of 100.

"Before" = the desk as first shipped (commits `8b6eb6f`…`2147a43`): one HISTORICAL 2024 scenario (AAPL, MSFT, AMZN) and one SIMULATED earnings week.
"After" = this round (scenario library, goals, debriefs, tour, quiz, glossary, progress map).

| Area | Before | After | What changed |
|---|---:|---:|---|
| Scenarios / topics | 2 | 9 | 2 scenarios covering about 3 topics → 30 scenarios (1 HISTORICAL, 29 SIMULATED) in 11 topic groups, covering every requested topic (list below). |
| News | 5 | 8 | 34 real headlines + 9 simulated → 34 real + 102 SIMULATED items. Each scripted gap of 3% or more has a headline published after the prior close (tested). |
| Financials | 5 | 8 | Statements now carry debt, financing cash flow, buybacks, dividends, shares issued, diluted shares and filing notes. 51 SIMULATED statements tie out (assets = liabilities + equity; Δcash = operating cash flow − capex + financing), and restatements and splits get separate series (tested). |
| Order-type practice | 6 | 8 | All order types existed but nothing asked for them. Goals now require limit orders (range, thin small cap), a stop-limit (flash crash) and trailing stops (trend, trailing-stop scenario). Scenarios preset short selling, slippage and fees where the topic needs them. |
| Risk / sizing teaching | 5 | 8 | The sizing calculator existed. Now: goals for ≤ 1% planned risk per trade, max drawdown and stops on every entry; scenarios on overnight gaps through stops, binary events, drawdown sizing and recovery math. |
| Debriefs / feedback | 1 | 8 | "End of the replay" → a debrief with what the news and filings signalled, what a disciplined trade looked like, your result, drawdown, R, dividends received, goal results, glossary links, a quiz link and saved journal prompts. The HISTORICAL debrief is computed from the bundled prices (next-session move after each real earnings release). |
| Guided walkthrough | 0 | 8 | A 9-step tour (lesson, clock, watchlist, chart, ticket, sizing, account, research, goals) on the shared Walkthrough component and z-layers. Exit leaves the chart usable (e2e). |
| Progress integration | 3 | 8 | Page-visit stage → `hub:desk` (fraction = scenarios finished ÷ 30), a new "paper-desk" quiz group (24 questions) in the paper region, and 10 new glossary terms. |
| Data provenance | 8 | 9 | Every SIMULATED scenario, headline and statement is tagged SIMULATED (title, badge, source note, Financials header) and tested; tickers end in `.S` and avoid the real-ticker blocklist. HISTORICAL sources are unchanged (SOURCES.md). |
| Accessibility / mobile | 6 | 7 | No horizontal overflow at 390 px on the picker, session and debrief (e2e). Topic filter chips and cards use `aria-pressed`, the goals and selection panels use labelled regions, journal fields are labelled, and tour highlights now scroll below the sticky header on phones. |
| **Overall** | **41 / 100 (D)** | **81 / 100 (B+)** | |

## Topics covered (SIMULATED unless noted)

- **Real history (HISTORICAL):** Big tech 2024.
- **Earnings & guidance:**
  - Earnings season (beat, guidance cut, range)
  - Miss and drift
  - Beat, then sell the news
- **Trends & ranges:**
  - Bull trend
  - Bear trend
  - Range chop
- **Breakouts & gaps:**
  - Breakout vs fakeout
  - Gap and go vs gap fill
- **Volatility & squeezes:**
  - Flash crash
  - Short squeeze
- **Corporate actions:**
  - Dividend and ex-date drop
  - 4-for-1 stock split
  - Secondary offering and dilution
  - Buybacks and EPS
- **Deals & binary events:**
  - Takeover (target pop, acquirer drop, deal spread)
  - Drug decision (binary event)
- **Macro & sectors:**
  - Fed surprise across a basket
  - Hot inflation print
  - Sector rotation
  - Recession and bear market
- **Balance-sheet risk:**
  - Going-concern warning to bankruptcy
  - Accounting restatement
- **Insiders & analysts:**
  - Insider buying
  - Analyst upgrades and downgrades
- **Execution & risk:**
  - Thin small cap with slippage
  - Overnight gaps vs stops
  - Trailing stops tight vs wide
  - Sizing through a drawdown
  - Sideways time decay vs shares

## Deficits filled this round

- **Scenario library:** `src/lib/academy/paper/desk/simLibrary.ts`.
  - Prices come from `simGen.ts`, a seeded generator; a few numbers per path keep the bundle small.
  - Statements come from `quarterSeries`.
- **Goals:** `goals.ts`, with 76 goals across the scenarios.
  - Kinds: stops on entries, max risk %, max drawdown, flat at a bar, used an order type, max trades, traded, finished positive.
- **Debrief and journal:** `DeskDebrief.tsx`.
  - Notes are saved in the session log under `notes["debrief-<i>"]`.
- **Walkthrough:** `tour.ts` (`DESK_TOUR`) and `data-tour` targets in `DeskSession.tsx`.
- **Quiz:** `src/lib/deskQuiz.ts`, 24 questions with answers spread evenly across A–D, each linked to a glossary term.
- **Glossary:** `src/lib/deskTerms.ts`, 10 new terms:
  - dividend
  - ex-dividend date
  - stock split
  - share buyback
  - merger arbitrage
  - insider buying
  - analyst rating
  - going concern
  - restatement
  - sector rotation
- **Progress map:** `hub:desk` plus the `quiz:paper-desk` stage.
- **Dividends:** credited in `replayDeskDetailed` to holders at the prior close on the ex-date; shorts pay them.

## Still open (next grade steps)

- Daily bars only, so there is no intraday tape for flash crashes or the Fed decision.
- No options trading on the desk; time decay is taught through desk notes.
- Goals are pass/fail per scenario with no points or badges.
- The journal stays on the device with no export.
- The historical scenario has 3 symbols and one year.
- The chart has no text alternative beyond the watchlist and fills tables.
