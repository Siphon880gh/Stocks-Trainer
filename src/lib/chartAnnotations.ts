/** Drawing overlays for CandlestickChart (levels, trendlines, zones, labeled points). Prices in chart units, bars by index. */

export type AnnotationTone = "neutral" | "supply" | "demand" | "risk" | "reward" | "entry";

export interface ChartLevel {
  price: number;
  label: string;
  tone?: AnnotationTone;
}

export interface ChartTrendline {
  from: { index: number; price: number };
  to: { index: number; price: number };
  label?: string;
  tone?: AnnotationTone;
  /** Extend the line to the right edge of the plot. */
  extend?: boolean;
}

export interface ChartZone {
  fromIndex: number;
  /** Defaults to the right edge of the plot (including padded empty slots). */
  toIndex?: number;
  top: number;
  bottom: number;
  label: string;
  tone: AnnotationTone;
  /** Where the label sits inside the box (right-aligned). Default "top". */
  labelAt?: "top" | "bottom";
}

export interface ChartPoint {
  index: number;
  price: number;
  label: string;
  tone?: AnnotationTone;
}

/** A vertical line at a bar (an earnings report, a macro release …) with a short label at the top. */
export interface ChartEvent {
  index: number;
  label: string;
  tone?: AnnotationTone;
}

export interface ChartAnnotations {
  levels?: ChartLevel[];
  trendlines?: ChartTrendline[];
  zones?: ChartZone[];
  points?: ChartPoint[];
  /** Vertical event lines (no price, so they do not change the chart's price extent). */
  events?: ChartEvent[];
}

/** Every price an annotation touches, so the chart can fit them in view. */
export function annotationPrices(a?: ChartAnnotations): number[] {
  if (!a) return [];
  return [
    ...(a.levels ?? []).map((l) => l.price),
    ...(a.zones ?? []).flatMap((z) => [z.top, z.bottom]),
    ...(a.points ?? []).map((p) => p.price),
    ...(a.trendlines ?? []).flatMap((t) => [t.from.price, t.to.price]),
  ];
}

/** Merge annotation sets (e.g. always-on + revealed-after-answer). */
export function mergeAnnotations(...sets: Array<ChartAnnotations | undefined>): ChartAnnotations | undefined {
  const present = sets.filter((s): s is ChartAnnotations => Boolean(s));
  if (present.length === 0) return undefined;
  return {
    levels: present.flatMap((s) => s.levels ?? []),
    trendlines: present.flatMap((s) => s.trendlines ?? []),
    zones: present.flatMap((s) => s.zones ?? []),
    points: present.flatMap((s) => s.points ?? []),
  };
}

/** Price on a trendline at a bar index (straight line through its two anchors). */
export function trendlinePriceAt(t: ChartTrendline, index: number): number {
  const slope = (t.to.price - t.from.price) / (t.to.index - t.from.index);
  return t.from.price + slope * (index - t.from.index);
}

/** One step of a stair-step line: from `fromIndex` the line sits at `price` until the next step. */
export interface ChartStep {
  fromIndex: number;
  price: number;
}

/**
 * A stair-step line (e.g. a trailing stop raised under each new higher low) as plain trendlines:
 * a flat segment per step plus a vertical riser where the level changes. The last step runs to the
 * right edge. Only the last segment carries `label`, so the chart is not cluttered.
 */
export function stairStepLines(steps: ChartStep[], opts: { label?: string; tone?: AnnotationTone } = {}): ChartTrendline[] {
  const tone = opts.tone ?? "risk";
  const lines: ChartTrendline[] = [];
  steps.forEach((s, i) => {
    const next = steps[i + 1];
    if (next) {
      lines.push({ from: { index: s.fromIndex, price: s.price }, to: { index: next.fromIndex, price: s.price }, tone });
      lines.push({ from: { index: next.fromIndex, price: s.price }, to: { index: next.fromIndex, price: next.price }, tone });
    } else {
      lines.push({ from: { index: s.fromIndex, price: s.price }, to: { index: s.fromIndex + 1, price: s.price }, tone, extend: true, label: opts.label });
    }
  });
  return lines;
}
