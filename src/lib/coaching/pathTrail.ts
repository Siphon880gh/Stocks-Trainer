import type { CoachingDecisionGraph, CoachingOutcome } from "./types";
import type { CoachingNavState } from "./navigate";

export interface PathTrailStep {
  index: number;
  nodeId: string;
  /** Full node message (wrap in UI; not truncated). */
  messagePreview: string;
  outcome: CoachingOutcome;
  /** Choice taken from this node to the next; null on current step */
  choiceLabel: string | null;
  isCurrent: boolean;
}

/** Resolve the choice label used when moving from `fromId` to `toId`. */
export function choiceLabelBetween(
  tree: CoachingDecisionGraph,
  fromId: string,
  toId: string
): string | null {
  const from = tree.nodes[fromId];
  if (!from) return null;
  const hit = from.choices.find((c) => c.next === toId);
  return hit?.label ?? null;
}

/**
 * Build path visualizer steps from history stack + current node.
 * Authors do not maintain a separate breadcrumb structure.
 */
export function buildPathTrail(
  tree: CoachingDecisionGraph,
  state: CoachingNavState
): PathTrailStep[] {
  const sequence = [...state.history, state.currentNodeId];
  return sequence.map((nodeId, index) => {
    const node = tree.nodes[nodeId];
    const nextId = sequence[index + 1];
    const isCurrent = index === sequence.length - 1;
    return {
      index: index + 1,
      nodeId,
      messagePreview: node?.message?.trim() || "(missing node)",
      outcome: node?.outcome ?? "continue",
      choiceLabel:
        !isCurrent && nextId ? choiceLabelBetween(tree, nodeId, nextId) : null,
      isCurrent,
    };
  });
}
