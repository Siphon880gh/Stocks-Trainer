# LOOP — Charts / Market (exhaustive SAMPLE packs)

```text
COMMIT_MODE: none            # none (default) | local (one local commit per PASSed unit; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3             # consecutive failed attempts on the same unit before STOP (same rule as the project loops)
ERROR_ROUNDS_PER_ATTEMPT: 3  # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-charts --emptyOutDir && rm -rf /tmp/st-build-check-charts
VERIFY: npm run lint && npm run test:content && BUILD_CHECK
CHECKPOINT_MODE: continue    # no visual checkpoints here; a human-judgment STOP still stops
```

Deepen browse-able SAMPLE instruments on `/market` (Charts). Overlay math, provider labels, and class filters already exist.

Companions: [`src/lib/samplePacks.ts`](../src/lib/samplePacks.ts) · [`src/lib/markets.ts`](../src/lib/markets.ts) · [`src/pages/Market.tsx`](../src/pages/Market.tsx) · [`.agents/skills/add-sample-pack-by-class/SKILL.md`](../.agents/skills/add-sample-pack-by-class/SKILL.md) · [`.agents/skills/add-equity-sample-pack/SKILL.md`](../.agents/skills/add-equity-sample-pack/SKILL.md) · [`.agents/skills/market-data-provider/SKILL.md`](../.agents/skills/market-data-provider/SKILL.md)

---

## How to run

```text
/loop exhaustive Charts content using LOOPS/LOOP-Charts.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with the VERIFY line in the config block (temp build dir, never `dist/`).
2. Stop yourself anytime; hard-stop after ATTEMPT_LIMIT (3) consecutive failed attempts on one unit or Done(charts).

**On each tick**
- Re-count packs per `assetClass` (include crypto via `markets.ts` legacy push into `CRYPTO_SAMPLE_PACKS`).
- Add **exactly one** new `SamplePack` with a distinct OHLC shape.
- Expose it on Market; VERIFY; continue.

---

## Product intent

| Learner need | How this loop delivers |
|--------------|------------------------|
| Charts that do not all look the same | Distinct grind / dump / chop / gap / squeeze tapes |
| Practice every class | Floor per `ASSET_CLASSES` slot |
| Honest feed | SAMPLE / STYLIZED notes; provider SAMPLE or DELAYED only |

**Always:** no LIVE/REAL_TIME theater · no paid keys · options-context = underlying education, not a chain · Equities path packs stay educational stocks.

---

## Coverage queue (strict order)

Floor **≥5** distinct packs per class (count `SAMPLE_PACKS_BY_CLASS` / crypto after legacy merge). A pack counts only if its OHLC shape is visibly different from siblings (not a scalar of another series).

| Step | Class | Array / adapter | Shape slots still to fill (examples) |
|------|-------|-----------------|--------------------------------------|
| 1 | `equity` | `EQUITY_SAMPLE_PACKS` (+ do not clone `LEGACY_SPX_PACK` from crypto) | mega grind, index range, cyclical dump already exist — add: gap-and-go, tight squeeze, failed rally, dividend-cut tape |
| 2 | `future` | `FUTURE_SAMPLE_PACKS` | index grind + energy dump exist — add: metals range, rates-sensitive grind, commodity squeeze |
| 3 | `forex` | `FOREX_SAMPLE_PACKS` | major drift + JPY dump exist — add: commodity FX, range-bound major, news-spike fade |
| 4 | `crypto` | `LEGACY_CRYPTO_PACKS` in `markets.ts` (pushed into `CRYPTO_SAMPLE_PACKS`) | BTC/ETH/SOL exist — add: stable-range (educational), dump-no-reclaim, chop-fail |
| 5 | `option_context` | `OPTION_CONTEXT_SAMPLE_PACKS` | event grind + vol spike exist — add: post-event settle, pre-event coil, failed breakout underlying |

**Status 2026-10-21: Done.** Every class has **7** packs (35 total) and every shape slot in the table above shipped; the table is kept as the record of which stories exist. `contentGraph.test.ts` → "Charts" checks ≥5 per class, unique pack ids, no rescaled clones, and SAMPLE / STYLIZED wording in every pack. A further pack must be a story none of the 7 tells (e.g. a limit-down futures day, a weekend-gap FX open, an options-expiry pin on the underlying); treat it as optional depth, not a gap.

Every new **equity** pack also needs an `equity-patterns` Learn drill tagged with its `samplePackId` (the Learn floor checks that every equity pack has one) — log it as the Learn follow-up when this loop adds one.

**Inside a class, next pack = first missing shape story**, not a fourth mega-cap clone.

Do **not** add overlay types here unless MarketChart already implements them (that is Archive + chart-stack work). This loop is packs + notes.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Charts exhaustive: ≥5 distinct SAMPLE packs per asset class, each with honest educationalNotes and a unique tape shape.

**Done (charts):** All five classes at floor; Market class filter lists each pack; no scaled clones.

**Done (per tick):** Exactly one new SamplePack wired into the class map + Market adapter.

# CONTEXT
- Schema + class maps: `src/lib/samplePacks.ts`
- Crypto + some equity legacy: `src/lib/markets.ts` (`LEGACY_CRYPTO_PACKS`, `CRYPTO_MARKETS`)
- Market UI labels: `Market.tsx` `CLASS_LABELS` (do not rename Equities / Options context)
- Skills: `add-equity-sample-pack`, `add-sample-pack-by-class`
- Auto-verify: VERIFY (`npm run lint` && `npm run test:content` && BUILD_CHECK)
- 12-bar series with existing label helpers (`RTH_BAR_LABELS_12` / `SESSION_24H_LABELS_12`) unless a class already uses another length — match that class.

# STEP-BY-STEP CADENCE
1. **Orient** — run `npm run test:content`; count packs per class; pick the first class below floor; pick the missing shape story.
2. **Author one SamplePack**
   - Unique `id`, SAMPLE `symbol` (`.S` / `.F` / pair / underlying style already used in that class).
   - New OHLC helper (not `scale(existing)`).
   - `educationalNotes`: SAMPLE/STYLIZED; class-specific honesty (futures not live contract; FX not live desk; options not chain/Greeks; crypto not Beginner Equities).
   - Append to the class array so `SAMPLE_PACKS_BY_CLASS` and Market adapter pick it up (crypto: append `LEGACY_CRYPTO_PACKS` and keep `CRYPTO_MARKETS` mapping).
3. **Verify** — VERIFY; `/market?class=<class>` would list the new displayName.
4. **On FAIL** — ≤3 fix rounds per attempt; STOP after 3 failed attempts on the same unit.
5. **Skills** — update add-*-sample-pack on repeated failures (identical charts → rewrite shape).

# VERIFICATION RUBRIC
- [ ] One pack; unique id; class map + Market list
- [ ] OHLC not a scaled clone
- [ ] Honest SAMPLE notes
- [ ] Equities Beginner path untouched
- [ ] lint + test:content + BUILD_CHECK 0

# STOP CONDITIONS
- Done(charts) → STOP with per-class counts.
- 3 consecutive failed attempts on one unit → handoff.
- Human verification: paid live feed (always refuse; stay SAMPLE/DELAYED).
- Abort: provider LIVE theater; deleting legacy crypto packs “for cleanup.”

# TICK OUTPUT
1. assetClass + pack id + shape intent
2. PASS | FIXING (attempt a/3 · round r/3) | STOP
3. Next gap
4. lint / test:content / build-check status
```

---

## Authoring notes

- `LEGACY_SPX_PACK` is a scaled series — do not copy that pattern for new packs.
- Empty `CRYPTO_SAMPLE_PACKS` in `samplePacks.ts` is filled at runtime from `markets.ts`. Count after that push.
- Keep DELAYED provider behavior unchanged; this loop does not add network feeds.
- Pack ids are unique across all classes (test-enforced).
