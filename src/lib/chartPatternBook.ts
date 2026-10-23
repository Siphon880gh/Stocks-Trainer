/**
 * Chart, gap and volume patterns: windows, the four gap types, island reversals, flags and pennants,
 * triangles, rectangles, channels, rounding tops / bottoms, cups, broadening formations, diamonds,
 * the V bottom, volume patterns (climax, dry-up, breakout volume, divergence), complex head-and-shoulders
 * tops and bottoms, and the low tight flag.
 *
 * One table feeds the Archive (patterns.ts), the glossary and flashcards (literacyTerms.ts), the SIMULATED
 * charts and Buy-or-Sell drill specs (ohlcData.ts, buySellDrill.ts), the three-tab detail (patternTabs.ts)
 * and the Learn group "chart-patterns" (quizData.ts). Type-only imports, so there is no runtime cycle.
 *
 * Definitions follow StockCharts ChartSchool, Bulkowski (thepatternsite.com) and Nison (windows).
 * Charts are SIMULATED: built from swing points so the tests can check each textbook rule on the bars.
 */
import type { OHLC } from "./ohlcData";
import type { PatternDef, PatternSentiment } from "./patterns";
import type { LiteracyTerm } from "./literacyTerms";
import type { QuizOption, QuizQuestion } from "./quizData";
import type { TradePlan } from "./patternTabs";

export type BookGroup =
  | "window"
  | "gap"
  | "island"
  | "flag"
  | "triangle"
  | "rectangle"
  | "channel"
  | "rounding"
  | "cup"
  | "broadening"
  | "diamond"
  | "spike"
  | "volume"
  | "push"
  | "hs";

export interface BookBuild {
  /** Swing points [bar index, close]; closes are interpolated between them. */
  pivots: Array<[number, number]>;
  /** Bar index -> opening jump from the prior close (a gap). */
  gaps?: Record<number, number>;
  /** Volume waypoints [bar index, thousands of shares], interpolated. */
  vol: Array<[number, number]>;
  /** Bar index -> volume multiple (spikes). */
  spikes?: Record<number, number>;
  /** Bar index -> forced low (long lower wick). */
  lows?: Record<number, number>;
  noise?: number;
  seed: number;
}

export interface BookPattern {
  id: string;
  name: string;
  group: BookGroup;
  sentiment: PatternSentiment;
  type: PatternDef["type"];
  confirmation: PatternDef["confirmation"];
  /** Price-action name that is less standard than the classic chart patterns. */
  lessStandard?: boolean;
  /** One-line shape (glossary summary, quiz option text). */
  short: string;
  recognise: string[];
  psychology: string[];
  /** One-line psychology (quiz option text). */
  psy: string;
  trade: TradePlan;
  /** Short stop phrase for the drill ("below the flag's low"). */
  stopAt: string;
  /** Volume patterns: what the volume pane adds. */
  volumeRead?: string;
  /** Highlighted bar in the quiz chart. */
  mark: number;
  /** Bar that completes the pattern (breakout / confirmation); drill charts end here. */
  end: number;
  dir: "up" | "down";
  /** Two pattern ids from this table for the pick-the-chart question. */
  lookalikes: [string, string];
  /** Three pattern ids from this table for the name-it and psychology questions. */
  confusers: [string, string, string];
  source: string;
  build: BookBuild;
}

const SC = "https://chartschool.stockcharts.com/table-of-contents/chart-analysis";
export const CHART_BOOK_SOURCES = {
  gaps: `${SC}/gaps-and-gap-analysis`,
  flags: `${SC}/chart-patterns/flag-pennant`,
  ascending: `${SC}/chart-patterns/ascending-triangle`,
  descending: `${SC}/chart-patterns/descending-triangle`,
  rectangle: `${SC}/chart-patterns/rectangle`,
  channel: `${SC}/chart-patterns/price-channel`,
  rounding: `${SC}/chart-patterns/rounding-bottom`,
  cup: `${SC}/chart-patterns/cup-with-handle`,
  broadening: `${SC}/chart-patterns/broadening-top-or-megaphone-top`,
  spike: "https://chartschool.stockcharts.com/table-of-contents/glossary/glossary-r#reversal_spike",
  windows: "https://www.stocata.org/ta_en/basic5.html",
  htf: "https://thepatternsite.com/htf.html",
  island: "https://thepatternsite.com/islandrev.html",
  icup: "https://thepatternsite.com/icup.html",
  roundingTop: "https://thepatternsite.com/roundingtop.html",
  broadb: "https://thepatternsite.com/broadb.html",
  diamond: "https://thepatternsite.com/diamondt.html",
  chst: "https://thepatternsite.com/chst.html",
  chsb: "https://thepatternsite.com/chsb.html",
  ltf: "https://deepvue.com/screener/leif-soreide-screens/",
} as const;
const S = CHART_BOOK_SOURCES;

// ---------- SIMULATED bar builder ----------
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function interp(points: Array<[number, number]>, i: number): number {
  for (let k = 0; k < points.length - 1; k++) {
    const [x0, y0] = points[k];
    const [x1, y1] = points[k + 1];
    if (i >= x0 && i <= x1) return y0 + ((y1 - y0) * (i - x0)) / (x1 - x0 || 1);
  }
  return points[points.length - 1][1];
}

export function buildBars(b: BookBuild): OHLC[] {
  const r = rng(b.seed);
  const n = b.pivots[b.pivots.length - 1][0] + 1;
  const pivotAt = new Set(b.pivots.map(([i]) => i));
  const noise = b.noise ?? 3;
  const gapAt = (i: number) => b.gaps?.[i] ?? 0;
  const out: OHLC[] = [];
  for (let i = 0; i < n; i++) {
    const base = interp(b.pivots, i);
    const close = Math.round(pivotAt.has(i) ? base : base + (r() * 2 - 1) * noise);
    const prev = out[i - 1];
    const open = prev ? prev.close + gapAt(i) : Math.round(close - (interp(b.pivots, 1) - close) * 0.5);
    // No wick into a gap: the bar before an up gap has no upper wick, the gap bar no lower wick (mirror for down gaps).
    const wUp = gapAt(i) < 0 || gapAt(i + 1) > 0 ? 0 : 1 + Math.floor(r() * 3);
    const wDn = gapAt(i) > 0 || gapAt(i + 1) < 0 ? 0 : 1 + Math.floor(r() * 3);
    const high = Math.max(open, close) + wUp;
    const low = b.lows?.[i] ?? Math.min(open, close) - wDn;
    const v = interp(b.vol, i) * (0.9 + r() * 0.2) * (b.spikes?.[i] ?? 1);
    out.push({ name: String(i + 1), open, high, low, close, volume: Math.round(v) * 1000 });
  }
  return out;
}

const up = (stop: string, target: string, confirmation: string, entry = "Long on the confirming close, or on a retest of the broken level that holds."): TradePlan => ({ confirmation, entry, stop, target });
const down = (stop: string, target: string, confirmation: string, entry = "Exit longs or short on the confirming close, or on a retest of the broken level that fails."): TradePlan => ({ confirmation, entry, stop, target });

export const CHART_BOOK: BookPattern[] = [
  // ---------- windows (Japanese name for gaps) ----------
  {
    id: "rising-window",
    name: "Rising Window",
    group: "window",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    short: "In an uptrend, a candle whose low is above the prior candle's high: an open gap.",
    recognise: [
      "The trend is already up.",
      "The next candle's low is above the prior candle's high, so there is an empty space (the window) between them. Window is the Japanese candlestick name for a gap up.",
      "The whole window is a support zone. It counts as broken only on a close below the bottom of the window.",
    ],
    psychology: [
      "Demand built between bars, so buyers paid up from the first trade.",
      "Nobody sold inside the window's prices: that empty area is where late buyers want back in.",
      "Pullbacks that stop at the window show buyers defending it.",
    ],
    psy: "Buyers paid up from the first trade, and pullbacks into the empty space get bought.",
    trade: up(
      "Below the bottom of the window (the prior candle's high), on a closing basis.",
      "The next resistance or swing high.",
      "Later candles hold above the window; a pullback into it that closes back up is the classic buy point.",
      "Long on a pullback into the window that closes back up, not on the gap itself.",
    ),
    stopAt: "below the window",
    mark: 7,
    end: 7,
    dir: "up",
    lookalikes: ["falling-window", "exhaustion-gap"],
    confusers: ["falling-window", "exhaustion-gap", "breakaway-gap"],
    source: S.windows,
    build: { seed: 101, pivots: [[0, 1000], [6, 1060], [7, 1085], [9, 1074], [12, 1104]], gaps: { 7: 16 }, vol: [[0, 300], [12, 320]], spikes: { 7: 1.6 } },
  },
  {
    id: "falling-window",
    name: "Falling Window",
    group: "window",
    sentiment: "bearish",
    type: "continuation",
    confirmation: "medium",
    short: "In a downtrend, a candle whose high is below the prior candle's low: an open gap down.",
    recognise: [
      "The trend is already down.",
      "The next candle's high is below the prior candle's low, leaving an empty space (the window). Window is the Japanese name for a gap down.",
      "The whole window is a resistance zone. It counts as broken only on a close above the top of the window.",
    ],
    psychology: [
      "Selling built up between bars, so sellers accepted lower prices from the first trade.",
      "Nobody bought inside the window's prices; trapped buyers above it want out at break-even.",
      "Bounces that stall at the window show sellers defending it.",
    ],
    psy: "Sellers accepted lower prices from the first trade, and bounces into the empty space get sold.",
    trade: down(
      "Above the top of the window (the prior candle's low), on a closing basis.",
      "The next support or swing low.",
      "Later candles stay below the window; a bounce into it that closes back down is the classic sell point.",
      "Exit longs or short on a bounce into the window that closes back down.",
    ),
    stopAt: "above the window",
    mark: 7,
    end: 7,
    dir: "down",
    lookalikes: ["rising-window", "breakaway-gap"],
    confusers: ["rising-window", "exhaustion-gap", "island-top"],
    source: S.windows,
    build: { seed: 102, pivots: [[0, 1100], [6, 1040], [7, 1015], [9, 1026], [12, 996]], gaps: { 7: -16 }, vol: [[0, 300], [12, 320]], spikes: { 7: 1.6 } },
  },
  // ---------- gap types ----------
  {
    id: "breakaway-gap",
    name: "Breakaway Gap",
    group: "gap",
    sentiment: "bullish",
    type: "reversal",
    confirmation: "high",
    short: "A gap out of a trading range on heavy volume: the start of a new move.",
    recognise: [
      "Price has spent weeks in a range (a congestion area).",
      "It gaps clean out of the range: the gap candle's low is above the prior high and above the range's top.",
      "Volume jumps on or right after the gap. The old range top now acts as support.",
    ],
    psychology: [
      "Inside the range, buyers and sellers were balanced.",
      "News or a shift in demand broke the balance: buyers chased, and short sellers caught on the wrong side had to cover.",
      "Heavy volume shows real participation rather than a thin-market jump.",
    ],
    psy: "A balanced range breaks: buyers chase, trapped shorts cover, and volume proves it.",
    trade: up(
      "Below the gap; a close back inside the old range cancels the breakout.",
      "The range height added to the breakout level, then the next resistance.",
      "The gap holds and volume stays above average after the breakout.",
    ),
    stopAt: "below the gap and back inside the range",
    mark: 15,
    end: 15,
    dir: "up",
    lookalikes: ["runaway-gap", "exhaustion-gap"],
    confusers: ["runaway-gap", "exhaustion-gap", "rising-window"],
    source: S.gaps,
    build: { seed: 103, pivots: [[0, 1020], [3, 1040], [6, 1003], [9, 1038], [12, 1005], [14, 1032], [15, 1072], [18, 1096], [20, 1106]], gaps: { 15: 24 }, vol: [[0, 250], [14, 230], [15, 260], [20, 380]], spikes: { 15: 3 } },
  },
  {
    id: "runaway-gap",
    name: "Runaway (Measuring) Gap",
    group: "gap",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    short: "A gap in the middle of a strong trend, in the trend's direction.",
    recognise: [
      "A strong trend is already under way.",
      "Price gaps again in the trend's direction, often on rising volume.",
      "It is also called a measuring gap: it often appears near the middle of the move, so the distance from the trend's start to the gap is projected beyond the gap.",
    ],
    psychology: [
      "Traders who missed the first leg gave up waiting for a pullback and bought at any price.",
      "In a downtrend the mirror image is holders rushing out.",
      "The gap shows the trend gaining urgency, not ending.",
    ],
    psy: "Traders who missed the move stop waiting for a pullback and chase it.",
    trade: up(
      "Below the gap; a close that fills it weakens the measuring idea.",
      "The move from the trend's start to the gap, added to the gap: a rough guide.",
      "The gap stays open and the trend makes new highs after it.",
    ),
    stopAt: "below the gap",
    mark: 11,
    end: 11,
    dir: "up",
    lookalikes: ["breakaway-gap", "exhaustion-gap"],
    confusers: ["breakaway-gap", "exhaustion-gap", "falling-window"],
    source: S.gaps,
    build: { seed: 104, pivots: [[0, 1000], [10, 1100], [11, 1124], [20, 1230]], gaps: { 11: 15 }, vol: [[0, 300], [10, 360], [20, 360]], spikes: { 11: 1.8 } },
  },
  {
    id: "exhaustion-gap",
    name: "Exhaustion Gap",
    group: "gap",
    sentiment: "bearish",
    type: "reversal",
    confirmation: "medium",
    short: "A last gap at the end of a long trend on huge volume, quickly filled.",
    recognise: [
      "A long, mature uptrend.",
      "Price gaps up again on exceptionally high volume.",
      "Within a few bars the gap is filled: price closes back below the high of the bar before the gap. Without the fill it can look like a runaway gap.",
    ],
    psychology: [
      "Euphoria: the last buyers pile in at any price.",
      "With those buyers in, there is nobody left to push higher.",
      "The quick fill leaves the late buyers trapped.",
    ],
    psy: "The last euphoric buyers pile in; once they are in, nobody is left to buy.",
    trade: down(
      "Above the exhaustion gap's high.",
      "The prior swing low or support; a full trend reversal needs more evidence.",
      "The gap is filled: a close below the high of the bar before the gap.",
    ),
    stopAt: "above the gap's high",
    mark: 17,
    end: 19,
    dir: "down",
    lookalikes: ["runaway-gap", "island-top"],
    confusers: ["runaway-gap", "breakaway-gap", "rising-window"],
    source: S.gaps,
    build: { seed: 105, pivots: [[0, 1000], [16, 1200], [17, 1236], [18, 1226], [19, 1192], [21, 1180], [24, 1156]], gaps: { 17: 20 }, vol: [[0, 300], [16, 380], [24, 360]], spikes: { 17: 3.5, 18: 1.8, 19: 1.6 } },
  },
  {
    id: "island-top",
    name: "Island Top (Island Reversal)",
    group: "island",
    sentiment: "bearish",
    type: "reversal",
    confirmation: "high",
    short: "A gap up, a cluster of bars, then a gap down that strands them.",
    recognise: [
      "Price trends up into the pattern.",
      "A gap up starts the island; one bar to several weeks of trading follow.",
      "A gap down ends it. The two gaps share some of the same prices, so the island is cut off from the rest of the chart. Volume is high on the second gap.",
    ],
    psychology: [
      "Buyers who bought the first gap are all on the island.",
      "The gap down leaves every one of them at a loss with no prices traded in between.",
      "Their selling on bounces feeds the reversal.",
    ],
    psy: "Everyone who bought on the island is trapped at a loss once the second gap opens below.",
    trade: down(
      "Above the island's high.",
      "A share of the island's height below its low (Bulkowski's measure rule), then the next support.",
      "The second gap stays open: no close back into the island.",
    ),
    stopAt: "above the island's high",
    mark: 15,
    end: 15,
    dir: "down",
    lookalikes: ["island-bottom", "exhaustion-gap"],
    confusers: ["island-bottom", "exhaustion-gap", "falling-window"],
    source: S.island,
    build: { seed: 106, pivots: [[0, 1000], [10, 1100], [11, 1128], [12, 1136], [13, 1125], [14, 1131], [15, 1082], [19, 1050]], gaps: { 11: 18, 15: -36 }, vol: [[0, 300], [19, 320]], spikes: { 11: 1.5, 15: 2.6 } },
  },
  {
    id: "island-bottom",
    name: "Island Bottom (Island Reversal)",
    group: "island",
    sentiment: "bullish",
    type: "reversal",
    confirmation: "high",
    short: "A gap down, a cluster of bars, then a gap up that strands them.",
    recognise: [
      "Price trends down into the pattern.",
      "A gap down starts the island; one bar to several weeks of trading follow.",
      "A gap up ends it. The two gaps share some of the same prices, so the island is cut off. Volume is high on the second gap.",
    ],
    psychology: [
      "Sellers who sold the first gap are all on the island.",
      "The gap up leaves every one of them losing, and short sellers must buy to cover.",
      "That forced buying feeds the reversal.",
    ],
    psy: "Everyone who sold on the island is trapped once the second gap opens above.",
    trade: up(
      "Below the island's low.",
      "A share of the island's height above its high, then the next resistance.",
      "The second gap stays open: no close back into the island.",
    ),
    stopAt: "below the island's low",
    mark: 15,
    end: 15,
    dir: "up",
    lookalikes: ["island-top", "breakaway-gap"],
    confusers: ["island-top", "breakaway-gap", "rising-window"],
    source: S.island,
    build: { seed: 107, pivots: [[0, 1150], [10, 1050], [11, 1022], [12, 1014], [13, 1025], [14, 1019], [15, 1068], [19, 1100]], gaps: { 11: -18, 15: 36 }, vol: [[0, 300], [19, 320]], spikes: { 11: 1.5, 15: 2.6 } },
  },
  // ---------- flags and pennants ----------
  {
    id: "bear-flag",
    name: "Bear Flag",
    group: "flag",
    sentiment: "bearish",
    type: "continuation",
    confirmation: "medium",
    short: "A sharp drop (the pole), then a small channel sloping up, then a break lower.",
    recognise: [
      "A sharp decline on heavy volume forms the flagpole.",
      "A small rectangle that slopes up, against the trend, forms the flag. Volume contracts.",
      "A close below the flag's lower line resumes the decline. Flags usually last one to four weeks on a daily chart; past about 12 weeks it is a rectangle.",
    ],
    psychology: [
      "Sellers drove price down fast.",
      "The flag is a pause: some shorts take profits and bargain hunters buy, but on light volume.",
      "When the light buying runs out, sellers press again.",
    ],
    psy: "After a fast drop, a weak, low-volume bounce is a pause, not a reversal.",
    trade: down(
      "Above the flag's high.",
      "The flagpole's length subtracted from the breakdown point.",
      "A close below the flag's lower line, ideally on expanding volume.",
    ),
    stopAt: "above the flag's high",
    mark: 15,
    end: 15,
    dir: "down",
    lookalikes: ["bear-pennant", "ascending-channel"],
    confusers: ["bear-pennant", "high-tight-flag", "ascending-channel"],
    source: S.flags,
    build: { seed: 108, pivots: [[0, 1200], [6, 1080], [8, 1100], [9, 1089], [11, 1108], [12, 1097], [14, 1114], [15, 1078], [18, 1040]], vol: [[0, 480], [6, 520], [7, 260], [14, 200], [15, 420], [18, 380]] },
  },
  {
    id: "bull-pennant",
    name: "Bull Pennant",
    group: "flag",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    short: "A sharp rise (the pole), then a small converging triangle, then a break higher.",
    recognise: [
      "A sharp advance on heavy volume forms the flagpole.",
      "A small symmetrical triangle forms: lower highs and higher lows that converge, with a roughly flat slope. Volume contracts.",
      "A close above the pennant's upper line resumes the advance.",
    ],
    psychology: [
      "Buyers drove price up fast.",
      "In the pennant, profit taking and new buying balance out and the swings shrink.",
      "Buyers win the squeeze when price closes out of the top.",
    ],
    psy: "After a fast rise, shrinking swings on light volume show a rest before the next leg.",
    trade: up(
      "Below the pennant's low.",
      "The flagpole's length added to the breakout point.",
      "A close above the pennant's upper line, ideally on expanding volume.",
    ),
    stopAt: "below the pennant's low",
    mark: 15,
    end: 15,
    dir: "up",
    lookalikes: ["bear-pennant", "ascending-triangle"],
    confusers: ["bear-pennant", "bear-flag", "high-tight-flag"],
    source: S.flags,
    build: { seed: 109, pivots: [[0, 1000], [6, 1120], [8, 1100], [10, 1116], [12, 1104], [13, 1113], [14, 1107], [15, 1136], [18, 1170]], vol: [[0, 480], [6, 520], [7, 260], [14, 190], [15, 430], [18, 380]], noise: 2 },
  },
  {
    id: "bear-pennant",
    name: "Bear Pennant",
    group: "flag",
    sentiment: "bearish",
    type: "continuation",
    confirmation: "medium",
    short: "A sharp drop, then a small converging triangle, then a break lower.",
    recognise: [
      "A sharp decline on heavy volume forms the flagpole.",
      "A small symmetrical triangle forms with converging lower highs and higher lows. Volume contracts.",
      "A close below the pennant's lower line resumes the decline.",
    ],
    psychology: [
      "Sellers drove price down fast.",
      "In the pennant, short covering and new selling balance out and the swings shrink.",
      "Sellers win the squeeze when price closes out of the bottom.",
    ],
    psy: "After a fast drop, shrinking swings on light volume show a pause before more selling.",
    trade: down(
      "Above the pennant's high.",
      "The flagpole's length subtracted from the breakdown point.",
      "A close below the pennant's lower line, ideally on expanding volume.",
    ),
    stopAt: "above the pennant's high",
    mark: 15,
    end: 15,
    dir: "down",
    lookalikes: ["bull-pennant", "descending-triangle"],
    confusers: ["bull-pennant", "bear-flag", "descending-triangle"],
    source: S.flags,
    build: { seed: 110, pivots: [[0, 1200], [6, 1080], [8, 1100], [10, 1084], [12, 1096], [13, 1087], [14, 1093], [15, 1064], [18, 1030]], vol: [[0, 480], [6, 520], [7, 260], [14, 190], [15, 430], [18, 380]], noise: 2 },
  },
  {
    id: "high-tight-flag",
    name: "High and Tight Flag",
    group: "flag",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    short: "Price nearly doubles in two months or less, then pauses in a tight, shallow consolidation.",
    recognise: [
      "Price rises at least about 90% in two months or less (Bulkowski's rule).",
      "A short consolidation follows; it often does not look like a neat flag, just a tight pause. Volume recedes.",
      "It confirms only on a close above the highest peak in the pattern, usually the top of the pole.",
    ],
    psychology: [
      "A powerful run with strong demand.",
      "Holders refuse to sell much: the pause stays tight and shallow on falling volume.",
      "A close above the pole's high shows the demand is still there.",
    ],
    psy: "After a near-doubling, holders refuse to sell: the pause stays tight and shallow.",
    trade: up(
      "Below the flag's low.",
      "Half the pole's height added to the flag's low (Bulkowski's measure rule).",
      "A close above the highest peak in the pattern (the pole's top), not just a break of the flag's trendline.",
      "A buy stop above the pattern's highest high.",
    ),
    stopAt: "below the flag's low",
    mark: 21,
    end: 21,
    dir: "up",
    lookalikes: ["bull-pennant", "cup-and-handle"],
    confusers: ["bull-pennant", "bear-flag", "rounding-bottom"],
    source: S.htf,
    build: { seed: 111, pivots: [[0, 600], [12, 1150], [14, 1102], [16, 1136], [18, 1108], [20, 1140], [21, 1180]], vol: [[0, 300], [12, 620], [13, 320], [20, 220], [21, 520]], noise: 6 },
  },
  // ---------- triangles ----------
  {
    id: "ascending-triangle",
    name: "Ascending Triangle",
    group: "triangle",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    short: "A flat top and rising lows: buyers press into fixed resistance.",
    recognise: [
      "Usually forms in an uptrend as a bullish continuation, though it can appear at a bottom.",
      "At least two highs at about the same price make a flat resistance line; at least two higher lows make a rising support line.",
      "Volume usually contracts as it forms and expands on a close above resistance.",
    ],
    psychology: [
      "Sellers defend one price; each time they sell there.",
      "Buyers come in sooner each dip, so the lows rise.",
      "When the sellers at the line run out, price breaks through.",
    ],
    psy: "Sellers hold one price while buyers step in sooner on every dip.",
    trade: up(
      "Below the last higher low, or back below the old resistance (now support).",
      "The triangle's height at its widest part, added to the breakout.",
      "A close above the flat resistance line, ideally on expanding volume.",
    ),
    stopAt: "below the last higher low",
    mark: 21,
    end: 21,
    dir: "up",
    lookalikes: ["descending-triangle", "bullish-rectangle"],
    confusers: ["descending-triangle", "bullish-rectangle", "bull-pennant"],
    source: S.ascending,
    build: { seed: 112, pivots: [[0, 940], [4, 1000], [7, 958], [10, 1000], [13, 974], [16, 1000], [18, 987], [20, 1000], [21, 1030], [23, 1046]], vol: [[0, 400], [20, 240], [21, 560], [23, 420]], noise: 2 },
  },
  {
    id: "descending-triangle",
    name: "Descending Triangle",
    group: "triangle",
    sentiment: "bearish",
    type: "continuation",
    confirmation: "medium",
    short: "A flat bottom and falling highs: sellers press into fixed support.",
    recognise: [
      "Usually forms in a downtrend as a bearish continuation, though it can appear at a top.",
      "At least two lows at about the same price make a flat support line; at least two lower highs make a falling resistance line.",
      "A close below support completes it. Volume often expands on the break.",
    ],
    psychology: [
      "Buyers defend one price.",
      "Sellers sell sooner on each bounce, so the highs fall.",
      "When the buyers at the line are exhausted, support gives way.",
    ],
    psy: "Buyers hold one price while sellers step in sooner on every bounce.",
    trade: down(
      "Above the last lower high, or back above the old support (now resistance).",
      "The triangle's height subtracted from the breakdown.",
      "A close below the flat support line.",
    ),
    stopAt: "above the last lower high",
    mark: 21,
    end: 21,
    dir: "down",
    lookalikes: ["ascending-triangle", "bearish-rectangle"],
    confusers: ["ascending-triangle", "bearish-rectangle", "bear-pennant"],
    source: S.descending,
    build: { seed: 113, pivots: [[0, 1060], [4, 1000], [7, 1042], [10, 1000], [13, 1026], [16, 1000], [18, 1013], [20, 1000], [21, 970], [23, 954]], vol: [[0, 400], [20, 240], [21, 560], [23, 420]], noise: 2 },
  },
  // ---------- rectangles ----------
  {
    id: "bullish-rectangle",
    name: "Bullish Rectangle",
    group: "rectangle",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    short: "In an uptrend, a flat trading range between two parallel lines, then a close above the top.",
    recognise: [
      "A prior uptrend.",
      "At least two similar highs and two similar lows make two parallel, horizontal lines: a trading range, also called a congestion area.",
      "The direction is unknown until the breakout; the bullish version closes above the top line. Under about three weeks it is usually called a flag.",
    ],
    psychology: [
      "Buyers step in at the bottom; sellers take over at the top.",
      "Neither side wins inside the box.",
      "One side tires; in the bullish version buyers absorb the supply at the top.",
    ],
    psy: "Bulls and bears trade blows inside a box until buyers absorb the supply at the top.",
    trade: up(
      "Back inside the rectangle (below the top line), or below the bottom line for a wider stop.",
      "The rectangle's height added to the breakout.",
      "A close above the top line; some traders add a price, time or volume filter.",
    ),
    stopAt: "back inside the rectangle",
    mark: 23,
    end: 23,
    dir: "up",
    lookalikes: ["bearish-rectangle", "ascending-triangle"],
    confusers: ["bearish-rectangle", "ascending-triangle", "ascending-channel"],
    source: S.rectangle,
    build: { seed: 114, pivots: [[0, 900], [5, 1000], [8, 951], [11, 1000], [14, 952], [17, 999], [20, 950], [22, 986], [23, 1030], [25, 1046]], vol: [[0, 380], [22, 300], [23, 600], [25, 420]], noise: 2 },
  },
  {
    id: "bearish-rectangle",
    name: "Bearish Rectangle",
    group: "rectangle",
    sentiment: "bearish",
    type: "continuation",
    confirmation: "medium",
    short: "In a downtrend, a flat trading range between two parallel lines, then a close below the bottom.",
    recognise: [
      "A prior downtrend.",
      "At least two similar highs and two similar lows make two parallel, horizontal lines.",
      "The bearish version closes below the bottom line. Broken support then often acts as resistance on a retest.",
    ],
    psychology: [
      "Bargain hunters buy the bottom; sellers sell the top.",
      "Neither side wins inside the box.",
      "In the bearish version the buyers at the bottom give up.",
    ],
    psy: "Bargain hunters defend the floor of a box until they give up and sellers win.",
    trade: down(
      "Back inside the rectangle (above the bottom line).",
      "The rectangle's height subtracted from the breakdown.",
      "A close below the bottom line.",
    ),
    stopAt: "back inside the rectangle",
    mark: 23,
    end: 23,
    dir: "down",
    lookalikes: ["bullish-rectangle", "descending-triangle"],
    confusers: ["bullish-rectangle", "descending-triangle", "descending-channel"],
    source: S.rectangle,
    build: { seed: 115, pivots: [[0, 1100], [5, 1000], [8, 1049], [11, 1000], [14, 1048], [17, 1001], [20, 1050], [22, 1014], [23, 970], [25, 954]], vol: [[0, 380], [22, 300], [23, 600], [25, 420]], noise: 2 },
  },
  // ---------- channels ----------
  {
    id: "ascending-channel",
    name: "Ascending Channel",
    group: "channel",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    short: "Higher highs and higher lows between two parallel rising lines.",
    recognise: [
      "A rising trendline under the lows and a parallel line over the highs.",
      "Price swings between them: the lower line is support, the upper line is resistance.",
      "A close below the lower line warns the uptrend may be changing.",
    ],
    psychology: [
      "Buyers return at higher prices on each dip.",
      "Profit taking near the upper line keeps the swings regular.",
      "The channel lasts while buyers keep showing up at the lower line.",
    ],
    psy: "Buyers return at higher prices on every dip; profit taking caps each swing.",
    trade: up(
      "Below the lower channel line.",
      "The upper channel line.",
      "A bounce off the lower line that closes back up.",
      "Long near the lower line after the bounce closes up; take profits near the upper line.",
    ),
    stopAt: "below the lower channel line",
    mark: 24,
    end: 26,
    dir: "up",
    lookalikes: ["descending-channel", "bear-flag"],
    confusers: ["descending-channel", "bear-flag", "broadening-bottom"],
    source: S.channel,
    build: { seed: 116, pivots: [[0, 1000], [4, 1070], [8, 1040], [12, 1110], [16, 1080], [20, 1150], [24, 1120], [27, 1150]], vol: [[0, 300], [27, 300]], noise: 2 },
  },
  {
    id: "descending-channel",
    name: "Descending Channel",
    group: "channel",
    sentiment: "bearish",
    type: "continuation",
    confirmation: "medium",
    short: "Lower highs and lower lows between two parallel falling lines.",
    recognise: [
      "A falling trendline over the highs and a parallel line under the lows.",
      "Price swings between them: the upper line is resistance, the lower line is support.",
      "A close above the upper line warns the downtrend may be changing.",
    ],
    psychology: [
      "Sellers return at lower prices on each bounce.",
      "Short covering near the lower line keeps the swings regular.",
      "The channel lasts while sellers keep showing up at the upper line.",
    ],
    psy: "Sellers return at lower prices on every bounce; short covering cushions each drop.",
    trade: down(
      "Above the upper channel line.",
      "The lower channel line.",
      "A rejection at the upper line that closes back down.",
      "Exit longs or short near the upper line after the rejection closes down; cover near the lower line.",
    ),
    stopAt: "above the upper channel line",
    mark: 24,
    end: 26,
    dir: "down",
    lookalikes: ["ascending-channel", "bull-pennant"],
    confusers: ["ascending-channel", "bearish-rectangle", "broadening-top"],
    source: S.channel,
    build: { seed: 117, pivots: [[0, 1200], [4, 1130], [8, 1160], [12, 1090], [16, 1120], [20, 1050], [24, 1080], [27, 1050]], vol: [[0, 300], [27, 300]], noise: 2 },
  },
  // ---------- rounding ----------
  {
    id: "rounding-bottom",
    name: "Rounding Bottom (Saucer)",
    group: "rounding",
    sentiment: "bullish",
    type: "reversal",
    confirmation: "medium",
    short: "A slow, bowl-shaped turn from decline to advance, best seen on weekly charts.",
    recognise: [
      "A prior decline leads into the pattern.",
      "The low is a gradual U, not a sharp V; the advance on the right side takes about as long as the decline on the left.",
      "Volume ideally tracks the bowl: high early, low at the bottom, rising on the advance. It confirms on a break above the reaction high where the decline began.",
    ],
    psychology: [
      "Selling slowly dries up; nobody is in a hurry either way at the bottom.",
      "Buyers return gradually and then more eagerly.",
      "A long base means a long-term change in who is in control.",
    ],
    psy: "Selling slowly dries up and buyers return gradually: a long, patient change of control.",
    trade: up(
      "Below the right side of the bowl (a higher low), or below the bowl's low for a wide stop.",
      "The depth of the bowl added to the breakout, then the next resistance.",
      "A close above the reaction high at the start of the decline, preferably on rising volume.",
    ),
    stopAt: "below the right side of the bowl",
    mark: 32,
    end: 32,
    dir: "up",
    lookalikes: ["cup-and-handle", "v-bottom"],
    confusers: ["cup-and-handle", "v-bottom", "rounding-top"],
    source: S.rounding,
    build: { seed: 118, pivots: [[0, 1100], [4, 1056], [8, 1018], [12, 994], [16, 986], [20, 994], [24, 1022], [28, 1066], [31, 1096], [32, 1118], [34, 1128]], vol: [[0, 480], [16, 180], [31, 380], [32, 560], [34, 460]], noise: 2 },
  },
  {
    id: "rounding-top",
    name: "Rounding Top",
    group: "rounding",
    sentiment: "bearish",
    type: "reversal",
    confirmation: "medium",
    short: "A slow, dome-shaped turn from advance to decline.",
    recognise: [
      "Price trends up into the pattern.",
      "Prices form a gentle curve, a half-moon shape; the two rims end near the same price.",
      "A downward breakout is a close below the lower of the two rims.",
    ],
    psychology: [
      "Buying slowly fades; the rally loses speed before it loses direction.",
      "Sellers gradually take over.",
      "A break below the rims leaves the dome's buyers under water.",
    ],
    psy: "Buying slowly fades and sellers take over bit by bit: a dome, not a spike.",
    trade: down(
      "Above the right side of the dome.",
      "A share of the dome's height subtracted from the right rim low (Bulkowski's measure rule).",
      "A close below the lower of the two rims.",
    ),
    stopAt: "above the right side of the dome",
    mark: 35,
    end: 35,
    dir: "down",
    lookalikes: ["rounding-bottom", "inverse-cup-and-handle"],
    confusers: ["rounding-bottom", "inverse-cup-and-handle", "diamond-top"],
    source: S.roundingTop,
    build: { seed: 119, pivots: [[0, 960], [3, 1000], [7, 1050], [11, 1090], [15, 1110], [19, 1116], [23, 1106], [27, 1076], [31, 1032], [34, 1006], [35, 978], [37, 966]], vol: [[0, 380], [19, 260], [34, 320], [35, 520], [37, 440]], noise: 2 },
  },
  // ---------- cups ----------
  {
    id: "cup-and-handle",
    name: "Cup and Handle",
    group: "cup",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "high",
    short: "After an advance, a U-shaped bowl, a short pullback (the handle), then a breakout.",
    recognise: [
      "A prior advance, ideally a few months old (William O'Neil's pattern).",
      "A U-shaped cup that ideally retraces a third or less of that advance; a V is too sharp to qualify.",
      "A short pullback, the handle, forms near the right rim. The pattern completes on a close above the handle's resistance with a jump in volume.",
    ],
    psychology: [
      "Holders who bought near the left rim sell as price returns there, which forms the handle.",
      "Once that supply is absorbed, little selling is left overhead.",
      "Volume on the breakout shows new demand.",
    ],
    psy: "The handle absorbs the last sellers from the left rim; then little supply is left overhead.",
    trade: up(
      "Below the handle's low.",
      "The cup's depth (right rim to the bottom of the cup) added to the breakout.",
      "A close above the handle's resistance on a substantial rise in volume.",
    ),
    stopAt: "below the handle's low",
    mark: 31,
    end: 31,
    dir: "up",
    lookalikes: ["rounding-bottom", "inverse-cup-and-handle"],
    confusers: ["rounding-bottom", "inverse-cup-and-handle", "high-tight-flag"],
    source: S.cup,
    build: { seed: 120, pivots: [[0, 760], [6, 1000], [9, 962], [12, 932], [15, 920], [18, 934], [21, 968], [24, 996], [26, 978], [28, 984], [30, 973], [31, 1014], [33, 1032]], vol: [[0, 420], [15, 200], [24, 320], [30, 200], [31, 640], [33, 480]], noise: 2 },
  },
  {
    id: "inverse-cup-and-handle",
    name: "Inverted Cup and Handle",
    group: "cup",
    sentiment: "bearish",
    type: "continuation",
    confirmation: "medium",
    short: "An upside-down bowl, a small bounce (the handle), then a close below the right rim.",
    recognise: [
      "A smooth, rounded turn shaped like an upside-down cup; the two rims bottom near the same price.",
      "A handle forms to the right: a bounce that stays below the cup's top and often retraces 30–60% of the cup's height.",
      "It confirms on a close below the right rim's low.",
    ],
    psychology: [
      "Buyers who bought near the left rim are trapped as price rolls over.",
      "The handle is a weak bounce that fails to reclaim the dome.",
      "The close below the rim sets off stop-loss selling.",
    ],
    psy: "A dome rolls over, a weak bounce fails, and buyers under water give up below the rim.",
    trade: down(
      "Above the handle's high.",
      "The handle's height subtracted from the right rim low (Bulkowski's measure rule); the cup's height is a more aggressive target.",
      "A close below the right rim's low.",
    ),
    stopAt: "above the handle's high",
    mark: 31,
    end: 31,
    dir: "down",
    lookalikes: ["cup-and-handle", "rounding-top"],
    confusers: ["cup-and-handle", "rounding-top", "bear-flag"],
    source: S.icup,
    build: { seed: 121, pivots: [[0, 1240], [6, 1000], [9, 1040], [12, 1070], [15, 1080], [18, 1066], [21, 1030], [24, 1004], [26, 1026], [28, 1020], [30, 1031], [31, 986], [33, 970]], vol: [[0, 420], [15, 220], [30, 220], [31, 560], [33, 440]], noise: 2 },
  },
  // ---------- broadening ----------
  {
    id: "broadening-top",
    name: "Broadening Top (Megaphone)",
    group: "broadening",
    sentiment: "neutral",
    type: "neutral",
    confirmation: "low",
    short: "Higher highs and lower lows after a rise: a megaphone of widening swings.",
    recognise: [
      "Price trends up into the pattern.",
      "Each swing high is higher and each swing low is lower; the trendlines diverge like a megaphone.",
      "At least five touches in total. The breakout can go either way and happens on a close beyond a trendline.",
    ],
    psychology: [
      "A volatile disagreement: bulls bid higher, bears sell harder.",
      "Neither side keeps control, so the swings widen.",
      "Price often pulls back into the pattern after a breakout.",
    ],
    psy: "A loud disagreement: each side pushes further than last time, and nobody keeps control.",
    trade: down(
      "The opposite end of the pattern: the last swing high for a short.",
      "The pattern's height projected from the breakout.",
      "A close beyond a trendline in either direction; this example breaks down.",
      "Trade the breakout direction only after it closes; expect pullbacks into the pattern.",
    ),
    stopAt: "above the last swing high",
    mark: 21,
    end: 21,
    dir: "down",
    lookalikes: ["broadening-bottom", "diamond-top"],
    confusers: ["broadening-bottom", "diamond-top", "descending-channel"],
    source: S.broadening,
    build: { seed: 122, pivots: [[0, 950], [4, 1000], [7, 980], [10, 1015], [13, 965], [16, 1030], [19, 950], [21, 928], [23, 920]], vol: [[0, 360], [23, 420]], noise: 2 },
  },
  {
    id: "broadening-bottom",
    name: "Broadening Bottom",
    group: "broadening",
    sentiment: "neutral",
    type: "neutral",
    confirmation: "low",
    short: "Higher highs and lower lows after a decline: a megaphone at a low.",
    recognise: [
      "Price trends down into the pattern.",
      "The upper trendline slopes up and the lower slopes down: higher peaks and lower valleys.",
      "At least five touches; price fills the space between the lines. It can break out either way.",
    ],
    psychology: [
      "Disagreement after a decline: some buyers see value, sellers keep pressing.",
      "The widening swings show neither side in control.",
      "A close beyond a trendline shows who finally won.",
    ],
    psy: "After a decline, buyers and sellers disagree loudly and the swings keep widening.",
    trade: up(
      "The opposite end of the pattern: the last swing low for a long.",
      "The pattern's height projected from the breakout.",
      "A close beyond a trendline in either direction; this example breaks up.",
      "Trade the breakout direction only after it closes; expect pullbacks into the pattern.",
    ),
    stopAt: "below the last swing low",
    mark: 21,
    end: 21,
    dir: "up",
    lookalikes: ["broadening-top", "diamond-bottom"],
    confusers: ["broadening-top", "diamond-bottom", "ascending-channel"],
    source: S.broadb,
    build: { seed: 123, pivots: [[0, 1100], [4, 1050], [7, 1070], [10, 1035], [13, 1085], [16, 1020], [19, 1100], [21, 1122], [23, 1130]], vol: [[0, 360], [23, 420]], noise: 2 },
  },
  // ---------- diamonds ----------
  {
    id: "diamond-top",
    name: "Diamond Top",
    group: "diamond",
    sentiment: "bearish",
    type: "reversal",
    confirmation: "medium",
    short: "After a rise, swings widen and then narrow: a broadening pattern followed by a triangle.",
    recognise: [
      "Price trends up into the pattern.",
      "First higher peaks and lower valleys (broadening), then lower peaks and higher valleys (a symmetrical triangle); the lines form a diamond, often tilted.",
      "Volume usually trends down. It can break either way; the bearish version closes below the lower right line.",
    ],
    psychology: [
      "Excitement and disagreement widen the swings at the top.",
      "Then both sides tire and the swings shrink.",
      "The break shows which side the exhaustion favoured.",
    ],
    psy: "Swings widen in excitement, then shrink as both sides tire; the break picks the winner.",
    trade: down(
      "Above the last peak inside the diamond.",
      "A share of the diamond's height (highest peak to lowest valley) from the breakout.",
      "A close below the lower right trendline.",
    ),
    stopAt: "above the diamond's last peak",
    mark: 24,
    end: 24,
    dir: "down",
    lookalikes: ["diamond-bottom", "broadening-top"],
    confusers: ["diamond-bottom", "broadening-top", "rounding-top"],
    source: S.diamond,
    build: { seed: 124, pivots: [[0, 900], [4, 1000], [6, 972], [9, 1030], [12, 950], [15, 1015], [18, 966], [20, 1000], [22, 978], [24, 942], [26, 930]], vol: [[0, 440], [22, 240], [24, 380], [26, 360]], noise: 2 },
  },
  {
    id: "diamond-bottom",
    name: "Diamond Bottom",
    group: "diamond",
    sentiment: "bullish",
    type: "reversal",
    confirmation: "medium",
    short: "After a decline, swings widen and then narrow, then break higher.",
    recognise: [
      "Price trends down into the pattern.",
      "Swings first widen, then narrow, outlining a diamond.",
      "The bullish version closes above the upper right line.",
    ],
    psychology: [
      "Panic and bargain hunting widen the swings at the low.",
      "Then the swings shrink as selling dries up.",
      "Buyers win when price closes out of the top.",
    ],
    psy: "Panic and bargain hunting widen the swings at a low, then selling dries up.",
    trade: up(
      "Below the last valley inside the diamond.",
      "A share of the diamond's height from the breakout.",
      "A close above the upper right trendline.",
    ),
    stopAt: "below the diamond's last valley",
    mark: 24,
    end: 24,
    dir: "up",
    lookalikes: ["diamond-top", "broadening-bottom"],
    confusers: ["diamond-top", "broadening-bottom", "rounding-bottom"],
    source: S.diamond,
    build: { seed: 125, pivots: [[0, 1100], [4, 1000], [6, 1028], [9, 970], [12, 1050], [15, 985], [18, 1034], [20, 1000], [22, 1022], [24, 1058], [26, 1070]], vol: [[0, 440], [22, 240], [24, 380], [26, 360]], noise: 2 },
  },
  // ---------- spike ----------
  {
    id: "v-bottom",
    name: "V Bottom (Spike Reversal)",
    group: "spike",
    sentiment: "bullish",
    type: "reversal",
    confirmation: "low",
    short: "A sharp decline that turns into a sharp rally with almost no pause at the low.",
    recognise: [
      "An overextended, often accelerating decline.",
      "A sudden turn with little or no base; the low is a single spike. Selling-climax volume often marks it.",
      "Confirmation is a close above the last minor high of the decline.",
    ],
    psychology: [
      "Panic selling exhausts the sellers at once.",
      "Short covering plus bargain hunting reverse price fast.",
      "V turns are hard to forecast: there is no base to plan around.",
    ],
    psy: "Panic selling exhausts itself in one spike, and short covering turns price fast.",
    trade: up(
      "Below the spike low.",
      "The start of the decline, then the next resistance.",
      "A close above the last minor high of the decline.",
    ),
    stopAt: "below the spike low",
    mark: 10,
    end: 14,
    dir: "up",
    lookalikes: ["rounding-bottom", "island-bottom"],
    confusers: ["rounding-bottom", "cup-and-handle", "island-bottom"],
    source: S.spike,
    build: { seed: 126, pivots: [[0, 1200], [5, 1110], [6, 1125], [10, 1000], [14, 1130], [18, 1176]], vol: [[0, 320], [9, 480], [18, 380]], spikes: { 10: 2.8 }, lows: { 10: 988 }, noise: 3 },
  },
  // ---------- volume patterns ----------
  {
    id: "selling-climax",
    name: "Selling Climax",
    group: "volume",
    sentiment: "bullish",
    type: "reversal",
    confirmation: "low",
    short: "At the end of a decline, a wide bar on extreme volume that closes well off its low.",
    recognise: [
      "A long decline.",
      "One wide-range bar on extreme volume, several times the average, with a long lower wick: it closes well off its low.",
      "Confirmation is a later close above the climax bar's high.",
    ],
    psychology: [
      "Capitulation: the last holders dump at any price.",
      "Large buyers absorb that supply, so the bar closes off its low.",
      "With the forced sellers gone, there is less supply left.",
    ],
    psy: "Capitulation: the last forced sellers dump while large buyers absorb the supply.",
    volumeRead: "The volume spike marks capitulation: a huge burst of selling absorbed by buyers, so the bar closes off its low.",
    trade: up(
      "Below the climax bar's low.",
      "The last swing high of the decline, then the next resistance.",
      "A close above the climax bar's high; a later retest of the low on lighter volume is stronger evidence.",
    ),
    stopAt: "below the climax low",
    mark: 13,
    end: 16,
    dir: "up",
    lookalikes: ["v-bottom", "volume-dry-up"],
    confusers: ["volume-dry-up", "breakout-volume", "volume-divergence"],
    source: S.spike,
    build: { seed: 127, pivots: [[0, 1200], [12, 1022], [13, 1004], [16, 1044], [18, 1060]], vol: [[0, 320], [12, 380], [14, 400], [18, 320]], spikes: { 13: 4 }, lows: { 13: 968 }, noise: 3 },
  },
  {
    id: "volume-dry-up",
    name: "Volume Dry-Up",
    group: "volume",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "low",
    short: "In an uptrend, a pullback on shrinking volume, then the advance resumes on rising volume.",
    recognise: [
      "An advance on solid volume.",
      "A pullback on volume that shrinks well below the advance's average.",
      "The trend resumes with a close above the pullback's high on volume expanding again.",
    ],
    psychology: [
      "Holders are not selling much into the pullback.",
      "Low volume means little conviction behind the dip.",
      "When buying returns, volume expands with price.",
    ],
    psy: "The dip happens on light volume: holders are not selling much, so the trend is resting.",
    volumeRead: "Volume shrinks on the pullback and expands on the advance: the dip had little selling behind it.",
    trade: up(
      "Below the pullback's low.",
      "The prior high, then the next resistance.",
      "A close above the pullback's high on rising volume.",
    ),
    stopAt: "below the pullback low",
    mark: 14,
    end: 16,
    dir: "up",
    lookalikes: ["bear-flag", "breakout-volume"],
    confusers: ["selling-climax", "breakout-volume", "volume-divergence"],
    source: S.flags,
    build: { seed: 128, pivots: [[0, 1000], [8, 1100], [11, 1082], [14, 1070], [16, 1110], [18, 1128]], vol: [[0, 420], [8, 460], [9, 220], [14, 150], [16, 520], [18, 460]], noise: 2 },
  },
  {
    id: "breakout-volume",
    name: "Breakout on Volume",
    group: "volume",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    short: "A close through resistance on about twice the recent average volume.",
    recognise: [
      "A clear resistance level that held several times.",
      "Price closes above it.",
      "Volume on the breakout bar is well above the recent average and backs the break.",
    ],
    psychology: [
      "Sellers at the level have been absorbed.",
      "Heavy volume shows many participants agree with the new price.",
      "A breakout on thin volume has less behind it and fails more easily.",
    ],
    psy: "Many participants agree with the new price: the sellers at the level have been absorbed.",
    volumeRead: "Breakout-bar volume is about twice the recent average: participation backs the break.",
    trade: up(
      "Back below the broken resistance (now support).",
      "The range height added to the breakout.",
      "A close above resistance on clearly above-average volume.",
    ),
    stopAt: "back below the broken resistance",
    mark: 17,
    end: 17,
    dir: "up",
    lookalikes: ["ascending-triangle", "bullish-rectangle"],
    confusers: ["selling-climax", "volume-dry-up", "volume-divergence"],
    source: S.rectangle,
    build: { seed: 129, pivots: [[0, 1000], [3, 1050], [6, 1010], [9, 1050], [12, 1015], [15, 1048], [16, 1044], [17, 1080], [19, 1094]], vol: [[0, 300], [16, 300], [19, 380]], spikes: { 17: 2.6 }, noise: 2 },
  },
  {
    id: "volume-divergence",
    name: "Volume Divergence",
    group: "volume",
    sentiment: "bearish",
    type: "reversal",
    confirmation: "low",
    short: "Price makes higher highs while volume on each push falls: the rally is losing participation.",
    recognise: [
      "An uptrend makes new highs.",
      "Volume on each new high is lower than on the one before.",
      "It is a warning, not a signal. Confirmation is a close below the last swing low.",
    ],
    psychology: [
      "Fewer participants are willing to pay the higher prices.",
      "The trend continues on momentum, not fresh demand.",
      "When the remaining buyers stop, there is little support.",
    ],
    psy: "Fewer buyers are willing to pay each new high: the rally runs on momentum, not fresh demand.",
    volumeRead: "Volume falls on each new high: fewer buyers are paying up, so the rally is thinning out.",
    trade: down(
      "Above the last high.",
      "The prior swing low, then the next support.",
      "A close below the last swing low.",
    ),
    stopAt: "above the last high",
    mark: 19,
    end: 22,
    dir: "down",
    lookalikes: ["three-pushes", "ascending-channel"],
    confusers: ["selling-climax", "volume-dry-up", "breakout-volume"],
    source: S.rectangle,
    build: { seed: 130, pivots: [[0, 1000], [5, 1060], [7, 1042], [12, 1090], [14, 1072], [19, 1106], [21, 1085], [22, 1060], [24, 1044]], vol: [[0, 520], [5, 560], [7, 380], [12, 420], [14, 300], [19, 300], [21, 260], [22, 380], [24, 360]], noise: 2 },
  },
  // ---------- price-action term ----------
  {
    id: "three-pushes",
    name: "Three Pushes",
    group: "push",
    sentiment: "bearish",
    type: "reversal",
    confirmation: "low",
    lessStandard: true,
    short: "Three pushes to new highs, each gaining less, then a break of the last pullback low.",
    recognise: [
      "A price-action term, less standard than the classic chart patterns: three consecutive pushes to higher highs with a pullback between each.",
      "Each push gains less than the one before; the shape is often a wedge.",
      "The trigger is a reversal bar after the third push and a close below it (Al Brooks's three-push reversal).",
    ],
    psychology: [
      "Each push attracts fewer new buyers.",
      "The shrinking gains show the trend running out of energy.",
      "The break of the last pullback low shows sellers have taken over.",
    ],
    psy: "Each push higher gains less: fewer new buyers on every attempt.",
    trade: down(
      "Above the third push's high.",
      "The start of the pattern, then a measured move of the pattern's height.",
      "After the third push, a reversal bar and then a close below that bar; a close below the last pullback low adds weight.",
    ),
    stopAt: "above the third push's high",
    mark: 16,
    end: 20,
    dir: "down",
    lookalikes: ["volume-divergence", "broadening-top"],
    confusers: ["volume-divergence", "rounding-top", "diamond-top"],
    source: "https://doi.org/10.1002/9781119202622.ch5",
    build: { seed: 131, pivots: [[0, 1000], [4, 1050], [6, 1035], [10, 1075], [12, 1062], [16, 1090], [18, 1078], [19, 1070], [20, 1054], [22, 1040]], vol: [[0, 360], [22, 360]], noise: 2 },
  },
  // ---------- complex head-and-shoulders (Bulkowski) ----------
  {
    id: "complex-head-shoulders",
    name: "Complex Head and Shoulders Top",
    group: "hs",
    sentiment: "bearish",
    type: "reversal",
    confirmation: "high",
    short: "A head-and-shoulders top with extra shoulders (or a double head), confirmed by a close below the neckline.",
    recognise: [
      "After an advance, a head-and-shoulders top with more than one shoulder on each side, or more than one head (rarely both). The shoulders peak near the same price and sit about the same distance from the head.",
      "The neckline joins the lowest troughs (armpits) on either side of the head and is usually close to horizontal. Volume is usually heavier on the left side.",
      "It confirms only on a close below the neckline; if the neckline slopes down, use a close below the right armpit instead.",
    ],
    psychology: [
      "The head is the last push of the uptrend; each extra shoulder is another rally that fails below it.",
      "Buyers keep defending the same floor while every bounce runs out of demand at a lower high than the head.",
      "When the floor finally breaks, the buyers who defended it are trapped and their selling feeds the decline.",
    ],
    psy: "Rally after rally stalls below the head while buyers defend one floor, until the floor gives way.",
    trade: down(
      "Above the last right shoulder's high.",
      "The height from the head down to the neckline, projected down from the breakout; treat it as a rough guide, since many breakdowns fall short.",
      "A close below the neckline (or below the right armpit when the neckline slopes down).",
    ),
    stopAt: "above the last right shoulder",
    mark: 25,
    end: 27,
    dir: "down",
    lookalikes: ["diamond-top", "rounding-top"],
    confusers: ["diamond-top", "broadening-top", "three-pushes"],
    source: S.chst,
    build: { seed: 132, pivots: [[0, 1000], [5, 1080], [7, 1052], [9, 1084], [11, 1048], [15, 1130], [19, 1050], [21, 1083], [23, 1054], [25, 1080], [27, 1036], [29, 1020]], vol: [[0, 420], [15, 400], [25, 260], [27, 380], [29, 340]], noise: 2 },
  },
  {
    id: "complex-inverse-head-shoulders",
    name: "Complex Head and Shoulders Bottom",
    group: "hs",
    sentiment: "bullish",
    type: "reversal",
    confirmation: "high",
    short: "An inverse head-and-shoulders with extra shoulders or a double head, confirmed by a close above the neckline.",
    recognise: [
      "After a decline, an inverse head-and-shoulders with more than one head or more than one shoulder on a side (rarely both). Twin heads bottom near the same price, and the shoulders bottom near each other.",
      "The neckline joins the highest peaks (armpits) on either side of the head(s). Volume is usually heavier on the left side; rising volume into the breakout helps.",
      "It confirms only on a close above the neckline; if the neckline slopes up, use a close above the right armpit instead.",
    ],
    psychology: [
      "Sellers push to a low, then try again and fail to go meaningfully lower: the second head is a test that holds.",
      "The shoulders are shallower dips, so sellers are losing force on each attempt.",
      "A close above the neckline shows buyers taking out the supply that capped every bounce.",
    ],
    psy: "Sellers test the low twice and fail, each dip is shallower, and buyers finally clear the ceiling.",
    trade: up(
      "Below the right shoulder's low.",
      "The depth from the lowest head up to the neckline, projected up from the breakout; a rough guide, not a promise.",
      "A close above the neckline (or above the right armpit when the neckline slopes up).",
    ),
    stopAt: "below the right shoulder",
    mark: 21,
    end: 24,
    dir: "up",
    lookalikes: ["diamond-bottom", "rounding-bottom"],
    confusers: ["diamond-bottom", "broadening-bottom", "v-bottom"],
    source: S.chsb,
    build: { seed: 133, pivots: [[0, 1150], [5, 1070], [8, 1104], [11, 1030], [13, 1062], [15, 1029], [18, 1103], [21, 1071], [23, 1098], [24, 1122], [26, 1136]], vol: [[0, 420], [11, 440], [15, 380], [21, 260], [23, 280], [26, 360]], spikes: { 24: 1.9 }, noise: 2 },
  },
  // ---------- low tight flag (momentum-trader setup) ----------
  {
    id: "low-tight-flag",
    name: "Low Tight Flag",
    group: "flag",
    sentiment: "bullish",
    type: "continuation",
    confirmation: "medium",
    lessStandard: true,
    short: "A strong 60–90% run that falls short of doubling, then a tight, shallow pause near the highs.",
    recognise: [
      "A momentum traders' setup, less standard than the classic flags: the pole rises about 60% to 90% in roughly eight weeks, short of the high and tight flag's doubling.",
      "The pause stays near the highs and is no more than about 25% deep (15% or less is preferred). It often needs more than three to five weeks, and volume goes quiet.",
      "It confirms only on a close above the pattern's highest high (the pivot), ideally on rising volume.",
    ],
    psychology: [
      "A strong run shows real demand, even though it has not doubled.",
      "Holders refuse to give much back: the pullback stays shallow and volume dries up as sellers run out.",
      "A close above the pivot shows buyers are ready to push the trend on.",
    ],
    psy: "After a 60–90% run, holders give back little: the pause is shallow and quiet.",
    trade: up(
      "Below the flag's low.",
      "The next resistance; momentum leaders can run further, so trail the stop rather than fix a target.",
      "A close above the highest high in the pattern (the pivot), ideally on above-average volume.",
      "A buy stop above the pivot, or a close above it.",
    ),
    stopAt: "below the flag's low",
    mark: 25,
    end: 25,
    dir: "up",
    lookalikes: ["high-tight-flag", "bull-pennant"],
    confusers: ["high-tight-flag", "bull-pennant", "bearish-rectangle"],
    source: S.ltf,
    build: { seed: 134, pivots: [[0, 1000], [12, 1700], [15, 1590], [17, 1660], [20, 1560], [22, 1650], [24, 1610], [25, 1760], [27, 1800]], vol: [[0, 320], [12, 600], [13, 340], [24, 200], [25, 560], [27, 420]], noise: 6 },
  },
];

const BY_ID: Record<string, BookPattern> = Object.fromEntries(CHART_BOOK.map((p) => [p.id, p]));
export const getBookPattern = (id: string): BookPattern | undefined => BY_ID[id];
export const CHART_BOOK_IDS = CHART_BOOK.map((p) => p.id);

// ---------- charts + drill specs ----------
export const CHART_BOOK_OHLC: Record<string, OHLC[]> = Object.fromEntries(CHART_BOOK.map((p) => [p.id, buildBars(p.build)]));

const directional = CHART_BOOK.filter((p) => p.sentiment !== "neutral");

export const CHART_BOOK_DRILL_SPECS: ReadonlyArray<{ key: string; end: number; dir: "up" | "down" }> = directional.map((p) => ({
  key: p.id,
  end: p.end,
  dir: p.dir,
}));

export const CHART_BOOK_DRILL_INFO: Record<string, { name: string; kind: string; why: string; stop: string; term: string }> = Object.fromEntries(
  directional.map((p) => [p.id, { name: p.name, kind: `${p.sentiment} ${p.type}`, why: p.psy, stop: p.stopAt, term: p.id }]),
);

// ---------- Archive + glossary ----------
const typeLabel = (p: BookPattern) => (p.type === "neutral" ? "breakout either way" : `${p.sentiment} ${p.type}`);

export const CHART_BOOK_DEFS: PatternDef[] = CHART_BOOK.map((p) => ({
  id: p.id,
  name: p.name,
  type: p.type,
  sentiment: p.sentiment,
  confirmation: p.confirmation,
  description: `${p.recognise.join(" ")} ${p.psychology[0]}`,
}));

export const CHART_BOOK_TERMS: LiteracyTerm[] = [
  ...CHART_BOOK.map((p) => ({
    id: p.id,
    name: p.name,
    category: "process" as const,
    summary: p.short,
    detail: `${p.recognise.join(" ")} Psychology: ${p.psy} Confirmation: ${p.trade.confirmation} Stop: ${p.trade.stop} Target: ${p.trade.target} Usually a ${typeLabel(p)}.`,
  })),
  {
    id: "chart-patterns",
    name: "Chart, Gap & Volume Patterns",
    category: "process",
    summary: "Multi-bar shapes (gaps, flags, triangles, rectangles, cups, diamonds) and what volume adds.",
    detail:
      "Chart patterns span many bars. Each has a boundary (a trendline, a range edge, a gap) and completes only on a close beyond it. Volume helps: breakouts on above-average volume have more behind them, and pullbacks on shrinking volume are rests. Measured-move targets (a pattern's height projected from the breakout) are rough guides, not promises.",
  },
];

// ---------- Learn questions ----------
type OptId = "A" | "B" | "C" | "D";
const IDS: OptId[] = ["A", "B", "C", "D"];
function place<T>(correct: T, others: T[], pos: number): T[] {
  const out = [...others];
  out.splice(pos % (others.length + 1), 0, correct);
  return out;
}

const CONFIRM_WRONG = [
  "The first touch of the pattern's boundary, before any close beyond it.",
  "The shape alone: once it is visible, act right away.",
  "A brief poke through the line that closes back inside the pattern.",
];
const planWrong = (p: BookPattern) => [
  "Stop: none; a pattern this clear does not need one. Target: hold until it feels high enough.",
  "Stop: a fixed 1% from entry wherever the pattern is. Target: the same 1%.",
  p.dir === "up"
    ? "Stop: above the breakout level. Target: below the pattern's low."
    : "Stop: below the breakdown level. Target: above the pattern's high.",
];

function bookQuestions(p: BookPattern, n: number): QuizQuestion[] {
  const id = `CP-${p.id}`;
  const base = { patternKey: p.id, highlightIndex: p.mark, glossaryTermId: p.id };
  const names = place(p.id, [...p.confusers], n);
  const psy = place(p.id, [...p.confusers], n + 1);
  const conf = place(p.trade.confirmation, CONFIRM_WRONG, n + 2);
  const planText = `Stop: ${p.trade.stop} Target: ${p.trade.target}`;
  const plan = place(planText, planWrong(p), n + 3);
  const qs: QuizQuestion[] = [
    {
      id: `${id}-NAME`,
      prompt: "SIMULATED chart. Read the shape up to the marked bar. Which pattern is it?",
      correctAnswer: IDS[names.indexOf(p.id)],
      options: names.map((k, i) => ({ id: IDS[i], label: BY_ID[k].name, description: BY_ID[k].short })) as QuizOption[],
      explanation: `${p.name}. ${p.recognise.join(" ")}`,
      ...base,
    },
    {
      id: `${id}-PSY`,
      prompt: `What is the crowd psychology behind a ${p.name}?`,
      correctAnswer: IDS[psy.indexOf(p.id)],
      options: psy.map((k, i) => ({ id: IDS[i], label: BY_ID[k].psy, description: "" })) as QuizOption[],
      explanation: p.psychology.join(" "),
      ...base,
    },
    {
      id: `${id}-CONF`,
      prompt: `What confirms a ${p.name}?`,
      correctAnswer: IDS[conf.indexOf(p.trade.confirmation)],
      options: conf.map((t, i) => ({ id: IDS[i], label: t, description: "" })) as QuizOption[],
      explanation: `${p.trade.confirmation} Until then it is only a possible ${p.name}; many shapes never complete.`,
      ...base,
    },
    {
      id: `${id}-PLAN`,
      prompt: `Where do the stop and the first target go for a ${p.name}?`,
      correctAnswer: IDS[plan.indexOf(planText)],
      options: plan.map((t, i) => ({ id: IDS[i], label: t, description: "" })) as QuizOption[],
      explanation: `${planText} Entry: ${p.trade.entry} Size the trade so the stop is a loss you can take.`,
      ...base,
    },
  ];
  if (p.group === "volume") {
    const others = CHART_BOOK.filter((o) => o.group === "volume" && o.id !== p.id);
    const rows = place(p, others, n);
    const look = BY_ID[p.lookalikes[0]];
    qs.push({
      id: `${id}-LOOK`,
      prompt: `SIMULATED chart with volume. On price alone this could pass for a ${look.name}. What does the volume pane add?`,
      correctAnswer: IDS[rows.indexOf(p)],
      options: rows.map((o, i) => ({ id: IDS[i], label: o.volumeRead ?? "", description: "" })) as QuizOption[],
      explanation: `${p.volumeRead} That is the ${p.name}.`,
      ...base,
    });
  } else {
    const charts = place(p.id, [...p.lookalikes], n);
    qs.push({
      id: `${id}-PICK`,
      prompt: `Which SIMULATED chart shows a ${p.name}?`,
      correctAnswer: IDS[charts.indexOf(p.id)],
      options: charts.map((k, i) => ({
        id: IDS[i],
        label: String(i + 1),
        description: "Select this chart",
        chartKey: k,
        chartHighlightIndex: BY_ID[k].mark,
      })),
      optionsAreCharts: true,
      explanation: `Chart ${charts.indexOf(p.id) + 1}. ${p.short} The others show a ${BY_ID[p.lookalikes[0]].name} and a ${BY_ID[p.lookalikes[1]].name}.`,
      ...base,
    });
  }
  return qs;
}

export const CHART_BOOK_QUESTIONS: QuizQuestion[] = CHART_BOOK.flatMap((p, i) => bookQuestions(p, i));
