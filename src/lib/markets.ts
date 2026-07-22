import type { OHLC } from "./ohlcData";
import {
  CRYPTO_SAMPLE_PACKS,
  EQUITY_SAMPLE_PACKS,
  type SamplePack,
  instrumentFromPack,
} from "./samplePacks";

function ohlc(name: string, open: number, high: number, low: number, close: number): OHLC {
  return { name, open, high, low, close };
}

/** Scale OHLC by factor (for different price levels per market) */
function scale(rows: OHLC[], factor: number): OHLC[] {
  return rows.map((r) => ({
    ...r,
    open: Math.round(r.open * factor),
    high: Math.round(r.high * factor),
    low: Math.round(r.low * factor),
    close: Math.round(r.close * factor),
  }));
}

const BTC_BASE: OHLC[] = [
  ohlc("08:00", 63200, 63800, 63000, 63600),
  ohlc("10:00", 63600, 64200, 63400, 63800),
  ohlc("12:00", 63800, 64100, 63400, 63500),
  ohlc("14:00", 63200, 63900, 62800, 63800),
  ohlc("16:00", 63650, 64000, 63200, 63650),
  ohlc("18:00", 63800, 64400, 63600, 64000),
  ohlc("20:00", 64000, 64800, 63800, 64200),
  ohlc("22:00", 64200, 65000, 64000, 64600),
  ohlc("00:00", 64600, 65200, 64400, 64800),
  ohlc("02:00", 64800, 65400, 64600, 65000),
  ohlc("04:00", 65000, 65600, 64800, 65200),
  ohlc("06:00", 65200, 65800, 65000, 65500),
];

/** Legacy Market page chrome built on top of SamplePack (E1.M1 adapter). */
export interface MarketDef {
  id: string;
  name: string;
  pair: string;
  data: OHLC[];
  price: string;
  delta: string;
  volatility: string;
  pack: SamplePack;
}

function marketFromPack(
  pack: SamplePack,
  ui: { pair: string; price: string; delta: string; volatility: string }
): MarketDef {
  return {
    id: pack.id,
    name: pack.displayName,
    pair: ui.pair,
    data: pack.ohlc,
    price: ui.price,
    delta: ui.delta,
    volatility: ui.volatility,
    pack,
  };
}

function formatPrice(close: number, assetClass: SamplePack["assetClass"]): string {
  if (assetClass === "crypto") {
    return `$${close.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
  }
  return close.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function deltaFromOhlc(ohlcRows: OHLC[]): string {
  const first = ohlcRows[0]?.open;
  const last = ohlcRows[ohlcRows.length - 1]?.close;
  if (first == null || last == null || first === 0) return "0.00%";
  const pct = ((last - first) / first) * 100;
  const sign = pct >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
}

const LEGACY_CRYPTO_PACKS: SamplePack[] = [
  {
    id: "btc",
    symbol: "BTC",
    assetClass: "crypto",
    displayName: "Bitcoin",
    ohlc: BTC_BASE,
    educationalNotes: "SAMPLE crypto series for Market chart demos (STYLIZED intraday).",
  },
  {
    id: "eth",
    symbol: "ETH",
    assetClass: "crypto",
    displayName: "Ethereum",
    ohlc: scale(BTC_BASE, 0.054),
    educationalNotes: "SAMPLE crypto series scaled for ETH price level (STYLIZED).",
  },
];

const LEGACY_SPX_PACK: SamplePack = {
  id: "sp500",
  symbol: "SPX",
  assetClass: "equity",
  displayName: "S&P 500",
  ohlc: scale(BTC_BASE, 0.082),
  educationalNotes: "SAMPLE index-proxy series for equity chart demos (STYLIZED).",
};

// Register minimal crypto packs into the class registry (E1.M1.S4).
CRYPTO_SAMPLE_PACKS.push(...LEGACY_CRYPTO_PACKS);

const EQUITY_MARKETS: MarketDef[] = EQUITY_SAMPLE_PACKS.map((pack) => {
  const last = pack.ohlc[pack.ohlc.length - 1]?.close ?? 0;
  const vol =
    pack.id === "eq-cyclical" ? "HIGH" : pack.id === "eq-index-proxy" ? "LOW" : "MED";
  return marketFromPack(pack, {
    pair: pack.symbol,
    price: formatPrice(last, pack.assetClass),
    delta: deltaFromOhlc(pack.ohlc),
    volatility: vol,
  });
});

const LEGACY_MARKETS: MarketDef[] = [
  marketFromPack(LEGACY_CRYPTO_PACKS[0], {
    pair: "BTC/USDT",
    price: "$64,281.92",
    delta: "+4.12%",
    volatility: "HIGH",
  }),
  marketFromPack(LEGACY_CRYPTO_PACKS[1], {
    pair: "ETH/USDT",
    price: "$3,451.22",
    delta: "-1.18%",
    volatility: "HIGH",
  }),
  marketFromPack(LEGACY_SPX_PACK, {
    pair: "SPX",
    price: "5,240.10",
    delta: "+0.52%",
    volatility: "LOW",
  }),
];

/** Equity SAMPLE packs first, then legacy BTC/ETH/SPX adapter entries. */
export const MARKETS: MarketDef[] = [...EQUITY_MARKETS, ...LEGACY_MARKETS];

export type MarketAssetFilter = SamplePack["assetClass"] | "all";

export function listMarketsByAssetClass(filter: MarketAssetFilter): MarketDef[] {
  if (filter === "all") return [...MARKETS];
  return MARKETS.filter((m) => m.pack.assetClass === filter);
}

export function getMarket(id: string): MarketDef | undefined {
  return MARKETS.find((m) => m.id === id);
}

/** Instruments currently exposed via the Market adapter. */
export function getMarketInstruments() {
  return MARKETS.map((m) => instrumentFromPack(m.pack));
}
