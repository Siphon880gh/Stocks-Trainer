import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import QuizModal from "../components/QuizModal";
import AnswerSheetModal from "../components/AnswerSheetModal";
import PathMapPanel from "../components/PathMapPanel";
import { QUIZ_GROUPS, getQuestionsForGroup, type QuizGroupId } from "../lib/quizData";
import {
  CHART_GATE_MILESTONE_ID,
  CHART_GATE_PREREQ_TIP,
  CHART_GATE_TRAINING_GROUP,
  canStartQuizGroup,
  isChartGateComplete,
} from "../lib/beginnerPath";
import { getMilestoneStatus, loadProgress } from "../lib/progressStore";

export default function Training() {
  const [searchParams] = useSearchParams();
  const groupParam = searchParams.get("group") as QuizGroupId | null;
  const startParam = searchParams.get("start");
  const [selectedGroup, setSelectedGroup] = useState<QuizGroupId>(groupParam && QUIZ_GROUPS.some((g) => g.id === groupParam) ? groupParam : "indicators");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStartIndex, setQuizStartIndex] = useState<number | undefined>(undefined);
  const [answerSheetOpen, setAnswerSheetOpen] = useState(false);
  const [points, setPoints] = useState(() => loadProgress().state.scores.totalPoints);
  const [streak, setStreak] = useState(() => loadProgress().state.streaks.current);
  const [accuracy, setAccuracy] = useState(() => loadProgress().state.scores.accuracy);
  const [pathMapTick, setPathMapTick] = useState(0);
  const chartGateOpen =
    !isChartGateComplete() &&
    (getMilestoneStatus(CHART_GATE_MILESTONE_ID) === "available" ||
      getMilestoneStatus(CHART_GATE_MILESTONE_ID) === "in_progress" ||
      getMilestoneStatus(CHART_GATE_MILESTONE_ID) === "locked");
  const showChartGateBanner = chartGateOpen && !isChartGateComplete();
  const groupLocked = !canStartQuizGroup(selectedGroup);

  useEffect(() => {
    if (groupParam && QUIZ_GROUPS.some((g) => g.id === groupParam)) {
      setSelectedGroup(groupParam);
    }
  }, [groupParam]);

  useEffect(() => {
    if (startParam === "1" && canStartQuizGroup(selectedGroup)) {
      setIsQuizOpen(true);
    }
  }, [startParam, selectedGroup]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-line bg-surface">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Learn</h1>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[12px] text-muted">Accuracy</span>
              <div className="w-40 h-1.5 bg-canvas rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${accuracy}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm tabular-nums">
              <span className="text-muted">Pts</span>
              <span className="font-semibold">{points}</span>
            </div>
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col items-center gap-6 w-full">
        <PathMapPanel
          selectedGroup={selectedGroup}
          onSelectTrainingGroup={setSelectedGroup}
          refreshKey={pathMapTick}
        />
        {showChartGateBanner ? (
          <div className="w-full max-w-xl panel p-4 text-sm space-y-2">
            <p className="font-semibold">Beginner path · Indicators</p>
            <p className="text-muted">{CHART_GATE_PREREQ_TIP}</p>
            <button
              type="button"
              className="text-primary underline"
              onClick={() => setSelectedGroup(CHART_GATE_TRAINING_GROUP)}
            >
              Select Indicators group
            </button>
          </div>
        ) : (
          <div className="w-full max-w-xl panel p-4 text-sm space-y-2">
            <p className="font-semibold">Decision cases · Packs A–C</p>
            <p className="text-muted">
              After Indicators: earnings, company news, macro intro, and
              combined news+statements (SAMPLE).
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/cases?pack=earnings" className="text-primary underline">
                Earnings pack
              </Link>
              <Link to="/cases?pack=company-news" className="text-primary underline">
                Company news pack
              </Link>
              <Link to="/cases?pack=macro-news" className="text-primary underline">
                Macro intro pack
              </Link>
              <Link to="/cases?pack=combined" className="text-primary underline">
                Combined pack
              </Link>
              <Link to="/practice-draw?template=doji" className="text-primary underline">
                Practice Draw
              </Link>
            </div>
          </div>
        )}
        {/* Quiz Launch Card */}
        <div className="w-full max-w-xl panel p-8 space-y-6">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary">quiz</span>
            <div>
              <h2 className="text-xl font-semibold">Pattern recognition quiz</h2>
              <p className="text-muted text-sm mt-1">
                Identify candlestick patterns on historical chart snapshots to earn points.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[12px] font-semibold text-muted">Test group</h3>
            <div className="flex flex-wrap gap-2">
              {QUIZ_GROUPS.map((g) => {
                const isFeatured =
                  g.id === "candle-anatomy" ||
                  g.id === "indicators" ||
                  g.id === "equity-patterns" ||
                  g.id === "equity-literacy" ||
                  g.id === "financial-literacy" ||
                  g.id === "news-literacy" ||
                  g.id === "financial-drills";
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGroup(g.id)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${
                      selectedGroup === g.id
                        ? "bg-primary text-white"
                        : isFeatured
                          ? "border border-line bg-primary/5 text-ink hover:bg-primary/10"
                          : "border border-line text-ink hover:bg-canvas"
                    }`}
                  >
                    {g.icon && <span className="material-symbols-outlined text-lg">{g.icon}</span>}
                    {g.name}
                    <span className="text-[10px] font-normal opacity-80">
                      ({getQuestionsForGroup(g.id).length})
                    </span>
                  </button>
                );
              })}
            </div>
            <p className="text-muted text-sm">
              {QUIZ_GROUPS.find((g) => g.id === selectedGroup)?.description}
            </p>
            <p className="text-[13px] text-muted">
              After Statements Literacy:{" "}
              <button
                type="button"
                className="underline text-primary"
                onClick={() => setSelectedGroup("financial-drills")}
              >
                Statements drills
              </button>{" "}
              · optional SAMPLE snapshot pack
            </p>
            {groupLocked ? (
              <p className="text-accent-red text-sm">
                Locked: finish the earlier path step first.
              </p>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="border border-line rounded-lg p-4 text-center bg-canvas">
              <p className="text-[12px] text-muted mb-1">Points</p>
              <p className="text-2xl font-semibold tabular-nums">{points}</p>
            </div>
            <div className="border border-line rounded-lg p-4 text-center bg-canvas">
              <p className="text-[12px] text-muted mb-1">Streak</p>
              <p className="text-2xl font-semibold tabular-nums flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-accent-red text-xl">local_fire_department</span>
                {streak}
              </p>
            </div>
            <div className="border border-line rounded-lg p-4 text-center bg-canvas">
              <p className="text-[12px] text-muted mb-1">Accuracy</p>
              <p className="text-2xl font-semibold tabular-nums">{accuracy}%</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                if (groupLocked) return;
                setQuizStartIndex(undefined);
                setIsQuizOpen(true);
              }}
              disabled={groupLocked}
              className="flex-1 bg-primary hover:bg-primary-dim text-white font-semibold py-3.5 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              {groupLocked ? "Locked" : "Start quiz"}
            </button>
            {!isQuizOpen && (
              <button
                onClick={() => setAnswerSheetOpen(true)}
                className="border border-line text-ink px-6 py-3.5 rounded-lg font-medium hover:bg-canvas flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">assignment</span>
                Answer sheet
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-between border-t border-line mt-8 w-full text-sm text-muted">
        <div className="flex gap-6">
          <Link to="/archive" className="hover:text-ink">
            Reference
          </Link>
          {!isQuizOpen && (
            <button
              onClick={() => setAnswerSheetOpen(true)}
              className="hover:text-ink"
            >
              Answer sheet
            </button>
          )}
        </div>
        <p className="text-[12px]">SAMPLE · educational</p>
      </footer>

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => {
          setIsQuizOpen(false);
          setPathMapTick((n) => n + 1);
        }}
        initialPoints={points}
        initialStreak={streak}
        startIndex={quizStartIndex}
        groupId={selectedGroup}
        onPointsUpdate={(p, s, a) => {
          setPoints(p);
          setStreak(s);
          setAccuracy(a);
          setPathMapTick((n) => n + 1);
        }}
      />
      <AnswerSheetModal
        isOpen={answerSheetOpen}
        onClose={() => setAnswerSheetOpen(false)}
        groupId={selectedGroup}
        onPracticeQuestion={(index, groupId) => {
          setAnswerSheetOpen(false);
          if (groupId) setSelectedGroup(groupId);
          setQuizStartIndex(index);
          setIsQuizOpen(true);
        }}
      />
    </div>
  );
}
