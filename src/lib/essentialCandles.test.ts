import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERNS } from "./patterns";
import { PATTERN_OHLC, DRILL_CHART_SPECS } from "./ohlcData";
import { scanPatterns } from "./patternScan";
import { patternTabs } from "./patternTabs";
import {
  ESSENTIALS, EC_QUESTIONS, EVENING_STAR_DIAGRAM, MORNING_DOJI_DIAGRAM, MORNING_STAR_DIAGRAM, MORNING_STAR_TAKEAWAY, STAR_CASES,
  checkEveningStar, checkMorningStar, starCheck,
} from "./essentialCandles";

const IG16 = ["hammer", "hanging-man", "shooting-star", "doji", "bullish-engulfing", "bearish-engulfing", "tweezer-top", "tweezer-bottom",
  "morning-star", "evening-star", "three-white-soldiers", "three-black-crows", "inside-bar", "harami", "bearish-harami", "spinning-top"];

test("all 16 IG patterns (plus variants) exist with a lesson, a drill and a Learn question", () => {
  const ids = new Set(PATTERNS.map((p) => p.id));
  const drill = new Set(DRILL_CHART_SPECS.map((s) => s.key));
  for (const id of IG16) {
    assert.ok(ids.has(id), id);
    assert.ok(ESSENTIALS.some((e) => e.id === id), `essential ${id}`);
    assert.equal(patternTabs(PATTERNS.find((p) => p.id === id)!).general, false, `${id} lesson`);
    assert.ok(drill.has(id) || (id === "bullish-engulfing" && drill.has("engulfing")), `${id} drill`);
  }
  for (const v of ["gravestone-doji", "dragonfly-doji", "long-legged-doji", "morning-doji-star", "evening-doji-star", "inverted-hammer", "white-marubozu", "black-marubozu"]) assert.ok(ids.has(v), v);
});

test("silent fixes: inside bar is two candles; doji and spinning top are single candles", () => {
  const c = Object.fromEntries(ESSENTIALS.map((e) => [e.id, e.candles]));
  assert.equal(c["inside-bar"], 2);
  assert.equal(c.doji, 1);
  assert.equal(c["spinning-top"], 1);
});

test("morning / evening star 50% rule on the diagrams, the drill and every star chart in the app", () => {
  assert.ok(checkMorningStar(...(MORNING_STAR_DIAGRAM as [never, never, never])).valid);
  assert.ok(checkMorningStar(...(MORNING_DOJI_DIAGRAM as [never, never, never])).valid);
  assert.ok(checkEveningStar(...(EVENING_STAR_DIAGRAM as [never, never, never])).valid);
  const d = MORNING_DOJI_DIAGRAM[1];
  assert.equal(d.open, d.close, "doji star");
  // star gaps below / above body 1 in the diagrams
  assert.ok(Math.max(MORNING_STAR_DIAGRAM[1].open, MORNING_STAR_DIAGRAM[1].close) < MORNING_STAR_DIAGRAM[0].close);
  assert.ok(Math.min(EVENING_STAR_DIAGRAM[1].open, EVENING_STAR_DIAGRAM[1].close) > EVENING_STAR_DIAGRAM[0].close);
  const verdicts = STAR_CASES.map((c) => starCheck(c).valid);
  assert.ok(verdicts.includes(true) && verdicts.includes(false));
  assert.equal(starCheck(STAR_CASES.find((c) => c.id === "ms-near-miss")!).valid, false);
  assert.match(starCheck(STAR_CASES.find((c) => c.id === "ms-near-miss")!).reason, /not a valid morning star yet/);
  for (const [key, end, kind] of [["morning-star", 3, "m"], ["morning-doji-star", 4, "m"], ["evening-star", 3, "e"], ["evening-doji-star", 4, "e"]] as const) {
    const bars = PATTERN_OHLC[key];
    const e = bars.length > end ? end : bars.length - 1;
    const chk = kind === "m" ? checkMorningStar(bars[e - 2], bars[e - 1], bars[e]) : checkEveningStar(bars[e - 2], bars[e - 1], bars[e]);
    assert.ok(chk.valid, `${key}: ${chk.reason}`);
  }
  assert.equal(MORNING_STAR_TAKEAWAY, "A morning star is a three-candle pattern where the third (bullish) candle closes above the 50% midpoint of the first (bearish) candle's body.");
  assert.equal(PATTERNS.find((p) => p.id === "morning-star")!.takeaway, MORNING_STAR_TAKEAWAY);
});

test("the scanner enforces the midpoint rule for morning stars", () => {
  const lead = [{ name: "a", open: 120, high: 121, low: 112, close: 113 }, { name: "b", open: 113, high: 114, low: 109, close: 110 }];
  const valid = [...lead, ...STAR_CASES.find((c) => c.id === "ms-valid")!.bars];
  const miss = [...lead, ...STAR_CASES.find((c) => c.id === "ms-near-miss")!.bars];
  assert.ok(scanPatterns(valid).some((p) => p.name === "Morning Star"), "valid case detected");
  assert.ok(!scanPatterns(miss).some((p) => p.name === "Morning Star"), "near miss not labelled a morning star");
});

test("Learn group essential-candles: 15 questions, unique ids, valid answers", () => {
  assert.ok(EC_QUESTIONS.length >= 15);
  assert.equal(new Set(EC_QUESTIONS.map((q) => q.id)).size, EC_QUESTIONS.length);
  for (const q of EC_QUESTIONS) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
});
