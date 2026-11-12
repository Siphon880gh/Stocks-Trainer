/**
 * Fold-in for Forex: currency funds and the dollar (/practice/currency-funds). A forex pair, a currency futures
 * contract, a futures-based dollar fund (UUP) and a currency trust (FXE, FXY) all express "the dollar" differently.
 * Sources: ICE (USDX weights), FINRA, Invesco, CME, FRED. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { mc, pct, r2, seededTape } from "./helpers";

/** ICE U.S. Dollar Index fixed weights (ICE rulebook 15.01). */
export const USDX_WEIGHTS: { currency: string; weight: number }[] = [
  { currency: "Euro", weight: 57.6 },
  { currency: "Japanese yen", weight: 13.6 },
  { currency: "British pound", weight: 11.9 },
  { currency: "Canadian dollar", weight: 9.1 },
  { currency: "Swedish krona", weight: 4.2 },
  { currency: "Swiss franc", weight: 3.6 },
];

/** USD return of holding a foreign currency for a year: price change plus deposit interest minus the fund fee. */
export function foreignCurrencyReturnPct(startRate: number, endRate: number, depositRatePct: number, feePct = 0): number {
  return r2(((endRate / startRate) * (1 + depositRatePct / 100) - 1) * 100 - feePct);
}

export const FX_EX = { start: 1.1, end: 1.067, deposit: 2, fee: 0.4 } as const;
export const FX_EX_RETURN = foreignCurrencyReturnPct(FX_EX.start, FX_EX.end, FX_EX.deposit, FX_EX.fee);

const TERMS: LiteracyTerm[] = [
  { id: "currency-trust", name: "Currency trust", category: "ownership", summary: "An exchange-traded trust that holds deposits in one foreign currency, such as euros or yen.", detail: "Its value in dollars moves with that one exchange rate, plus any deposit interest, minus expenses. FINRA notes currency ETPs vary in how they are backed and can involve speculative trading. Educational, not advice." },
  { id: "currency-futures-fund", name: "Currency futures fund", category: "ownership", summary: "A fund that gets currency exposure by holding currency or dollar-index futures, rolled over time.", detail: "UUP, for example, is long the U.S. dollar against a defined basket through futures. Like other futures funds, its result includes roll effects and interest on the cash it holds. Educational, not advice." },
  { id: "dollar-index-weights", name: "Dollar index weights", category: "markets", summary: "The ICE U.S. Dollar Index is a fixed basket: euro 57.6%, yen 13.6%, pound 11.9%, Canadian dollar 9.1%, krona 4.2%, franc 3.6%.", detail: "Because the euro is more than half the basket, the index mostly reflects EUR/USD. The Federal Reserve's broad dollar index covers many more currencies and is reweighted. Educational, not advice." },
  { id: "interest-rate-differential", name: "Interest-rate differential", category: "markets", summary: "The gap between two currencies' interest rates; holding the higher-yielding one earns the gap, all else equal.", detail: "Forex positions held overnight pay or earn this through rollover (swap). Rate gaps are a major driver of currencies, and a surprise central-bank move can reverse a pair quickly. Educational, not advice." },
];

const T1 = seededTape({ seed: 9201, start: 1.09, preDrift: -0.0015, postDrift: -0.002, vol: 0.004 });
const T2 = seededTape({ seed: 9202, start: 28.4, preDrift: 0.001, postDrift: 0.0005, vol: 0.006 });
const T3 = seededTape({ seed: 9203, start: 148.2, preDrift: 0.0012, postDrift: -0.004, vol: 0.006, gap: -0.018 });

const base = { contextType: "news" as const, thinkingMode: "currency_wrapper" as const, packId: "forex" as const, assetClass: "forex" as const, difficulty: "beginner" as const, allowShort: false };

const CASES: CaseStudy[] = [
  {
    ...base,
    id: "case-fx-wrap-euro-trust-vs-index",
    title: "Currency wrapper: you wanted the dollar index, you bought a euro trust",
    brief: "SAMPLE hypothetical. You expected the dollar to weaken against the yen after a Bank of Japan meeting and bought a euro currency trust because \"it's the big one in the dollar index.\" The yen did strengthen, but the euro fell after weak European data, and your trust is down 1.6%. Buy = add to the euro trust. Sell = exit and, if the yen view still holds, use a wrapper that holds yen. Hold = keep it.",
    newsHeadline: "Euro slips on weak factory data; yen firms after the BoJ.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "A euro trust holds one currency, so it tracks EUR/USD, not the yen and not the whole dollar index. The wrapper did not match the thesis. Holding is partial credit only if you also had a separate euro view.",
      whyMarketMoved: "European data disappointed, so the euro fell even while the yen rose.",
      evidence: "SAMPLE: the trust kept drifting lower over the next four sessions. ICE weights the euro at 57.6% of the dollar index, but a single-currency trust is 100% one currency.",
    },
  },
  {
    ...base,
    id: "case-fx-wrap-dollar-fund-carry",
    title: "Currency wrapper: the dollar fund's quiet year",
    brief: "SAMPLE hypothetical. You hold a futures-based long-dollar fund as a hedge for foreign holdings. Over the year the dollar index is almost unchanged, yet the fund is up a few percent, mostly from the interest earned on its Treasury collateral and the futures pricing in the U.S. rate advantage. Buy = add because \"it always goes up.\" Sell = sell because the dollar did nothing. Hold = keep it sized as a hedge.",
    newsHeadline: "Dollar index ends the year flat; U.S. short rates still above Europe's.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: [],
    debrief: {
      process: "The fund's return comes from the dollar index futures it holds plus interest on its collateral. A rate gap in favor of the dollar can add return in a flat year, and it can shrink when rates converge. Keep it for the job you bought it for; neither \"always up\" nor \"it did nothing\" describes the product.",
      whyMarketMoved: "Interest-rate differentials, not a dollar rally, produced the gain.",
      evidence: "SAMPLE: the fund edged higher over the next four sessions with the index flat.",
    },
  },
  {
    ...base,
    id: "case-fx-wrap-yen-trust-intervention",
    title: "Currency wrapper: yen trust after an intervention headline",
    brief: "SAMPLE hypothetical. You own a small yen currency trust as a planned bet that USD/JPY falls. Overnight, Japan's finance ministry confirmed it sold dollars for yen; USD/JPY dropped almost 2% before New York opened. Buy = triple the position at the open. Sell = take the planned profit at the target you set (it was hit). Hold = ignore the target and hope for more.",
    newsHeadline: "Japan confirms yen-buying intervention; USD/JPY slides overnight.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: "Forex trades nearly around the clock, so the trust gapped at the open to catch up. Your target was hit; taking it follows the plan. Interventions can fade or extend, and that uncertainty is why the target existed. Tripling up after the move adds risk at a worse price.",
      whyMarketMoved: "Official yen buying pushed USD/JPY lower while U.S. exchanges were closed.",
      evidence: "SAMPLE: USD/JPY partly retraced over the next four sessions.",
    },
  },
];

export const CURRENCY_FUNDS: MarketTheme = {
  id: "currency-funds",
  route: "/practice/currency-funds",
  practiceTitle: "Currency funds and the dollar",
  title: "Currency funds and the dollar",
  blurb:
    "Four ways to express a view on the dollar: a forex pair, a currency futures contract, a futures-based dollar fund and a single-currency trust. Each tracks something different. Part of the Forex lessons. Educational, not advice.",
  marketForces:
    "Market Forces lists UUP (Currency futures), FXE and FXY (Currency trust) under Markets › Asset class › Currency market and Economic forces › U.S. dollar. This lesson explains those labels.",
  asOf: "2026-11-12",
  quiz: {
    name: "Currency Funds & the Dollar",
    description:
      "Forex pair vs currency futures vs a futures-based dollar fund vs a single-currency trust; the ICE dollar index's fixed weights, the broad dollar index, interest-rate differentials and rollover, deposit interest and fees in a trust, and gaps when forex moves overnight",
    icon: "currency_exchange",
  },
  intro: [
    "\"The dollar went up\" needs a second question: against what? The ICE U.S. Dollar Index is a fixed basket of six currencies, more than half of it the euro. A euro trust holds only euros. A forex pair is one exchange rate.",
    "Currency products also earn or pay interest. Holding a higher-yielding currency earns the rate gap; a futures-based fund builds that gap into its futures prices and the interest on its collateral.",
  ],
  wrappers: [
    { name: "Forex pair (spot)", examples: "EUR/USD, USD/JPY", owns: "A position in one exchange rate, usually on margin", tracks: "That pair, nearly around the clock", watch: "Leverage, rollover (swap) each night, spreads widen in thin hours" },
    { name: "Currency futures", examples: "CME euro FX, yen; ICE dollar index futures", owns: "A contract for a set amount of currency at a later date", tracks: "That contract month (spot plus the rate gap to expiry)", watch: "Margin, expiration and rolling, contract size" },
    { name: "Futures-based dollar fund", examples: "UUP (long dollar vs a defined basket)", owns: "Dollar index futures plus Treasury collateral", tracks: "Its index of rolled futures, not the spot index exactly", watch: "Roll effects, interest on collateral, the basket's euro weight" },
    { name: "Single-currency trust", examples: "FXE (euro), FXY (yen)", owns: "Deposits in one currency", tracks: "That currency against the dollar, plus deposit interest, minus fees", watch: "One currency only; deposit interest can be below market rates; trading hours" },
  ],
  drivers: [
    { title: "Rate differentials", text: "Central-bank rates and expectations are a major driver. A currency whose rates are expected to rise relative to another's often strengthens." },
    { title: "Growth and risk appetite", text: "Risk-off moves often lift the dollar, yen and Swiss franc; risk-on moves often help commodity currencies like the Australian dollar." },
    { title: "Fixed vs broad baskets", text: "The ICE index has fixed weights set when it began and changed only when the euro replaced its legacy currencies. The Federal Reserve's broad dollar index covers many more trading partners." },
    { title: "Official action", text: "Governments sometimes intervene. Intervention can move a pair sharply overnight; it does not guarantee the trend that follows." },
  ],
  bridges: [
    { title: "U.S. dollar → commodities", text: "Most commodities are priced in dollars, so a stronger dollar can weigh on them. See the commodity themes." },
    { title: "U.S. dollar → foreign stocks", text: "A U.S. investor in a developed or emerging-markets fund earns the local return plus the currency move. See Index and style building blocks." },
    { title: "Interest rates → currencies", text: "When U.S. short rates rise faster than others, holding dollars earns more, which can support the dollar. See Bonds and rates." },
  ],
  math: {
    title: "What a currency position earns",
    rows: [
      { label: "Exchange-rate change", formula: "end ÷ start − 1", example: `${FX_EX.end} ÷ ${FX_EX.start} − 1 = ${pct(r2((FX_EX.end / FX_EX.start - 1) * 100))}` },
      { label: "Plus deposit interest", formula: "× (1 + deposit rate)", example: `${FX_EX.deposit}% on the foreign deposit` },
      { label: "Minus the fund fee", formula: "− expense ratio", example: `${FX_EX.fee}% a year` },
      { label: "Year in dollars", formula: "(end ÷ start) × (1 + r) − 1 − fee", example: pct(FX_EX_RETURN) },
    ],
    note: "Illustrative numbers. A trust's deposit rate is set by its depository bank and can differ from market rates; check the fund documents.",
  },
  calculator: {
    title: "Try it: one year in a currency trust",
    inputs: [
      { id: "start", label: "Start rate (USD per unit)", value: FX_EX.start, step: 0.001 },
      { id: "end", label: "End rate (USD per unit)", value: FX_EX.end, step: 0.001 },
      { id: "deposit", label: "Deposit interest %", value: FX_EX.deposit, step: 0.1 },
      { id: "fee", label: "Expense ratio %", value: FX_EX.fee, step: 0.05 },
    ],
    compute: (v) => {
      const s = v.start ?? 0;
      if (s <= 0) return [{ label: "Return in dollars", value: "—" }];
      return [
        { label: "Exchange-rate part", value: pct(r2(((v.end ?? 0) / s - 1) * 100), 2) },
        { label: "Return in dollars", value: pct(foreignCurrencyReturnPct(s, v.end ?? 0, v.deposit ?? 0, v.fee ?? 0), 2) },
      ];
    },
    note: "Rates quoted as dollars per unit of the foreign currency (like EUR/USD).",
  },
  drills: [
    { id: "fx-d1", prompt: "About what share of the ICE U.S. Dollar Index is the euro?", options: ["13.6%", "57.6%", "25%", "100%"], answer: 1, why: "ICE fixes it at 57.6%, so the index mostly tracks EUR/USD." },
    { id: "fx-d2", prompt: "You want yen exposure in a brokerage account. Which wrapper tracks the yen alone?", options: ["A long-dollar futures fund", "A yen currency trust", "A euro trust", "A dollar index futures contract"], answer: 1, why: "A single-currency trust holds yen deposits." },
    { id: "fx-d3", prompt: "The dollar index is flat for a year, but a long-dollar futures fund is up 3%. Most likely why?", options: ["A hidden stock position", "Rate differential and collateral interest", "The fund owns gold", "Fees were refunded"], answer: 1, why: "Futures and collateral interest carry the U.S. rate advantage." },
    { id: "fx-d4", prompt: "A forex pair held overnight…", options: ["Never earns or pays interest", "Earns or pays rollover based on the rate gap", "Is closed automatically", "Converts into a trust"], answer: 1, why: "Rollover (swap) reflects the interest-rate differential." },
  ],
  caveats: [
    { title: "One currency is not the dollar", text: "A euro or yen trust is one exchange rate. The dollar index is a basket, and the broad index is a bigger one." },
    { title: "Leverage in pairs and futures", text: "Forex and futures accounts use margin; small moves can be large gains or losses relative to the deposit." },
    { title: "Overnight moves", text: "Forex trades nearly around the clock; an exchange-listed fund catches up at the open." },
  ],
  sources: [
    { label: "ICE: U.S. Dollar Index futures", url: "https://www.ice.com/forex/usdx", supports: "Fixed basket; composition changed only when the euro launched" },
    { label: "ICE: USDX contract rules (weights)", url: "https://www.ice.com/publicdocs/rulebooks/futures_us/15_ICE_USDX_Futures_and_Options.pdf", supports: "Euro 57.6%, yen 13.6%, pound 11.9%, CAD 9.1%, SEK 4.2%, CHF 3.6%" },
    { label: "FINRA: Exchange-traded funds and products", url: "https://www.finra.org/investors/investing/investment-products/exchange-traded-funds-and-products", supports: "Currency ETPs, how they are backed, grantor trusts" },
    { label: "FRED: Broad dollar index", url: "https://fred.stlouisfed.org/series/DTWEXBGS", supports: "The Federal Reserve's broad trade-weighted dollar" },
  ],
  links: [
    { label: "Learn → Currency Funds & the Dollar", to: "/training?group=currency-funds" },
    { label: "Learn → Forex Literacy", to: "/training?group=forex-literacy" },
    { label: "Coach → Dollar view, which wrapper", to: "/coach/currency-funds-dollar" },
    { label: "Practice → Same theme, different wrapper", to: "/practice/exposure-wrappers" },
    { label: "Cases → Forex", to: "/cases?pack=forex" },
    { label: "Macro → The dollar", to: "/macro" },
  ],
  mode: "currency_wrapper",
  modeLabel: "Currency: which wrapper, which basket",
  modeTip:
    "Ask \"the dollar against what?\" A trust is one currency, the ICE index is a fixed six-currency basket led by the euro, and a futures fund adds roll and collateral interest. Check the rate gap and whether the move happened while the exchange was shut. Cases → Forex.",
  questions: [
    mc("CURF-01", "What does a euro currency trust hold?", "A", "Euro deposits", ["Dollar index futures", "European stocks", "Gold"], "Its dollar value moves with EUR/USD, plus deposit interest, minus fees.", "currency-trust"),
    mc("CURF-02", "How does UUP get long-dollar exposure?", "C", "Dollar index futures plus Treasury collateral", ["Physical dollar bills in a vault", "U.S. bank stocks", "Euro deposits"], "It is a futures-based fund.", "currency-futures-fund"),
    mc("CURF-03", "Which currency has the largest weight in the ICE U.S. Dollar Index?", "B", "The euro (57.6%)", ["The yen", "The Chinese yuan", "The Canadian dollar"], "ICE's index rulebook fixes the euro at 57.6%, far ahead of the yen at 13.6%.", "dollar-index-weights"),
    mc("CURF-04", "How many currencies are in the ICE U.S. Dollar Index?", "D", "Six", ["Two", "Twenty-six", "One hundred"], "Euro, yen, pound, Canadian dollar, krona, franc.", "dollar-index-weights"),
    mc("CURF-05", "When did the index's composition last change?", "A", "When the euro replaced several European currencies in 1999", ["Every quarter", "Every year by the Fed", "It has never had European currencies"], "ICE: the euro took over the legacy currencies' fixed 57.6%.", "us-dollar-index"),
    mc("CURF-06", "Which dollar measure covers many more trading partners and is reweighted?", "C", "The Federal Reserve's broad dollar index", ["The ICE U.S. Dollar Index", "A euro trust", "USD/JPY"], "FRED publishes it as DTWEXBGS.", "us-dollar-index"),
    mc("CURF-07", "Holding the higher-yielding currency in a pair overnight usually…", "B", "Earns the rate gap through rollover, all else equal", ["Costs nothing and earns nothing", "Always loses money", "Is illegal"], "Rollover reflects the interest-rate differential.", "interest-rate-differential"),
    mc("CURF-08", `EUR/USD goes from ${FX_EX.start} to ${FX_EX.end}; a euro trust earns ${FX_EX.deposit}% interest and charges ${FX_EX.fee}%. Your year in dollars is about…`, "D", pct(FX_EX_RETURN), [pct(FX_EX.deposit), "0%", pct(r2((FX_EX.end / FX_EX.start - 1) * 100))], "Rate change, plus interest, minus fee.", "currency-trust"),
    mc("CURF-09", "You expect the yen to rise. Why is a euro trust the wrong wrapper?", "A", "It tracks the euro, not the yen", ["Trusts cannot rise", "The euro is not in the dollar index", "Yen trusts do not exist"], "Match the wrapper to the currency in your thesis.", "currency-trust"),
    mc("CURF-10", "A long-dollar futures fund is up in a year the index was flat. A likely reason?", "C", "Collateral interest and the rate gap built into futures", ["It secretly owns stocks", "Fees were negative", "Futures always rise"], "Rate differentials can add return; they can also shrink.", "currency-futures-fund"),
    mc("CURF-11", "Forex moved 2% overnight. When does a U.S.-listed currency trust show it?", "B", "At the next exchange open, as a gap", ["Never", "Only at month end", "Only if you call the issuer"], "Exchange products trade during exchange hours.", "currency-trust"),
    mc("CURF-12", "What can a single central-bank surprise do to a pair?", "D", "Move it sharply in minutes and change the rate gap", ["Nothing; pairs only move on GDP", "Close the market for a month", "Fix it permanently"], "Rate decisions and guidance are major currency drivers.", "interest-rate-differential"),
  ],
  terms: TERMS,
  cases: CASES,
};
