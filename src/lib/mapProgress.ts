/**
 * Lightweight progress the Progress Map (#23) needs that no other store keeps: routes visited and the best
 * Learn quiz score per group. Its own localStorage key; nothing else is read or written here.
 */
export const MAP_PROGRESS_KEY = "analysis_core_map_v1";
/** Same pass mark as Training quizzes (progressStore QUIZ_PASS_PCT); duplicated to keep this module import-free. */
const PASS_PCT = 70;
const MAX_VISITED = 500;

export interface MapStore {
  visited: string[];
  quiz: Record<string, { best: number; passed: boolean }>;
}

export interface KV {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

const browser = (): KV | undefined => {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
};

export const emptyMapStore = (): MapStore => ({ visited: [], quiz: {} });

export function loadMapStore(storage: KV | undefined = browser()): MapStore {
  try {
    const raw = storage?.getItem(MAP_PROGRESS_KEY);
    if (!raw) return emptyMapStore();
    const v = JSON.parse(raw) as Partial<MapStore>;
    return {
      visited: Array.isArray(v.visited) ? v.visited.filter((x) => typeof x === "string") : [],
      quiz: v.quiz && typeof v.quiz === "object" ? v.quiz : {},
    };
  } catch {
    return emptyMapStore();
  }
}

function save(s: MapStore, storage: KV | undefined) {
  try {
    storage?.setItem(MAP_PROGRESS_KEY, JSON.stringify(s));
  } catch {
    /* storage full or blocked: the map just shows less progress */
  }
}

/** "/practice/which-way/" → "/practice/which-way"; query and hash dropped. */
export const normalizePath = (path: string) => {
  const p = path.split(/[?#]/)[0] || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") : "/";
};

export function recordVisit(path: string, storage: KV | undefined = browser()): void {
  const p = normalizePath(path);
  const s = loadMapStore(storage);
  if (s.visited.includes(p)) return;
  s.visited = [...s.visited, p].slice(-MAX_VISITED);
  save(s, storage);
}

/** Keep the best accuracy per Learn group; `passed` sticks once reached. */
export function recordQuizResult(groupId: string, accuracy: number, storage: KV | undefined = browser()): void {
  const s = loadMapStore(storage);
  const prev = s.quiz[groupId];
  s.quiz[groupId] = { best: Math.max(prev?.best ?? 0, accuracy), passed: !!prev?.passed || accuracy >= PASS_PCT };
  save(s, storage);
}
