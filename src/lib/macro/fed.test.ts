import { test } from "node:test";
import assert from "node:assert/strict";
import * as C from "./consistency";
import { dotsFor, expectedMoveBp, meetingByMonth, priorSepMedianSameYear, pricingFor, statementFor } from "./fed";
import { WORLD } from "./world";

test("pricing sums to 100 and expected = Σ p × move", () => {
  for (const m of WORLD.meetings) {
    const p = pricingFor(m);
    assert.deepEqual(C.checkProbabilities(m.label, p.map((o) => o.prob)), []);
    for (const o of p) assert.deepEqual(C.checkDecisionStep(m.label, o.moveBp), []);
    assert.equal(expectedMoveBp(p), Math.round(p.reduce((a, o) => a + o.moveBp * o.prob, 0)) / 100);
    const s = statementFor(m);
    assert.equal(s.surpriseBp, Math.round((m.decisionBp - s.expectedBp) * 100) / 100);
    assert.equal(s.votesFor + s.votesAgainst, 12);
  }
  assert.equal(WORLD.meetings.length, 24);
});

test("dots: 19 per column, median is the 10th sorted, 1/8 steps", () => {
  const seps = WORLD.meetings.filter((m) => m.sep);
  assert.equal(seps.length, 12);
  for (const m of seps) {
    const cols = dotsFor(m)!;
    assert.equal(cols.length, 4);
    for (const c of cols) {
      assert.equal(c.dots.length, 19);
      assert.equal(c.median, [...c.dots].sort((a, b) => a - b)[9]);
      for (const d of c.dots) assert.equal(d * 8, Math.round(d * 8));
    }
  }
  assert.equal(dotsFor(meetingByMonth(0)!), undefined);
});

test("teaching meetings carry the intended surprise", () => {
  assert.ok(statementFor(meetingByMonth(5)!).surpriseBp >= 10, "hawkish surprise hike");
  assert.ok(Math.abs(statementFor(meetingByMonth(6)!).surpriseBp) < 5, "priced-in hike");
  assert.ok(statementFor(meetingByMonth(21)!).surpriseBp <= -10, "dovish first cut");
  assert.ok(statementFor(meetingByMonth(26)!).surpriseBp <= -15, "bigger-than-priced cut");
  const m14 = meetingByMonth(14)!;
  assert.ok(dotsFor(m14)![0]!.median > priorSepMedianSameYear(m14, 0)!, "hawkish dots at a hold");
});
