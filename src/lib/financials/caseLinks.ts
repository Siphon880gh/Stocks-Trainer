/**
 * FE7.M2 cases bridge (Weng, 2026-10-21: "yes"). Existing earnings cases are tagged with Read the Print events
 * that teach the same setup, so CasePlayer can link to a round and a round's reveal can link back to the cases.
 * Thematic matches only: the cases use their own SAMPLE companies and numbers, which stay untouched (ids, snapshots, grading).
 */
import { EARNINGS_CASES, getCaseStudy } from "../caseStudies";
import { companyById } from "./companies";
import { eventById } from "./earningsEvents";
import { PRINT_ROUNDS } from "./readThePrint";

export interface CaseEventLink {
  eventId: string;
  /** The shared lesson, shown next to the link. */
  why: string;
}

export const EARNINGS_CASE_EVENT_LINKS: Record<string, CaseEventLink[]> = {
  "case-earn-beat-miss": [{ eventId: "nwcl-q4fy25", why: "A run-up into a print that only just beat" }],
  "case-earn-margin-compression": [
    { eventId: "hbpn-q2fy26", why: "Costs catching up with sales" },
    { eventId: "bayb-q2fy25", why: "Funding costs catching up with a bank's loan yields" },
  ],
  "case-earn-guidance-cut": [
    { eventId: "irbg-q1fy26", why: "An OK quarter with a weaker outlook" },
    { eventId: "nwcl-q1fy26", why: "Beat the quarter, cut the outlook" },
  ],
  "case-earn-balance-stress": [{ eventId: "irbg-q3fy26", why: "Thin earnings with leverage rising" }],
  "case-earn-retail-beat-thin": [
    { eventId: "hbpn-q1fy26", why: "A retailer whose traffic (comps) disappointed" },
    { eventId: "kstl-q1fy26", why: "A stock bid up into the print, then sold" },
  ],
  "case-earn-bank-quiet-beat": [
    { eventId: "bayb-q4fy25", why: "A bank quarter with nothing new in it" },
    { eventId: "bayb-q2fy26", why: "A bank miss where the details mattered more than EPS" },
  ],
  "case-earn-int-guide-cut-utility": [{ eventId: "irbg-q1fy26", why: "Beat now, lower path ahead" }],
  "case-earn-int-debt-airline": [{ eventId: "irbg-q3fy26", why: "A heavy balance sheet that a quarter cannot fix" }],
};

export interface PrintLink {
  eventId: string;
  /** 1-based round number for /practice/read-the-print?round=N. */
  round: number;
  href: string;
  label: string;
  why: string;
}

export function printLinksForCase(caseId: string): PrintLink[] {
  return (EARNINGS_CASE_EVENT_LINKS[caseId] ?? []).flatMap((l) => {
    const e = eventById(l.eventId);
    const idx = PRINT_ROUNDS.findIndex((r) => r.eventId === l.eventId);
    if (!e || idx < 0) return [];
    const c = companyById(e.companyId);
    const q = c?.quarters[e.quarterIndex];
    if (!c || !q) return [];
    const label = `${c.name} · ${q.label}`;
    return [{ eventId: e.id, round: idx + 1, href: `/practice/read-the-print?round=${idx + 1}`, label, why: l.why }];
  });
}

export interface CaseLinkBack {
  caseId: string;
  title: string;
  href: string;
  why: string;
}

/** Reverse lookup: library cases that practice the same setup as this event. */
export function casesForEvent(eventId: string): CaseLinkBack[] {
  const out: CaseLinkBack[] = [];
  for (const [caseId, links] of Object.entries(EARNINGS_CASE_EVENT_LINKS)) {
    const l = links.find((x) => x.eventId === eventId);
    const c = getCaseStudy(caseId);
    if (l && c) out.push({ caseId, title: c.title, href: `/cases/${caseId}`, why: l.why });
  }
  return out;
}

export const LINKED_EARNINGS_CASE_IDS = Object.keys(EARNINGS_CASE_EVENT_LINKS).filter((id) => EARNINGS_CASES.some((c) => c.id === id));
