import { useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  DEPTH, OBJECTIVE_ORDER, STAGES, STAGE_BY_ID, STATUS_LABEL, TREE_IDS, buildMapModel, readSnapshot, unlocksOf,
  type MapModel, type StageState, type StageStatus,
} from "../lib/progressMap";
import { cn } from "../lib/utils";

type View = "world" | "tree" | "web";
const VIEWS: Array<{ id: View; label: string; icon: string }> = [
  { id: "world", label: "World map", icon: "map" },
  { id: "tree", label: "Skill tree", icon: "account_tree" },
  { id: "web", label: "Discovery web", icon: "hub" },
];
const isView = (v: string | null): v is View => v === "world" || v === "tree" || v === "web";

const STATUS_ICON: Record<StageStatus, string> = { done: "check_circle", "in-progress": "timelapse", available: "radio_button_unchecked", locked: "lock" };
const STATUS_TONE: Record<StageStatus, string> = {
  done: "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  "in-progress": "border-amber-500 bg-amber-500/10 text-amber-600 dark:text-amber-400",
  available: "border-primary/60 bg-surface text-primary",
  locked: "border-line bg-canvas text-muted",
};

function NextObjective({ model }: { model: MapModel }) {
  const n = model.next;
  if (!n) {
    return (
      <section className="rounded-xl border-2 border-emerald-500 bg-emerald-500/10 p-4" data-testid="map-next" aria-label="Next objective">
        <p className="text-[15px] font-semibold">Every stage is done. The whole map is filled in.</p>
      </section>
    );
  }
  const unlocks = unlocksOf(n.stage.id).map((id) => STAGE_BY_ID[id]?.title).filter(Boolean);
  return (
    <section className="rounded-xl border-2 border-primary bg-primary/10 p-4 flex flex-wrap items-center gap-3" data-testid="map-next" data-stage={n.stage.id} aria-label="Next objective">
      <span className="material-symbols-outlined text-primary text-[28px]" aria-hidden>flag</span>
      <div className="flex-1 min-w-[200px]">
        <p className="text-[11px] font-mono uppercase tracking-wide text-primary">Next objective</p>
        <p className="text-[15px] font-semibold">{n.stage.title}</p>
        <p className="text-[12px] text-muted">
          {sentence(n.stage.teaser)}
          {unlocks.length ? ` Unlocks: ${unlocks.slice(0, 3).join(", ")}${unlocks.length > 3 ? "…" : ""}.` : ""}
        </p>
      </div>
      <Link to={n.stage.to} data-testid="map-next-link" className="rounded-lg bg-primary text-white px-4 py-2 text-[13px] font-semibold hover:opacity-90">
        {n.status === "in-progress" ? "Continue" : "Start"}
      </Link>
    </section>
  );
}

function StageDot({ s, isNext }: { s: StageState; isNext: boolean }) {
  return (
    <Link
      to={s.stage.to}
      data-stage={s.stage.id}
      data-status={s.status}
      title={`${s.stage.title}: ${STATUS_LABEL[s.status]}`}
      aria-label={`${s.stage.title}: ${STATUS_LABEL[s.status]}${isNext ? " (next objective)" : ""}`}
      className={cn(
        "relative grid place-items-center w-7 h-7 rounded-full border-2 shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        STATUS_TONE[s.status],
        isNext && "ring-2 ring-primary ring-offset-1 ring-offset-surface",
      )}
    >
      <span className="material-symbols-outlined text-[15px]" aria-hidden>{STATUS_ICON[s.status]}</span>
    </Link>
  );
}

const rank = (id: string) => {
  const i = OBJECTIVE_ORDER.indexOf(id);
  return i < 0 ? OBJECTIVE_ORDER.length : i;
};
const sentence = (s: string) => (/[.!?]$/.test(s.trim()) ? s.trim() : `${s.trim()}.`);

function WorldMap({ model }: { model: MapModel }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="map-world">
      {model.regions.map((r) => {
        const inOrder = [...r.stages].sort((a, b) => rank(a.stage.id) - rank(b.stage.id));
        const open = inOrder.find((s) => s.status === "in-progress") ?? inOrder.find((s) => s.status === "available");
        return (
          <section key={r.region.id} className={cn("panel p-3 space-y-2", r.finished && "border-emerald-500")} data-testid="map-region" data-region={r.region.id} data-pct={r.pct} aria-labelledby={`region-${r.region.id}`}>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary" aria-hidden>{r.region.icon}</span>
              <h2 id={`region-${r.region.id}`} className="text-[14px] font-semibold flex-1">{r.region.name}</h2>
              {r.finished ? <span className="text-[11px] rounded-full bg-emerald-500 text-white px-2 py-0.5">Finished</span> : null}
            </div>
            <p className="text-[12px] text-muted">{r.region.blurb}</p>
            <div className="flex items-center gap-2 text-[11px] tabular-nums">
              <div className="flex-1 h-2 rounded-full bg-canvas border border-line overflow-hidden" role="progressbar" aria-label={`${r.region.name} complete`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={r.pct}>
                <div className="h-full bg-emerald-500" style={{ width: `${r.pct}%` }} />
              </div>
              <span>{r.done}/{r.total} · {r.pct}%</span>
            </div>
            <ol className="flex flex-wrap items-center gap-y-1.5" aria-label={`${r.region.name} stages`}>
              {r.stages.map((s, i) => (
                <li key={s.stage.id} className="flex items-center">
                  {i > 0 ? <span className={cn("w-2 h-0.5", s.status === "done" ? "bg-emerald-500" : "bg-line")} aria-hidden /> : null}
                  <StageDot s={s} isNext={model.next?.stage.id === s.stage.id} />
                </li>
              ))}
            </ol>
            {open ? (
              <p className="text-[12px]">
                <span className="text-muted">Up next here: </span>
                <Link to={open.stage.to} className="text-primary hover:underline">{open.stage.title}</Link>
              </p>
            ) : null}
          </section>
        );
      })}
    </div>
  );
}

function SkillTree({ model }: { model: MapModel }) {
  const tiers = useMemo(() => {
    const max = Math.max(...TREE_IDS.map((id) => DEPTH[id]));
    return Array.from({ length: max + 1 }, (_, d) => TREE_IDS.filter((id) => DEPTH[id] === d).sort((a, b) => rank(a) - rank(b)));
  }, []);
  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:overflow-x-auto pb-2" data-testid="map-tree">
      {tiers.map((ids, d) => (
        <section key={d} className="sm:min-w-[200px] sm:w-[200px] space-y-2" aria-label={`Tier ${d + 1}`}>
          <h2 className="text-[11px] font-mono uppercase tracking-wide text-muted">Tier {d + 1}</h2>
          <ul className="grid grid-cols-1 min-[480px]:grid-cols-2 sm:grid-cols-1 gap-2">
            {ids.map((id) => {
              const s = model.states[id];
              const unlocks = unlocksOf(id).map((u) => STAGE_BY_ID[u]!.title);
              const needs = s.stage.prereqs.filter((p) => model.states[p]?.status !== "done").map((p) => STAGE_BY_ID[p]!.title);
              return (
                <li key={id}>
                  <Link
                    to={s.stage.to}
                    data-testid="tree-node"
                    data-stage={id}
                    data-status={s.status}
                    className={cn("block rounded-lg border-2 p-2 text-[12px] focus:outline-none focus-visible:ring-2 focus-visible:ring-primary", STATUS_TONE[s.status], model.next?.stage.id === id && "ring-2 ring-primary")}
                  >
                    <span className="flex items-center gap-1 font-semibold text-ink">
                      <span className="material-symbols-outlined text-[15px]" aria-hidden>{STATUS_ICON[s.status]}</span>
                      {s.stage.title}
                    </span>
                    <span className="block text-[11px]">{STATUS_LABEL[s.status]}{s.stage.kind === "quiz" ? " · quiz" : s.stage.kind === "lab" ? " · practice" : ""}</span>
                    {s.status === "locked" && needs.length ? <span className="block text-[11px] text-muted">After: {needs.join(", ")}</span> : null}
                    {unlocks.length ? <span className="block text-[11px] text-muted">Unlocks → {unlocks.join(", ")}</span> : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </section>
      ))}
    </div>
  );
}

function DiscoveryWeb({ model }: { model: MapModel }) {
  const known = STAGES.filter((s) => model.states[s.id].discovered);
  const unknown = model.frontier.map((id) => STAGE_BY_ID[id]!);
  const hidden = STAGES.length - known.length - unknown.length;
  return (
    <div className="space-y-3" data-testid="map-web">
      <section className="panel p-3 space-y-2" aria-labelledby="web-unknown">
        <h2 id="web-unknown" className="text-[14px] font-semibold">You've heard of these: go explore</h2>
        <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {unknown.map((s) => (
            <li key={s.id}>
              <Link to={s.to} data-testid="web-unknown" data-stage={s.id} className={cn("flex gap-2 rounded-lg border-2 border-dashed border-line p-2 hover:border-primary focus:outline-none focus-visible:ring-2 focus-visible:ring-primary", model.next?.stage.id === s.id && "border-primary bg-primary/5")}>
                <span className="grid place-items-center w-8 h-8 rounded-full bg-canvas border border-line text-[16px] font-bold text-muted shrink-0" aria-hidden>?</span>
                <span className="text-[12px]">
                  <span className="block font-semibold">{s.title}</span>
                  <span className="block text-muted">{sentence(s.teaser)}</span>
                  <span className="sr-only">Not explored yet.</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {hidden > 0 ? <p className="text-[12px] text-muted" data-testid="web-hidden">{hidden} more stages are still hidden. Explore a stage to reveal its neighbours.</p> : null}
      </section>
      <section className="panel p-3 space-y-2" aria-labelledby="web-known">
        <h2 id="web-known" className="text-[14px] font-semibold">Explored ({known.length})</h2>
        {known.length ? (
          <ul className="flex flex-wrap gap-1.5">
            {known.map((s) => {
              const st = model.states[s.id];
              return (
                <li key={s.id}>
                  <Link to={s.to} data-testid="web-known" data-stage={s.id} data-status={st.status} className={cn("inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[12px]", STATUS_TONE[st.status])}>
                    <span className="material-symbols-outlined text-[13px]" aria-hidden>{STATUS_ICON[st.status]}</span>
                    {s.title}
                    <span className="sr-only">: {STATUS_LABEL[st.status]}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="text-[12px] text-muted">Nothing yet. Start with the next objective above.</p>
        )}
      </section>
    </div>
  );
}

/** /map: one progress model shown as a world map, a skill tree and a discovery web, with the next objective. */
export default function ProgressMap() {
  const [params, setParams] = useSearchParams();
  const raw = params.get("view");
  const view: View = isView(raw) ? raw : "world";
  const model = useMemo(() => buildMapModel(readSnapshot()), []);
  const setView = (v: View) => {
    const n = new URLSearchParams(params);
    n.set("view", v);
    setParams(n, { replace: true });
  };
  const t = model.totals;
  return (
    <main className="flex-1 px-4 py-6 max-w-6xl mx-auto w-full space-y-4">
      <div>
        <h1 className="text-lg font-semibold tracking-tight">Progress map</h1>
        <p className="text-[13px] text-muted" data-testid="map-totals">
          {t.done} of {t.total} stages done · {t.regionsFinished} of {model.regions.length} regions finished · {t.discovered} explored. Locked stages are suggestions: every link still opens.
        </p>
      </div>
      <NextObjective model={model} />
      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="Map view">
        {VIEWS.map((v) => (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={view === v.id}
            aria-controls="map-panel"
            data-testid={`map-view-${v.id}`}
            onClick={() => setView(v.id)}
            className={cn("inline-flex items-center gap-1 rounded-full border px-3 py-1 text-[13px]", view === v.id ? "border-primary bg-primary text-white" : "border-line bg-surface hover:bg-primary/10")}
          >
            <span className="material-symbols-outlined text-[16px]" aria-hidden>{v.icon}</span>
            {v.label}
          </button>
        ))}
      </div>
      <div id="map-panel" role="tabpanel" aria-label={VIEWS.find((v) => v.id === view)!.label}>
        {view === "world" ? <WorldMap model={model} /> : view === "tree" ? <SkillTree model={model} /> : <DiscoveryWeb model={model} />}
      </div>
      <p className="text-[11px] text-muted flex flex-wrap gap-3" aria-label="Legend">
        {(Object.keys(STATUS_LABEL) as StageStatus[]).map((s) => (
          <span key={s} className="inline-flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]" aria-hidden>{STATUS_ICON[s]}</span>
            {STATUS_LABEL[s]}
          </span>
        ))}
      </p>
    </main>
  );
}
