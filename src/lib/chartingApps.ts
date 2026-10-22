/**
 * Indicator & charting apps (/practice/charting-apps): an 11-app comparison as of 2026-10-22, how charts mislead,
 * the Robinhood vs Webull charting view, how brokers teach, and example Webull account screens. Facts come from
 * each app's own help pages and pricing pages; prices change, so the page says "check current pricing".
 * Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";

export const AS_OF = "2026-10-22";
export interface Src { label: string; url: string }
const s = (label: string, url: string): Src => ({ label, url });

export interface ChartAppRow { app: string; indicators: string; scripting: string; layouts: string; cost: string; data: string; sources: Src[] }
export const CHART_APPS: ChartAppRow[] = [
  { app: "TradingView", indicators: "400+ built-in, 100K+ community scripts; indicators per chart depend on the plan", scripting: "Pine Script", layouts: "Multi-timeframe, custom intervals on paid plans", cost: "Free Basic; paid plans", data: "Default US data is real-time from Cboe only, so 1-minute, thin and extended-hours bars can differ from the primary exchange; paid exchange feeds fix this", sources: [s("TradingView pricing", "https://www.tradingview.com/pricing/"), s("TradingView US data", "https://www.tradingview.com/support/solutions/43000473924-is-us-stock-market-data-free-by-default/")] },
  { app: "Webull", indicators: "60+ including MACD, RSI, Bollinger Bands, KDJ; technical signals and candlestick-pattern recognition", scripting: "Script Editor (desktop and web)", layouts: "Multi-chart grids, compare symbols, intervals down to 1 tick, historical replay", cost: "Free with an account", data: "Extended hours combined, separated or hidden; linear, log or percentage axis; corporate-action markers; paper trading", sources: [s("Webull charts & tools", "https://www.webull.com/charts-tools"), s("Webull: customize charts", "https://www.webull.com/learn/PEyJYP/SvfXUX/How-to-Customize-Your-Charts")] },
  { app: "Robinhood (app / classic web)", indicators: "7: Volume, MA, EMA, RSI, MACD, VWAP, Bollinger Bands (advanced charts: up to 10 at once)", scripting: "None", layouts: "Interval is tied to the time span", cost: "Free", data: "Nasdaq Last Sale data; charts may not account for splits or dividends; 1D and 1W include overnight and pre-market", sources: [s("Robinhood: viewing indicators", "https://robinhood.com/us/en/support/articles/viewing-indicators/"), s("Robinhood: advanced charts", "https://robinhood.com/us/en/support/articles/using-advanced-charts/")] },
  { app: "Robinhood Legend (desktop)", indicators: "Dozens, including Stochastic, ATR, Supertrend, Parabolic SAR; saved indicator sets", scripting: "None", layouts: "Multi-chart desktop layouts", cost: "No added cost", data: "Not every indicator works on every asset type", sources: [s("Robinhood Legend indicators", "https://robinhood.com/us/en/support/articles/chart-indicators-on-legend/")] },
  { app: "thinkorswim (Schwab)", indicators: "400+ studies", scripting: "thinkScript: studies, backtested strategies, scans, alerts, conditional orders", layouts: "Flexible grids, Monkey Bars, Renko", cost: "Free for Schwab clients", data: "paperMoney simulator with real-time data", sources: [s("thinkorswim desktop", "https://www.schwab.com/trading/thinkorswim/desktop"), s("thinkScript", "https://toslc.thinkorswim.com/center/charting/thinkscript")] },
  { app: "TC2000", indicators: "Full technical-analysis suite", scripting: "Personal Criteria Formulas, EasyScan", layouts: "Multi-chart layouts", cost: "Paid tiers (check current pricing)", data: "Real-time US stocks via Nasdaq Basic; consolidated tape is an add-on; paper trading", sources: [s("TC2000 pricing", "https://www.tc2000.com/pricing")] },
  { app: "TrendSpider", indicators: "300+", scripting: "JavaScript indicators, visual strategy builder, backtests with slippage", layouts: "Multi-timeframe analysis", cost: "Paid plans with a trial (check current pricing)", data: "Automated trendlines and pattern detection; bots and webhooks", sources: [s("TrendSpider pricing", "https://trendspider.com/pricing/")] },
  { app: "IBKR TWS / IBKR Desktop", indicators: "Studies library with editable inputs", scripting: "TWS API and Web API", layouts: "Mosaic charts, secondary series, comparisons", cost: "Free with an IBKR account; market data may cost extra", data: "Bars, candles, Heikin-Ashi; can shade pre- and post-market", sources: [s("IBKR TWS charts lesson", "https://www.interactivebrokers.com/campus/trading-lessons/tws-chart-panel/")] },
  { app: "Yahoo Finance", indicators: "Overlays (Bollinger, moving averages) and oscillators (MACD, Stochastics) with editable parameters", scripting: "None", layouts: "Single advanced chart", cost: "Free; some features paid", data: "Nasdaq real-time for US stocks; options (OPRA) delayed 15 minutes, CME futures 10 minutes", sources: [s("Yahoo: add indicators", "https://help.yahoo.com/kb/add-indicators-charts-yahoo-finance-web-sln8326.html"), s("Yahoo data delays", "https://help.yahoo.com/kb/finance-for-web/exchanges-data-providers-yahoo-finance-sln2310.html")] },
  { app: "Finviz", indicators: "Screener first; Elite adds interactive charts, indicators and pattern recognition", scripting: "None", layouts: "Elite: up to 12 charts", cost: "Free (delayed); Elite paid", data: "Free quotes delayed and no interactive intraday charts; Elite is real-time including extended hours", sources: [s("Finviz Elite", "https://finviz.com/elite/")] },
  { app: "StockCharts", indicators: "Free: 3 indicators + 3 overlays per chart; paid: up to 25", scripting: "Scan language", layouts: "Multi-panel", cost: "Free; paid plans (check current pricing)", data: "History adjusted for splits and dividends by default", sources: [s("StockCharts pricing", "https://stockcharts.com/pricing/"), s("StockCharts price adjustments", "https://help.stockcharts.com/data-and-ticker-symbols/data-availability/price-data-adjustments")] },
];

export const CHART_TRAPS: { trap: string; what: string; check: string }[] = [
  { trap: "Linear vs log scale", what: "On a linear axis, $10 → $20 looks half the size of $20 → $40, though both are +100%.", check: "Use log scale on long-term charts." },
  { trap: "Extended-hours bars", what: "Thin, wide-spread trading adds spikes and gaps, and changes indicator values.", check: "Know whether the chart includes, separates or hides them." },
  { trap: "Bar interval behind an indicator", what: "RSI(14) on 5-minute bars is not RSI(14) on daily bars.", check: "Read the interval, not only the period." },
  { trap: "Line vs candlestick", what: "A closing-price line hides highs, lows and opening gaps.", check: "Switch to candles before judging a move." },
  { trap: "Delayed or single-venue data", what: "Free feeds can be delayed or come from one exchange.", check: "Find out what feed your chart uses." },
  { trap: "Unadjusted splits", what: "An unadjusted 2-for-1 split looks like a 50% crash and can trigger sell signals.", check: "Use split-adjusted history for signals." },
  { trap: "Indicator warm-up", what: "Smoothed indicators (EMA, RSI, ATR) depend on where the calculation starts.", check: "Compare with a platform that uses long history; StockCharts uses at least 250 periods." },
];

export const ROBINHOOD_POINTS: string[] = [
  "Indicators sit behind the Advanced chart, and the app and classic web offer 7 of them.",
  "Indicator periods count bars of an interval that changes with the time span: on 1D the interval is 5 minutes, so MA(8) covers 40 minutes, not 8 days. The same MA(8) means something different on every tab.",
  "Robinhood says indicators are calculated over the selected time span, so values near the left edge can differ from platforms that compute from longer history.",
  "1D and 1W charts include overnight and pre-market trading, so thin sessions shape the chart and its indicators.",
  "Robinhood says charts may not account for splits and dividends, which can create false gaps and false signals.",
  "The simple chart is a closing-price line, with candlesticks as an option; a line hides intrabar highs, lows and gaps.",
  "Fair to note: Legend (desktop) lists far more indicators, including stochastics and ATR. The limits above apply mainly to the mobile app and classic web.",
];

export const WEBULL_POINTS: string[] = [
  "60+ indicators, including KDJ (also a screener condition), MACD and RSI, plus technical signals and candlestick-pattern recognition.",
  "Chart controls that prevent common illusions: extended hours combined, separated or hidden; linear, log or percentage axis; corporate-action markers.",
  "Intervals down to 1 tick, multi-chart grids, symbol comparison, historical replay, paper trading, and a Script Editor on desktop and web.",
  "For overbought and oversold, use bounded oscillators such as RSI, stochastics or KDJ. MACD is unbounded, so it shows momentum and crossovers, not overbought or oversold levels.",
];
export const WEBULL_SOURCES: Src[] = [
  s("Webull charts & tools", "https://www.webull.com/charts-tools"),
  s("Webull: customize charts", "https://www.webull.com/learn/PEyJYP/SvfXUX/How-to-Customize-Your-Charts"),
  s("Webull: customizable screener (KDJ)", "https://www.webull.com/learn/courseware/mrVjL7/Customizable-Screener"),
  s("Webull: platform navigation (Script Editor)", "https://www.webull.com/help/faq/11033-General-Platform-Navigation"),
];

// ---------------------------------------------------------------- #22 example Webull-style screens (look-alikes, illustrative numbers)
export interface ScreenshotDef { id: string; src: string; srcSmall: string; width: number; height: number; alt: string; title: string; captions: string[] }
export const WEBULL_SCREENSHOTS: ScreenshotDef[] = [
  {
    id: "webull-pl-calendar",
    src: "/screenshots/webull-pl-calendar.webp",
    srcSmall: "/screenshots/webull-pl-calendar-480.webp",
    width: 640, height: 781,
    title: "P&L Calendar (month view)",
    alt: "Example Webull-style P&L Calendar with illustrative numbers, month view for August 2026: Monday Jul 27 to Friday Jul 31 show +42.18, +19.65, +73.04, +36.27 and +58.90, and Today shows +184.36, all in green.",
    captions: [
      "Each day shows that day's total profit or loss across your assets: trades closed that day plus the day's change in positions you still hold, after fees.",
      "Useful for spotting overtrading and streaks: a run of busy days, or a habit of trading more after a loss.",
      "A green week doesn't mean the account is up overall. Daily P&L measures change from the previous close; open P&L measures against what you paid.",
    ],
  },
  {
    id: "webull-assets",
    src: "/screenshots/webull-assets.webp",
    srcSmall: "/screenshots/webull-assets-480.webp",
    width: 1080, height: 1146,
    title: "Assets tab",
    alt: "Example Webull-style Assets tab with illustrative numbers: Total Account Value $6,482.60; Open P&L −1,093.80 (−15.07%); Day's P&L −36.92 (−0.57%); Market Value 6,164.35; Cash Balance 318.25; Risk Level Safe; Buying Power 512.40; Options BP 12.40; Crypto BP 512.40; Settled Cash 512.40; Unsettled Cash 0.00.",
    captions: [
      "Open P&L (−15.07%) is unrealized: (last price − average cost) × shares, across what you hold now. Day's P&L (−0.57%) is just today's change.",
      "A calendar of green days can sit alongside −15% open P&L: the days measure change from each prior close, while open P&L still counts from your original cost.",
      "Cash, Buying Power, and Settled vs Unsettled Cash are different numbers. US stock trades settle T+1 (one business day after the trade, since May 28, 2024), so sale proceeds show as unsettled until then.",
      "Options BP is tracked separately and can be far lower than stock buying power. Check it before an options order.",
      "Risk Level is Webull's margin-call indicator: Safe means no margin call right now, not that the positions are safe from losses.",
    ],
  },
];
export const WEBULL_SCREEN_SOURCES: Src[] = [
  s("Webull: Profit and Loss (P&L)", "https://www.webull.com/help/faq/10691-Profit-and-Loss-P-L"),
  s("Webull: P&L calendar", "https://www.webull.hk/en/help/faq/1679-What-does-profit-and-loss-analysis-consist-of"),
  s("Webull: margin calls (Risk Level)", "https://www.webull.com/help/faq/10849-Margin-calls-in-a-margin-account"),
  s("Investor.gov: T+1 settlement", "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/new-t1-settlement-cycle-what-investors-need-know-investor-bulletin"),
];

// ---------------------------------------------------------------- #7 how brokers teach
export const BROKER_LEARN: { name: string; url: string; offers: string }[] = [
  { name: "Webull Learn", url: "https://www.webull.com/learn", offers: "Courses on stocks, options and charting, tied to Webull's own tools and paper trading" },
  { name: "Fidelity Learning Center", url: "https://www.fidelity.com/learning-center/overview", offers: "Articles, videos and webinars on investing, trading and retirement" },
  { name: "Schwab Learn", url: "https://www.schwab.com/learn", offers: "Articles, courses and live sessions, including thinkorswim education" },
  { name: "Robinhood Learn", url: "https://learn.robinhood.com/", offers: "Short beginner articles and a glossary" },
  { name: "tastytrade Learn", url: "https://www.tastytrade.com/learn", offers: "Guides on stocks, options, futures and more, for all experience levels" },
];
export const PFOF_TEXT =
  "Broker education is free partly because brokers earn when you trade. Many earn payment for order flow: market makers and exchanges pay the broker to route customer orders to them. It's legal, and brokers must disclose it on trade confirmations, with details on written request. It's one reason a broker benefits when its lessons lead you to trade more often. Learn the material, then decide how often to trade for your own reasons.";
export const PFOF_SOURCES: Src[] = [
  s("Investor.gov: How to read confirmation statements", "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-62"),
  s("FINRA Regulatory Notice 21-23 (best execution and PFOF)", "https://www.finra.org/rules-guidance/notices/21-23"),
  s("Investopedia: payment for order flow", "https://www.investopedia.com/terms/p/paymentoforderflow.asp"),
];
export const LEARNING_PATH: { stage: string; what: string }[] = [
  { stage: "Month 1", what: "Broker tutorials about an hour a day: order types, charts, risk." },
  { stage: "About a year", what: "Paper trade with a written plan and a journal. Options in particular take months to understand." },
  { stage: "Then", what: "Real money in small size, with the same rules. No result is promised at any stage." },
];
export const LEARNING_CHECKLIST: string[] = [
  "I can explain market, limit, stop and stop-limit orders.",
  "I've read the chart settings: interval, scale, extended hours, adjusted data.",
  "I keep a paper-trading journal with entry, exit, reason and result.",
  "I know how my broker makes money, including payment for order flow.",
  "I know my broker's margin and day-trading rules.",
];

// ---------------------------------------------------------------- glossary
const term = (id: string, name: string, category: LiteracyTerm["category"], summary: string, detail: string): LiteracyTerm => ({ id, name, category, summary, detail: `${detail} Educational, not advice.` });
export const CHART_APP_TERMS: LiteracyTerm[] = [
  term("log-scale", "Log (logarithmic) price scale", "markets", "A price axis where equal percentage moves take equal height.", "On a linear axis $10 → $20 looks half the size of $20 → $40, though both are +100%. Use log scale for long-term charts."),
  term("adjusted-prices", "Split- and dividend-adjusted prices", "markets", "Historical prices rescaled so splits and dividends don't show as fake gaps.", "An unadjusted 2-for-1 split looks like a 50% crash. Adjusted history won't show the actual price you paid back then."),
  term("indicator-warm-up", "Indicator warm-up", "process", "Smoothed indicators depend on how much history the calculation starts with.", "EMA, RSI and ATR values can differ between platforms if one computes only from the visible span; StockCharts uses at least 250 periods."),
  term("payment-for-order-flow", "Payment for order flow (PFOF)", "markets", "Payments a broker receives for routing customer orders to a market maker or exchange.", "Legal and disclosed on trade confirmations. It gives brokers a reason to want you to trade often."),
  term("open-pnl", "Open (unrealized) P&L", "position", "Profit or loss on positions you still hold: (last price − average cost) × shares.", "It isn't locked in until you sell. Day's P&L is only today's change; a green day can sit inside a red open P&L."),
  term("settled-cash", "Settled vs unsettled cash", "position", "Settled cash has completed the trade's settlement; unsettled cash is sale proceeds still settling.", "US stock trades settle T+1, one business day after the trade, since May 28, 2024. In a cash account, buying with unsettled funds and selling before they settle can cause a good-faith violation."),
];

// ---------------------------------------------------------------- Learn questions
type Letter = "A" | "B" | "C" | "D";
const LT: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(LT.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: LT[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}
export const CHART_APP_QUESTIONS: QuizQuestion[] = [
  mc("CHA-01", "On Robinhood's 1D chart (5-minute bars), MA(8) covers about…", "B", "40 minutes", ["8 days", "8 hours", "8 weeks"], "8 bars × 5 minutes. Always check the interval behind an indicator."),
  mc("CHA-02", "Why use a log scale on a 10-year chart?", "A", "Equal percentage moves take equal height", ["It hides losses", "It's required by the SEC", "It removes extended hours"], "Linear scale exaggerates recent moves on long charts.", "log-scale"),
  mc("CHA-03", "An unadjusted 2-for-1 split on a chart looks like…", "C", "A 50% crash that can trigger false sell signals", ["Nothing changes", "A 100% gain", "A trading halt"], "Use split-adjusted history for signals.", "adjusted-prices"),
  mc("CHA-04", "Which is a bounded oscillator suited to overbought and oversold readings?", "D", "RSI", ["MACD", "Volume", "A 50-day moving average"], "MACD is unbounded: it shows momentum and crossovers, not fixed overbought levels.", "kdj"),
  mc("CHA-05", "TradingView's free default US stock data comes from…", "B", "Cboe only, so thin or extended-hours bars can differ from the primary exchange", ["Every US exchange combined", "Delayed Nasdaq data", "Robinhood"], "Paid exchange feeds give primary-exchange data."),
  mc("CHA-06", "A line chart of closing prices hides…", "A", "Intrabar highs, lows and opening gaps", ["The closing price", "The date", "The ticker"], "Switch to candles before judging a move."),
  mc("CHA-07", "Two platforms show different EMA values for the same stock and interval. A likely reason?", "C", "Different warm-up: one computes from more history", ["One is illegal", "EMA is random", "The market was closed"], "Smoothed indicators depend on where the calculation starts.", "indicator-warm-up"),
  mc("CHA-08", "Why is broker education free?", "D", "Partly because brokers earn when you trade, including payment for order flow", ["Regulators pay for it", "It's always ad-free charity", "Brokers lose money on it on purpose"], "PFOF is legal and disclosed on confirmations. Learn, then decide how often to trade for your own reasons.", "payment-for-order-flow"),
  mc("CHA-09", "Payment for order flow is…", "B", "Payment a broker receives for routing customer orders to a market maker or venue", ["A fee you pay per order", "A tax on day trades", "Interest on cash"], "It must be disclosed on trade confirmations.", "payment-for-order-flow"),
  mc("CHA-10", "A sensible path from zero to real money is…", "A", "Tutorials for a month, about a year of paper trading, then small real positions", ["Real money on day one to learn faster", "One weekend of videos", "Wait for a guaranteed return first"], "No stage promises a result. Options take months to understand."),
  mc("CHA-11", "In the example Webull Assets screen, Open P&L is −15.07% and Day's P&L is −0.57%. What's the difference?", "C", "Open P&L counts from your average cost on what you still hold; Day's P&L is only today's change", ["They're the same number in different units", "Day's P&L includes deposits", "Open P&L is realized gains"], "Open P&L is unrealized: (last price − average cost) × shares.", "open-pnl"),
  mc("CHA-12", "The example screen shows Buying Power 512.40 and Options BP 12.40. What does that tell you?", "D", "Options buying power is tracked separately and is much lower here, so check it before an options order", ["You can buy $512 of options", "Options BP is always equal to cash", "The account is in a margin call"], "Stock, options and crypto buying power are separate lines."),
  mc("CHA-13", "A P&L calendar shows five green days, yet open P&L is −15%. How?", "B", "Daily P&L measures change from each prior close; open P&L still counts from the original cost", ["The calendar is wrong", "Green days are unrealized only", "Open P&L ignores losses"], "A green streak doesn't mean the account is up overall.", "open-pnl"),
  mc("CHA-14", "Since May 28, 2024, US stock trades settle…", "A", "T+1: one business day after the trade", ["Instantly", "T+2", "T+5"], "Sale proceeds show as unsettled until then.", "settled-cash"),
];
