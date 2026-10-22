import { ADVANCED_TERMS } from "./advancedPatterns";
import { CHART_BOOK_TERMS } from "./chartPatternBook";
import { FINANCIAL_TERMS } from "./financials/terms";
import { MACRO_TERMS } from "./macro/glossary";
import { ACADEMY_TERMS } from "./academy/terms";
import { OSCILLATOR_TERMS } from "./oscillatorTerms";
import { CANDLE_TERMS } from "./candleTerms";
import { SQZ_TERMS } from "./gammaSqueeze";
import { NEWS_BIAS_TERMS } from "./newsBiases";
import { ALGO_TERMS } from "./algoTrading";
import { CHART_APP_TERMS } from "./chartingApps";
import { PDT_TERMS } from "./pdtRule";
import { CRYPTO_TERMS } from "./cryptoCandles";
import { REVERSAL_TERMS } from "./reversalCharts";
import { ONE_MIN_TERMS } from "./oneMinuteCharts";
import { FIB_MAP_TERMS } from "./fibDecisionMap";
import { FUT_OPT_TERMS } from "./futuresOptionsBasics";
import { NARRATIVE_TERMS } from "./techniqueNarratives";
import { MW_TERMS } from "./missingWicks";

/** Beginner equities glossary terms for Archive + quiz deep-links (E4.M1.S4). */

export interface LiteracyTerm {
  id: string;
  name: string;
  category: "ownership" | "markets" | "position" | "process";
  summary: string;
  detail: string;
}

export const LITERACY_TERMS: LiteracyTerm[] = [
  {
    id: "stock-share",
    name: "Stock / Share",
    category: "ownership",
    summary: "A unit of ownership in a company.",
    detail:
      "Shares represent equity in a business—claims on residual value after debts. SAMPLE educational definition, not investment advice.",
  },
  {
    id: "exchange",
    name: "Exchange",
    category: "markets",
    summary: "A venue that helps match buyers and sellers with public prices.",
    detail:
      "Listed equities trade on exchanges (and related market systems) that support price discovery and liquidity. Not a profit guarantee.",
  },
  {
    id: "long-vs-short",
    name: "Long vs Short",
    category: "position",
    summary: "Long benefits if value rises; short bets on a decline.",
    detail:
      "Long = own (or intend to own) with upside if price/value rises. Short = borrow/sell hoping to repurchase cheaper. Shorting has asymmetric loss risk. Sell exits a long you already have; short is a new downside bet. Practice that split on Cases → company news (Short vs sell).",
  },
  {
    id: "investing-vs-trading",
    name: "Investing vs Trading",
    category: "process",
    summary: "Different typical horizons and decision cadences.",
    detail:
      "Investing usually emphasizes longer multi-month/year theses. Trading emphasizes shorter moves. Match tools and risk to your horizon.",
  },
  {
    id: "risk-horizon",
    name: "Risk & Horizon",
    category: "process",
    summary: "Expected return and uncertainty travel together; time frame shapes decisions.",
    detail:
      "Higher expected returns generally require accepting more uncertainty. Your time horizon filters which moves are noise vs signal. Hold often fits when thesis + horizon still hold.",
  },
  {
    id: "options-context",
    name: "Options context (SAMPLE)",
    category: "markets",
    summary: "Educational underlying charts for options ideas — not a live options chain.",
    detail:
      "In this trainer, Options context means SAMPLE charts of an underlying around events or volatility. It is not a LIVE options chain, not order routing, and not a Greeks/pricing engine. Traditional retail stocks remain Equities.",
  },
  {
    id: "options-event-vol",
    name: "Event risk and vol on the stock (SAMPLE)",
    category: "markets",
    summary: "Coil, spike, or settle around a known event is a stock-tape story — still no chain or Greeks.",
    detail:
      "A SAMPLE event window can shrink range, then expand. Grade the underlying with BUY/SELL/HOLD. Inventing a straddle, implied vol, or delta skips the product rule. Educational only.",
  },
  {
    id: "options-failed-break",
    name: "Failed breakout on the underlying (SAMPLE)",
    category: "process",
    summary: "A poke through a level that fails is a stock story — HOLD can be correct; still no calls.",
    detail:
      "On SAMPLE options-context tapes, price can push through a watched level and close back. Ask whether the event move already failed. Do not invent a call overlay or gamma hedge. Educational only.",
  },
  {
    id: "options-hold-event",
    name: "HOLD into a known event (SAMPLE)",
    category: "process",
    summary: "A scheduled event does not force a fill — HOLD is allowed, and there are still no calls.",
    detail:
      "On SAMPLE options-context tapes, a known event tomorrow with no edge on the stock is a wait. Chatter that you must be in is not a listing print and not a 10-Q overnight. This is not a coil/spike tape-shape drill and not a failed-break poke. Educational only — no chain, no Greeks.",
  },
  {
    id: "futures-market",
    name: "Futures (SAMPLE)",
    category: "markets",
    summary: "Contracts on an underlying (index, commodity, etc.) — SAMPLE browse class here.",
    detail:
      "Futures are agreements to buy/sell an underlying later at a set price. This app shows STYLIZED SAMPLE futures tapes for chart practice—not LIVE contracts or order routing. The traditional retail stocks path stays Equities.",
  },
  {
    id: "futures-roll",
    name: "Roll, contango, backwardation (SAMPLE)",
    category: "markets",
    summary: "Contracts expire; front vs next month is a structure to name, not a trade button.",
    detail:
      "Roll means the front month ends and attention moves to the next. Contango: front richer than next. Backwardation: front cheaper than next. SAMPLE teaching — this app has no live roll calendar or calculator.",
  },
  {
    id: "futures-underlying",
    name: "Index vs commodity futures (SAMPLE)",
    category: "markets",
    summary: "The contract points at an index, energy, metal, or ag — so the tape shape is not one clone.",
    detail:
      "An index-style grind is not an energy dump-reclaim and not a weather/ag coil. Name which underlying the SAMPLE pack is teaching. This app is not a live contract, pit, or weather desk.",
  },
  {
    id: "futures-harvest",
    name: "Weather and harvest supply (SAMPLE)",
    category: "markets",
    summary: "A drought or harvest print is a supply fact on this grain contract — not a 10-Q and not a roll button.",
    detail:
      "Map weather to crop supply on this SAMPLE future, then ask if the first jump already priced the scare. A later harvest that is larger than the scare implied means re-decide. HOLD is allowed. This is not contango-as-sell, not an index-vs-energy label, and not a company filing. Educational only — not a live weather desk.",
  },
  {
    id: "crypto-browse",
    name: "Crypto browse (SAMPLE)",
    category: "markets",
    summary: "Digital-asset SAMPLE charts for candle/indicator drills — not the Beginner stocks path.",
    detail:
      "Crypto Class is SAMPLE browse/drill only. It does not replace Beginner Equities Path (stocks). Feeds are SAMPLE or DELAYED labels—never LIVE/REAL_TIME theater.",
  },
  {
    id: "crypto-depeg-scare",
    name: "Stable depeg scare (SAMPLE)",
    category: "markets",
    summary: "Chat that a peg broke is a source drill — not a live redemption or exchange.",
    detail:
      "A SAMPLE stable wobble is rumor until a named issuer or official note confirms it. Do not treat this app as a CEX, and do not assume every dump is a depeg. Educational only.",
  },
  {
    id: "crypto-weekend",
    name: "Weekend hours (SAMPLE crypto)",
    category: "markets",
    summary: "Crypto can print when stock markets are closed — hours are not a must-trade.",
    detail:
      "A SAMPLE weekend gap is still chase-versus-wait. A thin book can move on chatter with no protocol change. HOLD is valid. This app is not a live exchange or a 24/7 desk.",
  },
  {
    id: "crypto-listing",
    name: "Listing chat vs official note (SAMPLE)",
    category: "markets",
    summary: "Venue-listing chatter is rumor until a scheduled exchange note — chat is not a listing.",
    detail:
      "On SAMPLE crypto tapes, a run on listing chat can already have the rumor in. Separate that volume from an official no-listing (or listing) note, then re-decide. HOLD is allowed. This is not a depeg-peg drill, not weekend-hours, and not a 10-Q. Educational only — not a live listing desk.",
  },
  {
    id: "forex-spot",
    name: "Forex / FX (SAMPLE)",
    category: "markets",
    summary: "Currency pairs (spot FX) as a SAMPLE Market class after equities fluency.",
    detail:
      "Forex is trading one currency against another. Here it is SAMPLE spot FX for chart literacy. Traditional retail stocks = Equities. Not a LIVE FX feed or broker.",
  },
  {
    id: "forex-pip",
    name: "Pip and spread (SAMPLE FX)",
    category: "markets",
    summary: "A pip is a tiny FX price step; the spread is a cost of trading the pair.",
    detail:
      "On SAMPLE FX tapes, a noisy print plus a wide spread is a HOLD cue — waiting is valid. This app is not a live FX desk and does not quote real bank spreads. Educational only.",
  },
  {
    id: "forex-major-cross",
    name: "Majors vs crosses (SAMPLE FX)",
    category: "markets",
    summary: "A major usually includes the dollar; a cross is two non-dollar currencies.",
    detail:
      "SAMPLE packs use majors and crosses so tapes are not clones: EUR/USD drift is not USD/JPY dump is not EUR/JPY. This is chart literacy, not a live FX desk or a ranking of which pair to trade.",
  },
  {
    id: "forex-risk-on",
    name: "Risk-on vs risk-off (SAMPLE FX)",
    category: "markets",
    summary: "Risk mood maps to a pair — commodity FX often bids on risk-on; funding FX often bids on risk-off.",
    detail:
      "Name which side of this SAMPLE pair the mood hits, then ask if the first tick already priced it. HOLD is allowed. This is not a pip-spread cost drill, not a major-versus-cross label, and not a 10-Q. Educational only — not a live FX desk.",
  },
  {
    id: "equities-traditional-retail",
    name: "Equities = traditional retail stocks",
    category: "markets",
    summary: "Listed shares / the stock market — the primary learning path in this app.",
    detail:
      "When retail learners say the traditional market they trade daily, they usually mean stocks. In this trainer that market type is Equities. Futures, options-context, crypto, and forex are SAMPLE expansion classes.",
  },
  {
    id: "rumor-vs-filing",
    name: "Rumor vs Filing",
    category: "process",
    summary: "Social chatter is not the same as a disclosed filing or official release.",
    detail:
      "SAMPLE teaching: treat rumors as low-confidence noise until confirmed by a filing, exchange notice, or company release. Process = source → confidence → decide.",
  },
  {
    id: "priced-in",
    name: "Priced In",
    category: "process",
    summary: "Markets may already reflect widely expected news before the headline hits.",
    detail:
      "If everyone expected the print, the first move after the headline can fade. SAMPLE training asks: what was already known vs what is new?",
  },
  {
    id: "ohlc-anatomy",
    name: "OHLC (Open High Low Close)",
    category: "markets",
    summary: "Four prices that draw one candlestick: open, high, low, close.",
    detail:
      "High is the tip of the upper wick. Low is the tip of the lower wick. The body runs from open to close: on a green candle the top of the body is close; on a red candle the top of the body is open. SAMPLE teaching — not a live quote.",
  },
  {
    id: "candle-color",
    name: "Green vs Red candles",
    category: "markets",
    summary: "Green = close above open; red = close below open.",
    detail:
      "Color encodes the period’s direction, not volume or certainty. SAMPLE charts paint green when close > open and red when close < open. Older and printed charts often use a hollow (white) body for up periods and a filled (black) body for down periods; the rule is the same.",
  },
  {
    id: "wick-rejection",
    name: "Price rejected (long wick)",
    category: "markets",
    summary: "A long wick with a small body at the other end: price went there and got pushed back.",
    detail:
      "Long upper wick, body near the low: buyers pushed up, sellers drove it back down (shooting-star style, a potential bearish reversal after a rally). Long lower wick, body near the high: sellers pushed down, buyers drove it back up (hammer style, a potential bullish reversal after a decline). Body color matters less than where the wick and body sit. The wick tells a story: price traveled there during the period, found the other side waiting, and was pushed back before the close. It is only a potential reversal: check where it formed and wait for the next candle to confirm. SAMPLE teaching, not a trade signal.",
  },
  {
    id: "full-body-candle",
    name: "Price stability (full body, tiny wicks)",
    category: "markets",
    summary: "Open and close sit near the extremes: price moved steadily one way with little pushback.",
    detail:
      "Tiny wicks mean the high and low are close to the open and close, so neither side fought back much during the period. Green = buyers in steady control; red = sellers in steady control. A run of similar-sized full bodies reads as an orderly trend. What separates this from a strong movement candle is size compared with recent candles. SAMPLE teaching.",
  },
  {
    id: "indecision-candle",
    name: "Indecision (small body, wicks both sides)",
    category: "markets",
    summary: "Price moved both ways but closed near where it opened. Neither side won the period.",
    detail:
      "Spinning tops and doji-like candles have a small body with wicks above and below. A tiny green or red body barely changes the read: the close was near the open. After a strong run it can be an early warning that momentum is fading. Inside a range it is often just noise. Wait for the next candles to show which side takes over. SAMPLE teaching.",
  },
  {
    id: "strong-move-candle",
    name: "Strong movement (bulls win / bears win)",
    category: "markets",
    summary: "A tall body with small wicks that is much bigger than recent candles: one side controlled the whole period.",
    detail:
      "Bulls win: open near the low, close near the high (tall green body). Bears win: open near the high, close near the low (tall red body). Marubozu-style candles show conviction for that period. They do not guarantee the next candle goes the same way, and price often pauses or pulls back after a big expansion. SAMPLE teaching.",
  },
  {
    id: "candlestick-origins",
    name: "Japanese candlesticks (origin)",
    category: "markets",
    summary: "Candle charts come from Japanese rice trading and focus on what traders did inside each period.",
    detail:
      "Popular history credits Munehisa Homma, an 18th-century rice merchant, with noticing that rice prices reflected traders' emotions as well as supply and demand. The chart style itself was refined later and reached Western traders in the late 20th century. The lesson that carries over: each candle summarizes a fight between buyers and sellers. SAMPLE teaching.",
  },
  {
    id: "prior-trend-context",
    name: "Prior trend (reversal context)",
    category: "process",
    summary: "A reversal pattern needs a trend to reverse: bullish reversals after declines, bearish reversals after rallies.",
    detail:
      "The same shape can mean different things in different places. A small body with a long lower wick is a hammer after a decline and a hanging man after a rally. With no clear prior trend, most reversal patterns are just noise. SAMPLE teaching.",
  },
  {
    id: "pattern-confirmation",
    name: "Confirmation & invalidation",
    category: "process",
    summary: "Wait for the next candle to agree, and know the price that would prove the read wrong.",
    detail:
      "Single and two-candle patterns are setups, not signals. A common rule is to wait for the next candle to close in the pattern's direction (three-candle patterns like Three Inside Up build that step in). Invalidation usually sits just past the pattern's extreme: below a hammer's low, above a shooting star's high. This trainer has no order ticket; this is process practice, not advice.",
  },
  {
    id: "reversal-vs-continuation",
    name: "Reversal vs continuation patterns",
    category: "process",
    summary: "Reversal patterns suggest a trend may turn; continuation patterns suggest a pause before the trend resumes.",
    detail:
      "Reversal examples: hammer, engulfing, morning/evening star, harami, three inside/outside, counterattack. Continuation examples: rising/falling three methods, mat hold, tasuki gaps, on-neck. Doji and spinning tops are indecision; what they mean depends on where they appear. Labels describe tendencies, not outcomes. SAMPLE teaching.",
  },
  {
    id: "pattern-tolerance",
    name: "Textbook vs real-world patterns",
    category: "process",
    summary: "Real charts rarely match the textbook exactly; judge the story, not a perfect shape.",
    detail:
      "Minor differences are normal (a tiny wick on a marubozu, a near-equal low on a tweezer). Ask whether the pattern's story still holds: who took control, and where. The flip side: do not stretch a definition until you see the pattern you hoped for. SAMPLE teaching.",
  },
  {
    id: "long-vs-short-candle",
    name: "Long vs short candles",
    category: "markets",
    summary: "Compare a body with the bodies just before it: much taller is long, much smaller is short.",
    detail:
      "A long green says buyers moved price a long way in one period; a long red says sellers did. A short body (green or red) says little happened and neither side pushed hard. 'Long' is always relative to recent candles on the same chart, never a fixed size. SAMPLE teaching, not a signal by itself.",
  },
  {
    id: "marubozu-types",
    name: "Marubozu types (full, opening, closing)",
    category: "markets",
    summary: "Marubozu = a long body with no wick on one or both ends.",
    detail:
      "Full marubozu: no wicks at all (white/green or black/red). Closing marubozu: no wick on the closing end, so it closed at the extreme (bullish closes at the high, bearish at the low): the winning side still held control at the close. Opening marubozu: no wick on the opening end (bullish opens at the low, bearish at the high), with a wick at the close: strong start, some give-back. Closing versions are usually read as a little stronger. Context still decides.",
  },
  {
    id: "doji-types",
    name: "Doji types",
    category: "markets",
    summary: "Open ≈ close. The wick layout tells you which kind.",
    detail:
      "Standard doji: small wicks, balanced. Long-legged doji: long wicks both ways, big swings and no winner. Dragonfly: open, high and close at the top with a long lower wick (buyers defended lower levels). Gravestone: open, low and close at the bottom with a long upper wick (sellers defended upper levels). Cross doji has a longer lower wick; inverted cross has a longer upper wick (naming varies between books). Every doji is indecision until the next candle and the prior trend give it meaning.",
  },
  {
    id: "dragonfly-gravestone",
    name: "Dragonfly vs gravestone doji",
    category: "markets",
    summary: "Dragonfly (T): buyers defended lows. Gravestone (⊥): sellers defended highs.",
    detail:
      "Dragonfly doji: sellers pushed price far down during the period, buyers pushed it all the way back to the open/high. After a decline that is a possible bottom. Gravestone doji: buyers pushed far up, sellers pushed it all the way back to the open/low. After a rally that is a possible top. Both need the next candle to confirm, and both mean little in the middle of a range.",
  },
  {
    id: "gap-reversal",
    name: "Gap reversals (kicker, abandoned baby)",
    category: "markets",
    summary: "A gap that flips direction shows sentiment changed between sessions.",
    detail:
      "Kicker: the second candle gaps past the first candle's open in the opposite direction and runs. Abandoned baby: a doji gaps away from the trend, then the next candle gaps back the other way, leaving the doji alone on an 'island'. Both are rare and strong. The invalidation is simple: if the gap fills, the story is wrong. In 24/7 markets like crypto true gaps are rare, so these show up mostly in stocks.",
  },
  {
    id: "three-line-strike",
    name: "Three-line strike (why it is tricky)",
    category: "markets",
    summary: "Three candles one way, then one big candle that wipes them all out.",
    detail:
      "Bullish three-line strike: three rising greens, then a long red that closes below the first green's open. Bearish: three falling reds, then a long green that closes above the first red's open. Classic books call these continuation patterns (the strike is 'profit taking'), but in practice the fourth candle often starts a reversal. Honest read: the direction is unclear; wait for the next candles to pick a side.",
  },
  {
    id: "meeting-lines",
    name: "Meeting lines (= counterattack lines)",
    category: "markets",
    summary: "Two opposite-colored candles that close at about the same price.",
    detail:
      "Meeting lines is another name for counterattack lines. Bullish: a long red, then a long green that opens far lower and closes back at the red's close. Bearish: a long green, then a long red that opens far higher and closes back at the green's close. Weaker than piercing line or dark cloud cover because the second candle only gets back to the prior close; wait for confirmation.",
  },
  {
    id: "neck-patterns",
    name: "On-neck, in-neck, thrusting",
    category: "markets",
    summary: "How far a green bounce gets into a long red body after a gap down.",
    detail:
      "All three: downtrend, long red, then a green that opens below the red's low. On-neck: green closes near the red's low. In-neck: green closes just barely inside the red body. Thrusting: green closes well into the red body but below its midpoint. Past the midpoint it becomes a piercing line (bullish). The first three are weak bounces that usually let the downtrend continue.",
  },
  {
    id: "gap-continuation",
    name: "Gap continuation patterns",
    category: "markets",
    summary: "Separating lines, side-by-side lines, tasuki gaps, gap three methods.",
    detail:
      "Separating lines: a counter-trend candle, then a trend candle that opens at the same price and runs away. Side-by-side white lines: two similar green candles that gap away from the prior candle. Tasuki gap: a counter candle that closes inside a gap without filling it. Gap three methods: a counter candle that fully fills the gap. In each case the trend resumes only if the next candles agree.",
  },
  {
    id: "market-structure",
    name: "Market structure (HH, HL, LH, LL)",
    category: "process",
    summary: "Uptrend = higher highs and higher lows. Downtrend = lower highs and lower lows.",
    detail:
      "Label each swing: HH (higher high), HL (higher low), LH (lower high), LL (lower low). HH + HL = uptrend; LH + LL = downtrend. When highs and lows stay inside a band with no progress, the market is ranging. A candle pattern means most at the edge of structure (a reversal pattern at a HL in an uptrend or at the top of a range), and least in the middle of a range.",
  },
  {
    id: "breakout-retest",
    name: "Breakout and retest",
    category: "process",
    summary: "Price closes through a level, comes back to test it from the other side, and holds.",
    detail:
      "Breakout: a close beyond support or resistance (a wick through is not enough). Retest: price returns to that level; old resistance should now act as support (or old support as resistance). A retest that holds with a confirming candle is a common entry area. A retest that closes back through the level is a failed breakout. Retests do not always happen, and holding is never guaranteed.",
  },
  {
    id: "risk-reward",
    name: "Entry, stop loss, target and R:R",
    category: "process",
    summary: "Know where you are wrong before you know where you are right.",
    detail:
      "Entry: where the idea starts (often after the confirmation candle). Stop loss: the price that proves the idea wrong (beyond the pattern's extreme, the retest wick, or the zone). Target: a realistic area such as the next level. Risk:reward compares the distance to target with the distance to stop; 1:2 means aiming for twice what you risk. A good R:R does not make a trade likely to win; it only means one winner can pay for more than one loser. SAMPLE process, not advice.",
  },
  {
    id: "no-trade-zone",
    name: "Uncertainty: the no-trade zone",
    category: "process",
    summary: "Choppy price with no edge nearby is a reason to wait, not a reason to guess.",
    detail:
      "When price chops sideways, overlaps candle to candle and sits far from support or resistance, there is no defined place to be wrong and no clear target, so any entry is an opinion. Waiting is a valid decision. The picture changes when price reaches an edge or gives a clear signal: a close through the range, a held retest, or a confirmed reversal at a level. SAMPLE process, not advice.",
  },
  {
    id: "entry-types",
    name: "Entry types: breakout, pullback, reversal",
    category: "process",
    summary: "Enter from a defined edge, not an opinion.",
    detail:
      "Breakout: price closes through a level it failed at before (often bought on the retest). Pullback: in an uptrend (higher highs and higher lows), price dips to a higher low, a rising trendline or an old swing high and a candle confirms the bounce. Reversal: a confirmed pattern at a level (double bottom, inverse head and shoulders, hammer plus confirmation at support). Each one gives an edge: a price where the idea is clearly wrong, so the stop has an obvious home. \"It looks cheap\" or \"it has to go up\" are opinions with no such price. SAMPLE process, not advice.",
  },
  {
    id: "trailing-stop",
    name: "Trailing stop",
    category: "process",
    summary: "Raise the exit as price trends higher (never lower it) to protect open profit.",
    detail:
      "Start with the stop at invalidation (for example back under the broken level). Each time the trend prints a new higher low and moves away from it, raise the stop to just under that low, so it climbs in steps under price. Some traders trail under a moving average, a fixed distance, or a volatility stop (the best close minus ATR × a multiplier) instead. A long's trailing stop only moves up; moving it down turns a small loss into a big one. A trailed stop gives back some profit when it is hit, and that is the cost of staying in the trend. SAMPLE process, not advice.",
  },
  {
    id: "taking-profit",
    name: "Profit target and taking profit",
    category: "process",
    summary: "Plan the reward before entry; take gains when what is left no longer justifies the risk.",
    detail:
      "Before entering, find a realistic target (the next resistance, an old high, a measured move) and check that the reward is worth the risk, for example at least 2:1. If the next level is barely further than your stop, skip the trade or wait for a better entry. During the trade, compare the reward left (target minus price) with the risk left (price minus the current stop). When price is at the target and the reward left is smaller than the risk to the stop, taking profit or tightening the stop is the plan; hoping for more is not. SAMPLE process, not advice.",
  },
  {
    id: "trendline",
    name: "Trendline",
    category: "process",
    summary: "A line through rising lows (uptrend) or falling highs (downtrend).",
    detail:
      "Draw it through at least two swing points; a third touch makes it more meaningful. A close through the trendline is a warning that the trend is weakening; a retest from the other side that fails adds weight. Trendlines are drawn by people and are approximate, so treat them as areas, not exact prices.",
  },
  {
    id: "neckline",
    name: "Neckline",
    category: "process",
    summary: "The line under a double top or head and shoulders (or over their inverse versions).",
    detail:
      "Double top: the low between the two tops. Head and shoulders: the line through the two troughs either side of the head. The pattern is only confirmed by a close through the neckline. Until then it is just a pullback. After the break the neckline often flips role (support becomes resistance) and gets retested.",
  },
  {
    id: "break-of-structure",
    name: "Break of structure (BOS)",
    category: "process",
    summary: "A close beyond the last swing high (in an uptrend) or swing low (in a downtrend).",
    detail:
      "Smart-money-concepts traders use BOS to describe a trend continuing: in an uptrend, closing above the last high is a bullish BOS. When price instead breaks the last higher low, many call it a change of character (the trend may be turning). These are labels for ordinary structure; use the candle close, not a wick, and expect false breaks.",
  },
  {
    id: "liquidity-sweep",
    name: "Liquidity sweep",
    category: "process",
    summary: "A quick wick beyond an obvious high or low that snaps back.",
    detail:
      "Many traders put stops just beyond equal highs/lows. A sweep is a fast push through those levels (triggering stops) followed by a close back inside the range, often leaving a long wick, like a hammer or shooting star at the extreme. It can mark a reversal, but it is only clear in hindsight; wait for a confirming close.",
  },
  {
    id: "order-block",
    name: "Order block (and exit order block)",
    category: "process",
    summary: "The last opposite candle before a strong move, used as a zone.",
    detail:
      "Bullish order block: the last red candle before a strong rally that breaks structure. Bearish order block: the last green candle before a strong drop. Traders mark that candle's range as a zone and watch how price reacts when it returns, much like a demand or supply zone. An 'exit order block' is the opposite-side zone where a move is expected to stall, used as a profit-taking area rather than an entry. These are SMC labels, not guaranteed reaction points.",
  },
  {
    id: "breaker-block",
    name: "Breaker block",
    category: "process",
    summary: "An order block that failed and flipped sides.",
    detail:
      "When price closes straight through an order block, that block 'breaks'. Traders then expect it to act the other way on a retest: a broken bullish block can become resistance, a broken bearish block support. It is the zone version of support turning into resistance.",
  },
  {
    id: "supply-zone",
    name: "Supply zone",
    category: "process",
    summary: "An area where sellers overwhelmed buyers: a small base, then a big-body drop away.",
    detail:
      "Find a small base candle (or a few small candles) right before a strong red candle that leaves the area fast. Mark from the base's high down to its body. When price later rallies back into that area, unfilled sell interest may push it down again. Strongest when fresh (not yet revisited). Broken if price closes strongly above the zone. SAMPLE teaching, not a guarantee.",
  },
  {
    id: "demand-zone",
    name: "Demand zone",
    category: "process",
    summary: "An area where buyers overwhelmed sellers: a small base, then a big-body rally away.",
    detail:
      "Find a small base candle (or a few) right before a strong green candle that leaves the area fast. Mark from the base's body down to its low. When price later falls back into that area, unfilled buy interest may push it up again. Strongest when fresh. Broken if price closes strongly below the zone. Look for a bullish candle (hammer, engulfing) inside the zone before acting.",
  },
  {
    id: "base-candle",
    name: "Base candle",
    category: "process",
    summary: "The small-body candle (or cluster) where a zone forms before the big move.",
    detail:
      "A base candle has a small body compared with nearby candles: a pause where orders built up. The zone is drawn around it. A base with several candles is still a base; what matters is that it is small and is followed by an impulse candle that leaves fast.",
  },
  {
    id: "impulse-candle",
    name: "Impulse (big-body departure) candle",
    category: "process",
    summary: "The large-body candle that leaves the base and proves which side won.",
    detail:
      "An impulse candle has a body several times larger than the base and larger than recent candles (in this trainer, at least 3× the base body). A weak, overlapping departure makes a weak zone. The bigger and faster the departure, the more orders were likely left behind.",
  },
  {
    id: "fresh-vs-tested-zone",
    name: "Fresh vs tested zone",
    category: "process",
    summary: "A zone price has not returned to yet is fresh; each revisit uses up orders.",
    detail:
      "The first return to a fresh zone is usually the most watched. After one or two tests, the zone weakens, and a big-body candle straight into it (with no rejection) warns that it may break. If price closes through the zone, it is broken and may flip role.",
  },
  {
    id: "zone-flip",
    name: "Zone flip (vs support/resistance flip)",
    category: "process",
    summary: "A broken demand zone can act as supply on the retest, and vice versa.",
    detail:
      "Same idea as support becoming resistance, but drawn as an area instead of a line: when price closes strongly through a demand zone, sellers who were trapped there may sell when price returns, so the old demand acts as supply. A support/resistance level is a single price that has been touched often; a zone is the base area of one strong departure.",
  },
  {
    id: "chase-vs-fade",
    name: "Chase vs Fade",
    category: "process",
    summary: "Chase = join the move; fade = bet it overshoots and mean-reverts.",
    detail:
      "Neither is always right. Match the choice to evidence quality, liquidity, and your horizon. Used in company-news and multi-market SAMPLE cases.",
  },
  {
    id: "bid-ask",
    name: "Bid vs Ask",
    category: "markets",
    summary: "Bid is what buyers will pay; ask is what sellers will take.",
    detail:
      "The spread between bid and ask is a cost of transacting. SAMPLE charts here show OHLC, not a live order book. Educational only.",
  },
  {
    id: "liquidity",
    name: "Liquidity",
    category: "markets",
    summary: "How easily you can trade without moving the price much.",
    detail:
      "Thin names can gap and slip. Liquid names absorb size more quietly. SAMPLE tapes are stylized—they do not measure real depth.",
  },
  {
    id: "volatility",
    name: "Volatility",
    category: "markets",
    summary: "How large and fast prices tend to swing.",
    detail:
      "Wide ranges and long wicks are a volatility cue on a SAMPLE candle chart. High volatility is not a buy or sell by itself—it changes how much uncertainty you accept.",
  },
  {
    id: "volume",
    name: "Volume",
    category: "markets",
    summary: "How much traded in the period—not shown as a live tape here.",
    detail:
      "Volume can confirm a move or warn that a spike had little participation. This trainer’s SAMPLE OHLC packs do not include a live volume feed.",
  },
  {
    id: "support-resistance",
    name: "Support and Resistance",
    category: "process",
    summary: "Prices where buying or selling has repeatedly shown up.",
    detail:
      "Support is a zone where buyers have stepped in; resistance where sellers have. The more times a level holds, the more traders watch it. Once broken, old resistance often becomes support (and old support resistance), which is what a breakout retest checks. A candle pattern at support or resistance means more than the same pattern mid-range. SAMPLE teaching: treat them as areas, not magic lines, and wait for later prints to confirm.",
  },
  {
    id: "trend-vs-range",
    name: "Trend vs Range",
    category: "process",
    summary: "One-way grind versus chopping between levels.",
    detail:
      "Trend tools (moving averages) fit a grind. Oscillators fit a range. Mixing them blindly is a common SAMPLE drill mistake.",
  },
  {
    id: "market-order-vs-limit",
    name: "Market vs Limit (education)",
    category: "position",
    summary: "Market seeks a fill now; a limit waits for your price.",
    detail:
      "Educational contrast only—this app does not route orders. A market order accepts the current bid/ask; a limit order waits. SAMPLE teaching, not a broker tutorial.",
  },
  {
    id: "earnings-season",
    name: "Earnings Season",
    category: "process",
    summary: "The clustered window when many companies report results.",
    detail:
      "Reports can reset the story: beat, miss, margins, cash, guidance. SAMPLE cases use stylized snapshots—not live filings.",
  },
  {
    id: "guidance",
    name: "Guidance / Outlook",
    category: "process",
    summary: "What management says it expects next—not what already happened.",
    detail:
      "A cut in outlook can matter more than a beat on the last quarter. SAMPLE earnings cases teach you to reread the thesis after guidance changes.",
  },
  {
    id: "free-cash-flow",
    name: "Free Cash Flow",
    category: "ownership",
    summary: "Cash from operations minus what the business reinvests to stay running.",
    detail:
      "Profit on the income statement can diverge from cash. SAMPLE snapshots highlight operating cash and free cash flow so you can question accruals.",
  },
  {
    id: "net-margin",
    name: "Net Margin",
    category: "ownership",
    summary: "Net income as a share of revenue—how much of each sale is kept.",
    detail:
      "Revenue up with margin down can still be a weaker story. SAMPLE statement cards show netMarginPct for that comparison.",
  },
  {
    id: "pe-ratio",
    name: "P/E Ratio",
    category: "ownership",
    summary: "Price divided by earnings—a rough multiple, not a grade.",
    detail:
      "A high or low P/E is a starting question, not an answer. SAMPLE cards include price and earnings so you can compute a simple multiple. Not a valuation product.",
  },
  {
    id: "diversification",
    name: "Diversification",
    category: "position",
    summary: "Spreading bets so one name or one story cannot sink the whole plan.",
    detail:
      "SAMPLE teaching: one case is one decision. Position size and how names move together sit outside this trainer’s order ticket—because there is no ticket.",
  },
  {
    id: "correlation",
    name: "Correlation (plain language)",
    category: "process",
    summary: "Whether two prices tend to move together or not.",
    detail:
      "In a risk-off tape, many stocks fall together. SAMPLE macro cases ask whether this name is the story or just along for the ride. Not a live correlation matrix.",
  },
  {
    id: "delayed-vs-sample-feed",
    name: "SAMPLE vs DELAYED feed",
    category: "markets",
    summary: "This app labels practice data honestly—never LIVE theater.",
    detail:
      "SAMPLE / STYLIZED packs are curated teaching tapes. DELAYED is a labeled delayed adapter when enabled. Neither is a real-time brokerage quote. Equities path still uses SAMPLE packs first.",
  },
  ...ADVANCED_TERMS,
  ...CHART_BOOK_TERMS,
  ...FINANCIAL_TERMS,
  ...MACRO_TERMS,
  ...ACADEMY_TERMS,
  ...OSCILLATOR_TERMS,
  ...CANDLE_TERMS,
  ...SQZ_TERMS,
  ...NEWS_BIAS_TERMS,
  ...ALGO_TERMS,
  ...CHART_APP_TERMS,
  ...PDT_TERMS,
  ...CRYPTO_TERMS,
  ...REVERSAL_TERMS,
  ...ONE_MIN_TERMS,
  ...FIB_MAP_TERMS,
  ...FUT_OPT_TERMS,
  ...NARRATIVE_TERMS,
  ...MW_TERMS,
]

export function getLiteracyTerm(id: string): LiteracyTerm | undefined {
  return LITERACY_TERMS.find((t) => t.id === id);
}
