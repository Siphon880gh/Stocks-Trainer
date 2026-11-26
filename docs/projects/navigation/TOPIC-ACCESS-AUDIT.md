# Topic access audit after the navigation redesign (TS-5)

- **When:** 2026-11-25.
- **Baseline:** `docs/NAVIGATION-INVENTORY.md` at commit `536eeb5`, before the directional navigation, level tabs, Browse everything and the popup. Its ids are frozen in `docs/projects/navigation/topic-baseline-536eeb5.json`.
- **Now:** the app at the end of the TS-4 design fixes.

**Result: nothing was lost.** All 2343 baseline items across 34 areas still exist, and every one has a click path from the current navigation. No restore commits were needed.

## How it was checked

- **Mechanical:** `src/lib/topicAccess.test.tsx`, which runs in `npm run verify` through `test:lib`.
  - **Existence:** for every area, the current data ids (or App routes) must include every baseline id.
  - **Reachable set:** every href a user can click from the current navigation, 1841 links in all. It is built from:
    - the header tabs, plus every item in the Learn, Practice and Trade level-tab menus (all tabs)
    - the For your path steps of every track
    - every Browse everything section link
    - every Browse search hit, kept only if searching its own label actually returns it
    - every progress map stage
    - the links rendered on the hub pages those lead to:
      - Training (TOC), Academy, the options ladder, the paper hub, desk and challenges
      - Cases and each pack
      - Coach and each market class, with the peek switch on
      - Playbooks, Tools, Macro, Map
      - every Library tab, Technique narratives and Pattern themes
  - **Reachable:**
    - Link-addressed items need their exact URL in that set.
    - Items shown inside a hub need the hub reachable and their name rendered there: desk scenarios and topics, option strategies, indicators, narratives, pattern themes, map regions.
    - Map stages need `/map` reachable and their target resolving to an App route.
    - Macro rounds need `/macro/play` reachable.
    - Learning paths need a track that sets the path.
    - Deep-link kinds need the reading page to still parse the parameter.
  - `TOPIC_AUDIT_OUT=<file>` writes the per-area numbers below.
- **Browser spot checks:** the e2e flow "Topic access: one sample per area and one deep link per kind still open after the redesign", at 390 and 1280 px.
  - It opens one URL for each of the 31 baseline deep-link kinds. Each must keep its path and render a heading or dialog, and each `?sim=` link must open its simulation.
  - It opens one sample for each area: a unit, a test-out, the options ladder, the paper hub and desk, a challenge, the last case, the last coach session, a playbook, a macro lesson, the last glossary term, narratives, a market theme, a tool lesson, the map, two labs and `/practice-draw`.
  - It runs Browse search for a quiz, a coach session, a case, a pattern and a glossary term, and checks each result link.

## Per-area counts

The "Current total" column is the size of the current list where it is a plain list. A dash means the area is a set of routes or pairs, so it is not counted separately.

| Area | Baseline | Still exist | Reachable | Current total | Example click path |
|---|---|---|---|---|---|
| Routes | 73 | 73 | 73 | 74 | Header tabs, level-tab menus, Browse everything sections, For your path steps and Map stages (first hit per route is in the test output) |
| Quiz groups | 107 | 107 | 107 | 107 | Header › Browse everything › search the quiz name (kind "Quiz") → /training?group=<id>; also the TOC quiz panel and For your path steps |
| Practice labs | 46 | 46 | 46 | — | Header › Practice › beginner tab › Japanese candlesticks |
| Practice items | 45 | 45 | 45 | 45 | Header › Practice › beginner tab › Japanese candlesticks |
| Tool training pages | 10 | 10 | 10 | — | Header › Learn › advanced tab › Tool Training |
| Tool lessons | 8 | 8 | 8 | 8 | Header › Learn › advanced tab › Market Forces |
| Academy levels (test-outs) | 8 | 8 | 8 | 8 | Header › Browse everything › Academy level test-outs › L0 Orientation test-out → /academy/test-out/L0 |
| Academy units | 45 | 45 | 45 | 45 | Header › Browse everything › search "What a market is" (Academy lesson) → /academy/l0-what-is-a-market |
| Test-outs | 8 | 8 | 8 | 8 | Header › Browse everything › Academy level test-outs › L0 Orientation test-out → /academy/test-out/L0 |
| Option strategies | 13 | 13 | 13 | 13 | Header › Learn › advanced tab › Options ladder → level card (unlocks after the level before) |
| Option ladder levels | 4 | 4 | 4 | 4 | Header › Learn › advanced tab › Options ladder → level section |
| Challenges | 10 | 10 | 10 | 10 | Header › Browse everything › Paper challenges › Buy below the market → /paper/challenges/limit-below-market |
| Desk scenarios | 30 | 30 | 30 | 30 | Header › Trade › advanced tab › Paper desk → scenario picker |
| Desk topics | 11 | 11 | 11 | 11 | Header › Trade › advanced tab › Paper desk → topic filter |
| Case packs | 17 | 17 | 17 | 17 | Header › Trade › beginner tab › Earnings cases → /cases?pack=earnings |
| Cases | 517 | 517 | 517 | 517 | Header › Browse everything › search "Earnings miss at a big tech company" (Case) → /cases/case-earn-beat-miss |
| Coach sessions | 99 | 99 | 99 | 99 | Header › Browse everything › search "Crops, fertilizer and tractors" (Coach session) → /coach/agriculture-wrappers |
| Coach sessions under a non-equity class | 96 | 96 | 96 | — | Header › Browse everything › Coach by market › Coach: <class> → /coach?class=<class> (peek switch opens the gated list, unchanged since the baseline) |
| Playbooks | 20 | 20 | 20 | 20 | Home › For your path (Active and day trading) › Playbook: Opening range context and confirmation → /playbooks/orb-context-confirmation |
| Macro lessons | 18 | 18 | 18 | 18 | Header › Browse everything › Macro lessons › The jobs report (Employment Situation) → /macro/employment-situation |
| Macro rounds | 29 | 29 | 29 | 29 | Header › Trade › intermediate tab › Macro play → /macro/play |
| Macro terms | 50 | 50 | 50 | — | Header › Browse everything › search the term (kind "Glossary") → /archive?tab=literacy&open=<id> |
| Patterns | 158 | 158 | 158 | 158 | Header › Browse everything › search "Doji" (Pattern) → /archive?tab=patterns&open=doji |
| Indicators | 5 | 5 | 5 | 5 | Header › Learn › intermediate tab › Indicator cards → Indicators tab |
| Glossary terms | 613 | 613 | 613 | 613 | Header › Browse everything › search "Stock / Share" (Glossary) → /archive?tab=literacy&open=stock-share |
| Market themes | 10 | 10 | 10 | — | Header › Practice › intermediate tab › Same theme, different wrapper: stocks, funds and futures |
| Narratives | 6 | 6 | 6 | 6 | Header › Practice › intermediate tab › Technique narratives → narrative picker |
| Pattern themes | 17 | 17 | 17 | 17 | Header › Practice › beginner tab › Pattern themes → theme list |
| Simulation set pages | 25 | 25 | 25 | — | Header › Browse everything › search the unit, macro lesson or theme name → page → ?sim=<id> trigger |
| Learning paths | 3 | 3 | 3 | 3 | Home › path picker › New to stocks |
| Map regions | 12 | 12 | 12 | 12 | Header › Map → region |
| Map stages | 179 | 179 | 179 | 180 | Header › Map → stage |
| TOC groups and aliases | 20 | 20 | 20 | — | Header › Learn › beginner tab › Table of Contents |
| Deep-link kinds | 31 | 31 | 31 | — | Each kind's reader still parses the parameter; e2e opens one URL per kind |

## Losses found and restored

None. The first test run reported gaps, but each was a bug in the test, not a loss:
- The baseline coach records were compared as objects.
- Tool lessons were addressed by id instead of route.
- The options ladder was rendered without unlocking.
- Coach class lists were rendered without the peek switch.

All four were fixed in the test before it was committed.

## Intentional changes (access kept)

| Baseline | Now | Access |
|---|---|---|
| GoalPicker on Home: 3 path templates, shown once until confirmed | TrackPicker ("Pick a path" in the header, and on first visit). Each track sets its `pathId` on the first pick (`confirmPathSelection`), with the same one-time semantics. | All 3 learning paths are set by at least one track. |
| Full ProgressMap embedded on Home | ProgressMapCard on Home, with the full map at `/map` (header tab "Map") | All 12 regions and 179 stages are on `/map`. |
| Flat menus | Level tabs (Beginner, Intermediate, Advanced, Your path) inside the Learn, Practice and Trade dropdowns, each with a Browse everything footer | Every former menu target is still reachable; see the Routes and Practice labs rows. |
| Open-in-new-tab switch on Browse (t79u) | Links open in a dismissible popup over Browse (t83u), with "Open full page" | Same targets; the popup URL is the page's own. |
| Duplicate start links on top of Browse | Start points section only | The same links are still there. |
| About 90 always-visible section chips on `/academy` | "All sections (N)" disclosure | One click away; Browse everything also lists them. |
| — | New route `/browse` (Browse everything) | Added, not removed: 73 baseline routes → 74 now. |

`docs/NAVIGATION-INVENTORY.md` was not regenerated in this pass, because the TS-4 fixes changed no nav data. Its own test (`navInventory`) still passes.
