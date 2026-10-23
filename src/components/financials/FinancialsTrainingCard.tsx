import { Link } from "react-router-dom";
import { FINANCIALS_QUESTION_BANKS, FINANCIALS_QUIZ_GROUPS, type FinancialsQuizGroupId } from "../../lib/financials/quizBanks";
import { PRINT_ROUNDS } from "../../lib/financials/readThePrint";
import { completedCount, loadPrintProgress, type ReadThePrintProgress } from "../../lib/financials/readThePrintProgress";

interface Props {
  /** Also select the group in the Learn page picker (the link opens that quiz). */
  onSelectGroup?: (id: FinancialsQuizGroupId) => void;
  /** Injected for tests; defaults to localStorage. */
  progress?: ReadThePrintProgress;
}

/** Learn page entry point for the financials & earnings project (FE7.M1). */
export default function FinancialsTrainingCard({ onSelectGroup, progress }: Props) {
  const p = progress ?? loadPrintProgress();
  const played = completedCount(p);
  return (
    <div className="w-full max-w-xl panel p-4 text-sm space-y-3" data-testid="financials-training-card">
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold">Financials &amp; earnings</p>
        <span className="text-[11px] text-muted">Fictional companies · not trading advice</span>
      </div>
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        <Link to="/practice/read-the-print" className="text-primary underline font-medium" data-testid="read-the-print-link">
          Read the Print
        </Link>
        <span className="text-[12px] text-muted self-center">
          {played}/{PRINT_ROUNDS.length} rounds played{p.bestSessionScore > 0 ? ` · best session ${p.bestSessionScore}` : ""}
        </span>
        <Link to="/practice/mark-the-band" className="text-primary underline">
          Mark the band
        </Link>
        <Link to="/practice/statements" className="text-primary underline">
          Statements lab
        </Link>
        <Link to="/practice/statements#forecast" className="text-primary underline">
          13-week cash forecast
        </Link>
      </div>
      <div className="flex flex-wrap gap-2">
        {FINANCIALS_QUIZ_GROUPS.map((g) => (
          <Link
            key={g.id}
            to={`/training?group=${g.id}&start=1`}
            onClick={() => onSelectGroup?.(g.id)}
            className="px-2.5 py-1.5 rounded-lg border border-line bg-primary/5 text-ink hover:bg-primary/10 text-[13px] inline-flex items-center gap-1.5"
            data-group={g.id}
          >
            <span className="material-symbols-outlined text-base">{g.icon}</span>
            {g.name}
            <span className="text-[10px] opacity-80">({FINANCIALS_QUESTION_BANKS[g.id].length})</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
