/**
 * BA7.M3: badges. Each badge is a predicate over the Academy, paper and rewards stores. Badges are virtual,
 * original (Material Symbols icons), and never revoked: refresh.ts only ever adds.
 */
import type { Badge, LevelId } from "../types";
import type { AcademyState, PaperStore, RewardsState } from "../storage";
import { isLevelComplete } from "../progress";
import { totalCounters } from "../paper/counters";
import { CHALLENGES, type ChallengeTheme } from "../challenges";
import { computeStreak } from "./streak";
import { totalPoints } from "./ledger";

export interface BadgeInput {
  academy: AcademyState;
  paper: PaperStore;
  rewards: RewardsState;
}

interface BadgeDef extends Badge {
  earned: (i: BadgeInput, now: Date) => boolean;
}

const mastered = (a: AcademyState) => Object.values(a.units).filter((u) => u.masteredAt).length;
const levelDone = (l: LevelId) => (i: BadgeInput) => isLevelComplete(i.academy, l);
const passedChallenges = (p: PaperStore) => Object.entries(p.challengeAttempts).filter(([, a]) => a.some((x) => x.passed)).map(([id]) => id);
const passedThemes = (p: PaperStore) => new Set(passedChallenges(p).map((id) => CHALLENGES.find((c) => c.id === id)?.theme).filter(Boolean) as ChallengeTheme[]);
const bestStreak = (i: BadgeInput, now: Date) => computeStreak(i.rewards.streak.days, now).best;

const DEFS: BadgeDef[] = [
  { id: "first-unit", name: "First Step", icon: "footprint", hint: "Master any Academy unit.", earned: (i) => mastered(i.academy) >= 1 },
  { id: "five-units", name: "Warming Up", icon: "local_fire_department", hint: "Master 5 units.", earned: (i) => mastered(i.academy) >= 5 },
  { id: "ten-units", name: "Study Habit", icon: "auto_stories", hint: "Master 10 units.", earned: (i) => mastered(i.academy) >= 10 },
  { id: "level-l0", name: "Oriented", icon: "explore", hint: "Finish Level 0: Orientation.", earned: levelDone("L0") },
  { id: "level-l1", name: "Share Savvy", icon: "pie_chart", hint: "Finish Level 1: Stock basics.", earned: levelDone("L1") },
  { id: "level-l2", name: "Candle Reader", icon: "candlestick_chart", hint: "Finish Level 2: Charts.", earned: levelDone("L2") },
  { id: "level-l3", name: "Order Desk", icon: "receipt_long", hint: "Finish Level 3: Orders and planning.", earned: levelDone("L3") },
  { id: "level-l4", name: "Statement Sleuth", icon: "query_stats", hint: "Finish Level 4: Reading statements.", earned: levelDone("L4") },
  { id: "tested-out", name: "Already Knew It", icon: "fast_forward", hint: "Pass any level's test-out.", earned: (i) => Object.keys(i.academy.testedOut).length >= 1 },
  { id: "placed", name: "Know Your Start", icon: "my_location", hint: "Take the placement check.", earned: (i) => !!i.academy.placement && !i.academy.placement.skipped },
  { id: "first-order", name: "Ticket Writer", icon: "edit_note", hint: "Place your first paper order.", earned: (i) => totalCounters(i.paper).orders >= 1 },
  { id: "first-limit-fill", name: "Price Setter", icon: "price_check", hint: "Get a limit order filled.", earned: (i) => totalCounters(i.paper).limitFills >= 1 },
  { id: "trailing-exit", name: "Trend Follower", icon: "trending_up", hint: "Exit a trade with a trailing stop.", earned: (i) => totalCounters(i.paper).trailingExits >= 1 },
  { id: "five-protected", name: "Seatbelt On", icon: "shield", hint: "Close 5 trades that had a stop from the start.", earned: (i) => totalCounters(i.paper).stopProtectedTrades >= 5 },
  { id: "stop-limit-lesson", name: "Gap Lesson", icon: "warning", hint: "See a triggered stop-limit that did not fill.", earned: (i) => totalCounters(i.paper).stopLimitNoFills >= 1 },
  { id: "first-challenge", name: "Challenger", icon: "flag", hint: "Pass any paper challenge.", earned: (i) => passedChallenges(i.paper).length >= 1 },
  { id: "five-challenges", name: "Rule Keeper", icon: "rule", hint: "Pass 5 different challenges.", earned: (i) => passedChallenges(i.paper).length >= 5 },
  { id: "all-themes", name: "Well Rounded", icon: "hub", hint: "Pass a challenge in every theme.", earned: (i) => passedThemes(i.paper).size >= new Set(CHALLENGES.map((c) => c.theme)).size },
  { id: "options-l1", name: "Options Curious", icon: "school", hint: "Pass options knowledge check 1.", earned: (i) => !!i.academy.options.passed["1"] },
  { id: "options-ladder", name: "Ladder Climbed", icon: "stairs", hint: "Pass all four options knowledge checks.", earned: (i) => ["1", "2", "3", "4"].every((l) => !!i.academy.options.passed[l]) },
  { id: "streak-3", name: "Three in a Row", icon: "event_repeat", hint: "Learn on 3 days in a row.", earned: (i, now) => bestStreak(i, now) >= 3 },
  { id: "streak-7", name: "Full Week", icon: "calendar_month", hint: "Learn on 7 days in a row.", earned: (i, now) => bestStreak(i, now) >= 7 },
  { id: "points-500", name: "Point Collector", icon: "stars", hint: "Earn 500 practice points.", earned: (i) => totalPoints(i.rewards.ledger) >= 500 },
  { id: "daily-7", name: "Review Regular", icon: "today", hint: "Answer 7 Today review questions.", earned: (i) => Object.keys(i.academy.daily).length >= 7 },
];

export const BADGES: Badge[] = DEFS.map(({ earned: _e, ...b }) => b);

export function earnedBadgeIds(input: BadgeInput, now: Date): Set<string> {
  const out = new Set<string>();
  for (const d of DEFS) {
    try {
      if (d.earned(input, now)) out.add(d.id);
    } catch {
      /* a malformed store never crashes badges */
    }
  }
  return out;
}
