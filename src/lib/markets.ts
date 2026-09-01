import {
  SESSION_24H_LABELS_12,
  withBarLabels,
  type OHLC,
} from "./ohlcData";
import {
  CRYPTO_SAMPLE_PACKS,
  EQUITY_SAMPLE_PACKS,
  FOREX_SAMPLE_PACKS,
  FUTURE_SAMPLE_PACKS,
  OPTION_CONTEXT_SAMPLE_PACKS,
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

const BTC_BASE: OHLC[] = withBarLabels(
  [
    ohlc("t0", 63200, 63800, 63000, 63600),
    ohlc("t1", 63600, 64200, 63400, 63800),
    ohlc("t2", 63800, 64100, 63400, 63500),
    ohlc("t3", 63200, 63900, 62800, 63800),
    ohlc("t4", 63650, 64000, 63200, 63650),
    ohlc("t5", 63800, 64400, 63600, 64000),
    ohlc("t6", 64000, 64800, 63800, 64200),
    ohlc("t7", 64200, 65000, 64000, 64600),
    ohlc("t8", 64600, 65200, 64400, 64800),
    ohlc("t9", 64800, 65400, 64600, 65000),
    ohlc("t10", 65000, 65600, 64800, 65200),
    ohlc("t11", 65200, 65800, 65000, 65500),
  ],
  SESSION_24H_LABELS_12
);

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
  if (assetClass === "forex") {
    const digits = close < 10 ? 4 : 2;
    return close.toLocaleString(undefined, {
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    });
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

/** ETH: early dump then reclaim (≠ BTC grind). STYLIZED levels. */
const ETH_BASE: OHLC[] = withBarLabels(
  [
    ohlc("t0", 3420, 3450, 3380, 3400),
    ohlc("t1", 3400, 3415, 3320, 3345),
    ohlc("t2", 3345, 3360, 3280, 3305),
    ohlc("t3", 3305, 3380, 3290, 3365),
    ohlc("t4", 3365, 3440, 3350, 3425),
    ohlc("t5", 3425, 3480, 3410, 3460),
    ohlc("t6", 3460, 3495, 3435, 3450),
    ohlc("t7", 3450, 3470, 3410, 3430),
    ohlc("t8", 3430, 3465, 3420, 3455),
    ohlc("t9", 3455, 3510, 3445, 3490),
    ohlc("t10", 3490, 3520, 3475, 3505),
    ohlc("t11", 3505, 3535, 3488, 3518),
  ],
  SESSION_24H_LABELS_12
);

/** Alt: tight chop then breakout (≠ BTC / ETH shapes). */
const ALT_CRYPTO_OHLC: OHLC[] = withBarLabels(
  [
    ohlc("t0", 148, 150, 147, 149),
    ohlc("t1", 149, 151, 148, 150),
    ohlc("t2", 150, 151, 149, 150),
    ohlc("t3", 150, 152, 149, 151),
    ohlc("t4", 151, 152, 150, 151),
    ohlc("t5", 151, 153, 150, 152),
    ohlc("t6", 152, 158, 151, 157),
    ohlc("t7", 157, 162, 156, 160),
    ohlc("t8", 160, 163, 158, 159),
    ohlc("t9", 159, 161, 157, 158),
    ohlc("t10", 158, 160, 156, 157),
    ohlc("t11", 157, 159, 155, 156),
  ],
  SESSION_24H_LABELS_12
);

const LEGACY_CRYPTO_PACKS: SamplePack[] = [
  {
    id: "btc",
    symbol: "BTC",
    assetClass: "crypto",
    displayName: "Bitcoin",
    ohlc: BTC_BASE,
    educationalNotes:
      "SAMPLE crypto browse pack (STYLIZED). Market Class Crypto — not the Equities Beginner path spine.",
  },
  {
    id: "eth",
    symbol: "ETH",
    assetClass: "crypto",
    displayName: "Ethereum",
    ohlc: ETH_BASE,
    educationalNotes:
      "SAMPLE crypto: dump-then-reclaim shape (distinct from BTC grind). Browse/drill only — not Beginner Equities Path.",
  },
  {
    id: "crypto-alt",
    symbol: "SOL",
    assetClass: "crypto",
    displayName: "Alt Chop → Break (SAMPLE)",
    ohlc: ALT_CRYPTO_OHLC,
    educationalNotes:
      "SAMPLE alt-style crypto: tight chop then breakout. Distinct from BTC/ETH. Browse only — SAMPLE/STYLIZED, not LIVE.",
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

/** E9.M1 — Futures SAMPLE markets (Class → Futures). */
const FUTURE_MARKETS: MarketDef[] = FUTURE_SAMPLE_PACKS.map((pack) => {
  const last = pack.ohlc[pack.ohlc.length - 1]?.close ?? 0;
  const vol = pack.id === "fut-energy" ? "HIGH" : "MED";
  return marketFromPack(pack, {
    pair: pack.symbol,
    price: formatPrice(last, pack.assetClass),
    delta: deltaFromOhlc(pack.ohlc),
    volatility: vol,
  });
});

/** E9.M2 — Options-context SAMPLE markets (underlying charts only). */
const OPTION_CONTEXT_MARKETS: MarketDef[] = OPTION_CONTEXT_SAMPLE_PACKS.map((pack) => {
  const last = pack.ohlc[pack.ohlc.length - 1]?.close ?? 0;
  const vol = pack.id === "opt-ctx-vol" ? "HIGH" : "MED";
  return marketFromPack(pack, {
    pair: pack.symbol,
    price: formatPrice(last, pack.assetClass),
    delta: deltaFromOhlc(pack.ohlc),
    volatility: vol,
  });
});

/** E9.M4 — Forex SAMPLE markets (Class → Forex). */
const FOREX_MARKETS: MarketDef[] = FOREX_SAMPLE_PACKS.map((pack) => {
  const last = pack.ohlc[pack.ohlc.length - 1]?.close ?? 0;
  const pair =
    pack.id === "fx-eurusd" ? "EUR/USD" : pack.id === "fx-usdjpy" ? "USD/JPY" : pack.symbol;
  return marketFromPack(pack, {
    pair,
    price: formatPrice(last, pack.assetClass),
    delta: deltaFromOhlc(pack.ohlc),
    volatility: pack.id === "fx-usdjpy" ? "HIGH" : "LOW",
  });
});

const CRYPTO_MARKETS: MarketDef[] = LEGACY_CRYPTO_PACKS.map((pack) => {
  const last = pack.ohlc[pack.ohlc.length - 1]?.close ?? 0;
  const pair =
    pack.id === "btc" ? "BTC/USDT" : pack.id === "eth" ? "ETH/USDT" : `${pack.symbol}/USDT`;
  return marketFromPack(pack, {
    pair,
    price: formatPrice(last, pack.assetClass),
    delta: deltaFromOhlc(pack.ohlc),
    volatility: pack.id === "crypto-alt" ? "MED" : "HIGH",
  });
});

const LEGACY_MARKETS: MarketDef[] = [
  ...CRYPTO_MARKETS,
  marketFromPack(LEGACY_SPX_PACK, {
    pair: "SPX",
    price: "5,240.10",
    delta: "+0.52%",
    volatility: "LOW",
  }),
];

/** Equity, futures, options-context, forex SAMPLE, then legacy crypto/SPX. */
export const MARKETS: MarketDef[] = [
  ...EQUITY_MARKETS,
  ...FUTURE_MARKETS,
  ...OPTION_CONTEXT_MARKETS,
  ...FOREX_MARKETS,
  ...LEGACY_MARKETS,
];

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
