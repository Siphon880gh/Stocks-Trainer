import { useState } from "react";
import {
  BEGINNER_EQUITIES_PATH,
  DECISION_MAKER_PATH,
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
    <section className="border border-primary/50 rounded-xl p-6 bg-neutral-dark/90 space-y-4 font-mono">
      <div>
        <h2 className="text-lg font-bold text-primary crt-glow tracking-tight">
          GOAL_INTAKE · Choose path
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Preview milestones, then confirm. Default: Beginner Equities.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {PATH_TEMPLATES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setSelectedId(t.id)}
            className={`px-4 py-2 rounded text-sm font-bold transition-colors ${
              selectedId === t.id
                ? "bg-primary text-background-dark"
                : "border border-primary/40 text-primary hover:bg-primary/10"
            }`}
          >
            {t.title}
          </button>
        ))}
      </div>

      <div className="border border-primary/20 rounded-lg p-4 space-y-2">
        <p className="text-sm text-slate-300">{selected.description}</p>
        <p className="text-[10px] text-primary/50 uppercase tracking-widest">
          Milestone preview
        </p>
        <ol className="space-y-1 text-xs text-primary/80">
          {selected.milestones.map((m, i) => (
            <li key={m.id}>
              {i + 1}. {m.id} · {m.title}
            </li>
          ))}
        </ol>
        {selected.id === DECISION_MAKER_PATH.id ? (
          <p className="text-[10px] text-yellow-400/80">
            Chart soft-gate (Indicators quiz) still required before graded cases.
          </p>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => {
          confirmPathSelection(selectedId);
          onConfirmed();
        }}
        className="w-full bg-primary text-background-dark font-bold py-3 rounded"
      >
        CONFIRM PATH · {selected.title.toUpperCase()}
      </button>
    </section>
  );
}
