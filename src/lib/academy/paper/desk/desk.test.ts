import { test } from "node:test";
import assert from "node:assert/strict";
import { DESK_SCENARIOS, DESK_START_BAR, barForDate, getDeskScenario, lastBarOf, quote, ratios, statementsAsOf, visibleNews } from "./scenarios";
import { deskBracket, deskCancel, deskFlatten, deskPlace, deskStep, newDeskLog, replayDesk } from "./session";
import { rewardRisk, sharesForAmount, sharesForPercent, sharesForRisk } from "./sizing";
import { DESK_KEY, loadDesk, migrateDesk, saveDesk } from "./storage";
import { memoryStorage } from "../../storage";
import { REAL_TICKER_BLOCKLIST } from "../tapes";

const hist = getDeskScenario("big-tech-2024")!;
const sim = getDeskScenario("sim-earnings-week")!;

test("every scenario has aligned bars, valid OHLC in cents and unique ids", () => {
  assert.equal(new Set(DESK_SCENARIOS.map((s) => s.id)).size, DESK_SCENARIOS.length);
  for (const s of DESK_SCENARIOS) {
    assert.ok(s.symbols.length >= 3, s.id);
    for (const x of s.symbols) {
      assert.equal(x.bars.length, s.labels.length, `${s.id} ${x.symbol}`);
      for (const b of x.bars) {
        for (const v of [b.open, b.high, b.low, b.close]) assert.ok(Number.isInteger(v) && v > 0, `${x.symbol} ${b.label}`);
        assert.ok(b.high >= Math.max(b.open, b.close) && b.low <= Math.min(b.open, b.close), `${x.symbol} ${b.label}`);
      }
    }
    assert.equal(new Set(s.news.map((n) => n.id)).size, s.news.length, s.id);
  }
});

test("historical 2024: 252 trading days, dates ascending, known anchor closes", () => {
  assert.equal(hist.labels.length, 252);
  assert.equal(hist.labels[0], "2024-01-02");
  assert.equal(hist.labels[251], "2024-12-31");
  for (let i = 1; i < hist.labels.length; i++) assert.ok(hist.labels[i]! > hist.labels[i - 1]!);
  const close = (sym: string, d: string) => hist.symbols.find((x) => x.symbol === sym)!.bars[hist.labels.indexOf(d)]!.close;
  assert.equal(close("AAPL", "2024-12-31"), 25042);
  assert.equal(close("MSFT", "2024-12-31"), 42150);
  assert.equal(close("AMZN", "2024-12-31"), 21939);
});

test("historical news and statements are sourced (sec.gov URLs) and never SIMULATED; simulated ones always are", () => {
  for (const n of hist.news) {
    assert.ok(n.url?.startsWith("https://www.sec.gov/Archives/edgar/data/"), n.id);
    assert.ok(!n.simulated && n.date, n.id);
  }
  for (const rows of Object.values(hist.statements)) for (const st of rows) assert.ok(st.url?.startsWith("https://www.sec.gov/") && st.filed && !st.simulated);
  for (const n of sim.news) assert.ok(n.simulated && n.bar !== undefined, n.id);
  for (const rows of Object.values(sim.statements)) for (const st of rows) assert.ok(st.simulated);
  for (const x of sim.symbols) assert.ok(!REAL_TICKER_BLOCKLIST.includes(x.symbol.replace(/\.S$/, "")), x.symbol);
});

test("reveal rule: a filing dated d unlocks on the first session dated ≥ d; earlier items are history", () => {
  assert.equal(barForDate(hist.labels, "2023-11-02"), -1);
  assert.equal(barForDate(hist.labels, "2024-01-02"), 0);
  // 2024-01-20 is a Saturday: the next session is Monday 2024-01-22.
  assert.equal(hist.labels[barForDate(hist.labels, "2024-01-20")], "2024-01-22");
  assert.equal(barForDate(hist.labels, "2025-02-01"), Number.POSITIVE_INFINITY);
});

test("no look-ahead: nothing visible at a bar is dated after that bar", () => {
  for (const s of DESK_SCENARIOS) {
    for (let bar = 0; bar <= lastBarOf(s); bar += 7) {
      for (const n of visibleNews(s, bar)) assert.ok(n.at <= bar && (!n.date || n.date <= s.labels[bar]!), `${s.id} ${n.id} @${bar}`);
      for (const x of s.symbols) for (const st of statementsAsOf(s, x.symbol, bar)) assert.ok(st.at <= bar && (!st.filed || st.filed <= s.labels[bar]!));
    }
  }
});

test("Apple's fiscal Q1 2024 results appear on 2024-02-01 and the 10-Q a day later", () => {
  const i = hist.labels.indexOf("2024-02-01");
  const before = visibleNews(hist, i - 1, "AAPL").map((n) => n.id);
  const on = visibleNews(hist, i, "AAPL").map((n) => n.id);
  assert.ok(!before.includes("AAPL-2024-02-01-earnings") && on.includes("AAPL-2024-02-01-earnings"));
  assert.equal(statementsAsOf(hist, "AAPL", i)[0]!.form, "10-K");
  const q = statementsAsOf(hist, "AAPL", i + 1)[0]!;
  assert.equal(q.form, "10-Q");
  assert.equal(q.revenue, 119_575_000_000);
  assert.equal(q.epsDiluted, 2.18);
  // At the start every company already has its latest pre-2024 filing.
  for (const x of hist.symbols) assert.ok(statementsAsOf(hist, x.symbol, DESK_START_BAR).length >= 1, x.symbol);
});

test("simulated print is published after bar 34 closes, before the bar-35 gap", () => {
  assert.ok(!visibleNews(sim, 33, "PRWD.S").some((n) => n.id === "sim-prwd-print"));
  assert.ok(visibleNews(sim, 34, "PRWD.S").some((n) => n.id === "sim-prwd-print"));
  assert.equal(statementsAsOf(sim, "PRWD.S", 33)[0]!.periodEnd, "Q2");
  assert.equal(statementsAsOf(sim, "PRWD.S", 34)[0]!.periodEnd, "Q3");
  const prwd = sim.symbols.find((x) => x.symbol === "PRWD.S")!.bars;
  assert.ok(prwd[35]!.open > prwd[34]!.close * 1.1);
});

test("ratios and quote", () => {
  const r = ratios({ form: "x", periodStart: "", periodEnd: "", cashFlowMonths: 3, revenue: 100, grossProfit: 40, operatingIncome: 20, netIncome: 10, operatingCashFlow: 30, capex: 5, totalLiabilities: 50, equity: 100 });
  assert.deepEqual(r, { grossMargin: 0.4, operatingMargin: 0.2, netMargin: 0.1, freeCashFlow: 25, liabilitiesToEquity: 0.5 });
  assert.equal(ratios({ form: "x", periodStart: "", periodEnd: "", cashFlowMonths: 3, revenue: 100 }).grossMargin, null);
  const q = quote(hist, "AAPL", 1);
  const b = hist.symbols[0]!.bars;
  assert.equal(q.change, b[1]!.close - b[0]!.close);
});

test("sizing helpers", () => {
  assert.equal(sharesForRisk(10_000, 5_000, 4_800), 50);
  assert.equal(sharesForRisk(10_000, 5_000, 5_000), 0);
  assert.equal(sharesForAmount(100_000, 18_714), 5);
  assert.equal(sharesForPercent(10, 1_000_000, 25_000), 4);
  assert.equal(rewardRisk(100, 90, 130), 3);
  assert.equal(rewardRisk(100, 110, 80), 2);
  assert.equal(rewardRisk(100, 110, 130), null);
});

test("one account across symbols: orders fill on each symbol's own next bar; replay is deterministic", () => {
  let log = newDeskLog("big-tech-2024", 10_000_000);
  assert.equal(log.bar, DESK_START_BAR);
  log = deskPlace(log, { symbol: "AAPL", side: "buy", type: "market", qty: 10, tif: "day" }).log;
  log = deskPlace(log, { symbol: "MSFT", side: "buy", type: "market", qty: 5, tif: "day" }).log;
  log = deskStep(log, 1);
  const st = replayDesk(log);
  const at = (sym: string) => hist.symbols.find((x) => x.symbol === sym)!.bars[DESK_START_BAR + 1]!;
  assert.equal(st.fills.length, 2);
  assert.equal(st.fills[0]!.price, at("AAPL").open);
  assert.equal(st.fills[1]!.price, at("MSFT").open);
  assert.equal(st.marks.AMZN, at("AMZN").close);
  assert.equal(st.cash, 10_000_000 - 10 * at("AAPL").open - 5 * at("MSFT").open);
  assert.deepEqual(replayDesk(JSON.parse(JSON.stringify(log))), st);
  // flatten closes the whole AAPL position at the next open
  log = deskStep(deskFlatten(log, "AAPL"), 1);
  const st2 = replayDesk(log);
  assert.equal(st2.positions.AAPL, undefined);
  assert.equal(st2.positions.MSFT!.qty, 5);
});

test("bracket + cancel work on the desk", () => {
  let log = newDeskLog("sim-earnings-week", 1_000_000);
  const last = sim.symbols[0]!.bars[log.bar]!.close;
  log = deskBracket(log, { symbol: "PRWD.S", side: "buy", type: "market", qty: 10, tif: "day" }, last - 300, last + 3_000).log;
  log = deskStep(log, 1);
  let st = replayDesk(log);
  assert.equal(st.positions["PRWD.S"]!.qty, 10);
  const working = st.orders.filter((o) => o.status === "working");
  assert.equal(working.length, 2);
  log = deskCancel(log, working[1]!.id);
  st = replayDesk(log);
  assert.equal(st.orders.filter((o) => o.status === "working").length, 1);
});

test("desk storage round-trips, ignores junk and never touches the /paper key", () => {
  const mem = memoryStorage();
  const log = newDeskLog("sim-earnings-week", 1_000_000);
  saveDesk({ session: log, completed: { "sim-earnings-week": 1 } }, mem);
  assert.deepEqual([...mem.data.keys()], [DESK_KEY]);
  const back = loadDesk(mem);
  assert.deepEqual(back.session, log);
  assert.equal(back.completed["sim-earnings-week"], 1);
  assert.equal(migrateDesk({ session: { scenarioId: "nope" } }).session, null);
  assert.equal(loadDesk(memoryStorage({ [DESK_KEY]: "{bad" })).session, null);
});
