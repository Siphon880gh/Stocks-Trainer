/**
 * Market-theme simulations: SAMPLE tapes and tables opened from underlined phrases in a theme's driver cards
 * (`ThemeCard.rich`, built with `withSims`). Same shapes and checks as Tool Training (`simSetProblems`).
 * Every price and figure here is SAMPLE or simulated, made up to show a mechanism. Educational, not advice.
 */
import { simBar } from "../toolTraining/simWalk";
import type { ToolSimulation } from "../toolTraining/types";
import type { MarketThemeQuizGroupId } from "./types";

const ROLL: ToolSimulation = {
  kind: "columns",
  id: "mk-ew-roll",
  title: "Rolling a futures fund in contango",
  goal: "Step through five monthly rolls of a SAMPLE futures fund to see how a flat spot price can still leave the fund behind when later months cost more.",
  tape: "SAMPLE commodity futures fund · monthly rolls · simulated prices",
  start: 1,
  columns: ["", "Month 1", "Month 2", "Month 3", "Month 4", "Month 5"],
  rows: [
    ["Spot price", "50.00", "50.00", "50.00", "50.00", "50.00"],
    ["Expiring contract (sold)", "50.00", "50.00", "50.00", "50.00", "50.00"],
    ["Next contract (bought)", "50.50", "50.50", "50.50", "50.50", "50.50"],
    ["Roll cost", "1.0%", "1.0%", "1.0%", "1.0%", "1.0%"],
    ["Fund value (started at 100)", "99.0", "98.0", "97.0", "96.1", "95.1"],
  ],
  steps: [
    { col: 1, row: 1, what: "Month 1: the expiring contract has converged to the spot price of 50.00, and the fund sells it.", why: "Futures and spot meet at expiration, so the contract the fund holds ends up worth spot no matter where it was bought." },
    { col: 1, row: 2, what: "The fund buys next month's contract at 50.50, 1% above spot. That is contango.", why: "The same dollars buy fewer contracts. If spot stays put, the new contract drifts down toward 50.00 as it nears its own expiry." },
    { col: 2, row: 4, what: "Month 2: spot is still 50.00, but the fund is worth 98.0 after two rolls.", why: "This is the gap between the theme and the wrapper: someone watching spot sees no change while the fund holder is down 2%." },
    { col: 3, row: 3, what: "Month 3: the roll costs another 1.0% because the curve has the same shape.", why: "Roll cost depends on the curve, not on your view of the commodity. Check the curve before you assume a fund tracks spot." },
    { col: 4, row: 0, what: "Month 4: spot has not moved at all over the whole window.", why: "A flat chart of the commodity can hide a steady loss in a futures fund, which is why the fund's own chart is the one to read." },
    { col: 5, row: 4, what: "Month 5: the fund is at 95.1, about 4.9% below where it started, with spot unchanged.", why: "Small monthly costs compound. In backwardation the same table runs the other way and each roll adds a little." },
  ],
  takeaway: "In contango a futures fund can trail a flat spot price month after month; read the curve before the theme.",
};

const GAP: ToolSimulation = {
  kind: "bars",
  id: "mk-ew-gap",
  title: "A weekend move arrives as Monday's gap",
  goal: "Walk a SAMPLE spot bitcoin fund across a weekend to see why a product that trades only on exchange days can open far from Friday's close.",
  tape: "SAMPLE spot bitcoin fund · daily bars · simulated",
  start: 3,
  bars: [
    simBar("Wed", [40.2, 40.9, 39.8, 40.6], "A normal session: the fund tracks bitcoin while the exchange is open.", "While both trade at the same time, the fund and the coin move together within a small spread."),
    simBar("Thu", [40.6, 41.3, 40.3, 41.0], "Another steady day with a small range.", "Calm days set the expectation that the fund moves smoothly, which is exactly what the weekend can break."),
    simBar("Fri", [41.0, 41.4, 40.5, 40.8], "Friday closes at 40.80. The exchange shuts until Monday; bitcoin keeps trading.", "From here the coin can move for about 64 hours while the fund cannot trade at all.", { readout: "Fri close 40.80" }),
    simBar("Mon", [38.3, 38.9, 37.9, 38.6], "Monday opens at 38.30, about 6.1% below Friday's close, after bitcoin fell over the weekend.", "The whole weekend move lands at once. A stop at 40.00 would fill near 38.30, not at 40.00.", { mark: "news", readout: "Gap −6.1%" }),
    simBar("Tue", [38.6, 39.4, 38.2, 39.1], "The fund trades normally again, now from the lower level.", "After a gap, the useful question is where price is now relative to your plan, not where it was on Friday."),
    simBar("Wed", [39.1, 39.6, 38.7, 39.4], "A partial recovery, still well below Friday's close.", "Products on 24-hour assets carry gap risk every weekend and holiday; size them with that in mind."),
  ],
  takeaway: "When the underlying trades and the wrapper does not, the move arrives as an opening gap that stops cannot prevent.",
};

const RATE_GAP: ToolSimulation = {
  kind: "bars",
  id: "mk-cf-rate-gap",
  title: "A euro trust when U.S. rate expectations jump",
  goal: "Step through a SAMPLE euro currency trust around a Fed meeting to see how a wider rate gap between the U.S. and the euro area can pull the euro down.",
  tape: "SAMPLE euro currency trust · daily bars · simulated",
  start: 2,
  bars: [
    simBar("Day 1", [100.4, 100.8, 100.1, 100.6], "The trust drifts higher; the two-year rate gap (U.S. minus Germany) sits at 1.80 points.", "The gap is the readout to track: it shows how much more holding dollars pays than holding euros.", { readout: "Gap 1.80 pts" }),
    simBar("Day 2", [100.6, 100.9, 100.3, 100.5], "A quiet day before the meeting; the gap is unchanged.", "When expectations sit still, a currency pair often does too. The meeting is the scheduled test."),
    simBar("Day 3", [100.5, 100.7, 99.4, 99.6], "The Fed signals rates will stay higher for longer. The gap widens to 1.95 points and the trust drops.", "U.S. rates are now expected to rise relative to Europe's, so dollars pay more and the euro weakens against them.", { mark: "news", readout: "Gap 1.95 pts" }),
    simBar("Day 4", [99.6, 99.8, 99.0, 99.2], "Follow-through: the gap reaches 2.00 points and the trust slips again.", "Repricing often takes more than one day as forecasts and positions catch up with the new path."),
    simBar("Day 5", [99.2, 99.6, 98.9, 99.5], "The gap stops widening at 1.98 points and the trust steadies.", "When the readout stops moving, the pressure on the pair usually eases too."),
    simBar("Day 6", [99.5, 100.3, 99.4, 100.1], "European officials hint at a rate rise; the gap narrows to 1.85 points and the trust recovers.", "A rate gap has two sides. News from the other central bank can undo the move without anything changing in the U.S.", { mark: "news", readout: "Gap 1.85 pts" }),
  ],
  takeaway: "A currency trust follows the expected rate gap, and either central bank can move it.",
};

const REAL_YIELDS: ToolSimulation = {
  kind: "bars",
  id: "mk-pm-real-yields",
  title: "Gold and the 10-year real yield",
  goal: "Walk a SAMPLE gold trust week by week next to a simulated 10-year real yield to see when the link holds and when another driver takes over.",
  tape: "SAMPLE gold bullion trust · weekly bars · simulated real yield",
  start: 2,
  bars: [
    simBar("Week 1", [220.0, 222.5, 218.8, 221.6], "The trust closes at 221.60 with the 10-year real yield at 1.80%.", "Gold pays nothing, so the real yield is the income you give up to hold it. That is the first number to read beside it.", { readout: "Real 1.80%" }),
    simBar("Week 2", [221.6, 223.0, 219.5, 220.1], "The real yield edges up to 1.86% and the trust slips slightly.", "Small yield moves and small price moves: no clear signal yet, just the starting relationship."),
    simBar("Week 3", [220.1, 220.6, 214.9, 215.8], "A hot inflation print lifts real yields to 2.02% and the trust falls about 2%.", "This is the link working: holding gold just got more expensive in forgone interest, and the price adjusts.", { mark: "news", readout: "Real 2.02%" }),
    simBar("Week 4", [215.8, 216.9, 212.2, 213.0], "Real yields reach 2.10% and the trust slides again.", "When the driver keeps moving the same way, the metal often keeps adjusting. Two weeks agreeing is more telling than one."),
    simBar("Week 5", [213.0, 215.1, 212.0, 214.6], "Real yields stop rising and the trust steadies.", "A pause in the driver usually brings a pause in the price. Watch for the next change, not the last move."),
    simBar("Week 6", [214.6, 219.8, 214.1, 219.2], "Real yields stay near 2.09%, yet the trust jumps about 2% after a report of heavy central-bank buying.", "The link is strong in some years and weak in others. Official demand can lift gold even while real yields are high.", { mark: "news", readout: "Real 2.09%" }),
    simBar("Week 7", [219.2, 221.0, 217.9, 220.4], "The trust holds most of the gain with real yields still high.", "When price and the usual driver disagree, look for the other driver before calling the move wrong."),
  ],
  takeaway: "Read gold next to real yields, and when they disagree, look for official buying, the dollar or risk mood.",
};

const INVENTORY: ToolSimulation = {
  kind: "bars",
  id: "mk-en-inventory",
  title: "Crude around the Wednesday inventory report",
  goal: "Step through SAMPLE 15-minute bars of a crude oil fund around the 10:30 a.m. ET inventory report to see why the surprise against the estimate matters more than the raw number.",
  tape: "SAMPLE crude oil fund · 15-minute bars · simulated",
  start: 2,
  bars: [
    simBar("10:00", [72.1, 72.25, 71.95, 72.15], "A quiet half hour before the report.", "Traders wait for the number, so ranges shrink. A tight range before a release is normal, not a signal."),
    simBar("10:15", [72.15, 72.3, 72.05, 72.2], "The consensus expects a crude draw of about 1.0 million barrels.", "The estimate is the bar the report has to clear. Write it down before the release so you can judge the surprise.", { readout: "Est. draw 1.0M bbl" }),
    simBar("10:30", [72.2, 73.15, 72.1, 72.95], "The report shows a 4.2 million barrel draw, far bigger than expected, and the fund jumps.", "Less crude in storage than expected reads as tighter supply. The size of the miss explains the size of the bar.", { mark: "news", readout: "Draw 4.2M bbl" }),
    simBar("10:45", [72.95, 73.2, 72.7, 72.8], "The fund stalls as traders read the rest of the report.", "The headline is one line of a long table. Fuel stocks and refinery runs can tell a different story."),
    simBar("11:00", [72.8, 72.95, 72.4, 72.55], "Gasoline stocks rose 2.5 million barrels, more than expected, and part of the jump fades.", "Weak fuel demand can offset a crude draw. The details often decide whether the first move holds.", { readout: "Gasoline build 2.5M" }),
    simBar("11:15", [72.55, 72.75, 72.35, 72.6], "The fund settles about half of its first jump above the pre-report level.", "A report-day spike is a reaction, not a trend. Weekly reports matter most when several in a row agree."),
  ],
  takeaway: "Judge an inventory report against the estimate, then read the fuel lines before trusting the first move.",
};

const CRACK: ToolSimulation = {
  kind: "columns",
  id: "mk-en-crack",
  title: "The 3:2:1 crack spread, quarter by quarter",
  goal: "Walk a SAMPLE refiner's inputs and outputs across three quarters to see why rising crude can shrink a refiner's margin while fuel prices decide whether it recovers.",
  tape: "SAMPLE prices · simulated quarters · 42 gallons per barrel",
  start: 1,
  columns: ["", "Quarter A", "Quarter B", "Quarter C"],
  rows: [
    ["Crude ($/bbl)", "75.00", "85.00", "80.00"],
    ["Gasoline ($/gal)", "2.40", "2.55", "2.70"],
    ["Gasoline ($/bbl)", "100.80", "107.10", "113.40"],
    ["Diesel ($/gal)", "2.70", "2.85", "3.00"],
    ["Diesel ($/bbl)", "113.40", "119.70", "126.00"],
    ["3:2:1 crack ($/bbl)", "30.00", "26.30", "37.60"],
  ],
  steps: [
    { col: 1, row: 0, what: "Quarter A: crude costs $75.00 a barrel. Three barrels go in.", why: "Crude is the refiner's cost, not its product. A refiner is paid for the gap between what it buys and what it sells." },
    { col: 1, row: 2, what: "Gasoline at $2.40 a gallon is $100.80 a barrel (× 42). Two barrels come out as gasoline.", why: "Fuel prices are quoted per gallon and crude per barrel, so convert before comparing or the spread looks meaningless." },
    { col: 1, row: 5, what: "Crack spread: (2 × 100.80 + 113.40 − 3 × 75.00) ÷ 3 = $30.00 a barrel.", why: "This is the shorthand margin. It is the number that moves a refiner's earnings, more than the crude price on its own." },
    { col: 2, row: 0, what: "Quarter B: crude jumps $10 to $85.00 while fuels rise only about 15 cents a gallon.", why: "A headline that lifts crude can squeeze a refiner. Producers gain from the same move, which is why energy is not one trade." },
    { col: 2, row: 5, what: "The crack falls to $26.30 a barrel even though every price in the table went up.", why: "Rising prices are not rising margins. The spread, not the level, is what a refiner's stock tends to follow." },
    { col: 3, row: 5, what: "Quarter C: crude eases to $80.00 and fuels keep rising, so the crack widens to $37.60.", why: "Strong fuel demand with softer crude is the refiner's best case. Read both legs before deciding what an oil move means for one." },
  ],
  takeaway: "A refiner earns the crack spread, so read crude and fuel prices together rather than crude alone.",
};

const SUPPLY: ToolSimulation = {
  kind: "bars",
  id: "mk-im-supply",
  title: "A boom brings supply, then the bust",
  goal: "Walk a SAMPLE lithium producer quarter by quarter to see how high prices pull in new supply and why a price spike can carry the seeds of its own fall.",
  tape: "SAMPLE lithium producer · quarterly bars · simulated",
  start: 2,
  bars: [
    simBar("Q1", [20, 26, 19, 25], "Demand from battery makers rises faster than mines can deliver; the shares climb.", "A shortage lifts prices quickly because new mines take years. The first leg of a boom is usually a supply gap."),
    simBar("Q2", [25, 38, 24, 36], "The metal price keeps rising and the producer's profits jump with it.", "Producers have high fixed costs, so profit can rise much faster than the metal. That is operating leverage at work.", { readout: "Lithium price rising" }),
    simBar("Q3", [36, 52, 34, 50], "The stock peaks as six new projects are announced across the industry.", "High prices are the signal that brings supply. Count the announcements, not just the price.", { mark: "high", readout: "New projects: 6" }),
    simBar("Q4", [50, 51, 38, 40], "More projects are announced and the shares fall from the high.", "Markets look ahead to when the new output arrives. The stock can turn before the metal price does.", { readout: "New projects: 11" }),
    simBar("Q5", [40, 42, 27, 28], "New mines start producing; industry output is up 40% from a year ago and prices drop.", "The same leverage works in reverse: a falling price cuts profits faster than revenue.", { mark: "news", readout: "Output +40% y/y" }),
    simBar("Q6", [28, 30, 18, 19], "The shares hit a low as high-cost projects are delayed.", "Low prices shut supply the way high prices opened it. This is the bottom half of the cycle.", { mark: "low" }),
    simBar("Q7", [19, 23, 17, 21], "A small bounce as some supply leaves the market.", "Supply response takes time in both directions, which is why commodity producers move in long, sharp cycles."),
  ],
  takeaway: "In a commodity boom, watch new supply as closely as demand; high prices invite the output that ends them.",
};

const WASDE: ToolSimulation = {
  kind: "columns",
  id: "mk-ag-wasde",
  title: "Reading a WASDE surprise",
  goal: "Step through a SAMPLE corn balance sheet against last month and the trade's guess to see why the stocks-to-use ratio, not the headline crop, moves prices.",
  tape: "SAMPLE corn balance sheet · simulated figures, not USDA data",
  start: 1,
  columns: ["", "Last month", "Trade guess", "This report"],
  rows: [
    ["Production (bil. bu)", "15.10", "15.05", "14.90"],
    ["Total use (bil. bu)", "14.80", "14.80", "14.85"],
    ["Ending stocks (bil. bu)", "2.00", "1.95", "1.80"],
    ["Stocks-to-use", "13.5%", "13.2%", "12.1%"],
  ],
  steps: [
    { col: 1, row: 3, what: "Last month: 2.00 billion bushels left over against 14.80 billion used, a 13.5% stocks-to-use ratio.", why: "The ratio is the cushion: how much is left at the end of the season compared with what the world uses." },
    { col: 2, row: 2, what: "Before the report, analysts expect ending stocks to slip to 1.95 billion.", why: "Markets trade the surprise, so the guess, not last month, is the number the report is measured against." },
    { col: 3, row: 0, what: "The report cuts production to 14.90 billion bushels, below the guess of 15.05.", why: "A smaller crop shrinks the cushion from the supply side. This is the line weather headlines feed into." },
    { col: 3, row: 1, what: "Use is raised to 14.85 billion on stronger exports.", why: "Demand changes count as much as crop changes. Both sides of the table move the ratio." },
    { col: 3, row: 2, what: "Ending stocks come in at 1.80 billion, well below the 1.95 guess.", why: "This is the surprise: 150 million bushels less cushion than expected. Prices often jump on a miss of this size." },
    { col: 3, row: 3, what: "Stocks-to-use drops to 12.1%, against 13.2% expected.", why: "A lower ratio means less room for a bad harvest elsewhere. That is why it is the figure to read first." },
  ],
  takeaway: "Compare a WASDE to the trade's guess, and read the stocks-to-use ratio before the headline crop.",
};

const FEEDSTOCK: ToolSimulation = {
  kind: "columns",
  id: "mk-mc-feedstock",
  title: "Oil, gas and the U.S. cracker's edge",
  goal: "Walk three SAMPLE years of oil and gas prices to see how a U.S. ethane-based producer's cost edge widens when oil rises faster than gas, and narrows when gas catches up.",
  tape: "SAMPLE prices and costs · simulated years",
  start: 1,
  columns: ["", "Year 1", "Year 2", "Year 3"],
  rows: [
    ["Crude oil ($/bbl)", "70", "90", "80"],
    ["Natural gas ($/MMBtu)", "3.00", "3.20", "4.50"],
    ["Naphtha-based ethylene cost (¢/lb)", "40", "50", "45"],
    ["Ethane-based ethylene cost (¢/lb)", "22", "23", "28"],
    ["U.S. cost edge (¢/lb)", "18", "27", "17"],
  ],
  steps: [
    { col: 1, row: 4, what: "Year 1: the ethane-based maker's ethylene costs 18¢ a pound less than a naphtha-based rival's.", why: "Resin makers sell into one global market, so the cost gap between feedstocks is the margin story to watch." },
    { col: 2, row: 0, what: "Year 2: crude rises about 29%, from $70 to $90.", why: "Naphtha follows crude, so rivals who crack naphtha see their costs climb with oil." },
    { col: 2, row: 1, what: "Natural gas rises only about 7%.", why: "U.S. ethane follows gas, not oil. The two fuels often move at different speeds." },
    { col: 2, row: 4, what: "The U.S. edge widens to 27¢ a pound.", why: "When oil rises faster than gas, the U.S. producer's advantage grows. Plastics makers do not simply rise with oil." },
    { col: 3, row: 1, what: "Year 3: gas jumps to $4.50 while crude eases to $80.", why: "The edge depends on both prices. A gas spike can erase years of advantage without any change in demand." },
    { col: 3, row: 4, what: "The edge shrinks back to 17¢ a pound.", why: "Read the oil-to-gas relationship, not oil alone, when judging a U.S. chemical maker's margins." },
  ],
  takeaway: "A U.S. cracker's edge is the oil-to-gas gap; it widens when oil leads and narrows when gas catches up.",
};

const DURATION: ToolSimulation = {
  kind: "bars",
  id: "mk-br-duration",
  title: "Duration on a long Treasury fund",
  goal: "Step through a SAMPLE long Treasury fund with a duration of about 17 to see how each change in yields shows up in the price, roughly duration times the move.",
  tape: "SAMPLE long Treasury fund · weekly bars · duration ≈ 17 · simulated yields",
  start: 2,
  bars: [
    simBar("Week 1", [92.0, 92.8, 91.6, 92.4], "The fund closes at 92.40 with long yields at 4.40%.", "Start with the yield next to the price. For a bond fund, the yield is the driver and duration is the gear ratio.", { readout: "Long yield 4.40%" }),
    simBar("Week 2", [92.4, 92.9, 91.9, 92.2], "Yields barely move (4.41%) and neither does the fund.", "A one-hundredth of a point change times a duration of 17 is about 0.2%. Tiny yield moves mean tiny price moves."),
    simBar("Week 3", [92.2, 92.4, 88.1, 88.4], "Yields jump 0.24 points to 4.65% and the fund falls about 4.1%.", "17 × 0.24 ≈ 4.1%. Duration predicts the size of the drop; a short fund with a duration of 2 would lose about 0.5%.", { mark: "news", readout: "Long yield 4.65%" }),
    simBar("Week 4", [88.4, 89.0, 87.2, 87.6], "Yields add 0.05 points to 4.70% and the fund slips about 0.9%.", "The rule keeps working on small moves too, which is how to sanity-check a fund's stated duration."),
    simBar("Week 5", [87.6, 90.1, 87.4, 89.9], "Yields fall 0.15 points to 4.55% and the fund gains about 2.6%.", "Duration cuts both ways. The same sensitivity that hurt in week 3 helps when yields fall.", { readout: "Long yield 4.55%" }),
    simBar("Week 6", [89.9, 90.4, 89.3, 90.0], "A quiet week; the fund is still about 2.6% below week 1.", "A Treasury fund has no default risk to speak of, yet it can lose like a stock. Read duration before yield."),
  ],
  takeaway: "A bond fund moves about its duration times the change in yields, in the opposite direction.",
};

const FED_CUT: ToolSimulation = {
  kind: "columns",
  id: "mk-br-fed-cut",
  title: "The Fed cuts, and long yields rise",
  goal: "Walk a SAMPLE Treasury curve from the week before a rate cut to a month after to see why the short end follows the Fed while long yields can rise anyway.",
  tape: "SAMPLE Treasury yields · simulated dates",
  start: 1,
  columns: ["", "Week before", "Cut day", "One month later"],
  rows: [
    ["Fed funds target", "5.25–5.50%", "4.75–5.00%", "4.75–5.00%"],
    ["2-year yield", "4.70%", "4.55%", "4.40%"],
    ["10-year yield", "4.20%", "4.15%", "4.45%"],
    ["30-year yield", "4.40%", "4.38%", "4.70%"],
    ["10-year minus 2-year", "−0.50", "−0.40", "+0.05"],
  ],
  steps: [
    { col: 1, row: 0, what: "The week before: the policy rate is 5.25–5.50%.", why: "The policy rate anchors bills and short notes. It is the starting point for reading the rest of the curve." },
    { col: 1, row: 1, what: "The 2-year yield is already 4.70%, well below the policy rate.", why: "Short yields price the expected path of the Fed, so much of a widely expected cut is in the 2-year before it happens." },
    { col: 2, row: 1, what: "Cut day: the Fed cuts half a point and the 2-year falls to 4.55%.", why: "The short end moves with the decision and the guidance. This is the part of the curve the Fed controls most directly." },
    { col: 2, row: 2, what: "The 10-year barely moves, to 4.15%.", why: "Long yields also price inflation, growth, borrowing and a term premium. The cut is only one input." },
    { col: 3, row: 2, what: "A month later the 10-year is at 4.45%, 0.30 points above cut day.", why: "Strong data or worries about inflation and deficits can lift long yields even while the Fed is cutting." },
    { col: 3, row: 4, what: "The 10-year minus 2-year spread turns positive, at +0.05.", why: "The curve steepened. A long bond fund lost money through a cutting cycle, which is why the theme alone is not enough." },
  ],
  takeaway: "The Fed moves the short end; long yields answer to inflation, growth and supply, and can rise after a cut.",
};

const UTILITIES: ToolSimulation = {
  kind: "bars",
  id: "mk-sr-rates",
  title: "Utilities when yields climb",
  goal: "Walk a SAMPLE utilities sector fund week by week next to a simulated 10-year yield to see why rate-sensitive sectors often fall when yields rise.",
  tape: "SAMPLE utilities sector fund · weekly bars · simulated 10-year yield",
  start: 2,
  bars: [
    simBar("Week 1", [70.0, 70.9, 69.6, 70.6], "The fund rises with the 10-year yield at 4.00%.", "Utilities pay steady dividends and borrow heavily, so the Treasury yield is the competing income to read beside them.", { readout: "10y 4.00%" }),
    simBar("Week 2", [70.6, 71.2, 70.1, 70.4], "Yields edge up to 4.05% and the fund is flat.", "A small yield change rarely moves a sector much. The pattern matters when the move is large or persistent."),
    simBar("Week 3", [70.4, 70.6, 68.2, 68.5], "Yields jump to 4.25% and the fund drops about 2.7%.", "Bonds now pay more for the same safety, and the sector's borrowing costs look higher. Income buyers rotate.", { mark: "news", readout: "10y 4.25%" }),
    simBar("Week 4", [68.5, 68.9, 67.0, 67.3], "Yields reach 4.38% and the fund slides again.", "Same driver, same direction. Banks, which can earn more on a steeper curve, may rise in the same week."),
    simBar("Week 5", [67.3, 68.0, 66.8, 67.8], "Yields stop rising (4.36%) and the fund steadies.", "When the driver pauses, the pressure eases. That is the moment to check whether the link is still the main story."),
    simBar("Week 6", [67.8, 69.9, 67.6, 69.6], "Yields fall to 4.18% and the fund recovers most of week 3's loss.", "The sector was trading the rate, not its own business. Knowing that keeps you from reading a rate move as company news.", { readout: "10y 4.18%" }),
  ],
  takeaway: "Rate-sensitive sectors often trade the 10-year yield; read it beside the fund before calling a move.",
};

const WEIGHTS: ToolSimulation = {
  kind: "columns",
  id: "mk-is-weights",
  title: "Cap weight vs equal weight over one year",
  goal: "Step through a SAMPLE five-company index to see how cap weighting lets one winner drive the result and grow its weight, while equal weighting spreads it out.",
  tape: "SAMPLE five-company index · simulated one-year returns",
  start: 1,
  columns: ["Company", "Start weight", "Year return", "Cap contribution", "End weight", "Equal-weight contribution"],
  rows: [
    ["SAMPLE A", "50%", "+40%", "+20.0 pts", "58.3%", "+8.0 pts"],
    ["SAMPLE B", "20%", "+5%", "+1.0 pts", "17.5%", "+1.0 pts"],
    ["SAMPLE C", "15%", "−10%", "−1.5 pts", "11.3%", "−2.0 pts"],
    ["SAMPLE D", "10%", "0%", "0.0 pts", "8.3%", "0.0 pts"],
    ["SAMPLE E", "5%", "+10%", "+0.5 pts", "4.6%", "+2.0 pts"],
    ["Index", "100%", "—", "+20.0%", "100%", "+9.0%"],
  ],
  steps: [
    { col: 1, row: 0, what: "SAMPLE A is half the index by market value at the start of the year.", why: "Cap weighting counts companies by size, so one giant can matter more than the other four combined." },
    { col: 2, row: 0, what: "A returns 40% over the year; C loses 10%.", why: "Individual returns are the raw material. What reaches the index depends on the weights they are multiplied by." },
    { col: 3, row: 5, what: "The cap-weighted index returns 20%, and A alone supplied all 20 points net.", why: "This is concentration: the index result is mostly one company's result. Check the top holdings before calling a fund diversified." },
    { col: 4, row: 0, what: "A's weight grows from 50% to 58.3% without any trading.", why: "Cap weighting lets winners grow their weight, so concentration rises after a strong run. That is the hidden drift to watch." },
    { col: 5, row: 0, what: "In an equal-weight version, each company is 20%, so A contributes 8 points.", why: "Equal weighting caps any one company's influence, which is a different bet, not a free improvement." },
    { col: 5, row: 5, what: "The equal-weight index returns 9%, less than half the cap-weighted 20%.", why: "Neither rule wins every year. Knowing the rule tells you what you actually own and why two 'market' funds differ." },
  ],
  takeaway: "Cap weighting lets winners drive the index and grow their weight; equal weighting spreads the result out.",
};

/** Simulations per theme. Each theme's driver or bridge cards carry the underlined triggers. */
export const THEME_SIMS: Partial<Record<MarketThemeQuizGroupId, ToolSimulation[]>> = {
  "exposure-wrappers": [ROLL, GAP],
  "currency-funds": [RATE_GAP],
  "precious-metals": [REAL_YIELDS],
  energy: [INVENTORY, CRACK],
  "industrial-metals": [SUPPLY],
  agriculture: [WASDE],
  "materials-chemicals": [FEEDSTOCK],
  "bonds-rates": [DURATION, FED_CUT],
  "sectors-rotation": [UTILITIES],
  "index-style": [WEIGHTS],
};
