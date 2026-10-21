/**
 * MF9.M1: Coach decision tree "CPI morning" (preview → print → yields → your stock) on the existing
 * deterministic coaching infra. Every number comes from the SIMULATED release cpi-16 (headline hot,
 * core cool — the detail decides), its reaction rules and its seeded reaction charts, so the coach,
 * the Macro Desk lesson and the reaction game always agree. Not trading advice.
 */
import type { CoachingSession } from "../coaching/types";
import { getRelease } from "./releases";
import { reactionForEvent } from "./reactions";
import { intradayChart } from "./reactionCharts";
import { MACRO_ROUNDS } from "./game";
import { getMacroSource } from "./sources";

export const CPI_MORNING_EVENT_ID = "cpi-16";
const pm = (n: number) => `${n < 0 ? "−" : "+"}${Math.abs(n).toFixed(1)}%`;
const word = (d: string) => (d === "up" ? "higher" : d === "down" ? "lower" : "little changed");

function build(): CoachingSession {
  const e = getRelease(CPI_MORNING_EVENT_ID);
  if (!e || e.kind !== "cpi" || e.twist !== "details-reverse") throw new Error(`coachCpiMorning: ${CPI_MORNING_EVENT_ID} must be a details-reverse CPI release`);
  const head = e.headline;
  const core = e.details.find((m) => m.key === "core");
  if (!core) throw new Error("coachCpiMorning: missing core detail");
  const rx = reactionForEvent(e);
  const y2 = intradayChart(e, "us2y");
  const y10 = intradayChart(e, "us10y");
  const tech = intradayChart(e, "growth-tech");
  const bp = (c: typeof y2) => `${c.net < 0 ? "−" : "+"}${Math.round(Math.abs(c.net) * 100)} bp`;
  const pctMove = (c: typeof tech) => pm((c.net / c.preClose) * 100);
  const roundNo = MACRO_ROUNDS.findIndex((r) => r.eventId === e.id) + 1;
  const src = getMacroSource(e.sourceId);

  return {
    meta: {
      slug: "cpi-morning",
      title: "CPI morning: preview, print, yields, your stock",
      summary: `Walk one SIMULATED CPI release (${e.period}, ${e.regime.replace(/-/g, " ")} regime) from the consensus to the print to yields to a growth stock. Numbers match the Macro Desk.`,
      topic: "Macro releases",
      tags: ["equities", "macro", "cpi", "rates"],
    },
    tree: {
      start: "preview",
      nodes: {
        preview: {
          message:
            `SIMULATED preview · CPI for ${e.period}, out at ${e.releaseTimeET} ET${src ? ` (the real one: ${src.agency}, ${src.url})` : ""}.\n` +
            `Consensus: headline ${pm(head.consensus)} m/m, core ${pm(core.consensus)} m/m. The market is in an inflation-worry regime: it trades every print through "what will the Fed do?".\n\n` +
            "What do you do before 8:30?",
          outcome: "continue",
          choices: [
            { label: "Buy growth stocks now: inflation has to cool eventually", next: "wrong_guess" },
            { label: "Write down the consensus and decide which line the market will trade (core) before the number hits", next: "plan" },
            { label: "Ignore it: one month of CPI never moves anything", next: "wrong_ignore" },
          ],
        },
        wrong_guess: {
          message: "Positioning before a binary print is a guess, not a plan. Know the consensus and which line matters first.",
          outcome: "wrong",
          choices: [],
          rewind_to: "preview",
        },
        wrong_ignore: {
          message: "In an inflation-focused regime CPI is often the biggest scheduled event of the month for yields, and yields drive valuations.",
          outcome: "wrong",
          choices: [],
          rewind_to: "preview",
        },
        plan: {
          message: "Why does core (ex food and energy) usually matter more to the market than the headline?",
          outcome: "continue",
          choices: [
            { label: "Core strips out the noisiest prices, so it says more about where inflation is heading — and the Fed watches it", next: "print" },
            { label: "Core is always higher, so it is scarier", next: "wrong_core" },
          ],
        },
        wrong_core: {
          message: "Core can print above or below the headline. It matters because it is less noisy and closer to the trend the Fed is fighting.",
          outcome: "wrong",
          choices: [],
          rewind_to: "plan",
        },
        print: {
          message:
            `8:30 — the print: headline ${pm(head.actual)} vs ${pm(head.consensus)} expected (hot); core ${pm(core.actual)} vs ${pm(core.consensus)} (cool). ` +
            "The headline flashes red first.\n\nHow do you read it?",
          outcome: "continue",
          choices: [
            { label: "Hot headline: sell everything before the Fed hikes", next: "wrong_headline" },
            { label: "The detail the market cares about (core) came in cooler: the read is cool, whatever the first tick says", next: "yields" },
          ],
        },
        wrong_headline: {
          message: "Headline-only reactions often reverse once traders reach core. Read the whole release before you act.",
          outcome: "wrong",
          choices: [],
          rewind_to: "print",
        },
        yields: {
          message: "Cooler core lowers the expected path of Fed policy. Which yield usually moves most?",
          outcome: "continue",
          choices: [
            { label: "The 2-year: it tracks expected Fed policy most closely", next: "stock" },
            { label: "The 30-year mortgage rate, the same minute", next: "wrong_mortgage" },
          ],
        },
        wrong_mortgage: {
          message: "Mortgage rates follow the 10-year with a lag of days; the weekly survey shows it later. The 2-year reprices first.",
          outcome: "wrong",
          choices: [],
          rewind_to: "yields",
        },
        stock: {
          message:
            `By the close in this simulation: 2-year ${bp(y2)}, 10-year ${bp(y10)}, dollar ${word(rx.moves.dollar)}. ` +
            `You own a long-duration growth stock. The growth-tech basket finished ${pctMove(tech)} after a ${rx.archetype === "reversal" ? "headline dip that reversed" : "move"}.\n\n` +
            "Why did it move that way?",
          outcome: "continue",
          choices: [
            { label: "Lower yields lower the discount rate on far-off earnings, which tends to help long-duration stocks most", next: "success" },
            { label: "CPI changed this quarter's earnings", next: "wrong_earnings" },
          ],
        },
        wrong_earnings: {
          message: "One CPI print doesn't change this quarter's earnings. It changes the rate the market discounts future earnings at.",
          outcome: "wrong",
          choices: [],
          rewind_to: "stock",
        },
        success: {
          message:
            "Session complete: consensus → which line matters → print → yields → your stock. In a different regime (say, growth fear) the same print can trade differently, so name the regime first.\n\n" +
            `Next: Macro Desk → Consumer prices (CPI)${roundNo > 0 ? `, reaction game round ${roundNo} (this release)` : ""}, and Learn → Macro Market Reactions.`,
          outcome: "success",
          choices: [],
        },
      },
    },
  };
}

export const cpiMorningSession: CoachingSession = build();
export default cpiMorningSession;
