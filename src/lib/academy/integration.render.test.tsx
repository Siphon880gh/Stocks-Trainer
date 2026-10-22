/** BA10.M4: Training card, Home tip and the first-paper-trade coach session. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { MemoryRouter } from "react-router-dom";
import AcademyTrainingCard from "../../components/academy/AcademyTrainingCard";
import AcademyHomeTip from "../../components/academy/AcademyHomeTip";
import { academyHomeTip } from "./homeTip";
import { ACADEMY_KEY, emptyAcademy, memoryStorage } from "./storage";
import { UNIT_ORDER, getUnit } from "./content/levels";
import { ACADEMY_QUIZ_GROUP_IDS } from "./quiz/groups";
import { hrefs, renderHtml, renderText } from "./renderHarness";
import { resolveRef, routeExists } from "./refs";
import { loadSession, validateCoachingSession } from "../coaching";
import { firstPaperTradeSession } from "../coaching/sessions/first-paper-trade";
import { bannedIn } from "./content/banned";

test("Training card: links to the hub, paper, challenges, options, the coach session and the three quiz groups", () => {
  const html = renderHtml(<MemoryRouter><AcademyTrainingCard storage={memoryStorage()} /></MemoryRouter>);
  const hs = hrefs(html);
  for (const h of ["/academy", "/paper", "/paper/challenges", "/academy/options", "/coach/first-paper-trade"]) assert.ok(hs.includes(h), h);
  for (const g of ACADEMY_QUIZ_GROUP_IDS) assert.ok(hs.some((h) => h.startsWith(`/training?group=${g}&`)), g);
  for (const h of hs) assert.ok(routeExists(h), h);
  assert.match(renderText(<MemoryRouter><AcademyTrainingCard storage={memoryStorage()} /></MemoryRouter>), /SIMULATED/);
});

test("Home tip: fresh → open the Academy; in progress → continue with the next unit; all done → challenges", () => {
  assert.equal(academyHomeTip(emptyAcademy()).to, "/academy");
  const s = emptyAcademy();
  s.units[UNIT_ORDER[0]!] = { best: 3, total: 3, attempts: 1, lastAt: "2026-10-01T00:00:00.000Z", masteredAt: "2026-10-01T00:00:00.000Z" };
  const t = academyHomeTip(s);
  assert.equal(t.to, `/academy/${UNIT_ORDER[1]}`);
  assert.equal(t.linkLabel, `Continue with ${getUnit(UNIT_ORDER[1]!)!.title}`);
  const all = emptyAcademy();
  for (const id of UNIT_ORDER) all.units[id] = { best: 3, total: 3, attempts: 1, lastAt: "2026-10-01T00:00:00.000Z", masteredAt: "2026-10-01T00:00:00.000Z" };
  assert.equal(academyHomeTip(all).to, "/paper/challenges");
  const html = renderHtml(<MemoryRouter><AcademyHomeTip storage={memoryStorage({ [ACADEMY_KEY]: JSON.stringify(s) })} /></MemoryRouter>);
  for (const h of hrefs(html)) assert.ok(routeExists(h), h);
});

test("coach session first-paper-trade: valid graph, loadable, resolvable as a ref, no banned wording", () => {
  assert.equal(validateCoachingSession(firstPaperTradeSession).ok, true);
  assert.equal(loadSession("first-paper-trade").ok, true);
  assert.equal(resolveRef("coach:first-paper-trade").ok, true);
  const text = Object.values(firstPaperTradeSession.tree.nodes).map((n) => n.message + n.choices.map((c) => c.label).join(" ")).join(" ");
  assert.deepEqual(bannedIn(text), []);
  assert.match(text, /SIMULATED/);
});
