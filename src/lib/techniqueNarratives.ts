/**
 * Technique narratives (/practice/technique-narratives): six popover walkthroughs. Each runs one rule-based
 * technique on a SIMULATED chart that suits it, then the same rule on a SIMULATED chart that doesn't, with the
 * trade results computed by narrativeEngine (tests assert right > 0, wrong < 0). Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";
import type { ChartAnnotations, ChartTrendline, ChartPoint, AnnotationTone } from "./chartAnnotations";
import {
  BB_RULE, BREAKOUT_RULE, MA_RULE, MACD_RULE, RSI_RULE, bandwidth, bollingerBands, macd, rsi, runBreakout, runMa,
  runMacdDiv, runRsi, runSqueeze, runVwap, sma, vwap, type Bar, type RunResult,
} from "./narrativeEngine";
import * as D from "./narrativeData";
import type { WalkthroughStep } from "./tourProgress";

export interface Src { label: string; url: string }
const s = (label: string, url: string): Src => ({ label, url });
export const SRC = {
  rsi: s("StockCharts ChartSchool: RSI", "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/relative-strength-index-rsi"),
  ma: s("StockCharts ChartSchool: Moving Averages", "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/moving-averages-simple-and-exponential"),
  cup: s("StockCharts ChartSchool: Cup with Handle", "https://chartschool.stockcharts.com/table-of-contents/chart-analysis/chart-patterns/cup-with-handle"),
  vwap: s("StockCharts ChartSchool: VWAP", "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-overlays/volume-weighted-average-price-vwap"),
  macd: s("StockCharts ChartSchool: MACD", "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/macd-moving-average-convergence-divergence-oscillator"),
  squeeze: s("StockCharts ChartSchool: Bollinger Band Squeeze", "https://chartschool.stockcharts.com/table-of-contents/trading-strategies-and-models/trading-strategies/bollinger-band-squeeze"),
};

export type PaneKind = "rsi" | "ma-spread" | "macd" | "bandwidth" | "none";
export interface PaneSpec { title: string; series: Array<{ values: (number | null)[]; color: string; label: string; kind?: "line" | "bar" }>; guides: Array<{ value: number; label: string }>; domain?: [number, number] }
export interface ChartSide { title: string; bars: Bar[]; result: RunResult; overlays: ChartAnnotations; pane: PaneSpec | null; showVolume: boolean; readout: (i: number) => string }
export interface Narrative {
  id: string;
  title: string;
  technique: string;
  rule: string;
  needs: string[];
  right: ChartSide;
  wrong: ChartSide;
  fail: { title: string; why: string[]; instead: string };
  checklist: string[];
  sources: Src[];
  steps: Array<WalkthroughStep & { chart: "right" | "wrong"; focus?: number }>;
  questions: QuizQuestion[];
}

const UP = "#16a34a", DOWN = "#dc2626", BLUE = "#2563eb", AMBER = "#d97706", GREY = "#6b7280";
function line(values: (number | null)[], label: string, tone: AnnotationTone): ChartTrendline[] {
  const out: ChartTrendline[] = [];
  let lastIdx = -1;
  for (let i = 1; i < values.length; i++) {
    if (values[i] == null || values[i - 1] == null) continue;
    out.push({ from: { index: i - 1, price: values[i - 1]! }, to: { index: i, price: values[i]! }, tone });
    lastIdx = out.length - 1;
  }
  if (lastIdx >= 0) out[lastIdx] = { ...out[lastIdx]!, label };
  return out;
}
function tradePoints(r: RunResult, bars: Bar[]): ChartPoint[] {
  return r.trades.flatMap((t) => [
    { index: t.entryIndex, price: bars[t.entryIndex]!.low, label: "Buy", tone: "entry" as const },
    { index: t.exitIndex, price: bars[t.exitIndex]!.high, label: t.pnl >= 0 ? "Exit +" : "Exit −", tone: (t.pnl >= 0 ? "reward" : "risk") as AnnotationTone },
  ]);
}
const f2 = (v: number | null | undefined) => (v == null ? "—" : v.toFixed(2));
const sign = (v: number) => (v >= 0 ? `+${v.toFixed(2)}` : v.toFixed(2));
const ohlc = (b: Bar) => `O ${b.open} · H ${b.high} · L ${b.low} · C ${b.close}`;
export function resultLine(r: RunResult): string {
  const n = r.trades.length;
  return `${n} trade${n === 1 ? "" : "s"}, net ${sign(r.total)} points per share (SIMULATED, before costs)`;
}

type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

function steps(n: Omit<Narrative, "steps" | "questions">, extra: { indicator: string; signal: string; wrongWhat: string }): Narrative["steps"] {
  const rt = n.right.result, wt = n.wrong.result;
  const firstR = rt.trades[0], firstW = wt.trades[0];
  return [
    { id: "rule", title: n.title, body: `${n.technique}\n\nThe rule: ${n.rule}`, target: "nar-rule", chart: "right" },
    { id: "right-chart", title: "The right kind of chart", body: `${n.right.title}.\n\nThis technique needs:\n• ${n.needs.join("\n• ")}`, target: "nar-chart", chart: "right" },
    { id: "indicator", title: "Read the indicator", body: extra.indicator, target: "nar-indicator", chart: "right", focus: firstR?.entryIndex },
    { id: "signal", title: "The signal", body: `${extra.signal}${firstR ? `\n\nFirst entry: bar ${firstR.entryIndex + 1} at ${firstR.entry}.` : ""}`, target: "nar-chart", chart: "right", focus: firstR?.entryIndex },
    { id: "result", title: "The result on the right chart", body: `${resultLine(rt)}.\n\nThe chart suited the technique, so the same mechanical rule had room to work.`, target: "nar-trades", chart: "right", focus: firstR?.exitIndex },
    { id: "wrong-chart", title: "Same rule, wrong chart", body: `${n.wrong.title}.\n\n${extra.wrongWhat}${firstW ? `\n\nEntry: bar ${firstW.entryIndex + 1} at ${firstW.entry}; exit bar ${firstW.exitIndex + 1} at ${firstW.exit}.` : ""}`, target: "nar-chart", chart: "wrong", focus: firstW?.entryIndex },
    { id: "fail", title: n.fail.title, body: `${resultLine(wt)}.\n\n• ${n.fail.why.join("\n• ")}`, target: "nar-fail", chart: "wrong" },
    { id: "checklist", title: "Check the chart before the technique", body: `${n.fail.instead}\n\nUse the checklist, then Exit to explore: switch charts and click any candle to read its values.`, target: "nar-checklist", chart: "right" },
  ];
}

/* ---------- 1. RSI on a range ---------- */
function rsiNarrative(): Narrative {
  const mk = (title: string, bars: Bar[]): ChartSide => {
    const c = bars.map((b) => b.close); const r = rsi(c, RSI_RULE.period); const res = runRsi(bars);
    return {
      title, bars, result: res, showVolume: false,
      overlays: { points: tradePoints(res, bars) },
      pane: { title: "RSI(14)", series: [{ values: r, color: BLUE, label: "RSI(14)" }], guides: [{ value: 70, label: "70" }, { value: 30, label: "30" }], domain: [0, 100] },
      readout: (i) => `Bar ${i + 1}: ${ohlc(bars[i]!)} · RSI ${f2(r[i])}`,
    };
  };
  const base = {
    id: "rsi-range",
    title: "RSI reversals in a range",
    technique: "Mean reversion with RSI: buy weakness and sell strength while price swings between support and resistance.",
    rule: `Buy when RSI(${RSI_RULE.period}) closes below ${RSI_RULE.buyBelow}; sell when it closes above ${RSI_RULE.sellAbove} (or at the last bar).`,
    needs: ["A sideways range with clear support and resistance", "Swings big enough to carry RSI from below 30 to above 70", "No strong trend: candles alternate between up and down runs"],
    right: mk("SIMULATED daily chart: a range between about 92 and 108", D.rsiRange()),
    wrong: mk("SIMULATED daily chart: a steady downtrend with weak bounces", D.rsiDowntrend()),
    fail: {
      title: "Why it failed: oversold stayed oversold",
      why: ["In a downtrend RSI can sit below 30 for a long time; bottoming is a process, not a single reading (StockCharts).", "Bounces were too weak to push RSI above 70, so the exit never came.", "Lower highs and lower lows meant there was no range to revert to."],
      instead: "Use RSI reversals only after you see a range: at least two touches of support and resistance, flat moving averages, and swings that fill the range.",
    },
    checklist: ["Price is moving sideways, not trending", "Support and resistance each tested at least twice", "RSI has reached both 30 and 70 inside this range before", "Stop placed below range support"],
    sources: [SRC.rsi],
  };
  const n = { ...base, steps: [] as Narrative["steps"], questions: [] as QuizQuestion[] };
  n.steps = steps(base, {
    indicator: "RSI measures the speed of recent gains versus losses on a 0–100 scale. Wilder treated above 70 as overbought and below 30 as oversold (StockCharts). In a range, those readings tend to line up with the edges.",
    signal: "RSI dipped below 30 as price pushed into the bottom of the range: the buy.",
    wrongWhat: "RSI dropped below 30 early, the rule bought, and price kept making lower lows.",
  });
  n.questions = [
    mc("TN-01", "RSI mean-reversion signals work best on which chart?", "B", "A sideways range with tested support and resistance", ["A strong, steady downtrend", "A single gap day", "Any chart, as long as RSI is below 30"], "Reversion needs a range to revert to.", "mean-reversion"),
    mc("TN-02", "In a strong downtrend, an RSI below 30 often means…", "C", "Momentum is weak and can stay weak; it isn't a buy by itself", ["The bottom is in", "Volume must rise", "The stock will gap up"], "StockCharts: bottoming can be a process; oversold can persist."),
  ];
  return n;
}

/* ---------- 2. MA crossover on a trend ---------- */
function maNarrative(): Narrative {
  const mk = (title: string, bars: Bar[]): ChartSide => {
    const c = bars.map((b) => b.close); const f = sma(c, MA_RULE.fast); const sl = sma(c, MA_RULE.slow); const res = runMa(bars);
    return {
      title, bars, result: res, showVolume: false,
      overlays: { trendlines: [...line(f, `SMA ${MA_RULE.fast}`, "entry"), ...line(sl, `SMA ${MA_RULE.slow}`, "neutral")], points: tradePoints(res, bars) },
      pane: { title: `SMA(${MA_RULE.fast}) − SMA(${MA_RULE.slow})`, series: [{ values: c.map((_, i) => (f[i] == null || sl[i] == null ? null : f[i]! - sl[i]!)), color: AMBER, label: `SMA ${MA_RULE.fast} − SMA ${MA_RULE.slow}`, kind: "bar" }], guides: [{ value: 0, label: "0" }] },
      readout: (i) => `Bar ${i + 1}: ${ohlc(bars[i]!)} · SMA${MA_RULE.fast} ${f2(f[i])} · SMA${MA_RULE.slow} ${f2(sl[i])}`,
    };
  };
  const base = {
    id: "ma-trend",
    title: "Moving-average crossover on a smooth trend",
    technique: "Trend following: get long when the short average crosses above the long one, and stay long until it crosses back.",
    rule: `Buy when SMA(${MA_RULE.fast}) crosses above SMA(${MA_RULE.slow}); sell when it crosses back below (or at the last bar).`,
    needs: ["A sustained trend with higher highs and higher lows", "Pullbacks that stay shallow (they don't undercut the long average for long)", "Mostly large-bodied candles in the trend direction"],
    right: mk("SIMULATED daily chart: a base, then a smooth uptrend", D.maTrend()),
    wrong: mk("SIMULATED daily chart: choppy sideways trading", D.maChop()),
    fail: {
      title: "Why it failed: whipsaws",
      why: ["Without a trend, the averages cross back and forth; each cross arrives late, near the top or bottom of a swing.", "StockCharts: crossovers work in strong trends, but with no strong trend a crossover system produces many whipsaws.", "Each round trip bought high and sold low, and real costs would make it worse."],
      instead: "Confirm a trend first: rising long average, higher highs and lows. In a range, stand aside or use a range technique.",
    },
    checklist: ["Long average is sloping, not flat", "Higher highs and higher lows (or the reverse for shorts)", "Fewer than two crossovers in the last 30 bars", "Plan for the lag: crossovers come late"],
    sources: [SRC.ma],
  };
  const n = { ...base, steps: [] as Narrative["steps"], questions: [] as QuizQuestion[] };
  n.steps = steps(base, {
    indicator: `The pane shows SMA(${MA_RULE.fast}) minus SMA(${MA_RULE.slow}). Above zero, the short average leads; the cross through zero is the signal.`,
    signal: "After the base, the short average crossed above the long one as price started making higher highs.",
    wrongWhat: "The averages kept crossing as price chopped, and every cross came late.",
  });
  n.questions = [
    mc("TN-03", "A moving-average crossover system loses most often when…", "A", "Price is range-bound, causing repeated whipsaws", ["A strong trend develops", "Volume is above average", "The long average slopes upward"], "StockCharts: no strong trend → many whipsaws.", "whipsaw"),
    mc("TN-04", "Why do crossover signals come late?", "D", "Moving averages are built from past prices, so they lag", ["The exchange delays them", "They only use volume", "They predict the future"], "Longer periods mean more lag.", "trend-following"),
  ];
  return n;
}

/* ---------- 3. Volume breakout from a cup and handle ---------- */
function cupNarrative(): Narrative {
  const mk = (title: string, set: D.BreakoutSet): ChartSide => {
    const res = runBreakout(set.bars, set.pivot, set.handleLow, set.cupDepth, set.fromIndex);
    const c = set.bars.map((b) => b.close); const s50 = sma(c, 20);
    return {
      title, bars: set.bars, result: res, showVolume: true,
      overlays: {
        levels: [{ price: set.pivot, label: `Pivot ${set.pivot}`, tone: "supply" }, { price: set.handleLow, label: `Stop ${set.handleLow}`, tone: "risk" }, { price: set.pivot + set.cupDepth, label: `Target ${set.pivot + set.cupDepth}`, tone: "reward" }],
        trendlines: line(s50, "SMA 20", "neutral"),
        points: tradePoints(res, set.bars),
      },
      pane: null,
      readout: (i) => `Bar ${i + 1}: ${ohlc(set.bars[i]!)} · Vol ${(set.bars[i]!.volume ?? 0).toLocaleString("en-US")} · SMA20 ${f2(s50[i])}`,
    };
  };
  const g = D.cupGood(), w = D.cupWrong();
  const base = {
    id: "cup-breakout",
    title: "Volume breakout from a cup and handle",
    technique: "Breakout buying: enter when price clears the handle's high on a surge in volume, with a stop under the handle.",
    rule: `Buy the first close above the pivot on volume ≥ ${BREAKOUT_RULE.volMult}× the ${BREAKOUT_RULE.avgBars}-bar average. Stop: handle low. Target: pivot + cup depth.`,
    needs: ["A prior uptrend into the cup (it's a continuation pattern)", "A rounded cup and a short handle in its upper half", "Volume drying up in the handle, then expanding on the breakout"],
    right: mk("SIMULATED daily chart: uptrend, cup, quiet handle, breakout on ~3× volume", g),
    wrong: mk("SIMULATED daily chart: the same shape inside a downtrend", w),
    fail: {
      title: "Why it failed: no prior trend to continue",
      why: ["StockCharts: to qualify as a continuation pattern, a prior trend should exist. This base formed after a decline.", "Handle volume stayed heavy, so sellers hadn't dried up.", "The breakout had no follow-through and fell back to the stop: a bull trap."],
      instead: "Check the trend before the base: price above a rising average, a cup that formed after an advance, and a quiet handle.",
    },
    checklist: ["Uptrend before the cup", "Handle in the upper half of the cup, on lighter volume", "Breakout volume well above average", "Stop under the handle, sized before entry"],
    sources: [SRC.cup],
  };
  const n = { ...base, steps: [] as Narrative["steps"], questions: [] as QuizQuestion[] };
  n.steps = steps(base, {
    indicator: "Volume is the indicator here. Watch it shrink while the handle forms, then jump on the breakout bar (StockCharts: there should be a substantial increase in volume on the breakout).",
    signal: "Price closed above the pivot with volume about three times its recent average.",
    wrongWhat: "The breakout bar also had big volume, but the base sat inside a downtrend and price slipped back to the stop.",
  });
  n.questions = [
    mc("TN-05", "Which detail makes a cup-and-handle breakout more trustworthy?", "C", "A prior uptrend, a quiet handle and a volume surge on the break", ["A V-shaped cup after a long decline", "Falling volume on the breakout", "A handle below the cup's midpoint"], "It's a continuation pattern with a volume test."),
    mc("TN-06", "A breakout clears the pivot, then closes back below it the next days with no follow-through. This is…", "A", "A failed breakout (bull trap)", ["A measured move", "A golden cross", "A squeeze"], "Define the stop before entry; failure is part of the plan.", "bull-trap"),
  ];
  return n;
}

/* ---------- 4. VWAP pullbacks on a trend day ---------- */
function vwapNarrative(): Narrative {
  const mk = (title: string, bars: Bar[]): ChartSide => {
    const v = vwap(bars); const res = runVwap(bars);
    return {
      title, bars, result: res, showVolume: true,
      overlays: { trendlines: line(v, "VWAP", "entry"), points: tradePoints(res, bars) },
      pane: null,
      readout: (i) => `${bars[i]!.name} PT: ${ohlc(bars[i]!)} · VWAP ${f2(v[i])}`,
    };
  };
  const base = {
    id: "vwap-pullback",
    title: "VWAP pullbacks on a trend day",
    technique: "Intraday trend continuation: on a day that holds above VWAP, buy dips that tag VWAP and close back above it.",
    rule: "Buy a 5-minute bar whose low touches VWAP and closes above it; exit on the first close below VWAP (or the last bar).",
    needs: ["A trend day: price spends most of the session above VWAP", "Higher lows on each pullback", "Pullbacks that stop at VWAP rather than slicing through it"],
    right: mk("SIMULATED 5-minute chart: a trend day above VWAP", D.vwapTrend()),
    wrong: mk("SIMULATED 5-minute chart: a range day around VWAP", D.vwapRange()),
    fail: {
      title: "Why it failed: VWAP was a magnet, not a floor",
      why: ["On a range day, price crosses VWAP back and forth, so each touch is noise.", "Entries came near the middle of the range and were stopped on the next cross.", "Several small losses added up, before costs."],
      instead: "Before using VWAP as support, check that price has held above it for the first part of the session with higher lows.",
    },
    checklist: ["Price above VWAP for most of the session so far", "Higher lows into VWAP", "A bar closes back above VWAP after the touch", "Exit plan if a bar closes below VWAP"],
    sources: [SRC.vwap],
  };
  const n = { ...base, steps: [] as Narrative["steps"], questions: [] as QuizQuestion[] };
  n.steps = steps(base, {
    indicator: "VWAP is the running total of typical price × volume divided by running volume, reset each session (StockCharts). It's the session's average price, weighted by where the volume traded.",
    signal: "Price pulled back, the bar's low tagged VWAP, and it closed back above: the buy.",
    wrongWhat: "On a range day the same touch-and-close rule fired several times, and price kept falling back through VWAP.",
  });
  n.questions = [
    mc("TN-07", "VWAP pullback entries suit which session?", "B", "A trend day that holds above VWAP with higher lows", ["A range day crossing VWAP repeatedly", "The overnight session only", "Any day with low volume"], "On a range day VWAP is a midpoint, not a floor.", "vwap-pullback"),
    mc("TN-08", "VWAP resets…", "D", "At the start of each trading session", ["Every 14 bars", "Only on earnings days", "Never; it's cumulative forever"], "StockCharts: calculated from the open of a single market day to its close.", "vwap"),
  ];
  return n;
}

/* ---------- 5. MACD bullish divergence ---------- */
function macdNarrative(): Narrative {
  const mk = (title: string, bars: Bar[]): ChartSide => {
    const c = bars.map((b) => b.close); const m = macd(c, MACD_RULE.fast, MACD_RULE.slow, MACD_RULE.signal); const res = runMacdDiv(bars);
    const lows = res.lows;
    return {
      title, bars, result: res, showVolume: false,
      overlays: {
        trendlines: lows ? [{ from: { index: lows[0], price: bars[lows[0]]!.low }, to: { index: lows[1], price: bars[lows[1]]!.low }, label: "Lower low", tone: "risk" }] : [],
        points: tradePoints(res, bars),
      },
      pane: { title: "MACD(12,26,9)", series: [{ values: m.histogram, color: GREY, label: "Histogram", kind: "bar" }, { values: m.macd, color: BLUE, label: "MACD" }, { values: m.signal, color: AMBER, label: "Signal" }], guides: [{ value: 0, label: "0" }] },
      readout: (i) => `Bar ${i + 1}: ${ohlc(bars[i]!)} · MACD ${f2(m.macd[i])} · Signal ${f2(m.signal[i])}`,
    };
  };
  const base = {
    id: "macd-divergence",
    title: "MACD bullish divergence",
    technique: "Momentum divergence: price makes a lower low but MACD makes a higher low, hinting that selling pressure is fading.",
    rule: "After a lower price low with a higher MACD low, buy the first up-close with MACD above its signal line. Stop below the second low.",
    needs: ["A decline that is slowing down, not speeding up", "A clear second low on smaller, overlapping candles", "Room to the upside (a prior resistance to target)"],
    right: mk("SIMULATED daily chart: a fading decline makes a lower low, then turns", D.macdGood()),
    wrong: mk("SIMULATED daily chart: an accelerating downtrend", D.macdWrong()),
    fail: {
      title: "Why it failed: divergence inside a strong trend",
      why: ["StockCharts (RSI): bullish divergences can appear in a strong downtrend, yet the downtrend continues.", "The second leg down came on wide, accelerating candles: momentum was returning, not fading.", "The stop below the second low limited the damage; without it the loss would have kept growing."],
      instead: "Treat divergence as a warning, not an entry, until price confirms (a higher high, a reclaimed level) and the decline is visibly slowing.",
    },
    checklist: ["Decline slowing: smaller candles near the second low", "MACD higher low clearly visible", "Price confirmation (up-close, then a higher high)", "Stop below the second low"],
    sources: [SRC.macd, SRC.rsi],
  };
  const n = { ...base, steps: [] as Narrative["steps"], questions: [] as QuizQuestion[] };
  n.steps = steps(base, {
    indicator: "MACD is the 12-period EMA minus the 26-period EMA; the signal line is a 9-period EMA of MACD (StockCharts). A higher MACD low under a lower price low is a bullish divergence.",
    signal: "The second price low undercut the first, but MACD stayed higher. Then price closed up with MACD above its signal: the buy.",
    wrongWhat: "A divergence showed up here too, but the trend was strong and the next leg down hit the stop.",
  });
  n.questions = [
    mc("TN-09", "A bullish MACD divergence is…", "C", "A lower low in price with a higher low in MACD", ["A higher high in price and MACD", "MACD crossing zero", "Volume doubling"], "It signals fading downside momentum, not a guaranteed turn.", "bullish-divergence"),
    mc("TN-10", "Why are divergences risky in a strong downtrend?", "B", "Several can form while the trend keeps going", ["MACD stops updating", "They only form in uptrends", "They guarantee a gap"], "StockCharts: bullish divergences can appear in a strong downtrend, yet the downtrend continues."),
  ];
  return n;
}

/* ---------- 6. Bollinger squeeze ---------- */
function squeezeNarrative(): Narrative {
  const mk = (title: string, bars: Bar[]): ChartSide => {
    const c = bars.map((b) => b.close); const bb = bollingerBands(c, BB_RULE.period, BB_RULE.k); const bw = bandwidth(c); const res = runSqueeze(bars);
    return {
      title, bars, result: res, showVolume: false,
      overlays: {
        trendlines: [...line(bb.upper, "Upper", "supply"), ...line(bb.middle, "Middle", "neutral"), ...line(bb.lower, "Lower", "demand")],
        points: [...(res.squeezeAt != null ? [{ index: res.squeezeAt, price: bars[res.squeezeAt]!.high, label: "Squeeze", tone: "neutral" as const }] : []), ...tradePoints(res, bars)],
      },
      pane: { title: "BandWidth", series: [{ values: bw.map((v) => (v == null ? null : v * 100)), color: BLUE, label: "BandWidth %" }], guides: [] },
      readout: (i) => `Bar ${i + 1}: ${ohlc(bars[i]!)} · Upper ${f2(bb.upper[i])} · Lower ${f2(bb.lower[i])}`,
    };
  };
  const base = {
    id: "bollinger-squeeze",
    title: "Bollinger Band squeeze breakout",
    technique: "Volatility expansion: after the bands pinch together, buy the first close above the upper band and ride it while price stays above the middle band.",
    rule: `Squeeze = BandWidth below ${Math.round(BB_RULE.squeezeRatio * 100)}% of its ${BB_RULE.lookback}-bar high. Then buy a close above the upper band; exit on a close below the middle band.`,
    needs: ["A real contraction: tiny candles and flat, tight bands", "A break with follow-through: consecutive closes outside the band", "Bands widening as the move starts"],
    right: mk("SIMULATED daily chart: volatility, a tight squeeze, then an upside expansion", D.squeezeGood()),
    wrong: mk("SIMULATED daily chart: the same squeeze, then a head fake", D.squeezeWrong()),
    fail: {
      title: "Why it failed: the head fake",
      why: ["StockCharts: Bollinger warns of the head fake, when price breaks a band then suddenly reverses, like a bull or bear trap.", "The squeeze only says a big move is coming, not which way.", "The exit on a close below the middle band kept the loss small."],
      instead: "Wait for follow-through (a second close outside the band, or a retest that holds) and keep the middle-band exit.",
    },
    checklist: ["BandWidth near its lowest in months", "Break close outside the band, then follow-through", "Exit rule set before entry (middle band)", "Expect head fakes; size small"],
    sources: [SRC.squeeze],
  };
  const n = { ...base, steps: [] as Narrative["steps"], questions: [] as QuizQuestion[] };
  n.steps = steps(base, {
    indicator: "Bollinger Bands are a 20-period SMA ± 2 standard deviations; BandWidth is the distance between the bands. Low BandWidth means volatility has contracted, which often comes before a big move (StockCharts).",
    signal: "After the squeeze, price closed above the upper band and the bands began to widen: the buy.",
    wrongWhat: "The squeeze and the upside break looked the same, but price reversed straight back inside the bands.",
  });
  n.questions = [
    mc("TN-11", "A Bollinger squeeze tells you…", "A", "Volatility is low and a larger move may follow, direction unknown", ["Price will break upward", "The trend has ended", "Volume will fall"], "StockCharts: low volatility is often followed by high volatility.", "bollinger-squeeze"),
    mc("TN-12", "Price breaks above the upper band after a squeeze, then reverses below the middle band. That is…", "D", "A head fake", ["A golden cross", "A measured move", "A bullish divergence"], "Bollinger's term; plan the exit before entry."),
  ];
  return n;
}

export const NARRATIVES: Narrative[] = [rsiNarrative(), maNarrative(), cupNarrative(), vwapNarrative(), macdNarrative(), squeezeNarrative()];
export function narrativeById(id: string): Narrative | undefined {
  return NARRATIVES.find((n) => n.id === id);
}

export const GENERAL_QUESTIONS: QuizQuestion[] = [
  mc("TN-13", "The main lesson of these narratives is…", "B", "Match the technique to the chart: trend tools on trends, range tools on ranges", ["Any indicator works on any chart", "More indicators guarantee profits", "Only RSI matters"], "Every technique failed on the wrong kind of chart."),
  mc("TN-14", "Before applying a technique, what should you check first?", "C", "The chart's context: trending, ranging, compressing or expanding", ["Yesterday's news headline only", "The indicator's colour", "How many followers recommend it"], "Context first, then the trigger, then risk."),
];

export const NARRATIVE_QUESTIONS: QuizQuestion[] = [...NARRATIVES.flatMap((n) => n.questions), ...GENERAL_QUESTIONS];

export const NARRATIVE_TERMS: LiteracyTerm[] = [
  { id: "mean-reversion", name: "Mean reversion", category: "process", summary: "Betting that price returns toward an average or the middle of a range after stretching away.", detail: "Works best in sideways ranges. In a strong trend, 'stretched' can stay stretched, so mean-reversion entries keep losing. Educational, not advice." },
  { id: "trend-following", name: "Trend following", category: "process", summary: "Joining a move in its direction and staying in until the trend breaks.", detail: "Moving-average crossovers are a classic trend-following rule. They lag and produce whipsaws in ranges, so they need a trending chart. Educational, not advice." },
  { id: "whipsaw", name: "Whipsaw", category: "process", summary: "A signal that quickly reverses, forcing an exit at a loss, often repeatedly.", detail: "Common when trend signals (crossovers, breakouts) fire in a choppy range. StockCharts: a crossover system produces many whipsaws when there is no strong trend. Educational, not advice." },
  { id: "bullish-divergence", name: "Bullish divergence", category: "process", summary: "Price makes a lower low while a momentum indicator (MACD, RSI) makes a higher low.", detail: "A warning that downside momentum is fading, not a buy by itself. In strong downtrends several divergences can form before any turn. Educational, not advice." },
  { id: "bollinger-squeeze", name: "Bollinger squeeze", category: "process", summary: "Bollinger Bands contracting to a narrow width, signalling low volatility.", detail: "Low volatility often precedes a larger move, but the squeeze doesn't tell you the direction. Watch for head fakes: a band break that reverses. Educational, not advice." },
  { id: "bull-trap", name: "Bull trap", category: "process", summary: "An upside breakout that fails and falls back below the level it broke, trapping buyers.", detail: "The mirror is a bear trap: a breakdown that reverses back above support. Define invalidation before entry so a failed break is a small, planned loss. Educational, not advice." },
  { id: "vwap-pullback", name: "VWAP pullback", category: "process", summary: "An intraday entry when price dips to VWAP on a trend day and closes back above it.", detail: "Needs a session that has held above VWAP with higher lows. On range days VWAP acts as a midpoint and the entries get chopped up. Educational, not advice." },
];
