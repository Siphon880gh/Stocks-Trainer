import { useCallback, useState } from "react";
import { Link } from "react-router-dom";
import PaperSession from "../../components/academy/paper/PaperSession";
import SimulatedBanner from "../../components/academy/SimulatedBanner";
import SampleDataNote from "../../components/SampleDataNote";
import { TAPES } from "../../lib/academy/paper/tapes";
import { CASH_PRESETS, DEFAULT_STARTING_CASH } from "../../lib/academy/paper/account";
import { START_BAR, newSessionLog, replay } from "../../lib/academy/paper/session";
import { addCounters, countersFor } from "../../lib/academy/paper/counters";
import { money } from "../../lib/academy/paper/describe";
import type { PaperOptions, PaperSessionLog } from "../../lib/academy/paper/types";
import { loadPaper, savePaper, type KVStorage, type PaperStore } from "../../lib/academy/storage";
import PortfolioBar from "../../components/academy/paper/PortfolioBar";
import { awardFirstOrder, refreshStoredBadges } from "../../lib/academy/rewards/award";
import { cn } from "../../lib/utils";

/** /paper — BA5.M3: the simulated paper account on SAMPLE tapes, persisted as an action log. */
export default function Paper({ storage }: { storage?: KVStorage }) {
  const [store, setStore] = useState(() => loadPaper(storage).state);
  const [tapeId, setTapeId] = useState(TAPES[0]!.id);
  const [cash, setCash] = useState(DEFAULT_STARTING_CASH);
  const [note, setNote] = useState<string | null>(null);
  const [options, setOptions] = useState<PaperOptions>({});
  const toggle = (k: "allowShort" | "fractional") => setOptions((o) => ({ ...o, [k]: !o[k] }));
  const setNum = (k: "feeCents" | "slippageBps", v: number) => setOptions((o) => ({ ...o, [k]: v }));

  const persist = useCallback(
    (session: PaperSessionLog | null, statsFrom?: PaperSessionLog) => {
      setStore((prev) => {
        const stats = statsFrom ? addCounters(prev.stats, countersFor(replay(statsFrom))) : prev.stats;
        const next = { ...prev, session, stats };
        savePaper(next, storage);
        return next;
      });
    },
    [storage],
  );

  const replaceStore = useCallback(
    (next: PaperStore) => {
      savePaper(next, storage);
      setStore(next);
    },
    [storage],
  );

  const onLog = useCallback(
    (log: PaperSessionLog, ev: { placed?: boolean; accepted?: boolean }) => {
      persist(log);
      if (ev.placed && ev.accepted) {
        const r = awardFirstOrder(storage);
        if (r.added || r.newBadges.length) setNote(`${r.added ? `+${r.added} practice points. ` : ""}${r.newBadges.length ? "New badge earned." : ""}`);
      } else if (!ev.placed) {
        const r = refreshStoredBadges(storage);
        if (r.newBadges.length) setNote("New badge earned. See it in the Academy.");
      }
    },
    [persist, storage],
  );

  return (
    <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full space-y-4" data-testid="paper-page">
      <header className="space-y-1">
        <p className="text-[12px] text-muted">
          <Link to="/academy" className="hover:text-ink">
            Academy
          </Link>{" "}
          · Paper trading
        </p>
        <div className="flex flex-wrap items-baseline gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">Paper trading</h1>
          <Link to="/paper/challenges" className="text-[13px] text-primary underline">
            Challenges
          </Link>
        </div>
        <p className="text-[13px] text-muted max-w-3xl">
          Practise every order type with virtual money. Step one daily bar at a time; nothing after the current bar is shown.
        </p>
        <SampleDataNote />
      </header>
      {note ? (
        <p className="text-[13px] panel px-3 py-2 border-sim/40" role="status" data-testid="reward-toast">
          {note}{" "}
          <button type="button" className="text-muted underline ml-1" onClick={() => setNote(null)}>
            Dismiss
          </button>
        </p>
      ) : null}
      <PortfolioBar store={store} onChange={replaceStore} />
      {store.session ? (
        <div key={store.portfolio.id}>
          <PaperSession
            log={store.session}
            onLog={onLog}
            allowBracket
            journal
            toolbar={
              <button type="button" onClick={() => persist(null, store.session!)} className="px-3 py-1.5 rounded-md border border-line text-[13px] hover:border-accent-red" data-testid="paper-reset">
                New session
              </button>
            }
          />
        </div>
      ) : (
        <section className="space-y-3" data-testid="paper-setup">
          <SimulatedBanner />
          <div className="panel p-4 space-y-3">
            <p className="font-semibold">1. Pick a tape</p>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
              {TAPES.map((t) => (
                <button key={t.id} type="button" onClick={() => setTapeId(t.id)} aria-pressed={tapeId === t.id} className={cn("text-left panel p-3 space-y-1", tapeId === t.id ? "border-sim ring-1 ring-sim" : "hover:border-sim/60")} data-tape={t.id}>
                  <p className="font-semibold text-[13px]">
                    {t.name} <span className="text-muted font-normal">{t.symbol}</span>
                  </p>
                  <p className="text-[12px] text-muted">{t.description}</p>
                  <p className="text-[12px]">{t.lesson}</p>
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
            <p className="font-semibold">3. Stretch rules (optional, off by default)</p>
            <div className="space-y-1.5 text-[13px]" data-testid="paper-options">
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={!!options.allowShort} onChange={() => toggle("allowShort")} data-testid="opt-short" />
                <span>
                  Allow short selling on margin <span className="text-muted">(sell shares you do not own; 50% margin held; unlimited-loss risk)</span>
                </span>
              </label>
              <label className="flex items-start gap-2">
                <input type="checkbox" checked={!!options.fractional} onChange={() => toggle("fractional")} data-testid="opt-fractional" />
                <span>
                  Fractional shares and dollar-amount buys <span className="text-muted">(quantities to 4 decimals; &ldquo;buy $500 of&rdquo; market orders)</span>
                </span>
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <span>Trading costs:</span>
                <label className="flex items-center gap-1">
                  fee per fill
                  <select className="border border-line rounded px-1 py-0.5" value={options.feeCents ?? 0} onChange={(e) => setNum("feeCents", Number(e.target.value))} data-testid="opt-fee">
                    {[0, 50, 100, 500].map((c) => (
                      <option key={c} value={c}>
                        {c ? money(c) : "none"}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex items-center gap-1">
                  slippage
                  <select className="border border-line rounded px-1 py-0.5" value={options.slippageBps ?? 0} onChange={(e) => setNum("slippageBps", Number(e.target.value))} data-testid="opt-slippage">
                    {[0, 5, 10, 25].map((b) => (
                      <option key={b} value={b}>
                        {b ? `${b} bps` : "none"}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
            <button type="button" onClick={() => persist(newSessionLog(tapeId, cash, START_BAR, options))} className="px-4 py-2 rounded-md bg-sim hover:bg-sim-dim text-white font-semibold text-[13px]" data-testid="paper-start">
              Start the session
            </button>
          </div>
        </section>
      )}
    </main>
  );
}
