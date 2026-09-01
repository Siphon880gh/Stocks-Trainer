---
name: practice-draw-grade
description: >-
  Practice Draw canvas (pointer strokes), template guides, coarse Jaccard grade,
  and last-attempt persistence. Use for E7 Practice Draw stories.
---

# Practice Draw

## Sources
- `src/lib/practiceDraw.ts` — templates (`doji`/`hammer`/`bullish-engulfing`/`bearish-engulfing`; legacy `engulfing` aliases bullish), `gradeSketch`, `loadLastDrawAttempt` / `saveLastDrawAttempt`
- `src/pages/PracticeDraw.tsx` — canvas UI (undo/clear/submit + template picker)
- Storage key: `analysis_core_practice_draw_v1` (dedicated; not ProgressStore schema)

## Acceptance map
- E7.M1.S1 — drawable canvas + clear/undo
- E7.M1.S2 — template picker with dashed guide silhouette
- E7.M1.S3 — submit → correct/partial/incorrect + tip
- E7.M1.S4 — last attempt survives refresh via dedicated key
- E7.M2.S1 — Dashboard + Training links; `?template=` / `?contentRef=` deep link
- E7.M2.S2 — graded submit writeback via `practiceDrawTipLine` / DONE badge on Dashboard

## Rules
- Keep coords normalized 0–1 so resize does not warp strokes.
- Prefer extending `DRAW_TEMPLATES` over hardcoding shapes in the page.
- After changes: `npm run lint` && `npm run build`.
