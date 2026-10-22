import assert from "node:assert/strict";
import { beforeEach, describe, it } from "node:test";
import { completeMilestoneFromQuiz, loadProgress, PROGRESS_STORAGE_KEY, QUIZ_PASS_PCT, quizGroupCompletes, recordQuizScore } from "./progressStore.ts";

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

describe("Quiz milestone pass mark (Weng 2026-10-22: 70%)", () => {
  beforeEach(() => {
    installStorage();
  });

  it("below 70% records the attempt and score but leaves the milestone and the next one as they were", () => {
    const before = loadProgress().state.milestones;
    const s = completeMilestoneFromQuiz({ groupId: "equity-literacy", points: 50, streak: 0, accuracy: 69 })!;
    assert.equal(QUIZ_PASS_PCT, 70);
    assert.equal(s.milestones["E4.M1"]!.status, before["E4.M1"]!.status);
    assert.notEqual(s.milestones["E4.M1"]!.status, "complete");
    assert.equal(s.milestones["E4.M1"]!.score, 69);
    assert.equal(s.milestones["E4.M1"]!.attempts, 1);
    assert.equal(s.milestones["E4.M1"]!.completedAt, undefined);
    assert.equal(s.milestones["E4.M2"]?.status, before["E4.M2"]?.status);
    assert.equal(s.scores.totalPoints, 50);
  });

  it("70% exactly completes, counts the attempt and keeps the best score", () => {
    completeMilestoneFromQuiz({ groupId: "equity-literacy", points: 50, streak: 0, accuracy: 50 });
    const s = completeMilestoneFromQuiz({ groupId: "equity-literacy", points: 120, streak: 2, accuracy: 70 })!;
    assert.equal(s.milestones["E4.M1"]!.status, "complete");
    assert.equal(s.milestones["E4.M1"]!.attempts, 2);
    assert.equal(s.milestones["E4.M1"]!.bestScore, 70);
    assert.ok(s.milestones["E4.M1"]!.completedAt);
  });

  it("a saved completion is never revoked by a later low score", () => {
    const done = completeMilestoneFromQuiz({ groupId: "equity-literacy", points: 100, streak: 3, accuracy: 100 })!;
    const s = completeMilestoneFromQuiz({ groupId: "equity-literacy", points: 110, streak: 0, accuracy: 20 })!;
    assert.equal(s.milestones["E4.M1"]!.status, "complete");
    assert.equal(s.milestones["E4.M1"]!.completedAt, done.milestones["E4.M1"]!.completedAt);
    assert.equal(s.milestones["E4.M1"]!.bestScore, 100);
    assert.equal(s.milestones["E4.M1"]!.score, 20);
  });

  it("a legacy save completed below 70% (before the pass mark) stays complete", () => {
    const st = loadProgress().state;
    st.milestones["E4.M2"] = { status: "complete", score: 50, bestScore: 50, completedAt: "2026-10-01T00:00:00.000Z" };
    localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(st));
    assert.equal(loadProgress().state.milestones["E4.M2"]!.status, "complete");
    const s = completeMilestoneFromQuiz({ groupId: "financial-literacy", points: 0, streak: 0, accuracy: 10 })!;
    assert.equal(s.milestones["E4.M2"]!.status, "complete");
  });

  it("E10 drill flags follow the same pass mark and are not cleared by a low retake", () => {
    let s = completeMilestoneFromQuiz({ groupId: "news-literacy", points: 0, streak: 0, accuracy: 60 })!;
    assert.notEqual(s.drillFlags?.newsLiteracy, true);
    s = completeMilestoneFromQuiz({ groupId: "news-literacy", points: 0, streak: 0, accuracy: 80 })!;
    assert.equal(s.drillFlags?.newsLiteracy, true);
    s = completeMilestoneFromQuiz({ groupId: "news-literacy", points: 0, streak: 0, accuracy: 0 })!;
    assert.equal(s.drillFlags?.newsLiteracy, true);
  });

  it("quizGroupCompletes names the groups that show the pass line", () => {
    for (const g of ["equity-literacy", "financial-literacy", "indicators", "news-literacy", "financial-drills"]) assert.ok(quizGroupCompletes(g), g);
    assert.equal(quizGroupCompletes("buy-or-sell"), false);
  });
});
