import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CandlestickChart from "../components/CandlestickChart";
import FinancialSnapshotCard from "../components/FinancialSnapshotCard";
import {
  CHART_GATE_PREREQ_TIP,
  CHART_GATE_TRAINING_GROUP,
  isChartGateComplete,
} from "../lib/beginnerPath";
import {
  CASE_PACKS,
  getCaseStudy,
  gradeCaseAction,
  type CaseAction,
  type CaseGrade,
} from "../lib/caseStudies";
import { recordCaseResult } from "../lib/progressStore";
import { coachTipForThinkingMode } from "../lib/thinkingModeTips";

const ACTIONS: { id: CaseAction; label: string }[] = [
  { id: "buy", label: "BUY" },
  { id: "sell", label: "SELL" },
  { id: "hold", label: "HOLD" },
  { id: "short", label: "SHORT" },
];

export default function CasePlayer() {
  const { caseId = "case-earn-beat-miss" } = useParams();
  const navigate = useNavigate();
  const study = useMemo(() => getCaseStudy(caseId), [caseId]);
  const gateOk = isChartGateComplete();

  const [selected, setSelected] = useState<CaseAction | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState<CaseGrade | null>(null);

  if (!study) {
    return (
      <div className="p-6 font-mono text-sm space-y-3">
        <p className="text-accent-red">CASE_NOT_FOUND: {caseId}</p>
        <Link to="/cases" className="text-primary underline">
          Back to cases
        </Link>
      </div>
    );
  }

  if (!gateOk) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4 font-mono text-sm">
        <p className="text-accent-red">{CHART_GATE_PREREQ_TIP}</p>
        <Link
          to={`/training?group=${CHART_GATE_TRAINING_GROUP}&start=1`}
          className="inline-block text-primary underline"
        >
          Complete Indicators quiz (E4.M0)
        </Link>
        <button
          type="button"
          className="block text-primary/60"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    );
  }

  const showShort = Boolean(study.allowShort);
  const chartData = submitted ? study.postOhlc : study.preOhlc;

  const onSubmit = () => {
    if (!selected || submitted) return;
    const g = gradeCaseAction(study, selected);
    setGrade(g);
    setSubmitted(true);
    const packMeta = CASE_PACKS.find((p) => p.id === study.packId);
    recordCaseResult({
      caseId: study.id,
      action: selected,
      grade: g,
      milestoneId: packMeta?.milestoneId,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background-dark text-slate-100">
      <header className="border-b border-primary/30 p-4 flex items-center justify-between">
        <Link to="/cases" className="flex items-center gap-2 text-primary hover:opacity-90">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-mono text-xs tracking-widest">CASES</span>
        </Link>
        <p className="font-mono text-[10px] text-primary/50 uppercase">
          {study.contextType} · {study.thinkingMode} · SAMPLE
        </p>
      </header>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-4">
        <div className="border-neon p-4 bg-neutral-dark/60 space-y-2">
          <h1 className="text-xl font-bold text-primary crt-glow">{study.title}</h1>
          <p className="text-sm text-slate-300">{study.brief}</p>
          <p className="font-mono text-[11px] text-primary/60">
            COACH · {study.thinkingMode}: {coachTipForThinkingMode(study.thinkingMode)}
          </p>
          {study.newsHeadline ? (
            <p className="font-mono text-xs text-primary/80">HEADLINE: {study.newsHeadline}</p>
          ) : null}
        </div>

        {study.statementSnapshot ? (
          <FinancialSnapshotCard snapshot={study.statementSnapshot} />
        ) : null}

        <div className="bg-background-dark border-2 border-primary/40 rounded-xl overflow-hidden">
          <div className="px-4 py-2 border-b border-primary/30 bg-neutral-dark/80 flex justify-between">
            <span className="text-[10px] font-mono text-primary/50 tracking-widest uppercase">
              {submitted ? "SAMPLE_Aftermath // Revealed" : "SAMPLE_Pre_Reaction // Decide first"}
            </span>
            {!submitted ? (
              <span className="text-[10px] font-mono text-primary/40">post tape hidden</span>
            ) : null}
          </div>
          <div className="p-4">
            <CandlestickChart data={chartData} height={280} />
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">
            Decision
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {ACTIONS.map((a) => {
              const lockedShort = a.id === "short" && !showShort;
              return (
                <button
                  key={a.id}
                  type="button"
                  disabled={submitted || lockedShort}
                  title={
                    lockedShort
                      ? "Short soft-gated until long/hold fluency (beginner path)"
                      : a.label
                  }
                  onClick={() => !submitted && !lockedShort && setSelected(a.id)}
                  className={`py-3 rounded font-bold font-mono text-sm border transition-colors ${
                    lockedShort
                      ? "opacity-40 border-primary/20 cursor-not-allowed"
                      : selected === a.id
                        ? "bg-primary text-background-dark border-primary"
                        : "border-primary/40 text-primary hover:bg-primary/10"
                  }`}
                >
                  {a.label}
                  {lockedShort ? " · LOCKED" : ""}
                </button>
              );
            })}
          </div>
          {!submitted ? (
            <button
              type="button"
              disabled={!selected}
              onClick={onSubmit}
              className="w-full bg-primary text-background-dark font-bold py-3 rounded disabled:opacity-40"
            >
              LOCK DECISION · REVEAL
            </button>
          ) : null}
        </div>

        {submitted && grade ? (
          <div className="border border-primary/30 rounded-xl p-4 font-mono text-sm space-y-2 bg-neutral-dark/80">
            <p
              className={
                grade === "correct"
                  ? "text-primary"
                  : grade === "partial"
                    ? "text-yellow-400"
                    : "text-accent-red"
              }
            >
              GRADE: {grade.toUpperCase()} · action={selected}
            </p>
            <p className="text-slate-300">
              <span className="text-primary/50">&gt; process </span>
              {study.debrief.process}
            </p>
            <p className="text-slate-300">
              <span className="text-primary/50">&gt; why_moved </span>
              {study.debrief.whyMarketMoved}
            </p>
            <p className="text-slate-300">
              <span className="text-primary/50">&gt; evidence </span>
              {study.debrief.evidence}
            </p>
            {grade === "partial" && study.partialOnHorizonMismatch ? (
              <p className="text-yellow-400/90 text-xs">
                Partial credit: horizon / process mismatch — direction may be
                defensible but sizing or time frame diverged from the model
                answer.
              </p>
            ) : null}
            <p className="text-[10px] text-primary/40">
              Decision locked (anti-hindsight). Refresh or reopen case to retry.
            </p>
            <Link to="/cases" className="inline-block text-primary underline text-xs">
              Back to case list
            </Link>
          </div>
        ) : null}
      </main>
    </div>
  );
}
