/**
 * News, biases and short-term options (/practice/news-biases): the trade-off between expiry lengths for a news
 * idea, six biases that news days trigger (each with a definition, a news example and a countermeasure),
 * information overload, over- and underreaction, and the strategies that counter them. Educational, not advice.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";

export interface NewsBias {
  id: string;
  name: string;
  definition: string;
  newsExample: string;
  countermeasure: string;
  source?: { label: string; url: string };
}

const KT1979 = { label: "Kahneman & Tversky (1979), Prospect Theory, Econometrica 47(2)", url: "https://doi.org/10.2307/1914185" };
const TK1974 = { label: "Tversky & Kahneman (1974), Judgment under Uncertainty, Science 185", url: "https://doi.org/10.1126/science.185.4157.1124" };

export const NEWS_BIASES: NewsBias[] = [
  {
    id: "recency-bias",
    name: "Recency bias",
    definition: "Giving the latest event too much weight and assuming it will keep happening.",
    newsExample: "After three days of tariff headlines that each sent stocks lower, you assume the fourth headline must too, and buy puts at the open.",
    countermeasure: "Look at a longer window before acting: how did the market react to similar headlines over months, not days?",
  },
  {
    id: "availability-bias",
    name: "Availability bias",
    definition: "Judging how likely something is by how easily examples come to mind.",
    newsExample: "A vivid story about a stock doubling on a contract win makes that outcome feel common, so you buy calls on the next contract headline.",
    countermeasure: "Ask for the base rate: out of all similar headlines, how often did the stock follow through?",
    source: TK1974,
  },
  {
    id: "confirmation-bias",
    name: "Confirmation bias",
    definition: "Seeking and trusting information that supports what you already believe, and discounting what does not.",
    newsExample: "You are long and bullish, so you read every upbeat analyst note and skip the article on falling margins.",
    countermeasure: "Before entering, write down the best case against the trade and what would prove you wrong.",
  },
  {
    id: "fomo",
    name: "FOMO (fear of missing out)",
    definition: "Entering because others are making money and you are afraid of being left out, not because your plan says so.",
    newsExample: "A stock is up 15% on a headline and social feeds are full of gains, so you buy near the high without a stop.",
    countermeasure: "No plan, no trade: entry, stop, target and size written before the click. Missing a move costs nothing.",
  },
  {
    id: "loss-aversion",
    name: "Loss aversion",
    definition: "Losses hurt more than equal gains feel good, so people hold losers too long and sell winners too early.",
    newsExample: "Your calls drop 40% after a bad headline and you hold, hoping to get back to even, instead of exiting at your planned stop.",
    countermeasure: "Set the stop before you enter and let the order act. Judge the trade by the plan, not by your entry price.",
    source: KT1979,
  },
  {
    id: "anchoring",
    name: "Anchoring",
    definition: "Sticking to a first number (an entry price, a prior high, a price target) and adjusting too little when facts change.",
    newsExample: "A stock traded at 80 before bad news. It is 60 now, and you buy because it 'should' go back to 80.",
    countermeasure: "Re-price from today's facts: what is the setup now, where is the stop, and does the news change the story?",
    source: TK1974,
  },
];

export const BIAS_CHECKLIST: { id: string; label: string }[] = [
  { id: "plan", label: "My entry, stop, target and size are written down" },
  { id: "against", label: "I looked for the best evidence against this trade" },
  { id: "base-rate", label: "I'm not trading only because of the latest headline or a vivid story" },
  { id: "fomo", label: "I would still take this if nobody else were talking about it" },
  { id: "anchor", label: "My prices come from today's chart, not an old price I'm stuck on" },
  { id: "loss", label: "I accept the stop as the planned loss and won't move it further away" },
];

/** The expiry trade-off for a news idea (short-dated vs about two months vs LEAPS). */
export const HORIZON_ROWS: { horizon: string; cost: string; timeDecay: string; fit: string }[] = [
  { horizon: "Weekly or a few days", cost: "Cheapest premium", timeDecay: "Fastest: time decay speeds up in the last weeks", fit: "Needs the move almost at once; a late or small move can still lose all of it" },
  { horizon: "About two months", cost: "More premium", timeDecay: "Slower than a weekly", fit: "Gives a news story weeks to play out while costing far less than a long-dated option" },
  { horizon: "LEAPS (nine months to about three years)", cost: "Most premium up front", timeDecay: "Slowest", fit: "For a long-term view; the extra time is paid for whether the news plays out quickly or not" },
];

export const NEWS_BIAS_SOURCES: { label: string; url: string }[] = [
  KT1979,
  TK1974,
  { label: "Chan (2003), Stock price reaction to news and no-news, Journal of Financial Economics 70(2)", url: "https://ideas.repec.org/a/eee/jfinec/v70y2003i2p223-260.html" },
  { label: "Hirshleifer, Lim & Teoh (2009), Driven to Distraction, Journal of Finance 64(5)", url: "https://doi.org/10.1111/j.1540-6261.2009.01501.x" },
  { label: "Hirshleifer, Hsu & Li (2013), Innovative efficiency and stock returns, Journal of Financial Economics 107(3)", url: "https://doi.org/10.1016/j.jfineco.2012.09.011" },
  { label: "Cohen & Frazzini (2008), Economic Links and Predictable Returns, Journal of Finance 63(4)", url: "https://doi.org/10.1111/j.1540-6261.2008.01379.x" },
  { label: "Fidelity: conditional orders (OCO, OTOCO)", url: "https://www.fidelity.com/learning-center/trading-investing/trading/conditional-order-types" },
  { label: "Schwab: advanced order types (OCO, bracket)", url: "https://www.schwab.com/learn/story/how-to-use-advanced-stock-order-types" },
  { label: "Investor.gov: pump and dump schemes", url: "https://www.investor.gov/introduction-investing/investing-basics/glossary/pump-and-dump-schemes" },
  { label: "FINRA: avoiding pump-and-dump scams", url: "https://www.finra.org/investors/insights/pump-and-dump-scams" },
  { label: "Investor.gov: social media and stock tip scams", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins/social-media-stock-scams" },
  { label: "OIC: how LEAPS work", url: "https://www.optionseducation.org/optionsoverview/how-leaps-work" },
  { label: "Reuters: S&P 500 jumps 9.5% after the 90-day tariff pause (Apr 9, 2025)", url: "https://www.reuters.com/markets/us/futures-struggle-trumps-reciprocal-tariffs-shake-up-global-trade-2025-04-09/" },
];

/** Schwab Trader Talks webcast on news and trade decisions (oEmbed checked 2026-10-22). */
export const NEWS_VIDEO = { id: "7ug2YaVi0IU", title: "How the News Might Influence a Trade Decision | Trading a Smaller Account", channel: "Trader Talks: Schwab Coaching Webcasts" };

// ---------------------------------------------------------------- glossary
const t = (id: string, name: string, summary: string, detail: string): LiteracyTerm => ({ id, name, category: "process", summary, detail: `${detail} Educational, not advice.` });

export const NEWS_BIAS_TERMS: LiteracyTerm[] = [
  ...NEWS_BIASES.map((b) => t(b.id, b.name, b.definition, `News example: ${b.newsExample} Countermeasure: ${b.countermeasure}`)),
  t("information-overload", "Information overload", "More headlines, alerts and posts than you can weigh, which pushes decisions toward whatever is loudest or latest.",
    "Research on earnings days finds that when many companies report at once, prices react less at first and drift more afterwards (Hirshleifer, Lim & Teoh 2009). For a trader, overload shows up as overtrading: many small, unplanned trades. Limit your sources, set alerts only for levels in your plan, and decide before the open what would make you act."),
  t("overtrading", "Overtrading", "Trading more often than your plan calls for, usually in reaction to news or recent wins and losses.",
    "Each extra trade adds spread, fees and another chance to break your rules. Cap the number of trades per day and keep 'do nothing' as a valid choice."),
  t("leaps", "LEAPS", "Long-dated listed options (LEAPS®): about nine months to three years to expiry.",
    "LEAPS cost more premium up front than short-dated options and lose value to time decay more slowly. They suit a long-term view; a short news idea pays for time it may not need."),
];

// ---------------------------------------------------------------- Learn questions
type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const uniq = [...new Set(wrong.filter((w) => w !== right))].slice(0, 3);
  if (uniq.length < 3) throw new Error(`news quiz ${id}: needs 3 distinct wrong options`);
  const o = [...uniq];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}
const BIAS_NAMES = ["Recency bias", "Availability bias", "Confirmation bias", "FOMO", "Loss aversion", "Anchoring"];
const pick = (id: string, prompt: string, at: Letter, right: string, why: string, term: string) =>
  mc(id, prompt, at, right, BIAS_NAMES.filter((n) => n !== right).slice(0, 3), why, term);

export const NEWS_BIAS_QUESTIONS: QuizQuestion[] = [
  pick("NB-01", "Stocks fell after each of the last three tariff headlines, so you assume the next headline must send them lower too. Which bias?", "A", "Recency bias",
    "The latest events are being treated as a rule. In April 2025, after days of tariff-driven selling, the S&P 500 rose 9.5% on April 9 when a 90-day pause was announced.", "recency-bias"),
  pick("NB-02", "One vivid story of a stock doubling on a contract headline makes you think contract headlines usually lead to big gains. Which bias?", "C", "Availability bias",
    "Memorable examples feel common. The fix is the base rate across all similar headlines.", "availability-bias"),
  pick("NB-03", "You are long and only read the bullish notes, skipping the one about shrinking margins. Which bias?", "B", "Confirmation bias",
    "Seek the strongest evidence against your trade before you enter.", "confirmation-bias"),
  pick("NB-04", "A stock is up 15% on a headline, your feed is full of gains, and you buy at the high with no stop. Which bias?", "D", "FOMO",
    "Fear of missing out replaces the plan. Missing a move costs nothing.", "fomo"),
  pick("NB-05", "Your calls are down 40% after bad news. You hold past your stop, hoping to get back to even. Which bias?", "A", "Loss aversion",
    "Kahneman and Tversky's prospect theory: losses weigh more than equal gains, so people hold losers too long.", "loss-aversion"),
  pick("NB-06", "A stock was 80 before bad news and is 60 now. You buy because it 'should' return to 80. Which bias?", "B", "Anchoring",
    "The old price is an anchor. Re-price from today's facts and today's chart.", "anchoring"),
  mc("NB-07", "Which countermeasure best fits confirmation bias?", "C", "Write down the best case against the trade and what would prove you wrong",
    ["Read more articles that agree with you", "Trade larger to show conviction", "Ignore the news entirely forever"],
    "Actively looking for contrary evidence is the direct counter.", "confirmation-bias"),
  mc("NB-08", "A news idea needs a few weeks to play out. Why might an option about two months out fit better than a weekly?", "A", "It gives the story time while losing value to time decay more slowly than a weekly",
    ["It can never lose money", "It has no time decay at all", "It is always cheaper than a weekly"],
    "Weeklies are cheap but need the move almost at once. A longer expiry costs more but decays more slowly.", "leaps"),
  mc("NB-09", "What are LEAPS?", "D", "Long-dated listed options, about nine months to three years to expiry",
    ["Options that expire the same day", "A type of stock split", "Futures on news events"],
    "LEAPS cost the most premium up front and lose value to time decay the slowest.", "leaps"),
  mc("NB-10", "Studies of earnings days found that when many companies report at once, prices…", "B", "React less at first and drift more afterwards",
    ["React more at first and then reverse", "Do not react at all", "Always gap up"],
    "Hirshleifer, Lim and Teoh (2009): investor attention is limited, so busy news days slow the reaction.", "information-overload"),
  mc("NB-11", "A big one-day move with no identifiable news is, on average, more likely than a move on real news to…", "C", "Partly reverse in the following weeks",
    ["Keep drifting for a year", "Never move again", "Double the next day"],
    "Chan (2003) found reversal after large moves without news (mostly in smaller, less liquid stocks) and drift after real news, especially bad news.", "recency-bias"),
  mc("NB-12", "Bad news about a big customer often reaches the supplier's stock…", "A", "Slowly: investors underreact to news about economically linked firms",
    ["Before the customer's own stock", "Never", "Only on weekends"],
    "Cohen and Frazzini (2008) found returns of customers predict suppliers' returns, consistent with slow diffusion of news.", "information-overload"),
  mc("NB-13", "An OCO order on a long position is…", "D", "A sell limit (target) and a sell stop placed together; when one fills, the other is cancelled",
    ["Two buy orders at once", "A market order that ignores your stop", "An order that only works after hours"],
    "One-cancels-the-other locks in both exits before news hits. Brackets attach an OCO to the entry; some brokers send bracket exits as market orders."),
  mc("NB-14", "A stranger in a group chat promises a small stock will triple on upcoming news and asks for screenshots of your buys. This is most likely…", "B", "A pump-and-dump pattern: check the source before anything else",
    ["Inside information you should act on fast", "A normal analyst rating", "A regulator alert"],
    "Investor.gov and FINRA describe hype on social media and encrypted chats, then the promoters selling into the rise."),
  mc("NB-15", "Choppy price, conflicting headlines and no level nearby. The textbook choice is…", "C", "Do nothing: no edge is a reason to wait",
    ["Trade small anyway to stay involved", "Buy the most-mentioned stock", "Double the size to make it worthwhile"],
    "Waiting is a valid decision. The picture changes when price reaches an edge or gives a clear signal.", "no-trade-zone"),
  mc("NB-16", "You've made eight unplanned trades since the open, each after a new headline. What's happening?", "A", "Overtrading from information overload",
    ["Disciplined scalping", "Diversification", "Following the plan"],
    "Cap trades per day, limit sources, and only act on alerts tied to levels in your plan.", "overtrading"),
  mc("NB-17", "Which statement about the 'do nothing' rule is right?", "B", "Skipping a trade without an edge is a sound decision, not a mistake",
    ["You must trade every news day", "Doing nothing always loses to trading", "It only applies to crypto"],
    "No trade means no loss, no fees and no broken rules.", "no-trade-zone"),
];

// ---------------------------------------------------------------- the page's news-day scenario (generic, SIMULATED)
export const NEWS_DAY_STEPS: { id: string; headline: string; bias: string; ask: string; good: string; bad: string }[] = [
  { id: "pre", headline: "7:00 AM ET: a trade-policy headline hits. Futures are down 1.5%.", bias: "recency-bias", ask: "Buy puts before the open because the last three headlines all sent stocks lower?", good: "Wait for the open and a plan: headlines can reverse quickly, as the April 9, 2025 tariff pause showed.", bad: "Acting on the last three days as a rule." },
  { id: "open", headline: "9:45 AM ET: a stock you follow is up 12% on a partnership rumour; your feed is full of gains.", bias: "fomo", ask: "Chase it?", good: "Only with a written entry, stop and size, and the source checked. Otherwise pass.", bad: "Buying because everyone else is." },
  { id: "hold", headline: "11:30 AM ET: you bought earlier; it's now below your stop after a denial headline.", bias: "loss-aversion", ask: "Hold until it gets back to your entry?", good: "Exit at the plan's stop. An OCO set at entry would already have done it.", bad: "Hoping to get back to even." },
];
