import { useEffect, useId, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import CoachingPathTrail from "../components/CoachingPathTrail";
import {
  buildPathTrail,
  canStepBack,
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

const OUTCOME_UI: Record<
  CoachingOutcome,
  { label: string; panel: string; badge: string; icon: string }
> = {
  continue: {
    label: "CONTINUE",
    panel: "border-primary/40 bg-neutral-dark/60",
    badge: "text-primary border-primary/40",
    icon: "play_arrow",
  },
  wrong: {
    label: "WRONG · REVIEW",
    panel: "border-accent-red/50 bg-accent-red/10",
    badge: "text-accent-red border-accent-red/50",
    icon: "warning",
  },
  success: {
    label: "SUCCESS",
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
      <div className="min-h-screen bg-background-dark p-6 font-mono text-sm space-y-3">
        <p className="text-accent-red" role="alert">
          {fail.error === "invalid"
            ? `SESSION_INVALID: ${slug}`
            : `SESSION_NOT_FOUND: ${slug}`}
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

  const { session } = loaded;
  const tree = session.tree;
  const state = nav ? ensureKnownNode(tree, nav) : initialNavState(tree);
  const node = currentNode(tree, state);
  if (!node) {
    return (
      <div className="p-6 font-mono text-sm space-y-3">
        <p className="text-accent-red" role="alert">
          NODE_RECOVERY_FAILED
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
    <div className="min-h-screen flex flex-col bg-background-dark text-slate-100 font-display">
      <header className="border-b border-primary/30 p-4 flex items-center justify-between gap-3">
        <Link to="/coach" className="flex items-center gap-2 text-primary hover:opacity-90 shrink-0">
          <span className="material-symbols-outlined">arrow_back</span>
          <span className="font-mono text-xs tracking-widest">CATALOG</span>
        </Link>
        <div className="text-right min-w-0">
          <p className="font-mono text-[10px] text-primary/50 uppercase truncate">
            {session.meta.topic}
          </p>
          <h1 className="text-sm md:text-base font-bold text-primary truncate">
            {session.meta.title}
          </h1>
        </div>
      </header>

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
              OUTCOME · {outcomeUi.label}
            </span>
            {showNodeIds ? (
              <span className="font-mono text-[10px] text-slate-500">
                NODE · {state.currentNodeId}
              </span>
            ) : null}
          </div>
          <p
            id={messageId}
            className="text-sm md:text-base text-slate-100 font-mono normal-case whitespace-pre-wrap leading-relaxed"
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
                    className="w-full text-left border border-primary/40 bg-neutral-dark/40 hover:bg-primary/10 hover:border-primary px-4 py-3 font-mono text-sm normal-case transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
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
              className="border border-primary/40 px-4 py-2 font-mono text-xs tracking-widest text-primary hover:bg-primary/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              {node.outcome === "wrong" ? "REWIND_TO_DECISION" : "STEP_BACK"}
            </button>
          ) : null}
          {terminal ? (
            <button
              type="button"
              onClick={onRestart}
              className="border border-primary px-4 py-2 font-mono text-xs tracking-widest bg-primary/15 text-primary hover:bg-primary/25 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary"
            >
              RESTART_SESSION
            </button>
          ) : null}
          <Link
            to="/coach"
            className="border border-primary/20 px-4 py-2 font-mono text-xs tracking-widest text-slate-400 hover:text-primary"
          >
            EXIT_CATALOG
          </Link>
        </div>
      </main>
    </div>
  );
}
