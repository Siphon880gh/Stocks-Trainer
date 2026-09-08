# Resource types

A **resource** is a teaching unit the learner can open. Quizzes, step-by-step coaching, and playbooks are resources. So are case studies, chart packs, reference entries, practice labs, and financial snapshots.

**Not resources:** learning paths, Market Navigator, and the nav chrome. Those find or sequence resources.

All resources are SAMPLE / STYLIZED / educational. No LIVE / REAL_TIME theater, no brokerage, no options chain or Greeks.

On a playbook page, **Resource ·** is the credited YouTube or webpage. That outside source is one resource type. The playbook itself is another.

---

## Catalog

| Type | What the learner does | Route | Registry |
|------|------------------------|-------|----------|
| **Quiz** | Answer a multiple-choice bank (text, chart-pick, or snapshot) | `/training?group={id}` | `src/lib/quizData.ts` |
| **Step-by-step** | Walk a decision tree: wrong → explain → rewind → success | `/coach/:slug` | `src/lib/coaching/sessions/` |
| **Playbook** | Open a strategy kit that wires other resources to a source | `/playbooks/:id` | `src/lib/playbooks.ts` |
| **Case study** | BUY / SELL / HOLD (SHORT when allowed), then reveal the aftermath | `/cases/:caseId` | `src/lib/caseStudies.ts`, `src/lib/multiAssetCases.ts` |
| **Chart pack** | Read a SAMPLE OHLC tape with optional overlays | `/market` | `src/lib/samplePacks.ts`, `src/lib/markets.ts` |
| **Pattern** | Look up a candle or chart pattern | `/archive` Patterns | `src/lib/patterns.ts` |
| **Indicator** | Look up an overlay the chart can already draw | `/archive` Indicators | `src/lib/overlays.ts` |
| **Literacy term** | Look up a vocabulary card | `/archive` Literacy | `src/lib/literacyTerms.ts` |
| **Financial snapshot** | Read SAMPLE company numbers (revenue, cash, P/E, …) | Inside quizzes and cases | `src/lib/financialSnapshots.ts` |
| **Practice lab** | Grade a muscle-memory drill (draw, hunt, replay, …) | `/practice-draw`, `/practice/*` | `src/lib/practiceDraw.ts`, `src/lib/practiceLabs.ts` |
| **Outside source** | Open the original video or page a playbook teaches from | Link at top of `/playbooks/:id` | `Playbook.source` |

Path milestones point at resources with `contentRefs` such as `quiz:equity-literacy`, `glossary:literacy`, `snapshot:financial`, `pack:equity-sample`, `cases:earnings` (`src/lib/learningPaths.ts`).

---

## Quiz

Learn (`/training`) launches a **quiz group**. Finishing some groups writes path progress (for example Equities Literacy, Statements Literacy, Indicators). Others are extra drills.

**Question shapes**

- Text choices (definitions, process, literacy).
- Hero chart plus text choices (pattern / indicator identification).
- Chart-pick: the choices themselves are mini charts (`optionsAreCharts`).
- Optional **financial snapshot** card (`snapshotId`).
- Optional Archive deep-link (`glossaryTermId`).
- Optional overlay highlight (`overlayId`) or equity **chart pack** (`samplePackId`).

**Answer sheet** is not a separate type. It lists questions in the selected group so the learner can jump into that quiz at an index.

**Groups** live in `QUIZ_GROUPS`:

| Kind | Group ids |
|------|-----------|
| Path / literacy | `equity-literacy`, `financial-literacy`, `indicators` |
| Extra drills | `news-literacy`, `financial-drills` |
| Candle basics | `candle-anatomy` |
| Equity pack drills | `equity-patterns` |
| Pattern families | `hammer`, `doji`, `engulfing`, `all`, plus one group per pattern id |
| Multi-market literacy | `futures-literacy`, `forex-literacy`, `crypto-literacy`, `options-literacy` |

Indicators is the chart soft-gate: graded cases stay locked until that quiz is complete (a session peek does not save as path progress).

---

## Step-by-step

Coach (`/coach`, `/coach/:slug`) is a **deterministic decision graph** (no runtime LLM). Each session has `meta` (slug, title, summary, topic, tags) and a tree of nodes.

Outcomes:

- `continue` — next decision
- `wrong` — explanation plus `rewind_to` an earlier node
- `success` — session complete

Authoring: `.agents/skills/add-coaching-session/SKILL.md`. Register in `src/lib/coaching/sessions/index.ts`.

Playbooks attach a session with `coachSlug`.

---

## Playbook

Playbooks (`/playbooks`, `/playbooks/:id`) are **kits**. One row in `PLAYBOOKS` plus four collapsed panels:

1. **Strategy** — rule-set explanation (`explanation`)
2. **Coaching** — step-by-step (`coachSlug`)
3. **Case study** — decide-and-reveal (`caseId`)
4. **Chart look** — SAMPLE pack + overlays (`samplePackId`, `overlayIds`)

The original **outside source** is linked near the top (`source.url`, `source.kind` `youtube` | `webpage`, `source.label`). Do not bury that credit only inside Strategy text.

Create flow: paste a URL on `/playbooks` → copy the Cursor prompt (`src/lib/playbookPrompt.ts`) → append a `Playbook` and the content the panels already know how to show.

---

## Case study

Cases (`/cases`, `/cases/:caseId`) are **decide-and-reveal**. The learner sees a brief, optional headline and/or snapshot, and the pre-decision tape; locks in an action; then sees post-decision bars and a process debrief (not “price went up” only).

| Field | Role |
|-------|------|
| `contextType` | `news` · `financials` · `combined` |
| `thinkingMode` | Beat/miss, chase vs fade, risk-off, rumor vs filing, … |
| `correctActions` / `acceptablePartial` | Graded answers |
| `allowShort` | SHORT is hidden unless the story teaches short |
| `packId` | Library grouping |
| `assetClass` | Equity default; also futures / forex / crypto / options-context |
| `difficulty` | `beginner` · `intermediate` |

**Packs:** `earnings`, `company-news`, `macro-news`, `combined`, `futures`, `forex`, `crypto`, `options-context` (`CASE_PACKS`). Options-context cases teach the underlying around events — no chain, no Greeks.

Playbooks attach a case with `caseId`.

---

## Chart pack

A **sample pack** is a named SAMPLE OHLC series bound to an instrument (`id`, `symbol`, `assetClass`, `displayName`, `educationalNotes`). Charts (`/market`) browse packs by class. Quizzes, cases, and playbook Chart look reuse the same tapes.

**Asset classes:** `equity` · `future` · `forex` · `crypto` · `option_context`.

**Overlays the chart already draws** (`src/lib/overlays.ts`): `sma`, `ema`, `rsi`, `macd`, `bollinger`. Playbooks may only attach those ids.

Provider labels stay SAMPLE or DELAYED — never LIVE.

---

## Reference (Archive)

Three lookup resources on `/archive`:

| Type | Tab | What it is |
|------|-----|------------|
| **Pattern** | Patterns | Candle / chart pattern (`PATTERNS`). Optional SVG. Quizzes and Practice Draw reuse the same ids. |
| **Indicator** | Indicators | Overlay definition (`OVERLAYS`) matching what MarketChart can render. |
| **Literacy term** | Literacy | Glossary card (`LITERACY_TERMS`): name, category (`ownership` / `markets` / `position` / `process`), summary, detail. |

Quizzes deep-link terms with `glossaryTermId`. Flashcards reuse the literacy list automatically.

---

## Financial snapshot

A **snapshot** is a SAMPLE company card: income, balance sheet, cash flow, price, earnings (`FINANCIAL_SNAPSHOTS`). It is not a live filing.

It appears inside Statements Literacy / Statements Drills quizzes and inside earnings / combined cases (`statementSnapshot`). Paths refer to it as `snapshot:financial`.

---

## Practice lab

Learn → **Misc Practices** links these drills. Each is its own interaction; they share SAMPLE tapes and Archive ids.

| Lab | Route | Learner action |
|-----|-------|----------------|
| Drawing | `/practice-draw` | Sketch a candle template; coarse grade vs guides |
| Flashcards | `/practice/flashcards` | Flip literacy terms (Knew / Missed) |
| Label | `/practice/label` | Tap the named candle part (high, body, wick, …) |
| Trend vs range | `/practice/regime` | Classify the window, then pick a fitting overlay |
| Bar replay | `/practice/replay` | Wait or take a bias as bars appear; grade is process |
| Mark the plan | `/practice/plan` | Tap entry, then stop, then target |
| Pattern hunt | `/practice/hunt` | Mark the textbook bar; scanner runs after submit |
| Lookalikes | `/practice/lookalike` | Pick which of two tapes matches the prompt |
| Invalidation | `/practice/invalidation` | Tap the price that would cancel the idea |
| Support and resistance | `/practice/levels` | Tap the SAMPLE zone |

Hub list: `src/lib/miscPractices.ts`.

---

## How types combine

A teaching idea often shows up as several resources (see echo families in [`LOOPS/LOOP-Graph.md`](./LOOPS/LOOP-Graph.md)):

```text
Literacy term  →  Quiz  →  Step-by-step  →  Case study
Pattern        →  Quiz  →  Practice Draw / Hunt
Indicator      →  Quiz  →  Practice (regime)  →  Chart pack overlays
Chart pack     →  Quiz (equity-patterns)  →  Case tape  →  Playbook Chart look
Outside source →  Playbook  →  Strategy + Step-by-step + Case + Chart pack
```

Playbooks do not invent new panel chrome. They only wire resources that already exist (or that the create prompt authors into the existing registries).
