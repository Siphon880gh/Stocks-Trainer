import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { describe, it } from "node:test";

const html = readFileSync(new URL("../../index.html", import.meta.url), "utf8");

describe("index.html", () => {
  it("declares an inline favicon so browsers do not request a missing /favicon.ico (console 404 on every first load)", () => {
    const m = html.match(/<link\s+rel="icon"\s+href="([^"]+)"/);
    assert.ok(m, "rel=icon link present");
    assert.match(m![1]!, /^data:image\/svg\+xml,/, "inline data URI works under any base path, including the mounted dist build");
    const svg = decodeURIComponent(m![1]!.slice("data:image/svg+xml,".length));
    assert.match(svg, /^<svg xmlns='http:\/\/www\.w3\.org\/2000\/svg'[^>]*>.*<\/svg>$/);
  });
});
