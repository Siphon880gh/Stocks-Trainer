/**
 * Public sources behind the oscillator, volatility-stop, float and short-dated options content. Every URL was
 * fetched on 2026-10-22 and checked to support the line it is cited for; keep a link only while that stays true.
 */
export interface OscSource {
  id: string;
  title: string;
  url: string;
  supports: string;
}

export const OSC_SOURCES: OscSource[] = [
  {
    id: "investopedia-rsi",
    title: "Investopedia: Relative Strength Index (RSI)",
    url: "https://www.investopedia.com/terms/r/rsi.asp",
    supports: "RSI above 70 reads overbought, below 30 oversold; with strong momentum it can stay overbought or oversold for a long time.",
  },
  {
    id: "investopedia-macd",
    title: "Investopedia: MACD",
    url: "https://www.investopedia.com/terms/m/macd.asp",
    supports: "A MACD cross above the signal line is read as bullish, below as bearish; MACD and RSI are often used together and can disagree.",
  },
  {
    id: "investopedia-stochastic",
    title: "Investopedia: Stochastic Oscillator",
    url: "https://www.investopedia.com/terms/s/stochasticoscillator.asp",
    supports: "%K formula, %D = 3-period average of %K, 80 / 20 levels, strong trends can stay overbought, and false signals.",
  },
  {
    id: "stockcharts-stochastic",
    title: "StockCharts ChartSchool: Stochastic Oscillator (Fast, Slow, and Full)",
    url: "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/stochastic-oscillator-fast-slow-and-full",
    supports: "Fast vs slow stochastic: slow %K is fast %K smoothed with a 3-period SMA, equal to fast %D.",
  },
  {
    id: "moomoo-kdj",
    title: "Moomoo Help Center: KDJ",
    url: "https://www.moomoo.com/us/support/topic3_142",
    supports: "RSV over n days (usually 9); K = 2/3 previous K + 1/3 RSV; D = 2/3 previous D + 1/3 K; J = 3K − 2D.",
  },
  {
    id: "capital-kdj",
    title: "Capital.com: KDJ indicator",
    url: "https://capital.com/en-int/learn/technical-analysis/kdj-indicator",
    supports: "K and D start at 50; J amplifies the K − D gap and can leave 0–100; more reactivity means more false signals.",
  },
  {
    id: "stockcharts-atr",
    title: "StockCharts ChartSchool: Average True Range (ATR)",
    url: "https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/average-true-range-atr-and-average-true-range-percent-atrp",
    supports: "True range includes gaps from the previous close; the standard ATR smoothing; ATR measures volatility, not direction.",
  },
  {
    id: "tradingview-vstop",
    title: "TradingView: Volatility Stop indicator",
    url: "https://www.tradingview.com/script/v9YZoIw1-Volatility-Stop/",
    supports: "An ATR-based trend detector usable as a stop that does not move against the trend; defaults length 20, ATR factor 2.",
  },
  {
    id: "tradingview-vstop-help",
    title: "TradingView Help Center: Volatility Stop",
    url: "https://www.tradingview.com/support/solutions/43000594676-volatility-stop/",
    supports: "Stop distance = volatility measure × safety multiple from a price anchor such as the close; past volatility may not hold.",
  },
  {
    id: "investopedia-float",
    title: "Investopedia: Floating Stock",
    url: "https://www.investopedia.com/terms/f/floating-stock.asp",
    supports: "Float is the shares available to trade; a small float tends to be more volatile.",
  },
  {
    id: "trade-ideas-float-turnover",
    title: "Trade Ideas: Float Turnover",
    url: "https://www.trade-ideas.com/help/filter/FloatTurn/",
    supports: "Float turnover = the period's trading volume ÷ the float; high turnover means heavy trading activity.",
  },
  {
    id: "finra-0dte",
    title: "FINRA: Zeroing In on an Options Trading Strategy: 0DTE",
    url: "https://www.finra.org/investors/insights/zeroing-in-options-trading-strategy",
    supports: "Expiration-day options are very sensitive to the underlying's price; a buyer can lose the entire premium.",
  },
  {
    id: "investopedia-theta",
    title: "Investopedia: Theta",
    url: "https://www.investopedia.com/terms/t/theta.asp",
    supports: "Theta is time decay; it accelerates as expiration approaches.",
  },
];

export const getOscSource = (id: string) => OSC_SOURCES.find((s) => s.id === id);
