import { useState } from "react";
import { Link } from "react-router-dom";
import type { AnswerLetter } from "../../lib/academy/types";
import { PLACEMENT_ITEMS, routePlacement, skipPlacement, type PlacementResult } from "../../lib/academy/placement";
import { getLevel, getUnit } from "../../lib/academy/content/levels";
import { loadAcademy, saveAcademy, type KVStorage } from "../../lib/academy/storage";
import { cn } from "../../lib/utils";

interface Props {
  variant?: "hub" | "home";
  storage?: KVStorage;
  /** Test / screenshot preset. */
  initialPhase?: "intro" | "quiz" | "result";
  initialAnswers?: Record<string, AnswerLetter>;
  onPlaced?: (r: PlacementResult) => void;
}

/** BA3.M3: optional placement check (decision D2). Never blocks the existing first run; dismissible on Home. */
export default function PlacementCard({ variant = "hub", storage, initialPhase = "intro", initialAnswers = {}, onPlaced }: Props) {
  const saved = loadAcademy(storage).state;
  const [phase, setPhase] = useState(initialPhase);
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AnswerLetter>>(initialAnswers);
  const [result, setResult] = useState<PlacementResult | null>(initialPhase === "result" ? routePlacement(initialAnswers) : null);
  const [dismissed, setDismissed] = useState(!!saved.placementDismissed);

  if (variant === "home" && (dismissed || saved.placement)) return null;

  const finish = (r: PlacementResult) => {
    const s = loadAcademy(storage).state;
    saveAcademy({ ...s, placement: { startLevel: r.startLevel, correct: r.correct, total: r.total, skipped: r.skipped, at: new Date().toISOString() } }, storage);
    setResult(r);
    setPhase("result");
    onPlaced?.(r);
  };

  const q = PLACEMENT_ITEMS[i]!;
  return (
    <section className="panel p-4 space-y-3 text-sm" data-testid="placement-card" data-variant={variant}>
      <div className="flex items-baseline justify-between gap-2">
        <p className="font-semibold">{variant === "home" ? "New: Beginner Academy — where should you start?" : "Placement check"}</p>
        <span className="text-[11px] text-muted">optional · {PLACEMENT_ITEMS.length} questions · about 3 min</span>
      </div>

      {phase === "intro" ? (
        <>
          <p className="text-[13px] text-muted">
            Answer {PLACEMENT_ITEMS.length} quick questions and the Academy suggests a starting level. You can skip it and start from Orientation; nothing else in the app changes.
          </p>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setPhase("quiz")} className="px-3 py-1.5 rounded-md bg-primary text-white font-semibold text-[13px]" data-testid="placement-start">
              Take the placement check
            </button>
            <button type="button" onClick={() => finish(skipPlacement())} className="px-3 py-1.5 rounded-md border border-line text-[13px]" data-testid="placement-skip">
              I'm brand new — start at Orientation
            </button>
            {variant === "home" ? (
              <button
                type="button"
                onClick={() => {
                  const s = loadAcademy(storage).state;
                  saveAcademy({ ...s, placementDismissed: true }, storage);
                  setDismissed(true);
                }}
                className="px-3 py-1.5 rounded-md text-muted text-[13px] hover:text-ink"
                data-testid="placement-dismiss"
              >
                Not now
              </button>
            ) : null}
          </div>
        </>
      ) : phase === "quiz" ? (
        <div className="space-y-2" data-item={q.id}>
          <p className="text-[12px] text-muted">
            Question {i + 1} of {PLACEMENT_ITEMS.length}
          </p>
          <p className="font-medium">{q.prompt}</p>
          <div className="grid gap-1.5">
            {q.options.map((o) => (
              <button
                key={o.id}
                type="button"
                onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                className={cn("text-left px-3 py-2 rounded-md border text-[13px]", answers[q.id] === o.id ? "border-primary bg-primary/5" : "border-line hover:border-primary")}
                aria-pressed={answers[q.id] === o.id}
              >
                <span className="font-semibold mr-1.5">{o.id}</span>
                {o.label}
              </button>
            ))}
          </div>
          <div className="flex justify-between">
            <button type="button" disabled={i === 0} onClick={() => setI(i - 1)} className="px-3 py-1.5 rounded-md border border-line text-[13px] disabled:opacity-40">
              Back
            </button>
            {i < PLACEMENT_ITEMS.length - 1 ? (
              <button type="button" disabled={!answers[q.id]} onClick={() => setI(i + 1)} className="px-3 py-1.5 rounded-md bg-primary text-white text-[13px] font-semibold disabled:opacity-40">
                Next
              </button>
            ) : (
              <button type="button" disabled={!answers[q.id]} onClick={() => finish(routePlacement(answers))} className="px-3 py-1.5 rounded-md bg-primary text-white text-[13px] font-semibold disabled:opacity-40" data-testid="placement-finish">
                See my starting level
              </button>
            )}
          </div>
        </div>
      ) : result ? (
        <div className="space-y-2" data-testid="placement-result" data-start={result.startLevel}>
          <p className="font-semibold">
            {result.skipped ? "Starting at Orientation." : `${result.correct}/${result.total} correct · start at ${result.startLevel} ${getLevel(result.startLevel)?.title ?? ""}`}
          </p>
          {!result.skipped && result.startLevel !== "L0" ? (
            <p className="text-[13px] text-muted">Levels before {result.startLevel} are marked as placed. You can still open any of their units. Options (L6) and other markets (L7) need their own test-out.</p>
          ) : null}
          {result.review.length > 0 ? (
            <p className="text-[13px]">
              Worth a quick review:{" "}
              {result.review.map((u, k) => (
                <span key={u}>
                  {k > 0 ? ", " : ""}
                  <Link to={`/academy/${u}`} className="text-primary underline">
                    {getUnit(u)?.title ?? u}
                  </Link>
                </span>
              ))}
            </p>
          ) : null}
          <Link to="/academy" className="inline-block px-3 py-1.5 rounded-md bg-primary text-white text-[13px] font-semibold">
            Open the Academy
          </Link>
        </div>
      ) : null}
    </section>
  );
}
