import {
  getFinancialSnapshot,
  simplePE,
  type FinancialSnapshot,
} from "../lib/financialSnapshots";

interface FinancialSnapshotCardProps {
  snapshotId?: string;
  snapshot?: FinancialSnapshot;
}

function fmt(n: number): string {
  return n.toLocaleString(undefined, { maximumFractionDigits: 1 });
}

export default function FinancialSnapshotCard({
  snapshotId,
  snapshot: snapshotProp,
}: FinancialSnapshotCardProps) {
  const snapshot = snapshotProp ?? (snapshotId ? getFinancialSnapshot(snapshotId) : undefined);
  if (!snapshot) return null;

  const pe = simplePE(snapshot);

  return (
    <div className="bg-background-dark border-2 border-line rounded-xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 border-b border-line bg-surface">
        <p className="text-[10px] font-mono text-primary/50 tracking-widest uppercase">
          Practice snapshot · {snapshot.symbol}
        </p>
        <p className="text-[10px] font-mono text-primary/70">{snapshot.label}</p>
      </div>
      <div className="p-4 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
        <div className="border border-line rounded p-3 space-y-1 bg-canvas">
          <p className="text-primary/50 uppercase tracking-wider text-[10px]">Income statement</p>
          <p>Revenue: {fmt(snapshot.incomeStatement.revenue)}</p>
          <p>Net income: {fmt(snapshot.incomeStatement.netIncome)}</p>
          <p className="text-primary">Margin: {snapshot.incomeStatement.netMarginPct}%</p>
        </div>
        <div className="border border-line rounded p-3 space-y-1 bg-canvas">
          <p className="text-primary/50 uppercase tracking-wider text-[10px]">Balance sheet</p>
          <p>Assets: {fmt(snapshot.balanceSheet.assets)}</p>
          <p>Liabilities: {fmt(snapshot.balanceSheet.liabilities)}</p>
          <p className="text-primary">Equity: {fmt(snapshot.balanceSheet.equity)}</p>
        </div>
        <div className="border border-line rounded p-3 space-y-1 bg-canvas">
          <p className="text-primary/50 uppercase tracking-wider text-[10px]">Cash flow</p>
          <p>Operating CF: {fmt(snapshot.cashFlow.operatingCashFlow)}</p>
          <p>Free CF: {fmt(snapshot.cashFlow.freeCashFlow)}</p>
          <p className="text-primary">
            P/E ≈ {pe.toFixed(1)} (price {fmt(snapshot.price)} / eps {fmt(snapshot.earnings)})
          </p>
        </div>
      </div>
      <p className="px-4 pb-3 text-[10px] text-slate-500">{snapshot.notes}</p>
    </div>
  );
}
