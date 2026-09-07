import {
  RTH_BAR_LABELS_12,
  SESSION_24H_LABELS_12,
  withBarLabels,
  type OHLC,
} from "./ohlcData";

/** Asset class slots for sample universe (UI may ignore empty classes). */
export type AssetClass =
  | "equity"
  | "crypto"
  | "future"
  | "option_context"
  | "forex";

/** Named tradeable / educational instrument identity. */
export interface Instrument {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  displayName: string;
}

/**
 * Curated OHLC pack bound to an instrument for charts, quizzes, and cases.
 * SAMPLE / STYLIZED educational data — not a live feed.
 */
export interface SamplePack {
  id: string;
  symbol: string;
  assetClass: AssetClass;
  displayName: string;
  ohlc: OHLC[];
  educationalNotes: string;
}

function bar(
  name: string,
  open: number,
  high: number,
  low: number,
  close: number
): OHLC {
  return { name, open, high, low, close };
}

/**
 * Mega-cap tech — grind higher with a mid-session dip (distinct from index/cyclical shapes).
 * STYLIZED levels inspired by large-cap tech, not a live ticker.
 */
const MEGA_CAP_TECH_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 178.2, 179.4, 177.8, 179.0),
    bar("t1", 179.0, 180.6, 178.6, 180.2),
    bar("t2", 180.2, 180.8, 179.4, 179.6),
    bar("t3", 179.6, 179.9, 176.8, 177.4),
    bar("t4", 177.4, 178.8, 177.0, 178.5),
    bar("t5", 178.5, 180.1, 178.2, 179.8),
    bar("t6", 179.8, 181.4, 179.5, 181.0),
    bar("t7", 181.0, 182.2, 180.6, 181.6),
    bar("t8", 181.6, 183.0, 181.2, 182.4),
    bar("t9", 182.4, 183.5, 181.8, 182.0),
    bar("t10", 182.0, 183.8, 181.9, 183.2),
    bar("t11", 183.2, 184.6, 182.8, 184.1),
  ],
  RTH_BAR_LABELS_12
);

/**
 * Broad index proxy — tight range, low wick drama (visually flatter than mega-cap).
 */
const INDEX_PROXY_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 518.4, 519.2, 517.8, 518.9),
    bar("t1", 518.9, 520.1, 518.5, 519.6),
    bar("t2", 519.6, 520.0, 518.9, 519.2),
    bar("t3", 519.2, 519.8, 518.4, 519.5),
    bar("t4", 519.5, 520.6, 519.1, 520.2),
    bar("t5", 520.2, 520.8, 519.6, 520.0),
    bar("t6", 520.0, 521.2, 519.8, 520.9),
    bar("t7", 520.9, 521.4, 520.4, 521.0),
    bar("t8", 521.0, 521.6, 520.5, 521.3),
    bar("t9", 521.3, 521.8, 520.7, 521.1),
    bar("t10", 521.1, 522.0, 520.9, 521.7),
    bar("t11", 521.7, 522.4, 521.2, 522.1),
  ],
  RTH_BAR_LABELS_12
);

/**
 * Cyclical energy — sharp selloff then bounce (opposite contour to mega-cap grind).
 */
const CYCLICAL_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 112.5, 113.8, 111.9, 113.2),
    bar("t1", 113.2, 114.0, 112.4, 112.8),
    bar("t2", 112.8, 113.1, 110.2, 110.6),
    bar("t3", 110.6, 111.0, 107.8, 108.4),
    bar("t4", 108.4, 109.6, 107.2, 109.0),
    bar("t5", 109.0, 110.8, 108.6, 110.4),
    bar("t6", 110.4, 111.5, 109.8, 110.0),
    bar("t7", 110.0, 110.4, 108.1, 108.6),
    bar("t8", 108.6, 109.2, 106.5, 107.0),
    bar("t9", 107.0, 108.8, 106.8, 108.5),
    bar("t10", 108.5, 110.2, 108.2, 109.8),
    bar("t11", 109.8, 111.4, 109.4, 111.0),
  ],
  RTH_BAR_LABELS_12
);

/** Gap-and-go: overnight jump, then hold and grind (≠ mega-cap mid-session dip). */
const GAP_GO_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 94.2, 94.8, 93.9, 94.5),
    bar("t1", 94.5, 95.0, 94.1, 94.4),
    bar("t2", 94.4, 94.7, 93.8, 94.0),
    bar("t3", 97.8, 98.6, 97.4, 98.2),
    bar("t4", 98.2, 98.9, 97.9, 98.6),
    bar("t5", 98.6, 99.4, 98.3, 99.1),
    bar("t6", 99.1, 99.6, 98.7, 99.3),
    bar("t7", 99.3, 100.2, 99.0, 99.9),
    bar("t8", 99.9, 100.4, 99.5, 100.1),
    bar("t9", 100.1, 100.8, 99.8, 100.5),
    bar("t10", 100.5, 101.2, 100.2, 100.9),
    bar("t11", 100.9, 101.6, 100.6, 101.4),
  ],
  RTH_BAR_LABELS_12
);

/** Tight squeeze: range collapses, then a modest break (≠ index-proxy calm drift). */
const SQUEEZE_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 162.4, 164.8, 161.2, 163.6),
    bar("t1", 163.6, 165.0, 162.8, 164.2),
    bar("t2", 164.2, 164.9, 163.5, 164.0),
    bar("t3", 164.0, 164.5, 163.7, 164.1),
    bar("t4", 164.1, 164.4, 163.9, 164.2),
    bar("t5", 164.2, 164.4, 164.0, 164.3),
    bar("t6", 164.3, 164.5, 164.1, 164.2),
    bar("t7", 164.2, 164.4, 164.0, 164.1),
    bar("t8", 164.1, 165.6, 164.0, 165.3),
    bar("t9", 165.3, 166.2, 165.0, 165.9),
    bar("t10", 165.9, 166.4, 165.5, 166.0),
    bar("t11", 166.0, 166.8, 165.7, 166.5),
  ],
  RTH_BAR_LABELS_12
);

/** Rally that fails and gives back the thrust (≠ gap-and-go hold, ≠ cyclical dump-then-bounce). */
const FAIL_RALLY_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 28.4, 28.8, 28.1, 28.6),
    bar("t1", 28.6, 29.2, 28.4, 29.0),
    bar("t2", 29.0, 29.8, 28.8, 29.6),
    bar("t3", 29.6, 30.4, 29.4, 30.2),
    bar("t4", 30.2, 30.8, 29.9, 30.0),
    bar("t5", 30.0, 30.3, 29.2, 29.4),
    bar("t6", 29.4, 29.7, 28.6, 28.8),
    bar("t7", 28.8, 29.0, 28.0, 28.2),
    bar("t8", 28.2, 28.5, 27.4, 27.6),
    bar("t9", 27.6, 27.9, 27.0, 27.2),
    bar("t10", 27.2, 27.5, 26.6, 26.8),
    bar("t11", 26.8, 27.1, 26.3, 26.5),
  ],
  RTH_BAR_LABELS_12
);

/** Quiet grind, then a gap lower that stays offered (≠ fail-rally staircase, ≠ cyclical bounce). */
const DIV_CUT_OHLC: OHLC[] = withBarLabels(
  [
    bar("t0", 16.8, 17.0, 16.6, 16.9),
    bar("t1", 16.9, 17.1, 16.7, 16.8),
    bar("t2", 16.8, 17.0, 16.6, 16.7),
    bar("t3", 16.7, 16.9, 16.5, 16.6),
    bar("t4", 16.6, 16.8, 16.4, 16.5),
    bar("t5", 15.2, 15.4, 14.6, 14.8),
    bar("t6", 14.8, 15.0, 14.3, 14.5),
    bar("t7", 14.5, 14.7, 14.1, 14.3),
    bar("t8", 14.3, 14.6, 14.0, 14.2),
    bar("t9", 14.2, 14.4, 13.8, 14.0),
    bar("t10", 14.0, 14.2, 13.7, 13.9),
    bar("t11", 13.9, 14.1, 13.6, 13.8),
  ],
  RTH_BAR_LABELS_12
);

/** P0 equity floor: ≥3 packs with distinct OHLC shapes (not scaled clones). */
export const EQUITY_SAMPLE_PACKS: SamplePack[] = [
  {
    id: "eq-mega-tech",
    symbol: "AAPL.S",
    assetClass: "equity",
    displayName: "Mega-Cap Tech (SAMPLE)",
    ohlc: MEGA_CAP_TECH_OHLC,
    educationalNotes:
      "SAMPLE mega-cap tech path: slow grind up with a mid-session dip. STYLIZED for literacy charts — not a live feed.",
  },
  {
    id: "eq-index-proxy",
    symbol: "SPY.S",
    assetClass: "equity",
    displayName: "Index Proxy (SAMPLE)",
    ohlc: INDEX_PROXY_OHLC,
    educationalNotes:
      "SAMPLE broad index proxy: tight range, calmer wicks than single-name tech. STYLIZED educational series.",
  },
  {
    id: "eq-cyclical",
    symbol: "XOM.S",
    assetClass: "equity",
    displayName: "Cyclical Energy (SAMPLE)",
    ohlc: CYCLICAL_OHLC,
    educationalNotes:
      "SAMPLE cyclical name: sharp selloff then partial recovery. Shape differs from mega-cap and index packs.",
  },
  {
    id: "eq-gap-go",
    symbol: "NKE.S",
    assetClass: "equity",
    displayName: "Gap-and-Go Retail (SAMPLE)",
    ohlc: GAP_GO_OHLC,
    educationalNotes:
      "SAMPLE single-name: opens with a gap higher, then holds the gap and grinds. STYLIZED — not a live feed. Distinct from mega-cap dip-and-recover.",
  },
  {
    id: "eq-squeeze",
    symbol: "JNJ.S",
    assetClass: "equity",
    displayName: "Tight Squeeze Defensive (SAMPLE)",
    ohlc: SQUEEZE_OHLC,
    educationalNotes:
      "SAMPLE defensive name: shrinking range (squeeze) then a small break. Distinct from index-proxy quiet range. STYLIZED educational series.",
  },
  {
    id: "eq-fail-rally",
    symbol: "PFE.S",
    assetClass: "equity",
    displayName: "Failed Rally Pharma (SAMPLE)",
    ohlc: FAIL_RALLY_OHLC,
    educationalNotes:
      "SAMPLE single-name: a rally that fails and gives back the thrust. Distinct from gap-and-go hold and cyclical dump-then-bounce. STYLIZED — not a live feed.",
  },
  {
    id: "eq-div-cut",
    symbol: "T.S",
    assetClass: "equity",
    displayName: "Dividend-Cut Telco (SAMPLE)",
    ohlc: DIV_CUT_OHLC,
    educationalNotes:
      "SAMPLE income name: quiet grind, then a gap lower that stays offered. Educational tape for a payout-cut shape — STYLIZED, not a live feed.",
  },
];

/**
 * Non-equity class slots.
 * Crypto: seeded via markets.ts. Futures E9.M1 · options-context E9.M2 · forex E9.M4.
 */
export const CRYPTO_SAMPLE_PACKS: SamplePack[] = [];

/** Index-style future: stair-step grind with a mid-session pause (≠ equity mega-cap shape). */
const INDEX_FUTURE_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 5180, 5195, 5174, 5190),
  bar("10:00", 5190, 5210, 5186, 5204),
  bar("12:00", 5204, 5208, 5192, 5196),
  bar("14:00", 5196, 5222, 5190, 5218),
  bar("16:00", 5218, 5230, 5210, 5224),
  bar("18:00", 5224, 5228, 5208, 5212),
  bar("20:00", 5212, 5240, 5206, 5236),
  bar("22:00", 5236, 5250, 5230, 5244),
  bar("00:00", 5244, 5252, 5238, 5248),
  bar("02:00", 5248, 5266, 5242, 5260),
  bar("04:00", 5260, 5264, 5246, 5250),
  bar("06:00", 5250, 5272, 5248, 5268),
], SESSION_24H_LABELS_12)

/** Energy-style future: sharp dump then partial reclaim (≠ index future grind). */
const ENERGY_FUTURE_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 78.4, 79.1, 77.9, 78.8),
  bar("10:00", 78.8, 79.6, 78.2, 79.2),
  bar("12:00", 79.2, 79.4, 76.5, 76.9),
  bar("14:00", 76.9, 77.2, 74.8, 75.1),
  bar("16:00", 75.1, 75.8, 73.9, 74.4),
  bar("18:00", 74.4, 75.6, 74.0, 75.2),
  bar("20:00", 75.2, 76.8, 74.9, 76.4),
  bar("22:00", 76.4, 77.0, 75.6, 76.1),
  bar("00:00", 76.1, 76.5, 74.8, 75.0),
  bar("02:00", 75.0, 75.9, 74.6, 75.6),
  bar("04:00", 75.6, 76.2, 75.1, 75.8),
  bar("06:00", 75.8, 76.9, 75.4, 76.6),
], SESSION_24H_LABELS_12)

/** Metals-style future: overlapping range (≠ index grind, ≠ energy dump). */
const METALS_FUTURE_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 2340, 2348, 2334, 2342),
  bar("10:00", 2342, 2351, 2336, 2338),
  bar("12:00", 2338, 2346, 2332, 2344),
  bar("14:00", 2344, 2350, 2338, 2341),
  bar("16:00", 2341, 2347, 2335, 2345),
  bar("18:00", 2345, 2352, 2339, 2340),
  bar("20:00", 2340, 2348, 2334, 2346),
  bar("22:00", 2346, 2351, 2338, 2343),
  bar("00:00", 2343, 2349, 2337, 2341),
  bar("02:00", 2341, 2348, 2335, 2344),
  bar("04:00", 2344, 2350, 2338, 2342),
  bar("06:00", 2342, 2347, 2336, 2340),
], SESSION_24H_LABELS_12)

/** Rates-style future: stair-step lower (≠ index grind higher). */
const RATES_FUTURE_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 112.40, 112.55, 112.28, 112.32),
  bar("10:00", 112.32, 112.38, 112.10, 112.14),
  bar("12:00", 112.14, 112.22, 111.98, 112.02),
  bar("14:00", 112.02, 112.08, 111.84, 111.88),
  bar("16:00", 111.88, 111.96, 111.70, 111.74),
  bar("18:00", 111.74, 111.82, 111.58, 111.62),
  bar("20:00", 111.62, 111.70, 111.48, 111.52),
  bar("22:00", 111.52, 111.60, 111.36, 111.40),
  bar("00:00", 111.40, 111.48, 111.22, 111.26),
  bar("02:00", 111.26, 111.34, 111.10, 111.14),
  bar("04:00", 111.14, 111.22, 110.98, 111.02),
  bar("06:00", 111.02, 111.10, 110.86, 110.90),
], SESSION_24H_LABELS_12)

/** Ag-style future: coil then expansion (≠ energy dump-reclaim). */
const AG_FUTURE_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 458, 461, 456, 459),
  bar("10:00", 459, 462, 457, 460),
  bar("12:00", 460, 461, 458, 459),
  bar("14:00", 459, 460, 457, 458),
  bar("16:00", 458, 459, 457, 458),
  bar("18:00", 458, 459, 456, 457),
  bar("20:00", 457, 458, 456, 457),
  bar("22:00", 457, 472, 456, 470),
  bar("00:00", 470, 474, 467, 469),
  bar("02:00", 469, 473, 466, 471),
  bar("04:00", 471, 475, 468, 472),
  bar("06:00", 472, 476, 470, 474),
], SESSION_24H_LABELS_12)

/** Nat-gas dump with no reclaim (≠ CL dump-then-bounce, ≠ rates stair, ≠ ag coil-expand). */
const NG_FUTURE_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 3.42, 3.48, 3.38, 3.46),
  bar("10:00", 3.46, 3.52, 3.40, 3.44),
  bar("12:00", 3.44, 3.48, 3.12, 3.16),
  bar("14:00", 3.16, 3.20, 2.88, 2.92),
  bar("16:00", 2.92, 2.98, 2.74, 2.78),
  bar("18:00", 2.78, 2.84, 2.68, 2.72),
  bar("20:00", 2.72, 2.76, 2.62, 2.66),
  bar("22:00", 2.66, 2.70, 2.56, 2.60),
  bar("00:00", 2.60, 2.64, 2.50, 2.54),
  bar("02:00", 2.54, 2.58, 2.46, 2.50),
  bar("04:00", 2.50, 2.54, 2.42, 2.46),
  bar("06:00", 2.46, 2.50, 2.38, 2.42),
], SESSION_24H_LABELS_12)

/** Coffee poke-and-fail (≠ NG dump-no-reclaim, ≠ CL dump-then-bounce, ≠ ag coil-expand). */
const KC_FUTURE_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 248.2, 249.0, 247.8, 248.6),
  bar("10:00", 248.6, 249.4, 248.0, 248.8),
  bar("12:00", 248.8, 249.6, 248.2, 249.2),
  bar("14:00", 249.2, 252.8, 249.0, 249.4),
  bar("16:00", 249.4, 249.8, 246.2, 246.6),
  bar("18:00", 246.6, 247.2, 244.8, 245.2),
  bar("20:00", 245.2, 245.8, 243.4, 243.8),
  bar("22:00", 243.8, 244.4, 242.0, 242.6),
  bar("00:00", 242.6, 243.2, 241.2, 241.8),
  bar("02:00", 241.8, 242.4, 240.6, 241.2),
  bar("04:00", 241.2, 241.8, 239.8, 240.4),
  bar("06:00", 240.4, 241.0, 239.2, 239.6),
], SESSION_24H_LABELS_12)

/** E9.M1 — Futures SAMPLE packs (≥2 distinct shapes). */
export const FUTURE_SAMPLE_PACKS: SamplePack[] = [
  {
    id: "fut-index",
    symbol: "ES.F",
    assetClass: "future",
    displayName: "Index Future (SAMPLE)",
    ohlc: INDEX_FUTURE_OHLC,
    educationalNotes:
      "SAMPLE index-style future: stair-step grind with a midday pause. STYLIZED educational tape — not a live contract.",
  },
  {
    id: "fut-energy",
    symbol: "CL.F",
    assetClass: "future",
    displayName: "Energy Future (SAMPLE)",
    ohlc: ENERGY_FUTURE_OHLC,
    educationalNotes:
      "SAMPLE energy-style future: sharp midday dump then partial reclaim. Distinct from index-future grind. STYLIZED — not a live contract.",
  },
  {
    id: "fut-metals",
    symbol: "GC.F",
    assetClass: "future",
    displayName: "Metals Future (SAMPLE)",
    ohlc: METALS_FUTURE_OHLC,
    educationalNotes:
      "SAMPLE metals-style future: overlapping range, no grind and no dump. STYLIZED educational tape — not a live contract.",
  },
  {
    id: "fut-rates",
    symbol: "ZN.F",
    assetClass: "future",
    displayName: "Rates Future (SAMPLE)",
    ohlc: RATES_FUTURE_OHLC,
    educationalNotes:
      "SAMPLE rates-style future: slow stair-step lower (distinct from index-future grind up). Not a live contract.",
  },
  {
    id: "fut-ag",
    symbol: "ZC.F",
    assetClass: "future",
    displayName: "Ag Future · Squeeze (SAMPLE)",
    ohlc: AG_FUTURE_OHLC,
    educationalNotes:
      "SAMPLE agricultural-style future: coil then a one-bar expansion. Distinct from energy dump. STYLIZED — not a live contract.",
  },
  {
    id: "fut-ng",
    symbol: "NG.F",
    assetClass: "future",
    displayName: "Nat Gas Future · Dump No Reclaim (SAMPLE)",
    ohlc: NG_FUTURE_OHLC,
    educationalNotes:
      "SAMPLE nat-gas future: dump that keeps leaking — no bounce-back. Distinct from CL dump-reclaim, rates stair-down, and ag coil-expand. STYLIZED — not a live contract.",
  },
  {
    id: "fut-kc",
    symbol: "KC.F",
    assetClass: "future",
    displayName: "Coffee Future · Failed Break (SAMPLE)",
    ohlc: KC_FUTURE_OHLC,
    educationalNotes:
      "SAMPLE coffee future: poke through a high that fails, then the tape leaks. Distinct from NG dump-no-reclaim, CL dump-reclaim, and ag coil-expand. STYLIZED — not a live contract.",
  },
];

/** Underlying grind into an event window — options *context* (not a chain). */
const OPT_CTX_EVENT_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 142.0, 143.2, 141.6, 142.8),
  bar("10:00", 142.8, 143.5, 142.2, 142.6),
  bar("12:00", 142.6, 143.0, 141.8, 142.2),
  bar("14:00", 142.2, 142.8, 141.4, 141.9),
  bar("16:00", 141.9, 142.4, 141.2, 141.6),
  bar("18:00", 141.6, 142.0, 140.8, 141.2),
  bar("20:00", 141.2, 141.8, 140.6, 141.0),
  bar("22:00", 141.0, 141.5, 140.4, 140.9),
  bar("00:00", 140.9, 141.6, 140.5, 141.4),
  bar("02:00", 141.4, 142.2, 141.0, 141.8),
  bar("04:00", 141.8, 142.6, 141.5, 142.4),
  bar("06:00", 142.4, 143.8, 142.0, 143.5),
], RTH_BAR_LABELS_12)

/** Underlying after a volatility spike — wide range, then settle. */
const OPT_CTX_VOL_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 88.5, 89.2, 87.8, 88.9),
  bar("10:00", 88.9, 90.5, 88.0, 90.1),
  bar("12:00", 90.1, 92.8, 89.4, 91.6),
  bar("14:00", 91.6, 93.2, 88.5, 89.0),
  bar("16:00", 89.0, 90.2, 86.8, 87.4),
  bar("18:00", 87.4, 88.6, 86.2, 88.0),
  bar("20:00", 88.0, 89.4, 87.5, 89.1),
  bar("22:00", 89.1, 89.8, 88.2, 88.6),
  bar("00:00", 88.6, 89.0, 87.9, 88.4),
  bar("02:00", 88.4, 88.9, 87.6, 88.1),
  bar("04:00", 88.1, 88.7, 87.8, 88.3),
  bar("06:00", 88.3, 89.2, 88.0, 88.8),
], RTH_BAR_LABELS_12)

/** Post-event settle: wide then compressed (≠ vol-spike mid-tape). */
const OPT_CTX_SETTLE_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 76.2, 78.4, 75.1, 77.8),
  bar("10:00", 77.8, 79.6, 76.4, 76.8),
  bar("12:00", 76.8, 77.4, 75.6, 76.1),
  bar("14:00", 76.1, 76.6, 75.8, 76.2),
  bar("16:00", 76.2, 76.5, 75.9, 76.3),
  bar("18:00", 76.3, 76.6, 76.0, 76.4),
  bar("20:00", 76.4, 76.7, 76.1, 76.3),
  bar("22:00", 76.3, 76.6, 76.0, 76.4),
  bar("00:00", 76.4, 76.7, 76.2, 76.5),
  bar("02:00", 76.5, 76.8, 76.3, 76.6),
  bar("04:00", 76.6, 76.9, 76.4, 76.7),
  bar("06:00", 76.7, 77.0, 76.5, 76.8),
], RTH_BAR_LABELS_12)

/** Pre-event coil: range shrinks into the last bars (≠ event grind higher). */
const OPT_CTX_COIL_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 210.4, 213.2, 208.8, 211.6),
  bar("10:00", 211.6, 213.8, 210.2, 212.0),
  bar("12:00", 212.0, 213.0, 210.8, 211.4),
  bar("14:00", 211.4, 212.2, 210.6, 211.2),
  bar("16:00", 211.2, 211.8, 210.8, 211.1),
  bar("18:00", 211.1, 211.6, 210.9, 211.2),
  bar("20:00", 211.2, 211.5, 211.0, 211.3),
  bar("22:00", 211.3, 211.6, 211.1, 211.2),
  bar("00:00", 211.2, 211.5, 211.0, 211.3),
  bar("02:00", 211.3, 211.6, 211.1, 211.4),
  bar("04:00", 211.4, 211.7, 211.2, 211.5),
  bar("06:00", 211.5, 211.8, 211.3, 211.4),
], RTH_BAR_LABELS_12)

/** Failed breakout underlying: poke then fail (≠ settle compression). */
const OPT_CTX_FAIL_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 54.2, 54.8, 53.8, 54.4),
  bar("10:00", 54.4, 55.1, 54.0, 54.7),
  bar("12:00", 54.7, 55.4, 54.3, 55.0),
  bar("14:00", 55.0, 56.8, 54.9, 56.4),
  bar("16:00", 56.4, 56.9, 55.2, 55.4),
  bar("18:00", 55.4, 55.8, 54.6, 54.9),
  bar("20:00", 54.9, 55.3, 54.4, 54.7),
  bar("22:00", 54.7, 55.1, 54.2, 54.5),
  bar("00:00", 54.5, 54.9, 54.1, 54.4),
  bar("02:00", 54.4, 54.8, 54.0, 54.3),
  bar("04:00", 54.3, 54.7, 53.9, 54.2),
  bar("06:00", 54.2, 54.6, 53.8, 54.0),
], RTH_BAR_LABELS_12)

/** Round-top underlying: slow rollover after a high (≠ failed poke, ≠ vol-spike, ≠ coil). */
const OPT_CTX_ROUND_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 186.0, 188.2, 185.2, 187.4),
  bar("10:00", 187.4, 190.0, 186.6, 189.2),
  bar("12:00", 189.2, 192.0, 188.4, 191.4),
  bar("14:00", 191.4, 193.6, 190.8, 192.8),
  bar("16:00", 192.8, 193.4, 191.2, 191.6),
  bar("18:00", 191.6, 192.0, 189.8, 190.2),
  bar("20:00", 190.2, 190.8, 188.6, 189.0),
  bar("22:00", 189.0, 189.6, 187.4, 187.8),
  bar("00:00", 187.8, 188.4, 186.4, 186.8),
  bar("02:00", 186.8, 187.4, 185.6, 186.0),
  bar("04:00", 186.0, 186.6, 184.8, 185.2),
  bar("06:00", 185.2, 185.8, 184.2, 184.6),
], RTH_BAR_LABELS_12)

/** Dump-no-reclaim underlying: gap lower then leak (≠ failed poke, ≠ vol-spike settle, ≠ round-top). */
const OPT_CTX_DUMP_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 64.2, 64.8, 63.8, 64.4),
  bar("10:00", 64.4, 64.9, 63.6, 63.9),
  bar("12:00", 63.9, 64.2, 58.4, 58.8),
  bar("14:00", 58.8, 59.4, 56.2, 56.6),
  bar("16:00", 56.6, 57.2, 54.8, 55.1),
  bar("18:00", 55.1, 55.6, 53.6, 53.9),
  bar("20:00", 53.9, 54.4, 52.4, 52.7),
  bar("22:00", 52.7, 53.1, 51.4, 51.7),
  bar("00:00", 51.7, 52.0, 50.6, 50.9),
  bar("02:00", 50.9, 51.2, 49.8, 50.1),
  bar("04:00", 50.1, 50.4, 49.2, 49.5),
  bar("06:00", 49.5, 49.8, 48.6, 48.9),
], RTH_BAR_LABELS_12)

/** E9.M2 — Options-context SAMPLE packs (underlying education; not LIVE chains / Greeks). */
export const OPTION_CONTEXT_SAMPLE_PACKS: SamplePack[] = [
  {
    id: "opt-ctx-event",
    symbol: "UND.OPT",
    assetClass: "option_context",
    displayName: "Underlying · Event Window (SAMPLE)",
    ohlc: OPT_CTX_EVENT_OHLC,
    educationalNotes:
      "SAMPLE options *context*: underlying tape into an event. Educational chart only — not a LIVE options chain, quotes, or Greeks engine.",
  },
  {
    id: "opt-ctx-vol",
    symbol: "VOL.OPT",
    assetClass: "option_context",
    displayName: "Underlying · Vol Spike (SAMPLE)",
    ohlc: OPT_CTX_VOL_OHLC,
    educationalNotes:
      "SAMPLE options *context*: wide underlying range after a volatility spike, then settle. Not a LIVE chain / pricing product.",
  },
  {
    id: "opt-ctx-settle",
    symbol: "SET.OPT",
    assetClass: "option_context",
    displayName: "Underlying · Post-Event Settle (SAMPLE)",
    ohlc: OPT_CTX_SETTLE_OHLC,
    educationalNotes:
      "SAMPLE options *context*: after the event print, range shrinks and the underlying settles. Educational chart only — not a LIVE chain or Greeks.",
  },
  {
    id: "opt-ctx-coil",
    symbol: "COIL.OPT",
    assetClass: "option_context",
    displayName: "Underlying · Pre-Event Coil (SAMPLE)",
    ohlc: OPT_CTX_COIL_OHLC,
    educationalNotes:
      "SAMPLE options *context*: shrinking range into an event. Not a LIVE options chain, quotes, or pricing engine.",
  },
  {
    id: "opt-ctx-fail",
    symbol: "FAIL.OPT",
    assetClass: "option_context",
    displayName: "Underlying · Failed Breakout (SAMPLE)",
    ohlc: OPT_CTX_FAIL_OHLC,
    educationalNotes:
      "SAMPLE options *context*: underlying pokes a high then fails back into the range. Educational tape — no chain / Greeks.",
  },
  {
    id: "opt-ctx-round",
    symbol: "ROUND.OPT",
    assetClass: "option_context",
    displayName: "Underlying · Round Top (SAMPLE)",
    ohlc: OPT_CTX_ROUND_OHLC,
    educationalNotes:
      "SAMPLE options *context*: the stock rolls over slowly after a high — not a failed poke, not a vol spike, not a coil. Educational tape — no chain / Greeks.",
  },
  {
    id: "opt-ctx-dump",
    symbol: "DUMP.OPT",
    assetClass: "option_context",
    displayName: "Underlying · Dump No Reclaim (SAMPLE)",
    ohlc: OPT_CTX_DUMP_OHLC,
    educationalNotes:
      "SAMPLE options *context*: the stock gaps down and keeps leaking — no bounce-back. Distinct from failed poke, vol-spike settle, and round-top. Educational tape — no chain / Greeks.",
  },
];

/** Major FX: slow drift higher (≠ cross pair shape). STYLIZED quote levels. */
const FX_MAJOR_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 1.0842, 1.0855, 1.0836, 1.0850),
  bar("10:00", 1.0850, 1.0868, 1.0844, 1.0862),
  bar("12:00", 1.0862, 1.0866, 1.0848, 1.0852),
  bar("14:00", 1.0852, 1.0874, 1.0849, 1.0870),
  bar("16:00", 1.0870, 1.0882, 1.0864, 1.0876),
  bar("18:00", 1.0876, 1.0880, 1.0858, 1.0864),
  bar("20:00", 1.0864, 1.0890, 1.0860, 1.0886),
  bar("22:00", 1.0886, 1.0898, 1.0878, 1.0892),
  bar("00:00", 1.0892, 1.0900, 1.0884, 1.0896),
  bar("02:00", 1.0896, 1.0912, 1.0890, 1.0908),
  bar("04:00", 1.0908, 1.0914, 1.0896, 1.0902),
  bar("06:00", 1.0902, 1.0920, 1.0898, 1.0916),
], SESSION_24H_LABELS_12)

/** Cross FX: sharp risk-off drop then partial bounce. */
const FX_CROSS_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 157.2, 157.8, 156.9, 157.5),
  bar("10:00", 157.5, 158.1, 157.0, 157.8),
  bar("12:00", 157.8, 158.0, 155.4, 155.8),
  bar("14:00", 155.8, 156.2, 154.1, 154.6),
  bar("16:00", 154.6, 155.5, 153.8, 155.0),
  bar("18:00", 155.0, 156.4, 154.7, 156.1),
  bar("20:00", 156.1, 156.8, 155.5, 156.0),
  bar("22:00", 156.0, 156.5, 155.2, 155.6),
  bar("00:00", 155.6, 156.0, 154.9, 155.2),
  bar("02:00", 155.2, 155.9, 154.8, 155.5),
  bar("04:00", 155.5, 156.2, 155.1, 155.9),
  bar("06:00", 155.9, 156.6, 155.4, 156.3),
], SESSION_24H_LABELS_12)

/** Commodity FX: chop then directional leg (≠ EURUSD slow drift). */
const FX_AUDUSD_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 0.6620, 0.6634, 0.6612, 0.6628),
  bar("10:00", 0.6628, 0.6640, 0.6616, 0.6622),
  bar("12:00", 0.6622, 0.6636, 0.6610, 0.6630),
  bar("14:00", 0.6630, 0.6638, 0.6618, 0.6624),
  bar("16:00", 0.6624, 0.6632, 0.6614, 0.6626),
  bar("18:00", 0.6626, 0.6688, 0.6620, 0.6682),
  bar("20:00", 0.6682, 0.6704, 0.6674, 0.6696),
  bar("22:00", 0.6696, 0.6710, 0.6688, 0.6702),
  bar("00:00", 0.6702, 0.6714, 0.6692, 0.6708),
  bar("02:00", 0.6708, 0.6720, 0.6698, 0.6714),
  bar("04:00", 0.6714, 0.6722, 0.6704, 0.6710),
  bar("06:00", 0.6710, 0.6724, 0.6706, 0.6718),
], SESSION_24H_LABELS_12)

/** Range-bound major: same band, no drift (≠ EURUSD). */
const FX_GBPUSD_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 1.2740, 1.2762, 1.2728, 1.2754),
  bar("10:00", 1.2754, 1.2768, 1.2732, 1.2738),
  bar("12:00", 1.2738, 1.2756, 1.2726, 1.2750),
  bar("14:00", 1.2750, 1.2764, 1.2734, 1.2742),
  bar("16:00", 1.2742, 1.2760, 1.2728, 1.2756),
  bar("18:00", 1.2756, 1.2766, 1.2736, 1.2740),
  bar("20:00", 1.2740, 1.2758, 1.2728, 1.2752),
  bar("22:00", 1.2752, 1.2764, 1.2734, 1.2738),
  bar("00:00", 1.2738, 1.2756, 1.2726, 1.2748),
  bar("02:00", 1.2748, 1.2762, 1.2732, 1.2744),
  bar("04:00", 1.2744, 1.2760, 1.2730, 1.2750),
  bar("06:00", 1.2750, 1.2764, 1.2734, 1.2746),
], SESSION_24H_LABELS_12)

/** Spike-fade cross (≠ USDJPY dump then reclaim). */
const FX_EURJPY_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 164.20, 164.45, 164.02, 164.28),
  bar("10:00", 164.28, 164.50, 164.10, 164.22),
  bar("12:00", 164.22, 165.80, 164.18, 165.62),
  bar("14:00", 165.62, 165.90, 164.70, 164.85),
  bar("16:00", 164.85, 165.10, 164.40, 164.52),
  bar("18:00", 164.52, 164.78, 164.20, 164.38),
  bar("20:00", 164.38, 164.60, 164.12, 164.30),
  bar("22:00", 164.30, 164.52, 164.08, 164.24),
  bar("00:00", 164.24, 164.48, 164.04, 164.20),
  bar("02:00", 164.20, 164.42, 164.00, 164.18),
  bar("04:00", 164.18, 164.40, 163.98, 164.16),
  bar("06:00", 164.16, 164.38, 163.96, 164.12),
], SESSION_24H_LABELS_12)

/** Safe-haven CHF grind lower (≠ EURUSD drift up, USDJPY dump-reclaim, GBP range, EURJPY spike-fade). */
const FX_USDCHF_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 0.8920, 0.8932, 0.8914, 0.8918),
  bar("10:00", 0.8918, 0.8924, 0.8906, 0.8910),
  bar("12:00", 0.8910, 0.8916, 0.8898, 0.8902),
  bar("14:00", 0.8902, 0.8908, 0.8888, 0.8892),
  bar("16:00", 0.8892, 0.8898, 0.8878, 0.8884),
  bar("18:00", 0.8884, 0.8890, 0.8870, 0.8874),
  bar("20:00", 0.8874, 0.8880, 0.8860, 0.8866),
  bar("22:00", 0.8866, 0.8872, 0.8852, 0.8858),
  bar("00:00", 0.8858, 0.8864, 0.8844, 0.8850),
  bar("02:00", 0.8850, 0.8856, 0.8836, 0.8842),
  bar("04:00", 0.8842, 0.8848, 0.8828, 0.8834),
  bar("06:00", 0.8834, 0.8840, 0.8820, 0.8826),
], SESSION_24H_LABELS_12)

/** Expanding two-way cross (≠ GBPUSD tight band, EURJPY one spike-fade, USDJPY dump-reclaim). */
const FX_GBPJPY_OHLC: OHLC[] = withBarLabels([
  bar("08:00", 191.40, 191.80, 191.20, 191.55),
  bar("10:00", 191.55, 192.10, 191.10, 191.70),
  bar("12:00", 191.70, 193.20, 190.80, 192.40),
  bar("14:00", 192.40, 194.10, 190.40, 191.20),
  bar("16:00", 191.20, 193.80, 189.90, 192.80),
  bar("18:00", 192.80, 194.60, 191.40, 193.20),
  bar("20:00", 193.20, 194.20, 192.00, 192.60),
  bar("22:00", 192.60, 194.00, 191.80, 193.40),
  bar("00:00", 193.40, 194.80, 192.20, 193.00),
  bar("02:00", 193.00, 194.40, 191.60, 192.20),
  bar("04:00", 192.20, 193.60, 191.20, 192.80),
  bar("06:00", 192.80, 194.20, 191.80, 193.10),
], SESSION_24H_LABELS_12)

/** E9.M4 — Forex SAMPLE packs (spot FX browse after equities fluency). */
export const FOREX_SAMPLE_PACKS: SamplePack[] = [
  {
    id: "fx-eurusd",
    symbol: "EURUSD",
    assetClass: "forex",
    displayName: "EUR/USD Major (SAMPLE)",
    ohlc: FX_MAJOR_OHLC,
    educationalNotes:
      "SAMPLE spot FX major: slow upward drift. STYLIZED — not a LIVE quote. Equities (stocks) remain the traditional retail path in this app.",
  },
  {
    id: "fx-usdjpy",
    symbol: "USDJPY",
    assetClass: "forex",
    displayName: "USD/JPY Cross (SAMPLE)",
    ohlc: FX_CROSS_OHLC,
    educationalNotes:
      "SAMPLE spot FX cross: risk-off dump then partial reclaim (distinct from EURUSD drift). Not LIVE. Traditional retail stocks = Equities class.",
  },
  {
    id: "fx-audusd",
    symbol: "AUDUSD",
    assetClass: "forex",
    displayName: "AUD/USD Commodity (SAMPLE)",
    ohlc: FX_AUDUSD_OHLC,
    educationalNotes:
      "SAMPLE commodity FX: choppy mid-session then a directional leg. STYLIZED — not a LIVE quote. Equities remain the traditional retail path.",
  },
  {
    id: "fx-gbpusd",
    symbol: "GBPUSD",
    assetClass: "forex",
    displayName: "GBP/USD Range (SAMPLE)",
    ohlc: FX_GBPUSD_OHLC,
    educationalNotes:
      "SAMPLE range-bound major: repeated tests of the same band. Distinct from EURUSD drift. Not LIVE.",
  },
  {
    id: "fx-eurjpy",
    symbol: "EURJPY",
    assetClass: "forex",
    displayName: "EUR/JPY Spike Fade (SAMPLE)",
    ohlc: FX_EURJPY_OHLC,
    educationalNotes:
      "SAMPLE cross: sharp spike then fade back. Distinct from USDJPY dump-reclaim. Not a live FX desk.",
  },
  {
    id: "fx-usdchf",
    symbol: "USDCHF",
    assetClass: "forex",
    displayName: "USD/CHF Grind Lower (SAMPLE)",
    ohlc: FX_USDCHF_OHLC,
    educationalNotes:
      "SAMPLE major: slow stair-step lower (CHF bid). Distinct from EURUSD drift up, USDJPY dump-reclaim, GBP range, and EURJPY spike-fade. STYLIZED — not a live FX desk.",
  },
  {
    id: "fx-gbpjpy",
    symbol: "GBPJPY",
    assetClass: "forex",
    displayName: "GBP/JPY Expanding Range (SAMPLE)",
    ohlc: FX_GBPJPY_OHLC,
    educationalNotes:
      "SAMPLE cross: range gets wider both ways, not a tight GBP band and not a one-bar EURJPY spike-fade. STYLIZED — not a live FX desk.",
  },
];

export const SAMPLE_PACKS_BY_CLASS: Record<AssetClass, SamplePack[]> = {
  equity: EQUITY_SAMPLE_PACKS,
  crypto: CRYPTO_SAMPLE_PACKS,
  future: FUTURE_SAMPLE_PACKS,
  option_context: OPTION_CONTEXT_SAMPLE_PACKS,
  forex: FOREX_SAMPLE_PACKS,
};

export const ASSET_CLASSES: AssetClass[] = [
  "equity",
  "crypto",
  "future",
  "option_context",
  "forex",
];

export function instrumentFromPack(pack: SamplePack): Instrument {
  return {
    id: pack.id,
    symbol: pack.symbol,
    assetClass: pack.assetClass,
    displayName: pack.displayName,
  };
}

export function getSamplePack(id: string): SamplePack | undefined {
  for (const packs of Object.values(SAMPLE_PACKS_BY_CLASS)) {
    const found = packs.find((p) => p.id === id);
    if (found) return found;
  }
  return undefined;
}

export function listSamplePacks(assetClass?: AssetClass): SamplePack[] {
  if (!assetClass) {
    return ASSET_CLASSES.flatMap((cls) => SAMPLE_PACKS_BY_CLASS[cls]);
  }
  return [...(SAMPLE_PACKS_BY_CLASS[assetClass] ?? [])];
}
