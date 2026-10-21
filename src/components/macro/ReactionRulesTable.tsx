import { INSTRUMENT_NAMES, REGIME_BLURB, REGIME_NAMES, rulesMatrix } from "../../lib/macro/reactions";
import type { Direction, Instrument } from "../../lib/macro/types";

const ARROW: Record<Direction, string> = { up: "▲", down: "▼", muted: "–" };
const TONE: Record<Direction, string> = { up: "text-up", down: "text-accent-red", muted: "text-muted" };
const SHOWN: Instrument[] = ["us2y", "dollar", "index", "growth-tech", "homebuilders", "utilities", "banks"];

/** Regime × surprise matrix of typical first reactions (tendencies, not guarantees). */
export default function ReactionRulesTable() {
  const rows = rulesMatrix();
  const header = rows[0]!.cells;
  return (
    <section className="panel p-4 space-y-3" aria-label="How surprises usually travel, by regime">
      <div>
        <h3 className="font-semibold">How a surprise usually travels — by regime</h3>
        <p className="text-[12px] text-muted">
          Typical first-day tendencies in this app&apos;s simulation, for teaching. Real reactions depend on positioning, other news and the size of the surprise, and can reverse.
          Hot = stronger growth, hotter inflation, or a more hawkish Fed than priced. Exception to watch: a bigger-than-priced cut during a growth scare can make stocks fall, because the Fed looks worried.
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-[12px] border-collapse">
          <thead>
            <tr className="border-b border-line bg-canvas">
              <th className="text-left py-1.5 px-2 font-medium">Regime</th>
              {header.map((c) => (
                <th key={`${c.cls}-${c.label}`} className="py-1.5 px-2 font-medium text-left">
                  {c.cls}
                  <br />
                  <span className={c.label === "hot" ? "text-accent-red" : "text-primary"}>{c.label === "hot" ? "hot / hawkish" : "cool / dovish"}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.regime} className="border-b border-line/60 align-top">
                <td className="py-1.5 px-2 w-48">
                  <p className="font-semibold">{REGIME_NAMES[r.regime]}</p>
                  <p className="text-[11px] text-muted">{REGIME_BLURB[r.regime]}</p>
                </td>
                {r.cells.map((c) => (
                  <td key={`${c.cls}-${c.label}`} className="py-1.5 px-2">
                    <ul className="space-y-0.5">
                      {SHOWN.map((i) => (
                        <li key={i} className="whitespace-nowrap">
                          <span className={`inline-block w-3 ${TONE[c.reaction.moves[i]]}`}>{ARROW[c.reaction.moves[i]]}</span> {INSTRUMENT_NAMES[i]}
                        </li>
                      ))}
                    </ul>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
