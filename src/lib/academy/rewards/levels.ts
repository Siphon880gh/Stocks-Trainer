/** BA7.M2: XP (virtual points) → Academy rank. Thresholds strictly increase. Virtual only. */
export const XP_THRESHOLDS = [0, 100, 250, 450, 700, 1000, 1400, 1900, 2500, 3200] as const;
export const RANK_NAMES = ["Newcomer", "Learner", "Reader", "Planner", "Practitioner", "Disciplined", "Steady hand", "Mentor-ready", "Veteran", "Academy graduate"] as const;

export interface RankInfo {
  rank: number;
  name: string;
  points: number;
  /** Points where this rank starts / the next starts (null at the top). */
  floor: number;
  next: number | null;
  /** 0..1 progress to the next rank (1 at the top). */
  progress: number;
}

export function rankForPoints(points: number): RankInfo {
  const p = Math.max(0, Math.floor(points));
  let r = 0;
  for (let i = 0; i < XP_THRESHOLDS.length; i++) if (p >= XP_THRESHOLDS[i]!) r = i;
  const floor = XP_THRESHOLDS[r]!;
  const next = r + 1 < XP_THRESHOLDS.length ? XP_THRESHOLDS[r + 1]! : null;
  return { rank: r + 1, name: RANK_NAMES[r]!, points: p, floor, next, progress: next === null ? 1 : (p - floor) / (next - floor) };
}
