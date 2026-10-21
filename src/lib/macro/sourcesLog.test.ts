import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { MACRO_SOURCES } from "./sources";
import { manuallyVerified, parseVerificationLog } from "./sourcesLog";

const md = readFileSync(new URL("../../../docs/projects/macro-forces/SOURCES.md", import.meta.url), "utf8");

test("every bot-blocked source has a dated manual verification row", () => {
  const rows = parseVerificationLog(md);
  assert.ok(rows.length >= 1);
  for (const s of MACRO_SOURCES.filter((x) => x.botBlocked)) {
    assert.ok(manuallyVerified(s, rows), `no verification row for ${s.id}`);
  }
});

test("a source missing from the log is detected", () => {
  const rows = parseVerificationLog(md);
  assert.equal(manuallyVerified({ id: "bls-made-up", agency: "", title: "", url: "", botBlocked: true }, rows), undefined);
});
