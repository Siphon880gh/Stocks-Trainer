import { Link } from "react-router-dom";
import { ACADEMY_QUESTION_BANKS, ACADEMY_QUIZ_GROUPS, type AcademyQuizGroupId } from "../../lib/academy/quiz/banks";
import { academySummary } from "../../lib/academy/progress";
import { loadAcademy, type KVStorage } from "../../lib/academy/storage";

interface Props {
  /** Also select the group in the Learn page picker (the link opens that quiz). */
  onSelectGroup?: (id: AcademyQuizGroupId) => void;
  storage?: KVStorage;
}

/** BA10.M4: Learn page entry point for the Beginner Academy. */
export default function AcademyTrainingCard({ onSelectGroup, storage }: Props) {
  const s = academySummary(loadAcademy(storage).state);
  return (
    <div className="w-full max-w-xl panel p-4 text-sm space-y-3" data-testid="academy-training-card">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold">Beginner Academy</p>
        <span className="text-[11px] text-muted">Simulated money · not trading advice</span>
      </div>
      <p className="text-[12px] text-muted">Short units with a 3-question check, a paper-trading simulator with real order types, weekly challenges and an options knowledge ladder.</p>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Link to="/academy" className="text-primary underline font-medium" data-testid="academy-link">
          Academy ({s.unitsDone}/{s.units} units)
        </Link>
        <Link to="/paper" className="text-primary underline">
          Paper trading
        </Link>
        <Link to="/paper/challenges" className="text-primary underline">
          Challenges
        </Link>
        <Link to="/academy/options" className="text-primary underline">
          Options ladder
        </Link>
        <Link to="/coach/first-paper-trade" className="text-primary underline">
          Coach: first paper trade
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {ACADEMY_QUIZ_GROUPS.map((g) => (
          <Link
            key={g.id}
            to={`/training?group=${g.id}&start=1`}
            onClick={() => onSelectGroup?.(g.id)}
            className="px-2.5 py-1.5 rounded-lg border border-line bg-primary/5 text-ink hover:bg-primary/10 text-[13px] inline-flex items-center gap-1.5"
            data-group={g.id}
          >
            <span className="material-symbols-outlined text-base">{g.icon}</span>
            {g.name}
            <span className="text-[10px] opacity-80">({ACADEMY_QUESTION_BANKS[g.id].length})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
