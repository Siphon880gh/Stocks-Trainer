import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  buildPlaybookCursorPrompt,
  classifySourceUrl,
  normalizeSourceUrl,
} from "./playbookPrompt.ts";

describe("classifySourceUrl", () => {
  it("treats YouTube hosts as youtube", () => {
    assert.equal(classifySourceUrl("https://www.youtube.com/watch?v=abc"), "youtube");
    assert.equal(classifySourceUrl("youtu.be/abc"), "youtube");
  });

  it("treats other http(s) hosts as webpage", () => {
    assert.equal(classifySourceUrl("https://medium.com/@x/some-strategy"), "webpage");
  });

  it("rejects empty and non-http URLs", () => {
    assert.equal(classifySourceUrl(""), "invalid");
    assert.equal(classifySourceUrl("not a url"), "invalid");
    assert.equal(classifySourceUrl("ftp://example.com/x"), "invalid");
  });
});

describe("normalizeSourceUrl", () => {
  it("adds https when the paste has no scheme", () => {
    assert.equal(normalizeSourceUrl("medium.com/p/1"), "https://medium.com/p/1");
  });
});

describe("buildPlaybookCursorPrompt", () => {
  it("asks Cursor to read a YouTube transcript and names existing pages", () => {
    const result = buildPlaybookCursorPrompt({
      url: "https://www.youtube.com/watch?v=abc",
      notes: "Looks like an opening-range break",
    });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.prompt, /video transcript/);
    assert.match(result.prompt, /stop and ask the human/);
    assert.match(result.prompt, /opening-range break/);
    assert.match(result.prompt, /src\/pages\/Playbook\.tsx/);
    assert.match(result.prompt, /src\/pages\/CoachSession\.tsx/);
    assert.match(result.prompt, /src\/pages\/CasePlayer\.tsx/);
    assert.match(result.prompt, /src\/components\/MarketChart\.tsx/);
    assert.match(result.prompt, /Do \*\*not\*\* explain or reinvent panel chrome/);
    assert.match(result.prompt, /linked \*\*near the top\*\*/);
    assert.match(result.prompt, /source\.label/);
    assert.doesNotMatch(result.prompt, /creatorUrl|creatorLabel/);
    assert.match(result.prompt, /not a YouTube channel/);
  });

  it("asks Cursor to read webpage content", () => {
    const result = buildPlaybookCursorPrompt({ url: "https://medium.com/@x/fade" });
    assert.equal(result.ok, true);
    if (!result.ok) return;
    assert.match(result.prompt, /Read the page content/);
    assert.doesNotMatch(result.prompt, /video transcript/);
  });

  it("returns a learner-facing error for a bad URL", () => {
    const result = buildPlaybookCursorPrompt({ url: "nope" });
    assert.deepEqual(result, { ok: false, error: "Need a full URL (https://…)" });
  });
});
