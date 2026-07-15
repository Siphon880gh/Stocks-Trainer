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
| `src/pages/Dashboard.tsx` | ~190 | Home feed + decorative progress |
| `src/pages/PracticeDraw.tsx` | ~63 | Stub canvas (E7 later) |

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

`MARKETS` (~middle): `btc` (base), `eth` (scaled), `sp500` (scaled).  
`getMarket(id)` near end.

**Note:** Epic roadmap wants equities-first sample packs (E1); current catalog is crypto-heavy with one index. Prefer adding equity instruments here when implementing E1.M1.

---

## Patterns registry (`patterns.ts`)

Small file: `PatternDef` + `PATTERNS` array + `getPattern(id)`.

Fields: `type` (reversal/continuation/neutral), optional `sentiment`, `confirmation`, `description`, optional `image` under `/patterns/*.svg`.

---

## Pattern scan (`patternScan.ts`)

Private detectors near top/middle: Doji, Hammer, Bullish/Bearish Engulfing, Shooting Star / Inverted Hammer (same geometry), Morning Star (3-bar).

`scanPatterns(data)` near end — walks bars, may emit **multiple** hits per index; returns `{ index, name, confidence, description }[]`.

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

**Dashboard:** Terminal chrome + hardcoded market cards; real calc only for key metrics link (Sharpe/E/P from `SAMPLE_OHLC`). Progress “65%” and module labels are static UI. Nav links to other routes near bottom half.

**PracticeDraw:** Placeholder “canvas coming soon”; links to Archive/Training. Do not invent full draw engine unless implementing E7.

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

- E1 sample universe: extend `markets.ts` (and later pack loaders)—avoid hardcoding new instruments only inside Dashboard cards.
- New detectable pattern: add detector + push in `scanPatterns`, optionally mirror in `PATTERNS` / quiz packs.
- Scaling markets from one BTC base means shape is identical across assets—fine for MVP; real multi-asset packs should use distinct OHLC series.
- Keep `FAKE_FINANCIALS` labeled simulated; do not present as live fundamentals.

---

> Refer to AGENTS_CODE_REFERENCE.md for high-level context; details are in feature context files.
