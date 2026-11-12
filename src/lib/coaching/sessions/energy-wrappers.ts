import type { CoachingSession } from "../types";

/** Oil and gas views: which business earns from the move, futures fund vs stocks, weather and storage theses. */
export const energyWrappersSession: CoachingSession = {
  meta: {
    slug: "energy-wrappers",
    title: "Oil and gas, which wrapper",
    summary:
      "Match an oil or gas view to the business that earns from it: producer, refiner, LNG exporter, integrated major or futures fund. Read the crack spread, the storage report and a futures fund's objective before you buy.",
    topic: "Market themes",
    tags: ["sample", "futures", "market-themes", "energy", "risk"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. You expect a producer group's supply cut to lift crude by several dollars over the next quarter.\n\nWhich business earns most directly from that?",
        outcome: "continue",
        choices: [
          { label: "An oil producer (upstream): its revenue rises with crude while costs stay roughly put", next: "refiner" },
          { label: "A refiner: it handles the most oil", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "A refiner buys crude. If fuel prices lag, its crack spread narrows. With gasoline at $2.40, diesel at $2.70 and crude rising from $75 to $80, EIA's 3:2:1 spread falls from $30 to $25 a barrel.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      refiner: {
        message:
          "Your friend still wants an oil futures fund for the same view, held for five years.\n\nWhat should you check first?",
        outcome: "continue",
        choices: [
          { label: "Its objective and the curve: it tracks rolled near-month futures, so contango can drain it over years", next: "gas" },
          { label: "Nothing: an oil fund equals the oil price", next: "wrong_refiner" },
        ],
      },
      wrong_refiner: {
        message:
          "USO and UNG hold futures. UNG's own objective is daily changes in the near-month Henry Hub contract; after long contango stretches it did a 1-for-4 reverse split in January 2024.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "refiner",
      },
      gas: {
        message:
          "Now gas. Storage is about 5% above the five-year average and the winter outlook turns mild.\n\nWhat does that usually mean for gas prices?",
        outcome: "continue",
        choices: [
          { label: "Downward pressure: EIA lists storage and winter weather among the main gas drivers", next: "lng" },
          { label: "Upward: more gas in storage means more demand", next: "wrong_gas" },
        ],
      },
      wrong_gas: {
        message:
          "Ample storage cushions demand, and a mild winter lowers heating use. Storage usually builds April–October and draws November–March.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "gas",
      },
      lng: {
        message:
          "An LNG exporter barely moved while gas fell 8%.\n\nWhy might that be?",
        outcome: "continue",
        choices: [
          { label: "Long-term contracts with fixed fees can tie its earnings more to volumes than to spot gas; I would check its filings", next: "success" },
          { label: "The market has not noticed yet; it must fall 8% too", next: "wrong_lng" },
        ],
      },
      wrong_lng: {
        message:
          "Different businesses have different exposures. An exporter selling contracted capacity is not a gas producer.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "lng",
      },
      success: {
        message:
          "Session complete. Name the business that earns from the move, read the wrapper's objective, and keep the thesis (supply, weather, storage) in view.\n\nNext: Practice → Energy, and the energy cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default energyWrappersSession;
