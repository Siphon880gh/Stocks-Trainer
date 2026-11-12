/**
 * Macro lesson simulations: SAMPLE tapes and tables opened from underlined phrases in a lesson's "Call the reaction"
 * paragraph (`MacroLesson.reactionRich`, built with `reactionWithSims`). Same shapes and checks as Tool Training.
 * Every price, yield and release figure here is SAMPLE or simulated; none is a real print. Educational, not advice.
 */
import { simBar, toolTextPlain } from "../toolTraining/simWalk";
import type { ToolSimulation, ToolText } from "../toolTraining/types";

/** `...reactionWithSims([...])` sets the plain `reaction` and the `reactionRich` runs from one source. */
export function reactionWithSims(rich: ToolText): { reaction: string; reactionRich: ToolText } {
  return { reaction: toolTextPlain(rich), reactionRich: rich };
}

const PAYROLLS: ToolSimulation = {
  kind: "bars",
  id: "mac-payrolls-2y",
  title: "The 2-year yield in the minutes after a jobs report",
  goal: "Step through SAMPLE 5-minute bars of the 2-year Treasury yield around an 8:30 a.m. ET jobs report to see why it moves first, and how revisions and wages can pull it back.",
  tape: "SAMPLE 2-year Treasury yield (%) · 5-minute bars · simulated · a rising bar means yields rose",
  start: 2,
  bars: [
    simBar("8:20", [4.5, 4.51, 4.49, 4.5], "The 2-year yield idles at 4.50% before the release.", "Pre-release calm is normal. Note the level so you can measure the reaction against it, not against yesterday."),
    simBar("8:25", [4.5, 4.51, 4.49, 4.51], "Consensus expects payrolls of +180,000.", "The surprise is actual minus this estimate. Without the estimate you cannot tell whether a number is strong.", { readout: "Est. +180k" }),
    simBar("8:30", [4.51, 4.62, 4.51, 4.6], "Payrolls print +275,000, far above the estimate, and the 2-year jumps about 9 basis points.", "The 2-year tracks the expected Fed path, so strong jobs that might delay cuts reach it before stocks finish reacting.", { mark: "news", readout: "Payrolls +275k" }),
    simBar("8:35", [4.6, 4.63, 4.57, 4.58], "Traders find the two prior months revised down by a combined 60,000.", "Revisions change the trend. A strong month on top of weaker history is less impressive than the headline alone.", { readout: "Revisions −60k" }),
    simBar("8:40", [4.58, 4.59, 4.52, 4.53], "Average hourly earnings rose only 0.1%, softer than expected, and the yield gives back more.", "Wages are the inflation part of the report. Soft pay can overrule a hot headline because the Fed cares about price pressure.", { readout: "Wages +0.1% m/m" }),
    simBar("8:45", [4.53, 4.56, 4.52, 4.55], "The yield settles near 4.55%, about half its first jump.", "The first spike is the headline; where it settles after the details is the market's fuller reading of the report."),
    simBar("8:50", [4.55, 4.57, 4.54, 4.56], "Trading calms with the 2-year still higher on the day.", "Now the stock reaction is easier to read: it follows this settled yield move and the regime, not the first headline."),
  ],
  takeaway: "Read the 2-year first after a jobs report, then let revisions and wages tell you how much of the jump to trust.",
};

const CPI: ToolSimulation = {
  kind: "bars",
  id: "mac-cpi-hot",
  title: "A growth-stock fund on a hot core CPI day",
  goal: "Walk a SAMPLE growth-stock index fund through the days around a hot core CPI print, with a simulated 2-year yield beside it, to see how inflation news reaches long-duration stocks.",
  tape: "SAMPLE growth-stock index fund · daily bars · simulated 2-year yield",
  start: 2,
  bars: [
    simBar("Mon", [400.0, 403.5, 398.9, 402.8], "A firm day for the fund with the 2-year yield at 4.40%.", "Read the yield beside a growth fund. Its value leans on profits far in the future, which higher rates discount harder.", { readout: "2y 4.40%" }),
    simBar("Tue", [402.8, 404.1, 401.2, 403.0], "The day before CPI. Consensus expects core prices up 0.3% on the month.", "Markets have priced the estimate already. Only the gap between actual and expected can move them tomorrow.", { readout: "Est. core +0.3%" }),
    simBar("Wed", [397.0, 398.5, 391.8, 393.2], "Core CPI rises 0.4%. The 2-year jumps to 4.52% and the fund opens about 1.5% lower.", "Hot core inflation pushes out expected rate cuts, lifting short yields and pressing on long-duration stocks.", { mark: "news", readout: "Core +0.4% · 2y 4.52%" }),
    simBar("Thu", [393.2, 396.0, 392.1, 395.1], "A partial bounce as the 2-year eases to 4.50%.", "The day after a big release is a test. A bounce with yields still high is not yet a reversal of the story."),
    simBar("Fri", [395.1, 395.9, 390.4, 391.0], "The 2-year climbs to 4.55% and the fund makes a new low for the week.", "Follow-through in yields brings follow-through in the fund. The yield, not the headline, is the thread to follow.", { readout: "2y 4.55%" }),
    simBar("Mon", [391.0, 394.8, 390.6, 394.2], "Yields ease to 4.48% and the fund steadies.", "When the driver relaxes, pressure on rate-sensitive stocks usually does too. In a growth scare, hot CPI can read differently.", { readout: "2y 4.48%" }),
  ],
  takeaway: "Hot core CPI tends to reach growth stocks through the 2-year yield; follow the yield to judge the move.",
};

const ISM: ToolSimulation = {
  kind: "bars",
  id: "mac-ism-whipsaw",
  title: "A PMI headline and its sub-indexes pulling apart",
  goal: "Step through SAMPLE 5-minute bars of a stock index fund around a 10:00 a.m. ET PMI release to see how a good headline and a worrying sub-index can whipsaw the market.",
  tape: "SAMPLE stock index fund · 5-minute bars · simulated",
  start: 2,
  bars: [
    simBar("9:50", [500.0, 500.4, 499.7, 500.2], "The fund drifts in a narrow range before the release.", "Ten minutes before a release, ranges shrink. Note the level so the reaction has a clear starting point."),
    simBar("9:55", [500.2, 500.5, 499.9, 500.1], "Consensus expects the PMI at 49.5, just under the 50 line.", "Below 50 means contraction, above means expansion. The estimate tells you which side the market expects.", { readout: "Est. 49.5" }),
    simBar("10:00", [500.1, 502.0, 500.0, 501.6], "The PMI prints 50.3, back above 50, and the fund pops.", "Crossing 50 makes headlines and fast buyers react to it first, before anyone reads the details.", { mark: "news", readout: "PMI 50.3" }),
    simBar("10:05", [501.6, 501.8, 499.6, 499.9], "The prices-paid sub-index jumps to 61.0 and the pop reverses.", "Busy factories with rising input costs can mean more inflation, which can push rate cuts further out.", { readout: "Prices paid 61.0" }),
    simBar("10:10", [499.9, 500.6, 499.0, 500.4], "New orders came in at 48.1, still contracting, and the fund chops.", "Mixed details pull in both directions: activity better, orders weak, prices hot. That mix is what makes a whipsaw.", { readout: "New orders 48.1" }),
    simBar("10:15", [500.4, 500.9, 500.0, 500.3], "The fund ends the half hour almost where it started.", "A round trip like this says the market read the report as mixed. Chasing the first bar would have meant buying the top."),
  ],
  takeaway: "A PMI headline crossing 50 gets the first move; the sub-indexes decide whether it lasts.",
};

const FOMC: ToolSimulation = {
  kind: "columns",
  id: "mac-fomc-pricing",
  title: "The same cut, read against pricing",
  goal: "Walk a SAMPLE Fed meeting from the day before to the next close to see why a fully priced cut can still move markets once the guidance changes what is priced next.",
  tape: "SAMPLE meeting · simulated pricing, yields and index levels",
  start: 1,
  columns: ["", "Day before", "2:00 p.m. statement", "2:30 p.m. press conference", "Next day close"],
  rows: [
    ["This meeting", "0.25 cut priced at 95%", "0.25 cut announced", "—", "—"],
    ["Cuts priced for the next year", "1.00 pts", "0.90 pts", "0.65 pts", "0.70 pts"],
    ["2-year yield", "4.20%", "4.24%", "4.34%", "4.32%"],
    ["SAMPLE stock index", "100.0", "100.1", "98.9", "99.2"],
  ],
  steps: [
    { col: 1, row: 0, what: "The day before, futures price a quarter-point cut as 95% likely.", why: "Pricing is the benchmark. A decision only surprises relative to what futures already expected." },
    { col: 2, row: 0, what: "At 2:00 p.m. the Fed cuts a quarter point, exactly as priced.", why: "A fully priced decision carries almost no news, so the decision line itself should not move markets much." },
    { col: 2, row: 3, what: "The index barely moves, from 100.0 to 100.1.", why: "This is the 'tends to move little' part. If you only watched the decision, you would think the day was over." },
    { col: 3, row: 1, what: "In the press conference the chair sounds cautious about more cuts; next-year pricing falls from 0.90 to 0.65 points.", why: "The surprise moved from this meeting to the path. Guidance changes what is priced next, which is real news." },
    { col: 3, row: 2, what: "The 2-year yield rises to 4.34% and the index drops to 98.9.", why: "Fewer expected cuts lift short yields and weigh on stocks, even though the Fed just cut. Read the path, not the action." },
    { col: 4, row: 2, what: "By the next close the 2-year is at 4.32% and the index at 99.2, holding most of the move.", why: "A reaction that survives the next session is the market's settled view of the meeting, not a press-conference blip." },
  ],
  takeaway: "Judge a Fed decision against pricing, then watch how the guidance changes the expected path.",
};

const CURVE: ToolSimulation = {
  kind: "columns",
  id: "mac-curve-bear-flat",
  title: "Bear flattening after hot data",
  goal: "Step through a SAMPLE Treasury curve before and after a hot inflation print to see why short yields rise more than long ones and what that does to the spread.",
  tape: "SAMPLE Treasury yields · simulated release day",
  start: 1,
  columns: ["", "Before the print", "After hot CPI", "Change (pts)"],
  rows: [
    ["3-month bill", "5.30%", "5.31%", "+0.01"],
    ["2-year", "4.60%", "4.75%", "+0.15"],
    ["10-year", "4.20%", "4.25%", "+0.05"],
    ["10-year minus 2-year", "−0.40", "−0.50", "−0.10"],
  ],
  steps: [
    { col: 1, row: 1, what: "Before the print the 2-year sits at 4.60%.", why: "The 2-year is the market's best guess at policy over the next two years, so it reacts most to Fed-relevant data." },
    { col: 1, row: 3, what: "The curve is inverted: the 10-year is 0.40 points below the 2-year.", why: "The spread is how the curve's shape is tracked. Its change, not just its level, is what the lesson names." },
    { col: 2, row: 1, what: "After hot CPI the 2-year jumps to 4.75%.", why: "Hot inflation means fewer or later cuts, and that hits the maturities closest to the Fed's next moves." },
    { col: 2, row: 2, what: "The 10-year rises only to 4.25%.", why: "Long yields also price growth and term premium over a decade; one hot month moves them less." },
    { col: 3, row: 3, what: "The spread falls by 0.10 points to −0.50.", why: "Yields up (bear) and the curve flatter: bear flattening. Expected cuts do the mirror image, the 2-year falling faster." },
    { col: 3, row: 0, what: "The 3-month bill barely moves, +0.01.", why: "Bills are pinned to the current policy rate, which only changes at meetings. The action is a little further out the curve." },
  ],
  takeaway: "Hot data usually lifts the 2-year more than the 10-year; the shrinking spread is bear flattening.",
};

const MORTGAGE: ToolSimulation = {
  kind: "columns",
  id: "mac-mortgage-lag",
  title: "The weekly mortgage survey reports last week's move",
  goal: "Walk a SAMPLE week of the 10-year yield, lender quotes and the Thursday survey to see why the survey rarely moves markets: it averages rates that already moved.",
  tape: "SAMPLE week · simulated yields, quotes and fund prices",
  start: 1,
  columns: ["", "Mon", "Tue", "Wed", "Thu (survey out)", "Next Mon"],
  rows: [
    ["10-year yield", "4.20%", "4.32%", "4.35%", "4.30%", "4.28%"],
    ["Lender quotes, 30-year (avg)", "6.70%", "6.82%", "6.85%", "6.80%", "6.78%"],
    ["Weekly survey, 30-year", "—", "—", "—", "6.79%", "—"],
    ["SAMPLE homebuilder fund", "50.0", "48.9", "48.6", "49.0", "49.2"],
  ],
  steps: [
    { col: 1, row: 0, what: "Monday: the 10-year yield is 4.20% and lender quotes average 6.70%.", why: "Mortgage rates are priced off longer Treasury yields plus a spread, so the 10-year is the number to watch first." },
    { col: 2, row: 0, what: "Tuesday: strong data lifts the 10-year 0.12 points to 4.32%.", why: "This is the market-moving news for housing this week. Everything below follows from it." },
    { col: 2, row: 3, what: "The homebuilder fund drops from 50.0 to 48.9 the same day.", why: "Builders react to the yield move right away, two days before any mortgage survey is published." },
    { col: 3, row: 1, what: "Wednesday: lender quotes catch up to 6.85%.", why: "Lenders reprice as yields move. Quotes are the live version of what the survey will later summarize." },
    { col: 4, row: 2, what: "Thursday the survey prints 6.79%, an average of the rates lenders quoted earlier in the week.", why: "The survey reports where rates already went. By the time it is out, the yield has even eased." },
    { col: 4, row: 3, what: "The builder fund rises to 49.0 on survey day, following the softer yield, not the survey.", why: "When a release only confirms known moves, prices follow the live driver. That is why this survey is low impact." },
  ],
  takeaway: "The weekly mortgage survey summarizes moves the 10-year already made; follow the yield for the news.",
};

/** Simulations per macro lesson id; each lesson's reaction paragraph carries the underlined trigger. */
export const MACRO_SIMS: Record<string, ToolSimulation[]> = {
  "employment-situation": [PAYROLLS],
  cpi: [CPI],
  "ism-pmi": [ISM],
  "fomc-decision": [FOMC],
  "treasury-curve": [CURVE],
  "mortgage-rates": [MORTGAGE],
};
