import { test } from "node:test";
import assert from "node:assert/strict";
import { MACRO_PROGRESS_KEY, loadMacroProgress, progressSummary, recordRound, type KVStorage } from "./macroProgress";

const fake = (): KVStorage & { data: Map<string, string> } => {
  const data = new Map<string, string>();
  return { data, getItem: (k) => data.get(k) ?? null, setItem: (k, v) => void data.set(k, v) };
};

test("progress round-trips, keeps best, touches only its own key", () => {
  const s = fake();
  s.setItem("other_key", "x");
  recordRound("round-a", 2, 3, s);
  recordRound("round-a", 1, 3, s);
  recordRound("round-b", 3, 3, s);
  const p = loadMacroProgress(s);
  assert.equal(p.rounds["round-a"]!.best, 2);
  assert.deepEqual([...s.data.keys()].sort(), [MACRO_PROGRESS_KEY, "other_key"].sort());
  assert.equal(s.getItem("other_key"), "x");
  assert.deepEqual(progressSummary(p, ["round-a", "round-b", "round-c"]), { completed: 2, of: 3, correct: 5, total: 6 });
});

test("corrupt or missing storage is safe", () => {
  const s = fake();
  s.setItem(MACRO_PROGRESS_KEY, "{not json");
  assert.deepEqual(loadMacroProgress(s), { rounds: {} });
  assert.deepEqual(loadMacroProgress(undefined), { rounds: {} });
});
