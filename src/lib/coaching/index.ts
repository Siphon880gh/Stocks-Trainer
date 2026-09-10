import type { CoachingSession, CoachingSessionMeta, CoachingValidationResult } from "./types";
import { validateCoachingSession } from "./validate";
import { COACHING_SESSION_MODULES } from "./sessions";

export type {
  CoachingChoice,
  CoachingDecisionGraph,
  CoachingNode,
  CoachingOutcome,
  CoachingSession,
  CoachingSessionMeta,
  CoachingValidationIssue,
  CoachingValidationResult,
} from "./types";
export { validateCoachingSession, validateDecisionGraph } from "./validate";
export {
  canStepBack,
  choose,
  currentNode,
  ensureKnownNode,
  initialNavState,
  restart,
  rewindTo,
  stepBack,
  type CoachingNavState,
  type NavResult,
} from "./navigate";
export {
  getCoachingPersistAdapter,
  sessionStoragePersistAdapter,
  setCoachingPersistAdapter,
  type CoachingPersistAdapter,
} from "./persist";
export {
  buildPathTrail,
  choiceLabelBetween,
  type PathTrailStep,
} from "./pathTrail";
export {
  buildAiExplainPrompt,
  buildPathExplanationMarkdown,
  canShowAiExplain,
  chartBarsForCoachSlug,
  chatGptShareUrl,
  claudeShareUrl,
  nodeMessageToMarkdown,
} from "./explainPrompt";

function catalogEntries(): { session: CoachingSession; validation: CoachingValidationResult }[] {
  return COACHING_SESSION_MODULES.map((session) => ({
    session,
    validation: validateCoachingSession(session),
  })).sort((a, b) => a.session.meta.slug.localeCompare(b.session.meta.slug));
}

/** Valid sessions only — invalid graphs are excluded from the catalog. */
export function listSessions(): CoachingSessionMeta[] {
  return catalogEntries()
    .filter((e) => e.validation.ok)
    .map((e) => e.session.meta);
}

export type LoadSessionResult =
  | { ok: true; session: CoachingSession }
  | { ok: false; error: "not_found" | "invalid"; issues?: CoachingValidationResult["issues"] };

/** Load one session by slug. Rejects unknown or invalid graphs. */
export function loadSession(slug: string): LoadSessionResult {
  const hit = catalogEntries().find((e) => e.session.meta.slug === slug);
  if (!hit) return { ok: false, error: "not_found" };
  if (!hit.validation.ok) {
    return { ok: false, error: "invalid", issues: hit.validation.issues };
  }
  return { ok: true, session: hit.session };
}
