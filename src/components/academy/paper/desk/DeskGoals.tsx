import type { GoalResult } from "../../../../lib/academy/paper/desk/goals";
import { cn } from "../../../../lib/utils";

const MARK: Record<GoalResult["status"], string> = { met: "✓", missed: "✗", pending: "…" };

/** Scenario goals with a live status ("…" = not decided yet). */
export default function DeskGoals({ results, final, testId = "desk-goals" }: { results: GoalResult[]; final?: boolean; testId?: string }) {
  if (!results.length) return null;
  const met = results.filter((r) => r.status === "met").length;
  return (
    <section className="panel p-3 space-y-1.5 text-[12px]" aria-label="Scenario goals" data-testid={testId} data-tour={testId === "desk-goals" ? "desk-goals" : undefined} data-met={met}>
      <p className="font-semibold text-[13px]">
        Goals {final ? `· ${met} of ${results.length} met` : <span className="text-muted font-normal">· live</span>}
      </p>
      <ul className="space-y-1">
        {results.map((r, i) => (
          <li key={i} className="flex gap-2" data-goal-status={r.status} data-goal-kind={r.goal.kind}>
            <span aria-hidden className={cn("w-4 shrink-0 font-semibold", r.status === "met" ? "text-up" : r.status === "missed" ? "text-down" : "text-muted")}>
              {MARK[r.status]}
            </span>
            <span>
              {r.goal.text} <span className="text-muted">({r.status === "pending" ? "not decided yet" : r.status}: {r.detail})</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
