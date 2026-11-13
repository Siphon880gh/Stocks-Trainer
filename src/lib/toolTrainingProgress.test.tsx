import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ToolsHub from "../pages/ToolsHub.tsx";
import { renderHtml } from "./macro/renderHarness.ts";
import { MAP_PROGRESS_KEY } from "./mapProgress.ts";
import { readSnapshot } from "./progressMap.ts";
import {
  TOOL_LESSONS,
  TOOL_PROGRESS_KEY,
  emptyLessonProgress,
  lessonCompletion,
  loadLessonProgress,
  loadToolProgress,
  saveLessonProgress,
  toolTrainingShare,
  withDrill,
  withNote,
  withTask,
  withWalk,
  type ToolLessonProgress,
} from "./toolTraining/index.ts";

const memory = (init: Record<string, string> = {}) => {
  const m = new Map(Object.entries(init));
  return { m, kv: { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v) } };
};

/** Everything in a lesson done, the way the page would record it. */
function finish(id: string): ToolLessonProgress {
  const l = TOOL_LESSONS.find((x) => x.id === id)!;
  let p = emptyLessonProgress();
  for (const d of [...l.drills, ...l.scenarios]) p = withDrill(p, d.id, d.answer);
  for (const t of l.tasks) p = withTask(p, t.id, { value: "1", stamp: "Nov 12, 2026 10:00 AM PT", checkedAt: "2026-11-12T18:00:00Z", ok: true });
  for (const s of l.simulations ?? []) p = withWalk(p, s.id, new Date("2026-11-12T18:00:00Z"));
  for (const f of l.workflow?.steps.flatMap((s) => s.fields) ?? []) p = withNote(p, f.key, "filled");
  return p;
}

describe("scenario drills", () => {
  it("every lesson has 2–3 scenarios with valid answers, unique ids and a reason", () => {
    const ids = new Set<string>();
    for (const l of TOOL_LESSONS) {
      assert.ok(l.scenarios.length >= 2 && l.scenarios.length <= 3, `${l.id}: ${l.scenarios.length} scenarios`);
      for (const d of [...l.drills, ...l.scenarios]) {
        assert.ok(!ids.has(d.id), `duplicate drill id ${d.id}`);
        ids.add(d.id);
      }
      for (const s of l.scenarios) {
        assert.ok(s.prompt.length >= 80, `${s.id}: a scenario sets up a situation`);
        assert.ok(s.options.length >= 3 && s.answer >= 0 && s.answer < s.options.length, s.id);
        assert.equal(new Set(s.options).size, s.options.length, `${s.id}: options are distinct`);
        assert.ok(s.why.length >= 30, `${s.id}: why`);
        assert.ok(!/\bguarantee|sure thing|you should buy\b/i.test(s.prompt + s.why), `${s.id}: not advice`);
      }
    }
  });
});

describe("tool training progress store", () => {
  it("loads empty, saves per lesson, keeps other lessons and drops junk", () => {
    const { m, kv } = memory();
    assert.deepEqual(loadToolProgress(kv), { lessons: {} });
    const p = withDrill(emptyLessonProgress(), "mf-d1", 2);
    saveLessonProgress("tool-market-forces", p, kv, new Date("2026-11-13T12:00:00Z"));
    saveLessonProgress("tool-finviz", withWalk(emptyLessonProgress(), "fv-sim-x"), kv);
    const back = loadLessonProgress("tool-market-forces", kv);
    assert.equal(back.drills["mf-d1"], 2);
    assert.equal(back.updatedAt, "2026-11-13T12:00:00.000Z");
    assert.ok(loadToolProgress(kv).lessons["tool-finviz"]!.walks["fv-sim-x"]);
    saveLessonProgress("tool-finviz", null, kv);
    assert.equal(loadToolProgress(kv).lessons["tool-finviz"], undefined, "reset removes the lesson");
    assert.ok(loadToolProgress(kv).lessons["tool-market-forces"], "reset leaves other lessons");
    m.set(TOOL_PROGRESS_KEY, JSON.stringify({ lessons: { a: { drills: { x: "no", y: 1, z: -1 }, tasks: { t: { value: 1 } }, walks: { s: 5 }, notes: { n: "ok" } } } }));
    assert.deepEqual(loadToolProgress(kv).lessons.a, { drills: { y: 1 }, tasks: {}, walks: {}, notes: { n: "ok" } });
    m.set(TOOL_PROGRESS_KEY, "{broken");
    assert.deepEqual(loadToolProgress(kv), { lessons: {} });
    assert.doesNotThrow(() => saveLessonProgress("x", emptyLessonProgress(), { getItem: () => null, setItem: () => { throw new Error("full"); } }));
  });

  it("a drill's first pick sticks and a walk keeps its first time", () => {
    const p = withDrill(withDrill(emptyLessonProgress(), "d", 1), "d", 3);
    assert.equal(p.drills.d, 1);
    const w = withWalk(withWalk(p, "s", new Date("2026-11-13T01:00:00Z")), "s", new Date("2026-11-14T01:00:00Z"));
    assert.equal(w.walks.s, "2026-11-13T01:00:00.000Z");
  });

  it("completion counts drills, scenarios, recorded-ok tasks, finished walks and a filled workflow; a failed task does not count", () => {
    for (const l of TOOL_LESSONS) {
      const empty = lessonCompletion(l);
      assert.equal(empty.done, 0, l.id);
      const expected = l.drills.length + l.scenarios.length + l.tasks.length + (l.simulations?.length ?? 0) + (l.workflow ? 1 : 0);
      assert.equal(empty.total, expected, l.id);
      const full = lessonCompletion(l, finish(l.id));
      assert.equal(full.done, full.total, l.id);
      assert.equal(full.fraction, 1);
      assert.equal(full.right, l.drills.length + l.scenarios.length);
    }
    const l = TOOL_LESSONS[0]!;
    const bad = withTask(emptyLessonProgress(), l.tasks[0]!.id, { value: "x", stamp: "", checkedAt: "2026-11-13T00:00:00Z", ok: false });
    assert.equal(lessonCompletion(l, bad).done, 0);
    const bank = TOOL_LESSONS.find((x) => x.workflow)!;
    const f = bank.workflow!.steps.flatMap((s) => s.fields);
    const partial = withNote(emptyLessonProgress(), f[0]!.key, "only one");
    assert.equal(lessonCompletion(bank, partial).parts.workflow[0], 0, "a half-filled note is not done");
  });

  it("the hub share is the average lesson completion", () => {
    assert.equal(toolTrainingShare(TOOL_LESSONS, { lessons: {} }), 0);
    const one = { lessons: { [TOOL_LESSONS[0]!.id]: finish(TOOL_LESSONS[0]!.id) } };
    assert.ok(Math.abs(toolTrainingShare(TOOL_LESSONS, one) - 1 / TOOL_LESSONS.length) < 1e-9);
    const all = { lessons: Object.fromEntries(TOOL_LESSONS.map((l) => [l.id, finish(l.id)])) };
    assert.equal(toolTrainingShare(TOOL_LESSONS, all), 1);
  });
});

describe("progress map: opening a tool lesson is not completing it", () => {
  it("visiting every lesson route leaves hub:tools at 0; doing items raises it", () => {
    const { m, kv } = memory();
    m.set(MAP_PROGRESS_KEY, JSON.stringify({ visited: ["/tools", ...TOOL_LESSONS.map((t) => t.route)], quiz: {} }));
    assert.equal(readSnapshot(kv).fractions["hub:tools"], 0);
    saveLessonProgress(TOOL_LESSONS[0]!.id, finish(TOOL_LESSONS[0]!.id), kv);
    assert.ok(Math.abs(readSnapshot(kv).fractions["hub:tools"]! - 1 / TOOL_LESSONS.length) < 1e-9);
  });
});

describe("saved progress on the pages", () => {
  const withStorage = <T,>(init: Record<string, string>, f: () => T): T => {
    const g = globalThis as { window?: unknown };
    const had = "window" in g;
    const prev = g.window;
    g.window = { localStorage: memory(init).kv };
    try {
      return f();
    } finally {
      if (had) g.window = prev;
      else delete g.window;
    }
  };
  const page = (path: string) => (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/tools" element={<ToolsHub />} />
        <Route path="/tools/:toolId" element={<ToolsHub />} />
      </Routes>
    </MemoryRouter>
  );

  it("a lesson page shows its saved count, scenarios, picked answers and walked sims, plus a reset button", () => {
    const l = TOOL_LESSONS.find((x) => (x.simulations?.length ?? 0) > 0)!;
    let p = withDrill(emptyLessonProgress(), l.drills[0]!.id, l.drills[0]!.answer);
    p = withDrill(p, l.scenarios[0]!.id, (l.scenarios[0]!.answer + 1) % l.scenarios[0]!.options.length);
    p = withWalk(p, l.simulations![0]!.id);
    const total = lessonCompletion(l).total;
    const html = withStorage({ [TOOL_PROGRESS_KEY]: JSON.stringify({ lessons: { [l.id]: p } }) }, () => renderHtml(page(l.route)));
    assert.match(html, new RegExp(`data-testid="tool-progress-count">3 of ${total} done<`));
    assert.match(html, /data-testid="tool-scenarios"/);
    assert.match(html, /data-testid="tool-progress-reset"/);
    assert.ok(html.includes(`data-walk-done="${l.simulations![0]!.id}"`));
    assert.ok(html.includes("Correct. "), "a saved right pick shows its answer");
    assert.ok(html.includes("Not quite. "), "a saved wrong scenario pick shows its answer");
  });

  it("a fresh lesson shows 0 done and no reset; the hub shows each lesson's saved progress", () => {
    const l = TOOL_LESSONS[1]!;
    const fresh = withStorage({}, () => renderHtml(page(l.route)));
    assert.match(fresh, /data-testid="tool-progress-count">0 of \d+ done</);
    assert.doesNotMatch(fresh, /tool-progress-reset/);
    const hub = withStorage({ [TOOL_PROGRESS_KEY]: JSON.stringify({ lessons: { [l.id]: finish(l.id) } }) }, () => renderHtml(page("/tools")));
    assert.ok(hub.includes(`data-lesson-progress="${l.id}">Done · all ${lessonCompletion(l).total} items<`));
    assert.ok(hub.includes(`data-lesson-progress="${TOOL_LESSONS[0]!.id}">Not started`));
  });
});
