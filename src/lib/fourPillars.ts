/**
 * The four pillars of price action, in order: MAP (levels), CONFIRMATION (decided in advance),
 * INVALIDATION (exact price before entry, on closes; sets size) and CONTEXT (index trend, how extended,
 * catalysts → full / half / pass). Source: Brando Trades, "Once You Learn Price Action, Trading Becomes
 * Embarrassingly Simple" (YouTube, https://youtu.be/cP6xvs2I02s), restated for learners.
 * The video does not give profit-target or trailing-stop rules; the app points to its own price action
 * framework (/practice/trade-framework) for exits and does not attribute those rules to the creator.
 *
 * Feeds the Playbook kit `price-action-four-pillars`, the Learn group `four-pillars` (FP- questions), the
 * PILLAR_CASES in priceActionCases.ts and the coach session `four-pillars`. Checked by fourPillars.test.ts.
 * Type-only imports, so there is no runtime import cycle. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { OHLC } from "./ohlcData";
import type { LiteracyTerm } from "./literacyTerms";
import type { PlaybookCredibility } from "./playbooks";

export const FP_SOURCE = {
  url: "https://youtu.be/cP6xvs2I02s",
  label: "Brando Trades · Once You Learn Price Action, Trading Becomes Embarrassingly Simple",
  title: "Once You Learn Price Action, Trading Becomes Embarrassingly Simple",
  creator: "Brando Trades",
  /** Channel URL as reported by YouTube's oEmbed `author_url` for the video (checked 2026-10-29). */
  channelUrl: "https://www.youtube.com/@Eliteoptions2",
  embedUrl: "https://www.youtube-nocookie.com/embed/cP6xvs2I02s",
} as const;

export type PillarId = "map" | "confirmation" | "invalidation" | "context";

export interface Pillar {
  id: PillarId;
  n: 1 | 2 | 3 | 4;
  title: string;
  question: string;
  points: string[];
}

export const FOUR_PILLARS: Pillar[] = [
  {
    id: "map",
    n: 1,
    title: "Map",
    question: "Where have buyers or sellers already shown up?",
    points: [
      "Draw one precise horizontal line where price touched, reacted and moved away, not a wide zone.",
      "Touches: 1 is interesting, 2 is real, 3–4 is significant.",
      "Watch closes against the line: a wick through it is a test, a close through it is a statement.",
      "The map tells you where to watch. It does not predict, and price can still slice through a level.",
    ],
  },
  {
    id: "confirmation",
    n: 2,
    title: "Confirmation",
    question: "What exactly must price do at the level before I act?",
    points: [
      "Decide in advance: a hold, a reclaim, or a break and retest, judged on the close.",
      "The level is where to watch; the confirmation is when to act.",
      "\"It looks strong\" is an opinion, not a confirmation. Do not front-run it or catch a falling knife.",
      "Confirmation does not make you right; it makes you disciplined.",
    ],
  },
  {
    id: "invalidation",
    n: 3,
    title: "Invalidation",
    question: "What exact price proves me wrong, before I enter?",
    points: [
      "Write the price down before entry. For a reclaim long: a daily close back below the reclaimed level.",
      "Use closes, not ticks: give price room to test the level, not to close through it.",
      "No moving the stop, no adding to a loser, no negotiating.",
      "The distance to invalidation sets the position size: the math controls size, not confidence.",
    ],
  },
  {
    id: "context",
    n: 4,
    title: "Context",
    question: "Full size, half size, or pass?",
    points: [
      "The broad market (SPX / QQQ daily): trending, extended or choppy? Do not fight the tape.",
      "How extended is the stock? Five up days with no pullback argues for less size than a fresh breakout from a three-week base.",
      "Catalysts nearby (earnings, CPI, a Fed decision): size down, to half or less.",
      "Context sets the size. It never turns a bad setup into a good one.",
    ],
  },
];

export interface PillarSetup {
  id: "hold" | "reclaim" | "rejection";
  title: string;
  direction: "long" | "short";
  text: string;
  /** Archive literacy term for the setup. */
  termId: string;
}

export const FP_SETUPS: PillarSetup[] = [
  { id: "hold", title: "Hold", direction: "long", text: "Old resistance breaks and flips to support. Price comes back, tests it from above and holds: long above the level.", termId: "breakout-retest" },
  { id: "reclaim", title: "Reclaim", direction: "long", text: "Support breaks and price closes below it. Later price pushes back above and closes above it on the daily: long on the confirmed reclaim.", termId: "reclaim-setup" },
  { id: "rejection", title: "Rejection", direction: "short", text: "Price rallies into significant overhead resistance and prints a daily rejection candle with a long upper wick: short just under the level.", termId: "rejection-setup" },
];

export const FP_MISTAKES: string[] = [
  "Indicator stacking: adding another indicator every time the last ones disagree, instead of reading levels and closes.",
  "Entering early: acting before the confirmation you chose has printed.",
  "Moving the stop: giving a losing trade more room after entry, or adding to it.",
  "Ignoring context: full size into a choppy market, an extended stock or a catalyst.",
];

// ---------------------------------------------------------------- glossary

export const FP_TERMS: LiteracyTerm[] = [
  {
    id: "four-pillars",
    name: "Four pillars of price action",
    category: "process",
    summary: "Map the level, wait for the confirmation you chose in advance, know the invalidation price, then let context set the size.",
    detail:
      "Run in order every time: Map (where buyers or sellers showed up), Confirmation (what price must do there before you act), Invalidation (the exact close that proves you wrong, which also sets size) and Context (market trend, how extended the stock is, upcoming catalysts → full, half or pass). From the Playbook kit crediting Brando Trades on YouTube. Exits are a separate plan: see the price action trading framework. Educational, not advice.",
  },
  {
    id: "level-touches",
    name: "Level touches",
    category: "markets",
    summary: "How many times price reacted at a level: 1 is interesting, 2 is real, 3–4 is significant.",
    detail:
      "Count clear reactions (touch, turn, move away) at one precise price. More touches mean more traders are watching it, so a close through it means more. A level is still not a guarantee. Educational, not advice.",
  },
  {
    id: "close-vs-wick",
    name: "Close vs wick at a level",
    category: "process",
    summary: "A wick through a level is a test; a close through it is a statement.",
    detail:
      "Intraday spikes through a level often get pushed back before the candle closes. Judging breaks, holds and reclaims on the close (often the daily close) filters out many of those fake-outs. Educational, not advice.",
  },
  {
    id: "reclaim-setup",
    name: "Reclaim (setup)",
    category: "process",
    summary: "Support breaks and closes below, then price closes back above it: a long on the confirmed reclaim.",
    detail:
      "The sellers who broke the level could not keep price under it. Wait for the close back above; invalidation is a close back below the level (or the reclaim candle's low). Educational, not advice.",
  },
  {
    id: "rejection-setup",
    name: "Rejection (setup)",
    category: "process",
    summary: "A rally into significant resistance that leaves a long upper wick and closes back below: a short just under the level.",
    detail:
      "Buyers pushed above the level and could not hold it into the close. Invalidation is a close back above the level or the wick's high. Shorting carries open-ended risk; size from the invalidation. Educational, not advice.",
  },
  {
    id: "context-sizing",
    name: "Context sizing (full, half, pass)",
    category: "position",
    summary: "Use the market's trend, how extended the stock is and nearby catalysts to choose full size, half size or no trade.",
    detail:
      "A valid setup in a trending market with no event nearby can take full planned size. A choppy index, a stock up several days without a pullback, or earnings / CPI / a Fed decision nearby argue for half size or a pass. Context changes size; it does not fix a bad setup. Educational, not advice.",
  },
];

// ---------------------------------------------------------------- SAMPLE charts for the questions

const b = (name: string, open: number, high: number, low: number, close: number): OHLC => ({ name, open, high, low, close });
const named = (data: Array<[number, number, number, number]>): OHLC[] =>
  data.map(([o, h, l, c], i) => b(`T${i - data.length + 1 === 0 ? "0" : i - data.length + 1}`, o, h, l, c));

export const FP_OHLC: Record<string, OHLC[]> = {
  "fp-touches": named([
    [28.0, 28.7, 27.8, 28.5], [28.5, 29.4, 28.4, 29.2], [29.2, 30.0, 29.0, 29.4], [29.4, 29.5, 28.6, 28.8],
    [28.8, 29.3, 28.5, 29.1], [29.1, 29.98, 28.9, 29.3], [29.3, 29.4, 28.4, 28.6], [28.6, 29.1, 28.3, 28.9],
    [28.9, 29.6, 28.8, 29.5], [29.5, 30.02, 29.3, 29.6], [29.6, 29.7, 29.0, 29.2], [29.2, 29.8, 29.1, 29.7],
  ]),
  "fp-wick-close": named([
    [51.2, 51.4, 50.6, 50.8], [50.8, 51.0, 50.0, 50.4], [50.4, 50.9, 50.1, 50.7], [50.7, 50.8, 50.02, 50.3],
    [50.3, 50.5, 49.6, 50.2], [50.2, 50.4, 49.7, 49.8], [49.8, 49.9, 49.2, 49.4],
  ]),
};
export const FP_CHART_FACTS = {
  touches: { level: 30.0, tolerance: 0.05, count: 3 },
  wickClose: { level: 50.0, testIndex: 4, breakIndex: 5 },
} as const;

// ---------------------------------------------------------------- Learn questions (FP-)

type OptId = "A" | "B" | "C" | "D";
const IDS: OptId[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: OptId, right: string, wrong: string[], explanation: string, extra: Partial<QuizQuestion> = {}): QuizQuestion {
  const o = [...wrong];
  o.splice(IDS.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: IDS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...extra };
}
const level = (price: number, label: string) => ({ levels: [{ price, label, tone: "neutral" as const }] });

export const FP_QUESTIONS: QuizQuestion[] = [
  mc("FP-01", "In what order are the four pillars of price action run?", "B", "Map → Confirmation → Invalidation → Context",
    ["Context → Map → Invalidation → Confirmation", "Confirmation → Map → Context → Invalidation", "Invalidation → Context → Map → Confirmation"],
    "Map where to watch, decide what must happen there, know where you are wrong, then let context set the size.", { glossaryTermId: "four-pillars" }),
  mc("FP-02", "SAMPLE daily chart. How many times has price reacted at about 30.00, and how much weight does that level carry?", "C", "Three touches: significant",
    ["One touch: interesting", "Two touches: real", "None: price never closed above it"],
    "Highs near 30.00, 29.98 and 30.02, each followed by a turn lower. 1 touch is interesting, 2 is real, 3–4 is significant.",
    { patternKey: "fp-touches", annotations: level(30, "30.00"), glossaryTermId: "level-touches" }),
  mc("FP-03", "Support near 50.00 held twice. The highlighted candle traded down to 49.60 but closed at 50.20. What did it say?", "A", "A test: the wick went through, but the close held above the level",
    ["A breakdown: price traded below 50.00", "Nothing: wicks and closes mean the same", "A buy signal on its own"],
    "A wick through a level is a test; a close through it is a statement. This one closed back above 50.00.",
    { patternKey: "fp-wick-close", highlightIndex: FP_CHART_FACTS.wickClose.testIndex, annotations: level(50, "50.00"), glossaryTermId: "close-vs-wick" }),
  mc("FP-04", "Next candle: it closed at 49.80, below 50.00. What changed?", "D", "The close is a statement: support has broken",
    ["Nothing: it is another wick", "Support is stronger because it was tested again", "The level moved down to 49.80"],
    "This time the candle closed through the level. Longs relying on 50.00 now have their answer.",
    { patternKey: "fp-wick-close", highlightIndex: FP_CHART_FACTS.wickClose.breakIndex, annotations: level(50, "50.00"), glossaryTermId: "close-vs-wick" }),
  mc("FP-05", "How should a level be drawn on the map?", "B", "One precise horizontal line where price touched, reacted and moved away",
    ["A wide zone covering every wick nearby", "A line through yesterday's close", "Wherever an indicator crosses"],
    "One precise line forces a clear read of closes against it. A wide zone lets every outcome look like a hold."),
  mc("FP-06", "\"The level tells you where to watch. The confirmation tells you…\"", "A", "when to act",
    ["how much to buy", "where to take profit", "which indicator to add"],
    "A level is a place, not a signal. Act only when price does the thing you decided on in advance."),
  mc("FP-07", "Which of these is a confirmation you can decide in advance?", "C", "A daily close back above the level after it broke",
    ["It looks strong today", "It has fallen a lot, so it must bounce", "Volume feels high"],
    "A confirmation is a specific, checkable action at the level. \"Looks strong\" is an opinion, and buying a fall before proof is catching a falling knife."),
  mc("FP-08", "Old resistance at 75.00 broke. Price pulls back, wicks to 74.90 and closes at 76.10. Which setup is this?", "D", "Hold: old resistance flipped to support and held on the retest",
    ["Rejection: a short under 75.00", "Reclaim: support broke and came back", "No setup: it touched the level"],
    "A hold is a retest from above that keeps closing above the old ceiling. Long above the level.", { glossaryTermId: "breakout-retest" }),
  mc("FP-09", "Support at 42.00 broke on a close at 41.80. Days later price closes at 42.50. Which setup is this?", "B", "Reclaim: a long on the confirmed close back above",
    ["Hold: the level never broke", "Rejection: a short under 42.00", "Breakdown: keep shorting"],
    "The level broke on a close, then price closed back above it. The sellers could not keep it down.", { glossaryTermId: "reclaim-setup" }),
  mc("FP-10", "Price rallies into resistance that has turned it back several times, spikes above it and closes well below, leaving a long upper wick. Which setup is this?", "A", "Rejection: a short just under the level",
    ["Hold: long above the level", "Reclaim: long on the close", "Breakout: the spike already went through"],
    "The wick was the test; the close back under the level is the statement. The rejection setup shorts just under it, with invalidation above the wick.", { glossaryTermId: "rejection-setup" }),
  mc("FP-11", "You bought a reclaim of 42.00. What is the invalidation, and how is it judged?", "C", "A daily close back below the reclaimed level",
    ["Any tick below 42.00 during the day", "A 10% loss from your entry", "None: reclaims do not fail"],
    "Use closes, not ticks: give price room to test the level, not to close through it. Write the price down before you enter."),
  mc("FP-12", "Entry 42.50, invalidation 41.75. You risk at most 300 on a trade. How many shares?", "B", "400: 300 ÷ 0.75",
    ["Whatever feels right for a setup this good", "600: confidence is high", "75"],
    "Invalidation distance sets the size: the math controls size, not confidence.", { glossaryTermId: "position-sizing" }),
  mc("FP-13", "Price falls toward your invalidation but has not closed through it. What does the plan allow?", "D", "Nothing new: no moving the stop, no adding, let the close decide",
    ["Lower the stop so it has more room", "Buy more to lower your average", "Exit early because it feels bad"],
    "No moving stops, no adding to losers, no negotiating. The invalidation price was set before entry for this moment.", { glossaryTermId: "stop-loss-invalidation" }),
  mc("FP-14", "A valid reclaim. But the index is choppy, the stock is up five days without a pullback, and earnings are in two days. What size?", "A", "Half size or pass",
    ["Full size: the setup is valid", "Double size: momentum is strong", "Full size, but move the stop wider"],
    "Context sets size: don't fight the tape, be careful with extended names, and size down (half or less) into catalysts.", { glossaryTermId: "context-sizing" }),
  mc("FP-15", "The market is trending up, no events this week, but the stock has no clear level and no confirmation. What does context do?", "C", "Nothing: context never turns a bad or missing setup into a good one",
    ["Makes it a full-size trade", "Makes it a half-size trade", "Replaces the need for invalidation"],
    "Context only decides full, half or pass for a setup that already passed the first three pillars."),
  mc("FP-16", "Your RSI, MACD and stochastics disagree, so you add a fourth indicator. Which common mistake is this?", "B", "Indicator stacking: go back to levels and closes",
    ["Ignoring context", "Moving the stop", "Entering early"],
    "Stacking indicators to break a tie is the loop the video warns about. The chart is a record of where buyers and sellers acted.", { glossaryTermId: "indicator-not-signal" }),
  mc("FP-17", "Where do profit targets and trailing stops fit in the four pillars?", "D", "They are not part of the four pillars: plan exits separately, e.g. with the app's price action framework",
    ["Pillar 1: the map sets the target", "Pillar 3: invalidation is the target", "Pillar 4: context sets the target"],
    "The four pillars cover entry and risk. This app teaches targets and trailing stops in Practice → Price action trading framework; those are the app's guidance, not the video's rules."),
];

/**
 * "How well-tested is this?" for the Playbook kit. The package is the creator's own framing; each idea in it is
 * mainstream teaching. Every URL was fetched on `verifiedOn` and read for the claim in `note`;
 * `npm run check:playbook-sources` re-checks they load.
 */
export const FP_CREDIBILITY: PlaybookCredibility = {
  title: "How well-tested is this?",
  summary: [
    "The “four pillars” package is Brando Trades’ own framing. We found no independent reviews or track record for it as a whole, and no evidence that this particular version is profitable.",
    "Simple is not safe. Trading carries real risk, and a clear process does not remove it.",
    "Each idea inside it, though, is mainstream price-action and risk-management teaching:",
  ],
  sources: [
    {
      supports: "4 · Context",
      label: "Brooks Trading Course · How to trade price action manual",
      url: "https://www.brookstradingcourse.com/how-to-trade-price-action-manual/",
      note: "Al Brooks: context matters more than candle patterns.",
      role: "corroborates",
      verifiedOn: "2026-10-29",
    },
    {
      supports: "3 · Invalidation and 4 · Context",
      label: "Brooks Trading Course · Trade management: position sizing",
      url: "https://www.brookstradingcourse.com/ask-al/trade-management-position-sizing/",
      note: "When the stop is farther away than your maximum risk allows, cut the position size.",
      role: "corroborates",
      verifiedOn: "2026-10-29",
    },
    {
      supports: "3 · Invalidation",
      label: "The Right Trader · Invalidation level",
      url: "https://therighttrader.com/learn/trading-basics/invalidation-level",
      note: "Write the price where the setup fails before entry, including whether a close through it ends the idea, and don't slide it.",
      role: "corroborates",
      verifiedOn: "2026-10-29",
    },
    {
      supports: "2 · Confirmation (and 1 · Map: close vs wick)",
      label: "The Right Trader · Confirmation in trading",
      url: "https://therighttrader.com/learn/trading-basics/trade-confirmation",
      note: "Confirmation is a close against the level that you defined in advance; a wick through it is not the break.",
      role: "corroborates",
      verifiedOn: "2026-10-29",
    },
    {
      supports: "3 · Invalidation (sizing)",
      label: "Hollow Point Trading · Risk management and position sizing",
      url: "https://www.hollowpointtrading.com/academy/the-hpt-method/risk_management",
      note: "Position size = dollar risk ÷ distance from entry to stop.",
      role: "corroborates",
      verifiedOn: "2026-10-29",
    },
    {
      supports: "The whole method",
      label: "TradeZella · Brando’s support and resistance strategy",
      url: "https://www.tradezella.com/strategies/support-and-resistance",
      note: "Presents his method; it does not evaluate it.",
      role: "presents",
      verifiedOn: "2026-10-29",
    },
    {
      supports: "The whole method",
      label: "Chart Fanatics · Brando’s support and resistance strategy",
      url: "https://www.chartfanatics.com/strategies/support-and-resistance",
      note: "Presents his method; it does not evaluate it.",
      role: "presents",
      verifiedOn: "2026-10-29",
    },
  ],
};

/** Related links rendered on the Playbook page and checked in fourPillars.test.ts. */
export const FP_RELATED: { label: string; to: string }[] = [
  { label: "Learn · Price Action: Four Pillars", to: "/training?group=four-pillars&start=1" },
  { label: "Coach · Map, confirm, invalidate, size", to: "/coach/four-pillars" },
  { label: "Cases · Price action trades (four-pillar cases)", to: "/cases?pack=price-action" },
  { label: "Exits are not in the video: profit targets and trailing stops in the app's price action trading framework", to: "/practice/trade-framework" },
  { label: "Practice · Support and resistance levels", to: "/practice/levels" },
];
