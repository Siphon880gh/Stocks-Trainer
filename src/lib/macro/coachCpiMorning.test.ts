import { test } from "node:test";
import assert from "node:assert/strict";
import { validateCoachingSession } from "../coaching/validate";
import { listSessions, loadSession } from "../coaching";
import { cpiMorningSession, CPI_MORNING_EVENT_ID } from "./coachCpiMorning";
import { getRelease } from "./releases";
import { reactionForEvent } from "./reactions";
import { intradayChart } from "./reactionCharts";

const tree = cpiMorningSession.tree;
const fmt = (n: number) => `${n < 0 ? "−" : "+"}${Math.abs(n).toFixed(1)}%`;

test("MF9.M1: cpi-morning session is valid and in the coach catalog", () => {
  const v = validateCoachingSession(cpiMorningSession);
  assert.ok(v.ok, JSON.stringify(v.issues));
  assert.ok(listSessions().some((s) => s.slug === "cpi-morning"));
  assert.ok(loadSession("cpi-morning").ok);
});

test("MF9.M1: numbers in the tree match the SIMULATED release and reaction charts", () => {
  const e = getRelease(CPI_MORNING_EVENT_ID)!;
  const core = e.details.find((m) => m.key === "core")!;
  const print = tree.nodes.print!.message;
  assert.ok(print.includes(fmt(e.headline.actual)) && print.includes(fmt(core.actual)) && print.includes(fmt(core.consensus)));
  // headline hot, core cool: the read is the detail's, and yields fall.
  assert.equal(e.headline.label, "hot");
  assert.equal(core.label, "cool");
  assert.equal(e.effectiveLabel, "cool");
  const rx = reactionForEvent(e);
  assert.equal(rx.moves.us2y, "down");
  assert.equal(rx.moves["growth-tech"], "up");
  const y2 = intradayChart(e, "us2y");
  assert.ok(tree.nodes.stock!.message.includes(`−${Math.round(Math.abs(y2.net) * 100)} bp`));
  const t = intradayChart(e, "growth-tech");
  assert.ok(t.net > 0 && tree.nodes.stock!.message.includes(fmt((t.net / t.preClose) * 100)));
  assert.match(tree.nodes.preview!.message, /SIMULATED/);
  assert.doesNotMatch(JSON.stringify(tree), /NaN|undefined/);
});
