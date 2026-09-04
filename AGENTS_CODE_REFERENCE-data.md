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
