import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Market from "./pages/Market";
import Training from "./pages/Training";
import Archive from "./pages/Archive";
import PracticeDraw from "./pages/PracticeDraw";
import Cases from "./pages/Cases";
import CasePlayer from "./pages/CasePlayer";
import Coach from "./pages/Coach";
import CoachSession from "./pages/CoachSession";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="market" element={<Market />} />
          <Route path="training" element={<Training />} />
          <Route path="archive" element={<Archive />} />
          <Route path="practice-draw" element={<PracticeDraw />} />
          <Route path="cases" element={<Cases />} />
          <Route path="cases/:caseId" element={<CasePlayer />} />
          <Route path="coach" element={<Coach />} />
          <Route path="coach/:slug" element={<CoachSession />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
