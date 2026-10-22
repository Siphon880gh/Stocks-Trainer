import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CLAIM_DRILL, CONTRAST_BOX, GENERIC_BREAKOUT_HABITS, HAS_WEAKENED, JUDGE_CHECKLIST, METHOD_BOX, REPORTED_BOX, RT_BANNER,
  RT_QUESTIONS, RT_SRC, RT_TERMS, STILL_SHOWS_UP, TRADER_CARDS,
} from "./recordTraders";

const isUrl = (u: unknown) => typeof u === "string" && /^https:\/\/[^\s]+\.[^\s]+/.test(u);

describe("record-setting traders: verification", () => {
  it("banner text is exact", () => {
    assert.equal(RT_BANNER, "This section includes only feats a neutral third party confirmed, with the verifier and source shown for each.");
  });

  it("every trader card has a neutral verifier and a source URL", () => {
    assert.ok(TRADER_CARDS.length >= 10);
    for (const c of TRADER_CARDS) {
      assert.ok(c.verifiedBy && c.verifiedBy.trim().length > 8, `${c.id}: missing verifiedBy`);
      assert.ok(c.source && c.source.label.trim(), `${c.id}: missing source label`);
      assert.ok(isUrl(c.source.url), `${c.id}: missing/invalid source URL`);
      for (const s of c.moreSources ?? []) assert.ok(isUrl(s.url), `${c.id}: bad extra source`);
      // the verifier is never the trader themself
      const surname = c.name.split(/[\s/&]+/).filter((w) => w.length > 3).pop()!;
      assert.ok(!c.verifiedBy.toLowerCase().startsWith(surname.toLowerCase()), `${c.id}: self-verified`);
      for (const k of ["feat", "period", "scope", "technique", "conditions", "drawdowns", "stillWorks"] as const) assert.ok(c[k].trim(), `${c.id}.${k}`);
    }
  });

  it("card ids are unique and cover the required traders", () => {
    const ids = TRADER_CARDS.map((c) => c.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const id of ["buffett", "minervini", "zanger", "larry-williams", "michelle-williams", "unger", "ryan", "schwartz", "ptj", "soros-druckenmiller"]) assert.ok(ids.includes(id), id);
  });

  it("unaudited or legend entries are kept off the verified cards", () => {
    const names = TRADER_CARDS.map((c) => c.name.toLowerCase()).join(" ");
    for (const n of ["simons", "medallion", "livermore", "o'neil"]) assert.ok(!names.includes(n), n);
    assert.match(REPORTED_BOX.title, /not publicly audited/);
    assert.ok(!("verifiedBy" in REPORTED_BOX));
    for (const b of [REPORTED_BOX, CONTRAST_BOX, METHOD_BOX]) assert.ok(b.sources.length > 0 && b.sources.every((s) => isUrl(s.url)), b.id);
  });

  it("the record figures match the sources", () => {
    const z = TRADER_CARDS.find((c) => c.id === "zanger")!;
    assert.match(z.feat, /29,223%/);
    assert.match(z.feat, /\$14,232,878/);
    assert.match(z.period, /June 1998 – May 1999/);
    assert.match(z.technique, /20–35%/);
    assert.match(z.technique, /2:1 margin/);
    assert.match(z.technique, /same day/);
    const all = JSON.stringify(z);
    assert.ok(!/two years/i.test(all));
    assert.ok(!/10\/21\/50|10-, 21-|2×|3–5%/.test(all), "generic habits must not be attributed");
    assert.match(TRADER_CARDS.find((c) => c.id === "buffett")!.feat, /19\.7%.*10\.5%/);
    assert.match(TRADER_CARDS.find((c) => c.id === "minervini")!.feat, /334\.8%/);
    assert.match(TRADER_CARDS.find((c) => c.id === "larry-williams")!.feat, /11,376%/);
    assert.match(TRADER_CARDS.find((c) => c.id === "ptj")!.feat, /125\.9%/);
    assert.ok(GENERIC_BREAKOUT_HABITS.length >= 3);
  });

  it("evidence and checklist entries all carry sources", () => {
    assert.ok(STILL_SHOWS_UP.length >= 3 && HAS_WEAKENED.length >= 5);
    for (const e of [...STILL_SHOWS_UP, ...HAS_WEAKENED]) assert.ok(e.sources.length && e.sources.every((s) => isUrl(s.url)), e.text);
    assert.ok(HAS_WEAKENED.some((e) => /58%/.test(e.text)));
    assert.ok(HAS_WEAKENED.some((e) => /64\.6%.*19\.1%/.test(e.text)));
    assert.equal(JUDGE_CHECKLIST.length, 10);
    for (const c of JUDGE_CHECKLIST) assert.ok(c.sources.length && c.sources.every((s) => isUrl(s.url)), c.id);
    for (const s of Object.values(RT_SRC)) assert.ok(isUrl(s.url), s.label);
  });

  it("drill claims are labelled SIMULATED and include both answers", () => {
    assert.ok(CLAIM_DRILL.every((c) => c.claim.startsWith("SIMULATED")));
    assert.ok(CLAIM_DRILL.some((c) => c.answer === "strong") && CLAIM_DRILL.some((c) => c.answer === "weak"));
  });

  it("quiz has 16 well-formed questions and unique term ids", () => {
    assert.equal(RT_QUESTIONS.length, 16);
    assert.equal(new Set(RT_QUESTIONS.map((q) => q.id)).size, 16);
    for (const q of RT_QUESTIONS) {
      assert.equal(q.options.length, 4);
      assert.ok(q.options.some((o) => o.id === q.correctAnswer));
    }
    assert.equal(new Set(RT_TERMS.map((t) => t.id)).size, RT_TERMS.length);
  });
});
