/**
 * Read the Print progress (FE5.M3). Its OWN localStorage key; existing progress keys are untouched.
 */
export const READ_THE_PRINT_KEY = "analysis_core_read_the_print_v1";
export const READ_THE_PRINT_SCHEMA = 1;

export interface RoundRecord {
  correct: boolean;
  followCorrect?: boolean;
  /** ISO timestamp of the latest attempt. */
  at: string;
}

export interface ReadThePrintProgress {
  version: 1;
  rounds: Record<string, RoundRecord>;
  bestSessionScore: number;
  sessions: number;
}

/** Minimal Storage subset so tests can inject a fake. */
export interface KeyValueStore {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

export const emptyPrintProgress = (): ReadThePrintProgress => ({ version: 1, rounds: {}, bestSessionScore: 0, sessions: 0 });

function defaultStore(): KeyValueStore | undefined {
  try {
    return typeof localStorage === "undefined" ? undefined : localStorage;
  } catch {
    return undefined;
  }
}

/** Pass `null` for "no storage" (tests, private mode). */
export function loadPrintProgress(store: KeyValueStore | null | undefined = defaultStore()): ReadThePrintProgress {
  if (!store) return emptyPrintProgress();
  try {
    const raw = store.getItem(READ_THE_PRINT_KEY);
    if (!raw) return emptyPrintProgress();
    const p = JSON.parse(raw) as Partial<ReadThePrintProgress>;
    if (p.version !== 1 || typeof p.rounds !== "object" || p.rounds === null) return emptyPrintProgress();
    return {
      version: 1,
      rounds: p.rounds as Record<string, RoundRecord>,
      bestSessionScore: Number.isFinite(p.bestSessionScore) ? (p.bestSessionScore as number) : 0,
      sessions: Number.isFinite(p.sessions) ? (p.sessions as number) : 0,
    };
  } catch {
    return emptyPrintProgress();
  }
}

export function savePrintProgress(p: ReadThePrintProgress, store: KeyValueStore | null | undefined = defaultStore()): void {
  store?.setItem(READ_THE_PRINT_KEY, JSON.stringify(p));
}

/** Record one answered round. Pure: returns a new object. */
export function recordRound(p: ReadThePrintProgress, roundId: string, correct: boolean, followCorrect: boolean | undefined, now: Date): ReadThePrintProgress {
  const rec: RoundRecord = followCorrect === undefined ? { correct, at: now.toISOString() } : { correct, followCorrect, at: now.toISOString() };
  return { ...p, rounds: { ...p.rounds, [roundId]: rec } };
}

/** Close a session: bump the count and keep the best score. Pure. */
export function finishSession(p: ReadThePrintProgress, sessionScore: number): ReadThePrintProgress {
  return { ...p, sessions: p.sessions + 1, bestSessionScore: Math.max(p.bestSessionScore, sessionScore) };
}

export function completedCount(p: ReadThePrintProgress): number {
  return Object.keys(p.rounds).length;
}

export function correctCount(p: ReadThePrintProgress): number {
  return Object.values(p.rounds).filter((r) => r.correct).length;
}

/** Points per round: 2 for the step-2 call, +1 for the follow-through. */
export function roundPoints(correct: boolean, followCorrect: boolean | undefined): number {
  return (correct ? 2 : 0) + (followCorrect ? 1 : 0);
}
