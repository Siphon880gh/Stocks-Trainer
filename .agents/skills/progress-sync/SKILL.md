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
- `getProgressSyncAdapter()` → `SYNC_STUB / LOCAL_ONLY` (`push`/`pull` stub)

## UI
Dashboard ACCOUNT_SHELL: EXPORT_PROGRESS, IMPORT_PROGRESS, sync status label.

## Rules
- No paid cloud. Status must say stub / local only.
- After changes: `npm run lint` && `npm run build`.
