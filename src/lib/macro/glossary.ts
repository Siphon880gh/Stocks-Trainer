/**
 * Macro-release, rates and policy glossary terms (MF3.M2).
 * Spread into LITERACY_TERMS (Archive → Literacy, Flashcards, quiz "Open glossary" links).
 * Type-only import: no runtime cycle with literacyTerms.ts.
 * Educational definitions written for this app; hedged, not investment advice.
 */
import type { LiteracyTerm } from "../literacyTerms";

export const MACRO_TERMS: LiteracyTerm[] = [
  {
    id: "nonfarm-payrolls",
    name: "Nonfarm payrolls",
    category: "markets",
    summary: "The monthly change in the number of US jobs counted by the employer survey — the headline of the jobs report.",
    detail:
      "Comes from the establishment survey of businesses and government agencies (farm workers, the self-employed and household workers are excluded). Markets trade the change versus consensus, and the two prior months are revised in every report, so the revision can matter as much as the new number.",
  },
  {
    id: "unemployment-rate",
    name: "Unemployment rate",
    category: "markets",
    summary: "Unemployed people looking for work as a share of the labor force.",
    detail:
      "From the household survey, a separate sample from payrolls, so the two can disagree in a given month. A rising rate is usually read as a cooling labor market; a sustained rise has historically come near the start of recessions, though rules of thumb have exceptions.",
  },
  {
    id: "participation-rate",
    name: "Labor force participation rate",
    category: "markets",
    summary: "Share of the working-age population that is working or looking for work.",
    detail:
      "If participation rises, unemployment can tick up even while hiring is healthy, because more people are searching. That is one reason a single unemployment-rate print can mislead.",
  },
  {
    id: "average-hourly-earnings",
    name: "Average hourly earnings",
    category: "markets",
    summary: "Monthly change in average pay per hour — the wage line of the jobs report.",
    detail:
      "Read as a wage-pressure signal: hot wage growth can keep services inflation sticky, so in an inflation-worried market a hot wage line can matter more than the headline jobs number.",
  },
  {
    id: "household-vs-establishment",
    name: "Household vs establishment survey",
    category: "process",
    summary: "The jobs report has two surveys: one of households (unemployment rate) and one of employers (payrolls).",
    detail:
      "They use different samples and definitions, so they can point in different directions in one month. Traders usually lead with payrolls and the unemployment rate, then check wages and revisions.",
  },
  {
    id: "data-revision",
    name: "Data revision",
    category: "process",
    summary: "A later, better estimate replacing an earlier one (prior months of payrolls, GDP estimates).",
    detail:
      "A strong headline with large downward revisions to earlier months can be read as weaker overall. Always read the 'prior revised' line next to the new number.",
  },
  {
    id: "initial-jobless-claims",
    name: "Initial jobless claims",
    category: "markets",
    summary: "New weekly filings for unemployment insurance — a fast, noisy read on layoffs.",
    detail:
      "Released every week, so it is one of the timeliest labor gauges. Because single weeks are noisy (holidays, storms), the 4-week moving average is the trend line. Higher claims = weaker labor market.",
  },
  {
    id: "continuing-claims",
    name: "Continuing claims",
    category: "markets",
    summary: "People still receiving unemployment benefits after their first week.",
    detail:
      "Rising continuing claims with flat initial claims suggests that people who lose jobs are taking longer to find new ones — a slower-hiring market even without big layoffs.",
  },
  {
    id: "jolts-openings",
    name: "Job openings (JOLTS)",
    category: "markets",
    summary: "Monthly count of unfilled jobs from the Job Openings and Labor Turnover Survey.",
    detail:
      "Comes out with a lag of about a month after the jobs report for the same period. Falling openings with steady layoffs is the 'soft landing' pattern; falling openings with rising layoffs is weaker.",
  },
  {
    id: "quits-rate",
    name: "Quits rate",
    category: "markets",
    summary: "Share of workers voluntarily leaving jobs in a month.",
    detail:
      "Workers quit more when they are confident of finding better pay, so the quits rate is often read as a leading signal for wage growth.",
  },
  {
    id: "cpi",
    name: "Consumer Price Index (CPI)",
    category: "markets",
    summary: "Monthly change in prices paid by urban consumers for a basket of goods and services.",
    detail:
      "The most-watched inflation release in many cycles. Markets focus on the month-over-month change versus consensus, and especially on core CPI; a 0.1-point miss on core can move yields when inflation is the market's main worry.",
  },
  {
    id: "core-inflation",
    name: "Core inflation",
    category: "markets",
    summary: "Inflation excluding food and energy, which swing with weather and oil.",
    detail:
      "Core is read as the underlying trend. A hot headline caused by energy while core is in line is often treated as less important than a hot core print.",
  },
  {
    id: "shelter-inflation",
    name: "Shelter inflation",
    category: "markets",
    summary: "Housing costs in CPI (rent and owners' equivalent rent), the largest single core category.",
    detail:
      "Shelter tends to move slowly and lag market rents by many months, so analysts often look at inflation 'ex-shelter' to see turning points sooner.",
  },
  {
    id: "ppi",
    name: "Producer Price Index (PPI)",
    category: "markets",
    summary: "Monthly change in prices received by domestic producers.",
    detail:
      "Often treated as a pipeline signal for consumer prices and as an input to PCE estimates. It usually moves markets less than CPI unless it surprises sharply.",
  },
  {
    id: "pce-inflation",
    name: "PCE inflation",
    category: "markets",
    summary: "The price index for personal consumption expenditures — the inflation gauge the Fed's 2 percent goal refers to.",
    detail:
      "Core PCE is released after CPI and PPI, and much of it can be estimated from them, so surprises are usually smaller. A miss still matters when it changes the Fed's expected path.",
  },
  {
    id: "gdp",
    name: "Gross domestic product (GDP)",
    category: "markets",
    summary: "The value of all goods and services produced; US quarterly growth is reported at an annual rate.",
    detail:
      "Published as advance, second and third estimates, with revisions. Contributions show which parts — consumer spending, investment, government, net exports — drove growth; inventories and trade can swing the headline away from underlying demand.",
  },
  {
    id: "retail-sales",
    name: "Retail sales",
    category: "markets",
    summary: "Monthly change in sales at retailers and restaurants, in dollars.",
    detail:
      "Nominal, so higher prices can inflate it. The control group (excluding autos, gas, building materials and food services) feeds the GDP consumption estimate and is often the line traders read.",
  },
  {
    id: "pmi",
    name: "Purchasing managers' index (PMI)",
    category: "markets",
    summary: "A survey diffusion index: above 50 means more firms report growth than contraction.",
    detail:
      "Sub-indexes (new orders, employment, prices) can matter more than the headline: a weak PMI with a hot prices index is a stagflation-flavored mix.",
  },
  {
    id: "diffusion-index",
    name: "Diffusion index",
    category: "process",
    summary: "A survey score that measures how widespread growth is, not how big it is. 50 is the dividing line.",
    detail:
      "A reading of 52 means a small net share of respondents saw improvement; it says nothing about the size of the improvement.",
  },
  {
    id: "consumer-sentiment",
    name: "Consumer sentiment",
    category: "markets",
    summary: "Survey index of how households feel about their finances and the economy.",
    detail:
      "Markets often shrug at the level; the inflation-expectations questions get more attention because a central bank watches whether households expect high inflation to persist.",
  },
  {
    id: "inflation-expectations",
    name: "Inflation expectations",
    category: "markets",
    summary: "What households, businesses or markets expect inflation to be in the future.",
    detail:
      "Measured by surveys and by market prices (breakevens). If expectations drift up, central banks tend to respond more firmly, because expected inflation can feed into wages and prices.",
  },
  {
    id: "housing-starts",
    name: "Housing starts",
    category: "markets",
    summary: "Monthly count of new homes on which construction began, at a seasonally adjusted annual rate.",
    detail:
      "Very noisy month to month; building permits lead starts. Mainly moves homebuilder stocks; the broad market reaction is usually small.",
  },
  {
    id: "building-permits",
    name: "Building permits",
    category: "markets",
    summary: "Authorizations to build new homes — a lead on future starts.",
    detail:
      "Because they come before construction, permits are often read as the cleaner forward-looking line in the housing-construction report.",
  },
  {
    id: "mortgage-rate",
    name: "30-year mortgage rate",
    category: "markets",
    summary: "The average rate on a 30-year fixed home loan, published weekly by survey.",
    detail:
      "Moves mostly with the 10-year Treasury yield plus a spread that widens when rates are volatile. That is how a hot jobs or inflation report can reach homebuyers within days.",
  },
  {
    id: "mortgage-spread",
    name: "Mortgage spread",
    category: "markets",
    summary: "The gap between the 30-year mortgage rate and the 10-year Treasury yield.",
    detail:
      "Historically often around 1.5 to 2 percentage points, wider in volatile years. A narrowing spread can lower mortgage rates even when the 10-year does not move.",
  },
  {
    id: "federal-funds-rate",
    name: "Federal funds rate",
    category: "markets",
    summary: "The overnight rate banks charge each other, steered by the Fed into a target range.",
    detail:
      "The Fed sets a target range (for example 5.25–5.50%) and uses administered rates to keep the effective rate inside it. Changes ripple to short Treasury yields almost immediately and to longer yields according to expectations.",
  },
  {
    id: "target-range",
    name: "Target range",
    category: "process",
    summary: "The 25-basis-point band the Fed sets for the federal funds rate.",
    detail:
      "Decisions are stated as raising, lowering or keeping the range. 'Hike 25' means both ends of the band move up 0.25 percentage point.",
  },
  {
    id: "basis-point",
    name: "Basis point (bp)",
    category: "process",
    summary: "One hundredth of a percentage point: 0.01%. 25 bp = 0.25%.",
    detail:
      "Yields and policy rates are quoted in basis points because moves are small. A 10-year yield rising from 4.20% to 4.35% is a 15 bp move.",
  },
  {
    id: "fomc",
    name: "FOMC",
    category: "markets",
    summary: "The Federal Open Market Committee — the Fed group that votes on interest-rate policy.",
    detail:
      "Holds eight scheduled meetings a year; the statement comes at 2:00 p.m. ET and a press conference follows. Projections (including the dot plot) are published at four of the meetings.",
  },
  {
    id: "dot-plot",
    name: "Dot plot",
    category: "markets",
    summary: "A chart of each FOMC participant's view of the appropriate year-end policy rate.",
    detail:
      "Published with the Summary of Economic Projections four times a year. Markets compare the median dot with the previous projection and with futures pricing; a higher median than expected reads as hawkish.",
  },
  {
    id: "hawkish-dovish",
    name: "Hawkish vs dovish",
    category: "markets",
    summary: "Hawkish = leaning toward higher rates to fight inflation; dovish = leaning toward lower rates to support growth.",
    detail:
      "Markets judge relative to expectations: a cut can be 'hawkish' if it comes with signals of fewer future cuts than priced.",
  },
  {
    id: "fed-funds-futures",
    name: "Fed funds futures",
    category: "markets",
    summary: "Futures contracts whose prices imply the market's expected path of the federal funds rate.",
    detail:
      "Tools turn these prices into probabilities for each meeting outcome. A decision that matches a high probability is 'priced in'; the surprise is the gap between the decision and pricing.",
  },
  {
    id: "treasury-yield",
    name: "Treasury yield",
    category: "markets",
    summary: "The return implied by a US government bond's price; yields rise when prices fall.",
    detail:
      "Short yields (2-year) track expected Fed policy; long yields (10-year) add expectations for growth, inflation and a term premium. Hot data usually lifts short yields most.",
  },
  {
    id: "two-year-yield",
    name: "2-year Treasury yield",
    category: "markets",
    summary: "The yield on 2-year Treasuries — the market's best single gauge of expected Fed policy over the next two years.",
    detail:
      "Often the fastest mover on jobs and inflation surprises, because it reprices the expected path of rate hikes or cuts.",
  },
  {
    id: "ten-year-yield",
    name: "10-year Treasury yield",
    category: "markets",
    summary: "The benchmark long-term US interest rate.",
    detail:
      "Feeds mortgage rates and the discount rate investors apply to future profits. Rising 10-year yields have tended to weigh most on long-duration growth stocks.",
  },
  {
    id: "yield-curve",
    name: "Yield curve",
    category: "markets",
    summary: "Treasury yields plotted from short to long maturities.",
    detail:
      "Normally slopes up. Its shape — steep, flat or inverted — summarizes expectations for policy, growth and inflation.",
  },
  {
    id: "curve-inversion",
    name: "Yield-curve inversion",
    category: "markets",
    summary: "When short-term yields are above long-term yields (for example 2-year above 10-year).",
    detail:
      "Has preceded many US recessions, with long and variable lags, and is not a timing tool. A 're-steepening' after inversion has often come as the Fed starts cutting.",
  },
  {
    id: "bull-bear-steepener",
    name: "Steepener and flattener",
    category: "markets",
    summary: "Steepener: the gap between long and short yields widens. Flattener: it narrows.",
    detail:
      "A 'bull steepener' (short yields fall faster) often accompanies expected rate cuts; a 'bear flattener' (short yields rise faster) often accompanies expected hikes.",
  },
  {
    id: "breakeven-inflation",
    name: "Breakeven inflation",
    category: "markets",
    summary: "Nominal Treasury yield minus the inflation-protected (TIPS) yield of the same maturity.",
    detail:
      "A market-based estimate of expected inflation (plus risk premia). Rising breakevens after a hot CPI suggest markets think inflation will persist.",
  },
  {
    id: "real-yield",
    name: "Real yield",
    category: "markets",
    summary: "A yield after inflation — for example the 10-year TIPS yield.",
    detail:
      "Higher real yields raise the hurdle for risky assets and have often pressured high-valuation stocks and gold.",
  },
  {
    id: "us-dollar-index",
    name: "Dollar index",
    category: "markets",
    summary: "A measure of the US dollar against a basket of other currencies.",
    detail:
      "Tends to rise when US yields rise relative to other countries (hot US data, hawkish Fed). A stronger dollar can weigh on US multinationals' overseas earnings.",
  },
  {
    id: "rate-sensitive-sectors",
    name: "Rate-sensitive sectors",
    category: "markets",
    summary: "Sectors whose stocks react strongly to interest rates: homebuilders, REITs, utilities, small caps and long-duration growth.",
    detail:
      "Higher yields raise borrowing costs and discount rates, so these groups often fall on hot data in an inflation-worried market. Banks can benefit from a steeper curve; the effect depends on the regime.",
  },
  {
    id: "bad-news-is-good-news",
    name: "Bad news is good news",
    category: "markets",
    summary: "A market regime where weak economic data lifts stocks because it raises the odds of rate cuts.",
    detail:
      "Common when inflation is the market's main worry and a central bank is near a turn. It flips when recession becomes the worry: then bad data is simply bad.",
  },
  {
    id: "macro-regime",
    name: "Macro regime",
    category: "markets",
    summary: "The market's dominant worry at a given time — for example inflation, overheating, or recession.",
    detail:
      "The same surprise can move stocks in opposite directions in different regimes. Identify what the market fears most before predicting a reaction.",
  },
  {
    id: "macro-surprise",
    name: "Economic surprise",
    category: "process",
    summary: "The difference between an actual release and the consensus forecast.",
    detail:
      "Markets move on surprises, not on levels. A big number that was expected does little; dividing the miss by the usual forecast error (a z-score) shows how unusual it was.",
  },
  {
    id: "buy-the-rumor",
    name: "Buy the rumor, sell the news",
    category: "markets",
    summary: "Prices move ahead of an expected event and then reverse when it happens.",
    detail:
      "Explains why a widely expected rate cut can see stocks fall afterward: the good news was already in the price.",
  },
  {
    id: "stagflation",
    name: "Stagflation",
    category: "markets",
    summary: "Weak growth combined with high inflation.",
    detail:
      "A difficult mix for central banks and stocks: cutting rates risks more inflation, hiking risks a deeper slowdown. A hot inflation print during a growth scare is a classic stagflation scare.",
  },
  {
    id: "soft-landing",
    name: "Soft landing",
    category: "markets",
    summary: "Inflation cools without a recession.",
    detail:
      "The 'goldilocks' outcome. In that regime, in-line or mildly cool data is usually welcome and stock reactions are often muted.",
  },
  {
    id: "term-premium",
    name: "Term premium",
    category: "markets",
    summary: "Extra yield investors demand to hold long bonds instead of rolling short ones.",
    detail:
      "Can push long yields up even when expected policy rates do not change — for example when deficits, supply or uncertainty rise.",
  },
  {
    id: "release-calendar",
    name: "Economic release calendar",
    category: "process",
    summary: "The official schedule of when each statistic is published (most US data at 8:30 a.m. ET).",
    detail:
      "Agencies publish schedules a year ahead. Traders plan around high-impact days (jobs report, CPI, FOMC), when volatility in yields and index futures tends to rise.",
  },
];

export const MACRO_TERM_IDS = new Set(MACRO_TERMS.map((t) => t.id));
