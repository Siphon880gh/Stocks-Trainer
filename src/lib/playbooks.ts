import type { AssetClass } from "./samplePacks";

export type PlaybookSourceKind = "youtube" | "webpage";

export interface PlaybookSource {
  url: string;
  kind: PlaybookSourceKind;
  /** YouTuber, video title, or site name — shown as the top-of-page link. */
  label: string;
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
];

export function listPlaybooks(): Playbook[] {
  return [...PLAYBOOKS];
}

export function getPlaybook(id: string): Playbook | undefined {
  return PLAYBOOKS.find((p) => p.id === id);
}
