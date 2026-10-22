/** Weng 2026-10-22: a glossary ⓘ never sits inside a choice button or link; it is its own adjacent button. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { renderToStaticMarkup } from "react-dom/server";
import JargonText, { GlossaryButtons, WithGlossary, jargonTerms } from "../components/JargonText";

const TEXT = "Sold into the print, then bought after the print";

/** Tag stack walk over static markup: is any element matching `inner` nested in a button or a link? */
function nestedInteractive(html: string, inner: RegExp): string[] {
  const out: string[] = [];
  const stack: string[] = [];
  const VOID = new Set(["br", "img", "input", "hr", "meta", "link", "path", "rect", "line", "circle"]);
  for (const m of html.matchAll(/<(\/)?([a-zA-Z0-9]+)([^>]*?)(\/)?>/g)) {
    const [, close, tag, attrs, self] = m;
    const t = tag!.toLowerCase();
    if (close) {
      stack.splice(stack.lastIndexOf(t), 1);
      continue;
    }
    if (inner.test(`<${t}${attrs}>`) && stack.some((s) => s === "button" || s === "a")) out.push(`<${t}${attrs}>`);
    if (!self && !VOID.has(t)) stack.push(t);
  }
  return out;
}

test("plain JargonText marks the term but renders no focusable ⓘ", () => {
  const html = renderToStaticMarkup(<JargonText text={TEXT} plain />);
  assert.ok(!html.includes("tabindex"));
  assert.ok(!html.includes("About "));
  assert.equal((html.match(/data-term=/g) ?? []).length, 2);
  assert.deepEqual(
    jargonTerms(TEXT).map((t) => t.id),
    ["into-the-print", "after-the-print"],
  );
});

test("WithGlossary puts labelled ⓘ buttons beside the choice, with a 44 px mobile target", () => {
  const html = renderToStaticMarkup(
    <WithGlossary texts={[TEXT]}>
      <button type="button">
        <JargonText text={TEXT} plain />
      </button>
    </WithGlossary>,
  );
  assert.deepEqual(nestedInteractive(html, /aria-label="About /), []);
  const buttons = [...html.matchAll(/<button[^>]*aria-label="About ([^"]+)"[^>]*>/g)];
  assert.deepEqual(
    buttons.map((b) => b[1]),
    ["Into the print", "After the print / post-print"],
  );
  for (const [b] of buttons) {
    assert.match(b, /type="button"/);
    assert.match(b, /min-h-11/);
    assert.match(b, /min-w-11/);
  }
  // choice first, then its ⓘ buttons: keyboard order follows the DOM
  assert.ok(html.indexOf("<button type=\"button\">") < html.indexOf('aria-label="About '));
  // no terms → just the control, no wrapper
  assert.equal(renderToStaticMarkup(<WithGlossary texts={["plain words"]}><button type="button">x</button></WithGlossary>), '<button type="button">x</button>');
  assert.equal(renderToStaticMarkup(<GlossaryButtons texts={["plain words"]} />), "");
});

test("the in-prose ⓘ still works outside controls", () => {
  const html = renderToStaticMarkup(<p><JargonText text={TEXT} /></p>);
  assert.equal((html.match(/aria-label="About /g) ?? []).length, 2);
});

/** Source guard: every <JargonText> inside a <button>, <Link>, <a> or <label> in src/ passes `plain`. */
function files(dir: string): string[] {
  return readdirSync(dir).flatMap((n) => {
    const p = join(dir, n);
    return statSync(p).isDirectory() ? files(p) : p.endsWith(".tsx") && !p.includes(".test.") ? [p] : [];
  });
}
function openTagEnd(s: string, from: number): { end: number; self: boolean } {
  let depth = 0;
  for (let i = from; i < s.length; i++) {
    const ch = s[i];
    if (ch === "{") depth++;
    else if (ch === "}") depth--;
    else if (ch === ">" && depth === 0) return { end: i, self: s[i - 1] === "/" };
  }
  return { end: s.length, self: true };
}

test("no glossary ⓘ inside a choice button or link anywhere in src/", () => {
  const bad: string[] = [];
  for (const f of files(join(process.cwd(), "src"))) {
    const s = readFileSync(f, "utf8");
    const stack: number[] = [];
    const re = /<(\/?)(button|Link|a|label)\b|<JargonText\b/g;
    for (let m = re.exec(s); m; m = re.exec(s)) {
      if (m[0].startsWith("<JargonText")) {
        const { end } = openTagEnd(s, m.index);
        if (stack.length && !/\bplain\b/.test(s.slice(m.index, end))) bad.push(`${f.replace(process.cwd() + "/", "")}:${s.slice(0, m.index).split("\n").length}`);
        continue;
      }
      if (m[1]) {
        stack.pop();
        continue;
      }
      const { end, self } = openTagEnd(s, m.index);
      if (!self) stack.push(m.index);
      re.lastIndex = end;
    }
  }
  assert.deepEqual(bad, []);
});
