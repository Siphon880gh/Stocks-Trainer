import type { AssetClass } from "./samplePacks";

export type PlaybookSourceKind = "youtube" | "webpage";

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
];

export function listPlaybooks(): Playbook[] {
  return [...PLAYBOOKS];
}

export function getPlaybook(id: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.id === id);
}
