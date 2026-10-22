/**
 * Learn banks: "oscillators" (OSC-) and "trading-risk" (RISK-).
 * Every number in an answer is computed here with src/lib/oscillators.ts or plain arithmetic, never hand-typed;
 * OSC-LAB- items are the Oscillators & volatility stop lab questions, keyed from the SIMULATED charts and shown with
 * the same chart. Definitions follow the sources in oscillatorSources.ts. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { OHLC } from "./ohlcData";
import { kdjStep, rawStochastic, smaOfSeries, trueRange } from "./oscillators";
import { oscQuestions, VSTOP_MULT } from "./oscillatorLab";

type Letter = "A" | "B" | "C" | "D";
const LETTERS: Letter[] = ["A", "B", "C", "D"];

/** Numeric answers keyed by question id (the label of the right option), for the recompute test. */
export const OSC_NUMERIC: Record<string, string> = {};

function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossary?: string): QuizQuestion {
  const uniq = [...new Set(wrong.filter((w) => w !== right))].slice(0, 3);
  if (uniq.length < 3) throw new Error(`oscillator quiz ${id}: needs 3 distinct wrong options`);
  const ordered = [...uniq];
  ordered.splice(LETTERS.indexOf(at), 0, right);
  const options: QuizOption[] = ordered.map((label, i) => ({ id: LETTERS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, glossaryTermId: glossary };
}
function num(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossary?: string): QuizQuestion {
  OSC_NUMERIC[id] = right;
  return mc(id, prompt, at, right, wrong, explanation, glossary);
}
const f1 = (v: number) => v.toFixed(1);
const f2 = (v: number) => v.toFixed(2);
const usd = (v: number) => `$${v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
const b = (high: number, low: number, close: number): OHLC => ({ name: "", open: close, high, low, close });

// ---------------------------------------------------------------- computed inputs
const STOCH_BARS = [b(50, 41, 44), b(52, 43, 47), b(51, 40, 49)];
const stochK = rawStochastic(STOCH_BARS, 3)[2]!; // (49 − 40) / (52 − 40) × 100
const K_SERIES = [60, 75, 90];
const stochD = smaOfSeries(K_SERIES, 3)[2]!;
const kdjK = kdjStep(40, 70);
const jHigh = 3 * 90 - 2 * 70;
const GAP_BARS = [b(51, 49, 50), b(47, 45, 46)];
const gapTR = trueRange(GAP_BARS)[1]!;
const vPeak = 80;
const vAtr = 1.5;
const vStop = vPeak - VSTOP_MULT * vAtr;

const lab: QuizQuestion[] = oscQuestions().map((q) => ({
  id: `OSC-LAB-${q.id}`,
  prompt: `${q.prompt} (SIMULATED chart: see the exhibit.)`,
  correctAnswer: q.correct as Letter,
  options: q.options.map((o) => ({ id: o.id as Letter, label: o.label, description: "" })),
  explanation: q.explanation,
  glossaryTermId: q.glossaryTermId,
  oscillatorExhibit: { chartId: q.chartId, panel: q.panel, mark: q.mark },
}));

export const OSCILLATOR_QUESTIONS: QuizQuestion[] = [
  mc(
    "OSC-01",
    "RSI has been above 70 for twelve bars while price keeps making higher highs. What does the reading tell you?",
    "B",
    "Price is stretched; in a strong trend RSI can stay overbought, so it is not a reversal call",
    ["Sell now: above 70 means the top is in", "Buy more: above 70 guarantees the trend continues", "Nothing: RSI only works above 90"],
    "RSI above 70 reads overbought and below 30 oversold, but with strong momentum it can stay there for a long time. Overbought describes a stretch, not a turn.",
    "momentum-oscillator",
  ),
  mc(
    "OSC-02",
    "The MACD line crosses above its signal line. How is that commonly read?",
    "A",
    "Bullish momentum; a cross below the signal line is read as bearish",
    ["Bearish: the fast line is catching up", "A guaranteed new uptrend", "Meaningless unless MACD is above 100"],
    "A cross above the signal is commonly read as bullish and a cross below as bearish. It is a read on momentum, not an order; crosses whipsaw in ranges.",
  ),
  mc(
    "OSC-03",
    "Why is MACD often paired with RSI?",
    "C",
    "They read momentum differently (average gap vs recent gains and losses), and they can disagree",
    ["They are the same formula with different colors", "RSI tells you the exact top and MACD the exact bottom", "Two indicators together turn a guess into a certainty"],
    "MACD tracks the gap between two moving averages; RSI compares recent gains with losses. Used together they give a fuller picture, and they can give contradictory results.",
  ),
  num(
    "OSC-04",
    `Over the last 3 bars the highest high is 52 and the lowest low is 40. Today closes at 49. What is fast %K(3)?`,
    "D",
    f1(stochK),
    [f1(stochK - 25), f1(stochK - 50), f1(((49 - 40) / 52) * 100)],
    `%K = (close − lowest low) ÷ (highest high − lowest low) × 100 = (49 − 40) ÷ (52 − 40) × 100 = ${f1(stochK)}. It says where the close sits in the recent range.`,
    "fast-stochastic",
  ),
  num(
    "OSC-05",
    `Fast %K reads ${K_SERIES.join(", ")} on the last three bars. What is fast %D?`,
    "B",
    f1(stochD),
    [f1(90), f1(60), f1(stochD + 10)],
    `%D is the 3-bar simple average of %K: (${K_SERIES.join(" + ")}) ÷ 3 = ${f1(stochD)}. %K crossing %D is the usual stochastic trigger.`,
    "fast-stochastic",
  ),
  mc(
    "OSC-06",
    "What is the difference between the fast and the slow stochastic?",
    "A",
    "Slow %K is fast %K smoothed with a 3-bar average (it equals fast %D), so it crosses less often",
    ["Slow uses weekly bars and fast uses daily bars", "Slow ignores the high and low and uses closes only", "There is none: the names are interchangeable"],
    "Fast %K reacts to every bar and gives more false signals. The slow version smooths it once more: fewer crossovers, a little later.",
    "slow-stochastic",
  ),
  num(
    "OSC-07",
    "KDJ: yesterday's K was 40 and today's RSV (raw stochastic) is 70. With the usual 1/3 smoothing, what is today's K?",
    "C",
    f1(kdjK),
    [f1(70), f1(55), f1(40)],
    `K = 2/3 × previous K + 1/3 × RSV = 2/3 × 40 + 1/3 × 70 = ${f1(kdjK)}. D is smoothed the same way from K, and J = 3K − 2D.`,
    "kdj",
  ),
  num(
    "OSC-08",
    "KDJ reads K = 90 and D = 70. What is J?",
    "D",
    String(jHigh),
    ["80", "100", "110"],
    `J = 3K − 2D = 270 − 140 = ${jHigh}. J amplifies the K − D gap, so it can go above 100 or below 0, turns first, and gives more false turns in choppy markets.`,
    "kdj",
  ),
  mc(
    "OSC-09",
    "RSI, the fast stochastic and KDJ all read overbought on the same bar. How much confirmation is that?",
    "B",
    "Little: all three are momentum oscillators built from the same prices, so they tend to agree",
    ["Three independent confirmations: the top is almost certain", "Two out of three would be better than three", "It proves the trend will reverse within three bars"],
    "KDJ is built from the stochastic, and RSI measures the same recent momentum. Their agreement is close to one reading. Look for different evidence: trend, a level, volume, the plan's risk.",
    "momentum-oscillator",
  ),
  num(
    "OSC-10",
    "Yesterday closed at 50. Today gaps down: high 47, low 45. What is today's true range?",
    "A",
    String(gapTR),
    ["2", "3", "1"],
    `True range = the largest of high − low (2), |high − previous close| (3) and |low − previous close| (${gapTR}). The gap counts, which is why ATR uses true range rather than high − low.`,
    "average-true-range",
  ),
  num(
    "OSC-11",
    `In an uptrend the highest close so far is ${vPeak} and ATR is ${vAtr}. Where is a volatility stop with a ${VSTOP_MULT}× multiplier?`,
    "C",
    f2(vStop),
    [f2(vPeak - vAtr), f2(vPeak - 3 * vAtr), f2(vPeak + VSTOP_MULT * vAtr)],
    `${vPeak} − ${VSTOP_MULT} × ${vAtr} = ${f2(vStop)}. It only moves up while the trend is up, and it flips above price when a close breaks it: a rule-based trailing stop.`,
    "volatility-stop",
  ),
  mc(
    "OSC-12",
    "Your sell stop is at 48. Overnight news and the stock opens at 44. Where does a stop order most likely fill?",
    "D",
    "Near 44: once triggered it becomes a market order at the next available price",
    ["Exactly 48: a stop guarantees its price", "It is cancelled because price skipped it", "At 48 or better, because stops cannot slip"],
    "A stop level controls when the exit order triggers, not the fill. A gap can open far through it.",
    "gap-risk",
  ),
  mc(
    "OSC-13",
    "Every oscillator on your chart looks bullish. What else does an entry need?",
    "A",
    "A position size, an exit plan and a defined risk limit",
    ["Nothing: indicators are the buy signal", "A second chart with more oscillators", "A bigger position because the signals agree"],
    "Indicators support a decision; they are not buy or sell signals. The plan still decides how much, where you are wrong, where you take profit, and how much you can lose.",
    "indicator-not-signal",
  ),
  ...lab,
];

// ---------------------------------------------------------------- trading-risk
const vol = 12_000_000;
const flt = 4_000_000;
const turnover = vol / flt;
const premium = 0.85;
const contracts = 3;
const maxLoss = premium * 100 * contracts;
const p0 = 0.2;
const p1 = 1.0;
const gainPct = Math.round(((p1 - p0) / p0) * 100);
const acct = 10_000;
const riskPct = 1;
const riskUsd = (acct * riskPct) / 100;
const stopDist = 2.5;
const shares = Math.floor(riskUsd / stopDist);
const e1 = 50, e2 = 48, stop = 47;
const sh1 = Math.floor(riskUsd / (e1 - stop));
const sh2 = Math.floor(riskUsd / (e2 - stop));

export const TRADING_RISK_QUESTIONS: QuizQuestion[] = [
  mc(
    "RISK-01",
    "What is a stock's float?",
    "B",
    "The shares available for the public to trade",
    ["All shares the company is allowed to issue", "The shares the company bought back", "The day's trading volume"],
    "Float excludes locked-up, insider and other restricted holdings. Vendors draw the line differently, so float numbers differ.",
    "public-float",
  ),
  num(
    "RISK-02",
    `A stock with a ${(flt / 1e6).toFixed(0)} million share float trades ${(vol / 1e6).toFixed(0)} million shares today. What is its float turnover?`,
    "C",
    `${turnover}×`,
    ["0.33×", "1×", "12×"],
    `Turnover = volume ÷ float = ${(vol / 1e6).toFixed(0)}M ÷ ${(flt / 1e6).toFixed(0)}M = ${turnover}×.`,
    "float-turnover",
  ),
  mc(
    "RISK-03",
    "A low-float stock suddenly trades ten times its usual volume. What is the most accurate expectation?",
    "A",
    "It can move sharply, in either direction, with wide spreads",
    ["It must rise, because demand exceeds the float", "It cannot move much, because few shares exist", "It will fall back to yesterday's price by the close"],
    "Fewer shares to trade means unusual volume can push the price hard both ways. A small float tends to be more volatile.",
    "public-float",
  ),
  mc(
    "RISK-04",
    "Float turnover hits 5× after a big run. Does that reliably predict a reversal?",
    "D",
    "No: it shows heavy activity, not the direction of the next move",
    ["Yes: above 3× the top is always in", "Yes: it means every holder has sold", "No: turnover only matters below 1×"],
    "Every trade has a buyer and a seller. High turnover can come with a rally, a selloff or a round trip.",
    "float-turnover",
  ),
  mc(
    "RISK-05",
    `Turnover is ${turnover}×. Does that mean every floating share changed hands ${turnover} times?`,
    "B",
    "No: the same shares can trade many times while others never move",
    ["Yes, exactly", "Yes, but only for insiders", "No: it means a third of the float traded"],
    "Turnover compares total volume with the float. It summarizes activity, not how many distinct owners changed.",
    "float-turnover",
  ),
  mc(
    "RISK-06",
    "Which statement separates holding an option briefly from buying a short-dated option?",
    "C",
    "Holding period is how long you own it; a short-dated contract is one close to expiration",
    ["They mean the same thing", "Short-dated means you must sell it the same day", "Holding briefly removes time decay"],
    "You can hold a six-month option for one day, or buy a contract that expires today. The risks differ: short-dated contracts decay faster and react more sharply to price.",
    "short-dated-option",
  ),
  num(
    "RISK-07",
    `You buy ${contracts} call contracts at a premium of ${usd(premium)} (100 shares each). What is the most you can lose?`,
    "A",
    usd(maxLoss),
    [usd(premium * contracts), usd(premium * 100), "Unlimited"],
    `A buyer's maximum loss is the premium paid: ${usd(premium)} × 100 × ${contracts} = ${usd(maxLoss)}, and on a short-dated contract it can all go in hours.`,
    "option-premium",
  ),
  mc(
    "RISK-08",
    "How does theta (time decay) behave as expiration gets close?",
    "B",
    "It speeds up: the option loses value faster near expiration",
    ["It stops: no time is left to decay", "It turns positive for buyers", "It stays the same every day of the option's life"],
    "Theta decay accelerates as expiration approaches. It works against buyers and for sellers.",
    "theta-decay",
  ),
  mc(
    "RISK-09",
    "Why are expiration-day and other very short-dated options risky for a buyer?",
    "D",
    "They are very sensitive to the underlying's price, and the whole premium can be lost quickly",
    ["They cannot lose value on their last day", "Their low price caps the loss below the premium", "Brokers guarantee a refund if they expire worthless"],
    "Short-dated contracts are cheap per contract but react sharply to small moves in the stock, and time decay is fastest at the end.",
    "short-dated-option",
  ),
  num(
    "RISK-10",
    `A short-dated call bought at ${usd(p0)} is sold at ${usd(p1)}. What is the gain, and is it a fair guide to expected results?`,
    "C",
    `+${gainPct}%, and no: such gains are not representative or repeatable`,
    [`+${gainPct}%, and yes: repeat it weekly`, `+${gainPct / 4}%, and yes`, `+${gainPct}%, and yes if you buy more contracts`],
    `(${usd(p1)} − ${usd(p0)}) ÷ ${usd(p0)} = +${gainPct}%. The same contract can just as easily go to zero (−100%). One large percentage gain says nothing about the odds of the next trade.`,
    "short-dated-option",
  ),
  mc(
    "RISK-11",
    "Before entering, what does a complete plan include besides an indicator reading?",
    "A",
    "Position size, an exit plan (stop and target) and a defined risk limit",
    ["Only the indicator and a hunch", "A target, with no stop so you are not shaken out", "Margin, so the position can be larger"],
    "Indicators support a decision. The plan decides how much, where you are wrong, where you take profit and how much you can lose.",
    "indicator-not-signal",
  ),
  num(
    "RISK-12",
    `Account ${usd(acct)}, risk limit ${riskPct}% per trade, stop ${usd(stopDist)} below entry. How many shares?`,
    "B",
    `${shares} shares`,
    [`${shares * 4} shares`, `${Math.floor(acct / 100)} shares`, `${shares / 2} shares`],
    `Risk per trade = ${riskPct}% × ${usd(acct)} = ${usd(riskUsd)}; ${usd(riskUsd)} ÷ ${usd(stopDist)} per share = ${shares} shares.`,
    "position-sizing",
  ),
  mc(
    "RISK-13",
    "On the same SIMULATED session the index is flat. A software stock gains 4%, a retailer is flat and a biotech falls 6%. What does this show?",
    "D",
    "The same market conditions can give very different results by sector, timing and risk management",
    ["The index return is what every stock earns", "The biotech trader must have used the wrong indicator", "Results only depend on the market's direction"],
    "Picking the stock (sector, catalyst, timing) and managing the risk matter as much as the market's direction. A flat index hides a wide spread of outcomes.",
    "diversification",
  ),
  num(
    "RISK-14",
    `Same stock, same stop at ${stop}, same ${usd(riskUsd)} risk. Trader A buys at ${e1}, trader B waits and buys a pullback at ${e2}. How many shares can each buy?`,
    "A",
    `A ${sh1}, B ${sh2}`,
    [`A ${sh2}, B ${sh1}`, `A ${sh1}, B ${sh1}`, `A ${sh2}, B ${sh2}`],
    `Risk per share is ${e1} − ${stop} = ${e1 - stop} for A and ${e2} − ${stop} = ${e2 - stop} for B, so ${usd(riskUsd)} buys ${sh1} vs ${sh2} shares. Timing changes the risk of the same idea.`,
    "position-sizing",
  ),
];
