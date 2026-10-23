import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { CHART_BOOK, CHART_BOOK_OHLC, CHART_BOOK_QUESTIONS, CHART_BOOK_TERMS, CHART_BOOK_DRILL_SPECS } from "./chartPatternBook.ts";
import type { OHLC } from "./ohlcData.ts";

const max = (a: number[]) => Math.max(...a);
const min = (a: number[]) => Math.min(...a);
const avg = (a: number[]) => a.reduce((s, x) => s + x, 0) / a.length;
const near = (a: number[], tol: number) => (max(a) - min(a)) / min(a) <= tol;
const rising = (a: number[]) => a.every((x, i) => i === 0 || x > a[i - 1]);
const falling = (a: number[]) => a.every((x, i) => i === 0 || x < a[i - 1]);

type Rule = (b: OHLC[]) => void;
const H = (b: OHLC[], ...i: number[]) => i.map((k) => b[k].high);
const L = (b: OHLC[], ...i: number[]) => i.map((k) => b[k].low);
const C = (b: OHLC[], ...i: number[]) => i.map((k) => b[k].close);
const V = (b: OHLC[], ...i: number[]) => i.map((k) => b[k].volume ?? 0);
const span = (from: number, to: number) => Array.from({ length: to - from + 1 }, (_, k) => from + k);

/** Textbook rule for each pattern, checked on its SIMULATED bars (StockCharts ChartSchool, Bulkowski, Nison, Brooks). */
const RULES: Record<string, Rule> = {
  "rising-window": (b) => {
    assert.ok(b[7].low > b[6].high, "gap up");
    assert.ok(b[6].close > b[0].close, "uptrend before");
    assert.ok(min(C(b, ...span(8, b.length - 1))) > b[6].high, "closes hold above the window");
  },
  "falling-window": (b) => {
    assert.ok(b[7].high < b[6].low, "gap down");
    assert.ok(b[6].close < b[0].close, "downtrend before");
    assert.ok(max(C(b, ...span(8, b.length - 1))) < b[6].low, "closes stay below the window");
  },
  "breakaway-gap": (b) => {
    const range = span(0, 14);
    assert.ok(near([max(H(b, ...range)), min(L(b, ...range))], 0.05), "a range first");
    assert.ok(b[15].low > max(H(b, ...range)), "gaps clear of the range");
    assert.ok(b[15].volume! >= 2 * avg(V(b, ...range)), "volume jumps");
  },
  "runaway-gap": (b) => {
    assert.ok(b[10].close > b[0].close * 1.05, "trend under way");
    assert.ok(b[11].low > b[10].high, "gap in trend direction");
    assert.ok(min(L(b, ...span(12, b.length - 1))) > b[10].high, "gap stays open");
  },
  "exhaustion-gap": (b) => {
    assert.ok(b[16].close > b[0].close * 1.15, "mature uptrend");
    assert.ok(b[17].low > b[16].high, "gap up");
    assert.equal(max(V(b, ...span(0, b.length - 1))), b[17].volume, "heaviest volume on the gap");
    assert.ok(b[19].close < b[16].high, "gap filled");
  },
  "island-top": (b) => {
    assert.ok(b[11].low > b[10].high && b[15].high < b[14].low, "gap up then gap down");
    assert.ok(min(L(b, ...span(11, 14))) > max([b[10].high, b[15].high]), "island cut off");
    assert.ok(b[15].volume! > avg(V(b, ...span(0, 14))), "volume on the second gap");
  },
  "island-bottom": (b) => {
    assert.ok(b[11].high < b[10].low && b[15].low > b[14].high, "gap down then gap up");
    assert.ok(max(H(b, ...span(11, 14))) < min([b[10].low, b[15].low]), "island cut off");
    assert.ok(b[15].volume! > avg(V(b, ...span(0, 14))), "volume on the second gap");
  },
  "bear-flag": (b) => {
    assert.ok(b[0].close - b[6].close >= 100, "sharp pole down");
    assert.ok(rising(H(b, 8, 11, 14)), "flag slopes up");
    assert.ok(b[15].close < min(L(b, ...span(8, 14))), "closes below the flag");
    assert.ok(avg(V(b, ...span(7, 14))) < avg(V(b, ...span(0, 6))), "volume contracts in the flag");
  },
  "bull-pennant": (b) => {
    assert.ok(falling(H(b, 6, 10, 13)) && rising(L(b, 8, 12, 14)), "converging");
    assert.ok(b[15].close > max(H(b, ...span(7, 14))), "breaks out of the top");
    assert.ok(avg(V(b, ...span(7, 14))) < avg(V(b, ...span(0, 6))), "volume contracts");
  },
  "bear-pennant": (b) => {
    assert.ok(falling(H(b, 8, 12, 14)) && rising(L(b, 6, 10, 13)), "converging");
    assert.ok(b[15].close < min(L(b, ...span(7, 14))), "breaks out of the bottom");
  },
  "high-tight-flag": (b) => {
    assert.ok(b[12].close / b[0].close >= 1.9, "price about doubles (≥ 90%)");
    assert.ok((b[12].high - min(L(b, ...span(13, 20)))) / b[12].high <= 0.25, "shallow flag");
    assert.ok(b[21].close > max(H(b, ...span(0, 20))), "closes above the highest peak");
    assert.ok(avg(V(b, ...span(13, 20))) < avg(V(b, ...span(6, 12))), "volume recedes");
  },
  "ascending-triangle": (b) => {
    assert.ok(near(H(b, 4, 10, 16, 20), 0.006), "flat top");
    assert.ok(rising(L(b, 7, 13, 18)), "rising lows");
    assert.ok(b[21].close > max(H(b, ...span(0, 20))), "close above resistance");
    assert.ok(b[21].volume! > avg(V(b, ...span(14, 20))), "volume expands");
  },
  "descending-triangle": (b) => {
    assert.ok(near(L(b, 4, 10, 16, 20), 0.006), "flat bottom");
    assert.ok(falling(H(b, 7, 13, 18)), "falling highs");
    assert.ok(b[21].close < min(L(b, ...span(0, 20))), "close below support");
  },
  "bullish-rectangle": (b) => {
    assert.ok(b[5].close > b[0].close, "prior uptrend");
    assert.ok(near(H(b, 5, 11, 17), 0.01) && near(L(b, 8, 14, 20), 0.01), "parallel horizontal lines");
    assert.ok(b[23].close > max(H(b, ...span(5, 22))), "close above the top");
  },
  "bearish-rectangle": (b) => {
    assert.ok(b[5].close < b[0].close, "prior downtrend");
    assert.ok(near(H(b, 8, 14, 20), 0.01) && near(L(b, 5, 11, 17), 0.01), "parallel horizontal lines");
    assert.ok(b[23].close < min(L(b, ...span(5, 22))), "close below the bottom");
  },
  "ascending-channel": (b) => {
    const lows = C(b, 0, 8, 16, 24);
    const highs = C(b, 4, 12, 20);
    assert.ok(rising(lows) && rising(highs), "higher highs and higher lows");
    const step = lows.slice(1).map((x, i) => x - lows[i]);
    assert.ok(near(step, 0.01), "lower line is straight");
    assert.ok(near(highs.map((h, i) => h - lows[i]), 0.2), "parallel lines");
    assert.ok(b[25].close > b[24].close, "bounce off the lower line");
  },
  "descending-channel": (b) => {
    const highs = C(b, 0, 8, 16, 24);
    const lows = C(b, 4, 12, 20);
    assert.ok(falling(highs) && falling(lows), "lower highs and lower lows");
    assert.ok(b[25].close < b[24].close, "rejection at the upper line");
  },
  "rounding-bottom": (b) => {
    const lows = L(b, ...span(0, 31));
    const k = lows.indexOf(min(lows));
    assert.ok(k > 10 && k < 21, "low in the middle third");
    assert.ok(b[32].close > max(H(b, ...span(0, 31))), "close above the reaction high");
    assert.ok(b[16].volume! < b[1].volume! && b[32].volume! > b[16].volume!, "volume tracks the bowl");
  },
  "rounding-top": (b) => {
    const highs = H(b, ...span(3, 34));
    const k = highs.indexOf(max(highs)) + 3;
    assert.ok(k > 12 && k < 24, "high in the middle");
    assert.ok(near(C(b, 3, 34), 0.01), "rims near the same price");
    assert.ok(b[35].close < min(L(b, ...span(3, 34))), "close below the lower rim");
  },
  "cup-and-handle": (b) => {
    const advance = b[6].high - b[0].low;
    const cupLow = min(L(b, ...span(7, 24)));
    assert.ok((b[6].high - cupLow) / advance <= 0.35, "cup retraces about a third or less");
    const handleLow = min(L(b, ...span(25, 30)));
    assert.ok(handleLow > cupLow && (b[24].high - handleLow) / (b[24].high - cupLow) <= 0.5, "shallow handle");
    assert.ok(b[31].close > max(H(b, ...span(24, 30))), "close above handle resistance");
    assert.ok(b[31].volume! >= 2 * avg(V(b, ...span(25, 30))), "volume surge");
  },
  "inverse-cup-and-handle": (b) => {
    const top = max(H(b, ...span(7, 24)));
    const handleHigh = max(H(b, ...span(25, 30)));
    assert.ok(handleHigh < top, "handle stays below the cup top");
    const retrace = (handleHigh - b[24].low) / (top - b[24].low);
    assert.ok(retrace >= 0.25 && retrace <= 0.6, "handle retraces about 30-60%");
    assert.ok(b[31].close < b[24].low, "close below the right rim");
  },
  "broadening-top": (b) => {
    assert.ok(rising(H(b, 4, 10, 16)) && falling(L(b, 7, 13, 19)), "megaphone");
    assert.ok(b[21].close < b[19].low, "breaks down");
  },
  "broadening-bottom": (b) => {
    assert.ok(falling(L(b, 4, 10, 16)) && rising(H(b, 7, 13, 19)), "megaphone");
    assert.ok(b[21].close > b[19].high, "breaks up");
  },
  "diamond-top": (b) => {
    assert.ok(b[9].high > b[4].high && falling(H(b, 9, 15, 20)), "peaks widen then narrow");
    assert.ok(b[12].low < b[6].low && rising(L(b, 12, 18, 22)), "valleys widen then narrow");
    assert.ok(b[24].close < b[22].low, "breaks down");
  },
  "diamond-bottom": (b) => {
    assert.ok(b[9].low < b[4].low && rising(L(b, 9, 15, 20)), "valleys widen then narrow");
    assert.ok(b[12].high > b[6].high && falling(H(b, 12, 18, 22)), "peaks widen then narrow");
    assert.ok(b[24].close > b[22].high, "breaks up");
  },
  "v-bottom": (b) => {
    assert.equal(min(L(b, ...span(0, b.length - 1))), b[10].low, "single spike low");
    assert.ok(b[10].close < b[0].close * 0.9, "sharp decline");
    assert.ok(b[14].close > b[6].high, "close above the last minor high");
  },
  "selling-climax": (b) => {
    const c = b[13];
    assert.ok(c.volume! >= 3 * avg(V(b, ...span(3, 12))), "extreme volume");
    assert.ok(c.close - c.low > 0.5 * (c.high - c.low), "closes well off its low");
    assert.ok(b[16].close > c.high, "later close above the climax high");
  },
  "volume-dry-up": (b) => {
    assert.ok(avg(V(b, ...span(9, 14))) < 0.6 * avg(V(b, ...span(0, 8))), "pullback volume shrinks");
    assert.ok(b[16].close > max(H(b, ...span(9, 15))), "advance resumes");
    assert.ok(b[16].volume! > 2 * avg(V(b, ...span(9, 14))), "volume expands again");
  },
  "breakout-volume": (b) => {
    assert.ok(near(H(b, 3, 9, 15), 0.006), "resistance held");
    assert.ok(b[17].close > max(H(b, ...span(0, 16))), "close through resistance");
    assert.ok(b[17].volume! >= 2 * avg(V(b, ...span(7, 16))), "about twice the average volume");
  },
  "volume-divergence": (b) => {
    assert.ok(rising(H(b, 5, 12, 19)), "higher highs");
    assert.ok(falling(V(b, 5, 12, 19)), "falling volume on each high");
    assert.ok(b[22].close < b[14].low, "close below the last swing low");
  },
  "three-pushes": (b) => {
    assert.ok(rising(H(b, 4, 10, 16)), "three higher highs");
    const gains = [b[4].close - b[0].close, b[10].close - b[6].close, b[16].close - b[12].close];
    assert.ok(falling(gains), "each push gains less");
    assert.ok(b[20].close < b[19].low && b[20].close < b[12].low, "close below the reversal bar and the last pullback low");
  },
  "complex-head-shoulders": (b) => {
    const highs = H(b, ...span(0, 26));
    const head = max(highs);
    const k = highs.indexOf(head);
    const shoulders = H(b, 5, 9, 21, 25);
    assert.ok(k >= 14 && k <= 16, "the head is the highest peak, in the middle");
    assert.ok(shoulders.every((s) => s < head), "every shoulder below the head");
    assert.ok(near(shoulders, 0.01), "shoulders peak near the same price");
    assert.ok(near(L(b, 11, 19), 0.01), "near-horizontal neckline through the armpits");
    assert.ok(b[27].close < min(L(b, 11, 19)), "close below the neckline");
    assert.ok(avg(V(b, ...span(0, 15))) > avg(V(b, ...span(16, 26))), "volume heavier on the left");
  },
  "complex-inverse-head-shoulders": (b) => {
    const heads = L(b, 11, 15);
    const shoulders = L(b, 5, 21);
    assert.ok(min(L(b, ...span(0, 23))) === min(heads), "a head is the lowest trough");
    assert.ok(near(heads, 0.01), "twin heads bottom near the same price");
    assert.ok(shoulders.every((s) => s > max(heads)), "shoulders above the heads");
    assert.ok(near(shoulders, 0.01), "shoulders bottom near each other");
    assert.ok(b[24].close > max(H(b, 8, 18)), "close above the neckline");
    assert.ok(avg(V(b, ...span(0, 12))) > avg(V(b, ...span(13, 23))), "volume heavier on the left");
  },
  "low-tight-flag": (b) => {
    const gain = b[12].close / b[0].close - 1;
    assert.ok(gain >= 0.6 && gain < 0.9, "pole of 60–90%, short of doubling");
    const top = max(H(b, ...span(0, 24)));
    assert.ok((top - min(L(b, ...span(13, 24)))) / top <= 0.15, "pause no more than 15% deep");
    assert.ok(b[25].close > top, "close above the pivot (highest high)");
    assert.ok(avg(V(b, ...span(13, 24))) < avg(V(b, ...span(6, 12))), "volume quiet in the pause");
    assert.ok(b[25].volume! > avg(V(b, ...span(13, 24))), "volume picks up on the breakout");
  },
};

describe("chart pattern book", () => {
  it("every pattern has a textbook rule check that passes on its SIMULATED chart", () => {
    assert.deepEqual(CHART_BOOK.filter((p) => !RULES[p.id]).map((p) => p.id), []);
    const failures: string[] = [];
    for (const p of CHART_BOOK) {
      try {
        RULES[p.id](CHART_BOOK_OHLC[p.id]);
      } catch (e) {
        failures.push(`${p.id}: ${(e as Error).message}`);
      }
    }
    assert.deepEqual(failures, []);
  });

  it("bars are valid OHLC with volume; mark and end are inside the chart", () => {
    for (const p of CHART_BOOK) {
      const b = CHART_BOOK_OHLC[p.id];
      for (const x of b) {
        assert.ok(x.high >= Math.max(x.open, x.close) && x.low <= Math.min(x.open, x.close), `${p.id} bar ${x.name}`);
        assert.ok((x.volume ?? 0) > 0, `${p.id} volume`);
      }
      assert.ok(p.mark <= p.end && p.end < b.length, `${p.id} mark/end`);
      assert.equal(p.recognise.length, 3, p.id);
      assert.ok(p.psychology.length >= 3, p.id);
      for (const k of [...p.lookalikes, ...p.confusers]) assert.ok(CHART_BOOK_OHLC[k] && k !== p.id, `${p.id} -> ${k}`);
    }
  });

  it("the completing bar closes beyond the prior bar in the pattern's direction", () => {
    for (const p of CHART_BOOK) {
      const b = CHART_BOOK_OHLC[p.id];
      if (p.dir === "up") assert.ok(b[p.end].close > b[p.end - 1].high, p.id);
      else assert.ok(b[p.end].close < b[p.end - 1].low, p.id);
    }
  });

  it("five questions per pattern: identify, psychology, confirmation, stop/target and a lookalike", () => {
    assert.equal(CHART_BOOK_QUESTIONS.length, CHART_BOOK.length * 5);
    const ids = new Set(CHART_BOOK_QUESTIONS.map((q) => q.id));
    assert.equal(ids.size, CHART_BOOK_QUESTIONS.length);
    for (const p of CHART_BOOK) {
      const kinds = CHART_BOOK_QUESTIONS.filter((q) => q.id.startsWith(`CP-${p.id}-`)).map((q) => q.id.split("-").pop());
      assert.deepEqual(kinds.sort(), (p.group === "volume" ? ["CONF", "LOOK", "NAME", "PLAN", "PSY"] : ["CONF", "NAME", "PICK", "PLAN", "PSY"]), p.id);
    }
    const letters = new Set<string>();
    for (const q of CHART_BOOK_QUESTIONS) {
      assert.ok(q.options.some((o) => o.id === q.correctAnswer), q.id);
      assert.equal(new Set(q.options.map((o) => o.label)).size, q.options.length, `${q.id} duplicate options`);
      letters.add(q.correctAnswer);
    }
    assert.ok(letters.size >= 3, "answer letters vary");
  });

  it("glossary terms and drill specs cover the table", () => {
    const t = new Set(CHART_BOOK_TERMS.map((x) => x.id));
    for (const p of CHART_BOOK) assert.ok(t.has(p.id), p.id);
    assert.equal(CHART_BOOK_DRILL_SPECS.length, CHART_BOOK.filter((p) => p.sentiment !== "neutral").length);
  });
});
