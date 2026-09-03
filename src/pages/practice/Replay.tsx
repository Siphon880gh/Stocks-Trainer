import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  REPLAY_START_BARS,
  REPLAY_TAPES,
  gradeReplay,
  type GradeResult,
  type ReplayAction,
} from "../../lib/practiceLabs";

export default function PracticeReplay() {
  const [tapeIndex, setTapeIndex] = useState(0);
  const [visible, setVisible] = useState(REPLAY_START_BARS);
  const [actions, setActions] = useState<ReplayAction[]>([]);
  const [revealed, setRevealed] = useState(false);
  const [result, setResult] = useState<GradeResult | null>(null);
  const tapeDef = REPLAY_TAPES[tapeIndex]!;
  const full = tapeDef.bars;
  const tape = revealed ? full : full.slice(0, visible);

  const resetTape = (next: number) => {
    setTapeIndex(next);
    setVisible(REPLAY_START_BARS);
    setActions([]);
    setRevealed(false);
    setResult(null);
  };

  const record = (action: ReplayAction) => {
    if (revealed) return;
    setActions((prev) => [...prev, action]);
    setVisible((n) => Math.min(full.length, n + 1));
  };

  return (
    <PracticeShell
      title="Bar replay"
      blurb="SAMPLE tape starts truncated. Wait or take a bias before the next bar. Grade is process, not whether the next close “proved” you."
    >
      <section className="panel p-4 space-y-3">
        <p className="text-[12px] text-muted">
          {tapeDef.name} · showing {tape.length} / {full.length} bars
        </p>
        <label className="text-[12px] text-muted">
          Tape
          <select
            className="ml-2 bg-surface border border-line text-ink text-sm px-2 py-1 rounded-md"
            value={tapeIndex}
            onChange={(e) => resetTape(Number(e.target.value))}
          >
            {REPLAY_TAPES.map((t, i) => (
              <option key={t.id} value={i}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
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
            disabled={revealed || visible >= full.length}
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
