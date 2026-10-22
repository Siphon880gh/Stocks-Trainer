import { Link } from "react-router-dom";
import OptionsLadderView from "../../components/academy/options/OptionsLadder";

/** /academy/options — BA8: options knowledge ladder (education gating only). */
export default function OptionsLadderPage() {
  return (
    <main className="flex-1 px-4 py-6 max-w-5xl mx-auto w-full space-y-4" data-testid="options-page">
      <p className="text-[12px] text-muted">
        <Link to="/academy" className="hover:text-ink">
          Academy
        </Link>{" "}
        · Options ladder
      </p>
      <h1 className="text-2xl font-semibold tracking-tight">Options knowledge ladder</h1>
      <p className="text-[13px] text-muted max-w-3xl">
        Four levels, in the order brokers usually approve them: covered strategies, buying options, spreads, then naked options as a concept. Every chart is profit or
        loss per share at expiration, from simple arithmetic on SAMPLE prices. Pass each level's check to open the next.
      </p>
      <OptionsLadderView />
    </main>
  );
}
