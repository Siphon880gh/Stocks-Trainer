import type { CoachingSession } from "../types";

/** Tool training: take report dates from the company and read insider-tracker rows against the Form 4. */
export const earningsInsidersTourSession: CoachingSession = {
  meta: {
    slug: "earnings-insiders-tour",
    title: "Whose date, whose trade?",
    summary:
      "Check a report date against the company's own release, read before open vs after close, then sort an insider tracker's rows: window openings, 10b5-1 plans and open-market buys.",
    topic: "Tool training",
    tags: ["sample", "tools", "research-tools"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE walk with real dated reads. On Nov 13, 2026, StockAnalysis's Earnings Date field for JPMorgan shows Oct 13, 2026, and Yahoo's calendar shows January 14, 2027 at 8 AM EST.\n\nWhat goes in your note as the next report?",
        outcome: "continue",
        choices: [
          { label: "JPMorgan's own release: Thu Jan 14, 2027, results about 6:45 AM ET, call 8:30 AM ET", next: "timing" },
          { label: "Oct 13, 2026, from StockAnalysis", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "That field still showed the last report. The company's release is the source for the next one, with its times.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      timing: {
        message:
          "SAMPLE: another company reports after the close on a Tuesday.\n\nWhich regular session reacts first?",
        outcome: "continue",
        choices: [
          { label: "Wednesday's, from the 9:30 AM ET open", next: "window" },
          { label: "Tuesday's", next: "wrong_timing" },
        ],
      },
      wrong_timing: {
        message:
          "After close means after 4:00 PM ET. Tuesday's regular session is over; the next one is Wednesday.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "timing",
      },
      window: {
        message:
          "JPMorgan's insider table shows six officers' proposed sales on Apr 15, 2026, the day after its Apr 14 report. A post calls it a sell signal.\n\nYour read?",
        outcome: "continue",
        choices: [
          { label: "The trading window opened after the report; check sizes and Form 4s before reading anything in", next: "cluster" },
          { label: "Six executives know something; sell", next: "wrong_window" },
        ],
      },
      wrong_window: {
        message:
          "Company policies usually open trading a day or two after a report, and senior officers are paid in stock. Sales bunched right then are routine.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "window",
      },
      cluster: {
        message:
          "SAMPLE tracker: at a small company, the CEO, CFO and a director show P - Purchase within two days; a fourth row is A - Award at $0.00.\n\nHow many rows count in the cluster?",
        outcome: "continue",
        choices: [
          { label: "Three: the P rows. The award is pay. Then open the Form 4s", next: "success" },
          { label: "Four: every row is an insider getting shares", next: "wrong_cluster" },
        ],
      },
      wrong_cluster: {
        message:
          "Only P is an open-market purchase with the insider's own money. An award at zero price is compensation.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "cluster",
      },
      success: {
        message:
          "Done. Dates from the company, times read as before open or after close, and tracker rows sorted by code, window and plan before anything else. Even a real cluster is a research lead, not a signal. Tools are credited, not endorsed.\n\nNext: Tool Training → Earnings dates and insiders and its Learn quiz.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default earningsInsidersTourSession;
