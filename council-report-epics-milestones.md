# Council Deliberation: Epics & Milestones Appropriateness

**App:** Stock Trainer (ANALYSIS_CORE)  
**Date:** 2026-07-15  
**Primary learner:** Beginner picking up stocks  
**Process:** 12 agents (distinct personas) → peer grading → 3 options  
**Selected:** Option A (user: best teaching / skill & theory application)  
**Applied to:** `EPIC_MAP.md`, `IMPLEMENTATION_STORIES.md`, `.agents/state.json`

---

## Process

- 12 agents deployed with distinct approaches (Research, Pragmatic, Theoretical, Risk-Averse, Innovative, User-Centric, Systems, Resource-Constrained, Iterative, Standards, Skeptic, Synthesis)
- Peer grading completed by Council Convener
- 3 options synthesized for review

---

## Overall appropriateness verdict

**Conditionally appropriate.**

Epic inventory (E0–E8) matches beginner equities goals: packs, literacy, decide→reveal cases, progress, dashboard; draw/live deferred. The published 16-step critical path is **not MVP-sequenced**: chart fluency lands too late, unlock/dashboard too late, multi-asset naming conflicts with equities-first, and case scale / goal picker inflate P0 before a playable Beginner Equities Path exists.

---

## Grades (Convener)

| Agent | Knowledge | Strategy | Plan |
|-------|-----------|----------|------|
| 1 Research | 4 | 4 | 3 |
| 2 Pragmatic | 5 | 5 | 5 |
| 3 Theoretical | 5 | 4 | 3 |
| 4 Risk-Averse | 4 | 5 | 4 |
| 5 Innovative | 4 | 5 | 4 |
| 6 User-Centric | 4 | 5 | 4 |
| 7 Systems | 4 | 4 | 5 |
| 8 Resource | 4 | 4 | 5 |
| 9 Iterative | 3 | 4 | 4 |
| 10 Standards | 4 | 4 | 4 |
| 11 Skeptic | 5 | 5 | 4 |
| 12 Synthesis | 5 | 5 | 5 |

**Top scorers:** Pragmatic, Synthesis; Skeptic/Innovative for packaging dissent; Theoretical for competency model.

---

## Strongest elements (cross-agent)

1. Rename E1 equities-first; drop Cross-Market from E4 MVP name  
2. Chart fluency before cases — soft gate / wire existing TA (not late E4.M3)  
3. Soft-gate `short`; risk/horizon in literacy or debriefs  
4. MVP freeze after playable spine (not after ≥20 cases)  
5. Path ID / fixed Beginner Equities skeleton early in E3.M1  
6. Thin E5.M2 to company news first; macro later  
7. Credential before volume  
8. Cut from P0: E2.M2, E5.M4–M6 (or fold min wiring into E2.M1), E4.M3, E1.M2  
9. Case-as-vehicle as packaging alternative (Option B), not default  
10. Explicit thin content floors so cuts stay finite  

---

## Option A: Literacy-then-cases + soft chart gate + MVP freeze

**Summary:** Keep epic capabilities; fix names and order so beginners get vocabulary → financials → chart soft-gate → decide/reveal; freeze MVP before planner polish and case volume.

**Finalized epics**

| ID | Name | Role |
|----|------|------|
| E0 | Planning & Decisions | Done |
| E1 | Equities Sample Universe | Equity packs; multi-asset UI later |
| E2 | Learning Milestone Planner | Thin path model P0; goal intake post-P0 |
| E3 | Milestone Tracker & Progress | Path ID + progress early; unlock for MVP |
| E4 | Equities Literacy & Chart Fluency | Vocab, financials, chart soft-gate (wire existing TA) |
| E5 | Decision Case Studies | Engine + thin earnings + thin company-news |
| E6 | Dashboard & Coach Surfaces | Real next-action after unlock |
| E7 / E8 | Practice Draw / Live data | Later |

**P0 order**

```
E1.M1 → E3.M1 (path ID) → E4.M1 → E4.M2 → E4.M0/chart soft-gate
 → E5.M1 → E5.M3 (thin, ≥3–5) → E5.M2thin (company news)
 → E2.M1thin → E3.M2 → E6.M1
── MVP FREEZE ──
```

**Post-P0:** E2.M2 · E5.M4 · E5.M5 · E5.M6 · E4.M3 · E1.M2 · macro slice of E5.M2

**Trade-offs:** Best pedagogy alignment; slower to first “fun” cases; soft gate can feel like homework if quizzes are thick.

**Best when:** Curriculum credibility matters; one clear spine for agents to implement.

---

## Option B: Case-as-vehicle / JIT literacy

**Summary:** Epics are backends; user spine is missions/cases. Literacy and financials unlock JIT inside packs; chart primer is soft in-case. Credential early; volume later.

**P0 order**

```
E1.M1 → E3.M1 → E5.M1 → E4.chart soft primer
 → E5.M3 (earnings; JIT financials) → E4.M1 lite → E6 skeleton
 → E5.M2thin → E3.M2 → E2.M1thin → E6.M1 polish
── MVP FREEZE ──
```

**Trade-offs:** Higher engagement; risk of shallow foundations; requires rewriting published learning order.

**Best when:** Retention is the bottleneck; content authors can teach inside debriefs.

---

## Option C: Ultra-minimal P0 + earliest dashboard

**Summary:** Smallest playable loop with home progress ASAP. Soft in-case chart primer (no hard gate). Cut planner UI, case scale, multi-asset from critical path.

**P0 order (~11 steps)**

```
E1.M1 → E3.M1 → E6.skeleton → E4.M1 → E4.M2thin
 → E5.M1 → E5.M3 (2–3) → soft chart primer in first case
 → E5.M2thin? → E2.M1thin → E3.M2 → E6.M1
── MVP FREEZE ──
```

**Trade-offs:** Fastest vertical slice; weakest “serious education” proof; early dashboard may show empty states.

**Best when:** Need a shippable loop this week before content depth.

---

## Recommendation

**Option A** — default finalize for the stated primary learner and equities-first principle.

- Choose **C** if the immediate goal is a vertical slice / dashboard proof before depth.  
- Choose **B** only if beginner learning order is explicitly re-locked to case-led packaging.

### Apply-to-docs checklist (Option A)

1. Rename E1 → Equities Sample Universe; E4 → Equities Literacy & Chart Fluency  
2. Insert E4.M0 / chart soft-gate (wire existing TA) after E4.M2, before E5 packs  
3. Soft-gate `short`; add risk/horizon beat in E4 or debriefs  
4. Demote from P0: E2.M2, E5.M4, E5.M5, E5.M6, E4.M3, E1.M2  
5. MVP freeze after thin earnings + unlock + dashboard  
6. Keep E7/E8 Later  

---

## Intended users & goals (fit check)

| User / need | Fit after Option A |
|-------------|-------------------|
| Self-taught retail beginner | Strong — structured path + decide→reveal |
| CS / quant-curious | Strong — quizzes + charts + accuracy |
| Options/futures curious | Deferred correctly to post-path |
| Clear what next | Improved — unlock + dashboard in P0 |
| Persisted progress | Kept — E3 early |
| Serious education, not casino | Improved — soft-gate short; process debriefs; freeze before volume |
| Path as credential | Improved — credential before case farm |

---

*Companion docs to update after option selection: `EPIC_MAP.md`, `IMPLEMENTATION_STORIES.md`, `.agents/state.json`*
