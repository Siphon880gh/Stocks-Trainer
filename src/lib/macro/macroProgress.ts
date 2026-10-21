/** Macro Desk progress (MF5.M3): its own localStorage key; no existing keys are read or written. */
export const MACRO_PROGRESS_KEY = "macro_desk_progress_v1";

export interface MacroProgress {
  /** Round id → best correct calls out of total. */
  rounds: Record<string, { best: number; total: number; at: string }>;
}

export interface KVStorage {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

const browserStorage = (): KVStorage | undefined => {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
};

export function loadMacroProgress(storage: KVStorage | undefined = browserStorage()): MacroProgress {
  try {
    const raw = storage?.getItem(MACRO_PROGRESS_KEY);
    if (!raw) return { rounds: {} };
    const p = JSON.parse(raw) as MacroProgress;
    return p && typeof p.rounds === "object" ? p : { rounds: {} };
  } catch {
    return { rounds: {} };
  }
}

/** Records a finished round, keeping the best score. Returns the updated progress. */
export function recordRound(roundId: string, correct: number, total: number, storage: KVStorage | undefined = browserStorage(), now = new Date()): MacroProgress {
  const p = loadMacroProgress(storage);
  const prev = p.rounds[roundId];
  if (!prev || correct > prev.best) p.rounds[roundId] = { best: correct, total, at: now.toISOString() };
  try {
    storage?.setItem(MACRO_PROGRESS_KEY, JSON.stringify(p));
  } catch {
    /* storage full or blocked: progress is best-effort */
  }
  return p;
}

export function progressSummary(p: MacroProgress, roundIds: string[]) {
  const done = roundIds.filter((id) => p.rounds[id]);
  const correct = done.reduce((a, id) => a + p.rounds[id]!.best, 0);
  const total = done.reduce((a, id) => a + p.rounds[id]!.total, 0);
  return { completed: done.length, of: roundIds.length, correct, total };
}
