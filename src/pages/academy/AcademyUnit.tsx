import { useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import UnitPlayer from "../../components/academy/UnitPlayer";
import { getUnit, getLevel } from "../../lib/academy/content/levels";
import { loadAcademy, saveAcademy, type KVStorage } from "../../lib/academy/storage";
import { recordUnitAttempt, unitStatus } from "../../lib/academy/progress";
import { awardUnitMastery } from "../../lib/academy/rewards/award";

/** /academy/:unitId — one unit: cards, quiz, mastery; progress saved on the academy key. */
export default function AcademyUnit({ storage }: { storage?: KVStorage }) {
  const { unitId = "" } = useParams();
  // ?check=1 (Academy hub "Test out"): open straight on the unit check; passing it records mastery as usual.
  const [params] = useSearchParams();
  const checkFirst = params.get("check") === "1";
  const unit = getUnit(unitId);
  const [attempt, setAttempt] = useState(() => loadAcademy(storage).state.units[unitId]?.attempts ?? 0);
  const [key, setKey] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  if (!unit) {
    return (
      <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full space-y-3">
        <p className="panel p-4">That unit does not exist. <Link to="/academy" className="text-primary underline">Back to the Academy</Link></p>
      </main>
    );
  }
  const state = loadAcademy(storage).state;
  const status = unitStatus(state, unit.id);
  const level = getLevel(unit.levelId)!;
  return (
    <main className="flex-1 px-4 py-6 max-w-3xl mx-auto w-full space-y-4">
      <p className="text-[12px] text-muted">
        <Link to="/academy" className="hover:text-ink">
          Academy
        </Link>{" "}
        · {unit.levelId} {level.title}
        {status === "locked" ? " · this level is not unlocked yet, but you can still read it" : status === "mastered" ? " · mastered" : ""}
      </p>
      {toast ? (
        <p className="panel px-3 py-2 text-[13px] border-sim/40" role="status" data-testid="reward-toast">
          {toast}
        </p>
      ) : null}
      <div key={key}>
      <UnitPlayer
        unit={unit}
        attempt={attempt}
        initialPhase={checkFirst ? "quiz" : "cards"}
        onFinish={(score) => {
          const s = recordUnitAttempt(loadAcademy(storage).state, unit.id, score.correct, score.total);
          saveAcademy(s, storage);
          const r = awardUnitMastery(unit.id, score, storage);
          if (r.added || r.newBadges.length) setToast(`${r.added ? `+${r.added} practice points` : ""}${r.added && r.newBadges.length ? " · " : ""}${r.newBadges.length ? `new badge${r.newBadges.length > 1 ? "s" : ""} earned` : ""}. Points are virtual.`);
        }}
        onRetry={() => {
          setAttempt(attempt + 1);
          setKey(key + 1);
        }}
      />
      </div>
    </main>
  );
}
