import type { OHLC } from "./ohlcData";

/** Earnings/Price ratio (inverse of P/E). Higher = cheaper relative to earnings. */
export function earningsPriceRatio(price: number, earnings: number): number {
  if (price <= 0) return 0;
  return (earnings / price) * 100;
}

/** Sharpe ratio: (return - riskFreeRate) / stdDev. Annualized. */
export function sharpeRatio(
  returns: number[],
  riskFreeRate = 0.04,
  periodsPerYear = 252
): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  const stdDev = Math.sqrt(variance);
  if (stdDev === 0) return 0;
  const excessReturn = mean - riskFreeRate / periodsPerYear;
  return (excessReturn / stdDev) * Math.sqrt(periodsPerYear);
}

/** Returns from OHLC close prices */
export function returnsFromCloses(closes: number[]): number[] {
  const out: number[] = [];
  for (let i = 1; i < closes.length; i++) {
    out.push((closes[i]! - closes[i - 1]!) / closes[i - 1]!);
  }
  return out;
}

/** Volatility (annualized std dev of returns) */
export function volatility(returns: number[], periodsPerYear = 252): number {
  if (returns.length < 2) return 0;
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance =
    returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (returns.length - 1);
  return Math.sqrt(variance * periodsPerYear) * 100;
}

/** Fake financial data for trainer */
export const FAKE_FINANCIALS = {
  price: 64281.92,
  earnings: 2840,
  revenue: 125000,
  marketCap: 1_260_000_000_000,
  riskFreeRate: 0.04,
};
