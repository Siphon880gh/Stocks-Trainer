/** Paper desk persistence: its own localStorage key, so the /paper account and challenges are untouched. */
import { browserStorage, type KVStorage } from "../../storage";
import { getDeskScenario } from "./scenarios";
import type { DeskLog } from "./types";

export const DESK_KEY = "analysis_core_paper_desk_v1";
export const DESK_SCHEMA_VERSION = 1;

export interface DeskStore {
  session: DeskLog | null;
  /** Sessions finished (stepped to the last bar) per scenario: the progress map counts these. */
  completed: Record<string, number>;
}

export const emptyDesk = (): DeskStore => ({ session: null, completed: {} });

const isObj = (x: unknown): x is Record<string, unknown> => typeof x === "object" && x !== null && !Array.isArray(x);

export function migrateDesk(raw: unknown): DeskStore {
  if (!isObj(raw)) return emptyDesk();
  const s = raw.session;
  const session =
    isObj(s) && typeof s.scenarioId === "string" && getDeskScenario(s.scenarioId) && typeof s.startingCash === "number" && typeof s.bar === "number" && Array.isArray(s.actions)
      ? (s as unknown as DeskLog)
      : null;
  const completed = isObj(raw.completed) ? Object.fromEntries(Object.entries(raw.completed).filter(([, v]) => typeof v === "number")) as Record<string, number> : {};
  return { session, completed };
}

export function loadDesk(storage: KVStorage | undefined = browserStorage()): DeskStore {
  try {
    const raw = storage?.getItem(DESK_KEY);
    if (!raw) return emptyDesk();
    const parsed = JSON.parse(raw) as unknown;
    if (isObj(parsed) && typeof parsed.schemaVersion === "number" && parsed.schemaVersion > DESK_SCHEMA_VERSION) return emptyDesk();
    return migrateDesk(parsed);
  } catch {
    return emptyDesk();
  }
}

export function saveDesk(s: DeskStore, storage: KVStorage | undefined = browserStorage()): DeskStore {
  try {
    storage?.setItem(DESK_KEY, JSON.stringify({ ...s, schemaVersion: DESK_SCHEMA_VERSION }));
  } catch {
    /* best-effort */
  }
  return s;
}
