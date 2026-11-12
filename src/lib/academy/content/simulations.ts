/**
 * Academy unit simulations: SAMPLE tapes opened from underlined phrases in a card's lead paragraph
 * (`LessonCard.leadRich`, built with `cardWithSims`). Same shapes and checks as Tool Training (`simSetProblems`).
 * Every price here is SAMPLE or simulated. Educational, not advice.
 */
import { simBar, toolTextPlain } from "../../toolTraining/simWalk";
import type { ToolSimulation, ToolText } from "../../toolTraining/types";

/** `...cardWithSims([...])` sets the card's plain `body` and its `leadRich` runs from one source. */
export function cardWithSims(rich: ToolText): { body: string; leadRich: ToolText } {
  return { body: toolTextPlain(rich), leadRich: rich };
}

const VOLUME: ToolSimulation = {
  kind: "bars",
  id: "ac-volume-breakout",
  title: "Two breakouts: light volume, then heavy",
  goal: "Walk a SAMPLE stock through two tries at the same resistance level to see why the volume behind a breakout says more than the break itself.",
  tape: "SAMPLE stock · daily bars · simulated volume shown as a multiple of average",
  start: 2,
  bars: [
    simBar("Day 1", [48.2, 49.6, 48.0, 49.4], "The stock rallies toward 50 on average volume.", "Note the level before price reaches it. Resistance at 50 is where sellers have stopped rallies before.", { readout: "Vol 1.0× avg" }),
    simBar("Day 2", [49.4, 50.0, 48.9, 49.2], "It touches 50 and closes back below. Sellers are still there.", "A rejection at a known level confirms it matters. The next attempt is the one to judge carefully.", { mark: "high", readout: "Vol 0.9× avg" }),
    simBar("Day 3", [49.2, 50.4, 49.0, 50.3], "A close above 50, but on only 0.8 times average volume.", "Few shares changed hands, so few traders backed the move. Light-volume breakouts fail more often.", { readout: "Vol 0.8× avg" }),
    simBar("Day 4", [50.3, 50.5, 49.1, 49.3], "The break fails: the stock falls back inside, below 50.", "A break that quickly returns inside the range is the warning the lesson describes. Volume had already hinted at it."),
    simBar("Day 5", [49.3, 49.9, 48.8, 49.7], "The stock rebuilds just under the level.", "Failed breakouts do not end the story. Price can try again; the question is whether participation changes."),
    simBar("Day 6", [49.7, 51.6, 49.6, 51.4], "A strong close at 51.40 on 2.4 times average volume.", "Broad participation means many buyers agreed at once. This break has the volume the first one lacked.", { mark: "signal", readout: "Vol 2.4× avg" }),
    simBar("Day 7", [51.4, 51.8, 50.4, 50.7], "A pullback that holds above 50 on lighter volume.", "Old resistance acting as support on a quiet pullback is the retest traders look for after a real break."),
    simBar("Day 8", [50.7, 52.3, 50.5, 52.1], "The stock pushes to a new high as volume picks up again.", "Volume rising with price and fading on pullbacks is what a supported move tends to look like."),
  ],
  takeaway: "Judge a breakout by the volume behind it; light-volume breaks fail more often than heavy ones.",
};

const STOP_GAP: ToolSimulation = {
  kind: "bars",
  id: "ac-stop-gap",
  title: "A sell stop when the stock gaps through it",
  goal: "Walk a SAMPLE position with a sell stop at 45 into a bad-news gap to see why a stop limits a loss but cannot cap it exactly.",
  tape: "SAMPLE stock · daily bars · simulated",
  start: 2,
  bars: [
    simBar("Day 1", [47.6, 48.4, 47.2, 48.0], "You buy 100 shares at 48 with a sell stop at 45. Planned risk: $300.", "The stop turns your plan into an order. The planned loss is the stop distance times the shares.", { readout: "Entry 48 · stop 45" }),
    simBar("Day 2", [48.0, 48.6, 47.1, 47.4], "The stock slips, still well above the stop.", "Normal wiggles should not reach a stop placed where the idea is proven wrong. This one has room."),
    simBar("Day 3", [47.4, 47.8, 46.0, 46.3], "Another down day closes at 46.30, a little above the stop.", "Nothing triggers while price stays above 45. The stop only acts when a trade prints at or below it."),
    simBar("Day 4", [41.0, 42.2, 40.6, 41.8], "Bad news overnight: the stock opens at 41. The stop triggers and fills near 41, not 45.", "A stop becomes a market order once triggered, and the first trade available is at 41. The loss is about $700, not $300.", { mark: "news", readout: "Filled ≈ 41.00" }),
    simBar("Day 5", [41.8, 43.0, 41.5, 42.6], "The stock bounces a little after the gap.", "A bounce after you are out is common and does not make the stop wrong. The stop did its job of ending the trade."),
    simBar("Day 6", [42.6, 43.1, 41.9, 42.2], "Trading settles well below the old stop level.", "Gap risk is why position size matters: size so that even a worse-than-planned fill is a loss you can take."),
  ],
  takeaway: "A gap can jump over a stop; it fills at the next available price, so size for the gap, not only the stop.",
};

const TRAILING: ToolSimulation = {
  kind: "bars",
  id: "ac-trailing",
  title: "A $3 trailing stop, bar by bar",
  goal: "Step through the card's example on a SAMPLE tape: bought at 50 with a $3 trail, watch the stop ratchet up with new highs, stay put on dips, and finally trigger.",
  tape: "SAMPLE stock · daily bars · simulated",
  start: 2,
  bars: [
    simBar("Day 1", [49.5, 50.0, 49.2, 49.8], "Bought at 50. The highest price so far is 50, so the stop starts at 47.", "A trailing stop is measured from the highest price since you placed it, not from where you bought.", { readout: "High 50 · stop 47" }),
    simBar("Day 2", [49.8, 52.6, 49.7, 52.4], "A new high of 52.60 lifts the stop to 49.60.", "Each new high moves the stop up by the same amount. The trade is now nearly risk-free against the entry.", { readout: "High 52.6 · stop 49.6" }),
    simBar("Day 3", [52.4, 53.0, 51.0, 51.4], "A high of 53 lifts the stop to 50; then the price dips to 51.40. The stop stays at 50.", "The stop never moves down. A dip that stays above it changes nothing, which is the whole point of the order.", { readout: "High 53 · stop 50" }),
    simBar("Day 4", [51.4, 55.6, 51.3, 55.4], "A strong day to 55.60 raises the stop to 52.60.", "Following price lets you stay in a trend without picking a target, while the locked-in floor keeps rising.", { readout: "High 55.6 · stop 52.6" }),
    simBar("Day 5", [55.4, 58.0, 55.3, 57.6], "The stock peaks at 58, so the stop rises to 55.", "The stop is now five dollars above the entry. Most of the gain is protected if the move reverses.", { mark: "high", readout: "High 58 · stop 55" }),
    simBar("Day 6", [57.6, 57.9, 54.0, 54.3], "The stock drops to 54. It trades through 55, the stop triggers and you sell near 55.", "You keep most of the move from 50 to 58. A $3 trail gave back $3 from the high, as designed; a gap could give back more.", { readout: "Stop 55 hit · sold ≈ 55" }),
  ],
  takeaway: "A trailing stop ratchets up with new highs, never down, and triggers once price falls the trail distance from the high.",
};

const EARNINGS_GAP: ToolSimulation = {
  kind: "bars",
  id: "ac-earnings-gap",
  title: "An earnings gap that holds",
  goal: "Walk a SAMPLE stock through an earnings gap and the days after it to see how holding above the prior close tells you whether buyers believe the news.",
  tape: "SAMPLE stock · daily bars · simulated",
  start: 2,
  bars: [
    simBar("Day 1", [60.0, 60.8, 59.5, 60.4], "A quiet day ahead of the report.", "Note the pre-report range. It is the zone the stock would fall back into if the gap fails."),
    simBar("Day 2", [60.4, 61.0, 60.0, 60.6], "The company reports after the close. The prior close is 60.60.", "The prior close is the line to watch: a gap that falls back to it has filled; one that stays above it has held.", { readout: "Earnings after close" }),
    simBar("Day 3", [66.0, 67.2, 65.1, 66.8], "The stock opens at 66, about 8.9% above the prior close, and closes near the high.", "The open shows the first verdict on the report; the close shows whether buyers kept paying through the session.", { mark: "earnings", readout: "Gap +8.9%" }),
    simBar("Day 4", [66.8, 67.0, 64.9, 65.4], "A pullback, but the low of 64.90 stays far above 60.60.", "Some early buyers take profits. What matters is that sellers cannot push it back into the gap."),
    simBar("Day 5", [65.4, 66.6, 65.0, 66.3], "Buyers step in near the gap-day low.", "The gap-day range now acts like a level. Holding it on day three says the news is being believed."),
    simBar("Day 6", [66.3, 68.1, 66.0, 67.8], "A new high above the gap day.", "A move in the same direction days later is what post-earnings drift looks like. It is a tendency, not a rule."),
    simBar("Day 7", [67.8, 68.6, 67.2, 68.3], "The stock holds near its highs a week after the report.", "Had it fallen back to 60.60 instead, that would be a gap fill: a sign the market doubted the news."),
  ],
  takeaway: "Whether an earnings gap holds above the prior close over the next days is the market's vote on the news.",
};

/** Simulations per Academy unit id; each unit's card lead carries the underlined trigger. */
export const UNIT_SIMS: Record<string, ToolSimulation[]> = {
  "l2-volume-confirms": [VOLUME],
  "l3-stop-orders": [STOP_GAP],
  "l3-trailing-stop": [TRAILING],
  "l4-earnings-reactions": [EARNINGS_GAP],
};
