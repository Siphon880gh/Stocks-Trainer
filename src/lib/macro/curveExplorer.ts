/** MF9.M2: pure math for the yield-curve explorer (2y / 10y sliders → spread, shape, mortgage estimate). */
export type CurveShape = "inverted" | "flat" | "normal" | "steep";

export const EXPLORER_DEFAULTS = { y2: 4.5, y10: 4.2, mortgageSpread: 2.0, loan: 400_000 };
export const EXPLORER_RANGES = { y2: [0, 7], y10: [0, 7], mortgageSpread: [1, 3.5] } as const;

/** 10y − 2y in basis points (rounded). */
export const spreadBp = (y2: number, y10: number) => Math.round((y10 - y2) * 100);

export function curveShape(bp: number): CurveShape {
  if (bp < 0) return "inverted";
  if (bp < 25) return "flat";
  if (bp <= 150) return "normal";
  return "steep";
}

export const SHAPE_TEXT: Record<CurveShape, { label: string; note: string }> = {
  inverted: {
    label: "Inverted (2y above 10y)",
    note: "Markets expect short rates to fall later — often read as a growth warning. Historically an inversion has preceded many recessions, with long and variable lags, and not every inversion was followed by one.",
  },
  flat: { label: "Flat", note: "Little extra yield for lending longer. Often seen late in a hiking cycle or when growth expectations fade." },
  normal: { label: "Normal (upward sloping)", note: "Longer loans pay more, the usual state when growth and inflation expectations are steady." },
  steep: {
    label: "Steep",
    note: "A big gap: often early in an easing cycle (2y falling fast) or when investors demand more term premium for long bonds. Banks that borrow short and lend long tend to like it.",
  },
};

/** Monthly principal + interest on a fixed loan (30 years by default). */
export function monthlyPayment(principal: number, annualRatePct: number, years = 30): number {
  const n = years * 12;
  const r = annualRatePct / 1200;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - (1 + r) ** -n);
}

export interface ExplorerResult {
  spreadBp: number;
  shape: CurveShape;
  mortgage30: number;
  payment: number;
}

export function explore(y2: number, y10: number, mortgageSpread: number, loan = EXPLORER_DEFAULTS.loan): ExplorerResult {
  const s = spreadBp(y2, y10);
  const mortgage30 = Math.round((y10 + mortgageSpread) * 100) / 100;
  return { spreadBp: s, shape: curveShape(s), mortgage30, payment: Math.round(monthlyPayment(loan, mortgage30)) };
}
