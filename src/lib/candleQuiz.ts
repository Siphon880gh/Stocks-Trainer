/**
 * Learn banks: "japanese-candles" (JC-) on the 14 core Japanese patterns (psychology, confirmation, stop) plus the
 * framing lesson, and "heikin-ashi" (HA-) on the Heikin-Ashi formula and reading. HA-LAB- items are the lab's
 * computed questions, shown with the lab's SIMULATED charts. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import { getCorePattern } from "./patternTabs";
import { haQuestions } from "./heikinAshiLab";

type Letter = "A" | "B" | "C" | "D";
const LETTERS: Letter[] = ["A", "B", "C", "D"];

function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, extra: Partial<QuizQuestion> = {}): QuizQuestion {
  const uniq = [...new Set(wrong.filter((w) => w !== right))].slice(0, 3);
  if (uniq.length < 3) throw new Error(`candle quiz ${id}: needs 3 distinct wrong options`);
  const ordered = [...uniq];
  ordered.splice(LETTERS.indexOf(at), 0, right);
  const options: QuizOption[] = ordered.map((label, i) => ({ id: LETTERS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...extra };
}
/** Show the pattern's SIMULATED context chart with the pattern's last bar highlighted. */
const chart = (id: string): Partial<QuizQuestion> => ({ patternKey: getCorePattern(id)!.chartKey, highlightIndex: getCorePattern(id)!.bars[1] });

export const JAPANESE_CANDLE_QUESTIONS: QuizQuestion[] = [
  // ---------------- framing ----------------
  mc("JC-01", "Where do candlestick charts come from?", "B", "Japanese rice trading: their roots go back to the 18th-century rice markets; Steve Nison introduced them to Western traders in the late 1980s and early 1990s",
    ["US stock exchanges in the 1980s", "Computer trading platforms in the 2000s", "European bond desks in the 1950s"],
    "Candlestick analysis grew out of Japanese rice trading (the Dojima rice exchange in Osaka traded rice futures from the 1700s). Steve Nison's articles and his 1991 book Japanese Candlestick Charting Techniques brought it to Western traders.", { glossaryTermId: "japanese-candlesticks" }),
  mc("JC-02", "What does one candle capture?", "A", "The battle between buyers and sellers over one period: where it opened, how far each side pushed, and who held the close",
    ["Only the closing price", "Which side will win the next period", "The number of trades in the period"],
    "Open, high, low and close show where the period started, how far buyers and sellers each pushed, and where the battle ended. It describes what happened, not what comes next.", { glossaryTermId: "japanese-candlesticks" }),
  mc("JC-03", "A long body with tiny wicks tells you…", "C", "One side won the period from open to close and held it",
    ["Both sides were rejected", "Nobody traded", "The next candle will be the same colour"],
    "A big body and short wicks: price opened near one end and closed near the other. The winning side was in control all period.", { glossaryTermId: "full-body-candle" }),
  mc("JC-04", "A long upper wick tells you…", "D", "Buyers pushed price up, then sellers rejected those higher prices before the close",
    ["Buyers won the period", "There was no trading above the body", "Price will gap up next"],
    "The wick is where price traded but could not stay. An upper wick is rejected higher prices; a lower wick is rejected lower prices.", { glossaryTermId: "wick-rejection" }),
  mc("JC-05", "A tiny body with wicks on both sides (a doji or spinning top) means…", "A", "Indecision: both sides pushed, neither held the close",
    ["A guaranteed reversal", "Strong buying", "Strong selling"],
    "Open and close end up close together after price moved both ways. On its own it is indecision; after a long move it can warn that the move is tiring.", { glossaryTermId: "indecision-candle" }),
  // ---------------- bullish ----------------
  mc("JC-06", "The highlighted candle is a dragonfly doji after a decline. What is the buyer–seller story?", "B", "Sellers drove price far lower, buyers pushed it all the way back to the open by the close",
    ["Buyers controlled the whole session", "Nothing traded below the open", "Sellers closed it at the low"],
    "The long lower wick is the rejected selling; open, high and close sit together at the top. It shows demand, not a finished reversal.", chart("dragonfly-doji")),
  mc("JC-07", "Dragonfly doji after a decline: what confirms it?", "C", "The next candle closes green above the doji's high",
    ["The doji itself is confirmation", "Any red candle afterwards", "A gap down on the next open"],
    "Textbooks treat a doji as indecision. Wait for a green close above its high before treating it as a bottom; a close below its low cancels it.", chart("dragonfly-doji")),
  mc("JC-08", "A hammer forms after a decline. Where does the stop go for a long taken on its confirmation?", "A", "Just below the hammer's low",
    ["Just below the hammer's body", "Above the hammer's high", "No stop: hammers are reliable"],
    "The low of the long lower wick is the level buyers defended. Below it the rejection has failed, so that is the invalidation level.", chart("hammer")),
  mc("JC-09", "Same hammer shape, but after a long rally. What is it called and how is it read?", "D", "A hanging man: a warning for longs that needs a lower close to confirm",
    ["Still a hammer: buy it", "A dragonfly doji", "A shooting star"],
    "Location changes the name and the read. After a rally the long lower wick shows sellers testing lower prices; it is a hanging man."),
  mc("JC-10", "Bullish engulfing: what does candle 2 tell you?", "B", "Sellers opened in control, then buyers closed above candle 1's open, erasing the prior session",
    ["Buyers and sellers drew", "Sellers won both sessions", "The gap above was filled"],
    "The green body covering the red body means buyers took back all of the prior session's selling in one session.", chart("bullish-engulfing")),
  mc("JC-11", "Bullish engulfing after a decline: where is the invalidation?", "C", "Below the low of the two-candle pattern",
    ["Above candle 2's high", "At candle 1's close", "There is none"],
    "If price falls below the pattern's low, the buyers' takeover failed.", chart("bullish-engulfing")),
  mc("JC-12", "Piercing line: how far must candle 2 close into candle 1's red body?", "A", "Above its midpoint (but below its open)",
    ["Anywhere inside it", "Above its open", "Below its close"],
    "Above the midpoint is the piercing line; above the open would be an engulfing; below the midpoint is the weaker in-neck or thrusting line.", chart("piercing-line")),
  mc("JC-13", "Piercing line psychology: why does the lower open matter?", "D", "Sellers looked fully in control at the open, so the recovery past the midpoint is a real shift",
    ["It does not matter", "It means buyers opened in control", "A lower open always fills next day"],
    "The pattern is a story: a long red session, an even lower open, then buyers recover more than half of the losses.", chart("piercing-line")),
  mc("JC-14", "Tweezer bottom: what makes it more than a minor signal?", "B", "When one of the candles is also a hammer, engulfing or piercing line, at support",
    ["Nothing: tweezers are always strong", "Three matching lows instead of two", "A higher volume on candle 1"],
    "Matching lows show a price tested twice and held. On their own tweezers are minor; they gain weight when combined with another reversal candle.", chart("tweezer-bottom")),
  mc("JC-15", "Tweezer bottom: where is the stop?", "C", "Just below the shared low",
    ["At candle 2's close", "Above the pair's high", "Two candles below"],
    "The shared low is the defended level. Breaking it cancels the read.", chart("tweezer-bottom")),
  mc("JC-16", "Three white soldiers after a decline: what is a common confirmation?", "A", "A fourth candle closes above the third soldier's high",
    ["The first soldier's close", "A red candle after the third", "A gap down"],
    "The pattern shows three sessions of buying; many traders still wait for a fourth close above candle 3's high before going long.", chart("three-white-soldiers")),
  mc("JC-17", "Three white soldiers: what weakens the pattern?", "D", "Shrinking bodies or long upper wicks on soldiers 2 and 3",
    ["Each closing near its high", "Opening inside the prior body", "Appearing after a decline"],
    "Short bodies or long upper wicks show the buying is stalling. Far above support after a long rally, the pattern can also mean the move is stretched.", chart("three-white-soldiers")),
  mc("JC-18", "Morning star: what does the small middle candle represent?", "B", "The selling stalls: neither side wins that session at the low",
    ["Strong buying", "A continuation of the decline", "A gap fill"],
    "Candle 1 is selling, candle 2 is a pause, and candle 3 is buying that closes past candle 1's midpoint.", chart("morning-star")),
  mc("JC-19", "Morning star: where does the stop go?", "C", "Below the star's low (the pattern's lowest point)",
    ["Below candle 3's open", "Above candle 1's open", "At the midpoint of candle 1"],
    "The star's low is the bottom of the pattern; a close back below it cancels the read.", chart("morning-star")),
  // ---------------- bearish ----------------
  mc("JC-20", "Gravestone doji after a rally: buyer–seller story?", "A", "Buyers drove price far higher, sellers pushed it all the way back to the open by the close",
    ["Sellers controlled the whole session", "No trading above the open", "Buyers held the close at the high"],
    "The long upper wick is rejected buying. Open, low and close sit together at the bottom: supply showed up, but it is not yet a top.", chart("gravestone-doji")),
  mc("JC-21", "Gravestone doji: what confirms it?", "B", "The next candle closes red below the doji's low",
    ["The doji alone", "A green candle next", "A gap up"],
    "Like the dragonfly, a gravestone is a doji and needs a confirming close in the new direction.", chart("gravestone-doji")),
  mc("JC-22", "Shooting star after a rally: where is the stop on a short taken on confirmation?", "D", "Just above the star's high",
    ["Just above the star's body", "Below the star's low", "No stop needed"],
    "The top of the long upper wick is where buyers were rejected; above it the read has failed.", chart("shooting-star")),
  mc("JC-23", "The same shape as a shooting star, but after a decline, is called…", "C", "An inverted hammer",
    ["A hanging man", "A gravestone doji", "A hammer"],
    "Location decides the name: after a decline the long upper wick shows buyers probing higher."),
  mc("JC-24", "Bearish engulfing: what happened in candle 2?", "A", "Buyers opened in control, then sellers closed below candle 1's open",
    ["Both sides drew", "Buyers won both sessions", "Price gapped down and held"],
    "The red body covering the green body erased the prior session's buying.", chart("bearish-engulfing")),
  mc("JC-25", "Dark cloud cover vs bearish engulfing: what is the difference?", "B", "Dark cloud closes below candle 1's midpoint but above its open; engulfing closes below the open",
    ["They are the same pattern", "Dark cloud has three candles", "Engulfing must gap"],
    "How deep candle 2 closes decides the name. Both open above the prior close or high.", chart("dark-cloud-cover")),
  mc("JC-26", "Dark cloud cover: where is the stop?", "C", "Above candle 2's high",
    ["Below candle 2's low", "At candle 1's midpoint", "Above candle 1's open"],
    "Candle 2's high is the pattern's high; a close above it cancels the read.", chart("dark-cloud-cover")),
  mc("JC-27", "Tweezer top: what confirms it?", "D", "A close below the low of the tweezer pair",
    ["Matching highs are enough", "A third matching high", "A green close next"],
    "Two failed tests of one high show supply; a close below the pair's low confirms sellers took over.", chart("tweezer-top")),
  mc("JC-33", "Tweezer top psychology: what do the matching highs show?", "B", "Buyers tried the same price twice and were turned back both times: supply sits there",
    ["Buyers broke out twice", "Nothing: highs never matter", "Sellers were absent"],
    "Two rejections at one level show sellers defending it. The second candle closing lower is the first sign they are responding.", chart("tweezer-top")),
  mc("JC-28", "Three black crows: what cancels the pattern?", "A", "A close back above the first crow's open",
    ["A fourth red candle", "A small lower wick", "Each crow opening inside the prior body"],
    "Above the first crow's open, the three sessions of selling have been reversed.", chart("three-black-crows")),
  mc("JC-29", "Three black crows after a long decline (far below resistance). What is the risk?", "B", "The move may be stretched: shorting late can mean a big stop and a sharp bounce",
    ["None: it is a reversal pattern", "It turns bullish", "It guarantees a crash"],
    "The pattern belongs near a top. Late in a long decline, the same candles show selling that may be exhausted."),
  mc("JC-30", "Evening star: the third candle should close…", "C", "Well into candle 1's green body, at least past its midpoint",
    ["Above candle 1's close", "Anywhere red", "Above the star"],
    "That deep close shows sellers erased more than half of candle 1's gain: the built-in confirmation.", chart("evening-star")),
  mc("JC-31", "Evening star: where does the stop go?", "A", "Above the star's high",
    ["Below candle 3's low", "At candle 1's open", "Below the star"],
    "The star's high is the pattern's high. Above it the top has failed.", chart("evening-star")),
  mc("JC-32", "Which statement about all 14 core patterns is true?", "D", "They are probabilities, not guarantees: use a confirmation, a stop at invalidation and a planned exit",
    ["A confirmed pattern cannot fail", "Location does not matter", "Patterns replace a stop"],
    "Pattern studies find modest edges at best and many failures. The plan, not the pattern, limits the loss."),
];

const lab: QuizQuestion[] = haQuestions().map((q) => ({
  id: `HA-LAB-${q.id}`,
  prompt: `${q.prompt} (SIMULATED chart: see the exhibit.)`,
  correctAnswer: q.correct as Letter,
  options: q.options.map((o) => ({ id: o.id as Letter, label: o.label, description: "" })),
  explanation: q.explanation,
  glossaryTermId: q.glossaryTermId,
  heikinAshiExhibit: { mark: q.mark },
}));

export const HEIKIN_ASHI_QUESTIONS: QuizQuestion[] = [
  mc("HA-01", "What is a Heikin-Ashi candle?", "B", "A modified, averaged candle: each one blends the bar with the previous HA candle to smooth price",
    ["A candle that shows only the real close", "A candle from a different exchange", "A one-minute candle"],
    "Heikin-Ashi (\"average pace\") uses averages of the current bar and the previous HA candle, so noise is filtered and trends are easier to see.", { glossaryTermId: "heikin-ashi" }),
  mc("HA-02", "HA close is…", "A", "(Open + High + Low + Close) ÷ 4 of the current bar",
    ["The real close", "(Previous HA open + previous HA close) ÷ 2", "The highest of high, HA open and HA close"],
    "HA close is the average of the bar's four prices. HA open is the average of the previous HA open and close.", { glossaryTermId: "heikin-ashi" }),
  mc("HA-03", "HA open is…", "C", "(Previous HA open + previous HA close) ÷ 2",
    ["The real open", "(O + H + L + C) ÷ 4", "The previous real close"],
    "That carry-over from the previous HA candle is what smooths HA charts and also what makes them lag. The first HA open is seeded as (O + C) ÷ 2.", { glossaryTermId: "heikin-ashi" }),
  mc("HA-04", "A run of green HA candles with no lower wicks means…", "D", "A strong uptrend",
    ["Indecision", "A strong downtrend", "Low volume"],
    "With no lower wick, the HA open is the low of the candle: buyers kept price above it all period, period after period."),
  mc("HA-05", "Small HA bodies with wicks on both sides after a trend suggest…", "B", "A possible turn: wait for confirmation",
    ["The trend is accelerating", "A guaranteed reversal", "A data error"],
    "Indecision after a trend is a warning. Confirmation is a colour change that holds or a break of support or resistance on the real chart."),
  mc("HA-06", "Why can't you place a stop at an HA price?", "A", "HA prices are averages, not traded prices; orders fill at real prices",
    ["You can: HA prices are exact", "Brokers ban it", "HA prices are always higher"],
    "Read the trend on HA, then set entries, stops and targets from the regular candles."),
  mc("HA-07", "What is the main cost of HA's smoothing?", "C", "Lag: it changes colour later than regular candles",
    ["It shows more noise", "It needs volume data", "It only works on daily charts"],
    "Averaging with the previous candle delays turns, so HA signals come late, and gaps are hidden."),
  ...lab,
];
