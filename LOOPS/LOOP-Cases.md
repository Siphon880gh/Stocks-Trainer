# LOOP — Cases (exhaustive content)

```text
COMMIT_MODE: none            # none (default) | local (one local commit per PASSed unit; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3             # consecutive failed attempts on the same unit before STOP (same rule as the project loops)
ERROR_ROUNDS_PER_ATTEMPT: 3  # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-cases --emptyOutDir && rm -rf /tmp/st-build-check-cases
VERIFY: npm run lint && npm run test:content && BUILD_CHECK
CHECKPOINT_MODE: continue    # no visual checkpoints here; a human-judgment STOP still stops
```

Deepen the decide-and-reveal library on `/cases` and `/cases/:caseId`. Runtime (CasePlayer, chart soft-gate, packs, Navigator decide links) already exists.

When every pack **floor below is already met** but Forex / Futures / Crypto / Options context still look thin next to Equities, stop this loop and run [`LOOP-Asymmetry.md`](./LOOP-Asymmetry.md) instead. (Asymmetry Stage B shipped 2026-10: each expansion class now has three packs — `<class>`, `<class>-tape`, `<class>-macro` — and its parity targets are test-enforced.)

Companions: [`src/lib/caseStudies.ts`](../src/lib/caseStudies.ts) · [`src/lib/multiAssetCases.ts`](../src/lib/multiAssetCases.ts) · [`src/pages/Cases.tsx`](../src/pages/Cases.tsx) · [`src/pages/CasePlayer.tsx`](../src/pages/CasePlayer.tsx) · [`src/lib/thinkingModeTips.ts`](../src/lib/thinkingModeTips.ts) · [`.agents/skills/add-case-pack-by-asset-class/SKILL.md`](../.agents/skills/add-case-pack-by-asset-class/SKILL.md)

---

## How to run

```text
/loop exhaustive Cases content using LOOPS/LOOP-Cases.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with the VERIFY line in the config block (temp build dir, never `dist/`).
2. Stop yourself anytime; hard-stop after ATTEMPT_LIMIT (3) consecutive failed attempts on one unit or Done(cases).

**On each tick**
- Re-inventory packs and thinking modes from source (do not trust a stale count).
- Add **exactly one** new `CaseStudy` that closes the next coverage gap.
- Wire registries; VERIFY; continue.

---

## Product intent

| Learner need | How this loop delivers |
|--------------|------------------------|
| Decide under a brief, then see aftermath | More distinct pre/post tapes + process debriefs |
| Cover every decision skill the app already names | Fill every `CaseThinkingMode` at beginner **and** intermediate |
| Practice every market class | Depth inside existing packs (`earnings` … `options-context`) |
| Beginner vs Decision Maker | Beginner path still lists `difficulty: "beginner"` only; intermediate cases show on Decision Maker |

**Always:** SAMPLE/STYLIZED · chart soft-gate unchanged · `allowShort: false` unless the story truly teaches short · no LIVE · options-context = no chain/Greeks.

---

## Coverage queue (strict order)

Re-count from `CASE_STUDIES` / pack arrays each tick. A pack is **thin** until it meets its floor. Do not skip ahead while an earlier pack is thin.

| Step | Pack (`packId`) | Floor | Home thinking modes (must appear) |
|------|-----------------|-------|-----------------------------------|
| 1 | `earnings` | ≥8 beginner **and** ≥4 intermediate | `beat_miss`, `margin_compression`, `cash_flow_red_flag`, `guidance_cut`, `balance_sheet_stress` |
| 2 | `company-news` | ≥8 beginner **and** ≥4 intermediate | `momentum_chase_vs_fade`, `company_headline`, `short_vs_sell` |
| 3 | `macro-news` | ≥8 beginner **and** ≥4 intermediate | `risk_off`, `macro_print`, `geopolitics_supply` |
| 4 | `combined` | ≥8 beginner **and** ≥4 intermediate | `combined_earnings_headline`, `combined_rumor_filing` |
| 5 | `futures` | ≥8 beginner **and** ≥3 intermediate | reuse modes that fit index/commodity stories; `assetClass: "future"` |
| 6 | `forex` | ≥8 beginner **and** ≥3 intermediate | `assetClass: "forex"` |
| 7 | `crypto` | ≥8 beginner **and** ≥3 intermediate | `assetClass: "crypto"` |
| 8 | `options-context` | ≥6 beginner **and** ≥3 intermediate | `assetClass: "option_context"` — underlying/event/vol stories only |
| 9 | Stage B `futures-tape` · `forex-tape` · `crypto-tape` · `options-tape` | ≥1 beginner; each home mode at beginner **and** intermediate | `momentum_chase_vs_fade`, `company_headline` (chart / headline stories on that class's tape) |
| 10 | Stage B `futures-macro` · `forex-macro` · `crypto-macro` · `options-macro` | ≥1 beginner; each home mode at beginner **and** intermediate | `risk_off`, `macro_print`, `geopolitics_supply` |

Stage B packs were seeded by the Asymmetry loop (cases live in `multiAssetCases.ts`); this loop deepens them like any other pack. 2026-10-21: every pack floor and every home mode at both difficulties is met (test-enforced in `contentGraph.test.ts` → "Cases floors").

**Inside a pack, pick the next case by the first unmet rule:**

1. Missing home thinking mode at `beginner`.
2. Missing home thinking mode at `intermediate`.
3. Duplicate-looking OHLC / same sector story — write a new sector or tape shape (mega-cap vs cyclical vs index vs small-name; grind vs dump vs chop vs gap). A tape whose pre + post bars are a rescaled copy of another case's fails the clone check in `test:content`; draw a new shape, do not multiply an old one.
4. Only after that pack’s floors are met, move to the next pack.

**After all pack floors:** optional new `CaseThinkingMode` values. If you add a mode, also add labels + coach tips in `thinkingModeTips.ts` and at least one beginner + one intermediate case in the pack that owns the idea. Do not add modes while any pack is still thin.

Keep `CLASS_TO_DECIDE_PACKS` in `src/lib/marketNavigator.ts` in sync if you introduce a **new** `CasePackId`. Prefer filling existing packs.

---

## Loop prompt

```markdown
# OBJECTIVE
Make the Cases section exhaustive: every existing pack meets its floor, every home thinking mode has beginner + intermediate coverage, and every new case is a distinct decide-and-reveal (not a clone).

**Done (cases):** All eight pack floors met; each home thinking mode appears at both difficulties in its home pack; no clone OHLC/debrief pairs.

**Done (per tick):** Exactly one new CaseStudy wired and verified, or one error-recovery round.

# CONTEXT
- Equity / mixed packs: `src/lib/caseStudies.ts` (`EARNINGS_CASES`, `COMPANY_NEWS_CASES`, `MACRO_NEWS_CASES`, `COMBINED_CASES`, `SCALE_CASES` — prefer dedicated pack arrays over growing SCALE for new work).
- Multi-asset packs (incl. Stage B `-tape` / `-macro`): `src/lib/multiAssetCases.ts` then re-export via `CASE_STUDIES`. Named tape consts (`*_PRE` / `*_POST`) sit above the pack arrays; add a new const per case, never reuse one.
- Floors as tests: `src/lib/contentGraph.test.ts` → "Cases floors" (pack floors, home modes at both difficulties, unique ids / titles, no rescaled tape clones, tips for every mode).
- Pack metadata: `CASE_PACKS` in `caseStudies.ts`.
- Cases list filter: `CLASS_TO_DECIDE_PACKS` in `src/lib/marketNavigator.ts` + beginner difficulty filter.
- Tips: `src/lib/thinkingModeTips.ts` must include every `CaseThinkingMode`.
- Skill: `.agents/skills/add-case-pack-by-asset-class/SKILL.md`
- Auto-verify: VERIFY (`npm run lint` && `npm run test:content` && BUILD_CHECK)
- Constraints: SAMPLE only; chart gate still enforced in CasePlayer; do not rewrite CasePlayer unless a field the new case needs is missing (prefer existing `CaseStudy` fields).

# STEP-BY-STEP CADENCE
1. **Orient**
   - Count cases per `packId` split by `difficulty`.
   - List which home thinking modes are missing at beginner / intermediate for the current (first thin) pack.
   - Choose the single next gap from the Coverage queue.

2. **Author one CaseStudy**
   - Unique `id` (`case-<packabbrev>-<slug>`), unique `title`.
   - `brief` in plain learner language; SAMPLE company/instrument (no live ticker theater).
   - Distinct `preOhlc` / `postOhlc` (new shape, not scaled clone of an existing series).
   - `correctActions` / `acceptablePartial` that teach process; HOLD is a valid taught answer.
   - `debrief.process` = how to think; `whyMarketMoved` = what the SAMPLE tape did; `evidence` = facts in the brief/snapshot.
   - Earnings / combined: attach a `statementSnapshot` (reuse or add in `financialSnapshots.ts` if the story needs a new card).
   - News / combined: `newsHeadline` when the story is headline-driven.
   - `allowShort: false` unless the case explicitly teaches short and beginner gating still makes sense.
   - Set `packId`, `difficulty`, `assetClass` (equity omitted is ok; non-equity **must** set it).
   - Append to the pack array **and** ensure `CASE_STUDIES` still spreads that array.

3. **Verify**
   - VERIFY (`npm run lint` && `npm run test:content` && BUILD_CHECK)
   - Mentally: Cases list shows the title; CasePlayer can load `/cases/<id>`; beginner path still hides intermediate; Navigator `hasDecidePackForClass` still true for that class.

4. **On PASS** — continue to the next gap (same tick if time remains).

5. **On FAIL** — error-fix; ≤3 rounds per attempt, STOP after 3 failed attempts → Error Handoff Summary.

6. **Skills** — if “add case to pack X” repeats, update `add-case-pack-by-asset-class` (or add `add-case-to-existing-pack`).

# VERIFICATION RUBRIC
PASS only if:
- [ ] One new case; unique id; wired into `CASE_STUDIES`
- [ ] Closes the next Coverage-queue gap (not a random extra)
- [ ] Distinct OHLC shape; process debrief (not direction-only)
- [ ] SAMPLE labels honest; no LIVE/REAL_TIME
- [ ] `allowShort` default false unless story requires short
- [ ] lint + test:content + BUILD_CHECK exit 0
- [ ] Beginner path still beginner-only on `/cases`

# STOP CONDITIONS
- Done(cases) → STOP with pack counts by difficulty.
- 3 consecutive failed attempts on one unit → handoff (pack, intended id, files, lint / test excerpt).
- Human verification: ambiguous product choice (e.g. new pack id vs stuffing an existing pack, a new `CaseThinkingMode`) not already locked here; changing how financials-earnings content links into cases (FE7.M2 decided 2026-10-21: tags live in `src/lib/financials/caseLinks.ts`, outside the case objects; tag a new earnings case there).
- Abort: unrelated dependency upgrades; rewriting CasePlayer “for cleanup.”

# TICK OUTPUT (keep short)
1. Pack + new `id` + thinkingMode + difficulty
2. PASS | FIXING (attempt a/3 · round r/3) | STOP
3. Remaining gap (next pack/mode)
4. lint / test:content / build-check exit status
```

---

## Authoring notes

- Beginner copy: concrete, no jargon pile-up. Intermediate copy may assume Indicators + one earnings pass.
- Do not unlock shorts on the beginner path by accident (`allowShort` + CasePlayer hides SHORT unless true).
- Demo alias `DEMO_CASE` stays the first earnings case — do not retarget it.
- Empty pack after beginner filter = pack disappears from Beginner `/cases`. Keep ≥1 beginner case in every pack you touch.
