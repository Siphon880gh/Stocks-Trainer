import { useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import JargonText, { GlossaryButtons } from "../../components/JargonText";
import { LITERACY_TERMS } from "../../lib/literacyTerms";
import { withoutSampleWord } from "../../lib/learnerCopy";
import { markMiscPracticeDone } from "../../lib/miscPractices";

export default function PracticeFlashcards() {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [completed, setCompleted] = useState(0);
  const term = LITERACY_TERMS[index]!;

  const advance = () => {
    const nextCompleted = completed + 1;
    setCompleted(nextCompleted);
    if (nextCompleted >= LITERACY_TERMS.length) {
      markMiscPracticeDone("flashcards");
    }
    setFlipped(false);
    setIndex((i) => (i + 1) % LITERACY_TERMS.length);
  };

  return (
    <PracticeShell
      title="Flashcards"
      blurb="Literacy terms from Reference. Teaching copy — not a live glossary of filings."
      sampleNote
    >
      <section className="panel p-6 space-y-4">
        <p className="text-[12px] text-muted">
          {index + 1} / {LITERACY_TERMS.length} · {term.category}
        </p>
        <button
          type="button"
          onClick={() => setFlipped((f) => !f)}
          className="w-full min-h-[160px] border border-line rounded-lg p-6 text-left hover:bg-canvas"
        >
          <p className="text-xl font-semibold">{withoutSampleWord(term.name)}</p>
          {flipped ? (
            <div className="mt-3 space-y-2 text-sm">
              <p>
                <JargonText text={withoutSampleWord(term.summary)} plain />
              </p>
              <p className="text-muted">
                <JargonText text={withoutSampleWord(term.detail)} plain />
              </p>
            </div>
          ) : (
            <p className="text-sm text-muted mt-3">Tap to flip</p>
          )}
        </button>
        {flipped ? <GlossaryButtons texts={[withoutSampleWord(term.summary), withoutSampleWord(term.detail)]} /> : null}
        <div className="flex gap-3">
          <button
            type="button"
            className="flex-1 border border-line py-2.5 rounded-lg font-medium hover:bg-canvas"
            onClick={advance}
          >
            Missed
          </button>
          <button
            type="button"
            className="flex-1 bg-primary text-white py-2.5 rounded-lg font-semibold hover:bg-primary-dim"
            onClick={advance}
          >
            Knew
          </button>
        </div>
        <Link to={`/archive?tab=literacy&open=${term.id}`} className="text-sm text-primary underline">
          Open in Reference
        </Link>
      </section>
    </PracticeShell>
  );
}
