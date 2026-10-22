import { test } from "node:test";
import assert from "node:assert/strict";
import { CHALLENGES, RECKLESS_PLAYS, REFERENCE_PLAYS, play, planPolicy, scoreChallenge } from "./challenges";

test("every challenge is solvable: the scripted reference play passes all rules and meets ≥ 1 goal", () => {
  for (const c of CHALLENGES) {
    const s = scoreChallenge(c, play(c, planPolicy(REFERENCE_PLAYS[c.id]!)));
    assert.deepEqual(s.breaches, [], c.id);
    assert.ok(s.goalsMet.length >= 1, c.id);
    assert.equal(s.passed, true, c.id);
  }
});

test("every challenge punishes the reckless play: ≥ 1 rule breached, lower score than the reference", () => {
  for (const c of CHALLENGES) {
    const ref = scoreChallenge(c, play(c, planPolicy(REFERENCE_PLAYS[c.id]!)));
    const r = scoreChallenge(c, play(c, planPolicy(RECKLESS_PLAYS[c.id]!)));
    assert.ok(r.breaches.length >= 1, c.id);
    assert.equal(r.passed, false, c.id);
    assert.ok(r.score < ref.score, c.id);
  }
});
