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

**Stock Trainer (ANALYSIS_CORE)** — browser SPA that teaches technical analysis: candlestick patterns and indicator lines (SMA, EMA, RSI, MACD, Bollinger). Learners browse sample charts, scan patterns, take recognition quizzes, and read an Archive glossary.

**Shipped today:** Dashboard, Market (charts + overlays + scan + simulated financials), Training (pattern + indicator quizzes), Archive (patterns + indicators), Practice Draw (placeholder).

**Planned (see epic map):** equities-first curriculum packs, progress persistence, decision case studies (buy/sell/short/hold → reveal), multi-asset literacy. Next implementation target when unlocked: **E1.M1** sample catalog/packs.

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
    Layout (scanline + <Outlet />)
      /              Dashboard
      /market        Market → MarketChart + FinancialsPanel + scan/glossary modals
      /training      Training → QuizModal / AnswerSheetModal
      /archive       Archive → pattern/indicator detail modals
      /practice-draw PracticeDraw (stub)

Data & logic live under src/lib/ (no API layer).
UI chrome is mostly duplicated per page (each page owns its own header/nav).
```

**Persistence:** Session UI state only (React `useState`). Quiz points/streak/accuracy are not written to `localStorage` yet (epic map plans that for E3).

**Design language:** Dark green terminal (`--color-primary: #38ff14`), uppercase body text, neon borders (`.border-neon`, `.crt-glow`). Prefer extending existing tokens over inventing new palettes.

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
    │   ├── Dashboard.tsx (~190)
    │   ├── Market.tsx (~246)
    │   ├── Training.tsx (~198)
    │   ├── Archive.tsx (~276)
    │   └── PracticeDraw.tsx (~63)
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

1. **Boot:** `main.tsx` mounts `App` → routes under `Layout`.
2. **Dashboard:** Hardcoded feed cards + progress chrome; computes Sharpe/E/P from `SAMPLE_OHLC` / `financials` near the top of the file; links into Market/Training/Archive.
3. **Market:** `marketId` selects `MARKETS` entry → `FinancialsPanel` + `MarketChart` with toggleable overlays → `scanPatterns(ohlc)` for Scan modal; right-click/glossary uses `overlays` registry. Detail: **AGENTS_CODE_REFERENCE-charts.md** + **data.md**.
4. **Training:** Query `?group=` / `?start=1` open quiz; `QUIZ_GROUPS` → `getQuestionsForGroup` → `QuizModal` scores with `POINTS_PER_CORRECT` / `STREAK_BONUS`. Pattern questions render `CandlestickChart` from `PATTERN_OHLC`; indicator questions use `MarketChart` with one overlay. Detail: **AGENTS_CODE_REFERENCE-training.md**.
5. **Archive:** Tabs patterns vs indicators; filters; detail modals; deep-link `?tab=indicators&open=sma`.
6. **Practice Draw:** Placeholder canvas UI only (E7 deferred).

### Routing snippet (entire `App.tsx`)

```tsx
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Layout />}>
      <Route index element={<Dashboard />} />
      <Route path="market" element={<Market />} />
      <Route path="training" element={<Training />} />
      <Route path="archive" element={<Archive />} />
      <Route path="practice-draw" element={<PracticeDraw />} />
    </Route>
  </Routes>
</BrowserRouter>
```

---

## Safe-edit rules for AI

- Prefer extending registries (`PATTERNS`, `OVERLAYS`, `MARKETS`, `QUIZ_*`, `PATTERN_OHLC`) over one-off hardcoding in pages.
- Keep sample/fake data client-side; do not add live market APIs unless asked (E8 later).
- Do not remove unused `package.json` deps “for cleanup” unless asked—focus on `src/`.
- When changing quiz patterns, update **both** `quizData` and `ohlcData.PATTERN_OHLC` (and Archive `patterns.ts` if naming changes).
- Progress % on Dashboard is decorative today—do not claim persistence without implementing E3.

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
