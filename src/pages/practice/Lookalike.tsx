import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { PATTERN_OHLC, SAMPLE_OHLC } from "../../lib/ohlcData";
import { LOOKALIKE_ROUNDS, gradeLookalike, type GradeResult } from "../../lib/practiceLabs";

export default function PracticeLookalike() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [pick, setPick] = useState<"A" | "B" | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const round = LOOKALIKE_ROUNDS[roundIndex]!;
  const aBars = PATTERN_OHLC[round.aKey] ?? SAMPLE_OHLC;
  const bBars = PATTERN_OHLC[round.bKey] ?? SAMPLE_OHLC;

  return (
    <PracticeShell
      title="Lookalikes"
      blurb="Two SAMPLE tapes. Pick which one matches the prompt. Context and cover-vs-nest matter more than a single wick."
    >
      <section className="panel p-4 space-y-3">
        <label className="text-[12px] text-muted">
          Round
          <select
            className="ml-2 bg-surface border border-line text-ink text-sm px-2 py-1 rounded-md"
            value={roundIndex}
            onChange={(e) => {
              setRoundIndex(Number(e.target.value));
              setPick(null);
              setResult(null);
            }}
          >
            {LOOKALIKE_ROUNDS.map((r, i) => (
              <option key={r.id} value={i}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm">{round.prompt}</p>
        <div className="grid gap-3 md:grid-cols-2">
          <button
            type="button"
            className={`text-left border rounded-lg p-2 ${
              pick === "A" ? "border-primary bg-primary/10" : "border-line hover:bg-canvas"
            }`}
            onClick={() => {
              setPick("A");
              setResult(null);
            }}
          >
            <p className="text-[12px] text-muted mb-1">Chart A · {round.aCaption}</p>
            <CandlestickChart data={aBars} height={200} compact showScaleControls={false} />
          </button>
          <button
            type="button"
            className={`text-left border rounded-lg p-2 ${
              pick === "B" ? "border-primary bg-primary/10" : "border-line hover:bg-canvas"
            }`}
            onClick={() => {
              setPick("B");
              setResult(null);
            }}
          >
            <p className="text-[12px] text-muted mb-1">Chart B · {round.bCaption}</p>
            <CandlestickChart data={bBars} height={200} compact showScaleControls={false} />
          </button>
        </div>
        <button
          type="button"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dim disabled:opacity-40"
          disabled={pick == null}
          onClick={() => {
            if (pick == null) return;
            setResult(gradeLookalike(round.id, pick));
            markMiscPracticeDone("lookalike");
          }}
        >
          Submit pick
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
