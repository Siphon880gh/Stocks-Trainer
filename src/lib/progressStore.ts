/**
 * Learner progress persistence (E3.M1).
 * localStorage = UX progress, not an attested credential.
 */

export type MilestoneStatus = "locked" | "available" | "in_progress" | "complete";

export interface MilestoneProgress {
  status: MilestoneStatus;
  score?: number;
  bestScore?: number;
  completedAt?: string;
}

export interface ProgressScores {
  totalPoints: number;
  accuracy: number;
}

export interface ProgressStreaks {
  current: number;
  best: number;
}

export type CaseResultGrade = "correct" | "incorrect" | "partial";

export interface CaseResultRecord {
  caseId: string;
  action: string;
  grade: CaseResultGrade;
  completedAt: string;
}

/** Local-only identity shell (E8.M2). No OAuth / paid IdP. */
export interface LocalAccount {
  learnerId: string;
  displayName: string;
  signedInLocal: boolean;
}

/** Optional drill completions that do not unlock the Equities spine (E10). */
export interface ProgressDrillFlags {
  newsLiteracy?: boolean;
  financialDrills?: boolean;
}

export interface ProgressState {
  schemaVersion: number;
  pathId: string;
  /** False until first-run goal picker confirms (E2.M2). Missing → treat as true (legacy). */
  pathConfirmed?: boolean;
  milestones: Record<string, MilestoneProgress>;
  scores: ProgressScores;
  streaks: ProgressStreaks;
  caseResults: Record<string, CaseResultRecord>;
  /** Optional local account; missing → signed-out. */
  account?: LocalAccount;
  /** Extra Training drills (news / statements) — not path unlock keys */
  drillFlags?: ProgressDrillFlags;
  /** Step coaching sessions that reached success (E11 tip flags only — not unlocks) */
  coachingCompleted?: Record<string, boolean>;
  updatedAt: string;
}

export interface LoadProgressResult {
  state: ProgressState;
  recovered: boolean;
  recoveryMessage?: string;
}

export const PROGRESS_STORAGE_KEY = "analysis_core_progress_v1";
export const PROGRESS_SCHEMA_VERSION = 1;

/** Canonical Beginner Equities path id (E2.M1 / E3.M1). */
export const BEGINNER_EQUITIES_PATH_ID = "beginner-equities";

/** Decision Maker path id (E2.M2 / E5.M6). */
export const DECISION_MAKER_PATH_ID = "decision-maker";

/** Market Explorer — SAMPLE multi-market decide path (E10.M8). */
export const MARKET_EXPLORER_PATH_ID = "market-explorer";

/**
 * Frozen Beginner Equities milestone IDs (content keys).
 * Order: literacy → statements → chart soft-gate → earnings cases → thin company news.
 */
export const BEGINNER_EQUITIES_MILESTONE_IDS = [
  "E4.M1",
  "E4.M2",
  "E4.M0",
  "E5.M3",
  "E5.M2",
] as const;

export type BeginnerEquitiesMilestoneId =
  (typeof BEGINNER_EQUITIES_MILESTONE_IDS)[number];

/** Decision Maker case spine (E5.M6.S1). */
export const DECISION_MAKER_MILESTONE_IDS = [
  "E5.M3",
  "E5.M2",
  "E5.M2b",
  "E5.M4",
] as const;

export type DecisionMakerMilestoneId =
  (typeof DECISION_MAKER_MILESTONE_IDS)[number];

/** Market Explorer spine: chart gate → futures → forex → crypto. */
export const MARKET_EXPLORER_MILESTONE_IDS = [
  "E4.M0",
  "E10.M5",
  "E10.M6",
  "E10.M7",
] as const;

export type MarketExplorerMilestoneId =
  (typeof MARKET_EXPLORER_MILESTONE_IDS)[number];

export function milestoneOrderForPathId(pathId: string): readonly string[] {
  if (pathId === DECISION_MAKER_PATH_ID) return DECISION_MAKER_MILESTONE_IDS;
  if (pathId === MARKET_EXPLORER_PATH_ID) return MARKET_EXPLORER_MILESTONE_IDS;
  return BEGINNER_EQUITIES_MILESTONE_IDS;
}

function seedMilestones(ids: readonly string[]): Record<string, MilestoneProgress> {
  const milestones: Record<string, MilestoneProgress> = {};
  ids.forEach((id, index) => {
    milestones[id] = {
      status: index === 0 ? "available" : "locked",
    };
  });
  return milestones;
}

const RECOVERY_MESSAGE =
  "PROGRESS_STORE_RESET: Corrupt or outdated progress cleared. Path restored to first-run SAMPLE state.";

function emptyScores(): ProgressScores {
  return { totalPoints: 0, accuracy: 0 };
}

function emptyStreaks(): ProgressStreaks {
  return { current: 0, best: 0 };
}

/** Seed path skeleton. New installs await goal picker (pathConfirmed: false). */
export function createDefaultProgress(): ProgressState {
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    pathId: BEGINNER_EQUITIES_PATH_ID,
    pathConfirmed: false,
    milestones: seedMilestones(BEGINNER_EQUITIES_MILESTONE_IDS),
    scores: emptyScores(),
    streaks: emptyStreaks(),
    caseResults: {},
    updatedAt: new Date().toISOString(),
  };
}

export function createProgressForPath(pathId: string): ProgressState {
  const order = milestoneOrderForPathId(pathId);
  const milestones = seedMilestones(order);
  // Decision Maker still needs chart-gate tracking outside the displayed spine
  if (pathId === DECISION_MAKER_PATH_ID && !milestones["E4.M0"]) {
    milestones["E4.M0"] = { status: "available" };
  }
  return {
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    pathId,
    pathConfirmed: true,
    milestones,
    scores: emptyScores(),
    streaks: emptyStreaks(),
    caseResults: {},
    drillFlags: {},
    updatedAt: new Date().toISOString(),
  };
}

export function isPathConfirmed(state?: ProgressState): boolean {
  const s = state ?? loadProgress().state;
  // Legacy saves omit the field → treat as already confirmed
  if (s.pathConfirmed === undefined) return true;
  return s.pathConfirmed === true;
}

/** Confirm goal picker selection; reseeds milestones for the chosen template. */
export function confirmPathSelection(pathId: string): ProgressState {
  const prev = loadProgress().state;
  const next = createProgressForPath(pathId);
  return saveProgress({
    ...next,
    scores: prev.scores,
    streaks: prev.streaks,
    caseResults: prev.caseResults,
    account: prev.account,
    drillFlags: prev.drillFlags,
    coachingCompleted: prev.coachingCompleted,
  });
}

function isMilestoneProgress(value: unknown): value is MilestoneProgress {
  if (!value || typeof value !== "object") return false;
  const status = (value as MilestoneProgress).status;
  return (
    status === "locked" ||
    status === "available" ||
    status === "in_progress" ||
    status === "complete"
  );
}

function isProgressState(value: unknown): value is ProgressState {
  if (!value || typeof value !== "object") return false;
  const v = value as ProgressState;
  if (typeof v.schemaVersion !== "number") return false;
  if (typeof v.pathId !== "string" || !v.pathId) return false;
  if (!v.milestones || typeof v.milestones !== "object") return false;
  if (!v.scores || typeof v.scores.totalPoints !== "number") return false;
  if (typeof v.scores.accuracy !== "number") return false;
  if (!v.streaks || typeof v.streaks.current !== "number") return false;
  if (typeof v.streaks.best !== "number") return false;
  if (typeof v.updatedAt !== "string") return false;
  for (const entry of Object.values(v.milestones)) {
    if (!isMilestoneProgress(entry)) return false;
  }
  return true;
}

function normalizeProgress(state: ProgressState): ProgressState {
  return {
    ...state,
    caseResults: state.caseResults ?? {},
  };
}

function newLearnerId(): string {
  return `LNR_${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

export function getAccount(state?: ProgressState): LocalAccount | undefined {
  return (state ?? loadProgress().state).account;
}

export function isSignedInLocal(state?: ProgressState): boolean {
  const account = getAccount(state);
  return account?.signedInLocal === true;
}

/** Sign in with a local display name (persists learner id). */
export function signInLocal(displayName: string): ProgressState {
  const { state } = loadProgress();
  const name = displayName.trim() || "TRAINEE";
  const prev = state.account;
  return saveProgress({
    ...state,
    account: {
      learnerId: prev?.learnerId ?? newLearnerId(),
      displayName: name,
      signedInLocal: true,
    },
  });
}

export function signOutLocal(): ProgressState {
  const { state } = loadProgress();
  if (!state.account) return state;
  return saveProgress({
    ...state,
    account: {
      ...state.account,
      signedInLocal: false,
    },
  });
}

export function setDisplayName(displayName: string): ProgressState {
  const { state } = loadProgress();
  const name = displayName.trim() || "TRAINEE";
  const prev = state.account;
  if (!prev?.signedInLocal) {
    return signInLocal(name);
  }
  return saveProgress({
    ...state,
    account: { ...prev, displayName: name },
  });
}

function canUseStorage(): boolean {
  return typeof localStorage !== "undefined";
}

export function loadProgress(): LoadProgressResult {
  if (!canUseStorage()) {
    return { state: createDefaultProgress(), recovered: false };
  }
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (raw == null) {
      const state = createDefaultProgress();
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
      return { state, recovered: false };
    }
    const parsed: unknown = JSON.parse(raw);
    if (!isProgressState(parsed) || parsed.schemaVersion !== PROGRESS_SCHEMA_VERSION) {
      const state = createDefaultProgress();
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
      return {
        state,
        recovered: true,
        recoveryMessage: RECOVERY_MESSAGE,
      };
    }
    return { state: normalizeProgress(parsed), recovered: false };
  } catch {
    const state = createDefaultProgress();
    try {
      localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* ignore quota */
    }
    return {
      state,
      recovered: true,
      recoveryMessage: RECOVERY_MESSAGE,
    };
  }
}

export function saveProgress(state: ProgressState): ProgressState {
  const next: ProgressState = {
    ...normalizeProgress(state),
    schemaVersion: PROGRESS_SCHEMA_VERSION,
    updatedAt: new Date().toISOString(),
  };
  if (canUseStorage()) {
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(next));
  }
  return next;
}

export function getPathId(): string {
  return loadProgress().state.pathId;
}

export function setPathId(pathId: string): ProgressState {
  const { state } = loadProgress();
  return saveProgress({ ...state, pathId });
}

export function getMilestoneStatus(milestoneId: string): MilestoneStatus {
  const { state } = loadProgress();
  return state.milestones[milestoneId]?.status ?? "locked";
}

export function setMilestoneStatus(
  milestoneId: string,
  status: MilestoneStatus,
  extras?: Pick<MilestoneProgress, "score" | "bestScore" | "completedAt">
): ProgressState {
  const { state } = loadProgress();
  const prev = state.milestones[milestoneId] ?? { status: "locked" as const };
  return saveProgress({
    ...state,
    milestones: {
      ...state.milestones,
      [milestoneId]: {
        ...prev,
        ...extras,
        status,
      },
    },
  });
}

export function getScores(): ProgressScores {
  return loadProgress().state.scores;
}

export function setScores(scores: Partial<ProgressScores>): ProgressState {
  const { state } = loadProgress();
  return saveProgress({
    ...state,
    scores: { ...state.scores, ...scores },
  });
}

export function getStreaks(): ProgressStreaks {
  return loadProgress().state.streaks;
}

export function setStreaks(streaks: Partial<ProgressStreaks>): ProgressState {
  const { state } = loadProgress();
  return saveProgress({
    ...state,
    streaks: { ...state.streaks, ...streaks },
  });
}

/** Wipe to first-run Beginner Equities skeleton. */
export function resetProgress(): ProgressState {
  const state = createDefaultProgress();
  return saveProgress(state);
}

/** Map Training quiz groups to Beginner Equities milestone ids (writeback). */
export const QUIZ_GROUP_MILESTONE: Partial<Record<string, BeginnerEquitiesMilestoneId>> = {
  "equity-literacy": "E4.M1",
  "financial-literacy": "E4.M2",
  /** Chart soft-gate (E4.M0) — indicators group reserved for gate writeback */
  indicators: "E4.M0",
};

/**
 * Mark a path milestone complete after finishing a mapped quiz group;
 * unlock the next locked milestone in Beginner Equities order.
 */
export function completeMilestoneFromQuiz(opts: {
  groupId: string;
  points: number;
  streak: number;
  accuracy: number;
}): ProgressState | null {
  const { state } = loadProgress();
  const normalized = normalizeProgress(state);

  // E10 drills: persist flags + scores without touching Equities unlock graph
  if (opts.groupId === "news-literacy" || opts.groupId === "financial-drills") {
    const drillFlags: ProgressDrillFlags = {
      ...normalized.drillFlags,
      ...(opts.groupId === "news-literacy" ? { newsLiteracy: true } : {}),
      ...(opts.groupId === "financial-drills" ? { financialDrills: true } : {}),
    };
    return saveProgress({
      ...normalized,
      drillFlags,
      scores: {
        totalPoints: opts.points,
        accuracy: opts.accuracy,
      },
      streaks: {
        current: opts.streak,
        best: Math.max(normalized.streaks.best, opts.streak),
      },
    });
  }

  const milestoneId = QUIZ_GROUP_MILESTONE[opts.groupId];
  if (!milestoneId) return null;

  const order = milestoneOrderForPathId(normalized.pathId);
  const idx = order.indexOf(milestoneId);
  const milestones = { ...normalized.milestones };
  milestones[milestoneId] = {
    ...milestones[milestoneId],
    status: "complete",
    score: opts.accuracy,
    bestScore: Math.max(milestones[milestoneId]?.bestScore ?? 0, opts.accuracy),
    completedAt: new Date().toISOString(),
  };

  if (idx >= 0 && idx < order.length - 1) {
    const nextId = order[idx + 1]!;
    if (milestones[nextId]?.status === "locked") {
      milestones[nextId] = { ...milestones[nextId], status: "available" };
    }
  }

  // Decision Maker / Market Explorer: chart gate unlocks first case pack on spine
  if (
    milestoneId === "E4.M0" &&
    normalized.pathId === DECISION_MAKER_PATH_ID &&
    milestones["E5.M3"]?.status === "locked"
  ) {
    milestones["E5.M3"] = { ...milestones["E5.M3"], status: "available" };
  }
  if (
    milestoneId === "E4.M0" &&
    normalized.pathId === MARKET_EXPLORER_PATH_ID &&
    milestones["E10.M5"]?.status === "locked"
  ) {
    milestones["E10.M5"] = { ...milestones["E10.M5"], status: "available" };
  }

  return saveProgress({
    ...normalized,
    milestones,
    scores: {
      totalPoints: opts.points,
      accuracy: opts.accuracy,
    },
    streaks: {
      current: opts.streak,
      best: Math.max(normalized.streaks.best, opts.streak),
    },
  });
}

export function isNewsLiteracyComplete(state?: ProgressState): boolean {
  return (state ?? loadProgress().state).drillFlags?.newsLiteracy === true;
}

export function isFinancialDrillsComplete(state?: ProgressState): boolean {
  return (state ?? loadProgress().state).drillFlags?.financialDrills === true;
}

export function isCoachingSessionComplete(
  slug: string,
  state?: ProgressState
): boolean {
  return (state ?? loadProgress().state).coachingCompleted?.[slug] === true;
}

export function countCoachingSessionsComplete(state?: ProgressState): number {
  const map = (state ?? loadProgress().state).coachingCompleted ?? {};
  return Object.values(map).filter(Boolean).length;
}

/** Tip flag only — does not alter Beginner unlock graph. */
export function markCoachingSessionComplete(slug: string): ProgressState {
  const { state } = loadProgress();
  if (!slug.trim()) return state;
  if (state.coachingCompleted?.[slug]) return state;
  return saveProgress({
    ...state,
    coachingCompleted: {
      ...state.coachingCompleted,
      [slug]: true,
    },
  });
}

export function isMarketExplorerPathComplete(state?: ProgressState): boolean {
  const s = state ?? loadProgress().state;
  if (s.pathId !== MARKET_EXPLORER_PATH_ID) return false;
  return MARKET_EXPLORER_MILESTONE_IDS.every(
    (id) => s.milestones[id]?.status === "complete",
  );
}

export function recordCaseResult(opts: {
  caseId: string;
  action: string;
  grade: CaseResultGrade;
  milestoneId?: string;
}): ProgressState {
  const { state } = loadProgress();
  const normalized = normalizeProgress(state);
  const completedAt = new Date().toISOString();
  const caseResults = {
    ...normalized.caseResults,
    [opts.caseId]: {
      caseId: opts.caseId,
      action: opts.action,
      grade: opts.grade,
      completedAt,
    },
  };

  const milestones = { ...normalized.milestones };
  if (opts.milestoneId && (opts.grade === "correct" || opts.grade === "partial")) {
    const score = opts.grade === "correct" ? 100 : 50;
    milestones[opts.milestoneId] = {
      ...milestones[opts.milestoneId],
      status: "complete",
      score,
      bestScore: Math.max(milestones[opts.milestoneId]?.bestScore ?? 0, score),
      completedAt,
    };
    const order = milestoneOrderForPathId(normalized.pathId);
    const idx = order.indexOf(opts.milestoneId);
    if (idx >= 0 && idx < order.length - 1) {
      const nextId = order[idx + 1]!;
      if (milestones[nextId]?.status === "locked") {
        milestones[nextId] = { ...milestones[nextId], status: "available" };
      }
    }
  }

  return saveProgress({
    ...normalized,
    milestones,
    caseResults,
  });
}

export function isDecisionMakerPathComplete(state?: ProgressState): boolean {
  const s = state ?? loadProgress().state;
  if (s.pathId !== DECISION_MAKER_PATH_ID) return false;
  return DECISION_MAKER_MILESTONE_IDS.every(
    (id) => s.milestones[id]?.status === "complete"
  );
}
