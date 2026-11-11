/**
 * Deterministic generators for SIMULATED desk scenarios, so the bundle stores a few numbers per scenario instead of
 * price arrays. Prices: a seeded random walk with scripted drift / volatility segments, opening gaps, intraday
 * shocks, mean-reverting ranges and a deal-price pin. Statements: a quarterly series built so every one ties out
 * (assets = liabilities + equity; the change in cash = operating cash flow − capex + financing).
 */
import { seeded } from "../../mastery";
import type { PaperBar } from "../types";
import type { DeskStatement, DeskSymbol } from "./types";

export interface PathSpec {
  symbol: string;
  name: string;
  /** Starting price in dollars. */
  start: number;
  /** Default drift and volatility per bar (fractions). */
  drift?: number;
  vol?: number;
  /** From bar `from` on: [from, drift, vol?]. */
  segments?: [number, number, number?][];
  /** Opening gap on `bar` in percent of the prior close. */
  gaps?: [number, number][];
  /** Intraday shock on `bar`: the low is `lowPct` below the open and the close `closePct` from the open. */
  shocks?: [number, number, number][];
  /** Mean-reverting range [low, high] in dollars, active from `from` to `to` (bars). */
  range?: [number, number, number?, number?];
  /** From bar `from` the close is pulled hard toward `price` (a cash deal price). */
  pin?: [number, number];
  /** Average shares per bar. */
  volume?: number;
  /** Divide every price by this (split-adjusted history). */
  adjust?: number;
}

export function genSymbol(seed: string, spec: PathSpec, len: number): DeskSymbol {
  const rnd = seeded(`desk:${seed}:${spec.symbol}`);
  const n = (a = 1) => (rnd() * 2 - 1) * a;
  const bars: PaperBar[] = [];
  const volumes: number[] = [];
  let prev = spec.start;
  for (let i = 0; i < len; i++) {
    let drift = spec.drift ?? 0;
    let vol = spec.vol ?? 0.015;
    for (const [from, d, v] of spec.segments ?? []) if (i >= from) { drift = d; vol = v ?? vol; }
    const gap = spec.gaps?.find((g) => g[0] === i)?.[1];
    const shock = spec.shocks?.find((s) => s[0] === i);
    const r = spec.range;
    const inRange = r && i >= (r[2] ?? 0) && i <= (r[3] ?? len);
    if (inRange) {
      const mid = (r[0] + r[1]) / 2;
      drift = ((mid - prev) / mid) * 0.25;
    }
    let open = gap !== undefined ? prev * (1 + gap / 100) : prev * (1 + n(vol * 0.25));
    let close = open * (1 + drift + n(vol));
    if (inRange && gap === undefined) close = Math.min(r[1] * 1.005, Math.max(r[0] * 0.995, close));
    const pin = spec.pin && i >= spec.pin[0] ? spec.pin[1] : null;
    if (pin !== null && gap === undefined) {
      open = pin + (open - pin) * 0.5;
      close = pin + (close - pin) * 0.2;
    }
    let high = Math.max(open, close) * (1 + Math.abs(n(vol * 0.5)) + 0.001);
    let low = Math.min(open, close) * (1 - Math.abs(n(vol * 0.5)) - 0.001);
    if (shock) {
      low = open * (1 - shock[1] / 100);
      close = open * (1 + shock[2] / 100);
      high = Math.max(high, open, close);
    }
    const adj = spec.adjust ?? 1;
    const c = (x: number) => Math.max(5, Math.round((x / adj) * 100));
    const b: PaperBar = { open: c(open), high: c(high), low: c(low), close: c(close), label: `D${i + 1}` };
    b.high = Math.max(b.high, b.open, b.close);
    b.low = Math.min(b.low, b.open, b.close);
    if (b.high === b.low) b.high += 1;
    bars.push(b);
    const move = Math.abs(close / prev - 1);
    volumes.push(Math.round((spec.volume ?? 2_000_000) * (0.7 + rnd() * 0.6) * (1 + move * 25) * (gap !== undefined || shock ? 2.5 : 1) * adj));
    prev = close;
  }
  return { symbol: spec.symbol, name: spec.name, bars, volumes };
}

/** Opening balance sheet of a fictional company (whole dollars). */
export interface CompanyStart {
  cash: number;
  /** Everything that is not cash (receivables, inventory, property …). */
  otherAssets: number;
  debt: number;
  otherLiabilities: number;
  shares: number;
}

/** One quarter of a fictional company. Margins are fractions of revenue. */
export interface QuarterInput {
  bar: number;
  period: string;
  form?: string;
  revenue: number;
  grossMargin: number;
  opMargin: number;
  /** Overrides revenue × opMargin (e.g. a loss-making company with no revenue). */
  operatingIncome?: number;
  interest?: number;
  taxRate?: number;
  /** Depreciation & amortization (added back in operating cash flow; reduces other assets). */
  da?: number;
  /** Working-capital cash flow (negative = cash tied up in receivables / inventory). */
  wc?: number;
  capex?: number;
  debtChange?: number;
  stockIssued?: number;
  /** New shares from the issuance (or −shares retired by a buyback). */
  sharesChange?: number;
  buybacks?: number;
  dividends?: number;
  /** One-off charge below operating income (a write-down), not cash. */
  charge?: number;
  note?: string;
}

const R = Math.round;

/** A series of SIMULATED statements that tie out quarter to quarter. */
export function quarterSeries(start: CompanyStart, quarters: QuarterInput[], series = "main"): DeskStatement[] {
  let { cash, otherAssets, debt, shares } = start;
  const { otherLiabilities } = start;
  let equity = cash + otherAssets - debt - otherLiabilities;
  return quarters.map((q) => {
    const revenue = R(q.revenue);
    const grossProfit = R(revenue * q.grossMargin);
    const operatingIncome = R(q.operatingIncome ?? revenue * q.opMargin);
    const interest = R(q.interest ?? 0);
    const charge = R(q.charge ?? 0);
    const pretax = operatingIncome - interest - charge;
    const tax = pretax > 0 ? R(pretax * (q.taxRate ?? 0.21)) : 0;
    const netIncome = pretax - tax;
    const da = R(q.da ?? revenue * 0.03);
    const wc = R(q.wc ?? 0);
    const capex = R(q.capex ?? revenue * 0.04);
    const operatingCashFlow = netIncome + charge + da + wc;
    const debtChange = R(q.debtChange ?? 0);
    const stockIssued = R(q.stockIssued ?? 0);
    const buybacks = R(q.buybacks ?? 0);
    const dividends = R(q.dividends ?? 0);
    const financingCashFlow = debtChange + stockIssued - buybacks - dividends;
    cash = cash + operatingCashFlow - capex + financingCashFlow;
    otherAssets = otherAssets + capex - da - wc - charge;
    debt += debtChange;
    equity = equity + netIncome + stockIssued - buybacks - dividends;
    shares += q.sharesChange ?? 0;
    return {
      form: q.form ?? "Quarterly report",
      bar: q.bar,
      periodStart: q.period,
      periodEnd: q.period,
      cashFlowMonths: 3,
      simulated: true,
      series,
      revenue,
      grossProfit,
      operatingIncome,
      netIncome,
      epsDiluted: Math.round((netIncome / shares) * 100) / 100,
      operatingCashFlow,
      capex,
      financingCashFlow,
      cash,
      totalAssets: cash + otherAssets,
      totalLiabilities: debt + otherLiabilities,
      equity,
      debt,
      sharesDiluted: shares,
      ...(buybacks ? { buybacks } : {}),
      ...(dividends ? { dividendsPaid: dividends } : {}),
      ...(stockIssued ? { stockIssued } : {}),
      ...(q.note ? { note: q.note } : {}),
    };
  });
}
