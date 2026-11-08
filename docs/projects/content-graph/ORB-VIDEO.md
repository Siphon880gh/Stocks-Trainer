# ORB video integration

Researched and implemented locally on 2026-11-07. No commit or push.

## Source and evidence quality

- [The MOST Popular Day Trading Strategy on the Internet Explained (ORB Model)](https://www.youtube.com/watch?v=UI-N7X15bFo), Peachy Investor, 31:49.
- TubeAlfred tools used in order: `youtube_url_resolve`, `youtube_video_get`, `youtube_video_transcript`. All fulfilled. Transcript language was **English (auto-generated)**; caption segments cover 0:00 through 31:46. This is transcript-based research, not verification of chart pixels or spoken audio. Caption spelling/number transcription can be imperfect.
- The examples in the app are hand-authored **SIMULATED stock prices**, not historical quotes, video trade reproductions, or a backtest of the creator's method.

## Evidence to implementation

| Source position | Transcript-supported lesson | In-app application |
| --- | --- | --- |
| 3:27–5:19 | Opening range versus execution timeframe; fast one-minute entries are not the same as a longer window | Explain window versus candle timeframe; use five-minute stock bars |
| 10:56–12:19 | High/low of three five-minute candles form a fifteen-minute range | 15/30 selector, completion gate, frozen levels, no future bars |
| 13:00–15:07 | Closes outside can reverse; full-range stop can be expensive | Failed-break drill and structural versus full-range risk comparison |
| 15:09–16:04 | Return inside after a failed break can support rotation hypotheses | Failed upside break -> lower high; midpoint/edge are conditional references |
| 16:06–17:34 | Inside/outside behavior helps frame range versus trend context | Context paragraph and ORB-22; explicitly a hypothesis, not a full-day forecast |
| 18:49–20:01 | Combine fifteen-minute boundaries with a completed thirty-minute range; premarket adds context | Layer completed 15m levels on 30m view; incomplete windows cannot leak final extremes |
| 20:28–21:50 | Reaction candles, higher lows/lower highs, midpoint and boundaries | Midpoint glossary, replay narrative, decision drills |
| 21:53–22:58 | Retest + higher support + renewed high break differs from failure + re-entry + lower high | Two contrasted chart scenarios and ORB-17/18 |
| 23:28–25:59 | Other key price levels can add context | Context explanation; no automatic size increase for confluence |
| 26:23–28:29 | Initial down leg -> midpoint rejection/lower high -> range-low reference | Bearish midpoint drill and small-reward/risk skip lesson |

## Accurate selection, not claim laundering

No profitability, win-rate, backtest or payout claims are reproduced. No sponsorship, prop-firm recommendation or paid-indicator dependency. The video's precise premarket interval is not defined in captions, so no interval is invented. Historical-inventor assertions are not needed for the lesson and are not reproduced.

At 26:12 the transcript equates ES and SPY; they are distinct instruments sharing S&P 500 exposure. The implementation stays stock-first and does not equate futures contracts, shares or options. No reader-facing correction banner is added. The creator's suggestion to increase size with confluence is not adopted: the lab fixes a dollar-risk/notional cap and explains fill risk. Waiting for confirmation can miss a move and still lose.

The pre-existing reel-based model remains clearly separate: 30-minute range built from two fifteen-minute candles, close-only entry, opposite-edge stop and 1:1 underlying target. Its old quiz/case/coach references remain valid. The video variant does not silently rewrite these rules. New questions ORB-15–22 specify their window/timeframe or hypothetical numbers; old questions retain their original scenario context.

## Independent sources fetched and read

- [NYSE hours and calendars](https://www.nyse.com/markets/hours-calendars): cash-session open is 06:30 Pacific; a 15-minute window completes at 06:45 Pacific and a 30-minute window at 07:00 Pacific. New lab labels are Pacific bar START times. Existing legacy tapes retain their explicitly labeled Eastern clock.
- [FINRA frequent intraday trading basics](https://www.finra.org/investors/investing/investment-products/stocks/day-trading): significant losses, costs, settlement/account requirements and leverage risk. These support risk cautions, not profitability of ORB. No new fixed PDT threshold claim is made.
- [Investor.gov stop order](https://www.investor.gov/introduction-investing/investing-basics/glossary/stop-order): a triggered stop becomes a market order; execution can differ from the trigger price.
- [CME E-mini S&P 500](https://www.cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html): ES is a futures contract, not SPY shares. Used for source selection, not to add futures trading to this stock lesson.

All four pages were opened successfully during this task. These sources establish mechanics/risk, not a validated strategy edge. A guessed Investor.gov order-types URL returned 404 and was discarded, not cited as evidence.

## Surface map and design choices

- `/practice/opening-range`: main new context lab, three decide/reveal simulations, five-step Prev/Next portal narrative, freeze/no-lookahead demonstration, window layering, and risk/buying-power calculator. Existing close-only drills follow below with separate labeling. Completion now requires answering both sections; existing saved done flags are not deleted.
- `/training?group=opening-range&start=1`: direct concept links now infer the Concepts category when no explicit hash is supplied (the default Patterns category previously overrode valid concept-group queries). Eight additional concept/chart/numeric questions; total 22. Three decision-only chart keys register through existing `ORB_OHLC` -> `PATTERN_OHLC`; no future tape leaks into quiz charts.
- `/archive?tab=literacy&open=orb-midpoint` and `orb-failed-break`: two additional terms; general ORB definition describes a family, not one universal stop/target rule. Flashcards inherit glossary entries automatically.
- `/playbooks/orb-context-confirmation`: credited video, substantive process explanation, risk sources and links to the interactive lab. Reused Coach/Case panels explicitly describe the separate legacy variant. The general index-proxy chart is labeled as context, not a video trade.
- Academy support/resistance unit: related practice ref brings the opening-range application into the existing level without adding a duplicate unit.
- Training practice catalog and `/map`: existing opening-range node automatically inherits its expanded title and existing lab -> quiz prerequisites; no duplicate progress key or new unlock graph.
- Reuse `Walkthrough` and `zLayers`; exit removes the backdrop and leaves chart/replay controls interactive. The ORB narrative belongs beside its time-gated chart rather than duplicating the technique-narratives page's separate indicator backtests.

## Validation

Pure tests cover completion, frozen extremes, midpoint, 15/30 separation, malformed inputs, decision-only chart registration, tape structure, winning/losing aftermaths, cost-adjusted risk, invalid inputs, notional caps and UI anti-spoiler state. Browser coverage checks desktop/mobile replay, selector, Prev/Next, top-layer narrative, exit, locked answers, risk inputs, all three scores and completion only after both sections. See final delivery for actual run outcomes and any unrelated baseline issues.

### Actual local validation results

- Final ORB-focused browser run: **170 checks, 0 failed**, at 390px and 1280px. It exercises all 22 quiz questions and explanations, glossary/playbook deep links, the replay/narrative/risk lab, and completion. Screenshots reviewed at both responsive sizes.
- Library: **497/497**; coaching **25/25**; financials **333/333**; macro **72/72**; Academy **207/207**. Production build passes (existing large-chunk warning).
- `npm run verify` stops at four TS2322 errors in unchanged `src/components/AppChrome.tsx` lines 117–120 (`key` on MenuGroup props). The file matches the initial HEAD; no unrelated header/type-dependency edit was made.
- Final broad e2e after the category fix: **997 checks, 36 failures**. Both ORB flows pass at both widths; the earlier quiz pass-mark failures are gone. Remaining failures are unrelated legacy UI assumptions: 32 catalog-text assertions read the carousel-hidden quiz panel (PanelCarousel defaults to the Academy slide without a hash), two route tests force-click the first hidden Cases menu link, and two map tests wait for removed `nav-map` instead of the Dashboard menu. These navigation/carousel changes already exist in commits 04fd983 and 7b7411c; those components are untouched by this task. No ORB regression was found. Broad log: `/Users/wengffung/agent-tools/orb-e2e-broad-final.log`.
- `git diff --check` and the prohibited-name scan across `src` are clean. No commits, pushes or PRs.
