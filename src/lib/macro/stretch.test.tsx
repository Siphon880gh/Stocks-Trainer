import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MemoryRouter } from "react-router-dom";
import { renderHtml } from "./renderHarness";
import { curveShape, explore, monthlyPayment, spreadBp } from "./curveExplorer";
import CurveExplorer from "../../components/macro/CurveExplorer";
import MacroHomeTip from "../../components/macro/MacroHomeTip";
import { macroHomeTip } from "./homeTip";
import { MACRO_ROUNDS } from "./game";
import { getLesson } from "./lessons";
import { WORLD } from "./world";

test("MF9.M2: explorer math", () => {
  assert.equal(spreadBp(4.5, 4.2), -30);
  assert.equal(spreadBp(3.0, 4.6), 160);
  assert.equal(curveShape(-1), "inverted");
  assert.equal(curveShape(0), "flat");
  assert.equal(curveShape(24), "flat");
  assert.equal(curveShape(25), "normal");
  assert.equal(curveShape(150), "normal");
  assert.equal(curveShape(151), "steep");
  // Standard amortisation: $400k at 6% for 30y ≈ $2,398.20/mo; 0% = straight line.
  assert.equal(Math.round(monthlyPayment(400_000, 6) * 100) / 100, 2398.2);
  assert.equal(monthlyPayment(360_000, 0), 1000);
  const r = explore(4.5, 4.2, 2.0);
  assert.deepEqual(r, { spreadBp: -30, shape: "inverted", mortgage30: 6.2, payment: Math.round(monthlyPayment(400_000, 6.2)) });
  // Same identity the SIMULATED world uses: mortgage ≈ 10y weekly average + spread.
  const w = WORLD.weeks[40]!;
  assert.equal(explore(4, w.avg10y, Math.round((w.mortgage30 - w.avg10y) * 100) / 100).mortgage30, w.mortgage30);
});

test("MF9.M2: explorer renders spread, shape, mortgage; mounted on hub + curve lesson", () => {
  const html = renderHtml(<CurveExplorer initial={{ y2: 4.5, y10: 4.2, mortgageSpread: 2 }} />);
  assert.match(html, /−30 bp/);
  assert.match(html, /Inverted/);
  assert.match(html, /6\.20%/);
  assert.match(html, /not a forecast/);
  assert.match(renderHtml(<CurveExplorer initial={{ y2: 3, y10: 4.6 }} />), /\+160 bp[\s\S]*Steep/);
  assert.match(readFileSync("src/pages/macro/MacroDesk.tsx", "utf8"), /<CurveExplorer \/>/);
  assert.match(readFileSync("src/pages/macro/MacroLesson.tsx", "utf8"), /"treasury-curve" && <CurveExplorer/);
  assert.ok(getLesson("treasury-curve"));
});

test("MF9.M3: Home tip names an existing route in every state", () => {
  const app = readFileSync("src/App.tsx", "utf8");
  const routeOk = (to: string) => {
    const path = to.split("?")[0]!;
    if (path === "/training") return /path="training"|path="\/training"/.test(app);
    if (path === "/macro/play") return /macro\/play/.test(app);
    if (path.startsWith("/macro/")) return /macro\/:lessonId/.test(app) && !!getLesson(path.slice(7));
    return app.includes(path);
  };
  const at = "2026-10-21T00:00:00.000Z";
  const none = macroHomeTip({ rounds: {} });
  const some = macroHomeTip({ rounds: { [MACRO_ROUNDS[0]!.id]: { best: 3, total: 4, at } } });
  const all = macroHomeTip({ rounds: Object.fromEntries(MACRO_ROUNDS.map((r) => [r.id, { best: 2, total: 4, at }])) });
  assert.match(none.text, /Macro Desk/);
  assert.equal(none.to, "/macro/employment-situation");
  assert.equal(some.to, `/macro/play?round=${MACRO_ROUNDS[1]!.id}`);
  assert.match(some.text, /1\/29/);
  assert.equal(all.to, "/training?group=macro-reactions&start=1");
  for (const t of [none, some, all]) assert.ok(routeOk(t.to), t.to);
  const html = renderHtml(
    <MemoryRouter>
      <MacroHomeTip progress={{ rounds: {} }} />
    </MemoryRouter>,
  );
  assert.match(html, /href="\/macro\/employment-situation"/);
  assert.match(readFileSync("src/pages/Dashboard.tsx", "utf8"), /<MacroHomeTip \/>/);
});
