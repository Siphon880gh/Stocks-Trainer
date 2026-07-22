import type { CoachingDecisionGraph } from "./types";
import { ensureKnownNode, initialNavState, type CoachingNavState } from "./navigate";

export interface CoachingPersistAdapter {
  load(slug: string, tree: CoachingDecisionGraph): CoachingNavState;
  save(slug: string, state: CoachingNavState): void;
  clear(slug: string): void;
}

const KEY_PREFIX = "analysis_core_coaching_nav_v1:";

function storageKey(slug: string): string {
  return `${KEY_PREFIX}${slug}`;
}

function readRaw(slug: string): unknown {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(storageKey(slug));
    if (!raw) return null;
    return JSON.parse(raw) as unknown;
  } catch {
    return null;
  }
}

function parseState(raw: unknown): CoachingNavState | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.currentNodeId !== "string") return null;
  if (!Array.isArray(o.history) || !o.history.every((h) => typeof h === "string")) {
    return null;
  }
  return { currentNodeId: o.currentNodeId, history: o.history as string[] };
}

/** Default adapter: tab-scoped sessionStorage. Swap for URL/localStorage later. */
export const sessionStoragePersistAdapter: CoachingPersistAdapter = {
  load(slug, tree) {
    const parsed = parseState(readRaw(slug));
    if (!parsed) return initialNavState(tree);
    return ensureKnownNode(tree, parsed);
  },
  save(slug, state) {
    if (typeof sessionStorage === "undefined") return;
    try {
      sessionStorage.setItem(
        storageKey(slug),
        JSON.stringify({
          currentNodeId: state.currentNodeId,
          history: state.history,
        })
      );
    } catch {
      /* quota / private mode — ignore */
    }
  },
  clear(slug) {
    if (typeof sessionStorage === "undefined") return;
    try {
      sessionStorage.removeItem(storageKey(slug));
    } catch {
      /* ignore */
    }
  },
};

let activeAdapter: CoachingPersistAdapter = sessionStoragePersistAdapter;

export function getCoachingPersistAdapter(): CoachingPersistAdapter {
  return activeAdapter;
}

/** Test / future URL adapter hook. */
export function setCoachingPersistAdapter(adapter: CoachingPersistAdapter): void {
  activeAdapter = adapter;
}
