/**
 * The SIMULATED macro world: 36 fictional months (SIM Y1 · Jan … SIM Y3 · Dec), 4 weeks per month,
 * 5 trading days per week. One seeded generator builds every series so they stay mutually consistent
 * (see consistency.ts). Nothing here is real data; period labels are fictional on purpose.
 *
 * Storyline: overheating → inflation worry (Fed hikes) → pivot watch (hold) → goldilocks (first cuts)
 * → growth scare → recession fear (faster cuts).
 */
import { pctChange, round1, round2 } from "./consistency";
import type { Regime } from "./types";

export const N_MONTHS = 36;
export const WEEKS_PER_MONTH = 4;
export const DAYS_PER_WEEK = 5;
export const N_WEEKS = N_MONTHS * WEEKS_PER_MONTH;
export const N_DAYS = N_WEEKS * DAYS_PER_WEEK;
/** Day-of-month (0-based) on which an FOMC decision lands. */
export const FOMC_DAY_IN_MONTH = 12;

const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
export const monthLabel = (m: number) => `SIM Y${Math.floor(m / 12) + 1} · ${MON[m % 12]}`;
export const weekLabel = (w: number) => `SIM Y${Math.floor(w / 48) + 1} · wk ${(w % 48) + 1}`;
export const dayLabel = (d: number) => `${monthLabel(Math.floor(d / 20))} d${(d % 20) + 1}`;
export const quarterLabel = (q: number) => `SIM Y${Math.floor(q / 4) + 1} · Q${(q % 4) + 1}`;

export function regimeForMonth(m: number): Regime {
  if (m < 6) return "overheating";
  if (m < 14) return "inflation-worry";
  if (m < 21) return "fed-pivot-watch";
  if (m < 26) return "goldilocks";
  if (m < 32) return "growth-scare";
  return "recession-fear";
}

const REGIME_ORDER: Regime[] = ["overheating", "inflation-worry", "fed-pivot-watch", "goldilocks", "growth-scare", "recession-fear"];
const byRegime = (m: number, values: number[]) => values[REGIME_ORDER.indexOf(regimeForMonth(m))]!;

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
/** Uniform noise in [−amp, amp] from a named stream. */
function stream(seed: number) {
  const r = mulberry32(seed);
  return (amp: number) => (r() * 2 - 1) * amp;
}

// ---------- Fed policy path ----------
/** Meeting months within a year (8 meetings); SEP meetings marked. */
export const MEETING_MONTHS_IN_YEAR = [0, 2, 3, 5, 6, 8, 9, 11];
export const SEP_MONTHS_IN_YEAR = [2, 5, 8, 11];
/** Decision per meeting month, in bp. */
const DECISIONS_BP: Record<number, number> = {
  0: 25, 2: 25, 3: 0, 5: 25, 6: 25, 8: 0, 9: 0, 11: 0,
  12: 0, 14: 0, 15: 0, 17: 0, 18: 0, 20: 0, 21: -25, 23: -25,
  24: -25, 26: -50, 27: 0, 29: -25, 30: 0, 32: -25, 33: -25, 35: 0,
};
export const START_RANGE_LOWER = 4.5;

export interface FedMeeting {
  month: number;
  label: string;
  day: number;
  decisionBp: number;
  lowerBefore: number;
  lower: number;
  upper: number;
  effective: number;
  sep: boolean;
}

function buildMeetings(): FedMeeting[] {
  const out: FedMeeting[] = [];
  let lower = START_RANGE_LOWER;
  for (let m = 0; m < N_MONTHS; m++) {
    if (!MEETING_MONTHS_IN_YEAR.includes(m % 12)) continue;
    const bp = DECISIONS_BP[m] ?? 0;
    const before = lower;
    lower = round2(lower + bp / 100);
    out.push({ month: m, label: monthLabel(m), day: m * 20 + FOMC_DAY_IN_MONTH, decisionBp: bp, lowerBefore: before, lower, upper: round2(lower + 0.25), effective: round2(lower + 0.08), sep: SEP_MONTHS_IN_YEAR.includes(m % 12) });
  }
  return out;
}

// ---------- Monthly records ----------
export const PRIVATE_SECTORS = [
  "Mining and logging", "Construction", "Manufacturing", "Trade, transportation, and utilities", "Information",
  "Financial activities", "Professional and business services", "Education and health services", "Leisure and hospitality", "Other services",
] as const;
const SECTOR_W = [0.01, 0.05, 0.09, 0.23, 0.02, 0.07, 0.17, 0.2, 0.12, 0.04];

export interface PayrollRecord {
  label: string;
  /** Final (fully revised) changes, thousands. */
  sectors: Record<string, number>;
  privateChange: number;
  governmentChange: number;
  totalChange: number;
  level: number;
  prevLevel: number;
  /** First and second published estimates of totalChange (revisions teach "prior revised"). */
  firstPrint: number;
  secondPrint: number;
  /** First-print sector changes (the print error sits in professional and business services). */
  firstPrintSectors: Record<string, number>;
  ahe: number;
  aheMoM: number;
  avgWeeklyHours: number;
}

export interface HouseholdRecord {
  label: string;
  population: number;
  laborForce: number;
  employed: number;
  unemployed: number;
  unemploymentRate: number;
  participationRate: number;
}

export interface PriceIndexes {
  all: number;
  core: number;
  food: number;
  energy: number;
  shelter: number;
  ppi: number;
  ppiCore: number;
  pce: number;
  pceCore: number;
}

export interface MonthRecord {
  m: number;
  label: string;
  regime: Regime;
  payroll: PayrollRecord;
  household: HouseholdRecord;
  prices: PriceIndexes;
  retail: { total: number; exAuto: number; control: number };
  ismMfg: { newOrders: number; production: number; employment: number; supplierDeliveries: number; inventories: number; pmi: number; prices: number; status: "Growing" | "Contracting" };
  ismServices: { businessActivity: number; newOrders: number; employment: number; supplierDeliveries: number; pmi: number; prices: number; status: "Growing" | "Contracting" };
  sentiment: { index: number; current: number; expectations: number; inflation1y: number };
  housing: { starts: number; permits: number; completions: number };
  jolts: { openings: number; hires: number; quits: number; layoffs: number; openingsRate: number; hiresRate: number };
}

export interface WeekRecord {
  w: number;
  label: string;
  initialClaims: number;
  fourWeekAvg: number;
  continuingClaims: number;
  avg10y: number;
  mortgage30: number;
  mortgage15: number;
}

export interface DayRecord {
  d: number;
  label: string;
  fedLower: number;
  fedUpper: number;
  effective: number;
  y2: number;
  y10: number;
  spreadBp: number;
  breakeven: number;
  real10y: number;
  dollar: number;
}

export interface QuarterRecord {
  q: number;
  label: string;
  level: number;
  prior: number;
  headline: number;
  contributions: { consumption: number; investment: number; government: number; netExports: number };
}

export interface MacroWorld {
  months: MonthRecord[];
  weeks: WeekRecord[];
  days: DayRecord[];
  quarters: QuarterRecord[];
  meetings: FedMeeting[];
}

const piecewise = (m: number, pts: Array<[number, number]>) => {
  for (let i = 1; i < pts.length; i++) {
    const [m0, v0] = pts[i - 1]!;
    const [m1, v1] = pts[i]!;
    if (m <= m1) return v0 + ((v1 - v0) * (m - m0)) / (m1 - m0);
  }
  return pts[pts.length - 1]![1];
};

const round3 = (v: number) => Math.round(v * 1000) / 1000;

export function buildWorld(): MacroWorld {
  const meetings = buildMeetings();
  const n = { pay: stream(11), sec: stream(12), hh: stream(13), px: stream(14), act: stream(15), wk: stream(16), day: stream(17), rev: stream(18) };

  // Monthly
  const months: MonthRecord[] = [];
  let level = 152000;
  let population = 268000;
  let ahe = 33.2;
  const idx = { food: 320, energy: 280, core: 315, shelter: 380, ppi: 140, ppiCore: 135, pce: 120, pceCore: 121 };
  const base = { ...idx };
  const W = { food: 0.135, energy: 0.07, core: 0.795 };
  const H0 = 310;
  let retail = { total: 690000, exAuto: 560000, control: 470000 };

  for (let m = 0; m < N_MONTHS; m++) {
    const trend = byRegime(m, [260, 200, 150, 140, 70, -10]);
    const total = Math.round(trend + n.pay(60));
    const governmentChange = Math.round(total * 0.12 + n.pay(8));
    const privateChange = total - governmentChange;
    const sectors: Record<string, number> = {};
    let acc = 0;
    PRIVATE_SECTORS.forEach((s, i) => {
      if (i === 7) return;
      const c = Math.round(privateChange * SECTOR_W[i]! + n.sec(6));
      sectors[s] = c;
      acc += c;
    });
    sectors[PRIVATE_SECTORS[7]] = privateChange - acc;
    const ordered: Record<string, number> = {};
    for (const s of PRIVATE_SECTORS) ordered[s] = sectors[s]!;
    const e1 = Math.round(n.rev(40));
    const e2 = Math.round(n.rev(15));
    const firstPrintSectors = { ...ordered };
    firstPrintSectors["Professional and business services"] = ordered["Professional and business services"]! + e1;
    const prevLevel = level;
    level = prevLevel + total;
    const aheMoMTarget = byRegime(m, [0.45, 0.4, 0.3, 0.3, 0.25, 0.2]) + n.pay(0.05);
    const aheBefore = ahe;
    ahe = round2(ahe * (1 + aheMoMTarget / 100));

    population = Math.round(population * 1.0008);
    const part = piecewise(m, [[0, 62.6], [20, 62.5], [35, 62.2]]) + n.hh(0.05);
    const ur = piecewise(m, [[0, 3.6], [12, 3.7], [20, 3.9], [26, 4.1], [32, 4.5], [35, 4.8]]) + n.hh(0.05);
    const laborForce = Math.round((population * part) / 100);
    const unemployed = Math.round((laborForce * ur) / 100);

    // Prices
    const coreMoM = byRegime(m, [0.45, 0.35, 0.3, 0.22, 0.2, 0.18]) + n.px(0.06);
    const energyMoM = 0.3 + n.px(2.5);
    const foodMoM = 0.25 + n.px(0.1);
    idx.core = round3(idx.core * (1 + coreMoM / 100));
    idx.shelter = round3(idx.shelter * (1 + (coreMoM + 0.1) / 100));
    idx.food = round3(idx.food * (1 + foodMoM / 100));
    idx.energy = round3(idx.energy * (1 + energyMoM / 100));
    idx.ppi = round3(idx.ppi * (1 + (coreMoM * 0.8 + energyMoM * 0.15 + n.px(0.1)) / 100));
    idx.ppiCore = round3(idx.ppiCore * (1 + (coreMoM * 0.85 + n.px(0.08)) / 100));
    idx.pceCore = round3(idx.pceCore * (1 + (coreMoM - 0.05 + n.px(0.03)) / 100));
    idx.pce = round3(idx.pce * (1 + (coreMoM - 0.03 + energyMoM * 0.04 + n.px(0.02)) / 100));
    const all = round3(H0 * (W.food * (idx.food / base.food) + W.energy * (idx.energy / base.energy) + W.core * (idx.core / base.core)));

    // Activity
    const rMoM = byRegime(m, [0.7, 0.5, 0.4, 0.4, 0.1, -0.3]) + n.act(0.4);
    retail = {
      total: Math.round(retail.total * (1 + rMoM / 100)),
      exAuto: Math.round(retail.exAuto * (1 + (rMoM + n.act(0.15)) / 100)),
      control: Math.round(retail.control * (1 + (rMoM * 0.8 + n.act(0.15)) / 100)),
    };
    const mb = byRegime(m, [55, 52, 50, 51, 48, 45]);
    const c5 = [0, 1, 2, 3, 4].map(() => round1(mb + n.act(2)));
    const mfgPmi = round1(c5.reduce((a, b) => a + b, 0) / 5);
    const sb = byRegime(m, [57, 54, 53, 53, 51, 49]);
    const c4 = [0, 1, 2, 3].map(() => round1(sb + n.act(2)));
    const svcPmi = round1(c4.reduce((a, b) => a + b, 0) / 4);
    const sIdx = round1(byRegime(m, [68, 62, 66, 72, 62, 55]) + n.act(2));
    const starts = Math.round(byRegime(m, [1500, 1400, 1350, 1420, 1300, 1200]) + n.act(60));
    const emp = level;
    const openings = Math.round(byRegime(m, [10500, 9200, 8600, 8300, 7700, 7100]) + n.act(250));
    const hires = Math.round(byRegime(m, [6300, 6000, 5800, 5700, 5500, 5300]) + n.act(150));

    months.push({
      m,
      label: monthLabel(m),
      regime: regimeForMonth(m),
      payroll: {
        label: monthLabel(m),
        sectors: ordered,
        privateChange,
        governmentChange,
        totalChange: total,
        level,
        prevLevel,
        firstPrint: total + e1,
        secondPrint: total + e2,
        firstPrintSectors,
        ahe,
        aheMoM: pctChange(ahe, aheBefore),
        avgWeeklyHours: round1(34.4 + n.pay(0.1)),
      },
      household: {
        label: monthLabel(m),
        population,
        laborForce,
        employed: laborForce - unemployed,
        unemployed,
        unemploymentRate: round1((unemployed / laborForce) * 100),
        participationRate: round1((laborForce / population) * 100),
      },
      prices: { all, core: idx.core, food: idx.food, energy: idx.energy, shelter: idx.shelter, ppi: idx.ppi, ppiCore: idx.ppiCore, pce: idx.pce, pceCore: idx.pceCore },
      retail,
      ismMfg: { newOrders: c5[0]!, production: c5[1]!, employment: c5[2]!, supplierDeliveries: c5[3]!, inventories: c5[4]!, pmi: mfgPmi, prices: round1(byRegime(m, [65, 60, 55, 52, 50, 48]) + n.act(2)), status: mfgPmi > 50 ? "Growing" : "Contracting" },
      ismServices: { businessActivity: c4[0]!, newOrders: c4[1]!, employment: c4[2]!, supplierDeliveries: c4[3]!, pmi: svcPmi, prices: round1(byRegime(m, [66, 62, 58, 55, 54, 52]) + n.act(2)), status: svcPmi > 50 ? "Growing" : "Contracting" },
      sentiment: { index: sIdx, current: round1(sIdx + 6 + n.act(2)), expectations: round1(sIdx - 4 + n.act(2)), inflation1y: round1(byRegime(m, [3.6, 3.3, 3.0, 2.8, 2.9, 2.7]) + n.act(0.1)) },
      housing: { starts, permits: Math.round(starts + 30 + n.act(40)), completions: Math.round(1400 + n.act(50)) },
      jolts: {
        openings,
        hires,
        quits: Math.round(byRegime(m, [4200, 3800, 3500, 3400, 3200, 3000]) + n.act(120)),
        layoffs: Math.round(byRegime(m, [1500, 1550, 1600, 1600, 1750, 1950]) + n.act(80)),
        openingsRate: round1((openings / (emp + openings)) * 100),
        hiresRate: round1((hires / emp) * 100),
      },
    });
  }

  // Quarterly GDP
  const quarters: QuarterRecord[] = [];
  let gdp = 23000;
  for (let q = 0; q < N_MONTHS / 3; q++) {
    const mm = q * 3 + 1;
    const c = {
      consumption: round1(byRegime(mm, [2.0, 1.6, 1.4, 1.5, 0.8, 0.2]) + n.act(0.3)),
      investment: round1(byRegime(mm, [0.8, 0.4, 0.3, 0.5, -0.2, -0.6]) + n.act(0.3)),
      government: round1(byRegime(mm, [0.5, 0.4, 0.4, 0.3, 0.4, 0.4]) + n.act(0.1)),
      netExports: round1(byRegime(mm, [-0.3, -0.1, 0, -0.2, 0.1, 0.2]) + n.act(0.2)),
    };
    const headline = round1(c.consumption + c.investment + c.government + c.netExports);
    const prior = gdp;
    gdp = prior * Math.pow(1 + headline / 100, 0.25);
    quarters.push({ q, label: quarterLabel(q), level: gdp, prior, headline, contributions: c });
  }

  // Daily rates
  const days: DayRecord[] = [];
  const lowerOnDay = (d: number) => {
    let lower = START_RANGE_LOWER;
    for (const mt of meetings) if (mt.day <= d) lower = mt.lower;
    return lower;
  };
  let ar2 = 0;
  let ar10 = 0;
  let arD = 0;
  for (let d = 0; d < N_DAYS; d++) {
    const m = Math.floor(d / 20);
    const lower = lowerOnDay(d);
    const mid = lower + 0.125;
    let fwd = 0;
    const horizon = 24 * 20;
    for (let k = 0; k < horizon; k += 20) fwd += lowerOnDay(Math.min(d + k, N_DAYS - 1)) + 0.125;
    fwd /= horizon / 20;
    ar2 = ar2 * 0.9 + n.day(0.03);
    ar10 = ar10 * 0.92 + n.day(0.025);
    arD = arD * 0.95 + n.day(0.15);
    const y2 = round2(0.55 * mid + 0.45 * fwd + 0.05 + ar2);
    const slope = piecewise(m, [[0, -0.45], [8, -0.75], [16, -0.55], [24, -0.15], [30, 0.25], [35, 0.55]]);
    const y10 = round2(y2 + slope + ar10);
    const breakeven = round2(byRegime(m, [2.5, 2.4, 2.3, 2.25, 2.15, 2.0]) + n.day(0.03));
    days.push({ d, label: dayLabel(d), fedLower: lower, fedUpper: round2(lower + 0.25), effective: round2(lower + 0.08), y2, y10, spreadBp: Math.round((y10 - y2) * 100), breakeven, real10y: round2(y10 - breakeven), dollar: round2(104 + 3 * (y2 - 4.5) + arD) });
  }

  // Weekly claims + mortgage
  const weeks: WeekRecord[] = [];
  const claims: number[] = [];
  for (let w = 0; w < N_WEEKS; w++) {
    const m = Math.floor(w / WEEKS_PER_MONTH);
    const c = Math.round((byRegime(m, [205000, 215000, 220000, 218000, 235000, 260000]) + n.wk(9000)) / 1000) * 1000;
    claims.push(c);
    const last4 = [w - 3, w - 2, w - 1, w].map((k) => claims[Math.max(0, k)]!);
    const wDays = days.slice(w * DAYS_PER_WEEK, w * DAYS_PER_WEEK + DAYS_PER_WEEK);
    const avg10y = round2(wDays.reduce((a, b) => a + b.y10, 0) / wDays.length);
    const spread = byRegime(m, [2.6, 2.7, 2.4, 2.1, 1.9, 1.8]) + n.wk(0.05);
    const mortgage30 = round2(avg10y + spread);
    weeks.push({
      w,
      label: weekLabel(w),
      initialClaims: c,
      fourWeekAvg: last4.reduce((a, b) => a + b, 0) / 4,
      continuingClaims: Math.round((byRegime(m, [1750000, 1800000, 1840000, 1830000, 1900000, 2020000]) + n.wk(15000)) / 1000) * 1000,
      avg10y,
      mortgage30,
      mortgage15: round2(mortgage30 - 0.65 + n.wk(0.05)),
    });
  }

  return { months, weeks, days, quarters, meetings };
}

/** The single shared world instance (deterministic). */
export const WORLD: MacroWorld = buildWorld();

/** Previous 4 weekly claims (padded at the start of the series with the first week). */
export function claimsWindow(world: MacroWorld, w: number): number[] {
  const out: number[] = [];
  for (let k = w - 3; k <= w; k++) out.push(world.weeks[Math.max(0, k)]!.initialClaims);
  return out;
}

/** Last trading day of a month. */
export const monthEndDay = (m: number) => m * 20 + 19;
