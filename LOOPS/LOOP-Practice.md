# LOOP — Practice labs + Draw (exhaustive drills)

```text
COMMIT_MODE: none            # none (default) | local (one local commit per PASSed unit; NEVER push, NEVER PR)
ATTEMPT_LIMIT: 3             # consecutive failed attempts on the same unit before STOP (same rule as the project loops)
ERROR_ROUNDS_PER_ATTEMPT: 3  # fix → re-verify rounds inside one attempt before it counts as failed
BUILD_CHECK: npx vite build --outDir /tmp/st-build-check-practice --emptyOutDir && rm -rf /tmp/st-build-check-practice
VERIFY: npm run lint && npm run test:content && npm run test:lib && BUILD_CHECK
CHECKPOINT_MODE: continue    # no visual checkpoints here; a human-judgment STOP still stops
```

Deepen muscle-memory surfaces linked from Learn: `/practice-draw` and `/practice/*` (flashcards, label, regime, replay, plan, hunt, lookalike, invalidation, levels, ema-macd).

Project-owned practice pages are **not** this loop's units: `/practice/statements`, `/practice/read-the-print`, `/practice/mark-the-band` grow through [financials-earnings](../docs/projects/financials-earnings/CHARTER.md); `/macro/play` through [macro-forces](../docs/projects/macro-forces/CHARTER.md).

Companions: [`src/lib/practiceLabs.ts`](../src/lib/practiceLabs.ts) · [`src/lib/practiceDraw.ts`](../src/lib/practiceDraw.ts) · [`src/lib/miscPractices.ts`](../src/lib/miscPractices.ts) · [`.agents/skills/practice-draw-grade/SKILL.md`](../.agents/skills/practice-draw-grade/SKILL.md) · practice pages under [`src/pages/practice/`](../src/pages/practice/)

---

## How to run

```text
/loop exhaustive Practice content using LOOPS/LOOP-Practice.md
```

**Before starting**
1. Leave working `npm run dev` alone; verify with the VERIFY line in the config block (temp build dir, never `dist/`).
2. Stop yourself anytime; hard-stop after ATTEMPT_LIMIT (3) consecutive failed attempts on one unit or Done(practice).

**On each tick**
- Re-inventory templates, regime windows, and tapes.
- Add **exactly one** content unit (one draw template **or** one regime window **or** one extra tape/prompt set **or** one lookalike / invalidation / levels round).
- Wire types if needed; VERIFY; continue.

---

## Product intent

| Surface | Learner need | Exhaustive means |
|---------|--------------|------------------|
| Draw | Sketch a named candle | Template per one-/two-candle pattern the Archive already teaches |
| Flashcards | Drill glossary | Grows automatically from `LITERACY_TERMS` (Archive loop). This loop does not duplicate terms. |
| Label | Tap anatomy | `LABEL_PROMPTS` already covers parts — only add if a new `CandlePart` exists (it should not) |
| Regime | Trend vs range | More SAMPLE windows + matching overlay follow-up |
| Replay / Plan / Hunt | Process on a tape | Multiple tapes, not one shared `SAMPLE_OHLC` forever |
| Lookalike | Tell a pattern from its confuser | `LOOKALIKE_ROUNDS` pairs (hammer vs hanging man, …), each with the context that decides it |
| Invalidation | Place the stop where the idea is wrong | `INVALIDATION_ROUNDS` bands graded against the textbook invalidation level |
| Levels | Mark support / resistance / zones | `LEVEL_ROUNDS` bands graded against the level the tape respected |

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

### Phase D — shipped labs: lookalike, invalidation, levels

These routes shipped (`/practice/lookalike`, `/practice/invalidation`, `/practice/levels`; rounds in `practiceLabs.ts`). Floor **≥8 rounds each** (test-enforced; 2026-10-21: lookalike 10, invalidation 9, levels 8). One round per tick:

- Lookalike: a pattern and its confuser on distinct SAMPLE bars; the explanation names the context that separates them (prior trend, location, confirmation).
- Invalidation / levels: distinct bars; the answer band is the textbook level (below the hammer low, above the shooting-star high, the retested breakout level…), never a fitted number.

**Still no new routes:** do not add a `/practice/...` route unless a human asks (human-judgment STOP). This loop's Done is A–D floors.

---

## Loop prompt

```markdown
# OBJECTIVE
Make Practice exhaustive: Draw templates for taught candle patterns; ≥8 regime windows; replay/plan/hunt tapes that are not all the same SAMPLE_OHLC.

**Done (practice):** Phase A–C complete and Phase D labs ≥8 rounds each (2026-10-21: Done).

**Done (per tick):** Exactly one template, window, tape or lab round wired.

# CONTEXT
- Draw: `src/lib/practiceDraw.ts` (`DrawTemplateId` union + `DRAW_TEMPLATES` + `parseDrawTemplateId`)
- Labs: `src/lib/practiceLabs.ts`
- Hub links: `MISC_PRACTICE_ITEMS` (do not remove ids)
- Skill: `practice-draw-grade`
- Auto-verify: VERIFY (`npm run lint` && `npm run test:content` && BUILD_CHECK)
- If you change hunt tapes or rounds, also run `npm run test:lib` (`patternScan` and `practiceLabs` tests)
- Floors as tests: `src/lib/contentGraph.test.ts` → "Practice floors"

# STEP-BY-STEP CADENCE
1. **Orient** — run `npm run test:content`; first phase below floor (red Practice check first).
2. **Author one unit**
   - Draw: normalized guides; openingBrush matches first candle; tip in learner language.
   - Regime: 6+ bars; overlay follow-up must match the teaching (range → rsi; trend → sma; squeeze → bollinger).
   - Hunt tape: confirm `scanPatterns` returns ≥1 hit.
3. **Wire page** only if it hardcodes a single template id list — PracticeDraw already maps `DRAW_TEMPLATES`.
4. **Verify** — VERIFY.
5. **On FAIL** — ≤3 fix rounds per attempt; STOP after 3 failed attempts on the same unit.

# VERIFICATION RUBRIC
- [ ] One unit; unique id
- [ ] Draw ids added to the TypeScript union
- [ ] Hunt tapes have scan hits
- [ ] SAMPLE labels; lint + test:content + BUILD_CHECK 0

# STOP CONDITIONS
- Done(practice) → STOP with template / regime / tape counts.
- 3 consecutive failed attempts on one unit → handoff.
- Human verification: new `/practice/...` route (out of scope unless asked).
- Abort: changing Jaccard grade constants “to make it nicer”; wiping `analysis_core_practice_draw_v1` schema.

# TICK OUTPUT
1. unit kind + id
2. PASS | FIXING (attempt a/3 · round r/3) | STOP
3. Next gap
4. lint / test:content / build-check status
```

---

## Authoring notes

- Flashcards completeness is Archive’s job (`LITERACY_TERMS`).
- Label lab is complete unless anatomy types change.
- Deep links `?template=` / `?contentRef=` must keep working for existing ids.
- Regime follow-ups stay `sma` / `rsi` / `bollinger`. An `ema` or `macd` follow-up was considered (2026-10-21 audit) and parked: on these short windows it would give the same answer as `sma` and make the trend windows ambiguous. EMA / MACD reading is drilled in Learn `indicators` and the pack-tagged `equity-patterns` overlay drills instead. Since 2026-10-22, `/practice/ema-macd` (`emaMacdLab.ts`) teaches EMA vs SMA lag and MACD crosses on its own 120-bar SIMULATED charts, with keys computed from the chart. Keep it separate from the regime windows; any new item there needs a key recomputed in `emaMacdLab.test.ts`.
- Hunt / lookalike / band rounds use their own bars; never rescale another tape (the shape-uniqueness check in `contentGraph.test.ts` covers regime windows).
