import type { CoachingSession } from "../types";

/** Sectors: read the holdings, count the overlap, and treat business-cycle rotation as a small, written tilt. */
export const sectorsCycleSession: CoachingSession = {
  meta: {
    slug: "sectors-cycle",
    title: "Sector funds and the cycle",
    summary:
      "The 11 sectors and their funds: read what a sector fund holds, add up overlap with an index fund, place REITs correctly, and weigh business-cycle rotation against how late the cycle is known.",
    topic: "Market themes",
    tags: ["sample", "market-themes", "equities", "sectors"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. You own a broad S&P 500 fund. A friend says \"add the tech sector fund to diversify\".\n\nWhat is the better frame?",
        outcome: "continue",
        choices: [
          { label: "A sector fund concentrates: the index fund already owns the same tech companies", next: "holdings" },
          { label: "More funds always means more diversification", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "FINRA's example of concentration risk is exactly this: tech stocks, plus a tech fund, plus an index fund that also holds tech.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      holdings: {
        message:
          "State Street's XLK file (Nov 11, 2026): Apple 16.2%, Nvidia 13.1%, Microsoft 12.1%.\n\nWhat does that tell you?",
        outcome: "continue",
        choices: [
          { label: "About 41% sits in three companies; one headline about them moves the whole fund", next: "reit" },
          { label: "The fund is evenly spread across tech", next: "wrong_holdings" },
        ],
      },
      wrong_holdings: {
        message:
          "Sector funds weight by company size. 16.2 + 13.1 + 12.1 ≈ 41.4%.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "holdings",
      },
      reit: {
        message:
          "You want property exposure and look at a mortgage REIT.\n\nWhere does GICS put it?",
        outcome: "continue",
        choices: [
          { label: "Financials; equity REITs that own properties are in Real Estate", next: "cycle" },
          { label: "Real Estate, with all other REITs", next: "wrong_reit" },
        ],
      },
      wrong_reit: {
        message:
          "S&P DJI: Financials includes mortgage REITs; Real Estate holds equity REITs and real estate companies. A mortgage REIT is a lender, not a landlord.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "reit",
      },
      cycle: {
        message:
          "NBER announces a recession that began eight months ago. A newsletter says \"rotate everything into staples now\".\n\nWhat do you weigh?",
        outcome: "continue",
        choices: [
          { label: "NBER dates turning points late, and studies find rotation's edge is small even with perfect foresight; keep any tilt small and planned", next: "success" },
          { label: "Rotate everything; the pattern always works", next: "wrong_cycle" },
        ],
      },
      wrong_cycle: {
        message:
          "Fidelity itself says no investment has behaved the same in every cycle. Stangl, Jacobsen and Visaltanachoti found at best about 2.3% a year with perfect foresight and no costs since 1948.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "cycle",
      },
      success: {
        message:
          "Session complete. Read holdings, add up overlap, place REITs correctly, and treat the cycle as a guide to expectations, not a timing signal. Funds named are examples, not recommendations.\n\nNext: Practice → Sectors and rotation, the business-cycle tilt Playbook, and the cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default sectorsCycleSession;
