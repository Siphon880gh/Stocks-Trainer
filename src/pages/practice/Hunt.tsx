import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { HUNT_TAPE, gradeHunt, type GradeResult } from "../../lib/practiceLabs";

export default function PracticeHunt() {
  const [mark, setMark] = useState<number | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);

  return (
    <PracticeShell
      title="Pattern hunt"
      blurb="Tap the bar you think is a textbook candle pattern, then submit. Scanner runs after you mark — not before."
    >
      <section className="panel p-4 space-y-3">
        <p className="text-sm">
          {mark == null ? "Tap a bar" : `Selected bar ${mark + 1} (${HUNT_TAPE[mark]?.name})`}
        </p>
        <CandlestickChart
          data={HUNT_TAPE}
          height={280}
          showScaleControls={false}
          highlightIndex={mark ?? undefined}
          onSelectBar={(i) => {
            setMark(i);
            setResult(null);
          }}
        />
        <button
          type="button"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dim disabled:opacity-40"
          disabled={mark == null}
          onClick={() => {
            if (mark == null) return;
            setResult(gradeHunt(mark, HUNT_TAPE));
            markMiscPracticeDone("hunt");
          }}
        >
          Submit mark
        </button>
        {result ? (
          <p className="text-sm">
            <span className="font-semibold capitalize">{result.grade}</span>
            {" · "}
            {result.tip}
          </p>
        ) : null}
      </section>
    </PracticeShell>
  );
}
