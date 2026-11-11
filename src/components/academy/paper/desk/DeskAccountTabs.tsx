import { useState } from "react";
import type { AccountState, Order } from "../../../../lib/academy/paper/types";
import { roundTrips } from "../../../../lib/academy/paper/stats";
import { money, orderLabel, signedMoney } from "../../../../lib/academy/paper/describe";
import { OpenOrders, PositionsTable } from "../PaperPanels";
import EquityCurve from "../EquityCurve";
import { cn } from "../../../../lib/utils";
import { dayLabel } from "./format";

type Tab = "positions" | "orders" | "history" | "trades" | "equity";
const TABS: [Tab, string][] = [
  ["positions", "Positions"],
  ["orders", "Orders"],
  ["history", "Order history"],
  ["trades", "Closed trades"],
  ["equity", "Equity"],
];

const STATUS_CLS: Record<Order["status"], string> = { working: "", filled: "text-up", cancelled: "text-muted", expired: "text-muted", rejected: "text-accent-red" };

/** Account manager under the chart: tabs for positions, working orders, order history, closed trades and the equity line. */
export default function DeskAccountTabs({ state, labels, onCancel, onFlatten }: { state: AccountState; labels: string[]; onCancel?: (id: string) => void; onFlatten?: (symbol: string) => void }) {
  const [tab, setTab] = useState<Tab>("positions");
  const at = (bar: number | undefined | null) => (bar === undefined || bar === null ? "" : dayLabel(labels[bar] ?? String(bar)));
  const working = state.orders.filter((o) => o.status === "working").length;
  const trips = roundTrips(state).filter((t) => t.closed).reverse();
  const done = state.orders.filter((o) => o.status !== "working").slice().reverse();
  return (
    <section className="space-y-2" data-testid="desk-account-tabs">
      <div className="flex flex-wrap gap-1 text-[12px]" role="tablist" aria-label="Account">
        {TABS.map(([id, label]) => (
          <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={cn("px-2.5 py-1 rounded-md border", tab === id ? "border-sim bg-sim/10 font-semibold" : "border-line")} data-testid={`desk-tab-${id}`}>
            {label}
            {id === "orders" && working ? ` (${working})` : id === "positions" && Object.keys(state.positions).length ? ` (${Object.keys(state.positions).length})` : ""}
          </button>
        ))}
      </div>
      {tab === "positions" ? (
        <div className="space-y-1">
          <PositionsTable state={state} />
          {onFlatten && Object.keys(state.positions).length ? (
            <div className="flex flex-wrap gap-1.5 text-[12px]">
              {Object.keys(state.positions).map((sym) => (
                <button key={sym} type="button" onClick={() => onFlatten(sym)} className="px-2 py-0.5 rounded border border-line hover:border-accent-red" data-testid={`flatten-${sym}`}>
                  Close {sym} at the next open
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
      {tab === "orders" ? <OpenOrders state={state} onCancel={onCancel} /> : null}
      {tab === "history" ? (
        <section className="panel p-3 space-y-1" data-testid="desk-history">
          {done.length === 0 ? <p className="text-[12px] text-muted">Nothing yet.</p> : null}
          <ul className="space-y-1">
            {done.map((o) => (
              <li key={o.id} className="text-[12px]" data-order={o.id} data-status={o.status}>
                <span className={cn("font-semibold capitalize mr-1", STATUS_CLS[o.status])}>{o.status}</span>
                {orderLabel(o)} · placed {at(o.placedAtBar)}
                {o.fillPrice !== undefined ? ` · filled ${money(o.fillPrice)} on ${at(o.closedAtBar)}` : o.closedAtBar !== undefined ? ` · ${at(o.closedAtBar)}` : ""}
                {o.reason ? <span className="block text-muted">{o.reason}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {tab === "trades" ? (
        <section className="panel p-3" data-testid="desk-trades">
          {trips.length === 0 ? (
            <p className="text-[12px] text-muted">No closed trades yet. A trade closes when the position goes back to zero.</p>
          ) : (
            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-muted">
                  <th className="text-left font-medium px-1">Symbol</th>
                  <th className="text-left font-medium px-1">Side</th>
                  <th className="text-left font-medium px-1">Opened</th>
                  <th className="text-left font-medium px-1">Closed</th>
                  <th className="text-right font-medium px-1">Entry</th>
                  <th className="text-right font-medium px-1">P&L</th>
                  <th className="text-right font-medium px-1">R</th>
                </tr>
              </thead>
              <tbody>
                {trips.map((t, i) => (
                  <tr key={i} className="border-t border-line">
                    <td className="px-1">{t.symbol}</td>
                    <td className="px-1">{t.direction}</td>
                    <td className="px-1">{at(t.entryBar)}</td>
                    <td className="px-1">{at(t.exitBar)}</td>
                    <td className="px-1 text-right tabular-nums">{money(t.entryPrice)}</td>
                    <td className={cn("px-1 text-right tabular-nums", t.pnl > 0 ? "text-up" : t.pnl < 0 ? "text-accent-red" : "")}>{signedMoney(t.pnl)}</td>
                    <td className="px-1 text-right tabular-nums">{t.r === null ? "—" : `${t.r.toFixed(2)}R`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      ) : null}
      {tab === "equity" ? <EquityCurve points={state.equityCurve} startingCash={state.startingCash} /> : null}
    </section>
  );
}
