import {
  earningsPriceRatio,
  sharpeRatio,
  returnsFromCloses,
  volatility,
  FAKE_FINANCIALS,
} from "../lib/financials";
import type { OHLC } from "../lib/ohlcData";

interface FinancialsPanelProps {
  data: OHLC[];
}

export default function FinancialsPanel({ data }: FinancialsPanelProps) {
  const closes = data.map((d) => d.close);
  const rets = returnsFromCloses(closes);
  const sharpe = sharpeRatio(rets);
  const vol = volatility(rets);
  const ep = earningsPriceRatio(FAKE_FINANCIALS.price, FAKE_FINANCIALS.earnings);
  const pe = FAKE_FINANCIALS.price / FAKE_FINANCIALS.earnings;

  return (
    <div className="bg-surface border border-line rounded-lg p-4">
      <h3 className="text-[12px] font-semibold text-muted mb-3">
        Financial metrics (simulated)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded border border-line bg-canvas">
          <p className="text-[12px] text-muted">E/P</p>
          <p className="text-lg font-semibold tabular-nums">{ep.toFixed(2)}%</p>
          <p className="text-[10px] text-slate-500">Earnings ÷ Price</p>
        </div>
        <div className="p-3 rounded border border-line bg-canvas">
          <p className="text-[12px] text-muted">P/E</p>
          <p className="text-lg font-semibold tabular-nums">{pe.toFixed(1)}</p>
          <p className="text-[10px] text-slate-500">Price ÷ Earnings</p>
        </div>
        <div className="p-3 rounded border border-line bg-canvas">
          <p className="text-[12px] text-muted">Sharpe</p>
          <p className="text-lg font-semibold tabular-nums">{sharpe.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500">Risk-adjusted return</p>
        </div>
        <div className="p-3 rounded border border-line bg-canvas">
          <p className="text-[12px] text-muted">Vol (ann.)</p>
          <p className="text-lg font-semibold tabular-nums">{vol.toFixed(1)}%</p>
          <p className="text-[10px] text-slate-500">Annualized volatility</p>
        </div>
      </div>
      <p className="text-[10px] text-slate-500 mt-2">
        E/P: higher = cheaper. Sharpe: &gt;1 = good risk-adjusted. Vol: lower = less risk.
      </p>
    </div>
  );
}
