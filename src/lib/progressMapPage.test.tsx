import assert from "node:assert/strict";
import { test } from "node:test";
import { MemoryRouter } from "react-router-dom";
import ProgressMap from "../pages/ProgressMap.tsx";
import { renderHtml } from "./macro/renderHarness.ts";

test("map page offers Browse all, and turning it on opens every lock in the markup", () => {
  const mem = new Map<string, string>();
  const store = {
    getItem: (k: string) => mem.get(k) ?? null,
    setItem: (k: string, v: string) => void mem.set(k, v),
    removeItem: (k: string) => void mem.delete(k),
    clear: () => mem.clear(),
    key: (i: number) => [...mem.keys()][i] ?? null,
    get length() {
      return mem.size;
    },
  };
  const prev = Object.getOwnPropertyDescriptor(globalThis, "sessionStorage");
  Object.defineProperty(globalThis, "sessionStorage", { value: store, configurable: true });
  try {
    const off = renderHtml(
      <MemoryRouter>
        <ProgressMap />
      </MemoryRouter>,
    );
    assert.match(off, /data-testid="map-browse-all"[^>]*aria-pressed="false"/);
    assert.match(off, />Browse all</);
    assert.match(off, /Open every locked stage for this tab only/);
    assert.match(off, /data-status="locked"/);

    mem.set("analysis_core_map_browse_all_v1", "1");
    const on = renderHtml(
      <MemoryRouter>
        <ProgressMap />
      </MemoryRouter>,
    );
    assert.match(on, /data-testid="map-browse-all"[^>]*aria-pressed="true"/);
    assert.match(on, /Turn off browse all/);
    assert.match(on, /does not save as progress/);
    assert.doesNotMatch(on, /data-status="locked"/);
  } finally {
    if (prev) Object.defineProperty(globalThis, "sessionStorage", prev);
    else delete (globalThis as { sessionStorage?: unknown }).sessionStorage;
  }
});
