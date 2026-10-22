import { sma, ema, rsi, macd, bollingerBands } from "./indicators";
export interface Bar { name: string; open: number; high: number; low: number; close: number; volume?: number }
export interface Trade { entryIndex: number; exitIndex: number; entry: number; exit: number; pnl: number }
export interface RunResult { trades: Trade[]; total: number; signals: number[] }

const r2 = (v: number) => Math.round(v * 100) / 100;
/** Deterministic wiggle so SIMULATED paths look like markets but stay reproducible. */
export function wiggle(i: number, amp: number, phase = 0): number {
  return amp * (Math.sin(i * 1.7 + phase) * 0.6 + Math.sin(i * 0.63 + phase * 2) * 0.4);
}
/** Piecewise-linear closes through (bar, price) knots plus wiggle. */
export function closesFromKnots(knots: Array<[number, number]>, amp: number, phase = 0): number[] {
  const out: number[] = [];
  for (let k = 0; k < knots.length - 1; k++) {
    const [i0, p0] = knots[k]!; const [i1, p1] = knots[k + 1]!;
    for (let i = i0; i < i1; i++) out.push(p0 + ((p1 - p0) * (i - i0)) / (i1 - i0));
  }
  out.push(knots[knots.length - 1]![1]);
  return out.map((c, i) => r2(c + wiggle(i, amp, phase)));
}
export function barsFromCloses(closes: number[], opts: { wick?: number; volume?: (i: number) => number; label?: (i: number) => string; start?: number } = {}): Bar[] {
  const wick = opts.wick ?? 0.4;
  return closes.map((c, i) => {
    const o = i === 0 ? (opts.start ?? c) : closes[i - 1]!;
    const w = wick * (0.6 + 0.4 * Math.abs(Math.sin(i * 2.3)));
    return {
      name: opts.label ? opts.label(i) : `B${i + 1}`,
      open: r2(o), close: r2(c),
      high: r2(Math.max(o, c) + w), low: r2(Math.min(o, c) - w),
      ...(opts.volume ? { volume: Math.round(opts.volume(i)) } : {}),
    };
  });
}
const closeOf = (b: Bar[]) => b.map((x) => x.close);
function sum(trades: Trade[]): number { return r2(trades.reduce((a, t) => a + t.pnl, 0)); }
function tr(entryIndex: number, exitIndex: number, entry: number, exit: number): Trade {
  return { entryIndex, exitIndex, entry: r2(entry), exit: r2(exit), pnl: r2(exit - entry) };
}

/* 1. RSI mean reversion: buy when RSI(14) < 30, sell when RSI > 70 or at the last bar. */
export const RSI_RULE = { period: 14, buyBelow: 30, sellAbove: 70 };
export function runRsi(bars: Bar[]): RunResult {
  const c = closeOf(bars); const r = rsi(c, RSI_RULE.period);
  const trades: Trade[] = []; const signals: number[] = []; let open: number | null = null;
  for (let i = 0; i < c.length; i++) {
    const v = r[i]; if (v == null) continue;
    if (open == null && v < RSI_RULE.buyBelow) { open = i; signals.push(i); }
    else if (open != null && v > RSI_RULE.sellAbove) { trades.push(tr(open, i, c[open]!, c[i]!)); open = null; }
  }
  if (open != null) trades.push(tr(open, c.length - 1, c[open]!, c[c.length - 1]!));
  return { trades, total: sum(trades), signals };
}

/* 2. Moving-average crossover: long while SMA(10) > SMA(30); enter on cross up, exit on cross down or last bar. */
export const MA_RULE = { fast: 10, slow: 30 };
export function runMa(bars: Bar[]): RunResult {
  const c = closeOf(bars); const f = sma(c, MA_RULE.fast); const s = sma(c, MA_RULE.slow);
  const trades: Trade[] = []; const signals: number[] = []; let open: number | null = null;
  for (let i = 1; i < c.length; i++) {
    if (f[i] == null || s[i] == null || f[i - 1] == null || s[i - 1] == null) continue;
    const up = f[i]! > s[i]!, wasUp = f[i - 1]! > s[i - 1]!;
    if (open == null && up && !wasUp) { open = i; signals.push(i); }
    else if (open != null && !up && wasUp) { trades.push(tr(open, i, c[open]!, c[i]!)); open = null; }
  }
  if (open != null) trades.push(tr(open, c.length - 1, c[open]!, c[c.length - 1]!));
  return { trades, total: sum(trades), signals };
}

/* 3. Volume breakout: buy the first close above the pivot on volume >= 1.5x the 20-bar average; stop = handle low, target = pivot + cup depth. */
export const BREAKOUT_RULE = { volMult: 1.5, avgBars: 20 };
export function runBreakout(bars: Bar[], pivot: number, handleLow: number, cupDepth: number, fromIndex: number): RunResult {
  const trades: Trade[] = []; const signals: number[] = [];
  for (let i = Math.max(fromIndex, BREAKOUT_RULE.avgBars); i < bars.length; i++) {
    const avg = bars.slice(i - BREAKOUT_RULE.avgBars, i).reduce((a, b) => a + (b.volume ?? 0), 0) / BREAKOUT_RULE.avgBars;
    if (bars[i]!.close > pivot && (bars[i]!.volume ?? 0) >= BREAKOUT_RULE.volMult * avg) {
      signals.push(i);
      const entry = bars[i]!.close; const target = pivot + cupDepth;
      for (let j = i + 1; j < bars.length; j++) {
        if (bars[j]!.low <= handleLow) { trades.push(tr(i, j, entry, handleLow)); break; }
        if (bars[j]!.high >= target) { trades.push(tr(i, j, entry, target)); break; }
        if (j === bars.length - 1) trades.push(tr(i, j, entry, bars[j]!.close));
      }
      break;
    }
  }
  return { trades, total: sum(trades), signals };
}

/* 4. VWAP pullback: session VWAP from typical price x volume. Buy a bar whose low tags VWAP and closes above it; exit on a close below VWAP or the last bar. */
export function vwap(bars: Bar[]): number[] {
  let pv = 0, v = 0;
  return bars.map((b) => { const vol = b.volume ?? 1; pv += ((b.high + b.low + b.close) / 3) * vol; v += vol; return r2(pv / v); });
}
export function runVwap(bars: Bar[], fromIndex = 6): RunResult {
  const vw = vwap(bars); const trades: Trade[] = []; const signals: number[] = []; let open: number | null = null;
  for (let i = fromIndex; i < bars.length; i++) {
    const b = bars[i]!;
    if (open == null && b.low <= vw[i]! && b.close > vw[i]!) { open = i; signals.push(i); }
    else if (open != null && b.close < vw[i]!) { trades.push(tr(open, i, bars[open]!.close, b.close)); open = null; }
  }
  if (open != null) trades.push(tr(open, bars.length - 1, bars[open]!.close, bars[bars.length - 1]!.close));
  return { trades, total: sum(trades), signals };
}

/* 5. MACD bullish divergence: a lower price low with a higher MACD low; buy the first up-close after it with MACD above its signal; stop below the second low; exit at the last bar. */
export const MACD_RULE = { fast: 12, slow: 26, signal: 9, swing: 3 };
export function swingLows(c: number[], w = MACD_RULE.swing): number[] {
  const out: number[] = [];
  for (let i = w; i < c.length - w; i++) {
    let ok = true; for (let k = 1; k <= w; k++) if (!(c[i]! < c[i - k]! && c[i]! <= c[i + k]!)) { ok = false; break; }
    if (ok) out.push(i);
  }
  return out;
}
export function runMacdDiv(bars: Bar[]): RunResult & { lows: [number, number] | null } {
  const c = closeOf(bars); const m = macd(c, MACD_RULE.fast, MACD_RULE.slow, MACD_RULE.signal);
  const lows = swingLows(c).filter((i) => m.macd[i] != null);
  const trades: Trade[] = []; const signals: number[] = [];
  for (let k = 1; k < lows.length; k++) {
    const a = lows[k - 1]!, b = lows[k]!;
    if (c[b]! < c[a]! && m.macd[b]! > m.macd[a]!) {
      for (let i = b + 1; i < c.length; i++) {
        if (m.signal[i] == null) continue;
        if (m.macd[i]! > m.signal[i]! && c[i]! > c[i - 1]!) {
          signals.push(i); const stop = bars[b]!.low - 0.5;
          for (let j = i + 1; j < c.length; j++) {
            if (bars[j]!.low <= stop) { trades.push(tr(i, j, c[i]!, stop)); break; }
            if (j === c.length - 1) trades.push(tr(i, j, c[i]!, c[j]!));
          }
          return { trades, total: sum(trades), signals, lows: [a, b] };
        }
      }
    }
  }
  return { trades, total: sum(trades), signals, lows: null };
}

/* 6. Bollinger squeeze: bandwidth below 35% of its prior-30-bar high marks a squeeze; buy the next close above the upper band; exit on a close below the middle band or the last bar. */
export const BB_RULE = { period: 20, k: 2, lookback: 30, squeezeRatio: 0.35 };
export function bandwidth(c: number[]): (number | null)[] {
  const bb = bollingerBands(c, BB_RULE.period, BB_RULE.k);
  return c.map((_, i) => (bb.middle[i] == null ? null : (bb.upper[i]! - bb.lower[i]!) / bb.middle[i]!));
}
export function runSqueeze(bars: Bar[]): RunResult & { squeezeAt: number | null } {
  const c = closeOf(bars); const bb = bollingerBands(c, BB_RULE.period, BB_RULE.k); const bw = bandwidth(c);
  let squeezeAt: number | null = null; const trades: Trade[] = []; const signals: number[] = [];
  for (let i = BB_RULE.period + 5; i < c.length; i++) {
    const win = bw.slice(Math.max(0, i - BB_RULE.lookback), i).filter((x): x is number => x != null);
    if (squeezeAt == null && win.length >= 10 && bw[i]! <= BB_RULE.squeezeRatio * Math.max(...win)) squeezeAt = i;
    if (squeezeAt != null && i > squeezeAt && c[i]! > bb.upper[i]!) {
      signals.push(i);
      for (let j = i + 1; j < c.length; j++) {
        if (c[j]! < bb.middle[j]!) { trades.push(tr(i, j, c[i]!, c[j]!)); break; }
        if (j === c.length - 1) trades.push(tr(i, j, c[i]!, c[j]!));
      }
      break;
    }
  }
  return { trades, total: sum(trades), signals, squeezeAt };
}
export { sma, ema, rsi, macd, bollingerBands };
