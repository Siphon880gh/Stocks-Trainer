import { test } from "node:test";
import assert from "node:assert/strict";
import { ACADEMY_KEY, emptyAcademy, memoryStorage, saveAcademy } from "./storage";
import { UNIT_ORDER } from "./content/levels";
import { quizForUnit } from "./content/unitQuizzes";
import { logUnitCheck } from "./retention";
import { RT_UI_KEY, academyHomeCfg, coreState } from "./retentionChrome";

const TZ = "America/Los_Angeles";
const U0 = UNIT_ORDER[0]!;
const qs = quizForUnit(U0);
const pass = { correct: qs.length, total: qs.length, mastered: true, perItem: Object.fromEntries(qs.map((q) => [q.id, true])) };

test("chrome state: a passed check is one completion; nothing else counts", () => {
  const st = memoryStorage();
  assert.deepEqual(Object.keys(coreState(st).completions), []);
  saveAcademy(logUnitCheck(emptyAcademy(), U0, pass, new Date("2026-11-26T17:00:00Z"), TZ), st);
  const r = coreState(st);
  assert.deepEqual(Object.keys(r.completions), [U0]);
  assert.equal(r.history.length, 1);
  assert.equal(r.lastUnitId, U0);
});

test("chrome save keeps only UI preferences in its own key; Academy progress is untouched", () => {
  const st = memoryStorage();
  saveAcademy(logUnitCheck(emptyAcademy(), U0, pass, new Date("2026-11-26T17:00:00Z"), TZ), st);
  const before = st.getItem(ACADEMY_KEY);
  const cfg = academyHomeCfg(st);
  const r = cfg.get();
  r.popover = { onLoad: false, lastShownOn: "2026-11-26" };
  r.completions = {}; // a stray write must not erase progress
  cfg.save(r);
  assert.equal(st.getItem(ACADEMY_KEY), before);
  const ui = JSON.parse(st.getItem(RT_UI_KEY) || "{}");
  assert.deepEqual(Object.keys(ui).sort(), ["badges", "popover", "reminder", "streak"]);
  assert.equal(cfg.get().popover.onLoad, false);
  assert.deepEqual(Object.keys(cfg.get().completions), [U0]);
});

test("chrome cfg: highlight on hub unit rows, diary link, remaining units", () => {
  const cfg = academyHomeCfg(memoryStorage());
  assert.equal(cfg.highlight.cards, "li:has(> a[data-unit])");
  assert.equal(cfg.diaryHref, "/academy/diary");
  assert.equal(cfg.modules[0].total, UNIT_ORDER.length);
  assert.equal(cfg.modules[0].remaining, UNIT_ORDER.length);
});

test("collapsed streak count colour: 0-2 days red, 3-4 orange, 5+ green", () => {
  const C = (globalThis as unknown as { RetentionCore: { streakTone: (n: number) => string } }).RetentionCore;
  assert.deepEqual([0, 1, 2, 3, 4, 5, 9].map((n) => C.streakTone(n)), ["low", "low", "low", "mid", "mid", "high", "high"]);
});
