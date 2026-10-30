import { Link, useParams } from "react-router-dom";
import MarketChart from "../components/MarketChart";
import PlaybookPanel from "../components/PlaybookPanel";
import { getCaseStudy } from "../lib/caseStudies";
import { loadSession } from "../lib/coaching";
import { NAVIGATOR_CLASS_LABELS } from "../lib/marketNavigator";
import { getPlaybook } from "../lib/playbooks";
import { getOverlay } from "../lib/overlays";
import { getSamplePack } from "../lib/samplePacks";
import YouTubeSearchLink from "../components/YouTubeSearchLink";
import JargonText from "../components/JargonText";
import SampleDataNote from "../components/SampleDataNote";
import { withoutSampleWord } from "../lib/learnerCopy";

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
        <div className="relative space-y-2 pr-9">
          <SampleDataNote />
          <Link to="/playbooks" className="text-sm text-primary hover:underline">
            Back to playbooks
          </Link>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold tracking-tight">{playbook.title}</h1>
            <YouTubeSearchLink title={playbook.title} />
          </div>
          <p className="text-sm text-muted">
            <JargonText text={withoutSampleWord(playbook.summary)} />
          </p>
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
            {playbook.source.kind === "youtube"
              ? " · educational read — not their paid course, not a live desk"
              : " · educational read of a public page — not advice, not a live desk"}
          </p>
        </div>

        {playbook.video ? (
          <figure className="space-y-2" data-testid="playbook-video">
            <div className="relative w-full aspect-video overflow-hidden rounded-lg border border-line bg-surface">
              <iframe
                src={playbook.video.embedUrl}
                title={`${playbook.video.title} by ${playbook.video.creator} (YouTube video)`}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
            <figcaption className="text-[12px] text-muted">
              Video:{" "}
              <a href={playbook.video.watchUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                {playbook.video.title}
              </a>{" "}
              by{" "}
              {playbook.video.channelUrl ? (
                <a href={playbook.video.channelUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                  {playbook.video.creator}
                </a>
              ) : (
                playbook.video.creator
              )}
              . Embedded from YouTube; all rights stay with the creator.
            </figcaption>
          </figure>
        ) : null}

        <div className="space-y-3">
          <PlaybookPanel title="Strategy">
            {playbook.explanation ? (
              <p className="text-sm text-ink whitespace-pre-wrap leading-relaxed">
                <JargonText text={withoutSampleWord(playbook.explanation)} />
              </p>
            ) : (
              <p className="text-sm text-muted">
                This panel is waiting on the Cursor prompt for this source.
              </p>
            )}
            {playbook.related?.length ? (
              <div className="space-y-1" data-testid="playbook-related">
                <p className="text-[12px] font-medium text-muted">In this app</p>
                <ul className="list-disc pl-5 space-y-1 text-sm">
                  {playbook.related.map((l) => (
                    <li key={l.to}>
                      <Link to={l.to} className="text-primary hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </PlaybookPanel>

          {playbook.credibility ? (
            <PlaybookPanel title={playbook.credibility.title}>
              <div className="space-y-3 text-sm" data-testid="playbook-credibility">
                {playbook.credibility.summary.map((p) => (
                  <p key={p} className="text-ink leading-relaxed">{p}</p>
                ))}
                <ul className="space-y-2">
                  {playbook.credibility.sources
                    .filter((s) => s.role === "corroborates")
                    .map((s) => (
                      <li key={s.url}>
                        <span className="text-[12px] font-medium text-muted">{s.supports}</span>
                        <br />
                        <a href={s.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                          {s.label}
                        </a>
                        <span className="text-muted">: {s.note}</span>
                      </li>
                    ))}
                </ul>
                {playbook.credibility.sources.some((s) => s.role === "presents") ? (
                  <p className="text-[12px] text-muted">
                    The method also appears on{" "}
                    {playbook.credibility.sources
                      .filter((s) => s.role === "presents")
                      .map((s, i, all) => (
                        <span key={s.url}>
                          {i > 0 ? (i === all.length - 1 ? " and " : ", ") : ""}
                          <a href={s.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                            {s.label}
                          </a>
                        </span>
                      ))}
                    , which present it rather than evaluate it.
                  </p>
                ) : null}
              </div>
            </PlaybookPanel>
          ) : null}

          <PlaybookPanel title="Coaching">
            {coach?.ok ? (
              <p className="text-sm text-muted">
                Step coaching for this kit:{" "}
                <Link
                  to={`/coach/${playbook.coachSlug}`}
                  className="text-primary hover:underline"
                >
                  {withoutSampleWord(coach.session.meta.title)}
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
                  {withoutSampleWord(study.title)}
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
                  <span className="inline-flex items-center gap-2">
                    {withoutSampleWord(pack.displayName)}
                    <YouTubeSearchLink title={withoutSampleWord(pack.displayName)} />
                  </span>
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
                />
                <p className="text-[12px] text-muted">{withoutSampleWord(pack.educationalNotes)}</p>
              </div>
            ) : (
              <p className="text-sm text-muted">
                No chart pack wired yet. The create prompt fills this from{" "}
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
