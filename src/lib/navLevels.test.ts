import { test } from "node:test";
import assert from "node:assert/strict";
import {
  LEVEL_MENUS, MENU_IDS, NAV_LEVELS, NAV_TAB_KEY, PRACTICE_LEVEL_IDS, TAB_LIMIT,
  groupItems, itemsFor, loadNavTab, menuForPath, pathTabItems, saveNavTab,
} from "./navLevels";
import { FINANCIAL_GAMES, LEARN_MENU, PRACTICE_MENU, TRADE_MENU } from "./appNav";
import { routeExists } from "./academy/refs";
import { EVERYTHING_TRACK_ID, TRACKS, getTrack, type TrackProgress } from "./tracks";
import { memoryStorage } from "./academy/storage";

const none: TrackProgress = { stageStatus: () => undefined, visited: new Set(), packPlayed: () => false };
const levels = NAV_LEVELS.map((l) => l.id);

test("nav levels: every dropdown item has exactly one level, a group, a description and a real route", () => {
  for (const m of MENU_IDS) {
    const tos = LEVEL_MENUS[m].map((i) => i.to);
    assert.equal(new Set(tos).size, tos.length, `${m}: an item is listed twice (two levels)`);
    for (const i of LEVEL_MENUS[m]) {
      assert.ok(levels.includes(i.level), `${m}: ${i.to} level`);
      assert.ok(i.group.length > 0 && i.desc.length > 0, `${m}: ${i.to} group and description`);
      assert.ok(i.desc.length <= 96, `${m}: ${i.to} description fits one line`);
      assert.ok(routeExists(i.to), `${m}: ${i.to} route`);
    }
  }
});

test("nav levels: an item listed in two menus has the same level in both", () => {
  const seen = new Map<string, string>();
  for (const m of MENU_IDS) for (const i of LEVEL_MENUS[m]) {
    const prev = seen.get(i.to);
    if (prev) assert.equal(prev, i.level, i.to);
    seen.set(i.to, i.level);
  }
});

test("nav levels: the dropdowns keep every Learn, Trade and Practice item", () => {
  const all = (m: "learn" | "practice" | "trade") => LEVEL_MENUS[m].map((i) => i.to);
  for (const it of LEARN_MENU) if (it.to !== "/tools") assert.ok(all("learn").includes(it.to), it.label);
  assert.ok(all("learn").includes("/tools"));
  for (const it of TRADE_MENU) assert.ok(all("trade").includes(it.to), it.label);
  for (const it of [...PRACTICE_MENU, ...FINANCIAL_GAMES]) assert.ok(all("practice").includes(it.to), it.label);
  assert.equal(new Set(PRACTICE_LEVEL_IDS).size, PRACTICE_LEVEL_IDS.length);
  assert.equal(LEVEL_MENUS.practice.length, PRACTICE_MENU.length + FINANCIAL_GAMES.length);
});

test("nav levels: every tab has items in 2 to 4 short groups, and the first TAB_LIMIT stay in at most 4 groups", () => {
  for (const m of MENU_IDS) for (const l of levels) {
    const items = itemsFor(m, l);
    assert.ok(items.length >= 2, `${m}/${l} has ${items.length} items`);
    const groups = groupItems(items);
    assert.ok(groups.length >= 1 && groups.length <= 4, `${m}/${l}: ${groups.length} groups`);
    assert.ok(groupItems(items.slice(0, TAB_LIMIT)).length <= 4);
  }
});

test("nav levels: For your path items are the track's own steps from tracks.ts", () => {
  for (const t of TRACKS) {
    const fromTabs = MENU_IDS.flatMap((m) => pathTabItems(t, none, m));
    for (const s of fromTabs) assert.ok(t.steps.some((x) => x.to === s.to && x.label === s.label), `${t.id}: ${s.to}`);
    if (t.id !== EVERYTHING_TRACK_ID) {
      const perMenu = MENU_IDS.map((m) => t.steps.filter((s) => menuForPath(s.to) === m).length);
      assert.equal(perMenu.reduce((a, b) => a + b, 0), t.steps.length, `${t.id}: every step lands in exactly one menu`);
    }
  }
  const charts = getTrack("charts-patterns")!;
  const practice = pathTabItems(charts, none, "practice");
  assert.ok(practice.length > 0 && practice[0].group === "Next up");
  assert.ok(practice.every((s) => menuForPath(s.to) === "practice"));
  const done: TrackProgress = { ...none, visited: new Set(charts.steps.map((s) => s.to.split(/[?#]/)[0])), stageStatus: () => "done", packPlayed: () => true };
  assert.equal(pathTabItems(charts, done, "practice").length, 0, "finished steps drop out");
});

test("nav levels: menuForPath puts routes in the menu that lists them", () => {
  assert.equal(menuForPath("/academy"), "learn");
  assert.equal(menuForPath("/practice/opening-range"), "practice");
  assert.equal(menuForPath("/paper/desk"), "trade");
  assert.equal(menuForPath("/coach/opening-range-breakout"), "trade");
  assert.equal(menuForPath("/training?group=candle-anatomy"), "learn");
  assert.equal(menuForPath("/practice/candle-basics"), "learn");
});

test("nav levels: tab memory per menu, Beginner without a track, For your path with one", () => {
  const kv = memoryStorage();
  assert.equal(loadNavTab("learn", null, kv), "beginner");
  assert.equal(loadNavTab("learn", "macro-news", kv), "path");
  saveNavTab("practice", "advanced", null, kv);
  assert.equal(loadNavTab("practice", null, kv), "advanced");
  assert.equal(loadNavTab("learn", null, kv), "beginner", "other menus keep their own tab");
  assert.equal(loadNavTab("practice", "macro-news", kv), "path", "a new track opens on its path");
  saveNavTab("practice", "intermediate", "macro-news", kv);
  assert.equal(loadNavTab("practice", "macro-news", kv), "intermediate");
  kv.setItem(NAV_TAB_KEY, "{bad");
  assert.equal(loadNavTab("trade", null, kv), "beginner");
});
