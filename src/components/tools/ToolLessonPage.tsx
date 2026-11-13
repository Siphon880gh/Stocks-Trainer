import { Fragment, useCallback, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  lessonCompletion,
  loadLessonProgress,
  saveLessonProgress,
  simStepCount,
  toolTextPlain,
  withDrill,
  withNote,
  withTask,
  withWalk,
  emptyLessonProgress,
  type ToolLesson,
  type ToolLessonProgress,
} from "../../lib/toolTraining";
import type { ThemeDrill } from "../../lib/marketThemes/types";
import { cn } from "../../lib/utils";
import { MockScreen } from "./MockUi";
import { SimProvider, SimTrigger, ToolTextView } from "./Simulation";
import { FindItTasks } from "./FindItTasks";
import { WorkflowPanel } from "./WorkflowPanel";

/**
 * One tool-training lesson (/tools/<slug>): credit, simulated screens, walkthroughs, simulations, a guided workflow
 * (capstones), find-it-yourself tasks on the live tools, drills, scenarios, caveats, sources. Underlined phrases open
 * a simulation popover; `?sim=<id>` opens one on load (deep link and tests). Picks, task records, finished walks and
 * workflow fields are saved per lesson (`lib/toolTraining/progress.ts`); opening the page saves nothing.
 */
export default function ToolLessonPage({ lesson }: { lesson: ToolLesson }) {
  const [params] = useSearchParams();
  const sims = lesson.simulations ?? [];
  const [progress, setProgress] = useState<ToolLessonProgress>(() => loadLessonProgress(lesson.id));
  const update = useCallback(
    (f: (p: ToolLessonProgress) => ToolLessonProgress) =>
      setProgress((prev) => {
        const next = f(prev);
        if (next !== prev) saveLessonProgress(lesson.id, next);
        return next;
      }),
    [lesson.id],
  );
  const onWalkEnd = useCallback((id: string) => update((p) => withWalk(p, id)), [update]);
  const reset = () => {
    saveLessonProgress(lesson.id, null);
    setProgress(emptyLessonProgress());
  };
  const c = lessonCompletion(lesson, progress);
  return (
    <SimProvider sims={sims} initialOpen={params.get("sim")} onWalkEnd={onWalkEnd}>
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

        <section className="panel p-3 text-[12px] flex flex-wrap items-center gap-x-3 gap-y-1" data-testid="tool-progress" aria-label="Your progress in this lesson">
          <span className="font-medium" data-testid="tool-progress-count">{c.done} of {c.total} done</span>
          <span className="text-muted">
            Drills {c.parts.drills[0]}/{c.parts.drills[1]} · Scenarios {c.parts.scenarios[0]}/{c.parts.scenarios[1]} · Tasks {c.parts.tasks[0]}/{c.parts.tasks[1]} · Walks {c.parts.walks[0]}/{c.parts.walks[1]}
            {c.parts.workflow[1] ? ` · Workflow ${c.parts.workflow[0]}/1` : ""}
          </span>
          <span className="text-muted">Saved in this browser.</span>
          {c.done || Object.keys(progress.notes).length ? (
            <button type="button" onClick={reset} className="ml-auto px-2 py-0.5 rounded border text-[11px]" data-testid="tool-progress-reset">Reset this lesson</button>
          ) : null}
        </section>

        <section className="panel p-4 space-y-2 text-[13px]" data-testid="tool-intro">
          {lesson.intro.map((p) => <p key={toolTextPlain(p)}><ToolTextView text={p} /></p>)}
          {sims.length ? (
            <p className="text-[11px] text-muted" data-testid="sim-hint">
              <span className="font-medium text-sim underline decoration-dotted decoration-2 underline-offset-[3px]">Dotted purple phrases ▶</span> are not glossary terms. Each opens a short simulation: a SAMPLE tape or a table you step through, showing why a value from the tool matters for reading the stock.
            </p>
          ) : null}
          <p className="text-[11px] text-muted" data-testid="term-hint">
            <span className="underline decoration-dashed decoration-1 decoration-muted underline-offset-[3px]">Words with a thin dashed underline</span> are glossary terms: hover, focus or tap one for a short definition. On a simulated screen, the terms are also listed under it.
          </p>
          <p className="text-[11px] text-muted" data-testid="tool-credit">
            {lesson.credit.name} (<a href={lesson.credit.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{lesson.credit.url.replace(/^https:\/\//, "")}</a>): {lesson.credit.note}
          </p>
        </section>

        <section className="panel p-4 space-y-4 text-[13px]" data-testid="tool-screens">
          <div>
            <p className="font-semibold text-[14px]">What you will see</p>
            <p className="text-[11px] text-muted">Simulated layouts drawn in this app's style, checked against the real tool on {lesson.asOf}. Numbers in them are illustrative unless a caption says otherwise. Real sites change their layouts.</p>
          </div>
          {lesson.screens.map((s) => <Fragment key={s.id}><MockScreen screen={s} asOf={lesson.asOf} /></Fragment>)}
        </section>

        <section className="panel p-4 space-y-3 text-[13px]" data-testid="tool-walkthroughs">
          <p className="font-semibold text-[14px]">Step by step</p>
          {lesson.walkthroughs.map((w) => (
            <div key={w.title}>
              <p className="font-medium">{w.title}</p>
              <ol className="list-decimal pl-5 text-[12px] space-y-0.5">
                {w.steps.map((s) => <li key={toolTextPlain(s)}><ToolTextView text={s} /></li>)}
              </ol>
            </div>
          ))}
        </section>

        {sims.length ? (
          <section className="panel p-4 space-y-2 text-[13px]" data-testid="tool-simulations">
            <div>
              <p className="font-semibold text-[14px]">Simulations: why each check matters</p>
              <p className="text-[11px] text-muted">Step through a SAMPLE tape (or table) one bar at a time. Each step says what it shows and why we are looking. Simulated, not real prices, unless a step names a dated value. A walk counts as done when you reach its last step.</p>
            </div>
            <ul className="space-y-2">
              {sims.map((s) => (
                <li key={s.id} className="text-[12px]" data-sim-item={s.id}>
                  <SimTrigger simRef={{ sim: s.id, text: s.title }} />
                  <span className="text-muted"> · {simStepCount(s)} {s.kind === "bars" ? "bars" : "steps"}</span>
                  {progress.walks[s.id] ? <span className="text-emerald-600" data-walk-done={s.id}> · walked ✓</span> : null}
                  <span className="block text-muted">{s.goal}</span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {lesson.workflow ? <WorkflowPanel workflow={lesson.workflow} values={progress.notes} onChange={(k, v) => update((p) => withNote(p, k, v))} /> : null}

        <FindItTasks tasks={lesson.tasks} records={progress.tasks} onRecord={(id, r) => update((p) => withTask(p, id, r))} />

        <DrillSet testId="tool-drills" title={`Your call: ${lesson.drills.length} drills`} drills={lesson.drills} picks={progress.drills} onPick={(id, i) => update((p) => withDrill(p, id, i))} />

        {lesson.scenarios.length ? (
          <DrillSet
            testId="tool-scenarios"
            title={`Scenarios: ${lesson.scenarios.length} situations on the tool`}
            note="A short situation you could meet on the real site. Pick the next step; there is one best answer and a reason."
            drills={lesson.scenarios}
            picks={progress.drills}
            onPick={(id, i) => update((p) => withDrill(p, id, i))}
          />
        ) : null}

        <section className="panel p-4 space-y-3 text-[13px]" data-testid="tool-caveats">
          <p className="font-semibold text-[14px]">Before you rely on it</p>
          {lesson.caveats.map((cv) => (
            <div key={cv.title}>
              <p className="font-medium">{cv.title}</p>
              <p className="text-[12px]">{cv.text}</p>
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
    </SimProvider>
  );
}

function DrillSet({ testId, title, note, drills, picks, onPick }: { testId: string; title: string; note?: string; drills: ThemeDrill[]; picks: Record<string, number>; onPick: (id: string, i: number) => void }) {
  const right = drills.filter((d) => picks[d.id] === d.answer).length;
  const done = drills.every((d) => picks[d.id] !== undefined);
  return (
    <section className="panel p-4 space-y-3 text-[13px]" data-testid={testId}>
      <div>
        <p className="font-semibold text-[14px]">{title}</p>
        {note ? <p className="text-[11px] text-muted">{note}</p> : null}
      </div>
      {drills.map((d) => {
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
                  onClick={() => onPick(d.id, i)}
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
      {done ? <p className="font-medium" data-testid={testId === "tool-drills" ? "tool-score" : `${testId}-score`}>{right} / {drills.length} correct</p> : null}
    </section>
  );
}
