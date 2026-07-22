/**
 * Pluggable market OHLC feed (E8.M1).
 * Default SAMPLE; alternate DELAYED replay of the same packs — never LIVE.
 */

import type { OHLC } from "./ohlcData";
import { getMarket, MARKETS } from "./markets";

export type MarketDataMode = "sample" | "delayed";

export type MarketDataProviderId = "sample" | "delayed";

export interface MarketDataProvider {
  id: MarketDataProviderId;
  mode: MarketDataMode;
  /** Terminal-tone badge copy — SAMPLE or DELAYED only. */
  label: string;
  getOhlc(marketId: string): OHLC[] | undefined;
  listMarketIds(): string[];
}

export const MARKET_DATA_PROVIDER_STORAGE_KEY = "analysis_core_market_data_provider_v1";

const PROVIDER_IDS: MarketDataProviderId[] = ["sample", "delayed"];

function listIds(): string[] {
  return MARKETS.map((m) => m.id);
}

function sampleOhlc(marketId: string): OHLC[] | undefined {
  return getMarket(marketId)?.data;
}

/** SAMPLE: static pack OHLC as authored. */
export const sampleMarketDataProvider: MarketDataProvider = {
  id: "sample",
  mode: "sample",
  label: "SAMPLE",
  getOhlc: sampleOhlc,
  listMarketIds: listIds,
};

/**
 * DELAYED: replay of SAMPLE series with the newest bars held back
 * (educational delay — not a live feed).
 */
export const delayedMarketDataProvider: MarketDataProvider = {
  id: "delayed",
  mode: "delayed",
  label: "DELAYED",
  getOhlc(marketId: string): OHLC[] | undefined {
    const full = sampleOhlc(marketId);
    if (!full || full.length === 0) return full;
    const holdBack = Math.min(2, Math.max(1, Math.floor(full.length / 6)));
    return full.slice(0, full.length - holdBack).map((bar, i) => ({
      ...bar,
      name: `D-${bar.name || String(i)}`,
    }));
  },
  listMarketIds: listIds,
};

const PROVIDERS: Record<MarketDataProviderId, MarketDataProvider> = {
  sample: sampleMarketDataProvider,
  delayed: delayedMarketDataProvider,
};

export function isMarketDataProviderId(value: string): value is MarketDataProviderId {
  return PROVIDER_IDS.includes(value as MarketDataProviderId);
}

export function listMarketDataProviders(): MarketDataProvider[] {
  return PROVIDER_IDS.map((id) => PROVIDERS[id]);
}

export function getStoredProviderId(): MarketDataProviderId {
  try {
    const raw = localStorage.getItem(MARKET_DATA_PROVIDER_STORAGE_KEY);
    if (raw && isMarketDataProviderId(raw)) return raw;
  } catch {
    /* ignore */
  }
  return "sample";
}

export function setStoredProviderId(id: MarketDataProviderId): void {
  localStorage.setItem(MARKET_DATA_PROVIDER_STORAGE_KEY, id);
}

/** Active provider from config flag (localStorage). Default SAMPLE. */
export function getMarketDataProvider(
  id: MarketDataProviderId = getStoredProviderId(),
): MarketDataProvider {
  return PROVIDERS[id] ?? sampleMarketDataProvider;
}
