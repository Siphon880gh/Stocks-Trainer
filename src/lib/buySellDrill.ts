/**
 * Buy or Sell? — a learning drill (not trading advice).
 * Every directional pattern in the trainer appears once, confirmed by the next candle, plus "wait" cases
 * (indecision, no prior trend, unconfirmed or failed signals) and larger 40–55 bar scenario charts whose
 * levels / zones / entry / stop / target are revealed only after the answer.
 * Type-only import from quizData, so there is no runtime import cycle.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import { DRILL_CHART_SPECS, drillChartKey } from "./ohlcData";
import { SCENARIOS, SCENARIO_PAD_BARS } from "./scenarioCharts";
import { ADVANCED_DRILL_INFO } from "./advancedPatterns";
import { CHART_BOOK_DRILL_INFO } from "./chartPatternBook";

export const BUY_SELL_DISCLAIMER = "Learning drill, not trading advice.";
export { SCENARIO_PAD_BARS };

type Decision = "buy" | "sell" | "wait";
const ANSWER: Record<Decision, "A" | "B" | "C"> = { buy: "A", sell: "B", wait: "C" };
const LABEL: Record<Decision, string> = { buy: "Buy", sell: "Sell", wait: "Wait" };

/** Fixed Buy / Sell / Wait choices; `feedback` explains why each wrong pick is wrong ("" for the correct one). */
function options(feedback: Record<Decision, string>): QuizOption[] {
  return [
    { id: "A", label: "Buy", description: "Buyers look in control; lean long.", feedback: feedback.buy || undefined },
    { id: "B", label: "Sell", description: "Sellers look in control; lean short or exit longs.", feedback: feedback.sell || undefined },
    { id: "C", label: "Wait", description: "No clear edge yet; stand aside.", feedback: feedback.wait || undefined },
  ];
}

const fmt = (n: number) => n.toLocaleString("en-US");

interface PatternInfo {
  name: string;
  kind: string;
  why: string;
  /** Where a stop would sit, i.e. what would prove the read wrong. */
  stop: string;
  term: string;
}

/** Every directional pattern used by the drill (keys match DRILL_CHART_SPECS with dir up/down). */
const INFO: Record<string, PatternInfo> = {
  // bullish reversals
  hammer: { name: "Hammer", kind: "bullish reversal", why: "After a decline, sellers pushed price far down but buyers closed it near the high (long lower wick).", stop: "below the hammer's low", term: "wick-rejection" },
  "inverted-hammer": { name: "Inverted hammer", kind: "bullish reversal", why: "After a decline, buyers probed higher; on its own it is weak, so the green confirmation matters most.", stop: "below the inverted hammer's low", term: "wick-rejection" },
  engulfing: { name: "Bullish engulfing", kind: "bullish reversal", why: "A green body fully covered the prior red body after a decline: buyers took over the whole prior period.", stop: "below the engulfing candle's low", term: "pattern-confirmation" },
  "piercing-line": { name: "Piercing line", kind: "bullish reversal", why: "After a gap down, the green candle closed above the red body's midpoint.", stop: "below the piercing candle's low", term: "pattern-confirmation" },
  "morning-star": { name: "Morning star", kind: "bullish reversal", why: "Long red, a small indecisive candle, then a green that closed deep into the red body.", stop: "below the star's low", term: "pattern-confirmation" },
  "three-white-soldiers": { name: "Three white soldiers", kind: "bullish reversal", why: "Three long greens, each closing higher, after a decline: steady buying.", stop: "below the first soldier's open", term: "strong-move-candle" },
  "tweezer-bottom": { name: "Tweezer bottom", kind: "bullish reversal", why: "Two candles stopped at the same low: buyers defended that price twice.", stop: "below the shared low", term: "support-resistance" },
  harami: { name: "Bullish harami", kind: "bullish reversal", why: "A small green sat inside the prior long red body: selling momentum stalled.", stop: "below the red candle's low", term: "pattern-confirmation" },
  "three-inside-up": { name: "Three inside up", kind: "bullish reversal", why: "A bullish harami, then a third candle that closed above the first red's high: the harami was confirmed.", stop: "below the pattern's low", term: "pattern-confirmation" },
  "three-outside-up": { name: "Three outside up", kind: "bullish reversal", why: "A bullish engulfing, then another higher green close.", stop: "below the pattern's low", term: "pattern-confirmation" },
  "bullish-counterattack": { name: "Bullish counterattack (meeting lines)", kind: "bullish reversal", why: "A long green opened far lower and climbed back to the red's close: buyers erased the gap.", stop: "below the green candle's low", term: "meeting-lines" },
  "white-marubozu": { name: "White marubozu", kind: "bullish candle", why: "A tall green with no wicks: buyers controlled the whole period.", stop: "below the marubozu's midpoint or low", term: "full-body-candle" },
  "candle-rejected-low": { name: "Long lower wick (price rejected at the lows)", kind: "bullish rejection", why: "After a decline, price was pushed far down and closed near the high: lower prices were rejected.", stop: "below the wick's low", term: "wick-rejection" },
  "candle-bulls-win": { name: "Bulls-win candle", kind: "bullish candle", why: "A tall green opened near the low and closed near the high: buyers ran the period.", stop: "below the candle's low", term: "strong-move-candle" },
  "dragonfly-doji": { name: "Dragonfly doji", kind: "bullish reversal", why: "After a decline, buyers defended lower levels and closed it at the high (T shape).", stop: "below the dragonfly's low", term: "dragonfly-gravestone" },
  "bullish-kicker": { name: "Bullish kicker", kind: "bullish reversal", why: "The green gapped above the red's open and ran: sentiment flipped.", stop: "below the gap (back under the red's open)", term: "gap-reversal" },
  "bullish-abandoned-baby": { name: "Bullish abandoned baby", kind: "bullish reversal", why: "An island doji below the trend, then a gap up: a rare, strong bottom.", stop: "below the doji's low", term: "gap-reversal" },
  "bullish-tri-star": { name: "Bullish tri-star", kind: "bullish reversal", why: "Three dojis at the lows with the middle one lowest: sellers stalled three times.", stop: "below the middle doji's low", term: "doji-types" },
  "bullish-breakaway": { name: "Bullish breakaway", kind: "bullish reversal", why: "Sellers gapped away and drifted lower, then a long green closed back into the gap.", stop: "below the pattern's low", term: "reversal-vs-continuation" },
  "bullish-closing-marubozu": { name: "Bullish closing marubozu", kind: "bullish candle", why: "A long green that closed at its high: buyers still in control at the close.", stop: "below the candle's low", term: "marubozu-types" },
  "bullish-opening-marubozu": { name: "Bullish opening marubozu", kind: "bullish candle", why: "A long green that opened at its low and rose all period.", stop: "below the candle's low", term: "marubozu-types" },
  // bullish continuations
  "rising-three-methods": { name: "Rising three methods", kind: "bullish continuation", why: "Three small pullback candles stayed inside the first long green, then a long green resumed the trend.", stop: "below the first candle's low", term: "reversal-vs-continuation" },
  "mat-hold": { name: "Mat hold", kind: "bullish continuation", why: "A gap up and a shallow drift that held above the first candle's low, then a long green to new highs.", stop: "below the drift's low", term: "reversal-vs-continuation" },
  "upside-tasuki-gap": { name: "Upside tasuki gap", kind: "bullish continuation", why: "The red pullback closed inside the gap but left it open: the gap held as support.", stop: "below the gap (a full fill)", term: "gap-continuation" },
  "bullish-separating-lines": { name: "Bullish separating lines", kind: "bullish continuation", why: "In an uptrend, the green opened at the red's open and rallied: the dip was erased.", stop: "below the shared open", term: "gap-continuation" },
  "bullish-side-by-side-white-lines": { name: "Bullish side-by-side white lines", kind: "bullish continuation", why: "Two matching greens held above a gap.", stop: "below the gap", term: "gap-continuation" },
  "upside-gap-three-methods": { name: "Upside gap three methods", kind: "bullish continuation", why: "The red filled the gap but held inside the first green's body.", stop: "below the first green's open", term: "gap-continuation" },
  "bull-flag": { name: "Bull flag", kind: "bullish continuation", why: "A sharp rise, a tight pullback (the flag), then a close above the flag's high.", stop: "below the flag's low", term: "breakout-retest" },
  // bearish reversals
  "shooting-star": { name: "Shooting star", kind: "bearish reversal", why: "After a rally, buyers pushed far up but sellers closed it near the low (long upper wick).", stop: "above the shooting star's high", term: "wick-rejection" },
  "hanging-man": { name: "Hanging man", kind: "bearish reversal", why: "A hammer shape after a rally: sellers showed they could push price down hard. It needs a red confirmation, which it got.", stop: "above the hanging man's high", term: "pattern-confirmation" },
  "bearish-engulfing": { name: "Bearish engulfing", kind: "bearish reversal", why: "A red body fully covered the prior green body after a rally.", stop: "above the engulfing candle's high", term: "pattern-confirmation" },
  "dark-cloud-cover": { name: "Dark cloud cover", kind: "bearish reversal", why: "After a gap up, the red candle closed below the green body's midpoint.", stop: "above the red candle's high", term: "pattern-confirmation" },
  "evening-star": { name: "Evening star", kind: "bearish reversal", why: "Long green, a small indecisive candle, then a red that closed deep into the green body.", stop: "above the star's high", term: "pattern-confirmation" },
  "three-black-crows": { name: "Three black crows", kind: "bearish reversal", why: "Three long reds, each closing lower, after a rally: steady selling.", stop: "above the first crow's open", term: "strong-move-candle" },
  "tweezer-top": { name: "Tweezer top", kind: "bearish reversal", why: "Two candles stopped at the same high: sellers defended that price twice.", stop: "above the shared high", term: "support-resistance" },
  "bearish-harami": { name: "Bearish harami", kind: "bearish reversal", why: "A small red sat inside the prior long green body: buying momentum stalled.", stop: "above the green candle's high", term: "pattern-confirmation" },
  "three-inside-down": { name: "Three inside down", kind: "bearish reversal", why: "A bearish harami, then a third candle that closed below the first green's low.", stop: "above the pattern's high", term: "pattern-confirmation" },
  "three-outside-down": { name: "Three outside down", kind: "bearish reversal", why: "A bearish engulfing, then another lower red close.", stop: "above the pattern's high", term: "pattern-confirmation" },
  "bearish-counterattack": { name: "Bearish counterattack (meeting lines)", kind: "bearish reversal", why: "A long red opened far higher and fell back to the green's close: sellers erased the gap.", stop: "above the red candle's high", term: "meeting-lines" },
  "black-marubozu": { name: "Black marubozu", kind: "bearish candle", why: "A tall red with no wicks: sellers controlled the whole period.", stop: "above the marubozu's midpoint or high", term: "full-body-candle" },
  "candle-rejected-high": { name: "Long upper wick (price rejected at the highs)", kind: "bearish rejection", why: "After a rally, price was pushed far up and closed near the low: higher prices were rejected.", stop: "above the wick's high", term: "wick-rejection" },
  "candle-bears-win": { name: "Bears-win candle", kind: "bearish candle", why: "A tall red opened near the high and closed near the low: sellers ran the period.", stop: "above the candle's high", term: "strong-move-candle" },
  "gravestone-doji": { name: "Gravestone doji", kind: "bearish reversal", why: "After a rally, sellers defended upper levels and closed it at the low (upside-down T).", stop: "above the gravestone's high", term: "dragonfly-gravestone" },
  "bearish-kicker": { name: "Bearish kicker", kind: "bearish reversal", why: "The red gapped below the green's open and kept falling: sentiment flipped.", stop: "above the gap (back over the green's open)", term: "gap-reversal" },
  "bearish-abandoned-baby": { name: "Bearish abandoned baby", kind: "bearish reversal", why: "An island doji above the trend, then a gap down: a rare, strong top.", stop: "above the doji's high", term: "gap-reversal" },
  "bearish-tri-star": { name: "Bearish tri-star", kind: "bearish reversal", why: "Three dojis at the highs with the middle one highest: buyers stalled three times.", stop: "above the middle doji's high", term: "doji-types" },
  "bearish-breakaway": { name: "Bearish breakaway", kind: "bearish reversal", why: "Buyers gapped away and drifted higher, then a long red closed back into the gap.", stop: "above the pattern's high", term: "reversal-vs-continuation" },
  "two-crows": { name: "Two crows", kind: "bearish reversal", why: "The gap up failed and the second red closed inside the green body.", stop: "above the pattern's high", term: "reversal-vs-continuation" },
  "upside-gap-two-crows": { name: "Upside gap two crows", kind: "bearish reversal", why: "Two reds failed above a gap; the confirmation candle then closed below the pattern.", stop: "above the pattern's high", term: "pattern-confirmation" },
  "bearish-closing-marubozu": { name: "Bearish closing marubozu", kind: "bearish candle", why: "A long red that closed at its low: sellers still in control at the close.", stop: "above the candle's high", term: "marubozu-types" },
  "bearish-opening-marubozu": { name: "Bearish opening marubozu", kind: "bearish candle", why: "A long red that opened at its high and fell most of the period.", stop: "above the candle's high", term: "marubozu-types" },
  // bearish continuations
  "falling-three-methods": { name: "Falling three methods", kind: "bearish continuation", why: "Three small bounce candles stayed inside the first long red, then a long red resumed the trend.", stop: "above the first candle's high", term: "reversal-vs-continuation" },
  "bearish-mat-hold": { name: "Bearish mat hold", kind: "bearish continuation", why: "A gap down and a weak bounce that stayed below the first candle's high, then a long red to new lows.", stop: "above the bounce's high", term: "reversal-vs-continuation" },
  "downside-tasuki-gap": { name: "Downside tasuki gap", kind: "bearish continuation", why: "The green bounce closed inside the gap but left it open: the gap held as resistance.", stop: "above the gap (a full fill)", term: "gap-continuation" },
  "bearish-separating-lines": { name: "Bearish separating lines", kind: "bearish continuation", why: "In a downtrend, the red opened at the green's open and fell: the bounce was erased.", stop: "above the shared open", term: "gap-continuation" },
  "bearish-side-by-side-white-lines": { name: "Bearish side-by-side white lines", kind: "bearish continuation", why: "Two weak greens could not close the gap below the prior red.", stop: "above the gap", term: "gap-continuation" },
  "downside-gap-three-methods": { name: "Downside gap three methods", kind: "bearish continuation", why: "The green filled the gap but held inside the first red's body.", stop: "above the first red's open", term: "gap-continuation" },
  "on-neck": { name: "On-neck", kind: "bearish continuation", why: "The green bounce only reached the red's low: buyers were weak.", stop: "above the red candle's high", term: "neck-patterns" },
  "in-neck": { name: "In-neck", kind: "bearish continuation", why: "The green bounce closed barely inside the red body: buyers were weak.", stop: "above the red candle's high", term: "neck-patterns" },
  thrusting: { name: "Thrusting", kind: "bearish continuation", why: "The green bounce stayed below the red body's midpoint: not strong enough to reverse.", stop: "above the red candle's high", term: "neck-patterns" },
  // harami crosses, doji stars and advanced / rare patterns (advancedPatterns.ts)
  ...ADVANCED_DRILL_INFO,
  // chart, gap and volume patterns (chartPatternBook.ts)
  ...CHART_BOOK_DRILL_INFO,
};

function patternQuestion(key: string, end: number, dir: "up" | "down"): QuizQuestion {
  const info = INFO[key];
  const d: Decision = dir === "up" ? "buy" : "sell";
  const side = d === "buy" ? "above the pattern's high" : "below the pattern's low";
  const plan = `Plan idea: enter after the confirmation candle, stop ${info.stop}, target at least 2× the risk (1:2).`;
  return {
    id: `BS-P-${key}`,
    prompt: "SAMPLE chart. The highlighted candle completes a pattern and the last candle is the next print. From the candles alone: Buy, Sell, or Wait?",
    correctAnswer: ANSWER[d],
    options: options({
      buy: d === "buy" ? "" : `Buying fights the evidence: this is a ${info.kind} (${info.name}) and the next candle closed ${side}.`,
      sell: d === "sell" ? "" : `Selling fights the evidence: this is a ${info.kind} (${info.name}) and the next candle closed ${side}.`,
      wait: `Waiting is never reckless, but here the pattern is complete and the next candle confirmed it, so the drill's answer is ${LABEL[d]}. Waiting longer usually means a worse entry and a wider stop.`,
    }),
    explanation: `${LABEL[d]}. ${info.name} (${info.kind}). ${info.why} Confirmation: the last candle closed ${side}. ${plan} The read is wrong if price closes ${info.stop}. ${BUY_SELL_DISCLAIMER}`,
    patternKey: drillChartKey(key, dir),
    highlightIndex: end,
    glossaryTermId: info.term,
  };
}

interface WaitCase {
  id: string;
  chartKey: string;
  highlight: number;
  prompt: string;
  explanation: string;
  buy: string;
  sell: string;
  term: string;
}

const UNCONFIRMED = "SAMPLE chart. The highlighted candle is the latest print; nothing has formed after it yet. Buy, Sell, or Wait?";
const LATEST = "SAMPLE chart. Read the highlighted candle and what came after it. Buy, Sell, or Wait?";

const WAIT_CASES: WaitCase[] = [
  {
    id: "BS-W-doji",
    chartKey: drillChartKey("doji", "open"),
    highlight: 2,
    prompt: UNCONFIRMED,
    explanation: `Wait. A doji (open ≈ close) is indecision, and this one sits in a sideways patch with no strong trend to reverse. Confirmation would be a candle that closes clearly above (buy idea) or below (sell idea) the doji's range. ${BUY_SELL_DISCLAIMER}`,
    buy: "A doji says neither side won. Buying needs a green close above the doji's high first.",
    sell: "A doji says neither side won. Selling needs a red close below the doji's low first.",
    term: "indecision-candle",
  },
  {
    id: "BS-W-spinning-top",
    chartKey: drillChartKey("spinning-top", "open"),
    highlight: 2,
    prompt: UNCONFIRMED,
    explanation: `Wait. A spinning top (small body, wicks both ways) is indecision. It can hint a move is tiring, but it does not pick a direction. Let the next candle close beyond its high or low. ${BUY_SELL_DISCLAIMER}`,
    buy: "The small body says buyers did not win the period; there is nothing to confirm a long yet.",
    sell: "The small body says sellers did not win either; there is nothing to confirm a short yet.",
    term: "indecision-candle",
  },
  {
    id: "BS-W-long-legged-doji",
    chartKey: drillChartKey("long-legged-doji", "open"),
    highlight: 3,
    prompt: UNCONFIRMED,
    explanation: `Wait. A long-legged doji: price swung far both ways and closed where it opened. Big indecision, no winner. A close beyond either wick on the next candle would give direction. ${BUY_SELL_DISCLAIMER}`,
    buy: "Both wicks are long: buyers were rejected up top just as sellers were rejected below.",
    sell: "Both wicks are long: sellers were rejected below just as buyers were rejected above.",
    term: "doji-types",
  },
  {
    id: "BS-W-cross-doji",
    chartKey: drillChartKey("cross-doji", "open"),
    highlight: 3,
    prompt: UNCONFIRMED,
    explanation: `Wait. A cross doji is indecision. The longer lower wick shows some rejection of lower prices, but there is no confirmation yet. ${BUY_SELL_DISCLAIMER}`,
    buy: "A slightly longer lower wick is a clue, not a signal. Wait for a green close above the doji.",
    sell: "The lower wick shows buyers did defend lower prices; selling here has no evidence.",
    term: "doji-types",
  },
  {
    id: "BS-W-inverted-cross-doji",
    chartKey: drillChartKey("inverted-cross-doji", "open"),
    highlight: 3,
    prompt: UNCONFIRMED,
    explanation: `Wait. An inverted cross doji is indecision with some rejection of higher prices. Without a following red close it is not a sell. ${BUY_SELL_DISCLAIMER}`,
    buy: "The longer upper wick shows higher prices were rejected; buying has no support here.",
    sell: "A longer upper wick is a clue, not a signal. Wait for a red close below the doji.",
    term: "doji-types",
  },
  {
    id: "BS-W-bullish-three-line-strike",
    chartKey: drillChartKey("bullish-three-line-strike", "open"),
    highlight: 4,
    prompt: UNCONFIRMED,
    explanation: `Wait. Bullish three-line strike: three rising greens wiped out by one long red. The textbook calls it continuation (buy), but the strike candle often starts a reversal (sell). With the two reads in conflict, let the next candles decide. ${BUY_SELL_DISCLAIMER}`,
    buy: "Buying trusts the old textbook continuation read, but the long red just erased three candles of buying.",
    sell: "Selling trusts the reversal read, but the classic interpretation is the opposite. Wait for follow-through.",
    term: "three-line-strike",
  },
  {
    id: "BS-W-bearish-three-line-strike",
    chartKey: drillChartKey("bearish-three-line-strike", "open"),
    highlight: 4,
    prompt: UNCONFIRMED,
    explanation: `Wait. Bearish three-line strike: three falling reds wiped out by one long green. Textbook says continuation (sell); in practice it often reverses (buy). Conflicting reads mean wait. ${BUY_SELL_DISCLAIMER}`,
    buy: "Buying trusts the reversal read, but the classic interpretation is the opposite. Wait for follow-through.",
    sell: "Selling trusts the old continuation read, but the long green just erased three candles of selling.",
    term: "three-line-strike",
  },
  {
    id: "BS-W-hammer-open",
    chartKey: drillChartKey("hammer", "open"),
    highlight: 2,
    prompt: UNCONFIRMED,
    explanation: `Wait. A hammer after a dip is a possible bottom, but nothing has printed after it. Confirmation = a green close above the hammer's high. Many hammers fail. ${BUY_SELL_DISCLAIMER}`,
    buy: "Buying the hammer itself skips the confirmation. A close back below its low is common.",
    sell: "The hammer shows buyers rejected lower prices; selling right after that has no evidence.",
    term: "pattern-confirmation",
  },
  {
    id: "BS-W-engulfing-open",
    chartKey: drillChartKey("engulfing", "open"),
    highlight: 2,
    prompt: UNCONFIRMED,
    explanation: `Wait. A bullish engulfing just formed, but it is the last candle. Confirmation would be the next candle closing above the engulfing high. ${BUY_SELL_DISCLAIMER}`,
    buy: "Close, but early: the pattern is unconfirmed. In this drill, Buy is for confirmed setups.",
    sell: "The engulfing is bullish; selling goes against it.",
    term: "pattern-confirmation",
  },
  {
    id: "BS-W-shooting-star-open",
    chartKey: drillChartKey("shooting-star", "open"),
    highlight: 2,
    prompt: UNCONFIRMED,
    explanation: `Wait. A shooting star after a rally is a possible top, but nothing has printed after it. Confirmation = a red close below its low. ${BUY_SELL_DISCLAIMER}`,
    buy: "The long upper wick shows higher prices were rejected; buying here ignores that.",
    sell: "Selling the star itself skips confirmation; plenty of stars are followed by higher closes.",
    term: "pattern-confirmation",
  },
  {
    id: "BS-W-dark-cloud-open",
    chartKey: drillChartKey("dark-cloud-cover", "open"),
    highlight: 3,
    prompt: UNCONFIRMED,
    explanation: `Wait. Dark cloud cover just formed (red closed below the green's midpoint). It is a warning; a red close below the red candle's low would confirm. ${BUY_SELL_DISCLAIMER}`,
    buy: "The red close deep into the green body is a bearish warning; buying ignores it.",
    sell: "Early: the pattern is unconfirmed. In this drill, Sell is for confirmed setups.",
    term: "pattern-confirmation",
  },
  {
    id: "BS-W-hanging-man-open",
    chartKey: drillChartKey("hanging-man", "open"),
    highlight: 3,
    prompt: UNCONFIRMED,
    explanation: `Wait. A hanging man after a rally only warns that sellers can push price down; it is not bearish until a red candle closes below it. ${BUY_SELL_DISCLAIMER}`,
    buy: "The long lower wick after a rally is a warning sign; adding longs here ignores it.",
    sell: "A hanging man is notoriously unreliable without a red confirmation close.",
    term: "pattern-confirmation",
  },
  {
    id: "BS-W-inverted-hammer-open",
    chartKey: drillChartKey("inverted-hammer", "open"),
    highlight: 2,
    prompt: UNCONFIRMED,
    explanation: `Wait. An inverted hammer after a decline is the weakest bottom signal: buyers probed up but closed near the low. It needs a green close above its high. ${BUY_SELL_DISCLAIMER}`,
    buy: "Unconfirmed: the candle still closed near its low.",
    sell: "Buyers did probe higher; selling has no new evidence here either.",
    term: "pattern-confirmation",
  },
  {
    id: "BS-W-gravestone-open",
    chartKey: drillChartKey("gravestone-doji", "open"),
    highlight: 3,
    prompt: UNCONFIRMED,
    explanation: `Wait. A gravestone doji after a rally is a possible top. It becomes a sell idea once a red candle closes below it. ${BUY_SELL_DISCLAIMER}`,
    buy: "Sellers defended the upper levels; buying here ignores that rejection.",
    sell: "Early: the gravestone is unconfirmed.",
    term: "dragonfly-gravestone",
  },
  {
    id: "BS-W-hammer-no-trend",
    chartKey: drillChartKey("hammer-no-trend", "open"),
    highlight: 4,
    prompt: UNCONFIRMED,
    explanation: `Wait. The highlighted candle has a hammer shape, but price was moving sideways, not falling. A reversal pattern needs a trend to reverse. ${BUY_SELL_DISCLAIMER}`,
    buy: "Shape alone is not enough: there was no decline for the hammer to end.",
    sell: "Nothing here argues for selling either; the range is flat.",
    term: "prior-trend-context",
  },
  {
    id: "BS-W-engulfing-no-trend",
    chartKey: drillChartKey("engulfing-no-trend", "open"),
    highlight: 4,
    prompt: UNCONFIRMED,
    explanation: `Wait. A red candle engulfs the prior green, but in the middle of a flat range with no rally before it. Without a trend and without confirmation, it is just noise. ${BUY_SELL_DISCLAIMER}`,
    buy: "The candle is red and engulfing; it is not a buy signal in any reading.",
    sell: "Bearish engulfing needs a prior rally; here price was flat, so the shape carries little weight.",
    term: "prior-trend-context",
  },
  {
    id: "BS-W-shooting-star-failed",
    chartKey: "shooting-star",
    highlight: 2,
    prompt: LATEST,
    explanation: `Wait. A shooting star formed, but the next candles closed higher instead of lower: the bearish signal failed. Nor is there a clean bullish pattern to buy. ${BUY_SELL_DISCLAIMER}`,
    buy: "A failed bearish signal is not automatically a buy; there is no bullish pattern or level here.",
    sell: "The star was never confirmed: later candles closed above it.",
    term: "pattern-confirmation",
  },
  {
    id: "BS-W-bearish-engulfing-stalled",
    chartKey: "bearish-engulfing",
    highlight: 2,
    prompt: LATEST,
    explanation: `Wait. A bearish engulfing formed, but the next candles drifted up instead of closing below its low. No follow-through, so the signal is stale. ${BUY_SELL_DISCLAIMER}`,
    buy: "Small greens inside the red body are not a bullish pattern; buyers have not reclaimed the engulfing high.",
    sell: "Sellers did not follow through; the red's low was never broken.",
    term: "pattern-confirmation",
  },
  {
    id: "BS-W-high-wave",
    chartKey: drillChartKey("high-wave", "open"),
    highlight: 3,
    prompt: UNCONFIRMED,
    explanation: `Wait. A high-wave candle: a small body with very long shadows both ways. Price swung hard in both directions and finished near where it started: extreme indecision. A close beyond its high (buy idea) or low (sell idea) would give direction. ${BUY_SELL_DISCLAIMER}`,
    buy: "The long upper shadow shows buyers were rejected at the highs; nothing confirms a long yet.",
    sell: "The long lower shadow shows sellers were rejected at the lows; nothing confirms a short yet.",
    term: "high-wave",
  },
  {
    id: "BS-W-rickshaw-man",
    chartKey: drillChartKey("rickshaw-man", "open"),
    highlight: 3,
    prompt: UNCONFIRMED,
    explanation: `Wait. A rickshaw man (a long-legged doji with the open/close in the middle of the range) after a short rally: buyers and sellers fought to an exact draw. It warns the rally may stall, but only a later close below its low would make it a sell. ${BUY_SELL_DISCLAIMER}`,
    buy: "The rally stalled into a perfect draw; buying needs a close above the doji's high first.",
    sell: "A doji after a rally is a warning, not a signal: there is no red close below its low yet.",
    term: "rickshaw-man",
  },
];

function waitQuestion(c: WaitCase): QuizQuestion {
  return {
    id: c.id,
    prompt: c.prompt,
    correctAnswer: "C",
    options: options({ buy: c.buy, sell: c.sell, wait: "" }),
    explanation: c.explanation,
    patternKey: c.chartKey,
    highlightIndex: c.highlight,
    glossaryTermId: c.term,
  };
}

interface ScenarioText {
  id: string;
  key: string;
  prompt: string;
  walkthrough: string;
  buy: string;
  sell: string;
  wait: string;
  term: string;
}

const SCENARIO_PROMPT = "SAMPLE larger chart. Decision point: the highlighted last candle. Buy, Sell, or Wait? (Levels and the trade plan appear after you answer.)";

function planText(key: string): string {
  const s = SCENARIOS[key];
  if (!s.plan) return "";
  const { entry, stop, target } = s.plan;
  const risk = Math.abs(stop - entry);
  const reward = Math.abs(target - entry);
  return ` Entry ${fmt(entry)} (the close of the decision candle). Stop ${fmt(stop)} (risk ${fmt(risk)}). Target ${fmt(target)} (reward ${fmt(reward)}, about 1:${(reward / risk).toFixed(0)}).`;
}

const f = (key: string) => SCENARIOS[key].facts;

const SCENARIO_TEXT: ScenarioText[] = [
  {
    id: "BS-SC-01",
    key: "sc-double-top",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: an uptrend made two tops near ${fmt(f("sc-double-top").top1)} and ${fmt(f("sc-double-top").top2)} (resistance held twice). Price then closed below the neckline at ${fmt(f("sc-double-top").neck)} and below the rising trendline. Confirmation: the retest of the neckline from below failed and the decision candle closed red.`,
    buy: "Buying here fights a confirmed double top: the neckline broke and the retest failed.",
    sell: "",
    wait: "The pattern is complete (neckline break) and the retest has failed with a red close, which is the confirmation. Waiting longer usually means a worse entry.",
    term: "neckline",
  },
  {
    id: "BS-SC-02",
    key: "sc-double-bottom",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: a downtrend made two bottoms near ${fmt(f("sc-double-bottom").bot1)} and ${fmt(f("sc-double-bottom").bot2)} (support held twice). Price closed above the neckline at ${fmt(f("sc-double-bottom").neck)} and above the falling trendline. Confirmation: the retest held above the neckline and the decision candle closed green.`,
    buy: "",
    sell: "Selling here fights a confirmed double bottom: the neckline broke upward and the retest held.",
    wait: "The double bottom is confirmed by the neckline break and the held retest; the green close is the trigger.",
    term: "neckline",
  },
  {
    id: "BS-SC-03",
    key: "sc-head-shoulders",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: left shoulder ~${fmt(f("sc-head-shoulders").leftShoulder)}, higher head ~${fmt(f("sc-head-shoulders").head)}, lower right shoulder ~${fmt(f("sc-head-shoulders").rightShoulder)}: buyers could not make a new high. Price closed below the neckline (~${fmt(f("sc-head-shoulders").neck)}), retested it from below, and the decision candle closed red.`,
    buy: "Buying here ignores a broken head-and-shoulders neckline with a failed retest.",
    sell: "",
    wait: "All three parts are in place and the neckline break has been retested and rejected. That is the confirmation.",
    term: "neckline",
  },
  {
    id: "BS-SC-04",
    key: "sc-inverse-head-shoulders",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: left shoulder ~${fmt(f("sc-inverse-head-shoulders").leftShoulder)}, deeper head ~${fmt(f("sc-inverse-head-shoulders").head)}, higher right shoulder ~${fmt(f("sc-inverse-head-shoulders").rightShoulder)}: sellers could not make a new low. Price closed above the neckline (~${fmt(f("sc-inverse-head-shoulders").neck)}), retested it, and the decision candle closed green.`,
    buy: "",
    sell: "Selling here fights a confirmed inverse head and shoulders: neckline broken upward, retest held.",
    wait: "The neckline break and the held retest are the confirmation; the green close is the trigger.",
    term: "neckline",
  },
  {
    id: "BS-SC-05",
    key: "sc-trendline-break",
    prompt: SCENARIO_PROMPT,
    walkthrough: "Structure: an uptrend of higher lows along a rising trendline. Price closed below the trendline, rallied back to it, and was rejected (old support acting as resistance). The decision candle closed red.",
    buy: "Buying assumes the uptrend is intact, but the trendline broke and the retest failed.",
    sell: "",
    wait: "Break plus failed retest is two pieces of evidence; the red close confirms. A trendline break alone would have been a Wait.",
    term: "trendline",
  },
  {
    id: "BS-SC-06",
    key: "sc-breakout-retest",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: resistance at ${fmt(f("sc-breakout-retest").level)} rejected price three times. Price closed above it (breakout), pulled back to the level, and held. The decision candle closed green off the retest: old resistance acting as support.`,
    buy: "",
    sell: "Selling here bets on a failed breakout, but the retest held above the level and closed green.",
    wait: "The breakout and the held retest are both in. A close back below the level would have changed the answer.",
    term: "breakout-retest",
  },
  {
    id: "BS-SC-07",
    key: "sc-breakdown-retest",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: support at ${fmt(f("sc-breakdown-retest").level)} held three times. Price closed below it (breakdown), bounced back to the level, and failed. The decision candle closed red: old support acting as resistance.`,
    buy: "Buying here bets the breakdown fails, but the retest was rejected below the level.",
    sell: "",
    wait: "Breakdown plus failed retest is the confirmation. A close back above the level would have been the warning.",
    term: "breakout-retest",
  },
  {
    id: "BS-SC-08",
    key: "sc-demand-zone",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: a small base candle, then a big-body green impulse, created a demand zone at ${fmt(f("sc-demand-zone").zoneBottom)}–${fmt(f("sc-demand-zone").zoneTop)}. Price came back to the zone for the first time (fresh), wicked into it, and the decision candle closed green away from it: buyers defended the zone.`,
    buy: "",
    sell: "Selling into a fresh demand zone that just rejected lower prices fights the evidence.",
    wait: "The zone is fresh and it has already shown a bullish reaction (rejection plus green close). That is the confirmation.",
    term: "demand-zone",
  },
  {
    id: "BS-SC-09",
    key: "sc-supply-zone",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: a small base candle, then a big-body red impulse, created a supply zone at ${fmt(f("sc-supply-zone").zoneBottom)}–${fmt(f("sc-supply-zone").zoneTop)}. Price rallied back into the fresh zone and the decision candle closed red away from it: sellers defended the zone.`,
    buy: "Buying straight into a fresh supply zone that just rejected price fights the evidence.",
    sell: "",
    wait: "The fresh zone was tested and rejected with a red close; that is the confirmation.",
    term: "supply-zone",
  },
  {
    id: "BS-SC-10",
    key: "sc-zone-flip",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: a demand zone (${fmt(f("sc-zone-flip").zoneBottom)}–${fmt(f("sc-zone-flip").zoneTop)}) held once, then a big red candle closed through it. Price rallied back into the broken zone from below and the decision candle closed red: the old demand is acting as supply (a zone flip).`,
    buy: "The zone is no longer demand: it broke with a big red close. Buying on the return treats a broken zone as if it still held.",
    sell: "",
    wait: "Break, return, and a red rejection from the flipped zone are all in place.",
    term: "zone-flip",
  },
  {
    id: "BS-SC-11",
    key: "sc-range-middle",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: price has swung between ~${fmt(f("sc-range-middle").rangeBottom)} and ~${fmt(f("sc-range-middle").rangeTop)} with no higher highs or lower lows. The decision candle is in the middle of the range, where neither support nor resistance is close.`,
    buy: "A green candle in the middle of a range has resistance overhead and no nearby support for a stop.",
    sell: "A short from the middle has support below and no nearby resistance for a stop.",
    wait: "",
    term: "trend-vs-range",
  },
  {
    id: "BS-SC-12",
    key: "sc-double-top-unconfirmed",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: two similar tops, then a pullback, but price is still above the neckline at ${fmt(f("sc-double-top-unconfirmed").neck)}. Until a candle closes below the neckline, it is just a pullback inside an uptrend.`,
    buy: "Two rejections at the same high are a warning; buying into it ignores the resistance.",
    sell: "The double top is not confirmed: the neckline has not broken. Many 'double tops' turn into higher highs.",
    wait: "",
    term: "neckline",
  },
  {
    id: "BS-SC-13",
    key: "sc-demand-under-pressure",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: a fresh demand zone at ${fmt(f("sc-demand-under-pressure").zoneBottom)}–${fmt(f("sc-demand-under-pressure").zoneTop)}. Price fell into it with one big red candle that closed inside the zone with no rejection wick. Sellers are still pushing; buyers have not reacted yet.`,
    buy: "Buying a zone before it reacts is catching a falling knife: wait for a bullish candle inside the zone.",
    sell: "The zone has not broken yet: there is no close below it. Selling into fresh demand is risky.",
    wait: "",
    term: "fresh-vs-tested-zone",
  },
  {
    id: "BS-SC-14",
    key: "sc-triple-top",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: an uptrend stalled at the same resistance three times (triple top). Price then closed below the neckline at ${fmt(f("sc-triple-top").neck)}, the lowest dip between the tops. Confirmation: the retest of the neckline from below failed and the decision candle closed red.`,
    buy: "Buying here fights a confirmed triple top: three failed tops, a neckline break, and a failed retest.",
    sell: "",
    wait: "The triple top is complete (neckline close) and the retest failed with a red close. That is the confirmation; waiting longer usually means a worse entry.",
    term: "triple-top",
  },
  {
    id: "BS-SC-15",
    key: "sc-triple-bottom",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: a downtrend found support at the same price three times (triple bottom). Price closed above the neckline at ${fmt(f("sc-triple-bottom").neck)}, the highest bounce between the lows. Confirmation: the retest held above the neckline and the decision candle closed green.`,
    buy: "",
    sell: "Selling here fights a confirmed triple bottom: support held three times and the neckline broke upward.",
    wait: "The neckline break and the held retest are the confirmation; the green close is the trigger.",
    term: "triple-bottom",
  },
  {
    id: "BS-SC-16",
    key: "sc-rising-wedge",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: price rose inside two upward-sloping, converging lines (rising wedge): each new high gained less ground, so buyers were tiring. Confirmation: a candle closed below the lower line and the decision candle closed red below it. The stop goes above the last swing high inside the wedge.`,
    buy: "Buying here fights a rising wedge that just closed below its lower line: the uptrend lost its support.",
    sell: "",
    wait: "The wedge has broken with a close below the lower line and a red follow-through. That is the confirmation.",
    term: "wedge",
  },
  {
    id: "BS-SC-17",
    key: "sc-falling-wedge",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: price fell inside two downward-sloping, converging lines (falling wedge): each new low gained less ground, so sellers were tiring. Confirmation: a candle closed above the upper line and the decision candle closed green above it. The stop goes below the last swing low inside the wedge.`,
    buy: "",
    sell: "Selling here fights a falling wedge that just closed above its upper line: the downtrend lost its ceiling.",
    wait: "The wedge has broken with a close above the upper line and a green follow-through. That is the confirmation.",
    term: "wedge",
  },  {
    id: "BS-SC-18",
    key: "sc-pullback-entry",
    prompt: SCENARIO_PROMPT,
    walkthrough: `Structure: an uptrend of higher highs and higher lows (about ${fmt(f("sc-pullback-entry").l1)}, then ${fmt(f("sc-pullback-entry").l2)}) along a rising trendline. Price pulled back to ${fmt(f("sc-pullback-entry").pbLow)}, where the trendline meets the old swing high near ${fmt(f("sc-pullback-entry").h2)}, and held. Confirmation: the decision candle closed green off that level. This is a pullback entry: the edge is the pullback low, so the stop goes just under it.`,
    buy: "",
    sell: "Selling here fights an intact uptrend: the higher low held at the trendline and the candle closed green.",
    wait: "The trend, the level and the confirming green close are all in place. A close below the pullback low would have changed the answer.",
    term: "entry-types",
  },
];

function scenarioQuestion(t: ScenarioText): QuizQuestion {
  const s = SCENARIOS[t.key];
  const d = s.decision;
  const head =
    d === "wait"
      ? "Wait. No clear edge yet."
      : `${LABEL[d]}. ${d === "buy" ? "Buyers" : "Sellers"} have both the structure and the confirmation.`;
  const waitTail =
    d === "wait" ? " What would change the answer: a confirmed break of the level or a clear reaction candle at it." : "";
  return {
    id: t.id,
    prompt: t.prompt,
    correctAnswer: ANSWER[d],
    options: options({ buy: t.buy, sell: t.sell, wait: t.wait }),
    explanation: `${head} ${t.walkthrough}${planText(t.key)}${waitTail} ${BUY_SELL_DISCLAIMER}`,
    patternKey: t.key,
    highlightIndex: s.bars.length - 1,
    chartSize: "large",
    revealAnnotations: s.reveal,
    glossaryTermId: t.term,
  };
}

const PATTERN_QUESTIONS: QuizQuestion[] = DRILL_CHART_SPECS.filter((s) => s.dir !== "open").map((s) =>
  patternQuestion(s.key, s.end, s.dir as "up" | "down")
);

/** Interleave so pattern, wait and scenario questions mix instead of coming in blocks. */
function interleave(...lists: QuizQuestion[][]): QuizQuestion[] {
  const out: QuizQuestion[] = [];
  const max = Math.max(...lists.map((l) => l.length));
  const ratios = lists.map((l) => l.length / max);
  const cursors = lists.map(() => 0);
  for (let step = 0; step < max; step++) {
    lists.forEach((l, i) => {
      while (cursors[i] < l.length && cursors[i] < Math.ceil((step + 1) * ratios[i])) out.push(l[cursors[i]++]);
    });
  }
  return out;
}

export const BUY_SELL_QUESTIONS: QuizQuestion[] = interleave(
  PATTERN_QUESTIONS,
  WAIT_CASES.map(waitQuestion),
  SCENARIO_TEXT.map(scenarioQuestion)
);

/** Coverage helpers for docs and validation. */
export const BUY_SELL_PATTERN_KEYS = Object.keys(INFO);
export const BUY_SELL_WAIT_IDS = WAIT_CASES.map((c) => c.id);
export const BUY_SELL_SCENARIO_KEYS = SCENARIO_TEXT.map((t) => t.key);
