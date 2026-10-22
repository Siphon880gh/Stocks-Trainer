/**
 * FE8.M1 quiz questions for the bank (Bayline Bancorp) and the biotech (Kestrel Biotherapeutics), appended to the
 * existing FE6 groups. Every number is computed from the fixtures; sectorQuiz.test.ts recomputes the answers from raw fields.
 * SAMPLE / STYLIZED: fictional companies, not live filings, not trading advice.
 */
import type { QuizOption, QuizQuestion } from "../quizData";
import { bankQuarterMetrics } from "./bankMetrics";
import { companyById } from "./companies";
import { eventById, resolveEvent } from "./earningsEvents";
import { runwayMonths, monthlyBurn } from "./metrics";
import type { FinancialsExhibit } from "./quizExhibit";
import { EVENT_INDEX, generateReaction } from "./reactionCharts";

type Letter = "A" | "B" | "C" | "D";
interface Choice {
  label: string;
  description: string;
  feedback?: string;
}
const LETTERS: Letter[] = ["A", "B", "C", "D"];
const money = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("en-US")}k`;
const pct = (x: number, digits = 1) => `${x < 0 ? "−" : ""}${Math.abs(x * 100).toFixed(digits)}%`;
const spct = (x: number, digits = 1) => `${x < 0 ? "−" : x > 0 ? "+" : ""}${Math.abs(x * 100).toFixed(digits)}%`;
const mo = (n: number) => `${n.toFixed(1)} months`;

function mc(id: string, prompt: string, at: Letter, right: Choice, wrong: Choice[], explanation: string, financialsExhibit: FinancialsExhibit, glossaryTermId: string): QuizQuestion {
  const ordered: Choice[] = [...wrong];
  ordered.splice(LETTERS.indexOf(at), 0, right);
  const options: QuizOption[] = ordered.map((c, i) => ({ id: LETTERS[i]!, ...c }));
  return { id, prompt, correctAnswer: at, options, explanation, financialsExhibit, glossaryTermId };
}
const need = <T,>(x: T | undefined | null, what: string): T => {
  if (x === undefined || x === null) throw new Error(`quizBanksSector: missing ${what}`);
  return x;
};

const BK = need(companyById("bayline-bancorp"), "bayline-bancorp");
const KS = need(companyById("kestrel-bio"), "kestrel-bio");
const bq = (i: number) => need(BK.quarters[i]?.bank, `bank lines ${i}`);
const bm = (i: number) => need(bankQuarterMetrics(BK, i), `bank metrics ${i}`);
const kq = (i: number) => need(KS.quarters[i], `kestrel quarter ${i}`);

/* ------------------------------ statements-reading ------------------------------ */

const b2 = bq(2);
const b1 = bq(1);
const bm1 = bm(1);
const b5 = bq(5);
const b4 = bq(4);
const bm7 = bm(7);
const k2 = kq(2);
const k3 = kq(3);
const k4 = kq(4);
const k5 = kq(5);
const k6 = kq(6);
const k2Runway = need(runwayMonths(k2), "kestrel runway q3fy25");

export const SECTOR_STATEMENT_QUESTIONS: QuizQuestion[] = [
  mc(
    "FIN-ST-B1",
    `${BK.name} (${BK.ticker}), ${BK.quarters[2]!.label}: net interest income ${money(b2.netInterestIncome)}, average earning assets ${money(b2.averageEarningAssets)}. What is the annualized net interest margin?`,
    "A",
    { label: pct((b2.netInterestIncome * 4) / b2.averageEarningAssets, 2), description: "NII × 4 ÷ average earning assets." },
    [
      { label: pct(b2.netInterestIncome / b2.averageEarningAssets, 2), description: "Quarterly, not annualized.", feedback: "Margins are quoted per year: multiply the quarter's NII by 4." },
      { label: pct((b2.interestIncome * 4) / b2.averageEarningAssets, 2), description: "Gross interest income.", feedback: "That's the asset yield; NIM subtracts what the bank pays depositors." },
      { label: pct(b2.netInterestIncome / BK.quarters[2]!.income.revenue, 2), description: "NII ÷ net revenue.", feedback: "That's the share of revenue from interest, not the margin on assets." },
    ],
    `NIM = ${money(b2.netInterestIncome)} × 4 ÷ ${money(b2.averageEarningAssets)}. It fell from ${pct(bm(0).netInterestMargin!, 2)} in ${BK.quarters[0]!.label} as deposit costs rose faster than loan yields.`,
    { kind: "statement", companyId: BK.id, tab: "income", start: 0, count: 4, highlightColumn: 2 },
    "net-interest-margin",
  ),
  mc(
    "FIN-ST-B2",
    `${BK.ticker}, ${BK.quarters[1]!.label}: non-interest expense ${money(b1.nonInterestExpense)}, net revenue ${money(BK.quarters[1]!.income.revenue)}. What is the efficiency ratio?`,
    "C",
    { label: pct(bm1.efficiencyRatio!), description: "Non-interest expense ÷ net revenue." },
    [
      { label: pct(b1.nonInterestExpense / b1.interestIncome), description: "÷ gross interest income.", feedback: "Use net revenue (NII + fees), the bank's top line." },
      { label: pct(1 - bm1.efficiencyRatio!), description: "One minus the ratio.", feedback: "That's the PPNR margin, the other side of the efficiency ratio." },
      { label: pct(b1.nonInterestExpense / b1.netInterestIncome), description: "÷ NII only.", feedback: "Fees count too: the denominator is NII plus non-interest income." },
    ],
    `Efficiency = ${money(b1.nonInterestExpense)} ÷ ${money(BK.quarters[1]!.income.revenue)}. Lower is better; it rose this quarter because revenue fell while costs did not.`,
    { kind: "statement", companyId: BK.id, tab: "metrics", start: 0, count: 4, highlightColumn: 1 },
    "efficiency-ratio",
  ),
  mc(
    "FIN-ST-B3",
    `${BK.ticker}, ${BK.quarters[5]!.label}: provision ${money(b5.provision)}, net charge-offs ${money(b5.netChargeOffs)}. What is the bank doing with its loan-loss reserve?`,
    "D",
    { label: `Building it: provision is ${(b5.provision / b5.netChargeOffs).toFixed(1)}× charge-offs`, description: "Provision > charge-offs." },
    [
      { label: "Releasing it: charge-offs exceed the provision", description: "Release.", feedback: "A release is when the provision is BELOW charge-offs; here it is well above." },
      { label: "Nothing: the provision always equals charge-offs", description: "Equal.", feedback: "They only match when the bank expects the same losses ahead as it is taking now." },
      { label: `Writing off ${money(b5.provision)} of loans`, description: "Provision = write-offs.", feedback: "Write-offs are the charge-offs; the provision is the expense that refills the reserve." },
    ],
    `Allowance: ${money(b4.allowance)} + provision ${money(b5.provision)} − charge-offs ${money(b5.netChargeOffs)} = ${money(b5.allowance)}. A build cuts EPS now in expectation of losses later.`,
    { kind: "statement", companyId: BK.id, tab: "metrics", start: 4, count: 4, highlightColumn: 1 },
    "reserve-build",
  ),
  mc(
    "FIN-ST-B4",
    `${BK.ticker}, ${BK.quarters[7]!.label}: gross loans ${money(bq(7).grossLoans)}, deposits ${money(bq(7).deposits)}. What is the loan-to-deposit ratio?`,
    "B",
    { label: pct(bm7.loanToDeposit!), description: "Gross loans ÷ deposits." },
    [
      { label: pct(bq(7).deposits / bq(7).grossLoans), description: "Inverted.", feedback: "Loans go on top: how much of the deposits has been lent out." },
      { label: pct(BK.quarters[7]!.balance.loansNet! / BK.quarters[7]!.balance.totalAssets), description: "Loans ÷ assets.", feedback: "That's the loan share of the balance sheet, not funding." },
      { label: pct(bq(7).grossLoans / BK.quarters[7]!.balance.totalLiabilities), description: "Loans ÷ all liabilities.", feedback: "Use deposits, the bank's core funding." },
    ],
    `${money(bq(7).grossLoans)} ÷ ${money(bq(7).deposits)}. Around 80–90% is common; above 100% means leaning on costlier borrowings.`,
    { kind: "statement", companyId: BK.id, tab: "balance", start: 4, count: 4, highlightColumn: 3 },
    "loan-to-deposit",
  ),
  mc(
    "FIN-ST-K1",
    `${KS.name} (${KS.ticker}), ${k2.label}: cash ${money(k2.balance.cash)}, burning about ${money(monthlyBurn(k2))} a month (free cash flow ÷ 3). How long is the cash runway?`,
    "A",
    { label: mo(k2Runway), description: "Cash ÷ monthly burn." },
    [
      { label: mo(k2.balance.cash / (monthlyBurn(k2) * 3)), description: "Divided by quarterly burn.", feedback: "That's quarters, labelled as months." },
      { label: mo(k2.balance.cash / (-k2.income.netIncome / 3)), description: "Net loss as burn.", feedback: "Burn is cash out the door (free cash flow); the net loss includes non-cash stock comp." },
      { label: mo((k2.balance.cash + k2.balance.receivables) / monthlyBurn(k2) + 12), description: "Added a year.", feedback: "Runway counts only cash on hand at today's burn." },
    ],
    `Runway = ${money(k2.balance.cash)} ÷ ${money(monthlyBurn(k2))} per month. Under ~18–24 months the market starts to expect a share sale.`,
    { kind: "statement", companyId: KS.id, tab: "metrics", start: 0, count: 4, highlightColumn: 2 },
    "cash-runway",
  ),
  mc(
    "FIN-ST-K2",
    `${KS.ticker}'s revenue fell from ${money(k5.income.revenue)} (${k5.label}) to ${money(k6.income.revenue)} (${k6.label}). Kestrel books a 12% royalty on its partner's sales. What were the partner's sales in ${k6.label}?`,
    "C",
    { label: money(k6.income.revenue / 0.12), description: "Royalty ÷ 12%." },
    [
      { label: money(k6.income.revenue * 0.12), description: "Royalty × 12%.", feedback: "The royalty is 12% OF partner sales, so divide by 0.12." },
      { label: money(k6.income.revenue), description: "Same as Kestrel's revenue.", feedback: "Kestrel only gets a 12% slice." },
      { label: money(k5.income.revenue / 0.12), description: "Last quarter's sales.", feedback: "That's the prior quarter, before the destocking." },
    ],
    `Partner sales = ${money(k6.income.revenue)} ÷ 12%. A royalty company's revenue moves with a business it does not control.`,
    { kind: "statement", companyId: KS.id, tab: "metrics", start: 4, count: 4, highlightColumn: 2 },
    "royalty-revenue",
  ),
  mc(
    "FIN-ST-K3",
    `${KS.ticker} sold new shares in ${k5.label} after its Phase 3 win: basic shares went from ${money(k4.income.sharesBasic)} to ${money(k5.income.sharesBasic)}. How much were holders diluted?`,
    "B",
    { label: spct(k5.income.sharesBasic / k4.income.sharesBasic - 1), description: "New ÷ old share count − 1." },
    [
      { label: spct(1 - k4.income.sharesBasic / k5.income.sharesBasic), description: "Measured against the new count.", feedback: "Dilution compares with the shares holders owned before the sale." },
      { label: spct(k5.cashFlow.equityIssued / k4.balance.cash), description: "Proceeds ÷ cash.", feedback: "That compares cash raised with cash held, not shares." },
      { label: "0.0%", description: "No dilution.", feedback: "Every new share is a smaller slice for existing holders." },
    ],
    `${money(k5.income.sharesBasic - k4.income.sharesBasic)} new shares on ${money(k4.income.sharesBasic)}. The raise lifted cash to ${money(k5.balance.cash)} and runway to about ${(runwayMonths(k5) ?? 0).toFixed(0)} months.`,
    { kind: "statement", companyId: KS.id, tab: "cashflow", start: 4, count: 4, highlightColumn: 1 },
    "follow-on-offering",
  ),
  mc(
    "FIN-ST-K4",
    `${KS.ticker}'s R&D went from ${money(k2.income.rnd)} (${k2.label}) to ${money(k3.income.rnd)} (${k3.label}). What is the most likely reason?`,
    "D",
    { label: "It stopped a program after a failed trial", description: "Program cut." },
    [
      { label: "Revenue fell, so R&D is capped at a % of sales", description: "Ratio cap.", feedback: "Revenue rose; biotech R&D is set by the pipeline, not by sales." },
      { label: "It moved R&D into SG&A to look better", description: "Reclassification.", feedback: "SG&A fell too; nothing was moved." },
      { label: "Its lead Phase 3 trial finished early", description: "Trial done.", feedback: "KESTREL-3 was still running; only enrollment was complete." },
    ],
    `R&D fell ${spct(k3.income.rnd / k2.income.rnd - 1)} after KB-207 missed its Phase 2 endpoint and was stopped: the clinical costs went away and the burn slowed.`,
    { kind: "statement", companyId: KS.id, tab: "income", start: 0, count: 4, highlightColumn: 3 },
    "clinical-trial-phases",
  ),
];

/* ------------------------------ earnings-preview ------------------------------ */

const eB1 = need(eventById("bayb-q2fy25"), "bayb-q2fy25");
const eK1 = need(eventById("kstl-q1fy26"), "kstl-q1fy26");

export const SECTOR_PREVIEW_QUESTIONS: QuizQuestion[] = [
  mc(
    "FIN-EP-B1",
    `${BK.name} reports ${BK.quarters[eB1.quarterIndex]!.label}. Deposit costs have been rising for two quarters. Which line in the preview matters most for a bank's earnings?`,
    "C",
    { label: "The net interest margin", description: "The spread." },
    [
      { label: "Gross margin", description: "Revenue − COGS.", feedback: "Banks have no cost of goods sold; their 'gross margin' is the interest spread." },
      { label: "Days of inventory", description: "Working capital.", feedback: "A bank holds no inventory; its product is loans." },
      { label: "Capex as % of sales", description: "Investment.", feedback: "Branch capex is small; the margin drives most of the earnings change." },
    ],
    "NII is most of a bank's revenue, and NIM shows whether funding costs are eating the spread. Watch NIM, credit (provision vs charge-offs) and capital.",
    { kind: "preview", eventId: eB1.id },
    "net-interest-margin",
  ),
  mc(
    "FIN-EP-K1",
    `${KS.name} reports ${KS.quarters[eK1.quarterIndex]!.label}. The stock is up ${eK1.expect.runUpPct}% into the print, the implied move is ±${eK1.expect.impliedMovePct}%, and its Phase 3 readout is still to come. What has the run-up most likely priced in?`,
    "A",
    { label: "Hope for the Phase 3 readout, not this quarter's royalties", description: "Catalyst positioning." },
    [
      { label: "A big royalty beat", description: "Earnings.", feedback: "Royalties are small and predictable; a 12% move is about the trial." },
      { label: "A share sale this quarter", description: "Dilution.", feedback: "A share sale usually pushes a stock DOWN." },
      { label: "Nothing: run-ups are random", description: "Noise.", feedback: "A 12% run-up into a quiet report usually has a reason, here the coming readout." },
    ],
    "When a stock runs into a report that cannot answer the question traders care about, an ordinary quarter is often sold: sell the news.",
    { kind: "preview", eventId: eK1.id },
    "pre-earnings-run-up",
  ),
];

/* ------------------------------ earnings-reaction ------------------------------ */

const rB = generateReaction(need(eventById("bayb-q2fy26"), "bayb-q2fy26"));
const rBr = resolveEvent(eventById("bayb-q2fy26")!);
const rK = generateReaction(need(eventById("kstl-q3fy26"), "kstl-q3fy26"));
const kRet10 = rK.bars[EVENT_INDEX + 10]!.close / rK.bars[EVENT_INDEX]!.close - 1;
const fullX = (eventId: string): FinancialsExhibit => ({ kind: "reaction", eventId, bars: "full" });

export const SECTOR_REACTION_QUESTIONS: QuizQuestion[] = [
  mc(
    "FIN-ER-B1",
    `${BK.ticker} gapped ${(rB.gap * 100).toFixed(1)}% on an EPS miss, then filled the gap within days. Its provision was ${money(rBr.quarter.bank!.provision)} vs net charge-offs of ${money(rBr.quarter.bank!.netChargeOffs)}. Why did buyers come back?`,
    "B",
    { label: "The miss was a reserve build, not realized losses; NII and capital held up", description: "Look through the provision." },
    [
      { label: "Charge-offs exploded", description: "Losses.", feedback: "Charge-offs were well below the provision: the bank reserved ahead of losses." },
      { label: "The bank raised guidance", description: "Guide.", feedback: "Guidance was maintained." },
      { label: "Short sellers were forced to cover", description: "Squeeze.", feedback: "Nothing in the print points to a squeeze; the fundamentals explain it." },
    ],
    "Separate one-off reserve builds from run-rate earnings: pre-provision net revenue rose and the margin beat, so the headline miss was overdone.",
    fullX("bayb-q2fy26"),
    "reserve-build",
  ),
  mc(
    "FIN-ER-K1",
    `${KS.ticker} gapped down on a royalty miss and a guidance cut. What did it do over the next 10 sessions?`,
    "D",
    { label: `Kept drifting lower: ${spct(kRet10)}`, description: "Post-earnings drift." },
    [
      { label: "Filled the gap", description: "Gap fill.", feedback: "Price never got back to the prior close." },
      { label: `Bounced: ${spct(-kRet10)}`, description: "Reversal.", feedback: "Closes kept making lower lows." },
      { label: "Went flat", description: "Chop.", feedback: "The drift is clearly lower." },
    ],
    "A miss plus a cut from a crowded long often drifts for days as holders and analysts reset expectations.",
    fullX("kstl-q3fy26"),
    "post-earnings-drift",
  ),
];
