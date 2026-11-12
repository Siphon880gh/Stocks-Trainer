/**
 * MK6 · Bonds and rates (/practice/bonds-rates): Treasury funds by maturity (SGOV, SHY, IEF, TLT), inflation-protected
 * TIPS (TIP), duration as the rate-sensitivity number, and a ladder of individual bonds for a known need.
 * Sources: FINRA, SEC Investor.gov, TreasuryDirect, iShares (BlackRock), Fidelity, Vanguard. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { withSims } from "../toolTraining/simWalk";
import { THEME_SIMS } from "./simulations";
import { mc, pct, r2, seededTape, usd } from "./helpers";

/** FINRA rule of thumb: price change ≈ −duration × change in yield (percentage points). */
export const durationPriceChangePct = (duration: number, yieldChangePts: number) => r2(-duration * yieldChangePts);
/** Equal-size rungs maturing one per year. */
export const ladderRungs = (total: number, years: number) =>
  Array.from({ length: years }, (_, i) => ({ year: i + 1, amount: r2(total / years) }));
/** Average years to maturity of an equal-rung ladder. */
export const ladderAvgMaturity = (years: number) => r2((years + 1) / 2);
/** Breakeven inflation ≈ nominal yield − real (TIPS) yield, in percentage points. */
export const breakevenInflation = (nominal: number, real: number) => r2(nominal - real);

/** Effective durations from iShares fund pages, as of Nov 10, 2026 (they change daily). */
export const BR_DURATION_AS_OF = "2026-11-10";
export const BR_DURATIONS = { SGOV: 0.1, SHY: 1.81, IEF: 6.81, TIP: 6.28, TLT: 14.83 } as const;
/** Illustrative numbers only (not market data). */
export const BR_EX = { jump: 0.5, ladderTotal: 50000, ladderYears: 5, nominal: 4.2, real: 1.9 } as const;
export const BR_TLT_JUMP = durationPriceChangePct(BR_DURATIONS.TLT, BR_EX.jump);
export const BR_TLT_1PT = durationPriceChangePct(BR_DURATIONS.TLT, 1);
export const BR_IEF_1PT = durationPriceChangePct(BR_DURATIONS.IEF, 1);
export const BR_SHY_1PT = durationPriceChangePct(BR_DURATIONS.SHY, 1);
export const BR_RUNG = ladderRungs(BR_EX.ladderTotal, BR_EX.ladderYears)[0]!.amount;
export const BR_AVG_MAT = ladderAvgMaturity(BR_EX.ladderYears);
export const BR_BREAKEVEN = breakevenInflation(BR_EX.nominal, BR_EX.real);

const TERMS: LiteracyTerm[] = [
  { id: "bond-duration", name: "Duration (bonds)", category: "markets", summary: "How much a bond or bond fund's price is likely to move when interest rates change. Higher duration, bigger moves.", detail: "FINRA's rule of thumb: for every 1 percentage-point change in rates, price moves about the duration number in the opposite direction, so a duration of 10 means roughly −10% if rates rise 1 point. Duration is not the same as maturity. Fund fact sheets list it. Educational, not advice." },
  { id: "interest-rate-risk", name: "Interest rate risk", category: "markets", summary: "The risk that rising market rates push down the price of bonds you already own.", detail: "SEC Investor.gov: it applies to all fixed-rate bonds, even U.S. Treasuries. The government guarantees interest and principal at maturity, not the market price if you sell early. Educational, not advice." },
  { id: "treasury-bill-fund", name: "Treasury bill fund", category: "markets", summary: "A fund that holds Treasury bills maturing within months, such as SGOV (0–3 months).", detail: "Its duration is close to zero, so rate moves barely change its price, but its income resets quickly when short-term rates change. Not a bank deposit and not FDIC insured. Educational, not advice." },
  { id: "tips-bond", name: "TIPS", category: "markets", summary: "Treasury Inflation-Protected Securities: Treasuries whose principal rises with inflation and falls with deflation.", detail: "TreasuryDirect: interest is paid every six months on the adjusted principal, and at maturity you get the greater of the adjusted or original principal. A TIPS fund (TIP) still moves with real yields and has duration. Educational, not advice." },
  { id: "bond-ladder", name: "Bond ladder", category: "process", summary: "Bonds of roughly equal amounts with staggered maturities, so some principal comes back on a regular schedule.", detail: "Vanguard and Fidelity describe it as a way to spread out interest-rate and reinvestment risk: as each rung matures you spend it or reinvest at the long end. Fidelity says to use high-quality, noncallable bonds and hold to maturity. Educational, not advice." },
  { id: "reinvestment-risk", name: "Reinvestment risk", category: "markets", summary: "The risk that money coming back from a maturing or called bond has to be reinvested at lower rates.", detail: "Short-term holdings have little price risk but plenty of reinvestment risk; long-term holdings are the reverse. Ladders and callable-bond rules are ways to manage it. Educational, not advice." },
];

const T1 = seededTape({ seed: 9801, start: 91.2, preDrift: 0.0005, postDrift: -0.004, vol: 0.009, gap: -0.03 });
const T2 = seededTape({ seed: 9802, start: 95.5, preDrift: 0.002, postDrift: -0.003, vol: 0.008, gap: -0.012 });
const T3 = seededTape({ seed: 9803, start: 548.3, preDrift: 0.001, postDrift: 0.001, vol: 0.01 });

const CASES: CaseStudy[] = [
  {
    id: "case-br-long-fund-as-cash",
    title: "Bonds: a long Treasury fund used as a savings account",
    contextType: "news",
    thinkingMode: "bond_duration",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. You parked a house down payment you need in six months in a 20+ year Treasury fund because \"Treasuries are safe\". A hot inflation report lifts long yields about ${BR_EX.jump} point; with an effective duration near ${BR_DURATIONS.TLT} years (iShares, as of ${BR_DURATION_AS_OF}), the fund gaps down about 3% and keeps sliding. Buy = add, it is cheaper now. Sell = move the money you need soon to something with near-zero duration (bills or a bill fund). Hold = wait for rates to fall.`,
    newsHeadline: "Long Treasury yields jump after inflation surprise.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `Duration tells you the risk: about ${pct(BR_TLT_JUMP, 1)} for a ${BR_EX.jump}-point rise, ${pct(BR_TLT_1PT, 1)} for a full point. Investor.gov: the government guarantees interest and principal at maturity, not the market price when you sell. Money needed in six months belongs in something that matures around then. Holding is partial credit only if the date can move.`,
      whyMarketMoved: "Higher yields lower the price of existing fixed-rate bonds, most for the longest durations.",
      evidence: "SAMPLE: the fund drifted lower over the next four sessions.",
    },
  },
  {
    id: "case-br-fed-cut-long-yields-up",
    title: "Bonds: the Fed cuts, but long yields rise",
    contextType: "news",
    thinkingMode: "bond_duration",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. You bought an intermediate Treasury fund the week before a Fed meeting because \"rate cuts are good for bonds\". The Fed cuts its policy rate as expected, but long yields rise on stronger growth and inflation worries; the fund slips and is below your planned exit level. Buy = add; the Fed is cutting. Sell = exit at your planned level; the thesis assumed every yield follows the policy rate. Hold = ignore the plan and wait.",
    newsHeadline: "Fed trims rates; longer Treasury yields climb anyway.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "The Fed sets a short-term rate. Fund prices follow the yields at their own maturities, which also price inflation, growth, supply and a term premium, and an expected cut is often priced in already. Your plan had an exit level; following it is the process. Holding is partial credit only if you rewrite the plan with a new exit before the next session.",
      whyMarketMoved: "Intermediate and long yields rose despite the cut, so prices fell by roughly duration × the yield change.",
      evidence: "SAMPLE: the fund stayed weak over the next four sessions.",
    },
  },
  {
    id: "case-br-ladder-rung-matures",
    title: "Bonds: a ladder rung matures after rates fell",
    contextType: "news",
    thinkingMode: "bond_duration",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. Your written plan: a ${BR_EX.ladderYears}-year Treasury ladder of ${usd(BR_EX.ladderTotal, 0)}, one ${usd(BR_RUNG, 0)} rung maturing each year, each maturity reinvested in a new ${BR_EX.ladderYears}-year Treasury. A rung just matured, and yields are lower than when you started. The stock market chart shown is a broad index for context. Buy = reinvest the ${usd(BR_RUNG, 0)} in a new ${BR_EX.ladderYears}-year Treasury as the plan says. Hold = leave it in cash until rates rise. Sell = sell the other rungs to lock in their price gains.`,
    newsHeadline: "Treasury yields ease; a ladder rung comes due.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["buy"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "A ladder exists so you do not have to guess rates. The four other rungs still earn the higher yields you locked in; the matured rung goes back in at the long end, at whatever today's rate is. Parking it briefly in bills is partial credit if you set a date; waiting for higher rates turns the ladder into a rate forecast. Selling the rest gives up the schedule.",
      whyMarketMoved: "Lower yields raise the prices of the bonds you still hold; they mature at face value regardless.",
      evidence: "SAMPLE: the broad index chart drifted sideways; the ladder's schedule did not depend on it.",
    },
  },
];

export const BONDS_RATES: MarketTheme = {
  id: "bonds-rates",
  route: "/practice/bonds-rates",
  practiceTitle: "Bonds and rates: SGOV, SHY, IEF, TLT, TIP and duration",
  title: "Bonds and rates",
  blurb:
    "Treasury funds from bills to 20+ years, inflation-protected TIPS, duration as the number that tells you how much a rate move hurts or helps, and a bond ladder for a known need. Educational, not advice.",
  marketForces:
    "Market Forces' bonds and rates theme lists Treasury funds by maturity and TIPS. The effective durations here come from each iShares fund page as of Nov 10, 2026; they change daily.",
  asOf: "2026-11-12",
  quiz: {
    name: "Bonds & Rates",
    description:
      "Why bond prices fall when yields rise; duration vs maturity and FINRA's rule of thumb; SGOV, SHY, IEF and TLT by duration; TIPS and breakeven inflation; Treasury guarantees vs market price; the Fed's short rate vs long yields; bond ladders, reinvestment risk and callable bonds",
    icon: "account_balance",
  },
  intro: [
    "A bond pays fixed interest and returns face value at maturity. When market rates rise, new bonds pay more, so existing bonds fall in price until their yield matches. SEC Investor.gov calls this interest rate risk and stresses that it applies to every fixed-rate bond, even U.S. Treasuries.",
    "Duration is the number that measures it. FINRA's rule of thumb: for each 1 percentage-point change in rates, a bond moves about its duration in the opposite direction. A Treasury fund's duration is the first thing to read, before its yield.",
  ],
  wrappers: [
    { name: "Treasury bills (0–3 months)", examples: `SGOV · duration ≈ ${BR_DURATIONS.SGOV} yr`, owns: "Treasury bills maturing within three months", tracks: "Short-term rates; income resets quickly", watch: "Income falls soon after the Fed cuts; not a bank deposit" },
    { name: "Short Treasuries (1–3 years)", examples: `SHY · duration ≈ ${BR_DURATIONS.SHY} yr`, owns: "Treasury notes maturing in one to three years", tracks: "Front-end yields, which follow Fed expectations", watch: `About ${pct(BR_SHY_1PT, 1)} per 1-point rate rise` },
    { name: "Intermediate Treasuries (7–10 years)", examples: `IEF · duration ≈ ${BR_DURATIONS.IEF} yr`, owns: "Treasury notes maturing in seven to ten years", tracks: "Around the 10-year yield", watch: `About ${pct(BR_IEF_1PT, 1)} per 1-point rate rise` },
    { name: "Long Treasuries (20+ years)", examples: `TLT · duration ≈ ${BR_DURATIONS.TLT} yr`, owns: "Treasury bonds maturing in more than 20 years", tracks: "Long yields: inflation expectations, growth, supply, term premium", watch: `About ${pct(BR_TLT_1PT, 1)} per 1-point rate rise; stock-like swings` },
    { name: "Inflation-protected Treasuries", examples: `TIP · duration ≈ ${BR_DURATIONS.TIP} yr`, owns: "TIPS, whose principal adjusts with CPI", tracks: "Real yields plus realized inflation", watch: "Still falls when real yields rise; protection is against inflation, not rates" },
  ],
  drivers: [
    { title: "Rates and prices move opposite", text: "Investor.gov's example: a 10-year 3% Treasury is worth about $925 a year later if market rates rise to 4%, and about $1,082 if they fall to 2%." },
    { title: "Duration, not maturity", ...withSims(["FINRA: ", { text: "duration measures rate sensitivity", sim: "mk-br-duration" }, "; maturity is just the repayment date. Lower coupons and longer maturities mean higher duration."]) },
    { title: "The Fed sets the short end", ...withSims(["The policy rate anchors bills and short notes. Long yields also price inflation, growth, government borrowing and a term premium, so ", { text: "they can rise when the Fed cuts", sim: "mk-br-fed-cut" }, "."]) },
    { title: "Inflation", text: "Fixed coupons lose buying power when inflation rises. TreasuryDirect: TIPS principal rises with CPI, and at maturity you get the greater of adjusted or original principal." },
    { title: "Hold to maturity vs sell early", text: "FINRA: if you hold an individual bond to maturity, price swings matter little. A bond fund never matures, so its duration risk stays." },
  ],
  bridges: [
    { title: "Macro desk", text: "The yield curve, real yields and breakevens are covered on the Macro desk." },
    { title: "Gold", text: "Real yields are one of gold's drivers; see Precious metals." },
    { title: "Stocks", text: "Higher yields raise the discount rate for long-duration growth stocks and compete with dividends." },
    { title: "The dollar", text: "Rate gaps between countries move currencies; see Currency funds and the dollar." },
  ],
  math: {
    title: "Duration, ladders and breakeven inflation",
    rows: [
      { label: "Price change from a rate move", formula: "≈ −duration × change in yield", example: `TLT ${BR_DURATIONS.TLT} × +${BR_EX.jump} pt ≈ ${pct(BR_TLT_JUMP, 1)}; IEF ${BR_DURATIONS.IEF} × +1 pt ≈ ${pct(BR_IEF_1PT, 1)}` },
      { label: "Equal-rung ladder", formula: "total ÷ number of rungs", example: `${usd(BR_EX.ladderTotal, 0)} over ${BR_EX.ladderYears} yearly rungs = ${usd(BR_RUNG, 0)} each; average maturity ${BR_AVG_MAT} years` },
      { label: "Breakeven inflation", formula: "nominal yield − TIPS (real) yield", example: `${BR_EX.nominal}% − ${BR_EX.real}% = ${BR_BREAKEVEN} pts` },
    ],
    note: "Durations from iShares as of Nov 10, 2026. The ladder and yield numbers are illustrative. The duration rule is an approximation that works best for small moves.",
  },
  calculator: {
    title: "Try it: duration and a ladder",
    inputs: [
      { id: "dur", label: "Duration (years)", value: BR_DURATIONS.TLT, step: 0.5 },
      { id: "dy", label: "Change in yield (percentage points)", value: BR_EX.jump, step: 0.25 },
      { id: "total", label: "Ladder amount ($)", value: BR_EX.ladderTotal, step: 5000 },
      { id: "years", label: "Rungs (one per year)", value: BR_EX.ladderYears, step: 1 },
    ],
    compute: (v) => {
      const years = Math.round(v.years ?? 0);
      return [
        { label: "Approximate price change", value: pct(durationPriceChangePct(v.dur ?? 0, v.dy ?? 0), 1) },
        { label: "Each rung", value: years > 0 ? usd(ladderRungs(v.total ?? 0, years)[0]!.amount, 0) : "—" },
        { label: "Average maturity", value: years > 0 ? `${ladderAvgMaturity(years)} years` : "—" },
      ];
    },
    note: "Try SGOV's duration (0.1) with a 1-point move, then TLT's.",
  },
  drills: [
    { id: "br-d1", prompt: "Yields rise 1 percentage point. Which fund falls the most?", options: ["SGOV", "SHY", "IEF", "TLT"], answer: 3, why: `TLT's duration (≈ ${BR_DURATIONS.TLT} yrs) is the longest.` },
    { id: "br-d2", prompt: `A fund with duration ${BR_DURATIONS.IEF}: yields fall 1 point. Price change?`, options: ["About −6.8%", "About +6.8%", "About +1%", "No change"], answer: 1, why: "Opposite direction, about the duration number (FINRA)." },
    { id: "br-d3", prompt: "Money needed in six months. Which matches the date best?", options: ["A 20+ year Treasury fund", "Treasury bills or a 0–3 month bill fund", "A TIPS fund", "Gold"], answer: 1, why: "Near-zero duration; maturities fit the need." },
    { id: "br-d4", prompt: "A ladder rung matures. The standard ladder move is…", options: ["Reinvest at the long end of the ladder", "Wait for higher rates", "Sell the other rungs", "Buy stocks"], answer: 0, why: "Vanguard: reinvest the matured bond at the far end to keep the ladder." },
    { id: "br-d5", prompt: "TIPS protect you against…", options: ["Rising real yields", "Inflation eroding principal", "All price drops", "Stock market falls"], answer: 1, why: "Principal adjusts with CPI; prices still move with real yields." },
  ],
  caveats: [
    { title: "Durations change", text: "Fund durations shift daily; read the fund page before relying on a number." },
    { title: "A rule of thumb", text: "−duration × Δyield is an approximation; big moves and convexity change the result." },
    { title: "Funds never mature", text: "A bond fund keeps rolling its holdings, so unlike one bond held to maturity its price risk does not fade." },
    { title: "Safety of what?", text: "Treasuries carry little credit risk but full interest rate and inflation risk." },
  ],
  sources: [
    { label: "FINRA: Brush up on bonds — interest rate changes and duration", url: "https://www.finra.org/investors/insights/bonds-interest-rate-changes-duration", supports: "Duration definition and the 1-point rule of thumb; duration vs maturity; hold to maturity" },
    { label: "SEC Investor.gov: When interest rates go up, prices of fixed-rate bonds fall", url: "https://www.investor.gov/introduction-investing/general-resources/news-alerts/alerts-bulletins/investor-bulletins-86", supports: "Rates vs prices; $925 / $1,082 examples; even Treasuries carry interest rate risk" },
    { label: "TreasuryDirect: Treasury Inflation-Protected Securities (TIPS)", url: "https://www.treasurydirect.gov/marketable-securities/tips/", supports: "Principal adjusts with CPI; interest every six months; greater of adjusted or original principal at maturity" },
    { label: "iShares: TLT, IEF, SHY, SGOV and TIP fund pages", url: "https://www.ishares.com/us/products/239454/ishares-20-year-treasury-bond-etf", supports: "Effective durations as of Nov 10, 2026 (TLT 14.83, IEF 6.81, SHY 1.81, SGOV 0.10, TIP 6.28)" },
    { label: "Fidelity: How to build a bond ladder", url: "https://www.fidelity.com/viewpoints/investing-ideas/bond-ladder-strategy", supports: "Ladder basics; high-quality noncallable bonds; hold to maturity; Treasury ladders for smaller amounts" },
    { label: "Vanguard: Strategies for investing in individual bonds", url: "https://investor.vanguard.com/investor-resources-education/online-trading/bond-strategies", supports: "Ladder reinvestment at the long end; ladders are conservative and do not maximize returns" },
  ],
  links: [
    { label: "Learn → Bonds & Rates", to: "/training?group=bonds-rates" },
    { label: "Coach → Duration before yield", to: "/coach/bonds-duration" },
    { label: "Playbook → A Treasury ladder for a known need", to: "/playbooks/treasury-bond-ladder" },
    { label: "Macro desk", to: "/macro" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  simulations: THEME_SIMS["bonds-rates"],
  mode: "bond_duration",
  modeLabel: "Bonds: read duration first",
  modeTip:
    "For a rates headline, ask which yields moved (short or long), then multiply by your holding's duration. Money with a date belongs in something that matures near that date. Cases → Market-wide news.",
  questions: [
    mc("BR-01", "When market interest rates rise, prices of existing fixed-rate bonds…", "B", "Fall", ["Rise", "Do not change", "Double"], "Investor.gov: rates and fixed-rate bond prices move in opposite directions.", "interest-rate-risk"),
    mc("BR-02", "Does interest rate risk apply to U.S. Treasury bonds?", "A", "Yes; the guarantee covers interest and principal at maturity, not the market price", ["No, Treasuries cannot lose value", "Only to TIPS", "Only after a downgrade"], "Investor.gov calls the 'government bonds never lose value' idea a misconception.", "interest-rate-risk"),
    mc("BR-03", "Duration measures…", "C", "How sensitive a bond's price is to interest rate changes", ["The date the bond repays principal", "The coupon rate", "The credit rating"], "FINRA: duration is not maturity; maturity is just the repayment date.", "bond-duration"),
    mc("BR-04", "Duration 10, rates rise 1 percentage point. Approximate price change?", "D", "About −10%", ["About +10%", "About −1%", "About −0.1%"], "FINRA's rule of thumb: about the duration number, in the opposite direction.", "bond-duration"),
    mc("BR-05", `TLT's effective duration (iShares, Nov 2026) was about ${BR_DURATIONS.TLT} years. A 0.5-point yield rise implies about…`, "B", pct(BR_TLT_JUMP, 1), ["−0.5%", "+7.4%", "−14.8%"], "Duration × change in yield: 14.83 × 0.5, with the sign flipped.", "bond-duration"),
    mc("BR-06", "Rank by duration, lowest to highest", "A", "SGOV, SHY, IEF, TLT", ["TLT, IEF, SHY, SGOV", "SHY, SGOV, TLT, IEF", "IEF, SGOV, SHY, TLT"], "Bills (0–3 months), then 1–3, 7–10 and 20+ year Treasuries.", "treasury-bill-fund"),
    mc("BR-07", "Other things equal, which bond has the higher duration?", "C", "A lower coupon and a longer maturity", ["A higher coupon and a shorter maturity", "A higher coupon and the same maturity", "Coupon and maturity do not matter"], "FINRA: higher coupon lowers duration; longer maturity raises it.", "bond-duration"),
    mc("BR-08", "A Treasury bill fund like SGOV mainly carries…", "D", "Reinvestment risk: income falls soon after short rates fall", ["Large price risk from rate moves", "High credit risk", "Stock market risk"], "Near-zero duration means little price risk, but income resets fast.", "reinvestment-risk"),
    mc("BR-09", "TIPS principal…", "B", "Rises with inflation and falls with deflation, and you never get less than the original at maturity", ["Is fixed like other Treasuries", "Rises with stock prices", "Is paid monthly"], "TreasuryDirect describes the CPI adjustment and the maturity floor.", "tips-bond"),
    mc("BR-10", `Nominal 10-year yield ${BR_EX.nominal}%, 10-year TIPS yield ${BR_EX.real}%. Breakeven inflation?`, "A", `${BR_BREAKEVEN} percentage points`, ["6.1 percentage points", "1.9 percentage points", "4.2 percentage points"], "Nominal minus real yield gives the inflation rate the market is pricing.", "tips-bond"),
    mc("BR-11", "The Fed cuts its policy rate, yet the 10-year yield rises. This is…", "C", "Possible; long yields also price inflation, growth, supply and a term premium", ["Impossible", "Proof the Fed raised rates", "Only a data error"], "The Fed sets a short rate; long yields are set in the market.", "interest-rate-risk"),
    mc("BR-12", "A bond ladder is…", "D", "Bonds of similar size with staggered maturities", ["One bond bought in several steps", "Bonds from a single issuer", "Only long-term bonds"], "Vanguard: relatively equal amounts, staggered maturities.", "bond-ladder"),
    mc("BR-13", "Fidelity suggests keeping which bonds out of a ladder?", "B", "Callable bonds", ["Treasuries", "Bonds rated A or better", "Bonds held to maturity"], "A call returns principal early and breaks the schedule.", "bond-ladder"),
    mc("BR-14", "Why does a bond fund's rate risk not fade the way one bond's does as it nears maturity?", "A", "The fund keeps replacing maturing bonds, so its duration stays roughly constant", ["Funds hold no bonds", "Funds are guaranteed", "Funds have zero duration"], "An individual bond's duration shrinks to zero at maturity; a fund's does not.", "reinvestment-risk"),
  ],
  terms: TERMS,
  cases: CASES,
};
