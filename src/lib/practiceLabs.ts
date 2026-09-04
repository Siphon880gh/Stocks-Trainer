import { PATTERN_OHLC, SAMPLE_OHLC, type OHLC } from "./ohlcData";
import { scanPatterns, STRUCTURE_SCAN_NAMES } from "./patternScan";

export type DrawGrade = "correct" | "partial" | "incorrect";

export type CandlePart =
  | "high"
  | "low"
  | "open"
  | "close"
  | "body"
  | "upper-wick"
  | "lower-wick";

export type RegimeId = "trend-up" | "trend-down" | "range";

export type OverlayFollowUp = "sma" | "rsi" | "bollinger";

export interface GradeResult {
  grade: DrawGrade;
  tip: string;
}

export interface RegimeWindow {
  id: string;
  name: string;
  bars: OHLC[];
  regime: RegimeId;
  overlay: OverlayFollowUp;
  overlayTip: string;
}

function bar(name: string, open: number, high: number, low: number, close: number): OHLC {
  return { name, open, high, low, close };
}

export const REGIME_WINDOWS: RegimeWindow[] = [
  {
    id: "grind-up",
    name: "SAMPLE · grind",
    regime: "trend-up",
    overlay: "sma",
    overlayTip: "A moving average is a simple way to stay oriented in a one-way grind.",
    bars: [
      bar("09:30", 100, 102, 99, 101),
      bar("10:00", 101, 104, 100, 103),
      bar("10:30", 103, 106, 102, 105),
      bar("11:00", 105, 107, 104, 106),
      bar("11:30", 106, 109, 105, 108),
      bar("12:00", 108, 111, 107, 110),
    ],
  },
  {
    id: "slide-down",
    name: "SAMPLE · slide",
    regime: "trend-down",
    overlay: "sma",
    overlayTip: "Price walking lower still reads as trend — a moving average tracks that walk.",
    bars: [
      bar("09:30", 110, 111, 107, 108),
      bar("10:00", 108, 109, 104, 105),
      bar("10:30", 105, 106, 101, 102),
      bar("11:00", 102, 103, 98, 99),
      bar("11:30", 99, 100, 95, 96),
      bar("12:00", 96, 97, 92, 93),
    ],
  },
  {
    id: "chop",
    name: "SAMPLE · chop",
    regime: "range",
    overlay: "rsi",
    overlayTip: "In a range, oscillators (RSI) are about stretch vs mean — not a new trend.",
    bars: [
      bar("09:30", 100, 103, 98, 102),
      bar("10:00", 102, 104, 99, 100),
      bar("10:30", 100, 103, 97, 99),
      bar("11:00", 99, 103, 98, 102),
      bar("11:30", 102, 104, 98, 100),
      bar("12:00", 100, 103, 97, 101),
    ],
  },
  {
    id: "squeeze",
    name: "SAMPLE · squeeze",
    regime: "range",
    overlay: "bollinger",
    overlayTip: "A squeeze is low volatility. Bollinger-style bands shrink before an expansion.",
    bars: [
      bar("09:30", 100, 104, 97, 102),
      bar("10:00", 102, 104, 99, 101),
      bar("10:30", 101, 102.5, 100, 101.5),
      bar("11:00", 101.5, 102.2, 100.6, 101.4),
      bar("11:30", 101.4, 101.9, 100.9, 101.3),
      bar("12:00", 101.3, 101.7, 101.0, 101.4),
    ],
  },
  {
    id: "v-reclaim",
    name: "SAMPLE · V-reclaim",
    regime: "trend-up",
    overlay: "sma",
    overlayTip: "A sharp dump then reclaim still leaves a rising path a moving average can track.",
    bars: [
      bar("09:30", 108, 109, 106, 107),
      bar("10:00", 107, 108, 102, 103),
      bar("10:30", 103, 104, 98, 99),
      bar("11:00", 99, 104, 98, 103),
      bar("11:30", 103, 107, 102, 106),
      bar("12:00", 106, 110, 105, 109),
    ],
  },
  {
    id: "round-top",
    name: "SAMPLE · round top",
    regime: "trend-down",
    overlay: "sma",
    overlayTip: "After the turn, price walks lower — a moving average still orients the slide.",
    bars: [
      bar("09:30", 100, 104, 99, 103),
      bar("10:00", 103, 106, 102, 105),
      bar("10:30", 105, 107, 103, 104),
      bar("11:00", 104, 105, 100, 101),
      bar("11:30", 101, 102, 97, 98),
      bar("12:00", 98, 99, 94, 95),
    ],
  },
  {
    id: "trend-pause",
    name: "SAMPLE · trend pause",
    regime: "trend-up",
    overlay: "sma",
    overlayTip: "A pause inside an uptrend is still trend. SMA keeps you oriented until the grind resumes or fails.",
    bars: [
      bar("09:30", 90, 93, 89, 92),
      bar("10:00", 92, 96, 91, 95),
      bar("10:30", 95, 97, 94, 96),
      bar("11:00", 96, 97, 95, 96),
      bar("11:30", 96, 98, 95, 97),
      bar("12:00", 97, 101, 96, 100),
    ],
  },
  {
    id: "gap-fade",
    name: "SAMPLE · gap fade",
    regime: "range",
    overlay: "rsi",
    overlayTip: "A gap that fades back into the prior band is still a range problem — RSI for stretch, not a new trend.",
    bars: [
      bar("09:30", 100, 102, 99, 101),
      bar("10:00", 101, 103, 100, 102),
      bar("10:30", 107, 108, 105, 106),
      bar("11:00", 106, 107, 103, 104),
      bar("11:30", 104, 105, 101, 102),
      bar("12:00", 102, 104, 100, 101),
    ],
  },
];

export function getRegimeWindow(id: string): RegimeWindow | undefined {
  return REGIME_WINDOWS.find((w) => w.id === id);
}

/** Map a price onto candle anatomy. Extremes win over wicks; wicks win over body. */
export function candlePartAtPrice(candle: OHLC, price: number): CandlePart | null {
  const range = candle.high - candle.low;
  if (range <= 0) return absEq(price, candle.high) ? "high" : null;
  const eps = range * 0.08;
  if (Math.abs(price - candle.high) <= eps) return "high";
  if (Math.abs(price - candle.low) <= eps) return "low";
  if (Math.abs(price - candle.open) <= eps) return "open";
  if (Math.abs(price - candle.close) <= eps) return "close";
  const bodyTop = Math.max(candle.open, candle.close);
  const bodyBot = Math.min(candle.open, candle.close);
  if (price > bodyTop && price < candle.high) return "upper-wick";
  if (price < bodyBot && price > candle.low) return "lower-wick";
  if (price >= bodyBot && price <= bodyTop) return "body";
  return null;
}

function absEq(a: number, b: number): boolean {
  return Math.abs(a - b) < 1e-9;
}

const PARTIAL_PAIRS: Array<[CandlePart, CandlePart]> = [
  ["body", "open"],
  ["body", "close"],
  ["high", "upper-wick"],
  ["low", "lower-wick"],
];

export function gradeLabel(prompt: CandlePart, hit: CandlePart | null): GradeResult {
  if (hit == null) {
    return { grade: "incorrect", tip: "Tap on the candle — high, low, open, close, body, or a wick." };
  }
  if (hit === prompt) {
    return { grade: "correct", tip: `Yes — that is the ${prompt.replace("-", " ")}.` };
  }
  const related = PARTIAL_PAIRS.some(
    ([a, b]) => (prompt === a && hit === b) || (prompt === b && hit === a),
  );
  if (related) {
    return {
      grade: "partial",
      tip: `Close — you were in the ${hit.replace("-", " ")} zone. Prompt was ${prompt.replace("-", " ")}.`,
    };
  }
  return {
    grade: "incorrect",
    tip: `That tap reads as ${hit.replace("-", " ")}. Prompt was ${prompt.replace("-", " ")}.`,
  };
}

export const LABEL_PROMPTS: CandlePart[] = [
  "high",
  "low",
  "open",
  "close",
  "body",
  "upper-wick",
  "lower-wick",
];

/** One tall SAMPLE candle so wick vs body is easy to tap. */
export const LABEL_CANDLE: OHLC = {
  name: "SAMPLE",
  open: 100,
  high: 118,
  low: 88,
  close: 110,
};

export function gradeRegime(windowId: string, pick: RegimeId): GradeResult {
  const window = getRegimeWindow(windowId);
  if (!window) {
    return { grade: "incorrect", tip: "Unknown SAMPLE window." };
  }
  if (pick === window.regime) {
    return {
      grade: "correct",
      tip: `Yes — this SAMPLE window is ${regimeLabel(window.regime)}.`,
    };
  }
  return {
    grade: "incorrect",
    tip: `This SAMPLE window is ${regimeLabel(window.regime)}, not ${regimeLabel(pick)}.`,
  };
}

export function gradeOverlayFollowUp(windowId: string, pick: OverlayFollowUp): GradeResult {
  const window = getRegimeWindow(windowId);
  if (!window) {
    return { grade: "incorrect", tip: "Unknown SAMPLE window." };
  }
  if (pick === window.overlay) {
    return { grade: "correct", tip: window.overlayTip };
  }
  return {
    grade: "incorrect",
    tip: window.overlayTip,
  };
}

function regimeLabel(id: RegimeId): string {
  if (id === "trend-up") return "uptrend";
  if (id === "trend-down") return "downtrend";
  return "range";
}

export type ReplayAction = "wait" | "bias-up" | "bias-down";

export function gradeReplay(actions: ReplayAction[]): GradeResult {
  if (actions.length === 0) {
    return {
      grade: "incorrect",
      tip: "Step the tape and pick Wait or a bias before you reveal the rest.",
    };
  }
  const waited = actions.includes("wait");
  const biased = actions.includes("bias-up") || actions.includes("bias-down");
  if (waited && biased) {
    return {
      grade: "correct",
      tip: "You waited for more bars, then took a stance. Direction is not the grade — process is.",
    };
  }
  if (biased) {
    return {
      grade: "partial",
      tip: "You picked a bias without a Wait. SAMPLE teaching: more bars beat a snap call.",
    };
  }
  return {
    grade: "partial",
    tip: "You waited. Add a bias before reveal so you have a stance to check.",
  };
}

export const REPLAY_TAPES: { id: string; name: string; bars: OHLC[] }[] = [
  { id: "replay-sample", name: "SAMPLE · mixed", bars: SAMPLE_OHLC },
  {
    id: "replay-slide",
    name: "SAMPLE · slide",
    bars: [
      bar("09:30", 120, 121, 117, 118),
      bar("10:00", 118, 119, 114, 115),
      bar("10:30", 115, 116, 111, 112),
      bar("11:00", 112, 113, 108, 109),
      bar("11:30", 109, 110, 105, 106),
      bar("12:00", 106, 107, 102, 103),
      bar("12:30", 103, 104, 99, 100),
      bar("13:00", 100, 101, 96, 97),
    ],
  },
];
export const REPLAY_TAPE: OHLC[] = REPLAY_TAPES[0]!.bars;
export const REPLAY_START_BARS = 6;

export const PLAN_TAPES: { id: string; name: string; bars: OHLC[] }[] = [
  { id: "plan-up", name: "SAMPLE · grind", bars: SAMPLE_OHLC },
  {
    id: "plan-down",
    name: "SAMPLE · slide",
    bars: [
      bar("09:30", 80, 81, 77, 78),
      bar("10:00", 78, 79, 74, 75),
      bar("10:30", 75, 76, 71, 72),
      bar("11:00", 72, 73, 68, 69),
      bar("11:30", 69, 70, 65, 66),
      bar("12:00", 66, 67, 62, 63),
    ],
  },
];
export const PLAN_TAPE: OHLC[] = PLAN_TAPES[0]!.bars;

export const HUNT_TAPES: { id: string; name: string; bars: OHLC[] }[] = [
  { id: "hunt-hammer", name: "SAMPLE · hammer window", bars: PATTERN_OHLC.hammer ?? SAMPLE_OHLC },
  { id: "hunt-doji", name: "SAMPLE · doji window", bars: PATTERN_OHLC.doji ?? SAMPLE_OHLC },
  { id: "hunt-hanging-man", name: "SAMPLE · hanging-man window", bars: PATTERN_OHLC["hanging-man"] ?? SAMPLE_OHLC },
  { id: "hunt-shooting-star", name: "SAMPLE · shooting-star window", bars: PATTERN_OHLC["shooting-star"] ?? SAMPLE_OHLC },
  { id: "hunt-inverted-hammer", name: "SAMPLE · inverted-hammer window", bars: PATTERN_OHLC["inverted-hammer"] ?? SAMPLE_OHLC },
  { id: "hunt-morning-star", name: "SAMPLE · morning-star window", bars: PATTERN_OHLC["morning-star"] ?? SAMPLE_OHLC },
  { id: "hunt-evening-star", name: "SAMPLE · evening-star window", bars: PATTERN_OHLC["evening-star"] ?? SAMPLE_OHLC },
  { id: "hunt-bullish-engulfing", name: "SAMPLE · bullish-engulfing window", bars: PATTERN_OHLC["bullish-engulfing"] ?? SAMPLE_OHLC },
  { id: "hunt-bearish-engulfing", name: "SAMPLE · bearish-engulfing window", bars: PATTERN_OHLC["bearish-engulfing"] ?? SAMPLE_OHLC },
  { id: "hunt-piercing-line", name: "SAMPLE · piercing-line window", bars: PATTERN_OHLC["piercing-line"] ?? SAMPLE_OHLC },
  { id: "hunt-dark-cloud-cover", name: "SAMPLE · dark-cloud window", bars: PATTERN_OHLC["dark-cloud-cover"] ?? SAMPLE_OHLC },
  { id: "hunt-three-white-soldiers", name: "SAMPLE · soldiers window", bars: PATTERN_OHLC["three-white-soldiers"] ?? SAMPLE_OHLC },
  { id: "hunt-three-black-crows", name: "SAMPLE · crows window", bars: PATTERN_OHLC["three-black-crows"] ?? SAMPLE_OHLC },
  { id: "hunt-harami", name: "SAMPLE · harami window", bars: PATTERN_OHLC.harami ?? SAMPLE_OHLC },
  { id: "hunt-tweezer-top", name: "SAMPLE · tweezer-top window", bars: PATTERN_OHLC["tweezer-top"] ?? SAMPLE_OHLC },
  { id: "hunt-tweezer-bottom", name: "SAMPLE · tweezer-bottom window", bars: PATTERN_OHLC["tweezer-bottom"] ?? SAMPLE_OHLC },
  { id: "hunt-rising-wedge", name: "SAMPLE · rising-wedge window", bars: PATTERN_OHLC["rising-wedge"] ?? SAMPLE_OHLC },
  { id: "hunt-falling-wedge", name: "SAMPLE · falling-wedge window", bars: PATTERN_OHLC["falling-wedge"] ?? SAMPLE_OHLC },
  { id: "hunt-bull-flag", name: "SAMPLE · bull-flag window", bars: PATTERN_OHLC["bull-flag"] ?? SAMPLE_OHLC },
  { id: "hunt-double-top", name: "SAMPLE · double-top window", bars: PATTERN_OHLC["double-top"] ?? SAMPLE_OHLC },
  { id: "hunt-double-bottom", name: "SAMPLE · double-bottom window", bars: PATTERN_OHLC["double-bottom"] ?? SAMPLE_OHLC },
  { id: "hunt-triangle", name: "SAMPLE · triangle window", bars: PATTERN_OHLC.triangle ?? SAMPLE_OHLC },
  { id: "hunt-head-shoulders", name: "SAMPLE · head-shoulders window", bars: PATTERN_OHLC["head-shoulders"] ?? SAMPLE_OHLC },
];
export const HUNT_TAPE: OHLC[] = HUNT_TAPES[0]!.bars;

export interface LookalikeRound {
  id: string;
  name: string;
  prompt: string;
  correct: "A" | "B";
  aKey: string;
  bKey: string;
  aCaption: string;
  bCaption: string;
}

export const LOOKALIKE_ROUNDS: LookalikeRound[] = [
  {
    id: "hm-vs-hammer",
    name: "Hanging Man vs Hammer",
    prompt: "Which chart is the Hanging Man? Same long lower wick — the rally context is the difference.",
    correct: "B",
    aKey: "hammer",
    bKey: "hanging-man",
    aCaption: "After a decline",
    bCaption: "After a rally",
  },
  {
    id: "es-vs-ms",
    name: "Evening Star vs Morning Star",
    prompt: "Which chart is the Evening Star? Green · small · red at the highs.",
    correct: "A",
    aKey: "evening-star",
    bKey: "morning-star",
    aCaption: "Top reversal",
    bCaption: "Bottom reversal",
  },
  {
    id: "pl-vs-engulf",
    name: "Piercing Line vs Engulfing",
    prompt: "Which chart is the Piercing Line? Into the prior red body — not a full cover.",
    correct: "B",
    aKey: "bullish-engulfing",
    bKey: "piercing-line",
    aCaption: "Full cover",
    bCaption: "Into the body",
  },
  {
    id: "dc-vs-engulf",
    name: "Dark Cloud Cover vs Engulfing",
    prompt: "Which chart is Dark Cloud Cover? Into the prior green body — not a full cover.",
    correct: "A",
    aKey: "dark-cloud-cover",
    bKey: "bearish-engulfing",
    aCaption: "Into the body",
    bCaption: "Full cover",
  },
  {
    id: "ha-vs-engulf",
    name: "Harami vs Engulfing",
    prompt: "Which chart is the Harami? Small body nested inside the prior body.",
    correct: "B",
    aKey: "engulfing",
    bKey: "harami",
    aCaption: "Current covers prior",
    bCaption: "Current nests inside",
  },
  {
    id: "ws-vs-ms",
    name: "Soldiers vs Morning Star",
    prompt: "Which chart is Three White Soldiers? Three rising greens, not red · small · green.",
    correct: "A",
    aKey: "three-white-soldiers",
    bKey: "morning-star",
    aCaption: "Three greens",
    bCaption: "Star mix",
  },
  {
    id: "tt-vs-dt",
    name: "Tweezer Top vs Double Top",
    prompt: "Which chart is the Tweezer Top? Two neighboring highs — not two swings with a dip.",
    correct: "B",
    aKey: "double-top",
    bKey: "tweezer-top",
    aCaption: "Two swings",
    bCaption: "Two neighboring bars",
  },
  {
    id: "fw-vs-tr",
    name: "Falling Wedge vs Triangle",
    prompt: "Which chart is the Falling Wedge? Downward tilt — a triangle squeeze has no built-in direction.",
    correct: "A",
    aKey: "falling-wedge",
    bKey: "triangle",
    aCaption: "Down tilt",
    bCaption: "Two-sided squeeze",
  },
  {
    id: "rw-vs-flag",
    name: "Rising Wedge vs Bull Flag",
    prompt: "Which chart is the Rising Wedge? A grind inside converging highs — not a sharp pole then a tight pause.",
    correct: "A",
    aKey: "rising-wedge",
    bKey: "bull-flag",
    aCaption: "Converging grind",
    bCaption: "Pole then pause",
  },
  {
    id: "hs-vs-dt",
    name: "Head and Shoulders vs Double Top",
    prompt: "Which chart is Head and Shoulders? Three peaks with a higher middle — not two similar highs.",
    correct: "B",
    aKey: "double-top",
    bKey: "head-shoulders",
    aCaption: "Two highs",
    bCaption: "Three peaks",
  },
];

export function getLookalikeRound(id: string): LookalikeRound | undefined {
  return LOOKALIKE_ROUNDS.find((r) => r.id === id);
}

export function gradeLookalike(roundId: string, pick: "A" | "B"): GradeResult {
  const round = getLookalikeRound(roundId);
  if (!round) {
    return { grade: "incorrect", tip: "Unknown lookalike round." };
  }
  if (pick === round.correct) {
    return { grade: "correct", tip: "Yes — context and shape both match. SAMPLE teaching." };
  }
  return {
    grade: "incorrect",
    tip: "The other chart is the lookalike. Read location (rally vs decline) and cover vs nest, not just one wick.",
  };
}

export interface BandRound {
  id: string;
  name: string;
  prompt: string;
  chartKey: string;
  highlightIndex?: number;
  bandLow: number;
  bandHigh: number;
  tip: string;
}

export const INVALIDATION_ROUNDS: BandRound[] = [
  {
    id: "inv-hanging-man",
    name: "Hanging Man wick",
    prompt: "Hanging Man after a rally. Tap the price that cancels a fade — under the long lower wick.",
    chartKey: "hanging-man",
    highlightIndex: 3,
    bandLow: 62720,
    bandHigh: 62880,
    tip: "The fade is wrong if price holds through the wick low. SAMPLE process, not a LIVE stop.",
  },
  {
    id: "inv-evening-star",
    name: "Evening Star reclaim",
    prompt: "Evening Star. Tap the first green high — a reclaim there cancels the top idea.",
    chartKey: "evening-star",
    highlightIndex: 3,
    bandLow: 63920,
    bandHigh: 64080,
    tip: "Reclaiming the first green high rewrites the evening-star read. SAMPLE process.",
  },
  {
    id: "inv-piercing-line",
    name: "Piercing Line low",
    prompt: "Piercing Line. Tap the decline low — losing it cancels the reclaim.",
    chartKey: "piercing-line",
    highlightIndex: 3,
    bandLow: 62420,
    bandHigh: 62580,
    tip: "If the next print loses the pierce low, you do not own a reclaim. SAMPLE process.",
  },
  {
    id: "inv-soldiers",
    name: "Soldiers first low",
    prompt: "Three White Soldiers. Tap the first soldier low — an undercut cancels buyer control.",
    chartKey: "three-white-soldiers",
    highlightIndex: 3,
    bandLow: 62970,
    bandHigh: 63130,
    tip: "Losing the first soldier is not a soldiers tape anymore. SAMPLE process.",
  },
  {
    id: "inv-tweezer-top",
    name: "Tweezer Top high",
    prompt: "Tweezer Top. Tap the matched high — a breakout through it cancels the rejection.",
    chartKey: "tweezer-top",
    highlightIndex: 3,
    bandLow: 64720,
    bandHigh: 64880,
    tip: "A new high after the match cancels the tweezer. SAMPLE process.",
  },
  {
    id: "inv-head-shoulders",
    name: "Head and Shoulders head",
    prompt: "Head and Shoulders. Tap the head high — a new high there cancels the three-peak idea.",
    chartKey: "head-shoulders",
    highlightIndex: 3,
    bandLow: 64720,
    bandHigh: 64880,
    tip: "A new high after the right shoulder is not head-and-shoulders. SAMPLE process.",
  },
  {
    id: "inv-falling-wedge",
    name: "Falling Wedge low",
    prompt: "Falling Wedge. Tap the squeeze low — losing it cancels a bounce-from-the-coil read.",
    chartKey: "falling-wedge",
    highlightIndex: 4,
    bandLow: 62720,
    bandHigh: 62880,
    tip: "If the next print loses the coil low, you do not own a wedge bounce. SAMPLE process.",
  },
  {
    id: "inv-bull-flag",
    name: "Bull Flag pause low",
    prompt: "Bull Flag. Tap the pause low — losing it cancels the rest-not-reversal read.",
    chartKey: "bull-flag",
    highlightIndex: 5,
    bandLow: 63670,
    bandHigh: 63830,
    tip: "A flag that loses its pause low is not a rest. SAMPLE process.",
  },
  {
    id: "inv-rising-wedge",
    name: "Rising Wedge high",
    prompt: "Rising Wedge. Tap the last high — a breakout through it cancels the tiring-buyers fade.",
    chartKey: "rising-wedge",
    highlightIndex: 5,
    bandLow: 64520,
    bandHigh: 64680,
    tip: "A new high after the coil can cancel the fade. SAMPLE process.",
  },
];

export const LEVEL_ROUNDS: BandRound[] = [
  {
    id: "lvl-tweezer-bottom",
    name: "Tweezer Bottom support",
    prompt: "Tap the matched support — the shared Tweezer Bottom low.",
    chartKey: "tweezer-bottom",
    highlightIndex: 3,
    bandLow: 62720,
    bandHigh: 62880,
    tip: "Two neighboring lows are a support zone, not a magic tick. SAMPLE teaching.",
  },
  {
    id: "lvl-tweezer-top",
    name: "Tweezer Top resistance",
    prompt: "Tap the matched resistance — the shared Tweezer Top high.",
    chartKey: "tweezer-top",
    highlightIndex: 3,
    bandLow: 64720,
    bandHigh: 64880,
    tip: "Two neighboring highs are a resistance zone. SAMPLE teaching.",
  },
  {
    id: "lvl-double-bottom",
    name: "Double Bottom support",
    prompt: "Tap the Double Bottom support — the similar swing lows.",
    chartKey: "double-bottom",
    highlightIndex: 3,
    bandLow: 63120,
    bandHigh: 63280,
    tip: "Two swing lows with a bounce between. SAMPLE zone, not a LIVE bid.",
  },
  {
    id: "lvl-double-top",
    name: "Double Top resistance",
    prompt: "Tap the Double Top resistance — the similar swing highs.",
    chartKey: "double-top",
    highlightIndex: 1,
    bandLow: 64320,
    bandHigh: 64680,
    tip: "Two similar highs with a dip between. SAMPLE zone, not a LIVE offer.",
  },
  {
    id: "lvl-piercing-zone",
    name: "Piercing Line zone",
    prompt: "Tap inside the prior red body — that is the Piercing Line reclaim zone.",
    chartKey: "piercing-line",
    highlightIndex: 2,
    bandLow: 62950,
    bandHigh: 63800,
    tip: "A pierce closes into the prior red body. SAMPLE read, not a fill.",
  },
  {
    id: "lvl-dark-cloud-zone",
    name: "Dark Cloud Cover zone",
    prompt: "Tap inside the prior green body — that is the Dark Cloud Cover zone.",
    chartKey: "dark-cloud-cover",
    highlightIndex: 2,
    bandLow: 63500,
    bandHigh: 64450,
    tip: "A cover closes into the prior green body. SAMPLE read, not a fill.",
  },
  {
    id: "lvl-rising-wedge-high",
    name: "Rising Wedge resistance",
    prompt: "Tap the Rising Wedge highs — the upper rail is a resistance zone.",
    chartKey: "rising-wedge",
    highlightIndex: 5,
    bandLow: 64520,
    bandHigh: 64680,
    tip: "Converging highs are a zone, not one tick. SAMPLE teaching.",
  },
  {
    id: "lvl-triangle-low",
    name: "Triangle higher lows",
    prompt: "Tap the rising Triangle lows — the lower rail is a support zone.",
    chartKey: "triangle",
    highlightIndex: 5,
    bandLow: 63720,
    bandHigh: 63880,
    tip: "Higher lows squeeze into a zone. SAMPLE teaching.",
  },
];

function gradeBand(round: BandRound | undefined, price: number, kind: "invalidation" | "level"): GradeResult {
  if (!round) {
    return { grade: "incorrect", tip: "Unknown round." };
  }
  if (price >= round.bandLow && price <= round.bandHigh) {
    return { grade: "correct", tip: round.tip };
  }
  const width = Math.max(round.bandHigh - round.bandLow, 1);
  const near = width * 1.5;
  if (price >= round.bandLow - near && price <= round.bandHigh + near) {
    return {
      grade: "partial",
      tip:
        kind === "invalidation"
          ? "Close — the cancel level is nearer the pattern extreme. SAMPLE zone, not one tick."
          : "Close — treat support and resistance as a zone around the match. SAMPLE teaching.",
    };
  }
  return {
    grade: "incorrect",
    tip:
      kind === "invalidation"
        ? "That price does not cancel the idea. Tap the pattern extreme the later print would have to break."
        : "That price is not the taught zone. Tap the matched high or low (or the body the later candle closed into).",
  };
}

export function gradeInvalidation(roundId: string, price: number): GradeResult {
  return gradeBand(
    INVALIDATION_ROUNDS.find((r) => r.id === roundId),
    price,
    "invalidation",
  );
}

export function gradeLevel(roundId: string, price: number): GradeResult {
  return gradeBand(
    LEVEL_ROUNDS.find((r) => r.id === roundId),
    price,
    "level",
  );
}

export interface PlanMarks {
  entry: number;
  stop: number;
  target: number;
}

export function gradePlan(plan: PlanMarks, last: OHLC): GradeResult {
  const { entry, stop, target } = plan;
  if (target === entry || stop === entry) {
    return { grade: "incorrect", tip: "Entry, stop, and target need three different prices." };
  }
  const long = target > entry;
  const stopOpposite = long ? stop < entry : stop > entry;
  if (!stopOpposite) {
    return {
      grade: "incorrect",
      tip: "Stop belongs on the other side of entry from the target.",
    };
  }
  const risk = Math.abs(entry - stop);
  const reward = Math.abs(target - entry);
  if (risk === 0 || reward / risk < 1) {
    return {
      grade: "incorrect",
      tip: "Need at least 1R: target distance should be ≥ stop distance.",
    };
  }
  const bodyTop = Math.max(last.open, last.close);
  const bodyBot = Math.min(last.open, last.close);
  if (stop >= bodyBot && stop <= bodyTop) {
    return {
      grade: "incorrect",
      tip: "Park the stop outside the last candle’s body — not inside the noise.",
    };
  }
  return {
    grade: "correct",
    tip: `Plan holds: stop opposite the target, ${((reward / risk) * 10) / 10}R, stop outside the last body.`,
  };
}

export function gradeHunt(markIndex: number, data: OHLC[], tolerance = 1): GradeResult {
  if (markIndex < 0 || markIndex >= data.length) {
    return { grade: "incorrect", tip: "Tap a bar on the SAMPLE tape." };
  }
  const patterns = scanPatterns(data);
  if (patterns.length === 0) {
    return { grade: "incorrect", tip: "This SAMPLE window has no textbook scan hit." };
  }
  let nearest = Infinity;
  let hitAt = patterns[0]!.index;
  for (const p of patterns) {
    const d = Math.abs(p.index - markIndex);
    if (d < nearest) {
      nearest = d;
      hitAt = p.index;
    }
  }
  const atBar = patterns.filter((p) => p.index === hitAt);
  const named =
    atBar.find((p) => STRUCTURE_SCAN_NAMES.has(p.name)) ?? atBar[0];
  const name = named?.name ?? "pattern";
  if (nearest === 0) {
    return { grade: "correct", tip: `Yes — scanner also flags ${name} on that bar.` };
  }
  if (nearest <= tolerance) {
    return {
      grade: "partial",
      tip: `Close — scanner’s ${name} is one bar away (bar ${hitAt + 1}).`,
    };
  }
  return {
    grade: "incorrect",
    tip: "No textbook pattern on that bar. Try a bar with a clear body/wick story.",
  };
}
