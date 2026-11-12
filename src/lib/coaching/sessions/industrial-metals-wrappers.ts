import type { CoachingSession } from "../types";

/** Copper, uranium and clean energy: trace the story to a channel (orders, contracts, supply, financing). */
export const industrialMetalsWrappersSession: CoachingSession = {
  meta: {
    slug: "industrial-metals-wrappers",
    title: "Copper, uranium and the transition",
    summary:
      "Test a transition story against the channels that reach prices: copper futures fund vs miners, uranium contracts vs spot, lithium's supply response, and what higher rates do to a solar project.",
    topic: "Market themes",
    tags: ["sample", "futures", "market-themes", "metals", "risk"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. A video says \"electrification means copper can only go up\".\n\nWhat is the better way to test that?",
        outcome: "continue",
        choices: [
          { label: "Check the channels: grid and construction orders, mine supply and disruptions, and how much new supply high prices bring", next: "copper" },
          { label: "Accept it; demand growth guarantees higher prices", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "The IEA notes lithium rose about eightfold in 2021–22 during the EV boom, then fell more than 80% from 2023 as supply surged. Demand is half the story.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      copper: {
        message:
          "You want copper-price exposure for a few months without company risk.\n\nCopper futures fund or a copper miner?",
        outcome: "continue",
        choices: [
          { label: "A copper futures fund like CPER, knowing it tracks rolled futures and pays any contango", next: "uranium" },
          { label: "A single copper miner; it is the same thing", next: "wrong_copper" },
        ],
      },
      wrong_copper: {
        message:
          "A miner adds operating leverage, by-products like gold, local politics and water risk. It is a business, not the metal.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "copper",
      },
      uranium: {
        message:
          "Spot uranium jumps 30%. A producer selling 80% of output at fixed contract prices rises only 4%.\n\nHow do you read that?",
        outcome: "continue",
        choices: [
          { label: "Normal: only about 20% of revenue reprices now (≈ +6%); EIA shows about 89% of 2024 U.S. purchases were long-term", next: "solar" },
          { label: "It must jump 30% soon to catch up", next: "wrong_uranium" },
        ],
      },
      wrong_uranium: {
        message:
          "Contracts reprice slowly, in both directions. There is no rule forcing a producer to match spot.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "uranium",
      },
      solar: {
        message:
          "Rates rise from 4% to 7%. A $100M, 20-year project loan goes from about $7.36M to $9.44M a year.\n\nWhat does that mean for a solar equipment maker?",
        outcome: "continue",
        choices: [
          { label: "Some projects may be delayed or cancelled, so orders and margins can suffer; rates are part of the thesis", next: "success" },
          { label: "Nothing; sunlight is free", next: "wrong_solar" },
        ],
      },
      wrong_solar: {
        message:
          "The fuel is free, but the project is mostly up-front capital. Financing cost is the main running cost.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "solar",
      },
      success: {
        message:
          "Session complete. Every transition story reaches prices through a channel: orders, contracts, supply, or financing. Name the channel before you buy.\n\nNext: Practice → Industrial and transition metals, and the cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default industrialMetalsWrappersSession;
