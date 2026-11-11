import { Link } from "react-router-dom";
import type { AccountState } from "../../../../lib/academy/paper/types";
import type { DeskLog, DeskScenario } from "../../../../lib/academy/paper/desk/types";
import { DEFAULT_PROMPTS, type GoalResult } from "../../../../lib/academy/paper/desk/goals";
import type { DeskDividendCredit } from "../../../../lib/academy/paper/desk/session";
import { performance, roundTrips } from "../../../../lib/academy/paper/stats";
import { money } from "../../../../lib/academy/paper/describe";
import { glossaryHref, quizHref } from "../../../../lib/academy/refs";
import { LITERACY_TERMS } from "../../../../lib/literacyTerms";
import DeskGoals from "./DeskGoals";

const termName = (id: string) => LITERACY_TERMS.find((t) => t.id === id)?.name ?? id;

/** End-of-scenario debrief: what the news and filings signalled, a disciplined plan, your result, goals and journal prompts. */
export default function DeskDebrief({ scenario, log, state, goals, dividends, onNotes }: { scenario: DeskScenario; log: DeskLog; state: AccountState; goals: GoalResult[]; dividends: DeskDividendCredit[]; onNotes: (notes: Record<string, string>) => void }) {
  const perf = performance(state);
  const trips = roundTrips(state);
  const prompts = scenario.prompts ?? DEFAULT_PROMPTS;
  const div = dividends.reduce((a, d) => a + d.amount, 0);
  return (
    <section className="panel p-4 space-y-3 border-sim/50" aria-label="Debrief" data-testid="desk-debrief">
      <div className="flex flex-wrap items-baseline gap-2">
        <h2 className="font-semibold text-[15px]">Debrief: {scenario.title}</h2>
        <span className="text-[12px] text-muted">{scenario.kind === "historical" ? "HISTORICAL prices and filings, SIMULATED money" : "SIMULATED scenario"}</span>
      </div>
      <p className="text-[13px]">{scenario.lesson}</p>
      <div className="grid md:grid-cols-2 gap-3 text-[13px]">
        <div className="space-y-1" data-testid="debrief-signals">
          <p className="font-semibold">What the news and financials signalled</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {(scenario.debrief?.signals ?? []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
        <div className="space-y-1" data-testid="debrief-plan">
          <p className="font-semibold">What a disciplined trade looked like</p>
          <ul className="list-disc pl-5 space-y-0.5">
            {(scenario.debrief?.plan ?? []).map((s, i) => (
              <li key={i}>{s}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13px] tabular-nums" data-testid="debrief-result">
        <span>
          Result: <strong className={perf.total >= 0 ? "text-up" : "text-down"}>{money(perf.total)}</strong>
        </span>
        <span>Trades: {trips.length}</span>
        <span>Max drawdown: {(perf.maxDrawdown.pct * 100).toFixed(1)}%</span>
        {perf.averageR !== null ? <span>Average R: {perf.averageR.toFixed(2)}</span> : null}
        {dividends.length ? <span data-testid="debrief-dividends">Dividends received: {money(div)}</span> : null}
      </div>
      <DeskGoals results={goals} final testId="debrief-goals" />
      {scenario.terms?.length ? (
        <p className="text-[12px]">
          <span className="text-muted">Glossary: </span>
          {scenario.terms.map((t, i) => (
            <span key={t}>
              {i ? " · " : ""}
              <Link to={glossaryHref(t)} className="underline hover:text-sim">
                {termName(t)}
              </Link>
            </span>
          ))}
        </p>
      ) : null}
      <p className="text-[12px]">
        <Link to={quizHref("paper-desk")} className="underline hover:text-sim" data-testid="debrief-quiz">
          Check yourself: the Paper desk quiz
        </Link>
      </p>
      <div className="space-y-2" data-testid="debrief-journal">
        <p className="font-semibold text-[13px]">Journal</p>
        {prompts.map((p, i) => {
          const key = `debrief-${i}`;
          return (
            <label key={key} className="block text-[12px] space-y-1">
              <span>{p}</span>
              <textarea
                className="w-full border border-line rounded-md p-2 text-[13px] bg-transparent"
                rows={2}
                value={log.notes?.[key] ?? ""}
                onChange={(e) => onNotes({ ...(log.notes ?? {}), [key]: e.target.value })}
                data-testid={`debrief-note-${i}`}
              />
            </label>
          );
        })}
        <p className="text-[11px] text-muted">Notes are saved with this session on this device.</p>
      </div>
    </section>
  );
}
