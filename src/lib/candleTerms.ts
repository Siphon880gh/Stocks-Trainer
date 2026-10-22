/** Glossary terms for the Japanese candlesticks lesson and the Heikin-Ashi lab. Educational, not advice. */
import type { LiteracyTerm } from "./literacyTerms";

export const CANDLE_TERMS: LiteracyTerm[] = [
  {
    id: "japanese-candlesticks",
    name: "Japanese candlesticks",
    category: "process",
    summary: "A chart where each period is drawn as a body (open to close) and wicks (high and low): a picture of the battle between buyers and sellers.",
    detail:
      "Candlestick analysis grew out of Japanese rice trading: the Dojima rice exchange in Osaka traded rice futures from the 1700s. Steve Nison's articles in the late 1980s and his 1991 book Japanese Candlestick Charting Techniques introduced the method to Western traders. Read a candle as who won (the body), who was rejected (the wicks) and whether nobody won (a small body: indecision). Practice it in the Japanese candlesticks lesson. Educational, not advice.",
  },
  {
    id: "heikin-ashi",
    name: "Heikin-Ashi candles",
    category: "process",
    summary: "Averaged candles (\"average pace\") that smooth price so trends and possible turns are easier to see.",
    detail:
      "HA close = (open + high + low + close) ÷ 4; HA open = (previous HA open + previous HA close) ÷ 2; HA high and low also include the HA open and close. Long runs of green HA candles with no lower wick mark a strong advance; red with no upper wick a strong decline; small bodies with wicks on both sides a possible turn. HA prices are not traded prices and HA lags, so set entries and stops from the regular candles. Practice it in the Heikin-Ashi lab (SIMULATED). Educational, not advice.",
  },
];
