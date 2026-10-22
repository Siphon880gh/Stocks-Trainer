# Stock Trainer (ANALYSIS_CORE)

Learn how to **read equities**, **read charts**, and **decide before the aftermath**—with SAMPLE data only (no LIVE / REAL_TIME theater).

**Author:** Weng Fei Fung (Weng)

---

## Start here in 3 choices

1. **Which market?** — what you want to practice on  
2. **Which learning objectives?** — what you want to get better at  
3. **Which path + flows?** — the click-path that unlocks those skills  

Open the app → Home (`/`) → **Choose a path** → confirm.

```bash
npm install
npm run dev
```

App: [http://localhost:3001](http://localhost:3001)

---

## 1. Which market do you want to practice?

### Traditional retail market → **Equities (stocks)**

If you are a retail learner on the **traditional market people trade daily**—listed **stocks / shares** on exchanges (sometimes called the stock market or cash equities)—that market type in this app is labeled **Equities**.

- Paths (**Beginner Equities Path**, **Decision Maker Path**) and graded cases teach that market type first.
- Market filter label: **Class → Equities** (SAMPLE packs such as `AAPL.S`, `SPY.S`, `XOM.S`).

Other market types ship as SAMPLE browse (**E9**). **E10** adds a **Market Navigator** (charts · literacy · decide) and SAMPLE decide-and-reveal packs so you learn by making decisions—still mock data only.

| Market type | Retail nickname | Browse (Market) | Learn / decide (E10) | Good if you want to… |
|-------------|-----------------|-----------------|----------------------|----------------------|
| **Equities** | Stocks / stock market *(traditional retail)* | Class **Equities** packs | Beginner + Decision Maker paths; news + statements drills | Traditional retail track first |
| **Crypto** | Crypto / digital assets | Class **Crypto** (BTC/ETH/SOL SAMPLE) | Navigator → decide packs | Chase/fade / dump-reclaim on SAMPLE |
| **Futures** | Futures | Class **Futures** (e.g. ES/CL SAMPLE) | Navigator → futures cases | Index/commodity-style decisions after equities |
| **Options context** | Options (education only) | Class **Options context** | Context cases only—no chain/Greeks | Underlying into events / vol spike literacy |
| **Forex** | FX / currencies | Class **Forex** (majors SAMPLE) | Navigator → forex cases | Risk-on/off / data-print style SAMPLE FX |
| **Any SAMPLE chart** | — | Provider **SAMPLE** or **DELAYED** | Chart soft-gate before graded cases | Warm up overlays before quizzes/cases |

**Navigate markets:** Home → **Market navigator** → `/market?nav=1` (or Charts header Navigator) → pick type → **View charts** · **Literacy** · **Decide cases**.

---

## 2. Learning objectives (pick what you care about)

| Objective | Plain-language goal | Main surface | Success looks like |
|-----------|---------------------|--------------|--------------------|
| **Path & progress** | Pick a track and see real milestones / PTS / Answer streak (Academy shows a separate Day streak) | Dashboard GoalPicker | Path confirmed; step chrome updates |
| **Equities vocabulary** | Share, exchange, long/short, risk & horizon | Training · **Equities Literacy** | Quiz finished; next milestone unlocks |
| **Statement literacy** | Revenue, profit vs cash, P/E, margin on SAMPLE cards | Training · **Statements Literacy** | Quiz finished; chart gate opens |
| **Chart fluency** | Candles + SMA/EMA/RSI/MACD/Bollinger | Training · **Indicators** (soft-gate) | Graded cases unlock |
| **Earnings decisions** | Beat/miss, margins, cash, guidance — decide then reveal | Cases · **earnings** pack | Process debrief (not “price went up” only) |
| **Headline decisions** | Chase vs fade / company news on equities | Cases · **company-news** pack | **SHORT** only when the case allows it |
| **News literacy** | Rumor vs filing, priced-in, chase vs fade | Training · **news-literacy** (E10) | Quiz finished; terms in Archive |
| **Statements drills** | Extra snapshot practice after path lite quiz | Training · **financial-drills** (E10) | SAMPLE cards; no live filings |
| **Multi-market decisions** | Futures / FX / crypto / options-context SAMPLE cases | Cases filtered by market + Navigator | Decide → reveal → process debrief |
| **Macro / combined (advanced)** | Risk-off, prints, news+statements together | Cases · macro / combined (Decision Maker) | Spine badge when complete |
| **Browse charts anytime** | SAMPLE OHLC + overlays by class | Market (+ Navigator) | Chart renders; honest provider label |
| **Look things up** | Patterns, indicators, literacy terms | Archive | Tabs + deep-links from quizzes |
| **Muscle memory** | Sketch a candle template, get a coarse grade | Practice Draw | Grade + last-attempt restore |
| **Keep progress local** | Name, export/import JSON | Home **Account** | Import restores; no fake cloud sync |
| **Step coaching** *(E11)* | Fail → explain → rewind → succeed on a topic graph | `/coach` catalog + session (no LLM) | Reach a success node; path trail shows choices |
| **Candles & patterns** | Candle anatomy, one-candle reads, the pattern book, advanced & rare patterns | Learn · **Candlestick Basics** · **Reading One Candle** · **Candlestick Pattern Book** · **Advanced & Rare Patterns** | Quiz passed (70%); pattern links open Archive |
| **Buy or Sell?** | Call buy / sell / wait on a pattern or scenario, on large SAMPLE charts | Learn · **Buy or Sell?** | Reveal explains the call and when waiting is right |
| **Price action & trade management** | Supply / demand zones, entry types, stops at invalidation, targets, trailing stops | Learn · **Price Action** · **Supply & Demand Zones** | Quiz passed; plan has an invalidation |
| **Financials & earnings** | Read statements, a 13-week cash forecast, earnings previews and reactions | Learn · **Financials & earnings** card → Statements lab · Read the Print · Mark the Band | Reveal scores the call; nothing about the actuals before it |
| **Macro releases** | Read an economic release, consensus vs actual, how rates / dollar / stocks react | **Macro Desk** (`/macro`) + 5 Learn groups | Lesson done; reaction rounds scored |
| **Beginner Academy** | Webull-style beginner training: short units, checks, paper trading, challenges, rewards | **Academy** (`/academy`) · **Paper trading** (`/paper`) | Units mastered; level test-out; Day streak |
| **Options basics** *(education only)* | Covered calls to spreads, one level at a time | **Options ladder** (`/academy/options`) | Level check passed (80%); approves nothing |
| **Strategy kits** | One setup from an authoritative source: strategy, coaching, case, chart | **Playbooks** (`/playbooks`) | Kit read; linked case / coach opened |
| **Indicator & chart labs** | EMA / SMA / MACD on long charts; levels, lookalikes, invalidation, replay | Practice labs (`/practice/*`) | Lab round scored; done mark on Learn |
| **Oscillators & volatility stops** | RSI, MACD, fast / slow stochastic, KDJ, ATR and an ATR volatility stop; why same-family oscillators are not independent confirmation | **Oscillators & volatility stop** lab (`/practice/oscillators`) + Learn **Oscillators & Volatility Stops** | Computed chart questions answered; indicators treated as support, not signals |
| **Japanese candlesticks & Heikin-Ashi** | Where candle charts came from, the buyer–seller battle in one candle, the core 14 reversal patterns (recognise · psychology · trade), Heikin-Ashi averaged candles and their limits | **Japanese candlesticks** (`/practice/japanese-candles`) · **Heikin-Ashi** lab (`/practice/heikin-ashi`) · Archive core list + Learn **Japanese Candlesticks: Core 14** and **Heikin-Ashi Candles** | Quiz passed (70%); lab questions answered |
| **Float, short-dated options & risk** | Float and float turnover, short-dated option risk, position sizing, why the same market gives different results | Learn **Float, Short-Dated Options & Risk** | Quiz passed (70%) |
| **Squeezes & options flow** | Gamma and dealer hedging, gamma vs short squeezes, short interest, days to cover, open interest, unusual options activity, survivorship bias | **Gamma squeeze case** (`/practice/gamma-squeeze`) + Learn **Squeezes, Options Flow & Survivorship** + Coach **Chasing a squeeze** | Case graded (enter · size · exit); quiz passed (70%) |

---

## 3. Choose a learning path

### A. Beginner Equities Path *(recommended first)*

**Confirm:** **Confirm path · Beginner Equities Path**

| Step | Milestone | Objective | What you do |
|------|-----------|-----------|-------------|
| 1 | E4.M1 Equities Literacy | Vocabulary | Home **Continue** → finish **Equities Literacy** quiz |
| 2 | E4.M2 Statement Snapshot | Statements | **Continue** → **Statements Literacy** (snapshot cards) |
| 3 | E4.M0 Chart Fluency | Chart fluency | **Continue** / **Indicators quiz** → **Indicators** |
| 4 | E5.M3 Earnings Cases | Earnings decisions | **Open cases** → earnings pack → **Lock in and see what happened** |
| 5 | E5.M2 Company News Cases | Headline decisions | Company-news pack → same decide/reveal loop |

**Done:** Home shows **Beginner Equities path complete** (credential copy; progress `5/5`).

### B. Decision Maker Path *(case-heavy)*

**Confirm:** **Confirm path · Decision Maker Path**

Spine: **earnings → company news → market-wide news → news plus financials**.  
You still must pass the **Indicators** quiz (**Indicators quiz** CTA) before graded cases play.

**Done:** **Decision Maker path complete** / **Decision Maker segment**.

Use Home **Account** → **Reset path** (confirm dialog) to return to GoalPicker and switch paths.

### C. Market Explorer Path *(SAMPLE multi-market — E10)*

**Confirm:** GoalPicker **Confirm path · Market Explorer Path**.

Spine: chart gate → futures cases → forex → crypto (options-context tip optional).  
Does **not** replace Beginner Equities for traditional stocks—use it after you can decide on equities SAMPLE.

---

## 4. User flows (by objective)

Follow these in order the first time you learn; later, jump to the objective you need.

| Flow | Objectives | Steps (short) |
|------|------------|---------------|
| **UF-01 First-run** | Path & progress | `/` → GoalPicker → pick path → **Confirm path · …** → see **Continue** / **Indicators quiz** |
| **UF-02 Equities quiz** | Vocabulary | **Continue** → `/training?group=equity-literacy` → finish quiz → Home E4.M1 complete |
| **UF-03 Statements quiz** | Statements | **Continue** → financial-literacy quiz (snapshots) → E4.M2 complete |
| **UF-04 Chart soft-gate** | Chart fluency | Indicators quiz; before finish, `/cases` shows gate banner / locked packs |
| **UF-05 Earnings case** | Earnings decisions | `/cases?pack=earnings` → open case → **BUY/SELL/HOLD** → **Lock in and see what happened** → debrief |
| **UF-06 Company news** | Headline decisions | `/cases?pack=company-news` → decide/reveal; **SHORT** only when the case allows it |
| **UF-07 Beginner credential** | Full Beginner path | UF-02…UF-06 until `5/5` complete → credential on Home |
| **UF-08 Market SAMPLE** | Browse charts | **Charts** → Class **Equities** → toggle overlays → Provider SAMPLE/DELAYED |
| **UF-09 Archive theory** | Lookups | Home **Reference** → Patterns · Indicators · Literacy tabs |
| **UF-10 Practice Draw** | Muscle memory | Home **Draw** → template → draw → grade → reload shows last attempt |
| **UF-11 Decision Maker** | Macro/combined spine | GoalPicker **Decision Maker** → Indicators gate → earnings → news → macro → combined |
| **UF-12 Account / sync stub** | Local progress | Home **Account** → **Sign in** → **Export** / **Import** |
| **UF-13 Lock regression** | No silent skip | Fresh Beginner confirm (no quizzes) → Statements/Indicators **Locked**; cases gated |
| **UF-14 Secondary training** | Extra drills | After gate: pack groups + **Equity Pack Drills** / **Answer sheet** practice |
| **UF-15 Market Navigator** *(E10)* | Jump market types | Home **Market navigator** → type → **View charts** / **Literacy** / **Decide cases** |
| **UF-16 News literacy** *(E10)* | Headline skill | Learn **News Literacy** → finish quiz → Home **News literacy complete** |
| **UF-17 Multi-market case** *(E10)* | Learn by deciding | Navigator → Futures or Forex **Decide cases** → BUY/SELL/HOLD → reveal |
| **UF-18 Step coaching** *(E11)* | Fail-and-learn wizard | `/coach` → open session → **Wrong · review** rewind → **Success** restart |
| **UF-19 Read the Print** *(FE)* | Financials & earnings | Learn **Financials & earnings** → **Read the Print** → call the reaction → follow-through → reveal; Statements lab · Mark the Band |
| **UF-20 Macro Desk** *(MF)* | Macro releases | Learn **Macro Desk** → lesson → **Visit the real source** → SIMULATED look-alike → consensus vs actual → reaction round; `/macro/play` |
| **UF-21 Academy** *(BA)* | Beginner Academy | Home placement card → `/academy` → unit → 3-question check → test-out; **Today in the Academy** card |
| **UF-22 Paper & options** *(BA)* | Paper trading · options basics | `/paper` order ticket → step / auto-play → `/paper/challenges` → `/academy/options` |

Detailed click scripts (exact labels for QA): [`QA_User_Flows.md`](./QA_User_Flows.md). E11 coaching QA is **UF-18**; financials, Macro Desk and Academy are **UF-19**–**UF-22**.

---

## 5. Map: “I want X” → path + flows

| If you want… | Pick | Run these flows |
|--------------|------|-----------------|
| Absolute beginner in stocks | **Beginner Equities** + Equities on Market | UF-01 → UF-02 → UF-03 → UF-04 → UF-05 → UF-06 (UF-07) |
| Faster case practice (already know vocab) | **Decision Maker** | UF-01 (DM) → UF-04 → UF-05 → UF-06 → UF-11 |
| Jump across market types easily | Navigator (E10) | UF-15 → charts or decide |
| News / statements skill depth | Training drills (E10) | UF-16 + financial-drills |
| Futures / FX / crypto decisions (mock) | **Market Explorer** or Navigator decide | UF-04 → UF-17 |
| Guided fail/rewind practice on a topic | **Step coaching** (`/coach`) | UF-18 |
| Only chart / indicator practice | Either path, or Market alone | UF-08, UF-04, UF-10, UF-09 |
| Only theory lookup | Any | UF-09 |
| Save / move progress on this device | Any | UF-12 |
| Brand new to investing, step by step | **Beginner Academy** (`/academy`) | UF-21 → UF-22 |
| Economic releases and rates | **Macro Desk** (`/macro`) | UF-20 |
| Earnings and financial statements | **Financials & earnings** card on Learn | UF-19 + UF-05 |

**Coaching queue:** `step_coaching_order` · epic **E11** · loop [`AGENTS_LOOP-Step-Coaching.md`](./AGENTS_LOOP-Step-Coaching.md).

---

## 6. App map (where things live)

| Route | Role |
|-------|------|
| `/` | Home · GoalPicker · path CTA · Account · Academy placement + **Today** card · Macro tip |
| `/training` | Learn (literacy, indicators, pattern drills, answer sheet) · Macro Desk, Financials & earnings, Academy and practice cards |
| `/market` | Charts · Market navigator · SAMPLE / DELAYED overlays |
| `/archive` | Patterns · Indicators · Literacy |
| `/cases` · `/cases/:caseId` | Decide-and-reveal case library |
| `/practice-draw` | Sketch + grade |
| `/practice/flashcards` · `/practice/label` · `/practice/regime` · `/practice/replay` · `/practice/plan` · `/practice/hunt` · `/practice/lookalike` · `/practice/invalidation` · `/practice/levels` | Practice labs (flashcards, labelling, trend vs range, bar replay, mark the plan, pattern hunt, lookalikes, invalidation, support & resistance) |
| `/practice/ema-macd` | EMA, SMA and MACD lab on long SIMULATED charts |
| `/practice/oscillators` | Oscillators & volatility stop lab: RSI, fast / slow stochastic, KDJ, ATR volatility stop on long SIMULATED charts |
| `/practice/japanese-candles` | Japanese candlesticks: history, the buyer–seller battle, body vs wicks, and the core 14 reversal patterns (Bullish / Bearish toggle) |
| `/practice/heikin-ashi` | Heikin-Ashi lab: formula, limits, regular vs Heikin-Ashi toggle on one SIMULATED chart, computed questions |
| `/practice/gamma-squeeze` | Gamma squeeze case: a SIMULATED weekly-call chase with enter / size / exit decisions, reveal, points and a stall counterfactual |
| `/practice/statements` | Statements lab · 13-week cash forecast · biotech readout day |
| `/practice/read-the-print` · `/practice/mark-the-band` | Earnings reaction game · expected-move band |
| `/coach` · `/coach/:slug` | Step-by-step coaching (decision trees · no LLM) |
| `/playbooks` · `/playbooks/:id` | Playbooks — 12 strategy kits, each from fetched source URLs (four collapsed panels: Strategy · Coaching · Case study · Chart look) |
| `/macro` · `/macro/:lessonId` | Macro Desk — lessons, yield-curve explorer, quiz groups |
| `/macro/play` | Macro reaction game |
| `/academy` · `/academy/:unitId` · `/academy/test-out/:levelId` | Beginner Academy — level map, units, level test-outs, rewards |
| `/academy/options` | Options ladder (education only) |
| `/paper` · `/paper/challenges` · `/paper/challenges/:challengeId` | Paper trading (SIMULATED) · challenges |

Chrome: **Home** · **Learn** · **Charts** · **Cases** · **Coach** · **Playbooks**. On phones (below the `sm` breakpoint) the nav gets its own full-width row under the logo. Macro Desk, Academy, paper trading, financials and the practice labs open from their cards on Learn (and Home).

Teaching formats (quiz, step-by-step, playbook, case, chart pack, reference, practice, snapshot): [`RESOURCES.md`](./RESOURCES.md).

Progress is stored locally (`localStorage` key `analysis_core_progress_v1`). Newer areas keep their own keys: `analysis_core_academy_v1`, `analysis_core_academy_paper_v1`, `analysis_core_academy_rewards_v1`, `analysis_core_read_the_print_v1`, `analysis_core_misc_practices_done_v1`, `macro_desk_progress_v1`.

---

## 7. Feature guide

Everything below uses SAMPLE, STYLIZED or SIMULATED data. No live prices, no broker, no real orders.

### Macro Desk (`/macro`)

- **18 lessons** in 6 families: jobs & labor, inflation, growth & spending, the Fed, rates & the dollar, housing & mortgages.
- Each lesson: **Visit the real source** (official agency site, new tab) → a **SIMULATED look-alike** of the release (16 screen layouts, fictional numbers, no agency logo) → **consensus vs actual** with the surprise → a reaction round.
- 43 SIMULATED release events across 14 release kinds, each with consensus and actual; 21 also show the **prior revised**, and payrolls show the two-month revision.
- **44 real sources** listed in [`SOURCES.md`](./docs/projects/macro-forces/SOURCES.md); `npm run check:macro-sources` fetches them (bot-blocked hosts are checked by hand).
- **Yield-curve explorer:** move the 2-year and 10-year yields and the mortgage spread; the curve shape and the monthly payment on a $400k loan update.
- **Reaction game** (`/macro/play`): **29 rounds** across **6 environments** (inflation worry, overheating, Fed pivot watch, goldilocks, growth scare, recession fear). Predict the 2y and 10y yields, the dollar, the index and one sector (up / down / muted). Some rounds are **muted** (in line, or mixed details) and some **reverse** after the first move.
- **In Learn and Training:** 70 questions in 5 groups (**Reading Macro Releases**, **Rates & the Yield Curve**, **Fed Policy & Pricing**, **Housing & Mortgage Rates**, **Macro Market Reactions**), 50 macro glossary terms in Archive, a **Macro Desk** card, and 5 macro cases that link to their lesson and real release.
- **Extras:** Coach session **CPI morning** (`/coach/cpi-morning`) and a Macro Desk tip on Home.

### Beginner Academy (`/academy`)

Beginner training modelled on how broker apps such as Webull teach new investors, rebuilt with original content:

- **Placement check** (12 questions) on Home picks a start level, or start from zero.
- **8 levels, 43 units**: short cards and a 3-question check per unit (129 items); a level **test-out** at 85%. Chips link into Learn groups, glossary, Coach and Cases.
- **Today in the Academy** card: next unit, term of the day, challenge of the week and one review question (+5 points correct, +1 for answering; counts toward the **Day streak**).
- **Paper trading** (`/paper`, SIMULATED): 8 SAMPLE tapes; market, limit, stop, stop-limit and trailing-stop orders (Day / GTC); **bracket / OCO** exits; **short selling**; **fractional and dollar** buys; **fees and slippage**; a **trade journal with CSV export**; **multiple portfolios**.
- **Challenges** (`/paper/challenges`): 10 challenges plus a challenge of the week; a half-played challenge is saved with **Resume** / **Restart**.
- **Rewards:** virtual points, 10 ranks and 24 badges.
- **Options ladder** (`/academy/options`): 4 levels, 13 strategies with P&L-at-expiration charts; each level opens after an 8-question check (80%, 3 attempts per 24 h). It approves nothing. A **short-dated options** note explains that holding an option briefly is not the same as buying a contract near expiration.
- Learn groups **Orders & Fills**, **Paper P&L**, **Options Ladder**, and Coach **Your first paper trade**.

### Financials & earnings

- **Statements lab** (`/practice/statements`): income, balance, cash flow, metrics and story tabs for 5 fictional companies (SaaS, retail, industrial, **regional bank**, **clinical-stage biotech**), a **13-week cash forecast** with what-ifs, and a biotech readout day.
- **Read the Print** (`/practice/read-the-print`): 22 rounds — read the preview, call the reaction and the follow-through, then the reveal.
- **Mark the Band** (`/practice/mark-the-band`): 22 rounds — set the expected-move band before the report, then mark the fill.
- Learn groups **Earnings Desk Language**, **Reading the Statements**, **13-Week Cash Forecast**, **Earnings Preview**, **Earnings Reactions**; Coach **Earnings week**; earnings cases link to similar Read the Print rounds.

### Candles, patterns and price action

- **133 patterns** (17 rare) in Archive. Learn groups **Candlestick Basics**, **Reading One Candle**, **Candlestick Pattern Book** (16 more patterns), **Advanced & Rare Patterns** (23 patterns) and **Chart, Gap & Volume Patterns** (155 questions).
- **Buy or Sell?** drill: 148 questions — patterns, wait cases and scenarios; reveals use large charts.
- **Supply & Demand Zones** and **Price Action**, including trade management: entry types, stops at invalidation, targets and trailing stops.
- **EMA, SMA and MACD lab** (`/practice/ema-macd`): 3 long SIMULATED charts (120 bars) with 11 questions computed from the chart.

### Oscillators & volatility stop (`/practice/oscillators`)

- 3 long SIMULATED charts (120 bars): a strong climb, a choppy range, and a climb followed by a gap down. Each has its own lower panel (RSI + fast %K, fast vs slow stochastic, KDJ, or the volatility stop with ATR) and 11 questions computed from the chart.
- Teaches: RSI 70 / 30 and why overbought can last in a strong trend; MACD signal-line crosses (often paired with RSI); the **fast stochastic** (%K, %D = SMA(3) of %K, 80 / 20) vs the **slow stochastic**; **KDJ** (K and D smoothed from the stochastic, J = 3K − 2D); why RSI, the stochastic and KDJ agreeing is not independent confirmation; **ATR** and an ATR **volatility stop** (a rule-based trailing stop) and why a stop level is not a guaranteed fill on a gap.
- The rule throughout: indicators support a decision; they are not buy or sell signals. An entry still needs a position size, an exit plan and a defined risk limit.
- Indicator formulas live in `src/lib/oscillators.ts` (tests check them against independent reference implementations); RSI is in `src/lib/indicators.ts` and uses Wilder's smoothing, tested against the StockCharts ChartSchool worked example; every cited source is listed on the page and in `src/lib/oscillatorSources.ts`.
- Learn groups **Oscillators & Volatility Stops** (24 questions, including the lab's chart questions with the same SIMULATED chart) and **Float, Short-Dated Options & Risk** (14 questions: float and float turnover, short-dated options, position sizing, and why the same market can give very different results by sector, timing and risk management), plus 11 glossary terms in Archive.

### Japanese candlesticks (`/practice/japanese-candles`) and Heikin-Ashi (`/practice/heikin-ashi`)

- Framing lesson: candle charts grew out of 18th-century Japanese rice trading (the Dojima rice market in Osaka; Munehisa Homma is traditionally linked to it) and reached Western traders through Steve Nison's articles and his 1991 book. Each candle is a battle between buyers and sellers: the body is open-to-close, the wicks are prices that were tried and rejected, and context (the prior trend) decides what a shape means. Linked from the Academy unit *Reading a candle*.
- **Core 14** reversal patterns with a Bullish / Bearish toggle (also at the top of Archive → Patterns): Dragonfly Doji, Hammer, Bullish Engulfing, Piercing Line, Tweezer Bottom, Three White Soldiers, Morning Star; Gravestone Doji, Shooting Star, Bearish Engulfing, Dark Cloud Cover, Tweezer Top, Three Black Crows, Evening Star. Textbook rules (Nison / Bulkowski); single-candle and doji signals are taught as needing a confirmation candle.
- Every pattern detail (all 133 patterns) has three tabs — **How to recognise it**, **What is the psychology?**, **How do we trade it?** (confirmation, entry, stop at invalidation, target or exit, and "not a guarantee") — and a SIMULATED illustration whose last candle is the confirmation. The core 14 have hand-written tabs in `src/lib/patternTabs.ts` and the chart, gap and volume patterns have their own (`src/lib/chartPatternBook.ts`); other patterns get a family guide marked as general.
- **Heikin-Ashi** lab: HA close = (O+H+L+C)/4, HA open = (previous HA open + previous HA close)/2, HA high / low include the HA open and close. `src/lib/heikinAshi.ts` is tested against the StockCharts ChartSchool QQQ worked sheet (23 rows) and an independent implementation. The lab shows one 60-bar SIMULATED chart as regular, Heikin-Ashi or side by side, with 8 questions computed from the chart (smoothing, runs without wicks, lag after the top, a hand calculation, and why HA prices are not traded prices).
- Learn groups **Japanese Candlesticks: Core 14** (33 questions) and **Heikin-Ashi Candles** (15 questions, 8 with the lab chart), plus 2 glossary terms in Archive.

### Chart, gap & volume patterns (Archive · Learn)

- 31 multi-bar patterns from one table, `src/lib/chartPatternBook.ts`: rising and falling windows; breakaway, runaway (measuring) and exhaustion gaps; island tops and bottoms; bear flag, bull and bear pennants, high and tight flag; ascending and descending triangles; bullish and bearish rectangles; ascending and descending channels; rounding bottom and top; cup and handle and the inverted cup; broadening top and bottom; diamond top and bottom; the V bottom (spike reversal); volume patterns (selling climax, volume dry-up, breakout on volume, volume divergence); and three pushes (a price-action term).
- Each one has a SIMULATED chart with a volume pane, its own Recognise / Psychology / Trade tabs, a glossary card (and flashcard), a Buy-or-Sell drill item when it has a direction, and five Learn questions: identify, psychology, confirmation, stop and target, and a lookalike chart (or what the volume pane adds). `chartPatternBook.test.ts` checks each textbook rule on the bars (gap clear of the prior high, flat triangle top, volume about twice the average on the breakout, and so on).
- Deep link: `/archive?tab=patterns&open=<pattern-id>`. Process for importing more from screenshots: `.agents/skills/candlestick-screenshot-import/SKILL.md`.

### Gamma squeeze case (`/practice/gamma-squeeze`)

- A SIMULATED Thursday in a made-up stock (SQZ): heavy call buying in Friday's weekly strikes, a fast move through the 24 strike, then a fade. You make three decisions (enter, size, exit), each graded and worth points, and the case pays progress points once (`recordCaseOutcome`, id `gamma-squeeze`).
- The illustrative story: a trader puts $200 into 25 weekly 24-strike calls at $0.08 at 10:35 AM ET (7:35 AM PT) and sells them for about $5,075 at 1:00 PM ET (10:00 AM PT). Option values are Black-Scholes mids on made-up volatility; `gammaSqueeze.test.ts` recomputes the whole option path with an independent implementation. The counterfactual keeps the same morning, then stalls: the calls are worth $0.03 at 1:00 PM and expire worthless below the strike.
- Also on the page: the shares dealers would hold IF they were net short the 24-strike open interest, a survivorship-bias panel (100 made-up $200 tickets that lose money overall), short squeeze vs gamma squeeze and how they compound, and what the SEC staff's October 2021 report found for GameStop in January 2021 (no evidence of a gamma squeeze; positive sentiment, not short covering, sustained the rise).
- Learn **Squeezes, Options Flow & Survivorship** (14 questions), Coach **Chasing a squeeze**, and 9 glossary terms: gamma, delta hedging, gamma squeeze, short squeeze, short interest, days to cover, open interest, unusual options activity, survivorship bias.

### Playbooks (`/playbooks`)

12 kits, each built from fetched authoritative sources: gap and go, hold above the average, swing bias from the long average, reclaim the short average, covered call, cash-secured put, protective put, dollar-cost averaging, rebalance to a target mix, stop vs stop-limit on a gap, short sale with a buy stop, and futures offset / roll / settlement. `npm run check:playbook-sources` re-checks the URLs.

### Progress rules

- A Learn quiz counts as **passed at 70%**.
- A case awards points **once per case** (10 correct · 5 partial · 1 incorrect); replays award 0.
- **Answer streak** = correct answers in a row; **Day streak** (Academy) = days with a Today answer.
- The **content graph** test (`npm run test:content`) checks that the links between Learn, Archive, Practice, Cases, Coach and Home still resolve.

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server (port **3001**) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript check |
| `npm run start` | Serve the built app on `$PORT` (required) |
| `npm run test:coaching` | E11 coaching validate/nav/path tests |
| `npm run test:lib` | Unit tests in `src/lib` (includes the content graph) |
| `npm run test:financials` | Financials & earnings tests |
| `npm run test:macro` | Macro Desk tests |
| `npm run test:academy` | Beginner Academy, paper engine and options ladder tests |
| `npm run test:content` | Content graph only (cross-links and deep-link ids) |
| `npm run check:macro-sources` | Fetch the Macro Desk real-source URLs |
| `npm run check:playbook-sources` | Fetch the Playbook source URLs |
| `npm run check:build` | Production build into a temp folder (leaves `dist/` alone) |
| `npm run verify` | lint + test:coaching + test:lib + test:financials + test:macro + test:academy + check:build |
| `npm run test:e2e` | Browser smoke at 390 and 1280 px on a temp port (needs `playwright-core` + Chrome; not in verify) |
| `npm run clean` | Remove `dist/` |

---

## Tech stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Recharts · React Router · Motion
