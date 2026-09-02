import { useState } from "react";
import {
  BEGINNER_EQUITIES_PATH,
  DECISION_MAKER_PATH,
  MARKET_EXPLORER_PATH,
  PATH_TEMPLATES,
  type LearningPathTemplate,
} from "../lib/learningPaths";
import { confirmPathSelection } from "../lib/progressStore";

interface GoalPickerProps {
  onConfirmed: () => void;
}

export default function GoalPicker({ onConfirmed }: GoalPickerProps) {
  const [selectedId, setSelectedId] = useState(BEGINNER_EQUITIES_PATH.id);
  const selected: LearningPathTemplate =
    PATH_TEMPLATES.find((p) => p.id === selectedId) ?? BEGINNER_EQUITIES_PATH;

  return (
    <section className="panel p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">Choose a path</h2>
        <p className="text-sm text-muted mt-1">
          Preview milestones, then confirm. Default: Beginner Equities.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PATH_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedId(t.id)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              selectedId === t.id
                ? "bg-primary text-white"
                : "border border-line text-ink hover:bg-canvas"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="border border-line rounded-lg p-4 space-y-2 bg-canvas">
        <p className="text-sm">{selected.description}</p>
        <p className="text-[12px] text-muted">Milestone preview</p>
        <ol className="space-y-1 text-sm">
          {selected.milestones.map((m, i) => (
            <li key={m.id}>
              {i + 1}. {m.title}
            </li>
          ))}
        </ol>
        {selected.id === DECISION_MAKER_PATH.id ? (
          <p className="text-[12px] text-muted">
            Indicators quiz still required before graded cases.
          </p>
        ) : null}
        {selected.id === MARKET_EXPLORER_PATH.id ? (
          <p className="text-[12px] text-muted">
            SAMPLE multi-market practice only. Traditional stocks stay on Beginner
            Equities / Decision Maker — Explorer does not replace stock literacy.
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => {
          confirmPathSelection(selectedId);
          onConfirmed();
        }}
        className="w-full bg-primary text-white font-semibold py-3 rounded-md hover:bg-primary-dim"
      >
        Confirm path · {selected.title}
      </button>
    </section>
  );
}
