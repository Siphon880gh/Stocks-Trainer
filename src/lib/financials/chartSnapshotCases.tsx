/**
 * Render cases for the CandlestickChart byte-identity snapshot (FE4.M1).
 * The baseline hashes in __snapshots__/candlestick-baseline.json were generated from the chart BEFORE
 * volume / event support was added. Regenerate only for an intentional visual change:
 *   npx tsx src/lib/financials/chartSnapshotCases.tsx --write
 */
import { createHash } from "node:crypto";
import { writeFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import CandlestickChart from "../../components/CandlestickChart";
import { ENGULFING_OHLC, HAMMER_OHLC, SAMPLE_OHLC, SCENARIO_OHLC_FOR_SNAPSHOT } from "./chartSnapshotData";

export interface SnapshotCase {
  id: string;
  render: () => string;
}

const sha = (s: string) => createHash("sha256").update(s).digest("hex");

export const SNAPSHOT_CASES: SnapshotCase[] = [
  { id: "sample-default", render: () => renderToStaticMarkup(<CandlestickChart data={SAMPLE_OHLC} />) },
  { id: "hammer-compact", render: () => renderToStaticMarkup(<CandlestickChart data={HAMMER_OHLC} compact height={120} />) },
  {
    id: "engulfing-annotated",
    render: () =>
      renderToStaticMarkup(
        <CandlestickChart
          data={ENGULFING_OHLC}
          height={280}
          highlightIndex={2}
          markers={[{ price: ENGULFING_OHLC[1]!.close, label: "Entry" }]}
          annotations={{
            levels: [{ price: ENGULFING_OHLC[0]!.high, label: "Prior high", tone: "supply" }],
            zones: [{ fromIndex: 0, toIndex: 2, top: ENGULFING_OHLC[0]!.high, bottom: ENGULFING_OHLC[0]!.low, label: "Zone", tone: "demand" }],
            points: [{ index: 1, price: ENGULFING_OHLC[1]!.low, label: "Low", tone: "risk" }],
            trendlines: [{ from: { index: 0, price: ENGULFING_OHLC[0]!.low }, to: { index: 2, price: ENGULFING_OHLC[2]!.low }, label: "TL", extend: true }],
          }}
          padRightBars={3}
        />,
      ),
  },
  { id: "scenario-dense", render: () => renderToStaticMarkup(<CandlestickChart data={SCENARIO_OHLC_FOR_SNAPSHOT} height={320} showScaleControls={false} />) },
];

export function snapshotHashes(): Record<string, string> {
  return Object.fromEntries(SNAPSHOT_CASES.map((c) => [c.id, sha(c.render())]));
}

if (process.argv.includes("--write")) {
  const out = new URL("./__snapshots__/candlestick-baseline.json", import.meta.url);
  writeFileSync(out, JSON.stringify(snapshotHashes(), null, 2) + "\n");
  console.log("wrote", out.pathname);
}
