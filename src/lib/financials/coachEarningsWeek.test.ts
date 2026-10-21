import { test } from "node:test";
import assert from "node:assert/strict";
import { listSessions, loadSession, validateCoachingSession } from "../coaching";
import { earningsWeekSession, EARNINGS_WEEK_EVENT_ID } from "./coachEarningsWeek";
import { eventById, resolveEvent } from "./earningsEvents";
import { EVENT_INDEX, generateReaction } from "./reactionCharts";

const tree = earningsWeekSession.tree;

test("FE8.M2: earnings-week session is valid and in the coach catalog", () => {
  const v = validateCoachingSession(earningsWeekSession);
  assert.ok(v.ok, JSON.stringify(v.issues));
  assert.ok(listSessions().some((s) => s.slug === "earnings-week"));
  assert.ok(loadSession("earnings-week").ok);
});

test("FE8.M2: the right choice at each step walks preview → plan → print → reaction → success", () => {
  const path = ["preview", "plan", "print", "reaction", "success"];
  for (let i = 0; i < path.length - 1; i++) {
    const node = tree.nodes[path[i]!]!;
    assert.equal(node.outcome, "continue");
    assert.ok(node.choices.some((c) => c.next === path[i + 1]), `${path[i]} → ${path[i + 1]}`);
    for (const c of node.choices.filter((x) => x.next !== path[i + 1])) {
      const w = tree.nodes[c.next]!;
      assert.equal(w.outcome, "wrong", c.next);
      assert.equal(w.rewind_to, path[i], `${c.next} rewinds to ${path[i]}`);
    }
  }
  assert.equal(tree.nodes.success!.outcome, "success");
});

test("FE8.M2: numbers in the messages come from the fixture and the generated chart", () => {
  const e = eventById(EARNINGS_WEEK_EVENT_ID)!;
  const r = resolveEvent(e);
  const bar = generateReaction(e).bars[EVENT_INDEX]!;
  assert.equal(e.reaction, "guidance-reversal");
  assert.equal(r.guidance, "cut");
  assert.ok(tree.nodes.print!.message.includes(`$${r.actualEps.toFixed(2)}`));
  assert.ok(tree.nodes.print!.message.includes(`$${bar.open.toFixed(2)}`));
  assert.ok(tree.nodes.reaction!.message.includes(`$${bar.close.toFixed(2)}`));
  assert.ok(bar.close < e.priorClose, "closes below the prior close");
  // The preview step must not leak the outcome.
  const pre = tree.nodes.preview!.message + tree.nodes.plan!.message;
  for (const s of [`$${r.actualEps.toFixed(2)}`, r.actualRevenue.toLocaleString("en-US"), e.newGuidance.low.toLocaleString("en-US")]) assert.ok(!pre.includes(s), `preview leaks ${s}`);
  assert.ok(!/NaN|undefined/.test(Object.values(tree.nodes).map((n) => n.message).join()));
});
