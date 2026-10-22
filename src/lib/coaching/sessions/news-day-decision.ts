import type { CoachingSession } from "../types";

/** SIMULATED news day with bias checkpoints: recency, FOMO, confirmation and loss aversion. */
export const newsDayDecisionSession: CoachingSession = {
  meta: {
    slug: "news-day-decision",
    title: "A news-day decision",
    summary:
      "A SIMULATED morning of headlines. At each checkpoint, name the bias pulling at you and pick the plan-first move.",
    topic: "News & biases",
    tags: ["news", "bias", "options", "risk", "simulated"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SIMULATED: before the open, a trade-policy headline sends index futures down 1.5%. The last three similar headlines all led to lower closes.\n\nWhat do you do first?",
        outcome: "continue",
        choices: [
          { label: "Buy puts at the open: it has gone down every time", next: "wrong_recency" },
          { label: "Wait for the open and check what would make me act, with a stop and size", next: "chase" },
        ],
      },
      wrong_recency: {
        message:
          "That is recency bias: three recent cases treated as a rule. Headlines can flip fast; a policy pause can send the market sharply the other way.\n\nBack to the first step.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      chase: {
        message:
          "9:45 AM ET: a stock on your list is up 12% on a partnership rumour. Your feed is full of screenshots of gains.\n\nCheckpoint: what is pulling at you, and what is the move?",
        outcome: "continue",
        choices: [
          { label: "FOMO. Check the original source; only enter with a written entry, stop and size, or pass", next: "evidence" },
          { label: "Momentum. Buy now before it runs further", next: "wrong_fomo" },
        ],
      },
      wrong_fomo: {
        message: "Buying because others are winning is FOMO. A rumour in a feed is not a source.\n\nBack to the checkpoint.",
        outcome: "wrong",
        choices: [],
        rewind_to: "chase",
      },
      evidence: {
        message:
          "You found a company statement: talks are 'early stage'. You still like the idea.\n\nCheckpoint: what do you read next?",
        outcome: "continue",
        choices: [
          { label: "The strongest case against the trade, and what would prove me wrong", next: "exits" },
          { label: "More bullish posts to build conviction", next: "wrong_confirm" },
        ],
      },
      wrong_confirm: {
        message: "Reading only what agrees with you is confirmation bias.\n\nBack to the checkpoint.",
        outcome: "wrong",
        choices: [],
        rewind_to: "evidence",
      },
      exits: {
        message:
          "You take a small position. How do you set the exits?",
        outcome: "continue",
        choices: [
          { label: "An OCO: a target (sell limit) and a stop placed together, so one cancels the other", next: "denial" },
          { label: "No orders yet; I'll watch and decide", next: "wrong_watch" },
        ],
      },
      wrong_watch: {
        message: "On a news day, decisions made under pressure are the weakest ones. Set both exits now.\n\nBack to the exits.",
        outcome: "wrong",
        choices: [],
        rewind_to: "exits",
      },
      denial: {
        message:
          "11:30 AM ET: the company denies the rumour. The stock drops and your stop fills; the target order cancels.\n\nCheckpoint: how do you feel about it, and what next?",
        outcome: "continue",
        choices: [
          { label: "The plan worked: a planned, small loss. No revenge trade", next: "success" },
          { label: "Buy it back now to get to even", next: "wrong_loss" },
        ],
      },
      wrong_loss: {
        message: "Chasing to get back to even is loss aversion. The stop did its job.\n\nBack to the checkpoint.",
        outcome: "wrong",
        choices: [],
        rewind_to: "denial",
      },
      success: {
        message:
          "Session complete. You named recency, FOMO, confirmation bias and loss aversion, checked the source, and let an OCO enforce the plan.\n\nNext: Learn → Misc Practices → News, biases & short-term options.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default newsDayDecisionSession;
