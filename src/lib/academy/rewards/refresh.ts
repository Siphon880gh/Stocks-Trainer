/** Re-evaluates badges against the three academy stores and records newly earned ones (never revokes). */
import { loadAcademy, loadPaper, type KVStorage, type RewardsState } from "../storage";
import { BADGES, earnedBadgeIds } from "./badges";

export function refreshBadges(rewards: RewardsState, storage: KVStorage | undefined, now: Date): { state: RewardsState; added: string[] } {
  const earned = earnedBadgeIds({ academy: loadAcademy(storage).state, paper: loadPaper(storage).state, rewards }, now);
  const added = BADGES.map((b) => b.id).filter((id) => earned.has(id) && !rewards.badges[id]);
  if (added.length === 0) return { state: rewards, added };
  const badges = { ...rewards.badges };
  for (const id of added) badges[id] = now.toISOString();
  return { state: { ...rewards, badges }, added };
}
