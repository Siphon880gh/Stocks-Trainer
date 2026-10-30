import { test } from "node:test";
import assert from "node:assert/strict";
import type { ReactElement } from "react";
import { MemoryRouter } from "react-router-dom";
import UnitPlayer from "../../components/academy/UnitPlayer";
import { UNITS, getUnit } from "./content/levels";
import { quizForUnit } from "./content/unitQuizzes";
import { resolveRef } from "./refs";
import { hrefs, renderHtml, renderText } from "./renderHarness";

const wrap = (el: ReactElement) => <MemoryRouter>{el}</MemoryRouter>;

test("pre-submit quiz markup never contains an explanation, feedback or correct marker (every unit)", () => {
  for (const u of UNITS) {
    const html = renderHtml(wrap(<UnitPlayer unit={u} initialPhase="quiz" />));
    const text = renderText(wrap(<UnitPlayer unit={u} initialPhase="quiz" />));
    assert.ok(!html.includes("data-correct"), u.id);
    assert.ok(!html.includes('data-testid="explanation"'), u.id);
    for (const q of quizForUnit(u.id)) {
      assert.ok(!text.includes(q.explanation), `${u.id} ${q.id} explanation leaked`);
      for (const o of q.options) if (o.feedback) assert.ok(!text.includes(o.feedback), `${q.id} feedback leaked`);
      assert.ok(text.includes(q.prompt));
    }
  }
});

test("chips link to the resolved hrefs", () => {
  for (const u of UNITS) {
    const hs = hrefs(renderHtml(wrap(<UnitPlayer unit={u} />)));
    for (const r of u.refs) assert.ok(hs.includes(resolveRef(r).href.replace(/&/g, "&amp;")), `${u.id} ${r}`);
  }
});

test("cards phase shows the first card and its glossary chip; submitted preset shows the mastery result", () => {
  const u = getUnit("l3-trailing-stop")!;
  const t = renderText(wrap(<UnitPlayer unit={u} />));
  assert.ok(t.includes(u.cards[0]!.title));
  assert.ok(!t.includes(u.cards[1]!.body));
  const qs = quizForUnit(u.id);
  const answers = Object.fromEntries(qs.map((q) => [q.id, q.correctAnswer]));
  const html = renderHtml(wrap(<UnitPlayer unit={u} preset={{ answers, submitted: true }} />));
  assert.ok(html.includes('data-mastered="true"'));
  assert.equal((html.match(/data-correct="true"/g) ?? []).length, qs.length);
  assert.ok(renderText(wrap(<UnitPlayer unit={u} preset={{ answers, submitted: true }} />)).includes(qs[0]!.explanation));
});

test("test out of a unit: card 1 offers a secondary 'take the check' action; ?check=1 opens straight on the check", async () => {
  const u = getUnit("l3-trailing-stop")!;
  const first = renderHtml(wrap(<UnitPlayer unit={u} />));
  assert.ok(first.includes('data-testid="skip-to-check"'));
  assert.ok(renderText(wrap(<UnitPlayer unit={u} />)).includes("Know this already? Take the check"));
  assert.ok(!/data-testid="skip-to-check"[^>]*bg-primary|bg-primary[^>]*data-testid="skip-to-check"/.test(first), "secondary style, not a second primary button");
  assert.ok(!renderHtml(wrap(<UnitPlayer unit={u} initialCard={1} />)).includes('data-testid="skip-to-check"'), "only on card 1");
  assert.ok(!renderHtml(wrap(<UnitPlayer unit={u} initialPhase="quiz" />)).includes('data-testid="skip-to-check"'));

  const { Route, Routes } = await import("react-router-dom");
  const { default: AcademyUnit } = await import("../../pages/academy/AcademyUnit");
  const { memoryStorage } = await import("./storage");
  const at = (path: string) => (
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/academy/:unitId" element={<AcademyUnit storage={memoryStorage()} />} />
      </Routes>
    </MemoryRouter>
  );
  const q0 = quizForUnit(u.id)[0]!.prompt;
  const checked = renderText(at(`/academy/${u.id}?check=1`));
  assert.ok(checked.includes(q0), "?check=1 shows the quiz");
  assert.ok(!checked.includes(u.cards[0]!.body), "and skips the cards");
  const normal = renderText(at(`/academy/${u.id}`));
  assert.ok(normal.includes(u.cards[0]!.body) && !normal.includes(q0), "without it the cards come first");
});

test("a check passed after testing out goes through recordUnitAttempt: mastered, level progress counts", async () => {
  const { recordUnitAttempt, unitStatus, levelPct } = await import("./progress");
  const { emptyAcademy } = await import("./storage");
  const u = getUnit("l3-trailing-stop")!;
  const n = quizForUnit(u.id).length;
  const s = recordUnitAttempt(emptyAcademy(), u.id, n, n);
  assert.equal(unitStatus(s, u.id), "mastered");
  assert.ok(levelPct(s, u.levelId) > 0);
});
