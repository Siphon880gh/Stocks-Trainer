import type { CoachingSession } from "../types";

/** Bonds: read duration before yield, match money with a date to a maturity, and keep a ladder on schedule. */
export const bondsDurationSession: CoachingSession = {
  meta: {
    slug: "bonds-duration",
    title: "Duration before yield",
    summary:
      "Treasury funds from bills to 20+ years: use duration to size a rate move, separate the Fed's short rate from long yields, match money with a date to a maturity, and keep a bond ladder on schedule.",
    topic: "Market themes",
    tags: ["sample", "market-themes", "bonds", "rates"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. A friend says \"Treasury funds are safe, so it doesn't matter which one I use for savings\".\n\nWhat is the better frame?",
        outcome: "continue",
        choices: [
          { label: "Treasuries carry little credit risk, but their prices move with rates; duration says how much", next: "duration" },
          { label: "Treasury funds cannot lose value", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "SEC Investor.gov: the government guarantees interest and principal at maturity, not the market price if you sell early. Every fixed-rate bond has interest rate risk.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      duration: {
        message:
          "TLT's effective duration was about 14.8 years (iShares, Nov 10, 2026). Long yields rise 0.5 percentage point.\n\nRoughly what happens to TLT?",
        outcome: "continue",
        choices: [
          { label: "About −7.4%: duration × change in yield, opposite direction (FINRA's rule of thumb)", next: "fed" },
          { label: "About −0.5%", next: "wrong_duration" },
        ],
      },
      wrong_duration: {
        message:
          "14.83 × 0.5 ≈ 7.4, and prices move opposite to yields. Long funds swing like stocks when rates move.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "duration",
      },
      fed: {
        message:
          "The Fed cuts its policy rate, but the 10-year yield rises the same week.\n\nHow can that happen?",
        outcome: "continue",
        choices: [
          { label: "The Fed sets a short rate; long yields also price inflation, growth, borrowing and a term premium", next: "date" },
          { label: "It cannot; long yields always follow the Fed", next: "wrong_fed" },
        ],
      },
      wrong_fed: {
        message:
          "Bills and short notes track the policy rate closely. Long yields are set by buyers and sellers looking years ahead, and an expected cut is often already priced in.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "fed",
      },
      date: {
        message:
          "You need a down payment in six months.\n\nWhich fits?",
        outcome: "continue",
        choices: [
          { label: "Treasury bills or a 0–3 month bill fund: near-zero duration, maturities that fit the date", next: "ladder" },
          { label: "A 20+ year Treasury fund for the higher yield", next: "wrong_date" },
        ],
      },
      wrong_date: {
        message:
          "A one-point rise in long yields would cost about 15% just when you need the money.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "date",
      },
      ladder: {
        message:
          "You run a five-year Treasury ladder. A rung matures, and yields are lower than when you started.\n\nWhat does the plan say?",
        outcome: "continue",
        choices: [
          { label: "Reinvest it in a new five-year Treasury; the other rungs keep the older, higher yields", next: "success" },
          { label: "Hold cash until rates go back up", next: "wrong_ladder" },
        ],
      },
      wrong_ladder: {
        message:
          "Waiting turns the ladder into a rate forecast. Vanguard: reinvest the matured bond at the far end to keep the ladder.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "ladder",
      },
      success: {
        message:
          "Session complete. Read duration before yield, ask which yields moved, match dated money to a maturity, and let a ladder run on its schedule. Fund names are examples, not recommendations.\n\nNext: Practice → Bonds and rates, the Treasury ladder Playbook, and the cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default bondsDurationSession;
