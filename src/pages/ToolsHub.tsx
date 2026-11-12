import { Link, useParams } from "react-router-dom";
import ToolLessonPage from "../components/tools/ToolLessonPage";
import { MockScreen } from "../components/tools/MockUi";
import { CHARTING_APPS_ROUTE, TOOL_LESSONS, getToolLesson, type ToolScreen } from "../lib/toolTraining";

/** How every simulated screen in Tool Training is drawn, shown once on the hub. */
const LEGEND: ToolScreen = {
  id: "legend",
  title: "How to read the simulated screens",
  where: "example research page",
  alt: "An example simulated screen: a quote header for a made-up company, a row of tabs, a small line chart and a short table of key statistics, with numbered markers beside the header and the statistics.",
  caption: "Every tool lesson draws its screens like this, in this app's own style. The company and numbers here are made up.",
  blocks: [
    { kind: "quote", symbol: "SMPL", name: "Sample Company", price: "$100.00", change: "+1.00 (+1.01%)", up: true, meta: "Made-up example · not a real quote" },
    { kind: "tabs", tabs: ["Overview", "Financials", "Statistics", "News"], active: 0 },
    { kind: "chart", label: "SIMULATED line, seeded", seed: 4242, drift: 0.002 },
    { kind: "stats", rows: [{ label: "Market cap", value: "$10.0B" }, { label: "P/E", value: "20.0" }, { label: "As of", value: "date shown on the real page" }] },
  ],
  callouts: [
    { n: 1, block: 0, text: "Numbered markers point at the part of the page the step talks about." },
    { n: 2, block: 3, text: "Real tools show an as-of date or a delay note. Find it before you trust a number." },
  ],
};

export default function ToolsHub() {
  const { toolId } = useParams();
  if (toolId) {
    const lesson = getToolLesson(toolId);
    if (lesson) return <ToolLessonPage lesson={lesson} />;
    return (
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-2">
        <h1 className="text-lg font-semibold">Tool lesson not found</h1>
        <Link to="/tools" className="text-primary underline text-[13px]">Back to Tool Training</Link>
      </main>
    );
  }
  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-1 px-4 py-6 max-w-4xl mx-auto w-full space-y-4" data-testid="tools-hub">
        <div>
          <p className="text-[12px] text-muted"><Link to="/training" className="hover:text-ink">Learn</Link>{" · Tool Training"}</p>
          <h1 className="text-lg font-semibold tracking-tight">Tool Training</h1>
          <p className="text-[13px] text-muted">
            Learn to use the research tools you will meet outside this app: where the numbers are, what they mean, how fresh they are, and what each tool cannot tell you. Tools are credited, not endorsed. Educational, not advice.
          </p>
        </div>
        <section className="panel p-4 space-y-2 text-[13px]" data-testid="tools-list">
          <p className="font-semibold text-[14px]">Lessons</p>
          <p className="text-[12px] text-muted" data-testid="tools-sim-note">
            Inside each lesson, dotted purple phrases marked ▶ open a short simulation: a SAMPLE tape or table you step through, showing how a value from the tool connects back to the stock.
          </p>
          {TOOL_LESSONS.length ? (
            <ul className="space-y-2">
              {TOOL_LESSONS.map((t) => (
                <li key={t.id} className="flex gap-2">
                  <span className="material-symbols-outlined text-[18px] text-primary" aria-hidden>{t.icon}</span>
                  <span>
                    <Link to={t.route} className="text-primary underline font-medium">{t.title}</Link>
                    <span className="block text-[12px] text-muted">{t.blurb}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-[12px] text-muted">Tool lessons are listed here as they are added.</p>
          )}
        </section>
        <section className="panel p-4 space-y-2 text-[13px]">
          <p className="font-semibold text-[14px]">Ground rules for every tool</p>
          <ul className="list-disc pl-5 text-[12px] space-y-1">
            <li>Find the as-of date or delay note before you use a number.</li>
            <li>Check a key number against a second source, ideally the company's own filing.</li>
            <li>A screen or a ranking is a list of things to research, not a list of things to buy.</li>
            <li>Free and paid tiers differ; know which one you are looking at.</li>
          </ul>
        </section>
        <section className="panel p-4 space-y-3 text-[13px]">
          <MockScreen screen={LEGEND} />
        </section>
        <section className="panel p-4 space-y-1 text-[13px]" data-testid="tools-charting-apps">
          <p className="font-semibold text-[14px]">Charting apps compared</p>
          <p className="text-[12px] text-muted">The existing practice page compares charting apps side by side. Tool Training does not repeat it.</p>
          <Link to={CHARTING_APPS_ROUTE} className="text-primary underline">Practice → Charting apps</Link>
        </section>
      </main>
    </div>
  );
}
