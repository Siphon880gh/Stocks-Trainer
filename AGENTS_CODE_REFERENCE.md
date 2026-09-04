# AGENTS_CODE_REFERENCE.md

AI-oriented codebase map for safe modification, feature tracing, and implementation planning.

**Approximate location cues are intentional** (e.g. “near the top”, “around the middle”). Do not rely on exact line numbers—they drift with every edit.

**Companions:**
- [`AGENTS_CODE_REFERENCE-charts.md`](./AGENTS_CODE_REFERENCE-charts.md) — chart rendering + indicator math
- [`AGENTS_CODE_REFERENCE-training.md`](./AGENTS_CODE_REFERENCE-training.md) — quizzes, Archive, scoring
- [`AGENTS_CODE_REFERENCE-data.md`](./AGENTS_CODE_REFERENCE-data.md) — OHLC packs, markets, patterns, financials, scan

**Product planning (not runtime code):** [`EPIC_MAP.md`](./EPIC_MAP.md) · [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) · [`.agents/state.json`](./.agents/state.json)

---

## What the app does

**Stock Trainer (ANALYSIS_CORE)** — browser SPA that teaches equities first: vocabulary, statement snapshots, candles/indicators, decide-and-reveal cases, then SAMPLE multi-market browse and deterministic step coaching. Charts still teach patterns and overlay lines (SMA, EMA, RSI, MACD, Bollinger).

**Shipped today (E0–E11 Done(global)):** Home path + GoalPicker, Charts (SAMPLE/DELAYED + Navigator), Learn (quiz groups), Cases (decide→reveal), Coach (`/coach`), Archive, Practice Draw (graded canvas), local Account export/import. Content drain after milestones lives in `LOOPS/`, not new epic ids.

**Do not** treat E1.M1 as the next implementation target. Milestone queues are complete; leftover work is content/coverage, not a new epic.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19 + TypeScript |
| Build | Vite 6 (`npm run dev` → port **3001**, host `0.0.0.0`) |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`), CRT/terminal theme in `src/index.css` (~60 lines) |
| Routing | `react-router-dom` v7 |
| Charts | Recharts (`MarketChart`); custom SVG (`CandlestickChart`) |
| Icons/fonts | Material Symbols + Space Grotesk / JetBrains Mono (`index.html`) |
| Utils | `clsx` + `tailwind-merge` → `cn()` in `src/lib/utils.ts` (~6 lines) |

**Not used in `src/` despite `package.json`:** Express, better-sqlite3, dotenv. Treat the app as a **client-only SPA** with bundled sample data unless the user explicitly adds a server.

---

## Architecture

```
Browser
  main.tsx → App.tsx (BrowserRouter)
    Layout → AppChrome + <Outlet />
      /              Dashboard (path, GoalPicker, Account)
      /market        Charts + MarketNavigator + MarketChart + scan
      /training      Learn → QuizModal / AnswerSheetModal
      /cases         Cases list; /cases/:caseId CasePlayer
      /coach         catalog; /coach/:slug CoachSession
      /archive       Archive (patterns / indicators / literacy)
      /practice-draw PracticeDraw (graded canvas)
      /practice/*    Misc practice labs (Hunt, Lookalikes, Levels, …)

Data & logic live under src/lib/ (SAMPLE adapters; no paid live API).
```

**Persistence:** `localStorage` key `analysis_core_progress_v1` (path, milestones, scores, streaks, drillFlags, coachingCompleted). Coaching mid-session uses `sessionStorage`. Export/import via `progressSync` (local only — no fake cloud).

**Design language:** Dark canvas, sentence-case learner copy, primary green CTAs. Prefer extending existing tokens over inventing new palettes. Do not put `SNAKE_CASE` in learner-facing labels.

---

## Relevant file tree

```
trainer/
├── AGENTS_CODE_REFERENCE.md          # this file
├── AGENTS_CODE_REFERENCE-*.md        # feature detail
├── EPIC_MAP.md / IMPLEMENTATION_STORIES.md / .agents/state.json
├── index.html                        # fonts, #root
├── package.json / vite.config.ts     # scripts, Tailwind+React plugins; @ alias → repo root
├── public/patterns/*.svg             # Archive pattern art (4 SVGs)
└── src/
    ├── main.tsx (~10) / App.tsx (~23) / index.css (~60)
    ├── pages/                        # route screens
    │   ├── Dashboard.tsx / Market.tsx / Training.tsx / Archive.tsx
    │   ├── Cases.tsx / CasePlayer.tsx / Coach.tsx / CoachSession.tsx
    │   └── PracticeDraw.tsx + pages/practice/*
    ├── components/                   # charts + modals
    │   ├── Layout.tsx (~10)
    │   ├── MarketChart.tsx (~255) / CandlestickChart.tsx (~213)
    │   ├── QuizModal.tsx (~320) / AnswerSheetModal.tsx (~162)
    │   ├── FinancialsPanel.tsx (~54)
    │   ├── ScanPatternsModal / HistoryModal / Indicator* / PatternDetail*
    └── lib/                          # pure data + math
        ├── ohlcData.ts (~131)        # OHLC type + SAMPLE_* + PATTERN_OHLC map
        ├── markets.ts (~75)          # MARKETS catalog (btc/eth/sp500)
        ├── patterns.ts (~29)         # PATTERNS registry
        ├── overlays.ts (~68)         # OVERLAYS registry (SMA/EMA/RSI/MACD/BB)
        ├── indicators.ts (~103)      # sma/ema/rsi/macd/bollingerBands
        ├── patternScan.ts (~135)     # scanPatterns(ohlc)
        ├── quizData.ts (~279)        # questions, groups, scoring constants
        ├── financials.ts (~50)       # E/P, Sharpe, vol, FAKE_FINANCIALS
        └── utils.ts (~6)
```

---

## High-level code flow

1. **Boot:** `main.tsx` mounts `App` → routes under `Layout` / `AppChrome`.
2. **Home:** Real path from `progressStore` + GoalPicker; primary CTA is Continue / Indicators quiz / Open cases; Also row + Account export/import.
3. **Charts:** `marketId` selects a SAMPLE pack → `FinancialsPanel` + `MarketChart` + `scanPatterns`; `?nav=1` scrolls Market navigator; `?class=` filters. Detail: **AGENTS_CODE_REFERENCE-charts.md** + **data.md**.
4. **Learn:** Query `?group=` / `?start=1` open quiz; `QUIZ_GROUPS` → `QuizModal`. Detail: **AGENTS_CODE_REFERENCE-training.md**.
5. **Cases:** `?pack=` / `?market=` / `?class=` focus list; CasePlayer hides post tape until lock-in.
6. **Coach:** `listSessions()` from `src/lib/coaching/`; `/coach/:slug` persist + rewind.
7. **Archive:** Patterns / Indicators / Literacy; deep-link `?tab=indicators&open=sma`.
8. **Practice Draw:** Graded canvas vs templates (`practiceDraw.ts`); not a placeholder.

Routes live in `src/App.tsx` (Home, Charts, Learn, Cases, Coach, Archive, practice-draw, `/practice/*`). Read that file instead of copying a stale snippet.

---

## Safe-edit rules for AI

- Prefer extending registries (`PATTERNS`, `OVERLAYS`, `MARKETS`, `QUIZ_*`, `PATTERN_OHLC`, case packs, coaching sessions) over one-off hardcoding in pages.
- Keep SAMPLE/STYLIZED data client-side; do not add paid live APIs unless asked.
- Do not remove unused `package.json` deps “for cleanup” unless asked—focus on `src/`.
- When changing quiz patterns, update **both** `quizData` and `ohlcData.PATTERN_OHLC` (and Archive `patterns.ts` if naming changes).
- Progress on Home is real (`analysis_core_progress_v1`). Do not rename that key without a migration.
- Do not invent new epic/milestone ids. Queues in `.agents/state.json` are complete.

---

## Recent git history (awareness)

| Commit | Note |
|--------|------|
| `1e8e4a9` | Added README |
| `ea23ac7` | More lessons |
| `9722f06` | Initialize AI Studio React app |
| `e7f5b98` | Initial commit |

Untracked planning artifacts may include `.agents/`, `EPIC_MAP.md`, `IMPLEMENTATION_STORIES.md`.

---

> Refer to **AGENTS_CODE_REFERENCE.md** for high-level context; details are in the feature context files listed at the top.
