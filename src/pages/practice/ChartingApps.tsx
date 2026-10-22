import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import {
  AS_OF, BROKER_LEARN, CHART_APPS, CHART_TRAPS, LEARNING_CHECKLIST, LEARNING_PATH, PFOF_SOURCES, PFOF_TEXT, ROBINHOOD_POINTS, WEBULL_POINTS, WEBULL_SCREENSHOTS, WEBULL_SCREEN_SOURCES, WEBULL_SOURCES,
  type ScreenshotDef,
} from "../../lib/chartingApps";
import { cn } from "../../lib/utils";

const term = (id: string, label: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">{label}</Link>
);
const ext = (src: { label: string; url: string }) => (
  <a key={src.url} href={src.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{src.label}</a>
);

/** Spot-the-trap mini drill: three chart situations, pick the trap. Finishing it marks the practice done. */
const SPOTS: { id: string; situation: string; answer: string }[] = [
  { id: "s1", situation: "A 10-year chart makes the last year's rally look far bigger than the 2010s gains of the same percentage.", answer: "Linear vs log scale" },
  { id: "s2", situation: "A stock seems to have dropped 50% overnight and an indicator flashes a sell, but the company announced a 2-for-1 split.", answer: "Unadjusted splits" },
  { id: "s3", situation: "RSI(14) looks overbought on one tab and neutral on another for the same stock.", answer: "Bar interval behind an indicator" },
];

function Shot({ shot, onOpen }: { key?: string; shot: ScreenshotDef; onOpen: () => void }) {
  return (
    <figure className="panel p-3 space-y-2" data-shot={shot.id}>
      <button type="button" onClick={onOpen} className="block w-full" aria-label={`Enlarge: ${shot.title}`}>
        <img
          src={shot.srcSmall}
          srcSet={`${shot.srcSmall} 480w, ${shot.src} ${shot.width}w`}
          sizes="(max-width: 640px) 100vw, 480px"
          width={shot.width}
          height={shot.height}
          loading="lazy"
          decoding="async"
          alt={shot.alt}
          className="w-full h-auto max-w-[480px] mx-auto rounded"
        />
      </button>
      <figcaption className="space-y-1 text-[12px]">
        <p className="font-semibold text-[13px]">{shot.title}</p>
        <ul className="list-disc pl-5 space-y-1">{shot.captions.map((c) => <li key={c}>{c}</li>)}</ul>
      </figcaption>
    </figure>
  );
}

/** /practice/charting-apps: 11 charting apps compared, how charts mislead, how brokers teach, example Webull account screens. */
export default function PracticeChartingApps() {
  const [picks, setPicks] = useState<Record<string, string>>({});
  const [checks, setChecks] = useState<Record<number, boolean>>({});
  const [open, setOpen] = useState<ScreenshotDef | null>(null);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);
  const choose = (id: string, v: string) => {
    if (picks[id]) return;
    const next = { ...picks, [id]: v };
    setPicks(next);
    if (SPOTS.every((x) => next[x.id])) markMiscPracticeDone("charting-apps");
  };
  const right = SPOTS.filter((x) => picks[x.id] === x.answer).length;
  return (
    <PracticeShell
      title="Indicator & charting apps"
      blurb={`What 11 charting apps offer as of ${AS_OF}, how charts mislead, and how to learn from broker tutorials. Educational, not trading advice.`}
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="ca-table">
        <p className="font-semibold text-[14px]">11 apps compared (as of {AS_OF})</p>
        <p className="text-[12px] text-muted">Features and prices change; check each app's page before you choose.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-[12px] border-collapse min-w-[760px]">
            <thead>
              <tr className="text-left border-b border-line">
                <th className="py-1 pr-2">App</th><th className="py-1 pr-2">Indicators</th><th className="py-1 pr-2">Scripting</th><th className="py-1 pr-2">Layouts</th><th className="py-1 pr-2">Cost</th><th className="py-1 pr-2">Data notes</th><th className="py-1">Source</th>
              </tr>
            </thead>
            <tbody>
              {CHART_APPS.map((r) => (
                <tr key={r.app} className="border-b border-line/60 align-top" data-app={r.app}>
                  <td className="py-1 pr-2 font-medium">{r.app}</td><td className="py-1 pr-2">{r.indicators}</td><td className="py-1 pr-2">{r.scripting}</td><td className="py-1 pr-2">{r.layouts}</td>
                  <td className="py-1 pr-2">{r.cost}</td><td className="py-1 pr-2">{r.data}</td><td className="py-1 space-x-1">{r.sources.map(ext)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="ca-traps">
        <p className="font-semibold text-[14px]">How charts mislead</p>
        <div className="grid sm:grid-cols-2 gap-2">
          {CHART_TRAPS.map((t) => (
            <div key={t.trap} className="panel p-3 space-y-1"><p className="font-semibold">{t.trap}</p><p>{t.what}</p><p className="text-[12px]"><span className="font-medium">Check:</span> {t.check}</p></div>
          ))}
        </div>
        <p className="text-[12px]">Terms: {term("log-scale", "log scale")} · {term("adjusted-prices", "adjusted prices")} · {term("indicator-warm-up", "indicator warm-up")}</p>
        <p className="font-medium pt-1">Spot the trap</p>
        {SPOTS.map((x) => (
          <div key={x.id} className="panel p-3 space-y-2" data-spot={x.id}>
            <p>{x.situation}</p>
            <div className="flex flex-wrap gap-1">
              {CHART_TRAPS.map((t) => (
                <button
                  key={t.trap}
                  type="button"
                  disabled={!!picks[x.id]}
                  onClick={() => choose(x.id, t.trap)}
                  className={cn(
                    "px-2 py-1 rounded border border-line text-[12px]",
                    picks[x.id] && t.trap === x.answer && "bg-emerald-500/20 border-emerald-500",
                    picks[x.id] === t.trap && t.trap !== x.answer && "bg-rose-500/20 border-rose-500",
                  )}
                >
                  {t.trap}
                </button>
              ))}
            </div>
            {picks[x.id] ? <p className="text-[12px]" data-spot-result>{picks[x.id] === x.answer ? "Correct." : `Not quite: it's ${x.answer}.`}</p> : null}
          </div>
        ))}
        {SPOTS.every((x) => picks[x.id]) ? <p className="font-medium" data-testid="ca-spot-score">{right} / {SPOTS.length} correct</p> : null}
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="ca-robinhood">
        <p className="font-semibold text-[14px]">Opinion: why the Robinhood app's indicator chart can mislead</p>
        <p className="text-[12px] text-muted">This is a viewpoint, backed by Robinhood's own help pages.</p>
        <ul className="list-disc pl-5 space-y-1">{ROBINHOOD_POINTS.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="text-[12px] space-x-1">{CHART_APPS.filter((r) => r.app.startsWith("Robinhood")).flatMap((r) => r.sources).map(ext)}</p>
      </section>

      <section className="panel p-4 space-y-3 text-[13px]" data-testid="ca-webull">
        <p className="font-semibold text-[14px]">Opinion: why Webull's indicator chart is useful</p>
        <p className="text-[12px] text-muted">This is a viewpoint, backed by Webull's documented features.</p>
        <ul className="list-disc pl-5 space-y-1">{WEBULL_POINTS.map((p) => <li key={p}>{p}</li>)}</ul>
        <p className="text-[12px] space-x-1">{WEBULL_SOURCES.map(ext)}</p>
        <div className="space-y-2" data-testid="ca-webull-shots">
          <p className="font-semibold">Example Webull screenshots</p>
          <p className="text-[12px]">What Webull's account and P&L tools look like. They show account tracking, not how accurate any indicator is. Tap an image to enlarge.</p>
          <div className="grid sm:grid-cols-2 gap-2">
            {WEBULL_SCREENSHOTS.map((sh) => <Shot key={sh.id} shot={sh} onOpen={() => setOpen(sh)} />)}
          </div>
          <p className="text-[12px]">Terms: {term("open-pnl", "open P&L")} · {term("settled-cash", "settled vs unsettled cash")} · {WEBULL_SCREEN_SOURCES.map((x, i) => <span key={x.url}>{i ? " · " : ""}{ext(x)}</span>)}</p>
        </div>
      </section>

      <section className="panel p-4 space-y-2 text-[13px]" data-testid="ca-learn">
        <p className="font-semibold text-[14px]">Learning from broker apps</p>
        <ul className="list-disc pl-5 space-y-1">
          {BROKER_LEARN.map((b) => <li key={b.name}><a href={b.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">{b.name}</a>: {b.offers}</li>)}
        </ul>
        <p>{PFOF_TEXT} {term("payment-for-order-flow", "Payment for order flow")}.</p>
        <p className="text-[12px] space-x-1">{PFOF_SOURCES.map(ext)}</p>
        <p className="font-medium">A sample path</p>
        <ol className="list-decimal pl-5 space-y-1">{LEARNING_PATH.map((p) => <li key={p.stage}><span className="font-medium">{p.stage}:</span> {p.what}</li>)}</ol>
        <p className="font-medium">Optional checklist</p>
        <ul className="space-y-1">
          {LEARNING_CHECKLIST.map((c, i) => (
            <li key={c}><label className="flex gap-2 items-start"><input type="checkbox" data-learn-item={i} checked={!!checks[i]} onChange={() => setChecks({ ...checks, [i]: !checks[i] })} className="mt-1" /><span>{c}</span></label></li>
          ))}
        </ul>
        <p className="text-[12px]">
          <Link to="/training?group=charting-apps&start=1" className="text-primary underline">Learn · Indicator & Charting Apps</Link> ·{" "}
          <Link to="/practice/algo-trading" className="text-primary underline">Automated & algo trading</Link>
        </p>
      </section>

      {open ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={open.title}
          data-testid="ca-lightbox"
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setOpen(null)}
        >
          <img src={open.src} alt={open.alt} width={open.width} height={open.height} className="max-h-[90vh] w-auto h-auto max-w-full rounded" />
          <button type="button" className="absolute top-3 right-3 panel px-3 py-1 text-[13px]" onClick={() => setOpen(null)} data-testid="ca-lightbox-close">Close</button>
        </div>
      ) : null}
    </PracticeShell>
  );
}
