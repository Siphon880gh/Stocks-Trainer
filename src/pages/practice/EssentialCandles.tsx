import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { PATTERNS } from "../../lib/patterns";
import type { OHLC } from "../../lib/ohlcData";
import {
  CONTEXT_RULES, EC_QUESTIONS, ESSENTIALS, EVENING_STAR_DIAGRAM, EVENING_STAR_TAKEAWAY, IG16_SOURCE, MORNING_DOJI_DIAGRAM,
  MORNING_STAR_DIAGRAM, MORNING_STAR_TAKEAWAY, STAR_CASES, bodyMid, starCheck,
} from "../../lib/essentialCandles";
import { cn } from "../../lib/utils";

const NAME = Object.fromEntries(PATTERNS.map((p) => [p.id, p.name]));

/** Three app-drawn candles with labels and a dashed line at the first body's 50% midpoint. */
function StarDiagram({ bars, labels, title, testId }: { bars: OHLC[]; labels: string[]; title: string; testId: string }) {
  const hi = Math.max(...bars.map((c) => c.high));
  const lo = Math.min(...bars.map((c) => c.low));
  const H = 180, top = 14, plot = 140;
  const y = (v: number) => top + ((hi - v) / (hi - lo)) * plot;
  const mid = bodyMid(bars[0]);
  const xs = [70, 140, 210];
  return (
    <figure className="space-y-1" data-testid={testId}>
      <svg viewBox={`0 0 300 ${H}`} className="w-full max-w-sm" role="img" aria-label={`${title}: ${labels.join(", ")}; dashed line at the first body's midpoint ${mid}`}>
        <line x1="30" x2="290" y1={y(mid)} y2={y(mid)} stroke="currentColor" strokeDasharray="5 4" strokeWidth="1" opacity="0.7" />
        <text x="232" y={y(mid) - 4} fontSize="9" fill="currentColor">50% of body 1</text>
        {bars.map((c, i) => {
          const green = c.close >= c.open;
          const color = green ? "#059669" : "#dc2626";
          const bt = y(Math.max(c.open, c.close));
          const bh = Math.max(1.5, y(Math.min(c.open, c.close)) - bt);
          return (
            <g key={i}>
              <line x1={xs[i]} x2={xs[i]} y1={y(c.high)} y2={y(c.low)} stroke={color} strokeWidth="2" />
              <rect x={xs[i] - 12} y={bt} width="24" height={bh} fill={color} />
              <text x={xs[i]} y={H - 4} fontSize="10" textAnchor="middle" fill="currentColor">{i + 1}. {labels[i]}</text>
            </g>
          );
        })}
        <text x={xs[0] - 16} y={y(bars[0].open) + 3} fontSize="8" textAnchor="end" fill="currentColor">Open</text>
        <text x={xs[0] - 16} y={y(bars[0].close) + 3} fontSize="8" textAnchor="end" fill="currentColor">Close</text>
      </svg>
      <figcaption className="text-[11px] text-muted">SIMULATED · {title}</figcaption>
    </figure>
  );
}

/** /practice/essential-candles: the 16 patterns every trader should know, the star 50% rule and a valid-star drill. */
export default function PracticeEssentialCandles() {
  const [picks, setPicks] = useState<Record<string, "valid" | "not-yet">>({});
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const answered = Object.keys(picks).length;
  const right = STAR_CASES.filter((c) => picks[c.id] === (starCheck(c).valid ? "valid" : "not-yet")).length;
  const pick = (id: string, v: "valid" | "not-yet") =>
    setPicks((p) => {
      const n = { ...p, [id]: v };
      if (Object.keys(n).length === STAR_CASES.length) markMiscPracticeDone("essential-candles");
      return n;
    });

  return (
    <PracticeShell
      title="Essential candlestick patterns"
      blurb="The 16 candlestick patterns every trader should know, plus the inverted hammer and marubozu, each with its shape rule, what it means, the confirmation to wait for and where the stop goes, plus the morning and evening star 50% rule. Educational, not trading advice."
    >
      <section className="rounded-xl border-2 border-primary bg-primary/10 p-4 space-y-2" data-testid="ec-takeaway" role="note">
        <p className="text-[15px] font-semibold leading-snug">{MORNING_STAR_TAKEAWAY}</p>
        <p className="text-[13px]">{EVENING_STAR_TAKEAWAY}</p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="ec-stars">
        <p className="font-semibold text-[14px]">Morning star, in the right order</p>
        <div className="grid gap-4 sm:grid-cols-3">
          <StarDiagram testId="ec-diagram-morning" bars={MORNING_STAR_DIAGRAM} labels={["Long red", "Star", "Green past 50%"]} title="Morning star" />
          <StarDiagram testId="ec-diagram-doji" bars={MORNING_DOJI_DIAGRAM} labels={["Long red", "Doji star", "Green past 50%"]} title="Morning doji star" />
          <StarDiagram testId="ec-diagram-evening" bars={EVENING_STAR_DIAGRAM} labels={["Long green", "Star", "Red past 50%"]} title="Evening star (mirror)" />
        </div>
        <ol className="list-decimal pl-5 space-y-1">
          <li>Candle 1: a long bearish candle continuing the downtrend (body from Open at the top to Close at the bottom).</li>
          <li>Candle 2: the small-bodied star, gapping down from candle 1's body. If it is a doji, the pattern is a morning doji star, the stronger version.</li>
          <li>Candle 3: a bullish candle, classically gapping up from the star, that closes above the dashed 50% midpoint of candle 1's body.</li>
        </ol>
        <p>Context: it needs a downtrend to reverse. The gaps are classic on stocks and futures but rare in markets that trade around the clock, so in crypto read the body relationships and the midpoint rule instead (<Link className="underline text-primary" to="/practice/crypto-candles">crypto candles</Link>).</p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="ec-drill">
        <p className="font-semibold text-[14px]">Drill: valid star, or not yet?</p>
        <div className="grid gap-3 sm:grid-cols-2">
          {STAR_CASES.map((c, i) => {
            const chk = starCheck(c);
            const p = picks[c.id];
            const ok = p && (p === "valid") === chk.valid;
            return (
              <div key={c.id} className="rounded-lg border border-line p-3 space-y-2" data-testid={`ec-case-${i}`}>
                <p className="font-medium">{i + 1}. {c.kind === "morning" ? "Morning" : "Evening"} star candidate. {c.note}</p>
                <StarDiagram testId={`ec-case-chart-${i}`} bars={c.bars} labels={["", "", ""]} title={`candidate ${i + 1}`} />
                <p className="text-[12px] font-mono">Body 1: {c.bars[0].open} → {c.bars[0].close} · candle 3 close {c.bars[2].close}</p>
                <div className="flex gap-2">
                  {(["valid", "not-yet"] as const).map((v) => (
                    <button key={v} type="button" data-testid={`ec-case-${i}-${v}`} onClick={() => pick(c.id, v)}
                      className={cn("panel px-3 py-1 text-[12px]", p === v && (ok ? "ring-2 ring-emerald-500" : "ring-2 ring-rose-500"))}>
                      {v === "valid" ? "Valid star" : "Not valid yet"}
                    </button>
                  ))}
                </div>
                {p && <p className={cn("text-[12px]", ok ? "text-emerald-600" : "text-rose-600")} aria-live="polite">{ok ? "Right. " : "Not quite. "}{chk.reason}</p>}
              </div>
            );
          })}
        </div>
        <p className="text-[12px]" data-testid="ec-drill-score">{answered}/{STAR_CASES.length} answered · {right} right</p>
      </section>

      <section className="space-y-2" aria-label="The 16 patterns" data-testid="ec-list">
        <p className="font-semibold text-[14px]">The essentials</p>
        {([1, 2, 3] as const).map((n) => (
          <div key={n} className="space-y-2">
            <p className="text-[12px] uppercase tracking-wide text-muted">{n === 1 ? "Single-candle" : n === 2 ? "Two-candle" : "Three-candle"} patterns</p>
            {ESSENTIALS.filter((e) => e.candles === n).map((e) => (
              <article key={e.id} className="panel p-3 space-y-1 text-[13px]" data-testid="ec-card" data-id={e.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="font-semibold">{e.name}</h3>
                  <span className={cn("text-[11px] rounded-full px-2 py-0.5", e.bias === "bullish" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : e.bias === "bearish" ? "bg-rose-500/15 text-rose-700 dark:text-rose-300" : "bg-slate-500/15")}>{e.bias === "neutral" ? "indecision / either way" : e.bias}</span>
                </div>
                <p><strong>Shape:</strong> {e.rule}</p>
                <p><strong>Means:</strong> {e.meaning}</p>
                <p><strong>Confirm:</strong> {e.confirm}</p>
                <p><strong>Stop:</strong> {e.stop}</p>
                <p className="text-[12px]">
                  <Link className="underline text-primary" to={`/archive?open=${e.id}`}>Lesson in the Archive</Link>
                  {e.variants?.map((v) => <span key={v}> · <Link className="underline" to={`/archive?open=${v}`}>{NAME[v] ?? v}</Link></span>)}
                </p>
              </article>
            ))}
          </div>
        ))}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="ec-context">
        <p className="font-semibold text-[14px]">Context decides whether a pattern matters</p>
        <ul className="list-disc pl-5 space-y-1">{CONTEXT_RULES.map((r) => <li key={r}>{r}</li>)}</ul>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="ec-quiz">
        <p className="font-semibold text-[14px]">Quick check</p>
        {EC_QUESTIONS.slice(0, 3).map((q) => {
          const a = answers[q.id];
          return (
            <div key={q.id} className="space-y-1">
              <p>{q.prompt}</p>
              <div className="grid gap-1 sm:grid-cols-2">
                {q.options.map((o) => (
                  <button key={o.id} type="button" data-opt={o.id} onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                    className={cn("panel px-2 py-1 text-left text-[12px]", a === o.id && (o.id === q.correctAnswer ? "ring-2 ring-emerald-500" : "ring-2 ring-rose-500"))}>{o.label}</button>
                ))}
              </div>
              {a && <p className={cn("text-[12px]", a === q.correctAnswer ? "text-emerald-600" : "text-rose-600")}>{a === q.correctAnswer ? "Correct. " : "Not quite. "}{q.explanation}</p>}
            </div>
          );
        })}
        <p className="text-[12px]">All {EC_QUESTIONS.length} questions: <Link className="underline text-primary" to="/training?group=essential-candles">Learn · Essential Candles</Link> · drill every pattern: <Link className="underline text-primary" to="/training?group=buy-or-sell">Buy or Sell?</Link></p>
        <p className="text-[12px] text-muted">Source: <a className="underline" href={IG16_SOURCE.url} target="_blank" rel="noreferrer">{IG16_SOURCE.label}</a></p>
      </section>
    </PracticeShell>
  );
}
