/** Exhibits a macro quiz question can show above its options (rendered by components/macro/MacroQuizExhibit.tsx). */
import type { Instrument } from "../types";

export type MacroExhibit =
  /** Expectations panel (consensus, prior, actual) and optionally the SIMULATED look-alike. */
  | { kind: "release"; eventId: string; showViewer?: boolean }
  /**
   * 5-minute reaction chart. "predict": only pre-release bars until the answer is submitted.
   * "classify": full chart up front, teaching annotations after submit.
   */
  | { kind: "reaction"; eventId: string; instrument: Instrument; mode: "predict" | "classify" }
  | { kind: "curve"; day: number }
  | { kind: "pmms"; week: number }
  | { kind: "pricing"; month: number }
  | { kind: "dots"; month: number };
