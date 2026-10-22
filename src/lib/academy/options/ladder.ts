/**
 * BA8.M1: the options knowledge ladder (education only — not a broker's options approval).
 * Example premiums are SAMPLE numbers on a fictional $50 stock, chosen so every figure is easy to check by hand.
 */
import type { Strategy } from "./payoff";

export type LadderLevel = 1 | 2 | 3 | 4;

export interface LadderStrategy extends Strategy {
  level: LadderLevel;
  /** One plain sentence: what it is for. */
  use: string;
  /** The main risk in plain words. */
  risk: string;
  /** Concept-only strategies are explained but flagged as the highest risk. */
  conceptOnly?: boolean;
  termId?: string;
}

export interface LadderLevelInfo {
  level: LadderLevel;
  title: string;
  summary: string;
  /** Existing app content to read first. */
  refs: string[];
}

const call = (position: "long" | "short", strike: number, premium: number, qty = 1) => ({ kind: "call" as const, position, strike, premium, qty });
const put = (position: "long" | "short", strike: number, premium: number, qty = 1) => ({ kind: "put" as const, position, strike, premium, qty });
const stock = (price: number, qty = 1) => ({ kind: "stock" as const, price, qty });

export const LADDER_LEVELS: LadderLevelInfo[] = [
  { level: 1, title: "Income on shares you own or would buy", summary: "Covered calls, buy-writes and cash-secured puts: you sell an option and accept an obligation that your shares or cash already cover.", refs: ["glossary:covered-call", "glossary:cash-secured-put", "quiz:options-literacy", "coach:options-literacy"] },
  { level: 2, title: "Buying options and protecting shares", summary: "Long calls and puts risk only the premium paid. Protective puts and collars put a floor under shares you hold.", refs: ["glossary:option-premium", "glossary:protective-put", "glossary:collar", "coach:options-context-event"] },
  { level: 3, title: "Spreads: defined risk on both sides", summary: "Vertical spreads, iron condors and butterflies combine bought and sold options so both the best and worst case are fixed at entry.", refs: ["glossary:vertical-spread", "glossary:iron-condor", "coach:options-horizon-mismatch"] },
  { level: 4, title: "Naked options (concept only)", summary: "Selling options with no shares or cash behind them. Explained so you can recognise the risk; this is the highest-risk tier.", refs: ["glossary:options-assignment", "coach:options-pre-event-chase"] },
];

export const LADDER_STRATEGIES: LadderStrategy[] = [
  { id: "covered-call", level: 1, name: "Covered call", legs: [stock(50), call("short", 55, 1.5)], use: "Own 100 shares and sell a call above the price to collect premium.", risk: "You keep almost all of the downside of the shares, and give up gains above the strike.", termId: "covered-call" },
  { id: "buy-write", level: 1, name: "Buy-write", legs: [stock(50), call("short", 52, 2.2)], use: "Buy the shares and sell the call at the same time; the result is a covered call.", risk: "Same as a covered call: the premium only cushions a fall in the shares.", termId: "covered-call" },
  { id: "cash-secured-put", level: 1, name: "Cash-secured put", legs: [put("short", 45, 1.2)], use: "Set aside cash to buy 100 shares at the strike and sell a put to collect premium while you wait.", risk: "If the stock falls far below the strike you must still buy at the strike.", termId: "cash-secured-put" },
  { id: "long-call", level: 2, name: "Long call", legs: [call("long", 50, 2.5)], use: "Pay a premium for the right to buy at the strike: a bet on a rise before expiration.", risk: "If the stock is at or below the strike at expiration, the whole premium is lost.", termId: "option-premium" },
  { id: "long-put", level: 2, name: "Long put", legs: [put("long", 50, 2.3)], use: "Pay a premium for the right to sell at the strike: a bet on a fall before expiration.", risk: "If the stock is at or above the strike at expiration, the whole premium is lost.", termId: "option-premium" },
  { id: "protective-put", level: 2, name: "Protective put", legs: [stock(50), put("long", 47, 1.1)], use: "Own the shares and buy a put below the price as insurance.", risk: "The insurance costs the premium every time, and losses down to the strike still happen.", termId: "protective-put" },
  { id: "collar", level: 2, name: "Collar", legs: [stock(50), put("long", 47, 1.1), call("short", 55, 1.0)], use: "Own the shares, buy a put below and sell a call above, so the call premium pays for most of the put.", risk: "Gains above the call strike are given up in exchange for the floor.", termId: "collar" },
  { id: "bull-call-spread", level: 3, name: "Bull call spread (debit)", legs: [call("long", 50, 2.5), call("short", 55, 0.9)], use: "Buy a call and sell a higher call: a cheaper bet on a moderate rise.", risk: "The net premium paid is lost if the stock ends at or below the lower strike.", termId: "vertical-spread" },
  { id: "bull-put-spread", level: 3, name: "Bull put spread (credit)", legs: [put("short", 50, 2.2), put("long", 45, 0.7)], use: "Sell a put and buy a lower put: collect a credit if the stock stays above the higher strike.", risk: "Below the lower strike you lose the strike width minus the credit.", termId: "vertical-spread" },
  { id: "iron-condor", level: 3, name: "Iron condor", legs: [put("long", 40, 0.4), put("short", 45, 1.0), call("short", 55, 1.1), call("long", 60, 0.45)], use: "Sell a put spread and a call spread around the price: collect a credit if the stock stays in a range.", risk: "A big move either way loses the width of one spread minus the credit.", termId: "iron-condor" },
  { id: "call-butterfly", level: 3, name: "Call butterfly", legs: [call("long", 45, 6.0), call("short", 50, 2.5, 2), call("long", 55, 0.8)], use: "Buy one low and one high call, sell two in the middle: a cheap bet that the stock ends near the middle strike.", risk: "The debit is lost if the stock ends outside the outer strikes." },
  { id: "naked-call", level: 4, name: "Naked (uncovered) call", legs: [call("short", 55, 1.5)], use: "Sell a call without owning the shares, to collect premium.", risk: "Losses have no limit: the stock can keep rising, and you would have to deliver shares you do not own.", conceptOnly: true },
  { id: "naked-put", level: 4, name: "Naked (uncovered) put", legs: [put("short", 45, 1.2)], use: "Sell a put without the cash set aside to buy the shares.", risk: "A crash can force a purchase far above the market price with money you did not set aside.", conceptOnly: true },
];

export const strategiesForLevel = (l: LadderLevel) => LADDER_STRATEGIES.filter((s) => s.level === l);
export const getStrategy = (id: string) => LADDER_STRATEGIES.find((s) => s.id === id);
