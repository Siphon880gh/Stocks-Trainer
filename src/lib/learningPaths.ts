/**
 * Path / Milestone contracts for agents + UI (E2.M1 / E2.M2 / E5.M6).
 */

import {
  BEGINNER_EQUITIES_MILESTONE_IDS,
  BEGINNER_EQUITIES_PATH_ID,
  DECISION_MAKER_MILESTONE_IDS,
  DECISION_MAKER_PATH_ID,
  MARKET_EXPLORER_MILESTONE_IDS,
  MARKET_EXPLORER_PATH_ID,
} from "./progressStore";

export interface PathMilestoneNode {
  id: string;
  title: string;
  /** Content keys: quiz groups, case packs, etc. */
  contentRefs: string[];
  /** Prior milestone ids that must be complete (empty = first-run unlock) */
  unlockFrom: string[];
  coachTip: string;
}

export interface LearningPathTemplate {
  id: string;
  title: string;
  description: string;
  milestones: PathMilestoneNode[];
}

/** Canonical Beginner Equities Path — IDs align with E3.M1 skeleton. */
export const BEGINNER_EQUITIES_PATH: LearningPathTemplate = {
  id: BEGINNER_EQUITIES_PATH_ID,
  title: "Beginner Equities Path",
  description:
    "Literacy → statements → chart soft-gate → earnings cases → company news cases (SAMPLE).",
  milestones: [
    {
      id: "E4.M1",
      title: "Equities Literacy",
      contentRefs: ["quiz:equity-literacy", "glossary:literacy"],
      unlockFrom: [],
      coachTip: "Learn what a share is, how exchanges work, and match risk to your horizon.",
    },
    {
      id: "E4.M2",
      title: "Statement Snapshot",
      contentRefs: ["quiz:financial-literacy", "snapshot:financial"],
      unlockFrom: ["E4.M1"],
      coachTip: "Read revenue, profit vs cash, and simple P/E before trusting a headline.",
    },
    {
      id: "E4.M0",
      title: "Chart Soft-Gate",
      contentRefs: ["quiz:indicators", "pack:equity-sample"],
      unlockFrom: ["E4.M2"],
      coachTip: "Prove candle/indicator fluency before graded decide-and-reveal cases.",
    },
    {
      id: "E5.M3",
      title: "Earnings Cases",
      contentRefs: ["cases:earnings"],
      unlockFrom: ["E4.M0"],
      coachTip: "Apply statement theory: beat/miss, margins, cash, guidance, balance sheet.",
    },
    {
      id: "E5.M2",
      title: "Company News Cases",
      contentRefs: ["cases:company-news"],
      unlockFrom: ["E5.M3"],
      coachTip: "Practice chase-vs-fade and company headlines on equity underlyings only.",
    },
  ],
};

/** Decision Maker — case-heavy spine (E5.M6 / E2.M2.S4). Chart gate still enforced in player. */
export const DECISION_MAKER_PATH: LearningPathTemplate = {
  id: DECISION_MAKER_PATH_ID,
  title: "Decision Maker Path",
  description:
    "Case spine: earnings → company news → macro intro → combined news+statements (SAMPLE).",
  milestones: [
    {
      id: "E5.M3",
      title: "Earnings Cases",
      contentRefs: ["cases:earnings"],
      unlockFrom: [],
      coachTip: "Start with filings: beat/miss and statement red flags before headlines.",
    },
    {
      id: "E5.M2",
      title: "Company News Cases",
      contentRefs: ["cases:company-news"],
      unlockFrom: ["E5.M3"],
      coachTip: "Headline modes on equities: chase vs fade without macro yet.",
    },
    {
      id: "E5.M2b",
      title: "Macro Intro Cases",
      contentRefs: ["cases:macro-news"],
      unlockFrom: ["E5.M2"],
      coachTip: "Risk-off, prints, and supply shocks — still decide before reveal.",
    },
    {
      id: "E5.M4",
      title: "Combined Cases",
      contentRefs: ["cases:combined"],
      unlockFrom: ["E5.M2b"],
      coachTip: "News + statements together. Horizon mismatch can earn partial credit.",
    },
  ],
};

/** Market Explorer — SAMPLE multi-market practice after chart fluency (E10.M8). */
export const MARKET_EXPLORER_PATH: LearningPathTemplate = {
  id: MARKET_EXPLORER_PATH_ID,
  title: "Market Explorer Path",
  description:
    "SAMPLE multi-market decide practice: chart gate → futures → forex → crypto. Does not replace Beginner Equities (stocks).",
  milestones: [
    {
      id: "E4.M0",
      title: "Chart Soft-Gate",
      contentRefs: ["quiz:indicators"],
      unlockFrom: [],
      coachTip: "Same Indicators soft-gate before any graded SAMPLE decide packs.",
    },
    {
      id: "E10.M5",
      title: "Futures SAMPLE Cases",
      contentRefs: ["cases:futures"],
      unlockFrom: ["E4.M0"],
      coachTip: "Index/commodity-style SAMPLE decisions — still decide before reveal.",
    },
    {
      id: "E10.M6",
      title: "Forex SAMPLE Cases",
      contentRefs: ["cases:forex"],
      unlockFrom: ["E10.M5"],
      coachTip: "Spot FX SAMPLE — not a LIVE FX desk.",
    },
    {
      id: "E10.M7",
      title: "Crypto SAMPLE Cases",
      contentRefs: ["cases:crypto", "cases:options-context"],
      unlockFrom: ["E10.M6"],
      coachTip: "Crypto decide packs; options-context tip is educational only (no chain).",
    },
  ],
};

export const PATH_TEMPLATES: LearningPathTemplate[] = [
  BEGINNER_EQUITIES_PATH,
  DECISION_MAKER_PATH,
  MARKET_EXPLORER_PATH,
];

export function getPathTemplate(pathId: string): LearningPathTemplate | undefined {
  return PATH_TEMPLATES.find((p) => p.id === pathId);
}

export function getPathMilestoneNode(
  milestoneId: string,
  pathId: string = BEGINNER_EQUITIES_PATH_ID
): PathMilestoneNode | undefined {
  return getPathTemplate(pathId)?.milestones.find((m) => m.id === milestoneId);
}

export function milestoneOrderForPath(pathId: string): readonly string[] {
  if (pathId === DECISION_MAKER_PATH_ID) return DECISION_MAKER_MILESTONE_IDS;
  if (pathId === MARKET_EXPLORER_PATH_ID) return MARKET_EXPLORER_MILESTONE_IDS;
  return BEGINNER_EQUITIES_MILESTONE_IDS;
}

/** Agent-readable snapshot of a path graph. */
export function exportPathSnapshot(pathId: string = BEGINNER_EQUITIES_PATH_ID): {
  pathId: string;
  title: string;
  milestoneOrder: readonly string[];
  milestones: PathMilestoneNode[];
} | null {
  const template = getPathTemplate(pathId);
  if (!template) return null;
  return {
    pathId: template.id,
    title: template.title,
    milestoneOrder: milestoneOrderForPath(pathId),
    milestones: template.milestones,
  };
}

/** @deprecated use exportPathSnapshot */
export function exportBeginnerPathSnapshot() {
  return exportPathSnapshot(BEGINNER_EQUITIES_PATH_ID)!;
}
