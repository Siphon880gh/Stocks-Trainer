import type { CoachingSession } from "../types";
import { chaseVsFadeSession } from "./chase-vs-fade";
import { chartSoftGateSession } from "./chart-soft-gate";
import { futuresFramingSession } from "./futures-framing";
import { statementSnapshotSession } from "./statement-snapshot";

/** Folder export — add new session modules here (or extend via authoring skill). */
export const COACHING_SESSION_MODULES: CoachingSession[] = [
  chaseVsFadeSession,
  statementSnapshotSession,
  chartSoftGateSession,
  futuresFramingSession,
];
