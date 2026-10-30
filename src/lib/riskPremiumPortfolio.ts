/**
 * Risk-premium ETF portfolio with a VIX overlay, as presented by Predicting Alpha on YouTube
 * ("This ETF Strategy Turned $100k into $1.2 Million (18.4% CAGR, 1.22 Sharpe)", https://www.youtube.com/watch?v=lgCcuWrfLkI),
 * which calls it the "North Star Portfolio": SPY 35 / TLT 30 / GLD 20 / FXE 10 / DBC 5, weights set by each asset's
 * economic role, a trend filter that moves a weak slice to cash, and a volatility-risk-premium (VRP) overlay that is short
 * VIX futures exposure (VXX) when the premium looks positive, flat when unclear and long in a crash.
 *
 * What the video does NOT give: the trend filter's lookbacks or thresholds, and the overlay's thresholds and sizing formula.
 * The app does not invent them. The trend example here is the common textbook one (price vs a 10-month simple moving average,
 * checked monthly, as in Meb Faber's published timing model) and is labelled as such. The regime drill uses the app's own
 * simplification (act only when the term structure and implied-vs-realized agree), also labelled. The video's performance
 * figures are the creator's own backtest, shown before a pitch for their paid offering; they are not live results.
 *
 * Feeds /practice/risk-premium-portfolio, the Learn group `risk-premium-portfolio` (RPP- questions), RPP_CASES (pack
 * `macro-news`, mode `vol_risk_premium`), the coach session `read-a-backtest`, the glossary and the Playbook kit
 * `etf-north-star-vrp`. Runtime import only of `sma` from indicators.ts (no imports there), so there is no cycle.
 * Checked by riskPremiumPortfolio.test.ts. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { OHLC } from "./ohlcData";
import type { LiteracyTerm } from "./literacyTerms";
import type { CaseStudy } from "./caseStudies";
import type { PlaybookCredibility } from "./playbooks";
import { sma } from "./indicators";

export const RPP_DISCLAIMER = "SAMPLE numbers and stylized charts for learning, not trading advice. Short volatility and leverage can lose more than the money in that sleeve.";

export const RPP_VIDEO = {
  title: "This ETF Strategy Turned $100k into $1.2 Million (18.4% CAGR, 1.22 Sharpe)",
  creator: "Predicting Alpha",
  watchUrl: "https://www.youtube.com/watch?v=lgCcuWrfLkI",
  embedUrl: "https://www.youtube-nocookie.com/embed/lgCcuWrfLkI",
  /** From YouTube oEmbed `author_url` for the video (checked 2026-10-30). */
  channelUrl: "https://www.youtube.com/@PredictingAlpha",
} as const;

const r1 = (v: number) => Math.round(v * 10) / 10;
const r2 = (v: number) => Math.round(v * 100) / 100;
export const pct = (v: number, d = 1) => `${v.toFixed(d)}%`;

// ---------------------------------------------------------------- the portfolio, as presented

export interface RppSleeve {
  ticker: string;
  weight: number;
  premium: string;
  role: string;
}

/** The video's base weights (they sum to 100). Roles restated for learners. */
export const RPP_SLEEVES: RppSleeve[] = [
  { ticker: "SPY", weight: 35, premium: "Equity risk premium", role: "Paid for owning business risk; does best when growth surprises up." },
  { ticker: "TLT", weight: 30, premium: "Term premium (interest-rate risk)", role: "Long Treasuries; often rise when growth and inflation fall, but rising rates mechanically push them down." },
  { ticker: "GLD", weight: 20, premium: "Store of value", role: "Gold; tends to have low correlation with stocks and can help when inflation or currency debasement fears rise." },
  { ticker: "FXE", weight: 10, premium: "Currency exposure (carry)", role: "The euro vs the dollar; a different economic driver from US stocks and bonds." },
  { ticker: "DBC", weight: 5, premium: "Commodities", role: "A futures-based commodity basket, because storing physical commodities is impractical; helps in inflation shocks." },
];

/** The video's backtest from $100,000. The creator's own numbers, not live or audited results. */
export interface RppBacktestRow {
  id: "etf" | "vix" | "combined" | "spy";
  label: string;
  endValue: number;
  cagr: number;
  vol: number;
  sharpe: number;
  maxDd: number;
}
export const RPP_START = 100_000;
export const RPP_BACKTEST: RppBacktestRow[] = [
  { id: "etf", label: "ETF portfolio only", endValue: 270_590, cagr: 5.53, vol: 6.82, sharpe: 0.82, maxDd: -12.93 },
  { id: "vix", label: "VIX overlay only", endValue: 514_133, cagr: 11.73, vol: 13.05, sharpe: 0.915, maxDd: -19.01 },
  { id: "combined", label: "Combined (about 1.2x exposure)", endValue: 1_215_306, cagr: 18.4, vol: 15.13, sharpe: 1.22, maxDd: -20.1 },
  { id: "spy", label: "SPY (benchmark)", endValue: 682_137, cagr: 13.87, vol: 17.28, sharpe: 0.86, maxDd: -33.76 },
];

// ---------------------------------------------------------------- pure helpers

/** Compound annual growth rate in % from a start value, an end value and a number of years. */
export function cagr(start: number, end: number, years: number): number {
  return (Math.pow(end / start, 1 / years) - 1) * 100;
}

/** Years implied by a start value, end value and a CAGR in %. */
export function impliedYears(start: number, end: number, cagrPct: number): number {
  return Math.log(end / start) / Math.log(1 + cagrPct / 100);
}

/** Worst peak-to-trough fall of a value series, in % (a negative number, or 0). */
export function maxDrawdown(values: number[]): number {
  let peak = -Infinity;
  let worst = 0;
  for (const v of values) {
    peak = Math.max(peak, v);
    worst = Math.min(worst, (v / peak - 1) * 100);
  }
  return worst;
}

/** Portfolio volatility in % from weights (fractions), asset volatilities (%) and a correlation matrix. */
export function portfolioVol(weights: number[], vols: number[], corr: number[][]): number {
  let v = 0;
  for (let i = 0; i < weights.length; i++)
    for (let j = 0; j < weights.length; j++) v += weights[i] * weights[j] * vols[i] * vols[j] * corr[i][j];
  return Math.sqrt(v);
}

/** Two equal-weight assets at a given correlation (vol in %). */
export const twoAssetVol = (volA: number, volB: number, rho: number) => portfolioVol([0.5, 0.5], [volA, volB], [[1, rho], [rho, 1]]);

/**
 * Textbook trend filter (NOT the video's rule, which is not disclosed): invested when the month-end close is above its
 * `lookback`-month simple moving average, in cash otherwise; null until there is enough history.
 */
export function trendFilter(closes: number[], lookback = 10): (boolean | null)[] {
  return sma(closes, lookback).map((avg, i) => (avg === null ? null : closes[i] > avg));
}

/** VIX futures slope in %: second month vs front month. Positive = contango, negative = backwardation. */
export const termSlopePct = (front: number, second: number) => r2((second / front - 1) * 100);

/** Loss as % of the whole account when a short sleeve of `sleevePct`% of the account faces a `rallyPct`% rally. */
export const shortSleeveLoss = (sleevePct: number, rallyPct: number) => r1((sleevePct * rallyPct) / 100);

export type VrpCall = "short" | "flat" | "long";
export const VRP_CALL_LABELS: Record<VrpCall, string> = {
  short: "Short VIX futures exposure: the premium looks positive",
  flat: "Flat: the signals disagree",
  long: "Long VIX futures exposure: the premium looks negative",
};
export const VRP_CALLS: VrpCall[] = ["short", "flat", "long"];

/**
 * The app's teaching simplification of the video's two VRP inputs (it gives no thresholds): act only when the
 * futures slope and implied-vs-realized volatility point the same way, otherwise stay flat.
 */
export function vrpCall(front: number, second: number, implied: number, realized: number): VrpCall {
  const slope = Math.sign(termSlopePct(front, second));
  const spread = Math.sign(implied - realized);
  if (slope > 0 && spread > 0) return "short";
  if (slope < 0 && spread < 0) return "long";
  return "flat";
}

// ---------------------------------------------------------------- SAMPLE examples

/** SAMPLE assumptions (not data) for the correlation example: two assets with 16% and 15% volatility. */
export const RPP_CORR_EXAMPLE = [0.5, 0, -0.3].map((rho) => ({ rho, vol: r2(twoAssetVol(16, 15, rho)) }));

/** SAMPLE month-end closes for the textbook trend-filter example. */
export const RPP_TREND_SAMPLE: number[] = [100, 102, 104, 103, 106, 108, 107, 110, 111, 109, 112, 108, 104, 101, 99, 100, 103, 106];
export const RPP_TREND_LOOKBACK = 10;

export interface VrpScenario {
  id: string;
  title: string;
  vix: number;
  front: number;
  second: number;
  implied: number;
  realized: number;
  answer: VrpCall;
  why: string;
}

export const VRP_SCENARIOS: VrpScenario[] = [
  { id: "calm", title: "A calm market", vix: 13, front: 14.5, second: 15.8, implied: 13, realized: 9, answer: "short", why: "Futures sit above spot and the second month above the front (contango), and implied volatility is above what the market is actually doing. Both say insurance is priced richly." },
  { id: "crash", title: "A crash day", vix: 45, front: 38, second: 32, implied: 45, realized: 60, answer: "long", why: "The curve has inverted (backwardation) and realized volatility is running above implied. Both say the premium has turned negative: selling insurance here is how short-vol accounts blow up." },
  { id: "mixed-realized", title: "Contango, but the market is already moving", vix: 16, front: 16.8, second: 17.4, implied: 16, realized: 19, answer: "flat", why: "The curve is still in contango, but realized volatility is above implied. The signals disagree, so the overlay stays out." },
  { id: "mixed-curve", title: "Backwardation, but implied is still rich", vix: 24, front: 23.5, second: 23.0, implied: 24, realized: 15, answer: "flat", why: "Implied is well above realized, but the front of the curve is above the second month. Mixed signals: no position." },
];

// ---------------------------------------------------------------- caveats

export interface RppCaveat {
  id: string;
  title: string;
  text: string;
}

const COMBINED = RPP_BACKTEST.find((r) => r.id === "combined")!;
const ETF = RPP_BACKTEST.find((r) => r.id === "etf")!;
export const RPP_IMPLIED_YEARS = r1(impliedYears(RPP_START, COMBINED.endValue, COMBINED.cagr));
export const RPP_ETF_IMPLIED_CAGR = r2(cagr(RPP_START, ETF.endValue, impliedYears(RPP_START, COMBINED.endValue, COMBINED.cagr)));

export const RPP_CAVEATS: RppCaveat[] = [
  {
    id: "backtest-not-record",
    title: "A backtest is not a track record",
    text: `The video's $100,000 → $${COMBINED.endValue.toLocaleString("en-US")} (${pct(COMBINED.cagr, 2)} a year, Sharpe ${COMBINED.sharpe}) is the creator's own simulation, shown before a pitch for their paid offering. Nobody outside has audited it. It does model costs ($0.005 a share, 3.5% a year to borrow VXX) and avoids look-ahead by computing signals 30 minutes before the close and trading at the close, which is good practice, but the rules that matter most are not disclosed.`,
  },
  {
    id: "numbers-check",
    title: "Check the numbers against each other",
    text: `The combined line's start, end and CAGR imply about ${RPP_IMPLIED_YEARS} years. Over the same span, the ETF-only end value ($${ETF.endValue.toLocaleString("en-US")}) works out to about ${pct(RPP_ETF_IMPLIED_CAGR, 1)} a year, not the ${pct(ETF.cagr, 2)} shown. The period may differ between lines, but the video does not say. Small inconsistencies are a reason to ask questions, not proof of anything.`,
  },
  {
    id: "missing-rules",
    title: "The key parameters are missing",
    text: "The trend filter's lookbacks and the overlay's thresholds and sizing are not given. Without them you cannot reproduce the result, and choosing them yourself by testing many versions on the same history is how overfitting happens.",
  },
  {
    id: "short-vol-tail",
    title: "Short volatility loses fast and big",
    text: `Selling volatility earns small, steady gains and occasionally loses a lot at once. The video notes VXX rallied more than 400% in the 2020 COVID crash: a short VXX position sized at 20% of an account would have lost about ${pct(shortSleeveLoss(20, 400), 0)} of the whole account. Shorting VXX directly drew down about 65% on that sleeve in the video's own test, and a one-day delay in flipping long during a crash cut returns sharply.`,
  },
  {
    id: "inverse-etps",
    title: "Inverse volatility ETPs can go to zero",
    text: "In February 2018 the VIX spiked, the inverse-VIX note XIV closed down 93% in a day and Credit Suisse terminated it, and SVXY lost most of its value. Products that are short VIX futures for you can be wiped out before you can react.",
  },
  {
    id: "leverage",
    title: "1.2x exposure amplifies losses and needs margin",
    text: "Stacking the overlay on a fully invested portfolio puts about 120% of the account at risk. Leverage scales losses as well as gains, and a broker can demand more margin at the worst moment.",
  },
  {
    id: "trend-lag",
    title: "Trend filters react late",
    text: "A trend rule exits after a fall has started and re-enters after a recovery has started. It can sit in cash through a sharp rebound, and it cannot help on a one-day crash.",
  },
  {
    id: "stocks-bonds-together",
    title: "Stocks and bonds can fall together",
    text: "Diversification relies on assets not falling at the same time. In 2022 rising rates hit both: the S&P 500 fell about 18% and long Treasuries about 30%. A 30% TLT slice is a large bet on rates not rising fast.",
  },
];

// ---------------------------------------------------------------- glossary

export const RPP_TERMS: LiteracyTerm[] = [
  {
    id: "risk-premium",
    name: "Risk premium",
    category: "markets",
    summary: "The extra return investors expect for holding a risk others want to avoid.",
    detail:
      "Examples: the equity risk premium (owning business risk), the term premium (lending for a long time, which carries interest-rate risk) and the volatility risk premium (selling insurance against market falls). A premium is paid on average over long periods. It can be negative for years, and it is paid precisely because it sometimes hurts. Educational, not advice.",
  },
  {
    id: "volatility-risk-premium",
    name: "Volatility risk premium (VRP)",
    category: "markets",
    summary: "Options and VIX futures usually price in more volatility than actually happens; sellers collect the difference.",
    detail:
      "Buyers of protection overpay on average, like insurance customers, so implied volatility tends to sit above realized volatility. Sellers earn that gap most of the time and pay out in crashes, when the premium turns sharply negative. Size the position for the crash, not for the average. Educational, not advice.",
  },
  {
    id: "vix-index",
    name: "VIX",
    category: "markets",
    summary: "Cboe's index of the 30-day volatility implied by S&P 500 option prices, often called the fear gauge.",
    detail:
      "The VIX itself cannot be bought. Products such as VXX (a note) and VIXY (a fund) track VIX futures, rolling between the first and second month to keep about 30 days to expiry, so they behave differently from the index. The VIX tends to jump when stocks fall. Educational, not advice.",
  },
  {
    id: "vix-term-structure",
    name: "VIX futures term structure",
    category: "markets",
    summary: "VIX futures prices by expiry. Usually upward-sloping (contango); inverted (backwardation) in panics.",
    detail:
      "In calm markets later futures trade above the front month and above spot, and each future drifts down toward spot as it nears expiry. That drift is why long-VIX products lose value over time and why shorting them earns a premium. When fear spikes the front month jumps above later months, and short positions lose fast. Educational, not advice.",
  },
  {
    id: "roll-yield",
    name: "Roll yield",
    category: "markets",
    summary: "The gain or loss from replacing an expiring futures contract with a later one.",
    detail:
      "In contango you sell the cheaper near contract and buy the dearer later one, so holding a long futures position loses a little at every roll (negative roll yield); in backwardation the roll helps. FINRA notes that many VIX-futures products have lost more than 90% of their value over time this way. Educational, not advice.",
  },
  {
    id: "inverse-volatility-etp",
    name: "Inverse volatility ETP",
    category: "position",
    summary: "An exchange-traded note or fund that rises when VIX futures fall, e.g. the former XIV or SVXY.",
    detail:
      "It packages a short-volatility position for you. It earns steadily in calm markets and can lose almost everything in one day: on 5–6 February 2018 XIV fell more than 90% and was terminated by its issuer. Prospectus clauses let issuers close such notes after a large one-day loss. Educational, not advice.",
  },
  {
    id: "market-on-close",
    name: "Market-on-close (MOC) order",
    category: "process",
    summary: "An order to trade at the official closing price.",
    detail:
      "Backtests that compute a signal from the close and also trade at that same close are using information they would not have had. Computing the signal shortly before the close and filling at the close keeps the test honest about timing. Educational, not advice.",
  },
  {
    id: "cagr",
    name: "CAGR (compound annual growth rate)",
    category: "process",
    summary: "The steady yearly return that turns a start value into an end value over a number of years.",
    detail:
      "CAGR = (end ÷ start)^(1 ÷ years) − 1. $100,000 growing to $200,000 in 10 years is about 7.2% a year. CAGR hides the path: two strategies with the same CAGR can have very different drawdowns. Educational, not advice.",
  },
  {
    id: "portfolio-leverage",
    name: "Portfolio leverage",
    category: "position",
    summary: "Holding positions worth more than the account, e.g. 120% exposure on 100% capital.",
    detail:
      "Leverage scales gains and losses alike, adds borrowing costs and can trigger margin calls when prices move against you. Lower-volatility, diversified mixes are sometimes levered modestly; the risk is that correlations jump together in a crisis. Educational, not advice.",
  },
  {
    id: "trend-filter",
    name: "Trend filter (time-series momentum)",
    category: "process",
    summary: "A rule that holds an asset only while its own recent trend is up, and moves to cash otherwise.",
    detail:
      "A common textbook version (not the rule in the Predicting Alpha video, which does not disclose its lookbacks) checks once a month whether the price is above its 10-month simple moving average. Research finds time-series momentum across many asset classes, but trend rules exit late, re-enter late and whipsaw in choppy markets. Educational, not advice.",
  },
  {
    id: "risk-parity",
    name: "Risk parity / All Weather",
    category: "process",
    summary: "Balancing a portfolio by the risks and economic environments each asset responds to, not by dollars.",
    detail:
      "Bridgewater's All Weather idea holds assets that do well in different environments (growth or recession, rising or falling inflation) so no single surprise dominates. Bonds are less volatile than stocks, so these portfolios often hold more bonds and may use modest leverage. Educational, not advice.",
  },
];

// ---------------------------------------------------------------- cases (pack macro-news, mode vol_risk_premium)

const bar = (name: string, open: number, high: number, low: number, close: number): OHLC => ({ name, open, high, low, close });
const days = (prefix: string, data: Array<[number, number, number, number]>, post = false): OHLC[] =>
  data.map(([o, h, l, c], i) => bar(post ? `+${i + 1}` : `${prefix}${i - data.length + 1 === 0 ? "0" : i - data.length + 1}`, o, h, l, c));

const XIV_PRE = days("D", [
  [118.0, 119.2, 117.6, 119.0], [119.0, 120.4, 118.7, 120.1], [120.1, 121.0, 119.5, 120.8], [120.8, 122.3, 120.5, 122.0],
  [122.0, 123.1, 121.4, 122.7], [122.7, 124.0, 122.3, 123.8], [123.8, 125.1, 123.5, 124.9], [124.9, 126.0, 124.2, 125.6],
  [125.6, 126.4, 124.0, 124.5], [124.5, 125.0, 121.0, 121.8], [121.8, 122.5, 115.0, 116.2], [116.2, 116.8, 107.5, 108.4],
]);
const XIV_POST = days("", [[108.4, 109.0, 95.5, 99.0], [10.0, 12.0, 6.0, 7.0], [7.0, 7.9, 5.9, 6.1]], true);

const VXX_PRE = days("D", [
  [14.6, 14.8, 14.2, 14.3], [14.3, 14.5, 13.9, 14.0], [14.0, 14.2, 13.7, 13.8], [13.8, 14.0, 13.5, 13.6],
  [13.6, 13.9, 13.4, 13.5], [13.5, 13.7, 13.3, 13.4], [13.4, 13.6, 13.2, 13.3], [13.3, 14.9, 13.2, 14.7],
  [14.7, 16.6, 14.5, 16.3], [16.3, 17.5, 15.9, 17.2], [17.2, 19.8, 17.0, 19.4], [19.4, 22.6, 19.1, 22.1],
]);
const VXX_POST = days("", [[22.1, 26.0, 21.5, 25.2], [25.2, 31.0, 24.0, 29.8], [29.8, 38.5, 28.9, 37.6], [37.6, 49.0, 36.0, 47.5], [47.5, 62.0, 45.0, 58.9], [58.9, 68.0, 55.0, 66.4]], true);

const TLT_PRE = days("W", [
  [150.0, 151.2, 148.8, 149.5], [149.5, 150.4, 147.9, 148.3], [148.3, 149.0, 146.2, 146.8], [146.8, 148.1, 145.9, 147.6],
  [147.6, 148.0, 144.8, 145.3], [145.3, 146.1, 143.2, 143.9], [143.9, 145.0, 142.6, 144.5], [144.5, 144.9, 141.8, 142.2],
  [142.2, 143.3, 140.9, 141.4], [141.4, 142.0, 139.2, 139.8], [139.8, 141.1, 139.0, 140.6], [140.6, 140.9, 137.8, 138.3],
]);
const TLT_POST = days("", [[138.3, 139.0, 134.9, 135.6], [135.6, 136.2, 132.1, 132.8], [132.8, 134.5, 131.9, 133.9], [133.9, 134.1, 129.5, 130.2], [130.2, 131.0, 126.8, 127.5]], true);

/** Numbers the case briefs quote; riskPremiumPortfolio.test.ts checks them against the bars. */
export const RPP_CASE_FACTS = {
  xiv: { lastClose: 108.4, weekStart: 124.5, sleevePct: 30, dropDay: -93 },
  vxx: { low: 13.3, decisionClose: 22.1, peak: 66.4, sleevePct: 20 },
  tlt: { start: 150.0, decisionClose: 138.3, end: 127.5 },
} as const;

const caseBase = {
  contextType: "news" as const,
  thinkingMode: "vol_risk_premium" as const,
  packId: "macro-news" as const,
  assetClass: "equity" as const,
  allowShort: false,
  difficulty: "intermediate" as const,
};

export const RPP_CASES: CaseStudy[] = [
  {
    ...caseBase,
    id: "case-vrp-inverse-vix-note",
    title: "An inverse-VIX note after a quiet year",
    brief:
      "SAMPLE stylized chart shaped like an inverse-VIX note (XIV-style) in early 2018. It climbed steadily all year and is 30% of your account. This week stocks slid, the VIX jumped, and the note fell from 124.50 to 108.40. Its prospectus lets the issuer close it if it loses 80% in a day. Buy more, sell, or hold?",
    newsHeadline: "Stocks slide and the VIX jumps; short-volatility products fall for a third day.",
    preOhlc: XIV_PRE,
    postOhlc: [...XIV_PRE, ...XIV_POST],
    correctActions: ["sell"],
    acceptablePartial: [],
    debrief: {
      process:
        "A product that is short VIX futures for you earns small gains in calm markets and can lose almost everything in a day. At 30% of the account the position was already too big for that risk; with volatility rising, cutting it is the process answer. Buying the dip in a short-vol product is adding to the exact risk that is going wrong.",
      whyMarketMoved:
        "On 5 February 2018 VIX futures spiked. The real XIV closed down 93% the next day and Credit Suisse announced it would terminate the note. This chart is a stylized version of that path.",
      evidence: "SAMPLE: close 108.40, then 99.00 and 7.00 (−93% in a day), 6.10. Real event: Credit Suisse acceleration notice, 6 Feb 2018.",
    },
  },
  {
    ...caseBase,
    id: "case-vrp-short-vxx-curve-inverts",
    title: "Short VXX as the VIX curve inverts",
    brief:
      "SAMPLE stylized chart shaped like VXX in late February 2020. You shorted VXX near 13.30, worth 20% of your account, when the VIX curve was in contango. Now the front-month VIX future is above the second month (backwardation) and realized volatility is above implied. VXX is up from 13.30 to 22.10. Buy (cover the short), sell, or hold?",
    newsHeadline: "Virus fears spread; VIX futures curve inverts as stocks fall.",
    preOhlc: VXX_PRE,
    postOhlc: [...VXX_PRE, ...VXX_POST],
    correctActions: ["buy"],
    acceptablePartial: [],
    debrief: {
      process:
        "Both inputs the video uses for the premium (the futures slope and implied vs realized) have flipped negative, so the short has lost its reason. Cover now and take the loss of about 13% of the account. Holding a short-vol position through backwardation is how accounts blow up; the video itself says a one-day delay in flipping hurt sharply.",
      whyMarketMoved:
        "The COVID crash: volatility kept rising for weeks. The video reports VXX rallied more than 400%; here it goes from 13.30 to 66.40.",
      evidence: "SAMPLE: decision at 22.10; peak 66.40 (+399% from 13.30). Held short at 20% of the account, that is a loss of about 80% of the whole account.",
    },
  },
  {
    ...caseBase,
    id: "case-vrp-long-bonds-rising-rates",
    title: "A big long-bond slice as rates start rising",
    brief:
      "SAMPLE stylized weekly chart shaped like a long-Treasury ETF (TLT-style) in early 2022. Your diversified mix holds it at 30%. The Fed signals several rate hikes, stocks are falling too, and the bond ETF has slid from 150.00 to 138.30, below its longer-term average. Your plan includes a trend filter that moves a weak slice to cash. Buy more, sell, or hold?",
    newsHeadline: "Fed signals faster rate hikes; stocks and long bonds fall together.",
    preOhlc: TLT_PRE,
    postOhlc: [...TLT_PRE, ...TLT_POST],
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Rising rates mechanically push long-bond prices down, and the trend filter in your plan says this slice is weak: follow it and move to cash. Holding is a partial answer: a fixed-weight portfolio would keep it, but then the stock-bond cushion is not working. Buying more is betting against the rate path the Fed just signalled.",
      whyMarketMoved: "In 2022 rates rose fast; the S&P 500 fell about 18% and long Treasuries about 30%, so diversification between them failed for the year.",
      evidence: "SAMPLE: 150.00 → 138.30 at the decision, then 127.50 five weeks later.",
    },
  },
];

// ---------------------------------------------------------------- Learn questions (RPP-)

const IDS = ["A", "B", "C", "D"] as const;
type OptId = (typeof IDS)[number];
function mc(id: string, prompt: string, at: OptId, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(IDS.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: IDS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

const [CORR_HI, CORR_ZERO, CORR_NEG] = RPP_CORR_EXAMPLE;

export const RPP_QUESTIONS: QuizQuestion[] = [
  mc("RPP-01", "The video weights SPY 35, TLT 30, GLD 20, FXE 10, DBC 5 by each asset's economic role. Why does the creator warn against picking weights because they backtest well?", "B", "Weights tuned to past data fit that history's noise and usually disappoint afterwards (overfitting)",
    ["Backtests are always wrong", "Economic roles never change", "Equal weights are illegal for ETFs"],
    "Choosing weights by role (growth, rates, inflation, currency) is a reason that should hold in future; weights chosen because they maximised a past result are fitted to that past.", "overfitting"),
  mc("RPP-02", "What is a risk premium?", "C", "Extra expected return for holding a risk others want to avoid",
    ["A guaranteed bonus paid by the exchange", "The fee an ETF charges", "The difference between bid and ask"],
    "Stocks pay an equity risk premium, long bonds a term premium, and option sellers a volatility risk premium. None is guaranteed in any given year.", "risk-premium"),
  mc("RPP-03", `SAMPLE assumptions: two assets with 16% and 15% volatility, 50/50. At correlation ${CORR_HI.rho} the mix's volatility is about ${pct(CORR_HI.vol)}. At correlation ${CORR_NEG.rho}?`, "A", `About ${pct(CORR_NEG.vol)}: lower correlation lowers portfolio volatility`,
    [`About ${pct(CORR_HI.vol)}: correlation doesn't matter`, "About 31%: volatilities add", "About 15.5%: the average"],
    `Volatility only adds fully when assets move together. At correlation 0 it is about ${pct(CORR_ZERO.vol)}, and lower still when they tend to move opposite. That is the case for mixing assets with different drivers.`, "correlation"),
  mc("RPP-04", "Why can a low-volatility, diversified mix be levered modestly, and what is the catch?", "D", "Lower volatility leaves room for more exposure, but correlations can jump together in a crisis and leverage amplifies that loss",
    ["Leverage removes risk if assets are diversified", "Brokers never call margin on ETFs", "There is no catch: leverage only scales gains"],
    "The video's combined portfolio runs about 120% exposure. If stocks and bonds fall together, as in 2022, the extra exposure makes it worse.", "portfolio-leverage"),
  mc("RPP-05", "The video says each asset has a trend filter that moves a weak slice to cash, but gives no lookbacks. A common textbook version is:", "B", "Invested when the month-end price is above its 10-month moving average, in cash otherwise",
    ["Buy whenever RSI is below 30", "Sell after any 1% down day", "Hold forever and rebalance yearly"],
    "This is Meb Faber's widely cited example, not the video's undisclosed rule. Research on time-series momentum finds trends persist across many asset classes.", "trend-filter"),
  mc("RPP-06", "What is the main cost of a trend filter?", "C", "It exits after a fall has started and re-enters after a rebound has started, so it lags and can whipsaw",
    ["It never sells", "It always misses the whole bull market", "It doubles trading costs every month"],
    "Trend rules give up the first part of every move in exchange for stepping aside in long declines. They cannot help on a one-day crash.", "trend-filter"),
  mc("RPP-07", "What is the volatility risk premium?", "A", "Implied volatility tends to sit above realized volatility, so sellers of options or VIX futures earn the gap on average",
    ["The VIX always goes up over time", "A fee paid to VIX ETF issuers", "The return of SPY minus GLD"],
    "Buyers of protection overpay on average, like insurance customers. Sellers collect it most of the time and pay out in crashes.", "volatility-risk-premium"),
  mc("RPP-08", "VIX futures are usually above spot VIX and drift toward it. Products like VXX roll the first and second month to stay about 30 days out. What does that do to a long VXX holder over time?", "D", "Steady losses from negative roll yield in contango",
    ["Steady gains from positive roll yield", "Nothing: VXX tracks the VIX exactly", "It only matters in backwardation"],
    "Selling the cheaper expiring future and buying the dearer next one loses a little each day. FINRA notes many such products have lost more than 90% since launch.", "roll-yield"),
  mc("RPP-09", "In the video's overlay, the VIX futures curve is in contango and implied volatility is well above realized. What position does it take?", "B", "Short VIX futures exposure: the premium looks positive",
    ["Long VIX futures exposure", "Flat: never trade volatility", "Buy SPY puts"],
    "Both inputs say insurance is priced richly. When the premium looks small or unclear the overlay goes flat, and when it turns negative (an inverted curve in a crash) it goes long.", "vix-term-structure"),
  mc("RPP-10", "A short VXX position is 20% of your account. VXX rallies 400%, as the video says it did in 2020. How much of the whole account is lost?", "C", `About ${pct(shortSleeveLoss(20, 400), 0)}`,
    ["20%: you can only lose what you put in", "4%", "None, if you held it long enough"],
    "A short loses the rally times the position size: 20% × 400% = 80%. Short-volatility losses can exceed the sleeve many times over, which is why sizing and exposure limits are central.", "volatility-risk-premium"),
  mc("RPP-11", "Why does the video avoid inverse volatility ETPs like SVXY or the former XIV?", "A", "They can lose nearly everything in a day; XIV fell more than 90% and was terminated in February 2018",
    ["They charge no fees", "They track the VIX exactly", "They are only sold in Europe"],
    "The video shorts VXX directly in its backtest instead, and that sleeve still drew down about 65%. Either way, short volatility needs strict size limits.", "inverse-volatility-etp"),
  mc("RPP-12", "The backtest computes its signals 30 minutes before the close and trades market-on-close. What does that avoid?", "D", "Look-ahead bias: using a closing price to decide a trade at that same close",
    ["Trading costs", "Taxes", "Overnight gaps"],
    "If a test uses the close to decide and also fills at that close, it assumes knowledge nobody had in time. Separating the two keeps the timing honest.", "look-ahead-bias"),
  mc("RPP-13", `The combined backtest goes from $100,000 to $${COMBINED.endValue.toLocaleString("en-US")} at ${pct(COMBINED.cagr, 2)} a year. About how many years does that imply?`, "B", `About ${Math.round(RPP_IMPLIED_YEARS)}`,
    ["About 5", "About 25", "About 40"],
    `(1.184)^years = 12.15 → years ≈ ${RPP_IMPLIED_YEARS}. Re-deriving a backtest's numbers is a quick way to spot inconsistencies: the ETF-only line's end value implies about ${pct(RPP_ETF_IMPLIED_CAGR)} over that span, not ${pct(ETF.cagr, 2)}.`, "cagr"),
  mc("RPP-14", "The video ends with \"You can have this too!\" ahead of its paid offering. How should you treat the 18.4% CAGR and 1.22 Sharpe?", "C", "As the creator's own backtest: useful for ideas, not evidence it will make money",
    ["As audited live results", "As a guaranteed return", "As proof the parameters are optimal"],
    "No independent track record exists for this exact portfolio. The building blocks are well researched; this combination and its undisclosed parameters are not.", "backtesting"),
  mc("RPP-15", "In 2022 the S&P 500 fell about 18% and long Treasuries about 30%. What does that show about a SPY + TLT-heavy mix?", "A", "Stocks and bonds can fall together when rates rise fast, so the cushion can fail",
    ["Bonds always rise when stocks fall", "Gold must have been the problem", "It proves diversification never works"],
    "Correlations change with the economic regime. Rising inflation and rates hurt both, which is why the mix also holds gold, currencies and commodities, and why the trend filter matters.", "diversification"),
];

// ---------------------------------------------------------------- links, Playbook credibility

export const RPP_LINKS: { label: string; to: string }[] = [
  { label: "Learn · Risk Premiums, Trend Filters & the VIX", to: "/training?group=risk-premium-portfolio&start=1" },
  { label: "Coach · Read a too-good backtest", to: "/coach/read-a-backtest" },
  { label: "Cases · Market-wide news (volatility cases)", to: "/cases?pack=macro-news" },
  { label: "Playbook · Risk-premium ETF portfolio with a VIX overlay", to: "/playbooks/etf-north-star-vrp" },
  { label: "Practice · Algorithmic trading (backtests, overfitting, look-ahead)", to: "/practice/algo-trading" },
  { label: "Glossary · Sharpe ratio", to: "/archive?tab=literacy&open=sharpe-ratio" },
  { label: "Practice · VIX trading for beginners (futures, curve, products, sizing)", to: "/practice/vix-trading" },
];

export const RPP_RELATED: { label: string; to: string }[] = [
  { label: "Practice · Risk-premium portfolio and the VIX overlay (lesson and drills)", to: "/practice/risk-premium-portfolio" },
  { label: "Learn · Risk Premiums, Trend Filters & the VIX", to: "/training?group=risk-premium-portfolio&start=1" },
  { label: "Cases · Market-wide news (inverse-VIX note, short VXX, long bonds in 2022)", to: "/cases?pack=macro-news" },
  { label: "Practice · Algorithmic trading: backtesting traps", to: "/practice/algo-trading" },
  { label: "Practice · VIX trading for beginners (how VIX futures and funds actually pay)", to: "/practice/vix-trading" },
];

export const RPP_PLAYBOOK_SOURCE = {
  url: "https://www.bridgewater.com/research-and-insights/the-all-weather-story",
  label: "Bridgewater · The All Weather Story",
  verifiedOn: "2026-10-30",
} as const;

export const RPP_CREDIBILITY: PlaybookCredibility = {
  title: "How well-tested is this?",
  summary: [
    "The exact “North Star” portfolio (these five weights, an undisclosed trend filter and an undisclosed VIX overlay) is Predicting Alpha’s own design. Its results are the creator’s own backtest, not live or audited returns, and the video ends with a pitch for their paid offering. We found no independent track record for it.",
    "Short volatility and leverage are the riskiest parts: losses can be sudden and larger than the sleeve, and inverse-volatility products have been wiped out in a day.",
    "Each building block, though, is mainstream and well researched:",
  ],
  sources: [
    {
      supports: "Weights by economic role (diversification across environments)",
      label: "Bridgewater · The All Weather Story",
      url: "https://www.bridgewater.com/research-and-insights/the-all-weather-story",
      note: "Assets react in understandable ways to the economic environment, so balancing them by those characteristics limits the impact of surprises.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Trend filter (time-series momentum)",
      label: "AQR · Time Series Momentum (Moskowitz, Ooi, Pedersen)",
      url: "https://www.aqr.com/Insights/Research/Journal-Article/Time-Series-Momentum",
      note: "An asset's own past returns predict its future returns, consistently across 58 futures and forwards in very different asset classes.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Momentum across asset classes",
      label: "AQR · Value and Momentum Everywhere (Asness, Moskowitz, Pedersen)",
      url: "https://www.aqr.com/Insights/Research/Journal-Article/Value-and-Momentum-Everywhere",
      note: "Consistent momentum (and value) return premia across eight diverse markets and asset classes.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Textbook trend rule (not the video’s)",
      label: "Meb Faber · Timing model and FAQ",
      url: "https://mebfaber.com/timing-model/",
      note: "His published timing model updates once a month and he reports broad parameter stability from about 3 to over 12 months; trend-following models have been around a long time.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Volatility risk premium",
      label: "AQR · Understanding the Volatility Risk Premium",
      url: "https://www.aqr.com/Insights/Research/White-Papers/Understanding-the-Volatility-Risk-Premium",
      note: "The VRP is compensation for providing protection against market losses, like underwriting insurance, and has historically delivered strong risk-adjusted returns.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "VIX futures, contango and roll yield",
      label: "FINRA · Regulatory Notice 17-32 (volatility-linked ETPs)",
      url: "https://www.finra.org/rules-guidance/notices/17-32",
      note: "VIX ETPs track VIX futures, not the VIX; rolling in contango creates negative roll yield, and some have lost more than 90% since launch.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "VIX futures basics",
      label: "Cboe · VIX futures",
      url: "https://www.cboe.com/tradable_products/vix/vix_futures/",
      note: "VIX futures reflect the market’s estimate of the VIX on future expiration dates.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Avoid inverse volatility ETPs",
      label: "CNBC · Credit Suisse ends XIV after its plunge (Feb 2018)",
      url: "https://www.cnbc.com/2018/02/06/the-obscure-volatility-security-thats-become-the-focus-of-this-sell-off-is-halted-after-an-80-percent-plunge.html",
      note: "XIV closed down 93% in a day and its issuer moved to liquidate it.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
    {
      supports: "Avoid inverse volatility ETPs",
      label: "SEC filing · Credit Suisse XIV acceleration and delisting notice",
      url: "https://www.sec.gov/Archives/edgar/data/1053092/000095010318002069/dp86855_ex9901.htm",
      note: "Credit Suisse confirms the event acceleration of XIV announced on 6 February 2018 and Nasdaq's plan to suspend trading.",
      role: "corroborates",
      verifiedOn: "2026-10-30",
    },
  ],
};
