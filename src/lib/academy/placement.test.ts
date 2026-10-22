import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { PLACEMENT_ITEMS, PLACEMENT_LEVELS, passNeeded, routePlacement, skipPlacement } from "./placement";
import { getUnit } from "./content/levels";
import { ACADEMY_KEY, emptyAcademy, memoryStorage, saveAcademy } from "./storage";
import type { AnswerLetter } from "./types";

const wrong = (c: AnswerLetter): AnswerLetter => (c === "A" ? "B" : "A");
const answersFor = (mask: number) => Object.fromEntries(PLACEMENT_ITEMS.map((q, i) => [q.id, mask & (1 << i) ? q.correctAnswer : wrong(q.correctAnswer)]));
const rank = (l: string) => PLACEMENT_LEVELS.indexOf(l as never);

test("12 items, L0–L4, ids stable, each tagged with a real unit of its level, answer letters spread", () => {
  assert.equal(PLACEMENT_ITEMS.length, 12);
  for (const q of PLACEMENT_ITEMS) {
    assert.match(q.id, /^BA-PLC-\d{2}$/);
    assert.equal(getUnit(q.unitId)?.levelId, q.levelId, q.id);
    assert.equal(q.options.length, 4);
    assert.ok(q.options.some((o) => o.id === q.correctAnswer));
  }
  assert.equal(new Set(PLACEMENT_ITEMS.map((q) => q.correctAnswer)).size, 4);
  assert.equal(passNeeded(3), 2);
  assert.equal(passNeeded(2), 2);
});

test("exhaustive 2^12 answer patterns: monotone (more correct never routes lower), ≥ 4 distinct starts, never past L4", () => {
  const starts = new Set<string>();
  const start: string[] = [];
  for (let m = 0; m < 1 << 12; m++) {
    const r = routePlacement(answersFor(m));
    start[m] = r.startLevel;
    starts.add(r.startLevel);
    assert.ok(rank(r.startLevel) >= 0 && rank(r.startLevel) <= 4);
  }
  for (let m = 0; m < 1 << 12; m++) for (let b = 0; b < 12; b++) if (!(m & (1 << b))) assert.ok(rank(start[m | (1 << b)]!) >= rank(start[m]!), `mask ${m} +bit ${b}`);
  assert.ok(starts.size >= 4);
});

test("extremes: all wrong → L0, all right → L4, skip → L0 (skipped), review lists missed credited units", () => {
  assert.equal(routePlacement(answersFor(0)).startLevel, "L0");
  const all = routePlacement(answersFor((1 << 12) - 1));
  assert.equal(all.startLevel, "L4");
  assert.equal(all.correct, 12);
  assert.deepEqual(all.review, []);
  const s = skipPlacement();
  assert.equal(s.startLevel, "L0");
  assert.equal(s.skipped, true);
  // all right except item 2 (L0, still passes? 1/2 < 2 needed) → start L0
  const miss2 = routePlacement({ ...answersFor((1 << 12) - 1), "BA-PLC-02": "D" === PLACEMENT_ITEMS[1]!.correctAnswer ? "A" : "D" });
  assert.equal(miss2.startLevel, "L0");
  // all right except one L2 item → L2 passes (2/3), start L4, that unit is listed for review
  const miss6 = routePlacement({ ...answersFor((1 << 12) - 1), "BA-PLC-06": wrong(PLACEMENT_ITEMS[5]!.correctAnswer) });
  assert.equal(miss6.startLevel, "L4");
  assert.deepEqual(miss6.review, ["l2-trend-vs-range"]);
});

test("placement never touches the existing progress or path selection (academy key only)", () => {
  const store = memoryStorage({ analysis_core_progress_v1: '{"pathId":"x"}' });
  saveAcademy({ ...emptyAcademy(), placement: { startLevel: "L2", correct: 7, total: 12, skipped: false, at: "2026-10-21T00:00:00Z" } }, store);
  assert.deepEqual(store.writes, [ACADEMY_KEY]);
  assert.equal(store.data.get("analysis_core_progress_v1"), '{"pathId":"x"}');
  for (const f of ["./placement.ts", "../../components/academy/PlacementCard.tsx"]) {
    const src = readFileSync(new URL(f, import.meta.url), "utf8");
    assert.doesNotMatch(src, /progressStore|confirmPathSelection|analysis_core_progress_v1/, f);
  }
});
