# LOOP — Practice labs + Draw (exhaustive drills)

Deepen muscle-memory surfaces linked from Learn: `/practice-draw` and `/practice/*` (flashcards, label, regime, replay, plan, hunt).

Companions: [`src/lib/practiceLabs.ts`](../src/lib/practiceLabs.ts) · [`src/lib/practiceDraw.ts`](../src/lib/practiceDraw.ts) · [`src/lib/miscPractices.ts`](../src/lib/miscPractices.ts) · [`.agents/skills/practice-draw-grade/SKILL.md`](../.agents/skills/practice-draw-grade/SKILL.md) · practice pages under [`src/pages/practice/`](../src/pages/practice/)

---

## How to run

```text
/loop exhaustive Practice content using LOOPS/LOOP-Practice.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with `npm run lint` + `npm run build`.
2. Stop yourself anytime; hard-stop on 10-round error budget or Done(practice).

**On each tick**
- Re-inventory templates, regime windows, and tapes.
- Add **exactly one** content unit (one draw template **or** one regime window **or** one extra tape/prompt set).
- Wire types if needed; lint + build; continue.

---

## Product intent

| Surface | Learner need | Exhaustive means |
|---------|--------------|------------------|
| Draw | Sketch a named candle | Template per one-/two-candle pattern the Archive already teaches |
| Flashcards | Drill glossary | Grows automatically from `LITERACY_TERMS` (Archive loop). This loop does not duplicate terms. |
| Label | Tap anatomy | `LABEL_PROMPTS` already covers parts — only add if a new `CandlePart` exists (it should not) |
| Regime | Trend vs range | More SAMPLE windows + matching overlay follow-up |
| Replay / Plan / Hunt | Process on a tape | Multiple tapes, not one shared `SAMPLE_OHLC` forever |

**Always:** SAMPLE windows · grade **process** (especially replay) · coords 0–1 on draw templates · dedicated draw storage key unchanged.

---

## Coverage queue (strict order)

### Phase A — Practice Draw templates

Extend `DrawTemplateId` union **and** `DRAW_TEMPLATES` together. Floor: one template per one-candle / two-candle pattern that already has a `PATTERNS` id **and** a clear silhouette (doji, hammer, shooting-star, inverted-hammer, bullish-engulfing, bearish-engulfing, morning-star).

Order (skip if id exists):

1. `shooting-star` · 2. `inverted-hammer` · 3. `morning-star` · (doji/hammer/engulfing already exist)

Do not add head-and-shoulders-scale structures until a multi-guide template pattern is proven; stay on candle silhouettes.

### Phase B — regime windows

`REGIME_WINDOWS` floor **≥8**. Each needs unique `id`, distinct `bars`, `regime`, `overlay` (`sma` | `rsi` | `bollinger`), `overlayTip`.

Missing shape stories (skip if present): grind-up, slide-down, chop *(exist)* → squeeze, v-reclaim, round-top, trend-pause, gap-fade.

### Phase C — extra tapes

4. Second `REPLAY_TAPE` (or a `REPLAY_TAPES[]` + page picker if the page only has one tape — add the smallest UI to switch, still one tape per tick after the array exists).
5. Second `PLAN_TAPE` (downtrend plan vs uptrend plan).
6. `HUNT_TAPE` that actually contains a textbook scan hit (verify with `scanPatterns`); then a second hunt window with a different pattern.

Prefer extending `practiceLabs.ts` over forking grade functions.

### Phase D — new misc practice routes

Only after A–C. Do **not** add routes unless the user later asks. This loop’s Done is A–C.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Practice exhaustive: Draw templates for taught candle patterns; ≥8 regime windows; replay/plan/hunt tapes that are not all the same SAMPLE_OHLC.

**Done (practice):** Phase A–C complete.

**Done (per tick):** Exactly one template, window, or tape wired.

# CONTEXT
- Draw: `src/lib/practiceDraw.ts` (`DrawTemplateId` union + `DRAW_TEMPLATES` + `parseDrawTemplateId`)
- Labs: `src/lib/practiceLabs.ts`
- Hub links: `MISC_PRACTICE_ITEMS` (do not remove ids)
- Skill: `practice-draw-grade`
- Auto-verify: `npm run lint` && `npm run build`
- If you change hunt tapes, run existing `patternScan` tests if present

# STEP-BY-STEP CADENCE
1. **Orient** — first phase below floor.
2. **Author one unit**
   - Draw: normalized guides; openingBrush matches first candle; tip in learner language.
   - Regime: 6+ bars; overlay follow-up must match the teaching (range → rsi; trend → sma; squeeze → bollinger).
   - Hunt tape: confirm `scanPatterns` returns ≥1 hit.
3. **Wire page** only if it hardcodes a single template id list — PracticeDraw already maps `DRAW_TEMPLATES`.
4. **Verify** — lint + build.
5. **On FAIL** — ≤10 rounds.

# VERIFICATION RUBRIC
- [ ] One unit; unique id
- [ ] Draw ids added to the TypeScript union
- [ ] Hunt tapes have scan hits
- [ ] SAMPLE labels; lint + build 0

# STOP CONDITIONS
- Done(practice) → STOP with template / regime / tape counts.
- Error budget 10 → handoff.
- Human verification: new `/practice/...` route (out of scope unless asked).
- Abort: changing Jaccard grade constants “to make it nicer”; wiping `analysis_core_practice_draw_v1` schema.

# TICK OUTPUT
1. unit kind + id
2. PASS | FIXING (n/10) | STOP
3. Next gap
4. lint/build status
```

---

## Authoring notes

- Flashcards completeness is Archive’s job (`LITERACY_TERMS`).
- Label lab is complete unless anatomy types change.
- Deep links `?template=` / `?contentRef=` must keep working for existing ids.
