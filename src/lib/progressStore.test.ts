import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { completeMilestoneFromQuiz, loadProgress, PROGRESS_STORAGE_KEY, recordQuizScore } from "./progressStore.ts";

function installStorage() {
  const data = new Map<string, string>();
  (globalThis as { localStorage?: unknown }).localStorage = {
    getItem: (k: string) => data.get(k) ?? null,
    setItem: (k: string, v: string) => void data.set(k, v),
    removeItem: (k: string) => void data.delete(k),
    clear: () => data.clear(),
    key: (i: number) => [...data.keys()][i] ?? null,
    get length() {
      return data.size;
    },
  };
  return data;
}

describe("Training quiz score persistence (QA 2026-10-22)", () => {
  let data: Map<string, string>;
  beforeEach(() => {
    data = installStorage();
  });

  it("a group with no path milestone (Buy or Sell?) used to persist nothing", () => {
    assert.equal(completeMilestoneFromQuiz({ groupId: "buy-or-sell", points: 100, streak: 1, accuracy: 50 }), null);
  });

  it("recordQuizScore saves points, streak and accuracy so a reload keeps them", () => {
    recordQuizScore({ points: 50, streak: 1, accuracy: 100 });
    recordQuizScore({ points: 50, streak: 0, accuracy: 50 });
    recordQuizScore({ points: 100, streak: 1, accuracy: 67 });
    const raw = JSON.parse(data.get(PROGRESS_STORAGE_KEY)!);
    assert.deepEqual(raw.scores, { totalPoints: 100, accuracy: 67 });
    assert.deepEqual(raw.streaks, { current: 1, best: 1 });
    const { state } = loadProgress();
    assert.equal(state.scores.totalPoints, 100);
  });

  it("best streak never goes down and path milestones are untouched", () => {
    recordQuizScore({ points: 160, streak: 3, accuracy: 100 });
    const before = loadProgress().state.milestones;
    recordQuizScore({ points: 160, streak: 0, accuracy: 75 });
    const s = loadProgress().state;
    assert.equal(s.streaks.best, 3);
    assert.equal(s.streaks.current, 0);
    assert.deepEqual(s.milestones, before);
  });
});
