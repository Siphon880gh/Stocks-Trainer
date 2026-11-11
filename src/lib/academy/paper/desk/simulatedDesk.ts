/**
 * SIMULATED desk scenario: three fictional ".S" tapes from tapes.ts on one clock, with invented headlines and
 * statements that line up with the tapes' scripted gaps. Every item here is SIMULATED and labelled so in the UI.
 */
import { getTape } from "../tapes";
import type { DeskNewsItem, DeskScenario, DeskStatement, DeskSymbol } from "./types";

const LEN = 70;

function fromTape(id: string): DeskSymbol {
  const t = getTape(id)!;
  return { symbol: t.symbol, name: t.name, bars: t.bars.slice(0, LEN) };
}

const SIM = "SIMULATED desk wire";

const news: DeskNewsItem[] = [
  { id: "sim-prwd-date", symbol: "PRWD.S", bar: 12, kind: "company", headline: "Printwell Devices sets its quarterly report for after the close on D35", summary: "The date is public in advance; the numbers are not. Decide your size before the report, not after the gap.", source: SIM, simulated: true },
  { id: "sim-rngf-div", symbol: "RNGF.S", bar: 18, kind: "company", headline: "Rangeford Foods keeps its quarterly dividend unchanged", summary: "No change to the payout. Nothing new for the price to react to: the range holds.", source: SIM, simulated: true },
  { id: "sim-drpl-conf", symbol: "DRPL.S", bar: 25, kind: "company", headline: "Dropline Media reaffirms its full-year outlook at an industry conference", summary: "Management repeats its guidance. Reaffirmed guidance can still be cut later; watch the next filing.", source: SIM, simulated: true },
  { id: "sim-mkt-cpi", symbol: "", bar: 30, kind: "market", headline: "Consumer prices rise in line with forecasts", summary: "An in-line macro print: no surprise, so no big move across the watchlist.", source: SIM, simulated: true },
  { id: "sim-prwd-print", symbol: "PRWD.S", bar: 34, kind: "earnings", headline: "Printwell Devices quarterly sales jump 22%, above its own outlook", summary: "Revenue $503M vs $412M last quarter; operating margin widens. Published after the close, so the next open gaps.", source: SIM, simulated: true },
  { id: "sim-prwd-10q", symbol: "PRWD.S", bar: 34, kind: "filing", headline: "Printwell Devices files its quarterly report", summary: "The full statements are now on the Financials tab.", source: SIM, simulated: true },
  { id: "sim-drpl-cut", symbol: "DRPL.S", bar: 44, kind: "earnings", headline: "Dropline Media cuts its full-year outlook as ad sales slow", summary: "Quarterly revenue falls 9% and net income turns to a loss. Published after the close: a stop below the market fills at the gap open.", source: SIM, simulated: true },
  { id: "sim-drpl-10q", symbol: "DRPL.S", bar: 44, kind: "filing", headline: "Dropline Media files its quarterly report", summary: "The full statements are now on the Financials tab.", source: SIM, simulated: true },
  { id: "sim-rngf-plant", symbol: "RNGF.S", bar: 52, kind: "company", headline: "Rangeford Foods opens a new packing plant on schedule", summary: "Expected news, already in the plan. Ranges often ignore news everyone knew was coming.", source: SIM, simulated: true },
];

const st = (s: Omit<DeskStatement, "simulated" | "cashFlowMonths">): DeskStatement => ({ ...s, cashFlowMonths: 3, simulated: true });

const statements: Record<string, DeskStatement[]> = {
  "PRWD.S": [
    st({ form: "Quarterly report", bar: -1, periodStart: "Q2", periodEnd: "Q2", revenue: 412_000_000, grossProfit: 165_000_000, operatingIncome: 41_000_000, netIncome: 31_000_000, epsDiluted: 0.62, operatingCashFlow: 48_000_000, capex: 12_000_000, cash: 220_000_000, totalAssets: 1_150_000_000, totalLiabilities: 540_000_000, equity: 610_000_000 }),
    st({ form: "Quarterly report", bar: 34, periodStart: "Q3", periodEnd: "Q3", revenue: 503_000_000, grossProfit: 216_000_000, operatingIncome: 70_000_000, netIncome: 53_000_000, epsDiluted: 1.06, operatingCashFlow: 77_000_000, capex: 15_000_000, cash: 282_000_000, totalAssets: 1_230_000_000, totalLiabilities: 567_000_000, equity: 663_000_000 }),
  ],
  "DRPL.S": [
    st({ form: "Quarterly report", bar: -1, periodStart: "Q2", periodEnd: "Q2", revenue: 288_000_000, grossProfit: 132_000_000, operatingIncome: 26_000_000, netIncome: 17_000_000, epsDiluted: 0.41, operatingCashFlow: 30_000_000, capex: 9_000_000, cash: 95_000_000, totalAssets: 870_000_000, totalLiabilities: 610_000_000, equity: 260_000_000 }),
    st({ form: "Quarterly report", bar: 44, periodStart: "Q3", periodEnd: "Q3", revenue: 262_000_000, grossProfit: 107_000_000, operatingIncome: -4_000_000, netIncome: -9_000_000, epsDiluted: -0.22, operatingCashFlow: 6_000_000, capex: 10_000_000, cash: 82_000_000, totalAssets: 858_000_000, totalLiabilities: 607_000_000, equity: 251_000_000 }),
  ],
  "RNGF.S": [
    st({ form: "Quarterly report", bar: -1, periodStart: "Q2", periodEnd: "Q2", revenue: 640_000_000, grossProfit: 192_000_000, operatingIncome: 58_000_000, netIncome: 41_000_000, epsDiluted: 0.83, operatingCashFlow: 66_000_000, capex: 21_000_000, cash: 140_000_000, totalAssets: 1_900_000_000, totalLiabilities: 1_050_000_000, equity: 850_000_000 }),
  ],
};

export const SIMULATED_DESK: DeskScenario = {
  id: "sim-earnings-week",
  title: "Earnings season (SIMULATED)",
  kind: "simulated",
  description: "Three fictional companies on one clock: a beat, a guidance cut and a quiet range.",
  lesson: "Read the headline and the statement before the gap; size small into a known report date.",
  labels: Array.from({ length: LEN }, (_, i) => `D${i + 1}`),
  symbols: [fromTape("earnings-jump"), fromTape("gap-down"), fromTape("range")],
  news,
  statements,
  sourceNote: "SIMULATED: fictional companies, invented prices, headlines and statements for practice only.",
};
