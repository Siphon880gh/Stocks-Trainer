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
| **Path & progress** | Pick a track and see real milestones / PTS / streak | Dashboard GoalPicker | Path confirmed; step chrome updates |
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

Detailed click scripts (exact labels for QA): [`QA_User_Flows.md`](./QA_User_Flows.md). E11 coaching QA is **UF-18**.

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

**Coaching queue:** `step_coaching_order` · epic **E11** · loop [`AGENTS_LOOP-Step-Coaching.md`](./AGENTS_LOOP-Step-Coaching.md).

---

## 6. App map (where things live)

| Route | Role |
|-------|------|
| `/` | Home · GoalPicker · path CTA · Account |
| `/training` | Learn (literacy, indicators, pattern drills, answer sheet) |
| `/market` | Charts · Market navigator · SAMPLE / DELAYED overlays |
| `/archive` | Patterns · Indicators · Literacy |
| `/cases` · `/cases/:caseId` | Decide-and-reveal case library |
| `/practice-draw` | Sketch + grade |
| `/coach` · `/coach/:slug` | Step-by-step coaching (decision trees · no LLM) |
| `/playbooks` · `/playbooks/:id` | Playbooks — strategy kits from a source URL (four collapsed panels) |

Chrome: **Home** · **Learn** · **Charts** · **Cases** · **Coach** · **Playbooks**.

Teaching formats (quiz, step-by-step, playbook, case, chart pack, reference, practice, snapshot): [`RESOURCES.md`](./RESOURCES.md).

Progress is stored locally (`localStorage` key `analysis_core_progress_v1`).

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Dev server (port **3001**) |
| `npm run build` | Production build → `dist/` |
| `npm run preview` | Preview production build |
| `npm run lint` | TypeScript check |
| `npm run test:coaching` | E11 coaching validate/nav/path tests |
| `npm run clean` | Remove `dist/` |

---

## Tech stack

React 19 · TypeScript · Vite 6 · Tailwind CSS 4 · Recharts · React Router · Motion
