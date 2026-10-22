/**
 * RSI with Wilder's smoothing, checked against the published StockCharts ChartSchool worked example
 * (cs-rsi.xls, linked from https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi,
 * downloaded 2026-10-22) and an independent RMA-form reference.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { rsi } from "./indicators.ts";

// StockCharts cs-rsi.xls: 33 closes and the 14-day RSI column (blank for the first 14 rows).
const SC_CLOSES = [
  44.3389, 44.0902, 44.1497, 43.6124, 44.3278, 44.8264, 45.0955, 45.4245, 45.8433, 46.0826, 45.8931, 46.0328, 45.614, 46.282, 46.282, 46.0028, 46.0328, 46.4116,
  46.2222, 45.6439, 46.2122, 46.2521, 45.7137, 46.4515, 45.7835, 45.3548, 44.0288, 44.1783, 44.2181, 44.5672, 43.4205, 42.6628, 43.1314,
];
const SC_RSI = [
  70.53278948369497, 66.31856180517232, 66.54982993552764, 69.40630533884433, 66.3551690562718, 57.97485571430819, 62.929606754597, 63.25714756254528,
  56.05929871526324, 62.37707144318042, 54.70757308126129, 50.4227744114564, 39.989823145376604, 41.46048197570564, 41.86891609254328, 45.46321244528675,
  37.30404208985967, 33.07952299438848, 37.77295211443486,
];

/** Independent reference: Wilder's average written as an RMA (avg += (x − avg) / n) over separate gain / loss arrays. */
function refRsi(closes: number[], n: number): (number | null)[] {
  const gains = closes.slice(1).map((c, i) => Math.max(c - closes[i]!, 0));
  const losses = closes.slice(1).map((c, i) => Math.max(closes[i]! - c, 0));
  const out: (number | null)[] = [null];
  let ag = NaN, al = NaN;
  gains.forEach((g, j) => {
    if (j < n - 1) return void out.push(null);
    if (j === n - 1) {
      ag = gains.slice(0, n).reduce((s, v) => s + v, 0) / n;
      al = losses.slice(0, n).reduce((s, v) => s + v, 0) / n;
    } else {
      ag += (g - ag) / n;
      al += (losses[j]! - al) / n;
    }
    out.push(al === 0 ? 100 : 100 * (ag / (ag + al)));
  });
  return out;
}

describe("RSI (Wilder)", () => {
  it("matches every value of the StockCharts worked example", () => {
    const r = rsi(SC_CLOSES, 14);
    assert.deepEqual(r.slice(0, 14), Array(14).fill(null));
    SC_RSI.forEach((v, j) => assert.ok(Math.abs(r[14 + j]! - v) < 1e-6, `row ${15 + j}: ${r[14 + j]} vs ${v}`));
  });
  it("matches the RMA reference on long tapes and several periods", () => {
    let s = 3;
    const rnd = () => ((s = (s * 48271) % 2147483647) / 2147483647);
    const closes: number[] = [];
    let c = 50;
    for (let i = 0; i < 300; i++) closes.push((c += (rnd() - 0.48) * 2));
    for (const n of [2, 5, 9, 14, 21]) {
      const a = rsi(closes, n);
      const b = refRsi(closes, n);
      a.forEach((v, i) => assert.ok(v == null ? b[i] == null : Math.abs(v - b[i]!) < 1e-9, `n=${n} i=${i}`));
    }
  });
  it("edge cases: too short → all null; only gains → 100; only losses → 0; flat → 100 (no loss)", () => {
    assert.deepEqual(rsi([1, 2, 3], 5), [null, null, null]);
    assert.equal(rsi([1, 2, 3, 4, 5, 6], 5)[5], 100);
    assert.equal(rsi([6, 5, 4, 3, 2, 1], 5)[5], 0);
    assert.equal(rsi([2, 2, 2, 2], 3)[3], 100);
  });
  it("differs from a plain simple-average RSI once smoothing starts (the reason for the switch)", () => {
    const r = rsi(SC_CLOSES, 14);
    const window = SC_CLOSES.slice(1, 16);
    let g = 0, l = 0;
    for (let i = 1; i < window.length; i++) {
      const d = window[i]! - window[i - 1]!;
      if (d > 0) g += d; else l -= d;
    }
    const simple = 100 - 100 / (1 + g / l);
    assert.ok(Math.abs(simple - r[15]!) > 0.1, `simple ${simple} vs Wilder ${r[15]}`);
  });
});
