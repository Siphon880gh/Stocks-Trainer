import { Link } from "react-router-dom";
import PracticeShell from "../../components/PracticeShell";
import CorePatternList from "../../components/CorePatternList";
import { markMiscPracticeDone } from "../../lib/miscPractices";
import { useEffect } from "react";

const term = (id: string, text: string) => (
  <Link to={`/archive?tab=literacy&open=${id}`} className="text-primary underline">
    {text}
  </Link>
);

/** /practice/japanese-candles: what Japanese candlesticks are, reading the battle in one candle, and the core 14 patterns. */
export default function PracticeJapaneseCandles() {
  useEffect(() => markMiscPracticeDone("japanese-candles"), []);
  return (
    <PracticeShell
      title="Japanese candlesticks"
      blurb="Where candlesticks come from, how each candle records the battle between buyers and sellers, and the 14 core patterns. Illustrations are SIMULATED. Educational, not trading advice."
    >
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="candles-history">
        <p className="font-semibold text-[14px]">Where they come from</p>
        <p>
          Candlestick analysis grew out of Japanese rice trading. By the 1700s the Dojima rice exchange in Osaka traded rice coupons that worked like the first futures
          contracts, and traders there studied price and crowd psychology. The rice merchant Munehisa Homma is traditionally linked to those ideas; the candle drawings
          themselves took their familiar form later. Western traders mostly learned the method from Steve Nison&apos;s articles in the late 1980s and his 1991 book{" "}
          <em>Japanese Candlestick Charting Techniques</em>.
        </p>
      </section>
      <section className="panel p-4 space-y-2 text-[13px]" data-testid="candles-battle">
        <p className="font-semibold text-[14px]">Each candle is a battle between buyers and sellers</p>
        <p>
          A candle shows four prices for one period: open, high, low and close ({term("ohlc-anatomy", "candle anatomy")}). Read it as a fight that ended somewhere:
        </p>
        <ul className="list-disc pl-5 space-y-1">
          <li>
            <strong>The body shows who won.</strong> A long green body: buyers pushed from open to close and held it. A long red body: sellers did. ({term("full-body-candle", "full body")})
          </li>
          <li>
            <strong>The wicks show who was rejected.</strong> A long upper wick: buyers pushed higher and sellers threw them back. A long lower wick: sellers pushed lower and
            buyers threw them back. ({term("wick-rejection", "wick rejection")})
          </li>
          <li>
            <strong>A small body shows indecision.</strong> Both sides pushed and neither held the close: a doji or spinning top ({term("indecision-candle", "indecision")}). It
            matters most after a long move.
          </li>
          <li>
            <strong>Context decides the meaning.</strong> The same shape is read differently after a decline, after a rally or inside a range. A pattern is a probability, not a
            promise: wait for confirmation and know where you are wrong.
          </li>
        </ul>
        <p className="text-[12px]">
          Start with{" "}
          <Link to="/training?group=candle-reading&start=1" className="text-primary underline">
            Learn · Reading One Candle
          </Link>
          , then quiz the core 14 in{" "}
          <Link to="/training?group=japanese-candles&start=1" className="text-primary underline">
            Learn · Japanese Candlesticks: Core 14
          </Link>
          . See every pattern in the{" "}
          <Link to="/archive" className="text-primary underline">
            Archive
          </Link>
          , and smoothed candles in the{" "}
          <Link to="/practice/heikin-ashi" className="text-primary underline">
            Heikin-Ashi lab
          </Link>
          .
        </p>
      </section>
      <CorePatternList />
    </PracticeShell>
  );
}
