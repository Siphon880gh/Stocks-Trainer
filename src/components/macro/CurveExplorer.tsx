import { useState } from "react";
import { EXPLORER_DEFAULTS, EXPLORER_RANGES, SHAPE_TEXT, explore } from "../../lib/macro/curveExplorer";

interface Props {
  initial?: Partial<typeof EXPLORER_DEFAULTS>;
}

function Slider({ id, label, value, min, max, onChange }: { id: string; label: string; value: number; min: number; max: number; onChange: (v: number) => void }) {
  return (
    <label className="block space-y-1" htmlFor={id}>
      <span className="flex justify-between text-[13px]">
        <span>{label}</span>
        <span className="font-mono font-semibold">{value.toFixed(2)}%</span>
      </span>
      <input id={id} type="range" min={min} max={max} step={0.05} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-primary" />
    </label>
  );
}

/** MF9.M2: drag the 2y and 10y yields; see the 2s10s spread, the curve shape and a 30-year mortgage estimate (10y + spread). */
export default function CurveExplorer({ initial }: Props) {
  const d = { ...EXPLORER_DEFAULTS, ...initial };
  const [y2, setY2] = useState(d.y2);
  const [y10, setY10] = useState(d.y10);
  const [ms, setMs] = useState(d.mortgageSpread);
  const r = explore(y2, y10, ms, d.loan);
  const shape = SHAPE_TEXT[r.shape];
  const tone = r.shape === "inverted" ? "text-red-600" : r.shape === "flat" ? "text-amber-600" : "text-emerald-700";
  const h = (v: number) => 100 - (v / 7) * 90;
  return (
    <section className="panel p-4 space-y-3" aria-label="Yield-curve explorer" data-testid="curve-explorer">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="text-[15px] font-semibold">Yield-curve explorer</h2>
        <span className="text-[11px] text-muted">What-if tool · not a forecast</span>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <Slider id="ce-y2" label="2-year Treasury yield" value={y2} min={EXPLORER_RANGES.y2[0]} max={EXPLORER_RANGES.y2[1]} onChange={setY2} />
          <Slider id="ce-y10" label="10-year Treasury yield" value={y10} min={EXPLORER_RANGES.y10[0]} max={EXPLORER_RANGES.y10[1]} onChange={setY10} />
          <Slider id="ce-ms" label="Mortgage spread over the 10-year" value={ms} min={EXPLORER_RANGES.mortgageSpread[0]} max={EXPLORER_RANGES.mortgageSpread[1]} onChange={setMs} />
        </div>
        <svg viewBox="0 0 200 110" className="w-full h-36 bg-canvas rounded-lg" role="img" aria-label={`2-year ${y2.toFixed(2)}%, 10-year ${y10.toFixed(2)}%`}>
          <line x1="20" y1="100" x2="190" y2="100" stroke="currentColor" strokeOpacity="0.2" />
          <polyline points={`40,${h(y2)} 170,${h(y10)}`} fill="none" stroke="currentColor" strokeWidth="2" className={tone} />
          <circle cx="40" cy={h(y2)} r="4" className={`fill-current ${tone}`} />
          <circle cx="170" cy={h(y10)} r="4" className={`fill-current ${tone}`} />
          <text x="40" y="108" fontSize="8" textAnchor="middle" fill="currentColor">2y</text>
          <text x="170" y="108" fontSize="8" textAnchor="middle" fill="currentColor">10y</text>
        </svg>
      </div>
      <div className="grid sm:grid-cols-3 gap-3 text-[13px]">
        <div className="border border-line rounded-lg p-2">
          <p className="text-muted text-[11px]">2s10s spread</p>
          <p className={`font-mono font-semibold ${tone}`} data-testid="ce-spread">{r.spreadBp > 0 ? "+" : r.spreadBp < 0 ? "−" : ""}{Math.abs(r.spreadBp)} bp</p>
        </div>
        <div className="border border-line rounded-lg p-2">
          <p className="text-muted text-[11px]">Curve shape</p>
          <p className={`font-semibold ${tone}`} data-testid="ce-shape">{shape.label}</p>
        </div>
        <div className="border border-line rounded-lg p-2">
          <p className="text-muted text-[11px]">30-year mortgage estimate</p>
          <p className="font-mono font-semibold" data-testid="ce-mortgage">{r.mortgage30.toFixed(2)}%</p>
          <p className="text-[11px] text-muted">≈ ${r.payment.toLocaleString("en-US")}/mo on ${(d.loan / 1000).toFixed(0)}k</p>
        </div>
      </div>
      <p className="text-[12px] text-muted">
        {shape.note} Mortgage rates track the 10-year plus a spread that has itself moved a lot over time; this is a rough what-if, not a quote.
      </p>
    </section>
  );
}
