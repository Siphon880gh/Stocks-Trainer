import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { getLiteracyTerm } from "../literacyTerms";
import { EARNINGS_EVENTS, eventById } from "./earningsEvents";
import {
  EVENT_INDEX,
  POST_BARS,
  PRE_BARS,
  generateReaction,
  reactionViolations,
  revealAnnotations,
  type ReactionChart,
} from "./reactionCharts";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

describe("FE4.M2 reaction charts", () => {
  it("are deterministic (two runs deep-equal)", () => {
    for (const e of EARNINGS_EVENTS) assert.deepEqual(generateReaction(e), generateReaction(e));
  });

  for (const e of EARNINGS_EVENTS) {
    it(`${e.id} (${e.reaction}): matches its archetype and passes every chart rule`, () => {
      const rc = generateReaction(e);
      assert.equal(rc.bars.length, PRE_BARS + 1 + POST_BARS);
      assert.equal(rc.eventIndex, EVENT_INDEX);
      assert.deepEqual(reactionViolations(rc, e), []);
      assert.equal(new Set(rc.bars.map((b) => b.name)).size, rc.bars.length, "unique bar names (chart keys)");
    });
  }

  const base = () => clone(generateReaction(eventById("hbpn-q2fy26")!)) as ReactionChart;
  const ev = eventById("hbpn-q2fy26")!;
  const breaks: [string, (rc: ReactionChart) => void][] = [
    ["flat bar", (rc) => (rc.bars[5]!.high = rc.bars[5]!.low)],
    ["open = close", (rc) => (rc.bars[6]!.close = rc.bars[6]!.open)],
    ["unintended gap", (rc) => (rc.bars[10]!.open = rc.bars[10]!.open + 0.5)],
    ["missing volume", (rc) => delete rc.bars[3]!.volume],
    ["report volume too low", (rc) => (rc.bars[EVENT_INDEX]!.volume = 1)],
    ["gap too small", (rc) => (rc.bars[EVENT_INDEX]!.open = rc.bars[EVENT_INDEX - 1]!.close * 0.995)],
    ["gap never fills", (rc) => {
      for (let i = EVENT_INDEX + 1; i < rc.bars.length; i++) rc.bars[i]!.high = Math.min(rc.bars[i]!.high, rc.priorClose - 0.5);
    }],
  ];
  for (const [name, mutate] of breaks) {
    it(`validator catches: ${name}`, () => {
      const rc = base();
      mutate(rc);
      assert.ok(reactionViolations(rc, ev).length > 0, name);
    });
  }
});

describe("FE4.M3 reveal annotations", () => {
  for (const e of EARNINGS_EVENTS) {
    it(`${e.id}: indices in range, prices near the chart, related terms resolve`, () => {
      const rc = generateReaction(e);
      const { annotations: a, relatedTermIds } = revealAnnotations(rc, e);
      const n = rc.bars.length;
      const inRange = (i: number) => Number.isInteger(i) && i >= 0 && i < n;
      const lo = Math.min(...rc.bars.map((b) => b.low));
      const hi = Math.max(...rc.bars.map((b) => b.high));
      const pad = rc.priorClose * rc.impliedMove * 1.05;
      const nearChart = (p: number) => p >= lo - pad && p <= hi + pad;
      for (const z of a.zones ?? []) {
        assert.ok(inRange(z.fromIndex) && (z.toIndex === undefined || inRange(z.toIndex)));
        assert.ok(nearChart(z.top) && nearChart(z.bottom) && z.top > z.bottom, `zone ${z.label}`);
      }
      for (const l of a.levels ?? []) assert.ok(nearChart(l.price));
      for (const p of a.points ?? []) assert.ok(inRange(p.index) && nearChart(p.price), p.label);
      for (const t of a.trendlines ?? []) assert.ok(inRange(t.from.index) && inRange(t.to.index));
      assert.deepEqual((a.events ?? []).map((x) => x.index), [EVENT_INDEX]);
      for (const id of relatedTermIds) assert.ok(getLiteracyTerm(id), `term ${id}`);
      if (e.reaction === "gap-fill") assert.ok(a.points!.some((p) => p.label === "Gap filled"));
      if (e.reaction === "pead-drift") assert.ok(a.trendlines!.some((t) => t.label === "Drift"));
    });
  }
});
