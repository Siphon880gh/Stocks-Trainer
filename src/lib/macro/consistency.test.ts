import { test } from "node:test";
import assert from "node:assert/strict";
import * as C from "./consistency";

const rules = (vs: { rule: string }[]) => vs.map((x) => x.rule);

test("surprise", () => {
  assert.deepEqual(C.checkSurprise({ actual: 0.4, consensus: 0.3, surprise: 0.1 }), []);
  assert.deepEqual(rules(C.checkSurprise({ actual: 0.4, consensus: 0.3, surprise: 0.2 })), ["surprise"]);
});

const goodPay: C.PayrollMonth = { label: "m", sectors: { a: 50, b: 70 }, privateChange: 120, governmentChange: 30, totalChange: 150, level: 1150, prevLevel: 1000 };
test("payrolls", () => {
  assert.deepEqual(C.checkPayrolls(goodPay), []);
  assert.deepEqual(rules(C.checkPayrolls({ ...goodPay, sectors: { a: 50, b: 71 } })), ["payroll-sectors"]);
  assert.deepEqual(rules(C.checkPayrolls({ ...goodPay, governmentChange: 31, sectors: goodPay.sectors })), ["payroll-total"]);
  assert.deepEqual(rules(C.checkPayrolls({ ...goodPay, level: 1151 })), ["payroll-level"]);
});

const goodHh: C.HouseholdMonth = { label: "m", population: 268000, laborForce: 167500, employed: 161300, unemployed: 6200, unemploymentRate: 3.7, participationRate: 62.5 };
test("household", () => {
  assert.deepEqual(C.checkHousehold(goodHh), []);
  assert.deepEqual(rules(C.checkHousehold({ ...goodHh, employed: 161301 })), ["labor-force"]);
  assert.deepEqual(rules(C.checkHousehold({ ...goodHh, unemploymentRate: 3.8 })), ["unemployment-rate"]);
  assert.deepEqual(rules(C.checkHousehold({ ...goodHh, participationRate: 62.6 })), ["participation"]);
});

test("price change, claims, curve, real yield", () => {
  assert.deepEqual(C.checkPriceChange("c", 310.31, 309.07, 0.4), []);
  assert.deepEqual(rules(C.checkPriceChange("c", 310.31, 309.07, 0.5)), ["price-change"]);
  assert.deepEqual(C.checkClaimsAverage("w", [210, 220, 215, 225], 217.5), []);
  assert.deepEqual(rules(C.checkClaimsAverage("w", [210, 220, 215, 225], 218)), ["claims-average"]);
  assert.deepEqual(rules(C.checkClaimsAverage("w", [210, 220, 215], 215)), ["claims-window"]);
  assert.deepEqual(C.checkCurveSpread("d", 4.21, 4.68, -47), []);
  assert.deepEqual(rules(C.checkCurveSpread("d", 4.21, 4.68, 47)), ["curve-spread"]);
  assert.deepEqual(C.checkRealYield("d", 4.21, 2.33, 1.88), []);
  assert.deepEqual(rules(C.checkRealYield("d", 4.21, 2.33, 1.9)), ["real-yield"]);
});

test("mortgage", () => {
  assert.deepEqual(C.checkMortgage("w", 6.9, 6.2, 4.6), []);
  assert.deepEqual(rules(C.checkMortgage("w", 5.6, 5.0, 4.6)), ["mortgage-spread"]);
  assert.deepEqual(rules(C.checkMortgage("w", 6.9, 6.9, 4.6)), ["mortgage-15-30"]);
});

test("fed range, steps, probabilities", () => {
  assert.deepEqual(C.checkTargetRange("f", 5.25, 5.5, 5.33), []);
  assert.deepEqual(rules(C.checkTargetRange("f", 5.25, 5.75, 5.33)), ["range-width"]);
  assert.deepEqual(rules(C.checkTargetRange("f", 5.25, 5.5, 5.6)), ["effective-in-range"]);
  assert.deepEqual(C.checkDecisionStep("f", -50), []);
  assert.deepEqual(rules(C.checkDecisionStep("f", 10)), ["decision-step"]);
  assert.deepEqual(C.checkProbabilities("f", [70, 30]), []);
  assert.deepEqual(rules(C.checkProbabilities("f", [70, 31])), ["probabilities-sum"]);
  assert.deepEqual(rules(C.checkProbabilities("f", [110, -10])), ["probabilities-negative"]);
  assert.equal(C.median([5, 1, 3]), 3);
});

test("gdp, ism, jolts", () => {
  const prior = 23000;
  const level = prior * Math.pow(1.025, 0.25);
  assert.deepEqual(C.checkGdp("q", level, prior, 2.5, [1.6, 0.5, 0.6, -0.2]), []);
  assert.deepEqual(rules(C.checkGdp("q", level, prior, 2.6, [1.7, 0.5, 0.6, -0.2])), ["gdp-annualized"]);
  assert.deepEqual(rules(C.checkGdp("q", level, prior, 2.5, [1.9, 0.5, 0.6, -0.2])), ["gdp-contributions"]);
  assert.deepEqual(C.checkIsm("i", 51, [52, 50, 51, 50, 52], "Growing"), []);
  assert.deepEqual(rules(C.checkIsm("i", 52, [52, 50, 51, 50, 52], "Growing")), ["ism-mean"]);
  assert.deepEqual(rules(C.checkIsm("i", 49, [49, 49, 49, 49, 49], "Growing")), ["ism-status"]);
  assert.deepEqual(C.checkJolts("j", 8000, 6000, 155000, 4.9, 3.9), []);
  assert.deepEqual(rules(C.checkJolts("j", 8000, 6000, 155000, 5.0, 3.9)), ["jolts-openings-rate"]);
  assert.deepEqual(rules(C.checkJolts("j", 8000, 6000, 155000, 4.9, 4.0)), ["jolts-hires-rate"]);
});
