import { useMemo } from "react";
import { Link } from "react-router-dom";
import { buildMapModel, readSnapshot } from "../lib/progressMap";

/** Home card for the Progress Map (#23): overall share done and the next objective, one click away. */
export default function ProgressMapCard() {
  const model = useMemo(() => buildMapModel(readSnapshot()), []);
  const pct = Math.round((model.totals.done / model.totals.total) * 100);
  return (
    <section className="panel p-4 flex flex-wrap items-center gap-3" data-testid="home-map-card">
      <span className="material-symbols-outlined text-primary text-[26px]" aria-hidden>map</span>
      <div className="flex-1 min-w-[180px]">
        <p className="text-[15px] font-semibold">Your progress map</p>
        <p className="text-[12px] text-muted">
          {model.totals.done} of {model.totals.total} stages done ({pct}%)
          {model.next ? <> · Next: <span className="text-ink">{model.next.stage.title}</span></> : " · all done"}
        </p>
      </div>
      <Link to="/map" className="rounded-lg border border-primary text-primary px-3 py-1.5 text-[13px] font-semibold hover:bg-primary/10" data-testid="home-map-link">
        Open the map
      </Link>
    </section>
  );
}
