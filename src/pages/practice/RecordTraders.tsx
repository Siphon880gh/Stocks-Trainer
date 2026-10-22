import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  CLAIM_DRILL, CONTRAST_BOX, GENERIC_BREAKOUT_HABITS, HAS_WEAKENED, JUDGE_CHECKLIST, METHOD_BOX, REPORTED_BOX, RT_BANNER,
  STILL_SHOWS_UP, TRADER_CARDS, VERDICT, type RtSrc,
} from "../../lib/recordTraders";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);
const SrcLinks = ({ list, label = "Sources" }: { list: RtSrc[]; label?: string }) => (
  <p className="text-[12px] text-muted">
    {label}:{" "}
    {list.map((x, i) => (
      <span key={x.url + i}>
        {i > 0 && " · "}
        <a className="underline" href={x.url} target="_blank" rel="noreferrer">{x.label}</a>
      </span>
    ))}
  </p>
);

/** /practice/record-traders: verified record-setting traders, a reported-only box, a does-it-still-work verdict and a track-record checklist. */
export default function PracticeRecordTraders() {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [answers, setAnswers] = useState<Record<string, "strong" | "weak">>({});
  const answered = Object.keys(answers).length;
  const right = CLAIM_DRILL.filter((c) => answers[c.id] === c.answer).length;

  const answer = (id: string, v: "strong" | "weak") => {
    setAnswers((a) => {
      const n = { ...a, [id]: v };
      if (Object.keys(n).length === CLAIM_DRILL.length) markMiscPracticeDone("record-traders");
      return n;
    });
  };

  return (
    <PracticeShell
      title="Record-setting traders"
      blurb="Who set the records, who verified them, how they traded, what conditions made it work, and whether it still works. Plus a checklist for judging any track record. Educational, not trading advice."
    >
      <section
        className="rounded-xl border-2 border-primary bg-primary/10 p-4 text-[15px] font-semibold leading-snug"
        data-testid="rt-banner"
        role="note"
      >
        {RT_BANNER}
      </section>

      <section className="space-y-3" aria-label="Verified records" data-testid="rt-cards">
        {TRADER_CARDS.map((c) => (
          <article key={c.id} className="panel p-4 space-y-2 text-[13px]" data-testid="rt-card" data-trader={c.id}>
            <div className="flex flex-wrap items-baseline justify-between gap-2">
              <h3 className="text-[15px] font-semibold">{c.name}</h3>
              <span
                className={`rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase ${c.strength === "strong" ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/15 text-amber-700 dark:text-amber-300"}`}
              >
                {c.strength} verification
              </span>
            </div>
            <p><strong>Feat:</strong> {c.feat} <span className="text-muted">({c.period})</span></p>
            <p data-testid="rt-verifier"><strong>Verified by:</strong> {c.verifiedBy}</p>
            <p className="text-muted"><strong>What was checked:</strong> {c.scope}</p>
            <p>
              <strong>Source:</strong>{" "}
              <a data-testid="rt-source" className="underline text-primary" href={c.source.url} target="_blank" rel="noreferrer">{c.source.label}</a>
              {c.moreSources?.map((s) => (
                <span key={s.url}> · <a className="underline" href={s.url} target="_blank" rel="noreferrer">{s.label}</a></span>
              ))}
            </p>
            <button
              type="button"
              className="panel px-3 py-1 text-[12px]"
              aria-expanded={!!open[c.id]}
              data-testid={`rt-more-${c.id}`}
              onClick={() => setOpen((o) => ({ ...o, [c.id]: !o[c.id] }))}
            >
              {open[c.id] ? "Hide" : "Show"} technique, conditions and drawdowns
            </button>
            {open[c.id] && (
              <dl className="grid gap-1.5" data-testid={`rt-detail-${c.id}`}>
                <div><dt className="font-semibold inline">Technique: </dt><dd className="inline">{c.technique}</dd></div>
                <div><dt className="font-semibold inline">Conditions that made it work: </dt><dd className="inline">{c.conditions}</dd></div>
                <div><dt className="font-semibold inline">Drawdowns and failures: </dt><dd className="inline">{c.drawdowns}</dd></div>
                <div><dt className="font-semibold inline">Does it still work? </dt><dd className="inline">{c.stillWorks}</dd></div>
              </dl>
            )}
          </article>
        ))}
      </section>

      <section className="rounded-xl border border-dashed border-amber-500 p-4 space-y-2 text-[13px]" data-testid="rt-reported">
        <h3 className="text-[15px] font-semibold">{REPORTED_BOX.title}</h3>
        {REPORTED_BOX.body.map((p) => <p key={p}>{p}</p>)}
        <p>See {term("compounded-annual-return", "compounded annual return")}.</p>
        <SrcLinks list={REPORTED_BOX.sources} />
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="rt-method">
        <h3 className="text-[15px] font-semibold">{METHOD_BOX.title}</h3>
        <p>{METHOD_BOX.body}</p>
        <p>See {term("can-slim", "CAN SLIM")} and {term("hypothetical-performance", "hypothetical performance")}.</p>
        <SrcLinks list={METHOD_BOX.sources} />
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="rt-contrast">
        <h3 className="text-[15px] font-semibold">{CONTRAST_BOX.title}</h3>
        <p>{CONTRAST_BOX.body}</p>
        <SrcLinks list={CONTRAST_BOX.sources} />
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="rt-generic">
        <h3 className="text-[15px] font-semibold">Common breakout habits (generic practice)</h3>
        <p className="text-muted">Widely taught, and not drawn from any trader on this page.</p>
        <ul className="list-disc pl-5 space-y-1">{GENERIC_BREAKOUT_HABITS.map((h) => <li key={h}>{h}</li>)}</ul>
        <p>More: <Link className="underline text-primary" to="/practice/technique-narratives">Technique narratives</Link></p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rt-verdict">
        <h3 className="text-[15px] font-semibold">Does it still work today?</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <h4 className="font-semibold text-emerald-700 dark:text-emerald-300">What still shows up</h4>
            <ul className="list-disc pl-5 space-y-2">
              {STILL_SHOWS_UP.map((e) => <li key={e.text}>{e.text}<SrcLinks list={e.sources} /></li>)}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-amber-700 dark:text-amber-300">What has weakened or changed</h4>
            <ul className="list-disc pl-5 space-y-2">
              {HAS_WEAKENED.map((e) => <li key={e.text}>{e.text}<SrcLinks list={e.sources} /></li>)}
            </ul>
          </div>
        </div>
        <p className="rounded-lg border border-primary/40 p-3 font-medium" data-testid="rt-verdict-text"><strong>Verdict:</strong> {VERDICT}</p>
        <p>Terms: {term("price-momentum", "price momentum")} · {term("post-publication-decay", "post-publication decay")} · {term("survivorship-bias", "survivorship bias")}</p>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="rt-checklist">
        <h3 className="text-[15px] font-semibold">How to judge any trader's track record</h3>
        <p className="text-muted">Tick each question you can answer for a claim you've seen. {Object.values(checked).filter(Boolean).length}/{JUDGE_CHECKLIST.length} answered.</p>
        <ol className="space-y-2">
          {JUDGE_CHECKLIST.map((c, i) => (
            <li key={c.id} className="flex gap-2">
              <input
                id={`rt-check-${c.id}`}
                type="checkbox"
                className="mt-1"
                checked={!!checked[c.id]}
                onChange={(e) => setChecked((s) => ({ ...s, [c.id]: e.target.checked }))}
              />
              <label htmlFor={`rt-check-${c.id}`} className="space-y-0.5">
                <span className="font-semibold">{i + 1}. {c.q}</span> <span>{c.why}</span>
                <SrcLinks list={c.sources} />
              </label>
            </li>
          ))}
        </ol>
        <p>Terms: {term("verified-track-record", "verified track record")} · {term("time-weighted-return", "time-weighted return")} · {term("drawdown", "drawdown")}</p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="rt-drill">
        <h3 className="text-[15px] font-semibold">Drill: strong or weak evidence?</h3>
        <p className="text-muted">SIMULATED claims. Decide whether each one's evidence is strong or weak.</p>
        {CLAIM_DRILL.map((c, i) => {
          const a = answers[c.id];
          return (
            <div key={c.id} className="rounded-lg border border-line p-3 space-y-2" data-testid={`rt-claim-${i}`}>
              <p>{c.claim}</p>
              <div className="flex gap-2">
                {(["strong", "weak"] as const).map((v) => (
                  <button
                    key={v}
                    type="button"
                    className={`panel px-3 py-1 text-[12px] ${a === v ? "ring-2 ring-primary" : ""}`}
                    aria-pressed={a === v}
                    disabled={!!a}
                    data-testid={`rt-claim-${i}-${v}`}
                    onClick={() => answer(c.id, v)}
                  >
                    {v === "strong" ? "Strong evidence" : "Weak evidence"}
                  </button>
                ))}
              </div>
              {a && (
                <p role="status" className={a === c.answer ? "text-emerald-700 dark:text-emerald-300" : "text-rose-700 dark:text-rose-300"}>
                  {a === c.answer ? "Right." : `Not quite: it's ${c.answer}.`} {c.why}
                </p>
              )}
            </div>
          );
        })}
        <p className="font-semibold" data-testid="rt-drill-score" aria-live="polite">{answered}/{CLAIM_DRILL.length} answered · {right} right</p>
      </section>

      <p className="text-[12px] text-muted">
        Quiz: <Link className="underline text-primary" to="/training?group=record-traders">Learn · Record-setting traders</Link>. Sources loaded 2026-10-22.
      </p>
    </PracticeShell>
  );
}
