import { test } from "node:test";
import assert from "node:assert/strict";
import { MACRO_LESSONS } from "./lessons";
import { getMacroSource } from "./sources";
import { getRelease } from "./releases";
import { getRound } from "./game";
import { MACRO_QUIZ_GROUP_IDS } from "./quiz/groups";
import { getLiteracyTerm } from "../literacyTerms";
import { FRED_META } from "./viewData";
import { meetingByMonth, dotsFor } from "./fed";
import { WORLD } from "./world";

test("≥ 15 lessons, unique ids, all six parts present and every reference resolves", () => {
  assert.ok(MACRO_LESSONS.length >= 15);
  assert.equal(new Set(MACRO_LESSONS.map((l) => l.id)).size, MACRO_LESSONS.length);
  for (const l of MACRO_LESSONS) {
    assert.ok(getMacroSource(l.sourceId), `${l.id} source`);
    for (const s of l.alsoSee ?? []) assert.ok(getMacroSource(s), `${l.id} alsoSee ${s}`);
    const v = l.viewer;
    if (v.type === "event") assert.ok(getRelease(v.eventId), `${l.id} viewer event`);
    if (v.type === "fred") assert.ok(FRED_META[v.seriesId], `${l.id} fred`);
    if (v.type === "curve") assert.ok(WORLD.days[v.day]);
    if (v.type === "statement") assert.ok(meetingByMonth(v.month), `${l.id} statement`);
    if (v.type === "dots") assert.ok(dotsFor(meetingByMonth(v.month)!), `${l.id} dots`);
    assert.ok(l.eventIds.length >= 1 && l.eventIds.every((id) => getRelease(id)), `${l.id} events`);
    assert.ok(l.roundIds.length >= 1 && l.roundIds.every((id) => getRound(id)), `${l.id} rounds`);
    assert.ok((MACRO_QUIZ_GROUP_IDS as readonly string[]).includes(l.quizGroup));
    assert.ok(l.glossaryIds.length >= 1 && l.glossaryIds.every((id) => getLiteracyTerm(id)), `${l.id} glossary`);
    assert.ok(l.lookFirst.length >= 2 && l.intro.length > 60 && l.reaction.length > 60, l.id);
  }
  const sources = new Set(MACRO_LESSONS.map((l) => l.sourceId));
  assert.ok(sources.size >= 12, `${sources.size} distinct primary sources`);
});
