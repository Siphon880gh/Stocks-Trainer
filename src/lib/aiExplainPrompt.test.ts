import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildAiExplainPrompt,
  buildCaseExplanationMarkdown,
  ohlcMarkdownTable,
} from "./aiExplainPrompt.ts";
import { getCaseStudy } from "./caseStudies.ts";
import type { OHLC } from "./ohlcData.ts";

describe("ohlc markdown table", () => {
  it("omits an empty series", () => {
    assert.equal(ohlcMarkdownTable([]), "");
  });

  it("writes Time, High, Open, Close, Low", () => {
    const bars: OHLC[] = [
      { name: "T-5", open: 181, high: 181.6, low: 180.4, close: 181.2 },
      { name: "+1", open: 178, high: 178.5, low: 175.5, close: 176.2 },
    ];
    const md = ohlcMarkdownTable(bars);
    assert.match(md, /## SAMPLE chart/);
    assert.match(md, /\| Time \| High \| Open \| Close \| Low \|/);
    assert.match(md, /\| T-5 \| 181\.6 \| 181 \| 181\.2 \| 180\.4 \|/);
    assert.match(md, /\| \+1 \| 178\.5 \| 178 \| 176\.2 \| 175\.5 \|/);
  });
});

describe("case AI explain markdown", () => {
  it("fills title, brief, snapshot, chart, choice, and debrief", () => {
    const study = getCaseStudy("case-earn-margin-compression");
    assert.ok(study);
    const md = buildCaseExplanationMarkdown(study, "sell");
    assert.match(md, /^# Sales up, profit margin down/m);
    assert.match(md, /Sales are still growing/);
    assert.match(md, /## Practice snapshot · AAPL\.S/);
    assert.match(md, /Margin 14\.9%/);
    assert.match(md, /## SAMPLE chart/);
    assert.match(md, /\| Time \| High \| Open \| Close \| Low \|/);
    assert.match(md, /\| T-5 \| 181\.6 \| 181 \| 181\.2 \| 180\.4 \|/);
    assert.match(md, /\| \+1 \| 178\.5 \| 178 \| 176\.2 \| 175\.5 \|/);
    assert.match(md, /\*You chose: SELL\*/);
    assert.match(md, /- \*\*How to think about it:\*\* Growing sales is not enough/);
    assert.match(md, /- \*\*Why the price moved:\*\* Investors pay less/);
    assert.match(md, /- \*\*What the numbers showed:\*\* Revenue held up/);
  });

  it("includes a news headline when the case has one, plus the tape", () => {
    const study = getCaseStudy("case-news-chase-fade");
    assert.ok(study);
    const md = buildCaseExplanationMarkdown(study, "hold");
    assert.match(md, /\*\*Headline:\*\* Big tech announces a small product refresh/);
    assert.doesNotMatch(md, /Practice snapshot/);
    assert.match(md, /## SAMPLE chart/);
    assert.match(md, /\| T0 \|/);
    const prompt = buildAiExplainPrompt(md);
    assert.match(prompt, /Generate a TLDR, then ELI5/);
    assert.match(prompt, /Explanation here:/);
    assert.match(prompt, /Stock already ran, then a product headline/);
  });
});
