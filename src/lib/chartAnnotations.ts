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
