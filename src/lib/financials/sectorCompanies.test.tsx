/** FE8.M1: the bank (Bayline Bancorp) and the biotech (Kestrel Biotherapeutics): ties, stories, metrics, readouts, quiz, UI. */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import type { ReactElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { MemoryRouter } from "react-router-dom";
import BalanceSheetTable from "../../components/financials/BalanceSheetTable";
import CashFlowTable from "../../components/financials/CashFlowTable";
import IncomeStatementTable from "../../components/financials/IncomeStatementTable";
import StatementReader from "../../components/financials/StatementReader";
import TrialReadoutPanel from "../../components/financials/TrialReadoutPanel";
import EarningsPreviewCard from "../../components/financials/EarningsPreviewCard";
import { bankQuarterMetrics } from "./bankMetrics";
import { COMPANIES, KESTREL_ROYALTY_RATE, companyById } from "./companies";
import { EARNINGS_EVENTS, eventById } from "./earningsEvents";
import { fmtK } from "./format";
import { freeCashFlow, quarterMetrics, runwayMonths } from "./metrics";
import { FINANCIALS_QUESTION_BANKS } from "./quizBanks";
import { PRINT_ROUNDS } from "./readThePrint";
import { EVENT_INDEX, generateReaction } from "./reactionCharts";
import { bankViolations, chainViolations, companyViolations, quarterViolations } from "./ties";
import {
  READOUT_RISK_BUDGET_PCT,
  TRIAL_READOUTS,
  followUpQuestion,
  readoutBars,
  readoutViolations,
  resolveReadout,
  sizingQuestion,
} from "./trialReadouts";
import type { Quarter } from "./types";

const html = (el: ReactElement) => renderToStaticMarkup(<MemoryRouter>{el}</MemoryRouter>);
const clone = <T,>(x: T): T => JSON.parse(JSON.stringify(x)) as T;
const BK = companyById("bayline-bancorp")!;
const KS = companyById("kestrel-bio")!;
const ALL = Object.values(FINANCIALS_QUESTION_BANKS).flat();
const correct = (id: string) => {
  const q = ALL.find((x) => x.id === id);
  assert.ok(q, id);
  return q.options.find((o) => o.id === q.correctAnswer)!.label;
};
const pct = (x: number, d = 1) => `${x < 0 ? "−" : ""}${Math.abs(x * 100).toFixed(d)}%`;
const money = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("en-US")}k`;

describe("FE8.M1 companies: five archetypes, all tie out", () => {
  it("has the bank and the biotech as companies 4 and 5", () => {
    assert.deepEqual(COMPANIES.map((c) => c.archetype), ["saas-burner", "seasonal-retailer", "levered-industrial", "regional-bank", "clinical-biotech"]);
    assert.equal(BK.statementStyle, "bank");
    assert.ok(BK.quarters.every((q) => q.bank), "every bank quarter carries bank lines");
    assert.ok(KS.quarters.every((q) => !q.bank));
  });
  for (const c of [BK, KS]) it(`${c.id}: 0 tie violations (generic + bank)`, () => assert.deepEqual(companyViolations(c), []));
  it("generic companies still have no bank lines and still tie", () => {
    for (const c of COMPANIES.slice(0, 3)) {
      assert.deepEqual(companyViolations(c), []);
      for (const q of c.quarters) assert.equal(q.bank, undefined);
    }
  });
});

describe("FE8.M1 bank validators catch broken fixtures", () => {
  const q = (i: number) => clone(BK.quarters[i]!) as Quarter;
  const cases: [string, () => string[]][] = [
    ["NII != II − IE", () => { const x = q(2); x.bank!.netInterestIncome += 1; return bankViolations(x); }],
    ["revenue != NII + fees", () => { const x = q(2); x.income.revenue += 1; return bankViolations(x); }],
    ["interest cost below operating income", () => { const x = q(2); x.income.interestExpense = 5; return bankViolations(x); }],
    ["net loans != gross − allowance", () => { const x = q(2); x.balance.loansNet! += 10; return bankViolations(x); }],
    ["deposits moved without a cash-flow line", () => { const a = q(1); const b = q(2); b.balance.deposits! += 10; return chainViolations(a, b); }],
    ["allowance roll-forward broken", () => { const a = q(1); const b = q(2); b.bank!.allowance += 10; return chainViolations(a, b); }],
    ["securities moved without a cash-flow line", () => { const a = q(1); const b = q(2); b.cashFlow.changeSecurities! += 10; return chainViolations(a, b); }],
    ["bank asset left out of total assets", () => { const x = q(2); x.balance.securities! += 10; return quarterViolations(x); }],
    ["CFO missing the provision add-back", () => { const x = q(2); x.cashFlow.provisionAddback = 0; return [...quarterViolations(x), ...bankViolations(x)]; }],
  ];
  for (const [name, run] of cases) it(`catches: ${name}`, () => assert.ok(run().length > 0, name));
});

describe("FE8.M1 Bayline: the numbers tell the bank story", () => {
  const nim = (i: number) => bankQuarterMetrics(BK, i)!.netInterestMargin!;
  it("NIM compresses through FY25 as deposit costs rise, then widens in FY26", () => {
    for (let i = 1; i <= 3; i++) assert.ok(nim(i) < nim(i - 1), `NIM falls at ${i}`);
    for (let i = 4; i <= 7; i++) assert.ok(nim(i) > nim(i - 1), `NIM widens at ${i}`);
    const dc = BK.quarters.map((x) => x.kpis.find((k) => k.id === "deposit-cost")!.value);
    assert.ok(dc[3]! > dc[0]! && dc[7]! < dc[4]!);
    assert.ok(nim(0) > 0.03 && nim(0) < 0.04, "NIM in a realistic 3–4% range");
  });
  it("deposits run off in Q2–Q3 FY25 and borrowings fill the gap, then are repaid", () => {
    const cf = BK.quarters.map((x) => x.cashFlow);
    assert.ok(cf[1]!.changeDeposits! < 0 && cf[2]!.changeDeposits! < 0);
    assert.ok(cf[1]!.debtIssued > 0 && cf[2]!.debtIssued > 0);
    assert.ok(cf[3]!.debtRepaid < 0 && cf[4]!.debtRepaid < 0);
  });
  it("credit worsens in FY26: NPLs rise and the provision exceeds charge-offs (a reserve build)", () => {
    const b = BK.quarters.map((x) => x.bank!);
    for (const i of [4, 5, 6]) assert.ok(b[i]!.provision > b[i]!.netChargeOffs * 1.4, `build at ${i}`);
    assert.ok(b[6]!.nonperformingLoans / b[6]!.grossLoans > 2 * (b[0]!.nonperformingLoans / b[0]!.grossLoans));
    assert.ok(b[7]!.allowance > b[0]!.allowance);
    assert.ok(BK.quarters[5]!.income.epsDiluted < BK.quarters[4]!.income.epsDiluted, "the build hits EPS");
  });
  it("capital, efficiency, funding and dividend stay in textbook ranges", () => {
    for (let i = 0; i < 8; i++) {
      const m = bankQuarterMetrics(BK, i)!;
      assert.ok(m.cet1! > 0.1 && m.cet1! < 0.125, `CET1 ${m.cet1}`);
      assert.ok(m.efficiencyRatio! > 0.55 && m.efficiencyRatio! < 0.72, `efficiency ${m.efficiencyRatio}`);
      assert.ok(m.loanToDeposit! > 0.8 && m.loanToDeposit! < 0.9, `LDR ${m.loanToDeposit}`);
      assert.ok(BK.quarters[i]!.cashFlow.dividends < 0);
      assert.ok(m.tangibleBookValuePerShare! < m.bookValuePerShare!);
    }
  });
  it("industrial ratios read n/m for a bank", () => {
    const m = quarterMetrics(BK, 4);
    for (const k of ["grossMargin", "dso", "dio", "dpo", "cashConversionCycle", "currentRatio", "interestCoverage", "netLeverage", "runwayMonths"] as const)
      assert.equal(m[k], null, k);
    assert.equal(bankQuarterMetrics(COMPANIES[0]!, 0), null);
  });
});

describe("FE8.M1 Kestrel: the numbers tell the biotech story", () => {
  const q = KS.quarters;
  it("revenue is a 12% royalty on partner sales, small next to R&D", () => {
    for (const x of q) {
      assert.equal(x.income.revenue, Math.round(x.kpis.find((k) => k.id === "partner-sales")!.value * KESTREL_ROYALTY_RATE));
      assert.equal(x.income.cogs, 0);
      assert.ok(x.income.rnd > 4 * x.income.revenue);
    }
    assert.ok(q[6]!.income.revenue < q[5]!.income.revenue, "partner destocking in Q3 FY26");
  });
  it("loses money and burns cash every quarter", () => {
    for (const x of q) assert.ok(x.income.operatingIncome < 0 && freeCashFlow(x) < 0);
  });
  it("R&D drops by at least 20% after KB-207 is stopped", () => assert.ok(q[3]!.income.rnd < q[2]!.income.rnd * 0.8));
  it("two share sales (ATM in Q2 FY25, follow-on in Q2 FY26) dilute holders and extend runway", () => {
    assert.deepEqual(q.map((x, i) => (x.cashFlow.equityIssued > 0 ? i : -1)).filter((i) => i >= 0), [1, 5]);
    assert.ok(q[5]!.income.sharesBasic > q[4]!.income.sharesBasic * 1.14);
    assert.ok(runwayMonths(q[4]!)! < 24 && runwayMonths(q[5]!)! > 30);
  });
});

describe("FE8.M1 earnings events + Read the Print", () => {
  it("each new company has 4 events across 4 different reactions, all in Read the Print", () => {
    for (const id of ["bayline-bancorp", "kestrel-bio"]) {
      const ev = EARNINGS_EVENTS.filter((e) => e.companyId === id);
      assert.equal(ev.length, 4, id);
      assert.equal(new Set(ev.map((e) => e.reaction)).size, 4, id);
      for (const e of ev) assert.ok(PRINT_ROUNDS.some((r) => r.eventId === e.id), e.id);
    }
    assert.equal(PRINT_ROUNDS.length, 22);
    assert.deepEqual(PRINT_ROUNDS.slice(0, 14).map((r) => r.eventId).slice(0, 2), ["nwcl-q2fy25", "hbpn-q2fy26"], "existing rounds keep their numbers");
  });
  it("bank previews talk about net revenue; the biotech's about royalties", () => {
    const b = html(<EarningsPreviewCard event={eventById("bayb-q2fy25")!} />);
    assert.ok(b.includes("Net revenue (NII + fees)") && b.includes("net revenue (NII + fees)"));
    const k = html(<EarningsPreviewCard event={eventById("kstl-q2fy25")!} />);
    assert.ok(k.includes("Royalty revenue"));
    const n = html(<EarningsPreviewCard event={eventById("nwcl-q2fy25")!} />);
    assert.ok(n.includes(">Revenue<"), "existing companies unchanged");
  });
});

describe("FE8.M1 bank-format statements render", () => {
  it("income statement shows NII → PPNR → provision, not COGS", () => {
    const m = html(<IncomeStatementTable company={BK} />);
    for (const l of ["Net interest income", "Pre-provision net revenue (PPNR)", "Provision for credit losses", "Diluted EPS"]) assert.ok(m.includes(l), l);
    assert.ok(!m.includes("Cost of goods sold") && !m.includes("Gross profit"));
  });
  it("balance sheet shows loans, allowance and deposits; cash flow shows loans in investing and deposits in financing", () => {
    const b = html(<BalanceSheetTable company={BK} />);
    for (const l of ["Gross loans", "Allowance for credit losses", "Net loans", "Deposits"]) assert.ok(b.includes(l), l);
    const c = html(<CashFlowTable company={BK} />);
    for (const l of ["Net new loans", "Deposits in / (out)", "Provision for credit losses (non-cash)"]) assert.ok(c.includes(l), l);
    assert.ok(c.includes(fmtK(BK.quarters[7]!.balance.cash)));
  });
  it("StatementReader on the bank's metrics tab shows NIM and CET1", () => {
    const m = html(<StatementReader initialCompanyId="bayline-bancorp" initialTab="metrics" />);
    assert.ok(m.includes("Net interest margin (annualized)") && m.includes("CET1 ratio (simplified)"));
  });
});

describe("FE8.M1 trial readouts", () => {
  it("every readout passes its rules and is deterministic", () => {
    assert.ok(TRIAL_READOUTS.length >= 3);
    assert.deepEqual(new Set(TRIAL_READOUTS.map((r) => r.outcome)), new Set(["met", "missed", "continues"]));
    for (const r of TRIAL_READOUTS) {
      assert.deepEqual(readoutViolations(r), [], r.id);
      assert.deepEqual(readoutBars(r), readoutBars(r));
    }
  });
  it("validator catches a gap that fills and a wrong-way gap", () => {
    const met = TRIAL_READOUTS.find((r) => r.outcome === "met")!;
    assert.ok(readoutViolations({ ...met, gap: -0.5 }).length > 0);
    assert.ok(readoutViolations({ ...met, gap: 0.1 }).length > 0, "too small for a binary win");
  });
  it("sizing answer = risk budget ÷ implied move; follow-ups recompute from the statements", () => {
    for (const r of TRIAL_READOUTS) {
      const s = sizingQuestion(r);
      const right = s.choices.find((c) => c.id === s.answer)!.label;
      assert.ok(right.includes(`${((READOUT_RISK_BUDGET_PCT / r.impliedMovePct) * 100).toFixed(1)}%`), right);
      assert.equal(new Set(s.choices.map((c) => c.label)).size, 4);
      const f = followUpQuestion(r);
      assert.equal(new Set(f.choices.map((c) => c.label)).size, 4);
      for (const c of [...s.choices, ...f.choices]) if (c.id !== s.answer && s.choices.includes(c)) assert.ok(c.feedback);
    }
    const top = TRIAL_READOUTS.find((r) => r.followOn)!;
    const rr = resolveReadout(top);
    const k4 = KS.quarters[top.quarterIndex - 1]!;
    const k5 = KS.quarters[top.quarterIndex]!;
    assert.equal(rr.followOn!.sharesK, k5.income.sharesBasic - k4.income.sharesBasic);
    const f = followUpQuestion(top);
    assert.ok(f.choices.find((c) => c.id === f.answer)!.label.startsWith(`${(((k5.income.sharesBasic - k4.income.sharesBasic) / k4.income.sharesBasic) * 100).toFixed(1)}%`));
  });
  it("panel hides the outcome until reveal", () => {
    for (const r of TRIAL_READOUTS) {
      const pre = html(<TrialReadoutPanel initialId={r.id} />);
      assert.ok(!pre.includes(r.headline.replace(/&/g, "&amp;")) && !pre.includes("readout-reveal\""), r.id);
      assert.ok(pre.includes("readout-sizing"));
      const post = html(<TrialReadoutPanel initialId={r.id} initialPhase="reveal" />);
      assert.ok(post.includes("readout-follow-up") && post.includes("Implied ±"), r.id);
    }
  });
});

describe("FE8.M1 quiz questions recompute from raw fields", () => {
  it("bank questions", () => {
    const b2 = BK.quarters[2]!.bank!;
    assert.equal(correct("FIN-ST-B1"), pct((b2.netInterestIncome * 4) / b2.averageEarningAssets, 2));
    const q1 = BK.quarters[1]!;
    assert.equal(correct("FIN-ST-B2"), pct(q1.bank!.nonInterestExpense / q1.income.revenue));
    const b5 = BK.quarters[5]!.bank!;
    assert.ok(correct("FIN-ST-B3").includes(`${(b5.provision / b5.netChargeOffs).toFixed(1)}×`));
    assert.equal(BK.quarters[5]!.bank!.allowance, BK.quarters[4]!.bank!.allowance + b5.provision - b5.netChargeOffs);
    const b7 = BK.quarters[7]!.bank!;
    assert.equal(correct("FIN-ST-B4"), pct(b7.grossLoans / b7.deposits));
  });
  it("biotech questions", () => {
    const k2 = KS.quarters[2]!;
    assert.equal(correct("FIN-ST-K1"), `${(k2.balance.cash / (-freeCashFlow(k2) / 3)).toFixed(1)} months`);
    assert.equal(correct("FIN-ST-K2"), money(KS.quarters[6]!.kpis.find((k) => k.id === "partner-sales")!.value));
    const s4 = KS.quarters[4]!.income.sharesBasic;
    const s5 = KS.quarters[5]!.income.sharesBasic;
    assert.equal(correct("FIN-ST-K3"), `+${((s5 / s4 - 1) * 100).toFixed(1)}%`);
  });
  it("reaction question matches the generated chart", () => {
    const rc = generateReaction(eventById("kstl-q3fy26")!);
    const r10 = rc.bars[EVENT_INDEX + 10]!.close / rc.bars[EVENT_INDEX]!.close - 1;
    assert.ok(r10 < 0);
    assert.ok(correct("FIN-ER-K1").includes(`${Math.abs(r10 * 100).toFixed(1)}%`));
  });
});
