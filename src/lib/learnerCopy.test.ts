import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { withoutSampleWord } from "./learnerCopy.ts";

describe("withoutSampleWord", () => {
  it("drops the stamp and keeps the sentence", () => {
    assert.equal(withoutSampleWord("Mega-Cap Tech (SAMPLE)"), "Mega-Cap Tech");
    assert.equal(withoutSampleWord("SAMPLE · grind"), "Grind");
    assert.equal(
      withoutSampleWord("Open of this SAMPLE window — buyers hold the first close"),
      "Open of this window — buyers hold the first close",
    );
    assert.equal(
      withoutSampleWord(
        "Three peaks: the middle high is the head. SAMPLE read — wait for the next print.",
      ),
      "Three peaks: the middle high is the head. Wait for the next print.",
    );
    assert.equal(
      withoutSampleWord("SAMPLE / stylized teaching numbers — not live filings"),
      "Stylized teaching numbers — not live filings",
    );
    assert.equal(
      withoutSampleWord("Beat vs miss on a SAMPLE report"),
      "Beat vs miss on a report",
    );
    assert.equal(
      withoutSampleWord("Yes — context and shape both match. SAMPLE teaching."),
      "Yes — context and shape both match.",
    );
    assert.equal(withoutSampleWord("SAMPLE teaching of a setup traders repeat"), "A setup traders repeat");
    assert.equal(withoutSampleWord("Gold as a SAMPLE haven, not ES"), "Gold as a haven, not ES");
    assert.equal(withoutSampleWord("AAPL.S · SAMPLE"), "AAPL.S");
    assert.equal(withoutSampleWord("Already clean copy."), "Already clean copy.");
    assert.equal(withoutSampleWord(""), "");
    assert.equal(withoutSampleWord("Walk a SAMPLE equities headline"), "Walk an equities headline");
    assert.equal(withoutSampleWord("SAMPLE"), "");
  });
});
