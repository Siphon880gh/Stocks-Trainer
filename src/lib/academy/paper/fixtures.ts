/** Test helpers: bars in dollars → cents. */
import type { PaperBar } from "./types";
export const B = (o: number, h: number, l: number, c: number): PaperBar => ({ open: Math.round(o * 100), high: Math.round(h * 100), low: Math.round(l * 100), close: Math.round(c * 100) });
export const SYM = "TEST.S";
export const bars = (b: PaperBar) => ({ [SYM]: b });
