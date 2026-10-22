# Interaction QA log

Append-only. Playwright flows on a temp dev server (port 3078), headless Chrome at 1280 and 390. Newest at the bottom. Times are America/Los_Angeles.

## 2026-10-22 interaction QA

| Flow | Result | Fix |
|---|---|---|
| Case decide → reveal (`/cases/case-news-chase-fade`, peek, BUY / HOLD, lock in) | Reveal, grade, locked buttons and stored `caseResults` correct; persists across reload; no console errors at 1280 / 390. Cases do not award points (by design: points come from Training quizzes). | — |
| Buy or Sell? drill (right and wrong answers, reveal, next) | Reveal explains the correct answer and why not the pick; header points / streak right (50 per correct, +10 streak bonus). **Bug:** points, streak and accuracy were never saved for Buy or Sell? (or any group without a path milestone, or any quiz closed early) — Training showed them, a reload reset to 0. | `recordQuizScore` saves after every answer; `progressStore.test.ts` |
| Learn quiz start → finish + answer sheet (Equities Literacy, 12 Q) | Answer sheet lists every question, jump opens the right item, Finish closes the modal; E4.M1 completes and E4.M2 unlocks; score/streak right at 1280 / 390. Note (unchanged, design call): finishing with 50% still completes the milestone, as there is no pass threshold. | — |
| Read the Print, all 22 rounds (call + bonus, alternate right / wrong-and-skip) | Score after every round matches `roundPoints` (3 per right+bonus, 0 per wrong); summary "33 / 66"; `22 played · best session 33` after reload; no errors. **Bug:** "Next round →" left the new round scrolled ~830px down at 390, into the old statement. | `scrollToTopOf` on next round |
| Mark the Band, 23 rounds (wraps 22 → 1) | Lock / Reveal disabled until filled, inputs lock, points match `gradeBand` (3/3 exact, 2/3 with a wrong low); no errors / overflow. | — |
| Macro Desk play, all 29 rounds | "x / y calls right" matches `scoreRound`; wrong calls show "you said…" + why-not; round ticks persist after reload. **Bug:** "Next round" kept the old scroll (~750px), so the next round opened mid-page. | `scrollToTopOf` in MacroPlay (next + jump select) |
| Any in-app navigation | **Bug:** BrowserRouter kept the scroll offset across routes (/training at 3000px → /cases opened at 3000px). | `ScrollToTop` (layout effect, skips first render and #hash links so Cases/Market focus scrolls still win); `scrollReset.test.ts` |
