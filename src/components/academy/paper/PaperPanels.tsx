import type { AccountState, Order } from "../../../lib/academy/paper/types";
import { avgCost, buyingPower } from "../../../lib/academy/paper/account";
import { performance, symbolPnl } from "../../../lib/academy/paper/stats";
import { money, orderLabel, pct, signedMoney } from "../../../lib/academy/paper/describe";
import { cn } from "../../../lib/utils";

const tone = (c: number) => (c > 0 ? "text-up" : c < 0 ? "text-accent-red" : "");
const th = "text-left font-medium text-muted px-2 py-1";
const td = "px-2 py-1 tabular-nums";

/** Cash, buying power, equity, day and total P&L (numbers straight from stats.ts). */
export function AccountSummary({ state }: { state: AccountState }) {
  const p = performance(state);
  const cells: [string, string, string, string][] = [
    ["Equity", money(p.equity), "", "equity"],
    ["Cash", money(p.cash), "", "cash"],
    ["Buying power", money(buyingPower(state)), "", "bp"],
    ["Day P&L", signedMoney(p.day), tone(p.day), "day"],
    ["Total P&L", signedMoney(p.total), tone(p.total), "total"],
    ["Realized / unrealized", `${signedMoney(p.realized)} / ${signedMoney(p.unrealized)}`, "", "split"],
    ["Max drawdown", pct(p.maxDrawdown.pct), "", "dd"],
    ["Win rate · avg R", `${p.winRate === null ? "—" : pct(p.winRate, 0)} · ${p.averageR === null ? "—" : `${p.averageR.toFixed(2)}R`}`, "", "wr"],
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" data-testid="account-summary">
      {cells.map(([k, v, cls, id]) => (
        <div key={k} className="panel px-3 py-2">
          <p className="text-[11px] text-muted">{k}</p>
          <p className={cn("font-semibold tabular-nums text-[14px]", cls)} data-stat={id}>
            {v}
          </p>
        </div>
      ))}
    </div>
  );
}

export function PositionsTable({ state }: { state: AccountState }) {
  const rows = Object.values(state.positions);
  return (
    <section className="panel p-3 space-y-1" aria-label="Positions" data-testid="positions">
      <p className="font-semibold text-[13px]">Positions</p>
      {rows.length === 0 ? (
        <p className="text-[12px] text-muted">No open positions.</p>
      ) : (
        <table className="w-full text-[12px]">
          <thead>
            <tr>
              <th className={th}>Symbol</th>
              <th className={th}>Shares</th>
              <th className={th}>Avg cost</th>
              <th className={th}>Last</th>
              <th className={th}>Unrealized</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((p) => {
              const s = symbolPnl(state, p.symbol);
              return (
                <tr key={p.symbol} data-symbol={p.symbol}>
                  <td className={td}>{p.symbol}</td>
                  <td className={td}>{p.qty}</td>
                  <td className={td}>{money(Math.round(avgCost(p)))}</td>
                  <td className={td}>{money(state.marks[p.symbol] ?? 0)}</td>
                  <td className={cn(td, tone(s.unrealized))} data-unrealized={s.unrealized}>
                    {signedMoney(s.unrealized)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </section>
  );
}

const levelOf = (o: Order) => (o.type === "trailing-stop" ? ` · stop now ${money(o.trailStop!)}` : o.type === "stop-limit" && o.triggered ? " · triggered, working as a limit" : "");

export function OpenOrders({ state, onCancel }: { state: AccountState; onCancel?: (id: string) => void }) {
  const working = state.orders.filter((o) => o.status === "working");
  return (
    <section className="panel p-3 space-y-1" aria-label="Open orders" data-testid="open-orders">
      <p className="font-semibold text-[13px]">Open orders</p>
      {working.length === 0 ? <p className="text-[12px] text-muted">No working orders.</p> : null}
      <ul className="space-y-1">
        {working.map((o) => (
          <li key={o.id} className="flex items-center gap-2 text-[12px]" data-order={o.id}>
            <span className="flex-1">
              {orderLabel(o)}
              {levelOf(o)}
              {o.reserved ? ` · holds ${money(o.reserved)}` : ""}
              {o.waiting ? " · waits for its entry to fill" : o.ocoGroup ? " · OCO (one cancels the other)" : ""}
            </span>
            {onCancel ? (
              <button type="button" onClick={() => onCancel(o.id)} className="px-2 py-0.5 rounded border border-line hover:border-accent-red" data-testid={`cancel-${o.id}`}>
                Cancel
              </button>
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

const STATUS_CLS: Record<Order["status"], string> = { working: "", filled: "text-up", cancelled: "text-muted", expired: "text-muted", rejected: "text-accent-red" };

export function OrderHistory({ state }: { state: AccountState }) {
  const done = state.orders.filter((o) => o.status !== "working").slice().reverse();
  return (
    <section className="panel p-3 space-y-1" aria-label="Order history" data-testid="order-history">
      <p className="font-semibold text-[13px]">Order history</p>
      {done.length === 0 ? <p className="text-[12px] text-muted">Nothing yet.</p> : null}
      <ul className="space-y-1">
        {done.map((o) => (
          <li key={o.id} className="text-[12px]" data-order={o.id} data-status={o.status}>
            <span className={cn("font-semibold capitalize mr-1", STATUS_CLS[o.status])}>{o.status}</span>
            {orderLabel(o)}
            {o.fillPrice !== undefined ? ` · filled ${money(o.fillPrice)} on bar ${o.closedAtBar}` : o.closedAtBar !== undefined ? ` · bar ${o.closedAtBar}` : ""}
            {o.reason ? <span className="block text-muted">{o.reason}</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
