import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { QUIZ_GROUPS } from "./quizData";
import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import {
  DEPTH, FIRST_OBJECTIVE, REGIONS, SPINE, STAGES, STAGE_BY_ID, TREE_IDS, UNMAPPED_GROUPS, UNMAPPED_LABS,
  buildMapModel, emptySnapshot, readSnapshot, stageForRoute, unlocksOf,
} from "./progressMap";
import { MAP_PROGRESS_KEY, recordQuizResult, recordVisit, loadMapStore } from "./mapProgress";
import { ACADEMY_KEY, emptyAcademy, loadAcademy, memoryStorage } from "./academy/storage";
import { isLevelComplete } from "./academy/progress";

const app = readFileSync(new URL("../App.tsx", import.meta.url), "utf8");
const routes = [...app.matchAll(/<Route\s+path="([^"]+)"/g)].map((m) => m[1]!).filter((p) => p !== "/");

test("drift: every route in App.tsx has a stage on the map", () => {
  assert.ok(routes.length >= 50, `parsed ${routes.length} routes`);
  assert.ok(/<Route index element=\{<Dashboard/.test(app));
  assert.ok(stageForRoute(""), "index route");
  for (const r of routes) assert.ok(stageForRoute(r), `route "${r}" is not on the progress map`);
});

test("drift: every Learn group and every practice lab has a stage in a region", () => {
  assert.deepEqual(UNMAPPED_GROUPS, [], "Learn groups missing from QUIZ_REGION");
  assert.deepEqual(UNMAPPED_LABS, [], "labs missing from LAB_REGION");
  for (const g of QUIZ_GROUPS) assert.ok(STAGE_BY_ID[`quiz:${g.id}`], g.id);
  for (const m of MISC_PRACTICE_ITEMS) assert.ok(STAGE_BY_ID[`lab:${m.id}`], m.id);
  const regionIds = new Set(REGIONS.map((r) => r.id));
  for (const s of STAGES) assert.ok(regionIds.has(s.region), `${s.id} region`);
  for (const r of REGIONS) assert.ok(STAGES.some((s) => s.region === r.id), `empty region ${r.id}`);
  assert.equal(new Set(STAGES.map((s) => s.id)).size, STAGES.length, "duplicate stage ids");
});

test("skill tree: prerequisites exist, no cycles, the main path runs candles → patterns → confirmation → fib", () => {
  for (const s of STAGES) for (const p of [...s.prereqs, ...s.related]) assert.ok(STAGE_BY_ID[p], `${s.id} → unknown ${p}`);
  for (const s of STAGES) assert.ok(Number.isFinite(DEPTH[s.id]));
  assert.ok(TREE_IDS.length >= 40);
  for (const id of SPINE.slice(1)) assert.ok(DEPTH[id]! >= 1 && STAGE_BY_ID[id], `${id} on the tree`);
  const d = (id: string) => DEPTH[id]!;
  assert.ok(d("quiz:candle-anatomy") < d("quiz:japanese-candles") && d("quiz:japanese-candles") < d("lab:essential-candles"));
  assert.ok(d("lab:essential-candles") < d("quiz:buy-or-sell") && d("quiz:buy-or-sell") < d("lab:invalidation") && d("lab:invalidation") < d("lab:fib-decision-map"));
  assert.ok(unlocksOf("quiz:candle-anatomy").includes("quiz:candle-reading"));
  assert.ok(STAGE_BY_ID["lab:fib-decision-map"]!.prereqs.includes("lab:levels"));
});

test("new learner: mostly '?' with the first objective highlighted", () => {
  const m = buildMapModel({ ...emptySnapshot(), visited: ["/", "/map"] });
  assert.equal(m.next?.stage.id, FIRST_OBJECTIVE);
  assert.ok(m.frontier.includes(FIRST_OBJECTIVE));
  assert.ok(m.frontier.length >= 5);
  assert.ok(m.regions.every((r) => r.region.id === "start" || r.pct === 0));
  assert.equal(m.states["quiz:candle-reading"]!.status, "locked");
  assert.equal(m.states[FIRST_OBJECTIVE]!.status, "available");
});

test("statuses follow existing progress; next objective moves along the path", () => {
  const snap = { ...emptySnapshot(), visited: ["/", "/practice/which-way"], quizPassed: ["candle-anatomy"], quizTried: ["candle-anatomy", "candle-reading"], labsDone: ["essential-candles"], fractions: { "hub:cases": 0.5, "academy:L0": 1 } };
  const m = buildMapModel(snap);
  assert.equal(m.states["quiz:candle-anatomy"]!.status, "done");
  assert.equal(m.states["quiz:candle-reading"]!.status, "in-progress");
  assert.equal(m.states["lab:essential-candles"]!.status, "done");
  assert.equal(m.states["lab:which-way"]!.status, "in-progress");
  assert.equal(m.states["hub:cases"]!.status, "in-progress");
  assert.equal(m.states["academy:L0"]!.status, "done");
  assert.equal(m.states["academy:L1"]!.status, "available");
  assert.equal(m.next?.stage.id, "quiz:candle-reading", "in-progress spine stage first");
  assert.ok(m.frontier.every((id) => !m.states[id]!.discovered));
  const all = buildMapModel({
    ...emptySnapshot(),
    visited: STAGES.map((s) => s.to),
    quizPassed: QUIZ_GROUPS.map((g) => g.id),
    labsDone: MISC_PRACTICE_ITEMS.map((x) => x.id),
    fractions: Object.fromEntries(STAGES.filter((s) => s.kind === "hub" || s.kind === "level").map((s) => [s.id, 1])),
  });
  assert.equal(all.totals.done, all.totals.total);
  assert.equal(all.next, null);
  assert.ok(all.regions.every((r) => r.finished));
});

test("regression: Academy placement credit counts on the map like isLevelComplete (tested out too; skipped placement does not)", () => {
  const mem = new Map<string, string>();
  const s = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
  const academy = (extra: Record<string, unknown>) =>
    mem.set(ACADEMY_KEY, JSON.stringify({ ...emptyAcademy(), ...extra }));
  academy({ placement: { startLevel: "L3", correct: 9, total: 12, skipped: false, at: "2026-10-30T00:00:00Z" } });
  let snap = readSnapshot(s);
  const st = loadAcademy(memoryStorage({ [ACADEMY_KEY]: mem.get(ACADEMY_KEY)! })).state;
  for (const l of ["L0", "L1", "L2"] as const) {
    assert.ok(isLevelComplete(st, l), l);
    assert.equal(snap.fractions[`academy:${l}`], 1, `${l} placed past = done on the map`);
  }
  assert.equal(snap.fractions["academy:L3"], 0, "the start level itself is not credited");
  assert.equal(buildMapModel(snap).states["academy:L1"]!.status, "done");
  academy({ placement: { startLevel: "L0", correct: 0, total: 12, skipped: true, at: "2026-10-30T00:00:00Z" } });
  snap = readSnapshot(s);
  assert.equal(snap.fractions["academy:L0"], 0, "skipping placement credits nothing");
  academy({ testedOut: { L2: { at: "2026-10-30T00:00:00Z", correct: 7, total: 7 } } });
  assert.equal(readSnapshot(s).fractions["academy:L2"], 1);
});

test("map store: visits and quiz passes at the pass mark feed readSnapshot", () => {
  const mem = new Map<string, string>();
  const s = { getItem: (k: string) => mem.get(k) ?? null, setItem: (k: string, v: string) => void mem.set(k, v) };
  recordVisit("/practice/which-way/?x=1", s);
  recordVisit("/practice/which-way", s);
  recordQuizResult("candle-anatomy", 60, s);
  recordQuizResult("candle-reading", 80, s);
  recordQuizResult("candle-reading", 40, s);
  assert.deepEqual(loadMapStore(s).visited, ["/practice/which-way"]);
  assert.ok(mem.has(MAP_PROGRESS_KEY));
  mem.set("analysis_core_misc_practices_done_v1", JSON.stringify(["which-way"]));
  const snap = readSnapshot(s);
  assert.deepEqual(snap.quizPassed, ["candle-reading"]);
  assert.deepEqual(snap.quizTried.sort(), ["candle-anatomy", "candle-reading"]);
  assert.deepEqual(snap.labsDone, ["which-way"]);
  assert.equal(snap.fractions["hub:cases"], 0);
});
