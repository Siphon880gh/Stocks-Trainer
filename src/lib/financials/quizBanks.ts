/**
 * FE6 quiz banks: statements-reading, cash-forecast-13wk, earnings-preview, earnings-reaction.
 * Every number in a prompt or option is computed from the fictional fixtures (never hand-typed),
 * and financialsQuiz.test.ts recomputes the correct answers independently from raw fields.
 * SAMPLE / STYLIZED: fictional companies, not live filings, not trading advice.
 */
import type { QuizOption, QuizQuestion } from "../quizData";
import { applyWhatIf, computeForecast, type WhatIf } from "./cashForecast";
import { forecastById } from "./cashForecastFixtures";
import { companyById } from "./companies";
import { eventById, midpoint, resolveEvent } from "./earningsEvents";
import { fmtMonths, fmtX } from "./format";
import { ebitda, monthlyBurn, netLeverage } from "./metrics";
import type { FinancialsExhibit } from "./quizExhibit";
import { EVENT_INDEX, generateReaction } from "./reactionCharts";
import { SECTOR_PREVIEW_QUESTIONS, SECTOR_REACTION_QUESTIONS, SECTOR_STATEMENT_QUESTIONS } from "./quizBanksSector";

export type FinancialsQuizGroupId = "statements-reading" | "cash-forecast-13wk" | "earnings-preview" | "earnings-reaction";

type Letter = "A" | "B" | "C" | "D";
interface Choice {
  label: string;
  description: string;
  feedback?: string;
}

const LETTERS: Letter[] = ["A", "B", "C", "D"];

/** Minus sign, thousands separators, "k" suffix: −6,717k. */
export const money = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(Math.round(n)).toLocaleString("en-US")}k`;
/** Signed percent: +12.3% / −20.0%. */
export const spct = (x: number, digits = 1) => `${x < 0 ? "−" : x > 0 ? "+" : ""}${Math.abs(x * 100).toFixed(digits)}%`;
/** Unsigned-positive percent for levels like margins: 75.0% / −20.0%. */
export const pct = (x: number, digits = 1) => `${x < 0 ? "−" : ""}${Math.abs(x * 100).toFixed(digits)}%`;
/** Plain number with a real minus sign. */
export const num = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("en-US")}`;
export const usd = (n: number) => `$${n.toFixed(2)}`;
/** EPS with a minus sign: −$0.12 / $0.20. */
export const epsLabel = (n: number) => `${n < 0 ? "−" : ""}$${Math.abs(n).toFixed(2)}`;

function mc(
  id: string,
  prompt: string,
  at: Letter,
  right: Choice,
  wrong: Choice[],
  explanation: string,
  financialsExhibit: FinancialsExhibit,
  glossaryTermId?: string,
): QuizQuestion {
  const ordered: Choice[] = [...wrong];
  ordered.splice(LETTERS.indexOf(at), 0, right);
  const options: QuizOption[] = ordered.map((c, i) => ({ id: LETTERS[i]!, ...c }));
  return { id, prompt, correctAnswer: at, options, explanation, financialsExhibit, glossaryTermId };
}

const need = <T,>(x: T | undefined, what: string): T => {
  if (x === undefined) throw new Error(`quizBanks: missing ${what}`);
  return x;
};
const NW = need(companyById("northwind-cloud"), "northwind-cloud");
const HB = need(companyById("harbor-pine"), "harbor-pine");
const IB = need(companyById("ironbridge-industrial"), "ironbridge-industrial");
const q = (c: typeof NW, i: number) => need(c.quarters[i], `${c.id} quarter ${i}`);

/* ------------------------------ statements-reading ------------------------------ */

const nw0 = q(NW, 0).income;
const nw7 = q(NW, 7).income;
const nwCf0 = q(NW, 0).cashFlow;
const ibQ4 = q(IB, 3);
const hbInvNow = q(HB, 6).balance.inventory;
const hbInvYearAgo = q(HB, 2).balance.inventory;
const hbInvLastQ = q(HB, 5).balance.inventory;
const nwShares3 = q(NW, 3).income.sharesDiluted;
const nwShares4 = q(NW, 4).income.sharesDiluted;
const nwCf4 = q(NW, 4).cashFlow;
const ib7 = q(IB, 7);
const ibDebt7 = ib7.balance.shortTermDebt + ib7.balance.longTermDebt;
const ibNetDebt7 = ibDebt7 - ib7.balance.cash;
const ibLev7 = need(netLeverage(IB, 7) ?? undefined, "IB net leverage");
const nw3 = q(NW, 3);
const nwBurn3 = monthlyBurn(nw3);

export const STATEMENTS_READING_QUESTIONS: QuizQuestion[] = [
  mc(
    "FIN-ST-01",
    `${NW.name} (${NW.ticker}), ${q(NW, 0).label}: what is the gross margin?`,
    "B",
    { label: pct(nw0.grossProfit / nw0.revenue), description: "Gross profit ÷ revenue." },
    [
      { label: pct(nw0.cogs / nw0.revenue), description: "Cost of goods sold ÷ revenue.", feedback: "That's the cost share, the other side of gross margin." },
      { label: pct(nw0.operatingIncome / nw0.revenue), description: "Operating income ÷ revenue.", feedback: "That's operating margin: it also subtracts R&D and SG&A." },
      { label: pct(nw0.netIncome / nw0.revenue), description: "Net income ÷ revenue.", feedback: "That's net margin, the bottom line." },
    ],
    `Gross margin = gross profit ÷ revenue = ${money(nw0.grossProfit)} ÷ ${money(nw0.revenue)}. Software keeps most of each sale before operating costs.`,
    { kind: "statement", companyId: NW.id, tab: "income", start: 0, count: 1 },
    "gross-margin",
  ),
  mc(
    "FIN-ST-02",
    `${NW.ticker}'s operating margin was ${pct(nw0.operatingIncome / nw0.revenue)} in ${q(NW, 0).label}. What is it in ${q(NW, 7).label}?`,
    "D",
    { label: pct(nw7.operatingIncome / nw7.revenue), description: "Operating income ÷ revenue." },
    [
      { label: pct(nw7.grossProfit / nw7.revenue), description: "Gross profit ÷ revenue.", feedback: "Gross margin has stayed near 75% all along; the change is below the gross line." },
      { label: pct(nw7.netIncome / nw7.revenue), description: "Net income ÷ revenue.", feedback: "That's net margin (after other income)." },
      { label: pct(-nw7.operatingIncome / nw7.revenue), description: "Sign flipped.", feedback: "Operating income is still a small loss, so the margin is negative." },
    ],
    "Revenue grew ~8% a quarter while operating costs grew slower: operating leverage pulled the margin from deep red to nearly breakeven, with gross margin flat.",
    { kind: "statement", companyId: NW.id, tab: "income", start: 4, count: 4, highlightColumn: 3 },
    "operating-income",
  ),
  mc(
    "FIN-ST-03",
    `${NW.ticker}, ${q(NW, 0).label}: what is free cash flow?`,
    "A",
    { label: money(nwCf0.cfo + nwCf0.capex), description: "Operating cash flow + capex (capex is already negative)." },
    [
      { label: money(nwCf0.cfo - nwCf0.capex), description: "Capex added back.", feedback: "Capex is a cash outflow; subtract it, don't add it back." },
      { label: money(nwCf0.cfo), description: "Operating cash flow only.", feedback: "FCF also pays for the capex the business needs." },
      { label: money(nwCf0.netIncome), description: "Net income.", feedback: "Net income is an accounting profit, not cash." },
    ],
    `FCF = CFO ${money(nwCf0.cfo)} + capex ${money(nwCf0.capex)}. Negative FCF is cash burn: the company funds it from its cash pile.`,
    { kind: "statement", companyId: NW.id, tab: "cashflow", start: 0, count: 1 },
    "free-cash-flow",
  ),
  mc(
    "FIN-ST-04",
    `${IB.name} (${IB.ticker}), ${ibQ4.label}: what is interest coverage (operating income ÷ interest expense)?`,
    "C",
    { label: fmtX(ibQ4.income.operatingIncome / ibQ4.income.interestExpense), description: "Times interest is covered by operating profit." },
    [
      { label: fmtX(ibQ4.income.interestExpense / ibQ4.income.operatingIncome), description: "Inverted.", feedback: "Coverage puts operating income on top." },
      { label: fmtX(netLeverage(IB, 3)), description: "Net debt ÷ TTM EBITDA.", feedback: "That's net leverage, a different credit ratio." },
      { label: fmtX(ebitda(ibQ4) / ibQ4.income.interestExpense), description: "EBITDA ÷ interest.", feedback: "That adds back depreciation (EBITDA coverage); the question asks for operating income." },
    ],
    `Coverage = ${money(ibQ4.income.operatingIncome)} ÷ ${money(ibQ4.income.interestExpense)}. Under ~3× means a bad year could squeeze debt payments.`,
    { kind: "statement", companyId: IB.id, tab: "income", start: 0, count: 4, highlightColumn: 3 },
    "interest-coverage",
  ),
  mc(
    "FIN-ST-05",
    `${HB.name} (${HB.ticker}): inventory at ${q(HB, 6).label} vs a year earlier (${q(HB, 2).label}) grew by…`,
    "B",
    { label: spct(hbInvNow / hbInvYearAgo - 1), description: "Same quarter last year, so the seasonal build cancels out." },
    [
      { label: spct(q(HB, 6).income.revenue / q(HB, 2).income.revenue - 1), description: "Revenue growth.", feedback: "That's sales growth; the point is that inventory grew much faster." },
      { label: spct(hbInvNow / hbInvLastQ - 1), description: "Vs last quarter.", feedback: "A retailer always builds stock before the holidays; compare to the same quarter last year." },
      { label: spct(-(hbInvNow / hbInvYearAgo - 1)), description: "Sign flipped.", feedback: "Inventory went up, not down." },
    ],
    "Inventory up ~11% while sales grew ~1.5%: the store bought more than it is selling. That is a markdown risk for the holiday quarter.",
    { kind: "statement", companyId: HB.id, tab: "balance", start: 2, count: 5, highlightColumn: 4 },
    "inventory-days",
  ),
  mc(
    "FIN-ST-06",
    `Reading ${HB.ticker}'s balance sheet from ${q(HB, 2).label} to ${q(HB, 6).label}, which line is the red flag?`,
    "C",
    { label: "Inventory is growing much faster than sales", description: "Stock piling up ahead of the holidays." },
    [
      { label: "Receivables are ballooning", description: "Customers paying late.", feedback: "A store gets paid at the till: receivables stay tiny (about 4 days of sales)." },
      { label: "Cash went up a lot", description: "More cash than a year ago.", feedback: "Cash is lower than a year ago; the inventory build used it." },
      { label: "Nothing: every line moved with sales", description: "All in proportion.", feedback: "Inventory did not move with sales." },
    ],
    "Inventory days rose while comps slowed. Extra stock usually has to be cleared at a discount, which hits margins later.",
    { kind: "statement", companyId: HB.id, tab: "balance", start: 2, count: 5, highlightColumn: 4 },
    "working-capital",
  ),
  mc(
    "FIN-ST-07",
    `${NW.ticker}: diluted shares from ${q(NW, 3).label} to ${q(NW, 4).label} changed by…`,
    "A",
    { label: spct(nwShares4 / nwShares3 - 1), description: "New shares were issued." },
    [
      { label: spct(q(NW, 3).income.sharesDiluted / q(NW, 2).income.sharesDiluted - 1), description: "A normal quarter.", feedback: "That's the usual creep from stock comp; this quarter was a share sale." },
      { label: spct(q(NW, 4).income.revenue / q(NW, 3).income.revenue - 1), description: "Revenue growth.", feedback: "That's revenue, not shares." },
      { label: spct(-(nwShares4 / nwShares3 - 1)), description: "Sign flipped.", feedback: "The share count rose: each old share now owns less of the company." },
    ],
    "A big jump in the share count is dilution: the loss per share can shrink just because there are more shares, even if the loss doesn't.",
    { kind: "statement", companyId: NW.id, tab: "income", start: 3, count: 2, highlightColumn: 1 },
    "dilution",
  ),
  mc(
    "FIN-ST-08",
    `${NW.ticker}'s cash jumped from ${money(nw3.balance.cash)} to ${money(q(NW, 4).balance.cash)} in ${q(NW, 4).label}. Where did it come from?`,
    "D",
    { label: `Selling new shares (${money(nwCf4.equityIssued)})`, description: "Financing cash flow." },
    [
      { label: "Operating cash flow", description: "The business itself.", feedback: `Operating cash flow was ${money(nwCf4.cfo)} that quarter.` },
      { label: "New borrowing", description: "Debt issued.", feedback: "Northwind has no debt; check the financing lines." },
      { label: "Collecting receivables faster", description: "Working capital.", feedback: "Receivables went up, which uses cash." },
    ],
    "The cash-flow statement shows the source: almost all of the increase is equity issued. Runway got longer, but not because the business improved.",
    { kind: "statement", companyId: NW.id, tab: "cashflow", start: 3, count: 2, highlightColumn: 1 },
    "dilution",
  ),
  mc(
    "FIN-ST-09",
    `${IB.ticker}, ${ib7.label}: what is net debt?`,
    "B",
    { label: money(ibNetDebt7), description: "Total debt − cash." },
    [
      { label: money(ibDebt7), description: "Total debt.", feedback: "Net debt subtracts the cash on hand." },
      { label: money(ibDebt7 + ib7.balance.cash), description: "Debt + cash.", feedback: "Cash offsets debt; subtract it." },
      { label: money(ib7.balance.cash), description: "Cash.", feedback: "That's the cash line only." },
    ],
    `Net debt = short- plus long-term debt ${money(ibDebt7)} − cash ${money(ib7.balance.cash)}.`,
    { kind: "statement", companyId: IB.id, tab: "balance", start: 4, count: 4, highlightColumn: 3 },
    "net-debt",
  ),
  mc(
    "FIN-ST-10",
    `${IB.ticker}'s loan has a ${fmtX(need(IB.covenant, "covenant").maxNetLeverage)} net leverage covenant. What is net leverage (net debt ÷ trailing-12-month EBITDA) at ${ib7.label}?`,
    "C",
    { label: fmtX(ibLev7), description: "Net debt ÷ the last four quarters of EBITDA." },
    [
      { label: fmtX(need(IB.covenant, "covenant").maxNetLeverage), description: "The covenant limit.", feedback: "That's the ceiling, not where the ratio is." },
      { label: fmtX(ibNetDebt7 / ebitda(ib7)), description: "One quarter of EBITDA.", feedback: "Leverage uses a full year (trailing 12 months) of EBITDA." },
      { label: fmtX(ibDebt7 / ibNetDebt7), description: "Debt ÷ net debt.", feedback: "Not a leverage ratio." },
    ],
    "Leverage rose from about 2.5× to about 2.9× as EBITDA fell while debt only came down 5,000k a quarter: the headroom under 3.5× is shrinking.",
    { kind: "statement", companyId: IB.id, tab: "metrics", start: 4, count: 4, highlightColumn: 3 },
    "net-leverage",
  ),
  mc(
    "FIN-ST-11",
    `${NW.ticker}, ${nw3.label}: cash ${money(nw3.balance.cash)}, burning about ${money(nwBurn3)} a month. Runway?`,
    "A",
    { label: fmtMonths(nw3.balance.cash / nwBurn3), description: "Cash ÷ monthly burn." },
    [
      { label: fmtMonths(nw3.balance.cash / (nwBurn3 * 3)), description: "Divided by a quarter's burn.", feedback: "That divides by quarterly burn but labels it months." },
      { label: fmtMonths(nw3.balance.cash / (-nw3.income.netIncome / 3)), description: "Used net loss as burn.", feedback: "Burn is cash out the door (free cash flow), not the accounting loss." },
      { label: "Not burning", description: "Positive cash flow.", feedback: "Free cash flow was negative that quarter." },
    ],
    "Runway = cash ÷ monthly burn, where burn = −free cash flow ÷ 3. Under ~18 months is when companies usually raise money, which Northwind did next quarter.",
    { kind: "statement", companyId: NW.id, tab: "metrics", start: 0, count: 4, highlightColumn: 3 },
    "cash-burn",
  ),
  mc(
    "FIN-ST-12",
    `${HB.ticker}'s revenue fell from ${money(q(HB, 3).income.revenue)} (${q(HB, 3).label}) to ${money(q(HB, 4).income.revenue)} (${q(HB, 4).label}). Which number tells you whether demand actually weakened?`,
    "D",
    { label: `Year over year: ${spct(q(HB, 4).income.revenue / q(HB, 0).income.revenue - 1)}`, description: "Same quarter last year." },
    [
      { label: `Quarter over quarter: ${spct(q(HB, 4).income.revenue / q(HB, 3).income.revenue - 1)}`, description: "Vs the holiday quarter.", feedback: "The holiday quarter is always the biggest: QoQ for a seasonal business mostly measures the calendar." },
      { label: `Quarter over quarter: ${spct(-(q(HB, 4).income.revenue / q(HB, 3).income.revenue - 1))}`, description: "Sign flipped.", feedback: "Revenue fell QoQ, and QoQ is the wrong lens anyway." },
      { label: `Gross margin: ${pct(q(HB, 4).income.grossProfit / q(HB, 4).income.revenue)}`, description: "Profitability.", feedback: "Margin shows profitability, not demand." },
    ],
    "For a seasonal company, compare each quarter to the same quarter a year ago. Q1 FY26 is up slightly on Q1 FY25: the drop is seasonal, not a collapse.",
    { kind: "statement", companyId: HB.id, tab: "income", start: 0, count: 5, highlightColumn: 4 },
    "income-statement",
  ),
  mc(
    "FIN-ST-13",
    `${IB.ticker}, ${ib7.label}: net income ${money(ib7.income.netIncome)}, diluted shares ${money(ib7.income.sharesDiluted)}. Diluted EPS?`,
    "B",
    { label: epsLabel(Math.round((ib7.income.netIncome / ib7.income.sharesDiluted) * 100) / 100), description: "Net income ÷ diluted shares." },
    [
      { label: epsLabel(Math.round((ib7.income.operatingIncome / ib7.income.sharesDiluted) * 100) / 100), description: "Operating income per share.", feedback: "EPS is after interest and tax: use net income." },
      { label: epsLabel(Math.round((ib7.income.revenue / ib7.income.sharesDiluted) * 100) / 100), description: "Revenue per share.", feedback: "That's sales per share." },
      { label: epsLabel(Math.round((ib7.income.netIncome / ib7.income.sharesDiluted) * 10) / 100), description: "Off by ten.", feedback: "Both numbers are in thousands, so the thousands cancel." },
    ],
    "Net income and shares are both in thousands, so EPS = net income ÷ diluted shares directly, in dollars.",
    { kind: "statement", companyId: IB.id, tab: "income", start: 4, count: 4, highlightColumn: 3 },
    "eps",
  ),
];

/* ------------------------------ cash-forecast-13wk ------------------------------ */

const fc = (id: string, w: WhatIf = {}) => computeForecast(applyWhatIf(need(forecastById(id), id), w));
const IRB = "ironbridge-debt-service";
const HBS = "harbor-collections-slip";
const NWR = "northwind-runway";
const L1 = "level1-replica";
const ibNoRev = fc(IRB, { useRevolver: false });
const ibRev = fc(IRB);
const ibDefer = fc(IRB, { deferCapex: true });
const hbRev = fc(HBS);
const hbNoRev = fc(HBS, { useRevolver: false });
const hbDelay = fc(HBS, { delayCollections: true });
const nwRun = fc(NWR);
const nwDefer = fc(NWR, { deferCapex: true });
const l1 = fc(L1);
const l1Delay = fc(L1, { delayCollections: true });
const maxDraw = (r: typeof hbRev) => Math.max(...r.weeks.map((w) => w.draw));
const weekLabel = (n: number | null) => (n === null ? "No week" : `Week ${n}`);
const l1DownWeeks = l1.weeks.filter((w) => w.net < 0).map((w) => w.week);

export const CASH_FORECAST_QUESTIONS: QuizQuestion[] = [
  mc(
    "FIN-CF-01",
    `${ibNoRev.input.title}, with the revolver switched off: which week first drops below the ${money(ibNoRev.input.minCash)} minimum?`,
    "C",
    { label: weekLabel(ibNoRev.firstBreachWeek), description: "Ending cash < minimum." },
    [
      { label: "Week 1", description: "Opening week.", feedback: "Week 1 still ends above the minimum." },
      { label: "Week 9", description: "A low week.", feedback: "Week 9 dips close to the line but the first breach comes earlier." },
      { label: "Week 13", description: "The last week.", feedback: "Look for the first red week, not the last." },
    ],
    "Read the ending-cash row against the minimum line: the first week it is below the line is the breach, here the week the quarterly interest goes out.",
    { kind: "forecast", forecastId: IRB, whatIf: { useRevolver: false } },
    "minimum-cash",
  ),
  mc(
    "FIN-CF-02",
    `${ibNoRev.input.title}, revolver off: how much would you need to draw to keep the lowest week at the minimum?`,
    "A",
    { label: money(ibNoRev.input.minCash - ibNoRev.lowestCash), description: "Minimum − lowest ending cash." },
    [
      { label: money(ibNoRev.lowestCash), description: "The lowest balance.", feedback: "That's how much cash is left, not the gap to the minimum." },
      { label: money(ibNoRev.input.minCash), description: "The minimum.", feedback: "You only need to fill the shortfall." },
      { label: money(need(ibNoRev.input.revolver, "revolver").limit), description: "The revolver limit.", feedback: "The limit is how much you could draw, not how much you need." },
    ],
    "The draw needed is the shortfall in the worst week. With the revolver on, the model draws exactly that and repays it once cash is above the minimum plus the cushion.",
    { kind: "forecast", forecastId: IRB, whatIf: { useRevolver: false } },
    "revolver",
  ),
  mc(
    "FIN-CF-03",
    `${hbRev.input.title}: what is the peak revolver balance over the 13 weeks?`,
    "B",
    { label: money(hbRev.peakRevolver), description: "Highest balance outstanding." },
    [
      { label: money(maxDraw(hbRev)), description: "The biggest single draw.", feedback: "Draws stack up over several weeks before any repayment." },
      { label: money(need(hbRev.input.revolver, "revolver").limit), description: "The limit.", feedback: "That's the ceiling, which was never reached." },
      { label: money(hbRev.input.minCash), description: "The minimum cash.", feedback: "That's the floor the revolver protects." },
    ],
    "Peak revolver = the most borrowed at any one time. Compare it to the limit to see how much room is left if things get worse.",
    { kind: "forecast", forecastId: HBS },
    "revolver",
  ),
  mc(
    "FIN-CF-04",
    `${hbNoRev.input.title}, revolver off: how many weeks end below the minimum?`,
    "D",
    { label: `${hbNoRev.breachWeeks.length} weeks (weeks ${hbNoRev.breachWeeks[0]}–${hbNoRev.breachWeeks[hbNoRev.breachWeeks.length - 1]})`, description: "Count the red weeks." },
    [
      { label: "1 week", description: "Only the low point.", feedback: "Cash stays below the line for several weeks before collections catch up." },
      { label: "2 weeks", description: "A short dip.", feedback: "Count every week that ends below the minimum." },
      { label: "13 weeks", description: "All of them.", feedback: "The early weeks are comfortably above the minimum." },
    ],
    "A breach that lasts several weeks needs a funding plan (a revolver or a cut), not a one-off fix.",
    { kind: "forecast", forecastId: HBS, whatIf: { useRevolver: false } },
    "thirteen-week-cash-flow",
  ),
  mc(
    "FIN-CF-05",
    `${hbDelay.input.title}: if every week's collections arrive one week late, what does the peak revolver become?`,
    "A",
    { label: money(hbDelay.peakRevolver), description: "Recomputed with the delay." },
    [
      { label: money(hbRev.peakRevolver), description: "Unchanged.", feedback: "A week of collections missing from the window adds to the borrowing." },
      { label: money(need(hbDelay.input.revolver, "revolver").limit), description: "Maxed out.", feedback: "It rises, but stays under the limit." },
      { label: money(0), description: "Not needed.", feedback: "The delay makes the squeeze worse, not better." },
    ],
    "Slower collections are a classic 13-week stress test: the same sales, a week later, means more borrowing in the trough.",
    { kind: "forecast", forecastId: HBS, whatIf: { delayCollections: true } },
    "accounts-receivable",
  ),
  mc(
    "FIN-CF-06",
    `${nwRun.input.title}: which week first ends below the ${money(nwRun.input.minCash)} minimum?`,
    "C",
    { label: weekLabel(nwRun.firstBreachWeek), description: "First red week." },
    [
      { label: "Week 4", description: "An early dip.", feedback: "Cash falls each payroll week but stays above the minimum here." },
      { label: "Week 8", description: "Halfway.", feedback: "Still above the line." },
      { label: "No week", description: "Never breaches.", feedback: "One week near the end ends below the minimum." },
    ],
    "A cash burner's forecast slopes down. The breach week is the deadline for raising money or cutting costs.",
    { kind: "forecast", forecastId: NWR },
    "cash-burn",
  ),
  mc(
    "FIN-CF-07",
    `${nwDefer.input.title}: does pushing all capex out of the 13 weeks avoid the breach?`,
    "B",
    { label: `Yes: the low week is ${money(nwDefer.lowestCash)}, above the ${money(nwDefer.input.minCash)} minimum`, description: "Recomputed without capex." },
    [
      { label: `No: it still breaches in week ${nwRun.firstBreachWeek}`, description: "Unchanged.", feedback: "Recompute: without capex the lowest week clears the minimum." },
      { label: "It only moves the breach to week 13", description: "Delays it.", feedback: "No week ends below the minimum once capex is deferred." },
      { label: "Capex isn't in this forecast", description: "No capex row.", feedback: "There is a capex row; deferring it is the what-if." },
    ],
    "Deferring capex buys time, but only by a few thousand: the burn is still there, so the real fix is the plan behind the forecast.",
    { kind: "forecast", forecastId: NWR, whatIf: { deferCapex: true } },
    "capex",
  ),
  mc(
    "FIN-CF-08",
    `${l1.input.title}: in which week does cash go down?`,
    "B",
    { label: `Week ${l1DownWeeks[0]}`, description: "Net cash flow is negative." },
    [
      { label: "Week 1", description: "The start.", feedback: "Cash in beats cash out in week 1." },
      { label: "Week 10", description: "After the dip.", feedback: "Week 10 is back to positive." },
      { label: "Week 13", description: "The end.", feedback: "Cash is rising at the end." },
    ],
    "Ending cash = beginning cash + cash in − cash out. The one week with a big inventory payment is the only week cash falls.",
    { kind: "forecast", forecastId: L1 },
    "thirteen-week-cash-flow",
  ),
  mc(
    "FIN-CF-09",
    `${l1Delay.input.title}: if every "cash in" arrives one week late, what is week 1's ending cash?`,
    "D",
    { label: num(l1Delay.weeks[0]!.ending), description: "Beginning cash − week 1 outflows, with no cash in." },
    [
      { label: num(l1.weeks[0]!.ending), description: "Unchanged.", feedback: "Week 1 now gets no cash in at all." },
      { label: num(l1.input.beginningCash), description: "The opening balance.", feedback: "The week's outflows still go out." },
      { label: "0", description: "Exactly zero.", feedback: "Work it through: beginning cash minus the outflows." },
    ],
    "A timing slip alone can push cash below zero even when the business is profitable: that is why treasurers watch weekly, not quarterly.",
    { kind: "forecast", forecastId: L1 },
    "thirteen-week-cash-flow",
  ),
  mc(
    "FIN-CF-10",
    `${ibDefer.input.title}: with capex deferred out of the window, is the revolver still needed?`,
    "A",
    { label: `No: the low week is ${money(ibDefer.lowestCash)}, above ${money(ibDefer.input.minCash)}`, description: "Peak revolver is zero." },
    [
      { label: `Yes: the same ${money(ibRev.peakRevolver)} draw in week ${ibNoRev.firstBreachWeek}`, description: "Unchanged.", feedback: "Without capex the interest week no longer dips below the minimum." },
      { label: "Yes: it breaches every week", description: "Worse.", feedback: "Deferring an outflow can only raise cash." },
      { label: `Yes: a ${money(ibDefer.input.minCash)} draw`, description: "Draw the minimum.", feedback: "The revolver only fills a shortfall." },
    ],
    "Capex is the most flexible outflow in a squeeze; a lender will often ask which projects can wait.",
    { kind: "forecast", forecastId: IRB, whatIf: { deferCapex: true } },
    "capex",
  ),
  mc(
    "FIN-CF-11",
    "Why do treasurers build a 13-week cash forecast week by week from receipts and payments, instead of using the quarterly cash-flow statement?",
    "C",
    { label: "It shows the timing: the exact week cash runs short", description: "Direct method, weekly." },
    [
      { label: "It is required for the 10-Q", description: "A filing.", feedback: "It's an internal tool, not a filing." },
      { label: "It replaces the income statement", description: "Profit.", feedback: "It tracks cash, not profit." },
      { label: "It predicts the stock price", description: "Markets.", feedback: "It's about liquidity, not price." },
    ],
    "Quarterly totals hide the trough. A weekly view shows the week payroll and interest collide with slow collections, early enough to act.",
    { kind: "forecast", forecastId: L1 },
    "thirteen-week-cash-flow",
  ),
];

/* ------------------------------ earnings-preview ------------------------------ */

const ev = (id: string) => need(eventById(id), id);
const e1 = ev("nwcl-q2fy25");
const eHbRun = ev("hbpn-q1fy26");
const eNwRaise = ev("nwcl-q4fy26");
const eIbCut = ev("irbg-q1fy26");
const eNwSell = ev("nwcl-q4fy25");
const eIbMuted = ev("irbg-q3fy25");
const r = resolveEvent;
const guideVsStreet = (e: typeof e1) => midpoint(e.newGuidance) / e.nextQuarterConsensusRevenue - 1;
const band = (close: number, pct: number) => `${usd(close * (1 - pct))}–${usd(close * (1 + pct))}`;
const kpiOf = (e: typeof e1) => need(r(e).kpiActuals[0], `${e.id} kpi`);

export const EARNINGS_PREVIEW_QUESTIONS: QuizQuestion[] = [
  mc(
    "FIN-EP-01",
    `${r(e1).company.ticker} guided this quarter's revenue to ${money(e1.expect.priorGuidance.low)}–${money(e1.expect.priorGuidance.high)}. What is the midpoint?`,
    "B",
    { label: money(midpoint(e1.expect.priorGuidance)), description: "(low + high) ÷ 2." },
    [
      { label: money(e1.expect.priorGuidance.low), description: "The low end.", feedback: "The midpoint sits halfway between the two ends." },
      { label: money(e1.expect.consensusRevenue), description: "Consensus.", feedback: "That's the street's number; compare it with the midpoint." },
      { label: money(e1.expect.priorGuidance.high), description: "The high end.", feedback: "The midpoint sits halfway between the two ends." },
    ],
    "Analysts compare consensus to the guidance midpoint: consensus above the midpoint means the street already expects the top half of the range.",
    { kind: "preview", eventId: e1.id },
    "guidance",
  ),
  mc(
    "FIN-EP-02",
    `${r(e1).company.ticker} closed at ${usd(e1.priorClose)} with an implied move of ±${e1.expect.impliedMovePct}%. What range is the options market pricing for report day?`,
    "C",
    { label: band(e1.priorClose, e1.expect.impliedMovePct / 100), description: "Close × (1 ± implied move)." },
    [
      { label: `${usd(e1.priorClose - e1.expect.impliedMovePct)}–${usd(e1.priorClose + e1.expect.impliedMovePct)}`, description: "Dollars, not percent.", feedback: "The implied move is a percent of the price." },
      { label: band(e1.priorClose, e1.expect.impliedMovePct / 200), description: "Half the move.", feedback: "± already means each direction gets the full move." },
      { label: `${usd(e1.priorClose)}–${usd(e1.priorClose * (1 + e1.expect.impliedMovePct / 100))}`, description: "Upside only.", feedback: "The implied move is a band in both directions." },
    ],
    "The implied move is the options market's guess at the size of the move, not its direction. A move inside the band is 'priced in'.",
    { kind: "preview", eventId: e1.id },
    "implied-move",
  ),
  mc(
    "FIN-EP-03",
    `${r(eHbRun).company.ticker}: consensus EPS is ${usd(eHbRun.expect.consensusEps)} and the whisper is ${usd(need(eHbRun.expect.whisperEps, "whisper"))}. If EPS prints exactly at consensus, which bar did it miss?`,
    "A",
    { label: `The whisper: ${usd(need(eHbRun.expect.whisperEps, "whisper"))}, ${Math.round((need(eHbRun.expect.whisperEps, "whisper") - eHbRun.expect.consensusEps) * 100)}¢ higher`, description: "The unofficial number traders hoped for." },
    [
      { label: "Consensus", description: "The published estimate.", feedback: "Printing at consensus is in line by definition." },
      { label: "Company guidance", description: "The company's range.", feedback: "Guidance is about revenue here; the question is about EPS." },
      { label: "None: in line is always fine", description: "No bar missed.", feedback: "When the whisper is higher, in line can disappoint." },
    ],
    "When the whisper sits above consensus, the real bar is the whisper. An in-line print can then trade like a miss.",
    { kind: "preview", eventId: eHbRun.id },
    "consensus-estimate",
  ),
  mc(
    "FIN-EP-04",
    `${r(eHbRun).company.ticker} ran up ${eHbRun.expect.runUpPct}% into the report against an implied move of ±${eHbRun.expect.impliedMovePct}%. What does that suggest?`,
    "D",
    { label: "A lot of good news is already priced in; the bar is higher", description: "Run-up bigger than the implied move." },
    [
      { label: "The report will surely beat", description: "Momentum.", feedback: "A run-up says what traders hope, not what the company will report." },
      { label: "Options are mispriced", description: "Vol.", feedback: "The implied move covers report day; the run-up already happened." },
      { label: "Nothing: price before the report doesn't matter", description: "Ignore it.", feedback: "Positioning into the print shapes the reaction." },
    ],
    "A run-up bigger than the implied move means buyers moved early. Without a raise, 'sell the news' is common.",
    { kind: "preview", eventId: eHbRun.id },
    "pre-earnings-run-up",
  ),
  mc(
    "FIN-EP-05",
    `${r(eNwRaise).company.ticker} guided next quarter to ${money(eNwRaise.newGuidance.low)}–${money(eNwRaise.newGuidance.high)}; the street was at ${money(eNwRaise.nextQuarterConsensusRevenue)}. How does the market read it?`,
    "C",
    { label: `Raise: the midpoint is ${spct(guideVsStreet(eNwRaise))} vs the street`, description: "Midpoint vs next-quarter consensus, ±1% band." },
    [
      { label: "Maintain: within the ±1% band", description: "No change.", feedback: "The midpoint is well over 1% above the street." },
      { label: "Cut", description: "Lower.", feedback: "The range sits above the street's number." },
      { label: "Can't tell without EPS guidance", description: "Need more.", feedback: "Revenue guidance midpoint vs consensus is enough to call it." },
    ],
    "Guidance is judged against what the street expected for next quarter, not against last quarter's number.",
    { kind: "preview", eventId: eNwRaise.id, revealActuals: true },
    "guidance-raise-cut",
  ),
  mc(
    "FIN-EP-06",
    `${r(eIbCut).company.ticker} beat on EPS but guided next quarter to ${money(eIbCut.newGuidance.low)}–${money(eIbCut.newGuidance.high)} vs a street at ${money(eIbCut.nextQuarterConsensusRevenue)}. What is the guidance call?`,
    "B",
    { label: `Cut: the midpoint is ${spct(guideVsStreet(eIbCut))} vs the street`, description: "Midpoint below consensus by more than 1%." },
    [
      { label: "Raise: the EPS beat", description: "Headline.", feedback: "The beat is about this quarter; guidance is about the next one." },
      { label: "Maintain: the range barely moved", description: "Small change.", feedback: "The midpoint is more than 1% below the street." },
      { label: "Raise: the range is wider", description: "Width.", feedback: "Width isn't direction; compare the midpoint." },
    ],
    "A beat with a guidance cut is the classic 'guidance reversal': the market prices the future, so the cut usually wins.",
    { kind: "preview", eventId: eIbCut.id, revealActuals: true },
    "guidance-raise-cut",
  ),
  mc(
    "FIN-EP-07",
    `${r(eNwSell).company.ticker} reported EPS of ${epsLabel(r(eNwSell).actualEps)} vs consensus ${epsLabel(eNwSell.expect.consensusEps)}. Beat, in line or miss?`,
    "A",
    { label: "Beat: a smaller loss than expected", description: `${Math.round(Math.abs(r(eNwSell).actualEps - eNwSell.expect.consensusEps) * 100)}¢ better than consensus.` },
    [
      { label: "Miss: it's still a loss", description: "Sign.", feedback: "The test is vs the estimate, not vs zero." },
      { label: "In line: one cent is noise", description: "Too small.", feedback: "In this app a difference of a cent or more counts as a beat or a miss." },
      { label: "Can't tell for a loss-making company", description: "N/A.", feedback: "Losses are compared to the estimate the same way." },
    ],
    "Beat or miss is always vs consensus. For a loss-maker, less negative than expected is a beat.",
    { kind: "preview", eventId: eNwSell.id, revealActuals: true },
    "earnings-surprise",
  ),
  mc(
    "FIN-EP-08",
    `${r(eNwSell).company.ticker} revenue came in at ${money(r(eNwSell).actualRevenue)} vs consensus ${money(eNwSell.expect.consensusRevenue)}. Using a ±1% band, how is it scored?`,
    "D",
    { label: `In line: ${spct(r(eNwSell).actualRevenue / eNwSell.expect.consensusRevenue - 1, 2)} is inside ±1%`, description: "Surprise under 1%." },
    [
      { label: "Beat: anything above consensus counts", description: "Any amount.", feedback: "Revenue uses a ±1% band: small differences are in line." },
      { label: "Miss", description: "Below.", feedback: "It's above consensus, just not by much." },
      { label: `Big beat: ${money(r(eNwSell).actualRevenue - eNwSell.expect.consensusRevenue)} above`, description: "Dollar gap.", feedback: "Judge the surprise as a percent of the estimate." },
    ],
    "Big companies report big numbers: a few hundred thousand sounds large but can be under 1%, which the market treats as in line.",
    { kind: "preview", eventId: eNwSell.id, revealActuals: true },
    "earnings-surprise",
  ),
  mc(
    "FIN-EP-09",
    `${r(eIbCut).company.ticker}'s book-to-bill came in at ${kpiOf(eIbCut).actual.toFixed(2)} vs ${kpiOf(eIbCut).expected.toFixed(2)} hoped for. What does that mean?`,
    "C",
    { label: "New orders aren't replacing shipments: the backlog will shrink", description: "Below 1.0." },
    [
      { label: "Revenue beat", description: "Sales.", feedback: "Book-to-bill is orders vs shipments, a forward signal." },
      { label: "Margins improved", description: "Profit.", feedback: "It says nothing directly about margins." },
      { label: "Orders are growing faster than sales", description: "Above 1.0.", feedback: "That would be a book-to-bill above 1.0." },
    ],
    "The KPI the street watches can matter more than EPS. A book-to-bill below 1.0 points to lower revenue ahead.",
    { kind: "preview", eventId: eIbCut.id, revealActuals: true },
    "kpi",
  ),
  mc(
    "FIN-EP-10",
    `${r(eIbMuted).company.ticker} closed at ${usd(eIbMuted.priorClose)} with an implied move of ±${eIbMuted.expect.impliedMovePct}%. About how many dollars is that each way?`,
    "B",
    { label: usd(eIbMuted.priorClose * (eIbMuted.expect.impliedMovePct / 100)), description: "Close × implied move." },
    [
      { label: usd(eIbMuted.expect.impliedMovePct), description: "The percent read as dollars.", feedback: "The implied move is a percent of the price." },
      { label: usd(eIbMuted.priorClose * (eIbMuted.expect.impliedMovePct / 1000)), description: "Off by ten.", feedback: `±${eIbMuted.expect.impliedMovePct}% = ${eIbMuted.expect.impliedMovePct / 100} × the price.` },
      { label: usd(eIbMuted.priorClose * (eIbMuted.expect.impliedMovePct / 50)), description: "Doubled.", feedback: "That's the whole band width, not each way." },
    ],
    "Turning the implied move into dollars makes it concrete: a move smaller than this after the print is a 'muted' reaction.",
    { kind: "preview", eventId: eIbMuted.id },
    "implied-move",
  ),
  mc(
    "FIN-EP-11",
    `${r(eNwRaise).company.ticker} fell ${Math.abs(eNwRaise.expect.runUpPct)}% into the report and many funds are underweight. How high is the bar?`,
    "A",
    { label: "Low: a good print can force underweight funds to buy", description: "Positioning." },
    [
      { label: "Very high: it must beat the whisper by a lot", description: "Crowded.", feedback: "That describes a crowded long after a run-up." },
      { label: "Positioning doesn't matter", description: "Ignore it.", feedback: "Who already owns the stock shapes the reaction." },
      { label: "It will fall again whatever happens", description: "Trend.", feedback: "Selling into the print lowers expectations; it doesn't decide the result." },
    ],
    "Light positioning plus good news is the setup for drift: buyers who were out have to come back in over several days.",
    { kind: "preview", eventId: eNwRaise.id },
    "positioning",
  ),
];

/* ------------------------------ earnings-reaction ------------------------------ */

const rc = (id: string) => generateReaction(ev(id));
const avgVol = (bars: ReturnType<typeof rc>["bars"], end: number, n = 20) =>
  bars.slice(end - n, end).reduce((a, b) => a + (b.volume ?? 0), 0) / n;
const volRatio = (id: string) => {
  const c = rc(id);
  return (c.bars[EVENT_INDEX]!.volume ?? 0) / avgVol(c.bars, EVENT_INDEX);
};
const fillSessions = (id: string) => {
  const c = rc(id);
  for (let i = EVENT_INDEX + 1; i < c.bars.length; i++) {
    const b = c.bars[i]!;
    if (c.direction === "down" ? b.high >= c.priorClose : b.low <= c.priorClose) return i - EVENT_INDEX;
  }
  return null;
};
const ret10 = (id: string) => {
  const c = rc(id);
  return c.bars[EVENT_INDEX + 10]!.close / c.bars[EVENT_INDEX]!.close - 1;
};
const full = (eventId: string): FinancialsExhibit => ({ kind: "reaction", eventId, bars: "full" });
const vr = Math.round(volRatio("nwcl-q2fy25"));
const fs = need(fillSessions("irbg-q2fy26") ?? undefined, "irbg-q2fy26 fill");
const gapHb3 = rc("hbpn-q3fy26").gap;
const r10Nw = ret10("nwcl-q4fy26");
const r10Hb = ret10("hbpn-q4fy26");
const mutedGap = rc("irbg-q3fy25").gap;

export const EARNINGS_REACTION_QUESTIONS: QuizQuestion[] = [
  mc(
    "FIN-ER-01",
    "Harbor & Pine missed by a cent but kept its outlook. Which shape is the report and the days after it?",
    "D",
    { label: "Gap down, then the gap filled", description: "Gap fill." },
    [
      { label: "Gap down and kept falling", description: "Gap and go.", feedback: "Price climbs back to the prior close within days." },
      { label: "Gap up and hold", description: "Bullish gap.", feedback: "The report bar opened below the prior close." },
      { label: "Muted: inside the implied move", description: "Small move.", feedback: "The open is outside the implied band." },
    ],
    "A miss with guidance held, on a stock already de-rated: sellers ran out quickly and the gap filled.",
    full("hbpn-q2fy26"),
    "earnings-gap",
  ),
  mc(
    "FIN-ER-02",
    "Northwind beat and raised. What did the stock do on and after the report?",
    "A",
    { label: "Gapped up and held above the prior close", description: "Gap and go." },
    [
      { label: "Gapped up, then filled the gap", description: "Gap fill.", feedback: "The lows after the report stay above the prior close." },
      { label: "Gapped down", description: "Wrong direction.", feedback: "The report bar opens above the prior close." },
      { label: "Barely moved", description: "Muted.", feedback: "The gap is bigger than the implied move." },
    ],
    "Beat and raise from a cautious start: buyers held the gap and the stock kept going.",
    full("nwcl-q2fy25"),
    "gap-continuation",
  ),
  mc(
    "FIN-ER-03",
    "Harbor & Pine ran up into an in-line report. What happened on report day?",
    "C",
    { label: "It opened higher, then sold off to close red", description: "Sell the news." },
    [
      { label: "It gapped up and held", description: "Gap and go.", feedback: "The report candle closes below its open." },
      { label: "It gapped down and drifted lower", description: "Bearish gap.", feedback: "The open was above the prior close." },
      { label: "Nothing: inside the implied move", description: "Muted.", feedback: "The report bar has a large range on heavy volume." },
    ],
    "After a run-up, 'in line' isn't enough: early buyers take profits into the news.",
    full("hbpn-q1fy26"),
    "pre-earnings-run-up",
  ),
  mc(
    "FIN-ER-04",
    "Ironbridge beat EPS and opened higher, then closed below the prior close. What most likely flipped it?",
    "B",
    { label: "The guidance cut and weak book-to-bill", description: "Guidance reversal." },
    [
      { label: "The EPS beat was too small", description: "Size.", feedback: "The beat was real; the outlook was the problem." },
      { label: "A market-wide sell-off", description: "Macro.", feedback: "The story here is company-specific: the guide was cut." },
      { label: "Low volume", description: "Volume.", feedback: "Report-day volume was heavy." },
    ],
    "Guidance beats the headline: the market prices next quarter more than the last one.",
    full("irbg-q1fy26"),
    "guidance-raise-cut",
  ),
  mc(
    "FIN-ER-05",
    "Northwind beat big and raised from an underweight starting point. What did the 10 sessions after the report day do?",
    "D",
    { label: `Kept drifting up: ${spct(r10Nw)} after the report-day close`, description: "Post-earnings drift." },
    [
      { label: "Filled the gap", description: "Gap fill.", feedback: "Price never comes back to the prior close." },
      { label: `Reversed: ${spct(-r10Nw)}`, description: "Fade.", feedback: "The move continues in the gap's direction." },
      { label: "Went flat", description: "Chop.", feedback: "Closes keep rising for days." },
    ],
    "Post-earnings drift: when news surprises underweight holders, buying continues for days after the gap.",
    full("nwcl-q4fy26"),
    "post-earnings-drift",
  ),
  mc(
    "FIN-ER-06",
    `Ironbridge was in line with an implied move of ±${ev("irbg-q3fy25").expect.impliedMovePct}%. How do you describe the reaction?`,
    "A",
    { label: `Muted: the ${spct(mutedGap)} open stayed inside the implied move`, description: "Inside the band." },
    [
      { label: "Gap and go", description: "Big gap.", feedback: "The gap is smaller than the implied move." },
      { label: "Sell the news", description: "Reversal.", feedback: "There was no run-up and no big reversal." },
      { label: "Post-earnings drift", description: "Drift.", feedback: "Nothing new was reported, so there is nothing to drift on." },
    ],
    "When results and guidance land on expectations, the stock usually stays inside the implied move: the options sellers win.",
    full("irbg-q3fy25"),
    "implied-move",
  ),
  mc(
    "FIN-ER-07",
    "Look at the volume pane: report-day volume vs the 20-session average before it is about…",
    "C",
    { label: `${vr}×`, description: "Report-day volume ÷ the 20-session average." },
    [
      { label: "1× (normal)", description: "No change.", feedback: "The report-day bar towers over the rest." },
      { label: `${vr * 3}×`, description: "Too high.", feedback: "Compare it with the average bar height, not the smallest bar." },
      { label: `${Math.max(2, Math.floor(vr / 2))}×`, description: "Too low.", feedback: "Measure against the average of the 20 sessions before." },
    ],
    "A volume spike confirms the move is real: big holders are repositioning. Gaps on light volume are easier to reverse.",
    full("nwcl-q2fy25"),
    "volume-spike",
  ),
  mc(
    "FIN-ER-08",
    `Harbor & Pine cut its holiday outlook. How big was the opening gap vs the prior close (implied move ±${ev("hbpn-q3fy26").expect.impliedMovePct}%)?`,
    "B",
    { label: spct(gapHb3), description: "Report-bar open ÷ prior close − 1." },
    [
      { label: spct(-ev("hbpn-q3fy26").expect.impliedMovePct / 100), description: "The implied move.", feedback: "That's what options priced; the actual gap is bigger." },
      { label: spct(-gapHb3), description: "Sign flipped.", feedback: "It gapped down." },
      { label: spct(gapHb3 / 3), description: "Too small.", feedback: "Measure from the prior close to the report-day open." },
    ],
    "A gap larger than the implied move means the news surprised even the options market.",
    full("hbpn-q3fy26"),
    "earnings-gap",
  ),
  mc(
    "FIN-ER-09",
    "Ironbridge missed but held its outlook. How many sessions after the report day did price trade back to the prior close?",
    "D",
    { label: `${fs} session${fs === 1 ? "" : "s"}`, description: "First bar that touches the prior close." },
    [
      { label: "Never in the window", description: "No fill.", feedback: "Price does get back to the prior close." },
      { label: `${fs + 4} sessions`, description: "Later.", feedback: "Find the first bar whose high reaches the prior close." },
      { label: "On the report day itself", description: "Same day.", feedback: "The report bar closes well below the prior close." },
    ],
    "A fast gap fill says the bad news was expected: sellers were already out.",
    full("irbg-q2fy26"),
    "gap-reversal",
  ),
  mc(
    "FIN-ER-10",
    "Harbor & Pine missed and cut again. What did the 10 sessions after the report day do?",
    "A",
    { label: `Kept falling: ${spct(r10Hb)} after the report-day close`, description: "Downside drift." },
    [
      { label: `Bounced: ${spct(-r10Hb)}`, description: "Reversal.", feedback: "Closes keep making lower lows." },
      { label: "Filled the gap", description: "Gap fill.", feedback: "Price never gets back to the prior close." },
      { label: "Flat", description: "Chop.", feedback: "The drift is clearly lower." },
    ],
    "Drift works on the downside too: analysts cut numbers for days, and each cut brings more sellers.",
    full("hbpn-q4fy26"),
    "post-earnings-drift",
  ),
  mc(
    "FIN-ER-11",
    "Northwind's report candle opened above the prior close but closed red, below its open. Which candle idea fits?",
    "B",
    { label: "A gap reversal: the gap failed on the day", description: "Gap up, red close." },
    [
      { label: "Gap continuation", description: "Gap holds.", feedback: "Continuation means the gap holds and extends." },
      { label: "Doji: indecision", description: "Open ≈ close.", feedback: "The body is large, not a doji." },
      { label: "Three white soldiers", description: "Three greens.", feedback: "That's a three-candle bullish pattern." },
    ],
    "Sell the news often prints as a gap-up reversal candle on heavy volume: a sign the good news was priced in.",
    full("nwcl-q4fy25"),
    "gap-reversal",
  ),
];

export const FINANCIALS_QUESTION_BANKS: Record<FinancialsQuizGroupId, QuizQuestion[]> = {
  // FE8.M1: bank + biotech questions appended to the existing groups.
  "statements-reading": [...STATEMENTS_READING_QUESTIONS, ...SECTOR_STATEMENT_QUESTIONS],
  "cash-forecast-13wk": CASH_FORECAST_QUESTIONS,
  "earnings-preview": [...EARNINGS_PREVIEW_QUESTIONS, ...SECTOR_PREVIEW_QUESTIONS],
  "earnings-reaction": [...EARNINGS_REACTION_QUESTIONS, ...SECTOR_REACTION_QUESTIONS],
};

export const FINANCIALS_QUIZ_GROUPS: { id: FinancialsQuizGroupId; name: string; description: string; icon: string }[] = [
  {
    id: "statements-reading",
    name: "Reading the Statements",
    description: "Compute margins, FCF, EPS and leverage from SAMPLE statements, and spot the red flag",
    icon: "table_view",
  },
  {
    id: "cash-forecast-13wk",
    name: "13-Week Cash Forecast",
    description: "Breach weeks, revolver draws, runway and what a collections delay does (SAMPLE)",
    icon: "calendar_view_week",
  },
  {
    id: "earnings-preview",
    name: "Earnings Preview",
    description: "Consensus vs whisper, guidance math, the implied move and what's priced in (SAMPLE)",
    icon: "event_upcoming",
  },
  {
    id: "earnings-reaction",
    name: "Earnings Reactions",
    description: "Gap and go, gap fill, sell the news, drift and volume on SAMPLE report charts",
    icon: "candlestick_chart",
  },
];

export const isFinancialsQuizGroup = (id: string): id is FinancialsQuizGroupId => id in FINANCIALS_QUESTION_BANKS;
