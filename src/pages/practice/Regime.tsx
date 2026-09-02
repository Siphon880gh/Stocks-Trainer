import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  REGIME_WINDOWS,
  gradeOverlayFollowUp,
  gradeRegime,
  type GradeResult,
  type OverlayFollowUp,
  type RegimeId,
} from "../../lib/practiceLabs";

const REGIME_CHOICES: { id: RegimeId; label: string }[] = [
  { id: "trend-up", label: "Uptrend" },
  { id: "trend-down", label: "Downtrend" },
  { id: "range", label: "Range" },
];

const OVERLAY_CHOICES: { id: OverlayFollowUp; label: string }[] = [
  { id: "sma", label: "SMA" },
  { id: "rsi", label: "RSI" },
  { id: "bollinger", label: "Bollinger" },
];

export default function PracticeRegime() {
  const [windowIndex, setWindowIndex] = useState(0);
  const [step, setStep] = useState<"regime" | "overlay">("regime");
  const [result, setResult] = useState<GradeResult | null>(null);
  const window = REGIME_WINDOWS[windowIndex]!;

  return (
    <PracticeShell
      title="Trend vs range"
      blurb="Classify the SAMPLE window, then pick a tool that fits that regime. Teaching choice — not the only overlay."
    >
      <section className="panel p-4 space-y-3">
        <p className="text-[12px] text-muted">{window.name}</p>
        <CandlestickChart data={window.bars} height={240} showScaleControls={false} />
        {step === "regime" ? (
          <div className="flex flex-wrap gap-2">
            {REGIME_CHOICES.map((c) => (
              <button
                key={c.id}
                type="button"
                className="border border-line px-3 py-2 rounded-lg text-sm font-medium hover:bg-canvas"
                onClick={() => {
                  const graded = gradeRegime(window.id, c.id);
                  setResult(graded);
                  if (graded.grade === "correct") setStep("overlay");
                  markMiscPracticeDone("regime");
                }}
              >
                {c.label}
              </button>
            ))}
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-sm">Which overlay is a fair first tool here?</p>
            <div className="flex flex-wrap gap-2">
              {OVERLAY_CHOICES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  className="border border-line px-3 py-2 rounded-lg text-sm font-medium hover:bg-canvas"
                  onClick={() => {
                    setResult(gradeOverlayFollowUp(window.id, c.id));
                  }}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
            setStep("regime");
            setWindowIndex((i) => (i + 1) % REGIME_WINDOWS.length);
          }}
        >
          Next window
        </button>
      </section>
    </PracticeShell>
  );
}
