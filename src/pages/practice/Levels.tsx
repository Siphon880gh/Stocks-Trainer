import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { PATTERN_OHLC, SAMPLE_OHLC } from "../../lib/ohlcData";
import { LEVEL_ROUNDS, gradeLevel, type GradeResult } from "../../lib/practiceLabs";

export default function PracticeLevels() {
  const [roundIndex, setRoundIndex] = useState(0);
  const [price, setPrice] = useState<number | null>(null);
  const [result, setResult] = useState<GradeResult | null>(null);
  const round = LEVEL_ROUNDS[roundIndex]!;
  const bars = PATTERN_OHLC[round.chartKey] ?? SAMPLE_OHLC;

  return (
    <PracticeShell
      title="Support and resistance"
      blurb="Tap the SAMPLE zone — matched highs/lows or the body a later candle closed into. Areas, not magic ticks."
    >
      <section className="panel p-4 space-y-3">
        <label className="text-[12px] text-muted">
          Round
          <select
            className="ml-2 bg-surface border border-line text-ink text-sm px-2 py-1 rounded-md"
            value={roundIndex}
            onChange={(e) => {
              setRoundIndex(Number(e.target.value));
              setPrice(null);
              setResult(null);
            }}
          >
            {LEVEL_ROUNDS.map((r, i) => (
              <option key={r.id} value={i}>
                {r.name}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm">{round.prompt}</p>
        <p className="text-sm">
          {price == null ? "Tap a price on the tape" : `Selected ${price.toFixed(0)}`}
        </p>
        <CandlestickChart
          data={bars}
          height={280}
          showScaleControls={false}
          highlightIndex={round.highlightIndex}
          onSelectPrice={(p) => {
            setPrice(p);
            setResult(null);
          }}
          markers={price == null ? undefined : [{ price, label: "zone" }]}
        />
        <button
          type="button"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dim disabled:opacity-40"
          disabled={price == null}
          onClick={() => {
            if (price == null) return;
            setResult(gradeLevel(round.id, price));
            markMiscPracticeDone("levels");
          }}
        >
          Submit price
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
