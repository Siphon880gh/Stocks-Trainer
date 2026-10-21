/**
 * 13-week cash forecast fixtures (FE2.M2). SAMPLE / STYLIZED: fictional companies, not advice.
 * Money in whole thousands.
 */
import type { ForecastInput, WeekInput } from "./cashForecast";

const W = 13;
const weeks = (f: (week: number) => WeekInput): WeekInput[] => Array.from({ length: W }, (_, i) => f(i + 1));

/**
 * Level 1: replica of Weng's starter table (Cash in / Inventory / Ad spend / Opex → Net).
 * Every week nets +10k except week 9, when cash in drops 50k → 30k and net turns to −5k.
 * NOTE (flagged for sign-off): in the source image week 9 kept Inventory at 15k, which nets −10k, not −5k.
 * Inventory is set to 10k in week 9 here so the stated −5k net ties.
 */
export const LEVEL1_REPLICA: ForecastInput = {
  id: "level1-replica",
  title: "Starter forecast: one bad week",
  level: 1,
  story: [
    "Every week brings in 50k and spends 40k, so cash grows 10k a week.",
    "In week 9 customers pay only 30k. Spending dips a little (inventory 10k), but the week still loses 5k.",
    "Cash keeps growing overall: one bad week is not a crisis if you saw it coming.",
  ],
  beginningCash: 20,
  minCash: 0,
  lineLabels: { collections: "Cash in", payables: "Inventory", marketing: "Ad spend", rentOpex: "Opex" },
  weeks: weeks((wk) => ({
    receipts: { collections: wk === 9 ? 30 : 50 },
    disbursements: { payables: wk === 9 ? 10 : 15, marketing: 10, rentOpex: 15 },
  })),
  callout: { week: 9, text: "See it before you commit: cash in drops to 30k, so this week loses money." },
  notes: [
    "Adjusted from the source sketch: week 9 inventory is 10k (not 15k) so that net = 30 − 10 − 10 − 15 = −5k ties.",
  ],
};

/** Harbor & Pine: Q3 inventory build while a big wholesale customer pays late (DSO stretch). */
const HP_COLLECTIONS = [21000, 21500, 21000, 21500, 14000, 12000, 11500, 12000, 13500, 33000, 34000, 22500, 22000];
const HP_SUPPLIERS = [9000, 12500, 13500, 14500, 15000, 15000, 14500, 13500, 12000, 10000, 9000, 8500, 8500];
export const HARBOR_COLLECTIONS_SLIP: ForecastInput = {
  id: "harbor-collections-slip",
  title: "Harbor & Pine: holiday inventory build meets a slow payer",
  level: 2,
  companyId: "harbor-pine",
  ticker: "HBPN.S",
  story: [
    "Supplier payments climb in weeks 2–8 as holiday inventory arrives.",
    "A large wholesale customer pays late, so collections drop in weeks 5–9 (receivables stretch).",
    "The revolver covers the gap in weeks 7–9, then is fully repaid when the late payments land in weeks 10–11.",
    "The minimum cash floor is never breached because the line was in place before the dip.",
  ],
  beginningCash: 64000,
  minCash: 40000,
  minCashLabel: "Policy minimum cash",
  revolver: { limit: 60000, openingBalance: 0, auto: true, cushion: 5000 },
  weeks: weeks((wk) => ({
    receipts: { collections: HP_COLLECTIONS[wk - 1]!, otherReceipts: wk === 6 ? 500 : 0 },
    disbursements: {
      payroll: wk % 2 === 1 ? 6500 : 0,
      payables: HP_SUPPLIERS[wk - 1]!,
      rentOpex: wk % 4 === 1 ? 5500 : 1200,
      marketing: wk >= 10 ? 2500 : 1200,
      taxes: wk === 11 ? 4000 : 0,
      capex: 600,
    },
  })),
  callout: { week: 7, text: "Collections are short and supplier bills peak: cash hits the floor and the revolver draw starts here." },
};

/** Ironbridge: payroll + quarterly debt service collide in week 7. */
export const IRONBRIDGE_DEBT_SERVICE: ForecastInput = {
  id: "ironbridge-debt-service",
  title: "Ironbridge: payroll and the loan payment land in the same week",
  level: 2,
  companyId: "ironbridge-industrial",
  ticker: "IRBG.S",
  story: [
    "Collections are steady at about 11–12k a week; payroll (9k) goes out every other week.",
    "Week 7 has payroll AND the quarterly loan payment (interest + 5k principal), so cash would fall below the 15k covenant minimum.",
    "Drawing the revolver in week 7 keeps cash at the minimum; it is fully repaid by week 10.",
  ],
  beginningCash: 22000,
  minCash: 15000,
  minCashLabel: "Covenant minimum cash",
  revolver: { limit: 25000, openingBalance: 0, auto: true, cushion: 3000 },
  weeks: weeks((wk) => ({
    receipts: { collections: [12000, 12500, 12000, 13000, 12500, 12000, 12500, 13500, 13500, 12500, 14000, 13000, 12500][wk - 1]! },
    disbursements: {
      payroll: wk % 2 === 1 ? 9000 : 0,
      payables: 4800,
      rentOpex: 1200,
      marketing: 200,
      taxes: wk === 11 ? 2500 : 0,
      debtService: wk === 7 ? 11500 : 0,
      capex: 900,
    },
  })),
  callout: { week: 7, text: "Payroll + 11.5k loan payment in one week: see the dip before it happens." },
};

/** Northwind: steady SaaS burn after the raise ends; cash crosses the board's minimum in week 12. */
export const NORTHWIND_RUNWAY: ForecastInput = {
  id: "northwind-runway",
  title: "Northwind Cloud: counting down to the cash floor",
  level: 2,
  companyId: "northwind-cloud",
  ticker: "NWCL.S",
  story: [
    "Subscription collections are lumpy: big at the start of each month (annual renewals), smaller in between.",
    "Payroll every other week is the biggest outflow; there is no revolver.",
    "Cash falls about 3k a week on average and crosses the board's 75k minimum in week 12.",
    "Seeing week 12 now gives management a quarter to cut spend or raise money.",
  ],
  beginningCash: 110000,
  minCash: 75000,
  minCashLabel: "Board minimum cash",
  weeks: weeks((wk) => ({
    receipts: { collections: wk % 4 === 1 ? 14000 : 3500, otherReceipts: wk === 7 ? 300 : 0 },
    disbursements: {
      payroll: wk % 2 === 0 ? 9500 : 0,
      payables: 900,
      rentOpex: wk % 4 === 1 ? 2400 : 600,
      marketing: 2200,
      taxes: 0,
      capex: 250,
    },
  })),
  callout: { week: 12, text: "Ending cash drops under the 75k floor here." },
};

export const CASH_FORECASTS: ForecastInput[] = [LEVEL1_REPLICA, HARBOR_COLLECTIONS_SLIP, IRONBRIDGE_DEBT_SERVICE, NORTHWIND_RUNWAY];

export function forecastById(id: string): ForecastInput | undefined {
  return CASH_FORECASTS.find((f) => f.id === id);
}
