/**
 * BA6: paper-trading challenges. SIMULATED — virtual money on SAMPLE tapes; scores are practice scores only.
 *
 * Scoring (pure, documented): discipline points (DISCIPLINE_MAX = 60, split evenly across the rules held)
 * + result points (RESULT_MAX = 40, split evenly across the goals met). Discipline is 60% of the maximum, so
 * following the plan always outweighs the P&L. A challenge is passed when every rule held and ≥ 1 goal was met.
 * Every rule breach is reported with the bar index where it happened.
 */
import type { AccountState, OrderSpec, OrderType, PaperSessionLog } from "./paper/types";
import { replay, sessionCancel, sessionPlace } from "./paper/session";
import { getTape, type Tape } from "./paper/tapes";
import { maxDrawdown, roundTrips } from "./paper/stats";
import { equity } from "./paper/account";
import { dayKey, daysBetween } from "./rewards/streak";

export type ChallengeTheme = "order-mechanics" | "trailing-stops" | "risk" | "patience" | "earnings-gap";

export const THEME_LABELS: Record<ChallengeTheme, string> = {
  "order-mechanics": "Order mechanics",
  "trailing-stops": "Trailing stops",
  risk: "Risk control",
  patience: "Patience",
  "earnings-gap": "Earnings gaps",
};

export type Rule =
  | { kind: "max-position-pct"; pct: number }
  | { kind: "stop-within"; bars: number }
  | { kind: "max-drawdown"; pct: number }
  | { kind: "no-averaging-down" }
  | { kind: "min-trades"; n: number }
  | { kind: "max-trades"; n: number };

export type Goal =
  | { kind: "return-pct"; pct: number }
  | { kind: "loss-contained"; pct: number }
  | { kind: "limit-below-market" }
  | { kind: "trailing-exit" }
  | { kind: "stop-exit" }
  | { kind: "buy-at-or-below"; price: number }
  | { kind: "buy-stop-entry" }
  | { kind: "flat-at-end" };

export interface Challenge {
  id: string;
  title: string;
  theme: ChallengeTheme;
  tapeId: string;
  startingCash: number;
  allowedOrderTypes: OrderType[];
  /** First visible bar; the challenge ends after `bars` more bars. */
  startBar: number;
  bars: number;
  rules: Rule[];
  goals: Goal[];
  intro: string;
  debrief: string;
  /** Glossary ids the intro relies on. */
  terms: string[];
}

export const DISCIPLINE_MAX = 60;
export const RESULT_MAX = 40;
export const SCORE_MAX = DISCIPLINE_MAX + RESULT_MAX;

const ALL: OrderType[] = ["market", "limit", "stop", "stop-limit", "trailing-stop"];
const CASH = 1_000_000;

export const CHALLENGES: Challenge[] = [
  {
    id: "limit-below-market", title: "Buy below the market", theme: "order-mechanics", tapeId: "range", startingCash: CASH, allowedOrderTypes: ["market", "limit", "stop"], startBar: 10, bars: 50,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "max-position-pct", pct: 0.4 }, { kind: "stop-within", bars: 1 }],
    goals: [{ kind: "limit-below-market" }, { kind: "return-pct", pct: 0.5 }],
    intro: "This SAMPLE stock bounces in a range. Place a buy limit below the last close and wait for the price to come to you. Once it fills, add a sell stop within one bar.",
    debrief: "A buy limit only fills at your price or better, so you never chase. The cost: if the price never dips to your limit, you get no trade at all.",
    terms: ["limit-order", "stop-order"],
  },
  {
    id: "protect-with-a-stop", title: "Protect every entry", theme: "order-mechanics", tapeId: "trend-up", startingCash: CASH, allowedOrderTypes: ALL, startBar: 10, bars: 60,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "stop-within", bars: 0 }, { kind: "max-position-pct", pct: 0.5 }],
    goals: [{ kind: "return-pct", pct: 1 }, { kind: "flat-at-end" }],
    intro: "Buy into this SAMPLE uptrend, and place a protective sell stop on the same bar your entry fills. Then plan an exit: a sell limit at a target, or a stop you raise.",
    debrief: "The stop decides your worst case before the trade can hurt you. Placing it right after the fill means a sudden drop never catches you without a plan.",
    terms: ["stop-order", "position-sizing"],
  },
  {
    id: "ride-the-trend", title: "Ride the trend with a trailing stop", theme: "trailing-stops", tapeId: "trend-up", startingCash: CASH, allowedOrderTypes: ["market", "limit", "trailing-stop"], startBar: 10, bars: 69,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "stop-within", bars: 1 }, { kind: "max-position-pct", pct: 0.6 }],
    goals: [{ kind: "trailing-exit" }, { kind: "return-pct", pct: 2 }],
    intro: "Buy this SAMPLE uptrend and protect it with a sell trailing stop. The stop rises as new highs print and never moves down, so the trend decides when you leave.",
    debrief: "A trailing stop gives back a fixed amount from the peak. Too tight and normal pullbacks stop you out; too wide and you give back more of the gain.",
    terms: ["stop-order"],
  },
  {
    id: "grind-trail", title: "Trail a slow climb", theme: "trailing-stops", tapeId: "slow-grind", startingCash: CASH, allowedOrderTypes: ["market", "limit", "trailing-stop"], startBar: 10, bars: 69,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "stop-within", bars: 1 }, { kind: "max-drawdown", pct: 0.03 }],
    goals: [{ kind: "trailing-exit" }, { kind: "return-pct", pct: 1 }],
    intro: "This SAMPLE stock climbs slowly with small swings. Size the trade and choose a trail that fits how little it moves day to day.",
    debrief: "Quiet stocks allow tighter trails; a trail wider than the stock ever pulls back may never exit, and a trail tighter than its normal noise exits too early.",
    terms: ["stop-order", "drawdown"],
  },
  {
    id: "drawdown-cap", title: "Keep the drawdown small", theme: "risk", tapeId: "choppy", startingCash: CASH, allowedOrderTypes: ALL, startBar: 10, bars: 60,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "max-drawdown", pct: 0.02 }, { kind: "stop-within", bars: 1 }],
    goals: [{ kind: "loss-contained", pct: 1 }, { kind: "flat-at-end" }],
    intro: "This SAMPLE stock swings hard with no direction. Trade it, but never let the account fall more than 2% from its high. Size small and use stops.",
    debrief: "Drawdown is the fall from your account's peak. In choppy markets small size and stops keep it shallow; big size turns normal swings into deep holes.",
    terms: ["drawdown", "position-sizing"],
  },
  {
    id: "no-averaging-down", title: "Don't average down", theme: "risk", tapeId: "trend-down", startingCash: CASH, allowedOrderTypes: ALL, startBar: 10, bars: 60,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "no-averaging-down" }, { kind: "stop-within", bars: 1 }, { kind: "max-position-pct", pct: 0.3 }],
    goals: [{ kind: "loss-contained", pct: 1 }, { kind: "stop-exit" }],
    intro: "This SAMPLE stock keeps making lower lows. If you buy, place a stop, and do not buy more below your average cost to \"get a better price\".",
    debrief: "Adding to a loser in a downtrend grows the position exactly when the evidence says you are wrong. A stop that takes a small loss is the plan working.",
    terms: ["cost-basis", "stop-order"],
  },
  {
    id: "wait-for-support", title: "Wait for support", theme: "patience", tapeId: "range", startingCash: CASH, allowedOrderTypes: ["limit", "stop", "market"], startBar: 10, bars: 60,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "max-trades", n: 2 }, { kind: "stop-within", bars: 1 }],
    goals: [{ kind: "buy-at-or-below", price: 4200 }, { kind: "return-pct", pct: 0.5 }],
    intro: "Buy only at $42.00 or lower, near the bottom of this SAMPLE range. A GTC buy limit waits for you. At most two trades.",
    debrief: "Patience means letting the price come to your level. Fewer, better-placed trades beat many trades in the middle of a range.",
    terms: ["limit-order", "good-til-canceled"],
  },
  {
    id: "breakout-buy-stop", title: "Buy the breakout with a stop order", theme: "patience", tapeId: "gap-up", startingCash: CASH, allowedOrderTypes: ["market", "limit", "stop"], startBar: 10, bars: 59,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "stop-within", bars: 1 }, { kind: "max-position-pct", pct: 0.5 }],
    goals: [{ kind: "buy-stop-entry" }, { kind: "return-pct", pct: 1 }],
    intro: "This SAMPLE stock drifts quietly. Place a GTC buy stop above the recent highs so you only buy if it breaks out, then protect the position.",
    debrief: "A buy stop fills only after the price rises to it. On a gap it fills at the open, above your stop price, so a breakout can cost more than planned.",
    terms: ["stop-order", "gap-risk"],
  },
  {
    id: "gap-through-stop", title: "A stop on a gap down", theme: "earnings-gap", tapeId: "gap-down", startingCash: CASH, allowedOrderTypes: ["market", "limit", "stop", "stop-limit"], startBar: 30, bars: 30,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "stop-within", bars: 0 }, { kind: "max-position-pct", pct: 0.3 }],
    goals: [{ kind: "stop-exit" }, { kind: "loss-contained", pct: 3 }],
    intro: "Hold this SAMPLE stock into news with a protective stop and moderate size. Watch where the stop actually fills if the price gaps.",
    debrief: "When the price opens below your stop, the stop becomes a market order and fills at the open, below the stop price. Size is what keeps a gap survivable.",
    terms: ["gap-risk", "stop-order", "slippage"],
  },
  {
    id: "earnings-small-size", title: "Hold earnings with small size", theme: "earnings-gap", tapeId: "earnings-jump", startingCash: CASH, allowedOrderTypes: ALL, startBar: 10, bars: 59,
    rules: [{ kind: "min-trades", n: 1 }, { kind: "stop-within", bars: 0 }, { kind: "max-position-pct", pct: 0.2 }],
    goals: [{ kind: "return-pct", pct: 0.5 }],
    intro: "This SAMPLE stock reports on bar 35. Holding through the report is a bet on the gap, so keep the position at 20% of the account or less and set a stop.",
    debrief: "An earnings gap can go either way. Small size means the result matters less than the process, whichever way it gaps.",
    terms: ["gap-risk", "position-sizing"],
  },
];

export const getChallenge = (id: string) => CHALLENGES.find((c) => c.id === id);
export const endBar = (c: Challenge) => c.startBar + c.bars;

export interface Breach {
  rule: Rule["kind"] | "order-type";
  bar: number;
  message: string;
}

export interface ChallengeScore {
  discipline: number;
  result: number;
  score: number;
  max: number;
  passed: boolean;
  breaches: Breach[];
  rulesHeld: Rule["kind"][];
  goalsMet: Goal["kind"][];
  returnPct: number;
}

const PROTECTIVE = new Set<OrderType>(["stop", "stop-limit", "trailing-stop"]);
const pct = (x: number) => `${(x * 100).toFixed(0)}%`;

function checkRule(rule: Rule, s: AccountState, c: Challenge): Breach | null {
  const trips = roundTrips(s);
  const atBar = (bar: number) => s.equityCurve.find((p) => p.bar === bar)?.equity ?? equity(s);
  switch (rule.kind) {
    case "max-position-pct": {
      const held: Record<string, number> = {};
      for (const f of s.fills) {
        held[f.symbol] = (held[f.symbol] ?? 0) + (f.side === "buy" ? f.qty : -f.qty);
        if (f.side === "buy" && (held[f.symbol]! * f.price) / atBar(f.bar) > rule.pct)
          return { rule: rule.kind, bar: f.bar, message: `Bar ${f.bar}: the position grew past ${pct(rule.pct)} of the account.` };
      }
      return null;
    }
    case "stop-within": {
      for (const t of trips) {
        const deadline = t.entryBar + rule.bars;
        if (t.closed && t.exitBar! <= deadline) continue;
        const ok = s.orders.some((o) => o.symbol === t.symbol && o.side === "sell" && PROTECTIVE.has(o.type) && o.status !== "rejected" && o.placedAtBar >= t.entryBar && o.placedAtBar <= deadline);
        if (!ok && s.bar >= deadline) return { rule: rule.kind, bar: deadline, message: `Bar ${deadline}: no protective stop within ${rule.bars} bar(s) of the entry on bar ${t.entryBar}.` };
      }
      return null;
    }
    case "max-drawdown": {
      let peak = -Infinity;
      for (const p of s.equityCurve) {
        peak = Math.max(peak, p.equity);
        if (peak > 0 && (peak - p.equity) / peak > rule.pct) return { rule: rule.kind, bar: p.bar, message: `Bar ${p.bar}: the account fell more than ${pct(rule.pct)} from its high.` };
      }
      return null;
    }
    case "no-averaging-down": {
      const pos: Record<string, { qty: number; basis: number }> = {};
      for (const f of s.fills) {
        const p = (pos[f.symbol] ??= { qty: 0, basis: 0 });
        if (f.side === "buy") {
          if (p.qty > 0 && f.price < p.basis / p.qty) return { rule: rule.kind, bar: f.bar, message: `Bar ${f.bar}: bought more below your average cost (averaging down).` };
          p.qty += f.qty;
          p.basis += f.qty * f.price;
        } else {
          p.basis = p.qty === f.qty ? 0 : Math.round((p.basis * (p.qty - f.qty)) / p.qty);
          p.qty -= f.qty;
        }
      }
      return null;
    }
    case "min-trades":
      return trips.length >= rule.n ? null : { rule: rule.kind, bar: s.bar, message: `Fewer than ${rule.n} trade(s) were made.` };
    case "max-trades":
      return trips.length <= rule.n ? null : { rule: rule.kind, bar: trips[rule.n]!.entryBar, message: `Bar ${trips[rule.n]!.entryBar}: more than ${rule.n} trades.` };
  }
}

function goalMet(goal: Goal, s: AccountState, tape: Tape, returnPct: number): boolean {
  const traded = s.fills.length > 0;
  switch (goal.kind) {
    case "return-pct":
      return returnPct >= goal.pct;
    case "loss-contained":
      return traded && returnPct >= -goal.pct;
    case "limit-below-market":
      return s.orders.some((o) => o.side === "buy" && o.type === "limit" && o.status === "filled" && o.limitPrice! < tape.bars[o.placedAtBar]!.close);
    case "trailing-exit":
      return s.orders.some((o) => o.type === "trailing-stop" && o.status === "filled");
    case "stop-exit":
      return s.orders.some((o) => o.side === "sell" && PROTECTIVE.has(o.type) && o.status === "filled");
    case "buy-at-or-below":
      return s.fills.some((f) => f.side === "buy" && f.price <= goal.price);
    case "buy-stop-entry":
      return s.orders.some((o) => o.side === "buy" && o.type === "stop" && o.status === "filled");
    case "flat-at-end":
      return traded && Object.keys(s.positions).length === 0;
  }
}

/** Disallowed order types are blocked in the UI; scoring still treats one as a breach. */
function typeBreach(s: AccountState, c: Challenge): Breach | null {
  const o = s.orders.find((x) => !c.allowedOrderTypes.includes(x.type));
  return o ? { rule: "order-type", bar: o.placedAtBar, message: `Bar ${o.placedAtBar}: ${o.type} orders are not part of this challenge.` } : null;
}

export function scoreState(c: Challenge, s: AccountState): ChallengeScore {
  const tape = getTape(c.tapeId)!;
  const breaches: Breach[] = [];
  const rulesHeld: Rule["kind"][] = [];
  for (const r of c.rules) {
    const b = checkRule(r, s, c);
    if (b) breaches.push(b);
    else rulesHeld.push(r.kind);
  }
  const tb = typeBreach(s, c);
  if (tb) breaches.push(tb);
  const returnPct = ((equity(s) - s.startingCash) / s.startingCash) * 100;
  const goalsMet = c.goals.filter((g) => goalMet(g, s, tape, returnPct)).map((g) => g.kind);
  const discipline = tb ? 0 : Math.round((DISCIPLINE_MAX * rulesHeld.length) / c.rules.length);
  const result = Math.round((RESULT_MAX * goalsMet.length) / c.goals.length);
  return { discipline, result, score: discipline + result, max: SCORE_MAX, passed: breaches.length === 0 && goalsMet.length > 0, breaches, rulesHeld, goalsMet, returnPct };
}

/** Score a session log: replays it to the challenge's end bar (or the log's bar, if earlier). */
export function scoreChallenge(c: Challenge, log: PaperSessionLog): ChallengeScore {
  return scoreState(c, replay({ ...log, bar: Math.min(log.bar, endBar(c)) }));
}

// ---------------------------------------------------------------------------------------------------------
// Scripted plays (reference / reckless) — used by tests and to generate the fictional benchmark entries.

export interface PlayContext {
  state: AccountState;
  bar: number;
  tape: Tape;
  held: number;
  last: number;
}
export type PlayAction = OrderSpec | { cancel: string };
export type Policy = (ctx: PlayContext) => PlayAction[];

export function newChallengeLog(c: Challenge): PaperSessionLog {
  return { tapeId: c.tapeId, startingCash: c.startingCash, bar: c.startBar, actions: [] };
}

/** Runs a policy bar by bar through the challenge window and returns the session log. */
export function play(c: Challenge, policy: Policy): PaperSessionLog {
  const tape = getTape(c.tapeId)!;
  let log = newChallengeLog(c);
  for (let b = c.startBar; b <= endBar(c); b++) {
    log = { ...log, bar: b };
    const state = replay(log);
    for (const a of policy({ state, bar: b, tape, held: state.positions[tape.symbol]?.qty ?? 0, last: tape.bars[b]!.close })) {
      log = "cancel" in a ? sessionCancel(log, a.cancel) : sessionPlace(log, a).log;
    }
  }
  return log;
}

interface PlanSpec {
  /** Entry order fields (type, prices); placed on the first bar of the window unless `at` is set. */
  entry: Partial<OrderSpec>;
  at?: number;
  /** Share of the account to buy, at the last close. */
  size: number;
  stop?: { below: number } | { trailPercent: number } | { price: number };
  target?: number;
  /** Exit at market on this bar if still holding. */
  exitAt?: number;
  /** Add to the position at market on this bar (reckless averaging). */
  addAt?: number;
}

/** A simple "plan" policy: one entry, then a protective stop (and target) right after the fill. */
export function planPolicy(p: PlanSpec): Policy {
  let entered = false;
  let protectedOnce = false;
  return ({ state, bar, tape, held, last }) => {
    const out: PlayAction[] = [];
    const sym = tape.symbol;
    if (!entered && bar >= (p.at ?? 0)) {
      entered = true;
      out.push({ symbol: sym, side: "buy", type: "market", tif: "gtc", ...p.entry, qty: Math.floor((state.startingCash * p.size) / last) } as OrderSpec);
    }
    if (held > 0 && !protectedOnce) {
      protectedOnce = true;
      const avg = state.positions[sym]!.costBasis / held;
      if (p.stop && "trailPercent" in p.stop) out.push({ symbol: sym, side: "sell", type: "trailing-stop", trailPercent: p.stop.trailPercent, qty: held, tif: "gtc" });
      else if (p.stop) out.push({ symbol: sym, side: "sell", type: "stop", stopPrice: "price" in p.stop ? p.stop.price : Math.round(avg * (1 - (p.stop as { below: number }).below)), qty: held, tif: "gtc" });
      if (p.target) out.push({ symbol: sym, side: "sell", type: "limit", limitPrice: p.target, qty: held, tif: "gtc" });
    }
    if (p.addAt === bar && held > 0) out.push({ symbol: sym, side: "buy", type: "market", qty: held, tif: "day" });
    if (p.exitAt === bar && held > 0) {
      for (const o of state.orders.filter((x) => x.status === "working" && x.side === "sell")) out.push({ cancel: o.id });
      out.push({ symbol: sym, side: "sell", type: "market", qty: held, tif: "day" });
    }
    return out;
  };
}

/** One reference play per challenge (passes every rule and meets ≥ 1 goal) and one reckless play (breaches ≥ 1 rule). */
export const REFERENCE_PLAYS: Record<string, PlanSpec> = {
  "limit-below-market": { entry: { type: "limit", limitPrice: 4200 }, size: 0.3, stop: { price: 4100 }, target: 4380 },
  "protect-with-a-stop": { entry: {}, size: 0.4, stop: { below: 0.05 }, target: 6000 },
  "ride-the-trend": { entry: {}, size: 0.5, stop: { trailPercent: 4 } },
  "grind-trail": { entry: {}, size: 0.5, stop: { trailPercent: 1.5 } },
  "drawdown-cap": { entry: {}, size: 0.2, stop: { below: 0.04 }, exitAt: 60 },
  "no-averaging-down": { entry: {}, size: 0.25, stop: { below: 0.03 } },
  "wait-for-support": { entry: { type: "limit", limitPrice: 4200 }, size: 0.3, stop: { price: 4050 }, target: 4380 },
  "breakout-buy-stop": { entry: { type: "stop", stopPrice: 3150 }, size: 0.4, stop: { below: 0.06 } },
  "gap-through-stop": { entry: {}, size: 0.25, stop: { below: 0.03 } },
  "earnings-small-size": { entry: {}, size: 0.18, stop: { below: 0.08 } },
};

export const RECKLESS_PLAYS: Record<string, PlanSpec> = {
  "limit-below-market": { entry: {}, size: 0.9 },
  "protect-with-a-stop": { entry: {}, size: 0.9 },
  "ride-the-trend": { entry: {}, size: 0.95 },
  "grind-trail": { entry: {}, size: 0.95 },
  "drawdown-cap": { entry: {}, size: 0.95 },
  "no-averaging-down": { entry: {}, size: 0.2, addAt: 20 },
  "wait-for-support": { entry: {}, size: 0.5 },
  "breakout-buy-stop": { entry: {}, size: 0.9 },
  "gap-through-stop": { entry: {}, size: 0.9 },
  "earnings-small-size": { entry: {}, size: 0.9 },
};

// ---------------------------------------------------------------------------------------------------------
// BA6.M3 local leaderboard: fictional benchmark entries (labelled "benchmark") + the learner's best.

export interface LeaderboardEntry {
  name: string;
  score: number;
  benchmark: boolean;
}

export const BENCHMARK_NAMES = ["Benchmark · Plan-First Pat", "Benchmark · Steady Sam", "Benchmark · All-In Al"];

export function benchmarks(c: Challenge): LeaderboardEntry[] {
  const ref = scoreChallenge(c, play(c, planPolicy(REFERENCE_PLAYS[c.id]!)));
  const half = scoreChallenge(c, play(c, planPolicy({ ...REFERENCE_PLAYS[c.id]!, target: undefined, exitAt: endBar(c) - 1 })));
  const reck = scoreChallenge(c, play(c, planPolicy(RECKLESS_PLAYS[c.id]!)));
  return [
    { name: BENCHMARK_NAMES[0]!, score: ref.score, benchmark: true },
    { name: BENCHMARK_NAMES[1]!, score: half.score, benchmark: true },
    { name: BENCHMARK_NAMES[2]!, score: reck.score, benchmark: true },
  ];
}

/** Competition ranking (1, 2, 2, 4) by score, highest first. Ties keep benchmarks after the learner. */
export function rankEntries(entries: LeaderboardEntry[]): (LeaderboardEntry & { rank: number })[] {
  const sorted = [...entries].sort((a, b) => b.score - a.score || Number(a.benchmark) - Number(b.benchmark));
  return sorted.map((e) => ({ ...e, rank: 1 + sorted.filter((x) => x.score > e.score).length }));
}

export function leaderboard(c: Challenge, learnerBest: number | null): (LeaderboardEntry & { rank: number })[] {
  const entries = benchmarks(c);
  if (learnerBest !== null) entries.push({ name: "You", score: learnerBest, benchmark: false });
  return rankEntries(entries);
}

// ---------------------------------------------------------------------------------------------------------
// BA6.M4 challenge of the week: by ISO week (Monday-start) in the learner's time zone, deterministic.

/** Whole weeks since Monday 1970-01-05 for the local day of `now`. */
export function weekIndex(now: Date, timeZone?: string): number {
  return Math.floor(daysBetween("1970-01-05", dayKey(now, timeZone)) / 7);
}

export function challengeOfTheWeek(now: Date, timeZone?: string): Challenge {
  const n = CHALLENGES.length;
  return CHALLENGES[((weekIndex(now, timeZone) % n) + n) % n]!;
}
