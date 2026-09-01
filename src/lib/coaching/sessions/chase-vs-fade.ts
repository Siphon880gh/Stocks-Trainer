import type { CoachingSession } from "../types";

/**
 * Sample E11 session — equities headline decision thinking (chase vs fade).
 * ≥2 wrong branches + ≥1 success path. SAMPLE/educational only.
 */
export const chaseVsFadeSession: CoachingSession = {
  meta: {
    slug: "chase-vs-fade",
    title: "Chase vs fade a company headline",
    summary:
      "Walk a SAMPLE equities headline: size the move, pick a stance, and recover from common chase mistakes.",
    topic: "Company news decisions",
    tags: ["equities", "company-news", "chase-vs-fade", "beginner"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE setup: a mid-cap equity gaps +4% on a product rumor (not a filing).\n\nFirst: how do you frame the tape before picking buy / sell / hold?",
        outcome: "continue",
        choices: [
          {
            label: "Treat the gap as confirmed news and chase strength",
            next: "wrong_chase_confirmed",
          },
          {
            label: "Separate rumor vs filing, then ask if the move is already priced",
            next: "priced_in",
          },
          {
            label: "Ignore the headline and trade only the overnight candle shape",
            next: "wrong_ignore_headline",
          },
        ],
      },
      wrong_chase_confirmed: {
        message:
          "That treats an unverified rumor like a filing. You skipped source humility and paid the open for a story that can reverse.\n\nReturn to the first framing choice.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_ignore_headline: {
        message:
          "Candle shape alone drops the catalyst context this drill teaches. Headlines still matter for chase-vs-fade reasoning—even on SAMPLE data.\n\nReturn to the framing step.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      priced_in: {
        message:
          "Good: rumor ≠ filing. The gap already embeds a lot of optimism.\n\nWhat stance fits a process-first response?",
        outcome: "continue",
        choices: [
          {
            label: "Buy the open to not miss the rest of the move",
            next: "wrong_buy_open",
          },
          {
            label: "Fade the gap unless a filing confirms, or hold for clarity",
            next: "horizon",
          },
          {
            label: "Short immediately because all gaps fail",
            next: "wrong_blind_short",
          },
        ],
      },
      wrong_buy_open: {
        message:
          "Buying the open after a rumor gap is classic chase: you pay for priced-in optimism with no confirmation.\n\nRevisit the stance choice.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced_in",
      },
      wrong_blind_short: {
        message:
          "Blind shorts on every gap skip short literacy (held until later) and ignore that some rumors escalate into filings.\n\nRevisit the stance choice—fade or hold for clarity is the process answer here.",
        outcome: "wrong",
        choices: [],
        rewind_to: "priced_in",
      },
      horizon: {
        message:
          "You chose fade-or-hold for clarity. Last check: which horizon matches that thesis?",
        outcome: "continue",
        choices: [
          {
            label: "Intraday scalp only — abandon if no fade in 5 minutes",
            next: "wrong_horizon_mismatch",
          },
          {
            label: "Hold/fade with room for a confirmation window (hours to a session)",
            next: "success",
          },
        ],
      },
      wrong_horizon_mismatch: {
        message:
          "A 5-minute abandon clock mismatches a rumor-vs-filing thesis. Process credit needs a confirmation window, not a panic timer.\n\nReturn to the horizon decision.",
        outcome: "wrong",
        choices: [],
        rewind_to: "horizon",
      },
      success: {
        message:
          "Session complete. You framed rumor vs filing, avoided chasing a priced-in gap, and matched horizon to the thesis.\n\nApply the same process in Cases → company-news (SAMPLE decide-and-reveal).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default chaseVsFadeSession;
