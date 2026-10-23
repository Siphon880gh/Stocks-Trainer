import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import CandlestickChart from "../CandlestickChart";
import { mergeAnnotations, type ChartLevel } from "../../lib/chartAnnotations";
import { eventById, resolveEvent } from "../../lib/financials/earningsEvents";
import { FIN_DISCLAIMER, glossaryHref } from "../../lib/financials/format";
import SampleDataNote from "../SampleDataNote";
import { BAND_ROUNDS, BAND_TOLERANCE, FILL_TOLERANCE, gradeBand } from "../../lib/financials/markTheBand";
import { EVENT_INDEX, generateReaction, revealAnnotations } from "../../lib/financials/reactionCharts";

export type BandPhase = "band" | "fill" | "reveal";

interface Props {
  initialRoundIndex?: number;
  initialPhase?: BandPhase;
  initialLow?: number | null;
  initialHigh?: number | null;
  initialFill?: number | null;
}

const usd = (n: number) => `$${n.toFixed(2)}`;
const errText = (e: number | null) => (e === null ? "not set" : `${e >= 0 ? "+" : "−"}${Math.abs(e * 100).toFixed(2)}% off`);
const num = (s: string) => (s.trim() === "" ? null : Number(s));

function PriceInput({ label, value, onChange, disabled, testId }: { label: string; value: string; onChange: (v: string) => void; disabled?: boolean; testId: string }) {
  return (
    <label className="flex flex-col gap-1 text-[12px] text-muted">
      {label}
      <input
        type="number"
        inputMode="decimal"
        step="0.01"
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 rounded border border-line bg-surface px-2 py-1 text-sm text-ink font-mono disabled:opacity-70"
        data-testid={testId}
      />
    </label>
  );
}

/** FE8.M3: mark the implied-move band before the report, then the gap-fill level after it. */
export default function MarkTheBand({ initialRoundIndex = 0, initialPhase = "band", initialLow = null, initialHigh = null, initialFill = null }: Props) {
  const [index, setIndex] = useState(Math.min(Math.max(initialRoundIndex, 0), BAND_ROUNDS.length - 1));
  const [phase, setPhase] = useState<BandPhase>(initialPhase);
  const [low, setLow] = useState(initialLow?.toString() ?? "");
  const [high, setHigh] = useState(initialHigh?.toString() ?? "");
  const [fill, setFill] = useState(initialFill?.toString() ?? "");
  const truth = BAND_ROUNDS[index]!;
  const event = eventById(truth.eventId)!;
  const r = useMemo(() => resolveEvent(event), [event]);
  const rc = useMemo(() => generateReaction(event), [event]);
  const grade = gradeBand(truth, { low: num(low), high: num(high), fill: phase === "band" ? null : num(fill) });

  const shown = phase === "band" ? rc.bars.slice(0, EVENT_INDEX) : phase === "fill" ? rc.bars.slice(0, EVENT_INDEX + 1) : rc.bars;
  // The user's lines are annotation levels (not markers) so the chart's price range always fits them.
  const mine: ChartLevel[] = [
    ...(num(low) !== null ? [{ price: num(low)!, label: `Your low ${usd(num(low)!)}`, tone: "entry" as const }] : []),
    ...(num(high) !== null ? [{ price: num(high)!, label: `Your high ${usd(num(high)!)}`, tone: "entry" as const }] : []),
    ...(phase !== "band" && num(fill) !== null ? [{ price: num(fill)!, label: `Your fill ${usd(num(fill)!)}`, tone: "entry" as const }] : []),
  ];
  const ann = mergeAnnotations(mine.length ? { levels: mine } : undefined, phase === "reveal" ? revealAnnotations(rc, event).annotations : undefined);

  const next = () => {
    setIndex((i) => (i + 1) % BAND_ROUNDS.length);
    setPhase("band");
    setLow("");
    setHigh("");
    setFill("");
  };

  return (
    <div className="relative space-y-4 pr-9" data-testid="mark-the-band" data-phase={phase}>
      <SampleDataNote text={FIN_DISCLAIMER} />
      <div className="flex flex-wrap items-center gap-3 text-[12px] text-muted">
        <span className="rounded border border-line px-2 py-0.5 text-ink">Round {index + 1} / {BAND_ROUNDS.length}</span>
        <span>
          {r.company.name} ({r.company.ticker}) · {r.quarter.label}
        </span>
      </div>

      <div className="panel p-4 space-y-2 text-sm">
        <p>
          Prior close <span className="font-mono font-semibold">{usd(truth.priorClose)}</span> · options-implied move{" "}
          <Link to={glossaryHref("implied-move")} className="underline decoration-dotted">
            ±{truth.impliedMovePct}%
          </Link>
        </p>
        {phase === "band" ? (
          <p className="text-muted">Step 1: mark the band the options market is pricing for report day (prior close × (1 ± implied move)).</p>
        ) : phase === "fill" ? (
          <p className="text-muted">
            Step 2: the report bar has printed ({truth.gapPct >= 0 ? "gap up" : "gap down"}). Mark the price where the{" "}
            <Link to={glossaryHref("earnings-gap")} className="underline decoration-dotted">
              gap
            </Link>{" "}
            would count as filled.
          </p>
        ) : null}
      </div>

      <div className="bg-surface border border-line rounded-lg p-2" data-bars={shown.length}>
        <CandlestickChart
          data={shown}
          height={300}
          showVolume
          showScaleControls={false}
          annotations={ann}
          padRightBars={rc.bars.length - shown.length}
          highlightIndex={phase === "band" ? undefined : EVENT_INDEX}
        />
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <PriceInput label="Band low" value={low} onChange={setLow} disabled={phase !== "band"} testId="band-low" />
        <PriceInput label="Band high" value={high} onChange={setHigh} disabled={phase !== "band"} testId="band-high" />
        {phase !== "band" ? <PriceInput label="Gap fill level" value={fill} onChange={setFill} disabled={phase === "reveal"} testId="fill-level" /> : null}
        {phase === "band" ? (
          <button type="button" className="rounded-lg bg-primary text-white px-4 py-2 text-sm disabled:opacity-50" disabled={num(low) === null || num(high) === null} onClick={() => setPhase("fill")}>
            Lock the band
          </button>
        ) : phase === "fill" ? (
          <button type="button" className="rounded-lg bg-primary text-white px-4 py-2 text-sm disabled:opacity-50" disabled={num(fill) === null} onClick={() => setPhase("reveal")}>
            Reveal
          </button>
        ) : (
          <button type="button" className="rounded-lg bg-primary text-white px-4 py-2 text-sm" onClick={next}>
            Next round →
          </button>
        )}
      </div>

      {phase === "reveal" ? (
        <div className="panel p-4 space-y-2 text-sm" data-testid="band-result">
          <p className="font-semibold">
            {grade.points}/3 · band {usd(truth.low)}–{usd(truth.high)} · fill level {usd(truth.fillLevel)}
          </p>
          <ul className="list-disc pl-5 text-[13px] space-y-0.5">
            <li className={grade.lowOk ? "text-up" : "text-accent-red"}>Low {grade.lowOk ? "✓" : "✗"} ({errText(grade.lowErr)}; within ±{(BAND_TOLERANCE * 100).toFixed(1)}% counts)</li>
            <li className={grade.highOk ? "text-up" : "text-accent-red"}>High {grade.highOk ? "✓" : "✗"} ({errText(grade.highErr)})</li>
            <li className={grade.fillOk ? "text-up" : "text-accent-red"}>
              Fill level {grade.fillOk ? "✓" : "✗"} ({errText(grade.fillErr)}; within ±{(FILL_TOLERANCE * 100).toFixed(2)}% counts): a gap is filled when price trades back to the prior close.
            </li>
          </ul>
          <p className="text-[13px]">
            The report opened {truth.gapPct >= 0 ? "+" : "−"}
            {Math.abs(truth.gapPct * 100).toFixed(1)}% ({Math.abs(truth.gapPct) * 100 > truth.impliedMovePct ? "outside" : "inside"} the band).{" "}
            {truth.filledAfter === null
              ? "The gap did not fill within the 15 sessions shown."
              : `The gap filled ${truth.filledAfter} session${truth.filledAfter === 1 ? "" : "s"} after the report.`}{" "}
            {event.whatMattered}
          </p>
        </div>
      ) : null}
    </div>
  );
}
