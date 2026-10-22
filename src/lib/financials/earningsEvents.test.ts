import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { companyById } from "./companies";
import {
  EARNINGS_EVENTS,
  REACTION_ARCHETYPES,
  epsOutcome,
  eventById,
  eventViolations,
  guidanceChange,
  resolveEvent,
  revenueOutcome,
  type EarningsEvent,
} from "./earningsEvents";

const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;

describe("FE3.M1 earnings events", () => {
  it("has ≥ 12 events, unique ids, every archetype ≥ 2 times, all 5 companies (FE8.M1 added a bank and a biotech)", () => {
    assert.ok(EARNINGS_EVENTS.length >= 12);
    assert.equal(new Set(EARNINGS_EVENTS.map((e) => e.id)).size, EARNINGS_EVENTS.length);
    for (const a of REACTION_ARCHETYPES) assert.ok(EARNINGS_EVENTS.filter((e) => e.reaction === a).length >= 2, a);
    assert.equal(new Set(EARNINGS_EVENTS.map((e) => e.companyId)).size, 5);
    assert.equal(eventById("irbg-q1fy26")?.reaction, "guidance-reversal");
  });

  for (const e of EARNINGS_EVENTS) {
    it(`${e.id}: actuals come from the fixture and every story rule holds`, () => {
      const r = resolveEvent(e);
      const q = companyById(e.companyId)!.quarters[e.quarterIndex]!;
      assert.equal(r.actualEps, q.income.epsDiluted);
      assert.equal(r.actualRevenue, q.income.revenue);
      assert.deepEqual(eventViolations(e), []);
      assert.equal(r.history.length, e.quarterIndex, "history excludes the reported quarter");
      assert.ok(e.whatMattered.length > 30 && e.headline.length > 10);
      assert.ok(e.priorClose > 0);
    });
  }

  it("no two events share a company + quarter", () => {
    const keys = EARNINGS_EVENTS.map((e) => `${e.companyId}:${e.quarterIndex}`);
    assert.equal(new Set(keys).size, keys.length);
  });
});

describe("FE3.M1 computed labels", () => {
  it("EPS outcome uses a one-cent threshold", () => {
    assert.equal(epsOutcome(0.31, 0.28), "beat");
    assert.equal(epsOutcome(-0.05, -0.05), "in-line");
    assert.equal(epsOutcome(-0.15, -0.17), "beat");
    assert.equal(epsOutcome(0.15, 0.16), "miss");
  });
  it("revenue outcome and guidance change use ±1%", () => {
    assert.equal(revenueOutcome(101, 100), "beat");
    assert.equal(revenueOutcome(100.5, 100), "in-line");
    assert.equal(revenueOutcome(99, 100), "miss");
    assert.equal(guidanceChange({ low: 100, high: 104 }, 100), "raise");
    assert.equal(guidanceChange({ low: 99, high: 101 }, 100), "maintain");
    assert.equal(guidanceChange({ low: 90, high: 96 }, 100), "cut");
  });
});

describe("FE3.M1 validators catch inconsistent stories", () => {
  const base = () => clone(eventById("nwcl-q2fy25")!) as EarningsEvent;
  const breaks: [string, (e: EarningsEvent) => void][] = [
    ["claimed EPS label disagrees", (e) => (e.claims.eps = "miss")],
    ["implied move out of range", (e) => (e.expect.impliedMovePct = 25)],
    ["whisper on the wrong side", (e) => (e.expect.whisperEps = -0.2)],
    ["gap-and-go without a raise", (e) => {
      e.newGuidance = { low: 45000, high: 45600 };
      e.claims.guidance = "maintain";
    }],
    ["sell-the-news without a run-up", (e) => (e.reaction = "sell-the-news")],
    ["muted with a beat on revenue", (e) => (e.reaction = "muted")],
    ["inverted guidance range", (e) => (e.expect.priorGuidance = { low: 5, high: 1 })],
  ];
  for (const [name, mutate] of breaks) {
    it(name, () => {
      const e = base();
      mutate(e);
      assert.ok(eventViolations(e).length > 0, name);
    });
  }
});
