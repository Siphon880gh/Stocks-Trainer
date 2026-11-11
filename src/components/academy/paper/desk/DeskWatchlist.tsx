import type { AccountState } from "../../../../lib/academy/paper/types";
import type { DeskScenario } from "../../../../lib/academy/paper/desk/types";
import { quote } from "../../../../lib/academy/paper/desk/scenarios";
import { money } from "../../../../lib/academy/paper/describe";
import { cn } from "../../../../lib/utils";

/** Watchlist: every symbol in the scenario with its last close and change on the day (as of the replay clock). */
export default function DeskWatchlist({ scenario, bar, active, state, onPick }: { scenario: DeskScenario; bar: number; active: string; state: AccountState; onPick: (symbol: string) => void }) {
  return (
    <section className="panel p-2 space-y-1" aria-label="Watchlist" data-testid="desk-watchlist">
      <p className="font-semibold text-[13px] px-1">Watchlist</p>
      <ul className="space-y-1">
        {scenario.symbols.map((s) => {
          const q = quote(scenario, s.symbol, bar);
          const held = state.positions[s.symbol]?.qty ?? 0;
          return (
            <li key={s.symbol}>
              <button
                type="button"
                onClick={() => onPick(s.symbol)}
                aria-pressed={active === s.symbol}
                className={cn("w-full text-left rounded-md border px-2 py-1.5 text-[12px]", active === s.symbol ? "border-sim bg-sim/5" : "border-line hover:border-sim/60")}
                data-symbol={s.symbol}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="font-semibold">{s.symbol}</span>
                  <span className="tabular-nums">{money(q.last)}</span>
                </span>
                <span className="flex items-baseline justify-between gap-2 text-muted">
                  <span className="truncate">{s.name}</span>
                  <span className={cn("tabular-nums", q.change > 0 ? "text-up" : q.change < 0 ? "text-accent-red" : "")}>
                    {q.change > 0 ? "+" : ""}
                    {(q.changePct * 100).toFixed(2)}%
                  </span>
                </span>
                {held ? <span className="block text-[11px] text-sim">{held > 0 ? `Holding ${held}` : `Short ${-held}`}</span> : null}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
