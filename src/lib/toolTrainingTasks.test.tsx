import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ToolsHub from "../pages/ToolsHub.tsx";
import { renderHtml } from "./macro/renderHarness.ts";
import {
  TOOL_LESSONS,
  checkFindTask,
  checkTaskStamp,
  checkTaskValue,
  isLiveLinkValid,
  nowStamp,
  parseTaskDate,
  parseTaskNumber,
  toolTextPlain,
} from "./toolTraining/index.ts";

const at = (path: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path="/tools/:toolId" element={<ToolsHub />} />
    </Routes>
  </MemoryRouter>
);

describe("find-it-yourself checks", () => {
  it("parses numbers with signs, commas, units and suffixes", () => {
    assert.equal(parseTaskNumber("13.42"), 13.42);
    assert.equal(parseTaskNumber("1,234.5"), 1234.5);
    assert.equal(parseTaskNumber("−2.46%"), -2.46);
    assert.equal(parseTaskNumber("$120.09B"), 120.09e9);
    assert.equal(parseTaskNumber("21.5 billion"), 21.5e9);
    assert.equal(parseTaskNumber("(3.1)"), -3.1);
    assert.equal(parseTaskNumber("13.4x"), 13.4);
    assert.equal(parseTaskNumber("abc"), null);
    assert.equal(parseTaskNumber("12..3"), null);
  });
  it("parses the date shapes the tools print", () => {
    assert.deepEqual(parseTaskDate("Nov 12, 2026"), { y: 2026, m: 11, d: 12 });
    assert.deepEqual(parseTaskDate("2026-11-12"), { y: 2026, m: 11, d: 12 });
    assert.deepEqual(parseTaskDate("11/12/2026"), { y: 2026, m: 11, d: 12 });
    assert.deepEqual(parseTaskDate("12 November 2026"), { y: 2026, m: 11, d: 12 });
    assert.equal(parseTaskDate("13/40/2026"), null);
    assert.equal(parseTaskDate("soon"), null);
  });
  it("checks format and a plausible range, never an exact value", () => {
    const pct = { format: "percent", min: 0, max: 40, example: "1.66%" } as const;
    assert.deepEqual(checkTaskValue(pct, "2.10%"), []);
    assert.ok(checkTaskValue(pct, "2.10").length, "missing % sign");
    assert.ok(checkTaskValue(pct, "85%").length, "out of range");
    const money = { format: "money", min: 20e9, max: 600e9, example: "$125.3B" } as const;
    assert.deepEqual(checkTaskValue(money, "$131.7B"), []);
    assert.ok(checkTaskValue(money, "131.7M").length, "wrong units caught by range");
    assert.ok(checkTaskValue({ format: "number", min: 1, max: 5, example: "1.7" }, "1.7%").length, "stray % sign");
    assert.deepEqual(checkTaskValue({ format: "text", example: "Gold miner", oneOf: ["miner"] }, "gold MINER"), []);
    assert.ok(checkTaskValue({ format: "text", example: "Gold miner", oneOf: ["miner"] }, "Bullion").length);
    assert.deepEqual(checkTaskValue({ format: "date", example: "Nov 12, 2026", minYear: 2025, maxYear: 2027 }, "2026-11-12"), []);
    assert.ok(checkTaskValue({ format: "date", example: "Nov 12, 2026", minYear: 2025, maxYear: 2027 }, "2019-11-12").length);
    assert.ok(checkTaskValue(pct, "  ").length, "empty");
  });
  it("needs a time stamp with a date or a time", () => {
    assert.deepEqual(checkTaskStamp("Nov 12 • 8:25 AM ET"), []);
    assert.ok(checkTaskStamp("").length && checkTaskStamp("this morning").length);
    assert.deepEqual(checkTaskStamp(nowStamp(new Date(2026, 10, 12, 9, 41))), []);
  });
});

describe("find-it-yourself tasks in lessons", () => {
  it("each lesson has 3 or 4 well-formed tasks whose examples pass their own checks", () => {
    const ids = TOOL_LESSONS.flatMap((t) => t.tasks.map((k) => k.id));
    assert.equal(new Set(ids).size, ids.length, "task ids are unique");
    for (const t of TOOL_LESSONS) {
      assert.ok(t.tasks.length >= 3 && t.tasks.length <= 4, `${t.id}: ${t.tasks.length} tasks`);
      for (const k of t.tasks) {
        assert.ok(isLiveLinkValid(k.live), `${k.id}: ${k.live.url}`);
        assert.ok(toolTextPlain(k.find).length >= 10 && k.where.length >= 15 && k.why.length >= 30, k.id);
        if (k.answer.format === "percent" || k.answer.format === "number" || k.answer.format === "money") assert.ok(k.answer.min < k.answer.max, k.id);
        assert.ok(checkFindTask(k, k.answer.example, "Nov 12 • 4:00 PM ET").ok, `${k.id}: example ${k.answer.example} fails its own check`);
      }
    }
  });
  TOOL_LESSONS.forEach((t) => {
    it(`${t.route}: renders each task with a new-tab live link and value and time stamp inputs`, () => {
      const html = renderHtml(at(t.route));
      assert.ok(html.includes('data-testid="tool-tasks"'), t.route);
      assert.ok(html.includes(`0 of ${t.tasks.length} recorded`), t.route);
      for (const k of t.tasks) {
        assert.ok(html.includes(`data-task="${k.id}"`), k.id);
        assert.ok(html.includes(`href="${k.live.url.replace(/&/g, "&amp;")}" target="_blank" rel="noopener noreferrer"`), k.id);
      }
      const inputs = html.match(/aria-label="[^"]*: (value|time stamp)"/g) ?? [];
      assert.equal(inputs.length, t.tasks.length * 2, t.route);
    });
  });
});
