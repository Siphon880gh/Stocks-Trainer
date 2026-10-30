/**
 * Progress Map registry (#23): every route, Learn quiz group and practice lab in the app as a stage on one map,
 * with its region, suggested prerequisites (skill tree) and related stages (discovery web). Three views read
 * the same model: world map (regions of stages), skill tree (done / in progress / available / locked) and
 * discovery web (explored stages filled in, neighbours shown as "?"). progressMap.test.ts fails if a route,
 * Learn group or lab exists without a stage. Status comes from EXISTING progress (quiz passes at
 * QUIZ_PASS_PCT, practice-done flags, case results, coaching sessions, Academy units, Macro rounds, paper
 * challenges) plus the visited-routes store in mapProgress.ts. Prerequisites are suggestions: nothing is
 * ever blocked.
 */
import { QUIZ_GROUPS } from "./quizData";
import { MISC_PRACTICE_ITEMS } from "./miscPractices";
import { LEVELS } from "./academy/content/levels";
import { LEVEL_IDS } from "./academy/types";
import { CASE_STUDIES } from "./caseStudies";
import { listSessions } from "./coaching";
import { PLAYBOOKS } from "./playbooks";
import { MACRO_LESSONS } from "./macro/lessons";
import { CHALLENGES } from "./academy/challenges";
import { loadMapStore, type KV } from "./mapProgress";
import { PROGRESS_STORAGE_KEY } from "./progressStore";
import { ACADEMY_KEY, PAPER_KEY } from "./academy/storage";
import { MACRO_PROGRESS_KEY } from "./macro/macroProgress";

export type RegionId =
  | "start" | "academy" | "candles" | "library" | "decisions" | "indicators"
  | "statements" | "macro" | "markets" | "risk" | "cases" | "paper";

export interface Region {
  id: RegionId;
  name: string;
  blurb: string;
  icon: string;
}

export const REGIONS: Region[] = [
  { id: "start", name: "Base camp", blurb: "Home, Learn and the live-style charts.", icon: "home" },
  { id: "academy", name: "Academy", blurb: "The guided levels from orientation to other markets.", icon: "school" },
  { id: "candles", name: "Candle basics", blurb: "Read one candle, then the core shapes.", icon: "candlestick_chart" },
  { id: "library", name: "Pattern library", blurb: "Every named candlestick pattern, family by family.", icon: "menu_book" },
  { id: "decisions", name: "Charts & decisions", blurb: "Chart patterns, levels, confirmation and planning a trade.", icon: "query_stats" },
  { id: "indicators", name: "Indicators & tools", blurb: "Moving averages, oscillators, charting apps and algos.", icon: "monitoring" },
  { id: "statements", name: "Statements & earnings", blurb: "Read the three statements and trade earnings days.", icon: "receipt_long" },
  { id: "macro", name: "Macro desk", blurb: "Releases, rates, the Fed and market reactions.", icon: "public" },
  { id: "markets", name: "Markets & instruments", blurb: "Stocks, futures, forex, crypto and options.", icon: "language" },
  { id: "risk", name: "Risk, news & mindset", blurb: "Float, squeezes, news biases and track records.", icon: "shield" },
  { id: "cases", name: "Cases & coaching", blurb: "Real-style cases, step coaching and playbooks.", icon: "cases" },
  { id: "paper", name: "Paper trading", blurb: "Orders, fills, P&L and challenges.", icon: "account_balance_wallet" },
];

export type StageKind = "page" | "quiz" | "lab" | "hub" | "level";

export interface MapStage {
  id: string;
  kind: StageKind;
  title: string;
  region: RegionId;
  to: string;
  /** Suggested earlier stages (skill tree edges). */
  prereqs: string[];
  /** Extra discovery-web neighbours. */
  related: string[];
  teaser: string;
}

// ---------- region of every Learn group and lab (drift test: every group and lab must be listed) ----------
const QUIZ_REGION: Record<string, RegionId> = Object.fromEntries(
  ([
    ["candles", "candle-anatomy candle-reading japanese-candles heikin-ashi marubozu doji essential-candles crypto-candles missing-wicks"],
    ["library", "candle-pattern-book all hammer engulfing bullish-engulfing bearish-engulfing shooting-star inverted-hammer morning-star tweezer-bottom rising-wedge bull-flag double-top double-bottom triangle hanging-man evening-star piercing-line dark-cloud-cover three-white-soldiers three-black-crows harami tweezer-top falling-wedge head-shoulders three-inside-outside counterattack-on-neck continuation-methods gap-reversals crows-and-strikes advanced-rare"],
    ["decisions", "chart-patterns reversal-charts pattern-themes which-way buy-or-sell price-action trade-framework opening-range four-pillars fair-value-gap supply-demand equity-patterns fib-decision-map one-minute-charts technique-narratives"],
    ["indicators", "indicators oscillators charting-apps algo-trading"],
    ["statements", "financial-literacy earnings-jargon financial-drills statements-reading cash-forecast-13wk earnings-preview earnings-reaction"],
    ["macro", "macro-releases rates-curve fed-policy housing-mortgage macro-reactions"],
    ["markets", "equity-literacy futures-literacy forex-literacy crypto-literacy options-literacy futures-vs-options options-ladder"],
    ["risk", "news-literacy trading-risk squeezes news-biases record-traders risk-premium-portfolio vix-trading"],
    ["paper", "orders-and-fills paper-pnl"],
  ] as Array<[RegionId, string]>).flatMap(([r, ids]) => ids.split(" ").map((id) => [id, r])),
);

const LAB_REGION: Record<string, RegionId> = Object.fromEntries(
  ([
    ["candles", "flashcards label japanese-candles heikin-ashi crypto-candles missing-wicks essential-candles"],
    ["library", "hunt lookalike"],
    ["decisions", "draw regime replay plan invalidation levels reversal-charts pattern-themes which-way trade-framework opening-range fair-value-gap fib-decision-map one-minute-charts technique-narratives"],
    ["indicators", "ema-macd oscillators charting-apps algo-trading"],
    ["markets", "futures-vs-options"],
    ["risk", "gamma-squeeze news-biases record-traders risk-premium-portfolio vix-trading"],
  ] as Array<[RegionId, string]>).flatMap(([r, ids]) => ids.split(" ").map((id) => [id, r])),
);

/** Route pages that are not labs, hubs or levels. */
const PAGES: Array<Omit<MapStage, "kind" | "prereqs" | "related"> & { prereqs?: string[]; related?: string[] }> = [
  { id: "page:/", title: "Home", region: "start", to: "/", teaser: "Your dashboard: path, Today card and next steps." },
  { id: "page:/training", title: "Learn hub", region: "start", to: "/training", teaser: "Every quiz group and practice in one place." },
  { id: "page:/map", title: "Progress map", region: "start", to: "/map", teaser: "See what you've done and what's next." },
  { id: "page:/market", title: "Charts", region: "start", to: "/market", teaser: "SIMULATED and sample charts with indicators and drawing." },
  { id: "page:/archive", title: "Pattern Archive", region: "library", to: "/archive", teaser: "Look up any pattern: shape, themes, direction and a drill." },
  { id: "page:/practice/statements", title: "Statements lab", region: "statements", to: "/practice/statements", teaser: "Five fictional companies whose statements tie out.", prereqs: ["quiz:financial-literacy"] },
  { id: "page:/practice/read-the-print", title: "Read the Print", region: "statements", to: "/practice/read-the-print", teaser: "Read an earnings print the way the desk does.", prereqs: ["quiz:earnings-jargon"] },
  { id: "page:/practice/mark-the-band", title: "Mark the band", region: "statements", to: "/practice/mark-the-band", teaser: "Mark the move the options market prices before a report.", prereqs: ["quiz:earnings-preview"] },
  { id: "page:/macro/play", title: "Macro play", region: "macro", to: "/macro/play", teaser: "Call the market's reaction to SIMULATED releases.", prereqs: ["quiz:macro-reactions"] },
  { id: "page:/academy/options", title: "Options ladder", region: "academy", to: "/academy/options", teaser: "Four knowledge checks before options practice.", prereqs: ["academy:L6"] },
  { id: "page:/paper", title: "Paper account", region: "paper", to: "/paper", teaser: "Place SIMULATED orders with stops and brackets.", prereqs: ["quiz:orders-and-fills"] },
];

/** Hubs for routes with a parameter: the stage's progress is the share of items finished. */
const HUBS: MapStage[] = [
  { id: "hub:cases", kind: "hub", title: "Cases", region: "cases", to: "/cases", prereqs: ["quiz:equity-literacy"], related: ["quiz:news-literacy"], teaser: "Decide on real-style news and earnings cases." },
  { id: "hub:coach", kind: "hub", title: "Coach sessions", region: "cases", to: "/coach", prereqs: [], related: ["hub:cases"], teaser: "Step-by-step coached decisions." },
  { id: "hub:playbooks", kind: "hub", title: "Playbooks", region: "cases", to: "/playbooks", prereqs: ["quiz:price-action"], related: ["hub:coach"], teaser: "Setups written as plans: entry, stop, target." },
  { id: "hub:macro", kind: "hub", title: "Macro lessons", region: "macro", to: "/macro", prereqs: [], related: ["quiz:macro-releases"], teaser: "Lessons on jobs, inflation, growth, the Fed and rates." },
  { id: "hub:challenges", kind: "hub", title: "Paper challenges", region: "paper", to: "/paper/challenges", prereqs: ["page:/paper"], related: ["quiz:paper-pnl"], teaser: "Scored challenges: discipline first, result second." },
];

/** Route pattern with a parameter → the stage that stands for it. */
export const PARAM_ROUTE_STAGE: Record<string, string> = {
  "cases/:caseId": "hub:cases",
  "coach/:slug": "hub:coach",
  "playbooks/:id": "hub:playbooks",
  "macro/:lessonId": "hub:macro",
  "academy/test-out/:levelId": "academy:L0",
  "academy/:unitId": "academy:L0",
  "paper/challenges/:challengeId": "hub:challenges",
};
/** Static routes served by a stage whose `to` differs ("/academy" is the level stages' hub). */
const ROUTE_ALIAS: Record<string, string> = { "/academy": "academy:L0", "/coach": "hub:coach", "/cases": "hub:cases", "/playbooks": "hub:playbooks", "/macro": "hub:macro", "/paper/challenges": "hub:challenges" };

/** Skill tree: suggested prerequisites (candles → patterns → confirmation → levels → fib / decision map, plus side branches). */
const PREREQS: Record<string, string[]> = {
  "quiz:candle-reading": ["quiz:candle-anatomy"],
  "lab:label": ["quiz:candle-anatomy"],
  "lab:flashcards": ["quiz:candle-anatomy"],
  "quiz:japanese-candles": ["quiz:candle-reading"],
  "lab:missing-wicks": ["quiz:candle-reading"],
  "quiz:missing-wicks": ["lab:missing-wicks"],
  "lab:japanese-candles": ["quiz:candle-reading"],
  "lab:heikin-ashi": ["quiz:japanese-candles"],
  "lab:essential-candles": ["quiz:japanese-candles"],
  "quiz:essential-candles": ["lab:essential-candles"],
  "quiz:candle-pattern-book": ["quiz:japanese-candles"],
  "lab:crypto-candles": ["quiz:japanese-candles"],
  "lab:pattern-themes": ["lab:essential-candles"],
  "lab:which-way": ["lab:essential-candles"],
  "quiz:chart-patterns": ["quiz:candle-pattern-book"],
  "lab:hunt": ["quiz:candle-pattern-book"],
  "lab:lookalike": ["quiz:candle-pattern-book"],
  "quiz:buy-or-sell": ["lab:which-way"],
  "lab:reversal-charts": ["quiz:chart-patterns"],
  "quiz:price-action": ["lab:pattern-themes"],
  "lab:invalidation": ["quiz:buy-or-sell"],
  "quiz:supply-demand": ["quiz:price-action"],
  "lab:trade-framework": ["quiz:price-action"],
  "quiz:trade-framework": ["lab:trade-framework"],
  "lab:opening-range": ["lab:trade-framework"],
  "quiz:opening-range": ["lab:opening-range"],
  "quiz:four-pillars": ["quiz:trade-framework"],
  "lab:fair-value-gap": ["lab:trade-framework"],
  "quiz:fair-value-gap": ["lab:fair-value-gap"],
  "lab:risk-premium-portfolio": ["lab:algo-trading"],
  "quiz:risk-premium-portfolio": ["lab:risk-premium-portfolio"],
  "lab:vix-trading": ["lab:risk-premium-portfolio"],
  "quiz:vix-trading": ["lab:vix-trading"],
  "lab:levels": ["quiz:price-action"],
  "lab:plan": ["lab:levels", "lab:invalidation"],
  "lab:fib-decision-map": ["lab:levels", "lab:invalidation"],
  "quiz:fib-decision-map": ["lab:fib-decision-map"],
  "lab:one-minute-charts": ["lab:levels"],
  "lab:technique-narratives": ["lab:fib-decision-map", "quiz:indicators"],
  "quiz:indicators": ["quiz:candle-reading"],
  "lab:ema-macd": ["quiz:indicators"],
  "quiz:oscillators": ["lab:ema-macd"],
  "lab:oscillators": ["quiz:oscillators"],
  "lab:charting-apps": ["quiz:indicators"],
  "lab:algo-trading": ["lab:charting-apps"],
  "quiz:statements-reading": ["quiz:financial-literacy"],
  "quiz:earnings-preview": ["quiz:statements-reading"],
  "quiz:earnings-reaction": ["quiz:earnings-preview"],
  "quiz:rates-curve": ["quiz:macro-releases"],
  "quiz:fed-policy": ["quiz:rates-curve"],
  "quiz:macro-reactions": ["quiz:fed-policy"],
  "quiz:squeezes": ["quiz:trading-risk"],
  "quiz:news-biases": ["quiz:squeezes"],
  "lab:gamma-squeeze": ["quiz:trading-risk"],
  "quiz:futures-vs-options": ["quiz:futures-literacy"],
  "quiz:paper-pnl": ["quiz:orders-and-fills"],
};

const LEVEL_STAGES: MapStage[] = LEVELS.map((l) => ({
  id: `academy:${l.id}`,
  kind: "level" as const,
  title: `Academy ${l.id}: ${l.title}`,
  region: "academy" as const,
  to: "/academy",
  prereqs: l.prerequisites.map((p) => `academy:${p}`),
  related: [],
  teaser: l.summary,
}));

const GROUP_NAME = Object.fromEntries(QUIZ_GROUPS.map((g) => [g.id, g]));

export const STAGES: MapStage[] = [
  ...PAGES.map((p) => ({ kind: "page" as const, prereqs: [], related: [], ...p })),
  ...LEVEL_STAGES,
  ...HUBS,
  ...MISC_PRACTICE_ITEMS.map((m) => ({
    id: `lab:${m.id}`,
    kind: "lab" as const,
    title: m.title,
    region: LAB_REGION[m.id] ?? ("start" as const),
    to: m.to,
    prereqs: [],
    related: GROUP_NAME[m.id] ? [`quiz:${m.id}`] : [],
    teaser: `Hands-on practice: ${m.title}.`,
  })),
  ...QUIZ_GROUPS.map((g) => ({
    id: `quiz:${g.id}`,
    kind: "quiz" as const,
    title: g.name,
    region: QUIZ_REGION[g.id] ?? ("start" as const),
    to: `/training?group=${g.id}`,
    prereqs: [],
    related: [],
    teaser: g.description,
  })),
].map((s) => ({ ...s, prereqs: [...new Set([...s.prereqs, ...(PREREQS[s.id] ?? [])])] }));

export const STAGE_BY_ID: Record<string, MapStage> = Object.fromEntries(STAGES.map((s) => [s.id, s]));
export const UNMAPPED_GROUPS = QUIZ_GROUPS.map((g) => g.id).filter((id) => !QUIZ_REGION[id]);
export const UNMAPPED_LABS = MISC_PRACTICE_ITEMS.map((m) => m.id).filter((id) => !LAB_REGION[id]);

/** Stage for a route path as written in App.tsx ("" = index). */
export function stageForRoute(path: string): MapStage | undefined {
  if (PARAM_ROUTE_STAGE[path]) return STAGE_BY_ID[PARAM_ROUTE_STAGE[path]];
  const to = "/" + path.replace(/^\//, "");
  if (ROUTE_ALIAS[to]) return STAGE_BY_ID[ROUTE_ALIAS[to]];
  return STAGES.find((s) => s.to === to);
}

const dependents: Record<string, string[]> = {};
for (const s of STAGES) for (const p of s.prereqs) (dependents[p] ??= []).push(s.id);
export const unlocksOf = (id: string): string[] => dependents[id] ?? [];

/** Stages on the skill tree: anything with a prerequisite or that unlocks something. */
export const TREE_IDS: string[] = STAGES.filter((s) => s.prereqs.length || unlocksOf(s.id).length).map((s) => s.id);

/** Depth in the prerequisite graph (roots = 0). */
export const DEPTH: Record<string, number> = {};
function depth(id: string, seen: Set<string> = new Set()): number {
  if (DEPTH[id] != null) return DEPTH[id];
  if (seen.has(id)) throw new Error(`prerequisite cycle at ${id}`);
  seen.add(id);
  const s = STAGE_BY_ID[id];
  const d = s && s.prereqs.length ? 1 + Math.max(...s.prereqs.map((p) => depth(p, seen))) : 0;
  DEPTH[id] = d;
  return d;
}
for (const s of STAGES) depth(s.id);

/** Order for picking the next objective: skill-tree stages first, shallow first; candles, then the other branches. */
const BRANCH_ORDER: RegionId[] = ["candles", "library", "decisions", "indicators", "academy", "statements", "macro", "risk", "markets", "paper", "cases", "start"];
/** The main path through the skill tree: candles → patterns → confirmation → levels → fib / decision map. */
export const SPINE = [
  "quiz:candle-anatomy", "quiz:candle-reading", "quiz:japanese-candles", "lab:essential-candles", "lab:which-way", "quiz:buy-or-sell",
  "lab:pattern-themes", "quiz:price-action", "lab:levels", "lab:invalidation", "lab:fib-decision-map", "lab:technique-narratives",
];
const BY_DEPTH: string[] = [...STAGES]
  .sort((a, b) => Number(!TREE_IDS.includes(a.id)) - Number(!TREE_IDS.includes(b.id)) || DEPTH[a.id] - DEPTH[b.id] || BRANCH_ORDER.indexOf(a.region) - BRANCH_ORDER.indexOf(b.region) || STAGES.indexOf(a) - STAGES.indexOf(b))
  .filter((s) => s.kind !== "page" || s.prereqs.length > 0)
  .map((s) => s.id);
export const OBJECTIVE_ORDER: string[] = [...new Set([...SPINE, ...BY_DEPTH])];
/** The first objective a brand-new learner sees. */
export const FIRST_OBJECTIVE = "quiz:candle-anatomy";
const FRESH_FRONTIER = [FIRST_OBJECTIVE, "academy:L0", "page:/market", "page:/archive", "quiz:candle-reading", "quiz:indicators", "hub:cases", "hub:coach"];

/** Discovery-web neighbours: prerequisites, dependents, related, and the stage before / after it in its region. */
export function neighboursOf(id: string): string[] {
  const s = STAGE_BY_ID[id];
  if (!s) return [];
  const inRegion = STAGES.filter((x) => x.region === s.region);
  const i = inRegion.findIndex((x) => x.id === id);
  const twin = id.startsWith("lab:") ? `quiz:${id.slice(4)}` : id.startsWith("quiz:") ? `lab:${id.slice(5)}` : "";
  const out = [...s.prereqs, ...unlocksOf(id), ...s.related, ...STAGES.filter((x) => x.related.includes(id)).map((x) => x.id), inRegion[i - 1]?.id, inRegion[i + 1]?.id, twin];
  return [...new Set(out.filter((x): x is string => !!x && !!STAGE_BY_ID[x] && x !== id))];
}

// ---------- status from a snapshot of existing progress ----------
export type StageStatus = "done" | "in-progress" | "available" | "locked";
export const STATUS_LABEL: Record<StageStatus, string> = { done: "Done", "in-progress": "In progress", available: "Available", locked: "Suggested later" };

export interface MapSnapshot {
  visited: string[];
  quizPassed: string[];
  quizTried: string[];
  labsDone: string[];
  /** Share of items finished (0..1) for hubs and Academy levels. */
  fractions: Record<string, number>;
}

export const emptySnapshot = (): MapSnapshot => ({ visited: [], quizPassed: [], quizTried: [], labsDone: [], fractions: {} });

export interface StageState {
  stage: MapStage;
  status: StageStatus;
  discovered: boolean;
  fraction: number;
}

export interface MapModel {
  states: Record<string, StageState>;
  regions: Array<{ region: Region; stages: StageState[]; done: number; total: number; pct: number; finished: boolean }>;
  next: StageState | null;
  /** Undiscovered stages next to discovered ones (the "?" nodes). */
  frontier: string[];
  totals: { done: number; total: number; regionsFinished: number; discovered: number };
}

function rawStatus(s: MapStage, snap: MapSnapshot, visited: Set<string>): { done: boolean; started: boolean; fraction: number } {
  if (s.kind === "quiz") {
    const g = s.id.slice(5);
    const done = snap.quizPassed.includes(g);
    return { done, started: done || snap.quizTried.includes(g), fraction: done ? 1 : 0 };
  }
  if (s.kind === "lab") {
    const done = snap.labsDone.includes(s.id.slice(4));
    return { done, started: done || visited.has(s.to), fraction: done ? 1 : 0 };
  }
  if (s.kind === "page") {
    const v = visited.has(s.to);
    return { done: v, started: v, fraction: v ? 1 : 0 };
  }
  const f = Math.max(0, Math.min(1, snap.fractions[s.id] ?? 0));
  return { done: f >= 1, started: f > 0 || visited.has(s.to), fraction: f };
}

export function buildMapModel(snap: MapSnapshot): MapModel {
  const visited = new Set(snap.visited);
  const raw = Object.fromEntries(STAGES.map((s) => [s.id, rawStatus(s, snap, visited)]));
  const states: Record<string, StageState> = {};
  for (const s of STAGES) {
    const r = raw[s.id];
    const status: StageStatus = r.done ? "done" : r.started ? "in-progress" : s.prereqs.every((p) => raw[p]?.done) ? "available" : "locked";
    states[s.id] = { stage: s, status, discovered: r.started, fraction: r.fraction };
  }
  const regions = REGIONS.map((region) => {
    const stages = STAGES.filter((s) => s.region === region.id).map((s) => states[s.id]);
    const done = stages.filter((x) => x.status === "done").length;
    return { region, stages, done, total: stages.length, pct: stages.length ? Math.round((done / stages.length) * 100) : 0, finished: stages.length > 0 && done === stages.length };
  });
  const discovered = STAGES.filter((s) => states[s.id].discovered).map((s) => s.id);
  // New learner: only plain pages opened so far (Home, this map). Show the starting "?" stages.
  const fresh = !STAGES.some((s) => s.kind !== "page" && states[s.id].discovered);
  const frontier = [...new Set([...(fresh ? FRESH_FRONTIER : []), ...discovered.flatMap(neighboursOf)])].filter((id) => !states[id].discovered);
  const open = (x?: StageState) => !!x && x.status !== "done" && x.status !== "locked";
  const pick = (ids: string[]) => ids.map((id) => states[id]).find(open) ?? null;
  const unlocked = OBJECTIVE_ORDER.filter((id) => STAGE_BY_ID[id].prereqs.length > 0);
  const next = fresh
    ? states[FIRST_OBJECTIVE]
    : pick(OBJECTIVE_ORDER.filter((id) => states[id].status === "in-progress")) ?? pick(unlocked) ?? pick(OBJECTIVE_ORDER) ?? pick(STAGES.map((s) => s.id));
  const done = STAGES.filter((s) => states[s.id].status === "done").length;
  return {
    states,
    regions,
    next,
    frontier,
    totals: { done, total: STAGES.length, regionsFinished: regions.filter((r) => r.finished).length, discovered: discovered.length },
  };
}

// ---------- reading the existing stores ----------
function json<T>(storage: KV | undefined, key: string): T | null {
  try {
    const raw = storage?.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

export function readSnapshot(storage: KV | undefined = typeof window !== "undefined" ? window.localStorage : undefined): MapSnapshot {
  const map = loadMapStore(storage);
  const progress = json<{ caseResults?: Record<string, unknown>; coachingCompleted?: Record<string, boolean> }>(storage, PROGRESS_STORAGE_KEY);
  const academy = json<{ units?: Record<string, { masteredAt?: string }>; testedOut?: Record<string, unknown>; placement?: { startLevel?: string; skipped?: boolean }; options?: { passed?: Record<string, string> } }>(storage, ACADEMY_KEY);
  const paper = json<{ challengeAttempts?: Record<string, Array<{ passed: boolean }>> }>(storage, PAPER_KEY);
  const macro = json<{ rounds?: Record<string, unknown> }>(storage, MACRO_PROGRESS_KEY);
  const labsDone = json<string[]>(storage, "analysis_core_misc_practices_done_v1") ?? [];
  const visited = map.visited;
  const share = (n: number, d: number) => (d ? n / d : 0);
  const fractions: Record<string, number> = {
    "hub:cases": share(Object.keys(progress?.caseResults ?? {}).filter((id) => CASE_STUDIES.some((c) => c.id === id)).length, CASE_STUDIES.length),
    "hub:coach": share(Object.entries(progress?.coachingCompleted ?? {}).filter(([, v]) => v).length, listSessions().length),
    "hub:playbooks": share(PLAYBOOKS.filter((p) => visited.includes(`/playbooks/${p.id}`)).length, PLAYBOOKS.length),
    "hub:macro": share(MACRO_LESSONS.filter((l) => visited.includes(`/macro/${l.id}`)).length, MACRO_LESSONS.length),
    "hub:challenges": share(CHALLENGES.filter((c) => (paper?.challengeAttempts?.[c.id] ?? []).some((a) => a.passed)).length, CHALLENGES.length),
  };
  // Same rule as academy/progress.ts isLevelComplete: tested out, or a (not skipped) placement started the learner above it.
  const placedAt = academy?.placement && !academy.placement.skipped ? (LEVEL_IDS as readonly string[]).indexOf(academy.placement.startLevel ?? "") : -1;
  for (const l of LEVELS) {
    const units = l.courses.flatMap((c) => c.unitIds);
    const placed = placedAt > 0 && LEVEL_IDS.indexOf(l.id) < placedAt;
    fractions[`academy:${l.id}`] = academy?.testedOut?.[l.id] || placed ? 1 : share(units.filter((u) => academy?.units?.[u]?.masteredAt).length, units.length);
  }
  // Options ladder: four knowledge checks.
  const optionsPassed = Object.keys(academy?.options?.passed ?? {}).length;
  const extraVisited = [...visited];
  if (optionsPassed >= 4 && !extraVisited.includes("/academy/options")) extraVisited.push("/academy/options");
  if (Object.keys(macro?.rounds ?? {}).length && !extraVisited.includes("/macro/play")) extraVisited.push("/macro/play");
  const quiz = Object.entries(map.quiz);
  return {
    visited: extraVisited,
    quizPassed: quiz.filter(([, v]) => v.passed).map(([k]) => k),
    quizTried: quiz.map(([k]) => k),
    labsDone: Array.isArray(labsDone) ? labsDone : [],
    fractions,
  };
}
