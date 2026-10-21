/**
 * Earnings events (FE3.M1): expectations going in, actuals coming out (taken from the FE0 fixtures),
 * the guidance change, and the price-reaction archetype (FE4). SAMPLE / STYLIZED, not advice.
 * Beat / miss / in-line and raise / maintain / cut are COMPUTED here, never typed by hand.
 */
import { companyById } from "./companies";
import { round2 } from "./ties";
import type { Company, GuidanceRange, Quarter } from "./types";

export type ReactionArchetype = "gap-and-go" | "gap-fill" | "sell-the-news" | "guidance-reversal" | "pead-drift" | "muted";
export const REACTION_ARCHETYPES: ReactionArchetype[] = ["gap-and-go", "gap-fill", "sell-the-news", "guidance-reversal", "pead-drift", "muted"];

export type Outcome = "beat" | "in-line" | "miss";
export type GuidanceChange = "raise" | "maintain" | "cut";
export type GapDirection = "up" | "down";

export interface KpiWatch {
  kpiId: string;
  /** What the street wants to see, in the KPI's own units (pct values as shown, e.g. 1.5 = 1.5%). */
  expected: number;
  why: string;
}

export interface EarningsExpectations {
  consensusEps: number;
  /** Thousands. */
  consensusRevenue: number;
  /** Optional unofficial "whisper" EPS. */
  whisperEps?: number;
  /** The company's own range for THIS quarter's revenue, given last quarter. */
  priorGuidance: GuidanceRange;
  kpiWatch: KpiWatch[];
  /** Options-implied move for the report day, percent (e.g. 8 = ±8%). */
  impliedMovePct: number;
  /** Stock move over the ~10 sessions before the report, percent. */
  runUpPct: number;
  positioning: string;
}

export interface EarningsEvent {
  id: string;
  companyId: string;
  /** Index into company.quarters (0 = Q1 FY25). */
  quarterIndex: number;
  /** Close before the report (dollars), used by the reaction chart. */
  priorClose: number;
  expect: EarningsExpectations;
  /** Revenue range for NEXT quarter given in this report. */
  newGuidance: GuidanceRange;
  /** Street estimate for next quarter's revenue before this report. */
  nextQuarterConsensusRevenue: number;
  reaction: ReactionArchetype;
  /** One or two sentences: the fact that actually moved the stock. */
  whatMattered: string;
  /** Plain-language headline the company would put out. */
  headline: string;
  /** Validation-only: what the story claims, checked against the computed labels in tests. */
  claims: { eps: Outcome; revenue: Outcome; guidance: GuidanceChange; whisper?: "above" | "below" };
  /** Extra facts the explanation relies on (e.g. "announced a 90,000k share sale"). */
  extraFacts?: string[];
}

/* -------------------- computed labels -------------------- */

/** EPS outcome: beat / miss when actual differs from consensus by at least one cent. */
export function epsOutcome(actual: number, consensus: number): Outcome {
  const d = round2(actual - consensus);
  return d >= 0.01 ? "beat" : d <= -0.01 ? "miss" : "in-line";
}

/** Revenue outcome: in-line within ±1% of consensus. */
export function revenueOutcome(actual: number, consensus: number): Outcome {
  const s = (actual - consensus) / consensus;
  return s >= 0.01 ? "beat" : s <= -0.01 ? "miss" : "in-line";
}

export const midpoint = (g: GuidanceRange) => (g.low + g.high) / 2;

/** Guidance change: new range midpoint vs next-quarter consensus, ±1%. */
export function guidanceChange(newGuidance: GuidanceRange, nextConsensus: number): GuidanceChange {
  const s = (midpoint(newGuidance) - nextConsensus) / nextConsensus;
  return s >= 0.01 ? "raise" : s <= -0.01 ? "cut" : "maintain";
}

/** (Actual − estimate) ÷ |estimate|; null when the estimate is 0. */
export function surprisePct(actual: number, estimate: number): number | null {
  return estimate === 0 ? null : (actual - estimate) / Math.abs(estimate);
}

export interface ResolvedEvent {
  event: EarningsEvent;
  company: Company;
  quarter: Quarter;
  /** Quarters reported BEFORE this event (safe to show pre-reveal). */
  history: Quarter[];
  actualEps: number;
  actualRevenue: number;
  eps: Outcome;
  revenue: Outcome;
  guidance: GuidanceChange;
  epsSurprise: number | null;
  revenueSurprise: number;
  /** Gap direction implied by the archetype + outcome. */
  direction: GapDirection;
  kpiActuals: { kpiId: string; label: string; expected: number; actual: number; unit: string; why: string }[];
}

/** Direction of the report-day gap. Fades and reversals still OPEN in the headline's direction. */
export function gapDirection(archetype: ReactionArchetype, eps: Outcome, guidance: GuidanceChange): GapDirection {
  switch (archetype) {
    case "sell-the-news":
    case "guidance-reversal":
      return "up";
    case "gap-and-go":
    case "pead-drift":
      return guidance === "cut" || eps === "miss" ? "down" : "up";
    case "gap-fill":
    case "muted":
      return eps === "miss" ? "down" : "up";
  }
}

export function resolveEvent(event: EarningsEvent): ResolvedEvent {
  const company = companyById(event.companyId);
  if (!company) throw new Error(`unknown company ${event.companyId}`);
  const quarter = company.quarters[event.quarterIndex];
  if (!quarter) throw new Error(`${event.id}: bad quarter index`);
  const actualEps = quarter.income.epsDiluted;
  const actualRevenue = quarter.income.revenue;
  const eps = epsOutcome(actualEps, event.expect.consensusEps);
  const revenue = revenueOutcome(actualRevenue, event.expect.consensusRevenue);
  const guidance = guidanceChange(event.newGuidance, event.nextQuarterConsensusRevenue);
  return {
    event,
    company,
    quarter,
    history: company.quarters.slice(0, event.quarterIndex),
    actualEps,
    actualRevenue,
    eps,
    revenue,
    guidance,
    epsSurprise: surprisePct(actualEps, event.expect.consensusEps),
    revenueSurprise: (actualRevenue - event.expect.consensusRevenue) / event.expect.consensusRevenue,
    direction: gapDirection(event.reaction, eps, guidance),
    kpiActuals: event.expect.kpiWatch.map((w) => {
      const k = quarter.kpis.find((x) => x.id === w.kpiId);
      if (!k) throw new Error(`${event.id}: KPI ${w.kpiId} missing`);
      return { kpiId: w.kpiId, label: k.label, expected: w.expected, actual: k.value, unit: k.unit, why: w.why };
    }),
  };
}

/** Story-consistency rules between the facts and the reaction archetype. Returns violations. */
export function eventViolations(event: EarningsEvent): string[] {
  const v: string[] = [];
  const r = resolveEvent(event);
  const id = event.id;
  if (r.eps !== event.claims.eps) v.push(`${id}: claims EPS ${event.claims.eps}, computed ${r.eps}`);
  if (r.revenue !== event.claims.revenue) v.push(`${id}: claims revenue ${event.claims.revenue}, computed ${r.revenue}`);
  if (r.guidance !== event.claims.guidance) v.push(`${id}: claims guidance ${event.claims.guidance}, computed ${r.guidance}`);
  const im = event.expect.impliedMovePct;
  if (im < 2 || im > 20) v.push(`${id}: implied move ${im}% outside 2–20%`);
  if (event.expect.whisperEps !== undefined) {
    const side = event.expect.whisperEps > event.expect.consensusEps ? "above" : event.expect.whisperEps < event.expect.consensusEps ? "below" : "equal";
    if (side !== event.claims.whisper) v.push(`${id}: whisper is ${side} consensus, story says ${event.claims.whisper}`);
  } else if (event.claims.whisper) v.push(`${id}: story mentions a whisper but none is set`);
  const g = event.expect.priorGuidance;
  if (!(g.low < g.high) || !(event.newGuidance.low < event.newGuidance.high)) v.push(`${id}: guidance ranges must have low < high`);
  switch (event.reaction) {
    case "gap-and-go":
    case "pead-drift": {
      const up = r.eps === "beat" && r.guidance === "raise";
      const down = r.eps === "miss" && r.guidance === "cut";
      if (!up && !down) v.push(`${id}: ${event.reaction} needs beat+raise or miss+cut`);
      break;
    }
    case "guidance-reversal":
      if (r.eps !== "beat" || r.guidance !== "cut") v.push(`${id}: guidance-reversal needs an EPS beat with a guidance cut`);
      break;
    case "sell-the-news":
      if (event.expect.runUpPct < 8) v.push(`${id}: sell-the-news needs a run-up ≥ 8%`);
      if (r.guidance === "raise") v.push(`${id}: sell-the-news should not come with a raise`);
      if (r.eps === "miss") v.push(`${id}: sell-the-news is about good-enough news, not a miss`);
      break;
    case "gap-fill":
      if (r.guidance !== "maintain") v.push(`${id}: gap-fill events keep guidance (nothing new to extend the move)`);
      break;
    case "muted":
      if (r.guidance !== "maintain" || r.eps === "miss" || r.revenue !== "in-line") v.push(`${id}: muted needs an in-line quarter and maintained guidance`);
      break;
  }
  return v;
}

/* -------------------- the events -------------------- */

export const EARNINGS_EVENTS: EarningsEvent[] = [
  {
    id: "nwcl-q2fy25",
    companyId: "northwind-cloud",
    quarterIndex: 1,
    priorClose: 38,
    headline: "Northwind tops estimates and raises its outlook",
    expect: {
      consensusEps: -0.17,
      consensusRevenue: 42300,
      whisperEps: -0.16,
      priorGuidance: { low: 41800, high: 42600 },
      kpiWatch: [{ kpiId: "nrr", expected: 122, why: "Net revenue retention shows whether existing customers spend more." }],
      impliedMovePct: 9,
      runUpPct: 2,
      positioning: "Quiet into the print; the stock is flat for two weeks.",
    },
    newGuidance: { low: 46000, high: 46800 },
    nextQuarterConsensusRevenue: 45300,
    reaction: "gap-and-go",
    whatMattered: "Revenue beat by about 2% AND next-quarter guidance came in above the street, with no run-up to sell into.",
    claims: { eps: "beat", revenue: "beat", guidance: "raise", whisper: "above" },
  },
  {
    id: "nwcl-q4fy25",
    companyId: "northwind-cloud",
    quarterIndex: 3,
    priorClose: 47,
    headline: "Northwind beats again; reiterates outlook",
    expect: {
      consensusEps: -0.13,
      consensusRevenue: 49900,
      whisperEps: -0.11,
      priorGuidance: { low: 49500, high: 50300 },
      kpiWatch: [{ kpiId: "nrr", expected: 121, why: "Retention has slipped two quarters in a row." }],
      impliedMovePct: 10,
      runUpPct: 14,
      positioning: "Up 14% in two weeks on 'AI demand' chatter; the whisper is well above consensus.",
    },
    newGuidance: { low: 53800, high: 54600 },
    nextQuarterConsensusRevenue: 54100,
    reaction: "sell-the-news",
    whatMattered: "A small beat that missed the whisper, after a 14% run-up, with guidance only in line: the good news was already priced in.",
    claims: { eps: "beat", revenue: "in-line", guidance: "maintain", whisper: "above" },
  },
  {
    id: "nwcl-q1fy26",
    companyId: "northwind-cloud",
    quarterIndex: 4,
    priorClose: 44,
    headline: "Northwind beats, announces stock sale, trims outlook",
    expect: {
      consensusEps: -0.1,
      consensusRevenue: 53900,
      priorGuidance: { low: 53800, high: 54600 },
      kpiWatch: [{ kpiId: "nrr", expected: 120, why: "Investors want retention to stop falling." }],
      impliedMovePct: 11,
      runUpPct: 3,
      positioning: "Cash was down to about 28,000k last quarter; a raise is widely expected.",
    },
    newGuidance: { low: 56800, high: 57600 },
    nextQuarterConsensusRevenue: 58400,
    reaction: "guidance-reversal",
    whatMattered: "The EPS beat made the first print green, but guidance was cut, retention fell to 118%, and new shares diluted holders.",
    claims: { eps: "beat", revenue: "in-line", guidance: "cut" },
    extraFacts: ["raised 90,000k by selling about 6,000k new shares"],
  },
  {
    id: "nwcl-q3fy26",
    companyId: "northwind-cloud",
    quarterIndex: 6,
    priorClose: 41,
    headline: "Northwind results in line with expectations",
    expect: {
      consensusEps: -0.05,
      consensusRevenue: 63300,
      priorGuidance: { low: 62800, high: 63800 },
      kpiWatch: [{ kpiId: "customers", expected: 2600, why: "Customer adds show whether growth is broad-based." }],
      impliedMovePct: 8,
      runUpPct: 1,
      positioning: "No strong view either way.",
    },
    newGuidance: { low: 68000, high: 69000 },
    nextQuarterConsensusRevenue: 68400,
    reaction: "muted",
    whatMattered: "Everything landed on the estimates and guidance matched the street: nothing new, so the move stayed inside the implied range.",
    claims: { eps: "in-line", revenue: "in-line", guidance: "maintain" },
  },
  {
    id: "nwcl-q4fy26",
    companyId: "northwind-cloud",
    quarterIndex: 7,
    priorClose: 39,
    headline: "Northwind nears breakeven; raises outlook",
    expect: {
      consensusEps: -0.05,
      consensusRevenue: 66900,
      priorGuidance: { low: 68000, high: 69000 },
      kpiWatch: [{ kpiId: "nrr", expected: 115, why: "Retention stabilizing would mean the slowdown is over." }],
      impliedMovePct: 10,
      runUpPct: -4,
      positioning: "Sold off 4% into the print; many funds are underweight.",
    },
    newGuidance: { low: 73500, high: 74500 },
    nextQuarterConsensusRevenue: 71500,
    reaction: "pead-drift",
    whatMattered: "A big beat (loss of 2¢ vs 5¢ expected), a raise well above the street, and retention holding: underweight funds kept buying for days.",
    claims: { eps: "beat", revenue: "beat", guidance: "raise" },
  },
  {
    id: "hbpn-q4fy25",
    companyId: "harbor-pine",
    quarterIndex: 3,
    priorClose: 27,
    headline: "Harbor & Pine holiday sales beat; outlook raised",
    expect: {
      consensusEps: 0.28,
      consensusRevenue: 322000,
      priorGuidance: { low: 318000, high: 326000 },
      kpiWatch: [{ kpiId: "comps", expected: 2.5, why: "Same-store sales show demand at existing stores." }],
      impliedMovePct: 7,
      runUpPct: 1,
      positioning: "Cautious: worries about a weak holiday season.",
    },
    newGuidance: { low: 207000, high: 212000 },
    nextQuarterConsensusRevenue: 206000,
    reaction: "gap-and-go",
    whatMattered: "Holiday comps of +3.6% vs +2.5% expected plus a raised outlook, from a cautious starting point.",
    claims: { eps: "beat", revenue: "beat", guidance: "raise" },
  },
  {
    id: "hbpn-q1fy26",
    companyId: "harbor-pine",
    quarterIndex: 4,
    priorClose: 31,
    headline: "Harbor & Pine in line; reiterates outlook",
    expect: {
      consensusEps: 0.16,
      consensusRevenue: 207500,
      whisperEps: 0.18,
      priorGuidance: { low: 207000, high: 212000 },
      kpiWatch: [{ kpiId: "comps", expected: 2.5, why: "Did the holiday momentum carry into spring?" }],
      impliedMovePct: 6,
      runUpPct: 9,
      positioning: "Up 9% since the holiday beat; the whisper is two cents above consensus.",
    },
    newGuidance: { low: 214000, high: 220000 },
    nextQuarterConsensusRevenue: 217500,
    reaction: "sell-the-news",
    whatMattered: "After a 9% run-up the quarter was merely in line, comps slowed to +1.9%, and the whisper was missed.",
    claims: { eps: "in-line", revenue: "in-line", guidance: "maintain", whisper: "above" },
  },
  {
    id: "hbpn-q2fy26",
    companyId: "harbor-pine",
    quarterIndex: 5,
    priorClose: 29,
    headline: "Harbor & Pine misses on softer traffic; keeps outlook",
    expect: {
      consensusEps: 0.16,
      consensusRevenue: 220500,
      priorGuidance: { low: 214000, high: 220000 },
      kpiWatch: [{ kpiId: "comps", expected: 1.5, why: "Comps have slowed for four quarters." }],
      impliedMovePct: 6,
      runUpPct: 0,
      positioning: "Already de-rated; short interest is rising.",
    },
    newGuidance: { low: 226000, high: 231000 },
    nextQuarterConsensusRevenue: 229000,
    reaction: "gap-fill",
    whatMattered: "A one-cent miss and +0.6% comps, but guidance held and the stock was already cheap: the gap down filled within days.",
    claims: { eps: "miss", revenue: "miss", guidance: "maintain" },
  },
  {
    id: "hbpn-q3fy26",
    companyId: "harbor-pine",
    quarterIndex: 6,
    priorClose: 28,
    headline: "Harbor & Pine cuts holiday outlook as inventory builds",
    expect: {
      consensusEps: 0.17,
      consensusRevenue: 231000,
      priorGuidance: { low: 226000, high: 231000 },
      kpiWatch: [{ kpiId: "comps", expected: 0.5, why: "Negative comps would mean shrinking demand." }],
      impliedMovePct: 7,
      runUpPct: -1,
      positioning: "Mixed; some hope for a holiday rebound.",
    },
    newGuidance: { low: 305000, high: 315000 },
    nextQuarterConsensusRevenue: 335000,
    reaction: "gap-and-go",
    whatMattered: "Comps turned negative (−0.8%), inventory is ~11% above last year (markdown risk), and the holiday guide was cut well below the street.",
    claims: { eps: "miss", revenue: "miss", guidance: "cut" },
  },
  {
    id: "hbpn-q4fy26",
    companyId: "harbor-pine",
    quarterIndex: 7,
    priorClose: 24,
    headline: "Harbor & Pine holiday miss; guides lower again",
    expect: {
      consensusEps: 0.33,
      consensusRevenue: 330000,
      priorGuidance: { low: 305000, high: 315000 },
      kpiWatch: [{ kpiId: "comps", expected: -1, why: "How bad was the holiday season?" }],
      impliedMovePct: 8,
      runUpPct: 2,
      positioning: "Bounce hopes: the stock rallied 2% on 'worst is priced in' notes.",
    },
    newGuidance: { low: 196000, high: 202000 },
    nextQuarterConsensusRevenue: 210000,
    reaction: "pead-drift",
    whatMattered: "Holiday comps −2.2% vs −1% feared, a second guidance cut, and analysts cutting numbers for days after: the drift kept going.",
    claims: { eps: "miss", revenue: "miss", guidance: "cut" },
  },
  {
    id: "irbg-q3fy25",
    companyId: "ironbridge-industrial",
    quarterIndex: 2,
    priorClose: 61,
    headline: "Ironbridge in line; backlog steady",
    expect: {
      consensusEps: 0.33,
      consensusRevenue: 157000,
      priorGuidance: { low: 155000, high: 159000 },
      kpiWatch: [{ kpiId: "backlog", expected: 420000, why: "Backlog is next year's revenue." }],
      impliedMovePct: 5,
      runUpPct: 1,
      positioning: "Owned by income funds; low expectations of surprise.",
    },
    newGuidance: { low: 159500, high: 163000 },
    nextQuarterConsensusRevenue: 161500,
    reaction: "muted",
    whatMattered: "EPS and revenue on consensus, backlog steady at 422,000k, guidance unchanged: inside the implied move.",
    claims: { eps: "in-line", revenue: "in-line", guidance: "maintain" },
  },
  {
    id: "irbg-q1fy26",
    companyId: "ironbridge-industrial",
    quarterIndex: 4,
    priorClose: 63,
    headline: "Ironbridge beats on cost control; sees softer demand",
    expect: {
      consensusEps: 0.28,
      consensusRevenue: 157500,
      priorGuidance: { low: 155000, high: 160000 },
      kpiWatch: [{ kpiId: "book-to-bill", expected: 1.0, why: "Below 1.0 means orders are not replacing shipments." }],
      impliedMovePct: 6,
      runUpPct: 2,
      positioning: "Consensus long on 'infrastructure spending'.",
    },
    newGuidance: { low: 145000, high: 150000 },
    nextQuarterConsensusRevenue: 156000,
    reaction: "guidance-reversal",
    whatMattered: "The EPS beat came from cost cuts, not sales; book-to-bill fell to 0.88 and next-quarter guidance was cut about 5% below the street.",
    claims: { eps: "beat", revenue: "in-line", guidance: "cut" },
  },
  {
    id: "irbg-q2fy26",
    companyId: "ironbridge-industrial",
    quarterIndex: 5,
    priorClose: 55,
    headline: "Ironbridge misses; holds outlook",
    expect: {
      consensusEps: 0.26,
      consensusRevenue: 150500,
      priorGuidance: { low: 145000, high: 150000 },
      kpiWatch: [{ kpiId: "book-to-bill", expected: 0.85, why: "Any sign orders are bottoming?" }],
      impliedMovePct: 6,
      runUpPct: -3,
      positioning: "Down 3% into the print; bad news partly expected.",
    },
    newGuidance: { low: 140000, high: 146000 },
    nextQuarterConsensusRevenue: 143500,
    reaction: "gap-fill",
    whatMattered: "A miss the market half-expected, but guidance held and book-to-bill (0.84) met the low bar: the gap down filled.",
    claims: { eps: "miss", revenue: "miss", guidance: "maintain" },
  },
  {
    id: "irbg-q3fy26",
    companyId: "ironbridge-industrial",
    quarterIndex: 6,
    priorClose: 54,
    headline: "Ironbridge misses, cuts outlook; leverage rises",
    expect: {
      consensusEps: 0.22,
      consensusRevenue: 145500,
      priorGuidance: { low: 140000, high: 146000 },
      kpiWatch: [{ kpiId: "backlog", expected: 375000, why: "A falling backlog means falling future revenue." }],
      impliedMovePct: 7,
      runUpPct: 1,
      positioning: "Credit investors are watching leverage vs the 3.5× covenant.",
    },
    newGuidance: { low: 138000, high: 142000 },
    nextQuarterConsensusRevenue: 147000,
    reaction: "pead-drift",
    whatMattered: "EPS 17¢ vs 22¢, backlog down to 360,000k, guidance cut, and net leverage up to ~2.7× against a 3.5× covenant: sellers kept coming.",
    claims: { eps: "miss", revenue: "miss", guidance: "cut" },
  },
];

export function eventById(id: string): EarningsEvent | undefined {
  return EARNINGS_EVENTS.find((e) => e.id === id);
}
