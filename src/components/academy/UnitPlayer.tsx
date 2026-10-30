import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { AnswerLetter, Unit } from "../../lib/academy/types";
import { quizForUnit } from "../../lib/academy/content/unitQuizzes";
import { resolveRef, glossaryHref } from "../../lib/academy/refs";
import { optionsForAttempt, scoreUnit, type UnitScore } from "../../lib/academy/mastery";
import { estMinutes } from "../../lib/academy/content/estimate";
import { getLiteracyTerm } from "../../lib/literacyTerms";
import { cn } from "../../lib/utils";

const LETTERS: AnswerLetter[] = ["A", "B", "C", "D", "E"];

interface Props {
  unit: Unit;
  /** Previous attempts (0 = first try): retries shuffle the option order deterministically. */
  attempt?: number;
  initialPhase?: "cards" | "quiz";
  initialCard?: number;
  /** Test / screenshot preset: answers already chosen and submitted. */
  preset?: { answers: Record<string, AnswerLetter>; submitted: boolean };
  onFinish?: (score: UnitScore) => void;
  onRetry?: () => void;
}

/** BA2.M2: card stepper → "practise it in the app" chips → unit quiz → mastery result. */
export default function UnitPlayer({ unit, attempt = 0, initialPhase = "cards", initialCard = 0, preset, onFinish, onRetry }: Props) {
  const items = useMemo(() => quizForUnit(unit.id), [unit.id]);
  const [phase, setPhase] = useState<"cards" | "quiz">(preset ? "quiz" : initialPhase);
  const [card, setCard] = useState(Math.min(initialCard, unit.cards.length - 1));
  const [answers, setAnswers] = useState<Record<string, AnswerLetter>>(preset?.answers ?? {});
  const [submitted, setSubmitted] = useState(preset?.submitted ?? false);
  const chips = unit.refs.map((r) => resolveRef(r)).filter((r) => r.ok);
  const score = submitted ? scoreUnit(items, answers) : null;
  const c = unit.cards[card]!;
  const term = c.glossaryTermId ? getLiteracyTerm(c.glossaryTermId) : undefined;

  return (
    <div className="space-y-4" data-testid="unit-player" data-unit={unit.id}>
      <header className="space-y-1">
        <p className="text-[12px] text-muted">
          {unit.levelId} · about {estMinutes(unit)} min · {unit.cards.length} cards + {items.length} questions
        </p>
        <h1 className="text-xl font-semibold tracking-tight">{unit.title}</h1>
        <p className="text-[13px] text-muted">Goal: {unit.objective}</p>
      </header>

      {phase === "cards" ? (
        <section className="panel p-4 space-y-3" aria-label="Lesson cards">
          <div className="flex items-center gap-1.5" aria-label="Card progress">
            {unit.cards.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Card ${i + 1}`}
                onClick={() => setCard(i)}
                className={cn("h-2 rounded-full transition-all", i === card ? "w-6 bg-primary" : "w-2 bg-line")}
              />
            ))}
            <span className="text-[11px] text-muted ml-2">
              {card + 1}/{unit.cards.length}
            </span>
          </div>
          <h2 className="font-semibold">{c.title}</h2>
          <p className="text-[14px] leading-relaxed">{c.body}</p>
          {term ? (
            <Link to={glossaryHref(term.id)} className="inline-flex items-center gap-1 text-[12px] px-2 py-1 rounded-md border border-line hover:border-primary" data-chip="glossary">
              <span className="material-symbols-outlined text-sm" aria-hidden>
                menu_book
              </span>
              {term.name}
            </Link>
          ) : null}
          <div className="flex justify-between pt-1">
            <button type="button" disabled={card === 0} onClick={() => setCard(card - 1)} className="px-3 py-1.5 rounded-md border border-line text-[13px] disabled:opacity-40">
              Previous
            </button>
            {card < unit.cards.length - 1 ? (
              <button type="button" onClick={() => setCard(card + 1)} className="px-3 py-1.5 rounded-md bg-primary text-white text-[13px] font-semibold">
                Next
              </button>
            ) : (
              <button type="button" onClick={() => setPhase("quiz")} className="px-3 py-1.5 rounded-md bg-primary text-white text-[13px] font-semibold" data-testid="start-quiz">
                Take the {items.length}-question check
              </button>
            )}
          </div>
          {card === 0 && unit.cards.length > 1 ? (
            <p className="text-right">
              <button type="button" onClick={() => setPhase("quiz")} className="text-[12px] text-primary hover:underline" data-testid="skip-to-check">
                Know this already? Take the check
              </button>
            </p>
          ) : null}
        </section>
      ) : (
        <section className="space-y-3" aria-label="Unit quiz">
          {items.map((q, qi) => {
            const opts = optionsForAttempt(q, attempt);
            const picked = answers[q.id];
            return (
              <div key={q.id} className="panel p-4 space-y-2" data-item={q.id}>
                <p className="font-medium text-[14px]">
                  {qi + 1}. {q.prompt}
                </p>
                <div className="grid gap-1.5">
                  {opts.map((o, oi) => {
                    const isPicked = picked === o.id;
                    const isRight = submitted && o.id === q.correctAnswer;
                    return (
                      <button
                        key={o.id}
                        type="button"
                        disabled={submitted}
                        onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                        className={cn(
                          "text-left px-3 py-2 rounded-md border text-[13px]",
                          isRight ? "border-up bg-up/10" : submitted && isPicked ? "border-accent-red bg-accent-red/10" : isPicked ? "border-primary bg-primary/5" : "border-line hover:border-primary",
                        )}
                        {...(submitted ? { "data-correct": isRight ? "true" : "false" } : {})}
                        aria-pressed={isPicked}
                      >
                        <span className="font-semibold mr-1.5">{LETTERS[oi]}</span>
                        {o.label}
                        {submitted && isPicked && !isRight && o.feedback ? <span className="block text-[12px] text-muted mt-0.5">{o.feedback}</span> : null}
                      </button>
                    );
                  })}
                </div>
                {submitted ? (
                  <p className="text-[13px]" data-testid="explanation">
                    <strong className={picked === q.correctAnswer ? "text-up" : "text-accent-red"}>{picked === q.correctAnswer ? "Right. " : "Not quite. "}</strong>
                    {q.explanation}
                    {q.glossaryTermId ? (
                      <>
                        {" "}
                        <Link to={glossaryHref(q.glossaryTermId)} className="text-primary underline">
                          Glossary
                        </Link>
                      </>
                    ) : null}
                  </p>
                ) : null}
              </div>
            );
          })}
          {!submitted ? (
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setPhase("cards")} className="px-3 py-1.5 rounded-md border border-line text-[13px]">
                Back to the cards
              </button>
              <button
                type="button"
                disabled={items.some((q) => !answers[q.id])}
                onClick={() => {
                  setSubmitted(true);
                  onFinish?.(scoreUnit(items, answers));
                }}
                className="px-4 py-2 rounded-md bg-primary text-white text-[13px] font-semibold disabled:opacity-40"
                data-testid="submit-quiz"
              >
                Check my answers
              </button>
            </div>
          ) : score ? (
            <div className={cn("panel p-4 space-y-1", score.mastered ? "border-up" : "")} data-testid="mastery-result" data-mastered={score.mastered ? "true" : "false"}>
              <p className="font-semibold">
                {score.correct}/{score.total} correct · {score.mastered ? "Unit mastered" : "Not mastered yet (80% needed)"}
              </p>
              <p className="text-[13px] text-muted">{score.mastered ? "Your best score is saved. Practise it in the app below." : "Re-read the explanations, then try again: your best score is kept."}</p>
              {onRetry ? (
                <button type="button" onClick={onRetry} className="mt-1 px-3 py-1.5 rounded-md border border-line text-[13px]" data-testid="retry-unit">
                  Retry with shuffled answers
                </button>
              ) : null}
            </div>
          ) : null}
        </section>
      )}

      <section className="space-y-1.5" aria-label="Practise it in the app">
        <p className="text-[12px] font-semibold text-muted uppercase tracking-wide">Practise it in the app</p>
        <div className="flex flex-wrap gap-2">
          {chips.map((r) => (
            <Link key={r.href} to={r.href} className="px-2.5 py-1.5 rounded-lg border border-line bg-primary/5 hover:bg-primary/10 text-[13px]" data-chip={r.kind}>
              {r.label}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
