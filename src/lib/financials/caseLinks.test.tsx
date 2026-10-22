/** FE7.M2 cases bridge: tags + links both ways; the existing cases themselves are untouched. */
import assert from "node:assert/strict";
import { test } from "node:test";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import CasePrintLink from "../../components/financials/CasePrintLink";
import ReadThePrintGame from "../../components/financials/ReadThePrintGame";
import { EARNINGS_CASES, getCaseStudy } from "../caseStudies";
import { EARNINGS_CASE_EVENT_LINKS, LINKED_EARNINGS_CASE_IDS, casesForEvent, printLinksForCase } from "./caseLinks";
import { eventById } from "./earningsEvents";
import { PRINT_ROUNDS } from "./readThePrint";

/** Snapshot of the 12 earnings cases' ids and grading taken before FE7.M2 (2026-10-21). */
const PINNED: [string, string[], string[]][] = [
  ["case-earn-beat-miss", ["sell", "hold"], ["hold"]],
  ["case-earn-margin-compression", ["sell", "hold"], ["hold"]],
  ["case-earn-cash-flow-flag", ["sell", "hold"], ["hold"]],
  ["case-earn-guidance-cut", ["sell", "hold"], ["hold"]],
  ["case-earn-balance-stress", ["sell", "hold"], ["hold"]],
  ["case-earn-retail-beat-thin", ["sell", "hold"], ["hold"]],
  ["case-earn-bank-quiet-beat", ["hold"], ["buy", "sell"]],
  ["case-earn-int-beat-gap", ["sell", "hold"], ["hold"]],
  ["case-earn-int-margin-volume", ["sell", "hold"], ["hold"]],
  ["case-earn-int-cash-receivables", ["sell", "hold"], ["hold"]],
  ["case-earn-int-guide-cut-utility", ["sell", "hold"], ["hold"]],
  ["case-earn-int-debt-airline", ["sell", "hold"], ["hold"]],
];

test("FE7.M2: existing earnings case ids and grades are unchanged", () => {
  assert.deepEqual(EARNINGS_CASES.map((c) => [c.id, c.correctActions, c.acceptablePartial]), PINNED);
});

test("FE7.M2: every tag points at a real earnings case and a real Read the Print round", () => {
  assert.ok(Object.keys(EARNINGS_CASE_EVENT_LINKS).length >= 6);
  assert.deepEqual(LINKED_EARNINGS_CASE_IDS, Object.keys(EARNINGS_CASE_EVENT_LINKS), "only earnings cases are tagged");
  for (const [caseId, links] of Object.entries(EARNINGS_CASE_EVENT_LINKS)) {
    assert.ok(getCaseStudy(caseId), caseId);
    assert.ok(links.length >= 1);
    for (const l of links) {
      assert.ok(eventById(l.eventId), l.eventId);
      assert.ok(l.why.length > 10);
    }
    const out = printLinksForCase(caseId);
    assert.equal(out.length, links.length);
    for (const p of out) {
      assert.equal(PRINT_ROUNDS[p.round - 1]!.eventId, p.eventId, "round number points at the right round");
      assert.equal(p.href, `/practice/read-the-print?round=${p.round}`);
    }
  }
  assert.deepEqual(printLinksForCase("case-earn-cash-flow-flag"), [], "untagged case → no link");
});

test("FE7.M2: reverse lookup agrees with the forward tags", () => {
  for (const [caseId, links] of Object.entries(EARNINGS_CASE_EVENT_LINKS))
    for (const l of links) assert.ok(casesForEvent(l.eventId).some((c) => c.caseId === caseId && c.href === `/cases/${caseId}`));
  assert.deepEqual(casesForEvent("nwcl-q3fy26"), []);
});

test("FE7.M2: CasePlayer link and Read the Print reveal link render", () => {
  const m = renderToStaticMarkup(<MemoryRouter><CasePrintLink caseId="case-earn-guidance-cut" /></MemoryRouter>);
  assert.ok(m.includes('data-testid="case-print-link"') && m.includes("/practice/read-the-print?round="));
  assert.equal(renderToStaticMarkup(<MemoryRouter><CasePrintLink caseId="case-earn-cash-flow-flag" /></MemoryRouter>), "");
  const idx = PRINT_ROUNDS.findIndex((r) => r.eventId === "irbg-q1fy26");
  const reveal = renderToStaticMarkup(
    <MemoryRouter>
      <ReadThePrintGame initialRoundIndex={idx} initialPhase="reveal" initialChoice={PRINT_ROUNDS[idx]!.answer} persist={false} />
    </MemoryRouter>,
  );
  assert.ok(reveal.includes('data-testid="rtp-related-cases"') && reveal.includes("/cases/case-earn-guidance-cut"));
  const pre = renderToStaticMarkup(
    <MemoryRouter>
      <ReadThePrintGame initialRoundIndex={idx} persist={false} />
    </MemoryRouter>,
  );
  assert.ok(!pre.includes("rtp-related-cases"), "links only after the reveal");
});
