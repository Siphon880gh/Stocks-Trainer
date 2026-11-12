import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import type { ToolLesson } from "../../lib/toolTraining";
import { cn } from "../../lib/utils";
import { MockScreen } from "./MockUi";

/** One tool-training lesson (/tools/<slug>): credit, simulated screens, walkthroughs, drills, caveats, sources. */
export default function ToolLessonPage({ lesson }: { lesson: ToolLesson }) {
  const [picks, setPicks] = useState<Record<string, number>>({});
  const right = lesson.drills.filter((d) => picks[d.id] === d.answer).length;
  const done = lesson.drills.every((d) => picks[d.id] !== undefined);
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-4">
        <div>
          <p className="text-[12px] text-muted">
            <Link to="/training" className="hover:text-ink">Learn</Link>
            {" · "}
            <Link to="/tools" className="hover:text-ink">Tool Training</Link>
          </p>
          <h1 className="text-lg font-semibold tracking-tight">{lesson.title}</h1>
          <p className="text-[13px] text-muted">{lesson.blurb}</p>
        </div>

        <section className="panel p-4 space-y-2 text-[13px]" data-testid="tool-intro">
          {lesson.intro.map((p) => <p key={p}>{p}</p>)}
          <p className="text-[11px] text-muted" data-testid="tool-credit">
            {lesson.credit.name} (<a href={lesson.credit.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{lesson.credit.url.replace(/^https:\/\//, "")}</a>): {lesson.credit.note}
          </p>
        </section>

        <section className="panel p-4 space-y-4 text-[13px]" data-testid="tool-screens">
          <div>
            <p className="font-semibold text-[14px]">What you will see</p>
            <p className="text-[11px] text-muted">Simulated layouts drawn in this app's style, checked against the real tool on {lesson.asOf}. Numbers in them are illustrative unless a caption says otherwise. Real sites change their layouts.</p>
          </div>
          {lesson.screens.map((s) => <Fragment key={s.id}><MockScreen screen={s} /></Fragment>)}
        </section>

        <section className="panel p-4 space-y-3 text-[13px]" data-testid="tool-walkthroughs">
          <p className="font-semibold text-[14px]">Step by step</p>
          {lesson.walkthroughs.map((w) => (
            <div key={w.title}>
              <p className="font-medium">{w.title}</p>
              <ol className="list-decimal pl-5 text-[12px] space-y-0.5">
                {w.steps.map((s) => <li key={s}>{s}</li>)}
              </ol>
            </div>
          ))}
        </section>

        <section className="panel p-4 space-y-3 text-[13px]" data-testid="tool-drills">
          <p className="font-semibold text-[14px]">Your call: {lesson.drills.length} drills</p>
          {lesson.drills.map((d) => {
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
                      onClick={() => setPicks({ ...picks, [d.id]: i })}
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
          {done ? <p className="font-medium" data-testid="tool-score">{right} / {lesson.drills.length} correct</p> : null}
        </section>

        <section className="panel p-4 space-y-3 text-[13px]" data-testid="tool-caveats">
          <p className="font-semibold text-[14px]">Before you rely on it</p>
          {lesson.caveats.map((c) => (
            <div key={c.title}>
              <p className="font-medium">{c.title}</p>
              <p className="text-[12px]">{c.text}</p>
            </div>
          ))}
        </section>

        <section className="panel p-4 space-y-2 text-[13px]" data-testid="tool-sources">
          <p className="font-semibold text-[14px]">Sources (checked {lesson.asOf})</p>
          <ul className="list-disc pl-5 space-y-1 text-[12px]">
            {lesson.sources.map((s) => (
              <li key={s.url}>
                <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{s.label}</a>
                <span className="text-muted"> · {s.supports}</span>
              </li>
            ))}
          </ul>
          <p className="text-[11px] text-muted">Tools are credited for what they show, not endorsed. Educational, not advice.</p>
        </section>

        <section className="panel p-4 space-y-2 text-[13px]" data-testid="tool-links">
          <p className="font-semibold text-[14px]">Keep going</p>
          <ul className="list-disc pl-5 space-y-1">
            {lesson.links.map((l) => <li key={l.to}><Link to={l.to} className="text-primary underline">{l.label}</Link></li>)}
          </ul>
        </section>
      </main>
    </div>
  );
}
