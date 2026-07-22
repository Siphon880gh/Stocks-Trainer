---
name: progress-store
description: >-
  Read/write learner ProgressStore (pathId, milestone statuses, scores, streaks)
  in localStorage. Use for E3 progress, unlock writeback, and Dashboard path UI.
---

# ProgressStore

## Source
`src/lib/progressStore.ts`

## API
- `loadProgress()` → `{ state, recovered, recoveryMessage? }` (corrupt/outdated → reset + message)
- `saveProgress(state)` / `resetProgress()`
- `getPathId` / `setPathId`
- `getMilestoneStatus` / `setMilestoneStatus`
- `getScores` / `setScores` / `getStreaks` / `setStreaks`
- `LocalAccount` / `signInLocal` / `signOutLocal` / `setDisplayName` / `isSignedInLocal` (E8.M2)
- Export/import/sync stub: see `.agents/skills/progress-sync/SKILL.md` (E8.M3)

## Frozen Beginner Equities IDs
- pathId: `beginner-equities`
- milestones: `E4.M1` → `E4.M2` → `E4.M0` → `E5.M3` → `E5.M2`

## Rules
- Do not rename IDs without a schemaVersion bump + migration/reset.
- After API changes: `npm run lint` && `npm run build`.
- Wire at least one UI consumer (Dashboard) so round-trip is exercised.
