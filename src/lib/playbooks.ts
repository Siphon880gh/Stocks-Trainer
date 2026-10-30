import type { AssetClass } from "./samplePacks";
import { FP_CREDIBILITY, FP_RELATED, FP_SOURCE } from "./fourPillars";
import { FVG_CREDIBILITY, FVG_PLAYBOOK_SOURCE, FVG_RELATED } from "./fairValueGap";
import { RPP_CREDIBILITY, RPP_PLAYBOOK_SOURCE, RPP_RELATED, RPP_VIDEO } from "./riskPremiumPortfolio";
import { VIX_CREDIBILITY, VIX_PLAYBOOK_EXPLANATION, VIX_PLAYBOOK_SOURCE, VIX_RELATED } from "./vixTrading";

export type PlaybookSourceKind = "youtube" | "webpage";

/**
 * Optional embedded video for a kit, shown above the panels with a credit line under the player.
 * `embedUrl` must be a privacy-enhanced https://www.youtube-nocookie.com/embed/<id> link for the same video as `watchUrl`.
 */
export interface PlaybookVideo {
  embedUrl: string;
  /** Video title as published; used for the iframe title and the credit line. */
  title: string;
  /** Creator / channel name as published. */
  creator: string;
  /** Public watch link credited under the player. */
  watchUrl: string;
  /** Creator's channel, only when verified (e.g. YouTube oEmbed `author_url`). */
  channelUrl?: string;
}

/** One outside page that teaches an idea in the kit (`corroborates`) or only describes the method (`presents`). */
export interface PlaybookCorroboratingSource {
  /** Which part of the kit it backs, e.g. "3 · Invalidation". */
  supports: string;
  label: string;
  url: string;
  /** What the page says that matters here, in one plain sentence. */
  note: string;
  role: "corroborates" | "presents";
  /** Day the URL was fetched and read (YYYY-MM-DD). `npm run check:playbook-sources` re-checks it loads. */
  verifiedOn: string;
}

/** Optional "how well-tested is this?" note: an honest verdict plus the outside pages behind each idea. */
export interface PlaybookCredibility {
  title: string;
  /** Short plain-language paragraphs, shown before the sources. */
  summary: string[];
  sources: PlaybookCorroboratingSource[];
}

export interface PlaybookSource {
  url: string;
  kind: PlaybookSourceKind;
  /** YouTuber, video title, or site name — shown as the top-of-page link. */
  label: string;
  /** Day the URL was last fetched and read against the kit (YYYY-MM-DD). `npm run check:playbook-sources` re-checks it loads. */
  verifiedOn?: string;
}

/**
 * One outside-source strategy kit. Cursor fills these fields when it
 * authors from the Playbooks prompt — do not invent a second registry.
 */
export interface Playbook {
  id: string;
  title: string;
  summary: string;
  assetClass: AssetClass;
  source: PlaybookSource;
  /** Learner explanation for the Strategy panel. */
  explanation: string;
  /** Existing `/coach/:slug` when a session is wired. */
  coachSlug?: string;
  /** Existing `/cases/:caseId` when a case is wired. */
  caseId?: string;
  /** SAMPLE pack id for the Chart look panel. */
  samplePackId?: string;
  /** Overlay ids MarketChart already renders (`sma` `ema` `rsi` `macd` `bollinger`). */
  overlayIds?: string[];
  /** Optional in-app links shown under the Strategy text (lessons, Learn groups, coach, cases). */
  related?: { label: string; to: string }[];
  /** Optional embedded video (with credit) shown above the panels. */
  video?: PlaybookVideo;
  /** Optional credibility note rendered as its own panel after Strategy. */
  credibility?: PlaybookCredibility;
}

/** Authored playbooks. Append here — the list page reads this array. */
export const PLAYBOOKS: Playbook[] = [
  {
    id: "gap-and-go",
    title: "Gap and go",
    summary:
      "A stock opens well above yesterday’s close on news, then tries to hold the gap. Common in YouTube day-trading rooms.",
    assetClass: "equity",
    source: {
      url: "https://www.youtube.com/watch?v=7RbjGk9eNJU",
      kind: "youtube",
      label: "Ross Cameron · Gap and go",
    },
    explanation:
      "SAMPLE teaching of a setup YouTube stock day traders repeat constantly: find a name that gapped up on a real catalyst (earnings, contract, filing — not a rumor you cannot check), mark the pre-market or first-bar high, and only treat “go” as a process if the gap holds.\n\nThis kit is not Ross Cameron’s course and not a live scanner. Warrior Trading’s public video walks the gap idea. Your job here is the hygiene: catalyst first, then the tape, then wait if the first push is already extended.\n\nHOLD is a valid answer when the headline is thin or the gap is already given back.",
    coachSlug: "chase-vs-fade",
    caseId: "case-news-chase-fade",
    samplePackId: "eq-gap-go",
    overlayIds: ["ema"],
  },
  {
    id: "vwap-hold",
    title: "Hold above the average",
    summary:
      "Intraday traders watch whether price stays on the right side of the session average after a morning push.",
    assetClass: "equity",
    source: {
      url: "https://www.youtube.com/watch?v=uV84kDLUgZ4",
      kind: "youtube",
      label: "Humbled Trader · Day trading beginner guide",
    },
    explanation:
      "SAMPLE teaching of the VWAP-style habit that shows up in almost every YouTube stocks day-trading video: after the open, ask whether buyers still defend the session average on pullbacks, or whether the name lost it and you are late.\n\nHumbled Trader’s public beginner video walks VWAP holds and dips. This chart cannot draw VWAP yet — the Chart look panel uses SMA as a stand-in so you can practice “above / below the average” without inventing an overlay.\n\nNot her paid academy. Not a live Level 2 desk. If the average is lost and you do not have a new reason, waiting is the lesson.",
    coachSlug: "chart-soft-gate",
    caseId: "case-news-telco-spectrum-pause",
    samplePackId: "eq-mega-tech",
    overlayIds: ["sma"],
  },
  {
    id: "sma-swing-bias",
    title: "Swing bias from the long average",
    summary:
      "YouTube swing traders often filter names with the 200-day area and nearby support before they talk entries.",
    assetClass: "equity",
    source: {
      url: "https://www.youtube.com/watch?v=UWKNLR4jOI0",
      kind: "youtube",
      label: "Humbled Trader · Swing trading guide",
    },
    explanation:
      "SAMPLE teaching of a swing filter the YouTube stocks community repeats: is the name above a long moving average (community videos usually say 200 SMA), and are you buying a demand area — or catching a knife under that average after a headline?\n\nHumbled Trader’s public swing guide walks support zones and the 200 SMA as a bias, not a magic buy button. Our Chart look panel can draw SMA. That is enough to practice “above / below the long average.”\n\nNot investment advice. A quiet earnings beat into an already-rich tape can still be HOLD.",
    coachSlug: "equities-literacy",
    caseId: "case-scale-beat-hold",
    samplePackId: "eq-mega-tech",
    overlayIds: ["sma"],
  },
  {
    id: "ema-reclaim",
    title: "Reclaim the short average",
    summary:
      "Desk-style YouTube lessons often wait for a wash, then a reclaim of a short moving average before they size up.",
    assetClass: "equity",
    source: {
      url: "https://www.youtube.com/watch?v=zm4ehSDIr0k",
      kind: "youtube",
      label: "SMB Capital · Accuracy and big winners",
    },
    explanation:
      "SAMPLE teaching of a reclaim setup YouTube stock traders lift from desk content: the name sells off, then turns, then a short average (community videos often say 9 EMA, sometimes vs VWAP) crosses back through the average they were using as a line in the sand.\n\nSMB Capital’s public video walks that combo on real charts. We can draw EMA, not VWAP. Use EMA as the reclaim line on the SAMPLE tape. If the first bounce is already vertical, you are late — same chase-vs-fade habit as the Coach panel.\n\nNot SMB’s paid desk program. Not a live tape.",
    coachSlug: "chase-vs-fade",
    caseId: "case-news-steel-contract-spike",
    samplePackId: "eq-fail-rally",
    overlayIds: ["ema"],
  },
  {
    id: "covered-call",
    title: "Covered call on shares you own",
    summary:
      "Own the shares, sell a call against them for premium, and accept that the stock may be called away at the strike.",
    assetClass: "option_context",
    source: {
      url: "https://www.optionseducation.org/strategies/all-strategies/covered-call-buy-write",
      kind: "webpage",
      label: "Options Industry Council · Covered Call (Buy/Write)",
      verifiedOn: "2026-10-21",
    },
    explanation:
      "SAMPLE teaching of the covered call as the Options Industry Council (OIC) lays it out: you hold 100 shares and write one call against them. The premium is yours whatever happens, gives a small cushion if the stock slides and lifts the return if it rises, but while the call is open you give up most of the upside above the strike.\n\nOIC’s rules of the road: the outlook is neutral to moderately bullish — a steady or slightly rising stock for the life of the option, not a very bearish or very bullish view. Strike plus premium should be a price you are happy to sell at, because assignment is the point, not a failure. If you would regret losing the shares mid-rally, OIC says think carefully first; the only sure way to avoid assignment is to buy the call back, which can cost more when the stock climbs fast. The worst case is still the stock going to zero — the premium only trims that loss. Breakeven at expiration = starting stock price − premium received. And you cannot sell the shares while the call is open without leaving it uncovered.\n\nThis app has no options chain. The Chart look panel is the underlying only: practice asking “is this tape quiet enough to rent out the upside?” The Academy options ladder walks the payoff. Not investment advice.",
    coachSlug: "options-literacy",
    caseId: "case-optctx-flag-hold",
    samplePackId: "opt-ctx-coil",
    overlayIds: [],
  },
  {
    id: "cash-secured-put",
    title: "Cash-secured put to buy lower",
    summary:
      "Sell a put with the cash set aside to buy the shares, aiming to own the stock at the strike minus the premium.",
    assetClass: "option_context",
    source: {
      url: "https://www.optionseducation.org/strategies/all-strategies/cash-secured-put",
      kind: "webpage",
      label: "Options Industry Council · Cash-Secured Put",
      verifiedOn: "2026-10-21",
    },
    explanation:
      "SAMPLE teaching of the cash-secured put from the Options Industry Council: write an at-the-money or out-of-the-money put and set aside enough cash to buy the stock if you are assigned. OIC calls it a stock acquisition strategy for a price-sensitive investor — you want the shares, and strike minus premium is the price you would happily pay.\n\nThe outlook is neutral to moderately bullish: a short-term dip, then longer-term appreciation. OIC names two principal risks. One, the stock does not just dip but plummets well below the strike — you must be comfortable owning it at the strike no matter how low it goes. Two, the stock keeps climbing and you never get assigned, so you keep the premium but the winner “got away.” Breakeven = strike − premium. The maximum loss is substantial (stock to zero, less the premium), and OIC notes its risk profile matches a covered call.\n\nThe Chart look panel shows a dump that does not reclaim — the first risk OIC warns about. Ask before you write the put: would I still want this stock down here? There is no options chain in this app. Not investment advice.",
    coachSlug: "options-literacy",
    caseId: "case-optctx-double-bottom",
    samplePackId: "opt-ctx-dump",
    overlayIds: [],
  },
  {
    id: "protective-put",
    title: "Protective put before a known event",
    summary:
      "Keep the shares, buy a put as insurance through an announcement, and accept that the premium is the cost of the floor.",
    assetClass: "option_context",
    source: {
      url: "https://www.optionseducation.org/strategies/all-strategies/protective-put-married-put",
      kind: "webpage",
      label: "Options Industry Council · Protective Put (Married Put)",
      verifiedOn: "2026-10-21",
    },
    explanation:
      "SAMPLE teaching of the protective put from the Options Industry Council: add a long put to a long stock position. The strike sets the floor where protection kicks in; above it you keep the stock’s upside. OIC compares it to homeowner’s insurance — you would rather not need it. (Buying the put at the same time as the shares is called a married put.)\n\nOIC lists when investors consider one: before an imminent news announcement that could send a favorite stock into a slump, when one stock is a large share of the portfolio, when you must protect the value for a set period, when you cannot sell for a while, or to protect large unrealized gains. The outlook is bullish overall but worried about a sharp temporary decline. The cost is real: returns lag by the premium however high the stock goes, and time decay works against you. Maximum loss = stock purchase price − strike + premium paid. Breakeven = starting stock price + premium. If the worst passes, you can sell the put back to recover some of its cost.\n\nThe Chart look panel is the underlying into an event window — practice naming the floor you would want before the print. No options chain, no Greeks engine here. Not investment advice.",
    coachSlug: "options-context-event",
    caseId: "case-optctx-headline-into-event",
    samplePackId: "opt-ctx-event",
    overlayIds: [],
  },
  {
    id: "dollar-cost-averaging",
    title: "Dollar-cost averaging on a schedule",
    summary:
      "Invest the same amount at regular intervals no matter what the market is doing, and know what that costs you.",
    assetClass: "equity",
    source: {
      url: "https://www.finra.org/investors/insights/dollar-cost-averaging",
      kind: "webpage",
      label: "FINRA · The Benefits and Limitations of Dollar-Cost Averaging",
      verifiedOn: "2026-10-21",
    },
    explanation:
      "SAMPLE teaching of dollar-cost averaging as FINRA’s investor page explains it: invest your money in equal portions, at regular intervals, regardless of current market conditions. FINRA’s example: instead of putting $10,000 in at once, invest $1,000 a month for 10 months and keep the rest somewhere low-risk and easy to reach. Paycheck contributions to a 401(k) already work this way.\n\nThe benefits FINRA lists: a fixed schedule can take some emotion out — less selling in fear after a drop, less rushing in after a run-up. The same dollars buy more shares when the price is low and fewer when it is high, which sometimes means a lower average price per share. Money not yet invested is untouched by a sharp decline.\n\nThe limitations, just as plainly: holding cash and spreading purchases out has lower risk but often produces lower returns than investing a lump sum, especially over longer periods. Per-trade commissions or fees can add up across many purchases. And you need a plan for the cash waiting on the sidelines.\n\nThe Chart look panel is a calm index-style tape with a moving average. The habit to practice is the schedule itself: the next buy happens on the date, not because the chart looks scary or exciting. Not investment advice.",
    coachSlug: "trade-plan-before-entry",
    caseId: "case-scale-risk-on",
    samplePackId: "eq-index-proxy",
    overlayIds: ["sma"],
  },
  {
    id: "rebalance-to-target",
    title: "Rebalance back to your target mix",
    summary:
      "Pick a stock/bond/cash mix, let it drift, then trim what ran and add to what lagged on a calendar or a threshold.",
    assetClass: "equity",
    source: {
      url: "https://www.investor.gov/additional-resources/general-resources/publications-research/info-sheets/beginners-guide-asset",
      kind: "webpage",
      label: "SEC Investor.gov · Beginners’ Guide to Asset Allocation, Diversification, and Rebalancing",
      verifiedOn: "2026-10-21",
    },
    explanation:
      "SAMPLE teaching of rebalancing from the SEC’s Investor.gov beginners’ guide. Asset allocation is how you divide a portfolio among stocks, bonds and cash; the SEC calls the choice very personal, driven by your time horizon and risk tolerance. Rebalancing is bringing the portfolio back to that original mix after some holdings grow faster than others.\n\nThe guide’s example: you decided stocks should be 60% of the portfolio, and after a stock market rise they are 80%. Three ways back: sell some of the over-weighted category and buy the under-weighted one; buy more of the under-weighted category with new money; or, if you contribute regularly, steer new contributions to the under-weighted category until the mix is back. The SEC notes this forces you to cut back on recent winners and add to recent losers — buy low, sell high — and that savvy investors typically do not change their allocation just because one category is hot.\n\nWhen: on the calendar (the guide mentions every six or twelve months) or when a category drifts past a percentage you picked in advance. It tends to work best done infrequently. Check transaction fees and taxes first.\n\nThe Chart look panel is an index-style tape. The kit does not pick your target mix — that part is yours. Not investment advice.",
    coachSlug: "equities-literacy",
    caseId: "case-macro-risk-off",
    samplePackId: "eq-index-proxy",
    overlayIds: [],
  },
  {
    id: "stop-vs-stop-limit",
    title: "Stop versus stop-limit on a gap",
    summary:
      "A stop becomes a market order and can fill far below the trigger; a stop-limit protects the price but may not fill at all.",
    assetClass: "equity",
    source: {
      url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-15",
      kind: "webpage",
      label: "SEC Investor.gov · Stop, Stop-Limit, and Trailing Stop Orders",
      verifiedOn: "2026-10-21",
    },
    explanation:
      "SAMPLE teaching of exit-order choice from the SEC’s investor bulletin on stop, stop-limit and trailing stop orders. A sell stop sits below the current price to limit a loss or protect a profit on shares you own. When the stop price is reached it becomes a market order — the stop price is a trigger, not a guaranteed fill, and the execution can deviate significantly from it.\n\nA stop-limit becomes a limit order instead, so you control the worst price — but, like any limit order, it may not execute if the price moves away. The bulletin’s example: a sell stop-limit with a $3.00 stop and a $2.50 limit turns into a live limit order at $3.00 but can only fill at $2.50 or better. Both kinds can be set off by a short-term intraday move, and brokers differ on whether last sales or quotes trigger them. A trailing stop moves the trigger with the price by a set dollar or percentage amount and stays put when the price turns against you; the bulletin walks a buy at $20, a peak at $24, and a $1 trail that triggers at $23.\n\nThe Chart look panel shows a quiet grind, then a gap lower that stays offered. Ask: if my stop was above that gap, would I rather be out at a worse price, or still holding because my limit never filled? The Academy paper desk lets you try stops and trailing stops on SAMPLE tapes. Not investment advice.",
    coachSlug: "trailing-stop-exit",
    caseId: "case-scale-dividend-cut",
    samplePackId: "eq-div-cut",
    overlayIds: [],
  },
  {
    id: "short-with-buy-stop",
    title: "Short sale with a buy stop above",
    summary:
      "Sell borrowed shares expecting a drop, and decide in advance where a buy stop will cover if the stock rises instead.",
    assetClass: "equity",
    source: {
      url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-51",
      kind: "webpage",
      label: "SEC Investor.gov · An Introduction to Short Sales",
      verifiedOn: "2026-10-21",
    },
    explanation:
      "SAMPLE teaching of short selling from the SEC’s investor bulletin. A short sale is generally the sale of a stock you do not own (or will borrow for delivery). The SEC’s example: borrow and sell at $60, buy back at $40, profit $20 a share before costs; if it rises to $80 instead, lose $20 a share. Unlike a long position, where the risk is limited to what you put in, a short leaves you open to theoretically unlimited losses, because a stock can keep rising.\n\nThe bulletin also spells out the plumbing: your broker usually lends you the shares, charges interest on the loan, and you are subject to the margin rules. If the borrowed stock pays a dividend, you owe it to the lender. Abusive shorting meant to manipulate a price is illegal.\n\nThe exit side comes from the SEC’s stop-order bulletin: a buy stop is entered above the current price and is generally used to limit a loss or protect a profit on a stock sold short. It becomes a market order when triggered, so a gap up can fill well past it. Decide the cover price before you sell.\n\nThe Chart look panel shows a rally that fails. The case hands you a real catalyst (a recall) on a name you do not own — the reason comes first, then the cover plan. The Academy paper desk has an opt-in short-selling mode with margin. Not investment advice.",
    coachSlug: "short-vs-sell",
    caseId: "case-news-short-recall",
    samplePackId: "eq-fail-rally",
    overlayIds: [],
  },
  {
    id: "futures-roll",
    title: "Offset, roll, or go to settlement",
    summary:
      "A futures contract expires. Before it does, you either offset it, roll to a later month, or let it settle.",
    assetClass: "future",
    source: {
      url: "https://www.cmegroup.com/education/courses/introduction-to-futures/understanding-futures-expiration-contract-roll.html",
      kind: "webpage",
      label: "CME Group · Understanding Futures Expiration & Contract Roll",
      verifiedOn: "2026-10-21",
    },
    explanation:
      "SAMPLE teaching of contract expiration from CME Group’s introduction-to-futures course. A contract’s expiration date is the last day you can trade it; CME says it typically falls on the third Friday of the expiration month, but it varies by contract. Before then you have three choices.\n\nOffset: take an equal and opposite trade in the same contract month — CME’s example is a trader short two September WTI crude contracts who buys two September contracts. The price difference is the profit or loss, with no delivery. Roll: offset the front month and open the same position further out at the same time — CME’s example sells four September E-mini S&P 500 contracts and buys four December (or later) ones. Traders watch volume in the expiring and next contract to decide when to switch. Settlement: if you neither offset nor roll, the contract expires and settles, by physical delivery or cash depending on the market.\n\nThe Coaching and Case panels add what the roll costs or pays when the next month is priced above (contango) or below (backwardation) the front. The Chart look panel is an index-style future tape. Know your exit before the calendar decides it. Not investment advice.",
    coachSlug: "futures-roll",
    caseId: "case-fut-roll-literacy",
    samplePackId: "fut-index",
    overlayIds: [],
  },
  {
    id: "price-action-four-pillars",
    title: "Price action in four pillars",
    summary:
      "Strip the indicators and run four checks in order: map the level, wait for the confirmation you chose, know the invalidation price, then let context set the size.",
    assetClass: "equity",
    source: {
      url: FP_SOURCE.url,
      kind: "youtube",
      label: FP_SOURCE.label,
    },
    explanation:
      "SAMPLE teaching of the process in Brando Trades’ public video. The idea: a chart is a record of where buyers and sellers already made decisions. Predictions cost, reactions pay. Simple does not mean safe; it means repeatable. Run the four pillars in this order every time.\n\n1. Map. Draw one precise horizontal line where price touched, reacted and moved away, not a wide zone. One touch is interesting, two is real, three or four is significant. Watch closes against the line: a wick through it is a test, a close through it is a statement. The map tells you where to watch; it does not predict, and a level can still be sliced through.\n\n2. Confirmation. Decide in advance what price must do at the level before you act: a hold, a reclaim, or a break and retest, judged on the close. The level is where to watch; the confirmation is when to act. “It looks strong” is not a confirmation. Confirmation does not make you right; it makes you disciplined. (The creator tells of buying a silver dip before any confirmation and taking a large loss; that is his account, not checked here.)\n\n3. Invalidation. Before entry, know the exact price that proves you wrong. For a reclaim: a daily close back below the reclaimed level. Use closes, not ticks. No moving the stop, no adding to a loser, no negotiating. The distance to invalidation sets the position size: the math controls size, not confidence.\n\n4. Context. Before sizing, check the market (SPX / QQQ daily: trending, extended or choppy?), how extended the stock is (five up days with no pullback vs a fresh breakout from a three-week base), and catalysts (earnings, CPI, the Fed). Context picks full size, half size or pass. It never turns a bad setup into a good one.\n\nThe three setups all start with a level. Hold: old resistance flips to support and a retest from above holds, long above it. Reclaim: support breaks and closes below, then price closes back above it, long on the confirmed reclaim. Rejection: a rally into significant resistance prints a daily candle with a long upper wick, short just under the level.\n\nCommon mistakes: stacking indicators, entering before the confirmation, moving the stop, and ignoring context.\n\nThe video does not give profit-target or trailing-stop rules, so none are attributed to it here. For exits, the links below go to the app’s own price action trading framework. The Chart look panel has no indicators on purpose: practice drawing the levels yourself. Not investment advice.",
    coachSlug: "four-pillars",
    caseId: "case-fp-reclaim",
    samplePackId: "eq-cyclical",
    overlayIds: [],
    related: FP_RELATED,
    video: {
      embedUrl: FP_SOURCE.embedUrl,
      title: FP_SOURCE.title,
      creator: FP_SOURCE.creator,
      watchUrl: FP_SOURCE.url,
      channelUrl: FP_SOURCE.channelUrl,
    },
    credibility: FP_CREDIBILITY,
  },
  {
    id: "breakout-pullback-fvg",
    title: "Breakout, pullback and fair value gap",
    summary:
      "Don’t buy the breakout candle. Check whether the move left a gap between candle 1’s high and candle 3’s low, buy the pullback into it, and put the stop below the gap and the broken level.",
    assetClass: "equity",
    source: {
      url: FVG_PLAYBOOK_SOURCE.url,
      kind: "webpage",
      label: FVG_PLAYBOOK_SOURCE.label,
      verifiedOn: FVG_PLAYBOOK_SOURCE.verifiedOn,
    },
    explanation:
      "SAMPLE teaching of a breakout setup inspired by a short Facebook trading reel, checked against the public pages listed under “How well-tested is this?”. The resource link above is NinjaTrader’s guide to fair value gaps.\n\n1. Mark the level. Find resistance that has capped price more than once.\n\n2. The breakout candle is a signal, not an entry. Don’t buy as the candle first crosses the level. That is where late buyers chase and where many breakouts reverse.\n\n3. Look for the imbalance. Around the breakout candle, compare candle 1’s high with candle 3’s low. If candle 3’s low is above candle 1’s high, the space between them is a gap: price moved so fast that only buyers traded there. It is commonly called a fair value gap (FVG). If the wicks overlap, even by a cent, there is no gap and no setup.\n\n4. Wait for the pullback into the gap. Enter long when price pulls back into it. That pullback is the confirmation.\n\n5. Stop below the gap and the level. If price closes back below both, the breakout idea has failed. Size from the distance to the stop.\n\nThe reel says these gaps are “often retested”. That is a common trader belief, not a guarantee: some gaps are never revisited, and a missed trade is the cost of waiting. Some pullbacks also keep going through the gap. The reel shows a target well above the entry but gives no rule for it, so none is attributed to it here. For targets and trailing stops, the links below go to the app’s own price action trading framework. Not investment advice.",
    coachSlug: "breakout-pullback-fvg",
    caseId: "case-fvg-pullback-into-gap",
    samplePackId: "eq-mega-tech",
    overlayIds: [],
    related: FVG_RELATED,
    credibility: FVG_CREDIBILITY,
  },
  {
    id: "etf-north-star-vrp",
    title: "Risk-premium ETF mix with a VIX overlay",
    summary:
      "Spread money across assets that are paid for different risks (stocks, long bonds, gold, a currency, commodities), step aside when a trend breaks, and, if you add a short-volatility overlay at all, size it for a 400% VIX spike.",
    assetClass: "equity",
    source: {
      url: RPP_PLAYBOOK_SOURCE.url,
      kind: "webpage",
      label: RPP_PLAYBOOK_SOURCE.label,
      verifiedOn: RPP_PLAYBOOK_SOURCE.verifiedOn,
    },
    explanation:
      "SAMPLE teaching of a portfolio idea from Predicting Alpha’s YouTube video, embedded above, checked against the public pages listed under “How well-tested is this?”. The resource link above is Bridgewater’s account of its All Weather portfolio, the best-known version of building a portfolio from economic roles.\n\nRead this first. The video’s headline result ($100,000 to $1.2 million, 18.4% a year, Sharpe 1.22) is the creator’s own backtest, shown before a pitch for their paid service. It is not a live or audited track record, and the video leaves out the trend lookbacks, the VIX thresholds and the sizing formula, so nobody outside can reproduce it. The app shows the numbers only as a reading exercise.\n\n1. Hold risk premiums, not bets. The base mix is SPY 35%, TLT 30%, GLD 20%, FXE 10%, DBC 5%: equity risk, duration (rates) risk, a monetary hedge, currency exposure and inflation exposure. The creator says the weights come from each asset’s role, not from what backtested best. Weights tuned to past results tend to fit that history’s noise.\n\n2. Diversify by correlation. Assets that don’t move together lower the portfolio’s swings. The catch: in 2022 stocks and long bonds fell together, so the cushion can fail when you need it.\n\n3. Trend filter. Each asset can move partly to cash when its trend weakens. The video gives no lookback. A common textbook rule (not the video’s) is to hold an asset only while its month-end price is above its 10-month average. Trend rules cut some long declines and lag at turns.\n\n4. The VIX overlay. When the VIX futures curve is in contango and implied volatility is above realized, the strategy shorts VXX to collect the volatility risk premium; when the curve inverts it flips long. The backtest charges $0.005 a share and 3.5% a year to borrow VXX, and trades market-on-close after deciding 30 minutes earlier.\n\nWarning: short volatility. It earns small amounts most days and can lose several times the position in days. The video says VXX rallied more than 400% in the 2020 crash: a short worth 20% of the account would lose about 80% of the account. In February 2018, inverse-VIX notes such as XIV fell more than 90% in one session and the issuer closed XIV. FINRA warns these products are generally unsuitable for buy-and-hold retail investors.\n\nWarning: leverage. With the overlay the exposure is about 120% of the account. Leverage adds to losses and can bring margin calls at the worst moment.\n\nThe app adds a check: the combined numbers imply about 14.8 years, and over that span the ETF-only end value works out to about 7% a year, not the 5.5% shown. Not investment advice.",
    coachSlug: "read-a-backtest",
    caseId: "case-vrp-short-vxx-curve-inverts",
    samplePackId: "eq-index-proxy",
    overlayIds: [],
    related: RPP_RELATED,
    video: {
      embedUrl: RPP_VIDEO.embedUrl,
      title: RPP_VIDEO.title,
      creator: RPP_VIDEO.creator,
      watchUrl: RPP_VIDEO.watchUrl,
      channelUrl: RPP_VIDEO.channelUrl,
    },
    credibility: RPP_CREDIBILITY,
  },
  {
    id: "vix-curve-carry-paper",
    title: "VIX futures curve and carry (paper trade first)",
    summary:
      "Learn one VIX instrument's contract, read the futures curve's level and slope, write a testable thesis about the contract you'd hold (not spot VIX), size the stress loss in dollars, and judge the record by its worst loss, not its win rate. On paper first, or not at all.",
    assetClass: "future",
    source: {
      url: VIX_PLAYBOOK_SOURCE.url,
      kind: "webpage",
      label: VIX_PLAYBOOK_SOURCE.label,
      verifiedOn: VIX_PLAYBOOK_SOURCE.verifiedOn,
    },
    explanation: VIX_PLAYBOOK_EXPLANATION,
    coachSlug: "vix-futures-curve",
    caseId: "case-vix-short-future-spot-falls",
    samplePackId: "fut-index",
    overlayIds: [],
    related: VIX_RELATED,
    credibility: VIX_CREDIBILITY,
  },
];

export function listPlaybooks(): Playbook[] {
  return [...PLAYBOOKS];
}

export function getPlaybook(id: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.id === id);
}
