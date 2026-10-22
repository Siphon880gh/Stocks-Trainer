import { useState } from "react";
import type { PaperStore } from "../../../lib/academy/storage";
import { MAX_PORTFOLIOS, NAME_MAX, createPortfolio, deletePortfolio, listPortfolios, switchPortfolio, type PortfolioResult } from "../../../lib/academy/paper/portfolios";
import { replay } from "../../../lib/academy/paper/session";
import { equity } from "../../../lib/academy/paper/account";
import { money } from "../../../lib/academy/paper/describe";
import { cn } from "../../../lib/utils";

function summary(session: PaperStore["session"]): string {
  if (!session) return "not started";
  try {
    return `equity ${money(equity(replay(session)))}`;
  } catch {
    return "unreadable session";
  }
}

/** BA11.M6: switch, create and delete named paper portfolios. SIMULATED. */
export default function PortfolioBar({ store, onChange }: { store: PaperStore; onChange: (next: PaperStore) => void }) {
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const list = listPortfolios(store).slice().sort((a, b) => (a.id === "main" ? -1 : b.id === "main" ? 1 : a.id.localeCompare(b.id, undefined, { numeric: true })));
  const apply = (r: PortfolioResult) => {
    if (r.ok) {
      setError(null);
      onChange(r.store);
    } else setError((r as { message: string }).message);
  };
  return (
    <section className="panel p-3 space-y-2" aria-label="Paper portfolios" data-testid="portfolio-bar">
      <div className="flex flex-wrap items-center gap-2">
        <p className="font-semibold text-[13px] mr-1">Portfolios</p>
        {list.map((p) => (
          <span key={p.id} className={cn("inline-flex items-center rounded-md border text-[12px]", p.active ? "border-sim bg-sim/10" : "border-line")} data-portfolio={p.id}>
            <button type="button" onClick={() => apply(switchPortfolio(store, p.id))} aria-pressed={p.active} className="px-2 py-1" data-testid={`portfolio-${p.id}`}>
              <span className="font-semibold">{p.name}</span> <span className="text-muted tabular-nums">· {summary(p.session)}</span>
            </button>
            {!p.active ? (
              <button
                type="button"
                aria-label={`Delete ${p.name}`}
                className="px-1.5 py-1 text-muted hover:text-accent-red"
                onClick={() => {
                  if (typeof window === "undefined" || window.confirm(`Delete the portfolio ${p.name} and its session? This cannot be undone.`)) apply(deletePortfolio(store, p.id));
                }}
                data-testid={`portfolio-delete-${p.id}`}
              >
                ×
              </button>
            ) : null}
          </span>
        ))}
        <form
          className="flex items-center gap-1"
          onSubmit={(e) => {
            e.preventDefault();
            const r = createPortfolio(store, name);
            apply(r);
            if (r.ok) setName("");
          }}
        >
          <input className="px-2 py-1 rounded-md border border-line text-[12px] w-36" placeholder="New portfolio name" maxLength={NAME_MAX + 10} value={name} onChange={(e) => setName(e.target.value)} data-testid="portfolio-name" />
          <button type="submit" disabled={list.length >= MAX_PORTFOLIOS} className="px-2 py-1 rounded-md border border-line text-[12px] disabled:opacity-40" data-testid="portfolio-create">
            Add
          </button>
        </form>
      </div>
      <p className="text-[12px] text-muted">
        Up to {MAX_PORTFOLIOS} separate virtual accounts, for example one per strategy. Each keeps its own session, cash and journal; badges count all of them.
      </p>
      {error ? (
        <p className="text-[12px] text-accent-red" role="alert" data-testid="portfolio-error">
          {error}
        </p>
      ) : null}
    </section>
  );
}
