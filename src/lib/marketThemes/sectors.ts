/**
 * MK7 · Sectors and rotation (/practice/sectors-rotation): the 11 GICS sectors and their Select Sector SPDR funds,
 * cyclical vs defensive, what a sector fund really holds (concentration and overlap), real estate as one REIT module
 * (XLRE vs VNQ, equity vs mortgage REITs), and the business-cycle rotation idea with its mixed evidence.
 * Complements the desk term `sector-rotation`. Sources: S&P DJI, State Street, Vanguard, SEC Investor.gov, FINRA,
 * Fidelity, NBER, Stangl/Jacobsen/Visaltanachoti. Educational, not advice.
 */
import type { CaseStudy } from "../caseStudies";
import type { LiteracyTerm } from "../literacyTerms";
import type { MarketTheme } from "./types";
import { withSims } from "../toolTraining/simWalk";
import { THEME_SIMS } from "./simulations";
import { mc, pct, r2, seededTape } from "./helpers";

/** Relative strength in percentage points: sector return − market return. */
export const relativeStrengthPts = (sectorReturnPct: number, marketReturnPct: number) => r2(sectorReturnPct - marketReturnPct);
/** Look-through weight of one stock across two funds: share A × weight in A + share B × weight in B (all in %). */
export const lookThroughWeightPct = (shareA: number, weightA: number, shareB: number, weightB: number) =>
  r2((shareA * weightA + shareB * weightB) / 100);
/** Sum of the largest weights, in %. */
export const topWeightsPct = (weights: number[]) => r2(weights.reduce((a, b) => a + b, 0));

/** State Street daily holdings files, as of Nov 11, 2026 (rounded). */
export const SECTOR_AS_OF = "2026-11-11";
export const XLK_TOP = { AAPL: 16.2, NVDA: 13.1, MSFT: 12.1 } as const;
export const XLF_TOP = { BRKB: 13.3, JPM: 11.1, V: 8.8, MA: 6.5 } as const;
export const XLRE_TOP = { WELL: 11.6, PLD: 8.0, EQIX: 6.8, AMT: 5.8 } as const;
/** Vanguard VNQ profile page (Nov 12, 2026): MSCI US IMI Real Estate 25/50 benchmark, 139 stocks, 0.13% expense ratio. */
export const VNQ_FACTS = { stocks: 139, expenseRatio: 0.13 } as const;
export const XLK_TOP3 = topWeightsPct(Object.values(XLK_TOP));
/** Illustrative numbers only (not market data). */
export const SR_EX = { sector: 9, market: 6, core: 80, tilt: 20, appleInIndex: 6 } as const;
export const SR_RS = relativeStrengthPts(SR_EX.sector, SR_EX.market);
export const SR_LOOK = lookThroughWeightPct(SR_EX.core, SR_EX.appleInIndex, SR_EX.tilt, XLK_TOP.AAPL);
/** Stangl, Jacobsen & Visaltanachoti: best case with perfect foresight, no costs, since 1948. */
export const ROTATION_BEST_CASE_PCT = 2.3;

const TERMS: LiteracyTerm[] = [
  { id: "gics-sector", name: "GICS sector", category: "markets", summary: "One of the 11 top-level groups in the Global Industry Classification Standard that S&P and MSCI use to sort companies.", detail: "Each company gets one classification, based mainly on revenue. The structure has 11 sectors, 25 industry groups, 74 industries and 163 sub-industries, reviewed every year, so a company's sector can change. Educational, not advice." },
  { id: "cyclical-vs-defensive", name: "Cyclical vs defensive sectors", category: "markets", summary: "Cyclical sectors (discretionary, financials, industrials, materials, energy) swing with the economy; defensive ones (staples, utilities, health care) swing less.", detail: "S&P describes consumer discretionary as the most sensitive to economic cycles and staples as less sensitive. Defensive does not mean safe: these stocks still fall in sell-offs, and they are sensitive to interest rates. Educational, not advice." },
  { id: "sector-fund-concentration", name: "Sector fund concentration", category: "markets", summary: "Market-cap weighting can leave a few companies with a large share of a sector fund.", detail: `In State Street's XLK holdings (as of ${SECTOR_AS_OF}) Apple, Nvidia and Microsoft were about ${XLK_TOP3}% combined. Read the top holdings before treating a sector fund as diversified. Educational, not advice.` },
  { id: "fund-overlap", name: "Fund overlap", category: "process", summary: "Owning the same companies through several funds, so your real exposure is bigger than any one position looks.", detail: "FINRA's example: individual tech stocks, plus a tech fund, plus an index fund that also holds tech. Add up look-through weights before adding a sector fund to a broad index fund. Educational, not advice." },
  { id: "equity-vs-mortgage-reit", name: "Equity REIT vs mortgage REIT", category: "markets", summary: "Equity REITs own and run properties and sit in the Real Estate sector; mortgage REITs hold real-estate loans and sit in Financials.", detail: "SEC Investor.gov: REITs let individuals share in income from large-scale real estate; REIT dividends are generally taxed as ordinary income. Real estate funds today hold towers, data centers, warehouses and health care properties as well as offices and malls. Educational, not advice." },
  { id: "business-cycle-phases", name: "Business cycle phases", category: "markets", summary: "Fidelity's four phases: early cycle, mid-cycle, late cycle and recession, each with sectors that have historically led or lagged.", detail: "Fidelity warns no investment has behaved the same in every cycle, phases vary in length and can be skipped, and NBER dates recessions only months after they start. Educational, not advice." },
];

const T1 = seededTape({ seed: 9901, start: 231.4, preDrift: 0.003, postDrift: -0.005, vol: 0.016, gap: -0.035 });
const T2 = seededTape({ seed: 9902, start: 79.8, preDrift: 0.0025, postDrift: -0.001, vol: 0.01 });
const T3 = seededTape({ seed: 9903, start: 41.6, preDrift: 0.001, postDrift: 0.002, vol: 0.014, gap: -0.03 });

const CASES: CaseStudy[] = [
  {
    id: "case-sr-tech-fund-on-index-fund",
    title: "Sectors: adding a tech fund to an index fund for \"diversification\"",
    contextType: "news",
    thinkingMode: "sector_cycle",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. You hold a broad S&P 500 fund and, to \"diversify\", moved a large slice into the technology sector fund (XLK). Then you read its holdings: Apple, Nvidia and Microsoft were about ${XLK_TOP3}% of XLK (State Street, ${SECTOR_AS_OF}), and your index fund already owns them. A chip-export headline hits the group and XLK gaps down 3.5%. Buy = add more XLK on the dip. Sell = trim XLK back to a planned, smaller tilt now that you see the overlap. Hold = keep the oversized slice.`,
    newsHeadline: "Chip stocks slide on export curbs; technology sector fund gaps lower.",
    preOhlc: T1.pre,
    postOhlc: T1.full,
    correctActions: ["sell"],
    acceptablePartial: ["hold"],
    debrief: {
      process: `A sector fund adds concentration, not diversification. With ${SR_EX.core}% in an index fund (say Apple is ${SR_EX.appleInIndex}% there, illustrative) and ${SR_EX.tilt}% in XLK (Apple ${XLK_TOP.AAPL}%), your look-through Apple weight is about ${SR_LOOK}%. FINRA names exactly this pattern as concentration risk. Holding is partial credit only if the larger tech weight was a deliberate, written choice.`,
      whyMarketMoved: "One headline hit the few companies that dominate the sector fund.",
      evidence: "SAMPLE: XLK stayed weak over the next four sessions.",
    },
  },
  {
    id: "case-sr-recession-called-late",
    title: "Sectors: a recession is announced months after it began",
    contextType: "news",
    thinkingMode: "sector_cycle",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: "SAMPLE hypothetical. The NBER announces that a recession began eight months ago. Consumer staples have already outperformed for most of a year. A newsletter says \"recession means staples and utilities, rotate now\". You hold a broad stock fund with a written plan. Buy = move most of your stocks into staples and utilities today. Hold = keep your planned mix; any tilt stays small and pre-planned. Sell = sell all stocks until the recession ends.",
    newsHeadline: "NBER dates the start of a recession to eight months ago.",
    preOhlc: T2.pre,
    postOhlc: T2.full,
    correctActions: ["hold"],
    acceptablePartial: ["buy"],
    debrief: {
      process: `NBER says it dates peaks and troughs months after the fact. By the announcement, prices have usually moved. Stangl, Jacobsen and Visaltanachoti found that even with perfect foresight and no costs, textbook rotation added at best about ${ROTATION_BEST_CASE_PCT}% a year since 1948, and much less with realistic timing. A small tilt that was already in your plan is partial credit; a wholesale switch on old news is a timing bet.`,
      whyMarketMoved: "Defensive sectors had already priced in the slowdown before the announcement.",
      evidence: "SAMPLE: the staples fund drifted sideways after the announcement.",
    },
  },
  {
    id: "case-sr-reit-fund-rates-jump",
    title: "Sectors: real estate falls as yields jump",
    contextType: "news",
    thinkingMode: "sector_cycle",
    packId: "macro-news",
    difficulty: "beginner",
    allowShort: false,
    brief: `SAMPLE hypothetical. Your plan holds a small, fixed slice in a real estate fund for property exposure and income. Treasury yields jump and the fund gaps down 3%. You check: its largest holdings are a health care landlord, warehouses, data centers and cell towers (XLRE top four ≈ ${XLRE_TOP.WELL}%, ${XLRE_TOP.PLD}%, ${XLRE_TOP.EQIX}%, ${XLRE_TOP.AMT}% as of ${SECTOR_AS_OF}). Buy = double the slice; the yield is higher now. Sell = exit; REITs are \"broken\" when rates rise. Hold = keep the planned slice and rebalance on schedule.`,
    newsHeadline: "Treasury yields climb; real estate stocks lead the market lower.",
    preOhlc: T3.pre,
    postOhlc: T3.full,
    correctActions: ["hold"],
    acceptablePartial: ["sell"],
    debrief: {
      process: "REITs borrow and pay out most of their income, so rising yields hit their prices; that is a known trait, not a broken thesis. Your plan already sized the slice for it. Doubling chases the yield; exiting is partial credit only if real estate never fit the plan. Investor.gov notes REIT dividends are generally taxed as ordinary income, which matters for where you hold them.",
      whyMarketMoved: "Higher yields raise REIT borrowing costs and make their dividends less attractive next to bonds.",
      evidence: "SAMPLE: the fund steadied over the next four sessions.",
    },
  },
];

export const SECTORS_ROTATION: MarketTheme = {
  id: "sectors-rotation",
  route: "/practice/sectors-rotation",
  practiceTitle: "Sectors and rotation: the 11 sectors, sector funds, REITs and the business cycle",
  title: "Sectors and rotation",
  blurb:
    "The 11 GICS sectors and their sector funds, cyclical vs defensive, what a sector fund really holds, real estate as one REIT module, and why business-cycle rotation is a way to set expectations rather than a reliable edge. Educational, not advice.",
  marketForces:
    "Market Forces lists one theme per sector (XLK, XLC, XLF, XLV, XLE, XLI, XLB, XLY, XLP, XLU) and two real estate themes (property and real estate, both VNQ and XLRE); here they are one lesson, with real estate folded into one REIT module. Holdings were read from State Street's files as of Nov 11, 2026.",
  asOf: "2026-11-12",
  quiz: {
    name: "Sectors & Rotation",
    description:
      "The 11 GICS sectors and how companies are classified; cyclical vs defensive; sector fund concentration (XLK's top three) and overlap with index funds; relative strength; equity vs mortgage REITs, XLRE vs VNQ and REIT taxes; Fidelity's business-cycle phases, NBER's late dating and the mixed evidence on rotation",
    icon: "pie_chart",
  },
  intro: [
    "S&P Dow Jones Indices and MSCI sort companies into 11 sectors under GICS: energy, materials, industrials, consumer discretionary, consumer staples, health care, financials, information technology, communication services, utilities and real estate. Each company gets one classification, based mainly on where its revenue comes from.",
    "Sector funds such as the Select Sector SPDRs (XLK, XLF, XLV…) hold the S&P 500 companies in one sector, weighted by size. They are tools for a deliberate tilt, not extra diversification on top of an index fund that already owns the same companies.",
  ],
  wrappers: [
    { name: "Cyclical sectors", examples: "XLY (discretionary) · XLF (financials) · XLI (industrials) · XLB (materials) · XLE (energy)", owns: "Companies whose sales swing with the economy, credit and commodity prices", tracks: "Growth, rates, credit and commodity cycles", watch: `XLF's top holdings include Berkshire (${XLF_TOP.BRKB}%), JPMorgan (${XLF_TOP.JPM}%) and Visa (${XLF_TOP.V}%) as of ${SECTOR_AS_OF}` },
    { name: "Technology and communication", examples: "XLK (information technology) · XLC (communication services)", owns: "Software, semiconductors and hardware; platforms, media and telecom", tracks: "Earnings growth and how much investors pay for it", watch: `XLK's top three were about ${XLK_TOP3}% combined; Alphabet and Meta are in XLC, not XLK` },
    { name: "Defensive sectors", examples: "XLP (staples) · XLU (utilities) · XLV (health care)", owns: "Food, household goods, utilities, drugs and health services", tracks: "Steadier demand; utilities are also rate-sensitive", watch: "Defensive is not risk-free; they still fall in broad sell-offs" },
    { name: "Real estate (REITs)", examples: `XLRE (S&P 500 real estate) · VNQ (Vanguard, ${VNQ_FACTS.stocks} stocks, ${VNQ_FACTS.expenseRatio}% expense ratio)`, owns: "Equity REITs and real estate companies: towers, data centers, warehouses, health care, retail, apartments", tracks: "Rents, occupancy, interest rates and borrowing costs", watch: "Mortgage REITs are in Financials under GICS; dividends are generally taxed as ordinary income" },
  ],
  drivers: [
    { title: "The business cycle", text: "Fidelity's research: consumer discretionary has beaten the market in every early cycle since 1962; technology has led mid-cycle; energy and utilities have done well late; staples, utilities and health care have held up best in recessions. It also says no investment has behaved uniformly in every cycle." },
    { title: "Interest rates", ...withSims(["Utilities and REITs borrow heavily and compete with bonds for income buyers; ", { text: "rising yields often weigh on them", sim: "mk-sr-rates" }, ". Banks can benefit from a steeper curve."]) },
    { title: "Commodities", text: "Oil sets much of energy's earnings; metals and chemicals drive materials. See Energy and Materials." },
    { title: "Concentration", text: "Market-cap weighting means a few giants can drive a sector fund. Read the holdings file, which State Street updates daily." },
    { title: "Classification changes", text: "GICS is reviewed every year, so a company can change sector and a sector fund's mix can shift without any trade by you." },
  ],
  bridges: [
    { title: "Bonds and rates", text: "Rate moves hit utilities, REITs and long-duration growth stocks; see Bonds and rates." },
    { title: "Energy, metals, materials", text: "Commodity lessons explain what drives XLE, XLB and miners." },
    { title: "Economic growth and slowdown", text: "Market Forces' slowdown theme pairs XLP, XLU and XLV with Treasuries; the cases here test that idea." },
    { title: "Index and style", text: "Sector weights inside the S&P 500 explain why the index can act like a tech fund; see Index and style." },
  ],
  math: {
    title: "Relative strength, concentration and look-through weight",
    rows: [
      { label: "Relative strength", formula: "sector return − market return", example: `${SR_EX.sector}% − ${SR_EX.market}% = ${SR_RS} percentage points` },
      { label: "Top-three concentration", formula: "sum of the largest weights", example: `XLK: ${XLK_TOP.AAPL} + ${XLK_TOP.NVDA} + ${XLK_TOP.MSFT} ≈ ${XLK_TOP3}% (${SECTOR_AS_OF})` },
      { label: "Look-through weight", formula: "share A × weight in A + share B × weight in B", example: `${SR_EX.core}% × ${SR_EX.appleInIndex}% + ${SR_EX.tilt}% × ${XLK_TOP.AAPL}% ≈ ${pct(SR_LOOK, 2)} in Apple` },
    ],
    note: "XLK weights are from State Street as of Nov 11, 2026; the index-fund weight and returns are illustrative.",
  },
  calculator: {
    title: "Try it: look-through weight and relative strength",
    inputs: [
      { id: "core", label: "Share in a broad index fund (%)", value: SR_EX.core, step: 5 },
      { id: "wCore", label: "Stock's weight in that fund (%)", value: SR_EX.appleInIndex, step: 0.5 },
      { id: "tilt", label: "Share in a sector fund (%)", value: SR_EX.tilt, step: 5 },
      { id: "wTilt", label: "Stock's weight in the sector fund (%)", value: XLK_TOP.AAPL, step: 0.5 },
      { id: "sector", label: "Sector return (%)", value: SR_EX.sector, step: 1 },
      { id: "market", label: "Market return (%)", value: SR_EX.market, step: 1 },
    ],
    compute: (v) => [
      { label: "Look-through weight in the stock", value: pct(lookThroughWeightPct(v.core ?? 0, v.wCore ?? 0, v.tilt ?? 0, v.wTilt ?? 0), 2) },
      { label: "Relative strength", value: `${relativeStrengthPts(v.sector ?? 0, v.market ?? 0)} pts` },
    ],
    note: "Set the sector-fund share to 0 to see your exposure without the tilt.",
  },
  drills: [
    { id: "sr-d1", prompt: "How many sectors does GICS have?", options: ["9", "10", "11", "12"], answer: 2, why: "S&P DJI: 11 sectors, 25 industry groups, 74 industries, 163 sub-industries." },
    { id: "sr-d2", prompt: "Which is usually called defensive?", options: ["Consumer discretionary", "Consumer staples", "Industrials", "Materials"], answer: 1, why: "S&P describes staples as less sensitive to economic cycles." },
    { id: "sr-d3", prompt: "A mortgage REIT is classified under…", options: ["Real Estate", "Financials", "Utilities", "Industrials"], answer: 1, why: "GICS puts mortgage REITs in Financials and equity REITs in Real Estate." },
    { id: "sr-d4", prompt: "You own an S&P 500 fund and add XLK. Your exposure to Apple…", options: ["Falls", "Rises, because both funds hold it", "Is unchanged", "Becomes zero"], answer: 1, why: "Overlap: add up look-through weights (FINRA)." },
    { id: "sr-d5", prompt: "NBER announces a recession. Usually that is…", options: ["The day it starts", "Months after it started", "Before it starts", "Never"], answer: 1, why: "NBER waits for enough data, so it dates turning points months later." },
  ],
  caveats: [
    { title: "Weights change daily", text: "Holdings and weights here are as of Nov 11, 2026; check the fund's file before relying on them." },
    { title: "Cycles are only known late", text: "NBER dates turning points months after they happen, and Fidelity notes phases can be skipped or repeated." },
    { title: "Mixed evidence", text: `A Massey University working paper found textbook rotation added at most about ${ROTATION_BEST_CASE_PCT}% a year with perfect foresight and no costs; realistic versions did worse.` },
    { title: "Examples, not picks", text: "The funds and companies named are examples from Market Forces and fund files, not recommendations." },
  ],
  sources: [
    { label: "S&P Dow Jones Indices: GICS", url: "https://www.spglobal.com/spdji/en/landing/topic/gics/", supports: "11 sectors, 25 groups, 74 industries, 163 sub-industries; sector definitions; mortgage REITs in Financials, equity REITs in Real Estate; annual review" },
    { label: "State Street: Technology Select Sector SPDR (XLK)", url: "https://www.ssga.com/us/en/intermediary/etfs/state-street-technology-select-sector-spdr-etf-xlk", supports: "Daily holdings: Apple 16.2%, Nvidia 13.1%, Microsoft 12.1% (Nov 11, 2026); XLF and XLRE files read the same day" },
    { label: "Vanguard: Real Estate ETF (VNQ) profile", url: "https://investor.vanguard.com/investment-products/etfs/profile/vnq", supports: "MSCI US IMI Real Estate 25/50 benchmark; 139 stocks; 0.13% expense ratio (Nov 12, 2026)" },
    { label: "SEC Investor.gov: Real estate investment trusts (REITs)", url: "https://www.investor.gov/introduction-investing/investing-basics/investment-products/real-estate-investment-trusts-reits", supports: "What REITs own; traded vs non-traded; dividends generally taxed as ordinary income" },
    { label: "FINRA: Concentrate on concentration risk", url: "https://www.finra.org/investors/insights/concentration-risk", supports: "Overlap between tech stocks, a tech fund and an index fund; look under the hood of each fund" },
    { label: "Fidelity Viewpoints: How to invest using the business cycle", url: "https://www.fidelity.com/viewpoints/investing-ideas/sector-investing-business-cycle", supports: "Four phases and sector patterns since 1962; no investment behaved uniformly in every cycle" },
    { label: "NBER: Business cycle dating", url: "https://www.nber.org/research/business-cycle-dating", supports: "Peaks and troughs are identified retrospectively, months after they occur" },
    { label: "Stangl, Jacobsen & Visaltanachoti: Sector rotation over business cycles (Massey University working paper)", url: "https://www.researchgate.net/publication/228425439_Sector_rotation_over_business-cycles", supports: "Perfect-foresight rotation: at best 2.3% a year since 1948 before costs; dissipates in realistic settings" },
  ],
  links: [
    { label: "Learn → Sectors & Rotation", to: "/training?group=sectors-rotation" },
    { label: "Coach → Sector funds and the cycle", to: "/coach/sectors-cycle" },
    { label: "Playbook → Business-cycle sector tilt", to: "/playbooks/business-cycle-sector-tilt" },
    { label: "Practice → Bonds and rates", to: "/practice/bonds-rates" },
    { label: "Cases → Market-wide news", to: "/cases?pack=macro-news" },
  ],
  simulations: THEME_SIMS["sectors-rotation"],
  mode: "sector_cycle",
  modeLabel: "Sectors: holdings and timing first",
  modeTip:
    "For a sector headline, read the fund's top holdings, add up overlap with what you already own, and ask whether the cycle news is already old. Keep tilts small and written down. Cases → Market-wide news.",
  questions: [
    mc("SR-01", "GICS was developed by…", "B", "S&P Dow Jones Indices and MSCI", ["The SEC", "The Federal Reserve", "Nasdaq alone"], "Developed in 1999 and reviewed every year by both firms.", "gics-sector"),
    mc("SR-02", "How many sectors are in GICS?", "C", "11", ["9", "10", "13"], "11 sectors, 25 industry groups, 74 industries and 163 sub-industries.", "gics-sector"),
    mc("SR-03", "A company's GICS sector is assigned mainly by…", "A", "Its principal business activity, with revenue as a key factor", ["Its stock price", "Its headquarters city", "Its dividend yield"], "Earnings and market perception are also considered at the annual review.", "gics-sector"),
    mc("SR-04", "Which sector does S&P describe as the most sensitive to economic cycles?", "D", "Consumer discretionary", ["Consumer staples", "Utilities", "Health care"], "Autos, durables, leisure, hotels and restaurants swing with the economy.", "cyclical-vs-defensive"),
    mc("SR-05", "Which group is usually called defensive?", "B", "Staples, utilities and health care", ["Energy, materials and industrials", "Financials and real estate", "Technology and communication"], "Demand for toothpaste, power and medicine holds up better in recessions.", "cyclical-vs-defensive"),
    mc("SR-06", `As of ${SECTOR_AS_OF}, Apple, Nvidia and Microsoft made up about what share of XLK?`, "C", `${XLK_TOP3}%`, ["5%", "15%", "75%"], "Market-cap weighting concentrates a sector fund in its largest companies.", "sector-fund-concentration"),
    mc("SR-07", "You hold an S&P 500 fund and add a technology sector fund. The main effect is…", "A", "More concentration in the same large tech companies", ["More diversification", "Less tech exposure", "Bond exposure"], "FINRA calls this overlap a source of concentration risk.", "fund-overlap"),
    mc("SR-08", `80% in a fund with 6% Apple, 20% in a fund with ${XLK_TOP.AAPL}% Apple. Look-through Apple weight?`, "D", pct(SR_LOOK, 2), ["6.00%", "16.20%", "22.20%"], "0.8 × 6 + 0.2 × 16.2: weight each fund's holding by your share in it.", "fund-overlap"),
    mc("SR-09", "Under GICS, mortgage REITs sit in…", "B", "Financials", ["Real Estate", "Utilities", "Industrials"], "Equity REITs and real estate companies are in the Real Estate sector.", "equity-vs-mortgage-reit"),
    mc("SR-10", "REIT dividends are generally taxed…", "A", "As ordinary income, not at the lower qualified-dividend rates", ["Tax-free", "As long-term capital gains always", "Only by states"], "SEC Investor.gov notes this; check where you hold REITs.", "equity-vs-mortgage-reit"),
    mc("SR-11", "XLRE's largest holdings (Nov 2026) included a health care landlord, warehouses, data centers and cell towers. The lesson?", "C", "Real estate funds own much more than offices and malls", ["REIT funds are tech funds", "REIT funds hold only homes", "They hold mortgages only"], "Read holdings before using a sector fund for a narrow thesis.", "equity-vs-mortgage-reit"),
    mc("SR-12", "Fidelity's four business cycle phases are…", "D", "Early, mid, late and recession", ["Bull, bear, sideways and crash", "Spring, summer, fall and winter", "Growth, value, size and momentum"], "Mid-cycle has been the longest, at nearly three years on average.", "business-cycle-phases"),
    mc("SR-13", "Why is acting on a recession announcement often late?", "A", "NBER dates turning points months after they happen", ["NBER announces in advance", "Recessions last decades", "Stocks ignore recessions"], "By the announcement, prices have usually moved.", "business-cycle-phases"),
    mc("SR-14", "A study of textbook sector rotation with perfect foresight and no costs found…", "B", `At best about ${ROTATION_BEST_CASE_PCT}% a year of outperformance since 1948, less with realistic timing`, ["A guaranteed 20% a year", "No difference at all in any setting", "It always loses money"], "Stangl, Jacobsen and Visaltanachoti: the edge dissipates in realistic settings.", "business-cycle-phases"),
  ],
  terms: TERMS,
  cases: CASES,
};
