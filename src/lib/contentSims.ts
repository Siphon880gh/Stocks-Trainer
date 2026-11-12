/**
 * Every simulation outside Tool Training, in one list: market themes, macro lessons, Academy units and the VIX page.
 * Each set names the page it lives on, its underlined triggers and its walks, so tests (and the docs count) check
 * them with the same `simSetProblems` rules Tool Training uses. Tool Training lessons stay in `TOOL_LESSONS`.
 */
import { MARKET_THEMES, themeSimRefs } from "./marketThemes";
import { MACRO_LESSONS } from "./macro/lessons";
import { UNITS } from "./academy/content/levels";
import { VIX_SHORTING_LEAD, VIX_SIMULATIONS } from "./vixTrading";
import { simSetProblems, toolTextPlain, toolTextRefs } from "./toolTraining/simWalk";
import type { SimRef, ToolSimulation } from "./toolTraining/types";

export interface ContentSimSet {
  /** Theme, lesson or unit id. */
  owner: string;
  area: "market-theme" | "macro" | "academy" | "practice";
  route: string;
  refs: SimRef[];
  sims: ToolSimulation[];
  /** Copy whose rich runs must read exactly like its plain text. */
  pairs: { plain: string; rich: string; where: string }[];
}

export const CONTENT_SIM_SETS: ContentSimSet[] = [
  ...MARKET_THEMES.filter((t) => t.simulations?.length).map((t) => ({
    owner: t.id,
    area: "market-theme" as const,
    route: t.route,
    refs: themeSimRefs(t),
    sims: t.simulations ?? [],
    pairs: [...t.drivers, ...t.bridges, ...t.caveats].filter((c) => c.rich).map((c) => ({ plain: c.text, rich: toolTextPlain(c.rich!), where: c.title })),
  })),
  ...MACRO_LESSONS.filter((l) => l.simulations?.length).map((l) => ({
    owner: l.id,
    area: "macro" as const,
    route: `/macro/${l.id}`,
    refs: l.reactionRich ? toolTextRefs(l.reactionRich) : [],
    sims: l.simulations ?? [],
    pairs: l.reactionRich ? [{ plain: l.reaction, rich: toolTextPlain(l.reactionRich), where: "reaction" }] : [],
  })),
  ...UNITS.filter((u) => u.simulations?.length).map((u) => ({
    owner: u.id,
    area: "academy" as const,
    route: `/academy/${u.id}`,
    refs: u.cards.flatMap((c) => (c.leadRich ? toolTextRefs(c.leadRich) : [])),
    sims: u.simulations ?? [],
    pairs: u.cards.filter((c) => c.leadRich).map((c) => ({ plain: c.body.split(/\n\n+/)[0]!, rich: toolTextPlain(c.leadRich!), where: c.title })),
  })),
  {
    owner: "vix-trading",
    area: "practice",
    route: "/practice/vix-trading",
    refs: toolTextRefs(VIX_SHORTING_LEAD),
    sims: VIX_SIMULATIONS,
    pairs: [],
  },
];

export const CONTENT_SIMS: ToolSimulation[] = CONTENT_SIM_SETS.flatMap((s) => s.sims);

/** Problems across every set; empty when all walks are well-formed and every rich run matches its plain copy. */
export function contentSimProblems(): string[] {
  const out = CONTENT_SIM_SETS.flatMap((s) => simSetProblems(s.owner, s.refs, s.sims));
  for (const s of CONTENT_SIM_SETS) for (const p of s.pairs) if (p.plain !== p.rich) out.push(`${s.owner} / ${p.where}: rich copy differs from plain`);
  const ids = CONTENT_SIMS.map((s) => s.id);
  if (new Set(ids).size !== ids.length) out.push("duplicate simulation id across pages");
  return out;
}
