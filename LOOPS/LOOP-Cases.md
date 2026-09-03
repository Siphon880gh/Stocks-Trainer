# LOOP — Cases (exhaustive content)

Deepen the decide-and-reveal library on `/cases` and `/cases/:caseId`. Runtime (CasePlayer, chart soft-gate, packs, Navigator decide links) already exists.

Companions: [`src/lib/caseStudies.ts`](../src/lib/caseStudies.ts) · [`src/lib/multiAssetCases.ts`](../src/lib/multiAssetCases.ts) · [`src/pages/Cases.tsx`](../src/pages/Cases.tsx) · [`src/pages/CasePlayer.tsx`](../src/pages/CasePlayer.tsx) · [`src/lib/thinkingModeTips.ts`](../src/lib/thinkingModeTips.ts) · [`.agents/skills/add-case-pack-by-asset-class/SKILL.md`](../.agents/skills/add-case-pack-by-asset-class/SKILL.md)

---

## How to run

```text
/loop exhaustive Cases content using LOOPS/LOOP-Cases.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(cases).

**On each tick**
- Re-inventory packs and thinking modes from source (do not trust a stale count).
- Add **exactly one** new `CaseStudy` that closes the next coverage gap.
- Wire registries; lint + build; continue.

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

**Inside a pack, pick the next case by the first unmet rule:**

1. Missing home thinking mode at `beginner`.
2. Missing home thinking mode at `intermediate`.
3. Duplicate-looking OHLC / same sector story — write a new sector or tape shape (mega-cap vs cyclical vs index vs small-name; grind vs dump vs chop vs gap).
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
- Multi-asset packs: `src/lib/multiAssetCases.ts` then re-export via `CASE_STUDIES`.
- Pack metadata: `CASE_PACKS` in `caseStudies.ts`.
- Cases list filter: `CLASS_TO_DECIDE_PACKS` in `src/lib/marketNavigator.ts` + beginner difficulty filter.
- Tips: `src/lib/thinkingModeTips.ts` must include every `CaseThinkingMode`.
- Skill: `.agents/skills/add-case-pack-by-asset-class/SKILL.md`
- Auto-verify: `npm run lint` && `npm run build`
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
   - `npm run lint` && `npm run build`
   - Mentally: Cases list shows the title; CasePlayer can load `/cases/<id>`; beginner path still hides intermediate; Navigator `hasDecidePackForClass` still true for that class.

4. **On PASS** — continue to the next gap (same tick if time remains).

5. **On FAIL** — error-fix; max 10 rounds → Error Handoff Summary.

6. **Skills** — if “add case to pack X” repeats, update `add-case-pack-by-asset-class` (or add `add-case-to-existing-pack`).

# VERIFICATION RUBRIC
PASS only if:
- [ ] One new case; unique id; wired into `CASE_STUDIES`
- [ ] Closes the next Coverage-queue gap (not a random extra)
- [ ] Distinct OHLC shape; process debrief (not direction-only)
- [ ] SAMPLE labels honest; no LIVE/REAL_TIME
- [ ] `allowShort` default false unless story requires short
- [ ] lint + build exit 0
- [ ] Beginner path still beginner-only on `/cases`

# STOP CONDITIONS
- Done(cases) → STOP with pack counts by difficulty.
- Error budget 10 → handoff (pack, intended id, files, lint/build excerpt).
- Human verification: ambiguous product choice (e.g. new pack id vs stuffing an existing pack) not already locked here.
- Abort: unrelated dependency upgrades; rewriting CasePlayer “for cleanup.”

# TICK OUTPUT (keep short)
1. Pack + new `id` + thinkingMode + difficulty
2. PASS | FIXING (n/10) | STOP
3. Remaining gap (next pack/mode)
4. lint/build exit status
```

---

## Authoring notes

- Beginner copy: concrete, no jargon pile-up. Intermediate copy may assume Indicators + one earnings pass.
- Do not unlock shorts on the beginner path by accident (`allowShort` + CasePlayer hides SHORT unless true).
- Demo alias `DEMO_CASE` stays the first earnings case — do not retarget it.
- Empty pack after beginner filter = pack disappears from Beginner `/cases`. Keep ≥1 beginner case in every pack you touch.
