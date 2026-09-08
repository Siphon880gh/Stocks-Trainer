import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { youtubeSearchQuery, youtubeSearchUrl } from "./youtubeSearch.ts";
import { navigatorYoutubeTutorialTitle } from "./marketNavigator.ts";

describe("youtubeSearchQuery", () => {
  it("prefixes the resource title with stocks", () => {
    assert.equal(youtubeSearchQuery("three white soldiers"), "stocks three white soldiers");
  });

  it("keeps the displayed title casing", () => {
    assert.equal(youtubeSearchQuery("Three White Soldiers"), "stocks Three White Soldiers");
  });

  it("collapses extra whitespace", () => {
    assert.equal(youtubeSearchQuery("  Gap   and go  "), "stocks Gap and go");
  });

  it("leaves out sample tokens", () => {
    assert.equal(youtubeSearchQuery("Mega-Cap Tech (SAMPLE)"), "stocks Mega-Cap Tech");
    assert.equal(youtubeSearchQuery("Beat vs miss on a SAMPLE report"), "stocks Beat vs miss on a report");
    assert.equal(youtubeSearchQuery("Options context (SAMPLE)"), "stocks Options context");
  });

  it("uses only stocks when the title is empty", () => {
    assert.equal(youtubeSearchQuery("   "), "stocks");
  });
});

describe("youtubeSearchUrl", () => {
  it("builds a YouTube results URL from the prefixed query", () => {
    assert.equal(
      youtubeSearchUrl("three white soldiers"),
      "https://www.youtube.com/results?search_query=stocks%20three%20white%20soldiers",
    );
  });
});

describe("navigatorYoutubeTutorialTitle", () => {
  it("builds equities tutorial for the equity class", () => {
    assert.equal(navigatorYoutubeTutorialTitle("equity"), "equities tutorial");
    assert.equal(youtubeSearchQuery(navigatorYoutubeTutorialTitle("equity")), "stocks equities tutorial");
  });

  it("builds lowercase market-type tutorial strings", () => {
    assert.equal(youtubeSearchQuery(navigatorYoutubeTutorialTitle("future")), "stocks futures tutorial");
    assert.equal(youtubeSearchQuery(navigatorYoutubeTutorialTitle("forex")), "stocks forex tutorial");
    assert.equal(youtubeSearchQuery(navigatorYoutubeTutorialTitle("crypto")), "stocks crypto tutorial");
    assert.equal(
      youtubeSearchQuery(navigatorYoutubeTutorialTitle("option_context")),
      "stocks options context tutorial",
    );
  });
});
