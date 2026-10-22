import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { CHECK_PASS, OPTIONS_CHECKS, checksForLevel, gradeChecks, metricValue } from "./checks";
import { LADDER, MAX_ATTEMPTS, WINDOW_MS, acknowledge, canAttempt, isOptionsLevelUnlocked, recordOptionsAttempt } from "./gate";
import { getStrategy } from "./ladder";
import { summarize } from "./payoff";
import { emptyAcademy } from "../storage";
import { bannedIn } from "../content/banned";
import type { AnswerLetter } from "../types";

const T0 = new Date("2026-10-21T12:00:00Z");
const at = (ms: number) => new Date(T0.getTime() + ms);
const fresh = () => emptyAcademy().options;

test("≥ 8 items per level, stable unique ids, 4 options, letters spread, no banned wording", () => {
  for (const l of LADDER) {
    const items = checksForLevel(l);
    assert.ok(items.length >= 8, `L${l}`);
    assert.ok(new Set(items.map((q) => q.correctAnswer)).size >= 3, `L${l} letter spread`);
    for (const q of items) {
      assert.match(q.id, new RegExp(`^BA-OPT-L${l}-\\d{2}$`));
      assert.equal(q.options.length, 4);
      assert.equal(new Set(q.options.map((o) => o.label)).size, 4, `${q.id} distinct options`);
      assert.deepEqual(bannedIn(`${q.prompt} ${q.options.map((o) => o.label).join(" ")} ${q.explanation}`), [], q.id);
    }
  }
  assert.equal(new Set(OPTIONS_CHECKS.map((q) => q.id)).size, OPTIONS_CHECKS.length);
});

test("numeric answers are recomputed independently from the payoff math", () => {
  const usd = (x: number) => `$${x.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const numeric = OPTIONS_CHECKS.filter((q) => q.numeric);
  assert.ok(numeric.length >= 12);
  for (const q of numeric) {
    const s = summarize(getStrategy(q.numeric!.strategyId)!);
    const want = { maxGain: s.maxGain, maxLoss: s.maxLoss, breakeven: s.breakevens[0]!, breakevenHigh: s.breakevens.at(-1)!, maxGainContract: s.perContract.maxGain, maxLossContract: s.perContract.maxLoss }[q.numeric!.metric];
    assert.equal(metricValue(q.numeric!.strategyId, q.numeric!.metric), want);
    const right = q.options.find((o) => o.id === q.correctAnswer)!.label;
    assert.equal(right, usd(want), q.id);
    for (const o of q.options) if (o.id !== q.correctAnswer) assert.notEqual(o.label, right, q.id);
  }
});

test("grading: 80% pass (7/8 passes, 6/8 fails)", () => {
  assert.equal(CHECK_PASS, 0.8);
  const items = checksForLevel(1);
  const all = Object.fromEntries(items.map((q) => [q.id, q.correctAnswer]));
  const miss = (n: number) => ({ ...all, ...Object.fromEntries(items.slice(0, n).map((q) => [q.id, (q.correctAnswer === "A" ? "B" : "A") as AnswerLetter])) });
  assert.equal(gradeChecks(1, miss(1)).passed, true);
  assert.equal(gradeChecks(1, miss(2)).passed, false);
});

test("ordering: L1 open, L(n) needs L(n−1) passed; acknowledgement required before each check", () => {
  let r = fresh();
  assert.equal(isOptionsLevelUnlocked(r, 1), true);
  assert.equal(isOptionsLevelUnlocked(r, 2), false);
  assert.equal(canAttempt(r, 1, T0).reason, "not-acknowledged");
  assert.equal(canAttempt(r, 2, T0).reason, "locked");
  r = acknowledge(r, 1, T0);
  assert.equal(canAttempt(r, 1, T0).ok, true);
  r = recordOptionsAttempt(r, 1, true, T0);
  assert.equal(isOptionsLevelUnlocked(r, 2), true);
  assert.equal(canAttempt(r, 1, T0).reason, "already-passed");
  assert.equal(canAttempt(r, 2, T0).reason, "not-acknowledged", "each level needs its own acknowledgement");
  assert.equal(isOptionsLevelUnlocked(r, 3), false);
});

test("3 attempts per rolling 24 h: edges at exactly 24 h", () => {
  let r = acknowledge(fresh(), 1, T0);
  for (let i = 0; i < MAX_ATTEMPTS; i++) r = recordOptionsAttempt(r, 1, false, at(i * 60_000));
  const blocked = canAttempt(r, 1, at(3 * 60_000));
  assert.equal(blocked.ok, false);
  assert.equal(blocked.reason, "too-many-attempts");
  assert.equal(blocked.nextAt, at(WINDOW_MS).toISOString());
  assert.equal(recordOptionsAttempt(r, 1, true, at(5 * 60_000)), r, "a blocked attempt changes nothing");
  assert.equal(canAttempt(r, 1, at(WINDOW_MS - 1)).ok, false, "1 ms before the window ends: still blocked");
  assert.equal(canAttempt(r, 1, at(WINDOW_MS)).ok, true, "exactly 24 h after the oldest: one attempt frees up");
  assert.equal(canAttempt(r, 1, at(WINDOW_MS)).remaining, 1);
  assert.equal(canAttempt(r, 1, at(WINDOW_MS + 2 * 60_000)).remaining, 3);
});

test("no Greeks, chain or volatility-surface wording in any academy options file", () => {
  const roots = ["src/lib/academy/options", "src/components/academy/options"];
  const files: string[] = [];
  for (const r of roots) {
    try {
      for (const f of readdirSync(r)) if (/\.(ts|tsx)$/.test(f) && !f.endsWith(".test.ts")) files.push(`${r}/${f}`);
    } catch {
      /* folder may not exist yet */
    }
  }
  for (const f of ["src/pages/academy/OptionsLadder.tsx"]) {
    try {
      readFileSync(f);
      files.push(f);
    } catch {
      /* page may not exist yet */
    }
  }
  assert.ok(files.length >= 4);
  for (const f of files) assert.doesNotMatch(readFileSync(f, "utf8"), /\b(delta|gamma|theta|vega)\b|implied volatility surface|option chain/i, f);
});
