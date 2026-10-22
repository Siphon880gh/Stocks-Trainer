import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { BADGES, earnedBadgeIds } from "./badges";
import { refreshBadges } from "./refresh";
import { ACADEMY_KEY, PAPER_KEY, emptyAcademy, emptyPaper, emptyRewards, memoryStorage, type AcademyState, type PaperStore, type RewardsState } from "../storage";
import { UNITS } from "../content/levels";
import { CHALLENGES } from "../challenges";
import { award } from "./ledger";
import { addDays } from "./streak";

const NOW = new Date("2026-10-21T19:00:00Z");

function scriptedLearner(): { academy: AcademyState; paper: PaperStore; rewards: RewardsState } {
  const academy = emptyAcademy();
  for (const u of UNITS) academy.units[u.id] = { best: 3, total: 3, attempts: 1, lastAt: NOW.toISOString(), masteredAt: NOW.toISOString() };
  academy.testedOut.L5 = { at: NOW.toISOString(), correct: 7, total: 7 };
  academy.placement = { startLevel: "L2", correct: 8, total: 12, skipped: false, at: NOW.toISOString() };
  for (const l of ["1", "2", "3", "4"]) academy.options.passed[l] = NOW.toISOString();
  for (let i = 0; i < 7; i++) academy.daily[addDays("2026-10-01", i)] = { questionId: `q${i}`, correct: true };
  const paper = emptyPaper();
  paper.stats = { orders: 12, limitFills: 2, trailingExits: 1, stopProtectedTrades: 5, stopLimitNoFills: 1 };
  for (const c of CHALLENGES) paper.challengeAttempts[c.id] = [{ score: 100, max: 100, passed: true, at: NOW.toISOString() }];
  let rewards = emptyRewards();
  rewards = award(rewards, "bulk", "unit-mastered", 600, NOW).state;
  rewards.streak.days = Array.from({ length: 8 }, (_, i) => addDays("2026-10-14", i));
  return { academy, paper, rewards };
}

test("≥ 20 badges with unique ids, original names, Material Symbols icons and plain hints", () => {
  assert.ok(BADGES.length >= 20);
  assert.equal(new Set(BADGES.map((b) => b.id)).size, BADGES.length);
  assert.equal(new Set(BADGES.map((b) => b.name)).size, BADGES.length);
  for (const b of BADGES) {
    assert.match(b.icon, /^[a-z_]+$/);
    assert.ok(b.hint.length > 8 && !/[=>(){}]/.test(b.hint), `${b.id}: hint is prose, not predicate code`);
  }
});

test("a fresh learner earns none; the scripted learner earns every badge", () => {
  assert.equal(earnedBadgeIds({ academy: emptyAcademy(), paper: emptyPaper(), rewards: emptyRewards() }, NOW).size, 0);
  const earned = earnedBadgeIds(scriptedLearner(), NOW);
  for (const b of BADGES) assert.ok(earned.has(b.id), b.id);
});

test("refresh only ever adds (never revokes) and reads the stores without writing", () => {
  const l = scriptedLearner();
  const store = memoryStorage({ [ACADEMY_KEY]: JSON.stringify(l.academy), [PAPER_KEY]: JSON.stringify(l.paper) });
  const r = refreshBadges(l.rewards, store, NOW);
  assert.equal(r.added.length, BADGES.length);
  assert.deepEqual(store.writes, []);
  // later the stores are wiped: badges stay
  const again = refreshBadges(r.state, memoryStorage(), NOW);
  assert.deepEqual(again.added, []);
  assert.equal(Object.keys(again.state.badges).length, BADGES.length);
  // malformed paper session never crashes
  const bad = { ...emptyPaper(), session: { tapeId: "nope", startingCash: 1, bar: 0, actions: [] } };
  assert.doesNotThrow(() => earnedBadgeIds({ academy: emptyAcademy(), paper: bad, rewards: emptyRewards() }, NOW));
});

test("badge copy never mentions money, prizes or redemption", () => {
  const src = readFileSync(new URL("./badges.ts", import.meta.url), "utf8");
  assert.doesNotMatch(src, /redeem|prize|cash out|gift card|\$\d/i);
});
