/**
 * FE8.M2: Coach decision tree "Earnings week" (preview → print → reaction) on the existing
 * deterministic coaching infra. Every number is computed from the Ironbridge Q1 FY26 fixture
 * (guidance-reversal event), so the coach and Read the Print always agree.
 * SAMPLE / STYLIZED: fictional company, not trading advice.
 */
import type { CoachingSession } from "../coaching/types";
import { eventById, midpoint, resolveEvent } from "./earningsEvents";
import { EVENT_INDEX, generateReaction } from "./reactionCharts";
import { PRINT_ROUNDS } from "./readThePrint";

export const EARNINGS_WEEK_EVENT_ID = "irbg-q1fy26";
const k = (n: number) => `${Math.round(n).toLocaleString("en-US")}k`;
const usd = (n: number) => `$${n.toFixed(2)}`;
const pct = (x: number) => `${x < 0 ? "−" : "+"}${Math.abs(x * 100).toFixed(1)}%`;

function build(): CoachingSession {
  const e = eventById(EARNINGS_WEEK_EVENT_ID);
  if (!e) throw new Error(`coachEarningsWeek: missing ${EARNINGS_WEEK_EVENT_ID}`);
  const r = resolveEvent(e);
  const rc = generateReaction(e);
  const bar = rc.bars[EVENT_INDEX]!;
  const kpi = r.kpiActuals[0]!;
  const im = e.expect.impliedMovePct / 100;
  const guide = midpoint(e.newGuidance) / e.nextQuarterConsensusRevenue - 1;
  const roundNo = PRINT_ROUNDS.findIndex((x) => x.eventId === e.id) + 1;
  const t = r.company.ticker;

  return {
    meta: {
      slug: "earnings-week",
      title: "Earnings week: preview, print, reaction",
      summary: `Walk one SAMPLE report (${r.company.name}, ${r.quarter.label}) from the preview to the print to the stock's reaction. Numbers match Read the Print.`,
      topic: "Earnings decisions",
      tags: ["equities", "earnings", "guidance", "financials"],
    },
    tree: {
      start: "preview",
      nodes: {
        preview: {
          message:
            `SAMPLE preview · ${t} reports ${r.quarter.label}.\n` +
            `Consensus EPS ${usd(e.expect.consensusEps)}, revenue ${k(e.expect.consensusRevenue)}; the company guided ${k(e.expect.priorGuidance.low)}–${k(e.expect.priorGuidance.high)}. ` +
            `Options imply ±${e.expect.impliedMovePct}% from the ${usd(e.priorClose)} close; the stock ran ${pct(e.expect.runUpPct / 100)} into the print. ` +
            `Street watch: ${kpi.label} ${kpi.expected.toFixed(2)}. Positioning: ${e.expect.positioning}\n\n` +
            "What do you do before the print?",
          outcome: "continue",
          choices: [
            { label: "Buy ahead: everyone is long the story, it must beat", next: "wrong_bet" },
            { label: "Write down what would change my mind: EPS vs consensus, the guide vs the street, and the KPI", next: "plan" },
            { label: "Treat the implied move as a promise of how far it will go", next: "wrong_band" },
          ],
        },
        wrong_bet: {
          message: "A crowded long is a reason the bar is high, not a reason it will beat. Decide what you're watching first.",
          outcome: "wrong",
          choices: [],
          rewind_to: "preview",
        },
        wrong_band: {
          message: `±${e.expect.impliedMovePct}% is the options market's guess at the size of the move, not a limit and not a direction.`,
          outcome: "wrong",
          choices: [],
          rewind_to: "preview",
        },
        plan: {
          message:
            `Your band: ${usd(e.priorClose * (1 - im))}–${usd(e.priorClose * (1 + im))}. ` +
            `For an industrial with a backlog, which line moves the stock most?`,
          outcome: "continue",
          choices: [
            { label: "This quarter's EPS", next: "wrong_eps" },
            { label: `Next quarter's guidance and ${kpi.label.toLowerCase()}`, next: "print" },
          ],
        },
        wrong_eps: {
          message: "EPS is last quarter. The market prices the next one: guidance and orders tell you about it.",
          outcome: "wrong",
          choices: [],
          rewind_to: "plan",
        },
        print: {
          message:
            `The print: EPS ${usd(r.actualEps)} vs ${usd(e.expect.consensusEps)} (${r.eps}), revenue ${k(r.actualRevenue)} (${r.revenue}). ` +
            `New guide ${k(e.newGuidance.low)}–${k(e.newGuidance.high)} vs the street's ${k(e.nextQuarterConsensusRevenue)}: midpoint ${pct(guide)} (${r.guidance}). ` +
            `${kpi.label} ${kpi.actual.toFixed(2)}. The stock opens at ${usd(bar.open)} (${pct(bar.open / rc.priorClose - 1)}).\n\n` +
            "How do you read it?",
          outcome: "continue",
          choices: [
            { label: "Beat: buy the open", next: "wrong_buy_open" },
            { label: "The beat came from costs; the guide cut and weak orders are what the market will price", next: "reaction" },
          ],
        },
        wrong_buy_open: {
          message: "The open is the headline reaction. The guide cut hasn't been digested yet: read the whole print first.",
          outcome: "wrong",
          choices: [],
          rewind_to: "print",
        },
        reaction: {
          message:
            `By the close it's ${usd(bar.close)}, ${pct(bar.close / rc.priorClose - 1)} vs the prior close, on heavy volume.\n\n` +
            "What is this, and what follows from it?",
          outcome: "continue",
          choices: [
            { label: "A gap fill: gaps always fill, so buy it", next: "wrong_fill" },
            { label: "A guidance reversal: respect it and don't average down into a cut", next: "success" },
          ],
        },
        wrong_fill: {
          message: "Not every gap fills, and this one reversed through the prior close on a cut. Name what happened first.",
          outcome: "wrong",
          choices: [],
          rewind_to: "reaction",
        },
        success: {
          message:
            "Session complete: preview → plan → print → reaction, with the guide beating the headline.\n\n" +
            `Next: Practice → Read the Print${roundNo > 0 ? ` (round ${roundNo} is this report)` : ""}, and Learn → Earnings Reactions.`,
          outcome: "success",
          choices: [],
        },
      },
    },
  };
}

export const earningsWeekSession: CoachingSession = build();
export default earningsWeekSession;
