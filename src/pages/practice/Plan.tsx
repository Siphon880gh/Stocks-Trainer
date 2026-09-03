import { useState } from "react";
import CandlestickChart from "../../components/CandlestickChart";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  PLAN_TAPES,
  gradePlan,
  type GradeResult,
  type PlanMarks,
} from "../../lib/practiceLabs";

type Phase = keyof PlanMarks;

const ORDER: Phase[] = ["entry", "stop", "target"];

export default function PracticePlan() {
  const [tapeIndex, setTapeIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("entry");
  const [marks, setMarks] = useState<Partial<PlanMarks>>({});
  const [result, setResult] = useState<GradeResult | null>(null);
  const tape = PLAN_TAPES[tapeIndex]!;
  const last = tape.bars[tape.bars.length - 1]!;

  const markers = ORDER.filter((k) => marks[k] != null).map((k) => ({
    price: marks[k]!,
    label: k,
  }));

  return (
    <PracticeShell
      title="Mark the plan"
      blurb="Tap entry, then stop, then target on this SAMPLE tape. Grade is structure and R:R — not whether price would have worked."
    >
      <section className="panel p-4 space-y-3">
        <label className="text-[12px] text-muted">
          Tape
          <select
            className="ml-2 bg-surface border border-line text-ink text-sm px-2 py-1 rounded-md"
            value={tapeIndex}
            onChange={(e) => {
              setTapeIndex(Number(e.target.value));
              setMarks({});
              setPhase("entry");
              setResult(null);
            }}
          >
            {PLAN_TAPES.map((t, i) => (
              <option key={t.id} value={i}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <p className="text-sm">
          Tap <span className="font-semibold">{phase}</span>
        </p>
        <CandlestickChart
          data={tape.bars}
          height={280}
          showScaleControls={false}
          onSelectPrice={(price) => {
            setMarks((prev) => ({ ...prev, [phase]: price }));
            setResult(null);
            const i = ORDER.indexOf(phase);
            if (i < ORDER.length - 1) setPhase(ORDER[i + 1]!);
          }}
          markers={markers}
        />
        <div className="flex flex-wrap gap-2">
          {ORDER.map((k) => (
            <button
              key={k}
              type="button"
              className={`px-3 py-1.5 rounded-lg text-sm border ${
                phase === k ? "border-primary bg-primary/10" : "border-line hover:bg-canvas"
              }`}
              onClick={() => setPhase(k)}
            >
              {k}
              {marks[k] != null ? ` · ${marks[k]!.toFixed(0)}` : ""}
            </button>
          ))}
        </div>
        <button
          type="button"
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-primary-dim disabled:opacity-40"
          disabled={marks.entry == null || marks.stop == null || marks.target == null}
          onClick={() => {
            const graded = gradePlan(
              { entry: marks.entry!, stop: marks.stop!, target: marks.target! },
              last,
            );
            setResult(graded);
            markMiscPracticeDone("plan");
          }}
        >
          Grade plan
        </button>
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
            setMarks({});
            setPhase("entry");
            setResult(null);
          }}
        >
          Clear
        </button>
      </section>
    </PracticeShell>
  );
}
