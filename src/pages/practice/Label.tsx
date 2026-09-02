import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  LABEL_CANDLE,
  LABEL_PROMPTS,
  candlePartAtPrice,
  gradeLabel,
  type GradeResult,
} from "../../lib/practiceLabs";

export default function PracticeLabel() {
  const [promptIndex, setPromptIndex] = useState(0);
  const [result, setResult] = useState<GradeResult | null>(null);
  const prompt = LABEL_PROMPTS[promptIndex]!;

  const onPrice = (price: number) => {
    const hit = candlePartAtPrice(LABEL_CANDLE, price);
    const graded = gradeLabel(prompt, hit);
    setResult(graded);
    markMiscPracticeDone("label");
  };

  return (
    <PracticeShell
      title="Label"
      blurb="Tap the SAMPLE candle part named below. Color is close vs open — not volume."
    >
      <section className="panel p-4 space-y-3">
        <p className="text-sm">
          Tap the <span className="font-semibold">{prompt.replace("-", " ")}</span>
        </p>
        <CandlestickChart
          data={[LABEL_CANDLE]}
          height={280}
          showScaleControls={false}
          onSelectPrice={onPrice}
        />
        {result ? (
          <p className="text-sm">
            <span className="font-semibold capitalize">{result.grade}</span>
            {" · "}
            {result.tip}
          </p>
        ) : null}
        <button
          type="button"
          className="border border-line px-4 py-2 rounded-lg text-sm font-medium hover:bg-canvas"
          onClick={() => {
            setResult(null);
            setPromptIndex((i) => (i + 1) % LABEL_PROMPTS.length);
          }}
        >
          Next part
        </button>
      </section>
    </PracticeShell>
  );
}
