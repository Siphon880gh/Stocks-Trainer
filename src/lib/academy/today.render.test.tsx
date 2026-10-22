import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryRouter } from "react-router-dom";
import TodayCard from "../../components/academy/TodayCard";
import { ACADEMY_KEY, REWARDS_KEY, emptyAcademy, loadAcademy, loadRewards, memoryStorage, saveAcademy } from "./storage";
import { pickReview, recordDaily, todayPicks } from "./today";
import { awardDaily } from "./rewards/award";
import { computeStreak } from "./rewards/streak";
import { UNIT_ORDER } from "./content/levels";
import { hrefs, renderHtml, renderText } from "./renderHarness";
import { routeExists } from "./refs";

const NOW = new Date("2026-10-21T19:00:00Z");
const card = (storage: ReturnType<typeof memoryStorage>, now = NOW) => (
  <MemoryRouter>
    <TodayCard storage={storage} now={() => now} />
  </MemoryRouter>
);
function seeded() {
  const s = emptyAcademy();
  for (const id of UNIT_ORDER.slice(0, 3)) s.units[id] = { best: 3, total: 3, attempts: 1, lastAt: "2026-10-01T00:00:00.000Z", masteredAt: "2026-10-01T00:00:00.000Z" };
  return memoryStorage({ [ACADEMY_KEY]: JSON.stringify(s) });
}

test("fresh learner: next unit, term, challenge; no review question yet; links resolve", () => {
  const st = memoryStorage();
  const html = renderHtml(card(st));
  const p = todayPicks(emptyAcademy(), NOW);
  assert.ok(html.includes('data-testid="today-next-unit"'));
  assert.ok(renderText(card(st)).includes(p.term.name));
  assert.ok(renderText(card(st)).includes(p.challenge.title));
  assert.ok(!html.includes('data-testid="today-review"'));
  for (const h of hrefs(html)) assert.ok(routeExists(h), h);
  assert.equal(st.writes.length, 0, "rendering writes nothing");
});

test("mastered units: the picked review question is shown", () => {
  const st = seeded();
  const q = pickReview(loadAcademy(st).state, "2026-10-21")!;
  assert.ok(renderHtml(card(st)).includes(`data-question="${q.id}"`));
});

test("streak integration: answering today's question records daily, awards points once and marks the day active", () => {
  const st = seeded();
  const before = computeStreak(loadRewards(st).state.streak.days, NOW);
  assert.equal(before.activeToday, false);
  // same steps the card runs on click
  const picks = todayPicks(loadAcademy(st).state, NOW);
  saveAcademy(recordDaily(loadAcademy(st).state, picks.dateKey, picks.review!.id, true, NOW), st);
  const r1 = awardDaily(picks.dateKey, st, NOW);
  const r2 = awardDaily(picks.dateKey, st, NOW);
  assert.equal(r1.added, 5);
  assert.equal(r2.added, 0);
  const after = computeStreak(loadRewards(st).state.streak.days, NOW);
  assert.equal(after.activeToday, true);
  assert.equal(after.current, 1);
  const html = renderHtml(card(st));
  assert.ok(html.includes('data-testid="today-feedback"'));
  assert.match(renderText(card(st)), /done today/);
  assert.ok(st.data.has(REWARDS_KEY));
});
