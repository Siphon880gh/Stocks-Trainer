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
