/**
 * "Read the Print" game rounds (FE5.M1). One round per earnings event.
 * The answer key, step-3 answer, fact list and wrong-option feedback are DERIVED from the event + chart, never typed.
 * SAMPLE / STYLIZED — fictional companies, not a live filing, not trading advice.
 */
import { EARNINGS_EVENTS, eventById, midpoint, resolveEvent, type EarningsEvent, type GapDirection, type ReactionArchetype } from "./earningsEvents";
import { fmtEps, fmtK } from "./format";
import { EVENT_INDEX, generateReaction, type ReactionChart } from "./reactionCharts";

export type PrintOptionId = "A" | "B" | "C" | "D" | "E";

export interface PrintOption {
  id: PrintOptionId;
  label: string;
  short: string;
}

export const PRINT_OPTIONS: PrintOption[] = [
  { id: "A", label: "Gap up & hold", short: "gap up and hold" },
  { id: "B", label: "Gap up then fade", short: "gap up then fade" },
  { id: "C", label: "Gap down & keep falling", short: "gap down and keep falling" },
  { id: "D", label: "Gap down then fill", short: "gap down then fill" },
  { id: "E", label: "Muted (inside the implied move)", short: "a muted move" },
];

export type FollowThrough = "with" | "against" | "chop";
export const FOLLOW_OPTIONS: { id: FollowThrough; label: string }[] = [
  { id: "with", label: "Drift WITH the gap" },
  { id: "against", label: "Move AGAINST the gap" },
  { id: "chop", label: "Chop / no follow-through" },
];

/** Step-2 answer from the archetype + gap direction. */
export function answerFor(archetype: ReactionArchetype, direction: GapDirection): PrintOptionId {
  switch (archetype) {
    case "muted":
      return "E";
    case "gap-and-go":
    case "pead-drift":
      return direction === "up" ? "A" : "C";
    case "sell-the-news":
    case "guidance-reversal":
      return "B";
    case "gap-fill":
      return direction === "up" ? "B" : "D";
  }
}

/** Step-3 answer (next 5 sessions after the report) from the archetype. */
export function followFor(archetype: ReactionArchetype): FollowThrough {
  switch (archetype) {
    case "gap-and-go":
    case "pead-drift":
      return "with";
    case "muted":
      return "chop";
    default:
      return "against";
  }
}

export const FOLLOW_WINDOW = 5;

export interface PrintRound {
  id: string;
  eventId: string;
  prompt: string;
  answer: PrintOptionId;
  followPrompt: string;
  followAnswer: FollowThrough;
  /** Leads with what mattered, then the facts from the round's own data. */
  explanation: string;
  /** Facts built from the preview / statements shown in the round (also checked by tests). */
  facts: string[];
  feedback: Partial<Record<PrintOptionId, string>>;
  disclaimer: string;
}

export const PRINT_DISCLAIMER = "SAMPLE / STYLIZED — fictional company, not a live filing, not trading advice.";

function factsFor(event: EarningsEvent): string[] {
  const r = resolveEvent(event);
  const x = event.expect;
  const facts = [
    `EPS ${fmtEps(r.actualEps)} vs ${fmtEps(x.consensusEps)} expected (${r.eps})`,
    `Revenue ${fmtK(r.actualRevenue)} vs ${fmtK(x.consensusRevenue)} expected (${r.revenue})`,
    `Next-quarter guide midpoint ${fmtK(midpoint(event.newGuidance))} vs street ${fmtK(event.nextQuarterConsensusRevenue)} (${r.guidance})`,
    `Run-up into the print ${x.runUpPct > 0 ? "+" : ""}${x.runUpPct}% against an implied move of ±${x.impliedMovePct}%`,
  ];
  for (const k of r.kpiActuals) {
    const f = (v: number) => (k.unit === "pct" ? `${v}%` : k.unit === "ratio" ? v.toFixed(2) : fmtK(v));
    facts.push(`${k.label} ${f(k.actual)} vs ${f(k.expected)} wanted`);
  }
  return facts;
}

function feedbackFor(option: PrintOption, answer: PrintOptionId, event: EarningsEvent, rc: ReactionChart): string {
  const r = resolveEvent(event);
  const gapPct = (rc.gap * 100).toFixed(1);
  const im = event.expect.impliedMovePct;
  const pickedUp = option.id === "A" || option.id === "B";
  const pickedDown = option.id === "C" || option.id === "D";
  if (option.id === "E") return `Not muted: the stock opened ${gapPct}% away, at or beyond the ±${im}% implied move.`;
  if (answer === "E") return `Too dramatic: in-line numbers (EPS ${r.eps}, guidance ${r.guidance}) gave nobody a reason to move far, and the open was only ${gapPct}%.`;
  if ((pickedUp && rc.direction === "down") || (pickedDown && rc.direction === "up"))
    return `Wrong direction: it gapped ${rc.direction} (${gapPct}%) on an EPS ${r.eps} with guidance ${r.guidance}.`;
  // right direction, wrong follow-through
  if (option.id === "A" || option.id === "C")
    return event.expect.runUpPct >= 8
      ? `It did gap ${rc.direction}, but after a ${event.expect.runUpPct}% run-up there were few new buyers left to hold it.`
      : r.guidance === "cut"
        ? "It did gap on the headline, but the guidance cut gave holders a reason to sell into the open."
        : `It did gap ${rc.direction}, but with guidance only ${r.guidance} nothing new kept it going.`;
  return `It did gap ${rc.direction}, but the news was strong enough (EPS ${r.eps}, guidance ${r.guidance}) that buyers/sellers kept pressing instead of fading it.`;
}

/** Round order: mixes companies and answers so the same letter rarely repeats. */
export const ROUND_ORDER = [
  "nwcl-q2fy25",
  "hbpn-q2fy26",
  "irbg-q3fy25",
  "nwcl-q4fy25",
  "hbpn-q3fy26",
  "irbg-q1fy26",
  "hbpn-q4fy25",
  "nwcl-q3fy26",
  "irbg-q2fy26",
  "hbpn-q1fy26",
  "nwcl-q4fy26",
  "irbg-q3fy26",
  "nwcl-q1fy26",
  "hbpn-q4fy26",
];

export function buildRound(event: EarningsEvent): PrintRound {
  const r = resolveEvent(event);
  const rc = generateReaction(event);
  const answer = answerFor(event.reaction, rc.direction);
  const facts = factsFor(event);
  const feedback: Partial<Record<PrintOptionId, string>> = {};
  for (const o of PRINT_OPTIONS) if (o.id !== answer) feedback[o.id] = feedbackFor(o, answer, event, rc);
  return {
    id: `rtp-${event.id}`,
    eventId: event.id,
    prompt: `${r.company.name} (${r.company.ticker}) reports ${r.quarter.label}. Read the last quarters, the preview and the chart into the print. How does the stock trade on the report?`,
    answer,
    followPrompt: `And over the next ${FOLLOW_WINDOW} sessions?`,
    followAnswer: followFor(event.reaction),
    explanation: `What mattered: ${event.whatMattered}`,
    facts,
    feedback,
    disclaimer: PRINT_DISCLAIMER,
  };
}

export const PRINT_ROUNDS: PrintRound[] = ROUND_ORDER.map((id) => {
  const e = eventById(id);
  if (!e) throw new Error(`unknown event ${id}`);
  return buildRound(e);
});

/** 5-bar return after the report close, used to check the step-3 key against the chart. */
export function followReturn(rc: ReactionChart): number {
  return rc.bars[EVENT_INDEX + FOLLOW_WINDOW]!.close / rc.bars[EVENT_INDEX]!.close - 1;
}

export function roundById(id: string): PrintRound | undefined {
  return PRINT_ROUNDS.find((r) => r.id === id);
}

export { EARNINGS_EVENTS };
