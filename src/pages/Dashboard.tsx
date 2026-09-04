import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import GoalPicker from "../components/GoalPicker";
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
  setChartGateTemporaryBypass,
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
  const [{ state: progress, recoveryMessage }, setLoad] = useState(() => {
    ensureDefaultPathSeeded();
    const loaded = loadProgress();
    return {
      state: loaded.state as ProgressState,
      recoveryMessage: loaded.recoveryMessage,
    };
  });
  const [nameDraft, setNameDraft] = useState(
    () => progress.account?.displayName ?? "You",
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
      ? "Decision Maker path complete"
      : progress.pathId === MARKET_EXPLORER_PATH_ID
        ? "Market Explorer path complete"
        : "Beginner Equities path complete";

  const signedIn = isSignedInLocal(progress);

  const nextLabel =
    activeDef?.isGradedCasePack && caseGateLocked
      ? "Indicators quiz"
      : activeDef?.isGradedCasePack
        ? "Open cases"
        : "Continue";

  return (
    <main className="flex-1 p-4 md:p-8 max-w-3xl mx-auto w-full space-y-8">
      {goalPending ? <GoalPicker onConfirmed={refreshProgress} /> : null}

      <section className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[13px] text-muted">
            {pathTemplate?.title ?? "Learning path"} · {pathStepLabel}
          </p>
          <h1 className="text-2xl font-semibold tracking-tight mt-1">
            {pathDone
              ? pathCompleteLabel
              : activeDef
                ? activeDef.title
                : pathTemplate?.title ?? "Your path"}
          </h1>
          {pathDone ? (
            <p className="text-sm text-muted mt-2">
              {progress.pathId === DECISION_MAKER_PATH_ID
                ? "Decision Maker credential: earnings through news plus financials packs are complete (SAMPLE progress, not attested)."
                : progress.pathId === MARKET_EXPLORER_PATH_ID
                  ? "Market Explorer credential: futures, forex, and crypto SAMPLE packs are complete. Traditional stocks stay on Beginner Equities."
                  : "Beginner Equities credential: literacy, Indicators, earnings pack, and company-news pack are complete (SAMPLE progress, not attested)."}
            </p>
          ) : activeDef ? (
            <p className="text-sm text-muted mt-2">{activeDef.summary}</p>
          ) : (
            <p className="text-sm text-muted mt-2">
              {goalPending
                ? "Confirm a path above to begin. Beginner Equities is the traditional stock path."
                : `Start ${pathTemplate?.title ?? "your path"}.`}
            </p>
          )}
        </div>
        <Link
          to={nextHref}
          className="bg-primary text-white font-semibold px-5 py-2.5 rounded-md hover:bg-primary-dim text-sm"
        >
          {nextLabel}
        </Link>
      </section>

      <section className="space-y-4">
        <p className="text-sm">Coach: {coachTip}</p>
        <div className="h-1.5 w-full bg-canvas rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{
              width: `${Math.round(
                (completedCount / Math.max(pathDefs.length, 1)) * 100
              )}%`,
            }}
          />
        </div>
        <ul className="space-y-1.5 text-sm">
          {pathDefs.map((m) => {
            const status = progress.milestones[m.id]?.status ?? "locked";
            const lockedCase = isGradedCasePackLocked(m.id);
            return (
              <li key={m.id} className="flex flex-wrap items-baseline gap-2">
                <span>{m.title}</span>
                <span className="text-muted text-[12px]">{status}</span>
                {lockedCase ? (
                  <span className="text-accent-red text-[12px]">Locked — finish Indicators first</span>
                ) : null}
              </li>
            );
          })}
        </ul>
        {caseGateLocked ? (
          <p className="text-[13px] text-accent-red">{CHART_GATE_PREREQ_TIP}</p>
        ) : null}
        {dmDone || (progress.pathId === DECISION_MAKER_PATH_ID && pathDone) ? (
          <p className="text-[12px] text-up">Decision Maker segment</p>
        ) : null}
        {coachingDoneCount === 0 ? (
          <p className="text-[13px] text-muted">
            Optional:{" "}
            <Link to="/coach/earnings-beat-miss" className="text-primary hover:underline">
              Beat vs miss
            </Link>
            {" · "}
            <Link to="/coach/chase-vs-fade" className="text-primary hover:underline">
              Chase vs fade
            </Link>
            {" · "}
            <Link to="/coach/short-vs-sell" className="text-primary hover:underline">
              Short versus sell
            </Link>
          </p>
        ) : (
          <p className="text-[13px] text-muted">
            Coach · {coachingDoneCount}{" "}
            {coachingDoneCount === 1 ? "session" : "sessions"} reached success
            {" · "}
            <Link to="/coach" className="text-primary hover:underline">
              Catalog
            </Link>
          </p>
        )}
        {!newsLitDone ? (
          <p className="text-[13px] text-muted">
            Optional:{" "}
            <Link to="/training?group=news-literacy" className="text-primary hover:underline">
              news literacy
            </Link>
          </p>
        ) : (
          <p className="text-[13px] text-muted">News literacy complete</p>
        )}
        {progress.milestones["E4.M2"]?.status === "complete" && !finDrillsDone ? (
          <p className="text-[13px] text-muted">
            Optional:{" "}
            <Link to="/training?group=financial-drills" className="text-primary hover:underline">
              statements drills
            </Link>
          </p>
        ) : finDrillsDone ? (
          <p className="text-[13px] text-muted">Statements drills complete</p>
        ) : null}
        {progress.pathId === MARKET_EXPLORER_PATH_ID ? (
          <p className="text-[13px] text-muted">
            Equities paths remain for traditional stocks. Explorer is SAMPLE multi-market.
          </p>
        ) : null}
      </section>

      <section className="border-t border-line pt-6 space-y-2">
        <p className="text-[12px] text-muted">Also</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <Link to="/market" className="text-primary hover:underline">Charts</Link>
          <Link to="/market?nav=1" className="text-primary hover:underline">Market navigator</Link>
          <Link to="/training" className="text-primary hover:underline">Quizzes</Link>
          <Link to="/archive" className="text-primary hover:underline">Reference</Link>
          <Link to="/practice-draw" className="text-primary hover:underline">
            Draw{drawDone ? " · done" : ""}
          </Link>
          <Link to="/practice/lookalike" className="text-primary hover:underline">Lookalikes</Link>
          <Link to="/practice/hunt" className="text-primary hover:underline">Pattern hunt</Link>
          <Link to="/practice/levels" className="text-primary hover:underline">Support and resistance</Link>
          <Link to="/coach" className="text-primary hover:underline">Coach</Link>
        </div>
        <p className="text-[12px] text-muted tabular-nums">
          {progress.scores.totalPoints} pts · streak {progress.streaks.current} · {progress.scores.accuracy}% accuracy
        </p>
      </section>

      <details className="text-sm border-t border-line pt-4">
        <summary className="cursor-pointer text-muted hover:text-ink">
          Account · {signedIn ? progress.account?.displayName ?? "You" : "not signed in"}
        </summary>
        <div className="mt-3 space-y-3">
          <p className="text-[12px] text-muted">
            Progress stays on this device. Export and import JSON here. There is no cloud
            sync and no fake upload success.
          </p>
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1">
              <span className="text-[12px] text-muted">Display name</span>
              <input
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                className="bg-surface border border-line text-ink px-3 py-2 rounded-md text-sm min-w-[12rem]"
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
              className="border border-line px-3 py-2 text-[13px] rounded-md hover:bg-canvas"
            >
              {signedIn ? "Save name" : "Sign in"}
            </button>
            {signedIn ? (
              <button
                type="button"
                onClick={() => {
                  signOutLocal();
                  refreshProgress();
                }}
                className="text-[13px] text-muted hover:text-ink"
              >
                Sign out
              </button>
            ) : null}
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button
              type="button"
              onClick={() => downloadProgressExport()}
              className="border border-line px-3 py-1.5 text-[13px] rounded-md hover:bg-canvas"
            >
              Export
            </button>
            <label className="border border-line px-3 py-1.5 text-[13px] rounded-md hover:bg-canvas cursor-pointer">
              Import
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
                    setImportMessage("Progress restored");
                    refreshProgress();
                  } else {
                    setImportMessage(result.recoveryMessage ?? "Import rejected");
                  }
                }}
              />
            </label>
            <span className="text-[12px] text-muted">{syncAdapter.statusLabel}</span>
          </div>
          {importMessage ? (
            <p className={importMessage === "Progress restored" ? "text-up" : "text-accent-red"}>
              {importMessage}
            </p>
          ) : null}
          <button
            type="button"
            className="text-[13px] text-muted hover:text-ink underline"
            onClick={() => {
              if (
                window.confirm(
                  "Reset path to first-run? Quiz and case progress on this device will clear."
                )
              ) {
                resetProgress();
                setChartGateTemporaryBypass(false);
                refreshProgress();
              }
            }}
          >
            Reset path
          </button>
        </div>
      </details>

      {(recoveryMessage || drawTip) && (
        <section className="text-[12px] text-muted space-y-1">
          {recoveryMessage ? <p className="text-accent-red">{recoveryMessage}</p> : null}
          {drawTip ? <p>{drawTip}</p> : null}
        </section>
      )}
    </main>
  );
}
