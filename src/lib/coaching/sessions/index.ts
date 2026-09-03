import type { CoachingSession } from "../types";
import { chaseVsFadeSession } from "./chase-vs-fade";
import { chartSoftGateSession } from "./chart-soft-gate";
import { combinedDecisionsSession } from "./combined-decisions";
import { cryptoChaseSession } from "./crypto-chase";
import { earningsBeatMissSession } from "./earnings-beat-miss";
import { earningsDebtSession } from "./earnings-debt";
import { earningsGuidanceSession } from "./earnings-guidance";
import { earningsMarginsSession } from "./earnings-margins";
import { equitiesLiteracySession } from "./equities-literacy";
import { forexFramingSession } from "./forex-framing";
import { futuresFramingSession } from "./futures-framing";
import { macroPrintSession } from "./macro-print";
import { macroRiskOffSession } from "./macro-risk-off";
import { newsLiteracySession } from "./news-literacy";
import { optionsContextEventSession } from "./options-context-event";
import { statementSnapshotSession } from "./statement-snapshot";
import { supplyShockSession } from "./supply-shock";

/** Folder export — add new session modules here (or extend via authoring skill). */
export const COACHING_SESSION_MODULES: CoachingSession[] = [
  chaseVsFadeSession,
  statementSnapshotSession,
  chartSoftGateSession,
  futuresFramingSession,
  earningsBeatMissSession,
  earningsMarginsSession,
  earningsGuidanceSession,
  earningsDebtSession,
  macroRiskOffSession,
  macroPrintSession,
  supplyShockSession,
  combinedDecisionsSession,
  forexFramingSession,
  cryptoChaseSession,
  optionsContextEventSession,
  equitiesLiteracySession,
  newsLiteracySession,
];
