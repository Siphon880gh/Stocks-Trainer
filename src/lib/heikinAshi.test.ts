/**
 * Heikin-Ashi checked against the StockCharts ChartSchool worked spreadsheet (QQQ, Aug 2011,
 * https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-types/heikin-ashi, read 2026-10-22)
 * and an independent reference.
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { heikinAshi, isIndecision, isStrongDown, isStrongUp } from "./heikinAshi.ts";
import type { OHLC } from "./ohlcData.ts";

// [open, high, low, close, haOpen, haHigh, haLow, haClose] as printed (2 decimals).
const SHEET: number[][] = [
  [58.67, 58.82, 57.03, 57.73, 58.67, 58.82, 57.03, 58.06],
  [57.46, 57.72, 56.21, 56.27, 58.37, 58.37, 56.21, 56.92],
  [56.37, 56.88, 55.35, 56.81, 57.64, 57.64, 55.35, 56.35],
  [55.98, 56.09, 54.17, 54.17, 57.0, 57.0, 54.17, 55.1],
  [54.79, 55.03, 52.32, 53.83, 56.05, 56.05, 52.32, 53.99],
  [52.21, 53.12, 50.59, 50.59, 55.02, 55.02, 50.59, 51.63],
  [51.31, 53.08, 49.93, 53.03, 53.32, 53.32, 49.93, 51.84],
  [51.82, 53.04, 50.8, 50.86, 52.58, 53.04, 50.8, 51.63],
  [51.58, 53.69, 51.34, 53.1, 52.11, 53.69, 51.34, 52.43],
  [53.42, 53.9, 52.88, 53.57, 52.27, 53.9, 52.27, 53.44],
  [53.77, 54.36, 53.53, 54.36, 52.85, 54.36, 52.85, 54.01],
  [53.82, 54.35, 53.18, 53.9, 53.43, 54.35, 53.18, 53.81],
  [53.98, 54.42, 53.02, 53.58, 53.62, 54.42, 53.02, 53.75],
  [52.13, 52.14, 50.48, 50.95, 53.69, 53.69, 50.48, 51.43],
  [50.43, 51.67, 49.99, 50.03, 52.56, 52.56, 49.99, 50.53],
  [51.21, 51.24, 50.06, 50.21, 51.54, 51.54, 50.06, 50.68],
  [50.56, 52.28, 50.34, 52.28, 51.11, 52.28, 50.34, 51.37],
  [52.18, 53.42, 51.71, 52.69, 51.24, 53.42, 51.24, 52.5],
  [52.64, 52.91, 51.65, 51.83, 51.87, 52.91, 51.65, 52.26],
  [51.68, 53.31, 51.15, 53.13, 52.06, 53.31, 51.15, 52.32],
  [53.64, 54.67, 53.64, 54.61, 52.19, 54.67, 52.19, 54.14],
  [54.39, 55.3, 54.11, 54.97, 53.17, 55.3, 53.17, 54.69],
  [55.29, 55.74, 54.6, 55.06, 53.93, 55.74, 53.93, 55.17],
];
const bars: OHLC[] = SHEET.map((r, i) => ({ name: String(i + 1), open: r[0]!, high: r[1]!, low: r[2]!, close: r[3]! }));

/** Independent reference: two passes (closes first, then the open recursion), then high / low. */
function refHa(b: OHLC[], firstOpen: number) {
  const close = b.map((x) => (x.open + x.high + x.low + x.close) / 4);
  const open: number[] = [firstOpen];
  for (let i = 1; i < b.length; i++) open.push((open[i - 1]! + close[i - 1]!) / 2);
  return b.map((x, i) => ({ open: open[i]!, close: close[i]!, high: Math.max(x.high, open[i]!, close[i]!), low: Math.min(x.low, open[i]!, close[i]!) }));
}

describe("heikinAshi", () => {
  it("matches every printed value of the StockCharts spreadsheet (seeded with the first open, as the sheet is)", () => {
    const ha = heikinAshi(bars, "open");
    SHEET.forEach((r, i) => {
      const got = [ha[i]!.open, ha[i]!.high, ha[i]!.low, ha[i]!.close];
      got.forEach((v, k) => assert.ok(Math.abs(v - r[4 + k]!) <= 0.0051, `row ${i + 1} col ${k}: ${v} vs ${r[4 + k]}`));
    });
  });
  it("default seed is (O + C) / 2, as the ChartSchool text says, and its effect fades within ~10 bars", () => {
    const a = heikinAshi(bars);
    const b = heikinAshi(bars, "open");
    assert.equal(a[0]!.open, (58.67 + 57.73) / 2);
    assert.equal(a[0]!.high, 58.82);
    assert.equal(a[0]!.low, 57.03);
    assert.ok(Math.abs(a[10]!.open - b[10]!.open) < 0.001);
  });
  it("matches the two-pass reference on a long random series", () => {
    let s = 7;
    const rnd = () => ((s = (s * 48271) % 2147483647) / 2147483647);
    const b: OHLC[] = [];
    let c = 100;
    for (let i = 0; i < 200; i++) {
      const o = c + (rnd() - 0.5);
      c = o + (rnd() - 0.48) * 3;
      b.push({ name: String(i), open: o, close: c, high: Math.max(o, c) + rnd(), low: Math.min(o, c) - rnd() });
    }
    const got = heikinAshi(b);
    const ref = refHa(b, (b[0]!.open + b[0]!.close) / 2);
    got.forEach((g, i) => (["open", "high", "low", "close"] as const).forEach((k) => assert.ok(Math.abs(g[k] - ref[i]![k]) < 1e-9, `${i} ${k}`)));
    got.forEach((g) => assert.ok(g.high >= Math.max(g.open, g.close) && g.low <= Math.min(g.open, g.close)));
  });
  it("reads: the sheet's late-August advance prints strong-up candles; the 4–5 Aug drop prints strong-down", () => {
    const ha = heikinAshi(bars, "open");
    assert.ok(isStrongUp(ha[20]!) && isStrongUp(ha[21]!) && isStrongUp(ha[22]!));
    assert.ok(isStrongDown(ha[3]!) && isStrongDown(ha[4]!) && isStrongDown(ha[5]!));
    assert.ok(isIndecision({ name: "x", open: 10, close: 10.1, high: 11, low: 9 }));
  });
});
