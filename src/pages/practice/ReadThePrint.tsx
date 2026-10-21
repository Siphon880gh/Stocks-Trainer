import { useSearchParams } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import ReadThePrintGame, { type GamePhase } from "../../components/financials/ReadThePrintGame";
import type { FollowThrough, PrintOptionId } from "../../lib/financials/readThePrint";

const PHASES: GamePhase[] = ["read", "answer", "follow", "reveal"];

/** Learn → Read the Print: call the stock's reaction to an earnings report (FE5). */
export default function ReadThePrint() {
  const [params] = useSearchParams();
  const round = Number(params.get("round") ?? "1");
  const phase = params.get("phase") as GamePhase | null;
  const pick = params.get("pick") as PrintOptionId | null;
  const follow = params.get("follow") as FollowThrough | null;
  return (
    <PracticeShell
      title="Read the Print"
      blurb="Read a fictional company's last quarters and the earnings preview (consensus, guidance, implied move), then call how the stock trades on the report. The reveal shows the actuals, the gap and why."
    >
      <div key={params.toString()}>
        <ReadThePrintGame
          initialRoundIndex={Number.isFinite(round) ? round - 1 : 0}
          initialPhase={phase && PHASES.includes(phase) ? phase : "read"}
          initialChoice={pick ?? undefined}
          initialFollow={follow}
        />
      </div>
    </PracticeShell>
  );
}
