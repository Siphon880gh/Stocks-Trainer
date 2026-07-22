import type { OHLC } from "./ohlcData";

/** Asset class slots for sample universe (UI may ignore empty classes). */
export type AssetClass = "equity" | "crypto" | "future" | "option_context";

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
const MEGA_CAP_TECH_OHLC: OHLC[] = [
  bar("08:00", 178.2, 179.4, 177.8, 179.0),
  bar("10:00", 179.0, 180.6, 178.6, 180.2),
  bar("12:00", 180.2, 180.8, 179.4, 179.6),
  bar("14:00", 179.6, 179.9, 176.8, 177.4),
  bar("16:00", 177.4, 178.8, 177.0, 178.5),
  bar("18:00", 178.5, 180.1, 178.2, 179.8),
  bar("20:00", 179.8, 181.4, 179.5, 181.0),
  bar("22:00", 181.0, 182.2, 180.6, 181.6),
  bar("00:00", 181.6, 183.0, 181.2, 182.4),
  bar("02:00", 182.4, 183.5, 181.8, 182.0),
  bar("04:00", 182.0, 183.8, 181.9, 183.2),
  bar("06:00", 183.2, 184.6, 182.8, 184.1),
];

/**
 * Broad index proxy — tight range, low wick drama (visually flatter than mega-cap).
 */
const INDEX_PROXY_OHLC: OHLC[] = [
  bar("08:00", 518.4, 519.2, 517.8, 518.9),
  bar("10:00", 518.9, 520.1, 518.5, 519.6),
  bar("12:00", 519.6, 520.0, 518.9, 519.2),
  bar("14:00", 519.2, 519.8, 518.4, 519.5),
  bar("16:00", 519.5, 520.6, 519.1, 520.2),
  bar("18:00", 520.2, 520.8, 519.6, 520.0),
  bar("20:00", 520.0, 521.2, 519.8, 520.9),
  bar("22:00", 520.9, 521.4, 520.4, 521.0),
  bar("00:00", 521.0, 521.6, 520.5, 521.3),
  bar("02:00", 521.3, 521.8, 520.7, 521.1),
  bar("04:00", 521.1, 522.0, 520.9, 521.7),
  bar("06:00", 521.7, 522.4, 521.2, 522.1),
];

/**
 * Cyclical energy — sharp selloff then bounce (opposite contour to mega-cap grind).
 */
const CYCLICAL_OHLC: OHLC[] = [
  bar("08:00", 112.5, 113.8, 111.9, 113.2),
  bar("10:00", 113.2, 114.0, 112.4, 112.8),
  bar("12:00", 112.8, 113.1, 110.2, 110.6),
  bar("14:00", 110.6, 111.0, 107.8, 108.4),
  bar("16:00", 108.4, 109.6, 107.2, 109.0),
  bar("18:00", 109.0, 110.8, 108.6, 110.4),
  bar("20:00", 110.4, 111.5, 109.8, 110.0),
  bar("22:00", 110.0, 110.4, 108.1, 108.6),
  bar("00:00", 108.6, 109.2, 106.5, 107.0),
  bar("02:00", 107.0, 108.8, 106.8, 108.5),
  bar("04:00", 108.5, 110.2, 108.2, 109.8),
  bar("06:00", 109.8, 111.4, 109.4, 111.0),
];

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
 * Non-equity class slots (E1.M1.S4).
 * `future` / `option_context` stay empty so UI can ignore them — no multi-asset product promise.
 * Crypto holds minimal SAMPLE packs (also exposed via Market adapter).
 */
export const CRYPTO_SAMPLE_PACKS: SamplePack[] = [];

export const FUTURE_SAMPLE_PACKS: SamplePack[] = [];

export const OPTION_CONTEXT_SAMPLE_PACKS: SamplePack[] = [];

export const SAMPLE_PACKS_BY_CLASS: Record<AssetClass, SamplePack[]> = {
  equity: EQUITY_SAMPLE_PACKS,
  crypto: CRYPTO_SAMPLE_PACKS,
  future: FUTURE_SAMPLE_PACKS,
  option_context: OPTION_CONTEXT_SAMPLE_PACKS,
};

export const ASSET_CLASSES: AssetClass[] = [
  "equity",
  "crypto",
  "future",
  "option_context",
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
