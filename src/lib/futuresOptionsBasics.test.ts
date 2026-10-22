import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  AAPL_FY25, FUT_OPT_QUESTIONS, FUT_OPT_TERMS, FUT_VS_OPT, SIM_CLOSES, aaplEbitda, aaplTies, expenseCost,
  futuresPnl, mesPerEs, notional, pointsToTicks, sharpe, simpleAverage, smaSeries, tickValue,
} from "./futuresOptionsBasics";

describe("futuresOptionsBasics", () => {
  it("MES/ES tick values, notional and equivalence follow CME multipliers", () => {
    assert.equal(tickValue("MES"), 1.25);
    assert.equal(tickValue("ES"), 12.5);
    assert.equal(notional("MES", 7500), 37500);
    assert.equal(notional("ES", 7500), 375000);
    assert.equal(futuresPnl("MES", 4), 20);
    assert.equal(futuresPnl("ES", -2, 3), -300);
    assert.equal(pointsToTicks(1), 4);
    assert.equal(mesPerEs(), 10);
  });

  it("Sharpe matches the PortfolioPilot example and guards zero volatility", () => {
    assert.ok(Math.abs(sharpe(8, 2, 10)! - 0.6) < 1e-12);
    assert.equal(sharpe(8, 2, 0), null);
  });

  it("SMA example and SIMULATED series", () => {
    assert.equal(simpleAverage([10, 11, 12, 13, 14]), 12);
    const s5 = smaSeries(5);
    assert.equal(s5.length, SIM_CLOSES.length);
    assert.equal(s5[3], null);
    assert.equal(s5[4], simpleAverage(SIM_CLOSES.slice(0, 5)));
  });

  it("Apple FY2025 chain ties and EBITDA = operating income + D&A", () => {
    assert.ok(aaplTies());
    assert.equal(aaplEbitda(), AAPL_FY25.operatingIncome + AAPL_FY25.dAndA);
    assert.equal(aaplEbitda(), 144_748);
  });

  it("expense ratio cost, comparison rows, 12+ questions, terms", () => {
    assert.ok(Math.abs(expenseCost(10_000) - 9.45) < 1e-9);
    assert.ok(FUT_VS_OPT.length >= 5);
    assert.ok(FUT_OPT_QUESTIONS.length >= 12);
    assert.equal(new Set(FUT_OPT_QUESTIONS.map((q) => q.id)).size, FUT_OPT_QUESTIONS.length);
    const ids = new Set(FUT_OPT_TERMS.map((t) => t.id));
    for (const need of ["futures-contract", "option-contract", "sharpe-ratio", "simple-moving-average", "es-emini"]) assert.ok(ids.has(need), need);
  });
});
