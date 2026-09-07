# LOOP — Class asymmetry (keep filling past section floors)

The exhaustive section loops (`LOOP-Cases.md`, `LOOP-Charts.md`, `LOOP-Learn.md`, `LOOP-Coach.md`, `LOOP-Archive.md`) stop when **per-pack / per-group floors** are met. Equities still win on volume because Equities own **four** Case packs (earnings, company-news, macro-news, combined) while Futures / Forex / Crypto / Options context each own **one**.

This loop ignores those floors. It keeps adding content until expansion classes are no longer thin next to Equities.

**Do not add Equities content in this loop.** Equities stay the traditional retail path. Catch the other classes up.

Companions: [`LOOP-Cases.md`](./LOOP-Cases.md) · [`LOOP-Charts.md`](./LOOP-Charts.md) · [`LOOP-Learn.md`](./LOOP-Learn.md) · [`LOOP-Coach.md`](./LOOP-Coach.md) · [`LOOP-Archive.md`](./LOOP-Archive.md) · [`src/lib/caseStudies.ts`](../src/lib/caseStudies.ts) · [`src/lib/multiAssetCases.ts`](../src/lib/multiAssetCases.ts) · [`src/lib/marketNavigator.ts`](../src/lib/marketNavigator.ts) (`CLASS_TO_DECIDE_PACKS`, `CLASS_SESSION_TAGS`) · [`src/lib/beginnerPath.ts`](../src/lib/beginnerPath.ts) (`CASE_PACK_ASSET_CLASS`)

---

## How to run

```text
/loop class asymmetry using LOOPS/LOOP-Asymmetry.md
```

Prefer **no interval** (dynamic). One content unit per tick.

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build`.
2. Do **not** also run `LOOP-Graph.md` or a single-section exhaustive loop in this session — those pickers are equities-first and will fight this queue.
3. Stop yourself anytime; hard-stop on the 10-round error budget or Done(asymmetry).

**On each tick**
- Re-inventory from source (do not trust a stale table).
- Pick the single largest gap (picker below).
- Add **exactly one** unit using that surface’s authoring file.
- Lint + build (+ `npm run test:coaching` if Coach); continue.

---

## Why the old floors look “done” while Forex still looks empty

Snapshot when this file was written (re-count every tick — these numbers will move):

| Surface | Equities | Futures | Forex | Crypto | Options context |
|---------|----------|---------|-------|--------|-----------------|
| Cases (`assetClass`) | 53 (4 packs) | 11 (1 pack) | 11 (1 pack) | 11 (1 pack) | 9 (1 pack) |
| Charts SAMPLE packs | 7 | 5 | 5 | 6 | 5 |
| Learn literacy questions | 12 (`equity-literacy`) | 6 | 6 | 6 | 6 |
| Coach sessions (tag match) | 15 | 2 | 1 | 1 | 1 |
| Archive class-specific terms | (spine + 1 flag) | 1 | 1 | 1 | 1 |

`LOOP-Cases.md` already treats `forex` as Done at ≥8 beginner + ≥3 intermediate. `/cases?market=forex` is still one thin list next to `/cases?market=equity` (four packed sections).

Count Cases with `listCaseStudiesByAssetClass`. Count Learn literacy with `getQuestionsForGroup("<class>-literacy")` — **not** `getQuestionsByAssetClass` (that helper omits Phase D banks). Count Coach with `coachSessionMatchesClass`. Count Charts with `SAMPLE_PACKS_BY_CLASS`. Count Archive class terms with `literacyTermAssetClass`.

---

## Parity targets (live — recompute from Equities each tick)

Let `E_cases`, `E_charts`, `E_learn`, `E_coach` be current Equities counts on those surfaces. Count Coach with `coachSessionMatchesClass` (same helper `/coach?class=` uses).

Expansion classes = `future`, `forex`, `crypto`, `option_context`.

| Surface | Target per expansion class | Do not copy from Equities |
|---------|----------------------------|---------------------------|
| **Cases** | `ceil(0.70 * E_cases)` total, with ≥ `ceil(0.70 * E_beginner)` beginner and ≥ `ceil(0.70 * E_intermediate)` intermediate | Statement modes: `beat_miss`, `margin_compression`, `cash_flow_red_flag`, `guidance_cut`, `balance_sheet_stress` |
| **Charts** | `E_charts` distinct SAMPLE packs | Scaled clones of equity tapes |
| **Learn** | `E_learn` questions in that class’s `*-literacy` group | Putting expansion groups on the Beginner spine |
| **Coach** | `ceil(0.70 * E_coach)` distinct sessions whose tags match `CLASS_SESSION_TAGS` for that class | Runtime LLM; duplicate framing trees; earnings-statement trees (`beat_miss`, margins, cash, guidance, debt) |
| **Archive** | ≥4 literacy terms mapped in `LITERACY_TERM_ASSET_CLASS` for that class | Fake overlay ids; investment advice |

**Done(asymmetry):** every expansion class meets every row. Equities may stay larger (30% headroom is intentional).

---

## Transferable Case thinking modes

Each expansion class must cover these at **beginner and intermediate** before stacking a third copy of the same mode:

| Mode | How it reads on a non-equity tape |
|------|-----------------------------------|
| `momentum_chase_vs_fade` | Spike / dump: chase vs wait |
| `company_headline` | Central-bank, listing, hack, event, contract analog — still a headline, not a 10-K |
| `risk_off` | Broad risk-off on that class’s instrument |
| `macro_print` | CPI / NFP / FOMC / jobs analog mapped to **this** pair, future, coin, or underlying |
| `geopolitics_supply` | Energy / shipping / harvest / hack-supply — name which side the instrument is on |
| `combined_earnings_headline` | Filed/printed fact **plus** a headline (not an income statement) |
| `combined_rumor_filing` | Rumor vs official print / scheduled event |

`short_vs_sell` — only if the class can teach the distinction without inventing a product this app does not have (prefer futures; skip options-context).

**Class-native stories** (keep tapes distinct — do not rescale Equities OHLC):

- **Forex** — majors vs crosses; pip/spread humility (HOLD is valid); risk-on AUD; JPY dump; energy EUR; NFP/BOJ prints.
- **Futures** — ES/NQ index, CL, GC, ZC; roll / contango / backwardation literacy; weather/ag.
- **Crypto** — BTC/ETH/SOL; stable depeg *scare* (educational); weekend gap; dump-no-reclaim. Not a live exchange.
- **Options context** — pre-event coil, vol spike, post-event settle, failed breakout on the **underlying**. No chain, no Greeks.

---

## Picker (strict)

1. Inventory counts vs targets for the four expansion classes × five surfaces.
2. `relative_gap = (target - count) / target` (0 if count ≥ target).
3. **Never pick Equities.**
4. Catalog-first: if any **Cases** or **Coach** `relative_gap ≥ 0.25`, pick the catalog cell with the largest relative_gap. Learners notice `/cases?market=` and `/coach?class=` (Step coaching) first.
5. Otherwise pick the cell with the largest `relative_gap`.
6. Ties: surface order Cases → Coach → Charts → Learn → Archive. Class order **forex → future → crypto → option_context** (Forex was the thin example).
7. Inside Cases, next unit = first unmet of:
   1. Missing transferable mode at `beginner` in that class
   2. Missing transferable mode at `intermediate`
   3. Class still below the 70% count target — new sector/instrument/tape shape (grind vs dump vs chop vs spike-fade), not a clone
   4. Stage B sibling pack (below) only after that class’s **count + mode** targets are met and `/cases?market=<class>` still lists a single pack while Equities list four
8. Inside Coach, next unit = first unmet transferable tree (do not clone that class’s existing framing session):
   1. Chase vs fade
   2. Risk-off (pair/future/coin/underlying vs tape)
   3. Macro print mapped to **this** class
   4. Supply / geopolitics named to a side
   5. Combined print-vs-headline or rumor-vs-official-note
   6. Class-native literacy (pips/spread HOLD, roll, depeg scare, no-chain event/vol)
   7. Count until the 70% Coach target — new skill, not a paraphrased framing tree

One tick = one unit. Do not dump a whole pack.

---

## Stage B — sibling Case packs (after depth)

Equity shows four named sections on `/cases?market=equity`. Each expansion class should end with **three** packs mapped in `CLASS_TO_DECIDE_PACKS`:

| Pack suffix | Family | Home modes |
|-------------|--------|------------|
| existing `forex` / `futures` / `crypto` / `options-context` | keep as the original list (do not retag old ids unless a case clearly belongs in a new family) | whatever is already there |
| `<class>-tape` | headline / chase | `momentum_chase_vs_fade`, `company_headline`, `short_vs_sell` if allowed |
| `<class>-macro` | market-wide | `risk_off`, `macro_print`, `geopolitics_supply` |

Suggested new `CasePackId` values: `forex-tape`, `forex-macro`, `futures-tape`, `futures-macro`, `crypto-tape`, `crypto-macro`, `options-tape`, `options-macro`.

When adding a **new** pack id (one id per tick, then its first case on the **next** tick — still one unit; prefer “new id + first case” as a single tick if lint stays green):

1. Extend `CasePackId` + `CASE_PACKS` in `caseStudies.ts`
2. Append the pack id to `CLASS_TO_DECIDE_PACKS` for that class
3. Map it in `CASE_PACK_ASSET_CLASS` in `beginnerPath.ts` (same class lock as the parent pack)
4. Do **not** put the new pack on the Beginner Equities spine
5. Author the first `CaseStudy` into `multiAssetCases.ts` (new array or existing class array) with `assetClass` set, `difficulty: "beginner"`, `allowShort: false` unless the story teaches short

Skip Stage B for a class that already has ≥3 packs in `CLASS_TO_DECIDE_PACKS`.

---

## Authoring (delegate — do not freelance)

| Surface | File + skill | Unit |
|---------|--------------|------|
| Cases | `LOOP-Cases.md` authoring notes + `.agents/skills/add-case-pack-by-asset-class/SKILL.md` | 1 `CaseStudy` |
| Charts | `LOOP-Charts.md` + `add-sample-pack-by-class` | 1 `SamplePack` |
| Learn | `LOOP-Learn.md` Phase D groups (`forex-literacy`, …) | 1 `QuizQuestion` |
| Coach | `LOOP-Coach.md` + `add-coaching-session` | 1 session file |
| Archive | `LOOP-Archive.md` Phase A | 1 `LiteracyTerm` + `LITERACY_TERM_ASSET_CLASS` row |

Shared constraints from [`README.md`](./README.md): SAMPLE / STYLIZED only · no LIVE · no brokerage · options = no chain/Greeks · one unit per tick · distinct OHLC · process teaching · lint + build after every change.

---

## Loop prompt

```markdown
# OBJECTIVE
Close content asymmetry: Futures, Forex, Crypto, and Options context must reach 70% of Equities case/chart/literacy/**Coach Step coaching** depth, plus Archive ≥4 class terms each — without adding more Equities units.

**Done (asymmetry):** All four expansion classes meet every parity target in LOOPS/LOOP-Asymmetry.md.

**Done (per tick):** Exactly one new unit in the picker-chosen class × surface, verified.

# CONTEXT
- Picker + targets: `LOOPS/LOOP-Asymmetry.md`
- Authoring recipes: the matching `LOOPS/LOOP-Cases.md` / `LOOP-Charts.md` / `LOOP-Learn.md` / `LOOP-Coach.md` / `LOOP-Archive.md`
- Cases live in `src/lib/multiAssetCases.ts` (non-equity) and must stay tagged `assetClass`
- Navigator: `CLASS_TO_DECIDE_PACKS` must list every pack the class should show
- Path lock: `CASE_PACK_ASSET_CLASS` in `beginnerPath.ts` for every new CasePackId
- Count Learn via `getQuestionsForGroup`, not `getQuestionsByAssetClass`
- Auto-verify: `npm run lint` && `npm run build`; add `npm run test:coaching` on Coach ticks
- Constraints: SAMPLE only; do not rewrite CasePlayer/QuizModal/Coach runtime; do not unlock shorts on Beginner; do not put expansion packs on the Equities Beginner spine

# STEP-BY-STEP CADENCE
1. **Orient**
   - Count Equities + four expansion classes on Cases, Charts, Learn literacy, Coach, Archive class terms.
   - Compute targets from live Equities counts (70% cases / match charts / match literacy / 70% Coach sessions / Archive 4).
   - Run the picker. Announce class, surface, and why (relative_gap).
2. **Author one unit** using that surface’s section file (unique ids, distinct tapes, process copy).
3. **Verify** lint + build (+ coaching tests if Coach). Mentally: `/cases?market=<class>` or `/market?class=` or `/training?group=<class>-literacy` or `/coach?class=` or `/archive?tab=literacy` shows the new unit.
4. **On PASS** — continue to the next gap (same tick only if time remains **and** you re-run the picker after the new counts).
5. **On FAIL** — fix; max 10 rounds → Error Handoff Summary (class, surface, intended id, files, stderr).
6. **Skills** — if “add case to existing forex pack” repeats, extend `add-case-pack-by-asset-class` rather than inventing a second workflow.

# VERIFICATION RUBRIC
PASS only if:
- [ ] Unit is not Equities
- [ ] Picker chose the legal largest gap (Cases **or** Coach catalog-first while either relative_gap ≥ 0.25)
- [ ] Unique id; wired into the real registry (`CASE_STUDIES` / class pack array / `QUIZ_GROUPS` bank / `COACHING_SESSION_MODULES` / `LITERACY_TERMS`)
- [ ] Distinct data (no scaled OHLC clone, no paraphrased debrief)
- [ ] SAMPLE labels honest; options-context has no chain/Greeks
- [ ] lint + build 0 (and test:coaching if Coach)
- [ ] Beginner Equities unlocks unchanged

# STOP CONDITIONS
- Done(asymmetry) → STOP with a per-class table (count vs target).
- Error budget 10 → handoff.
- Human verification: adding a CaseThinkingMode; paid API; LIVE feed; putting expansion literacy on the Beginner spine.
- Abort: running Graph or LOOP-Cases exhaustive in the same session; rewriting runtime “for cleanup.”

# TICK OUTPUT (keep short)
1. class + surface + new id
2. counts now vs target for that cell
3. PASS | FIXING (n/10) | STOP
4. next cell the picker would choose
5. lint/build/(test:coaching) status
```

---

## Authoring notes

- Beginner copy stays concrete. Intermediate may assume Indicators.
- `allowShort: false` unless the case teaches short and CasePlayer hiding still makes sense.
- Forex copy: practice only, not a live FX desk. Crypto: not Beginner Equities. Futures: not a live contract. Options context: underlying only.
- Home/Dashboard tips: only after the named pack/group/slug exists (optional leftover; not required for Done(asymmetry)).
- If Equities case count grows because another session ran LOOP-Cases, **raise** expansion targets on the next tick — targets are live, not frozen to the snapshot table.
