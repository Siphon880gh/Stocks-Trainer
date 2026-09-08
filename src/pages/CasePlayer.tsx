import { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import CandlestickChart from "../components/CandlestickChart";
import FinancialSnapshotCard from "../components/FinancialSnapshotCard";
import {
  canBrowseAssetClass,
  CHART_GATE_TRAINING_GROUP,
  isChartGateCleared,
  isChartGateComplete,
  isChartGateTemporarilyBypassed,
  setChartGateTemporaryBypass,
} from "../lib/beginnerPath";
import {
  CASE_PACKS,
  getCaseStudy,
  gradeCaseAction,
  type CaseAction,
  type CaseGrade,
} from "../lib/caseStudies";
import { recordCaseResult } from "../lib/progressStore";
import {
  coachTipForThinkingMode,
  thinkingModeLabel,
} from "../lib/thinkingModeTips";
import YouTubeSearchLink from "../components/YouTubeSearchLink";

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
  const [tempBypass, setTempBypass] = useState(isChartGateTemporarilyBypassed);
  const gateDone = isChartGateComplete();
  const gateOk = gateDone || tempBypass || isChartGateCleared();
  const classOk = canBrowseAssetClass(study?.assetClass ?? "equity") || tempBypass;

  const [selected, setSelected] = useState<CaseAction | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState<CaseGrade | null>(null);

  if (!study) {
    return (
      <div className="p-6 font-mono text-sm space-y-3">
        <p className="text-sm text-accent-red">Case not found: {caseId}</p>
        <Link to="/cases" className="text-primary underline">
          Back to cases
        </Link>
      </div>
    );
  }

  if (!gateOk || !classOk) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <p className="text-sm text-slate-200 leading-relaxed">
          {!classOk
            ? "This case is Futures, Forex, Crypto, or Options context. Those classes stay locked until you peek this session."
            : "This case is clearer after the Indicators quiz on Training. You can still open it for this browser session only — that peek is temporary and does not save as path progress."}
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            to={`/training?group=${CHART_GATE_TRAINING_GROUP}&start=1`}
            className="inline-flex rounded-lg bg-primary px-3 py-2 text-sm font-bold text-white"
          >
            Take Indicators quiz
          </Link>
          <button
            type="button"
            className="inline-flex rounded-lg border border-line px-3 py-2 text-sm font-mono text-primary hover:bg-primary/10"
            onClick={() => {
              setChartGateTemporaryBypass(true);
              setTempBypass(true);
            }}
          >
            Open this case this session
          </button>
        </div>
        <button
          type="button"
          className="block text-sm text-primary/60 font-mono"
          onClick={() => navigate(-1)}
        >
          Go back
        </button>
      </div>
    );
  }

  const actions = ACTIONS.filter((a) => a.id !== "short" || Boolean(study.allowShort));
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
    <div className="flex-1 flex flex-col">
      <div className="border-b border-line bg-surface px-4 py-3 flex items-center justify-between">
        <Link to="/cases" className="text-sm text-primary hover:underline">
          ← Cases
        </Link>
        <p className="text-[12px] text-muted">
          {thinkingModeLabel(study.thinkingMode)} · practice
        </p>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-4">
        <div className="panel p-4 space-y-2">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-semibold">{study.title}</h1>
            <YouTubeSearchLink title={study.title} />
          </div>
          <p className="text-sm">{study.brief}</p>
          <p className="text-[13px] text-muted leading-relaxed">
            Tip: {coachTipForThinkingMode(study.thinkingMode)}
          </p>
          {study.newsHeadline ? (
            <p className="text-sm text-primary/90">
              Headline: {study.newsHeadline}
            </p>
          ) : null}
        </div>

        {study.statementSnapshot ? (
          <FinancialSnapshotCard snapshot={study.statementSnapshot} />
        ) : null}

        <div className="space-y-2">
          <div className="flex justify-between text-[12px] text-muted">
            <span>{submitted ? "What happened after" : "Price so far"}</span>
            {!submitted ? (
              <span>Aftermath hidden until you decide</span>
            ) : null}
          </div>
          <CandlestickChart data={chartData} height={280} />
        </div>

        <div className="space-y-3">
          <p className="text-[12px] font-semibold text-muted">
            Decision
          </p>
          <div
            className={`grid gap-2 ${
              actions.length === 4 ? "grid-cols-2 md:grid-cols-4" : "grid-cols-3"
            }`}
          >
            {actions.map((a) => (
              <button
                key={a.id}
                type="button"
                disabled={submitted}
                onClick={() => !submitted && setSelected(a.id)}
                className={`py-3 rounded font-bold font-mono text-sm border transition-colors ${
                  selected === a.id
                    ? "bg-primary text-white border-primary"
                    : "border-line text-primary hover:bg-primary/10"
                }`}
              >
                {a.label}
              </button>
            ))}
          </div>
          {!submitted ? (
            <button
              type="button"
              disabled={!selected}
              onClick={onSubmit}
              className="w-full bg-primary text-white font-bold py-3 rounded disabled:opacity-40"
            >
              Lock in and see what happened
            </button>
          ) : null}
        </div>

        {submitted && grade ? (
          <div className="border border-line rounded-xl p-4 font-mono text-sm space-y-2 bg-surface">
            <p
              className={
                grade === "correct"
                  ? "text-primary"
                  : grade === "partial"
                    ? "text-yellow-400"
                    : "text-accent-red"
              }
            >
              {grade === "correct"
                ? "Correct"
                : grade === "partial"
                  ? "Partial credit"
                  : "Incorrect"}
              {selected ? ` · you chose ${selected}` : ""}
            </p>
            <p className="text-slate-300">
              <span className="text-primary/50">How to think about it: </span>
              {study.debrief.process}
            </p>
            <p className="text-slate-300">
              <span className="text-primary/50">Why the price moved: </span>
              {study.debrief.whyMarketMoved}
            </p>
            <p className="text-slate-300">
              <span className="text-primary/50">What the numbers showed: </span>
              {study.debrief.evidence}
            </p>
            {grade === "partial" && study.partialOnHorizonMismatch ? (
              <p className="text-yellow-400/90 text-xs">
                Partial credit: your direction can make sense, but the time
                frame did not match the teaching answer.
              </p>
            ) : null}
            <p className="text-[10px] text-primary/40">
              This decision is locked so you cannot peek and change it. Refresh
              or reopen the case to try again.
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
