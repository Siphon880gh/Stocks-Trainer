# Stock Trainer (ANALYSIS_CORE) — Epic Map

Living product map for AI-assisted incremental delivery.  
Companion files: [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) · [`.agents/state.json`](./.agents/state.json) · [`council-report-epics-milestones.md`](./council-report-epics-milestones.md)

| Field | Value |
|--------|--------|
| **Status** | Epics finalized (Council Option A) · beginner path locked · ready to implement |
| **Platform** | Web (React 19 + Vite + TypeScript) |
| **Primary learner** | Beginner picking up stocks → skilled decide-and-debrief trader |
| **Curriculum principle** | Equities-first, concrete before abstract; literacy then theory application in cases |
| **Council finalize** | Option A — literacy-then-cases + soft chart gate + MVP freeze; skill depth scales post-freeze |

---

## App summary

| Field | Value |
|--------|--------|
| **App name** | Stock Trainer (ANALYSIS_CORE) |
| **One-liner** | Beginner-first equities path: market basics → financial snapshot → candles/indicators → decide-and-reveal cases → then broader markets and deeper case library |
| **Success signal** | Learner completes Beginner Equities Path with persisted progress, then builds skill via expanding case modes (earnings, news, macro, combined) with process debriefs |

---

## Scope

### MVP (P0 — playable Beginner Equities Path)
- Equities sample OHLC / instrument packs (schema stubs for other classes; UI later)
- Equities vocabulary + risk/horizon literacy
- Financial statement literacy (key lines + simple ratios)
- **Chart soft-gate:** wire existing candle/indicator Training onto the path before graded cases
- Interactive **decision case studies**: context → buy / sell / hold (short soft-gated) → reveal → grade + process debrief
- Case packs: financials/earnings first, then thin company news
- Fixed **Beginner Equities** path model + **progress tracker** + unlock rules
- Dashboard wired to real path progress (not decorative %)
- Path completion = credential before case-volume grind

### Post-MVP (skill depth — many options & theory application)
- Goal intake / additional path templates (Decision Maker)
- Macro news thinking modes; combined news + statements cases
- Scaled case library (≥20) across thinking modes + difficulty tags
- Richer TA on equity packs; multi-asset Market browse; cross-market literacy
- Practice Draw (E7); live/delayed data & accounts (E8)
- Market Navigator + multi-market decide packs (E10)
- Step-by-step decision-tree coaching (E11) — fail/rewind/learn; no runtime LLM
- Cloud LLM coach, fees/fills sim, live options chains *(still later; not E11)*

### Constraints
- Client-first SPA; curated/sample data for MVP (no paid live feed required)
- Progress in `localStorage` (no auth in MVP)
- Curriculum-first “AI” (structured path + coach context); optional cloud LLM later
- **Step coaching (E11)** = deterministic decision graphs only — no language model at session runtime
- Options/futures = educational, not order routing / Greeks engine
- Case studies = curated historical or stylized packs, not live breaking-news trading
- Debriefs teach **process and theory application**, not “price went up”

---

## Beginner learning order (user-facing)

1. What a stock / market is (equities vocabulary) + risk / horizon / investing vs trading
2. Read a simple company financial snapshot
3. Candles + basic indicator lines (**path gate before cases**)
4. Decision cases: earnings & company news (buy/sell/hold → reveal; **short soft-gated**)
5. Decision cases: broader macro/news thinking *(post-MVP)*
6. Combined news + statements cases *(post-MVP)*
7. Scaled library + Decision Maker path *(post-MVP)*
8. Then: futures / options / crypto literacy and multi-asset drills *(post-MVP)*

---

## User needs (grounding)

| Kind | Needs |
|------|--------|
| **Use** | Practice on charts that feel like real equities; clear “what next”; persisted progress; decide under news/financials and see outcomes |
| **Usability** | Fast quiz/case loop; works with bundled sample data; terminal UI stays scannable |
| **Meaning** | Serious education: theory → apply in cases → process debrief; not casino signals |
| **Social** | Path completion feels like a credential (“Beginner Equities Path”); then skill depth via more modes |

---

## ICP snapshots

| ICP | Goals | Differentiator |
|-----|--------|----------------|
| Self-taught retail beginner | Learn stocks before risking capital | Structured path + decide-and-reveal cases |
| CS / quant-curious student | Vocabulary + progression + accuracy | Interactive charts/cases, not text-only |
| Options/futures curious (later) | Transfer TA to other markets | Same trainer UX after equities fluency |

---

## Flows (product-level)

- **First-run:** Default Beginner Equities path → Dashboard with Milestone 1 unlocked (goal picker post-MVP)
- **Primary loop:** Next milestone → lesson/quiz/case → score → tracker updates → unlock next
- **Case loop:** Brief (news and/or statements + pre-reaction chart) → decision → reveal aftermath → grade + **process** debrief
- **Coaching loop (E11):** Catalog → open session → choice nodes → wrong endings rewind to decision → success → restart; path trail from history stack
- **Secondary:** Market browse, Archive, path reset, history
- **Errors:** Missing pack, corrupt progress → reset; locked milestone → show prerequisite; unknown coaching node → recover to `start`

---

## State & persistence

| Layer | Contents |
|--------|-----------|
| Persisted business | Path, milestone status, quiz/case scores, accuracy, streaks |
| Persisted prefs | Active path ID, preferred asset classes |
| Temporary UI | Modals, quiz index, chart hover |
| Offline | Bundled sample packs + curriculum rules |

**UI states:** empty path · loading · error · success (milestone complete) · first-run · locked · path complete

---

## Epic list

| ID | Name | Goal / outcome | Priority | Status |
|----|------|----------------|----------|--------|
| E0 | Planning & Decisions | Locked scope, epics, beginner path, agent state | Mandatory | Complete |
| E1 | Equities Sample Universe | Credible equity packs for charts/cases (multi-asset UI later) | MVP | Complete |
| E2 | Learning Milestone Planner (AI Context) | Fixed Beginner path model P0; goal intake post-MVP | MVP (thin) | Planned |
| E3 | Milestone Tracker & Progress Persistence | Resume-able real progress + unlocks | MVP | Planned |
| E4 | Equities Literacy & Chart Fluency | Vocab + risk/horizon + statements + chart soft-gate | MVP | Planned |
| E5 | Interactive Decision Case Studies (News + Financials) | Decide→reveal; thin packs in P0; scale modes post-MVP | MVP (priority content) | After foundation |
| E6 | Dashboard Path Integration & Coach Surfaces | Home = active path + next action + coach tip | MVP | Planned |
| E7 | Practice Draw Completion | Draw-to-learn feedback | Later | Complete |
| E8 | Live/Delayed Market Data & Accounts | Real markets + sync | Later | Complete |
| E9 | Multi-Asset SAMPLE Expansion | Futures / options-context / crypto deepen / forex SAMPLE after equities | Market types | Complete |
| E10 | Market Learning Coverage | Navigator + news/statements drills + SAMPLE decide packs per market + Explorer path | Coverage | Complete |
| E11 | Step-by-step Coaching | Deterministic decision-tree wizard: fail → explain → rewind → succeed across topics | Coaching | Complete |

---

## Epic details

### E0. Planning & Decisions
- **Why:** Keep later milestones compatible
- **Includes:** This map, stories file, `.agents/state.json`, council report
- **Out of scope:** Product code

### E1. Equities Sample Universe
- **Goal:** Charts/cases use distinct equity instrument packs first; other asset classes after path fluency
- **Includes:** Catalog, pack schema, seed OHLC; stubs for future/option_context/crypto; Market browse/filter **post-MVP (E1.M2)**
- **Dependencies:** E0
- **Out of scope:** Live quotes, order books
- **Risks:** Options realism without becoming a pricing product — keep stubs quiet until E1.M2

### E2. Learning Milestone Planner (AI Context)
- **Goal:** Stable path model for users and coding agents
- **Includes (P0):** Beginner Equities template with contentRefs + unlock graph (no goal picker)
- **Includes (post-MVP):** Goal intake UI; Decision Maker template; path preview/switch
- **Dependencies:** Content IDs from E1/E4/E5 (E3.M1 seeds fixed IDs early)
- **Out of scope:** Social curriculum sharing, full LMS admin

### E3. Milestone Tracker & Progress Persistence
- **Goal:** Complete / active / locked with scores that unlock next steps
- **Includes:** `localStorage` store, path ID contract, unlock rules, Training/Case writeback, reset
- **Dependencies:** Fixed path IDs in E3.M1; E2.M1 fills template metadata without inventing new IDs
- **Out of scope:** Cloud sync, multi-device

### E4. Equities Literacy & Chart Fluency
- **Goal:** Stock vocabulary, risk/horizon, company snapshot reading, and chart language **before** graded cases
- **Includes:** Equities vocabulary quizzes; risk/horizon / investing-vs-trading beat; IS/BS/CF key lines & simple ratios; **E4.M0 chart soft-gate** (wire existing candle/indicator Training onto Beginner path)
- **Post-MVP:** E4.M3 richer TA / multi-asset drill expansion
- **Dependencies:** E1 packs
- **Out of scope:** Full accounting course; live options chains; cross-market as MVP headline

### E5. Interactive Decision Case Studies (News + Financials)
- **Goal:** Practice decision thinking: act, then see how the market resolved; apply literacy as theory-in-action
- **Mechanics:** Context → buy/sell/hold (**short soft-gated** until long/hold fluency or tip) → reveal → grade + process debrief
- **Packs / thinking modes:**
  - **P0 — Financials / earnings:** beat/miss, margins, cash-flow flags, guidance, balance-sheet stress (≥3–5 cases)
  - **P0 — Company news (thin):** momentum vs fade, simple company headlines (equity underlyings)
  - **Post-MVP — Macro:** risk-off, CPI/FOMC-style, geopolitics, sector rotation
  - **Post-MVP — Combined:** earnings + headline; filings + rumor
  - **Post-MVP — Scale:** ≥20 cases, difficulty tags, Decision Maker wiring
- **Dependencies:** E1 packs for aftermath charts; E3 for progress; E4.M0 before graded packs
- **Out of scope:** Live news paper trading; predicting future news; real-money execution
- **Risks:** Hindsight bias — debriefs teach process and theory application, not only direction

### E6. Dashboard Path Integration & Coach Surfaces
- **Goal:** Home screen shows real path, next CTA, coach tip for current milestone
- **Dependencies:** E3 unlock + enough E4/E5 content for a demo path
- **Out of scope:** Full chatbot panel v1

### E7. Practice Draw Completion *(Later)*
- Graded sketch vs pattern templates; optional link into milestones

### E8. Live/Delayed Data & Accounts *(Later)*
- Feed adapter, auth, cloud progress sync

### E9. Multi-Asset SAMPLE Expansion *(Market types)*
- **Goal:** After equities fluency, fill Market class slots retail learners recognize: futures, options-context, deeper crypto, forex—all SAMPLE
- **Retail naming:** Traditional daily stock market = **Equities (stocks)**; other classes are expansion, not a replacement Beginner path
- **Includes:** E9.M1 futures packs · E9.M2 options-context packs · E9.M3 crypto deepen · E9.M4 forex class + packs · E9.M5 thin cross-market literacy
- **Dependencies:** E1.M2 filter UI; later_order complete preferred
- **Out of scope:** LIVE chains, order routing, Greeks/pricing engine, paid FX/futures APIs for acceptance
- **Loop:** [`AGENTS_LOOP-Market-Types.md`](./AGENTS_LOOP-Market-Types.md) · queue `market_types_order`

### E10. Market Learning Coverage *(Coverage)*
- **Goal:** Easy navigation across market types; close gaps in **news literacy**, **statements drills**, and **learn-by-decision** SAMPLE cases for futures / forex / crypto / options-context
- **Includes:** E10.M1 Navigator · E10.M2 news quiz · E10.M3 financial drills · E10.M4 case `assetClass` · E10.M5–M7 decide packs · E10.M8 Market Explorer path · E10.M9 Dashboard CTAs + QA flows
- **Dependencies:** E9 packs exist; CasePlayer/E5 engine; chart soft-gate
- **Out of scope:** Brokerage order entry, LIVE news APIs, full accounting course, options Greeks
- **Loop:** [`AGENTS_LOOP-Market-Learning-Coverage.md`](./AGENTS_LOOP-Market-Learning-Coverage.md) · queue `market_learning_order`

### E11. Step-by-step Coaching *(Coaching)*
- **Goal:** Another way to learn **all curriculum topics** via a guided wizard: branch on choices, hit **wrong** nodes that explain mistakes, **rewind** to the decision that caused them, reach **success**, restart
- **Why not CasePlayer / QuizModal / LLM:** Cases are decide→reveal on OHLC; quizzes are MCQ; coach tips are one-liners. E11 is a **predefined decision graph** (content) + thin runtime (nav history / rewind / path trail). No runtime LLM, no external APIs mid-session
- **Where in code (planned):**
  - Content: `src/lib/coaching/sessions/*` (metadata + graph; Vite glob discovery)
  - Runtime: `src/lib/coaching/` — validate, list/load, navigate, path trail, persist adapter
  - UI: `/coach` catalog · `/coach/:slug` session view · terminal outcome styling · collapsible path trail
  - Entry: Dashboard **COACH** tile; optional deep-links from Training / Cases / Navigator by topic tags
- **Persistence:** Session nav state behind a replaceable adapter (prefer `sessionStorage` for tab-scoped refresh recovery); optional ProgressStore flags for completed session slugs (Dashboard tips)—not a second unlock graph
- **Includes:** E11.M1 schema+validate+sample · E11.M2 nav engine · E11.M3 catalog+session UI · E11.M4 persist+path visualizer · E11.M5 topic sessions+CTAs · E11.M6 tests+QA
- **Dependencies:** E10 complete (topics exist to coach); reuse Layout/terminal tokens; do not rewrite CasePlayer
- **Out of scope:** Cloud LLM coach; generating nodes at runtime; replacing Beginner path unlocks; LIVE data
- **Loop:** [`AGENTS_LOOP-Step-Coaching.md`](./AGENTS_LOOP-Step-Coaching.md) · queue `step_coaching_order`

---

## Coverage check

| Requirement | Epics |
|-------------|--------|
| Equities sample data | E1.M1 |
| Multi-market browse / cross-market | E1.M2, E4.M3 (post-MVP), **E9** |
| Candles + indicator lines | E4.M0 (+ existing Training); E4.M3 expands |
| Market-type literacy | E4.M1 (+ risk/horizon); **E9.M5** cross-market |
| Financial statement reading | E4.M2 (literacy), E5.M3 (application) |
| Decision case studies | E5 (thin P0 → scale post-MVP) |
| Milestone planner | E2.M1 P0; E2.M2 post-MVP |
| Milestone tracker | E3, E6 |
| Beginner equities-first | Curriculum order + P0 freeze |
| Practice Draw / live data | E7 / E8 Later |
| Futures / options-context / forex SAMPLE | **E9** |
| Navigate markets + news/statements drills + multi-market decisions | **E10** |
| Fail-and-learn step coaching (decision trees) | **E11** |

---

## Implementation order (milestones)

See [`IMPLEMENTATION_STORIES.md`](./IMPLEMENTATION_STORIES.md) for stories inside each milestone.

### P0 — MVP freeze (Beginner Equities Path playable)

```
E1.M1 → E3.M1 → E4.M1 → E4.M2 → E4.M0 (chart soft-gate)
  → E5.M1 → E5.M3 → E5.M2 (thin company news)
  → E2.M1 (thin) → E3.M2 → E6.M1
── MVP FREEZE: path complete credential ──
```

**Rationale:** Seed equities packs + path IDs → teach vocab, risk/horizon, statements, then chart language → case engine → apply theory in earnings then company-news cases → fixed path template → unlock + live dashboard. Freeze before volume so skill depth is earned after foundations work.

### Post-P0 — skill depth (many options & theory application)

```
E5.M2b (macro) → E5.M4 (combined) → E5.M5 (scale library) → E5.M6 (Decision Maker wiring)
  → E2.M2 (goal intake) → E4.M3 (richer TA / multi-asset drills) → E1.M2 (Market asset-class UI)
```

### Later — Practice Draw & data/accounts (`milestones.later_order`)

```
E7.M1 (draw + grade) → E7.M2 (path link)
  → E8.M1 (market data adapter mock/delayed) → E8.M2 (account shell) → E8.M3 (export/import + sync stub)
```

### Market types — multi-asset SAMPLE (`milestones.market_types_order`)

```
E9.M1 (futures packs) → E9.M2 (options-context packs) → E9.M3 (crypto deepen)
  → E9.M4 (forex class + packs) → E9.M5 (cross-market literacy bridge)
```

### Market learning coverage (`milestones.market_learning_order`)

```
E10.M1 (Navigator) → E10.M2 (news literacy) → E10.M3 (statements drills)
  → E10.M4 (case assetClass filter) → E10.M5 (futures cases) → E10.M6 (forex cases)
  → E10.M7 (crypto + options-context cases) → E10.M8 (Market Explorer path) → E10.M9 (CTAs + QA)
```

### Step coaching (`milestones.step_coaching_order`)

```
E11.M1 (schema + validate + sample) → E11.M2 (nav engine) → E11.M3 (catalog + session UI)
  → E11.M4 (persist + path visualizer) → E11.M5 (topic sessions + CTAs) → E11.M6 (tests + QA)
```

---

## Verification checklist

- [x] Epics are major capabilities (not single features)
- [x] Mandatory MVP items each map to ≥1 epic
- [x] Each epic can split into milestones/stories
- [x] Beginner learning order locked (chart gate before cases)
- [x] Financial statements covered (literacy + cases)
- [x] Case studies are priority content spine (E5)
- [x] Council Option A applied (literacy-then-cases + soft chart gate + MVP freeze)
- [x] User said **go** to start implementing E1.M1

---

## Agent notes

- Do **not** skip ahead of the P0 order without updating `.agents/state.json`
- Do **not** start post-P0 (E5.M4+, E2.M2, E4.M3, E1.M2) until MVP freeze criteria are met
- After post-P0, continue `later_order` (E7/E8) via `AGENTS_LOOP-Continue-Milestone.md` — prefer SAMPLE/mock/delayed over paid keys
- After later_order, continue `market_types_order` (E9) via `AGENTS_LOOP-Market-Types.md` or Continue-Milestone queue 4
- After E9, continue `market_learning_order` (E10) via `AGENTS_LOOP-Market-Learning-Coverage.md` or Continue-Milestone queue 5
- After E10, continue `step_coaching_order` (E11) via `AGENTS_LOOP-Step-Coaching.md` or Continue-Milestone queue 6
- Prefer equities content until Beginner Equities Path is playable end-to-end; traditional retail market type = Equities (stocks)
- When adding case studies, tag **thinking mode** and **context type** (`news` | `financials` | `combined`) for the planner
- Soft-gate `short` until literacy covers long vs short and a coach tip has been shown
- Process debriefs required on every case pack (theory application, not direction-only)
- E11 coaching sessions are content graphs only — never invent LLM replies or random branches at runtime
