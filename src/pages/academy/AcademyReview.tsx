import { useState } from "react";
import { Link } from "react-router-dom";
import { getUnit } from "../../lib/academy/content/levels";
import { dueReviews, logReviewAnswer } from "../../lib/academy/retention";
import { recordActivity } from "../../lib/academy/rewards/streak";
import { loadAcademy, loadRewards, saveAcademy, saveRewards, type KVStorage } from "../../lib/academy/storage";
import type { AnswerLetter } from "../../lib/academy/types";
import { cn } from "../../lib/utils";
import { useAcademyChrome } from "../../lib/academy/retentionChrome";

/** /academy/review — missed check questions that are due (1, 3, then 7 days after a miss). Each answer counts as a review question. */
export default function AcademyReview({ storage, now = () => new Date() }: { storage?: KVStorage; now?: () => Date }) {
  useAcademyChrome(storage);
  const [state, setState] = useState(() => loadAcademy(storage).state);
  const [result, setResult] = useState<{ qid: string; picked: AnswerLetter; correct: boolean } | null>(null);
  const due = dueReviews(state, now());
  const cur = result ? due.find((d) => d.questionId === result.qid) ?? null : due[0] ?? null;
  const q = result ? (cur?.question ?? null) : (due[0]?.question ?? null);
  const answer = (id: AnswerLetter) => {
    if (!q || result) return;
    const correct = id === q.correctAnswer;
    setResult({ qid: q.id, picked: id, correct });
  };
  const next = () => {
    if (!result) return;
    const s = logReviewAnswer(loadAcademy(storage).state, result.qid, result.correct, "review", now());
    saveAcademy(s, storage);
    const rw = loadRewards(storage).state;
    saveRewards({ ...rw, streak: { ...rw.streak, days: recordActivity(rw.streak.days, now()) } }, storage, now());
    setState(s);
    setResult(null);
  };
  const shownQ = result ? (getQ(result.qid, state, now()) ?? q) : q;
  return (
    <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full space-y-4" data-testid="academy-review">
      <p className="text-[12px] text-muted">
        <Link to="/academy" className="hover:text-ink">
          Academy
        </Link>{" "}
        · Review
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Review missed questions</h1>
      <p className="text-[13px] text-muted">A question you missed comes back 1 day later, then 3, then 7. A miss starts it over. {due.length ? `${due.length} due now.` : ""}</p>
      {!shownQ ? (
        <p className="panel p-4" data-testid="review-empty">
          Nothing is due. Missed questions from unit checks and the Today card show up here when they are due.{" "}
          <Link to="/academy" className="text-primary underline">
            Back to the Academy
          </Link>
        </p>
      ) : (
        <section className="panel p-4 space-y-3" aria-live="polite">
          <p className="text-[12px] text-muted">{getUnit(shownQ.unitId)?.title}</p>
          <p className="font-semibold">{shownQ.prompt}</p>
          <ul className="space-y-2">
            {shownQ.options.map((o) => {
              const picked = result?.picked === o.id;
              const right = !!result && o.id === shownQ.correctAnswer;
              return (
                <li key={o.id}>
                  <button
                    type="button"
                    disabled={!!result}
                    onClick={() => answer(o.id)}
                    data-review-option={o.id}
                    className={cn("w-full rounded-lg border px-3 py-2 text-left text-[14px]", right ? "border-up bg-up/10" : picked ? "border-accent-red bg-accent-red/10" : "border-line hover:bg-primary/5")}
                  >
                    {o.id}. {o.label}
                  </button>
                </li>
              );
            })}
          </ul>
          {result ? (
            <div className="space-y-2" data-testid="review-result" data-correct={result.correct ? "true" : "false"}>
              <p className="font-semibold">{result.correct ? "Correct." : `Not quite. The answer is ${shownQ.correctAnswer}.`}</p>
              <p className="text-[13px] text-muted">{shownQ.explanation}</p>
              <button type="button" className="rounded bg-primary-fill px-4 py-2 font-semibold text-white" onClick={next} data-testid="review-next">
                {due.length > 1 ? "Next question" : "Done"}
              </button>
            </div>
          ) : null}
        </section>
      )}
    </main>
  );
}

function getQ(qid: string, state: Parameters<typeof dueReviews>[0], now: Date) {
  return dueReviews(state, now).find((d) => d.questionId === qid)?.question ?? null;
}
