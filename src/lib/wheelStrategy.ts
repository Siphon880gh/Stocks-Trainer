/**
 * The wheel strategy: sell a cash-secured put, take assignment if the stock falls below the strike, sell covered calls
 * on the shares, and start again with puts once the shares are called away.
 *
 * Inspired by Weng's notes "Token Drain - Stocks - Wheel Strategy" (general market opinions plus 23 screenshots of the
 * commercial wheelstrategyoptions.com screeners and Trade Tracker, all SAMPLE / demo data). The app teaches the mechanics
 * those screens display (breakeven, adjusted basis, delta at open, DTE, annualized yield) and does not endorse the tool.
 * The verdict and caveats come from public sources: OIC, Schwab, Fidelity, FINRA, the IRS and Cboe's PUT / BXM benchmark
 * research (Wilshire, 1986–2018). Strike, delta and DTE ranges are common practice, not rules.
 *
 * Feeds /practice/wheel-strategy, the Learn group `wheel-strategy` (WHEEL- questions), WHEEL_CASES (pack
 * `options-context`, mode `wheel_cycle`), the coach session `wheel-strategy`, the glossary and the Playbook kit
 * `wheel-csp-to-covered-call`. Type-only imports, so there is no cycle. Checked by wheelStrategy.test.ts. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { OHLC } from "./ohlcData";
import type { LiteracyTerm } from "./literacyTerms";
import type { CaseStudy } from "./caseStudies";
import type { PlaybookCredibility } from "./playbooks";

export const WHEEL_DISCLAIMER =
  "SAMPLE hypothetical numbers for learning, not trading advice. Selling options needs your broker's options approval, and a cash-secured put carries nearly the same downside as owning the stock.";

/** Optional video for the Playbook (oEmbed checked 2026-10-30: title, author_name and author_url). 55 seconds. */
export const WHEEL_VIDEO = {
  title: "What Is The Wheel Strategy?",
  creator: "tastylive",
  watchUrl: "https://www.youtube.com/watch?v=WwTBFM1hEjI",
  embedUrl: "https://www.youtube-nocookie.com/embed/WwTBFM1hEjI",
  channelUrl: "https://www.youtube.com/@tastyliveshow",
} as const;

const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
export const usd = (v: number) => `${v < 0 ? "−" : ""}$${Math.abs(v).toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
const pct = (v: number, d = 1) => `${v.toFixed(d)}%`;
const SHARES = 100;

// ---------------------------------------------------------------- pure helpers

/** Cash-secured put breakeven at expiration, per share: strike − premium. */
export const cspBreakeven = (strike: number, premium: number) => r2(strike - premium);

/** Cash set aside for a cash-secured put: strike × 100 × contracts. */
export const cspCollateral = (strike: number, contracts = 1) => r2(strike * SHARES * contracts);

/** Premium as a % of the cash at risk (the strike for a put, or the share price / basis for a call). */
export const premiumYieldPct = (premium: number, capitalPerShare: number) => r2((premium / capitalPerShare) * 100);

/**
 * Simple annualized premium yield in %: (premium ÷ capital) × 365 ÷ days. Assumes you could repeat the same trade
 * back to back all year with no losses, which is why short trades show huge numbers. `compound` uses (1 + p)^(365/d) − 1.
 */
export function annualizedPremiumYield(premium: number, capitalPerShare: number, days: number, compound = false): number {
  const p = premium / capitalPerShare;
  return r2((compound ? Math.pow(1 + p, 365 / days) - 1 : p * (365 / days)) * 100);
}

/** Per-share cost basis after assignment at `strike`, reduced by every premium collected on this wheel (puts and calls). */
export const effectiveCostBasis = (strike: number, premiums: number[]) => r2(strike - premiums.reduce((a, p) => a + p, 0));

/** Covered call breakeven at expiration, per share: cost per share − call premium. */
export const coveredCallBreakeven = (costPerShare: number, callPremium: number) => r2(costPerShare - callPremium);

/** Covered call maximum profit per contract if called away: (strike − cost per share + call premium) × 100. */
export const coveredCallMaxProfit = (costPerShare: number, callStrike: number, callPremium: number, contracts = 1) =>
  r2((callStrike - costPerShare + callPremium) * SHARES * contracts);

/** Upside given up when called away: (price − call strike) × 100 if the stock finishes above the strike, else 0. */
export const calledAwayForgone = (callStrike: number, price: number, contracts = 1) => r2(Math.max(0, price - callStrike) * SHARES * contracts);

/** Unrealized P/L per contract on assigned shares against the premium-adjusted basis. */
export const assignedPnl = (basis: number, price: number, contracts = 1) => r2((price - basis) * SHARES * contracts);

export interface WheelCycleResult {
  basis: number;
  profitPerShare: number;
  profit: number;
  returnPct: number;
  annualizedPct: number;
}

/**
 * One full turn: put assigned at `putStrike`, `premiums` collected along the way (puts and calls, plus any dividends you
 * want to count), shares sold at `exitPrice` (the call strike if called away) after `days`. Return is on the put's collateral.
 */
export function wheelCycleReturn(o: { putStrike: number; premiums: number[]; exitPrice: number; days: number; contracts?: number }): WheelCycleResult {
  const n = o.contracts ?? 1;
  const basis = effectiveCostBasis(o.putStrike, o.premiums);
  const profitPerShare = r2(o.exitPrice - basis);
  const profit = r2(profitPerShare * SHARES * n);
  const returnPct = r2((profit / cspCollateral(o.putStrike, n)) * 100);
  return { basis, profitPerShare, profit, returnPct, annualizedPct: r2(returnPct * (365 / o.days)) };
}

/** Delta read as a rough chance of finishing in the money (a common shortcut, not a probability model): |delta| × 100. */
export const deltaRoughItmPct = (delta: number) => Math.round(Math.abs(delta) * 100);

// ---------------------------------------------------------------- the cycle

export interface WheelStep {
  id: "csp" | "assigned" | "cc" | "called";
  title: string;
  text: string;
  ifNot: string;
}

export const WHEEL_CYCLE: WheelStep[] = [
  {
    id: "csp",
    title: "1 · Sell a cash-secured put",
    text: "On a stock you would be happy to own, sell an out-of-the-money put and set aside strike × 100 in cash. You keep the premium whatever happens.",
    ifNot: "Expires above the strike: keep the premium and sell another put.",
  },
  {
    id: "assigned",
    title: "2 · Assigned: you buy 100 shares at the strike",
    text: "If the stock is below the strike at expiration (or earlier: American-style options can be assigned any day), you buy 100 shares per contract at the strike. Your basis is strike − premium.",
    ifNot: "Not assigned: back to step 1.",
  },
  {
    id: "cc",
    title: "3 · Sell a covered call on the shares",
    text: "Sell an out-of-the-money call, usually at or above your basis. More premium lowers the basis again; the strike caps what you can make while the call is open.",
    ifNot: "Expires below the strike: keep the premium and sell another call.",
  },
  {
    id: "called",
    title: "4 · Called away: you sell the shares at the strike",
    text: "If the stock finishes above the call strike, your shares are sold at the strike. You keep both premiums and any gain up to the strike, then go back to step 1 with the cash.",
    ifNot: "Not called away: back to step 3.",
  },
];

// ---------------------------------------------------------------- worked example (SAMPLE, hypothetical stock XYZ)

export const WHEEL_EXAMPLE = {
  price: 52,
  putStrike: 50,
  putPremium: 1.2,
  putDelta: -0.25,
  putDays: 30,
  assignedAt: 49,
  callStrike: 53,
  callPremium: 0.9,
  callDays: 30,
  rally: 62,
  crash: 35,
  crashCallStrike: 40,
  crashCallPremium: 0.25,
} as const;

const EX = WHEEL_EXAMPLE;
export const EX_BREAKEVEN = cspBreakeven(EX.putStrike, EX.putPremium);
export const EX_COLLATERAL = cspCollateral(EX.putStrike);
export const EX_PUT_YIELD = premiumYieldPct(EX.putPremium, EX.putStrike);
export const EX_PUT_ANNUAL = annualizedPremiumYield(EX.putPremium, EX.putStrike, EX.putDays);
export const EX_PUT_ANNUAL_COMPOUND = annualizedPremiumYield(EX.putPremium, EX.putStrike, EX.putDays, true);
export const EX_BASIS_AFTER_CALL = effectiveCostBasis(EX.putStrike, [EX.putPremium, EX.callPremium]);
export const EX_CC_MAX = coveredCallMaxProfit(EX_BREAKEVEN, EX.callStrike, EX.callPremium);
export const EX_CYCLE = wheelCycleReturn({ putStrike: EX.putStrike, premiums: [EX.putPremium, EX.callPremium], exitPrice: EX.callStrike, days: EX.putDays + EX.callDays });
export const EX_RALLY_FORGONE = calledAwayForgone(EX.callStrike, EX.rally);
export const EX_RALLY_BUY_HOLD = r2((EX.rally - EX.price) * SHARES);
export const EX_CRASH_WHEEL = assignedPnl(EX_BREAKEVEN, EX.crash);
export const EX_CRASH_BUY_HOLD = r2((EX.crash - EX.price) * SHARES);
export const EX_CRASH_BASIS = effectiveCostBasis(EX.putStrike, [EX.putPremium, EX.crashCallPremium]);
export const EX_CRASH_LOCKED = assignedPnl(EX_CRASH_BASIS, EX.crashCallStrike);

export interface WheelScenario {
  id: "flat" | "rally" | "crash";
  title: string;
  wheel: number;
  stock: number;
  note: string;
}

/** Same stock, three paths over the two months: the wheel vs simply buying 100 shares at 52. */
export const WHEEL_SCENARIOS: WheelScenario[] = [
  {
    id: "flat",
    title: `Drifts down to ${EX.assignedAt}, then back to ${EX.callStrike} (the ideal path)`,
    wheel: EX_CYCLE.profit,
    stock: r2((EX.callStrike - EX.price) * SHARES),
    note: `Assigned at ${EX.putStrike}, called away at ${EX.callStrike}: ${usd(EX_CYCLE.profit)} on ${usd(EX_COLLATERAL)}. Owning the shares from ${EX.price} made ${usd((EX.callStrike - EX.price) * SHARES)}.`,
  },
  {
    id: "rally",
    title: `Dips to ${EX.assignedAt}, then rips to ${EX.rally}`,
    wheel: EX_CYCLE.profit,
    stock: EX_RALLY_BUY_HOLD,
    note: `Called away at ${EX.callStrike}, so the wheel still makes ${usd(EX_CYCLE.profit)}, but ${usd(EX_RALLY_FORGONE)} above the strike went to the call buyer. That is the capped upside.`,
  },
  {
    id: "crash",
    title: `Assigned, then falls to ${EX.crash}`,
    wheel: EX_CRASH_WHEEL,
    stock: EX_CRASH_BUY_HOLD,
    note: `Basis ${EX_BREAKEVEN} vs price ${EX.crash}: ${usd(EX_CRASH_WHEEL)} unrealized. Less bad than buying at ${EX.price}, but the premium covers only ${usd(EX.putPremium * SHARES)} of the fall. A ${EX.crashCallStrike} call pays ${EX.crashCallPremium}; if it is called away you lock in ${usd(EX_CRASH_LOCKED)}.`,
  },
];

// ---------------------------------------------------------------- common practice (not rules)

export interface WheelPractice {
  id: string;
  choice: string;
  common: string;
  tradeoff: string;
}

export const WHEEL_PRACTICE: WheelPractice[] = [
  {
    id: "stock",
    choice: "Which stock",
    common: "One you would hold through a long drawdown: sound business, liquid options, a price you can secure with cash.",
    tradeoff: "The highest premiums sit on the most volatile names. Screeners ranked by yield put leveraged ETFs and high-IV stocks on top (the notes' screenshots show SOXL, SOXS, IREN and CRWV) because the risk is high, not because the trade is good.",
  },
  {
    id: "delta",
    choice: "Strike (delta)",
    common: "Out of the money, often around 0.15–0.30 delta for both the put and the call. The notes' sample trades opened at about 0.13–0.24.",
    tradeoff: "Higher delta: more premium and more assignments. Lower delta: less premium, fewer assignments. Delta is only a rough chance of finishing in the money.",
  },
  {
    id: "dte",
    choice: "Days to expiration (DTE)",
    common: "Monthly options about 30–45 days out are the usual textbook choice; some sell weeklies (7–14 days) for faster decay; Schwab describes expirations of six months or less.",
    tradeoff: "Shorter: faster time decay but more gamma (sharper swings near the strike), more trades and fees, and less time to react to news.",
  },
  {
    id: "events",
    choice: "Earnings and dividends",
    common: "Many sellers avoid expirations that span an earnings report (the notes' screeners had an \"Exclude near earnings\" filter) and watch ex-dividend dates on short calls.",
    tradeoff: "Premium is richest before earnings because the gap risk is real. In-the-money short calls are more likely to be assigned early just before an ex-dividend date.",
  },
  {
    id: "manage",
    choice: "Managing the trade",
    common: "Some close at a set share of the premium (the tool's default was 50% captured) or roll out in time; others hold to expiration.",
    tradeoff: "Rolling turns a decision into a new trade: only roll for a net credit into a position you would open fresh today.",
  },
  {
    id: "capital",
    choice: "Capital",
    common: `One contract on a $50 stock ties up ${usd(cspCollateral(50))}; on a $335 stock, ${usd(cspCollateral(335))}. Margin accounts can sell puts on less, but then it is no longer cash-secured.`,
    tradeoff: "One or two names can be the whole account, which is concentration risk. Cash earning interest elsewhere is the opportunity cost.",
  },
];

// ---------------------------------------------------------------- evidence: Cboe benchmark indexes (Wilshire, June 1986 – Dec 2018)

export interface BenchmarkRow {
  id: "spx" | "put" | "bxm";
  label: string;
  annualReturn: number;
  vol: number;
  maxDd: number;
  sharpe: number;
  y2008: number;
  /** A strong bull year (S&P 500 +32.4%), to show the capped upside. */
  y2013: number;
}

/** Exhibit 8 and the calendar-year table of Wilshire's 2019 study prepared for Cboe. Past index results, no costs or taxes. */
export const WHEEL_BENCHMARKS: BenchmarkRow[] = [
  { id: "spx", label: "S&P 500 (total return)", annualReturn: 9.8, vol: 14.9, maxDd: -50.9, sharpe: 0.45, y2008: -37.0, y2013: 32.4 },
  { id: "put", label: "Cboe PutWrite Index (PUT): cash-secured at-the-money SPX puts, monthly", annualReturn: 9.54, vol: 9.9, maxDd: -35.5, sharpe: 0.64, y2008: -26.8, y2013: 12.3 },
  { id: "bxm", label: "Cboe BuyWrite Index (BXM): S&P 500 plus at-the-money calls, monthly", annualReturn: 8.5, vol: 10.6, maxDd: -35.8, sharpe: 0.51, y2008: -28.7, y2013: 13.3 },
];

export const WHEEL_BENCHMARK_NOTES: string[] = [
  "Over 32½ years, put-writing earned about the index's return with about two-thirds of its volatility, and covered calls a bit less return with similar lower volatility.",
  "It still fell hard: worst drawdowns of about 36%, and about −27% in 2008. Returns are negatively skewed: many small gains, occasional large losses.",
  "It lagged in the long 2010–2018 bull market, when capped upside cost more than the premium paid: in 2013 the S&P 500 returned 32.4%, PUT 12.3% and BXM 13.3%.",
  "These are diversified S&P 500 index options, at the money, rolled monthly, with no costs or taxes, in a study prepared for Cboe. A wheel on one or two single stocks has no comparable long-run evidence and adds company risk.",
];

// ---------------------------------------------------------------- what Weng's notes and screenshots taught

export interface ScreenshotLesson {
  id: string;
  seen: string;
  lesson: string;
}

export const WHEEL_SCREENSHOT_LESSONS: ScreenshotLesson[] = [
  {
    id: "screener",
    seen: "Covered call and cash-secured put screeners with filters for strike, delta, DTE (7–30 days), annualized yield over 2%, volume over 200 and \"Exclude near earnings\".",
    lesson: "These are the levers: which stock, how far out of the money (delta or cushion), how long (DTE), liquidity, and events. Top results by yield were leveraged ETFs and high-IV names: a high premium is a price for high risk.",
  },
  {
    id: "breakeven",
    seen: "Closed-trade history: a $335 UNH put sold for $13.00 shows a $322.00 breakeven; a $65 NKE call for $1.00 shows $66.00.",
    lesson: `For a cash-secured put, breakeven = strike − premium (${cspBreakeven(335, 13)}). The call column is strike + premium, the call buyer's breakeven. Your covered-call breakeven is your share cost − the premium.`,
  },
  {
    id: "aroi",
    seen: "An AROI column: 80.2% on a 7-day $65 call sold for $1.00, 157.5% on a 15-day put.",
    lesson: `That matches simple annualizing: 1.00 ÷ 65 × 365 ÷ 7 = ${pct(annualizedPremiumYield(1, 65, 7))}. It assumes you repeat the trade all year with no losses. Compare trades on premium ÷ collateral per day, not on the annualized headline.`,
  },
  {
    id: "basis",
    seen: "Adjusted stock basis: shares assigned at $335 shown at a lower basis after premiums; \"Adjusted basis uses premiums only.\"",
    lesson: "Premiums lower your basis per share (the IRS treats an assigned put's premium the same way: it reduces the basis of the stock you buy). A lower basis is not a profit until you sell.",
  },
  {
    id: "underwater",
    seen: "Equity holdings in the demo portfolio: UNH assigned at a $329 average cost now at $311.89, −$1,711; ARM and CMG also below cost.",
    lesson: `The bag-holding case: ${usd(assignedPnl(329, 311.89))} on 100 shares against ${usd(600)} of put premium. The premium cushions the fall; it does not prevent it.`,
  },
  {
    id: "stats",
    seen: "Performance stats: average delta at open 0.16, average DTE at entry 17 days, assignment and call-away rates, average capital deployed about $19,900.",
    lesson: "Track your own numbers the same way: delta and DTE at entry, how often you are assigned, capital tied up, and realized P/L after fees, not just premium collected.",
  },
  {
    id: "promo",
    seen: "Upsells everywhere: \"30% off Pro & Ultra\", sign-up walls on results, flow and heatmaps, a paid Maxx tier, and a founder-written \"use cases\" article.",
    lesson: "It is a commercial tool and its trades are sample data. Order flow, GEX and AI picks are extras, not part of the wheel. Nothing here is a track record.",
  },
];

// ---------------------------------------------------------------- verdict and caveats

export const WHEEL_VERDICT = {
  title: "Is the wheel a valid strategy?",
  answer: "Yes, as a mainstream, conservative-tier options strategy. Not as free income.",
  points: [
    "Both legs are standard, exchange-listed strategies that the Options Industry Council and the big brokers teach: the cash-secured put and the covered call.",
    "Decades of Cboe benchmark data show systematic put-writing and covered calls on the S&P 500 earned close to the index's return with lower volatility, while trailing in strong bull markets and still falling hard in crashes.",
    "The risk is the stock: a cash-secured put has nearly the same downside as owning the shares, the upside is capped by the call, and the premium is payment for that trade, not a bonus.",
    "It suits someone who wants to own the stock anyway, at a price they chose, with the cash to buy it. For a single high-premium stock, treat it as a stock purchase first and an income strategy second.",
  ],
} as const;

export interface WheelCaveat {
  id: string;
  title: string;
  text: string;
}

export const WHEEL_CAVEATS: WheelCaveat[] = [
  { id: "short-put", title: "A cash-secured put is long-stock risk", text: `Its maximum loss is the strike − premium, times 100, if the stock goes to zero (${usd(cspCollateral(50) - 120)} in the example). OIC notes its risk profile matches a covered call's.` },
  { id: "capped", title: "Capped upside", text: "Above the call strike, every dollar goes to the call buyer. In a strong rally the wheel trails simply owning the stock." },
  { id: "bag", title: "Bag-holding", text: "After assignment the stock can keep falling. Calls above your basis pay little; calls below it can lock in a loss if exercised. Decide in advance what would make you sell the shares." },
  { id: "concentration", title: "Concentration and capital", text: "Cash-secured means strike × 100 per contract set aside. On a small account that is one or two stocks, so one bad name can dominate the result." },
  { id: "assignment", title: "Assignment can come any day", text: "Equity options are American-style. Short calls are more likely to be assigned just before an ex-dividend date, and short puts after it, and you may be assigned while a stock is halted." },
  { id: "events", title: "Gaps through the strike", text: "Earnings, guidance or news can gap a stock far below a put strike overnight. The premium before earnings is high because that risk is real." },
  { id: "tax", title: "Taxes and fees", text: "An expired option's premium is a short-term capital gain; an assigned put's premium reduces the stock's basis and the holding period starts at assignment; an assigned call's premium is added to the sale. Commissions and assignment fees cut thin premiums." },
  { id: "approval", title: "Options approval and the disclosure document", text: "Brokers must approve your account for options and give you OCC's Characteristics and Risks of Standardized Options. Cash-secured puts and covered calls are usually in the lowest selling tiers." },
];

// ---------------------------------------------------------------- drills

export interface WheelDrill {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  why: string;
}

export const WHEEL_DRILLS: WheelDrill[] = [
  {
    id: "breakeven",
    prompt: `XYZ is at ${EX.price}. You sell the ${EX.putStrike} put for ${EX.putPremium.toFixed(2)}. What is your breakeven at expiration?`,
    options: [String(EX_BREAKEVEN), String(EX.putStrike), String(r2(EX.putStrike + EX.putPremium)), String(EX.price)],
    answer: 0,
    why: `Strike − premium: ${EX.putStrike} − ${EX.putPremium.toFixed(2)} = ${EX_BREAKEVEN}. Below that, assignment loses money at expiration.`,
  },
  {
    id: "collateral",
    prompt: `How much cash secures one ${EX.putStrike} put?`,
    options: [usd(EX.putPremium * SHARES), usd(EX_COLLATERAL), usd(EX.price * SHARES), usd(EX_BREAKEVEN * SHARES)],
    answer: 1,
    why: `Strike × 100 = ${usd(EX_COLLATERAL)}. You keep the ${usd(EX.putPremium * SHARES)} premium, but the cash is the real commitment.`,
  },
  {
    id: "annualized",
    prompt: `The ${EX.putPremium.toFixed(2)} premium on the ${EX.putStrike} put has ${EX.putDays} days to expiration. What is the simple annualized yield on the collateral?`,
    options: [pct(EX_PUT_YIELD), pct(EX_PUT_ANNUAL), pct(r1(EX_PUT_YIELD * 52)), pct(EX_PUT_YIELD * 4)],
    answer: 1,
    why: `${pct(EX_PUT_YIELD)} for ${EX.putDays} days × 365 ÷ ${EX.putDays} = ${pct(EX_PUT_ANNUAL)}. It assumes you repeat it all year with no losing month, which is the part that rarely happens.`,
  },
  {
    id: "basis",
    prompt: `Assigned at ${EX.putStrike}, you sell the ${EX.callStrike} call for ${EX.callPremium.toFixed(2)}. What is your premium-adjusted basis per share?`,
    options: [String(EX.putStrike), String(EX_BREAKEVEN), String(EX_BASIS_AFTER_CALL), String(r2(EX.callStrike - EX.callPremium))],
    answer: 2,
    why: `${EX.putStrike} − ${EX.putPremium.toFixed(2)} − ${EX.callPremium.toFixed(2)} = ${EX_BASIS_AFTER_CALL}. Each premium lowers it; it is still only a basis until you sell.`,
  },
  {
    id: "max",
    prompt: `If the ${EX.callStrike} call is exercised, what is the whole wheel's profit on one contract?`,
    options: [usd(EX.callPremium * SHARES), usd((EX.callStrike - EX.putStrike) * SHARES), usd(EX_CYCLE.profit), "Unlimited"],
    answer: 2,
    why: `(${EX.callStrike} − ${EX.putStrike} + ${EX.putPremium.toFixed(2)} + ${EX.callPremium.toFixed(2)}) × 100 = ${usd(EX_CYCLE.profit)}, ${pct(EX_CYCLE.returnPct)} of the ${usd(EX_COLLATERAL)} collateral. That is the most it can make, however high the stock goes.`,
  },
  {
    id: "rally",
    prompt: `The stock finishes at ${EX.rally} and your shares are called away at ${EX.callStrike}. How much upside went to the call buyer?`,
    options: [usd(0), usd(EX.callPremium * SHARES), usd(EX_RALLY_FORGONE), usd(EX_RALLY_BUY_HOLD)],
    answer: 2,
    why: `(${EX.rally} − ${EX.callStrike}) × 100 = ${usd(EX_RALLY_FORGONE)}. You were paid ${usd(EX.callPremium * SHARES)} for it.`,
  },
  {
    id: "crash",
    prompt: `Assigned at ${EX.putStrike} (basis ${EX_BREAKEVEN}), the stock falls to ${EX.crash}. What is the unrealized P/L?`,
    options: [usd(EX_CRASH_WHEEL), usd(EX.putPremium * SHARES), usd(EX_CRASH_BUY_HOLD), usd(0)],
    answer: 0,
    why: `(${EX.crash} − ${EX_BREAKEVEN}) × 100 = ${usd(EX_CRASH_WHEEL)}. Buying at ${EX.price} would show ${usd(EX_CRASH_BUY_HOLD)}: the wheel is less bad, not safe.`,
  },
  {
    id: "delta",
    prompt: "A put shows a delta of −0.20. What is a common rough reading?",
    options: ["A 20% chance the stock falls 20%", "About a 20% chance of finishing in the money", "It will lose $0.20 a day", "An 80% chance of assignment"],
    answer: 1,
    why: `|delta| × 100 ≈ ${deltaRoughItmPct(-0.2)}% chance of finishing in the money. OIC calls this a view some traders take; delta changes every day.`,
  },
];

// ---------------------------------------------------------------- glossary

export const WHEEL_TERMS: LiteracyTerm[] = [
  {
    id: "wheel-strategy",
    name: "Wheel strategy",
    category: "process",
    summary: "Sell cash-secured puts until assigned, then covered calls until called away, then repeat.",
    detail:
      "Both legs collect premium; the cash-secured put buys the stock at strike − premium if it falls, and the covered call sells it at the strike if it rises. It is mildly bullish, caps upside and keeps nearly all of the stock's downside. Educational, not advice.",
  },
  {
    id: "called-away",
    name: "Called away",
    category: "position",
    summary: "Your shares are sold at the call strike because the covered call you wrote was exercised.",
    detail: "It usually happens when the stock is above the strike at expiration, sometimes earlier (for example just before an ex-dividend date). You keep the premium, and gains above the strike go to the call buyer. Educational, not advice.",
  },
  {
    id: "option-delta",
    name: "Delta (options)",
    category: "markets",
    summary: "How much an option's price is expected to move for a $1 move in the stock; often read as a rough chance of finishing in the money.",
    detail: "Calls run 0 to 1, puts 0 to −1. A 0.25-delta option moves about $0.25 per $1 and is often read as about a 25% chance of expiring in the money. OIC presents that as a view some traders take; delta changes with price, time and volatility. Educational, not advice.",
  },
  {
    id: "days-to-expiration",
    name: "DTE (days to expiration)",
    category: "markets",
    summary: "Calendar days left until an option expires.",
    detail: "Time value decays faster as expiration nears, so short-DTE sellers collect premium faster but face sharper price swings near the strike (gamma) and less time to react. Wheel sellers often use about 30–45 days; some use weeklies. Educational, not advice.",
  },
  {
    id: "annualized-premium-yield",
    name: "Annualized premium yield",
    category: "process",
    summary: "Premium ÷ capital at risk, scaled to a year: (premium ÷ strike) × 365 ÷ days.",
    detail: "A $1.00 premium on a $65 strike for 7 days is 1.5% for the week and about 80% annualized. The annual figure assumes you repeat the same trade all year with no losses, so it flatters short trades. Educational, not advice.",
  },
  {
    id: "adjusted-cost-basis",
    name: "Premium-adjusted cost basis",
    category: "position",
    summary: "Your share cost after subtracting the option premiums collected on them.",
    detail: "Assigned at 50 after a 1.20 put premium and a 0.90 call premium: 47.90 a share. The IRS also reduces an assigned stock's basis by the put premium. A lower basis is not a profit until you sell. Educational, not advice.",
  },
  {
    id: "roll-option",
    name: "Rolling an option",
    category: "process",
    summary: "Closing an open option and opening a similar one with a later expiration, a different strike, or both.",
    detail: "Wheel sellers roll a threatened short put or call out in time, ideally for a net credit, to delay or avoid assignment. A roll is a new trade: only do it if you would open that position today. Educational, not advice.",
  },
  {
    id: "early-assignment",
    name: "Early assignment",
    category: "markets",
    summary: "Being assigned on a short American-style option before its expiration date.",
    detail: "It can happen on any trading day. OIC notes the risk rises as an option goes deeper in the money and nears expiration, just before an ex-dividend date for short calls and just after it for short puts. Educational, not advice.",
  },
  {
    id: "implied-volatility",
    name: "Implied volatility (IV)",
    category: "markets",
    summary: "The volatility the option's price implies for the stock, as an annualized percentage.",
    detail: "Higher IV means richer premiums for sellers, because the market expects bigger moves. IV usually rises before earnings and falls right after. Educational, not advice.",
  },
  {
    id: "iv-rank",
    name: "IV rank",
    category: "markets",
    summary: "Where today's implied volatility sits within its own 52-week range, from 0 to 100.",
    detail: "An IV rank of 80 means IV is near the top of its past-year range. Option sellers often prefer high IV rank, but high IV often comes with news or a falling stock. Educational, not advice.",
  },
  {
    id: "put-write-index",
    name: "Cboe PutWrite Index (PUT)",
    category: "markets",
    summary: "A benchmark that sells one-month at-the-money S&P 500 puts each month, fully secured by Treasury bills.",
    detail: "Wilshire's study for Cboe (1986–2018) found it earned 9.5% a year vs 9.8% for the S&P 500 with 9.9% vs 14.9% volatility, a −35.5% worst drawdown vs −50.9%, and weaker results in the 2010–2018 bull market. Past index results, no costs. Educational, not advice.",
  },
  {
    id: "buy-write-index",
    name: "Cboe BuyWrite Index (BXM)",
    category: "markets",
    summary: "A benchmark that owns the S&P 500 and sells a one-month at-the-money call against it each month.",
    detail: "The first major option strategy benchmark. Over 1986–2018 it returned 8.5% a year with 10.6% volatility, below the index's return but with much smaller swings, because the call caps the upside. Educational, not advice.",
  },
  {
    id: "options-approval-level",
    name: "Options approval level",
    category: "process",
    summary: "The tier of options strategies your broker has approved your account to trade.",
    detail: "FINRA notes brokers must approve an account before options trading, because some strategies carry substantial risk. Covered calls and cash-secured puts are usually in the lowest selling tiers; uncovered (naked) selling needs higher approval and margin. Educational, not advice.",
  },
];

// ---------------------------------------------------------------- cases (pack options-context, mode wheel_cycle)

const bar = (name: string, open: number, high: number, low: number, close: number): OHLC => ({ name, open, high, low, close });
const days = (data: Array<[number, number, number, number]>, post = false): OHLC[] =>
  data.map(([o, h, l, c], i) => bar(post ? `+${i + 1}` : `D${i - data.length + 1 === 0 ? "0" : i - data.length + 1}`, o, h, l, c));

const RIP_PRE = days([
  [50.1, 50.9, 49.6, 50.6], [50.6, 51.2, 50.2, 50.9], [50.9, 51.8, 50.7, 51.6], [51.6, 52.1, 51.0, 51.3],
  [51.3, 52.4, 51.1, 52.2], [52.2, 52.8, 51.9, 52.6], [52.6, 53.4, 52.3, 53.1], [53.1, 53.6, 52.5, 52.9],
  [52.9, 54.2, 52.8, 54.0], [54.0, 55.1, 53.7, 54.8], [59.5, 61.8, 59.0, 61.2], [61.2, 61.9, 60.4, 61.0],
]);
const RIP_POST = days([[61.0, 62.4, 60.8, 62.1], [62.1, 63.5, 61.7, 63.2], [63.2, 63.6, 62.2, 62.8]], true);

const CRASH_PRE = days([
  [51.8, 52.3, 51.2, 51.5], [51.5, 51.9, 50.6, 50.8], [50.8, 51.4, 50.1, 50.3], [50.3, 50.7, 49.2, 49.5],
  [49.5, 50.2, 49.0, 49.8], [49.8, 50.0, 48.7, 48.9], [48.9, 49.6, 48.5, 49.3], [49.3, 49.5, 48.2, 48.6],
  [48.6, 49.0, 47.9, 48.4], [48.4, 48.8, 47.6, 47.9], [40.5, 41.2, 37.6, 38.2], [38.2, 39.0, 37.4, 38.0],
]);
const CRASH_POST = days([[38.0, 38.3, 36.1, 36.4], [36.4, 37.0, 34.8, 35.1], [35.1, 35.6, 33.9, 34.2], [34.2, 34.5, 32.6, 33.0]], true);

const FLAT_PRE = days([
  [50.4, 51.1, 49.8, 50.9], [50.9, 51.6, 50.5, 51.2], [51.2, 51.5, 50.3, 50.6], [50.6, 51.0, 49.7, 49.9],
  [49.9, 50.4, 49.3, 50.2], [50.2, 51.3, 50.0, 51.1], [51.1, 51.9, 50.8, 51.6], [51.6, 52.0, 50.9, 51.0],
  [51.0, 51.2, 50.1, 50.4], [50.4, 50.9, 49.6, 50.7], [50.7, 51.5, 50.4, 51.3], [51.3, 51.6, 50.6, 50.9],
]);
const FLAT_POST = days([[50.9, 51.7, 50.5, 51.4], [51.4, 51.8, 50.7, 51.0], [51.0, 51.9, 50.8, 51.6], [51.6, 52.2, 51.1, 51.8]], true);

const EARN_PRE = days([
  [52.8, 53.4, 52.2, 53.1], [53.1, 53.9, 52.7, 53.6], [53.6, 54.0, 52.9, 53.2], [53.2, 53.5, 52.4, 52.7],
  [52.7, 53.3, 52.1, 53.0], [53.0, 53.8, 52.8, 53.5], [53.5, 53.7, 52.6, 52.9], [52.9, 53.2, 51.9, 52.2],
  [52.2, 52.6, 51.4, 51.7], [51.7, 52.4, 51.3, 52.1], [52.1, 52.3, 51.2, 51.6], [51.6, 51.9, 51.1, 51.5],
]);
const EARN_POST = days([[42.2, 43.0, 40.6, 41.0], [41.0, 41.9, 40.2, 41.4], [41.4, 42.1, 40.8, 41.7]], true);

/** Numbers the case briefs quote; wheelStrategy.test.ts checks them against the bars and the helpers. */
export const WHEEL_CASE_FACTS = {
  rip: { assigned: 50, basis: 48.8, callStrike: 53, callPremium: 0.9, decision: 61.0, end: 62.8 },
  crash: { assigned: 50, basis: 48.8, decision: 38.0, end: 33.0, aboveBasisCall: 0.05, lowCallStrike: 40, lowCallPremium: 1.1 },
  flat: { putStrike: 48, putPremium: 1.0, decision: 50.9, end: 51.8 },
  earnings: { putStrike: 50, putPremium: 0.8, putNow: 1.4, decision: 51.5, gapOpen: 42.2, end: 41.7 },
} as const;
const F = WHEEL_CASE_FACTS;

const caseBase = {
  contextType: "news" as const,
  thinkingMode: "wheel_cycle" as const,
  packId: "options-context" as const,
  assetClass: "option_context" as const,
  allowShort: false,
};

export const WHEEL_CASES: CaseStudy[] = [
  {
    ...caseBase,
    id: "case-wheel-flat-keep-wheeling",
    title: "Wheel: the put expired in a sideways month",
    difficulty: "beginner",
    brief: `SAMPLE hypothetical stock. It drifted between about 49.50 and 52 for a month and your ${F.flat.putStrike} cash-secured put expired worthless: you kept $${(F.flat.putPremium * 100).toFixed(0)}. Your view of the company is unchanged, earnings are seven weeks away and implied volatility is normal. Buy = sell the next out-of-the-money cash-secured put (keep the wheel turning). Hold = stay in cash this month. Sell = sell an in-the-money put for the biggest premium.`,
    newsHeadline: "Quiet month: no news, the stock chops in a range.",
    preOhlc: FLAT_PRE,
    postOhlc: [...FLAT_PRE, ...FLAT_POST],
    correctActions: ["buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "This is the setting the wheel is built for: a stock you still want, no event inside the expiration, normal premiums. Selling the next out-of-the-money put repeats a plan you already sized. Staying in cash is fine too. An in-the-money put pays more only because it is likely to be assigned above today's price.",
      whyMarketMoved: "Nothing changed, so the range held.",
      evidence: `SAMPLE: ${F.flat.decision} at the decision, ${F.flat.end} four sessions later. A ${F.flat.putStrike} put would still be out of the money.`,
    },
  },
  {
    ...caseBase,
    id: "case-wheel-rip-past-call-strike",
    title: "Wheel: the stock rips past your covered call strike",
    difficulty: "beginner",
    brief: `SAMPLE hypothetical stock. You were assigned at ${F.rip.assigned} (basis ${F.rip.basis}) and sold the ${F.rip.callStrike} call for ${F.rip.callPremium.toFixed(2)}, expiring in five days. A buyout rumor gapped the stock to ${F.rip.decision.toFixed(2)}. Buy = buy the call back for about 8.00 to keep the shares. Sell = sell your shares now (the call would be left uncovered). Hold = let the shares be called away at ${F.rip.callStrike}.`,
    newsHeadline: "Report: rival weighs a bid; the stock jumps 10%.",
    preOhlc: RIP_PRE,
    postOhlc: [...RIP_PRE, ...RIP_POST],
    correctActions: ["hold"],
    acceptablePartial: ["buy"],
    debrief: {
      process: `Being called away is the plan working: ${usd(coveredCallMaxProfit(F.rip.basis, F.rip.callStrike, F.rip.callPremium))} on the contract, the most this wheel could make. The upside above ${F.rip.callStrike} was sold for ${F.rip.callPremium.toFixed(2)}. Buying the call back at about 8.00 is a new bullish bet on the stock at ${F.rip.decision.toFixed(0)}; partial credit only if you would buy it there today. Selling the shares leaves a naked short call, which a cash account will not allow.`,
      whyMarketMoved: "A takeover rumor repriced the stock overnight. Capped upside is the cost of a covered call.",
      evidence: `SAMPLE: ${F.rip.decision.toFixed(2)} at the decision, ${F.rip.end.toFixed(2)} three sessions later. Forgone above the strike: ${usd(calledAwayForgone(F.rip.callStrike, F.rip.end))}.`,
    },
  },
  {
    ...caseBase,
    id: "case-wheel-crash-after-assignment",
    title: "Wheel: assigned, then guidance is cut",
    difficulty: "intermediate",
    brief: `SAMPLE hypothetical stock. You were assigned at ${F.crash.assigned} (basis ${F.crash.basis}). The company then cut its full-year guidance and the stock gapped to ${F.crash.decision.toFixed(2)}: ${usd(assignedPnl(F.crash.basis, F.crash.decision))} on 100 shares. A ${F.crash.assigned} call pays ${F.crash.aboveBasisCall.toFixed(2)}; a ${F.crash.lowCallStrike} call pays ${F.crash.lowCallPremium.toFixed(2)}. Your plan said you would only own this company while its growth story held. Buy = buy 100 more to average down. Sell = sell the shares. Hold = keep them and sell calls.`,
    newsHeadline: "Company slashes full-year outlook; shares gap down 20%.",
    preOhlc: CRASH_PRE,
    postOhlc: [...CRASH_PRE, ...CRASH_POST],
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `The reason you wanted to own it broke, and your plan said what to do then. Calls above your basis pay almost nothing (${F.crash.aboveBasisCall.toFixed(2)}), and a ${F.crash.lowCallStrike} call would lock in about ${usd(assignedPnl(effectiveCostBasis(F.crash.assigned, [1.2, F.crash.lowCallPremium]), F.crash.lowCallStrike))} if exercised. Premium cannot repair a broken thesis. Holding is partial credit only if you still want the company long term. Averaging down doubles a position that just failed its own test.`,
      whyMarketMoved: "A guidance cut reprices future earnings; the selling continued for days.",
      evidence: `SAMPLE: ${F.crash.decision.toFixed(2)} at the decision, ${F.crash.end.toFixed(2)} four sessions later, ${usd(assignedPnl(F.crash.basis, F.crash.end))} against the basis.`,
    },
  },
  {
    ...caseBase,
    id: "case-wheel-put-through-earnings",
    title: "Wheel: a short put going into earnings",
    difficulty: "intermediate",
    brief: `SAMPLE hypothetical stock at ${F.earnings.decision.toFixed(2)}. You sold the ${F.earnings.putStrike} put for ${F.earnings.putPremium.toFixed(2)} last week, not noticing the expiration spans tomorrow's earnings. The put is now ${F.earnings.putNow.toFixed(2)} because implied volatility jumped. The options market implies about a ±10% move. Buy = buy the put back to close before the report. Sell = sell a second put to collect the rich premium. Hold = keep it through the report.`,
    newsHeadline: "Earnings after the close tomorrow; options price a 10% move.",
    preOhlc: EARN_PRE,
    postOhlc: [...EARN_PRE, ...EARN_POST],
    correctActions: ["buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `Your own filter (no expirations across earnings) was missed, so the clean fix is to close for a ${usd((F.earnings.putNow - F.earnings.putPremium) * 100)} loss. Holding is partial credit only if you sized it to own the shares at ${cspBreakeven(F.earnings.putStrike, F.earnings.putPremium)} after a gap. Selling a second put doubles the event bet just because it pays more; the premium is high because the gap risk is real.`,
      whyMarketMoved: "Results missed and the stock gapped well below the strike.",
      evidence: `SAMPLE: opened ${F.earnings.gapOpen.toFixed(2)} after the report and ended at ${F.earnings.end.toFixed(2)}. Held and assigned at ${F.earnings.putStrike}: ${usd(assignedPnl(cspBreakeven(F.earnings.putStrike, F.earnings.putPremium), F.earnings.end))}.`,
    },
  },
];

// ---------------------------------------------------------------- Learn questions (WHEEL-)

const IDS = ["A", "B", "C", "D"] as const;
type OptId = (typeof IDS)[number];
function mc(id: string, prompt: string, at: OptId, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(IDS.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: IDS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export const WHEEL_QUESTIONS: QuizQuestion[] = [
  mc("WHEEL-01", "What is the order of the wheel?", "B", "Sell a cash-secured put → assigned shares → sell covered calls → called away → sell puts again",
    ["Buy a call → buy a put → sell both", "Sell covered calls first, then buy the shares", "Buy shares, buy a protective put, then sell the shares"],
    "The put leg buys the stock if it falls below the strike; the call leg sells it if it rises above the call strike.", "wheel-strategy"),
  mc("WHEEL-02", `You sell a ${EX.putStrike} put for ${EX.putPremium.toFixed(2)}. What is the breakeven at expiration?`, "A", String(EX_BREAKEVEN),
    [String(r2(EX.putStrike + EX.putPremium)), String(EX.putStrike), String(EX.price)],
    "Strike − premium. Below it, being assigned loses money at expiration.", "options-breakeven"),
  mc("WHEEL-03", `How much cash secures one ${EX.putStrike} put?`, "D", usd(EX_COLLATERAL),
    [usd(EX.putPremium * SHARES), usd(EX_BREAKEVEN), usd(EX.putStrike)],
    "Strike × 100 shares per contract. That cash commitment is why the wheel is capital heavy.", "cash-secured-put"),
  mc("WHEEL-04", "What is the maximum loss on a cash-secured put?", "C", "(Strike − premium) × 100 if the stock goes to zero",
    ["The premium received", "Nothing: the cash is secured", "Unlimited"],
    "OIC calls it substantial and notes the risk profile matches a covered call's. The premium only trims the loss.", "cash-secured-put"),
  mc("WHEEL-05", `Assigned at ${EX.putStrike} after a ${EX.putPremium.toFixed(2)} put, you sell a ${EX.callStrike} call for ${EX.callPremium.toFixed(2)}. What is your premium-adjusted basis?`, "B", String(EX_BASIS_AFTER_CALL),
    [String(EX.putStrike), String(r2(EX.putStrike + EX.putPremium + EX.callPremium)), String(EX.callStrike)],
    `${EX.putStrike} − ${EX.putPremium.toFixed(2)} − ${EX.callPremium.toFixed(2)}. A lower basis is not a profit until you sell.`, "adjusted-cost-basis"),
  mc("WHEEL-06", `If those shares are called away at ${EX.callStrike}, what is the whole wheel's profit on one contract?`, "A", usd(EX_CYCLE.profit),
    [usd(EX.callPremium * SHARES), usd((EX.callStrike - EX.putStrike) * SHARES), usd((EX.putPremium + EX.callPremium) * SHARES)],
    `(${EX.callStrike} − ${EX.putStrike} + ${EX.putPremium.toFixed(2)} + ${EX.callPremium.toFixed(2)}) × 100: the stock gain up to the strike plus both premiums. That is also the cap.`, "covered-call"),
  mc("WHEEL-07", `The stock finishes at ${EX.rally}, well above your ${EX.callStrike} call. What happens?`, "D", `You are called away at ${EX.callStrike} and give up ${usd(EX_RALLY_FORGONE)} of upside`,
    ["You keep the shares and the gain", "You lose money on the shares", "The call expires worthless"],
    "Above the strike, gains go to the call buyer. Capped upside is the price of the call premium.", "called-away"),
  mc("WHEEL-08", `Assigned at ${EX.putStrike} (basis ${EX_BREAKEVEN}), the stock falls to ${EX.crash}. What is the unrealized P/L on 100 shares?`, "C", usd(EX_CRASH_WHEEL),
    [usd(EX.putPremium * SHARES), usd(0), usd(-EX.putStrike * SHARES)],
    "This is bag-holding: the premium cushions the fall but does not stop it. Decide in advance what would make you sell.", "adjusted-cost-basis"),
  mc("WHEEL-09", `After the fall to ${EX.crash}, why can selling a ${EX.crashCallStrike} covered call be a trap?`, "B", "If it is exercised you lock in a loss below your basis",
    ["It is illegal below your basis", "Calls cannot be sold on assigned shares", "It doubles your downside"],
    `Basis ${EX_CRASH_BASIS} after that premium, sold at ${EX.crashCallStrike}: ${usd(EX_CRASH_LOCKED)}. Calls above the basis pay little; calls below it can turn a paper loss into a real one.`, "covered-call"),
  mc("WHEEL-10", "A put shows delta −0.20. What is a common rough reading of that number?", "A", "About a 20% chance of finishing in the money",
    ["A guaranteed 80% win rate", "It loses $0.20 a day", "A 20% expected fall in the stock"],
    "OIC describes this as a view some traders take. Delta also changes with price, time and volatility, so it is a rough guide, not a probability model.", "option-delta"),
  mc("WHEEL-11", "Many wheel sellers use around 0.15–0.30 delta and about 30–45 DTE. How should you treat those numbers?", "C", "As common practice with trade-offs, not rules",
    ["As exchange rules", "As a guarantee of no assignment", "As the only legal strikes"],
    "Higher delta means more premium and more assignments; shorter DTE means faster decay but sharper swings near the strike.", "days-to-expiration"),
  mc("WHEEL-12", "A screenshot shows AROI 80.2% on a 7-day $65 call sold for $1.00. Where does that number come from?", "D", "Simple annualizing: 1.00 ÷ 65 × 365 ÷ 7",
    ["An audited annual return", "The stock's past-year gain", "Implied volatility"],
    "It assumes the same trade every week all year with no losses. Compare trades on premium ÷ collateral per day and on realized results.", "annualized-premium-yield"),
  mc("WHEEL-13", "A screener ranks leveraged ETFs and high-IV stocks at the top by premium yield. What does that tell you?", "B", "High premium is the market's price for high risk, not a free edge",
    ["Those are the safest wheels", "The screener has found mispriced options", "Leveraged ETFs cannot fall far"],
    "Implied volatility, and so premium, is highest where big moves are expected. Pick the stock you would own first, then look at the premium.", "implied-volatility"),
  mc("WHEEL-14", "Why do many wheel sellers avoid expirations that span an earnings report?", "A", "The stock can gap far through the strike overnight",
    ["Options stop trading during earnings", "Premiums are lowest before earnings", "Assignment is impossible after earnings"],
    "Premium is rich before earnings because the gap risk is real. If you hold through it, size it as if you will own the shares after a gap.", "implied-volatility"),
  mc("WHEEL-15", "When is a short covered call most likely to be assigned early?", "C", "Just before an ex-dividend date, when it is in the money",
    ["Never: only at expiration", "Only when it is far out of the money", "On the day you sell it"],
    "Equity options are American-style. OIC notes call holders may exercise to capture a dividend, and assignment can come any trading day.", "early-assignment"),
  mc("WHEEL-16", "In Wilshire's study for Cboe (1986–2018), how did the PutWrite Index (PUT) compare with the S&P 500?", "D", "Similar return (9.5% vs 9.8% a year) with lower volatility (9.9% vs 14.9%)",
    ["Twice the return with no drawdowns", "Much lower return and higher volatility", "It never had a losing year"],
    "It still fell about 27% in 2008 and had a −35.5% worst drawdown, and it lagged in the 2010–2018 bull market. These are index results without costs.", "put-write-index"),
  mc("WHEEL-17", "What does that index evidence NOT tell you about running the wheel on one stock?", "A", "Anything about single-stock risk: it is diversified S&P 500 options",
    ["That selling options can lower volatility", "That option sellers lag strong bull markets", "That premiums can be collected monthly"],
    "A single company can gap on news and never recover. The index evidence supports the idea, not your particular stock.", "put-write-index"),
  mc("WHEEL-18", "An assigned put's premium is treated how by the IRS?", "B", "It reduces the basis of the shares you bought, and the holding period starts at assignment",
    ["It is tax-free", "It is a long-term gain right away", "It is added to your wages"],
    "If the option expires, the premium is a short-term capital gain. If a call is assigned, its premium is added to the sale proceeds.", "adjusted-cost-basis"),
  mc("WHEEL-19", "What do you need before selling cash-secured puts or covered calls?", "C", "Options approval from your broker and its options disclosure document",
    ["Nothing: anyone can sell options", "A futures account", "A margin loan"],
    "FINRA notes brokers must approve accounts for options and give you the Characteristics and Risks of Standardized Options.", "options-approval-level"),
  mc("WHEEL-20", "Is the wheel a valid strategy?", "D", "Yes, as a mainstream conservative-tier options strategy, but the premium is payment for taking stock risk, not free income",
    ["No, it is a scam", "Yes, it is guaranteed income", "Only with leveraged ETFs"],
    "OIC and brokers teach both legs. It suits someone who wants the stock anyway, with the cash to buy it, and accepts capped upside.", "wheel-strategy"),
];

// ---------------------------------------------------------------- links, Playbook copy and credibility

export const WHEEL_LINKS: { label: string; to: string }[] = [
  { label: "Learn · The Wheel: Cash-Secured Puts to Covered Calls", to: "/training?group=wheel-strategy&start=1" },
  { label: "Coach · Run the wheel without bag-holding", to: "/coach/wheel-strategy" },
  { label: "Cases · Options context (wheel cases)", to: "/cases?pack=options-context" },
  { label: "Playbook · The wheel: cash-secured put to covered call", to: "/playbooks/wheel-csp-to-covered-call" },
  { label: "Playbook · Cash-secured put to buy lower", to: "/playbooks/cash-secured-put" },
  { label: "Playbook · Covered call on shares you own", to: "/playbooks/covered-call" },
  { label: "Academy · Options ladder (payoffs and breakevens)", to: "/academy/options" },
];

export const WHEEL_RELATED: { label: string; to: string }[] = [
  { label: "Practice · The wheel strategy (lesson and drills)", to: "/practice/wheel-strategy" },
  { label: "Learn · The Wheel: Cash-Secured Puts to Covered Calls", to: "/training?group=wheel-strategy&start=1" },
  { label: "Cases · Options context (flat month, rip past the strike, crash after assignment, earnings)", to: "/cases?pack=options-context" },
  { label: "Playbook · Cash-secured put to buy lower (step 1)", to: "/playbooks/cash-secured-put" },
  { label: "Playbook · Covered call on shares you own (step 3)", to: "/playbooks/covered-call" },
];

export const WHEEL_PLAYBOOK_SOURCE = {
  url: "https://www.schwab.com/learn/story/three-things-to-know-about-wheel-strategy",
  label: "Charles Schwab · Three Things to Know About the Wheel Strategy",
  verifiedOn: "2026-10-30",
} as const;

export const WHEEL_PLAYBOOK_EXPLANATION = [
  "SAMPLE teaching of the wheel as Charles Schwab describes it (the resource link above), checked against the pages under “How well-tested is this?”. The idea came from Weng's notes on the wheel and screenshots of a commercial wheel screener and tracker; the app teaches the mechanics, not the tool.",
  `1. Pick the stock first. Only a company you would hold through a long fall, at a price you chose, with the cash to buy 100 shares per contract. Schwab: if you misjudge the stock or strike, the premium will not offset the loss.`,
  `2. Sell a cash-secured put. Out of the money, often around 0.15–0.30 delta and about 30–45 days out (common practice, not a rule). Set aside strike × 100. SAMPLE: stock ${EX.price}, sell the ${EX.putStrike} put for ${EX.putPremium.toFixed(2)}: ${usd(EX_COLLATERAL)} secured, breakeven ${EX_BREAKEVEN}, ${pct(EX_PUT_YIELD)} for the month. If it expires, keep the premium and repeat.`,
  `3. If assigned, sell covered calls. Usually at or above your basis. SAMPLE: the ${EX.callStrike} call for ${EX.callPremium.toFixed(2)} lowers the basis to ${EX_BASIS_AFTER_CALL}. If it expires, sell another.`,
  `4. If called away, start again. SAMPLE: called at ${EX.callStrike}: ${usd(EX_CYCLE.profit)} on ${usd(EX_COLLATERAL)} (${pct(EX_CYCLE.returnPct)} in about two months). That is the most it can make: at ${EX.rally}, ${usd(EX_RALLY_FORGONE)} of upside went to the call buyer.`,
  `Warning: the downside is the stock's. Assigned and then falling to ${EX.crash}, the position is ${usd(EX_CRASH_WHEEL)}; the premium covered ${usd(EX.putPremium * SHARES)} of it. Calls below your basis can lock in the loss. Decide before you start what would make you sell the shares, and avoid expirations that span earnings unless you sized for the gap.`,
  "Also: assignment can come any trading day (especially before ex-dividend dates on short calls), expired premiums are short-term gains while assigned ones adjust your basis, and you need options approval from your broker. Annualized yields on short trades assume a whole year without a loss. Not investment advice.",
].join("\n\n");

const src = (supports: string, label: string, url: string, note: string, role: "corroborates" | "presents" = "corroborates") => ({
  supports,
  label,
  url,
  note,
  role,
  verifiedOn: "2026-10-30",
});

export const WHEEL_CREDIBILITY: PlaybookCredibility = {
  title: "How well-tested is this?",
  summary: [
    "The wheel is not one person's system: both legs, the cash-secured put and the covered call, are standard strategies taught by the Options Industry Council (run by OCC) and by Schwab and Fidelity, and they sit in brokers' lowest options-selling approval tiers.",
    "Long-run evidence exists for the index versions: Cboe's PutWrite (PUT) and BuyWrite (BXM) indexes earned close to the S&P 500's return with about a third less volatility from 1986 to 2018, but they still lost about 27–29% in 2008, lagged in the 2010–2018 bull market, and the study was prepared for Cboe. No comparable record exists for wheeling one or two single stocks, and the screener in Weng's notes showed only sample trades.",
    "So: a valid, mainstream strategy for someone who wants to own the stock anyway, with nearly the stock's downside and a capped upside. Each piece is backed below:",
  ],
  sources: [
    src("The whole cycle and its risks", "Charles Schwab · Three Things to Know About the Wheel Strategy", WHEEL_PLAYBOOK_SOURCE.url,
      "Sell OTM cash-secured puts, write covered calls if assigned, repeat; low risk by options standards but not no risk: shares can keep falling, near-the-money strikes can buy high and sell low, and the cash has an opportunity cost."),
    src("1 · Cash-secured put", "Options Industry Council · Cash-Secured Put", "https://www.optionseducation.org/strategies/all-strategies/cash-secured-put",
      "A stock acquisition strategy: set aside cash to buy at the strike; breakeven = strike − premium; the loss is substantial if the stock plummets, and the risk profile matches a covered call."),
    src("3 · Covered call", "Options Industry Council · Covered Call (Buy/Write)", "https://www.optionseducation.org/strategies/all-strategies/covered-call-buy-write",
      "Neutral to moderately bullish; the premium cushions a little but most upside above the strike is given up and the worst case is still the stock going to zero."),
    src("Assignment can come any day", "Charles Schwab · Managing Cash-Secured Puts", "https://www.schwab.com/learn/story/managing-cash-secured-equity-puts",
      "A short option can be assigned at any time up to expiration; being in the money raises the odds but does not guarantee assignment."),
    src("Early assignment and ex-dividend dates", "Options Industry Council · Options Assignment FAQ", "https://www.optionseducation.org/referencelibrary/faq/options-assignment",
      "You can never tell when you will be assigned; risk rises deeper in the money, near expiration, before ex-dividend for short calls and after it for short puts; rolling out and up is an alternative."),
    src("Strike choice: delta as a rough chance", "Options Industry Council · Delta", "https://www.optionseducation.org/advancedconcepts/delta",
      "Some traders view delta as a rough probability of finishing in the money; it changes with price, time and implied volatility."),
    src("Breakevens and early assignment (broker education)", "Fidelity · Generating Income from Options (Cboe presentation, PDF)", "https://www.fidelity.com/bin-public/060_www_fidelity_com/documents/learning-center/Presentation_CBOE%20Generating%20income%20from%20pptions.pdf",
      "Covered call breakeven = stock price paid − premium, downside substantial; cash-secured put breakeven = strike − premium and the cash must be in the account."),
    src("Approval, assignment and dividend risk", "FINRA · Options", "https://www.finra.org/investors/investing/investment-products/options",
      "Trading options requires broker approval and the Characteristics and Risks of Standardized Options; sellers face assignment, dividend, pin and margin risk."),
    src("Taxes: premium and basis", "IRS · Publication 550 (Writers of puts and calls)", "https://www.irs.gov/publications/p550",
      "An expired written option is a short-term capital gain; an assigned put's premium reduces the stock's basis (holding period starts at purchase); an assigned call's premium is added to the amount realized."),
    src("Long-run evidence: put-writing and buy-writes", "Wilshire for Cboe · Options-Based Benchmark Indexes, 1986–2018 (PDF)", "https://cdn.cboe.com/resources/spx/wilshire-options-based-benchmark-indexes-2019.pdf",
      "PUT 9.54% a year vs 9.80% for the S&P 500 with 9.9% vs 14.9% volatility; worst drawdowns −35.5% (PUT) and −35.8% (BXM) vs −50.9%; fatter left tails; weaker Sharpe only in the 2010–Q3 2018 bull market."),
    src("Put-writing is equity exposure plus a volatility premium", "Neuberger Berman (hosted by Cboe) · Simply Put(Writing) (PDF)", "https://cdn.cboe.com/resources/indices/whitepapers/Neuberger_Berman_Simply_PutWriting.pdf",
      "Collateralized put-writing gets long-equity exposure with a volatility premium; the Cboe indexes earned returns similar to their index with notably lower volatility, not without unique risks."),
    src("Why option sellers have been paid", "Cboe · Key Benchmark Indexes Using SPX Options Offer Strong Risk-Adjusted Returns", "https://www.cboe.com/insights/posts/key-cboe-benchmark-indexes-using-spx-options-offer-strong-risk-adjusted-returns/",
      "PUT and BXM had higher Sharpe and Sortino ratios than the S&P 500 over 32.5 years, linked to implied volatility usually exceeding realized; returns are negatively skewed."),
    src("Basis reduction; cash vs margin accounts", "tastylive · How to Convert a Short Put into a Covered Call", "https://www.tastylive.com/news-insights/how-to-convert-a-short-put-into-a-covered-call",
      "The wheel collects premium on the put and then the call, reducing basis (92 put for 2 plus a 100 call for 1: basis 89); it caps upside; cash and IRA accounts secure the full notional, margin accounts use less.", "presents"),
  ],
};
