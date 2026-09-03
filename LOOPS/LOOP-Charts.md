# LOOP — Charts / Market (exhaustive SAMPLE packs)

Deepen browse-able SAMPLE instruments on `/market` (Charts). Overlay math, provider labels, and class filters already exist.

Companions: [`src/lib/samplePacks.ts`](../src/lib/samplePacks.ts) · [`src/lib/markets.ts`](../src/lib/markets.ts) · [`src/pages/Market.tsx`](../src/pages/Market.tsx) · [`.agents/skills/add-sample-pack-by-class/SKILL.md`](../.agents/skills/add-sample-pack-by-class/SKILL.md) · [`.agents/skills/add-equity-sample-pack/SKILL.md`](../.agents/skills/add-equity-sample-pack/SKILL.md) · [`.agents/skills/market-data-provider/SKILL.md`](../.agents/skills/market-data-provider/SKILL.md)

---

## How to run

```text
/loop exhaustive Charts content using LOOPS/LOOP-Charts.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(charts).

**On each tick**
- Re-count packs per `assetClass` (include crypto via `markets.ts` legacy push into `CRYPTO_SAMPLE_PACKS`).
- Add **exactly one** new `SamplePack` with a distinct OHLC shape.
- Expose it on Market; lint + build; continue.

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
- Auto-verify: `npm run lint` && `npm run build`
- 12-bar series with existing label helpers (`RTH_BAR_LABELS_12` / `SESSION_24H_LABELS_12`) unless a class already uses another length — match that class.

# STEP-BY-STEP CADENCE
1. **Orient** — count packs per class; pick the first class below floor; pick the missing shape story.
2. **Author one SamplePack**
   - Unique `id`, SAMPLE `symbol` (`.S` / `.F` / pair / underlying style already used in that class).
   - New OHLC helper (not `scale(existing)`).
   - `educationalNotes`: SAMPLE/STYLIZED; class-specific honesty (futures not live contract; FX not live desk; options not chain/Greeks; crypto not Beginner Equities).
   - Append to the class array so `SAMPLE_PACKS_BY_CLASS` and Market adapter pick it up (crypto: append `LEGACY_CRYPTO_PACKS` and keep `CRYPTO_MARKETS` mapping).
3. **Verify** — lint + build; `/market?class=<class>` would list the new displayName.
4. **On FAIL** — ≤10 rounds.
5. **Skills** — update add-*-sample-pack on repeated failures (identical charts → rewrite shape).

# VERIFICATION RUBRIC
- [ ] One pack; unique id; class map + Market list
- [ ] OHLC not a scaled clone
- [ ] Honest SAMPLE notes
- [ ] Equities Beginner path untouched
- [ ] lint + build 0

# STOP CONDITIONS
- Done(charts) → STOP with per-class counts.
- Error budget 10 → handoff.
- Human verification: paid live feed (always refuse; stay SAMPLE/DELAYED).
- Abort: provider LIVE theater; deleting legacy crypto packs “for cleanup.”

# TICK OUTPUT
1. assetClass + pack id + shape intent
2. PASS | FIXING (n/10) | STOP
3. Next gap
4. lint/build status
```

---

## Authoring notes

- `LEGACY_SPX_PACK` is a scaled series — do not copy that pattern for new packs.
- Empty `CRYPTO_SAMPLE_PACKS` in `samplePacks.ts` is filled at runtime from `markets.ts`. Count after that push.
- Keep DELAYED provider behavior unchanged; this loop does not add network feeds.
