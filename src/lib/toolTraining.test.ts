import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { CHARTING_APPS_ROUTE, TOOL_CASES, TOOL_LESSONS, TOOL_TERMS, getToolLesson, toolLessonQuestions } from "./toolTraining/index.ts";
import { APP_ROUTES, routeExists } from "./academy/refs.ts";
import { listSessions } from "./coaching/index.ts";
import { QUIZ_GROUPS, getQuestionsForGroup } from "./quizData.ts";
import { TOOL_TRAINING } from "./appNav.ts";
import { STAGE_BY_ID, stageForRoute } from "./progressMap.ts";

describe("tool training wiring", () => {
  it("has a hub and lesson route on the map, and keeps the charting-apps lab in place", () => {
    assert.ok(APP_ROUTES.includes("/tools") && APP_ROUTES.includes("/tools/:toolId"));
    assert.equal(stageForRoute("tools")?.id, "hub:tools");
    assert.equal(stageForRoute("tools/:toolId")?.id, "hub:tools");
    assert.ok(APP_ROUTES.includes(CHARTING_APPS_ROUTE));
    assert.equal(TOOL_TRAINING[0]!.to, "/tools");
    assert.equal(TOOL_TRAINING[TOOL_TRAINING.length - 1]!.to, CHARTING_APPS_ROUTE);
  });
});

describe("tool training lessons", () => {
  const sessions = new Set(listSessions().map((s) => s.slug));
  it("ids and slugs are unique; each lesson is a Learn group, a route and a map stage", () => {
    assert.equal(new Set(TOOL_LESSONS.map((t) => t.id)).size, TOOL_LESSONS.length);
    for (const t of TOOL_LESSONS) {
      assert.equal(t.route, `/tools/${t.slug}`);
      assert.ok(routeExists(t.route), t.route);
      assert.equal(getToolLesson(t.slug), t);
      assert.ok(QUIZ_GROUPS.some((g) => g.id === t.id), t.id);
      assert.deepEqual(getQuestionsForGroup(t.id), toolLessonQuestions(t.id));
      assert.ok(STAGE_BY_ID[`quiz:${t.id}`], t.id);
      assert.match(t.asOf, /^\d{4}-\d{2}-\d{2}$/);
      assert.match(t.credit.url, /^https:\/\//);
    }
  });
  it("quizzes have 12 to 20 well-formed questions with unique ids", () => {
    const qids = TOOL_LESSONS.flatMap((t) => t.questions.map((q) => q.id));
    assert.equal(new Set(qids).size, qids.length);
    for (const t of TOOL_LESSONS) {
      assert.ok(t.questions.length >= 12 && t.questions.length <= 20, `${t.id}: ${t.questions.length}`);
      for (const q of t.questions) {
        assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
        assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, q.id);
        assert.ok(q.explanation.length > 20, q.id);
      }
    }
  });
  it("screens carry alt text, a caption and markers that point at real blocks", () => {
    for (const t of TOOL_LESSONS) {
      assert.ok(t.screens.length >= 2, t.id);
      for (const s of t.screens) {
        assert.ok(s.alt.length > 40 && s.caption.length > 20, s.id);
        assert.ok(s.blocks.length >= 2, s.id);
        assert.equal(new Set(s.callouts.map((c) => c.n)).size, s.callouts.length, s.id);
        for (const c of s.callouts) assert.ok(c.block >= 0 && c.block < s.blocks.length, `${s.id} marker ${c.n}`);
      }
    }
  });
  it("sources, links, drills, cases and terms are well-formed", () => {
    for (const t of TOOL_LESSONS) {
      assert.ok(t.sources.length >= 2, t.id);
      for (const s of t.sources) assert.match(s.url, /^https:\/\//, s.url);
      assert.equal(new Set(t.sources.map((s) => s.url)).size, t.sources.length, `${t.id} duplicate source`);
      for (const l of t.links) {
        const path = l.to.split("?")[0]!.split("#")[0]!;
        if (path.startsWith("/coach/")) assert.ok(sessions.has(path.slice(7)), l.to);
        else if (path.startsWith("/tools/")) assert.ok(getToolLesson(path.slice(7)), l.to);
        else assert.ok(routeExists(path), l.to);
      }
      assert.ok(t.links.some((l) => l.to.startsWith("/coach/")), `${t.id} coach link`);
      assert.ok(t.links.some((l) => l.to === `/training?group=${t.id}`), `${t.id} Learn link`);
      assert.ok(t.drills.length >= 3 && t.walkthroughs.length >= 1 && t.caveats.length >= 2, t.id);
      for (const d of t.drills) assert.ok(d.answer >= 0 && d.answer < d.options.length, d.id);
      assert.ok(t.cases.length >= 2, t.id);
      assert.ok(t.modeLabel && t.modeTip, t.id);
    }
    const cids = TOOL_CASES.map((c) => c.id);
    assert.equal(new Set(cids).size, cids.length);
    const tids = TOOL_TERMS.map((x) => x.id);
    assert.equal(new Set(tids).size, tids.length);
  });
});
