import { useSearchParams } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import MarkTheBand, { type BandPhase } from "../../components/financials/MarkTheBand";

const PHASES: BandPhase[] = ["band", "fill", "reveal"];
const n = (s: string | null) => (s === null || s === "" || !Number.isFinite(Number(s)) ? null : Number(s));

/** Practice → Mark the band: implied-move band and gap-fill level on an earnings chart (FE8.M3). */
export default function MarkTheBandPage() {
  const [params] = useSearchParams();
  const round = Number(params.get("round") ?? "1");
  const phase = params.get("phase") as BandPhase | null;
  return (
    <PracticeShell
      title="Mark the band"
      blurb="Before the report, mark the move the options market is pricing. After the report bar prints, mark where the gap would fill. Then see what the stock did."
    >
      <div key={params.toString()}>
        <MarkTheBand
          initialRoundIndex={Number.isFinite(round) ? round - 1 : 0}
          initialPhase={phase && PHASES.includes(phase) ? phase : "band"}
          initialLow={n(params.get("low"))}
          initialHigh={n(params.get("high"))}
          initialFill={n(params.get("fill"))}
        />
      </div>
    </PracticeShell>
  );
}
