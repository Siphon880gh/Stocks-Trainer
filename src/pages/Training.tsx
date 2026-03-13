import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import QuizModal from "../components/QuizModal";
import AnswerSheetModal from "../components/AnswerSheetModal";
import { QUIZ_GROUPS, getQuestionsForGroup, type QuizGroupId } from "../lib/quizData";

export default function Training() {
  const [searchParams] = useSearchParams();
  const groupParam = searchParams.get("group") as QuizGroupId | null;
  const startParam = searchParams.get("start");
  const [selectedGroup, setSelectedGroup] = useState<QuizGroupId>(groupParam && QUIZ_GROUPS.some((g) => g.id === groupParam) ? groupParam : "indicators");
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizStartIndex, setQuizStartIndex] = useState<number | undefined>(undefined);
  const [answerSheetOpen, setAnswerSheetOpen] = useState(false);
  const [points, setPoints] = useState(0);
  const [streak, setStreak] = useState(0);
  const [accuracy, setAccuracy] = useState(0);

  useEffect(() => {
    if (groupParam && QUIZ_GROUPS.some((g) => g.id === groupParam)) {
      setSelectedGroup(groupParam);
    }
  }, [groupParam]);

  useEffect(() => {
    if (startParam === "1") {
      setIsQuizOpen(true);
    }
  }, [startParam]);

  return (
    <div className="bg-background-dark font-display text-slate-100 min-h-screen flex flex-col">
      {/* Top Navigation / Progress Bar */}
      <nav className="border-b border-primary/30 bg-background-dark/95 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-primary rounded flex items-center justify-center">
              <span className="material-symbols-outlined text-background-dark text-sm">psychology</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight">
              TRAINING<span className="text-primary">TERMINAL</span>
            </h1>
          </Link>
          <div className="flex items-center gap-6">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-[10px] uppercase tracking-widest text-primary/60 font-bold">
                Session Progress
              </span>
              <div className="w-48 h-1.5 bg-primary/10 rounded-full mt-1 overflow-hidden">
                <div className="h-full bg-primary shadow-[0_0_10px_#38ff14]" style={{ width: `${accuracy}%` }} />
              </div>
            </div>
            <div className="flex items-center gap-2 bg-primary/10 border border-primary/30 px-3 py-1.5 rounded">
              <span className="material-symbols-outlined text-primary text-sm">stars</span>
              <span className="font-bold text-primary">{points} PTS</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-4 py-8 flex-1 flex flex-col items-center justify-center">
        {/* Quiz Launch Card */}
        <div className="w-full max-w-xl border-neon p-8 bg-neutral-dark/60 rounded-xl space-y-6">
          <div className="flex items-center gap-4">
            <span className="material-symbols-outlined text-5xl text-primary">quiz</span>
            <div>
              <h2 className="text-2xl font-bold text-primary crt-glow">Pattern Recognition Quiz</h2>
              <p className="text-slate-400 text-sm mt-1">
                Identify candlestick patterns on historical chart snapshots to earn points.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">Test Group</h3>
            <div className="flex flex-wrap gap-2">
              {QUIZ_GROUPS.map((g) => {
                const isIndicators = g.id === "indicators";
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGroup(g.id)}
                    className={`px-4 py-2 rounded-lg font-mono text-sm font-bold transition-all flex items-center gap-2 ${
                      selectedGroup === g.id
                        ? "bg-primary text-background-dark"
                        : isIndicators
                          ? "border-2 border-primary bg-primary/10 text-primary hover:bg-primary/20 shadow-[0_0_12px_rgba(56,255,20,0.2)]"
                          : "border border-primary/40 text-primary hover:bg-primary/10"
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
            <p className="text-primary/50 text-xs">
              {QUIZ_GROUPS.find((g) => g.id === selectedGroup)?.description}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-neutral-dark/80 border border-primary/30 rounded-lg p-4 text-center">
              <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-1">Points</p>
              <p className="text-2xl font-bold text-primary">{points}</p>
            </div>
            <div className="bg-neutral-dark/80 border border-primary/30 rounded-lg p-4 text-center">
              <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-1">Streak</p>
              <p className="text-2xl font-bold text-primary flex items-center justify-center gap-1">
                <span className="material-symbols-outlined text-primary text-xl">local_fire_department</span>
                {streak}
              </p>
            </div>
            <div className="bg-neutral-dark/80 border border-primary/30 rounded-lg p-4 text-center">
              <p className="text-[10px] text-primary/60 uppercase tracking-widest mb-1">Accuracy</p>
              <p className="text-2xl font-bold text-primary">{accuracy}%</p>
            </div>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => {
                setQuizStartIndex(undefined);
                setIsQuizOpen(true);
              }}
              className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-transform active:scale-[0.98]"
            >
              <span className="material-symbols-outlined">play_arrow</span>
              START QUIZ
            </button>
            {!isQuizOpen && (
              <button
                onClick={() => setAnswerSheetOpen(true)}
                className="border border-primary/40 text-primary px-6 py-4 rounded-lg font-bold hover:bg-primary/10 flex items-center justify-center gap-2 transition-colors"
              >
                <span className="material-symbols-outlined">assignment</span>
                ANSWER SHEET
              </button>
            )}
          </div>
        </div>
      </main>

      <footer className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-between border-t border-primary/10 mt-12 opacity-60 w-full">
        <div className="flex gap-6">
          <Link to="/archive" className="text-xs font-mono hover:text-primary transition-colors uppercase tracking-widest">
            Documentation
          </Link>
          {!isQuizOpen && (
            <button
              onClick={() => setAnswerSheetOpen(true)}
              className="text-xs font-mono hover:text-primary transition-colors uppercase tracking-widest"
            >
              Answer Sheet
            </button>
          )}
          <button className="text-xs font-mono hover:text-primary transition-colors uppercase tracking-widest">
            Shortcuts
          </button>
          <button className="text-xs font-mono hover:text-primary transition-colors uppercase tracking-widest">
            Support
          </button>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-tighter text-right">
          V 2.0.4 // SECURE CONNECTION STABLE
        </div>
      </footer>

      <QuizModal
        isOpen={isQuizOpen}
        onClose={() => setIsQuizOpen(false)}
        initialPoints={points}
        initialStreak={streak}
        startIndex={quizStartIndex}
        groupId={selectedGroup}
        onPointsUpdate={(p, s, a) => {
          setPoints(p);
          setStreak(s);
          setAccuracy(a);
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
