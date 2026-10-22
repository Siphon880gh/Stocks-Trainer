# LOOP — Archive / Reference (exhaustive glossary)

```text
COMMIT_MODE: none            # none (default) | local (one local commit per PASSed unit; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3             # consecutive failed attempts on the same unit before STOP (same rule as the project loops)
ERROR_ROUNDS_PER_ATTEMPT: 3  # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-archive --emptyOutDir && rm -rf /tmp/st-build-check-archive
VERIFY: npm run lint && npm run test:content && npm run test:lib && BUILD_CHECK
CHECKPOINT_MODE: continue    # no visual checkpoints here; a human-judgment STOP still stops
```

Deepen `/archive` (Reference): Patterns, Indicators, Literacy tabs. Detail modals and quiz deep-links already exist.

Companions: [`src/lib/patterns.ts`](../src/lib/patterns.ts) · [`src/lib/overlays.ts`](../src/lib/overlays.ts) · [`src/lib/literacyTerms.ts`](../src/lib/literacyTerms.ts) · [`src/pages/Archive.tsx`](../src/pages/Archive.tsx) · [`src/lib/patternScan.ts`](../src/lib/patternScan.ts) · [`src/lib/ohlcData.ts`](../src/lib/ohlcData.ts)

---

## How to run

```text
/loop exhaustive Archive content using LOOPS/LOOP-Archive.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with the VERIFY line in the config block (temp build dir, never `dist/`).
2. Stop yourself anytime; hard-stop after ATTEMPT_LIMIT (3) consecutive failed attempts on one unit or Done(archive).

**On each tick**
- Re-inventory `PATTERNS`, `OVERLAYS`, `LITERACY_TERMS`.
- Add **exactly one** registry entry (one pattern **or** one overlay **or** one literacy term).
- Wire ids used by quizzes/flashcards; VERIFY; continue.

---

## Product intent

| Learner need | How this loop delivers |
|--------------|------------------------|
| Look up a candle / chart pattern | `PATTERNS` + optional image + scan/quiz later |
| Look up an overlay | `OVERLAYS` with category + useCase |
| Look up a word from quizzes | `LITERACY_TERMS` with category + summary + detail |

**Always:** SAMPLE/educational definitions · no investment advice · Equities = traditional retail stocks in literacy.

---

## Coverage queue (strict order)

### Phase A — literacy terms (floor **≥28** unique ids)

Fill categories `ownership` | `markets` | `position` | `process`. Existing ids include stock-share, exchange, long-vs-short, investing-vs-trading, risk-horizon, options-context, futures-market, crypto-browse, forex-spot, equities-traditional-retail, rumor-vs-filing, priced-in, ohlc-anatomy, candle-color, chase-vs-fade.

Add missing beginner terms before exotic ones. Suggested remaining themes (skip if already present):

1. bid-ask · 2. liquidity · 3. volatility · 4. volume · 5. support-resistance · 6. trend-vs-range · 7. market-order-vs-limit *(education only, no routing)* · 8. earnings-season · 9. guidance · 10. free-cash-flow · 11. net-margin · 12. pe-ratio · 13. diversification · 14. correlation *(plain language)* · 15. delayed-vs-sample-feed

Flashcards on `/practice/flashcards` auto-include new `LITERACY_TERMS`.

**Status 2026-10-21:** 193 terms (ownership 5 · markets 89 · position 3 · process 96); every suggested theme above shipped. The id list above is a sample, not an inventory: re-list ids from `LITERACY_TERMS` before adding. Thinnest categories are `position` and `ownership`; prefer a missing beginner idea there over another `markets` term.

**Unique ids, always.** Archive `?open=`, flashcards and `glossaryTermId` all key on the id; a duplicate shows two rows and the later definition wins the modal. Two rows that teach the same idea get merged, not duplicated; a combined row gets its own id (e.g. `high-wave-and-rickshaw-man`, renamed in the 2026-10-21 audit so it no longer collides with the `high-wave` pattern term). `test:content` fails on a duplicate.

### Phase B — candlestick / chart patterns (floor **≥18** in `PATTERNS`)

Add educational `PatternDef` rows. **Scanner / quiz / draw are optional follow-ups, not required on the same tick.**

Order (skip if id exists): hanging-man, evening-star, piercing-line, dark-cloud-cover, three-white-soldiers, three-black-crows, harami, tweezer-top, tweezer-bottom, rising-wedge, bull-flag, double-top, double-bottom, triangle.

**Status 2026-10-21:** 102 patterns (reversal 66 · continuation 18 · neutral 18), including the `ADVANCED_PATTERN_DEFS` rare set from `advancedPatterns.ts`; every id above shipped. Each pattern has a `PATTERN_OHLC` series (test-enforced, so add the series on the same tick as the row), and each **bullish / bearish** pattern needs a Buy-or-Sell route (drill key, `sc-` scenario or `BS-W-` Wait case; also test-enforced — log it as the Learn follow-up if you cannot add it on this tick). A pattern's `glossaryLink` must name a real literacy term id.

Rules:
- Unique `id` kebab-case; `type` reversal | continuation | neutral; `sentiment` set.
- Description in learner language; optional `image` only if an SVG exists under `public/patterns/` (do not invent binary assets; skip image if none).
- If you also add `PATTERN_OHLC[id]`, quizzes can chart-pick later (Learn loop).
- If you add `patternScan` detection, extend tests in `patternScan.test.ts` on the **same tick** as the scanner change (that still counts as one unit: pattern + scan + test).

### Phase C — overlays

**Do not add an `OVERLAYS` id that MarketChart cannot render** unless you implement the overlay in the chart stack on that same tick (still one conceptual unit: overlay def + render). Prefer completing Phase A–B first.

If chart already supports an overlay missing from the glossary, add the glossary row only.

Existing: sma, ema, rsi, macd, bollinger. `OVERLAYS` must equal the set MarketChart renders (test-enforced); a new overlay is chart-stack work and a human-judgment STOP for this loop.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Archive exhaustive: literacy floor, then pattern floor, then honest overlay glossary.

**Done (archive):** Phase A ≥28 terms; Phase B ≥18 patterns; Phase C = every rendered overlay has an OVERLAYS row (no fake overlay ids).

**Done (per tick):** Exactly one registry entry (term or pattern or overlay), wired.

# CONTEXT
- `src/lib/literacyTerms.ts` — `getLiteracyTerm` used by Archive `?open=` and flashcards
- `src/lib/patterns.ts` — Archive Patterns tab
- `src/lib/overlays.ts` — Indicators tab + hint term regex (`HINT_TERM_RE`) if you add a new overlay name
- Navigator literacy deep-links: `marketLiteracyHref` uses existing term ids — do not rename those ids
- Auto-verify: VERIFY (`npm run lint` && `npm run test:content` && `npm run test:lib` — includes `patternScan` tests — && BUILD_CHECK)

# STEP-BY-STEP CADENCE
1. **Orient** — run `npm run test:content`; counts; first phase below floor; first missing theme. (2026-10-21: all three phases Done; further units are optional depth.)
2. **Author one entry** — unique id; SAMPLE detail; no LIVE; no advice.
3. **Do not rename** existing ids (quiz `glossaryTermId` / Archive open=).
4. **Verify** — VERIFY; `/archive?tab=literacy&open=<id>` or patterns tab would show it.
5. **On FAIL** — ≤3 fix rounds per attempt; STOP after 3 failed attempts on the same unit.

# VERIFICATION RUBRIC
- [ ] One entry; unique id
- [ ] Closes next Coverage gap
- [ ] No overlay id without chart support (unless implemented same tick)
- [ ] Existing deep-link ids unchanged
- [ ] lint + test:content + BUILD_CHECK 0

# STOP CONDITIONS
- Done(archive) → STOP with counts (terms / patterns / overlays).
- 3 consecutive failed attempts on one unit → handoff.
- Human verification: adding a new overlay that needs chart work you are unsure about → STOP rather than a dead glossary toggle.
- Abort: replacing pattern SVGs wholesale; deleting terms quizzes still reference.

# TICK OUTPUT
1. kind (term|pattern|overlay) + id
2. PASS | FIXING (attempt a/3 · round r/3) | STOP
3. Next gap
4. lint / test:content / build-check status
```

---

## Authoring notes

- Literacy `detail` should mention SAMPLE/educational where a reader might think it is a live filing or quote.
- Pattern `head-shoulders` / `falling-wedge` already exist — do not duplicate under a new id.
- Search box on Archive is currently presentational; do not block on making it work unless the current tick is explicitly UI (this loop is content).
