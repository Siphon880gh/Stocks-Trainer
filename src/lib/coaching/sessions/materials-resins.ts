import type { CoachingSession } from "../types";

/** Resin makers: spread, feedstock, capacity, and whether XLB even holds them. */
export const materialsResinsSession: CoachingSession = {
  meta: {
    slug: "materials-resins",
    title: "Resin makers and the spread",
    summary:
      "Test the idea that plastics makers rise with oil: read the spread between resin and feedstock, the U.S. ethane edge over naphtha, the capacity cycle, and what the materials sector fund actually holds.",
    topic: "Market themes",
    tags: ["sample", "market-themes", "materials", "chemicals"],
  },
  tree: {
    start: "start",
    nodes: {
      start: {
        message:
          "SAMPLE hypothetical. A friend says \"plastics are made from oil, so buy plastics makers when oil goes up\".\n\nWhat is the better frame?",
        outcome: "continue",
        choices: [
          { label: "A resin maker earns a spread: resin prices minus feedstock and energy costs, shaped by demand and capacity", next: "feedstock" },
          { label: "Plastics makers track the oil price one-for-one", next: "wrong_start" },
        ],
      },
      wrong_start: {
        message:
          "If feedstock costs rise and resin prices do not, the spread shrinks. Oil can hurt a resin maker as easily as help it.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "start",
      },
      feedstock: {
        message:
          "Oil jumps while U.S. natural gas stays cheap.\n\nWhich producers gain a cost edge?",
        outcome: "continue",
        choices: [
          { label: "U.S. ethane crackers: ethane follows gas, and it yields more than 80% ethylene vs as little as 30% from naphtha (EIA)", next: "capacity" },
          { label: "Naphtha crackers in Europe and Asia", next: "wrong_feedstock" },
        ],
      },
      wrong_feedstock: {
        message:
          "Naphtha is oil-derived, so its cost rises with crude. U.S. ethane is tied to natural gas.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "feedstock",
      },
      capacity: {
        message:
          "Industry capacity rises from 100 to 110 units with demand flat at 90.\n\nWhat happens to the operating rate, and why does it matter?",
        outcome: "continue",
        choices: [
          { label: "90% → about 82%; spare capacity usually means price competition and thinner spreads", next: "fund" },
          { label: "It rises, so prices go up", next: "wrong_capacity" },
        ],
      },
      wrong_capacity: {
        message:
          "90 ÷ 110 ≈ 81.8%. More plants chasing the same demand push resin prices down.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "capacity",
      },
      fund: {
        message:
          "You plan to use XLB for a resin recovery view.\n\nWhat should you check?",
        outcome: "continue",
        choices: [
          { label: "Its holdings: as of Nov 2026 Linde was about 13%, Dow about 3.5%, LyondellBasell about 2.4%, and Westlake and Eastman were not held", next: "success" },
          { label: "Nothing; materials means resins", next: "wrong_fund" },
        ],
      },
      wrong_fund: {
        message:
          "XLB holds S&P 500 materials companies: industrial gases, miners, aggregates, paints, packaging and some chemicals. Resin makers are a small slice.\n\nTry again.",
        outcome: "wrong",
        choices: [],
        rewind_to: "fund",
      },
      success: {
        message:
          "Session complete. Resin makers earn a spread set by feedstock, demand and capacity, and a sector fund may barely hold them. These tickers are examples, not recommendations.\n\nNext: Practice → Materials, chemicals and resins, and the cases in Cases → Market-wide news.",
        outcome: "success",
        choices: [],
      },
    },
  },
};

export default materialsResinsSession;
