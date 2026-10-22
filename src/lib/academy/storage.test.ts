import { test } from "node:test";
import assert from "node:assert/strict";
import {
  ACADEMY_KEY,
  ACADEMY_KEYS,
  PAPER_KEY,
  REWARDS_KEY,
  emptyAcademy,
  emptyPaper,
  emptyRewards,
  loadAcademy,
  loadPaper,
  loadRewards,
  memoryStorage,
  migrateAcademy,
  migratePaper,
  migrateRewards,
  saveAcademy,
  savePaper,
  saveRewards,
} from "./storage";

const FOREIGN = "analysis_core_progress_v1";

test("keys are the three academy keys, none is the core progress key", () => {
  assert.deepEqual([...ACADEMY_KEYS], ["analysis_core_academy_v1", "analysis_core_academy_paper_v1", "analysis_core_academy_rewards_v1"]);
  assert.ok(!ACADEMY_KEYS.includes(FOREIGN as never));
});

test("round-trip for all three stores", () => {
  const s = memoryStorage();
  const a = emptyAcademy();
  a.units["l0-what-is-a-market"] = { best: 3, total: 3, attempts: 1, lastAt: "2026-10-21T10:00:00.000Z", masteredAt: "2026-10-21T10:00:00.000Z" };
  a.placement = { startLevel: "L2", correct: 6, total: 12, skipped: false, at: "2026-10-21T10:00:00.000Z" };
  saveAcademy(a, s, new Date("2026-10-21T11:00:00Z"));
  const la = loadAcademy(s);
  assert.equal(la.recovered, false);
  assert.deepEqual(la.state.units, a.units);
  assert.deepEqual(la.state.placement, a.placement);
  assert.equal(la.state.updatedAt, "2026-10-21T11:00:00.000Z");

  const p = emptyPaper();
  p.session = { tapeId: "trend-up", startingCash: 1_000_000, bar: 12, actions: [{ type: "cancel", atBar: 3, orderId: "o1" }] };
  savePaper(p, s);
  assert.deepEqual(loadPaper(s).state, p);

  const r = emptyRewards();
  r.ledger.push({ key: "unit:x", source: "unit-mastered", points: 30, at: "2026-10-21T10:00:00.000Z" });
  r.streak.days.push("2026-10-21");
  saveRewards(r, s, new Date("2026-10-21T12:00:00Z"));
  assert.deepEqual(loadRewards(s).state.ledger, r.ledger);
  assert.deepEqual(loadRewards(s).state.streak, r.streak);
});

test("v0 (missing fields) → v1 migration is lossless", () => {
  const v0 = { units: { u1: { best: 2, total: 3, attempts: 2, lastAt: "x" } }, placement: { startLevel: "L1", correct: 3, total: 12, skipped: false, at: "y" } };
  const m = migrateAcademy(v0);
  assert.equal(m.schemaVersion, 1);
  assert.deepEqual(m.units, v0.units);
  assert.deepEqual(m.placement, v0.placement);
  assert.deepEqual(m.options, { passed: {}, attempts: {}, acknowledged: {} });
  assert.deepEqual(m.daily, {});
  // migrating a v1 state again changes nothing
  assert.deepEqual(migrateAcademy(m), m);

  const p0 = { challengeAttempts: { c1: [{ score: 5, max: 10, passed: true, at: "z" }] }, stats: { orders: 4 } };
  const pm = migratePaper(p0);
  assert.deepEqual(pm.challengeAttempts, p0.challengeAttempts);
  assert.equal(pm.stats.orders, 4);
  assert.equal(pm.stats.limitFills, 0);
  assert.equal(pm.session, null);
  assert.deepEqual(migratePaper(pm), pm);

  const r0 = { ledger: [{ key: "k", source: "first-order", points: 10, at: "t" }], streak: { days: ["2026-10-20"] } };
  const rm = migrateRewards(r0);
  assert.deepEqual(rm.ledger, r0.ledger);
  assert.deepEqual(rm.streak, { days: ["2026-10-20"], freezes: [] });
  assert.deepEqual(migrateRewards(rm), rm);
});

test("corrupted JSON or a non-object → empty state with recovered: true", () => {
  for (const [key, load, empty] of [
    [ACADEMY_KEY, loadAcademy, emptyAcademy],
    [PAPER_KEY, loadPaper, emptyPaper],
    [REWARDS_KEY, loadRewards, emptyRewards],
  ] as const) {
    for (const bad of ["{not json", "[1,2]", "42", '"str"', JSON.stringify({ schemaVersion: 99 })]) {
      const s = memoryStorage({ [key]: bad });
      const l = (load as (s: unknown) => { state: unknown; recovered: boolean; message?: string })(s);
      assert.equal(l.recovered, true, `${key} ${bad}`);
      assert.ok(l.message && /reset/.test(l.message));
      assert.deepEqual(l.state, (empty as () => unknown)());
    }
  }
  // missing key → empty, not recovered
  assert.equal(loadAcademy(memoryStorage()).recovered, false);
  // no storage at all (SSR) → empty
  assert.deepEqual(loadRewards(undefined).state, emptyRewards());
});

test("spy storage: academy code never touches a foreign key", () => {
  const s = memoryStorage({ [FOREIGN]: '{"keep":true}', other_key: "x" });
  loadAcademy(s);
  loadPaper(s);
  loadRewards(s);
  saveAcademy(emptyAcademy(), s);
  savePaper(emptyPaper(), s);
  saveRewards(emptyRewards(), s);
  const touched = new Set([...s.reads, ...s.writes]);
  for (const k of touched) assert.ok((ACADEMY_KEYS as readonly string[]).includes(k), k);
  assert.equal(s.data.get(FOREIGN), '{"keep":true}');
});
