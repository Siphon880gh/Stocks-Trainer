# QA — Learning Goals & User Flows

Click-path scripts for Stock Trainer (ANALYSIS_CORE). Companion: [`AGENTS_LOOP_QA_User_Flows.md`](./AGENTS_LOOP_QA_User_Flows.md).

**Routes:** `/` Dashboard · `/training` Learn · `/market` Market · `/archive` Archive · `/cases` Cases · `/cases/:caseId` Case player · `/practice-draw` Practice Draw

**Progress:** `localStorage` key `analysis_core_progress_v1`. First-run shows GoalPicker until path confirm. Use Dashboard **RESET_PATH** (confirm dialog) to return to first-run.

**Dev server:** `npm run dev` → typically `http://localhost:3001`. Ask before changing server setup.

---

## Learning goals (curriculum)

| ID | Goal | Path milestone / surface | Success signal |
|----|------|--------------------------|----------------|
| G1 | Choose a learning path and see real progress chrome | GoalPicker + Dashboard | Confirmed path; milestone list matches template; PTS/streak from store |
| G2 | Equities vocabulary (share, exchange, long/short, risk/horizon) | E4.M1 · quiz `equity-literacy` | Quiz finish → E4.M1 `complete`; E4.M2 unlocks |
| G3 | Read a simple financial snapshot (revenue, profit vs cash, P/E, margin) | E4.M2 · quiz `financial-literacy` | Quiz finish → E4.M2 `complete`; E4.M0 unlocks |
| G4 | Candle/indicator fluency (chart soft-gate) | E4.M0 · quiz `indicators` | Quiz finish → E4.M0 `complete`; graded cases unlock |
| G5 | Apply statement theory in earnings decide-and-reveal | E5.M3 · pack `earnings` | Decide → reveal → process debrief; case result persisted |
| G6 | Practice chase-vs-fade on company headlines | E5.M2 · pack `company-news` | Same loop; SHORT soft-gated when case disallows |
| G7 | Browse SAMPLE equity charts + overlays before/alongside path | Market | Equity pack chart; overlay toggles; no LIVE theater |
| G8 | Look up patterns / indicators / literacy terms | Archive | Tabs + deep-links from quizzes |
| G9 | Sketch a candlestick template and get a coarse grade | Practice Draw | Grade + last-attempt restore |
| G10 | Decision Maker spine (earnings → news → macro → combined) | Decision Maker path | Chart gate still required; badge when spine complete |
| G11 | Local account shell + export/import progress | Dashboard ACCOUNT_SHELL | Sign-in local; export JSON; import restores |
| G12 | Locked milestones show prerequisites (no silent skip) | Training / Cases | Locked quiz/case copy; chart-gate banner |

---

## Shared UI labels (exact strings)

| Location | Control | Label / copy |
|----------|---------|--------------|
| Dashboard GoalPicker | Path tabs | `Beginner Equities Path` / `Decision Maker Path` |
| Dashboard GoalPicker | Confirm | `CONFIRM PATH · …` |
| Dashboard path CTA | Primary tile | `NEXT_STEP` / `UNLOCK_GATE` / `OPEN_CASES` |
| Dashboard quick tiles | | `READ_THEORY` · `IDENTIFY_CANDLE` · `CASE_STUDIES` · `PRACTICE_DRAW` · `CHART_GATE` |
| Dashboard side rail | | `CHARTS` · `QUIZ_CENTER` · `CASE_STUDIES` · `ARCHIVE` · `PRACTICE_DRAW` |
| Dashboard bottom nav | | `DASHBOARD` · `LEARN` · `MARKET` · `CONFIG` |
| Training | Start | `START QUIZ` / `LOCKED` |
| Training groups (path) | | `Equities Literacy` · `Statements Literacy` · `Indicators` |
| Case player | Actions | `BUY` · `SELL` · `HOLD` · `SHORT` (+ `· LOCKED` when gated) |
| Case player | Submit | `LOCK DECISION · REVEAL` |

---

## Flow UF-01 — First-run goal intake (G1)

**Precondition:** Cleared progress (RESET_PATH or empty localStorage).

1. Open `/` (or click bottom nav **DASHBOARD**).
2. See **GOAL_INTAKE · Choose path**.
3. Click **Beginner Equities Path** (default) — preview shows E4.M1 → E4.M2 → E4.M0 → E5.M3 → E5.M2.
4. Click **CONFIRM PATH · BEGINNER EQUITIES PATH**.
5. GoalPicker dismisses. Path chrome shows `PATH::BEGINNER-EQUITIES · STEP_0/5`, active **E4.M1 · Equities Literacy**, coach tip visible.
6. Primary CTA tile reads **NEXT_STEP**.

**Pass:** `pathConfirmed` true; E4.M1 `available`; later milestones `locked`.

---

## Flow UF-02 — Equities literacy quiz (G2)

**Precondition:** UF-01 complete; active E4.M1.

1. On Dashboard, click **NEXT_STEP** (or side rail **QUIZ_CENTER** then select group).
2. Land on `/training?group=equity-literacy&start=1` — quiz modal opens (or select **Equities Literacy** → **START QUIZ**).
3. For each question: pick an option → submit/next until group finishes.
4. Modal closes; return to Training or navigate **DASHBOARD** (logo / home).
5. Dashboard: E4.M1 `[complete]`; E4.M2 `[available]`; PTS/accuracy updated.

**Pass:** Milestone writeback via quiz group `equity-literacy` → E4.M1.

**Fail if:** Statements / Indicators groups startable before unlock on Beginner path (should show **LOCKED**).

---

## Flow UF-03 — Statement snapshot literacy (G3)

**Precondition:** E4.M1 complete.

1. Dashboard → **NEXT_STEP** → `/training?group=financial-literacy&start=1`.
2. Complete **Statements Literacy** quiz (snapshot cards may appear on questions).
3. Optional side path: bottom/side **ARCHIVE** → tab **Literacy** → open a term; or from quiz glossary link `?tab=literacy&open=…`.
4. Return Dashboard: E4.M2 complete; E4.M0 available.

**Pass:** E4.M2 complete; financial snapshot content visible during quiz where tagged.

---

## Flow UF-04 — Chart soft-gate (G4)

**Precondition:** E4.M2 complete; E4.M0 available.

1. Dashboard → **NEXT_STEP** or quick tile **CHART_GATE** → `/training?group=indicators` (auto-start if `start=1`).
2. Banner may show **Beginner Path · E4.M0 Chart Soft-Gate**.
3. Select **Indicators** if needed → **START QUIZ** → finish all indicator questions.
4. Dashboard: E4.M0 complete; E5.M3 available; case-gate lock copy gone.
5. Negative check before finish: open `/cases` → yellow **Chart soft-gate required** banner; case titles not clickable as unlocked links.

**Pass:** Graded packs unlock only after Indicators quiz completion.

---

## Flow UF-05 — Earnings case decide-and-reveal (G5)

**Precondition:** E4.M0 complete; E5.M3 available.

1. Dashboard → CTA **OPEN_CASES** → `/cases?pack=earnings`.
2. See **FOCUS_PACK · earnings** and Earnings section marked **PATH_FOCUS**.
3. Click first unlocked case (e.g. title containing beat/miss).
4. Read brief (+ optional snapshot) + **SAMPLE_Pre_Reaction** chart (post tape hidden).
5. Click **BUY** / **SELL** / **HOLD** (or **SHORT** if enabled) → **LOCK DECISION · REVEAL**.
6. Aftermath chart + **GRADE** + process / why_moved / evidence debrief.
7. **Back to case list** → Dashboard: case result in store; on **correct** or **partial**, E5.M3 flips `complete` and next milestone unlocks (`recordCaseResult`).

**Pass:** No aftermath before lock; debrief is process-oriented (not “price went up” only).

---

## Flow UF-06 — Company news cases (G6)

**Precondition:** E5.M3 complete (or pack unlocked per path); chart gate done.

1. Dashboard **OPEN_CASES** → `/cases?pack=company-news` (or Training links **Company news pack**).
2. Open a company-news case.
3. Confirm SHORT shows **· LOCKED** when case soft-gates short.
4. Complete decide → reveal → debrief.
5. Return Dashboard; E5.M2 progresses toward path complete.

**Pass:** Beginner path lists beginner-difficulty cases only.

---

## Flow UF-07 — Beginner path credential (G1–G6 end-to-end)

**Precondition:** Fresh Beginner Equities confirm.

1. Run UF-02 → UF-03 → UF-04 → UF-05 → UF-06 until all five milestones `complete`.
2. Dashboard headline **BEGINNER_EQUITIES_PATH_COMPLETE**; credential copy; coach tip for completion.
3. Progress bar 100% (`5/5`).

**Pass:** Credential label appears; RESET_PATH returns to GoalPicker / first-run skeleton.

---

## Flow UF-08 — Market SAMPLE charts (G7)

1. Dashboard bottom **MARKET** or side **CHARTS** or feed tile **VIEW_CHARTS_AND_FINANCIALS**.
2. Set **Class** filter to **Equities**; pick an equity SAMPLE market.
3. Toggle overlays (SMA/EMA/RSI/MACD/Bollinger).
4. Optional: **Provider** SAMPLE vs DELAYED (labels must not claim LIVE/REAL_TIME theater).
5. If chart gate open, banner links to Indicators quiz.
6. Open scan/glossary as available; return via bottom **DASHBOARD**.

**Pass:** Chart renders OHLC; provider label honest.

---

## Flow UF-09 — Archive theory (G8)

1. Dashboard **READ_THEORY** or bottom **CONFIG** → `/archive`.
2. Tab **Patterns** → open a pattern detail.
3. Tab **Indicators** → open SMA (or deep-link `/archive?tab=indicators&open=sma`).
4. Tab **Literacy** → open a term.
5. From literacy CTA, follow link to `/training?group=equity-literacy&start=1` if present.

**Pass:** Tabs switch; deep-link opens the right modal/term.

---

## Flow UF-10 — Practice Draw (G9)

1. Dashboard **PRACTICE_DRAW** or Training link **Practice Draw**.
2. Optional: `/practice-draw?template=doji` preselects Doji.
3. Pick template → draw strokes on canvas → **Submit**/grade control.
4. See CORRECT / PARTIAL / INCORRECT + tip.
5. Reload page: last attempt restored note appears.
6. Dashboard may show draw tip / **DONE** badge on Practice Draw tile.

**Pass:** Grade persists across reload.

---

## Flow UF-11 — Decision Maker path (G10)

**Precondition:** RESET_PATH or first-run GoalPicker.

1. On GoalPicker click **Decision Maker Path** — preview E5.M3 → E5.M2 → E5.M2b → E5.M4; yellow note about chart soft-gate.
2. **CONFIRM PATH · DECISION MAKER PATH**.
3. Active case milestone shows; CTA **UNLOCK_GATE** while E4.M0 incomplete.
4. Complete Indicators quiz (Training **Indicators** → finish).
5. CTA becomes **OPEN_CASES** → earnings pack.
6. Complete earnings → company news → macro intro → combined packs (macro/combined via Cases list or Training pack links).
7. When spine done: **BADGE · DECISION_MAKER_SEGMENT** / completion copy.

**Pass:** Cases stay locked until Indicators complete; DM shows non-beginner difficulties when path is Decision Maker.

---

## Flow UF-12 — Account shell + progress sync stub (G11)

1. Dashboard **ACCOUNT_SHELL**: enter display name → **SIGN_IN_LOCAL** (or **SAVE_NAME** when signed in).
2. Header shows `SIGNED_IN_LOCAL // …`.
3. **EXPORT_PROGRESS** downloads JSON.
4. Change something (e.g. take a quiz), then **IMPORT_PROGRESS** with prior file → restore message **IMPORT_OK** or reject copy.
5. Sync adapter status label remains local-only (no fake cloud success).
6. **SIGN_OUT** returns signed-out shell.

**Pass:** No OAuth; import reject does not crash UI.

---

## Flow UF-13 — Lock / gate regression (G12)

**Precondition:** Fresh Beginner path after confirm; do **not** complete quizzes.

1. Training: select **Statements Literacy** or **Indicators** → button **LOCKED** + unlock copy.
2. Navigate `/cases` → chart-gate banner; packs locked.
3. Open `/cases/case-earn-beat-miss` directly → red chart-gate tip + link to Indicators quiz.
4. Dashboard quick **CASE_STUDIES** still opens list (locked), not a playable graded case.

**Pass:** No graded decide/reveal without gate; no silent unlock.

---

## Flow UF-14 — Training secondary packs & answer sheet

1. Bottom **LEARN** → `/training`.
2. After chart gate (or on DM), banner links: Earnings / Company news / Macro / Combined / Practice Draw.
3. Select **Equity Pack Drills** or a pattern family → **START QUIZ** (unlocked groups only).
4. **ANSWER SHEET** → pick a practice question → quiz opens at that index.

**Pass:** Answer sheet practice launches correct group/index.

---

## Flow matrix (goal → primary flow)

| Goal | Primary flow | Secondary |
|------|--------------|-----------|
| G1 | UF-01, UF-07 | UF-11 |
| G2 | UF-02 | UF-09 |
| G3 | UF-03 | UF-09 |
| G4 | UF-04 | UF-08 |
| G5 | UF-05 | UF-14 |
| G6 | UF-06 | — |
| G7 | UF-08 | — |
| G8 | UF-09 | UF-02 glossary |
| G9 | UF-10 | — |
| G10 | UF-11 | UF-05–06 |
| G11 | UF-12 | — |
| G12 | UF-13 | UF-04 negative |

---

## App fixes applied for these flows

| Issue | Change |
|-------|--------|
| Dashboard `OPEN_CASES` linked `?pack=` but Cases ignored it | Cases honors `pack`, focuses/scrolls pack section |
| Cases hard to discover | Dashboard quick tile + side rail **CASE_STUDIES** → `/cases` |

---

## QA notes for agents

- Prefer browser click-through against this file; use `npm run lint` + `npm run build` as static gates.
- Do not invent LIVE feeds or cloud sync success.
- One flow per QA tick when looping; record PASS/FAIL with the failing step number.
- If UI labels drift, update **this** file to match shipped strings (flows are the contract).
