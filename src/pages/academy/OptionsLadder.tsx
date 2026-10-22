import { Link } from "react-router-dom";
import OptionsLadderView from "../../components/academy/options/OptionsLadder";
import { getOscSource } from "../../lib/oscillatorSources";

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
      <section className="panel p-4 space-y-2 text-[13px] max-w-3xl" data-testid="short-dated-risk">
        <h2 className="text-[15px] font-semibold text-ink">Short-dated options: a separate risk</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            Holding an option briefly is not the same as buying a short-dated contract. Holding period is how long you own it; a short-dated contract is one close to its
            expiration date.
          </li>
          <li>A buyer can lose the whole premium. On a contract that expires today that can happen in hours.</li>
          <li>Time decay speeds up near expiration, and short-dated contracts react very sharply to small moves in the stock.</li>
          <li>Large percentage gains on cheap short-dated contracts are not representative or repeatable: the same move the other way takes the premium to zero.</li>
        </ul>
        <p className="text-[12px] text-muted">
          Practice:{" "}
          <Link to="/training?group=trading-risk&start=1" className="text-primary underline">
            Learn · Float, Short-Dated Options &amp; Risk
          </Link>{" "}
          · Glossary:{" "}
          <Link to="/archive?tab=literacy&open=short-dated-option" className="text-primary underline">
            short-dated option
          </Link>
          . Source:{" "}
          <a href={getOscSource("finra-0dte")!.url} target="_blank" rel="noopener noreferrer" className="text-primary underline">
            FINRA on 0DTE options
          </a>
          . Education only; this ladder approves nothing.
        </p>
      </section>
    </main>
  );
}
