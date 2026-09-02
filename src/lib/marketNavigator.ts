import type { AssetClass } from "./samplePacks";
import { isChartGateCleared } from "./beginnerPath";
import { CASE_STUDIES } from "./caseStudies";

export const NAVIGATOR_CLASSES: AssetClass[] = [
  "equity",
  "future",
  "forex",
  "crypto",
  "option_context",
];

export const NAVIGATOR_CLASS_LABELS: Record<AssetClass, string> = {
  equity: "Equities",
  future: "Futures",
  forex: "Forex",
  crypto: "Crypto",
  option_context: "Options context",
};

/** Query aliases → AssetClass */
export function parseMarketClassParam(
  raw: string | null,
): AssetClass | null {
  if (!raw) return null;
  const key = raw.trim().toLowerCase();
  const map: Record<string, AssetClass> = {
    equity: "equity",
    equities: "equity",
    stock: "equity",
    stocks: "equity",
    future: "future",
    futures: "future",
    forex: "forex",
    fx: "forex",
    crypto: "crypto",
    option_context: "option_context",
    options: "option_context",
    "options-context": "option_context",
    options_context: "option_context",
  };
  return map[key] ?? null;
}

export function marketChartsHref(assetClass: AssetClass): string {
  return `/market?class=${assetClass}&nav=1`;
}

export function marketLiteracyHref(assetClass: AssetClass): string {
  switch (assetClass) {
    case "equity":
      return "/training?group=equity-literacy";
    case "future":
      return "/archive?tab=literacy&open=futures-market";
    case "forex":
      return "/archive?tab=literacy&open=forex-spot";
    case "crypto":
      return "/archive?tab=literacy&open=crypto-browse";
    case "option_context":
      return "/archive?tab=literacy&open=options-context";
  }
}

export function marketDecideHref(assetClass: AssetClass): string {
  return `/cases?market=${assetClass}`;
}

export function marketCoachHref(assetClass: AssetClass): string {
  return `/coach?class=${assetClass}`;
}

const CLASS_SESSION_TAGS: Record<AssetClass, string[]> = {
  equity: ["equities", "equity"],
  future: ["futures", "future"],
  forex: ["forex", "fx"],
  crypto: ["crypto"],
  option_context: ["options", "option_context", "options-context", "options_context"],
};

export function coachSessionMatchesClass(
  tags: string[],
  assetClass: AssetClass,
): boolean {
  const needles = new Set(CLASS_SESSION_TAGS[assetClass]);
  return tags.some((t) => needles.has(t.trim().toLowerCase()));
}

export function hasDecidePackForClass(assetClass: AssetClass): boolean {
  return CASE_STUDIES.some(
    (c) => (c.assetClass ?? "equity") === assetClass,
  );
}

export type DecideLockReason = "chart_gate" | "no_pack" | null;

export function decideLockReason(
  assetClass: AssetClass,
  chartGateCleared: boolean = isChartGateCleared(),
): DecideLockReason {
  if (!chartGateCleared) return "chart_gate";
  if (!hasDecidePackForClass(assetClass)) return "no_pack";
  return null;
}

export function decideLockCopy(reason: DecideLockReason): string {
  if (reason === "chart_gate") {
    return "LOCKED · finish Indicators first";
  }
  if (reason === "no_pack") {
    return "LOCKED · SAMPLE decide pack not seeded for this class yet";
  }
  return "";
}
