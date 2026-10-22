/**
 * Automated & algo trading (2026) and stops for news events (/practice/algo-trading). Facts as of 2026-10-22 from
 * broker docs, FINRA, the SEC, the CFTC, BLS and the Fed; each row carries its source. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";

export const AS_OF = "2026-10-22";
export interface Src { label: string; url: string }
const s = (label: string, url: string): Src => ({ label, url });

export const SRC = {
  finra1509: s("FINRA Regulatory Notice 15-09", "https://www.finra.org/rules-guidance/notices/15-09"),
  qcResearch: s("QuantConnect research guide", "https://www.quantconnect.com/docs/v2/writing-algorithms/key-concepts/research-guide"),
  qcRisks: s("QuantConnect live trading risks", "https://www.quantconnect.com/docs/v2/cloud-platform/live-trading/risks"),
  qcBrokers: s("QuantConnect brokerages", "https://www.quantconnect.com/docs/v2/cloud-platform/live-trading/brokerages"),
  alpacaPaper: s("Alpaca paper trading", "https://docs.alpaca.markets/docs/paper-trading"),
  alpacaOrders: s("Alpaca orders", "https://docs.alpaca.markets/docs/orders-at-alpaca"),
  ttSandbox: s("tastytrade sandbox", "https://developer.tastytrade.com/docs/sandbox.md"),
  tt: s("tastytrade developer", "https://developer.tastytrade.com/"),
  ibkr: s("IBKR Web API", "https://www.interactivebrokers.com/campus/ibkr-api-page/web-api-trading/"),
  tradier: s("Tradier getting started", "https://docs.tradier.com/docs/getting-started"),
  webullApi: s("Webull Trade API overview", "https://developer.webull.com/apis/trade-api/overview.md"),
  etrade: s("E*TRADE developer", "https://developer.etrade.com/getting-started"),
  schwabPaper: s("Schwab thinkorswim paperMoney", "https://www.schwab.com/trading/thinkorswim/paper-trading"),
  rhAgents: s("Robinhood: open to agents (May 27, 2026)", "https://robinhood.com/us/en/newsroom/robinhood-is-now-open-to-agents/"),
  rhThirdParty: s("Robinhood third-party connections", "https://robinhood.com/us/en/support/articles/third-party-connections/"),
  rhCrypto: s("Robinhood Crypto API", "https://robinhood.com/us/en/support/articles/crypto-api/"),
  rhStop: s("Robinhood stop orders", "https://robinhood.com/us/en/support/articles/stop-order/"),
  rhTpSl: s("Robinhood take profit / stop loss", "https://robinhood.com/us/en/support/articles/take-profit-stop-loss/"),
  ntApi: s("NinjaTrader / Tradovate API", "https://docs.ninjatrader.com/api/authentication.md"),
  tvWebhooks: s("TradingView webhooks", "https://www.tradingview.com/support/solutions/43000529348-about-webhooks/"),
  cftc: s("CFTC disruptive trading practices", "https://www.cftc.gov/sites/default/files/idc/groups/public/@newsroom/documents/file/dtp_factsheet.pdf"),
  usc78i: s("Exchange Act §9(a)(1), 15 U.S.C. 78i", "https://www.law.cornell.edu/uscode/text/15/78i"),
  secStops: s("SEC Investor Bulletin: stop, stop-limit and trailing stop orders", "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15"),
  finraStops: s("FINRA: stop orders in volatile markets", "https://www.finra.org/investors/insights/stop-orders-factors-consider-during-volatile-markets"),
  finraGuardrails: s("FINRA: guardrails for market volatility", "https://www.finra.org/investors/insights/guardrails-market-volatility"),
  finraExt: s("FINRA: extended-hours trading", "https://www.finra.org/investors/insights/extended-hours-trading"),
  bls: s("BLS CPI release schedule", "https://www.bls.gov/schedule/news_release/cpi.htm"),
  blsJobs: s("BLS Employment Situation schedule", "https://www.bls.gov/schedule/news_release/empsit.htm"),
  fomc: s("Federal Reserve FOMC calendar", "https://www.federalreserve.gov/monetarypolicy/fomccalendars.htm"),
  atr: s("StockCharts ChartSchool: ATR", "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/average-true-range-atr-and-average-true-range-percent-atrp"),
  oicLongCall: s("OIC: long call", "https://www.optionseducation.org/strategies/all-strategies/long-call"),
};

export interface BrokerApiRow { broker: string; paper: string; assets: string; notes: string; sources: Src[] }
export const BROKER_APIS: BrokerApiRow[] = [
  { broker: "Alpaca", paper: "Free paper account ($100k default), separate keys", assets: "US stocks and ETFs, options, crypto", notes: "API key + secret; bracket orders are one-triggers-OCO", sources: [SRC.alpacaPaper, SRC.alpacaOrders] },
  { broker: "Interactive Brokers", paper: "Separate paper username", assets: "Multi-asset", notes: "TWS API (via TWS or IB Gateway) or Web API; individuals need a funded IBKR Pro account, even for paper", sources: [SRC.ibkr] },
  { broker: "Charles Schwab", paper: "thinkorswim paperMoney is a simulator in the app, not an API", assets: "Equities, options", notes: "Trader API replaced the TD Ameritrade API (shut off May 2024); OAuth", sources: [SRC.schwabPaper] },
  { broker: "Tradier", paper: "Free paper sandbox with its own token", assets: "Stocks, ETFs, options", notes: "Bracket orders supported", sources: [SRC.tradier] },
  { broker: "tastytrade", paper: "Sandbox with unrealistic fills (tests plumbing, not strategy)", assets: "Equities, options, futures, crypto", notes: "OTO / OCO / OTOCO", sources: [SRC.tt, SRC.ttSandbox] },
  { broker: "Webull", paper: "Sandbox (paper) approved in minutes", assets: "Stocks, options, futures, crypto", notes: "OTO / OCO / OTOCO for equities; extended and overnight sessions for stocks", sources: [SRC.webullApi] },
  { broker: "E*TRADE", paper: "Separate sandbox and production keys", assets: "Equities, options", notes: "OAuth consumer key; API and market-data agreements", sources: [SRC.etrade] },
  { broker: "Robinhood", paper: "No public stock-trading API", assets: "Crypto API; agentic-trading beta for equities (since May 27, 2026)", notes: "Agents trade through Robinhood's MCP servers in a dedicated agentic account; other third-party trading apps need written authorization", sources: [SRC.rhAgents, SRC.rhThirdParty, SRC.rhCrypto] },
  { broker: "NinjaTrader / Tradovate", paper: "Demo environment", assets: "Futures", notes: "Server-side risk settings: position limits, daily loss limits, trailing max drawdown with auto-liquidation", sources: [SRC.ntApi] },
];

export const BACKTEST_TRAPS: { name: string; what: string; fix: string; source: Src }[] = [
  { name: "Overfitting", what: "Tuning rules until they fit past noise: great in the backtest, poor live.", fix: "Keep an out-of-sample period, walk forward, then paper trade.", source: SRC.qcResearch },
  { name: "Look-ahead bias", what: "Using data that wasn't available at decision time, such as statements dated at period end instead of the filing date.", fix: "Use point-in-time data and filing dates.", source: SRC.qcResearch },
  { name: "Survivorship bias", what: "Testing only today's index members, so the companies that failed disappear.", fix: "Use historical constituents, including delisted names.", source: SRC.qcResearch },
  { name: "Costs and slippage", what: "Assuming every fill is at the signal price with no fees.", fix: "Model spread, commissions and slippage.", source: SRC.qcResearch },
  { name: "Optimistic paper fills", what: "Alpaca's paper trading does not model market impact, queue position, latency slippage, price improvement, regulatory fees or dividends.", fix: "Treat paper results as a best case.", source: SRC.alpacaPaper },
  { name: "Live-only risks", what: "Outages, data-feed problems and reconnections never show up in a backtest.", fix: "Alerts, a kill switch and broker-held stops.", source: SRC.qcRisks },
];

export const BOT_CONTROLS: string[] = [
  "A kill switch: one action that stops the bot and cancels its orders (FINRA expects firms to be able to disable an algorithm quickly).",
  "A maximum daily loss that halts trading, ideally enforced by the broker.",
  "Position limits per symbol and a maximum number of orders per minute (respect the broker's rate limits).",
  "Alerts when the bot disconnects, errors or gets rate-limited.",
  "Self-trade prevention, so the bot never buys from and sells to itself.",
];

export const API_KEY_RULES: string[] = [
  "Never put credentials in a webhook message (TradingView says so explicitly).",
  "Keep paper and live keys separate (Alpaca, Tradier, E*TRADE and tastytrade issue them separately).",
  "Store secrets in environment variables or a secrets manager, never in a code repository.",
  "Use the least access needed (read-only keys for dashboards) and rotate a key if it leaks.",
];

export const LEGAL_RULES: { name: string; text: string; source: Src }[] = [
  { name: "Spoofing", text: "Placing bids or offers you intend to cancel before they execute is illegal, including false depth and during pre-open or halts. It requires intent.", source: SRC.cftc },
  { name: "Wash trades and matched orders", text: "Trades with no change in beneficial ownership, or matched orders that create a false appearance of activity, are prohibited, even if a bot placed them.", source: SRC.usc78i },
];

export const STOP_TYPES: { order: string; inAGap: string; use: string }[] = [
  { order: "Stop (stop-market)", inAGap: "Becomes a market order when triggered; the fill can be far from the stop.", use: "When getting out matters more than the price." },
  { order: "Stop-limit", inAGap: "Becomes a limit order; if price gaps through the limit it may never fill, and you keep the position.", use: "When the price matters more than getting out." },
  { order: "Trailing stop", inAGap: "The stop follows price by a set amount or percent; when triggered it is usually a market order.", use: "Protecting gains in a trend." },
  { order: "Bracket / OCO", inAGap: "Target and stop placed together; in a fast market both legs can fill before one cancels the other.", use: "Setting both exits before an event; check for an accidental reverse position after a spike." },
  { order: "Long option (defined risk)", inAGap: "The most you can lose is the premium; implied volatility often falls after the event, cutting the option's value.", use: "An event view without a stop that can gap." },
];

export const HALT_FACTS: string[] = [
  "Limit Up–Limit Down bands around a 5-minute average price: 5% for Tier 1 stocks (S&P 500, Russell 1000, some ETPs) over $3, 10% for Tier 2 stocks over $3, 20% from $0.75 to $3. If a stock stays at a band for 15 seconds, trading pauses for 5 minutes.",
  "LULD applies 9:30 AM–4:00 PM ET, and the bands double from 3:35 PM ET for Tier 1 and for Tier 2 stocks up to $3.",
  "Market-wide circuit breakers on the S&P 500: −7% (Level 1) and −13% (Level 2) halt trading for 15 minutes if before 3:25 PM ET; −20% (Level 3) closes the market for the day.",
  "A stop cannot fill during a halt. When trading resumes it fills at or near the reopening price, which can be far past the stop.",
];

export const NEWS_TIMES: string[] = [
  "CPI and the jobs report are released at 8:30 AM ET (5:30 AM PT), before the regular session. Upcoming: Employment Situation Nov 6 and Dec 4, 2026; CPI Nov 10 and Dec 10, 2026 (BLS schedules).",
  "FOMC: eight scheduled meetings a year; the remaining 2026 meetings are Oct 27–28 and Dec 8–9 (Federal Reserve calendar). Check the Fed's calendar for the statement time.",
  "Extended hours (sessions vary by broker): pre-market from about 7:00 AM ET, after-hours 4–8 PM ET, overnight 8 PM–4 AM ET. Liquidity is thinner, spreads are wider, and many brokers accept only limit orders; most options don't trade then.",
  "Many brokers trigger stops only in regular hours. A regular-hours stop stays asleep through an 8:30 AM ET shock and fills at or near the 9:30 AM ET open.",
];

export const NEWS_PLAYBOOK: { step: string; why: string }[] = [
  { step: "Check the BLS and Fed calendars and earnings dates each week, in ET and your own time zone.", why: "Know when the event lands." },
  { step: "Reduce or flatten before the release.", why: "No position, no gap risk." },
  { step: "If you hold, widen the stop and cut the size so the dollar risk stays the same.", why: "Room for noise without risking more." },
  { step: "Set a no-entry window around the release.", why: "Spreads are widest and fills worst right around the print." },
  { step: "Choose stop-market when exiting matters more, stop-limit when price matters more.", why: "One fills but can slip; the other controls price but may not fill." },
  { step: "Consider a defined-risk option instead of a stop for an event view.", why: "Max loss is the premium, but expect implied volatility to drop afterwards." },
  { step: "Keep stops at the broker (server-side), not only in a script or webhook.", why: "A broker-held stop survives a crashed laptop or a failed webhook." },
  { step: "After a spike, check whether both bracket legs filled.", why: "Cancellation is not instantaneous." },
];

/** ATR sizing: shares = dollar risk ÷ (multiple × ATR), rounded down. */
export function atrShares(dollarRisk: number, atr: number, multiple: number): number {
  return Math.floor(dollarRisk / (atr * multiple));
}
export const ATR_EXAMPLE = { risk: 200, atr: 2, normal: 1.5, newsDay: 3 };

// ---------------------------------------------------------------- glossary
const term = (id: string, name: string, category: LiteracyTerm["category"], summary: string, detail: string): LiteracyTerm => ({ id, name, category, summary, detail: `${detail} Educational, not advice.` });
export const ALGO_TERMS: LiteracyTerm[] = [
  term("algorithmic-trading", "Algorithmic (rule-based) trading", "process", "Entries, exits and sizing written as explicit rules a computer can backtest and execute.", "Discretionary traders decide each trade; systematic traders write the rules first. The firm or person running an algorithm is responsible for what it does."),
  term("backtesting", "Backtesting", "process", "Running trading rules on past data to see how they would have done.", "Traps: overfitting, look-ahead bias, survivorship bias and ignoring costs. Keep an out-of-sample period and paper trade before going live."),
  term("overfitting", "Overfitting", "process", "Tuning a strategy so closely to past data that it fits noise, not a real edge.", "Signs: many parameters, great in-sample results, poor results on new data. Fix: out-of-sample and walk-forward tests."),
  term("look-ahead-bias", "Look-ahead bias", "process", "Using information in a backtest that wasn't available at the time of the decision.", "Example: financial statements dated at the period end rather than when they were filed."),
  term("kill-switch", "Kill switch", "process", "One action that stops a trading bot and cancels its open orders.", "FINRA expects firms to be able to disable an algorithm quickly with a minimal number of steps. A retail bot needs one too, plus loss and position limits."),
  term("webhook", "Webhook", "process", "An automatic HTTP message one service sends another when something happens, such as a chart alert firing.", "TradingView webhooks time out after 3 seconds and can occasionally fail, so a webhook should never be your only stop-loss. Never put credentials in the message."),
  term("api-key", "API key", "process", "A credential that lets a program act on your account.", "Keep paper and live keys separate, store them outside your code, use the least access needed and rotate a leaked key."),
  term("spoofing", "Spoofing", "markets", "Placing orders you intend to cancel before they execute, to mislead other traders. Illegal.", "The CFTC fact sheet covers false depth and spoofing during pre-open and halts; FINRA Rule 5210 covers securities."),
  term("wash-trade", "Wash trade", "markets", "A trade with no real change in ownership, such as buying from and selling to yourself. Illegal.", "Prohibited by Exchange Act §9(a)(1). A buggy bot can create them; use self-trade prevention."),
  term("luld", "Limit Up–Limit Down (LULD)", "markets", "Price bands that pause a single stock for 5 minutes when it stays at a band for 15 seconds.", "5% for Tier 1 stocks over $3, 10% for Tier 2 over $3, 20% from $0.75 to $3; doubled from 3:35 PM ET for Tier 1 and Tier 2 up to $3. Stops can't fill during the pause."),
  term("circuit-breaker", "Market-wide circuit breaker", "markets", "A halt of all US stock trading when the S&P 500 falls 7%, 13% or 20% from the prior close.", "Levels 1 and 2 halt for 15 minutes if before 3:25 PM ET; Level 3 ends trading for the day."),
  term("server-side-stop", "Broker-held (server-side) stop", "position", "A stop order held by the broker, not by your script or computer.", "It survives a crashed laptop, a lost connection or a failed webhook. A script's 'if price < X then sell' does not."),
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
const { risk, atr, normal, newsDay } = ATR_EXAMPLE;
export const ALGO_QUESTIONS: QuizQuestion[] = [
  mc("AL-01", "A stop-market order guarantees…", "B", "Execution once triggered, not the price", ["The stop price", "Both price and execution", "Nothing at all"], "It becomes a market order and can fill far from the stop in a gap.", "stop-order"),
  mc("AL-02", "A stop-limit order guarantees…", "C", "The limit price if it fills, not that it fills", ["Execution", "The stop price", "A fill at the open"], "If price gaps through the limit, it may never fill.", "stop-limit-order"),
  mc("AL-03", "CPI comes out at 8:30 AM ET. Your stop works only in regular hours. What's the risk?", "A", "It can fill at or near a gap open at 9:30 AM ET, far past the stop", ["None: stops are price guarantees", "It fills at 8:30 AM exactly", "It's cancelled automatically"], "A regular-hours stop sleeps through the release."),
  mc("AL-04", "In a fast market, a bracket's target and stop can…", "D", "Both fill, because cancellation isn't instantaneous", ["Never both fill", "Turn into a market buy", "Only fill after hours"], "Alpaca and Robinhood both warn about it. Check for an accidental reverse position."),
  mc("AL-05", `You risk $${risk} and ATR is $${atr}. Normal stop ${normal}×ATR; news-day stop ${newsDay}×ATR. Shares on the news day?`, "B", `${atrShares(risk, atr, newsDay)}`, [`${atrShares(risk, atr, normal)}`, `${risk / atr}`, "200"], `Shares = dollar risk ÷ stop distance: $${risk} ÷ $${atr * newsDay} ≈ ${atrShares(risk, atr, newsDay)} (normal day: ${atrShares(risk, atr, normal)}). Same dollar risk, more room.`),
  mc("AL-06", "Extended-hours orders at many brokers must be…", "C", "Limit orders", ["Market orders", "Stop orders", "Bracket orders"], "Thin liquidity and wide spreads; FINRA notes brokers may accept only limit orders."),
  mc("AL-07", "A stock sits at its LULD band for 15 seconds. What happens?", "A", "A 5-minute trading pause", ["The market closes for the day", "Nothing", "All stops fill at the band"], "LULD pauses a single stock; market-wide circuit breakers halt everything.", "luld"),
  mc("AL-08", "Which backtest mistake uses data not available at decision time?", "D", "Look-ahead bias", ["Survivorship bias", "Overfitting", "Slippage"], "Example: statements dated at period end instead of filing date.", "look-ahead-bias"),
  mc("AL-09", "Testing only on today's S&P 500 members inflates results because of…", "B", "Survivorship bias", ["Look-ahead bias", "Spoofing", "LULD"], "Companies that failed or were removed vanish from the test."),
  mc("AL-10", "Why are paper-trading results usually better than live?", "C", "Paper fills ignore market impact, queue position and latency slippage", ["Paper uses delayed data", "Live trading has no fees", "They're always identical"], "Alpaca lists what its paper engine doesn't model.", "backtesting"),
  mc("AL-11", "Which risk control should every bot have?", "A", "A kill switch plus daily-loss and position limits", ["Unlimited order rate", "Keys stored in the code", "A webhook as the only stop"], "FINRA expects algorithms to be quickly disabled; brokers can enforce loss limits server-side.", "kill-switch"),
  mc("AL-12", "Your stop lives in a script that watches price. Why is a broker-held stop safer?", "D", "It still works if your laptop crashes, the connection drops or a webhook fails", ["It's always filled at the stop price", "It's free", "Brokers ban scripts"], "TradingView says webhooks can occasionally fail; scripts can crash.", "server-side-stop"),
  mc("AL-13", "A bot buys from and sells to itself across your own accounts. That can be…", "B", "Illegal wash trading", ["Arbitrage", "Hedging", "A kill switch"], "Exchange Act §9(a)(1) prohibits wash trades and matched orders.", "wash-trade"),
  mc("AL-14", "Placing large orders you intend to cancel to move the price is…", "C", "Spoofing, which is illegal", ["Market making", "A bracket", "Legal if a bot does it"], "Intent to cancel before execution is the key element.", "spoofing"),
  mc("AL-15", "Does Robinhood offer a public stock-trading API?", "A", "No; it has a crypto API and, since May 2026, an agentic-trading beta for equities through its own servers", ["Yes, the same as Alpaca", "Only for options", "Only for futures"], "Other third-party trading apps need Robinhood's written authorization."),
  mc("AL-16", "Where should an API secret live?", "D", "In an environment variable or secrets manager, never in a repo or webhook body", ["In the webhook message", "In the code, so it's easy to find", "In a public note"], "Also keep paper and live keys separate.", "api-key"),
  mc("AL-17", "The S&P 500 falls 7% at 11:00 AM ET. What happens?", "B", "A 15-minute market-wide halt (Level 1)", ["Trading ends for the day", "Nothing until −20%", "Only that day's options halt"], "Level 1 (−7%) and Level 2 (−13%) halt 15 minutes before 3:25 PM ET; Level 3 (−20%) ends the day.", "circuit-breaker"),
];

export const ALGO_SOURCES: Src[] = Object.values(SRC);
