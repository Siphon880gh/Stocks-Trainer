import { test } from "node:test";
import assert from "node:assert/strict";
import { PATTERNS } from "./patterns";
import {
  CRYPTO_CANDLE_QUESTIONS, HARAMI_TAKEAWAY, candlestickPatterns, cryptoFitFor, isCandlestickPattern,
} from "./cryptoCandles";

test("every candlestick pattern has a crypto tag; chart patterns are untagged", () => {
  const tagged = candlestickPatterns();
  assert.ok(tagged.length >= 80, `expected many candles, got ${tagged.length}`);
  for (const p of tagged) {
    assert.ok(["works", "adapted", "rare"].includes(p.cryptoFit), p.id);
    assert.equal(cryptoFitFor(p.id), p.cryptoFit);
  }
  for (const p of PATTERNS) {
    if (isCandlestickPattern(p.id)) assert.ok(cryptoFitFor(p.id));
    else assert.equal(cryptoFitFor(p.id), null, p.id);
  }
});

test("gap patterns are rare; body patterns work; stars are adapted", () => {
  assert.equal(cryptoFitFor("bullish-engulfing"), "works");
  assert.equal(cryptoFitFor("harami"), "works");
  assert.equal(cryptoFitFor("hammer"), "works");
  assert.equal(cryptoFitFor("rising-three-methods"), "works");
  assert.equal(cryptoFitFor("morning-star"), "adapted");
  assert.equal(cryptoFitFor("piercing-line"), "adapted");
  assert.equal(cryptoFitFor("bullish-abandoned-baby"), "rare");
  assert.equal(cryptoFitFor("bullish-kicker"), "rare");
  assert.equal(cryptoFitFor("upside-gap-two-crows"), "rare");
  assert.equal(cryptoFitFor("head-shoulders"), null);
});

test("harami takeaway is Weng's sentence verbatim", () => {
  assert.equal(
    HARAMI_TAKEAWAY,
    "A harami candle signals a potential trend reversal by showing market hesitation, helping commodity traders spot weakening momentum and possible entry or exit points.",
  );
});

test("crypto candle quiz: 10+ unique, well-formed questions", () => {
  assert.ok(CRYPTO_CANDLE_QUESTIONS.length >= 10);
  assert.equal(new Set(CRYPTO_CANDLE_QUESTIONS.map((q) => q.id)).size, CRYPTO_CANDLE_QUESTIONS.length);
  for (const q of CRYPTO_CANDLE_QUESTIONS) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
});
