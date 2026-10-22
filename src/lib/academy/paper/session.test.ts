import { test } from "node:test";
import assert from "node:assert/strict";
import { START_BAR, newSessionLog, replay, sessionCancel, sessionPlace, sessionStep, visibleBars } from "./session";
import { getTape } from "./tapes";
import { migratePaper } from "../storage";

test("replay of an action log restores the same state (persistence = log)", () => {
  const tape = getTape("trend-up")!;
  let log = newSessionLog("trend-up", 1_000_000, START_BAR);
  log = sessionPlace(log, { symbol: tape.symbol, side: "buy", type: "market", qty: 10, tif: "day" }).log;
  log = sessionStep(log, 3);
  const last = tape.bars[log.bar]!.close;
  log = sessionPlace(log, { symbol: tape.symbol, side: "sell", type: "limit", limitPrice: last * 2, qty: 10, tif: "gtc" }).log;
  log = sessionCancel(log, "o2");
  log = sessionStep(log, 2);
  const a = replay(log);
  const b = replay(JSON.parse(JSON.stringify(log)));
  assert.deepEqual(a, b);
  assert.equal(a.bar, START_BAR + 5);
  assert.equal(a.fills.length, 1);
  assert.equal(a.fills[0]!.price, tape.bars[START_BAR + 1]!.open);
  assert.equal(a.orders[1]!.status, "cancelled");
  assert.equal(visibleBars(log).length, START_BAR + 6, "no bars past the current one");
});

test("stepping is bounded by the tape; storage round-trips the log", () => {
  const tape = getTape("range")!;
  const log = sessionStep(newSessionLog("range", 100_000), 10_000);
  assert.equal(log.bar, tape.bars.length - 1);
  const stored = migratePaper(JSON.parse(JSON.stringify({ schemaVersion: 1, session: log, challengeAttempts: [], stats: { orders: 0, limitFills: 0, trailingExits: 0, stopProtectedTrades: 0, stopLimitNoFills: 0 } })));
  assert.deepEqual(stored.session, log);
});
