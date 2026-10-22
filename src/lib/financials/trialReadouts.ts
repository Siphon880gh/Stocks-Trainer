/**
 * Biotech trial readouts (FE8.M1): binary catalysts for Kestrel Biotherapeutics, separate from earnings prints.
 * The lesson is that a readout cannot be "read" from statements or charts: the risk control is position size,
 * and the follow-up questions (dilution, runway, what management does next) are answered from the statements.
 * Every number that also appears in the statements is read from the fixtures, never typed twice.
 * SAMPLE / STYLIZED: invented company, trials and price paths. Not medical information, not advice.
 */
import type { OHLC } from "../ohlcData";
import { companyById } from "./companies";
import { runwayMonths } from "./metrics";
import type { Company, Quarter } from "./types";

export type ReadoutOutcome = "met" | "missed" | "continues";

export interface TrialReadout {
  id: string;
  companyId: string;
  program: string;
  /** Trial name and phase shown to the user. */
  trial: string;
  phase: 2 | 3;
  /** The fiscal quarter the readout happens in (index into company.quarters). */
  quarterIndex: number;
  priorClose: number;
  /** Options-implied move for the readout day, percent. Binary events price far bigger moves than earnings. */
  impliedMovePct: number;
  /** Report-day gap as a fraction (−0.32 = −32%). Sign must match the outcome; "continues" stays inside the implied move. */
  gap: number;
  outcome: ReadoutOutcome;
  /** What the market knew going in (no outcome). */
  setup: string[];
  headline: string;
  whatMattered: string;
  /** Follow-on offering the next session (Q2 FY26 Phase 3 win). Shares and proceeds come from the statements. */
  followOn?: boolean;
}

export const TRIAL_READOUTS: TrialReadout[] = [
  {
    id: "kb207-ph2",
    companyId: "kestrel-bio",
    program: "KB-207",
    trial: "KB-207 Phase 2 (second program)",
    phase: 2,
    quarterIndex: 2,
    priorClose: 12.6,
    impliedMovePct: 25,
    gap: -0.32,
    outcome: "missed",
    setup: [
      "KB-207 is Kestrel's second program; the lead drug KB-101 is in a separate Phase 3 trial.",
      "The Phase 2 trial tests whether KB-207 beats placebo on its primary endpoint at 24 weeks.",
      "Options price about a ±25% move for the day.",
    ],
    headline: "KB-207 Phase 2 misses its primary endpoint; Kestrel stops the program",
    whatMattered:
      "The primary endpoint missed, so the market removed KB-207's value in one gap. Management stopped the program, and R&D falls from the next quarter, which stretches the cash runway.",
  },
  {
    id: "kestrel3-interim",
    companyId: "kestrel-bio",
    program: "KB-101",
    trial: "KESTREL-3 Phase 3 interim look",
    phase: 3,
    quarterIndex: 3,
    priorClose: 9.1,
    impliedMovePct: 15,
    gap: 0.05,
    outcome: "continues",
    setup: [
      "An independent data monitoring committee looks at unblinded KESTREL-3 data halfway through.",
      "It can stop early for futility (no chance of success) or safety, or let the trial continue.",
      "Options price about a ±15% move.",
    ],
    headline: "Independent committee recommends KESTREL-3 continue as planned",
    whatMattered:
      "'Continue as planned' means the trial passed a futility and safety check, not that the drug works. The stock rose a little and stayed inside the implied move: the real answer comes at the final readout.",
  },
  {
    id: "kestrel3-topline",
    companyId: "kestrel-bio",
    program: "KB-101",
    trial: "KESTREL-3 Phase 3 topline",
    phase: 3,
    quarterIndex: 5,
    priorClose: 13.2,
    impliedMovePct: 40,
    gap: 0.55,
    outcome: "met",
    setup: [
      "KESTREL-3 is the Phase 3 trial of Kestrel's lead drug, KB-101: most of the company's value rides on it.",
      "Enrollment finished in Q4 FY25 and the interim look let it continue.",
      "Options price about a ±40% move.",
    ],
    headline: "KESTREL-3 meets its primary endpoint; Kestrel prices a follow-on offering",
    whatMattered:
      "The trial met its primary endpoint, so the stock re-priced in one gap and did not fill it. The next morning Kestrel sold new shares at a discount: holders were diluted, but raising after good news cost far fewer shares and nearly doubled the runway.",
    followOn: true,
  },
];

export function readoutById(id: string): TrialReadout | undefined {
  return TRIAL_READOUTS.find((r) => r.id === id);
}

export interface ResolvedReadout {
  readout: TrialReadout;
  company: Company;
  quarter: Quarter;
  /** Last reported quarter before the readout (what an investor could read going in). */
  lastReported: Quarter;
  runwayBefore: number | null;
  /** Follow-on facts, from the statements of the readout quarter. */
  followOn?: { sharesK: number; proceedsK: number; price: number; dilution: number; runwayAfter: number | null };
}

export function resolveReadout(r: TrialReadout): ResolvedReadout {
  const company = companyById(r.companyId);
  if (!company) throw new Error(`unknown company ${r.companyId}`);
  const quarter = company.quarters[r.quarterIndex];
  const lastReported = company.quarters[r.quarterIndex - 1];
  if (!quarter || !lastReported) throw new Error(`${r.id}: bad quarter index`);
  let followOn: ResolvedReadout["followOn"];
  if (r.followOn) {
    const proceedsK = quarter.cashFlow.equityIssued;
    const sharesK = quarter.income.sharesBasic - lastReported.income.sharesBasic;
    followOn = {
      sharesK,
      proceedsK,
      price: Math.round((proceedsK / sharesK) * 100) / 100,
      dilution: sharesK / lastReported.income.sharesBasic,
      runwayAfter: runwayMonths(quarter),
    };
  }
  return { readout: r, company, quarter, lastReported, runwayBefore: runwayMonths(lastReported), followOn };
}

/* ---------------- price path (deterministic, seeded from the id) ---------------- */

export const READOUT_PRE_BARS = 30;
export const READOUT_POST_BARS = 15;
export const READOUT_INDEX = READOUT_PRE_BARS;

function seed(s: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  let a = h >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const cents = (n: number) => Math.round(n * 100) / 100;

export function readoutBars(r: TrialReadout): OHLC[] {
  const rnd = seed(r.id);
  const noise = (a: number) => (rnd() * 2 - 1) * a;
  const fo = resolveReadout(r).followOn;
  // Pre: a drifting walk that ends exactly at the prior close.
  const rel = [1];
  for (let i = 1; i < READOUT_PRE_BARS; i++) rel.push(rel[i - 1]! * (1 + noise(0.018)));
  const scale = r.priorClose / rel[rel.length - 1]!;
  const closes = rel.map((x) => x * scale);
  const open = r.priorClose * (1 + r.gap);
  const eventClose = open * (1 + (r.outcome === "continues" ? noise(0.01) : Math.sign(r.gap) * 0.03));
  closes.push(eventClose);
  let c = eventClose;
  for (let k = 1; k <= READOUT_POST_BARS; k++) {
    let next: number;
    if (fo && k === 1) next = Math.max(fo.price * 1.03, c * 0.93); // follow-on day: trades down toward the offer price
    else if (r.outcome === "continues") next = r.priorClose * (1 + r.gap * 0.8 + noise(0.02));
    else next = c * (1 + noise(0.015));
    // A binary re-pricing does not fill: keep closes well past the prior close.
    if (r.outcome === "met") next = Math.max(next, r.priorClose * (1 + r.gap * 0.6));
    if (r.outcome === "missed") next = Math.min(next, r.priorClose * (1 + r.gap * 0.6));
    closes.push(next);
    c = next;
  }
  const bars: OHLC[] = [];
  const cs = closes.map(cents);
  for (let i = 0; i < cs.length; i++) {
    const o = i === 0 ? cents(cs[0]! * (1 - 0.004)) : i === READOUT_INDEX ? cents(open) : bars[i - 1]!.close;
    let cl = cs[i]!;
    if (cl === o) cl = cents(cl + 0.01);
    let high = cents(Math.max(o, cl) * (1 + 0.003 + rnd() * 0.01));
    let low = cents(Math.min(o, cl) * (1 - 0.003 - rnd() * 0.01));
    if (fo && i === READOUT_INDEX + 1) low = Math.min(low, cents(fo.price * 1.01));
    if (r.outcome === "met" && i >= READOUT_INDEX) low = Math.max(low, cents(r.priorClose * (1 + r.gap * 0.5)));
    if (r.outcome === "missed" && i >= READOUT_INDEX) high = Math.min(high, cents(r.priorClose * (1 + r.gap * 0.5)));
    low = Math.min(low, Math.min(o, cl));
    high = Math.max(high, Math.max(o, cl));
    if (high <= low) high = cents(low + 0.02);
    const vol = i < READOUT_INDEX ? 0.8 + rnd() * 0.4 : i === READOUT_INDEX ? 9 + rnd() * 3 : Math.max(1.1, 5 * Math.pow(0.7, i - READOUT_INDEX - 1));
    const name = i === READOUT_INDEX ? "Readout" : i < READOUT_INDEX ? `T-${READOUT_INDEX - i}` : `T+${i - READOUT_INDEX}`;
    bars.push({ name, open: o, high, low, close: cl, volume: Math.round(3_200_000 * vol) });
  }
  return bars;
}

/** Rules every readout and chart must satisfy. Returns violations. */
export function readoutViolations(r: TrialReadout): string[] {
  const v: string[] = [];
  const b = readoutBars(r);
  const e = READOUT_INDEX;
  const prior = b[e - 1]!.close;
  const implied = r.impliedMovePct / 100;
  if (b.length !== READOUT_PRE_BARS + 1 + READOUT_POST_BARS) v.push(`${r.id}: bar count`);
  if (prior !== r.priorClose) v.push(`${r.id}: bar before the readout must close at the prior close`);
  const gap = b[e]!.open / prior - 1;
  if (Math.abs(gap - r.gap) > 0.002) v.push(`${r.id}: chart gap ${gap} != ${r.gap}`);
  if (r.outcome === "met" && !(gap > implied * 0.9)) v.push(`${r.id}: a met endpoint should gap up beyond most of the implied move`);
  if (r.outcome === "missed" && !(gap < -implied * 0.9)) v.push(`${r.id}: a missed endpoint should gap down beyond most of the implied move`);
  if (r.outcome === "continues" && !(Math.abs(gap) < implied)) v.push(`${r.id}: 'continues' should stay inside the implied move`);
  if (r.outcome !== "continues") {
    const post = b.slice(e);
    const filled = post.some((x) => (gap > 0 ? x.low <= prior : x.high >= prior));
    if (filled) v.push(`${r.id}: a binary re-pricing should not fill its gap`);
  }
  b.forEach((x, i) => {
    if (!(x.high > x.low) || x.high < Math.max(x.open, x.close) || x.low > Math.min(x.open, x.close)) v.push(`${r.id} ${x.name}: bad bar`);
    if (i > 0 && i !== e && x.open !== b[i - 1]!.close) v.push(`${r.id} ${x.name}: unintended gap`);
  });
  const avg = b.slice(e - 20, e).reduce((a, x) => a + (x.volume ?? 0), 0) / 20;
  if ((b[e]!.volume ?? 0) < 5 * avg) v.push(`${r.id}: readout volume < 5 × average`);
  const rr = resolveReadout(r);
  if (r.followOn) {
    const fo = rr.followOn!;
    if (!(fo.sharesK > 0 && fo.proceedsK > 0)) v.push(`${r.id}: follow-on must come from a real share sale in the statements`);
    if (!(fo.price < b[e]!.close)) v.push(`${r.id}: follow-on should be priced below the readout-day close`);
    if (!(b[e + 1]!.low <= fo.price * 1.02)) v.push(`${r.id}: follow-on day should trade down toward the offer price`);
    if (!(fo.runwayAfter !== null && rr.runwayBefore !== null && fo.runwayAfter > rr.runwayBefore * 1.5)) v.push(`${r.id}: follow-on should extend runway`);
  }
  if (r.outcome === "missed") {
    const c = rr.company;
    const after = c.quarters[r.quarterIndex + 1];
    if (!after || !(after.income.rnd < rr.quarter.income.rnd * 0.85)) v.push(`${r.id}: stopping the program should cut R&D the next quarter`);
  }
  return v;
}

/* ---------------- questions (derived from the readout + statements) ---------------- */

export interface ReadoutChoice {
  id: "A" | "B" | "C" | "D";
  label: string;
  feedback?: string;
}

export interface ReadoutQuestion {
  prompt: string;
  choices: ReadoutChoice[];
  answer: ReadoutChoice["id"];
  explanation: string;
  termId: string;
}

/** Risk budget used by the sizing question: the most the learner is willing to lose on one idea, % of the account. */
export const READOUT_RISK_BUDGET_PCT = 1;

const f1 = (x: number) => (Math.round(x * 10) / 10).toFixed(1);
const order = (right: string, wrong: [string, string][], at: number): { choices: ReadoutChoice[]; answer: ReadoutChoice["id"] } => {
  const ids = ["A", "B", "C", "D"] as const;
  const list: { label: string; feedback?: string }[] = wrong.map(([label, feedback]) => ({ label, feedback }));
  list.splice(at, 0, { label: right });
  return { choices: list.map((c, i) => ({ id: ids[i]!, ...c })), answer: ids[at]! };
};

/** Before the readout: size the position, don't predict the outcome. Same lesson for every readout; numbers differ. */
export function sizingQuestion(r: TrialReadout): ReadoutQuestion {
  const im = r.impliedMovePct;
  const right = (READOUT_RISK_BUDGET_PCT / im) * 100;
  const at = r.id.length % 4;
  const { choices, answer } = order(
    `About ${f1(right)}% of the account (budget ÷ implied move)`,
    [
      [`10% of the account, with a stop-loss 10% below`, `A stop cannot protect you here: the price gaps straight past it at the open. A ${im}% gap on 10% of the account loses ${f1(im / 10)}%, not 1%.`],
      [`25% of the account: the statements show plenty of cash`, "Cash runway says the company survives a failure; it says nothing about whether the trial works. Statements cannot predict a readout."],
      [`About ${f1((READOUT_RISK_BUDGET_PCT * im) / 100)}% of the account (budget × implied move)`, "That multiplies instead of dividing: position × move = loss, so position = budget ÷ move."],
    ],
    at,
  );
  return {
    prompt: `${r.trial}: options price a ±${im}% move for the readout day. You decide you can lose at most ${READOUT_RISK_BUDGET_PCT}% of your account on this idea. What is the largest position that keeps a bad outcome near that budget?`,
    choices,
    answer,
    explanation: `Size for the gap, not the stop: ${READOUT_RISK_BUDGET_PCT}% ÷ ${im}% ≈ ${f1(right)}% of the account. A binary event can move further than the implied move, so many traders go smaller still, or simply wait for the data.`,
    termId: "binary-event",
  };
}

/** After the reveal: the follow-up is answered from the statements. */
export function followUpQuestion(r: TrialReadout): ReadoutQuestion {
  const rr = resolveReadout(r);
  if (r.outcome === "met" && rr.followOn) {
    const fo = rr.followOn;
    const prior = rr.lastReported.income.sharesBasic;
    const { choices, answer } = order(
      `${f1(fo.dilution * 100)}% more shares (${fo.sharesK.toLocaleString("en-US")}k ÷ ${prior.toLocaleString("en-US")}k)`,
      [
        [`${f1((fo.sharesK / (prior + fo.sharesK)) * 100)}% more shares`, "That divides by the share count after the sale; dilution is measured against the shares holders owned before."],
        [`None: the money comes from the bank, not from shareholders`, "A follow-on sells NEW shares; the cash comes from new buyers and every existing share now owns a smaller slice."],
        [`${f1((fo.proceedsK / rr.lastReported.balance.cash) * 100)}% more shares`, "That compares the proceeds with the cash pile, not new shares with old shares."],
      ],
      2,
    );
    return {
      prompt: `The next morning ${rr.company.name} sells ${fo.sharesK.toLocaleString("en-US")}k new shares at $${fo.price.toFixed(2)} (${fo.proceedsK.toLocaleString("en-US")}k raised). It had ${prior.toLocaleString("en-US")}k shares before. How much are existing holders diluted?`,
      choices,
      answer,
      explanation: `Dilution = new shares ÷ old shares = ${f1(fo.dilution * 100)}%. In return, cash runway goes from about ${f1(rr.runwayBefore ?? 0)} to ${f1(fo.runwayAfter ?? 0)} months. Raising right after good news costs far fewer shares than raising with months of cash left.`,
      termId: "follow-on-offering",
    };
  }
  if (r.outcome === "missed") {
    const next = rr.company.quarters[r.quarterIndex + 1]!;
    const cut = next.income.rnd / rr.quarter.income.rnd - 1;
    const { choices, answer } = order(
      `Stop KB-207: R&D falls about ${f1(-cut * 100)}% next quarter, stretching runway`,
      [
        ["Keep spending on KB-207 to rescue the secondary endpoints", "Wins on secondary endpoints rarely rescue a missed primary; spending more burns runway the lead program needs."],
        ["Raise money right away at the lower price", `Possible, but the cheapest fix comes first: stop the failed program. With about ${Math.round(rr.runwayBefore ?? 0)} months of runway it does not need to sell shares at the low.`],
        ["Nothing changes: one failed trial does not affect the statements", "It does: the program's trial costs stop, which shows up as lower R&D and slower burn."],
      ],
      1,
    );
    return {
      prompt: `${r.program} missed its primary endpoint. What should you expect in the next quarter's statements?`,
      choices,
      answer,
      explanation: `Kestrel stopped the program; R&D went from ${rr.quarter.income.rnd.toLocaleString("en-US")}k to ${next.income.rnd.toLocaleString("en-US")}k (${f1(cut * 100)}%). Cutting a failed program is how biotechs protect runway for the programs that are left.`,
      termId: "cash-runway",
    };
  }
  const { choices, answer } = order(
    "It passed a futility and safety check; efficacy is still unknown",
    [
      ["The drug works: the committee saw the unblinded data", "The committee only checks whether to stop early. 'Continue' is the default when nothing alarming shows up, not a success call."],
      ["The trial failed but the company is hiding it", "A committee recommending continuation is a real, public step; a hidden failure is not what it means."],
      ["Nothing at all, so the stock cannot move", "It removes one way to fail early, so a small move is normal. It stayed inside the implied move."],
    ],
    3,
  );
  return {
    prompt: `The independent committee recommends ${r.trial.replace(" interim look", "")} "continue as planned". What does that tell you?`,
    choices,
    answer,
    explanation: "An interim 'continue' clears futility and safety bars; the efficacy answer still waits for the final topline readout.",
    termId: "primary-endpoint",
  };
}
