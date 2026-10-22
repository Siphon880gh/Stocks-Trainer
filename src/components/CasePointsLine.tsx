import type { CaseResultOutcome } from "../lib/progressStore";

/** Reveal line: points for this case (10 best / 5 acceptable / 1 poor), paid once; replays say so. */
export default function CasePointsLine({ award }: { award: Pick<CaseResultOutcome, "pointsAwarded" | "replay" | "firstPoints"> }) {
  return (
    <p data-testid="case-points" className="text-[12px] text-ink font-sans tabular-nums">
      {award.replay
        ? `Replay · no new points (this case paid +${award.firstPoints} pts the first time)`
        : `+${award.pointsAwarded} pts · paid once per case (best 10 · acceptable 5 · poor 1)`}
    </p>
  );
}
