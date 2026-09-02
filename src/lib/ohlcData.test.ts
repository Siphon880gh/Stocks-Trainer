import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { chartVerticalScale } from "./ohlcData.ts";

describe("chartVerticalScale", () => {
  it("keeps the base pane height at 1×", () => {
    assert.deepEqual(chartVerticalScale(320, 1), {
      paneHeight: 320,
      domainZoom: 1,
    });
  });

  it("grows pane height when scaling up so the full range still fits", () => {
    assert.deepEqual(chartVerticalScale(320, 2), {
      paneHeight: 640,
      domainZoom: 1,
    });
    assert.deepEqual(chartVerticalScale(320, 4), {
      paneHeight: 1280,
      domainZoom: 1,
    });
  });

  it("keeps pane height and widens the domain when scaling down", () => {
    assert.deepEqual(chartVerticalScale(320, 0.5), {
      paneHeight: 320,
      domainZoom: 0.5,
    });
  });
});
