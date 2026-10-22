/**
 * BA3.M1: placement check. 12 original items tagged by level (L0–L4) and routing to a start level.
 *
 * Routing rule (monotone by construction):
 * - A level is passed when at least PASS_SHARE (2/3, rounded up) of its items are correct.
 * - Start level = the first of L0, L1, L2, L3 that is not passed; if all four are passed, L4.
 * - Placement never routes past L4: options (L6) and other markets (L7) always need their own test-out.
 * - "I'm brand new" skips the check and starts at L0.
 * Answering more items correctly can only pass more levels, so it never routes lower.
 */
import type { AnswerLetter, LevelId, PlacementItem, QuizChoice } from "./types";

const LETTERS: AnswerLetter[] = ["A", "B", "C", "D"];

function item(n: number, levelId: LevelId, unitId: string, prompt: string, right: string, wrong: string[], explanation: string): PlacementItem {
  const at = (n - 1) % 4;
  const labels = [...wrong];
  labels.splice(at, 0, right);
  const options: QuizChoice[] = labels.map((label, i) => ({ id: LETTERS[i]!, label }));
  return { id: `BA-PLC-${String(n).padStart(2, "0")}`, levelId, unitId, prompt, options, correctAnswer: LETTERS[at]!, explanation };
}

export const PLACEMENT_ITEMS: PlacementItem[] = [
  item(1, "L0", "l0-what-is-a-market", "The bid is 30.00 and the ask is 30.10. Which statement is right?", "Buying right now costs about 30.10", ["Buying right now costs about 30.00", "The stock's true value is 30.05", "The spread is 60.10"], "You buy at about the ask and sell at about the bid; the spread here is 0.10."),
  item(2, "L0", "l0-risk-first", "Your account falls 50%. What gain gets it back to the start?", "100%", ["50%", "25%", "It recovers by itself"], "Half of the account has to double to get back."),
  item(3, "L1", "l1-long-vs-short", "You own 100 shares and sell all of them. What is your position now?", "Flat: no position", ["Short 100 shares", "Long 200 shares", "Long 100 shares until settlement"], "Selling shares you own closes the long; it is not a short."),
  item(4, "L1", "l1-why-prices-move", "A company reports results exactly as everyone expected. What usually happens to the stock?", "Not much: the news was priced in", ["It always jumps", "It always falls", "Trading is halted"], "Prices move on surprises versus expectations."),
  item(5, "L2", "l2-reading-a-candle", "A candle opens at 20, trades up to 23, down to 19 and closes at 22. What colour and body?", "Green, body from 20 to 22", ["Red, body from 23 to 19", "Green, body from 19 to 23", "Red, body from 22 to 20"], "Close above open = green; the body spans open to close."),
  item(6, "L2", "l2-trend-vs-range", "Which sequence of swing lows is an uptrend?", "48, 50, 53", ["53, 50, 48", "50, 50, 50", "48, 53, 47"], "Higher lows (and highs) define an uptrend."),
  item(7, "L2", "l2-support-resistance", "Price breaks clearly above resistance at 40 and later pulls back to 40. What often happens there?", "40 acts as support", ["40 no longer matters", "Price must fall to 30", "The breakout is cancelled automatically"], "A broken resistance level often becomes support."),
  item(8, "L3", "l3-stop-orders", "You hold shares with a sell stop at 45. The stock opens at 41 after bad news. Where does it sell?", "Near 41", ["Exactly 45", "It does not sell", "At yesterday's close"], "A stop becomes a market order; a gap fills at the open."),
  item(9, "L3", "l3-stop-limit", "Sell stop-limit, stop 45, limit 44. The stock gaps from 46 to 40. What happens?", "No fill: you still hold the shares", ["Sells at 44", "Sells at 40", "Sells at 45"], "The limit of 44 is never reached, so the triggered order does not fill."),
  item(10, "L3", "l3-position-sizing", "Account 10,000, risk 1%, entry 50, stop 48. How many shares?", "50", ["200", "100", "20"], "1% = 100; 100 ÷ (50 − 48) = 50 shares."),
  item(11, "L4", "l4-margins-and-pe", "A $60 stock earns $3 per share. What is its P/E?", "20", ["180", "57", "0.05"], "P/E = price ÷ EPS = 60 ÷ 3."),
  item(12, "L4", "l4-earnings-expectations", "A company beats this quarter but cuts next year's guidance. What often matters more to the stock?", "The guidance cut", ["The beat", "Neither", "The CEO's tone only"], "The future usually matters more than the quarter just ended."),
];

/** Levels the placement can route to, in order. */
export const PLACEMENT_LEVELS: LevelId[] = ["L0", "L1", "L2", "L3", "L4"];
export const PASS_SHARE = 2 / 3;

export interface PlacementResult {
  startLevel: LevelId;
  correct: number;
  total: number;
  /** Per level: correct / total and passed. */
  byLevel: Record<string, { correct: number; total: number; passed: boolean }>;
  /** Units to review: missed items below the start level (they were credited but showed a gap). */
  review: string[];
  skipped: boolean;
}

export const passNeeded = (n: number) => Math.ceil(n * PASS_SHARE);

export function routePlacement(answers: Record<string, AnswerLetter | undefined>): PlacementResult {
  const byLevel: PlacementResult["byLevel"] = {};
  for (const lv of PLACEMENT_LEVELS) {
    const items = PLACEMENT_ITEMS.filter((i) => i.levelId === lv);
    const correct = items.filter((i) => answers[i.id] === i.correctAnswer).length;
    byLevel[lv] = { correct, total: items.length, passed: correct >= passNeeded(items.length) };
  }
  let start: LevelId = "L4";
  for (const lv of PLACEMENT_LEVELS.slice(0, 4)) {
    if (!byLevel[lv]!.passed) {
      start = lv;
      break;
    }
  }
  const startIdx = PLACEMENT_LEVELS.indexOf(start);
  const review = PLACEMENT_ITEMS.filter((i) => PLACEMENT_LEVELS.indexOf(i.levelId) < startIdx && answers[i.id] !== i.correctAnswer).map((i) => i.unitId);
  const correct = PLACEMENT_ITEMS.filter((i) => answers[i.id] === i.correctAnswer).length;
  return { startLevel: start, correct, total: PLACEMENT_ITEMS.length, byLevel, review: [...new Set(review)], skipped: false };
}

/** "I'm brand new": no check, start at Orientation. */
export const skipPlacement = (): PlacementResult => ({ startLevel: "L0", correct: 0, total: PLACEMENT_ITEMS.length, byLevel: {}, review: [], skipped: true });
