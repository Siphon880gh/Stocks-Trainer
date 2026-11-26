/**
 * Dashboard numbers (DN1): three units that fill the gaps found when the mock-dashboard Learn glossary was checked
 * against this app. Each unit sits beside the lessons it extends:
 * - L2 `gap-days` · `l2-gap-day-numbers`: data freshness (end-of-day, delayed, real-time, rate limits), the gap and the
 *   pre-market session, relative volume and float turnover, high spike and high fade, close vs open, and why a handful
 *   of gap days is not a statistic.
 * - L3 `review-results` · `l3-grade-your-trades`: win rate vs expectancy, profit factor, drawdown recovery math, the
 *   equity curve and the trade journal.
 * - L4 `positioning` · `l4-positioning-signals`: short interest vs daily short volume, days to cover and % of float,
 *   the put/call ratio, options flow, and insider buys and sells.
 * Topics the app already teaches (indicators, orders, fundamentals, macro, wrappers) are linked, not repeated.
 * Every number is SAMPLE or simulated. Educational, not advice.
 */
import type { Unit } from "../types";
import type { RawItem } from "./quizBuilder";
import type { ToolSimulation } from "../../toolTraining/types";
import { simBar } from "../../toolTraining/simWalk";
import { cardWithSims } from "./simulations";

// ---------------------------------------------------------------- simulations

const GAP_DAY: ToolSimulation = {
  kind: "bars",
  id: "ac-gap-day-numbers",
  title: "One gap day, read by the numbers",
  goal: "Walk six SAMPLE half-hour bars of a stock that gaps up 12% to see how the pre-market high, relative volume, float turnover, high spike, high fade and close vs open are each measured.",
  tape: "SAMPLE stock · previous close 20.00 · half-hour bars · simulated volume",
  start: 1,
  bars: [
    simBar("9:30", [22.4, 23.3, 22.3, 23.1], "The stock opens at 22.40, 12% above the 20.00 previous close, and pushes past the 22.80 pre-market high.", "The gap is measured from the previous close to the open. The pre-market high is the top of the thin 4:00 to 9:30 AM ET session, so a break above it is the first thing many traders watch.", { readout: "Pre-market high 22.80 · pre-market volume 1.2M" }),
    simBar("10:00", [23.1, 23.7, 22.9, 23.5], "The high of the day prints at 23.70 in the first hour.", "High spike = (high − open) ÷ open = (23.70 − 22.40) ÷ 22.40, about 5.8%. Note the time too: early highs are common on gap days, but not a rule.", { mark: "high", readout: "Rel vol 4× by 10:30" }),
    simBar("10:30", [23.5, 23.6, 22.7, 22.85], "Price falls back under the pre-market high.", "A level that was broken and then lost is information, not a signal by itself. The question is whether buyers return or the fade continues."),
    simBar("11:00", [22.85, 23.0, 22.2, 22.35], "It slips below the 22.40 open and under VWAP.", "Change vs open turns negative here. VWAP is the average price paid since the open, weighted by volume, so most of today's buyers are now holding a loss."),
    simBar("13:00", [22.35, 22.6, 21.8, 21.95], "A quiet midday drift lower on lighter volume.", "Volume thins at midday. By the close, 18M shares against a 2M average is 9× relative volume, and 18M ÷ 15M float shares is 1.2× float turnover."),
    simBar("15:30", [21.95, 22.1, 21.4, 21.6], "It closes at 21.60: red against the open, still 8% above yesterday.", "High fade = (23.70 − 21.60) ÷ 23.70, about 8.9%. Open to close = 21.60 ÷ 22.40 − 1, about −3.6%. The gap did not fill: the low of 21.40 stayed above 20.00.", { mark: "signal", readout: "Day volume 18M · avg 2M · float 15M" }),
  ],
  takeaway: "A gap day has several numbers; each one is measured from a named price, and one day proves nothing about the next.",
};

const GAP_STATS: ToolSimulation = {
  kind: "columns",
  id: "ac-gap-day-stats",
  title: "Six gap days are not a statistic",
  goal: "Read six SAMPLE gap-up days one column at a time to see how a close-red share and an average return are built, and why a sample this small cannot support a rule.",
  tape: "SAMPLE stock · six gap-up days · simulated",
  start: 1,
  columns: ["Day", "Gap", "Relative volume", "High spike", "Close vs open", "Gap filled?"],
  rows: [
    ["Day 1", "+12%", "6.0×", "+4%", "−3%", "No"],
    ["Day 2", "+8%", "2.1×", "+1%", "−6%", "Yes"],
    ["Day 3", "+15%", "9.5×", "+11%", "+5%", "No"],
    ["Day 4", "+6%", "1.4×", "+0.5%", "−4%", "Yes"],
    ["Day 5", "+10%", "4.2×", "+3%", "−2%", "No"],
    ["Day 6", "+9%", "3.0×", "+2%", "+1%", "No"],
  ],
  steps: [
    { col: 1, what: "Every day opened at least 6% above the previous close.", why: "A gap screen picks days by the size of the jump. Write the rule down, because a different cutoff gives a different table." },
    { col: 2, what: "Relative volume runs from 1.4× to 9.5× the usual day.", why: "Relative volume compares today with a normal day for this stock. Heavy volume means many traders took part, in either direction." },
    { col: 3, row: 2, what: "Day 3 spiked 11% above its open on 9.5× volume.", why: "The biggest spike came with the heaviest volume here. That is a pairing to test on many more days, not a law." },
    { col: 4, what: "Four of six days closed below their open: a close-red share of 67%.", why: "Close red counts days that ended below the open. The average close vs open is −1.5%: add the six moves (−9 points) and divide by six." },
    { col: 4, row: 2, what: "Day 3 closed up 5%, the one large green day.", why: "One big day can pull an average a long way. Read the spread of results, not only the average, before believing a number." },
    { col: 5, what: "Two of six gaps filled back to the previous close.", why: "Six days is far too few to say how often gaps fill. A dashboard average over a handful of days is a description, not a probability." },
  ],
  takeaway: "Counts and averages over a few gap days describe the past sample; they are not odds for the next one.",
};

const TWO_RECORDS: ToolSimulation = {
  kind: "columns",
  id: "ac-two-records",
  title: "A high win rate that loses money",
  goal: "Compare two SAMPLE records of ten practice trades each, measured in R, to see why win rate alone misleads and how expectancy and profit factor tell the fuller story.",
  tape: "SAMPLE practice records · ten closed trades each · results in R · simulated",
  start: 1,
  columns: ["Measure", "Trader A", "Trader B"],
  rows: [
    ["Win rate", "70% (7 of 10)", "40% (4 of 10)"],
    ["Average win", "+0.5R", "+2.0R"],
    ["Average loss", "−1.5R", "−1.0R"],
    ["Gross profit", "+3.5R", "+8.0R"],
    ["Gross loss", "−4.5R", "−6.0R"],
    ["Net result", "−1.0R", "+2.0R"],
    ["Expectancy per trade", "−0.10R", "+0.20R"],
    ["Profit factor", "0.78", "1.33"],
  ],
  steps: [
    { col: 1, row: 0, what: "Trader A wins 7 of 10 trades, a 70% win rate.", why: "A high win rate feels like skill. It only counts wins, though, and says nothing about how big each win or loss was." },
    { col: 1, row: 2, what: "A's average loss is 1.5R, three times the average win of 0.5R.", why: "Taking small profits quickly and letting losers run past the stop is the classic way a high win rate still loses." },
    { col: 1, row: 6, what: "A's expectancy is −0.10R: 0.7 × 0.5 − 0.3 × 1.5.", why: "Expectancy is the average result per trade. Below zero means the record lost money on average, whatever the win rate." },
    { col: 2, row: 6, what: "Trader B wins only 40% but earns +0.20R a trade: 0.4 × 2.0 − 0.6 × 1.0.", why: "Larger wins than losses can carry a low win rate. Size of wins and losses matters as much as how often you win." },
    { col: 2, row: 7, what: "B's profit factor is 1.33 (8.0 ÷ 6.0); A's is 0.78 (3.5 ÷ 4.5).", why: "Profit factor divides gross profit by gross loss. Above 1 made money in this sample, below 1 lost it." },
    { col: 2, row: 5, what: "Both records are only ten trades long.", why: "Ten trades is far too few to trust either number. Keep logging in the paper journal before reading much into a record." },
  ],
  takeaway: "Judge a record by expectancy and profit factor over many trades, not by its win rate.",
};

const DRAWDOWN_CLIMB: ToolSimulation = {
  kind: "columns",
  id: "ac-drawdown-climb",
  title: "The climb back from a drawdown",
  goal: "Step through SAMPLE drops from a $10,000 peak to see why the gain needed to get back grows faster than the loss, and how long the climb takes at a steady 10% a year.",
  tape: "SAMPLE $10,000 practice account · steady 10% a year after the drop · simulated, rounded",
  start: 1,
  columns: ["Drop from peak", "Account after the drop", "Gain needed to get back", "Years back at 10% a year"],
  rows: [
    ["10%", "$9,000", "11.1%", "1.1"],
    ["20%", "$8,000", "25%", "2.3"],
    ["30%", "$7,000", "42.9%", "3.7"],
    ["50%", "$5,000", "100%", "7.3"],
    ["75%", "$2,500", "300%", "14.5"],
  ],
  steps: [
    { col: 1, row: 0, what: "A 10% drop leaves $9,000.", why: "Drawdown is measured from the highest value the account reached, not from where you started. Track the peak, not the deposit." },
    { col: 2, row: 0, what: "Getting back needs 11.1%, a bit more than the 10% lost.", why: "The gain is earned on the smaller balance: $1,000 ÷ $9,000. Every loss leaves less money to recover with." },
    { col: 2, row: 3, what: "A 50% drop needs a 100% gain to get back.", why: "Half the money has to double. This is why the dashboard tip says to protect against drawdowns before chasing returns." },
    { col: 3, row: 3, what: "At a steady 10% a year that climb takes about 7.3 years.", why: "Time is the hidden cost of a deep drawdown. Real returns are not steady, so the climb can be longer or shorter." },
    { col: 2, row: 4, what: "A 75% drop needs 300%.", why: "Deep losses are close to permanent for most accounts. Position sizing and stops exist to keep drawdowns in the shallow rows." },
  ],
  takeaway: "Losses need bigger gains to repair; keeping drawdowns shallow matters more than any single winning trade.",
};

const SHORT_NUMBERS: ToolSimulation = {
  kind: "columns",
  id: "ac-short-two-numbers",
  title: "Short interest and short volume are different numbers",
  goal: "Read a SAMPLE month of short data, with two short-interest reports and daily short-volume ratios in between, to see why a high daily ratio does not mean short sellers are piling in.",
  tape: "SAMPLE stock · float 30M shares · average volume 1.5M a day · simulated",
  start: 1,
  columns: ["Date", "Short interest", "Days to cover", "Daily short volume ratio", "Close"],
  rows: [
    ["Mid-month report", "6.0M shares", "4.0", "46%", "$31.20"],
    ["Next day", "6.0M (no new report)", "4.0", "58%", "$30.40"],
    ["Two days later", "6.0M (no new report)", "4.0", "41%", "$30.90"],
    ["Three days later", "6.0M (no new report)", "4.0", "62%", "$29.80"],
    ["Month-end report", "7.2M shares", "4.8", "49%", "$28.60"],
  ],
  steps: [
    { col: 1, row: 0, what: "Short interest is 6.0M shares, 20% of the 30M float.", why: "Short interest counts shares sold short and not yet bought back, reported about twice a month. Divide by the float for % of float shorted." },
    { col: 2, row: 0, what: "Days to cover is 4.0: 6.0M ÷ 1.5M average daily volume.", why: "It estimates how many normal days of trading it would take shorts to buy back. It changes when either number changes." },
    { col: 3, row: 1, what: "The next day, 58% of reported volume is marked short.", why: "Daily short volume includes market makers selling short to fill buy orders and closing the same day. Ratios near half are ordinary." },
    { col: 1, row: 3, what: "Short interest still reads 6.0M on a 62% day.", why: "The daily ratio and the twice-monthly count measure different things. A high daily ratio does not update short interest." },
    { col: 1, row: 4, what: "The month-end report shows 7.2M, up 20%, and days to cover rises to 4.8.", why: "Only the next short-interest report tells you whether shorts grew their positions. Read its date, since it lags the market." },
  ],
  takeaway: "Use short interest, its date and days to cover for positioning; treat the daily short-volume ratio as noisy context.",
};

// ---------------------------------------------------------------- units

export const DASHBOARD_NUMBERS_L2: Unit[] = [
  {
    id: "l2-gap-day-numbers",
    levelId: "L2",
    courseId: "gap-days",
    title: "Gap days by the numbers",
    objective: "Read a gap day's data stamp, pre-market high, relative volume, spike, fade and close against the open without treating a few days as a rule.",
    cards: [
      { title: "Check the stamp first", glossaryTermId: "end-of-day-data", ...cardWithSims(["Before reading any gap number, check how fresh it is. ", { text: "End-of-day data", term: "end-of-day-data" }, " updates after the close, a ", { text: "delayed quote", term: "delayed-quote" }, " runs about 15 minutes behind, and real-time data prints as trades happen. A screen can mix all three."]) },
      { title: "The gap and the pre-market", glossaryTermId: "premarket-session", ...cardWithSims(["A gap is a day that opens well above or below the ", { text: "previous close", term: "previous-close" }, ". Before the open, the ", { text: "pre-market session", term: "premarket-session" }, " trades from 4:00 to 9:30 AM ET on thin volume. Its high becomes a level many traders watch after the open."]) },
      { title: "Relative volume and float turnover", glossaryTermId: "relative-volume", ...cardWithSims([{ text: "Relative volume", term: "relative-volume" }, " compares today's volume with a normal day for the same stock. ", { text: "Float turnover", term: "float-turnover" }, " divides the day's volume by the shares free to trade. ", { text: "Walk one gap day by the numbers", sim: "ac-gap-day-numbers" }, "."]) },
      { title: "Spike, fade and the close", glossaryTermId: "spike-and-fade", ...cardWithSims(["The ", { text: "high spike", term: "spike-and-fade" }, " is how far price rose above the open; the high fade is how far it fell from the high. Close vs open shows whether the day ended green or red, and ", { text: "VWAP", term: "vwap" }, " shows the average price paid since the open."]) },
      { title: "A few days are not a pattern", glossaryTermId: "gap-types", ...cardWithSims(["Dashboards often summarize gap days: the share that closed red, the average return from open to close, how many gaps filled. ", { text: "Six gap days are not a statistic", sim: "ac-gap-day-stats" }, ", so read the sample size before the average."]) },
    ],
    refs: [
      "route:/tools/finviz?sim=fv-sim-premarket",
      "practice:/practice/opening-range",
      "route:/academy/l2-volume-confirms?sim=ac-volume-breakout",
      "glossary:relative-volume",
      "glossary:gap-risk",
    ],
    simulations: [GAP_DAY, GAP_STATS],
  },
];

export const DASHBOARD_NUMBERS_L3: Unit[] = [
  {
    id: "l3-grade-your-trades",
    levelId: "L3",
    courseId: "review-results",
    title: "Grade your trades",
    objective: "Judge a practice record with win rate, expectancy, profit factor, drawdown and the equity curve read together.",
    cards: [
      { title: "Win rate is half the story", glossaryTermId: "win-rate-vs-expectancy", ...cardWithSims(["Win rate is the share of closed trades that made money. It ignores size, so a record that wins 70% of the time can still lose if each loss is three times the average win. ", { text: "Compare two records of ten trades", sim: "ac-two-records" }, " before trusting a win rate."]) },
      { title: "Expectancy, the average trade", glossaryTermId: "expected-value", ...cardWithSims([{ text: "Expectancy", term: "expected-value" }, " is the average result per trade: win rate × average win, minus loss rate × average loss. Measured in ", { text: "R", term: "r-multiple" }, ", the risk you planned, it compares trades of any size on one scale."]) },
      { title: "Profit factor", glossaryTermId: "profit-factor", ...cardWithSims([{ text: "Profit factor", term: "profit-factor" }, " is gross profit divided by gross loss. At 1.5, the record made $1.50 for every $1 it lost; below 1, it lost money. Count fees and slippage in both, or the number flatters the record."]) },
      { title: "Drawdown and the climb back", glossaryTermId: "drawdown", ...cardWithSims(["Max ", { text: "drawdown", term: "drawdown" }, " is the largest drop from a peak in account value to a later low. Losses need bigger gains to repair: ", { text: "a 50% drop needs a 100% gain", sim: "ac-drawdown-climb" }, " just to get back."]) },
      { title: "The equity curve and the journal", glossaryTermId: "equity-curve", ...cardWithSims(["An ", { text: "equity curve", term: "equity-curve" }, " charts account value over time, and its shape shows how bumpy the ride was. A ", { text: "trade journal", term: "trade-journal" }, " records why you entered, where you planned to exit and what happened, so the numbers have reasons."]) },
    ],
    refs: [
      "route:/paper",
      "practice:/practice/vix-trading",
      "coach:read-a-backtest",
      "glossary:win-rate-vs-expectancy",
      "glossary:sharpe-ratio",
      "quiz:paper-pnl",
    ],
    simulations: [TWO_RECORDS, DRAWDOWN_CLIMB],
  },
];

export const DASHBOARD_NUMBERS_L4: Unit[] = [
  {
    id: "l4-positioning-signals",
    levelId: "L4",
    courseId: "positioning",
    title: "Positioning: shorts, options and insiders",
    objective: "Tell short interest from daily short volume, read a put/call ratio and options flow with care, and weigh insider trades by who traded and why.",
    cards: [
      { title: "Short interest vs short volume", glossaryTermId: "short-volume-ratio", ...cardWithSims([{ text: "Short interest", term: "short-interest" }, " counts shares sold short and not yet bought back, reported about twice a month. The ", { text: "daily short volume ratio", term: "short-volume-ratio" }, " is the share of one day's reported trades marked short. ", { text: "They are different numbers", sim: "ac-short-two-numbers" }, "."]) },
      { title: "Days to cover and percent of float", glossaryTermId: "days-to-cover", ...cardWithSims([{ text: "Days to cover", term: "days-to-cover" }, " divides short interest by average daily volume. Short interest divided by the ", { text: "float", term: "public-float" }, " gives the percent of float shorted. High readings can feed a ", { text: "short squeeze", term: "short-squeeze" }, ", and the shorts can also be right."]) },
      { title: "The put/call ratio", glossaryTermId: "put-call-ratio", ...cardWithSims(["The ", { text: "put/call ratio", term: "put-call-ratio" }, " divides put contracts traded by call contracts traded. Above 1 means more puts changed hands. Puts are often bought as insurance on shares already owned, so a high ratio is not the same as a bet on a fall."]) },
      { title: "Options flow", glossaryTermId: "unusual-options-activity", ...cardWithSims(["Options premium in dollars is contracts × price × 100 shares. ", { text: "Unusual options activity", term: "unusual-options-activity" }, " flags a contract trading far more than usual. Check ", { text: "implied volatility", term: "implied-volatility" }, " and ", { text: "delta", term: "option-delta" }, ", and remember the tape rarely says who opened the trade or why."]) },
      { title: "Insider buys and sells", glossaryTermId: "insider-cluster", ...cardWithSims(["Officers, directors and 10% owners report trades on Form 4 within two business days. Open-market buys say more than sales, which happen for taxes, diversification or planned schedules. An ", { text: "insider cluster", term: "insider-cluster" }, " is several insiders buying within weeks."]) },
    ],
    refs: [
      "route:/tools/earnings-insiders?sim=ei-sim-cluster",
      "practice:/practice/gamma-squeeze",
      "coach:chasing-a-squeeze",
      "glossary:short-interest",
      "glossary:implied-volatility",
    ],
    simulations: [SHORT_NUMBERS],
  },
];

export const DASHBOARD_NUMBERS_UNITS: Unit[] = [...DASHBOARD_NUMBERS_L2, ...DASHBOARD_NUMBERS_L3, ...DASHBOARD_NUMBERS_L4];

/** Second paragraphs (merged into `CARD_MORE`; keys `unitId::card title`). */
export const DASHBOARD_NUMBERS_MORE: Record<string, string> = {
  "l2-gap-day-numbers::Check the stamp first":
    "Free data plans are often end-of-day or delayed, and many cap how many requests an app may make per minute or per day, called a rate limit. When the cap is hit, a screen can keep showing an old number beside a fresh one. Read the badge or time stamp on each figure, and treat MOCK or SAMPLE badges as practice data.",
  "l2-gap-day-numbers::The gap and the pre-market":
    "Pre-market volume is usually a small slice of a normal day, so its prices can jump on a few orders. A gap is often news-driven, such as earnings released before the open. After 9:30 AM ET, whether price breaks above the pre-market high, or fails there, tells you how the regular session is receiving the news.",
  "l2-gap-day-numbers::Relative volume and float turnover":
    "Relative volume of 4× means four times the usual shares have traded, which many traders read as real participation. Float turnover above 1 means more shares traded than the whole float, which happens on heavy news in smaller companies. Both say how busy the day is. Neither says which way price will go next.",
  "l2-gap-day-numbers::Spike, fade and the close":
    "Each number is measured from a named price: the spike from the open, the fade from the high, the return from open to close. Some dashboards also note the time of the high and low of the day in New York time. A big spike followed by a deep fade often means early buyers sold into strength.",
  "l2-gap-day-numbers::A few days are not a pattern":
    "A close-red share of 67% over six days could easily be 40% over the next six. Results depend on how gap days were chosen, the stock, the market at the time and the data source. Count the days behind any average, look at the best and worst day, and test an idea in practice before trusting it.",
  "l3-grade-your-trades::Win rate is half the story":
    "Taking small profits quickly and letting losers run past the stop is the usual way a high win rate still loses. The opposite record, with few wins but large ones, can make money and still feel bad to trade. Neither win rate is good or bad on its own; it only means something next to the sizes of wins and losses.",
  "l3-grade-your-trades::Expectancy, the average trade":
    "A record that wins 40% of the time, averaging +2R, and loses 60%, averaging −1R, has an expectancy of 0.4 × 2 − 0.6 × 1 = +0.2R. That means about a fifth of your planned risk earned per trade, on average, in that sample. Positive expectancy over a handful of trades can still be luck, so keep counting.",
  "l3-grade-your-trades::Profit factor":
    "Profit factor and expectancy usually agree on direction: above 1 and above zero both mean the sample made money. Profit factor hides the number of trades, so a 3.0 from five trades says little. One outsized winner can also lift it a long way. Read it next to the trade count and the largest single win.",
  "l3-grade-your-trades::Drawdown and the climb back":
    "A 20% drop needs 25% to repair, and a 30% drop needs about 43%. That is why risking a small slice of the account on each trade matters: it keeps a losing streak in the shallow part of the table. Track drawdown from the highest account value reached, not from the amount you first deposited.",
  "l3-grade-your-trades::The equity curve and the journal":
    "Two records can end at the same value, one climbing steadily and one swinging hard, and the Sharpe ratio puts a number on that difference. The journal explains the curve: notes on rule breaks, sizes and setups show which mistakes repeat. The paper desk draws an equity curve and keeps a journal for every practice trade.",
  "l4-positioning-signals::Short interest vs short volume":
    "Much daily short volume comes from market makers who sell short to fill buy orders and buy back within the day, so ratios near half are ordinary. Short interest comes from broker reports to FINRA and lags the market by days. When a post cites a scary daily ratio, check the latest short-interest report and its date instead.",
  "l4-positioning-signals::Days to cover and percent of float":
    "With 6 million shares short and 1.5 million shares trading on an average day, days to cover is 4. On a 30 million share float, that is 20% of the float shorted. A squeeze needs buyers and a catalyst, not only a crowded short, and short sellers often have researched reasons. Read both sides before forming a view.",
  "l4-positioning-signals::The put/call ratio":
    "A single stock's ratio can swing on one large trade, while a market-wide ratio blends millions of contracts. Some traders read very high market ratios as fear that may already be priced in, which is a contrarian idea, not a rule. Compare any reading with that stock's own normal range rather than a fixed cutoff.",
  "l4-positioning-signals::Options flow":
    "A large call purchase can be a hedge for a short stock position, one leg of a spread, or a closing trade. Delta tells you roughly how much the option moves for a $1 move in the stock, and high implied volatility means options are expensive. Treat flow as a question to research, not as a tip.",
  "l4-positioning-signals::Insider buys and sells":
    "Some data vendors roll insider trades into a monthly score from all selling to all buying; read the filings behind any score. Check the role, the size against the insider's holdings, and whether a sale was under a planned trading schedule. The Earnings and insiders lesson walks a cluster of buys on real filing fields.",
};

/** Unit quiz items (merged at the end of each level's bank, so existing answer letters keep their places). */
export const DASHBOARD_NUMBERS_QUIZ_RAW_L0L3: Record<string, RawItem[]> = {
  "l2-gap-day-numbers": [
    { p: "A stock closed at 20.00 and opens at 22.40. What is the gap?", r: "+12%, measured from the previous close to the open", w: [["+12%, measured from the open to the high", "The gap uses the previous close and the open."], ["2.40%", "That is the dollar move written as a percent."], ["It cannot be known until the close", "The gap is known at the open."]], e: "A gap is measured from the previous close to the open: 22.40 ÷ 20.00 − 1 is 12%.", c: ["previous close"], g: "gap-types" },
    { p: "A screen shows a gap stock's price with an end-of-day badge at 10:15 AM. What should you assume?", r: "The price is from the last close, not this morning", w: [["It is a real-time price", "End-of-day data updates after the close."], ["It is delayed by 15 minutes", "That is a delayed quote."], ["It includes pre-market trades", "End-of-day data shows the last close."]], e: "End-of-day data updates after the close, so check the stamp before reading any gap number.", c: ["End-of-day data"], g: "end-of-day-data" },
    { p: "A gap stock opens at 22.40, reaches 23.70 and closes at 21.60. Which reading is right?", r: "It spiked above the open, faded from the high and closed red against the open", w: [["It closed green because it is above yesterday", "Close vs open compares with today's open."], ["It had no spike", "23.70 is above the 22.40 open."], ["The gap filled", "Filling means trading back to the previous close."]], e: "The high spike is measured from the open, the high fade from the high, and close vs open shows the day ended red.", c: ["high spike", "high fade"], g: "spike-and-fade" },
    { p: "Four of six gap days closed red. What is the fair conclusion?", r: "It describes six past days; far too few to set odds", w: [["Gap days close red 67% of the time", "Six days cannot support that."], ["The next gap day will close red", "A sample does not predict one day."], ["Gaps always fade", "Day 3 closed up 5%."]], e: "Six gap days are not a statistic, so read the sample size before the average.", c: ["sample size"], g: "gap-types" },
  ],
  "l3-grade-your-trades": [
    { p: "A record wins 70% of trades, averaging +0.5R, and loses 30%, averaging −1.5R. What is its expectancy?", r: "−0.10R per trade", w: [["+0.70R per trade", "That is the win rate, not the average result."], ["+0.20R per trade", "That is the 40% record."], ["Zero", "0.35 − 0.45 is below zero."]], e: "Expectancy is win rate × average win, minus loss rate × average loss: 0.35 − 0.45 = −0.10R.", c: ["average win", "Expectancy"], g: "expected-value" },
    { p: "Gross profit is $1,500 and gross loss is $1,000. What is the profit factor?", r: "1.5", w: [["0.67", "That divides loss by profit."], ["$500", "That is the net result."], ["50%", "Profit factor is a ratio, not a percent."]], e: "Profit factor is gross profit divided by gross loss: $1,500 ÷ $1,000 = 1.5.", c: ["gross profit"], g: "profit-factor" },
    { p: "An account drops 50% from its peak. What gain does it need to get back?", r: "100%", w: [["50%", "That would leave it at 75% of the peak."], ["25%", "That repairs a 20% drop."], ["75%", "Still short of the peak."]], e: "A 50% drop needs a 100% gain because half the money has to double.", c: ["a 50% drop needs a 100% gain"], g: "drawdown" },
    { p: "Two practice records end at the same value. What else should you compare?", r: "The equity curve and the journal notes behind it", w: [["Only the final value", "The ride matters too."], ["Only the win rate", "Win rate is half the story."], ["Nothing; they are equal", "Their drawdowns can differ a lot."]], e: "An equity curve shows how bumpy the ride was, and a trade journal gives the numbers their reasons.", c: ["equity curve", "trade journal"], g: "equity-curve" },
  ],
};

export const DASHBOARD_NUMBERS_QUIZ_RAW_L4L7: Record<string, RawItem[]> = {
  "l4-positioning-signals": [
    { p: "A post says 62% of today's volume was short, so short sellers are piling in. What is the better check?", r: "Read the latest short-interest report and its date", w: [["Trust the daily ratio", "Much daily short volume is routine market-maker hedging."], ["Buy before a squeeze", "Not a check, and not the lesson."], ["Ignore all short data", "Short interest is still useful context."]], e: "Short interest counts shares sold short and not yet bought back; the daily short volume ratio is a different number.", c: ["Short interest", "daily short volume ratio"], g: "short-volume-ratio" },
    { p: "Short interest is 6M shares and average daily volume is 1.5M. What is days to cover?", r: "4", w: [["0.25", "That divides volume by short interest."], ["9", "That adds rather than divides."], ["20", "That is the percent of a 30M float."]], e: "Days to cover divides short interest by average daily volume: 6M ÷ 1.5M = 4.", c: ["Days to cover"], g: "days-to-cover" },
    { p: "A stock's put/call ratio jumps to 1.4. What is a fair reading?", r: "More puts traded, possibly as insurance; not proof of a coming fall", w: [["The stock will fall", "Puts are often hedges."], ["The ratio means 1.4% downside", "It is a count ratio, not a forecast."], ["Calls are now cheaper", "The ratio counts contracts, not prices."]], e: "The put/call ratio divides puts traded by calls traded; puts are often bought as insurance.", c: ["put/call ratio", "insurance"], g: "put-call-ratio" },
    { p: "Which insider activity usually carries more information?", r: "Several insiders buying on the open market within weeks", w: [["One director selling on a planned schedule", "Sales happen for many reasons."], ["Any Form 4, whatever it shows", "Read who traded and why."], ["A monthly score with no filings behind it", "Read the filings behind any score."]], e: "Open-market buys say more than sales, and an insider cluster is several insiders buying within weeks.", c: ["insider cluster", "Open-market buys"], g: "insider-cluster" },
  ],
};
