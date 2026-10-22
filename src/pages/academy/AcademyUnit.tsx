import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import UnitPlayer from "../../components/academy/UnitPlayer";
import { getUnit, getLevel } from "../../lib/academy/content/levels";
import { loadAcademy, saveAcademy, type KVStorage } from "../../lib/academy/storage";
import { recordUnitAttempt, unitStatus } from "../../lib/academy/progress";
import { awardUnitMastery } from "../../lib/academy/rewards/award";

/** /academy/:unitId — one unit: cards, quiz, mastery; progress saved on the academy key. */
export default function AcademyUnit({ storage }: { storage?: KVStorage }) {
  const { unitId = "" } = useParams();
  const unit = getUnit(unitId);
  const [attempt, setAttempt] = useState(() => loadAcademy(storage).state.units[unitId]?.attempts ?? 0);
  const [key, setKey] = useState(0);
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
      <div key={key}>
      <UnitPlayer
        unit={unit}
        attempt={attempt}
        onFinish={(score) => {
          const s = recordUnitAttempt(loadAcademy(storage).state, unit.id, score.correct, score.total);
          saveAcademy(s, storage);
          awardUnitMastery(unit.id, score, storage);
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
