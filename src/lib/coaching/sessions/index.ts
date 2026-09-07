import type { CoachingSession } from "../types";
import { chaseVsFadeSession } from "./chase-vs-fade";
import { chartSoftGateSession } from "./chart-soft-gate";
import { combinedDecisionsSession } from "./combined-decisions";
import { cryptoBtcRiskOffSession } from "./crypto-btc-risk-off";
import { cryptoChaseSession } from "./crypto-chase";
import { cryptoCombinedSession } from "./crypto-combined";
import { cryptoCpiPrintSession } from "./crypto-cpi-print";
import { cryptoDepegScareSession } from "./crypto-depeg-scare";
import { cryptoDumpNoReclaimSession } from "./crypto-dump-no-reclaim";
import { cryptoHackSupplySession } from "./crypto-hack-supply";
import { cryptoListingHeadlineSession } from "./crypto-listing-headline";
import { cryptoLiteracySession } from "./crypto-literacy";
import { cryptoRumorVsListingSession } from "./crypto-rumor-vs-listing";
import { cryptoSolAltHypeSession } from "./crypto-sol-alt-hype";
import { cryptoWeekendGapSession } from "./crypto-weekend-gap";
import { earningsBeatMissSession } from "./earnings-beat-miss";
import { earningsDebtSession } from "./earnings-debt";
import { earningsGuidanceSession } from "./earnings-guidance";
import { earningsMarginsSession } from "./earnings-margins";
import { equitiesLiteracySession } from "./equities-literacy";
import { forexBojPrintSession } from "./forex-boj-print";
import { forexCbHeadlineSession } from "./forex-cb-headline";
import { forexChaseFadeSession } from "./forex-chase-fade";
import { forexChaseSpikeSession } from "./forex-chase-spike";
import { forexCombinedSession } from "./forex-combined";
import { forexEnergyEurSession } from "./forex-energy-eur";
import { forexFramingSession } from "./forex-framing";
import { forexJpyDumpSession } from "./forex-jpy-dump";
import { forexLiteracySession } from "./forex-literacy";
import { forexMajorsVsCrossesSession } from "./forex-majors-vs-crosses";
import { forexNfpPrintSession } from "./forex-nfp-print";
import { forexRumorVsPrintSession } from "./forex-rumor-vs-print";
import { forexSpreadHoldSession } from "./forex-spread-hold";
import { futuresCombinedSession } from "./futures-combined";
import { futuresCrudeSupplySession } from "./futures-crude-supply";
import { futuresFomcPrintSession } from "./futures-fomc-print";
import { futuresFramingSession } from "./futures-framing";
import { futuresGoldHavenSession } from "./futures-gold-haven";
import { futuresIndexRiskOffSession } from "./futures-index-risk-off";
import { futuresLiteracySession } from "./futures-literacy";
import { futuresNqChaseSession } from "./futures-nq-chase";
import { futuresRollSession } from "./futures-roll";
import { futuresRumorVsPrintSession } from "./futures-rumor-vs-print";
import { futuresShortVsSellSession } from "./futures-short-vs-sell";
import { futuresWeatherAgSession } from "./futures-weather-ag";
import { macroPrintSession } from "./macro-print";
import { macroRiskOffSession } from "./macro-risk-off";
import { newsLiteracySession } from "./news-literacy";
import { optionsCombinedStockSession } from "./options-combined-stock";
import { optionsContextEventSession } from "./options-context-event";
import { optionsEarningsNoChainSession } from "./options-earnings-no-chain";
import { optionsFailedBreakoutSession } from "./options-failed-breakout";
import { optionsHorizonMismatchSession } from "./options-horizon-mismatch";
import { optionsLiteracySession } from "./options-literacy";
import { optionsPostEventSession } from "./options-post-event";
import { optionsPreEventChaseSession } from "./options-pre-event-chase";
import { optionsRiskOffStockSession } from "./options-risk-off-stock";
import { optionsRumorVsEventSession } from "./options-rumor-vs-event";
import { optionsUnderlyingHeadlineSession } from "./options-underlying-headline";
import { optionsVolSpikeSession } from "./options-vol-spike";
import { shortVsSellSession } from "./short-vs-sell";
import { statementSnapshotSession } from "./statement-snapshot";
import { supplyShockSession } from "./supply-shock";

/** Folder export — add new session modules here (or extend via authoring skill). */
export const COACHING_SESSION_MODULES: CoachingSession[] = [
  chaseVsFadeSession,
  statementSnapshotSession,
  chartSoftGateSession,
  futuresFramingSession,
  futuresRollSession,
  futuresWeatherAgSession,
  futuresCrudeSupplySession,
  futuresIndexRiskOffSession,
  futuresNqChaseSession,
  futuresFomcPrintSession,
  futuresGoldHavenSession,
  futuresShortVsSellSession,
  futuresRumorVsPrintSession,
  futuresCombinedSession,
  futuresLiteracySession,
  earningsBeatMissSession,
  earningsMarginsSession,
  earningsGuidanceSession,
  earningsDebtSession,
  macroRiskOffSession,
  macroPrintSession,
  supplyShockSession,
  combinedDecisionsSession,
  forexFramingSession,
  forexChaseFadeSession,
  forexNfpPrintSession,
  forexSpreadHoldSession,
  forexJpyDumpSession,
  forexEnergyEurSession,
  forexBojPrintSession,
  forexCbHeadlineSession,
  forexChaseSpikeSession,
  forexMajorsVsCrossesSession,
  forexRumorVsPrintSession,
  forexCombinedSession,
  forexLiteracySession,
  cryptoChaseSession,
  cryptoWeekendGapSession,
  cryptoDepegScareSession,
  cryptoDumpNoReclaimSession,
  cryptoListingHeadlineSession,
  cryptoHackSupplySession,
  cryptoBtcRiskOffSession,
  cryptoCpiPrintSession,
  cryptoSolAltHypeSession,
  cryptoRumorVsListingSession,
  cryptoCombinedSession,
  cryptoLiteracySession,
  optionsContextEventSession,
  optionsVolSpikeSession,
  optionsPostEventSession,
  optionsFailedBreakoutSession,
  optionsUnderlyingHeadlineSession,
  optionsRiskOffStockSession,
  optionsEarningsNoChainSession,
  optionsRumorVsEventSession,
  optionsCombinedStockSession,
  optionsLiteracySession,
  optionsPreEventChaseSession,
  optionsHorizonMismatchSession,
  equitiesLiteracySession,
  newsLiteracySession,
  shortVsSellSession,
];
