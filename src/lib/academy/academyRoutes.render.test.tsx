/** BA10.M1: every href on every Academy surface resolves to a real route, and Academy-owned params name real things. */
import { test } from "node:test";
import assert from "node:assert/strict";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AcademyHub from "../../pages/academy/AcademyHub";
import AcademyUnit from "../../pages/academy/AcademyUnit";
import AcademyTestOut from "../../pages/academy/AcademyTestOut";
import Paper from "../../pages/academy/Paper";
import PaperChallenges from "../../pages/academy/PaperChallenges";
import OptionsLadder from "../../components/academy/options/OptionsLadder";
import TodayCard from "../../components/academy/TodayCard";
import { ACADEMY_KEY, emptyAcademy, memoryStorage } from "./storage";
import { LEVELS, UNITS, getLevel, getUnit } from "./content/levels";
import { CHALLENGES, getChallenge } from "./challenges";
import { LITERACY_TERMS } from "../literacyTerms";
import { hrefs, renderHtml } from "./renderHarness";
import { APP_ROUTES, routeExists } from "./refs";

const at = (path: string, pattern: string, el: ReactElement) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path={pattern} element={el} />
    </Routes>
  </MemoryRouter>
);
const termIds = new Set(LITERACY_TERMS.map((t) => t.id));

function check(href: string, where: string) {
  assert.ok(routeExists(href), `${where}: ${href} is not a route`);
  const [path, query = ""] = href.split("?");
  const seg = path!.split("/").filter(Boolean);
  if (seg[0] === "academy" && seg.length === 2 && seg[1] !== "options") assert.ok(getUnit(seg[1]!), `${where}: unknown unit ${seg[1]}`);
  if (seg[0] === "academy" && seg[1] === "test-out") assert.ok(getLevel(seg[2]!), `${where}: unknown level ${seg[2]}`);
  if (seg[0] === "paper" && seg[1] === "challenges" && seg[2]) assert.ok(getChallenge(seg[2]), `${where}: unknown challenge ${seg[2]}`);
  const open = new URLSearchParams(query).get("open");
  if (seg[0] === "archive" && open) assert.ok(termIds.has(open), `${where}: unknown glossary term ${open}`);
}

test("the four academy route families are registered", () => {
  for (const r of ["/academy", "/academy/options", "/academy/test-out/:levelId", "/academy/:unitId", "/paper", "/paper/challenges", "/paper/challenges/:challengeId"]) assert.ok(APP_ROUTES.includes(r as (typeof APP_ROUTES)[number]), r);
});

test("hub, every unit page, every test-out page, paper, challenges, options ladder and Today card: all hrefs resolve", () => {
  const s = emptyAcademy();
  s.placement = { startLevel: "L7", at: "2026-10-01T00:00:00.000Z", correct: 12, total: 12, skipped: false };
  const st = () => memoryStorage({ [ACADEMY_KEY]: JSON.stringify(s) });
  let count = 0;
  const run = (el: ReactElement, where: string) => {
    for (const h of hrefs(renderHtml(el))) {
      check(h, where);
      count++;
    }
  };
  run(<MemoryRouter><AcademyHub storage={st()} /></MemoryRouter>, "hub");
  for (const u of UNITS) run(at(`/academy/${u.id}`, "/academy/:unitId", <AcademyUnit storage={st()} />), u.id);
  for (const l of LEVELS) run(at(`/academy/test-out/${l.id}`, "/academy/test-out/:levelId", <AcademyTestOut storage={st()} />), `test-out ${l.id}`);
  run(<MemoryRouter><Paper storage={st()} /></MemoryRouter>, "paper");
  run(at("/paper/challenges", "/paper/challenges", <PaperChallenges storage={st()} />), "challenges");
  for (const c of CHALLENGES) run(at(`/paper/challenges/${c.id}`, "/paper/challenges/:challengeId", <PaperChallenges storage={st()} />), c.id);
  run(<MemoryRouter><OptionsLadder storage={st()} /></MemoryRouter>, "options");
  run(<MemoryRouter><TodayCard storage={st()} /></MemoryRouter>, "today");
  assert.ok(count > 100, `only ${count} links checked`);
});
