# AGENTS_CODE_REFERENCE-data.md

AI feature map: sample markets, OHLC packs, pattern registry, scan, financials, Market page wiring.

**Approximate location cues are intentional.** Do not rely on exact line numbers.

**Parent:** [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md)  
**Related:** [`AGENTS_CODE_REFERENCE-charts.md`](./AGENTS_CODE_REFERENCE-charts.md) · [`AGENTS_CODE_REFERENCE-training.md`](./AGENTS_CODE_REFERENCE-training.md)

---

## Scope

| File | ~Lines | Role |
|------|--------|------|
| `src/lib/ohlcData.ts` | ~131 | `OHLC` type, sample series, `PATTERN_OHLC` map |
| `src/lib/markets.ts` | ~75 | Multi-market catalog (scaled from BTC base) |
| `src/lib/patterns.ts` | ~29 | Archive/quiz pattern definitions |
| `src/lib/patternScan.ts` | ~135 | Heuristic detectors + `scanPatterns` |
| `src/lib/financials.ts` | ~50 | E/P, Sharpe, vol helpers + `FAKE_FINANCIALS` |
| `src/pages/Market.tsx` | ~246 | Market UI orchestrator |
| `src/components/FinancialsPanel.tsx` | ~54 | Simulated metrics strip |
| `src/components/ScanPatternsModal.tsx` | ~93 | Shows `scanPatterns` results |
| `src/components/HistoryModal.tsx` | ~77 | History chrome |
| `src/components/IndicatorGlossary.tsx` | ~81 | Overlay list |
| `src/components/IndicatorPopover.tsx` | ~75 | Right-click overlay tip |
| `src/pages/Dashboard.tsx` | — | Home path, GoalPicker, Account, real progress |
| `src/pages/PracticeDraw.tsx` | — | Graded canvas vs templates (E7 shipped) |

---

## OHLC (`ohlcData.ts`)

Near the top: `OHLC { name, open, high, low, close }` and helper `ohlc(...)`.

Exports:
- `SAMPLE_OHLC` — generic trend used by Dashboard metrics and MarketChart default.
- Named packs: `HAMMER_OHLC`, `DOJI_OHLC`, `ENGULFING_OHLC`, bearish/shooting/inverted/morning-star, head-shoulders, falling-wedge (middle of file).
- `PATTERN_OHLC: Record<string, OHLC[]>` near the end — keys must match quiz `patternKey` / Archive ids where used.

All data is **hand-authored / stylized**, not live feeds.

---

## Markets (`markets.ts`)

Near the top: `scale(rows, factor)` clones OHLC at different price levels.

`MarketDef`: `id`, `name`, `pair`, `data`, display `price` / `delta` / `volatility`.

`MARKETS` is built from `SAMPLE_PACKS_BY_CLASS` (equities first, then futures / options-context / forex / crypto). Legacy BTC/ETH/SPX still resolve through the same adapter.

**Note:** E1–E9 SAMPLE catalogs already shipped. Add a new pack only as leftover content — do not treat E1.M1 as unstarted.

---

## Patterns registry (`patterns.ts`)

Small file: `PatternDef` + `PATTERNS` array + `getPattern(id)`.

Fields: `type` (reversal/continuation/neutral), optional `sentiment`, `confirmation`, `description`, optional `image` under `/patterns/*.svg`.

---

## Pattern scan (`patternScan.ts`)

Candle detectors walk each bar (context-aware hammer vs hanging-man, pierce vs engulf, stars, soldiers/crows, harami, tweezers). Structure names (wedge/flag/double/triangle/H&S) come from 6–8 bar windows.

`scanPatterns(data)` returns `{ index, name, confidence, description }[]` and may emit multiple hits per index.

Heuristic confidence scores are fixed literals (educational, not ML).

---

## Financials (`financials.ts`)

Pure helpers: `earningsPriceRatio`, `sharpeRatio`, `returnsFromCloses`, `volatility`.  
`FAKE_FINANCIALS` constant near end (price/earnings/revenue/marketCap).

`FinancialsPanel` maps closes → returns → Sharpe/vol and shows E/P + P/E from fake fundamentals.

## Financials & earnings project (`src/lib/financials/`)

Project docs: [`docs/projects/financials-earnings/`](docs/projects/financials-earnings/CHARTER.md). SAMPLE / STYLIZED fictional companies (`.S` tickers); not live filings. Tests: `npm run test:financials`.

- `types.ts` (statements, `Quarter`, `Company`, `GuidanceRange`). Money = whole **thousands**; cash-flow lines store the cash impact (outflows negative).
- `companies.ts`: `buildQuarters(opening, drivers)` builds 8 tied quarters; `COMPANIES` = Northwind Cloud `NWCL.S` (SaaS burner, one equity raise), Harbor & Pine `HBPN.S` (seasonal retailer), Ironbridge Industrial `IRBG.S` (levered, covenant). `ties.ts` = tie-out validators (IS / BS / CF / chain).
- `metrics.ts` (margins, FCF, EBITDA, net debt, DSO / DIO / DPO, CCC, coverage, burn, runway, QoQ / YoY, TTM, net leverage, `quarterMetrics`); `format.ts` (`fmtK` parentheses for negatives, `FIN_DISCLAIMER`, `glossaryHref`).
- `terms.ts`: `FINANCIAL_TERMS` (33), spread into `LITERACY_TERMS`.
- `cashForecast.ts` + `cashForecastFixtures.ts`: 13-week direct-method forecast with auto revolver draw / repay, validators, `applyWhatIf` (delay collections, defer capex, revolver on / off; never mutates). 4 fixtures incl. the level-1 replica of Weng's sketch.
- `earningsEvents.ts`: 14 `EARNINGS_EVENTS` (consensus, whisper, prior / new guidance, KPI watch, implied move, run-up, positioning, archetype). Beat / miss labels are **computed** (EPS ≥ 1¢; revenue and guidance midpoint ±1%) and checked against each story's claims.
- `reactionCharts.ts`: seeded `generateReaction(event)` (30 pre + report + 15 post bars, with `volume`), per-archetype validator (non-muted gaps are outside the implied move; muted inside), `revealAnnotations`.
- `readThePrint.ts` / `readThePrintProgress.ts`: the game's rounds (answer = `answerFor(archetype, direction)`) and progress key `analysis_core_read_the_print_v1`.
- `quizBanks.ts` / `quizExhibit.ts`: FE6 quiz banks (see the training reference).
- FE8: `coachEarningsWeek.ts` (Coach session `earnings-week`, registered in `coaching/sessions/index.ts`, numbers from irbg-q1fy26) and `markTheBand.ts` (`BAND_ROUNDS`, `gradeBand`; page `/practice/mark-the-band`, same round order as Read the Print).

---

## Market page wiring (`Market.tsx`)

Near the top: state for `marketId`, overlay toggles (`sma`/`ema`/`rsi`/`macd`/`bollinger`), modal flags, popover, selected overlay.

Middle: `FinancialsPanel` → market `<select>` from `MARKETS` → `MarketChart` with control props → control buttons / Scan / History / glossary.

`detectedPatterns = useMemo(() => scanPatterns(ohlcData), [ohlcData])` feeds `ScanPatternsModal`.

Overlay education: `IndicatorGlossary`, `IndicatorPopover`, `IndicatorDetailModal` via `getOverlay` / `OVERLAYS`.

---

## Dashboard & Practice Draw

**Dashboard:** Live path from `progressStore` (`analysis_core_progress_v1`): next CTA, coach tip, Also row, Account export/import. Not decorative %.

**PracticeDraw:** Graded pointer canvas vs templates in `practiceDraw.ts`. Storage key `analysis_core_practice_draw_v1`.

---

## Code flow

```
MARKETS[id].data ──► MarketChart + FinancialsPanel
                 └──► scanPatterns → ScanPatternsModal

PATTERN_OHLC[key] ──► Quiz CandlestickChart
PATTERNS / OVERLAYS ──► Archive cards
FAKE_FINANCIALS + returnsFromCloses ──► FinancialsPanel / Dashboard metrics
```

---

## Safe-edit notes

- New SAMPLE pack: add distinct OHLC in `samplePacks.ts` / `markets.ts` so `SAMPLE_PACKS_BY_CLASS` picks it up. Do not `scale()` clones.
- New detectable pattern: add detector + tests in `patternScan.ts` / `patternScan.test.ts`, optionally mirror in `PATTERNS` / quiz packs.
- Keep `FAKE_FINANCIALS` labeled simulated; do not present as live fundamentals.

---

> Refer to AGENTS_CODE_REFERENCE.md for high-level context; details are in feature context files.
