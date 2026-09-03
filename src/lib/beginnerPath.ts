import {
  BEGINNER_EQUITIES_MILESTONE_IDS,
  BEGINNER_EQUITIES_PATH_ID,
  DECISION_MAKER_MILESTONE_IDS,
  DECISION_MAKER_PATH_ID,
  getMilestoneStatus,
  getPathId,
  isDecisionMakerPathComplete,
  isMarketExplorerPathComplete,
  loadProgress,
  MARKET_EXPLORER_MILESTONE_IDS,
  MARKET_EXPLORER_PATH_ID,
  milestoneOrderForPathId,
  type BeginnerEquitiesMilestoneId,
  type MilestoneStatus,
} from "./progressStore";
import {
  BEGINNER_EQUITIES_PATH,
  DECISION_MAKER_PATH,
  getPathMilestoneNode,
  getPathTemplate,
  MARKET_EXPLORER_PATH,
  type PathMilestoneNode,
} from "./learningPaths";
import type { QuizGroupId } from "./quizData";
import type { CasePackId } from "./caseStudies";
import type { AssetClass } from "./samplePacks";

export interface PathMilestoneDef {
  id: string;
  title: string;
  summary: string;
  contentRefs: string[];
  unlockFrom: string[];
  coachTip: string;
  /** Training deep-link group when this step is a quiz gate */
  trainingGroup?: QuizGroupId;
  /** True for graded decision case packs (soft-gated by E4.M0) */
  isGradedCasePack: boolean;
  casesPack?: CasePackId;
}

function nodeToDef(
  node: PathMilestoneNode,
  extras: Pick<
    PathMilestoneDef,
    "summary" | "trainingGroup" | "isGradedCasePack" | "casesPack"
  >
): PathMilestoneDef {
  return {
    id: node.id,
    title: node.title,
    contentRefs: node.contentRefs,
    unlockFrom: node.unlockFrom,
    coachTip: node.coachTip,
    ...extras,
  };
}

/** UI + gate view of Beginner Equities (backed by E2.M1 template). */
export const BEGINNER_PATH_MILESTONES: PathMilestoneDef[] =
  BEGINNER_EQUITIES_PATH.milestones.map((node) => {
    if (node.id === "E4.M1") {
      return nodeToDef(node, {
        summary: "Stocks, exchanges, long/short, risk & horizon",
        trainingGroup: "equity-literacy",
        isGradedCasePack: false,
      });
    }
    if (node.id === "E4.M2") {
      return nodeToDef(node, {
        summary: "Revenue, profit vs cash, P/E & margin (SAMPLE cards)",
        trainingGroup: "financial-literacy",
        isGradedCasePack: false,
      });
    }
    if (node.id === "E4.M0") {
      return nodeToDef(node, {
        summary: "Candle/indicator fluency via Training (required before cases)",
        trainingGroup: "indicators",
        isGradedCasePack: false,
      });
    }
    if (node.id === "E5.M3") {
      return nodeToDef(node, {
        summary: "Graded decide-and-reveal (earnings / financials)",
        isGradedCasePack: true,
        casesPack: "earnings",
      });
    }
    return nodeToDef(node, {
      summary: "Thin company-news decide-and-reveal packs",
      isGradedCasePack: true,
      casesPack: "company-news",
    });
  });

/** Decision Maker spine UI defs (E5.M6). */
export const DECISION_MAKER_PATH_MILESTONES: PathMilestoneDef[] =
  DECISION_MAKER_PATH.milestones.map((node) => {
    if (node.id === "E5.M3") {
      return nodeToDef(node, {
        summary: "Earnings / financials decide-and-reveal",
        isGradedCasePack: true,
        casesPack: "earnings",
      });
    }
    if (node.id === "E5.M2") {
      return nodeToDef(node, {
        summary: "Company-news decide-and-reveal",
        isGradedCasePack: true,
        casesPack: "company-news",
      });
    }
    if (node.id === "E5.M2b") {
      return nodeToDef(node, {
        summary: "Macro / geopolitics intro cases",
        isGradedCasePack: true,
        casesPack: "macro-news",
      });
    }
    return nodeToDef(node, {
      summary: "Combined news + statements; horizon partial credit",
      isGradedCasePack: true,
      casesPack: "combined",
    });
  });

/** Market Explorer spine UI defs (E10.M8). */
export const MARKET_EXPLORER_PATH_MILESTONES: PathMilestoneDef[] =
  MARKET_EXPLORER_PATH.milestones.map((node) => {
    if (node.id === "E4.M0") {
      return nodeToDef(node, {
        summary: "Indicators quiz before multi-market SAMPLE cases",
        trainingGroup: "indicators",
        isGradedCasePack: false,
      });
    }
    if (node.id === "E10.M5") {
      return nodeToDef(node, {
        summary: "Futures SAMPLE decide-and-reveal",
        isGradedCasePack: true,
        casesPack: "futures",
      });
    }
    if (node.id === "E10.M6") {
      return nodeToDef(node, {
        summary: "Forex SAMPLE decide-and-reveal",
        isGradedCasePack: true,
        casesPack: "forex",
      });
    }
    return nodeToDef(node, {
      summary: "Crypto SAMPLE cases (+ options-context tip packs)",
      isGradedCasePack: true,
      casesPack: "crypto",
    });
  });

export const CHART_GATE_MILESTONE_ID: BeginnerEquitiesMilestoneId = "E4.M0";
export const CHART_GATE_TRAINING_GROUP: QuizGroupId = "indicators";

export function activePathDefs(): PathMilestoneDef[] {
  const pathId = getPathId();
  if (pathId === DECISION_MAKER_PATH_ID) return DECISION_MAKER_PATH_MILESTONES;
  if (pathId === MARKET_EXPLORER_PATH_ID) return MARKET_EXPLORER_PATH_MILESTONES;
  return BEGINNER_PATH_MILESTONES;
}

export function getPathMilestone(id: string): PathMilestoneDef | undefined {
  return (
    BEGINNER_PATH_MILESTONES.find((m) => m.id === id) ??
    DECISION_MAKER_PATH_MILESTONES.find((m) => m.id === id) ??
    MARKET_EXPLORER_PATH_MILESTONES.find((m) => m.id === id)
  );
}

/** Chart soft-gate: E5 graded packs stay locked until E4.M0 is complete. */
export function isChartGateComplete(): boolean {
  return getMilestoneStatus(CHART_GATE_MILESTONE_ID) === "complete";
}

const CHART_GATE_TEMP_BYPASS_KEY = "analysis_core_chart_gate_temp_bypass_v1";

/** Session-only peek past the chart gate — not written to ProgressStore. */
export function isChartGateTemporarilyBypassed(): boolean {
  try {
    return sessionStorage.getItem(CHART_GATE_TEMP_BYPASS_KEY) === "1";
  } catch {
    return false;
  }
}

export function setChartGateTemporaryBypass(enabled: boolean): void {
  try {
    if (enabled) sessionStorage.setItem(CHART_GATE_TEMP_BYPASS_KEY, "1");
    else sessionStorage.removeItem(CHART_GATE_TEMP_BYPASS_KEY);
  } catch {
    /* private mode / blocked storage */
  }
}

/** Progress complete OR temporary session bypass. */
export function isChartGateCleared(): boolean {
  return isChartGateComplete() || isChartGateTemporarilyBypassed();
}

export function isGradedCasePackLocked(milestoneId: string): boolean {
  const def = getPathMilestone(milestoneId);
  if (!def?.isGradedCasePack) return false;
  return !isChartGateCleared();
}

/** Prior milestones in unlockFrom must be complete (E3.M2). */
export function isMilestoneUnlocked(milestoneId: string): boolean {
  const pathId = getPathId();
  const node = getPathMilestoneNode(milestoneId, pathId);
  if (!node) return false;
  if (node.unlockFrom.length === 0) return true;
  return node.unlockFrom.every((id) => getMilestoneStatus(id) === "complete");
}

export const EXPANSION_ASSET_CLASSES: AssetClass[] = [
  "future",
  "forex",
  "crypto",
  "option_context",
];

const CASE_PACK_ASSET_CLASS: Partial<Record<CasePackId, AssetClass>> = {
  futures: "future",
  forex: "forex",
  crypto: "crypto",
  "options-context": "option_context",
};

const CLASS_EXPLORER_MILESTONE: Partial<Record<AssetClass, string>> = {
  future: "E10.M5",
  forex: "E10.M6",
  crypto: "E10.M7",
  option_context: "E10.M7",
};

const QUIZ_GROUP_ASSET_CLASS: Partial<Record<string, AssetClass>> = {
  "futures-literacy": "future",
  "forex-literacy": "forex",
  "crypto-literacy": "crypto",
  "options-literacy": "option_context",
};

const LITERACY_TERM_ASSET_CLASS: Record<string, AssetClass> = {
  "futures-market": "future",
  "forex-spot": "forex",
  "crypto-browse": "crypto",
  "options-context": "option_context",
};

export function quizGroupAssetClass(groupId: string): AssetClass | null {
  return QUIZ_GROUP_ASSET_CLASS[groupId] ?? null;
}

export function literacyTermAssetClass(termId: string): AssetClass | null {
  return LITERACY_TERM_ASSET_CLASS[termId] ?? null;
}

/** Equities always; expansion needs session peek or Market Explorer milestone. */
export function canBrowseAssetClass(assetClass: AssetClass): boolean {
  if (assetClass === "equity") return true;
  if (isChartGateTemporarilyBypassed()) return true;
  if (getPathId() !== MARKET_EXPLORER_PATH_ID) return false;
  const milestoneId = CLASS_EXPLORER_MILESTONE[assetClass];
  if (!milestoneId) return false;
  const status = getMilestoneStatus(milestoneId);
  return (
    status === "available" ||
    status === "in_progress" ||
    status === "complete"
  );
}

export function canStartQuizGroup(groupId: string): boolean {
  const expansionClass = quizGroupAssetClass(groupId);
  if (expansionClass && !canBrowseAssetClass(expansionClass)) return false;
  const pathId = getPathId();
  if (pathId === DECISION_MAKER_PATH_ID || pathId === MARKET_EXPLORER_PATH_ID) {
    // Non-beginner spines: literacy/drills free; chart gate startable
    return true;
  }
  const def = BEGINNER_PATH_MILESTONES.find((m) => m.trainingGroup === groupId);
  if (!def) return true;
  return isMilestoneUnlocked(def.id) || getMilestoneStatus(def.id) === "complete";
}

export function canStartCasePack(packId: string): boolean {
  if (isChartGateTemporarilyBypassed()) return true;
  if (!isChartGateCleared()) return false;
  const packClass = CASE_PACK_ASSET_CLASS[packId as CasePackId];
  if (packClass && !canBrowseAssetClass(packClass)) return false;
  const def = activePathDefs().find((m) => m.casesPack === packId);
  if (!def) {
    // Pack outside active path spine: chart gate only
    return true;
  }
  return isMilestoneUnlocked(def.id) || getMilestoneStatus(def.id) === "complete";
}

export const CHART_GATE_PREREQ_TIP =
  "Cases stay locked until Training → Indicators is complete. You can still peek for this browser session only — that skip is temporary and does not save as path progress.";

export function trainingHrefForMilestone(id: string): string | null {
  const def = getPathMilestone(id);
  if (!def?.trainingGroup) return null;
  return `/training?group=${def.trainingGroup}&start=1`;
}

export function listPathStatuses(): Array<PathMilestoneDef & { status: MilestoneStatus }> {
  return activePathDefs().map((m) => ({
    ...m,
    status: getMilestoneStatus(m.id),
  }));
}

export function activePathMilestoneId(): string | null {
  const order = milestoneOrderForPathId(getPathId());
  for (const id of order) {
    const status = getMilestoneStatus(id);
    if (status === "available" || status === "in_progress") return id;
  }
  return null;
}

export function isPathComplete(): boolean {
  const pathId = getPathId();
  if (pathId === DECISION_MAKER_PATH_ID) {
    return isDecisionMakerPathComplete();
  }
  if (pathId === MARKET_EXPLORER_PATH_ID) {
    return isMarketExplorerPathComplete();
  }
  return BEGINNER_EQUITIES_MILESTONE_IDS.every(
    (id) => getMilestoneStatus(id) === "complete"
  );
}

/** Ensure pathId exists (E2.M1.S3). Goal picker may still be pending (E2.M2). */
export function ensureDefaultPathSeeded(): string {
  const { state } = loadProgress();
  if (!state.pathId) {
    return BEGINNER_EQUITIES_PATH_ID;
  }
  return getPathId();
}

export function coachTipForActive(): string {
  const id = activePathMilestoneId();
  const pathId = getPathId();
  const template = getPathTemplate(pathId);
  if (!id) {
    if (isPathComplete()) {
      if (pathId === DECISION_MAKER_PATH_ID) {
        return "Decision Maker credential unlocked. Review Cases → news plus financials, or reset the path to practice again.";
      }
      if (pathId === MARKET_EXPLORER_PATH_ID) {
        return "Market Explorer SAMPLE segment complete. Equities paths remain for traditional stocks. Optional: Cases → options context (no chain).";
      }
      return "Beginner Equities credential unlocked. Review Cases → earnings or company news, or reset the path to practice again.";
    }
    return "Open the next available milestone when ready.";
  }
  return (
    getPathMilestone(id)?.coachTip ??
    template?.milestones.find((m) => m.id === id)?.coachTip ??
    "Continue your learning path."
  );
}

export {
  DECISION_MAKER_MILESTONE_IDS,
  DECISION_MAKER_PATH_ID,
  MARKET_EXPLORER_MILESTONE_IDS,
  MARKET_EXPLORER_PATH_ID,
};
