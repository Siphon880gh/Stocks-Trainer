import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import BrowseModal from "./components/BrowseModal";
import { browseModalOf } from "./lib/browseModal";
import { lazyPage } from "./lib/lazyPage";
import Dashboard from "./pages/Dashboard";

export { preloadPages } from "./lib/lazyPage";

// Home loads with the app; every other page is its own chunk.
const Market = lazyPage(() => import("./pages/Market"));
const BrowseEverything = lazyPage(() => import("./pages/BrowseEverything"));
const Training = lazyPage(() => import("./pages/Training"));
const Archive = lazyPage(() => import("./pages/Archive"));
const PracticeDraw = lazyPage(() => import("./pages/PracticeDraw"));
const PracticeFlashcards = lazyPage(() => import("./pages/practice/Flashcards"));
const PracticeLabel = lazyPage(() => import("./pages/practice/Label"));
const PracticeRegime = lazyPage(() => import("./pages/practice/Regime"));
const PracticeReplay = lazyPage(() => import("./pages/practice/Replay"));
const PracticePlan = lazyPage(() => import("./pages/practice/Plan"));
const PracticeHunt = lazyPage(() => import("./pages/practice/Hunt"));
const PracticeLookalike = lazyPage(() => import("./pages/practice/Lookalike"));
const PracticeInvalidation = lazyPage(() => import("./pages/practice/Invalidation"));
const PracticeLevels = lazyPage(() => import("./pages/practice/Levels"));
const PracticeStatementsLab = lazyPage(() => import("./pages/practice/StatementsLab"));
const PracticeReadThePrint = lazyPage(() => import("./pages/practice/ReadThePrint"));
const PracticeMarkTheBand = lazyPage(() => import("./pages/practice/MarkTheBand"));
const PracticeEmaMacd = lazyPage(() => import("./pages/practice/EmaMacd"));
const PracticeOscillators = lazyPage(() => import("./pages/practice/Oscillators"));
const PracticeJapaneseCandles = lazyPage(() => import("./pages/practice/JapaneseCandles"));
const CandleBasics = lazyPage(() => import("./pages/practice/CandleBasics"));
const PracticeHeikinAshi = lazyPage(() => import("./pages/practice/HeikinAshi"));
const PracticeGammaSqueeze = lazyPage(() => import("./pages/practice/GammaSqueeze"));
const PracticeNewsBiases = lazyPage(() => import("./pages/practice/NewsBiases"));
const PracticeAlgoTrading = lazyPage(() => import("./pages/practice/AlgoTrading"));
const PracticeChartingApps = lazyPage(() => import("./pages/practice/ChartingApps"));
const PracticeCryptoCandles = lazyPage(() => import("./pages/practice/CryptoCandles"));
const PracticeReversalCharts = lazyPage(() => import("./pages/practice/ReversalCharts"));
const PracticeOneMinuteCharts = lazyPage(() => import("./pages/practice/OneMinuteCharts"));
const PracticeFibDecisionMap = lazyPage(() => import("./pages/practice/FibDecisionMap"));
const PracticeFuturesVsOptions = lazyPage(() => import("./pages/practice/FuturesVsOptions"));
const PracticeTechniqueNarratives = lazyPage(() => import("./pages/practice/TechniqueNarratives"));
const PracticeMissingWicks = lazyPage(() => import("./pages/practice/MissingWicks"));
const PracticeRecordTraders = lazyPage(() => import("./pages/practice/RecordTraders"));
const PracticePatternThemes = lazyPage(() => import("./pages/practice/PatternThemes"));
const PracticeEssentialCandles = lazyPage(() => import("./pages/practice/EssentialCandles"));
const PracticeWhichWay = lazyPage(() => import("./pages/practice/WhichWay"));
const PracticeTradeFramework = lazyPage(() => import("./pages/practice/TradeFramework"));
const PracticeOpeningRange = lazyPage(() => import("./pages/practice/OpeningRange"));
const PracticeFairValueGap = lazyPage(() => import("./pages/practice/FairValueGap"));
const PracticeRiskPremiumPortfolio = lazyPage(() => import("./pages/practice/RiskPremiumPortfolio"));
const PracticeVixTrading = lazyPage(() => import("./pages/practice/VixTrading"));
const PracticeWheelStrategy = lazyPage(() => import("./pages/practice/WheelStrategy"));
const MarketThemePage = lazyPage(() => import("./components/practice/MarketThemePage"));
const ProgressMap = lazyPage(() => import("./pages/ProgressMap"));
const Cases = lazyPage(() => import("./pages/Cases"));
const CasePlayer = lazyPage(() => import("./pages/CasePlayer"));
const Coach = lazyPage(() => import("./pages/Coach"));
const CoachSession = lazyPage(() => import("./pages/CoachSession"));
const Playbooks = lazyPage(() => import("./pages/Playbooks"));
const Playbook = lazyPage(() => import("./pages/Playbook"));
const ToolsHub = lazyPage(() => import("./pages/ToolsHub"));
const MacroDesk = lazyPage(() => import("./pages/macro/MacroDesk"));
const MacroLesson = lazyPage(() => import("./pages/macro/MacroLesson"));
const MacroPlay = lazyPage(() => import("./pages/macro/MacroPlay"));
const AcademyHub = lazyPage(() => import("./pages/academy/AcademyHub"));
const AcademyUnit = lazyPage(() => import("./pages/academy/AcademyUnit"));
const AcademyTestOut = lazyPage(() => import("./pages/academy/AcademyTestOut"));
const Paper = lazyPage(() => import("./pages/academy/Paper"));
const OptionsLadderPage = lazyPage(() => import("./pages/academy/OptionsLadder"));
const PaperChallenges = lazyPage(() => import("./pages/academy/PaperChallenges"));
const PaperDesk = lazyPage(() => import("./pages/academy/PaperDesk"));

/** Every page route. Rendered once under the app chrome and, for a Browse everything popup, again inside the dialog. */
const pageRoutes = (
  <>
    <Route index element={<Dashboard />} />
    <Route path="browse" element={<BrowseEverything />} />
    <Route path="market" element={<Market />} />
    <Route path="training" element={<Training />} />
    <Route path="archive" element={<Archive />} />
    <Route path="practice-draw" element={<PracticeDraw />} />
    <Route path="practice/flashcards" element={<PracticeFlashcards />} />
    <Route path="practice/label" element={<PracticeLabel />} />
    <Route path="practice/regime" element={<PracticeRegime />} />
    <Route path="practice/replay" element={<PracticeReplay />} />
    <Route path="practice/plan" element={<PracticePlan />} />
    <Route path="practice/hunt" element={<PracticeHunt />} />
    <Route path="practice/lookalike" element={<PracticeLookalike />} />
    <Route path="practice/invalidation" element={<PracticeInvalidation />} />
    <Route path="practice/levels" element={<PracticeLevels />} />
    <Route path="practice/statements" element={<PracticeStatementsLab />} />
    <Route path="practice/read-the-print" element={<PracticeReadThePrint />} />
    <Route path="practice/mark-the-band" element={<PracticeMarkTheBand />} />
    <Route path="practice/ema-macd" element={<PracticeEmaMacd />} />
    <Route path="practice/oscillators" element={<PracticeOscillators />} />
    <Route path="practice/japanese-candles" element={<PracticeJapaneseCandles />} />
    <Route path="practice/candle-basics" element={<CandleBasics />} />
    <Route path="practice/heikin-ashi" element={<PracticeHeikinAshi />} />
    <Route path="practice/gamma-squeeze" element={<PracticeGammaSqueeze />} />
    <Route path="practice/news-biases" element={<PracticeNewsBiases />} />
    <Route path="practice/algo-trading" element={<PracticeAlgoTrading />} />
    <Route path="practice/charting-apps" element={<PracticeChartingApps />} />
    <Route path="practice/crypto-candles" element={<PracticeCryptoCandles />} />
    <Route path="practice/reversal-charts" element={<PracticeReversalCharts />} />
    <Route path="practice/one-minute-charts" element={<PracticeOneMinuteCharts />} />
    <Route path="practice/fib-decision-map" element={<PracticeFibDecisionMap />} />
    <Route path="practice/futures-vs-options" element={<PracticeFuturesVsOptions />} />
    <Route path="practice/technique-narratives" element={<PracticeTechniqueNarratives />} />
    <Route path="practice/missing-wicks" element={<PracticeMissingWicks />} />
    <Route path="practice/record-traders" element={<PracticeRecordTraders />} />
    <Route path="practice/pattern-themes" element={<PracticePatternThemes />} />
    <Route path="practice/essential-candles" element={<PracticeEssentialCandles />} />
    <Route path="practice/which-way" element={<PracticeWhichWay />} />
    <Route path="practice/trade-framework" element={<PracticeTradeFramework />} />
    <Route path="practice/opening-range" element={<PracticeOpeningRange />} />
    <Route path="practice/fair-value-gap" element={<PracticeFairValueGap />} />
    <Route path="practice/risk-premium-portfolio" element={<PracticeRiskPremiumPortfolio />} />
    <Route path="practice/vix-trading" element={<PracticeVixTrading />} />
    <Route path="practice/wheel-strategy" element={<PracticeWheelStrategy />} />
    <Route path="practice/exposure-wrappers" element={<MarketThemePage id="exposure-wrappers" />} />
    <Route path="practice/currency-funds" element={<MarketThemePage id="currency-funds" />} />
    <Route path="practice/precious-metals" element={<MarketThemePage id="precious-metals" />} />
    <Route path="practice/energy" element={<MarketThemePage id="energy" />} />
    <Route path="practice/industrial-metals" element={<MarketThemePage id="industrial-metals" />} />
    <Route path="practice/agriculture" element={<MarketThemePage id="agriculture" />} />
    <Route path="practice/materials-chemicals" element={<MarketThemePage id="materials-chemicals" />} />
    <Route path="practice/bonds-rates" element={<MarketThemePage id="bonds-rates" />} />
    <Route path="practice/sectors-rotation" element={<MarketThemePage id="sectors-rotation" />} />
    <Route path="practice/index-style" element={<MarketThemePage id="index-style" />} />
    <Route path="map" element={<ProgressMap />} />
    <Route path="cases" element={<Cases />} />
    <Route path="cases/:caseId" element={<CasePlayer />} />
    <Route path="coach" element={<Coach />} />
    <Route path="coach/:slug" element={<CoachSession />} />
    <Route path="playbooks" element={<Playbooks />} />
    <Route path="playbooks/:id" element={<Playbook />} />
    <Route path="tools" element={<ToolsHub />} />
    <Route path="tools/:toolId" element={<ToolsHub />} />
    <Route path="macro" element={<MacroDesk />} />
    <Route path="macro/play" element={<MacroPlay />} />
    <Route path="macro/:lessonId" element={<MacroLesson />} />
    <Route path="academy" element={<AcademyHub />} />
    <Route path="academy/test-out/:levelId" element={<AcademyTestOut />} />
    <Route path="academy/options" element={<OptionsLadderPage />} />
    <Route path="academy/:unitId" element={<AcademyUnit />} />
    <Route path="paper" element={<Paper />} />
    <Route path="paper/desk" element={<PaperDesk />} />
    <Route path="paper/challenges" element={<PaperChallenges />} />
    <Route path="paper/challenges/:challengeId" element={<PaperChallenges />} />
  </>
);

/**
 * The page routes, plus a popup route tree when a Browse everything link carries its
 * background location (react-router's modal pattern): Browse stays mounted behind the dialog.
 */
export function AppRoutes() {
  const location = useLocation();
  const background = browseModalOf(location.state)?.background;
  return (
    <>
      <ScrollToTop />
      <Routes location={background ?? location}>
        <Route path="/" element={<Layout />}>
          {pageRoutes}
        </Route>
      </Routes>
      {background ? (
        <Routes>
          <Route path="/" element={<BrowseModal />}>
            {pageRoutes}
          </Route>
        </Routes>
      ) : null}
    </>
  );
}

export default function App() {
  const baseUrl = import.meta.env.BASE_URL;
  // A relative production base has no fixed basename. The static site is mounted at
  // .../trainer/stocks-trainer or .../trainer/stocks-trainer/dist, and client routes hang off that.
  const mounted = window.location.pathname.match(
    /^(.*\/trainer\/stocks-trainer(?:\/dist)?)(?:\/|$)/,
  )?.[1];
  const basename = mounted ?? (baseUrl.startsWith("/")
    ? baseUrl.replace(/\/$/, "") || undefined
    : undefined);
  return (
    <BrowserRouter basename={basename}>
      <AppRoutes />
    </BrowserRouter>
  );
}
