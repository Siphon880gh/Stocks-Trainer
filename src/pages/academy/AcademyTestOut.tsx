import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import type { AnswerLetter, LevelId } from "../../lib/academy/types";
import { TEST_OUT_LEVELS, TEST_OUT_PASS, gradeTestOut, testOutItems, type TestOutResult } from "../../lib/academy/testOut";
import { getLevel, getUnit } from "../../lib/academy/content/levels";
import { loadAcademy, saveAcademy, type KVStorage } from "../../lib/academy/storage";
import { markTestedOut } from "../../lib/academy/progress";
import { awardTestOut } from "../../lib/academy/rewards/award";
import { cn } from "../../lib/utils";

/** /academy/test-out/:levelId — BA3.M2: 7 questions from the level's units; 85% marks the level tested out. */
export default function AcademyTestOut({ storage, preset }: { storage?: KVStorage; preset?: Record<string, AnswerLetter> }) {
  const { levelId = "" } = useParams();
  const valid = (TEST_OUT_LEVELS as string[]).includes(levelId);
  const [answers, setAnswers] = useState<Record<string, AnswerLetter>>(preset ?? {});
  const [result, setResult] = useState<TestOutResult | null>(preset ? gradeTestOut(levelId as LevelId, preset) : null);
  if (!valid) {
    return (
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full">
        <p className="panel p-4">
          There is no test-out for that level. <Link to="/academy" className="text-primary underline">Back to the Academy</Link>
        </p>
      </main>
    );
  }
  const lv = levelId as LevelId;
  const level = getLevel(lv)!;
  const items = testOutItems(lv);
  const already = loadAcademy(storage).state.testedOut[lv];
  return (
    <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full space-y-4" data-testid="test-out" data-level={lv}>
      <p className="text-[12px] text-muted">
        <Link to="/academy" className="hover:text-ink">
          Academy
        </Link>{" "}
        · Test out of {lv}
      </p>
      <h1 className="text-xl font-semibold tracking-tight">
        Test out of {lv}: {level.title}
      </h1>
      <p className="text-[13px] text-muted">
        {items.length} questions from this level's units. Score {Math.round(TEST_OUT_PASS * 100)}% or more to mark the level done and unlock what depends on it. It earns one
        test-out award, not unit mastery. {already ? "You already tested out of this level." : ""}
      </p>
      {items.map((q, qi) => (
        <div key={q.id} className="panel p-4 space-y-2" data-item={q.id}>
          <p className="font-medium text-[14px]">
            {qi + 1}. {q.prompt}
          </p>
          <div className="grid gap-1.5">
            {q.options.map((o) => {
              const picked = answers[q.id] === o.id;
              const right = !!result && o.id === q.correctAnswer;
              return (
                <button
                  key={o.id}
                  type="button"
                  disabled={!!result}
                  onClick={() => setAnswers({ ...answers, [q.id]: o.id })}
                  className={cn("text-left px-3 py-2 rounded-md border text-[13px]", right ? "border-up bg-up/10" : result && picked ? "border-accent-red bg-accent-red/10" : picked ? "border-primary bg-primary/5" : "border-line hover:border-primary")}
                  aria-pressed={picked}
                  {...(result ? { "data-correct": right ? "true" : "false" } : {})}
                >
                  <span className="font-semibold mr-1.5">{o.id}</span>
                  {o.label}
                </button>
              );
            })}
          </div>
          {result ? <p className="text-[13px]">{q.explanation}</p> : null}
        </div>
      ))}
      {!result ? (
        <button
          type="button"
          disabled={items.some((q) => !answers[q.id])}
          onClick={() => {
            const r = gradeTestOut(lv, answers);
            setResult(r);
            if (r.passed) {
              saveAcademy(markTestedOut(loadAcademy(storage).state, lv, r.correct, r.total), storage);
              awardTestOut(lv, storage);
            }
          }}
          className="px-4 py-2 rounded-md bg-primary text-white text-[13px] font-semibold disabled:opacity-40"
          data-testid="submit-test-out"
        >
          Check my answers
        </button>
      ) : (
        <div className={cn("panel p-4 space-y-1", result.passed ? "border-up" : "")} data-testid="test-out-result" data-passed={result.passed ? "true" : "false"}>
          <p className="font-semibold">
            {result.correct}/{result.total} correct · {result.passed ? `${lv} tested out` : `Not yet: ${Math.round(TEST_OUT_PASS * 100)}% needed`}
          </p>
          {result.weakest.length ? (
            <p className="text-[13px]">
              Weakest units:{" "}
              {result.weakest.map((u, k) => (
                <span key={u}>
                  {k ? ", " : ""}
                  <Link to={`/academy/${u}`} className="text-primary underline">
                    {getUnit(u)?.title ?? u}
                  </Link>
                </span>
              ))}
            </p>
          ) : null}
          <div className="flex flex-wrap items-center gap-3 mt-1">
            {!result.passed ? (
              <button
                type="button"
                onClick={() => {
                  setAnswers({});
                  setResult(null);
                  window.scrollTo({ top: 0 });
                }}
                className="px-3 py-1.5 rounded-md border border-line text-[13px]"
                data-testid="test-out-retry"
              >
                Try again
              </button>
            ) : null}
            <Link to="/academy" className="text-[13px] text-primary underline">
              Back to the Academy
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
