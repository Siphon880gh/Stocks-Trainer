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
      "Long = own (or intend to own) with upside if price/value rises. Short = borrow/sell hoping to repurchase cheaper. Shorting has asymmetric loss risk—soft-gated on the beginner path.",
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
];

export function getLiteracyTerm(id: string): LiteracyTerm | undefined {
  return LITERACY_TERMS.find((t) => t.id === id);
}
