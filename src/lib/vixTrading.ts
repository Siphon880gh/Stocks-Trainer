/**
 * VIX trading for beginners: what the VIX measures, what you can actually trade (VX / VXM futures, VIX index options,
 * options on VIX futures, VIXY, SVIX, SVXY, ETNs), VX futures arithmetic, the futures curve and its slope, carry and
 * convergence, "right forecast, losing trade", option payoffs, daily-reset compounding, strategy families with their failure
 * modes, why continuous shorting fails, sizing and orders, a paper-trade learning process, and where an edge actually
 * comes from: expected value of the instrument's payout vs its price (futures and option P/L with costs, VRO settlement,
 * carry under a stable curve, the expected-value test for a short future and a bought call, and the underestimated tail).
 *
 * Source material: the article "VIX Trading for Beginners" (no author named; product descriptions checked 2026-10-22) and
 * the Cboe, SEC Investor.gov, FINRA, NFA, New York Fed, ProShares and Volatility Shares pages it cites. The app re-fetched
 * every page used as a Playbook source on 2026-10-30. The expected-value section adds follow-up notes on VIX
 * (key ideas table, P/L and EV formulas), backed by the New York Fed's Liberty Street post on equity volatility term premia
 * and Cboe's "Nothing Remains Unchanged" post. All trades, curves and numbers here are hypothetical teaching
 * examples, before costs: mechanics, not a trading system or a forecast.
 *
 * Extends riskPremiumPortfolio.ts (which owns the glossary terms `vix-index`, `vix-term-structure`, `roll-yield`,
 * `volatility-risk-premium`, `inverse-volatility-etp` and the helper `termSlopePct`) instead of repeating it.
 * Feeds /practice/vix-trading, Learn `vix-trading` (VIX- questions), VIX_CASES (packs `futures` and `macro-news`,
 * mode `vix_products`), Coach `vix-futures-curve`, the glossary and Playbook `vix-curve-carry-paper`.
 * Runtime import only of `termSlopePct` / `pct` from riskPremiumPortfolio.ts (no import back), so there is no cycle.
 * Checked by vixTrading.test.ts and vixTradingPage.test.tsx. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { OHLC } from "./ohlcData";
import type { LiteracyTerm } from "./literacyTerms";
import type { CaseStudy } from "./caseStudies";
import type { PlaybookCredibility } from "./playbooks";
import { pct, termSlopePct } from "./riskPremiumPortfolio";

export { termSlopePct as curveSlope };

export const VIX_DISCLAIMER =
  "Hypothetical numbers before costs, for learning. Not a trading signal or advice. VIX products can lose money fast, and some can lose more than you put in.";

export const VIX_ARTICLE = {
  title: "VIX Trading for Beginners",
  subtitle: "How traders seek profits from volatility and manage the risk of sudden losses",
  checkedOn: "2026-10-22",
} as const;

const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
export const usd = (v: number) => `${v < 0 ? "−" : ""}$${Math.abs(Math.round(v)).toLocaleString("en-US")}`;
export const signedUsd = (v: number) => (v > 0 ? `+${usd(v)}` : usd(v));

// ---------------------------------------------------------------- contract facts (Cboe specs, checked 2026-10-30)

/** Standard VX futures: $1,000 per index point. */
export const VX_MULTIPLIER = 1000;
/** Mini VIX futures (VXM): one-tenth the size, $100 per point. */
export const VXM_MULTIPLIER = 100;
/** Traditional VIX index options: $100 per point, cash-settled, European-style. */
export const VIX_OPTION_MULTIPLIER = 100;

// ---------------------------------------------------------------- pure helpers

/** Rough one-standard-deviation S&P 500 move in % over `days` implied by a VIX reading (annualized %). */
export function vixMonthlySigma(vix: number, days = 30): number {
  return vix * Math.sqrt(days / 365);
}

export type Side = "long" | "short";

/** Gross futures P&L in dollars: (exit − entry) × multiplier × contracts for a long, reversed for a short. */
export function vxPnl(entry: number, exit: number, side: Side, contracts = 1, multiplier = VX_MULTIPLIER): number {
  const pts = side === "long" ? exit - entry : entry - exit;
  return r2(pts * multiplier * contracts);
}

export type CurveShape = "contango" | "backwardation" | "flat" | "hump" | "mixed";

/**
 * Shape of a few monthly futures prices (front first). A step within `flatTol` points counts as flat. Every step up =
 * contango, every step down = backwardation, steps flat (or flat and up) = nearly flat, up then down = hump;
 * anything else is mixed.
 */
export function curveShape(prices: number[], flatTol = 1): CurveShape {
  const dir = prices.slice(1).map((p, i) => {
    const d = p - prices[i]!;
    return Math.abs(d) <= flatTol ? 0 : Math.sign(d);
  });
  if (dir.every((d) => d > 0)) return "contango";
  if (dir.every((d) => d < 0)) return "backwardation";
  if (dir.every((d) => d >= 0)) return "flat";
  const firstDown = dir.findIndex((d) => d < 0);
  if (firstDown > 0 && dir.slice(0, firstDown).every((d) => d > 0) && dir.slice(firstDown).every((d) => d < 0)) return "hump";
  return "mixed";
}

export type OptionKind = "call" | "put";

/** Expiration breakeven of a bought option before costs. */
export const optionBreakeven = (kind: OptionKind, strike: number, premium: number) => r2(kind === "call" ? strike + premium : strike - premium);

/** Net result in dollars at expiration of one bought option: (payoff − premium) × multiplier. */
export function optionNetAtSettlement(kind: OptionKind, strike: number, premium: number, settle: number, multiplier = VIX_OPTION_MULTIPLIER): number {
  const payoff = Math.max(0, kind === "call" ? settle - strike : strike - settle);
  return r2((payoff - premium) * multiplier);
}

/**
 * An idealized daily-reset fund that returns exactly `leverage` × the benchmark's daily change (−1 for SVIX-style,
 * −0.5 for SVXY's stated target), before fees and tracking differences. Returns the fund's value after each day.
 */
export function dailyInverseCompound(benchmark: number[], leverage = -1, start = 100): number[] {
  const out = [start];
  for (let i = 1; i < benchmark.length; i++) {
    const r = benchmark[i]! / benchmark[i - 1]! - 1;
    out.push(out[i - 1]! * (1 + leverage * r));
  }
  return out;
}

/** Gain in % needed on what is left to get back to the start after a `lossPct`% loss. */
export const recoveryGainNeeded = (lossPct: number) => r1((lossPct / (100 - lossPct)) * 100);

export interface WinRateStats {
  trades: number;
  wins: number;
  winRate: number;
  total: number;
  avgWin: number;
  avgLoss: number;
  expectancy: number;
}

/** Win rate alongside what actually matters: total, average win, average loss and expectancy per trade. */
export function winRateExpectancy(results: number[]): WinRateStats {
  const wins = results.filter((r) => r > 0);
  const losses = results.filter((r) => r <= 0);
  const total = results.reduce((a, r) => a + r, 0);
  const avg = (xs: number[]) => (xs.length ? xs.reduce((a, r) => a + r, 0) / xs.length : 0);
  return {
    trades: results.length,
    wins: wins.length,
    winRate: r1((wins.length / results.length) * 100),
    total: r2(total),
    avgWin: r2(avg(wins)),
    avgLoss: r2(avg(losses)),
    expectancy: r2(total / results.length),
  };
}

/** Whole shares that keep a planned stop within a dollar budget (before costs and gaps). */
export const sharesForBudget = (budget: number, entry: number, stop: number) => Math.floor(budget / Math.abs(entry - stop));

/** Dollar result of a long position when the exit actually fills at `fill` (a gap can fill far past the stop). */
export const fillLoss = (shares: number, entry: number, fill: number) => r2(shares * (fill - entry));

// ---------------------------------------------------------------- expected value vs price (pure helpers)

/** Futures P/L after costs: Long N × 1,000 × (F_exit − F_entry) − C; Short N × 1,000 × (F_entry − F_exit) − C. Same expiration both sides. */
export const vxNetPnl = (entry: number, exit: number, side: Side, contracts = 1, costs = 0, multiplier = VX_MULTIPLIER) =>
  r2(vxPnl(entry, exit, side, contracts, multiplier) - costs);

/** Bought VIX index option at expiration after costs: 100 × N × [max(V_T − K, 0) − c] − C for a call (mirror for a put). */
export const optionPnlAtExpiry = (kind: OptionKind, strike: number, premium: number, settle: number, contracts = 1, costs = 0) =>
  r2(optionNetAtSettlement(kind, strike, premium, settle) * contracts - costs);

/** Selling a bought option before expiration: 100 × N × (q_exit − q_entry) − C. */
export const optionPnlBeforeExpiry = (entryPremium: number, exitPremium: number, contracts = 1, costs = 0, multiplier = VIX_OPTION_MULTIPLIER) =>
  r2(multiplier * contracts * (exitPremium - entryPremium) - costs);

/** One assumed settlement outcome in a model: probability `p` (0–1) that the official settlement (VRO) is `settle`. */
export interface SettleOutcome {
  label: string;
  p: number;
  settle: number;
}

function checkProbabilities(outcomes: SettleOutcome[]) {
  const total = outcomes.reduce((a, o) => a + o.p, 0);
  if (!outcomes.length || outcomes.some((o) => o.p < 0) || Math.abs(total - 1) > 1e-9) throw new Error("outcome probabilities must be ≥ 0 and sum to 1");
}

/** E[V_T]: probability-weighted settlement, extreme outcomes included. */
export function expectedSettlement(outcomes: SettleOutcome[]): number {
  checkProbabilities(outcomes);
  return r2(outcomes.reduce((a, o) => a + o.p * o.settle, 0));
}

/** E[P/L] of a short future held to settlement: 1,000 × N × (F_entry − E[V_T]) − C. A model-implied number, not evidence. */
export function shortFutureExpectedPnl(entry: number, outcomes: SettleOutcome[], contracts = 1, costs = 0, multiplier = VX_MULTIPLIER): number {
  return r2(multiplier * contracts * (entry - expectedSettlement(outcomes)) - costs);
}

/** E[P/L] of a bought call held to settlement: 100 × N × (E[max(V_T − K, 0)] − c) − C. */
export function longCallExpectedPnl(strike: number, premium: number, outcomes: SettleOutcome[], contracts = 1, costs = 0): number {
  checkProbabilities(outcomes);
  const payoff = outcomes.reduce((a, o) => a + o.p * Math.max(0, o.settle - strike), 0);
  return r2(VIX_OPTION_MULTIPLIER * contracts * (payoff - premium) - costs);
}

export interface RollDown {
  /** 1-based curve position the contract starts in (2 = two-month future). */
  from: number;
  entry: number;
  /** Price after one month if the curve keeps exactly the same shape: the price one position nearer. */
  after: number;
  long: number;
  short: number;
}

/**
 * Carry if the curve keeps exactly the same shape for one month: each contract slides one position toward the front and
 * takes that position's price. Contango 20 / 22 / 23: the two-month future at 22 becomes the one-month at 20, so a long
 * loses $2,000 and a short gains $2,000. Conditional on a stable curve; rolling (swapping contracts) is not a profit.
 */
export function carryRollDown(curve: number[], contracts = 1): RollDown[] {
  return curve.slice(1).map((entry, i) => ({
    from: i + 2,
    entry,
    after: curve[i]!,
    long: vxPnl(entry, curve[i]!, "long", contracts),
    short: vxPnl(entry, curve[i]!, "short", contracts),
  }));
}

// ---------------------------------------------------------------- the honest verdict

export const VIX_VERDICT = {
  title: "Is VIX a valid play?",
  short: "A real market, not an easy income stream.",
  paragraphs: [
    "Yes, as a market: VIX futures, VIX options and VIX-linked funds are legitimate, exchange-listed products that professionals trade every day to hedge and to take views on volatility.",
    "There is documented evidence of an edge, but it is conditional. Research such as the New York Fed staff report on equity volatility term premia finds risk premia in how volatility is priced, and they change over time: on average, investors pay for protection. That premium is small on most days and is paid for with rare, very large losses.",
    "Short volatility can wipe out an account in a day, and long volatility bleeds while you wait for a shock that may never come or may already be priced in. A correct forecast about spot VIX can still lose money.",
    "The app's verdict: for most beginners, paper-trade it first or skip it. No position is a valid outcome. This is education, not a signal.",
  ],
} as const;

// ---------------------------------------------------------------- key ideas (seven-concept summary from the follow-up notes)

export const VIX_KEY_IDEAS: { category: string; concept: string; text: string; panel: string }[] = [
  { category: "Definition", concept: "VIX is an index", text: "A calculation from S&P 500 option prices, not an asset you can buy or sell directly.", panel: "vix-measures" },
  { category: "Definition", concept: "What you actually trade", text: "VX futures, VIX options, and futures-based funds such as VIXY, SVIX and SVXY.", panel: "vix-instruments" },
  { category: "Fundamental", concept: "Futures pricing matters", text: "Profit depends on how your instrument is priced, not simply on whether VIX rises or falls.", panel: "vix-futures-pnl" },
  { category: "Fundamental", concept: "The futures curve matters", text: "Prices across expirations, and how a contract slides along them, are part of every VIX trade.", panel: "vix-curve" },
  { category: "Principle", concept: "A correct forecast can still lose", text: "Calling VIX's direction right doesn't guarantee the instrument you chose makes money.", panel: "vix-forecast" },
  { category: "Principle", concept: "Any edge is conditional", text: "An edge can exist under some conditions, but a claim isn't proof: it has to survive an expected-value test after costs.", panel: "vix-edge" },
  { category: "Risk principle", concept: "Short volatility can wipe out an account", text: "Rare spikes can cost many times what calm months earn. Inverse volatility funds need their own risk education.", panel: "vix-inverse" },
];

// ---------------------------------------------------------------- what the VIX measures

export const VIX_SIGMA_LEVELS = [12, 20, 30, 40, 80].map((vix) => ({ vix, monthly: r1(vixMonthlySigma(vix)) }));

// ---------------------------------------------------------------- what you can trade

export interface VixInstrument {
  id: string;
  name: string;
  holds: string;
  profitsWhen: string;
  complication: string;
}

export const VIX_INSTRUMENTS: VixInstrument[] = [
  { id: "vx", name: "VIX futures (VX)", holds: "A contract for one expiration, $1,000 per point", profitsWhen: "Long gains if that contract rises; short gains if it falls", complication: "Margin, expiration, and a price that differs from spot VIX" },
  { id: "vxm", name: "Mini VIX futures (VXM)", holds: "The same contract at one-tenth the size, $100 per point", profitsWhen: "Same as VX", complication: "Smaller dollars, same mechanics; check liquidity for your order" },
  { id: "vix-options", name: "VIX index options", holds: "Cash-settled, European-style calls or puts, $100 per point", profitsWhen: "Calls for an up view, puts for a down view, beyond the premium", complication: "Premium, strike, timing, and the volatility of volatility" },
  { id: "vix-futures-options", name: "Options on VIX futures", holds: "Options that settle into a VIX futures position", profitsWhen: "Like other options, on the futures price", complication: "Different exercise and settlement rules from VIX index options" },
  { id: "vixy", name: "VIXY (ProShares)", holds: "Fund shares tracking a short-term VIX futures index (first and second month, rolled daily)", profitsWhen: "Its futures exposure gains value", complication: "Rolling in contango creates a persistent drag" },
  { id: "svix", name: "SVIX (Volatility Shares)", holds: "Fund shares targeting −1x the daily return of its Short VIX Futures Index", profitsWhen: "Its futures portfolio falls during the day", complication: "Daily compounding; the issuer warns you could lose the full investment in a single day" },
  { id: "svxy", name: "SVXY (ProShares)", holds: "Fund shares targeting −0.5x the daily return of a short-term VIX futures index", profitsWhen: "Its benchmark falls during the day", complication: "A different exposure from SVIX, still with large risk" },
  { id: "etn", name: "Volatility ETNs", holds: "A debt note from an issuer, not a fund portfolio", profitsWhen: "The reference index moves your way and the issuer pays", complication: "Issuer credit risk, redemption or acceleration terms, price vs indicative value" },
];

// ---------------------------------------------------------------- VX futures arithmetic

export const VX_EXAMPLES: { label: string; side: Side; entry: number; exit: number }[] = [
  { label: "Buy a future", side: "long", entry: 20, exit: 25 },
  { label: "Short a future", side: "short", entry: 20, exit: 16 },
  { label: "Short a future", side: "short", entry: 20, exit: 35 },
];

// ---------------------------------------------------------------- the curve

export interface CurveExample {
  id: CurveShape;
  label: string;
  prices: [number, number, number];
  reads: string;
}

export const CURVE_EXAMPLES: CurveExample[] = [
  { id: "contango", label: "Contango", prices: [18, 20, 22], reads: "Nearer volatility is priced below later volatility; common in calm markets." },
  { id: "backwardation", label: "Backwardation", prices: [35, 30, 27], reads: "Immediate stress is priced above later stress; often during a spike." },
  { id: "flat", label: "Nearly flat", prices: [22, 22, 23], reads: "Little difference between nearby expirations." },
  { id: "hump", label: "Hump", prices: [18, 24, 21], reads: "One middle window carries extra premium. Maybe an event, but the curve alone can't say." },
];

/** Contango that rises: F1/F2 18/20 → 24/25. Still contango, and a short front future loses 6 points. */
export const CONTANGO_SHORT_LOSS = { before: [18, 20] as const, after: [24, 25] as const, pnl: vxPnl(18, 24, "short") };

export const THREE_DECAYS = [
  { id: "theta", name: "Option theta", text: "Time value draining out of an option, other things equal. A bare futures contract has no premium to decay." },
  { id: "roll", name: "Futures roll and convergence", text: "In contango a later contract costs more, and a contract tends to drift toward spot as it ages. That can favor shorts and hurt long funds that keep rolling, unless volatility rises." },
  { id: "compounding", name: "Daily-reset compounding", text: "How a daily-target fund's percentage returns compound. It depends on the path: swings can cost money even when the benchmark ends where it started." },
] as const;

// ---------------------------------------------------------------- right forecast, losing trade

export const FORECAST_EXAMPLES = [
  {
    id: "right-forecast-loses",
    title: "Right about spot, wrong on the trade",
    setup: "After a shock, spot VIX is 40 and a future trades at 30 (it already prices in calming down). You short that future, expecting fear to ease.",
    outcome: "Spot falls to 35, as you expected. The future rises to 35. You buy it back.",
    pnl: vxPnl(30, 35, "short"),
    lesson: "You were right that spot VIX would fall, and still lost 5 points per contract, because you sold at 30 and bought back at 35.",
  },
  {
    id: "wrong-forecast-wins",
    title: "Spot rises, the short still wins",
    setup: "Spot VIX is 15 and a future trades at 20. You short the future.",
    outcome: "Spot rises to 17, but the future falls to 18 as it ages. You buy it back.",
    pnl: vxPnl(20, 18, "short"),
    lesson: "Spot rose and the short made 2 points. What counts is the price of the contract you hold, not the headline index.",
  },
  {
    id: "long-settles-below-price",
    title: "Volatility rises, the long still loses",
    setup: "Spot VIX is 16. You buy one future at 20, expecting volatility to rise, and hold it to expiration.",
    outcome: "The official settlement value (VRO) is 18: above where spot started, below what you paid.",
    pnl: vxPnl(20, 18, "long"),
    lesson: "(18 − 20) × $1,000 = −$2,000 before costs. You were right that volatility would rise, but the future already priced in more than that.",
  },
] as const;

// ---------------------------------------------------------------- options

export const OPTION_EXAMPLES = [
  { id: "call-30", kind: "call" as const, strike: 25, premium: 2, settle: 30 },
  { id: "call-26", kind: "call" as const, strike: 25, premium: 2, settle: 26 },
  { id: "put-20", kind: "put" as const, strike: 25, premium: 2, settle: 20 },
].map((o) => ({ ...o, net: optionNetAtSettlement(o.kind, o.strike, o.premium, o.settle), breakeven: optionBreakeven(o.kind, o.strike, o.premium) }));

// ---------------------------------------------------------------- where an edge actually comes from: expected value vs price

/** The article's three curve shapes (one-, two-, three-month futures), hypothetical. */
export const EV_CURVES: { id: "contango" | "backwardation" | "flat"; label: string; prices: [number, number, number] }[] = [
  { id: "contango", label: "Contango", prices: [20, 22, 23] },
  { id: "backwardation", label: "Backwardation", prices: [30, 26, 24] },
  { id: "flat", label: "Flat", prices: [22, 22, 22] },
];

/** Two-month future after one month if each curve keeps exactly its shape. Contango 22 → 20: long −$2,000, short +$2,000. */
export const EV_CARRY = EV_CURVES.map((c) => ({ ...c, roll: carryRollDown(c.prices)[0]! }));

/** Spot 16, buy one future at 20, official settlement (VRO) 18. */
export const VRO_EXAMPLE = { spot: 16, entry: 20, settle: 18, pnl: vxNetPnl(20, 18, "long") } as const;

/** A 20-strike VIX call bought for 2 points ($200) settles at 21: pays $100, loses $100. Breakeven 22. */
export const EV_CALL_EXAMPLE = {
  strike: 20,
  premium: 2,
  settle: 21,
  cost: 2 * VIX_OPTION_MULTIPLIER,
  payout: Math.max(0, 21 - 20) * VIX_OPTION_MULTIPLIER,
  pnl: optionPnlAtExpiry("call", 20, 2, 21),
  breakeven: optionBreakeven("call", 20, 2),
  putBreakeven: optionBreakeven("put", 20, 2),
} as const;

/** The model in the notes: short one future at 20; 90% calm (settles 16), 10% spike (settles 36). */
export const EV_ENTRY = 20;
export const EV_OUTCOMES: SettleOutcome[] = [
  { label: "Calm market", p: 0.9, settle: 16 },
  { label: "Volatility spike", p: 0.1, settle: 36 },
];
/** Same 90% win probability, but the spike settles at 70. */
export const EV_TAIL_OUTCOMES: SettleOutcome[] = [
  { label: "Calm market", p: 0.9, settle: 16 },
  { label: "Volatility spike", p: 0.1, settle: 70 },
];

const evRows = (outcomes: SettleOutcome[]) => outcomes.map((o) => ({ ...o, pnl: vxPnl(EV_ENTRY, o.settle, "short") }));

export const EV_MODEL = {
  rows: evRows(EV_OUTCOMES),
  expectedSettle: expectedSettlement(EV_OUTCOMES),
  expectedPnl: shortFutureExpectedPnl(EV_ENTRY, EV_OUTCOMES),
} as const;

export const EV_TAIL_MODEL = {
  rows: evRows(EV_TAIL_OUTCOMES),
  expectedSettle: expectedSettlement(EV_TAIL_OUTCOMES),
  expectedPnl: shortFutureExpectedPnl(EV_ENTRY, EV_TAIL_OUTCOMES),
} as const;

/** The same two models through the call test: a 20 call bought for 2. The tail that sinks the short is what the call is paying for. */
export const EV_CALL_TEST = {
  strike: 20,
  premium: 2,
  base: longCallExpectedPnl(20, 2, EV_OUTCOMES),
  tail: longCallExpectedPnl(20, 2, EV_TAIL_OUTCOMES),
} as const;

/** Selling 3 bought calls before expiration: bought at 1.20, sold at 2.00, $15 total costs. */
export const EARLY_EXIT_EXAMPLE = { contracts: 3, entry: 1.2, exit: 2, costs: 15, pnl: optionPnlBeforeExpiry(1.2, 2, 3, 15) } as const;

/** Formulas as plain readable text (the app has no math renderer). N = contracts, C = trading costs, V_T = official settlement. */
export const EV_FORMULAS = {
  futuresLong: "Long P/L = N × $1,000 × (F exit − F entry) − C",
  futuresShort: "Short P/L = N × $1,000 × (F entry − F exit) − C",
  callAtExpiry: "Call P/L = $100 × N × [max(V_T − K, 0) − c] − C; breakeven K + c",
  putAtExpiry: "Put P/L = $100 × N × [max(K − V_T, 0) − p] − C; breakeven K − p",
  optionEarly: "Sold before expiration: P/L = $100 × N × (q exit − q entry) − C",
  shortEv: "E[P/L] of a short future = $1,000 × N × (F entry − E[V_T]) − C",
  callEv: "E[P/L] of a bought call = $100 × N × (E[max(V_T − K, 0)] − c) − C",
} as const;

export const EDGE_REQUIREMENTS = [
  { id: "distribution", title: "A credible distribution of outcomes", text: "Including the extreme ones. The 90% / 10% split and the 36 or 70 spike above are assumptions, and the answer flips with them." },
  { id: "costs", title: "Realistic execution costs", text: "Commissions, bid-ask spreads, slippage, fees and financing, subtracted as C, not ignored." },
  { id: "out-of-sample", title: "Testing outside the development sample", text: "Choose the model on one period and judge it on data it never saw." },
  { id: "capital", title: "Capital to survive the path", text: "A positive average only helps if the account lives through the losses on the way: one −$16,000 or −$50,000 outcome can end it first." },
] as const;

export const TERM_PREMIUM_NOTE =
  "One possible source of positive expected returns is pay for bearing volatility risk: buyers pay for protection against spikes, sellers carry that exposure. But New York Fed research estimates that the expected return from selling VIX futures (the implied volatility term premium) changes over time and switches between positive and negative. The premium is not permanently available.";

// ---------------------------------------------------------------- daily inverse compounding

export const INVERSE_BENCHMARK = [100, 120, 100];
export const INVERSE_PATH = dailyInverseCompound(INVERSE_BENCHMARK, -1).map(r2);
export const HALF_INVERSE_PATH = dailyInverseCompound(INVERSE_BENCHMARK, -0.5).map(r2);
export const INVERSE_ROUND_TRIP_LOSS = r2(INVERSE_PATH.at(-1)! - 100);

// ---------------------------------------------------------------- strategy families

export const STRATEGY_FAMILIES = [
  {
    id: "short-carry",
    name: "Short-volatility carry",
    thesis: "In stable markets, futures fall enough as they age to pay for costs and the occasional bad move. Contango may be one filter.",
    fails: "A sudden spike: futures can jump many points in days, far more than months of carry. A positive slope alone is not an edge.",
  },
  {
    id: "post-spike",
    name: "Normalization after a spike",
    thesis: "The relevant future will fall faster or further than its current price already implies.",
    fails: "A second shock, a long crisis, or a future that already priced in the calm. A high spot VIX alone is not enough.",
  },
  {
    id: "long-before-event",
    name: "Long volatility before an event",
    thesis: "Stress will build before or during an event and move the chosen instrument enough, soon enough.",
    fails: "Everyone can see the calendar, so it may be priced. The announcement can resolve uncertainty and crush volatility while you pay the premium or the roll.",
  },
  {
    id: "spreads-hedges",
    name: "Spreads and hedges",
    thesis: "Compare two maturities, or use options to cap some losses.",
    fails: "Basis risk, two legs to execute, and hedging cost. A hedge on a different maturity may protect less than expected.",
  },
] as const;

// ---------------------------------------------------------------- why continuous shorting fails

export const WIN_RATE_EXAMPLE = winRateExpectancy([...Array<number>(19).fill(100), -3000]);
export const RECOVERY_TABLE = [20, 50, 80, 90].map((loss) => ({ loss, gain: recoveryGainNeeded(loss) }));

// ---------------------------------------------------------------- sizing and orders

export const SIZING_EXAMPLE = (() => {
  const account = 10_000;
  const budget = 100;
  const entry = 25;
  const stop = 23;
  const gapFill = 15;
  const shares = sharesForBudget(budget, entry, stop);
  return { account, budget, entry, stop, gapFill, shares, plannedLoss: fillLoss(shares, entry, stop), gapLoss: fillLoss(shares, entry, gapFill), vxTenPoints: vxPnl(20, 30, "short") };
})();

export const PRE_TRADE_CHECKLIST = [
  "Exact symbol, contract month or benchmark",
  "Multiplier, bid and ask",
  "Holding period, and whether overnight is allowed",
  "Intended exit and what would invalidate the thesis",
  "Events inside the holding period",
  "Settlement rules (SOQ / VRO for futures and index options; the fund's daily objective)",
  "Stress loss in dollars: the whole premium for a bought option, a severe or total loss for a fund, losses beyond margin for futures",
] as const;

export const PAPER_PROCESS = [
  { id: "one-instrument", title: "One instrument, simulated", text: "Record spot VIX, the first few monthly futures with their expiration dates, the slope, the S&P 500's direction, scheduled events, and the instrument's real entry and exit prices. For options add strike, premium, expiration and the matching futures level." },
  { id: "thesis-first", title: "Write the thesis before the outcome", text: "\"Fear should fall\" can't be tested. Say which contract should fall, by when, why its price looks too high, and what ends the trade. Log no-trade decisions too." },
  { id: "regimes", title: "Test every kind of market", text: "Include calm stretches, sudden shocks, long stress and sharp recoveries. Use the fund's real history, never negative spot-VIX returns. Define roll rules: a jump between contracts on a continuous chart is not a profit you could trade. Use realistic bids and asks, not midpoints." },
  { id: "out-of-sample", title: "Separate choosing from checking", text: "Pick rules on one period and judge them on another. Include failed signals, commissions, slippage, fees, financing and borrow costs, and check whether a fund's mandate changed during the sample." },
  { id: "judge", title: "Judge more than profit", text: "Net profit, maximum drawdown, largest loss, recovery time, exposure during stress, and whether a move would have forced liquidation. Compare time in cash with a low-risk alternative. A good backtest is a reason to investigate, not proof." },
  { id: "before-live", title: "Before any live trade", text: "Read the current prospectus and your broker's margin rules. Some volatility funds issue a Schedule K-1, and tax treatment differs by structure. A first position, if any, should be small enough that a stress loss is tolerable and doesn't push you to bet bigger to recover." },
] as const;

// ---------------------------------------------------------------- the drill

export interface VixDrill {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
}

export const VIX_DRILLS: VixDrill[] = [
  {
    id: "spot-falls-future-rises",
    prompt: "Short 1 VX at 30. Spot VIX falls from 40 to 35; the future rises to 35 and you buy it back.",
    options: [signedUsd(vxPnl(30, 35, "long")), signedUsd(vxPnl(30, 35, "short")), "$0: spot fell, so it washes out"],
    answer: 1,
    why: "A short gains only if the contract falls. Sold at 30, bought at 35: −5 points × $1,000.",
  },
  {
    id: "spot-rises-short-wins",
    prompt: "Short 1 VX at 20. Spot rises from 15 to 17; the future falls to 18 and you buy it back.",
    options: [signedUsd(vxPnl(20, 18, "long")), "A loss, because spot rose", signedUsd(vxPnl(20, 18, "short"))],
    answer: 2,
    why: "The future converged toward spot from above. Sold at 20, bought at 18: +2 points × $1,000, even though spot VIX rose.",
  },
  {
    id: "slope",
    prompt: "The front future (F1) is 18 and the next month (F2) is 20. What is the slope, and what does it mean?",
    options: [`+${r1(termSlopePct(18, 20))}%: contango, not a promised return`, `+${r1(termSlopePct(18, 20))}% a month that a short will earn`, `${r1(termSlopePct(20, 18))}%: backwardation`],
    answer: 0,
    why: "(F2 ÷ F1 − 1) × 100. Positive means contango between those two contracts. It is a price comparison, not a yield or a backtested return.",
  },
  {
    id: "contango-short-loses",
    prompt: "You are short F1 at 18 with the curve at 18 / 20. A week later it is 24 / 25.",
    options: ["Still contango, so the short is fine", `${signedUsd(CONTANGO_SHORT_LOSS.pnl)} per contract, though the curve is still in contango`, "+$1,000: the slope narrowed"],
    answer: 1,
    why: "The curve kept its upward slope, but the level rose 6 points. Waiting for backwardation would not have prevented the loss.",
  },
  {
    id: "call-breakeven",
    prompt: "You bought a VIX 25 call for 2.00. It settles at 26.",
    options: [signedUsd(optionNetAtSettlement("call", 25, 2, 26)), "+$100", "+$600"],
    answer: 0,
    why: "It pays 1 point ($100) but cost 2 points ($200). Breakeven at expiration is 27 before costs: rising volatility is not automatically a profit.",
  },
  {
    id: "inverse-round-trip",
    prompt: "An idealized daily −1x fund starts at $100. Its futures benchmark goes 100 → 120 → 100.",
    options: ["$100.00: the benchmark is unchanged", `$${INVERSE_PATH.at(-1)!.toFixed(2)}`, "$80.00"],
    answer: 1,
    why: "Day 1: −20% → $80. Day 2: +16.67% on $80 → $93.33. About 6.67% lost while the benchmark went nowhere.",
  },
  {
    id: "gap-through-stop",
    prompt: `${SIZING_EXAMPLE.shares} shares bought at $${SIZING_EXAMPLE.entry} with a stop at $${SIZING_EXAMPLE.stop} ($${SIZING_EXAMPLE.budget} planned risk). It gaps open at $${SIZING_EXAMPLE.gapFill} and the stop fills there.`,
    options: [`−$${SIZING_EXAMPLE.budget}: the stop caps it`, usd(SIZING_EXAMPLE.gapLoss), "$0: stops are insurance"],
    answer: 1,
    why: "A stop becomes a market order once triggered; it is not insurance on the price. A stop-limit controls the price but may not fill at all.",
  },
  {
    id: "ev-short-future",
    prompt: "Hypothetical model: short 1 VX at 20 and hold to settlement. 90% it settles at 16, 10% it settles at 36. Expected P/L before costs?",
    options: [signedUsd(EV_MODEL.rows[0]!.pnl), signedUsd(EV_MODEL.expectedPnl), signedUsd(EV_MODEL.rows[1]!.pnl)],
    answer: 1,
    why: "E[V_T] = 0.90 × 16 + 0.10 × 36 = 18, so $1,000 × (20 − 18) = +$2,000. Same as 0.90 × $4,000 + 0.10 × (−$16,000). A model-implied edge, not evidence the probabilities are right.",
  },
  {
    id: "ev-tail-70",
    prompt: "Same model, same 90% chance of a calm 16, but the spike settles at 70 instead of 36. Expected P/L before costs?",
    options: ["+$2,000: the win rate didn't change", signedUsd(EV_TAIL_MODEL.expectedPnl), "−$50,000"],
    answer: 1,
    why: "0.90 × $4,000 + 0.10 × (−$50,000) = −$1,400. Underestimating the rare loss turns apparent profitability into negative expectancy.",
  },
  {
    id: "carry-stable-curve",
    prompt: "The curve is 20 / 22 / 23 (contango). You buy the two-month future at 22. A month later the curve has exactly the same shape. Your result?",
    options: [`${signedUsd(EV_CARRY[0]!.roll.long)}: it now sits in the one-month slot at 20`, "$0: the curve didn't change", "+$1,000: it rolled up the curve"],
    answer: 0,
    why: "The contract slid from 22 to 20: long −$2,000, short +$2,000. That depends on the curve staying put, and swapping into the next contract (rolling) doesn't create an instant profit.",
  },
];

// ---------------------------------------------------------------- glossary (new terms only; VIX, term structure, roll yield, VRP and inverse ETPs live in riskPremiumPortfolio.ts)

const term = (id: string, name: string, category: LiteracyTerm["category"], summary: string, detail: string): LiteracyTerm => ({
  id,
  name,
  category,
  summary,
  detail: `${detail} Educational, not advice.`,
});

export const VIX_TERMS: LiteracyTerm[] = [
  term("implied-vs-realized-volatility", "Implied vs realized volatility", "markets",
    "Implied is the volatility option prices assume for the future; realized is what actually happened.",
    "They can differ a lot: the market can pay for expensive protection against a threat that never arrives. The VIX is implied volatility (30 days, from S&P 500 options). Realized volatility is measured from past price changes."),
  term("vix-one-month-move", "VIX to a one-month move", "markets",
    "VIX is annualized. Multiply by √(30/365) for a rough one-standard-deviation 30-day move: VIX 20 ≈ 5.7%.",
    "VIX 20 means about 20% annualized implied volatility, not a forecast of a 20% fall. The 5.7% is a rough measure under simplifying assumptions, not a guaranteed range: returns jump and volatility itself changes. VIX measures the expected size of moves, not their direction."),
  term("vix-futures-margin", "VIX futures margin and mark-to-market", "position",
    "Margin is collateral, not the most you can lose. Each point on a VX future is $1,000.",
    "Futures are marked to market every day. Adverse moves can require more cash, and a broker can liquidate the position if you can't pay. Losses can exceed the deposit: a 10-point move against one short VX contract is $10,000. A quote of 20 does not mean the contract costs $20."),
  term("mini-vix-futures", "Mini VIX futures (VXM)", "markets",
    "VIX futures at one-tenth the standard size: $100 per index point instead of $1,000.",
    "Smaller dollar moves per contract, with the same mechanics and the same settlement value as the standard contract. Smaller size does not make the trade safer or guarantee liquidity for your order."),
  term("vix-special-opening-quotation", "Special Opening Quotation (SOQ, VRO)", "markets",
    "The value VIX futures and VIX index options settle against, calculated from opening prices of selected SPX options on expiration morning.",
    "It is commonly quoted under the ticker VRO. It is calculated differently from the regular VIX and can differ from the VIX reading just before or after. A trade held to expiration is judged against this settlement value, not the chart's last VIX print."),
  term("vix-curve-slope", "VIX curve slope (F2 vs F1)", "process",
    "(Second-month future ÷ front-month future − 1) × 100. Positive = contango, negative = backwardation.",
    "18 and 20 give about +11.1%; 35 and 30 give about −14.3%. It is a price comparison, not a monthly yield or an expected return. Record expiration dates too (10 and 30 days apart are different comparisons), and track the curve's level: a curve can stay in contango while every contract rises."),
  term("vix-volatility-indices", "VIX9D, VIX3M, VIX6M", "markets",
    "Cboe indices of S&P 500 implied volatility over other horizons (9 days, 3 months, 6 months).",
    "Together with the VIX they form a term structure of option-implied volatility. VIX3M is not the same thing as a VIX future that expires in three months. Check which curve a website shows before using its signal."),
  term("carry-and-convergence", "Carry and convergence", "markets",
    "The gain or loss that comes from time passing as a future moves toward its settlement value.",
    "If spot VIX stays near 15 and a future starts at 20 and settles at 15, a short earns 5 points and a long loses 5. In a stable upward curve this can favor shorts. It is conditional: a volatility spike can cost far more than carry earns, and backwardation reverses it."),
  term("three-kinds-of-decay", "Three kinds of \"decay\"", "process",
    "Option theta, futures roll and convergence, and daily-reset compounding are different things.",
    "Theta is time value leaving an option. Roll and convergence come from the futures curve and contract prices. Daily-reset compounding is how a daily-target fund's returns stack up. A bare futures contract has no option premium that decays through theta."),
  term("daily-reset-path-dependence", "Daily reset and path dependence", "position",
    "A fund that targets a multiple of each day's return compounds daily, so its result depends on the path, not just the start and end.",
    "An idealized daily −1x fund on a benchmark that goes 100 → 120 → 100 ends near $93.33 from $100: about 6.67% lost while the benchmark ended unchanged. A steady trend can work the other way. Model the product's real daily objective and history, not a spot-VIX chart."),
  term("etn-issuer-risk", "ETN issuer risk", "ownership",
    "An exchange-traded note is the issuer's debt, not a fund that owns assets.",
    "If the issuer defaults you are a creditor. Check credit risk, redemption and acceleration terms (an issuer can close a note), and any gap between the market price and the indicative value. \"Exchange-traded\" alone doesn't tell you the structure."),
  term("vix-index-options", "VIX index options", "markets",
    "Cash-settled, European-style options on the VIX with a $100 multiplier, priced off the VIX forward or futures level.",
    "European-style means exercise only at expiration, though you can usually sell earlier. Before expiration they track the matching VIX future more than spot VIX, and the last trading day comes before settlement day. A 25 call bought for 2.00 breaks even at 27 at expiration; a 25 put for 2.00 at 23. Selling uncovered VIX calls can lose enormous amounts."),
  term("options-on-vix-futures", "Options on VIX futures", "markets",
    "Options that settle into a VIX futures position, not into cash.",
    "They are a separate product from the traditional cash-settled VIX index options. Don't assume one's exercise and settlement rules apply to the other."),
  term("vvix", "VVIX", "markets",
    "Cboe's index of the expected volatility of the VIX itself: the volatility of volatility.",
    "VIX options have two layers of volatility: the VIX measures S&P 500 volatility, and VIX options' own implied volatility measures uncertainty about the VIX. A high VVIX means VIX options are expensive."),
  term("win-rate-vs-expectancy", "Win rate vs expectancy", "process",
    "How often you win says little on its own; average win, average loss and the rare big loss decide the result.",
    "19 trades that each make $100 and one that loses $3,000 is a 95% win rate and a $1,100 loss before costs. Expectancy = total result ÷ number of trades. Short-volatility strategies often look like this."),
  term("recovery-math", "Recovery math", "position",
    "After a loss you need a bigger percentage gain to get back: −20% needs +25%, −50% needs +100%, −80% needs +400%.",
    "Gain needed = loss ÷ (100 − loss). After losing 80% of $10,000, $2,000 remains, and getting back to $10,000 takes +$8,000, or 400% of what is left. Waiting for calm doesn't reverse the arithmetic."),
  term("expected-value", "Expected value (expectancy)", "process",
    "The probability-weighted average result of a trade across every outcome you think can happen, extreme ones included.",
    "For a short VIX future held to settlement: E[P/L] = $1,000 × contracts × (entry − expected settlement) − costs. Hypothetical: short at 20 with 90% at 16 and 10% at 36 gives an expected settlement of 18 and +$2,000. It is only as good as the probabilities and outcomes you feed it: a model-implied edge is not evidence."),
  term("negative-expectancy", "Negative expectancy", "process",
    "A trade or system whose expected result after costs is below zero, however often it wins.",
    "Keep the 90% calm case at +$4,000 but let the 10% spike settle at 70 instead of 36 (−$50,000): expectancy drops from +$2,000 to −$1,400. Underestimating rare losses is the usual way a short-volatility plan looks profitable on paper and isn't."),
];

// ---------------------------------------------------------------- cases (packs futures + macro-news, mode vix_products)

const bar = (name: string, open: number, high: number, low: number, close: number): OHLC => ({ name, open, high, low, close });
const seq = (data: Array<[number, number, number, number]>, post = false): OHLC[] =>
  data.map(([o, h, l, c], i) => bar(post ? `+${i + 1}` : `D${i - data.length + 1 === 0 ? "0" : i - data.length + 1}`, o, h, l, c));

const SPIKE_PRE = seq([
  [24.1, 25.0, 23.8, 24.7], [24.7, 27.9, 24.5, 27.4], [27.4, 31.5, 27.0, 30.8], [30.8, 32.2, 29.1, 29.6],
  [29.6, 30.4, 28.6, 30.0], [30.0, 30.9, 29.4, 30.5], [30.5, 31.6, 30.1, 31.2], [31.2, 32.0, 30.6, 31.0],
  [31.0, 32.4, 30.8, 32.1], [32.1, 33.0, 31.7, 32.6], [32.6, 33.4, 32.0, 32.9], [32.9, 34.0, 32.7, 33.5],
]);
const SPIKE_POST = seq([[33.5, 35.2, 33.1, 34.8], [34.8, 35.6, 34.2, 35.0], [35.0, 36.9, 34.6, 36.4], [36.4, 37.1, 35.5, 35.9]], true);

const CONVERGE_PRE = seq([
  [21.2, 21.6, 20.7, 20.9], [20.9, 21.3, 20.4, 20.6], [20.6, 20.9, 20.0, 20.2], [20.2, 20.8, 19.9, 20.0],
  [20.0, 20.5, 19.6, 19.8], [19.8, 20.3, 19.2, 19.5], [19.5, 19.9, 18.9, 19.1], [19.1, 19.7, 18.8, 19.4],
  [19.4, 19.8, 18.6, 18.8], [18.8, 19.2, 18.3, 18.5], [18.5, 18.9, 17.9, 18.2], [18.2, 18.6, 17.8, 18.0],
]);
const CONVERGE_POST = seq([[18.0, 18.2, 17.4, 17.6], [17.6, 17.8, 17.1, 17.3], [17.3, 17.5, 17.0, 17.2]], true);

const STREAK_PRE = seq([
  [16.4, 16.6, 15.9, 16.0], [16.0, 16.3, 15.6, 15.8], [15.8, 16.1, 15.4, 15.6], [15.6, 16.0, 15.3, 15.9],
  [15.9, 16.2, 15.7, 16.0], [16.0, 16.9, 15.9, 16.7], [16.7, 17.8, 16.5, 17.5], [17.5, 18.2, 17.1, 17.9],
  [17.9, 19.4, 17.8, 19.1], [19.1, 20.0, 18.6, 19.6], [19.6, 21.0, 19.4, 20.7], [20.7, 22.0, 20.4, 21.5],
]);
const STREAK_POST = seq([[21.5, 26.4, 21.2, 26.0], [26.0, 31.8, 25.4, 31.0], [31.0, 39.5, 30.2, 38.0], [38.0, 47.5, 36.9, 46.0]], true);

const ROUND_TRIP_PRE = seq([
  [99.2, 100.4, 98.6, 99.8], [99.8, 100.9, 99.1, 100.5], [100.5, 101.2, 99.4, 99.7], [99.7, 100.6, 99.0, 100.2],
  [100.2, 101.0, 99.6, 100.0], [100.0, 100.3, 78.9, 80.0], [80.0, 93.8, 79.6, 93.33],
]);
const ROUND_TRIP_POST = seq([[93.33, 94.6, 92.1, 94.1], [94.1, 96.0, 93.4, 95.5], [95.5, 95.9, 92.6, 93.8], [93.8, 96.5, 93.2, 96.0]], true);

const GAP_PRE = seq([
  [23.4, 23.9, 23.1, 23.6], [23.6, 24.3, 23.4, 24.1], [24.1, 24.6, 23.8, 24.4], [24.4, 25.3, 24.2, 25.0],
  [25.0, 25.6, 24.7, 25.2], [25.2, 25.8, 24.9, 25.4], [25.4, 25.7, 24.6, 24.8], [15.0, 15.6, 14.9, 15.2],
]);
const GAP_POST = seq([[15.2, 15.4, 14.5, 14.6], [14.6, 14.9, 14.0, 14.1], [14.1, 14.4, 13.7, 13.9]], true);

/** Numbers the case briefs quote; vixTrading.test.ts checks them against the bars and the helpers. */
export const VIX_CASE_FACTS = {
  spike: { entry: 30, decision: 33.5, stopLevel: 33, heldTo: 35.9 },
  converge: { entry: 20, decision: 18, settle: 17.2 },
  streak: { wins: 19, entry: 16, decision: 21.5, peak: 46, maxLoss: 500 },
  roundTrip: { start: 100, afterDayOne: 80, decision: 93.33 },
  gap: { shares: 50, entry: 25, stop: 23, open: 15, decision: 15.2 },
} as const;

const futuresBase = {
  contextType: "news" as const,
  thinkingMode: "vix_products" as const,
  packId: "futures" as const,
  assetClass: "future" as const,
  allowShort: false,
  difficulty: "intermediate" as const,
};
const fundBase = { ...futuresBase, packId: "macro-news" as const, assetClass: "equity" as const };

export const VIX_CASES: CaseStudy[] = [
  {
    ...futuresBase,
    id: "case-vix-short-future-spot-falls",
    title: "Short a VIX future: spot falls, your future rises",
    brief:
      "SAMPLE hypothetical VX futures chart. After a shock, spot VIX was 40 and you shorted this future at 30.00 (one standard contract, $1,000 a point), expecting fear to ease. Spot has eased to 36, as you forecast, but your future has climbed to 33.50: −$3,500. Your written plan said cover if the future closes above 33. Buy (cover the short), sell (add to the short), or hold?",
    newsHeadline: "Stocks steady and spot VIX eases, but the futures curve keeps repricing higher.",
    preOhlc: SPIKE_PRE,
    postOhlc: [...SPIKE_PRE, ...SPIKE_POST],
    correctActions: ["buy"],
    acceptablePartial: [],
    debrief: {
      process:
        "The plan's exit was hit, so cover and take the defined loss. Your forecast about spot was right, but you don't own spot: a short future pays only if that contract falls. At 30 it already priced in a lot of calming down. Adding to a losing short because the headline index agrees with you is the mistake.",
      whyMarketMoved:
        "Futures price where the VIX will settle at expiration, not where it is today. Here the market kept pricing a longer stretch of stress even as spot eased.",
      evidence: "SAMPLE: entry 30.00, decision 33.50 (−$3,500), then 34.80, 35.00, 36.40, 35.90. Held to 35.90, the loss is $5,900.",
    },
  },
  {
    ...futuresBase,
    id: "case-vix-spot-rises-short-wins",
    title: "Short a VIX future: spot rises, the short still wins",
    brief:
      "SAMPLE hypothetical VX futures chart, a few sessions before settlement. You shorted this future at 20.00 when spot VIX was 15; your plan was to hold toward settlement and cover above 22. Spot has risen to 17, which feels bad, but the future has fallen to 18.00: +$2,000. Buy (cover now), sell (add to the short), or hold?",
    newsHeadline: "Spot VIX ticks up to 17 into expiration week.",
    preOhlc: CONVERGE_PRE,
    postOhlc: [...CONVERGE_PRE, ...CONVERGE_POST],
    correctActions: ["hold"],
    acceptablePartial: ["buy"],
    debrief: {
      process:
        "The thesis was convergence: a future priced above spot drifting toward its settlement value. That is working and the plan's exit (above 22) has not been hit, so holding follows the plan. Covering to bank +$2,000 is also reasonable. Adding at 18 is a new trade with little room left to converge.",
      whyMarketMoved:
        "Near expiration a VIX future converges to the Special Opening Quotation (VRO), which is calculated from SPX options much like spot VIX. A future at 18 with spot at 17 has little premium left.",
      evidence: "SAMPLE: entry 20.00, decision 18.00, then 17.60, 17.30; settles at 17.20. Short held to settlement: +$2,800.",
    },
  },
  {
    ...futuresBase,
    id: "case-vix-95-percent-win-rate",
    title: "Nineteen small wins, then the curve inverts",
    brief:
      "SAMPLE hypothetical Mini VIX futures (VXM, $100 a point) chart. Shorting one VXM has won 19 times in a row, about 1 point ($100) each: +$1,900. This time you shorted at 16.00. The front future is now 21.50 (−$550) and above the second month: the curve has inverted. Your plan caps a single trade's loss at $500. Buy (cover), sell (add), or hold?",
    newsHeadline: "Selloff spreads; front-month VIX futures jump above the second month.",
    preOhlc: STREAK_PRE,
    postOhlc: [...STREAK_PRE, ...STREAK_POST],
    correctActions: ["buy"],
    acceptablePartial: [],
    debrief: {
      process:
        "The loss cap is already passed and the carry thesis is gone (backwardation). Cover now. A 95% win rate says nothing about the size of the one loss; holding \"because it always comes back\" turns a $550 loss into the one that erases the streak.",
      whyMarketMoved: "Volatility spikes come in days. Futures can move many points while the slow carry took weeks to earn one.",
      evidence: `SAMPLE: decision 21.50, then 26.00, 31.00, 38.00, 46.00. Held, that one trade loses $3,000; with the 19 wins the record is 95% winners and ${usd(WIN_RATE_EXAMPLE.total)} overall.`,
    },
  },
  {
    ...fundBase,
    id: "case-vix-inverse-fund-round-trip",
    title: "A daily inverse VIX fund after a round trip",
    brief:
      "SAMPLE hypothetical chart of a fund that targets −1x the daily return of a short-term VIX futures index. You hold it at 4% of your account (your cap is 5%). Over the last two days its benchmark rose 20%, then fell back to where it started. The fund went 100.00 → 80.00 → 93.33. A friend says it \"owes\" you the 6.67% and you should buy more. Buy more, sell, or hold?",
    newsHeadline: "VIX futures round-trip after a two-day scare.",
    preOhlc: ROUND_TRIP_PRE,
    postOhlc: [...ROUND_TRIP_PRE, ...ROUND_TRIP_POST],
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process:
        "Nothing is owed. A daily-reset fund compounds each day's return, so up-then-down swings cost it money even when the benchmark ends unchanged. Hold within your cap if your thesis still stands, or sell if it doesn't. Buying more on the \"catch-up\" story is adding on a misunderstanding.",
      whyMarketMoved: "Day 1: −20% on $100 = $80. Day 2: +16.67% on $80 = $93.33. The SEC warns that daily leveraged and inverse funds can behave very differently from their benchmark over longer periods.",
      evidence: "SAMPLE: idealized −1x path 100 → 80 → 93.33 (−6.67%) with the benchmark flat; then 94.10, 95.50, 93.80, 96.00.",
    },
  },
  {
    ...fundBase,
    id: "case-vix-gap-through-stop",
    title: "A long-volatility fund gaps through the stop",
    brief:
      "SAMPLE hypothetical chart of a long-volatility fund. Practice account $10,000, trade-loss budget $100. You bought 50 shares at $25.00 ahead of an event, with a stop-limit at $23.00 (limit $22.50) for a planned $100 loss. The event passed calmly and the fund opened at $15.00. Your stop-limit never filled. It now trades at $15.20, about −$490. Buy more, sell, or hold?",
    newsHeadline: "Event passes without surprises; volatility collapses at the open.",
    preOhlc: GAP_PRE,
    postOhlc: [...GAP_PRE, ...GAP_POST],
    correctActions: ["sell"],
    acceptablePartial: [],
    debrief: {
      process:
        "The thesis (stress into the event) is over and the exit level is far behind you, so exit. The order type did what it does: a stop becomes a market order after it triggers and can fill far past the stop; a stop-limit controls the price but can stay unfilled. Size for the gap, not the stop. Averaging down to \"get back\" is the move to avoid.",
      whyMarketMoved: "A resolved event can crush volatility overnight. Long-volatility funds also lose to the roll in contango while you wait.",
      evidence: "SAMPLE: entry 25.00, stop 23.00 / limit 22.50, open 15.00 (a $500 gap loss on 50 shares), then 14.60, 14.10, 13.90.",
    },
  },
];

// ---------------------------------------------------------------- Learn questions (VIX-)

const IDS = ["A", "B", "C", "D"] as const;
type OptId = (typeof IDS)[number];
function mc(id: string, prompt: string, at: OptId, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(IDS.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: IDS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export const VIX_QUESTIONS: QuizQuestion[] = [
  mc("VIX-01", "The VIX reads 20. What does that describe?", "B", "About 20% annualized implied volatility of the S&P 500 over the next 30 days",
    ["A forecast that stocks fall 20% next month", "A 20% chance of a crash", "The S&P 500 moved 20% last month"],
    `VIX is annualized implied volatility from SPX options. Scaled to 30 days it is about ${pct(vixMonthlySigma(20))} for one standard deviation, and it says nothing about direction.`, "vix-one-month-move"),
  mc("VIX-02", "Roughly what one-standard-deviation 30-day S&P 500 move does a VIX of 30 imply?", "C", `About ${pct(vixMonthlySigma(30))}`,
    ["About 30%", "About 2.5%", "About 15%"],
    "30 × √(30/365) ≈ 8.6%. A rough guide under simplifying assumptions, not a guaranteed range: markets jump.", "vix-one-month-move"),
  mc("VIX-03", "What is the difference between implied and realized volatility?", "A", "Implied comes from option prices about the future; realized is what prices actually did",
    ["They are two names for the same number", "Realized comes from option prices; implied from past prices", "Implied only exists for single stocks"],
    "They can differ a lot. Investors can pay up for protection against a threat that never comes.", "implied-vs-realized-volatility"),
  mc("VIX-04", "Can you buy the spot VIX index itself?", "D", "No: it is an index; you trade VX futures, VIX options or futures-based funds such as VIXY, SVIX and SVXY",
    ["Yes, like a stock", "Only through a margin account", "Only in a retirement account"],
    "Each product has its own payoff, holding costs and worst-case loss. VIXY, for example, follows first- and second-month futures, not spot VIX.", "vix-index"),
  mc("VIX-05", "You short one standard VX future at 20 and buy it back at 35. Gross result?", "B", signedUsd(vxPnl(20, 35, "short")),
    ["−$15", "+$15,000", "−$1,500"],
    "For a short, (entry − exit) × $1,000 × contracts: (20 − 35) × $1,000 = −$15,000. A quote of 20 doesn't mean the contract costs $20.", "contract-multiplier"),
  mc("VIX-06", "Your broker requires margin to short a VIX future. Is that the most you can lose?", "C", "No: margin is collateral; losses are marked to market daily and can exceed the deposit",
    ["Yes, the exchange caps losses at margin", "Yes, unless you hold past expiration", "No, but only for long positions"],
    "Adverse moves can bring margin calls or forced liquidation. The NFA reminds customers they are responsible for meeting margin calls.", "vix-futures-margin"),
  mc("VIX-07", "A Mini VIX future (VXM) moves 5 points against you. How much is that per contract?", "A", usd(5 * VXM_MULTIPLIER),
    ["$5,000", "$50", "$5"],
    "VXM is one-tenth of VX: $100 a point. Smaller dollars, same mechanics; it doesn't make the trade safer.", "mini-vix-futures"),
  mc("VIX-08", "Standard VIX futures held to expiration settle against what?", "D", "The Special Opening Quotation (VRO), calculated from opening SPX option prices",
    ["The VIX close the day before", "The average VIX over the contract's life", "The next month's future"],
    "The SOQ is calculated differently from the regular VIX and can differ from the prints just before or after.", "vix-special-opening-quotation"),
  mc("VIX-09", "F1 is 18 and F2 is 20, a slope of about +11.1%. What is that number?", "B", "Contango between those two contracts, not a promised return",
    ["A monthly yield a short collects", "Backwardation", "The expected move in spot VIX"],
    "(F2 ÷ F1 − 1) × 100 compares two prices today. Record the expiration dates too: 10 days apart and 30 days apart are different comparisons.", "vix-curve-slope"),
  mc("VIX-10", "You are short F1 at 18 with the curve at 18 / 20. It moves to 24 / 25. What happened?", "C", `Still contango, and the short lost 6 points (${usd(CONTANGO_SHORT_LOSS.pnl)})`,
    ["The short made money because contango favors shorts", "Nothing: the slope didn't flip", "The curve went into backwardation"],
    "Track the curve's level, not only its slope. Waiting for backwardation would not have prevented this loss.", "vix-curve-slope"),
  mc("VIX-11", "A site shows a \"VIX term structure\" of VIX9D, VIX, VIX3M and VIX6M. What is VIX3M?", "A", "An index of 3-month S&P 500 implied volatility, not a VIX future expiring in 3 months",
    ["The VIX future three months out", "The VIX three months ago", "A fund holding three months of futures"],
    "Cboe publishes both option-implied volatility indices and futures term structures. Check which curve you're looking at before using a signal.", "vix-volatility-indices"),
  mc("VIX-12", "Spot VIX stays near 15. A future you shorted at 20 settles at 15. What drove the result?", "D", "Convergence: the future fell to its settlement value, +5 points for the short",
    ["Theta decay of the future", "A rise in spot VIX", "Nothing: spot didn't move, so the result is zero"],
    "That is carry. It is conditional: a spike can cost far more than convergence earns.", "carry-and-convergence"),
  mc("VIX-13", "Which kind of \"decay\" applies to a plain VIX futures contract?", "B", "Roll and convergence along the curve; it has no option premium, so no theta",
    ["Theta, like any option", "Daily-reset compounding", "All three equally"],
    "Theta belongs to options, roll and convergence to futures, and daily-reset compounding to funds that target a daily multiple.", "three-kinds-of-decay"),
  mc("VIX-14", "After a shock, spot VIX is 40 and a future is 30. You short it. Spot falls to 35; the future rises to 35. Result?", "A", `${signedUsd(vxPnl(30, 35, "short"))}: right about spot, wrong on the trade`,
    ["+$5,000: spot fell", "$0", "+$10,000"],
    "The future already priced in a lot of calming down. What counts is the contract you sold and where you bought it back.", "carry-and-convergence"),
  mc("VIX-15", "You buy a VIX 25 call for 2.00 and it settles at 26. Result before costs, and the breakeven?", "C", `${signedUsd(optionNetAtSettlement("call", 25, 2, 26))}; breakeven ${optionBreakeven("call", 25, 2)}`,
    ["+$100; breakeven 25", "+$600; breakeven 26", "−$200; breakeven 23"],
    "It pays $100 but cost $200. A 25 put bought for 2.00 breaks even at 23. Rising volatility isn't automatically a profit.", "options-breakeven"),
  mc("VIX-16", "What does Cboe's VVIX measure?", "D", "The expected volatility of the VIX itself (the volatility of volatility)",
    ["The VIX on a 9-day horizon", "Volume in VIX futures", "A leveraged VIX fund"],
    "VIX options have two layers: VIX is about S&P 500 volatility; VIX options' implied volatility is about uncertainty in the VIX.", "vvix"),
  mc("VIX-17", "How are options on VIX futures different from traditional VIX index options?", "B", "They settle into a VIX futures position; index options settle in cash",
    ["They are the same product", "They never expire", "They only trade at night"],
    "Check the contract name and its exercise and settlement rules; one product's rules don't carry over to the other.", "options-on-vix-futures"),
  mc("VIX-18", "An idealized daily −1x fund starts at $100. Its benchmark goes 100 → 120 → 100. Where does the fund end?", "A", `About $${INVERSE_PATH.at(-1)!.toFixed(2)} (−6.67%)`,
    ["$100: the benchmark is unchanged", "$80", "$120"],
    "Day 1: −20% → $80. Day 2: +16.67% on $80. Compounding depends on the path; the SEC stresses this for daily leveraged and inverse funds.", "daily-reset-path-dependence"),
  mc("VIX-19", "SVXY targets −0.5x a short-term VIX futures index's daily return; SVIX targets −1x its own index. What follows?", "C", "Different exposures and benchmarks; neither promises the opposite of spot VIX over your holding period",
    ["They are interchangeable", "SVXY can't lose money", "Both track spot VIX exactly"],
    "Smaller inverse exposure changes the sensitivity but doesn't make a large allocation safe. The SVIX issuer warns you could lose the full investment in a single day.", "inverse-volatility-etp"),
  mc("VIX-20", "What extra risk does an exchange-traded note (ETN) carry that a fund holding futures doesn't?", "D", "Issuer credit risk: an ETN is the issuer's debt, and the issuer can accelerate or redeem it",
    ["None: \"exchange-traded\" means the same structure", "It can't trade below its indicative value", "ETNs are insured by the exchange"],
    "SEC Investor.gov: ETNs don't own an underlying portfolio, so holders depend on the issuer's creditworthiness.", "etn-issuer-risk"),
  mc("VIX-21", "A strategy wins $100 on 19 trades and loses $3,000 on one. Win rate and total?", "B", `${pct(WIN_RATE_EXAMPLE.winRate, 0)} winners, ${usd(WIN_RATE_EXAMPLE.total)} total`,
    ["95% winners, +$1,900", "50% winners, $0", "5% winners, −$3,000"],
    `Expectancy is ${usd(WIN_RATE_EXAMPLE.expectancy)} a trade. Average win, average loss and the rare big loss decide the result, not the win rate.`, "win-rate-vs-expectancy"),
  mc("VIX-22", "An account loses 80%. What gain on what is left is needed to get back to the start?", "C", `${recoveryGainNeeded(80)}%`,
    ["80%", "100%", "160%"],
    "Gain needed = loss ÷ (100 − loss). $10,000 → $2,000 needs +$8,000, which is 400% of $2,000.", "recovery-math"),
  mc("VIX-23", `You buy ${SIZING_EXAMPLE.shares} shares at $${SIZING_EXAMPLE.entry} with a stop at $${SIZING_EXAMPLE.stop} ($${SIZING_EXAMPLE.budget} planned risk). It gaps open at $${SIZING_EXAMPLE.gapFill} and the stop fills there. Loss?`, "A", usd(SIZING_EXAMPLE.gapLoss),
    [`−$${SIZING_EXAMPLE.budget}`, "$0", "−$1,000"],
    "A stop triggers a market order; it isn't price insurance. A stop-limit controls the price but can leave you unfilled. FINRA discusses both risks in volatile markets.", "stop-limit-order"),
  mc("VIX-24", "You hold mostly stocks and add a short-volatility position. What does that do in a selloff?", "B", "Both tend to lose together, so it adds dependence on calm markets rather than diversifying",
    ["It hedges the stocks", "Nothing: they are unrelated", "It doubles the dividend"],
    "Short volatility tends to lose when stocks fall. A long-volatility hedge has the opposite intended role, but its cost and imperfect response can make it unsuitable too.", "correlation"),
  mc("VIX-25", "Is trading VIX products a valid play for a beginner?", "D", "They are legitimate products and documented premia exist, but the edge is conditional with fat tails: paper-trade first or skip",
    ["Yes: shorting volatility is steady income", "No: VIX products are scams", "Yes: buying VIX before every event is a reliable hedge"],
    "Research such as the New York Fed's report on volatility term premia documents risk premia in volatility pricing. They come with rare, very large losses. No position is a valid outcome.", "volatility-risk-premium"),
  // where an edge actually comes from: expected value vs price (all hypothetical)
  mc("VIX-26", "Spot VIX is 16 and a VIX future trades at 20. What does the 4-point gap tell you?", "B", "It may reflect expected higher volatility, pay for bearing risk, or both; on its own it isn't an edge",
    ["Shorting it locks in 4 points", "The future is mispriced by 4 points", "VIX will be 20 at expiration"],
    "A future is a price for the VIX at its own settlement date. The edge question is how that price compares with the payouts you can expect, not how far it sits from spot.", "vix-term-structure"),
  mc("VIX-27", "Hypothetical: spot VIX is 16. You buy one VX future at 20 and hold it; the official settlement (VRO) is 18. Result before costs?", "C", signedUsd(VRO_EXAMPLE.pnl),
    ["+$2,000: volatility rose from 16", "$0", "−$200"],
    "(18 − 20) × $1,000 = −$2,000. Volatility finished above where spot started but below the price you paid. At expiration the exit is the VRO, which can differ from the displayed VIX.", "vix-special-opening-quotation"),
  mc("VIX-28", "A model gives a 90% chance the VIX settles at 16 and 10% that it settles at 36. What is the expected settlement E[V_T]?", "A", String(EV_MODEL.expectedSettle),
    ["26", "16", "20"],
    "0.90 × 16 + 0.10 × 36 = 14.4 + 3.6 = 18. A probability-weighted average, so the rare spike still counts.", "expected-value"),
  mc("VIX-29", "Same model. You short one VX future at 20 and hold to settlement. Expected P/L before costs?", "D", signedUsd(EV_MODEL.expectedPnl),
    ["+$4,000", "−$16,000", "+$3,600"],
    "$1,000 × (20 − 18) = +$2,000, or 0.90 × $4,000 + 0.10 × (−$16,000). A model-implied edge before costs, not proof the probabilities are right.", "expected-value"),
  mc("VIX-30", "Keep the 90% calm outcome (settles 16) but let the 10% spike settle at 70 instead of 36. Expected P/L on the short at 20?", "B", signedUsd(EV_TAIL_MODEL.expectedPnl),
    ["+$2,000: the win probability is unchanged", "−$5,000", "+$400"],
    "0.90 × $4,000 + 0.10 × (−$50,000) = −$1,400. Same win rate, opposite sign: underestimating rare losses turns apparent profit into negative expectancy.", "negative-expectancy"),
  mc("VIX-31", "You short 2 VX futures at 20. Your model's expected settlement is 18 and round-trip costs are $100. Expected P/L?", "C", signedUsd(shortFutureExpectedPnl(20, EV_OUTCOMES, 2, 100)),
    ["+$2,000", "+$4,000", "+$1,900"],
    "$1,000 × 2 × (20 − 18) − $100 = +$3,900. Costs come off the expected result just as they come off a realized one.", "expected-value"),
  mc("VIX-32", "Your spreadsheet says shorting VIX futures has an expected value of +$2,000 a contract. What has it shown?", "A", "Only what your assumed probabilities imply; it isn't evidence those probabilities are right",
    ["A proven edge you can trade", "That the trade wins 90% of the time", "That costs don't matter"],
    "An edge claim needs a credible distribution (extremes included), realistic costs, testing outside the period you built it on, and enough capital to survive losses along the way.", "expected-value"),
  mc("VIX-33", "The curve is 20 / 22 / 23. You short the two-month future at 22. One month later the curve has exactly the same shape. Result?", "D", `${signedUsd(EV_CARRY[0]!.roll.short)}: it now sits in the one-month slot at 20`,
    ["$0: the curve didn't move", "−$2,000", "+$3,000: it rolled to 23"],
    "That is carry under a stable curve: the long loses $2,000 and the short gains $2,000. It depends on the curve keeping its shape, which a spike can break in days.", "carry-and-convergence"),
  mc("VIX-34", "Your front-month VIX future expires and you replace it with the next month (a roll). What does the roll itself do to your P/L?", "B", "Nothing by itself: you close one contract at its price and open another at its price",
    ["It books the curve's slope as instant profit", "It always costs the slope", "It resets the position to spot VIX"],
    "Carry comes from a contract's price changing over time. The jump between contracts on a continuous chart isn't a gain you could trade.", "roll-yield"),
  mc("VIX-35", "You bought 3 VIX calls at 1.20 and sell them before expiration at 2.00. Total costs are $15. Result?", "C", signedUsd(EARLY_EXIT_EXAMPLE.pnl),
    ["+$240", "+$80", "+$585"],
    "$100 × 3 × (2.00 − 1.20) − $15 = +$225. Before expiration the option's price, not the settlement payoff, decides the result.", "vix-index-options"),
  mc("VIX-36", "A model gives 90% that VIX settles at 16 and 10% at 36. A 20-strike call costs 2.00. Expected P/L of buying one, before costs?", "A", signedUsd(EV_CALL_TEST.base),
    ["+$1,400", "+$1,600", "−$200"],
    "E[max(V_T − 20, 0)] = 0.90 × 0 + 0.10 × 16 = 1.6 points, against a 2-point premium: $100 × (1.6 − 2) = −$40. If that spike were 70, the same call's expectancy would be +$300.", "expected-value"),
  mc("VIX-37", "Why can't today's spot VIX alone tell you what a VIX option is worth?", "D", "VIX options are priced off the matching expiration's futures level, time left and implied volatility",
    ["Because VIX options settle into stock", "Because spot VIX isn't published during trading", "It can: the option tracks spot one for one"],
    "Cboe notes VIX option prices are based on their related futures contracts and carry their own implied volatility, time and delta sensitivities.", "vix-index-options"),
  mc("VIX-38", "According to New York Fed research, what happens to the expected return from selling VIX futures over time?", "C", "It changes and switches between positive and negative; the premium isn't permanently available",
    ["It is a steady positive yield", "It is always negative", "It equals the curve's slope"],
    "Liberty Street Economics estimates the implied volatility term premium and finds it large, time-varying and at times negative, including when systematic risk jumps.", "volatility-risk-premium"),
  mc("VIX-39", "A $10,000 account shorts one standard VX future at 20. A spike sends it to 36. What happens?", "B", `${usd(vxPnl(20, 36, "short"))}: more than the whole account, before costs`,
    ["−$1,600, a 16% drawdown", "Losses stop at the margin deposit", "−$160"],
    "16 points × $1,000. Short volatility can wipe out an account, and futures losses can exceed what you deposited. Inverse volatility funds need their own risk education too.", "vix-futures-margin"),
  mc("VIX-40", "Which set of checks turns a promising VIX expected-value model into a usable edge claim?", "A", "A credible distribution of outcomes, realistic costs, out-of-sample testing, and capital to survive the losses",
    ["A high win rate in the backtest", "Contango on the curve today", "A spike probability you're comfortable with"],
    "Each one targets a way the model can be wrong. A good backtest is a reason to investigate, not proof.", "overfitting"),
];

// ---------------------------------------------------------------- links, Playbook

export const VIX_LINKS: { label: string; to: string }[] = [
  { label: "Learn · VIX Trading: Futures, Curve & Products", to: "/training?group=vix-trading&start=1" },
  { label: "Coach · Right forecast, losing trade", to: "/coach/vix-futures-curve" },
  { label: "Cases · Futures (VIX futures cases)", to: "/cases?pack=futures" },
  { label: "Cases · Market-wide news (VIX fund cases)", to: "/cases?pack=macro-news" },
  { label: "Playbook · VIX futures curve and carry (paper trade first)", to: "/playbooks/vix-curve-carry-paper" },
  { label: "Practice · Risk-premium portfolio and the VIX overlay", to: "/practice/risk-premium-portfolio" },
  { label: "Playbook · Stop vs stop-limit on a gap", to: "/playbooks/stop-vs-stop-limit" },
  { label: "Playbook · Futures offset, roll and settlement", to: "/playbooks/futures-roll" },
  { label: "Glossary · Stop-limit order", to: "/archive?tab=literacy&open=stop-limit-order" },
];

export const VIX_RELATED: { label: string; to: string }[] = [
  { label: "Practice · VIX trading for beginners (lesson and drills)", to: "/practice/vix-trading" },
  { label: "Learn · VIX Trading: Futures, Curve & Products", to: "/training?group=vix-trading&start=1" },
  { label: "Cases · Futures (short VIX future, spot vs future, 95% win rate)", to: "/cases?pack=futures" },
  { label: "Cases · Market-wide news (inverse fund round trip, gap through a stop)", to: "/cases?pack=macro-news" },
  { label: "Practice · Risk-premium portfolio and the VIX overlay", to: "/practice/risk-premium-portfolio" },
  { label: "Playbook · Stop vs stop-limit on a gap", to: "/playbooks/stop-vs-stop-limit" },
];

export const VIX_PLAYBOOK_SOURCE = {
  url: "https://www.cboe.com/tradable-products/vix/vix-futures/",
  label: "Cboe · VIX futures",
  verifiedOn: "2026-10-30",
} as const;

const V = "2026-10-30";
const src = (supports: string, label: string, url: string, note: string) => ({ supports, label, url, note, role: "corroborates" as const, verifiedOn: V });

export const VIX_CREDIBILITY: PlaybookCredibility = {
  title: "How well-tested is this?",
  summary: [
    "This kit is a paper-trading process, not a strategy with a track record. Its material comes from the article “VIX Trading for Beginners” (no author named; product descriptions checked 22 October 2026) and the sources it cites, which the app re-opened on 30 October 2026. Every trade and number in the kit is hypothetical.",
    "The mechanics are not opinion: contract sizes, settlement, fund objectives and order behavior come from Cboe, the SEC, FINRA, the NFA and the fund issuers. The edge is weaker than it sounds. Research documents risk premia in volatility pricing, but they change over time, can turn negative, are not a forecast, and come with rare, very large losses. A contango filter alone is not an edge.",
    "An edge means the instrument's price is below (or, for a short, above) the payouts you can credibly expect after costs. The kit's expected-value examples are model-implied: a short at 20 looks like +$2,000 with a spike to 36 and −$1,400 with a spike to 70. That is a reason to test, not evidence.",
    "Short volatility can wipe out an account in a day. For most beginners the right size is a paper trade, or nothing.",
  ],
  sources: [
    src("What the VIX measures (30-day, annualized, not directional)", "Cboe · Volatility trading", "https://www.cboe.com/tradable-products/volatility-trading/",
      "VIX is a constant 30-day expected volatility of the US stock market, expressed as an annualized standard deviation, and does not forecast direction."),
    src("Settlement (Special Opening Quotation)", "Cboe · VIX Index methodology (PDF)", "https://cdn.cboe.com/resources/indices/governance/Volatility_Index_Methodology_Cboe_Volatility_Index.pdf",
      "Final settlement for VIX futures and options comes from a Special Opening Quotation (SOQ) on expiration morning, calculated differently from the regular VIX."),
    src("VX futures arithmetic ($1,000 a point)", "Cboe · VIX futures contract specifications", "https://www.cboe.com/tradable-products/vix/vix-futures/specifications/",
      "The contract multiplier for VX futures is $1,000."),
    src("Mini VIX futures (one-tenth size)", "Cboe · Mini VIX futures fact sheet (PDF)", "https://cdn.cboe.com/resources/futures/mini-vix-fact-sheet.pdf",
      "Mini VIX futures are 1/10th the size of the standard contract, with a $100 multiplier."),
    src("Reading the curve (contango, backwardation)", "Cboe · Is VIX backwardation necessarily a sign of a future down market? (2022)", "https://www.cboe.com/insights/posts/inside-volatility-trading-is-vix-backwardation-necessarily-a-sign-of-a-future-down-market",
      "Defines contango as the normal upward-sloping VIX futures curve and questions whether backwardation predicts a down market."),
    src("VIX9D, VIX3M, VIX6M are different horizons", "Cboe · VIX term structure", "https://www.cboe.com/tradable-products/vix/term-structure/",
      "Cboe publishes VIX9D (9-day), VIX (30-day), VIX3M (3-month), VIX6M (6-month) and VIX1Y gauges of option-implied volatility."),
    src("The documented edge: volatility term premia", "Federal Reserve Bank of New York · Equity Volatility Term Premia (Staff Report 867)", "https://www.newyorkfed.org/research/staff_reports/sr867",
      "Estimates the term structure of volatility risk premia; term-premia estimates predict variance swap and VIX futures returns, and implied-volatility term premia fall or stay muted when systematic risk rises."),
    src("Carry, roll return and who pays it", "BlackRock (hosted by Cboe) · VIX Your Portfolio (2013, PDF)", "https://cdn.cboe.com/resources/vix/VIX%20Your%20Portfolio-Blackrock.pdf",
      "The curve is typically in contango; contango and the roll return create an insurance-like premium paid by longs and received by shorts, and the curve can invert in extreme volatility."),
    src("The volatility risk premium in research", "arXiv · Hansen, Huang, Tong, Wang: Realized GARCH, CBOE VIX, and the Volatility Risk Premium", "https://arxiv.org/abs/2112.05302",
      "A model that yields closed-form expressions for both the VIX and the volatility risk premium."),
    src("VIXY follows futures, not spot", "ProShares · VIXY", "https://www.proshares.com/our-etfs/strategic/vixy",
      "Seeks to match the S&P 500 VIX Short-Term Futures Index, which rolls from first- to second-month futures daily; the fund issues a K-1."),
    src("SVIX: daily −1x, total loss in a day possible", "Volatility Shares · SVIX", "https://www.volatilityshares.com/svix/",
      "Targets the daily inverse of a first- and second-month VIX futures portfolio; you could lose the full principal value within a single day."),
    src("SVXY: daily −0.5x", "ProShares · SVXY", "https://www.proshares.com/our-etfs/strategic/svxy",
      "Seeks one-half the inverse (−0.5x) of its index's daily performance; rolling futures daily has significant costs; the fund issues a K-1."),
    src("Daily reset and path dependence", "SEC Investor.gov · Updated investor bulletin: Leveraged and inverse ETFs (2023)", "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/sec",
      "Most leveraged and inverse ETFs reset daily, so performance over longer periods can differ significantly from the stated daily objective."),
    src("ETN issuer risk", "SEC Investor.gov · Investor bulletin: Exchange traded notes", "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-50",
      "ETNs are debt obligations that don't own an underlying portfolio, so holders are exposed to the issuer's creditworthiness."),
    src("Margin can lose more than you put in", "SEC Investor.gov · Leveraged investing strategies: know the risks (2021)", "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/leveraged-investing-strategies-know-risks-using-these-advanced-investment-tools",
      "Buying on margin, you can lose more than 100% of your money and still owe the broker."),
    src("Futures margin calls", "National Futures Association · Investor best practices", "https://www.nfa.futures.org/investors/investor-resources/files/investor-best-practices.html",
      "Futures customers are responsible for keeping adequate funds on deposit for margin and for meeting margin calls."),
    src("VIX index options ($100, European, cash)", "Cboe · VIX options specifications", "https://www.cboe.com/tradable_products/vix/vix_options/specifications",
      "$100 multiplier, European-style exercise on the expiration date, last trading day the business day before expiration."),
    src("Options on VIX futures are a different product", "Cboe · Options on VIX futures", "https://www.cboe.com/tradable-products/vix/options-on-vix-futures/",
      "These options are physically settled into the front-month VIX futures contract and trade on Cboe Futures Exchange."),
    src("VVIX (volatility of the VIX)", "Cboe · VVIX index dashboard", "https://www.cboe.com/us/indices/dashboard/VVIX",
      "Cboe's published dashboard for the VVIX index."),
    src("The premium changes and can turn negative", "New York Fed · Liberty Street Economics: Equity volatility term premia (2021)", "https://libertystreeteconomics.newyorkfed.org/2021/02/equity-volatility-term-premia/",
      "Estimates the expected return from selling VIX futures (implied volatility term premia): large, time-varying, switching between positive and negative, and falling at first when systematic risk rises."),
    src("VIX options price off futures, not spot", "Cboe · Inside volatility trading: Nothing remains unchanged (2021)", "https://www.cboe.com/insights/posts/inside-volatility-trading-nothing-remains-unchanged",
      "VIX option prices are based on their related futures contracts and carry their own implied volatility, time and delta sensitivities; shorter-dated VIX futures move more than longer-dated ones."),
    src("Stops and stop-limits in fast markets", "FINRA · Regulatory Notice 16-19 (PDF)", "https://www.finra.org/sites/default/files/notice_other_file_ref/Regulatory-Notice-16-19.pdf",
      "A stop-limit becomes a limit order at the stop price: more price certainty, but it may not execute."),
  ],
};

export const VIX_PLAYBOOK_EXPLANATION = [
  "SAMPLE paper-trading kit built from the article “VIX Trading for Beginners” and the Cboe, SEC, FINRA, NFA, New York Fed and fund-issuer pages listed under “How well-tested is this?”. Every number is hypothetical and before costs. Not a signal.",
  "Is VIX a valid play? As a market, yes: VIX futures, options and funds are legitimate, heavily traded products. As income, be careful: the documented volatility premium is conditional and paid for with rare, very large losses. Paper-trade first or skip it; no position is a valid outcome.",
  "1. Pick one instrument and learn its contract. A standard VX future is $1,000 a point (Mini VXM: $100). Futures and index options settle against the Special Opening Quotation (VRO). VIXY follows rolled futures, not spot VIX; SVIX targets −1x and SVXY −0.5x a futures index each day. ETNs add issuer risk.",
  "2. Read the curve. Write down spot VIX and the first few monthly futures with their expiration dates. Slope = (F2 ÷ F1 − 1) × 100: positive is contango, negative is backwardation. The slope is a price comparison, not a return, and VIX3M is not a three-month future.",
  "3. Write a testable thesis. Not “fear should fall”, but which contract should fall, by when, why its price looks too high, and what ends the trade. Spot VIX can fall while your short future rises, and spot can rise while it falls. Only your contract's price and settlement count.",
  "4. Size in dollars before entry. Translate the loss you are willing to study into the product: a 10-point move against one short VX is $10,000. Margin is not the maximum loss. If the smallest unit doesn't fit the budget, the trade doesn't fit. Stops can gap; stop-limits can stay unfilled.",
  "5. Price the edge before you claim one. Expected P/L of a short future = $1,000 × contracts × (entry − expected settlement) − costs. Short at 20 with 90% at 16 and 10% at 36: +$2,000; make the spike 70 and it is −$1,400. Your probabilities are assumptions: test them out of sample, with real costs and enough capital to survive.",
  "6. Judge the record, not the win rate. 19 wins of $100 and one $3,000 loss is 95% winners and −$1,100. After −80% you need +400%. Track maximum drawdown, largest loss and exposure during stress, and test calm, shock, long stress and recovery periods with real product data.",
  "Warning: short volatility can lose many times its carry in days, and the SVIX issuer warns you could lose your whole investment in one day. Adding short volatility to a stock-heavy account increases your dependence on calm markets. Not investment advice.",
].join("\n\n");
