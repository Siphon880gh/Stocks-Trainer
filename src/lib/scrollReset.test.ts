import { test } from "node:test";
import assert from "node:assert/strict";
import { scrollToTopOf, shouldResetOnRouteChange } from "./scrollReset";

// QA regression: /training scrolled to 3000px, click "Cases" -> /cases opened at 3000px.
test("a route change starts the new page at the top", () => {
  assert.equal(shouldResetOnRouteChange({ pathname: "/training", hash: "" }, { pathname: "/cases", hash: "" }), true);
});

test("first render, same path and #anchors keep their scroll", () => {
  assert.equal(shouldResetOnRouteChange(null, { pathname: "/cases", hash: "" }), false);
  assert.equal(shouldResetOnRouteChange({ pathname: "/cases", hash: "" }, { pathname: "/cases", hash: "" }), false);
  assert.equal(shouldResetOnRouteChange({ pathname: "/training", hash: "" }, { pathname: "/glossary", hash: "#rsi" }), false);
});

function fakeWin(scrollY: number) {
  const calls: number[] = [];
  return { win: { scrollY, scrollTo: (o: { top: number }) => void calls.push(o.top) }, calls };
}

// QA regression: "Next round" in Macro Desk / Read the Print left the next round scrolled 750-830px down.
test("scrollToTopOf brings a scrolled-past element back under the header", () => {
  const { win, calls } = fakeWin(1000);
  assert.equal(scrollToTopOf({ getBoundingClientRect: () => ({ top: -700 }) }, win), true);
  assert.deepEqual(calls, [1000 - 700 - 72]);
});

test("scrollToTopOf leaves a visible element alone and clamps at 0", () => {
  const a = fakeWin(500);
  assert.equal(scrollToTopOf({ getBoundingClientRect: () => ({ top: 40 }) }, a.win), false);
  assert.deepEqual(a.calls, []);
  const b = fakeWin(30);
  scrollToTopOf({ getBoundingClientRect: () => ({ top: -30 }) }, b.win);
  assert.deepEqual(b.calls, [0]);
  assert.equal(scrollToTopOf(null, b.win), false);
});
