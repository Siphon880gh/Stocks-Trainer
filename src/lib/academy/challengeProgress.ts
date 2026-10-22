/**
 * Half-played paper challenges (Weng 2026-10-22). The run's session log is kept in the paper key's
 * `challengeProgress` (schema v2) after every move, offered back as Resume / Restart, and cleared when the run
 * finishes or restarts. A saved log that no longer fits its challenge (other tape, cash, window, or a log the
 * engine cannot replay) is ignored rather than resumed.
 */
import { endBar, type Challenge } from "./challenges";
import { replay } from "./paper/session";
import type { PaperSessionLog } from "./paper/types";
import type { PaperStore } from "./storage";

/** The saved run to offer, or null when there is none worth resuming (nothing played yet, finished, or invalid). */
export function savedRun(c: Challenge, store: PaperStore): PaperSessionLog | null {
  const log = store.challengeProgress?.[c.id];
  if (!log) return null;
  if (log.tapeId !== c.tapeId || log.startingCash !== c.startingCash) return null;
  if (!Number.isInteger(log.bar) || log.bar < c.startBar || log.bar >= endBar(c)) return null;
  if (log.bar === c.startBar && log.actions.length === 0) return null;
  try {
    replay(log);
  } catch {
    return null;
  }
  return log;
}

/** Save (or replace) the run in progress. */
export const keepRun = (store: PaperStore, id: string, log: PaperSessionLog): PaperStore => ({
  ...store,
  challengeProgress: { ...store.challengeProgress, [id]: log },
});

/** Drop the run in progress (finished or restarted). */
export function clearRun(store: PaperStore, id: string): PaperStore {
  if (!store.challengeProgress?.[id]) return store;
  const rest = { ...store.challengeProgress };
  delete rest[id];
  return { ...store, challengeProgress: rest };
}
