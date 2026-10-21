import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import MarkTheBand from "../../components/financials/MarkTheBand";
import { eventById, resolveEvent } from "./earningsEvents";
import { BAND_ROUNDS, gradeBand } from "./markTheBand";
import { EVENT_INDEX, generateReaction } from "./reactionCharts";
import { PRINT_ROUNDS } from "./readThePrint";

const html = (p: Parameters<typeof MarkTheBand>[0]) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <MarkTheBand {...p} />
    </MemoryRouter>,
  );

test("FE8.M3: one round per Read the Print round, same order, truth from the fixture", () => {
  assert.equal(BAND_ROUNDS.length, PRINT_ROUNDS.length);
  BAND_ROUNDS.forEach((t, i) => {
    assert.equal(t.eventId, PRINT_ROUNDS[i]!.eventId);
    const e = eventById(t.eventId)!;
    const rc = generateReaction(e);
    assert.equal(t.priorClose, rc.bars[EVENT_INDEX - 1]!.close);
    assert.ok(Math.abs(t.high - t.priorClose * (1 + e.expect.impliedMovePct / 100)) <= 0.005);
    assert.ok(Math.abs(t.low - t.priorClose * (1 - e.expect.impliedMovePct / 100)) <= 0.005);
    // Gap-fill archetype fills; gap-and-go never does.
    if (e.reaction === "gap-fill") assert.ok(t.filledAfter !== null && t.filledAfter <= 8, t.eventId);
    if (e.reaction === "gap-and-go") assert.equal(t.filledAfter, null, t.eventId);
    // Non-muted gaps leave the band; muted gaps stay in it.
    assert.equal(Math.abs(t.gapPct) * 100 > e.expect.impliedMovePct, e.reaction !== "muted", t.eventId);
  });
});

test("FE8.M3: grading tolerances", () => {
  const t = BAND_ROUNDS[0]!;
  assert.equal(gradeBand(t, { low: t.low, high: t.high, fill: t.fillLevel }).points, 3);
  const off = gradeBand(t, { low: t.low * 0.98, high: t.high + t.priorClose * 0.004, fill: t.fillLevel * 1.01 });
  assert.deepEqual([off.lowOk, off.highOk, off.fillOk], [false, true, false]);
  const blank = gradeBand(t, { low: null, high: undefined });
  assert.deepEqual([blank.lowOk, blank.highOk, blank.fillOk, blank.points], [false, false, null, 0]);
  // Common mistake: dollars instead of percent.
  assert.equal(gradeBand(t, { low: t.priorClose - t.impliedMovePct, high: t.priorClose + t.impliedMovePct }).points, 0);
});

test("FE8.M3: band phase shows only the 30 pre-report bars and no outcome; reveal shows all and the result", () => {
  for (let i = 0; i < BAND_ROUNDS.length; i++) {
    const t = BAND_ROUNDS[i]!;
    const r = resolveEvent(eventById(t.eventId)!);
    const band = html({ initialRoundIndex: i });
    assert.ok(band.includes('data-bars="30"'), `round ${i + 1}`);
    assert.ok(!band.includes('data-testid="band-result"'));
    assert.ok(!band.includes(r.event.whatMattered));
    const fill = html({ initialRoundIndex: i, initialPhase: "fill", initialLow: t.low, initialHigh: t.high });
    assert.ok(fill.includes('data-bars="31"'));
    assert.ok(!fill.includes(r.event.whatMattered));
  }
  const t0 = BAND_ROUNDS[0]!;
  const withLines = html({ initialRoundIndex: 0, initialLow: t0.low, initialHigh: t0.high });
  assert.ok(withLines.includes(`Your low $${t0.low.toFixed(2)}`) && withLines.includes(`Your high $${t0.high.toFixed(2)}`), "user lines drawn with exact prices");
  const t = BAND_ROUNDS[1]!;
  const rev = html({ initialRoundIndex: 1, initialPhase: "reveal", initialLow: t.low, initialHigh: t.high, initialFill: t.fillLevel });
  assert.ok(rev.includes('data-bars="46"'));
  assert.ok(rev.includes("3/3"));
});
