import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import * as ledgerModule from "./ledger";
import { POINTS, award, pointsBySource, pointsForKey, totalPoints, unitMasteryPoints } from "./ledger";
import { emptyRewards } from "../storage";

const NOW = new Date("2026-10-21T12:00:00Z");

test("same key twice is a no-op; a better retry adds only the delta up to the cap; never subtracts", () => {
  let s = emptyRewards();
  s = award(s, "unit:a", "unit-mastered", unitMasteryPoints(2, 3), NOW).state;
  assert.equal(totalPoints(s.ledger), 20);
  const again = award(s, "unit:a", "unit-mastered", 20, NOW);
  assert.equal(again.added, 0);
  assert.equal(again.state, s);
  const better = award(s, "unit:a", "unit-mastered", unitMasteryPoints(3, 3), NOW);
  assert.equal(better.added, 10);
  assert.equal(pointsForKey(better.state.ledger, "unit:a"), POINTS.unitMastered);
  const worse = award(better.state, "unit:a", "unit-mastered", 5, NOW);
  assert.equal(worse.added, 0);
  assert.equal(better.state.ledger.length, 2, "append-only: two events, delta-sized");
});

test("totals by source; point table constants", () => {
  let s = emptyRewards();
  s = award(s, "first-order", "first-order", POINTS.firstOrder, NOW).state;
  s = award(s, "test-out:L2", "test-out", POINTS.testOut, NOW).state;
  s = award(s, "challenge:x", "challenge-passed", POINTS.challengePassed, NOW).state;
  const by = pointsBySource(s.ledger);
  assert.equal(by["first-order"], 10);
  assert.equal(by["test-out"], 50);
  assert.equal(by["challenge-passed"], 40);
  assert.equal(totalPoints(s.ledger), 100);
  assert.equal(unitMasteryPoints(0, 0), 0);
});

test("no API to spend, redeem or cash out points", () => {
  const src = readFileSync(new URL("./ledger.ts", import.meta.url), "utf8");
  assert.doesNotMatch(src, /export (const|function) (spend|redeem|cashOut|transfer|withdraw)/i);
  for (const name of Object.keys(ledgerModule)) assert.doesNotMatch(name, /spend|redeem|cash|transfer|withdraw/i);
});
