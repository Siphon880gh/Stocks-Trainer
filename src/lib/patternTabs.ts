/**
 * Three-tab pattern detail (Recognise / Psychology / Trade) for every pattern in the registry,
 * plus the "Core Japanese patterns" list (7 bullish, 7 bearish).
 *
 * Core entries are written out bar by bar. Every other pattern gets a family guide built from its
 * registry description, sentiment and type, labelled as a general guide.
 * Readings follow the standard references (Nison's candlestick texts, Bulkowski's pattern encyclopedia,
 * StockCharts ChartSchool). Illustrations are SIMULATED.
 */
import { confirmationBar, PATTERN_OHLC, type OHLC } from "./ohlcData";
import { getPattern, type PatternDef } from "./patterns";
import { getBookPattern } from "./chartPatternBook";
import { REVERSAL_TABS } from "./reversalCharts";

export const NOT_A_GUARANTEE =
  "Not a guarantee: patterns shift the odds a little at best, and many fail. Size the trade so the stop is a loss you can take.";

export interface TradePlan {
  confirmation: string;
  entry: string;
  stop: string;
  target: string;
}

export interface PatternTabs {
  recognise: string[];
  psychology: string[];
  trade: TradePlan;
  /** Core patterns are written for the pattern; the rest use the family guide. */
  general: boolean;
}

export interface CorePattern {
  id: string;
  side: "bullish" | "bearish";
  /** First and last bar of the pattern inside its illustration. */
  bars: [number, number];
  tabs: Omit<PatternTabs, "general">;
  /** PATTERN_OHLC key of the illustration (defaults to the pattern id). */
  chartKey: string;
}

const C = (
  id: string,
  side: CorePattern["side"],
  bars: [number, number],
  recognise: string[],
  psychology: string[],
  trade: TradePlan,
): CorePattern => ({ id, side, bars, tabs: { recognise, psychology, trade }, chartKey: CHART_KEY[id] ?? id });
/** The shared hammer chart has no real prior decline, so the lesson uses its own. */
const CHART_KEY: Record<string, string> = { hammer: "core-hammer" };

export const CORE_PATTERNS: CorePattern[] = [
  // ---------------- Bullish ----------------
  C("dragonfly-doji", "bullish", [3, 3],
    [
      "Comes after a decline; at the top of a range or in a rally it means little.",
      "Open, high and close are at (or very near) the same price, at the top of the candle.",
      "A long lower wick and no real upper wick: a T shape.",
      "It is a doji, so on its own it shows indecision with rejection of lower prices, not a finished reversal.",
    ],
    [
      "The session opens and sellers drive price well lower, extending the decline.",
      "Buyers step in at the lows and push price all the way back to the open by the close.",
      "Net result: sellers controlled the middle of the session but could not hold it. The decline has met real demand.",
      "Nobody has proved buyers are in control yet; that takes the next candle.",
    ],
    {
      confirmation: "Wait for the next candle to close green and above the doji's high.",
      entry: "Long on or after that confirming close, not on the doji itself.",
      stop: "Below the doji's low (the bottom of the long wick). A close below it means the rejection failed.",
      target: "The last swing high or nearest resistance; aim for at least twice the distance to the stop.",
    }),
  C("hammer", "bullish", [3, 3],
    [
      "Appears after a decline.",
      "A small body at the top of the range (green or red; green is slightly stronger).",
      "A lower wick at least twice the length of the body.",
      "Little or no upper wick.",
    ],
    [
      "Sellers continue the decline and push price sharply lower during the session.",
      "Buyers absorb the selling and drive price back up to close near the high.",
      "The long lower wick is the record of that rejection: lower prices were refused.",
      "The same shape after a rally is a hanging man, a warning rather than a bullish sign.",
    ],
    {
      confirmation: "The next candle closes above the hammer's high (or at least above its body).",
      entry: "Long on the confirming close.",
      stop: "Just below the hammer's low.",
      target: "Prior resistance or swing high; a long wick makes the stop wide, so check the reward still pays at least 2:1.",
    }),
  C("bullish-engulfing", "bullish", [1, 2],
    [
      "Appears after a decline.",
      "Candle 1 is red. Candle 2 is green, and its body covers candle 1's whole body (wicks need not be covered).",
      "The bigger candle 2 is relative to candle 1, the stronger the read. An equal edge on one side is accepted by most screens.",
    ],
    [
      "Candle 1: sellers are still in charge and close the session lower.",
      "Candle 2: it opens at or below candle 1's close, so sellers appear to have control at first.",
      "Buyers then take over and close above candle 1's open, erasing the whole of the prior session's selling.",
      "Control has shifted within two sessions, but one strong candle still needs follow-through.",
    ],
    {
      confirmation: "A following candle that closes above candle 2's close, or price holding above candle 2's midpoint.",
      entry: "Long on the confirming close (aggressive traders enter at candle 2's close).",
      stop: "Below the low of the two-candle pattern.",
      target: "The next resistance or swing high; exit if price closes back below candle 2's open.",
    }),
  C("piercing-line", "bullish", [2, 3],
    [
      "Appears after a decline.",
      "Candle 1: a long red body.",
      "Candle 2: opens below candle 1's low (or close on markets that rarely gap), then closes green above the midpoint of candle 1's body, but below its open.",
      "Closing above candle 1's open would make it an engulfing; closing below the midpoint is a weaker in-neck or thrusting line.",
    ],
    [
      "Candle 1: sellers dominate with a long red session.",
      "Candle 2 opens lower still: sellers look fully in control.",
      "Buyers then drive price back through more than half of the prior session's losses.",
      "The deeper the close into candle 1, the more convincing the shift; it is still not a full reversal of candle 1.",
    ],
    {
      confirmation: "The next candle closes above candle 2's high (and ideally above candle 1's open).",
      entry: "Long on that confirming close.",
      stop: "Below candle 2's low, the pattern's low.",
      target: "The prior swing high or resistance; trail the stop under new higher lows.",
    }),
  C("tweezer-bottom", "bullish", [3, 4],
    [
      "Appears after a decline.",
      "Two (or more) neighbouring candles with matching or nearly matching lows.",
      "Usually the first is red and the second green. It is a minor signal on its own; it is stronger when one candle is also a hammer or the pair forms an engulfing or piercing line.",
    ],
    [
      "Candle 1: sellers push to a new low.",
      "Candle 2: sellers try the same level again and fail to break it.",
      "Two rejections at one price show demand there. The second candle closing higher shows buyers starting to respond.",
    ],
    {
      confirmation: "A close above the high of the tweezer pair.",
      entry: "Long on the confirming close.",
      stop: "Just below the shared low. A break of it cancels the read.",
      target: "Nearest resistance or the last swing high.",
    }),
  C("three-white-soldiers", "bullish", [1, 3],
    [
      "Appears after a decline or a base.",
      "Three long green candles in a row, each closing higher than the one before.",
      "Each opens within (or at the edge of) the prior candle's body.",
      "Each closes at or near its high: short upper wicks.",
      "Shrinking bodies or long upper wicks on candles 2–3 are a warning (the pattern is stalling).",
    ],
    [
      "Candle 1: buyers win a full session after the decline.",
      "Candle 2: sellers get no gap lower at the open; buyers push to a higher close again.",
      "Candle 3: a third session of steady buying with a close near the high. Buyers have controlled three sessions running.",
      "After a long rally the same pattern can mean the move is stretched rather than starting.",
    ],
    {
      confirmation: "Many traders wait for a fourth candle to close above candle 3's high.",
      entry: "Long on that close, or on a pullback that holds candle 2's body.",
      stop: "Below candle 1's low. A tighter alternative is below candle 2's low; a close below candle 1's open cancels the pattern.",
      target: "The next major resistance; the move is already extended, so the stop distance is large. Size down.",
    }),
  C("morning-star", "bullish", [1, 3],
    [
      "Appears after a decline.",
      "Candle 1: a long red body.",
      "Candle 2: a small body (a star; a doji makes a morning doji star) at the low. Ideally its body gaps below candle 1's body; on stocks that gap is often missing.",
      "Candle 3: a green body that closes well into candle 1's body, at least past its midpoint.",
    ],
    [
      "Candle 1: sellers dominate.",
      "Candle 2: the selling stalls. A small body means neither side won the session: indecision at the low.",
      "Candle 3: buyers take control and recover more than half of candle 1's decline.",
      "Three sessions tell the full story: selling, a pause, then buying.",
    ],
    {
      confirmation: "Candle 3 is the built-in confirmation; conservative traders also want a close above candle 3's high.",
      entry: "Long on candle 3's close or on the next confirming close.",
      stop: "Below the star's low, the lowest point of the pattern.",
      target: "Prior resistance or the top of candle 1; exit if price closes back below the star.",
    }),
  // ---------------- Bearish ----------------
  C("gravestone-doji", "bearish", [3, 3],
    [
      "Comes after a rally; in a decline it means little.",
      "Open, low and close are at (or very near) the same price, at the bottom of the candle.",
      "A long upper wick and no real lower wick: an upside-down T.",
      "It is a doji: indecision with rejection of higher prices, not a finished top.",
    ],
    [
      "The session opens and buyers drive price well higher, extending the rally.",
      "Sellers meet them and push price all the way back down to the open by the close.",
      "Buyers controlled the middle of the session but could not keep it. The rally has met real supply.",
      "Sellers still have to prove control on the next candle.",
    ],
    {
      confirmation: "The next candle closes red and below the doji's low.",
      entry: "Exit longs or go short on that confirming close, not on the doji.",
      stop: "Above the doji's high (the top of the long wick).",
      target: "The last swing low or nearest support; at least twice the stop distance.",
    }),
  C("shooting-star", "bearish", [2, 2],
    [
      "Appears after a rally.",
      "A small body at the bottom of the range.",
      "An upper wick at least twice the length of the body.",
      "Little or no lower wick. Ideally the body gaps above the prior body.",
      "The same shape after a decline is an inverted hammer.",
    ],
    [
      "Buyers push price sharply higher during the session.",
      "Sellers reject those prices and drive it back to close near the low.",
      "The long upper wick records the rejection: higher prices were refused.",
    ],
    {
      confirmation: "The next candle closes below the star's low (or at least below its body).",
      entry: "Exit longs or short on the confirming close.",
      stop: "Just above the star's high.",
      target: "Nearest support or swing low; the wick makes the stop wide, so check the reward.",
    }),
  C("bearish-engulfing", "bearish", [1, 2],
    [
      "Appears after a rally.",
      "Candle 1 is green. Candle 2 is red and its body covers candle 1's whole body (wicks need not be covered).",
      "A larger candle 2 is a stronger read; an equal edge on one side is accepted by most screens.",
    ],
    [
      "Candle 1: buyers still in charge with a higher close.",
      "Candle 2: opens at or above that close, so buyers appear in control at first.",
      "Sellers then take over and close below candle 1's open, erasing the whole prior session.",
      "Control has flipped, but it needs a follow-through close.",
    ],
    {
      confirmation: "A following candle that closes below candle 2's close.",
      entry: "Exit longs or short on that close.",
      stop: "Above the high of the two-candle pattern.",
      target: "Next support or swing low; exit if price closes back above candle 2's open.",
    }),
  C("dark-cloud-cover", "bearish", [2, 3],
    [
      "Appears after a rally.",
      "Candle 1: a long green body.",
      "Candle 2: opens above candle 1's high (or close), then closes red below the midpoint of candle 1's body, but above its open.",
      "Closing below candle 1's open would make it a bearish engulfing.",
    ],
    [
      "Candle 1: buyers dominate.",
      "Candle 2 opens higher still: buyers look fully in control.",
      "Sellers drive price back through more than half of the prior session's gains.",
      "The deeper the close into candle 1, the stronger the warning.",
    ],
    {
      confirmation: "The next candle closes below candle 2's low.",
      entry: "Exit longs or short on that close.",
      stop: "Above candle 2's high, the pattern's high.",
      target: "Prior swing low or support.",
    }),
  C("tweezer-top", "bearish", [3, 4],
    [
      "Appears after a rally.",
      "Two (or more) neighbouring candles with matching or nearly matching highs.",
      "Usually green then red. A minor signal alone; stronger when combined with a shooting star, engulfing or dark cloud cover.",
    ],
    [
      "Candle 1: buyers push to a new high.",
      "Candle 2: buyers try that price again and fail.",
      "Two rejections at one level show supply there; a lower close on candle 2 shows sellers responding.",
    ],
    {
      confirmation: "A close below the low of the tweezer pair.",
      entry: "Exit longs or short on that close.",
      stop: "Just above the shared high.",
      target: "Nearest support or last swing low.",
    }),
  C("three-black-crows", "bearish", [1, 3],
    [
      "Appears after a rally or near a top.",
      "Three long red candles in a row, each closing lower.",
      "Each opens within (or at the edge of) the prior candle's body.",
      "Each closes at or near its low: short lower wicks.",
    ],
    [
      "Candle 1: sellers win a full session after the rally.",
      "Candle 2: no gap up for buyers; sellers push to a lower close again.",
      "Candle 3: a third session of steady selling. Sellers have controlled three sessions running.",
      "After a long decline the same pattern can mean the move is stretched.",
    ],
    {
      confirmation: "A fourth candle closing below candle 3's low.",
      entry: "Exit longs or short on that close, or on a bounce that fails inside candle 2's body.",
      stop: "Above candle 1's high; a close above candle 1's open cancels the pattern.",
      target: "Next major support. The move is already extended, so size down.",
    }),
  C("evening-star", "bearish", [1, 3],
    [
      "Appears after a rally.",
      "Candle 1: a long green body.",
      "Candle 2: a small body (star; a doji makes an evening doji star) at the high, ideally gapping above candle 1's body.",
      "Candle 3: a red body that closes well into candle 1's body, at least past its midpoint.",
    ],
    [
      "Candle 1: buyers dominate.",
      "Candle 2: the buying stalls; neither side wins the session.",
      "Candle 3: sellers take control and erase more than half of candle 1's gain.",
    ],
    {
      confirmation: "Candle 3 is the built-in confirmation; conservative traders also want a close below candle 3's low.",
      entry: "Exit longs or short on candle 3's close or the next confirming close.",
      stop: "Above the star's high.",
      target: "Prior support or the bottom of candle 1.",
    }),
];

export const CORE_PATTERN_IDS = CORE_PATTERNS.map((p) => p.id);
export const getCorePattern = (id: string) => CORE_PATTERNS.find((p) => p.id === id);
export const coreBySide = (side: CorePattern["side"]) => CORE_PATTERNS.filter((p) => p.side === side);

function generalTabs(def: PatternDef): PatternTabs {
  const s = def.sentiment ?? "neutral";
  const cont = def.type === "continuation";
  const psychology =
    s === "neutral"
      ? [
          "Buyers and sellers are roughly balanced: neither side kept control of the close.",
          "That balance is information about the trend before it, not a direction.",
          "The next decisive close shows which side won.",
        ]
      : cont
        ? [
            `The prior ${s === "bullish" ? "uptrend" : "downtrend"} shows ${s === "bullish" ? "buyers" : "sellers"} in control.`,
            `The pattern is a pause: the other side tries to push back but cannot take over.`,
            `The trend resumes when ${s === "bullish" ? "buyers" : "sellers"} close price beyond the pause.`,
          ]
        : [
            `Before the pattern, ${s === "bullish" ? "sellers" : "buyers"} were in control (the prior ${s === "bullish" ? "decline" : "rally"}).`,
            `In the pattern, that pressure stalls and ${s === "bullish" ? "buyers" : "sellers"} push back. The bodies and wicks described in Recognise are the record of that shift.`,
            `${s === "bullish" ? "Buyers" : "Sellers"} still need a follow-through close to prove they are in control.`,
          ];
  const up = s === "bullish";
  const trade: TradePlan =
    s === "neutral"
      ? {
          confirmation: "Wait for a close beyond the pattern's high or low; that side shows the direction.",
          entry: "Enter only after that break closes, in its direction.",
          stop: "Beyond the opposite side of the pattern.",
          target: "The next support or resistance level in the break's direction.",
        }
      : {
          confirmation: up
            ? "A later candle closes above the pattern's high."
            : "A later candle closes below the pattern's low.",
          entry: `${up ? "Long" : "Exit longs or short"} on the confirming close${cont ? ", in the direction of the trend" : ""}.`,
          stop: up ? "Below the pattern's low: the level that cancels the read." : "Above the pattern's high: the level that cancels the read.",
          target: `The next ${up ? "resistance or swing high" : "support or swing low"}; plan at least twice the stop distance or skip the trade.`,
        };
  return { recognise: [def.description], psychology, trade, general: true };
}

export function patternTabs(def: PatternDef): PatternTabs {
  const core = getCorePattern(def.id);
  if (core) return { ...core.tabs, general: false };
  const book = getBookPattern(def.id);
  if (book) return { recognise: book.recognise, psychology: book.psychology, trade: book.trade, general: false };
  const rev = REVERSAL_TABS[def.id];
  if (rev) return rev;
  return generalTabs(def);
}

/** SIMULATED illustration: the pattern with its context bars, plus a confirmation bar for core patterns. */
export function patternIllustration(id: string): { bars: OHLC[]; highlight?: number; confirmIndex?: number } {
  const core = getCorePattern(id);
  const src = PATTERN_OHLC[core?.chartKey ?? id];
  if (!src) return { bars: [] };
  const book = getBookPattern(id);
  // Chart patterns already end on the bar that completes them (the breakout / confirmation).
  if (book) return { bars: src.slice(0, book.end + 1), highlight: book.mark, confirmIndex: book.end };
  if (!core) return { bars: src };
  const end = core.bars[1];
  const head = src.slice(0, end + 1);
  const confirm = confirmationBar(src, end, core.side === "bullish" ? "up" : "down", core.bars[0]);
  return { bars: [...head, confirm], highlight: end, confirmIndex: end + 1 };
}

export const corePatternDefs = () => CORE_PATTERNS.map((c) => getPattern(c.id)!).filter(Boolean);
