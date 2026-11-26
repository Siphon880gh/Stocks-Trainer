⚠️ DEGRADED: single-context (no sub-agent tool). The critique and the audit ran in one context, so the independent-reviewer pass was not available.
Questions skipped: there was no channel to ask Weng mid-run; the design context comes from `.impeccable.md` (light brokerage tape: calm, exact, desk-like; sentence case; no CRT, monospace-as-personality or SNAKE_CASE).

# Impeccable audit and critique (TS-4, part 1)

- **When:** 2026-11-25, starting at commit `46d191c`.
- **Skill:** Impeccable (critique, audit and craft-floor references). The Skill tool did not list it, so its SKILL.md and references were read straight from the installed plugin. The detector ran through `scripts/impeccable detect --json src`.
- **Launcher context:** `NO_PRODUCT_MD`, `SCOPED_EXISTING_ALLOWED`, so this is a narrow refinement pass on an existing product. There was no rebrand, no new dependencies and no motion or 3D.
- **Surfaces:**
  - The redesigned surfaces: header level-tab dropdowns, the path picker, Next up, Home, and Browse everything with its popup.
  - The key pages: Training (TOC), Academy, a practice lab (`/practice/levels`), the paper desk and the Library (`/archive`).
  - Each was captured at 1280 and 390 px.
- **Screenshots:**
  - Before: `/workspace/checkpoints/qa/design-before-*.png` (24 files).
  - After: `/workspace/checkpoints/qa/design-after-*.png` (24 files).
  - Names follow `{home-new, home-track, picker, menu-practice, menu-learn-path, browse, browse-popup, training, academy, lab, desk, archive}-{1280,390}`.

## Audit health score

| Dimension | Before | After | Notes |
|---|---|---|---|
| Accessibility | 2/4 | 3/4 | Muted text failed AA (4.22:1 on white, 3.87:1 on canvas); it now passes (5.31 / 4.87). Home had no visible h1. Tab focus ring was missing. Header targets are still 29–36 px (they pass 2.5.8 at 24 px but are under 44 px). |
| Performance | 3/4 | 3/4 | No change was needed. There was no layout shift in the shots and no new assets. |
| Theming / tokens | 3/4 | 4/4 | The Library's terminal costume (font-mono, uppercase, `/ root`, SNAKE_CASE) went against the design context. The simulation side stripe was replaced. The detector went from 2 findings to 0. |
| Responsive | 2/4 | 3/4 | The Library tab and filter rows clipped behind a hidden scrollbar at 390 px; they now wrap. Browse links are 28 px tall targets. |
| Anti-patterns / craft floor | 2/4 | 3/4 | Fixed: the eyebrow over the Next up heading, the 90-chip wall on Academy, the duplicate link row on Browse, and a rounded tab with a thick bottom border. |
| **Total** | **12/20** | **16/20** | |

## Critique (Nielsen heuristics, 0–4)

| Heuristic | Score | Evidence |
|---|---|---|
| Visibility of system status | 3 | Next up shows "Your path · 0 of 15 steps done". Menus mark the active tab. |
| Match with the real world | 3 | Plain market words. Before the fix, the Library used `BULLISH_PATTERN` and `CONFIRMATION:`; it now reads "Bullish pattern · Confirmation: …". |
| User control and freedom | 4 | The Browse popup closes by X, backdrop and Escape, and focus returns to the link. The path can be changed at any time. |
| Consistency and standards | 3 | The Library was the outlier (uppercase, mono, root paths); it now matches the rest of the app. |
| Error prevention | 3 | Locked levels and gates explain what opens them. |
| Recognition over recall | 3 | Filters are visible instead of scrolled away. Search spans the whole catalog. |
| Flexibility and efficiency | 3 | Browse search, deep links and level tabs all work. |
| Aesthetic and minimalist design | 2 → 3 | The Academy chip wall is now folded away, and the duplicate Browse row is gone. Home still stacks several cards (deferred). |
| Help users recover from errors | 3 | Quiz feedback and gates include their next action. |
| Help and documentation | 3 | Glossary ⓘ beside terms, plus the AI helper. |

## Findings

| # | Sev | Finding | Where | Status |
|---|---|---|---|---|
| 1 | P1 | The muted token `#787b86` was 4.22:1 on white and 3.87:1 on canvas, which is under AA for body-size text. | `src/index.css` | **Fixed** `3c14a30`. Muted is now `#686b76` (5.31 / 4.87). Charts keep their own grey. |
| 2 | P1 | Academy opened with about 90 section chips above the lessons, a wall of equal-weight links. | `AppSectionNav` on `/academy` | **Fixed** `f8175d6`. The chips are inside a closed "All sections (N)" disclosure. |
| 3 | P2 | The Library wore a terminal costume: uppercase tracked labels, `Pattern Library / root`, `> BULLISH_PATTERN`, mono badges and a low-contrast "Total". | `src/pages/Archive.tsx` | **Fixed** `c2115b1`. Sentence-case labels, a real h2 per tab, readable type lines and the muted token. |
| 4 | P2 | Home had no visible page title; the value promise sat alone above the cards. | `Dashboard` | **Fixed** `5f302d4`. A visible h1, "Learn to read stocks and charts", sits above the promise. The milestone h1 became an h2. |
| 5 | P2 | At 390 px the Library tab and filter rows clipped behind a hidden scrollbar, so the options were invisible. | `Archive` filters | **Fixed** `72ced65`. The rows wrap. |
| 6 | P2 | Browse links were 18–20 px tall with heavy underlines, so the dense lists read as a wall of rules and were hard to tap. | `BrowseEverything` | **Fixed** `ecc3e84` (soft underline) and `284c09a` (28 px targets). |
| 7 | P3 | Craft floor: a "Your path" eyebrow sat above the Next up heading. | `NextUpCard` | **Fixed** `e3f0109`. It is carried in the progress line, and screen readers still hear "Your path:". |
| 8 | P3 | Detector `border-accent-on-rounded`: tabs were rounded-top with a thick bottom border, and had no visible focus ring. | `NavTabsMenu` | **Fixed** `74ca01e`. Square underline, larger tap area, focus ring. |
| 9 | P3 | Detector `side-tab`: the simulation's "Why we are doing this" panel used a 4 px side stripe and uppercase labels. | `Simulation.tsx` | **Fixed** `8ccdd18`. A light tinted box with sentence-case labels. |
| 10 | P2 | Header controls are 29–36 px tall at 390 px. They pass WCAG 2.5.8 (24 px) but are under the 44 px comfort target. | `AppChrome` | **Deferred.** Raising them makes the two-row phone header taller, which is a layout decision for Weng. |
| 11 | P2 | 10–11 px meta text is widespread (badges, captions, chart labels). | many | **Deferred.** It is an app-wide type-scale change and needs its own pass so the screens can be checked one by one. |
| 12 | P3 | With a track picked, Home stacks four or more cards (Next up, Today, points, map card, milestones). | `Dashboard` | **Deferred.** This is structural; it belongs with the next Home iteration. |
| 13 | P3 | The paper desk SIMULATED banner uses the sim purple. | `/paper/desk` | **Kept on purpose.** Purple is the app's reserved "simulated" signal. |

## Detector

- Before: 2 findings, `border-accent-on-rounded` (NavTabsMenu) and `side-tab` (Simulation.tsx).
- After: **0 findings**.

## Checks

- Measured in Chrome at 390 px: no unnamed controls, every image has alt text, one h1 per page and no horizontal overflow.
- `npm run verify` and the full `npm run test:e2e` pass. The counts are in the final report for this change set.
