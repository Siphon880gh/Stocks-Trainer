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

export default function App() {
  const baseUrl = import.meta.env.BASE_URL;
  // A relative Vite base ("./") has no stable URL pathname to use as a router
  // basename. When the static build is mounted below a variable web-server
  // prefix, preserve everything before /trainer/stocks-trainer/dist as its basename.
  const mountedBuild = window.location.pathname.match(
    /^(.*\/trainer\/stocks-trainer\/dist)(?:\/|$)/,
  )?.[1];
  const basename = mountedBuild ?? (baseUrl.startsWith("/")
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
          <Route path="paper/challenges" element={<PaperChallenges />} />
          <Route path="paper/challenges/:challengeId" element={<PaperChallenges />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
