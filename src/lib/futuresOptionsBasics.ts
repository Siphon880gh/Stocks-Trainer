/**
 * Futures vs options & a beginner toolkit (/practice/futures-vs-options).
 * Futures vs options, MES vs ES with a calculator, SPY for beginners, why 5m before 1m, SMA, bar count + fib,
 * Sharpe ratio, and Apple's FY2025 income statement chain to EBITDA. Tips come from "a trader" (anonymous).
 * Sources fetched 2026-10-22: CME MES FAQ, CME ES page, CFTC, FINRA, SSGA, Investopedia, PortfolioPilot, SEC, EDGAR.
 * Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";
import type { OHLC } from "./ohlcData";
import { sma } from "./indicators";

export const AS_OF = "2026-10-22";
export interface Src { label: string; url: string }
const s = (label: string, url: string): Src => ({ label, url });

export const SRC = {
  mesFaq: s("CME: Micro E-mini Equity Index Futures FAQ", "https://www.cmegroup.com/articles/faqs/frequently-asked-questions-micro-e-mini-equity-index-futures.html"),
  es: s("CME: E-mini S&P 500 futures", "https://www.cmegroup.com/markets/equities/sp/e-mini-sandp500.contractSpecs.html"),
  cftc: s("CFTC: Basics of Futures Trading", "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/FuturesMarketBasics/index.htm"),
  finra: s("FINRA: Options", "https://www.finra.org/investors/investing/investment-products/options"),
  spy: s("State Street: SPY fund page", "https://www.ssga.com/us/en/intermediary/etfs/state-street-spdr-sp-500-etf-trust-spy"),
  sma: s("Investopedia: Simple Moving Average (SMA)", "https://www.investopedia.com/terms/s/sma.asp"),
  sharpe: s("PortfolioPilot: How to compare fund returns (Sharpe ratio)", "https://portfoliopilot.com/portfolio-management/resources/how-to-compare-fund-returns"),
  secGuide: s("SEC: Beginners' Guide to Financial Statements", "https://www.sec.gov/about/reports-publications/beginners-guide-financial-statements"),
  ebitda: s("Investopedia: EBITDA", "https://www.investopedia.com/terms/e/ebitda.asp"),
  aapl10k: s("Apple Inc. Form 10-K, fiscal 2025 (SEC EDGAR)", "https://www.sec.gov/Archives/edgar/data/320193/000032019325000079/aapl-20250927.htm"),
};

/* ---------------- Futures vs options ---------------- */

export const FUT_VS_OPT: Array<{ topic: string; futures: string; options: string }> = [
  {
    topic: "What you agree to",
    futures: "An agreement to buy or sell at a future date, with price and amount fixed when you trade (CFTC). Both sides are obligated.",
    options: "The buyer gets the right, but not the obligation, to buy (call) or sell (put) at a fixed price by a set date. The seller takes on the obligation (FINRA).",
  },
  {
    topic: "Money up front",
    futures: "A margin deposit (a good-faith amount), not the full contract value.",
    options: "The buyer pays a premium; that is the most an option buyer can lose.",
  },
  {
    topic: "How P&L moves",
    futures: "Straight line: each index point is worth a fixed dollar amount per contract (MES $5, ES $50).",
    options: "Curved: value depends on price, time left and expected volatility, so it is not a fixed amount per point.",
  },
  {
    topic: "Time",
    futures: "No time decay in the option sense; contracts expire on a quarterly cycle and traders roll.",
    options: "Time decay: an option loses value as expiration approaches if nothing else changes.",
  },
  {
    topic: "Worst case",
    futures: "Leveraged: you can lose more than the money you deposited (CME).",
    options: "Buyers risk the premium; sellers of uncovered options can face large or open-ended losses.",
  },
  {
    topic: "Getting started",
    futures: "A futures-enabled account with a futures broker.",
    options: "Specific options approval from your brokerage, plus the options disclosure document (FINRA).",
  },
];

/* ---------------- MES vs ES ---------------- */

export type FutContract = "MES" | "ES";
export const CONTRACTS: Record<FutContract, { name: string; multiplier: number; tick: number }> = {
  MES: { name: "Micro E-mini S&P 500", multiplier: 5, tick: 0.25 },
  ES: { name: "E-mini S&P 500", multiplier: 50, tick: 0.25 },
};

export function tickValue(c: FutContract): number {
  return CONTRACTS[c].tick * CONTRACTS[c].multiplier;
}
export function notional(c: FutContract, indexPrice: number, contracts = 1): number {
  return indexPrice * CONTRACTS[c].multiplier * contracts;
}
/** P&L in dollars for a move of `points` index points (positive = in your favour), before costs. */
export function futuresPnl(c: FutContract, points: number, contracts = 1): number {
  return points * CONTRACTS[c].multiplier * contracts;
}
export function pointsToTicks(points: number, c: FutContract = "MES"): number {
  return points / CONTRACTS[c].tick;
}
/** How many MES contracts equal the exposure of `esContracts` ES. */
export function mesPerEs(esContracts = 1): number {
  return (CONTRACTS.ES.multiplier / CONTRACTS.MES.multiplier) * esContracts;
}

export const MES_ES_ROWS = [
  { label: "Multiplier", mes: "$5 × index", es: "$50 × index" },
  { label: "Minimum tick", mes: "0.25 point = $1.25", es: "0.25 point = $12.50" },
  { label: "1 full point", mes: "$5 per contract", es: "$50 per contract" },
  { label: "Notional at 7,500", mes: "$37,500", es: "$375,000" },
  { label: "Equivalence", mes: "10 MES", es: "= 1 ES" },
  { label: "Hours (CME Globex)", mes: "Sun–Fri 6:00 p.m.–5:00 p.m. ET", es: "Same" },
];

/* ---------------- SPY for beginners ---------------- */

export const SPY_FACTS = {
  name: "SPDR S&P 500 ETF Trust (SPY)",
  objective: "Seeks results that, before expenses, correspond generally to the price and yield of the S&P 500 Index.",
  inception: "January 22, 1993",
  expenseRatio: "0.0945%",
};

export const SPY_POINTS = [
  "SPY trades like a stock: you can buy a single share during market hours, and your loss is limited to what you put in when you buy without margin.",
  "One share gives you a slice of the S&P 500 without a contract multiplier, an expiry or a roll.",
  "An expense ratio of 0.0945% means about $0.95 a year per $1,000 held (State Street, as of 2026-10-22).",
  "Compare: one MES contract at 7,500 controls $37,500 of exposure. A beginner can practise reading the same index with far less at stake.",
];

/** Annual cost in dollars of an expense ratio given as a percent. */
export function expenseCost(amount: number, ratioPct = 0.0945): number {
  return (amount * ratioPct) / 100;
}

/* ---------------- 5m before 1m ---------------- */

export const FIVE_BEFORE_ONE = [
  "A trader's advice: learn on the 5-minute chart first. Each 5m candle is five 1m candles, so the noise is smoothed and you have time to think.",
  "The 1-minute chart gives more signals, but not always better signals. Use it to fine-tune an entry the 5m already justifies.",
  "A session has 78 five-minute bars (390 minutes ÷ 5). Fewer, larger bars make legs and pauses easier to count.",
];

/* ---------------- SMA ---------------- */

/** SIMULATED daily closes for the SMA example. */
export const SIM_CLOSES = [100, 101, 103, 102, 104, 106, 105, 107, 109, 108, 110, 112, 111, 113, 115];
export const SIM_DAILY: OHLC[] = SIM_CLOSES.map((c, i) => {
  const o = i === 0 ? c - 0.5 : SIM_CLOSES[i - 1]!;
  return { name: `D${i + 1}`, open: o, high: Math.max(o, c) + 0.8, low: Math.min(o, c) - 0.8, close: c };
});
export function simpleAverage(values: number[]): number {
  return values.reduce((a, b) => a + b, 0) / values.length;
}
export function smaSeries(period: number): (number | null)[] {
  return sma(SIM_CLOSES, period);
}

/* ---------------- Bar count + fib ---------------- */

export const BAR_COUNT_FIB = [
  "A trader's 1-minute MES setup: the TradingView community indicator \"Bar Count Normal 2\" numbers the candles so you can see how many bars a move has lasted.",
  "Draw a Fibonacci retracement from the swing that started the move to the swing that ended it. On an advance that is low to high; use Reverse if it comes out upside down.",
  "Read both together: price at a level (fib) and the age of the move (bar count). A strong push that is 40 bars old and stalling at 61.8% is a different trade from a fresh one.",
  "Plan the stop and target before entry, then subtract round-trip costs: 1 MES tick is only $1.25.",
];

/* ---------------- Sharpe ---------------- */

/** Sharpe = (return − risk-free) ÷ standard deviation, all in the same units (e.g. annual %). */
export function sharpe(returnPct: number, riskFreePct: number, stdevPct: number): number | null {
  if (!(stdevPct > 0)) return null;
  return (returnPct - riskFreePct) / stdevPct;
}

export const SHARPE_NOTES = [
  "Excess return = fund return − risk-free rate (often a short-term U.S. Treasury yield).",
  "Divide by the standard deviation of returns: the result is reward per unit of volatility.",
  "Example (PortfolioPilot): 8% return, 2% risk-free, 10% standard deviation → (8 − 2) ÷ 10 = 0.6.",
  "Only compare Sharpe ratios computed over the same period with the same risk-free rate. A short, lucky window can make any strategy look good.",
];

/* ---------------- Apple FY2025 income statement chain ---------------- */

/** Apple Inc. fiscal 2025 (year ended Sep 27, 2025), $ millions, from its Form 10-K filed Oct 31, 2025. */
export const AAPL_FY25 = {
  revenue: 416_161,
  costOfSales: 220_960,
  grossMargin: 195_201,
  rnd: 34_550,
  sga: 27_601,
  operatingExpenses: 62_151,
  operatingIncome: 133_050,
  otherIncome: -321,
  pretaxIncome: 132_729,
  incomeTax: 20_719,
  netIncome: 112_010,
  dAndA: 11_698,
  dilutedEps: 7.46,
};

export function aaplEbitda(): number {
  return AAPL_FY25.operatingIncome + AAPL_FY25.dAndA;
}

export const AAPL_CHAIN: Array<{ step: string; value: number; op: string; note: string }> = [
  { step: "Net sales (revenue)", value: AAPL_FY25.revenue, op: "", note: "Products + services sold in the year" },
  { step: "Cost of sales", value: -AAPL_FY25.costOfSales, op: "−", note: "Cost to make and deliver what was sold" },
  { step: "Gross margin", value: AAPL_FY25.grossMargin, op: "=", note: "Revenue − cost of sales" },
  { step: "Operating expenses (R&D $34,550 + SG&A $27,601)", value: -AAPL_FY25.operatingExpenses, op: "−", note: "Running the business" },
  { step: "Operating income", value: AAPL_FY25.operatingIncome, op: "=", note: "Profit from operations" },
  { step: "Other income/(expense), net", value: AAPL_FY25.otherIncome, op: "±", note: "Non-operating items" },
  { step: "Income before taxes", value: AAPL_FY25.pretaxIncome, op: "=", note: "Pre-tax profit" },
  { step: "Provision for income taxes", value: -AAPL_FY25.incomeTax, op: "−", note: "Tax expense" },
  { step: "Net income", value: AAPL_FY25.netIncome, op: "=", note: "The bottom line; diluted EPS $7.46" },
];

export const EBITDA_STEPS = [
  `EBITDA = operating income + depreciation and amortization (Investopedia).`,
  `Apple FY2025: $133,050M + $11,698M (D&A from the cash-flow statement) = $${aaplEbitda().toLocaleString("en-US")}M.`,
  "EBITDA is a non-GAAP measure: Apple does not report it on the income statement, so you compute it, and companies can define it differently.",
];

/* ---------------- Quiz & terms ---------------- */

type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export const FUT_OPT_TERMS: LiteracyTerm[] = [
  { id: "futures-contract", name: "Futures contract", category: "markets", summary: "An agreement to buy or sell something at a future date at a price fixed today.", detail: "Both sides are obligated (CFTC). Equity index futures such as MES and ES settle in cash and are leveraged: a margin deposit controls the full contract value, so losses can exceed the deposit. Educational, not advice." },
  { id: "option-contract", name: "Option contract", category: "markets", summary: "The right, but not the obligation, to buy (call) or sell (put) at a set price by a set date.", detail: "The buyer pays a premium and risks that premium; the seller accepts the obligation if assigned (FINRA). Options lose value with time decay as expiry nears. Requires brokerage approval. Educational, not advice." },
  { id: "contract-multiplier", name: "Contract multiplier", category: "markets", summary: "The dollar value of one index point for one futures contract.", detail: "MES is $5 × the S&P 500 futures price; ES is $50 ×. Multiply the multiplier by points moved and contracts held to get P&L before costs. Educational, not advice." },
  { id: "notional-value", name: "Notional value", category: "markets", summary: "The full market exposure a contract controls: price × multiplier × contracts.", detail: "One MES at 7,500 controls $37,500; one ES controls $375,000. Margin is only a fraction of notional, which is what makes futures leveraged. Educational, not advice." },
  { id: "es-emini", name: "ES (E-mini S&P 500)", category: "markets", summary: "CME's E-mini S&P 500 futures contract: $50 per index point, 0.25-point tick worth $12.50.", detail: "Ten MES contracts equal one ES. ES trades nearly 24 hours, Sunday to Friday, on CME Globex. Educational, not advice." },
  { id: "spy-etf", name: "SPY", category: "markets", summary: "The SPDR S&P 500 ETF Trust, an exchange-traded fund that tracks the S&P 500 before expenses.", detail: "Launched January 22, 1993; expense ratio 0.0945% (State Street, as of 2026-10-22). Trades like a stock, one share at a time, with no expiry or multiplier. Educational, not advice." },
  { id: "simple-moving-average", name: "Simple moving average (SMA)", category: "process", summary: "The plain average of the last N closes, recalculated each bar.", detail: "SMA(5) = sum of the last five closes ÷ 5. It smooths noise and lags price; a short SMA crossing above a long one is called a golden cross, below a death cross (Investopedia). Educational, not advice." },
  { id: "sharpe-ratio", name: "Sharpe ratio", category: "process", summary: "Excess return per unit of volatility: (return − risk-free rate) ÷ standard deviation.", detail: "Example: (8% − 2%) ÷ 10% = 0.6. Higher means more return for each unit of risk, but only if the inputs are realistic and measured over the same period. Educational, not advice." },
];

export const FUT_OPT_QUESTIONS: QuizQuestion[] = [
  mc("FO-01", "Which describes a futures contract?", "B", "An agreement to buy or sell at a future date, with price and amount fixed now", ["The right, but not the obligation, to buy later", "A share of a company", "A fund that tracks an index"], "CFTC: both sides of a futures contract are obligated.", "futures-contract"),
  mc("FO-02", "An option buyer has…", "A", "The right, but not the obligation, to buy or sell at the strike by expiry", ["An obligation to buy at any price", "No cost to enter", "Unlimited downside as a buyer"], "FINRA: the buyer pays a premium for a right; the seller takes the obligation.", "option-contract"),
  mc("FO-03", "One MES contract moves 4 full points in your favour. Gross P&L?", "C", "$20", ["$4", "$200", "$1.25"], "MES is $5 per point: 4 × $5 = $20 before costs.", "contract-multiplier"),
  mc("FO-04", "One ES tick (0.25 point) is worth…", "D", "$12.50", ["$1.25", "$5", "$50"], "0.25 × $50 = $12.50. MES is one tenth of that, $1.25.", "es-emini"),
  mc("FO-05", "How many MES contracts equal one ES?", "B", "10", ["5", "50", "2"], "CME: Micro multipliers are 1/10 of E-mini ($5 vs $50)."),
  mc("FO-06", "Notional value of 2 MES with the futures at 7,500?", "A", "$75,000", ["$37,500", "$15,000", "$750,000"], "7,500 × $5 × 2 = $75,000.", "notional-value"),
  mc("FO-07", "Why can a futures trader lose more than the deposit?", "C", "Margin is a fraction of notional, so the contract is leveraged", ["Futures charge a premium that grows", "Exchanges add a penalty fee", "Futures have time decay"], "CME: because only a percentage of a contract's value is required, losses can exceed the deposit."),
  mc("FO-08", "What erodes an option's value as expiry nears, all else equal?", "B", "Time decay", ["The contract multiplier", "The SPY expense ratio", "Bar count"], "Options are wasting assets; futures don't decay that way."),
  mc("FO-09", "A beginner wants S&P 500 exposure with no expiry, no multiplier and a loss capped at the purchase. Best fit?", "D", "Buy SPY shares in a cash account", ["Short one ES", "Sell uncovered calls", "Buy 10 MES"], "SPY trades like a stock; without margin you can't lose more than you put in.", "spy-etf"),
  mc("FO-10", "SPY's expense ratio is 0.0945%. Annual cost on $10,000?", "A", "About $9.45", ["About $94.50", "About $0.95", "About $945"], "$10,000 × 0.0945% = $9.45."),
  mc("FO-11", "Closes 10, 11, 12, 13, 14. The 5-period SMA is…", "C", "12", ["14", "13", "11"], "(10+11+12+13+14) ÷ 5 = 12.", "simple-moving-average"),
  mc("FO-12", "Return 8%, risk-free 2%, standard deviation 10%. Sharpe ratio?", "B", "0.6", ["0.8", "6", "1.0"], "(8 − 2) ÷ 10 = 0.6 (PortfolioPilot's example).", "sharpe-ratio"),
  mc("FO-13", "Apple FY2025: operating income $133,050M, D&A $11,698M. EBITDA?", "D", "$144,748M", ["$121,352M", "$112,010M", "$133,050M"], "EBITDA = operating income + D&A. It's non-GAAP, so you compute it.", "ebitda"),
  mc("FO-14", "On an income statement, what sits between gross margin and operating income?", "A", "Operating expenses (R&D, SG&A)", ["Income taxes", "Depreciation only", "Dividends paid"], "Revenue − cost of sales = gross margin; − operating expenses = operating income (SEC beginners' guide).", "income-statement"),
  mc("FO-15", "Why practise on 5-minute charts before 1-minute?", "C", "Fewer, smoother bars give time to think; 1m gives more signals but not always better ones", ["5m charts never have false breakouts", "1m charts are illegal for beginners", "5m charts remove trading costs"], "Use 1m for detail once the 5m context supports the trade."),
  mc("FO-16", "A move is 40 bars old and stalls at 61.8%. What do bar count and fib tell you together?", "B", "Price is at a decision level and the move is old, so demand confirmation before entering", ["Buy immediately: 61.8% always holds", "Bar count overrides fib", "Ignore both on 1m charts"], "Fib shows where; bar count shows how long. Together they help you avoid entering late."),
];

/** Checks the chain ties: gross − opex = operating; operating + other = pretax; pretax − tax = net. */
export function aaplTies(): boolean {
  const a = AAPL_FY25;
  return (
    a.revenue - a.costOfSales === a.grossMargin &&
    a.rnd + a.sga === a.operatingExpenses &&
    a.grossMargin - a.operatingExpenses === a.operatingIncome &&
    a.operatingIncome + a.otherIncome === a.pretaxIncome &&
    a.pretaxIncome - a.incomeTax === a.netIncome
  );
}
