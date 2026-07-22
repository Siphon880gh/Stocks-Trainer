/** Practice Draw templates, grading, and last-attempt persistence (E7.M1). */

export type Point = { x: number; y: number };
export type Stroke = Point[];

export type DrawTemplateId = "doji" | "hammer" | "engulfing";

export type DrawGrade = "correct" | "partial" | "incorrect";

export interface DrawTemplate {
  id: DrawTemplateId;
  name: string;
  /** Normalized polyline guides (0–1 in canvas space). */
  guides: Stroke[];
  tip: string;
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

export const DRAW_TEMPLATES: DrawTemplate[] = [
  {
    id: "doji",
    name: "Doji",
    tip: "Keep the body tiny (open≈close) and balance upper/lower shadows.",
    guides: [
      // vertical wick
      [
        { x: 0.5, y: 0.12 },
        { x: 0.5, y: 0.88 },
      ],
      // thin cross body
      [
        { x: 0.38, y: 0.5 },
        { x: 0.62, y: 0.5 },
      ],
    ],
  },
  {
    id: "hammer",
    name: "Hammer",
    tip: "Small body near the top; long lower shadow at least 2× the body.",
    guides: [
      // long lower wick
      [
        { x: 0.5, y: 0.22 },
        { x: 0.5, y: 0.9 },
      ],
      // small body near top
      [
        { x: 0.4, y: 0.22 },
        { x: 0.6, y: 0.22 },
        { x: 0.6, y: 0.38 },
        { x: 0.4, y: 0.38 },
        { x: 0.4, y: 0.22 },
      ],
    ],
  },
  {
    id: "engulfing",
    name: "Engulfing",
    tip: "Second candle body should fully cover the first candle body.",
    guides: [
      // small prior body
      [
        { x: 0.28, y: 0.42 },
        { x: 0.42, y: 0.42 },
        { x: 0.42, y: 0.58 },
        { x: 0.28, y: 0.58 },
        { x: 0.28, y: 0.42 },
      ],
      // large engulfing body
      [
        { x: 0.48, y: 0.28 },
        { x: 0.72, y: 0.28 },
        { x: 0.72, y: 0.72 },
        { x: 0.48, y: 0.72 },
        { x: 0.48, y: 0.28 },
      ],
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

function stampStroke(grid: Uint8Array, stroke: Stroke, thickness = 1): void {
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
  for (const stroke of strokes) stampStroke(grid, stroke, thickness);
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

export function loadLastDrawAttempt(): DrawAttempt | null {
  try {
    const raw = localStorage.getItem(PRACTICE_DRAW_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DrawAttempt;
    if (!parsed || !parsed.templateId || !Array.isArray(parsed.strokes)) return null;
    return parsed;
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

export function isDrawTemplateId(value: string): value is DrawTemplateId {
  return DRAW_TEMPLATES.some((t) => t.id === value);
}
