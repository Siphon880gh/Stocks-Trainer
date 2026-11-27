/**
 * Academy retention chrome (weng/.agents/skills/learning-retention): the welcome popover once per local
 * day, the fixed corner Streak and Diary buttons with their progress sheet and 30-day strip, and the
 * highlight cycle (learned / not yet learned / off) on the hub's unit rows.
 *
 * It reuses the shared ES5 core (./retention-core.js, window.RetentionCore) for the UI and reads progress
 * from the Academy state: a unit counts once its check is passed, mastered or tested out (diary()).
 * Only the UI preferences (Show on load, last shown day) are written, to their own key, so the
 * Academy keys keep a single writer.
 */
import { useEffect } from "react";
import "./retention-core.js";
import { diary } from "./retention";
import { loadAcademy, loadRewards, type KVStorage } from "./storage";
import { BADGES } from "./rewards/badges";
import { UNIT_ORDER, getUnit } from "./content/levels";
import { nextUnit, isUnitDone } from "./progress";
import { dayKey } from "./rewards/streak";

export const RT_UI_KEY = "analysis_core_academy_rt_ui_v1";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Core = any;
const core = (): Core | null => (globalThis as unknown as { RetentionCore?: Core }).RetentionCore ?? null;

/** Route prefix the app is mounted under (BrowserRouter basename), from the current /academy URL. */
function routeBase(): string {
  if (typeof window === "undefined") return "";
  const m = window.location.pathname.match(/^(.*?)\/academy(?:\/|$)/);
  if (m) return m[1];
  return window.location.pathname.replace(/\/$/, "");
}

/** The shared core's state, built from the Academy log and the saved UI preferences. */
export function coreState(storage?: KVStorage) {
  const C = core();
  const s = loadAcademy(storage).state;
  const entries = diary(s).slice().reverse(); // oldest first, so the newest completion wins
  const completions: Record<string, unknown> = {};
  const history: unknown[] = [];
  // A pass on a later day is a review: half credit, at most one per unit per local day (same rule as the core).
  const credited = new Map<string, Set<string>>();
  for (const e of entries) {
    const prev = completions[e.unitId] as { firstAt?: string; completedAt?: string; count?: number } | undefined;
    completions[e.unitId] = { completedAt: e.at, firstAt: prev?.firstAt ?? prev?.completedAt ?? e.at, title: e.title, path: e.path, kind: "lesson", source: e.source, score: e.score ?? null, perfect: false, count: (prev?.count ?? 0) + 1 };
    const day = dayKey(new Date(e.at));
    const seen = credited.get(e.unitId);
    const credit = !prev ? 1 : seen && seen.has(day) ? 0 : 0.5;
    if (seen) seen.add(day); else credited.set(e.unitId, new Set([day]));
    history.push({ unitId: e.unitId, at: e.at, kind: "lesson", title: e.title, path: e.path, source: e.source, score: e.score ?? null, perfect: false, first: !prev, review: !!prev, credit });
  }
  let ui: Record<string, unknown> = {};
  try { ui = JSON.parse((storage ?? globalThis.localStorage).getItem(RT_UI_KEY) || "{}") || {}; } catch { ui = {}; }
  const raw = { ...ui, completions, history, lastUnitId: entries.length ? entries[entries.length - 1].unitId : undefined, lastCompletedAt: entries.length ? entries[entries.length - 1].at : undefined };
  return C ? C.normalize(raw, { pace: { lessonsPerDay: 1, quizzesPerDay: 0 } }) : raw;
}

/** Keep only what the chrome owns (popover, streak best/freezes, badges, reminder); progress stays in the Academy keys. */
function saveUi(r: Record<string, unknown>, storage?: KVStorage) {
  const keep = { popover: r.popover, streak: r.streak, badges: r.badges, reminder: r.reminder };
  try { (storage ?? globalThis.localStorage).setItem(RT_UI_KEY, JSON.stringify(keep)); } catch { /* private mode */ }
}

export function academyHomeCfg(storage?: KVStorage) {
  const s = loadAcademy(storage).state;
  const base = routeBase();
  const next = nextUnit(s);
  const left = UNIT_ORDER.filter((id) => !isUnitDone(s, id)).length;
  return {
    get: () => coreState(storage),
    save: (r: Record<string, unknown>) => saveUi(r, storage),
    title: "Academy",
    labels: { lesson: "unit", lessons: "units" },
    quizGoal: false,
    badges: false,
    continueHref: next ? `${base}/academy/${next}` : null,
    continueTitle: next ? getUnit(next)?.title ?? next : "",
    modules: [{ title: "the Academy", total: UNIT_ORDER.length, remaining: left }],
    dueReviews: 0,
    reviewHref: null,
    diaryHref: `${base}/academy/diary`,
    // The Academy has its own badge catalog: the corner Badges button links to its gallery on the diary page.
    badgesHref: `${base}/academy/diary#badges`,
    badgesSummary: `${BADGES.filter((b) => loadRewards(storage).state.badges[b.id]).length} of ${BADGES.length}`,
    stale: [],
    theme: {
      surface: "var(--color-surface)", ink: "var(--color-ink)", heading: "var(--color-ink)", muted: "var(--color-muted)",
      line: "var(--color-line)", accent: "var(--color-primary-fill)", accentInk: "#ffffff", accentSoft: "color-mix(in srgb, var(--color-primary-fill) 16%, transparent)",
      radius: "12px", font: "var(--font-sans)",
    },
    // Units inside an unlocked level can be done in any order, so the hub rows get the highlight cycle.
    highlight: {
      cards: "li:has(> a[data-unit])",
      idOf: (li: Element) => li.querySelector("a[data-unit]")?.getAttribute("data-unit") ?? null,
    },
  };
}

/** Mount the corner chrome (and the once-a-day popover). Returns a cleanup for useEffect. */
export function mountAcademyChrome(storage?: KVStorage): () => void {
  const C = core();
  if (!C || !C.ui || !C.ui.mountChrome) return () => {};
  const chrome = C.ui.mountChrome(() => academyHomeCfg(storage));
  return () => { if (chrome && chrome.destroy) chrome.destroy(); };
}

/** After a check is passed: redraw the streak count and the highlight marks. */
export function refreshAcademyChrome() {
  const C = core();
  if (C && C.ui && C.ui.refreshChrome) C.ui.refreshChrome();
}

/** Academy pages: mount the chrome while the page is shown. */
export function useAcademyChrome(storage?: KVStorage) {
  useEffect(() => mountAcademyChrome(storage), [storage]);
}
