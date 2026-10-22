import { SAMPLE_OHLC, type OHLC } from "./ohlcData";
import { getSamplePack } from "./samplePacks";

/**
 * Bars for an overlay (indicator) quiz chart.
 *
 * A question tagged with `samplePackId` describes that pack's tape ("SAMPLE
 * squeeze pack: range collapses…"), so it charts the pack's own SAMPLE bars.
 * Untagged indicator questions keep the shared SAMPLE_OHLC series.
 */
export function overlayQuizBars(question: { samplePackId?: string }): OHLC[] {
  if (question.samplePackId) {
    const pack = getSamplePack(question.samplePackId);
    if (pack && pack.ohlc.length > 0) return pack.ohlc;
  }
  return SAMPLE_OHLC;
}

/** Display name of the tagged SAMPLE pack, for the chart caption. */
export function quizSamplePackName(question: { samplePackId?: string }): string | null {
  if (!question.samplePackId) return null;
  return getSamplePack(question.samplePackId)?.displayName ?? null;
}
