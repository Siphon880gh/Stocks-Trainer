import { test } from "node:test";
import assert from "node:assert/strict";
import { LEVELS, UNITS, UNIT_ORDER } from "./levels";
import { LEVEL_IDS } from "../types";

test("8 levels in order with unique kebab-case course ids and at least one course each", () => {
  assert.deepEqual(LEVELS.map((l) => l.id), [...LEVEL_IDS]);
  const courseIds = LEVELS.flatMap((l) => l.courses.map((c) => c.id));
  assert.equal(new Set(courseIds).size, courseIds.length);
  for (const l of LEVELS) {
    assert.ok(l.courses.length >= 1, l.id);
    for (const c of l.courses) {
      assert.match(c.id, /^[a-z0-9]+(-[a-z0-9]+)*$/);
      assert.equal(c.levelId, l.id);
      assert.ok(c.unitIds.length >= 1, c.id);
    }
  }
});

test("unit ids are unique kebab-case and every unit sits in exactly one course", () => {
  const ids = UNITS.map((u) => u.id);
  assert.equal(new Set(ids).size, ids.length);
  for (const id of ids) assert.match(id, /^l[0-7]-[a-z0-9]+(-[a-z0-9]+)*$/);
  assert.deepEqual([...UNIT_ORDER].sort(), [...ids].sort());
  for (const u of UNITS) assert.ok(u.id.startsWith(u.levelId.toLowerCase() + "-"), u.id);
});

test("prerequisites point backwards only (DAG) and every level is reachable from L0", () => {
  const idx = (id: string) => LEVEL_IDS.indexOf(id as never);
  for (const l of LEVELS) for (const p of l.prerequisites) assert.ok(idx(p) < idx(l.id), `${l.id} → ${p}`);
  const reached = new Set<string>(["L0"]);
  let grew = true;
  while (grew) {
    grew = false;
    for (const l of LEVELS) if (!reached.has(l.id) && l.prerequisites.length > 0 && l.prerequisites.every((p) => reached.has(p))) {
      reached.add(l.id);
      grew = true;
    }
  }
  assert.equal(reached.size, LEVELS.length);
  assert.deepEqual(LEVELS[0]!.prerequisites, []);
});
