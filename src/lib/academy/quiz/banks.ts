/**
 * BA10.M3 Learn quiz banks: orders-and-fills (BA-OF-), paper-pnl (BA-PL-), options-ladder (BA-OL-).
 * Every number in an answer is computed here by the paper engine (paper/engine.ts, account.ts, stats.ts,
 * validate.ts) or the payoff math (options/payoff.ts), never hand-typed. academyQuiz.test.ts recomputes
 * them independently. All prices are SAMPLE numbers; the money is virtual. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "../../quizData";
import { ACADEMY_QUIZ_GROUP_IDS, ACADEMY_QUIZ_GROUP_META, type AcademyQuizGroupId } from "./groups";
import type { AccountState, OrderSpec, PaperBar } from "../paper/types";
import { applyFill, avgCost, createAccount, equity } from "../paper/account";
import { contextFrom, placeOrder, stepBar } from "../paper/engine";
import { reservationFor } from "../paper/validate";
import { maxDrawdown, realizedPnl, unrealizedPnl } from "../paper/stats";
import { payoffPerContract, summarize, type Leg } from "../options/payoff";

type Letter = "A" | "B" | "C" | "D";
const LETTERS: Letter[] = ["A", "B", "C", "D"];
/** Numeric answers keyed by question id (the label of the right option), for the recompute test. */
export const ACADEMY_NUMERIC: Record<string, string> = {};

function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossary?: string): QuizQuestion {
  const uniq = [...new Set(wrong.filter((w) => w !== right))].slice(0, 3);
  if (uniq.length < 3) throw new Error(`academy quiz ${id}: needs 3 distinct wrong options`);
  const ordered = [...uniq];
  ordered.splice(LETTERS.indexOf(at), 0, right);
  const options: QuizOption[] = ordered.map((label, i) => ({ id: LETTERS[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, glossaryTermId: glossary };
}
function num(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossary?: string): QuizQuestion {
  ACADEMY_NUMERIC[id] = right;
  return mc(id, prompt, at, right, wrong, explanation, glossary);
}
const letterAt = (i: number) => LETTERS[i % 4]!;

// ---------- money helpers (cents in, label out) ----------
export const usd = (cents: number) => `${cents < 0 ? "−" : ""}$${(Math.abs(cents) / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
export const signedUsd = (cents: number) => (cents > 0 ? `+${usd(cents)}` : usd(cents));
const c = (d: number) => Math.round(d * 100);
export const NO_FILL = "It does not fill on that bar";

// ---------- orders-and-fills: run one order through the engine ----------
export const SYM = "QUIZ.S";
export const PREV_CLOSE = 5000;
const bar = (o: number, h: number, l: number, cl: number): PaperBar => ({ open: c(o), high: c(h), low: c(l), close: c(cl) });
export interface FillScenario {
  spec: Omit<OrderSpec, "symbol">;
  bars: PaperBar[];
  /** Hold this many shares (bought at PREV_CLOSE) before the order, for sells. */
  hold?: number;
}
/** Fill price in cents, or null if the order did not fill over the given bars. */
export function runFill(sc: FillScenario): number | null {
  let s: AccountState = createAccount(1_000_000, { [SYM]: PREV_CLOSE }, 0);
  if (sc.hold) s = applyFill(s, { orderId: "seed", bar: 0, symbol: SYM, side: "buy", qty: sc.hold, price: PREV_CLOSE }).state;
  const placed = placeOrder(s, { ...sc.spec, symbol: SYM } as OrderSpec, contextFrom(s));
  if (!placed.validation.ok) throw new Error(`quiz order rejected: ${placed.order.reason}`);
  s = placed.state;
  for (const b of sc.bars) s = stepBar(s, { [SYM]: b });
  const f = s.fills.find((x) => x.orderId === placed.order.id);
  return f ? f.price : null;
}
const fillLabel = (p: number | null) => (p === null ? NO_FILL : usd(p));
const barText = (b: PaperBar) => `open ${usd(b.open)}, high ${usd(b.high)}, low ${usd(b.low)}, close ${usd(b.close)}`;

interface FillQ {
  prompt: (bars: string) => string;
  sc: FillScenario;
  wrong: (string | number | null)[];
  why: string;
  glossary?: string;
}
const FILL_QS: FillQ[] = [
  { prompt: (b) => `The last close was $50.00. You place a market buy for 10 shares. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "buy", type: "market", qty: 10, tif: "day" }, bars: [bar(50.4, 51, 50.1, 50.8)] }, wrong: [5000, 5080, 5100], why: "A market order fills at the next bar's open in this simulator: you get the fill, but not a set price.", glossary: "market-order-vs-limit" },
  { prompt: (b) => `Buy limit at $49.50, last close $50.00. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "buy", type: "limit", limitPrice: 4950, qty: 10, tif: "day" }, bars: [bar(50.2, 50.5, 49.3, 49.8)] }, wrong: [5020, 4930, null], why: "The low traded through $49.50, so the buy limit fills at its limit (or better). It never pays more than the limit." },
  { prompt: (b) => `Buy limit at $49.50, last close $50.00. The stock gaps down. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "buy", type: "limit", limitPrice: 4950, qty: 10, tif: "day" }, bars: [bar(49.0, 49.6, 48.8, 49.4)] }, wrong: [4950, 4880, null], why: "The open was already below the limit, so the order fills at the better price: the open." },
  { prompt: (b) => `Buy limit at $49.50, last close $50.00. Next bar: ${b}. What happens?`, sc: { spec: { side: "buy", type: "limit", limitPrice: 4950, qty: 10, tif: "day" }, bars: [bar(50.1, 50.9, 49.7, 50.5)] }, wrong: [4950, 5010, 4970], why: "The low was $49.70, above the $49.50 limit, so a buy limit has no chance to fill. A limit protects the price, not the fill." },
  { prompt: (b) => `You hold 10 shares. Sell limit at $52.00. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "sell", type: "limit", limitPrice: 5200, qty: 10, tif: "day" }, hold: 10, bars: [bar(51.5, 52.4, 51.2, 52.1)] }, wrong: [5150, 5240, null], why: "The high reached $52.00, so the sell limit fills at its limit. A sell limit never sells below the limit." },
  { prompt: (b) => `You hold 10 shares. Sell limit at $52.00, and the stock gaps up. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "sell", type: "limit", limitPrice: 5200, qty: 10, tif: "day" }, hold: 10, bars: [bar(52.8, 53.1, 52.5, 52.9)] }, wrong: [5200, 5310, null], why: "The open was already above the limit, so the sell fills at the better price: the open." },
  { prompt: (b) => `Buy stop at $51.00 (to buy a breakout), last close $50.00. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "buy", type: "stop", stopPrice: 5100, qty: 10, tif: "day" }, bars: [bar(50.3, 51.4, 50.1, 51.2)] }, wrong: [5030, 5140, null], why: "The high reached the stop, so the buy stop becomes a market order and fills at the stop price in this simulator." },
  { prompt: (b) => `Buy stop at $51.00, last close $50.00. The stock gaps up. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "buy", type: "stop", stopPrice: 5100, qty: 10, tif: "day" }, bars: [bar(51.8, 52.2, 51.6, 52.0)] }, wrong: [5100, 5220, null], why: "A gap through a buy stop fills at the open, which is worse than the stop. Stops do not guarantee the price." },
  { prompt: (b) => `You hold 10 shares. Sell stop at $48.00. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "sell", type: "stop", stopPrice: 4800, qty: 10, tif: "gtc" }, hold: 10, bars: [bar(49.5, 49.8, 47.6, 47.9)] }, wrong: [4760, 4950, null], why: "The low reached the stop, so the sell stop fills at the stop price on this bar." },
  { prompt: (b) => `You hold 10 shares. Sell stop at $48.00, and bad news gaps the stock down. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "sell", type: "stop", stopPrice: 4800, qty: 10, tif: "gtc" }, hold: 10, bars: [bar(46.5, 47.0, 46.0, 46.4)] }, wrong: [4800, 4600, null], why: "Gap risk: the stock opened below the stop, so the stop fills at the open, $1.50 worse than planned." },
  { prompt: (b) => `You hold 10 shares. Sell stop-limit: stop $48.00, limit $47.50. The stock gaps down. Next bar: ${b}. What happens on that bar?`, sc: { spec: { side: "sell", type: "stop-limit", stopPrice: 4800, limitPrice: 4750, qty: 10, tif: "gtc" }, hold: 10, bars: [bar(46.5, 47.0, 46.0, 46.4)] }, wrong: [4650, 4750, 4800], why: "The stop triggers, but the open is below the $47.50 limit, so nothing fills. You still hold the shares as the price falls: the trade-off of a stop-limit." },
  { prompt: (b) => `You hold 10 shares. Sell stop-limit: stop $48.00, limit $47.50. Next bar: ${b}. Where does it fill?`, sc: { spec: { side: "sell", type: "stop-limit", stopPrice: 4800, limitPrice: 4750, qty: 10, tif: "gtc" }, hold: 10, bars: [bar(49.0, 49.2, 47.8, 47.9)] }, wrong: [4750, 4780, null], why: "The stop triggers at $48.00, which is within the $47.50 limit, so it fills at $48.00." },
  { prompt: (b) => `Buy stop-limit: stop $51.00, limit $51.50, last close $50.00. The stock gaps up. Next bar: ${b}. What happens on that bar?`, sc: { spec: { side: "buy", type: "stop-limit", stopPrice: 5100, limitPrice: 5150, qty: 10, tif: "day" }, bars: [bar(52.0, 52.4, 51.8, 52.2)] }, wrong: [5200, 5150, 5100], why: "The open ($52.00) is past the $51.50 limit, so the buy stop-limit triggers but does not fill. It caps what you pay, at the cost of maybe missing the move." },
  { prompt: () => `You hold 10 shares bought at $50.00 (last close $50.00) and place a 5% trailing stop. Bar 1: open $51.00, high $54.00, low $50.80, close $53.50. Bar 2: open $52.00, high $52.30, low $51.00, close $51.20. Where does the trailing stop fill?`, sc: { spec: { side: "sell", type: "trailing-stop", trailPercent: 5, qty: 10, tif: "gtc" }, hold: 10, bars: [bar(51, 54, 50.8, 53.5), bar(52, 52.3, 51, 51.2)] }, wrong: [4750, 5100, 5200], why: "The peak rose to $54.00 on bar 1, so the stop ratcheted up to 5% below it: $51.30. Bar 2 traded down through $51.30, so it fills there. The stop never moves down.", glossary: "trailing-stop" },
  { prompt: () => `Buy limit at $49.00 as a DAY order, last close $50.00. Bar 1 low: $49.40. Bar 2: open $49.40, high $49.60, low $48.50, close $48.90. What happens?`, sc: { spec: { side: "buy", type: "limit", limitPrice: 4900, qty: 10, tif: "day" }, bars: [bar(49.9, 50.3, 49.4, 49.8), bar(49.4, 49.6, 48.5, 48.9)] }, wrong: [4900, 4850, 4940], why: "A day order is only live for the next bar. It expired after bar 1, so bar 2's low does not fill it." },
  { prompt: () => `Same order, but GTC: buy limit at $49.00, last close $50.00. Bar 1 low: $49.40. Bar 2: open $49.40, high $49.60, low $48.50, close $48.90. Where does it fill?`, sc: { spec: { side: "buy", type: "limit", limitPrice: 4900, qty: 10, tif: "gtc" }, bars: [bar(49.9, 50.3, 49.4, 49.8), bar(49.4, 49.6, 48.5, 48.9)] }, wrong: [4940, 4850, null], why: "Good-'til-cancelled stays working, so on bar 2 the low reached $49.00 and the limit filled at $49.00." },
];
// NO_FILL appears as an answer only when the engine says so; otherwise as a distractor.
const ORDERS_FILLS: QuizQuestion[] = FILL_QS.map((q, i) => {
  const id = `BA-OF-${String(i + 1).padStart(2, "0")}`;
  const right = fillLabel(runFill(q.sc));
  return num(id, q.prompt(q.sc.bars.length === 1 ? barText(q.sc.bars[0]!) : ""), letterAt(i), right, q.wrong.map((w) => fillLabel(w as number | null)), q.why, q.glossary);
});
// buying-power reservation (validate.ts)
{
  const res = reservationFor({ symbol: SYM, side: "buy", type: "market", qty: 100, tif: "day" }, PREV_CLOSE);
  ORDERS_FILLS.push(num("BA-OF-17", "Last close $50.00. You place a market buy for 100 shares. How much buying power does the simulator set aside until it fills?", "B", usd(res), [usd(100 * PREV_CLOSE), usd(Math.round(100 * PREV_CLOSE * 1.1)), usd(PREV_CLOSE)], "A market order's price is unknown until it fills, so the simulator reserves the last close plus a 5% buffer: 100 × $50.00 × 1.05.", "buying-power"));
  const lim = reservationFor({ symbol: SYM, side: "buy", type: "limit", limitPrice: 4800, qty: 100, tif: "gtc" }, PREV_CLOSE);
  ORDERS_FILLS.push(num("BA-OF-18", "You place a buy limit for 100 shares at $48.00 (last close $50.00). How much buying power is reserved?", "C", usd(lim), [usd(100 * PREV_CLOSE), usd(Math.round(100 * 4800 * 1.05)), usd(4800)], "A buy limit can never pay more than its limit, so it reserves exactly qty × limit.", "buying-power"));
}
ORDERS_FILLS.push(
  mc("BA-OF-19", "Which order type guarantees the trade happens (in a normal market) but not the price?", "D", "Market order", ["Limit order", "Stop-limit order", "Day limit order"], "A market order takes the next available price. A limit order controls the price but may never fill.", "market-order-vs-limit"),
  mc("BA-OF-20", "Why might a trader choose a stop-limit over a plain stop to exit?", "A", "To cap how far below the stop the sale can happen, accepting it may not fill in a gap", ["To make sure the order always fills", "Because a stop-limit fills at the open in a gap", "Because it moves up with the price"], "A stop-limit adds price control after the trigger. The cost is that a fast gap past the limit leaves you holding the shares."),
  mc("BA-OF-21", "What does a trailing stop do when the price rises and then falls back?", "B", "Its stop rises with the peak and stays there when the price falls", ["It moves down with the price", "It resets to the entry price", "It cancels itself"], "The trailing stop follows the highest price by a fixed amount or percent, and it never moves down.", "trailing-stop"),
  mc("BA-OF-22", "What does GTC mean on an order ticket?", "C", "Good-'til-cancelled: it stays working until it fills or you cancel it", ["It only works for the current day", "It fills at the close", "It guarantees the fill price"], "A day order expires after the session; a GTC order keeps working across sessions.", "good-til-canceled"),
);

// ---------- paper-pnl: account.ts / stats.ts ----------
const buy = (s: AccountState, qty: number, price: number, bar = 0) => applyFill(s, { orderId: `b${s.fills.length}`, bar, symbol: SYM, side: "buy", qty, price }).state;
const sell = (s: AccountState, qty: number, price: number, bar = 0) => applyFill(s, { orderId: `s${s.fills.length}`, bar, symbol: SYM, side: "sell", qty, price }).state;
const mark = (s: AccountState, price: number): AccountState => ({ ...s, marks: { ...s.marks, [SYM]: price } });
const START = 1_000_000;
const acct = () => createAccount(START, { [SYM]: 5000 }, 0);
const pctLabel = (x: number) => `${x > 0 ? "+" : x < 0 ? "−" : ""}${Math.abs(x).toFixed(1)}%`;

export const PNL_SCENARIOS = {
  unrl: () => mark(buy(acct(), 100, 4000), 4300),
  avg: () => buy(buy(acct(), 100, 4000), 100, 4400),
  rlz: () => sell(buy(acct(), 50, 2000), 50, 2300),
  partial: () => mark(sell(buy(acct(), 100, 3000), 40, 3300), 3100),
  eq: () => mark(buy(acct(), 100, 5000), 4700),
  loss: () => sell(buy(acct(), 200, 2500), 200, 2400),
  cash: () => buy(acct(), 100, 5000),
  curve: [START, 1_060_000, 1_020_000, 990_000, 1_040_000].map((equity) => ({ equity })),
};
const posOf = (s: AccountState) => s.positions[SYM]!;
const PAPER_PNL: QuizQuestion[] = [];
{
  const P = PNL_SCENARIOS;
  const u = unrealizedPnl(P.unrl());
  PAPER_PNL.push(num("BA-PL-01", "You buy 100 shares at $40.00. The price is now $43.00 and you still hold them. What is your unrealised P&L?", "A", signedUsd(u), [signedUsd(-u), signedUsd(u / 100), signedUsd(0)], "Unrealised P&L = (price now − cost) × shares = ($43 − $40) × 100. It becomes realised only when you sell.", "realized-vs-unrealized-pnl"));
  const a = avgCost(posOf(P.avg()));
  PAPER_PNL.push(num("BA-PL-02", "You buy 100 shares at $40.00 and later 100 more at $44.00. What is your average cost per share?", "B", usd(Math.round(a)), [usd(4000), usd(4400), usd(8400)], "Cost basis = $4,000 + $4,400 = $8,400 for 200 shares, so the average is $42.00.", "cost-basis"));
  const r = realizedPnl(P.rlz());
  PAPER_PNL.push(num("BA-PL-03", "You buy 50 shares at $20.00 and sell all 50 at $23.00. What is your realised P&L?", "C", signedUsd(r), [signedUsd(300), signedUsd(2300 * 50), signedUsd(-r)], "Realised P&L = (sell − buy) × shares = $3 × 50. Fees are off in this simulator.", "realized-vs-unrealized-pnl"));
  const pr = P.partial();
  PAPER_PNL.push(num("BA-PL-04", "You buy 100 shares at $30.00, then sell 40 at $33.00. What is the realised P&L of that sale?", "D", signedUsd(realizedPnl(pr)), [signedUsd(30000), signedUsd(13200), signedUsd(4000)], "Only the 40 shares sold are realised: ($33 − $30) × 40. The other 60 are still open.", "realized-vs-unrealized-pnl"));
  PAPER_PNL.push(num("BA-PL-05", "Same trade: 60 shares are left (bought at $30.00) and the price is now $31.00. What is the unrealised P&L on them?", "A", signedUsd(unrealizedPnl(pr)), [signedUsd(10000), signedUsd(18000), signedUsd(-6000)], "Unrealised = ($31 − $30) × 60 open shares. The earlier sale's gain is already realised and counted separately.", "realized-vs-unrealized-pnl"));
  const eq = P.eq();
  PAPER_PNL.push(num("BA-PL-06", "You start with $10,000 of virtual cash, buy 100 shares at $50.00, and the price drops to $47.00. What is your account equity?", "B", usd(equity(eq)), [usd(START), usd(500000), usd(470000)], "Equity = cash + market value of positions = $5,000 + 100 × $47.", "account-equity"));
  PAPER_PNL.push(num("BA-PL-07", "Same account: what is the total return since the start?", "C", pctLabel(((equity(eq) - START) / START) * 100), [pctLabel(-6), pctLabel(-30), pctLabel(3)], "Return = (equity − starting cash) ÷ starting cash = −$300 ÷ $10,000."));
  PAPER_PNL.push(num("BA-PL-08", "You start with $10,000 and buy 100 shares at $50.00. How much cash is left?", "D", usd(P.cash().cash), [usd(START), usd(950000), usd(5000)], "Cash falls by 100 × $50 = $5,000. The shares are now part of equity instead.", "buying-power"));
  const dd = maxDrawdown(P.curve);
  PAPER_PNL.push(num("BA-PL-09", "Your equity over five days: $10,000, $10,600, $10,200, $9,900, $10,400. What is the maximum drawdown in dollars?", "A", usd(dd.amount), [usd(10000), usd(40000), usd(60000)], "Drawdown is measured from the highest peak ($10,600) to the lowest point after it ($9,900).", "drawdown"));
  PAPER_PNL.push(num("BA-PL-10", "Same equity series: what is the maximum drawdown as a percent of the peak?", "B", pctLabel(-dd.pct * 100), [pctLabel(-7), pctLabel(-1), pctLabel(-10)], "$700 ÷ $10,600 ≈ 6.6%. Percent drawdown uses the peak, not the starting value.", "drawdown"));
  PAPER_PNL.push(num("BA-PL-11", "You buy 200 shares at $25.00 and sell all at $24.00. What is your realised P&L?", "C", signedUsd(realizedPnl(P.loss())), [signedUsd(-100), signedUsd(200), signedUsd(-2400)], "($24 − $25) × 200 = −$200. A loss is realised the moment you sell.", "realized-vs-unrealized-pnl"));
}
// position sizing: shares = floor(risk budget ÷ risk per share)
export const sizeShares = (account: number, riskPct: number, entry: number, stop: number) => Math.floor((account * riskPct) / 100 / (entry - stop));
{
  const sz: [number, number, number, number, Letter][] = [
    [10000, 1, 50, 48, "D"],
    [10000, 2, 40, 37.5, "A"],
    [25000, 1, 80, 76, "B"],
    [5000, 1, 20, 19.5, "C"],
  ];
  sz.forEach(([accountUsd, risk, entry, stop, at], i) => {
    const n = sizeShares(accountUsd, risk, entry, stop);
    const budget = (accountUsd * risk) / 100;
    PAPER_PNL.push(
      num(`BA-PL-${12 + i}`, `Account $${accountUsd.toLocaleString("en-US")}, you risk ${risk}% per trade. Entry $${entry.toFixed(2)}, stop $${stop.toFixed(2)}. How many shares keep the loss at the stop within your risk?`, at, `${n} shares`, [`${Math.floor(budget / entry)} shares`, `${Math.floor(accountUsd / entry)} shares`, `${n * 2} shares`, `${Math.floor(budget)} shares`], `Risk budget = $${budget.toLocaleString("en-US")}; risk per share = $${(entry - stop).toFixed(2)}; shares = budget ÷ risk per share, rounded down.`, "position-sizing"),
    );
  });
}
PAPER_PNL.push(
  mc("BA-PL-16", "What turns an unrealised gain into a realised gain?", "A", "Selling the shares", ["The price rising further", "The end of the trading day", "Placing a stop order"], "Realised P&L is locked in by a sale; until then the gain can still change.", "realized-vs-unrealized-pnl"),
  mc("BA-PL-17", "What is cost basis?", "B", "What you paid for the shares you hold, in total", ["The current market value of your shares", "Your cash balance", "The price of your stop order"], "Cost basis is the total paid; divide by shares for the average cost.", "cost-basis"),
  mc("BA-PL-18", "Why do traders size positions from the stop distance?", "C", "So a loss at the stop is a planned, fixed share of the account", ["So every trade uses all buying power", "Because it guarantees a profit", "Because stops always fill at the stop price"], "Sizing by risk keeps one bad trade from doing outsized damage. Gaps can still make a loss larger than planned.", "position-sizing"),
  mc("BA-PL-19", "Which number tells you the worst peak-to-trough fall your account has had?", "D", "Maximum drawdown", ["Total return", "Realised P&L", "Buying power"], "Drawdown measures the pain along the way, which total return can hide.", "drawdown"),
  mc("BA-PL-20", "In this simulator, what is the paper account's money?", "A", "Virtual: SIMULATED cash on SAMPLE prices, with no real orders", ["Real money held by a broker", "A demo of a real brokerage account", "Cash that can be withdrawn"], "Paper trading practises the mechanics without real money. Results do not predict real trading.", "paper-trading"),
);

// ---------- options-ladder: options/payoff.ts ----------
const L = (kind: "call" | "put", position: "long" | "short", strike: number, premium: number, qty = 1): Leg => ({ kind, position, qty, strike, premium });
const S = (price: number): Leg => ({ kind: "stock", qty: 1, price });
const sum = (legs: Leg[]) => summarize({ id: "q", name: "q", legs });
const d = (x: number) => (x === Infinity ? "Unlimited" : `$${x.toFixed(2)}`);
const contract = (legs: Leg[], at: number) => {
  const v = payoffPerContract({ id: "q", name: "q", legs }, at);
  return `${v > 0 ? "+" : v < 0 ? "−" : ""}$${Math.abs(v).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};
export const OPTION_Q_LEGS = {
  longCall: [L("call", "long", 60, 3)],
  longPut: [L("put", "long", 40, 2)],
  covered: [S(30), L("call", "short", 33, 1)],
  csp: [L("put", "short", 25, 0.8)],
  bullCall: [L("call", "long", 40, 2), L("call", "short", 45, 0.7)],
  bullPut: [L("put", "short", 50, 1.8), L("put", "long", 45, 0.6)],
  condor: [L("put", "long", 90, 0.5), L("put", "short", 95, 1.2), L("call", "short", 105, 1.3), L("call", "long", 110, 0.6)],
  protPut: [S(50), L("put", "long", 45, 1.5)],
  nakedCall: [L("call", "short", 70, 2)],
  collar: [S(50), L("put", "long", 46, 1), L("call", "short", 55, 0.8)],
};
const OPTIONS_LADDER: QuizQuestion[] = [];
{
  const O = OPTION_Q_LEGS;
  const lc = sum(O.longCall);
  OPTIONS_LADDER.push(num("BA-OL-01", "You buy a $60 call for $3.00 (SAMPLE premium). What is the breakeven stock price at expiration?", "A", d(lc.breakevens[0]!), [d(60), d(57), d(66)], "Long call breakeven = strike + premium = $60 + $3.", "options-breakeven"));
  OPTIONS_LADDER.push(num("BA-OL-02", "Same $60 call bought for $3.00. The stock is $70 at expiration. What is the P&L for one contract?", "B", contract(O.longCall, 70), ["+$1,000.00", "+$7.00", "+$1,300.00"], "Value at expiry = $70 − $60 = $10; minus the $3 premium = $7 per share; × 100 shares per contract.", "option-premium"));
  OPTIONS_LADDER.push(num("BA-OL-03", "Same $60 call bought for $3.00. The stock is $58 at expiration. What is the P&L for one contract?", "C", contract(O.longCall, 58), ["−$200.00", "$0.00", "−$500.00"], "Below the strike the call expires worthless, so the buyer loses the whole premium: $3 × 100."));
  const lp = sum(O.longPut);
  OPTIONS_LADDER.push(num("BA-OL-04", "You buy a $40 put for $2.00. What is the breakeven at expiration?", "D", d(lp.breakevens[0]!), [d(42), d(40), d(2)], "Long put breakeven = strike − premium = $40 − $2.", "options-breakeven"));
  OPTIONS_LADDER.push(num("BA-OL-05", "Same $40 put for $2.00. What is the most it can make per share (stock falls to zero)?", "A", d(lp.maxGain), [d(40), d(42), "Unlimited"], "Max gain = strike − premium = $40 − $2, reached only if the stock goes to $0."));
  const cc = sum(O.covered);
  OPTIONS_LADDER.push(num("BA-OL-06", "You own shares bought at $30 and sell a $33 call for $1.00 (a covered call). What is the max gain per share?", "B", d(cc.maxGain), [d(3), d(1), "Unlimited"], "Max gain = (strike − stock cost) + premium = $3 + $1. Above $33 the shares are called away.", "covered-call"));
  OPTIONS_LADDER.push(num("BA-OL-07", "Same covered call (shares at $30, short $33 call for $1.00). What is the breakeven?", "C", d(cc.breakevens[0]!), [d(30), d(31), d(34)], "The premium cushions the stock cost: $30 − $1. Below that the position loses money.", "covered-call"));
  const csp = sum(O.csp);
  OPTIONS_LADDER.push(num("BA-OL-08", "You sell a cash-secured $25 put for $0.80. What is the breakeven?", "D", d(csp.breakevens[0]!), [d(25), d(25.8), d(0.8)], "If assigned you buy at $25 but kept $0.80, so the effective price is $24.20.", "cash-secured-put"));
  const bc = sum(O.bullCall);
  OPTIONS_LADDER.push(num("BA-OL-09", "Bull call spread: buy a $40 call for $2.00, sell a $45 call for $0.70. What is the max loss per share?", "A", d(bc.maxLoss), [d(2), d(5), d(3.7)], "A debit spread's max loss is the net debit: $2.00 − $0.70.", "vertical-spread"));
  OPTIONS_LADDER.push(num("BA-OL-10", "Same bull call spread ($40 / $45, net debit $1.30). What is the max gain per share?", "B", d(bc.maxGain), [d(5), d(1.3), "Unlimited"], "Max gain = width of the strikes − net debit = $5 − $1.30, reached at or above $45.", "vertical-spread"));
  OPTIONS_LADDER.push(num("BA-OL-11", "Same bull call spread. What is the breakeven at expiration?", "C", d(bc.breakevens[0]!), [d(42), d(40), d(45)], "Breakeven = lower strike + net debit = $40 + $1.30.", "options-breakeven"));
  const bp = sum(O.bullPut);
  OPTIONS_LADDER.push(num("BA-OL-12", "Bull put spread: sell a $50 put for $1.80, buy a $45 put for $0.60. What is the max loss per share?", "D", d(bp.maxLoss), [d(5), d(1.2), d(1.8)], "A credit spread's max loss = width − net credit = $5 − $1.20.", "vertical-spread"));
  const ic = sum(O.condor);
  OPTIONS_LADDER.push(num("BA-OL-13", "Iron condor: buy $90 put $0.50, sell $95 put $1.20, sell $105 call $1.30, buy $110 call $0.60. What is the max gain per share?", "A", d(ic.maxGain), [d(2.5), d(5), d(3.6)], "Max gain is the net credit: $1.20 + $1.30 − $0.50 − $0.60, kept if the stock ends between $95 and $105.", "iron-condor"));
  OPTIONS_LADDER.push(num("BA-OL-14", "Same iron condor (net credit $1.40, $5-wide wings). What are the two breakevens?", "B", ic.breakevens.map(d).join(" and "), ["$95.00 and $105.00", "$90.00 and $110.00", "$96.40 and $103.60"], "Lower breakeven = short put − credit; upper = short call + credit.", "iron-condor"));
  const pp = sum(O.protPut);
  OPTIONS_LADDER.push(num("BA-OL-15", "You own shares at $50 and buy a $45 put for $1.50 (a protective put). What is the max loss per share?", "C", d(pp.maxLoss), [d(5), d(1.5), d(50)], "Max loss = (cost − put strike) + premium = $5 + $1.50: the put sets a floor.", "protective-put"));
  OPTIONS_LADDER.push(num("BA-OL-16", "You sell a $70 call for $2.00 without owning the shares (naked). What is the max loss?", "D", d(sum(O.nakedCall).maxLoss), [d(70), d(72), d(2)], "A naked call's loss has no ceiling because the stock price has no ceiling. That is why the ladder keeps it concept-only."));
  const col = sum(O.collar);
  OPTIONS_LADDER.push(num("BA-OL-17", "Collar: own shares at $50, buy a $46 put for $1.00, sell a $55 call for $0.80. What is the max loss per share?", "A", d(col.maxLoss), [d(4), d(1), d(5)], "Max loss = (cost − put strike) + net premium paid = $4 + $0.20.", "collar"));
}
OPTIONS_LADDER.push(
  mc("BA-OL-18", "One option contract usually covers how many shares?", "B", "100", ["1", "10", "1,000"], "Premiums are quoted per share; multiply by 100 for one contract.", "option-premium"),
  mc("BA-OL-19", "What does being assigned on a short put mean?", "C", "You must buy the shares at the strike", ["You must sell the shares at the strike", "Your premium is refunded", "The option expires worthless"], "The put buyer exercised the right to sell, so the put seller buys at the strike.", "options-assignment"),
  mc("BA-OL-20", "What does passing a level of the Academy's options ladder mean?", "D", "You studied that level; it is education only and approves nothing", ["Your broker will approve that options level", "You can now trade options in the app", "You are ready to sell naked options"], "Real options approval is a broker and regulatory process. The ladder teaches the payoffs only."),
  mc("BA-OL-21", "A call buyer's maximum loss at expiration is…", "A", "The premium paid", ["Unlimited", "The strike price", "The stock price"], "The buyer can walk away and lose only the premium, which can still be 100% of it."),
);

export const ACADEMY_QUESTION_BANKS: Record<AcademyQuizGroupId, QuizQuestion[]> = {
  "orders-and-fills": ORDERS_FILLS,
  "paper-pnl": PAPER_PNL,
  "options-ladder": OPTIONS_LADDER,
};
export const ACADEMY_QUIZ_GROUPS = ACADEMY_QUIZ_GROUP_IDS.map((id) => ({ id, name: ACADEMY_QUIZ_GROUP_META[id].label, description: ACADEMY_QUIZ_GROUP_META[id].description, icon: ACADEMY_QUIZ_GROUP_META[id].icon }));
export { isAcademyQuizGroup } from "./groups";
export type { AcademyQuizGroupId };
