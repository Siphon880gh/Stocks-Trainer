import { test } from "node:test";
import assert from "node:assert/strict";
import {
  BAR_COUNT, FIB_TEACH, MES, ONE_MIN_QUESTIONS, SESSION, SIM_1M, fiveMinuteEnds, mesNet, ticksToCover,
} from "./oneMinuteCharts";

test("session math: 390 minutes → 78 five-minute bars", () => {
  assert.equal(SESSION.bars5m, 78);
  assert.equal(SESSION.minutes / 5, 78);
  assert.equal(BAR_COUNT.session5m, 78);
});

test("MES tick: 0.25 points = $1.25; example $1.50 RT needs 2 ticks", () => {
  assert.equal(MES.tickPoints, 0.25);
  assert.equal(MES.tickValue, 1.25);
  assert.equal(ticksToCover(1.5), 2);
  assert.equal(mesNet(1, 1, 1.5), 1.25 - 1.5);
  assert.ok(mesNet(2, 1, 1.5) > 0);
});

test("SIMULATED 1m series and 5m group ends", () => {
  assert.ok(SIM_1M.length >= 30);
  const ends = fiveMinuteEnds(SIM_1M.length);
  assert.ok(ends.every((i) => (i + 1) % 5 === 0));
});

test("TradingView fib settings use real names Reverse and Extend Lines Left/Right", () => {
  const names = FIB_TEACH.settings.map((s) => s.name);
  assert.ok(names.includes("Reverse"));
  assert.ok(names.includes("Extend Lines Left/Right"));
});

test("quiz 10+ well-formed", () => {
  assert.ok(ONE_MIN_QUESTIONS.length >= 10);
  assert.equal(new Set(ONE_MIN_QUESTIONS.map((q) => q.id)).size, ONE_MIN_QUESTIONS.length);
  for (const q of ONE_MIN_QUESTIONS) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
});
