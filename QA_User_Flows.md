# QA — Learning Goals & User Flows

Click-path scripts for Stock Trainer (ANALYSIS_CORE). Companion: [`AGENTS_LOOP_QA_User_Flows.md`](./AGENTS_LOOP_QA_User_Flows.md).

**Routes:** `/` Home · `/training` Learn · `/market` Charts · `/archive` Archive · `/cases` Cases · `/cases/:caseId` Case player · `/practice-draw` Practice Draw · `/coach` Coach · `/coach/:slug` session

**Progress:** `localStorage` key `analysis_core_progress_v1`. First-run shows GoalPicker until path confirm. Use Home **Account** → **Reset path** (confirm dialog) to return to first-run. Reset also clears the session-only chart-gate peek so Indicators locks apply again.

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
| G11 | Local account shell + export/import progress | Home Account | Sign-in local; export JSON; import restores |
| G12 | Locked milestones show prerequisites (no silent skip) | Training / Cases | Locked quiz/case copy; chart-gate banner |

---

## Shared UI labels (exact strings)

| Location | Control | Label / copy |
|----------|---------|--------------|
| Home GoalPicker | Path tabs | `Beginner Equities Path` / `Decision Maker Path` / `Market Explorer Path` |
| Home GoalPicker | Heading / confirm | `Choose a path` · `Confirm path · {path title}` |
| Home path CTA | Primary | `Continue` / `Indicators quiz` / `Open cases` |
| Home Also | | `Charts` · `Market navigator` · `Quizzes` · `Reference` · `Draw` · `Lookalikes` · `Pattern hunt` · `Support and resistance` · `Coach` |
| App chrome | | `Home` · `Learn` · `Charts` · `Cases` · `Coach` |
| Training | Start | `Start quiz` / `Locked` |
| Training groups (path) | | `Equities Literacy` · `Statements Literacy` · `Indicators` · `News Literacy` · `Statements Drills` |
| Case list | Focus | `Showing: {pack name}` when `?pack=` is set |
| Case player | Actions | `BUY` · `SELL` · `HOLD` · `SHORT` (SHORT omitted unless the case allows it) |
| Case player | Submit | `Lock in and see what happened` |
| Market navigator | Types | `Equities` · `Futures` · `Forex` · `Crypto` · `Options context` |
| Market navigator | Actions | `View charts` · `Literacy` · `Step by step` · `Decide cases` |
| Coach catalog | | `Step coaching` · Topic `All topics` |
| Coach session | Outcomes | `Continue` · `Wrong · review` · `Success` |
| Coach session | Actions | `Rewind to decision` / `Step back` · `Restart session` |
| Home Account | | `Account · not signed in` / `Account · {name}` · `Sign in` · `Save name` · `Export` · `Import` · `Reset path` |

---

## Flow UF-01 — First-run goal intake (G1)

**Precondition:** Cleared progress (**Reset path** or empty localStorage).

1. Open `/` (or click chrome **Home**).
2. See **Choose a path**.
3. Click **Beginner Equities Path** (default) — preview shows Equities Literacy → Statement Snapshot → Chart Fluency → Earnings Cases → Company News Cases.
4. Click **Confirm path · Beginner Equities Path**.
5. GoalPicker stays as preview until confirm; after confirm, path chrome shows `Beginner Equities Path · 0/5`, headline **Equities Literacy**, coach tip visible.
6. Primary CTA reads **Continue**.

**Pass:** `pathConfirmed` true; E4.M1 `available`; later milestones `locked`.

---

## Flow UF-02 — Equities literacy quiz (G2)

**Precondition:** UF-01 complete; active E4.M1.

1. On Home, click **Continue** (or chrome **Learn**, then select group).
2. Land on `/training?group=equity-literacy&start=1` — quiz modal opens (or select **Equities Literacy** → **Start quiz**).
3. For each question: pick an option → submit/next until group finishes.
4. Modal closes; return to Training or navigate **DASHBOARD** (logo / home).
5. Dashboard: E4.M1 `[complete]`; E4.M2 `[available]`; PTS/accuracy updated.

**Pass:** Milestone writeback via quiz group `equity-literacy` → E4.M1.

**Fail if:** Statements / Indicators groups startable before unlock on Beginner path (should show **Locked**).

---

## Flow UF-03 — Statement snapshot literacy (G3)

**Precondition:** E4.M1 complete.

1. Home → **Continue** → `/training?group=financial-literacy&start=1`.
2. Complete **Statements Literacy** quiz (snapshot cards may appear on questions).
3. Optional side path: Home **Reference** → tab **Literacy** → open a term; or from quiz glossary link `?tab=literacy&open=…`.
4. Return Home: E4.M2 complete; E4.M0 available.

**Pass:** E4.M2 complete; financial snapshot content visible during quiz where tagged.

---

## Flow UF-04 — Chart soft-gate (G4)

**Precondition:** E4.M2 complete; E4.M0 available.

1. Home → **Continue** or **Indicators quiz** → `/training?group=indicators` (auto-start if `start=1`).
2. Learn lists **Indicators** among path groups.
3. Select **Indicators** if needed → **Start quiz** → finish all indicator questions.
4. Home: E4.M0 complete; E5.M3 available; case-gate lock copy gone.
5. Negative check before finish: open `/cases` → banner about Indicators plus **Take Indicators quiz**; locked packs stay locked.

**Pass:** Graded packs unlock only after Indicators quiz completion.

---

## Flow UF-05 — Earnings case decide-and-reveal (G5)

**Precondition:** E4.M0 complete; E5.M3 available.

1. Home → CTA **Open cases** → `/cases?pack=earnings`.
2. See **Showing:** the earnings pack name; that pack section scrolls into view.
3. Click first unlocked case (e.g. title containing beat/miss).
4. Read brief (+ optional snapshot) + pre-reaction SAMPLE chart (post tape hidden).
5. Click **BUY** / **SELL** / **HOLD** (or **SHORT** if the case allows it) → **Lock in and see what happened**.
6. Aftermath chart + **Correct** / **Partial credit** / **Incorrect** + process debrief.
7. **Back to cases** → Home: case result in store; on **correct** or **partial**, E5.M3 flips `complete` and next milestone unlocks (`recordCaseResult`).

**Pass:** No aftermath before lock; debrief is process-oriented (not “price went up” only).

---

## Flow UF-06 — Company news cases (G6)

**Precondition:** E5.M3 complete (or pack unlocked per path); chart gate done.

1. Home **Open cases** → `/cases?pack=company-news` (or Learn pack links).
2. Open a company-news case.
3. Confirm **SHORT** is omitted unless the case sets `allowShort`.
4. Complete decide → reveal → debrief.
5. Return Home; E5.M2 progresses toward path complete.

**Pass:** Beginner path lists beginner-difficulty cases only.

---

## Flow UF-07 — Beginner path credential (G1–G6 end-to-end)

**Precondition:** Fresh Beginner Equities confirm.

1. Run UF-02 → UF-03 → UF-04 → UF-05 → UF-06 until all five milestones `complete`.
2. Home headline **Beginner Equities path complete**; credential copy; coach tip for completion.
3. Progress bar 100% (`5/5`).

**Pass:** Credential label appears; **Reset path** returns to GoalPicker / first-run skeleton.

---

## Flow UF-08 — Market SAMPLE charts (G7)

1. Home **Charts** or chrome **Charts**.
2. Set **Class** filter to **Equities**; pick an equity SAMPLE market.
3. Toggle overlays (SMA/EMA/RSI/MACD/Bollinger).
4. Optional: **Provider** SAMPLE vs DELAYED (labels must not claim LIVE/REAL_TIME theater).
5. If chart gate is still open, navigator copy links to **Take Indicators quiz**.
6. Open **Scan patterns** / glossary as available; return via chrome **Home**.

**Pass:** Chart renders OHLC; provider label honest.

---

## Flow UF-08b — Market class filters (multi-asset SAMPLE)

**Precondition:** E9 market-types packs shipped (futures / options-context / crypto / forex).

1. Open `/market`. Confirm helper copy: traditional retail = **Equities (stocks)**.
2. **Class → Equities** → chart for an equity SAMPLE pack.
3. **Class → Futures** (or Forex / Crypto / Options context) → list non-empty; pick one; chart renders.
4. Provider remains SAMPLE or DELAYED — no LIVE/REAL_TIME.

**Pass:** At least one non-equity class lists packs; equities path messaging unchanged.

---

## Flow UF-09 — Archive theory (G8)

1. Home **Reference** → `/archive`.
2. Tab **Patterns** → open a pattern detail.
3. Tab **Indicators** → open SMA (or deep-link `/archive?tab=indicators&open=sma`).
4. Tab **Literacy** → open a term.
5. From literacy CTA, follow link to `/training?group=equity-literacy&start=1` if present.

**Pass:** Tabs switch; deep-link opens the right modal/term.

---

## Flow UF-10 — Practice Draw (G9)

1. Home **Draw** or Learn link **Practice Draw**.
2. Optional: `/practice-draw?template=doji` preselects Doji.
3. Pick template → draw strokes on canvas → grade control.
4. See correct / partial / incorrect + tip.
5. Reload page: last attempt restored note appears.
6. Home **Draw** may show **· done** after a graded attempt.

**Pass:** Grade persists across reload.

---

## Flow UF-11 — Decision Maker path (G10)

**Precondition:** **Reset path** or first-run GoalPicker.

1. On GoalPicker click **Decision Maker Path** — preview Earnings Cases → Company News Cases → Market-Wide News → News plus Financials; note about Indicators.
2. **Confirm path · Decision Maker Path**.
3. Active case milestone shows; CTA **Indicators quiz** while E4.M0 incomplete.
4. Complete Indicators quiz (Learn **Indicators** → finish).
5. CTA becomes **Open cases** → earnings pack.
6. Complete earnings → company news → market-wide news → news plus financials packs (via Cases list or Learn pack links).
7. When spine done: **Decision Maker path complete** / **Decision Maker segment**.

**Pass:** Cases stay locked until Indicators complete; DM shows non-beginner difficulties when path is Decision Maker.

---

## Flow UF-12 — Account shell + progress sync stub (G11)

1. Home **Account · not signed in**: enter display name → **Sign in** (or **Save name** when signed in).
2. Summary reads `Account · {display name}`.
3. **Export** downloads JSON.
4. Change something (e.g. take a quiz), then **Import** with prior file → **Progress restored** or reject copy.
5. Sync adapter status remains **Saved on this device only · no cloud sync**.
6. **Sign out** returns **Account · not signed in**.

**Pass:** No OAuth; import reject does not crash UI.

---

## Flow UF-13 — Lock / gate regression (G12)

**Precondition:** Fresh Beginner path after confirm; do **not** complete quizzes.

1. Learn: select **Statements Literacy** or **Indicators** → button **Locked** + unlock copy.
2. Navigate `/cases` → Indicators banner; packs locked.
3. Open `/cases/case-earn-beat-miss` directly → gate tip + **Take Indicators quiz**.
4. Home **Open cases** / Cases chrome still opens the list (locked), not a playable graded case.

**Pass:** No graded decide/reveal without gate; no silent unlock.

---

## Flow UF-14 — Training secondary packs & answer sheet

1. Chrome **Learn** → `/training`.
2. After chart gate (or on DM), Learn still lists pack groups plus **Practice Draw** from Home **Draw**.
3. Select **Equity Pack Drills** or a pattern family → **Start quiz** (unlocked groups only).
4. **Answer sheet** → pick a practice question → quiz opens at that index.

**Pass:** Answer sheet practice launches correct group/index.

---

## Flow UF-15 — Market Navigator (E10)

1. Home **Market navigator** → `/market?nav=1` (navigator scrolls into view).
2. **Market navigator** shows Equities · Futures · Forex · Crypto · Options context.
3. Select **Forex** → **View charts** → Class filter Forex + SAMPLE FX packs.
4. **Literacy** → Archive literacy term (or Learn for Equities).
5. With chart gate complete: **Decide cases** → `/cases?market=…` focused packs.

**Pass:** Helper copy states traditional retail = Equities (stocks); no LIVE desk claims.

---

## Flow UF-16 — News literacy quiz (E10)

1. Home Optional **news literacy** or Learn → group **News Literacy**.
2. Finish ≥6 questions via QuizModal; glossary links open Archive terms (rumor/priced-in/chase).
3. Return to Home → **News literacy complete**.
4. Beginner Equities unlock graph unchanged (E4.M1 etc. not auto-advanced by this drill).

**Pass:** Optional drill; SAMPLE-only copy.

---

## Flow UF-17 — Multi-market SAMPLE case (E10)

**Precondition:** Indicators chart soft-gate complete.

1. Navigator → **Futures** → **Decide cases** (or `/cases?market=future`).
2. Open a Futures SAMPLE case → **BUY** / **SELL** / **HOLD** → **Lock in and see what happened**.
3. Debrief shows process text (not direction-only).
4. Optional: GoalPicker **Market Explorer Path** → confirm → spine gate → futures → forex → crypto.

**Pass:** Anti-hindsight; SHORT omitted unless the case allows it; SAMPLE labels; Equities paths still available via **Reset path**.

---

## Flow UF-18 — Step coaching (E11)

1. Home **Coach** (or chrome **Coach**) → `/coach`.
2. Catalog **Step coaching** shows ≥4 sessions with topic + tags; Topic filter **All topics**.
3. Open **Chase vs fade a company headline** → `/coach/chase-vs-fade`.
4. Pick a wrong path (e.g. chase the open) → **Wrong · review** → **Rewind to decision**.
5. Complete success path → **Success** → **Restart session** clears trail.
6. Mid-session: refresh browser → nav state restores from `sessionStorage` (path trail matches).
7. Collapse/expand **Path · N steps**; optional **Show node ids**.
8. Return Home → **Coach · N session(s) reached success** after a success finish.

**Pass:** No LLM; Beginner unlock graph unchanged; SAMPLE/educational copy only.

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
| G13 Navigator / multi-market | UF-15 | UF-17 |
| G14 News literacy | UF-16 | UF-06 |
| G15 Step coaching | UF-18 | UF-06 |

---

## App fixes applied for these flows

| Issue | Change |
|-------|--------|
| Home `Open cases` linked `?pack=` but Cases ignored it | Cases honors `pack`, focuses/scrolls pack section |
| Cases hard to discover | Home **Open cases** / chrome **Cases** → `/cases` |

---

## QA notes for agents

- Prefer browser click-through against this file; use `npm run lint` + `npm run build` as static gates.
- Do not invent LIVE feeds or cloud sync success.
- One flow per QA tick when looping; record PASS/FAIL with the failing step number.
- If UI labels drift, update **this** file to match shipped strings (flows are the contract).
