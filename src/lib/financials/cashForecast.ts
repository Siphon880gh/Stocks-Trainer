/**
 * 13-week cash flow forecast model (FE2.M1). Pure: compute → result; validators return violations ([] = ok).
 * Money in whole thousands. Week numbers shown to users are 1-based ("Wk 1" … "Wk 13").
 * SAMPLE / STYLIZED teaching forecasts, not a treasury tool.
 */

export const RECEIPT_KEYS = ["collections", "otherReceipts"] as const;
export const DISBURSEMENT_KEYS = ["payroll", "payables", "rentOpex", "marketing", "taxes", "debtService", "capex"] as const;
export type ReceiptKey = (typeof RECEIPT_KEYS)[number];
export type DisbursementKey = (typeof DISBURSEMENT_KEYS)[number];
export type ForecastLineKey = ReceiptKey | DisbursementKey;

export const DEFAULT_LINE_LABELS: Record<ForecastLineKey, string> = {
  collections: "Customer collections",
  otherReceipts: "Other receipts",
  payroll: "Payroll",
  payables: "Suppliers / inventory",
  rentOpex: "Rent & operating costs",
  marketing: "Marketing / ad spend",
  taxes: "Taxes",
  debtService: "Debt service (interest + principal)",
  capex: "Capex",
};

export interface WeekInput {
  receipts: Partial<Record<ReceiptKey, number>>;
  disbursements: Partial<Record<DisbursementKey, number>>;
}

export interface RevolverTerms {
  /** Maximum outstanding balance. */
  limit: number;
  openingBalance: number;
  /** Draw automatically to keep ending cash at the minimum; repay when cash is above minimum + cushion. */
  auto: boolean;
  /** Extra cash above the minimum to keep before repaying. */
  cushion: number;
}

export interface ForecastInput {
  id: string;
  title: string;
  /** 1 = beginner (few rows, no covenant); 2 = full treasury view. */
  level: 1 | 2;
  companyId?: string;
  ticker?: string;
  /** Plain-language story the numbers are built to show (asserted in tests). */
  story: string[];
  beginningCash: number;
  /** Minimum cash (covenant or policy). 0 = none. */
  minCash: number;
  minCashLabel?: string;
  revolver?: RevolverTerms;
  /** Exactly 13 weeks. */
  weeks: WeekInput[];
  /** Override row labels (e.g. "Cash in", "Inventory", "Ad spend"). */
  lineLabels?: Partial<Record<ForecastLineKey, string>>;
  /** Optional teaching pin on one week (1-based). */
  callout?: { week: number; text: string };
  /** Data notes shown under the table (e.g. adjustments to source figures). */
  notes?: string[];
}

export interface ForecastWeek {
  /** 1-based. */
  week: number;
  receipts: Record<ReceiptKey, number>;
  disbursements: Record<DisbursementKey, number>;
  totalReceipts: number;
  totalDisbursements: number;
  net: number;
  beginning: number;
  draw: number;
  repay: number;
  ending: number;
  revolverBalance: number;
  /** ending − minCash */
  headroom: number;
  breach: boolean;
}

export interface ForecastResult {
  input: ForecastInput;
  weeks: ForecastWeek[];
  /** 1-based weeks where ending cash < minimum. */
  breachWeeks: number[];
  firstBreachWeek: number | null;
  lowestWeek: number;
  lowestCash: number;
  totalNet: number;
  peakRevolver: number;
}

export const FORECAST_WEEKS = 13;

const zeroReceipts = (): Record<ReceiptKey, number> => ({ collections: 0, otherReceipts: 0 });
const zeroDisb = (): Record<DisbursementKey, number> => ({
  payroll: 0, payables: 0, rentOpex: 0, marketing: 0, taxes: 0, debtService: 0, capex: 0,
});
const sum = (o: Record<string, number>) => Object.values(o).reduce((a, b) => a + b, 0);

export function computeForecast(input: ForecastInput): ForecastResult {
  let cash = input.beginningCash;
  let balance = input.revolver?.openingBalance ?? 0;
  const weeks: ForecastWeek[] = input.weeks.map((w, i) => {
    const receipts = { ...zeroReceipts(), ...w.receipts };
    const disbursements = { ...zeroDisb(), ...w.disbursements };
    const totalReceipts = sum(receipts);
    const totalDisbursements = sum(disbursements);
    const net = totalReceipts - totalDisbursements;
    const beginning = cash;
    const pre = beginning + net;
    let draw = 0;
    let repay = 0;
    const rv = input.revolver;
    if (rv?.auto) {
      if (pre < input.minCash) {
        draw = Math.min(input.minCash - pre, rv.limit - balance);
      } else if (balance > 0 && pre > input.minCash + rv.cushion) {
        repay = Math.min(balance, pre - (input.minCash + rv.cushion));
      }
    }
    balance += draw - repay;
    const ending = pre + draw - repay;
    cash = ending;
    const headroom = ending - input.minCash;
    return {
      week: i + 1, receipts, disbursements, totalReceipts, totalDisbursements, net, beginning, draw, repay, ending,
      revolverBalance: balance, headroom, breach: headroom < 0,
    };
  });
  const breachWeeks = weeks.filter((w) => w.breach).map((w) => w.week);
  let lowest = weeks[0]!;
  for (const w of weeks) if (w.ending < lowest.ending) lowest = w;
  return {
    input,
    weeks,
    breachWeeks,
    firstBreachWeek: breachWeeks[0] ?? null,
    lowestWeek: lowest.week,
    lowestCash: lowest.ending,
    totalNet: weeks.reduce((a, w) => a + w.net, 0),
    peakRevolver: Math.max(input.revolver?.openingBalance ?? 0, ...weeks.map((w) => w.revolverBalance)),
  };
}

/** Structural checks on an input (13 weeks, non-negative whole-thousand lines). */
export function forecastInputViolations(input: ForecastInput): string[] {
  const v: string[] = [];
  if (input.weeks.length !== FORECAST_WEEKS) v.push(`${input.id}: expected 13 weeks, got ${input.weeks.length}`);
  input.weeks.forEach((w, i) => {
    for (const [k, n] of [...Object.entries(w.receipts), ...Object.entries(w.disbursements)]) {
      if (!Number.isInteger(n) || (n as number) < 0) v.push(`${input.id} wk ${i + 1}: ${k} must be a non-negative integer`);
    }
  });
  if (input.revolver && input.revolver.openingBalance > input.revolver.limit) v.push(`${input.id}: revolver opening balance above limit`);
  if (input.callout && (input.callout.week < 1 || input.callout.week > FORECAST_WEEKS)) v.push(`${input.id}: callout week out of range`);
  return v;
}

/** Arithmetic checks on a computed (or hand-edited) result. */
export function forecastViolations(r: ForecastResult): string[] {
  const v: string[] = [];
  const id = r.input.id;
  let prevBalance = r.input.revolver?.openingBalance ?? 0;
  r.weeks.forEach((w, i) => {
    const tag = `${id} wk ${w.week}`;
    if (w.totalReceipts !== sum(w.receipts)) v.push(`${tag}: total receipts`);
    if (w.totalDisbursements !== sum(w.disbursements)) v.push(`${tag}: total disbursements`);
    if (w.net !== w.totalReceipts - w.totalDisbursements) v.push(`${tag}: net != receipts − disbursements`);
    if (w.ending !== w.beginning + w.net + w.draw - w.repay) v.push(`${tag}: ending != beginning + net + draw − repay`);
    const expectedBeginning = i === 0 ? r.input.beginningCash : r.weeks[i - 1]!.ending;
    if (w.beginning !== expectedBeginning) v.push(`${tag}: beginning != prior ending`);
    if (w.headroom !== w.ending - r.input.minCash) v.push(`${tag}: headroom != ending − minimum`);
    if (w.breach !== w.headroom < 0) v.push(`${tag}: breach flag != (headroom < 0)`);
    if (w.draw < 0 || w.repay < 0) v.push(`${tag}: negative draw/repay`);
    if (w.revolverBalance !== prevBalance + w.draw - w.repay) v.push(`${tag}: revolver balance roll-forward`);
    const limit = r.input.revolver?.limit ?? 0;
    if (w.revolverBalance > limit) v.push(`${tag}: revolver above limit`);
    if (w.revolverBalance < 0) v.push(`${tag}: revolver below zero`);
    prevBalance = w.revolverBalance;
  });
  const breaches = r.weeks.filter((w) => w.breach).map((w) => w.week);
  if (JSON.stringify(breaches) !== JSON.stringify(r.breachWeeks)) v.push(`${id}: breachWeeks list mismatch`);
  return v;
}

export interface WhatIf {
  /** Every week's collections arrive one week later (week 1 receives nothing; week 13's slip out of the window). */
  delayCollections?: boolean;
  /** Push all capex out of the 13-week window. */
  deferCapex?: boolean;
  /** Turn the revolver's automatic draws on or off (only when the forecast has one). */
  useRevolver?: boolean;
}

/** Return a NEW input with the what-ifs applied. Never mutates the original. */
export function applyWhatIf(input: ForecastInput, w: WhatIf): ForecastInput {
  const weeks: WeekInput[] = input.weeks.map((x) => ({ receipts: { ...x.receipts }, disbursements: { ...x.disbursements } }));
  if (w.delayCollections) {
    const original = input.weeks.map((x) => x.receipts.collections ?? 0);
    weeks.forEach((x, i) => (x.receipts.collections = i === 0 ? 0 : original[i - 1]!));
  }
  if (w.deferCapex) weeks.forEach((x) => (x.disbursements.capex = 0));
  const revolver = input.revolver && w.useRevolver !== undefined ? { ...input.revolver, auto: w.useRevolver } : input.revolver ? { ...input.revolver } : undefined;
  return { ...input, weeks, revolver, story: [...input.story] };
}
