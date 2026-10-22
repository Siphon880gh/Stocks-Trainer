/**
 * Gamma squeeze case (/practice/gamma-squeeze). Every number here is SIMULATED: a made-up stock ("SQZ"), a made-up
 * trading day and made-up weekly calls priced with the Black-Scholes formula, so the option path can be recomputed
 * in tests. Educational, not trading advice.
 */
import type { OHLC } from "./ohlcData";
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";

export const SQZ_LABEL = "SIMULATED";
export const SQZ_TICKER = "SQZ";
/** 5-minute bars in one regular session (9:30–16:00 ET). */
export const BARS_PER_DAY = 78;
/** Trading minutes per year used to turn minutes-to-expiry into years (252 days × 390 minutes). */
export const MINUTES_PER_YEAR = 252 * 390;
/** The weekly call the trader buys: strike 24, expiring at Friday's close. The case day is the Thursday before. */
export const CALL_STRIKE = 24;
export const BUDGET = 200;
export const ENTRY_BAR = 12;
export const EXIT_BAR = 41;
/** Key strikes drawn on the chart, with SIMULATED open interest (contracts) in the Friday weekly calls. */
export const KEY_STRIKES: { strike: number; openInterest: number }[] = [
  { strike: 22, openInterest: 9000 },
  { strike: 24, openInterest: 21000 },
  { strike: 25, openInterest: 14000 },
];

// ---------------------------------------------------------------- pricing
function normCdf(x: number): number {
  // Abramowitz–Stegun 7.1.26 erf approximation (|error| < 1.5e-7).
  const t = 1 / (1 + 0.3275911 * Math.abs(x) / Math.SQRT2);
  const y = 1 - ((((1.061405429 * t - 1.453152027) * t + 1.421413741) * t - 0.284496736) * t + 0.254829592) * t * Math.exp(-(x * x) / 2);
  return x >= 0 ? 0.5 * (1 + y) : 0.5 * (1 - y);
}
const normPdf = (x: number) => Math.exp(-(x * x) / 2) / Math.sqrt(2 * Math.PI);

/** Black-Scholes call value (no rates, no dividends: a few days to expiry). At expiry it is the intrinsic value. */
export function callValue(S: number, K: number, years: number, vol: number): number {
  if (years <= 0 || vol <= 0) return Math.max(S - K, 0);
  const sd = vol * Math.sqrt(years);
  const d1 = (Math.log(S / K) + (vol * vol * years) / 2) / sd;
  return S * normCdf(d1) - K * normCdf(d1 - sd);
}
/** How much the call's value moves per $1 in the stock (0 to 1). */
export function callDelta(S: number, K: number, years: number, vol: number): number {
  if (years <= 0 || vol <= 0) return S > K ? 1 : 0;
  const sd = vol * Math.sqrt(years);
  return normCdf((Math.log(S / K) + (vol * vol * years) / 2) / sd);
}
/** Gamma: how fast delta changes per $1 in the stock. Highest near the strike and close to expiry. */
export function callGamma(S: number, K: number, years: number, vol: number): number {
  if (years <= 0 || vol <= 0) return 0;
  const sd = vol * Math.sqrt(years);
  return normPdf((Math.log(S / K) + (vol * vol * years) / 2) / sd) / (S * sd);
}
/** Years left to Friday's close at the close of Thursday bar `bar` (day 0) or Friday bar `bar` (day 1). */
export function yearsToExpiry(bar: number, day: 0 | 1 = 0): number {
  const minutes = (BARS_PER_DAY - 1 - bar) * 5 + (day === 0 ? 390 : 0);
  return Math.max(minutes, 0) / MINUTES_PER_YEAR;
}
export const round2 = (x: number) => Math.round(x * 100) / 100;

// ---------------------------------------------------------------- SIMULATED paths
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
type Way = [bar: number, value: number];
function interp(way: Way[], i: number): number {
  for (let k = 1; k < way.length; k++) {
    const [b0, v0] = way[k - 1]!;
    const [b1, v1] = way[k]!;
    if (i <= b1) return v0 + ((v1 - v0) * (i - b0)) / (b1 - b0);
  }
  return way[way.length - 1]![1];
}

/** Thursday close targets for the squeeze day. Call chatter starts around bar 6 (10:00 ET / 7:00 PT). */
const MAIN_WAY: Way[] = [[0, 20], [5, 20.3], [12, 21.4], [18, 22.2], [24, 22.9], [30, 23.7], [36, 24.6], [41, 25.4], [44, 26.0], [47, 25.5], [55, 24.3], [65, 24.0], [77, 23.6]];
/** The counterfactual: same morning, then the call buying dries up and the move stalls and fades. */
const STALL_WAY: Way[] = [[12, 21.4], [18, 21.9], [24, 22.3], [30, 21.9], [40, 21.5], [55, 21.2], [77, 21.0]];
/** Friday for the stall path: drifts lower into the expiry close. */
const STALL_FRIDAY_CLOSE = 20.8;
/** SIMULATED implied volatility (annualised) used to price the calls. It rises with the chase and falls when it stalls. */
const MAIN_VOL: Way[] = [[0, 0.9], [12, 1.0], [30, 1.3], [41, 1.6], [47, 1.6], [77, 1.3]];
const STALL_VOL: Way[] = [[12, 1.0], [24, 1.0], [40, 0.85], [77, 0.75]];
/** SIMULATED call contracts traded per bar (all strikes). */
const MAIN_CALLS: Way[] = [[0, 300], [5, 350], [8, 2600], [12, 4200], [24, 6000], [41, 9000], [47, 5000], [60, 1500], [77, 900]];
const STALL_CALLS: Way[] = [[12, 4200], [18, 2500], [30, 900], [77, 400]];

export interface SqzBar extends OHLC {
  /** SIMULATED call contracts traded in the bar. */
  callVolume: number;
  /** SIMULATED implied volatility used to price the calls at the bar's close. */
  vol: number;
  /** Clock time at the bar's open, ET and PT. */
  et: string;
  pt: string;
}

/** Clock time at the OPEN of bar i, ET and PT (e.g. "10:30 AM ET"). */
export function barClock(i: number): { et: string; pt: string } {
  const m = 9 * 60 + 30 + i * 5;
  const f = (min: number) => {
    const h = Math.floor(min / 60);
    return `${h > 12 ? h - 12 : h}:${String(min % 60).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
  };
  return { et: `${f(m)} ET`, pt: `${f(m - 180)} PT` };
}
/** Clock time at the CLOSE of bar i: decisions are made on the closed bar. */
export const closeClock = (i: number) => barClock(i + 1);

function build(way: Way[], volWay: Way[], callWay: Way[], seed: number, from = 0, prior?: SqzBar[]): SqzBar[] {
  const r = rng(seed);
  const out: SqzBar[] = prior ? prior.slice(0, from) : [];
  for (let i = from; i < BARS_PER_DAY; i++) {
    const open = i === 0 ? 20 : out[i - 1]!.close;
    const close = round2(interp(way, i) + (i === from && prior ? 0 : (r() - 0.5) * 0.12));
    const body = Math.abs(close - open);
    const high = round2(Math.max(open, close) + 0.02 + r() * Math.max(0.06, body * 0.4));
    const low = round2(Math.min(open, close) - 0.02 - r() * Math.max(0.06, body * 0.4));
    const calls = Math.round(interp(callWay, i) * (0.85 + r() * 0.3));
    const { et, pt } = barClock(i);
    out.push({ name: `${et}`, open: round2(open), high, low, close, volume: Math.round(calls * 40 + 60000 * (0.8 + r() * 0.4)), callVolume: calls, vol: interp(volWay, i), et, pt });
  }
  return out;
}

export const SQZ_BARS: SqzBar[] = (() => {
  const b = build(MAIN_WAY, MAIN_VOL, MAIN_CALLS, 5150);
  // pin the planned entry and exit closes so the story numbers are exact
  b[ENTRY_BAR]!.close = 21.4;
  b[EXIT_BAR]!.close = 25.4;
  for (const i of [ENTRY_BAR, EXIT_BAR, ENTRY_BAR + 1, EXIT_BAR + 1]) {
    const x = b[i]!;
    if (i === ENTRY_BAR + 1 || i === EXIT_BAR + 1) x.open = b[i - 1]!.close;
    x.high = round2(Math.max(x.high, x.open, x.close));
    x.low = round2(Math.min(x.low, x.open, x.close));
  }
  return b;
})();
/** Same bars up to and including the entry bar, then the stall. */
export const STALL_BARS: SqzBar[] = build(STALL_WAY, STALL_VOL, STALL_CALLS, 7311, ENTRY_BAR + 1, SQZ_BARS);

/** Mid value of one call (per share) at each bar's close on a path. */
export function optionPath(bars: SqzBar[], strike = CALL_STRIKE): number[] {
  return bars.map((b, i) => callValue(b.close, strike, yearsToExpiry(i), b.vol));
}

// ---------------------------------------------------------------- the trade
export interface SqzTrade {
  entryPremium: number;
  contracts: number;
  cost: number;
  exitPremium: number;
  exitValue: number;
  multiple: number;
  /** Counterfactual: holding the same calls on the stall path. */
  /** Value of one call on the stall path at the planned exit time (1:00 PM ET). */
  stallExitPremium: number;
  stallThursdayClose: number;
  stallThursdayValue: number;
  stallExpiryValue: number;
}

/** A trader puts $200 into the 24-strike weekly calls at 10:35 AM ET and sells at 1:00 PM ET the same afternoon. */
export function sqzTrade(): SqzTrade {
  const entryPremium = round2(callValue(SQZ_BARS[ENTRY_BAR]!.close, CALL_STRIKE, yearsToExpiry(ENTRY_BAR), SQZ_BARS[ENTRY_BAR]!.vol));
  const contracts = Math.floor(BUDGET / (entryPremium * 100));
  const cost = round2(contracts * entryPremium * 100);
  const exitPremium = round2(callValue(SQZ_BARS[EXIT_BAR]!.close, CALL_STRIKE, yearsToExpiry(EXIT_BAR), SQZ_BARS[EXIT_BAR]!.vol));
  const exitValue = round2(contracts * exitPremium * 100);
  const last = STALL_BARS[BARS_PER_DAY - 1]!;
  const stallThursdayClose = round2(callValue(last.close, CALL_STRIKE, yearsToExpiry(BARS_PER_DAY - 1), last.vol));
  return {
    entryPremium,
    contracts,
    cost,
    exitPremium,
    exitValue,
    multiple: Math.round((exitValue / cost) * 10) / 10,
    stallExitPremium: round2(callValue(STALL_BARS[EXIT_BAR]!.close, CALL_STRIKE, yearsToExpiry(EXIT_BAR), STALL_BARS[EXIT_BAR]!.vol)),
    stallThursdayClose,
    stallThursdayValue: round2(contracts * stallThursdayClose * 100),
    stallExpiryValue: round2(contracts * Math.max(STALL_FRIDAY_CLOSE - CALL_STRIKE, 0) * 100),
  };
}
export const STALL_EXPIRY_PRICE = STALL_FRIDAY_CLOSE;

/**
 * Shares a dealer would hold to hedge the 24-strike open interest IF it were net short all of those calls
 * (delta × contracts × 100). Dealers are not always net short, so this is the "if" case, not a forecast.
 */
export function hedgeShares(bar: number, bars: SqzBar[] = SQZ_BARS): number {
  const oi = KEY_STRIKES.find((k) => k.strike === CALL_STRIKE)!.openInterest;
  const b = bars[bar]!;
  return Math.round(callDelta(b.close, CALL_STRIKE, yearsToExpiry(bar), b.vol) * oi * 100);
}

/** Average call volume per bar over the first 30 minutes vs the bar: the "unusual options activity" multiple. */
export function callVolumeMultiple(bar: number): number {
  const base = SQZ_BARS.slice(0, 6).reduce((s, b) => s + b.callVolume, 0) / 6;
  return Math.round((SQZ_BARS[bar]!.callVolume / base) * 10) / 10;
}

// ---------------------------------------------------------------- survivorship (SIMULATED)
/**
 * 100 made-up traders each put $200 into a different chatter stock's weekly out-of-the-money calls. This is an
 * illustration of how the stories you hear are filtered, not a measured win rate.
 */
export const SURVIVOR_TRADES: number[] = (() => {
  const r = rng(424242);
  return Array.from({ length: 100 }, (_, i) => {
    if (i % 50 === 7) return Math.round(200 * (12 + r() * 15)); // 2 big wins
    if (i % 10 === 3) return Math.round(200 * (1.2 + r() * 1.5)); // 10 small wins
    return Math.round(200 * r() * 0.3); // the rest: most or all of the premium lost
  });
})();
export function survivorStats() {
  const cost = SURVIVOR_TRADES.length * BUDGET;
  const back = SURVIVOR_TRADES.reduce((s, v) => s + v, 0);
  const bigWins = SURVIVOR_TRADES.filter((v) => v >= BUDGET * 10).length;
  const losers = SURVIVOR_TRADES.filter((v) => v < BUDGET).length;
  return { cost, back, net: back - cost, bigWins, losers };
}

// ---------------------------------------------------------------- decisions, grade and points
export type SqzGrade = "correct" | "partial" | "incorrect";
export interface SqzChoice {
  id: string;
  label: string;
  grade: SqzGrade;
  feedback: string;
}
export interface SqzDecision {
  id: "enter" | "size" | "exit";
  bar: number;
  prompt: string;
  choices: SqzChoice[];
}
export const STEP_POINTS: Record<SqzGrade, number> = { correct: 10, partial: 5, incorrect: 1 };

export const SQZ_DECISIONS: SqzDecision[] = [
  {
    id: "enter",
    bar: ENTRY_BAR,
    prompt:
      "10:35 AM ET (7:35 AM PT). SQZ is up 7% on no company news. Call volume is about ten times the first half hour's pace, mostly in Friday's 24 and 25 strikes. What do you do?",
    choices: [
      { id: "chase", label: "Buy calls now: the flow says it is going higher", grade: "incorrect", feedback: "Call volume tells you people are buying calls, not that the stock must rise. You have no stop and no exit yet, so this is a chase." },
      { id: "plan", label: "Only enter with a written plan: a small amount you can lose in full, an exit price, and a time stop for today", grade: "correct", feedback: "A lottery-style call can go to zero, so the plan is the risk control: size, exit and a time limit decided before the click." },
      { id: "pass", label: "Pass: I cannot explain why it is moving", grade: "correct", feedback: "Passing costs nothing. With no news and no edge you can explain, sitting out is a sound trade." },
    ],
  },
  {
    id: "size",
    bar: ENTRY_BAR,
    prompt: "If you take it, how much goes in?",
    choices: [
      { id: "all", label: "Most of the account: moves like this are rare", grade: "incorrect", feedback: "Weekly out-of-the-money calls often expire worthless. One bad week would wipe out the account." },
      { id: "small", label: "A small fixed amount you can lose 100% of (here $200, about 1% of a $20,000 account)", grade: "correct", feedback: "A long call cannot lose more than the premium, so size by assuming the premium goes to zero." },
      { id: "margin", label: "Borrow on margin to buy more contracts", grade: "incorrect", feedback: "Borrowing to buy a short-dated option adds debt to a position that can go to zero in a day." },
    ],
  },
  {
    id: "exit",
    bar: EXIT_BAR,
    prompt: "1:00 PM ET (10:00 AM PT). SQZ is 25.40, above the 24 strike. The calls are worth many times what you paid, and call volume is still heavy. What now?",
    choices: [
      { id: "hold", label: "Hold to Friday for more: the squeeze has to keep going", grade: "incorrect", feedback: "Nothing has to keep going. When call buying fades, the hedging that helped the move can unwind, and a Friday call has almost no time left to recover." },
      { id: "sell", label: "Sell all or most now, as planned, and let any rest ride with a stop", grade: "correct", feedback: "Taking a planned exit into strength locks the gain. The rest is optional and capped by a stop." },
      { id: "watch", label: "Keep watching and decide later", grade: "partial", feedback: "Watching without an exit is how big gains turn back into small ones. Decide the exit while you are calm." },
    ],
  },
];

export function gradeRun(answers: Partial<Record<SqzDecision["id"], string>>): { points: number; max: number; grade: SqzGrade; correct: number } {
  let points = 0;
  let correct = 0;
  for (const d of SQZ_DECISIONS) {
    const c = d.choices.find((x) => x.id === answers[d.id]);
    if (!c) continue;
    points += STEP_POINTS[c.grade];
    if (c.grade === "correct") correct++;
  }
  const grade: SqzGrade = correct === SQZ_DECISIONS.length ? "correct" : correct >= 1 ? "partial" : "incorrect";
  return { points, max: SQZ_DECISIONS.length * STEP_POINTS.correct, grade, correct };
}

// ---------------------------------------------------------------- copy shared by the page, the quiz and the README
export const SQZ_TLDR =
  "When many traders buy calls, the dealers who sold them often hedge by buying the stock. As the price rises toward crowded strikes, each call behaves more like stock (its delta rises; gamma is how fast that happens), so a dealer who is net short those calls has to buy more shares to stay hedged. That buying can push the price higher still, and the loop can feed itself. Hedging is a risk choice, and dealers are not always net short calls, so the loop is not automatic. It runs all day, and it speeds up near crowded strikes, where gamma is highest close to expiry. When the call buying stops, the same mechanics can run in reverse.";

// ---------------------------------------------------------------- glossary
export const SQZ_TERMS: LiteracyTerm[] = [
  {
    id: "gamma",
    name: "Gamma",
    category: "position",
    summary: "How fast an option's delta changes when the stock moves $1.",
    detail:
      "Delta is how much an option's price moves per $1 in the stock; gamma is the rate of change of delta. Gamma is highest for at-the-money options and rises as expiry gets close, so a short-dated option near its strike can swing from behaving like almost nothing to behaving like stock. See the gamma squeeze case (SIMULATED). Educational, not advice.",
  },
  {
    id: "delta-hedging",
    name: "Delta hedging",
    category: "process",
    summary: "Buying or selling the stock to offset an options position's sensitivity to price.",
    detail:
      "A dealer that sold a call with a delta of 0.30 might hold about 30 shares per contract so small price moves roughly cancel out. As delta changes, the hedge is adjusted, which means buying as the stock rises if the dealer is short calls. Dealers choose how and how much to hedge, and their books often mix long and short options. Educational, not advice.",
  },
  {
    id: "gamma-squeeze",
    name: "Gamma squeeze",
    category: "markets",
    summary: "A rally fed by dealers buying stock to hedge calls they sold, as heavy call buying and a rising price feed each other.",
    detail:
      "Heavy call buying, a rising stock and dealer hedging can push dealers to buy more shares the higher the price goes, especially near crowded strikes close to expiry. It is not automatic: it needs dealers to be net short those calls and steady new call buying. The SEC staff's October 2021 report on January 2021 found no evidence of a gamma squeeze in GameStop: retail options volume was mostly put buying, and market makers were buying calls, not writing them. Practice the SIMULATED case. Educational, not advice.",
  },
  {
    id: "short-squeeze",
    name: "Short squeeze",
    category: "markets",
    summary: "A rise that forces short sellers to buy back shares, and their buying pushes the price higher.",
    detail:
      "Short sellers lose as price rises and may face margin calls, so some buy to cover, which adds buying pressure. A gamma squeeze comes from dealer hedging instead; the two can happen together and feed each other. In GameStop in January 2021, SEC staff found short covering contributed during some periods but was a small share of buying: positive sentiment, not covering, sustained the weeks-long rise. Educational, not advice.",
  },
  {
    id: "short-interest",
    name: "Short interest",
    category: "markets",
    summary: "The number of a stock's shares sold short and not yet bought back.",
    detail:
      "FINRA Rule 4560 requires broker-dealers to report short positions twice a month, and FINRA publishes the totals, so the figure is a snapshot that can be about two weeks old. It is often quoted as a percent of shares outstanding or of the float, and it can exceed 100% because a borrowed share can be lent again. Educational, not advice.",
  },
  {
    id: "days-to-cover",
    name: "Days to cover",
    category: "markets",
    summary: "Short interest divided by average daily volume: how many days of normal trading it would take shorts to buy back.",
    detail:
      "Also called the short interest ratio. One million shares short with 100,000 shares a day of average volume is 10 days to cover. A high figure means a squeeze is possible, not that one is coming. Educational, not advice.",
  },
  {
    id: "open-interest",
    name: "Open interest",
    category: "markets",
    summary: "The number of option or futures contracts that are open and not yet closed, exercised or expired.",
    detail:
      "Volume counts contracts traded today; open interest counts contracts still outstanding. Large open interest at one strike shows where positions are crowded, but not who is long or short. It is not a price forecast. Educational, not advice.",
  },
  {
    id: "unusual-options-activity",
    name: "Unusual options activity",
    category: "markets",
    summary: "Options volume far above a contract's normal pace, often compared with its open interest.",
    detail:
      "Scanners flag strikes where today's volume is many times normal or larger than the open interest. It shows that someone is trading heavily, not why, and not whether they are buying or selling, opening or closing, or hedging something else. Treat it as a question, not a signal. Educational, not advice.",
  },
  {
    id: "survivorship-bias",
    name: "Survivorship bias",
    category: "process",
    summary: "Judging by the winners you hear about while the losers stay invisible.",
    detail:
      "Big option wins get posted and retold; the many tickets that expired worthless do not. Looking only at survivors makes a strategy look better than it is. Ask how many tried, not just who won. Educational, not advice.",
  },
];

// ---------------------------------------------------------------- Learn questions
type Letter = "A" | "B" | "C" | "D";
const LETTERS: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const uniq = [...new Set(wrong.filter((w) => w !== right))].slice(0, 3);
  if (uniq.length < 3) throw new Error(`squeeze quiz ${id}: needs 3 distinct wrong options`);
  const ordered = [...uniq];
  ordered.splice(LETTERS.indexOf(at), 0, right);
  const options: QuizOption[] = ordered.map((label, i) => ({ id: LETTERS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export function squeezeQuestions(): QuizQuestion[] {
  const t = sqzTrade();
  const s = survivorStats();
  const usd = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;
  return [
    mc("SQ-01", "Gamma measures…", "B", "How fast an option's delta changes when the stock moves $1",
      ["How much an option loses each day", "How many contracts are open", "The stock's short interest"],
      "Delta is the option's sensitivity to the stock; gamma is the rate of change of delta.", "gamma"),
    mc("SQ-02", "When is a call's gamma highest?", "C", "Near the strike and close to expiry",
      ["Far out of the money with a year left", "Deep in the money", "It is the same for every strike"],
      "At-the-money, short-dated options have the most gamma, which is why squeezes cluster around crowded weekly strikes.", "gamma"),
    mc("SQ-03", "A dealer sold calls and hedges by holding stock. The stock rises. If the dealer is net short those calls, it usually…", "A", "Buys more shares to stay hedged",
      ["Sells shares", "Does nothing: hedges never change", "Must buy the calls back"],
      "As the calls' delta rises, a short-call hedge needs more shares. That buying can push the price higher.", "delta-hedging"),
    mc("SQ-04", "Why is a gamma squeeze not automatic after heavy call buying?", "D", "Dealers choose how to hedge and are not always net short calls; the loop also needs call buying to continue",
      ["Because options cannot affect stock prices", "Because exchanges ban hedging", "Because calls always expire worthless"],
      "Dealer books mix long and short options. If they are long calls or flat, hedging can damp moves instead.", "gamma-squeeze"),
    mc("SQ-05", "How do a short squeeze and a gamma squeeze differ?", "B", "Short sellers buying to cover vs dealers buying to hedge calls they sold; the two can feed each other",
      ["They are the same thing", "A short squeeze only happens in options", "A gamma squeeze needs short sellers to cover"],
      "Different buyers, same direction. A rising price can trigger both, and each one's buying adds fuel to the other.", "short-squeeze"),
    mc("SQ-06", "What did the SEC staff's October 2021 report conclude about GameStop in January 2021?", "C", "It found no evidence of a gamma squeeze, and positive sentiment, not short covering, sustained the weeks-long rise",
      ["It proved a gamma squeeze drove the whole move", "It found short covering was most of the buying", "It said options had no trading that month"],
      "Staff found retail options volume was mostly put buying and that market makers were buying calls, not writing them. Short covering contributed during some periods but was a small share of buying.", "gamma-squeeze"),
    mc("SQ-07", "1,000,000 shares are short and average daily volume is 250,000 shares. Days to cover is…", "A", "4",
      ["0.25", "25", "250"],
      "Days to cover = short interest ÷ average daily volume = 1,000,000 ÷ 250,000 = 4.", "days-to-cover"),
    mc("SQ-08", "Open interest at a strike tells you…", "D", "How many contracts are still open there, not who is long or short",
      ["Which way the stock will move", "How many contracts traded today", "That dealers are short every one of them"],
      "Open interest shows crowding, not direction or who holds which side.", "open-interest"),
    mc("SQ-09", "A scanner flags call volume 10× normal. The best first read is…", "B", "Someone is trading heavily; I don't yet know if they are buying, selling or hedging",
      ["Insiders know something: buy", "The stock must squeeze", "Dealers are definitely short"],
      "Unusual activity is a question to investigate, not a signal.", "unusual-options-activity"),
    mc("SQ-10", `In the SIMULATED case, ${usd(t.cost)} bought ${t.contracts} calls at $${t.entryPremium.toFixed(2)}. Each contract covers 100 shares. What was the cost per contract?`, "C", `$${(t.entryPremium * 100).toFixed(2)}`,
      [`$${t.entryPremium.toFixed(2)}`, `$${(t.entryPremium * 10).toFixed(2)}`, `$${(t.entryPremium * 1000).toFixed(2)}`],
      "Option premiums are quoted per share; one contract is 100 shares.", "gamma-squeeze"),
    mc("SQ-11", `In the SIMULATED stall path the stock closes Friday at ${STALL_FRIDAY_CLOSE.toFixed(2)}, below the 24 strike. What are the calls worth at expiry?`, "A", "$0: they expire worthless",
      ["About what was paid", "$0.24 each", "They turn into short stock"],
      "A call below its strike at expiry has no intrinsic value. The whole premium is lost.", "gamma"),
    mc("SQ-12", `In the made-up set of 100 traders, ${s.bigWins} turned $200 into $2,400 or more and ${s.losers} lost money. What does this show?`, "D", "Survivorship bias: the big wins get told, the many losses stay invisible",
      ["Everyone wins eventually", "Weekly calls are a reliable strategy", "Only the losers made mistakes"],
      `Altogether the 100 tickets cost ${usd(s.cost)} and returned ${usd(s.back)}, a net ${s.net < 0 ? "loss" : "gain"} of ${usd(Math.abs(s.net))}. The numbers are invented to show the filter, not a measured rate.`, "survivorship-bias"),
    mc("SQ-13", "Which sizing rule fits a weekly out-of-the-money call?", "B", "Size as if the premium goes to zero: a small amount you can lose in full",
      ["Size by the best case", "Use margin to buy more", "Put in enough to make the trade 'worth it'"],
      "The most a long call can lose is the premium, and short-dated ones often lose all of it.", "survivorship-bias"),
    mc("SQ-14", "The squeeze has paid you many times your cost and call buying is fading. The textbook move is…", "C", "Take the planned exit; let any small remainder ride with a stop",
      ["Hold to expiry: squeezes always finish higher", "Buy more calls with the profits", "Remove the stop to give it room"],
      "When call buying fades, dealer hedges can unwind and a near-expiry call has little time to recover.", "gamma-squeeze"),
  ];
}
