import { test } from "node:test";
import assert from "node:assert/strict";
import { FOREIGN_KEYS, RETRO_KEY, applyRetroCredit, retroBreakdown } from "./retro";
import { emptyRewards, memoryStorage } from "../storage";
import { POINTS, pointsForKey } from "./ledger";

const seed = () => ({
  [FOREIGN_KEYS.progress]: JSON.stringify({ milestones: { a: { status: "complete" }, b: { status: "complete" }, c: { status: "in_progress" } }, coachingCompleted: { x: true, y: false }, drillFlags: { newsLiteracy: true } }),
  [FOREIGN_KEYS.readThePrint]: JSON.stringify({ version: 1, rounds: { r1: { correct: true, at: "" }, r2: { correct: false, at: "" } }, bestSessionScore: 1, sessions: 1 }),
  [FOREIGN_KEYS.macro]: JSON.stringify({ rounds: { m1: { best: 3, total: 4, at: "" } } }),
});

test("reads existing progress, awards once, and never writes a foreign key", () => {
  const store = memoryStorage(seed());
  const before = new Map(store.data);
  const r = applyRetroCredit(emptyRewards(), store);
  assert.deepEqual(r.breakdown, { milestones: 2, coaching: 1, drills: 1, printRounds: 1, macroRounds: 1, raw: 20 + 5 + 5 + 2 + 2, points: 34 });
  assert.equal(r.added, 34);
  assert.deepEqual(store.writes, []);
  assert.deepEqual(new Map(store.data), before);
  const again = applyRetroCredit(r.state, store);
  assert.equal(again.added, 0, "idempotent");
});

test("capped at retroMax", () => {
  const milestones = Object.fromEntries(Array.from({ length: 40 }, (_, i) => [`m${i}`, { status: "complete" }]));
  const store = memoryStorage({ [FOREIGN_KEYS.progress]: JSON.stringify({ milestones }) });
  const r = applyRetroCredit(emptyRewards(), store);
  assert.equal(pointsForKey(r.state.ledger, RETRO_KEY), POINTS.retroMax);
});

test("missing or corrupt foreign keys → no award, no crash", () => {
  assert.equal(retroBreakdown(undefined).points, 0);
  assert.equal(retroBreakdown(memoryStorage()).points, 0);
  const bad = memoryStorage({ [FOREIGN_KEYS.progress]: "{not json", [FOREIGN_KEYS.readThePrint]: "[1,2]", [FOREIGN_KEYS.macro]: '{"rounds":"x"}' });
  assert.equal(applyRetroCredit(emptyRewards(), bad).added, 0);
  assert.deepEqual(bad.writes, []);
});
