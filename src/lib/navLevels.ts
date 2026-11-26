/**
 * Level tabs for the header dropdowns (Learn, Practice, Trade): every dropdown item has exactly one level
 * (Beginner, Intermediate, Advanced) and one short group inside it. Levels follow the existing data: Academy
 * levels L0–L3 / L4–L5 / L6–L7, the learning paths (Beginner Equities first), case pack difficulty and the
 * progress map's prerequisite depth. A "For your path" tab lists the learner's own track steps from tracks.ts.
 * See docs/projects/navigation/DIRECTIONAL-NAV-PROPOSAL.md.
 */
import { FINANCIAL_GAMES, LEARN_MENU, PRACTICE_MENU, TOOL_TRAINING, TRADE_MENU } from "./appNav";
import { stageForRoute } from "./progressMap";
import { TOOL_LESSONS } from "./toolTraining";
import { EVERYTHING_TRACK_ID, isStepDone, type Track, type TrackProgress, type TrackStep } from "./tracks";

export type NavLevel = "beginner" | "intermediate" | "advanced";
export type MenuId = "learn" | "practice" | "trade";
export type NavTabId = NavLevel | "path";

export const NAV_LEVELS: readonly { id: NavLevel; label: string; blurb: string }[] = [
  { id: "beginner", label: "Beginner", blurb: "New to this: start here." },
  { id: "intermediate", label: "Intermediate", blurb: "You know the basics and want to decide better." },
  { id: "advanced", label: "Advanced", blurb: "Options, precise entries, full desks and research tools." },
];

export const MENU_IDS: readonly MenuId[] = ["learn", "practice", "trade"];

/** Items shown in a tab before "Show all". */
export const TAB_LIMIT = 12;

export interface LevelItem {
  label: string;
  to: string;
  level: NavLevel;
  group: string;
  desc: string;
}

const firstSentence = (text: string) => {
  const s = text.split(/(?<=[.!?])\s/)[0] ?? text;
  return s.length > 96 ? `${s.slice(0, 93).trimEnd()}…` : s;
};

const pathOnly = (to: string) => {
  const p = to.split(/[?#]/)[0] || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") : "/";
};

/** One-line description: the item's own text, else its progress map teaser. */
function teaser(to: string): string {
  const lesson = TOOL_LESSONS.find((t) => t.route === to);
  if (lesson) return firstSentence(lesson.blurb);
  const stage = stageForRoute(pathOnly(to));
  return stage ? firstSentence(stage.teaser) : "";
}

type Row = readonly [to: string, level: NavLevel, group: string, desc?: string, label?: string];

function fromMenu(menu: readonly { label: string; to: string }[], rows: readonly Row[]): LevelItem[] {
  return rows.map(([to, level, group, desc, label]) => {
    const hit = menu.find((m) => m.to === to);
    const name = label ?? hit?.label;
    if (!name) throw new Error(`nav level row ${to} has no label`);
    return { label: name, to, level, group, desc: desc ?? teaser(to) };
  });
}

const LEARN_ROWS: readonly Row[] = [
  ["/academy", "beginner", "Start here", "Short units from what a stock is to options, with checks."],
  ["/practice/candle-basics", "beginner", "Start here", "One candle at a time: body, wicks, open and close."],
  ["/training", "beginner", "Start here", "Every quiz, lab and lesson group in one place."],
  ["/archive", "beginner", "Look it up", "Pattern cards, indicator cards and the glossary."],
  ["/archive?tab=literacy", "beginner", "Look it up", "Plain definitions of market words.", "Glossary terms"],
  ["/training#patterns", "beginner", "Look it up", "Quizzes on candlestick and chart patterns."],
  ["/practice/statements", "beginner", "Company numbers"],
  ["/training#concepts", "intermediate", "Concepts and numbers", "Quizzes on literacy, risk, news and statements."],
  ["/training#financials", "intermediate", "Concepts and numbers", "Statements, earnings language and drills."],
  ["/archive?tab=indicators", "intermediate", "Concepts and numbers", "Moving averages, RSI, MACD and more, one card each.", "Indicator cards"],
  ["/training#macro", "intermediate", "Economy", "Quizzes on jobs, inflation, the Fed and the yield curve."],
  ["/macro", "intermediate", "Economy", "SIMULATED releases next to the real source, by family."],
  ["/academy/options", "advanced", "Options"],
  ...TOOL_TRAINING.filter((t) => t.to.startsWith("/tools")).map((t): Row => [t.to, "advanced", "Research tools"]),
];

const TRADE_ROWS: readonly Row[] = [
  ["/training#buy-or-sell", "beginner", "First decisions", "Look at one chart and call buy or sell."],
  ["/market", "beginner", "First decisions", "SIMULATED and sample charts with indicators and drawing."],
  ["/paper", "beginner", "Practice money", "SIMULATED orders with stops and brackets."],
  ["/cases?pack=earnings", "beginner", "First cases", "Decide after an earnings report, then see what happened.", "Earnings cases"],
  ["/cases?pack=company-news", "beginner", "First cases", "Product news, contracts and leadership headlines.", "Company news cases"],
  ["/coach", "intermediate", "Guided decisions", "Step-by-step coached decisions with a path trail."],
  ["/cases", "intermediate", "Guided decisions", "Every case pack: decide first, then the reveal."],
  ["/cases?pack=macro-news", "intermediate", "Guided decisions", "Inflation, fear and supply shocks that move many stocks.", "Market-wide news cases"],
  ["/cases?pack=price-action", "intermediate", "Guided decisions", "Read the tape: levels, breaks and follow-through.", "Price action cases"],
  ["/paper/challenges", "intermediate", "Scored practice", "Discipline score first, result second."],
  ["/macro/play", "intermediate", "Scored practice", "Consensus versus actual, then call the reaction."],
  ["/paper/desk", "advanced", "Full desk", "Watchlist, news and statements in one paper trading desk."],
  ["/playbooks", "advanced", "Full desk", "Setups written as plans: entry, stop and target."],
  ["/cases?pack=options-context", "advanced", "Other markets", "What the options market says around a stock move.", "Options context cases"],
  ["/cases?pack=futures", "advanced", "Other markets", "Index, energy and metals futures decisions.", "Futures cases"],
  ["/cases?pack=forex", "advanced", "Other markets", "Currency pairs around rates and data.", "Forex cases"],
  ["/cases?pack=crypto", "advanced", "Other markets", "Crypto moves around news and liquidity.", "Crypto cases"],
];

/** Practice labs by id, so labels and routes stay those of the Practice menu data. */
const PRACTICE_ROWS: readonly (readonly [id: string, level: NavLevel, group: string])[] = [
  ["japanese-candles", "beginner", "First candles"],
  ["essential-candles", "beginner", "First candles"],
  ["missing-wicks", "beginner", "First candles"],
  ["which-way", "beginner", "First candles"],
  ["flashcards", "beginner", "First candles"],
  ["label", "beginner", "First candles"],
  ["regime", "beginner", "Reading a chart"],
  ["levels", "beginner", "Reading a chart"],
  ["pattern-themes", "beginner", "Reading a chart"],
  ["heikin-ashi", "beginner", "Reading a chart"],
  ["statements", "beginner", "Company numbers"],
  ["replay", "intermediate", "Price action"],
  ["plan", "intermediate", "Price action"],
  ["invalidation", "intermediate", "Price action"],
  ["trade-framework", "intermediate", "Price action"],
  ["opening-range", "intermediate", "Price action"],
  ["reversal-charts", "intermediate", "Patterns"],
  ["hunt", "intermediate", "Patterns"],
  ["lookalike", "intermediate", "Patterns"],
  ["ema-macd", "intermediate", "Indicators"],
  ["oscillators", "intermediate", "Indicators"],
  ["read-the-print", "intermediate", "Earnings and markets"],
  ["crypto-candles", "intermediate", "Earnings and markets"],
  ["draw", "intermediate", "Patterns"],
  ["technique-narratives", "intermediate", "Indicators"],
  ["charting-apps", "intermediate", "Indicators"],
  ["exposure-wrappers", "intermediate", "Earnings and markets"],
  ["sectors-rotation", "intermediate", "Earnings and markets"],
  ["index-style", "intermediate", "Earnings and markets"],
  ["bonds-rates", "intermediate", "Earnings and markets"],
  ["currency-funds", "intermediate", "Earnings and markets"],
  ["news-biases", "advanced", "Options and volatility"],
  ["futures-vs-options", "advanced", "Options and volatility"],
  ["options-ladder", "advanced", "Options and volatility"],
  ["wheel-strategy", "advanced", "Options and volatility"],
  ["gamma-squeeze", "advanced", "Options and volatility"],
  ["vix-trading", "advanced", "Options and volatility"],
  ["fair-value-gap", "advanced", "Precision day trading"],
  ["fib-decision-map", "advanced", "Precision day trading"],
  ["one-minute-charts", "advanced", "Precision day trading"],
  ["mark-the-band", "advanced", "Portfolio and automation"],
  ["risk-premium-portfolio", "advanced", "Portfolio and automation"],
  ["algo-trading", "advanced", "Portfolio and automation"],
  ["record-traders", "advanced", "Commodities and records"],
  ["precious-metals", "advanced", "Commodities and records"],
  ["energy", "advanced", "Commodities and records"],
  ["industrial-metals", "advanced", "Commodities and records"],
  ["agriculture", "advanced", "Commodities and records"],
  ["materials-chemicals", "advanced", "Commodities and records"],
];

const practiceItems = (): LevelItem[] =>
  PRACTICE_ROWS.map(([id, level, group]) => {
    const row = PRACTICE_MENU.find((r) => r.id === id) ?? FINANCIAL_GAMES.find((r) => r.id === id);
    if (!row) throw new Error(`practice level row ${id} has no menu row`);
    return { label: row.label, to: row.to, level, group, desc: teaser(row.to) };
  });

/** Every dropdown item with its level and group, in display order (the first TAB_LIMIT per level show first). */
export const LEVEL_MENUS: Record<MenuId, readonly LevelItem[]> = {
  learn: fromMenu([...LEARN_MENU, ...TOOL_TRAINING], LEARN_ROWS),
  practice: practiceItems(),
  trade: fromMenu(TRADE_MENU, TRADE_ROWS),
};

export const PRACTICE_LEVEL_IDS: readonly string[] = PRACTICE_ROWS.map(([id]) => id);

export const itemsFor = (menu: MenuId, level: NavLevel): LevelItem[] => LEVEL_MENUS[menu].filter((i) => i.level === level);

/** Groups in first-seen order. */
export function groupItems<T extends { group: string }>(items: readonly T[]): { title: string; items: T[] }[] {
  const out: { title: string; items: T[] }[] = [];
  for (const it of items) {
    const g = out.find((x) => x.title === it.group);
    if (g) g.items.push(it);
    else out.push({ title: it.group, items: [it] });
  }
  return out;
}

/** Which header menu a route belongs to: the menu that lists it, else by its first path segment. */
export function menuForPath(to: string): MenuId {
  const p = pathOnly(to);
  for (const m of MENU_IDS) if (LEVEL_MENUS[m].some((i) => i.to === to)) return m;
  for (const m of MENU_IDS) if (LEVEL_MENUS[m].some((i) => pathOnly(i.to) === p && !i.to.includes("#"))) return m;
  if (/^\/(paper|cases|coach|playbooks|market)(\/|$)/.test(p) || p === "/macro/play" || to.includes("#buy-or-sell")) return "trade";
  if (/^\/practice(-draw)?(\/|$)/.test(p)) return "practice";
  return "learn";
}

export interface PathTabItem extends TrackStep {
  group: "Next up" | "Later on your path";
  desc: string;
}

/**
 * "For your path": the track's unfinished steps that belong to this menu, in track order (at most TAB_LIMIT).
 * Show me everything lists its entry points in every menu.
 */
export function pathTabItems(track: Track, progress: TrackProgress, menu: MenuId): PathTabItem[] {
  const total = track.steps.length;
  const steps = track.steps
    .map((s, i) => ({ s, n: i + 1 }))
    .filter(({ s }) => (track.id === EVERYTHING_TRACK_ID || (menuForPath(s.to) === menu && !isStepDone(s, progress))));
  return steps.slice(0, TAB_LIMIT).map(({ s, n }, i) => ({
    ...s,
    group: i < 3 ? "Next up" : "Later on your path",
    desc: `Step ${n} of ${total}`,
  }));
}

/* ---- remembered tab, per menu ---- */

export const NAV_TAB_KEY = "analysis_core_nav_tab_v1";
type KV = Pick<Storage, "getItem" | "setItem">;
const browser = (): KV | undefined => {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
};
const isLevel = (v: unknown): v is NavLevel => v === "beginner" || v === "intermediate" || v === "advanced";

function readAll(storage: KV | undefined): Record<string, { tab?: string; track?: string | null }> {
  try {
    const raw = storage?.getItem(NAV_TAB_KEY);
    const v = raw ? JSON.parse(raw) : null;
    return v && typeof v === "object" ? v : {};
  } catch {
    return {};
  }
}

/** The tab to open: the last one used in this menu (for the same track), else For your path with a track, else Beginner. */
export function loadNavTab(menu: MenuId, trackId: string | null, storage: KV | undefined = browser()): NavTabId {
  const saved = readAll(storage)[menu];
  if (saved && (saved.track ?? null) === trackId) {
    if (isLevel(saved.tab)) return saved.tab;
    if (saved.tab === "path" && trackId) return "path";
  }
  return trackId ? "path" : "beginner";
}

export function saveNavTab(menu: MenuId, tab: NavTabId, trackId: string | null, storage: KV | undefined = browser()): void {
  try {
    const all = readAll(storage);
    all[menu] = { tab, track: trackId };
    storage?.setItem(NAV_TAB_KEY, JSON.stringify(all));
  } catch {
    /* storage blocked: the default tab opens next time */
  }
}
