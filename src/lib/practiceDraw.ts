/** Practice Draw templates, grading, and last-attempt persistence (E7.M1). */

export type Point = { x: number; y: number };

/** Matches chart candles: green close>open, red close<open. */
export type BrushColor = "bullish" | "bearish";

export const BRUSH_HEX: Record<BrushColor, string> = {
  bullish: "#38ff14",
  bearish: "#ff3814",
};

export interface Stroke {
  points: Point[];
  color: BrushColor;
}

export type DrawTemplateId =
  | "doji"
  | "hammer"
  | "bullish-engulfing"
  | "bearish-engulfing";

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
  const label = last.grade.toUpperCase();
  return `PRACTICE_DRAW · last ${last.templateId} → ${label} (${Math.round(last.score * 100)}%)`;
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
