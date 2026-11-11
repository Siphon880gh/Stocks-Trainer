import { useState } from "react";
import { rewardRisk, sharesForAmount, sharesForPercent, sharesForRisk } from "../../../../lib/academy/paper/desk/sizing";
import { money } from "../../../../lib/academy/paper/describe";
import { cn } from "../../../../lib/utils";

type Mode = "risk" | "percent" | "amount";

const toCents = (s: string) => Math.round(Number(s) * 100);
const input = "w-full px-2 py-1 rounded-md border border-line bg-white text-[12px] tabular-nums";

/** Position-size calculator (risk from a stop, % of equity, or a cash amount) that hands a share count to the ticket. */
export default function DeskSizing({ last, equity, onUse }: { last: number; equity: number; onUse: (qty: number, stop?: number, target?: number) => void }) {
  const [mode, setMode] = useState<Mode>("risk");
  const [risk, setRisk] = useState("100");
  const [stop, setStop] = useState(((last * 0.95) / 100).toFixed(2));
  const [target, setTarget] = useState(((last * 1.1) / 100).toFixed(2));
  const [pct, setPct] = useState("10");
  const [amount, setAmount] = useState("1000");
  const qty =
    mode === "risk" ? sharesForRisk(toCents(risk), last, toCents(stop)) : mode === "percent" ? sharesForPercent(Number(pct), equity, last) : sharesForAmount(toCents(amount), last);
  const rr = mode === "risk" ? rewardRisk(last, toCents(stop), toCents(target)) : null;
  return (
    <section className="panel p-3 space-y-2 text-[12px]" aria-label="Position size" data-testid="desk-sizing">
      <p className="font-semibold text-[13px]">Position size</p>
      <div className="grid grid-cols-3 gap-1" role="group" aria-label="Size by">
        {(["risk", "percent", "amount"] as const).map((m) => (
          <button key={m} type="button" onClick={() => setMode(m)} aria-pressed={mode === m} className={cn("py-1 rounded-md border", mode === m ? "border-sim bg-sim/10" : "border-line")} data-testid={`size-${m}`}>
            {m === "risk" ? "Risk $" : m === "percent" ? "% equity" : "Cash $"}
          </button>
        ))}
      </div>
      {mode === "risk" ? (
        <div className="grid grid-cols-3 gap-1.5">
          <label className="text-muted">
            Risk $
            <input className={input} inputMode="decimal" value={risk} onChange={(e) => setRisk(e.target.value)} data-testid="size-risk-input" />
          </label>
          <label className="text-muted">
            Stop
            <input className={input} inputMode="decimal" value={stop} onChange={(e) => setStop(e.target.value)} data-testid="size-stop-input" />
          </label>
          <label className="text-muted">
            Target
            <input className={input} inputMode="decimal" value={target} onChange={(e) => setTarget(e.target.value)} />
          </label>
        </div>
      ) : mode === "percent" ? (
        <label className="block text-muted">
          % of equity ({money(equity)})
          <input className={input} inputMode="decimal" value={pct} onChange={(e) => setPct(e.target.value)} />
        </label>
      ) : (
        <label className="block text-muted">
          Cash to spend
          <input className={input} inputMode="decimal" value={amount} onChange={(e) => setAmount(e.target.value)} />
        </label>
      )}
      <p data-testid="size-result" data-qty={qty}>
        <strong className="tabular-nums">{qty}</strong> shares at about {money(last)} = {money(qty * last)}
        {mode === "risk" && qty > 0 ? ` · loses about ${money(qty * Math.abs(last - toCents(stop)))} at the stop` : ""}
        {rr !== null ? ` · reward ÷ risk ${rr.toFixed(1)}` : ""}
      </p>
      <p className="text-muted">A gap can open past the stop, so the real loss can be larger than planned.</p>
      <button
        type="button"
        disabled={qty <= 0}
        onClick={() => onUse(qty, mode === "risk" ? toCents(stop) : undefined, mode === "risk" ? toCents(target) : undefined)}
        className="w-full py-1.5 rounded-md border border-sim text-sim font-semibold disabled:opacity-40"
        data-testid="size-use"
      >
        Use {qty} shares on the ticket
      </button>
    </section>
  );
}
