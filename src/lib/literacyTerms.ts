/** Beginner equities glossary terms for Archive + quiz deep-links (E4.M1.S4). */

export interface LiteracyTerm {
  id: string;
  name: string;
  category: "ownership" | "markets" | "position" | "process";
  summary: string;
  detail: string;
}

export const LITERACY_TERMS: LiteracyTerm[] = [
  {
    id: "stock-share",
    name: "Stock / Share",
    category: "ownership",
    summary: "A unit of ownership in a company.",
    detail:
      "Shares represent equity in a business—claims on residual value after debts. SAMPLE educational definition, not investment advice.",
  },
  {
    id: "exchange",
    name: "Exchange",
    category: "markets",
    summary: "A venue that helps match buyers and sellers with public prices.",
    detail:
      "Listed equities trade on exchanges (and related market systems) that support price discovery and liquidity. Not a profit guarantee.",
  },
  {
    id: "long-vs-short",
    name: "Long vs Short",
    category: "position",
    summary: "Long benefits if value rises; short bets on a decline.",
    detail:
      "Long = own (or intend to own) with upside if price/value rises. Short = borrow/sell hoping to repurchase cheaper. Shorting has asymmetric loss risk—held until later on the beginner path.",
  },
  {
    id: "investing-vs-trading",
    name: "Investing vs Trading",
    category: "process",
    summary: "Different typical horizons and decision cadences.",
    detail:
      "Investing usually emphasizes longer multi-month/year theses. Trading emphasizes shorter moves. Match tools and risk to your horizon.",
  },
  {
    id: "risk-horizon",
    name: "Risk & Horizon",
    category: "process",
    summary: "Expected return and uncertainty travel together; time frame shapes decisions.",
    detail:
      "Higher expected returns generally require accepting more uncertainty. Your time horizon filters which moves are noise vs signal. Hold often fits when thesis + horizon still hold.",
  },
  {
    id: "options-context",
    name: "Options context (SAMPLE)",
    category: "markets",
    summary: "Educational underlying charts for options ideas — not a live options chain.",
    detail:
      "In this trainer, Options context means SAMPLE charts of an underlying around events or volatility. It is not a LIVE options chain, not order routing, and not a Greeks/pricing engine. Traditional retail stocks remain Equities.",
  },
  {
    id: "futures-market",
    name: "Futures (SAMPLE)",
    category: "markets",
    summary: "Contracts on an underlying (index, commodity, etc.) — SAMPLE browse class here.",
    detail:
      "Futures are agreements to buy/sell an underlying later at a set price. This app shows STYLIZED SAMPLE futures tapes for chart practice—not LIVE contracts or order routing. The traditional retail stocks path stays Equities.",
  },
  {
    id: "crypto-browse",
    name: "Crypto browse (SAMPLE)",
    category: "markets",
    summary: "Digital-asset SAMPLE charts for candle/indicator drills — not the Beginner stocks path.",
    detail:
      "Crypto Class is SAMPLE browse/drill only. It does not replace Beginner Equities Path (stocks). Feeds are SAMPLE or DELAYED labels—never LIVE/REAL_TIME theater.",
  },
  {
    id: "forex-spot",
    name: "Forex / FX (SAMPLE)",
    category: "markets",
    summary: "Currency pairs (spot FX) as a SAMPLE Market class after equities fluency.",
    detail:
      "Forex is trading one currency against another. Here it is SAMPLE spot FX for chart literacy. Traditional retail stocks = Equities. Not a LIVE FX feed or broker.",
  },
  {
    id: "equities-traditional-retail",
    name: "Equities = traditional retail stocks",
    category: "markets",
    summary: "Listed shares / the stock market — the primary learning path in this app.",
    detail:
      "When retail learners say the traditional market they trade daily, they usually mean stocks. In this trainer that market type is Equities. Futures, options-context, crypto, and forex are SAMPLE expansion classes.",
  },
  {
    id: "rumor-vs-filing",
    name: "Rumor vs Filing",
    category: "process",
    summary: "Social chatter is not the same as a disclosed filing or official release.",
    detail:
      "SAMPLE teaching: treat rumors as low-confidence noise until confirmed by a filing, exchange notice, or company release. Process = source → confidence → decide.",
  },
  {
    id: "priced-in",
    name: "Priced In",
    category: "process",
    summary: "Markets may already reflect widely expected news before the headline hits.",
    detail:
      "If everyone expected the print, the first move after the headline can fade. SAMPLE training asks: what was already known vs what is new?",
  },
  {
    id: "ohlc-anatomy",
    name: "OHLC (Open High Low Close)",
    category: "markets",
    summary: "Four prices that draw one candlestick: open, high, low, close.",
    detail:
      "High is the tip of the upper wick. Low is the tip of the lower wick. The body runs from open to close: on a green candle the top of the body is close; on a red candle the top of the body is open. SAMPLE teaching — not a live quote.",
  },
  {
    id: "candle-color",
    name: "Green vs Red candles",
    category: "markets",
    summary: "Green = close above open; red = close below open.",
    detail:
      "Color encodes the period’s direction, not volume or certainty. SAMPLE charts paint green when close > open and red when close < open.",
  },
  {
    id: "chase-vs-fade",
    name: "Chase vs Fade",
    category: "process",
    summary: "Chase = join the move; fade = bet it overshoots and mean-reverts.",
    detail:
      "Neither is always right. Match the choice to evidence quality, liquidity, and your horizon. Used in company-news and multi-market SAMPLE cases.",
  },
]

export function getLiteracyTerm(id: string): LiteracyTerm | undefined {
  return LITERACY_TERMS.find((t) => t.id === id);
}
