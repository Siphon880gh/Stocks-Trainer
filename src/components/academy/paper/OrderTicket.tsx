import { useState } from "react";
import type { AccountState, OrderSpec, OrderType, Side, TimeInForce } from "../../../lib/academy/paper/types";
import { ORDER_TYPES } from "../../../lib/academy/paper/types";
import { validateOrder, type Validation } from "../../../lib/academy/paper/validate";
import { buyingPower } from "../../../lib/academy/paper/account";
import { TYPE_LABELS, describeBracket, describeOrder, describeShort, estimatePrice, money } from "../../../lib/academy/paper/describe";
import { validateBracket } from "../../../lib/academy/paper/linked";
import { cn } from "../../../lib/utils";

interface Props {
  state: AccountState;
  symbol: string;
  allowedTypes?: readonly OrderType[];
  disabled?: boolean;
  onSubmit: (spec: OrderSpec, exits?: BracketExits) => void;
  /** BA11.M1: offer "attach stop / target" (a bracket) on buy orders. */
  allowBracket?: boolean;
  /** Test / screenshot preset. */
  initial?: Partial<TicketFields>;
}

export interface TicketFields {
  side: Side;
  type: OrderType;
  qty: string;
  tif: TimeInForce;
  limit: string;
  stop: string;
  trailMode: "amount" | "percent";
  trail: string;
  bracket?: boolean;
  /** BA11.M3: fractional sessions can size a market buy in dollars. */
  qtyMode?: "shares" | "dollars";
  amount?: string;
  exitStop?: string;
  exitTarget?: string;
}

export interface BracketExits {
  stopPrice?: number;
  targetPrice?: number;
}

const toCents = (s: string) => (s.trim() === "" ? undefined : Math.round(Number(s) * 100));

export function specFromFields(f: TicketFields, symbol: string, last = 0): OrderSpec {
  const spec: OrderSpec = { symbol, side: f.side, type: f.type, qty: Number(f.qty), tif: f.tif };
  if (f.qtyMode === "dollars" && f.side === "buy" && f.type === "market") {
    spec.amount = toCents(f.amount ?? "") ?? 0;
    spec.qty = last > 0 ? Math.floor((spec.amount / last) * 10_000) / 10_000 : 0;
  }
  if (f.type === "limit" || f.type === "stop-limit") spec.limitPrice = toCents(f.limit);
  if (f.type === "stop" || f.type === "stop-limit") spec.stopPrice = toCents(f.stop);
  if (f.type === "trailing-stop") {
    if (f.trailMode === "amount") spec.trailAmount = toCents(f.trail);
    else spec.trailPercent = f.trail.trim() === "" ? undefined : Number(f.trail);
  }
  return spec;
}

const input = "w-full px-2 py-1.5 rounded-md border border-line bg-white text-[13px] tabular-nums";

/** BA5.M1: order ticket with live validation and a generated plain-language preview. SIMULATED. */
export default function OrderTicket({ state, symbol, allowedTypes = ORDER_TYPES, disabled, onSubmit, initial, allowBracket }: Props) {
  const last = state.marks[symbol] ?? 0;
  const [f, setF] = useState<TicketFields>({ side: "buy", type: allowedTypes[0] ?? "market", qty: "10", tif: "gtc", limit: "", stop: "", trailMode: "percent", trail: "5", ...initial });
  const set = (patch: Partial<TicketFields>) => setF({ ...f, ...patch });
  const dollarsOk = !!state.options?.fractional && f.side === "buy" && f.type === "market";
  const spec = specFromFields(dollarsOk ? f : { ...f, qtyMode: "shares" }, symbol, last);
  const ctx = { lastClose: { [symbol]: last } };
  const canBracket = !!allowBracket && f.side === "buy" && f.type !== "trailing-stop";
  const bracketOn = canBracket && !!f.bracket;
  const exits: BracketExits = { stopPrice: toCents(f.exitStop ?? ""), targetPrice: toCents(f.exitTarget ?? "") };
  const v = bracketOn ? validateBracket(state, spec, exits.stopPrice, exits.targetPrice, ctx) : validateOrder(state, spec, ctx);
  const est = spec.amount ?? (Number.isFinite(spec.qty) ? Math.round(spec.qty * estimatePrice(spec, last)) : 0);
  const types = allowedTypes.filter((t) => !(t === "trailing-stop" && f.side === "buy"));
  return (
    <form
      className="panel p-3 space-y-2.5 border-sim/40"
      data-testid="order-ticket"
      onSubmit={(e) => {
        e.preventDefault();
        if (v.ok && !disabled) (bracketOn ? onSubmit(spec, exits) : onSubmit(spec));
      }}
    >
      <div className="flex items-baseline justify-between">
        <p className="font-semibold text-[14px]">Order ticket · {symbol}</p>
        <span className="text-[11px] text-sim font-semibold">SIMULATED</span>
      </div>
      <div className="grid grid-cols-2 gap-1.5" role="group" aria-label="Side">
        {(["buy", "sell"] as const).map((s) => (
          <button key={s} type="button" onClick={() => set({ side: s, type: s === "buy" && f.type === "trailing-stop" ? "market" : f.type })} aria-pressed={f.side === s} className={cn("py-1.5 rounded-md text-[13px] font-semibold border", f.side === s ? (s === "buy" ? "bg-up text-white border-up" : "bg-accent-red text-white border-accent-red") : "border-line")}>
            {s === "buy" ? "Buy" : "Sell"}
          </button>
        ))}
      </div>
      {dollarsOk ? (
        <div className="grid grid-cols-2 gap-1.5 text-[12px]" role="group" aria-label="Size in">
          {(["shares", "dollars"] as const).map((m) => (
            <button key={m} type="button" onClick={() => set({ qtyMode: m })} aria-pressed={(f.qtyMode ?? "shares") === m} className={cn("py-1 rounded-md border", (f.qtyMode ?? "shares") === m ? "border-sim bg-sim/10" : "border-line")} data-testid={`ticket-size-${m}`}>
              {m === "shares" ? "Shares" : "Dollars"}
            </button>
          ))}
        </div>
      ) : null}
      <label className="block text-[12px] text-muted">
        Order type
        <select className={input} value={f.type} onChange={(e) => set({ type: e.target.value as OrderType })} data-testid="ticket-type">
          {types.map((t) => (
            <option key={t} value={t}>
              {TYPE_LABELS[t]}
            </option>
          ))}
        </select>
      </label>
      <div className="grid grid-cols-2 gap-2">
        {dollarsOk && f.qtyMode === "dollars" ? (
          <label className="block text-[12px] text-muted">
            Dollar amount ($)
            <input className={input} inputMode="decimal" value={f.amount ?? ""} onChange={(e) => set({ amount: e.target.value })} data-testid="ticket-amount" />
          </label>
        ) : (
          <label className="block text-[12px] text-muted">
            Shares{state.options?.fractional ? " (up to 4 decimals)" : ""}
            <input className={input} inputMode={state.options?.fractional ? "decimal" : "numeric"} value={f.qty} onChange={(e) => set({ qty: e.target.value })} data-testid="ticket-qty" />
          </label>
        )}
        <label className="block text-[12px] text-muted">
          Time in force
          <select className={input} value={f.tif} onChange={(e) => set({ tif: e.target.value as TimeInForce })}>
            <option value="day">Day</option>
            <option value="gtc">Good-til-canceled</option>
          </select>
        </label>
        {f.type === "stop" || f.type === "stop-limit" ? (
          <label className="block text-[12px] text-muted">
            Stop price ($)
            <input className={input} inputMode="decimal" value={f.stop} placeholder={(last / 100).toFixed(2)} onChange={(e) => set({ stop: e.target.value })} data-testid="ticket-stop" />
          </label>
        ) : null}
        {f.type === "limit" || f.type === "stop-limit" ? (
          <label className="block text-[12px] text-muted">
            Limit price ($)
            <input className={input} inputMode="decimal" value={f.limit} placeholder={(last / 100).toFixed(2)} onChange={(e) => set({ limit: e.target.value })} data-testid="ticket-limit" />
          </label>
        ) : null}
        {f.type === "trailing-stop" ? (
          <>
            <label className="block text-[12px] text-muted">
              Trail by
              <select className={input} value={f.trailMode} onChange={(e) => set({ trailMode: e.target.value as TicketFields["trailMode"] })}>
                <option value="percent">Percent</option>
                <option value="amount">Dollars</option>
              </select>
            </label>
            <label className="block text-[12px] text-muted">
              Trail {f.trailMode === "percent" ? "(%)" : "($)"}
              <input className={input} inputMode="decimal" value={f.trail} onChange={(e) => set({ trail: e.target.value })} data-testid="ticket-trail" />
            </label>
          </>
        ) : null}
      </div>
      {canBracket ? (
        <div className="rounded-md border border-line p-2 space-y-2" data-testid="ticket-bracket">
          <label className="flex items-center gap-2 text-[12px]">
            <input type="checkbox" checked={!!f.bracket} onChange={(e) => set({ bracket: e.target.checked })} data-testid="ticket-bracket-toggle" />
            Attach a stop and / or target (bracket order)
          </label>
          {f.bracket ? (
            <div className="grid grid-cols-2 gap-2">
              <label className="block text-[12px] text-muted">
                Protective stop ($)
                <input className={input} inputMode="decimal" value={f.exitStop ?? ""} placeholder="below entry" onChange={(e) => set({ exitStop: e.target.value })} data-testid="ticket-exit-stop" />
              </label>
              <label className="block text-[12px] text-muted">
                Target ($)
                <input className={input} inputMode="decimal" value={f.exitTarget ?? ""} placeholder="above entry" onChange={(e) => set({ exitTarget: e.target.value })} data-testid="ticket-exit-target" />
              </label>
            </div>
          ) : null}
        </div>
      ) : null}
      <p className="text-[12px] text-muted tabular-nums">
        Last close {money(last)} · {f.side === "buy" ? `Est. cost ${money(est)} · Buying power ${money(buyingPower(state))}` : `Shares held ${state.positions[symbol]?.qty ?? 0}${state.options?.allowShort ? ` · Buying power ${money(buyingPower(state))}` : ""}`}
      </p>
      <p className="text-[13px] bg-sim/5 border border-sim/30 rounded-md px-2.5 py-2" data-testid="order-preview">
        {v.errors.length ? "Fix the order to see what it will do." : describeOrder(spec, last)}
        {!v.errors.length && !bracketOn && describeShort(v as Validation) ? <span className="block mt-1" data-testid="short-preview">{describeShort(v as Validation)}</span> : null}
        {bracketOn && !v.errors.length ? <span className="block mt-1" data-testid="bracket-preview">{describeBracket(exits, spec.qty)}</span> : null}
      </p>
      {v.errors.map((e) => (
        <p key={e.code} className="text-[12px] text-accent-red" data-code={e.code}>
          {e.message}
        </p>
      ))}
      {v.warnings.map((w) => (
        <p key={w.code} className="text-[12px] text-amber-700" data-code={w.code}>
          {w.message}
        </p>
      ))}
      <button type="submit" disabled={!v.ok || disabled} className="w-full py-2 rounded-md bg-sim hover:bg-sim-dim text-white text-[13px] font-semibold disabled:opacity-40" data-testid="ticket-submit">
        Place simulated order
      </button>
    </form>
  );
}
