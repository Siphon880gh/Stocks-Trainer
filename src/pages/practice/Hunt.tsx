import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { HUNT_TAPES, gradeHunt, type GradeResult } from "../../lib/practiceLabs";

export default function PracticeHunt() {
  const [tapeIndex, setTapeIndex] = useState(0);
  const [mark, setMark] = useState<number | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const tape = HUNT_TAPES[tapeIndex]!;

  return (
    <PracticeShell
      title="Pattern hunt"
      blurb="Tap the bar you think is a textbook candle pattern, then submit. Scanner runs after you mark — not before."
    >
      <section className="panel p-4 space-y-3">
        <label className="text-[12px] text-muted">
          Tape
          <select
            className="ml-2 bg-surface border border-line text-ink text-sm px-2 py-1 rounded-md"
            value={tapeIndex}
            onChange={(e) => {
              setTapeIndex(Number(e.target.value));
              setMark(null);
              setResult(null);
            }}
          >
            {HUNT_TAPES.map((t, i) => (
              <option key={t.id} value={i}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm">
          {mark == null ? "Tap a bar" : `Selected bar ${mark + 1} (${tape.bars[mark]?.name})`}
        </p>
        <CandlestickChart
          data={tape.bars}
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
            setResult(gradeHunt(mark, tape.bars));
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
