import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  BARS_PER_DAY, BUDGET, CALL_STRIKE, ENTRY_BAR, EXIT_BAR, MINUTES_PER_YEAR, SQZ_BARS, SQZ_DECISIONS, SQZ_TERMS, SQZ_TLDR, STALL_BARS,
  STALL_EXPIRY_PRICE, STEP_POINTS, callDelta, callGamma, callValue, gradeRun, hedgeShares, optionPath, round2, squeezeQuestions, sqzTrade,
  survivorStats, yearsToExpiry, barClock, closeClock, callVolumeMultiple,
} from "./gammaSqueeze.ts";

/** Independent Black-Scholes using a series erf, to recompute the option path. */
function erf(x: number): number {
  let sum = 0, term = x;
  for (let n = 0; n < 80; n++) {
    sum += term / (2 * n + 1);
    term *= (-x * x) / (n + 1);
  }
  return (2 / Math.sqrt(Math.PI)) * sum;
}
const N = (x: number) => 0.5 * (1 + erf(x / Math.SQRT2));
function bs(S: number, K: number, T: number, v: number) {
  if (T <= 0) return Math.max(S - K, 0);
  const d1 = (Math.log(S / K) + (v * v * T) / 2) / (v * Math.sqrt(T));
  return S * N(d1) - K * N(d1 - v * Math.sqrt(T));
}

describe("gamma squeeze case (SIMULATED)", () => {
  it("bars are valid 5-minute OHLC for one session, and the stall path shares the morning", () => {
    for (const bars of [SQZ_BARS, STALL_BARS]) {
      assert.equal(bars.length, BARS_PER_DAY);
      bars.forEach((b, i) => {
        assert.ok(b.high >= Math.max(b.open, b.close) && b.low <= Math.min(b.open, b.close), `bar ${i}`);
        assert.ok(b.callVolume > 0 && (b.volume ?? 0) > 0);
        if (i > 0) assert.equal(b.open, round2(bars[i - 1]!.close), `open ${i}`);
      });
    }
    for (let i = 0; i <= ENTRY_BAR; i++) assert.deepEqual(STALL_BARS[i], SQZ_BARS[i]);
    assert.deepEqual(barClock(0), { et: "9:30 AM ET", pt: "6:30 AM PT" });
    assert.deepEqual(closeClock(ENTRY_BAR), { et: "10:35 AM ET", pt: "7:35 AM PT" });
    assert.deepEqual(closeClock(EXIT_BAR), { et: "1:00 PM ET", pt: "10:00 AM PT" });
    for (const d of SQZ_DECISIONS) if (d.id !== "size") assert.ok(d.prompt.startsWith(`${closeClock(d.bar).et} (${closeClock(d.bar).pt})`), d.id);
  });

  it("the option path recomputes with an independent Black-Scholes", () => {
    const path = optionPath(SQZ_BARS);
    SQZ_BARS.forEach((b, i) => {
      const T = ((BARS_PER_DAY - 1 - i) * 5 + 390) / MINUTES_PER_YEAR;
      assert.ok(Math.abs(path[i]! - bs(b.close, CALL_STRIKE, T, b.vol)) < 1e-4, `bar ${i}`);
    });
    assert.equal(yearsToExpiry(BARS_PER_DAY - 1, 1), 0);
    assert.equal(callValue(25, 24, 0, 1), 1);
  });

  it("the trade: $200 of weekly 24 calls turns into about $5,000 by the afternoon; the stall leaves near zero", () => {
    const t = sqzTrade();
    assert.equal(t.entryPremium, round2(bs(SQZ_BARS[ENTRY_BAR]!.close, CALL_STRIKE, yearsToExpiry(ENTRY_BAR), SQZ_BARS[ENTRY_BAR]!.vol)));
    assert.ok(t.cost <= BUDGET && t.cost > BUDGET * 0.9);
    assert.equal(t.exitValue, round2(t.contracts * t.exitPremium * 100));
    assert.ok(t.exitValue > 4500 && t.exitValue < 5600, `${t.exitValue}`);
    assert.ok(SQZ_BARS[ENTRY_BAR]!.close < CALL_STRIKE && SQZ_BARS[EXIT_BAR]!.close > CALL_STRIKE, "OTM at entry, ITM at exit");
    assert.ok(t.stallExitPremium <= 0.05 && t.stallThursdayValue < 10);
    assert.ok(STALL_EXPIRY_PRICE < CALL_STRIKE);
    assert.equal(t.stallExpiryValue, 0);
  });

  it("gamma peaks near the strike and close to expiry; hedge shares rise with the stock", () => {
    const v = 1;
    const T1 = yearsToExpiry(40), T5 = 5 * 390 / MINUTES_PER_YEAR;
    assert.ok(callGamma(24, 24, T1, v) > callGamma(20, 24, T1, v));
    assert.ok(callGamma(24, 24, T1, v) > callGamma(24, 24, T5, v));
    assert.ok(callDelta(25.4, 24, T1, v) > callDelta(21.4, 24, T1, v));
    assert.ok(hedgeShares(EXIT_BAR) > hedgeShares(ENTRY_BAR) * 3);
    assert.ok(callVolumeMultiple(ENTRY_BAR) >= 8, "unusual call volume at entry");
  });

  it("grading: three correct steps earn full points; the survivorship set loses money overall", () => {
    const best = Object.fromEntries(SQZ_DECISIONS.map((d) => [d.id, d.choices.find((c) => c.grade === "correct")!.id]));
    const r = gradeRun(best);
    assert.equal(r.grade, "correct");
    assert.equal(r.points, SQZ_DECISIONS.length * STEP_POINTS.correct);
    assert.equal(gradeRun({ enter: "chase", size: "all", exit: "hold" }).grade, "incorrect");
    assert.equal(gradeRun({ enter: "pass", size: "all", exit: "hold" }).grade, "partial");
    for (const d of SQZ_DECISIONS) assert.ok(d.choices.some((c) => c.grade === "correct"), d.id);
    const s = survivorStats();
    assert.ok(s.net < 0 && s.bigWins >= 1 && s.losers > 80);
  });

  it("copy, terms and questions stay accurate and anonymous", () => {
    assert.match(SQZ_TLDR, /not always net short/);
    assert.match(SQZ_TLDR, /highest close to expiry/);
    const ids = SQZ_TERMS.map((t) => t.id);
    for (const id of ["gamma", "delta-hedging", "gamma-squeeze", "short-interest", "days-to-cover", "open-interest", "unusual-options-activity"]) assert.ok(ids.includes(id), id);
    const qs = squeezeQuestions();
    assert.ok(qs.length >= 10);
    assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
    for (const q of qs) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
    const all = JSON.stringify([SQZ_TERMS, qs, SQZ_DECISIONS, SQZ_TLDR]);
    assert.doesNotMatch(all, /corrected|actually|myth|contrary to/i);
  });
});
