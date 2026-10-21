import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import BalanceSheetTable from "../../components/financials/BalanceSheetTable";
import CashFlowTable from "../../components/financials/CashFlowTable";
import IncomeStatementTable from "../../components/financials/IncomeStatementTable";
import StatementReader from "../../components/financials/StatementReader";
import { allRowTermIds } from "../../components/financials/rows";
import { getLiteracyTerm } from "../literacyTerms";
import { COMPANIES, companyById } from "./companies";
import { fmtK } from "./format";

const html = (el: ReactElement) => renderToStaticMarkup(<MemoryRouter>{el}</MemoryRouter>);
/** Text of the cells in the row whose data-row attribute equals label. */
function rowCells(markup: string, label: string): string[] {
  const start = markup.indexOf(`data-row="${label}"`);
  assert.ok(start >= 0, `row ${label} missing`);
  const end = markup.indexOf("</tr>", start);
  const row = markup.slice(start, end);
  return [...row.matchAll(/<td[^>]*class="text-right[^"]*"[^>]*>([^<]*)<\/td>/g)].map((m) => m[1]);
}

describe("FE1 statement tables render", () => {
  const nw = companyById("northwind-cloud")!;

  it("IncomeStatementTable: columns, key lines, parentheses for losses", () => {
    const m = html(<IncomeStatementTable company={nw} />);
    for (const q of nw.quarters) assert.ok(m.includes(q.label));
    for (const label of ["Revenue", "Gross profit", "Operating income", "Net income", "Diluted EPS"]) assert.ok(m.includes(label), label);
    assert.deepEqual(rowCells(m, "Revenue"), nw.quarters.map((q) => fmtK(q.income.revenue)));
    assert.ok(rowCells(m, "Operating income").every((c) => c.startsWith("(")), "NWCL operating losses in parentheses");
    assert.ok(m.includes("$ thousands"));
  });

  it("IncomeStatementTable hides R&D for companies without it", () => {
    assert.ok(!html(<IncomeStatementTable company={companyById("harbor-pine")!} />).includes("Research &amp; development"));
    assert.ok(html(<IncomeStatementTable company={nw} />).includes("Research &amp; development"));
  });

  for (const c of COMPANIES) {
    it(`${c.id}: BalanceSheetTable check row is 0 and green every quarter`, () => {
      const m = html(<BalanceSheetTable company={c} />);
      const cells = rowCells(m, "Check: assets − (liabilities + equity)");
      assert.equal(cells.length, c.quarters.length);
      assert.ok(cells.every((x) => x === "0"));
      const row = m.slice(m.indexOf('data-row="Check: assets'), m.indexOf("</tr>", m.indexOf('data-row="Check: assets')));
      assert.equal((row.match(/text-up/g) ?? []).length, c.quarters.length);
      assert.ok(!row.includes("text-accent-red"));
    });

    it(`${c.id}: CashFlowTable bridge ends at balance-sheet cash`, () => {
      const m = html(<CashFlowTable company={c} />);
      assert.deepEqual(rowCells(m, "Ending cash"), c.quarters.map((q) => fmtK(q.balance.cash)));
      assert.ok(rowCells(m, "Check: ending cash − balance sheet cash").every((x) => x === "0"));
    });

    it(`${c.id}: every glossary link resolves`, () => {
      for (const id of allRowTermIds(c)) assert.ok(getLiteracyTerm(id), `unknown term ${id}`);
    });
  }

  it("start/count window and highlight column", () => {
    const m = html(<IncomeStatementTable company={nw} start={4} count={4} highlightColumn={3} />);
    assert.ok(!m.includes("Q1 FY25") && m.includes("Q4 FY26"));
    assert.ok(m.includes("bg-primary/10"));
  });
});

describe("FE1.M3 StatementReader", () => {
  it("renders company picker, tabs, latest four quarters and the disclaimer", () => {
    const m = html(<StatementReader />);
    for (const c of COMPANIES) assert.ok(m.includes(c.ticker));
    for (const t of ["Income", "Balance sheet", "Cash flow", "Metrics &amp; KPIs", "What the numbers say"]) assert.ok(m.includes(t), t);
    assert.ok(m.includes("Q4 FY26") && !m.includes("Q4 FY25"), "latest four quarters by default");
    assert.match(m, /SAMPLE \/ STYLIZED/);
    assert.ok(m.includes('href="/archive?tab=literacy&amp;open=gross-margin"'));
  });

  it("metrics tab shows n/m for undefined ratios and KPIs", () => {
    const m = html(<StatementReader initialCompanyId="ironbridge-industrial" initialTab="metrics" initialLatestFour={false} />);
    assert.ok(m.includes("Net leverage"));
    assert.ok(m.includes("n/m"), "Q1 has no prior period");
    assert.ok(m.includes("Backlog"));
  });

  it("story tab lists the company story", () => {
    const c = companyById("harbor-pine")!;
    const m = html(<StatementReader initialCompanyId={c.id} initialTab="story" />);
    for (const s of c.story) assert.ok(m.includes(s.replace(/&/g, "&amp;")), s);
  });
});

describe("FE2.M3 CashForecastTable + panel", () => {
  it("level-1 replica: only source rows, bold net, week 9 = (5), callout pinned, adjustment note shown, no covenant rows", async () => {
    const { computeForecast } = await import("./cashForecast");
    const { LEVEL1_REPLICA } = await import("./cashForecastFixtures");
    const { default: CashForecastTable } = await import("../../components/financials/CashForecastTable");
    const m = html(<CashForecastTable result={computeForecast(LEVEL1_REPLICA)} />);
    for (const l of ["Cash in", "Inventory", "Ad spend", "Opex", "Net cash flow", "Ending cash"]) assert.ok(m.includes(`data-row="${l}"`), l);
    assert.ok(!m.includes("Total receipts") && !m.includes("Payroll") && !m.includes("Headroom"));
    const net = rowCells(m, "Net cash flow");
    assert.equal(net.length, 13);
    assert.equal(net[8], "(5)");
    assert.ok(net.every((c, i) => i === 8 || c === "10"));
    assert.ok(m.includes("📌 Wk 9"));
    assert.ok(m.includes('data-testid="forecast-callout"'));
    assert.ok(m.includes("week 9 inventory is 10k"));
  });

  it("Ironbridge without the revolver: breach cells tinted only in week 7", async () => {
    const { applyWhatIf, computeForecast } = await import("./cashForecast");
    const { IRONBRIDGE_DEBT_SERVICE } = await import("./cashForecastFixtures");
    const { default: CashForecastTable } = await import("../../components/financials/CashForecastTable");
    const m = html(<CashForecastTable result={computeForecast(applyWhatIf(IRONBRIDGE_DEBT_SERVICE, { useRevolver: false }))} />);
    assert.equal((m.match(/data-breach="1"/g) ?? []).length, 2, "ending + headroom cells in one week");
    const head = rowCells(m, "Headroom (ending − minimum)");
    assert.ok(head[6]!.startsWith("("));
    assert.ok(m.includes("Covenant minimum cash"));
    const withLine = html(<CashForecastTable result={computeForecast(IRONBRIDGE_DEBT_SERVICE)} />);
    assert.ok(!withLine.includes('data-breach="1"'));
    assert.ok(withLine.includes('data-row="Revolver draw"'));
  });

  it("panel renders picker, story, summary chips and what-if toggles", async () => {
    const { default: CashForecastPanel } = await import("../../components/financials/CashForecastPanel");
    const m = html(<CashForecastPanel initialId="northwind-runway" />);
    assert.ok(m.includes("Below minimum in week 12"));
    assert.ok(m.includes("customers pay one week later"));
    assert.ok(!m.includes("use the revolver"), "no revolver toggle without a line");
    assert.match(m, /SAMPLE \/ STYLIZED/);
    const h = html(<CashForecastPanel initialId="harbor-collections-slip" initialWhatIf={{ useRevolver: false }} />);
    assert.ok(h.includes("Below minimum in week 7"));
    assert.ok(h.includes("use the revolver"));
  });
});

describe("FE3.M2 EarningsPreviewCard: no leaks before reveal", async () => {
  const { EARNINGS_EVENTS, resolveEvent } = await import("./earningsEvents");
  const { default: EarningsPreviewCard } = await import("../../components/financials/EarningsPreviewCard");
  const { fmtEps } = await import("./format");
  for (const e of EARNINGS_EVENTS) {
    it(`${e.id}: pre-reveal hides actuals, headline, new guidance and the reaction; post-reveal shows them`, () => {
      const r = resolveEvent(e);
      const pre = html(<EarningsPreviewCard event={e} />);
      const post = html(<EarningsPreviewCard event={e} revealActuals />);
      const esc = (s: string) => s.replace(/&/g, "&amp;");
      if (r.actualEps !== e.expect.consensusEps && r.actualEps !== e.expect.whisperEps) assert.ok(!pre.includes(fmtEps(r.actualEps)), "actual EPS leaked");
      assert.ok(!pre.includes(fmtK(r.actualRevenue)), "actual revenue leaked");
      assert.ok(!pre.includes(esc(e.headline)), "headline leaked");
      assert.ok(!pre.includes(fmtK(e.newGuidance.low)) && !pre.includes(fmtK(e.newGuidance.high)), "new guidance leaked");
      const preText = pre.replace(/<[^>]+>/g, " ");
      assert.ok(!preText.includes(e.reaction) && !pre.includes(esc(e.whatMattered)), "reaction or explanation leaked");
      for (const t of ["actual-eps", "actual-revenue", "new-guidance", "kpi-actual", "preview-headline"]) assert.ok(!pre.includes(t), t);
      assert.ok(!/>(beat|miss|in-line|raise|cut)</i.test(pre), "outcome chip leaked");
      assert.ok(pre.includes(fmtEps(e.expect.consensusEps)) && pre.includes(`±${e.expect.impliedMovePct}%`));
      assert.ok(post.includes(fmtEps(r.actualEps)) && post.includes(fmtK(r.actualRevenue)));
      assert.ok(post.includes(`>${r.eps}<`) && post.includes(`>${r.guidance}<`));
      assert.ok(post.includes(esc(e.headline)));
    });
  }
});

describe("FE4.M1 CandlestickChart: volume pane + event lines are opt-in and backward compatible", async () => {
  const { readFileSync } = await import("node:fs");
  const { snapshotHashes } = await import("./chartSnapshotCases");
  const { default: CandlestickChart, VOLUME_PANE_HEIGHT } = await import("../../components/CandlestickChart");
  const { generateReaction } = await import("./reactionCharts");
  const { eventById } = await import("./earningsEvents");

  it("existing charts render byte-identically to the pre-change baseline", () => {
    const baseline = JSON.parse(readFileSync(new URL("./__snapshots__/candlestick-baseline.json", import.meta.url), "utf8")) as Record<string, string>;
    assert.ok(Object.keys(baseline).length >= 3);
    assert.deepEqual(snapshotHashes(), baseline);
  });

  const rc = generateReaction(eventById("nwcl-q2fy25")!);
  const svgHeight = (m: string) => Number(/<svg[^>]*height="([\d.]+)"/.exec(m)![1]);

  it("showVolume adds a pane of VOLUME_PANE_HEIGHT with one bar per bar", () => {
    const off = renderToStaticMarkup(<CandlestickChart data={rc.bars} height={300} />);
    const on = renderToStaticMarkup(<CandlestickChart data={rc.bars} height={300} showVolume />);
    assert.equal(svgHeight(on) - svgHeight(off), VOLUME_PANE_HEIGHT);
    assert.equal((on.match(/fill-opacity="0.45"/g) ?? []).length, rc.bars.length);
    assert.ok(on.includes('aria-label="Volume"') && !off.includes('aria-label="Volume"'));
  });

  it("showVolume is ignored when compact or when no bar has volume", () => {
    const stripped = rc.bars.map(({ volume: _v, ...b }) => b);
    assert.equal(
      renderToStaticMarkup(<CandlestickChart data={stripped} showVolume />),
      renderToStaticMarkup(<CandlestickChart data={stripped} />),
    );
    assert.ok(!renderToStaticMarkup(<CandlestickChart data={rc.bars} compact showVolume />).includes('aria-label="Volume"'));
  });

  it("annotations.events draws a labelled vertical line without changing the price scale", () => {
    const plain = renderToStaticMarkup(<CandlestickChart data={rc.bars} />);
    const withEvent = renderToStaticMarkup(<CandlestickChart data={rc.bars} annotations={{ events: [{ index: 30, label: "Report" }] }} />);
    assert.ok(withEvent.includes(">Report<") && withEvent.includes('stroke-dasharray="3 3"'));
    const axis = (m: string) => [...m.matchAll(/text-anchor="start" dominant-baseline="middle">([^<]+)</g)].map((x) => x[1]).join(",");
    assert.equal(axis(withEvent), axis(plain), "price axis unchanged");
  });
});

describe("FE5.M2 Read the Print game phases + no-leak", async () => {
  const { default: ReadThePrintGame } = await import("../../components/financials/ReadThePrintGame");
  const { PRINT_ROUNDS, PRINT_OPTIONS } = await import("./readThePrint");
  const { eventById, resolveEvent } = await import("./earningsEvents");
  const { fmtEps } = await import("./format");

  PRINT_ROUNDS.forEach((round, i) => {
    it(`${round.id}: read + answer phases show only pre-report data`, () => {
      const e = eventById(round.eventId)!;
      const r = resolveEvent(e);
      for (const phase of ["read", "answer"] as const) {
        const m = html(<ReadThePrintGame initialRoundIndex={i} initialPhase={phase} persist={false} />);
        assert.ok(m.includes(`data-phase="${phase}"`));
        assert.ok(m.includes('data-bars="30"'), "only the 30 pre-report bars");
        assert.ok(!/>T\+\d+</.test(m) && !m.includes(">Report<"), "no post-report bar labels");
        const statements = m.slice(m.indexOf('data-testid="prior-quarters"'));
        assert.ok(!statements.includes(`>${r.quarter.label}<`), "reported quarter column not shown");
        if (r.actualEps !== e.expect.consensusEps && r.actualEps !== e.expect.whisperEps)
          assert.ok(!m.includes(fmtEps(r.actualEps)) || r.history.some((q) => q.income.epsDiluted === r.actualEps), "actual EPS leaked");
        assert.ok(!m.includes(fmtK(r.actualRevenue)), "actual revenue leaked");
        assert.ok(!m.includes(e.headline.replace(/&/g, "&amp;")) && !m.includes("What mattered"), "explanation leaked");
        assert.ok(!m.includes('data-testid="rtp-reveal"') && !m.includes('data-testid="rtp-answer"'));
        assert.ok(!m.includes("Gap filled") && !m.includes("Prior close"), "reveal annotations leaked");
        if (phase === "answer") for (const o of PRINT_OPTIONS) assert.ok(m.includes(o.label.replace(/&/g, "&amp;")), o.label);
      }
    });
  });

  it("reveal phase shows the answer, explanation, facts, full chart with volume and annotations", () => {
    const i = PRINT_ROUNDS.findIndex((r) => r.answer === "D");
    const round = PRINT_ROUNDS[i]!;
    const wrong = PRINT_OPTIONS.find((o) => o.id !== round.answer)!;
    const m = html(<ReadThePrintGame initialRoundIndex={i} initialPhase="reveal" initialChoice={wrong.id} initialFollow="against" persist={false} />);
    assert.ok(m.includes('data-testid="rtp-reveal"'));
    assert.ok(m.includes('data-bars="46"'));
    assert.ok(m.includes('aria-label="Volume"') && m.includes(">Report<") && m.includes("Gap filled"));
    assert.ok(m.includes("What mattered"));
    for (const f of round.facts) assert.ok(m.includes(f.replace(/&/g, "&amp;")), f);
    assert.ok(m.includes(`Why not “${wrong.label.replace(/&/g, "&amp;")}”?`));
    assert.match(m, /SAMPLE \/ STYLIZED/);
  });

  it("follow phase asks the bonus question", () => {
    const m = html(<ReadThePrintGame initialRoundIndex={0} initialPhase="follow" initialChoice="A" persist={false} />);
    assert.ok(m.includes('data-testid="rtp-follow"') && m.includes("Drift WITH the gap") && m.includes("Skip bonus"));
    assert.ok(m.includes('data-bars="30"'));
  });
});
