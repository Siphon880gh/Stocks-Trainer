/**
 * Saved progress for Tool Training (TT14): per lesson, the drill and scenario picks, find-it-yourself records,
 * simulations walked to the end and workflow note fields. One localStorage key, same shape rules as
 * `mapProgress.ts` (tolerant load, silent save). Opening a lesson is not progress; doing its items is.
 */
import type { FindTaskRecord } from "./tasks";
import type { ToolLesson } from "./types";

export const TOOL_PROGRESS_KEY = "analysis_core_tool_training_v1";

export interface ToolLessonProgress {
  /** Drill or scenario id → the option index picked (first pick sticks, like the page). */
  drills: Record<string, number>;
  tasks: Record<string, FindTaskRecord>;
  /** Simulation id → ISO time it was walked to the last step. */
  walks: Record<string, string>;
  /** Workflow field key → value. */
  notes: Record<string, string>;
  updatedAt?: string;
}

export interface ToolProgressStore {
  lessons: Record<string, ToolLessonProgress>;
}

export interface ProgressKV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

const browser = (): ProgressKV | undefined => {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
};

export const emptyLessonProgress = (): ToolLessonProgress => ({ drills: {}, tasks: {}, walks: {}, notes: {} });

const obj = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});
const pick = <T,>(v: unknown, ok: (x: unknown) => x is T): Record<string, T> =>
  Object.fromEntries(Object.entries(obj(v)).filter((e): e is [string, T] => ok(e[1])));
const isNum = (x: unknown): x is number => typeof x === "number" && Number.isInteger(x) && x >= 0;
const isStr = (x: unknown): x is string => typeof x === "string";
const isRec = (x: unknown): x is FindTaskRecord => {
  const r = obj(x);
  return isStr(r.value) && isStr(r.stamp) && isStr(r.checkedAt) && typeof r.ok === "boolean";
};

function cleanLesson(v: unknown): ToolLessonProgress {
  const o = obj(v);
  return {
    drills: pick(o.drills, isNum),
    tasks: pick(o.tasks, isRec),
    walks: pick(o.walks, isStr),
    notes: pick(o.notes, isStr),
    ...(isStr(o.updatedAt) ? { updatedAt: o.updatedAt } : {}),
  };
}

export function loadToolProgress(storage: ProgressKV | undefined = browser()): ToolProgressStore {
  try {
    const raw = storage?.getItem(TOOL_PROGRESS_KEY);
    if (!raw) return { lessons: {} };
    const lessons = obj(obj(JSON.parse(raw)).lessons);
    return { lessons: Object.fromEntries(Object.entries(lessons).map(([k, v]) => [k, cleanLesson(v)])) };
  } catch {
    return { lessons: {} };
  }
}

export function loadLessonProgress(lessonId: string, storage: ProgressKV | undefined = browser()): ToolLessonProgress {
  return loadToolProgress(storage).lessons[lessonId] ?? emptyLessonProgress();
}

/** Replace one lesson's progress (or remove it with `null`) and save. */
export function saveLessonProgress(lessonId: string, p: ToolLessonProgress | null, storage: ProgressKV | undefined = browser(), now = new Date()): void {
  const s = loadToolProgress(storage);
  if (p) s.lessons[lessonId] = { ...p, updatedAt: now.toISOString() };
  else delete s.lessons[lessonId];
  try {
    storage?.setItem(TOOL_PROGRESS_KEY, JSON.stringify(s));
  } catch {
    /* storage full or blocked: progress just is not kept */
  }
}

/** Pure updates (the page saves the result). A drill's first pick sticks. */
export const withDrill = (p: ToolLessonProgress, id: string, pickIndex: number): ToolLessonProgress =>
  p.drills[id] !== undefined ? p : { ...p, drills: { ...p.drills, [id]: pickIndex } };
export const withTask = (p: ToolLessonProgress, id: string, rec: FindTaskRecord): ToolLessonProgress => ({ ...p, tasks: { ...p.tasks, [id]: rec } });
export const withWalk = (p: ToolLessonProgress, simId: string, now = new Date()): ToolLessonProgress =>
  p.walks[simId] ? p : { ...p, walks: { ...p.walks, [simId]: now.toISOString() } };
export const withNote = (p: ToolLessonProgress, key: string, value: string): ToolLessonProgress => ({ ...p, notes: { ...p.notes, [key]: value } });

export interface LessonCompletion {
  /** Items finished: drills and scenarios answered, tasks recorded, walks finished, a workflow fully filled. */
  done: number;
  total: number;
  fraction: number;
  right: number;
  answered: number;
  parts: { drills: [number, number]; scenarios: [number, number]; tasks: [number, number]; walks: [number, number]; workflow: [number, number] };
}

export function lessonCompletion(lesson: ToolLesson, p: ToolLessonProgress = emptyLessonProgress()): LessonCompletion {
  const answered = (ds: { id: string }[]) => ds.filter((d) => p.drills[d.id] !== undefined).length;
  const scen = lesson.scenarios;
  const sims = lesson.simulations ?? [];
  const fields = lesson.workflow?.steps.flatMap((s) => s.fields) ?? [];
  const parts: LessonCompletion["parts"] = {
    drills: [answered(lesson.drills), lesson.drills.length],
    scenarios: [answered(scen), scen.length],
    tasks: [lesson.tasks.filter((t) => p.tasks[t.id]?.ok).length, lesson.tasks.length],
    walks: [sims.filter((s) => p.walks[s.id]).length, sims.length],
    workflow: [fields.length && fields.every((f) => p.notes[f.key]?.trim()) ? 1 : 0, fields.length ? 1 : 0],
  };
  const done = Object.values(parts).reduce((a, [d]) => a + d, 0);
  const total = Object.values(parts).reduce((a, [, t]) => a + t, 0);
  const all = [...lesson.drills, ...scen];
  return {
    done,
    total,
    fraction: total ? done / total : 0,
    right: all.filter((d) => p.drills[d.id] === d.answer).length,
    answered: all.filter((d) => p.drills[d.id] !== undefined).length,
    parts,
  };
}

/** The Tool Training hub's share on the Progress Map: the average lesson completion. Opening a lesson adds nothing. */
export function toolTrainingShare(lessons: ToolLesson[], store: ToolProgressStore): number {
  if (!lessons.length) return 0;
  return lessons.reduce((a, l) => a + lessonCompletion(l, store.lessons[l.id]).fraction, 0) / lessons.length;
}
