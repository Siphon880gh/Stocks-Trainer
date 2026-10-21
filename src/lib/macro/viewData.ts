/**
 * Pure table builders for the SIMULATED look-alike viewers. Components only format what these return,
 * so every number on screen is testable here.
 */
import { pctChange, round1, round2 } from "./consistency";
import { PRIVATE_SECTORS, WORLD, monthLabel, weekLabel, quarterLabel, type MonthRecord } from "./world";

const M = (m: number) => WORLD.months[m]!;
export type Cell = number | null;

// ---------- Employment Situation ----------
export interface PayrollColumn {
  label: string;
  status: "final" | "second" | "first";
  total: number;
  privateChange: number;
  government: number;
  sectors: Record<string, number>;
}

/** Changes as published in the release for month m: m−2 final (3rd estimate), m−1 second, m first (p). */
export function payrollColumns(m: number): PayrollColumn[] {
  const col = (k: number, status: PayrollColumn["status"]): PayrollColumn => {
    const p = M(k).payroll;
    const total = status === "final" ? p.totalChange : status === "second" ? p.secondPrint : p.firstPrint;
    const err = total - p.totalChange;
    const sectors = { ...p.sectors };
    sectors["Professional and business services"] = sectors["Professional and business services"]! + err;
    return { label: p.label, status, total, privateChange: total - p.governmentChange, government: p.governmentChange, sectors };
  };
  return [col(m - 2, "final"), col(m - 1, "second"), col(m, "first")];
}

export function householdColumns(m: number) {
  return [m - 2, m - 1, m].map((k) => ({ ...M(k).household }));
}

export function payrollRevisionSentence(m: number): { m1: { label: string; from: number; to: number }; m2: { label: string; from: number; to: number }; combined: number } {
  const p1 = M(m - 1).payroll;
  const p2 = M(m - 2).payroll;
  const m1 = { label: p1.label, from: p1.firstPrint, to: p1.secondPrint };
  const m2 = { label: p2.label, from: p2.secondPrint, to: p2.totalChange };
  return { m1, m2, combined: m1.to - m1.from + (m2.to - m2.from) };
}

// ---------- Price tables ----------
export interface PctRow {
  name: string;
  monthly: Cell[];
  yoy: Cell;
}
const pctRow = (name: string, m: number, n: number, f: (x: MonthRecord) => number): PctRow => {
  const monthly: Cell[] = [];
  for (let k = m - n + 1; k <= m; k++) monthly.push(k >= 1 ? pctChange(f(M(k)), f(M(k - 1))) : null);
  return { name, monthly, yoy: m >= 12 ? pctChange(f(M(m)), f(M(m - 12))) : null };
};
const monthsBack = (m: number, n: number) => Array.from({ length: n }, (_, i) => m - n + 1 + i).map((k) => (k >= 0 ? monthLabel(k) : "—"));

export function cpiTable(m: number) {
  return {
    columns: monthsBack(m, 7),
    rows: [
      pctRow("All items", m, 7, (x) => x.prices.all),
      pctRow("Food", m, 7, (x) => x.prices.food),
      pctRow("Energy", m, 7, (x) => x.prices.energy),
      pctRow("All items less food and energy", m, 7, (x) => x.prices.core),
      pctRow("Shelter", m, 7, (x) => x.prices.shelter),
    ],
    levels: { all: M(m).prices.all, core: M(m).prices.core },
  };
}

export function ppiTable(m: number) {
  return {
    columns: monthsBack(m, 7),
    rows: [pctRow("Final demand", m, 7, (x) => x.prices.ppi), pctRow("Final demand less foods, energy, and trade", m, 7, (x) => x.prices.ppiCore)],
  };
}

export function pceTable(m: number) {
  return {
    columns: monthsBack(m, 4),
    rows: [pctRow("PCE price index", m, 4, (x) => x.prices.pce), pctRow("PCE price index excluding food and energy", m, 4, (x) => x.prices.pceCore)],
  };
}

// ---------- JOLTS ----------
export function joltsTable(m: number) {
  const row = (k: number) => {
    const j = M(k).jolts;
    const emp = M(k).payroll.level;
    return {
      label: monthLabel(k),
      openings: j.openings,
      openingsRate: j.openingsRate,
      hires: j.hires,
      hiresRate: j.hiresRate,
      quits: j.quits,
      quitsRate: round1((j.quits / emp) * 100),
      layoffs: j.layoffs,
      layoffsRate: round1((j.layoffs / emp) * 100),
    };
  };
  return [row(m - 1), row(m)];
}

// ---------- Claims ----------
export function claimsTable(w: number) {
  const W = (k: number) => WORLD.weeks[k];
  const cur = W(w)!;
  const prev = W(w - 1)!;
  const yearAgo = w >= 48 ? W(w - 48)! : null;
  return {
    columns: [cur.label, prev.label, "Change", W(w - 2)!.label, "Prior year"],
    rows: [
      { name: "Initial Claims (SA)", values: [cur.initialClaims, prev.initialClaims, cur.initialClaims - prev.initialClaims, W(w - 2)!.initialClaims, yearAgo?.initialClaims ?? null] },
      { name: "4-Wk Moving Average (SA)", values: [cur.fourWeekAvg, prev.fourWeekAvg, cur.fourWeekAvg - prev.fourWeekAvg, W(w - 2)!.fourWeekAvg, yearAgo?.fourWeekAvg ?? null] },
      { name: "Insured Unemployment (SA)", values: [cur.continuingClaims, prev.continuingClaims, cur.continuingClaims - prev.continuingClaims, W(w - 2)!.continuingClaims, yearAgo?.continuingClaims ?? null] },
    ],
  };
}

// ---------- FRED-style series ----------
export interface FredSeriesMeta {
  id: string;
  title: string;
  units: string;
  frequency: "Daily" | "Weekly" | "Monthly" | "Quarterly";
  release: string;
}

export const FRED_META: Record<string, FredSeriesMeta> = {
  FEDFUNDS: { id: "FEDFUNDS", title: "Federal Funds Effective Rate", units: "Percent", frequency: "Monthly", release: "H.15 Selected Interest Rates" },
  DFF: { id: "DFF", title: "Federal Funds Effective Rate", units: "Percent", frequency: "Daily", release: "H.15 Selected Interest Rates" },
  DGS10: { id: "DGS10", title: "Market Yield on U.S. Treasury Securities at 10-Year Constant Maturity", units: "Percent", frequency: "Daily", release: "H.15 Selected Interest Rates" },
  DGS2: { id: "DGS2", title: "Market Yield on U.S. Treasury Securities at 2-Year Constant Maturity", units: "Percent", frequency: "Daily", release: "H.15 Selected Interest Rates" },
  T10Y2Y: { id: "T10Y2Y", title: "10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity", units: "Percent", frequency: "Daily", release: "Interest Rate Spreads" },
  T10YIE: { id: "T10YIE", title: "10-Year Breakeven Inflation Rate", units: "Percent", frequency: "Daily", release: "Interest Rate Spreads" },
  UNRATE: { id: "UNRATE", title: "Unemployment Rate", units: "Percent, Seasonally Adjusted", frequency: "Monthly", release: "Employment Situation" },
  PAYEMS: { id: "PAYEMS", title: "All Employees, Total Nonfarm", units: "Thousands of Persons, Seasonally Adjusted", frequency: "Monthly", release: "Employment Situation" },
  CIVPART: { id: "CIVPART", title: "Labor Force Participation Rate", units: "Percent, Seasonally Adjusted", frequency: "Monthly", release: "Employment Situation" },
  ICSA: { id: "ICSA", title: "Initial Claims", units: "Number, Seasonally Adjusted", frequency: "Weekly", release: "Unemployment Insurance Weekly Claims Report" },
  JTSJOL: { id: "JTSJOL", title: "Job Openings: Total Nonfarm", units: "Level in Thousands, Seasonally Adjusted", frequency: "Monthly", release: "Job Openings and Labor Turnover Survey" },
  CPIAUCSL: { id: "CPIAUCSL", title: "Consumer Price Index for All Urban Consumers: All Items", units: "Index, Seasonally Adjusted", frequency: "Monthly", release: "Consumer Price Index" },
  CPILFESL: { id: "CPILFESL", title: "Consumer Price Index for All Urban Consumers: All Items Less Food and Energy", units: "Index, Seasonally Adjusted", frequency: "Monthly", release: "Consumer Price Index" },
  PCEPILFE: { id: "PCEPILFE", title: "Personal Consumption Expenditures Excluding Food and Energy (Chain-Type Price Index)", units: "Index, Seasonally Adjusted", frequency: "Monthly", release: "Personal Income and Outlays" },
  GDPC1: { id: "GDPC1", title: "Real Gross Domestic Product", units: "Billions of Chained Dollars, Seasonally Adjusted Annual Rate", frequency: "Quarterly", release: "Gross Domestic Product" },
  RSAFS: { id: "RSAFS", title: "Advance Retail Sales: Retail Trade and Food Services", units: "Millions of Dollars, Seasonally Adjusted", frequency: "Monthly", release: "Advance Monthly Sales for Retail and Food Services" },
  UMCSENT: { id: "UMCSENT", title: "Consumer Sentiment", units: "Index, Not Seasonally Adjusted", frequency: "Monthly", release: "Surveys of Consumers" },
  HOUST: { id: "HOUST", title: "New Privately-Owned Housing Units Started: Total Units", units: "Thousands of Units, Seasonally Adjusted Annual Rate", frequency: "Monthly", release: "New Residential Construction" },
  MORTGAGE30US: { id: "MORTGAGE30US", title: "30-Year Fixed Rate Mortgage Average in the United States", units: "Percent, Not Seasonally Adjusted", frequency: "Weekly", release: "Primary Mortgage Market Survey" },
  DTWEXBGS: { id: "DTWEXBGS", title: "Nominal Broad U.S. Dollar Index", units: "Index, Not Seasonally Adjusted", frequency: "Daily", release: "H.10 Foreign Exchange Rates" },
};

/** Observations for a FRED-style series, oldest first, up to `end` (index in the series' own frequency). */
export function fredSeriesData(id: string, end?: number): { meta: FredSeriesMeta; points: { label: string; value: number }[] } {
  const meta = FRED_META[id];
  if (!meta) throw new Error(`unknown FRED series ${id}`);
  const d = WORLD.days;
  const months = WORLD.months;
  let pts: { label: string; value: number }[];
  switch (id) {
    case "FEDFUNDS": pts = months.map((mo, i) => ({ label: mo.label, value: round2(d.slice(i * 20, i * 20 + 20).reduce((a, x) => a + x.effective, 0) / 20) })); break;
    case "DFF": pts = d.map((x) => ({ label: x.label, value: x.effective })); break;
    case "DGS10": pts = d.map((x) => ({ label: x.label, value: x.y10 })); break;
    case "DGS2": pts = d.map((x) => ({ label: x.label, value: x.y2 })); break;
    case "T10Y2Y": pts = d.map((x) => ({ label: x.label, value: round2(x.spreadBp / 100) })); break;
    case "T10YIE": pts = d.map((x) => ({ label: x.label, value: x.breakeven })); break;
    case "UNRATE": pts = months.map((mo) => ({ label: mo.label, value: mo.household.unemploymentRate })); break;
    case "PAYEMS": pts = months.map((mo) => ({ label: mo.label, value: mo.payroll.level })); break;
    case "CIVPART": pts = months.map((mo) => ({ label: mo.label, value: mo.household.participationRate })); break;
    case "ICSA": pts = WORLD.weeks.map((w) => ({ label: w.label, value: w.initialClaims })); break;
    case "JTSJOL": pts = months.map((mo) => ({ label: mo.label, value: mo.jolts.openings })); break;
    case "CPIAUCSL": pts = months.map((mo) => ({ label: mo.label, value: mo.prices.all })); break;
    case "CPILFESL": pts = months.map((mo) => ({ label: mo.label, value: mo.prices.core })); break;
    case "PCEPILFE": pts = months.map((mo) => ({ label: mo.label, value: mo.prices.pceCore })); break;
    case "GDPC1": pts = WORLD.quarters.map((q) => ({ label: q.label, value: Math.round(q.level * 10) / 10 })); break;
    case "RSAFS": pts = months.map((mo) => ({ label: mo.label, value: mo.retail.total })); break;
    case "UMCSENT": pts = months.map((mo) => ({ label: mo.label, value: mo.sentiment.index })); break;
    case "HOUST": pts = months.map((mo) => ({ label: mo.label, value: mo.housing.starts })); break;
    case "MORTGAGE30US": pts = WORLD.weeks.map((w) => ({ label: w.label, value: w.mortgage30 })); break;
    case "DTWEXBGS": pts = d.map((x) => ({ label: x.label, value: x.dollar })); break;
    default: throw new Error(id);
  }
  return { meta, points: end === undefined ? pts : pts.slice(0, end + 1) };
}

// ---------- Treasury curve ----------
export const CURVE_TENORS = ["1 Mo", "3 Mo", "6 Mo", "1 Yr", "2 Yr", "5 Yr", "10 Yr", "30 Yr"] as const;
/** Par curve for a day: 2 Yr and 10 Yr are the world series; the other tenors are interpolated SIMULATED values. */
export function curveRow(day: number) {
  const x = WORLD.days[day]!;
  const s = x.y10 - x.y2;
  const vals = [x.effective + 0.04, x.effective + 0.02, (x.effective + x.y2) / 2 + 0.02, (x.effective + 2 * x.y2) / 3, x.y2, x.y2 + 0.45 * s, x.y10, x.y10 + 0.22].map(round2);
  return { label: x.label, values: vals, spreadBp: x.spreadBp };
}

// ---------- Housing, GDP, retail, ISM, sentiment, PMMS ----------
export function housingTable(m: number) {
  const row = (name: string, f: (x: MonthRecord) => number) => ({
    name,
    current: f(M(m)),
    prior: f(M(m - 1)),
    momPct: pctChange(f(M(m)), f(M(m - 1))),
    yearAgo: m >= 12 ? f(M(m - 12)) : null,
    yoyPct: m >= 12 ? pctChange(f(M(m)), f(M(m - 12))) : null,
  });
  return [row("Housing starts", (x) => x.housing.starts), row("Building permits", (x) => x.housing.permits), row("Housing completions", (x) => x.housing.completions)];
}

export function gdpTable(q: number) {
  const qs = [q - 3, q - 2, q - 1, q].filter((k) => k >= 0).map((k) => WORLD.quarters[k]!);
  return { columns: qs.map((x) => x.label), headline: qs.map((x) => x.headline), contributions: (["consumption", "investment", "government", "netExports"] as const).map((k) => ({ key: k, values: qs.map((x) => x.contributions[k]) })) };
}

export function retailTable(m: number) {
  const row = (name: string, f: (x: MonthRecord) => number) => ({ name, level: f(M(m)), momPct: pctChange(f(M(m)), f(M(m - 1))), yoyPct: m >= 12 ? pctChange(f(M(m)), f(M(m - 12))) : null });
  return [row("Retail and food services, total", (x) => x.retail.total), row("Total (excl. motor vehicle & parts)", (x) => x.retail.exAuto), row("Control group", (x) => x.retail.control)];
}

export function ismTable(m: number, kind: "mfg" | "services") {
  const cur = kind === "mfg" ? M(m).ismMfg : M(m).ismServices;
  const prev = kind === "mfg" ? M(m - 1).ismMfg : M(m - 1).ismServices;
  const keys = kind === "mfg"
    ? ([["PMI®", "pmi"], ["New Orders", "newOrders"], ["Production", "production"], ["Employment", "employment"], ["Supplier Deliveries", "supplierDeliveries"], ["Inventories", "inventories"], ["Prices", "prices"]] as const)
    : ([["Services PMI®", "pmi"], ["Business Activity", "businessActivity"], ["New Orders", "newOrders"], ["Employment", "employment"], ["Supplier Deliveries", "supplierDeliveries"], ["Prices", "prices"]] as const);
  return keys.map(([name, k]) => {
    const c = (cur as unknown as Record<string, number>)[k]!;
    const p = (prev as unknown as Record<string, number>)[k]!;
    const growing = c > 50;
    const faster = growing ? c > p : c < p;
    return { name, current: c, prior: p, change: round1(c - p), direction: growing ? "Growing" : "Contracting", rate: c === p ? "Same" : faster ? "Faster" : "Slower" };
  });
}

export function sentimentTable(m: number) {
  const s = M(m).sentiment;
  const p = M(m - 1).sentiment;
  return [
    { name: "Index of Consumer Sentiment", current: s.index, prior: p.index, change: round1(s.index - p.index) },
    { name: "Current Economic Conditions", current: s.current, prior: p.current, change: round1(s.current - p.current) },
    { name: "Index of Consumer Expectations", current: s.expectations, prior: p.expectations, change: round1(s.expectations - p.expectations) },
    { name: "Year-ahead inflation expectations (%)", current: s.inflation1y, prior: p.inflation1y, change: round1(s.inflation1y - p.inflation1y) },
  ];
}

export function pmmsCards(w: number) {
  const W = WORLD.weeks;
  const cur = W[w]!;
  const prev = W[w - 1]!;
  const ya = w >= 48 ? W[w - 48]! : null;
  return {
    asOf: weekLabel(w),
    cards: [
      { name: "30-year Fixed-Rate Mortgage", rate: cur.mortgage30, weekChange: round2(cur.mortgage30 - prev.mortgage30), yearAgo: ya?.mortgage30 ?? null },
      { name: "15-year Fixed-Rate Mortgage", rate: cur.mortgage15, weekChange: round2(cur.mortgage15 - prev.mortgage15), yearAgo: ya?.mortgage15 ?? null },
    ],
    avg10y: cur.avg10y,
    spread: round2(cur.mortgage30 - cur.avg10y),
  };
}

export { PRIVATE_SECTORS, quarterLabel };
