# Stock Trainer (ANALYSIS_CORE)

Learn how to **read equities**, **read charts**, and **decide before the aftermath**—with SAMPLE data only (no LIVE / REAL_TIME theater).

Earn each credential by passing short checks. Already know it? Test out and move on. No videos required. Credentials are progress saved in your browser, not attested certificates.

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
| **Price action trading framework** | "Trade what's happening, not what you think will happen": uncertainty vs a clear signal, then 1 entry signal (breakout, pullback, reversal), 2 stop-loss at invalidation, 3 trailing stop, 4 profit target, with the candles that help at each step | **Price action trading framework** (`/practice/trade-framework`) + Learn **Price Action Framework** + Cases **Price action trades** + Coach **Honor the stop** | Step drill answered; quiz passed (70%); five framework cases decided |
| **Opening range breakout (15-minute)** | Mark the high and low of the first two 15-minute candles, enter on a 15-minute close outside (calls above, puts below), stop at the other end, 1:1 on the underlying; caveats: close vs next open, a wide range means smaller size or no trade, 1:1 on SPY is not 1:1 on the premium, expiry choice | **Opening range breakout** (`/practice/opening-range`) + Learn **Opening Range Breakout** + ORB cases in **Price action trades** + Coach **Trade the opening range** | Five-session drill answered; quiz passed (70%) |
| **Price action in four pillars** | Map (one precise level, touches, close vs wick) → confirmation decided in advance → invalidation on closes that sets size → context (full / half / pass); hold, reclaim and rejection setups; common mistakes | Playbook **Price action in four pillars** (Brando Trades, YouTube) + Learn **Price Action: Four Pillars** + four-pillar cases in **Price action trades** + Coach **Map, confirm, invalidate, size** | Kit read; quiz passed (70%) |
| **Breakout, pullback and fair value gap** | The breakout candle is a signal, not an entry; gap vs no gap in three candles (candle 1's high vs candle 3's low, commonly called a fair value gap or imbalance); buy the pullback into the gap, stop below the gap and the level; "often retested" is a belief, not a guarantee | Practice **Breakout, pullback and fair value gap** + Learn **Breakout Pullback & Fair Value Gaps** + fair value gap cases in **Price action trades** + Coach **Buy the pullback, not the breakout** + Playbook **Breakout, pullback and fair value gap** | Drills done; quiz passed (70%) |
| **Risk Premiums, Trend Filters & the VIX** | A diversified ETF mix built from risk premiums (SPY, TLT, GLD, FXE, DBC by economic role), why low correlation lowers risk, a textbook trend filter (not the video's rule), the volatility risk premium and the VIX futures curve, the short-volatility tail, inverse-volatility ETPs, 1.2x leverage, and reading a too-good backtest (15 `RPP-`) |
| **The wheel strategy** | Sell a cash-secured put on a stock you want to own, take assignment, sell covered calls, get called away, repeat: collateral and breakeven math, premium-adjusted basis, what an annualized yield assumes, delta / DTE / earnings choices (common practice, not rules), capped upside with nearly the stock's downside, early assignment, taxes and approval levels, and Cboe's PUT / BXM evidence (1986–2018) | Practice **The wheel strategy** (`/practice/wheel-strategy`) + Learn **The Wheel: Cash-Secured Puts to Covered Calls** (20 `WHEEL-`) + 4 wheel cases in **Options context** + Coach **Run the wheel without bag-holding** + Playbook **The wheel: cash-secured puts to covered calls** | Drills done; quiz passed (70%) |
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
| **News, biases & short-term options** | Expiry length for a news idea (weekly vs about two months vs LEAPS), six biases with news examples and countermeasures, information overload, over- and underreaction, OCO exits, source checks, the do-nothing rule | **News, biases & short-term options** (`/practice/news-biases`) + Learn **News, Biases & Short-Term Options** + Coach **A news-day decision** + optional bias check on the paper ticket | Checkpoints answered; quiz passed (70%) |
| **Automated & algo trading (2026)** | Broker APIs and paper trading, backtest traps, kill switches, API key safety, spoofing and wash trades, stops vs stop-limits vs trailing stops on news gaps, LULD and circuit breakers, ATR sizing, the PDT rule's replacement by intraday margin | **Automated & algo trading** (`/practice/algo-trading`) + Learn **Automated & Algo Trading** + PDT questions in Learn **Float, Short-Dated Options & Risk** | Playbook ticked; quiz passed (70%) |
| **Indicator & charting apps** | 11 charting apps compared, how charts mislead, Robinhood vs Webull charting, how broker education works (payment for order flow), reading example Webull P&L and account screens | **Indicator & charting apps** (`/practice/charting-apps`) + Learn **Indicator & Charting Apps** | Spot-the-trap answered; quiz passed (70%) |
| **Not sure what's next?** | See what you've done, what each lesson unlocks and the single best next step | **Progress map** (`/map`, header **Map** link, Home card) | Regions fill in; the Next objective card moves along |
| **Candlesticks for crypto** | Which candle patterns carry over to 24/7 markets, which need a no-gap reading, which almost never form | **Candlesticks for crypto** (`/practice/crypto-candles`) + Learn **Candlesticks for Crypto** + Archive crypto filter | Quiz passed (70%) |
| **Reversal chart patterns** | Head and shoulders, double / triple tops and bottoms, wedges: neckline confirmation, measured moves, retests, invalidation | **Reversal chart patterns** (`/practice/reversal-charts`) + Learn **Reversal Chart Patterns** | Quiz passed (70%) |
| **Reading 1-minute charts** | 5- and 15-minute grouping, the open hour, legs and pauses, futures tick costs, fib and bar count | **Reading 1-minute charts** (`/practice/one-minute-charts`) + Learn **Reading 1-Minute Charts** | Legs drill answered; quiz passed (70%) |
| **Fibonacci as a decision map** | Zone → confirmation → stop → target → R:R from fib levels, with VWAP confluence | **Fibonacci as a decision map** (`/practice/fib-decision-map`) + Learn **Fibonacci Decision Map** | Plan drill answered; quiz passed (70%) |
| **Futures vs options & beginner toolkit** | Futures vs options, MES vs ES, SPY, 5-minute before 1-minute, SMA, bar count, Sharpe ratio, a real income statement to EBITDA | **Futures vs options** (`/practice/futures-vs-options`) + Learn **Futures vs Options** | Calculators used; quiz passed (70%) |
| **Technique walkthroughs** | Six techniques step by step on a chart that suits them, then on one that doesn't | **Technique narratives** (`/practice/technique-narratives`) + **Missing wicks and zooming in** (`/practice/missing-wicks`) | Walkthrough finished; inline quiz answered |
| **Judging track records** | Record-setting traders with who verified each feat, how they traded, and whether it still works | **Record-setting traders** (`/practice/record-traders`) + Learn **Record-setting traders** | Claim drill answered; quiz passed (70%) |
| **Pattern themes & direction** | The 17 functional themes every pattern fits, the essential 16 candles and the star 50% rule, and Up / Down / Either for every pattern | **Pattern themes** (`/practice/pattern-themes`) · **Essential candlestick patterns** (`/practice/essential-candles`) · **Which Way?** (`/practice/which-way`) | Checklist ticked; drills scored; quizzes passed (70%) |

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
| Lost, or not sure what to do next | **Progress map** (`/map`) | Follow the **Next objective** card |

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
| `/practice/news-biases` | News, biases & short-term options: expiry trade-off table, six bias cards, over- and underreaction research, OCO / bracket habits, a three-checkpoint news day |
| `/practice/algo-trading` | Automated & algo trading (2026): broker API table, backtest traps, bot safety, PDT → intraday margin, stops around news, ATR sizing calculator, news-day playbook |
| `/practice/charting-apps` | Indicator & charting apps: 11-app table, chart traps with a spot-the-trap drill, Robinhood and Webull charting views, example Webull-style screens, learning from broker apps |
| `/practice/crypto-candles` | Candlesticks for crypto: every candle pattern tagged works / adapted / rare in 24/7 markets, the harami takeaway |
| `/practice/reversal-charts` | Reversal chart patterns: H&S, inverse H&S, double / triple tops and bottoms, wedges, rectangle vs triple bottom |
| `/practice/one-minute-charts` | Reading 1-minute charts: grouping, open hour, legs drill, MES tick calculator, fib tools, bar count |
| `/practice/fib-decision-map` | Fibonacci as a decision map: SIMULATED 5-minute decline, level table, zone → confirm → stop → target → R:R calculator, plan drill |
| `/practice/futures-vs-options` | Futures vs options, MES vs ES calculator, SPY starter card, SMA slider, Sharpe calculator, Apple FY2025 income statement to EBITDA |
| `/practice/technique-narratives` | Six step-by-step walkthroughs (`?n=<id>`), each with a wrong-chart fail panel and an inline quiz |
| `/practice/missing-wicks` | Missing wicks and zooming in: one hourly candle, two 1-minute paths, 1h / 15m / 1m toggle |
| `/practice/record-traders` | Record-setting traders: 10 verified cards with verifier and source, judging checklist, claim drill |
| `/practice/pattern-themes` | Pattern themes (`?theme=<id>`): 17 themes, quick map, hierarchy, pre-trade checklist |
| `/practice/essential-candles` | Essential candlestick patterns: 18 cards, star 50% rule diagrams, valid-star drill |
| `/practice/which-way` | Which Way?: Up / Down / Either for every pattern, drawn after its prior trend |
| `/practice/trade-framework` | Price action trading framework: uncertainty vs a clear signal, the four steps (entry, stop-loss, trailing stop, profit target) on SAMPLE charts, candles per step, a "Which step is this?" drill |
| `/practice/opening-range` | Opening range breakout (15-minute): the five rules on a SAMPLE SPY.S session, the caveats (close vs next open, wide range sizing, option premium vs the underlying with a 0DTE vs one-month table, expiry, strike), a five-session "your call" drill |
| `/practice/fair-value-gap` | Breakout, pullback and fair value gap: the five steps on a SAMPLE 5-minute tape, a GAP vs NO GAP panel, the caveats (belief not fact, missed trades, no gap no setup, pullbacks that fail, no target rule, size from the stop), a five-tape "your call" drill |
| `/practice/risk-premium-portfolio` | Risk-premium portfolio and the VIX overlay: the five sleeves, a correlation example, a textbook 10-month trend filter (labelled not the video's rule), a 4-scenario VIX overlay drill (contango/backwardation, implied vs realized), the short-VXX tail at 5/10/20% sizes, the creator's backtest table with the app's numbers check, 8 caveats, links |
| `/practice/vix-trading` | VIX trading for beginners: key ideas summary, "Is VIX a valid play?" verdict, what VIX measures (VIX → 1σ month move), 8 instruments compared, VX/VXM P&L, curve shapes and slope, carry and the three kinds of decay, right forecast / losing trade, VIX options breakevens, where an edge comes from (expected value vs price: futures/option P/L with costs, VRO settlement, stable-curve carry, EV of a short future and a call, the underestimated tail, a term premium that can turn negative), daily inverse compounding, 4 strategy families, why continuous shorting fails (win rate vs expectancy, recovery math), sizing and gaps, 10 drills, a paper-trading process, links |
| `/practice/wheel-strategy` | The wheel strategy: "Is the wheel a valid strategy?" verdict, the four-step cycle, one SAMPLE turn with the numbers (collateral, breakeven, yield, basis, called-away profit), three paths vs buying the shares, strike / DTE / earnings choices, Cboe PUT and BXM vs the S&P 500 (incl. 2008 and 2013), what the screenshots in Weng's notes showed, 8 drills, risks, links |
| `/map` | Progress map (`?view=world`, `tree` or `web`): world map, skill tree, discovery web, Next objective |
| `/practice/statements` | Statements lab · 13-week cash forecast · biotech readout day |
| `/practice/read-the-print` · `/practice/mark-the-band` | Earnings reaction game · expected-move band |
| `/coach` · `/coach/:slug` | Step-by-step coaching (decision trees · no LLM) |
| `/playbooks` · `/playbooks/:id` | Playbooks — 17 strategy kits, each from fetched source URLs (four collapsed panels: Strategy · Coaching · Case study · Chart look; a kit can also embed its video with a credit line and add a "How well-tested is this?" panel) |
| `/macro` · `/macro/:lessonId` | Macro Desk — lessons, yield-curve explorer, quiz groups |
| `/macro/play` | Macro reaction game |
| `/academy` · `/academy/:unitId` · `/academy/test-out/:levelId` | Beginner Academy — level map, units, level test-outs, rewards |
| `/academy/options` | Options ladder (education only) |
| `/paper` · `/paper/challenges` · `/paper/challenges/:challengeId` | Paper trading (SIMULATED) · challenges |

Chrome: **Home** · **Learn** · **Charts** · **Cases** · **Coach** · **Playbooks**, plus a **Map** button (beside the logo on phones, after the links from `sm` up). On phones (below the `sm` breakpoint) the nav gets its own full-width row under the logo. Macro Desk, Academy, paper trading, financials and the practice labs open from their cards on Learn (and Home).

Teaching formats (quiz, step-by-step, playbook, case, chart pack, reference, practice, snapshot): [`RESOURCES.md`](./RESOURCES.md).

Progress is stored locally (`localStorage` key `analysis_core_progress_v1`). Newer areas keep their own keys: `analysis_core_academy_v1`, `analysis_core_academy_paper_v1`, `analysis_core_academy_rewards_v1`, `analysis_core_read_the_print_v1`, `analysis_core_misc_practices_done_v1`, `macro_desk_progress_v1`, `analysis_core_practice_draw_v1`, `analysis_core_market_data_provider_v1`, `analysis_core_tour_progress_v1` (walkthrough resume), `analysis_core_which_way_v1` (Which Way? deck position and score) and `analysis_core_map_v1` (visited routes and best Learn quiz score per group, for the Progress map).

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

- **158 patterns** (17 rare) in Archive, each tagged with its themes and potential direction, plus an "Also called" line for patterns that go by other names (`src/lib/patternAliases.ts`). Learn groups **Candlestick Basics**, **Reading One Candle**, **Candlestick Pattern Book** (16 more patterns), **Advanced & Rare Patterns** (23 patterns) and **Chart, Gap & Volume Patterns** (230 questions).
- **Buy or Sell?** drill: 170 questions — patterns, wait cases and scenarios; reveals use large charts.
- **Supply & Demand Zones** and **Price Action**, including trade management: entry types, stops at invalidation, targets and trailing stops.
- **Price action trading framework** (`/practice/trade-framework`, `src/lib/tradeFramework.ts`): uncertainty (chop) vs a clear signal (breakout and retest), then the four steps, each on a SAMPLE scenario chart with its rule, candles that help (hammer, bullish / bearish engulfing, morning / evening star, shooting star, doji) and the common mistake; a six-question "Which step is this?" drill. Learn **Price Action Framework** (28 questions: 15 `TF-` plus the trade-management `PA-18`…`PA-30`), Cases **Price action trades** (5 cases: chop → breakout → failed breakout stop-out → trailed stop holds → take profit at the target), Coach **Honor the stop**, glossary `price-action-framework` and `stop-loss-invalidation`.
- **Opening range breakout** (`/practice/opening-range`, `src/lib/openingRange.ts`): the 15-minute ORB from a public Facebook reel about SPY (range = first two 15-minute candles; enter on a close outside; stop at the other end; 1:1 on the underlying), plus the caveats the reel skips: close vs next open, a wide range means a deep stop (size down or skip), 1:1 on SPY is not 1:1 on the option (Black-Scholes table, same-day vs one-month), no expiry rule, strike choice. The broker promotion is left out; PDT links to the FINRA-sourced glossary entry. Learn **Opening Range Breakout** (14 `ORB-`), three ORB cases in **Price action trades**, Coach **Trade the opening range**, glossary `opening-range`, `opening-range-breakout`, `underlying-vs-premium-rr`. No Playbook: the reel URL does not pass `check:playbook-sources` (Facebook answers 400 without a login).
- **Price action in four pillars** (Playbook `price-action-four-pillars`, `src/lib/fourPillars.ts`): Brando Trades' map → confirmation → invalidation → context, the hold / reclaim / rejection setups and the common mistakes. Exits are not attributed to the video; the kit links to the price action trading framework. Learn **Price Action: Four Pillars** (17 `FP-`), three four-pillar cases, Coach **Map, confirm, invalidate, size**, glossary `four-pillars`, `level-touches`, `close-vs-wick`, `reclaim-setup`, `rejection-setup`, `context-sizing`.
- **Breakout, pullback and fair value gap** (`/practice/fair-value-gap`, Playbook `breakout-pullback-fvg`, `src/lib/fairValueGap.ts`): from a short Facebook trading reel (no creator named): skip the breakout candle, look for the three-candle gap it leaves, buy the pullback into it with the stop below the gap and the level. The reel's "gaps are often retested" is taught as a common belief; exits link to the price action framework because the reel gives no target rule. Pure helpers `detectFairValueGaps`, `breakoutGap`, `fvgPlan`.
- **Risk-premium portfolio and the VIX overlay** (`/practice/risk-premium-portfolio`, Playbook `etf-north-star-vrp`, `src/lib/riskPremiumPortfolio.ts`): from Predicting Alpha's YouTube video "This ETF Strategy Turned $100k into $1.2 Million": SPY 35 / TLT 30 / GLD 20 / FXE 10 / DBC 5 weighted by economic role, an undisclosed trend filter and a short-VXX overlay driven by the VIX curve and implied vs realized volatility. Headline numbers are shown as the creator's own backtest (followed by a paid pitch), with the missing rules, the short-volatility tail, inverse-volatility ETPs (XIV 2018) and leverage as caveats. Learn `risk-premium-portfolio` (15 `RPP-`), 3 cases in pack `macro-news` (mode `vol_risk_premium`), Coach `read-a-backtest`, 11 glossary terms.
- **VIX trading for beginners** (`/practice/vix-trading`, Playbook `vix-curve-carry-paper`, `src/lib/vixTrading.ts`): from the article "VIX Trading for Beginners" and its cited Cboe, NY Fed, SEC, FINRA, NFA and issuer sources. Verdict: a legitimate, exchange-listed market with a documented but conditional edge (volatility risk premia), paid for with rare very large losses; for most beginners, paper-trade it first or skip it. Learn `vix-trading` (40 `VIX-`), 5 SAMPLE hypothetical cases (mode `vix_products`; 3 in pack `futures`, 2 in `macro-news`), Coach `vix-futures-curve` (incl. an expected-value / underestimated-tail step), 18 glossary terms.
- **The wheel strategy** (`/practice/wheel-strategy`, Playbook `wheel-csp-to-covered-call`, `src/lib/wheelStrategy.ts`): from Weng's notes on the wheel (general opinions plus 23 screenshots of the commercial wheelstrategyoptions.com screeners and Trade Tracker on demo data). The app teaches the mechanics those screens show and does not endorse the tool; its covered-call "breakeven" column (strike + premium, the call buyer's) is contrasted with the writer's (cost − premium). Verdict: "Yes, as a mainstream, conservative-tier options strategy. Not as free income." Pure helpers `cspBreakeven`, `cspCollateral`, `premiumYieldPct`, `annualizedPremiumYield`, `effectiveCostBasis`, `coveredCallBreakeven`, `coveredCallMaxProfit`, `calledAwayForgone`, `assignedPnl`, `wheelCycleReturn`. Learn `wheel-strategy` (20 `WHEEL-`), 4 SAMPLE cases in pack `options-context` (mode `wheel_cycle`: flat month, rip past the call strike, crash after assignment, put through earnings), Coach `wheel-strategy`, 13 glossary terms.
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
- Every pattern detail (all 158 patterns) has three tabs — **How to recognise it**, **What is the psychology?**, **How do we trade it?** (confirmation, entry, stop at invalidation, target or exit, and "not a guarantee") — and a SIMULATED illustration whose last candle is the confirmation. The core 14 have hand-written tabs in `src/lib/patternTabs.ts` and the chart, gap and volume patterns have their own (`src/lib/chartPatternBook.ts`); other patterns get a family guide marked as general.
- **Heikin-Ashi** lab: HA close = (O+H+L+C)/4, HA open = (previous HA open + previous HA close)/2, HA high / low include the HA open and close. `src/lib/heikinAshi.ts` is tested against the StockCharts ChartSchool QQQ worked sheet (23 rows) and an independent implementation. The lab shows one 60-bar SIMULATED chart as regular, Heikin-Ashi or side by side, with 8 questions computed from the chart (smoothing, runs without wicks, lag after the top, a hand calculation, and why HA prices are not traded prices).
- Learn groups **Japanese Candlesticks: Core 14** (33 questions) and **Heikin-Ashi Candles** (15 questions, 8 with the lab chart), plus 2 glossary terms in Archive.

### Chart, gap & volume patterns (Archive · Learn)

- 46 multi-bar patterns from one table, `src/lib/chartPatternBook.ts`: rising and falling windows; breakaway, runaway (measuring) and exhaustion gaps; island tops and bottoms; bear flag, bull and bear pennants, high and tight flag; ascending and descending triangles; bullish and bearish rectangles; ascending and descending channels; rounding bottom and top; cup and handle and the inverted cup; broadening top and bottom; diamond top and bottom; the V bottom (spike reversal); volume patterns (selling climax, volume dry-up, breakout on volume, volume divergence); three pushes (a price-action term); complex head-and-shoulders tops and bottoms (extra shoulders or a double head); the low tight flag (a 60–90% run, then a shallow pause); the trend stage bounce (a Stage 2 pullback to the rising trend line) and the trend-line breakdown; measured moves up and down (three-stage patterns); bullish and bearish neckline retests (throwback / pullback); the rectangle (square) bottom; step tops and bottoms (the first step of a staircase); three pushes down; and bearish breakaway and runaway gaps.
- Pattern coverage audit: every pattern name from every source sheet, poster, article and PDF is mapped to the pattern or glossary term that teaches it (`docs/projects/content-graph/PATTERN-COVERAGE-AUDIT.md`, data in `src/lib/patternSourceNames.ts`); `patternCoverage.test.ts` fails if a name has no target.
- Each one has a SIMULATED chart with a volume pane, its own Recognise / Psychology / Trade tabs, a glossary card (and flashcard), a Buy-or-Sell drill item when it has a direction, and five Learn questions: identify, psychology, confirmation, stop and target, and a lookalike chart (or what the volume pane adds). `chartPatternBook.test.ts` checks each textbook rule on the bars (gap clear of the prior high, flat triangle top, volume about twice the average on the breakout, and so on).
- Deep link: `/archive?tab=patterns&open=<pattern-id>`. Process for importing more from screenshots: `.agents/skills/candlestick-screenshot-import/SKILL.md`.

### Gamma squeeze case (`/practice/gamma-squeeze`)

- A SIMULATED Thursday in a made-up stock (SQZ): heavy call buying in Friday's weekly strikes, a fast move through the 24 strike, then a fade. You make three decisions (enter, size, exit), each graded and worth points, and the case pays progress points once (`recordCaseOutcome`, id `gamma-squeeze`).
- The illustrative story: a trader puts $200 into 25 weekly 24-strike calls at $0.08 at 10:35 AM ET (7:35 AM PT) and sells them for about $5,075 at 1:00 PM ET (10:00 AM PT). Option values are Black-Scholes mids on made-up volatility; `gammaSqueeze.test.ts` recomputes the whole option path with an independent implementation. The counterfactual keeps the same morning, then stalls: the calls are worth $0.03 at 1:00 PM and expire worthless below the strike.
- Also on the page: the shares dealers would hold IF they were net short the 24-strike open interest, a survivorship-bias panel (100 made-up $200 tickets that lose money overall), short squeeze vs gamma squeeze and how they compound, and what the SEC staff's October 2021 report found for GameStop in January 2021 (no evidence of a gamma squeeze; positive sentiment, not short covering, sustained the rise).
- Learn **Squeezes, Options Flow & Survivorship** (14 questions), Coach **Chasing a squeeze**, and 9 glossary terms: gamma, delta hedging, gamma squeeze, short squeeze, short interest, days to cover, open interest, unusual options activity, survivorship bias.

### News, biases & short-term options (`/practice/news-biases`)

- Why a news idea often needs weeks, and the expiry trade-off: weeklies are cheapest but need the move at once (time decay is fastest near expiry); about two months gives the story time for more premium; LEAPS (about nine months to three years) cost the most and decay the slowest. Links the short-dated option content, the horizon-mismatch Coach session and the gamma squeeze case.
- Six biases, each with a definition, a news example and a countermeasure: recency, availability, confirmation, FOMO, loss aversion (Kahneman & Tversky 1979) and anchoring (Tversky & Kahneman 1974). Information overload and overtrading (Hirshleifer, Lim & Teoh 2009), overreaction after no-news moves (Chan 2003), underreaction from limited attention (Hirshleifer, Hsu & Li 2013; Cohen & Frazzini 2008), and the April 2025 tariff headlines as an example of a headline flipping (the S&P 500 rose 9.5% on April 9, 2025).
- Habits: OCO and bracket exits (practised on the paper account), seeking contrary evidence, auditing the source (Investor.gov and FINRA pump-and-dump alerts), the do-nothing rule, and a Schwab Trader Talks video on news and trade decisions.
- The paper order ticket has an optional **bias check** (off by default): six questions that must all be ticked before the order can be placed.
- Learn **News, Biases & Short-Term Options** (17 questions), Coach **A news-day decision** (bias checkpoints), and 9 glossary terms (the six biases, information overload, overtrading, LEAPS). Content in `src/lib/newsBiases.ts`.

### Automated & algo trading (`/practice/algo-trading`)

- Broker APIs and paper trading as of 2026-10-22 (Alpaca, Interactive Brokers, Schwab, Tradier, tastytrade, Webull, E*TRADE, Robinhood, NinjaTrader / Tradovate), each row with its source. Robinhood has no public stock-trading API; it has a crypto API and, since May 27, 2026, an agentic-trading beta for equities.
- Why backtests flatter (overfitting, look-ahead bias, survivorship bias, costs, optimistic paper fills, live-only risks), TradingView webhooks and QuantConnect, bot controls (kill switch, loss and position limits), API key safety, and the law on spoofing and wash trades.
- Day trading on margin: FINRA's intraday margin standards replace the pattern day trader rule (SEC approval April 14, 2026; effective June 4, 2026; brokers switch by October 20, 2027). No $25,000 minimum or trade count; $2,000 still needed for leverage; repeated unmet intraday deficits can restrict an account for up to 90 days. Content in `src/lib/pdtRule.ts`; 5 questions added to Learn **Float, Short-Dated Options & Risk**.
- Stops around news: stop vs stop-limit vs trailing vs bracket vs a defined-risk option; 8:30 AM ET (5:30 AM PT) releases and the 2026 CPI, jobs and FOMC dates; extended hours; LULD and circuit breakers; an ATR sizing calculator ($200 risk, ATR $2: 66 shares at 1.5×, 33 at 3×); broker-held vs script stops; an eight-step news-day playbook.
- Learn **Automated & Algo Trading** (17 questions) and 14 glossary terms (12 algo, 2 PDT). Content in `src/lib/algoTrading.ts`.

### Indicator & charting apps (`/practice/charting-apps`)

- 11 apps compared as of 2026-10-22: TradingView, Webull, Robinhood app, Robinhood Legend, thinkorswim, TC2000, TrendSpider, IBKR, Yahoo Finance, Finviz, StockCharts (indicators, scripting, layouts, cost, data notes, sources).
- How charts mislead (log vs linear, extended hours, bar intervals, line vs candles, data feeds, unadjusted splits, indicator warm-up) with a three-item spot-the-trap drill.
- Opinion panels, backed by each broker's docs: why the Robinhood app's indicator chart can mislead, and why Webull's is useful (MACD is taught as momentum, not overbought / oversold).
- Example Webull-style screens (look-alike P&L calendar and Assets tab with illustrative numbers, `public/screenshots/*.webp` with 480 px variants, alt text and a tap-to-enlarge view): daily vs open P&L, cash vs buying power vs settled cash (T+1), separate options buying power, and the Risk Level indicator.
- Learning from broker apps: Webull Learn, Fidelity, Schwab, Robinhood Learn and tastytrade; why it's free (payment for order flow); a sample path (a month of tutorials, about a year of paper trading, then small real positions) and an optional checklist.
- Learn **Indicator & Charting Apps** (14 questions) and 6 glossary terms. Content in `src/lib/chartingApps.ts`.

### Progress map (`/map`)

- One registry, `src/lib/progressMap.ts`: 134 stages (every route, Learn group, practice lab, Academy level and hub) in 12 regions, with suggested prerequisites and related stages. `progressMap.test.ts` fails if a route in `App.tsx`, a Learn group or a lab is missing from the map.
- Three views of the same data: **World map** (each region's stages with checkmarks and % complete; a region shows **Finished** when every stage is done), **Skill tree** (tiers from candle basics through patterns, confirmation and levels to the fib decision map, plus indicator, statements, macro, risk and Academy branches; each stage is done, in progress, available or suggested later, with what it unlocks) and **Discovery web** (explored stages filled in; neighbouring stages you haven't opened shown as "?" with a teaser).
- Every view has a **Next objective** card with one link. A new learner sees mostly "?" stages and **Candlestick Basics** first.
- Status reads the existing stores (practice done flags, case results, coaching sessions, Academy units and test-outs, options ladder, Macro rounds, paper challenges) plus visited routes and the best Learn quiz score per group (`src/lib/mapProgress.ts`). Prerequisites are suggestions; every link opens.

### Candlesticks for crypto (`/practice/crypto-candles`)

- All 96 candlestick patterns tagged for 24/7 markets: 68 work as is, 10 adapted (the classic form needs a gap; read the body and midpoint rules instead), 18 rare (they need a true gap). Archive has a crypto filter and shows the tag on each pattern.
- The harami takeaway on the page and in the Archive card. Learn **Candlesticks for Crypto** (12 questions) and 3 glossary terms.

### Reversal chart patterns (`/practice/reversal-charts`)

- Head and shoulders, inverse head and shoulders, double and triple tops and bottoms, rising and falling wedges: neckline confirmation, measured-move targets, the retest and invalidation, with SIMULATED charts and their own Archive tabs. A panel on why a triple bottom is not a rectangle.
- Learn **Reversal Chart Patterns** (12 questions) and 3 glossary terms. Content in `src/lib/reversalCharts.ts`.

### Reading 1-minute charts (`/practice/one-minute-charts`)

- Read 1-minute bars in 5- and 15-minute groups, the open hour (6:30–7:30 AM PT), legs and pauses (a drill on a SIMULATED 1-minute chart), the MES calculator ($1.25 per 0.25 tick; why a one-tick scalp loses after costs), TradingView's Fib Retracement settings (Reverse, Extend Lines Left / Right), the Bar Count indicator, and the 78 five-minute bars in a regular session.
- Learn **Reading 1-Minute Charts** (12 questions) and 7 glossary terms. Content in `src/lib/oneMinuteCharts.ts`.

### Fibonacci as a decision map (`/practice/fib-decision-map`)

- A SIMULATED 5-minute decline from 5050 to 5000 with fib levels; turn a level into a plan: zone → confirmation → stop (invalidation) → target → reward-to-risk, with a calculator, a plan drill and VWAP confluence.
- Learn **Fibonacci Decision Map** (12 questions) and 5 glossary terms. Content in `src/lib/fibDecisionMap.ts`.

### Futures vs options & beginner toolkit (`/practice/futures-vs-options`)

- Futures vs options and MES vs ES tables ($5 vs $50 per index point, 0.25 tick) with a contract cost calculator; a SPY starter card; 5-minute charts before 1-minute; an SMA slider on SIMULATED closes; bar count with Fibonacci; a Sharpe ratio calculator; Apple's FY2025 10-K income statement walked down to EBITDA.
- Learn **Futures vs Options** (16 questions) and 8 glossary terms. Content in `src/lib/futuresOptionsBasics.ts`.

### Technique narratives (`/practice/technique-narratives`) and Missing wicks (`/practice/missing-wicks`)

- A reusable walkthrough (`src/components/Walkthrough.tsx`): a popover above everything with Next, Prev, step x / y and Exit (Esc and arrow keys work; Exit leaves the chart fully clickable; resume is saved).
- Six narratives on SIMULATED charts with computed indicators: RSI range, moving-average trend, cup breakout, VWAP pullback, MACD divergence and Bollinger squeeze. Each runs the technique on a chart that suits it, then on one that doesn't, with a checklist and an inline quiz. Learn **Technique Narratives** (14 questions), 7 glossary terms.
- **Missing wicks and zooming in**: why a red hourly candle can have no upper wick (its high equals its open), two different SIMULATED 1-minute paths that build the same hourly candle, a 1h / 15m / 1m toggle, and when zooming in helps. Learn **Missing Wicks** (7 questions), 4 glossary terms.

### Record-setting traders (`/practice/record-traders`)

- Only feats a neutral third party confirmed, each with **Verified by** and a source link: Warren Buffett / Berkshire Hathaway, Mark Minervini, Dan Zanger, Larry Williams, Michelle Williams, Andrea Unger, David Ryan, Marty Schwartz, Paul Tudor Jones, and George Soros & Stanley Druckenmiller. Medallion (reported, not publicly audited), CAN SLIM (a method) and Livermore (a contrast) sit in separate boxes.
- A verdict on whether the methods still work, a 10-item checklist for judging any track record, and a SIMULATED five-claim drill. Learn **Record-setting traders** (16 questions), 8 glossary terms. `recordTraders.test.ts` fails if a card has no verifier or source.

### Pattern themes, essential candles and Which Way?

- **Pattern themes** (`/practice/pattern-themes`): 17 functional themes (continuation, reversals, compression, balance, breakout, rejection, indecision, gaps, failure / traps and more), each answering one question with examples and a caveat; every pattern in the Archive carries a primary theme (chips in the pattern card, a theme filter in Archive); a quick pattern map, a practical hierarchy (context → location → theme → trigger → invalidation and risk) and a pre-trade checklist, also in Buy or Sell?. Learn **Pattern Themes** (18 questions), 11 glossary terms.
- **Essential candlestick patterns** (`/practice/essential-candles`): the 16 patterns every trader should know plus the inverted hammer and marubozu (18 cards: shape rule, meaning, confirmation, stop), and the star 50% rule: a morning star's third candle closes above the midpoint of the first candle's body (the evening star mirrors it), drawn in order with a dashed 50% line, plus a six-case valid-star drill. Audit: `docs/projects/content-graph/IG-16-AUDIT.md`. Learn **Essential Candles** (15 questions), 2 glossary terms.
- **Which Way?** (`/practice/which-way`): every pattern (96 candlesticks, 62 chart patterns) drawn after its prior trend; pick Up, Down or Either (keys ↑ ↓ ← → or U D E), then see the direction, why, and the confirmation to wait for. Scored like Learn quizzes (points, Answer streak, 70% pass after 10 answers), and your place is saved. Every pattern has a `potentialDirection` (`src/lib/patternDirections.ts`), shown in its Archive card; `whichWay.test.ts` checks it agrees with the pattern's themes. Learn **Which Way?** (10 questions), 2 glossary terms.

### Playbooks (`/playbooks`)

17 kits, each built from fetched authoritative sources: gap and go, hold above the average, swing bias from the long average, reclaim the short average, covered call, cash-secured put, protective put, dollar-cost averaging, rebalance to a target mix, stop vs stop-limit on a gap, short sale with a buy stop, and futures offset / roll / settlement, and price action in four pillars (map, confirmation, invalidation, context; Brando Trades on YouTube, with in-app links for exits, the video embedded via youtube-nocookie with a credit to the creator, and a "How well-tested is this?" panel: the package is his own framing with no independent track record, but each pillar is backed by mainstream teaching from Al Brooks, The Right Trader and Hollow Point Trading), and breakout, pullback and fair value gap (inspired by a short Facebook trading reel, sourced to NinjaTrader's fair value gap guide; its "How well-tested is this?" panel says the exact recipe has no independent track record and "often retested" is a belief, then backs each idea with LuxAlgo, Capital.com, NinjaTrader, Alien Algorithms and Al Brooks), and a risk-premium ETF mix with a VIX overlay (Predicting Alpha on YouTube, embedded via youtube-nocookie with a channel credit, sourced to Bridgewater's All Weather story; its "How well-tested is this?" panel says the exact portfolio and its numbers are the creator's own backtest before a paid pitch, warns on short volatility and leverage, then backs each building block with Bridgewater, AQR, Meb Faber, FINRA, Cboe, CNBC and an SEC filing), and VIX futures curve and carry, paper trade first (from the article "VIX Trading for Beginners", sourced to Cboe's VIX futures page, no video; its "How well-tested is this?" panel says it is a framework, not a strategy with a track record, and backs each idea with Cboe, the New York Fed, BlackRock, the SEC, FINRA, NFA, ProShares and Volatility Shares), and the wheel: cash-secured puts to covered calls (sourced to Schwab's "Three Things to Know About the Wheel Strategy", with tastylive's 55-second "What Is The Wheel Strategy?" embedded via youtube-nocookie as an optional extra; its "How well-tested is this?" panel says both legs are standard, low-tier strategies and Cboe's PUT / BXM indexes have a long record, with nearly the stock's downside, and backs each step with Schwab, OIC, Fidelity, FINRA, the IRS, Wilshire for Cboe and Neuberger Berman). `npm run check:playbook-sources` re-checks the URLs, plus any embedded video, credited channel and credibility sources.

### Progress rules

- A Learn quiz counts as **passed at 70%**.
- A case awards points **once per case** (10 correct · 5 partial · 1 incorrect); replays award 0.
- **Answer streak** = correct answers in a row; **Day streak** (Academy) = days with a Today answer.
- The **Progress map** marks a Learn group done once its quiz is passed (70%), a lab once its practice is marked done, a page once visited, and a hub or Academy level by the share of its items finished.
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
