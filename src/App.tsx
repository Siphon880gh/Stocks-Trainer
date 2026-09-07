import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
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
import Cases from "./pages/Cases";
import CasePlayer from "./pages/CasePlayer";
import Coach from "./pages/Coach";
import CoachSession from "./pages/CoachSession";
import Playbooks from "./pages/Playbooks";
import Playbook from "./pages/Playbook";

export default function App() {
  const basename = import.meta.env.BASE_URL.replace(/\/$/, "") || undefined;
  return (
    <BrowserRouter basename={basename}>
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
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:caseId" element={<CasePlayer />} />
          <Route path="coach" element={<Coach />} />
          <Route path="coach/:slug" element={<CoachSession />} />
          <Route path="playbooks" element={<Playbooks />} />
          <Route path="playbooks/:id" element={<Playbook />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
