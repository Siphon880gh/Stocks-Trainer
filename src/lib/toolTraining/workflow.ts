/**
 * Guided workflows (capstone part 2): the note template fills from the learner's entries as they go.
 * Educational, not advice.
 */
import type { ToolWorkflow } from "./types";

export const NOTE_BLANK = "____";

/** Every `{key}` a note line uses. */
export function noteKeys(line: string): string[] {
  return [...line.matchAll(/\{([a-z0-9_]+)\}/gi)].map((m) => m[1]!);
}

/** The note with each `{key}` replaced by the learner's value, or a blank when it is still empty. */
export function fillWorkflowNote(w: ToolWorkflow, values: Record<string, string>): string[] {
  return w.note.map((line) => line.replace(/\{([a-z0-9_]+)\}/gi, (_, k: string) => values[k]?.trim() || NOTE_BLANK));
}

/** How many of the workflow's fields have a value. */
export function workflowProgress(w: ToolWorkflow, values: Record<string, string>): { filled: number; total: number } {
  const keys = w.steps.flatMap((s) => s.fields.map((f) => f.key));
  return { filled: keys.filter((k) => values[k]?.trim()).length, total: keys.length };
}

/** Problems with a workflow's wiring; empty when well formed. Used by tests. */
export function workflowProblems(w: ToolWorkflow): string[] {
  const out: string[] = [];
  const keys = w.steps.flatMap((s) => s.fields.map((f) => f.key));
  if (new Set(keys).size !== keys.length) out.push("duplicate field keys");
  if (new Set(w.steps.map((s) => s.id)).size !== w.steps.length) out.push("duplicate step ids");
  if (w.steps.length < 4) out.push("fewer than 4 steps");
  const used = new Set(w.note.flatMap(noteKeys));
  for (const k of used) if (!keys.includes(k)) out.push(`note uses unknown {${k}}`);
  for (const k of keys) if (!used.has(k)) out.push(`field ${k} never appears in the note`);
  for (const s of w.steps) {
    if (!s.fields.length) out.push(`${s.id}: no fields`);
    if (!s.live.length) out.push(`${s.id}: no live link`);
    if (!s.do.length) out.push(`${s.id}: no instructions`);
  }
  return out;
}
