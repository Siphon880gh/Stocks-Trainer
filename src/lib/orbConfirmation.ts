/** Stock-first ORB context lessons. All prices/tapes are SIMULATED, not video trade reproductions.
 * Source evidence and selection decisions: docs/projects/content-graph/ORB-VIDEO.md.
 * Only type imports: safe for quiz/glossary/chart registries without runtime cycles. */
import type { OHLC } from "./ohlcData";
import type { ChartAnnotations } from "./chartAnnotations";
import type { QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";
import type { WalkthroughStep } from "./tourProgress";

export const ORB_VIDEO = {
  title: "The MOST Popular Day Trading Strategy on the Internet Explained (ORB Model)",
  creator: "Peachy Investor",
  watchUrl: "https://www.youtube.com/watch?v=UI-N7X15bFo",
  embedUrl: "https://www.youtube-nocookie.com/embed/UI-N7X15bFo",
  channelUrl: "https://www.youtube.com/channel/UCr9PVIuy5OEsu8QxqQ5AaVg",
};
export const ORB_MOMENTS = [
  { seconds: 656, label: "10:56 · Build the range from completed candles", text: "Three 5-minute candles form a 15-minute opening range. The range window and the entry chart timeframe are separate choices." },
  { seconds: 780, label: "13:00 · A close outside can still fail", text: "A candle close beyond a boundary is evidence, not a promise. Re-entry into the range challenges the breakout thesis." },
  { seconds: 1129, label: "18:49 · Layer 15- and 30-minute context", text: "Keep the completed 15-minute boundaries while waiting for the first 30 minutes to finish. More waiting means more context, but can miss an early move." },
  { seconds: 1228, label: "20:28 · Reactions, midpoint and structure", text: "The midpoint is (high + low) / 2. Higher lows or lower highs help frame a reaction; midpoint and opposite boundary are reference targets, not guaranteed destinations." },
  { seconds: 1313, label: "21:53 · Retest or failed break?", text: "A break, retest, higher support and a renewed high break tells a different story from a return inside followed by a lower high." },
  { seconds: 1583, label: "26:23 · Bearish midpoint rejection", text: "After a move down, a rejected midpoint and lower high can frame a bearish continuation idea. Measure risk from the actual entry to the structural invalidation." },
];
export type RangeMinutes = 15 | 30;
/** Input is a contiguous, completed 5-minute cash-session tape starting at the open.
 * Never includes future bars. Returns null until the selected window has completed. */
export function completedOrb(bars: OHLC[], minutes: RangeMinutes) {
  const count = minutes / 5;
  if (![15, 30].includes(minutes) || bars.length < count) return null;
  const first = bars.slice(0, count);
  if (first.some(b => !Number.isFinite(b.high) || !Number.isFinite(b.low) || b.high < b.low)) return null;
  const high = Math.max(...first.map(b => b.high));
  const low = Math.min(...first.map(b => b.low));
  return { high, low, midpoint: (high + low) / 2, width: high - low, count };
}
export function contextAnnotations(bars: OHLC[], minutes: RangeMinutes): ChartAnnotations {
  const r = completedOrb(bars, minutes);
  if (!r) return {};
  return {
    zones: [{ fromIndex: r.count - 1, top: r.high, bottom: r.low, label: `${minutes}m range`, tone: "neutral" }],
    levels: [{ price: r.midpoint, label: `${minutes}m midpoint`, tone: "neutral" }],
  };
}
/** Hypothetical share sizing, including an adverse execution/cost allowance per share.
 * Buying power is a notional cap, not permission to short. Shorting also needs borrow/margin approval. */
export function stockOrbRisk(side: "long" | "short", entry: number, stop: number, target: number, budget: number, buyingPower: number, allowance = 0.05) {
  if (![entry, stop, target, budget, buyingPower, allowance].every(Number.isFinite)
    || Math.min(entry, stop, target, budget, buyingPower) <= 0 || allowance < 0) return null;
  const risk = side === "long" ? entry - stop : stop - entry;
  const reward = side === "long" ? target - entry : entry - target;
  if (risk <= 0 || reward <= allowance) return null;
  const plannedRisk = risk + allowance;
  const shares = Math.min(Math.floor(budget / plannedRisk), Math.floor(buyingPower / entry));
  return { risk, reward, plannedRisk, shares, dollarsAtRisk: shares * plannedRisk, rewardRisk: (reward - allowance) / plannedRisk };
}
const b = (i: number, o: number, h: number, l: number, c: number): OHLC => ({
  name: `${6 + Math.floor((30 + i * 5) / 60)}:${String((30 + i * 5) % 60).padStart(2, "0")}`, open: o, high: h, low: l, close: c,
});
// Clock labels are bar START times, Pacific. 06:30 is the US equity cash-session open.
const opening = [b(0,100,101,99,100.5), b(1,100.5,102,100,101.5), b(2,101.5,101.8,100.5,101)];
export interface OrbContextCase {
  id: string; title: string; bars: OHLC[]; decision: number;
  answer: "retest" | "failure" | "midpoint";
  explanation: string; outcome: string;
  side: "long" | "short"; entry: number; stop: number; target: number;
}
export const ORB_CONTEXT_CHOICES = [
  { id: "retest", label: "Breakout retest holds; renewed high break" },
  { id: "failure", label: "Failed upside break; lower high inside the range" },
  { id: "midpoint", label: "Bearish midpoint rejection; lower high" },
] as const;
export const ORB_CONTEXT_CASES: OrbContextCase[] = [
  { id: "orb-context-retest", title: "Do not buy the first push blindly", bars: [...opening,
    b(3,101,102.8,100.9,102.6), b(4,102.6,103,102.2,102.4), b(5,102.4,102.6,102.1,102.3),
    b(6,102.3,103.4,102.2,103.2), b(7,103.2,104.8,103,104.6), b(8,104.6,105,101.7,102)],
    decision: 6, answer: "retest", side: "long", entry: 103.2, stop: 101.9, target: 104.5,
    explanation: "The 15-minute high is 102. The first break closes at 102.60, then the retest holds above 102 and price closes through the prior 103 high. A stop below the retest low expresses a different thesis from a stop at the range low 99. Neither stop is universally best.",
    outcome: "The next candle reaches the illustrative 104.50 target, then a later candle falls below the retest. This teaches a process, not a promise that confirmation prevents losses." },
  { id: "orb-context-failure", title: "A close outside is not enough", bars: [...opening,
    b(3,101,102.7,100.9,102.5), b(4,102.5,102.6,100.8,101.2), b(5,101.2,101.9,101,101.5),
    b(6,101.5,101.6,100.5,100.7), b(7,100.7,100.9,99.2,99.4), b(8,99.4,102.2,99.1,102)],
    decision: 6, answer: "failure", side: "short", entry: 100.7, stop: 102, target: 99,
    explanation: "The close above 102 returns inside. The bounce tops at 101.90, below the earlier 102.70 high, then price breaks the bounce low. That challenges a continuation long. From flat, waiting is valid; a short needs its own risk and borrow plan.",
    outcome: "The midpoint at 100.50 trades, but the range low 99 is NOT reached before price later trades through 102. Reference targets are not guaranteed; a short held for 99 would lose at its planned stop, before execution costs." },
  { id: "orb-context-midpoint", title: "Reject the midpoint after a leg down", bars: [...opening,
    b(3,101,101.2,98.5,98.8), b(4,98.8,100.3,98.6,100), b(5,100,100.4,99.4,99.6),
    b(6,99.6,99.8,98.8,98.9), b(7,98.9,99.2,98,98.2), b(8,98.2,98.6,97.7,98)],
    decision: 5, answer: "midpoint", side: "short", entry: 99.6, stop: 100.5, target: 99,
    explanation: "The completed 15-minute range is 99–102, midpoint 100.50. The bounce after the selloff reaches only 100.40 and closes lower: a lower high, not a fresh bullish breakout. Targeting 99 from 99.60 leaves less reward than the 0.90 stop risk even before costs. Skipping can be the better plan.",
    outcome: "Price later trades through 99, but that winning example does not make the small reward relative to risk attractive. Score the plan before seeing the result." },
];
export const ORB_CONTEXT_OHLC = Object.fromEntries(ORB_CONTEXT_CASES.map(s => [s.id, s.bars.slice(0, s.decision + 1)]));
export const ORB_CONTEXT_TOUR: WalkthroughStep[] = [
  { id: "window", title: "A window is not a candle timeframe", target: "orb-context-chart", body: "These SIMULATED candles each last five minutes. Three completed candles form the 15-minute range. At two candles there is no completed range. The clock shows Pacific bar start times." },
  { id: "freeze", title: "Freeze the completed range", target: "orb-context-chart", body: "At three candles the 15-minute range is 99–102. Later highs cannot move it. Select 30 minutes to see why that separate range is not yet ready. Never use its eventual high or low to judge an earlier trade." },
  { id: "break", title: "The first close is evidence, not certainty", target: "orb-context-chart", body: "A close over 102 is the initial break. It can still fail. We have not yet seen a retest; entering now and entering after confirmation are different plans." },
  { id: "retest", title: "Wait for higher support", target: "orb-context-chart", body: "The pullback holds above the 15-minute high, making a higher low. This adds evidence without guaranteeing a continuation. Waiting can also mean missing a move." },
  { id: "confirm", title: "A renewed high break", target: "orb-context-chart", body: "Price now closes through the prior 103 high. Compare structural risk with the much wider full-range stop. Use the risk panel after locking your answer; do not increase size just because the chart looks convincing." },
];
export const ORB_CONTEXT_FRAMES = [2, 3, 4, 6, 7];
export const ORB_CONTEXT_TERMS: LiteracyTerm[] = [
  { id: "orb-midpoint", name: "Opening range midpoint", category: "process", summary: "Halfway between the completed opening range high and low.", detail: "Compute (high + low) / 2, not half the high. It can be a reaction area or reference target inside the range, not automatic support or resistance. Practice the 15/30-minute context lab at Practice → Opening range breakout." },
  { id: "orb-failed-break", name: "Failed opening range break", category: "process", summary: "Price leaves the opening range, then returns inside instead of holding beyond the boundary.", detail: "Even a close outside can fail. A lower high after an upside failure, or higher low after a downside failure, can change the hypothesis. Range rotation toward midpoint or the other edge is possible, not guaranteed. Wait or skip unless a separate entry, invalidation and risk plan exists." },
];
const q = (id: string, prompt: string, labels: string[], explanation: string, glossaryTermId: string, patternKey?: string): QuizQuestion => {
  const ids = ["A", "B", "C", "D"] as const;
  const at = Number(id.slice(-2)) % 4;
  const arranged = labels.filter((_, i) => i !== 1);
  arranged.splice(at, 0, labels[1]);
  return { id, prompt, correctAnswer: ids[at], options: arranged.map((label, i) => ({ id: ids[i], label, description: "" })), explanation, glossaryTermId,
    ...(patternKey ? { patternKey, chartSize: "large" as const } : {}) };
};
export const ORB_CONTEXT_QUESTIONS: QuizQuestion[] = [
  q("ORB-15", "On a 5-minute chart, when is the first 15-minute stock opening range complete?", ["After two candles", "After three completed candles from the cash-session open", "After any breakout", "After the entire morning"], "Range duration and chart timeframe are separate. Three times five is fifteen; do not use later bars to redraw this range.", "opening-range"),
  q("ORB-16", "A completed 15-minute range has high 102 and low 99. Where is its midpoint?", ["51", "100.50", "1.50", "101"], "(102 + 99) / 2 = 100.50. This is a reference area, not a promised target.", "orb-midpoint"),
  q("ORB-17", "SIMULATED 5-minute candles (Pacific). After the first three candles, which evidence supports a confirmed retest hypothesis?", ["The first wick above 102 alone", "Retest holds above 102, then price closes through the prior high 103", "A completed 30-minute range predicted the earlier break", "The setup cannot lose now"], ORB_CONTEXT_CASES[0].explanation, "breakout-retest", "orb-context-retest"),
  q("ORB-18", "SIMULATED 5-minute candles (Pacific). A close above 102 returns inside, bounces to a lower high, then falls. What changed?", ["The long is guaranteed because it once closed outside", "The failed upside break challenges continuation; a new trade needs its own plan", "The range high should move to the breakout high", "Short at any price with no stop"], ORB_CONTEXT_CASES[1].explanation, "orb-failed-break", "orb-context-failure"),
  q("ORB-19", "SIMULATED short: entry 99.60, stop 100.50, first target 99. What does reward versus risk say before costs?", ["3R reward", "0.60 reward / 0.90 risk, less than 1R; skipping is valid", "The midpoint guarantees profit", "Use a larger position to fix the ratio"], "A chart reaction can look sensible while the remaining reward is poor. Costs lower the ratio further.", "risk-reward", "orb-context-midpoint"),
  q("ORB-20", "Twenty minutes after the cash open, can you use the final first-30-minute high and low?", ["Yes, because the first 15 minutes finished", "No: the 30-minute window is incomplete; using its final extremes is lookahead", "Yes, if the breakout wins later", "Only on a 1-minute chart"], "Use only completed information available at that decision. A completed 15-minute range is available, but the eventual 30-minute range is not.", "opening-range"),
  q("ORB-21", "SIMULATED shares: $100 risk budget, $1 entry-to-stop distance, $0.05 per-share execution allowance, $5,000 buying power, $100 entry. Maximum illustrative shares?", ["100", "50, capped by buying power", "95 regardless of buying power", "Double size when levels align"], "Risk cap floor(100 / 1.05) = 95 shares. Notional cap floor(5000 / 100) = 50 shares. Use the smaller cap; real gaps can exceed the allowance.", "position-sizing"),
  q("ORB-22", "Price remains inside the opening range well after the open. What can you infer?", ["It must stay range-bound all day", "Range conditions are a working hypothesis; reassess on new evidence", "The midpoint is a guaranteed fill", "Short every touch of the high"], "The video's inside/outside framework is contextual, not a reliable all-day forecast. Paper-test rules across trending and choppy sessions after costs.", "orb-failed-break"),
];
