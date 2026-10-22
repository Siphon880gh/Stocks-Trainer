/** BA10.M4: one-line Home tip naming the Beginner Academy. Pure (state injected) so tests pin the text and route. */
import type { AcademyState } from "./storage";
import { academySummary, nextUnit } from "./progress";
import { getUnit } from "./content/levels";

export interface AcademyHomeTip {
  text: string;
  to: string;
  linkLabel: string;
}

export function academyHomeTip(state: AcademyState): AcademyHomeTip {
  const s = academySummary(state);
  const next = nextUnit(state);
  const u = next ? getUnit(next) : undefined;
  if (s.unitsDone === 0)
    return { text: "New: the Beginner Academy — short units from what a stock is to options basics, plus paper trading with virtual money.", to: "/academy", linkLabel: "Open the Academy" };
  if (u) return { text: `Beginner Academy: ${s.unitsDone}/${s.units} units done.`, to: `/academy/${u.id}`, linkLabel: `Continue with ${u.title}` };
  return { text: `Beginner Academy: all ${s.units} units done. Keep the habit with paper trading and the weekly challenge.`, to: "/paper/challenges", linkLabel: "Open challenges" };
}
