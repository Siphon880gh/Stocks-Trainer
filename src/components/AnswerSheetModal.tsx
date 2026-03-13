import { useEffect } from "react";
import { getQuestionsForGroup, QUIZ_GROUPS, type QuizGroupId } from "../lib/quizData";
import { PATTERN_OHLC, SAMPLE_OHLC } from "../lib/ohlcData";
import CandlestickChart from "./CandlestickChart";
import MarketChart from "./MarketChart";

interface AnswerSheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPracticeQuestion?: (index: number, groupId?: QuizGroupId) => void;
  groupId?: QuizGroupId;
}

export default function AnswerSheetModal({ isOpen, onClose, onPracticeQuestion, groupId = "all" }: AnswerSheetModalProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="answer-sheet-title"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />
      <div className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden bg-background-dark border-2 border-primary/50 rounded-xl shadow-2xl shadow-primary/20">
        <div className="flex items-center justify-between px-4 py-3 border-b border-primary/30 bg-neutral-dark/80 sticky top-0">
          <h2 id="answer-sheet-title" className="text-lg font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined">assignment</span>
            Quiz Answer Sheet
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded hover:bg-primary/10 text-primary transition-colors"
            aria-label="Close"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(85vh-60px)] space-y-4">
          <p className="text-primary/60 text-xs mb-1">
            Reference only. Do not use during the quiz.
          </p>
          <p className="text-primary/50 text-xs mb-4">
            Click any question to open the quiz and practice that one for repetition.
          </p>
          {groupId === "all"
            ? (() => {
                const allQuestions = getQuestionsForGroup("all");
                return QUIZ_GROUPS.filter((g) => g.id !== "all").map((group) => {
                  const groupQuestions = getQuestionsForGroup(group.id as Exclude<QuizGroupId, "all">);
                  return (
                    <div key={group.id} className="space-y-3">
                      <h3 className="text-sm font-bold text-primary/80 uppercase tracking-wider flex items-center gap-2">
                        {group.icon && <span className="material-symbols-outlined text-base">{group.icon}</span>}
                        {group.name}
                      </h3>
                      {groupQuestions.map((q, i) => {
                        const opt = q.options.find((o) => o.id === q.correctAnswer);
                        const label = opt?.label ?? q.correctAnswer;
                        const globalIdx = allQuestions.findIndex((gq) => gq.id === q.id);
                        return (
                          <button
                            key={q.id}
                            type="button"
                            onClick={() => onPracticeQuestion?.(i, group.id as QuizGroupId)}
                            className="w-full text-left border border-primary/30 rounded-xl overflow-hidden bg-neutral-dark/40 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                          >
                            <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20 bg-neutral-dark/60 group-hover:bg-primary/10">
                              <span className="text-xs font-mono text-primary/70">Q{i + 1} · {q.id}</span>
                              <span className="font-bold text-primary flex items-center gap-2">
                                {q.correctAnswer}: {label}
                                {onPracticeQuestion && (
                                  <span className="text-xs font-normal text-primary/60">— Click to practice</span>
                                )}
                              </span>
                            </div>
                            <div className="p-4">
                              {q.overlayId ? (
                                <MarketChart
                                  data={SAMPLE_OHLC}
                                  height={180}
                                  showSMA={q.overlayId === "sma"}
                                  showEMA={q.overlayId === "ema"}
                                  showRSI={q.overlayId === "rsi"}
                                  showMACD={q.overlayId === "macd"}
                                  showBollinger={q.overlayId === "bollinger"}
                                />
                              ) : (
                                <CandlestickChart
                                  data={PATTERN_OHLC[q.patternKey ?? "hammer"] ?? PATTERN_OHLC.hammer}
                                  height={180}
                                  highlightIndex={q.highlightIndex ?? 2}
                                />
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  );
                });
              })()
            : getQuestionsForGroup(groupId).map((q, i) => {
                const opt = q.options.find((o) => o.id === q.correctAnswer);
                const label = opt?.label ?? q.correctAnswer;
                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => onPracticeQuestion?.(i, groupId)}
                    className="w-full text-left border border-primary/30 rounded-xl overflow-hidden bg-neutral-dark/40 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer group"
                  >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-primary/20 bg-neutral-dark/60 group-hover:bg-primary/10">
                      <span className="text-xs font-mono text-primary/70">Q{i + 1} · {q.id}</span>
                      <span className="font-bold text-primary flex items-center gap-2">
                        {q.correctAnswer}: {label}
                        {onPracticeQuestion && (
                          <span className="text-xs font-normal text-primary/60">— Click to practice</span>
                        )}
                      </span>
                    </div>
                    <div className="p-4">
                      {q.overlayId ? (
                        <MarketChart
                          data={SAMPLE_OHLC}
                          height={180}
                          showSMA={q.overlayId === "sma"}
                          showEMA={q.overlayId === "ema"}
                          showRSI={q.overlayId === "rsi"}
                          showMACD={q.overlayId === "macd"}
                          showBollinger={q.overlayId === "bollinger"}
                        />
                      ) : (
                        <CandlestickChart
                          data={PATTERN_OHLC[q.patternKey ?? "hammer"] ?? PATTERN_OHLC.hammer}
                          height={180}
                          highlightIndex={q.highlightIndex ?? 2}
                        />
                      )}
                    </div>
                  </button>
                );
              })}
        </div>
      </div>
    </div>
  );
}
