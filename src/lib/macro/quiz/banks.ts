/**
 * MF7 Learn quiz banks: macro-releases, rates-curve, fed-policy, housing-mortgage, macro-reactions.
 * Numbers in prompts and options are computed from the SIMULATED world / releases, never hand-typed;
 * macroQuiz.test.ts recomputes numeric answers independently from raw fields.
 * Educational; hedged; not trading advice.
 */
import type { QuizOption, QuizQuestion } from "../../quizData";
import type { MacroExhibit } from "./exhibit";
import { MACRO_QUIZ_GROUP_IDS, MACRO_QUIZ_GROUP_META, type MacroQuizGroupId } from "./groups";
import { getRelease } from "../releases";
import { WORLD, monthLabel } from "../world";
import { pctChange, round1, round2 } from "../consistency";
import { curveRow, housingTable, pmmsCards, payrollRevisionSentence } from "../viewData";
import { dotsFor, expectedMoveBp, meetingByMonth, pricingFor, priorSepMedianSameYear } from "../fed";
import { reactionForEvent, INSTRUMENT_NAMES } from "../reactions";
import { intradayChart } from "../reactionCharts";
import type { Instrument } from "../types";

type Letter = "A" | "B" | "C" | "D";
const LETTERS: Letter[] = ["A", "B", "C", "D"];
interface Choice {
  label: string;
  description?: string;
  feedback?: string;
}
export type MacroQuizQuestion = QuizQuestion;

const ch = (label: string, feedback?: string, description = ""): Choice => ({ label, description, feedback });

function mc(id: string, prompt: string, at: Letter, right: Choice, wrong: Choice[], explanation: string, extra: { exhibit?: MacroExhibit; glossary?: string } = {}): MacroQuizQuestion {
  const ordered = [...wrong];
  ordered.splice(LETTERS.indexOf(at), 0, right);
  const options: QuizOption[] = ordered.map((c, i) => ({ id: LETTERS[i]!, label: c.label, description: c.description ?? "", feedback: c.feedback }));
  return { id, prompt, correctAnswer: at, options, explanation, glossaryTermId: extra.glossary, macroExhibit: extra.exhibit };
}

const ev = (id: string) => {
  const e = getRelease(id);
  if (!e) throw new Error(`macro quiz: missing event ${id}`);
  return e;
};
const signedK = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(n).toLocaleString("en-US")}k`;
const p1 = (n: number) => `${n < 0 ? "−" : ""}${Math.abs(n).toFixed(1)}%`;
const p2 = (n: number) => `${n.toFixed(2)}%`;
const bp = (n: number) => `${n > 0 ? "+" : n < 0 ? "−" : ""}${Math.abs(Math.round(n))} bp`;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString("en-US")}`;

/** Numeric answers: question id → correct option label, recomputed independently by the tests. */
export const MACRO_NUMERIC: Record<string, string> = {};
const numeric = (q: MacroQuizQuestion) => {
  MACRO_NUMERIC[q.id] = q.options.find((o) => o.id === q.correctAnswer)!.label;
  return q;
};

// ---------------- macro-releases ----------------
const pay3 = ev("payrolls-03");
const pay2 = ev("payrolls-02");
const rev2 = payrollRevisionSentence(pay2.month);
const hhM = WORLD.months[pay2.month]!.household;
const urCalc = round1((hhM.unemployed / hhM.laborForce) * 100);
const lfprCalc = round1((hhM.laborForce / hhM.population) * 100);
const cpiM = ev("cpi-17").month;
const cpiNow = WORLD.months[cpiM]!.prices.all;
const cpiPrev = WORLD.months[cpiM - 1]!.prices.all;
const cpiMoM = pctChange(cpiNow, cpiPrev);
const cl = ev("claims-11");
const clWeeks = [0, 1, 2, 3].map((k) => WORLD.weeks[cl.week! - k]!.initialClaims);
const clAvg = Math.round(clWeeks.reduce((a, b) => a + b, 0) / 4);
const gdpQ = WORLD.quarters[ev("gdp-24").quarter!]!;
const gdpSum = round1(Object.values(gdpQ.contributions).reduce((a, b) => a + b, 0));
const ism = ev("ism-mfg-29");
const ismPrior = ism.headline.prior!;
const zPay = round1(pay2.headline.surprise / pay2.headline.stdev);

export const MACRO_RELEASES_QUESTIONS: MacroQuizQuestion[] = [
  mc("MR-01", `${pay3.period} jobs report: payrolls beat consensus, but the unemployment rate rose and wages missed. How did the market most likely read it?`, "B",
    ch("Weaker than expected — the details won"),
    [ch("Stronger than expected — the headline always wins", "Headlines drive the first seconds; traders then weigh unemployment and wages, which pointed the other way."), ch("No information — jobs reports never move markets", "The jobs report is often the biggest scheduled release of the month."), ch("Only revisions matter", "Revisions matter, but here the household and wage details reversed the read.")],
    "Traders read the whole report. A payroll beat with a rising unemployment rate and soft wages is usually read as a cooler labor market overall — and in an inflation-worried market that can push yields down.",
    { exhibit: { kind: "release", eventId: pay3.id }, glossary: "household-vs-establishment" }),
  numeric(mc("MR-02", `In the ${pay2.period} report the prior month (${rev2.m1.label}) was revised from ${signedK(rev2.m1.from)} to ${signedK(rev2.m1.to)}, and the month before (${rev2.m2.label}) from ${signedK(rev2.m2.from)} to ${signedK(rev2.m2.to)}. What is the combined revision?`, "C",
    ch(signedK(rev2.combined)),
    [ch(signedK(rev2.m1.to - rev2.m1.from), "That is only the first month's revision."), ch(signedK(rev2.m1.to + rev2.m2.to), "That adds the revised levels, not the changes."), ch(signedK(rev2.combined === 0 ? 10 : -rev2.combined), "Check the sign: revised minus previously reported.")],
    "Each revision is the new estimate minus the previous one; add the two months. A big downward combined revision can offset a strong headline.",
    { exhibit: { kind: "release", eventId: pay2.id }, glossary: "data-revision" })),
  numeric(mc("MR-03", `Household survey, ${monthLabel(pay2.month)} (simulated): labor force ${hhM.laborForce.toLocaleString("en-US")}k, unemployed ${hhM.unemployed.toLocaleString("en-US")}k, population ${hhM.population.toLocaleString("en-US")}k. What is the unemployment rate?`, "A",
    ch(p1(urCalc)),
    [ch(p1(round1((hhM.unemployed / hhM.population) * 100)), "Divide by the labor force, not the whole population."), ch(p1(round1((hhM.unemployed / hhM.employed) * 100)), "Divide by the labor force (employed + unemployed), not just the employed."), ch(p1(round1(100 - urCalc)), "That is the employed share of the labor force.")],
    "Unemployment rate = unemployed ÷ labor force × 100. People not looking for work are outside the labor force.", { glossary: "unemployment-rate" })),
  numeric(mc("MR-04", `Same month: labor force ${hhM.laborForce.toLocaleString("en-US")}k, population ${hhM.population.toLocaleString("en-US")}k. What is the participation rate?`, "D",
    ch(p1(lfprCalc)),
    [ch(p1(round1((hhM.employed / hhM.population) * 100)), "That is the employment-to-population ratio."), ch(p1(round1(100 - lfprCalc)), "That is the share outside the labor force."), ch(p1(urCalc), "That is the unemployment rate.")],
    "Participation = labor force ÷ population × 100. Rising participation can lift the unemployment rate even when hiring is healthy.", { glossary: "participation-rate" })),
  numeric(mc("MR-05", `Simulated CPI index levels: ${monthLabel(cpiM - 1)} ${cpiPrev.toFixed(3)}, ${monthLabel(cpiM)} ${cpiNow.toFixed(3)}. What is the month-over-month change (one decimal)?`, "B",
    ch(p1(cpiMoM)),
    [ch(p1(round1(cpiNow - cpiPrev)), "That is the index-point change, not the percent change."), ch(p1(round1(cpiMoM * 12)), "That annualizes the monthly change."), ch(p1(round1(cpiMoM / 10)), "Percent change = (new ÷ old − 1) × 100.")],
    "Percent change = (new index ÷ old index − 1) × 100, rounded to one decimal — the same way the official table rounds.", { glossary: "cpi" })),
  mc("MR-06", "On CPI morning, which number do traders usually compare with consensus first?", "C",
    ch("Core CPI, month over month"),
    [ch("The index level", "Levels are not forecast; changes are."), ch("The 12-month headline rate only", "The 12-month rate matters, but it moves slowly and much of it is known."), ch("Food prices", "Food and energy are volatile, which is why core strips them out.")],
    "Core month-over-month is the cleanest read of underlying inflation for the latest month; 0.1 point vs consensus can move yields when inflation is the market's focus.", { glossary: "core-inflation" }),
  mc("MR-07", `${ev("cpi-16").period}: headline CPI came in hot, core came in cool. What is the likely market read?`, "A",
    ch("Cooler — core outweighs an energy-driven headline"),
    [ch("Hotter — headline always wins", "Energy swings make headline noisy; core usually decides."), ch("Ignore it — CPI never matters", "CPI has been one of the most market-moving releases in inflation-focused periods."), ch("Only the dollar moves", "Yields and stocks usually react too.")],
    "When headline and core disagree, markets usually trade core. The first 5-minute bar may follow the headline before reversing.", { exhibit: { kind: "release", eventId: "cpi-16" }, glossary: "core-inflation" }),
  numeric(mc("MR-08", `Initial claims for the four weeks to ${WORLD.weeks[cl.week!]!.label}: ${clWeeks.map((v) => v.toLocaleString("en-US")).reverse().join(", ")}. What is the 4-week moving average?`, "D",
    ch(clAvg.toLocaleString("en-US")),
    [ch(clWeeks[0]!.toLocaleString("en-US"), "That is just the latest week."), ch(Math.round((clWeeks[0]! + clWeeks[1]!) / 2).toLocaleString("en-US"), "That averages two weeks."), ch(Math.max(...clWeeks).toLocaleString("en-US"), "That is the highest week.")],
    "Average the four latest weeks. The moving average smooths holiday and weather noise, so it is the trend line traders watch.", { glossary: "initial-jobless-claims" })),
  numeric(mc("MR-09", `${gdpQ.label} GDP contributions (percentage points): consumption ${gdpQ.contributions.consumption}, investment ${gdpQ.contributions.investment}, government ${gdpQ.contributions.government}, net exports ${gdpQ.contributions.netExports}. What is headline growth (annual rate)?`, "B",
    ch(p1(gdpSum)),
    [ch(p1(gdpQ.contributions.consumption), "That is consumption's share only."), ch(p1(round1(gdpSum / 4)), "Contributions already add to the annualized rate."), ch(p1(round1(gdpSum * 4)), "Contributions are already at an annual rate — do not multiply by four.")],
    "Contributions add up to the headline (to rounding). Watch which piece drove it: a jump in net exports or inventories is less durable than consumer spending.", { glossary: "gdp" })),
  mc("MR-10", `${ism.period}: the manufacturing PMI was ${ism.headline.actual.toFixed(1)} after ${ismPrior.toFixed(1)}. What does that say?`, "C",
    ch(ism.headline.actual < ismPrior ? "Contracting, at a faster rate" : "Contracting, at a slower rate"),
    [ch("Growing, because it is above 40", "50 is the dividing line, not 40."), ch(ism.headline.actual < ismPrior ? "Contracting, at a slower rate" : "Contracting, at a faster rate", "Compare with last month: further below 50 means faster contraction."), ch("Prices are falling", "The headline is about activity; prices have their own index.")],
    "A diffusion index below 50 means more firms report decline than growth; further below 50 means the decline is more widespread.", { glossary: "diffusion-index" }),
  mc("MR-11", "Why do traders often read the retail-sales 'control group' rather than the headline?", "A",
    ch("It excludes volatile items and feeds the GDP consumption estimate"),
    [ch("It is adjusted for inflation", "Retail sales are nominal, including the control group."), ch("It only counts online sales", "It excludes autos, gas, building materials and food services."), ch("It is released a week earlier", "It comes out in the same report.")],
    "The control group strips out autos, gasoline, building materials and food services, which makes it a cleaner input to the consumption part of GDP.", { glossary: "retail-sales" }),
  mc("MR-12", "Why are PCE inflation surprises usually smaller than CPI surprises?", "D",
    ch("CPI and PPI come out first, so forecasters can estimate most of PCE"),
    [ch("PCE is not used by the Fed", "The Fed's 2% goal is defined in PCE terms."), ch("PCE is only annual", "It is monthly."), ch("PCE excludes services", "It covers goods and services.")],
    "By the time PCE is released, much of its input data is known from CPI and PPI, so the consensus is usually close. A miss still matters if it shifts the expected Fed path.", { glossary: "pce-inflation" }),
  mc("MR-13", "In JOLTS, why do analysts watch the quits rate?", "B",
    ch("Workers quit more when confident of better pay, so it hints at wage pressure"),
    [ch("It measures layoffs", "Layoffs are a separate line."), ch("It is the unemployment rate", "That comes from the household survey."), ch("It counts job openings", "Openings are a separate line.")],
    "A high quits rate suggests a tight labor market and wage pressure; a falling one suggests workers feel less confident.", { glossary: "quits-rate" }),
  numeric(mc("MR-14", `${pay2.period}: payrolls ${signedK(pay2.headline.actual)} vs ${signedK(pay2.headline.consensus)} consensus. If the usual forecast miss is ${pay2.headline.stdev}k, how big was the surprise in "sigmas"?`, "C",
    ch(`${zPay > 0 ? "+" : ""}${zPay.toFixed(1)}σ`),
    [ch(`${(pay2.headline.surprise / 100).toFixed(1)}σ`, "Divide by the usual miss, not by 100."), ch(`${(pay2.headline.actual / pay2.headline.stdev).toFixed(1)}σ`, "Use the surprise (actual − consensus), not the actual."), ch("0.0σ", "It was well outside the consensus.")],
    "Surprise ÷ typical forecast miss gives a z-score. Above about 1σ is a meaningful surprise; markets react to the surprise, not the level.", { glossary: "macro-surprise" })),
  mc("MR-15", "In a consumer-sentiment report, which line is most likely to move bond yields?", "A",
    ch("Year-ahead inflation expectations"),
    [ch("The overall sentiment index level", "Levels rarely move markets much."), ch("Current conditions", "Usually low impact."), ch("The number of survey respondents", "Not market-relevant.")],
    "A central bank watches whether households expect high inflation to persist, so an inflation-expectations jump can move bonds even when the headline index does not.", { glossary: "inflation-expectations" }),
];

// ---------------- rates-curve ----------------
const cDay = 300;
const cr = curveRow(cDay);
const sprd = Math.round((cr.values[6]! - cr.values[4]!) * 100);
const rDay = 150;
const dRec = WORLD.days[rDay]!;
const realCalc = round2(dRec.y10 - dRec.breakeven);

export const RATES_CURVE_QUESTIONS: MacroQuizQuestion[] = [
  numeric(mc("RC-01", `Simulated curve on ${cr.label}: 2-year ${cr.values[4]!.toFixed(2)}%, 10-year ${cr.values[6]!.toFixed(2)}%. What is the 2s10s spread?`, "B",
    ch(bp(sprd)),
    [ch(bp(-sprd), "Spread = 10-year minus 2-year."), ch(bp(cr.values[6]! * 100 - 400), "Subtract the 2-year yield."), ch(bp(Math.round(cr.values[7]! * 100 - cr.values[4]! * 100)), "That uses the 30-year.")],
    "2s10s = 10-year minus 2-year, in basis points. Negative means the curve is inverted.", { exhibit: { kind: "curve", day: cDay }, glossary: "yield-curve" })),
  mc("RC-02", "The 2-year yield is above the 10-year yield. What is that called?", "A",
    ch("An inverted yield curve"),
    [ch("A steep curve", "Steep means long yields well above short."), ch("A term premium", "Term premium is extra yield for holding long bonds."), ch("A breakeven", "Breakeven is nominal minus TIPS yield.")],
    "Inversion has preceded many US recessions, but with long and variable lags; it is not a timing tool.", { glossary: "curve-inversion" }),
  mc("RC-03", "Hot core CPI in an inflation-worried market. Which yield usually moves the most?", "C",
    ch("The 2-year"),
    [ch("The 30-year", "Long yields usually move less on Fed-path news."), ch("They all move exactly the same", "Short yields reprice the Fed path fastest."), ch("None — yields ignore CPI", "CPI surprises often move yields noticeably.")],
    "The 2-year tracks expected Fed policy over the next two years, so it usually reprices most on inflation and jobs surprises (bear flattening).", { glossary: "two-year-yield" }),
  mc("RC-04", "If the 10-year Treasury yield rises, what happens to the price of an existing 10-year bond?", "D",
    ch("It falls"),
    [ch("It rises", "Prices and yields move in opposite directions."), ch("No change", "The fixed coupon is worth less when new bonds pay more."), ch("It doubles", "Moves are much smaller than that.")],
    "A bond's fixed payments are worth less when new bonds offer higher yields, so prices fall as yields rise.", { glossary: "treasury-yield" }),
  numeric(mc("RC-05", `Simulated ${dRec.label}: 10-year nominal yield ${dRec.y10.toFixed(2)}%, 10-year breakeven inflation ${dRec.breakeven.toFixed(2)}%. What is the approximate 10-year real yield?`, "B",
    ch(p2(realCalc)),
    [ch(p2(round2(dRec.y10 + dRec.breakeven)), "Real = nominal − expected inflation."), ch(p2(dRec.breakeven), "That is the breakeven itself."), ch(p2(round2(dRec.y10 / dRec.breakeven)), "Subtract, don't divide.")],
    "Real yield ≈ nominal yield − breakeven inflation. Rising real yields have tended to pressure long-duration growth stocks.", { glossary: "real-yield" })),
  mc("RC-06", "Breakeven inflation rises sharply after a hot CPI. What does it suggest?", "A",
    ch("Markets expect inflation to stay higher for longer"),
    [ch("The Fed will certainly cut", "Higher expected inflation usually makes cuts less likely."), ch("Bond prices will rise", "Higher inflation expectations usually push nominal yields up."), ch("Nothing — breakevens are fixed", "They change daily with prices.")],
    "Breakeven = nominal minus inflation-protected yield; it rises when markets price more future inflation (plus risk premia).", { glossary: "breakeven-inflation" }),
  mc("RC-07", "Markets suddenly price more Fed cuts: the 2-year falls 15 bp, the 10-year falls 5 bp. What is that move called?", "C",
    ch("A bull steepener"),
    [ch("A bear flattener", "Bear = yields up; flattener = short end up more."), ch("An inversion", "The curve steepened."), ch("A term premium shock", "That would hit long yields most.")],
    "Bull = yields falling (prices up). Steepener = the short end falls more than the long end, typical when cuts get priced.", { glossary: "bull-bear-steepener" }),
  mc("RC-08", "Strong jobs data in an overheating economy: the 2-year rises 12 bp, the 10-year rises 6 bp. What is that move called?", "B",
    ch("A bear flattener"),
    [ch("A bull steepener", "Yields rose, so it is 'bear'; the short end rose more, so it is a flattener."), ch("A re-steepening", "The gap narrowed."), ch("A breakeven", "Different concept.")],
    "Bear = yields up. Flattener = the short end rises more, typical when markets price more hikes.", { glossary: "bull-bear-steepener" }),
  mc("RC-09", "Hot US data lifts US yields relative to other countries. What usually happens to the dollar?", "A",
    ch("It tends to strengthen"),
    [ch("It tends to weaken", "Higher relative yields usually attract capital."), ch("It is fixed", "The dollar floats."), ch("It only moves at month-end", "It reacts within minutes on release days.")],
    "On release days the dollar usually moves with the 2-year yield.", { glossary: "us-dollar-index" }),
  mc("RC-10", "What is the best description of an inverted curve as a recession signal?", "D",
    ch("It has preceded many recessions, but with long, variable lags — not a timing tool"),
    [ch("A recession always starts within one month", "Lags have varied widely."), ch("It has never preceded a recession", "It has preceded many."), ch("It means stocks must fall immediately", "Stocks have sometimes risen for long stretches during inversions.")],
    "Hedged history: inversion has preceded many US recessions, often by a year or more, and has given false or early signals.", { glossary: "curve-inversion" }),
  mc("RC-11", "Long yields rise even though expected Fed policy is unchanged, because investors demand more to hold long bonds. What is that extra yield called?", "B",
    ch("Term premium"),
    [ch("Breakeven", "Breakeven is about expected inflation."), ch("Dot plot", "That is the Fed's projection chart."), ch("Basis", "Not this concept.")],
    "The term premium compensates for holding long bonds instead of rolling short ones; it can rise with deficits, supply or uncertainty.", { glossary: "term-premium" }),
  numeric(mc("RC-12", "The 10-year yield moves from 4.20% to 4.35%. How big is the move?", "C",
    ch(bp(15)),
    [ch(bp(1.5), "1 bp = 0.01 percentage point."), ch(bp(150), "That would be 1.50 percentage points."), ch(bp(35), "Subtract the old yield from the new.")],
    "One basis point is 0.01 percentage point, so 4.35 − 4.20 = 0.15 = 15 bp.", { glossary: "basis-point" })),
  mc("RC-13", "A data series called T10Y2Y is plotted on an economic-data site. What does it show?", "A",
    ch("The 10-year minus 2-year Treasury spread"),
    [ch("The 10-year yield times two", "It is a spread."), ch("Two-year inflation expectations", "Breakevens are separate series."), ch("The Fed's target range", "Different series.")],
    "T10Y2Y is the 10-year minus 2-year constant-maturity spread — the 2s10s curve slope.", { glossary: "yield-curve" }),
  mc("RC-14", "Real yields climb sharply. Which part of the stock market has tended to be most sensitive?", "D",
    ch("Long-duration growth stocks"),
    [ch("Energy producers only", "Energy is driven more by oil prices."), ch("Nothing — stocks ignore rates", "Valuations depend on discount rates."), ch("Consumer staples first", "Staples are usually less rate-sensitive than long-duration growth.")],
    "More of a growth company's value sits in distant profits, so a higher real discount rate shrinks it more — a tendency, not a rule.", { glossary: "real-yield" }),
];

// ---------------- fed-policy ----------------
const m38 = meetingByMonth(ev("fomc-38").month)!;
const pr38 = pricingFor(m38);
const exp38 = expectedMoveBp(pr38);
const m40 = meetingByMonth(ev("fomc-40").month)!;
const dots40 = dotsFor(m40)!;
const prior40 = priorSepMedianSameYear(m40, 0)!;
const sorted40 = [...dots40[0]!.dots].sort((a, b) => a - b);
const frac = (x: number) => x.toFixed(3).replace(/0+$/, "").replace(/\.$/, "");

export const FED_POLICY_QUESTIONS: MacroQuizQuestion[] = [
  numeric(mc("FP-01", `Before the ${m38.label} meeting the target range was ${m38.lowerBefore.toFixed(2)}–${(m38.lowerBefore + 0.25).toFixed(2)}%. The Committee raised it by 25 bp. What is the new range?`, "B",
    ch(`${m38.lower.toFixed(2)}–${m38.upper.toFixed(2)}%`),
    [ch(`${m38.lowerBefore.toFixed(2)}–${(m38.lowerBefore + 0.25).toFixed(2)}%`, "That is the old range."), ch(`${(m38.lower + 0.25).toFixed(2)}–${(m38.upper + 0.25).toFixed(2)}%`, "That is a 50 bp hike."), ch(`${m38.lower.toFixed(2)}–${(m38.upper + 0.25).toFixed(2)}%`, "Both ends move by 25 bp; the band stays 25 bp wide.")],
    "A 25 bp hike moves both ends of the band up 0.25 percentage point.", { glossary: "target-range" })),
  numeric(mc("FP-02", `Simulated futures pricing for ${m38.label}: ${pr38.map((o) => `${o.prob}% ${o.moveBp === 0 ? "hold" : `${o.moveBp > 0 ? "+" : ""}${o.moveBp} bp`}`).join(", ")}. What move is priced (probability-weighted)?`, "A",
    ch(`${exp38 > 0 ? "+" : exp38 < 0 ? "−" : ""}${Math.abs(exp38)} bp`),
    [ch("+25 bp", "That is the favorite outcome, not the weighted average."), ch("0 bp", "Weight each outcome by its probability."), ch("+12.5 bp", "Use the actual probabilities, not 50/50.")],
    "Expected move = Σ probability × move. A decision that differs from it is the surprise.", { exhibit: { kind: "pricing", month: m38.month }, glossary: "fed-funds-futures" })),
  mc("FP-03", `${ev("fomc-43").period}: futures priced a cut at about 95%, and the Fed cut 25 bp. What usually happens?`, "C",
    ch("Little reaction — it was priced in"),
    [ch("A big rally, because cuts are always bullish", "If the cut was fully expected, there is little new information."), ch("A crash, because cuts mean recession", "That can happen when a cut is bigger than priced; this one matched."), ch("Bond yields jump 50 bp", "Nothing new to reprice.")],
    "Markets move on surprises. A fully priced decision tends to produce a small move; the statement and press conference can still matter.", { exhibit: { kind: "pricing", month: ev("fomc-43").month }, glossary: "buy-the-rumor" }),
  mc("FP-04", `${m40.label}: the Fed held as expected, but the median dot for this year rose from ${frac(prior40)}% to ${frac(dots40[0]!.median)}%. How is that usually read?`, "A",
    ch("Hawkish — fewer cuts than markets hoped"),
    [ch("Dovish — a hold is always dovish", "The dots moved up, signaling a higher path."), ch("Neutral — dots never matter", "Markets compare dots with pricing."), ch("It means an immediate hike", "Dots are projections, not decisions.")],
    "A hold can be hawkish when the projected path rises. Expect the 2-year up and growth stocks under pressure — the opposite of the headline's calm.", { exhibit: { kind: "dots", month: m40.month }, glossary: "dot-plot" }),
  numeric(mc("FP-05", `There are 19 dots in the ${dots40[0]!.label} column. Sorted low to high: ${sorted40.map(frac).join(", ")}. What is the median?`, "D",
    ch(`${frac(sorted40[9]!)}%`),
    [ch(`${frac(sorted40[0]!)}%`, "That is the lowest dot; the median is the 10th of 19."), ch(`${frac(round2(sorted40.reduce((a, b) => a + b, 0) / 19))}%`, "That is the mean, not the median."), ch(`${frac(sorted40[18]!)}%`, "That is the highest dot.")],
    "With 19 participants the median is the 10th dot when sorted.", { exhibit: { kind: "dots", month: m40.month }, glossary: "dot-plot" })),
  mc("FP-06", "At what time is the FOMC policy statement released on decision days?", "B",
    ch("2:00 p.m. ET"),
    [ch("8:30 a.m. ET", "That is the usual time for jobs, CPI and many other releases."), ch("Midnight", "No."), ch("After the market closes", "It comes during the trading session.")],
    "The statement comes at 2:00 p.m. ET and the press conference follows, so markets often move twice.", { glossary: "fomc" }),
  mc("FP-07", "How many scheduled FOMC meetings are there per year, and at how many are projections (dots) published?", "C",
    ch("8 meetings; projections at 4"),
    [ch("12 meetings; projections at all", "There are eight scheduled meetings."), ch("4 meetings; projections at 2", "Eight meetings."), ch("8 meetings; projections at 8", "The Summary of Economic Projections comes quarterly.")],
    "Eight scheduled meetings a year; the Summary of Economic Projections (with the dot plot) is published at four of them.", { glossary: "fomc" }),
  mc("FP-08", "Where does the effective federal funds rate usually trade?", "A",
    ch("Inside the target range"),
    [ch("Exactly at the top of the range every day", "It trades inside the range."), ch("Below zero", "Not with a positive range."), ch("Wherever banks want, unrelated to the range", "The Fed uses administered rates to keep it inside.")],
    "Administered rates (interest on reserves, the overnight reverse repo rate) keep the effective rate inside the band.", { glossary: "federal-funds-rate" }),
  mc("FP-09", `${ev("fomc-42").period}: during a growth scare the Fed cut 50 bp when about 30% was priced for that. What happened to stocks in the simulation, and why?`, "D",
    ch("Popped, then fell — the bigger cut signalled the Fed was worried"),
    [ch("Rallied all day — cuts are always good for stocks", "In a growth scare a surprise big cut can read as alarm."), ch("No reaction — it was fully priced", "Only about 30% was priced for 50 bp."), ch("Bond yields jumped", "Yields fell on the dovish surprise.")],
    "A bigger-than-priced cut can read as the Fed seeing trouble. Knee-jerk relief, then the market focuses on why. Real reactions vary.", { exhibit: { kind: "reaction", eventId: "fomc-42", instrument: "index", mode: "classify" }, glossary: "hawkish-dovish" }),
  mc("FP-10", "When is a Fed decision 'hawkish'?", "B",
    ch("When it implies a higher rate path than markets expected"),
    [ch("Whenever rates go up", "A priced hike with dovish guidance can be read as dovish."), ch("Whenever rates are above 5%", "It is relative to expectations."), ch("When the vote is unanimous", "Votes alone don't decide it.")],
    "Hawkish and dovish are relative to expectations: a cut can be hawkish if it signals fewer future cuts than priced.", { glossary: "hawkish-dovish" }),
  mc("FP-11", "The statement shows an 11–1 vote with one member preferring a smaller move. What is the dissent telling you?", "C",
    ch("Some disagreement about the pace — a hint about future debates"),
    [ch("The decision is invalid", "Majority decides."), ch("Nothing — dissents are random", "Dissents are read for policy direction."), ch("The Fed will reverse tomorrow", "Unlikely; it is one view.")],
    "Dissents show the range of views on the Committee; markets read them for the direction of future decisions.", { glossary: "fomc" }),
  mc("FP-12", "What are fed funds futures used for in macro trading?", "A",
    ch("Inferring market-implied probabilities of each meeting outcome"),
    [ch("Setting the target range", "The FOMC sets it."), ch("Measuring inflation", "Different instruments."), ch("Pricing mortgages directly", "Mortgages follow the 10-year and the spread.")],
    "Futures prices imply an expected rate path; tools convert them into probabilities for hold / hike / cut.", { glossary: "fed-funds-futures" }),
  numeric(mc("FP-13", "A 50 basis point cut lowers the target range by how much?", "D",
    ch("0.50 percentage point"),
    [ch("5 percentage points", "1 bp = 0.01 point."), ch("0.05 percentage point", "50 × 0.01 = 0.50."), ch("50 percentage points", "Basis points are hundredths.")],
    "50 bp = 0.50 percentage point.", { glossary: "basis-point" })),
];

// ---------------- housing-mortgage ----------------
const pm = pmmsCards(ev("pmms-36").week!);
const pmSpread = round2(pm.cards[0]!.rate - pm.avg10y);
const hs = ev("housing-starts-34");
const hsT = housingTable(hs.month);
const pay = (rate: number, loan = 400000) => {
  const r = rate / 100 / 12;
  return (loan * r) / (1 - (1 + r) ** -360);
};
const wkNow = ev("pmms-37").week!;
const rNow = WORLD.weeks[wkNow]!.mortgage30;
const rYa = WORLD.weeks[wkNow - 48]!.mortgage30;
const payDiff = Math.round(pay(rNow) - pay(rYa));

export const HOUSING_MORTGAGE_QUESTIONS: MacroQuizQuestion[] = [
  numeric(mc("HM-01", `Week of ${pm.asOf} (simulated): 30-year mortgage ${pm.cards[0]!.rate.toFixed(2)}%, average 10-year yield ${pm.avg10y.toFixed(2)}%. What is the mortgage spread?`, "B",
    ch(`${pmSpread.toFixed(2)} points`),
    [ch(`${round2(pm.cards[0]!.rate + pm.avg10y).toFixed(2)} points`, "Subtract, don't add."), ch(`${pm.cards[1]!.rate.toFixed(2)} points`, "That is the 15-year rate."), ch(`${round2(pm.cards[0]!.rate - pm.cards[1]!.rate).toFixed(2)} points`, "That is the 30y − 15y gap.")],
    "Mortgage spread = 30-year rate − 10-year yield. It has often been around 1.5–2 points, wider in volatile years.", { exhibit: { kind: "pmms", week: ev("pmms-36").week! }, glossary: "mortgage-spread" })),
  mc("HM-02", "What mainly drives the weekly 30-year mortgage rate?", "A",
    ch("The 10-year Treasury yield plus a spread"),
    [ch("The fed funds rate one-for-one", "Mortgages track long rates more than the overnight rate."), ch("Housing starts", "Starts are construction activity."), ch("The stock index", "Not directly.")],
    "Lenders price 30-year loans off longer-term rates; the spread widens when rates are volatile.", { glossary: "mortgage-rate" }),
  numeric(mc("HM-03", `The simulated survey shows the 30-year at ${pm.cards[0]!.rate.toFixed(2)}%, a change of ${pm.cards[0]!.weekChange >= 0 ? "+" : "−"}${Math.abs(pm.cards[0]!.weekChange).toFixed(2)} from last week. What was last week's rate?`, "C",
    ch(`${round2(pm.cards[0]!.rate - pm.cards[0]!.weekChange).toFixed(2)}%`),
    [ch(`${round2(pm.cards[0]!.rate + pm.cards[0]!.weekChange).toFixed(2)}%`, "Subtract this week's change."), ch(`${pm.cards[1]!.rate.toFixed(2)}%`, "That is the 15-year."), ch(`${pm.avg10y.toFixed(2)}%`, "That is the 10-year.")],
    "Last week = this week − weekly change.", { exhibit: { kind: "pmms", week: ev("pmms-36").week! }, glossary: "mortgage-rate" })),
  mc("HM-04", "Housing starts are reported 'at a seasonally adjusted annual rate'. What does that mean?", "D",
    ch("The month's pace, adjusted for seasons and scaled to a full year"),
    [ch("The total for the whole year so far", "It is a monthly pace, annualized."), ch("Only new apartments", "It covers all privately owned units."), ch("A forecast for next year", "It is a measurement.")],
    "SAAR makes months comparable: a winter month and a spring month can be read on the same scale.", { glossary: "housing-starts" }),
  mc("HM-05", "Which line in the construction report is usually read as a lead for future starts?", "B",
    ch("Building permits"),
    [ch("Completions", "Completions are the end of the pipeline."), ch("Mortgage rates", "Not in this report."), ch("Retail sales", "Different report.")],
    "Permits come before construction begins, so they are the forward-looking line.", { glossary: "building-permits" }),
  numeric(mc("HM-06", `${hs.period}: starts ${hsT[0]!.current.toLocaleString("en-US")}k (SAAR) after ${hsT[0]!.prior.toLocaleString("en-US")}k. What is the monthly % change?`, "A",
    ch(`${hsT[0]!.momPct > 0 ? "+" : "−"}${Math.abs(hsT[0]!.momPct).toFixed(1)}%`),
    [ch(`${(hsT[0]!.current - hsT[0]!.prior).toLocaleString("en-US")}%`, "That is the change in units."), ch(`${hsT[0]!.momPct > 0 ? "−" : "+"}${Math.abs(hsT[0]!.momPct).toFixed(1)}%`, "Check the sign."), ch(`${(Math.abs(hsT[0]!.momPct) * 12).toFixed(1)}%`, "Don't annualize — the level is already annualized.")],
    "Percent change = (new ÷ old − 1) × 100. Monthly swings of several percent are common, which is why markets rarely react much.", { glossary: "housing-starts" })),
  mc("HM-07", "A cool inflation report pulls the 10-year yield down 15 bp. Which sector is most directly helped?", "C",
    ch("Homebuilders"),
    [ch("Banks", "Banks get mixed effects."), ch("Energy", "Not directly rate-driven."), ch("None", "Rate-sensitive sectors usually react.")],
    "Lower long yields → lower mortgage rates → better affordability and demand for new homes. A tendency, not a guarantee.", { glossary: "rate-sensitive-sectors" }),
  mc("HM-08", "Why do REITs often move opposite to yields?", "D",
    ch("They compete with bonds for income buyers and carry debt"),
    [ch("They own Treasury bonds only", "They own property."), ch("They are required to short bonds", "No."), ch("They never react to rates", "They are among the most rate-sensitive.")],
    "Higher yields make bond income relatively more attractive and raise REITs' financing costs.", { glossary: "rate-sensitive-sectors" }),
  mc("HM-09", "Why is the weekly mortgage survey itself rarely market-moving?", "A",
    ch("It mostly reports where rates already went during the week"),
    [ch("It is secret", "It is public."), ch("It is released at midnight", "It is published midday Thursday."), ch("Mortgage rates never change", "They change weekly.")],
    "By release time the bond market has already moved; the survey tells homebuyers, not traders, something new.", { glossary: "mortgage-rate" }),
  mc("HM-10", "Why is the 15-year fixed rate usually below the 30-year rate?", "B",
    ch("The loan is shorter, so the lender takes less long-term rate risk"),
    [ch("The Fed sets it lower", "Lenders set mortgage rates."), ch("It is adjustable", "Both are fixed."), ch("It is only for new homes", "Not the reason.")],
    "Shorter loans are priced off shorter, usually lower-yielding funding and carry less duration risk.", { glossary: "mortgage-rate" }),
  numeric(mc("HM-11", `A $400,000 30-year fixed loan: about ${usd0(pay(rYa))}/month at ${rYa.toFixed(2)}% vs about ${usd0(pay(rNow))}/month at ${rNow.toFixed(2)}% (principal + interest). What is the monthly difference?`, "C",
    ch(`${payDiff >= 0 ? "+" : "−"}${usd0(Math.abs(payDiff))}`),
    [ch(`${payDiff >= 0 ? "−" : "+"}${usd0(Math.abs(payDiff))}`, "New payment minus old."), ch(`${payDiff >= 0 ? "+" : "−"}${usd0(Math.abs(payDiff) * 12)}`, "That is per year."), ch("$0", "The rate changed, so the payment changed.")],
    "Payment = L·r / (1 − (1 + r)^−360) with r = rate ÷ 12. A one-point rate change moves a typical payment by a few hundred dollars a month.", { glossary: "mortgage-rate" })),
  mc("HM-12", "Strong data lifts yields. How do bank stocks typically react?", "D",
    ch("Mixed — higher rates can help margins but hurt bond holdings and loan demand"),
    [ch("Always up sharply", "Effects offset."), ch("Always down sharply", "Effects offset."), ch("Banks are not affected by rates", "They are, in several ways.")],
    "That is why the game often marks banks as muted on rate-driven days; on growth-scare days credit risk dominates.", { glossary: "rate-sensitive-sectors" }),
];

// ---------------- macro-reactions (chart-based) ----------------
const DIR_LABEL = { up: "Up", down: "Down", muted: "Little change" } as const;
function predictQ(id: string, eventId: string, instrument: Instrument, at: Letter): MacroQuizQuestion {
  const e = ev(eventId);
  const r = reactionForEvent(e);
  const ans = r.moves[instrument];
  const others = (["up", "down", "muted"] as const).filter((d) => d !== ans);
  return mc(
    id,
    `${e.period} (${e.regime.replace(/-/g, " ")} regime): read the expectations and the pre-release bars. Where did the ${INSTRUMENT_NAMES[instrument].toLowerCase()} close the session?`,
    at,
    ch(DIR_LABEL[ans]),
    [ch(DIR_LABEL[others[0]!], `Not this time: ${r.rationale[instrument]}`), ch(DIR_LABEL[others[1]!], `Not this time: ${r.rationale[instrument]}`), ch("Can't be known from the release", "You can't know for sure, but the surprise and the regime point to a typical reaction.")],
    `${r.summary} ${r.rationale[instrument]}`,
    { exhibit: { kind: "reaction", eventId, instrument, mode: "predict" }, glossary: "macro-regime" },
  );
}
const ARCH_LABEL = { "follow-through": "Follow-through", reversal: "Reversal", whipsaw: "Whipsaw (round trip)", muted: "Muted / priced in" } as const;
function classifyQ(id: string, eventId: string, at: Letter): MacroQuizQuestion {
  const e = ev(eventId);
  const c = intradayChart(e, "index");
  const kind = c.direction === "muted" && c.archetype === "follow-through" ? "muted" : c.archetype;
  const all = ["follow-through", "reversal", "whipsaw", "muted"] as const;
  const wrong = all.filter((k) => k !== kind);
  const fb: Record<string, string> = {
    "follow-through": "Follow-through means the first move kept going.",
    reversal: "A reversal ends on the other side of the pre-release close.",
    whipsaw: "A whipsaw spikes and then returns near where it started.",
    muted: "Muted means no real move after the release.",
  };
  return mc(
    id,
    `${e.period}: this is the simulated index on release day. Which reaction pattern is it?`,
    at,
    ch(ARCH_LABEL[kind]),
    wrong.map((k) => ch(ARCH_LABEL[k], fb[k])),
    reactionForEvent(e).summary,
    { exhibit: { kind: "reaction", eventId, instrument: "index", mode: "classify" }, glossary: kind === "muted" ? "priced-in" : kind === "reversal" ? "buy-the-rumor" : "macro-surprise" },
  );
}

export const MACRO_REACTIONS_QUESTIONS: MacroQuizQuestion[] = [
  predictQ("MX-01", "payrolls-01", "index", "B"),
  predictQ("MX-02", "payrolls-04", "index", "A"),
  predictQ("MX-03", "payrolls-06", "index", "C"),
  predictQ("MX-04", "payrolls-08", "utilities", "A"),
  predictQ("MX-05", "cpi-15", "us2y", "B"),
  predictQ("MX-06", "cpi-17", "index", "C"),
  predictQ("MX-07", "cpi-19", "index", "A"),
  predictQ("MX-08", "fomc-41", "dollar", "B"),
  predictQ("MX-09", "claims-11", "index", "C"),
  predictQ("MX-10", "retail-27", "index", "A"),
  classifyQ("MX-11", "payrolls-03", "A"),
  classifyQ("MX-12", "cpi-16", "B"),
  classifyQ("MX-13", "payrolls-07", "C"),
  classifyQ("MX-14", "cpi-14", "D"),
  classifyQ("MX-15", "cpi-18", "A"),
  classifyQ("MX-16", "fomc-43", "B"),
];

export const MACRO_QUESTION_BANKS: Record<MacroQuizGroupId, MacroQuizQuestion[]> = {
  "macro-releases": MACRO_RELEASES_QUESTIONS,
  "rates-curve": RATES_CURVE_QUESTIONS,
  "fed-policy": FED_POLICY_QUESTIONS,
  "housing-mortgage": HOUSING_MORTGAGE_QUESTIONS,
  "macro-reactions": MACRO_REACTIONS_QUESTIONS,
};

const ICONS: Record<MacroQuizGroupId, string> = { "macro-releases": "work", "rates-curve": "trending_up", "fed-policy": "account_balance", "housing-mortgage": "home", "macro-reactions": "candlestick_chart" };
export const MACRO_QUIZ_GROUPS = MACRO_QUIZ_GROUP_IDS.map((id) => ({ id, name: MACRO_QUIZ_GROUP_META[id].label, description: MACRO_QUIZ_GROUP_META[id].description, icon: ICONS[id] }));
export const isMacroQuizGroup = (id: string): id is MacroQuizGroupId => (MACRO_QUIZ_GROUP_IDS as readonly string[]).includes(id);
export type { MacroQuizGroupId };
