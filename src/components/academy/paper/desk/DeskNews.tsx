import { useState } from "react";
import type { DeskScenario } from "../../../../lib/academy/paper/desk/types";
import { visibleNews } from "../../../../lib/academy/paper/desk/scenarios";
import { cn } from "../../../../lib/utils";
import { dayLabel } from "./format";

const KIND: Record<string, string> = { earnings: "Earnings", filing: "Filing", company: "Company", market: "Market" };

/** News feed: only items published by the replay clock, newest first. Real items link their filing; invented ones say SIMULATED. */
export default function DeskNews({ scenario, bar, active }: { scenario: DeskScenario; bar: number; active: string }) {
  const [scope, setScope] = useState<"active" | "all">("all");
  const items = visibleNews(scenario, bar, scope === "active" ? active : undefined);
  return (
    <div className="space-y-2" data-testid="desk-news" data-count={items.length}>
      <div className="flex gap-1 text-[12px]" role="group" aria-label="News scope">
        {(["all", "active"] as const).map((k) => (
          <button key={k} type="button" onClick={() => setScope(k)} aria-pressed={scope === k} className={cn("px-2 py-0.5 rounded border", scope === k ? "border-sim bg-sim/10" : "border-line")}>
            {k === "all" ? "Watchlist" : active}
          </button>
        ))}
      </div>
      {items.length === 0 ? <p className="text-[12px] text-muted">No news yet.</p> : null}
      <ul className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
        {items.map((n) => (
          <li key={n.id} className="border-b border-line pb-2 text-[12px]" data-news-id={n.id}>
            <p className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
              <span className="tabular-nums">{n.at < 0 ? dayLabel(n.date ?? "") : dayLabel(scenario.labels[n.at]!)}</span>
              {n.symbol ? <span className="font-semibold text-ink">{n.symbol}</span> : null}
              <span className="px-1 rounded border border-line">{KIND[n.kind]}</span>
              {n.at === bar ? <span className="px-1 rounded bg-sim text-white font-semibold">New</span> : null}
              {n.simulated ? <span className="text-sim font-semibold">SIMULATED</span> : null}
            </p>
            <p className="font-semibold leading-snug mt-0.5">{n.headline}</p>
            <p className="text-muted leading-snug">{n.summary}</p>
            <p className="text-[11px] text-muted">
              {n.url ? (
                <a href={n.url} target="_blank" rel="noopener noreferrer" className="underline hover:text-ink">
                  {n.source}
                </a>
              ) : (
                n.source
              )}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
