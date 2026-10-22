import type { CoachingSession } from "../types";

/** SIMULATED weekly-call chase: size for zero, plan the exit, and remember who you never hear from. */
export const chasingASqueezeSession: CoachingSession = {
  meta: {
    slug: "chasing-a-squeeze",
    title: "Chasing a squeeze",
    summary:
      "A SIMULATED stock rips on heavy call buying. Decide what the flow does and does not tell you, how much to risk, and when to get out.",
    topic: "Options risk",
    tags: ["options", "squeeze", "chase", "risk", "simulated"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SIMULATED: a stock is up 7% by mid-morning on no company news. A scanner shows call volume about ten times normal in Friday's out-of-the-money strikes. Posts say a squeeze is starting.\n\nWhat does the call volume tell you?",
        outcome: "continue",
        choices: [
          { label: "Dealers are short those calls, so they must buy the stock", next: "wrong_must" },
          { label: "Someone is trading those calls heavily; not who is on which side or why", next: "size" },
          { label: "Insiders know news is coming", next: "wrong_insider" },
        ],
      },
      wrong_must: {
        message:
          "Dealers' books mix long and short options and they choose how to hedge. Hedging can push dealers to buy, but it is not automatic.\n\nGo back to what the volume tells you.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      wrong_insider: {
        message: "Volume does not reveal intent. Treat unusual activity as a question, not a tip.\n\nGo back.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      size: {
        message:
          "You decide you may take a small swing at it. The calls cost 8 cents a share ($8 a contract) and expire tomorrow.\n\nHow do you size it?",
        outcome: "continue",
        choices: [
          { label: "Assume the premium goes to zero: risk only an amount I can lose in full", next: "exit" },
          { label: "Go big: moves like this are rare", next: "wrong_big" },
        ],
      },
      wrong_big: {
        message: "Weekly out-of-the-money calls often expire worthless. Size for that outcome.\n\nBack to sizing.",
        outcome: "wrong",
        choices: [],
        rewind_to: "size",
      },
      exit: {
        message:
          "By early afternoon the stock is through the strike and the calls are worth many times what you paid. Call volume is starting to fade.\n\nWhat now?",
        outcome: "continue",
        choices: [
          { label: "Take the planned exit; let any small remainder ride with a stop", next: "story" },
          { label: "Hold to expiry: squeezes always finish higher", next: "wrong_hold" },
        ],
      },
      wrong_hold: {
        message:
          "When call buying fades, the hedging that helped the move can unwind, and a call expiring tomorrow has almost no time to recover. In the stall version of this day the calls end worthless.\n\nBack to the exit.",
        outcome: "wrong",
        choices: [],
        rewind_to: "exit",
      },
      story: {
        message:
          "Later you read a post: a trader turned $200 into about $5,000 on a day like this.\n\nWhat is the right lesson?",
        outcome: "continue",
        choices: [
          { label: "Weekly calls are a reliable way to grow a small account", next: "wrong_reliable" },
          { label: "Survivorship bias: the wins get posted, the many worthless tickets do not", next: "success" },
        ],
      },
      wrong_reliable: {
        message: "One win says little about the odds. Ask how many tried.\n\nBack to the lesson.",
        outcome: "wrong",
        choices: [],
        rewind_to: "story",
      },
      success: {
        message:
          "Session complete. You read flow as a question, sized for zero, took the planned exit and named survivorship bias.\n\nNext: Learn → Misc Practices → Gamma squeeze case (SIMULATED).",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default chasingASqueezeSession;
