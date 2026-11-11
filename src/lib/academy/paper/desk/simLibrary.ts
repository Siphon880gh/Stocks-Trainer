/**
 * Library of SIMULATED desk scenarios, one trading / investing topic each. Fictional ".S" companies; prices come
 * from simGen.ts (seeded, deterministic), statements from quarterSeries (they tie out), headlines are invented for
 * practice. Every item is SIMULATED and tagged so in the UI. Scripted gaps follow the news that causes them
 * (published after the prior close), so nothing is known before it happens.
 */
import type { PaperOptions } from "../types";
import { genSymbol, quarterSeries, type CompanyStart, type PathSpec, type QuarterInput } from "./simGen";
import type { DeskDividend, DeskGoal, DeskNewsKind, DeskScenario, DeskStatement, DeskTopicId } from "./types";

type News = [symbol: string, bar: number, kind: DeskNewsKind, headline: string, summary: string];

interface SimDef {
  id: string;
  topic: DeskTopicId;
  title: string;
  description: string;
  lesson: string;
  learn: string[];
  goals: DeskGoal[];
  debrief: { signals: string[]; plan: string[] };
  terms: string[];
  prompts?: string[];
  options?: PaperOptions;
  len?: number;
  paths: PathSpec[];
  news: News[];
  statements?: Record<string, DeskStatement[]>;
  dividends?: DeskDividend[];
}

const WIRE = "SIMULATED desk wire";

function sim(d: SimDef): DeskScenario {
  const len = d.len ?? 60;
  return {
    id: d.id,
    title: `${d.title} (SIMULATED)`,
    kind: "simulated",
    topic: d.topic,
    description: d.description,
    lesson: d.lesson,
    learn: d.learn,
    goals: d.goals,
    debrief: d.debrief,
    terms: d.terms,
    prompts: d.prompts,
    options: d.options,
    dividends: d.dividends,
    labels: Array.from({ length: len }, (_, i) => `D${i + 1}`),
    symbols: d.paths.map((p) => genSymbol(d.id, p, len)),
    news: d.news.map(([symbol, bar, kind, headline, summary], i) => ({ id: `${d.id}-${i}`, symbol, bar, kind, headline, summary, source: WIRE, simulated: true })),
    statements: d.statements ?? {},
    sourceNote: "SIMULATED: fictional companies, generated prices, invented headlines and statements for practice only.",
  };
}

const co = (cash: number, otherAssets: number, debt: number, otherLiabilities: number, shares: number): CompanyStart => ({ cash, otherAssets, debt, otherLiabilities, shares });
const M = 1_000_000;
const q = (bar: number, period: string, revenue: number, grossMargin: number, opMargin: number, extra: Partial<QuarterInput> = {}): QuarterInput => ({ bar, period, revenue, grossMargin, opMargin, ...extra });

const STOP: DeskGoal = { kind: "stopOnEntries", text: "Every entry has a protective stop working by the end of its first day" };
const RISK1: DeskGoal = { kind: "maxRiskPct", pct: 1, text: "Plan no more than 1% of starting cash of risk per trade (entry to stop × shares)" };
const DD8: DeskGoal = { kind: "maxDrawdown", pct: 8, text: "Keep the account's drawdown under 8%" };
const POS: DeskGoal = { kind: "positive", text: "Finish with at least the equity you started with (sitting out counts)" };

export const SIM_LIBRARY: DeskScenario[] = [
  // ---------------- Earnings & guidance ----------------
  sim({
    id: "sim-earnings-miss",
    topic: "earnings",
    title: "Miss and drift",
    description: "A robotics maker misses estimates and cuts its outlook. The gap is only the start.",
    lesson: "After a big miss, prices often keep drifting the same way for weeks (post-earnings drift). Do not buy the first bounce.",
    learn: ["Read a miss in revenue, margin and guidance", "See post-earnings drift after a gap down", "Wait for a base instead of catching the knife"],
    goals: [STOP, RISK1, { kind: "flatAt", bar: 30, symbol: "KLNR.S", text: "Be flat KLNR.S at the D31 close (no position through the report)" }],
    debrief: {
      signals: ["The D26 industry survey flagged slowing orders: a known risk into the report.", "The D31 print missed revenue (−6% vs last quarter) and gross margin fell 5 points; guidance was cut.", "The gap held: bounces in the next weeks made lower highs."],
      plan: ["Stay flat through the report, or size so a 15% gap costs under 1% of the account.", "After the gap: a short only below the gap-day low with a stop above the gap open, or wait.", "A long only after a higher low and a close above the gap-day high."],
    },
    terms: ["earnings-surprise", "guidance-raise-cut", "post-earnings-drift", "earnings-gap"],
    paths: [
      { symbol: "KLNR.S", name: "Kelnor Robotics", start: 64, drift: 0.001, vol: 0.014, gaps: [[31, -14]], segments: [[31, -0.004, 0.02], [48, -0.001, 0.015]], volume: 3_000_000 },
      { symbol: "BMKT.S", name: "Broad Market Fund", start: 410, drift: 0.0006, vol: 0.007, volume: 40_000_000 },
    ],
    news: [
      ["KLNR.S", 12, "company", "Kelnor Robotics will report after the close on D31", "Consensus expects revenue near last quarter's $520M."],
      ["KLNR.S", 25, "company", "Industry survey: factory robot orders slow for a second month", "Customers are delaying projects. Kelnor sells into the same factories."],
      ["KLNR.S", 30, "earnings", "Kelnor Robotics misses on revenue and cuts its full-year outlook", "Revenue $489M vs about $520M expected; gross margin 34% vs 39%; outlook lowered. Published after the close."],
      ["KLNR.S", 30, "filing", "Kelnor Robotics files its quarterly report", "The statements are on the Financials tab."],
      ["KLNR.S", 44, "company", "Two analysts cut Kelnor price targets after the miss", "Estimates for next year fall about 12%."],
    ],
    statements: {
      "KLNR.S": quarterSeries(co(310 * M, 1_900 * M, 600 * M, 420 * M, 80 * M), [
        q(-1, "Q1", 520 * M, 0.39, 0.12, { interest: 8 * M }),
        q(30, "Q2", 489 * M, 0.34, 0.06, { interest: 8 * M, wc: -25 * M }),
      ]),
    },
  }),
  sim({
    id: "sim-sell-the-news",
    topic: "earnings",
    title: "Beat, then sell the news",
    description: "An apparel brand rallies into earnings, beats, and still gaps down on a soft outlook.",
    lesson: "A run-up prices in good news. A beat with weaker guidance can fall: the market trades the next quarter, not the last one.",
    learn: ["Separate the result from the guidance", "Recognise a pre-earnings run-up as risk", "Take profits before an event if the plan said so"],
    goals: [STOP, { kind: "flatAt", bar: 34, symbol: "BRVA.S", text: "Be flat BRVA.S at the D35 close" }, POS],
    debrief: {
      signals: ["BRVA.S rose about 15% in the weeks before the report: much good news was priced in.", "The D35 print beat on EPS, but next-quarter guidance was below the old forecast.", "The gap down came on heavy volume and the stock did not reclaim it."],
      plan: ["A long from the early run-up with a trailing stop, sold before the report.", "No new long into the report after a 15% run.", "After the gap: no trade until a base forms."],
    },
    terms: ["priced-in", "buy-the-rumor", "guidance", "earnings-surprise"],
    paths: [{ symbol: "BRVA.S", name: "Bravara Apparel", start: 38, drift: 0.006, vol: 0.013, segments: [[35, -0.002, 0.018]], gaps: [[35, -9]], volume: 2_500_000 }],
    news: [
      ["BRVA.S", 11, "company", "Bravara Apparel will report after the close on D35", "Shares are up on strong holiday traffic data."],
      ["BRVA.S", 20, "company", "Card-spending data shows Bravara store traffic up 9%", "Investors expect a beat. Expectations are rising with the price."],
      ["BRVA.S", 34, "earnings", "Bravara beats on EPS but guides next quarter below forecasts", "EPS above estimates; next-quarter revenue outlook 4% below the old forecast as discounting rises. Published after the close."],
      ["BRVA.S", 34, "filing", "Bravara Apparel files its quarterly report", "Inventory grew faster than sales: see the working-capital hit in operating cash flow."],
    ],
    statements: {
      "BRVA.S": quarterSeries(co(150 * M, 900 * M, 200 * M, 260 * M, 60 * M), [
        q(-1, "Q3", 610 * M, 0.52, 0.1, { interest: 3 * M }),
        q(34, "Q4", 700 * M, 0.5, 0.089, { interest: 3 * M, wc: -60 * M, note: "Inventory up 22% year over year." }),
      ]),
    },
  }),

  // ---------------- Trends & ranges ----------------
  sim({
    id: "sim-bull-trend",
    topic: "trend",
    title: "Ride a bull trend",
    description: "A health company climbs for three months with orderly pullbacks.",
    lesson: "In an uptrend, buy pullbacks to support and let a trailing stop do the selling. Do not sell a trend just because it is 'up a lot'.",
    learn: ["Buy a pullback, not a breakout chase", "Trail a stop under higher lows", "Let winners run with a rule"],
    goals: [STOP, { kind: "usedType", type: "trailing-stop", text: "Exit or protect with a trailing stop" }, POS],
    debrief: {
      signals: ["Each quarter's revenue grew and margins widened: the trend had fundamental support.", "Pullbacks held above the prior swing lows."],
      plan: ["Buy a pullback (a limit near the last higher low), stop under that low.", "Switch to a trailing stop once the trade is 1R in profit.", "Add only on a new pullback, never after a big up day."],
    },
    terms: ["trend-vs-range", "trailing-stop", "trend-following", "support-resistance"],
    paths: [{ symbol: "ASCN.S", name: "Ascendia Health", start: 52, drift: 0.0045, vol: 0.013, volume: 1_800_000 }],
    news: [
      ["ASCN.S", 14, "company", "Ascendia Health opens 12 new clinics ahead of plan", "Patient visits rise 18% year over year."],
      ["ASCN.S", 29, "earnings", "Ascendia Health beats estimates for the fourth straight quarter", "Revenue up 10%; operating margin widens to 14%."],
      ["ASCN.S", 29, "filing", "Ascendia Health files its quarterly report", "The statements are on the Financials tab."],
      ["ASCN.S", 47, "company", "Ascendia raises its full-year outlook", "Management lifts revenue guidance by 3%."],
    ],
    statements: {
      "ASCN.S": quarterSeries(co(240 * M, 1_300 * M, 350 * M, 300 * M, 70 * M), [q(-1, "Q2", 400 * M, 0.42, 0.12, { interest: 4 * M }), q(29, "Q3", 440 * M, 0.43, 0.14, { interest: 4 * M })]),
    },
  }),
  sim({
    id: "sim-bear-trend",
    topic: "trend",
    title: "Don't fight a bear trend",
    description: "A telecom grinds lower: every rally fails below the last high.",
    lesson: "'Cheap' keeps getting cheaper in a downtrend. Averaging down without a stop turns a small loss into a large one.",
    learn: ["Spot lower highs and lower lows", "Avoid averaging down", "Use a stop or stay out"],
    goals: [STOP, DD8, { kind: "maxTrades", n: 4, text: "Take four trades or fewer (no revenge trading)" }],
    debrief: {
      signals: ["Revenue fell and debt rose while margins shrank.", "The dividend-cut report on D25 and the confirmed cut on D42 each started a new leg down."],
      plan: ["No long while the stock made lower highs.", "If you bought, a stop under the last low: one small loss, then stand aside.", "With shorting on: sell a failed rally with a buy stop above its high."],
    },
    terms: ["trend-vs-range", "loss-aversion", "drawdown", "stop-order"],
    paths: [{ symbol: "DCLN.S", name: "Declinor Telecom", start: 30, drift: -0.004, vol: 0.014, gaps: [[25, -5], [42, -8]], volume: 6_000_000 }],
    news: [
      ["DCLN.S", 15, "company", "Declinor loses a large government contract", "The contract was about 6% of revenue."],
      ["DCLN.S", 24, "company", "Report: Declinor board weighs a dividend cut to protect cash", "A cut would be the first in ten years. Published after the close."],
      ["DCLN.S", 41, "company", "Declinor cuts its dividend by 60% and lowers its outlook", "Management says cash is needed for debt payments. Announced after the close."],
      ["DCLN.S", 41, "filing", "Declinor files its quarterly report", "Debt is up: see the balance sheet."],
    ],
    statements: {
      "DCLN.S": quarterSeries(co(420 * M, 5_200 * M, 3_100 * M, 900 * M, 500 * M), [
        q(-1, "Q2", 1_500 * M, 0.48, 0.08, { interest: 45 * M, dividends: 75 * M, capex: 160 * M }),
        q(41, "Q3", 1_430 * M, 0.46, 0.05, { interest: 48 * M, dividends: 75 * M, capex: 170 * M, debtChange: 100 * M }),
      ]),
    },
  }),
  sim({
    id: "sim-range-chop",
    topic: "trend",
    title: "Trade the range, skip the chop",
    description: "A paper maker swings between about $30 and $34 with no news worth trading.",
    lesson: "In a range, the edges are the trade: buy near support with a limit, sell near resistance. In the middle there is no edge.",
    learn: ["Mark support and resistance", "Use limit orders at the edges", "Avoid trading the middle of a range"],
    goals: [{ kind: "usedType", type: "limit", text: "Enter or exit with a limit order at a range edge" }, STOP, { kind: "maxTrades", n: 6, text: "Six trades or fewer" }],
    debrief: {
      signals: ["Nothing in the news changed the business; the in-line quarter on D34 confirmed it.", "Touches of $30 and $34 reversed within a few days."],
      plan: ["Buy limits just above $30 with a stop below $29.50, targets near $33.70.", "No trades between $31 and $33.", "A close well outside the range ends the plan."],
    },
    terms: ["support-resistance", "trend-vs-range", "mean-reversion", "whipsaw"],
    paths: [{ symbol: "PLTO.S", name: "Plateau Paper", start: 32, vol: 0.013, range: [30, 34], volume: 900_000 }],
    news: [
      ["PLTO.S", 18, "company", "Plateau Paper keeps prices unchanged for next quarter", "No change to the outlook."],
      ["PLTO.S", 33, "earnings", "Plateau Paper reports in-line results", "Revenue and EPS match estimates; outlook reaffirmed."],
      ["PLTO.S", 33, "filing", "Plateau Paper files its quarterly report", "Steady margins, steady cash."],
    ],
    statements: { "PLTO.S": quarterSeries(co(90 * M, 700 * M, 250 * M, 120 * M, 30 * M), [q(-1, "Q1", 230 * M, 0.24, 0.09, { interest: 3 * M }), q(33, "Q2", 232 * M, 0.24, 0.09, { interest: 3 * M })]) },
  }),

  // ---------------- Breakouts & gaps ----------------
  sim({
    id: "sim-breakout-vs-fail",
    topic: "breakouts",
    title: "Breakout or fakeout?",
    description: "Two stocks break above a range in the same week. One keeps going; one falls back in.",
    lesson: "A breakout is confirmed by closes and volume beyond the level. A close back inside the range invalidates it: exit.",
    learn: ["Wait for a close beyond the level", "Use the range as the stop for a breakout", "Exit a failed breakout fast"],
    goals: [STOP, RISK1, { kind: "maxDrawdown", pct: 5, text: "Keep drawdown under 5%" }],
    debrief: {
      signals: ["LFTX.S broke out on a new contract (news) and heavy volume, then held above the old range.", "FKOT.S rose above its range on no news, then fell back inside within days."],
      plan: ["Buy LFTX.S on a retest of the old range high, stop back inside the range.", "If you bought FKOT.S's breakout: the first close back inside was the exit.", "Same entry rule, very different outcomes: the stop keeps the loser small."],
    },
    terms: ["breakout-retest", "bull-trap", "volume-spike", "support-resistance"],
    paths: [
      { symbol: "LFTX.S", name: "Liftrix Labs", start: 24, vol: 0.012, range: [23, 25.5, 0, 28], gaps: [[29, 6]], segments: [[29, 0.004, 0.015]], volume: 1_500_000 },
      { symbol: "FKOT.S", name: "Fakeout Freight", start: 41, vol: 0.012, range: [39, 43, 0, 27], segments: [[28, 0.012, 0.01], [32, -0.012, 0.016], [36, -0.002, 0.014]], volume: 1_100_000 },
    ],
    news: [
      ["LFTX.S", 28, "company", "Liftrix Labs wins a multi-year lab-automation contract", "The contract roughly doubles its order book. Announced after the close."],
      ["FKOT.S", 30, "company", "Freight volumes flat for the month, industry data shows", "Nothing new for Fakeout Freight."],
    ],
    statements: {
      "LFTX.S": quarterSeries(co(80 * M, 300 * M, 60 * M, 70 * M, 40 * M), [q(-1, "Q2", 95 * M, 0.55, 0.11)]),
      "FKOT.S": quarterSeries(co(60 * M, 800 * M, 300 * M, 150 * M, 25 * M), [q(-1, "Q2", 410 * M, 0.18, 0.05, { interest: 5 * M })]),
    },
  }),
  sim({
    id: "sim-gap-go-vs-fill",
    topic: "breakouts",
    title: "Gap and go vs gap fill",
    description: "Two gaps up on the same day: one on real news that keeps running, one on a rumour that fills.",
    lesson: "Gaps on material news (earnings, contracts) tend to hold; gaps on rumours often fill back to the prior close.",
    learn: ["Ask what caused the gap", "Use the gap-day low as a line in the sand", "Do not chase a rumour gap"],
    goals: [STOP, RISK1],
    debrief: {
      signals: ["JMPR.S gapped on a raised outlook (a reported fact) and held above the gap-day low.", "FLLR.S gapped on an unconfirmed takeover rumour; the company's 'no comment' on D27 came before the fill."],
      plan: ["JMPR.S: buy above the first-day high, stop under the gap-day low.", "FLLR.S: no long on a rumour; the gap filled within a week."],
    },
    terms: ["gap-types", "rumor-vs-filing", "breakaway-gap", "common-gap"],
    paths: [
      { symbol: "JMPR.S", name: "Jumper Networks", start: 44, drift: 0.001, vol: 0.012, gaps: [[25, 11]], segments: [[25, 0.004, 0.016]], volume: 2_200_000 },
      { symbol: "FLLR.S", name: "Filler Foods", start: 27, drift: 0, vol: 0.011, gaps: [[25, 8]], segments: [[25, -0.012, 0.014], [32, 0, 0.011]], volume: 1_300_000 },
    ],
    news: [
      ["JMPR.S", 24, "earnings", "Jumper Networks raises its full-year outlook on data-centre orders", "Revenue guidance up 8%; backlog at a record. Published after the close."],
      ["JMPR.S", 24, "filing", "Jumper Networks files its quarterly report", "Revenue up 15% on the prior quarter."],
      ["FLLR.S", 24, "company", "Rumour: a large grocer is looking at buying Filler Foods", "Unconfirmed; no filing or statement from either company. Circulated after the close."],
      ["FLLR.S", 26, "company", "Filler Foods: 'we do not comment on market rumours'", "No deal has been announced."],
    ],
    statements: {
      "JMPR.S": quarterSeries(co(200 * M, 700 * M, 150 * M, 120 * M, 50 * M), [q(-1, "Q2", 300 * M, 0.6, 0.18, { interest: 2 * M }), q(24, "Q3", 345 * M, 0.61, 0.2, { interest: 2 * M })]),
      "FLLR.S": quarterSeries(co(40 * M, 500 * M, 200 * M, 90 * M, 30 * M), [q(-1, "Q2", 310 * M, 0.22, 0.05, { interest: 3 * M })]),
    },
  }),

  // ---------------- Volatility & squeezes ----------------
  sim({
    id: "sim-flash-crash",
    topic: "volatility",
    title: "Flash crash day",
    description: "A sudden market-wide plunge and recovery inside one session hits every stop below the market.",
    lesson: "A stop order becomes a market order when touched, so in a flash crash it fills near the low. A stop-limit avoids the worst fill but may not fill at all.",
    learn: ["See how stops fill in a disorderly market", "Compare stop and stop-limit behaviour", "Know trading pauses and circuit breakers exist"],
    goals: [STOP, { kind: "usedType", type: "stop-limit", text: "Protect at least one position with a stop-limit" }, DD8],
    debrief: {
      signals: ["Nothing in the news before D31 warned of the drop: this is the risk you cannot read in advance.", "The D31 wire explained it after the fact: a burst of automated selling and thin bids, then a rebound by the close."],
      plan: ["Size so even a stop filled at the day's low costs little.", "A stop-limit with a limit a few percent below the stop avoids the panic fill, at the price of maybe staying in.", "After a flash crash, re-enter only on your plan, not on the rebound."],
    },
    terms: ["stop-order", "stop-limit-order", "luld", "circuit-breaker"],
    paths: [
      { symbol: "BMKT.S", name: "Broad Market Fund", start: 420, drift: 0.0008, vol: 0.006, shocks: [[30, 7, -1.2]], volume: 50_000_000 },
      { symbol: "NMBC.S", name: "Nimbus Cloud", start: 95, drift: 0.0015, vol: 0.016, shocks: [[30, 16, -2.5]], volume: 4_000_000 },
      { symbol: "STDP.S", name: "Steadyline Power", start: 61, drift: 0.0004, vol: 0.007, shocks: [[30, 9, -0.8]], volume: 2_000_000 },
    ],
    news: [
      ["", 20, "market", "Volatility near multi-year lows; strategists warn of complacency", "Low volatility can end suddenly."],
      ["", 30, "market", "Market plunges then recovers in minutes; exchanges review trades", "Automated selling met thin bids. Several stocks paused under volatility limits. Most of the drop was recovered by the close."],
      ["", 33, "market", "Regulators review stop orders filled during the plunge", "Stops placed below the market filled far below their stop prices."],
    ],
  }),
  sim({
    id: "sim-short-squeeze",
    topic: "volatility",
    title: "Short squeeze",
    description: "A heavily shorted game maker reports a surprise profit and shorts rush to buy back.",
    lesson: "A short's loss has no cap. With high short interest, good news can force buy-to-cover orders that push the price far past fair value, then collapse.",
    learn: ["Read short interest and days to cover", "Protect a short with a buy stop", "Don't chase the top of a squeeze"],
    goals: [STOP, RISK1, { kind: "maxDrawdown", pct: 6, text: "Keep drawdown under 6%" }],
    options: { allowShort: true },
    debrief: {
      signals: ["D13: short interest 38% of float and 7 days to cover: fuel for a squeeze.", "D22: a surprise profit was the spark; volume jumped.", "D35: the company sold new shares into the spike, which ended it."],
      plan: ["If short before the report: a buy stop above resistance caps the loss, though the gap can jump it.", "No long chase after a 50% run; the share sale reversed it.", "A short only after the squeeze failed (the D36 gap down), stop above the high."],
    },
    terms: ["short-squeeze", "short-interest", "days-to-cover", "public-float"],
    paths: [{ symbol: "SQZE.S", name: "Squeezle Games", start: 14, drift: -0.002, vol: 0.02, gaps: [[22, 19], [35, -16]], segments: [[22, 0.035, 0.05], [30, 0.01, 0.06], [35, -0.02, 0.04], [45, -0.004, 0.03]], volume: 5_000_000 }],
    news: [
      ["SQZE.S", 12, "company", "Squeezle Games short interest reaches 38% of float", "About 7 days of average volume to cover. Many traders are betting on a fall."],
      ["SQZE.S", 21, "earnings", "Squeezle Games posts a surprise quarterly profit", "A hit game lifts revenue 70%; the company had guided to a loss. Published after the close."],
      ["SQZE.S", 21, "filing", "Squeezle Games files its quarterly report", "First profit in two years."],
      ["SQZE.S", 34, "company", "Squeezle Games sells 15 million new shares into the rally", "The offering raises cash and adds supply. Announced after the close."],
    ],
    statements: {
      "SQZE.S": quarterSeries(co(30 * M, 160 * M, 40 * M, 50 * M, 60 * M), [
        q(-1, "Q1", 52 * M, 0.5, -0.12, { interest: 1 * M }),
        q(21, "Q2", 88 * M, 0.6, 0.16, { interest: 1 * M }),
      ]),
    },
  }),

  // ---------------- Corporate actions ----------------
  sim({
    id: "sim-dividend",
    topic: "corporate",
    title: "Dividend and the ex-date drop",
    description: "A utility declares a special dividend. On the ex-date the price opens lower by about the dividend.",
    lesson: "On the ex-dividend date the price drops by roughly the dividend because new buyers no longer get it. Holders at the prior close receive the cash, so their total value barely changes.",
    learn: ["Know the declaration and ex-dividend dates", "See why the ex-date gap is not a loss for holders", "Avoid 'dividend capture' that ignores the drop"],
    goals: [{ kind: "traded", symbol: "DVDN.S", text: "Trade DVDN.S, ideally holding it at the D30 close to receive the dividend" }, POS],
    dividends: [{ symbol: "DVDN.S", exBar: 30, cents: 240 }],
    debrief: {
      signals: ["D21: the board declared a $2.40 special dividend (about 5% of the price).", "D30: last day to buy and receive it. D31 opened about $2.40 lower, and holders' cash rose by $2.40 a share."],
      plan: ["Holding through the ex-date: price drop + dividend ≈ no change. That is the lesson.", "Buying the day before only to sell after does not create value; costs and taxes make it worse."],
    },
    terms: ["dividend", "ex-dividend-date", "adjusted-prices", "free-cash-flow"],
    paths: [{ symbol: "DVDN.S", name: "Dividon Utilities", start: 48, drift: 0.0005, vol: 0.007, gaps: [[30, -5]], volume: 1_200_000 }],
    news: [
      ["DVDN.S", 20, "company", "Dividon Utilities declares a $2.40 special dividend", "Ex-dividend on D31; paid to holders at the D30 close. Funded by an asset sale."],
      ["DVDN.S", 29, "company", "Dividon goes ex-dividend tomorrow", "Shares bought from tomorrow's open do not receive the $2.40."],
    ],
    statements: {
      "DVDN.S": quarterSeries(co(320 * M, 4_200 * M, 2_100 * M, 800 * M, 100 * M), [
        q(-1, "Q2", 600 * M, 0.4, 0.2, { interest: 25 * M, dividends: 60 * M, capex: 90 * M }),
        q(45, "Q3", 610 * M, 0.4, 0.2, { interest: 25 * M, dividends: 300 * M, capex: 90 * M, note: "Includes the $2.40 special dividend paid this quarter." }),
      ]),
    },
  }),
  sim({
    id: "sim-stock-split",
    topic: "corporate",
    title: "Stock split",
    description: "A chip maker announces a 4-for-1 split. The chart shows split-adjusted prices, as charting platforms do.",
    lesson: "A split changes the share count and the price, not the value of the company. EPS divides by the split ratio. Any pop on the announcement is sentiment.",
    learn: ["Read split-adjusted prices and EPS", "Separate a split from a change in value", "Check the share count in filings"],
    goals: [STOP, POS],
    debrief: {
      signals: ["D19: the 4-for-1 split announcement lifted the price on enthusiasm, not new earnings.", "The D41 filing shows 4× the shares and about a quarter of the EPS on similar net income."],
      plan: ["Trade the chart as usual: the adjusted history has no gap from the split itself.", "Judge value on net income and cash flow, which the split does not change."],
    },
    terms: ["stock-split", "adjusted-prices", "eps", "pe-ratio"],
    paths: [{ symbol: "SPLT.S", name: "Splitwell Chips", start: 820, drift: 0.002, vol: 0.016, gaps: [[19, 4]], adjust: 4, volume: 900_000 }],
    news: [
      ["SPLT.S", 18, "company", "Splitwell Chips announces a 4-for-1 stock split", "Each share becomes four from D36. Prices on this chart are split-adjusted, so the split itself leaves no gap. Announced after the close."],
      ["SPLT.S", 34, "company", "Splitwell's 4-for-1 split takes effect at tomorrow's open", "Holders will see four times the shares at a quarter of the price."],
      ["SPLT.S", 40, "filing", "Splitwell Chips files its quarterly report", "Share count and EPS reflect the split."],
    ],
    statements: {
      "SPLT.S": [
        ...quarterSeries(co(900 * M, 4_000 * M, 500 * M, 600 * M, 50 * M), [q(-1, "Q2", 1_200 * M, 0.6, 0.3, { interest: 5 * M })], "pre-split"),
        ...quarterSeries(co(900 * M, 4_000 * M, 500 * M, 600 * M, 200 * M), [q(40, "Q3", 1_250 * M, 0.6, 0.3, { interest: 5 * M, note: "After the 4-for-1 split: 4× the shares, EPS ÷ 4." })], "post-split"),
      ],
    },
  }),
  sim({
    id: "sim-secondary-offering",
    topic: "corporate",
    title: "Secondary offering and dilution",
    description: "A biotech sells new shares at a discount. The price falls to the offering price and losses are spread over more shares.",
    lesson: "New shares dilute existing holders. An offering priced below the market usually pulls the price toward the offer.",
    learn: ["Read an offering's size and discount", "See dilution in the share count", "Treat cash runway as the reason companies raise"],
    goals: [STOP, RISK1],
    debrief: {
      signals: ["D15 filing: about five quarters of cash left at the burn rate, a hint that a raise was coming.", "D28 after the close: 20% more shares at a 9% discount; D29 opened near the offer price.", "The D46 filing shows the extra cash and 20% more shares."],
      plan: ["No long into a short cash runway without a plan for the raise.", "After the offer, the offer price often acts as support: a long there with a stop below is a defined-risk idea."],
    },
    terms: ["dilution", "follow-on-offering", "cash-runway", "cash-burn"],
    paths: [{ symbol: "DLTN.S", name: "Dilutia Bio", start: 22, drift: 0.002, vol: 0.022, gaps: [[28, -10]], segments: [[28, 0.0005, 0.02]], volume: 3_000_000 }],
    news: [
      ["DLTN.S", 14, "filing", "Dilutia Bio files its quarterly report", "Cash about $210M; quarterly cash burn about $40M."],
      ["DLTN.S", 27, "company", "Dilutia Bio sells 16 million new shares at a 9% discount", "About 20% more shares. Priced after the close."],
      ["DLTN.S", 45, "filing", "Dilutia Bio files its next quarterly report", "Cash rose with the offering; the share count is 20% higher."],
    ],
    statements: {
      "DLTN.S": quarterSeries(co(252 * M, 120 * M, 20 * M, 30 * M, 80 * M), [
        q(14, "Q2", 6 * M, 0.8, -6.5, { da: 1 * M, capex: 1 * M }),
        q(45, "Q3", 7 * M, 0.8, -6, { da: 1 * M, capex: 1 * M, stockIssued: 312 * M, sharesChange: 16 * M }),
      ]),
    },
  }),
  sim({
    id: "sim-buyback",
    topic: "corporate",
    title: "Buybacks and EPS",
    description: "A consumer brand buys back shares every quarter. Net income is flat; EPS rises.",
    lesson: "A buyback reduces the share count, so EPS can grow without profit growth. Check whether it is funded by cash flow or by new debt.",
    learn: ["Separate EPS growth from net-income growth", "See buybacks in financing cash flow", "Check how a buyback is funded"],
    goals: [STOP, POS],
    debrief: {
      signals: ["Net income was about flat across the two quarters; EPS rose because shares fell.", "The buyback was funded partly with new debt (see the financing line and debt)."],
      plan: ["A slow grind like this suits a small position with a wide trailing stop.", "Debt-funded buybacks raise risk: watch interest coverage."],
    },
    terms: ["share-buyback", "eps", "net-debt", "interest-coverage"],
    paths: [{ symbol: "RTRO.S", name: "Retiro Brands", start: 71, drift: 0.0018, vol: 0.008, gaps: [[16, 3]], volume: 1_400_000 }],
    news: [
      ["RTRO.S", 15, "company", "Retiro Brands authorizes a $2 billion share buyback", "About 9% of the company at today's price, over two years. Announced after the close."],
      ["RTRO.S", 32, "earnings", "Retiro Brands EPS rises on flat net income", "Fewer shares outstanding after buybacks."],
      ["RTRO.S", 32, "filing", "Retiro Brands files its quarterly report", "Buybacks and new debt are in the financing section."],
    ],
    statements: {
      "RTRO.S": quarterSeries(co(600 * M, 6_000 * M, 2_500 * M, 1_100 * M, 280 * M), [
        q(-1, "Q1", 1_800 * M, 0.45, 0.16, { interest: 25 * M, buybacks: 250 * M, sharesChange: -3.5 * M, dividends: 70 * M }),
        q(32, "Q2", 1_800 * M, 0.45, 0.16, { interest: 27 * M, buybacks: 300 * M, sharesChange: -4.2 * M, debtChange: 200 * M, dividends: 70 * M }),
      ]),
    },
  }),

  // ---------------- Deals & binary events ----------------
  sim({
    id: "sim-merger-arb",
    topic: "events",
    title: "Takeover: target pops, acquirer drops",
    description: "A software company agrees to be bought for $40 cash. The target jumps and then pins just under the deal price.",
    lesson: "After a cash deal, the target trades a little below the offer (the spread pays for the risk the deal fails). The acquirer often falls because it is paying a premium.",
    learn: ["Read a deal spread", "Know the main deal risks (regulators, financing)", "See why the acquirer can fall"],
    goals: [STOP, RISK1],
    debrief: {
      signals: ["D21 after the close: $40 cash, about a 30% premium; on D22 the target gapped to roughly $38.60, a 3.5% spread.", "D45: a regulator request widened the spread briefly.", "The acquirer fell about 6% on the premium it agreed to pay."],
      plan: ["Buying the target after the gap is a small, capped upside (to $40) with a large downside if the deal breaks: size small.", "Chasing the target for more upside makes no sense in a cash deal."],
    },
    terms: ["merger-arbitrage", "binary-event", "priced-in", "r-multiple"],
    paths: [
      { symbol: "NSTW.S", name: "Nestwell Software", start: 30.5, drift: 0, vol: 0.012, gaps: [[21, 27], [45, -4]], pin: [21, 38.6], volume: 1_000_000 },
      { symbol: "HOLN.S", name: "Hollan Systems", start: 112, drift: 0.0005, vol: 0.011, gaps: [[21, -6]], volume: 2_500_000 },
    ],
    news: [
      ["NSTW.S", 20, "company", "Hollan Systems agrees to buy Nestwell Software for $40 a share in cash", "About a 30% premium to Nestwell's close. Expected to close in about two months. Announced after the close."],
      ["HOLN.S", 20, "company", "Hollan to fund the Nestwell deal with cash and new debt", "Analysts question the price paid. Announced after the close."],
      ["NSTW.S", 44, "company", "Regulators ask Hollan and Nestwell for more information on the deal", "A routine but time-consuming review. Reported after the close."],
      ["NSTW.S", 55, "company", "Regulators clear the Hollan–Nestwell deal", "Closing expected after the final shareholder vote."],
    ],
    statements: {
      "NSTW.S": quarterSeries(co(150 * M, 700 * M, 0, 160 * M, 90 * M), [q(-1, "Q2", 210 * M, 0.78, 0.15)]),
      "HOLN.S": quarterSeries(co(2_000 * M, 14_000 * M, 4_000 * M, 3_000 * M, 400 * M), [q(-1, "Q2", 3_600 * M, 0.62, 0.24, { interest: 40 * M })]),
    },
  }),
  sim({
    id: "sim-fda-binary",
    topic: "events",
    title: "Drug decision: a binary event",
    description: "A one-drug biotech waits for a regulator's decision on a known date.",
    lesson: "A binary event can gap a stock 50% or more either way. No stop protects you through it. Size as if you could lose most of the position, or be flat.",
    learn: ["Spot a binary event on the calendar", "Size for a gap, not for a stop", "Be flat before an all-or-nothing date"],
    goals: [{ kind: "flatAt", bar: 40, symbol: "CRVA.S", text: "Be flat CRVA.S at the D41 close (before the decision)" }, DD8],
    debrief: {
      signals: ["D16: the decision date was public. The run-up into it priced in approval.", "D41 after the close: rejection. The D42 open was about 60% lower; any stop filled at the open."],
      plan: ["Trade the run-up if you like, with a trailing stop, and be flat by the D41 close.", "Holding through: size so that a 60% gap costs under 1% of the account."],
    },
    terms: ["binary-event", "topline-readout", "gap-risk", "cash-runway"],
    paths: [{ symbol: "CRVA.S", name: "Curava Therapeutics", start: 18, drift: 0.005, vol: 0.025, gaps: [[41, -62]], segments: [[41, -0.003, 0.03]], volume: 4_000_000 }],
    news: [
      ["CRVA.S", 15, "company", "Curava's lead drug gets a regulator decision date: after the close on D41", "Curava has one drug; the decision is all or nothing for the shares."],
      ["CRVA.S", 30, "company", "Options imply about a 55% move around Curava's decision", "Traders price an extreme move either way."],
      ["CRVA.S", 40, "company", "Regulator rejects Curava's drug and asks for a new trial", "A new trial would take two to three years. Announced after the close."],
    ],
    statements: {
      "CRVA.S": quarterSeries(co(180 * M, 40 * M, 0, 25 * M, 60 * M), [q(-1, "Q2", 0, 0, 0, { operatingIncome: -38 * M, da: 1 * M, capex: 1 * M, note: "No product revenue; operating spending is research." })]),
    },
  }),

  // ---------------- Macro & sectors ----------------
  sim({
    id: "sim-fed-decision",
    topic: "macro",
    title: "Fed surprise: who wins, who loses",
    description: "The central bank raises rates by more than expected. A bank, a utility and a growth stock react differently.",
    lesson: "Higher rates can help bank lending margins, weigh on bond-like stocks (utilities) and hit long-duration growth stocks hardest. Same news, three directions.",
    learn: ["Map a rate surprise to sectors", "See correlation inside a basket", "Size across correlated positions"],
    goals: [STOP, DD8],
    debrief: {
      signals: ["D13: markets expected 0.25 points. D31: 0.50 points and a hawkish statement.", "Bank up, utility down, growth stock down the most: the rate-sensitivity map in action."],
      plan: ["Flat or small into the decision; trade the reaction afterwards.", "A long bank / short growth pair is the 'rates up' expression, only with shorting on and stops on both legs."],
    },
    terms: ["federal-funds-rate", "fomc", "hawkish-dovish", "rate-sensitive-sectors"],
    paths: [
      { symbol: "HRBT.S", name: "Harbor Trust Bank", start: 54, drift: 0.0005, vol: 0.011, shocks: [[30, 1.5, 4]], segments: [[31, 0.0015, 0.012]], volume: 3_000_000 },
      { symbol: "STDP.S", name: "Steadyline Power", start: 61, drift: 0.0003, vol: 0.007, shocks: [[30, 3.5, -3]], segments: [[31, -0.001, 0.009]], volume: 2_000_000 },
      { symbol: "NMBC.S", name: "Nimbus Cloud", start: 96, drift: 0.001, vol: 0.017, shocks: [[30, 8, -7]], segments: [[31, -0.002, 0.02]], volume: 4_000_000 },
    ],
    news: [
      ["", 12, "market", "Fed decision due on D31; markets price a 0.25-point hike", "Futures put the odds of a larger move near 10%."],
      ["", 25, "market", "Inflation stays sticky; some officials signal openness to a bigger hike", "Expectations start to shift."],
      ["", 30, "market", "Fed raises rates by 0.50 points and signals more to come", "A larger move than expected, announced mid-session. Bank shares rose; utilities and growth stocks fell."],
    ],
  }),
  sim({
    id: "sim-cpi-surprise",
    topic: "macro",
    title: "Hot inflation print",
    description: "A pre-market inflation report comes in hot. Everything gaps down at the open; rate-sensitive homebuilders fall most.",
    lesson: "A scheduled release before the open is a gap risk you know is coming, even though you cannot know the number. Size into it, or wait.",
    learn: ["Treat a release calendar as risk", "See which stocks are most rate-sensitive", "Avoid holding big size into a scheduled print"],
    goals: [{ kind: "maxDrawdown", pct: 4, text: "Keep drawdown under 4%" }, STOP],
    debrief: {
      signals: ["D30: the report was due before the D31 open; the forecast was 0.2%.", "D31: 0.6%. Yields jumped; the homebuilder fell about 7% at the open, the discount retailer least."],
      plan: ["Hold less overnight before a scheduled release; stops cannot stop a gap.", "After the gap, watch which names recover first (relative strength)."],
    },
    terms: ["cpi", "macro-surprise", "gap-risk", "stagflation"],
    paths: [
      { symbol: "BMKT.S", name: "Broad Market Fund", start: 405, drift: 0.0007, vol: 0.006, gaps: [[30, -2.2]], volume: 50_000_000 },
      { symbol: "RDGP.S", name: "Ridgepoint Homes", start: 88, drift: 0.001, vol: 0.014, gaps: [[30, -7]], segments: [[30, -0.002, 0.016]], volume: 2_000_000 },
      { symbol: "VLMT.S", name: "Valuemart Stores", start: 132, drift: 0.0006, vol: 0.008, gaps: [[30, -0.8]], segments: [[30, 0.001, 0.009]], volume: 1_500_000 },
    ],
    news: [
      ["", 29, "market", "Consumer price report due before tomorrow's open", "Forecast: +0.2% for the month. The number is not known until the release."],
      ["", 30, "market", "Consumer prices jump 0.6%, three times the forecast", "Released before the open. Bond yields surge; mortgage rates are expected to rise."],
      ["RDGP.S", 36, "company", "Ridgepoint Homes says buyers are cancelling as mortgage rates rise", "Cancellation rate up to 18%."],
    ],
  }),
  sim({
    id: "sim-sector-rotation",
    topic: "macro",
    title: "Sector rotation",
    description: "Money moves out of chip stocks and into energy as oil rises and rates climb. A staples stock barely moves.",
    lesson: "A flat index can hide big moves underneath. Following the stronger sector (relative strength) tends to beat buying the weakest 'because it fell'.",
    learn: ["Compare relative strength across a watchlist", "See rotation between sectors", "Diversification and correlation"],
    goals: [STOP, POS],
    debrief: {
      signals: ["D15: an oil supply cut. Energy rose steadily; chip stocks fell as rates rose.", "The staples stock went nearly sideways."],
      plan: ["Buy the leader (PTLX.S) on a pullback; skip the laggard.", "Spreading across the strongest sector reduces single-stock risk."],
    },
    terms: ["sector-rotation", "correlation", "diversification", "trend-following"],
    paths: [
      { symbol: "QNTX.S", name: "Quantix Semis", start: 140, drift: 0.001, vol: 0.017, segments: [[15, -0.005, 0.019]], gaps: [[41, -5]], volume: 5_000_000 },
      { symbol: "PTLX.S", name: "Petrolux Energy", start: 58, drift: 0, vol: 0.013, gaps: [[15, 4]], segments: [[15, 0.005, 0.015]], volume: 3_500_000 },
      { symbol: "PNTG.S", name: "Pantry Goods", start: 76, drift: 0.0004, vol: 0.006, volume: 1_500_000 },
    ],
    news: [
      ["", 14, "market", "Oil producers announce a surprise supply cut", "Crude rises 6% after the close; energy shares lead in early trading."],
      ["", 28, "market", "Ten-year yield hits a one-year high", "Rising yields weigh on high-valuation tech."],
      ["QNTX.S", 40, "company", "Quantix Semis warns of an inventory glut at customers", "Chip orders slow. Published after the close."],
    ],
  }),
  sim({
    id: "sim-recession-bear",
    topic: "macro",
    title: "Recession and a bear market",
    description: "Weak jobs data turns into a recession scare. Everything falls; the defensive stock falls less. A bear-market rally fails.",
    lesson: "In a bear market, sharp rallies are common and most fail. Cash is a position. Defensive sectors fall less but still fall.",
    learn: ["See a bear market with a failed rally", "Compare cyclical vs defensive stocks", "Protect capital: recovery math"],
    goals: [DD8, STOP, { kind: "maxTrades", n: 5, text: "Five trades or fewer" }],
    options: { allowShort: true },
    debrief: {
      signals: ["D14 and D28: job losses, then an automaker cutting production: the cycle was turning.", "The automaker's statements showed falling sales and margins; the health company's did not.", "The D38 rally on 'peak pessimism' headlines faded within a week."],
      plan: ["Stay mostly in cash; a 25% loss needs a 33% gain to recover.", "If you trade, the defensive name with a stop, or short failed rallies with shorting on."],
    },
    terms: ["recovery-math", "drawdown", "stagflation", "diversification"],
    paths: [
      { symbol: "BMKT.S", name: "Broad Market Fund", start: 430, drift: -0.004, vol: 0.011, segments: [[38, 0.008, 0.012], [43, -0.005, 0.012]], gaps: [[14, -2]], volume: 60_000_000 },
      { symbol: "RDWY.S", name: "Roadway Motors", start: 47, drift: -0.007, vol: 0.02, segments: [[38, 0.012, 0.02], [43, -0.007, 0.02]], gaps: [[14, -4], [28, -7]], volume: 6_000_000 },
      { symbol: "MDVA.S", name: "Medivia Health", start: 101, drift: -0.0015, vol: 0.009, gaps: [[14, -1]], volume: 2_000_000 },
    ],
    news: [
      ["", 13, "market", "Employers cut jobs for the first time in three years", "Payrolls fall; the jobless rate rises to 4.6%. Released before the next open."],
      ["RDWY.S", 27, "earnings", "Roadway Motors cuts production as sales fall 16%", "Operating margin halves. Published after the close."],
      ["RDWY.S", 27, "filing", "Roadway Motors files its quarterly report", "Inventory is building up; see working capital in operating cash flow."],
      ["", 37, "market", "Strategists call 'peak pessimism' as stocks bounce", "Bear-market rallies are often sharp."],
      ["", 44, "market", "Layoffs spread to services; recession odds rise", "The bounce fades."],
    ],
    statements: {
      "RDWY.S": quarterSeries(co(3_000 * M, 30_000 * M, 14_000 * M, 9_000 * M, 900 * M), [
        q(-1, "Q2", 12_000 * M, 0.17, 0.07, { interest: 160 * M }),
        q(27, "Q3", 10_100 * M, 0.13, 0.035, { interest: 170 * M, wc: -900 * M }),
      ]),
      "MDVA.S": quarterSeries(co(1_200 * M, 9_000 * M, 3_000 * M, 2_000 * M, 300 * M), [q(-1, "Q2", 4_000 * M, 0.3, 0.1, { interest: 30 * M })]),
    },
  }),

  // ---------------- Balance-sheet risk ----------------
  sim({
    id: "sim-going-concern",
    topic: "credit",
    title: "Going-concern warning to bankruptcy",
    description: "A mall retailer burns cash against a debt deadline. The filings warn you before the price collapses.",
    lesson: "Falling cash, rising debt, shrinking equity and a going-concern note are the warnings. Shareholders are paid last: in bankruptcy the stock can go to nearly zero.",
    learn: ["Read cash burn against a debt maturity", "Spot a going-concern note", "Never average down into a balance-sheet crisis"],
    goals: [DD8, { kind: "flatAt", bar: 50, symbol: "BRML.S", text: "Be flat BRML.S at the D51 close" }],
    options: { allowShort: true },
    debrief: {
      signals: ["Opening filing: cash falling, $900M of debt due within a year.", "D25 filing: losses cut equity sharply; the auditor's going-concern note.", "D51: Chapter 11. The D52 open was about 75% lower."],
      plan: ["No long at all once the going-concern note appeared; a rescue rumour is not a reason.", "With shorting on, a short after the D25 filing with a buy stop above the last high was the disciplined version."],
    },
    terms: ["going-concern", "debt-covenant", "net-debt", "cash-burn"],
    paths: [{ symbol: "BRML.S", name: "Brightmall Retail", start: 9, drift: -0.004, vol: 0.03, gaps: [[25, -18], [40, 12], [51, -75]], segments: [[40, -0.006, 0.04]], volume: 8_000_000 }],
    news: [
      ["BRML.S", 16, "company", "Brightmall hires restructuring advisers", "The company says it is 'exploring options' for $900M of debt due next year."],
      ["BRML.S", 24, "earnings", "Brightmall posts a large loss; auditor raises going-concern doubt", "Same-store sales −14%. 'Substantial doubt' about continuing as a going concern. Published after the close."],
      ["BRML.S", 24, "filing", "Brightmall files its quarterly report", "Losses and a write-down cut equity; debt is up."],
      ["BRML.S", 39, "company", "Report: lenders discuss a rescue loan for Brightmall", "Unconfirmed; talks may fail. Published after the close."],
      ["BRML.S", 50, "company", "Brightmall files for Chapter 11 bankruptcy", "Existing shares are expected to receive little or nothing. Announced after the close."],
    ],
    statements: {
      "BRML.S": quarterSeries(co(140 * M, 1_400 * M, 1_200 * M, 280 * M, 150 * M), [
        q(-1, "Q1", 520 * M, 0.3, -0.04, { interest: 28 * M, wc: -20 * M, capex: 10 * M, note: "$900M of debt matures within twelve months." }),
        q(24, "Q2", 450 * M, 0.26, -0.12, { interest: 30 * M, wc: -30 * M, capex: 8 * M, charge: 60 * M, debtChange: 40 * M, note: "Auditor: substantial doubt about the company's ability to continue as a going concern." }),
      ]),
    },
  }),
  sim({
    id: "sim-restatement",
    topic: "credit",
    title: "Accounting restatement",
    description: "A software company says past revenue was booked too early. It delays its report and restates.",
    lesson: "A restatement means the numbers you traded on were wrong. Trust drops first, then estimates. A delayed filing is a red flag in itself.",
    learn: ["Spot a delayed filing", "Compare original vs restated numbers", "See why trust gaps are slow to heal"],
    goals: [STOP, DD8],
    debrief: {
      signals: ["D23: a late-filing notice (the report would be delayed).", "D30: revenue recognised too early; the restated quarter shows lower revenue and profit than the original.", "The gap did not fill: confidence, not just numbers, was lost."],
      plan: ["Exit or cut size on a late-filing notice; do not wait for the details.", "No new long until clean reports return."],
    },
    terms: ["restatement", "income-statement", "rumor-vs-filing", "net-margin"],
    paths: [{ symbol: "LDGL.S", name: "Ledgerline Systems", start: 63, drift: 0.001, vol: 0.013, gaps: [[23, -8], [30, -22]], segments: [[30, -0.002, 0.02]], volume: 2_000_000 }],
    news: [
      ["LDGL.S", 22, "filing", "Ledgerline files a notice that its quarterly report will be late", "The company cites a review of revenue recognition. Published after the close."],
      ["LDGL.S", 29, "company", "Ledgerline to restate revenue: multi-year deals were booked too early", "Prior-quarter revenue cut by about 15%; the finance chief steps down. Announced after the close."],
      ["LDGL.S", 29, "filing", "Ledgerline files a restated quarterly report", "Compare the restated figures with the original on the Financials tab."],
    ],
    statements: {
      "LDGL.S": [
        ...quarterSeries(co(300 * M, 900 * M, 200 * M, 260 * M, 70 * M), [q(-1, "Q2 (as first reported)", 280 * M, 0.75, 0.2, { interest: 2 * M })], "original"),
        ...quarterSeries(co(300 * M, 900 * M, 200 * M, 260 * M, 70 * M), [q(29, "Q2 (restated)", 238 * M, 0.71, 0.08, { interest: 2 * M, form: "Restated quarterly report", note: "Restated: revenue on multi-year contracts recognised over the contract, not up front." })], "restated"),
      ],
    },
  }),

  // ---------------- Insiders & analysts ----------------
  sim({
    id: "sim-insider-buying",
    topic: "signals",
    title: "Insider buying after a selloff",
    description: "After a bank's shares fall about 25%, the CEO and three directors buy stock with their own money.",
    lesson: "Insiders sell for many reasons but buy for one. Clustered open-market buying is worth noting, not a reason to skip your stop.",
    learn: ["Read an insider-purchase filing", "Treat a signal as context, not an entry", "Combine a signal with a price trigger"],
    goals: [STOP, RISK1, POS],
    debrief: {
      signals: ["D19: four insiders bought in the open market after a steep fall.", "The next quarter's report showed stable deposits and credit losses below fears."],
      plan: ["Wait for a price trigger (a higher low and a close above the prior swing high), then buy with a stop under the low.", "The insider buys alone did not mark the exact low: price kept falling for days after them."],
    },
    terms: ["insider-buying", "balance-sheet", "liquidity", "net-margin"],
    paths: [{ symbol: "OKHV.S", name: "Oakhaven Bank", start: 40, drift: -0.006, vol: 0.016, segments: [[24, 0.0045, 0.015]], gaps: [[37, 4]], volume: 2_000_000 }],
    news: [
      ["OKHV.S", 10, "market", "Regional bank shares slide on deposit worries", "Investors fear customers moving money to higher-yield accounts."],
      ["OKHV.S", 18, "filing", "Oakhaven CEO and three directors buy shares in the open market", "Insider-trade filings show about $3M of purchases."],
      ["OKHV.S", 36, "earnings", "Oakhaven deposits hold steady; credit losses below estimates", "Lending margin stable. Published after the close."],
      ["OKHV.S", 36, "filing", "Oakhaven Bank files its quarterly report", "See net income and the cash line."],
    ],
    statements: {
      "OKHV.S": quarterSeries(co(2_000 * M, 18_000 * M, 17_000 * M, 1_200 * M, 100 * M), [q(-1, "Q2", 320 * M, 1, 0.38, { da: 5 * M, capex: 5 * M }), q(36, "Q3", 318 * M, 1, 0.37, { da: 5 * M, capex: 5 * M })]),
    },
  }),
  sim({
    id: "sim-analyst-calls",
    topic: "signals",
    title: "Analyst upgrades and downgrades",
    description: "A media company is downgraded, an airline upgraded. One move lasts; one fades.",
    lesson: "Rating changes move prices for a day or two. They last when the reason shows up in the next numbers.",
    learn: ["Read the reason behind a rating change", "See a fade after an upgrade pop", "Check the next report for confirmation"],
    goals: [STOP, { kind: "maxTrades", n: 4, text: "Four trades or fewer" }],
    debrief: {
      signals: ["TSSM.S's downgrade cited falling subscriptions; the D39 report confirmed it, and the drop held.", "KTWL.S's upgrade cited 'cheap valuation' with no new data; the pop faded within a week."],
      plan: ["Avoid (or, with shorting on, short) TSSM.S after the confirmed weakness; a long only after a better report.", "Do not chase an upgrade pop with no new facts behind it."],
    },
    terms: ["analyst-rating", "fomo", "earnings-surprise", "priced-in"],
    paths: [
      { symbol: "TSSM.S", name: "Tessmark Media", start: 33, drift: 0, vol: 0.013, gaps: [[16, -7], [39, -5]], segments: [[16, -0.002, 0.014]], volume: 2_500_000 },
      { symbol: "KTWL.S", name: "Kitewell Air", start: 21, drift: 0, vol: 0.016, gaps: [[22, 6]], segments: [[22, -0.007, 0.016], [30, 0, 0.015]], volume: 4_000_000 },
    ],
    news: [
      ["TSSM.S", 15, "company", "Analyst downgrades Tessmark Media to sell: subscriptions slipping", "App data shows two months of subscriber losses. Note published after the close."],
      ["KTWL.S", 21, "company", "Analyst upgrades Kitewell Air to buy: 'too cheap to ignore'", "The note cites valuation; no new traffic or fare data. Published after the close."],
      ["TSSM.S", 38, "earnings", "Tessmark Media loses 400,000 subscribers in the quarter", "Confirms the downgrade's thesis. Published after the close."],
      ["TSSM.S", 38, "filing", "Tessmark Media files its quarterly report", "Revenue down, margins down."],
    ],
    statements: {
      "TSSM.S": quarterSeries(co(250 * M, 2_200 * M, 900 * M, 400 * M, 120 * M), [q(-1, "Q2", 610 * M, 0.45, 0.12, { interest: 12 * M }), q(38, "Q3", 575 * M, 0.42, 0.08, { interest: 12 * M })]),
      "KTWL.S": quarterSeries(co(900 * M, 6_000 * M, 4_200 * M, 1_800 * M, 300 * M), [q(-1, "Q2", 2_400 * M, 0.2, 0.05, { interest: 55 * M })]),
    },
  }),

  // ---------------- Execution & risk ----------------
  sim({
    id: "sim-illiquid-smallcap",
    topic: "execution",
    title: "Thin small cap: slippage",
    description: "A tiny mining stock trades a few tens of thousands of shares a day. Market orders fill far from the last price.",
    lesson: "In a thin stock, market and stop orders slip. Use limit orders, trade small, and expect wide swings. This scenario starts with 50 bps of slippage and a $1 fee.",
    learn: ["See slippage in your fills", "Prefer limit orders in thin stocks", "Size to the volume, not just the account"],
    goals: [{ kind: "usedType", type: "limit", text: "Use at least one limit order" }, STOP, { kind: "maxTrades", n: 4, text: "Four trades or fewer (costs add up)" }],
    options: { slippageBps: 50, feeCents: 100 },
    debrief: {
      signals: ["Average volume was about 40,000 shares a day; daily swings of 4–6% were normal.", "The D27 drill result moved the stock 20% on little volume."],
      plan: ["Limit orders only; never a market order at the open in a stock this thin.", "Keep the position a small fraction of a day's volume."],
    },
    terms: ["slippage", "liquidity", "bid-ask", "public-float"],
    paths: [{ symbol: "PBLM.S", name: "Pebble Mining", start: 2.4, drift: 0, vol: 0.045, gaps: [[27, 20]], segments: [[27, -0.003, 0.05]], volume: 40_000 }],
    news: [
      ["PBLM.S", 12, "company", "Pebble Mining starts drilling at its only project", "Results expected in about two weeks."],
      ["PBLM.S", 26, "company", "Pebble Mining reports promising drill results", "Grades above expectations at one hole; more drilling needed. Published after the close."],
    ],
    statements: { "PBLM.S": quarterSeries(co(6 * M, 14 * M, 1 * M, 1 * M, 30 * M), [q(-1, "Q2", 0, 0, 0, { operatingIncome: -1.2 * M, da: 0.2 * M, capex: 1.5 * M, note: "Exploration company: no revenue yet." })]) },
  }),
  sim({
    id: "sim-overnight-gaps",
    topic: "execution",
    title: "Overnight gaps vs stop orders",
    description: "A logistics stock gaps through stops twice: once on a guidance cut, once on a lawsuit.",
    lesson: "A stop only works while the market trades through it. Overnight, price can jump past it and you fill at the open. Size for the gap, not just the stop distance.",
    learn: ["See a stop fill at the gap open", "See a stop-limit skip the fill", "Size for overnight risk"],
    goals: [STOP, RISK1, { kind: "maxDrawdown", pct: 4, text: "Keep drawdown under 4% even through the gaps" }],
    debrief: {
      signals: ["D21 and D42: news after the close, then gaps of about 9% and 12% at the next open.", "Stops 3% below the market filled 9–12% below."],
      plan: ["With a 3% stop, size as if the loss could be 12%: a quarter of the stop-based size.", "A stop-limit would have avoided the gap fill but left you holding a falling stock."],
    },
    terms: ["gap-risk", "stop-order", "stop-limit-order", "position-sizing"],
    paths: [{ symbol: "NTFL.S", name: "Nightfall Logistics", start: 57, drift: 0.002, vol: 0.011, gaps: [[21, -9], [42, -12]], volume: 1_700_000 }],
    news: [
      ["NTFL.S", 20, "company", "Nightfall Logistics cuts its outlook on a lost customer", "Its largest customer moves volume to a rival. Announced after the close."],
      ["NTFL.S", 41, "company", "Nightfall Logistics faces a lawsuit over a warehouse fire", "Damages sought exceed its insurance. Reported after the close."],
    ],
    statements: { "NTFL.S": quarterSeries(co(120 * M, 1_600 * M, 700 * M, 300 * M, 45 * M), [q(-1, "Q2", 500 * M, 0.2, 0.08, { interest: 9 * M })]) },
  }),
  sim({
    id: "sim-trailing-stops",
    topic: "execution",
    title: "Trailing stops: tight vs wide",
    description: "A solar stock runs up with two deep pullbacks, then reverses hard.",
    lesson: "A tight trail exits on normal noise; a wide trail gives back more at the top. Match the trail to the stock's usual pullback.",
    learn: ["Compare a tight and a wide trail", "Size a trail to normal pullbacks", "Lock in gains before a reversal"],
    goals: [{ kind: "usedType", type: "trailing-stop", text: "Exit with a trailing stop" }, STOP, POS],
    debrief: {
      signals: ["Pullbacks of several percent were normal on the way up: a 3% trail would exit early.", "D45: a supply-glut warning; the reversal gave back much of the run within two weeks."],
      plan: ["Trail at about 1.5× the usual pullback.", "Tighten after a climax day or bad news, not before."],
    },
    terms: ["trailing-stop", "whipsaw", "r-multiple", "drawdown"],
    paths: [{ symbol: "RVBD.S", name: "Riverbend Solar", start: 31, drift: 0.008, vol: 0.022, segments: [[18, -0.012, 0.02], [22, 0.008, 0.022], [33, -0.01, 0.02], [37, 0.009, 0.022], [45, -0.014, 0.025]], gaps: [[45, -7]], volume: 3_000_000 }],
    news: [
      ["RVBD.S", 11, "company", "Riverbend Solar wins a utility-scale contract", "Shares have momentum."],
      ["RVBD.S", 44, "company", "Panel prices fall as a supply glut builds", "Margins across the industry are expected to shrink. Published after the close."],
    ],
    statements: { "RVBD.S": quarterSeries(co(140 * M, 900 * M, 400 * M, 180 * M, 90 * M), [q(-1, "Q2", 320 * M, 0.24, 0.09, { interest: 6 * M })]) },
  }),
  sim({
    id: "sim-drawdown-sizing",
    topic: "execution",
    title: "Sizing through a drawdown",
    description: "Two choppy stocks hand out a string of small losses before a real trend appears.",
    lesson: "Losing streaks happen to good plans. Cutting size after losses (and not raising it to 'win it back') keeps you in the game for the trend.",
    learn: ["Fixed-fractional sizing", "Cut size during a drawdown", "Avoid revenge trading"],
    goals: [{ kind: "maxDrawdown", pct: 5, text: "Keep drawdown under 5%" }, RISK1, STOP],
    debrief: {
      signals: ["Bars up to D39: choppy ranges with false breakouts in both stocks; no news edge.", "D40: CHPX.S's contract news started the trend worth waiting for."],
      plan: ["Risk 1% per trade; after three losses, drop to 0.5% until a winner.", "Take the D41 breakout with full size only if the account is not in a deep drawdown."],
    },
    terms: ["position-sizing", "drawdown", "overtrading", "loss-aversion"],
    paths: [
      { symbol: "CHPX.S", name: "Chopworth Industrial", start: 45, vol: 0.02, range: [42, 48, 0, 39], gaps: [[40, 6]], segments: [[40, 0.006, 0.016]], volume: 1_500_000 },
      { symbol: "WHPS.S", name: "Whipsaw Textiles", start: 18, vol: 0.025, range: [16.5, 19.5], volume: 1_000_000 },
    ],
    news: [
      ["CHPX.S", 22, "company", "Chopworth says orders are 'stable'", "No change to guidance."],
      ["CHPX.S", 39, "company", "Chopworth wins a large rail contract", "The contract is twice last year's largest. Announced after the close."],
    ],
    statements: { "CHPX.S": quarterSeries(co(110 * M, 1_100 * M, 350 * M, 260 * M, 50 * M), [q(-1, "Q2", 420 * M, 0.27, 0.09, { interest: 5 * M })]) },
  }),
  sim({
    id: "sim-time-decay",
    topic: "execution",
    title: "Sideways: time decay vs shares",
    description: "A water utility goes nowhere for three months. Shareholders lose nothing; a call-option holder's premium melts away.",
    lesson: "A flat stock costs a shareholder only time. An option buyer pays for time: each day of going nowhere, time decay shrinks the premium, fastest near expiry.",
    learn: ["Compare owning shares with owning a call in a flat market", "See time decay in the desk notes", "Avoid overtrading a stock that is not moving"],
    goals: [{ kind: "maxTrades", n: 3, text: "Three trades or fewer" }, STOP],
    debrief: {
      signals: ["Price stayed within a few percent of $50 for the whole replay; the quarter was in line.", "The options desk notes show a one-month call premium falling from about $1.60 to near zero with the stock unchanged."],
      plan: ["Shares: a sideways stock is a hold or a skip, not a trade.", "Options: buying calls needs a move soon enough to beat time decay; in a flat market the premium is lost."],
    },
    terms: ["option-premium", "expiration-date", "days-to-expiration", "overtrading"],
    paths: [{ symbol: "STLW.S", name: "Stillwater Water", start: 50, vol: 0.006, range: [48, 52], volume: 900_000 }],
    news: [
      ["STLW.S", 12, "market", "Options desk note: one-month $50 call costs about $1.60", "The call needs the stock above $51.60 at expiry to profit."],
      ["STLW.S", 25, "market", "Options desk note: the same call is down to about $1.00 with the stock unchanged", "Two weeks of time decay with no move."],
      ["STLW.S", 33, "earnings", "Stillwater Water reports an in-line quarter", "No surprises; rates approved as expected."],
      ["STLW.S", 38, "market", "Options desk note: the call expires near zero", "The stock is still about $50. A shareholder is flat; the call buyer lost the $1.60 premium."],
    ],
    statements: { "STLW.S": quarterSeries(co(80 * M, 3_000 * M, 1_500 * M, 500 * M, 60 * M), [q(-1, "Q2", 210 * M, 0.55, 0.3, { interest: 18 * M, dividends: 30 * M }), q(33, "Q3", 212 * M, 0.55, 0.3, { interest: 18 * M, dividends: 30 * M })]) },
  }),
];
