# Design audit (comprehensive-design skill, TS-4 part 2)

This pass followed `templates/AUDIT.md`, the original 20 UX laws and the design heuristics. It ran after the Impeccable pass (`IMPECCABLE-AUDIT.md`), starting from commit `46d191c`.

## Scope, audience and evidence

- **Scope:** the directional navigation and the key learning pages:
  - Header level-tab dropdowns, the path picker, Next up, Home, and Browse everything with its popup.
  - Training (TOC), Academy, a practice lab (`/practice/levels`), the paper desk and the Library (`/archive`).
- **Audience:** self-directed learners on three kinds of path (new to stocks, chart reader, market explorer), plus people who want to see everything at once.
- **Tasks:**
  - Pick a path and take the next step.
  - Find any topic.
  - Return to where you left off.
  - Open a lesson from Browse without losing your place.
- **Environment:** Chrome at 1280×900 and 390×900 (mobile emulation, touch). Light theme only. English only.
- **Evidence:**
  - Before and after screenshots in `/workspace/checkpoints/qa/design-{before,after}-*.png`.
  - Measurements in Chrome: target sizes, contrast ratios, the heading outline and overflow.
  - The Impeccable detector output.
- **Assumptions:** there was no user research in this pass. Severity is judged from task impact on the surfaces above.

## Findings

| Severity | Observed issue / reproduction | Level / UX law | Proposed change | Validation | Status |
|---|---|---|---|---|---|
| P1 | Muted text measured 4.22:1 on white and 3.87:1 on canvas, below AA for 12–13 px copy. It is used for blurbs, counts and helper text everywhere. | Accessibility floor; aesthetic-usability effect | Darken the muted token to `#686b76`. | Measured 5.31:1 on white and 4.87:1 on canvas. | Fixed `3c14a30` |
| P1 | `/academy` opened with about 90 equal-weight section chips before the first lesson. | Hick's law, cognitive load, progressive disclosure | Put the chips in a closed "All sections (N)" disclosure so the lesson list comes first. | Before/after `academy-*`. | Fixed `f8175d6` |
| P2 | Browse everything listed the start points twice: a top link row and the Start points section. | Occam's razor, Hick's law | Remove the top row and keep the TOC test id on the section's link. | e2e Browse flow: 98 checks, 0 failed. | Fixed `1230a0e` |
| P2 | A first-time visitor on the path picker sees equal cards and no recommended default. | Default effect, paradox of the active user | Add "Not sure? Start with New to stocks." without preselecting anything. | Before/after `picker-*`. | Fixed `229263c` |
| P2 | At 390 px the Library tab and filter rows scrolled sideways behind a hidden scrollbar, so options like Literacy and Neutral were out of sight. | Recognition over recall, Fitts's law | Wrap the rows. | Before/after `archive-390`. | Fixed `72ced65` |
| P2 | Browse links were 18–20 px tall with full-strength underlines, which made tapping hard and the lists hard to scan. | Fitts's law, law of proximity, aesthetic-usability | Use 28 px tall link targets, a softer underline that turns full on hover, and tighter list gaps. | Measured 28 px. Before/after `browse-*`. | Fixed `ecc3e84`, `284c09a` |
| P2 | The Library's terminal costume (uppercase, mono, `/ root`, SNAKE_CASE) broke the app's sentence-case voice. | Jakob's law, law of similarity | Use sentence-case labels and one h2 per tab. | Before/after `archive-*`. | Fixed `c2115b1` |
| P2 | Home had no visible title. | Serial position effect, von Restorff | Add a visible h1 above the promise. | Before/after `home-*`. | Fixed `5f302d4` |
| P3 | The eyebrow above the Next up heading duplicated the card's purpose. | Law of Prägnanz | Carry "Your path" in the progress line instead. | Before/after `home-track-*`. | Fixed `e3f0109` |
| P3 | The dropdown level tabs had a rounded top with a thick underline and no focus ring. | Law of common region; keyboard floor | Square underline, larger padding, `focus-visible` ring. | Before/after `menu-*`. | Fixed `74ca01e` |
| P3 | The simulation's why panel used a thick side stripe and uppercase labels. | Law of similarity | Light tinted box, sentence-case labels. | Detector shows 0 findings. | Fixed `8ccdd18` |
| P2 | Links inside the Browse popup navigate the whole popup rather than nesting. | Doherty threshold, peak-end rule | Keep the current behaviour; "Open full page" is explicit. | n/a | Deferred: it is the agreed popup behaviour (t83u). Changing it needs Weng's call. |
| P2 | Header controls are 29–36 px tall on phones. | Fitts's law, Jakob's law (logo goes home) | Make them 44×44 px below md, with the logo standing in for Home on phones. | Measured every control at 44×44 or larger at 390 px; the desktop header is 57 px; there's no overflow. An e2e flow checks this. | Fixed `b7b7f32`, `4ae2227` |
| P2 | 10–11 px text is widespread. | Cognitive load, aesthetic-usability | Set a 12 px meta floor (the `text-xs` token in `index.css`), with 13 px secondary and 14 px and up for body. | No `text-[9–11px]` is left in `src`. The full e2e overflow checks pass at 390 px. | Fixed `ebd209f`, `b30c2cc` |
| P3 | Home with a picked track stacks four or more cards. | Hick's law, von Restorff | Make Next up the one filled action, fold the placement check, Today and map into a closed "More for today" section, and outline the milestone Continue button. | A render test asserts one filled action outside the fold. Before/after `deferred-after-home-track-*`. | Fixed `35d3859` |
| P3 | The first-visit picker uses same-size cards. | Law of similarity | None. | n/a | Kept: equal weight suits a choice between paths |
| P3 | The paper desk SIMULATED banner is purple. | Von Restorff | None. | n/a | Kept: purple is the reserved "simulated" signal |

## Checklist

- [x] Page purpose and pattern selection. Home is a dashboard, Browse is an index, and the picker is a choice list. The pattern fits each.
- [x] Framing, section rhythm, hierarchy, typography and brand. Every surface has a visible h1, the Library matches the rest of the app, and the design context in `.impeccable.md` is updated for the muted token.
- [x] Original 20 UX laws considered. The relevant ones are cited per row above; none of the motion-specific ones apply.
- [x] Copy and error, empty, loading and success states. Copy is in sentence case. The gates explain how to open them. The quiz and simulation end states are unchanged.
- [x] Keyboard, focus, semantics, contrast, targets and reflow:
  - The tab focus ring is added and contrast meets AA.
  - Browse targets are 28 px.
  - There's no horizontal overflow at 390 px.
  - Header targets are 44 px on phones, and there's no text under 12 px.
- [x] Responsive and localization checks. Screens were checked at 390 and 1280 px; the filter rows wrap. Localization was not tested (English only).
- [x] Motion and 3D. None added, so no reduced-motion fallback is needed.
- [x] Performance, reliability and privacy. There are no new dependencies or assets, no data or storage changes, and functionality is unchanged.

## Checks run and results

- Screens: 24 before and 24 after screenshots, with the changed pages compared side by side.
- Contrast: the muted token now measures 5.31:1 on white and 4.87:1 on canvas.
- Targets: Browse links are 28 px.
- Overflow: none at 390 px.
- Impeccable detector: 0 findings, down from 2.
- `npm run verify` and the full `npm run test:e2e` pass with 0 failures; the counts are in the change-set report.

## Not tested and limitations

- No moderated user testing.
- No screen-reader run beyond the semantic checks (names, alt text and the heading outline).
- Dark mode isn't part of the product.
- RTL and long translations were not checked.

## Next actions

1. Watch whether people open "More for today". If the daily review is missed, show a one-line Today summary in its label.
2. Consider moving the 13 px secondary copy on reading-heavy pages up to 14 px.
