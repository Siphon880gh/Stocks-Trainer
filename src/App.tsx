import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Training from "./pages/Training";
import Archive from "./pages/Archive";
import PracticeDraw from "./pages/PracticeDraw";
import PracticeFlashcards from "./pages/practice/Flashcards";
import PracticeLabel from "./pages/practice/Label";
import PracticeRegime from "./pages/practice/Regime";
import PracticeReplay from "./pages/practice/Replay";
import PracticePlan from "./pages/practice/Plan";
import PracticeHunt from "./pages/practice/Hunt";
import PracticeLookalike from "./pages/practice/Lookalike";
import PracticeInvalidation from "./pages/practice/Invalidation";
import PracticeLevels from "./pages/practice/Levels";
import PracticeStatementsLab from "./pages/practice/StatementsLab";
import PracticeReadThePrint from "./pages/practice/ReadThePrint";
import PracticeMarkTheBand from "./pages/practice/MarkTheBand";
import PracticeEmaMacd from "./pages/practice/EmaMacd";
import PracticeOscillators from "./pages/practice/Oscillators";
import PracticeJapaneseCandles from "./pages/practice/JapaneseCandles";
import CandleBasics from "./pages/practice/CandleBasics";
import PracticeHeikinAshi from "./pages/practice/HeikinAshi";
import PracticeGammaSqueeze from "./pages/practice/GammaSqueeze";
import PracticeNewsBiases from "./pages/practice/NewsBiases";
import PracticeAlgoTrading from "./pages/practice/AlgoTrading";
import PracticeChartingApps from "./pages/practice/ChartingApps";
import PracticeCryptoCandles from "./pages/practice/CryptoCandles";
import PracticeReversalCharts from "./pages/practice/ReversalCharts";
import PracticeOneMinuteCharts from "./pages/practice/OneMinuteCharts";
import PracticeFibDecisionMap from "./pages/practice/FibDecisionMap";
import PracticeFuturesVsOptions from "./pages/practice/FuturesVsOptions";
import PracticeTechniqueNarratives from "./pages/practice/TechniqueNarratives";
import PracticeMissingWicks from "./pages/practice/MissingWicks";
import PracticeRecordTraders from "./pages/practice/RecordTraders";
import PracticePatternThemes from "./pages/practice/PatternThemes";
import PracticeEssentialCandles from "./pages/practice/EssentialCandles";
import PracticeWhichWay from "./pages/practice/WhichWay";
import PracticeTradeFramework from "./pages/practice/TradeFramework";
import PracticeOpeningRange from "./pages/practice/OpeningRange";
import PracticeFairValueGap from "./pages/practice/FairValueGap";
import PracticeRiskPremiumPortfolio from "./pages/practice/RiskPremiumPortfolio";
import PracticeVixTrading from "./pages/practice/VixTrading";
import PracticeWheelStrategy from "./pages/practice/WheelStrategy";
import MarketThemePage from "./components/practice/MarketThemePage";
import ProgressMap from "./pages/ProgressMap";
import Cases from "./pages/Cases";
import CasePlayer from "./pages/CasePlayer";
import Coach from "./pages/Coach";
import CoachSession from "./pages/CoachSession";
import Playbooks from "./pages/Playbooks";
import Playbook from "./pages/Playbook";
import MacroDesk from "./pages/macro/MacroDesk";
import MacroLesson from "./pages/macro/MacroLesson";
import MacroPlay from "./pages/macro/MacroPlay";
import AcademyHub from "./pages/academy/AcademyHub";
import AcademyUnit from "./pages/academy/AcademyUnit";
import AcademyTestOut from "./pages/academy/AcademyTestOut";
import Paper from "./pages/academy/Paper";
import OptionsLadderPage from "./pages/academy/OptionsLadder";
import PaperChallenges from "./pages/academy/PaperChallenges";
import PaperDesk from "./pages/academy/PaperDesk";

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
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
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
          <Route path="map" element={<ProgressMap />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:caseId" element={<CasePlayer />} />
          <Route path="coach" element={<Coach />} />
          <Route path="coach/:slug" element={<CoachSession />} />
          <Route path="playbooks" element={<Playbooks />} />
          <Route path="playbooks/:id" element={<Playbook />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
