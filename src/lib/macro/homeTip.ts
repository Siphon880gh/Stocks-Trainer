/** MF9.M3: Home tip naming the Macro Desk. Pure (progress injected) so tests can pin the text and route. */
import { MACRO_ROUNDS } from "./game";
import { getLesson } from "./lessons";
import { progressSummary, type MacroProgress } from "./macroProgress";

export interface MacroHomeTip {
  text: string;
  to: string;
  linkLabel: string;
}

export function macroHomeTip(p: MacroProgress): MacroHomeTip {
  const ids = MACRO_ROUNDS.map((r) => r.id);
  const s = progressSummary(p, ids);
  if (s.completed === 0) {
    const l = getLesson("employment-situation");
    return {
      text: "New: the Macro Desk — open a real jobs, CPI or Fed release, read a SIMULATED look-alike, then call how yields and stocks react.",
      to: l ? `/macro/${l.id}` : "/macro",
      linkLabel: l ? `Start with ${l.title}` : "Open the Macro Desk",
    };
  }
  if (s.completed < s.of) {
    const next = MACRO_ROUNDS.findIndex((r) => !p.rounds[r.id]);
    return {
      text: `Macro Desk: ${s.completed}/${s.of} reaction rounds played (${s.correct}/${s.total} best calls).`,
      to: next >= 0 ? `/macro/play?round=${MACRO_ROUNDS[next]!.id}` : "/macro/play",
      linkLabel: next >= 0 ? `Continue with round ${next + 1}` : "Keep playing",
    };
  }
  return {
    text: `Macro Desk complete: ${s.correct}/${s.total} best calls. Replay a regime you missed, or quiz yourself on Macro Market Reactions.`,
    to: "/training?group=macro-reactions&start=1",
    linkLabel: "Macro Market Reactions quiz",
  };
}
