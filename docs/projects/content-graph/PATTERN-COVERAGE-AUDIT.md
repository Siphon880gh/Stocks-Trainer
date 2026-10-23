# Pattern coverage audit

Every pattern name on every source the course was built from, and where the app teaches it.
The data lives in `src/lib/patternSourceNames.ts`; `src/lib/patternCoverage.test.ts` fails if any name has no
target, points at a pattern or glossary id that does not exist, or is excluded without a reason. Tables below are
generated from that file.

Sources: the chart-patterns poster (dark, 6 sections), the white candle + chart cheat sheet, the single-candle
meaning cards, the hand-drawn sheet, the Buy/Sell sheet, the wick sheet, the smart-money sheet, the trend /
supply-demand / price-action sheets, the candlestick grid, the pattern-app screens, the candlestick PDF, the
essential-16 article (see `IG-16-AUDIT.md`) and the 17-themes text. Images that are not pattern sources (a market
chart, broker screenshots) are listed under exclusions. The cash-flow diagram maps to the cash-flow-statement lessons.

## The seven poster names researched in r27

| Poster name | What it is (source) | In the app |
|---|---|---|
| Tweezer Star | A tweezer top whose second candle is a shooting star with the matching high (srading.com "shooting star tweezers") | `tweezer-star` candle, new |
| Trend Stage Bounce | A Stage 2 pullback to the rising trend line / moving average that holds (EBC Weinstein stage analysis; StockCharts trend lines) | `trend-stage-bounce`, new |
| Parallelogram | The flag's parallel channel: a flag is a small parallelogram against the pole (Babypips) | alias of `bull-flag` / `bear-flag` ("Also called") |
| Three Stage Pattern | Measured move: leg, counter-trend correction, equal second leg (thepatternsite.com mmu / mmd) | `measured-move-up`, `measured-move-down`, new |
| On Neckline (ascending / descending) | The breakout retest of a neckline: throwback (bullish) / pullback (bearish) (thepatternsite.com throwbacks / pullbacks) | `neckline-retest-bullish`, `neckline-retest-bearish`, new |
| Square Bottom | Rectangle bottom: a flat range after a decline that breaks up (thepatternsite.com rectbots) | `rectangle-bottom`, new |
| Step Top / Step Bottom | The first step of a staircase: lower high + lower low after a rally / higher low + higher high after a decline (trading-charts.com staircase patterns) | `step-top`, `step-bottom`, new |

Other poster names that had no pattern before r27 and were added: Trend Line Breakdown (`trendline-breakdown`),
3 Push Pattern bullish (`bullish-three-pushes`), Breakaway Gap (Descending) (`bearish-breakaway-gap`) and
Runaway Gap (Bearish) (`bearish-runaway-gap`). Full URLs: `/workspace/research/r27/SOURCES.md` on the build box and
`CHART_BOOK_SOURCES` in `src/lib/chartPatternBook.ts`.

## Mapping decisions

- Poster labels that combine a shape with the opposite bias (e.g. "Rising Wedge (Bullish)", "Falling Wedge (Bearish)")
  map to the wedge itself; the app teaches the rising wedge as bearish and the falling wedge as bullish.
- "Shonging Man" (garbled label) is drawn as two equal peaks joined by a line, so it maps to `double-top`.
- Megaphone and expanding triangle map to the broadening patterns; H&S top / bottom variations to the complex H&S.
- Concepts that are not single patterns (BOS, order block, breaker block, liquidity, trend structure, support and
  resistance, belt hold, umbrella, NR bar, entry / stop / target) map to their glossary terms.
- Bullish / bearish spinning top both map to `spinning-top` (one neutral pattern); bullish harami to `harami`.

## Exclusions

| Item | Reason |
|---|---|
| Market chart screenshot, broker (Webull) screenshots, app screenshots without pattern labels | Not pattern sources: no pattern names on them. |

## Totals

| | Count |
|---|---|
| Sources | 13 |
| Source name rows (a name repeated on several sheets counts once per sheet) | 363 |
| Distinct names | 257 |
| Rows mapped to a pattern | 336 |
| Rows mapped only to a glossary term (concepts, not single patterns) | 27 |
| Rows that needed a pattern added in r27 | 17 (13 new patterns) |
| Excluded with a reason | 0 |
| Missing | 0 |

## Chart-patterns poster (dark, 6 sections) (`poster-dark`, 107 names)

| Source name | Taught as |
|---|---|
| Double Bottom | `double-bottom` (Double Bottom) |
| Inverse Head & Shoulders | `inverse-head-shoulders` (Inverse Head and Shoulders) |
| Cup With Handle | `cup-and-handle` (Cup and Handle) |
| Rounding Bottom (Shallow) | `rounding-bottom` (Rounding Bottom (Saucer)) |
| Rounding Bottom (Deep) | `rounding-bottom` (Rounding Bottom (Saucer)) |
| Bull Flag | `bull-flag` (Bull Flag) |
| Bull Pennant | `bull-pennant` (Bull Pennant) |
| Falling Wedge (Bullish) | `falling-wedge` (Falling Wedge) |
| Rising Wedge (Bullish) | `rising-wedge` (Rising Wedge) |
| Ascending Triangle | `ascending-triangle` (Ascending Triangle) |
| Three White Soldiers | `three-white-soldiers` (Three White Soldiers) |
| Morning Star | `morning-star` (Morning Star) |
| Piercing Line | `piercing-line` (Piercing Line) |
| Bullish Engulfing | `bullish-engulfing` (Bullish Engulfing) |
| Tweezer Bottom | `tweezer-bottom` (Tweezer Bottom) |
| Hammer | `hammer` (Hammer) |
| Dragonfly Doji | `dragonfly-doji` (Dragonfly Doji) |
| Three Inside Up | `three-inside-up` (Three Inside Up) |
| Bullish Kicker | `bullish-kicker` (Bullish Kicker) |
| Double Top | `double-top` (Double Top) |
| Head & Shoulders | `head-shoulders` (Head and Shoulders) |
| Inverse Cup With Handle | `inverse-cup-and-handle` (Inverted Cup and Handle) |
| Rounding Top | `rounding-top` (Rounding Top) |
| Bear Flag | `bear-flag` (Bear Flag) |
| Bear Pennant | `bear-pennant` (Bear Pennant) |
| Rising Wedge (Bearish) | `rising-wedge` (Rising Wedge) |
| Rectangle (Bearish) | `bearish-rectangle` (Bearish Rectangle) |
| Descending Triangle | `descending-triangle` (Descending Triangle) |
| Three Black Crows | `three-black-crows` (Three Black Crows) |
| Evening Star | `evening-star` (Evening Star) |
| Bearish Engulfing | `bearish-engulfing` (Bearish Engulfing) |
| Tweezer Top | `tweezer-top` (Tweezer Top) |
| Tweezer Star | `tweezer-star` (Tweezer Star) **new in r27** |
| Shonging Man (drawn as two equal peaks) | `double-top` (Double Top) |
| Hanging Man (Strong) | `hanging-man` (Hanging Man) |
| Gravestone Doji | `gravestone-doji` (Gravestone Doji) |
| Three Inside Down | `three-inside-down` (Three Inside Down) |
| Bearish Kicker | `bearish-kicker` (Bearish Kicker) |
| Ascending Triangle (continuation) | `ascending-triangle` (Ascending Triangle) |
| Bull Flag (continuation) | `bull-flag` (Bull Flag) |
| Bull Pennant (continuation) | `bull-pennant` (Bull Pennant) |
| Rising Wedge (Bullish, continuation) | `rising-wedge` (Rising Wedge) |
| Bullish Wedge | `falling-wedge` (Falling Wedge) |
| Bullish Rectangle | `bullish-rectangle` (Bullish Rectangle) |
| Cup With Handle (Continuation) | `cup-and-handle` (Cup and Handle) |
| Falling Wedge (Breakout) | `falling-wedge` (Falling Wedge) |
| 3 Push Pattern | `bullish-three-pushes` (Three Pushes Down) **new in r27** |
| Megaphone (Bullish) | `broadening-bottom` (Broadening Bottom) |
| High Tight Flag | `high-tight-flag` (High and Tight Flag) |
| Pole & Flag (Bullish) | `bull-flag` (Bull Flag) |
| Uptrend Channel | `ascending-channel` (Ascending Channel) |
| Parallelogram (Bullish) | `bull-flag` (Bull Flag) |
| Trend Stage Bounce | `trend-stage-bounce` (Trend Stage Bounce) **new in r27** |
| Three Stage Pattern (bullish) | `measured-move-up` (Measured Move Up (Three-Stage Pattern)) **new in r27** |
| On Neckline (Ascending) | `neckline-retest-bullish` (Neckline Retest (Bullish Throwback)) **new in r27** |
| Breakaway Gap (Bullish) | `breakaway-gap` (Breakaway Gap) |
| Runaway Gap (Bullish) | `runaway-gap` (Runaway (Measuring) Gap) |
| Descending Triangle (continuation) | `descending-triangle` (Descending Triangle) |
| Bear Flag (continuation) | `bear-flag` (Bear Flag) |
| Bear Pennant (continuation) | `bear-pennant` (Bear Pennant) |
| Rising Wedge (Bearish, continuation) | `rising-wedge` (Rising Wedge) |
| Bearish Wedge | `rising-wedge` (Rising Wedge) |
| Bearish Rectangle | `bearish-rectangle` (Bearish Rectangle) |
| Inverse Cup With Handle (Cont.) | `inverse-cup-and-handle` (Inverted Cup and Handle) |
| Falling Wedge (Bearish) | `falling-wedge` (Falling Wedge) |
| 3 Push Pattern (Bearish) | `three-pushes` (Three Pushes) |
| Megaphone (Bearish) | `broadening-top` (Broadening Top (Megaphone)) |
| Low Tight Flag | `low-tight-flag` (Low Tight Flag) |
| Pole & Flag (Bearish) | `bear-flag` (Bear Flag) |
| Downtrend Channel | `descending-channel` (Descending Channel) |
| Trend Line Breakdown | `trendline-breakdown` (Trend Line Breakdown) **new in r27** |
| Three Stage Pattern (bearish) | `measured-move-down` (Measured Move Down (Three-Stage Pattern)) **new in r27** |
| On Neckline (Descending) | `neckline-retest-bearish` (Neckline Retest (Bearish Pullback)) **new in r27** |
| Breakaway Gap (Descending) | `bearish-breakaway-gap` (Breakaway Gap (Bearish)) **new in r27** |
| Runaway Gap (Bearish) | `bearish-runaway-gap` (Runaway Gap (Bearish)) **new in r27** |
| Island Reversal (Bearish) | `island-top` (Island Top (Island Reversal)) |
| Climax Volume | `selling-climax` (Selling Climax); `blow-off-top` (Blow-Off Top) |
| Volume Dry Up | `volume-dry-up` (Volume Dry-Up) |
| Volume Breakout | `breakout-volume` (Breakout on Volume) |
| Volume Confirmation | `breakout-volume` (Breakout on Volume); glossary `volume` (Volume) |
| Volume Increasing In Uptrend | glossary `volume` (Volume) |
| Volume Decreasing In Uptrend | `volume-divergence` (Volume Divergence) |
| Volume Spike | glossary `volume-spike` (Volume spike) |
| Volume on Breakout | `breakout-volume` (Breakout on Volume) |
| Volume Exhaustion | `selling-climax` (Selling Climax); `blow-off-top` (Blow-Off Top) |
| Volume Reversal | `selling-climax` (Selling Climax); glossary `volume-spike` (Volume spike) |
| Symmetrical Triangle | `triangle` (Triangle) |
| Expanding Triangle | `broadening-top` (Broadening Top (Megaphone)); glossary `expanding-triangle` (Expanding triangle) |
| Diamond Top | `diamond-top` (Diamond Top) |
| Diamond Bottom | `diamond-bottom` (Diamond Bottom) |
| Triple Top | `triple-top` (Triple Top) |
| Triple Bottom | `triple-bottom` (Triple Bottom) |
| Broadening Top | `broadening-top` (Broadening Top (Megaphone)) |
| Broadening Bottom | `broadening-bottom` (Broadening Bottom) |
| Broadening Bottom Rising | `broadening-bottom` (Broadening Bottom) |
| H&S Top Variation | `complex-head-shoulders` (Complex Head and Shoulders Top) |
| H&S Bottom Variation | `complex-inverse-head-shoulders` (Complex Head and Shoulders Bottom) |
| W Shape (Double Bottom) | `double-bottom` (Double Bottom) |
| M Shape (Double Top) | `double-top` (Double Top) |
| Round Top | `rounding-top` (Rounding Top) |
| Round Bottom | `rounding-bottom` (Rounding Bottom (Saucer)) |
| Square Bottom | `rectangle-bottom` (Rectangle Bottom (Square Bottom)) **new in r27** |
| V Bottom | `v-bottom` (V Bottom (Spike Reversal)) |
| Step Top | `step-top` (Step Top) **new in r27** |
| Step Bottom | `step-bottom` (Step Bottom) **new in r27** |
| Cup & Handle (Deep) | `cup-and-handle` (Cup and Handle) |
| Cup & Handle (Shallow) | `cup-and-handle` (Cup and Handle) |

## Candlestick + chart cheat sheet (white) (`sheet-white`, 30 names)

| Source name | Taught as |
|---|---|
| Doji | `doji` (Doji) |
| Dragonfly doji | `dragonfly-doji` (Dragonfly Doji) |
| Gravestone doji | `gravestone-doji` (Gravestone Doji) |
| Hammer | `hammer` (Hammer) |
| Inverted hammer | `inverted-hammer` (Inverted Hammer) |
| Bullish spinning top | `spinning-top` (Spinning Top) |
| Bearish spinning top | `spinning-top` (Spinning Top) |
| Bullish Marubozu | `white-marubozu` (White Marubozu) |
| Bearish Marubozu | `black-marubozu` (Black Marubozu) |
| Bullish kicker | `bullish-kicker` (Bullish Kicker) |
| Bearish kicker | `bearish-kicker` (Bearish Kicker) |
| Bearish engulfing | `bearish-engulfing` (Bearish Engulfing) |
| Piercing line | `piercing-line` (Piercing Line) |
| Dark cloud cover | `dark-cloud-cover` (Dark Cloud Cover) |
| Tweezer bottom | `tweezer-bottom` (Tweezer Bottom) |
| Tweezer top | `tweezer-top` (Tweezer Top) |
| Bullish Harami | `harami` (Harami) |
| Morning star | `morning-star` (Morning Star) |
| Bullish abandoned baby | `bullish-abandoned-baby` (Bullish Abandoned Baby) |
| Bearish abandoned baby | `bearish-abandoned-baby` (Bearish Abandoned Baby) |
| Three white soldiers | `three-white-soldiers` (Three White Soldiers) |
| Three black crows | `three-black-crows` (Three Black Crows) |
| Three line strike | `bullish-three-line-strike` (Bullish Three-Line Strike); `bearish-three-line-strike` (Bearish Three-Line Strike) |
| Double top | `double-top` (Double Top) |
| Cup and handle | `cup-and-handle` (Cup and Handle) |
| Double bottom | `double-bottom` (Double Bottom) |
| Wedge | `rising-wedge` (Rising Wedge); `falling-wedge` (Falling Wedge) |
| Flag | `bull-flag` (Bull Flag); `bear-flag` (Bear Flag) |
| Rising window | `rising-window` (Rising Window) |
| Falling window | `falling-window` (Falling Window) |

## Single-candle meaning cards (`phone-ads`, 4 names)

| Source name | Taught as |
|---|---|
| Price rejected | glossary `wick-rejection` (Price rejected (long wick)) |
| Price stability | glossary `full-body-candle` (Price stability (full body, tiny wicks)) |
| Indecision | glossary `indecision-candle` (Indecision (small body, wicks both sides)) |
| Strong movement | glossary `strong-move-candle` (Strong movement (bulls win / bears win)) |

## Hand-drawn candle sheet (`hand-drawn`, 18 names)

| Source name | Taught as |
|---|---|
| Hammer | `hammer` (Hammer) |
| Bullish Engulfing | `bullish-engulfing` (Bullish Engulfing) |
| Piercing Pattern | `piercing-line` (Piercing Line) |
| Tweezer Bottom | `tweezer-bottom` (Tweezer Bottom) |
| Morning Star | `morning-star` (Morning Star) |
| Shooting Star | `shooting-star` (Shooting Star) |
| Bearish Engulfing | `bearish-engulfing` (Bearish Engulfing) |
| Dark Cloud Cover | `dark-cloud-cover` (Dark Cloud Cover) |
| Tweezer Top | `tweezer-top` (Tweezer Top) |
| Evening Star | `evening-star` (Evening Star) |
| Spinning Top | `spinning-top` (Spinning Top) |
| Doji | `doji` (Doji) |
| Dragonfly Doji | `dragonfly-doji` (Dragonfly Doji) |
| Gravestone Doji | `gravestone-doji` (Gravestone Doji) |
| Rising Three Method | `rising-three-methods` (Rising Three Methods) |
| Falling Three Method | `falling-three-methods` (Falling Three Methods) |
| Bullish Harami | `harami` (Harami) |
| Bearish Harami | `bearish-harami` (Bearish Harami) |

## Buy / Sell candle sheet (`buy-sell-sheet`, 11 names)

| Source name | Taught as |
|---|---|
| Bearish Harami | `bearish-harami` (Bearish Harami) |
| Three Inside Up | `three-inside-up` (Three Inside Up) |
| Three Inside Down | `three-inside-down` (Three Inside Down) |
| Bearish Kicker | `bearish-kicker` (Bearish Kicker) |
| Three Black Crows | `three-black-crows` (Three Black Crows) |
| Three Outside Up | `three-outside-up` (Three Outside Up) |
| Three Outside Down | `three-outside-down` (Three Outside Down) |
| Morning Star | `morning-star` (Morning Star) |
| Piercing Line | `piercing-line` (Piercing Line) |
| Bullish Abandoned Baby | `bullish-abandoned-baby` (Bullish Abandoned Baby) |
| Dark Cloud Cover | `dark-cloud-cover` (Dark Cloud Cover) |

## Candle colour and wick sheet (`wick-sheet`, 6 names)

| Source name | Taught as |
|---|---|
| Bullish Candle | `long-green-candle` (Long Green Candle); glossary `candle-color` (Green vs Red candles) |
| Bearish Candle | `long-red-candle` (Long Red Candle); glossary `candle-color` (Green vs Red candles) |
| Long Lower Wick | glossary `wick-rejection` (Price rejected (long wick)) |
| Long Upper Wick | glossary `wick-rejection` (Price rejected (long wick)) |
| Bullish Engulfing | `bullish-engulfing` (Bullish Engulfing) |
| Bearish Engulfing | `bearish-engulfing` (Bearish Engulfing) |

## Smart-money concepts sheet (`smc-sheet`, 5 names)

| Source name | Taught as |
|---|---|
| BOS | glossary `break-of-structure` (Break of structure (BOS)) |
| LIQ | glossary `liquidity-sweep` (Liquidity sweep) |
| OB | glossary `order-block` (Order block (and exit order block)) |
| Exit OB | glossary `order-block` (Order block (and exit order block)) |
| Breaker Block | glossary `breaker-block` (Breaker block) |

## Trend structure, supply/demand and price-action framework sheets (`structure-sheets`, 15 names)

| Source name | Taught as |
|---|---|
| UpTrend (HH, HL) | glossary `market-structure` (Market structure (HH, HL, LH, LL)) |
| DownTrend (LH, LL) | glossary `market-structure` (Market structure (HH, HL, LH, LL)) |
| Supply zone | `supply-zone` (Supply Zone) |
| Demand zone | `demand-zone` (Demand Zone) |
| Support | glossary `support-resistance` (Support and Resistance) |
| Resistance | glossary `support-resistance` (Support and Resistance) |
| Sideways range | glossary `trend-vs-range` (Trend vs Range) |
| Breakout & retest | glossary `breakout-retest` (Breakout and retest) |
| Entry / stop loss / target | glossary `risk-reward` (Entry, stop loss, target and R:R) |
| Candle confirmation | glossary `pattern-confirmation` (Confirmation & invalidation) |
| Entry signal: breakout, pullback, reversal | glossary `entry-types` (Entry types: breakout, pullback, reversal) |
| Stop-loss | glossary `risk-reward` (Entry, stop loss, target and R:R); glossary `stop-order` (Stop order) |
| Trailing stop | glossary `trailing-stop` (Trailing stop) |
| Profit target | glossary `taking-profit` (Profit target and taking profit) |
| Cash flow diagram | glossary `cash-flow-statement` (Cash flow statement); taught in the Statements lab (cash-flow statement table and reader) and the financials cash-flow lessons |

## Candlestick grid (single, two and three candles) (`candle-grid`, 51 names)

| Source name | Taught as |
|---|---|
| Long Green Candle | `long-green-candle` (Long Green Candle) |
| Long Red Candle | `long-red-candle` (Long Red Candle) |
| Short Green Candle | `short-green-candle` (Short Green Candle) |
| Short Red Candle | `short-red-candle` (Short Red Candle) |
| Green Marubozu | `white-marubozu` (White Marubozu) |
| Red Marubozu | `black-marubozu` (Black Marubozu) |
| Bullish Closing Marubozu | `bullish-closing-marubozu` (Bullish Closing Marubozu) |
| Bearish Closing Marubozu | `bearish-closing-marubozu` (Bearish Closing Marubozu) |
| Bullish Opening Marubozu | `bullish-opening-marubozu` (Bullish Opening Marubozu) |
| Bearish Opening Marubozu | `bearish-opening-marubozu` (Bearish Opening Marubozu) |
| Spinning Top | `spinning-top` (Spinning Top) |
| Doji | `doji` (Doji) |
| Long Legged Doji | `long-legged-doji` (Long-Legged Doji) |
| Cross Doji | `cross-doji` (Cross Doji) |
| Inverted Cross Doji | `inverted-cross-doji` (Inverted Cross Doji) |
| Dragonfly | `dragonfly-doji` (Dragonfly Doji) |
| Gravestone | `gravestone-doji` (Gravestone Doji) |
| Hammer | `hammer` (Hammer) |
| Hanging Man | `hanging-man` (Hanging Man) |
| Inverted Hammer | `inverted-hammer` (Inverted Hammer) |
| Bullish Engulfing | `bullish-engulfing` (Bullish Engulfing) |
| Bearish Engulfing | `bearish-engulfing` (Bearish Engulfing) |
| Piercing Pattern | `piercing-line` (Piercing Line) |
| Dark Cloud Cover | `dark-cloud-cover` (Dark Cloud Cover) |
| Bullish Harami | `harami` (Harami) |
| Bearish Harami | `bearish-harami` (Bearish Harami) |
| Bullish Kicker | `bullish-kicker` (Bullish Kicker) |
| Bearish Kicker | `bearish-kicker` (Bearish Kicker) |
| Morning Star | `morning-star` (Morning Star) |
| Evening Star | `evening-star` (Evening Star) |
| Bearish Abandoned Baby | `bearish-abandoned-baby` (Bearish Abandoned Baby) |
| Bullish Tri Star | `bullish-tri-star` (Bullish Tri-Star) |
| Bearish Tri Star | `bearish-tri-star` (Bearish Tri-Star) |
| 3 White Soldiers | `three-white-soldiers` (Three White Soldiers) |
| 3 Black Crows | `three-black-crows` (Three Black Crows) |
| Upside Gap Two Crows | `upside-gap-two-crows` (Upside Gap Two Crows) |
| Two Crows | `two-crows` (Two Crows) |
| Three Inside Up | `three-inside-up` (Three Inside Up) |
| Three Inside Down | `three-inside-down` (Three Inside Down) |
| Three Outside Up | `three-outside-up` (Three Outside Up) |
| Three Outside Down | `three-outside-down` (Three Outside Down) |
| Bearish Meeting Lines | `bearish-counterattack` (Bearish Counterattack); glossary `meeting-lines` (Meeting lines (= counterattack lines)) |
| Bullish Breakaway | `bullish-breakaway` (Bullish Breakaway) |
| Bearish Breakaway | `bearish-breakaway` (Bearish Breakaway) |
| Downside Tasuki Gap | `downside-tasuki-gap` (Downside Tasuki Gap) |
| Falling Three Method | `falling-three-methods` (Falling Three Methods) |
| Rising Three Method | `rising-three-methods` (Rising Three Methods) |
| Bearish Separating Lines | `bearish-separating-lines` (Bearish Separating Lines) |
| Bullish Separating Lines | `bullish-separating-lines` (Bullish Separating Lines) |
| Bearish Side By Side White Lines | `bearish-side-by-side-white-lines` (Bearish Side-by-Side White Lines) |
| Bullish Side By Side White Lines | `bullish-side-by-side-white-lines` (Bullish Side-by-Side White Lines) |

## Pattern app screens (bullish / bearish lists, crypto list, two-candle list) (`app-screens`, 38 names)

| Source name | Taught as |
|---|---|
| Piercing | `piercing-line` (Piercing Line) |
| Bullish Belt Hold | `bullish-opening-marubozu` (Bullish Opening Marubozu); glossary `belt-hold` (Belt Hold) |
| Bearish Belt Hold | `bearish-opening-marubozu` (Bearish Opening Marubozu); glossary `belt-hold` (Belt Hold) |
| Bullish Counterattack | `bullish-counterattack` (Bullish Counterattack) |
| Bearish Counterattack | `bearish-counterattack` (Bearish Counterattack) |
| Upside Gap Two Crows | `upside-gap-two-crows` (Upside Gap Two Crows) |
| Bullish Three Line Strike | `bullish-three-line-strike` (Bullish Three-Line Strike) |
| Bearish Three Line Strike | `bearish-three-line-strike` (Bearish Three-Line Strike) |
| Rising Three Methods | `rising-three-methods` (Rising Three Methods) |
| Falling Three Methods | `falling-three-methods` (Falling Three Methods) |
| Three Stars in the South | `three-stars-in-the-south` (Three Stars in the South) |
| Bullish Mat Hold | `mat-hold` (Mat Hold) |
| Bearish Mat Hold | `bearish-mat-hold` (Bearish Mat Hold) |
| Advance Block | `advance-block` (Advance Block) |
| Hammer & Inverted Hammer | `hammer` (Hammer); `inverted-hammer` (Inverted Hammer) |
| Tweezer Bottoms | `tweezer-bottom` (Tweezer Bottom) |
| Dojis | `doji` (Doji) |
| Long bodies | `long-green-candle` (Long Green Candle); `long-red-candle` (Long Red Candle) |
| Short bodies | `short-green-candle` (Short Green Candle); `short-red-candle` (Short Red Candle) |
| Umbrellas | `hammer` (Hammer); `hanging-man` (Hanging Man); glossary `umbrella-line` (Umbrella line) |
| Bear star | `evening-star` (Evening Star); `shooting-star` (Shooting Star) |
| Bull star | `morning-star` (Morning Star); `inverted-hammer` (Inverted Hammer) |
| Double doji | `double-doji` (Double Doji) |
| Doji variation | `gravestone-doji` (Gravestone Doji); `dragonfly-doji` (Dragonfly Doji); `long-legged-doji` (Long-Legged Doji) |
| Harami Bearish | `bearish-harami` (Bearish Harami) |
| Harami Bullish | `harami` (Harami) |
| Harami | `harami` (Harami) |
| Ladder Bottom | `ladder-bottom` (Ladder Bottom) |
| Meeting Line | `bullish-counterattack` (Bullish Counterattack); glossary `meeting-lines` (Meeting lines (= counterattack lines)) |
| Stick Sandwich | `stick-sandwich` (Stick Sandwich) |
| Head and Shoulders | `head-shoulders` (Head and Shoulders) |
| Inverse Head and Shoulders | `inverse-head-shoulders` (Inverse Head and Shoulders) |
| Rising Wedge | `rising-wedge` (Rising Wedge) |
| Falling Wedge | `falling-wedge` (Falling Wedge) |
| Rounding Bottom | `rounding-bottom` (Rounding Bottom (Saucer)) |
| Double Bottom ("W") | `double-bottom` (Double Bottom) |
| Triple Bottom or Rectangle | `triple-bottom` (Triple Bottom); `bullish-rectangle` (Bullish Rectangle) |
| Bullish Wedge | `falling-wedge` (Falling Wedge) |

## Candlestick patterns PDF (`stoxmee-pdf`, 32 names)

| Source name | Taught as |
|---|---|
| Hammer | `hammer` (Hammer) |
| Piercing Pattern | `piercing-line` (Piercing Line) |
| Bullish Engulfing | `bullish-engulfing` (Bullish Engulfing) |
| Morning Star | `morning-star` (Morning Star) |
| Three White Soldiers | `three-white-soldiers` (Three White Soldiers) |
| White Marubozu | `white-marubozu` (White Marubozu) |
| Three Inside Up | `three-inside-up` (Three Inside Up) |
| Bullish Harami | `harami` (Harami) |
| Tweezer Bottom | `tweezer-bottom` (Tweezer Bottom) |
| Inverted Hammer | `inverted-hammer` (Inverted Hammer) |
| Three Outside Up | `three-outside-up` (Three Outside Up) |
| On-Neck | `on-neck` (On-Neck) |
| Bullish Counterattack | `bullish-counterattack` (Bullish Counterattack) |
| Hanging Man | `hanging-man` (Hanging Man) |
| Dark Cloud Cover | `dark-cloud-cover` (Dark Cloud Cover) |
| Bearish Engulfing | `bearish-engulfing` (Bearish Engulfing) |
| Evening Star | `evening-star` (Evening Star) |
| Three Black Crows | `three-black-crows` (Three Black Crows) |
| Black Marubozu | `black-marubozu` (Black Marubozu) |
| Three Inside Down | `three-inside-down` (Three Inside Down) |
| Bearish Harami | `bearish-harami` (Bearish Harami) |
| Shooting Star | `shooting-star` (Shooting Star) |
| Tweezer Top | `tweezer-top` (Tweezer Top) |
| Three Outside Down | `three-outside-down` (Three Outside Down) |
| Bearish Counterattack | `bearish-counterattack` (Bearish Counterattack) |
| Doji | `doji` (Doji) |
| Spinning Top | `spinning-top` (Spinning Top) |
| Falling Three Methods | `falling-three-methods` (Falling Three Methods) |
| Rising Three Methods | `rising-three-methods` (Rising Three Methods) |
| Upside Tasuki Gap | `upside-tasuki-gap` (Upside Tasuki Gap) |
| Downside Tasuki Gap | `downside-tasuki-gap` (Downside Tasuki Gap) |
| Mat-Hold | `mat-hold` (Mat Hold) |

## Essential 16 candlestick patterns article (`ig-16`, 23 names)

| Source name | Taught as |
|---|---|
| Hammer | `hammer` (Hammer) |
| Hanging man | `hanging-man` (Hanging Man) |
| Shooting star | `shooting-star` (Shooting Star) |
| Inverted hammer | `inverted-hammer` (Inverted Hammer) |
| Doji | `doji` (Doji) |
| Gravestone doji | `gravestone-doji` (Gravestone Doji) |
| Dragonfly doji | `dragonfly-doji` (Dragonfly Doji) |
| Long-legged doji | `long-legged-doji` (Long-Legged Doji) |
| Bullish engulfing | `bullish-engulfing` (Bullish Engulfing) |
| Bearish engulfing | `bearish-engulfing` (Bearish Engulfing) |
| Tweezer top | `tweezer-top` (Tweezer Top) |
| Tweezer bottom | `tweezer-bottom` (Tweezer Bottom) |
| Morning star | `morning-star` (Morning Star) |
| Evening star | `evening-star` (Evening Star) |
| Morning doji star | `morning-doji-star` (Morning Doji Star) |
| Evening doji star | `evening-doji-star` (Evening Doji Star) |
| Three white soldiers | `three-white-soldiers` (Three White Soldiers) |
| Three black crows | `three-black-crows` (Three Black Crows) |
| Inside bar | `inside-bar` (Inside Bar (Mother Bar)) |
| Bullish harami | `harami` (Harami) |
| Bearish harami | `bearish-harami` (Bearish Harami) |
| Spinning top | `spinning-top` (Spinning Top) |
| Marubozu | `white-marubozu` (White Marubozu); `black-marubozu` (Black Marubozu) |

## 17 pattern themes text (examples named) (`themes-17`, 23 names)

| Source name | Taught as |
|---|---|
| Separating lines | `bullish-separating-lines` (Bullish Separating Lines); `bearish-separating-lines` (Bearish Separating Lines) |
| Kicker | `bullish-kicker` (Bullish Kicker); `bearish-kicker` (Bearish Kicker) |
| Abandoned baby | `bullish-abandoned-baby` (Bullish Abandoned Baby); `bearish-abandoned-baby` (Bearish Abandoned Baby) |
| Pipe top | `pipe-top` (Pipe Top) |
| Pipe bottom | `pipe-bottom` (Pipe Bottom) |
| Four-price doji | `four-price-doji` (Four-Price Doji) |
| High-wave candle | `high-wave` (High-Wave Candle) |
| Mother bar | `inside-bar` (Inside Bar (Mother Bar)); glossary `mother-bar` (Mother bar) |
| Narrow-range (NR) bar | glossary `narrow-range-bar` (Narrow-range (NR) bar) |
| Broadening formation / megaphone | `broadening-top` (Broadening Top (Megaphone)); `broadening-bottom` (Broadening Bottom) |
| Expanding triangle | `broadening-top` (Broadening Top (Megaphone)); glossary `expanding-triangle` (Expanding triangle) |
| Tasuki gap | `upside-tasuki-gap` (Upside Tasuki Gap); `downside-tasuki-gap` (Downside Tasuki Gap) |
| Island reversal | `island-top` (Island Top (Island Reversal)); `island-bottom` (Island Bottom (Island Reversal)) |
| Common gap | `common-gap` (Common Gap) |
| Breakaway gap | `breakaway-gap` (Breakaway Gap); `bearish-breakaway-gap` (Breakaway Gap (Bearish)) **new in r27** |
| Runaway (measuring) gap | `runaway-gap` (Runaway (Measuring) Gap); `bearish-runaway-gap` (Runaway Gap (Bearish)) **new in r27** |
| Exhaustion gap | `exhaustion-gap` (Exhaustion Gap) |
| Bull trap | `failed-breakout` (Bull Trap (Failed Breakout)); glossary `bull-trap` (Bull trap) |
| Bear trap | `failed-breakdown` (Bear Trap (Failed Breakdown)); glossary `bear-trap` (Bear trap) |
| Blow-off top | `blow-off-top` (Blow-Off Top) |
| Selling climax | `selling-climax` (Selling Climax) |
| Measured move | `measured-move-up` (Measured Move Up (Three-Stage Pattern)) **new in r27**; `measured-move-down` (Measured Move Down (Three-Stage Pattern)) **new in r27**; glossary `measured-move` (Measured move (pattern target)) |
| Retest / throwback | `neckline-retest-bullish` (Neckline Retest (Bullish Throwback)) **new in r27**; `neckline-retest-bearish` (Neckline Retest (Bearish Pullback)) **new in r27**; glossary `pattern-retest` (Retest (throwback / pullback)) |

