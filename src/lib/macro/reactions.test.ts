import { test } from "node:test";
import assert from "node:assert/strict";
import { INSTRUMENTS, KIND_CLASS, REGIME_NAMES, reactionFor, reactionForEvent, rulesMatrix } from "./reactions";
import { RELEASES } from "./releases";
import type { Regime, ReleaseKind, SurpriseLabel } from "./types";

const regimes = Object.keys(REGIME_NAMES) as Regime[];
const kinds = Object.keys(KIND_CLASS) as ReleaseKind[];
const labels: SurpriseLabel[] = ["hot", "cool", "in-line"];

test("every rule: bond proxy opposite to the 10y, rationale for every instrument, yields/dollar agree", () => {
  for (const k of kinds) for (const l of labels) for (const r of regimes) {
    const x = reactionFor(k, l, r);
    const opp = { up: "down", down: "up", muted: "muted" } as const;
    assert.equal(x.moves["bond-proxy"], k === "pmms" ? "muted" : opp[x.moves.us10y], `${k} ${l} ${r}`);
    for (const i of INSTRUMENTS) assert.ok(x.rationale[i] && x.rationale[i].length > 20, `${k} ${l} ${r} ${i}`);
    assert.equal(x.moves.dollar, x.moves.us2y, `${k} ${l} ${r}`);
    assert.ok(x.summary.length > 20);
    if (l === "in-line" && k !== "pmms") assert.ok(INSTRUMENTS.every((i) => x.moves[i] === "muted"));
  }
});

test("regime dependence: the same hot jobs print moves stocks opposite ways", () => {
  assert.equal(reactionFor("payrolls", "hot", "inflation-worry").moves.index, "down");
  assert.equal(reactionFor("payrolls", "cool", "fed-pivot-watch").moves.index, "up");
  assert.equal(reactionFor("payrolls", "hot", "growth-scare").moves.index, "up");
  assert.equal(reactionFor("payrolls", "cool", "recession-fear").moves.index, "down");
  assert.equal(reactionFor("cpi", "hot", "growth-scare").moves.index, "down");
  assert.equal(reactionFor("payrolls", "cool", "recession-fear").moves.utilities, "up");
  for (const r of regimes) assert.equal(reactionFor("pmms", "hot", r, { mortgageChange: "up" }).moves.index, "muted");
});

test("events: storyline reactions, archetypes and magnitudes", () => {
  const byId = Object.fromEntries(RELEASES.map((e) => [e.id, reactionForEvent(e)]));
  assert.equal(byId["fomc-42"]!.archetype, "reversal");
  assert.equal(byId["fomc-42"]!.moves.index, "down");
  assert.equal(byId["fomc-42"]!.initialIndex, "up");
  const reversals = RELEASES.filter((e) => byId[e.id]!.archetype === "reversal");
  assert.ok(reversals.length >= 4, reversals.map((e) => e.id).join(","));
  const muted = RELEASES.filter((e) => byId[e.id]!.moves.index === "muted");
  assert.ok(muted.length >= 4, `${muted.length}`);
  for (const e of RELEASES) {
    const x = byId[e.id]!;
    assert.ok(x.magnitude > 0 && x.magnitude <= 3, e.id);
    if (x.archetype === "reversal") assert.ok(x.initialIndex && x.initialIndex !== x.moves.index, e.id);
  }
  const m = rulesMatrix();
  assert.equal(m.length, 6);
  assert.ok(m.every((r) => r.cells.length === 6));
});
