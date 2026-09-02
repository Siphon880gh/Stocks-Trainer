import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  activePathMilestoneId,
  coachTipForActive,
  isGradedCasePackLocked,
  isPathComplete,
  listPathStatuses,
  type PathMilestoneDef,
} from "../lib/beginnerPath";
import { getPathTemplate } from "../lib/learningPaths";
import { getPathId, type MilestoneStatus } from "../lib/progressStore";
import type { QuizGroupId } from "../lib/quizData";

interface Props {
  selectedGroup: QuizGroupId;
  onSelectTrainingGroup: (groupId: QuizGroupId) => void;
  /** Bump after quiz/case writeback so statuses re-read from ProgressStore. */
  refreshKey?: number;
}

const STATUS_MARK: Record<MilestoneStatus, string> = {
  complete: "check_circle",
  available: "radio_button_checked",
  in_progress: "radio_button_checked",
  locked: "lock",
};

function nodeHref(m: PathMilestoneDef & { status: MilestoneStatus }): string | null {
  if (m.status === "locked") return null;
  if (m.isGradedCasePack && isGradedCasePackLocked(m.id)) return null;
  if (m.trainingGroup) return `/training?group=${m.trainingGroup}`;
  if (m.casesPack) return `/cases?pack=${m.casesPack}`;
  return null;
}

function isClickable(m: PathMilestoneDef & { status: MilestoneStatus }): boolean {
  if (m.status === "locked") return false;
  if (m.isGradedCasePack && isGradedCasePackLocked(m.id)) return false;
  return Boolean(m.trainingGroup || m.casesPack);
}

export default function PathMapPanel({
  selectedGroup,
  onSelectTrainingGroup,
  refreshKey = 0,
}: Props) {
  const items = useMemo(() => listPathStatuses(), [refreshKey]);
  const pathId = getPathId();
  const template = getPathTemplate(pathId);
  const activeId = activePathMilestoneId();
  const pathDone = isPathComplete();
  const coachTip = coachTipForActive();
  const completedCount = items.filter((m) => m.status === "complete").length;
  const active = items.find((m) => m.id === activeId) ?? items.find((m) => m.status === "available");

  const handleNodeActivate = (m: PathMilestoneDef & { status: MilestoneStatus }) => {
    if (!isClickable(m)) return;
    if (m.trainingGroup) onSelectTrainingGroup(m.trainingGroup);
  };

  return (
    <section className="w-full panel overflow-hidden">
      <header className="flex flex-wrap items-end justify-between gap-2 px-4 py-3 border-b border-line">
        <div className="space-y-0.5">
          <p className="text-[12px] text-muted">Path</p>
          <h2 className="text-sm font-semibold tracking-tight">
            {template?.title ?? "Learning Path"}
          </h2>
        </div>
        <p className="text-[13px] text-muted tabular-nums">
          {completedCount}/{items.length}
          {pathDone ? " complete" : ""}
        </p>
      </header>

      <ol className="flex items-start gap-0 overflow-x-auto no-scrollbar px-4 py-5 list-none m-0 md:justify-center">
        {items.map((m, i) => {
          const clickable = isClickable(m);
          const href = nodeHref(m);
          const isActive = m.id === activeId || (m.status === "available" && !activeId);
          const isSelectedQuiz = Boolean(m.trainingGroup && m.trainingGroup === selectedGroup);
          const prevComplete = i > 0 && items[i - 1].status === "complete";
          const gateLocked = m.isGradedCasePack && isGradedCasePackLocked(m.id);
          const shownStatus: MilestoneStatus = gateLocked ? "locked" : m.status;

          const nodeInner = (
            <>
              <span
                className={`material-symbols-outlined text-xl ${
                  shownStatus === "complete"
                    ? "text-up"
                    : isActive
                      ? "text-primary"
                      : shownStatus === "locked"
                        ? "text-muted/40"
                        : "text-muted"
                }`}
                aria-hidden
              >
                {STATUS_MARK[shownStatus]}
              </span>
              <span className="text-[10px] text-muted">{i + 1}</span>
              <span
                className={`text-[11px] font-semibold leading-tight ${
                  isActive ? "text-ink" : shownStatus === "locked" ? "text-muted" : "text-ink"
                }`}
              >
                {m.title}
              </span>
              <span className="text-[10px] text-muted">
                {shownStatus}
              </span>
            </>
          );

          const nodeClass = `flex flex-col items-center gap-1 min-w-[5.5rem] max-w-[6.5rem] text-center px-1 py-1 rounded-lg transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary ${
            isActive ? "bg-primary/10 ring-1 ring-primary/50" : ""
          } ${isSelectedQuiz && !isActive ? "bg-primary/5" : ""} ${
            clickable ? "hover:bg-primary/10 cursor-pointer" : "cursor-default opacity-70"
          }`;

          return (
            <li key={m.id} className="flex items-start shrink-0">
              {i > 0 ? (
                <div
                  className={`mt-[0.85rem] h-px w-6 sm:w-10 shrink-0 ${
                    prevComplete ? "bg-up" : "bg-line"
                  }`}
                  aria-hidden
                />
              ) : null}
              {href && m.casesPack && clickable ? (
                <Link
                  to={href}
                  className={nodeClass}
                  aria-current={isActive ? "step" : undefined}
                >
                  {nodeInner}
                </Link>
              ) : (
                <button
                  type="button"
                  className={nodeClass}
                  disabled={!clickable || Boolean(m.casesPack)}
                  aria-current={isActive ? "step" : undefined}
                  onClick={() => handleNodeActivate(m)}
                >
                  {nodeInner}
                </button>
              )}
            </li>
          );
        })}
      </ol>

      <div className="px-4 pb-4 space-y-2 text-sm border-t border-line pt-3">
        {pathDone ? (
          <p>
            Credential: {template?.title ?? "Path"} complete (SAMPLE progress, not attested).
          </p>
        ) : active ? (
          <>
            <p className="font-medium">
              Now · {active.title}
            </p>
            <p className="text-muted">{active.summary}</p>
            <p className="text-muted">Coach: {coachTip}</p>
            {active.trainingGroup ? (
              <button
                type="button"
                className="text-primary underline"
                onClick={() => onSelectTrainingGroup(active.trainingGroup!)}
              >
                Select {active.title} group
              </button>
            ) : null}
            {active.casesPack && !isGradedCasePackLocked(active.id) ? (
              <Link to={`/cases?pack=${active.casesPack}`} className="text-primary underline">
                Open {active.title}
              </Link>
            ) : null}
            {active.isGradedCasePack && isGradedCasePackLocked(active.id) ? (
              <p className="text-accent-red/90">LOCKED · finish Indicators first</p>
            ) : null}
          </>
        ) : (
              <p className="text-muted">Open the next available milestone when ready.</p>
        )}
      </div>
    </section>
  );
}
