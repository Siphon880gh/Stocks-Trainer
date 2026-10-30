import { test } from "node:test";
import assert from "node:assert/strict";
import type { ReactElement } from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import AcademyHub from "../../pages/academy/AcademyHub";
import AcademyTestOut from "../../pages/academy/AcademyTestOut";
import PlacementCard from "../../components/academy/PlacementCard";
import { ACADEMY_KEY, emptyAcademy, memoryStorage } from "./storage";
import { UNITS } from "./content/levels";
import { PLACEMENT_ITEMS } from "./placement";
import { testOutItems } from "./testOut";
import { hrefs, renderHtml, renderText } from "./renderHarness";
import { routeExists } from "./refs";

const at = (path: string, el: ReactElement, pattern: string) => (
  <MemoryRouter initialEntries={[path]}>
    <Routes>
      <Route path={pattern} element={el} />
    </Routes>
  </MemoryRouter>
);

test("hub: every unit is listed and every link is a real route; fresh learner sees L0 open, L1 locked, placement offered", () => {
  const store = memoryStorage();
  const html = renderHtml(<MemoryRouter><AcademyHub storage={store} /></MemoryRouter>);
  for (const u of UNITS) assert.ok(html.includes(`data-unit="${u.id}"`), u.id);
  for (const h of hrefs(html)) assert.ok(routeExists(h), h);
  assert.match(html, /data-level="L0" data-unlocked="true"/);
  assert.match(html, /data-level="L1" data-unlocked="false"/);
  assert.ok(html.includes('data-testid="placement-card"'));
  assert.ok(html.includes('data-testid="academy-continue"'));
  assert.deepEqual(store.writes, [], "rendering never writes");
});

test("hub after placement at L3: L0–L2 credited, L3 open, no placement card", () => {
  const s = { ...emptyAcademy(), placement: { startLevel: "L3" as const, correct: 9, total: 12, skipped: false, at: "2026-10-21T00:00:00Z" } };
  const html = renderHtml(<MemoryRouter><AcademyHub storage={memoryStorage({ [ACADEMY_KEY]: JSON.stringify(s) })} /></MemoryRouter>);
  assert.match(html, /data-level="L3" data-unlocked="true"/);
  assert.ok(!html.includes('data-testid="placement-card"'));
  assert.match(renderText(<MemoryRouter><AcademyHub storage={memoryStorage({ [ACADEMY_KEY]: JSON.stringify(s) })} /></MemoryRouter>), /L0 · Orientation\s*Complete/);
});

test("placement card: home variant hides once dismissed or placed; quiz markup never shows the answer", () => {
  const dismissed = memoryStorage({ [ACADEMY_KEY]: JSON.stringify({ ...emptyAcademy(), placementDismissed: true }) });
  assert.equal(renderHtml(<MemoryRouter><PlacementCard variant="home" storage={dismissed} /></MemoryRouter>), "");
  const quiz = renderText(<MemoryRouter><PlacementCard storage={memoryStorage()} initialPhase="quiz" /></MemoryRouter>);
  assert.ok(quiz.includes(PLACEMENT_ITEMS[0]!.prompt));
  assert.ok(!quiz.includes(PLACEMENT_ITEMS[0]!.explanation));
  const all = Object.fromEntries(PLACEMENT_ITEMS.map((q) => [q.id, q.correctAnswer]));
  const res = renderHtml(<MemoryRouter><PlacementCard storage={memoryStorage()} initialPhase="result" initialAnswers={all} /></MemoryRouter>);
  assert.match(res, /data-start="L4"/);
});

test("test-out page: no answers shown before submit; preset grading renders the result; unknown level is handled", () => {
  const items = testOutItems("L2");
  const pre = renderHtml(at("/academy/test-out/L2", <AcademyTestOut storage={memoryStorage()} />, "/academy/test-out/:levelId"));
  assert.ok(!pre.includes("data-correct"));
  for (const q of items) assert.ok(!renderText(at("/academy/test-out/L2", <AcademyTestOut storage={memoryStorage()} />, "/academy/test-out/:levelId")).includes(q.explanation));
  const preset = Object.fromEntries(items.map((q) => [q.id, q.correctAnswer]));
  const done = renderHtml(at("/academy/test-out/L2", <AcademyTestOut storage={memoryStorage()} preset={preset} />, "/academy/test-out/:levelId"));
  assert.match(done, /data-passed="true"/);
  assert.match(renderText(at("/academy/test-out/L0", <AcademyTestOut />, "/academy/test-out/:levelId")), /no test-out for that level/);
});

// QA regression: a failed test-out only offered "Back to the Academy"; retrying needed a reload.
test("test-out page: a failed result offers Try again, a pass does not", () => {
  const items = testOutItems("L2");
  const wrong = Object.fromEntries(items.map((q) => [q.id, q.correctAnswer === "A" ? "B" : "A"])) as Record<string, "A" | "B">;
  const failed = renderHtml(at("/academy/test-out/L2", <AcademyTestOut storage={memoryStorage()} preset={wrong} />, "/academy/test-out/:levelId"));
  assert.match(failed, /data-passed="false"/);
  assert.match(failed, /data-testid="test-out-retry"/);
  const right = Object.fromEntries(items.map((q) => [q.id, q.correctAnswer]));
  assert.doesNotMatch(renderHtml(at("/academy/test-out/L2", <AcademyTestOut storage={memoryStorage()} preset={right} />, "/academy/test-out/:levelId")), /test-out-retry/);
});

test("hub: the value promise sits under the title, and every unit not yet done has a 'Test out' link to its check", async () => {
  const { VALUE_PROMISE } = await import("./copy");
  const { recordUnitAttempt } = await import("./progress");
  const u0 = UNITS[0]!;
  const s = recordUnitAttempt(emptyAcademy(), u0.id, 3, 3);
  const ui = <MemoryRouter><AcademyHub storage={memoryStorage({ [ACADEMY_KEY]: JSON.stringify(s) })} /></MemoryRouter>;
  const html = renderHtml(ui);
  assert.ok(renderText(ui).includes(VALUE_PROMISE));
  assert.ok(html.indexOf('data-testid="value-promise"') < html.indexOf('data-testid="academy-summary"'));
  const links = hrefs(html);
  for (const u of UNITS.slice(1)) assert.ok(links.includes(`/academy/${u.id}?check=1`), u.id);
  assert.ok(!links.includes(`/academy/${u0.id}?check=1`), "no test-out link for a mastered unit");
});
