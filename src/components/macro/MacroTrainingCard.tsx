import { Link } from "react-router-dom";
import { MACRO_QUESTION_BANKS, MACRO_QUIZ_GROUPS, type MacroQuizGroupId } from "../../lib/macro/quiz/banks";
import { MACRO_ROUNDS } from "../../lib/macro/game";
import { MACRO_LESSONS } from "../../lib/macro/lessons";
import { loadMacroProgress, progressSummary, type MacroProgress } from "../../lib/macro/macroProgress";

interface Props {
  /** Also select the group in the Learn page picker (the link opens that quiz). */
  onSelectGroup?: (id: MacroQuizGroupId) => void;
  /** Injected for tests; defaults to localStorage. */
  progress?: MacroProgress;
}

/** Learn page entry point for the macro-forces project (MF8.M1). */
export default function MacroTrainingCard({ onSelectGroup, progress }: Props) {
  const p = progress ?? loadMacroProgress();
  const s = progressSummary(p, MACRO_ROUNDS.map((r) => r.id));
  return (
    <div className="w-full max-w-xl panel p-4 text-sm space-y-3" data-testid="macro-training-card">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold">Macro Desk</p>
        <span className="text-[11px] text-muted">SIMULATED numbers · not trading advice</span>
      </div>
      <p className="text-[12px] text-muted">
        Visit the real release (BLS, BEA, FRED, the Fed, Freddie Mac…), read a look-alike with simulated numbers, then predict how yields, the dollar, stocks and sectors react.
      </p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Link to="/macro" className="text-primary underline font-medium" data-testid="macro-desk-link">
          Macro Desk ({MACRO_LESSONS.length} lessons)
        </Link>
        <Link to="/macro/play" className="text-primary underline">
          Reaction game
        </Link>
        <span className="text-[12px] text-muted self-center" data-testid="macro-progress">
          {s.completed}/{s.of} rounds played{s.total > 0 ? ` · ${s.correct}/${s.total} calls right` : ""}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {MACRO_QUIZ_GROUPS.map((g) => (
          <Link
            key={g.id}
            to={`/training?group=${g.id}&start=1`}
            onClick={() => onSelectGroup?.(g.id)}
            className="px-2.5 py-1.5 rounded-lg border border-line bg-primary/5 text-ink hover:bg-primary/10 text-[13px] inline-flex items-center gap-1.5"
            data-group={g.id}
          >
            <span className="material-symbols-outlined text-base">{g.icon}</span>
            {g.name}
            <span className="text-[10px] opacity-80">({MACRO_QUESTION_BANKS[g.id].length})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
