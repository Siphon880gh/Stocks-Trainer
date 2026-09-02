import { SAMPLE_OHLC, type OHLC } from "./ohlcData";
import { scanPatterns } from "./patternScan";

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

export const REPLAY_TAPE: OHLC[] = SAMPLE_OHLC;
export const REPLAY_START_BARS = 6;

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

export const PLAN_TAPE: OHLC[] = SAMPLE_OHLC;
export const HUNT_TAPE: OHLC[] = SAMPLE_OHLC;

export function gradeHunt(markIndex: number, data: OHLC[], tolerance = 1): GradeResult {
  if (markIndex < 0 || markIndex >= data.length) {
    return { grade: "incorrect", tip: "Tap a bar on the SAMPLE tape." };
  }
  const hits = scanPatterns(data).map((p) => p.index);
  if (hits.length === 0) {
    return { grade: "incorrect", tip: "This SAMPLE window has no textbook scan hit." };
  }
  let nearest = Infinity;
  let hitAt = hits[0]!;
  for (const h of hits) {
    const d = Math.abs(h - markIndex);
    if (d < nearest) {
      nearest = d;
      hitAt = h;
    }
  }
  const name = scanPatterns(data).find((p) => p.index === hitAt)?.name ?? "pattern";
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
