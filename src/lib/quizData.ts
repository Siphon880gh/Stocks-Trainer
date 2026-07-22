import type { AssetClass } from "./samplePacks";

export type PatternId =
  | "doji"
  | "hammer"
  | "engulfing"
  | "bullish-engulfing"
  | "bearish-engulfing"
  | "shooting-star"
  | "inverted-hammer"
  | "morning-star";

export interface QuizOption {
  id: "A" | "B" | "C" | "D" | "E";
  patternId?: PatternId;
  label: string;
  description: string;
}

export interface QuizQuestion {
  id: string;
  prompt: string;
  correctAnswer: "A" | "B" | "C" | "D" | "E";
  options: QuizOption[];
  explanation: string;
  patternKey?: string;
  overlayId?: string;
  highlightIndex?: number;
  /** Optional Archive literacy term id for glossary deep-link */
  glossaryTermId?: string;
  /** Optional structured financial snapshot id (E4.M2 card) */
  snapshotId?: string;
  /** Planner filter tag (E4.M3.S2) */
  assetClass?: AssetClass;
  /** Optional E1 sample pack id for equity-backed drills */
  samplePackId?: string;
}

const OPTIONS_3: QuizOption[] = [
  { id: "A", patternId: "doji", label: "Doji", description: "Indecision in the market with equal open/close." },
  { id: "B", patternId: "hammer", label: "Hammer", description: "Bullish reversal pattern with a long lower shadow." },
  { id: "C", patternId: "engulfing", label: "Engulfing", description: "Body of current candle covers previous candle." },
];

const OPTIONS_5: QuizOption[] = [
  { id: "A", patternId: "hammer", label: "Hammer", description: "Long lower shadow, small body at top." },
  { id: "B", patternId: "bearish-engulfing", label: "Bearish Engulfing", description: "Red body engulfs prior green." },
  { id: "C", patternId: "shooting-star", label: "Shooting Star", description: "Long upper shadow, small body at bottom." },
  { id: "D", patternId: "inverted-hammer", label: "Inverted Hammer", description: "Long upper shadow; bullish bottom reversal." },
  { id: "E", patternId: "morning-star", label: "Morning Star", description: "Three-candle bullish reversal." },
];

const INDICATOR_OPTIONS: QuizOption[] = [
  { id: "A", label: "SMA", description: "Simple Moving Average" },
  { id: "B", label: "EMA", description: "Exponential Moving Average" },
  { id: "C", label: "RSI", description: "Relative Strength Index" },
  { id: "D", label: "MACD", description: "Moving Average Convergence Divergence" },
  { id: "E", label: "Bollinger Bands", description: "Volatility bands around SMA" },
];

export const QUIZ_OPTIONS = OPTIONS_3;

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "PR-042",
    prompt: "Analyze the price action highlighted in the terminal window below. Which candlestick pattern is currently forming at the resistance level?",
    correctAnswer: "B",
    options: OPTIONS_3,
    explanation:
      "The long lower shadow indicates that sellers drove prices down, but were met with strong buying pressure, pushing the price back up near the open. This is a classic bullish sign.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-018",
    prompt: "Identify the candlestick pattern at the highlighted area. What does this formation suggest about market sentiment?",
    correctAnswer: "A",
    options: OPTIONS_3,
    explanation:
      "A Doji shows open and close at nearly the same level, indicating indecision. Buyers and sellers are in equilibrium; a breakout often follows.",
    patternKey: "doji",
    highlightIndex: 2,
  },
  {
    id: "PR-031",
    prompt: "Which pattern appears at the marked candle? Consider the relationship between the current and previous candle bodies.",
    correctAnswer: "C",
    options: OPTIONS_3,
    explanation:
      "The current candle's body completely engulfs the previous candle's body. This signals a strong shift in momentum and often precedes a trend reversal.",
    patternKey: "engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-055",
    prompt: "At the marked candle, price rejected a sharp move lower and closed near the high. What pattern is this?",
    correctAnswer: "B",
    options: OPTIONS_3,
    explanation:
      "The long lower wick and small body at the top indicate a Hammer. Sellers pushed down but buyers reclaimed control—a bullish reversal signal.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-019",
    prompt: "The marked candle shows a near-identical open and close with long upper and lower shadows. Identify the pattern.",
    correctAnswer: "A",
    options: OPTIONS_3,
    explanation:
      "Open equals close (or nearly so) with extended wicks—a Doji. This signals indecision and often precedes a reversal or breakout.",
    patternKey: "doji",
    highlightIndex: 2,
  },
  {
    id: "PR-033",
    prompt: "The green candle at the marked position fully engulfs the prior red candle. What pattern is this?",
    correctAnswer: "C",
    options: OPTIONS_3,
    explanation:
      "The current candle's body completely engulfs the previous candle's body. This signals a strong shift in momentum and often precedes a trend reversal.",
    patternKey: "engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-061",
    prompt: "After a downtrend, the marked candle shows a long lower shadow and small body at the top. Which pattern?",
    correctAnswer: "B",
    options: OPTIONS_3,
    explanation:
      "A Hammer forms when the lower wick is at least twice the body size. It suggests buyers stepped in after a sell-off.",
    patternKey: "hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-022",
    prompt: "The marked candle shows equilibrium between buyers and sellers—open and close nearly identical. Identify the pattern.",
    correctAnswer: "A",
    options: OPTIONS_3,
    explanation:
      "A Doji represents indecision. The market tested both directions but closed where it opened—a potential reversal point.",
    patternKey: "doji",
    highlightIndex: 2,
  },
  {
    id: "PR-038",
    prompt: "At the marked candle, a strong green body completely overlaps the previous red body. What pattern is this?",
    correctAnswer: "C",
    options: OPTIONS_3,
    explanation:
      "Bullish Engulfing: the new candle's body completely contains the prior candle's body, signaling strong buying momentum.",
    patternKey: "engulfing",
    highlightIndex: 3,
  },
  {
    id: "PR-044",
    prompt: "The marked candle has a long upper shadow and small body at the bottom after an uptrend. What pattern?",
    correctAnswer: "C",
    options: OPTIONS_5,
    explanation: "Shooting Star: long upper wick shows rejection of higher prices; bearish reversal at tops.",
    patternKey: "shooting-star",
    highlightIndex: 2,
  },
  {
    id: "PR-047",
    prompt: "A red candle fully engulfs the prior green candle at the marked position. Identify the pattern.",
    correctAnswer: "B",
    options: OPTIONS_5,
    explanation: "Bearish Engulfing: red body engulfs prior green; strong selling momentum.",
    patternKey: "bearish-engulfing",
    highlightIndex: 2,
  },
  {
    id: "PR-051",
    prompt: "After a downtrend, the marked candle shows a long upper shadow and small body. What pattern?",
    correctAnswer: "D",
    options: OPTIONS_5,
    explanation: "Inverted Hammer: same shape as Shooting Star but at bottom; bullish reversal signal.",
    patternKey: "inverted-hammer",
    highlightIndex: 2,
  },
  {
    id: "PR-058",
    prompt: "Identify the three-candle formation: large red, small middle, large green. What pattern?",
    correctAnswer: "E",
    options: OPTIONS_5,
    explanation: "Morning Star: three-candle bullish reversal at bottom of downtrend.",
    patternKey: "morning-star",
    highlightIndex: 3,
  },
];

export const INDICATOR_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "IN-01",
    prompt: "Which indicator is displayed on the chart? It smooths price and shows trend direction.",
    correctAnswer: "A",
    options: INDICATOR_OPTIONS,
    explanation: "SMA averages closing prices over a period; price above SMA = bullish bias.",
    overlayId: "sma",
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
  {
    id: "IN-02",
    prompt: "Which indicator is shown? It gives more weight to recent prices than older ones.",
    correctAnswer: "B",
    options: INDICATOR_OPTIONS,
    explanation: "EMA reacts faster to new data; popular for swing trading.",
    overlayId: "ema",
    assetClass: "equity",
    samplePackId: "eq-index-proxy",
  },
  {
    id: "IN-03",
    prompt: "Identify the oscillator (0–100) that measures overbought/oversold conditions.",
    correctAnswer: "C",
    options: INDICATOR_OPTIONS,
    explanation: "RSI above 70 = overbought; below 30 = oversold.",
    overlayId: "rsi",
    assetClass: "equity",
    samplePackId: "eq-cyclical",
  },
  {
    id: "IN-04",
    prompt: "Which indicator shows the difference between fast and slow EMAs with a signal line?",
    correctAnswer: "D",
    options: INDICATOR_OPTIONS,
    explanation: "MACD crossovers signal potential trend changes.",
    overlayId: "macd",
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
  {
    id: "IN-05",
    prompt: "Which indicator displays a middle band with upper and lower volatility bands?",
    correctAnswer: "E",
    options: INDICATOR_OPTIONS,
    explanation: "Bollinger Bands: squeeze = low volatility before breakout.",
    overlayId: "bollinger",
    assetClass: "equity",
    samplePackId: "eq-index-proxy",
  },
];

/** Equity-pack-backed candle/indicator drills beyond the E4.M0 indicators gate (E4.M3). */
export const EQUITY_PATTERN_QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: "EQ-PAT-01",
    prompt:
      "SAMPLE mega-cap tech pack: after a mid-session dip, which candle pattern best matches a long lower wick reclaim near the lows?",
    correctAnswer: "B",
    options: OPTIONS_3,
    explanation:
      "A hammer-like reclaim after a dip is a process cue: sellers pushed, buyers absorbed. Tied to eq-mega-tech SAMPLE pack.",
    patternKey: "hammer",
    highlightIndex: 2,
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
  {
    id: "EQ-PAT-02",
    prompt:
      "SAMPLE index proxy pack: tight range, small bodies. Which indicator family best describes a middle band with volatility envelopes?",
    correctAnswer: "E",
    options: INDICATOR_OPTIONS,
    explanation:
      "Bollinger-style bands suit calm index ranges—watch squeezes before breakouts. Tied to eq-index-proxy SAMPLE pack.",
    overlayId: "bollinger",
    assetClass: "equity",
    samplePackId: "eq-index-proxy",
  },
  {
    id: "EQ-PAT-03",
    prompt:
      "SAMPLE cyclical energy pack: sharp selloff then bounce. Which oscillator (0–100) flags oversold extremes after a washout?",
    correctAnswer: "C",
    options: INDICATOR_OPTIONS,
    explanation:
      "RSI-style oscillators help label oversold after a cyclical dump—not a buy signal alone. Tied to eq-cyclical SAMPLE pack.",
    overlayId: "rsi",
    assetClass: "equity",
    samplePackId: "eq-cyclical",
  },
  {
    id: "EQ-PAT-04",
    prompt:
      "On the SAMPLE mega-cap grind, which smoother shows trend direction by averaging closes equally across the window?",
    correctAnswer: "A",
    options: INDICATOR_OPTIONS,
    explanation:
      "SMA is the equal-weight smoother. Equity pack context: trend bias vs noise on eq-mega-tech.",
    overlayId: "sma",
    assetClass: "equity",
    samplePackId: "eq-mega-tech",
  },
];

export const POINTS_PER_CORRECT = 50;
export const STREAK_BONUS = 10;

/** Equities literacy + risk/horizon (E4.M1) — text quizzes, SAMPLE teaching copy. */
export const EQUITY_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "EL-01",
    prompt: "What is a share of stock?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "A loan to a company", description: "That describes a bond, not equity." },
      { id: "B", label: "Ownership slice of a company", description: "Equity stake in the business." },
      { id: "C", label: "A government IOU", description: "Treasury instruments are debt, not stock." },
    ],
    explanation:
      "A share is a unit of ownership in a company. You own a claim on residual value and (often) voting rights—not a loan.",
    glossaryTermId: "stock-share",
  },
  {
    id: "EL-02",
    prompt: "Where do most U.S. listed stocks trade?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Exchanges / regulated markets", description: "e.g. NYSE, Nasdaq (SAMPLE context)." },
      { id: "B", label: "Only private chat rooms", description: "Public listings use formal markets." },
      { id: "C", label: "Company break rooms", description: "Not a market venue." },
    ],
    explanation:
      "Listed equities trade on exchanges (and related venues) with public quotes. SAMPLE teaching—not a brokerage recommendation.",
    glossaryTermId: "exchange",
  },
  {
    id: "EL-03",
    prompt: "Going long a stock means you expect the price to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Rise (or stay valuable long-term)", description: "You benefit if value increases." },
      { id: "B", label: "Fall immediately", description: "That is the short thesis." },
      { id: "C", label: "Become a bond", description: "Asset class does not change." },
    ],
    explanation:
      "A long position profits if the stock’s value rises (or you collect ownership benefits over time). Shorting bets on a decline.",
    glossaryTermId: "long-vs-short",
  },
  {
    id: "EL-04",
    prompt: "Going short a stock (when available) generally bets that price will…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Rise sharply", description: "That favors longs." },
      { id: "B", label: "Fall", description: "Shorts profit from declines (with extra risk)." },
      { id: "C", label: "Stay exactly flat forever", description: "Flat markets are not the short thesis." },
    ],
    explanation:
      "Shorting borrows shares to sell now and buy back later cheaper if price falls. Losses can exceed the initial stake—treat as advanced.",
    glossaryTermId: "long-vs-short",
  },
  {
    id: "EL-05",
    prompt: "Owning shares means you own…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "The CEO’s personal house", description: "Personal assets ≠ company equity." },
      { id: "B", label: "A guaranteed paycheck from the Fed", description: "No government wage for shareholders." },
      { id: "C", label: "A stake in the company itself", description: "Equity ownership in the business entity." },
    ],
    explanation:
      "Shares = ownership in the company (claims on residual earnings/assets after debts), not random personal property of executives.",
    glossaryTermId: "stock-share",
  },
  {
    id: "EL-06",
    prompt: "An exchange’s main job for equities is to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Match buyers and sellers with public prices", description: "Price discovery + liquidity." },
      { id: "B", label: "Guarantee every trade is profitable", description: "Markets do not remove risk." },
      { id: "C", label: "Print money for traders", description: "Not an exchange function." },
    ],
    explanation:
      "Exchanges (and market systems) help discover prices and match orders. They do not guarantee profits.",
    glossaryTermId: "exchange",
  },
  {
    id: "EL-07",
    prompt: "“Hold” as a decision often fits best when…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "You need adrenaline this minute", description: "Trading for thrills is not a plan." },
      { id: "B", label: "Your thesis and horizon still look intact", description: "No edge to chase noise." },
      { id: "C", label: "You forgot what you bought", description: "Amnesia is not a strategy." },
    ],
    explanation:
      "Hold is often correct when nothing material changed vs your plan and time horizon—avoid trading just to feel active.",
    glossaryTermId: "investing-vs-trading",
  },
  {
    id: "EL-08",
    prompt: "Investing vs trading — which statement is more accurate?",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Investing usually uses longer horizons; trading shorter ones",
        description: "Horizon and process differ.",
      },
      { id: "B", label: "They are identical words", description: "Different time and process norms." },
      { id: "C", label: "Trading always has zero risk", description: "False—trading can be riskier." },
    ],
    explanation:
      "Investing typically emphasizes multi-month/year ownership theses; trading emphasizes shorter moves. Match tools to horizon.",
    glossaryTermId: "investing-vs-trading",
  },
  {
    id: "EL-09",
    prompt: "Higher expected return usually comes with…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Zero risk by definition", description: "No free lunch." },
      { id: "B", label: "A government guarantee", description: "Listed equities are not risk-free." },
      { id: "C", label: "Higher risk / uncertainty", description: "Risk–return tradeoff." },
    ],
    explanation:
      "Risk and expected return travel together. Equities can lose value; SAMPLE lessons never erase that.",
    glossaryTermId: "risk-horizon",
  },
  {
    id: "EL-10",
    prompt: "If your goal is multi-year compounding, a useful first filter is…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Does this fit my risk and time horizon?", description: "Process before ticker chase." },
      { id: "B", label: "Can I double money before lunch?", description: "Lottery thinking." },
      { id: "C", label: "Is the chart neon green right now?", description: "Color alone is not a thesis." },
    ],
    explanation:
      "Start with horizon and risk capacity, then instruments. Short-horizon thrills often fight a long-horizon plan.",
    glossaryTermId: "risk-horizon",
  },
];

/** Financial statement literacy (E4.M2) — uses SAMPLE snapshot cards. */
export const FINANCIAL_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "FL-01",
    prompt: "On the SAMPLE snapshot, which line best captures total sales before expenses?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Revenue", description: "Top-line sales." },
      { id: "B", label: "Net income", description: "Bottom line after expenses." },
      { id: "C", label: "Liabilities", description: "Balance sheet claim, not sales." },
    ],
    explanation: "Revenue is the top line—sales before costs. Net income is what remains after expenses.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-02",
    prompt: "Net income is best described as…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Cash sitting in the bank", description: "Cash is a balance/cash-flow idea." },
      { id: "B", label: "Profit after expenses (accounting)", description: "Bottom-line earnings." },
      { id: "C", label: "Total assets", description: "Balance sheet stock of resources." },
    ],
    explanation:
      "Net income is accounting profit after expenses. It is not the same as cash in the bank.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-03",
    prompt: "Cash from operations vs net income — which is true?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "They are always identical", description: "Timing and accruals differ." },
      { id: "B", label: "Cash flow never matters", description: "Cash keeps the business alive." },
      { id: "C", label: "They can diverge; cash ≠ profit", description: "Accruals vs cash timing." },
    ],
    explanation:
      "Profit can include non-cash items and timing differences. Operating cash flow tracks cash generated by the business.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-04",
    prompt: "Assets on the balance sheet roughly mean…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Resources the company controls", description: "What it owns/controls." },
      { id: "B", label: "Only tomorrow’s revenue", description: "Revenue is income statement." },
      { id: "C", label: "Money owed to lenders only", description: "That is liabilities." },
    ],
    explanation: "Assets are resources controlled by the company (cash, inventory, PP&E, etc.).",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FL-05",
    prompt: "Liabilities are…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Owner’s residual claim", description: "That is equity." },
      { id: "B", label: "Obligations / claims by others", description: "Debt, payables, etc." },
      { id: "C", label: "Marketing slogans", description: "Not a financial statement line." },
    ],
    explanation: "Liabilities are obligations—what the company owes. Equity is the residual claim after liabilities.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FL-06",
    prompt: "Simple P/E on the SAMPLE card is closest to…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Price ÷ earnings", description: "How many $ of price per $ of earnings." },
      { id: "B", label: "Revenue ÷ assets", description: "Different ratio." },
      { id: "C", label: "Cash ÷ liabilities", description: "Liquidity-style idea, not P/E." },
    ],
    explanation:
      "P/E = price per share ÷ earnings per share (here shown as price / earnings on the SAMPLE card).",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-07",
    prompt: "Net margin on the snapshot is…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Assets ÷ liabilities", description: "Leverage-style ratio." },
      { id: "B", label: "Price ÷ revenue", description: "Not net margin." },
      { id: "C", label: "Net income ÷ revenue", description: "Profitability percent." },
    ],
    explanation: "Net margin = net income / revenue. Higher means more of each sales dollar kept as profit.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FL-08",
    prompt: "Free cash flow is useful because it approximates…",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Cash left after operating needs / reinvestment",
        description: "Cash available after sustaining the business.",
      },
      { id: "B", label: "Marketing budget only", description: "Too narrow." },
      { id: "C", label: "Share count", description: "Equity structure, not cash flow." },
    ],
    explanation:
      "Free cash flow approximates cash generated after operating cash needs and sustaining investment—useful for flexibility (SAMPLE teaching).",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FL-09",
    prompt: "If net income is positive but operating cash flow is weak, a careful reader…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Ignores cash forever", description: "Cash stress can sink a firm." },
      { id: "B", label: "Asks why cash and profit diverge", description: "Process check." },
      { id: "C", label: "Assumes fraud automatically", description: "Investigate, don’t jump." },
    ],
    explanation:
      "Divergence invites questions (working capital, accruals, one-offs)—not an automatic conclusion. Read both statements.",
    snapshotId: "snap-cyclical",
  },
];

export const NEWS_LITERACY_QUESTIONS: QuizQuestion[] = [
  {
    id: "NL-01",
    prompt: "A viral social post claims a buyout with no company filing. Best first move?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Buy immediately", description: "Chase unverified noise." },
      { id: "B", label: "Treat as rumor until confirmed", description: "Source humility." },
      { id: "C", label: "Ignore all future news forever", description: "Overreaction." },
    ],
    explanation:
      "SAMPLE: rumor ≠ filing. Raise confidence only when a disclosure or reputable primary source confirms.",
    glossaryTermId: "rumor-vs-filing",
  },
  {
    id: "NL-02",
    prompt: "Everyone expected a rate hold and the headline matches. The first spike often…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Fades if it was already priced in", description: "Expectations matter." },
      { id: "B", label: "Guarantees a trend day", description: "Nothing is guaranteed." },
      { id: "C", label: "Means filings are fake", description: "Non sequitur." },
    ],
    explanation: "If widely expected, much of the move may already be in the tape (priced in).",
    glossaryTermId: "priced-in",
  },
  {
    id: "NL-03",
    prompt: "Chase vs fade — which statement is most accurate?",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Always chase breakouts", description: "Blind rule." },
      { id: "B", label: "Always fade every spike", description: "Blind rule." },
      {
        id: "C",
        label: "Choose using evidence quality + horizon",
        description: "Process match.",
      },
    ],
    explanation: "Neither chase nor fade is always right — match to evidence and your time horizon.",
    glossaryTermId: "chase-vs-fade",
  },
  {
    id: "NL-04",
    prompt: "Source humility means…",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Weight claims by how primary/verifiable the source is",
        description: "Process.",
      },
      { id: "B", label: "Trust the loudest account", description: "Noise bias." },
      { id: "C", label: "Never read headlines", description: "Avoidance, not skill." },
    ],
    explanation: "Primary filings and official releases outrank anonymous chatter for decision confidence.",
    glossaryTermId: "rumor-vs-filing",
  },
  {
    id: "NL-05",
    prompt: "A stock gaps up on a rumor then asks for a decision. Process-first choice?",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Market buy, no plan", description: "FOMO." },
      {
        id: "B",
        label: "Ask what is new vs already priced; size for being wrong",
        description: "Process.",
      },
      { id: "C", label: "Short 10x because gaps always fail", description: "Dogma." },
    ],
    explanation: "Separate novelty from priced-in expectations; size risk to uncertainty.",
    glossaryTermId: "priced-in",
  },
  {
    id: "NL-06",
    prompt: "Company-news cases in this app hide the aftermath until you decide. Why?",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Anti-hindsight: practice deciding with only the brief", description: "Skill." },
      { id: "B", label: "To simulate LIVE brokerage fills", description: "Out of scope." },
      { id: "C", label: "Because SAMPLE data is random noise", description: "Still structured teaching." },
    ],
    explanation: "Anti-hindsight forces process under incomplete information — SAMPLE teaching design.",
    glossaryTermId: "chase-vs-fade",
  },
];

export const FINANCIAL_DRILLS_QUESTIONS: QuizQuestion[] = [
  {
    id: "FD-01",
    prompt: "On the SAMPLE card, strong net income with weak operating cash most invites…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "Ignore cash forever", description: "Dangerous." },
      { id: "B", label: "Questions about accruals / working capital", description: "Process." },
      { id: "C", label: "Automatic buy", description: "No process." },
    ],
    explanation: "Cash vs profit divergence is a cue to investigate, not a slogan trade.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FD-02",
    prompt: "Net margin falling while revenue rises can mean…",
    correctAnswer: "A",
    options: [
      { id: "A", label: "Costs or mix are eating profitability", description: "Margin compression cue." },
      { id: "B", label: "Assets disappeared", description: "Wrong statement." },
      { id: "C", label: "P/E is cash", description: "Category error." },
    ],
    explanation: "Margin = profit / revenue. Rising sales with falling margin = watch costs/mix.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FD-03",
    prompt: "High liabilities vs equity on a SAMPLE cyclical card is a cue about…",
    correctAnswer: "C",
    options: [
      { id: "A", label: "Guaranteed bankruptcy tomorrow", description: "Jumping." },
      { id: "B", label: "Marketing spend only", description: "Too narrow." },
      { id: "C", label: "Leverage / cushion under stress", description: "Balance-sheet process." },
    ],
    explanation: "Leverage amplifies outcomes. Ask if the cushion fits your horizon.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FD-04",
    prompt: "Free cash flow on the card approximates cash after…",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Operating needs and sustaining reinvestment",
        description: "Flexibility cue.",
      },
      { id: "B", label: "Only interest expense", description: "Incomplete." },
      { id: "C", label: "Share count changes", description: "Equity structure." },
    ],
    explanation: "FCF is a flexibility/sustainability cue in SAMPLE teaching — not a price target.",
    snapshotId: "snap-cyclical",
  },
  {
    id: "FD-05",
    prompt: "Simple P/E rising solely because earnings fell (price flat) means…",
    correctAnswer: "B",
    options: [
      { id: "A", label: "The company printed cash", description: "Unrelated." },
      { id: "B", label: "You are paying more per unit of earnings", description: "Multiple math." },
      { id: "C", label: "Liabilities vanished", description: "Wrong statement." },
    ],
    explanation: "P/E = price / earnings. Lower earnings → higher P/E if price unchanged.",
    snapshotId: "snap-mega-tech",
  },
  {
    id: "FD-06",
    prompt: "Before an earnings case, reading the snapshot helps you…",
    correctAnswer: "A",
    options: [
      {
        id: "A",
        label: "Form a thesis from numbers, then decide on the print",
        description: "Process.",
      },
      { id: "B", label: "Skip the chart soft-gate forever", description: "Gates still apply." },
      { id: "C", label: "Pull LIVE filings automatically", description: "SAMPLE only." },
    ],
    explanation: "Statements literacy feeds decide-and-reveal — still SAMPLE snapshots, not LIVE EDGAR.",
    snapshotId: "snap-cyclical",
  },
];

export type QuizGroupId =
  | "all"
  | "hammer"
  | "doji"
  | "engulfing"
  | "bullish-engulfing"
  | "bearish-engulfing"
  | "shooting-star"
  | "inverted-hammer"
  | "morning-star"
  | "indicators"
  | "equity-patterns"
  | "equity-literacy"
  | "financial-literacy"
  | "news-literacy"
  | "financial-drills";

export interface QuizGroup {
  id: QuizGroupId;
  name: string;
  description: string;
  icon?: string;
}

export const QUIZ_GROUPS: QuizGroup[] = [
  {
    id: "equity-literacy",
    name: "Equities Literacy",
    description: "Stocks, exchanges, long/short, risk & horizon (SAMPLE beginner path)",
    icon: "account_balance",
  },
  {
    id: "financial-literacy",
    name: "Statements Literacy",
    description: "Revenue, profit vs cash, balance sheet basics, P/E & margin (SAMPLE snapshots)",
    icon: "table_chart",
  },
  {
    id: "news-literacy",
    name: "News Literacy",
    description: "Rumor vs filing, priced-in, chase vs fade, source humility (SAMPLE)",
    icon: "newspaper",
  },
  {
    id: "financial-drills",
    name: "Statements Drills",
    description: "Extra SAMPLE snapshot practice — cash vs profit, margin, leverage cues",
    icon: "finance_mode",
  },
  { id: "indicators", name: "Indicators", description: "Identify SMA, EMA, RSI, MACD, Bollinger Bands", icon: "show_chart" },
  {
    id: "equity-patterns",
    name: "Equity Pack Drills",
    description: "Candle/indicator drills tagged to E1 equity SAMPLE packs (post-P0)",
    icon: "candlestick_chart",
  },
  { id: "all", name: "All Patterns", description: "Mix of all candlestick patterns", icon: "shuffle" },
  { id: "hammer", name: "Hammer Family", description: "Long lower shadow, small body at top—bullish reversal", icon: "vertical_align_bottom" },
  { id: "doji", name: "Doji Family", description: "Open ≈ close, long wicks—indecision", icon: "trending_flat" },
  { id: "engulfing", name: "Engulfing Family", description: "Body engulfs previous candle—momentum shift", icon: "compare_arrows" },
  { id: "bullish-engulfing", name: "Bullish Engulfing", description: "Green body engulfs prior red", icon: "trending_up" },
  { id: "bearish-engulfing", name: "Bearish Engulfing", description: "Red body engulfs prior green", icon: "trending_down" },
  { id: "shooting-star", name: "Shooting Star", description: "Long upper shadow, top reversal", icon: "vertical_align_top" },
  { id: "inverted-hammer", name: "Inverted Hammer", description: "Long upper shadow, bottom reversal", icon: "vertical_align_bottom" },
  { id: "morning-star", name: "Morning Star", description: "Three-candle bullish reversal", icon: "nightlight" },
];

function questionsArrayForGroup(groupId: QuizGroupId): QuizQuestion[] {
  if (groupId === "indicators") return INDICATOR_QUIZ_QUESTIONS;
  if (groupId === "equity-patterns") return EQUITY_PATTERN_QUIZ_QUESTIONS;
  if (groupId === "equity-literacy") return EQUITY_LITERACY_QUESTIONS;
  if (groupId === "financial-literacy") return FINANCIAL_LITERACY_QUESTIONS;
  if (groupId === "news-literacy") return NEWS_LITERACY_QUESTIONS;
  if (groupId === "financial-drills") return FINANCIAL_DRILLS_QUESTIONS;
  return QUIZ_QUESTIONS;
}

export function getQuestionsForGroup(groupId: QuizGroupId): QuizQuestion[] {
  if (groupId === "indicators") return INDICATOR_QUIZ_QUESTIONS;
  if (groupId === "equity-patterns") return EQUITY_PATTERN_QUIZ_QUESTIONS;
  if (groupId === "equity-literacy") return EQUITY_LITERACY_QUESTIONS;
  if (groupId === "financial-literacy") return FINANCIAL_LITERACY_QUESTIONS;
  if (groupId === "news-literacy") return NEWS_LITERACY_QUESTIONS;
  if (groupId === "financial-drills") return FINANCIAL_DRILLS_QUESTIONS;
  if (groupId === "all") return QUIZ_QUESTIONS;
  return QUIZ_QUESTIONS.filter((q) => q.patternKey === groupId);
}

/** Planner helper: filter questions by asset class tag. */
export function getQuestionsByAssetClass(assetClass: AssetClass): QuizQuestion[] {
  return [
    ...INDICATOR_QUIZ_QUESTIONS,
    ...EQUITY_PATTERN_QUIZ_QUESTIONS,
    ...QUIZ_QUESTIONS,
  ].filter((q) => q.assetClass === assetClass);
}

export function getQuestionIndexInGroup(globalIndex: number, groupId: QuizGroupId): number {
  if (groupId === "all") return globalIndex;
  const groupQuestions = getQuestionsForGroup(groupId);
  const q = questionsArrayForGroup(groupId)[globalIndex];
  return groupQuestions.findIndex((gq) => gq.id === q?.id);
}

export function getGlobalIndexFromGroup(groupIndex: number, groupId: QuizGroupId): number {
  if (groupId === "all") return groupIndex;
  const groupQuestions = getQuestionsForGroup(groupId);
  const q = groupQuestions[groupIndex];
  return questionsArrayForGroup(groupId).findIndex((gq) => gq.id === q?.id);
}
