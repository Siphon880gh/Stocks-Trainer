import { Link } from "react-router-dom";
import { FAMILY_NAMES, MACRO_LESSONS, type LessonFamily } from "../../lib/macro/lessons";
import { MACRO_ROUNDS } from "../../lib/macro/game";
import { getMacroSource } from "../../lib/macro/sources";
import { loadMacroProgress, progressSummary } from "../../lib/macro/macroProgress";
import { MACRO_QUIZ_GROUP_IDS, MACRO_QUIZ_GROUP_META } from "../../lib/macro/quiz/groups";
import ReactionRulesTable from "../../components/macro/ReactionRulesTable";
import CurveExplorer from "../../components/macro/CurveExplorer";

/** /macro — Macro Desk hub: lessons by family, the game, and the Learn quiz groups. */
export default function MacroDesk() {
  const prog = progressSummary(loadMacroProgress(), MACRO_ROUNDS.map((r) => r.id));
  const families = Object.keys(FAMILY_NAMES) as LessonFamily[];
  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full space-y-6">
      <header className="space-y-2">
        <p className="text-[12px] text-muted">
          <Link to="/training" className="hover:text-ink">
            Learn
          </Link>{" "}
          · Macro Desk
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Macro Desk: how economic data moves markets</h1>
        <p className="text-[14px] text-muted max-w-3xl">
          Each lesson starts with a link to the real release page. Then you read a <strong>SIMULATED</strong> look-alike with fictional numbers, compare the result with
          what economists expected, and call how yields, the dollar, stocks and sectors react — before the chart reveals what happened in the simulation.
        </p>
        <p className="text-[12px] text-muted">Educational simulation. Fictional periods (SIM Y1–Y3) and numbers; not live data and not trading advice.</p>
      </header>

      <section className="panel p-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-60">
          <p className="font-semibold">Play the Macro Desk</p>
          <p className="text-[13px] text-muted">
            {MACRO_ROUNDS.length} rounds across six market regimes. {prog.completed > 0 ? `You have played ${prog.completed} of ${prog.of} (${prog.correct}/${prog.total} best calls).` : "Start with any round."}
          </p>
        </div>
        <Link to="/macro/play" className="bg-primary hover:bg-primary-dim text-white font-semibold px-5 py-2.5 rounded-lg inline-flex items-center gap-2">
          <span className="material-symbols-outlined" aria-hidden>
            play_arrow
          </span>
          Play all rounds
        </Link>
      </section>

      {families.map((f) => {
        const lessons = MACRO_LESSONS.filter((l) => l.family === f);
        return (
          <section key={f} className="space-y-2" aria-label={FAMILY_NAMES[f]}>
            <h2 className="text-[15px] font-semibold">{FAMILY_NAMES[f]}</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {lessons.map((l) => (
                <Link key={l.id} to={`/macro/${l.id}`} className="panel p-3 hover:border-primary block space-y-1" data-lesson={l.id}>
                  <p className="font-semibold text-[14px]">{l.title}</p>
                  <p className="text-[12px] text-muted">Real source: {getMacroSource(l.sourceId)?.agency}</p>
                  <p className="text-[12px] text-muted">
                    {l.roundIds.length} round{l.roundIds.length === 1 ? "" : "s"} · {l.glossaryIds.length} terms
                  </p>
                </Link>
              ))}
            </div>
          </section>
        );
      })}

      <section className="space-y-2" aria-label="Learn quiz groups">
        <h2 className="text-[15px] font-semibold">Quiz yourself in Learn</h2>
        <div className="flex flex-wrap gap-2">
          {MACRO_QUIZ_GROUP_IDS.map((g) => (
            <Link key={g} to={`/training?group=${g}&start=1`} className="border border-line rounded-lg px-3 py-1.5 text-[13px] hover:bg-surface">
              {MACRO_QUIZ_GROUP_META[g].label}
            </Link>
          ))}
        </div>
      </section>

      <CurveExplorer />

      <ReactionRulesTable />
    </main>
  );
}
