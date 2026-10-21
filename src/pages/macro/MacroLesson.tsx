import { Fragment, useState, type ReactNode } from "react";
import CurveExplorer from "../../components/macro/CurveExplorer";
import { Link, useParams } from "react-router-dom";
import { FAMILY_NAMES, getLesson } from "../../lib/macro/lessons";
import { getMacroSource } from "../../lib/macro/sources";
import { getRelease } from "../../lib/macro/releases";
import { getRound } from "../../lib/macro/game";
import { getLiteracyTerm } from "../../lib/literacyTerms";
import { MACRO_QUIZ_GROUP_META } from "../../lib/macro/quiz/groups";
import { recordRound } from "../../lib/macro/macroProgress";
import LessonViewer from "../../components/macro/LessonViewer";
import ViewerForEvent from "../../components/macro/viewers/ViewerForEvent";
import ExpectationsPanel from "../../components/macro/ExpectationsPanel";
import FedPricingCard from "../../components/macro/FedPricingCard";
import MacroDeskRound from "../../components/macro/MacroDeskRound";

function Step({ n, title, children }: { n: number; title: string; children: ReactNode }) {
  return (
    <section className="space-y-2" aria-label={title}>
      <h2 className="text-[15px] font-semibold flex items-center gap-2">
        <span className="inline-flex w-6 h-6 rounded-full bg-primary text-white text-[12px] items-center justify-center">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/** /macro/:lessonId — real source → simulated look-alike → expectations → reaction rounds → quiz + glossary. */
export default function MacroLesson({ lessonIdOverride }: { lessonIdOverride?: string }) {
  const params = useParams();
  const lesson = getLesson(lessonIdOverride ?? params.lessonId ?? "");
  const viewerEvent = lesson?.viewer.type === "event" ? lesson.viewer.eventId : undefined;
  const [eventId, setEventId] = useState(viewerEvent && lesson?.eventIds.includes(viewerEvent) ? viewerEvent : lesson?.eventIds[0]);
  const [playing, setPlaying] = useState<string | null>(null);

  if (!lesson) {
    return (
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        <div className="panel p-6 space-y-2" data-not-found="true">
          <h1 className="text-lg font-semibold">Lesson not found</h1>
          <p className="text-sm text-muted">That macro lesson does not exist (yet).</p>
          <Link to="/macro" className="text-primary underline">
            Back to the Macro Desk
          </Link>
        </div>
      </main>
    );
  }
  const src = getMacroSource(lesson.sourceId)!;
  const ev = eventId ? getRelease(eventId) : undefined;
  const round = playing ? getRound(playing) : undefined;
  const picker =
    lesson.eventIds.length > 1 ? (
          <div className="flex flex-wrap gap-2">
            {lesson.eventIds.map((id) => (
              <button key={id} type="button" aria-pressed={id === eventId} onClick={() => setEventId(id)} className={`px-3 py-1 rounded-lg border text-[13px] ${id === eventId ? "bg-primary text-white border-primary" : "border-line"}`}>
                {getRelease(id)!.period}
              </button>
            ))}
          </div>
    ) : null;

  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full space-y-6">
      <header className="space-y-1">
        <p className="text-[12px] text-muted">
          <Link to="/training" className="hover:text-ink">
            Learn
          </Link>{" "}
          ·{" "}
          <Link to="/macro" className="hover:text-ink">
            Macro Desk
          </Link>{" "}
          · {FAMILY_NAMES[lesson.family]}
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">{lesson.title}</h1>
        <p className="text-[14px] text-muted max-w-3xl">{lesson.intro}</p>
      </header>

      <Step n={1} title="Visit the real source">
        <div className="panel p-4 space-y-2">
          <a href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary font-semibold underline inline-flex items-center gap-1">
            {src.agency} — {src.title}
            <span className="material-symbols-outlined text-[16px]" aria-hidden>
              open_in_new
            </span>
          </a>
          {src.releaseTimeET && <p className="text-[12px] text-muted">Usual release time: {src.releaseTimeET} ET.</p>}
          <p className="text-[13px]">Open it in a new tab and skim the layout. What to look at first:</p>
          <ul className="list-disc pl-5 text-[13px]">
            {lesson.lookFirst.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
          {lesson.alsoSee && lesson.alsoSee.length > 0 && (
            <p className="text-[12px] text-muted">
              Also useful:{" "}
              {lesson.alsoSee.map((id, i) => {
                const s = getMacroSource(id)!;
                return (
                  <Fragment key={id}>
                    {i > 0 && " · "}
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="underline">
                      {s.agency}: {s.title}
                    </a>
                  </Fragment>
                );
              })}
            </p>
          )}
        </div>
      </Step>

      <Step n={2} title="Read the simulated look-alike">
        {lesson.viewer.type === "event" && picker}
        {lesson.viewer.type === "event" && ev && ev.kind === getRelease(lesson.viewer.eventId)?.kind ? <ViewerForEvent event={ev} /> : <LessonViewer spec={lesson.viewer} />}
      </Step>

      <Step n={3} title="Expected vs actual">
        {lesson.viewer.type !== "event" && picker}
        {ev?.kind === "fomc" && <FedPricingCard month={ev.month} />}
        {ev && <ExpectationsPanel event={ev} revealed />}
      </Step>

      <Step n={4} title="Call the reaction">
        <p className="text-[13px] text-muted">{lesson.reaction}</p>
        {round ? (
          <Fragment key={round.id}>
            <MacroDeskRound round={round} onComplete={(c, t) => recordRound(round.id, c, t)} onNext={() => setPlaying(null)} />
          </Fragment>
        ) : (
          <div className="grid sm:grid-cols-2 gap-2">
            {lesson.roundIds.map((id) => {
              const r = getRound(id)!;
              return (
                <button key={id} type="button" onClick={() => setPlaying(id)} className="panel p-3 text-left hover:border-primary">
                  <p className="font-semibold text-[13px]">{r.focus}</p>
                  <p className="text-[12px] text-muted">{getRelease(r.eventId)!.period} · call {r.instruments.length} markets</p>
                </button>
              );
            })}
          </div>
        )}
      </Step>

      {lesson.id === "treasury-curve" && <CurveExplorer />}

      <Step n={5} title="Quiz and glossary">
        <div className="panel p-4 space-y-2">
          <Link to={`/training?group=${lesson.quizGroup}&start=1`} className="text-primary underline font-semibold">
            Learn quiz: {MACRO_QUIZ_GROUP_META[lesson.quizGroup].label}
          </Link>
          <div className="flex flex-wrap gap-2">
            {lesson.glossaryIds.map((id) => (
              <Link key={id} to={`/archive?tab=literacy&open=${id}`} className="text-[12px] border border-line rounded-full px-2.5 py-0.5 hover:bg-canvas">
                {getLiteracyTerm(id)?.name ?? id}
              </Link>
            ))}
          </div>
        </div>
      </Step>
    </main>
  );
}
