import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { splitEarningsJargon } from "./earningsJargon.ts";

function ids(text: string): string[] {
  return splitEarningsJargon(text)
    .filter((p) => p.term)
    .map((p) => p.term!.id);
}

function joined(text: string): string {
  return splitEarningsJargon(text).map((p) => p.text).join("");
}

describe("earnings jargon phrases", () => {
  it("keeps the original wording", () => {
    const samples = [
      "rising into the print tonight",
      "Buy the rumor, sell the news.",
      "not priced in, then priced in",
      "Guide silhouette shown",
      "the print bar",
    ];
    for (const sample of samples) assert.equal(joined(sample), sample);
  });

  it("prefers the longer phrase", () => {
    assert.deepEqual(ids("rising into the print"), ["into-the-print"]);
    assert.deepEqual(ids("still before the print"), ["before-the-print"]);
    assert.deepEqual(ids("trading after the print"), ["after-the-print"]);
    assert.deepEqual(ids("Buy the rumor, sell the news"), ["buy-the-rumor"]);
    assert.deepEqual(ids("not priced in"), ["not-priced-in"]);
    assert.deepEqual(ids("not priced into the gap"), ["not-priced-in"]);
    assert.deepEqual(ids("the tape was weak into the number"), ["tape-strength"]);
    assert.deepEqual(ids("faded the print after a pop"), ["faded-the-print"]);
    assert.deepEqual(ids("ripped on the print"), ["ripped-on-the-print"]);
    assert.deepEqual(ids("got hit on the print"), ["got-hit"]);
  });

  it("skips chart bars and tutorial guides", () => {
    assert.deepEqual(ids("highlight the print bar"), []);
    assert.deepEqual(ids("Guide silhouette shown as dashed lines"), []);
    assert.deepEqual(ids("Day trading beginner guide"), []);
    assert.deepEqual(ids("public swing guide"), []);
  });

  it("marks earnings guide language and the tape", () => {
    assert.deepEqual(ids("In-line guide plus a modest beat."), ["guide"]);
    assert.deepEqual(ids("a guidance cut"), ["guide"]);
    assert.deepEqual(ids("management will guide-down"), ["guide-direction"]);
    assert.deepEqual(ids("Step the tape and wait"), ["the-tape"]);
    assert.deepEqual(ids("Compare the print to expectations"), ["the-print"]);
    assert.deepEqual(ids("Beat the Street on a whisper number"), ["beat-the-street", "whisper-number"]);
  });
});
