import { useState, useEffect, useCallback } from "react";
import { cn } from "../lib/utils";
import {
  getQuestionsForGroup,
  POINTS_PER_CORRECT,
  STREAK_BONUS,
  type QuizGroupId,
} from "../lib/quizData";
import { PATTERN_OHLC, SAMPLE_OHLC } from "../lib/ohlcData";
import CandlestickChart from "./CandlestickChart";
import MarketChart from "./MarketChart";

interface QuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPoints?: number;
  initialStreak?: number;
  onPointsUpdate?: (points: number, streak: number, accuracy: number) => void;
  startIndex?: number;
  groupId?: QuizGroupId;
}

export default function QuizModal({
  isOpen,
  onClose,
  initialPoints = 0,
  initialStreak = 0,
  onPointsUpdate,
  startIndex = 0,
  groupId = "all",
}: QuizModalProps) {
  const questions = getQuestionsForGroup(groupId);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<"A" | "B" | "C" | "D" | "E" | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [points, setPoints] = useState(initialPoints);
  const [streak, setStreak] = useState(initialStreak);
  const [correctCount, setCorrectCount] = useState(0);
  const [totalAnswered, setTotalAnswered] = useState(0);

  const question = questions[currentIndex];
  const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;

  const handleSubmit = useCallback(() => {
    if (!selectedOption || submitted) return;

    setSubmitted(true);

    const correct = selectedOption === question.correctAnswer;
    const newStreak = correct ? streak + 1 : 0;
    const newPoints = correct
      ? points + POINTS_PER_CORRECT + (newStreak > 1 ? STREAK_BONUS : 0)
      : points;
    const newCorrectCount = correct ? correctCount + 1 : correctCount;
    const newTotalAnswered = totalAnswered + 1;
    const newAccuracy = Math.round((newCorrectCount / newTotalAnswered) * 100);

    setPoints(newPoints);
    setStreak(newStreak);
    setCorrectCount(newCorrectCount);
    setTotalAnswered(newTotalAnswered);
    onPointsUpdate?.(newPoints, newStreak, newAccuracy);
  }, [selectedOption, submitted, question, streak, points, correctCount, totalAnswered, onPointsUpdate]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setSubmitted(false);
    } else {
      onClose();
    }
  }, [currentIndex, questions.length, onClose]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  useEffect(() => {
    if (isOpen) {
      const qs = getQuestionsForGroup(groupId);
      const idx = Math.min(Math.max(0, startIndex), Math.max(0, qs.length - 1));
      setCurrentIndex(idx);
      setSelectedOption(null);
      setSubmitted(false);
      setPoints(initialPoints);
      setStreak(initialStreak);
      setCorrectCount(0);
      setTotalAnswered(0);
    }
  }, [isOpen, startIndex, groupId]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="quiz-modal-title"
    >
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={currentIndex === questions.length - 1 && submitted ? handleClose : undefined}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-background-dark border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 border-b border-primary/20 bg-background-dark/95 backdrop-blur-sm">
          <h2 id="quiz-modal-title" className="text-sm font-bold text-primary uppercase tracking-widest">
            Pattern Recognition Quiz
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-xs font-mono text-primary/70">
              {currentIndex + 1} / {questions.length}
            </span>
            <span className="text-xs font-bold text-primary">{points} PTS</span>
            <span className="text-xs text-primary/70">Streak: {streak}</span>
            <button
              onClick={handleClose}
              className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
              aria-label="Close quiz"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
        </div>

        {/* Quiz Content */}
        <div className="p-6 space-y-6">
          {/* Question */}
          <div className="bg-neutral-dark/80 border border-primary/30 rounded-xl p-6">
            <span className="text-xs font-mono text-primary/40">MODULE_ID: {question.id}</span>
            <h3 className="text-xl font-bold mt-2 mb-2">Identify the Signal</h3>
            <p className="text-slate-400">{question.prompt}</p>
          </div>

          {/* Chart Snippet */}
          <div className="bg-background-dark border-2 border-primary/40 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/30 bg-neutral-dark/80">
              <div className="flex gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500/50" />
                <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                <div className="w-2 h-2 rounded-full bg-green-500/50" />
              </div>
              <span className="text-[10px] font-mono text-primary/50 tracking-widest uppercase">
                Live_Chart_Feed // BTCUSD_1H
              </span>
            </div>
            <div className="relative h-[300px] w-full bg-background-dark p-4">
              {question.overlayId ? (
                <MarketChart
                  data={SAMPLE_OHLC}
                  height={260}
                  showSMA={question.overlayId === "sma"}
                  showEMA={question.overlayId === "ema"}
                  showRSI={question.overlayId === "rsi"}
                  showMACD={question.overlayId === "macd"}
                  showBollinger={question.overlayId === "bollinger"}
                />
              ) : (
                <CandlestickChart
                  data={PATTERN_OHLC[question.patternKey ?? "hammer"] ?? PATTERN_OHLC.hammer}
                  height={260}
                  highlightIndex={question.highlightIndex ?? 2}
                />
              )}
            </div>
          </div>

          {/* Options */}
          <div className={cn(
            "grid gap-4",
            question.options.length <= 3 ? "grid-cols-1 md:grid-cols-3" : "grid-cols-1 md:grid-cols-5"
          )}>
            {question.options.map((opt) => (
              <QuizOptionButton
                key={opt.id}
                option={opt}
                selected={selectedOption === opt.id}
                submitted={submitted}
                correctAnswer={question.correctAnswer}
                onSelect={() => !submitted && setSelectedOption(opt.id)}
              />
            ))}
          </div>

          {/* Feedback */}
          {submitted && (
            <div
              className="bg-neutral-dark/80 border border-primary/30 rounded-xl p-6 font-mono text-sm space-y-2"
              role="status"
              aria-live="polite"
            >
              <div className="flex gap-2">
                <span className="text-primary opacity-50">&gt;</span>
                <p className={selectedOption === question.correctAnswer ? "text-primary" : "text-accent-red"}>
                  {selectedOption === question.correctAnswer ? "CORRECT" : "INCORRECT"}
                </p>
              </div>
              <div className="flex gap-2">
                <span className="text-primary opacity-50">&gt;</span>
                <p className="text-slate-300 italic">"{question.explanation}"</p>
              </div>
              {selectedOption === question.correctAnswer && (
                <div className="flex gap-2">
                  <span className="text-primary opacity-50">&gt;</span>
                  <p className="text-primary">
                    +{POINTS_PER_CORRECT}
                    {streak > 1 ? ` +${STREAK_BONUS} streak bonus` : ""} PTS
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-4">
            {!submitted ? (
              <button
                onClick={handleSubmit}
                disabled={!selectedOption}
                className={cn(
                  "flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-lg flex items-center justify-center gap-2 transition-all",
                  !selectedOption && "opacity-50 cursor-not-allowed"
                )}
              >
                SUBMIT ANALYSIS
                <span className="material-symbols-outlined">bolt</span>
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex-1 bg-primary hover:bg-primary/90 text-background-dark font-bold py-4 rounded-lg flex items-center justify-center gap-2"
              >
                {currentIndex < questions.length - 1 ? "NEXT QUESTION" : "FINISH"}
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function QuizOptionButton({
  option,
  selected,
  submitted,
  correctAnswer,
  onSelect,
}: {
  option: { id: "A" | "B" | "C" | "D" | "E"; label: string; description: string };
  selected: boolean;
  submitted: boolean;
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  onSelect: () => void;
}) {
  const isCorrect = option.id === correctAnswer;
  const showCorrect = submitted && isCorrect;
  const showIncorrect = submitted && selected && !isCorrect;

  return (
    <button
      onClick={onSelect}
      disabled={submitted}
      title={option.description}
      className={cn(
        "group relative flex flex-col items-start p-6 rounded-lg transition-all text-left",
        showCorrect && "bg-primary/20 border-2 border-primary",
        showIncorrect && "bg-accent-red/10 border-2 border-accent-red",
        !submitted && selected && "bg-primary/10 border-2 border-primary shadow-[0_0_15px_rgba(56,255,20,0.1)]",
        !submitted && !selected && "bg-neutral-dark/60 border border-primary/30 hover:border-primary hover:bg-neutral-dark/80"
      )}
    >
      <span
        className={cn(
          "text-xs font-mono mb-2",
          selected ? "text-primary" : "text-primary/40"
        )}
      >
        OPTION_{option.id} {selected && "[SELECTED]"}
      </span>
      <span className={cn("text-lg font-bold", selected && "text-primary")}>{option.label}</span>
      <p
        className={cn(
          "text-sm mt-1 transition-opacity",
          selected ? "text-primary/60" : "text-slate-400 opacity-0 group-hover:opacity-100"
        )}
      >
        {option.description}
      </p>
      <div
        className={cn(
          "absolute bottom-4 right-4 transition-all",
          selected ? "text-primary" : "text-primary opacity-20 group-hover:opacity-100"
        )}
      >
        {showCorrect && <span className="material-symbols-outlined text-primary">check_circle</span>}
        {showIncorrect && <span className="material-symbols-outlined text-accent-red">cancel</span>}
        {!submitted && <span className="material-symbols-outlined">{selected ? "check_circle" : "chevron_right"}</span>}
      </div>
    </button>
  );
}
