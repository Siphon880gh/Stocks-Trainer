/** Learning retention surfaces: pace panel, hub days-ago and recency, review page and diary render from saved state. */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import AcademyHub from "../../pages/academy/AcademyHub";
import AcademyReview from "../../pages/academy/AcademyReview";
import AcademyDiary from "../../pages/academy/AcademyDiary";
import { emptyAcademy, memoryStorage, saveAcademy } from "./storage";
import { UNIT_ORDER, getUnit } from "./content/levels";
import { quizForUnit } from "./content/unitQuizzes";
import { recordUnitAttempt } from "./progress";
import { logUnitCheck, UNIT_PATH } from "./retention";
import { hrefs, renderHtml, renderText } from "./renderHarness";
import { routeExists } from "./refs";

const wrap = (el: ReactElement) => <MemoryRouter>{el}</MemoryRouter>;
const U0 = UNIT_ORDER[0]!;
const qs = quizForUnit(U0);
/** Noon local, `days` calendar days ago (stable across DST). */
const daysBack = (days: number) => {
  const d = new Date();
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - days);
  return d;
};

function seeded(opts: { miss?: boolean } = {}) {
  const when = daysBack(3);
  const perItem = Object.fromEntries(qs.map((q, i) => [q.id, !(opts.miss && i === 0)]));
  const correct = Object.values(perItem).filter(Boolean).length;
  const score = { correct, total: qs.length, mastered: correct / qs.length >= 0.8, perItem };
  let s = recordUnitAttempt(emptyAcademy(), U0, correct, qs.length, when);
  s = logUnitCheck(s, U0, score, when);
  const st = memoryStorage();
  saveAcademy(s, st);
  return st;
}

test("hub shows the pace panel, a days-ago badge on the completed unit and last-done recency on its level", () => {
  const html = renderHtml(wrap(<AcademyHub storage={seeded()} />));
  assert.match(html, /data-testid="pace-panel"/);
  assert.match(html, new RegExp(`data-rt-days-ago="3"[^>]*>3d<`));
  const lv = UNIT_PATH[U0]![0].split(" · ")[0]!;
  assert.match(html, new RegExp(`data-rt-recency="${lv}"[^>]*>last done 3d ago<`));
  for (const h of hrefs(html)) assert.ok(routeExists(h), `hub: ${h} is not a route`);
});

test("a fresh hub shows no badges and a reminder opt-in that is off", () => {
  const html = renderHtml(wrap(<AcademyHub storage={memoryStorage()} />));
  assert.doesNotMatch(html, /data-rt-days-ago/);
  assert.match(html, /Reminders are off\./);
  assert.match(html, /data-rt-enable-reminders/);
});

test("diary lists the completed unit with days ago and its level > course; links resolve", () => {
  const html = renderHtml(wrap(<AcademyDiary storage={seeded()} />));
  assert.match(html, new RegExp(`data-diary-unit="${U0}"`));
  const text = renderText(wrap(<AcademyDiary storage={seeded()} />));
  assert.ok(text.includes(getUnit(U0)!.title));
  assert.ok(text.includes("3d"), text.slice(0, 400));
  assert.ok(text.includes(UNIT_PATH[U0]![1]));
  for (const h of hrefs(html)) assert.ok(routeExists(h), `diary: ${h} is not a route`);
  assert.match(renderHtml(wrap(<AcademyDiary storage={memoryStorage()} />)), /data-testid="diary-empty"/);
});

test("review page asks a question missed 3 days ago (due after 1 day) and is empty otherwise", () => {
  const html = renderHtml(wrap(<AcademyReview storage={seeded({ miss: true })} />));
  assert.match(html, /data-review-option="A"/);
  assert.match(renderHtml(wrap(<AcademyReview storage={seeded()} />)), /data-testid="review-empty"/);
});
