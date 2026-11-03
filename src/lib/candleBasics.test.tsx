import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { MemoryRouter } from "react-router-dom";
import { CANDLE_LESSONS, matchIsCorrect } from "./candleBasics.ts";
import { conceptQuizGroups, patternQuizGroups } from "./quizKinds.ts";
import { QUIZ_GROUPS } from "./quizData.ts";
import CandleBasics from "../pages/practice/CandleBasics.tsx";
import { renderHtml } from "./macro/renderHarness.ts";

describe("candlestick basics", () => {
  it("gives every lesson a real high and low around its open and close", () => {
    assert.ok(CANDLE_LESSONS.length >= 8);
    for (const lesson of CANDLE_LESSONS) {
      assert.ok(lesson.high >= Math.max(lesson.open, lesson.close), lesson.id);
      assert.ok(lesson.low <= Math.min(lesson.open, lesson.close), lesson.id);
      assert.ok(lesson.high > lesson.low, lesson.id);
      assert.equal(matchIsCorrect(lesson.id, lesson.id), true);
      assert.equal(matchIsCorrect(lesson.id, "nope"), false);
    }
  });

  it("opens on the first variation, with dots and chevrons through to the match check", () => {
    const html = renderHtml(
      <MemoryRouter>
        <CandleBasics />
      </MemoryRouter>,
    );
    assert.match(html, /data-lesson="green"/);
    assert.match(html, /Close above the open/);
    assert.match(html, /aria-label="Previous variation"/);
    assert.match(html, /aria-label="Next variation"/);
    assert.match(html, /aria-label="Match them"/);
    assert.equal(html.match(/role="tab"/g)?.length, CANDLE_LESSONS.length + 1);
  });

  it("splits concept checks from pattern names without dropping a group", () => {
    const concepts = conceptQuizGroups();
    const patterns = patternQuizGroups();
    assert.equal(concepts.length + patterns.length, QUIZ_GROUPS.length);
    assert.ok(concepts.some((g) => g.id === "candle-anatomy"));
    assert.ok(concepts.some((g) => g.id === "equity-literacy"));
    assert.ok(patterns.some((g) => g.id === "hammer"));
    assert.ok(patterns.some((g) => g.id === "doji"));
    assert.ok(!patterns.some((g) => g.id === "indicators"));
  });
});
