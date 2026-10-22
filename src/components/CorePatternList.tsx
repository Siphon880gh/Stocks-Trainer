import { useState } from "react";
import PatternDetailModal from "./PatternDetailModal";
import { PATTERN_OHLC } from "../lib/ohlcData";
import { coreBySide, type CorePattern } from "../lib/patternTabs";
import { getPattern, type PatternDef } from "../lib/patterns";
import { cn } from "../lib/utils";

/** Tiny SVG of the pattern's own candles (no axes), for the list rows. */
export function MiniCandles({ chartKey, bars }: { chartKey: string; bars: [number, number] }) {
  const data = (PATTERN_OHLC[chartKey] ?? []).slice(bars[0], bars[1] + 1);
  if (!data.length) return null;
  const hi = Math.max(...data.map((d) => d.high));
  const lo = Math.min(...data.map((d) => d.low));
  const H = 36, W = 12 * data.length + 4;
  const y = (v: number) => 2 + ((hi - v) / (hi - lo || 1)) * (H - 4);
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} aria-hidden="true" data-testid="mini-candles">
      {data.map((d, i) => {
        const x = 4 + i * 12;
        const up = d.close >= d.open;
        const color = up ? "var(--color-up, #16a34a)" : "var(--color-accent-red, #dc2626)";
        return (
          <g key={i}>
            <line x1={x + 4} x2={x + 4} y1={y(d.high)} y2={y(d.low)} stroke={color} strokeWidth={1} />
            <rect x={x} y={y(Math.max(d.open, d.close))} width={8} height={Math.max(1, Math.abs(y(d.open) - y(d.close)))} fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

/** "Core Japanese patterns": a Bullish / Bearish toggle over the 14 core patterns; a row opens the three-tab detail. */
export default function CorePatternList({ initialSide = "bullish" as CorePattern["side"] }) {
  const [side, setSide] = useState<CorePattern["side"]>(initialSide);
  const [open, setOpen] = useState<PatternDef | null>(null);
  const rows = coreBySide(side);
  return (
    <section className="panel p-4 space-y-3" data-testid="core-patterns">
      <div>
        <p className="font-semibold text-[14px]">Core Japanese patterns</p>
        <p className="text-[12px] text-muted">Seven bullish and seven bearish patterns every candlestick reader should know. Each opens with how to recognise it, the buyer vs seller story, and how it is traded.</p>
      </div>
      <div className="grid grid-cols-2 gap-1 rounded-xl border border-line p-1" role="tablist" aria-label="Pattern side">
        {(["bullish", "bearish"] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="tab"
            aria-selected={side === s}
            data-testid={`core-side-${s}`}
            onClick={() => setSide(s)}
            className={cn(
              "rounded-lg py-2 text-[13px] min-h-[44px] capitalize",
              side === s ? (s === "bullish" ? "bg-up/10 text-up font-semibold" : "bg-accent-red/10 text-accent-red font-semibold") : "text-muted hover:bg-primary/5",
            )}
          >
            {s}
          </button>
        ))}
      </div>
      <ul className="divide-y divide-line">
        {rows.map((c) => {
          const def = getPattern(c.id)!;
          return (
            <li key={c.id}>
              <button
                type="button"
                data-testid={`core-row-${c.id}`}
                onClick={() => setOpen(def)}
                className="w-full flex items-center gap-3 py-2 min-h-[52px] text-left hover:bg-primary/5 rounded-lg px-1"
              >
                <span className={cn("shrink-0 rounded-xl w-12 h-12 flex items-center justify-center", side === "bullish" ? "bg-up/10" : "bg-accent-red/10")}>
                  <MiniCandles chartKey={c.chartKey} bars={c.bars} />
                </span>
                <span className="flex-1 text-[14px]">{def.name}</span>
                <span className="material-symbols-outlined text-muted" aria-hidden="true">chevron_right</span>
              </button>
            </li>
          );
        })}
      </ul>
      {open ? <PatternDetailModal pattern={open} onClose={() => setOpen(null)} /> : null}
    </section>
  );
}
