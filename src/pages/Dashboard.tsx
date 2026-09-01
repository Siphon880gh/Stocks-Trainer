import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GoalPicker from "../components/GoalPicker";
import { earningsPriceRatio, sharpeRatio, returnsFromCloses } from "../lib/financials";
import { SAMPLE_OHLC } from "../lib/ohlcData";
import {
  DECISION_MAKER_PATH_ID,
  isDecisionMakerPathComplete,
  countCoachingSessionsComplete,
  isFinancialDrillsComplete,
  isNewsLiteracyComplete,
  isPathConfirmed,
  isSignedInLocal,
  loadProgress,
  MARKET_EXPLORER_PATH_ID,
  resetProgress,
  setDisplayName,
  signInLocal,
  signOutLocal,
  type ProgressState,
} from "../lib/progressStore";
import {
  activePathMilestoneId,
  BEGINNER_PATH_MILESTONES,
  CHART_GATE_PREREQ_TIP,
  CHART_GATE_TRAINING_GROUP,
  coachTipForActive,
  DECISION_MAKER_PATH_MILESTONES,
  ensureDefaultPathSeeded,
  getPathMilestone,
  isGradedCasePackLocked,
  isPathComplete,
  MARKET_EXPLORER_PATH_MILESTONES,
  trainingHrefForMilestone,
  type PathMilestoneDef,
} from "../lib/beginnerPath";
import { getPathTemplate } from "../lib/learningPaths";
import {
  hasGradedPracticeDraw,
  practiceDrawTipLine,
} from "../lib/practiceDraw";
import {
  downloadProgressExport,
  getProgressSyncAdapter,
  importProgressJson,
} from "../lib/progressSync";

export default function Dashboard() {
  const closes = SAMPLE_OHLC.map((d) => d.close);
  const rets = returnsFromCloses(closes);
  const sharpe = sharpeRatio(rets);
  const ep = earningsPriceRatio(64281.92, 2840);

  const [{ state: progress, recoveryMessage }, setLoad] = useState(() => {
    ensureDefaultPathSeeded();
    const loaded = loadProgress();
    return {
      state: loaded.state as ProgressState,
      recoveryMessage: loaded.recoveryMessage,
    };
  });
  const [nameDraft, setNameDraft] = useState(
    () => progress.account?.displayName ?? "TRAINEE",
  );
  const [importMessage, setImportMessage] = useState<string | null>(null);
  const syncAdapter = getProgressSyncAdapter();
  const pathTemplate = getPathTemplate(progress.pathId);
  const pathDefs =
    progress.pathId === DECISION_MAKER_PATH_ID
      ? DECISION_MAKER_PATH_MILESTONES
      : progress.pathId === MARKET_EXPLORER_PATH_ID
        ? MARKET_EXPLORER_PATH_MILESTONES
        : BEGINNER_PATH_MILESTONES;
  const newsLitDone = isNewsLiteracyComplete(progress);
  const finDrillsDone = isFinancialDrillsComplete(progress);
  const coachingDoneCount = countCoachingSessionsComplete(progress);
  const pathDone = isPathComplete();
  const dmDone = isDecisionMakerPathComplete(progress);
  const goalPending = !isPathConfirmed(progress);
  const coachTip = coachTipForActive();
  const drawTip = practiceDrawTipLine();
  const drawDone = hasGradedPracticeDraw();

  const completedCount = useMemo(
    () =>
      pathDefs.filter((m) => progress.milestones[m.id]?.status === "complete")
        .length,
    [progress.milestones, pathDefs]
  );
  const pathStepLabel = `${completedCount}/${pathDefs.length}`;

  const activeId = activePathMilestoneId();
  const activeDef: PathMilestoneDef | undefined = activeId
    ? getPathMilestone(activeId)
    : undefined;
  const activeTrainingHref = activeId ? trainingHrefForMilestone(activeId) : null;
  const caseGateLocked = pathDefs.some(
    (m) => m.isGradedCasePack && isGradedCasePackLocked(m.id)
  );
  const nextHref =
    activeDef?.isGradedCasePack
      ? caseGateLocked
        ? `/training?group=${CHART_GATE_TRAINING_GROUP}&start=1`
        : activeDef.casesPack
          ? `/cases?pack=${activeDef.casesPack}`
          : "/cases"
      : activeTrainingHref ?? "/training";

  const refreshProgress = () => {
    const loaded = loadProgress();
    setLoad({
      state: loaded.state,
      recoveryMessage: loaded.recoveryMessage,
    });
  };

  const pathCompleteLabel =
    progress.pathId === DECISION_MAKER_PATH_ID
      ? "DECISION_MAKER_SEGMENT_COMPLETE"
      : progress.pathId === MARKET_EXPLORER_PATH_ID
        ? "MARKET_EXPLORER_SEGMENT_COMPLETE"
        : "BEGINNER_EQUITIES_PATH_COMPLETE";

  const signedIn = isSignedInLocal(progress);
  const accountLine = signedIn
    ? `SIGNED_IN_LOCAL // ${progress.account?.displayName ?? "TRAINEE"} // ${progress.account?.learnerId ?? ""}`
    : "SIGNED_OUT // LOCAL_SHELL";

  return (
    <>
      {/* Header / Terminal Identity */}
      <header className="border-b border-primary/30 p-4 flex items-center justify-between bg-background-dark/95 backdrop-blur-sm sticky top-0 z-50">
        <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity cursor-pointer">
          <span className="material-symbols-outlined text-primary text-3xl crt-glow">terminal</span>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-primary crt-glow">ANALYSIS_CORE_v2.0</h1>
            <p className="text-[10px] text-primary/60 leading-none">
              SYSTEM_STATUS: OPERATIONAL // {accountLine}
            </p>
          </div>
        </Link>
        <div className="flex gap-2 items-center">
          {signedIn ? (
            <button
              type="button"
              onClick={() => {
                signOutLocal();
                refreshProgress();
              }}
              className="border border-primary/40 px-2 py-1 text-[10px] font-mono text-primary hover:bg-primary/10"
            >
              SIGN_OUT
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                const next = signInLocal(nameDraft);
                setNameDraft(next.account?.displayName ?? "TRAINEE");
                refreshProgress();
              }}
              className="border border-primary px-2 py-1 text-[10px] font-mono text-primary bg-primary/10 hover:bg-primary/20"
            >
              SIGN_IN_LOCAL
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 space-y-6 max-w-7xl mx-auto w-full">
        {goalPending ? (
          <GoalPicker onConfirmed={refreshProgress} />
        ) : null}

        <section className="border-neon p-4 bg-neutral-dark/60 space-y-3">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-primary">badge</span>
            <h2 className="text-sm font-bold tracking-widest text-primary/80">ACCOUNT_SHELL</h2>
            <span className="text-[10px] font-mono text-primary/50">
              {signedIn ? "SIGNED_IN_LOCAL" : "SIGNED_OUT"}
            </span>
          </div>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-mono text-primary/50">DISPLAY_NAME</span>
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="bg-background-dark border border-primary/40 text-primary px-3 py-2 rounded font-mono text-sm min-w-[12rem]"
                maxLength={32}
              />
            </label>
            <button
              type="button"
              onClick={() => {
                const next = signedIn
                  ? setDisplayName(nameDraft)
                  : signInLocal(nameDraft);
                setNameDraft(next.account?.displayName ?? nameDraft);
                refreshProgress();
              }}
              className="border border-primary px-3 py-2 text-[10px] font-mono text-primary bg-primary/10 hover:bg-primary/20"
            >
              {signedIn ? "SAVE_NAME" : "SIGN_IN_LOCAL"}
            </button>
            {signedIn && progress.account ? (
              <p className="text-[10px] font-mono text-primary/60 self-center">
                ID {progress.account.learnerId}
              </p>
            ) : null}
          </div>
          <p className="text-[10px] font-mono text-primary/40">
            Local identity only · no OAuth / paid IdP
          </p>
          <div className="flex flex-wrap gap-2 items-center border-t border-primary/20 pt-3">
            <button
              type="button"
              onClick={() => downloadProgressExport()}
              className="border border-primary/40 px-3 py-1.5 text-[10px] font-mono text-primary hover:bg-primary/10"
            >
              EXPORT_PROGRESS
            </button>
            <label className="border border-primary/40 px-3 py-1.5 text-[10px] font-mono text-primary hover:bg-primary/10 cursor-pointer">
              IMPORT_PROGRESS
              <input
                type="file"
                accept="application/json,.json"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  const text = await file.text();
                  const result = importProgressJson(text);
                  if (result.ok) {
                    setImportMessage("IMPORT_OK · progress restored");
                    refreshProgress();
                  } else {
                    setImportMessage(
                      result.recoveryMessage ?? "IMPORT_REJECTED",
                    );
                  }
                }}
              />
            </label>
            <span className="text-[10px] font-mono text-primary/50">
              {syncAdapter.statusLabel}
            </span>
          </div>
          {importMessage ? (
            <p
              className={`text-[10px] font-mono ${
                importMessage.startsWith("IMPORT_OK")
                  ? "text-primary"
                  : "text-accent-red"
              }`}
            >
              {importMessage}
            </p>
          ) : null}
        </section>

        {/* Market Feed Section */}
        <section>
          <div className="flex items-center gap-2 mb-3">
            <span className="material-symbols-outlined text-sm">sensors</span>
            <h2 className="text-sm font-bold tracking-widest text-primary/80">MARKET_FEED_SUMMARY</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border-neon p-4 bg-neutral-dark/80 flex flex-col gap-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <span className="material-symbols-outlined text-4xl">trending_up</span>
              </div>
              <p className="text-xs text-primary/70">BTC / USDT</p>
              <p className="text-2xl font-bold tracking-tight text-primary">$64,231.00</p>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="material-symbols-outlined text-sm">arrow_drop_up</span>
                <span>+2.41% [BULLISH]</span>
              </div>
            </div>
            <div className="border-neon p-4 bg-neutral-dark/80 flex flex-col gap-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-20 text-red-500">
                <span className="material-symbols-outlined text-4xl">trending_down</span>
              </div>
              <p className="text-xs text-primary/70">ETH / USDT</p>
              <p className="text-2xl font-bold tracking-tight text-primary">$3,450.12</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-red-500">
                <span className="material-symbols-outlined text-sm">arrow_drop_down</span>
                <span>-1.18% [RETRACING]</span>
              </div>
            </div>
            <div className="border-neon p-4 bg-neutral-dark/80 flex flex-col gap-1 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <span className="material-symbols-outlined text-4xl">show_chart</span>
              </div>
              <p className="text-xs text-primary/70">S&P 500 INDEX</p>
              <p className="text-2xl font-bold tracking-tight text-primary">5,240.10</p>
              <div className="flex items-center gap-1 text-[10px] font-bold">
                <span className="material-symbols-outlined text-sm">arrow_drop_up</span>
                <span>+0.52% [STABLE]</span>
              </div>
            </div>
            <Link to="/market" className="border-neon p-4 bg-neutral-dark/80 flex flex-col gap-1 relative overflow-hidden hover:bg-primary/5 transition-colors">
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <span className="material-symbols-outlined text-4xl">analytics</span>
              </div>
              <p className="text-xs text-primary/70">KEY_METRICS</p>
              <p className="text-xl font-bold tracking-tight text-primary">E/P {ep.toFixed(1)}% · Sharpe {sharpe.toFixed(1)}</p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary/70">
                <span>VIEW_CHARTS_AND_FINANCIALS</span>
              </div>
            </Link>
            <Link
              to="/market?nav=1"
              className="border-neon p-4 bg-neutral-dark/80 flex flex-col gap-1 relative overflow-hidden hover:bg-primary/5 transition-colors sm:col-span-2 lg:col-span-1"
            >
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <span className="material-symbols-outlined text-4xl">explore</span>
              </div>
              <p className="text-xs text-primary/70">MARKET_NAV</p>
              <p className="text-xl font-bold tracking-tight text-primary">
                Equities · Futures · FX · Crypto
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary/70">
                <span>OPEN_NAVIGATOR · CHARTS_LITERACY_DECIDE</span>
              </div>
            </Link>
            <Link
              to="/coach"
              className="border-neon p-4 bg-neutral-dark/80 flex flex-col gap-1 relative overflow-hidden hover:bg-primary/5 transition-colors sm:col-span-2 lg:col-span-1"
            >
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <span className="material-symbols-outlined text-4xl">account_tree</span>
              </div>
              <p className="text-xs text-primary/70">COACH</p>
              <p className="text-xl font-bold tracking-tight text-primary">
                Step Coaching
              </p>
              <div className="flex items-center gap-1 text-[10px] font-bold text-primary/70">
                <span>
                  FAIL_REWIND_LEARN ·{" "}
                  {coachingDoneCount > 0
                    ? `${coachingDoneCount}_DONE`
                    : "NO_LLM"}
                </span>
              </div>
            </Link>
          </div>
        </section>

        {/* Main Progress & Lesson */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 border-neon p-6 bg-neutral-dark/60 flex flex-col justify-between space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <h3 className="text-xs text-primary/60 font-medium tracking-widest">
                    PATH::{progress.pathId.toUpperCase()} · STEP_{pathStepLabel}
                  </h3>
                  <h2 className="text-2xl font-bold text-primary crt-glow">
                    {pathDone
                      ? pathCompleteLabel
                      : activeDef
                        ? activeDef.title
                        : pathTemplate?.title ?? "Learning Path"}
                  </h2>
                  {pathDone ? (
                    <p className="text-xs text-primary/80 font-mono">
                      Credential: {pathTemplate?.title ?? "Path"} complete
                      (SAMPLE progress, not attested).
                    </p>
                  ) : activeDef ? (
                    <p className="text-xs text-slate-400">{activeDef.summary}</p>
                  ) : (
                    <p className="text-xs text-slate-400">
                      {goalPending
                        ? "Confirm a path above to begin."
                        : `First-run: start ${pathTemplate?.title ?? "path"}.`}
                    </p>
                  )}
                  {dmDone ||
                  (progress.pathId === DECISION_MAKER_PATH_ID && pathDone) ? (
                    <p className="text-[11px] font-mono text-primary mt-1 border border-primary/40 inline-block px-2 py-0.5">
                      BADGE · DECISION_MAKER_SEGMENT
                    </p>
                  ) : null}
                  <p className="text-[11px] font-mono text-primary/60 mt-1">
                    COACH: {coachTip}
                  </p>
                  {coachingDoneCount === 0 ? (
                    <p className="text-[11px] font-mono text-primary/50 mt-1">
                      TIP:{" "}
                      <Link to="/coach" className="underline text-primary">
                        STEP_COACHING
                      </Link>{" "}
                      · fail / rewind / learn (no LLM)
                    </p>
                  ) : (
                    <p className="text-[11px] font-mono text-primary/40 mt-1">
                      COACHING_FLAG · {coachingDoneCount} session
                      {coachingDoneCount === 1 ? "" : "s"} reached success
                    </p>
                  )}
                  {!newsLitDone ? (
                    <p className="text-[11px] font-mono text-primary/50 mt-1">
                      TIP:{" "}
                      <Link
                        to="/training?group=news-literacy"
                        className="underline text-primary"
                      >
                        NEWS_LITERACY
                      </Link>{" "}
                      · headline skill (optional drill)
                    </p>
                  ) : (
                    <p className="text-[11px] font-mono text-primary/40 mt-1">
                      DRILL_FLAG · NEWS_LITERACY complete
                    </p>
                  )}
                  {progress.milestones["E4.M2"]?.status === "complete" &&
                  !finDrillsDone ? (
                    <p className="text-[11px] font-mono text-primary/50 mt-1">
                      TIP:{" "}
                      <Link
                        to="/training?group=financial-drills"
                        className="underline text-primary"
                      >
                        STATEMENTS_DRILLS
                      </Link>{" "}
                      · extra SAMPLE snapshot practice
                    </p>
                  ) : null}
                  {progress.pathId === MARKET_EXPLORER_PATH_ID ? (
                    <p className="text-[11px] font-mono text-primary/50 mt-1">
                      TIP: Equities paths remain for traditional stocks · Explorer =
                      SAMPLE multi-market
                    </p>
                  ) : null}
                </div>
                <p className="text-2xl font-bold">{progress.scores.totalPoints} PTS</p>
              </div>
              <div className="h-4 w-full bg-primary/20 border border-primary/30 p-0.5">
                <div
                  className="h-full bg-primary shadow-[0_0_10px_#38ff14]"
                  style={{
                    width: `${Math.round(
                      (completedCount / Math.max(pathDefs.length, 1)) * 100
                    )}%`,
                  }}
                ></div>
              </div>
              <ul className="space-y-1 font-mono text-[11px]">
                {pathDefs.map((m) => {
                  const status = progress.milestones[m.id]?.status ?? "locked";
                  const lockedCase = isGradedCasePackLocked(m.id);
                  return (
                    <li key={m.id} className="flex flex-wrap items-baseline gap-2 text-primary/70">
                      <span>{m.title}</span>
                      <span className="uppercase text-primary/50">[{status}]</span>
                      {lockedCase ? (
                        <span className="text-accent-red/80">LOCKED · finish Indicators first</span>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
              {caseGateLocked ? (
                <p className="text-[11px] font-mono text-accent-red/90">{CHART_GATE_PREREQ_TIP}</p>
              ) : null}
              <button
                type="button"
                className="text-[11px] font-mono text-primary/50 underline hover:text-primary text-left"
                onClick={() => {
                  if (
                    window.confirm(
                      "Reset Beginner Equities Path to first-run? Quiz/case progress in localStorage will clear."
                    )
                  ) {
                    resetProgress();
                    refreshProgress();
                  }
                }}
              >
                RESET_PATH
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
              <Link to="/archive" className="p-3 border border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary/70">menu_book</span>
                <span className="text-[10px]">READ_THEORY</span>
              </Link>
              <Link to="/market" className="p-3 border border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-primary/70">visibility</span>
                <span className="text-[10px]">IDENTIFY_CANDLE</span>
              </Link>
              <Link
                to="/cases"
                className="p-3 border border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary/70">gavel</span>
                <span className="text-[10px]">CASE_STUDIES</span>
              </Link>
              <Link
                to="/practice-draw"
                className="p-3 border border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer relative"
              >
                <span className="material-symbols-outlined text-primary/70">draw</span>
                <span className="text-[10px]">PRACTICE_DRAW</span>
                {drawDone ? (
                  <span className="absolute top-1 right-1 text-[8px] font-mono text-primary border border-primary/50 px-1">
                    DONE
                  </span>
                ) : null}
              </Link>
              <Link
                to={`/training?group=${CHART_GATE_TRAINING_GROUP}`}
                className="p-3 border border-primary/20 bg-primary/5 flex flex-col items-center text-center gap-2 hover:bg-primary/10 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-primary/70">show_chart</span>
                <span className="text-[10px]">INDICATORS</span>
              </Link>
              <Link
                to={nextHref}
                className="p-3 border border-primary bg-primary text-background-dark font-bold flex flex-col items-center text-center gap-2 hover:bg-primary/90"
              >
                <span className="material-symbols-outlined">play_arrow</span>
                <span className="text-[10px]">
                  {activeDef?.isGradedCasePack && caseGateLocked
                    ? "INDICATORS"
                    : activeDef?.isGradedCasePack
                      ? "OPEN_CASES"
                      : "NEXT_STEP"}
                </span>
              </Link>
            </div>
          </section>

          {/* Navigation Grid */}
          <section className="grid grid-cols-1 gap-4">
            <Link to="/market" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">candlestick_chart</span>
                <div>
                  <p className="font-bold tracking-widest">CHARTS</p>
                  <p className="text-[10px] opacity-70">SAMPLE_CHART_ANALYSIS</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
            <Link to="/training" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">quiz</span>
                <div>
                  <p className="font-bold tracking-widest">QUIZ_CENTER</p>
                  <p className="text-[10px] opacity-70">VALIDATE_KNOWLEDGE</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
            <Link to="/cases" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">gavel</span>
                <div>
                  <p className="font-bold tracking-widest">CASE_STUDIES</p>
                  <p className="text-[10px] opacity-70">DECIDE_AND_REVEAL</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
            <Link to="/coach" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">account_tree</span>
                <div>
                  <p className="font-bold tracking-widest">STEP_COACHING</p>
                  <p className="text-[10px] opacity-70">DECISION_TREE_WIZARD</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
            <Link to="/archive" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">inventory_2</span>
                <div>
                  <p className="font-bold tracking-widest">ARCHIVE</p>
                  <p className="text-[10px] opacity-70">HISTORICAL_PATTERNS</p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
            <Link to="/practice-draw" className="border-neon p-4 flex items-center justify-between group cursor-pointer hover:bg-primary hover:text-background-dark transition-all">
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-3xl">draw</span>
                <div>
                  <p className="font-bold tracking-widest">PRACTICE_DRAW</p>
                  <p className="text-[10px] opacity-70">
                    {drawTip ?? "SKETCH_PATTERN_TEMPLATES"}
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined">chevron_right</span>
            </Link>
          </section>
        </div>

        {/* Terminal Logs / Footer Stats */}
        <section className="border-neon p-4 bg-neutral-dark/80 font-mono text-[11px] h-32 overflow-y-auto space-y-1">
          {recoveryMessage ? (
            <p className="text-accent-red">{recoveryMessage}</p>
          ) : null}
          <p className="text-primary/40">
            PROGRESS_STORE schema v{progress.schemaVersion} · path={progress.pathId}
          </p>
          {drawTip ? <p className="text-primary/80">{drawTip}</p> : null}
          <p className="text-primary/40">
            STREAK {progress.streaks.current} (best {progress.streaks.best}) · accuracy{" "}
            {progress.scores.accuracy}%
          </p>
          <p className="text-primary/80">
            MILESTONES:{" "}
            {pathDefs
              .map(
                (m) =>
                  `${m.title}:${progress.milestones[m.id]?.status ?? "missing"}`
              )
              .join(" · ")}
          </p>
          <p className="text-primary/40">updatedAt={progress.updatedAt}</p>
          <button
            type="button"
            className="text-primary/60 underline hover:text-primary"
            onClick={() => {
              const loaded = loadProgress();
              setLoad({
                state: loaded.state,
                recoveryMessage: loaded.recoveryMessage,
              });
            }}
          >
            RELOAD_PROGRESS_FROM_STORAGE
          </button>
          <p className="text-primary/80 animate-pulse">_</p>
        </section>
      </main>

      {/* Navigation Bar */}
      <nav className="border-t border-primary/30 bg-background-dark/95 backdrop-blur-md sticky bottom-0 w-full z-50">
        <div className="flex max-w-7xl mx-auto px-4 py-2 gap-2">
          <Link to="/" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-primary border-b-2 border-primary">
            <span className="material-symbols-outlined fill-1">dashboard</span>
            <p className="text-[10px] font-bold tracking-widest">DASHBOARD</p>
          </Link>
          <Link to="/training" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">school</span>
            <p className="text-[10px] font-bold tracking-widest">LEARN</p>
          </Link>
          <Link to="/market" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">monitoring</span>
            <p className="text-[10px] font-bold tracking-widest">MARKET</p>
          </Link>
          <Link to="/archive" className="flex flex-1 flex-col items-center justify-center gap-1 py-2 text-primary/40 hover:text-primary transition-colors">
            <span className="material-symbols-outlined">settings</span>
            <p className="text-[10px] font-bold tracking-widest">CONFIG</p>
          </Link>
        </div>
      </nav>
    </>
  );
}
