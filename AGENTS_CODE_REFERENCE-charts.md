# AGENTS_CODE_REFERENCE-charts.md

AI feature map: chart rendering and indicator math.

**Approximate location cues are intentional.** Do not rely on exact line numbers.

**Parent:** [`AGENTS_CODE_REFERENCE.md`](./AGENTS_CODE_REFERENCE.md)  
**Related:** [`AGENTS_CODE_REFERENCE-data.md`](./AGENTS_CODE_REFERENCE-data.md) (OHLC packs, overlays registry)

---

## Scope

Two chart implementations + pure indicator functions consumed by Market and Training.

| File | ~Lines | Role |
|------|--------|------|
| `src/lib/indicators.ts` | ~103 | `sma`, `ema`, `rsi`, `macd`, `bollingerBands` |
| `src/lib/overlays.ts` | ~68 | Metadata registry for glossary/popover (not math) |
| `src/components/MarketChart.tsx` | ~255 | Recharts composed chart + overlay lines/panels |
| `src/components/CandlestickChart.tsx` | ~213 | Custom SVG candles for quiz snapshots |

---

## Indicator math (`indicators.ts`)

Near the top → bottom of the file:

1. **`sma(closes, period)`** — simple average; leading `null`s until period filled.
2. **`ema(closes, period)`** — seed with SMA at period−1, then recursive EMA.
3. **`rsi(closes, period=14)`** — window gain/loss average → RSI; `null` until enough bars.
4. **`macd(closes, fast=12, slow=26, signalPeriod=9)`** — returns `{ macd, signal, histogram }`.
5. **`bollingerBands(closes, period, k)`** — middle SMA ± k×std; near end of file.

All series align 1:1 with input closes; use `null` for warm-up bars.

---

## Overlay registry (`overlays.ts`)

`OVERLAYS: OverlayDef[]` near top — ids: `sma` | `ema` | `rsi` | `macd` | `bollinger`, categories `trend` | `oscillator` | `volatility`.

Helpers near end: `getOverlay(id)`, `getOverlaysByCategory(category | "all")`.

Used by Market glossary/popover and Archive indicators tab — **descriptions only**; chart math stays in `indicators.ts`.

---

## MarketChart (Recharts)

**Props** (near top of file): optional `data` (default `SAMPLE_OHLC`), booleans `showSMA` / `showEMA` / `showRSI` / `showMACD` / `showBollinger`, `height`.

**Flow (first ~40% of file):**
1. Derive `closes` from `data`.
2. Compute series with **short demo periods** (SMA 5, EMA 4, RSI 5, MACD 4/6/3, BB period 5)—tuned for short sample packs, not production TA defaults.
3. Map into `chartData` with overlay fields.
4. `ComposedChart` with `yAxisId="price"`; candles drawn via custom shape / reference areas (middle of file); overlay `Line`s and secondary axis for RSI/MACD when toggled (lower half).

Colors: bullish `#38ff14`, bearish `#ff3814` (constants near top).

**Consumers:** `Market.tsx` (full controls), `QuizModal` (indicator questions with a single overlay forced on).

---

## CandlestickChart (SVG)

**Props:** `data: OHLC[]`, `height?`, `highlightIndex?`.

Custom scale math near top (`y()` / `x()` helpers); hover tooltip state; candles as SVG rects + wicks in the render body. `highlightIndex` draws emphasis for quiz “which candle?” prompts.

**Consumers:** `QuizModal` for pattern questions via `PATTERN_OHLC[patternKey]`.

---

## Code flow (charts)

```
OHLC[] ──► closes[] ──► indicators.* ──► series
                │
                ├─► MarketChart (Recharts + toggles)
                └─► CandlestickChart (SVG + highlight)
```

---

## Safe-edit notes

- Changing indicator formulas affects Market **and** quizzes that show overlays.
- If you lengthen sample OHLC series, consider aligning MarketChart periods with real TA defaults—or document why demo periods stay short.
- Keep overlay **ids** stable (`sma`, `ema`, …); UI toggles and `quizData.overlayId` depend on them.
- Prefer extending `overlays.ts` copy when adding a new indicator UI entry, and add matching math in `indicators.ts` + a `show*` prop on `MarketChart`.

---

> Refer to AGENTS_CODE_REFERENCE.md for high-level context; details are in feature context files.
