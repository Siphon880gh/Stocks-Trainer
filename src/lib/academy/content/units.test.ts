import { test } from "node:test";
import assert from "node:assert/strict";
import { UNITS } from "./levels";
import { resolveRef, PRACTICE_ROUTES } from "../refs";
import { bannedIn } from "./banned";
import { MAX_CARD_WORDS, estMinutes, wordCount } from "./estimate";
import { LITERACY_TERMS } from "../../literacyTerms";
import { MISC_PRACTICE_ITEMS } from "../../miscPractices";

const inLevels = (ls: string[]) => UNITS.filter((u) => ls.includes(u.levelId));

test("unit counts: ≥ 22 in L0–L3, ≥ 18 in L4–L7, ≥ 40 total", () => {
  assert.ok(inLevels(["L0", "L1", "L2", "L3"]).length >= 22);
  assert.ok(inLevels(["L4", "L5", "L6", "L7"]).length >= 18);
  assert.ok(UNITS.length >= 40);
});

test("every unit: 3–6 cards, ≤ 120 words per card, estMinutes ≤ 5, a one-sentence objective", () => {
  for (const u of UNITS) {
    assert.ok(u.cards.length >= 3 && u.cards.length <= 6, u.id);
    for (const c of u.cards) {
      assert.ok(wordCount(c.body) <= MAX_CARD_WORDS, `${u.id} ${c.title}: ${wordCount(c.body)} words`);
      assert.ok(c.title.length > 0 && c.body.length > 0);
    }
    assert.ok(estMinutes(u) <= 5, `${u.id} ${estMinutes(u)} min`);
    assert.match(u.objective, /^[A-Z][^.!?]*[.]$/, `${u.id} objective must be one sentence`);
  }
});

test("every ref and every glossary chip resolves; each unit links into existing content", () => {
  const terms = new Set(LITERACY_TERMS.map((t) => t.id));
  for (const u of UNITS) {
    assert.ok(u.refs.length >= 1, u.id);
    for (const r of u.refs) {
      const res = resolveRef(r);
      assert.ok(res.ok, `${u.id}: ${r} → ${res.reason}`);
    }
    for (const c of u.cards) if (c.glossaryTermId) assert.ok(terms.has(c.glossaryTermId), `${u.id}: chip ${c.glossaryTermId}`);
  }
});

test("no duplicate card text across units; no banned phrase anywhere", () => {
  const seen = new Map<string, string>();
  for (const u of UNITS) {
    for (const c of u.cards) {
      const key = c.body.trim().toLowerCase();
      assert.ok(!seen.has(key), `${u.id} duplicates ${seen.get(key)}`);
      seen.set(key, u.id);
    }
    const all = [u.title, u.objective, ...u.cards.flatMap((c) => [c.title, c.body])].join(" ");
    assert.deepEqual(bannedIn(all), [], u.id);
  }
});

test("L2 links candles + hunt, L3 links order terms + plan (EPICS examples)", () => {
  const refs = (lv: string) => new Set(inLevels([lv]).flatMap((u) => u.refs));
  assert.ok(refs("L2").has("quiz:candle-reading"));
  assert.ok(refs("L2").has("practice:/practice/hunt"));
  assert.ok(refs("L3").has("glossary:market-order-vs-limit"));
  assert.ok(refs("L3").has("practice:/practice/plan"));
  assert.ok(refs("L3").has("glossary:trailing-stop"), "sibling trade-management term is linked");
});

/** BA1.M3: every major app surface is referenced by at least one unit; lists orphans. */
test("coverage: every major surface is referenced by ≥ 1 unit", () => {
  const hrefs = UNITS.flatMap((u) => u.refs.map((r) => resolveRef(r).href));
  const has = (pred: (h: string) => boolean) => hrefs.some(pred);
  const group = (...ids: string[]) => (h: string) => ids.some((id) => h === `/training?group=${id}&start=1`);
  const SURFACES: Record<string, (h: string) => boolean> = {
    "Learn: candles": group("candle-anatomy", "candle-reading", "candle-pattern-book"),
    "Learn: price action": group("price-action"),
    "Learn: supply & demand": group("supply-demand"),
    "Learn: indicators": group("indicators"),
    "Learn: literacy": group("equity-literacy", "news-literacy", "financial-literacy"),
    "Learn: financials groups": group("statements-reading", "cash-forecast-13wk", "earnings-preview", "earnings-reaction"),
    "Learn: macro groups": group("macro-releases", "rates-curve", "fed-policy", "housing-mortgage", "macro-reactions"),
    "Learn: options": group("options-literacy"),
    "Learn: futures": group("futures-literacy"),
    "Learn: forex": group("forex-literacy"),
    "Learn: crypto": group("crypto-literacy"),
    "Buy or Sell": group("buy-or-sell"),
    Coach: (h) => h.startsWith("/coach"),
    Cases: (h) => h.startsWith("/cases"),
    "Practice labs": (h) => MISC_PRACTICE_ITEMS.some((m) => m.to === h),
    "Macro Desk": (h) => h.startsWith("/macro"),
    "Statements lab": (h) => h.startsWith("/practice/statements"),
    "Read the Print": (h) => h.startsWith("/practice/read-the-print"),
    "Mark the band": (h) => h.startsWith("/practice/mark-the-band"),
    Glossary: (h) => h.startsWith("/archive"),
  };
  const orphans = Object.entries(SURFACES).filter(([, p]) => !has(p)).map(([k]) => k);
  assert.deepEqual(orphans, []);
  assert.ok(PRACTICE_ROUTES.length >= MISC_PRACTICE_ITEMS.length);
});
