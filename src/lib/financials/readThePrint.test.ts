import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";
import { PROGRESS_STORAGE_KEY } from "../progressStore";
import { EARNINGS_EVENTS, REACTION_ARCHETYPES, eventById } from "./earningsEvents";
import {
  PRINT_OPTIONS,
  PRINT_ROUNDS,
  ROUND_ORDER,
  answerFor,
  followFor,
  followReturn,
} from "./readThePrint";
import {
  READ_THE_PRINT_KEY,
  completedCount,
  correctCount,
  emptyPrintProgress,
  finishSession,
  loadPrintProgress,
  recordRound,
  roundPoints,
  savePrintProgress,
  type KeyValueStore,
} from "./readThePrintProgress";
import { generateReaction } from "./reactionCharts";

describe("FE5.M1 rounds", () => {
  it("≥ 12 rounds, one per event, unique, every archetype ≥ 2 rounds", () => {
    assert.ok(PRINT_ROUNDS.length >= 12);
    assert.equal(new Set(PRINT_ROUNDS.map((r) => r.id)).size, PRINT_ROUNDS.length);
    assert.deepEqual([...ROUND_ORDER].sort(), EARNINGS_EVENTS.map((e) => e.id).sort());
    for (const a of REACTION_ARCHETYPES) assert.ok(PRINT_ROUNDS.filter((r) => eventById(r.eventId)!.reaction === a).length >= 2, a);
  });

  it("answer keys are derived from archetype + chart direction (not typed)", () => {
    for (const r of PRINT_ROUNDS) {
      const e = eventById(r.eventId)!;
      const rc = generateReaction(e);
      assert.equal(r.answer, answerFor(e.reaction, rc.direction), r.id);
      assert.equal(r.followAnswer, followFor(e.reaction), r.id);
    }
  });

  it("no answer letter is more than 35% of rounds, and every option is used", () => {
    for (const o of PRINT_OPTIONS) {
      const n = PRINT_ROUNDS.filter((r) => r.answer === o.id).length;
      assert.ok(n / PRINT_ROUNDS.length <= 0.35, `${o.id}: ${n}/${PRINT_ROUNDS.length}`);
      assert.ok(n >= 1, `${o.id} unused`);
    }
  });

  it("the same answer never appears three times in a row", () => {
    for (let i = 2; i < PRINT_ROUNDS.length; i++)
      assert.ok(!(PRINT_ROUNDS[i]!.answer === PRINT_ROUNDS[i - 1]!.answer && PRINT_ROUNDS[i]!.answer === PRINT_ROUNDS[i - 2]!.answer), `at ${i}`);
  });

  it("step-3 key agrees with the chart's next 5 sessions", () => {
    for (const r of PRINT_ROUNDS) {
      const e = eventById(r.eventId)!;
      const rc = generateReaction(e);
      const ret = followReturn(rc);
      const d = rc.direction === "up" ? 1 : -1;
      const implied = e.expect.impliedMovePct / 100;
      if (r.followAnswer === "with") assert.ok(Math.sign(ret) === d, `${r.id} ${ret}`);
      if (r.followAnswer === "against") assert.ok(Math.sign(ret) === -d, `${r.id} ${ret}`);
      if (r.followAnswer === "chop") assert.ok(Math.abs(ret) < implied * 0.75, `${r.id} ${ret}`);
    }
  });

  it("explanations lead with what mattered and every fact appears in the round's own data", () => {
    for (const r of PRINT_ROUNDS) {
      const e = eventById(r.eventId)!;
      assert.ok(r.explanation.startsWith("What mattered: "));
      assert.ok(r.facts.length >= 5);
      assert.ok(r.facts.some((f) => f.includes(String(e.expect.impliedMovePct))), "implied move fact");
      assert.ok(r.facts.some((f) => f.startsWith("EPS ")), "EPS fact");
      assert.match(r.disclaimer, /SAMPLE/);
    }
  });

  it("every wrong option has feedback; the right one has none", () => {
    for (const r of PRINT_ROUNDS) {
      for (const o of PRINT_OPTIONS) {
        if (o.id === r.answer) assert.equal(r.feedback[o.id], undefined);
        else assert.ok((r.feedback[o.id] ?? "").length > 20, `${r.id} ${o.id}`);
      }
    }
  });
});

class FakeStore implements KeyValueStore {
  data = new Map<string, string>();
  getItem(k: string) {
    return this.data.get(k) ?? null;
  }
  setItem(k: string, v: string) {
    this.data.set(k, v);
  }
}

describe("FE5.M3 progress + scoring", () => {
  it("uses its own key, distinct from every existing key", () => {
    assert.equal(READ_THE_PRINT_KEY, "analysis_core_read_the_print_v1");
    assert.notEqual(READ_THE_PRINT_KEY, PROGRESS_STORAGE_KEY);
    assert.equal(PROGRESS_STORAGE_KEY, "analysis_core_progress_v1", "existing key unchanged");
    const misc = readFileSync(new URL("../miscPractices.ts", import.meta.url), "utf8");
    assert.ok(misc.includes('"analysis_core_misc_practices_done_v1"'), "existing misc key unchanged");
  });

  it("persists across a reload and never touches other keys", () => {
    const store = new FakeStore();
    store.setItem(PROGRESS_STORAGE_KEY, '{"untouched":true}');
    let p = loadPrintProgress(store);
    assert.deepEqual(p, emptyPrintProgress());
    p = recordRound(p, "rtp-a", true, false, new Date("2026-10-21T12:00:00Z"));
    p = recordRound(p, "rtp-b", false, undefined, new Date("2026-10-21T12:01:00Z"));
    p = finishSession(p, 5);
    savePrintProgress(p, store);
    const reloaded = loadPrintProgress(store);
    assert.deepEqual(reloaded, p);
    assert.equal(completedCount(reloaded), 2);
    assert.equal(correctCount(reloaded), 1);
    assert.equal(reloaded.bestSessionScore, 5);
    assert.equal(finishSession(reloaded, 3).bestSessionScore, 5, "best score is kept");
    assert.equal(store.getItem(PROGRESS_STORAGE_KEY), '{"untouched":true}');
    assert.deepEqual([...store.data.keys()].sort(), [PROGRESS_STORAGE_KEY, READ_THE_PRINT_KEY].sort());
  });

  it("recovers from corrupt or foreign data", () => {
    const store = new FakeStore();
    store.setItem(READ_THE_PRINT_KEY, "{not json");
    assert.deepEqual(loadPrintProgress(store), emptyPrintProgress());
    store.setItem(READ_THE_PRINT_KEY, '{"version":2}');
    assert.deepEqual(loadPrintProgress(store), emptyPrintProgress());
    assert.deepEqual(loadPrintProgress(null), emptyPrintProgress());
  });

  it("scoring: 2 for the call, +1 for the follow-through", () => {
    assert.equal(roundPoints(true, true), 3);
    assert.equal(roundPoints(true, false), 2);
    assert.equal(roundPoints(false, true), 1);
    assert.equal(roundPoints(false, undefined), 0);
  });
});
