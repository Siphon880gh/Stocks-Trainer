import type { OHLC } from "./ohlcData";

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

export interface MarketDef {
  id: string;
  name: string;
  pair: string;
  data: OHLC[];
  price: string;
  delta: string;
  volatility: string;
}

export const MARKETS: MarketDef[] = [
  {
    id: "btc",
    name: "Bitcoin",
    pair: "BTC/USDT",
    data: BTC_BASE,
    price: "$64,281.92",
    delta: "+4.12%",
    volatility: "HIGH",
  },
  {
    id: "eth",
    name: "Ethereum",
    pair: "ETH/USDT",
    data: scale(BTC_BASE, 0.054),
    price: "$3,451.22",
    delta: "-1.18%",
    volatility: "HIGH",
  },
  {
    id: "sp500",
    name: "S&P 500",
    pair: "SPX",
    data: scale(BTC_BASE, 0.082),
    price: "5,240.10",
    delta: "+0.52%",
    volatility: "LOW",
  },
];

export function getMarket(id: string): MarketDef | undefined {
  return MARKETS.find((m) => m.id === id);
}
