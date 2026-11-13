import { Fragment, type ReactNode } from "react";
import type { MockBlock, ToolScreen } from "../../lib/toolTraining";
import { seededTape } from "../../lib/marketThemes/helpers";
import { cn } from "../../lib/utils";
import { ToolTextView } from "./Simulation";
import { LiveLinks } from "./LiveLinks";
import { FieldLabel, ScreenTerms } from "./ToolTerm";
import { screenFieldTermIds } from "../../lib/toolTraining";

/** Shared pieces for simulated tool layouts. Drawn in this app's own look: no logos, no copied styling. */

export function MockFrame({ where, children }: { where: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-line bg-surface overflow-hidden" data-testid="mock-frame">
      <div className="flex items-center gap-2 border-b border-line bg-canvas px-3 py-1.5 text-[11px] text-muted">
        <span className="inline-flex gap-1" aria-hidden>
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
          <span className="h-2 w-2 rounded-full bg-line" />
        </span>
        <span className="truncate">Simulated layout · {where}</span>
      </div>
      <div className="p-3 space-y-3">{children}</div>
    </div>
  );
}

export function Marker({ n }: { n: number }) {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-white text-[11px] font-semibold" aria-hidden>
      {n}
    </span>
  );
}

export function MockQuote({ symbol, name, price, change, up, meta }: Extract<MockBlock, { kind: "quote" }>) {
  return (
    <div>
      <p className="text-[12px] text-muted">{name} ({symbol})</p>
      <p className="flex items-baseline gap-2">
        <span className="text-xl font-semibold tabular-nums">{price}</span>
        <span className={cn("text-[13px] font-medium tabular-nums", up ? "text-up" : "text-down")}>{change}</span>
      </p>
      <p className="text-[11px] text-muted">{meta}</p>
    </div>
  );
}

export function MockTabs({ tabs, active }: { tabs: string[]; active: number }) {
  return (
    <div className="flex flex-wrap gap-1 border-b border-line text-[12px]">
      {tabs.map((t, i) => (
        <span key={t} className={cn("px-2 py-1", i === active ? "border-b-2 border-primary text-primary font-semibold" : "text-muted")}>{t}</span>
      ))}
    </div>
  );
}

export function MockStats({ title, rows }: { title?: string; rows: { label: string; value: string }[] }) {
  return (
    <div>
      {title ? <p className="text-[12px] font-semibold mb-1">{title}</p> : null}
      <dl className="grid grid-cols-2 sm:grid-cols-3 gap-x-4 gap-y-1 text-[12px]">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between gap-2 border-b border-line py-0.5">
            <dt className="text-muted"><FieldLabel label={r.label} /></dt>
            <dd className="font-medium tabular-nums">{r.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function MockTable({ title, columns, rows }: { title?: string; columns: string[]; rows: string[][] }) {
  return (
    <div className="overflow-x-auto">
      {title ? <p className="text-[12px] font-semibold mb-1">{title}</p> : null}
      <table className="w-full text-[12px] border-collapse">
        <thead>
          <tr className="text-left text-muted border-b border-line">
            {columns.map((c) => <th key={c} className="py-1 pr-2 font-medium"><FieldLabel label={c} /></th>)}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line">
              {r.map((cell, j) => <td key={j} className="py-1 pr-2 tabular-nums">{j === 0 ? <FieldLabel label={cell} /> : cell}</td>)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function MockFilters({ title, filters }: { title?: string; filters: { label: string; value: string }[] }) {
  return (
    <div>
      {title ? <p className="text-[12px] font-semibold mb-1">{title}</p> : null}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
        {filters.map((f) => (
          <div key={f.label} className="rounded border border-line px-2 py-1">
            <p className="text-muted"><FieldLabel label={f.label} /></p>
            <p className="font-medium">{f.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function MockChips({ title, chips, active }: { title?: string; chips: string[]; active?: number }) {
  return (
    <div>
      {title ? <p className="text-[12px] font-semibold mb-1">{title}</p> : null}
      <div className="flex flex-wrap gap-1.5">
        {chips.map((c, i) => (
          <span key={c} className={cn("px-2 py-0.5 rounded-full border text-[11px]", i === active ? "border-primary bg-primary text-white" : "border-line text-muted")}>{c}</span>
        ))}
      </div>
    </div>
  );
}

/** Seeded line chart: the same seed always draws the same SIMULATED line. */
export function MockChart({ label, seed, drift, points = 40 }: { label: string; seed: number; drift: number; points?: number }) {
  const { full } = seededTape({ seed, start: 100, pre: points - 1, post: 1, preDrift: drift, postDrift: drift, vol: 0.02 });
  const closes = full.map((b) => b.close);
  const lo = Math.min(...closes);
  const hi = Math.max(...closes);
  const w = 300;
  const h = 80;
  const path = closes.map((c, i) => `${((i / (closes.length - 1)) * w).toFixed(1)},${(h - ((c - lo) / (hi - lo || 1)) * h).toFixed(1)}`).join(" ");
  const up = closes[closes.length - 1]! >= closes[0]!;
  return (
    <div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-20" aria-hidden>
        <polyline points={path} fill="none" strokeWidth="1.5" className={up ? "stroke-up" : "stroke-down"} />
      </svg>
      <p className="text-[11px] text-muted">{label}</p>
    </div>
  );
}

export function MockBlockView({ block }: { block: MockBlock }) {
  switch (block.kind) {
    case "quote": return <MockQuote {...block} />;
    case "tabs": return <MockTabs tabs={block.tabs} active={block.active} />;
    case "stats": return <MockStats title={block.title} rows={block.rows} />;
    case "table": return <MockTable title={block.title} columns={block.columns} rows={block.rows} />;
    case "filters": return <MockFilters title={block.title} filters={block.filters} />;
    case "chips": return <MockChips title={block.title} chips={block.chips} active={block.active} />;
    case "chart": return <MockChart label={block.label} seed={block.seed} drift={block.drift} points={block.points} />;
    case "note": return <p className="text-[11px] text-muted">{block.text}</p>;
  }
}

/** One simulated screen with numbered markers, alt text for screen readers and a caption. */
export function MockScreen({ screen, asOf }: { screen: ToolScreen; asOf?: string }) {
  const captionId = `mock-${screen.id}-caption`;
  return (
    <figure className="space-y-2" data-testid="mock-screen" data-screen={screen.id} aria-labelledby={captionId}>
      <p className="font-semibold text-[13px]">{screen.title}</p>
      <p className="sr-only">{screen.alt}</p>
      <div aria-hidden>
        <MockFrame where={screen.where}>
          {screen.blocks.map((b, i) => {
            const marks = screen.callouts.filter((c) => c.block === i);
            return (
              <Fragment key={i}>
                <div className="flex gap-2">
                  {marks.length ? <div className="flex flex-col gap-1 pt-0.5">{marks.map((m) => <Fragment key={m.n}><Marker n={m.n} /></Fragment>)}</div> : null}
                  <div className="min-w-0 flex-1"><MockBlockView block={b} /></div>
                </div>
              </Fragment>
            );
          })}
        </MockFrame>
      </div>
      <LiveLinks links={screen.live} asOf={asOf} />
      <ScreenTerms ids={screenFieldTermIds(screen)} />
      <figcaption id={captionId} className="text-[12px] space-y-1">
        <span className="block">{screen.caption}</span>
        <ol className="space-y-0.5">
          {screen.callouts.map((c) => (
            <li key={c.n} className="flex gap-2"><Marker n={c.n} /><span><ToolTextView text={c.text} /></span></li>
          ))}
        </ol>
      </figcaption>
    </figure>
  );
}
