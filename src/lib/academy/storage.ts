/**
 * BA0.M3: Academy persistence. Three keys of its own, each with `schemaVersion`, a lossless migration from
 * v0 (missing fields) and corruption recovery to an empty state. It never reads or writes
 * `analysis_core_progress_v1` or any other key (rewards/retro.ts reads foreign keys read-only).
 */
import type { LevelId, PointsEvent } from "./types";
import type { PaperSessionLog } from "./paper/types";

export const ACADEMY_KEY = "analysis_core_academy_v1";
export const PAPER_KEY = "analysis_core_academy_paper_v1";
export const REWARDS_KEY = "analysis_core_academy_rewards_v1";
export const ACADEMY_KEYS = [ACADEMY_KEY, PAPER_KEY, REWARDS_KEY] as const;
export const SCHEMA_VERSION = 1;

export const RECOVERY_MESSAGE = "Your Academy progress on this device could not be read, so it was reset. Other app progress is untouched.";

export interface KVStorage {
  getItem(k: string): string | null;
  setItem(k: string, v: string): void;
}

export const browserStorage = (): KVStorage | undefined => {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
};

export interface UnitRecord {
  /** Best correct answers out of `total` (kept on a worse retry). */
  best: number;
  total: number;
  attempts: number;
  lastAt: string;
  masteredAt?: string;
}

export interface PlacementRecord {
  startLevel: LevelId;
  correct: number;
  total: number;
  skipped: boolean;
  at: string;
}

export interface OptionsLadderRecord {
  /** Level number ("1".."4") → when the knowledge check was passed. */
  passed: Record<string, string>;
  /** Level → ISO times of attempts (for the 3-per-rolling-24-h limit). */
  attempts: Record<string, string[]>;
  /** Level → when the risk acknowledgement was ticked. */
  acknowledged: Record<string, string>;
}

export interface AcademyState {
  schemaVersion: number;
  units: Record<string, UnitRecord>;
  testedOut: Partial<Record<LevelId, { at: string; correct: number; total: number }>>;
  placement?: PlacementRecord;
  placementDismissed?: boolean;
  options: OptionsLadderRecord;
  /** Local date key (YYYY-MM-DD) → the Today card's review question answer. */
  daily: Record<string, { questionId: string; correct: boolean }>;
  updatedAt: string;
}

export interface ChallengeAttemptRecord {
  score: number;
  max: number;
  passed: boolean;
  at: string;
}

export interface PaperStore {
  schemaVersion: number;
  session: PaperSessionLog | null;
  challengeAttempts: Record<string, ChallengeAttemptRecord[]>;
  /** Counters used by badges (first limit fill, trailing exits, trades with a stop…). */
  stats: { orders: number; limitFills: number; trailingExits: number; stopProtectedTrades: number; stopLimitNoFills: number };
  /** BA11.M6: the active portfolio (its session is `session`). A store from before M6 migrates into "Main". */
  portfolio: { id: string; name: string };
  /** BA11.M6: the inactive portfolios with their own sessions. */
  otherPortfolios: { id: string; name: string; session: PaperSessionLog | null }[];
}

export interface RewardsState {
  schemaVersion: number;
  ledger: PointsEvent[];
  badges: Record<string, string>;
  /** Local day keys with learning activity (sorted, unique) and days covered by a streak freeze. */
  streak: { days: string[]; freezes: string[] };
  updatedAt: string;
}

export interface Loaded<T> {
  state: T;
  recovered: boolean;
  message?: string;
}

const EPOCH = "1970-01-01T00:00:00.000Z";

export const emptyAcademy = (): AcademyState => ({
  schemaVersion: SCHEMA_VERSION,
  units: {},
  testedOut: {},
  options: { passed: {}, attempts: {}, acknowledged: {} },
  daily: {},
  updatedAt: EPOCH,
});
export const emptyPaper = (): PaperStore => ({
  schemaVersion: SCHEMA_VERSION,
  session: null,
  challengeAttempts: {},
  stats: { orders: 0, limitFills: 0, trailingExits: 0, stopProtectedTrades: 0, stopLimitNoFills: 0 },
  portfolio: { id: "main", name: "Main" },
  otherPortfolios: [],
});
export const emptyRewards = (): RewardsState => ({
  schemaVersion: SCHEMA_VERSION,
  ledger: [],
  badges: {},
  streak: { days: [], freezes: [] },
  updatedAt: EPOCH,
});

const isObj = (v: unknown): v is Record<string, unknown> => !!v && typeof v === "object" && !Array.isArray(v);
const obj = <T>(v: unknown, fallback: T): T => (isObj(v) ? (v as T) : fallback);
const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);

/** v0 (no schemaVersion / missing fields) → v1. Keeps every field it understands; fills the rest. Throws on non-objects. */
export function migrateAcademy(raw: unknown): AcademyState {
  if (!isObj(raw)) throw new Error("academy: not an object");
  const e = emptyAcademy();
  const o = obj<Partial<OptionsLadderRecord>>(raw.options, {});
  return {
    schemaVersion: SCHEMA_VERSION,
    units: obj(raw.units, e.units),
    testedOut: obj(raw.testedOut, e.testedOut),
    ...(isObj(raw.placement) ? { placement: raw.placement as unknown as PlacementRecord } : {}),
    ...(typeof raw.placementDismissed === "boolean" ? { placementDismissed: raw.placementDismissed } : {}),
    options: { passed: obj(o.passed, {}), attempts: obj(o.attempts, {}), acknowledged: obj(o.acknowledged, {}) },
    daily: obj(raw.daily, e.daily),
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : e.updatedAt,
  };
}

export function migratePaper(raw: unknown): PaperStore {
  if (!isObj(raw)) throw new Error("paper: not an object");
  const e = emptyPaper();
  return {
    schemaVersion: SCHEMA_VERSION,
    session: isObj(raw.session) ? (raw.session as unknown as PaperSessionLog) : null,
    challengeAttempts: obj(raw.challengeAttempts, e.challengeAttempts),
    stats: { ...e.stats, ...obj<Partial<PaperStore["stats"]>>(raw.stats, {}) },
    portfolio: isObj(raw.portfolio) && typeof raw.portfolio.id === "string" && typeof raw.portfolio.name === "string" ? { id: raw.portfolio.id, name: raw.portfolio.name } : e.portfolio,
    otherPortfolios: arr<Record<string, unknown>>(raw.otherPortfolios)
      .filter((p) => isObj(p) && typeof p.id === "string" && typeof p.name === "string")
      .map((p) => ({ id: p.id as string, name: p.name as string, session: isObj(p.session) ? (p.session as unknown as PaperSessionLog) : null })),
  };
}

export function migrateRewards(raw: unknown): RewardsState {
  if (!isObj(raw)) throw new Error("rewards: not an object");
  const e = emptyRewards();
  const s = obj<Partial<RewardsState["streak"]>>(raw.streak, {});
  return {
    schemaVersion: SCHEMA_VERSION,
    ledger: arr<PointsEvent>(raw.ledger),
    badges: obj(raw.badges, e.badges),
    streak: { days: arr<string>(s.days), freezes: arr<string>(s.freezes) },
    updatedAt: typeof raw.updatedAt === "string" ? raw.updatedAt : e.updatedAt,
  };
}

function load<T>(key: string, migrate: (raw: unknown) => T, empty: () => T, storage: KVStorage | undefined): Loaded<T> {
  let raw: string | null = null;
  try {
    raw = storage?.getItem(key) ?? null;
  } catch {
    return { state: empty(), recovered: false };
  }
  if (raw == null) return { state: empty(), recovered: false };
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (isObj(parsed) && typeof parsed.schemaVersion === "number" && parsed.schemaVersion > SCHEMA_VERSION) {
      // Written by a newer build: don't guess, start empty but don't overwrite until the learner saves.
      return { state: empty(), recovered: true, message: RECOVERY_MESSAGE };
    }
    return { state: migrate(parsed), recovered: false };
  } catch {
    return { state: empty(), recovered: true, message: RECOVERY_MESSAGE };
  }
}

function save<T>(key: string, state: T, storage: KVStorage | undefined): T {
  try {
    storage?.setItem(key, JSON.stringify(state));
  } catch {
    /* quota or blocked storage: Academy progress is best-effort */
  }
  return state;
}

export const loadAcademy = (storage: KVStorage | undefined = browserStorage()) => load(ACADEMY_KEY, migrateAcademy, emptyAcademy, storage);
export const loadPaper = (storage: KVStorage | undefined = browserStorage()) => load(PAPER_KEY, migratePaper, emptyPaper, storage);
export const loadRewards = (storage: KVStorage | undefined = browserStorage()) => load(REWARDS_KEY, migrateRewards, emptyRewards, storage);

export const saveAcademy = (s: AcademyState, storage: KVStorage | undefined = browserStorage(), now = new Date()) =>
  save(ACADEMY_KEY, { ...s, schemaVersion: SCHEMA_VERSION, updatedAt: now.toISOString() }, storage);
export const savePaper = (s: PaperStore, storage: KVStorage | undefined = browserStorage()) => save(PAPER_KEY, { ...s, schemaVersion: SCHEMA_VERSION }, storage);
export const saveRewards = (s: RewardsState, storage: KVStorage | undefined = browserStorage(), now = new Date()) =>
  save(REWARDS_KEY, { ...s, schemaVersion: SCHEMA_VERSION, updatedAt: now.toISOString() }, storage);

/** Test helper and in-memory fallback. */
export function memoryStorage(seed: Record<string, string> = {}): KVStorage & { data: Map<string, string>; reads: string[]; writes: string[] } {
  const data = new Map(Object.entries(seed));
  const reads: string[] = [];
  const writes: string[] = [];
  return {
    data,
    reads,
    writes,
    getItem: (k) => {
      reads.push(k);
      return data.get(k) ?? null;
    },
    setItem: (k, v) => {
      writes.push(k);
      data.set(k, v);
    },
  };
}
