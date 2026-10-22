/**
 * Fast / slow stochastic, KDJ, ATR and the volatility stop, checked three ways:
 * hand-worked numbers (including the worked KDJ step from a published example), independent reference
 * implementations written differently from src/lib/oscillators.ts, and structural identities from the sources
 * (slow %K equals fast %D; J = 3K − 2D; a volatility stop never moves against its trend).
 */
import { describe, it } from "node:test";
import assert from "node:assert/strict";
import type { OHLC } from "./ohlcData.ts";
import { atr, correlation, fastStochastic, kdj, kdjStep, lineCrosses, rawStochastic, slowStochastic, trueRange, volatilityStop } from "./oscillators.ts";

const bar = (high: number, low: number, close: number, open = close): OHLC => ({ name: "", open, high, low, close });
const close = (a: number, b: number, eps = 1e-9) => Math.abs(a - b) <= eps;

// Hand fixture: bar 3 gaps down far below bar 2's close.
const HAND: OHLC[] = [bar(10, 8, 9), bar(11, 9, 10.5), bar(13, 10, 12), bar(9, 7, 8)];

/** Deterministic test tape with real ranges: trend, chop and a gap. */
function tape(n = 160): OHLC[] {
  let s = 7;
  const r = () => ((s = (s * 16807) % 2147483647) / 2147483647);
  const out: OHLC[] = [];
  let c = 100;
  for (let i = 0; i < n; i++) {
    const drift = i < 50 ? 0.7 : i < 90 ? Math.sin(i / 4) * 1.2 : i === 120 ? -9 : -0.5;
    const o = c;
    c = Math.round((c + drift + (r() - 0.5) * 2) * 100) / 100;
    out.push({ name: `D${i + 1}`, open: o, high: Math.max(o, c) + r(), low: Math.min(o, c) - r(), close: c });
  }
  return out;
}

// ---------------------------------------------------------------- reference implementations
const refTR = (b: OHLC[]) => b.map((x, i) => (i ? Math.max(...[x.high - x.low, x.high - b[i - 1]!.close, b[i - 1]!.close - x.low].map(Math.abs)) : x.high - x.low));
function refATR(b: OHLC[], n: number) {
  const tr = refTR(b);
  let rma: number | null = null;
  return tr.map((t, i) => {
    if (i < n - 1) return null;
    if (rma == null) rma = tr.slice(0, n).reduce((s, v) => s + v, 0) / n;
    else rma = rma + (t - rma) / n; // the ATR smoothing written as an RMA with alpha = 1/n
    return rma;
  });
}
function refK(b: OHLC[], n: number) {
  return b.map((x, i) => {
    if (i + 1 < n) return null;
    const w = b.slice(i + 1 - n, i + 1);
    const hh = Math.max(...w.map((y) => y.high));
    const ll = Math.min(...w.map((y) => y.low));
    return hh === ll ? 50 : ((x.close - ll) / (hh - ll)) * 100;
  });
}
const refSMA3 = (v: (number | null)[]) => v.map((x, i) => (i >= 2 && x != null && v[i - 1] != null && v[i - 2] != null ? (x + v[i - 1]! + v[i - 2]!) / 3 : null));
function refKDJ(b: OHLC[], n: number) {
  const rsv = refK(b, n);
  let K = 50, D = 50;
  return rsv.map((r) => {
    if (r == null) return null;
    K = r / 3 + (K * 2) / 3;
    D = K / 3 + (D * 2) / 3;
    return { K, D, J: 3 * K - 2 * D };
  });
}
/** Volatility stop written in the shape of TradingView's original Pine script (var max / min / uptrend / stop). */
function refVStop(b: OHLC[], len: number, factor: number) {
  const a = refATR(b, len);
  let max = NaN, min = NaN, uptrend = true, stop = NaN, prevUp: boolean | null = null;
  return b.map((x, i) => {
    if (a[i] == null) return null;
    const src = x.close;
    const atrM = a[i]! * factor;
    if (Number.isNaN(stop)) {
      max = min = src;
      stop = src - atrM;
      uptrend = true;
      prevUp = true;
      return { stop, up: uptrend };
    }
    max = Math.max(max, src);
    min = Math.min(min, src);
    stop = uptrend ? Math.max(stop, max - atrM) : Math.min(stop, min + atrM);
    uptrend = src - stop >= 0;
    if (uptrend !== prevUp) {
      max = min = src;
      stop = uptrend ? max - atrM : min + atrM;
    }
    prevUp = uptrend;
    return { stop, up: uptrend };
  });
}

describe("true range and ATR", () => {
  it("hand fixture: TR uses the previous close on a gap; ATR(3) = mean of 3 TRs, then (prev × 2 + TR) / 3", () => {
    assert.deepEqual(trueRange(HAND), [2, 2, 3, 5]);
    const a = atr(HAND, 3);
    assert.deepEqual(a.slice(0, 2), [null, null]);
    assert.ok(close(a[2]!, 7 / 3));
    assert.ok(close(a[3]!, 29 / 9));
  });
  it("matches the RMA reference on a long tape", () => {
    const t = tape();
    for (const n of [5, 14, 20]) {
      const a = atr(t, n);
      const r = refATR(t, n);
      a.forEach((v, i) => assert.ok(v == null ? r[i] == null : close(v, r[i]!), `n=${n} i=${i}`));
    }
  });
});

describe("stochastic oscillator", () => {
  it("hand fixture: fast %K(3) = 100 × (C − LL) / (HH − LL)", () => {
    const k = rawStochastic(HAND, 3);
    assert.ok(close(k[2]!, 80));
    assert.ok(close(k[3]!, 100 / 6));
  });
  it("fast %K / %D match the brute-force reference; %D = SMA(3) of %K", () => {
    const t = tape();
    const f = fastStochastic(t, 14, 3);
    const rk = refK(t, 14);
    const rd = refSMA3(rk);
    f.k.forEach((v, i) => assert.ok(v == null ? rk[i] == null : close(v, rk[i]!), `k ${i}`));
    f.d.forEach((v, i) => assert.ok(v == null ? rd[i] == null : close(v, rd[i]!), `d ${i}`));
  });
  it("slow %K equals fast %D (StockCharts), and slow %D = SMA(3) of slow %K", () => {
    const t = tape();
    const f = fastStochastic(t);
    const s = slowStochastic(t);
    assert.deepEqual(s.k, f.d);
    const rd = refSMA3(s.k);
    s.d.forEach((v, i) => assert.ok(v == null ? rd[i] == null : close(v, rd[i]!), `slow d ${i}`));
  });
  it("stays inside 0–100; a flat window reads 50", () => {
    for (const v of rawStochastic(tape(), 14)) if (v != null) assert.ok(v >= 0 && v <= 100);
    assert.equal(rawStochastic([bar(5, 5, 5), bar(5, 5, 5)], 2)[1], 50);
  });
  it("the fast pair crosses more often than the slow pair on a choppy tape", () => {
    const t = tape();
    const f = fastStochastic(t);
    const s = slowStochastic(t);
    assert.ok(lineCrosses(f.k, f.d).length > lineCrosses(s.k, s.d).length);
  });
});

describe("KDJ (9, 3, 3)", () => {
  it("worked step: previous K 40, RSV 70 → K 50; previous D 45, K 50 → D 46.67; J 56.67", () => {
    const K = kdjStep(40, 70);
    const D = kdjStep(45, K);
    assert.ok(close(K, 50));
    assert.ok(close(D, 140 / 3));
    assert.ok(close(3 * K - 2 * D, 170 / 3));
  });
  it("matches the reference; K and D start from 50; J = 3K − 2D everywhere", () => {
    const t = tape();
    const x = kdj(t);
    const r = refKDJ(t, 9);
    const first = x.k.findIndex((v) => v != null);
    assert.equal(first, 8);
    assert.ok(close(x.k[first]!, 50 * (2 / 3) + rawStochastic(t, 9)[first]! / 3));
    x.k.forEach((v, i) => {
      if (v == null) return assert.equal(r[i], null);
      assert.ok(close(v, r[i]!.K) && close(x.d[i]!, r[i]!.D) && close(x.j[i]!, r[i]!.J), `i=${i}`);
      assert.ok(close(x.j[i]!, 3 * v - 2 * x.d[i]!));
    });
  });
  it("K and D stay inside 0–100 but J can leave it", () => {
    const x = kdj(tape());
    for (let i = 0; i < x.k.length; i++) if (x.k[i] != null) assert.ok(x.k[i]! >= 0 && x.k[i]! <= 100 && x.d[i]! >= 0 && x.d[i]! <= 100);
    assert.ok(x.j.some((v) => v != null && (v > 100 || v < 0)));
  });
});

describe("volatility stop (ATR 20 × 2)", () => {
  const t = tape();
  const v = volatilityStop(t, 20, 2);
  it("matches the Pine-shaped reference bar for bar", () => {
    const r = refVStop(t, 20, 2);
    v.stop.forEach((s, i) => {
      if (s == null) return assert.equal(r[i], null);
      assert.ok(close(s, r[i]!.stop), `stop ${i}`);
      assert.equal(v.up[i], r[i]!.up, `trend ${i}`);
    });
  });
  it("starts with ATR, sits under the close in an uptrend and over it in a downtrend", () => {
    assert.equal(v.stop.findIndex((s) => s != null), 19);
    v.stop.forEach((s, i) => {
      if (s == null) return;
      if (v.up[i]) assert.ok(s <= t[i]!.close + 1e-9, `up ${i}`);
      else assert.ok(s >= t[i]!.close - 1e-9, `down ${i}`);
    });
  });
  it("never moves against the trend between flips, and flips exactly when the trend changes", () => {
    for (let i = 1; i < t.length; i++) {
      const a = v.stop[i - 1], b = v.stop[i];
      if (a == null || b == null) continue;
      const flipped = v.up[i] !== v.up[i - 1];
      assert.equal(v.flips.includes(i), flipped, `flip ${i}`);
      if (!flipped) assert.ok(v.up[i] ? b >= a - 1e-9 : b <= a + 1e-9, `ratchet ${i}`);
    }
    assert.ok(v.flips.length >= 1);
  });
  it("in an uptrend the stop is max(previous stop, highest close since the flip − ATR × 2)", () => {
    const a = atr(t, 20);
    let peak = -Infinity;
    for (let i = 20; i < t.length; i++) {
      if (v.flips.includes(i)) { peak = t[i]!.close; continue; }
      peak = Math.max(peak === -Infinity ? t[19]!.close : peak, t[i]!.close);
      if (v.up[i] && v.up[i - 1]) assert.ok(close(v.stop[i]!, Math.max(v.stop[i - 1]!, peak - 2 * a[i]!)), `i=${i}`);
      if (!v.up[i]) peak = -Infinity;
    }
  });
});

describe("helpers", () => {
  it("correlation: +1, −1 and 0 cases", () => {
    assert.ok(close(correlation([1, 2, 3], [2, 4, 6]), 1));
    assert.ok(close(correlation([1, 2, 3], [3, 2, 1]), -1));
    assert.equal(correlation([1, 1, 1], [1, 2, 3]), 0);
  });
  it("lineCrosses finds up and down crosses", () => {
    assert.deepEqual(lineCrosses([1, 3, 1], [2, 2, 2]), [{ index: 1, dir: "up" }, { index: 2, dir: "down" }]);
  });
});
