import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { getMarketTheme } from "../../lib/marketThemes";
import type { MarketThemeQuizGroupId } from "../../lib/marketThemes";
import { cn } from "../../lib/utils";

/** One market-theme lesson (/practice/<theme>): wrappers, drivers, bridges, math, a calculator, drills, caveats, sources. */
export default function MarketThemePage({ id }: { id: MarketThemeQuizGroupId }) {
  const theme = getMarketTheme(id)!;
  const [picks, setPicks] = useState<Record<string, number>>({});
  const [vals, setVals] = useState<Record<string, number>>(
    () => Object.fromEntries((theme.calculator?.inputs ?? []).map((i) => [i.id, i.value])),
  );
  const choose = (drillId: string, i: number) => {
    if (picks[drillId] !== undefined) return;
    const next = { ...picks, [drillId]: i };
    setPicks(next);
    if (theme.drills.every((d) => next[d.id] !== undefined)) markMiscPracticeDone(theme.id);
  };
  const right = theme.drills.filter((d) => picks[d.id] === d.answer).length;
  const done = theme.drills.every((d) => picks[d.id] !== undefined);

  return (
    <PracticeShell title={theme.title} blurb={theme.blurb}>
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="theme-intro">
        {theme.intro.map((p) => <p key={p}>{p}</p>)}
        <p className="text-[11px] text-muted" data-testid="theme-market-forces">Market Forces: {theme.marketForces}</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="theme-wrappers">
        <p className="font-semibold text-[14px]">Ways to own it</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse">
            <thead>
              <tr className="text-left text-muted border-b border-line">
                <th className="py-1 pr-2 font-medium">Wrapper</th>
                <th className="py-1 pr-2 font-medium">Examples</th>
                <th className="py-1 pr-2 font-medium">Owns</th>
                <th className="py-1 pr-2 font-medium">Tracks</th>
                <th className="py-1 font-medium">Watch</th>
              </tr>
            </thead>
            <tbody>
              {theme.wrappers.map((w) => (
                <tr key={w.name} className="border-b border-line align-top">
                  <td className="py-1.5 pr-2 font-medium">{w.name}</td>
                  <td className="py-1.5 pr-2">{w.examples}</td>
                  <td className="py-1.5 pr-2">{w.owns}</td>
                  <td className="py-1.5 pr-2">{w.tracks}</td>
                  <td className="py-1.5">{w.watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[11px] text-muted">Tickers are examples to research, not recommendations. Check current holdings and documents with the issuer.</p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="theme-drivers">
        <p className="font-semibold text-[14px]">What moves it</p>
        {theme.drivers.map((c) => (
          <div key={c.title}>
            <p className="font-medium">{c.title}</p>
            <p className="text-[12px]">{c.text}</p>
          </div>
        ))}
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="theme-bridges">
        <p className="font-semibold text-[14px]">From economic forces to this theme</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {theme.bridges.map((c) => (
            <div key={c.title} className="border border-line rounded p-2">
              <p className="font-medium text-[12px]">{c.title}</p>
              <p className="text-[12px]">{c.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="theme-math">
        <p className="font-semibold text-[14px]">{theme.math.title}</p>
        <table className="w-full text-[12px] border-collapse">
          <tbody>
            {theme.math.rows.map((r) => (
              <tr key={r.label} className="border-b border-line align-top">
                <td className="py-1 pr-2 font-medium">{r.label}</td>
                <td className="py-1 pr-2 text-muted">{r.formula}</td>
                <td className="py-1">{r.example}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="text-[11px] text-muted">{theme.math.note}</p>
      </section>

      {theme.calculator ? (
        <section className="panel p-4 space-y-2 text-[13px]" data-testid="theme-calculator">
          <p className="font-semibold text-[14px]">{theme.calculator.title}</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {theme.calculator.inputs.map((i) => (
              <label key={i.id} className="text-[12px] flex flex-col gap-1">
                {i.label}
                <input
                  type="number"
                  step={i.step}
                  value={vals[i.id] ?? 0}
                  onChange={(e) => setVals({ ...vals, [i.id]: Number(e.target.value) })}
                  className="border border-line rounded px-2 py-1 bg-white"
                />
              </label>
            ))}
          </div>
          <ul className="text-[12px] space-y-1" data-testid="theme-calculator-out">
            {theme.calculator.compute(vals).map((o) => (
              <li key={o.label}><span className="text-muted">{o.label}:</span> <span className="font-medium">{o.value}</span></li>
            ))}
          </ul>
          <p className="text-[11px] text-muted">{theme.calculator.note}</p>
        </section>
      ) : null}

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="theme-drills">
        <p className="font-semibold text-[14px]">Your call: {theme.drills.length} drills</p>
        {theme.drills.map((d) => {
          const picked = picks[d.id];
          return (
            <div key={d.id} className="panel p-3 space-y-2" data-drill={d.id}>
              <p className="font-medium text-[12px]">{d.prompt}</p>
              <div className="flex flex-col gap-1">
                {d.options.map((o, i) => (
                  <button
                    key={o}
                    type="button"
                    disabled={picked !== undefined}
                    onClick={() => choose(d.id, i)}
                    className={cn(
                      "text-left px-2 py-1.5 rounded border text-[12px]",
                      picked === i && i === d.answer && "bg-emerald-500/20 border-emerald-500",
                      picked === i && i !== d.answer && "bg-rose-500/20 border-rose-500",
                      picked !== undefined && i === d.answer && picked !== i && "border-emerald-500/50",
                    )}
                  >
                    {o}
                  </button>
                ))}
              </div>
              {picked !== undefined ? <p className="text-[12px]">{picked === d.answer ? "Correct. " : "Not quite. "}{d.why}</p> : null}
            </div>
          );
        })}
        {done ? <p className="font-medium" data-testid="theme-score">{right} / {theme.drills.length} correct</p> : null}
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="theme-caveats">
        <p className="font-semibold text-[14px]">Before you use it</p>
        {theme.caveats.map((c) => (
          <div key={c.title}>
            <p className="font-medium">{c.title}</p>
            <p className="text-[12px]">{c.text}</p>
          </div>
        ))}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="theme-sources">
        <p className="font-semibold text-[14px]">Sources (checked {theme.asOf})</p>
        <ul className="list-disc pl-5 space-y-1 text-[12px]">
          {theme.sources.map((s) => (
            <li key={s.url}>
              <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{s.label}</a>
              <span className="text-muted"> · {s.supports}</span>
            </li>
          ))}
        </ul>
        <p className="text-[11px] text-muted">Credited for what they explain, not as endorsements. Educational, not advice.</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="theme-links">
        <p className="font-semibold text-[14px]">Keep going</p>
        <ul className="list-disc pl-5 space-y-1">
          {theme.links.map((l) => (
            <li key={l.to}><Link to={l.to} className="text-primary underline">{l.label}</Link></li>
          ))}
        </ul>
      </section>
    </PracticeShell>
  );
}
