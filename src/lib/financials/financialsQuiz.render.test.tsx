import { test } from "node:test";
import assert from "node:assert/strict";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import FinancialsQuizExhibit from "../../components/financials/FinancialsQuizExhibit";
import { FINANCIALS_QUESTION_BANKS } from "./quizBanks";
import { eventById, resolveEvent } from "./earningsEvents";
import { fmtK } from "./format";

const html = (x: Parameters<typeof FinancialsQuizExhibit>[0]) =>
  renderToStaticMarkup(
    <MemoryRouter>
      <FinancialsQuizExhibit {...x} />
    </MemoryRouter>,
  );

test("every FE6 question's exhibit renders", () => {
  for (const q of Object.values(FINANCIALS_QUESTION_BANKS).flat()) {
    const out = html({ exhibit: q.financialsExhibit! });
    assert.ok(out.includes(`data-financials-exhibit="${q.financialsExhibit!.kind}"`), q.id);
    assert.ok(out.includes("does not reflect true market prices"), `${q.id} disclaimer`);
  }
});

test("reaction exhibit: full chart has 46 bars; teaching marks only after the answer", () => {
  const ex = { kind: "reaction", eventId: "hbpn-q2fy26", bars: "full" } as const;
  const before = html({ exhibit: ex });
  const after = html({ exhibit: ex, revealed: true });
  assert.ok(before.includes('data-exhibit-bars="46"'));
  assert.ok(before.includes("teaching marks appear after you answer"));
  assert.notEqual(before, after, "annotations added on reveal");
  assert.ok(html({ exhibit: { kind: "reaction", eventId: "hbpn-q2fy26", bars: "pre" } }).includes('data-exhibit-bars="30"'));
});

test("unrevealed preview exhibits don't leak the actual revenue", () => {
  for (const q of FINANCIALS_QUESTION_BANKS["earnings-preview"]) {
    const x = q.financialsExhibit!;
    if (x.kind !== "preview" || x.revealActuals) continue;
    const r = resolveEvent(eventById(x.eventId)!);
    const text = html({ exhibit: x }).replace(/<[^>]+>/g, " ");
    assert.ok(!text.includes(fmtK(r.actualRevenue)) && !text.includes(r.actualRevenue.toLocaleString("en-US")), `${q.id} leaks revenue`);
  }
});

test("forecast exhibit hides breach tint and headroom until the answer is submitted", () => {
  const ex = { kind: "forecast", forecastId: "ironbridge-debt-service", whatIf: { useRevolver: false } } as const;
  const before = html({ exhibit: ex });
  const after = html({ exhibit: ex, revealed: true });
  assert.ok(!before.includes('data-breach="1"') && !before.includes("Headroom"));
  assert.ok(after.includes('data-breach="1"') && after.includes("Headroom"));
});

test("unknown ids render nothing", () => {
  assert.equal(html({ exhibit: { kind: "forecast", forecastId: "nope" } }), "");
  assert.equal(html({ exhibit: { kind: "statement", companyId: "nope", tab: "income", start: 0, count: 1 } }), "");
});
