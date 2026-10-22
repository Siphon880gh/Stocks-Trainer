import { test } from "node:test";
import assert from "node:assert/strict";
import { ALGO_QUESTIONS, ALGO_TERMS, ATR_EXAMPLE, BROKER_APIS, NEWS_TIMES, atrShares } from "./algoTrading";
import { PDT_FACTS, PDT_QUESTIONS, PDT_SUMMARY, PDT_TERMS } from "./pdtRule";

test("ATR sizing keeps dollar risk constant: $200 risk, ATR 2 → 66 shares at 1.5×, 33 at 3×", () => {
  assert.equal(atrShares(ATR_EXAMPLE.risk, ATR_EXAMPLE.atr, ATR_EXAMPLE.normal), 66);
  assert.equal(atrShares(ATR_EXAMPLE.risk, ATR_EXAMPLE.atr, ATR_EXAMPLE.newsDay), 33);
  for (const [r, a, m] of [[500, 1.25, 2], [100, 0.4, 3]] as const) assert.ok(atrShares(r, a, m) * a * m <= r);
});

test("every broker row cites a source and Robinhood has no public stock API", () => {
  for (const r of BROKER_APIS) assert.ok(r.sources.length > 0 && r.sources.every((x) => x.url.startsWith("https://")), r.broker);
  const rh = BROKER_APIS.find((r) => r.broker === "Robinhood");
  assert.match(rh!.paper, /No public stock-trading API/);
});

test("2026 release dates are listed in ET with the PT conversion", () => {
  const all = NEWS_TIMES.join(" ");
  for (const d of ["Nov 6", "Dec 4", "Nov 10", "Dec 10", "Oct 27–28", "Dec 8–9", "8:30 AM ET (5:30 AM PT)"]) assert.ok(all.includes(d), d);
});

test("algo and PDT questions: unique ids, the correct option exists, terms exist", () => {
  const qs = [...ALGO_QUESTIONS, ...PDT_QUESTIONS];
  assert.ok(ALGO_QUESTIONS.length >= 15);
  assert.equal(new Set(qs.map((q) => q.id)).size, qs.length);
  for (const q of qs) assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
  const ids = new Set([...ALGO_TERMS, ...PDT_TERMS].map((t) => t.id));
  assert.equal(ids.size, ALGO_TERMS.length + PDT_TERMS.length);
});

test("PDT facts: intraday margin replaces PDT; dates and thresholds match FINRA", () => {
  assert.equal(PDT_FACTS.effective, "2026-06-04");
  assert.equal(PDT_FACTS.transitionEnds, "2027-10-20");
  assert.equal(PDT_FACTS.marginMinimumEquity, 2000);
  for (const x of ["$25,000", "April 14, 2026", "June 4, 2026", "October 20, 2027", "$2,000", "90 days", "25%"]) assert.ok(PDT_SUMMARY.includes(x), x);
});
