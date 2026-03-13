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
    <div className="bg-neutral-dark/80 border border-primary/30 rounded-lg p-4">
      <h3 className="text-[10px] font-bold text-primary/60 uppercase mb-3 tracking-[0.2em]">
        Financial Metrics (Simulated)
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="p-3 rounded border border-primary/20 bg-background-dark/50">
          <p className="text-[10px] text-primary/50 uppercase">E/P</p>
          <p className="text-lg font-bold text-primary font-mono">{ep.toFixed(2)}%</p>
          <p className="text-[10px] text-slate-500">Earnings ÷ Price</p>
        </div>
        <div className="p-3 rounded border border-primary/20 bg-background-dark/50">
          <p className="text-[10px] text-primary/50 uppercase">P/E</p>
          <p className="text-lg font-bold text-primary font-mono">{pe.toFixed(1)}</p>
          <p className="text-[10px] text-slate-500">Price ÷ Earnings</p>
        </div>
        <div className="p-3 rounded border border-primary/20 bg-background-dark/50">
          <p className="text-[10px] text-primary/50 uppercase">Sharpe</p>
          <p className="text-lg font-bold text-primary font-mono">{sharpe.toFixed(2)}</p>
          <p className="text-[10px] text-slate-500">Risk-adjusted return</p>
        </div>
        <div className="p-3 rounded border border-primary/20 bg-background-dark/50">
          <p className="text-[10px] text-primary/50 uppercase">Vol (Ann.)</p>
          <p className="text-lg font-bold text-primary font-mono">{vol.toFixed(1)}%</p>
          <p className="text-[10px] text-slate-500">Annualized volatility</p>
        </div>
      </div>
      <p className="text-[10px] text-slate-500 mt-2">
        E/P: higher = cheaper. Sharpe: &gt;1 = good risk-adjusted. Vol: lower = less risk.
      </p>
    </div>
  );
}
