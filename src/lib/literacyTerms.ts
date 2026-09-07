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
      "Color encodes the period’s direction, not volume or certainty. SAMPLE charts paint green when close > open and red when close < open.",
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
      "Support is a zone where buyers have stepped in; resistance where sellers have. SAMPLE teaching: treat them as areas, not magic lines, and wait for later prints to confirm.",
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
]

export function getLiteracyTerm(id: string): LiteracyTerm | undefined {
  return LITERACY_TERMS.find((t) => t.id === id);
}
