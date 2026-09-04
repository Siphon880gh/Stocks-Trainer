/** Practice Draw templates, grading, and last-attempt persistence (E7.M1). */

import { CHART } from "./chartTheme";

export type Point = { x: number; y: number };

/** Matches chart candles: green close>open, red close<open. */
export type BrushColor = "bullish" | "bearish";

export const BRUSH_HEX: Record<BrushColor, string> = {
  bullish: CHART.up,
  bearish: CHART.down,
};

export interface Stroke {
  points: Point[];
  color: BrushColor;
}

export type DrawTemplateId =
  | "doji"
  | "hammer"
  | "bullish-engulfing"
  | "bearish-engulfing"
  | "shooting-star"
  | "inverted-hammer"
  | "morning-star"
  | "falling-wedge"
  | "tweezer-top"
  | "tweezer-bottom"
  | "rising-wedge"
  | "bull-flag"
  | "double-top"
  | "double-bottom"
  | "triangle"
  | "head-shoulders"
  | "hanging-man"
  | "evening-star"
  | "piercing-line"
  | "dark-cloud-cover"
  | "three-white-soldiers"
  | "three-black-crows"
  | "harami";

export type DrawGrade = "correct" | "partial" | "incorrect";

export interface DrawTemplate {
  id: DrawTemplateId;
  name: string;
  /** Normalized polyline guides (0–1 in canvas space). */
  guides: Stroke[];
  tip: string;
  /** Short picker caption under the silhouette. */
  hint?: string;
  /** Brush to start with (first candle of a two-candle pattern). */
  openingBrush: BrushColor;
}

export interface DrawAttempt {
  templateId: DrawTemplateId;
  strokes: Stroke[];
  grade: DrawGrade;
  score: number;
  tip: string;
  savedAtIso: string;
}

export const PRACTICE_DRAW_STORAGE_KEY = "analysis_core_practice_draw_v1";

/** Body outline + upper/lower wicks in canvas y (0 = top). */
function candleGuide(opts: {
  cx: number;
  halfW: number;
  high: number;
  bodyTop: number;
  bodyBottom: number;
  low: number;
  color: BrushColor;
}): Stroke[] {
  const left = opts.cx - opts.halfW;
  const right = opts.cx + opts.halfW;
  const strokes: Stroke[] = [];
  if (opts.high < opts.bodyTop) {
    strokes.push({
      color: opts.color,
      points: [
        { x: opts.cx, y: opts.high },
        { x: opts.cx, y: opts.bodyTop },
      ],
    });
  }
  strokes.push({
    color: opts.color,
    points: [
      { x: left, y: opts.bodyTop },
      { x: right, y: opts.bodyTop },
      { x: right, y: opts.bodyBottom },
      { x: left, y: opts.bodyBottom },
      { x: left, y: opts.bodyTop },
    ],
  });
  if (opts.low > opts.bodyBottom) {
    strokes.push({
      color: opts.color,
      points: [
        { x: opts.cx, y: opts.bodyBottom },
        { x: opts.cx, y: opts.low },
      ],
    });
  }
  return strokes;
}

function engulfingGuides(first: BrushColor, second: BrushColor): Stroke[] {
  return [
    ...candleGuide({
      cx: 0.34,
      halfW: 0.07,
      high: 0.28,
      bodyTop: 0.4,
      bodyBottom: 0.6,
      low: 0.72,
      color: first,
    }),
    ...candleGuide({
      cx: 0.62,
      halfW: 0.12,
      high: 0.08,
      bodyTop: 0.22,
      bodyBottom: 0.78,
      low: 0.94,
      color: second,
    }),
  ];
}

/** Extra polyline (trendline / neckline) — same Stroke type as candle guides. */
function structureLine(color: BrushColor, points: Array<{ x: number; y: number }>): Stroke {
  return { color, points };
}

export const DRAW_TEMPLATES: DrawTemplate[] = [
  {
    id: "doji",
    name: "Doji",
    openingBrush: "bullish",
    tip: "Keep the body tiny (open≈close) and balance upper/lower shadows.",
    guides: candleGuide({
      cx: 0.5,
      halfW: 0.06,
      high: 0.12,
      bodyTop: 0.46,
      bodyBottom: 0.54,
      low: 0.88,
      color: "bullish",
    }),
  },
  {
    id: "hammer",
    name: "Hammer",
    openingBrush: "bullish",
    tip: "Small body near the top; long lower shadow at least 2× the body. Tiny (or no) upper wick.",
    guides: candleGuide({
      cx: 0.5,
      halfW: 0.1,
      high: 0.16,
      bodyTop: 0.2,
      bodyBottom: 0.36,
      low: 0.9,
      color: "bullish",
    }),
  },
  {
    id: "bullish-engulfing",
    name: "Bullish Engulfing",
    openingBrush: "bearish",
    hint: "small red then large green",
    tip: "Small red body, then a larger green body that fully covers it. Include wicks.",
    guides: engulfingGuides("bearish", "bullish"),
  },
  {
    id: "bearish-engulfing",
    name: "Bearish Engulfing",
    openingBrush: "bullish",
    hint: "small green then large red",
    tip: "Small green body, then a larger red body that fully covers it. Include wicks.",
    guides: engulfingGuides("bullish", "bearish"),
  },
  {
    id: "shooting-star",
    name: "Shooting Star",
    openingBrush: "bearish",
    tip: "Small body near the low after a rally; long upper shadow at least 2× the body. Tiny lower wick.",
    guides: candleGuide({
      cx: 0.5,
      halfW: 0.1,
      high: 0.1,
      bodyTop: 0.64,
      bodyBottom: 0.8,
      low: 0.86,
      color: "bearish",
    }),
  },
  {
    id: "inverted-hammer",
    name: "Inverted Hammer",
    openingBrush: "bullish",
    tip: "Same long upper wick as a shooting star, but after a decline. Small body near the low.",
    guides: candleGuide({
      cx: 0.5,
      halfW: 0.1,
      high: 0.1,
      bodyTop: 0.64,
      bodyBottom: 0.8,
      low: 0.86,
      color: "bullish",
    }),
  },
  {
    id: "morning-star",
    name: "Morning Star",
    openingBrush: "bearish",
    hint: "red · small · green",
    tip: "Three candles: large red, small middle, then large green. Keep them left-to-right.",
    guides: [
      ...candleGuide({
        cx: 0.22,
        halfW: 0.08,
        high: 0.18,
        bodyTop: 0.22,
        bodyBottom: 0.72,
        low: 0.78,
        color: "bearish",
      }),
      ...candleGuide({
        cx: 0.5,
        halfW: 0.05,
        high: 0.42,
        bodyTop: 0.48,
        bodyBottom: 0.58,
        low: 0.7,
        color: "bearish",
      }),
      ...candleGuide({
        cx: 0.78,
        halfW: 0.09,
        high: 0.16,
        bodyTop: 0.2,
        bodyBottom: 0.7,
        low: 0.76,
        color: "bullish",
      }),
    ],
  },
  {
    id: "falling-wedge",
    name: "Falling Wedge",
    openingBrush: "bearish",
    hint: "candles + two down lines",
    tip: "Draw the candles, then two downward lines that squeeze together. SAMPLE: wait for a later break — the wedge is not a live fill.",
    guides: [
      ...candleGuide({ cx: 0.14, halfW: 0.05, high: 0.1, bodyTop: 0.16, bodyBottom: 0.42, low: 0.5, color: "bearish" }),
      ...candleGuide({ cx: 0.32, halfW: 0.05, high: 0.2, bodyTop: 0.26, bodyBottom: 0.52, low: 0.6, color: "bearish" }),
      ...candleGuide({ cx: 0.5, halfW: 0.045, high: 0.28, bodyTop: 0.34, bodyBottom: 0.56, low: 0.66, color: "bullish" }),
      ...candleGuide({ cx: 0.68, halfW: 0.045, high: 0.34, bodyTop: 0.4, bodyBottom: 0.58, low: 0.7, color: "bearish" }),
      ...candleGuide({ cx: 0.86, halfW: 0.04, high: 0.38, bodyTop: 0.44, bodyBottom: 0.58, low: 0.72, color: "bullish" }),
      structureLine("bearish", [
        { x: 0.08, y: 0.1 },
        { x: 0.92, y: 0.38 },
      ]),
      structureLine("bullish", [
        { x: 0.08, y: 0.5 },
        { x: 0.92, y: 0.72 },
      ]),
    ],
  },
  {
    id: "tweezer-top",
    name: "Tweezer Top",
    openingBrush: "bullish",
    hint: "matched highs",
    tip: "Two candles share a similar high after a rally. Keep the highs lined up.",
    guides: [
      ...candleGuide({ cx: 0.36, halfW: 0.1, high: 0.12, bodyTop: 0.16, bodyBottom: 0.52, low: 0.6, color: "bullish" }),
      ...candleGuide({ cx: 0.64, halfW: 0.1, high: 0.12, bodyTop: 0.18, bodyBottom: 0.55, low: 0.64, color: "bearish" }),
    ],
  },
  {
    id: "tweezer-bottom",
    name: "Tweezer Bottom",
    openingBrush: "bearish",
    hint: "matched lows",
    tip: "Two candles share a similar low after a decline. Keep the lows lined up. Wait for the next print.",
    guides: [
      ...candleGuide({ cx: 0.36, halfW: 0.1, high: 0.28, bodyTop: 0.34, bodyBottom: 0.78, low: 0.88, color: "bearish" }),
      ...candleGuide({ cx: 0.64, halfW: 0.1, high: 0.24, bodyTop: 0.3, bodyBottom: 0.76, low: 0.88, color: "bullish" }),
    ],
  },
  {
    id: "rising-wedge",
    name: "Rising Wedge",
    openingBrush: "bullish",
    hint: "candles + two up lines",
    tip: "Higher highs and higher lows that squeeze. SAMPLE: buying is tiring; a break of the lower line needs later bars.",
    guides: [
      ...candleGuide({ cx: 0.14, halfW: 0.05, high: 0.52, bodyTop: 0.56, bodyBottom: 0.78, low: 0.86, color: "bullish" }),
      ...candleGuide({ cx: 0.32, halfW: 0.05, high: 0.42, bodyTop: 0.46, bodyBottom: 0.7, low: 0.78, color: "bullish" }),
      ...candleGuide({ cx: 0.5, halfW: 0.045, high: 0.34, bodyTop: 0.38, bodyBottom: 0.6, low: 0.7, color: "bearish" }),
      ...candleGuide({ cx: 0.68, halfW: 0.045, high: 0.26, bodyTop: 0.3, bodyBottom: 0.5, low: 0.62, color: "bullish" }),
      ...candleGuide({ cx: 0.86, halfW: 0.04, high: 0.2, bodyTop: 0.24, bodyBottom: 0.42, low: 0.56, color: "bearish" }),
      structureLine("bearish", [
        { x: 0.08, y: 0.52 },
        { x: 0.92, y: 0.18 },
      ]),
      structureLine("bullish", [
        { x: 0.08, y: 0.86 },
        { x: 0.92, y: 0.56 },
      ]),
    ],
  },
  {
    id: "bull-flag",
    name: "Bull Flag",
    openingBrush: "bullish",
    hint: "pole then pause",
    tip: "Sketch a sharp rise, then a tight downward or sideways pause. SAMPLE: the pause can be a rest if the prior thrust was clean.",
    guides: [
      ...candleGuide({ cx: 0.16, halfW: 0.05, high: 0.58, bodyTop: 0.62, bodyBottom: 0.86, low: 0.9, color: "bullish" }),
      ...candleGuide({ cx: 0.32, halfW: 0.055, high: 0.22, bodyTop: 0.26, bodyBottom: 0.6, low: 0.66, color: "bullish" }),
      ...candleGuide({ cx: 0.52, halfW: 0.04, high: 0.28, bodyTop: 0.32, bodyBottom: 0.48, low: 0.54, color: "bearish" }),
      ...candleGuide({ cx: 0.68, halfW: 0.04, high: 0.34, bodyTop: 0.38, bodyBottom: 0.52, low: 0.58, color: "bearish" }),
      ...candleGuide({ cx: 0.84, halfW: 0.04, high: 0.4, bodyTop: 0.44, bodyBottom: 0.56, low: 0.62, color: "bearish" }),
      structureLine("bullish", [
        { x: 0.46, y: 0.26 },
        { x: 0.92, y: 0.42 },
      ]),
      structureLine("bearish", [
        { x: 0.46, y: 0.54 },
        { x: 0.92, y: 0.64 },
      ]),
    ],
  },
  {
    id: "double-top",
    name: "Double Top",
    openingBrush: "bullish",
    hint: "two highs + neckline",
    tip: "Two similar highs with a dip between. SAMPLE: the second high failed; a break of the dip is the usual confirmation.",
    guides: [
      ...candleGuide({ cx: 0.12, halfW: 0.04, high: 0.5, bodyTop: 0.54, bodyBottom: 0.74, low: 0.8, color: "bullish" }),
      ...candleGuide({ cx: 0.28, halfW: 0.05, high: 0.12, bodyTop: 0.16, bodyBottom: 0.4, low: 0.48, color: "bullish" }),
      ...candleGuide({ cx: 0.46, halfW: 0.045, high: 0.42, bodyTop: 0.46, bodyBottom: 0.68, low: 0.76, color: "bearish" }),
      ...candleGuide({ cx: 0.64, halfW: 0.05, high: 0.12, bodyTop: 0.18, bodyBottom: 0.42, low: 0.5, color: "bullish" }),
      ...candleGuide({ cx: 0.82, halfW: 0.045, high: 0.48, bodyTop: 0.52, bodyBottom: 0.74, low: 0.82, color: "bearish" }),
      structureLine("bearish", [
        { x: 0.08, y: 0.76 },
        { x: 0.92, y: 0.76 },
      ]),
    ],
  },
  {
    id: "double-bottom",
    name: "Double Bottom",
    openingBrush: "bearish",
    hint: "two lows + neckline",
    tip: "Two similar lows with a bounce between. SAMPLE: the second low held; a break of the bounce high is the usual confirmation.",
    guides: [
      ...candleGuide({ cx: 0.12, halfW: 0.04, high: 0.22, bodyTop: 0.26, bodyBottom: 0.46, low: 0.52, color: "bearish" }),
      ...candleGuide({ cx: 0.28, halfW: 0.05, high: 0.5, bodyTop: 0.56, bodyBottom: 0.8, low: 0.88, color: "bearish" }),
      ...candleGuide({ cx: 0.46, halfW: 0.045, high: 0.24, bodyTop: 0.28, bodyBottom: 0.5, low: 0.58, color: "bullish" }),
      ...candleGuide({ cx: 0.64, halfW: 0.05, high: 0.48, bodyTop: 0.54, bodyBottom: 0.78, low: 0.88, color: "bearish" }),
      ...candleGuide({ cx: 0.82, halfW: 0.045, high: 0.18, bodyTop: 0.22, bodyBottom: 0.46, low: 0.54, color: "bullish" }),
      structureLine("bullish", [
        { x: 0.08, y: 0.24 },
        { x: 0.92, y: 0.24 },
      ]),
    ],
  },
  {
    id: "triangle",
    name: "Triangle",
    openingBrush: "bearish",
    hint: "squeeze + two lines",
    tip: "Highs and lows squeeze toward a point. SAMPLE: direction is not the triangle — wait for which side breaks.",
    guides: [
      ...candleGuide({ cx: 0.14, halfW: 0.05, high: 0.12, bodyTop: 0.16, bodyBottom: 0.4, low: 0.86, color: "bearish" }),
      ...candleGuide({ cx: 0.32, halfW: 0.045, high: 0.22, bodyTop: 0.26, bodyBottom: 0.48, low: 0.74, color: "bullish" }),
      ...candleGuide({ cx: 0.5, halfW: 0.04, high: 0.3, bodyTop: 0.34, bodyBottom: 0.52, low: 0.66, color: "bearish" }),
      ...candleGuide({ cx: 0.68, halfW: 0.038, high: 0.36, bodyTop: 0.4, bodyBottom: 0.54, low: 0.6, color: "bullish" }),
      ...candleGuide({ cx: 0.84, halfW: 0.035, high: 0.4, bodyTop: 0.44, bodyBottom: 0.54, low: 0.58, color: "bearish" }),
      structureLine("bearish", [
        { x: 0.08, y: 0.12 },
        { x: 0.92, y: 0.42 },
      ]),
      structureLine("bullish", [
        { x: 0.08, y: 0.86 },
        { x: 0.92, y: 0.56 },
      ]),
    ],
  },
  {
    id: "head-shoulders",
    name: "Head and Shoulders",
    openingBrush: "bullish",
    hint: "three peaks + neckline",
    tip: "Left shoulder, higher head, right shoulder. SAMPLE: a break of the neckline is the usual confirmation — not a live fill.",
    guides: [
      ...candleGuide({ cx: 0.12, halfW: 0.04, high: 0.48, bodyTop: 0.52, bodyBottom: 0.7, low: 0.76, color: "bullish" }),
      ...candleGuide({ cx: 0.28, halfW: 0.045, high: 0.28, bodyTop: 0.32, bodyBottom: 0.52, low: 0.6, color: "bullish" }),
      ...candleGuide({ cx: 0.46, halfW: 0.05, high: 0.1, bodyTop: 0.14, bodyBottom: 0.4, low: 0.5, color: "bullish" }),
      ...candleGuide({ cx: 0.64, halfW: 0.045, high: 0.3, bodyTop: 0.34, bodyBottom: 0.54, low: 0.62, color: "bearish" }),
      ...candleGuide({ cx: 0.82, halfW: 0.04, high: 0.5, bodyTop: 0.54, bodyBottom: 0.74, low: 0.82, color: "bearish" }),
      structureLine("bearish", [
        { x: 0.08, y: 0.62 },
        { x: 0.92, y: 0.62 },
      ]),
    ],
  },
  {
    id: "hanging-man",
    name: "Hanging Man",
    openingBrush: "bearish",
    tip: "Same long lower wick as a hammer, but after a rally. SAMPLE: sellers may be showing up — wait for the next print.",
    guides: candleGuide({
      cx: 0.5,
      halfW: 0.1,
      high: 0.16,
      bodyTop: 0.2,
      bodyBottom: 0.36,
      low: 0.9,
      color: "bearish",
    }),
  },
  {
    id: "evening-star",
    name: "Evening Star",
    openingBrush: "bullish",
    hint: "green · small · red",
    tip: "Three candles: large green, small middle, then large red. SAMPLE teaching — confirm with later bars.",
    guides: [
      ...candleGuide({ cx: 0.22, halfW: 0.08, high: 0.18, bodyTop: 0.22, bodyBottom: 0.72, low: 0.78, color: "bullish" }),
      ...candleGuide({ cx: 0.5, halfW: 0.05, high: 0.14, bodyTop: 0.2, bodyBottom: 0.32, low: 0.4, color: "bullish" }),
      ...candleGuide({ cx: 0.78, halfW: 0.09, high: 0.16, bodyTop: 0.2, bodyBottom: 0.7, low: 0.76, color: "bearish" }),
    ],
  },
  {
    id: "piercing-line",
    name: "Piercing Line",
    openingBrush: "bearish",
    hint: "red then reclaiming green",
    tip: "After a decline, a green body opens lower then closes well into the prior red body.",
    guides: [
      ...candleGuide({ cx: 0.34, halfW: 0.1, high: 0.16, bodyTop: 0.2, bodyBottom: 0.7, low: 0.78, color: "bearish" }),
      ...candleGuide({ cx: 0.66, halfW: 0.1, high: 0.28, bodyTop: 0.34, bodyBottom: 0.82, low: 0.9, color: "bullish" }),
    ],
  },
  {
    id: "dark-cloud-cover",
    name: "Dark Cloud Cover",
    openingBrush: "bullish",
    hint: "green then covering red",
    tip: "After a rally, a red body opens higher then closes well into the prior green body.",
    guides: [
      ...candleGuide({ cx: 0.34, halfW: 0.1, high: 0.22, bodyTop: 0.28, bodyBottom: 0.78, low: 0.86, color: "bullish" }),
      ...candleGuide({ cx: 0.66, halfW: 0.1, high: 0.1, bodyTop: 0.14, bodyBottom: 0.58, low: 0.66, color: "bearish" }),
    ],
  },
  {
    id: "three-white-soldiers",
    name: "Three White Soldiers",
    openingBrush: "bullish",
    hint: "three rising green",
    tip: "Three rising green bodies in a row after a decline or pause — buyers in control on this SAMPLE read.",
    guides: [
      ...candleGuide({ cx: 0.22, halfW: 0.07, high: 0.48, bodyTop: 0.52, bodyBottom: 0.78, low: 0.84, color: "bullish" }),
      ...candleGuide({ cx: 0.5, halfW: 0.07, high: 0.32, bodyTop: 0.36, bodyBottom: 0.62, low: 0.68, color: "bullish" }),
      ...candleGuide({ cx: 0.78, halfW: 0.07, high: 0.16, bodyTop: 0.2, bodyBottom: 0.46, low: 0.52, color: "bullish" }),
    ],
  },
  {
    id: "three-black-crows",
    name: "Three Black Crows",
    openingBrush: "bearish",
    hint: "three falling red",
    tip: "Three falling red bodies in a row after a rally or pause — sellers in control on this SAMPLE read.",
    guides: [
      ...candleGuide({ cx: 0.22, halfW: 0.07, high: 0.16, bodyTop: 0.2, bodyBottom: 0.46, low: 0.52, color: "bearish" }),
      ...candleGuide({ cx: 0.5, halfW: 0.07, high: 0.32, bodyTop: 0.36, bodyBottom: 0.62, low: 0.68, color: "bearish" }),
      ...candleGuide({ cx: 0.78, halfW: 0.07, high: 0.48, bodyTop: 0.52, bodyBottom: 0.78, low: 0.84, color: "bearish" }),
    ],
  },
  {
    id: "harami",
    name: "Harami",
    openingBrush: "bearish",
    hint: "large then nested small",
    tip: "A small body nested inside the prior larger body — indecision after a swing. Direction needs the next print.",
    guides: [
      ...candleGuide({ cx: 0.36, halfW: 0.12, high: 0.12, bodyTop: 0.18, bodyBottom: 0.78, low: 0.88, color: "bearish" }),
      ...candleGuide({ cx: 0.64, halfW: 0.06, high: 0.38, bodyTop: 0.42, bodyBottom: 0.58, low: 0.64, color: "bullish" }),
    ],
  },
];

export function getDrawTemplate(id: DrawTemplateId): DrawTemplate {
  const found = DRAW_TEMPLATES.find((t) => t.id === id);
  if (!found) return DRAW_TEMPLATES[0];
  return found;
}

const GRID_W = 24;
const GRID_H = 16;

function stampStroke(grid: Uint8Array, stroke: Point[], thickness = 1): void {
  if (stroke.length === 0) return;
  for (let i = 0; i < stroke.length; i++) {
    const p = stroke[i];
    const x = Math.round(Math.min(1, Math.max(0, p.x)) * (GRID_W - 1));
    const y = Math.round(Math.min(1, Math.max(0, p.y)) * (GRID_H - 1));
    for (let dy = -thickness; dy <= thickness; dy++) {
      for (let dx = -thickness; dx <= thickness; dx++) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H) {
          grid[ny * GRID_W + nx] = 1;
        }
      }
    }
    if (i > 0) {
      const prev = stroke[i - 1];
      const steps = Math.max(
        1,
        Math.ceil(
          Math.hypot(p.x - prev.x, p.y - prev.y) * Math.max(GRID_W, GRID_H) * 2,
        ),
      );
      for (let s = 1; s < steps; s++) {
        const t = s / steps;
        const ix = prev.x + (p.x - prev.x) * t;
        const iy = prev.y + (p.y - prev.y) * t;
        const gx = Math.round(Math.min(1, Math.max(0, ix)) * (GRID_W - 1));
        const gy = Math.round(Math.min(1, Math.max(0, iy)) * (GRID_H - 1));
        for (let dy = -thickness; dy <= thickness; dy++) {
          for (let dx = -thickness; dx <= thickness; dx++) {
            const nx = gx + dx;
            const ny = gy + dy;
            if (nx >= 0 && nx < GRID_W && ny >= 0 && ny < GRID_H) {
              grid[ny * GRID_W + nx] = 1;
            }
          }
        }
      }
    }
  }
}

function occupancy(strokes: Stroke[], thickness = 1): Uint8Array {
  const grid = new Uint8Array(GRID_W * GRID_H);
  for (const stroke of strokes) stampStroke(grid, stroke.points, thickness);
  return grid;
}

/** Coarse Jaccard similarity of stroke occupancy vs template guides. */
export function scoreSketch(strokes: Stroke[], templateId: DrawTemplateId): number {
  if (strokes.length === 0) return 0;
  const template = getDrawTemplate(templateId);
  const user = occupancy(strokes, 1);
  const guide = occupancy(template.guides, 1);
  let intersection = 0;
  let union = 0;
  for (let i = 0; i < user.length; i++) {
    const u = user[i];
    const g = guide[i];
    if (u || g) union++;
    if (u && g) intersection++;
  }
  if (union === 0) return 0;
  return intersection / union;
}

export function gradeSketch(
  strokes: Stroke[],
  templateId: DrawTemplateId,
): { grade: DrawGrade; score: number; tip: string } {
  const template = getDrawTemplate(templateId);
  const score = scoreSketch(strokes, templateId);
  let grade: DrawGrade = "incorrect";
  if (score >= 0.42) grade = "correct";
  else if (score >= 0.22) grade = "partial";
  return { grade, score, tip: template.tip };
}

function isPoint(v: unknown): v is Point {
  return (
    !!v &&
    typeof v === "object" &&
    typeof (v as Point).x === "number" &&
    typeof (v as Point).y === "number"
  );
}

function normalizeStroke(raw: unknown): Stroke | null {
  if (Array.isArray(raw)) {
    const points = raw.filter(isPoint);
    if (points.length === 0) return null;
    return { points, color: "bullish" };
  }
  if (!raw || typeof raw !== "object") return null;
  const obj = raw as { points?: unknown; color?: unknown };
  if (!Array.isArray(obj.points)) return null;
  const points = obj.points.filter(isPoint);
  if (points.length === 0) return null;
  return {
    points,
    color: obj.color === "bearish" ? "bearish" : "bullish",
  };
}

export function loadLastDrawAttempt(): DrawAttempt | null {
  try {
    const raw = localStorage.getItem(PRACTICE_DRAW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DrawAttempt;
    if (!parsed || !parsed.templateId || !Array.isArray(parsed.strokes)) return null;
    const templateId = parseDrawTemplateId(parsed.templateId);
    if (!templateId) return null;
    const strokes = parsed.strokes
      .map(normalizeStroke)
      .filter((s): s is Stroke => s != null);
    return { ...parsed, templateId, strokes };
  } catch {
    return null;
  }
}

export function saveLastDrawAttempt(attempt: DrawAttempt): void {
  localStorage.setItem(PRACTICE_DRAW_STORAGE_KEY, JSON.stringify(attempt));
}

/** True when learner has submitted at least one graded sketch (any grade). */
export function hasGradedPracticeDraw(): boolean {
  return loadLastDrawAttempt() != null;
}

export function practiceDrawTipLine(attempt?: DrawAttempt | null): string | null {
  const last = attempt ?? loadLastDrawAttempt();
  if (!last) return null;
  return `Practice draw · last ${last.templateId} → ${last.grade} (${Math.round(last.score * 100)}%)`;
}

/** Accepts live ids plus legacy `engulfing` → bullish-engulfing. */
export function parseDrawTemplateId(value: string): DrawTemplateId | null {
  if (value === "engulfing") return "bullish-engulfing";
  if (DRAW_TEMPLATES.some((t) => t.id === value)) return value as DrawTemplateId;
  return null;
}

export function isDrawTemplateId(value: string): value is DrawTemplateId {
  return parseDrawTemplateId(value) != null;
}
