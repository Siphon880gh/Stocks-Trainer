/**
 * BA10.M5: charter §7.3 content floors, each counted here from the live data / engine.
 * The PROGRESS.md floor audit table is copied from the FLOORS line this test prints.
 */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { LEVELS, UNITS } from "./content/levels";
import { quizForUnit } from "./content/unitQuizzes";
import { resolveRef } from "./refs";
import { PLACEMENT_ITEMS, routePlacement, PLACEMENT_LEVELS } from "./placement";
import type { AnswerLetter } from "./types";
import { createAccount, applyFill } from "./paper/account";
import { contextFrom, placeOrder, stepBar } from "./paper/engine";
import type { AccountState, OrderSpec, OrderType, PaperBar, Side, TimeInForce } from "./paper/types";
import { CHALLENGES } from "./challenges";
import { BADGES, earnedBadgeIds } from "./rewards/badges";
import { emptyAcademy, emptyPaper, emptyRewards } from "./storage";
import { award } from "./rewards/ledger";
import { addDays } from "./rewards/streak";
import { LADDER_LEVELS, strategiesForLevel } from "./options/ladder";
import { checksForLevel } from "./options/checks";
import { summarize } from "./options/payoff";
import { ACADEMY_TERMS } from "./terms";
import { ACADEMY_QUESTION_BANKS } from "./quiz/banks";

const counts: Record<string, string> = {};

test("levels, courses and units: ≥ 8 levels, ≥ 40 units, 3–6 cards, 3–5 quiz items, ≥ 1 resolved link", () => {
  const courses = LEVELS.flatMap((l) => l.courses);
  assert.ok(LEVELS.length >= 8);
  assert.ok(UNITS.length >= 40);
  for (const u of UNITS) {
    assert.ok(u.cards.length >= 3 && u.cards.length <= 6, u.id);
    const q = quizForUnit(u.id).length;
    assert.ok(q >= 3 && q <= 5, `${u.id} quiz ${q}`);
    assert.ok(u.refs.filter((r) => resolveRef(r).ok).length >= 1, u.id);
  }
  counts.levels = `${LEVELS.length} levels · ${courses.length} courses · ${UNITS.length} units`;
});

test("placement: 10–12 items routing to ≥ 4 distinct start levels", () => {
  assert.ok(PLACEMENT_ITEMS.length >= 10 && PLACEMENT_ITEMS.length <= 12);
  const starts = new Set<string>();
  for (let k = 0; k <= PLACEMENT_LEVELS.length; k++) {
    const pass = new Set(PLACEMENT_LEVELS.slice(0, k));
    const answers: Record<string, AnswerLetter> = {};
    for (const i of PLACEMENT_ITEMS) answers[i.id] = pass.has(i.levelId) ? i.correctAnswer : i.correctAnswer === "A" ? "B" : "A";
    starts.add(routePlacement(answers).startLevel);
  }
  assert.ok(starts.size >= 4, [...starts].join(","));
  counts.placement = `${PLACEMENT_ITEMS.length} items · ${starts.size} start levels (${[...starts].join(", ")})`;
});

// One account per case: last close $50.00; bar 1 does not reach any working price, bar 2 does.
const SYM = "FLOOR.S";
const b = (o: number, h: number, l: number, c: number): PaperBar => ({ open: o * 100, high: h * 100, low: l * 100, close: c * 100 });
const BAR1 = b(50, 50.5, 49.6, 50);
const BAR2 = b(49.6, 51.2, 48.8, 50);
const PRICES: Record<OrderType, Record<Side, Partial<OrderSpec>>> = {
  market: { buy: {}, sell: {} },
  limit: { buy: { limitPrice: 4900 }, sell: { limitPrice: 5100 } },
  stop: { buy: { stopPrice: 5100 }, sell: { stopPrice: 4900 } },
  "stop-limit": { buy: { stopPrice: 5100, limitPrice: 5150 }, sell: { stopPrice: 4900, limitPrice: 4850 } },
  "trailing-stop": { buy: { trailPercent: 2 }, sell: { trailPercent: 2 } },
};
function run(type: OrderType, side: Side, tif: TimeInForce) {
  let s: AccountState = createAccount(1_000_000, { [SYM]: 5000 }, 0);
  s = applyFill(s, { orderId: "seed", bar: 0, symbol: SYM, side: "buy", qty: 10, price: 5000 }).state;
  const p = placeOrder(s, { symbol: SYM, side, type, qty: 10, tif, ...PRICES[type][side] } as OrderSpec, contextFrom(s));
  if (!p.validation.ok) return { rejected: p.validation.errors.map((e) => e.code), after1: "rejected", after2: "rejected" };
  s = stepBar(p.state, { [SYM]: BAR1 });
  const after1 = s.orders.find((o) => o.id === p.order.id)!.status;
  s = stepBar(s, { [SYM]: BAR2 });
  const after2 = s.orders.find((o) => o.id === p.order.id)!.status;
  return { rejected: [] as string[], after1, after2 };
}

test("paper engine: 5 order types × buy/sell × Day/GTC (20 cases)", () => {
  let n = 0;
  const types: OrderType[] = ["market", "limit", "stop", "stop-limit", "trailing-stop"];
  for (const type of types)
    for (const side of ["buy", "sell"] as Side[])
      for (const tif of ["day", "gtc"] as TimeInForce[]) {
        const r = run(type, side, tif);
        n++;
        const where = `${type} ${side} ${tif}`;
        if (type === "trailing-stop" && side === "buy") {
          assert.deepEqual(r.rejected, ["TRAIL_BUY_NOT_SUPPORTED"], where); // EPICS BA4: sell-side in v1, buy-side mirror is stretch
          continue;
        }
        if (type === "market") {
          assert.equal(r.after1, "filled", where);
          continue;
        }
        if (tif === "day") assert.equal(r.after1, "expired", where);
        else {
          assert.equal(r.after1, "working", where);
          assert.equal(r.after2, "filled", where);
        }
      }
  assert.equal(n, 20);
  const src = readFileSync(new URL("./paper/validate.test.ts", import.meta.url), "utf8");
  const cases = (src.slice(src.indexOf("const CASES"), src.indexOf("];", src.indexOf("const CASES"))).match(/^\s*\["/gm) ?? []).length;
  assert.ok(cases >= 30, `${cases} validation cases`);
  counts.engine = `20/20 type × side × TIF cases (buy trailing stop = documented rejection) · ${cases} validation cases`;
});

test("≥ 10 challenges across ≥ 4 themes", () => {
  const themes = new Set(CHALLENGES.map((c) => c.theme));
  assert.ok(CHALLENGES.length >= 10 && themes.size >= 4);
  counts.challenges = `${CHALLENGES.length} challenges · ${themes.size} themes`;
});

test("≥ 20 badges, all reachable by a scripted learner", () => {
  const NOW = new Date("2026-10-21T19:00:00Z");
  const academy = emptyAcademy();
  for (const u of UNITS) academy.units[u.id] = { best: 3, total: 3, attempts: 1, lastAt: NOW.toISOString(), masteredAt: NOW.toISOString() };
  academy.testedOut.L5 = { at: NOW.toISOString(), correct: 7, total: 7 };
  academy.placement = { startLevel: "L2", correct: 8, total: 12, skipped: false, at: NOW.toISOString() };
  for (const l of ["1", "2", "3", "4"]) academy.options.passed[l] = NOW.toISOString();
  for (let i = 0; i < 7; i++) academy.daily[addDays("2026-10-01", i)] = { questionId: `q${i}`, correct: true };
  const paper = emptyPaper();
  paper.stats = { orders: 12, limitFills: 2, trailingExits: 1, stopProtectedTrades: 5, stopLimitNoFills: 1 };
  for (const c of CHALLENGES) paper.challengeAttempts[c.id] = [{ score: 100, max: 100, passed: true, at: NOW.toISOString() }];
  let rewards = emptyRewards();
  rewards = award(rewards, "bulk", "unit-mastered", 600, NOW).state;
  rewards.streak.days = Array.from({ length: 8 }, (_, i) => addDays("2026-10-14", i));
  const earned = earnedBadgeIds({ academy, paper, rewards }, NOW);
  assert.ok(BADGES.length >= 20);
  for (const bd of BADGES) assert.ok(earned.has(bd.id), bd.id);
  counts.badges = `${BADGES.length} badges · ${earned.size} reached by the scripted learner`;
});

test("options ladder: 4 levels, ≥ 8 checks per level, payoff math for every strategy", () => {
  assert.equal(LADDER_LEVELS.length, 4);
  let strategies = 0;
  for (const l of LADDER_LEVELS) {
    assert.ok(checksForLevel(l.level).length >= 8, `L${l.level}`);
    for (const s of strategiesForLevel(l.level)) {
      const m = summarize(s);
      assert.ok(m.breakevens.length >= 1 && !Number.isNaN(m.maxGain) && !Number.isNaN(m.maxLoss), s.id);
      strategies++;
    }
  }
  counts.options = `4 levels · ${LADDER_LEVELS.map((l) => checksForLevel(l.level).length).join("/")} checks · ${strategies} strategies with payoff math`;
});

test("≥ 25 new glossary terms and ≥ 60 new Learn questions", () => {
  const learn = Object.values(ACADEMY_QUESTION_BANKS).flat().length;
  assert.ok(ACADEMY_TERMS.length >= 25 && learn >= 60);
  counts.content = `${ACADEMY_TERMS.length} glossary terms · ${learn} Learn questions`;
});

test("print the floor audit line", () => {
  console.log(`FLOORS ${JSON.stringify(counts)}`);
  assert.equal(Object.keys(counts).length, 7);
});
