import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  EX_BASIS_AFTER_CALL,
  EX_BREAKEVEN,
  EX_COLLATERAL,
  EX_CYCLE,
  EX_PUT_ANNUAL,
  EX_PUT_ANNUAL_COMPOUND,
  EX_PUT_YIELD,
  WHEEL_BENCHMARKS,
  WHEEL_BENCHMARK_NOTES,
  WHEEL_CAVEATS,
  WHEEL_CYCLE,
  WHEEL_DISCLAIMER,
  WHEEL_DRILLS,
  WHEEL_EXAMPLE,
  WHEEL_LINKS,
  WHEEL_PRACTICE,
  WHEEL_SCENARIOS,
  WHEEL_SCREENSHOT_LESSONS,
  WHEEL_VERDICT,
  usd,
} from "../../lib/wheelStrategy";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);
const pct = (v: number, d = 1) => `${v.toFixed(d)}%`;
const EX = WHEEL_EXAMPLE;

/** /practice/wheel-strategy: cash-secured put → assignment → covered call → called away, with the math, the risks and the evidence. */
export default function PracticeWheelStrategy() {
  const [picks, setPicks] = useState<Record<string, number>>({});
  const choose = (id: string, i: number) => {
    if (picks[id] !== undefined) return;
    const next = { ...picks, [id]: i };
    setPicks(next);
    if (WHEEL_DRILLS.every((d) => next[d.id] !== undefined)) markMiscPracticeDone("wheel-strategy");
  };
  const right = WHEEL_DRILLS.filter((d) => picks[d.id] === d.answer).length;
  const done = WHEEL_DRILLS.every((d) => picks[d.id] !== undefined);

  return (
    <PracticeShell
      title="The wheel strategy"
      blurb={`Sell a cash-secured put, take the shares if assigned, sell covered calls until they are called away, repeat. The math, the common choices, the evidence and the risks. ${WHEEL_DISCLAIMER}`}
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="wheel-verdict">
        <p className="font-semibold text-[14px]">{WHEEL_VERDICT.title}</p>
        <p className="font-medium">{WHEEL_VERDICT.answer}</p>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          {WHEEL_VERDICT.points.map((p) => <li key={p}>{p}</li>)}
        </ul>
        <p className="text-[11px] text-muted" data-testid="wheel-source">
          Started from Weng's notes on the wheel (general market opinions plus screenshots of the commercial wheelstrategyoptions.com screeners and Trade Tracker, which use sample data and sell paid tiers). The verdict, numbers and caveats here come from OIC, Schwab, Fidelity, FINRA, the IRS and Cboe; see the Playbook's "How well-tested is this?" panel. Glossary: {term("wheel-strategy", "wheel strategy")} · {term("cash-secured-put", "cash-secured put")} · {term("covered-call", "covered call")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="wheel-cycle">
        <p className="font-semibold text-[14px]">The cycle</p>
        <div className="flex flex-col md:flex-row md:items-stretch gap-2" role="list" aria-label="Wheel cycle">
          {WHEEL_CYCLE.map((s, i) => (
            <Fragment key={s.id}>
              <div role="listitem" className="panel p-3 flex-1 space-y-1" data-step={s.id}>
                <p className="font-medium text-[12px]">{s.title}</p>
                <p className="text-[12px]">{s.text}</p>
                <p className="text-[11px] text-muted">{s.ifNot}</p>
              </div>
              {i < WHEEL_CYCLE.length - 1 ? <span aria-hidden className="self-center text-muted">→</span> : null}
            </Fragment>
          ))}
        </div>
        <p className="text-[12px] text-muted">
          After step 4 the cash goes back to step 1. Glossary: {term("options-assignment", "assignment")} · {term("called-away", "called away")} · {term("early-assignment", "early assignment")} · {term("roll-option", "rolling")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="wheel-math">
        <p className="font-semibold text-[14px]">One turn, with the numbers (SAMPLE stock XYZ)</p>
        <div className="overflow-x-auto">
          <table className="text-[12px] w-full">
            <tbody>
              <tr data-row="put"><td className="pr-3 text-muted">Stock {EX.price}: sell the {EX.putStrike} put, {EX.putDays} days, delta {EX.putDelta}</td><td>Premium {EX.putPremium.toFixed(2)} ({usd(EX.putPremium * 100)})</td></tr>
              <tr data-row="collateral"><td className="pr-3 text-muted">Cash set aside (strike × 100)</td><td>{usd(EX_COLLATERAL)}</td></tr>
              <tr data-row="breakeven"><td className="pr-3 text-muted">Put breakeven (strike − premium)</td><td>{EX_BREAKEVEN}</td></tr>
              <tr data-row="yield"><td className="pr-3 text-muted">Premium ÷ collateral</td><td>{pct(EX_PUT_YIELD)} for {EX.putDays} days; "annualized" {pct(EX_PUT_ANNUAL)} simple, {pct(EX_PUT_ANNUAL_COMPOUND)} compounded</td></tr>
              <tr data-row="assigned"><td className="pr-3 text-muted">Expires at {EX.assignedAt}: assigned 100 shares at {EX.putStrike}</td><td>Basis {EX_BREAKEVEN}</td></tr>
              <tr data-row="call"><td className="pr-3 text-muted">Sell the {EX.callStrike} call, {EX.callDays} days</td><td>Premium {EX.callPremium.toFixed(2)}; basis now {EX_BASIS_AFTER_CALL}</td></tr>
              <tr data-row="called"><td className="pr-3 text-muted">Called away at {EX.callStrike}</td><td>{usd(EX_CYCLE.profit)} = {pct(EX_CYCLE.returnPct)} of the collateral in {EX.putDays + EX.callDays} days (the maximum)</td></tr>
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted">
          The annualized figures assume you repeat the same month all year without a loss. Glossary: {term("options-breakeven", "breakeven")} · {term("adjusted-cost-basis", "premium-adjusted basis")} · {term("annualized-premium-yield", "annualized premium yield")} · {term("option-premium", "premium")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="wheel-scenarios">
        <p className="font-semibold text-[14px]">Three paths: the wheel vs just buying 100 shares at {EX.price}</p>
        <div className="overflow-x-auto">
          <table className="text-[12px] w-full">
            <thead>
              <tr className="text-left text-muted"><th className="pr-3 font-medium">Path</th><th className="pr-3 font-medium">Wheel</th><th className="pr-3 font-medium">Shares</th><th className="font-medium">Why</th></tr>
            </thead>
            <tbody>
              {WHEEL_SCENARIOS.map((s) => (
                <tr key={s.id} data-scenario={s.id}>
                  <td className="pr-3">{s.title}</td>
                  <td className={cn("pr-3", s.wheel < 0 && "text-rose-500")}>{usd(s.wheel)}</td>
                  <td className={cn("pr-3", s.stock < 0 && "text-rose-500")}>{usd(s.stock)}</td>
                  <td>{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="text-[12px] text-muted">Capped upside on the way up, nearly the stock's loss on the way down: that is the trade the premium pays for.</p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="wheel-practice">
        <p className="font-semibold text-[14px]">Choosing the stock, strike and expiration (common practice, not rules)</p>
        {WHEEL_PRACTICE.map((p) => (
          <div key={p.id} data-practice={p.id}>
            <p className="font-medium">{p.choice}</p>
            <p className="text-[12px]">{p.common}</p>
            <p className="text-[12px] text-muted">Trade-off: {p.tradeoff}</p>
          </div>
        ))}
        <p className="text-[12px] text-muted">
          Glossary: {term("option-delta", "delta")} · {term("days-to-expiration", "DTE")} · {term("theta-decay", "time decay")} · {term("implied-volatility", "implied volatility")} · {term("iv-rank", "IV rank")} · {term("options-approval-level", "options approval")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="wheel-evidence">
        <p className="font-semibold text-[14px]">The long-run evidence: Cboe's put-write and buy-write indexes (June 1986 – Dec 2018)</p>
        <div className="overflow-x-auto">
          <table className="text-[12px] w-full">
            <thead>
              <tr className="text-left text-muted">
                <th className="pr-3 font-medium">Index</th><th className="pr-3 font-medium">Return / yr</th><th className="pr-3 font-medium">Volatility</th><th className="pr-3 font-medium">Worst drawdown</th><th className="pr-3 font-medium">Sharpe</th><th className="pr-3 font-medium">2008</th><th className="font-medium">2013</th>
              </tr>
            </thead>
            <tbody>
              {WHEEL_BENCHMARKS.map((b) => (
                <tr key={b.id} data-row={b.id}>
                  <td className="pr-3">{b.label}</td><td className="pr-3">{pct(b.annualReturn, 2)}</td><td className="pr-3">{pct(b.vol)}</td><td className="pr-3">{pct(b.maxDd)}</td><td className="pr-3">{b.sharpe}</td><td className="pr-3">{pct(b.y2008)}</td><td>{pct(b.y2013)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ul className="list-disc pl-5 text-[12px] space-y-1">
          {WHEEL_BENCHMARK_NOTES.map((n) => <li key={n}>{n}</li>)}
        </ul>
        <p className="text-[11px] text-muted">
          Source: Wilshire Analytics, "Options-Based Benchmark Indexes: Performance, Risk and Premium Capture (June 1986–Dec. 2018)", prepared for Cboe. Past index results are not predictive. Glossary: {term("put-write-index", "PUT")} · {term("buy-write-index", "BXM")} · {term("volatility-risk-premium", "volatility risk premium")} · {term("drawdown", "drawdown")}
        </p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="wheel-screenshots">
        <p className="font-semibold text-[14px]">What the screenshots in your notes showed</p>
        {WHEEL_SCREENSHOT_LESSONS.map((l) => (
          <div key={l.id} data-lesson={l.id}>
            <p className="text-[12px] text-muted">Seen: {l.seen}</p>
            <p className="text-[12px]">{l.lesson}</p>
          </div>
        ))}
        <p className="text-[11px] text-muted">Screens from wheelstrategyoptions.com (a commercial screener and tracker), shown with demo portfolios. Mentioned to explain the columns, not as a recommendation.</p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="wheel-drills">
        <p className="font-semibold text-[14px]">Your call: {WHEEL_DRILLS.length} drills</p>
        {WHEEL_DRILLS.map((d) => {
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
              {picked !== undefined ? (
                <p className="text-[12px]" data-drill-result>{picked === d.answer ? "Correct. " : "Not quite. "}{d.why}</p>
              ) : null}
            </div>
          );
        })}
        {done ? <p className="font-medium" data-testid="wheel-score">{right} / {WHEEL_DRILLS.length} correct</p> : null}
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="wheel-caveats">
        <p className="font-semibold text-[14px]">Risks to accept before you start</p>
        {WHEEL_CAVEATS.map((c) => (
          <div key={c.id} data-caveat={c.id}>
            <p className="font-medium">{c.title}</p>
            <p className="text-[12px]">{c.text}</p>
          </div>
        ))}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="wheel-links">
        <p className="font-semibold text-[14px]">Keep going</p>
        <ul className="list-disc pl-5 space-y-1">
          {WHEEL_LINKS.map((l) => (
            <li key={l.to}><Link to={l.to} className="text-primary underline">{l.label}</Link></li>
          ))}
        </ul>
      </section>
    </PracticeShell>
  );
}
