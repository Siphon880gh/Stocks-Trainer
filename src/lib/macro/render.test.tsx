import { test } from "node:test";
import assert from "node:assert/strict";
import SimulatedFrame from "../../components/macro/SimulatedFrame";
import { hrefs, renderHtml, renderText } from "./renderHarness";
import { getMacroSource } from "./sources";

test("SimulatedFrame shows the SIMULATED banner and the verified real-source link", () => {
  const el = (
    <SimulatedFrame sourceId="bls-empsit" title="Employment Situation (simulated)" period="SIM Y1 · Apr">
      <p>body</p>
    </SimulatedFrame>
  );
  const html = renderHtml(el);
  const text = renderText(el);
  assert.match(text, /SIMULATED/);
  assert.match(text, /not trading advice/);
  assert.ok(hrefs(html).includes(getMacroSource("bls-empsit")!.url));
  assert.match(html, /rel="noopener noreferrer"/);
  assert.match(html, /data-simulated="true"/);
});

import { ClaimsViewer, EmploymentSituationViewer, JoltsViewer } from "../../components/macro/viewers/LaborViewers";
import { RELEASES } from "./releases";
import { WORLD } from "./world";

const num = (n: number) => Math.round(n).toLocaleString("en-US");
const signed = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("en-US")}`;

test("labor viewers show the event's numbers", () => {
  for (const e of RELEASES.filter((r) => r.kind === "payrolls")) {
    const t = renderText(<EmploymentSituationViewer month={e.month} />);
    assert.ok(t.includes(signed(e.headline.actual)), `${e.id} headline`);
    assert.ok(t.includes(WORLD.months[e.month]!.household.unemploymentRate.toFixed(1)), `${e.id} UR`);
    for (const r of e.revisions ?? []) assert.ok(t.includes(signed(r.to)), `${e.id} revision ${r.label}`);
  }
  for (const e of RELEASES.filter((r) => r.kind === "claims")) {
    const t = renderText(<ClaimsViewer week={e.week!} />);
    assert.ok(t.includes(num(e.headline.actual)), e.id);
  }
  for (const e of RELEASES.filter((r) => r.kind === "jolts")) {
    const t = renderText(<JoltsViewer month={e.month} />);
    assert.ok(t.includes(num(e.headline.actual)), e.id);
  }
});

import { CpiViewer, PceViewer, PpiViewer } from "../../components/macro/viewers/PriceViewers";

test("price viewers show headline and core prints", () => {
  const cases = [
    ["cpi", (m: number) => <CpiViewer month={m} />],
    ["ppi", (m: number) => <PpiViewer month={m} />],
    ["pce", (m: number) => <PceViewer month={m} />],
  ] as const;
  for (const [kind, f] of cases) {
    for (const e of RELEASES.filter((r) => r.kind === kind)) {
      const t = renderText(f(e.month));
      assert.ok(t.includes(`${e.headline.actual.toFixed(1)} percent`), `${e.id} headline ${e.headline.actual}`);
      for (const d of e.details) assert.ok(t.includes(d.actual.toFixed(1)), `${e.id} ${d.key}`);
    }
  }
});

import { DotPlotViewer, FomcStatementViewer, FredSeriesViewer, TreasuryCurveViewer } from "../../components/macro/viewers/RatesViewers";
import { MACRO_SOURCES } from "./sources";
import { curveRow, fredSeriesData } from "./viewData";
import { dotsFor } from "./fed";

test("FRED-style viewers render every registry series with its latest value and real-source link", () => {
  for (const s of MACRO_SOURCES.filter((x) => x.fredSeries)) {
    const el = <FredSeriesViewer seriesId={s.fredSeries!} end={30} />;
    const html = renderHtml(el);
    const t = renderText(el);
    assert.ok(t.includes(s.fredSeries!), s.id);
    assert.ok(hrefs(html).includes(s.url), s.id);
    const last = fredSeriesData(s.fredSeries!, 30).points.at(-1)!;
    assert.ok(t.includes(last.label), `${s.id} latest label`);
  }
});

test("curve, statement and dot plot viewers", () => {
  const t = renderText(<TreasuryCurveViewer day={300} />);
  const r = curveRow(300);
  assert.ok(t.includes(r.values[4]!.toFixed(2)) && t.includes(r.values[6]!.toFixed(2)));
  for (const m of WORLD.meetings) {
    const st = renderText(<FomcStatementViewer month={m.month} />);
    assert.match(st, /target range/);
    assert.ok(st.includes(m.decisionBp === 0 ? "maintain" : Math.abs(m.decisionBp) + " basis points"), m.label);
    if (m.sep) {
      const dp = renderHtml(<DotPlotViewer month={m.month} />);
      assert.equal((dp.match(/<circle/g) ?? []).length, 19 * 4, m.label);
      for (const c of dotsFor(m)!) assert.ok(dp.includes(c.median.toFixed(3)));
    }
  }
});

import { HousingStartsViewer, PmmsViewer } from "../../components/macro/viewers/HousingViewers";
import { GdpViewer, IsmViewer, RetailSalesViewer, SentimentViewer } from "../../components/macro/viewers/ActivityViewers";

test("housing and activity viewers show the event's headline", () => {
  for (const e of RELEASES) {
    let el;
    if (e.kind === "pmms") el = <PmmsViewer week={e.week!} />;
    else if (e.kind === "housing-starts") el = <HousingStartsViewer month={e.month} />;
    else if (e.kind === "gdp") el = <GdpViewer quarter={e.quarter!} />;
    else if (e.kind === "retail") el = <RetailSalesViewer month={e.month} />;
    else if (e.kind === "ism-mfg") el = <IsmViewer month={e.month} kind="mfg" />;
    else if (e.kind === "ism-services") el = <IsmViewer month={e.month} kind="services" />;
    else if (e.kind === "sentiment") el = <SentimentViewer month={e.month} />;
    else continue;
    const t = renderText(el);
    const a = e.headline.actual;
    const want =
      e.kind === "pmms" ? `${a.toFixed(2)}%`
      : e.kind === "housing-starts" ? `${num(a)},000`
      : e.kind === "retail" ? `${a > 0 ? "+" : a < 0 ? "−" : ""}${Math.abs(a).toFixed(1)} percent`
      : a.toFixed(1);
    assert.ok(t.includes(want), `${e.id} ${want}`);
  }
});

import ViewerForEvent from "../../components/macro/viewers/ViewerForEvent";
import { getMacroSource as srcOf } from "./sources";

test("every release event renders a SIMULATED viewer that links its real source", () => {
  for (const e of RELEASES) {
    const html = renderHtml(<ViewerForEvent event={e} />);
    assert.match(html, /data-simulated="true"/, e.id);
    assert.ok(hrefs(html).includes(srcOf(e.sourceId)!.url), `${e.id} → ${e.sourceId}`);
    assert.doesNotMatch(html, /NaN|undefined|Infinity/, e.id);
  }
});

test("statement shows the implementation-note rates from the meeting", () => {
  for (const m of WORLD.meetings) {
    const st = renderText(<FomcStatementViewer month={m.month} />);
    assert.ok(st.includes((m.upper - 0.1).toFixed(2)) && st.includes(m.effective.toFixed(2)), m.label);
  }
});
