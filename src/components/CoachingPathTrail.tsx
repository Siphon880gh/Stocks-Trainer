import type { PathTrailStep } from "../lib/coaching/pathTrail";

interface Props {
  steps: PathTrailStep[];
  expanded: boolean;
  onExpandedChange: (expanded: boolean) => void;
  showNodeIds: boolean;
  onShowNodeIdsChange: (show: boolean) => void;
}

const OUTCOME_MARK: Record<string, string> = {
  continue: "·",
  wrong: "!",
  success: "✓",
};

export default function CoachingPathTrail({
  steps,
  expanded,
  onExpandedChange,
  showNodeIds,
  onShowNodeIdsChange,
}: Props) {
  const panelId = "coaching-path-trail-panel";

  return (
    <section className="border border-primary/25 rounded-xl bg-neutral-dark/40 overflow-hidden">
      <div className="flex flex-wrap items-center gap-2 px-3 py-2 border-b border-primary/20">
        <button
          type="button"
          className="flex-1 min-w-[10rem] text-left font-mono text-[10px] tracking-widest text-primary flex items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
          aria-expanded={expanded}
          aria-controls={panelId}
          onClick={() => onExpandedChange(!expanded)}
        >
          <span className="material-symbols-outlined text-sm" aria-hidden>
            {expanded ? "expand_less" : "expand_more"}
          </span>
          PATH_TRAIL · {steps.length} STEP{steps.length === 1 ? "" : "S"}
        </button>
        <label className="inline-flex items-center gap-1.5 font-mono text-[10px] text-slate-500 cursor-pointer">
          <input
            type="checkbox"
            checked={showNodeIds}
            onChange={(e) => onShowNodeIdsChange(e.target.checked)}
            className="accent-primary"
          />
          DEBUG_NODE_ID
        </label>
      </div>

      {expanded ? (
        <ol id={panelId} className="p-3 space-y-3 list-none m-0">
          {steps.map((step) => (
            <li
              key={`${step.index}-${step.nodeId}`}
              className={`font-mono text-xs space-y-1 ${
                step.isCurrent ? "text-primary" : "text-slate-400"
              }`}
            >
              <p className="tracking-widest">
                <span aria-hidden>{OUTCOME_MARK[step.outcome] ?? "·"} </span>
                {step.index}.{" "}
                {step.isCurrent ? (
                  <span className="font-bold">NOW</span>
                ) : (
                  <span className="normal-case text-slate-300">{step.messagePreview}</span>
                )}
                {showNodeIds ? (
                  <span className="ml-2 text-slate-600">[{step.nodeId}]</span>
                ) : null}
              </p>
              {!step.isCurrent && step.choiceLabel ? (
                <p className="pl-4 normal-case text-slate-500">
                  You chose: {step.choiceLabel}
                </p>
              ) : null}
              {step.isCurrent ? (
                <p className="pl-4 normal-case text-slate-300">{step.messagePreview}</p>
              ) : null}
            </li>
          ))}
        </ol>
      ) : null}
    </section>
  );
}
