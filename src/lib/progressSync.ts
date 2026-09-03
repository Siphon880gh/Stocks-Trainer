/**
 * Progress export / import + cloud sync stub (E8.M3).
 * Local-only — no silent fake cloud.
 */

import {
  PROGRESS_SCHEMA_VERSION,
  PROGRESS_STORAGE_KEY,
  createDefaultProgress,
  loadProgress,
  saveProgress,
  type ProgressState,
} from "./progressStore";

export type SyncMode = "local_only" | "noop_cloud";

export interface ProgressSyncAdapter {
  mode: SyncMode;
  /** Status shown in the account panel. */
  statusLabel: string;
  /** No-op cloud push; returns local acknowledgment only. */
  push(state: ProgressState): Promise<{ ok: true; stub: true }>;
  /** No-op cloud pull; returns current local state. */
  pull(): Promise<{ state: ProgressState; stub: true }>;
}

export const localOnlySyncAdapter: ProgressSyncAdapter = {
  mode: "local_only",
  statusLabel: "Saved on this device only · no cloud sync",
  async push(state: ProgressState) {
    saveProgress(state);
    return { ok: true as const, stub: true as const };
  },
  async pull() {
    return { state: loadProgress().state, stub: true as const };
  },
};

export function getProgressSyncAdapter(): ProgressSyncAdapter {
  return localOnlySyncAdapter;
}

function isImportableProgress(value: unknown): value is ProgressState {
  if (!value || typeof value !== "object") return false;
  const v = value as ProgressState;
  if (typeof v.schemaVersion !== "number") return false;
  if (typeof v.pathId !== "string" || !v.pathId) return false;
  if (!v.milestones || typeof v.milestones !== "object") return false;
  if (!v.scores || typeof v.scores.totalPoints !== "number") return false;
  if (typeof v.scores.accuracy !== "number") return false;
  if (!v.streaks || typeof v.streaks.current !== "number") return false;
  if (typeof v.streaks.best !== "number") return false;
  if (typeof v.updatedAt !== "string") return false;
  return true;
}

export function exportProgressJson(state?: ProgressState): string {
  const s = state ?? loadProgress().state;
  return JSON.stringify(s, null, 2);
}

export function downloadProgressExport(filename = "analysis_core_progress.json"): void {
  const json = exportProgressJson();
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export interface ImportProgressResult {
  ok: boolean;
  state?: ProgressState;
  recoveryMessage?: string;
}

/** Validate + restore ProgressStore JSON. Rejects corrupt / wrong schema. */
export function importProgressJson(raw: string): ImportProgressResult {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (
      !isImportableProgress(parsed) ||
      parsed.schemaVersion !== PROGRESS_SCHEMA_VERSION
    ) {
      return {
        ok: false,
        recoveryMessage:
          "Import rejected: corrupt or outdated progress file. Local store unchanged.",
      };
    }
    const saved = saveProgress({
      ...parsed,
      caseResults: parsed.caseResults ?? {},
    });
    return { ok: true, state: saved };
  } catch {
    return {
      ok: false,
      recoveryMessage:
        "Import rejected: invalid JSON. Local store unchanged.",
    };
  }
}

export function resetToDefaultProgress(): ProgressState {
  const state = createDefaultProgress();
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(state));
  return state;
}
