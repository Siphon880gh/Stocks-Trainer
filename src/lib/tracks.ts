/**
 * Learner tracks: one short, ordered list of existing routes per kind of learner, so Home can show only the
 * next 1–3 steps. Steps with a progress map stage use the map's done status; a case-pack step is done once any
 * case in the pack has a result; any other step is done once its page was visited. The track is stored apart
 * from the milestone learning path, so changing it never resets progress.
 * See docs/projects/navigation/DIRECTIONAL-NAV-PROPOSAL.md.
 */
import { BEGINNER_EQUITIES_PATH_ID, DECISION_MAKER_PATH_ID, MARKET_EXPLORER_PATH_ID } from "./progressStore";

export interface TrackStep {
  label: string;
  /** Route (with query or hash when needed) the step opens. */
  to: string;
  /** Progress map stage id whose status decides "done". */
  stage?: string;
  /** Case pack id: done once any case in it has a result. */
  pack?: string;
}

export interface Track {
  id: string;
  title: string;
  blurb: string;
  /** Material Symbols icon name. */
  icon: string;
  /** Milestone learning path confirmed when this track is picked first (it decides which cases show). */
  pathId: string;
  steps: TrackStep[];
}

export const EVERYTHING_TRACK_ID = "everything";

export const TRACKS: Track[] = [
  {
    id: "new-to-stocks",
    title: "New to stocks",
    blurb: "First-time learner; no trading vocabulary yet.",
    icon: "school",
    pathId: BEGINNER_EQUITIES_PATH_ID,
    steps: [
      { label: "Placement check or “I'm brand new”", to: "/academy" },
      { label: "Academy L0 Orientation (5 units)", to: "/academy", stage: "academy:L0" },
      { label: "Academy L1 Stock basics", to: "/academy", stage: "academy:L1" },
      { label: "Equities literacy quiz", to: "/training?group=equity-literacy", stage: "quiz:equity-literacy" },
      { label: "Candlestick Basics", to: "/practice/candle-basics", stage: "page:/practice/candle-basics" },
      { label: "Candle anatomy quiz", to: "/training?group=candle-anatomy", stage: "quiz:candle-anatomy" },
      { label: "Academy L2 Charts & candles", to: "/academy", stage: "academy:L2" },
      { label: "Indicators quiz (opens graded cases)", to: "/training?group=indicators", stage: "quiz:indicators" },
      { label: "Academy L3 Orders, sizing & risk", to: "/academy", stage: "academy:L3" },
      { label: "First paper trade (coach)", to: "/coach/first-paper-trade" },
      { label: "Paper account", to: "/paper", stage: "page:/paper" },
      { label: "Challenge: Protect every entry", to: "/paper/challenges/protect-with-a-stop" },
      { label: "Statements literacy quiz", to: "/training?group=financial-literacy", stage: "quiz:financial-literacy" },
      { label: "Earnings cases (beginner)", to: "/cases?pack=earnings", pack: "earnings" },
      { label: "Company news cases", to: "/cases?pack=company-news", pack: "company-news" },
    ],
  },
  {
    id: "charts-patterns",
    title: "Charts and patterns",
    blurb: "Wants to read candles and chart shapes.",
    icon: "candlestick_chart",
    pathId: BEGINNER_EQUITIES_PATH_ID,
    steps: [
      { label: "Candlestick Basics", to: "/practice/candle-basics", stage: "page:/practice/candle-basics" },
      { label: "Candle anatomy, then candle reading quizzes", to: "/training?group=candle-reading", stage: "quiz:candle-reading" },
      { label: "Japanese candlesticks", to: "/practice/japanese-candles", stage: "lab:japanese-candles" },
      { label: "Essential candlestick patterns", to: "/practice/essential-candles", stage: "lab:essential-candles" },
      { label: "Missing wicks and zooming in", to: "/practice/missing-wicks", stage: "lab:missing-wicks" },
      { label: "Which Way?", to: "/practice/which-way", stage: "lab:which-way" },
      { label: "Candle pattern book quiz", to: "/training?group=candle-pattern-book", stage: "quiz:candle-pattern-book" },
      { label: "Pattern themes", to: "/practice/pattern-themes", stage: "lab:pattern-themes" },
      { label: "Reversal chart patterns", to: "/practice/reversal-charts", stage: "lab:reversal-charts" },
      { label: "Chart patterns quiz", to: "/training?group=chart-patterns", stage: "quiz:chart-patterns" },
      { label: "Flashcards, Label, Lookalikes, Pattern hunt, Drawing", to: "/practice/hunt", stage: "lab:hunt" },
      { label: "Trend vs range; Support and resistance", to: "/practice/levels", stage: "lab:levels" },
      { label: "Indicators quiz; EMA/SMA/MACD; Oscillators", to: "/practice/ema-macd", stage: "lab:ema-macd" },
      { label: "Heikin-Ashi candles", to: "/practice/heikin-ashi", stage: "lab:heikin-ashi" },
      { label: "Library: patterns tab", to: "/archive", stage: "page:/archive" },
    ],
  },
  {
    id: "active-trader",
    title: "Active and day trading",
    blurb: "Price action, opening range, intraday execution.",
    icon: "bolt",
    pathId: BEGINNER_EQUITIES_PATH_ID,
    steps: [
      { label: "Price action trading framework", to: "/practice/trade-framework", stage: "lab:trade-framework" },
      { label: "Four pillars quiz", to: "/training?group=four-pillars", stage: "quiz:four-pillars" },
      { label: "Support and resistance", to: "/practice/levels", stage: "lab:levels" },
      { label: "Opening range lab", to: "/practice/opening-range", stage: "lab:opening-range" },
      { label: "Playbook: Opening range context and confirmation", to: "/playbooks/orb-context-confirmation" },
      { label: "Coach: Opening range breakout", to: "/coach/opening-range-breakout" },
      { label: "Breakout, pullback and fair value gap", to: "/practice/fair-value-gap", stage: "lab:fair-value-gap" },
      { label: "Reading 1-minute charts", to: "/practice/one-minute-charts", stage: "lab:one-minute-charts" },
      { label: "Fibonacci as a decision map", to: "/practice/fib-decision-map", stage: "lab:fib-decision-map" },
      { label: "Bar replay, Mark the plan, Invalidation", to: "/practice/invalidation", stage: "lab:invalidation" },
      { label: "Playbooks: Gap and go, VWAP hold, EMA reclaim", to: "/playbooks/gap-and-go" },
      { label: "Price action cases", to: "/cases?pack=price-action", pack: "price-action" },
      { label: "Paper desk: Breakouts & gaps, Execution & risk topics", to: "/paper/desk" },
      { label: "Challenges: Breakout buy stop, Gap through stop", to: "/paper/challenges/breakout-buy-stop" },
      { label: "Trading risk quiz", to: "/training?group=trading-risk", stage: "quiz:trading-risk" },
    ],
  },
  {
    id: "fundamentals",
    title: "Company fundamentals and earnings",
    blurb: "Long-term investor who reads statements and earnings.",
    icon: "receipt_long",
    pathId: DECISION_MAKER_PATH_ID,
    steps: [
      { label: "Academy L4 Company fundamentals & earnings", to: "/academy", stage: "academy:L4" },
      { label: "Statements literacy quiz", to: "/training?group=financial-literacy", stage: "quiz:financial-literacy" },
      { label: "Statements lab", to: "/practice/statements", stage: "page:/practice/statements" },
      { label: "Reading the statements quiz", to: "/training?group=statements-reading", stage: "quiz:statements-reading" },
      { label: "13-week cash forecast quiz", to: "/training?group=cash-forecast-13wk", stage: "quiz:cash-forecast-13wk" },
      { label: "Earnings preview quiz", to: "/training?group=earnings-preview", stage: "quiz:earnings-preview" },
      { label: "Read the Print", to: "/practice/read-the-print", stage: "page:/practice/read-the-print" },
      { label: "Mark the band", to: "/practice/mark-the-band", stage: "page:/practice/mark-the-band" },
      { label: "Earnings desk language quiz", to: "/training?group=earnings-jargon", stage: "quiz:earnings-jargon" },
      { label: "Tool Training: StockAnalysis, SEC EDGAR, Earnings & insiders", to: "/tools/sec-edgar" },
      { label: "Earnings, company news, then news plus financials cases", to: "/cases?pack=combined", pack: "combined" },
      { label: "Paper desk: Earnings & guidance, Balance-sheet risk, Insiders & analysts", to: "/paper/desk" },
      { label: "Playbooks: Dollar-cost averaging, Rebalance to target", to: "/playbooks/rebalance-to-target" },
    ],
  },
  {
    id: "macro-news",
    title: "Macro and news",
    blurb: "Follows the economy, the Fed and headlines.",
    icon: "public",
    pathId: BEGINNER_EQUITIES_PATH_ID,
    steps: [
      { label: "Academy L5 Macro & rates", to: "/academy", stage: "academy:L5" },
      { label: "News literacy quiz", to: "/training?group=news-literacy", stage: "quiz:news-literacy" },
      { label: "Macro Desk lessons (jobs, CPI, FOMC, curve…)", to: "/macro", stage: "hub:macro" },
      { label: "Macro releases, rates curve, Fed policy quizzes", to: "/training?group=fed-policy", stage: "quiz:fed-policy" },
      { label: "Macro play (29 rounds)", to: "/macro/play", stage: "page:/macro/play" },
      { label: "Macro reactions quiz", to: "/training?group=macro-reactions", stage: "quiz:macro-reactions" },
      { label: "Tool Training: Market Forces", to: "/tools/market-forces" },
      { label: "News, biases & short-term options", to: "/practice/news-biases", stage: "lab:news-biases" },
      { label: "Market-wide news cases", to: "/cases?pack=macro-news", pack: "macro-news" },
      { label: "Bonds and rates; Sectors and rotation themes", to: "/practice/sectors-rotation", stage: "lab:sectors-rotation" },
      { label: "Paper desk: Macro & sectors topic", to: "/paper/desk" },
      { label: "Playbooks: Business-cycle sector tilt, Treasury bond ladder", to: "/playbooks/business-cycle-sector-tilt" },
    ],
  },
  {
    id: "options-vol",
    title: "Options and volatility",
    blurb: "Wants calls, puts, income strategies and the VIX.",
    icon: "stacked_line_chart",
    pathId: BEGINNER_EQUITIES_PATH_ID,
    steps: [
      { label: "Academy L6 Options education (test-out first if ready)", to: "/academy", stage: "academy:L6" },
      { label: "Options literacy quiz", to: "/training?group=options-literacy", stage: "quiz:options-literacy" },
      { label: "Options ladder", to: "/academy/options", stage: "page:/academy/options" },
      { label: "Options ladder quiz", to: "/training?group=options-ladder", stage: "quiz:options-ladder" },
      { label: "Futures vs options & beginner toolkit", to: "/practice/futures-vs-options", stage: "lab:futures-vs-options" },
      { label: "Playbooks: Covered call, Cash-secured put, Protective put", to: "/playbooks/covered-call" },
      { label: "The wheel strategy", to: "/practice/wheel-strategy", stage: "lab:wheel-strategy" },
      { label: "Gamma squeeze case; Squeezes quiz", to: "/practice/gamma-squeeze", stage: "lab:gamma-squeeze" },
      { label: "VIX trading for beginners", to: "/practice/vix-trading", stage: "lab:vix-trading" },
      { label: "Risk-premium portfolio and the VIX overlay", to: "/practice/risk-premium-portfolio", stage: "lab:risk-premium-portfolio" },
      { label: "Options context cases", to: "/cases?pack=options-context", pack: "options-context" },
      { label: "Paper desk: time decay scenario", to: "/paper/desk" },
    ],
  },
  {
    id: "other-markets",
    title: "Other markets",
    blurb: "Futures, forex, crypto and commodities (extends today's Market Explorer path).",
    icon: "language",
    pathId: MARKET_EXPLORER_PATH_ID,
    steps: [
      { label: "Indicators quiz (chart gate)", to: "/training?group=indicators", stage: "quiz:indicators" },
      { label: "Academy L7 Other markets", to: "/academy", stage: "academy:L7" },
      { label: "Futures, forex, crypto literacy quizzes", to: "/training?group=futures-literacy", stage: "quiz:futures-literacy" },
      { label: "Same theme, different wrapper", to: "/practice/exposure-wrappers", stage: "lab:exposure-wrappers" },
      { label: "Futures cases", to: "/cases?pack=futures", pack: "futures" },
      { label: "Playbook: Futures roll", to: "/playbooks/futures-roll" },
      { label: "Forex cases", to: "/cases?pack=forex", pack: "forex" },
      { label: "Candlesticks for crypto", to: "/practice/crypto-candles", stage: "lab:crypto-candles" },
      { label: "Crypto cases", to: "/cases?pack=crypto", pack: "crypto" },
      { label: "Market themes: precious metals, energy, agriculture, industrial metals…", to: "/practice/energy", stage: "lab:energy" },
    ],
  },
  {
    id: EVERYTHING_TRACK_ID,
    title: "Show me everything",
    blurb: "Returning or advanced: the full library, search and every page, with no suggested order.",
    icon: "apps",
    pathId: DECISION_MAKER_PATH_ID,
    steps: [
      { label: "Browse everything: search and every page", to: "/browse" },
      { label: "Full Table of Contents", to: "/training" },
      { label: "Progress map", to: "/map" },
    ],
  },
];

export const TRACK_KEY = "analysis_core_track_v1";

type KV = Pick<Storage, "getItem" | "setItem">;
const browser = (): KV | undefined => {
  try {
    return typeof window !== "undefined" ? window.localStorage : undefined;
  } catch {
    return undefined;
  }
};

export const getTrack = (id: string | null | undefined): Track | undefined => TRACKS.find((t) => t.id === id);

/** The saved track id, or null before the learner picks one. */
export function loadTrackId(storage: KV | undefined = browser()): string | null {
  try {
    const raw = storage?.getItem(TRACK_KEY);
    if (!raw) return null;
    const v = JSON.parse(raw) as { id?: unknown };
    return typeof v?.id === "string" && getTrack(v.id) ? v.id : null;
  } catch {
    return null;
  }
}

export function saveTrackId(id: string, storage: KV | undefined = browser()): void {
  if (!getTrack(id)) return;
  try {
    storage?.setItem(TRACK_KEY, JSON.stringify({ id, at: new Date().toISOString() }));
    if (typeof window !== "undefined") window.dispatchEvent(new Event("track-change"));
  } catch {
    /* storage blocked: the picker shows again next visit */
  }
}

export interface TrackProgress {
  /** Stage id → map status ("done", "in-progress", "available", "locked"). */
  stageStatus: (stage: string) => string | undefined;
  visited: ReadonlySet<string>;
  /** Case pack id → true when any case in it has a result. */
  packPlayed: (pack: string) => boolean;
}

const pathOnly = (to: string) => {
  const p = to.split(/[?#]/)[0] || "/";
  return p.length > 1 ? p.replace(/\/+$/, "") : "/";
};

export function isStepDone(step: TrackStep, progress: TrackProgress): boolean {
  if (step.stage) {
    const s = progress.stageStatus(step.stage);
    if (s !== undefined) return s === "done";
  }
  if (step.pack) return progress.packPlayed(step.pack);
  return progress.visited.has(pathOnly(step.to));
}

/** The next `count` unfinished steps, in order. "Show me everything" always lists its entry points. */
export function nextSteps(track: Track, progress: TrackProgress, count = 3): TrackStep[] {
  if (track.id === EVERYTHING_TRACK_ID) return track.steps.slice(0, count);
  return track.steps.filter((s) => !isStepDone(s, progress)).slice(0, count);
}

export function doneCount(track: Track, progress: TrackProgress): number {
  if (track.id === EVERYTHING_TRACK_ID) return 0;
  return track.steps.filter((s) => isStepDone(s, progress)).length;
}
