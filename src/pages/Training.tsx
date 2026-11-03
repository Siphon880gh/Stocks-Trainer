import { useState, useEffect, useMemo } from "react";
import { ANSWER_STREAK_LABEL, ANSWER_STREAK_TIP } from "../lib/streakLabels";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import QuizModal from "../components/QuizModal";
import SampleDataNote from "../components/SampleDataNote";
import { withoutSampleWord } from "../lib/learnerCopy";
import AnswerSheetModal from "../components/AnswerSheetModal";
import PathMapPanel from "../components/PathMapPanel";
import BrowsePopover from "../components/BrowsePopover";
import { QUIZ_GROUPS, getQuestionsForGroup, type QuizGroupId } from "../lib/quizData";
import { conceptQuizGroups, patternQuizGroups } from "../lib/quizKinds";
import { listPlaybooks } from "../lib/playbooks";
import { listSessions } from "../lib/coaching";
import {
  CHART_GATE_MILESTONE_ID,
  CHART_GATE_PREREQ_TIP,
  CHART_GATE_TRAINING_GROUP,
  canStartQuizGroup,
  isChartGateComplete,
  isChartGateTemporarilyBypassed,
  quizGroupAssetClass,
  setChartGateTemporaryBypass,
} from "../lib/beginnerPath";
import { getMilestoneStatus, loadProgress } from "../lib/progressStore";
import { MISC_PRACTICE_ITEMS, isMiscPracticeDone } from "../lib/miscPractices";
import FinancialsTrainingCard from "../components/financials/FinancialsTrainingCard";
import { isFinancialsQuizGroup } from "../lib/financials/quizBanks";
import MacroTrainingCard from "../components/macro/MacroTrainingCard";
import { isMacroQuizGroup } from "../lib/macro/quiz/banks";
import AcademyTrainingCard from "../components/academy/AcademyTrainingCard";
import PanelCarousel, { TocGroup } from "../components/PanelCarousel";
import { isAcademyQuizGroup } from "../lib/academy/quiz/groups";
import { hasGradedPracticeDraw } from "../lib/practiceDraw";
import YouTubeSearchLink from "../components/YouTubeSearchLink";

function practiceDone(id: string): boolean {
  if (id === "draw") return hasGradedPracticeDraw();
  return isMiscPracticeDone(id);
}

export default function Training() {
  const [searchParams] = useSearchParams();
  const { hash } = useLocation();
  const conceptMode = hash === "#concepts";
  const visibleGroups = useMemo(() => (conceptMode ? conceptQuizGroups() : patternQuizGroups()), [conceptMode]);
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
  const [tempBypass, setTempBypass] = useState(isChartGateTemporarilyBypassed);
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
    if (groupParam && visibleGroups.some((g) => g.id === groupParam)) return;
    if (!visibleGroups.some((g) => g.id === selectedGroup)) {
      const next = visibleGroups[0];
      if (next) setSelectedGroup(next.id);
    }
  }, [visibleGroups, selectedGroup, groupParam]);

  useEffect(() => {
    if (startParam === "1" && canStartQuizGroup(selectedGroup)) {
      setIsQuizOpen(true);
    }
  }, [startParam, selectedGroup]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-line bg-surface">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-lg font-semibold tracking-tight">Table of Contents</h1>
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
        <div id="path" className="w-full scroll-mt-32">
          <PathMapPanel
            selectedGroup={selectedGroup}
            onSelectTrainingGroup={setSelectedGroup}
            refreshKey={pathMapTick}
          />
        </div>
        <PanelCarousel>
        <TocGroup id="academy" label="Academy">
        <div className="w-full max-w-xl scroll-mt-32">
          <AcademyTrainingCard onSelectGroup={setSelectedGroup} />
        </div>
        </TocGroup>
        <TocGroup id="quiz" label={conceptMode ? "Quiz (Concepts)" : "Quiz (Patterns)"} aliases={["concepts", "patterns", "quiz"]}>
        <div className="relative w-full max-w-xl panel p-8 pr-12 pb-28 space-y-6 scroll-mt-32">
          <SampleDataNote />
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-4xl text-primary">quiz</span>
            <div>
              <h2 className="text-xl font-semibold">{conceptMode ? "Quiz (Concepts)" : "Quiz (Patterns)"}</h2>
              <p className="text-muted text-sm mt-1">
                {conceptMode
                  ? "Checks on ideas: how a candle is built, statements, indicators, risk and the other markets."
                  : "Name the candle and chart shapes. Start with Candlestick Basics if the parts of one candle are still new."}
              </p>
              {conceptMode ? null : (
                <Link to="/practice/candle-basics" className="text-primary underline text-sm">Candlestick Basics</Link>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-[12px] font-semibold text-muted">Test group</h3>
              <BrowsePopover
                title="Test groups"
                selectedId={selectedGroup}
                items={visibleGroups.map((g) => ({
                  id: g.id,
                  label: g.name,
                  hint: `${getQuestionsForGroup(g.id).length} questions`,
                }))}
                onSelect={(id) => setSelectedGroup(id as QuizGroupId)}
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {visibleGroups.map((g) => {
                const isFeatured =
                  g.id === "candle-anatomy" ||
                  g.id === "candle-reading" ||
                  g.id === "candle-pattern-book" ||
                  g.id === "japanese-candles" ||
                  g.id === "heikin-ashi" ||
                  g.id === "chart-patterns" ||
                  g.id === "buy-or-sell" ||
                  g.id === "price-action" ||
                  g.id === "trade-framework" ||
                  g.id === "opening-range" ||
                  g.id === "four-pillars" ||
                  g.id === "fair-value-gap" ||
                  g.id === "risk-premium-portfolio" ||
                  g.id === "vix-trading" ||
                  g.id === "wheel-strategy" ||
                  g.id === "supply-demand" ||
                  g.id === "indicators" ||
                  g.id === "oscillators" ||
                  g.id === "trading-risk" ||
                  g.id === "squeezes" ||
                  g.id === "news-biases" ||
                  g.id === "algo-trading" ||
                  g.id === "charting-apps" ||
                  g.id === "crypto-candles" ||
                  g.id === "reversal-charts" ||
                  g.id === "one-minute-charts" ||
                  g.id === "fib-decision-map" ||
                  g.id === "futures-vs-options" ||
                  g.id === "technique-narratives" ||
                  g.id === "missing-wicks" ||
                  g.id === "record-traders" ||
                  g.id === "pattern-themes" ||
                  g.id === "essential-candles" ||
                  g.id === "which-way" ||
                  g.id === "equity-patterns" ||
                  g.id === "equity-literacy" ||
                  g.id === "financial-literacy" ||
                  g.id === "news-literacy" ||
                  g.id === "earnings-jargon" ||
                  g.id === "financial-drills" ||
                  isFinancialsQuizGroup(g.id) ||
                  isMacroQuizGroup(g.id) ||
                  isAcademyQuizGroup(g.id);
                return (
                  <span key={g.id} className="group/yt inline-flex items-center gap-1">
                    <button
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
                    <YouTubeSearchLink
                      title={g.name}
                      className="opacity-0 pointer-events-none transition-opacity group-hover/yt:opacity-100 group-hover/yt:pointer-events-auto group-focus-within/yt:opacity-100 group-focus-within/yt:pointer-events-auto"
                    />
                  </span>
                );
              })}
            </div>
            <p className="text-muted text-sm">
              {withoutSampleWord(QUIZ_GROUPS.find((g) => g.id === selectedGroup)?.description ?? "")}
            </p>
            {conceptMode ? (
            <p className="text-[13px] text-muted">
              Earnings phrases:{" "}
              <button
                type="button"
                className="underline text-primary"
                onClick={() => setSelectedGroup("earnings-jargon")}
              >
                Earnings desk language
              </button>
              {" · "}
              After Statements Literacy:{" "}
              <button
                type="button"
                className="underline text-primary"
                onClick={() => setSelectedGroup("financial-drills")}
              >
                Statements drills
              </button>{" "}
              · optional snapshot pack
            </p>
            ) : null}
            {groupLocked ? (
              <div className="space-y-2">
                <p className="text-accent-red text-sm">
                  {quizGroupAssetClass(selectedGroup)
                    ? "Locked: Futures, Forex, Crypto, and Options context need a session peek."
                    : "Locked: finish the earlier path step first."}
                </p>
                {quizGroupAssetClass(selectedGroup) ? (
                  <button
                    type="button"
                    className="text-primary underline text-sm"
                    onClick={() => {
                      setChartGateTemporaryBypass(true);
                      setTempBypass(true);
                    }}
                  >
                    Browse this session
                  </button>
                ) : null}
              </div>
            ) : tempBypass && quizGroupAssetClass(selectedGroup) ? (
              <button
                type="button"
                className="text-primary underline text-sm"
                onClick={() => {
                  setChartGateTemporaryBypass(false);
                  setTempBypass(false);
                }}
              >
                Turn off temporary peek
              </button>
            ) : null}
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="border border-line rounded-lg p-4 text-center bg-canvas">
              <p className="text-[12px] text-muted mb-1">Points</p>
              <p className="text-2xl font-semibold tabular-nums">{points}</p>
            </div>
            <div className="border border-line rounded-lg p-4 text-center bg-canvas" title={ANSWER_STREAK_TIP} data-testid="answer-streak">
              <p className="text-[12px] text-muted mb-1">{ANSWER_STREAK_LABEL}</p>
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

          {!isQuizOpen ? (
            <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-surface/95 backdrop-blur-sm">
              <div className="max-w-xl mx-auto px-4 py-3 flex items-center gap-3">
                <p className="flex-1 min-w-0 text-sm truncate">
                  {visibleGroups.find((g) => g.id === selectedGroup)?.name ?? "Quiz"}
                </p>
                <button
                  type="button"
                  onClick={() => setAnswerSheetOpen(true)}
                  className="border border-line text-ink px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-canvas inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-[18px]">assignment</span>
                  Answer sheet
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (groupLocked) return;
                    setQuizStartIndex(undefined);
                    setIsQuizOpen(true);
                  }}
                  disabled={groupLocked}
                  className="bg-primary hover:bg-primary-dim text-white font-semibold px-4 py-2.5 rounded-lg inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span className="material-symbols-outlined">play_arrow</span>
                  {groupLocked ? "Locked" : "Start quiz"}
                </button>
              </div>
            </div>
          ) : null}
        </div>

        </TocGroup>
        <TocGroup id="practice" label="Practice">
        <div className="w-full max-w-xl panel p-4 text-sm space-y-2 scroll-mt-32">
          <h2 className="font-semibold">Practice</h2>
          <div className="flex flex-wrap gap-3">
            <Link to="/academy/options" className="text-primary underline">Options ladder</Link>
            {MISC_PRACTICE_ITEMS.map((item) => (
              <span key={item.id} className="inline-flex items-center gap-1">
                <Link to={item.to} className="text-primary underline">
                  {item.title}
                  {practiceDone(item.id) ? " · done" : ""}
                </Link>
                <YouTubeSearchLink title={item.title} />
              </span>
            ))}
          </div>
        </div>

        </TocGroup>
        <TocGroup id="deep-study" label="Deep Study" aliases={["cases", "coach", "playbooks", "paper", "challenges"]}>
        <section className="w-full max-w-xl space-y-3 scroll-mt-32" aria-labelledby="deep-study-title">
          <h2 id="deep-study-title" className="text-sm font-semibold tracking-tight">Deep Study</h2>
          <section id="cases" className="panel p-4 text-sm space-y-2">
            <h3 className="font-semibold">Cases</h3>
            {showChartGateBanner ? (
              <>
                <p className="text-muted">{CHART_GATE_PREREQ_TIP}</p>
                <button
                  type="button"
                  className="text-primary underline"
                  onClick={() => setSelectedGroup(CHART_GATE_TRAINING_GROUP)}
                >
                  Select Indicators group
                </button>
              </>
            ) : (
              <p className="text-muted">
                Earnings, company news, macro intro, and combined news and statements.
              </p>
            )}
            <div className="flex flex-wrap gap-3">
              <Link to="/cases" className="text-primary underline">Open Cases</Link>
              <Link to="/cases?pack=earnings" className="text-primary underline">Earnings pack</Link>
              <Link to="/cases?pack=company-news" className="text-primary underline">Company news pack</Link>
              <Link to="/cases?pack=macro-news" className="text-primary underline">Macro intro pack</Link>
              <Link to="/cases?pack=combined" className="text-primary underline">Combined pack</Link>
            </div>
          </section>
          <section id="coach" className="panel p-4 text-sm space-y-2">
            <h3 className="font-semibold">Coach</h3>
            <p className="text-muted">Step-by-step coached decisions.</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {listSessions().map((session) => (
                <li key={session.slug}>
                  <Link to={`/coach/${session.slug}`} className="text-primary underline">{session.title}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section id="playbooks" className="panel p-4 text-sm space-y-2">
            <h3 className="font-semibold">Playbooks</h3>
            <p className="text-muted">Setups written as plans: entry, stop, target.</p>
            <ul className="flex flex-wrap gap-x-4 gap-y-2">
              {listPlaybooks().map((playbook) => (
                <li key={playbook.id}>
                  <Link to={`/playbooks/${playbook.id}`} className="text-primary underline">{playbook.title}</Link>
                </li>
              ))}
            </ul>
          </section>
          <section id="paper" className="panel p-4 text-sm space-y-2">
            <h3 className="font-semibold">Paper trading</h3>
            <p className="text-muted">SIMULATED orders with stops and brackets.</p>
            <Link to="/paper" className="text-primary underline">Open paper trading</Link>
          </section>
          <section id="challenges" className="panel p-4 text-sm space-y-2">
            <h3 className="font-semibold">Challenges</h3>
            <p className="text-muted">Scored challenges: discipline first, result second.</p>
            <Link to="/paper/challenges" className="text-primary underline">Open challenges</Link>
          </section>
        </section>

        </TocGroup>
        <TocGroup id="other-factors" label="Other factors" aliases={["financials", "macro"]}>
        <section className="w-full max-w-xl space-y-3 scroll-mt-32" aria-labelledby="other-factors-title">
          <h2 id="other-factors-title" className="text-sm font-semibold tracking-tight">Other factors</h2>
          <div id="financials" className="scroll-mt-32">
            <FinancialsTrainingCard onSelectGroup={setSelectedGroup} />
          </div>
          <div id="macro" className="scroll-mt-32">
            <MacroTrainingCard onSelectGroup={setSelectedGroup} />
          </div>
        </section>
        </TocGroup>
        <TocGroup id="quick-decisions" label="Quick Decisions" aliases={["charts", "buy-or-sell"]}>
        <section className="w-full max-w-xl space-y-3 scroll-mt-32" aria-labelledby="quick-decisions-title">
          <h2 id="quick-decisions-title" className="text-sm font-semibold tracking-tight">Quick Decisions</h2>
          <section id="charts" className="panel p-4 text-sm space-y-2">
            <h3 className="font-semibold">Charts</h3>
            <p className="text-muted">SIMULATED and sample charts with indicators and drawing.</p>
            <div className="flex flex-wrap gap-3">
              <Link to="/market" className="text-primary underline">Open Charts</Link>
              <Link to="/market?nav=1" className="text-primary underline">Market navigator</Link>
            </div>
          </section>
          <section id="buy-or-sell" className="panel p-4 text-sm space-y-2" aria-labelledby="buy-sell-title">
            <h3 id="buy-sell-title" className="font-semibold">Buy or Sell?</h3>
            <p className="text-muted">
              Read the candles and choose Buy, Sell, or Wait. {getQuestionsForGroup("buy-or-sell").length} questions.
              Learning drill, not trading advice.
            </p>
            <button
              type="button"
              onClick={() => {
                setSelectedGroup("buy-or-sell");
                setQuizStartIndex(undefined);
                setIsQuizOpen(true);
              }}
              className="bg-primary hover:bg-primary-dim text-white font-semibold px-4 py-2 rounded-lg inline-flex items-center gap-1"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              Start Buy or Sell?
            </button>
          </section>
        </section>
        </TocGroup>
        </PanelCarousel>
      </main>

      <footer className="relative max-w-5xl mx-auto px-4 py-8 pr-14 flex items-center justify-between border-t border-line mt-8 w-full text-sm text-muted">
        <div className="flex gap-6">
          <Link to="/archive" className="hover:text-ink">
            Library
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
        <SampleDataNote />
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
