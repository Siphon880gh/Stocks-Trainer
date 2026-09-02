import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  REPLAY_START_BARS,
  REPLAY_TAPE,
  gradeReplay,
  type GradeResult,
  type ReplayAction,
} from "../../lib/practiceLabs";

export default function PracticeReplay() {
  const [visible, setVisible] = useState(REPLAY_START_BARS);
  const [actions, setActions] = useState<ReplayAction[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const tape = revealed ? REPLAY_TAPE : REPLAY_TAPE.slice(0, visible);

  const record = (action: ReplayAction) => {
    if (revealed) return;
    setActions((prev) => [...prev, action]);
    setVisible((n) => Math.min(REPLAY_TAPE.length, n + 1));
  };

  return (
    <PracticeShell
      title="Bar replay"
      blurb="SAMPLE tape starts truncated. Wait or take a bias before the next bar. Grade is process, not whether the next close “proved” you."
    >
      <section className="panel p-4 space-y-3">
        <p className="text-[12px] text-muted">
          Showing {tape.length} / {REPLAY_TAPE.length} bars
        </p>
        <CandlestickChart data={tape} height={260} showScaleControls={false} />
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="border border-line px-3 py-2 rounded-lg text-sm font-medium hover:bg-canvas disabled:opacity-40"
            disabled={revealed || visible <= 3}
            onClick={() => setVisible((n) => Math.max(3, n - 1))}
          >
            Back
          </button>
          <button
            type="button"
            className="border border-line px-3 py-2 rounded-lg text-sm font-medium hover:bg-canvas disabled:opacity-40"
            disabled={revealed || visible >= REPLAY_TAPE.length}
            onClick={() => record("wait")}
          >
            Wait
          </button>
          <button
            type="button"
            className="border border-line px-3 py-2 rounded-lg text-sm font-medium hover:bg-canvas disabled:opacity-40"
            disabled={revealed}
            onClick={() => record("bias-up")}
          >
            Bias up
          </button>
          <button
            type="button"
            className="border border-line px-3 py-2 rounded-lg text-sm font-medium hover:bg-canvas disabled:opacity-40"
            disabled={revealed}
            onClick={() => record("bias-down")}
          >
            Bias down
          </button>
          <button
            type="button"
            className="bg-primary text-white px-3 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dim disabled:opacity-40"
            disabled={revealed}
            onClick={() => {
              const graded = gradeReplay(actions);
              setResult(graded);
              setRevealed(true);
              markMiscPracticeDone("replay");
            }}
          >
            Reveal rest
          </button>
        </div>
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
            setVisible(REPLAY_START_BARS);
            setActions([]);
            setRevealed(false);
            setResult(null);
          }}
        >
          Restart
        </button>
      </section>
    </PracticeShell>
  );
}
