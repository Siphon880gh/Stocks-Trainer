# Navigation inventory

A list of every route, topic and deep link in the app, taken from the code on 2026-11-25 after the directional navigation change. Use it to check that any navigation change keeps a way in to everything built so far.

Every row points to the file it came from. The counts come from the data modules themselves (`QUIZ_GROUPS`, `listSessions()`, `CASE_STUDIES`, `UNITS`, `DESK_SCENARIOS` and so on), not from hand counting. When content is added, update the matching section; `src/lib/navInventory.test.ts` fails if a route in `src/App.tsx` is missing from this file or has no header, Browse everything, Table of Contents or progress map entry point.

The plan for the guided navigation (tracks, Next up, Browse everything) is in [`docs/projects/navigation/DIRECTIONAL-NAV-PROPOSAL.md`](./projects/navigation/DIRECTIONAL-NAV-PROPOSAL.md).

## Contents
1. [How to use this during the navigation change](#1-how-to-use-this-during-the-navigation-change)
2. [Counts](#2-counts)
3. [Navigation surfaces](#3-navigation-surfaces)
4. [Every route and its entry points](#4-every-route-and-its-entry-points)
5. [Topics and resources by area](#5-topics-and-resources-by-area)
6. [Deep links and anchors](#6-deep-links-and-anchors)
7. [Orphans and at-risk items](#7-orphans-and-at-risk-items)
8. [Automated guard](#8-automated-guard)

## 1. How to use this during the navigation change

Before merging any navigation change, walk this checklist. "Reachable" means a learner can get there by clicking from the header, starting at any page, with no typed URL.

- [ ] Every **static route** in section 4 is reachable from the header within 2 clicks (menu, then item), and from Browse everything (`/browse`) within 2.
- [ ] Every **param route** in section 4 has its hub still reachable, and the hub still lists every item (all 99 coach sessions, 20 playbooks, 18 macro lessons, 45 Academy units, 8 level test-outs, 10 challenges, 8 tool lessons, 517 cases).
- [ ] Every **deep link** in section 6 still opens the same thing: `?group=` opens the Quiz panel on that group, `&start=1` starts it, Table of Contents hashes (`#patterns`, `#concepts`, `#practice`, `#tools`, `#cases`, `#coach`, `#playbooks`, `#paper`, `#challenges`, `#financials`, `#macro`, `#charts`, `#buy-or-sell`) still land on the right panel, and page query params (`?pack=`, `?tab=&open=`, `?round=`, `?sim=`, `?theme=`, `?n=`, `?check=1`, `?nav=1`, `?class=`) still work.
- [ ] If a hash or path is renamed, keep the old one working as an alias or redirect, because these links are stored inside content data (quiz explanations, playbooks, Academy refs, cases, progress map stages).
- [ ] Every item in section 7 (orphans and at-risk) has at least one entry point in the new design; ideally fix the single-path ones.
- [ ] The progress map (`/map`) still links each of its 180 stages, and `PARAM_ROUTE_STAGE` in `src/lib/progressMap.ts` still matches the param routes.
- [ ] `src/lib/academy/refs.ts` `APP_ROUTES` and this file are updated together with `src/App.tsx`; `npm run verify` passes (runs `refs.test.ts` and `navInventory.test.ts`).
- [ ] `npm run test:e2e` passes, especially the directional nav (picker, Next up, Browse everything), Table of Contents and progress map checks in `e2e/smoke.mjs`.

## 2. Counts

| Area | Count | Source |
|---|---:|---|
| Routes in `src/App.tsx` | 74 | `src/App.tsx` |
| · static routes | 66 |  |
| · param routes | 8 |  |
| Header top-level destinations | 6 | `HEADER_NAV` in `src/lib/appNav.ts` |
| · header menus (Learn, Practice, Trade) | 3 | `src/components/AppChrome.tsx` |
| · header dropdown items (each with one level) | 88 | `LEVEL_MENUS` in `src/lib/navLevels.ts` |
| · learn dropdown: Beginner 7 / Intermediate 5 / Advanced 10 | 22 | `src/lib/navLevels.ts` |
| · practice dropdown: Beginner 11 / Intermediate 20 / Advanced 18 | 49 | `src/lib/navLevels.ts` |
| · trade dropdown: Beginner 5 / Intermediate 6 / Advanced 6 | 17 | `src/lib/navLevels.ts` |
| Practice families (Browse everything) | 7 | `PRACTICE_FAMILY_IDS` in `src/lib/appNav.ts` |
| Old menu catalog items (kept as data for the ToC and Browse everything) | 82 | `src/lib/appNav.ts` |
| Browse everything sections / links | 19 / 171 | `BROWSE_SECTIONS` in `src/lib/browseCatalog.ts` |
| Learner tracks (incl. Show me everything) / steps | 8 / 95 | `TRACKS` in `src/lib/tracks.ts` |
| Table of Contents carousel groups | 7 | `src/pages/Training.tsx` |
| Quiz groups | 107 | `QUIZ_GROUPS` in `src/lib/quizData.ts` |
| · pattern quiz groups (`#patterns`) | 41 | `src/lib/quizKinds.ts` |
| · concept quiz groups (`#concepts`) | 66 | `src/lib/quizKinds.ts` |
| Quiz questions (sum over groups) | 2200 | `getQuestionsForGroup()` |
| Practice labs (Practice menu) | 45 | `MISC_PRACTICE_ITEMS` in `src/lib/miscPractices.ts` |
| · of which market themes | 10 | `MARKET_THEMES` in `src/lib/marketThemes/index.ts` |
| Other practice pages (Candle basics, Statements lab, Read the Print, Mark the band) | 4 | `src/lib/appNav.ts` |
| Tool Training lessons | 8 | `TOOL_LESSONS` in `src/lib/toolTraining/index.ts` |
| Academy levels | 8 | `LEVELS` in `src/lib/academy/content/levels.ts` |
| Academy units | 45 | `UNITS` |
| Options ladder levels / strategies | 4 / 13 | `src/lib/academy/options/ladder.ts` |
| Paper challenges | 10 | `CHALLENGES` in `src/lib/academy/challenges.ts` |
| Paper desk scenarios | 30 | `DESK_SCENARIOS` in `src/lib/academy/paper/desk/scenarios.ts` |
| · HISTORICAL / SIMULATED | 1 / 29 |  |
| Paper desk topics | 11 | `DESK_TOPICS` |
| Case packs | 17 | `CASE_PACKS` in `src/lib/caseStudies.ts` |
| Cases | 517 | `CASE_STUDIES` |
| Coach sessions | 99 | `listSessions()` in `src/lib/coaching/index.ts` |
| Playbooks | 20 | `PLAYBOOKS` in `src/lib/playbooks.ts` |
| Macro lessons | 18 | `MACRO_LESSONS` in `src/lib/macro/lessons.ts` |
| Macro game rounds | 29 | `MACRO_ROUNDS` in `src/lib/macro/game.ts` |
| Library patterns | 158 | `PATTERNS` in `src/lib/patterns.ts` |
| Library indicators | 5 | `OVERLAYS` in `src/lib/overlays.ts` |
| Glossary (literacy) terms | 613 | `LITERACY_TERMS` in `src/lib/literacyTerms.ts` |
| Pattern themes | 17 | `THEMES` in `src/lib/patternThemes.ts` |
| Technique narratives | 6 | `NARRATIVES` in `src/lib/techniqueNarratives.ts` |
| Content simulation sets (`?sim=`) | 25 | `CONTENT_SIM_SETS` in `src/lib/contentSims.ts` |
| Learning paths (GoalPicker) | 3 | `PATH_TEMPLATES` in `src/lib/learningPaths.ts` |
| Progress map regions / stages | 12 / 180 | `REGIONS`, `STAGES` in `src/lib/progressMap.ts` |
| Distinct deep-link kinds in use (route + param or hash) | 31 | section 6 |

## 3. Navigation surfaces

### Header (`src/components/AppChrome.tsx`, items in `src/lib/appNav.ts`)

The header has a logo link to `/`, six top-level destinations and a path chip (`track-chip`) that names the learner track and opens the path picker as a dialog (portal to `document.body`, `Z.modal`, above the sticky header; it hides the corner AI helper while open). Learn, Practice and Trade open on the chevron; their labels navigate.

| Destination | Label link | Dropdown (`data-testid`) |
|---|---|---|
| Home | `/` | — (`nav-home`) |
| Learn | `/academy` | 22 items in level tabs (`learn-menu`, panel `learn-menu-panel`) |
| Practice | `/training#practice` | 49 items in level tabs (`practice-menu`, panel `practice-menu-panel`) |
| Trade | (no label link) | 17 items in level tabs (`trade-menu`, panel `trade-menu-panel`) |
| Map | `/map` | — (`nav-map`) |
| Browse everything | `/browse` | — (`nav-browse`) |

### Dropdown level tabs (`src/components/NavTabsMenu.tsx`, data in `src/lib/navLevels.ts`)

Each dropdown is a tab row (`role="tablist"`) over tab panels: **For your path** (only with a track; selected by default then), **Beginner**, **Intermediate**, **Advanced**. Without a track Beginner opens. The last tab used is remembered per menu in `localStorage` under `analysis_core_nav_tab_v1` (for the same track; a new track opens on For your path). A tab shows at most 12 items in up to 4 labelled groups, each with a one-line description; longer tabs end with “Show all”. For your path lists the track's unfinished steps that belong to that menu (from `src/lib/tracks.ts`), with “Step n of N”. Browse everything is the footer of every dropdown. Keys: arrow Left and Right (wrapping), Home and End move between tabs and select them, arrow Down enters the panel, Escape closes and returns focus to the toggle. The panel uses `Z.popover`, is pinned under the header (full width on a phone, right edge from `sm` up) and the tab row scrolls sideways when it does not fit.

Levels follow the app's own order: the Academy (L0–L3 basics, L4–L5 fundamentals and macro, L6–L7 options and other markets), the Beginner Equities path first, and the case packs (equity earnings and company news first; options context, futures, forex and crypto last). Labs: first candles and chart reading are Beginner; price action, patterns, indicators and the broad market themes are Intermediate; options, precision day trading, portfolios, automation and commodity themes are Advanced.

| Dropdown | Tab | Items | Groups (items) |
|---|---|---:|---|
| Learn | Beginner | 7 | Start here (3); Look it up (3); Company numbers (1) |
| Learn | Intermediate | 5 | Concepts and numbers (3); Economy (2) |
| Learn | Advanced | 10 | Options (1); Research tools (9) |
| Practice | Beginner | 11 | First candles (6); Reading a chart (4); Company numbers (1) |
| Practice | Intermediate | 20 | Price action (5); Patterns (4); Indicators (4); Earnings and markets (7) |
| Practice | Advanced | 18 | Options and volatility (6); Precision day trading (3); Portfolio and automation (3); Commodities and records (6) |
| Trade | Beginner | 5 | First decisions (2); Practice money (1); First cases (2) |
| Trade | Intermediate | 6 | Guided decisions (4); Scored practice (2) |
| Trade | Advanced | 6 | Full desk (2); Other markets (4) |

<details><summary>Learn dropdown: 22 items by level</summary>

- **Beginner:** Academy lessons (`/academy`, Start here), Candlestick Basics (`/practice/candle-basics`, Start here), Table of Contents (`/training`, Start here), Library and glossary (`/archive`, Look it up), Glossary terms (`/archive?tab=literacy`, Look it up), Quiz (Patterns) (`/training#patterns`, Look it up), Statements lab (`/practice/statements`, Company numbers)
- **Intermediate:** Quiz (Concepts) (`/training#concepts`, Concepts and numbers), Financials (`/training#financials`, Concepts and numbers), Indicator cards (`/archive?tab=indicators`, Concepts and numbers), Macro (`/training#macro`, Economy), Macro desk (`/macro`, Economy)
- **Advanced:** Options ladder (`/academy/options`, Options), Tool Training (`/tools`, Research tools), Market Forces (`/tools/market-forces`, Research tools), StockAnalysis (`/tools/stockanalysis`, Research tools), Finviz (`/tools/finviz`, Research tools), Yahoo Finance (`/tools/yahoo-finance`, Research tools), SEC EDGAR (`/tools/sec-edgar`, Research tools), Earnings dates and insiders (`/tools/earnings-insiders`, Research tools), Capstone: one ticker, four tools (`/tools/capstone`, Research tools), Capstone 2: a bank, step by step (`/tools/capstone-bank`, Research tools)

</details>

<details><summary>Practice dropdown: 49 items by level</summary>

- **Beginner:** Japanese candlesticks (`/practice/japanese-candles`, First candles), Essential candlestick patterns (`/practice/essential-candles`, First candles), Missing wicks and zooming in (`/practice/missing-wicks`, First candles), Which Way? (Up, Down or Either) (`/practice/which-way`, First candles), Flashcards (`/practice/flashcards`, First candles), Label (`/practice/label`, First candles), Trend vs range (`/practice/regime`, Reading a chart), Support and resistance (`/practice/levels`, Reading a chart), Pattern themes (`/practice/pattern-themes`, Reading a chart), Heikin-Ashi candles (`/practice/heikin-ashi`, Reading a chart), Statements lab (`/practice/statements`, Company numbers)
- **Intermediate:** Bar replay (`/practice/replay`, Price action), Mark the plan (`/practice/plan`, Price action), Invalidation (`/practice/invalidation`, Price action), Price action trading framework (`/practice/trade-framework`, Price action), Opening range: retests, failed breaks & risk (`/practice/opening-range`, Price action), Reversal chart patterns (`/practice/reversal-charts`, Patterns), Pattern hunt (`/practice/hunt`, Patterns), Lookalikes (`/practice/lookalike`, Patterns), EMA, SMA and MACD (long charts) (`/practice/ema-macd`, Indicators), Oscillators & volatility stop (`/practice/oscillators`, Indicators), Read the Print (`/practice/read-the-print`, Earnings and markets), Candlesticks for crypto (`/practice/crypto-candles`, Earnings and markets), Drawing (`/practice-draw`, Patterns), Technique narratives (`/practice/technique-narratives`, Indicators), Indicator & charting apps (`/practice/charting-apps`, Indicators), Same theme, different wrapper: stocks, funds and futures (`/practice/exposure-wrappers`, Earnings and markets), Sectors and rotation: the 11 sectors, sector funds, REITs and the business cycle (`/practice/sectors-rotation`, Earnings and markets), Index and style: size, region, style and how index weights work (`/practice/index-style`, Earnings and markets), Bonds and rates: SGOV, SHY, IEF, TLT, TIP and duration (`/practice/bonds-rates`, Earnings and markets), Currency funds and the dollar (`/practice/currency-funds`, Earnings and markets)
- **Advanced:** News, biases & short-term options (`/practice/news-biases`, Options and volatility), Futures vs options & beginner toolkit (`/practice/futures-vs-options`, Options and volatility), Options ladder (`/academy/options`, Options and volatility), The wheel strategy (cash-secured puts to covered calls) (`/practice/wheel-strategy`, Options and volatility), Gamma squeeze case (`/practice/gamma-squeeze`, Options and volatility), VIX trading for beginners (`/practice/vix-trading`, Options and volatility), Breakout, pullback and fair value gap (`/practice/fair-value-gap`, Precision day trading), Fibonacci as a decision map (`/practice/fib-decision-map`, Precision day trading), Reading 1-minute charts (`/practice/one-minute-charts`, Precision day trading), Mark the band (`/practice/mark-the-band`, Portfolio and automation), Risk-premium portfolio and the VIX overlay (`/practice/risk-premium-portfolio`, Portfolio and automation), Automated & algo trading (2026) (`/practice/algo-trading`, Portfolio and automation), Record-setting traders (`/practice/record-traders`, Commodities and records), Precious metals: gold, silver and the miners (`/practice/precious-metals`, Commodities and records), Energy: oil, natural gas and the companies (`/practice/energy`, Commodities and records), Industrial and transition metals: copper, uranium and clean energy (`/practice/industrial-metals`, Commodities and records), Agriculture and inputs: crops, fertilizer and farm equipment (`/practice/agriculture`, Commodities and records), Materials, chemicals and resins: Dow, LyondellBasell, Westlake, Eastman (`/practice/materials-chemicals`, Commodities and records)

</details>

<details><summary>Trade dropdown: 17 items by level</summary>

- **Beginner:** Buy or Sell (`/training#buy-or-sell`, First decisions), Charts (`/market`, First decisions), Paper trading (`/paper`, Practice money), Earnings cases (`/cases?pack=earnings`, First cases), Company news cases (`/cases?pack=company-news`, First cases)
- **Intermediate:** Coach (`/coach`, Guided decisions), Cases (`/cases`, Guided decisions), Market-wide news cases (`/cases?pack=macro-news`, Guided decisions), Price action cases (`/cases?pack=price-action`, Guided decisions), Challenges (`/paper/challenges`, Scored practice), Macro play (`/macro/play`, Scored practice)
- **Advanced:** Paper desk (`/paper/desk`, Full desk), Playbooks (`/playbooks`, Full desk), Options context cases (`/cases?pack=options-context`, Other markets), Futures cases (`/cases?pack=futures`, Other markets), Forex cases (`/cases?pack=forex`, Other markets), Crypto cases (`/cases?pack=crypto`, Other markets)

</details>

The old header groups (`APP_NAV`, `DASHBOARD_MORE`, `ACADEMY_MORE`, `PATTERN_MORE`, `PRACTICE_MENU`, `TOOL_TRAINING`, `DEEP_STUDY`, `OTHER_FACTORS`, `QUICK_DECISIONS`) stay in `src/lib/appNav.ts` as catalog data: the Table of Contents and Browse everything read them, and `navInventory.test.ts` checks that every old item still has a header or Browse entry.

### Browse everything (`/browse`, `src/pages/BrowseEverything.tsx`, data in `src/lib/browseCatalog.ts`)

One click from the header, every menu, Home and the Show me everything track. Links to the full Table of Contents (`browse-toc`), the Library and the map, then every section below. The search box (`browse-search`) matches every word against labels across catalog links, quiz groups (`/training?group=`), Academy lessons, coach sessions, cases, glossary terms (`/archive?tab=literacy&open=`) and patterns (`/archive?tab=patterns&open=`), up to 40 results.

| Section | Links |
|---|---:|
| Start points | 4 |
| Learn | 12 |
| Practice: Candles and patterns | 11 |
| Practice: Price action and day trading | 10 |
| Practice: Indicators and charting apps | 5 |
| Practice: Statements and earnings | 3 |
| Practice: Options and volatility | 7 |
| Practice: Other markets | 11 |
| Practice: Automation and records | 2 |
| Trade and decide | 9 |
| Tool Training | 10 |
| Financials and macro | 7 |
| Quick Decisions | 2 |
| Academy level test-outs | 8 |
| Macro lessons | 18 |
| Coach by market | 5 |
| Case packs | 17 |
| Paper challenges | 10 |
| Playbooks | 20 |

### Learner tracks and Next up (`src/lib/tracks.ts`, `src/components/TrackPicker.tsx`, `src/components/NextUpCard.tsx`)

The track is saved in `localStorage` under `analysis_core_track_v1` as `{id, at}`, apart from the milestone path, so changing it never resets progress. The first pick also confirms the matching milestone path (`confirmPathSelection`). A step with a map stage is done when the stage is done; a case-pack step when any case in the pack has a result; any other step once its page was visited. Next up shows the first three steps not done.

| Track | Milestone path | Steps | First step |
|---|---|---:|---|
| New to stocks (`new-to-stocks`) | `beginner-equities` | 15 | Placement check or “I'm brand new” (`/academy`) |
| Charts and patterns (`charts-patterns`) | `beginner-equities` | 15 | Candlestick Basics (`/practice/candle-basics`) |
| Active and day trading (`active-trader`) | `beginner-equities` | 15 | Price action trading framework (`/practice/trade-framework`) |
| Company fundamentals and earnings (`fundamentals`) | `decision-maker` | 13 | Academy L4 Company fundamentals & earnings (`/academy`) |
| Macro and news (`macro-news`) | `beginner-equities` | 12 | Academy L5 Macro & rates (`/academy`) |
| Options and volatility (`options-vol`) | `beginner-equities` | 12 | Academy L6 Options education (test-out first if ready) (`/academy`) |
| Other markets (`other-markets`) | `market-explorer` | 10 | Indicators quiz (chart gate) (`/training?group=indicators`) |
| Show me everything (`everything`) | `decision-maker` | 3 | Browse everything: search and every page (`/browse`) |

### Table of Contents (`/training`, `src/pages/Training.tsx` + `src/components/PanelCarousel.tsx`)

Above the carousel sits the path map panel (`id="path"`, `src/components/PathMapPanel.tsx`). The carousel shows one group at a time; the hash picks the group (an alias hash opens the group that contains it). A `?group=` link with no hash opens the Quiz group. The footer links to the Library (`/archive`).

| Group id | Label | Hash aliases | What it holds |
|---|---|---|---|
| `academy` | Academy | — | `AcademyTrainingCard`: link to `/academy`, `/coach/first-paper-trade`, and Start buttons for each Academy quiz group (`/training?group=<id>&start=1`). |
| `quiz` | Quiz (Patterns) / Quiz (Concepts) | `concepts`, `patterns`, `quiz` | Quiz picker: 41 pattern groups on `#patterns`, 66 concept groups on `#concepts`; answer sheet; streak; link to Candlestick Basics. |
| `practice` | Practice | — | One link per `PRACTICE_MENU` item (46). |
| `tool-training` | Tool Training | `tools` | One link per `TOOL_TRAINING` item (10). |
| `deep-study` | Deep Study | `cases`, `coach`, `playbooks`, `paper`, `challenges` | Cases (open + 4 pack links), the Coach catalog and every coach session (99), all playbooks and every playbook (20), Paper trading, the Paper desk, Challenges. |
| `other-factors` | Other factors | `financials`, `macro` | `FinancialsTrainingCard` (Read the Print, Mark the band, Statements lab, `#forecast`, financials quiz Start buttons) and `MacroTrainingCard` (Macro desk, Macro play, macro quiz Start buttons). |
| `quick-decisions` | Quick Decisions | `charts`, `buy-or-sell` | Charts (`/market`, `/market?nav=1`) and the Buy or Sell? panel. |

### Other surfaces

- **Home** (`src/pages/Dashboard.tsx`): the path picker (`track-picker`) until a track is saved, then the Next up card (`next-up`, `next-up-step`, `next-up-change`, `next-up-browse`). `PlacementCard` shows on the New to stocks track; `TodayCard` and `ProgressMapCard` after the path is confirmed. The milestone path (`home-milestones`, a details block) keeps the Continue link, coach shortcuts (`/coach/earnings-beat-miss`, `/coach/chase-vs-fade`, `/coach/short-vs-sell`, `/coach`) and literacy quiz links (`news-literacy`, `earnings-jargon`, `financial-drills`). A short link row: Browse everything (`home-browse`), Table of Contents, Market navigator, Library, Drawing. The embedded full map and the section pills (`AppSectionNav`) are gone from Home; the pills remain on `/academy`.
- **Progress map** (`/map`, `src/pages/ProgressMap.tsx`): links every stage `to` (180 stages across 12 regions); `map-next-link` is the next objective.
- **Hub pages** list their children: Cases (`src/pages/Cases.tsx`), Coach (`src/pages/Coach.tsx`), Playbooks (`src/pages/Playbooks.tsx`), Tool Training (`src/pages/ToolsHub.tsx`), Macro Desk (`src/pages/macro/MacroDesk.tsx`), Academy (`src/pages/academy/AcademyHub.tsx`), Paper (`src/pages/academy/Paper.tsx`), Challenges (`src/pages/academy/PaperChallenges.tsx`).
- **In-content links**: quiz explanations, glossary buttons (`src/components/JargonText.tsx`), playbooks, cases, Academy unit refs (`src/lib/academy/refs.ts`), lesson pages and breadcrumbs. Section 4 lists the files per route.

## 4. Every route and its entry points

74 routes (66 static, 8 with a param). "Menu" is the header, "Browse" is Browse everything, "Track" is a learner-track step shown in Next up, "ToC" is the Table of Contents, "Map" is the progress map, and "In-content" is every other source file that links to the route (tests excluded).

### Core pages

#### `/`

- **Page:** `src/pages/Dashboard.tsx`
- **Teaches:** Home: path picker on first visit (7 learner tracks plus Show me everything), then the Next up card with the next 1–3 steps of the chosen track; Today and progress map cards, the milestone path folded in a details block, Browse everything link, account export/import.
- **Menu:** Header › logo “Learn Stocks” (`/`); Header: “Home” (`/`)
- **Browse:** Browse everything › Start points: “Home” (`/`)
- **ToC:** none
- **Map:** Progress map: 1 stage(s) — `page:/`
- **In-content (0 files):** none

#### `/browse`

- **Page:** `src/pages/BrowseEverything.tsx`
- **Teaches:** Browse everything: every lesson, lab, quiz and tool grouped in one page, with search across quizzes, Academy lessons, coach sessions, cases, glossary terms and patterns.
- **Menu:** Header: “Browse everything” (`/browse`); Header › Learn, Practice and Trade dropdowns: footer “Browse everything” (`<menu>-menu-browse`)
- **Browse:** none
- **Track:** Track “Show me everything” step 1: “Browse everything: search and every page”
- **ToC:** none
- **Map:** Progress map: 1 stage(s) — `page:/browse`
- **In-content (2 files):** `src/components/NextUpCard.tsx`, `src/pages/Dashboard.tsx`

#### `/training`

- **Page:** `src/pages/Training.tsx`
- **Teaches:** Table of Contents (Learn): path map plus a carousel of 7 groups (Academy, Quiz, Practice, Tool Training, Deep Study, Other factors, Quick Decisions); runs every quiz group.
- **Menu:** Header › Learn › Beginner › Look it up: “Quiz (Patterns)” (`/training#patterns`); Header › Learn › Beginner › Start here: “Table of Contents” (`/training`); Header › Learn › Intermediate › Concepts and numbers: “Financials” (`/training#financials`); Header › Learn › Intermediate › Concepts and numbers: “Quiz (Concepts)” (`/training#concepts`); Header › Learn › Intermediate › Economy: “Macro” (`/training#macro`); Header › Trade › Beginner › First decisions: “Buy or Sell” (`/training#buy-or-sell`); Header: “Practice” (`/training#practice`)
- **Browse:** Browse everything › Financials and macro: “Financials” (`/training#financials`); Browse everything › Financials and macro: “Macro” (`/training#macro`); Browse everything › Learn: “Financials” (`/training#financials`); Browse everything › Learn: “Macro” (`/training#macro`); Browse everything › Learn: “Quiz (Concepts)” (`/training#concepts`); Browse everything › Learn: “Quiz (Patterns)” (`/training#patterns`); Browse everything › Learn: “Table of Contents” (`/training`); Browse everything › Quick Decisions: “Buy or Sell” (`/training#buy-or-sell`); … 2 more
- **Track:** Track “Active and day trading” step 15: “Trading risk quiz”; Track “Active and day trading” step 2: “Four pillars quiz”; Track “Charts and patterns” step 10: “Chart patterns quiz”; Track “Charts and patterns” step 2: “Candle anatomy, then candle reading quizzes”; Track “Charts and patterns” step 7: “Candle pattern book quiz”; Track “Company fundamentals and earnings” step 2: “Statements literacy quiz”; Track “Company fundamentals and earnings” step 4: “Reading the statements quiz”; Track “Company fundamentals and earnings” step 5: “13-week cash forecast quiz”; … 14 more
- **ToC:** ToC › academy card (AcademyTrainingCard.tsx): `/training?group=${g.id}&start=1`; ToC › other-factors (#financials) card (FinancialsTrainingCard.tsx): `/training?group=${g.id}&start=1`; ToC › other-factors (#macro) card (MacroTrainingCard.tsx): `/training?group=${g.id}&start=1`
- **Map:** Progress map: 108 stage(s) — `page:/training`, `quiz:equity-literacy`, `quiz:financial-literacy`, `quiz:news-literacy`, `quiz:earnings-jargon`, `quiz:financial-drills` …
- **In-content (72 files):** `src/components/IndicatorDetailModal.tsx`, `src/components/MarketNavigator.tsx`, `src/components/NavTabsMenu.tsx`, `src/components/OrbContextLab.tsx`, `src/components/PatternDetailModal.tsx`, `src/components/PracticeShell.tsx`, `src/components/ScanPatternsModal.tsx`, `src/components/tools/ToolLessonPage.tsx`, `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/academy/options/ladder.ts (Academy ref)`, `src/lib/beginnerPath.ts`, `src/lib/fairValueGap.ts`, `src/lib/fourPillars.ts`, `src/lib/macro/homeTip.ts`, `src/lib/marketNavigator.ts`, `src/lib/marketThemes/agriculture.ts`, `src/lib/marketThemes/bonds.ts`, `src/lib/marketThemes/currencyFunds.ts`, `src/lib/marketThemes/energy.ts`, `src/lib/marketThemes/indexStyle.ts`, `src/lib/marketThemes/industrialMetals.ts`, `src/lib/marketThemes/materials.ts`, `src/lib/marketThemes/preciousMetals.ts`, `src/lib/marketThemes/sectors.ts`, `src/lib/marketThemes/structure.ts`, `src/lib/openingRange.ts`, `src/lib/playbooks.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/toolTraining/capstone.ts`, `src/lib/toolTraining/capstoneBank.ts`, `src/lib/toolTraining/earningsInsiders.ts`, `src/lib/toolTraining/edgar.ts`, `src/lib/toolTraining/finviz.ts`, `src/lib/toolTraining/marketForces.ts`, `src/lib/toolTraining/stockAnalysis.ts`, `src/lib/toolTraining/yahooFinance.ts`, `src/lib/tradeFramework.ts`, `src/lib/vixTrading.ts`, `src/lib/wheelStrategy.ts`, `src/pages/Archive.tsx`, `src/pages/BrowseEverything.tsx`, `src/pages/CasePlayer.tsx`, `src/pages/Cases.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Market.tsx`, `src/pages/Playbook.tsx`, `src/pages/PracticeDraw.tsx`, `src/pages/ToolsHub.tsx`, `src/pages/academy/AcademyHub.tsx`, `src/pages/academy/OptionsLadder.tsx`, `src/pages/macro/MacroDesk.tsx`, `src/pages/macro/MacroLesson.tsx`, `src/pages/macro/MacroPlay.tsx`, `src/pages/practice/AlgoTrading.tsx`, `src/pages/practice/CandleBasics.tsx`, `src/pages/practice/ChartingApps.tsx`, `src/pages/practice/CryptoCandles.tsx`, `src/pages/practice/EssentialCandles.tsx`, `src/pages/practice/FuturesVsOptions.tsx`, `src/pages/practice/GammaSqueeze.tsx`, `src/pages/practice/HeikinAshi.tsx`, `src/pages/practice/JapaneseCandles.tsx`, `src/pages/practice/MissingWicks.tsx`, `src/pages/practice/NewsBiases.tsx`, `src/pages/practice/OneMinuteCharts.tsx`, `src/pages/practice/Oscillators.tsx`, `src/pages/practice/PatternThemes.tsx`, `src/pages/practice/RecordTraders.tsx`, `src/pages/practice/ReversalCharts.tsx`, `src/pages/practice/TechniqueNarratives.tsx`

#### `/market`

- **Page:** `src/pages/Market.tsx`
- **Teaches:** Charts: SAMPLE/DELAYED candles with overlays (SMA, EMA, RSI, MACD, Bollinger), pattern scan, market navigator (`?nav=1`, `?class=`).
- **Menu:** Header › Trade › Beginner › First decisions: “Charts” (`/market`)
- **Browse:** Browse everything › Quick Decisions: “Charts” (`/market`); Browse everything › Trade and decide: “Charts” (`/market`)
- **ToC:** ToC › quick-decisions: `/market?nav=1`; ToC › quick-decisions: `/market`
- **Map:** Progress map: 1 stage(s) — `page:/market`
- **In-content (4 files):** `src/lib/marketNavigator.ts`, `src/lib/playbookPrompt.ts`, `src/pages/Dashboard.tsx`, `src/pages/Playbook.tsx`

#### `/archive`

- **Page:** `src/pages/Archive.tsx`
- **Teaches:** Library: candlestick and chart pattern cards, indicator cards, and the literacy glossary (`?tab=patterns|indicators|literacy`, `?open=<id>`).
- **Menu:** Header › Learn › Beginner › Look it up: “Glossary terms” (`/archive?tab=literacy`); Header › Learn › Beginner › Look it up: “Library and glossary” (`/archive`); Header › Learn › Intermediate › Concepts and numbers: “Indicator cards” (`/archive?tab=indicators`)
- **Browse:** Browse everything › Learn: “Library and glossary” (`/archive`); Browse everything › Start points: “Library and glossary” (`/archive`)
- **Track:** Track “Charts and patterns” step 15: “Library: patterns tab”
- **ToC:** ToC › (footer): `/archive`
- **Map:** Progress map: 1 stage(s) — `page:/archive`
- **In-content (44 files):** `src/components/IndicatorGlossary.tsx`, `src/components/OrbContextLab.tsx`, `src/components/QuizModal.tsx`, `src/components/ScanPatternsModal.tsx`, `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/academy/options/ladder.ts (Academy ref)`, `src/lib/fairValueGap.ts`, `src/lib/financials/format.ts`, `src/lib/marketNavigator.ts`, `src/lib/openingRange.ts`, `src/lib/playbooks.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/vixTrading.ts`, `src/pages/BrowseEverything.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Market.tsx`, `src/pages/PracticeDraw.tsx`, `src/pages/academy/OptionsLadder.tsx`, `src/pages/macro/MacroLesson.tsx`, `src/pages/practice/AlgoTrading.tsx`, `src/pages/practice/ChartingApps.tsx`, `src/pages/practice/CryptoCandles.tsx`, `src/pages/practice/EssentialCandles.tsx`, `src/pages/practice/FairValueGap.tsx`, `src/pages/practice/FibDecisionMap.tsx`, `src/pages/practice/Flashcards.tsx`, `src/pages/practice/FuturesVsOptions.tsx`, `src/pages/practice/GammaSqueeze.tsx`, `src/pages/practice/JapaneseCandles.tsx`, `src/pages/practice/MissingWicks.tsx`, `src/pages/practice/NewsBiases.tsx`, `src/pages/practice/OneMinuteCharts.tsx`, `src/pages/practice/OpeningRange.tsx`, `src/pages/practice/Oscillators.tsx`, `src/pages/practice/PatternThemes.tsx`, `src/pages/practice/RecordTraders.tsx`, `src/pages/practice/ReversalCharts.tsx`, `src/pages/practice/RiskPremiumPortfolio.tsx`, `src/pages/practice/TradeFramework.tsx`, `src/pages/practice/VixTrading.tsx`, `src/pages/practice/WheelStrategy.tsx`, `src/pages/practice/WhichWay.tsx`

#### `/map`

- **Page:** `src/pages/ProgressMap.tsx`
- **Teaches:** Progress map: every quiz, lab, page, hub and Academy level as a stage, with the next objective.
- **Menu:** Header: “Map” (`/map`)
- **Browse:** Browse everything › Start points: “Progress map” (`/map`)
- **Track:** Track “Show me everything” step 3: “Progress map”
- **ToC:** none
- **Map:** Progress map: 1 stage(s) — `page:/map`
- **In-content (2 files):** `src/components/ProgressMapCard.tsx`, `src/pages/BrowseEverything.tsx`

### Academy and paper trading

#### `/academy`

- **Page:** `src/pages/academy/AcademyHub.tsx`
- **Teaches:** Academy course map: levels L0–L7, courses, units, placement, test-outs, rewards.
- **Menu:** Header › Learn › Beginner › Start here: “Academy lessons” (`/academy`); Header: “Learn” (`/academy`)
- **Browse:** Browse everything › Learn: “Academy lessons” (`/academy`)
- **Track:** Track “Company fundamentals and earnings” step 1: “Academy L4 Company fundamentals & earnings”; Track “Macro and news” step 1: “Academy L5 Macro & rates”; Track “New to stocks” step 1: “Placement check or “I'm brand new””; Track “New to stocks” step 2: “Academy L0 Orientation (5 units)”; Track “New to stocks” step 3: “Academy L1 Stock basics”; Track “New to stocks” step 7: “Academy L2 Charts & candles”; Track “New to stocks” step 9: “Academy L3 Orders, sizing & risk”; Track “Options and volatility” step 1: “Academy L6 Options education (test-out first if ready)”; … 1 more
- **ToC:** ToC › academy card (AcademyTrainingCard.tsx): `/academy`
- **Map:** Progress map: 8 stage(s) — `academy:L0`, `academy:L1`, `academy:L2`, `academy:L3`, `academy:L4`, `academy:L5` …
- **In-content (9 files):** `src/components/academy/PlacementCard.tsx`, `src/components/academy/TodayCard.tsx`, `src/lib/academy/homeTip.ts`, `src/pages/academy/AcademyTestOut.tsx`, `src/pages/academy/AcademyUnit.tsx`, `src/pages/academy/OptionsLadder.tsx`, `src/pages/academy/Paper.tsx`, `src/pages/academy/PaperChallenges.tsx`, `src/pages/academy/PaperDesk.tsx`

#### `/academy/options`

- **Page:** `src/pages/academy/OptionsLadder.tsx`
- **Teaches:** Options ladder: strategies unlocked level by level (time decay, payoff diagrams, checks).
- **Menu:** Header › Learn › Advanced › Options: “Options ladder” (`/academy/options`); Header › Practice › Advanced › Options and volatility: “Options ladder” (`/academy/options`)
- **Browse:** Browse everything › Learn: “Options ladder” (`/academy/options`); Browse everything › Practice: Options and volatility: “Options ladder” (`/academy/options`)
- **Track:** Track “Options and volatility” step 3: “Options ladder”
- **ToC:** ToC › Practice: “Options ladder”
- **Map:** Progress map: 1 stage(s) — `page:/academy/options`
- **In-content (3 files):** `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/wheelStrategy.ts`, `src/pages/practice/GammaSqueeze.tsx`

#### `/academy/review`

- **Page:** `src/pages/academy/AcademyReview.tsx`
- **Teaches:** Learning retention: missed unit-check and Today questions come back 1, 3, then 7 days later.
- **ToC:** ToC › academy card (AcademyTrainingCard.tsx): `/academy/review`
- **In-content (1 file):** `src/components/academy/PacePanel.tsx` (shown when questions are due)

#### `/paper`

- **Page:** `src/pages/academy/Paper.tsx`
- **Teaches:** Paper trading account: SIMULATED orders, stops and brackets.
- **Menu:** Header › Trade › Beginner › Practice money: “Paper trading” (`/paper`)
- **Browse:** Browse everything › Trade and decide: “Paper trading” (`/paper`)
- **Track:** Track “New to stocks” step 11: “Paper account”
- **ToC:** ToC › deep-study: `/paper`
- **Map:** Progress map: 1 stage(s) — `page:/paper`
- **In-content (5 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/tradeFramework.ts`, `src/pages/academy/PaperChallenges.tsx`, `src/pages/academy/PaperDesk.tsx`, `src/pages/practice/NewsBiases.tsx`

#### `/paper/desk`

- **Page:** `src/pages/academy/PaperDesk.tsx`
- **Teaches:** Paper desk: competitor-style paper trading with bundled news and financial statements; 1 HISTORICAL 2024 scenario plus SIMULATED scenarios by topic.
- **Menu:** Header › Trade › Advanced › Full desk: “Paper desk” (`/paper/desk`)
- **Browse:** Browse everything › Trade and decide: “Paper desk” (`/paper/desk`)
- **Track:** Track “Active and day trading” step 13: “Paper desk: Breakouts & gaps, Execution & risk topics”; Track “Company fundamentals and earnings” step 12: “Paper desk: Earnings & guidance, Balance-sheet risk, Insiders & analysts”; Track “Macro and news” step 11: “Paper desk: Macro & sectors topic”; Track “Options and volatility” step 12: “Paper desk: time decay scenario”
- **ToC:** ToC › deep-study: `/paper/desk`
- **Map:** Progress map: 1 stage(s) — `hub:desk`
- **In-content (1 files):** `src/pages/academy/Paper.tsx`

#### `/paper/challenges`

- **Page:** `src/pages/academy/PaperChallenges.tsx`
- **Teaches:** Paper challenges list (discipline score plus result score) and challenge of the week.
- **Menu:** Header › Trade › Intermediate › Scored practice: “Challenges” (`/paper/challenges`)
- **Browse:** Browse everything › Trade and decide: “Challenges” (`/paper/challenges`)
- **ToC:** ToC › deep-study: `/paper/challenges`
- **Map:** Progress map: 1 stage(s) — `hub:challenges`
- **In-content (3 files):** `src/lib/academy/homeTip.ts`, `src/pages/academy/Paper.tsx`, `src/pages/academy/PaperChallenges.tsx`

### Deep Study hubs

#### `/cases`

- **Page:** `src/pages/Cases.tsx`
- **Teaches:** Cases library: decide-then-reveal case packs (stocks, futures, forex, crypto, options context, price action).
- **Menu:** Header › Trade › Advanced › Other markets: “Crypto cases” (`/cases?pack=crypto`); Header › Trade › Advanced › Other markets: “Forex cases” (`/cases?pack=forex`); Header › Trade › Advanced › Other markets: “Futures cases” (`/cases?pack=futures`); Header › Trade › Advanced › Other markets: “Options context cases” (`/cases?pack=options-context`); Header › Trade › Beginner › First cases: “Company news cases” (`/cases?pack=company-news`); Header › Trade › Beginner › First cases: “Earnings cases” (`/cases?pack=earnings`); Header › Trade › Intermediate › Guided decisions: “Cases” (`/cases`); Header › Trade › Intermediate › Guided decisions: “Market-wide news cases” (`/cases?pack=macro-news`); … 1 more
- **Browse:** Browse everything › Case packs: “Company news” (`/cases?pack=company-news`); Browse everything › Case packs: “Crypto macro” (`/cases?pack=crypto-macro`); Browse everything › Case packs: “Crypto tape” (`/cases?pack=crypto-tape`); Browse everything › Case packs: “Crypto” (`/cases?pack=crypto`); Browse everything › Case packs: “Earnings” (`/cases?pack=earnings`); Browse everything › Case packs: “Forex macro” (`/cases?pack=forex-macro`); Browse everything › Case packs: “Forex tape” (`/cases?pack=forex-tape`); Browse everything › Case packs: “Forex” (`/cases?pack=forex`); … 10 more
- **Track:** Track “Active and day trading” step 12: “Price action cases”; Track “Company fundamentals and earnings” step 11: “Earnings, company news, then news plus financials cases”; Track “Macro and news” step 9: “Market-wide news cases”; Track “New to stocks” step 14: “Earnings cases (beginner)”; Track “New to stocks” step 15: “Company news cases”; Track “Options and volatility” step 11: “Options context cases”; Track “Other markets” step 5: “Futures cases”; Track “Other markets” step 7: “Forex cases”; … 1 more
- **ToC:** ToC › #path panel card (PathMapPanel.tsx): `/cases?pack=${active.casesPack}`; ToC › deep-study: `/cases?pack=combined`; ToC › deep-study: `/cases?pack=company-news`; ToC › deep-study: `/cases?pack=earnings`; ToC › deep-study: `/cases?pack=macro-news`; ToC › deep-study: `/cases`
- **Map:** Progress map: 1 stage(s) — `hub:cases`
- **In-content (31 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/fairValueGap.ts`, `src/lib/fourPillars.ts`, `src/lib/marketNavigator.ts`, `src/lib/marketThemes/agriculture.ts`, `src/lib/marketThemes/bonds.ts`, `src/lib/marketThemes/currencyFunds.ts`, `src/lib/marketThemes/energy.ts`, `src/lib/marketThemes/indexStyle.ts`, `src/lib/marketThemes/industrialMetals.ts`, `src/lib/marketThemes/materials.ts`, `src/lib/marketThemes/preciousMetals.ts`, `src/lib/marketThemes/sectors.ts`, `src/lib/marketThemes/structure.ts`, `src/lib/openingRange.ts`, `src/lib/playbookPrompt.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/toolTraining/capstone.ts`, `src/lib/toolTraining/capstoneBank.ts`, `src/lib/toolTraining/earningsInsiders.ts`, `src/lib/toolTraining/edgar.ts`, `src/lib/toolTraining/finviz.ts`, `src/lib/toolTraining/marketForces.ts`, `src/lib/toolTraining/stockAnalysis.ts`, `src/lib/toolTraining/yahooFinance.ts`, `src/lib/tradeFramework.ts`, `src/lib/vixTrading.ts`, `src/lib/wheelStrategy.ts`, `src/pages/CasePlayer.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Playbook.tsx`

#### `/coach`

- **Page:** `src/pages/Coach.tsx`
- **Teaches:** Coach catalog: step-by-step coached decision sessions, filtered by topic and market class.
- **Menu:** Header › Trade › Intermediate › Guided decisions: “Coach” (`/coach`)
- **Browse:** Browse everything › Coach by market: “Coach: Crypto” (`/coach?class=crypto`); Browse everything › Coach by market: “Coach: Equities” (`/coach?class=equity`); Browse everything › Coach by market: “Coach: Forex” (`/coach?class=forex`); Browse everything › Coach by market: “Coach: Futures” (`/coach?class=future`); Browse everything › Coach by market: “Coach: Options context” (`/coach?class=option_context`); Browse everything › Trade and decide: “Coach” (`/coach`)
- **ToC:** ToC › deep-study: `/coach`
- **Map:** Progress map: 1 stage(s) — `hub:coach`
- **In-content (7 files):** `src/components/MarketNavigator.tsx`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/marketNavigator.ts`, `src/lib/playbookPrompt.ts`, `src/pages/CoachSession.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Playbook.tsx`

#### `/playbooks`

- **Page:** `src/pages/Playbooks.tsx`
- **Teaches:** Playbooks list: outside-source strategy kits written as plans (entry, stop, target).
- **Menu:** Header › Trade › Advanced › Full desk: “Playbooks” (`/playbooks`)
- **Browse:** Browse everything › Trade and decide: “Playbooks” (`/playbooks`)
- **ToC:** ToC › deep-study: `/playbooks`
- **Map:** Progress map: 1 stage(s) — `hub:playbooks`
- **In-content (2 files):** `src/lib/playbookPrompt.ts`, `src/pages/Playbook.tsx`

#### `/tools`

- **Page:** `src/pages/ToolsHub.tsx`
- **Teaches:** Tool Training hub: how to use outside research tools, plus the charting-apps comparison.
- **Menu:** Header › Learn › Advanced › Research tools: “Tool Training” (`/tools`)
- **Browse:** Browse everything › Learn: “Tool Training” (`/tools`); Browse everything › Tool Training: “Tool Training overview” (`/tools`)
- **ToC:** ToC › Tool Training: “Tool Training overview”
- **Map:** Progress map: 1 stage(s) — `hub:tools`
- **In-content (4 files):** `src/components/tools/ToolLessonPage.tsx`, `src/lib/toolTraining/marketForces.ts`, `src/lib/toolTraining/stockAnalysis.ts`, `src/pages/ToolsHub.tsx`

#### `/macro`

- **Page:** `src/pages/macro/MacroDesk.tsx`
- **Teaches:** Macro Desk: SIMULATED economic releases grouped by family, plus macro quizzes.
- **Menu:** Header › Learn › Intermediate › Economy: “Macro desk” (`/macro`)
- **Browse:** Browse everything › Financials and macro: “Macro desk” (`/macro`); Browse everything › Learn: “Macro desk” (`/macro`)
- **Track:** Track “Macro and news” step 3: “Macro Desk lessons (jobs, CPI, FOMC, curve…)”
- **ToC:** ToC › other-factors (#macro) card (MacroTrainingCard.tsx): `/macro`
- **Map:** Progress map: 1 stage(s) — `hub:macro`
- **In-content (6 files):** `src/lib/macro/homeTip.ts`, `src/lib/marketThemes/bonds.ts`, `src/lib/marketThemes/currencyFunds.ts`, `src/lib/playbooks.ts`, `src/pages/macro/MacroLesson.tsx`, `src/pages/macro/MacroPlay.tsx`

#### `/macro/play`

- **Page:** `src/pages/macro/MacroPlay.tsx`
- **Teaches:** Macro reaction game: consensus vs actual, then the market reaction (`?round=<id>`).
- **Menu:** Header › Trade › Intermediate › Scored practice: “Macro play” (`/macro/play`)
- **Browse:** Browse everything › Financials and macro: “Macro play” (`/macro/play`); Browse everything › Trade and decide: “Macro play” (`/macro/play`)
- **Track:** Track “Macro and news” step 5: “Macro play (29 rounds)”
- **ToC:** ToC › other-factors (#macro) card (MacroTrainingCard.tsx): `/macro/play`
- **Map:** Progress map: 1 stage(s) — `page:/macro/play`
- **In-content (3 files):** `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/macro/homeTip.ts`, `src/pages/macro/MacroDesk.tsx`

### Other factors pages

#### `/practice/statements`

- **Page:** `src/pages/practice/StatementsLab.tsx`
- **Teaches:** Statements lab: income statement, balance sheet, cash flow reader and the 13-week cash forecast (`#forecast`).
- **Menu:** Header › Learn › Beginner › Company numbers: “Statements lab” (`/practice/statements`); Header › Practice › Beginner › Company numbers: “Statements lab” (`/practice/statements`)
- **Browse:** Browse everything › Financials and macro: “Statements lab” (`/practice/statements`); Browse everything › Learn: “Statements lab” (`/practice/statements`); Browse everything › Practice: Statements and earnings: “Statements lab” (`/practice/statements`)
- **Track:** Track “Company fundamentals and earnings” step 3: “Statements lab”
- **ToC:** ToC › other-factors (#financials) card (FinancialsTrainingCard.tsx): `/practice/statements#forecast`; ToC › other-factors (#financials) card (FinancialsTrainingCard.tsx): `/practice/statements`
- **Map:** Progress map: 1 stage(s) — `page:/practice/statements`
- **In-content (1 files):** `src/lib/academy/content/unitsL4L7.ts (Academy ref)`

#### `/practice/read-the-print`

- **Page:** `src/pages/practice/ReadThePrint.tsx`
- **Teaches:** Read the Print: earnings-print game, expectations vs actual and the follow-through.
- **Menu:** Header › Practice › Intermediate › Earnings and markets: “Read the Print” (`/practice/read-the-print`)
- **Browse:** Browse everything › Financials and macro: “Read the Print” (`/practice/read-the-print`); Browse everything › Practice: Statements and earnings: “Read the Print” (`/practice/read-the-print`)
- **Track:** Track “Company fundamentals and earnings” step 7: “Read the Print”
- **ToC:** ToC › other-factors (#financials) card (FinancialsTrainingCard.tsx): `/practice/read-the-print`
- **Map:** Progress map: 1 stage(s) — `page:/practice/read-the-print`
- **In-content (2 files):** `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/financials/caseLinks.ts`

#### `/practice/mark-the-band`

- **Page:** `src/pages/practice/MarkTheBand.tsx`
- **Teaches:** Mark the band: mark the expected range around an earnings release.
- **Menu:** Header › Practice › Advanced › Portfolio and automation: “Mark the band” (`/practice/mark-the-band`)
- **Browse:** Browse everything › Financials and macro: “Mark the band” (`/practice/mark-the-band`); Browse everything › Practice: Statements and earnings: “Mark the band” (`/practice/mark-the-band`)
- **Track:** Track “Company fundamentals and earnings” step 8: “Mark the band”
- **ToC:** ToC › other-factors (#financials) card (FinancialsTrainingCard.tsx): `/practice/mark-the-band`
- **Map:** Progress map: 1 stage(s) — `page:/practice/mark-the-band`
- **In-content (1 files):** `src/lib/academy/content/unitsL4L7.ts (Academy ref)`

### Practice labs

#### `/practice-draw`

- **Page:** `src/pages/PracticeDraw.tsx`
- **Teaches:** Drawing lab: draw a pattern on a canvas and get it graded.
- **Menu:** Header › Practice › Intermediate › Patterns: “Drawing” (`/practice-draw`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Drawing” (`/practice-draw`)
- **ToC:** ToC › Practice: “Drawing”
- **Map:** Progress map: 1 stage(s) — `lab:draw`
- **In-content (2 files):** `src/lib/miscPractices.ts`, `src/pages/Dashboard.tsx`

#### `/practice/flashcards`

- **Page:** `src/pages/practice/Flashcards.tsx`
- **Teaches:** Practice lab: Flashcards.
- **Menu:** Header › Practice › Beginner › First candles: “Flashcards” (`/practice/flashcards`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Flashcards” (`/practice/flashcards`)
- **ToC:** ToC › Practice: “Flashcards”
- **Map:** Progress map: 1 stage(s) — `lab:flashcards`
- **In-content (2 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`

#### `/practice/label`

- **Page:** `src/pages/practice/Label.tsx`
- **Teaches:** Practice lab: Label.
- **Menu:** Header › Practice › Beginner › First candles: “Label” (`/practice/label`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Label” (`/practice/label`)
- **ToC:** ToC › Practice: “Label”
- **Map:** Progress map: 1 stage(s) — `lab:label`
- **In-content (1 files):** `src/lib/miscPractices.ts`

#### `/practice/regime`

- **Page:** `src/pages/practice/Regime.tsx`
- **Teaches:** Practice lab: Trend vs range.
- **Menu:** Header › Practice › Beginner › Reading a chart: “Trend vs range” (`/practice/regime`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Trend vs range” (`/practice/regime`)
- **ToC:** ToC › Practice: “Trend vs range”
- **Map:** Progress map: 1 stage(s) — `lab:regime`
- **In-content (3 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`, `src/pages/practice/EmaMacd.tsx`

#### `/practice/replay`

- **Page:** `src/pages/practice/Replay.tsx`
- **Teaches:** Practice lab: Bar replay.
- **Menu:** Header › Practice › Intermediate › Price action: “Bar replay” (`/practice/replay`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Bar replay” (`/practice/replay`)
- **ToC:** ToC › Practice: “Bar replay”
- **Map:** Progress map: 1 stage(s) — `lab:replay`
- **In-content (2 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`

#### `/practice/plan`

- **Page:** `src/pages/practice/Plan.tsx`
- **Teaches:** Practice lab: Mark the plan.
- **Menu:** Header › Practice › Intermediate › Price action: “Mark the plan” (`/practice/plan`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Mark the plan” (`/practice/plan`)
- **ToC:** ToC › Practice: “Mark the plan”
- **Map:** Progress map: 1 stage(s) — `lab:plan`
- **In-content (4 files):** `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`, `src/lib/tradeFramework.ts`

#### `/practice/hunt`

- **Page:** `src/pages/practice/Hunt.tsx`
- **Teaches:** Practice lab: Pattern hunt.
- **Menu:** Header › Practice › Intermediate › Patterns: “Pattern hunt” (`/practice/hunt`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Pattern hunt” (`/practice/hunt`)
- **Track:** Track “Charts and patterns” step 11: “Flashcards, Label, Lookalikes, Pattern hunt, Drawing”
- **ToC:** ToC › Practice: “Pattern hunt”
- **Map:** Progress map: 1 stage(s) — `lab:hunt`
- **In-content (2 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`

#### `/practice/lookalike`

- **Page:** `src/pages/practice/Lookalike.tsx`
- **Teaches:** Practice lab: Lookalikes.
- **Menu:** Header › Practice › Intermediate › Patterns: “Lookalikes” (`/practice/lookalike`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Lookalikes” (`/practice/lookalike`)
- **ToC:** ToC › Practice: “Lookalikes”
- **Map:** Progress map: 1 stage(s) — `lab:lookalike`
- **In-content (2 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`

#### `/practice/invalidation`

- **Page:** `src/pages/practice/Invalidation.tsx`
- **Teaches:** Practice lab: Invalidation.
- **Menu:** Header › Practice › Intermediate › Price action: “Invalidation” (`/practice/invalidation`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Invalidation” (`/practice/invalidation`)
- **Track:** Track “Active and day trading” step 10: “Bar replay, Mark the plan, Invalidation”
- **ToC:** ToC › Practice: “Invalidation”
- **Map:** Progress map: 1 stage(s) — `lab:invalidation`
- **In-content (3 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`, `src/lib/tradeFramework.ts`

#### `/practice/levels`

- **Page:** `src/pages/practice/Levels.tsx`
- **Teaches:** Practice lab: Support and resistance.
- **Menu:** Header › Practice › Beginner › Reading a chart: “Support and resistance” (`/practice/levels`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Support and resistance” (`/practice/levels`)
- **Track:** Track “Active and day trading” step 3: “Support and resistance”; Track “Charts and patterns” step 12: “Trend vs range; Support and resistance”
- **ToC:** ToC › Practice: “Support and resistance”
- **Map:** Progress map: 1 stage(s) — `lab:levels`
- **In-content (3 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/fourPillars.ts`, `src/lib/miscPractices.ts`

#### `/practice/ema-macd`

- **Page:** `src/pages/practice/EmaMacd.tsx`
- **Teaches:** Practice lab: EMA, SMA and MACD (long charts).
- **Menu:** Header › Practice › Intermediate › Indicators: “EMA, SMA and MACD (long charts)” (`/practice/ema-macd`)
- **Browse:** Browse everything › Practice: Indicators and charting apps: “EMA, SMA and MACD (long charts)” (`/practice/ema-macd`)
- **Track:** Track “Charts and patterns” step 13: “Indicators quiz; EMA/SMA/MACD; Oscillators”
- **ToC:** ToC › Practice: “EMA, SMA and MACD (long charts)”
- **Map:** Progress map: 1 stage(s) — `lab:ema-macd`
- **In-content (2 files):** `src/lib/miscPractices.ts`, `src/pages/practice/Oscillators.tsx`

#### `/practice/oscillators`

- **Page:** `src/pages/practice/Oscillators.tsx`
- **Teaches:** Practice lab: Oscillators & volatility stop.
- **Menu:** Header › Practice › Intermediate › Indicators: “Oscillators & volatility stop” (`/practice/oscillators`)
- **Browse:** Browse everything › Practice: Indicators and charting apps: “Oscillators & volatility stop” (`/practice/oscillators`)
- **ToC:** ToC › Practice: “Oscillators & volatility stop”
- **Map:** Progress map: 1 stage(s) — `lab:oscillators`
- **In-content (1 files):** `src/lib/miscPractices.ts`

#### `/practice/japanese-candles`

- **Page:** `src/pages/practice/JapaneseCandles.tsx`
- **Teaches:** Practice lab: Japanese candlesticks.
- **Menu:** Header › Practice › Beginner › First candles: “Japanese candlesticks” (`/practice/japanese-candles`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Japanese candlesticks” (`/practice/japanese-candles`)
- **Track:** Track “Charts and patterns” step 3: “Japanese candlesticks”
- **ToC:** ToC › Practice: “Japanese candlesticks”
- **Map:** Progress map: 1 stage(s) — `lab:japanese-candles`
- **In-content (5 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`, `src/pages/Archive.tsx`, `src/pages/practice/CryptoCandles.tsx`, `src/pages/practice/HeikinAshi.tsx`

#### `/practice/candle-basics`

- **Page:** `src/pages/practice/CandleBasics.tsx`
- **Teaches:** Candlestick Basics: parts of one candle (body, wicks, open/close) before the pattern quizzes.
- **Menu:** Header › Learn › Beginner › Start here: “Candlestick Basics” (`/practice/candle-basics`)
- **Browse:** Browse everything › Learn: “Candlestick Basics” (`/practice/candle-basics`)
- **Track:** Track “Charts and patterns” step 1: “Candlestick Basics”; Track “New to stocks” step 5: “Candlestick Basics”
- **ToC:** ToC › quiz: `/practice/candle-basics`
- **Map:** Progress map: 1 stage(s) — `page:/practice/candle-basics`
- **In-content (1 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`

#### `/practice/heikin-ashi`

- **Page:** `src/pages/practice/HeikinAshi.tsx`
- **Teaches:** Practice lab: Heikin-Ashi candles.
- **Menu:** Header › Practice › Beginner › Reading a chart: “Heikin-Ashi candles” (`/practice/heikin-ashi`)
- **Browse:** Browse everything › Practice: Indicators and charting apps: “Heikin-Ashi candles” (`/practice/heikin-ashi`)
- **Track:** Track “Charts and patterns” step 14: “Heikin-Ashi candles”
- **ToC:** ToC › Practice: “Heikin-Ashi candles”
- **Map:** Progress map: 1 stage(s) — `lab:heikin-ashi`
- **In-content (2 files):** `src/lib/miscPractices.ts`, `src/pages/practice/JapaneseCandles.tsx`

#### `/practice/gamma-squeeze`

- **Page:** `src/pages/practice/GammaSqueeze.tsx`
- **Teaches:** Practice lab: Gamma squeeze case.
- **Menu:** Header › Practice › Advanced › Options and volatility: “Gamma squeeze case” (`/practice/gamma-squeeze`)
- **Browse:** Browse everything › Practice: Options and volatility: “Gamma squeeze case” (`/practice/gamma-squeeze`)
- **Track:** Track “Options and volatility” step 8: “Gamma squeeze case; Squeezes quiz”
- **ToC:** ToC › Practice: “Gamma squeeze case”
- **Map:** Progress map: 1 stage(s) — `lab:gamma-squeeze`
- **In-content (3 files):** `src/lib/miscPractices.ts`, `src/pages/Cases.tsx`, `src/pages/practice/NewsBiases.tsx`

#### `/practice/news-biases`

- **Page:** `src/pages/practice/NewsBiases.tsx`
- **Teaches:** Practice lab: News, biases & short-term options.
- **Menu:** Header › Practice › Advanced › Options and volatility: “News, biases & short-term options” (`/practice/news-biases`)
- **Browse:** Browse everything › Practice: Options and volatility: “News, biases & short-term options” (`/practice/news-biases`)
- **Track:** Track “Macro and news” step 8: “News, biases & short-term options”
- **ToC:** ToC › Practice: “News, biases & short-term options”
- **Map:** Progress map: 1 stage(s) — `lab:news-biases`
- **In-content (2 files):** `src/lib/miscPractices.ts`, `src/pages/practice/AlgoTrading.tsx`

#### `/practice/algo-trading`

- **Page:** `src/pages/practice/AlgoTrading.tsx`
- **Teaches:** Practice lab: Automated & algo trading (2026).
- **Menu:** Header › Practice › Advanced › Portfolio and automation: “Automated & algo trading (2026)” (`/practice/algo-trading`)
- **Browse:** Browse everything › Practice: Automation and records: “Automated & algo trading (2026)” (`/practice/algo-trading`)
- **ToC:** ToC › Practice: “Automated & algo trading (2026)”
- **Map:** Progress map: 1 stage(s) — `lab:algo-trading`
- **In-content (3 files):** `src/lib/miscPractices.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/pages/practice/ChartingApps.tsx`

#### `/practice/charting-apps`

- **Page:** `src/pages/practice/ChartingApps.tsx`
- **Teaches:** Practice lab: Indicator & charting apps.
- **Menu:** Header › Practice › Intermediate › Indicators: “Indicator & charting apps” (`/practice/charting-apps`)
- **Browse:** Browse everything › Practice: Indicators and charting apps: “Indicator & charting apps” (`/practice/charting-apps`); Browse everything › Tool Training: “Charting apps compared” (`/practice/charting-apps`)
- **ToC:** ToC › Practice: “Indicator & charting apps”; ToC › Tool Training: “Charting apps compared”
- **Map:** Progress map: 1 stage(s) — `lab:charting-apps`
- **In-content (5 files):** `src/lib/miscPractices.ts`, `src/lib/toolTraining/finviz.ts`, `src/lib/toolTraining/index.ts`, `src/lib/toolTraining/yahooFinance.ts`, `src/pages/practice/AlgoTrading.tsx`

#### `/practice/crypto-candles`

- **Page:** `src/pages/practice/CryptoCandles.tsx`
- **Teaches:** Practice lab: Candlesticks for crypto.
- **Menu:** Header › Practice › Intermediate › Earnings and markets: “Candlesticks for crypto” (`/practice/crypto-candles`)
- **Browse:** Browse everything › Practice: Other markets: “Candlesticks for crypto” (`/practice/crypto-candles`)
- **Track:** Track “Other markets” step 8: “Candlesticks for crypto”
- **ToC:** ToC › Practice: “Candlesticks for crypto”
- **Map:** Progress map: 1 stage(s) — `lab:crypto-candles`
- **In-content (4 files):** `src/lib/miscPractices.ts`, `src/pages/Archive.tsx`, `src/pages/practice/EssentialCandles.tsx`, `src/pages/practice/JapaneseCandles.tsx`

#### `/practice/reversal-charts`

- **Page:** `src/pages/practice/ReversalCharts.tsx`
- **Teaches:** Practice lab: Reversal chart patterns.
- **Menu:** Header › Practice › Intermediate › Patterns: “Reversal chart patterns” (`/practice/reversal-charts`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Reversal chart patterns” (`/practice/reversal-charts`)
- **Track:** Track “Charts and patterns” step 9: “Reversal chart patterns”
- **ToC:** ToC › Practice: “Reversal chart patterns”
- **Map:** Progress map: 1 stage(s) — `lab:reversal-charts`
- **In-content (2 files):** `src/lib/miscPractices.ts`, `src/pages/practice/OneMinuteCharts.tsx`

#### `/practice/one-minute-charts`

- **Page:** `src/pages/practice/OneMinuteCharts.tsx`
- **Teaches:** Practice lab: Reading 1-minute charts.
- **Menu:** Header › Practice › Advanced › Precision day trading: “Reading 1-minute charts” (`/practice/one-minute-charts`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Reading 1-minute charts” (`/practice/one-minute-charts`)
- **Track:** Track “Active and day trading” step 8: “Reading 1-minute charts”
- **ToC:** ToC › Practice: “Reading 1-minute charts”
- **Map:** Progress map: 1 stage(s) — `lab:one-minute-charts`
- **In-content (4 files):** `src/lib/miscPractices.ts`, `src/pages/practice/FibDecisionMap.tsx`, `src/pages/practice/FuturesVsOptions.tsx`, `src/pages/practice/MissingWicks.tsx`

#### `/practice/fib-decision-map`

- **Page:** `src/pages/practice/FibDecisionMap.tsx`
- **Teaches:** Practice lab: Fibonacci as a decision map.
- **Menu:** Header › Practice › Advanced › Precision day trading: “Fibonacci as a decision map” (`/practice/fib-decision-map`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Fibonacci as a decision map” (`/practice/fib-decision-map`)
- **Track:** Track “Active and day trading” step 9: “Fibonacci as a decision map”
- **ToC:** ToC › Practice: “Fibonacci as a decision map”
- **Map:** Progress map: 1 stage(s) — `lab:fib-decision-map`
- **In-content (2 files):** `src/lib/miscPractices.ts`, `src/pages/practice/FuturesVsOptions.tsx`

#### `/practice/futures-vs-options`

- **Page:** `src/pages/practice/FuturesVsOptions.tsx`
- **Teaches:** Practice lab: Futures vs options & beginner toolkit.
- **Menu:** Header › Practice › Advanced › Options and volatility: “Futures vs options & beginner toolkit” (`/practice/futures-vs-options`)
- **Browse:** Browse everything › Practice: Options and volatility: “Futures vs options & beginner toolkit” (`/practice/futures-vs-options`)
- **Track:** Track “Options and volatility” step 5: “Futures vs options & beginner toolkit”
- **ToC:** ToC › Practice: “Futures vs options & beginner toolkit”
- **Map:** Progress map: 1 stage(s) — `lab:futures-vs-options`
- **In-content (2 files):** `src/lib/marketThemes/structure.ts`, `src/lib/miscPractices.ts`

#### `/practice/technique-narratives`

- **Page:** `src/pages/practice/TechniqueNarratives.tsx`
- **Teaches:** Practice lab: Technique narratives.
- **Menu:** Header › Practice › Intermediate › Indicators: “Technique narratives” (`/practice/technique-narratives`)
- **Browse:** Browse everything › Practice: Indicators and charting apps: “Technique narratives” (`/practice/technique-narratives`)
- **ToC:** ToC › Practice: “Technique narratives”
- **Map:** Progress map: 1 stage(s) — `lab:technique-narratives`
- **In-content (2 files):** `src/lib/miscPractices.ts`, `src/pages/practice/RecordTraders.tsx`

#### `/practice/missing-wicks`

- **Page:** `src/pages/practice/MissingWicks.tsx`
- **Teaches:** Practice lab: Missing wicks and zooming in.
- **Menu:** Header › Practice › Beginner › First candles: “Missing wicks and zooming in” (`/practice/missing-wicks`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Missing wicks and zooming in” (`/practice/missing-wicks`)
- **Track:** Track “Charts and patterns” step 5: “Missing wicks and zooming in”
- **ToC:** ToC › Practice: “Missing wicks and zooming in”
- **Map:** Progress map: 1 stage(s) — `lab:missing-wicks`
- **In-content (2 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`

#### `/practice/record-traders`

- **Page:** `src/pages/practice/RecordTraders.tsx`
- **Teaches:** Practice lab: Record-setting traders.
- **Menu:** Header › Practice › Advanced › Commodities and records: “Record-setting traders” (`/practice/record-traders`)
- **Browse:** Browse everything › Practice: Automation and records: “Record-setting traders” (`/practice/record-traders`)
- **ToC:** ToC › Practice: “Record-setting traders”
- **Map:** Progress map: 1 stage(s) — `lab:record-traders`
- **In-content (1 files):** `src/lib/miscPractices.ts`

#### `/practice/pattern-themes`

- **Page:** `src/pages/practice/PatternThemes.tsx`
- **Teaches:** Practice lab: Pattern themes.
- **Menu:** Header › Practice › Beginner › Reading a chart: “Pattern themes” (`/practice/pattern-themes`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Pattern themes” (`/practice/pattern-themes`)
- **Track:** Track “Charts and patterns” step 8: “Pattern themes”
- **ToC:** ToC › Practice: “Pattern themes”
- **Map:** Progress map: 1 stage(s) — `lab:pattern-themes`
- **In-content (4 files):** `src/components/PatternDetailModal.tsx`, `src/lib/miscPractices.ts`, `src/pages/Archive.tsx`, `src/pages/practice/WhichWay.tsx`

#### `/practice/essential-candles`

- **Page:** `src/pages/practice/EssentialCandles.tsx`
- **Teaches:** Practice lab: Essential candlestick patterns.
- **Menu:** Header › Practice › Beginner › First candles: “Essential candlestick patterns” (`/practice/essential-candles`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Essential candlestick patterns” (`/practice/essential-candles`)
- **Track:** Track “Charts and patterns” step 4: “Essential candlestick patterns”
- **ToC:** ToC › Practice: “Essential candlestick patterns”
- **Map:** Progress map: 1 stage(s) — `lab:essential-candles`
- **In-content (1 files):** `src/lib/miscPractices.ts`

#### `/practice/which-way`

- **Page:** `src/pages/practice/WhichWay.tsx`
- **Teaches:** Practice lab: Which Way? (Up, Down or Either).
- **Menu:** Header › Practice › Beginner › First candles: “Which Way? (Up, Down or Either)” (`/practice/which-way`)
- **Browse:** Browse everything › Practice: Candles and patterns: “Which Way? (Up, Down or Either)” (`/practice/which-way`)
- **Track:** Track “Charts and patterns” step 6: “Which Way?”
- **ToC:** ToC › Practice: “Which Way? (Up, Down or Either)”
- **Map:** Progress map: 1 stage(s) — `lab:which-way`
- **In-content (3 files):** `src/components/PatternDetailModal.tsx`, `src/lib/mapProgress.ts`, `src/lib/miscPractices.ts`

#### `/practice/trade-framework`

- **Page:** `src/pages/practice/TradeFramework.tsx`
- **Teaches:** Practice lab: Price action trading framework.
- **Menu:** Header › Practice › Intermediate › Price action: “Price action trading framework” (`/practice/trade-framework`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Price action trading framework” (`/practice/trade-framework`)
- **Track:** Track “Active and day trading” step 1: “Price action trading framework”
- **ToC:** ToC › Practice: “Price action trading framework”
- **Map:** Progress map: 1 stage(s) — `lab:trade-framework`
- **In-content (6 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/fairValueGap.ts`, `src/lib/fourPillars.ts`, `src/lib/miscPractices.ts`, `src/lib/openingRange.ts`, `src/lib/playbooks.ts`

#### `/practice/opening-range`

- **Page:** `src/pages/practice/OpeningRange.tsx`
- **Teaches:** Practice lab: Opening range: retests, failed breaks & risk.
- **Menu:** Header › Practice › Intermediate › Price action: “Opening range: retests, failed breaks & risk” (`/practice/opening-range`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Opening range: retests, failed breaks & risk” (`/practice/opening-range`)
- **Track:** Track “Active and day trading” step 4: “Opening range lab”
- **ToC:** ToC › Practice: “Opening range: retests, failed breaks & risk”
- **Map:** Progress map: 1 stage(s) — `lab:opening-range`
- **In-content (3 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/miscPractices.ts`, `src/lib/playbooks.ts`

#### `/practice/fair-value-gap`

- **Page:** `src/pages/practice/FairValueGap.tsx`
- **Teaches:** Practice lab: Breakout, pullback and fair value gap.
- **Menu:** Header › Practice › Advanced › Precision day trading: “Breakout, pullback and fair value gap” (`/practice/fair-value-gap`)
- **Browse:** Browse everything › Practice: Price action and day trading: “Breakout, pullback and fair value gap” (`/practice/fair-value-gap`)
- **Track:** Track “Active and day trading” step 7: “Breakout, pullback and fair value gap”
- **ToC:** ToC › Practice: “Breakout, pullback and fair value gap”
- **Map:** Progress map: 1 stage(s) — `lab:fair-value-gap`
- **In-content (2 files):** `src/lib/fairValueGap.ts`, `src/lib/miscPractices.ts`

#### `/practice/risk-premium-portfolio`

- **Page:** `src/pages/practice/RiskPremiumPortfolio.tsx`
- **Teaches:** Practice lab: Risk-premium portfolio and the VIX overlay.
- **Menu:** Header › Practice › Advanced › Portfolio and automation: “Risk-premium portfolio and the VIX overlay” (`/practice/risk-premium-portfolio`)
- **Browse:** Browse everything › Practice: Options and volatility: “Risk-premium portfolio and the VIX overlay” (`/practice/risk-premium-portfolio`)
- **Track:** Track “Options and volatility” step 10: “Risk-premium portfolio and the VIX overlay”
- **ToC:** ToC › Practice: “Risk-premium portfolio and the VIX overlay”
- **Map:** Progress map: 1 stage(s) — `lab:risk-premium-portfolio`
- **In-content (3 files):** `src/lib/miscPractices.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/vixTrading.ts`

#### `/practice/vix-trading`

- **Page:** `src/pages/practice/VixTrading.tsx`
- **Teaches:** Practice lab: VIX trading for beginners.
- **Menu:** Header › Practice › Advanced › Options and volatility: “VIX trading for beginners” (`/practice/vix-trading`)
- **Browse:** Browse everything › Practice: Options and volatility: “VIX trading for beginners” (`/practice/vix-trading`)
- **Track:** Track “Options and volatility” step 9: “VIX trading for beginners”
- **ToC:** ToC › Practice: “VIX trading for beginners”
- **Map:** Progress map: 1 stage(s) — `lab:vix-trading`
- **In-content (4 files):** `src/lib/contentSims.ts`, `src/lib/miscPractices.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/vixTrading.ts`

#### `/practice/wheel-strategy`

- **Page:** `src/pages/practice/WheelStrategy.tsx`
- **Teaches:** Practice lab: The wheel strategy (cash-secured puts to covered calls).
- **Menu:** Header › Practice › Advanced › Options and volatility: “The wheel strategy (cash-secured puts to covered calls)” (`/practice/wheel-strategy`)
- **Browse:** Browse everything › Practice: Options and volatility: “The wheel strategy (cash-secured puts to covered calls)” (`/practice/wheel-strategy`)
- **Track:** Track “Options and volatility” step 7: “The wheel strategy”
- **ToC:** ToC › Practice: “The wheel strategy (cash-secured puts to covered calls)”
- **Map:** Progress map: 1 stage(s) — `lab:wheel-strategy`
- **In-content (3 files):** `src/lib/miscPractices.ts`, `src/lib/playbooks.ts`, `src/lib/wheelStrategy.ts`

#### `/practice/exposure-wrappers`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="exposure-wrappers")
- **Teaches:** Market theme: Same theme, different wrapper: stocks, funds and futures (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Intermediate › Earnings and markets: “Same theme, different wrapper: stocks, funds and futures” (`/practice/exposure-wrappers`)
- **Browse:** Browse everything › Practice: Other markets: “Same theme, different wrapper: stocks, funds and futures” (`/practice/exposure-wrappers`)
- **Track:** Track “Other markets” step 4: “Same theme, different wrapper”
- **ToC:** ToC › Practice: “Same theme, different wrapper: stocks, funds and futures”
- **Map:** Progress map: 1 stage(s) — `lab:exposure-wrappers`
- **In-content (9 files):** `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/marketThemes/currencyFunds.ts`, `src/lib/marketThemes/energy.ts`, `src/lib/marketThemes/industrialMetals.ts`, `src/lib/marketThemes/materials.ts`, `src/lib/marketThemes/preciousMetals.ts`, `src/lib/marketThemes/structure.ts`, `src/lib/toolTraining/marketForces.ts`

#### `/practice/currency-funds`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="currency-funds")
- **Teaches:** Market theme: Currency funds and the dollar (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Intermediate › Earnings and markets: “Currency funds and the dollar” (`/practice/currency-funds`)
- **Browse:** Browse everything › Practice: Other markets: “Currency funds and the dollar” (`/practice/currency-funds`)
- **ToC:** ToC › Practice: “Currency funds and the dollar”
- **Map:** Progress map: 1 stage(s) — `lab:currency-funds`
- **In-content (4 files):** `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/marketThemes/currencyFunds.ts`, `src/lib/marketThemes/structure.ts`

#### `/practice/precious-metals`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="precious-metals")
- **Teaches:** Market theme: Precious metals: gold, silver and the miners (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Advanced › Commodities and records: “Precious metals: gold, silver and the miners” (`/practice/precious-metals`)
- **Browse:** Browse everything › Practice: Other markets: “Precious metals: gold, silver and the miners” (`/practice/precious-metals`)
- **ToC:** ToC › Practice: “Precious metals: gold, silver and the miners”
- **Map:** Progress map: 1 stage(s) — `lab:precious-metals`
- **In-content (2 files):** `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/marketThemes/preciousMetals.ts`

#### `/practice/energy`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="energy")
- **Teaches:** Market theme: Energy: oil, natural gas and the companies (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Advanced › Commodities and records: “Energy: oil, natural gas and the companies” (`/practice/energy`)
- **Browse:** Browse everything › Practice: Other markets: “Energy: oil, natural gas and the companies” (`/practice/energy`)
- **Track:** Track “Other markets” step 10: “Market themes: precious metals, energy, agriculture, industrial metals…”
- **ToC:** ToC › Practice: “Energy: oil, natural gas and the companies”
- **Map:** Progress map: 1 stage(s) — `lab:energy`
- **In-content (4 files):** `src/lib/marketThemes/agriculture.ts`, `src/lib/marketThemes/energy.ts`, `src/lib/marketThemes/industrialMetals.ts`, `src/lib/marketThemes/materials.ts`

#### `/practice/industrial-metals`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="industrial-metals")
- **Teaches:** Market theme: Industrial and transition metals: copper, uranium and clean energy (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Advanced › Commodities and records: “Industrial and transition metals: copper, uranium and clean energy” (`/practice/industrial-metals`)
- **Browse:** Browse everything › Practice: Other markets: “Industrial and transition metals: copper, uranium and clean energy” (`/practice/industrial-metals`)
- **ToC:** ToC › Practice: “Industrial and transition metals: copper, uranium and clean energy”
- **Map:** Progress map: 1 stage(s) — `lab:industrial-metals`
- **In-content (1 files):** `src/lib/marketThemes/industrialMetals.ts`

#### `/practice/agriculture`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="agriculture")
- **Teaches:** Market theme: Agriculture and inputs: crops, fertilizer and farm equipment (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Advanced › Commodities and records: “Agriculture and inputs: crops, fertilizer and farm equipment” (`/practice/agriculture`)
- **Browse:** Browse everything › Practice: Other markets: “Agriculture and inputs: crops, fertilizer and farm equipment” (`/practice/agriculture`)
- **ToC:** ToC › Practice: “Agriculture and inputs: crops, fertilizer and farm equipment”
- **Map:** Progress map: 1 stage(s) — `lab:agriculture`
- **In-content (1 files):** `src/lib/marketThemes/agriculture.ts`

#### `/practice/materials-chemicals`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="materials-chemicals")
- **Teaches:** Market theme: Materials, chemicals and resins: Dow, LyondellBasell, Westlake, Eastman (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Advanced › Commodities and records: “Materials, chemicals and resins: Dow, LyondellBasell, Westlake, Eastman” (`/practice/materials-chemicals`)
- **Browse:** Browse everything › Practice: Other markets: “Materials, chemicals and resins: Dow, LyondellBasell, Westlake, Eastman” (`/practice/materials-chemicals`)
- **ToC:** ToC › Practice: “Materials, chemicals and resins: Dow, LyondellBasell, Westlake, Eastman”
- **Map:** Progress map: 1 stage(s) — `lab:materials-chemicals`
- **In-content (1 files):** `src/lib/marketThemes/materials.ts`

#### `/practice/bonds-rates`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="bonds-rates")
- **Teaches:** Market theme: Bonds and rates: SGOV, SHY, IEF, TLT, TIP and duration (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Intermediate › Earnings and markets: “Bonds and rates: SGOV, SHY, IEF, TLT, TIP and duration” (`/practice/bonds-rates`)
- **Browse:** Browse everything › Practice: Other markets: “Bonds and rates: SGOV, SHY, IEF, TLT, TIP and duration” (`/practice/bonds-rates`)
- **ToC:** ToC › Practice: “Bonds and rates: SGOV, SHY, IEF, TLT, TIP and duration”
- **Map:** Progress map: 1 stage(s) — `lab:bonds-rates`
- **In-content (4 files):** `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/marketThemes/bonds.ts`, `src/lib/marketThemes/sectors.ts`, `src/lib/playbooks.ts`

#### `/practice/sectors-rotation`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="sectors-rotation")
- **Teaches:** Market theme: Sectors and rotation: the 11 sectors, sector funds, REITs and the business cycle (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Intermediate › Earnings and markets: “Sectors and rotation: the 11 sectors, sector funds, REITs and the business cycle” (`/practice/sectors-rotation`)
- **Browse:** Browse everything › Practice: Other markets: “Sectors and rotation: the 11 sectors, sector funds, REITs and the business cycle” (`/practice/sectors-rotation`)
- **Track:** Track “Macro and news” step 10: “Bonds and rates; Sectors and rotation themes”
- **ToC:** ToC › Practice: “Sectors and rotation: the 11 sectors, sector funds, REITs and the business cycle”
- **Map:** Progress map: 1 stage(s) — `lab:sectors-rotation`
- **In-content (4 files):** `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/marketThemes/indexStyle.ts`, `src/lib/marketThemes/sectors.ts`, `src/lib/playbooks.ts`

#### `/practice/index-style`

- **Page:** `src/components/practice/MarketThemePage.tsx` (id="index-style")
- **Teaches:** Market theme: Index and style: size, region, style and how index weights work (MarketThemePage, `?sim=`).
- **Menu:** Header › Practice › Intermediate › Earnings and markets: “Index and style: size, region, style and how index weights work” (`/practice/index-style`)
- **Browse:** Browse everything › Practice: Other markets: “Index and style: size, region, style and how index weights work” (`/practice/index-style`)
- **ToC:** ToC › Practice: “Index and style: size, region, style and how index weights work”
- **Map:** Progress map: 1 stage(s) — `lab:index-style`
- **In-content (3 files):** `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/marketThemes/indexStyle.ts`, `src/lib/toolTraining/marketForces.ts`

### Param routes

#### `/cases/:caseId`

- **Page:** `src/pages/CasePlayer.tsx`
- **Teaches:** One case: decide, then reveal what happened.
- **Menu:** none
- **Browse:** none
- **ToC:** none
- **Map:** none
- **In-content (7 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/financials/caseLinks.ts`, `src/lib/playbookPrompt.ts`, `src/lib/playbooks.ts`, `src/pages/Cases.tsx`, `src/pages/Playbook.tsx`

#### `/coach/:slug`

- **Page:** `src/pages/CoachSession.tsx`
- **Teaches:** One coach session (decision tree with path trail and AI-explain prompt).
- **Menu:** none
- **Browse:** none
- **Track:** Track “Active and day trading” step 6: “Coach: Opening range breakout”; Track “New to stocks” step 10: “First paper trade (coach)”
- **ToC:** ToC › academy card (AcademyTrainingCard.tsx): `/coach/first-paper-trade`; ToC › deep-study (#coach): one link per coach session (all 99); ToC › deep-study: `/coach/${session.slug`
- **Map:** none
- **In-content (36 files):** `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/academy/options/ladder.ts (Academy ref)`, `src/lib/fairValueGap.ts`, `src/lib/fourPillars.ts`, `src/lib/marketThemes/agriculture.ts`, `src/lib/marketThemes/bonds.ts`, `src/lib/marketThemes/currencyFunds.ts`, `src/lib/marketThemes/energy.ts`, `src/lib/marketThemes/indexStyle.ts`, `src/lib/marketThemes/industrialMetals.ts`, `src/lib/marketThemes/materials.ts`, `src/lib/marketThemes/preciousMetals.ts`, `src/lib/marketThemes/sectors.ts`, `src/lib/marketThemes/structure.ts`, `src/lib/openingRange.ts`, `src/lib/playbookPrompt.ts`, `src/lib/playbooks.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/toolTraining/capstone.ts`, `src/lib/toolTraining/capstoneBank.ts`, `src/lib/toolTraining/earningsInsiders.ts`, `src/lib/toolTraining/edgar.ts`, `src/lib/toolTraining/finviz.ts`, `src/lib/toolTraining/marketForces.ts`, `src/lib/toolTraining/stockAnalysis.ts`, `src/lib/toolTraining/yahooFinance.ts`, `src/lib/tradeFramework.ts`, `src/lib/vixTrading.ts`, `src/lib/wheelStrategy.ts`, `src/pages/Cases.tsx`, `src/pages/Coach.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Playbook.tsx`, `src/pages/practice/GammaSqueeze.tsx`, `src/pages/practice/NewsBiases.tsx`

#### `/playbooks/:id`

- **Page:** `src/pages/Playbook.tsx`
- **Teaches:** One playbook: rules, risk, linked coach session and cases.
- **Menu:** none
- **Browse:** Browse everything › Playbooks: “A Treasury ladder for a known need” (`/playbooks/treasury-bond-ladder`); Browse everything › Playbooks: “Breakout, pullback and fair value gap” (`/playbooks/breakout-pullback-fvg`); Browse everything › Playbooks: “Business-cycle sector tilt, kept small” (`/playbooks/business-cycle-sector-tilt`); Browse everything › Playbooks: “Cash-secured put to buy lower” (`/playbooks/cash-secured-put`); Browse everything › Playbooks: “Covered call on shares you own” (`/playbooks/covered-call`); Browse everything › Playbooks: “Dollar-cost averaging on a schedule” (`/playbooks/dollar-cost-averaging`); Browse everything › Playbooks: “Gap and go” (`/playbooks/gap-and-go`); Browse everything › Playbooks: “Hold above the average” (`/playbooks/vwap-hold`); … 12 more
- **Track:** Track “Active and day trading” step 11: “Playbooks: Gap and go, VWAP hold, EMA reclaim”; Track “Active and day trading” step 5: “Playbook: Opening range context and confirmation”; Track “Company fundamentals and earnings” step 13: “Playbooks: Dollar-cost averaging, Rebalance to target”; Track “Macro and news” step 12: “Playbooks: Business-cycle sector tilt, Treasury bond ladder”; Track “Options and volatility” step 6: “Playbooks: Covered call, Cash-secured put, Protective put”; Track “Other markets” step 6: “Playbook: Futures roll”
- **ToC:** ToC › deep-study (#playbooks): one link per playbook (all 20); ToC › deep-study: `/playbooks/${playbook.id`
- **Map:** none
- **In-content (13 files):** `src/components/OrbContextLab.tsx`, `src/lib/fairValueGap.ts`, `src/lib/marketThemes/bonds.ts`, `src/lib/marketThemes/indexStyle.ts`, `src/lib/marketThemes/sectors.ts`, `src/lib/openingRange.ts`, `src/lib/playbookPrompt.ts`, `src/lib/playbooks.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/vixTrading.ts`, `src/lib/wheelStrategy.ts`, `src/pages/Playbooks.tsx`, `src/pages/practice/VixTrading.tsx`

#### `/tools/:toolId`

- **Page:** `src/pages/ToolsHub.tsx`
- **Teaches:** One Tool Training lesson (walkthrough, find-it tasks, simulations, quiz).
- **Menu:** Header › Learn › Advanced › Research tools: “Capstone 2: a bank, step by step” (`/tools/capstone-bank`); Header › Learn › Advanced › Research tools: “Capstone: one ticker, four tools” (`/tools/capstone`); Header › Learn › Advanced › Research tools: “Earnings dates and insiders” (`/tools/earnings-insiders`); Header › Learn › Advanced › Research tools: “Finviz” (`/tools/finviz`); Header › Learn › Advanced › Research tools: “Market Forces” (`/tools/market-forces`); Header › Learn › Advanced › Research tools: “SEC EDGAR” (`/tools/sec-edgar`); Header › Learn › Advanced › Research tools: “StockAnalysis” (`/tools/stockanalysis`); Header › Learn › Advanced › Research tools: “Yahoo Finance” (`/tools/yahoo-finance`)
- **Browse:** Browse everything › Tool Training: “Capstone 2: a bank, step by step” (`/tools/capstone-bank`); Browse everything › Tool Training: “Capstone: one ticker, four tools” (`/tools/capstone`); Browse everything › Tool Training: “Earnings dates and insiders” (`/tools/earnings-insiders`); Browse everything › Tool Training: “Finviz” (`/tools/finviz`); Browse everything › Tool Training: “Market Forces” (`/tools/market-forces`); Browse everything › Tool Training: “SEC EDGAR” (`/tools/sec-edgar`); Browse everything › Tool Training: “StockAnalysis” (`/tools/stockanalysis`); Browse everything › Tool Training: “Yahoo Finance” (`/tools/yahoo-finance`)
- **Track:** Track “Company fundamentals and earnings” step 10: “Tool Training: StockAnalysis, SEC EDGAR, Earnings & insiders”; Track “Macro and news” step 7: “Tool Training: Market Forces”
- **ToC:** ToC › Tool Training: “Capstone 2: a bank, step by step”; ToC › Tool Training: “Capstone: one ticker, four tools”; ToC › Tool Training: “Earnings dates and insiders”; ToC › Tool Training: “Finviz”; ToC › Tool Training: “Market Forces”; ToC › Tool Training: “SEC EDGAR”; ToC › Tool Training: “StockAnalysis”; ToC › Tool Training: “Yahoo Finance”
- **Map:** none
- **In-content (9 files):** `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/toolTraining/capstone.ts`, `src/lib/toolTraining/capstoneBank.ts`, `src/lib/toolTraining/earningsInsiders.ts`, `src/lib/toolTraining/edgar.ts`, `src/lib/toolTraining/finviz.ts`, `src/lib/toolTraining/marketForces.ts`, `src/lib/toolTraining/stockAnalysis.ts`, `src/lib/toolTraining/yahooFinance.ts`

#### `/macro/:lessonId`

- **Page:** `src/pages/macro/MacroLesson.tsx`
- **Teaches:** One macro release lesson (real source link, SIMULATED look-alike, reaction rules).
- **Menu:** none
- **Browse:** Browse everything › Macro lessons: “Consumer prices (CPI)” (`/macro/cpi`); Browse everything › Macro lessons: “Consumer sentiment” (`/macro/consumer-sentiment`); Browse everything › Macro lessons: “GDP” (`/macro/gdp`); Browse everything › Macro lessons: “Housing starts and permits” (`/macro/housing-starts`); Browse everything › Macro lessons: “Job openings and quits (JOLTS)” (`/macro/jolts`); Browse everything › Macro lessons: “Mortgage rates” (`/macro/mortgage-rates`); Browse everything › Macro lessons: “PCE inflation (the Fed's gauge)” (`/macro/pce`); Browse everything › Macro lessons: “Producer prices (PPI)” (`/macro/ppi`); … 10 more
- **ToC:** none
- **Map:** none
- **In-content (5 files):** `src/components/macro/CaseMacroLink.tsx`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/contentSims.ts`, `src/lib/macro/homeTip.ts`, `src/pages/macro/MacroDesk.tsx`

#### `/academy/test-out/:levelId`

- **Page:** `src/pages/academy/AcademyTestOut.tsx`
- **Teaches:** Level test-out quiz for one Academy level.
- **Menu:** none
- **Browse:** Browse everything › Academy level test-outs: “L0 Orientation test-out” (`/academy/test-out/L0`); Browse everything › Academy level test-outs: “L1 Stock basics test-out” (`/academy/test-out/L1`); Browse everything › Academy level test-outs: “L2 Charts & candles test-out” (`/academy/test-out/L2`); Browse everything › Academy level test-outs: “L3 Orders, sizing & risk test-out” (`/academy/test-out/L3`); Browse everything › Academy level test-outs: “L4 Company fundamentals & earnings test-out” (`/academy/test-out/L4`); Browse everything › Academy level test-outs: “L5 Macro & rates test-out” (`/academy/test-out/L5`); Browse everything › Academy level test-outs: “L6 Options education test-out” (`/academy/test-out/L6`); Browse everything › Academy level test-outs: “L7 Other markets test-out” (`/academy/test-out/L7`)
- **ToC:** none
- **Map:** none
- **In-content (1 files):** `src/pages/academy/AcademyHub.tsx`

#### `/academy/:unitId`

- **Page:** `src/pages/academy/AcademyUnit.tsx`
- **Teaches:** One Academy unit (cards, simulations, unit quiz; `?check=1` tests out, `?sim=` opens a simulation).
- **Menu:** none
- **Browse:** none
- **ToC:** none
- **Map:** none
- **In-content (11 files):** `src/components/academy/PlacementCard.tsx`, `src/components/academy/TodayCard.tsx`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/homeTip.ts`, `src/lib/contentSims.ts`, `src/lib/marketThemes/structure.ts`, `src/lib/toolTraining/capstone.ts`, `src/lib/toolTraining/marketForces.ts`, `src/pages/academy/AcademyHub.tsx`, `src/pages/academy/AcademyTestOut.tsx`, `src/pages/practice/CandleBasics.tsx`

#### `/paper/challenges/:challengeId`

- **Page:** `src/pages/academy/PaperChallenges.tsx`
- **Teaches:** One scored paper challenge.
- **Menu:** none
- **Browse:** Browse everything › Paper challenges: “A stop on a gap down” (`/paper/challenges/gap-through-stop`); Browse everything › Paper challenges: “Buy below the market” (`/paper/challenges/limit-below-market`); Browse everything › Paper challenges: “Buy the breakout with a stop order” (`/paper/challenges/breakout-buy-stop`); Browse everything › Paper challenges: “Don't average down” (`/paper/challenges/no-averaging-down`); Browse everything › Paper challenges: “Hold earnings with small size” (`/paper/challenges/earnings-small-size`); Browse everything › Paper challenges: “Keep the drawdown small” (`/paper/challenges/drawdown-cap`); Browse everything › Paper challenges: “Protect every entry” (`/paper/challenges/protect-with-a-stop`); Browse everything › Paper challenges: “Ride the trend with a trailing stop” (`/paper/challenges/ride-the-trend`); … 2 more
- **Track:** Track “Active and day trading” step 14: “Challenges: Breakout buy stop, Gap through stop”; Track “New to stocks” step 12: “Challenge: Protect every entry”
- **ToC:** none
- **Map:** none
- **In-content (2 files):** `src/components/academy/TodayCard.tsx`, `src/pages/academy/PaperChallenges.tsx`

## 5. Topics and resources by area

### Quiz groups

107 groups, 2200 questions. Open any group with `/training?group=<id>` (add `&start=1` to start it). Pattern groups show under `/training#patterns`, concept groups under `/training#concepts`. Source: `QUIZ_GROUPS` in `src/lib/quizData.ts`; split in `src/lib/quizKinds.ts`.

<details><summary>Pattern quiz groups (41)</summary>

| id | Name | Questions |
|---|---|---:|
| `crypto-candles` | Candlesticks for Crypto | 12 |
| `reversal-charts` | Reversal Chart Patterns | 12 |
| `pattern-themes` | Pattern Themes | 18 |
| `essential-candles` | Essential Candles | 15 |
| `which-way` | Which Way? | 10 |
| `japanese-candles` | Japanese Candlesticks: Core 14 | 33 |
| `chart-patterns` | Chart, Gap & Volume Patterns | 230 |
| `candle-pattern-book` | Candlestick Pattern Book | 16 |
| `buy-or-sell` | Buy or Sell? | 170 |
| `all` | All Patterns | 316 |
| `hammer` | Hammer Family | 7 |
| `doji` | Doji Family | 26 |
| `engulfing` | Engulfing Family | 18 |
| `bullish-engulfing` | Bullish Engulfing | 6 |
| `bearish-engulfing` | Bearish Engulfing | 6 |
| `shooting-star` | Shooting Star | 6 |
| `inverted-hammer` | Inverted Hammer | 6 |
| `morning-star` | Morning Star | 9 |
| `tweezer-bottom` | Tweezer Bottom | 6 |
| `rising-wedge` | Rising Wedge | 8 |
| `bull-flag` | Bull Flag | 6 |
| `double-top` | Double & Triple Top | 10 |
| `double-bottom` | Double & Triple Bottom | 10 |
| `triangle` | Triangle | 6 |
| `hanging-man` | Hanging Man | 6 |
| `evening-star` | Evening Star | 9 |
| `piercing-line` | Piercing Line | 6 |
| `dark-cloud-cover` | Dark Cloud Cover | 6 |
| `three-white-soldiers` | Three White Soldiers | 6 |
| `three-black-crows` | Three Black Crows | 6 |
| `harami` | Harami | 14 |
| `tweezer-top` | Tweezer Top | 9 |
| `falling-wedge` | Falling Wedge | 8 |
| `head-shoulders` | Head and Shoulders | 8 |
| `marubozu` | Marubozu | 14 |
| `three-inside-outside` | Three Inside / Outside | 7 |
| `counterattack-on-neck` | Counterattack & On-Neck | 10 |
| `continuation-methods` | Continuation Patterns | 17 |
| `gap-reversals` | Kickers, Abandoned Babies & Tri-Stars | 9 |
| `crows-and-strikes` | Crows, Strikes & Breakaways | 9 |
| `advanced-rare` | Advanced & Rare Patterns | 54 |

</details>

<details><summary>Concept quiz groups (66)</summary>

| id | Name | Questions |
|---|---|---:|
| `equity-literacy` | Equities Literacy | 12 |
| `financial-literacy` | Statements Literacy | 12 |
| `news-literacy` | News Literacy | 12 |
| `earnings-jargon` | Earnings Desk Language | 29 |
| `financial-drills` | Statements Drills | 12 |
| `statements-reading` | Reading the Statements | 21 |
| `cash-forecast-13wk` | 13-Week Cash Forecast | 11 |
| `earnings-preview` | Earnings Preview | 13 |
| `earnings-reaction` | Earnings Reactions | 13 |
| `macro-releases` | Reading Macro Releases | 15 |
| `rates-curve` | Rates & the Yield Curve | 14 |
| `fed-policy` | Fed Policy & Pricing | 13 |
| `housing-mortgage` | Housing & Mortgage Rates | 12 |
| `macro-reactions` | Macro Market Reactions | 16 |
| `orders-and-fills` | Orders & Fills | 22 |
| `paper-pnl` | Paper P&L | 20 |
| `options-ladder` | Options Ladder | 21 |
| `indicators` | Indicators | 12 |
| `oscillators` | Oscillators & Volatility Stops | 24 |
| `trading-risk` | Float, Short-Dated Options & Risk | 19 |
| `squeezes` | Squeezes, Options Flow & Survivorship | 14 |
| `news-biases` | News, Biases & Short-Term Options | 17 |
| `algo-trading` | Automated & Algo Trading | 17 |
| `charting-apps` | Indicator & Charting Apps | 14 |
| `one-minute-charts` | Reading 1-Minute Charts | 12 |
| `fib-decision-map` | Fibonacci Decision Map | 12 |
| `futures-vs-options` | Futures vs Options | 16 |
| `technique-narratives` | Technique Narratives | 14 |
| `missing-wicks` | Missing Wicks | 7 |
| `record-traders` | Record-setting traders | 16 |
| `candle-anatomy` | Candlestick Basics | 12 |
| `candle-reading` | Reading One Candle | 22 |
| `heikin-ashi` | Heikin-Ashi Candles | 15 |
| `price-action` | Price Action | 30 |
| `trade-framework` | Price Action Framework | 28 |
| `opening-range` | Opening Range Breakout | 22 |
| `four-pillars` | Price Action: Four Pillars | 17 |
| `fair-value-gap` | Breakout Pullback & Fair Value Gaps | 13 |
| `risk-premium-portfolio` | Risk Premiums, Trend Filters & the VIX | 15 |
| `vix-trading` | VIX Trading: Futures, Curve & Products | 40 |
| `wheel-strategy` | The Wheel: Cash-Secured Puts to Covered Calls | 20 |
| `exposure-wrappers` | Same Theme, Different Wrapper | 15 |
| `currency-funds` | Currency Funds & the Dollar | 12 |
| `precious-metals` | Precious Metals: Gold, Silver & Miners | 14 |
| `energy` | Energy: Oil, Gas & the Companies | 14 |
| `industrial-metals` | Industrial & Transition Metals | 12 |
| `agriculture` | Agriculture & Inputs | 12 |
| `materials-chemicals` | Materials, Chemicals & Resins | 12 |
| `bonds-rates` | Bonds & Rates | 14 |
| `sectors-rotation` | Sectors & Rotation | 14 |
| `index-style` | Index & Style | 14 |
| `tool-market-forces` | Tool: Market Forces | 19 |
| `tool-stockanalysis` | Tool: StockAnalysis | 14 |
| `tool-finviz` | Tool: Finviz | 14 |
| `tool-yahoo-finance` | Tool: Yahoo Finance | 14 |
| `tool-edgar` | Tool: SEC EDGAR | 14 |
| `tool-earnings-insiders` | Tool: Earnings dates and insiders | 14 |
| `tool-capstone` | Tool: Capstone | 14 |
| `tool-capstone-bank` | Tool: Capstone 2 (a bank) | 14 |
| `paper-desk` | Paper Desk: Trading the News, Filings and Events | 24 |
| `supply-demand` | Supply & Demand Zones | 12 |
| `equity-patterns` | Equity Pack Drills | 10 |
| `futures-literacy` | Futures Literacy | 12 |
| `forex-literacy` | Forex Literacy | 12 |
| `crypto-literacy` | Crypto Literacy | 12 |
| `options-literacy` | Options Context Literacy | 12 |

</details>

### Practice labs

45 labs in `MISC_PRACTICE_ITEMS` (`src/lib/miscPractices.ts`), in Practice menu order, plus the Options ladder row that `PRACTICE_MENU` inserts after Futures vs options. Each is in the Practice menu, the ToC Practice group and the progress map (`lab:<id>`).

<details><summary>Practice labs (45)</summary>

| id | Title | Route |
|---|---|---|
| `japanese-candles` | Japanese candlesticks | `/practice/japanese-candles` |
| `essential-candles` | Essential candlestick patterns | `/practice/essential-candles` |
| `missing-wicks` | Missing wicks and zooming in | `/practice/missing-wicks` |
| `which-way` | Which Way? (Up, Down or Either) | `/practice/which-way` |
| `pattern-themes` | Pattern themes | `/practice/pattern-themes` |
| `reversal-charts` | Reversal chart patterns | `/practice/reversal-charts` |
| `flashcards` | Flashcards | `/practice/flashcards` |
| `label` | Label | `/practice/label` |
| `lookalike` | Lookalikes | `/practice/lookalike` |
| `hunt` | Pattern hunt | `/practice/hunt` |
| `draw` | Drawing | `/practice-draw` |
| `regime` | Trend vs range | `/practice/regime` |
| `levels` | Support and resistance | `/practice/levels` |
| `replay` | Bar replay | `/practice/replay` |
| `plan` | Mark the plan | `/practice/plan` |
| `invalidation` | Invalidation | `/practice/invalidation` |
| `trade-framework` | Price action trading framework | `/practice/trade-framework` |
| `opening-range` | Opening range: retests, failed breaks & risk | `/practice/opening-range` |
| `fair-value-gap` | Breakout, pullback and fair value gap | `/practice/fair-value-gap` |
| `fib-decision-map` | Fibonacci as a decision map | `/practice/fib-decision-map` |
| `one-minute-charts` | Reading 1-minute charts | `/practice/one-minute-charts` |
| `heikin-ashi` | Heikin-Ashi candles | `/practice/heikin-ashi` |
| `ema-macd` | EMA, SMA and MACD (long charts) | `/practice/ema-macd` |
| `oscillators` | Oscillators & volatility stop | `/practice/oscillators` |
| `technique-narratives` | Technique narratives | `/practice/technique-narratives` |
| `charting-apps` | Indicator & charting apps | `/practice/charting-apps` |
| `news-biases` | News, biases & short-term options | `/practice/news-biases` |
| `futures-vs-options` | Futures vs options & beginner toolkit | `/practice/futures-vs-options` |
| `wheel-strategy` | The wheel strategy (cash-secured puts to covered calls) | `/practice/wheel-strategy` |
| `gamma-squeeze` | Gamma squeeze case | `/practice/gamma-squeeze` |
| `crypto-candles` | Candlesticks for crypto | `/practice/crypto-candles` |
| `risk-premium-portfolio` | Risk-premium portfolio and the VIX overlay | `/practice/risk-premium-portfolio` |
| `vix-trading` | VIX trading for beginners | `/practice/vix-trading` |
| `exposure-wrappers` | Same theme, different wrapper: stocks, funds and futures | `/practice/exposure-wrappers` |
| `currency-funds` | Currency funds and the dollar | `/practice/currency-funds` |
| `precious-metals` | Precious metals: gold, silver and the miners | `/practice/precious-metals` |
| `energy` | Energy: oil, natural gas and the companies | `/practice/energy` |
| `industrial-metals` | Industrial and transition metals: copper, uranium and clean energy | `/practice/industrial-metals` |
| `agriculture` | Agriculture and inputs: crops, fertilizer and farm equipment | `/practice/agriculture` |
| `materials-chemicals` | Materials, chemicals and resins: Dow, LyondellBasell, Westlake, Eastman | `/practice/materials-chemicals` |
| `bonds-rates` | Bonds and rates: SGOV, SHY, IEF, TLT, TIP and duration | `/practice/bonds-rates` |
| `sectors-rotation` | Sectors and rotation: the 11 sectors, sector funds, REITs and the business cycle | `/practice/sectors-rotation` |
| `index-style` | Index and style: size, region, style and how index weights work | `/practice/index-style` |
| `algo-trading` | Automated & algo trading (2026) | `/practice/algo-trading` |
| `record-traders` | Record-setting traders | `/practice/record-traders` |

</details>

Other practice pages not in `MISC_PRACTICE_ITEMS`: Candlestick Basics `/practice/candle-basics` (Pattern recognition menu), Statements lab `/practice/statements`, Read the Print `/practice/read-the-print`, Mark the band `/practice/mark-the-band` (Other factors menu).

<details><summary>Market themes (10, rendered by `src/components/practice/MarketThemePage.tsx`)</summary>

| id | Title | Route | Quiz questions |
|---|---|---|---:|
| `exposure-wrappers` | Same theme, different wrapper: stocks, funds and futures | `/practice/exposure-wrappers` | 15 |
| `currency-funds` | Currency funds and the dollar | `/practice/currency-funds` | 12 |
| `precious-metals` | Precious metals: gold, silver and the miners | `/practice/precious-metals` | 14 |
| `energy` | Energy: oil, natural gas and the companies | `/practice/energy` | 14 |
| `industrial-metals` | Industrial and transition metals: copper, uranium and clean energy | `/practice/industrial-metals` | 12 |
| `agriculture` | Agriculture and inputs: crops, fertilizer and farm equipment | `/practice/agriculture` | 12 |
| `materials-chemicals` | Materials, chemicals and resins: Dow, LyondellBasell, Westlake, Eastman | `/practice/materials-chemicals` | 12 |
| `bonds-rates` | Bonds and rates: SGOV, SHY, IEF, TLT, TIP and duration | `/practice/bonds-rates` | 14 |
| `sectors-rotation` | Sectors and rotation: the 11 sectors, sector funds, REITs and the business cycle | `/practice/sectors-rotation` | 14 |
| `index-style` | Index and style: size, region, style and how index weights work | `/practice/index-style` | 14 |

</details>

<details><summary>Technique narratives (6, `/practice/technique-narratives?n=<id>`)</summary>

- `rsi-range`: RSI reversals in a range
- `ma-trend`: Moving-average crossover on a smooth trend
- `cup-breakout`: Volume breakout from a cup and handle
- `vwap-pullback`: VWAP pullbacks on a trend day
- `macd-divergence`: MACD bullish divergence
- `bollinger-squeeze`: Bollinger Band squeeze breakout

</details>

<details><summary>Pattern themes (17, `/practice/pattern-themes?theme=<id>` and `/archive?theme=<id>`)</summary>

- `continuation`: Trend continuation
- `bullish-reversal`: Bullish reversal
- `bearish-reversal`: Bearish reversal
- `convergence`: Convergence and volatility compression
- `balance`: Horizontal balance, range and congestion
- `expansion`: Expansion and divergence
- `breakout`: Breakout and breakdown
- `rejection`: Rejection of a price level
- `indecision`: Indecision and transition
- `momentum`: Momentum and directional dominance
- `exhaustion`: Exhaustion and climax
- `gap`: Gap and discontinuity
- `role-reversal`: Support, resistance, role reversal and retest
- `basing`: Basing, accumulation, topping and distribution
- `measured-move`: Measured move and price projection
- `failure`: Pattern failure and traps
- `confirmation`: Confirmation and multi-time-frame context

</details>

<details><summary>Pages with simulations (`?sim=<id>`, 25 sets in `src/lib/contentSims.ts`)</summary>

- `/practice/exposure-wrappers`
- `/practice/currency-funds`
- `/practice/precious-metals`
- `/practice/energy`
- `/practice/industrial-metals`
- `/practice/agriculture`
- `/practice/materials-chemicals`
- `/practice/bonds-rates`
- `/practice/sectors-rotation`
- `/practice/index-style`
- `/macro/employment-situation`
- `/macro/cpi`
- `/macro/ism-pmi`
- `/macro/fomc-decision`
- `/macro/treasury-curve`
- `/macro/mortgage-rates`
- `/academy/l2-wicks-and-bodies`
- `/academy/l2-support-resistance`
- `/academy/l2-volume-confirms`
- `/academy/l3-stop-orders`
- `/academy/l3-trailing-stop`
- `/academy/l4-earnings-reactions`
- `/academy/l7-what-you-own`
- `/academy/l7-before-you-trade`
- `/practice/vix-trading`

</details>

### Tool Training

Hub `/tools` (`src/pages/ToolsHub.tsx`), lessons in `TOOL_LESSONS` (`src/lib/toolTraining/index.ts`). Every lesson is in the Tool Training menu and the ToC Tool Training group.

| id | Lesson | Route | Questions |
|---|---|---|---:|
| `tool-market-forces` | Market Forces: start with what moves the market | `/tools/market-forces` | 19 |
| `tool-stockanalysis` | StockAnalysis: read the numbers and their dates | `/tools/stockanalysis` | 14 |
| `tool-finviz` | Finviz: screen, then check the snapshot | `/tools/finviz` | 14 |
| `tool-yahoo-finance` | Yahoo Finance: labels, periods and footnotes | `/tools/yahoo-finance` | 14 |
| `tool-edgar` | SEC EDGAR: read the filing the sites summarize | `/tools/sec-edgar` | 14 |
| `tool-earnings-insiders` | Earnings dates and insider trackers: check the source | `/tools/earnings-insiders` | 14 |
| `tool-capstone` | Capstone: research one ticker across four tools | `/tools/capstone` | 14 |
| `tool-capstone-bank` | Capstone part 2: research a bank across five tools | `/tools/capstone-bank` | 14 |
| — | Charting apps compared (kept in Practice too) | `/practice/charting-apps` | — |

### Academy

Hub `/academy` (`src/pages/academy/AcademyHub.tsx`). Units open at `/academy/<unitId>` (`?check=1` tests out of a unit). Level test-outs open at `/academy/test-out/<levelId>`, linked only from the hub. Source: `LEVELS` and `UNITS` in `src/lib/academy/content/levels.ts`.

<details><summary>Academy levels (8) and units (45)</summary>

**L0 Orientation** (test-out `/academy/test-out/L0`)
- Course `orientation` Start here: `l0-what-is-a-market` What a market is, `l0-how-this-app-works` How this app teaches, `l0-risk-first` Risk comes first, `l0-simulated-vs-real` Simulated vs real money, `l0-learning-plan` Build a learning routine

**L1 Stock basics** (test-out `/academy/test-out/L1`)
- Course `stock-basics` Stocks and quotes: `l1-what-is-a-share` What a share is, `l1-quotes-and-spreads` Reading a quote, `l1-why-prices-move` Why prices move, `l1-long-vs-short` Long, short and selling, `l1-investing-vs-trading` Investing vs trading, `l1-diversification` Don't put it all in one stock

**L2 Charts & candles** (test-out `/academy/test-out/L2`)
- Course `charts-and-candles` Reading charts: `l2-reading-a-candle` Reading one candle, `l2-wicks-and-bodies` Wicks and bodies, `l2-trend-vs-range` Trend or range?, `l2-support-resistance` Support and resistance, `l2-volume-confirms` Volume confirms, `l2-patterns-need-context` Patterns need context

**L3 Orders, sizing & risk** (test-out `/academy/test-out/L3`)
- Course `order-types` Order types: `l3-market-vs-limit` Market vs limit orders, `l3-stop-orders` Stop orders, `l3-stop-limit` Stop-limit orders, `l3-trailing-stop` Trailing stops, `l3-time-in-force` How long an order lasts
- Course `sizing-and-planning` Sizing and planning: `l3-position-sizing` How many shares?, `l3-trade-plan` Plan before you enter

**L4 Company fundamentals & earnings** (test-out `/academy/test-out/L4`)
- Course `reading-statements` Reading statements: `l4-three-statements` The three statements, `l4-profit-vs-cash` Profit is not cash, `l4-margins-and-pe` Margins and P/E
- Course `earnings` Earnings season: `l4-earnings-expectations` Earnings vs expectations, `l4-earnings-reactions` How stocks react to earnings, `l4-balance-sheet-risk` Debt and balance-sheet risk

**L5 Macro & rates** (test-out `/academy/test-out/L5`)
- Course `macro-and-rates` Macro and rates: `l5-jobs-and-inflation` Jobs and inflation reports, `l5-the-fed` What the Fed does, `l5-yield-curve` Yields and the curve, `l5-macro-reactions` Reading a macro reaction, `l5-housing-and-rates` Rates, housing and sectors

**L6 Options education** (test-out `/academy/test-out/L6`)
- Course `options-basics` Options basics: `l6-what-is-an-option` What an option is, `l6-payoff-at-expiration` Payoff at expiration, `l6-covered-call-and-csp` Covered calls and cash-secured puts, `l6-options-risk` Why options are risky

**L7 Other markets** (test-out `/academy/test-out/L7`)
- Course `other-markets` Beyond single stocks: `l7-etfs` ETFs, `l7-futures` Futures, `l7-forex` Currencies (forex), `l7-crypto` Crypto
- Course `before-you-trade` Before you trade: `l7-what-you-own` What you would own, by type, `l7-before-you-trade` Before you trade: a research checklist


</details>

<details><summary>Options ladder (`/academy/options`): 4 levels, 13 strategies, no per-strategy URL</summary>

- Level 1: `covered-call` Covered call
- Level 1: `buy-write` Buy-write
- Level 1: `cash-secured-put` Cash-secured put
- Level 2: `long-call` Long call
- Level 2: `long-put` Long put
- Level 2: `protective-put` Protective put
- Level 2: `collar` Collar
- Level 3: `bull-call-spread` Bull call spread (debit)
- Level 3: `bull-put-spread` Bull put spread (credit)
- Level 3: `iron-condor` Iron condor
- Level 3: `call-butterfly` Call butterfly
- Level 4: `naked-call` Naked (uncovered) call
- Level 4: `naked-put` Naked (uncovered) put

</details>

### Paper trading

- `/paper`: SIMULATED account (`src/pages/academy/Paper.tsx`), links to Challenges and Paper desk.
- `/paper/challenges`: 10 challenges, each at `/paper/challenges/<id>`.
- `/paper/desk`: 30 scenarios in 11 topics, picked inside the page (topic filter `desk-topic-filter`); no URL per scenario.

<details><summary>Paper challenges (10)</summary>

- `limit-below-market`: Buy below the market (theme `order-mechanics`)
- `protect-with-a-stop`: Protect every entry (theme `order-mechanics`)
- `ride-the-trend`: Ride the trend with a trailing stop (theme `trailing-stops`)
- `grind-trail`: Trail a slow climb (theme `trailing-stops`)
- `drawdown-cap`: Keep the drawdown small (theme `risk`)
- `no-averaging-down`: Don't average down (theme `risk`)
- `wait-for-support`: Wait for support (theme `patience`)
- `breakout-buy-stop`: Buy the breakout with a stop order (theme `patience`)
- `gap-through-stop`: A stop on a gap down (theme `earnings-gap`)
- `earnings-small-size`: Hold earnings with small size (theme `earnings-gap`)

</details>

<details><summary>Paper desk scenarios (30) by topic</summary>

**Real history** (`historical`, 1): `big-tech-2024` Big tech, 2024 (HISTORICAL)

**Earnings & guidance** (`earnings`, 3): `sim-earnings-week` Earnings season (SIMULATED); `sim-earnings-miss` Miss and drift (SIMULATED); `sim-sell-the-news` Beat, then sell the news (SIMULATED)

**Trends & ranges** (`trend`, 3): `sim-bull-trend` Ride a bull trend (SIMULATED); `sim-bear-trend` Don't fight a bear trend (SIMULATED); `sim-range-chop` Trade the range, skip the chop (SIMULATED)

**Breakouts & gaps** (`breakouts`, 2): `sim-breakout-vs-fail` Breakout or fakeout? (SIMULATED); `sim-gap-go-vs-fill` Gap and go vs gap fill (SIMULATED)

**Volatility & squeezes** (`volatility`, 2): `sim-flash-crash` Flash crash day (SIMULATED); `sim-short-squeeze` Short squeeze (SIMULATED)

**Corporate actions** (`corporate`, 4): `sim-dividend` Dividend and the ex-date drop (SIMULATED); `sim-stock-split` Stock split (SIMULATED); `sim-secondary-offering` Secondary offering and dilution (SIMULATED); `sim-buyback` Buybacks and EPS (SIMULATED)

**Deals & binary events** (`events`, 2): `sim-merger-arb` Takeover: target pops, acquirer drops (SIMULATED); `sim-fda-binary` Drug decision: a binary event (SIMULATED)

**Macro & sectors** (`macro`, 4): `sim-fed-decision` Fed surprise: who wins, who loses (SIMULATED); `sim-cpi-surprise` Hot inflation print (SIMULATED); `sim-sector-rotation` Sector rotation (SIMULATED); `sim-recession-bear` Recession and a bear market (SIMULATED)

**Balance-sheet risk** (`credit`, 2): `sim-going-concern` Going-concern warning to bankruptcy (SIMULATED); `sim-restatement` Accounting restatement (SIMULATED)

**Insiders & analysts** (`signals`, 2): `sim-insider-buying` Insider buying after a selloff (SIMULATED); `sim-analyst-calls` Analyst upgrades and downgrades (SIMULATED)

**Execution & risk** (`execution`, 5): `sim-illiquid-smallcap` Thin small cap: slippage (SIMULATED); `sim-overnight-gaps` Overnight gaps vs stop orders (SIMULATED); `sim-trailing-stops` Trailing stops: tight vs wide (SIMULATED); `sim-drawdown-sizing` Sizing through a drawdown (SIMULATED); `sim-time-decay` Sideways: time decay vs shares (SIMULATED)


</details>

### Cases

Hub `/cases` (`src/pages/Cases.tsx`). 17 packs, 517 cases, each at `/cases/<caseId>`. Focus a pack with `/cases?pack=<id>`; limit to one market with `?market=<class>` (or `?class=`). On the default path the list shows **beginner** cases only; intermediate cases show on the Decision Maker path.

| Pack | Name | Cases | Beginner | Intermediate | Market class |
|---|---|---:|---:|---:|---|
| `earnings` | Earnings | 13 | 8 | 5 | equity |
| `company-news` | Company news | 15 | 10 | 5 | equity |
| `macro-news` | Market-wide news | 65 | 56 | 9 | equity |
| `combined` | News plus financials | 13 | 8 | 5 | equity |
| `price-action` | Price action trades | 15 | 14 | 1 | equity |
| `futures` | Futures | 42 | 25 | 17 | future |
| `futures-tape` | Futures tape | 29 | 27 | 2 | future |
| `futures-macro` | Futures macro | 29 | 26 | 3 | future |
| `forex` | Forex | 41 | 27 | 14 | forex |
| `forex-tape` | Forex tape | 29 | 27 | 2 | forex |
| `forex-macro` | Forex macro | 29 | 26 | 3 | forex |
| `crypto` | Crypto | 39 | 25 | 14 | crypto |
| `crypto-tape` | Crypto tape | 29 | 27 | 2 | crypto |
| `crypto-macro` | Crypto macro | 29 | 26 | 3 | crypto |
| `options-context` | Options context | 42 | 26 | 16 | option_context |
| `options-tape` | Options tape | 29 | 27 | 2 | option_context |
| `options-macro` | Options macro | 29 | 26 | 3 | option_context |

<details><summary>Pack `earnings` (13 cases)</summary>

- `case-earn-beat-miss`: Earnings miss at a big tech company
- `case-earn-margin-compression`: Sales up, profit margin down
- `case-earn-cash-flow-flag`: Profit on paper, cash missing
- `case-earn-guidance-cut`: Decent quarter, weaker outlook
- `case-earn-balance-stress`: Earnings thin, debt jumped
- `case-earn-retail-beat-thin`: Retail beat, but traffic was the story
- `case-earn-bank-quiet-beat`: Bank beats, loan growth still slow
- `case-earn-int-beat-gap`: Beat on EPS, miss on the mix (intermediate)
- `case-earn-int-margin-volume`: Units up, dollars of profit down (intermediate)
- `case-earn-int-cash-receivables`: Profit printed, receivables ate cash (intermediate)
- `case-earn-int-guide-cut-utility`: Utility cuts capex-funded outlook (intermediate)
- `case-earn-int-debt-airline`: Airline prints a profit on a thin equity cushion (intermediate)
- `case-scale-beat-hold`: Quiet earnings beat

</details>

<details><summary>Pack `company-news` (15 cases)</summary>

- `case-news-chase-fade`: Stock already ran, then a product headline
- `case-news-supplier-win`: New multi-year supply contract
- `case-news-ceo-exit`: CEO resigns, no scandal alleged
- `case-news-pharma-trial-hype`: Trial headline after a gap-down week
- `case-news-steel-contract-spike`: Steel mill wins a one-off order
- `case-news-telco-spectrum-pause`: Telco delays a spectrum purchase
- `case-news-int-chase-reit`: REIT already ran into a refinancing headline (intermediate)
- `case-news-int-headline-plant`: Factory fire, insurance comment attached (intermediate)
- `case-news-int-chase-small`: Small-name listing rumor after a chop (intermediate)
- `case-news-int-headline-bank-branch`: Bank closes branches, keeps the deposit book (intermediate)
- `case-news-short-recall`: You do not own it. The launch is recalled.
- `case-news-short-rumor-trap`: Scary rumor, no filing, you do not own it
- `case-news-int-short-trial-fail`: Filed trial miss after a run-up (intermediate)
- `case-scale-buyback`: Large buyback after a weak stretch
- `case-scale-dividend-cut`: Dividend cut to preserve cash

</details>

<details><summary>Pack `macro-news` (65 cases)</summary>

- `case-macro-risk-off`: Market-wide fear, stock already ran (intermediate)
- `case-macro-print`: Inflation comes in hotter than expected (intermediate)
- `case-macro-supply`: Shipping lane disrupted (intermediate)
- `case-macro-beg-risk-off-utility`: Market fear, utility barely moved
- `case-macro-beg-risk-off-airline`: Travel stocks sold with everything else
- `case-macro-beg-risk-off-bank`: Banks sold as credit worries rise
- `case-macro-beg-print-jobs-hot`: Jobs come in hotter than people hoped
- `case-macro-beg-print-soft-landing`: Inflation cools a little
- `case-macro-beg-print-gdp-soft`: Growth data comes in soft
- `case-macro-beg-supply-freight`: Port delay lifts freight costs
- `case-macro-beg-supply-energy`: Pipeline outage, energy producer
- `case-scale-risk-on`: Jobs cool without collapsing (intermediate)
- `case-vrp-inverse-vix-note`: An inverse-VIX note after a quiet year (intermediate)
- `case-vrp-short-vxx-curve-inverts`: Short VXX as the VIX curve inverts (intermediate)
- `case-vrp-long-bonds-rising-rates`: A big long-bond slice as rates start rising (intermediate)
- `case-vix-inverse-fund-round-trip`: A daily inverse VIX fund after a round trip (intermediate)
- `case-vix-gap-through-stop`: A long-volatility fund gaps through the stop (intermediate)
- `case-wrap-futures-fund-lags-spot`: Wrapper: the oil fund lags while crude holds up
- `case-wrap-miner-misses-while-gold-rises`: Wrapper: gold rises, but your miner gaps down
- `case-pm-gold-falls-miner-falls-harder`: Precious metals: gold dips 4%, the miner fund drops 10%
- `case-pm-silver-industrial-headline`: Precious metals: silver jumps on a solar demand report
- `case-pm-trust-fee-switch`: Precious metals: two gold trusts, two fees
- `case-en-refiner-crude-up-margin-down`: Energy: crude rises, the refiner falls
- `case-en-gas-producer-mild-winter`: Energy: a mild winter forecast hits your gas producer
- `case-en-gas-fund-long-hold`: Energy: a natural gas futures fund as a long-term hold
- `case-im-copper-mine-disruption`: Industrial metals: a mine shutdown lifts copper
- `case-im-uranium-spot-spike`: Industrial metals: spot uranium spikes; the producer lags
- `case-im-solar-rates-rise`: Transition: rates jump and a solar maker gaps down
- `case-ag-wasde-tight-stocks`: Agriculture: WASDE cuts corn stocks; the corn fund jumps
- `case-ag-nitrogen-gas-spike`: Agriculture: natural gas spikes; the nitrogen maker slides
- `case-ag-equipment-farm-income`: Agriculture: lower farm income hits the equipment maker
- `case-mat-new-capacity-margin-squeeze`: Materials: new plants come online and resin prices slide
- `case-mat-xlb-not-a-resin-fund`: Materials: you bought XLB as a resin play
- `case-mat-oil-spikes-ethane-edge`: Materials: oil jumps, gas stays cheap
- `case-br-long-fund-as-cash`: Bonds: a long Treasury fund used as a savings account
- `case-br-fed-cut-long-yields-up`: Bonds: the Fed cuts, but long yields rise
- `case-br-ladder-rung-matures`: Bonds: a ladder rung matures after rates fell
- `case-sr-tech-fund-on-index-fund`: Sectors: adding a tech fund to an index fund for "diversification"
- `case-sr-recession-called-late`: Sectors: a recession is announced months after it began
- `case-sr-reit-fund-rates-jump`: Sectors: real estate falls as yields jump
- `case-ix-three-funds-one-bet`: Index and style: three funds, one bet
- `case-ix-small-caps-lag`: Index and style: small caps lag for a year
- `case-ix-intl-jumps-on-dollar`: Index and style: international jumps as the dollar slides
- `case-mf-gold-theme-hot`: Market Forces: the gold theme is in the news
- `case-mf-futures-badge`: Market Forces: the fund said Commodity futures
- `case-mf-dow-one-stock`: Market Forces: one stock moves the Dow
- `case-sa-one-time-gain-pe`: StockAnalysis: the cheapest P/E in the group
- `case-sa-impairment-loss`: StockAnalysis: a loss year from a write-down
- `case-sa-net-cash-to-debt`: StockAnalysis: net cash turned to net debt
- `case-fv-tiny-top-gainer`: Finviz: the top of the sorted screen
- `case-fv-oversold-signal`: Finviz: the Oversold signal
- `case-fv-insider-sale-post`: Finviz: "insiders are dumping"
- `case-yf-average-target`: Yahoo Finance: "14% upside"
- `case-yf-close-vs-adj-close`: Yahoo Finance: the fund that "went nowhere"
- `case-yf-summary-box`: Yahoo Finance: the summary box
- `case-ed-ttm-mismatch`: EDGAR: the TTM that does not match
- `case-ed-award-not-buy`: EDGAR: "insiders are buying"
- `case-ei-estimated-date`: Earnings dates: the estimate moves
- `case-ei-cluster-sales`: Insiders: six sales in one day
- `case-cp-cheaper-on-finviz`: Capstone: "it's cheaper on Finviz"
- `case-cp-earnings-in-two-days`: Capstone: research done, earnings in two days
- `case-cp-rule-triggered`: Capstone: the written rule triggers
- `case-cb-ps-bargain`: Capstone 2: the cheap P/S on one site
- `case-cb-negative-cash-flow`: Capstone 2: "the bank burns cash"
- `case-cb-provision-jump`: Capstone 2: beat on EPS, rise in provisions

</details>

<details><summary>Pack `combined` (13 cases)</summary>

- `case-comb-earn-headline`: Beat the quarter, cut the outlook (intermediate)
- `case-comb-rumor-filing`: Restatement rumor, then a filing (intermediate)
- `case-comb-margin-news`: Thinner margins plus sector cost news (intermediate)
- `case-comb-cash-contract`: Weak cash now, big contract later (intermediate)
- `case-comb-beg-beat-headline`: Quarter looks fine, headline is a probe
- `case-comb-beg-margin-recall`: Thinner margin plus a product recall
- `case-comb-beg-guide-bank`: Bank beats, cuts the loan-growth outlook
- `case-comb-beg-cash-airline`: Airline profit, cash still thin, fuel headline
- `case-comb-beg-rumor-buyout`: Buyout rumor, then a quiet filing
- `case-comb-beg-rumor-restatement`: Restatement scare, classification filing
- `case-comb-beg-rumor-dividend`: Dividend-cut rumor, then a keep-the-payout filing
- `case-comb-beg-rumor-pharma`: Approval rumor, then a delay filing
- `case-scale-combined-lawsuit`: Lawsuit headline, large cash pile (intermediate)

</details>

<details><summary>Pack `price-action` (15 cases)</summary>

- `case-pa-chop-no-edge`: Framework 1: chop with no edge
- `case-pa-breakout-entry`: Framework 2: breakout from the base
- `case-pa-stop-hit`: Framework 3: the breakout fails
- `case-pa-trail-hold`: Framework 4: a pullback above the trailed stop
- `case-pa-take-profit`: Framework 5: at the planned target
- `case-orb-close-above`: Opening range 1: a close above the range
- `case-orb-wick-only`: Opening range 2: only a wick above
- `case-orb-wide-range`: Opening range 3: a signal with a huge range
- `case-fp-reclaim`: Four pillars 1: a level reclaimed on the close
- `case-fp-rejection`: Four pillars 2: a wick rejected at resistance (intermediate)
- `case-fp-context-pass`: Four pillars 3: a good setup in bad context
- `case-fvg-breakout-signal`: Fair value gap 1: the breakout candle
- `case-fvg-pullback-into-gap`: Fair value gap 2: the pullback into the gap
- `case-fvg-never-retested`: Fair value gap 3: the gap that never got retested
- `case-fvg-gap-fails`: Fair value gap 4: the gap that did not hold

</details>

<details><summary>Pack `futures` (42 cases)</summary>

- `case-vix-short-future-spot-falls`: Short a VIX future: spot falls, your future rises (intermediate)
- `case-vix-spot-rises-short-wins`: Short a VIX future: spot rises, the short still wins (intermediate)
- `case-vix-95-percent-win-rate`: Nineteen small wins, then the curve inverts (intermediate)
- `case-wrap-gold-contract-near-expiry`: Wrapper: a gold futures contract near expiration
- `case-fut-trend-cont`: Index futures still grinding higher
- `case-fut-risk-off`: Crude futures dump on fear
- `case-fut-roll-literacy`: Front month richer than the next (contango)
- `case-fut-gold-grind`: Gold futures still grinding with a calm brief
- `case-fut-corn-weather`: Corn futures dump on a weather scare
- `case-fut-nq-risk-off`: Nasdaq futures sold with risk appetite
- `case-fut-es-print`: Index futures into a hot data print
- `case-fut-cl-supply`: Crude futures catch a bid on a supply headline
- `case-fut-int-gold-fade`: Gold already extended into a calm print (intermediate)
- `case-fut-int-roll-backwardation`: Front month cheaper than the next (backwardation) (intermediate)
- `case-fut-int-nq-print`: Growth index futures after a soft print (intermediate)
- `case-fut-ng-storage-note`: Nat-gas coiled, then a storage-operator note
- `case-fut-hg-print-headline`: Copper stocks print a draw, then a cancel headline
- `case-fut-zw-rumor-note`: Wheat dump on an export-ban rumor, then an official note
- `case-fut-int-si-miner-note`: Silver already ran, then a miner restores output (intermediate)
- `case-fut-int-rty-risk-off`: Small-cap futures bounce into a risk-off tape (intermediate)
- `case-fut-int-zs-harvest`: Soy already dumped into a harvest-outage scare (intermediate)
- `case-fut-int-ho-print-headline`: Heating-oil stocks print a draw, then a warm-weather headline (intermediate)
- `case-fut-int-pl-rumor-note`: Platinum ran on a delivery-default rumor, then an official note (intermediate)
- `case-fut-kc-fail-break`: Coffee futures poke a range, then fail
- `case-fut-ct-round-top`: Cotton futures round over after a mill offtake note
- `case-fut-sb-staircase`: Sugar futures step higher on a port-strike scare
- `case-fut-cc-expand-range`: Cocoa futures range is getting wider, not cleaner
- `case-fut-le-open-drive`: Live-cattle futures open with a wide drive after a packer note
- `case-fut-zn-double-bottom`: Ten-year note futures test the same low twice after a jobs scare
- `case-fut-he-outside-bar`: Lean-hog futures print an outside bar that closes weak
- `case-fut-ym-doji-hold`: Dow futures print a doji on mixed risk-off chatter
- `case-fut-rb-dump-no-reclaim`: Gasoline futures dump on a demand scare, no reclaim
- `case-fut-lb-inside-bar`: Lumber prints an inside bar into a mill note
- `case-fut-int-oj-flag`: Orange juice flags after a freeze scare already in the price (intermediate)
- `case-fut-int-pa-wedge`: Palladium rising wedge after a catalyst scare already in the price (intermediate)
- `case-fut-int-dx-vreclaim`: Dollar-index futures V-reclaim after a walked-back risk-off scare (intermediate)
- `case-fut-int-zl-round`: Soybean-oil futures round over after a crush scare already in the highs (intermediate)
- `case-fut-zm-double-top`: Soymeal tags the same high twice into chase chatter
- `case-fut-int-zo-three-push`: Oats three-push into a drought scare already in the highs (intermediate)
- `case-fut-zr-falling-wedge`: Rough rice falling wedge after a flood scare already in the tape
- `case-fut-rs-head-shoulders`: Canola head-and-shoulders into crush-export chase chatter
- `case-fut-int-gf-head-shoulders`: Feeder-cattle head-and-shoulders into a herd scare already in the highs (intermediate)

</details>

<details><summary>Pack `futures-tape` (29 cases)</summary>

- `case-fut-tape-ke-tweezer`: Hard-red wheat tweezer top into a freeze scare already in the highs
- `case-fut-tape-dc-evening-star`: Class-III milk evening star into an official inventory note
- `case-fut-tape-bz-open-drive`: Brent futures open with a wide drive after an official OPEC statement
- `case-fut-tape-nkd-dump-no-reclaim`: Nikkei futures dump on a hike scare, no reclaim
- `case-fut-tape-mw-inside-bar`: Spring wheat inside bar into an official USDA crop note still ahead
- `case-fut-tape-zt-outside-bar`: Two-year note futures print an outside bar that closes weak
- `case-fut-tape-6b-fail-break`: Sterling futures poke a range, then fail
- `case-fut-tape-6c-engulf`: Canadian-dollar futures print a bearish engulfing after a small green bar
- `case-fut-tape-6j-shooting-star`: Yen futures print a shooting star after a grind
- `case-fut-tape-6n-dark-cloud`: Kiwi futures print a dark-cloud cover after a grind
- `case-fut-tape-6l-three-crows`: Real futures print three black crows after a grind
- `case-fut-tape-6h-hanging-man`: Hong Kong dollar futures print a hanging man after a grind
- `case-fut-tape-6r-harami`: Ruble futures print a bearish harami after a grind
- `case-fut-tape-6k-marubozu`: Krona futures print a bearish marubozu after a grind
- `case-fut-tape-i6-gravestone`: Ringgit futures print a gravestone doji after a grind
- `case-fut-tape-idr-harami-cross`: Rupiah futures print a harami cross after a grind
- `case-fut-tape-clp-spinning-top`: Chilean-peso futures print a spinning top after a grind
- `case-fut-tape-cop-long-legged-doji`: Colombian-peso futures print a long-legged doji after a grind
- `case-fut-tape-pen-dragonfly`: Peruvian-sol futures print a dragonfly doji after a grind
- `case-fut-tape-sgd-matching-high`: Singapore-dollar futures print a matching high after a grind
- `case-fut-tape-twd-belt-hold`: Taiwan-dollar futures print a bearish belt hold after a grind
- `case-fut-tape-czk-separating-lines`: Czech-koruna futures print bearish separating lines after a grind
- `case-fut-tape-nok-on-neck`: Norwegian-krone futures print a bearish on-neck after a grind
- `case-fut-tape-bgn-in-neck`: Bulgarian-lev futures print a bearish in-neck after a grind
- `case-fut-tape-uah-thrusting`: Ukrainian-hryvnia futures print a bearish thrusting line after a grind
- `case-fut-tape-qar-piercing`: Qatari-riyal futures print a piercing line after a dump
- `case-fut-tape-bhd-engulf`: Bahraini-dinar futures print a bullish engulfing after a dump
- `case-fut-tape-int-cl-statement-no-barrels`: SAMPLE crude rallies into a producer statement with no new barrels (intermediate)
- `case-fut-tape-int-es-breakout-retest-holds`: SAMPLE index future breaks its range, then the retest holds (intermediate)

</details>

<details><summary>Pack `futures-macro` (29 cases)</summary>

- `case-fut-macro-zb-open-drive`: Long-bond futures open with a wide drive as risk appetite fades
- `case-fut-macro-zf-cpi-print`: Five-year note futures coiled into a hot CPI print
- `case-fut-macro-ali-smelter-supply`: Aluminum futures grind into a smelter-power outage
- `case-fut-macro-hrc-dump-no-reclaim`: Steel-coil futures dump as risk appetite fades, no reclaim
- `case-fut-macro-emd-evening-star`: Midcap futures evening star as risk appetite fades
- `case-fut-macro-6a-outside-bar`: Aussie-dollar futures print an outside bar that closes weak as risk appetite fades
- `case-fut-macro-ni-fail-break`: Nickel futures poke a range, then fail as risk appetite fades
- `case-fut-macro-6e-engulf`: Euro futures print a bearish engulfing as risk appetite fades
- `case-fut-macro-6s-shooting-star`: Swiss-franc futures print a shooting star as risk appetite fades
- `case-fut-macro-6m-dark-cloud`: Peso futures print a dark-cloud cover as risk appetite fades
- `case-fut-macro-6z-three-crows`: Rand futures print three black crows as risk appetite fades
- `case-fut-macro-6p-hanging-man`: Zloty futures print a hanging man as risk appetite fades
- `case-fut-macro-6t-harami`: Lira futures print a bearish harami as risk appetite fades
- `case-fut-macro-6w-marubozu`: Won futures print a bearish marubozu as risk appetite fades
- `case-fut-macro-dkk-gravestone`: Danish-krone futures print a gravestone doji as risk appetite fades
- `case-fut-macro-php-harami-cross`: Philippine-peso futures print a harami cross as risk appetite fades
- `case-fut-macro-huf-spinning-top`: Forint futures print a spinning top as risk appetite fades
- `case-fut-macro-ils-long-legged-doji`: Shekel futures print a long-legged doji as risk appetite fades
- `case-fut-macro-cnh-dragonfly`: Offshore-yuan futures print a dragonfly doji as risk appetite fades
- `case-fut-macro-thb-matching-high`: Thai-baht futures print a matching high as risk appetite fades
- `case-fut-macro-inr-belt-hold`: Indian-rupee futures print a bearish belt hold as risk appetite fades
- `case-fut-macro-ron-separating-lines`: Romanian-leu futures print bearish separating lines as risk appetite fades
- `case-fut-macro-isk-on-neck`: Icelandic-krona futures print a bearish on-neck as risk appetite fades
- `case-fut-macro-gel-in-neck`: Georgian-lari futures print a bearish in-neck as risk appetite fades
- `case-fut-macro-mad-thrusting`: Moroccan-dirham futures print a bearish thrusting line as risk appetite fades
- `case-fut-macro-aed-piercing`: UAE-dirham futures print a piercing line after a dump as risk appetite fades
- `case-fut-macro-int-zn-hot-cpi`: SAMPLE 10-year note future drops on a hot inflation print (intermediate)
- `case-fut-macro-int-gc-haven-already-held`: Risk-off deepens while you already hold SAMPLE gold (intermediate)
- `case-fut-macro-int-ng-outage-with-restart-date`: SAMPLE natural gas spikes on an outage that already has a restart date (intermediate)

</details>

<details><summary>Pack `forex` (41 cases)</summary>

- `case-fx-wrap-euro-trust-vs-index`: Currency wrapper: you wanted the dollar index, you bought a euro trust
- `case-fx-wrap-dollar-fund-carry`: Currency wrapper: the dollar fund's quiet year
- `case-fx-wrap-yen-trust-intervention`: Currency wrapper: yen trust after an intervention headline
- `case-fx-risk-on`: EUR/USD firm while risk appetite is positive
- `case-fx-data-print`: USD/JPY into a U.S. data print
- `case-fx-fade-spike`: Euro spikes on a thin rumor
- `case-fx-aud-risk-on`: AUD/USD firm in a risk-on brief
- `case-fx-gbp-print`: GBP/USD into a UK data print
- `case-fx-eurjpy-chase`: EUR/JPY already ran on thin chatter
- `case-fx-usd-jpy-risk-off`: USD/JPY sold as risk appetite fades
- `case-fx-eur-supply-energy`: EUR/USD wobbles on an energy-supply scare
- `case-fx-int-aud-print`: AUD/USD after a hot US print (intermediate)
- `case-fx-int-gbp-fade`: Sterling spike on a thin budget rumor (intermediate)
- `case-fx-int-eurjpy-risk`: EUR/JPY as a risk-on cross after a scare (intermediate)
- `case-fx-cad-headline`: USD/CAD after an official bank statement
- `case-fx-nzd-print-headline`: Kiwi print beats, dairy headline cuts
- `case-fx-chf-rumor-note`: Intervention rumor, then an official note
- `case-fx-int-eurgbp-headline`: EUR/GBP coil into an official fiscal statement (intermediate)
- `case-fx-int-nok-supply`: USD/NOK rolls as an oil-supply scare hits (intermediate)
- `case-fx-int-mxn-print-headline`: Peso remittance beat, trade-rule headline (intermediate)
- `case-fx-int-sgd-rumor-note`: Band-widen rumor, then a scheduled policy note (intermediate)
- `case-fx-zar-spread-hold`: Rand dump, wide-spread session note
- `case-fx-audnzd-supply`: AUD/NZD coiled into a dairy-supply scare
- `case-fx-cnh-gap-note`: Yuan weekend gap on a devaluation rumor
- `case-fx-gbpjpy-v-reclaim`: GBP/JPY flushes, then a milder official print
- `case-fx-eurchf-fail-rally`: EUR/CHF bounce fails under a ceiling
- `case-fx-inr-trend-pause`: USD/INR pauses into a US data print
- `case-fx-brl-double-bottom`: USD/BRL tests the same low twice into a fiscal vote
- `case-fx-krw-opening-drive`: USD/KRW opens with a wide drive on a shipping scare
- `case-fx-eursek-expand-range`: EUR/SEK range is getting wider, not cleaner
- `case-fx-thb-staircase`: USD/THB steps lower after a tourism statement
- `case-fx-twd-round-top`: USD/TWD rolls over after a foundry order statement
- `case-fx-php-doji-hold`: USD/PHP prints a cluster of indecision bars
- `case-fx-clp-outside-bar`: USD/CLP outside bar vs a strong copper print
- `case-fx-int-audjpy-flag`: AUD/JPY flags after an impulse into an AU print (intermediate)
- `case-fx-int-try-wedge`: USD/TRY rising wedge into chase chatter (intermediate)
- `case-fx-int-audcad-double`: AUD/CAD double top vs chase chatter (intermediate)
- `case-fx-int-euraud-inside`: EUR/AUD inside bar vs chase chatter into an AU print (intermediate)
- `case-fx-int-gbpnzd-three-push`: GBP/NZD three-push into a dairy scare already in the highs (intermediate)
- `case-fx-int-eurcad-falling-wedge`: EUR/CAD falling wedge after an oil scare already in the tape (intermediate)
- `case-fx-int-nzdjpy-head-shoulders`: NZD/JPY head-and-shoulders into a dairy scare already in the highs (intermediate)

</details>

<details><summary>Pack `forex-tape` (29 cases)</summary>

- `case-fx-tape-gbpcad-tweezer`: GBP/CAD tweezer top into a hike scare already in the highs
- `case-fx-tape-gbpchf-evening-star`: GBP/CHF evening star into an official Swiss bank statement
- `case-fx-tape-nzdchf-open-drive`: NZD/CHF opens with a wide drive after an official RBNZ statement
- `case-fx-tape-chfjpy-dump-no-reclaim`: CHF/JPY dumps on a hike scare, no reclaim
- `case-fx-tape-cadchf-inside-bar`: CAD/CHF inside bar into an official Bank of Canada note still ahead
- `case-fx-tape-gbpaud-outside-bar`: GBP/AUD outside bar that closes weak
- `case-fx-tape-nzdcad-fail-break`: NZD/CAD pokes a range, then fails
- `case-fx-tape-eurnzd-engulf`: EUR/NZD prints a bearish engulfing after a small green bar
- `case-fx-tape-gbpnok-shooting-star`: GBP/NOK prints a shooting star after a grind
- `case-fx-tape-nzdnok-dark-cloud`: NZD/NOK prints a dark-cloud cover after a grind
- `case-fx-tape-nzdsek-three-crows`: NZD/SEK prints three black crows after a grind
- `case-fx-tape-gbpsek-hanging-man`: GBP/SEK prints a hanging man after a grind
- `case-fx-tape-eurpln-harami`: EUR/PLN prints a bearish harami after a grind
- `case-fx-tape-eurczk-marubozu`: EUR/CZK prints a bearish marubozu after a grind
- `case-fx-tape-eurhuf-gravestone`: EUR/HUF prints a gravestone doji after a grind
- `case-fx-tape-gbphuf-harami-cross`: GBP/HUF prints a harami cross after a grind
- `case-fx-tape-eurron-spinning-top`: EUR/RON prints a spinning top after a grind
- `case-fx-tape-gbpron-long-legged-doji`: GBP/RON prints a long-legged doji after a grind
- `case-fx-tape-audron-dragonfly`: AUD/RON prints a dragonfly doji after a grind
- `case-fx-tape-audhuf-matching-high`: AUD/HUF prints a matching high after a grind
- `case-fx-tape-audczk-belt-hold`: AUD/CZK prints a bearish belt hold after a grind
- `case-fx-tape-nzdczk-separating-lines`: NZD/CZK prints bearish separating lines after a grind
- `case-fx-tape-eurdkk-on-neck`: EUR/DKK prints a bearish on-neck after a grind
- `case-fx-tape-gbpdkk-in-neck`: GBP/DKK prints a bearish in-neck after a grind
- `case-fx-tape-chfdkk-thrusting`: CHF/DKK prints a bearish thrusting line after a grind
- `case-fx-tape-gbpmxn-piercing`: GBP/MXN prints a piercing line after a dump
- `case-fx-tape-eurzar-engulf`: EUR/ZAR prints a bullish engulfing after a dump
- `case-fx-tape-int-usdjpy-verbal-warning`: SAMPLE USD/JPY at the highs as officials warn about excessive moves (intermediate)
- `case-fx-tape-int-gbpusd-failed-break`: SAMPLE GBP/USD breaks out on a thin headline, then closes back in the range (intermediate)

</details>

<details><summary>Pack `forex-macro` (29 cases)</summary>

- `case-fx-macro-cadjpy-harami`: CAD/JPY harami after a dump as risk appetite fades
- `case-fx-macro-audchf-jobs-print`: AUD/CHF coiled into a hot Australian jobs print
- `case-fx-macro-eurnok-oil-supply`: EUR/NOK grinds into an oil-supply scare
- `case-fx-macro-audsgd-dump-no-reclaim`: AUD/SGD dumps as risk appetite fades, no reclaim
- `case-fx-macro-nzdsgd-evening-star`: NZD/SGD evening star as risk appetite fades
- `case-fx-macro-eursgd-outside-bar`: EUR/SGD outside bar that closes weak as risk appetite fades
- `case-fx-macro-gbpsgd-fail-break`: GBP/SGD pokes a range, then fails as risk appetite fades
- `case-fx-macro-cadsgd-engulf`: CAD/SGD prints a bearish engulfing as risk appetite fades
- `case-fx-macro-audnok-shooting-star`: AUD/NOK prints a shooting star as risk appetite fades
- `case-fx-macro-cadnok-dark-cloud`: CAD/NOK prints a dark-cloud cover as risk appetite fades
- `case-fx-macro-audsek-three-crows`: AUD/SEK prints three black crows as risk appetite fades
- `case-fx-macro-cadsek-hanging-man`: CAD/SEK prints a hanging man as risk appetite fades
- `case-fx-macro-gbppln-harami`: GBP/PLN prints a bearish harami as risk appetite fades
- `case-fx-macro-gbpczk-marubozu`: GBP/CZK prints a bearish marubozu as risk appetite fades
- `case-fx-macro-audpln-gravestone`: AUD/PLN prints a gravestone doji as risk appetite fades
- `case-fx-macro-nzdhuf-harami-cross`: NZD/HUF prints a harami cross as risk appetite fades
- `case-fx-macro-cadron-spinning-top`: CAD/RON prints a spinning top as risk appetite fades
- `case-fx-macro-nzdron-long-legged-doji`: NZD/RON prints a long-legged doji as risk appetite fades
- `case-fx-macro-cadhuf-dragonfly`: CAD/HUF prints a dragonfly doji as risk appetite fades
- `case-fx-macro-nzdpln-matching-high`: NZD/PLN prints a matching high as risk appetite fades
- `case-fx-macro-cadczk-belt-hold`: CAD/CZK prints a bearish belt hold as risk appetite fades
- `case-fx-macro-cadpln-separating-lines`: CAD/PLN prints bearish separating lines as risk appetite fades
- `case-fx-macro-auddkk-on-neck`: AUD/DKK prints a bearish on-neck as risk appetite fades
- `case-fx-macro-nzddkk-in-neck`: NZD/DKK prints a bearish in-neck as risk appetite fades
- `case-fx-macro-caddkk-thrusting`: CAD/DKK prints a bearish thrusting line as risk appetite fades
- `case-fx-macro-audzar-piercing`: AUD/ZAR prints a piercing line after a dump as risk appetite fades
- `case-fx-macro-int-audusd-weak-china-pmi`: SAMPLE AUD/USD drops on a weak China factory survey (intermediate)
- `case-fx-macro-int-usdchf-haven-franc`: Risk-off lifts the franc while you hold SAMPLE USD/CHF (intermediate)
- `case-fx-macro-int-usdcad-oil-shock`: An oil supply shock pulls SAMPLE USD/CAD lower (intermediate)

</details>

<details><summary>Pack `crypto` (39 cases)</summary>

- `case-wrap-bitcoin-etp-weekend-gap`: Wrapper: bitcoin fell over the weekend; the ETP gaps Monday
- `case-crypto-chase-fade`: Bitcoin already extended on social hype
- `case-crypto-dump-reclaim`: Ether dumps, then buyers step in
- `case-crypto-chop-break`: Bitcoin breaks out of a range
- `case-crypto-sol-chase`: Solana-style coin already extended on hype
- `case-crypto-usdc-depeg-scare`: Stablecoin wobble, then a walk-back
- `case-crypto-btc-risk-off`: Bitcoin sold with risk appetite
- `case-crypto-eth-print`: Ether into a hot macro print
- `case-crypto-btc-supply-hack`: Exchange-hack headline on a coiled bitcoin tape
- `case-crypto-int-sol-fade`: Alt already ran into a nothing-catalyst (intermediate)
- `case-crypto-int-eth-reclaim`: Ether scare walked back after a dump (intermediate)
- `case-crypto-int-btc-print`: Bitcoin after a soft landing print (intermediate)
- `case-crypto-pow-grid`: Proof-of-work coin into a mining-grid scare
- `case-crypto-l2-unlock-headline`: Unlock print is light, then a foundation dump headline
- `case-crypto-bridge-rumor-note`: Bridge-drain rumor, then a scheduled official note
- `case-crypto-int-alt-risk-off`: High-beta alt bounce into a risk-off tape (intermediate)
- `case-crypto-int-pos-grid`: Proof-of-stake already dumped into a mining-grid scare (intermediate)
- `case-crypto-int-stake-print-exit`: Staking-yield print beats, then a validator-exit headline (intermediate)
- `case-crypto-int-list-rumor-note`: Listing-chat run, then a scheduled exchange note (intermediate)
- `case-crypto-dex-weekend-gap`: DEX token gaps down on a thin weekend book
- `case-crypto-nft-round-top`: NFT marketplace token rounds over after a volume note
- `case-crypto-priv-fail-break`: Privacy coin pokes a range, then fails
- `case-crypto-oracle-staircase`: Oracle token steps higher on a feed-outage scare
- `case-crypto-dao-expand-range`: DAO token range is getting wider, not cleaner
- `case-crypto-rstk-open-drive`: Restaking token opens with a wide drive after a TVL note
- `case-crypto-perp-double-bottom`: Perp-DEX token tests the same low twice after a fee scare
- `case-crypto-ai-outside-bar`: AI-agent token prints an outside bar that closes weak
- `case-crypto-rwa-doji-hold`: RWA token prints a doji on mixed risk-off chatter
- `case-crypto-game-inside-bar`: Gaming token prints an inside bar into a season drop
- `case-crypto-stor-dump-no-reclaim`: DePIN storage token dumps on a capacity scare, no reclaim
- `case-crypto-int-meme-flag`: Meme coin flags after influencer chase already in the price (intermediate)
- `case-crypto-int-gpu-wedge`: GPU-render token rising wedge after a compute scare already in the price (intermediate)
- `case-crypto-int-did-vreclaim`: Identity token V-reclaim after a walked-back risk-off scare (intermediate)
- `case-crypto-int-lend-round`: Lending token rounds over after a TVL scare already in the highs (intermediate)
- `case-crypto-ins-double-top`: Insurance token tags the same high twice into chase chatter
- `case-crypto-int-name-three-push`: Naming-service token three-push into a registrar scare already in the highs (intermediate)
- `case-crypto-cdn-falling-wedge`: CDN token falling wedge after a peering scare already in the tape
- `case-crypto-int-pred-head-shoulders`: Prediction-market token head-and-shoulders into a venue-fee scare already in the highs (intermediate)
- `case-crypto-int-royl-head-shoulders`: Royalty token head-and-shoulders into a catalog-license scare already in the highs (intermediate)

</details>

<details><summary>Pack `crypto-tape` (29 cases)</summary>

- `case-crypto-tape-orbt-tweezer`: Orbital-data token tweezer top into a launch-window scare already in the highs
- `case-crypto-tape-mesh-evening-star`: Mesh-network token evening star into an official treasury note
- `case-crypto-tape-cust-open-drive`: Custody token opens with a wide drive after an official foundation statement
- `case-crypto-tape-band-dump-no-reclaim`: Bandwidth token dumps on a spectrum scare, no reclaim
- `case-crypto-tape-relay-inside-bar`: MEV-relay token inside bar into an official operator note still ahead
- `case-crypto-tape-farm-outside-bar`: Yield-farm token prints an outside bar that closes weak
- `case-crypto-tape-blob-fail-break`: Data-availability blob token pokes a range, then fails
- `case-crypto-tape-vault-engulf`: Vault token prints a bearish engulfing after a small green bar
- `case-crypto-tape-gate-shooting-star`: Gate token prints a shooting star after a grind
- `case-crypto-tape-dock-dark-cloud`: Dock token prints a dark-cloud cover after a grind
- `case-crypto-tape-node-three-crows`: Node token prints three black crows after a grind
- `case-crypto-tape-slot-hanging-man`: Slot token prints a hanging man after a grind
- `case-crypto-tape-epoch-harami`: Epoch token prints a bearish harami after a grind
- `case-crypto-tape-nonce-marubozu`: Nonce token prints a bearish marubozu after a grind
- `case-crypto-tape-goss-gravestone`: Gossip token prints a gravestone doji after a grind
- `case-crypto-tape-witness-harami-cross`: Witness token prints a harami cross after a grind
- `case-crypto-tape-commit-spinning-top`: Commit token prints a spinning top after a grind
- `case-crypto-tape-hint-long-legged-doji`: Hint token prints a long-legged doji after a grind
- `case-crypto-tape-batch-dragonfly`: Batch token prints a dragonfly doji after a grind
- `case-crypto-tape-quill-matching-high`: Quill token prints a matching high after a grind
- `case-crypto-tape-sigil-belt-hold`: Sigil token prints a bearish belt hold after a grind
- `case-crypto-tape-glyph-separating-lines`: Glyph token prints bearish separating lines after a grind
- `case-crypto-tape-cipher-on-neck`: Cipher token prints a bearish on-neck after a grind
- `case-crypto-tape-scroll-in-neck`: Scroll token prints a bearish in-neck after a grind
- `case-crypto-tape-rune-thrusting`: Rune token prints a bearish thrusting line after a grind
- `case-crypto-tape-prism-piercing`: Prism token prints a piercing line after a dump
- `case-crypto-tape-bevel-engulf`: Bevel token prints a bullish engulfing after a dump
- `case-crypto-tape-int-eth-upgrade-date`: SAMPLE ether ran up into an upgrade date that was already known (intermediate)
- `case-crypto-tape-int-btc-liquidation-spike`: SAMPLE bitcoin squeezes on liquidations, then stalls (intermediate)

</details>

<details><summary>Pack `crypto-macro` (29 cases)</summary>

- `case-crypto-macro-carb-harami`: Carbon-credit token harami after a dump as risk appetite fades
- `case-crypto-macro-rent-cpi-print`: Compute-rental token coiled into a hot CPI print
- `case-crypto-macro-lith-brine-supply`: Lithium token grinds into a brine-pond freeze
- `case-crypto-macro-hive-dump-no-reclaim`: Social token dumps as risk appetite fades, no reclaim
- `case-crypto-macro-pool-evening-star`: Liquidity-pool token evening star as risk appetite fades
- `case-crypto-macro-wrap-outside-bar`: Wrapped-asset token prints an outside bar that closes weak as risk appetite fades
- `case-crypto-macro-seq-fail-break`: Sequencer token pokes a range, then fails as risk appetite fades
- `case-crypto-macro-keeper-engulf`: Keeper token prints a bearish engulfing as risk appetite fades
- `case-crypto-macro-attest-shooting-star`: Attest token prints a shooting star as risk appetite fades
- `case-crypto-macro-lane-dark-cloud`: Lane token prints a dark-cloud cover as risk appetite fades
- `case-crypto-macro-peer-three-crows`: Peer token prints three black crows as risk appetite fades
- `case-crypto-macro-quorum-hanging-man`: Quorum token prints a hanging man as risk appetite fades
- `case-crypto-macro-shard-harami`: Shard token prints a bearish harami as risk appetite fades
- `case-crypto-macro-prover-marubozu`: Prover token prints a bearish marubozu as risk appetite fades
- `case-crypto-macro-bundle-gravestone`: Bundle token prints a gravestone doji as risk appetite fades
- `case-crypto-macro-merkle-harami-cross`: Merkle token prints a harami cross as risk appetite fades
- `case-crypto-macro-reveal-spinning-top`: Reveal token prints a spinning top as risk appetite fades
- `case-crypto-macro-seal-long-legged-doji`: Seal token prints a long-legged doji as risk appetite fades
- `case-crypto-macro-ink-dragonfly`: Ink token prints a dragonfly doji as risk appetite fades
- `case-crypto-macro-wax-matching-high`: Wax token prints a matching high as risk appetite fades
- `case-crypto-macro-forge-belt-hold`: Forge token prints a bearish belt hold as risk appetite fades
- `case-crypto-macro-crest-separating-lines`: Crest token prints bearish separating lines as risk appetite fades
- `case-crypto-macro-tome-on-neck`: Tome token prints a bearish on-neck as risk appetite fades
- `case-crypto-macro-codex-in-neck`: Codex token prints a bearish in-neck as risk appetite fades
- `case-crypto-macro-ward-thrusting`: Ward token prints a bearish thrusting line as risk appetite fades
- `case-crypto-macro-lens-piercing`: Lens token prints a piercing line after a dump as risk appetite fades
- `case-crypto-macro-int-btc-soft-cpi-break`: A soft SIMULATED inflation print lifts SAMPLE bitcoin above its range (intermediate)
- `case-crypto-macro-int-sol-high-beta-risk-off`: Risk-off hits high-beta SAMPLE SOL harder than bitcoin (intermediate)
- `case-crypto-macro-int-btc-mining-curtailment`: A mining-region power curtailment shakes SAMPLE bitcoin (intermediate)

</details>

<details><summary>Pack `options-context` (42 cases)</summary>

- `case-wheel-flat-keep-wheeling`: Wheel: the put expired in a sideways month
- `case-wheel-rip-past-call-strike`: Wheel: the stock rips past your covered call strike
- `case-wheel-crash-after-assignment`: Wheel: assigned, then guidance is cut (intermediate)
- `case-wheel-put-through-earnings`: Wheel: a short put going into earnings (intermediate)
- `case-optctx-into-event`: Stock coiled going into a known event
- `case-optctx-vol-spike`: After a high-volatility session
- `case-optctx-event-coil-small`: Small-name coiled into a known event
- `case-optctx-after-gap`: After the event gap, the stock settles
- `case-optctx-vol-fail`: High-volatility session, then a failed bounce
- `case-optctx-headline-into-event`: Headline hits while the stock is coiled for an event
- `case-optctx-int-settle-fade`: Rich gap, thin new fact, settlement fade (intermediate)
- `case-optctx-int-coil-hold`: Coiled event, no edge on direction (intermediate)
- `case-optctx-int-vol-chop`: After the spike, implied fear vs a calm stock (intermediate)
- `case-optctx-print-coil`: Utility coiled into a scheduled inflation print
- `case-optctx-strait-supply`: Importer coiled into a shipping-lane scare
- `case-optctx-print-vs-headline`: Event already printed, then a product headline
- `case-optctx-rumor-note`: Event-cancel rumor, then a scheduled official note
- `case-optctx-int-jobs-run`: Homebuilder already ran into a jobs print (intermediate)
- `case-optctx-int-producer-supply`: Energy producer already dumped into a supply scare (intermediate)
- `case-optctx-int-print-vs-cut`: Event print beats, then a contract-cut headline (intermediate)
- `case-optctx-int-rumor-deny`: Takeover-chat run, then a scheduled official denial (intermediate)
- `case-optctx-fail-break`: Failed breakout on the underlying before an event
- `case-optctx-round-top`: Round-top on the underlying into a known event
- `case-optctx-staircase`: Staircase of lower closes into a known event
- `case-optctx-expand-range`: Range on the underlying is getting wider into an event
- `case-optctx-open-drive`: Opening drive on the underlying after an overnight event
- `case-optctx-double-bottom`: Double bottom on the underlying into a known event
- `case-optctx-outside-bar`: Outside bar on the underlying into a known event
- `case-optctx-doji-hold`: Doji on the underlying into a known event
- `case-optctx-dump-no-reclaim`: Dump on the underlying after the event, no reclaim
- `case-optctx-inside-bar`: Inside bar on the underlying into a known event
- `case-optctx-flag-hold`: Flag on the underlying into a known event
- `case-optctx-wedge-fade`: Rising wedge on the underlying into a known event
- `case-optctx-int-hotel-flag`: Hotel underlying flags after the event move is already in (intermediate)
- `case-optctx-int-casino-wedge`: Casino underlying rising wedge after the event move is already in (intermediate)
- `case-optctx-int-pay-vreclaim`: Payments underlying V-reclaim after a walked-back risk-off scare (intermediate)
- `case-optctx-int-stream-round`: Streaming underlying rounds over after the event move is already in (intermediate)
- `case-optctx-airl-double-top`: Airline underlying tags the same high twice into chase chatter
- `case-optctx-int-bio-three-push`: Biotech underlying three-push after the event move is already in (intermediate)
- `case-optctx-groc-falling-wedge`: Grocery underlying falling wedge after a trucking scare already in the tape
- `case-optctx-int-solar-head-shoulders`: Solar installer head-and-shoulders after the rebate move is already in (intermediate)
- `case-optctx-int-towr-head-shoulders`: Tower underlying head-and-shoulders after the spectrum print is already in (intermediate)

</details>

<details><summary>Pack `options-tape` (29 cases)</summary>

- `case-optctx-tape-rail-tweezer`: Railroad tweezer top after the merger print is already in
- `case-optctx-tape-cemt-evening-star`: Cement evening star into an official quarry-permit note
- `case-optctx-tape-port-open-drive`: Port operator opens with a wide drive after an official harbor statement
- `case-optctx-tape-brew-dump-no-reclaim`: Beverage dump on a tax scare, no reclaim
- `case-optctx-tape-lime-inside-bar`: Lime kiln inside bar into an official air-permit note still ahead
- `case-optctx-tape-glss-outside-bar`: Glass-container maker prints an outside bar that closes weak
- `case-optctx-tape-tank-fail-break`: Tank-farm operator pokes a range, then fails
- `case-optctx-tape-roof-engulf`: Roofing maker prints a bearish engulfing after a small green bar
- `case-optctx-tape-tile-shooting-star`: Tile kiln prints a shooting star after a grind
- `case-optctx-tape-pipe-dark-cloud`: Pipe mill prints a dark-cloud cover after a grind
- `case-optctx-tape-sand-three-crows`: Sand quarry prints three black crows after a grind
- `case-optctx-tape-grout-hanging-man`: Grout mill prints a hanging man after a grind
- `case-optctx-tape-stucco-harami`: Stucco mill prints a bearish harami after a grind
- `case-optctx-tape-joist-marubozu`: Joist mill prints a bearish marubozu after a grind
- `case-optctx-tape-purlin-gravestone`: Purlin mill prints a gravestone doji after a grind
- `case-optctx-tape-truss-harami-cross`: Truss mill prints a harami cross after a grind
- `case-optctx-tape-ridge-spinning-top`: Ridge mill prints a spinning top after a grind
- `case-optctx-tape-eave-long-legged-doji`: Eave mill prints a long-legged doji after a grind
- `case-optctx-tape-flash-dragonfly`: Flash mill prints a dragonfly doji after a grind
- `case-optctx-tape-dormer-matching-high`: Dormer mill prints a matching high after a grind
- `case-optctx-tape-gutter-belt-hold`: Gutter mill prints a bearish belt hold after a grind
- `case-optctx-tape-stud-separating-lines`: Stud mill prints bearish separating lines after a grind
- `case-optctx-tape-jamb-on-neck`: Jamb mill prints a bearish on-neck after a grind
- `case-optctx-tape-newel-in-neck`: Newel mill prints a bearish in-neck after a grind
- `case-optctx-tape-spandrel-thrusting`: Spandrel mill prints a bearish thrusting line after a grind
- `case-optctx-tape-shingle-piercing`: Shingle mill prints a piercing line after a dump
- `case-optctx-tape-corbel-engulf`: Corbel mill prints a bullish engulfing after a dump
- `case-optctx-tape-int-biotech-readout-date`: SAMPLE biotech coils as the trial readout date is confirmed (intermediate)
- `case-optctx-tape-int-retailer-upgrade-gap`: SAMPLE retailer gaps up on an upgrade, then the next bar turns red (intermediate)

</details>

<details><summary>Pack `options-macro` (29 cases)</summary>

- `case-optctx-macro-wste-harami`: Waste-hauler harami after a dump as risk appetite fades
- `case-optctx-macro-deal-cpi-print`: Auto dealer coiled into a hot CPI print
- `case-optctx-macro-fert-potash-supply`: Fertilizer grind into a potash-export freeze
- `case-optctx-macro-staff-dump-no-reclaim`: Staffing dump as risk appetite fades, no reclaim
- `case-optctx-macro-mill-evening-star`: Paper mill evening star as risk appetite fades
- `case-optctx-macro-salt-outside-bar`: Salt miner prints an outside bar that closes weak as risk appetite fades
- `case-optctx-macro-asph-fail-break`: Asphalt paver pokes a range, then fails as risk appetite fades
- `case-optctx-macro-brck-engulf`: Brick kiln prints a bearish engulfing as risk appetite fades
- `case-optctx-macro-gyps-shooting-star`: Gypsum board prints a shooting star as risk appetite fades
- `case-optctx-macro-slab-dark-cloud`: Concrete slab prints a dark-cloud cover as risk appetite fades
- `case-optctx-macro-clay-three-crows`: Clay pit prints three black crows as risk appetite fades
- `case-optctx-macro-rebar-hanging-man`: Rebar mill prints a hanging man as risk appetite fades
- `case-optctx-macro-cable-harami`: Cable mill prints a bearish harami as risk appetite fades
- `case-optctx-macro-lintel-marubozu`: Lintel mill prints a bearish marubozu as risk appetite fades
- `case-optctx-macro-soffit-gravestone`: Soffit mill prints a gravestone doji as risk appetite fades
- `case-optctx-macro-fascia-harami-cross`: Fascia mill prints a harami cross as risk appetite fades
- `case-optctx-macro-gable-spinning-top`: Gable mill prints a spinning top as risk appetite fades
- `case-optctx-macro-hip-long-legged-doji`: Hip mill prints a long-legged doji as risk appetite fades
- `case-optctx-macro-sill-dragonfly`: Sill mill prints a dragonfly doji as risk appetite fades
- `case-optctx-macro-rafter-matching-high`: Rafter mill prints a matching high as risk appetite fades
- `case-optctx-macro-mullion-belt-hold`: Mullion mill prints a bearish belt hold as risk appetite fades
- `case-optctx-macro-sash-separating-lines`: Sash mill prints bearish separating lines as risk appetite fades
- `case-optctx-macro-lath-on-neck`: Lath mill prints a bearish on-neck as risk appetite fades
- `case-optctx-macro-baluster-in-neck`: Baluster mill prints a bearish in-neck as risk appetite fades
- `case-optctx-macro-transom-thrusting`: Transom mill prints a bearish thrusting line as risk appetite fades
- `case-optctx-macro-casement-piercing`: Casement mill prints a piercing line after a dump as risk appetite fades
- `case-optctx-macro-int-homebuilder-hot-jobs`: A hot SIMULATED jobs print drags a SAMPLE homebuilder (intermediate)
- `case-optctx-macro-int-utility-holds-risk-off`: A SAMPLE utility holds up while the market sells off (intermediate)
- `case-optctx-macro-int-airline-fuel-shock`: An oil supply shock meets a SAMPLE airline that just bounced (intermediate)

</details>

### Coach sessions

Hub `/coach` (`src/pages/Coach.tsx`), each session at `/coach/<slug>`. 99 sessions. The hub filters by market class (default `equity`, change with `?class=`) and topic (`?topic=`), so only 31 show on a plain `/coach` visit; the ToC Deep Study `#coach` panel lists all 99.

| slug | Title | Topic | Home class | On plain `/coach` |
|---|---|---|---|---|
| `agriculture-wrappers` | Crops, fertilizer and tractors | Market themes | future | no |
| `bitcoin-wrappers` | Bitcoin: coin, ETP, futures or miners | Market themes | crypto | no |
| `bonds-duration` | Duration before yield | Market themes | equity | no |
| `breakout-pullback-fvg` | Buy the pullback, not the breakout | Trade management | equity | yes |
| `candle-needs-context` | One candle is not a signal | Chart skills | equity | yes |
| `chart-soft-gate` | Why Indicators come before cases | Chart fluency | equity | yes |
| `chase-vs-fade` | Chase vs fade a company headline | Company news decisions | equity | yes |
| `chasing-a-squeeze` | Chasing a squeeze | Options risk | option_context | no |
| `combined-decisions` | Headline plus snapshot | Combined decisions | equity | yes |
| `cpi-morning` | CPI morning: preview, print, yields, your stock | Macro releases | equity | yes |
| `crypto-btc-risk-off` | Bitcoin versus a SAMPLE risk-off tape | Multi-market decisions | crypto | no |
| `crypto-chase` | Chase vs fade SAMPLE crypto hype | Multi-market decisions | crypto | no |
| `crypto-combined` | Print plus headline on SAMPLE crypto | Multi-market decisions | crypto | no |
| `crypto-cpi-print` | Map a SAMPLE CPI print to bitcoin | Multi-market decisions | crypto | no |
| `crypto-depeg-scare` | SAMPLE stable depeg scare | Multi-market decisions | crypto | no |
| `crypto-dump-no-reclaim` | Dump with no reclaim on SAMPLE crypto | Multi-market decisions | crypto | no |
| `crypto-hack-supply` | Hack scare on SAMPLE crypto | Multi-market decisions | crypto | no |
| `crypto-listing-headline` | Listing headline on SAMPLE crypto | Multi-market decisions | crypto | no |
| `crypto-literacy` | Name SAMPLE crypto building blocks | Multi-market decisions | crypto | no |
| `crypto-rumor-vs-listing` | Rumor versus official crypto notice | Multi-market decisions | crypto | no |
| `crypto-sol-alt-hype` | Alt hype versus SAMPLE bitcoin | Multi-market decisions | crypto | no |
| `crypto-weekend-gap` | Weekend gap on SAMPLE crypto | Multi-market decisions | crypto | no |
| `currency-funds-dollar` | Dollar view, which wrapper | Market themes | forex | no |
| `earnings-beat-miss` | Beat vs miss on a SAMPLE report | Earnings decisions | equity | yes |
| `earnings-debt` | Profit on a thin equity cushion | Financial statements | equity | yes |
| `earnings-guidance` | When the outlook is cut | Earnings decisions | equity | yes |
| `earnings-insiders-tour` | Whose date, whose trade? | Tool training | equity | no |
| `earnings-margins` | Revenue up, margin down | Earnings decisions | equity | yes |
| `earnings-week` | Earnings week: preview, print, reaction | Earnings decisions | equity | yes |
| `energy-wrappers` | Oil and gas, which wrapper | Market themes | future | no |
| `equities-literacy` | Name the equity building blocks | Equities vocabulary | equity | yes |
| `exposure-wrappers` | Same theme, three wrappers | Market themes | future | yes |
| `finviz-tour` | Screen with Finviz, then check | Tool training | equity | no |
| `first-paper-trade` | Your first paper trade | Trade management | equity | yes |
| `forex-boj-print` | Map a SAMPLE BOJ print | Multi-market decisions | forex | no |
| `forex-cb-headline` | Central-bank headline on SAMPLE FX | Multi-market decisions | forex | no |
| `forex-chase-fade` | Chase vs fade a SAMPLE FX spike | Headline decisions | forex | no |
| `forex-chase-spike` | Chase vs wait a SAMPLE FX spike | Multi-market decisions | forex | no |
| `forex-combined` | Print plus headline on SAMPLE FX | Multi-market decisions | forex | no |
| `forex-energy-eur` | Energy shock on SAMPLE EUR | Multi-market decisions | forex | no |
| `forex-framing` | Frame a SAMPLE forex decision | Multi-market decisions | forex | no |
| `forex-jpy-dump` | JPY dump versus risk-on AUD | Multi-market decisions | forex | no |
| `forex-literacy` | Name SAMPLE forex building blocks | Multi-market decisions | forex | no |
| `forex-majors-vs-crosses` | Majors versus crosses on SAMPLE FX | Multi-market decisions | forex | no |
| `forex-nfp-print` | Map a SAMPLE jobs print on FX | Multi-market decisions | forex | no |
| `forex-rumor-vs-print` | Rumor versus official FX print | Multi-market decisions | forex | no |
| `forex-spread-hold` | When HOLD is the FX answer | Multi-market decisions | forex | no |
| `four-pillars` | Map, confirm, invalidate, size | Trade management | equity | yes |
| `futures-combined` | Print plus headline on SAMPLE futures | Multi-market decisions | future | no |
| `futures-crude-supply` | Supply shock on SAMPLE crude | Multi-market decisions | future | no |
| `futures-fomc-print` | Map a SAMPLE FOMC print to ES | Multi-market decisions | future | no |
| `futures-framing` | Frame a SAMPLE futures decision | Multi-market decisions | future | no |
| `futures-gold-haven` | Gold as a SAMPLE haven, not ES | Multi-market decisions | future | no |
| `futures-index-risk-off` | Index future versus a scared tape | Multi-market decisions | future | no |
| `futures-literacy` | Name SAMPLE futures building blocks | Multi-market decisions | future | no |
| `futures-nq-chase` | Chase vs fade a SAMPLE NQ spike | Multi-market decisions | future | no |
| `futures-roll` | Contango, backwardation, and the roll | Multi-market decisions | future | no |
| `futures-rumor-vs-print` | Rumor versus a scheduled futures print | Multi-market decisions | future | no |
| `futures-short-vs-sell` | Short versus sell on SAMPLE futures | Multi-market decisions | future | no |
| `futures-weather-ag` | Weather on a SAMPLE grain future | Multi-market decisions | future | no |
| `honor-the-stop` | Honor the stop | Trade management | equity | yes |
| `index-style-blocks` | What your index fund really holds | Market themes | equity | yes |
| `industrial-metals-wrappers` | Copper, uranium and the transition | Market themes | future | no |
| `macro-print` | Map a SAMPLE data print | Market-wide news | equity | yes |
| `macro-risk-off` | Stock versus a scared tape | Market-wide news | equity | yes |
| `market-forces-tour` | Tour Market Forces | Tool training | equity | no |
| `materials-resins` | Resin makers and the spread | Market themes | equity | no |
| `news-day-decision` | A news-day decision | News & biases | option_context | no |
| `news-literacy` | Rumor, filing, and priced-in | News literacy | equity | yes |
| `opening-range-breakout` | Trade the opening range | Trade management | equity | yes |
| `options-combined-stock` | Filing plus headline, still no chain | Options context | option_context | no |
| `options-context-event` | Event risk without an options chain | Options context | option_context | yes |
| `options-earnings-no-chain` | Earnings on the stock, no chain | Options context | option_context | no |
| `options-failed-breakout` | Failed breakout on the underlying | Options context | option_context | no |
| `options-horizon-mismatch` | Match the clock on event context | Options context | option_context | no |
| `options-literacy` | Name options-context building blocks | Options context | option_context | no |
| `options-post-event` | After the event, still no chain | Options context | option_context | no |
| `options-pre-event-chase` | Do not chase the pre-event coil | Options context | option_context | no |
| `options-risk-off-stock` | Risk-off on the stock, no puts | Options context | option_context | no |
| `options-rumor-vs-event` | Rumor versus a scheduled event, no chain | Options context | option_context | no |
| `options-underlying-headline` | Headline on the stock, no chain | Options context | option_context | no |
| `options-vol-spike` | Vol spike on the stock, no chain | Options context | option_context | no |
| `precious-metals-wrappers` | Gold view, which wrapper | Market themes | future | no |
| `read-a-backtest` | Read a too-good backtest | Risk | equity | yes |
| `rsi-vs-trend` | Oversold is not a buy signal | Chart fluency | equity | yes |
| `sec-edgar-tour` | Check it on EDGAR | Tool training | equity | no |
| `sectors-cycle` | Sector funds and the cycle | Market themes | equity | yes |
| `short-vs-sell` | Short versus sell | Company news decisions | equity | yes |
| `statement-snapshot` | Read a SAMPLE company snapshot | Financial statements | equity | yes |
| `stockanalysis-tour` | Read StockAnalysis with dates | Tool training | equity | no |
| `supply-demand-zone-retest` | Fresh zone or tested zone? | Chart skills | equity | yes |
| `supply-shock` | Who benefits from a supply shock | Market-wide news | equity | yes |
| `tool-capstone-bank` | A bank, five tools | Tool training | equity | no |
| `tool-capstone-research` | One ticker, four tools | Tool training | equity | no |
| `trade-plan-before-entry` | Plan the trade before you click | Trade management | equity | yes |
| `trailing-stop-exit` | Trail the stop, plan the exit | Trade management | equity | yes |
| `vix-futures-curve` | Right forecast, losing trade | Risk | future | no |
| `wheel-strategy` | Run the wheel without bag-holding | Options context | option_context | no |
| `yahoo-finance-tour` | Read Yahoo Finance labels | Tool training | equity | no |

### Playbooks

Hub `/playbooks` (`src/pages/Playbooks.tsx`), each at `/playbooks/<id>`; also listed in the ToC `#playbooks` panel. Source: `PLAYBOOKS` in `src/lib/playbooks.ts`.

| id | Title | Market | Coach session |
|---|---|---|---|
| `orb-context-confirmation` | Opening range: context and confirmation | equity | `/coach/opening-range-breakout` |
| `gap-and-go` | Gap and go | equity | `/coach/chase-vs-fade` |
| `vwap-hold` | Hold above the average | equity | `/coach/chart-soft-gate` |
| `sma-swing-bias` | Swing bias from the long average | equity | `/coach/equities-literacy` |
| `ema-reclaim` | Reclaim the short average | equity | `/coach/chase-vs-fade` |
| `covered-call` | Covered call on shares you own | option_context | `/coach/options-literacy` |
| `cash-secured-put` | Cash-secured put to buy lower | option_context | `/coach/options-literacy` |
| `protective-put` | Protective put before a known event | option_context | `/coach/options-context-event` |
| `dollar-cost-averaging` | Dollar-cost averaging on a schedule | equity | `/coach/trade-plan-before-entry` |
| `rebalance-to-target` | Rebalance back to your target mix | equity | `/coach/equities-literacy` |
| `stop-vs-stop-limit` | Stop versus stop-limit on a gap | equity | `/coach/trailing-stop-exit` |
| `short-with-buy-stop` | Short sale with a buy stop above | equity | `/coach/short-vs-sell` |
| `futures-roll` | Offset, roll, or go to settlement | future | `/coach/futures-roll` |
| `price-action-four-pillars` | Price action in four pillars | equity | `/coach/four-pillars` |
| `breakout-pullback-fvg` | Breakout, pullback and fair value gap | equity | `/coach/breakout-pullback-fvg` |
| `etf-north-star-vrp` | Risk-premium ETF mix with a VIX overlay | equity | `/coach/read-a-backtest` |
| `vix-curve-carry-paper` | VIX futures curve and carry (paper trade first) | future | `/coach/vix-futures-curve` |
| `wheel-csp-to-covered-call` | The wheel: cash-secured puts to covered calls | option_context | `/coach/wheel-strategy` |
| `treasury-bond-ladder` | A Treasury ladder for a known need | equity | `/coach/bonds-duration` |
| `business-cycle-sector-tilt` | Business-cycle sector tilt, kept small | equity | `/coach/sectors-cycle` |

### Macro

Hub `/macro` (`src/pages/macro/MacroDesk.tsx`) lists all 18 lessons by family, each at `/macro/<lessonId>`. The reaction game `/macro/play` has 29 rounds (`?round=<id>`). Macro glossary terms (50) live in the Library literacy tab.

| Lesson | Title | Family | Quiz group |
|---|---|---|---|
| `/macro/employment-situation` | The jobs report (Employment Situation) | Jobs & labor | `macro-releases` |
| `/macro/jobless-claims` | Weekly jobless claims | Jobs & labor | `macro-releases` |
| `/macro/jolts` | Job openings and quits (JOLTS) | Jobs & labor | `macro-releases` |
| `/macro/cpi` | Consumer prices (CPI) | Inflation | `macro-releases` |
| `/macro/ppi` | Producer prices (PPI) | Inflation | `macro-releases` |
| `/macro/pce` | PCE inflation (the Fed's gauge) | Inflation | `macro-releases` |
| `/macro/gdp` | GDP | Growth & spending | `macro-releases` |
| `/macro/retail-sales` | Retail sales | Growth & spending | `macro-releases` |
| `/macro/ism-pmi` | Purchasing managers' surveys (ISM) | Growth & spending | `macro-releases` |
| `/macro/consumer-sentiment` | Consumer sentiment | Growth & spending | `macro-releases` |
| `/macro/fomc-decision` | The Fed decision and statement | The Fed | `fed-policy` |
| `/macro/dot-plot` | Projections and the dot plot | The Fed | `fed-policy` |
| `/macro/fed-funds-rate` | The federal funds rate | The Fed | `fed-policy` |
| `/macro/treasury-curve` | Treasury yields and the yield curve | Rates & the dollar | `rates-curve` |
| `/macro/real-yields-breakevens` | Real yields and breakeven inflation | Rates & the dollar | `rates-curve` |
| `/macro/dollar` | The dollar | Rates & the dollar | `rates-curve` |
| `/macro/mortgage-rates` | Mortgage rates | Housing & mortgages | `housing-mortgage` |
| `/macro/housing-starts` | Housing starts and permits | Housing & mortgages | `housing-mortgage` |

<details><summary>Macro game rounds (29)</summary>

`round-payrolls-01`, `round-payrolls-02`, `round-payrolls-03`, `round-payrolls-04`, `round-payrolls-05`, `round-payrolls-06`, `round-payrolls-07`, `round-payrolls-08`, `round-claims-11`, `round-jolts-12`, `round-cpi-14`, `round-cpi-15`, `round-cpi-16`, `round-cpi-17`, `round-cpi-18`, `round-cpi-19`, `round-ppi-21`, `round-pce-22`, `round-gdp-25`, `round-retail-27`, `round-ism-mfg-28`, `round-ism-services-31`, `round-housing-starts-34`, `round-pmms-36`, `round-fomc-38`, `round-fomc-40`, `round-fomc-41`, `round-fomc-42`, `round-fomc-43`

</details>

### Library (`/archive`)

Tabs: patterns (default), indicators, literacy. Open one item with `?tab=<tab>&open=<id>`; filters `?crypto=works|adapted|rare` and `?theme=<pattern theme>`. Non-equity glossary terms follow the market browse gate (with a temporary bypass).

<details><summary>Patterns (158): `/archive?tab=patterns&open=<id>`</summary>

`doji`, `hammer`, `engulfing`, `bullish-engulfing`, `bearish-engulfing`, `shooting-star`, `inverted-hammer`, `head-shoulders`, `falling-wedge`, `morning-star`, `hanging-man`, `evening-star`, `piercing-line`, `dark-cloud-cover`, `three-white-soldiers`, `three-black-crows`, `harami`, `tweezer-top`, `tweezer-bottom`, `rising-wedge`, `bull-flag`, `double-top`, `double-bottom`, `white-marubozu`, `black-marubozu`, `spinning-top`, `bearish-harami`, `three-inside-up`, `three-inside-down`, `three-outside-up`, `three-outside-down`, `on-neck`, `bullish-counterattack`, `bearish-counterattack`, `rising-three-methods`, `falling-three-methods`, `mat-hold`, `upside-tasuki-gap`, `downside-tasuki-gap`, `triangle`, `long-green-candle`, `long-red-candle`, `short-green-candle`, `short-red-candle`, `bullish-closing-marubozu`, `bearish-closing-marubozu`, `bullish-opening-marubozu`, `bearish-opening-marubozu`, `long-legged-doji`, `cross-doji`, `inverted-cross-doji`, `dragonfly-doji`, `gravestone-doji`, `bullish-kicker`, `bearish-kicker`, `bullish-abandoned-baby`, `bearish-abandoned-baby`, `bullish-tri-star`, `bearish-tri-star`, `two-crows`, `upside-gap-two-crows`, `bullish-three-line-strike`, `bearish-three-line-strike`, `bullish-breakaway`, `bearish-breakaway`, `bullish-separating-lines`, `bearish-separating-lines`, `bullish-side-by-side-white-lines`, `bearish-side-by-side-white-lines`, `in-neck`, `thrusting`, `upside-gap-three-methods`, `downside-gap-three-methods`, `bearish-mat-hold`, `inverse-head-shoulders`, `supply-zone`, `demand-zone`, `bullish-harami-cross`, `bearish-harami-cross`, `morning-doji-star`, `evening-doji-star`, `high-wave`, `rickshaw-man`, `double-doji`, `tweezer-star`, `stick-sandwich`, `homing-pigeon`, `ladder-bottom`, `concealing-baby-swallow`, `unique-three-river-bottom`, `advance-block`, `deliberation`, `matching-low`, `three-stars-in-the-south`, `identical-three-crows`, `takuri-line`, `last-engulfing-bottom`, `last-engulfing-top`, `above-the-stomach`, `below-the-stomach`, `bullish-hikkake`, `bearish-hikkake`, `triple-top`, `triple-bottom`, `rising-window`, `falling-window`, `breakaway-gap`, `runaway-gap`, `exhaustion-gap`, `island-top`, `island-bottom`, `bear-flag`, `bull-pennant`, `bear-pennant`, `high-tight-flag`, `ascending-triangle`, `descending-triangle`, `bullish-rectangle`, `bearish-rectangle`, `ascending-channel`, `descending-channel`, `rounding-bottom`, `rounding-top`, `cup-and-handle`, `inverse-cup-and-handle`, `broadening-top`, `broadening-bottom`, `diamond-top`, `diamond-bottom`, `v-bottom`, `selling-climax`, `volume-dry-up`, `breakout-volume`, `volume-divergence`, `three-pushes`, `complex-head-shoulders`, `complex-inverse-head-shoulders`, `low-tight-flag`, `trend-stage-bounce`, `trendline-breakdown`, `measured-move-up`, `measured-move-down`, `neckline-retest-bullish`, `neckline-retest-bearish`, `rectangle-bottom`, `step-top`, `step-bottom`, `bullish-three-pushes`, `bearish-breakaway-gap`, `bearish-runaway-gap`, `inside-bar`, `pipe-bottom`, `pipe-top`, `four-price-doji`, `common-gap`, `failed-breakout`, `failed-breakdown`, `blow-off-top`

</details>

<details><summary>Indicators (5): `/archive?tab=indicators`</summary>

- `sma` SMA (trend)
- `ema` EMA (trend)
- `rsi` RSI (oscillator)
- `macd` MACD (oscillator)
- `bollinger` Bollinger Bands (volatility)

</details>

<details><summary>Glossary terms (613): `/archive?tab=literacy&open=<id>`</summary>

**ownership** (33): `stock-share`, `free-cash-flow`, `net-margin`, `pe-ratio`, `dilution`, `at-the-market-offering`, `follow-on-offering`, `etf`, `collectibles-tax`, `schedule-k1`, `fund-prospectus`, `capital-gains-holding-period`, `etn-issuer-risk`, `exposure-wrapper`, `physically-backed-trust`, `commodity-pool`, `expense-ratio`, `spot-bitcoin-etp`, `currency-trust`, `currency-futures-fund`, `streaming-royalty-company`, `reverse-split`, `physical-uranium-vehicle`, `exposure-label`, `insider-cluster`, `diluted-shares`, `insider-institutional-ownership`, `forward-dividend-yield`, `fund-assets`, `etf-holdings`, `dividend`, `stock-split`, `share-buyback`

**markets** (258): `exchange`, `options-context`, `options-event-vol`, `futures-market`, `futures-roll`, `futures-underlying`, `futures-harvest`, `crypto-browse`, `crypto-depeg-scare`, `crypto-weekend`, `crypto-listing`, `forex-spot`, `forex-pip`, `forex-major-cross`, `forex-risk-on`, `equities-traditional-retail`, `ohlc-anatomy`, `candle-color`, `wick-rejection`, `full-body-candle`, `indecision-candle`, `strong-move-candle`, `candlestick-origins`, `long-vs-short-candle`, `marubozu-types`, `doji-types`, `dragonfly-gravestone`, `gap-reversal`, `three-line-strike`, `meeting-lines`, `neck-patterns`, `gap-continuation`, `bid-ask`, `liquidity`, `volatility`, `volume`, `delayed-vs-sample-feed`, `consensus-estimate`, `earnings-surprise`, `guidance-raise-cut`, `post-earnings-drift`, `earnings-gap`, `implied-move`, `pre-earnings-run-up`, `positioning`, `volume-spike`, `deposit-beta`, `topline-readout`, `binary-event`, `nonfarm-payrolls`, `unemployment-rate`, `participation-rate`, `average-hourly-earnings`, `initial-jobless-claims`, `continuing-claims`, `jolts-openings`, `quits-rate`, `cpi`, `core-inflation`, `shelter-inflation`, `ppi`, `pce-inflation`, `gdp`, `retail-sales`, `pmi`, `consumer-sentiment`, `inflation-expectations`, `housing-starts`, `building-permits`, `mortgage-rate`, `mortgage-spread`, `federal-funds-rate`, `fomc`, `dot-plot`, `hawkish-dovish`, `fed-funds-futures`, `treasury-yield`, `two-year-yield`, `ten-year-yield`, `yield-curve`, `curve-inversion`, `bull-bear-steepener`, `breakeven-inflation`, `real-yield`, `us-dollar-index`, `rate-sensitive-sectors`, `bad-news-is-good-news`, `macro-regime`, `buy-the-rumor`, `stagflation`, `soft-landing`, `term-premium`, `slippage`, `gap-risk`, `option-premium`, `strike-price`, `expiration-date`, `options-exercise`, `options-assignment`, `options-breakeven`, `covered-call`, `cash-secured-put`, `protective-put`, `collar`, `vertical-spread`, `iron-condor`, `upper-wick`, `lower-wick`, `shaven-candle`, `doji`, `wick-length`, `candle-color-settings`, `average-true-range`, `public-float`, `float-turnover`, `gamma-squeeze`, `short-squeeze`, `short-interest`, `days-to-cover`, `open-interest`, `unusual-options-activity`, `spoofing`, `wash-trade`, `luld`, `circuit-breaker`, `log-scale`, `adjusted-prices`, `payment-for-order-flow`, `crypto-candle-gaps`, `crypto-daily-close`, `measured-move`, `pattern-retest`, `price-leg`, `consolidation`, `tick`, `tick-value`, `mes-micro`, `vwap`, `futures-contract`, `option-contract`, `contract-multiplier`, `notional-value`, `es-emini`, `spy-etf`, `compounded-annual-return`, `price-momentum`, `post-publication-decay`, `global-macro`, `common-gap`, `gap-types`, `opening-range`, `level-touches`, `imbalance`, `risk-premium`, `volatility-risk-premium`, `vix-index`, `vix-term-structure`, `roll-yield`, `implied-vs-realized-volatility`, `vix-one-month-move`, `mini-vix-futures`, `vix-special-opening-quotation`, `vix-volatility-indices`, `carry-and-convergence`, `vix-index-options`, `options-on-vix-futures`, `vvix`, `option-delta`, `days-to-expiration`, `early-assignment`, `implied-volatility`, `iv-rank`, `put-write-index`, `buy-write-index`, `contango`, `backwardation`, `spot-price`, `operating-leverage`, `dollar-index-weights`, `interest-rate-differential`, `all-in-sustaining-cost`, `gold-silver-ratio`, `central-bank-gold-buying`, `silver-industrial-demand`, `safe-haven-demand`, `crack-spread`, `wti-vs-brent`, `eia-petroleum-status-report`, `natural-gas-storage-report`, `upstream-midstream-downstream`, `lng-exporter`, `long-term-uranium-contract`, `spot-uranium-price`, `grid-investment`, `supply-response`, `project-financing-cost`, `wasde-report`, `stocks-to-use-ratio`, `crop-progress-report`, `nitrogen-fertilizer`, `potash-phosphate`, `farm-income`, `resin-producer`, `ethane-cracker`, `naphtha`, `operating-rate`, `specialty-vs-commodity-chemicals`, `bond-duration`, `interest-rate-risk`, `treasury-bill-fund`, `tips-bond`, `reinvestment-risk`, `gics-sector`, `cyclical-vs-defensive`, `sector-fund-concentration`, `equity-vs-mortgage-reit`, `business-cycle-phases`, `market-cap-weighting`, `equal-weight-index`, `price-weighted-index`, `size-segment`, `developed-vs-emerging`, `growth-vs-value-style`, `etf-based-weight-estimate`, `valuation-distributions`, `forward-pe`, `relative-volume`, `delayed-quote`, `adjusted-close`, `total-return-vs-benchmark`, `price-target-range`, `bmo-amc`, `net-income-to-common`, `bank-revenue-definitions`, `market-cap`, `beta`, `fifty-two-week-range`, `day-range`, `previous-close`, `average-volume`, `price-to-sales`, `price-to-book`, `price-to-free-cash-flow`, `current-ratio`, `debt-to-equity`, `analyst-consensus`, `price-target`, `revenue`, `net-income`, `goodwill-impairment`, `unusual-items`, `sma-distance`, `price-performance`, `lynch-fair-value`, `graham-number`, `insider-buying`, `analyst-rating`, `sector-rotation`

**position** (26): `long-vs-short`, `market-order-vs-limit`, `diversification`, `buying-power`, `cost-basis`, `realized-vs-unrealized-pnl`, `account-equity`, `drawdown`, `theta-decay`, `short-dated-option`, `gamma`, `server-side-stop`, `open-pnl`, `settled-cash`, `pattern-day-trader`, `intraday-margin`, `round-trip-cost`, `underlying-vs-premium-rr`, `context-sizing`, `inverse-volatility-etp`, `portfolio-leverage`, `vix-futures-margin`, `daily-reset-path-dependence`, `recovery-math`, `called-away`, `adjusted-cost-basis`

**process** (296): `investing-vs-trading`, `risk-horizon`, `options-failed-break`, `options-hold-event`, `rumor-vs-filing`, `priced-in`, `prior-trend-context`, `pattern-confirmation`, `reversal-vs-continuation`, `pattern-tolerance`, `market-structure`, `breakout-retest`, `risk-reward`, `no-trade-zone`, `entry-types`, `trailing-stop`, `taking-profit`, `stop-loss-invalidation`, `price-action-framework`, `trendline`, `neckline`, `break-of-structure`, `liquidity-sweep`, `order-block`, `breaker-block`, `supply-zone`, `demand-zone`, `base-candle`, `impulse-candle`, `fresh-vs-tested-zone`, `zone-flip`, `chase-vs-fade`, `support-resistance`, `trend-vs-range`, `earnings-season`, `guidance`, `correlation`, `bullish-harami-cross`, `bearish-harami-cross`, `morning-doji-star`, `evening-doji-star`, `high-wave`, `rickshaw-man`, `double-doji`, `tweezer-star`, `stick-sandwich`, `homing-pigeon`, `ladder-bottom`, `concealing-baby-swallow`, `unique-three-river-bottom`, `advance-block`, `deliberation`, `matching-low`, `three-stars-in-the-south`, `identical-three-crows`, `takuri-line`, `last-engulfing-bottom`, `last-engulfing-top`, `above-the-stomach`, `below-the-stomach`, `bullish-hikkake`, `bearish-hikkake`, `triple-top`, `triple-bottom`, `harami-cross`, `doji-star`, `high-wave-and-rickshaw-man`, `wedge`, `belt-hold`, `advanced-rare-patterns`, `rising-window`, `falling-window`, `breakaway-gap`, `runaway-gap`, `exhaustion-gap`, `island-top`, `island-bottom`, `bear-flag`, `bull-pennant`, `bear-pennant`, `high-tight-flag`, `ascending-triangle`, `descending-triangle`, `bullish-rectangle`, `bearish-rectangle`, `ascending-channel`, `descending-channel`, `rounding-bottom`, `rounding-top`, `cup-and-handle`, `inverse-cup-and-handle`, `broadening-top`, `broadening-bottom`, `diamond-top`, `diamond-bottom`, `v-bottom`, `selling-climax`, `volume-dry-up`, `breakout-volume`, `volume-divergence`, `three-pushes`, `complex-head-shoulders`, `complex-inverse-head-shoulders`, `low-tight-flag`, `trend-stage-bounce`, `trendline-breakdown`, `measured-move-up`, `measured-move-down`, `neckline-retest-bullish`, `neckline-retest-bearish`, `rectangle-bottom`, `step-top`, `step-bottom`, `bullish-three-pushes`, `bearish-breakaway-gap`, `bearish-runaway-gap`, `chart-patterns`, `income-statement`, `balance-sheet`, `cash-flow-statement`, `gross-margin`, `operating-income`, `ebitda`, `eps`, `accounts-receivable`, `inventory-days`, `accounts-payable`, `working-capital`, `deferred-revenue`, `capex`, `stock-based-comp`, `net-debt`, `net-leverage`, `interest-coverage`, `debt-covenant`, `cash-burn`, `thirteen-week-cash-flow`, `revolver`, `minimum-cash`, `kpi`, `net-interest-income`, `net-interest-margin`, `efficiency-ratio`, `ppnr`, `provision-for-credit-losses`, `net-charge-offs`, `reserve-build`, `allowance-for-credit-losses`, `nonperforming-loans`, `loan-to-deposit`, `bank-deposits`, `cet1-ratio`, `return-on-equity`, `tangible-book-value`, `royalty-revenue`, `clinical-trial-phases`, `primary-endpoint`, `cash-runway`, `household-vs-establishment`, `data-revision`, `diffusion-index`, `target-range`, `basis-point`, `macro-surprise`, `release-calendar`, `market-order`, `limit-order`, `stop-order`, `stop-limit-order`, `time-in-force`, `day-order`, `good-til-canceled`, `position-sizing`, `paper-trading`, `r-multiple`, `momentum-oscillator`, `fast-stochastic`, `slow-stochastic`, `kdj`, `volatility-stop`, `indicator-not-signal`, `japanese-candlesticks`, `heikin-ashi`, `delta-hedging`, `survivorship-bias`, `recency-bias`, `availability-bias`, `confirmation-bias`, `fomo`, `loss-aversion`, `anchoring`, `information-overload`, `overtrading`, `leaps`, `algorithmic-trading`, `backtesting`, `overfitting`, `look-ahead-bias`, `kill-switch`, `webhook`, `api-key`, `indicator-warm-up`, `umbrella-line`, `pattern-invalidation`, `bar-count`, `fib-retracement`, `fib-extension`, `confluence`, `fib-invalidation`, `simple-moving-average`, `sharpe-ratio`, `mean-reversion`, `trend-following`, `whipsaw`, `bullish-divergence`, `bollinger-squeeze`, `bull-trap`, `vwap-pullback`, `shaven-top`, `shaven-bottom`, `intrabar`, `timeframe-aggregation`, `verified-track-record`, `time-weighted-return`, `hypothetical-performance`, `can-slim`, `pattern-theme`, `inside-bar`, `mother-bar`, `narrow-range-bar`, `pipe-top-bottom`, `four-price-doji`, `bear-trap`, `blow-off-top`, `expanding-triangle`, `star-midpoint-rule`, `pattern-context-rules`, `potential-direction`, `two-sided-pattern`, `orb-midpoint`, `orb-failed-break`, `opening-range-breakout`, `four-pillars`, `close-vs-wick`, `reclaim-setup`, `rejection-setup`, `fair-value-gap`, `breakout-signal-vs-entry`, `market-on-close`, `cagr`, `trend-filter`, `risk-parity`, `vix-curve-slope`, `three-kinds-of-decay`, `win-rate-vs-expectancy`, `expected-value`, `negative-expectancy`, `wheel-strategy`, `annualized-premium-yield`, `roll-option`, `options-approval-level`, `bond-ladder`, `fund-overlap`, `theme-connection`, `research-starting-point`, `snapshot-date`, `next-catalyst`, `trailing-twelve-months`, `period-ending`, `as-of-time`, `data-provider`, `stock-screener`, `screener-signal`, `form-4-insider-sale`, `most-recent-quarter`, `provider-footnote`, `sec-edgar`, `edgar-full-text-search`, `form-10-q`, `form-4-transaction-code`, `rule-10b5-1-plan`, `confirmed-earnings-date`, `insider-trading-window`, `insider-tracker`, `cross-check-sources`, `primary-source-filing`, `research-note`, `written-decision-rule`, `ratios-that-skip-banks`, `research-note-template`, `earnings-date`, `fiscal-year`, `ex-dividend-date`, `merger-arbitrage`, `going-concern`, `restatement`


</details>

### Dashboard, learning paths and progress map

- Learning paths (GoalPicker on `/`): `beginner-equities` Beginner Equities Path, `decision-maker` Decision Maker Path, `market-explorer` Market Explorer Path. The path changes what Cases shows (beginner only vs all).
- Progress map regions: `start` Base camp, `academy` Academy, `candles` Candle basics, `library` Pattern library, `decisions` Charts & decisions, `indicators` Indicators & tools, `statements` Statements & earnings, `macro` Macro desk, `markets` Markets & instruments, `risk` Risk, news & mindset, `cases` Cases & coaching, `paper` Paper trading.
- Progress map stages: 180 (13 page, 8 level, 7 hub, 45 lab, 107 quiz). First objective `quiz:candle-anatomy`. Param routes map to a hub stage through `PARAM_ROUTE_STAGE`: `/cases/:caseId` → `hub:cases`, `/coach/:slug` → `hub:coach`, `/playbooks/:id` → `hub:playbooks`, `/tools/:toolId` → `hub:tools`, `/macro/:lessonId` → `hub:macro`, `/academy/test-out/:levelId` → `academy:L0`, `/academy/:unitId` → `academy:L0`, `/paper/challenges/:challengeId` → `hub:challenges`.

## 6. Deep links and anchors

These links are written into content and code. A renamed route, hash or param breaks them silently unless an alias stays.

### Table of Contents hashes (`/training#…`)

Read by `PanelCarousel` (group id or alias) and `Training.tsx` (`#concepts` switches the quiz to concept groups). Group ids: `academy`, `quiz`, `practice`, `tool-training`, `deep-study`, `other-factors`, `quick-decisions`. Aliases: `concepts`, `patterns`, `quiz`, `tools`, `cases`, `coach`, `playbooks`, `paper`, `challenges`, `financials`, `macro`, `charts`, `buy-or-sell`. The path map above the carousel sits in `id="path"`; no link uses `#path` today.

### Query params and anchors by route

| Route | Param / hash | Read by | Links using it | Generated in |
|---|---|---|---:|---|
| `/academy/:unitId` | `?check` | `src/pages/academy/AcademyUnit.tsx`: `check=1` tests out of the unit | 1 | `src/pages/academy/AcademyHub.tsx` |
| `/academy/:unitId` | `?sim` | `SimProvider` / `UnitPlayer` `initialOpen`: opens that simulation on load | 2 | `src/lib/academy/content/unitsL0L3.ts (Academy ref)` |
| `/archive` | `?crypto` | `src/pages/Archive.tsx`: crypto-fit filter | 1 | `src/pages/practice/CryptoCandles.tsx` |
| `/archive` | `?open` | `src/pages/Archive.tsx`: opens one pattern, indicator or term | 131 | `src/components/OrbContextLab.tsx`, `src/components/QuizModal.tsx`, `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/academy/options/ladder.ts (Academy ref)`, `src/lib/academy/refs.ts`, `src/lib/browseCatalog.ts`, `src/lib/fairValueGap.ts`, `src/lib/financials/format.ts`, `src/lib/marketNavigator.ts`, `src/lib/openingRange.ts`, `src/lib/playbooks.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/vixTrading.ts`, `src/pages/Market.tsx`, `src/pages/academy/OptionsLadder.tsx`, `src/pages/macro/MacroLesson.tsx`, `src/pages/practice/AlgoTrading.tsx`, `src/pages/practice/ChartingApps.tsx`, `src/pages/practice/CryptoCandles.tsx`, `src/pages/practice/EssentialCandles.tsx`, `src/pages/practice/FairValueGap.tsx`, `src/pages/practice/FibDecisionMap.tsx`, `src/pages/practice/Flashcards.tsx`, `src/pages/practice/FuturesVsOptions.tsx`, `src/pages/practice/GammaSqueeze.tsx`, `src/pages/practice/JapaneseCandles.tsx`, `src/pages/practice/MissingWicks.tsx`, `src/pages/practice/NewsBiases.tsx`, `src/pages/practice/OneMinuteCharts.tsx`, `src/pages/practice/OpeningRange.tsx`, `src/pages/practice/Oscillators.tsx`, `src/pages/practice/PatternThemes.tsx`, `src/pages/practice/RecordTraders.tsx`, `src/pages/practice/ReversalCharts.tsx`, `src/pages/practice/RiskPremiumPortfolio.tsx`, `src/pages/practice/TradeFramework.tsx`, `src/pages/practice/VixTrading.tsx`, `src/pages/practice/WheelStrategy.tsx`, `src/pages/practice/WhichWay.tsx` |
| `/archive` | `?tab` | `src/pages/Archive.tsx`: patterns, indicators or literacy tab | 131 | `src/components/IndicatorGlossary.tsx`, `src/components/OrbContextLab.tsx`, `src/components/QuizModal.tsx`, `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/academy/options/ladder.ts (Academy ref)`, `src/lib/academy/refs.ts`, `src/lib/browseCatalog.ts`, `src/lib/fairValueGap.ts`, `src/lib/financials/format.ts`, `src/lib/marketNavigator.ts`, `src/lib/navLevels.ts`, `src/lib/openingRange.ts`, `src/lib/playbooks.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/vixTrading.ts`, `src/pages/Market.tsx`, `src/pages/academy/OptionsLadder.tsx`, `src/pages/macro/MacroLesson.tsx`, `src/pages/practice/AlgoTrading.tsx`, `src/pages/practice/ChartingApps.tsx`, `src/pages/practice/CryptoCandles.tsx`, `src/pages/practice/FairValueGap.tsx`, `src/pages/practice/FibDecisionMap.tsx`, `src/pages/practice/Flashcards.tsx`, `src/pages/practice/FuturesVsOptions.tsx`, `src/pages/practice/GammaSqueeze.tsx`, `src/pages/practice/JapaneseCandles.tsx`, `src/pages/practice/MissingWicks.tsx`, `src/pages/practice/NewsBiases.tsx`, `src/pages/practice/OneMinuteCharts.tsx`, `src/pages/practice/OpeningRange.tsx`, `src/pages/practice/Oscillators.tsx`, `src/pages/practice/RecordTraders.tsx`, `src/pages/practice/ReversalCharts.tsx`, `src/pages/practice/RiskPremiumPortfolio.tsx`, `src/pages/practice/TradeFramework.tsx`, `src/pages/practice/VixTrading.tsx`, `src/pages/practice/WheelStrategy.tsx` |
| `/archive` | `?theme` | `src/pages/Archive.tsx`: pattern theme filter | 1 | `src/pages/practice/PatternThemes.tsx` |
| `/cases` | `?market` | `src/pages/Cases.tsx`: limits packs to one market class (`?class=` also works) | 1 | `src/lib/marketNavigator.ts` |
| `/cases` | `?pack` | `src/pages/Cases.tsx`: focuses a pack first | 56 | `src/components/PathMapPanel.tsx`, `src/lib/browseCatalog.ts`, `src/lib/fairValueGap.ts`, `src/lib/fourPillars.ts`, `src/lib/marketThemes/agriculture.ts`, `src/lib/marketThemes/bonds.ts`, `src/lib/marketThemes/currencyFunds.ts`, `src/lib/marketThemes/energy.ts`, `src/lib/marketThemes/indexStyle.ts`, `src/lib/marketThemes/industrialMetals.ts`, `src/lib/marketThemes/materials.ts`, `src/lib/marketThemes/preciousMetals.ts`, `src/lib/marketThemes/sectors.ts`, `src/lib/marketThemes/structure.ts`, `src/lib/navLevels.ts`, `src/lib/openingRange.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/toolTraining/capstone.ts`, `src/lib/toolTraining/capstoneBank.ts`, `src/lib/toolTraining/earningsInsiders.ts`, `src/lib/toolTraining/edgar.ts`, `src/lib/toolTraining/finviz.ts`, `src/lib/toolTraining/marketForces.ts`, `src/lib/toolTraining/stockAnalysis.ts`, `src/lib/toolTraining/yahooFinance.ts`, `src/lib/tracks.ts`, `src/lib/tradeFramework.ts`, `src/lib/vixTrading.ts`, `src/lib/wheelStrategy.ts`, `src/pages/Dashboard.tsx`, `src/pages/Training.tsx` |
| `/coach` | `?class` | `src/pages/Coach.tsx`: market class filter (default equity; `?market=` also works) | 3 | `src/lib/browseCatalog.ts`, `src/lib/marketNavigator.ts` |
| `/macro/play` | `?round` | `src/pages/macro/MacroPlay.tsx`: starts at a round | 1 | `src/lib/macro/homeTip.ts` |
| `/market` | `?class` | `src/pages/Market.tsx`: market class | 1 | `src/lib/marketNavigator.ts` |
| `/market` | `?nav` | `src/pages/Market.tsx`: `nav=1` opens the market navigator | 3 | `src/lib/marketNavigator.ts`, `src/pages/Dashboard.tsx`, `src/pages/Training.tsx` |
| `/practice/bonds-rates` | `?sim` | `SimProvider` / `UnitPlayer` `initialOpen`: opens that simulation on load | 2 | `src/lib/academy/content/beforeYouTrade.ts (Academy ref)` |
| `/practice/currency-funds` | `?sim` | `SimProvider` / `UnitPlayer` `initialOpen`: opens that simulation on load | 1 | `src/lib/academy/content/beforeYouTrade.ts (Academy ref)` |
| `/practice/exposure-wrappers` | `?sim` | `SimProvider` / `UnitPlayer` `initialOpen`: opens that simulation on load | 1 | `src/lib/academy/content/beforeYouTrade.ts (Academy ref)` |
| `/practice/index-style` | `?sim` | `SimProvider` / `UnitPlayer` `initialOpen`: opens that simulation on load | 1 | `src/lib/academy/content/beforeYouTrade.ts (Academy ref)` |
| `/practice/opening-range` | `#context` | `src/components/OrbContextLab.tsx`: anchor `id="context"` | 1 | `src/lib/playbooks.ts` |
| `/practice/pattern-themes` | `?theme` | `src/pages/practice/PatternThemes.tsx`: opens one theme | 2 | `src/components/PatternDetailModal.tsx`, `src/pages/Archive.tsx` |
| `/practice/precious-metals` | `?sim` | `SimProvider` / `UnitPlayer` `initialOpen`: opens that simulation on load | 1 | `src/lib/academy/content/beforeYouTrade.ts (Academy ref)` |
| `/practice/read-the-print` | `?round` | `src/pages/practice/ReadThePrint.tsx`: round (also `phase`, `pick`, `follow`) | 1 | `src/lib/financials/caseLinks.ts` |
| `/practice/sectors-rotation` | `?sim` | `SimProvider` / `UnitPlayer` `initialOpen`: opens that simulation on load | 1 | `src/lib/academy/content/beforeYouTrade.ts (Academy ref)` |
| `/practice/statements` | `#forecast` | `src/pages/practice/StatementsLab.tsx`: anchor `id="forecast"` | 1 | `src/components/financials/FinancialsTrainingCard.tsx` |
| `/tools/:toolId` | `?sim` | `SimProvider` / `UnitPlayer` `initialOpen`: opens that simulation on load | 2 | `src/lib/academy/content/beforeYouTrade.ts (Academy ref)` |
| `/training` | `#buy-or-sell` | `PanelCarousel` group id or alias | 3 | `src/lib/appNav.ts`, `src/lib/navLevels.ts` |
| `/training` | `#concepts` | `PanelCarousel` group id or alias; `Training.tsx` switches to concept groups | 3 | `src/lib/appNav.ts`, `src/lib/navLevels.ts` |
| `/training` | `#financials` | `PanelCarousel` group id or alias | 3 | `src/lib/appNav.ts`, `src/lib/navLevels.ts` |
| `/training` | `#macro` | `PanelCarousel` group id or alias | 3 | `src/lib/appNav.ts`, `src/lib/navLevels.ts` |
| `/training` | `#patterns` | `PanelCarousel` group id or alias | 4 | `src/lib/appNav.ts`, `src/lib/navLevels.ts` |
| `/training` | `#practice` | `PanelCarousel` group id or alias | 2 | `src/lib/appNav.ts` |
| `/training` | `?group` | `src/pages/Training.tsx`: selects the quiz group and opens the Quiz panel | 139 | `src/components/IndicatorDetailModal.tsx`, `src/components/MarketNavigator.tsx`, `src/components/OrbContextLab.tsx`, `src/components/PathMapPanel.tsx`, `src/components/academy/AcademyTrainingCard.tsx`, `src/components/financials/FinancialsTrainingCard.tsx`, `src/components/macro/MacroTrainingCard.tsx`, `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/academy/options/ladder.ts (Academy ref)`, `src/lib/academy/refs.ts`, `src/lib/beginnerPath.ts`, `src/lib/browseCatalog.ts`, `src/lib/fairValueGap.ts`, `src/lib/fourPillars.ts`, `src/lib/macro/homeTip.ts`, `src/lib/marketNavigator.ts`, `src/lib/marketThemes/agriculture.ts`, `src/lib/marketThemes/bonds.ts`, `src/lib/marketThemes/currencyFunds.ts`, `src/lib/marketThemes/energy.ts`, `src/lib/marketThemes/indexStyle.ts`, `src/lib/marketThemes/industrialMetals.ts`, `src/lib/marketThemes/materials.ts`, `src/lib/marketThemes/preciousMetals.ts`, `src/lib/marketThemes/sectors.ts`, `src/lib/marketThemes/structure.ts`, `src/lib/openingRange.ts`, `src/lib/playbooks.ts`, `src/lib/progressMap.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/toolTraining/capstone.ts`, `src/lib/toolTraining/capstoneBank.ts`, `src/lib/toolTraining/earningsInsiders.ts`, `src/lib/toolTraining/edgar.ts`, `src/lib/toolTraining/finviz.ts`, `src/lib/toolTraining/marketForces.ts`, `src/lib/toolTraining/stockAnalysis.ts`, `src/lib/toolTraining/yahooFinance.ts`, `src/lib/tracks.ts`, `src/lib/tradeFramework.ts`, `src/lib/vixTrading.ts`, `src/lib/wheelStrategy.ts`, `src/pages/Archive.tsx`, `src/pages/CasePlayer.tsx`, `src/pages/Cases.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Market.tsx`, `src/pages/Playbook.tsx`, `src/pages/academy/OptionsLadder.tsx`, `src/pages/macro/MacroDesk.tsx`, `src/pages/macro/MacroLesson.tsx`, `src/pages/practice/AlgoTrading.tsx`, `src/pages/practice/ChartingApps.tsx`, `src/pages/practice/CryptoCandles.tsx`, `src/pages/practice/EssentialCandles.tsx`, `src/pages/practice/FuturesVsOptions.tsx`, `src/pages/practice/GammaSqueeze.tsx`, `src/pages/practice/HeikinAshi.tsx`, `src/pages/practice/JapaneseCandles.tsx`, `src/pages/practice/MissingWicks.tsx`, `src/pages/practice/NewsBiases.tsx`, `src/pages/practice/OneMinuteCharts.tsx`, `src/pages/practice/Oscillators.tsx`, `src/pages/practice/PatternThemes.tsx`, `src/pages/practice/RecordTraders.tsx`, `src/pages/practice/ReversalCharts.tsx`, `src/pages/practice/TechniqueNarratives.tsx` |
| `/training` | `?start` | `src/pages/Training.tsx`: `start=1` opens the quiz modal | 83 | `src/components/IndicatorDetailModal.tsx`, `src/components/MarketNavigator.tsx`, `src/components/OrbContextLab.tsx`, `src/components/academy/AcademyTrainingCard.tsx`, `src/components/financials/FinancialsTrainingCard.tsx`, `src/components/macro/MacroTrainingCard.tsx`, `src/lib/academy/content/beforeYouTrade.ts (Academy ref)`, `src/lib/academy/content/unitsL0L3.ts (Academy ref)`, `src/lib/academy/content/unitsL4L7.ts (Academy ref)`, `src/lib/academy/options/ladder.ts (Academy ref)`, `src/lib/academy/refs.ts`, `src/lib/beginnerPath.ts`, `src/lib/fairValueGap.ts`, `src/lib/fourPillars.ts`, `src/lib/macro/homeTip.ts`, `src/lib/openingRange.ts`, `src/lib/playbooks.ts`, `src/lib/riskPremiumPortfolio.ts`, `src/lib/tradeFramework.ts`, `src/lib/vixTrading.ts`, `src/lib/wheelStrategy.ts`, `src/pages/Archive.tsx`, `src/pages/CasePlayer.tsx`, `src/pages/Cases.tsx`, `src/pages/Dashboard.tsx`, `src/pages/Market.tsx`, `src/pages/academy/OptionsLadder.tsx`, `src/pages/macro/MacroDesk.tsx`, `src/pages/macro/MacroLesson.tsx`, `src/pages/practice/AlgoTrading.tsx`, `src/pages/practice/ChartingApps.tsx`, `src/pages/practice/CryptoCandles.tsx`, `src/pages/practice/GammaSqueeze.tsx`, `src/pages/practice/HeikinAshi.tsx`, `src/pages/practice/JapaneseCandles.tsx`, `src/pages/practice/NewsBiases.tsx`, `src/pages/practice/OneMinuteCharts.tsx`, `src/pages/practice/Oscillators.tsx`, `src/pages/practice/ReversalCharts.tsx` |

Params read by pages but not generated by any in-app link today (typed or shared URLs only):

- `/coach?topic=` (`src/pages/Coach.tsx`)
- `/map?view=` (`src/pages/ProgressMap.tsx`)
- `/practice-draw?template=` / `?contentRef=` (`src/pages/PracticeDraw.tsx`)
- `/practice/technique-narratives?n=` (`src/pages/practice/TechniqueNarratives.tsx`)
- `/practice/statements?tab=&company=&all=1&forecast=&readout=&rphase=&delay=1&defer=1&revolver=0` (`src/pages/practice/StatementsLab.tsx`)
- `/practice/mark-the-band?round=&phase=&low=&high=&fill=` (`src/pages/practice/MarkTheBand.tsx`)
- `?sim=<id>` is read on market theme pages, tool lessons, `/practice/vix-trading` and Academy units (`MarketThemePage.tsx`, `ToolLessonPage.tsx`, `VixTrading.tsx`, `AcademyUnit.tsx`), but only the Academy refs listed in the table above generate it; every other simulation opens from a button on its page.

## 7. Orphans and at-risk items

Nothing is orphaned: every route in `src/App.tsx` has at least one in-app link, and every static route is in the header or Browse everything. The items that had only one way in before the directional navigation change now have a Browse everything entry too; what is left below is hidden behind a filter or has no URL of its own.

### Static routes missing from a main surface

| Route | In header menu | In Browse everything | In Table of Contents | On progress map | Notes |
|---|---|---|---|---|---|
| `/` | yes | yes | **no** | yes | Logo and Home link; fine. |
| `/browse` | yes | **no** | **no** | yes | Header, every menu, Home, the Show me everything track and the map. |
| `/map` | yes | yes | **no** | yes | Now a top-level header link, plus Browse everything, Home and the map card. Was at risk (one menu path). |

### Param routes that were reached from a single hub

- **`/academy/test-out/:levelId`** (8 level test-outs): the level headers in `src/pages/academy/AcademyHub.tsx` and now the Browse everything “Academy level test-outs” section (all 8). No map stage of its own (`PARAM_ROUTE_STAGE` maps it to `academy:L0`). Was the highest risk; covered.
- **`/macro/:lessonId`** (18 lessons): `/macro` (`MacroDesk.tsx`), scattered links (`CaseMacroLink.tsx`, `macro/homeTip.ts`, `contentSims.ts`, Academy refs) and now the Browse everything “Macro lessons” section (all 18).
- **`/cases/:caseId`** (517 cases): listed on `/cases` (Browse everything links all 17 packs with `?pack=`, and its search finds any case by title). 106 intermediate cases are hidden on the default (Beginner Equities / Market Explorer) path and show only on the Decision Maker path; non-equity packs also follow the chart gate and market browse gate.
- **`/paper/challenges/:challengeId`** (10 challenges): `/paper/challenges`, the Today card and now the Browse everything “Paper challenges” section (all 10).
- **`/academy/:unitId`** (45 units): listed on `/academy` plus Today, Placement and Academy refs; fine as long as the Academy hub stays.

### Content hidden by a default filter

- **Coach sessions:** 68 of 99 sessions do not show on a plain `/coach` visit, because the hub defaults to the equity class (`?class=` changes it) and hides classes the learner has not unlocked. They stay reachable through the ToC `#coach` list, which lists all 99, and the Browse everything search finds any session by title. Browse everything also links Coach by market (`/coach?class=equity|future|forex|crypto|option_context`); a locked class still shows its peek button there.
- **Cases:** 106 intermediate cases (see the pack table in section 5) need the Decision Maker learning path.
- **Glossary and quiz groups for other markets:** the Library literacy tab and some quiz groups follow the beginner chart gate and market browse gate (`src/lib/beginnerPath.ts`), with a temporary bypass button. They are locked, not unlinked.

### Content with no URL of its own

- **Paper desk scenarios** (30): picked inside `/paper/desk` with a topic filter; no `?scenario=` param. A redesign cannot deep-link one, and links from other pages can only open the desk.
- **Options ladder strategies** (13): shown inside `/academy/options`; no per-strategy URL.
- **Quiz groups** open through `/training?group=<id>`, which works only while the Quiz panel stays on `/training`.
- **Buy or Sell?** is a ToC panel (`/training#buy-or-sell`) plus the `buy-or-sell` quiz group, not a page.

### Deep links that are fragile

- Table of Contents hashes are stored in `src/lib/appNav.ts` (`#patterns`, `#practice`, `#concepts`, `#financials`, `#macro`, `#buy-or-sell`) and in content. If the ToC carousel is replaced, keep these hashes working or redirect them.
- `/training?group=` links are generated in many files (see section 6) and by every progress map quiz stage. Keep `Training.tsx` reading `group` and `start`, or redirect.
- Library links `/archive?tab=literacy&open=<id>` are generated by glossary buttons everywhere; keep `tab` and `open`.
- Params that no in-app link generates (end of section 6) are easy to drop by accident; they are used by tests and shared URLs.

## 8. Automated guard

`src/lib/navInventory.test.ts` runs with `npm run test:lib` (part of `npm run verify`). It fails when:

1. A route in `APP_ROUTES` (`src/lib/academy/refs.ts`, which `refs.test.ts` keeps equal to `src/App.tsx`) is not written in backticks in this file.
2. A static route has no entry point in the header (`HEADER_NAV` in `src/lib/appNav.ts` and the dropdown level tabs, `LEVEL_MENUS` in `src/lib/navLevels.ts`), Browse everything (`BROWSE_SECTIONS` in `src/lib/browseCatalog.ts`), the Table of Contents links (`src/pages/Training.tsx`) or the progress map stages (`src/lib/progressMap.ts`).
3. A param route's hub (for example `/coach` for `/coach/:slug`) is not a static route with such an entry point.
4. An item from the old header menus has neither a header nor a Browse everything entry.
5. A learner-track step opens a route (or a hub detail page) with no such entry point.

`src/lib/browseCatalog.test.ts` also checks that every Browse link and search hit opens a real route, that the Practice families hold every Practice lab exactly once, and that the test-outs, macro lessons, case packs, challenges and coach classes all have a link. `src/lib/navLevels.test.ts` checks that every dropdown item has exactly one level, a group, a one-line description and a real route, that the dropdowns keep every Learn, Trade and Practice item, that each tab has at most 4 groups, and that For your path items are the track's own steps from `src/lib/tracks.ts`. When menus move again, update the entry-point sources in the tests, then this file.
