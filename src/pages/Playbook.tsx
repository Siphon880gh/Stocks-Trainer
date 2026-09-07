import { Link, useParams } from "react-router-dom";
import MarketChart from "../components/MarketChart";
import PlaybookPanel from "../components/PlaybookPanel";
import { getCaseStudy } from "../lib/caseStudies";
import { loadSession } from "../lib/coaching";
import { NAVIGATOR_CLASS_LABELS } from "../lib/marketNavigator";
import { getPlaybook } from "../lib/playbooks";
import { getOverlay } from "../lib/overlays";
import { getSamplePack } from "../lib/samplePacks";

export default function Playbook() {
  const { id = "" } = useParams();
  const playbook = getPlaybook(id);

  if (!playbook) {
    return (
      <div className="p-6 text-sm space-y-3">
        <p className="text-accent-red" role="alert">
          Playbook not found: {id}
        </p>
        <Link to="/playbooks" className="text-primary underline">
          Back to playbooks
        </Link>
      </div>
    );
  }

  const pack = playbook.samplePackId ? getSamplePack(playbook.samplePackId) : undefined;
  const study = playbook.caseId ? getCaseStudy(playbook.caseId) : undefined;
  const coach = playbook.coachSlug ? loadSession(playbook.coachSlug) : null;
  const overlays = playbook.overlayIds ?? [];

  return (
    <div className="flex-1 flex flex-col">
      <main className="flex-grow max-w-3xl mx-auto w-full px-6 py-8 space-y-6">
        <div className="space-y-2">
          <Link to="/playbooks" className="text-sm text-primary hover:underline">
            Back to playbooks
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{playbook.title}</h1>
          <p className="text-sm text-muted">{playbook.summary}</p>
          <p className="text-sm">
            <span className="text-muted">Resource · </span>
            <a
              href={playbook.source.url}
              className="text-primary hover:underline"
              target="_blank"
              rel="noreferrer"
            >
              {playbook.source.label}
            </a>
          </p>
          <p className="text-[12px] text-muted">
            {NAVIGATOR_CLASS_LABELS[playbook.assetClass]}
            {playbook.source.kind === "youtube" ? " · YouTube" : " · Webpage"}
            {" · SAMPLE educational read — not their paid course, not a live desk"}
          </p>
        </div>

        <div className="space-y-3">
          <PlaybookPanel title="Strategy">
            {playbook.explanation ? (
              <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
                {playbook.explanation}
              </p>
            ) : (
              <p className="text-sm text-muted">
                This panel is waiting on the Cursor prompt for this source.
              </p>
            )}
          </PlaybookPanel>

          <PlaybookPanel title="Coaching">
            {coach?.ok ? (
              <p className="text-sm text-muted">
                Step coaching for this kit:{" "}
                <Link
                  to={`/coach/${playbook.coachSlug}`}
                  className="text-primary hover:underline"
                >
                  {coach.session.meta.title}
                </Link>
                . Same rewind-and-succeed tree as Coach.
              </p>
            ) : (
              <p className="text-sm text-muted">
                No coaching session wired yet. The create prompt fills this from{" "}
                <Link to="/coach" className="text-primary hover:underline">
                  Coach
                </Link>
                .
              </p>
            )}
          </PlaybookPanel>

          <PlaybookPanel title="Case study">
            {study ? (
              <p className="text-sm text-muted">
                Decide-and-reveal:{" "}
                <Link
                  to={`/cases/${study.id}`}
                  className="text-primary hover:underline"
                >
                  {study.title}
                </Link>
                . Same Case player as Cases.
              </p>
            ) : (
              <p className="text-sm text-muted">
                No case wired yet. The create prompt fills this from{" "}
                <Link to="/cases" className="text-primary hover:underline">
                  Cases
                </Link>
                .
              </p>
            )}
          </PlaybookPanel>

          <PlaybookPanel title="Chart look">
            {pack ? (
              <div className="space-y-3">
                <p className="text-sm text-muted">
                  {pack.displayName}
                  {overlays.length > 0
                    ? ` · ${overlays.map((id) => getOverlay(id)?.name ?? id).join(", ")}`
                    : ""}
                </p>
                <MarketChart
                  data={pack.ohlc}
                  height={280}
                  showSMA={overlays.includes("sma")}
                  showEMA={overlays.includes("ema")}
                  showRSI={overlays.includes("rsi")}
                  showMACD={overlays.includes("macd")}
                  showBollinger={overlays.includes("bollinger")}
                  statusLabel="SAMPLE"
                />
                <p className="text-[12px] text-muted">{pack.educationalNotes}</p>
              </div>
            ) : (
              <p className="text-sm text-muted">
                No SAMPLE pack wired yet. The create prompt fills this from{" "}
                <Link to="/market" className="text-primary hover:underline">
                  Charts
                </Link>
                {" "}and the overlays MarketChart already draws.
              </p>
            )}
          </PlaybookPanel>
        </div>
      </main>
    </div>
  );
}
