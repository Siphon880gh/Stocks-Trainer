import type {
  CoachingDecisionGraph,
  CoachingSession,
  CoachingValidationIssue,
  CoachingValidationResult,
} from "./types";

function push(
  issues: CoachingValidationIssue[],
  code: string,
  message: string,
  nodeId?: string
): void {
  issues.push({ code, message, nodeId });
}

/** Validate a decision graph (used alone or via session wrapper). */
export function validateDecisionGraph(
  tree: CoachingDecisionGraph,
  opts?: { requireWrong?: boolean }
): CoachingValidationResult {
  const issues: CoachingValidationIssue[] = [];
  const nodeIds = Object.keys(tree.nodes);
  const requireWrong = opts?.requireWrong ?? false;

  if (!tree.start || !tree.nodes[tree.start]) {
    push(issues, "missing_start", `start "${tree.start}" does not reference an existing node`);
  }

  let successCount = 0;
  let wrongCount = 0;

  for (const id of nodeIds) {
    const node = tree.nodes[id];
    if (!node.message?.trim()) {
      push(issues, "empty_message", "Node message must be non-empty", id);
    }
    if (node.outcome !== "continue" && node.outcome !== "wrong" && node.outcome !== "success") {
      push(issues, "bad_outcome", `Unknown outcome "${String(node.outcome)}"`, id);
      continue;
    }

    if (node.outcome === "success") {
      successCount += 1;
      if (node.choices.length > 0) {
        push(issues, "terminal_choices", "success nodes must not expose choices", id);
      }
    }

    if (node.outcome === "wrong") {
      wrongCount += 1;
      if (node.choices.length > 0) {
        push(issues, "terminal_choices", "wrong nodes must not expose choices", id);
      }
      if (!node.rewind_to) {
        push(issues, "missing_rewind", "wrong nodes require rewind_to", id);
      } else if (!tree.nodes[node.rewind_to]) {
        push(
          issues,
          "bad_rewind",
          `rewind_to "${node.rewind_to}" does not reference an existing node`,
          id
        );
      }
    }

    if (node.outcome === "continue") {
      if (node.choices.length === 0) {
        push(issues, "continue_no_choices", "continue nodes should have at least one choice", id);
      }
      for (const choice of node.choices) {
        if (!choice.label?.trim()) {
          push(issues, "empty_label", "Choice labels must be non-empty", id);
        }
        if (!choice.next || !tree.nodes[choice.next]) {
          push(
            issues,
            "bad_next",
            `choices[].next "${choice.next}" does not reference an existing node`,
            id
          );
        }
      }
    }
  }

  if (successCount < 1) {
    push(issues, "no_success", "Graph must include at least one success node");
  }
  if (requireWrong && wrongCount < 1) {
    push(issues, "no_wrong", "Sample/session must include at least one wrong node");
  }

  return { ok: issues.length === 0, issues };
}

export function validateCoachingSession(session: CoachingSession): CoachingValidationResult {
  const metaIssues: CoachingValidationIssue[] = [];
  const m = session.meta;
  if (!m.slug?.trim()) push(metaIssues, "meta_slug", "meta.slug is required");
  if (!m.title?.trim()) push(metaIssues, "meta_title", "meta.title is required");
  if (!m.summary?.trim()) push(metaIssues, "meta_summary", "meta.summary is required");
  if (!m.topic?.trim()) push(metaIssues, "meta_topic", "meta.topic is required");
  if (!Array.isArray(m.tags)) push(metaIssues, "meta_tags", "meta.tags must be an array");

  const graph = validateDecisionGraph(session.tree, { requireWrong: true });
  const issues = [...metaIssues, ...graph.issues];
  return { ok: issues.length === 0, issues };
}
