/** Fixed inputs for the chart snapshot (kept separate so the case file stays tiny). */
import { ENGULFING_OHLC, HAMMER_OHLC, SAMPLE_OHLC } from "../ohlcData";
import { SCENARIO_OHLC } from "../scenarioCharts";

export { ENGULFING_OHLC, HAMMER_OHLC, SAMPLE_OHLC };
/** First scenario chart in key order: a dense (> 24 bar) existing chart. */
export const SCENARIO_OHLC_FOR_SNAPSHOT = SCENARIO_OHLC[Object.keys(SCENARIO_OHLC).sort()[0]!]!;
