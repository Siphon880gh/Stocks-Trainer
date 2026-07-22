import type { CoachingChoice, CoachingDecisionGraph, CoachingNode } from "./types";

export interface CoachingNavState {
  currentNodeId: string;
  /** Ordered stack of previously visited node IDs (oldest → newest) */
  history: string[];
}

export type NavResult =
  | { ok: true; state: CoachingNavState }
  | { ok: false; error: string; state: CoachingNavState };

function nodeOf(tree: CoachingDecisionGraph, id: string): CoachingNode | undefined {
  return tree.nodes[id];
}

/** Start (or recover) at graph start with empty history. */
export function initialNavState(tree: CoachingDecisionGraph): CoachingNavState {
  const start = tree.nodes[tree.start] ? tree.start : Object.keys(tree.nodes)[0] ?? "start";
  return { currentNodeId: start, history: [] };
}

/** Recover unknown current node to start (keeps empty history). */
export function ensureKnownNode(
  tree: CoachingDecisionGraph,
  state: CoachingNavState
): CoachingNavState {
  if (tree.nodes[state.currentNodeId]) return state;
  return initialNavState(tree);
}

export function currentNode(
  tree: CoachingDecisionGraph,
  state: CoachingNavState
): CoachingNode | undefined {
  return nodeOf(tree, ensureKnownNode(tree, state).currentNodeId);
}

/**
 * Follow a choice on the current node.
 * Pushes current onto history, then navigates to choice.next.
 */
export function choose(
  tree: CoachingDecisionGraph,
  state: CoachingNavState,
  choice: CoachingChoice
): NavResult {
  const s = ensureKnownNode(tree, state);
  const node = nodeOf(tree, s.currentNodeId);
  if (!node) {
    return { ok: false, error: "unknown_node", state: initialNavState(tree) };
  }
  if (node.outcome !== "continue") {
    return { ok: false, error: "terminal_node", state: s };
  }
  const match = node.choices.find(
    (c) => c.label === choice.label && c.next === choice.next
  );
  if (!match) {
    return { ok: false, error: "invalid_choice", state: s };
  }
  if (!tree.nodes[match.next]) {
    return { ok: false, error: "bad_next", state: s };
  }
  return {
    ok: true,
    state: {
      currentNodeId: match.next,
      history: [...s.history, s.currentNodeId],
    },
  };
}

/**
 * Step back: from wrong nodes jump to rewind_to and truncate history;
 * otherwise pop one history entry.
 */
export function stepBack(tree: CoachingDecisionGraph, state: CoachingNavState): NavResult {
  const s = ensureKnownNode(tree, state);
  const node = nodeOf(tree, s.currentNodeId);
  if (!node) {
    return { ok: false, error: "unknown_node", state: initialNavState(tree) };
  }

  if (node.outcome === "wrong" && node.rewind_to) {
    return rewindTo(tree, s, node.rewind_to);
  }

  if (s.history.length === 0) {
    return { ok: false, error: "no_history", state: s };
  }
  const history = s.history.slice(0, -1);
  const currentNodeId = s.history[s.history.length - 1]!;
  if (!tree.nodes[currentNodeId]) {
    return { ok: true, state: initialNavState(tree) };
  }
  return { ok: true, state: { currentNodeId, history } };
}

/** Targeted rewind: navigate to nodeId and drop history after that node. */
export function rewindTo(
  tree: CoachingDecisionGraph,
  state: CoachingNavState,
  nodeId: string
): NavResult {
  if (!tree.nodes[nodeId]) {
    return { ok: false, error: "bad_rewind_target", state: ensureKnownNode(tree, state) };
  }
  const idx = state.history.indexOf(nodeId);
  if (idx === -1) {
    // Target not in history — safest valid path is empty history at that node
    return { ok: true, state: { currentNodeId: nodeId, history: [] } };
  }
  return {
    ok: true,
    state: {
      currentNodeId: nodeId,
      history: state.history.slice(0, idx),
    },
  };
}

export function restart(tree: CoachingDecisionGraph): CoachingNavState {
  return initialNavState(tree);
}

export function canStepBack(tree: CoachingDecisionGraph, state: CoachingNavState): boolean {
  const s = ensureKnownNode(tree, state);
  const node = nodeOf(tree, s.currentNodeId);
  if (!node) return false;
  if (node.outcome === "wrong" && node.rewind_to) return true;
  return s.history.length > 0;
}
