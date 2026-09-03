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
    "Traditional retail stocks: Equities literacy → statements → Indicators → earnings pack → company-news pack (SAMPLE).",
  milestones: [
    {
      id: "E4.M1",
      title: "Equities Literacy",
      contentRefs: ["quiz:equity-literacy", "glossary:literacy"],
      unlockFrom: [],
      coachTip:
        "Open Training → Equities literacy. Optional Coach → Name the equity building blocks. Archive terms sit under Reference.",
    },
    {
      id: "E4.M2",
      title: "Statement Snapshot",
      contentRefs: ["quiz:financial-literacy", "snapshot:financial"],
      unlockFrom: ["E4.M1"],
      coachTip:
        "Open Training → Statements literacy, then Coach → Read a SAMPLE company snapshot. Profit vs cash before any earnings case.",
    },
    {
      id: "E4.M0",
      title: "Chart Fluency",
      contentRefs: ["quiz:indicators", "pack:equity-sample"],
      unlockFrom: ["E4.M2"],
      coachTip:
        "Open Training → Indicators, then Charts on a SAMPLE equity pack. Coach → Why Indicators come before cases.",
    },
    {
      id: "E5.M3",
      title: "Earnings Cases",
      contentRefs: ["cases:earnings"],
      unlockFrom: ["E4.M0"],
      coachTip:
        "Open Cases → earnings. Start with beat or miss. Coach → Beat vs miss on a SAMPLE report.",
    },
    {
      id: "E5.M2",
      title: "Company News Cases",
      contentRefs: ["cases:company-news"],
      unlockFrom: ["E5.M3"],
      coachTip:
        "Open Cases → company news. Coach → Chase vs fade a company headline.",
    },
  ],
};

/** Decision Maker — case-heavy spine (E5.M6 / E2.M2.S4). Chart gate still enforced in player. */
export const DECISION_MAKER_PATH: LearningPathTemplate = {
  id: DECISION_MAKER_PATH_ID,
  title: "Decision Maker Path",
  description:
    "Decision practice on stocks: earnings pack → company-news → market-wide news → news plus financials (SAMPLE). Indicators quiz still gates graded cases.",
  milestones: [
    {
      id: "E5.M3",
      title: "Earnings Cases",
      contentRefs: ["cases:earnings"],
      unlockFrom: [],
      coachTip:
        "Open Cases → earnings (beginner and intermediate). Coach → Beat vs miss, or Revenue up, margin down.",
    },
    {
      id: "E5.M2",
      title: "Company News Cases",
      contentRefs: ["cases:company-news"],
      unlockFrom: ["E5.M3"],
      coachTip:
        "Open Cases → company news. Coach → Chase vs fade a company headline. Skip market-wide news until this pack is done.",
    },
    {
      id: "E5.M2b",
      title: "Macro Intro Cases",
      contentRefs: ["cases:macro-news"],
      unlockFrom: ["E5.M2"],
      coachTip:
        "Open Cases → market-wide news. Coach → Stock versus a scared tape, Map a SAMPLE data print, or Who benefits from a supply shock.",
    },
    {
      id: "E5.M4",
      title: "Combined Cases",
      contentRefs: ["cases:combined"],
      unlockFrom: ["E5.M2b"],
      coachTip:
        "Open Cases → news plus financials. Coach → Headline plus snapshot. A different time frame can earn partial credit.",
    },
  ],
};

/** Market Explorer — SAMPLE multi-market practice after chart fluency (E10.M8). */
export const MARKET_EXPLORER_PATH: LearningPathTemplate = {
  id: MARKET_EXPLORER_PATH_ID,
  title: "Market Explorer Path",
  description:
    "SAMPLE multi-market decide practice: Indicators → futures pack → forex pack → crypto pack. Does not replace Beginner Equities (traditional stocks).",
  milestones: [
    {
      id: "E4.M0",
      title: "Chart Fluency",
      contentRefs: ["quiz:indicators"],
      unlockFrom: [],
      coachTip:
        "Open Training → Indicators before any graded SAMPLE decide pack. Coach → Why Indicators come before cases.",
    },
    {
      id: "E10.M5",
      title: "Futures SAMPLE Cases",
      contentRefs: ["cases:futures"],
      unlockFrom: ["E4.M0"],
      coachTip:
        "Open Cases → futures. Coach → Frame a SAMPLE futures decision. Index and commodity tapes, not a live desk.",
    },
    {
      id: "E10.M6",
      title: "Forex SAMPLE Cases",
      contentRefs: ["cases:forex"],
      unlockFrom: ["E10.M5"],
      coachTip:
        "Open Cases → forex. Coach → Frame a SAMPLE forex decision. Practice pairs only — not a live FX desk.",
    },
    {
      id: "E10.M7",
      title: "Crypto SAMPLE Cases",
      contentRefs: ["cases:crypto", "cases:options-context"],
      unlockFrom: ["E10.M6"],
      coachTip:
        "Open Cases → crypto, then options context (event and vol on the stock, no chain). Coach → Chase vs fade SAMPLE crypto hype, or Event risk without an options chain.",
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
