---
name: progress-sync
description: >-
  Export/import ProgressStore JSON and local-only sync stub. Use for E8.M3;
  never fake cloud sync success.
---

# Progress sync

## Source
`src/lib/progressSync.ts`

## API
- `exportProgressJson` / `downloadProgressExport`
- `importProgressJson` — schema check; corrupt → recovery message, store unchanged
- `getProgressSyncAdapter()` → `local_only` (`push`/`pull` stub)

## UI
Home **Account**: **Export**, **Import**, status **Saved on this device only · no cloud sync**.

## Rules
- No paid cloud. Status must stay local-only — no fake upload success.
- After changes: `npm run lint` && `npm run build`.
