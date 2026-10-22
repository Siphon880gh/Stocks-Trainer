import { test } from "node:test";
import assert from "node:assert/strict";
import { ema, macd, sma } from "./indicators";

const near = (a: number | null, b: number, eps = 1e-9) => assert.ok(a != null && Math.abs(a - b) < eps, `${a} ≈ ${b}`);

test("sma and ema warm up, then match hand-worked values", () => {
  const c = [1, 2, 3, 4, 5, 6];
  assert.deepEqual(sma(c, 3), [null, null, 2, 3, 4, 5]);
  const e = ema(c, 3); // k = 0.5, seeded with the SMA of the first 3
  assert.deepEqual(e.slice(0, 2), [null, null]);
  near(e[2], 2);
  near(e[3], 3);
  near(e[5], 5);
  // after a jump the EMA moves halfway (k = 0.5); the SMA moves a third
  const j = [10, 10, 10, 16];
  near(ema(j, 3)[3], 13);
  near(sma(j, 3)[3], 12);
});

test("macd: first value at slow-1, first signal at slow+signal-2, histogram = macd - signal", () => {
  const closes = Array.from({ length: 60 }, (_, i) => 100 + i * 0.5 + Math.sin(i / 3));
  const m = macd(closes, 12, 26, 9);
  assert.equal(m.macd.findIndex((v) => v != null), 25);
  assert.equal(m.signal.findIndex((v) => v != null), 33);
  for (let i = 33; i < 60; i++) near(m.histogram[i], m.macd[i]! - m.signal[i]!);
  // signal seeded from MACD values only: at index 33 it is the mean of macd[25..33]
  const mean = m.macd.slice(25, 34).reduce((a, b) => a + b!, 0) / 9;
  near(m.signal[33], mean);
});

// Regression: the signal used to be an EMA of zero-filled warm-up bars, so on a steady
// climb it started far below MACD and showed a fake "MACD above signal" histogram.
test("macd on a straight line: signal equals MACD once warmed up", () => {
  const line = Array.from({ length: 80 }, (_, i) => 50 + i);
  const m = macd(line, 12, 26, 9);
  for (let i = 33; i < 80; i++) near(m.histogram[i], 0, 1e-9);
});
