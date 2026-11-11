import { test } from "node:test";
import assert from "node:assert/strict";
import { DESK_SCENARIOS, DESK_START_BAR, DESK_TOPICS, getDeskScenario, lastBarOf, scenariosByTopic, visibleNews } from "./scenarios";
import { SIM_LIBRARY } from "./simLibrary";
import { genSymbol, quarterSeries } from "./simGen";
import { deskBracket, deskFlatten, deskPlace, deskStep, newDeskLog, replayDesk, replayDeskDetailed } from "./session";
import { evaluateGoals } from "./goals";
import { REAL_TICKER_BLOCKLIST } from "../tapes";
import { LITERACY_TERMS } from "../../../literacyTerms";
import { BANNED_PHRASES } from "../../content/banned";
import type { DeskScenario } from "./types";

const sims = DESK_SCENARIOS.filter((s) => s.kind === "simulated");

test("library: at least 28 simulated topics, every one grouped, with lesson, learning goals, goals and a debrief", () => {
  assert.ok(SIM_LIBRARY.length >= 28);
  const topics = new Set(DESK_TOPICS.map((t) => t.id));
  for (const s of DESK_SCENARIOS) {
    assert.ok(s.topic && topics.has(s.topic), `${s.id} topic`);
    assert.ok((s.learn ?? []).length >= 2, `${s.id} learn`);
    assert.ok((s.goals ?? []).length >= 2, `${s.id} goals`);
    assert.ok((s.debrief?.signals ?? []).length >= 1 && (s.debrief?.plan ?? []).length >= 1, `${s.id} debrief`);
  }
  const grouped = scenariosByTopic().flatMap((g) => g.scenarios.map((s) => s.id));
  assert.equal(grouped.length, DESK_SCENARIOS.length);
});

test("library: every simulated item is tagged SIMULATED, tickers are fictional, terms exist, no banned phrases", () => {
  const ids = new Set(LITERACY_TERMS.map((t) => t.id));
  for (const s of sims) {
    assert.match(s.title, /SIMULATED/, s.id);
    assert.match(s.sourceNote, /SIMULATED/, s.id);
    for (const n of s.news) assert.equal(n.simulated, true, `${s.id} ${n.id}`);
    for (const [sym, list] of Object.entries(s.statements)) for (const st of list) assert.equal(st.simulated, true, `${s.id} ${sym}`);
    for (const x of s.symbols) {
      assert.match(x.symbol, /\.S$/, x.symbol);
      assert.ok(!REAL_TICKER_BLOCKLIST.includes(x.symbol.replace(/\.S$/, "")), x.symbol);
    }
    for (const t of s.terms ?? []) assert.ok(ids.has(t), `${s.id} term ${t}`);
    const text = JSON.stringify({ t: s.title, d: s.description, l: s.lesson, n: s.news, b: s.debrief, g: s.goals, learn: s.learn });
    for (const re of BANNED_PHRASES) assert.ok(!re.test(text), `${s.id} ${re}`);
    assert.ok(!/\b(theta|delta|gamma|vega)\b/i.test(text), `${s.id} greek word`);
  }
});

test("statements: assets = liabilities + equity, gross ≥ operating, cash ties within a series", () => {
  for (const s of sims) {
    for (const [sym, list] of Object.entries(s.statements)) {
      const bySeries = new Map<string, typeof list>();
      for (const st of list) {
        assert.equal(st.totalAssets, (st.totalLiabilities ?? 0) + (st.equity ?? 0), `${s.id} ${sym} ${st.periodEnd} balance`);
        assert.ok((st.grossProfit ?? 0) >= (st.operatingIncome ?? 0), `${s.id} ${sym} margins`);
        if (st.financingCashFlow !== undefined) bySeries.set(st.series ?? "main", [...(bySeries.get(st.series ?? "main") ?? []), st]);
      }
      for (const rows of bySeries.values()) {
        for (let i = 1; i < rows.length; i++) {
          const a = rows[i - 1]!;
          const b = rows[i]!;
          assert.equal(b.cash! - a.cash!, b.operatingCashFlow! - b.capex! + b.financingCashFlow!, `${s.id} ${sym} cash tie ${b.periodEnd}`);
        }
      }
    }
  }
});

test("quarterSeries ties cash from the opening balance and tracks buybacks / issuance in the share count", () => {
  const rows = quarterSeries({ cash: 100, otherAssets: 900, debt: 300, otherLiabilities: 100, shares: 10 }, [
    { bar: 1, period: "Q1", revenue: 1000, grossMargin: 0.5, opMargin: 0.2, buybacks: 50, sharesChange: -1 },
    { bar: 2, period: "Q2", revenue: 1000, grossMargin: 0.5, opMargin: 0.2, stockIssued: 80, sharesChange: 2, charge: 30, debtChange: -20 },
  ]);
  const [q1, q2] = rows;
  assert.equal(q1!.cash, 100 + q1!.operatingCashFlow! - q1!.capex! + q1!.financingCashFlow!);
  assert.equal(q1!.sharesDiluted, 9);
  assert.equal(q2!.sharesDiluted, 11);
  for (const r of rows) assert.equal(r.totalAssets, r.totalLiabilities! + r.equity!);
});

test("prices are deterministic and every scripted ≥3% gap has news published after the prior close", () => {
  const spec = { symbol: "ZZZZ.S", name: "Z", start: 20, gaps: [[5, 10]] as [number, number][] };
  assert.deepEqual(genSymbol("x", spec, 10), genSymbol("x", spec, 10));
  for (const s of sims) {
    for (const x of s.symbols) {
      for (let i = 1; i < x.bars.length; i++) {
        const gap = x.bars[i]!.open / x.bars[i - 1]!.close - 1;
        if (Math.abs(gap) < 0.03) continue;
        const before = visibleNews(s, i - 1, x.symbol).filter((n) => n.at === i - 1);
        assert.ok(before.length > 0, `${s.id} ${x.symbol} gap ${(gap * 100).toFixed(1)}% at ${x.bars[i]!.label} has no news at the prior close`);
        assert.equal(visibleNews(s, i - 2, x.symbol).filter((n) => n.at === i - 1).length, 0, "no look-ahead");
      }
    }
  }
});

test("scripted moves land in the scripted direction", () => {
  const gap = (id: string, sym: string, bar: number) => {
    const b = getDeskScenario(id)!.symbols.find((x) => x.symbol === sym)!.bars;
    return b[bar]!.open / b[bar - 1]!.close - 1;
  };
  assert.ok(gap("sim-earnings-miss", "KLNR.S", 31) < -0.1);
  assert.ok(gap("sim-fda-binary", "CRVA.S", 41) < -0.5);
  assert.ok(gap("sim-merger-arb", "NSTW.S", 21) > 0.2);
  assert.ok(gap("sim-merger-arb", "HOLN.S", 21) < -0.04);
  assert.ok(gap("sim-going-concern", "BRML.S", 51) < -0.6);
  assert.ok(gap("sim-short-squeeze", "SQZE.S", 22) > 0.15);
  const nstw = getDeskScenario("sim-merger-arb")!.symbols.find((x) => x.symbol === "NSTW.S")!.bars;
  for (let i = 25; i < 44; i++) assert.ok(nstw[i]!.close < 4000 && nstw[i]!.close > 3700, `pinned below the deal at ${i}`);
  const crash = getDeskScenario("sim-flash-crash")!.symbols.find((x) => x.symbol === "NMBC.S")!.bars[30]!;
  assert.ok(crash.low < crash.open * 0.88 && crash.close > crash.low * 1.1, "intraday plunge and recovery");
});

test("dividend: holders at the prior close are credited on the ex-date; buyers on the ex-date are not", () => {
  const s = getDeskScenario("sim-dividend")!;
  let log = newDeskLog(s.id, 10_000_000);
  log = deskPlace(log, { symbol: "DVDN.S", side: "buy", type: "market", qty: 100, tif: "day" }).log;
  while (log.bar < 31) log = deskStep(log);
  const { dividends, state } = replayDeskDetailed(log);
  assert.deepEqual(dividends.map((d) => [d.bar, d.qty, d.amount]), [[30, 100, 24_000]]);
  const curve = state.equityCurve.find((p) => p.bar === 30)!;
  assert.equal(curve.cash, state.equityCurve.find((p) => p.bar === 31)!.cash);
  let late = newDeskLog(s.id, 10_000_000, undefined, 30);
  late = deskPlace(late, { symbol: "DVDN.S", side: "buy", type: "market", qty: 100, tif: "day" }).log;
  late = deskStep(late, 3);
  assert.equal(replayDeskDetailed(late).dividends.length, 0);
});

test("goals: stops, risk, flat-at, order types and trade count are judged from the log", () => {
  const s = getDeskScenario("sim-fda-binary")!;
  let log = newDeskLog(s.id, 10_000_000);
  log = deskBracket(log, { symbol: "CRVA.S", side: "buy", type: "market", qty: 1000, tif: "day" }, 1500).log;
  log = deskStep(log, 5);
  const mid = evaluateGoals(s, log);
  assert.equal(mid.find((g) => g.goal.kind === "flatAt")!.status, "pending");
  while (log.bar < 41) log = deskStep(log);
  assert.equal(evaluateGoals(s, log).find((g) => g.goal.kind === "flatAt")!.status, "missed");

  let flat = newDeskLog(s.id, 10_000_000);
  flat = deskBracket(flat, { symbol: "CRVA.S", side: "buy", type: "market", qty: 1000, tif: "day" }, 1500).log;
  flat = deskStep(flat, 20);
  flat = deskFlatten(flat, "CRVA.S");
  while (flat.bar < lastBarOf(s)) flat = deskStep(flat, 5);
  assert.equal(replayDesk(flat).positions["CRVA.S"]?.qty ?? 0, 0);
  assert.equal(evaluateGoals(s, flat).find((g) => g.goal.kind === "flatAt")!.status, "met");

  const r = getDeskScenario("sim-range-chop")!;
  let rl = newDeskLog(r.id, 10_000_000);
  rl = deskPlace(rl, { symbol: "PLTO.S", side: "buy", type: "market", qty: 100, tif: "day" }).log;
  rl = deskStep(rl);
  while (rl.bar < lastBarOf(r)) rl = deskStep(rl, 10);
  const rg = evaluateGoals(r, rl);
  assert.equal(rg.find((g) => g.goal.kind === "stopOnEntries")!.status, "missed");
  assert.equal(rg.find((g) => g.goal.kind === "usedType")!.status, "missed");
  assert.equal(rg.find((g) => g.goal.kind === "maxTrades")!.status, "met");
});

test("historical debrief is computed from the bundled prices (one line per real earnings release)", () => {
  const h = getDeskScenario("big-tech-2024")!;
  const earnings = h.news.filter((n) => n.kind === "earnings" && n.symbol && n.date && n.date >= h.labels[0]! && n.date < h.labels.at(-1)!);
  assert.equal(h.debrief!.signals.length - 1, earnings.length);
  for (const line of h.debrief!.signals.slice(1)) assert.match(line, /next open [+-]\d+\.\d%/);
});

test("recommended account rules: squeeze allows shorts, the small cap starts with slippage", () => {
  const sc = (id: string): DeskScenario => getDeskScenario(id)!;
  assert.equal(sc("sim-short-squeeze").options?.allowShort, true);
  assert.equal(sc("sim-illiquid-smallcap").options?.slippageBps, 50);
  assert.ok(DESK_START_BAR < 12, "events land after the replay starts");
});
