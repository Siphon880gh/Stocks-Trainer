/**
 * Candle basics in the Academy (L2) and the Candlestick Basics lab: red/green as a record (not a sale or an order),
 * which end of the body is the open, wicks (high/low, long vs short, shaven), support and resistance from wicks,
 * volume behind a candle, and the doji. Content checks plus render checks.
 */
import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import UnitPlayer from "../components/academy/UnitPlayer.tsx";
import CandleBasics from "../pages/practice/CandleBasics.tsx";
import { renderHtml } from "./macro/renderHarness.ts";
import { getUnit, UNITS } from "./academy/content/levels.ts";
import { quizForUnit } from "./academy/content/unitQuizzes.ts";
import { UNIT_SIMS } from "./academy/content/simulations.ts";
import { resolveRef } from "./academy/refs.ts";
import { CANDLE_LESSONS } from "./candleBasics.ts";
import { getLiteracyTerm } from "./literacyTerms.ts";
import { simSetProblems, toolTextPlain, toolTextRefs, toolTextTerms } from "./toolTraining/simWalk.ts";

const text = (id: string) => getUnit(id)!.cards.map((c) => `${c.title} ${c.body}`).join(" ").toLowerCase();

describe("candle basics coverage in the L2 units", () => {
  it("each point is taught on a card", () => {
    const read = text("l2-reading-a-candle");
    for (const s of ["not a sale", "neither is an instruction", "bottom of the body is the open", "top of the body is the open", "upper wick is the high", "lower wick is the low", "sellers had the upper hand", "buyers did", "colours are also just a setting", "red for up"]) assert.ok(read.includes(s), `reading-a-candle: ${s}`);
    const wicks = text("l2-wicks-and-bodies");
    for (const s of ["long upper wick", "long lower wick", "shaven candle", "marubozu", "no wicks at all", "volatile", "short wicks mean price moved steadily", "doji", "wait for the next close"]) assert.ok(wicks.includes(s), `wicks-and-bodies: ${s}`);
    const sr = text("l2-support-resistance");
    for (const s of ["upper wicks", "lower wicks", "ceiling", "floor", "the close is what counts"]) assert.ok(sr.includes(s), `support-resistance: ${s}`);
    const vol = text("l2-volume-confirms");
    for (const s of ["heavy volume", "light volume", "recent average", "strong rejection"]) assert.ok(vol.includes(s), `volume-confirms: ${s}`);
  });

  it("every rich card lead reads exactly like its plain lead, and every marked term exists", () => {
    for (const u of UNITS) for (const c of u.cards) {
      if (!c.leadRich) continue;
      assert.equal(toolTextPlain(c.leadRich), c.body.split(/\n\n+/)[0], `${u.id} / ${c.title}`);
      for (const t of toolTextTerms(c.leadRich)) assert.ok(getLiteracyTerm(t.term), `${u.id}: term ${t.term}`);
    }
    const marked = new Set(["l2-reading-a-candle", "l2-wicks-and-bodies", "l2-support-resistance", "l2-volume-confirms"].flatMap((id) => getUnit(id)!.cards.flatMap((c) => (c.leadRich ? toolTextTerms(c.leadRich).map((t) => t.term) : []))));
    for (const id of ["upper-wick", "lower-wick", "shaven-candle", "marubozu-types", "doji", "wick-length", "wick-rejection", "candle-color"]) assert.ok(marked.has(id), `hover term ${id}`);
  });

  it("new glossary terms say educational, and the colour term notes settings and inverted markets", () => {
    for (const id of ["upper-wick", "lower-wick", "shaven-candle", "doji", "wick-length", "candle-color-settings"]) {
      const t = getLiteracyTerm(id)!;
      assert.ok(t, id);
      assert.match(t.detail, /Educational, not advice\./, id);
    }
    assert.match(getLiteracyTerm("candle-color-settings")!.detail, /red for a rising period/);
  });

  it("quizzes grew to 5 questions per candle unit and cite the new cards", () => {
    for (const id of ["l2-reading-a-candle", "l2-wicks-and-bodies", "l2-support-resistance", "l2-volume-confirms"]) assert.equal(quizForUnit(id).length, 5, id);
    const all = ["l2-reading-a-candle", "l2-wicks-and-bodies", "l2-support-resistance", "l2-volume-confirms"].flatMap(quizForUnit).map((q) => q.prompt).join(" ");
    for (const s of ["is red", "no upper wick and no lower wick", "pokes above resistance", "three times average volume"]) assert.ok(all.includes(s), s);
  });

  it("cross-links between the candle, wick, level and volume units resolve with readable labels", () => {
    const refs = (id: string) => getUnit(id)!.refs.map(resolveRef);
    const has = (id: string, href: string) => refs(id).some((r) => r.ok && r.href === href && r.label.startsWith("Academy: "));
    assert.ok(has("l2-reading-a-candle", "/academy/l2-wicks-and-bodies"));
    assert.ok(has("l2-wicks-and-bodies", "/academy/l2-support-resistance"));
    assert.ok(has("l2-support-resistance", "/academy/l2-volume-confirms?sim=ac-volume-breakout"));
    assert.ok(has("l2-support-resistance", "/academy/l2-wicks-and-bodies"));
    assert.ok(has("l2-volume-confirms", "/academy/l2-support-resistance?sim=ac-wick-resistance"));
    assert.ok(refs("l2-reading-a-candle").some((r) => r.ok && r.href === "/practice/candle-basics"));
    assert.equal(resolveRef("route:/academy/l2-no-such-unit").ok, false, "a typo in a unit link fails");
  });
});

describe("candle simulations", () => {
  it("are well formed, SAMPLE, valid OHLC and each has a trigger", () => {
    for (const id of ["l2-wicks-and-bodies", "l2-support-resistance", "l2-volume-confirms"]) {
      const u = getUnit(id)!;
      const refs = u.cards.flatMap((c) => (c.leadRich ? toolTextRefs(c.leadRich) : []));
      assert.deepEqual(simSetProblems(id, refs, u.simulations ?? []), [], id);
    }
    const ids = Object.values(UNIT_SIMS).flat().map((s) => s.id);
    assert.equal(new Set(ids).size, ids.length);
  });

  it("the wick walk: three upper wicks stop near 48 and close below, then a close clears the zone", () => {
    const s = UNIT_SIMS["l2-support-resistance"]![0]!;
    assert.equal(s.id, "ac-wick-resistance");
    if (s.kind !== "bars") throw new Error("bars");
    const [d3, , d5, d6, d7, d8] = s.bars.slice(2);
    for (const b of [d3!, d5!, d6!]) {
      assert.ok(b.high >= 47.9 && b.high <= 48.2, `${b.label} high near 48`);
      assert.ok(b.close < 47.9, `${b.label} closed back below the zone`);
      assert.ok(b.high - Math.max(b.open, b.close) >= 0.7, `${b.label} has a long upper wick`);
    }
    assert.ok(d7!.close > 48.1 && /2\.1× avg/.test(d7!.readout ?? ""));
    assert.ok(d8!.low <= 48.1 && d8!.close > 48.1, "the retest holds above the old ceiling");
  });

  it("the doji walk: a near-equal open and close after a run, then the next close beyond its low", () => {
    const s = UNIT_SIMS["l2-wicks-and-bodies"]![0]!;
    assert.equal(s.id, "ac-doji-after-run");
    if (s.kind !== "bars") throw new Error("bars");
    const doji = s.bars[3]!;
    const range = doji.high - doji.low;
    assert.ok(Math.abs(doji.close - doji.open) <= range * 0.05, "body is under 5% of the range");
    assert.ok(s.bars.slice(0, 3).every((b) => b.close > b.open), "three green days before it");
    assert.ok(s.bars[4]!.close < doji.low, "the next close answers below the doji's low");
  });
});

describe("renders", () => {
  it("a term-only card shows hover terms and no simulation hint; a card with a walk shows both", () => {
    const u = getUnit("l2-reading-a-candle")!;
    const idx = u.cards.findIndex((c) => c.title === "Which end is the open");
    const html = renderHtml(<MemoryRouter><UnitPlayer unit={u} initialCard={idx} /></MemoryRouter>);
    assert.match(html, /data-glossary-term="upper-wick"/);
    assert.match(html, /data-glossary-term="lower-wick"/);
    assert.doesNotMatch(html, /data-testid="sim-hint"/);
    const w = getUnit("l2-wicks-and-bodies")!;
    const wi = w.cards.findIndex((c) => c.title === "Small bodies show indecision");
    const wh = renderHtml(<MemoryRouter><UnitPlayer unit={w} initialCard={wi} /></MemoryRouter>);
    assert.match(wh, /data-sim-trigger="ac-doji-after-run"/);
    assert.match(wh, /data-glossary-term="doji"/);
    assert.match(wh, /data-testid="sim-hint"/);
  });

  it("the Candlestick Basics lab adds a shaven candle and a read-it-right panel linking the units", () => {
    const shaven = CANDLE_LESSONS.find((l) => l.id === "shaven")!;
    assert.ok(shaven.open === shaven.low && shaven.close === shaven.high);
    const html = renderHtml(<MemoryRouter><CandleBasics /></MemoryRouter>);
    assert.match(html, /data-testid="candle-basics-notes"/);
    assert.match(html, /Neither is a sale, a bargain or an instruction/);
    assert.match(html, /red for up/);
    for (const id of ["l2-reading-a-candle", "l2-wicks-and-bodies", "l2-support-resistance", "l2-volume-confirms"]) assert.ok(html.includes(`href="/academy/${id}"`), id);
  });
});
