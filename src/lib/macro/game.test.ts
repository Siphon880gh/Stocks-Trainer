import { test } from "node:test";
import assert from "node:assert/strict";
import { MACRO_ROUNDS, answerKey, explainRound, scoreRound, whyNot } from "./game";
import { reactionForEvent } from "./reactions";
import { getRelease } from "./releases";
import { formatMetricValue } from "./display";
import type { Direction } from "./types";

test("≥ 24 rounds, ids unique, 2–4 instruments, events resolve", () => {
  assert.ok(MACRO_ROUNDS.length >= 24);
  assert.equal(new Set(MACRO_ROUNDS.map((r) => r.id)).size, MACRO_ROUNDS.length);
  for (const r of MACRO_ROUNDS) {
    assert.ok(getRelease(r.eventId), r.id);
    assert.ok(r.instruments.length >= 2 && r.instruments.length <= 4, r.id);
  }
});

test("coverage: ≥ 6 regimes, ≥ 4 muted/mixed, ≥ 4 reversals, balanced keys", () => {
  const evs = MACRO_ROUNDS.map((r) => getRelease(r.eventId)!);
  assert.ok(new Set(evs.map((e) => e.regime)).size >= 6);
  const rx = evs.map((e) => reactionForEvent(e));
  assert.ok(rx.filter((x) => x.moves.index === "muted" || x.archetype === "whipsaw").length >= 4);
  assert.ok(rx.filter((x) => x.archetype === "reversal").length >= 4);
  const all: Direction[] = MACRO_ROUNDS.flatMap((r) => Object.values(answerKey(r)));
  for (const d of ["up", "down", "muted"] as const) assert.ok(all.filter((x) => x === d).length / all.length <= 0.5, `${d} share`);
});

test("explanations cite a number present in the round; why-not for every wrong choice", () => {
  for (const r of MACRO_ROUNDS) {
    const e = getRelease(r.eventId)!;
    const ex = explainRound(r);
    assert.ok(ex.lead.includes(formatMetricValue(e.headline, e.headline.actual)), r.id);
    for (const i of r.instruments) {
      assert.ok(ex.perInstrument[i]!.length > 20);
      const key = answerKey(r)[i];
      for (const c of ["up", "down", "muted"] as const) assert.equal(Boolean(whyNot(r, i, c)), c !== key, `${r.id} ${i} ${c}`);
    }
    const perfect = scoreRound(r, answerKey(r));
    assert.equal(perfect.correct, perfect.total);
  }
});
