import { useState } from "react";
import { Link } from "react-router-dom";
import { categoryRecency, daysAgo, diary } from "../../lib/academy/retention";
import { loadAcademy, type KVStorage } from "../../lib/academy/storage";
import { useAcademyChrome } from "../../lib/academy/retentionChrome";

/** /academy/diary — every completed unit, newest first, grouped by day, with days ago and its level > course. */
export default function AcademyDiary({ storage, now = () => new Date() }: { storage?: KVStorage; now?: () => Date }) {
  useAcademyChrome(storage);
  const state = loadAcademy(storage).state;
  const t = now();
  const [filter, setFilter] = useState("");
  const rec = categoryRecency(state, t);
  const cats = Object.keys(rec).filter((k) => rec[k]!.done > 0).sort();
  const entries = diary(state).filter((e) => !filter || e.path.join(" > ").startsWith(filter));
  const groups: { day: string; items: typeof entries }[] = [];
  for (const e of entries) {
    const day = new Date(e.at).toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    const g = groups[groups.length - 1];
    if (g && g.day === day) g.items.push(e);
    else groups.push({ day, items: [e] });
  }
  return (
    <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full space-y-4" data-testid="academy-diary">
      <p className="text-[12px] text-muted">
        <Link to="/academy" className="hover:text-ink">
          Academy
        </Link>{" "}
        · Diary
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Diary</h1>
      <p className="text-[13px] text-muted">Every unit you have completed, newest first, with how many days ago and where it sits in the Academy.</p>
      {cats.length ? (
        <label className="flex flex-wrap items-center gap-2 text-[13px]">
          Filter by category
          <select value={filter} onChange={(e) => setFilter(e.target.value)} className="rounded border border-line bg-surface px-2 py-1" data-testid="diary-filter">
            <option value="">All categories</option>
            {cats.map((k) => (
              <option key={k} value={k}>
                {k} ({rec[k]!.label})
              </option>
            ))}
          </select>
        </label>
      ) : null}
      {groups.length === 0 ? (
        <p className="panel p-4" data-testid="diary-empty">
          Nothing completed yet. Pass a unit check (80% or more) and it shows up here.
        </p>
      ) : (
        groups.map((g) => (
          <section key={g.day} className="space-y-2">
            <h2 className="text-[14px] font-semibold">{g.day}</h2>
            <ul className="space-y-2">
              {g.items.map((e, i) => {
                const ago = daysAgo(e.at, t);
                return (
                  <li key={`${e.unitId}-${e.at}-${i}`} className="panel p-3" data-diary-unit={e.unitId}>
                    <div className="flex flex-wrap items-baseline gap-2">
                      <Link to={`/academy/${e.unitId}`} className="font-semibold hover:text-primary">
                        {e.title}
                      </Link>
                      <span className="rounded-full border border-line px-2 text-[11px] tabular-nums text-muted" title={new Date(e.at).toLocaleString()} data-days-ago={ago.days}>
                        {ago.label}
                      </span>
                      {e.source === "tested-out" ? <span className="text-[11px] text-muted">tested out</span> : e.score !== undefined ? <span className="text-[11px] text-muted">{Math.round(e.score * 100)}%</span> : null}
                    </div>
                    <p className="text-[12px] text-muted">{e.path.join(" > ")}</p>
                  </li>
                );
              })}
            </ul>
          </section>
        ))
      )}
    </main>
  );
}
