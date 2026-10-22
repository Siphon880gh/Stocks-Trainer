/** Core 14 Japanese patterns: registry, textbook shape rules on the SIMULATED illustrations, three tabs for every pattern, Learn bank. */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { PATTERN_OHLC, type OHLC } from "./ohlcData.ts";
import { PATTERNS, getPattern } from "./patterns.ts";
import { CORE_PATTERNS, coreBySide, patternIllustration, patternTabs } from "./patternTabs.ts";
import { JAPANESE_CANDLE_QUESTIONS } from "./candleQuiz.ts";
import { getLiteracyTerm } from "./literacyTerms.ts";
import { CANDLE_TERMS } from "./candleTerms.ts";

const body = (c: OHLC) => Math.abs(c.close - c.open);
const top = (c: OHLC) => Math.max(c.open, c.close);
const bot = (c: OHLC) => Math.min(c.open, c.close);
const upper = (c: OHLC) => c.high - top(c);
const lower = (c: OHLC) => bot(c) - c.low;
const green = (c: OHLC) => c.close > c.open;
const red = (c: OHLC) => c.close < c.open;
const mid = (c: OHLC) => (c.open + c.close) / 2;
const range = (c: OHLC) => c.high - c.low;
const doji = (c: OHLC) => body(c) <= 0.1 * range(c);

/** Textbook rules (Nison / Bulkowski / ChartSchool); engulfing accepts one equal body edge, as TA-Lib's screen does. */
const RULES: Record<string, (b: OHLC[], s: number) => boolean> = {
  "dragonfly-doji": (b, s) => doji(b[s]!) && upper(b[s]!) <= 0.05 * range(b[s]!) && lower(b[s]!) >= 0.8 * range(b[s]!),
  "gravestone-doji": (b, s) => doji(b[s]!) && lower(b[s]!) <= 0.05 * range(b[s]!) && upper(b[s]!) >= 0.8 * range(b[s]!),
  hammer: (b, s) => lower(b[s]!) >= 2 * body(b[s]!) && upper(b[s]!) <= body(b[s]!),
  "shooting-star": (b, s) => upper(b[s]!) >= 2 * body(b[s]!) && lower(b[s]!) <= 2 * body(b[s]!) && lower(b[s]!) < upper(b[s]!) / 4,
  "bullish-engulfing": (b, s) => red(b[s]!) && green(b[s + 1]!) && b[s + 1]!.open <= b[s]!.close && b[s + 1]!.close >= b[s]!.open && body(b[s + 1]!) > body(b[s]!),
  "bearish-engulfing": (b, s) => green(b[s]!) && red(b[s + 1]!) && b[s + 1]!.open >= b[s]!.close && b[s + 1]!.close <= b[s]!.open && body(b[s + 1]!) > body(b[s]!),
  "piercing-line": (b, s) => red(b[s]!) && green(b[s + 1]!) && b[s + 1]!.open < b[s]!.low && b[s + 1]!.close > mid(b[s]!) && b[s + 1]!.close < b[s]!.open,
  "dark-cloud-cover": (b, s) => green(b[s]!) && red(b[s + 1]!) && b[s + 1]!.open > b[s]!.high && b[s + 1]!.close < mid(b[s]!) && b[s + 1]!.close > b[s]!.open,
  "tweezer-bottom": (b, s) => Math.abs(b[s]!.low - b[s + 1]!.low) <= 0.05 * range(b[s]!) && red(b[s]!) && green(b[s + 1]!),
  "tweezer-top": (b, s) => Math.abs(b[s]!.high - b[s + 1]!.high) <= 0.05 * range(b[s]!) && green(b[s]!) && red(b[s + 1]!),
  "three-white-soldiers": (b, s) =>
    [0, 1, 2].every((k) => green(b[s + k]!) && upper(b[s + k]!) <= 0.5 * body(b[s + k]!)) &&
    [1, 2].every((k) => b[s + k]!.close > b[s + k - 1]!.close && b[s + k]!.open >= b[s + k - 1]!.open && b[s + k]!.open <= b[s + k - 1]!.close),
  "three-black-crows": (b, s) =>
    [0, 1, 2].every((k) => red(b[s + k]!) && lower(b[s + k]!) <= 0.5 * body(b[s + k]!)) &&
    [1, 2].every((k) => b[s + k]!.close < b[s + k - 1]!.close && b[s + k]!.open <= b[s + k - 1]!.open && b[s + k]!.open >= b[s + k - 1]!.close),
  "morning-star": (b, s) => red(b[s]!) && body(b[s + 1]!) <= 0.3 * body(b[s]!) && green(b[s + 2]!) && b[s + 2]!.close > mid(b[s]!) && top(b[s + 1]!) <= bot(b[s]!) + 0.3 * body(b[s]!),
  "evening-star": (b, s) => green(b[s]!) && body(b[s + 1]!) <= 0.3 * body(b[s]!) && red(b[s + 2]!) && b[s + 2]!.close < mid(b[s]!) && bot(b[s + 1]!) >= top(b[s]!) - 0.3 * body(b[s]!),
};

describe("core Japanese patterns", () => {
  it("7 bullish + 7 bearish, all in the registry with matching sentiment", () => {
    assert.equal(coreBySide("bullish").length, 7);
    assert.equal(coreBySide("bearish").length, 7);
    for (const c of CORE_PATTERNS) assert.equal(getPattern(c.id)?.sentiment, c.side, c.id);
  });
  it("each SIMULATED illustration meets the textbook rule, after the right prior trend", () => {
    for (const c of CORE_PATTERNS) {
      const b = PATTERN_OHLC[c.chartKey]!;
      assert.ok(RULES[c.id]!(b, c.bars[0]), `${c.id} shape`);
      const before = b[0]!.open;
      const atStart = b[c.bars[0]]!.open;
      assert.ok(c.side === "bullish" ? atStart < before : atStart > before, `${c.id} prior ${c.side === "bullish" ? "decline" : "rally"}`);
    }
  });
  it("the confirmation bar closes beyond the pattern's last bar in the pattern's direction", () => {
    for (const c of CORE_PATTERNS) {
      const ill = patternIllustration(c.id);
      const last = ill.bars[ill.highlight!]!;
      const conf = ill.bars[ill.confirmIndex!]!;
      assert.ok(c.side === "bullish" ? conf.close > last.high : conf.close < last.low, c.id);
    }
  });
  it("every registry pattern has three non-empty tabs; core ones are specific and name a stop", () => {
    for (const p of PATTERNS) {
      const t = patternTabs(p);
      assert.ok(t.recognise.length && t.psychology.length, p.id);
      for (const k of ["confirmation", "entry", "stop", "target"] as const) assert.ok(t.trade[k].length > 10, `${p.id} ${k}`);
      assert.equal(t.general, !CORE_PATTERNS.some((c) => c.id === p.id), p.id);
    }
    for (const c of CORE_PATTERNS) assert.match(c.tabs.trade.stop, /(below|above)/i, c.id);
    for (const id of ["dragonfly-doji", "gravestone-doji"]) assert.match(getPattern(id)!.description + CORE_PATTERNS.find((c) => c.id === id)!.tabs.trade.confirmation, /confirm/i, id);
  });
});

describe("japanese-candles Learn bank", () => {
  it("covers psychology and the trade plan for all 14, unique ids, valid charts", () => {
    const ids = JAPANESE_CANDLE_QUESTIONS.map((q) => q.id);
    assert.equal(new Set(ids).size, ids.length);
    assert.ok(ids.length >= 30);
    for (const c of CORE_PATTERNS) {
      const name = getPattern(c.id)!.name.toLowerCase().replace(/ line$/, "");
      const hits = JAPANESE_CANDLE_QUESTIONS.filter((q) => q.prompt.toLowerCase().includes(name.split(" ").slice(0, 2).join(" ")) || q.patternKey === c.chartKey);
      assert.ok(hits.length >= 2, `${c.id}: ${hits.length}`);
    }
    for (const q of JAPANESE_CANDLE_QUESTIONS.filter((x) => x.patternKey)) {
      const c = CORE_PATTERNS.find((x) => x.chartKey === q.patternKey)!;
      assert.ok(PATTERN_OHLC[q.patternKey!], q.id);
      assert.equal(q.highlightIndex, c.bars[1], q.id);
    }
  });
  it("glossary terms resolve", () => {
    for (const t of CANDLE_TERMS) assert.ok(getLiteracyTerm(t.id), t.id);
  });
});
