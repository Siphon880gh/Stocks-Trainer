/** Deterministic decision-tree coaching (E11). No runtime LLM. */

export type CoachingOutcome = "continue" | "wrong" | "success";

export interface CoachingChoice {
  /** Button text and path-trail transition label */
  label: string;
  next: string;
}

export interface CoachingNode {
  message: string;
  outcome: CoachingOutcome;
  choices: CoachingChoice[];
  /** Required when outcome is `wrong` — jump target for step-back */
  rewind_to?: string;
}

export interface CoachingDecisionGraph {
  start: string;
  nodes: Record<string, CoachingNode>;
}

export interface CoachingSessionMeta {
  slug: string;
  title: string;
  summary: string;
  topic: string;
  tags: string[];
}

export interface CoachingSession {
  meta: CoachingSessionMeta;
  tree: CoachingDecisionGraph;
}

export interface CoachingValidationIssue {
  code: string;
  message: string;
  nodeId?: string;
}

export interface CoachingValidationResult {
  ok: boolean;
  issues: CoachingValidationIssue[];
}
