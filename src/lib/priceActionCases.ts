/**
 * Cases pack `price-action` (thinking mode `price_action_plan`): one SAMPLE stock walked through the price action
 * trading framework, one decision per case: uncertainty (stay flat) → breakout entry → stop-loss hit → trailing stop
 * holds → profit target. Charts only (no headline or statement). Type-only import, so caseStudies.ts can spread
 * PRICE_ACTION_CASES without an import cycle. Validated in tradeFramework.test.ts.
 * The same pack also holds ORB_CASES (opening range breakout, mode `opening_range`), PILLAR_CASES (map, confirmation,
 * invalidation, context; mode `four_pillars`) and FVG_CASES (breakout → pullback into a fair value gap; mode `fair_value_gap`),
 * validated in openingRange.test.ts, fourPillars.test.ts and fairValueGap.test.ts.
 */
import type { OHLC } from "./ohlcData";
import type { CaseStudy } from "./caseStudies";

const bar = (name: string, open: number, high: number, low: number, close: number): OHLC => ({ name, open, high, low, close });
const rows = (start: number, data: Array<[number, number, number, number]>, post = false): OHLC[] =>
  data.map(([o, h, l, c], i) => bar(post ? `+${i + 1}` : `T${start + i === 0 ? "0" : start + i}`, o, h, l, c));

const CHOP_PRE = rows(-13, [
  [48.9, 49.3, 48.7, 49.2], [49.2, 49.6, 48.9, 49.0], [49.0, 49.2, 48.4, 48.6], [48.6, 49.1, 48.3, 48.95],
  [48.95, 49.75, 48.85, 49.55], [49.55, 49.85, 49.1, 49.25], [49.25, 49.4, 48.6, 48.8], [48.8, 48.95, 48.25, 48.5],
  [48.5, 49.2, 48.4, 49.1], [49.1, 49.7, 48.95, 49.4], [49.4, 49.55, 48.85, 48.95], [48.95, 49.35, 48.7, 49.15],
  [49.15, 49.45, 48.8, 48.9], [48.9, 49.3, 48.75, 49.05],
]);
const CHOP_POST = rows(1, [[49.05, 49.5, 48.8, 49.35], [49.35, 49.6, 48.9, 48.95], [48.95, 49.1, 48.35, 48.6], [48.6, 49.15, 48.45, 49.0]], true);

const BREAKOUT_PRE = rows(-13, [
  [47.6, 48.1, 47.4, 47.95], [47.95, 48.7, 47.85, 48.55], [48.55, 49.4, 48.4, 49.25], [49.25, 50.0, 49.1, 49.6],
  [49.6, 49.7, 48.9, 49.05], [49.05, 49.3, 48.7, 48.95], [48.95, 49.65, 48.85, 49.5], [49.5, 50.0, 49.3, 49.7],
  [49.7, 49.8, 49.1, 49.25], [49.25, 49.45, 48.95, 49.3], [49.3, 49.85, 49.2, 49.75], [49.75, 50.0, 49.45, 49.6],
  [49.6, 49.95, 49.5, 49.85], [49.85, 50.7, 49.8, 50.6],
]);
const BREAKOUT_POST = rows(1, [[50.6, 50.8, 50.05, 50.25], [50.25, 51.1, 50.15, 50.95], [50.95, 51.7, 50.8, 51.55], [51.55, 52.4, 51.4, 52.2]], true);

const STOP_PRE = rows(-15, [
  [48.7, 49.2, 48.55, 49.1], [49.1, 49.95, 49.0, 49.7], [49.7, 49.9, 49.2, 49.35], [49.35, 49.6, 49.0, 49.45],
  [49.45, 50.0, 49.3, 49.8], [49.8, 49.9, 49.35, 49.55], [49.55, 50.7, 49.5, 50.6], [50.6, 51.0, 50.4, 50.9],
  [50.9, 51.45, 50.75, 51.3], [51.3, 51.5, 51.0, 51.1], [51.1, 51.25, 50.6, 50.7], [50.7, 50.95, 50.3, 50.4],
  [50.4, 50.6, 49.95, 50.1], [50.1, 50.3, 49.8, 49.95], [49.95, 50.15, 49.75, 49.85], [49.85, 49.9, 49.4, 49.5],
]);
const STOP_POST = rows(1, [[49.5, 49.65, 48.9, 49.05], [49.05, 49.2, 48.4, 48.55], [48.55, 48.8, 48.1, 48.3]], true);

const TRAIL_PRE = rows(-17, [
  [50.6, 51.1, 50.45, 50.95], [50.95, 51.6, 50.85, 51.45], [51.45, 51.7, 51.05, 51.2], [51.2, 51.35, 50.9, 51.05],
  [51.05, 51.8, 51.0, 51.7], [51.7, 52.4, 51.6, 52.3], [52.3, 52.55, 51.95, 52.1], [52.1, 52.25, 51.7, 51.85],
  [51.85, 52.5, 51.8, 52.45], [52.45, 53.2, 52.35, 53.1], [53.1, 53.7, 52.95, 53.55], [53.55, 54.2, 53.4, 54.05],
  [54.05, 54.15, 53.5, 53.65], [53.65, 53.8, 53.1, 53.25], [53.25, 53.4, 52.75, 52.9], [52.9, 53.1, 52.6, 52.8],
  [52.8, 53.25, 52.7, 53.15], [53.15, 53.5, 52.95, 53.4],
]);
const TRAIL_POST = rows(1, [[53.4, 54.0, 53.3, 53.9], [53.9, 54.6, 53.8, 54.45], [54.45, 55.3, 54.3, 55.1]], true);

const TARGET_PRE = rows(-15, [
  [55.2, 56.0, 55.0, 55.4], [55.4, 55.5, 54.6, 54.8], [54.8, 54.95, 54.0, 54.15], [54.15, 54.3, 53.4, 53.6],
  [53.6, 53.75, 52.85, 53.1], [53.1, 53.6, 52.95, 53.45], [53.45, 53.7, 53.2, 53.35], [53.35, 54.1, 53.25, 53.95],
  [53.95, 54.3, 53.5, 53.65], [53.65, 54.4, 53.55, 54.3], [54.3, 54.85, 54.2, 54.7], [54.7, 55.2, 54.55, 55.05],
  [55.05, 55.4, 54.8, 55.3], [55.3, 55.65, 55.1, 55.55], [55.55, 55.8, 55.35, 55.65], [55.65, 55.98, 55.55, 55.6],
]);
const TARGET_POST = rows(1, [[55.6, 55.7, 54.9, 55.0], [55.0, 55.1, 54.3, 54.45], [54.45, 54.6, 53.7, 53.85]], true);

/** Numbers the briefs quote; tradeFramework.test.ts checks them against the bars. */
export const PRICE_ACTION_CASE_FACTS = {
  chop: { top: 49.85, bottom: 48.25 },
  breakout: { ceiling: 50.0, close: 50.6, stop: 49.7, target: 52.4 },
  stop: { entry: 50.6, stop: 49.7, top: 51.5, close: 49.5 },
  trail: { entry: 50.6, hl1: 50.9, hl2: 51.7, stop: 51.6, high: 54.2, dipLow: 52.6, close: 53.4 },
  target: { oldHigh: 56.0, entry: 53.45, firstStop: 52.75, hl: 53.5, trail: 53.4, close: 55.6 },
} as const;

const base = {
  contextType: "chart" as const,
  thinkingMode: "price_action_plan" as const,
  packId: "price-action" as const,
  assetClass: "equity" as const,
  allowShort: false,
  difficulty: "beginner" as const,
};

export const PRICE_ACTION_CASES: CaseStudy[] = [
  {
    ...base,
    id: "case-pa-chop-no-edge",
    title: "Framework 1: chop with no edge",
    brief:
      "SAMPLE stock. For weeks price has chopped between about 48.25 and 49.85, and the last candle closed at 49.05, right in the middle. You have no position. Buy, sell, or hold (stay flat)?",
    preOhlc: CHOP_PRE,
    postOhlc: [...CHOP_PRE, ...CHOP_POST],
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process:
        "Uncertainty: overlapping candles in the middle of a range give no defined edge, no price where you would be wrong and no clear target. Trade what's happening, not what you think will happen: stay flat until price closes through 49.85 or 48.25, or reacts clearly at one of them.",
      whyMarketMoved: "Nothing changed: price kept chopping inside the range, so any entry would have been a coin flip.",
      evidence: "Range 48.25–49.85, last close 49.05 in the middle. No close through either edge.",
    },
  },
  {
    ...base,
    id: "case-pa-breakout-entry",
    title: "Framework 2: breakout from the base",
    brief:
      "SAMPLE stock. Resistance near 50.00 turned price back three times. The last candle closed at 50.60, a strong green close above it. A stop back under the breakout candle sits near 49.70; the next resistance is an old high near 52.40. You have no position.",
    preOhlc: BREAKOUT_PRE,
    postOhlc: [...BREAKOUT_PRE, ...BREAKOUT_POST],
    correctActions: ["buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Entry signal from a defined edge: a close through a level that failed three times. Plan before entry: stop 49.70 (back inside the base, where the breakout fails), target 52.40 (the old high). Reward 1.80 vs risk 0.90 is 2:1. Waiting for a retest is a reasonable partial: it can give a closer stop, but it can also leave you behind.",
      whyMarketMoved: "Price retested the old ceiling near 50.05, held above it, and trended toward the old high.",
      evidence: "Three touches near 50.00; close 50.60; retest low 50.05 held; high 52.40 four candles later.",
    },
  },
  {
    ...base,
    id: "case-pa-stop-hit",
    title: "Framework 3: the breakout fails",
    brief:
      "SAMPLE stock. You bought the breakout at 50.60 with the stop at 49.70, back inside the base where the breakout fails, and a target of 52.40. Price topped at 51.50, rolled over, and the last candle closed at 49.50. You are long. Buy more, sell, or hold?",
    preOhlc: STOP_PRE,
    postOhlc: [...STOP_PRE, ...STOP_POST],
    correctActions: ["sell"],
    acceptablePartial: [],
    debrief: {
      process:
        "Stop-loss: exit where the trade thesis is invalidated. The thesis was \"the breakout above 50.00 holds\"; a close at 49.50, back inside the base and below the 49.70 stop, says it did not. Take the small planned loss (about 1.10 a share here, close to the 0.90 planned). Holding or buying more turns a small loss into a big one.",
      whyMarketMoved: "The failed breakout trapped late buyers, and price kept sliding toward the bottom of the old base.",
      evidence: "Top 51.50 never reached the 52.40 target; close 49.50 below the 49.70 stop; next lows 48.90, 48.40, 48.10.",
    },
  },
  {
    ...base,
    id: "case-pa-trail-hold",
    title: "Framework 4: a pullback above the trailed stop",
    brief:
      "SAMPLE stock. You bought the breakout at 50.60. The uptrend printed higher lows at 50.90 and 51.70, and you trailed the stop up to 51.60 under the second one. Price reached 54.20, pulled back to 52.60 (above the stop and the last higher low) and has closed at 53.40. You are long. Buy more, sell, or hold?",
    preOhlc: TRAIL_PRE,
    postOhlc: [...TRAIL_PRE, ...TRAIL_POST],
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process:
        "Trailing stop: raise the exit as price trends higher, and let the stop decide. The pullback to 52.60 stayed above the last higher low and the 51.60 stop, so the trend is intact and the trade stays on. The stop already locks in a gain of 1.00; once price moves away from 52.60, it can step up under that new higher low. Selling here would exit a working trend on an ordinary pullback.",
      whyMarketMoved: "Buyers defended the higher low again and price made a new high above 54.20.",
      evidence: "Higher lows 50.90 → 51.70 → 52.60; stop 51.60 never touched; new high 55.30.",
    },
  },
  {
    ...base,
    id: "case-pa-take-profit",
    title: "Framework 5: at the planned target",
    brief:
      "SAMPLE stock. You bought at 53.45 after the low near 52.85, with the first stop at 52.75 and a target of 56.00, the old high (planned about 3.6:1). The stop is now trailed to 53.40 under the 53.50 higher low. Price has climbed to 55.60 and the last candle is a shooting star just under 56.00. You are long. Buy more, sell, or hold?",
    preOhlc: TARGET_PRE,
    postOhlc: [...TARGET_PRE, ...TARGET_POST],
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "Profit target: take gains where reward no longer justifies risk. About 0.40 is left to the 56.00 target, while the trailed stop is 2.20 below. The shooting star at the old high adds rejection. Selling keeps about 2.15 a share; holding while you tighten the stop hard under this candle is a partial answer; holding with the stop at 53.40 risks giving most of the gain back.",
      whyMarketMoved: "Sellers defended the old high again and price fell back toward the trailed stop.",
      evidence: "Old high 56.00; shooting star high 55.98, close 55.60; next closes 55.00, 54.45, 53.85.",
    },
  },
];

// ---------------------------------------------------------------- opening range breakout (thinking mode `opening_range`)
// SAMPLE SPY.S 15-minute sessions, candles named by their ET start time. Rules: openingRange.ts. Checked in openingRange.test.ts.

const clock = (data: Array<[number, number, number, number]>, startMinutes = 9 * 60 + 30): OHLC[] =>
  data.map(([o, h, l, c], i) => {
    const m = startMinutes + i * 15;
    return bar(`${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`, o, h, l, c);
  });

const ORB_UP = clock([
  [567.8, 568.9, 567.3, 568.6], [568.6, 569.1, 568.0, 568.3], [568.3, 568.8, 567.9, 568.5], [568.5, 569.5, 568.4, 569.4],
  [569.4, 570.1, 569.0, 569.9], [569.9, 570.8, 569.6, 570.6], [570.6, 571.6, 570.4, 571.3], [571.3, 571.5, 570.9, 571.1],
]);
const ORB_WICK = clock([
  [571.0, 571.7, 570.4, 571.4], [571.4, 571.9, 570.9, 571.2], [571.2, 571.6, 570.8, 571.0], [571.0, 572.5, 570.9, 571.5],
  [571.5, 571.8, 570.7, 570.9], [570.9, 571.3, 570.5, 571.1], [571.1, 571.4, 570.6, 570.8],
]);
const ORB_WIDE = clock([
  [562.0, 565.6, 561.4, 565.1], [565.1, 565.8, 560.4, 561.2], [561.2, 563.4, 561.0, 563.1], [563.1, 566.4, 562.9, 566.2],
  [566.2, 566.5, 564.0, 564.4], [564.4, 564.9, 562.7, 563.0], [563.0, 564.2, 562.5, 563.8],
]);
/** Index of the decision candle (10:15) in each ORB tape. */
const ORB_DECISION = 3;

/** Numbers the ORB briefs quote; openingRange.test.ts recomputes them from the bars with orbPlan(). */
export const ORB_CASE_FACTS = {
  up: { high: 569.1, low: 567.3, close: 569.4, risk: 2.1, target: 571.5 },
  wick: { high: 571.9, low: 570.4, wickHigh: 572.5, close: 571.5 },
  wide: { high: 565.8, low: 560.4, close: 566.2, risk: 5.8, budget: 200, shares: 34, usualWidth: 2.0 },
} as const;

const orbBase = { ...base, thinkingMode: "opening_range" as const };

export const ORB_CASES: CaseStudy[] = [
  {
    ...orbBase,
    id: "case-orb-close-above",
    title: "Opening range 1: a close above the range",
    brief:
      "SAMPLE SPY.S, 15-minute candles. The 9:30 and 9:45 candles set an opening range of 567.30–569.10. The 10:15 candle just closed at 569.40, above the range. Your rule: enter on a 15-minute close outside the range, stop at the other end, 1:1 target on SPY. You have no position. Buy (long / calls), sell, or hold (stay flat)?",
    preOhlc: ORB_UP.slice(0, ORB_DECISION + 1),
    postOhlc: ORB_UP,
    correctActions: ["buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A 15-minute close above the range high is the long signal. Stop at the range low 567.30: risk 569.40 − 567.30 = 2.10, so the 1:1 target is 571.50. If you trade calls, that 1:1 is on SPY, not on the premium. Staying flat is a partial answer: it costs nothing, but the plan's signal printed.",
      whyMarketMoved: "Buyers held price above the old range high and it climbed to the 571.50 target within the hour.",
      evidence: "Range 567.30–569.10; close 569.40; lowest low afterwards 569.00 (never near the stop); high 571.60.",
    },
  },
  {
    ...orbBase,
    id: "case-orb-wick-only",
    title: "Opening range 2: only a wick above",
    brief:
      "SAMPLE SPY.S, 15-minute candles. Opening range 570.40–571.90. The 10:15 candle spiked to 572.50 but closed at 571.50, back inside the range. Your rule enters only on a 15-minute close outside the range. You have no position. Buy (long / calls), sell, or hold (stay flat)?",
    preOhlc: ORB_WICK.slice(0, ORB_DECISION + 1),
    postOhlc: ORB_WICK,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process:
        "A wick through the high is a test, not a signal. The close at 571.50 is inside the range, so the rule says wait. Buying the spike is entering on the touch, which is exactly what the close rule protects you from.",
      whyMarketMoved: "Sellers pushed the spike straight back into the range and price chopped in the middle.",
      evidence: "Wick high 572.50, close 571.50 (inside 570.40–571.90); next closes 570.90, 571.10, 570.80.",
    },
  },
  {
    ...orbBase,
    id: "case-orb-wide-range",
    title: "Opening range 3: a signal with a huge range",
    brief:
      "SAMPLE SPY.S, 15-minute candles. A violent open set a range of 560.40–565.80, much wider than this ticker's usual 2.00. The 10:15 candle closed at 566.20, above the range. The stop at the range low would be 5.80 away, and you risk at most 200 per trade. Your normal size is 90 shares. You have no position. Buy, sell, or hold (stay flat)?",
    preOhlc: ORB_WIDE.slice(0, ORB_DECISION + 1),
    postOhlc: ORB_WIDE,
    correctActions: ["hold"],
    acceptablePartial: ["buy"],
    debrief: {
      process:
        "The signal is valid, but the stop is the other end of a 5.40 range: 5.80 below the entry. 90 shares would risk about 522, more than double the 200 budget. Skip the day, or buy a reduced size (200 ÷ 5.80 ≈ 34 shares), which is the partial answer. Moving the stop closer to make the size fit changes the plan after the fact.",
      whyMarketMoved: "Price slid back into the middle of the wide range: no stop, no target, just a large position sitting in chop.",
      evidence: "Range 560.40–565.80 (width 5.40); close 566.20; next closes 564.40, 563.00, 563.80.",
    },
  },
];

// ---------------------------------------------------------------- four pillars: map, confirmation, invalidation, context
// (thinking mode `four_pillars`; the Playbook kit "price-action-four-pillars"). Daily candles. Checked in fourPillars.test.ts.

const RECLAIM_PRE = rows(-13, [
  [43.0, 43.4, 42.6, 42.8], [42.8, 43.0, 42.0, 42.6], [42.6, 43.3, 42.5, 43.1], [43.1, 43.6, 42.7, 42.9],
  [42.9, 43.0, 42.02, 42.4], [42.4, 43.0, 42.3, 42.85], [42.85, 43.2, 42.4, 42.55], [42.55, 42.7, 41.98, 42.3],
  [42.3, 42.6, 42.1, 42.2], [42.2, 42.35, 41.7, 41.8], [41.8, 41.95, 41.3, 41.45], [41.45, 41.8, 41.2, 41.7],
  [41.7, 42.1, 41.55, 41.85], [41.85, 42.6, 41.75, 42.5],
]);
const RECLAIM_POST = rows(1, [[42.5, 42.9, 42.2, 42.75], [42.75, 43.4, 42.6, 43.2], [43.2, 43.8, 43.0, 43.6], [43.6, 44.1, 43.3, 43.9]], true);

const REJECT_PRE = rows(-12, [
  [58.2, 59.1, 58.0, 58.9], [58.9, 60.0, 58.7, 59.3], [59.3, 59.5, 58.4, 58.6], [58.6, 58.9, 57.8, 58.0],
  [58.0, 59.2, 57.9, 59.0], [59.0, 60.05, 58.8, 59.2], [59.2, 59.4, 58.3, 58.5], [58.5, 58.7, 57.6, 57.9],
  [57.9, 58.6, 57.7, 58.4], [58.4, 59.1, 58.3, 58.95], [58.95, 59.6, 58.8, 59.5], [59.5, 59.85, 59.3, 59.8],
  [59.8, 60.7, 59.3, 59.4],
]);
const REJECT_POST = rows(1, [[59.4, 59.6, 58.5, 58.7], [58.7, 58.9, 57.7, 57.9], [57.9, 58.2, 57.2, 57.4]], true);

const CONTEXT_PRE = rows(-12, [
  [66.0, 66.8, 65.7, 66.6], [66.6, 67.9, 66.5, 67.7], [67.7, 69.0, 67.5, 68.8], [68.8, 70.2, 68.6, 70.0],
  [70.0, 71.6, 69.9, 71.4], [71.4, 73.0, 71.2, 72.8], [72.8, 74.6, 72.6, 74.4], [74.4, 75.0, 73.9, 74.8],
  [74.8, 76.9, 74.7, 76.7], [76.7, 78.2, 76.5, 77.9], [77.9, 78.4, 76.6, 76.8], [76.8, 77.0, 75.4, 75.7],
  [75.7, 76.3, 74.9, 76.1],
]);
const CONTEXT_POST = rows(1, [[76.1, 76.2, 73.2, 73.6], [73.6, 74.4, 72.8, 73.2], [73.2, 74.0, 72.9, 73.8]], true);

/** Numbers the four-pillar briefs quote; fourPillars.test.ts checks them against the bars. */
export const PILLAR_CASE_FACTS = {
  reclaim: { level: 42.0, touches: [42.0, 42.02, 41.98], breakClose: 41.8, testHigh: 42.1, testClose: 41.85, close: 42.5, invalidation: 41.75 },
  reject: { level: 60.0, touches: [60.0, 60.05], wickHigh: 60.7, close: 59.4, invalidation: 60.7 },
  context: { level: 75.0, start: 66.0, high: 78.4, dipLow: 74.9, close: 76.1, runPct: 15 },
} as const;

const pillarBase = { ...base, thinkingMode: "four_pillars" as const };

export const PILLAR_CASES: CaseStudy[] = [
  {
    ...pillarBase,
    id: "case-fp-reclaim",
    title: "Four pillars 1: a level reclaimed on the close",
    brief:
      "SAMPLE stock, daily candles. Map: support near 42.00 held three times (lows 42.00, 42.02, 41.98). Then a daily close at 41.80 broke it. Yesterday a wick reached 42.10 but closed at 41.85, still below. Today closed at 42.50, back above 42.00. Your confirmation, decided in advance: a daily close back above the level. Invalidation: a daily close below 41.75, today's low. The index is trending up and there is no earnings date or big macro release this week. You have no position. Buy, sell, or hold?",
    preOhlc: RECLAIM_PRE,
    postOhlc: [...RECLAIM_PRE, ...RECLAIM_POST],
    correctActions: ["buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "All four pillars line up. Map: a level with three touches is significant. Confirmation: yesterday's wick above 42.00 was only a test; today's close above it is the statement, which is the reclaim you decided to wait for. Invalidation: a close below 41.75, 0.75 away, sets the size. Context: the index trend helps and no catalyst is close, so full planned size. Waiting another day is a partial answer. Where to take profit is not part of the four pillars; plan it with the price action framework (e.g. the old range top near 43.60).",
      whyMarketMoved: "Sellers who broke the level could not keep price below it; buyers defended 42.00 from above and price returned to the old range.",
      evidence: "Touches 42.00 / 42.02 / 41.98; break close 41.80; test wick 42.10 closed 41.85; reclaim close 42.50; lowest low afterwards 42.20; high 44.10.",
    },
  },
  {
    ...pillarBase,
    id: "case-fp-rejection",
    title: "Four pillars 2: a wick rejected at resistance",
    brief:
      "SAMPLE stock, daily candles. Map: resistance near 60.00 turned price back twice (highs 60.00 and 60.05). Today price ran to 60.70 intraday but closed at 59.40, below the level, leaving a long upper wick. Your confirmation for a short, decided in advance: a failed push above the level that closes back below it. Invalidation: a daily close above 60.70, the wick high. The index has been flat and choppy for weeks, and the stock is not extended. You have no position. Buy, short, or hold?",
    preOhlc: REJECT_PRE,
    postOhlc: [...REJECT_PRE, ...REJECT_POST],
    correctActions: ["short"],
    acceptablePartial: ["hold"],
    allowShort: true,
    difficulty: "intermediate",
    debrief: {
      process:
        "Map: a level with two clean touches is real; this is the third test. Confirmation: the wick above 60.00 was a test, and the close back at 59.40 is the statement: buyers could not hold above it. That is the rejection you said you would act on. Invalidation: a close above 60.70, 1.30 away, sets the size. Context: a choppy index does not fight a short at resistance. Buying here would be buying into the level that just rejected; staying flat is a partial answer for anyone who does not short.",
      whyMarketMoved: "Buyers who chased the push above 60.00 were trapped, and their selling added to the drop back toward the bottom of the range.",
      evidence: "Highs 60.00 / 60.05; wick 60.70, close 59.40; highest high afterwards 59.60 (invalidation never hit); closes 58.70, 57.90, 57.40.",
    },
  },
  {
    ...pillarBase,
    id: "case-fp-context-pass",
    title: "Four pillars 3: a good setup in bad context",
    brief:
      "SAMPLE stock, daily candles. The old ceiling at 75.00 broke and today's pullback wicked to 74.90 but closed at 76.10, a clean hold of the level. Invalidation would be a close below 74.90. But the stock is up about 15% in 12 sessions, the index has been choppy, and the CPI report comes out before the open tomorrow. You have no position. Buy, sell, or hold?",
    preOhlc: CONTEXT_PRE,
    postOhlc: [...CONTEXT_PRE, ...CONTEXT_POST],
    correctActions: ["hold"],
    acceptablePartial: ["buy"],
    debrief: {
      process:
        "Map, confirmation and invalidation all check out, and that is the trap: context is the fourth pillar. An extended stock, a choppy index and a market-moving release overnight each argue for less size. Passing is the cleanest answer; a half-size position with the same 74.90 invalidation is a defensible partial. Full size ignores the context.",
      whyMarketMoved: "A hot CPI print knocked the whole market lower and the stock fell straight through 74.90 to 73.20 in one session; a full-size position would have lost more than planned before any exit.",
      evidence: "Run from 66.00 to 78.40; hold candle low 74.90, close 76.10; next day low 73.20, close 73.60.",
    },
  },
];

// ---------------------------------------------------------------- breakout → pullback → fair value gap (thinking mode `fair_value_gap`)
// SAMPLE 5-minute tapes, candles named by their ET start time. Rules: fairValueGap.ts. Checked in fairValueGap.test.ts.

const clock5 = (data: Array<[number, number, number, number]>): OHLC[] =>
  data.map(([o, h, l, c], i) => {
    const m = 10 * 60 + i * 5;
    return bar(`${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`, o, h, l, c);
  });

const FVG_TAPE = clock5([
  [63.4, 63.8, 63.3, 63.7], [63.7, 63.97, 63.55, 63.65], [63.65, 63.9, 63.45, 63.8], [63.8, 63.99, 63.7, 63.85],
  [63.85, 63.96, 63.72, 63.92], [63.92, 65.1, 63.9, 65.0], [65.0, 65.35, 64.45, 65.2], [65.2, 65.4, 64.85, 64.95],
  [64.95, 65.0, 64.3, 64.5], [64.5, 65.1, 64.45, 65.05], [65.05, 65.6, 64.95, 65.5], [65.5, 66.2, 65.4, 66.1],
]);
const FVG_RUN_TAPE = clock5([
  [119.2, 119.7, 119.0, 119.5], [119.5, 119.96, 119.35, 119.6], [119.6, 119.85, 119.3, 119.75], [119.75, 119.98, 119.6, 119.9],
  [119.9, 121.4, 119.85, 121.3], [121.3, 122.1, 120.7, 121.9], [121.9, 122.8, 121.7, 122.6], [122.6, 123.4, 122.4, 123.2],
  [123.2, 123.9, 122.9, 123.7], [123.7, 124.5, 123.5, 124.3], [124.3, 124.6, 123.8, 124.1],
]);
const FVG_FAIL_TAPE = clock5([
  [41.6, 41.85, 41.5, 41.7], [41.7, 41.98, 41.62, 41.8], [41.8, 41.92, 41.55, 41.65], [41.65, 41.97, 41.6, 41.9],
  [41.9, 42.75, 41.88, 42.65], [42.65, 42.95, 42.35, 42.8], [42.8, 42.85, 42.5, 42.55], [42.55, 42.6, 42.2, 42.3],
  [42.3, 42.32, 41.88, 41.9], [41.9, 41.95, 41.5, 41.6], [41.6, 41.7, 41.3, 41.4],
]);

/** Numbers the FVG briefs quote; fairValueGap.test.ts recomputes them from the bars with fvgPlan(). */
export const FVG_CASE_FACTS = {
  main: { level: 64.0, breakoutIndex: 5, gapBottom: 63.96, gapTop: 64.45, pullbackIndex: 8, entry: 64.45, stop: 63.86, risk: 0.59, target: 65.63 },
  run: { level: 120.0, gapBottom: 119.98, gapTop: 120.7, decisionIndex: 7 },
  fail: { level: 42.0, gapBottom: 41.97, gapTop: 42.35, pullbackIndex: 7, entry: 42.35, stop: 41.87, decisionIndex: 8 },
} as const;

const fvgBase = { ...base, thinkingMode: "fair_value_gap" as const };

export const FVG_CASES: CaseStudy[] = [
  {
    ...fvgBase,
    id: "case-fvg-breakout-signal",
    title: "Fair value gap 1: the breakout candle",
    brief:
      "SAMPLE stock, 5-minute candles. 64.00 capped price several times this morning. The 10:25 candle just closed at 65.00, far above it. Your rule (from a short trading reel): the breakout candle is a signal, not an entry; wait to see whether the move leaves a gap, then buy a pullback into it. You have no position. Buy, sell, or hold (stay flat)?",
    preOhlc: FVG_TAPE.slice(0, 6),
    postOhlc: FVG_TAPE,
    correctActions: ["hold"],
    acceptablePartial: ["buy"],
    debrief: {
      process:
        "By this rule the breakout is a signal: wait. The next candle's low (64.45) stayed above the 10:20 high (63.96), leaving a gap, and price pulled back into it at 10:40. Buying the close is a partial answer: it is a different, defensible plan (Framework case 2 buys a breakout close with the stop back inside the base), but it is not this setup, and here it meant sitting through a 0.70 dip.",
      whyMarketMoved: "Late buyers who chased the breakout took profits, and price dipped into the gap before buyers stepped back in.",
      evidence: "Breakout close 65.00; gap 63.96–64.45; pullback low 64.30 at 10:40; high 66.20 at 10:55.",
    },
  },
  {
    ...fvgBase,
    id: "case-fvg-pullback-into-gap",
    title: "Fair value gap 2: the pullback into the gap",
    brief:
      "SAMPLE stock, 5-minute candles. The 10:25 candle broke above 64.00 and left a gap from 63.96 (the 10:20 high) to 64.45 (the 10:30 low). The 10:40 candle pulled back to 64.30, inside the gap, and closed at 64.50. Your rule: buy the pullback into the gap at 64.45, stop just below the gap and the level (63.86), target planned before entry. You have no position. Buy, sell, or hold?",
    preOhlc: FVG_TAPE.slice(0, 9),
    postOhlc: FVG_TAPE,
    correctActions: ["buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "This is the entry the setup waits for. Entry 64.45, stop 63.86: risk 0.59 a share. The reel gives no target rule, so plan one: a 2R example is 65.63 (see the price action trading framework for targets and trailing stops). Staying flat is a partial answer: it costs nothing, but the plan's entry printed. The gap holding is a common belief, not a guarantee: the stop is there for when it does not.",
      whyMarketMoved: "Buyers defended the gap and the old resistance, and price climbed to new highs.",
      evidence: "Gap 63.96–64.45; pullback low 64.30; lowest low afterwards 64.45 (never near 63.86); high 66.20 above the 65.63 example target.",
    },
  },
  {
    ...fvgBase,
    id: "case-fvg-never-retested",
    title: "Fair value gap 3: the gap that never got retested",
    brief:
      "SAMPLE stock, 5-minute candles. A breakout above 120.00 at 10:20 left a gap from 119.98 to 120.70. Price never came back to it, and the 10:35 candle has closed at 123.20. Your rule buys only a pullback into the gap, with the stop below 119.98. You have no position. Buy, sell, or hold (stay flat)?",
    preOhlc: FVG_RUN_TAPE.slice(0, 8),
    postOhlc: FVG_RUN_TAPE,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process:
        "No pullback, no entry. Buying 123.20 with the stop where it belongs (below 119.98) risks more than 3.20 a share, about four times the 0.82 the setup was built for. A missed trade is the cost of waiting; chasing throws away the reason you waited. The reel's \"gaps are often retested\" is a belief, and this one never was.",
      whyMarketMoved: "Strong demand kept price climbing without a pullback; the gap was never revisited.",
      evidence: "Gap 119.98–120.70; lowest low after the gap 121.70; high 124.60.",
    },
  },
  {
    ...fvgBase,
    id: "case-fvg-gap-fails",
    title: "Fair value gap 4: the gap that did not hold",
    brief:
      "SAMPLE stock, 5-minute candles. You bought the pullback into a gap (41.97–42.35) left by a breakout above 42.00: entry 42.35, stop 41.87. The 10:40 candle just closed at 41.90, below the gap and back under 42.00. Its low was 41.88, so the stop has not filled yet. You are long. Buy more, sell, or hold?",
    preOhlc: FVG_FAIL_TAPE.slice(0, 9),
    postOhlc: FVG_FAIL_TAPE,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process:
        "A close below the gap and back under the broken level is the invalidation: the breakout idea has failed. Exit now for a loss of about 0.45 a share, close to the 0.48 planned. Holding is a partial answer only because the 41.87 stop is still in place and would fill next. Buying more because \"gaps get retested\" turns a planned loss into a big one.",
      whyMarketMoved: "The breakout failed; trapped buyers sold and price slid back into the old range.",
      evidence: "Gap 41.97–42.35; close 41.90 below it; next lows 41.50 and 41.30, through the 41.87 stop.",
    },
  },
];
