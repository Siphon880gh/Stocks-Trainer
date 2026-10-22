/**
 * BA7.M4: one-time catch-up points for progress made elsewhere in the app before the Academy existed.
 * Reads (never writes) the existing keys as raw JSON. Missing or corrupt keys count as zero.
 * Capped at POINTS.retroMax under one ledger key, so repeats only add the delta up to the cap.
 */
import type { KVStorage, RewardsState } from "../storage";
import { POINTS, award } from "./ledger";

export const FOREIGN_KEYS = { progress: "analysis_core_progress_v1", readThePrint: "analysis_core_read_the_print_v1", macro: "macro_desk_progress_v1" } as const;
export const RETRO_KEY = "retro-credit";
export const RETRO_RATES = { milestoneComplete: 10, coachingCompleted: 5, drillFlag: 5, printRoundCorrect: 2, macroRound: 2 } as const;

const readJson = (storage: KVStorage | undefined, key: string): Record<string, unknown> | null => {
  try {
    const raw = storage?.getItem(key);
    if (!raw) return null;
    const v = JSON.parse(raw);
    return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
  } catch {
    return null;
  }
};
const rec = (v: unknown): Record<string, unknown> => (v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : {});

export interface RetroBreakdown {
  milestones: number;
  coaching: number;
  drills: number;
  printRounds: number;
  macroRounds: number;
  raw: number;
  points: number;
}

export function retroBreakdown(storage: KVStorage | undefined): RetroBreakdown {
  const p = readJson(storage, FOREIGN_KEYS.progress);
  const milestones = Object.values(rec(p?.milestones)).filter((m) => rec(m).status === "complete").length;
  const coaching = Object.values(rec(p?.coachingCompleted)).filter((v) => v === true).length;
  const drills = Object.values(rec(p?.drillFlags)).filter((v) => v === true).length;
  const printRounds = Object.values(rec(readJson(storage, FOREIGN_KEYS.readThePrint)?.rounds)).filter((r) => rec(r).correct === true).length;
  const macroRounds = Object.keys(rec(readJson(storage, FOREIGN_KEYS.macro)?.rounds)).length;
  const raw = milestones * RETRO_RATES.milestoneComplete + coaching * RETRO_RATES.coachingCompleted + drills * RETRO_RATES.drillFlag + printRounds * RETRO_RATES.printRoundCorrect + macroRounds * RETRO_RATES.macroRound;
  return { milestones, coaching, drills, printRounds, macroRounds, raw, points: Math.min(POINTS.retroMax, raw) };
}

/** Pure on the rewards state; storage is only read. */
export function applyRetroCredit(rewards: RewardsState, storage: KVStorage | undefined, now = new Date()) {
  const b = retroBreakdown(storage);
  return { ...award(rewards, RETRO_KEY, "retro-credit", b.points, now, "Catch-up for earlier progress"), breakdown: b };
}
