import { test } from "node:test";
import assert from "node:assert/strict";
import { ACADEMY_KEY, REWARDS_KEY, emptyAcademy, emptyRewards, memoryStorage, saveAcademy } from "./storage";
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

test("chrome state: a later-day pass is a half-credit review; a same-day repeat earns nothing; one unique completion", () => {
  const st = memoryStorage();
  let s = logUnitCheck(emptyAcademy(), U0, pass, new Date("2026-11-24T18:00:00Z"), TZ);
  s = logUnitCheck(s, U0, pass, new Date("2026-11-25T18:00:00Z"), TZ);
  s = logUnitCheck(s, U0, pass, new Date("2026-11-25T19:00:00Z"), TZ);
  saveAcademy(s, st);
  const r = coreState(st);
  assert.deepEqual(Object.keys(r.completions), [U0]);
  assert.deepEqual(r.history.map((h: { credit: number; review: boolean }) => [h.credit, h.review]), [[1, false], [0.5, true], [0, true]]);
});

test("chrome cfg: the Badges corner button links to the badge gallery on the diary page, with the earned count", () => {
  const st = memoryStorage({ [REWARDS_KEY]: JSON.stringify({ ...emptyRewards(), badges: { "first-unit": "2026-11-20T18:00:00Z" } }) });
  const cfg = academyHomeCfg(st);
  assert.equal(cfg.badgesHref, "/academy/diary#badges");
  assert.match(cfg.badgesSummary, /^1 of \d+$/);
});

test("chrome cfg: the Learning dashboard feed names the app and lists every Academy badge with its earned date", () => {
  const st = memoryStorage({ [REWARDS_KEY]: JSON.stringify({ ...emptyRewards(), badges: { "first-unit": "2026-11-20T18:00:00Z" } }) });
  const cfg = academyHomeCfg(st);
  assert.equal(cfg.hub.id, "stocks-trainer");
  assert.equal(cfg.hub.name, "Learn Stocks");
  const items = cfg.hubBadges();
  assert.ok(items.length >= 20);
  assert.equal(items.find((b) => b.id === "first-unit")?.earnedAt, "2026-11-20T18:00:00Z");
  assert.ok(items.filter((b) => !b.earnedAt).every((b) => b.desc));
});
