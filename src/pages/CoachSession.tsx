import { useCallback, useEffect, useId, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AiExplainModal from "../components/AiExplainModal";
import CoachingPathTrail from "../components/CoachingPathTrail";
import {
  buildAiExplainPrompt,
  buildPathExplanationMarkdown,
  buildPathTrail,
  canShowAiExplain,
  canStepBack,
  chartBarsForCoachSlug,
  choose,
  currentNode,
  ensureKnownNode,
  getCoachingPersistAdapter,
  initialNavState,
  loadSession,
  restart,
  stepBack,
  type CoachingChoice,
  type CoachingNavState,
  type CoachingOutcome,
} from "../lib/coaching";
import { markCoachingSessionComplete } from "../lib/progressStore";
import {
  canBrowseAssetClass,
  isChartGateTemporarilyBypassed,
  setChartGateTemporaryBypass,
} from "../lib/beginnerPath";
import { assetClassFromCoachTags } from "../lib/marketNavigator";
import YouTubeSearchLink from "../components/YouTubeSearchLink";

const OUTCOME_UI: Record<
  CoachingOutcome,
  { label: string; panel: string; badge: string; icon: string }
> = {
  continue: {
    label: "Continue",
    panel: "border-line bg-surface",
    badge: "text-primary border-line",
    icon: "play_arrow",
  },
  wrong: {
    label: "Wrong · review",
    panel: "border-accent-red/50 bg-accent-red/10",
    badge: "text-accent-red border-accent-red/50",
    icon: "warning",
  },
  success: {
    label: "Success",
    panel: "border-primary bg-primary/10",
    badge: "text-primary border-primary",
    icon: "check_circle",
  },
};

function commitNav(
  slug: string,
  next: CoachingNavState,
  setNav: (s: CoachingNavState) => void,
  clear?: boolean
): void {
  const adapter = getCoachingPersistAdapter();
  if (clear) adapter.clear(slug);
  else adapter.save(slug, next);
  setNav(next);
}

export default function CoachSession() {
  const { slug = "" } = useParams();
  const loaded = loadSession(slug);
  const messageId = useId();
  const messageRef = useRef<HTMLDivElement>(null);
  const skipFocusOnce = useRef(true);

  const [nav, setNav] = useState<CoachingNavState | null>(null);
  const [trailOpen, setTrailOpen] = useState(true);
  const [showNodeIds, setShowNodeIds] = useState(false);
  const [explainOpen, setExplainOpen] = useState(false);
  const closeExplain = useCallback(() => setExplainOpen(false), []);
  const [tempBypass, setTempBypass] = useState(isChartGateTemporarilyBypassed);
  const sessionClass = loaded.ok
    ? assetClassFromCoachTags(loaded.session.meta.tags)
    : "equity";
  const classOk = canBrowseAssetClass(sessionClass) || tempBypass;

  useEffect(() => {
    const r = loadSession(slug);
    if (!r.ok) {
      setNav(null);
      return;
    }
    skipFocusOnce.current = true;
    setNav(getCoachingPersistAdapter().load(slug, r.session.tree));
  }, [slug]);

  useEffect(() => {
    setExplainOpen(false);
    if (!nav) return;
    if (skipFocusOnce.current) {
      skipFocusOnce.current = false;
      return;
    }
    messageRef.current?.focus();
  }, [nav?.currentNodeId]);

  if (loaded.ok === false) {
    const fail = loaded;
    return (
      <div className="p-6 text-sm space-y-3">
        <p className="text-accent-red" role="alert">
          {fail.error === "invalid"
            ? `This coaching session is invalid: ${slug}`
            : `Coaching session not found: ${slug}`}
        </p>
        {fail.error === "invalid" && fail.issues ? (
          <ul className="text-slate-400 text-xs space-y-1">
            {fail.issues.map((i) => (
              <li key={`${i.code}-${i.nodeId ?? ""}`}>
                {i.code}: {i.message}
              </li>
            ))}
          </ul>
        ) : null}
        <Link to="/coach" className="text-primary underline">
          Back to coaching catalog
        </Link>
      </div>
    );
  }

  if (!classOk) {
    return (
      <div className="max-w-xl mx-auto p-6 space-y-4">
        <p className="text-sm text-slate-200 leading-relaxed">
          This step is in Futures, Forex, Crypto, or Options context. Those
          classes stay locked until you peek this session.
        </p>
        <button
          type="button"
          className="inline-flex rounded-lg border border-line px-3 py-2 text-sm font-mono text-primary hover:bg-primary/10"
          onClick={() => {
            setChartGateTemporaryBypass(true);
            setTempBypass(true);
          }}
        >
          Browse this session
        </button>
        <Link to="/coach" className="block text-sm text-primary underline">
          Back to coaching catalog
        </Link>
      </div>
    );
  }

  const { session } = loaded;
  const tree = session.tree;
  const state = nav ? ensureKnownNode(tree, nav) : initialNavState(tree);
  const node = currentNode(tree, state);
  if (!node) {
    return (
      <div className="p-6 font-mono text-sm space-y-3">
        <p className="text-accent-red" role="alert">
          Couldn’t restore this coaching step.
        </p>
        <Link to="/coach" className="text-primary underline">
          Back to catalog
        </Link>
      </div>
    );
  }

  const outcomeUi = OUTCOME_UI[node.outcome];
  const showChoices = node.outcome === "continue" && node.choices.length > 0;
  const backAvailable = canStepBack(tree, state);
  const terminal = node.outcome === "wrong" || node.outcome === "success";
  const trail = buildPathTrail(tree, state);
  const showAiExplain = canShowAiExplain(node.outcome, state.history.length);
  const explainPrompt = showAiExplain
    ? buildAiExplainPrompt(
        buildPathExplanationMarkdown({
          title: session.meta.title,
          topic: session.meta.topic,
          steps: trail,
          chart: chartBarsForCoachSlug(slug),
        })
      )
    : "";

  const onChoose = (choice: CoachingChoice) => {
    const result = choose(tree, state, choice);
    if (!result.ok) return;
    commitNav(slug, result.state, setNav);
    const landed = tree.nodes[result.state.currentNodeId];
    if (landed?.outcome === "success") {
      markCoachingSessionComplete(slug);
    }
  };

  const onBack = () => {
    const result = stepBack(tree, state);
    if (result.ok) commitNav(slug, result.state, setNav);
  };

  const onRestart = () => {
    commitNav(slug, restart(tree), setNav, true);
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="border-b border-line bg-surface px-4 py-3 flex items-center justify-between gap-3">
        <Link to="/coach" className="text-sm text-primary hover:underline shrink-0">
          ← Coach
        </Link>
        <div className="text-right min-w-0">
          <p className="text-[12px] text-muted truncate">
            {session.meta.topic}
          </p>
          <div className="flex items-center justify-end gap-2 min-w-0">
            <h1 className="text-sm md:text-base font-semibold truncate">
              {session.meta.title}
            </h1>
            <YouTubeSearchLink title={session.meta.title} />
          </div>
        </div>
      </div>

      <main className="flex-1 max-w-3xl mx-auto w-full p-4 space-y-4">
        <CoachingPathTrail
          steps={trail}
          expanded={trailOpen}
          onExpandedChange={setTrailOpen}
          showNodeIds={showNodeIds}
          onShowNodeIdsChange={setShowNodeIds}
        />

        <div
          ref={messageRef}
          tabIndex={-1}
          aria-labelledby={messageId}
          aria-live="polite"
          className={`border rounded-xl p-4 space-y-3 outline-none focus-visible:ring-2 focus-visible:ring-primary/60 ${outcomeUi.panel}`}
        >
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 font-mono text-[10px] tracking-widest border px-2 py-0.5 ${outcomeUi.badge}`}
            >
              <span className="material-symbols-outlined text-sm" aria-hidden>
                {outcomeUi.icon}
              </span>
              {outcomeUi.label}
            </span>
            {showAiExplain ? (
              <button
                type="button"
                onClick={() => setExplainOpen(true)}
                className="inline-flex items-center gap-1 font-mono text-[10px] tracking-widest border border-line px-2 py-0.5 text-primary hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
              >
                <span className="material-symbols-outlined text-sm" aria-hidden>
                  auto_fix_high
                </span>
                AI Explain
              </button>
            ) : null}
            {showNodeIds ? (
              <span className="font-mono text-[10px] text-slate-500">
                NODE · {state.currentNodeId}
              </span>
            ) : null}
          </div>
          <p
            id={messageId}
            className="text-sm md:text-base whitespace-pre-wrap leading-relaxed"
          >
            {node.message}
          </p>
        </div>

        {showChoices ? (
          <div className="space-y-2" role="group" aria-label="Coaching choices">
            <p className="text-[10px] font-bold text-primary/60 uppercase tracking-[0.2em]">
              Choose
            </p>
            <ul className="space-y-2">
              {node.choices.map((choice) => (
                <li key={`${choice.label}->${choice.next}`}>
                  <button
                    type="button"
                    onClick={() => onChoose(choice)}
                    className="w-full text-left border border-line bg-canvas hover:bg-primary/10 hover:border-primary px-4 py-3 font-mono text-sm normal-case transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
                  >
                    {choice.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="flex flex-wrap gap-3 pt-2" role="group" aria-label="Session actions">
          {backAvailable ? (
            <button
              type="button"
              onClick={onBack}
              className="border border-line px-4 py-2 font-mono text-xs tracking-widest text-primary hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {node.outcome === "wrong" ? "Rewind to decision" : "Step back"}
            </button>
          ) : null}
          {terminal ? (
            <button
              type="button"
              onClick={onRestart}
              className="border border-primary px-4 py-2 text-sm bg-primary/10 text-primary hover:bg-primary/20 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              Restart session
            </button>
          ) : null}
          <Link
            to="/coach"
            className="border border-line px-4 py-2 text-sm text-muted hover:text-ink rounded-md"
          >
            Exit to catalog
          </Link>
        </div>
      </main>
      <AiExplainModal
        open={explainOpen && showAiExplain}
        prompt={explainPrompt}
        onClose={closeExplain}
      />
    </div>
  );
}
