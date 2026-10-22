import { test } from "node:test";
import assert from "node:assert/strict";
import { RANK_NAMES, XP_THRESHOLDS, rankForPoints } from "./levels";

test("XP thresholds increase; rank boundaries are inclusive; top rank caps", () => {
  assert.equal(XP_THRESHOLDS.length, RANK_NAMES.length);
  for (let i = 1; i < XP_THRESHOLDS.length; i++) assert.ok(XP_THRESHOLDS[i]! > XP_THRESHOLDS[i - 1]!);
  assert.equal(rankForPoints(0).name, RANK_NAMES[0]);
  assert.equal(rankForPoints(99).name, RANK_NAMES[0]);
  assert.equal(rankForPoints(100).name, RANK_NAMES[1]);
  assert.equal(rankForPoints(1_000_000).name, RANK_NAMES[RANK_NAMES.length - 1]);
  for (const p of [0, 50, 100, 249, 250, 3199, 3200, 9999]) {
    const r = rankForPoints(p);
    assert.ok(r.progress >= 0 && r.progress <= 1, `${p}`);
  }
});
