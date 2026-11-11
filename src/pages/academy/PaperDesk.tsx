import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import DeskSession from "../../components/academy/paper/desk/DeskSession";
import SimulatedBanner from "../../components/academy/SimulatedBanner";
import { DESK_SCENARIOS, lastBarOf, getDeskScenario } from "../../lib/academy/paper/desk/scenarios";
import { newDeskLog } from "../../lib/academy/paper/desk/session";
import { loadDesk, saveDesk, type DeskStore } from "../../lib/academy/paper/desk/storage";
import type { DeskLog } from "../../lib/academy/paper/desk/types";
import { CASH_PRESETS } from "../../lib/academy/paper/account";
import { money } from "../../lib/academy/paper/describe";
import type { PaperOptions } from "../../lib/academy/paper/types";
import type { KVStorage } from "../../lib/academy/storage";
import { awardFirstOrder } from "../../lib/academy/rewards/award";
import { cn } from "../../lib/utils";

/** /paper/desk — a fuller paper-trading desk: many symbols on one replay clock, with news and filings that unlock as it runs. */
export default function PaperDesk({ storage }: { storage?: KVStorage }) {
  const [store, setStore] = useState<DeskStore>(() => loadDesk(storage));
  const [scenarioId, setScenarioId] = useState(DESK_SCENARIOS[0]!.id);
  const [cash, setCash] = useState<number>(10_000_000);
  const [options, setOptions] = useState<PaperOptions>({});
  const [note, setNote] = useState<string | null>(null);

  const persist = useCallback(
    (session: DeskLog | null) => {
      setStore((prev) => {
        let completed = prev.completed;
        const s = session && getDeskScenario(session.scenarioId);
        if (session && s && prev.session && session.bar >= lastBarOf(s) && prev.session.bar < lastBarOf(s)) completed = { ...completed, [s.id]: (completed[s.id] ?? 0) + 1 };
        const next = { session, completed };
        saveDesk(next, storage);
        return next;
      });
    },
    [storage],
  );

  const onLog = useCallback(
    (log: DeskLog, ev: { placed?: boolean; accepted?: boolean }) => {
      persist(log);
      if (ev.placed && ev.accepted) {
        const r = awardFirstOrder(storage);
        if (r.added || r.newBadges.length) setNote(`${r.added ? `+${r.added} practice points. ` : ""}${r.newBadges.length ? "New badge earned." : ""}`);
      }
    },
    [persist, storage],
  );

  return (
    <main className="flex-1 px-4 py-6 max-w-7xl mx-auto w-full space-y-4" data-testid="paper-desk-page">
      <header className="space-y-1">
        <p className="text-[12px] text-muted">
          <Link to="/academy" className="hover:text-ink">
            Academy
          </Link>{" "}
          ·{" "}
          <Link to="/paper" className="hover:text-ink">
            Paper trading
          </Link>{" "}
          · Desk
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Paper trading desk</h1>
        <p className="text-[13px] text-muted max-w-3xl">
          The full broker-style layout: a watchlist, a chart with your fills on it, an order ticket with brackets and position sizing, an account manager, and the news and
          financial statements a trader would have had on each day. The replay never shows anything dated after the current day.
        </p>
      </header>
      {note ? (
        <p className="text-[13px] panel px-3 py-2 border-sim/40" role="status">
          {note}{" "}
          <button type="button" className="text-muted underline ml-1" onClick={() => setNote(null)}>
            Dismiss
          </button>
        </p>
      ) : null}
      {store.session ? (
        <DeskSession
          log={store.session}
          onLog={onLog}
          toolbar={
            <button type="button" onClick={() => persist(null)} className="px-3 py-1.5 rounded-md border border-line text-[13px] hover:border-accent-red" data-testid="desk-reset">
              Reset account
            </button>
          }
        />
      ) : (
        <section className="space-y-3" data-testid="desk-setup">
          <SimulatedBanner />
          <div className="panel p-4 space-y-3">
            <p className="font-semibold">1. Pick a scenario</p>
            <div className="grid md:grid-cols-2 gap-2">
              {DESK_SCENARIOS.map((s) => (
                <button key={s.id} type="button" onClick={() => setScenarioId(s.id)} aria-pressed={scenarioId === s.id} className={cn("text-left panel p-3 space-y-1", scenarioId === s.id ? "border-sim ring-1 ring-sim" : "hover:border-sim/60")} data-scenario={s.id}>
                  <p className="font-semibold text-[13px]">
                    {s.title} <span className="text-muted font-normal">· {s.symbols.map((x) => x.symbol).join(", ")}</span>
                  </p>
                  <p className="text-[12px] text-muted">{s.description}</p>
                  <p className="text-[12px]">{s.lesson}</p>
                  <p className="text-[11px] text-muted">{s.sourceNote}</p>
                  {store.completed[s.id] ? <p className="text-[11px] text-up">Finished {store.completed[s.id]}×</p> : null}
                </button>
              ))}
            </div>
            <p className="font-semibold">2. Starting virtual cash</p>
            <div className="flex flex-wrap gap-2">
              {CASH_PRESETS.map((c) => (
                <button key={c} type="button" onClick={() => setCash(c)} aria-pressed={cash === c} className={cn("px-3 py-1.5 rounded-md border text-[13px] tabular-nums", cash === c ? "border-sim bg-sim/10" : "border-line")}>
                  {money(c)}
                </button>
              ))}
            </div>
            <p className="font-semibold">3. Account rules (optional)</p>
            <div className="space-y-1.5 text-[13px]">
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={!!options.allowShort} onChange={() => setOptions((o) => ({ ...o, allowShort: !o.allowShort }))} data-testid="desk-opt-short" />
                <span>
                  Allow short selling on margin <span className="text-muted">(50% margin held; unlimited-loss risk)</span>
                </span>
              </label>
              <label className="flex items-center gap-2">
                Slippage on market and stop fills
                <select className="border border-line rounded px-1 py-0.5" value={options.slippageBps ?? 0} onChange={(e) => setOptions((o) => ({ ...o, slippageBps: Number(e.target.value) }))} data-testid="desk-opt-slippage">
                  {[0, 5, 10, 25].map((b) => (
                    <option key={b} value={b}>
                      {b ? `${b} bps` : "none"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex items-center gap-2">
                Fee per fill
                <select className="border border-line rounded px-1 py-0.5" value={options.feeCents ?? 0} onChange={(e) => setOptions((o) => ({ ...o, feeCents: Number(e.target.value) }))}>
                  {[0, 50, 100, 500].map((c) => (
                    <option key={c} value={c}>
                      {c ? money(c) : "none"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <button type="button" onClick={() => persist(newDeskLog(scenarioId, cash, options))} className="px-4 py-2 rounded-md bg-sim hover:bg-sim-dim text-white font-semibold text-[13px]" data-testid="desk-start">
              Open the desk
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
