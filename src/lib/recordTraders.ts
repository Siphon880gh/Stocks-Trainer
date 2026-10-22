/**
 * Record-Setting Traders (/practice/record-traders): only feats a neutral third party confirmed, each with the
 * verifier and a source link; a separate "reported, not publicly audited" box; a "does it still work?" verdict
 * built from published evidence; and a checklist for judging any track record. Educational, not advice.
 * Sources were loaded 2026-10-22.
 */
import type { QuizOption, QuizQuestion } from "./quizData";
import type { LiteracyTerm } from "./literacyTerms";

export interface RtSrc { label: string; url: string }

export const RT_BANNER = "This section includes only feats a neutral third party confirmed, with the verifier and source shown for each.";

export const RT_SRC = {
  berkshire: { label: "Berkshire Hathaway 2025 annual letter", url: "https://www.berkshirehathaway.com/letters/2025ltr.pdf" },
  usic2021: { label: "U.S. Investing Championship, 2021 final standings", url: "https://financial-competitions.com/previousstandings/2022/1/18/december-31-standings" },
  usicStandings: { label: "U.S. Investing Championship, standings", url: "https://financial-competitions.com/previousstandings" },
  usicRules: { label: "U.S. Investing Championship rules", url: "https://financial-competitions.com/rules" },
  fortune: { label: "Fortune, Dec 18, 2000 (archived)", url: "https://web.archive.org/web/2010/http://money.cnn.com/magazines/fortune/fortune_archive/2000/12/18/293117/index.htm" },
  effron: { label: "Effron performance report (PDF)", url: "https://chartpattern.com/articles/effron.pdf" },
  zangerCup: { label: "Cup and handle (trader's own site)", url: "https://www.chartpattern.com/cup-handle.cfm" },
  zangerInterview: { label: "TRADERS' interview, 2003 (PDF)", url: "https://www.chartpattern.com/articles/tradermag.pdf" },
  wccHist: { label: "World Cup Trading Championships, historical standings", url: "https://www.worldcupchampionships.com/world-cup-trading-championship-historical-standings" },
  wccStandings: { label: "World Cup Trading Championships, standings", url: "https://www.worldcupchampionships.com/world-cup-trading-championship-standings" },
  cmtWilliams: { label: "CMT Association speaker bio", url: "https://cmtassociation.org/presenter/larry-williams/" },
  biMichelle: { label: "Business Insider, 2011", url: "https://www.businessinsider.com/michelle-williams-trader-father-2011-1" },
  ungerInterview: { label: "Comparic interview", url: "https://comparic.com/exclusive-interview-andrea-unger-4-time-trading-champion/" },
  lat1987: { label: "Los Angeles Times, Mar 1, 1987", url: "https://www.latimes.com/archives/la-xpm-1987-03-01-fi-6876-story.html" },
  lat1990: { label: "Los Angeles Times, Feb 6, 1990", url: "https://www.latimes.com/archives/la-xpm-1990-02-06-fi-341-story.html" },
  biSchwartz: { label: "Business Insider, 2020", url: "https://www.businessinsider.com/stock-market-trading-rules-blueprint-from-market-legend-marty-schwartz-2020-9" },
  cnbcPtj: { label: "CNBC / The New York Times, 2014", url: "https://www.cnbc.com/2014/03/06/after-a-dazzling-early-career-a-star-trader-settles-down.html" },
  nyt1992: { label: "The New York Times / Reuters, Oct 27, 1992 (archived)", url: "https://web.archive.org/web/2020/https://www.nytimes.com/1992/10/27/business/big-winner-from-plunge-in-sterling.html" },
  dealbook: { label: "NYT DealBook, 2010", url: "https://archive.nytimes.com/dealbook.nytimes.com/2010/08/18/reviewing-the-druckenmiller-decades/" },
  cornell: { label: "Cornell, Journal of Portfolio Management 2020 (PDF)", url: "https://www.cornell-capital.com/uploads/papers/medallion-fund.pdf" },
  guoLiu: { label: "Guo & Liu, arXiv 2024", url: "https://arxiv.org/abs/2405.10917" },
  time1934: { label: "TIME, Mar 19, 1934", url: "https://time.com/archive/6894439/business-fourth-down/" },
  aaii: { label: "AAII stock screen performance", url: "https://www.aaii.com/stockideas/performance" },
  jt2001: { label: "Jegadeesh & Titman, NBER w7159", url: "https://www.nber.org/papers/w7159" },
  dm2016: { label: "Daniel & Moskowitz, NBER w20439", url: "https://www.nber.org/papers/w20439" },
  mp2016: { label: "McLean & Pontiff, Journal of Finance 2016", url: "https://onlinelibrary.wiley.com/doi/abs/10.1111/jofi.12365" },
  aqr: { label: "Hurst, Ooi & Pedersen, A Century of Evidence on Trend-Following", url: "https://www.aqr.com/Insights/Research/Journal-Article/A-Century-of-Evidence-on-Trend-Following-Investing" },
  french: { label: "Kenneth French Data Library (momentum factor)", url: "https://mba.tuck.dartmouth.edu/pages/faculty/ken.french/data_library.html" },
  ritter: { label: "Ritter, IPOs: Updated Statistics (PDF)", url: "https://site.warrington.ufl.edu/ritter/files/IPO-Statistics.pdf" },
  listingGap: { label: "Doidge, Karolyi & Stulz, NBER w21181", url: "https://www.nber.org/papers/w21181" },
  secDecimals: { label: "SEC testimony on decimal pricing, May 24, 2001", url: "https://www.sec.gov/news/testimony/052401tslu.htm" },
  secHft: { label: "SEC staff HFT literature review, 2014 (PDF)", url: "https://www.sec.gov/marketstructure/research/hft_lit_review_march_2014.pdf" },
  barber: { label: "Barber, Lee, Liu & Odean, J. Financial Markets 2014", url: "https://ideas.repec.org/a/eee/finmar/v18y2014icp1-24.html" },
  cnn1999: { label: "CNN, Dec 31, 1999 (archived)", url: "https://web.archive.org/web/2005/http://money.cnn.com/1999/12/31/markets/markets_newyork/" },
  secSeminar: { label: "SEC Investor Alert: trading seminar scams", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-alerts/investor-49" },
  cftc: { label: "CFTC fraud advisory: trading systems", url: "https://www.cftc.gov/LearnAndProtect/AdvisoriesAndArticles/fraudadv_tradingsystem.html" },
  nfa229: { label: "NFA Compliance Rule 2-29", url: "https://www.nfa.futures.org/rulebooksql/rules.aspx?RuleID=RULE+2-29&Section=4" },
  secMarketing: { label: "SEC Marketing Rule press release 2020-334", url: "https://www.sec.gov/news/press-release/2020-334" },
} satisfies Record<string, RtSrc>;

export type Strength = "strong" | "moderate";

export interface TraderCard {
  id: string;
  name: string;
  /** The feat exactly as the verifier supports it. */
  feat: string;
  period: string;
  /** Who confirmed it: a neutral third party, never the trader. */
  verifiedBy: string;
  /** What exactly was checked. */
  scope: string;
  source: RtSrc;
  moreSources?: RtSrc[];
  strength: Strength;
  technique: string;
  conditions: string;
  drawdowns: string;
  stillWorks: string;
}

export const TRADER_CARDS: TraderCard[] = [
  {
    id: "buffett", name: "Warren Buffett / Berkshire Hathaway",
    feat: "Per-share market value compounded 19.7% a year vs 10.5% for the S&P 500 with dividends; overall gain 6,099,294% vs 46,061%.",
    period: "1965–2025",
    verifiedBy: "Berkshire's audited annual report (public filing, performance table updated every year)",
    scope: "Per-share market value of a listed company, against the S&P 500 with dividends.",
    source: RT_SRC.berkshire, strength: "strong",
    technique: "Buy durable businesses and stocks at sensible prices and hold for the long term. Insurance float funds the investments. No trading, no margin-style leverage.",
    conditions: "Six decades of compounding from a small base; the edge was largest while the company was small.",
    drawdowns: "Per-share market value: 1974 −48.7%, 2008 −31.8%, 1990 −23.1%, 1999 −19.9% while the S&P gained 21.0%.",
    stillWorks: "The edge shrank with size. Compounding the letter's own table gives about 27.2% a year for 1965–1999, about 10.5% for 2000–2025, and about 13.5% vs the S&P's 14.1% for 2010–2025. In 2025: 10.9% vs 17.9%.",
  },
  {
    id: "minervini", name: "Mark Minervini",
    feat: "+334.8% in the $1 million+ stock division of the 2021 U.S. Investing Championship, a division record (the prior record was +119.1%). He also won the championship in 1997 (155%, as reported in Jack Schwager's Stock Market Wizards).",
    period: "2021 (one year); 1997",
    verifiedBy: "U.S. Investing Championship organiser, from brokerage statements of an account named in advance",
    scope: "One real-money account, time-weighted, for the contest year.",
    source: RT_SRC.usic2021, moreSources: [RT_SRC.usicRules], strength: "strong",
    technique: "Long-only growth and momentum leaders bought at precise entry points with tight risk control.",
    conditions: "2021 was a strong year for growth stocks. A $1M+ account makes the record harder to dismiss as a tiny-account lottery.",
    drawdowns: "Not published by the organiser.",
    stillWorks: "In a narrow sense, yes: a breakout and momentum trader set a verified record in 2021. It is one year; the source says nothing about later years.",
  },
  {
    id: "zanger", name: "Dan Zanger",
    feat: "An independent performance-measurement firm, Effron, measured a 29,223% time-weighted return on his personal account ($10,774 to $2,530,909). Fortune reviewed his 1999 tax return and trading records, which showed $14,232,878 in capital gains.",
    period: "June 1998 – May 1999 (12 months); calendar 1999",
    verifiedBy: "Fortune magazine (reviewed his 1999 tax return and trading records) and Effron Enterprises (performance-measurement report)",
    scope: "Effron is a performance measurement, not a CPA audit opinion, and the report is hosted on the trader's own site. Fortune verified 1999 capital gains only; larger later totals are his own figures.",
    source: RT_SRC.fortune, moreSources: [RT_SRC.effron, RT_SRC.zangerCup, RT_SRC.zangerInterview], strength: "moderate",
    technique: "Chart patterns plus volume and no indicators. Cup and handle: a 20–35% correction over 8–12 weeks after a 2–4-month advance, then a handle drifting sideways to down for 4 days to 3 weeks about 5% below the old high; buy the break to new highs. If a breakout doesn't accelerate he sells the same day. No trailing stops, no profit targets; 2:1 margin, up to about 15% of equity in one stock.",
    conditions: "The 1998–2000 bubble: the Nasdaq rose 85.6% in 1999, and 1999–2000 IPOs averaged a 64.6% first-day gain. 2:1 margin on concentrated, high-beta internet stocks. Even so, half of Nasdaq stocks fell in 1999.",
    drawdowns: "In the measured year: −39.09% in Aug 1998 and −16.84% in Oct 1998. He has said he later had about a 75% drawdown in the 2000–2002 bear market, including a −32% day in Oct 2000.",
    stillWorks: "Breakouts on volume from proper bases still happen. The record needed a once-in-a-generation bubble, 2:1 margin, extreme concentration and a 12-month window.",
  },
  {
    id: "larry-williams", name: "Larry Williams",
    feat: "11,376% net in the 1987 World Cup Championship of Futures Trading, still the event's all-time record.",
    period: "1987 (12 months)",
    verifiedBy: "World Cup Trading Championships official standings (organiser; results subject to final audit)",
    scope: "One real-money futures account in a 12-month contest. The organiser is a commercial firm.",
    source: RT_SRC.wccHist, moreSources: [RT_SRC.cmtWilliams], strength: "moderate",
    technique: "Short-term futures trading. He created the Williams %R indicator.",
    conditions: "A small $10,000 starting account, futures leverage, and the most volatile U.S. market year in decades, with the October 1987 crash inside the window.",
    drawdowns: "Not published by the organiser.",
    stillWorks: "Recent World Cup futures winners still post triple digits (532.3% in 2024, 324.7% in 2025), far below the 1987 record.",
  },
  {
    id: "michelle-williams", name: "Michelle Williams",
    feat: "1,001% in the 1997 World Cup Championship of Futures Trading: $10,000 into more than $100,000, at age 17.",
    period: "1997 (12 months)",
    verifiedBy: "World Cup Trading Championships official standings, reported by Business Insider",
    scope: "One small real-money contest account for one year.",
    source: RT_SRC.wccHist, moreSources: [RT_SRC.biMichelle], strength: "moderate",
    technique: "Futures trading, taught by her father. She later left trading for acting.",
    conditions: "A small account and a contest format that rewards high risk.",
    drawdowns: "Not published.",
    stillWorks: "A one-year, small-account record shows what is possible at high risk. It says nothing about repeatability.",
  },
  {
    id: "unger", name: "Andrea Unger",
    feat: "World Cup Championship of Futures Trading: 671.9% in 2008, 115.4% in 2009 and 239.6% in 2010, plus 82.8% in a quarterly event in Q4 2012.",
    period: "2008–2010; Q4 2012",
    verifiedBy: "World Cup Trading Championships official standings (organiser)",
    scope: "Real-money contest accounts, one year (or one quarter) at a time.",
    source: RT_SRC.wccHist, moreSources: [RT_SRC.ungerInterview], strength: "moderate",
    technique: "Rule-based futures systems diversified across index, bond and commodity futures. He says they work better in volatile markets.",
    conditions: "2008 was an extremely volatile year. He says contest trading is \"very risky\" and unlike his normal trading.",
    drawdowns: "He says he had at least 3 years of losses before becoming profitable.",
    stillWorks: "He frames 2008 as a product of that year's volatility, not a repeatable annual figure: \"a contest is not like normal trading, everything is extreme, you need also luck.\"",
  },
  {
    id: "ryan", name: "David Ryan",
    feat: "U.S. Trading Championship, two-year stock category: $43,000 into $295,000 (+578%). Later described as a three-time winner.",
    period: "Two-year contest ending 1986",
    verifiedBy: "Los Angeles Times, reporting the championship organiser's results",
    scope: "Contest results as reported by the press.",
    source: RT_SRC.lat1987, moreSources: [RT_SRC.lat1990], strength: "moderate",
    technique: "Growth stocks in the CAN SLIM school; he worked at William O'Neil & Co. \"I buy high and sell even higher.\"",
    conditions: "The mid-1980s bull market in growth stocks.",
    drawdowns: "In 1989 he was far ahead going into the third quarter, then stayed flat and lost the title.",
    stillWorks: "The method is still taught; contest wins are year-by-year and can slip away inside one year.",
  },
  {
    id: "schwartz", name: "Marty Schwartz",
    feat: "Made more money than all the other contestants combined in 9 of the 10 four-month trading championships he entered, starting with about $400,000, at an average 210% (not annualized).",
    period: "1980s contests",
    verifiedBy: "Jack Schwager, Market Wizards (as reported by Business Insider)",
    scope: "Contest results as reported by an interviewer, not the raw standings.",
    source: RT_SRC.biSchwartz, strength: "moderate",
    technique: "Short-term index and stock trading that stays with the moving averages, knows the exit point before entry, and takes losses quickly.",
    conditions: "Short four-month windows and a large starting stake.",
    drawdowns: "About a decade of losing money before he changed his approach.",
    stillWorks: "The habits (pre-set exits, fast loss-cutting) are standard practice today; the contest figures are short windows.",
  },
  {
    id: "ptj", name: "Paul Tudor Jones",
    feat: "+125.9% after fees in his main hedge fund in 1987.",
    period: "1987",
    verifiedBy: "The New York Times (carried by CNBC), citing fund investor materials",
    scope: "A fund's net return for one year, from investor materials seen by the press.",
    source: RT_SRC.cnbcPtj, strength: "moderate",
    technique: "Global macro: riding large moves in interest rates, currencies and stock indexes.",
    conditions: "The 1987 crash, which he positioned for in advance.",
    drawdowns: "2008 was −4.9%, his only down year to that point.",
    stillWorks: "2010–2012 averaged about 5% a year. Investors cited near-zero rates, fewer big macro moves, more competition and more conservative risk for institutional clients.",
  },
  {
    id: "soros-druckenmiller", name: "George Soros & Stanley Druckenmiller",
    feat: "A short of the British pound worth almost $10 billion made almost $1 billion for the $4 billion Quantum Fund and three smaller funds when sterling left the European exchange-rate mechanism.",
    period: "September 1992",
    verifiedBy: "The New York Times (Reuters report, 1992) and NYT DealBook (2010)",
    scope: "Press reports; the profit figure is Soros's own estimate, confirmed as the press account. DealBook says Druckenmiller orchestrated the trade.",
    source: RT_SRC.nyt1992, moreSources: [RT_SRC.dealbook], strength: "moderate",
    technique: "Macro: find a policy peg the economy can't sustain, then size up heavily with high conviction.",
    conditions: "A fixed-rate regime under strain, with a central bank that couldn't hold the floor.",
    drawdowns: "In 2000 Druckenmiller bought internet stocks near the top and later said: \"We thought it was the eighth inning, and it was the ninth. I overplayed my hand.\"",
    stillWorks: "It depended on a strained currency peg; the conviction-sizing lesson transfers, the exact set-up is rare.",
  },
];

/** Reported, not publicly audited: shown separately with no Verified-by line. */
export const REPORTED_BOX = {
  id: "medallion",
  title: "Reported, not publicly audited: Jim Simons and the Medallion fund",
  body: [
    "Medallion is private and closed to outside investors. The figures come from journalist-obtained data, reproduced in an academic note: an average gross return of 66.07% a year for 1988–2018 (39.20% after fees), with no losing gross year.",
    "66% is an arithmetic average, not a compounded rate. One academic estimate based on fund size and profits puts the compounded gross return below 35%.",
    "The outside-investor fund at the same firm fell 22.62% in 2020 while Medallion reportedly gained 76%: the edge did not transfer to scale or to outsiders.",
  ],
  sources: [RT_SRC.cornell, RT_SRC.guoLiu],
};

/** Outside the verified list: a legend with no neutral record of the famous numbers. */
export const CONTRAST_BOX = {
  id: "livermore",
  title: "Contrast, outside the verified list: Jesse Livermore",
  body: "No neutral record of his famous 1929 short exists. What a neutral source did record: in March 1934 he went bankrupt for the fourth time, with liabilities of $2,259,212.48 and assets of $184,900, and \"for the first time in 25 years he did not seem to prosper in a falling market.\"",
  sources: [RT_SRC.time1934],
};

/** A method, not a performance card. */
export const METHOD_BOX = {
  id: "can-slim",
  title: "A method, not a record: CAN SLIM",
  body: "AAII tracks a paper screen based on the CAN SLIM rules: about 17.5% a year since 1998, with losing years such as 2018 (−32.2%), 2022 (−15.8%) and 2025 (−10.9%). These are hypothetical, price-only results before trading costs, so treat them as indicative.",
  sources: [RT_SRC.aaii],
};

/** Common breakout habits taught in many courses. Not drawn from any trader on this page. */
export const GENERIC_BREAKOUT_HABITS = [
  "Watch the 10-, 21- and 50-day moving averages as trend guides.",
  "Look for breakout volume well above average (some use about 2× the 50-day average).",
  "Size positions so one stop-out costs a small, fixed share of the account.",
];

export interface Evidence { text: string; sources: RtSrc[] }
export const STILL_SHOWS_UP: Evidence[] = [
  { text: "Momentum: 3–12-month winners kept beating losers through the 1990s, which argues against the original result being data-mined.", sources: [RT_SRC.jt2001] },
  { text: "Trend following was profitable across about 110 years of data and, since 1985, in nearly all futures markets (authors work at a firm that sells trend strategies).", sources: [RT_SRC.aqr] },
  { text: "Real-money contests still produce triple digits: +969.8% in the 2025 U.S. Investing Championship stock division; 532.3% (2024) and 324.7% (2025) in World Cup futures.", sources: [RT_SRC.usicStandings, RT_SRC.wccStandings] },
];
export const HAS_WEAKENED: Evidence[] = [
  { text: "Momentum crashes: long strings of losses in panic states after market declines. Compounding the published momentum factor (long-short, before costs) gives about 7.4% a year for 1927–1992, 3.4% for 1993–2025, and about −0.1% for 2001–2025.", sources: [RT_SRC.dm2016, RT_SRC.french] },
  { text: "Publication crowds out edges: returns of 97 published predictors were 26% lower out-of-sample and 58% lower after publication.", sources: [RT_SRC.mp2016] },
  { text: "Smaller IPO pops: mean first-day returns fell from 64.6% in 1999–2000 to 19.1% in 2001–2025.", sources: [RT_SRC.ritter] },
  { text: "Fewer listed companies: about 8,000 in 1996 to about 4,100 in 2012, especially smaller firms.", sources: [RT_SRC.listingGap] },
  { text: "Market structure: decimal pricing (completed April 9, 2001) cut the tick from $0.0625 to $0.01, and high-frequency trading was estimated at more than half of U.S. equity volume.", sources: [RT_SRC.secDecimals, RT_SRC.secHft] },
  { text: "Most active traders lose: fewer than 1% of Taiwan day traders were predictably profitable after fees; only 17% of 688 U.S. Investing Championship entrants showed a profit at mid-2026 while the S&P 500 was up 10.2%.", sources: [RT_SRC.barber, RT_SRC.usicStandings] },
];
export const VERDICT = "The ingredients still work: momentum, breakouts on volume from proper bases, trend following and strict loss-cutting, and verified contests still show triple-digit years in small accounts. The record-scale numbers came from a specific regime (a parabolic bubble or the 1987 crash), plus leverage, plus extreme concentration, plus a short window, and the same traders reported deep drawdowns afterwards. Repeating them is rare, and most people who try lose.";

export interface CheckItem { id: string; q: string; why: string; sources: RtSrc[] }
export const JUDGE_CHECKLIST: CheckItem[] = [
  { id: "who", q: "Who checked it?", why: "Best: audited public filings, or a contest tracking a pre-named account from brokerage statements. Weaker: a document that exists only on the trader's own site.", sources: [RT_SRC.usicRules, RT_SRC.secSeminar] },
  { id: "scope", q: "What exactly was verified?", why: "A tax return proving one year's capital gains is not proof of a bigger multi-year total. Read the scope.", sources: [RT_SRC.fortune] },
  { id: "real", q: "Real money or hypothetical?", why: "Hypothetical results can be built from the trades that would have done best, with the benefit of hindsight.", sources: [RT_SRC.cftc, RT_SRC.nfa229] },
  { id: "net", q: "Net of fees, and all accounts?", why: "Gross-only figures and cherry-picked accounts or periods are banned in adviser marketing for a reason.", sources: [RT_SRC.secMarketing, RT_SRC.nfa229] },
  { id: "twr", q: "Time-weighted return or account value?", why: "Withdrawals and deposits change the picture: a huge time-weighted return can sit next to a modest ending balance.", sources: [RT_SRC.effron] },
  { id: "avg", q: "Arithmetic average or compounded?", why: "An average of yearly returns overstates growth; compounding is what you actually keep.", sources: [RT_SRC.guoLiu] },
  { id: "window", q: "How long is the window, and what was the market doing?", why: "One year in a bubble or a crash is not a career.", sources: [RT_SRC.cnn1999] },
  { id: "dd", q: "What were the worst month and the worst drawdown?", why: "Ask for the worst peak-to-trough drop; record years often contain brutal months.", sources: [RT_SRC.effron] },
  { id: "survivors", q: "How many tried and failed?", why: "Contests list winners, not the majority who lost.", sources: [RT_SRC.lat1987, RT_SRC.usicStandings] },
  { id: "incentive", q: "Is the record used to sell something?", why: "Courses, newsletters, chat rooms and copy-trading all profit from a big headline number. \"Easy\" and \"guaranteed\" are red flags.", sources: [RT_SRC.secSeminar] },
];

/** SIMULATED claims for the practice drill: decide whether the evidence is strong or weak. */
export interface ClaimDrill { id: string; claim: string; answer: "strong" | "weak"; why: string }
export const CLAIM_DRILL: ClaimDrill[] = [
  { id: "c1", claim: "SIMULATED: \"My system made 900% last year.\" Proof: a backtest spreadsheet on the course sales page.", answer: "weak", why: "Hypothetical, self-published and attached to a product." },
  { id: "c2", claim: "SIMULATED: A contest organiser's final standings show +140% for a pre-registered real-money account, from monthly brokerage statements.", answer: "strong", why: "Neutral verifier, real money, pre-named account." },
  { id: "c3", claim: "SIMULATED: \"Averaged 80% a year for 10 years\" (arithmetic average), private fund, figures from an unnamed investor.", answer: "weak", why: "Not audited, and an arithmetic average overstates compounding." },
  { id: "c4", claim: "SIMULATED: A public company's audited annual report shows 12% a year per-share growth over 20 years against its benchmark.", answer: "strong", why: "Audited public filing over a long window." },
  { id: "c5", claim: "SIMULATED: Screenshots of three winning trades posted on social media, \"up 4,000% this month\".", answer: "weak", why: "Cherry-picked trades, no account, no verifier, tiny window." },
];

type Letter = "A" | "B" | "C" | "D";
const L: Letter[] = ["A", "B", "C", "D"];
function mc(id: string, prompt: string, at: Letter, right: string, wrong: string[], explanation: string, glossaryTermId?: string): QuizQuestion {
  const o = [...wrong];
  o.splice(L.indexOf(at), 0, right);
  const options: QuizOption[] = o.map((label, i) => ({ id: L[i]!, label, description: "" }));
  return { id, prompt, correctAnswer: at, options, explanation, ...(glossaryTermId ? { glossaryTermId } : {}) };
}

export const RT_QUESTIONS: QuizQuestion[] = [
  mc("RT-01", "Which record on this page rests on the strongest verification?", "B", "Berkshire's 1965–2025 per-share record, from audited annual reports", ["A contest win reported years later in a book", "A fund average obtained by a journalist", "A record stated on the trader's own website"], "Audited public filings beat press reports and self-published documents.", "verified-track-record"),
  mc("RT-02", "The Effron report measured a 29,223% return over what period?", "C", "12 months: June 1998 to May 1999", ["Two years", "18 months to December 1999", "Calendar 2000"], "Larger, longer totals are the trader's own figures."),
  mc("RT-03", "What did Fortune actually verify from his 1999 tax return and trading records?", "A", "$14.2 million in 1999 capital gains", ["$42 million in 23 months", "$18 million in 18 months", "A 75% drawdown"], "Verify the scope: one year's capital gains.", "verified-track-record"),
  mc("RT-04", "In the trader's own cup-and-handle rules, how deep is the cup?", "D", "About 20–35% off the old high, over 8–12 weeks", ["5–10%", "50–60%", "Any depth, as long as volume is high"], "The handle then sits about 5% below the old high.", "cup-and-handle"),
  mc("RT-05", "What did he do when a breakout didn't accelerate?", "B", "Sold it promptly the same day", ["Added to it on margin", "Moved a trailing stop up", "Waited for the 50-day moving average"], "No trailing stops, no profit targets, and no indicators."),
  mc("RT-06", "Why is the Medallion fund in a separate box with no Verified-by line?", "C", "It is private; its figures were obtained by a journalist and never publicly audited", ["It lost money", "It only traded options", "Its returns were too small to matter"], "Reported, not publicly audited."),
  mc("RT-07", "\"66% a year\" for Medallion is…", "A", "An arithmetic average of yearly returns, which overstates compounded growth", ["A compounded annual rate", "An after-fee figure", "Its single best year"], "Compounded estimates are much lower.", "compounded-annual-return"),
  mc("RT-08", "McLean & Pontiff found published predictor returns after publication were…", "D", "About 58% lower", ["Unchanged", "About 10% higher", "Exactly zero"], "Once an edge is public, others crowd it.", "post-publication-decay"),
  mc("RT-09", "Mean IPO first-day returns in 1999–2000 vs 2001–2025?", "B", "64.6% vs 19.1%", ["19.1% vs 64.6%", "10% vs 10%", "200% vs 50%"], "The bubble-era tailwind is much smaller today."),
  mc("RT-10", "A contest lists a 900% winner. What should you also ask?", "C", "How many entrants lost: at mid-2026 only 17% of 688 showed a profit", ["Which broker the winner used", "Whether the winner used candlesticks", "Nothing: the winner proves it works"], "Winners are listed; losers aren't.", "survivorship-bias"),
  mc("RT-11", "Why can a 29,223% time-weighted return end with only about $2.5 million?", "A", "Time-weighted returns strip out deposits and withdrawals; money was withdrawn during the year", ["The report is wrong", "Taxes are deducted from time-weighted returns", "Margin interest is ignored"], "Time-weighted measures the trading, not the balance.", "time-weighted-return"),
  mc("RT-12", "The CFTC warns about \"hypothetical\" results because…", "D", "Promoters can pick the historical trades that would have done best", ["They are always audited", "They include fees twice", "They only cover futures"], "Real-money results beat backtests for verification.", "hypothetical-performance"),
  mc("RT-13", "Which conditions sat behind the 11,376% futures-contest record of 1987?", "B", "A $10,000 account, futures leverage and the year of the October crash", ["A $10 million account and no leverage", "A ten-year window", "Index funds only"], "Small base + leverage + extreme volatility + short window."),
  mc("RT-14", "Compounding Berkshire's table for 2010–2025 gives roughly…", "C", "About 13.5% a year vs about 14.1% for the S&P 500", ["About 27% a year vs 10%", "About 40% a year", "A loss"], "The edge shrank as the company grew."),
  mc("RT-15", "Compounding the published momentum factor for 2001–2025 gives about…", "A", "−0.1% a year (long-short, before costs)", ["+7.4% a year", "+25% a year", "+58% a year"], "Momentum still exists in places, but the classic factor has been weak since 2001.", "price-momentum"),
  mc("RT-16", "Which of these is NOT one of the trader's own published rules on this page?", "D", "Buy only when the 10/21/50-day moving averages line up", ["No indicators, just chart patterns and volume", "2:1 margin", "Sell the same day if a breakout stalls"], "Moving-average stacks are generic breakout habits, not his."),
];

export const RT_TERMS: LiteracyTerm[] = [
  { id: "verified-track-record", name: "Verified track record", category: "process", summary: "A performance record confirmed by a neutral party that saw the account data, not by the trader.", detail: "Strongest: audited public filings or a contest tracking a pre-named real-money account from brokerage statements. Weaker: press reports or documents hosted only on the trader's own site. Educational, not advice." },
  { id: "time-weighted-return", name: "Time-weighted return", category: "process", summary: "A return that removes the effect of deposits and withdrawals, so it measures the trading itself.", detail: "Each sub-period between cash flows is measured and the results are chained together. A huge time-weighted return can sit beside a modest ending balance if money was withdrawn. Educational, not advice." },
  { id: "hypothetical-performance", name: "Hypothetical performance", category: "process", summary: "Results from a backtest or simulation rather than a real account.", detail: "Regulators require warnings because hypothetical results are prepared with hindsight and can be tuned to the trades that would have done best. Educational, not advice." },
  { id: "compounded-annual-return", name: "Compounded annual return", category: "markets", summary: "The steady yearly rate that turns the starting value into the ending value.", detail: "Lower than the arithmetic average whenever returns vary: +100% then −50% averages +25% a year but compounds to 0%. Educational, not advice." },
  { id: "price-momentum", name: "Price momentum", category: "markets", summary: "The tendency of recent 3–12-month winners to keep outperforming recent losers for a while.", detail: "Documented since 1993 and persistent in the 1990s, but prone to sharp crashes after market declines and much weaker since 2001 in the classic long-short form. Educational, not advice." },
  { id: "post-publication-decay", name: "Post-publication decay", category: "markets", summary: "An edge shrinking after it is published, as more traders use it.", detail: "One study of 97 predictors found returns 58% lower after publication. Educational, not advice." },
  { id: "global-macro", name: "Global macro", category: "markets", summary: "Trading big moves in interest rates, currencies, commodities and indexes based on economic and policy views.", detail: "Classic example: betting a currency peg will break. Educational, not advice." },
  { id: "can-slim", name: "CAN SLIM", category: "process", summary: "A growth-stock screening method: earnings growth, new highs, leadership and a healthy market.", detail: "A method, not a performance record. Paper screens based on it show strong long-run results with deep losing years. Educational, not advice." },
];
